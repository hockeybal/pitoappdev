# 🚀 Deployment Handleiding - TransIP VPS

Deze handleiding beschrijft stap voor stap hoe je het PitoApp project (Next.js + Strapi) live zet op een TransIP VPS.

## 📋 Overzicht

Je project bestaat uit:
- **Strapi Backend** (CMS/API) - draait op poort 1337
- **Next.js Frontend** - draait op poort 3000
- **PostgreSQL Database** - voor productie data
- **Nginx** - als reverse proxy
- **PM2** - voor proces management

---

## 1️⃣ VPS Voorbereiding

### 1.1 Inloggen op je VPS

```bash
ssh root@jouw-vps-ip-adres
```

### 1.2 Systeem updaten

```bash
apt update && apt upgrade -y
```

### 1.3 Firewall configureren

```bash
# UFW firewall installeren en configureren
apt install ufw -y

# Basis regels
ufw default deny incoming
ufw default allow outgoing

# SSH, HTTP en HTTPS toestaan
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Firewall activeren
ufw enable
```

### 1.4 Gebruiker aanmaken (veiliger dan root)

```bash
# Nieuwe gebruiker aanmaken
adduser deploy

# Gebruiker sudo rechten geven
usermod -aG sudo deploy

# SSH toegang voor nieuwe gebruiker
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

**Vanaf nu login met de deploy gebruiker:**
```bash
ssh deploy@jouw-vps-ip-adres
```

---

## 2️⃣ Node.js en dependencies installeren

### 2.1 Node.js installeren (v20 LTS)

```bash
# Node.js repository toevoegen
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js installeren
sudo apt install -y nodejs

# Versie controleren
node --version  # Moet v20.x.x tonen
npm --version
```

### 2.2 Yarn installeren

```bash
# Corepack inschakelen (komt met Node.js)
sudo corepack enable

# Yarn versie instellen
corepack prepare yarn@4.5.0 --activate

# Controleren
yarn --version
```

### 2.3 PM2 installeren (proces manager)

```bash
sudo npm install -g pm2

# PM2 bij opstarten laden
pm2 startup
# Voer het commando uit dat PM2 toont
```

---

## 3️⃣ PostgreSQL Database installeren

### 3.1 PostgreSQL installeren

```bash
sudo apt install postgresql postgresql-contrib -y
```

### 3.2 Database en gebruiker aanmaken

```bash
# Inloggen als postgres gebruiker
sudo -u postgres psql

# In PostgreSQL console:
CREATE DATABASE pitoapp_production;
CREATE USER pitoapp_user WITH PASSWORD 'kies-een-sterk-wachtwoord';
GRANT ALL PRIVILEGES ON DATABASE pitoapp_production TO pitoapp_user;
\q
```

### 3.3 PostgreSQL configureren voor externe toegang (optioneel)

Als je database wilt beheren vanaf je lokale machine:

```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
# Zoek: listen_addresses en verander naar:
# listen_addresses = 'localhost'  # Houd op localhost voor veiligheid

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Voeg toe:
# host    pitoapp_production    pitoapp_user    127.0.0.1/32    md5

# Herstart PostgreSQL
sudo systemctl restart postgresql
```

---

## 4️⃣ Project uploaden naar VPS

### 4.1 Git installeren

```bash
sudo apt install git -y
```

### 4.2 Project clonen

```bash
# Map aanmaken voor je applicaties
mkdir -p ~/apps
cd ~/apps

# Project clonen
git clone https://github.com/hockeybal/pitoappdev.git
cd pitoappdev
```

**Alternatief: Met SFTP uploaden**

Als je liever je lokale versie gebruikt (met lokale aanpassingen):
```bash
# Vanaf je lokale machine:
scp -r /Users/michelvannoort/sites/website1/launchpad deploy@jouw-vps-ip:/home/deploy/apps/pitoapp
```

---

## 5️⃣ Environment variabelen configureren

### 5.1 Strapi environment variabelen

```bash
cd ~/apps/pitoappdev/strapi
cp .env.example .env
nano .env
```

**Vul in:**
```bash
HOST=0.0.0.0
PORT=1337

