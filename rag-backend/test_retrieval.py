"""Test script: debug RAG retrieval quality"""
import os, glob
from dotenv import load_dotenv
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL = os.getenv("EMBED_MODEL", "nomic-embed-text")

# Load PDFs
all_docs = []
for path in glob.glob("./data/*.pdf"):
    docs = PDFPlumberLoader(path).load()
    all_docs.extend(docs)
    print(f"Loaded {path}: {len(docs)} pages")

# Chunk
chunks = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200,
    separators=["\n\n", "\n", ".", " ", ""]
).split_documents(all_docs)
print(f"\nTotal chunks: {len(chunks)}")

# Build FAISS
embeddings = OllamaEmbeddings(model=EMBED_MODEL, base_url=OLLAMA_BASE_URL)
vs = FAISS.from_documents(chunks, embeddings)
retriever = vs.as_retriever(search_kwargs={"k": 5})

# Test queries
queries = [
    "Bagaimana prosedur cuti akademik semester?",
    "Berapa SKS maksimal yang bisa diambil?",
    "Apa syarat pengambilan KRS?",
]

for q in queries:
    print(f"\n{'='*60}")
    print(f"QUERY: {q}")
    print('='*60)
    results = retriever.invoke(q)
    for i, doc in enumerate(results):
        src = doc.metadata.get('source', 'unknown')
        print(f"\n--- Chunk {i+1} (from: {os.path.basename(src)}) ---")
        print(doc.page_content[:300])
