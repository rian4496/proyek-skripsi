<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Model ChatRule — representasi data aturan chatbot rule-based.
 *
 * Setiap ChatRule menyimpan satu set kata kunci (keywords) dalam format JSON array
 * dan satu respons jawaban. Eloquent secara otomatis melakukan casting JSON ↔ array
 * melalui method `casts()`, sehingga akses `$chatRule->keywords` langsung
 * mengembalikan PHP array tanpa perlu `json_decode()` manual.
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - **Eloquent ORM** menerapkan pola Active Record, di mana setiap instance model
 *   merepresentasikan satu baris dalam tabel database.
 * - **JSON Casting** merupakan implementasi Transparent Data Transformation,
 *   memungkinkan penyimpanan data semi-terstruktur dalam kolom relasional.
 * - **Query Scopes** menerapkan prinsip DRY (Don't Repeat Yourself) dengan
 *   mengenkapsulasi logika query yang sering dipakai ulang.
 *
 * @property int $id
 * @property array<int, string> $keywords
 * @property string $response
 * @property string|null $category
 * @property bool $is_active
 * @property int $priority
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
#[Fillable(['keywords', 'response', 'category', 'is_active', 'priority'])]
class ChatRule extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'keywords',
        'response',
        'category',
        'is_active',
        'priority',
    ];
    /**
     * Attribute casting untuk transformasi data otomatis.
     *
     * - `keywords` → array: JSON string di database di-cast ke PHP array
     * - `is_active` → boolean: integer 0/1 di-cast ke PHP bool
     * - `priority` → integer: memastikan konsistensi tipe data
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'keywords' => 'array',
            'is_active' => 'boolean',
            'priority' => 'integer',
        ];
    }

    /**
     * Scope: filter hanya rule yang aktif.
     *
     * Penggunaan: ChatRule::active()->get()
     *
     * @param  Builder<ChatRule>  $query
     * @return Builder<ChatRule>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: filter berdasarkan kategori.
     *
     * Penggunaan: ChatRule::byCategory('akademik')->get()
     *
     * @param  Builder<ChatRule>  $query
     * @return Builder<ChatRule>
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Scope: urutkan berdasarkan prioritas tertinggi.
     *
     * Penggunaan: ChatRule::active()->highestPriority()->get()
     *
     * @param  Builder<ChatRule>  $query
     * @return Builder<ChatRule>
     */
    public function scopeHighestPriority(Builder $query): Builder
    {
        return $query->orderByDesc('priority');
    }
}
