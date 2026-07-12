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
        Schema::create('peserta_uji_coba', function (Blueprint $table) {
            $table->id();
            $table->string('nama_mahasiswa', 100);
            $table->string('npm', 50)->unique()->comment('Nomor Pokok Mahasiswa (NPM)');
            $table->string('fakultas', 100)->nullable();
            $table->string('prodi', 100)->nullable();
            $table->unsignedInteger('total_queries')->default(0)->comment('Total interaksi chat oleh peserta ini');
            $table->timestamp('last_active_at')->nullable()->comment('Waktu terakhir aktif di sistem chatbot');
            $table->timestamps();

            $table->index('fakultas');
            $table->index('prodi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peserta_uji_coba');
    }
};
