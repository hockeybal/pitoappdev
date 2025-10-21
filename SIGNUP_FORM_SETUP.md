# ⚡ Snelle Setup Checklist - Inschrijfformulier

## 1️⃣ Environment Variabelen (5 min)

**Bestand: `/next/.env.local`**

```bash
# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=                    # Optioneel, maak aan in stap 3

# Pipedrive API Token (ALLEEN voor zakelijke leads)
# Particuliere leads worden ALLEEN in de database opgeslagen
PIPEDRIVE_API_TOKEN_ZAKELIJK=        # Haal op uit Pipedrive Settings → API
```

---

## 2️⃣ Strapi Starten (2 min)

```bash
cd strapi
npm run develop
```

✅ Strapi opent automatisch op: `http://localhost:1337/admin`

---

## 3️⃣ Strapi Permissies Instellen (3 min)

1. Ga naar **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Scroll naar **Lead**
3. Vink aan:
   - ✅ `create`
   - ✅ `find`
   - ✅ `findOne`
4. **Save**

**Optioneel - API Token aanmaken:**
1. **Settings** → **API Tokens** → **Create new API Token**
2. Name: `Next.js App`
3. Type: `Full access` (dev) of `Custom` (prod)
4. Bij Custom: geef Lead rechten
5. **Save** en kopieer token naar `.env.local`

---

## 4️⃣ Next.js Starten (2 min)

```bash
cd next
npm run dev
```

✅ Next.js opent op: `http://localhost:3000`

---

## 5️⃣ Formulier Toevoegen (5 min)

1. Ga naar Strapi admin: `http://localhost:1337/admin`
2. **Content Manager** → **Page** → Kies een pagina
3. **Dynamic Zone** → **Add component** → **Signup Form**
4. Vul in:

**Voor Zakelijk:**
```
Heading: "Zakelijke Klanten - Schrijf je in"
Form Type: zakelijk
Show Company Field: ✓
Show Phone Field: ✓
Show Message Field: ✓
Pipedrive Enabled: ✓
```

**Voor Particulier:**
```
Heading: "Schrijf je in voor vroege toegang"
Form Type: particulier
Show Company Field: ✗
Show Phone Field: ✓
Show Message Field: ✓
Pipedrive Enabled: ✓
```

5. **Save** + **Publish**

---

## 6️⃣ Test het Formulier (3 min)

1. Ga naar de pagina in je browser
2. Vul formulier in met test data
3. Verstuur
4. ✅ Check success message
5. ✅ Check Strapi admin: **Content Manager** → **Lead**
6. ✅ Check Pipedrive: nieuwe lead aangemaakt?

---

## ✅ Klaar!

**Totale setup tijd: ~20 minuten**

### Volgende stappen:
- 📖 Lees de [volledige handleiding](./SIGNUP_FORM_HANDLEIDING.md) voor meer opties
- 🎨 Pas de styling aan in `/next/components/dynamic-zone/signup-form.tsx`
- 📧 Voeg email notificaties toe
- 📊 Monitor je leads in Strapi

---

## 🆘 Problemen?

| Probleem | Oplossing |
|----------|-----------|
| Formulier niet zichtbaar | Pagina gepubliceerd? Next.js herstart? Cache refresh (Cmd+Shift+R) |
| Pipedrive error | Check API tokens in `.env.local`, herstart Next.js |
| Lead niet in Strapi | Check permissies (stap 3), check browser console (F12) |
| TypeScript errors | `cd next && rm -rf .next && npm run dev` |

Meer help? Zie [SIGNUP_FORM_HANDLEIDING.md](./SIGNUP_FORM_HANDLEIDING.md) → Troubleshooting

---

## 🎯 Snelle Commands

```bash
# Start beide servers tegelijk (in aparte terminals)
cd strapi && npm run develop
cd next && npm run dev

# Check logs voor errors
# Terminal waar Strapi/Next draait

# Herstart bij environment variabele wijzigingen
# Stop server (Ctrl+C) en start opnieuw
```
