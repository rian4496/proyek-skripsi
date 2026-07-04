<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';
    protected $primaryKey = 'id_feedback';

    protected $fillable = [
        'nama_pelapor',
        'npm',
        'kategori_masalah',
        'laporan',
        'status',
        'tanggal',
        'sentiment',
        'sentiment_score',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];
}
