<?php

namespace Database\Seeders;

use App\Models\ChatLog;
use App\Models\PesertaUjiCoba;
use App\Models\SessionReview;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * TestParticipantSeeder — Seed 20 peserta uji coba beserta simulasi interaksi chatbot.
 *
 * Catatan: Data ini dihasilkan untuk keperluan pengujian sistem dan demo presentasi.
 * Pertanyaan disusun berdasarkan konteks layanan akademik UNISKA MAB yang realistis.
 */
class TestParticipantSeeder extends Seeder
{
    public function run(): void
    {
        // ═══ Data 20 Peserta (tanpa Rafly Aulia Akbar) ═══
        $participants = [
            ['nama' => 'Muhammad Syafiq Yusuf',         'npm' => '2210010514'],
            ['nama' => 'Muhammad Najmy Wardhana',        'npm' => '2210010212'],
            ['nama' => 'Muhammad Abdul Jabbar',          'npm' => '2210010343'],
            ['nama' => 'Muhammad Hamid Hasan',           'npm' => '2210010373'],
            ['nama' => 'Muhammad Junaidi',               'npm' => '2210010097'],
            ['nama' => 'Muhammad Husnu Elwafa',          'npm' => '2210010318'],
            ['nama' => 'Ahmad Gilang Zily Waningpati',   'npm' => '2210010328'],
            ['nama' => 'Muhammad Luthfianur Arifin',     'npm' => '2210010213'],
            ['nama' => 'Muhammad Riswan Badali',         'npm' => '2210010039'],
            ['nama' => 'Muhammad Ridho',                 'npm' => '2210010618'],
            ['nama' => 'Muhammad Adam Alghifari',        'npm' => '2210010314'],
            ['nama' => 'Rendy widiansyah',               'npm' => '2210010549'],
            ['nama' => 'Ivan Avandi',                    'npm' => '2210010602'],
            ['nama' => 'Sendi Pratama',                  'npm' => '2210010529'],
            ['nama' => 'DELARISKA.A',                    'npm' => '2210010352'],
            ['nama' => 'Winda Dwi Ningsih',              'npm' => '2210010530'],
            ['nama' => 'Naila khairyah',                 'npm' => '2210010356'],
            ['nama' => 'Rahmad',                         'npm' => '2210010446'],
            ['nama' => 'Ahmad Syairozi',                 'npm' => '2210010066'],
            ['nama' => 'M. Rian Gunadi',                 'npm' => '2210010497'],
        ];

        // ═══ Bank Pertanyaan Realistis Mahasiswa UNISKA ═══
        $questionBank = [
            // Kalender Akademik & Jadwal
            [
                'q' => 'kapan jadwal uas semester genap 2025/2026?',
                'a' => 'Jadwal UAS Semester Genap 2025/2026 dilaksanakan pada tanggal yang tertera di Kalender Akademik resmi UNISKA MAB. Silakan cek pengumuman BAAK untuk jadwal lengkapnya.',
                'source' => 'rule', 'score' => 0.87, 'latency' => 145,
            ],
            [
                'q' => 'jam kerja baak uniska',
                'a' => 'BAAK UNISKA MAB buka setiap hari Senin-Jumat pukul 08.00-15.00 WITA, dan hari Sabtu pukul 08.00-12.00 WITA.',
                'source' => 'rule', 'score' => 0.92, 'latency' => 98,
            ],
            [
                'q' => 'kapan libur semester genap?',
                'a' => 'Libur semester genap biasanya dimulai setelah pelaksanaan UAS selesai. Jadwal resmi dapat dilihat di Kalender Akademik UNISKA MAB tahun ajaran berjalan.',
                'source' => 'rule', 'score' => 0.84, 'latency' => 112,
            ],
            [
                'q' => 'jadwal kuliah semester ganjil kapan mulai?',
                'a' => 'Perkuliahan semester ganjil biasanya dimulai pada bulan September. Silakan pantau pengumuman resmi BAAK UNISKA MAB untuk tanggal pastinya.',
                'source' => 'rule', 'score' => 0.79, 'latency' => 130,
            ],
            [
                'q' => 'tanggal pelayanan akademik baak',
                'a' => 'Pelayanan akademik di BAAK UNISKA MAB tersedia pada hari kerja Senin-Jumat pukul 08.00-15.00 WITA dan Sabtu 08.00-12.00 WITA.',
                'source' => 'rule', 'score' => 0.91, 'latency' => 105,
            ],

            // KRS, UKT & Administrasi
            [
                'q' => 'bagaimana cara mengisi krs online?',
                'a' => 'Pengisian KRS Online dilakukan melalui portal SIAKAD UNISKA MAB. Login menggunakan NPM dan password, pilih menu KRS, lalu pilih mata kuliah yang tersedia sesuai kurikulum.',
                'source' => 'rule', 'score' => 0.88, 'latency' => 120,
            ],
            [
                'q' => 'berapa ukt untuk mahasiswa teknik informatika?',
                'a' => 'Informasi detail mengenai besaran UKT untuk setiap program studi, termasuk Teknik Informatika, dapat dilihat di website resmi UNISKA MAB atau menghubungi bagian keuangan kampus.',
                'source' => 'ai', 'score' => null, 'latency' => 1850,
            ],
            [
                'q' => 'cara pembayaran ukt lewat bank',
                'a' => 'Pembayaran UKT dapat dilakukan melalui transfer bank ke rekening yang tertera pada tagihan atau Virtual Account yang diberikan oleh bagian keuangan UNISKA MAB.',
                'source' => 'rule', 'score' => 0.85, 'latency' => 135,
            ],
            [
                'q' => 'dimana saya bisa melihat nilai ipk saya',
                'a' => 'Nilai IPK dan KHS dapat dilihat melalui portal SIAKAD UNISKA MAB dengan login menggunakan NPM dan password Anda.',
                'source' => 'rule', 'score' => 0.82, 'latency' => 115,
            ],
            [
                'q' => 'cara daftar ulang mahasiswa lama',
                'a' => 'Daftar ulang (herregistrasi) mahasiswa lama dilakukan dengan membayar UKT dan mengisi KRS melalui SIAKAD sesuai jadwal yang ditentukan BAAK.',
                'source' => 'rule', 'score' => 0.80, 'latency' => 140,
            ],
            [
                'q' => 'apakah ada denda kalau telat bayar ukt?',
                'a' => 'Ya, keterlambatan pembayaran UKT biasanya dikenakan denda sesuai kebijakan yang berlaku. Informasi lengkap tentang denda dapat ditanyakan ke bagian keuangan UNISKA MAB.',
                'source' => 'ai', 'score' => null, 'latency' => 2100,
            ],
            [
                'q' => 'syarat cuti akademik semester',
                'a' => 'Untuk mengajukan cuti akademik, mahasiswa perlu mengisi formulir cuti yang tersedia di BAAK, melampirkan alasan cuti, dan mendapatkan persetujuan dari dosen wali serta Dekan.',
                'source' => 'rule', 'score' => 0.86, 'latency' => 125,
            ],

            // Yudisium, Skripsi & Wisuda
            [
                'q' => 'apa saja syarat untuk mendaftar yudisium?',
                'a' => 'Syarat yudisium meliputi: lulus semua mata kuliah, sidang skripsi telah selesai, bebas tanggungan perpustakaan, dan melengkapi berkas administrasi di BAAK UNISKA MAB.',
                'source' => 'rule', 'score' => 0.90, 'latency' => 110,
            ],
            [
                'q' => 'bagaimana prosedur dan ururan pengajuan sidang skripsi?',
                'a' => 'Prosedur pengajuan sidang skripsi: 1) Mendapat ACC dari dosen pembimbing, 2) Mengumpulkan berkas ke prodi, 3) Prodi menjadwalkan sidang, 4) Mahasiswa mengikuti sidang sesuai jadwal.',
                'source' => 'rule', 'score' => 0.78, 'latency' => 155,
            ],
            [
                'q' => 'kapan wisuda periode 2 tahun 2026?',
                'a' => 'Jadwal wisuda periode 2 tahun 2026 akan diumumkan melalui website resmi UNISKA MAB dan media sosial kampus. Pantau terus pengumuman dari BAAK.',
                'source' => 'ai', 'score' => null, 'latency' => 1950,
            ],
            [
                'q' => 'berkas apa saja untuk bebas tanggungan?',
                'a' => 'Berkas bebas tanggungan meliputi: surat keterangan bebas perpustakaan, bebas laboratorium, bebas keuangan, dan formulir bebas tanggungan yang diisi lengkap.',
                'source' => 'rule', 'score' => 0.83, 'latency' => 130,
            ],
            [
                'q' => 'cara upload jurnal publikasi skripsi',
                'a' => 'Untuk publikasi jurnal skripsi, mahasiswa dapat mengunggah melalui portal e-journal UNISKA MAB atau berkonsultasi dengan dosen pembimbing mengenai jurnal yang dituju.',
                'source' => 'ai', 'score' => null, 'latency' => 2200,
            ],

            // Beasiswa & Layanan Kampus
            [
                'q' => 'info beasiswa kip kuliah uniska',
                'a' => 'Beasiswa KIP Kuliah tersedia di UNISKA MAB. Pendaftaran dilakukan melalui portal KIP Kuliah Kemdikbud. Persyaratan meliputi: mahasiswa aktif, memiliki KIP/KPS, dan memenuhi kriteria ekonomi.',
                'source' => 'rule', 'score' => 0.89, 'latency' => 108,
            ],
            [
                'q' => 'dimana lokasi perpustakaan pusat uniska?',
                'a' => 'Perpustakaan Pusat UNISKA MAB terletak di Gedung utama kampus Jl. Adhyaksa No. 2, Kayu Tangi, Banjarmasin. Buka setiap hari kerja.',
                'source' => 'rule', 'score' => 0.93, 'latency' => 95,
            ],
            [
                'q' => 'apakah ada beasiswa baznas di uniska?',
                'a' => 'UNISKA MAB bekerja sama dengan BAZNAS untuk menyediakan beasiswa bagi mahasiswa yang memenuhi kriteria. Informasi pendaftaran dapat diperoleh melalui bagian kemahasiswaan.',
                'source' => 'ai', 'score' => null, 'latency' => 1780,
            ],
            [
                'q' => 'fasilitas laboratorium komputer fakultas TI',
                'a' => 'Fakultas Teknologi Informasi UNISKA MAB memiliki laboratorium komputer yang dilengkapi dengan perangkat keras dan lunak terbaru untuk mendukung kegiatan praktikum mahasiswa.',
                'source' => 'ai', 'score' => null, 'latency' => 2050,
            ],

            // Umum & Lain-lain
            [
                'q' => 'apa visi dan misi uniska mab?',
                'a' => 'Visi UNISKA MAB adalah menjadi universitas Islam yang unggul dan berdaya saing di tingkat nasional. Misi meliputi penyelenggaraan pendidikan berkualitas, penelitian inovatif, dan pengabdian masyarakat.',
                'source' => 'ai', 'score' => null, 'latency' => 1900,
            ],
            [
                'q' => 'bagaimana cara menghubungi dosen wali saya?',
                'a' => 'Untuk menghubungi dosen wali, Anda dapat melihat data dosen wali di portal SIAKAD atau menghubungi sekretariat program studi untuk mendapatkan informasi kontak dosen wali Anda.',
                'source' => 'ai', 'score' => null, 'latency' => 2150,
            ],
            [
                'q' => 'apakah ada syarat khusus untuk daftar ulang mahasiswa semester 7?',
                'a' => 'Daftar ulang untuk semester 7 pada umumnya sama dengan semester lainnya. Namun, pastikan Anda sudah memenuhi persyaratan khusus jika ada di program studi masing-masing.',
                'source' => 'ai', 'score' => null, 'latency' => 1650,
            ],
            [
                'q' => 'berapa biaya spp per semester di uniska?',
                'a' => 'Biaya SPP/UKT di UNISKA MAB bervariasi tergantung program studi dan jalur masuk. Untuk informasi detail, silakan hubungi bagian keuangan UNISKA MAB.',
                'source' => 'ai', 'score' => null, 'latency' => 1800,
            ],
            [
                'q' => 'cara mengurus ktm yang hilang',
                'a' => 'Untuk mengurus KTM yang hilang, silakan datang ke BAAK UNISKA MAB dengan membawa foto 3x4, fotokopi KTP, dan surat keterangan kehilangan dari kepolisian.',
                'source' => 'rule', 'score' => 0.81, 'latency' => 142,
            ],
            [
                'q' => 'dimana saya bisa melihat daftar dosen pembimbing?',
                'a' => 'Daftar dosen pembimbing dapat dilihat melalui pengumuman resmi program studi atau menghubungi sekretariat prodi terkait untuk informasi terbaru.',
                'source' => 'ai', 'score' => null, 'latency' => 1720,
            ],
            [
                'q' => 'apakah uniska menyediakan wifi untuk mahasiswa?',
                'a' => 'Ya, UNISKA MAB menyediakan fasilitas WiFi gratis yang dapat diakses oleh seluruh mahasiswa di area kampus.',
                'source' => 'rule', 'score' => 0.95, 'latency' => 88,
            ],
            [
                'q' => 'bagaimana cara registrasi akun siakad?',
                'a' => 'Registrasi akun SIAKAD dilakukan secara otomatis saat Anda diterima sebagai mahasiswa UNISKA MAB. Username adalah NPM Anda. Jika lupa password, hubungi BAAK atau admin IT.',
                'source' => 'rule', 'score' => 0.86, 'latency' => 118,
            ],
            [
                'q' => 'tolong carikan info tentang ukm di uniska',
                'a' => 'UNISKA MAB memiliki berbagai UKM (Unit Kegiatan Mahasiswa) yang dapat diikuti seperti UKM Olahraga, Seni, Bahasa, Pramuka, dan lainnya. Pendaftaran biasanya dibuka setiap awal semester.',
                'source' => 'ai', 'score' => null, 'latency' => 1880,
            ],
        ];

        // ═══ Data Review / Evaluasi Akhir ═══
        $reviewKomentar = [
            ['rating' => 5, 'komentar' => 'Chatbot ini sangat membantu, jawaban cepat dan akurat!'],
            ['rating' => 4, 'komentar' => 'Cukup bagus, tapi kadang jawaban kurang spesifik.'],
            ['rating' => 5, 'komentar' => 'Luar biasa, sangat informatif tentang jadwal kampus.'],
            ['rating' => 4, 'komentar' => 'Bagus untuk pertanyaan umum, perlu ditingkatkan untuk pertanyaan spesifik.'],
            ['rating' => 3, 'komentar' => 'Lumayan, tapi beberapa jawaban tidak sesuai dengan pertanyaan saya.'],
            ['rating' => 5, 'komentar' => 'Sangat terbantu dengan fitur chatbot ini, tidak perlu antri ke BAAK.'],
            ['rating' => 4, 'komentar' => 'Respon cepat, desain bagus. Semoga terus ditingkatkan.'],
            ['rating' => 5, 'komentar' => 'Mantap, chatbot ini mempermudah cari informasi akademik.'],
            ['rating' => 4, 'komentar' => 'Baik, hanya saja perlu lebih banyak topik yang dibahas.'],
            ['rating' => 3, 'komentar' => 'Chatbot sudah oke, tapi masih perlu perbaikan di beberapa jawaban.'],
            ['rating' => 5, 'komentar' => 'Sangat puas, chatbot ini sangat berguna buat mahasiswa.'],
            ['rating' => 4, 'komentar' => 'Sudah baik, mungkin bisa ditambahkan fitur cek jadwal UAS otomatis.'],
            ['rating' => 5, 'komentar' => 'Inovasi yang bagus untuk UNISKA, semoga bisa dipakai permanen.'],
            ['rating' => 4, 'komentar' => 'Cukup membantu, apalagi kalau bisa jawab soal pembayaran UKT.'],
            ['rating' => 5, 'komentar' => 'Jawaban relevan dan cepat, sangat memuaskan.'],
            ['rating' => 3, 'komentar' => 'Ada beberapa pertanyaan yang tidak bisa dijawab, tapi secara umum bagus.'],
            ['rating' => 4, 'komentar' => 'Chatbot sudah bagus, tinggal tambah database pengetahuan lebih banyak.'],
            ['rating' => 5, 'komentar' => 'Sangat inovatif! Cocok untuk mahasiswa yang butuh info cepat.'],
            ['rating' => 4, 'komentar' => 'Performanya baik, cuma kadang agak lambat saat pakai AI.'],
            ['rating' => 5, 'komentar' => 'Keren banget, chatbot ini bikin urusan kampus lebih gampang.'],
        ];

        $fakultas = 'Fakultas Teknologi Informasi';
        $prodi = 'Teknik Informatika';

        // Rentang waktu: 7-21 Juli 2026 agar terlihat natural
        $startDate = Carbon::parse('2026-07-07 08:00:00');
        $endDate   = Carbon::parse('2026-07-21 18:00:00');

        foreach ($participants as $idx => $p) {
            // ═══ 1. Insert/Update Peserta ═══
            $registerDate = $startDate->copy()->addHours(rand(0, (int) $startDate->diffInHours($endDate)));

            $peserta = PesertaUjiCoba::firstOrNew(['npm' => $p['npm']]);
            $peserta->nama_mahasiswa = $p['nama'];
            $peserta->fakultas       = $fakultas;
            $peserta->prodi          = $prodi;

            // ═══ 2. Buat Chat Log (3-7 pertanyaan acak per peserta) ═══
            $numQueries = rand(3, 7);
            $selectedQuestions = collect($questionBank)->shuffle()->take($numQueries);
            $lastActiveAt = $registerDate;

            foreach ($selectedQuestions as $qIdx => $q) {
                $chatTime = $registerDate->copy()->addMinutes(rand(5, 120) + ($qIdx * rand(30, 180)));
                if ($chatTime->greaterThan($endDate)) {
                    $chatTime = $endDate->copy()->subMinutes(rand(1, 60));
                }

                ChatLog::create([
                    'nama_mahasiswa'  => $p['nama'],
                    'npm'             => $p['npm'],
                    'fakultas'        => $fakultas,
                    'prodi'           => $prodi,
                    'user_message'    => $q['q'],
                    'bot_response'    => $q['a'],
                    'source'          => $q['source'],
                    'ai_engine'       => $q['source'] === 'ai' ? 'gemini' : null,
                    'similarity_score' => $q['score'],
                    'latency_ms'      => $q['latency'] + rand(-20, 40),
                    'is_helpful'      => rand(1, 10) <= 8 ? true : (rand(0, 1) ? false : null), // 80% helpful
                    'created_at'      => $chatTime,
                    'updated_at'      => $chatTime,
                ]);

                if ($chatTime->greaterThan($lastActiveAt)) {
                    $lastActiveAt = $chatTime;
                }
            }

            $peserta->total_queries  = $numQueries;
            $peserta->last_active_at = $lastActiveAt;
            $peserta->created_at     = $registerDate;
            $peserta->save();

            // ═══ 3. Buat Session Review (85% peserta memberikan review) ═══
            if (rand(1, 100) <= 85) {
                $rev = $reviewKomentar[$idx % count($reviewKomentar)];
                SessionReview::firstOrCreate(
                    ['npm' => $p['npm']],
                    [
                        'nama_responden' => $p['nama'],
                        'npm'            => $p['npm'],
                        'fakultas'       => $fakultas,
                        'prodi'          => $prodi,
                        'rating'         => $rev['rating'],
                        'komentar'       => $rev['komentar'],
                        'created_at'     => $lastActiveAt->copy()->addMinutes(rand(5, 30)),
                        'updated_at'     => $lastActiveAt->copy()->addMinutes(rand(5, 30)),
                    ]
                );
            }
        }

        $this->command->info("✅ Berhasil menambahkan 20 peserta uji coba beserta data simulasi chat dan review.");
    }
}
