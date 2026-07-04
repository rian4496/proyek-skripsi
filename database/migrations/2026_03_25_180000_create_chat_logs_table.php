<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Membuat tabel `chat_logs` untuk menyimpan riwayat percakapan chatbot.
     *
     * Catatan Akademis (Skripsi Bab 3/4):
     * - Tabel ini menerapkan pola **Conversation Logging** untuk analisis
     *   efektivitas chatbot dan data penelitian skripsi (Bab IV).
     * - Kolom `source` (enum: 'rule', 'ai') memungkinkan klasifikasi
     *   jawaban berdasarkan sumber, mendukung analisis perbandingan
     *   antara pendekatan rule-based dan AI-based.
     * - `similarity_score` menyimpan persentase kemiripan Levenshtein
     *   untuk data kuantitatif pada Bab IV.
     */
    public function up(): void
    {
        Schema::create('chat_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->comment('FK ke users, nullable untuk pengguna anonim');
            $table->text('user_message')->comment('Pesan input dari pengguna');
            $table->text('bot_response')->comment('Respons yang diberikan chatbot');
            $table->enum('source', ['rule', 'ai'])->comment('Sumber jawaban: rule-based atau Gemini AI');
            $table->unsignedBigInteger('matched_rule_id')
                ->nullable()
                ->comment('ID ChatRule yang cocok, null jika source=ai');
            $table->float('similarity_score')
                ->nullable()
                ->comment('Persentase kemiripan Levenshtein (0-100)');
            $table->timestamps();

            $table->index('user_id');
            $table->index('source');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_logs');
    }
};
