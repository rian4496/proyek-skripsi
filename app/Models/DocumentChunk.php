<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Model DocumentChunk — Merepresentasikan potongan teks pedoman akademik
 * dan vektor embedding-nya untuk pencarian RAG (Retrieval-Augmented Generation).
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Model ini menampung potongan teks dari dokumen pedoman akademik kampus.
 * - Pada PostgreSQL cloud (Railway), kolom `embedding` bertipe `vector(768)` yang mendukung
 *   pencarian kemiripan kosinus (`1 - (embedding <=> ?)`).
 * - Scope `scopeCosineSearch` memungkinkan Laravel melakukan Semantic Search secara efisien
 *   menggunakan operator jarak kosinus PGVector.
 *
 * @property int $id
 * @property string $document_title
 * @property int $chunk_index
 * @property string $chunk_text
 * @property int $token_count
 * @property string|array|null $embedding
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class DocumentChunk extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'document_title',
        'chunk_index',
        'chunk_text',
        'token_count',
        'embedding',
    ];

    /**
     * Scope untuk melakukan pencarian kemiripan kosinus (Semantic Search / RAG) via PGVector.
     *
     * @param  Builder  $query
     * @param  array<int, float>  $vector
     * @param  int  $limit
     * @return Builder
     */
    public function scopeCosineSearch(Builder $query, array $vector, int $limit = 3): Builder
    {
        $driver = DB::connection()->getDriverName();

        if ($driver !== 'pgsql') {
            // Jika bukan PostgreSQL (misal lokal MySQL), kembalikan query standar terbaru
            return $query->latest()->limit($limit);
        }

        $vectorString = '[' . implode(',', $vector) . ']';

        return $query->select('*')
            ->selectRaw('(1 - (embedding <=> ?)) AS similarity_score', [$vectorString])
            ->whereRaw('embedding IS NOT NULL')
            ->orderByRaw('embedding <=> ? ASC', [$vectorString])
            ->limit($limit);
    }
}
