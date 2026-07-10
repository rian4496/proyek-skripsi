<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Google Gemini AI
    |--------------------------------------------------------------------------
    |
    | Konfigurasi untuk integrasi Gemini API sebagai AI fallback
    | pada Hybrid Chatbot Pelayanan Akademik.
    |
    */
    'gemini' => [
        'api_key' => env('GEMINI_API_KEY', ''),
        'model' => env('GEMINI_MODEL', 'gemini-2.0-flash'),
    ],


    /*
    |--------------------------------------------------------------------------
    | AI Engine Switch & FastAPI RAG Backend (Local Development)
    |--------------------------------------------------------------------------
    |
    | Konfigurasi untuk memilih engine AI fallback secara dinamis.
    | - 'gemini': menggunakan Google Gemini Cloud API (produksi)
    | - 'ollama': menggunakan FastAPI RAG Backend → Ollama Qwen 2.5 lokal (development)
    |
    | Catatan Akademis (Skripsi Bab 3):
    | Implementasi ini menerapkan **Strategy Pattern** melalui konfigurasi,
    | memungkinkan pergantian engine AI tanpa modifikasi kode (OCP).
    |
    */
    'ai_engine' => env('AI_ENGINE', 'gemini'),

    'rag_backend' => [
        'url' => env('RAG_BACKEND_URL', 'http://localhost:8001/chat'),
    ],

];
