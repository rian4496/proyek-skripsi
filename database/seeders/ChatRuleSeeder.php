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
                'keywords' => ['jadwal kuliah', 'link jadwal kuliah resmi', 'url jadwal kuliah uniska', 'di mana web jadwal kuliah'],
                'response' => 'Jadwal perkuliahan mahasiswa UNISKA MAB dapat dilihat dan diunduh melalui portal resmi SIA UNISKA (https://sia.uniska-bjm.ac.id) pada menu "Jadwal Kuliah". Pastikan Anda telah menyelesaikan pembayaran SPP/UKT variabel dan pengisian KRS sebelum melihat jadwal kelas.',
                'category' => 'akademik',
                'priority' => 10,
            ],
            [
                'keywords' => ['cara isi krs', 'link sia uniska', 'alamat web sia', 'website sia', 'pengisian krs online'],
                'response' => "Pengisian Kartu Rencana Studi (KRS) dilakukan secara online melalui portal SIA UNISKA di https://sia.uniska-bjm.ac.id.\n\n**Langkah Pengisian KRS:**\n1. Login menggunakan NPM dan Password SIA.\n2. Pilih menu \"Akademik\" > \"Pengisian KRS\".\n3. Pilih mata kuliah sesuai penawaran semester atau konsultasikan dengan Dosen Penasihat Akademik (PA).\n4. Simpan KRS dan tunggu verifikasi/persetujuan Dosen PA.",
                'category' => 'akademik',
                'priority' => 10,
            ],
            [
                'keywords' => ['info beasiswa', 'beasiswa uniska', 'daftar beasiswa', 'beasiswa kip'],
                'response' => 'UNISKA MAB menyediakan berbagai program beasiswa bagi mahasiswa, seperti Beasiswa KIP-Kuliah, Beasiswa PPA, Beasiswa Baznas, dan Beasiswa Yayasan. Untuk informasi persyaratan dan jadwal pendaftaran terbaru, silakan cek portal resmi atau hubungi Bagian Kemahasiswaan & Alumni (BAK).',
                'category' => 'akademik',
                'priority' => 10,
            ],
            [
                'keywords' => ['biaya ukt', 'nomor rekening spp', 'cara bayar ukt lewat bank', 'pembayaran ukt bank apa', 'info ukt'],
                'response' => 'Informasi rincian nominal Biaya Uang Kuliah Tunggal (UKT) / SPP variabel dapat dilihat secara transparan melalui akun SIA masing-masing mahasiswa pada menu "Tagihan & Pembayaran". Pembayaran dilakukan melalui bank mitra resmi UNISKA (BSI, Bank Kalsel, Mandiri, BRI). Jika ada kendala, silakan hubungi bagian keuangan kampus.',
                'category' => 'administrasi',
                'priority' => 9,
            ],
            [
                'keywords' => ['info skripsi', 'persyaratan skripsi', 'syarat daftar skripsi', 'pendaftaran skripsi'],
                'response' => "Persyaratan umum pendaftaran Skripsi di lingkungan UNISKA MAB:\n\n1. Telah menempuh minimal 138 SKS dengan IPK minimal 2.75.\n2. Lulus mata kuliah Metodologi Penelitian dan Seminar Proposal.\n3. Bebas nilai D dan E pada mata kuliah pokok prodi.\n4. Mendaftar secara online melalui portal fakultas masing-masing dengan mengunggah persetujuan Dosen Pembimbing.",
                'category' => 'akademik',
                'priority' => 10,
            ],
            [
                'keywords' => ['perpustakaan', 'jam buka perpustakaan', 'jadwal operasional perpus', 'perpus uniska'],
                'response' => 'Perpustakaan Pusat UNISKA MAB berlokasi di Kampus Adhyaksa dan buka setiap Senin–Jumat pukul 08.00–16.00 WITA serta Sabtu pukul 08.00–13.00 WITA. Untuk peminjaman buku fisik maupun akses e-library / skripsi digital, mahasiswa wajib membawa Kartu Tanda Mahasiswa (KTM) yang terdaftar sebagai anggota.',
                'category' => 'umum',
                'priority' => 8,
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