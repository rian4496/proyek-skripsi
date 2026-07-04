<?php
/**
 * Script Pengujian Hybrid Chatbot — Pencatatan Skor Kemiripan
 * 
 * Script ini menguji serangkaian pertanyaan terhadap ChatbotService
 * dan mencatat: skor kemiripan, keyword yang cocok, sumber jawaban,
 * dan waktu respons. Data ini digunakan untuk analisis Bab IV Skripsi.
 *
 * Algoritma: Hybrid Scoring (Damerau-Levenshtein Distance +
 * Ratcliff/Obershelp Gestalt Pattern Matching)
 */

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = app(App\Services\ChatbotService::class);

// Daftar pertanyaan uji: campuran rule-matchable dan AI-fallback
$testCases = [
    // === Grup 1: Pertanyaan yang seharusnya cocok dengan Rule (Exact Match) ===
    ['query' => 'jadwal kuliah', 'expected_source' => 'rule', 'kategori' => 'Exact Match'],
    ['query' => 'cara isi krs', 'expected_source' => 'rule', 'kategori' => 'Exact Match'],
    ['query' => 'biaya kuliah', 'expected_source' => 'rule', 'kategori' => 'Exact Match'],
    ['query' => 'informasi beasiswa', 'expected_source' => 'rule', 'kategori' => 'Exact Match'],
    ['query' => 'pendaftaran wisuda', 'expected_source' => 'rule', 'kategori' => 'Exact Match'],
    ['query' => 'perpustakaan', 'expected_source' => 'rule', 'kategori' => 'Exact Match'],
    ['query' => 'surat keterangan aktif', 'expected_source' => 'rule', 'kategori' => 'Exact Match'],
    ['query' => 'info skripsi', 'expected_source' => 'rule', 'kategori' => 'Exact Match'],

    // === Grup 2: Pertanyaan dengan Typo (Fuzzy Match / Damerau-Levenshtein) ===
    ['query' => 'jadwl kuliah', 'expected_source' => 'rule', 'kategori' => 'Typo'],
    ['query' => 'biay kuliah', 'expected_source' => 'rule', 'kategori' => 'Typo'],
    ['query' => 'beasiwa', 'expected_source' => 'rule', 'kategori' => 'Typo'],
    ['query' => 'perpustakaaan', 'expected_source' => 'rule', 'kategori' => 'Typo'],
    ['query' => 'wisudah', 'expected_source' => 'rule', 'kategori' => 'Typo'],
    ['query' => 'skripsii', 'expected_source' => 'rule', 'kategori' => 'Typo'],

    // === Grup 5: Pertanyaan dengan Transposisi huruf (Damerau-Levenshtein) ===
    // Grup ini secara khusus menguji keunggulan Damerau-Levenshtein
    // dibanding Levenshtein standar: mendeteksi pertukaran 2 huruf bersebelahan.
    ['query' => 'jadwla kuliah', 'expected_source' => 'rule', 'kategori' => 'Transposisi'],
    ['query' => 'katru rencana studi', 'expected_source' => 'rule', 'kategori' => 'Transposisi'],
    ['query' => 'beaswia', 'expected_source' => 'rule', 'kategori' => 'Transposisi'],
    ['query' => 'wisuad', 'expected_source' => 'rule', 'kategori' => 'Transposisi'],
    ['query' => 'skripis', 'expected_source' => 'rule', 'kategori' => 'Transposisi'],
    ['query' => 'perpustakaan', 'expected_source' => 'rule', 'kategori' => 'Transposisi'],

    // === Grup 3: Pertanyaan kontekstual (seharusnya fallback ke AI) ===
    ['query' => 'adakah informasi kontak kaprodi teknik informatika?', 'expected_source' => 'ai', 'kategori' => 'AI Fallback'],
    ['query' => 'bagaimana cara mengurus cuti kuliah?', 'expected_source' => 'ai', 'kategori' => 'AI Fallback'],
    ['query' => 'apa syarat pindah jurusan?', 'expected_source' => 'ai', 'kategori' => 'AI Fallback'],

    // === Grup 4: Pertanyaan ambigu (bisa Rule atau AI) ===
    ['query' => 'informasi biaya kuliah', 'expected_source' => 'rule', 'kategori' => 'Ambigu'],
    ['query' => 'kapan kuliah dimulai', 'expected_source' => 'rule', 'kategori' => 'Ambigu'],
    ['query' => 'mau tanya soal ukt', 'expected_source' => 'rule', 'kategori' => 'Ambigu'],
];

echo "=============================================================\n";
echo " HASIL UJI CHATBOT HYBRID — UNISKA MAB\n";
echo " Algoritma: Hybrid (Damerau-Levenshtein + Ratcliff/Obershelp)\n";
echo " Tanggal: " . date('d/m/Y H:i:s') . "\n";
echo " Threshold Kemiripan: 80%\n";
echo " Model AI: " . config('services.gemini.model') . "\n";
echo "=============================================================\n\n";

$results = [];
$totalTests = count($testCases);
$correctPredictions = 0;

