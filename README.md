# 🎮 Math Playground 3D - Educational Gaming Portal

> **Media Pembelajaran Matematika Interaktif 3D Berbasis Web**  
> Didesain dan dibuat dengan dedikasi oleh **Wuntat Widiyono**.

Math Playground 3D adalah portal permainan edukasi matematika berbasis grafis 3D interaktif. Dikembangkan menggunakan **Three.js** dan sintesis suara murni tanpa audio eksternal (**Web Audio API**), platform ini bertujuan melatih kecepatan berpikir, daya refleks motorik, dan pemahaman logika matematika bagi siswa dari jenjang **SD, SMP, hingga SMA**.

---

## 🌟 Daftar Permainan yang Tersedia

### 🎯 1. Math Reaction FPS (First-Person Shooter)
Game aksi tembak reaksi cepat sudut pandang orang pertama (FPS 3D):
* **Konsep**: Pemain dihadapkan pada soal matematika di bagian atas layar dan harus membidik serta menembak target balok jawaban yang benar di arena 3D sebelum waktu reaksi habis.
* **Fitur Utama**:
  * **🎯 Sasaran Dinamis**: Target tidak statis, melainkan bergerak aktif (pola patroli bolak-balik, melingkar berputar, dan gelombang vertikal).
  * **🔫 Gudang Senjata (Armory)**: 9 pilihan senjata unik (Glock, AR-15, M4 Carbine, Baretta, Shotgun, M16, Crossbow, MB03A Sniper, Novritsch Sniper) dengan model 3D, efek hentakan (*recoil*), dan suara tembakan sintetis yang berbeda-beda.
  * **🔍 Fitur Sniper Scope**: Klik kanan untuk membidik target jarak jauh dengan reticle scope dan zoom FOV dinamis.
  * **🌍 3 Pilihan Arena Realistis**: Kota Metropolitan, Padang Pasir (Desert), dan Padang Rumput (Meadow).
  * **⭐ Sistem Kelulusan**: Target skor kelulusan dan pemberian 1 - 3 bintang per level.

---

### 🏃 2. Math Parkour Runner 3D (Lane Runner & Parkour)
Game lari parkour tanpa henti 3D di jalan raya futuristik bercahaya:
* **Konsep**: Pemain mengendalikan karakter cyber-runner melintasi 3 jalur untuk menerobos gerbang portal matematika yang berisi jawaban yang benar sambil melompati rintangan balok dan mengumpulkan koin.
* **Fitur Utama**:
  * **🚪 Gerbang Jawaban Matematika**: Gerbang 3 jalur transparan neon tempat pemain harus bermanuver memilih angka hasil kalkulasi yang tepat.
  * **🛍️ Toko Power-Up (Konsumsi)**:
    * **Energy Shield 🛡️**: Menahan 1x tabrakan rintangan atau 1x kesalahan memilih gerbang tanpa mengurangi nyawa.
    * **Pemulih Nyawa ❤️**: Menambah 1 hati yang hilang saat bertanding.
    * **Magnet Koin 🧲**: Menyedot seluruh koin di ketiga jalur secara otomatis selama 10 detik.
    * **Nitro Turbo Boost 🚀**: Melesat dengan kecepatan tinggi 1.5x, pelebaran sudut pandang kamera (FOV 68°), dan kebal rintangan selama 5 detik.
  * **🎨 Kustomisasi Skin Karakter 3D**:
    * 🔷 **Cyber Blue** (Original Sci-Fi)
    * 🟨 **Golden Champion** (Armor emas mengkilap metalik)
    * 🔴 **Crimson Blaze** (Armor merah menyala dengan visor api)
    * 🟢 **Emerald Matrix** (Aksen hijau cyber hacker)
    * 🟣 **Amethyst Phantom** (Ultraviolet bertenaga kosmik)
  * **⚡ Quick Action**: Tombol cepat dan shortcut keyboard `[1]`, `[2]`, `[3]`, `[4]` untuk menggunakan power-up seketika saat berlari.

---

## 📚 Kurikulum & Tingkat Pendidikan (50 Level Tiap Jenjang)

Setiap permainan memiliki **50 Level bertahap** untuk tiap jenjang pendidikan dengan sistem bintang kelulusan:

