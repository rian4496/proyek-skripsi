<?php

namespace App\Console\Commands;

use App\Models\ChatRule;
use App\Services\ChatbotService;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use ReflectionClass;
use ReflectionMethod;

/**
 * ChatbotAccuracyTestCommand — Pengujian akurasi Hybrid Matching
 * (Damerau-Levenshtein Distance + Ratcliff/Obershelp) terhadap
 * konfigurasi chat_rules & threshold PRODUKSI yang sedang aktif.
 *
 * Catatan Akademis (Skripsi Bab 4 — Metodologi Pengujian):
 *
 * Command ini TIDAK menulis ulang algoritma DL/RO. Method privat asli di
 * {@see ChatbotService} — matchByHybridSimilarity(), calculateSimilarity(),
 * damerauLevenshteinPercentage(), ratcliffObershelpPercentage() — dipanggil
 * langsung via Reflection API, sehingga skor & keputusan routing yang
 * dihasilkan IDENTIK dengan yang dipakai findResponse() di produksi.
 *
 * Satu-satunya kode "tambahan" di sini adalah loop orkestrasi untuk
 * memecah skor hybrid menjadi kontribusi DL-saja vs RO-saja per test case
 * (breakdownScores()) dan pencarian keyword terdekat untuk kasus AI
 * Fallback (findClosestKeyword()) — keduanya HANYA memanggil ulang method
 * matematis asli di atas, tidak menghitung ulang jarak/similarity sendiri.
 *
 * Tahap AI Fallback (Gemini/Ollama) SENGAJA tidak dipanggil agar:
 * 1. Hasil deterministik & repeatable (tidak bergantung jaringan/API key).
 * 2. Tidak menulis data uji ke tabel chat_logs / peserta_uji_coba produksi.
 * Kolom Waktu_ms karena itu hanya mengukur waktu pencarian rule (tahap
 * matchByHybridSimilarity), bukan latensi AI.
 */
class ChatbotAccuracyTestCommand extends Command
{
    protected $signature = 'chatbot:test-akurasi {--output= : Nama file CSV output}';

    protected $description = 'Menjalankan test case akurasi Hybrid Matching (DL+RO) terhadap chat_rules & threshold produksi saat ini';

    private ChatbotService $service;

    private ReflectionClass $reflection;

    public function handle(ChatbotService $service): int
    {
        $this->service = $service;
        $this->reflection = new ReflectionClass($service);

        $rules = ChatRule::active()->highestPriority()->get();

        if ($rules->isEmpty()) {
            $this->error('Tidak ada ChatRule aktif di database. Jalankan seeder terlebih dahulu.');

            return self::FAILURE;
        }

        $this->info("Memuat {$rules->count()} chat_rules aktif dari database (bukan hardcode)...");
        $this->newLine();

        $rows = [];
        $no = 1;

        foreach ($this->testCases() as [$question, $category]) {
            $rows[] = $this->runTestCase($no++, $question, $category, $rules);
        }

        $this->renderTable($rows);
        $this->renderSummary($rows);

        $csvPath = $this->exportCsv($rows);
        $this->newLine();
        $this->info("CSV tersimpan di: {$csvPath}");

        return self::SUCCESS;
    }

    /**
     * @return array<int, array{0: string, 1: string}>
     */
    private function testCases(): array
    {
        return [
            ['jadwal kuliah', 'Exact Match'],
            ['cara isi krs', 'Exact Match'],
            ['biaya kuliah', 'Exact Match'],
            ['informasi beasiswa', 'Exact Match'],
            ['pendaftaran wisuda', 'Exact Match'],
            ['perpustakaan', 'Exact Match'],
            ['surat keterangan aktif', 'Exact Match'],
            ['info skripsi', 'Exact Match'],

            ['jadwl kuliah', 'Typo'],
            ['biay kuliah', 'Typo'],
            ['beasiwa', 'Typo'],
            ['perpustakaaan', 'Typo'],
            ['wisudah', 'Typo'],
            ['skripsii', 'Typo'],

            ['jadwla kuliah', 'Transposisi'],
            ['katru rencana studi', 'Transposisi'],
            ['beaswia', 'Transposisi'],
            ['wisuad', 'Transposisi'],
            ['skripis', 'Transposisi'],
            ['perpustakaan', 'Transposisi'],

            ['adakah informasi kontak kaprodi teknik informatika?', 'AI Fallback'],
            ['bagaimana cara mengurus cuti kuliah?', 'AI Fallback'],
            ['apa syarat pindah jurusan?', 'AI Fallback'],

            ['informasi biaya kuliah', 'Multi-word'],
            ['kapan kuliah dimulai', 'Multi-word'],
            ['mau tanya soal ukt', 'Multi-word'],
        ];
    }

