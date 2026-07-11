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
            $table->string('npm', 50)->nullable()->after('nama_mahasiswa')->comment('Nomor Pokok Mahasiswa (NPM)');
        });

        Schema::table('session_reviews', function (Blueprint $table) {
            $table->string('npm', 50)->nullable()->after('nama_responden')->comment('Nomor Pokok Mahasiswa (NPM)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->dropColumn('npm');
        });

        Schema::table('session_reviews', function (Blueprint $table) {
            $table->dropColumn('npm');
        });
    }
};
