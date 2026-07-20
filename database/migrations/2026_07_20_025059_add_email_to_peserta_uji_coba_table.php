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
        Schema::table('peserta_uji_coba', function (Blueprint $table) {
            $table->string('email', 100)->nullable()->after('npm')->comment('Email responden (opsional)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('peserta_uji_coba', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }
};
