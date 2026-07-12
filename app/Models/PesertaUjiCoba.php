<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model PesertaUjiCoba — Master Data Responden Uji Coba Chatbot (Skripsi Bab IV).
 *
 * @property int $id
 * @property string $nama_mahasiswa
 * @property string $npm
 * @property string|null $fakultas
 * @property string|null $prodi
 * @property int $total_queries
 * @property \Illuminate\Support\Carbon|null $last_active_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class PesertaUjiCoba extends Model
{
    protected $table = 'peserta_uji_coba';

    protected $fillable = [
        'nama_mahasiswa',
        'npm',
        'fakultas',
        'prodi',
        'total_queries',
        'last_active_at',
    ];

    protected $casts = [
        'total_queries' => 'integer',
        'last_active_at' => 'datetime',
    ];

    /**
     * Relasi ke riwayat percakapan (ChatLog) milik peserta ini berdasarkan NPM.
     */
    public function chatLogs(): HasMany
    {
        return $this->hasMany(ChatLog::class, 'npm', 'npm');
    }

    /**
     * Relasi ke evaluasi sesi (SessionReview) milik peserta ini berdasarkan NPM.
     */
    public function sessionReviews(): HasMany
    {
        return $this->hasMany(SessionReview::class, 'npm', 'npm');
    }
}
