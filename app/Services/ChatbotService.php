<?php

namespace App\Services;

use App\Models\ChatLog;
use App\Models\ChatRule;
use Illuminate\Support\Str;

/**
 * ChatbotService — pusat logika pencocokan pesan (The Brain).
 *
 * Service ini mengimplementasikan arsitektur **Hybrid Chatbot** dengan dua tahap:
 * 1. **Rule-Based Matching** menggunakan algoritma Hybrid Scoring
 *    (Damerau-Levenshtein Distance + Ratcliff/Obershelp)
 *    dengan threshold kemiripan ≥ 80%.
 * 2. **AI Fallback** via GeminiService ATAU OllamaService (FastAPI RAG)
 *    ketika tidak ada rule yang cocok, ditentukan oleh variabel
 *    `AI_ENGINE` di `.env` (Strategy Pattern via konfigurasi).
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - **Strategy Pattern** (implisit): logika matching di-route melalui dua
 *   strategi berbeda (rule-based → AI) secara berurutan (Chain of Responsibility).
 * - **Damerau-Levenshtein Distance** adalah metrik edit-distance yang menghitung
 *   jumlah minimum operasi untuk mengubah satu string menjadi string lainnya.
 *   Mendukung 4 operasi: insertion, deletion, substitution, dan **transposition**
 *   (pertukaran dua karakter bersebelahan). Menurut Damerau (1964), lebih dari
 *   80% kesalahan ejaan manusia disebabkan oleh salah satu dari keempat jenis
 *   kesalahan satu-karakter ini, menjadikan algoritma ini lebih akurat untuk
 *   mendeteksi typo dibanding Levenshtein standar yang hanya mendukung 3 operasi.
 * - **Ratcliff/Obershelp** (Gestalt Pattern Matching) menghitung kemiripan
 *   berdasarkan Longest Common Substring secara rekursif dengan formula:
 *   2 × matches / (len(s1) + len(s2)). Melengkapi Damerau-Levenshtein
 *   dengan menangkap kesamaan pola yang terlewat oleh pendekatan edit-distance
 *   (Ratcliff & Metzener, 1988).
 * - **Hybrid Scoring**: max(Damerau-Levenshtein, Ratcliff/Obershelp) untuk
 *   mendapatkan deteksi terbaik dari masing-masing pendekatan.
 * - **Dependency Injection**: GeminiService dan OllamaService di-inject
 *   melalui constructor, mendukung prinsip DIP (Dependency Inversion Principle).
 * - **Open-Closed Principle (OCP)**: pergantian engine AI antara Gemini
 *   dan Ollama/FastAPI cukup dilakukan via konfigurasi `.env` (`AI_ENGINE`),
 *   tanpa mengubah kode ChatbotService maupun Controller.
 */
class ChatbotService
{
    /**
     * Threshold kemiripan minimum (dalam persen) agar dianggap cocok.
     *
     * Diperketat menjadi 85% untuk mengurangi false positive pada kueri kompleks,
     * namun tetap menoleransi typo ringan.
     */
    private const SIMILARITY_THRESHOLD = 85.0;
    /**
     * Panjang minimum input agar diproses oleh Levenshtein matching.
     *
     * Input di bawah 4 karakter terlalu pendek dan menghasilkan
     * false positive pada pencocokan kemiripan string.
     */
    private const MIN_INPUT_LENGTH = 4;

    /**
     * Default fallback response ketika AI tidak tersedia.
     */
    private const FALLBACK_RESPONSE = 'Maaf, saya belum memahami pertanyaan Anda. 🤔 Silakan coba tanyakan seputar jadwal kuliah, KRS, UKT, beasiswa, atau informasi kampus lainnya.';

    /**
     * Respons untuk input yang terlalu pendek.
     */
    private const TOO_SHORT_RESPONSE = 'Mohon ketik pertanyaan yang lebih lengkap (minimal 4 karakter) agar saya bisa membantu Anda. 😊';

    public function __construct(
        private readonly GeminiService $geminiService,
        private readonly OllamaService $ollamaService,
    ) {}

