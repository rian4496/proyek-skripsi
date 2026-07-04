<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * OllamaService — Adapter untuk komunikasi dengan Ollama via n8n Webhook.
 *
 * Service ini mengenkapsulasi logika HTTP call ke n8n Workflow Engine
 * yang terhubung ke model Ollama Qwen 2.5 lokal sebagai mesin
 * Generative AI RAG selama masa pengembangan (development).
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Menerapkan **Adapter Pattern**: mengkonversi interface n8n Webhook
 *   menjadi interface internal yang identik dengan GeminiService.
 * - **Single Responsibility Principle (SRP)**: tanggung jawab tunggal
 *   adalah berkomunikasi dengan n8n/Ollama lokal.
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

    /**
     * Pola respons n8n/Ollama yang mengindikasikan data tidak ditemukan
     * dalam dokumen RAG, sehingga perlu eskalasi ke admin manusia.
     *
     * Catatan: Pola disesuaikan dengan prompt template di n8n Workflow.
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
        $this->webhookUrl = config('services.n8n.webhook_url', '');
    }

    /**
     * Mengirim pertanyaan ke n8n Chat Trigger dan mengembalikan respons
     * dari AI Agent (Ollama Chat Model + Query Data Tool / RAG).
     *
     * Alur di n8n (sesuai canvas "Chatbot Hybrid Core"):
     * "When chat message received" → Switch → AI Agent
     *    → Ollama Chat Model (Qwen 2.5) + Query Data Tool (Vector Store Retriever)
     *
     * Payload yang dikirim:
     * - `chatInput`: pertanyaan mahasiswa (wajib, key standar n8n Chat Trigger)
     * - `sessionId`: identitas sesi agar n8n menjaga konteks percakapan
     *
     * @param  string  $message    Pesan/pertanyaan dari mahasiswa
     * @param  string  $sessionId  ID sesi untuk konteks percakapan (opsional)
     * @return array{response: string, is_rag_found: bool}
     */
    public function generateResponse(string $message, string $sessionId = 'default'): array
    {
        if (empty($this->webhookUrl)) {
            Log::warning('OllamaService: N8N_WEBHOOK_URL tidak dikonfigurasi di .env');

            return [
                'response' => $this->fallbackResponse(),
                'is_rag_found' => false,
            ];
        }

        try {
            $response = Http::timeout(60)
                ->post($this->webhookUrl, [
                    'chatInput' => $message,
                    'sessionId' => $sessionId,
                ]);

            if ($response->failed()) {
                Log::error('OllamaService: n8n webhook call gagal', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'response' => $this->fallbackResponse(),
                    'is_rag_found' => false,
                ];
            }

            // Parse respons dari n8n — mendukung beberapa format output
            $text = $this->parseN8nResponse($response);

            if (empty($text)) {
                return [
                    'response' => $this->fallbackResponse(),
                    'is_rag_found' => false,
                ];
            }

            // Deteksi apakah Ollama menjawab bahwa data tidak ada di RAG
            $isRagFound = !$this->isRagNotFoundResponse($text);

            return [
                'response' => trim($text),
                'is_rag_found' => $isRagFound,
            ];

        } catch (\Exception $e) {
            Log::error('OllamaService: Exception saat memanggil n8n', [
                'message' => $e->getMessage(),
                'url' => $this->webhookUrl,
            ]);

            return [
                'response' => $this->fallbackResponse(),
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
     * Parse respons dari n8n Chat Trigger.
     *
     * Node "When chat message received" di n8n mengembalikan output
     * dari AI Agent dalam format:
     * - `{"output": "jawaban teks"}` (paling umum dari AI Agent node)
     * - `{"text": "..."}` atau `{"response": "..."}`
     * - Plain text langsung
     * - JSON array `[{"output": "..."}]`
     *
     * @param  \Illuminate\Http\Client\Response  $response
     * @return string  Teks jawaban dari Ollama
     */
    private function parseN8nResponse($response): string
    {
        $body = $response->body();

        // Coba decode sebagai JSON terlebih dahulu
        $data = json_decode($body, true);

        if (is_array($data)) {
            // Jika array of objects, ambil elemen pertama
            if (isset($data[0]) && is_array($data[0])) {
                $data = $data[0];
            }

            // Cek berbagai kemungkinan key output dari n8n
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
     * Respons fallback ketika n8n/Ollama tidak tersedia.
     */
    private function fallbackResponse(): string
    {
        return 'Maaf, layanan AI lokal (Ollama) sedang tidak tersedia atau n8n belum aktif. 🔧 Silakan pastikan n8n dan Ollama berjalan, atau hubungi admin kampus secara langsung.';
    }
}
