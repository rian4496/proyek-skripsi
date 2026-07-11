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
                'keywords' => ['cara isi krs', 'link sia uniska', 'alamat web sia', 'website sia', 'pengisian krs online', 'alur pengisian krs', 'bagaimana alur pengisian krs', 'tahapan pengisian krs', 'prosedur pengisian krs', 'alur krs', 'jadwal pengisian krs', 'pengisian krs', 'jadwal krs'],
                'response' => "Pengisian Kartu Rencana Studi (KRS) dilakukan secara online melalui portal SIA UNISKA di https://sia.uniska-bjm.ac.id.\n\n**Alur & Langkah Pengisian KRS:**\n1. Login menggunakan NPM dan Password SIA.\n2. Pilih menu \"Akademik\" > \"Pengisian KRS\".\n3. Pilih mata kuliah sesuai penawaran semester atau konsultasikan terlebih dahulu dengan Dosen Penasihat Akademik (PA).\n4. Simpan KRS dan tunggu verifikasi/persetujuan Dosen PA.\n\n![Panduan Alur Pengisian KRS Online](/assets/img/sia/urutan-4.jpeg)\n\n*Catatan: Pastikan kewajiban pembayaran SPP/UKT variabel semester aktif telah diselesaikan agar menu pengisian KRS dapat diakses.*",
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
                'keywords' => ['syarat yudisium', 'daftar yudisium', 'alur yudisium', 'info yudisium', 'persyaratan yudisium', 'kapan yudisium'],
                'response' => "Pendaftaran dan pelaksanaan Yudisium UNISKA MAB dilakukan sesuai dengan Standar Operasional Prosedur (SOP) fakultas masing-masing.\n\n**Syarat & Alur Umum Yudisium:**\n1. Telah dinyatakan lulus ujian skripsi (sidang komprehensif).\n2. Mengumpulkan lembar pengesahan skripsi yang sudah ditandatangani lengkap (Pembimbing, Penguji, dan Dekan).\n3. Mengupload naskah skripsi final dan jurnal ke repository perpustakaan.\n4. Melakukan pendaftaran online dan verifikasi berkas di loket BAK / Fakultas.\n\n![Panduan SOP & Alur Yudisium UNISKA MAB](/assets/img/yudisium/sop-a.jpeg)",
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
                'keywords' => ['link kalender akademik', 'tautan kalender akademik', 'url kalender akademik', 'kalender akademik', 'jadwal kalender akademik'],
                'response' => "Kalender Akademik UNISKA MAB Tahun Ajaran 2025/2026 mencakup jadwal perkuliahan, pembayaran UKT, pengisian KRS, ujian (UTS/UAS), dan yudisium/wisuda. Informasi lengkap dapat dilihat pada tautan resmi: https://uniska-bjm.ac.id/?p=8599\n\n![Kalender Akademik UNISKA MAB 2025/2026](/assets/img/kalender/kalender_akademik_2025_2026.jpeg)",
                'category' => 'akademik',
                'priority' => 10,
            ],
            [
                'keywords' => ['rektor uniska', 'siapa rektor uniska', 'siapa rektor uniska saat ini', 'pimpinan uniska', 'wakil rektor uniska', 'siapa rektor'],
                'response' => "Rektor Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (UNISKA MAB) saat ini adalah **Prof. Dr. H. Mohammad Zainul, S.E., M.M.** Ia menjabat untuk periode masa bakti 2025–2030.\n\nInformasi lebih lanjut mengenai pimpinan dan jajaran universitas dapat dilihat di laman resmi UNISKA MAB (https://uniska-bjm.ac.id).\n\n**PIMPINAN UNISKA MAB:**\n• **REKTOR:** Prof. Dr. H. Mohammad Zainul, S.E., M.M.\n• **WAKIL REKTOR 1 (WR 1):** Prof. Dr. Ir. Aam Gunawan, M.P., IPU.",
                'category' => 'umum',
                'priority' => 10,
            ],
            [
                'keywords' => ['dimana letak gedung kampus uniska mab', 'alamat kampus uniska', 'lokasi kampus uniska', 'gedung kampus uniska', 'dimana kampus uniska', 'lokasi uniska', 'alamat uniska', 'letak kampus uniska', 'dimana letak kampus uniska', 'kampus uniska dimana'],
                'response' => "Kampus Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (UNISKA MAB) tersebar di beberapa lokasi utama untuk melayani kegiatan perkuliahan dan administrasi:\n\n1. **Kampus Banjarmasin (Pusat/Utama - Adhyaksa):**\n   Jl. Adhyaksa No. 2, Kayu Tangi, Banjarmasin Utara, Kota Banjarmasin (berada persis di depan kantor LLDIKTI Wilayah XI Kalimantan).\n\n2. **Kampus Handil Bakti (Barito Kuala):**\n   Kawasan Handil Bakti, Kec. Alalak, Kabupaten Barito Kuala (termasuk Gedung Rektorat baru dan fasilitas fakultas terpadu).\n\n3. **Kampus Banjarbaru:**\n   Jl. Salak No. 44, Guntung Paikat, Kec. Banjarbaru Selatan, Kota Banjarbaru.\n\n4. **Kampus Gambut (Cabang/Tambahan):**\n   Area Terminal Tipe A Gambut Barakat, Jl. Ahmad Yani KM 17, Gambut, Kabupaten Banjar.\n\nUntuk informasi lebih detail mengenai pembagian program studi yang tersedia di masing-masing lokasi kampus, Anda dapat mengakses situs resmi UNISKA MAB di https://uniska-bjm.ac.id.",
                'category' => 'umum',
                'priority' => 10,
            ],
            [
                'keywords' => ['dimana ruang bak', 'dimana ruangan bak', 'ruang bak dimana', 'ruangan bak dimana', 'letak ruang bak', 'lokasi ruangan bak', 'gedung rektor uniska', 'gedung rektorat uniska', 'lokasi gedung rektorat', 'dimana gedung rektor uniska', 'pembagian lantai gedung rektorat', 'lantai gedung rektorat uniska', 'ruang bak di gedung apa'],
                'response' => "Ruang Bagian Administrasi Akademik (BAK / BAAP) berada di **Lantai 1 Gedung Rektorat Baru UNISKA MAB** yang berlokasi di **Kampus III Handil Bakti** (Jl. Trans Kalimantan, Komplek Perumahan Agrabudi, Berangas Timur, Kec. Alalak, Kab. Barito Kuala).\n\nBerikut adalah informasi lengkap pembagian pelayanan dan fasilitas di setiap lantai **Gedung Rektorat Baru UNISKA MAB (4 Lantai)**:\n\n• **Lantai 1 (Pusat Layanan Umum & Operasional):**\n  Biro Administrasi Akademik & Perencanaan (BAAP / BAK), Biro Keuangan & Kepegawaian (Loket Keuangan), Biro Kemahasiswaan & Alumni, Biro Humas, Biro Kerja Sama Internasional, Biro Keislaman, Loket KTM, Laboratorium Komputer, serta Ruang Guru Besar.\n\n• **Lantai 2 (Pusat Manajemen & Pimpinan):**\n  Kantor Rektor dan Wakil Rektor, Ruang Pimpinan Yayasan, Lembaga Penjaminan Mutu (LPM), Lembaga Penelitian & Pengabdian Kepada Masyarakat (LPPM), UPT TIK, serta UPT Publikasi & Pengelolaan Jurnal.\n\n• **Lantai 3 (Kegiatan Akademik & Fakultas):**\n  Ruang perkuliahan untuk Program Pascasarjana, Fakultas Pertanian (FAPERTA), dan Fakultas Kesehatan Masyarakat (FKM).\n\n• **Lantai 4 (Auditorium Utama):**\n  Aula/Auditorium besar modern berkapasitas sekitar 1.500 orang untuk agenda besar universitas seperti Wisuda dan PKKMB.\n\n**Jam Operasional BAK:** Senin–Sabtu pukul 09:00–14:00 WITA.",
                'category' => 'administrasi',
                'priority' => 10,
            ],
            [
                'keywords' => ['jam kerja bak', 'jam buka bak', 'operasional bak', 'bak buka jam berapa', 'jadwal pelayanan bak', 'jadwal pengambilan ijazah', 'jam istirahat bak', 'apakah saya bisa datang ke bak', 'datang ke bak di jam', 'bisa ke bak jam', 'ambil ijazah jam berapa', 'kapan bisa ambil ijazah', 'jam pelayanan bak', 'ke bak di jam 13.00', 'datang ke bak jam 13.00', 'ke bak jam 13', 'datang ke bak jam 1', 'ke bak jam 1 siang', 'jam 1 ke bak', 'jam 13 ke bak', 'istirahat jam berapa bak'],
                'response' => "**Jadwal Pelayanan Biro Administrasi Akademik (BAK) & Pengambilan Ijazah UNISKA MAB:**\n\n• **Senin – Kamis:** 09.00 – 14.00 WITA\n• **Jum'at:** 09.00 – 11.30 WITA\n• **Sabtu:** 09.00 – 13.00 WITA\n\n⏸️ **Jam Istirahat:** 12.00 – 13.00 WITA *(pelayanan ditutup sementara)*\n🚫 **Tanggal merah dan hari besar nasional LIBUR.**\n\n💡 **Catatan Khusus Kedatangan Pukul 13.00 (Jam 1 Siang):**\n- **Senin – Kamis:** Bisa dilayani setelah jam istirahat selesai pukul 13.00 hingga tutup pukul 14.00 WITA.\n- **Jum'at & Sabtu:** **TIDAK BISA / TUTUP** (Jumat tutup pukul 11.30 WITA, dan Sabtu tutup pukul 13.00 WITA).\n\n📍 **Lokasi:** Lantai 1 Gedung Rektorat Baru UNISKA MAB (Kampus III Handil Bakti).\n📱 **Instagram Resmi BAK:** @bak_uniskabjm.id",
                'category' => 'administrasi',
                'priority' => 10,
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