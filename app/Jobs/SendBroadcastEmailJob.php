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
        Mail::to($this->email)->send(
            new BroadcastNotificationMail($this->subjectLine, $this->messageBody, $this->studentName)
        );
    }
}
