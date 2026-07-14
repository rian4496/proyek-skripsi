<?php

namespace App\Console\Commands;

use App\Services\PGVectorService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/**
 * IndexPGVectorCommand — Perintah terminal untuk memotong (chunking) dan
 * menghasilkan vektor embedding dokumen pedoman akademik ke dalam tabel PostgreSQL.
 *
 * Catatan Akademis (Skripsi Bab 4):
 * - Command `php artisan rag:index-pgvector` mempermudah pengisian knowledge base RAG
 *   secara terpusat di PostgreSQL tanpa perlu memproses manual lewat Python.
 */
class IndexPGVectorCommand extends Command
{
    /**
     * Nama dan signature perintah console.
     *
     * @var string
     */
    protected $signature = 'rag:index-pgvector {filename=pedoman_akademik_2025_2026.txt : Nama file (.txt/.pdf) di dalam folder rag-backend/data (atau ketik "all")} {--all : Index seluruh file .txt & .pdf di folder rag-backend/data}';

    /**
     * Deskripsi perintah console.
     *
     * @var string
     */
    protected $description = 'Memotong teks dokumen akademik (.txt & .pdf) dan memproses vector embeddings ke tabel document_chunks';

    /**
     * Eksekusi perintah console.
     */
    public function handle(PGVectorService $pgvectorService): int
    {
        // Alokasikan memori tak terbatas khusus saat proses ekstraksi & vektorisasi CLI
        ini_set('memory_limit', '-1');

        $filename = $this->argument('filename');
        $isAll = $this->option('all') || strtolower((string) $filename) === 'all';
        $directory = base_path('rag-backend/data');

        if (!File::exists($directory)) {
            $this->error("Direktori tidak ditemukan di: {$directory}");
            return self::FAILURE;
        }

        if ($isAll) {
            $files = File::files($directory);
            $targetFiles = array_filter($files, fn ($f) => 
                str_ends_with(strtolower($f->getFilename()), '.txt') || 
                str_ends_with(strtolower($f->getFilename()), '.pdf')
            );

            if (empty($targetFiles)) {
                $this->warn("⚠️ Tidak ada file berformat .txt atau .pdf di dalam folder {$directory}");
                return self::FAILURE;
            }

            $this->info("🚀 Memulai indexing untuk " . count($targetFiles) . " file dokumen (.txt & .pdf) di dalam rag-backend/data/...");
            $totalSaved = 0;

            foreach ($targetFiles as $file) {
                $fname = $file->getFilename();
                $this->line("➤ Memproses file: <info>{$fname}</info>");
                $content = $pgvectorService->extractTextFromFile($file->getPathname());
                
                if (empty(trim((string) $content))) {
                    $this->warn("   ⚠️ Gagal mengekstrak teks / file kosong: {$fname}");
                    continue;
                }

                $documentTitle = ucwords(str_replace(['_', '.txt', '.pdf'], [' ', '', ''], $fname));

                $savedCount = $pgvectorService->indexTextDocument($content, $documentTitle);
                $totalSaved += $savedCount;
                $this->line("   ↳ Tersimpan {$savedCount} chunks untuk '{$documentTitle}'");
            }

            $this->info("✅ Selesai! Total {$totalSaved} potongan dokumen berhasil di-index ke tabel document_chunks PGVector!");
            return self::SUCCESS;
        }

        $filePath = "{$directory}/{$filename}";

        if (!File::exists($filePath)) {
            $this->error("Berkas dokumen tidak ditemukan di: {$filePath}");
            $this->line("Pastikan file berada di dalam folder rag-backend/data/ atau gunakan opsi --all");
            return self::FAILURE;
        }

        $this->info("Memuat dan mengekstrak dokumen: {$filename}...");
        $content = $pgvectorService->extractTextFromFile($filePath);

        if (empty(trim((string) $content))) {
            $this->error("Gagal mengekstrak teks dari berkas: {$filename}. Pastikan format .txt/.pdf valid dan tidak diproteksi sandi.");
            return self::FAILURE;
        }

        $documentTitle = ucwords(str_replace(['_', '.txt', '.pdf'], [' ', '', ''], $filename));
        
        $this->info("Memproses chunking dan vector embedding untuk '{$documentTitle}'...");
        $this->output->progressStart(100);

        $savedCount = $pgvectorService->indexTextDocument($content, $documentTitle);

        $this->output->progressFinish();

        if ($savedCount > 0) {
            $this->info("✅ Berhasil meng-index {$savedCount} potongan dokumen (chunks) ke dalam tabel document_chunks!");
            return self::SUCCESS;
        } else {
            $this->warn("⚠️ Tidak ada potongan dokumen yang berhasil disimpan. Cek koneksi ke Ollama / Gemini API untuk pemanggilan embedding.");
            return self::FAILURE;
        }
    }
}
