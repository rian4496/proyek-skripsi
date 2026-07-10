"""
app.py — FastAPI RAG Backend untuk Chatbot Kampus UNISKA MAB
Jalankan: uvicorn app:app --host 0.0.0.0 --port 8001 --reload
"""

import os, glob, hashlib, logging, re
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_community.document_loaders import PDFPlumberLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL     = os.getenv("EMBED_MODEL", "nomic-embed-text")

# --- OPSI ENGINE LLM UNTUK FASTAPI RAG ---
# LLM_PROVIDER: "ollama" (Lokal Qwen 2.5) atau "openrouter" (Cloud gpt-oss-120b:free)
LLM_PROVIDER        = os.getenv("LLM_PROVIDER", "openrouter")
OLLAMA_LLM_MODEL    = os.getenv("LLM_MODEL", "qwen2.5:7b")
OPENROUTER_API_KEY  = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL    = os.getenv("OPENROUTER_MODEL", "openai/gpt-oss-120b:free")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

DATA_FOLDER     = "./data"
HASH_FILE       = ".pdf_index_hash"
CHUNK_SIZE      = 1000
CHUNK_OVERLAP   = 250
RETRIEVER_TOP_K = 12

logging.basicConfig(level=logging.INFO, format="%(asctime)s │ %(levelname)-8s │ %(message)s", datefmt="%H:%M:%S")
log = logging.getLogger(__name__)


class ChatRequest(BaseModel):
    chatInput: str
    sessionId: str = "default"

class ChatResponse(BaseModel):
    output: str
    sessionId: str
    is_rag_found: bool


_state: dict = {"vector_store": None, "qa_chain": None}


def _get_pdf_fingerprint(paths: list[str]) -> str:
    h = hashlib.md5()
    for p in sorted(paths):
        s = os.stat(p)
        h.update(f"{p}|{s.st_size}|{s.st_mtime}".encode())
    return h.hexdigest()

def _load_saved_fp() -> str | None:
    return Path(HASH_FILE).read_text().strip() if os.path.exists(HASH_FILE) else None

def _save_fp(fp: str): Path(HASH_FILE).write_text(fp)


def build_rag_pipeline(force: bool = False) -> bool:
    file_paths = glob.glob(f"{DATA_FOLDER}/*.pdf") + glob.glob(f"{DATA_FOLDER}/*.txt")
    if not file_paths:
        log.warning(f"Tidak ada file PDF/TXT di '{DATA_FOLDER}/'")
        return False

    current_fp = _get_pdf_fingerprint(file_paths)
    if not force and current_fp == _load_saved_fp() and _state["vector_store"] is not None:
        log.info("Index up-to-date, skip re-indexing")
        return True

    log.info(f"Memuat {len(file_paths)} file dokumen (PDF/TXT)...")
    all_docs = []
    for path in file_paths:
        try:
            if path.endswith(".pdf"):
                docs = PDFPlumberLoader(path).load()
                log.info(f"  [PDF] {Path(path).name}: {len(docs)} halaman")
            else:
                docs = TextLoader(path, encoding="utf-8").load()
                log.info(f"  [TXT] {Path(path).name}: {len(docs)} dokumen")
            all_docs.extend(docs)
        except Exception as e:
            log.error(f"  Gagal load {path}: {e}")

    if not all_docs:
        log.error("Tidak ada dokumen berhasil dimuat")
        return False

    chunks = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    ).split_documents(all_docs)
    log.info(f"{len(chunks)} chunks dibuat")

    log.info(f"Membuat embeddings dengan '{EMBED_MODEL}'...")
    try:
        embeddings = OllamaEmbeddings(model=EMBED_MODEL, base_url=OLLAMA_BASE_URL)
        _state["vector_store"] = FAISS.from_documents(chunks, embeddings)
    except Exception as e:
        log.error(f"Gagal buat vector store: {e}")
        return False

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""Kamu adalah asisten administrasi akademik resmi UNISKA MAB yang profesional dan disiplin.

