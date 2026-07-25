# PANDUAN INSTALASI & SETUP LOKAL PROYEK SKRIPSI
**Judul:** Chatbot Pelayanan Akademik Menggunakan RAG (Retrieval-Augmented Generation)
**Pengembang:** Muhammad Rian Gunadi
**Universitas:** UNISKA MAB

Dokumen ini berisi panduan teknis langkah demi langkah untuk melakukan *setup* aplikasi di lingkungan *development* lokal (komputer penguji).

---

## A. Persyaratan Sistem (*Prerequisites*)
Pastikan perangkat Anda sudah terinstal beberapa aplikasi dasar berikut:
1. **PHP 8.2+** (Sangat disarankan menggunakan **Laravel Herd** atau **XAMPP**).
2. **Composer** (Manajer dependensi PHP).
3. **Node.js** (Versi 18 ke atas) & **NPM**.
4. **Python 3.10+** (Untuk menjalankan mesin RAG Backend).

---

## B. Langkah 1: Persiapan Aplikasi Web (Laravel & React)

1. **Ekstrak File ZIP**
   Ekstrak *file* ZIP proyek ini ke folder lokal Anda (misal: `C:\Users\User\Herd\proyek-skripsi` jika menggunakan Herd, atau `htdocs` jika menggunakan XAMPP).

2. **Buka Terminal / Command Prompt (CMD)**
   Arahkan terminal ke dalam folder utama proyek (`proyek-skripsi`).

3. **Install Dependensi PHP & Node.js**
   Jalankan perintah berikut secara berurutan di Terminal:
   ```bash
   composer install
   npm install
   ```

4. **Konfigurasi Lingkungan (.env)**
   - Salin *file* `.env.example` dan ubah namanya menjadi `.env`.
   - Buka *file* `.env` tersebut dan atur konfigurasi *database* sesuai sistem Anda. Buat database kosong terlebih dahulu di phpMyAdmin (misal: `skripsi_rian`).
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=skripsi_rian
     DB_USERNAME=root
     DB_PASSWORD=
     ```
   *(Jika menggunakan Herd dan database bawaan SQLite, biarkan `DB_CONNECTION=sqlite` dan hapus konfigurasi `DB_HOST` dkk).*

5. **Generate Kunci Keamanan & Migrasi Database**
   Jalankan perintah berikut di Terminal:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
   *(Perintah `--seed` akan otomatis mengisi database dengan data pengujian).*

6. **Bangun Aset Frontend (React/Vite)**
   ```bash
   npm run build
   ```

7. **Jalankan Server Web (Opsional jika pakai XAMPP/Herd)**
   Jika Anda tidak menggunakan Herd/XAMPP untuk *hosting* lokal, jalankan server bawaan Laravel:
   ```bash
   php artisan serve
   ```

---

## C. Langkah 2: Persiapan Backend AI (Python & RAG)

Sistem Chatbot bergantung pada *server* Python untuk memproses pencarian vektor dan menghasilkan teks (Generative AI).

1. **Dapatkan Kunci Akses (API Key) Gemini Gratis**
   Sistem ini didesain menggunakan Google Gemini API agar ringan dan tidak membuat lambat komputer Anda.
   - Buka *browser* dan masuk ke halaman: [Google AI Studio API](https://aistudio.google.com/app/apikey) (pastikan login dengan akun Google Anda).
   - Klik tombol biru bertuliskan **Create API Key**.
   - Salin kunci rahasia yang Anda dapatkan (biasanya berawalan teks `AIzaSy...`).
   - Buka kembali *file* `.env` yang ada di dalam folder proyek, lalu tempelkan kunci tersebut pada bagian `GEMINI_API_KEY=`.

2. **Buka Terminal Baru**
   Arahkan terminal ke dalam *folder* `rag-backend` yang ada di dalam proyek ini:
   ```bash
   cd rag-backend
   ```

3. **Buat & Aktifkan Virtual Environment (VENV)**
   *(Langkah ini sangat penting agar pustaka AI tidak mengganggu sistem Python utama Anda)*
   ```bash
   python -m venv venv
   # Jika menggunakan Windows:
   venv\Scripts\activate
   # Jika menggunakan Mac/Linux:
   source venv/bin/activate
   ```

4. **Install Dependensi Machine Learning**
   ```bash
   pip install -r requirements.txt
   ```

5. **Jalankan Server RAG & Tunnel**
   Anda bisa langsung mengklik ganda (*double-click*) *file* **`Mulai_RAG_dan_Tunnel.bat`** yang ada di folder `rag-backend`. 
   
   *Catatan: Script tersebut akan otomatis menyalakan server FastAPI (Python) yang secara bawaan telah terhubung ke Gemini, sehingga sangat ringan (tidak membuat laptop lemot) dan anti gagal.*

---

## D. Selesai!
Aplikasi siap diuji coba. Silakan buka *browser* dan akses alamat lokal proyek Anda (misal: `http://proyek-skripsi.test` untuk Herd atau `http://localhost:8000` via `artisan serve`).
