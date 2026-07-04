<?php

namespace Database\Seeders;

use App\Models\ChatRule;
use Illuminate\Database\Seeder;

/**
 * Seeder yang sudah dioptimasi agar tidak bertabrakan dengan dokumen RAG (Kermawa, SOP BAK, Aturan 2021).
 */
class ChatRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate tabel agar tidak duplikat saat dijalankan ulang
        ChatRule::truncate();

        $rules = [
            [
                // Mengubah keyword tunggal 'kuliah' menjadi lebih spesifik ke pencarian tautan/cara cek jadwal
                'keywords' => ['link jadwal kuliah', 'cara lihat jadwal kuliah', 'dimana lihat jadwal'],
                'response' => 'Jadwal kuliah dapat dilihat melalui portal akademik (SIA UNISKA) di menu "Jadwal Kuliah". Jadwal biasanya dipublikasikan 1 minggu sebelum perkuliahan dimulai. Untuk informasi lebih lanjut, silakan hubungi bagian akademik.',
                'category' => 'akademik',
                'priority' => 10,
            ],
            [
                // Diperketat agar tidak bertabrakan dengan SOP KRS yang ada di dokumen RAG
                'keywords' => ['link sia uniska', 'alamat web sia', 'website sia'],
                'response' => 'Pengisian KRS dilakukan secara online melalui portal SIA UNISKA di https://sia.uniska-bjm.ac.id sesuai jadwal kalender akademik. Pastikan Anda sudah melunasi SPP variabel.',
                'category' => 'akademik',
                'priority' => 10,
            ],
            [
                'keywords' => ['link kalender akademik', 'tautan kalender akademik', 'url kalender akademik'],
                'response' => 'Untuk informasi kalender akademik dapat dilihat di https://uniska-bjm.ac.id/?p=8599',
                'category' => 'akademik',
                'priority' => 8,
            ],
            [
                'keywords' => ['jam kerja bak', 'jam buka bak', 'operasional bak', 'bak buka jam berapa'],
                'response' => 'Bagian Administrasi Akademik (BAK) buka setiap Senin–Sabtu pukul 09:00–14:00 WITA.',
                'category' => 'administrasi',
                'priority' => 8,
            ],
            [
                // Diperketat agar pertanyaan tentang nominal atau aturan keuangan rumit dilempar ke RAG/BAK
                'keywords' => ['nomor rekening spp', 'cara bayar ukt lewat bank', 'pembayaran ukt bank apa'],
                'response' => 'Informasi UKT (Uang Kuliah Tunggal) dan pembayaran dapat dilihat di portal mahasiswa. Pembayaran dilakukan melalui bank yang telah ditunjuk. Jika ada kendala pembayaran, silakan hubungi bagian keuangan kampus.',
                'category' => 'administrasi',
                'priority' => 9,
            ],
            [
                // KELOMPOK BEASISWA, CUTI, YUDISIUM, & ATURAN UAS DIHAPUS TOTAL DARI SEEDER INI
                // AGAR KALIMAT PERTANYAAN PANJANG MAHASISWA OTOMATIS LOLOS LANGSUNG KE N8N (LAMA/QWEN)
                'keywords' => ['jam buka perpustakaan', 'jadwal operasional perpus'],
                'response' => 'Perpustakaan kampus buka setiap Senin–Jumat pukul 08.00–16.00. Untuk meminjam buku, Anda memerlukan kartu anggota perpustakaan. Pendaftaran anggota dapat dilakukan langsung di perpustakaan dengan membawa KTM.',
                'category' => 'umum',
                'priority' => 5,
            ],
            [
                'keywords' => ['halo', 'hai', 'hi', 'hello', 'assalamualaikum', 'selamat pagi', 'selamat siang'],
                'response' => 'Halo! 👋 Selamat datang di Chatbot Kampus. Saya siap membantu menjawab pertanyaan seputar akademik, administrasi, dan informasi umum kampus. Silakan ketik pertanyaan Anda!',
                'category' => 'umum',
                'priority' => 1,
            ],
            [
                'keywords' => ['terima kasih', 'makasih', 'thanks', 'thank you'],
                'response' => 'Sama-sama! 😊 Jika ada pertanyaan lain, jangan ragu untuk bertanya kembali. Semoga informasinya bermanfaat!',
                'category' => 'umum',
                'priority' => 1,
            ],
        ];

        foreach ($rules as $rule) {

            ChatRule::create($rule);
        }
    }
}