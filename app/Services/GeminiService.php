<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * GeminiService — Adapter untuk komunikasi dengan Google Gemini API.
 *
 * Service ini mengenkapsulasi seluruh logika HTTP call ke Gemini API,
 * menggunakan HTTP Client bawaan Laravel (bukan SDK) untuk efisiensi memori
 * pada laptop dengan RAM 8 GB.
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Menerapkan **Adapter Pattern**: mengkonversi interface Gemini API
 *   menjadi interface internal yang dipahami oleh ChatbotService.
 * - **Single Responsibility Principle (SRP)**: satu-satunya tanggung jawab
 *   adalah berkomunikasi dengan Gemini API.
 * - **Open-Closed Principle (OCP)**: jika model AI diganti (misal ke GPT),
 *   hanya service ini yang perlu dimodifikasi tanpa mengubah ChatbotService.
 * - **Dependency Inversion Principle (DIP)**: ChatbotService bergantung
 *   pada GeminiService via constructor injection, bukan hardcoded.
 */
class GeminiService
{
    private string $apiKey;

    private string $model;

    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    /**
     * Jumlah percobaan ulang maksimum saat terkena rate limit (HTTP 429).
     */
    private const MAX_RETRIES = 2;

    /**
     * System prompt yang membatasi konteks Gemini agar tetap relevan
     * dengan pelayanan akademik kampus.
     *
     * Prompt dirancang secara detail untuk menghasilkan jawaban yang
     * informatif, spesifik, dan kontekstual terhadap UNISKA MAB.
     */
    private const SYSTEM_PROMPT = <<<'PROMPT'
Kamu adalah asisten virtual resmi pelayanan akademik kampus UNISKA MAB (Universitas Islam Kalimantan Muhammad Arsyad Al Banjari), berlokasi di Banjarmasin, Kalimantan Selatan.

Konteks kampus:
- Website resmi: https://uniska-bjm.ac.id
- Portal akademik (SIA): https://sia.uniska-bjm.ac.id
- Fakultas: Hukum, Ekonomi, Teknik, KIP, FISIP, Perikanan, Studi Islam, Kesehatan Masyarakat, Farmasi.
- Layanan administrasi: Biro Akademik (BAA), Biro Keuangan, Bagian Kemahasiswaan.

Aturan menjawab:
1. Jawab dengan bahasa Indonesia yang sopan, informatif, dan terstruktur.
2. Berikan langkah-langkah konkret jika mahasiswa bertanya "bagaimana cara...".
3. Sebutkan unit/bagian kampus yang relevan beserta saran untuk menghubungi mereka (misal: "Silakan hubungi Biro Akademik di gedung rektorat lantai 1").
4. Jika pertanyaan tentang kontak dosen/kaprodi, arahkan ke Sekretariat Fakultas yang bersangkutan atau portal SIA.
5. Jika pertanyaan di luar konteks akademik kampus, arahkan kembali ke topik yang relevan dengan sopan.
6. Berikan jawaban yang ringkas namun lengkap (maksimal 3 paragraf). Jangan bertanya balik, langsung jawab sebaik mungkin.
7. Jika tidak yakin dengan informasi spesifik, tetap berikan panduan umum terlebih dahulu, lalu sarankan konfirmasi ke bagian terkait.
PROMPT;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key', '');
        $this->model = config('services.gemini.model', 'gemini-2.0-flash-lite');
    }

    /**
     * Mengirim pesan ke Gemini API dan mengembalikan respons teks.
     *
     * Menggunakan HTTP Client Laravel (Illuminate\Http\Client) yang berbasis
     * Guzzle, bukan Google AI SDK, untuk menghindari overhead memori tambahan.
     *
     * Dilengkapi mekanisme auto-retry untuk menangani HTTP 429 (Rate Limit)
     * dari Google Free Tier API, dengan jeda sesuai retryDelay dari server.
     *
     * @param  string  $message  Pesan input dari pengguna
     * @return string  Respons teks dari Gemini
     *
     * @throws \RuntimeException  Jika API key tidak dikonfigurasi
     */
    public function generateResponse(string $message): string
    {
        if (empty($this->apiKey)) {
            Log::warning('GeminiService: API key tidak dikonfigurasi.');

            return 'Maaf, layanan AI sedang tidak tersedia. Silakan coba lagi nanti atau hubungi bagian akademik secara langsung.';
        }

        $payload = [
            'system_instruction' => [
                'parts' => [['text' => self::SYSTEM_PROMPT]],
            ],
            'contents' => [
                [
                    'parts' => [['text' => $message]],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 1024,
            ],
        ];

        // Retry loop: menangani HTTP 429 (Rate Limit) secara otomatis.
        for ($attempt = 0; $attempt <= self::MAX_RETRIES; $attempt++) {
            try {
                $response = Http::timeout(30)
                    ->withQueryParameters(['key' => $this->apiKey])
                    ->post("{$this->baseUrl}/models/{$this->model}:generateContent", $payload);

                // Jika rate-limited (429), tunggu lalu coba lagi
                if ($response->status() === 429 && $attempt < self::MAX_RETRIES) {
                    $retryAfter = $this->parseRetryDelay($response->body());
                    Log::warning("GeminiService: Rate limited (429), retry setelah {$retryAfter}s (percobaan " . ($attempt + 1) . ')');
                    sleep($retryAfter);

                    continue;
                }

                if ($response->failed()) {
                    Log::error('GeminiService: API call failed', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    return $this->fallbackResponse();
                }

                $text = $response->json('candidates.0.content.parts.0.text', '');

                return ! empty($text)
                    ? trim($text)
                    : $this->fallbackResponse();

            } catch (\Exception $e) {
                Log::error('GeminiService: Exception', [
                    'message' => $e->getMessage(),
                    'attempt' => $attempt + 1,
                ]);

                // Jika masih ada retry tersisa dan error bisa di-retry
                if ($attempt < self::MAX_RETRIES) {
                    sleep(2);

                    continue;
                }

                return $this->fallbackResponse();
            }
        }

        return $this->fallbackResponse();
    }

    /**
     * Cek apakah Gemini API tersedia dan terkonfigurasi.
     */
    public function isAvailable(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Menganalisis sentimen dari laporan/keluhan mahasiswa menggunakan Gemini API.
     *
     * Catatan Akademis (Skripsi Bab 4):
     * Metode ini memanggil Gemini API dengan suhu rendah (0.1) untuk klasifikasi
     * sentimen (positif, netral, negatif) dan skor intensitasnya secara deterministik.
     *
     * @param string $text Laporan/keluhan mahasiswa
     * @return array ['sentiment' => 'positive'|'neutral'|'negative', 'score' => float]
     */
    public function analyzeSentiment(string $text): array
    {
        if (empty($this->apiKey)) {
            Log::warning('GeminiService: API key tidak dikonfigurasi untuk sentiment analysis.');
            return ['sentiment' => 'neutral', 'score' => 0.5];
        }

        $systemPrompt = <<<'PROMPT'
Kamu adalah sistem analisis sentimen otomatis untuk keluhan/laporan mahasiswa di pelayanan akademik kampus.
Tugas kamu adalah menganalisis teks laporan mahasiswa dan menentukan kategori sentimen serta skor intensitasnya.

Kategori Sentimen yang diperbolehkan hanya tiga:
1. "positive" - jika laporan mengekspresikan apresiasi, kepuasan, ucapan terima kasih, atau hal-hal baik.
2. "negative" - jika laporan mengekspresikan keluhan, kekecewaan, masalah teknis, kemarahan, frustrasi, kesulitan, atau kendala.
3. "neutral" - jika laporan berupa pertanyaan biasa, permohonan informasi tanpa emosi kuat, atau pernyataan fakta yang netral.

Skor intensitas/keyakinan sentimen:
- Harus berupa angka desimal (float) antara 0.0 sampai 1.0.
- 1.0 artinya sangat kuat sentimennya (sangat kecewa/sangat positif), dan 0.0 artinya sangat lemah/tidak ada sentimen sama sekali.

Kamu HARUS menjawab HANYA dengan format JSON yang valid, tanpa penjelasan tambahan, tanpa markdown block ```json.
Format JSON yang diharapkan:
{
  "sentiment": "negative",
  "score": 0.8
}
PROMPT;

        $payload = [
            'system_instruction' => [
                'parts' => [['text' => $systemPrompt]],
            ],
            'contents' => [
                [
                    'parts' => [['text' => "Laporan mahasiswa: \"{$text}\""]],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.1,
                'responseMimeType' => 'application/json',
                'maxOutputTokens' => 128,
            ],
        ];

        try {
            $response = Http::timeout(20)
                ->withQueryParameters(['key' => $this->apiKey])
                ->post("{$this->baseUrl}/models/{$this->model}:generateContent", $payload);

            if ($response->failed()) {
                Log::error('GeminiService sentiment analysis: API call failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return ['sentiment' => 'neutral', 'score' => 0.5];
            }

            $jsonText = trim($response->json('candidates.0.content.parts.0.text', ''));
            // Bersihkan jika model masih mengembalikan tag ```json
            if (str_starts_with($jsonText, '```')) {
                $jsonText = preg_replace('/^```(?:json)?\n|```$/i', '', $jsonText);
                $jsonText = trim($jsonText);
            }

            $data = json_decode($jsonText, true);

            if (isset($data['sentiment']) && in_array($data['sentiment'], ['positive', 'neutral', 'negative'])) {
                return [
                    'sentiment' => $data['sentiment'],
                    'score' => (float) ($data['score'] ?? 0.5),
                ];
            }
        } catch (\Exception $e) {
            Log::error('GeminiService sentiment analysis exception: ' . $e->getMessage());
        }

        return ['sentiment' => 'neutral', 'score' => 0.5];
    }

    /**
     * Respons fallback ketika Gemini API gagal.
     */
    private function fallbackResponse(): string
    {
        return 'Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. 🤖 Silakan coba lagi nanti atau hubungi bagian akademik kampus secara langsung untuk bantuan lebih lanjut.';
    }

    /**
     * Mengekstrak durasi retry dari respons error 429 Google API.
     *
     * Google API mengembalikan `retryDelay` dalam format "Ns" (misal "3s").
     * Method ini mengurai nilai tersebut dan mengembalikan integer detik.
     *
     * @param  string  $responseBody  JSON body dari respons error
     * @return int  Durasi tunggu dalam detik (default 5 jika parsing gagal)
     */
    private function parseRetryDelay(string $responseBody): int
    {
        // Cari pattern "retryDelay": "Ns" dalam JSON response
        if (preg_match('/"retryDelay"\s*:\s*"(\d+)s"/', $responseBody, $matches)) {
            return (int) $matches[1];
        }

        // Default 5 detik jika tidak bisa parse
        return 5;
    }
}