ATURAN KETAATAN KONTEKS MUTLAK (STRICT GROUNDING & SEMANTIC MAPPING):
1. Kamu HANYA boleh menjawab berdasarkan dokumen konteks (PDF dan TXT) yang diberikan. Dilarang keras mengarang atau menggunakan asumsi luar!
2. Lakukan pemetaan semantik secara teliti. Pahami bahwa frasa "tidak mengisi KRS" atau "tidak menginput KRS" memiliki arti yang sama dengan "tidak melakukan pengisian KRS" yang berakibat pada status 'Cuti Akademik' otomatis (Cuti Otomatis) sesuai Pasal 30 Ayat 3.
3. Jika informasi tersebut ada di dalam konteks (meskipun kemiripan katanya tidak 100% sama secara harfiah), kamu WAJIB menjelaskannya sesuai isi dokumen secara detail dan rapi.
4. Jangan pernah menggunakan kalimat pembuka 'Berdasarkan prosedur umum...' atau asumsi generik jika dokumen menyediakan aturan resminya.
5. JANGAN PERNAH mengarang atau menebak nomor Pasal/Ayat yang tidak tertera di dalam teks konteks.
6. JANGAN PERNAH mengomentari atau menulis ulang instruksi prompt ini di dalam jawabanmu. Langsung berikan jawaban yang alami dan profesional.
7. Jika informasi yang ditanyakan benar-benar tidak tertera sama sekali di dalam dokumen konteks, jawab dengan sopan bahwa informasi tersebut tidak tersedia di database RAG dan sarankan untuk menghubungi Prodi atau Biro Akademik (BAK).

Konteks Dokumen:
{context}

Pertanyaan Mahasiswa: {question}

