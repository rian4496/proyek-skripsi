<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $service = app(\App\Services\ChatbotService::class);
    $result = $service->findResponse("apakah saya bisa daftar sidang skripsi", 1, [
        'nama_mahasiswa' => 'Test User',
        'npm' => '2210010000',
        'fakultas' => 'FTI',
        'prodi' => 'TI'
    ]);
    echo "SUCCESS: \n";
    print_r($result);
    
    echo "COUNT CHAT: " . \App\Models\ChatLog::count() . "\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
