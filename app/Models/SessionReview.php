<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * SessionReview — Model untuk menyimpan ulasan dan kepuasan sesi responden (Bab IV Skripsi).
 */
class SessionReview extends Model
{
    protected $table = 'session_reviews';

    protected $fillable = [
        'nama_responden',
        'npm',
        'fakultas',
        'prodi',
        'rating',
        'komentar',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}
