# 🎯 Inschrijfformulier met Pipedrive Integratie - Overzicht

## ✅ Wat is er gebouwd?

Een **volledig CMS-gestuurde inschrijfoplossing** voor tijdelijk gebruik totdat je dashboard klaar is.

### Features:
- ✅ **2 Formulier types**: Zakelijk & Particulier
- ✅ **Strapi opslag**: Alle leads worden lokaal opgeslagen in database
- ✅ **Pipedrive integratie**: Automatische sync naar Pipedrive
- ✅ **Volledig configureerbaar**: Via Strapi CMS - geen code wijzigingen nodig
- ✅ **Gemakkelijk aan/uit te zetten**: Toevoegen/verwijderen via Dynamic Zone
- ✅ **Verschillende API's**: Aparte Pipedrive tokens voor zakelijk vs particulier
- ✅ **Foutafhandeling**: Leads worden altijd opgeslagen, ook als Pipedrive faalt

---

## 📁 Aangemaakte Bestanden

### Strapi (Backend)
```
strapi/src/
├── api/lead/
│   └── content-types/lead/
│       └── schema.json                 # Lead content type definitie
└── components/dynamic-zone/
    └── signup-form.json                # Dynamic zone component schema
```

### Next.js (Frontend)
```
next/
├── app/api/leads/submit/
│   └── route.ts                        # API endpoint voor lead opslag
├── components/dynamic-zone/
│   ├── signup-form.tsx                 # React formulier component
│   └── manager.tsx                     # Updated met signup-form
└── lib/
    └── pipedrive.ts                    # Pipedrive API integratie
```

### Documentatie
```
├── SIGNUP_FORM_HANDLEIDING.md          # Uitgebreide handleiding
├── SIGNUP_FORM_SETUP.md                # Snelle setup checklist (20 min)
└── next/.env.example                   # Updated met Pipedrive tokens
```

---

## 🚀 Snelle Start

### 1. Installatie (eerste keer)
Geen installatie nodig! Alle code is al toegevoegd.

### 2. Configuratie (5 minuten)

**Voeg toe aan `/next/.env.local`:**
```bash
# Pipedrive API Tokens
PIPEDRIVE_API_TOKEN_ZAKELIJK=jouw-zakelijk-token
PIPEDRIVE_API_TOKEN_PARTICULIER=jouw-particulier-token
```

Haal je Pipedrive tokens op:
1. Log in op Pipedrive
2. Settings → Personal Preferences → API
3. Kopieer je Personal API token

### 3. Start servers
```bash
# Terminal 1: Strapi
cd strapi && npm run develop

# Terminal 2: Next.js
cd next && npm run dev
```

### 4. Strapi permissies instellen
1. Ga naar `http://localhost:1337/admin`
2. Settings → Users & Permissions → Roles → Public
3. Bij **Lead**: vink aan `create`, `find`, `findOne`
4. Save

### 5. Formulier toevoegen
1. Strapi admin → Content Manager → Page (of waar je wilt)
2. Dynamic Zone → Add component → **Signup Form**
3. Configureer (zie handleiding)
4. Save + Publish

**Klaar!** 🎉

---

## 📖 Documentatie

| Document | Gebruik |
|----------|---------|
| **[SIGNUP_FORM_SETUP.md](./SIGNUP_FORM_SETUP.md)** | ⚡ Snelle setup (20 min) - Start hier! |
| **[SIGNUP_FORM_HANDLEIDING.md](./SIGNUP_FORM_HANDLEIDING.md)** | 📚 Uitgebreide handleiding met alle opties & troubleshooting |

---

## 🎨 Configuratie Opties

Via Strapi CMS kun je instellen:

| Optie | Beschrijving |
|-------|--------------|
| **Heading** | Hoofdtitel van formulier |
| **Sub heading** | Ondertitel/uitleg |
| **Form Type** | `zakelijk` of `particulier` (bepaalt welke Pipedrive API) |
| **Show Company Field** | Bedrijfsnaam veld tonen (automatisch verplicht bij zakelijk) |
| **Show Phone Field** | Telefoonnummer veld tonen |
| **Show Message Field** | Vrij tekstveld tonen |
| **Button Text** | Tekst op verstuur knop |
| **Success Message** | Bericht na succesvolle inschrijving |
| **Background Color** | `white`, `gray`, of `gradient` |
| **Pipedrive Enabled** | Sync naar Pipedrive aan/uit |

---

## 🔄 Data Flow

