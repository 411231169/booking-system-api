# Futsal Field Reservation API

REST API Backend untuk Sistem Reservasi Lapangan Futsal, dibangun menggunakan Node.js, Express, MySQL 8, dan Sequelize ORM.

## Daftar API Endpoints

### 🔐 1. Auth (Otentikasi)
*Semua endpoint auth bersifat **Public**.*
- `POST /api/auth/register` : Mendaftarkan akun baru.
- `POST /api/auth/login` : Login untuk mendapatkan token JWT.
- `GET /api/auth/profile` : Melihat profil user yang sedang login (Butuh Token).

### 👥 2. Users
*Hanya dapat diakses oleh **ADMIN**.*
- `GET /api/users` : Melihat daftar semua user.
- `GET /api/users/:id` : Melihat detail spesifik seorang user.

### ⚽ 3. Fields (Lapangan)
*Akses campuran antara **Public** dan **ADMIN**.*
- `GET /api/fields` : Melihat semua lapangan yang tersedia (Public).
- `GET /api/fields/:id` : Melihat detail 1 lapangan (Public).
- `POST /api/fields` : Menambahkan lapangan baru (Admin).
- `PUT /api/fields/:id` : Mengedit data lapangan (Admin).
- `DELETE /api/fields/:id` : Menghapus lapangan (Admin).

### 📅 4. Bookings (Pemesanan)
*Dibatasi berdasarkan kepemilikan dan Role.*
- `POST /api/bookings` : Membuat pemesanan baru (Customer).
- `GET /api/bookings/my` : Melihat history pemesanan milik sendiri (Customer).
- `GET /api/bookings/:id` : Melihat detail sebuah pemesanan (Customer pemilik & Admin).
- `GET /api/bookings` : Melihat semua pemesanan dari seluruh user (Admin).
- `PATCH /api/bookings/:id/approve` : Menyetujui pemesanan (Admin).
- `PATCH /api/bookings/:id/reject` : Menolak pemesanan (Admin).

### 💳 5. Payments (Pembayaran)
*Akses campuran.*
- `POST /api/payments` : Mengunggah bukti pembayaran untuk suatu booking (Customer).
- `GET /api/payments` : Melihat semua pembayaran (Admin).
- `PATCH /api/payments/:id/verify` : Memverifikasi bukti pembayaran (Admin).
- `PATCH /api/payments/:id/reject` : Menolak bukti pembayaran (Admin).

---

## Deployment Guide (cPanel Shared Hosting + CI/CD)

Aplikasi ini telah dikonfigurasi untuk menggunakan **Continuous Deployment (CI/CD)** via GitHub Actions langsung ke Shared Hosting (cPanel).

### 1. Setup cPanel Node.js App
1. Buat folder untuk aplikasi di `public_html/api.namadomain.com`
2. Buka menu **Setup Node.js App** di cPanel
3. Buat aplikasi baru:
   - Node.js version: `18/20/24`
   - Application mode: `Production`
   - Application root: `public_html/api.namadomain.com`
   - Application URL: `api.namadomain.com`
   - Startup file: `server.js`
4. Buat file `.env` di dalam folder root aplikasi Anda dengan variabel:
```env
NODE_ENV=production
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=rahasia123
```

### 2. GitHub Actions Secrets
Tambahkan kredensial FTP cPanel Anda ke menu **Settings > Secrets and variables > Actions** di repositori GitHub Anda:
- `FTP_SERVER` : (misal: `ftp.namadomain.com`)
- `FTP_USERNAME` : Username FTP cPanel Anda
- `FTP_PASSWORD` : Password FTP cPanel Anda

### 3. Deploy
1. Masuk ke tab **Actions** di GitHub
2. Pilih workflow **Deploy to cPanel (Shared Hosting)**
3. Klik **Run workflow**
4. Setelah selesai, masuk kembali ke cPanel Node.js App, klik **Run NPM Install**, lalu klik **Restart**.

API Anda sekarang berjalan secara *production-ready* dan dapat diakses publik!

---

## Arsitektur & Alur Sistem (Flowcharts)

Berikut adalah beberapa diagram alur (*flowchart*) yang menjelaskan bagaimana sistem Futsal API bekerja:

### 1. Alur Request & Standarisasi Response (API Flow)
```mermaid
graph TD
    Client[Client / Frontend / Postman] -->|HTTP Request| Express[Express.js App]
    
    Express --> Security[Security Middlewares: Helmet, Cors, RateLimit]
    Security --> Auth{Auth Middleware?}
    
    Auth -->|Yes: Verifikasi Token| TokenCheck{Token Valid?}
    TokenCheck -->|Invalid| ErrorMW[Error Middleware]
    TokenCheck -->|Valid| Controller[Controllers]
    
    Auth -->|No: Public Route| Controller
    
    Controller --> Service[Business Logic / Services]
    Service --> DB[(MySQL Database)]
    DB --> Service
    
    Service -->|Berhasil| ResponseMW[Response Utility]
    Service -->|Gagal/Error| ErrorMW
    
    ErrorMW -->|Format Error JSON| ResponseMW
    
    ResponseMW -->|Format: APP-20001 / APP-40001| Client
    
    classDef success fill:#d4edda,stroke:#28a745,stroke-width:2px;
    classDef error fill:#f8d7da,stroke:#dc3545,stroke-width:2px;
    class ResponseMW success
    class ErrorMW error
```

### 2. Alur CI/CD Deployment (GitHub ke Shared Hosting)
```mermaid
sequenceDiagram
    participant Laptop as Komputer Lokal
    participant Git as GitHub (Main Branch)
    participant GA as GitHub Actions
    participant Hosting as cPanel Shared Hosting
    
    Laptop->>Git: git commit & git push
    Git->>GA: Trigger Manual (Workflow Dispatch)
    activate GA
    GA->>GA: Mengunduh kode terbaru (Checkout)
    GA->>Hosting: Koneksi via FTP/FTPS
    GA->>Hosting: Mengunggah & menimpa file lama secara instan
    deactivate GA
    Hosting->>Hosting: Server Node.js (Passenger) Restart Otomatis
```

### 3. Alur Bisnis Reservasi Futsal (Booking)
```mermaid
graph TD
    Start((Mulai)) --> Register[Registrasi Akun]
    Register --> Login[Login & Dapat Token JWT]
    
    Login --> LihatLap[Lihat Daftar Lapangan]
    LihatLap --> CekJadwal{Pilih Jadwal Kosong?}
    
    CekJadwal -->|Bentrok| Error1[Error: CONFLICT_BOOKING]
    CekJadwal -->|Tersedia| BuatBooking[Buat Pemesanan / Booking]
    
    BuatBooking --> StatusPending[Status: PENDING]
    StatusPending --> Bayar[Unggah Bukti Pembayaran]
    
    Bayar --> AdminCek{Admin Verifikasi Bukti}
    
    AdminCek -->|Valid| Setujui[Admin Setujui Booking]
    AdminCek -->|Palsu/Kurang| Tolak[Admin Tolak Pembayaran]
    
    Tolak --> StatusPending
    
    Setujui --> Selesai((Selesai / Main Futsal))
```
