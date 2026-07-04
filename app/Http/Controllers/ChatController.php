<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Models\ChatLog;
use App\Services\ChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

/**
 * ChatController — Menangani interaksi chatbot dan feedback.
 *
 * Catatan Akademis:
 * - Method `store`: menerima pesan dari React+Inertia, memproses via ChatbotService,
 *   lalu redirect back dengan flash data (jawaban bot + chat_log_id).
 * - Method `storeFeedback`: menerima penilaian 👍/👎 dari mahasiswa
 *   dan menyimpan ke kolom `is_helpful` untuk evaluasi Bab IV.
 */
class ChatController extends Controller
{
    /**
     * Menerima dan memproses pesan chatbot (POST /chat).
     */
    public function store(SendMessageRequest $request, ChatbotService $chatbotService): RedirectResponse
    {
        $userId = $request->user()?->id;

        $result = $chatbotService->findResponse(
            $request->validated('message'),
            $userId,
            [
                'nama_mahasiswa' => $request->input('nama_mahasiswa'),
                'fakultas' => $request->input('fakultas'),
                'prodi' => $request->input('prodi'),
            ]
        );

        return back()->with('result', $result);
    }

    /**
     * Menyimpan feedback (👍/👎) dari mahasiswa (PATCH /chat/{chatLog}/feedback).
     *
     * Catatan Akademis (Skripsi Bab 4):
     * Endpoint ini mendukung pengumpulan data evaluasi kepuasan pengguna
     * untuk analisis kuantitatif pada pembahasan hasil penelitian.
     */
    public function storeFeedback(ChatLog $chatLog): JsonResponse
    {
        $chatLog->update([
            'is_helpful' => request()->boolean('is_helpful'),
        ]);

        return response()->json(['success' => true]);
    }
}
