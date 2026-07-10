<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * OllamaService — Adapter untuk komunikasi dengan Ollama via FastAPI RAG Backend.
 *
 * Service ini mengenkapsulasi logika HTTP call ke FastAPI RAG Backend
 * yang terhubung ke model Ollama Qwen 2.5 lokal sebagai mesin
 * Generative AI RAG selama masa pengembangan (development).
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Menerapkan **Adapter Pattern**: mengkonversi interface FastAPI RAG
 *   menjadi interface internal yang identik dengan GeminiService.
 * - **Single Responsibility Principle (SRP)**: tanggung jawab tunggal
 *   adalah berkomunikasi dengan FastAPI/Ollama lokal.
 * - **Open-Closed Principle (OCP)**: ChatbotService tidak perlu
 *   dimodifikasi saat mengganti engine AI — cukup ubah variabel
 *   `AI_ENGINE` di file `.env` antara 'gemini' dan 'ollama'.
 * - Penggunaan engine lokal menghemat kuota token Gemini API
 *   yang sering kehabisan (Rate Limit 429) selama pengembangan.
 *
 * @see GeminiService Adapter untuk Google Gemini Cloud API
 */
class OllamaService
{
    private string $webhookUrl;
    private int $connectTimeout = 5;   // detik, untuk cek apakah FastAPI aktif
    private int $requestTimeout = 300; // detik, untuk generate jawaban (model 7B lokal lambat di CPU offload)

    /**
     * Pola respons Ollama yang mengindikasikan data tidak ditemukan
     * dalam dokumen RAG, sehingga perlu eskalasi ke admin manusia.
     *
     * Catatan: Pola disesuaikan dengan prompt template di FastAPI RAG Backend.
     */
    private const RAG_NOT_FOUND_PATTERNS = [
        'tidak ditemukan',
        'tidak ada dalam dokumen',
        'tidak tersedia dalam',
        'di luar konteks',
        'tidak memiliki informasi',
        'saya tidak dapat menemukan',
        'tidak ada data',
        'belum tersedia',
        'tidak tercakup',
    ];

    public function __construct()
    {
        $this->webhookUrl = (string) (config('services.rag_backend.url') ?? '');
    }

