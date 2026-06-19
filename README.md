# Futsal Field Reservation API

REST API Backend untuk Sistem Reservasi Lapangan Futsal, dibangun menggunakan Node.js, Express, MySQL 8, dan Sequelize ORM.

## Daftar API Endpoints

### 🔐 1. Auth (Otentikasi)
*Semua endpoint auth bersifat **Public**.*
- `POST /api/v1/auth/register` : Mendaftarkan akun baru.
- `POST /api/v1/auth/login` : Login untuk mendapatkan token JWT.
- `GET /api/v1/auth/profile` : Melihat profil user yang sedang login (Butuh Token).

### 👥 2. Users
*Hanya dapat diakses oleh **ADMIN**.*
- `GET /api/v1/users` : Melihat daftar semua user.
- `GET /api/v1/users/:id` : Melihat detail spesifik seorang user.

### ⚽ 3. Fields (Lapangan)
*Akses campuran antara **Public** dan **ADMIN**.*
- `GET /api/v1/fields` : Melihat semua lapangan yang tersedia (Public).
- `GET /api/v1/fields/:id` : Melihat detail 1 lapangan (Public).
- `POST /api/v1/fields` : Menambahkan lapangan baru (Admin).
- `PUT /api/v1/fields/:id` : Mengedit data lapangan (Admin).
- `DELETE /api/v1/fields/:id` : Menghapus lapangan (Admin).

### 📅 4. Bookings (Pemesanan)
*Dibatasi berdasarkan kepemilikan dan Role.*
- `POST /api/v1/bookings` : Membuat pemesanan baru (Customer).
- `GET /api/v1/bookings/my` : Melihat history pemesanan milik sendiri (Customer).
- `GET /api/v1/bookings/:id` : Melihat detail sebuah pemesanan (Customer pemilik & Admin).
- `GET /api/v1/bookings` : Melihat semua pemesanan dari seluruh user (Admin).
- `PATCH /api/v1/bookings/:id/approve` : Menyetujui pemesanan (Admin).
- `PATCH /api/v1/bookings/:id/reject` : Menolak pemesanan (Admin).

### 💳 5. Payments (Pembayaran)
*Akses campuran.*
- `POST /api/v1/payments` : Mengunggah bukti pembayaran untuk suatu booking (Customer).
- `GET /api/v1/payments` : Melihat semua pembayaran (Admin).
- `PATCH /api/v1/payments/:id/verify` : Memverifikasi bukti pembayaran (Admin).
- `PATCH /api/v1/payments/:id/reject` : Menolak bukti pembayaran (Admin).

---

## Deployment Guide (VPS Ubuntu + Nginx + PM2)

### 1. Persiapan Server
Update server dan install Node.js, Nginx, dan MySQL.
```bash
sudo apt update
sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx mysql-server
```

### 2. Setup Database MySQL
```bash
sudo mysql
```
Jalankan query SQL:
```sql
CREATE DATABASE futsal_db;
CREATE USER 'futsal_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON futsal_db.* TO 'futsal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Clone & Setup Project
```bash
git clone <repository_url> futsal-api
cd futsal-api
npm install --production
cp .env.example .env
```
Edit file `.env` dan sesuaikan kredensial database dan JWT Secret.

### 4. Install PM2 & Start App
```bash
sudo npm install -g pm2
pm2 start server.js --name "futsal-api"
pm2 save
pm2 startup
```

### 5. Setup Nginx Reverse Proxy
Buat konfigurasi Nginx baru:
```bash
sudo nano /etc/nginx/sites-available/futsal-api
```
Isi dengan:
```nginx
server {
    listen 80;
    server_name api.domainanda.com; # Ganti dengan domain atau IP VPS

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/futsal-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL / HTTPS (Opsional dengan Certbot)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.domainanda.com
```

API Anda sekarang berjalan secara production-ready dan dapat diakses publik.
