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
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->string('nama_mahasiswa', 100)->nullable()->after('user_id')->comment('Nama lengkap peserta penguji');
            $table->string('fakultas', 100)->nullable()->after('nama_mahasiswa')->comment('Fakultas peserta penguji');
            $table->string('prodi', 100)->nullable()->after('fakultas')->comment('Program studi peserta penguji');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->dropColumn(['nama_mahasiswa', 'fakultas', 'prodi']);
        });
    }
};