    /**
     * Menentukan engine AI yang aktif berdasarkan konfigurasi `AI_ENGINE`.
     *
     * @return string  'gemini' atau 'ollama'
     */
    private function getActiveEngine(): string
    {
        return config('services.ai_engine', 'gemini');
    }

    /**
     * Mencari respons chatbot berdasarkan pesan pengguna (Hybrid Approach).
     *
     * Algoritma Hybrid Matching:
     * 1. Validasi panjang minimum input (≥ 4 karakter)
     * 2. Normalisasi input (lowercase, strip punctuation)
     * 3. Iterasi setiap ChatRule aktif (diurutkan berdasarkan priority DESC)
     * 4. Untuk setiap keyword rule, bandingkan dengan setiap kata di pesan
     *    menggunakan Hybrid scoring (max dari Damerau-Levenshtein & Ratcliff/Obershelp)
     * 5. Jika ada keyword dengan similarity ≥ 80% → return rule response (source: 'rule')
     * 6. Jika tidak ada rule cocok → fallback ke AI engine aktif (source: 'ai')
     * 7. Log percakapan ke tabel `chat_logs`
     *
     * @param  string  $message  Pesan input dari pengguna
     * @param  int|null  $userId  ID user yang mengirim (null jika anonim)
     * @return array{response: string, source: string, matched_rule_id: int|null, similarity_score: float|null, matched_keywords: array<int, string>, ai_engine: string|null, is_rag_found: bool|null}
     */
    public function findResponse(string $message, ?int $userId = null, array $participantData = []): array
    {
        $startTime = microtime(true);
        $normalizedMessage = $this->normalizeText($message);

        if (empty(trim($normalizedMessage))) {
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);
            return $this->buildResult(self::FALLBACK_RESPONSE, 'rule', latencyMs: $latencyMs);
        }

