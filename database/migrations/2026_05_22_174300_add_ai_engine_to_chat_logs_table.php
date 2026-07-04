<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Menambahkan kolom `ai_engine` untuk membedakan engine AI fallback
     * yang digunakan: 'gemini' (Cloud) atau 'ollama' (Lokal via n8n).
     *
     * Catatan Akademis (Skripsi Bab 3):
     * Kolom ini mendukung analisis komparatif performa engine pada Bab IV.
     */
    public function up(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->string('ai_engine', 20)->nullable()->after('source')->comment('Engine AI: gemini / ollama');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->dropColumn('ai_engine');
        });
    }
};
