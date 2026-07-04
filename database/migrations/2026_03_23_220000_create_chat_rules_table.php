<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Membuat tabel `chat_rules` untuk menyimpan aturan chatbot rule-based.
     * Kolom `keywords` menggunakan tipe JSON untuk fleksibilitas penyimpanan
     * multiple kata kunci dalam satu rule tanpa normalisasi tabel terpisah.
     *
     * @see \App\Models\ChatRule
     */
    public function up(): void
    {
        Schema::create('chat_rules', function (Blueprint $table) {
            $table->id();
            $table->json('keywords')->comment('JSON array of keyword patterns for matching');
            $table->text('response')->comment('Bot response text when keywords match');
            $table->string('category')->nullable()->comment('Optional grouping: akademik, administrasi, umum');
            $table->boolean('is_active')->default(true)->comment('Toggle to enable/disable this rule');
            $table->integer('priority')->default(0)->comment('Higher value = matched first');
            $table->timestamps();

            $table->index('is_active');
            $table->index('category');
            $table->index('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_rules');
    }
};