        // Validasi minimum 4 karakter untuk menghindari ambiguitas
        if (mb_strlen(trim($normalizedMessage)) < self::MIN_INPUT_LENGTH) {
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);
            return $this->buildResult(self::TOO_SHORT_RESPONSE, 'rule', latencyMs: $latencyMs);
        }

        // --- Tahap 0: Fast Out-of-Domain Guard (Penolakan topik pemrograman & non-akademik) ---
        if ($this->isOutOfDomainQuery($normalizedMessage)) {
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);
            $response = 'Mohon maaf, saya adalah Asisten Pelayanan Akademik UNISKA MAB. 🎓 Saya khusus membantu memberikan informasi seputar pelayanan akademik, KRS, jadwal perkuliahan, UKT, dan layanan portal SIA kampus. Saya tidak dapat menjawab atau membantu pertanyaan di luar topik akademik tersebut. 😊';
            $result = $this->buildResult($response, 'rule', latencyMs: $latencyMs);
            $chatLogId = $this->logConversation($userId, $message, $result, $participantData);
            $result['chat_log_id'] = $chatLogId;
            return $result;
        }

        // --- Tahap 1: Rule-Based Matching (Hybrid: Damerau-Levenshtein + Ratcliff/Obershelp) ---
        $ruleResult = $this->matchByHybridSimilarity($normalizedMessage);

        if ($ruleResult !== null) {
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);
            $result = $this->buildResult(
                $ruleResult['response'],
                'rule',
                $ruleResult['rule_id'],
                $ruleResult['similarity_score'],
                $ruleResult['matched_keywords'],
                latencyMs: $latencyMs,
            );

            $chatLogId = $this->logConversation($userId, $message, $result, $participantData);
            $result['chat_log_id'] = $chatLogId;

            return $result;
        }

        // --- Tahap 2: AI Fallback (Gemini Cloud ATAU Ollama/FastAPI RAG Lokal) ---
        $activeEngine = $this->getActiveEngine();

        try {
            if ($activeEngine === 'ollama') {
                // === Engine Lokal: FastAPI RAG Backend → Ollama Qwen 2.5 ===
                $sessionId = !empty($participantData['nama_mahasiswa'])
                    ? md5($participantData['nama_mahasiswa'] . ($participantData['prodi'] ?? ''))
                    : 'anon-' . session()->getId();

                $ollamaResult = $this->ollamaService->generateResponse($message, $sessionId);

                // === AUTO-FALLBACK SEAMLESS KE GEMINI CLOUD API JIKA OLLAMA/TUNNEL TIMEOUT/GAGAL ===
                if (!$ollamaResult['is_rag_found'] && (
                    str_contains(strtolower($ollamaResult['response']), 'tidak dapat dihubungi') ||
                    str_contains(strtolower($ollamaResult['response']), 'curl error') ||
                    str_contains(strtolower($ollamaResult['response']), 'timeout') ||
                    empty(trim($ollamaResult['response']))
                )) {
                    Log::warning("ChatbotService: Ollama/Tunnel lambat/offline, auto-switching ke Gemini Cloud API agar tidak stuck.");
                    $aiResponse = $this->geminiService->generateResponse($message);
                    $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

                    $result = $this->buildResult(
                        $aiResponse,
                        'ai',
                        aiEngine: 'gemini',
                        isRagFound: true,
                        latencyMs: $latencyMs,
                    );
                } else {
                    $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

                    $result = $this->buildResult(
                        $ollamaResult['response'],
                        'ai',
                        aiEngine: 'ollama',
                        isRagFound: $ollamaResult['is_rag_found'],
                        latencyMs: $latencyMs,
                    );
                }
            } else {
                // === Engine Cloud: Google Gemini API ===
                $aiResponse = $this->geminiService->generateResponse($message);
                $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

                $result = $this->buildResult(
                    $aiResponse,
                    'ai',
                    aiEngine: 'gemini',
                    latencyMs: $latencyMs,
                );
            }
        } catch (\Throwable $e) {
            Log::error('ChatbotService: AI Fallback Fatal Exception/Timeout', ['error' => $e->getMessage()]);
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);
            $result = $this->buildResult(
                "Mohon maaf, koneksi ke server AI saat ini sedang mengalami keterlambatan/timeout. Namun untuk informasi resmi pelayanan akademik UNISKA MAB, Anda dapat langsung mengetik kata kunci utama seperti **'KRS'**, **'Yudisium'**, **'Kalender'**, **'BAK'**, atau **'Rektor'** untuk mendapatkan panduan cepat.",
                'ai',
                aiEngine: $activeEngine,
                isRagFound: false,
                latencyMs: $latencyMs,
            );
        }

        $chatLogId = $this->logConversation($userId, $message, $result, $participantData);
        $result['chat_log_id'] = $chatLogId;

        return $result;
    }

    /**
     * Tahap 1: Pencocokan rule-based menggunakan Hybrid Scoring
     * (Damerau-Levenshtein Distance + Ratcliff/Obershelp).
     *
     * Untuk setiap ChatRule aktif, setiap keyword dibandingkan dengan
     * setiap kata dalam pesan. Jika keyword multi-kata (misal "kartu rencana studi"),
     * dilakukan perbandingan sliding window.
     *
     * Hybrid scoring menggabungkan dua algoritma:
     * - Damerau-Levenshtein: unggul dalam deteksi transposisi huruf bersebelahan
     * - Ratcliff/Obershelp: unggul dalam pencocokan pola substring rekursif
     * Skor akhir = max(DL_score, RO_score) untuk toleransi typo maksimal.
     *
     * @param  string  $normalizedMessage  Pesan yang sudah dinormalisasi
     * @return array{response: string, rule_id: int, similarity_score: float, matched_keywords: array<int, string>}|null
     */
    private function matchByHybridSimilarity(string $normalizedMessage): ?array
    {
        $rules = ChatRule::active()
            ->highestPriority()
            ->get();

        $bestMatch = null;
        $bestScore = 0.0;

        foreach ($rules as $rule) {
            foreach ($rule->keywords as $keyword) {
                $normalizedKeyword = $this->normalizeText($keyword);
                $score = $this->calculateSimilarity($normalizedMessage, $normalizedKeyword);

                if ($score >= self::SIMILARITY_THRESHOLD) {
                    $currentKeywordLength = mb_strlen($keyword);
                    $bestKeywordLength = $bestMatch ? mb_strlen($bestMatch['matched_keywords'][0]) : 0;

                    // Mengutamakan skor yang lebih tinggi.
                    // Jika skor sama (misal 100% exact match), utamakan keyword yang lebih panjang,
                    // Karena keyword panjang ("biaya kuliah") lebih spesifik daripada ("kuliah").
                    if ($score > $bestScore || ($score == $bestScore && $currentKeywordLength > $bestKeywordLength)) {
                        $bestScore = $score;
                        $bestMatch = [
                            'response' => $rule->response,
                            'rule_id' => $rule->id,
                            'similarity_score' => round($score, 2),
                            'matched_keywords' => [$keyword],
                        ];
                    }
                }
            }
        }

        return $bestMatch;
    }

    /**
     * Menghitung persentase kemiripan antara pesan dan keyword (Hybrid Scoring).
     *
     * Strategi matching:
     * 1. **Substring Match** — jika keyword ditemukan sebagai substring dalam pesan,
     *    langsung return 100% (exact match).
     * 2. **Per-Word Hybrid** — jika keyword single-word, bandingkan dengan setiap
     *    kata di pesan menggunakan max(Damerau-Levenshtein, Ratcliff/Obershelp).
     * 3. **Phrase Hybrid** — jika keyword multi-word, bandingkan keseluruhan phrase
     *    dari pesan (sliding window) dengan keyword menggunakan hybrid scoring.
     *
     * Catatan Akademis — Dua algoritma yang digabungkan:
     * 1. **Damerau-Levenshtein** (OSA): edit-distance dengan 4 operasi (insertion,
     *    deletion, substitution, transposition). Formula: (1 - dist/maxLen) × 100.
     * 2. **Ratcliff/Obershelp** (Gestalt Pattern Matching): mencari Longest Common
     *    Substring secara rekursif. Formula: 2 × matches / (len1 + len2) × 100.
     *
     * Skor hybrid = max(DL_score, RO_score), mengambil interpretasi terbaik
     * dari kedua algoritma untuk setiap perbandingan.
     *
     * @param  string  $message  Pesan yang sudah dinormalisasi
     * @param  string  $keyword  Keyword yang sudah dinormalisasi
     * @return float  Persentase kemiripan (0-100)
     */
    private function calculateSimilarity(string $message, string $keyword): float
    {
        // Exact substring match (Whole Word Only) → 100%
        // Menggunakan regex \b untuk memastikan keyword utuh, bukan bagian dari kata lain
        // (Contoh: mencegah "machine" match dengan keyword "hi")
        if (preg_match('/\b' . preg_quote($keyword, '/') . '\b/i', $message)) {
            return 100.0;
        }

        $messageWords = preg_split('/\s+/', $message, -1, PREG_SPLIT_NO_EMPTY);
        $keywordWords = preg_split('/\s+/', $keyword, -1, PREG_SPLIT_NO_EMPTY);

        if (empty($messageWords) || empty($keywordWords)) {
            return 0.0;
        }

        // Single-word keyword: bandingkan dengan setiap kata di pesan
        if (count($keywordWords) === 1) {
            $maxScore = 0.0;
            foreach ($messageWords as $word) {
                // Guard: skip kata terlalu pendek (< 6 karakter) pada per-word comparison.
                // Kata pendek seperti "masih"↔"makasih" menghasilkan false positive tinggi
                // karena Ratcliff/Obershelp mengukur kesamaan substring, bukan konteks semantik.
                // Catatan: exact substring match (100%) di atas TIDAK terpengaruh oleh guard ini.
                if (mb_strlen($word) < 6 || mb_strlen($keyword) < 6) {
                    continue;
                }

                // Hybrid: ambil skor tertinggi dari kedua algoritma
                $dlScore = $this->damerauLevenshteinPercentage($word, $keyword);
                $roScore = $this->ratcliffObershelpPercentage($word, $keyword);
                $combinedScore = max($dlScore, $roScore);
                $maxScore = max($maxScore, $combinedScore);
            }

            return $maxScore;
        }

        // Multi-word keyword: sliding window comparison
        $keywordPhrase = implode(' ', $keywordWords);
        $windowSize = count($keywordWords);

        if (count($messageWords) < $windowSize) {
            $dlScore = $this->damerauLevenshteinPercentage($message, $keywordPhrase);
            $roScore = $this->ratcliffObershelpPercentage($message, $keywordPhrase);
            return max($dlScore, $roScore);
        }

        $maxScore = 0.0;
        for ($i = 0; $i <= count($messageWords) - $windowSize; $i++) {
            $window = implode(' ', array_slice($messageWords, $i, $windowSize));
            // Hybrid: ambil skor tertinggi dari kedua algoritma
            $dlScore = $this->damerauLevenshteinPercentage($window, $keywordPhrase);
            $roScore = $this->ratcliffObershelpPercentage($window, $keywordPhrase);
            $combinedScore = max($dlScore, $roScore);
            $maxScore = max($maxScore, $combinedScore);
        }

        return $maxScore;
    }

    /**
     * Menghitung Damerau-Levenshtein Distance antara dua string.
     *
     * Implementasi menggunakan varian Optimal String Alignment (OSA)
     * dengan Dynamic Programming (matriks 2D).
     *
     * 4 operasi yang didukung:
     * 1. Insertion  — menyisipkan satu karakter
     * 2. Deletion   — menghapus satu karakter
     * 3. Substitution — mengganti satu karakter dengan karakter lain
     * 4. Transposition — menukar posisi dua karakter bersebelahan
     *
     * Kompleksitas:
     * - Waktu: O(m × n) di mana m dan n adalah panjang masing-masing string
     * - Ruang: O(m × n) untuk matriks Dynamic Programming
     *
     * Untuk keyword chatbot yang relatif pendek (1-5 kata), performa ini
     * sangat memadai dan tidak menimbulkan bottleneck.
     *
     * @param  string  $str1  String pertama
     * @param  string  $str2  String kedua
     * @return int  Jumlah minimum operasi edit yang diperlukan
     */
    private function damerauLevenshteinDistance(string $str1, string $str2): int
    {
        $len1 = mb_strlen($str1);
        $len2 = mb_strlen($str2);

        // Base cases
        if ($len1 === 0) return $len2;
        if ($len2 === 0) return $len1;

        // Inisialisasi matriks Dynamic Programming
        $d = [];
        for ($i = 0; $i <= $len1; $i++) {
            $d[$i][0] = $i;
        }
        for ($j = 0; $j <= $len2; $j++) {
            $d[0][$j] = $j;
        }

        // Iterasi pengisian matriks
        for ($i = 1; $i <= $len1; $i++) {
            $char1 = mb_substr($str1, $i - 1, 1);

            for ($j = 1; $j <= $len2; $j++) {
                $char2 = mb_substr($str2, $j - 1, 1);
                $cost = ($char1 === $char2) ? 0 : 1;

                // Minimum dari 3 operasi dasar (Levenshtein standar)
                $d[$i][$j] = min(
                    $d[$i - 1][$j] + 1,         // Deletion
                    $d[$i][$j - 1] + 1,         // Insertion
                    $d[$i - 1][$j - 1] + $cost  // Substitution
                );

                // Operasi ke-4: Transposisi (Damerau Extension)
                // Cek apakah dua karakter bersebelahan saling tertukar
                if ($i > 1 && $j > 1) {
                    $prevChar1 = mb_substr($str1, $i - 2, 1);
                    $prevChar2 = mb_substr($str2, $j - 2, 1);

                    if ($char1 === $prevChar2 && $prevChar1 === $char2) {
                        $d[$i][$j] = min(
                            $d[$i][$j],
                            $d[$i - 2][$j - 2] + $cost  // Transposition
                        );
                    }
                }
            }
        }

        return $d[$len1][$len2];
    }

    /**
     * Mengonversi Damerau-Levenshtein Distance menjadi persentase kemiripan.
     *
     * Formula: similarity = (1 - distance / max(len(s1), len(s2))) × 100
     *
     * @param  string  $str1  String pertama
     * @param  string  $str2  String kedua
     * @return float  Persentase kemiripan (0.0 - 100.0)
     */
    private function damerauLevenshteinPercentage(string $str1, string $str2): float
    {
        $maxLen = max(mb_strlen($str1), mb_strlen($str2));

        if ($maxLen === 0) {
            return 100.0; // Dua string kosong dianggap identik
        }

        $distance = $this->damerauLevenshteinDistance($str1, $str2);

        return (1 - ($distance / $maxLen)) * 100;
    }

    /**
     * Menghitung persentase kemiripan menggunakan algoritma Ratcliff/Obershelp.
     *
     * Ratcliff/Obershelp (Gestalt Pattern Matching) bekerja dengan:
     * 1. Mencari Longest Common Substring (LCS) antara dua string
     * 2. Secara rekursif mencari LCS di sisa string kiri dan kanan
     * 3. Menghitung rasio: 2 × total_matching_chars / (len(s1) + len(s2))
     *
     * Kelebihan dibanding edit-distance:
     * - Lebih intuitif untuk frasa/kata panjang dengan pola serupa
     * - Tidak tergantung pada urutan operasi edit
     *
     * PHP menyediakan implementasi native via `similar_text()` (ditulis dalam C),
     * sehingga performanya sangat cepat meskipun bukan implementasi kustom.
     *
     * Referensi:
     * Ratcliff, J. W., & Metzener, D. E. (1988). Pattern matching:
     * The Gestalt approach. Dr. Dobb's Journal, 13(7), 46–51.
     *
     * @param  string  $str1  String pertama
     * @param  string  $str2  String kedua
     * @return float  Persentase kemiripan (0.0 - 100.0)
     */
    private function ratcliffObershelpPercentage(string $str1, string $str2): float
    {
        if (mb_strlen($str1) === 0 && mb_strlen($str2) === 0) {
            return 100.0;
        }

        similar_text($str1, $str2, $percent);

        return $percent;
    }

    /**
     * Normalisasi teks input: lowercase dan hapus tanda baca.
     *
     * Catatan Akademis:
     * Text Normalization adalah tahap pra-pemrosesan (preprocessing) dalam
     * Natural Language Processing (NLP) yang bertujuan menyeragamkan format
     * teks sebelum dilakukan analisis lebih lanjut.
     */
    private function normalizeText(string $text): string
    {
        $lowered = Str::lower($text);

        // Strip punctuation, preserve spaces and alphanumeric
        return preg_replace('/[^\p{L}\p{N}\s]/u', '', $lowered);
    }

    /**
     * Memeriksa apakah input pesan berada di luar konteks pelayanan akademik kampus (Out-of-Domain).
     */
    private function isOutOfDomainQuery(string $text): bool
    {
        $outOfDomainKeywords = [
            'javascript', 'python', 'coding', 'source code', 'buatkan kode', 'c++', 'html', 'css', 
            'sql', 'random password', 'script', 'resep', 'masakan', 'lirik lagu', 'berita bola', 
            'prediksi bola', 'tutorial pemrograman', 'program java', 'code javascript',
        ];

        foreach ($outOfDomainKeywords as $keyword) {
            if (str_contains($text, $keyword)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Menyimpan log percakapan ke tabel chat_logs.
     *
     * Kolom `source` menyimpan label engine yang menjawab:
     * - 'rule' untuk rule-based matching
     * - 'ai' untuk AI fallback (Gemini atau Ollama)
     *
     * Kolom `ai_engine` menyimpan nama engine spesifik ('gemini' / 'ollama')
     * agar Dashboard Admin dapat membedakan sumber AI fallback secara akurat.
     *
     * @param  int|null  $userId  ID user (null jika anonim)
     * @param  string  $originalMessage  Pesan asli (belum dinormalisasi)
     * @param  array  $result  Hasil respons chatbot
     */
    private function logConversation(?int $userId, string $originalMessage, array $result, array $participantData = []): ?int
    {
        try {
            // Validasi FK user_id agar tidak melanggar constraint jika ID dari cookie lama tidak ada di tabel users
            if ($userId !== null && !\App\Models\User::where('id', $userId)->exists()) {
                $userId = null;
            }

            $columns = \Illuminate\Support\Facades\Schema::getColumnListing('chat_logs');
            $data = [
                'user_message' => substr($originalMessage, 0, 1000),
                'bot_response' => substr($result['response'] ?? '', 0, 5000),
                'source' => in_array(($result['source'] ?? 'rule'), ['rule', 'ai']) ? ($result['source'] ?? 'rule') : 'rule',
            ];

            if (in_array('user_id', $columns)) $data['user_id'] = $userId;
            if (in_array('nama_mahasiswa', $columns) && !empty($participantData['nama_mahasiswa'])) $data['nama_mahasiswa'] = substr(trim($participantData['nama_mahasiswa']), 0, 100);
            if (in_array('npm', $columns) && !empty($participantData['npm'])) $data['npm'] = substr(trim($participantData['npm']), 0, 50);
            if (in_array('fakultas', $columns) && !empty($participantData['fakultas'])) $data['fakultas'] = substr(trim($participantData['fakultas']), 0, 100);
            if (in_array('prodi', $columns) && !empty($participantData['prodi'])) $data['prodi'] = substr(trim($participantData['prodi']), 0, 100);
            if (in_array('matched_rule_id', $columns) && !empty($result['matched_rule_id'])) $data['matched_rule_id'] = (int) $result['matched_rule_id'];
            if (in_array('similarity_score', $columns) && is_numeric($result['similarity_score'] ?? null)) $data['similarity_score'] = (float) $result['similarity_score'];
            if (in_array('latency_ms', $columns) && is_numeric($result['latency_ms'] ?? null)) $data['latency_ms'] = (int) $result['latency_ms'];
            if (in_array('ai_engine', $columns) && !empty($result['ai_engine'])) $data['ai_engine'] = substr($result['ai_engine'], 0, 50);

            $log = ChatLog::create($data);
            \Illuminate\Support\Facades\Log::info("ChatbotService: Sukses menyimpan log ID {$log->id} via koneksi DB: " . \Illuminate\Support\Facades\DB::getDefaultConnection());
            return $log->id;
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('ChatbotService: Gagal menyimpan log utama: ' . $e->getMessage());

            try {
                // Reset/reconnect koneksi database jika transaksi PostgreSQL sebelumnya aborted (25P02)
                \Illuminate\Support\Facades\DB::reconnect();

                $logCore = ChatLog::create([
                    'user_id' => null,
                    'user_message' => substr($originalMessage, 0, 1000),
                    'bot_response' => substr($result['response'] ?? '', 0, 5000),
                    'source' => in_array(($result['source'] ?? 'rule'), ['rule', 'ai']) ? ($result['source'] ?? 'rule') : 'rule',
                ]);
                \Illuminate\Support\Facades\Log::info("ChatbotService: Sukses menyimpan log core ID {$logCore->id} via koneksi DB: " . \Illuminate\Support\Facades\DB::getDefaultConnection());
                return $logCore->id;
            } catch (\Throwable $eFinal) {
                \Illuminate\Support\Facades\Log::error('ChatbotService: Gagal final menyimpan log core: ' . $eFinal->getMessage());
                return null;
            }
        }
    }

    /**
     * Membangun array hasil respons yang terstruktur.
     *
     * @param  string  $response  Teks respons chatbot
     * @param  string  $source  Sumber jawaban: 'rule' atau 'ai'
     * @param  int|null  $matchedRuleId  ID rule yang cocok
     * @param  float|null  $similarityScore  Persentase kemiripan
     * @param  array<int, string>  $matchedKeywords  Keywords yang cocok
     * @param  string|null  $aiEngine  Engine AI yang digunakan ('gemini' / 'ollama')
     * @param  bool|null  $isRagFound  Apakah data ditemukan di RAG (khusus Ollama)
     * @return array{response: string, source: string, matched_rule_id: int|null, similarity_score: float|null, matched_keywords: array<int, string>, ai_engine: string|null, is_rag_found: bool|null, latency_ms: int|null}
     */
    private function buildResult(
        string $response,
        string $source,
        ?int $matchedRuleId = null,
        ?float $similarityScore = null,
        array $matchedKeywords = [],
        ?string $aiEngine = null,
        ?bool $isRagFound = null,
        ?int $latencyMs = null,
    ): array {
        return [
            'response' => $response,
            'source' => $source,
            'matched_rule_id' => $matchedRuleId,
            'similarity_score' => $similarityScore,
            'matched_keywords' => $matchedKeywords,
            'ai_engine' => $aiEngine,
            'is_rag_found' => $isRagFound,
            'latency_ms' => $latencyMs,
        ];
    }
}