# Database configuratie
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://pitoapp_user:jouw-database-wachtwoord@localhost:5432/pitoapp_production

# Security keys - genereer unieke keys!
# Gebruik: openssl rand -base64 32
APP_KEYS="GENEREER_UNIEKE_KEY_1,GENEREER_UNIEKE_KEY_2,GENEREER_UNIEKE_KEY_3,GENEREER_UNIEKE_KEY_4"
API_TOKEN_SALT=GENEREER_UNIEKE_SALT
ADMIN_JWT_SECRET=GENEREER_UNIEKE_SECRET
TRANSFER_TOKEN_SALT=GENEREER_UNIEKE_SALT
JWT_SECRET=GENEREER_UNIEKE_SECRET

# Client URL (je Next.js frontend)
CLIENT_URL=https://jouw-domein.nl
PREVIEW_SECRET=GENEREER_UNIEKE_SECRET

# Node environment
NODE_ENV=production
```

**Unieke keys genereren:**
```bash
# Voer meerdere keren uit voor verschillende keys
openssl rand -base64 32
```

### 5.2 Next.js environment variabelen

```bash
cd ~/apps/pitoappdev/next
cp .env.example .env
nano .env
```

**Vul in:**
```bash
# Je productie URL
WEBSITE_URL=https://jouw-domein.nl
PORT=3000

# Strapi API URL (intern, localhost is prima)
NEXT_PUBLIC_API_URL=http://localhost:1337
PREVIEW_SECRET=ZELFDE_ALS_IN_STRAPI

# NextAuth configuratie
NEXTAUTH_URL=https://jouw-domein.nl
NEXTAUTH_SECRET=GENEREER_UNIEKE_SECRET

# Mollie API keys (krijg je van Mollie dashboard)
MOLLIE_API_KEY=test_xxxx  # Later vervangen door live key
NEXT_PUBLIC_MOLLIE_PROFILE_ID=pfl_xxxx

# Node environment
NODE_ENV=production
```

---

## 6️⃣ Dependencies installeren en builden

### 6.1 Root dependencies

```bash
cd ~/apps/pitoappdev
yarn install
```

### 6.2 Strapi builden

```bash
cd ~/apps/pitoappdev/strapi
yarn install
yarn build

# Database migraties draaien en data seeden (eerste keer)
yarn seed
```

### 6.3 Next.js builden

```bash
cd ~/apps/pitoappdev/next
yarn install
yarn build
```

---

## 7️⃣ PM2 configureren (proces management)

### 7.1 PM2 configuratiebestand aanmaken

```bash
cd ~/apps/pitoappdev
nano ecosystem.config.js
```

**Inhoud:**
```javascript
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: './strapi',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/strapi-error.log',
      out_file: './logs/strapi-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'nextjs',
      cwd: './next',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/nextjs-error.log',
      out_file: './logs/nextjs-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

### 7.2 Logs map aanmaken

```bash
mkdir -p ~/apps/pitoappdev/logs
```

### 7.3 Applicaties starten met PM2

```bash
cd ~/apps/pitoappdev
pm2 start ecosystem.config.js

# Status controleren
pm2 status

# Logs bekijken
pm2 logs

# PM2 opslaan zodat het na reboot opnieuw start
pm2 save
```

---

## 8️⃣ Nginx installeren en configureren

### 8.1 Nginx installeren

```bash
sudo apt install nginx -y
```

### 8.2 Nginx configuratie aanmaken

```bash
sudo nano /etc/nginx/sites-available/pitoapp
```

