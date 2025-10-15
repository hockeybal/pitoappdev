# 🚀 Productie Deployment Guide - Pito App

## 📋 Overzicht
- **Frontend URL:** https://pito.app
- **Strapi API URL:** https://strapi.pito.app
- **Database:** pito_strapi_20251014
- **Server:** Ubuntu

---

## 🔧 Stap 1: Strapi Configureren

### 1.1 Kopieer de productie .env naar de server

Op je **lokale machine**, kopieer de inhoud van:
```
strapi/.env.production
```

### 1.2 Upload naar de server

SSH naar je server:
```bash
ssh pito@jouw-server-ip
```

Maak/edit het .env bestand:
```bash
cd /var/www/html/strapi
nano .env
```

Plak de volledige inhoud van `.env.production` en sla op (Ctrl+O, Enter, Ctrl+X)

### 1.3 Build en start Strapi

```bash
cd /var/www/html/strapi

# Installeer dependencies (als nog niet gedaan)
npm install --production

# Build Strapi
npm run build

# Start Strapi
npm run start
```

Of met PM2 (aanbevolen):
```bash
pm2 start npm --name "strapi" -- start
pm2 save
```

---

## 🎨 Stap 2: Next.js Configureren

### 2.1 Kopieer de productie .env naar de server

Op je **lokale machine**, kopieer de inhoud van:
```
next/.env.production
```

### 2.2 Upload naar de server

```bash
cd /var/www/html/next
nano .env.production
```

Plak de inhoud en sla op.

### 2.3 Build Next.js

```bash
cd /var/www/html/next

# Installeer dependencies
npm install --production

# Build voor productie
npm run build

# Start Next.js
npm run start
```

Of met PM2:
```bash
pm2 start npm --name "next" -- start
pm2 save
```

---

## 🌐 Stap 3: Nginx Configuratie

### 3.1 Strapi Nginx Config

Maak: `/etc/nginx/sites-available/strapi.pito.app`

```nginx
server {
    listen 80;
    server_name strapi.pito.app;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 50M;
}
```

### 3.2 Next.js Nginx Config

Maak: `/etc/nginx/sites-available/pito.app`

```nginx
server {
    listen 80;
    server_name pito.app www.pito.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3.3 Activeer de sites

```bash
sudo ln -s /etc/nginx/sites-available/strapi.pito.app /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/pito.app /etc/nginx/sites-enabled/

# Test configuratie
sudo nginx -t

# Herstart Nginx
sudo systemctl restart nginx
```

---

## 🔒 Stap 4: SSL Certificaten (HTTPS)

### 4.1 Installeer Certbot (als nog niet gedaan)

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 4.2 Genereer SSL certificaten

```bash
# Voor Strapi
sudo certbot --nginx -d strapi.pito.app

# Voor Next.js
sudo certbot --nginx -d pito.app -d www.pito.app
```

Volg de instructies en kies optie 2 (redirect HTTP naar HTTPS).

---

## 🔍 Stap 5: Verificatie

### 5.1 Check of alles draait

```bash
# Check PM2 status
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check logs
pm2 logs strapi
pm2 logs next
```

### 5.2 Test de URLs

- Frontend: https://pito.app
- Strapi Admin: https://strapi.pito.app/admin
- Strapi API: https://strapi.pito.app/api/

---

## ⚠️ Belangrijke Notities

### Database Backup
Maak regelmatig backups:
```bash
pg_dump -U pito_strapi pito_strapi_20251014 > backup_$(date +%Y%m%d).sql
```

### Firewall
Zorg dat poorten open zijn:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### DNS Configuratie
Zorg dat je DNS records correct zijn ingesteld:
- **pito.app** → A record → Je server IP
- **www.pito.app** → CNAME → pito.app (of A record → Je server IP)
- **strapi.pito.app** → A record → Je server IP

### Environment Variables Beveiliging
⚠️ **BELANGRIJK:** De `.env` bestanden bevatten gevoelige informatie:
- Voeg `.env.production` toe aan `.gitignore`
- Deel deze bestanden NOOIT publiekelijk
- Bewaar een veilige kopie offline

---

## 🆘 Troubleshooting

### Strapi start niet
```bash
# Check logs
pm2 logs strapi

# Check database connectie
sudo -u postgres psql -d pito_strapi_20251014 -U pito_strapi
```

### Next.js build errors
```bash
cd /var/www/html/next
npm run build 2>&1 | tee build.log
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Database connectie problemen
```bash
# Test database connectie
psql -h localhost -U pito_strapi -d pito_strapi_20251014
```

---

## 📞 Support Checklist

Als er problemen zijn, check:
1. ✅ Database credentials correct?
2. ✅ Nginx configuratie correct?
3. ✅ SSL certificaten geldig?
4. ✅ PM2 processen draaien?
5. ✅ Firewall regels correct?
6. ✅ DNS correct ingesteld?

---

**Deployment gemaakt op:** 15 oktober 2025
**Versie:** 1.0
