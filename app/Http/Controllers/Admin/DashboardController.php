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
 *
 * Data yang di-passing:
 * - total_chats: Total interaksi
 * - accuracy_rate: Persentase penggunaan Rule vs AI
 * - avg_similarity: Rata-rata kemiripan teks untuk Rule-based (akurasi pencocokan)
 * - top_questions: Kueri terpopuler dari mahasiswa
 * - recent_logs: Tabel riwayat mentah untuk observasi admin (termasuk is_helpful)
 */
class DashboardController extends Controller
{
    /**
     * Halaman utama Dashboard Analytics (GET /admin/dashboard).
     */
    public function index(Request $request): Response
    {
        $totalChats = ChatLog::count();

        $ruleBasedCount = ChatLog::where('source', 'rule')->count();
        $aiCount = ChatLog::where('source', 'ai')->count();

        $rulePercentage = $totalChats > 0 ? round(($ruleBasedCount / $totalChats) * 100, 1) : 0;
        $aiPercentage = $totalChats > 0 ? round(($aiCount / $totalChats) * 100, 1) : 0;

        $avgSimilarity = ChatLog::where('source', 'rule')->avg('similarity_score');
        $avgSimilarity = $avgSimilarity ? round($avgSimilarity, 2) : 0;

        $topQuestions = ChatLog::select('user_message', DB::raw('count(*) as total'))
            ->groupBy('user_message')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $aiRecommendations = ChatLog::select('user_message', DB::raw('count(*) as total'))
            ->where('source', 'ai')
            ->groupBy('user_message')
            ->having('total', '>=', 2)
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $recentLogs = ChatLog::latest()->limit(10)->get();
        $tickets = \App\Models\Feedback::latest()->get();

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'total_chats' => $totalChats,
                'rule_count' => $ruleBasedCount,
                'ai_count' => $aiCount,
                'rule_percentage' => $rulePercentage,
                'ai_percentage' => $aiPercentage,
                'avg_similarity' => $avgSimilarity,
            ],
            'top_questions' => $topQuestions,
            'ai_recommendations' => $aiRecommendations,
            'recent_logs' => $recentLogs,
            'tickets' => $tickets,
        ]);
    }

    /**
     * Export seluruh data chat_logs ke CSV (GET /admin/export-csv).
     *
     * Catatan Akademis (Skripsi Bab 4):
     * Method ini menggunakan StreamedResponse + fputcsv agar ringan
     * dan tidak memakan memori berlebih pada dataset besar.
     * Data yang di-export mendukung lampiran data mentah skripsi.
     */
    public function exportCsv(): StreamedResponse
    {
        $filename = 'laporan_chatbot_' . date('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () {
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

            // Data — chunked agar efisien memori
            $no = 0;
            ChatLog::orderBy('created_at', 'asc')->chunk(200, function ($logs) use ($handle, &$no) {
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
}
