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
            'npm' => ['required', 'regex:/^[0-9]{10}$/'],
            'kategori_masalah' => 'required|string|max:100',
            'laporan' => 'required|string',
        ], [
            'npm.regex' => 'Format NPM tidak valid! Harus berupa 10 digit angka (contoh: 2110010123).',
        ]);

        // Analisis sentimen isi laporan keluhan menggunakan Gemini API
        $sentimentResult = $geminiService->analyzeSentiment($validated['laporan']);

        $validated['tanggal'] = now()->toDateString();
        $validated['status'] = 'pending';
        $validated['sentiment'] = $sentimentResult['sentiment'];
        $validated['sentiment_score'] = $sentimentResult['score'];

        Feedback::create($validated);

        return redirect()->back();
    }
}
