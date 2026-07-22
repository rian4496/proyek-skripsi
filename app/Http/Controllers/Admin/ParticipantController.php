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
            'nama_mahasiswa' => [
                'required', 
                'string', 
                'max:100',
                'regex:/^(?!.*(.)\1{2,}).*$/'
            ],
            'npm' => ['required', 'string', 'regex:/^[0-9]{10}$/'],
            'email' => ['nullable', 'email', 'max:100'],
            'fakultas' => ['nullable', 'string', 'max:100'],
            'prodi' => ['nullable', 'string', 'max:100'],
        ], [
            'npm.required' => 'NPM wajib diisi.',
            'npm.regex' => 'Pengisian NPM harus sesuai 10 digit angka (contoh yang benar: 22100xxxxx).',
            'email.email' => 'Format email tidak valid.',
            'nama_mahasiswa.regex' => 'Mohon gunakan nama asli Anda. Huruf yang diulang-ulang (seperti "aaa" atau "bbb") tidak diperbolehkan.',
        ]);

        $peserta = PesertaUjiCoba::firstOrNew(['npm' => trim($request->input('npm'))]);
        $peserta->nama_mahasiswa = trim($request->input('nama_mahasiswa'));
        if ($request->filled('email')) $peserta->email = trim($request->input('email'));
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

        return redirect()->back(303)->with('message', 'Data peserta berhasil dihapus.');
    }

    /**
     * Memperbarui email peserta uji coba dari tabel Master Data (PUT /admin/participants/{participant}).
     */
    public function updateEmail(Request $request, PesertaUjiCoba $participant)
    {
        $request->validate([
            'email' => ['nullable', 'email', 'max:100'],
        ], [
            'email.email' => 'Format email tidak valid.',
        ]);

        $participant->email = $request->input('email');
        $participant->save();

        return redirect()->back(303)->with('success', 'Email responden ' . $participant->nama_mahasiswa . ' berhasil diperbarui.');
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

    /**
     * Halaman Cetak (Print / PDF) Master Data Peserta Uji Coba (Bab IV Skripsi) (GET /admin/participants/print).
     */
    public function printParticipants(Request $request)
    {
        $query = PesertaUjiCoba::query();

        if ($request->filled('fakultas') && $request->input('fakultas') !== 'Semua Fakultas') {
            $query->where('fakultas', $request->input('fakultas'));
        }

        if ($request->filled('prodi') && $request->input('prodi') !== 'Semua Program Studi') {
            $query->where('prodi', $request->input('prodi'));
        }

        $participants = $query->orderBy('fakultas')->orderBy('prodi')->orderBy('nama_mahasiswa')->get();
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

        $tanggalCetak = now()->locale('id')->translatedFormat('d F Y');
        $totalParticipants = $participants->count();
        $dominantProdi = PesertaUjiCoba::select('prodi', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereNotNull('prodi')
            ->groupBy('prodi')
            ->orderByDesc('count')
            ->first();

        $avgQueries = $totalParticipants > 0 ? round($participants->avg('total_queries'), 1) : 0;
        $totalReviews = count($reviewsMap);
        $csatRate = $totalParticipants > 0 ? round(($totalReviews / $totalParticipants) * 100, 1) : 0;

        $rowsHtml = '';
        if ($participants->isEmpty()) {
            $rowsHtml = '<tr><td colspan="7" class="text-center" style="padding: 20px; font-style: italic;">Belum ada data peserta uji coba yang tercatat sesuai filter.</td></tr>';
        } else {
            $no = 1;
            foreach ($participants as $p) {
                $rev = $reviewsMap[$p->npm] ?? null;
                $ratingHtml = $rev ? ('<strong style="color: #d97706;">' . $rev['rating'] . ' / 5.0 (★)</strong><br><span style="font-size: 10px; font-style: italic;">"' . htmlspecialchars($rev['komentar'] ?? '-') . '"</span>') : '<span style="color: #94a3b8; font-style: italic;">Belum mengisi</span>';
                
                $rowsHtml .= '<tr>
                    <td class="text-center">' . $no++ . '</td>
                    <td class="text-center font-mono font-bold">' . htmlspecialchars($p->npm ?? '-') . '</td>
                    <td><strong>' . htmlspecialchars($p->nama_mahasiswa ?? 'Anonim') . '</strong></td>
                    <td>' . htmlspecialchars(($p->fakultas ?? '-') . ' / ' . ($p->prodi ?? '-')) . '</td>
                    <td class="text-center"><strong>' . number_format($p->total_queries ?? 0) . ' Kueri</strong></td>
                    <td class="text-center">' . $ratingHtml . '</td>
                    <td class="text-center" style="font-size: 11px;">' . ($p->created_at ? $p->created_at->format('d/m/Y H:i') : '-') . ' WIB<br><span style="color:#64748b;">Aktif: ' . ($p->last_active_at ? $p->last_active_at->format('d/m/Y H:i') : '-') . '</span></td>
                </tr>';
            }
        }

        $html = '<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Laporan Master Data Peserta Uji Coba - UNISKA MAB</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 15mm 15mm 15mm 15mm;
        }
        body {
            font-family: "Times New Roman", Times, serif;
            color: #000;
            margin: 0;
            padding: 20px;
            background: #fff;
            line-height: 1.4;
        }
        .header-kop {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header-kop h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0 0 4px 0;
            text-transform: uppercase;
        }
        .header-kop h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0 0 4px 0;
            text-transform: uppercase;
        }
        .header-kop p {
            font-size: 10pt;
            margin: 0;
            font-style: italic;
        }
        .judul-laporan {
            text-align: center;
            margin-bottom: 16px;
        }
        .judul-laporan h3 {
            font-size: 13pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 0 0 4px 0;
            text-transform: uppercase;
        }
        .judul-laporan p {
            font-size: 10.5pt;
            margin: 0;
        }
        .summary-box {
            border: 1px solid #000;
            padding: 10px 14px;
            margin-bottom: 16px;
            font-size: 10pt;
            background: #fdfdfd;
        }
        .summary-box strong {
            font-size: 10.5pt;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 6px;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 10pt;
        }
        table.data-table th, table.data-table td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: middle;
        }
        table.data-table th {
            background-color: #f2f2f2 !important;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            font-size: 9.5pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .text-center { text-align: center; }
        .font-mono { font-family: monospace; }
        .footer-ttd {
            float: right;
            width: 250px;
            text-align: center;
            margin-top: 15px;
            font-size: 10.5pt;
        }
        .footer-ttd .space {
            height: 65px;
        }
        @media print {
            body { padding: 0; }
            button.no-print { display: none !important; }
        }
    </style>
</head>
<body>
    <div style="text-align: right; margin-bottom: 15px;" class="no-print">
        <button onclick="window.print()" style="padding: 8px 16px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-family: sans-serif;">🖨️ Cetak / Simpan PDF Sekarang</button>
    </div>

    <div class="header-kop">
        <h1>UNIVERSITAS ISLAM KALIMANTAN MUHAMMAD ARSYAD AL BANJARI</h1>
        <h2>BIRO ADMINISTRASI AKADEMIK DAN KEMAHASISWAAN (BAAK)</h2>
        <p>Jl. Adhyaksa No. 2 Kayu Tangi, Banjarmasin, Kalimantan Selatan 70123 | Telp: (0511) 3304352</p>
    </div>

    <div class="judul-laporan">
        <h3>LAPORAN REKAPITULASI MASTER DATA PESERTA UJI COBA</h3>
        <p>Distribusi Karakteristik Responden &amp; Statistik Interaksi Chatbot Pelayanan Akademik (Bab IV Skripsi)</p>
    </div>

    <div class="summary-box">
        <strong>RINGKASAN DEMOGRAFI &amp; AKTIVITAS RESPONDEN:</strong>
        <div class="summary-grid">
            <div>• Total Peserta Terdaftar : <strong>' . number_format($totalParticipants) . ' Mahasiswa</strong></div>
            <div>• Program Studi Dominan : <strong>' . htmlspecialchars($dominantProdi ? $dominantProdi->prodi : '-') . '</strong></div>
            <div>• Rata-rata Interaksi : <strong>' . $avgQueries . ' Kueri / Peserta</strong></div>
            <div>• Partisipasi Evaluasi CSAT : <strong>' . $csatRate . '% (' . $totalReviews . ' Responden)</strong></div>
        </div>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 4%;">No</th>
                <th style="width: 11%;">NPM</th>
                <th style="width: 20%;">Nama Lengkap Mahasiswa</th>
                <th style="width: 23%;">Fakultas / Program Studi</th>
                <th style="width: 10%;">Total Interaksi</th>
                <th style="width: 18%;">Rating CSAT &amp; Komentar</th>
                <th style="width: 14%;">Registrasi &amp; Aktif</th>
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
}