```
Gebruiker vult formulier in
    ↓
Next.js API (/api/leads/submit)
    ↓
├─→ Opslaan in Strapi (altijd)
│   └─→ Lead aangemaakt met status
│
└─→ Sync naar Pipedrive (indien enabled)
    ├─→ Maak Organization (als bedrijf ingevuld)
    ├─→ Maak Person
    ├─→ Maak Lead
    └─→ Voeg Note toe (als bericht ingevuld)
```

Als Pipedrive sync faalt:
- Lead wordt **wel** opgeslagen in Strapi
- Status wordt `failed` met error message
- Je kunt handmatig naar Pipedrive sturen

---

## 📊 Leads Beheren

### In Strapi
- **Content Manager → Lead**: Bekijk alle inschrijvingen
- **Filteren**: Op type (zakelijk/particulier) of sync status
- **Exporteren**: Naar CSV voor analyse

### In Pipedrive
Leads verschijnen automatisch met:
- Person (naam + email + telefoon)
- Organization (indien bedrijf ingevuld)
- Lead (met titel: "Bedrijf - Naam" of "Naam")
- Note (indien bericht ingevuld)

---

## 🎯 Use Cases

### Scenario 1: Beide formulieren op homepage
```
Dynamic Zone:
1. Hero sectie
2. Signup Form (type: particulier)
3. Features sectie
4. Signup Form (type: zakelijk)
5. Testimonials
```

### Scenario 2: Aparte landingspagina's
- `/zakelijk` pagina → Signup Form (type: zakelijk)
- `/early-access` pagina → Signup Form (type: particulier)

### Scenario 3: Tijdelijk uitschakelen
- Verwijder gewoon de component uit Dynamic Zone
- Data blijft behouden in Strapi

---

## 🔒 Security & Best Practices

### ✅ Al geïmplementeerd:
- Email validatie (regex)
- Required velden check
- Strapi API permissions (public create)
- Environment variabelen voor tokens
- Error handling & logging
- Pipedrive sync status tracking

### 🔐 Voor productie:
1. **Gebruik Strapi API Token** in plaats van public access
2. **Rate limiting** toevoegen (bijv. max 5 submits/IP/uur)
3. **HTTPS** verplicht (SSL certificaat)
4. **GDPR compliance**: Privacy statement link
5. **Spam bescherming**: Honeypot veld of reCAPTCHA

---

## 🗑️ Later Verwijderen

Wanneer je dashboard klaar is:

### Stap 1: Formulier uitschakelen
- Verwijder uit Dynamic Zone in Strapi

### Stap 2: Data exporteren
```bash
# In Strapi admin
Content Manager → Lead → Select all → Export
```

### Stap 3: Optioneel opruimen (alleen als je het nooit meer nodig hebt)
```bash
# Verwijder code bestanden
rm next/components/dynamic-zone/signup-form.tsx
rm next/app/api/leads/submit/route.ts
rm next/lib/pipedrive.ts
rm strapi/src/components/dynamic-zone/signup-form.json
```

**⚠️ Verwijder NIET** `strapi/src/api/lead/` - je wilt de lead data behouden!

---

## 🐛 Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| Formulier niet zichtbaar | Pagina gepubliceerd? Next.js herstart? Cache refresh? |
| Pipedrive error | Check API tokens in `.env.local`, herstart Next.js |
| Lead niet in Strapi | Check permissies (Public role → Lead → create) |
| TypeScript errors | `cd next && rm -rf .next && npm run dev` |

Meer hulp? Zie **[SIGNUP_FORM_HANDLEIDING.md](./SIGNUP_FORM_HANDLEIDING.md)** → Troubleshooting sectie

---

## 📞 Support Checklist

Bij problemen, check:
1. ✅ Beide servers draaien (Strapi + Next.js)?
2. ✅ Environment variabelen correct ingesteld?
3. ✅ Strapi permissies voor Lead content type?
4. ✅ Pagina gepubliceerd in Strapi?
5. ✅ Browser console errors (F12)?
6. ✅ Pipedrive API tokens geldig?

---

## 🎉 Succesverhaal

**Wat je nu hebt:**
- Een professioneel inschrijfformulier
- Volledig CMS-gestuurd (geen code wijzigingen nodig)
- Automatische Pipedrive sync
- Aparte handling voor zakelijk vs particulier
- Lokale backup van alle leads
- Gemakkelijk aan/uit te zetten
- Perfect als tijdelijke oplossing

**Next steps:**
- Voeg formulieren toe aan je pagina's
- Test beide types (zakelijk + particulier)
- Monitor je eerste leads
- Pas styling aan naar jouw huisstijl
- Bouw je dashboard verder
- Vervang formulieren door dashboard wanneer klaar

---

**Veel succes! 🚀**
