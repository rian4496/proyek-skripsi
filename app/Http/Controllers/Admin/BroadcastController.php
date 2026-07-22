<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendBroadcastEmailJob;
use App\Models\PesertaUjiCoba;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BroadcastController extends Controller
{
    /**
     * Menampilkan halaman Dasbor Broadcast.
     */
    public function index(): Response
    {
        $eligibleCount = PesertaUjiCoba::whereNotNull('email')->where('email', '!=', '')->count();
        $totalCount = PesertaUjiCoba::count();

        return Inertia::render('admin/Broadcast', [
            'eligibleCount' => $eligibleCount,
            'totalCount' => $totalCount,
            'mailDefault' => config('mail.default', 'log'),
        ]);
    }

    /**
     * Memproses pengiriman pesan massal ke dalam Queue.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:150',
            'message' => 'required|string',
        ]);

        $subject = $request->input('subject');
        $message = $request->input('message');

        // Ambil semua peserta yang memiliki email valid
        $pesertas = PesertaUjiCoba::whereNotNull('email')
            ->where('email', '!=', '')
            ->get();

        $dispatchedCount = 0;

        foreach ($pesertas as $peserta) {
            if (filter_var($peserta->email, FILTER_VALIDATE_EMAIL)) {
                // Paksa eksekusi tugas pengiriman email secara sinkron (langsung saat itu juga tanpa antrean)
                SendBroadcastEmailJob::dispatchSync(
                    $peserta->email,
                    $peserta->nama_mahasiswa,
                    $subject,
                    $message
                );
                $dispatchedCount++;
            }
        }

        return redirect()->back()->with('success', "Berhasil memasukkan {$dispatchedCount} pesan ke antrean pengiriman email massal.");
    }
}
