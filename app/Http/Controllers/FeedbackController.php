<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request, \App\Services\GeminiService $geminiService)
    {
        $validated = $request->validate([
            'nama_pelapor' => 'required|string|max:100',
            'npm' => 'nullable|string|max:20',
            'kategori_masalah' => 'required|string|max:100',
            'laporan' => 'required|string',
        ]);

        $validated['npm'] = !empty($validated['npm']) ? substr(trim($validated['npm']), 0, 20) : '-';

        // Analisis sentimen isi laporan keluhan menggunakan Gemini API
        try {
            $sentimentResult = $geminiService->analyzeSentiment($validated['laporan']);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Gagal analisis sentimen tiket', ['error' => $e->getMessage()]);
            $sentimentResult = ['sentiment' => 'neutral', 'score' => 0.5];
        }

        $validated['tanggal'] = now()->toDateString();
        $validated['status'] = 'pending';
        $validated['sentiment'] = $sentimentResult['sentiment'];
        $validated['sentiment_score'] = $sentimentResult['score'];

        try {
            Feedback::create($validated);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Gagal menyimpan tiket keluhan', ['error' => $e->getMessage()]);
        }

        return redirect()->back()->with('success', 'Tiket keluhan berhasil dikirim!');
    }
}
