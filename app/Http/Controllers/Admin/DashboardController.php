<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * DashboardController — Untuk Halaman Analytics Admin.
 *
 * Catatan Akademis (Skripsi Bab 4):
 * Menghasilkan data agregatif (statistik kuantitatif) untuk mengukur performa
 * algoritma Hybrid Chatbot (Rule-Based Levenshtein vs AI Fallback).
 */
class DashboardController extends Controller
{
    /**
     * Halaman utama Dashboard Analytics (GET /admin/dashboard).
     */
    public function index(Request $request): Response
    {
        $applyFilters = function ($query) use ($request) {
            if ($request->filled('date_range') && $request->input('date_range') !== 'all') {
                if ($request->input('date_range') === 'today') {
                    $query->whereDate('created_at', now()->toDateString());
                } elseif ($request->input('date_range') === '7days') {
                    $query->where('created_at', '>=', now()->subDays(7));
                } elseif ($request->input('date_range') === '30days') {
                    $query->where('created_at', '>=', now()->subDays(30));
                }
            }
            if ($request->filled('fakultas') && $request->input('fakultas') !== 'all') {
                $query->where('fakultas', $request->input('fakultas'));
            }
            if ($request->filled('prodi') && $request->input('prodi') !== 'all') {
                $query->where('prodi', $request->input('prodi'));
            }
            return $query;
        };

        $totalChats = $applyFilters(ChatLog::query())->count();

        $ruleBasedCount = $applyFilters(ChatLog::where('source', 'rule'))->count();
        $aiCount = $applyFilters(ChatLog::where('source', 'ai'))->count();

        $rulePercentage = $totalChats > 0 ? round(($ruleBasedCount / $totalChats) * 100, 1) : 0;
        $aiPercentage = $totalChats > 0 ? round(($aiCount / $totalChats) * 100, 1) : 0;

        $avgSimilarity = $applyFilters(ChatLog::where('source', 'rule'))->avg('similarity_score');
        $avgSimilarity = $avgSimilarity ? round($avgSimilarity, 2) : 0;

        // CSAT / Feedback Analytics
        $helpfulCount = $applyFilters(ChatLog::where('is_helpful', true))->count();
        $notHelpfulCount = $applyFilters(ChatLog::where('is_helpful', false))->count();
        $totalRated = $helpfulCount + $notHelpfulCount;
        $csatPercentage = $totalRated > 0 ? round(($helpfulCount / $totalRated) * 100, 1) : 0;

        // Daily Trend Chart (30 hari terakhir atau sesuai filter)
        $dailyTrend = $applyFilters(ChatLog::query())
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total'),
                DB::raw("sum(case when source = 'rule' then 1 else 0 end) as rule_count"),
                DB::raw("sum(case when source = 'ai' then 1 else 0 end) as ai_count")
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderByRaw('DATE(created_at) asc')
            ->limit(30)
            ->get();

        $topQuestions = $applyFilters(ChatLog::query())
            ->select('user_message', DB::raw('count(*) as total'))
            ->groupBy('user_message')
            ->orderByRaw('count(*) desc')
            ->limit(5)
            ->get();

        $aiRecommendations = $applyFilters(ChatLog::where('source', 'ai'))
            ->select('user_message', DB::raw('count(*) as total'))
            ->groupBy('user_message')
            ->havingRaw('count(*) >= 2')
            ->orderByRaw('count(*) desc')
            ->limit(5)
            ->get();

        $recentLogs = $applyFilters(ChatLog::latest())->limit(100)->get();
        $tickets = \App\Models\Feedback::where('kategori_masalah', '!=', 'Feedback Sesi')->latest()->get();
        $sessionReviews = \App\Models\SessionReview::latest()->get();

        $totalReviews = $sessionReviews->count();
        $avgSessionRating = $totalReviews > 0 ? round($sessionReviews->avg('rating'), 1) : 0;
        $starCounts = [
            5 => $sessionReviews->where('rating', 5)->count(),
            4 => $sessionReviews->where('rating', 4)->count(),
            3 => $sessionReviews->where('rating', 3)->count(),
            2 => $sessionReviews->where('rating', 2)->count(),
            1 => $sessionReviews->where('rating', 1)->count(),
        ];

        // Daftar unik Fakultas dan Prodi untuk opsi filter dropdown
        $fakultasList = ChatLog::whereNotNull('fakultas')
            ->where('fakultas', '!=', '')
            ->distinct()
            ->pluck('fakultas')
            ->filter()
            ->values();

        $prodiList = ChatLog::whereNotNull('prodi')
            ->where('prodi', '!=', '')
            ->distinct()
            ->pluck('prodi')
            ->filter()
            ->values();

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'total_chats' => $totalChats,
                'rule_count' => $ruleBasedCount,
                'ai_count' => $aiCount,
                'rule_percentage' => $rulePercentage,
                'ai_percentage' => $aiPercentage,
                'avg_similarity' => $avgSimilarity,
            ],
            'csat_stats' => [
                'helpful' => $helpfulCount,
                'not_helpful' => $notHelpfulCount,
                'total_rated' => $totalRated,
                'percentage' => $csatPercentage,
            ],
            'daily_trend' => $dailyTrend,
            'top_questions' => $topQuestions,
            'ai_recommendations' => $aiRecommendations,
            'recent_logs' => $recentLogs,
            'tickets' => $tickets,
            'session_reviews' => $sessionReviews,
            'session_review_stats' => [
                'total_reviews' => $totalReviews,
                'avg_rating' => $avgSessionRating,
                'star_counts' => $starCounts,
            ],
            'filters' => [
                'date_range' => $request->input('date_range', 'all'),
                'fakultas' => $request->input('fakultas', 'all'),
                'prodi' => $request->input('prodi', 'all'),
            ],
            'options' => [
                'fakultas_list' => $fakultasList,
                'prodi_list' => $prodiList,
            ],
        ]);
    }

    /**
     * Export seluruh data chat_logs ke CSV (GET /admin/export-csv).
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $filename = 'laporan_chatbot_' . date('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($request) {
            $handle = fopen('php://output', 'w');

            // Header CSV
            fputcsv($handle, [
                'No',
                'Waktu',
                'Nama Mahasiswa',
                'Fakultas',
                'Prodi',
                'Pesan Mahasiswa',
                'Respons Bot',
                'Sumber (rule/ai)',
                'AI Engine',
                'Skor Kemiripan (%)',
                'Feedback (helpful)',
            ]);

            $applyFilters = function ($query) use ($request) {
                if ($request->filled('date_range') && $request->input('date_range') !== 'all') {
                    if ($request->input('date_range') === 'today') {
                        $query->whereDate('created_at', now()->toDateString());
                    } elseif ($request->input('date_range') === '7days') {
                        $query->where('created_at', '>=', now()->subDays(7));
                    } elseif ($request->input('date_range') === '30days') {
                        $query->where('created_at', '>=', now()->subDays(30));
                    }
                }
                if ($request->filled('fakultas') && $request->input('fakultas') !== 'all') {
                    $query->where('fakultas', $request->input('fakultas'));
                }
                if ($request->filled('prodi') && $request->input('prodi') !== 'all') {
                    $query->where('prodi', $request->input('prodi'));
                }
                return $query;
            };

            // Data — chunked agar efisien memori
            $no = 0;
            $applyFilters(ChatLog::orderBy('created_at', 'asc'))->chunk(200, function ($logs) use ($handle, &$no) {
                foreach ($logs as $log) {
                    $no++;
                    $feedback = $log->is_helpful === null ? 'Belum dinilai'
                        : ($log->is_helpful ? 'Helpful (👍)' : 'Not Helpful (👎)');

                    fputcsv($handle, [
                        $no,
                        $log->created_at->format('d/m/Y H:i:s'),
                        $log->nama_mahasiswa ?? 'Anonim',
                        $log->fakultas ?? '-',
                        $log->prodi ?? '-',
                        $log->user_message,
                        $log->bot_response,
                        $log->source,
                        $log->ai_engine ?? '-',
                        $log->similarity_score ?? '-',
                        $feedback,
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Export tiket keluhan masuk ke CSV (GET /admin/tickets/export-csv).
     */
    public function exportTicketsCsv(Request $request): StreamedResponse
    {
        $filename = 'laporan_tiket_keluhan_' . date('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');

            // Header CSV dengan BOM UTF-8 agar rapi di Excel Indonesia
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, [
                'No',
                'Waktu Masuk',
                'Nama Pelapor',
                'Kategori Masalah',
                'Isi Laporan / Keluhan',
                'Sentimen AI (Gemini 2.0 Flash)',
                'Skor Keyakinan (%)',
                'Status'
            ]);

            $no = 0;
            \App\Models\Feedback::where('kategori_masalah', '!=', 'Feedback Sesi')
                ->orderBy('created_at', 'desc')
                ->chunk(200, function ($tickets) use ($handle, &$no) {
                    foreach ($tickets as $ticket) {
                        $no++;
                        fputcsv($handle, [
                            $no,
                            $ticket->created_at->format('d/m/Y H:i:s'),
                            $ticket->nama_pelapor ?? 'Anonim',
                            $ticket->kategori_masalah ?? 'Umum',
                            $ticket->isi_laporan,
                            $ticket->sentiment_label ?? 'Netral',
                            $ticket->sentiment_score ? ($ticket->sentiment_score . '%') : '-',
                            $ticket->status ?? 'Baru'
                        ]);
                    }
                });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Halaman Cetak (Print / PDF) Tiket Keluhan Masuk berstandar Bab IV Skripsi (GET /admin/tickets/print).
     */
    public function printTickets()
    {
        $tickets = \App\Models\Feedback::where('kategori_masalah', '!=', 'Feedback Sesi')->orderBy('created_at', 'desc')->get();
        $tanggalCetak = now()->locale('id')->translatedFormat('d F Y');

        $rowsHtml = '';
        if ($tickets->isEmpty()) {
            $rowsHtml = '<tr><td colspan="6" class="text-center" style="padding: 20px; font-style: italic;">Belum ada data tiket keluhan yang tercatat.</td></tr>';
        } else {
            $no = 1;
            foreach ($tickets as $t) {
                $sentimenStyle = 'color: #333;';
                if (stripos($t->sentiment_label ?? '', 'Negatif') !== false) $sentimenStyle = 'color: #b91c1c; font-weight: bold;';
                elseif (stripos($t->sentiment_label ?? '', 'Positif') !== false) $sentimenStyle = 'color: #15803d; font-weight: bold;';

                $rowsHtml .= '<tr>
                    <td class="text-center">' . $no++ . '</td>
                    <td class="text-center">' . $t->created_at->format('d/m/Y H:i') . ' WIB</td>
                    <td><strong>' . htmlspecialchars($t->nama_pelapor ?? 'Anonim') . '</strong></td>
                    <td class="text-center">' . htmlspecialchars($t->kategori_masalah ?? 'Umum') . '</td>
                    <td>' . nl2br(htmlspecialchars($t->isi_laporan ?? '-')) . '</td>
                    <td class="text-center" style="' . $sentimenStyle . '">' . htmlspecialchars(($t->sentiment_label ?? 'Netral') . ($t->sentiment_score ? " ({$t->sentiment_score}%)" : '')) . '</td>
                </tr>';
            }
        }

        $html = '<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Laporan Tiket Keluhan - UNISKA MAB</title>
    <style>
        @page { size: A4 landscape; margin: 1.5cm; }
        body { font-family: "Times New Roman", Times, serif; color: #000; margin: 0; padding: 20px; line-height: 1.4; }
        .kop-surat { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; }
        .kop-surat h1 { font-size: 16pt; font-weight: bold; margin: 0 0 4px 0; text-transform: uppercase; }
        .kop-surat h2 { font-size: 14pt; font-weight: bold; margin: 0 0 4px 0; }
        .kop-surat p { font-size: 10pt; margin: 0; font-style: italic; }
        .judul-laporan { text-align: center; font-size: 13pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase; }
        .sub-judul { text-align: center; font-size: 11pt; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10pt; }
        th, td { border: 1px solid #000; padding: 8px 10px; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2 !important; font-weight: bold; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-center { text-align: center; }
        .footer-ttd { margin-top: 40px; float: right; width: 260px; text-align: center; font-size: 11pt; page-break-inside: avoid; }
        .footer-ttd .space { height: 65px; }
        .no-print { margin-bottom: 20px; text-align: right; }
        @media print { .no-print { display: none; } body { padding: 0; } }
        .btn-print { background: #2563eb; color: #fff; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn-print:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="no-print">
        <button onclick="window.print()" class="btn-print">🖨️ Cetak / Simpan PDF Sekarang</button>
    </div>
    <div class="kop-surat">
        <h1>UNIVERSITAS ISLAM KALIMANTAN MUHAMMAD ARSYAD AL BANJARI</h1>
        <h2>BIRO ADMINISTRASI AKADEMIK DAN KEMAHASISWAAN (BAAK)</h2>
        <p>Jl. Adhyaksa No. 2 Kayu Tangi, Banjarmasin, Kalimantan Selatan 70123 | Telp: (0511) 3304352</p>
    </div>
    <div class="judul-laporan">LAPORAN REKAPITULASI TIKET KELUHAN DAN MASALAH TEKNIS</div>
    <div class="sub-judul">Pengujian Modul Hybrid Chatbot Pelayanan Akademik & Evaluasi Kualitas Layanan</div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 15%;">Waktu Masuk</th>
                <th style="width: 18%;">Nama Pelapor</th>
                <th style="width: 12%;">Kategori</th>
                <th style="width: 32%;">Isi Laporan / Keluhan</th>
                <th style="width: 18%;">Sentimen AI (Gemini)</th>
            </tr>
        </thead>
        <tbody>' . $rowsHtml . '</tbody>
    </table>

    <div class="footer-ttd">
        <p>Banjarmasin, ' . $tanggalCetak . '<br>Mengetahui,<br><strong>Tim Pengembang / Peneliti</strong></p>
        <div class="space"></div>
        <p><u>___________________________</u><br>NIDN / NPM.</p>
    </div>
    <script>
        window.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => { window.print(); }, 500);
        });
    </script>
</body>
</html>';

        return response($html);
    }

    /**
     * Export evaluasi kepuasan sesi (CSAT) ke CSV (GET /admin/session-reviews/export-csv).
     */
    public function exportSessionReviewsCsv(Request $request): StreamedResponse
    {
        $filename = 'laporan_evaluasi_sesi_csat_' . date('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');

            // Header CSV dengan BOM UTF-8
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, [
                'No',
                'ID Responden',
                'Nama Responden',
                'Fakultas / Program Studi',
                'Rating Bintang (1-5)',
                'Saran & Komentar Feedback',
                'Waktu Evaluasi'
            ]);

            $no = 0;
            \App\Models\SessionReview::orderBy('created_at', 'desc')
                ->chunk(200, function ($reviews) use ($handle, &$no) {
                    foreach ($reviews as $review) {
                        $no++;
                        fputcsv($handle, [
                            $no,
                            '#' . $review->id,
                            $review->nama_mahasiswa ?? 'Responden Anonim',
                            ($review->fakultas ?? '-') . ' / ' . ($review->prodi ?? '-'),
                            $review->rating . ' Bintang',
                            $review->feedback_comment ?? 'Tidak ada komentar',
                            $review->created_at->format('d/m/Y H:i:s')
                        ]);
                    }
                });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Halaman Cetak (Print / PDF) Evaluasi Kepuasan Sesi Responden (CSAT) (GET /admin/session-reviews/print).
     */
    public function printSessionReviews()
    {
        $reviews = \App\Models\SessionReview::orderBy('created_at', 'desc')->get();
        $tanggalCetak = now()->locale('id')->translatedFormat('d F Y');
        $totalReviews = $reviews->count();
        $avgRating = $totalReviews > 0 ? round($reviews->avg('rating'), 2) : 0;

        $rowsHtml = '';
        if ($reviews->isEmpty()) {
            $rowsHtml = '<tr><td colspan="6" class="text-center" style="padding: 20px; font-style: italic;">Belum ada data evaluasi kepuasan sesi yang tercatat.</td></tr>';
        } else {
            $no = 1;
            foreach ($reviews as $r) {
                $bintang = str_repeat('★', $r->rating) . str_repeat('☆', 5 - $r->rating);
                $rowsHtml .= '<tr>
                    <td class="text-center">' . $no++ . '</td>
                    <td class="text-center">' . $r->created_at->format('d/m/Y H:i') . ' WIB</td>
                    <td><strong>' . htmlspecialchars($r->nama_mahasiswa ?? 'Responden Anonim') . '</strong></td>
                    <td class="text-center">' . htmlspecialchars(($r->fakultas ?? '-') . ' / ' . ($r->prodi ?? '-')) . '</td>
                    <td class="text-center" style="color: #d97706; font-weight: bold;">' . $r->rating . ' / 5.0 (' . $bintang . ')</td>
                    <td>' . nl2br(htmlspecialchars($r->feedback_comment ?? 'Tidak ada komentar')) . '</td>
                </tr>';
            }
        }

        $html = '<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Laporan Evaluasi CSAT - UNISKA MAB</title>
    <style>
        @page { size: A4 landscape; margin: 1.5cm; }
        body { font-family: "Times New Roman", Times, serif; color: #000; margin: 0; padding: 20px; line-height: 1.4; }
        .kop-surat { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; }
        .kop-surat h1 { font-size: 16pt; font-weight: bold; margin: 0 0 4px 0; text-transform: uppercase; }
        .kop-surat h2 { font-size: 14pt; font-weight: bold; margin: 0 0 4px 0; }
        .kop-surat p { font-size: 10pt; margin: 0; font-style: italic; }
        .judul-laporan { text-align: center; font-size: 13pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase; }
        .sub-judul { text-align: center; font-size: 11pt; margin-bottom: 15px; }
        .stats-box { border: 1px solid #000; padding: 10px 15px; background: #f9f9f9; margin-bottom: 15px; font-size: 10.5pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10pt; }
        th, td { border: 1px solid #000; padding: 8px 10px; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2 !important; font-weight: bold; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-center { text-align: center; }
        .footer-ttd { margin-top: 40px; float: right; width: 260px; text-align: center; font-size: 11pt; page-break-inside: avoid; }
        .footer-ttd .space { height: 65px; }
        .no-print { margin-bottom: 20px; text-align: right; }
        @media print { .no-print { display: none; } body { padding: 0; } }
        .btn-print { background: #2563eb; color: #fff; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn-print:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="no-print">
        <button onclick="window.print()" class="btn-print">🖨️ Cetak / Simpan PDF Sekarang</button>
    </div>
    <div class="kop-surat">
        <h1>UNIVERSITAS ISLAM KALIMANTAN MUHAMMAD ARSYAD AL BANJARI</h1>
        <h2>BIRO ADMINISTRASI AKADEMIK DAN KEMAHASISWAAN (BAAK)</h2>
        <p>Jl. Adhyaksa No. 2 Kayu Tangi, Banjarmasin, Kalimantan Selatan 70123 | Telp: (0511) 3304352</p>
    </div>
    <div class="judul-laporan">LAPORAN EVALUASI KEPUASAN SESI RESPONDEN (CSAT)</div>
    <div class="sub-judul">Pengujian Modul Hybrid Chatbot Pelayanan Akademik UNISKA MAB</div>

    <div class="stats-box">
        <strong>RINGKASAN STATISTIK EVALUASI RESPONDEN:</strong><br>
        • Total Responden yang Memberikan Evaluasi : <strong>' . $totalReviews . ' Mahasiswa</strong><br>
        • Rata-rata Skor Kepuasan Pengguna (CSAT)  : <strong>' . $avgRating . ' / 5.00 Bintang (' . round(($avgRating/5)*100, 1) . '%)</strong>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 15%;">Waktu Evaluasi</th>
                <th style="width: 20%;">Nama Responden</th>
                <th style="width: 24%;">Fakultas / Program Studi</th>
                <th style="width: 14%;">Rating Bintang</th>
                <th style="width: 22%;">Saran & Komentar Feedback</th>
            </tr>
        </thead>
        <tbody>' . $rowsHtml . '</tbody>
    </table>

    <div class="footer-ttd">
        <p>Banjarmasin, ' . $tanggalCetak . '<br>Mengetahui,<br><strong>Tim Pengembang / Peneliti</strong></p>
        <div class="space"></div>
        <p><u>___________________________</u><br>NIDN / NPM.</p>
    </div>
    <script>
        window.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => { window.print(); }, 500);
        });
    </script>
</body>
</html>';

        return response($html);
    }

    /**
     * Menghapus 1 entri log percakapan tertentu (DELETE /admin/chat-logs/{id}).
     */
    public function destroy(ChatLog $chatLog)
    {
        $chatLog->delete();

        return redirect()->back()->with('success', 'Log percakapan berhasil dihapus.');
    }

    /**
     * Menghapus seluruh riwayat log percakapan (DELETE /admin/chat-logs/clear).
     */
    public function destroyAll()
    {
        ChatLog::truncate();

        return redirect()->back()->with('success', 'Seluruh riwayat log percakapan berhasil dikosongkan.');
    }

    /**
     * Menghapus 1 tiket keluhan masuk (DELETE /admin/tickets/{feedback}).
     */
    public function destroyTicket(\App\Models\Feedback $feedback)
    {
        $feedback->delete();

        return redirect()->back()->with('success', 'Tiket keluhan berhasil dihapus.');
    }

    /**
     * Menghapus seluruh tiket keluhan masuk (DELETE /admin/tickets/clear).
     */
    public function destroyAllTickets()
    {
        \App\Models\Feedback::truncate();

        return redirect()->back()->with('success', 'Seluruh data tiket keluhan berhasil dikosongkan.');
    }
}
