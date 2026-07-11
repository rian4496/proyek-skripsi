<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SystemLogController extends Controller
{
    /**
     * Menampilkan halaman System Diagnostic & Error Logs khusus Admin.
     */
    public function index(Request $request): Response
    {
        $logPath = storage_path('logs/laravel.log');
        $logs = [];
        $fileSize = '0 KB';

        if (File::exists($logPath)) {
            $fileSize = round(File::size($logPath) / 1024, 2) . ' KB';
            $content = File::get($logPath);

            // Ambil 150 baris terakhir agar pembacaan cepat & ringan
            $lines = array_slice(explode("\n", trim($content)), -150);
            $lines = array_reverse($lines); // Tampilkan error terbaru di atas

            foreach ($lines as $line) {
                if (empty(trim($line))) {
                    continue;
                }

                $level = 'INFO';
                if (stripos($line, '.ERROR:') !== false || stripos($line, 'exception') !== false || stripos($line, 'fatal') !== false) {
                    $level = 'ERROR';
                } elseif (stripos($line, '.WARNING:') !== false || stripos($line, 'timeout') !== false) {
                    $level = 'WARNING';
                }

                // Ekstrak timestamp jika ada format [2026-07-10 19:24:01]
                $timestamp = 'Baru saja';
                if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/', $line, $matches)) {
                    $timestamp = $matches[1];
                }

                $logs[] = [
                    'timestamp' => $timestamp,
                    'level'     => $level,
                    'message'   => substr($line, 0, 400), // Batasi panjang pesan
                ];
            }
        }

        // Cek diagnostik sistem real-time
        $activeEngine = config('services.ai_engine', 'gemini');
        $tunnelUrl = config('services.rag_backend.url', 'http://localhost:8001/chat');
        $sessionDriver = config('session.driver', 'cookie');
        $dbPath = database_path('database.sqlite');
        $dbSize = File::exists($dbPath) ? round(File::size($dbPath) / 1024, 2) . ' KB' : 'Database Cloud (PostgreSQL)';

        // Ping singkat ke Tunnel/Ollama untuk tes konektivitas (maksimal 2 detik)
        $tunnelStatus = 'Offline / Timeout';
        $tunnelPingMs = null;
        if ($activeEngine === 'ollama') {
            $startPing = microtime(true);
            try {
                $pingResp = Http::timeout(2)
                    ->withHeaders(['Bypass-Tunnel-Reminder' => 'true'])
                    ->get(str_replace('/chat', '/health', $tunnelUrl));
                if ($pingResp->successful()) {
                    $tunnelStatus = 'Online (200 OK)';
                    $tunnelPingMs = round((microtime(true) - $startPing) * 1000) . ' ms';
                } else {
                    $tunnelStatus = 'Error (' . $pingResp->status() . ')';
                }
            } catch (\Throwable $e) {
                $tunnelStatus = 'Timeout / Gagal Terhubung ke Laptop';
            }
        } else {
            $tunnelStatus = 'Standby (Mode Cloud Gemini Aktif)';
        }

        return Inertia::render('admin/SystemLogs', [
            'logs' => $logs,
            'systemStatus' => [
                'active_engine'   => strtoupper($activeEngine),
                'session_driver'  => strtoupper($sessionDriver),
                'tunnel_url'      => $tunnelUrl,
                'tunnel_status'   => $tunnelStatus,
                'tunnel_ping_ms'  => $tunnelPingMs,
                'log_file_size'   => $fileSize,
                'database_size'   => $dbSize,
                'php_version'     => PHP_VERSION,
            ],
        ]);
    }

    /**
     * Membersihkan / mengosongkan file laravel.log.
     */
    public function clear(): RedirectResponse
    {
        $logPath = storage_path('logs/laravel.log');
        if (File::exists($logPath)) {
            File::put($logPath, '');
            Log::info('SystemLogController: File log dibersihkan oleh admin.');
        }

        return redirect()->back()->with('success', 'System log berhasil dikosongkan.');
    }
}