Jawaban:""",
    )

    # =========================================================================================
    # RIWAYAT / KODE SETUP OLLAMA QWEN LOKAL (Disimpan agar tidak lupa saat setup semula)
    # Jika ingin kembali murni menggunakan Qwen 2.5 lokal dari laptop Anda, cukup set di .env:
    # LLM_PROVIDER=ollama
    #
    # Atau jika ingin mengaktifkan blok kode asli Ollama di bawah ini secara manual:
    # _state["qa_chain"] = RetrievalQA.from_chain_type(
    #     llm=OllamaLLM(model=OLLAMA_LLM_MODEL, base_url=OLLAMA_BASE_URL, temperature=0.2),
    #     chain_type="stuff",
    #     retriever=_state["vector_store"].as_retriever(search_type="similarity", search_kwargs={"k": RETRIEVER_TOP_K}),
    #     return_source_documents=False,
    #     chain_type_kwargs={"prompt": prompt},
    # )
    # =========================================================================================

    if LLM_PROVIDER == "openrouter":
        log.info(f"Mengaktifkan RAG dengan LLM Cloud OpenRouter ('{OPENROUTER_MODEL}')...")
        llm_engine = ChatOpenAI(
            model=OPENROUTER_MODEL,
            openai_api_key=OPENROUTER_API_KEY,
            openai_api_base=OPENROUTER_BASE_URL,
            temperature=0.2,
            max_tokens=1024,
            default_headers={"HTTP-Referer": "http://localhost", "X-Title": "Chatbot RAG UNISKA"},
        )
    else:
        log.info(f"Mengaktifkan RAG dengan LLM Lokal Ollama ('{OLLAMA_LLM_MODEL}')...")
        llm_engine = OllamaLLM(model=OLLAMA_LLM_MODEL, base_url=OLLAMA_BASE_URL, temperature=0.2)

    _state["qa_chain"] = RetrievalQA.from_chain_type(
        llm=llm_engine,
        chain_type="stuff",
        retriever=_state["vector_store"].as_retriever(search_type="similarity", search_kwargs={"k": RETRIEVER_TOP_K}),
        return_source_documents=False,
        chain_type_kwargs={"prompt": prompt},
    )

    _save_fp(current_fp)
    log.info("RAG pipeline siap!")
    return True


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(DATA_FOLDER, exist_ok=True)
    build_rag_pipeline(force=True)
    yield

app = FastAPI(title="RAG Backend — Chatbot Kampus", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:8000", "http://127.0.0.1", "http://127.0.0.1:8000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_FALLBACK_KW = ["tidak tersedia di database", "tidak ditemukan", "tidak ada dalam dokumen", "silakan hubungi bagian akademik"]

# Pemetaan SOP Visual Deterministik (Hybrid RAG Architecture)
SOP_VISUAL_MAP = [
    {
        "keywords": ["kalender akademik", "jadwal akademik", "kapan kuliah", "jadwal uts", "jadwal uas", "jadwal wisuda", "jadwal yudisium", "tanggal wisuda", "kapan yudisium", "jadwal libur", "kalender 2025", "kalender 2026", "sk rektor", "periode i", "periode ii", "batas akhir yudisium", "batas akhir pendaftaran yudisium", "jadwal masa perkuliahan"],
        "title": "Panduan Visual: Kalender Akademik UNISKA MAB Tahun Ajaran 2025/2026",
        "images": [
            ("http://proyek-skripsi.test/assets/img/kalender/kalender_akademik_2025_2026.jpeg", "1. Kalender Akademik Resmi UNISKA MAB Tahun Ajaran 2025/2026 (Semester Ganjil, Genap, Yudisium & Wisuda)"),
        ]
    },
    {
        "keywords": ["login", "profil", "password", "masuk portal", "biodata", "akses website"],
        "title": "Panduan Visual: Alur Login & Melengkapi Profil SIA",
        "images": [
            ("http://proyek-skripsi.test/assets/img/sia/urutan-1.jpeg", "1. Tampilan Halaman Utama SIA UNISKA - Ketik URL sia.uniska.ac.id"),
            ("http://proyek-skripsi.test/assets/img/sia/urutan-2.jpeg", "2. Panduan Login Portal, Halaman Utama Setelah Login, dan Menu Profil"),
            ("http://proyek-skripsi.test/assets/img/sia/urutan-3.jpeg", "3. Form Mengubah Password Akun dan Navigasi Menu Ambil KRS"),
        ]
    },
    {
        "keywords": ["ambil krs", "pengisian krs", "pilih mata kuliah", "pilih kelas", "krs mahasiswa", "jadwal krs", "alur pengisian krs"],
        "title": "Panduan Visual: Alur Pengisian & Pengambilan KRS",
        "images": [
            ("http://proyek-skripsi.test/assets/img/sia/urutan-4.jpeg", "1. Tampilan Halaman Ambil KRS - Memilih Mata Kuliah dan Kelas Semester 1"),
            ("http://proyek-skripsi.test/assets/img/sia/urutan-5.jpeg", "2. Daftar Mata Kuliah Lanjutan Semester 2 hingga Semester 4"),
            ("http://proyek-skripsi.test/assets/img/sia/urutan-6.jpeg", "3. Daftar Mata Kuliah Semester 5 hingga 8 dan Tombol Hijau Simpan Ambil KRS"),
        ]
    },
    {
        "keywords": ["hapus krs", "batal matkul", "pembatalan mata kuliah", "hapus mata kuliah", "ubah krs"],
        "title": "Panduan Visual: Prosedur Hapus / Pembatalan KRS",
        "images": [
            ("http://proyek-skripsi.test/assets/img/sia/urutan-7.jpeg", "1. Menu Navigasi Hapus KRS dan Halaman Proses Hapus Mata Kuliah"),
        ]
    },
    {
        "keywords": ["cetak krs", "print krs", "kartu rencana studi", "unduh krs", "download krs"],
        "title": "Panduan Visual: Langkah Cetak Kartu Rencana Studi (KRS)",
        "images": [
            ("http://proyek-skripsi.test/assets/img/sia/urutan-8.jpeg", "1. Menu Navigasi Cetak KRS, Halaman KRS, dan Jendela Print KRS"),
        ]
    },
    {
        "keywords": ["cetak khs", "print khs", "kartu hasil studi", "unduh khs", "lihat nilai semester", "download khs"],
        "title": "Panduan Visual: Langkah Cetak Kartu Hasil Studi (KHS)",
        "images": [
            ("http://proyek-skripsi.test/assets/img/sia/urutan-9.jpeg", "1. Menu Navigasi KHS, Pilih Periode Semester, dan Tampilan Nilai KHS"),
            ("http://proyek-skripsi.test/assets/img/sia/urutan-10.jpeg", "2. Jendela Print KHS dan Menu Navigasi Transkrip Nilai"),
        ]
    },
    {
        "keywords": ["transkrip", "cetak transkrip", "print transkrip", "nilai akhir", "kaca pembesar", "ipk akhir", "seluruh nilai", "unduh transkrip"],
        "title": "Panduan Visual: Langkah Melihat & Mencetak Transkrip Nilai",
        "images": [
            ("http://proyek-skripsi.test/assets/img/sia/urutan-11.jpeg", "1. Ikon Kaca Pembesar dan Tampilan Awal Transkrip Nilai Mahasiswa"),
            ("http://proyek-skripsi.test/assets/img/sia/urutan-12.jpeg", "2. Tabel Lengkap Transkrip Nilai - Daftar Mata Kuliah dan IPK Akhir"),
            ("http://proyek-skripsi.test/assets/img/sia/urutan-13.jpeg", "3. Ikon Printer Cetak Transkrip dan Jendela Print Transkrip Nilai Resmi"),
        ]
    },
    {
        "keywords": ["verifikasi yudisium", "verifikasi pengajuan", "operator bak", "tatap muka", "offline", "loket bak", "berkas tidak valid", "diagram alur yudisium", "sop verifikasi", "sop yudisium", "sop a", "sop b", "flowchart yudisium"],
        "title": "Panduan Visual: Diagram Alur SOP Pendaftaran & Verifikasi Yudisium",
        "images": [
            ("http://proyek-skripsi.test/assets/img/yudisium/sop-a.jpeg", "1. Diagram Alur SOP Pendaftaran Yudisium Online (Mahasiswa & Operator BAK)"),
            ("http://proyek-skripsi.test/assets/img/yudisium/sop-b.jpeg", "2. Diagram Alur SOP Verifikasi Pengajuan Yudisium Tatap Muka / Offline"),
        ]
    },
    {
        "keywords": ["daftar yudisium", "pendaftaran yudisium", "cara mendaftar yudisium", "upload berkas yudisium", "syarat yudisium", "persyaratan yudisium", "alur yudisium online", "144 sks", "berkas 1"],
        "title": "Panduan Visual: Langkah Pendaftaran Yudisium Online di Portal SIA",
        "images": [
            ("http://proyek-skripsi.test/assets/img/yudisium/langkah-1.jpeg", "1. Akses Portal Akademik SIA, Login Akun, dan Masuk ke Halaman Utama Dasbor"),
            ("http://proyek-skripsi.test/assets/img/yudisium/langkah-2.jpeg", "2. Pilih Menu Persyaratan Yudisium, Pastikan Syarat Berstatus 'V', dan Klik DAFTAR YUDISIUM"),
            ("http://proyek-skripsi.test/assets/img/yudisium/langkah-3.jpeg", "3. Upload Berkas Persyaratan Yudisium (Ijazah SMA, Kwitansi, dll Maks. 100 KB) dan Klik Upload"),
        ]
    },
]

def attach_visual_sop(query: str, answer: str) -> str:
    clean_answer = re.sub(r'!\[.*?\]\(.*?\)', '', answer).strip()
    query_lower = query.lower()
    if "kkn" in query_lower or "kuliah kerja nyata" in query_lower:
        return clean_answer
    for sop in SOP_VISUAL_MAP:
        if any(all(w in query_lower for w in kw.split()) for kw in sop["keywords"]):
            gallery = f"\n\n---\n### 🖼️ {sop['title']}\n\n"
            for url, caption in sop["images"]:
                gallery += f"![{caption}]({url})\n\n"
            return clean_answer + gallery.rstrip()
    return clean_answer


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if _state["qa_chain"] is None:
        raise HTTPException(503, "RAG chain belum siap. Taruh file PDF/TXT di ./data lalu panggil /reload")
    if not request.chatInput.strip():
        raise HTTPException(422, "chatInput tidak boleh kosong")

    log.info(f"Query ({request.sessionId}): '{request.chatInput[:70]}'")
    try:
        result = _state["qa_chain"].invoke({"query": request.chatInput})
        answer = result.get("result", "").strip()
    except Exception as e:
        log.error(f"Error QA Chain: {e}")
        raise HTTPException(500, str(e))

    if not answer:
        answer = "Mohon maaf, informasi tersebut tidak tersedia di database kami. Silakan hubungi bagian akademik kampus secara langsung."

    answer = attach_visual_sop(request.chatInput, answer)
    is_rag_found = not any(kw in answer.lower() for kw in _FALLBACK_KW)
    return ChatResponse(output=answer, sessionId=request.sessionId, is_rag_found=is_rag_found)


@app.get("/reload")
async def reload():
    _state["vector_store"] = None
    _state["qa_chain"] = None
    if os.path.exists(HASH_FILE): os.remove(HASH_FILE)
    success = build_rag_pipeline(force=True)
    return {"success": success, "message": "Re-indexing selesai" if success else "Tidak ada dokumen di ./data"}


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "vector_store_ready": _state["vector_store"] is not None,
        "qa_chain_ready": _state["qa_chain"] is not None,
        "doc_files": len(glob.glob(f"{DATA_FOLDER}/*.pdf")) + len(glob.glob(f"{DATA_FOLDER}/*.txt")),
        "llm_model": LLM_MODEL, "embed_model": EMBED_MODEL,
    }
