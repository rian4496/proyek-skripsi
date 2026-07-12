<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PesertaUjiCoba;
use App\Models\SessionReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ParticipantController — Mengelola dan menampilkan master data responden uji coba chatbot (Skripsi Bab IV).
 */
class ParticipantController extends Controller
{
    /**
     * Menerima registrasi awal peserta dari modal UI dan menyimpannya di database (POST /participants).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nama_mahasiswa' => ['required', 'string', 'max:100'],
            'npm' => ['required', 'string', 'max:50'],
            'fakultas' => ['nullable', 'string', 'max:100'],
            'prodi' => ['nullable', 'string', 'max:100'],
        ]);

        $peserta = PesertaUjiCoba::firstOrNew(['npm' => trim($request->input('npm'))]);
        $peserta->nama_mahasiswa = trim($request->input('nama_mahasiswa'));
        if ($request->filled('fakultas')) $peserta->fakultas = trim($request->input('fakultas'));
        if ($request->filled('prodi')) $peserta->prodi = trim($request->input('prodi'));
        $peserta->last_active_at = now();
        $peserta->save();

        return response()->json([
            'success' => true,
            'participant' => $peserta,
        ]);
    }

    /**
     * Menampilkan halaman Daftar Peserta Uji Coba (GET /admin/participants).
     */
    public function index(Request $request): Response
    {
        $query = PesertaUjiCoba::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_mahasiswa', 'like', "%{$search}%")
                  ->orWhere('npm', 'like', "%{$search}%");
            });
        }

        if ($request->filled('fakultas') && $request->input('fakultas') !== 'Semua Fakultas') {
            $query->where('fakultas', $request->input('fakultas'));
        }

        if ($request->filled('prodi') && $request->input('prodi') !== 'Semua Program Studi') {
            $query->where('prodi', $request->input('prodi'));
        }

        $participants = $query->orderByDesc('last_active_at')->paginate(20)->withQueryString();

        // Ambil info rating CSAT untuk setiap peserta (jika sudah mengisi evaluasi akhir)
        $npms = $participants->pluck('npm')->filter()->toArray();
        $reviewsMap = [];
        if (!empty($npms)) {
            $reviews = SessionReview::whereIn('npm', $npms)->get()->keyBy('npm');
            foreach ($reviews as $npm => $rev) {
                $reviewsMap[$npm] = [
                    'rating' => $rev->rating,
                    'komentar' => $rev->komentar,
                ];
            }
        }

        // Statistik ringkasan Bab IV
        $totalParticipants = PesertaUjiCoba::count();
        $dominantProdi = PesertaUjiCoba::select('prodi', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereNotNull('prodi')
            ->groupBy('prodi')
            ->orderByDesc('count')
            ->first();

        $avgQueries = $totalParticipants > 0 ? round(PesertaUjiCoba::avg('total_queries'), 1) : 0;
        $totalReviews = SessionReview::whereNotNull('npm')->distinct('npm')->count('npm');
        $csatRate = $totalParticipants > 0 ? round(($totalReviews / $totalParticipants) * 100, 1) : 0;

        // Daftar fakultas dan prodi unik untuk dropdown filter
        $fakultasOptions = PesertaUjiCoba::select('fakultas')->whereNotNull('fakultas')->distinct()->pluck('fakultas');
        $prodiOptions = PesertaUjiCoba::select('prodi')->whereNotNull('prodi')->distinct()->pluck('prodi');

        return Inertia::render('admin/Participants', [
            'participants' => $participants,
            'reviewsMap' => $reviewsMap,
            'stats' => [
                'total_participants' => $totalParticipants,
                'dominant_prodi' => $dominantProdi ? "{$dominantProdi->prodi} ({$dominantProdi->count} Peserta)" : '-',
                'avg_queries' => $avgQueries,
                'csat_rate' => "{$csatRate}%",
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'fakultas' => $request->input('fakultas', 'Semua Fakultas'),
                'prodi' => $request->input('prodi', 'Semua Program Studi'),
            ],
            'options' => [
                'fakultas' => $fakultasOptions,
                'prodi' => $prodiOptions,
            ],
        ]);
    }

    /**
     * Menghapus peserta uji coba dari database (DELETE /admin/participants/{participant}).
     */
    public function destroy(PesertaUjiCoba $participant)
    {
        $participant->delete();

        return redirect()->back()->with('message', 'Data peserta berhasil dihapus.');
    }

    /**
     * Mengunduh rekapitulasi responden dalam format CSV (GET /admin/participants/export-csv).
     */
    public function exportCsv(Request $request)
    {
        $query = PesertaUjiCoba::query();

        if ($request->filled('fakultas') && $request->input('fakultas') !== 'Semua Fakultas') {
            $query->where('fakultas', $request->input('fakultas'));
        }

        if ($request->filled('prodi') && $request->input('prodi') !== 'Semua Program Studi') {
            $query->where('prodi', $request->input('prodi'));
        }

        $participants = $query->orderBy('fakultas')->orderBy('prodi')->orderBy('nama_mahasiswa')->get();
        $reviews = SessionReview::whereIn('npm', $participants->pluck('npm')->filter())->get()->keyBy('npm');

        $filename = 'Rekapitulasi_Responden_Uji_Coba_Bab_IV_' . date('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($participants, $reviews) {
            $file = fopen('php://output', 'w');
            // Add BOM for Excel UTF-8 display compatibility
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, [
                'No',
                'NPM',
                'Nama Lengkap Mahasiswa',
                'Fakultas',
                'Program Studi',
                'Total Interaksi Chat',
                'Rating CSAT Akhir (1-5)',
                'Komentar Responden',
                'Waktu Registrasi',
                'Terakhir Aktif'
            ]);

            foreach ($participants as $index => $row) {
                $rev = $reviews->get($row->npm);
                fputcsv($file, [
                    $index + 1,
                    $row->npm,
                    $row->nama_mahasiswa,
                    $row->fakultas ?? '-',
                    $row->prodi ?? '-',
                    $row->total_queries,
                    $rev ? $rev->rating : '-',
                    $rev ? ($rev->komentar ?? '-') : '-',
                    $row->created_at ? $row->created_at->format('Y-m-d H:i:s') : '-',
                    $row->last_active_at ? $row->last_active_at->format('Y-m-d H:i:s') : '-'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
