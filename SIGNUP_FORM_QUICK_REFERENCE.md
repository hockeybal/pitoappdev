# 🚀 Quick Reference - Inschrijfformulier

## ⚡ Meest Gebruikte Commando's

```bash
# Start beide servers
cd strapi && npm run develop    # Terminal 1
cd next && npm run dev          # Terminal 2

# Check logs bij problemen
# Kijk in de terminal waar server draait

# Herstart na .env wijzigingen
# Stop server: Ctrl+C
# Start opnieuw: npm run develop / npm run dev

# TypeScript errors fixen
cd next && rm -rf .next && npm run dev
```

---

## 📍 Belangrijke URLs

| URL | Gebruik |
|-----|---------|
| `http://localhost:1337/admin` | Strapi admin panel |
| `http://localhost:3000` | Next.js website |
| `http://localhost:1337/api/leads` | Leads API endpoint |
| `https://app.pipedrive.com` | Pipedrive dashboard |

---

## 🔑 Environment Variabelen

**Locatie:** `/next/.env.local`

```bash
PIPEDRIVE_API_TOKEN_ZAKELIJK=abc123...
STRAPI_API_TOKEN=xyz789...  # Optioneel
```

**Let op:** Particuliere leads gaan NIET naar Pipedrive, alleen zakelijke leads!

**Pipedrive token ophalen:**
Pipedrive → Settings → Personal Preferences → API → Copy token

---

## ⚙️ Formulier Configuratie

**In Strapi Admin:**
Content Manager → Page → Dynamic Zone → Add Component → Signup Form

### Zakelijk Formulier
```
Form Type: zakelijk ✓
Show Company Field: ✓
Show Phone Field: ✓
Pipedrive Enabled: ✓
```

### Particulier Formulier
```
Form Type: particulier ✓
Show Company Field: ✗
Show Phone Field: ✓ (optioneel)
Pipedrive Enabled: ✓
```

---

## 📂 Belangrijke Bestanden

| Bestand | Functie |
|---------|---------|
| `/next/components/dynamic-zone/signup-form.tsx` | React formulier component |
| `/next/app/api/leads/submit/route.ts` | API endpoint voor submit |
| `/next/lib/pipedrive.ts` | Pipedrive integratie |
| `/strapi/src/api/lead/content-types/lead/schema.json` | Lead data model |
| `/strapi/src/components/dynamic-zone/signup-form.json` | CMS component schema |

---

## 🔍 Troubleshooting One-Liners

```bash
# Formulier niet zichtbaar?
# → Check of pagina is gepubliceerd in Strapi
# → Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

# Pipedrive error?
# → Check tokens in .env.local
# → Herstart Next.js server

# Lead niet opgeslagen?
# → Check Strapi permissies: Public role → Lead → create ✓
# → Check browser console (F12)

# TypeScript errors?
cd next && rm -rf .next && npm run dev
```

---

## 📊 Data Bekijken

### Leads in Strapi
```
Strapi Admin → Content Manager → Lead
```

### Filteren
```
Filters (rechtsboven):
├─ Lead Type: zakelijk / particulier
├─ Pipedrive Sync Status: synced / failed / pending
└─ Created At: datum range
```

### Exporteren
```
Select leads → Export button → Download CSV
```

---

## 🎨 Styling Aanpassen

**Bestand:** `/next/components/dynamic-zone/signup-form.tsx`

```tsx
// Kleur van focus ring (input velden)
focus:ring-brand-blue → focus:ring-jouw-kleur

// Button variant
<Button variant="primary" → variant="outline"

// Background
className="bg-white" → className="bg-gradient-to-br from-..."
```

---

## ✅ Permissies Checklist

### Strapi - Public Role
Settings → Users & Permissions → Roles → Public

Lead content type:
- [x] create
- [x] find  
- [x] findOne

---

## 🔄 Formulier Aan/Uit

### Toevoegen
```
Strapi → Page → Dynamic Zone → Add Component → Signup Form
→ Configureer → Save → Publish
```

### Verwijderen
```
Strapi → Page → Dynamic Zone → 🗑️ Delete component
→ Save → Publish
```

---

## 📞 Waar te Beginnen Bij Problemen

1. ✅ Check beide servers draaien
2. ✅ Check browser console (F12)
3. ✅ Check terminal logs (waar servers draaien)
4. ✅ Check `.env.local` configuratie
5. ✅ Check Strapi permissies
6. ✅ Lees [SIGNUP_FORM_HANDLEIDING.md](./SIGNUP_FORM_HANDLEIDING.md)

---

## 🎯 Veelvoorkomende Taken

### Nieuwe lead type toevoegen
**Niet nodig!** Gebruik gewoon formType parameter:
- `zakelijk` → Gebruikt PIPEDRIVE_API_TOKEN_ZAKELIJK
- `particulier` → Gebruikt PIPEDRIVE_API_TOKEN_PARTICULIER

### Veld toevoegen aan formulier
1. Voeg veld toe aan `/next/components/dynamic-zone/signup-form.tsx`
2. Update `/strapi/src/api/lead/content-types/lead/schema.json`
3. Herstart Strapi
4. Voeg veld toe aan Pipedrive sync in `/next/lib/pipedrive.ts`

### Verschillende Pipedrive pipelines
Gebruik aparte API tokens:
```bash
PIPEDRIVE_API_TOKEN_ZAKELIJK=token-van-zakelijk-account
PIPEDRIVE_API_TOKEN_PARTICULIER=token-van-particulier-account
```

### Email notificaties toevoegen
Zie [SIGNUP_FORM_HANDLEIDING.md](./SIGNUP_FORM_HANDLEIDING.md) → Extra Features

---

## 📚 Documentatie Overzicht

| Document | Wanneer Gebruiken |
|----------|-------------------|
| **[SIGNUP_FORM_SETUP.md](./SIGNUP_FORM_SETUP.md)** | Eerste keer setup (20 min) |
| **[SIGNUP_FORM_HANDLEIDING.md](./SIGNUP_FORM_HANDLEIDING.md)** | Volledige gids + troubleshooting |
| **[SIGNUP_FORM_ARCHITECTURE.md](./SIGNUP_FORM_ARCHITECTURE.md)** | Begrijp hoe het werkt (tech) |
| **[SIGNUP_FORM_README.md](./SIGNUP_FORM_README.md)** | Overzicht + best practices |
| **SIGNUP_FORM_QUICK_REFERENCE.md** | Dit bestand - snelle referentie |

---

## 🎉 Succes!

**Print deze pagina uit of bookmark voor snelle toegang!**
