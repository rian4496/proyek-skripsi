<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatRule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller Manajemen Chat Rule untuk Admin.
 *
 * Menerapkan fitur CRUD (Create, Read, Update, Delete) pada tabel chat_rules.
 *
 * Catatan Akademis:
 * Menggunakan pendekatan "Resourceful Controller" dalam Laravel yang
 * mengadopsi standar RESTful routing, namun respons dikelola oleh Inertia.js.
 * Pemisahan koma pada keyword diubah menjadi array PHP murni (`array_map('trim')`)
 * untuk mencegah error spasi tambahan pada algoritma perhitungan Levenshtein berantai.
 */
class ChatRuleController extends Controller
{
    /**
     * Tampilkan daftar (tabel) ChatRule.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $rules = ChatRule::query()
            ->when($search, function ($query, $search) {
                $query->where('keywords', 'like', "%{$search}%")
                      ->orWhere('response', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        return Inertia::render('admin/chat-rules/Index', [
            'rules' => $rules,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Tampilkan form untuk membuat ChatRule baru.
     */
    public function create(): Response
    {
        return Inertia::render('admin/chat-rules/Form', [
            // Kirim empty record sebagai placeholder
            'chatRule' => [
                'id' => null,
                'keywords' => '',
                'response' => '',
                'category' => 'akademik',
                'priority' => 10,
                'is_active' => true,
            ]
        ]);
    }

    /**
     * Simpan ChatRule baru ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateRule($request);
        
        // Transform data: string pisah koma -> array bersih
        $validated['keywords'] = $this->parseKeywords($validated['keywords']);

        ChatRule::create($validated);

        return redirect()->route('admin.chat-rules.index')
            ->with('success', 'Berhasil menambahkan Rule baru!');
    }

    /**
     * Tampilkan form untuk edit ChatRule.
     */
    public function edit(ChatRule $chatRule): Response
    {
        // Ubah array kembali menjadi comma-separated string untuk UI Input
        $ruleArray = $chatRule->toArray();
        $ruleArray['keywords'] = implode(', ', $chatRule->keywords);

        return Inertia::render('admin/chat-rules/Form', [
            'chatRule' => $ruleArray,
        ]);
    }

    /**
     * Update data ChatRule di database.
     */
    public function update(Request $request, ChatRule $chatRule): RedirectResponse
    {
        $validated = $this->validateRule($request);
        
        // Transform data: string pisah koma -> array bersih
        $validated['keywords'] = $this->parseKeywords($validated['keywords']);

        $chatRule->update($validated);

        return redirect()->route('admin.chat-rules.index')
            ->with('success', 'Berhasil memperbarui Rule!');
    }

    /**
     * Hapus permanen ChatRule.
     */
    public function destroy(ChatRule $chatRule): RedirectResponse
    {
        $chatRule->delete();

        return redirect()->route('admin.chat-rules.index')
            ->with('success', 'Rule berhasil dihapus!');
    }

    /**
     * Helper method validasi agar DRY (Don't Repeat Yourself).
     */
    private function validateRule(Request $request): array
    {
        return $request->validate([
            'keywords' => 'required|string',
            'response' => 'required|string',
            'category' => 'nullable|string|max:50',
            'priority' => 'required|integer|min:1|max:99',
            'is_active' => 'boolean',
        ]);
    }

    /**
     * Helper method parse keywords.
     * Membersihkan spasi liar (trim) dari setiap keyword agar kalkulasi
     * algoritma Levenshtein di ChatbotService lebih presisi secara statistik.
     */
    private function parseKeywords(string $keywordsStr): array
    {
        // Pecah berdasarkan koma
        $rawArray = explode(',', $keywordsStr);
        
        // Trim spasi dan buang item string kosong
        $cleanArray = array_filter(array_map('trim', $rawArray), function ($val) {
            return $val !== '';
        });

        // Re-index array (array_values) agar json ter-encode sbg list (bukan object/dictionary)
        return array_values($cleanArray);
    }
}
