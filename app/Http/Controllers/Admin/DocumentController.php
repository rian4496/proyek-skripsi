<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

/**
 * DocumentController — Untuk Mengelola Dokumen RAG (aturan.txt, dll).
 *
 * Catatan Akademis (Skripsi Bab 4):
 * Controller ini memfasilitasi administrasi berkas dokumen akademik
 * agar dapat dibaca oleh engine RAG secara dinamis via URL.
 */
class DocumentController extends Controller
{
    /**
     * Tampilkan halaman daftar dokumen.
     */
    public function index(): Response
    {
        $directory = public_path('documents');
        
        // Buat folder jika belum ada
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $files = [];
        $fileList = File::files($directory);

        foreach ($fileList as $file) {
            $files[] = [
                'name' => $file->getFilename(),
                'size' => $this->formatBytes($file->getSize()),
                'raw_size' => $file->getSize(),
                'updated_at' => date('Y-m-d H:i:s', $file->getMTime()),
                'url' => asset('documents/' . $file->getFilename()),
            ];
        }

        // Urutkan berdasarkan waktu modifikasi terbaru
        usort($files, function ($a, $b) {
            return strtotime($b['updated_at']) - strtotime($a['updated_at']);
        });

        return Inertia::render('admin/UploadDocument', [
            'files' => $files,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Upload dokumen baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'document' => 'required|file|mimes:txt,pdf,doc,docx,csv,xlsx,xls|max:15360', // Maks 15MB
        ], [
            'document.required' => 'Silakan pilih berkas dokumen terlebih dahulu.',
            'document.file' => 'Berkas yang diunggah tidak valid.',
            'document.mimes' => 'Format berkas harus berupa .txt, .pdf, .doc, .docx, .csv, atau .xlsx.',
            'document.max' => 'Ukuran berkas maksimal adalah 15 MB.',
        ]);

        $file = $request->file('document');
        $filename = $file->getClientOriginalName();
        
        $directory = public_path('documents');
        
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        // Simpan file ke direktori public/documents
        $file->move($directory, $filename);

        return redirect()->route('admin.upload-document.index')
            ->with('success', 'Dokumen "' . $filename . '" berhasil diunggah dan siap di-index oleh RAG!');
    }

    /**
     * Hapus dokumen.
     */
    public function destroy(string $filename): RedirectResponse
    {
        // Hindari Directory Traversal Vulnerability
        $filename = basename($filename);
        $filePath = public_path('documents/' . $filename);

        if (File::exists($filePath)) {
            File::delete($filePath);
            return redirect()->route('admin.upload-document.index')
                ->with('success', 'Dokumen "' . $filename . '" berhasil dihapus dari server.');
        }

        return redirect()->route('admin.upload-document.index')
            ->with('error', 'Dokumen tidak ditemukan.');
    }

    /**
     * Format byte menjadi format yang mudah dibaca.
     */
    private function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