    /**
     * @param  Collection<int, ChatRule>  $rules
     */
    private function runTestCase(int $no, string $question, string $category, Collection $rules): array
    {
        $normalizedMessage = $this->invokePrivate('normalizeText', [$question]);

        $start = microtime(true);
        $match = $this->invokePrivate('matchByHybridSimilarity', [$normalizedMessage]);
        $elapsedMs = round((microtime(true) - $start) * 1000, 2);

        if ($match !== null) {
            // Rute & keyword pemenang 100% dari method produksi asli.
            $routing = 'rule';
            $keyword = $match['matched_keywords'][0];
            $hybridScore = $match['similarity_score'];
        } else {
            $routing = 'ai';
            // Tidak ada keyword yang lolos threshold 85% — cari keyword
            // TERDEKAT (meski di bawah threshold) untuk keperluan diagnostik,
            // tetap memakai calculateSimilarity() asli, bukan hitungan baru.
            [$keyword, $hybridScore] = $this->findClosestKeyword($normalizedMessage, $rules);
        }

        [$dlScore, $roScore] = $keyword !== null
            ? $this->breakdownScores($normalizedMessage, $this->invokePrivate('normalizeText', [$keyword]))
            : [null, null];

        return [
            'no' => $no,
            'pertanyaan' => $question,
            'kategori' => $category,
            'skor_dl' => $dlScore,
            'skor_ro' => $roScore,
            'skor_hybrid' => $hybridScore,
            'keyword' => $keyword ?? '-',
            'routing' => $routing,
            'waktu_ms' => $elapsedMs,
        ];
    }

    /**
     * Mencari keyword dengan skor hybrid tertinggi di seluruh rule aktif,
     * TANPA filter threshold — dipakai hanya untuk baris "ai" agar terlihat
     * seberapa dekat query tersebut dengan keyword terdekat.
     *
     * Menggunakan calculateSimilarity() ASLI (reflected) untuk setiap
     * pasangan; loop di sini hanya mencari nilai maksimum, sama seperti
     * struktur pemilihan pemenang di matchByHybridSimilarity() (tie-break:
     * skor lebih tinggi, lalu keyword lebih panjang).
     *
     * @param  Collection<int, ChatRule>  $rules
     * @return array{0: string|null, 1: float|null}
     */
    private function findClosestKeyword(string $normalizedMessage, Collection $rules): array
    {
        $bestKeyword = null;
        $bestScore = 0.0;

        foreach ($rules as $rule) {
            foreach ($rule->keywords as $keyword) {
                $normalizedKeyword = $this->invokePrivate('normalizeText', [$keyword]);
                $score = $this->invokePrivate('calculateSimilarity', [$normalizedMessage, $normalizedKeyword]);

                $bestLen = $bestKeyword ? mb_strlen($bestKeyword) : 0;
                if ($score > $bestScore || ($score == $bestScore && mb_strlen($keyword) > $bestLen)) {
                    $bestScore = $score;
                    $bestKeyword = $keyword;
                }
            }
        }

        return [$bestKeyword, $bestKeyword !== null ? round($bestScore, 2) : null];
    }

    /**
     * Memecah skor hybrid gabungan menjadi kontribusi Damerau-Levenshtein
     * SAJA vs Ratcliff/Obershelp SAJA, untuk pasangan (message, keyword)
     * yang SUDAH ditentukan menjadi pemenang oleh kode produksi.
     *
     * Struktur loop (exact substring shortcut → single-word guard <6 char →
     * sliding window multi-word) sengaja disalin identik dari
     * calculateSimilarity() supaya breakdown-nya konsisten dengan skor
     * gabungan yang dilaporkan — tapi setiap perhitungan jarak/similarity
     * TETAP memanggil damerauLevenshteinPercentage() & ratcliffObershelpPercentage()
     * asli via reflection, bukan implementasi baru.
     *
     * @return array{0: float, 1: float}
     */
    private function breakdownScores(string $normalizedMessage, string $normalizedKeyword): array
    {
        if (preg_match('/\b'.preg_quote($normalizedKeyword, '/').'\b/i', $normalizedMessage)) {
            return [100.0, 100.0];
        }

        $messageWords = preg_split('/\s+/', $normalizedMessage, -1, PREG_SPLIT_NO_EMPTY);
        $keywordWords = preg_split('/\s+/', $normalizedKeyword, -1, PREG_SPLIT_NO_EMPTY);

        if (empty($messageWords) || empty($keywordWords)) {
            return [0.0, 0.0];
        }

        $maxDl = 0.0;
        $maxRo = 0.0;

        if (count($keywordWords) === 1) {
            foreach ($messageWords as $word) {
                if (mb_strlen($word) < 6 || mb_strlen($normalizedKeyword) < 6) {
                    continue;
                }
                $maxDl = max($maxDl, $this->invokePrivate('damerauLevenshteinPercentage', [$word, $normalizedKeyword]));
                $maxRo = max($maxRo, $this->invokePrivate('ratcliffObershelpPercentage', [$word, $normalizedKeyword]));
            }

            return [round($maxDl, 2), round($maxRo, 2)];
        }

        $keywordPhrase = implode(' ', $keywordWords);
        $windowSize = count($keywordWords);

        if (count($messageWords) < $windowSize) {
            $maxDl = $this->invokePrivate('damerauLevenshteinPercentage', [$normalizedMessage, $keywordPhrase]);
            $maxRo = $this->invokePrivate('ratcliffObershelpPercentage', [$normalizedMessage, $keywordPhrase]);

            return [round($maxDl, 2), round($maxRo, 2)];
        }

        for ($i = 0; $i <= count($messageWords) - $windowSize; $i++) {
            $window = implode(' ', array_slice($messageWords, $i, $windowSize));
            $maxDl = max($maxDl, $this->invokePrivate('damerauLevenshteinPercentage', [$window, $keywordPhrase]));
            $maxRo = max($maxRo, $this->invokePrivate('ratcliffObershelpPercentage', [$window, $keywordPhrase]));
        }

        return [round($maxDl, 2), round($maxRo, 2)];
    }

