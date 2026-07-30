<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $feedbacks = [
            [
                'nama_pelapor' => 'Muhammad Luthfianur Arifin',
                'npm' => '2210010213',
                'kategori_masalah' => 'Sistem Error / Lemot',
                'laporan' => 'Sistem chatbot sempat lambat membalas saat saya menanyakan jadwal KRS. Mungkin koneksinya sedang penuh?',
                'tanggal' => Carbon::now()->subDays(2)->toDateString(),
                'status' => 'selesai',
                'sentiment' => 'negative',
                'sentiment_score' => 0.25,
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'nama_pelapor' => 'Muhammad Riswan Badali',
                'npm' => '2210010039',
                'kategori_masalah' => 'Jawaban Kurang Tepat / AI Halusinasi',
                'laporan' => 'Saya tanya syarat yudisium, tapi jawabannya kurang lengkap dan disuruh cek web terus. Tolong database SOP nya diupdate.',
                'tanggal' => Carbon::now()->subDays(1)->toDateString(),
                'status' => 'pending',
                'sentiment' => 'negative',
                'sentiment_score' => 0.15,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'nama_pelapor' => 'M. Rian Gunadi',
                'npm' => '2210010497',
                'kategori_masalah' => 'Saran & Masukan Lainnya',
                'laporan' => 'Chatbotnya sudah sangat bagus dan informasinya akurat. Sangat membantu mahasiswa untuk mengecek pedoman akademik.',
                'tanggal' => Carbon::now()->toDateString(),
                'status' => 'pending',
                'sentiment' => 'positive',
                'sentiment_score' => 0.95,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_pelapor' => 'Naila khairyah',
                'npm' => '2210010356',
                'kategori_masalah' => 'Sistem Error / Lemot',
                'laporan' => 'Tadi malam botnya tidak merespon sama sekali saat saya ketik help.',
                'tanggal' => Carbon::now()->subDays(3)->toDateString(),
                'status' => 'selesai',
                'sentiment' => 'negative',
                'sentiment_score' => 0.30,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'nama_pelapor' => 'Winda Dwi Ningsih',
                'npm' => '2210010530',
                'kategori_masalah' => 'Tampilan / Fitur UI Bermasalah',
                'laporan' => 'Di HP tampilan tombol feedback kadang tertutup keyboard saat scroll. Mohon disesuaikan margin bawahnya.',
                'tanggal' => Carbon::now()->toDateString(),
                'status' => 'pending',
                'sentiment' => 'neutral',
                'sentiment_score' => 0.55,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_pelapor' => 'Muhammad Syafiq Yusuf',
                'npm' => '2210010514',
                'kategori_masalah' => 'Jawaban Kurang Tepat / AI Halusinasi',
                'laporan' => 'Bot tidak mengerti singkatan seperti \'jdwl uas\', padahal maksudnya jadwal uas. Harus diketik lengkap baru botnya paham.',
                'tanggal' => Carbon::now()->subDays(4)->toDateString(),
                'status' => 'selesai',
                'sentiment' => 'negative',
                'sentiment_score' => 0.20,
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'nama_pelapor' => 'DELARISKA.A',
                'npm' => '-',
                'kategori_masalah' => 'Saran & Masukan Lainnya',
                'laporan' => 'Sistem AI Fallback sangat cepat membalas pertanyaan yang rumit. Sangat memuaskan!',
                'tanggal' => Carbon::now()->toDateString(),
                'status' => 'pending',
                'sentiment' => 'positive',
                'sentiment_score' => 0.88,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('feedback')->insert($feedbacks);
    }
}
