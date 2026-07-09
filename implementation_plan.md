# Implementation Plan - Web GIS Portal Kelurahan Andongsili (Static Map-Centric with Hero)

Rencana implementasi untuk program KKN **"Pembuatan Web GIS Portal Kelurahan Andongsili sebagai Pusat Informasi & Peta Interaktif"** yang dipimpin oleh **Anak Agung Ngurah Sadewa Tedja (123230050)**.

Aplikasi web ini bersifat **statis penuh (client-side only)** dan berfokus penuh pada visualisasi geografis (GIS) wilayah Kelurahan Andongsili. Proyek disederhanakan dengan menghapus modul Berita & Galeri, serta menambahkan **Hero Section** interaktif sebagai gerbang masuk sebelum pengguna menjelajahi peta.

---

## User Reviews Required

> [!IMPORTANT]
> **Poin Penting Desain & Layout (Hero & Map Transition):**
> 1. **Struktur Beranda & Hero Section:**
>    - Saat pertama kali dibuka, halaman akan menampilkan **Hero Section** layar penuh yang menyajikan foto lanskap kelurahan, ucapan selamat datang, deskripsi singkat sejarah, serta statistik kependudukan cepat.
>    - Dilengkapi dengan tombol aksi utama (*Call-to-Action*): **"Mulai Penjelajahan Peta"** yang memiliki efek hover dinamis.
> 2. **Transisi Animasi ke Peta Fokus:**
>    - Ketika tombol eksplorasi diklik, Hero Section akan bergeser ke atas/memudar dengan transisi halus (`framer-motion` style CSS transition), menyingkap **Peta Interaktif Layar Penuh** yang berada di bawahnya.
>    - Pengguna dapat kembali ke Hero Section kapan saja menggunakan tombol "Info Profil" di sudut peta.
> 3. **Pembersihan Berita & Galeri:**
>    - Komponen berita, pengumuman, dan galeri dokumentasi dihapus sepenuhnya sesuai permintaan untuk memaksimalkan fokus fungsionalitas peta wilayah dan informasi lokasi penting.

---

## Open Questions

> [!NOTE]
> 1. **Konten Hero & Gambar Latar Belakang:** Gambar/foto apa yang sebaiknya dipasang sebagai latar belakang Hero Section? Kami akan menyediakan placeholder gambar pemandangan pedesaan berkualitas tinggi yang dapat diganti dengan foto asli kelurahan.
> 2. **Batas Administrasi:** Apakah batas wilayah RT/RW perlu ditandai dengan garis pembatas (polygon) di peta, atau cukup dengan marker lokasi titik penting saja? (Titik penting lebih mudah dikelola tanpa data spasial kompleks).

---

## Proposed Changes

Struktur proyek akhir yang bersih dan minimalis:

```
kkn-kelurahan/
├── index.html            # Halaman utama (Hero & Map Container)
├── styles.css            # CSS custom dengan dukungan Glassmorphism & Transisi
├── data.js               # Data statis terstruktur (Profil, Statistik, dan Marker Lokasi)
├── app.js                # Inisialisasi peta Leaflet, filter, pencarian, dan navigasi transisi Hero-Map
└── assets/               # Gambar aset lokal
    ├── markers/          # Ikon pin peta kustom (sekolah, masjid, puskesmas, dll.)
    └── images/           # Foto latar belakang hero dan foto-foto detail fasilitas
```

### 1. Antarmuka Pengguna (`index.html`)

#### [NEW] [index.html](file:///c:/Users/Azeroth/Documents/PunyaDewa/KKN/index.html)
* **Hero Section Overlay:**
  - Header berlogo KKN & lambang daerah.
  - Judul megah "Portal GIS Interaktif Kelurahan Andongsili".
  - Narasi profil singkat sejarah dan potensi wilayah.
  - Statistik Grid: 4 metrik utama (Penduduk, Kepala Keluarga, RW, RT).
  - Tombol CTA eksplorasi peta.
* **Map Explorer View:**
  - Container peta Leaflet `#map` (mengisi penuh viewport setelah Hero bergeser).
  - **Sidebar Filter Melayang:** Kolom pencarian instan dan checklist kategori penanda.
  - **Location Detail Drawer:** Panel geser samping kanan untuk info fasilitas (deskripsi, foto, kontak, rute Google Maps).
  - Tombol "Kembali Ke Profil" di sudut kiri atas peta.

---

### 2. Desain Visual (`styles.css`)

#### [NEW] [styles.css](file:///c:/Users/Azeroth/Documents/PunyaDewa/KKN/styles.css)
* Desain minimalis dengan tema modern (mendukung font premium Google Fonts Outfit/Inter).
* Desain glassmorphism semi-transparan untuk panel filter dan detail penanda agar menyatu estetis dengan peta di latar belakang.
* Animasi transisi pergeseran Hero Section:
  ```css
  .hero-active .hero-section { transform: translateY(0); }
  .map-active .hero-section { transform: translateY(-100%); opacity: 0; pointer-events: none; }
  .map-active .map-section { opacity: 1; pointer-events: auto; }
  ```

---

### 3. Logika & Data (`data.js` & `app.js`)

#### [NEW] [data.js](file:///c:/Users/Azeroth/Documents/PunyaDewa/KKN/data.js)
Struktur data tunggal yang bersih:
- **`KELURAHAN_PROFILE`**: Nama kelurahan, deskripsi sejarah, kontak administrasi, alamat kantor, gambar latar belakang hero.
- **`KELURAHAN_STATS`**: Jumlah penduduk, kepala keluarga, jumlah RW, jumlah RT, luas area (Ha).
- **`MAP_CONFIG`**: Koordinat pusat (`lat`, `lng`) dan zoom level awal.
- **`LOCATIONS`**: List koordinat penanda fasilitas publik, kesehatan, pendidikan, UMKM, dan peribadatan.

#### [NEW] [app.js](file:///c:/Users/Azeroth/Documents/PunyaDewa/KKN/app/app.js)
Logika interaktivitas:
- Inisialisasi peta Leaflet.js dengan Tile Layer CartoDB Positron (bersih, tidak berantakan, cocok untuk peta dashboard).
- Navigasi transisi class CSS antara mode `.hero-active` dan `.map-active`.
- Filter marker berdasarkan pilihan kategori (Kesehatan, Pendidikan, Pemerintahan, UMKM, Tempat Ibadah).
- Algoritma pencarian real-time pada daftar marker.
- Handler klik marker untuk membuka laci samping info koordinat dan memicu pergerakan kamera peta (*panTo*).

---

## Verification Plan

### Manual Verification
1. **Transisi Lancar:** Memastikan ketika mengklik "Mulai Penjelajahan Peta", Hero Section bergeser ke atas dengan mulus dan peta memuat marker secara instan.
2. **Pencarian Terarah:** Mengetik nama sekolah/kantor di kotak pencarian, memicu auto-focus kamera Leaflet menuju pin marker yang bersangkutan dan membuka panel detailnya.
3. **Uji Responsif Panel:** Memastikan di layar ponsel pintar (smartphone), panel detail tampil sebagai lembaran bawah (*bottom sheet*) yang dapat disembunyikan agar navigasi peta tetap leluasa.