foreach ($testCases as $i => $test) {
    $no = $i + 1;
    echo "[$no/$totalTests] Testing: \"{$test['query']}\"...\n";

    $startTime = microtime(true);
    $result = $service->findResponse($test['query']);
    $endTime = microtime(true);
    $responseTimeMs = round(($endTime - $startTime) * 1000);

    $isCorrect = $result['source'] === $test['expected_source'];
    if ($isCorrect) $correctPredictions++;

    $results[] = [
        'no' => $no,
        'query' => $test['query'],
        'kategori' => $test['kategori'],
        'source' => $result['source'],
        'expected' => $test['expected_source'],
        'correct' => $isCorrect ? '✓' : '✗',
        'similarity' => $result['similarity_score'] ?? '-',
        'matched_kw' => !empty($result['matched_keywords']) ? implode(', ', $result['matched_keywords']) : '-',
        'rule_id' => $result['matched_rule_id'] ?? '-',
        'response_ms' => $responseTimeMs,
        'response_preview' => mb_substr($result['response'], 0, 60) . (mb_strlen($result['response']) > 60 ? '...' : ''),
    ];

    // Jeda 2 detik antar request AI untuk menghindari rate limit
    if ($result['source'] === 'ai') {
        sleep(2);
    }
}

// === Output Tabel Ringkasan ===
echo "\n\n";
echo "╔═════════════════════════════════════════════════════════════════════════════════════════════════════════╗\n";
echo "║                              TABEL HASIL PENGUJIAN CHATBOT HYBRID                                    ║\n";
echo "╠════╦══════════════════════════════════╦══════════════╦════════╦══════════╦═══════════╦═════════╦═══════╣\n";
echo "║ No ║ Pertanyaan                       ║ Kategori     ║ Sumber ║ Expected ║ Skor (%)  ║ Keyword ║ Benar ║\n";
echo "╠════╬══════════════════════════════════╬══════════════╬════════╬══════════╬═══════════╬═════════╬═══════╣\n";

foreach ($results as $r) {
    $query = mb_str_pad(mb_substr($r['query'], 0, 32), 32);
    $kategori = str_pad(mb_substr($r['kategori'], 0, 12), 12);
    $source = str_pad($r['source'], 6);
    $expected = str_pad($r['expected'], 8);
    $similarity = str_pad($r['similarity'] === '-' ? '-' : number_format($r['similarity'], 1), 9);
    $keyword = mb_str_pad(mb_substr($r['matched_kw'], 0, 7), 7);
    $correct = str_pad($r['correct'], 5);

    echo "║ " . str_pad($r['no'], 2) . " ║ $query ║ $kategori ║ $source ║ $expected ║ $similarity ║ $keyword ║ $correct ║\n";
}

echo "╚════╩══════════════════════════════════╩══════════════╩════════╩══════════╩═══════════╩═════════╩═══════╝\n";

// === Statistik ===
$accuracy = round(($correctPredictions / $totalTests) * 100, 1);
$ruleResults = array_filter($results, fn($r) => $r['source'] === 'rule');
$aiResults = array_filter($results, fn($r) => $r['source'] === 'ai');
$ruleScores = array_filter(array_column($ruleResults, 'similarity'), fn($s) => $s !== '-');
$avgScore = !empty($ruleScores) ? round(array_sum($ruleScores) / count($ruleScores), 2) : 0;
$avgResponseMs = round(array_sum(array_column($results, 'response_ms')) / count($results));
$avgRuleMs = !empty($ruleResults) ? round(array_sum(array_column($ruleResults, 'response_ms')) / count($ruleResults)) : 0;
$avgAiMs = !empty($aiResults) ? round(array_sum(array_column($aiResults, 'response_ms')) / count($aiResults)) : 0;

echo "\n";
echo "=== STATISTIK PENGUJIAN ===\n";
echo "Total Pengujian      : $totalTests\n";
echo "Prediksi Benar       : $correctPredictions / $totalTests ($accuracy%)\n";
echo "Jawaban Rule-Based   : " . count($ruleResults) . "\n";
echo "Jawaban Gemini AI    : " . count($aiResults) . "\n";
echo "Rata-rata Skor Rule  : {$avgScore}%\n";
echo "Rata-rata Waktu Total: {$avgResponseMs} ms\n";
echo "Rata-rata Waktu Rule : {$avgRuleMs} ms\n";
echo "Rata-rata Waktu AI   : {$avgAiMs} ms\n";

// === Simpan ke CSV untuk analisis lanjutan ===
$csvFile = 'hasil_uji_chatbot_' . date('Y-m-d_His') . '.csv';
$fp = fopen($csvFile, 'w');
fputcsv($fp, ['No', 'Pertanyaan', 'Kategori', 'Sumber Aktual', 'Sumber Expected', 'Benar', 'Skor Kemiripan (%)', 'Keyword Cocok', 'Rule ID', 'Waktu Respons (ms)', 'Preview Jawaban']);
foreach ($results as $r) {
    fputcsv($fp, [$r['no'], $r['query'], $r['kategori'], $r['source'], $r['expected'], $r['correct'], $r['similarity'], $r['matched_kw'], $r['rule_id'], $r['response_ms'], $r['response_preview']]);
}
fclose($fp);
echo "\n📁 Hasil disimpan ke: $csvFile\n";
