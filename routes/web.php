<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::redirect('/', '/chat')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

use App\Http\Controllers\ChatController;
use App\Http\Controllers\Admin\ChatRuleController;
use App\Http\Controllers\Admin\DashboardController;

// Rute Chatbot publik
Route::inertia('/chat', 'chat/ChatWindow')->name('chat');
Route::post('/chat', [ChatController::class, 'store'])->name('chat.store');
Route::patch('/chat/{chatLog}/feedback', [ChatController::class, 'storeFeedback'])->name('chat.feedback');

use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\SessionReviewController;
Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');
Route::post('/session-reviews', [SessionReviewController::class, 'store'])->name('session-reviews.store');

// Rute khusus Panel Admin (Analytics & CRUD)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/export-csv', [DashboardController::class, 'exportCsv'])->name('export-csv');
    Route::delete('/chat-logs/clear', [DashboardController::class, 'destroyAll'])->name('chat-logs.destroy-all');
    Route::delete('/chat-logs/{chatLog}', [DashboardController::class, 'destroy'])->name('chat-logs.destroy');
    Route::delete('/tickets/clear', [DashboardController::class, 'destroyAllTickets'])->name('tickets.destroy-all');
    Route::delete('/tickets/{feedback}', [DashboardController::class, 'destroyTicket'])->name('tickets.destroy');
    Route::delete('/session-reviews/clear', [SessionReviewController::class, 'destroyAll'])->name('session-reviews.destroy-all');
    Route::delete('/session-reviews/{sessionReview}', [SessionReviewController::class, 'destroy'])->name('session-reviews.destroy');
    Route::resource('chat-rules', ChatRuleController::class)->except(['show']);
    Route::get('/upload-document', [App\Http\Controllers\Admin\DocumentController::class, 'index'])->name('upload-document.index');
    Route::get('/upload-document/download/{filename}', [App\Http\Controllers\Admin\DocumentController::class, 'download'])->name('upload-document.download');
    Route::delete('/upload-document/{filename}', [App\Http\Controllers\Admin\DocumentController::class, 'destroy'])->name('upload-document.destroy');
    Route::get('/system-logs', [App\Http\Controllers\Admin\SystemLogController::class, 'index'])->name('system-logs.index');
    Route::delete('/system-logs/clear', [App\Http\Controllers\Admin\SystemLogController::class, 'clear'])->name('system-logs.clear');
});

require __DIR__.'/settings.php';

