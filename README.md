# Futsal Field Reservation API

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
