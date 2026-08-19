<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $log = \App\Models\ChatLog::create([
        'user_message' => 'test',
        'bot_response' => 'test',
        'source' => 'rule'
    ]);
    echo "SUCCESS: Log ID " . $log->id . "\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
