<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
        $directory = base_path('rag-backend/data');
        
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
                'url' => route('admin.upload-document.download', ['filename' => $file->getFilename()]),
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
        
        $directory = base_path('rag-backend/data');
        
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        // Simpan file ke direktori rag-backend/data
        $file->move($directory, $filename);

        // Otomatis trigger indexing di PGVector (PostgreSQL Railway) jika format .txt atau .pdf
        try {
            $lower = strtolower($filename);
            if (str_ends_with($lower, '.txt') || str_ends_with($lower, '.pdf')) {
                $pgvector = app(\App\Services\PGVectorService::class);
                $content = $pgvector->extractTextFromFile("{$directory}/{$filename}");
                if (!empty($content)) {
                    $docTitle = ucwords(str_replace(['_', '.txt', '.pdf'], [' ', '', ''], $filename));
                    $pgvector->indexTextDocument($content, $docTitle);
                    Log::info("PGVector auto-indexing selesai untuk dokumen: {$docTitle}");
                }
            }
        } catch (\Exception $e) {
            Log::warning('Gagal auto-indexing PGVector: ' . $e->getMessage());
        }

        // Otomatis trigger re-indexing di FastAPI RAG backend (port 8001)
        try {
            Http::timeout(10)->get('http://127.0.0.1:8001/reload');
            Log::info("FastAPI RAG reload triggered after uploading: {$filename}");
        } catch (\Exception $e) {
            Log::warning('Gagal trigger reload FastAPI RAG: ' . $e->getMessage());
        }

        return redirect()->route('admin.upload-document.index')
            ->with('success', 'Dokumen "' . $filename . '" berhasil diunggah dan otomatis di-index oleh RAG & PGVector!');
    }

    /**
     * Hapus dokumen.
     */
    public function destroy(string $filename): RedirectResponse
    {
        // Hindari Directory Traversal Vulnerability
        $filename = basename($filename);
        $filePath = base_path('rag-backend/data/' . $filename);

        if (File::exists($filePath)) {
            File::delete($filePath);

            // Hapus juga chunks di tabel document_chunks PGVector
            try {
                $docTitle = ucwords(str_replace(['_', '.txt', '.pdf'], [' ', '', ''], $filename));
                \App\Models\DocumentChunk::where('document_title', $docTitle)->delete();
                Log::info("PGVector chunks dihapus untuk: {$docTitle}");
            } catch (\Exception $e) {
                Log::warning('Gagal hapus chunks PGVector: ' . $e->getMessage());
            }

            // Otomatis trigger re-indexing di FastAPI RAG backend (port 8001)
            try {
                Http::timeout(10)->get('http://127.0.0.1:8001/reload');
                Log::info("FastAPI RAG reload triggered after deleting: {$filename}");
            } catch (\Exception $e) {
                Log::warning('Gagal trigger reload FastAPI RAG: ' . $e->getMessage());
            }

            return redirect()->route('admin.upload-document.index')
                ->with('success', 'Dokumen "' . $filename . '" berhasil dihapus dari server dan index RAG & PGVector diperbarui.');
        }

        return redirect()->route('admin.upload-document.index')
            ->with('error', 'Dokumen tidak ditemukan.');
    }

    /**
     * Download dokumen RAG.
     */
    public function download(string $filename)
    {
        $filename = basename($filename);
        $filePath = base_path('rag-backend/data/' . $filename);

        if (File::exists($filePath)) {
            return response()->download($filePath);
        }

        abort(404, 'Dokumen tidak ditemukan.');
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
