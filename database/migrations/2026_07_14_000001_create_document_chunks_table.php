<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migration CreateDocumentChunksTable — Membuat tabel penyimpanan dokumen RAG dan vektor embedding.
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Tabel ini dirancang adaptif (Database-Agnostic) agar dapat berjalan di lingkungan
 *   lokal MySQL/Herd maupun production PostgreSQL cloud (Railway).
 * - Pada PostgreSQL (`pgsql`), ekstensi `pgvector` diaktifkan dan kolom `embedding`
 *   dibuat dengan tipe `vector(768)` beserta index HNSW (Hierarchical Navigable Small World).
 * - Pada MySQL (`mysql`), kolom `embedding` dibuat bertipe `longtext` untuk menampung JSON array.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            // Aktifkan ekstensi pgvector di PostgreSQL Railway
            DB::statement('CREATE EXTENSION IF NOT EXISTS vector;');
        }

        Schema::create('document_chunks', function (Blueprint $table) use ($driver) {
            $table->id();
            $table->string('document_title')->default('Pedoman Akademik 2025/2026')->index();
            $table->integer('chunk_index')->default(0);
            $table->text('chunk_text');
            $table->integer('token_count')->default(0);

            if ($driver === 'mysql') {
                $table->longText('embedding')->nullable();
            }

            $table->timestamps();
        });

        if ($driver === 'pgsql') {
            // Tambahkan kolom vector(768) secara native SQL di PostgreSQL
            DB::statement('ALTER TABLE document_chunks ADD COLUMN embedding vector(768);');

            // Buat index HNSW untuk pencarian vektor super cepat menggunakan Cosine Distance
            DB::statement('CREATE INDEX document_chunks_embedding_hnsw_idx ON document_chunks USING hnsw (embedding vector_cosine_ops);');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_chunks');
    }
};
