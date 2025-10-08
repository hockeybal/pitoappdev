# PitoApp

![PitoApp](./pito_logo.png)

PitoApp is een moderne webapplicatie gebouwd met Next.js (frontend) en Strapi (CMS/backend). Het project omvat gebruikersauthenticatie, betalingsintegratie (Mollie), een dashboard, content management en meer. Ideaal voor SaaS-toepassingen met abonnementen en gebruikersbeheer.

Dit repository bevat:
- Een Strapi backend met aangepaste content-types, API's en data seeding
- Een Next.js frontend met moderne UI componenten, authenticatie en betalingsflows

## 🚀 Snel starten

### Vereisten
- Node.js >= 18
- Yarn of NPM
- PostgreSQL (voor productie) of SQLite (voor development)

### 1. Repository klonen

```bash
git clone https://github.com/hockeybal/pitoappdev.git
cd pitoappdev
```

### 2. Environment variabelen instellen

Kopieer de voorbeeld bestanden en vul ze in met je eigen waarden:

```bash
cp strapi/.env.example strapi/.env
cp next/.env.example next/.env
```

**Belangrijke env vars:**
- **Strapi (.env):**
  - `DATABASE_CLIENT`: postgres (of sqlite voor dev)
  - `DATABASE_URL`: Jouw database URL
  - `JWT_SECRET`: Unieke secret voor tokens
  - `ADMIN_JWT_SECRET`: Secret voor admin tokens

- **Next.js (.env):**
  - `NEXT_PUBLIC_API_URL`: URL naar je Strapi API (bijv. http://localhost:1337)
  - `WEBSITE_URL`: Jouw productie domein

### 3. Strapi starten

```bash
cd strapi
yarn install
yarn seed  # Laadt voorbeeld data
yarn develop  # Voor development
```

Strapi draait standaard op http://localhost:1337

### 4. Next.js starten

In een nieuwe terminal:

```bash
cd next
yarn install
yarn dev  # Voor development
```

Next.js draait op http://localhost:3000

## ✨ Features

### Gebruikersbeheer
- Authenticatie met NextAuth.js
- Gebruikersregistratie en login
- Dashboard voor ingelogde gebruikers
- Rolgebaseerde toegang

### Betalingen
- Integratie met Mollie API
- Abonnementen en eenmalige betalingen
- Pro-rated billing ondersteuning
- Betalingsstatus tracking

### Content Management
- Strapi CMS voor dynamische content
- Blog posts, producten, pagina's
- Media library voor afbeeldingen
- Internationalisatie (i18n) ondersteuning

### UI/UX
- Moderne design met Tailwind CSS
- Responsieve componenten
- Animaties en interacties
- Dark mode ondersteuning

### API's
- RESTful API via Strapi
- Webhooks voor betalingsupdates
- Email templates en verzending

## 🏗️ Project structuur

```
pitoappdev/
├── next/                 # Next.js frontend
│   ├── app/             # App router pages
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utilities en helpers
│   └── types/          # TypeScript types
├── strapi/              # Strapi backend
│   ├── src/
│   │   ├── api/        # Content types en routes
│   │   ├── plugins/    # Custom plugins
│   │   └── middlewares/# Custom middleware
│   └── config/         # Strapi configuratie
└── scripts/            # Utility scripts
```

## 🚀 Deployment

Voor productie deployment:

1. **Database opzetten:** PostgreSQL op je server
2. **Environment vars:** Stel productie waarden in
3. **Builden:**
   ```bash
   cd strapi && yarn build
   cd ../next && yarn build
   ```
4. **Starten:** Gebruik PM2 of Docker voor productie
5. **Reverse proxy:** Nginx voor SSL en routing

Zie de deployment gids voor gedetailleerde instructies.

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch: `git checkout -b feature/nieuwe-feature`
3. Commit je changes: `git commit -m 'Add nieuwe feature'`
4. Push naar de branch: `git push origin feature/nieuwe-feature`
5. Open een Pull Request

## 📝 Licentie

Dit project is privé eigendom. Alle rechten voorbehouden.

## 📞 Contact

Voor vragen of ondersteuning, neem contact op met het development team.
