<?php

namespace App\Services;

use App\Models\DocumentChunk;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * PGVectorService — Layanan Manajemen Embeddings & RAG Semantic Search Cloud-Native.
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Layanan ini memungkinkan Laravel melakukan pembangkitan vektor (Vector Embedding)
 *   dan pencarian kosinus (Cosine Distance Search) langsung dari dalam database
 *   PostgreSQL Railway tanpa wajib mengandalkan FAISS lokal.
 * - Pembangkitan vektor mendukung 2 engine secara *failover*:
 *   1. Ollama lokal / tunnel (`nomic-embed-text` / 768 dimensi).
 *   2. Google Gemini API (`text-embedding-004` / 768 dimensi).
 */
class PGVectorService
{
    /**
     * URL dasar API Ollama / RAG.
     */
    protected string $ollamaBaseUrl;

    /**
     * Kunci API Google Gemini untuk fallback embedding.
     */
    protected ?string $geminiApiKey = null;

    public function __construct()
    {
        $this->ollamaBaseUrl = rtrim(env('OLLAMA_BASE_URL', 'http://localhost:11434'), '/');
        $this->geminiApiKey = env('GEMINI_API_KEY');
    }

    /**
     * Bangkitkan vektor embedding dari sebuah teks (768 dimensi).
     *
     * @param  string  $text
     * @return array<int, float>|null
     */
    public function generateEmbedding(string $text): ?array
    {
        $cleanText = trim(preg_replace('/\s+/', ' ', $text));
        if ($cleanText === '') {
            return null;
        }

        // 1. Coba Ollama / RAG Tunnel terlebih dahulu (nomic-embed-text)
        try {
            $response = Http::timeout(6)->post("{$this->ollamaBaseUrl}/api/embeddings", [
                'model' => env('EMBED_MODEL', 'nomic-embed-text'),
                'prompt' => $cleanText,
            ]);

            if ($response->successful() && isset($response->json()['embedding'])) {
                $embedding = $response->json()['embedding'];
                if (is_array($embedding) && count($embedding) === 768) {
                    return $embedding;
                }
            }
        } catch (\Exception $e) {
            Log::debug('PGVectorService: Ollama embedding gagal/tidak aktif, mencoba Gemini fallback. Error: ' . $e->getMessage());
        }

        // 2. Fallback ke Google Gemini (text-embedding-004) jika API Key tersedia
        $apiKey = $this->getGeminiApiKey();
        if ($apiKey) {
            try {
                $response = Http::timeout(10)->post(
                    "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={$apiKey}",
                    [
                        'model' => 'models/text-embedding-004',
                        'content' => [
                            'parts' => [['text' => $cleanText]],
                        ],
                        'outputDimensionality' => 768, // Wajib 768 agar konsisten dengan nomic-embed-text
                    ]
                );

                if ($response->successful() && isset($response->json()['embedding']['values'])) {
                    $embedding = $response->json()['embedding']['values'];
                    if (is_array($embedding) && count($embedding) === 768) {
                        return $embedding;
                    }
                }
            } catch (\Exception $e) {
                Log::warning('PGVectorService: Gemini embedding fallback juga gagal: ' . $e->getMessage());
            }
        }

        return null;
    }

    /**
     * Cari potongan dokumen paling relevan menggunakan PGVector Cosine Distance (<=>).
     *
     * @param  string  $queryText
     * @param  int  $topK
     * @param  float  $minScore
     * @return array<int, array{text: string, title: string, score: float}>
     */
    public function searchChunks(string $queryText, int $topK = 3, float $minScore = 0.65): array
    {
        // Cek driver database — jika bukan pgsql (atau tabel masih kosong), kembalikan array kosong
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return [];
        }

        $vector = $this->generateEmbedding($queryText);
        if (!$vector) {
            return [];
        }

