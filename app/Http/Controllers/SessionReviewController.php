<?php

namespace App\Http\Controllers;

use App\Models\SessionReview;
use Illuminate\Http\Request;

class SessionReviewController extends Controller
{
    /**
     * Simpan ulasan sesi dari responden (POST /session-reviews).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_responden' => 'nullable|string|max:100',
            'fakultas' => 'nullable|string|max:100',
            'prodi' => 'nullable|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string',
        ]);

        SessionReview::create($validated);

        return response()->json(['success' => true]);
    }

    /**
     * Hapus ulasan sesi tertentu (DELETE /admin/session-reviews/{sessionReview}).
     */
    public function destroy(SessionReview $sessionReview)
    {
        $sessionReview->delete();

        return redirect()->back();
    }

    /**
     * Hapus semua ulasan sesi (DELETE /admin/session-reviews/clear).
     */
    public function destroyAll()
    {
        SessionReview::truncate();

        return redirect()->back();
    }
}
