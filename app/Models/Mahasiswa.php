<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Model Mahasiswa — aktor mahasiswa dalam sistem autentikasi multi-guard.
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - Menggunakan arsitektur **Multi-Guard Authentication** di mana setiap
 *   aktor (Mahasiswa, Admin) memiliki model Authenticatable terpisah.
 * - Properti `$table` di-set eksplisit ke 'mahasiswa' (singular) sesuai
 *   konvensi penamaan Bahasa Indonesia, override default Laravel plural.
 *
 * @property int $id
 * @property string $nim
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $program_studi
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
#[Fillable(['nim', 'name', 'email', 'password', 'program_studi'])]
#[Hidden(['password', 'remember_token'])]
class Mahasiswa extends Authenticatable
{
    /**
     * Nama tabel eksplisit (singular, sesuai konvensi Bahasa Indonesia).
     */
    protected $table = 'mahasiswa';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}
