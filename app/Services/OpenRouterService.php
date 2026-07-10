<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * OpenRouterService — Adapter untuk komunikasi dengan OpenRouter Cloud API.
 *
 * Service ini memfasilitasi penggunaan model LLM raksasa secara gratis via cloud
 * (misal: openai/gpt-oss-120b:free atau qwen/qwen-2.5-72b-instruct:free),
 * tanpa membebani RAM server web (khususnya untuk spesifikasi Railway 1 GB RAM).
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Menerapkan **Adapter Pattern** dan **Interoperability** standar OpenAI format.
 * - **Single Responsibility Principle (SRP)**: mengelola HTTP call khusus untuk OpenRouter.
 */
class OpenRouterService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl = 'https://openrouter.ai/api/v1';

    private const MAX_RETRIES = 2;

    /**
     * System Prompt dengan teknik Strict Grounding untuk konteks akademik UNISKA MAB.
     */
    private const SYSTEM_PROMPT = <<<PROMPT
Anda adalah Chatbot Pelayanan Akademik resmi untuk Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (UNISKA MAB) Banjarmasin.

Informasi kunci kampus:
- Nama resmi: Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (UNISKA MAB).
- Portal akademik (SIA): https://sia.uniska-bjm.ac.id
- Layanan administrasi: Biro Administrasi Akademik dan Kemahasiswaan (BAAK), Biro Keuangan, Program Studi (Prodi).

Aturan menjawab (STRICT GROUNDING & ACADEMIC TONE):
1. Jawab dengan bahasa Indonesia yang sopan, profesional, dan terkesan ramah bagi mahasiswa.
2. Berikan jawaban yang ringkas, langsung ke inti masalah, dan terstruktur rapi (maksimal 3 paragraf).
3. Jika pertanyaan mengenai jadwal atau prosedur tertentu yang membutuhkan kepastian tanggal dari kalender akademik, arahkan mahasiswa untuk memeriksa portal SIA resmi atau menghubungi BAAK/Prodi masing-masing.
4. Jangan menjawab asumsi atau spekulasi di luar pedoman resmi universitas.
PROMPT;

    public function __construct()
    {
        $this->apiKey = (string) (config('services.openrouter.api_key') ?? '');
        $this->model = (string) (config('services.openrouter.model') ?? 'openai/gpt-oss-120b:free');
    }

    /**
     * Mengirim pesan ke OpenRouter API (OpenAI Chat Completion format).
     */
    public function generateResponse(string $message): string
    {
        if (empty($this->apiKey)) {
            Log::warning('OpenRouterService: API key tidak dikonfigurasi.');

            return 'Maaf, layanan AI OpenRouter sedang tidak tersedia. Silakan cek konfigurasi OPENROUTER_API_KEY Anda.';
        }

        $payload = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => self::SYSTEM_PROMPT],
                ['role' => 'user', 'content' => $message],
            ],
            'temperature' => 0.7,
            'max_tokens' => 1024,
        ];

        for ($attempt = 0; $attempt <= self::MAX_RETRIES; $attempt++) {
            try {
                $response = Http::timeout(45)
                    ->withHeaders([
                        'Authorization' => 'Bearer ' . $this->apiKey,
                        'HTTP-Referer' => config('app.url', 'http://localhost'),
                        'X-Title' => 'Chatbot Akademik UNISKA MAB',
                    ])
                    ->post("{$this->baseUrl}/chat/completions", $payload);

                if ($response->status() === 429 && $attempt < self::MAX_RETRIES) {
                    Log::warning("OpenRouterService: Rate limited (429), retry (percobaan " . ($attempt + 1) . ')');
                    sleep(2);
                    continue;
                }

                if ($response->failed()) {
                    Log::error('OpenRouterService: API call failed', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    return 'Maaf, sistem AI sedang mengalami kendala jaringan. Silakan coba beberapa saat lagi.';
                }

                $text = $response->json('choices.0.message.content', '');

                return ! empty($text)
                    ? trim($text)
                    : 'Maaf, AI tidak memberikan respons yang dapat dipahami.';
            } catch (\Exception $e) {
                Log::error("OpenRouterService: Exception pada percobaan {$attempt}: " . $e->getMessage());
                if ($attempt === self::MAX_RETRIES) {
                    return 'Maaf, terjadi kesalahan koneksi ke server OpenRouter. Silakan coba lagi nanti.';
                }
                sleep(1);
            }
        }

        return 'Maaf, layanan AI sedang sibuk. Silakan coba lagi.';
    }
}
