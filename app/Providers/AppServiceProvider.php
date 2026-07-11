<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // Self-Healing Schema: Pastikan kolom-kolom analitik & riwayat ada di tabel chat_logs pada Railway
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('chat_logs')) {
                \Illuminate\Support\Facades\Schema::table('chat_logs', function (\Illuminate\Database\Schema\Blueprint $table) {
                    if (! \Illuminate\Support\Facades\Schema::hasColumn('chat_logs', 'nama_mahasiswa')) {
                        $table->string('nama_mahasiswa', 100)->nullable();
                    }
                    if (! \Illuminate\Support\Facades\Schema::hasColumn('chat_logs', 'fakultas')) {
                        $table->string('fakultas', 100)->nullable();
                    }
                    if (! \Illuminate\Support\Facades\Schema::hasColumn('chat_logs', 'prodi')) {
                        $table->string('prodi', 100)->nullable();
                    }
                    if (! \Illuminate\Support\Facades\Schema::hasColumn('chat_logs', 'ai_engine')) {
                        $table->string('ai_engine', 50)->nullable();
                    }
                    if (! \Illuminate\Support\Facades\Schema::hasColumn('chat_logs', 'latency_ms')) {
                        $table->integer('latency_ms')->nullable();
                    }
                    if (! \Illuminate\Support\Facades\Schema::hasColumn('chat_logs', 'is_helpful')) {
                        $table->boolean('is_helpful')->nullable();
                    }
                });
            }
        } catch (\Throwable $e) {
            // Abaikan error koneksi database saat fase build statis nixpacks
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