| Jenjang | Total Level | Cakupan Materi Matematika | Waktu / Toleransi |
| :--- | :---: | :--- | :--- |
| **🎒 SD (Sekolah Dasar)** | **50 Level** | Penjumlahan, Pengurangan, Perkalian, Pembagian dasar, & Operasi Campuran (Rentang nilai 1 - 100). | Reaksi santai (10 dtk / soal) |
| **📐 SMP (Menengah Pertama)** | **50 Level** | Bilangan Bulat Negatif, Aljabar Linear ($ax + b = c$), Pangkat Dua, Bentuk Akar, & Persentase. | Reaksi sedang (9 dtk / soal) |
| **🎓 SMA (Menengah Atas)** | **50 Level** | Trigonometri Sudut Istimewa ($\sin, \cos, \tan$), Logaritma basis 2 & 10, Persamaan Kuadrat, dan Barisan Deret. | Reaksi cepat (8 dtk / soal) |

---

## 🏆 Hall of Fame & Leaderboard (Papan Peringkat)
* Sistem pencatatan nama dan skor rekor pemain secara lokal (`localStorage`).
* Terintegrasi langsung di **Landing Page Hub** maupun **In-Game Modal**.
* Pemisahan kategori peringkat berdasarkan game (*FPS* vs *Runner*) dan jenjang pendidikan (*SD*, *SMP*, *SMA*).

---

## ⌨️ Panduan Kontrol Permainan

### Kontrol Game 1: Math Reaction FPS
| Aksi | Tombol Keyboard / Mouse |
| :--- | :--- |
| **Membidik (Arah Pandang)** | Gerakkan Mouse (Pointer Lock) |
| **Menembak Target** | Klik Kiri Mouse |
| **Zoom Bidik (Scope Sniper)** | Klik Kanan Mouse (Tahan) |
| **Jeda / Kunci Kursor** | Tombol `Esc` |

### Kontrol Game 2: Math Parkour Runner 3D
| Aksi | Tombol Keyboard / Layar Sentuh |
| :--- | :--- |
| **Pindah Jalur Kiri** | Tombol `A` atau `Panah Kiri` |
| **Pindah Jalur Kanan** | Tombol `D` atau `Panah Kanan` |
| **Melompat Rintangan** | Tombol `Spasi`, `W`, atau `Panah Atas` |
| **Gunakan Shield / Heart / Magnet / Nitro** | Tekan Angka `1`, `2`, `3`, `4` atau Klik Tombol HUD |
| **Jeda Permainan** | Tombol `P` atau `Esc` |
| **Kontrol Mobile / Tablet** | Disediakan tombol virtual sentuh pada layar |

---

## 🚀 Cara Menjalankan Game Secara Mandiri (Lokal)

Proyek ini murni berbasis HTML, CSS modern, dan Vanilla ES Module JavaScript tanpa memerlukan proses build / bundler yang rumit.

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/wuntat-source/mathgames.git
   ```
2. **Masuk ke direktori proyek:**
   ```bash
   cd mathgames
   ```
3. **Jalankan Web Server Lokal**:
   Karena game ini menggunakan ES Module JavaScript (`import * as THREE from 'three'`), file harus disajikan lewat protokol HTTP/HTTPS:
   * **Menggunakan Python (Semua OS):**
     ```bash
     python -m http.server 8080
     ```
   * **Menggunakan Node.js (npx serve):**
     ```bash
     npx serve -l 8080
     ```
   * **Menggunakan VS Code:**
     Gunakan ekstensi *Live Server* dan klik *Go Live*.
4. **Buka di Browser:**
   Kunjungi alamat: `http://localhost:8080/index.html`

---

## 🛠️ Arsitektur Teknologi

* **Grafis 3D**: [Three.js](https://threejs.org/) (WebGL Renderer, Dynamic Shadows, Exponential Fog, Procedural Meshes, Shader Lighting).
* **Audio**: Prosedural Sintetis Web Audio API (Osilator Sinus/Persegi/Segitiga dengan Audio Gain Envelopes tanpa ketergantungan file MP3/WAV eksternal).
* **Styling**: Modern Cyberpunk Glassmorphism UI (CSS Flexbox, CSS Grid, Backdrop Filter, Neon Color Palette).
* **Penyimpanan**: Browser `localStorage` untuk progres 50 level, status bintang kelulusan, inventaris toko koin, dan papan skor.

---

## 👤 Kreator & Hak Cipta

* **Desain Konsep & Pengembangan**: **Wuntat Widiyono**
* **Lisensi**: Open Source untuk tujuan pendidikan dan pembelajaran interaktif.
