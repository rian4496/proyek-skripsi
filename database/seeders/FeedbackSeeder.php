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
                'nama_pelapor' => 'Ahmad Faisal',
                'npm' => '2210010045',
                'kategori_masalah' => 'Sistem Error / Lemot',
                'laporan' => 'Sistem chatbot sempat tidak membalas selama beberapa detik saat saya menanyakan tentang jadwal KRS. Mungkin karena koneksi server sedang penuh?',
                'tanggal' => Carbon::now()->subDays(2)->toDateString(),
                'status' => 'resolved',
                'sentiment' => 'negative',
                'sentiment_score' => 0.25,
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'nama_pelapor' => 'Siti Aminah',
                'npm' => '2210010112',
                'kategori_masalah' => 'Jawaban Kurang Tepat / AI Halusinasi',
                'laporan' => 'Saya tanya syarat pendaftaran sidang komprehensif, tapi jawaban botnya cuma menyebutkan syarat pendaftaran proposal. Tolong diperbaiki agar lebih spesifik.',
                'tanggal' => Carbon::now()->subDays(1)->toDateString(),
                'status' => 'pending',
                'sentiment' => 'negative',
                'sentiment_score' => 0.15,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'nama_pelapor' => 'Rizky Ramadhan',
                'npm' => '2210010334',
                'kategori_masalah' => 'Saran & Masukan Lainnya',
                'laporan' => 'Chatbotnya sudah sangat bagus dan informasinya akurat. Sangat membantu saya yang sedang skripsian untuk mengecek SOP Yudisium tanpa harus datang ke BAAK. Mantap!',
                'tanggal' => Carbon::now()->toDateString(),
                'status' => 'pending',
                'sentiment' => 'positive',
                'sentiment_score' => 0.95,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_pelapor' => 'Nurul Hidayati',
                'npm' => '2210010488',
                'kategori_masalah' => 'Sistem Error / Lemot',
                'laporan' => 'Tadi siang saya mau upload dokumen buat RAG tapi halamannya agak lama loadingnya. Apa file PDF-nya terlalu besar ya?',
                'tanggal' => Carbon::now()->subDays(3)->toDateString(),
                'status' => 'resolved',
                'sentiment' => 'negative',
                'sentiment_score' => 0.30,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'nama_pelapor' => 'Budi Santoso',
                'npm' => '2210010991',
                'kategori_masalah' => 'Tampilan / Fitur UI Bermasalah',
                'laporan' => 'Di layar HP (mobile), bubble chat balasannya kalau terlalu panjang teksnya agak kepotong di sisi kanan. Mungkin UI responsifnya bisa diatur lagi.',
                'tanggal' => Carbon::now()->toDateString(),
                'status' => 'pending',
                'sentiment' => 'neutral',
                'sentiment_score' => 0.55,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_pelapor' => 'Dwi Lestari',
                'npm' => '2210010874',
                'kategori_masalah' => 'Jawaban Kurang Tepat / AI Halusinasi',
                'laporan' => 'Bot tidak mengerti kalau saya menyingkat \'jadwal kuliah\' jadi \'jdwl klh\', malah dibilang tidak ada di dokumen. Padahal kan sudah ada fitur anti typo.',
                'tanggal' => Carbon::now()->subDays(4)->toDateString(),
                'status' => 'resolved',
                'sentiment' => 'negative',
                'sentiment_score' => 0.20,
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'nama_pelapor' => 'Hendri Irawan',
                'npm' => '-',
                'kategori_masalah' => 'Saran & Masukan Lainnya',
                'laporan' => 'Informasi tentang besaran UKT sudah valid dan sesuai dengan pedoman kampus. Respon AI Fallback sangat cepat meskipun pertanyaannya dibolak-balik.',
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
