<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model ChatLog — menyimpan riwayat percakapan chatbot.
 *
 * Setiap record merepresentasikan satu pasang pertanyaan-jawaban (Q&A pair)
 * beserta metadata sumber jawaban dan skor kemiripan.
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Model ini mendukung pengumpulan data kuantitatif untuk analisis
 *   efektivitas chatbot pada Bab IV (Hasil dan Pembahasan).
 * - Kolom `source` memungkinkan perbandingan proporsi jawaban rule-based vs AI.
 * - Kolom `similarity_score` menyediakan data distribusi kemiripan Levenshtein.
 *
 * @property int $id
 * @property int|null $user_id
 * @property string $user_message
 * @property string $bot_response
 * @property string $source
 * @property int|null $matched_rule_id
 * @property float|null $similarity_score
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
#[Fillable(['user_id', 'nama_mahasiswa', 'fakultas', 'prodi', 'user_message', 'bot_response', 'source', 'ai_engine', 'matched_rule_id', 'similarity_score', 'latency_ms', 'is_helpful'])]
class ChatLog extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'nama_mahasiswa',
        'fakultas',
        'prodi',
        'user_message',
        'bot_response',
        'source',
        'ai_engine',
        'matched_rule_id',
        'similarity_score',
        'latency_ms',
        'is_helpful',
    ];
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'similarity_score' => 'float',
            'latency_ms' => 'integer',
            'is_helpful' => 'boolean',
        ];
    }

    /**
     * Relasi ke User yang mengirim pesan.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: filter log yang dijawab oleh rule-based.
     *
     * @param  Builder<ChatLog>  $query
     * @return Builder<ChatLog>
     */
    public function scopeFromRules(Builder $query): Builder
    {
        return $query->where('source', 'rule');
    }

    /**
     * Scope: filter log yang dijawab oleh Gemini AI.
     *
     * @param  Builder<ChatLog>  $query
     * @return Builder<ChatLog>
     */
    public function scopeFromAi(Builder $query): Builder
    {
        return $query->where('source', 'ai');
    }
}
