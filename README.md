# WAD Task Manager — Frontend

Frontend React (Vite) untuk aplikasi manajemen task real-time. Merupakan bagian dari proyek Capstone mata kuliah Web Advanced Development 2.

- **Live URL:** https://wad02nhasana.my.id
- **Backend repo:** https://github.com/NHasana/wad_capstone
- **Dokumentasi API & Socket.IO lengkap:** lihat README di repo backend

---

## Cara Setup Lokal

### Prasyarat
- Node.js v20+
- Backend (`wad-capstone`) sudah berjalan (lokal di `localhost:3000` atau live di VPS)

### Instalasi

```bash
git clone https://github.com/NHasana/wad_frontend.git
cd wad_frontend
npm install
```

Buat file `.env` di root folder:

```env
VITE_API_URL=http://localhost:3000
```

Ganti `VITE_API_URL` dengan URL backend yang ingin dipakai (lokal atau live di VPS).

Jalankan dev server:

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

### Build untuk Production

```bash
npm run build
```

Hasil build ada di folder `dist/`.

---

## Struktur Folder

```
src/
├── pages/          # Halaman utama (Login, Register, Tasks, Profile)
├── components/      # Komponen reusable (Navbar, TaskForm, NotificationBell, dll)
├── contexts/        # React Context (AuthContext, SocketContext, NotifContext)
├── services/        # Service layer — abstraksi pemanggilan API (axios)
├── hooks/           # Custom hooks (useRealTimeTasks, dll)
├── lib/             # Utilitas (axios instance, tokenStore)
└── App.jsx          # Routing utama (React Router v6)
```

---

## Halaman & Routing

| Path | Komponen | Proteksi |
|---|---|---|
| `/login` | LoginPage | Publik |
| `/register` | RegisterPage | Publik |
| `/tasks` | TasksPage | Wajib login |
| `/profile` | ProfilePage | Wajib login |

Route yang wajib login dibungkus `<ProtectedRoute />`, yang otomatis redirect ke `/login` jika `AuthContext` mendeteksi user belum terautentikasi.

---

## Autentikasi & State Management

- **AuthContext** (`contexts/AuthContext.jsx`) menyimpan state user & fungsi `login`, `register`, `logout`. Access token & refresh token disimpan di `sessionStorage` melalui `TokenStore` (`lib/tokenStore.js`) — dibersihkan otomatis saat sesi browser ditutup.
- **Axios instance** (`lib/axios.js`) memakai `VITE_API_URL` sebagai base URL, dengan:
  - **Request interceptor**: menyisipkan `Authorization: Bearer <accessToken>` otomatis ke setiap request.
  - **Response interceptor**: jika response `401`, otomatis memanggil `/auth/refresh`, memperbarui access token, lalu mengulang request yang gagal tadi.

---

## Real-Time (Socket.IO)

- **SocketContext** (`contexts/SocketContext.jsx`) membuat koneksi socket ke `VITE_API_URL`, mengirim access token lewat `auth.token` saat handshake.
- **NotifContext** (`contexts/NotifContext.jsx`) mendengarkan event `notification` dari socket untuk memperbarui bell icon (badge unread count) dan menampilkan toast.
- **useRealTimeTasks** (`hooks/useRealTimeTasks.js`) mendengarkan event `task:created`, `task:updated`, `task:deleted` untuk memperbarui daftar task secara live tanpa refresh, disertai toast informasi untuk semua user yang sedang online.

Detail lengkap event Socket.IO ada di README repo backend.

---

## Fitur Notification (Model Tambahan)

- **Bell icon** di navbar (`components/NotificationBell.jsx`) menampilkan badge jumlah notifikasi belum dibaca.
- Klik bell membuka dropdown berisi riwayat notifikasi (judul, pesan, waktu).
- Notifikasi baru (task dibuat/diperbarui/dihapus milik sendiri) masuk secara real-time lewat Socket.IO, langsung menambah badge dan memicu toast.
- Klik salah satu notifikasi atau tombol "Tandai semua dibaca" akan memperbarui status `isRead` ke backend.

---

## Library Utama

| Library | Kegunaan |
|---|---|
| React Router v6 | Client-side routing |
| Axios | HTTP client dengan interceptor |
| socket.io-client | Koneksi real-time WebSocket |
| react-hook-form | Manajemen form (Login, Register, TaskForm) |

---

## Environment Variables

| Variable | Deskripsi | Contoh |
|---|---|---|
| `VITE_API_URL` | Base URL backend (REST API & Socket.IO) | `https://wad02nhasana.my.id` |

---

## Deployment

Frontend di-deploy ke VPS lewat dua jalur (lihat README backend untuk diagram arsitektur lengkap):
1. Build (`npm run build`) → hasil `dist/` disalin ke `/var/www/html` (disajikan Nginx sebagai static file untuk domain utama)
2. Build yang sama juga dijalankan lewat PM2 (`serve -s dist -l 3001`) sebagai proses terpisah

CI/CD otomatis lewat GitHub Actions: setiap push ke branch `main` akan build ulang dan deploy ke VPS tanpa intervensi manual.

---

## Pengembang

**Nur Hasana Merlinda Safitri** — Model tambahan: **Notification**.
