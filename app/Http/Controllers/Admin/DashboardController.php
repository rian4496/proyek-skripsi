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