**Inhoud (pas jouw-domein.nl aan):**
```nginx
# Upstream voor Next.js
upstream nextjs_upstream {
  server 127.0.0.1:3000;
}

# Upstream voor Strapi
upstream strapi_upstream {
  server 127.0.0.1:1337;
}

# HTTP naar HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name jouw-domein.nl www.jouw-domein.nl;
    
    # Voor Let's Encrypt certificaat validatie
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - Next.js Frontend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name jouw-domein.nl www.jouw-domein.nl;

    # SSL certificaten (worden door Certbot toegevoegd)
    # ssl_certificate /etc/letsencrypt/live/jouw-domein.nl/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/jouw-domein.nl/privkey.pem;

    # SSL configuratie
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Veiligheidsheaders
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Next.js proxy
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# HTTPS - Strapi API
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.jouw-domein.nl;

    # SSL certificaten (worden door Certbot toegevoegd)
    # ssl_certificate /etc/letsencrypt/live/api.jouw-domein.nl/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/api.jouw-domein.nl/privkey.pem;

    # SSL configuratie
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Veiligheidsheaders
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Upload limiet verhogen voor media
    client_max_body_size 100M;

    # Strapi proxy
    location / {
        proxy_pass http://strapi_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 8.3 Nginx configuratie activeren

```bash
# Symlink aanmaken
sudo ln -s /etc/nginx/sites-available/pitoapp /etc/nginx/sites-enabled/

# Standaard site verwijderen
sudo rm /etc/nginx/sites-enabled/default

# Configuratie testen
sudo nginx -t

# Nginx herstarten
sudo systemctl restart nginx
```

---

## 9️⃣ SSL Certificaat installeren (Let's Encrypt)

### 9.1 Certbot installeren

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 9.2 Domeinnamen configureren in TransIP

**Belangrijk:** Voordat je SSL kan installeren, moet je eerst je domeinnamen instellen:

1. Log in op **TransIP Control Panel**
2. Ga naar je domein
3. Klik op **DNS**
4. Voeg A-records toe:
   - `@` (apex/root) → `jouw-vps-ip-adres`
   - `www` → `jouw-vps-ip-adres`
   - `api` → `jouw-vps-ip-adres`
5. Wacht 15-30 minuten voor DNS propagatie

**DNS propagatie controleren:**
```bash
# Vanaf je lokale machine
dig jouw-domein.nl
dig api.jouw-domein.nl
```

### 9.3 SSL certificaten verkrijgen

```bash
# Certificaten aanvragen voor alle domeinen
sudo certbot --nginx -d jouw-domein.nl -d www.jouw-domein.nl -d api.jouw-domein.nl

# Volg de instructies:
# 1. Voer je email in
# 2. Accepteer de voorwaarden
# 3. Kies of je redirects wilt (kies 2 voor HTTPS redirect)
```

### 9.4 Automatische vernieuwing testen

```bash
# Test of automatische vernieuwing werkt
sudo certbot renew --dry-run
```

Certbot zal automatisch je certificaten vernieuwen via een cronjob.

---

## 🔟 Environment variabelen updaten met echte URLs

### 10.1 Strapi .env updaten

```bash
nano ~/apps/pitoappdev/strapi/.env
```

Update:
```bash
CLIENT_URL=https://jouw-domein.nl
```

### 10.2 Next.js .env updaten

```bash
nano ~/apps/pitoappdev/next/.env
```

Update:
```bash
WEBSITE_URL=https://jouw-domein.nl
NEXT_PUBLIC_API_URL=https://api.jouw-domein.nl
NEXTAUTH_URL=https://jouw-domein.nl
```

### 10.3 Applicaties herstarten

```bash
cd ~/apps/pitoappdev
pm2 restart all
```

---

## 1️⃣1️⃣ Strapi Admin account aanmaken

### 11.1 Eerste keer inloggen

1. Ga naar: `https://api.jouw-domein.nl/admin`
2. Maak een admin account aan
3. Log in op het Strapi dashboard

