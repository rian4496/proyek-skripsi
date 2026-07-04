<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Services\ChatbotService;
use Illuminate\Http\JsonResponse;

/**
 * ChatbotController — endpoint penerima pesan chatbot.
 *
 * Controller ini hanya bertanggung jawab atas:
 * 1. Menerima dan memvalidasi request (via SendMessageRequest)
 * 2. Mendelegasikan logika matching ke ChatbotService (DIP)
 * 3. Mengembalikan response dalam format JSON
 *
 * Catatan Akademis (Skripsi Bab 3/4):
 * - **Thin Controller** — Controller tidak mengandung logika bisnis apapun.
 *   Seluruh proses pencocokan (matching) dan logging didelegasikan ke
 *   ChatbotService melalui mekanisme Dependency Injection.
 * - **Form Request** — Validasi input diisolasi di SendMessageRequest,
 *   mendukung prinsip Single Responsibility (SRP).
 */
class ChatbotController extends Controller
{
    /**
     * Dependency Injection: Laravel secara otomatis me-resolve
     * ChatbotService dari Service Container.
     */
    public function __construct(
        private readonly ChatbotService $chatbotService,
    ) {}

    /**
     * Menerima pesan dari pengguna dan mengembalikan respons chatbot.
     *
     * Endpoint ini mengembalikan:
     * - `response`: Jawaban chatbot
     * - `source`: Sumber jawaban ('rule' atau 'ai')
     * - `similarity_score`: Persentase kemiripan Levenshtein (null jika AI)
     * - `matched_rule_id`: ID rule yang cocok (null jika AI)
     * - `matched_keywords`: Keywords yang cocok
     *
     * @param  SendMessageRequest  $request  Request yang sudah tervalidasi
     * @return JsonResponse  Respons JSON berisi jawaban bot
     */
    public function sendMessage(SendMessageRequest $request): JsonResponse
    {
        $userId = $request->user()?->id;

        $result = $this->chatbotService->findResponse(
            $request->validated('message'),
            $userId,
        );

        return response()->json([
            'success' => true,
            'data' => [
                'response' => $result['response'],
                'source' => $result['source'],
                'matched_rule_id' => $result['matched_rule_id'],
                'similarity_score' => $result['similarity_score'],
                'matched_keywords' => $result['matched_keywords'],
            ],
        ]);
    }
}
