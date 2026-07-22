<?php

namespace App\Jobs;

use App\Mail\BroadcastNotificationMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBroadcastEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $email;
    public $studentName;
    public $subjectLine;
    public $messageBody;

    /**
     * Create a new job instance.
     */
    public function __construct($email, $studentName, $subjectLine, $messageBody)
    {
        $this->email = $email;
        $this->studentName = $studentName;
        $this->subjectLine = $subjectLine;
        $this->messageBody = $messageBody;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Cetak versi bersih ke log agar mudah dibaca oleh manusia di System Logs
        \Illuminate\Support\Facades\Log::info("==================================================");
        \Illuminate\Support\Facades\Log::info("📧 [SIMULASI EMAIL TERKIRIM] - " . date('Y-m-d H:i:s'));
        \Illuminate\Support\Facades\Log::info("Kepada : {$this->studentName} ({$this->email})");
        \Illuminate\Support\Facades\Log::info("Subjek : {$this->subjectLine}");
        \Illuminate\Support\Facades\Log::info("Pesan  : \n{$this->messageBody}");
        \Illuminate\Support\Facades\Log::info("==================================================");

        // Jika sistem sedang dalam mode simulasi (log), kita blokir pengiriman email bawaan Laravel
        // agar layar System Logs tidak dibanjiri kode HTML kotor. Teks bersih di atas sudah cukup!
        if (config('mail.default') === 'log') {
            return;
        }

        $mailable = new BroadcastNotificationMail($this->subjectLine, $this->messageBody, $this->studentName);

        // [BYPASS HACK] Jika variabel GOOGLE_SCRIPT_WEBHOOK_URL tersedia, kirim via HTTP (Port 443)
        // Ini menghindari blokir Port SMTP 587/465 dari layanan cloud seperti Railway
        $webhookUrl = env('GOOGLE_SCRIPT_WEBHOOK_URL');
        
        if (!empty($webhookUrl)) {
            \Illuminate\Support\Facades\Log::info("🚀 Mengirim via Google Apps Script Webhook...");
            
            $html = $mailable->render();
            
            $response = \Illuminate\Support\Facades\Http::post($webhookUrl, [
                'to' => $this->email,
                'subject' => $this->subjectLine,
                'body' => $html
            ]);

            if ($response->successful()) {
                \Illuminate\Support\Facades\Log::info("✅ Webhook Berhasil: " . $response->body());
            } else {
                \Illuminate\Support\Facades\Log::error("❌ Webhook Gagal: " . $response->body());
                throw new \Exception("Google Apps Script Webhook gagal: " . $response->body());
            }
            
            return;
        }

        // Jika tidak ada webhook, gunakan jalur SMTP standar
        Mail::to($this->email)->send($mailable);
    }
}