### 11.2 Strapi configureren

1. **Settings → General**
   - Update Base URL: `https://api.jouw-domein.nl`

2. **Settings → Roles → Public**
   - Configureer welke API endpoints publiek toegankelijk zijn

3. **Settings → Users & Permissions**
   - Configureer authenticatie opties

---

## 1️⃣2️⃣ Mollie betalingen configureren

### 12.1 Mollie account aanmaken

1. Ga naar [mollie.com](https://www.mollie.com/)
2. Maak een account aan
3. Verifieer je bedrijfsgegevens

### 12.2 API keys ophalen

1. Log in op Mollie Dashboard
2. Ga naar **Developers → API Keys**
3. Kopieer je:
   - Test API key (voor testen)
   - Live API key (voor productie)

### 12.3 Mollie keys toevoegen

```bash
nano ~/apps/pitoappdev/next/.env
```

Update:
```bash
# Voor testen eerst
MOLLIE_API_KEY=test_xxxxxxxxxxxxxx
NEXT_PUBLIC_MOLLIE_PROFILE_ID=pfl_xxxxxx

# Later voor live
MOLLIE_API_KEY=live_xxxxxxxxxxxxxx
```

### 12.4 Webhook URL configureren

In Mollie Dashboard:
1. Ga naar **Settings → Website Profiles**
2. Klik op je profile
3. Voeg Webhook URL toe: `https://jouw-domein.nl/api/webhook`

### 12.5 Applicatie herstarten

```bash
pm2 restart nextjs
```

---

## 1️⃣3️⃣ Monitoring en onderhoud

### 13.1 PM2 monitoring

```bash
# Status bekijken
pm2 status

# Realtime logs
pm2 logs

# Specifieke app logs
pm2 logs strapi
pm2 logs nextjs

# Monitoring dashboard
pm2 monit

# Memory en CPU gebruik
pm2 list
```

### 13.2 Nginx logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 13.3 PostgreSQL backups

**Handmatige backup:**
```bash
pg_dump -U pitoapp_user pitoapp_production > ~/backups/db_$(date +%Y%m%d).sql
```

**Automatische dagelijkse backup (cronjob):**
```bash
# Crontab editor openen
crontab -e

# Voeg toe (backup om 3:00 's nachts):
0 3 * * * pg_dump -U pitoapp_user pitoapp_production > ~/backups/db_$(date +\%Y\%m\%d).sql

# Backup directory aanmaken
mkdir -p ~/backups
```

### 13.4 Strapi media backups

```bash
# Media uploads backuppen
cd ~/apps/pitoappdev/strapi
tar -czf ~/backups/strapi_uploads_$(date +%Y%m%d).tar.gz public/uploads/
```

---

## 1️⃣4️⃣ Updates deployen

### 14.1 Code updates via Git

```bash
cd ~/apps/pitoappdev

# Laatste versie ophalen
git pull origin main

# Dependencies updaten
yarn install

# Strapi rebuilden
cd strapi
yarn install
yarn build

# Next.js rebuilden
cd ../next
yarn install
yarn build

# Applicaties herstarten
cd ..
pm2 restart all
```

### 14.2 Zero-downtime deployment (optioneel)

```bash
# PM2 reload i.p.v. restart voor zero downtime
pm2 reload all
```

---

## 1️⃣5️⃣ Veelvoorkomende commando's

### Applicatie management
```bash
# Alle apps starten
pm2 start ecosystem.config.js

# Alle apps stoppen
pm2 stop all

# Alle apps herstarten
pm2 restart all

# Specifieke app herstarten
pm2 restart strapi
pm2 restart nextjs

# Apps verwijderen uit PM2
pm2 delete all
```

### Nginx management
```bash
# Nginx herstarten
sudo systemctl restart nginx

# Nginx status
sudo systemctl status nginx

# Nginx configuratie testen
sudo nginx -t

# Nginx reloaden (zonder downtime)
sudo systemctl reload nginx
```

### PostgreSQL management
```bash
# PostgreSQL status
sudo systemctl status postgresql

# PostgreSQL herstarten
sudo systemctl restart postgresql

# Database console
sudo -u postgres psql pitoapp_production
```

---

## 1️⃣6️⃣ Troubleshooting

### Applicatie draait niet

```bash
# PM2 status controleren
pm2 status

# Logs bekijken
pm2 logs

# App opnieuw starten
pm2 restart all
```

### Nginx errors

```bash
# Error logs bekijken
sudo tail -f /var/log/nginx/error.log

# Configuratie testen
sudo nginx -t

# Port 80/443 in gebruik?
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### Database connectie problemen

```bash
# PostgreSQL status
sudo systemctl status postgresql

# Database bereikbaar?
psql -U pitoapp_user -d pitoapp_production -h localhost

# Connection string controleren in .env files
```

### SSL certificaat problemen

```bash
# Certificaat status
sudo certbot certificates

# Certificaat vernieuwen
sudo certbot renew

# Nginx SSL configuratie controleren
sudo nginx -t
```

### Out of memory

```bash
# Memory usage bekijken
free -h

# PM2 memory limiet verhogen in ecosystem.config.js
max_memory_restart: '2G'

# Swap space toevoegen (als laatste redmiddel)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 1️⃣7️⃣ Beveiliging checklist

- ✅ Firewall (UFW) actief
- ✅ SSH key authentication (wachtwoord login uitschakelen)
- ✅ Niet-root gebruiker voor deployment
- ✅ SSL certificaten geïnstalleerd
- ✅ Sterke wachtwoorden voor database
- ✅ Environment variabelen met unieke secrets
- ✅ Database niet publiek toegankelijk
- ✅ Nginx security headers
- ✅ Regelmatige backups
- ✅ Software updates

### SSH key authentication instellen

```bash
# Vanaf lokale machine, SSH key genereren
ssh-keygen -t ed25519 -C "jouw-email@example.com"

# Public key naar VPS kopiëren
ssh-copy-id deploy@jouw-vps-ip

# Op VPS, wachtwoord login uitschakelen
sudo nano /etc/ssh/sshd_config

# Zoek en verander:
# PasswordAuthentication no
# PubkeyAuthentication yes

# SSH herstarten
sudo systemctl restart sshd
```

---

## 1️⃣8️⃣ Performance optimalisatie

### Next.js optimalisaties

1. **Image optimization** - Next.js doet dit automatisch
2. **Static generation** waar mogelijk
3. **CDN** voor static assets (optioneel, bijv. CloudFlare)

### Strapi optimalisaties

1. **Database indexen** - PostgreSQL performance tuning
2. **Media CDN** - Upload naar externe storage (AWS S3, CloudFlare R2)
3. **Caching** - Redis voor API caching (optioneel)

### Nginx caching (optioneel)

```nginx
# In /etc/nginx/sites-available/pitoapp
# Voor static assets caching toevoegen aan server block:

location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 1️⃣9️⃣ Kosten overzicht

### Minimale configuratie
- **TransIP VPS BladeVPS X1** (~€7/maand) - 1 CPU, 2GB RAM, 50GB SSD
- **Domein** (~€10/jaar)
- **Totaal:** ~€8-10/maand

### Aanbevolen configuratie
- **TransIP VPS BladeVPS X4** (~€15/maand) - 2 CPU, 4GB RAM, 80GB SSD
- **Domein** (~€10/jaar)
- **Backup opslag** (optioneel, ~€2/maand)
- **Totaal:** ~€17-20/maand

---

## 2️⃣0️⃣ Hulp nodig?

### Documentatie
- **Next.js:** https://nextjs.org/docs
- **Strapi:** https://docs.strapi.io
- **PM2:** https://pm2.keymetrics.io/docs
- **Nginx:** https://nginx.org/en/docs/

### TransIP Support
- **TransIP Help Center:** https://www.transip.nl/knowledgebase/
- **VPS Handleidingen:** https://www.transip.nl/knowledgebase/categorie/321-vps/

### Community
- **Next.js Discord:** https://nextjs.org/discord
- **Strapi Discord:** https://discord.strapi.io/

---

## ✅ Deployment Checklist

Gebruik deze checklist om te controleren of alles correct is ingesteld:

### Pre-deployment
- [ ] VPS aangeschaft bij TransIP
- [ ] Domein geregistreerd of gekoppeld
- [ ] DNS records ingesteld (A records voor @, www, api)
- [ ] Mollie account aangemaakt

### VPS Setup
- [ ] Ingelogd op VPS
- [ ] Systeem geüpdatet
- [ ] Firewall geconfigureerd (UFW)
- [ ] Deploy gebruiker aangemaakt
- [ ] Node.js v20 geïnstalleerd
- [ ] Yarn 4.5.0 geïnstalleerd
- [ ] PM2 geïnstalleerd
- [ ] PostgreSQL geïnstalleerd
- [ ] Database en gebruiker aangemaakt

### Project Setup
- [ ] Project gecloned/geüpload naar VPS
- [ ] Strapi .env geconfigureerd
- [ ] Next.js .env geconfigureerd
- [ ] Dependencies geïnstalleerd (yarn install)
- [ ] Strapi gebuild (yarn build)
- [ ] Next.js gebuild (yarn build)
- [ ] Database geseeded (yarn seed)

### Web Server
- [ ] Nginx geïnstalleerd
- [ ] Nginx configuratie aangemaakt
- [ ] Nginx configuratie getest
- [ ] SSL certificaten geïnstalleerd (Let's Encrypt)
- [ ] HTTPS redirect werkt

### Deployment
- [ ] PM2 ecosystem.config.js aangemaakt
- [ ] Applicaties gestart met PM2
- [ ] PM2 opgeslagen (pm2 save)
- [ ] PM2 startup configured
- [ ] Website bereikbaar via HTTPS
- [ ] API bereikbaar via HTTPS
- [ ] Strapi admin account aangemaakt

### Configuratie
- [ ] Strapi Base URL ingesteld
- [ ] Mollie API keys toegevoegd
- [ ] Mollie webhook URL geconfigureerd
- [ ] NextAuth configuratie getest
- [ ] Email configuratie getest (indien van toepassing)

### Beveiliging
- [ ] SSH key authentication ingesteld
- [ ] Wachtwoord login uitgeschakeld
- [ ] Sterke database wachtwoorden
- [ ] Unieke secrets gegenereerd
- [ ] Firewall actief
- [ ] SSL certificaten geldig

### Monitoring
- [ ] PM2 logs gecontroleerd
- [ ] Nginx logs gecontroleerd
- [ ] Database connectie getest
- [ ] Backup strategie ingesteld
- [ ] Auto-renewal SSL certificaten getest

### Testing
- [ ] Homepage laadt correct
- [ ] Login/registratie werkt
- [ ] Dashboard toegankelijk
- [ ] Betalingen werken (test mode)
- [ ] API calls werken
- [ ] Uploads werken

---

## 🎉 Klaar!

Je PitoApp draait nu live op je TransIP VPS! 

**Belangrijke URLs:**
- 🌐 **Frontend:** https://jouw-domein.nl
- 🔧 **Strapi Admin:** https://api.jouw-domein.nl/admin
- 📡 **API:** https://api.jouw-domein.nl/api

**Volgende stappen:**
1. Test alle functionaliteit grondig
2. Zet Mollie op live modus (wanneer klaar voor productie)
3. Configureer email verzending (indien nodig)
4. Monitor performance en errors
5. Maak regelmatig backups

Veel succes met je applicatie! 🚀
