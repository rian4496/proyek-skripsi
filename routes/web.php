<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::redirect('/', '/chat')->name('home');

Route::get('/cleanup-spam', function () {
    $validNames = ['sendi', 'ahmad yasser', 'm. rian gunadi', 'm rian gunadi'];
    
    $deletedCount = \App\Models\PesertaUjiCoba::whereNotIn(\Illuminate\Support\Facades\DB::raw('LOWER(nama_mahasiswa)'), $validNames)
        ->where('npm', 'not like', '22%')
        ->delete();
        
    return "Berhasil menghapus {$deletedCount} data spam/bot dengan Cepat! Silakan periksa dasbor Admin dan hapus rute ini setelah selesai.";
});

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
use App\Http\Controllers\Admin\ParticipantController;
Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');
Route::post('/session-reviews', [SessionReviewController::class, 'store'])->name('session-reviews.store');
Route::post('/participants', [ParticipantController::class, 'store'])->name('participants.store');

// Rute khusus Panel Admin (Analytics & CRUD)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/export-csv', [DashboardController::class, 'exportCsv'])->name('export-csv');
    Route::get('/chat-logs/print', [DashboardController::class, 'printChatLogs'])->name('chat-logs.print');
    Route::delete('/chat-logs/clear', [DashboardController::class, 'destroyAll'])->name('chat-logs.destroy-all');
    Route::delete('/chat-logs/{chatLog}', [DashboardController::class, 'destroy'])->name('chat-logs.destroy');
    Route::get('/tickets/export-csv', [DashboardController::class, 'exportTicketsCsv'])->name('tickets.export-csv');
    Route::get('/tickets/print', [DashboardController::class, 'printTickets'])->name('tickets.print');
    Route::delete('/tickets/clear', [DashboardController::class, 'destroyAllTickets'])->name('tickets.destroy-all');
    Route::delete('/tickets/{feedback}', [DashboardController::class, 'destroyTicket'])->name('tickets.destroy');
    Route::get('/session-reviews/export-csv', [DashboardController::class, 'exportSessionReviewsCsv'])->name('session-reviews.export-csv');
    Route::get('/session-reviews/print', [DashboardController::class, 'printSessionReviews'])->name('session-reviews.print');
    Route::delete('/session-reviews/clear', [SessionReviewController::class, 'destroyAll'])->name('session-reviews.destroy-all');
    Route::delete('/session-reviews/{sessionReview}', [SessionReviewController::class, 'destroy'])->name('session-reviews.destroy');
    Route::resource('chat-rules', ChatRuleController::class)->except(['show']);
    Route::get('/upload-document', [App\Http\Controllers\Admin\DocumentController::class, 'index'])->name('upload-document.index');
    Route::get('/upload-document/download/{filename}', [App\Http\Controllers\Admin\DocumentController::class, 'download'])->name('upload-document.download');
    Route::delete('/upload-document/{filename}', [App\Http\Controllers\Admin\DocumentController::class, 'destroy'])->name('upload-document.destroy');
    Route::get('/system-logs', [App\Http\Controllers\Admin\SystemLogController::class, 'index'])->name('system-logs.index');
    Route::delete('/system-logs/clear', [App\Http\Controllers\Admin\SystemLogController::class, 'clear'])->name('system-logs.clear');
    Route::get('/participants', [ParticipantController::class, 'index'])->name('participants.index');
    Route::get('/participants/export-csv', [ParticipantController::class, 'exportCsv'])->name('participants.export-csv');
    Route::get('/participants/print', [ParticipantController::class, 'printParticipants'])->name('participants.print');
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy'])->name('participants.destroy');
});

require __DIR__.'/settings.php';

