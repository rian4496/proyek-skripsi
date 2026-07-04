<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('feedback', function (Blueprint $table) {
            $table->string('npm', 20)->nullable()->after('nama_pelapor')->comment('Nomor Pokok Mahasiswa');
            $table->string('kategori_masalah', 100)->nullable()->after('npm')->comment('Kategori masalah (cth: Akademik, Keuangan, dll)');
            $table->enum('status', ['pending', 'selesai'])->default('pending')->after('laporan')->comment('Status penyelesaian tiket');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('feedback', function (Blueprint $table) {
            $table->dropColumn(['npm', 'kategori_masalah', 'status']);
        });
    }
};
