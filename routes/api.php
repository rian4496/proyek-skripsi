<?php

use App\Http\Controllers\ChatbotController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rute API untuk chatbot. Semua rute di file ini otomatis
| mendapat prefix `/api` dari RouteServiceProvider.
|
*/

Route::post('/chatbot/send', [ChatbotController::class, 'sendMessage'])
    ->name('api.chatbot.send');