    private function invokePrivate(string $method, array $args = []): mixed
    {
        $m = $this->reflection->getMethod($method);
        $m->setAccessible(true);

        return $m->invokeArgs($this->service, $args);
    }

    private function renderTable(array $rows): void
    {
        $this->table(
            ['No', 'Pertanyaan', 'Kategori', 'DL', 'RO', 'Hybrid', 'Keyword', 'Routing', 'ms'],
            array_map(fn (array $r) => [
                $r['no'],
                $r['pertanyaan'],
                $r['kategori'],
                $r['skor_dl'] ?? '-',
                $r['skor_ro'] ?? '-',
                $r['skor_hybrid'] ?? '-',
                $r['keyword'],
                $r['routing'],
                $r['waktu_ms'],
            ], $rows)
        );
    }

    private function renderSummary(array $rows): void
    {
        $totalRule = collect($rows)->where('routing', 'rule')->count();
        $totalAi = collect($rows)->where('routing', 'ai')->count();
        $total = count($rows);

        $correct = 0;
        foreach ($rows as $row) {
            $expected = $row['kategori'] === 'AI Fallback' ? 'ai' : 'rule';
            if ($row['routing'] === $expected) {
                $correct++;
            }
        }
        $accuracy = $total > 0 ? round($correct / $total * 100, 2) : 0;

        $this->newLine();
        $this->info('=== RINGKASAN ===');
        $this->line("Threshold aktif   : ".ChatbotServiceThresholdReflector::get($this->reflection).'%');
        $this->line("Total test case   : {$total}");
        $this->line("Routing ke rule   : {$totalRule}");
        $this->line("Routing ke ai     : {$totalAi}");
        $this->line("Akurasi vs ekspektasi kategori (AI Fallback=ai, lainnya=rule): {$correct}/{$total} ({$accuracy}%)");
    }

    private function exportCsv(array $rows): string
    {
        $filename = $this->option('output') ?: 'laporan_hasil_uji_'.now()->format('Y-m-d_His').'.csv';
        $path = base_path($filename);

        $fh = fopen($path, 'w');
        fwrite($fh, "\xEF\xBB\xBF");
        fputcsv($fh, ['No', 'Pertanyaan', 'Kategori', 'Skor_DL', 'Skor_RO', 'Skor_Hybrid', 'Keyword_Cocok', 'Routing', 'Waktu_ms']);

        foreach ($rows as $row) {
            fputcsv($fh, [
                $row['no'],
                $row['pertanyaan'],
                $row['kategori'],
                $row['skor_dl'] ?? '-',
                $row['skor_ro'] ?? '-',
                $row['skor_hybrid'] ?? '-',
                $row['keyword'],
                $row['routing'],
                $row['waktu_ms'],
            ]);
        }

        fclose($fh);

        return $path;
    }
}

/**
 * Helper kecil untuk membaca nilai konstanta SIMILARITY_THRESHOLD asli
 * dari ChatbotService via reflection, agar angka di ringkasan laporan
 * selalu sinkron dengan kode (tidak hardcode 85 di command ini).
 */
class ChatbotServiceThresholdReflector
{
    public static function get(ReflectionClass $reflection): float
    {
        return $reflection->getConstant('SIMILARITY_THRESHOLD');
    }
}
