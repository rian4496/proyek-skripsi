<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambah kolom `is_helpful` untuk fitur feedback mahasiswa.
     *
     * Catatan Akademis (Skripsi Bab 4):
     * Kolom ini mendukung evaluasi kepuasan pengguna (User Satisfaction)
     * terhadap respons chatbot. Nilai: true (👍), false (👎), null (belum dinilai).
     */
    public function up(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->boolean('is_helpful')
                ->nullable()
                ->after('similarity_score')
                ->comment('Feedback: true=helpful, false=not helpful, null=belum dinilai');
        });
    }

    public function down(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->dropColumn('is_helpful');
        });
    }
};
