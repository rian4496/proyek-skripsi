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
            $table->string('topic_category')->nullable()->after('prodi')->index('idx_topic_category');
        });

        // Backfill data lama agar filter langsung bekerja
        $logs = \App\Models\ChatLog::all();
        foreach ($logs as $log) {
            $topic = \App\Models\ChatLog::classifyTopic($log->user_message);
            $log->updateQuietly(['topic_category' => $topic]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->dropIndex('idx_topic_category');
            $table->dropColumn('topic_category');
        });
    }
};
