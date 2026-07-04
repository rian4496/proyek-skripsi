<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Membuat tabel `mahasiswa` untuk autentikasi mahasiswa.
     *
     * Catatan Akademis (Skripsi Bab 3/4):
     * - Tabel ini terpisah dari `users` bawaan Laravel untuk mendukung
     *   arsitektur **Multi-Guard Authentication**. Setiap aktor (Mahasiswa, Admin)
     *   memiliki tabel dan guard sendiri, menerapkan prinsip
     *   **Interface Segregation Principle (ISP)** — setiap guard hanya
     *   mengekspos atribut yang relevan untuk aktor tersebut.
     */
    public function up(): void
    {
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->id();
            $table->string('nim')->unique()->comment('Nomor Induk Mahasiswa');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('program_studi')->nullable()->comment('Program studi mahasiswa');
            $table->rememberToken();
            $table->timestamps();

            $table->index('nim');
            $table->index('program_studi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswa');
    }
};