        try {
            $chunks = DocumentChunk::cosineSearch($vector, $topK)->get();
            $results = [];

            foreach ($chunks as $chunk) {
                $score = (float) ($chunk->similarity_score ?? 0);
                if ($score >= $minScore) {
                    $results[] = [
                        'text' => (string) $chunk->chunk_text,
                        'title' => (string) $chunk->document_title,
                        'score' => round($score * 100, 2),
                    ];
                }
            }

            return $results;
        } catch (\Exception $e) {
            Log::error('PGVectorService: Gagal menjalankan pencarian kosinus SQL: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Potong dan simpan teks dokumen ke dalam tabel document_chunks beserta vektornya.
     *
     * @param  string  $text
     * @param  string  $documentTitle
     * @return int  Jumlah chunk yang berhasil disimpan
     */
    public function indexTextDocument(string $text, string $documentTitle = 'Pedoman Akademik 2025/2026'): int
    {
        // Bersihkan teks dan potong berdasarkan paragraf ganda / pasal
        $paragraphs = preg_split('/\n{2,}/', trim($text));
        if (!$paragraphs || count($paragraphs) === 0) {
            return 0;
        }

        $chunks = [];
        $currentChunk = '';

        $chunkSize = config('rag.chunk_size', 800);
        $chunkOverlap = config('rag.chunk_overlap', 150);

        // Gabungkan paragraf pendek sehingga setiap chunk
        foreach ($paragraphs as $p) {
            $pClean = trim(preg_replace('/\s+/', ' ', $p));
            if ($pClean === '') {
                continue;
            }

            if (mb_strlen($currentChunk) + mb_strlen($pClean) > $chunkSize && $currentChunk !== '') {
                $chunks[] = trim($currentChunk);
                // Overlap akhir
                $currentChunk = mb_substr($currentChunk, -$chunkOverlap) . ' ' . $pClean;
            } else {
                $currentChunk .= ($currentChunk === '' ? '' : "\n\n") . $pClean;
            }
        }

        if (trim($currentChunk) !== '') {
            $chunks[] = trim($currentChunk);
        }

        $savedCount = 0;
        foreach ($chunks as $idx => $chunkText) {
            $vector = $this->generateEmbedding($chunkText);
            
            $embeddingValue = null;
            if ($vector) {
                $embeddingValue = '[' . implode(',', $vector) . ']';
            }

            DocumentChunk::create([
                'document_title' => $documentTitle,
                'chunk_index' => $idx + 1,
                'chunk_text' => $chunkText,
                'token_count' => (int) round(mb_strlen($chunkText) / 4),
                'embedding' => $embeddingValue,
            ]);

            $savedCount++;
        }

        return $savedCount;
    }

    /**
     * Ekstraksi teks bersih dari file dokumen (.txt atau .pdf).
     */
    public function extractTextFromFile(string $filePath): ?string
    {
        if (!File::exists($filePath)) {
            return null;
        }

        // Tingkatkan batas memori agar mampu memproses file PDF presentasi/gambar besar
        ini_set('memory_limit', '-1');

        if (str_ends_with(strtolower($filePath), '.pdf')) {
            if (class_exists(\Smalot\PdfParser\Parser::class)) {
                try {
                    $parser = new \Smalot\PdfParser\Parser();
                    $pdf = $parser->parseFile($filePath);
                    $text = $pdf->getText();
                    unset($parser, $pdf);
                    if (function_exists('gc_collect_cycles')) {
                        gc_collect_cycles();
                    }
                    return $text;
                } catch (\Throwable $e) {
                    Log::error("PGVectorService: Gagal parse PDF {$filePath}: " . $e->getMessage());
                    return null;
                }
            } else {
                Log::warning("PGVectorService: Smalot PdfParser belum terinstall, tidak dapat membaca file PDF.");
                return null;
            }
        }

        return File::get($filePath);
    }

    /**
     * Dapatkan API Key Gemini dari DB SystemSettings atau .env
     */
    protected function getGeminiApiKey(): ?string
    {
        if ($this->geminiApiKey) {
            return $this->geminiApiKey;
        }

        try {
            $setting = SystemSetting::where('key', 'gemini_api_key')->first();
            if ($setting && !empty($setting->value)) {
                return $setting->value;
            }
        } catch (\Exception $e) {
            // Abaikan jika tabel belum ada / error
        }

        return null;
    }
}