    /**
     * Mengirim pertanyaan ke FastAPI RAG Backend dan mengembalikan respons
     * dari Ollama Qwen 2.5 dengan konteks dokumen RAG (FAISS Vector Store).
     *
     * Alur: Laravel → FastAPI (POST /chat) → FAISS Retrieval → Ollama Qwen 2.5
     *
     * Payload yang dikirim:
     * - `chatInput`: pertanyaan mahasiswa
     * - `sessionId`: identitas sesi untuk konteks percakapan
     *
     * @param  string  $message    Pesan/pertanyaan dari mahasiswa
     * @param  string  $sessionId  ID sesi untuk konteks percakapan (opsional)
     * @return array{response: string, is_rag_found: bool}
     */
    public function generateResponse(string $message, string $sessionId = 'default'): array
    {
        if (empty($this->webhookUrl)) {
            Log::warning('OllamaService: RAG_BACKEND_URL tidak dikonfigurasi di .env');
            return ['response' => $this->fallbackResponse(), 'is_rag_found' => false];
        }

        try {
            // Perpanjang batas waktu PHP karena model LLM lokal butuh waktu lama
            set_time_limit(300);

            $response = Http::timeout($this->requestTimeout)
                ->withHeaders([
                    'Bypass-Tunnel-Reminder' => 'true',
                    'bypass-tunnel-reminder' => 'true',
                    'User-Agent' => 'Laravel-RAG-Client',
                ])
                ->post($this->webhookUrl, [
                    'chatInput' => $message,
                    'sessionId' => $sessionId,
                ]);

            if ($response->failed()) {
                Log::error('OllamaService: webhook call gagal', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return ['response' => $this->fallbackResponse(), 'is_rag_found' => false];
            }

            $text = $this->parseRagResponse($response);

            if (empty($text)) {
                return ['response' => $this->fallbackResponse(), 'is_rag_found' => false];
            }

            $isRagFound = !$this->isRagNotFoundResponse($text);
            return ['response' => trim($text), 'is_rag_found' => $isRagFound];

        } catch (\Exception $e) {
            Log::error('OllamaService: Exception', ['message' => $e->getMessage(), 'url' => $this->webhookUrl]);
            return [
                'response' => 'Maaf, layanan AI RAG sedang tidak dapat dihubungi via tunnel. 🔧 (' . substr($e->getMessage(), 0, 100) . ')',
                'is_rag_found' => false,
            ];
        }
    }

    /**
     * Cek apakah Ollama service tersedia dan terkonfigurasi.
     */
    public function isAvailable(): bool
    {
        return !empty($this->webhookUrl);
    }

    /**
     * Parse respons dari FastAPI RAG Backend.
     *
     * FastAPI mengembalikan output dalam format:
     * - `{"output": "jawaban teks"}` (format utama dari ChatResponse)
     * - `{"text": "..."}` atau `{"response": "..."}`
     * - Plain text langsung
     * - JSON array `[{"output": "..."}]`
     *
     * @param  \Illuminate\Http\Client\Response  $response
     * @return string  Teks jawaban dari Ollama
     */
    private function parseRagResponse($response): string
    {
        $body = $response->body();

        // Coba decode sebagai JSON terlebih dahulu
        $data = json_decode($body, true);

        if (is_array($data)) {
            // Jika array of objects, ambil elemen pertama
            if (isset($data[0]) && is_array($data[0])) {
                $data = $data[0];
            }

            // Cek berbagai kemungkinan key output dari RAG Backend
            foreach (['output', 'text', 'response', 'jawaban', 'message', 'result'] as $key) {
                if (isset($data[$key]) && is_string($data[$key]) && !empty(trim($data[$key]))) {
                    return trim($data[$key]);
                }
            }

            // Fallback: jika hanya ada satu key, gunakan nilainya
            if (count($data) === 1) {
                $value = reset($data);
                if (is_string($value) && !empty(trim($value))) {
                    return trim($value);
                }
            }
        }

        // Jika bukan JSON, kembalikan sebagai plain text
        $plainText = trim($body);

        return !empty($plainText) ? $plainText : '';
    }

    /**
     * Mendeteksi apakah respons Ollama mengindikasikan data tidak ditemukan di RAG.
     *
     * Catatan Akademis:
     * Deteksi ini menggunakan substring matching sederhana terhadap pola-pola
     * kalimat yang umum dihasilkan LLM ketika tidak menemukan konteks relevan
     * dalam dokumen RAG. Jika terdeteksi, frontend akan menampilkan tombol
     * "Hubungi Admin Manusia" sebagai Human Fallback.
     *
     * @param  string  $response  Teks jawaban dari Ollama
     * @return bool  True jika data tidak ditemukan di RAG
     */
    private function isRagNotFoundResponse(string $response): bool
    {
        $lowerResponse = mb_strtolower($response);

        foreach (self::RAG_NOT_FOUND_PATTERNS as $pattern) {
            if (str_contains($lowerResponse, $pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Cek apakah FastAPI RAG backend bisa dijangkau via /health endpoint.
     * Menggunakan timeout singkat (5 detik) agar tidak memblokir response lama.
     */
    private function isBackendReachable(): bool
    {
        try {
            // Ganti /chat dengan /health untuk cek cepat tanpa beban LLM
            $healthUrl = rtrim($this->webhookUrl, '/');
            $healthUrl = preg_replace('/\/chat$/', '/health', $healthUrl);

            $response = Http::timeout($this->connectTimeout)
                ->withHeaders([
                    'Bypass-Tunnel-Reminder' => 'true',
                    'User-Agent' => 'Laravel-RAG-Client',
                ])
                ->get($healthUrl);
            $data = $response->json();

            // Pastikan bukan hanya server aktif, tapi RAG chain-nya juga siap
            return $response->ok() && ($data['qa_chain_ready'] ?? false) === true;

        } catch (\Exception $e) {
            Log::debug('OllamaService: health check gagal — ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Respons fallback ketika FastAPI/Ollama tidak tersedia.
     */
    private function fallbackResponse(): string
    {
        return 'Maaf, layanan AI RAG lokal (Ollama) sedang tidak tersedia. 🔧 Silakan pastikan server RAG FastAPI dan Ollama sudah berjalan, atau hubungi admin kampus secara langsung.';
    }
}
