# 📋 Handleiding: Inschrijfformulier met Pipedrive Integratie

## 📖 Inhoudsopgave
1. [Overzicht](#overzicht)
2. [Environment Variabelen Instellen](#environment-variabelen)
3. [Strapi Configuratie](#strapi-configuratie)
4. [Formulier Toevoegen aan Pagina](#formulier-toevoegen)
5. [Formulier Verwijderen](#formulier-verwijderen)
6. [Leads Beheren](#leads-beheren)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overzicht

Deze oplossing biedt:
- ✅ **2 Formulier types**: Zakelijk & Particulier
- ✅ **Opslag in Strapi**: Alle inschrijvingen worden lokaal opgeslagen
- ✅ **Pipedrive Integratie**: Automatisch doorsturen naar Pipedrive
- ✅ **Volledig CMS-gestuurd**: Aanpasbaar via Strapi admin panel
- ✅ **Gemakkelijk aan/uit te zetten**: Voeg toe of verwijder via dynamic zone
- ✅ **Tijdelijke oplossing**: Later vervangen door volledig dashboard

---

## 🔧 Environment Variabelen

### Stap 1: Pipedrive API Tokens verkrijgen

1. Log in op **Pipedrive**
2. Ga naar **Settings** → **Personal Preferences** → **API**
3. Kopieer je **Personal API token**
4. Als je aparte pipelines/accounts hebt voor zakelijk en particulier, verkrijg dan beide tokens

### Stap 2: Environment variabelen toevoegen

**Next.js** - Voeg toe aan `/next/.env.local`:

```bash
# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=jouw-strapi-api-token

# Pipedrive API Token (ALLEEN voor zakelijke leads)
# Particuliere leads worden ALLEEN in de database opgeslagen, niet in Pipedrive
PIPEDRIVE_API_TOKEN_ZAKELIJK=jouw-zakelijk-api-token-hier
```

**Strapi** - Voeg toe aan `/strapi/.env`:

```bash
# Als je een API token wilt gebruiken voor Next.js → Strapi communicatie
# Genereer deze via Strapi Admin → Settings → API Tokens → Create new API Token
# Type: Full access (voor development), Custom voor production
```

### Stap 3: API Token aanmaken in Strapi (optioneel maar aanbevolen)

1. Start Strapi: `cd strapi && npm run develop`
2. Ga naar Strapi admin panel: `http://localhost:1337/admin`
3. Navigeer naar **Settings** (⚙️) → **API Tokens**
4. Klik op **Create new API Token**
5. Vul in:
   - **Name**: `Next.js App`
   - **Token type**: `Full access` (development) of `Custom` (production)
   - **Token duration**: `Unlimited`
6. Bij Custom: geef **Create** en **Find** rechten aan **Lead**
7. Kopieer de token en plak in `.env.local` bij `STRAPI_API_TOKEN`

---

## 🗄️ Strapi Configuratie

### Stap 1: Database migratie uitvoeren

De bestanden zijn al aangemaakt. Nu moet Strapi deze inlezen:

```bash
cd strapi
npm run develop
```

Strapi zal automatisch de nieuwe content types detecteren en de database updaten.

### Stap 2: Permissies instellen voor Lead API

1. Ga naar Strapi admin: `http://localhost:1337/admin`
2. Navigeer naar **Settings** → **Users & Permissions Plugin** → **Roles**
3. Klik op **Public** role
4. Scroll naar **Lead** en vink aan:
   - ✅ `create` (zodat het formulier leads kan aanmaken)
   - ✅ `find` (om leads te kunnen ophalen)
   - ✅ `findOne` (om individuele leads te kunnen bekijken)
5. Klik op **Save**

> **⚠️ Voor productie**: Maak een aparte API token aan en gebruik die in plaats van public access.

### Stap 3: Controleer of Lead content type beschikbaar is

1. In Strapi admin, kijk in de linker sidebar
2. Je zou nu **Content Manager** → **Lead** moeten zien
3. Klik erop - je ziet een lege lijst (normaal, nog geen leads)

---

## ➕ Formulier Toevoegen aan Pagina

### Optie A: Zakelijk Formulier toevoegen

1. Ga naar Strapi admin: `http://localhost:1337/admin`
2. Navigeer naar **Content Manager** → **Page** (of waar je het formulier wilt)
3. Open de gewenste pagina of maak een nieuwe aan
4. Scroll naar het **Dynamic Zone** veld
5. Klik op **Add component** → **Signup Form**
6. Configureer het formulier:

```
Heading: "Zakelijke Klanten - Schrijf je in"
Sub heading: "Ontdek onze zakelijke oplossingen"
Form Type: "zakelijk" ✓
Show Company Field: ✓ Ja
Show Phone Field: ✓ Ja
Show Message Field: ✓ Ja
Button Text: "Aanvraag versturen"
Success Message: "Bedankt! Onze sales afdeling neemt binnen 24 uur contact met je op."
Background Color: "white" of "gradient"
Pipedrive Enabled: ✓ Ja
```

7. Klik op **Save** (rechtsboven)
8. **Publiceer** de pagina

### Optie B: Particulier Formulier toevoegen

Zelfde stappen als hierboven, maar met:

```
Heading: "Schrijf je in voor vroege toegang"
Sub heading: "Wees de eerste die ons product mag testen"
Form Type: "particulier" ✓
Show Company Field: ✗ Nee
Show Phone Field: ✓ Ja (optioneel)
Show Message Field: ✓ Ja
Button Text: "Schrijf me in"
Success Message: "Super! We houden je op de hoogte."
Background Color: "gradient"
Pipedrive Enabled: ✓ Ja
```

### Beide formulieren op één pagina?

Ja! Voeg gewoon **2x de Signup Form component** toe met verschillende configuraties:
1. Eerste: Form Type = "zakelijk"
2. Tweede: Form Type = "particulier"

---

## 🗑️ Formulier Verwijderen

Het is super simpel om het formulier te verwijderen:

1. Ga naar de pagina in Strapi admin
2. Scroll naar de **Dynamic Zone**
3. Klik op het **🗑️ prullenbak icoon** bij de Signup Form component
4. Klik op **Save**
5. **Publiceer** de pagina

Het formulier is nu weg van je website!

---

## 📊 Leads Beheren

### Leads bekijken in Strapi

1. Ga naar **Content Manager** → **Lead**
2. Hier zie je alle inschrijvingen met:
   - Naam
   - Email
   - Type (zakelijk/particulier)
   - Pipedrive sync status
   - Aanmaak datum

### Filteren

Klik op **Filters** (rechtsboven) om te filteren op:
- Lead Type (zakelijk/particulier)
- Pipedrive Sync Status (synced/failed/pending)
- Datum

### Pipedrive Sync Status

Elke lead heeft een status:
- **🟢 synced**: Succesvol naar Pipedrive gestuurd
- **🔴 failed**: Fout bij synchronisatie (zie error message)
- **🟡 pending**: Nog niet gesynchroniseerd (komt bijna niet voor)

Als een lead **failed** is:
1. Bekijk de `pipedriveSyncError` voor details
2. Check je Pipedrive API tokens in `.env.local`
3. Je kunt de lead handmatig toevoegen aan Pipedrive

### Exporteren naar CSV

1. Selecteer leads (✓ checkboxes)
2. Klik op **Export** (rechtsboven)
3. Download CSV bestand

---

## 🎨 Styling Aanpassen

Als je de vormgeving wilt aanpassen, bewerk:
`/next/components/dynamic-zone/signup-form.tsx`

Bijvoorbeeld de primaire kleur wijzigen:
- Zoek naar `focus:ring-brand-blue`
- Vervang met je eigen kleur class

---

## 🔄 Van Tijdelijk naar Permanent Dashboard

Wanneer je dashboard klaar is:

### Stap 1: Formulier uitschakelen
- Verwijder de Signup Form component uit de Dynamic Zone (zie [Formulier Verwijderen](#formulier-verwijderen))

### Stap 2: Data behouden
- Alle bestaande leads blijven in Strapi
- Je kunt ze exporteren of via API gebruiken in je dashboard

### Stap 3: Optioneel opruimen
Als je de code wilt verwijderen:
```bash
# Verwijder bestanden (ALLEEN als je het niet meer nodig hebt!)
rm /next/components/dynamic-zone/signup-form.tsx
rm /next/app/api/leads/submit/route.ts
rm /next/lib/pipedrive.ts
rm /strapi/src/components/dynamic-zone/signup-form.json
```

**⚠️ Verwijder NIET het Lead content type** - die data wil je behouden!

---

## 🐛 Troubleshooting

### Formulier wordt niet getoond
- ✅ Check of je de pagina hebt gepubliceerd in Strapi
- ✅ Check of Next.js draait: `cd next && npm run dev`
- ✅ Check browser console voor errors (F12)
- ✅ Ververs de pagina (Ctrl/Cmd + Shift + R)

### "Pipedrive API error" in console
```bash
# Check je environment variabelen
cd next
cat .env.local | grep PIPEDRIVE

# Tokens moeten beginnen met iets als: abc123def456...
# Niet leeg zijn of "jouw-token-hier"
```

### Leads worden niet opgeslagen in Strapi
- ✅ Check of Strapi draait: `http://localhost:1337/admin`
- ✅ Check permissies: Settings → Roles → Public → Lead moet `create` hebben
- ✅ Check `.env.local` voor `STRAPI_API_TOKEN` (als je die gebruikt)

### Pipedrive sync failed
In Strapi, bekijk de lead:
- Kijk naar `pipedriveSyncError` veld
- Veelvoorkomende fouten:
  - **"API token not configured"**: Voeg tokens toe aan `.env.local`
  - **"Unauthorized"**: API token is onjuist
  - **"Person already exists"**: Email bestaat al in Pipedrive (geen probleem)

### Formulier verstuurt maar geen response
- Open browser DevTools (F12) → Network tab
- Verstuur formulier
- Kijk naar `/api/leads/submit` request
- Check response voor error details

### TypeScript errors
```bash
cd next
npm run type-check
```

Als er errors zijn met types, herstart VS Code of run:
```bash
# Verwijder TypeScript cache
rm -rf .next
npm run dev
```

---

## 🚀 Testing Checklist

Voordat je live gaat:

### Development
- [ ] Strapi draait (`npm run develop`)
- [ ] Next.js draait (`npm run dev`)
- [ ] Environment variabelen ingesteld (`.env.local`)
- [ ] Formulier zichtbaar op pagina
- [ ] Formulier invullen en versturen werkt
- [ ] Lead verschijnt in Strapi
- [ ] Lead verschijnt in Pipedrive
- [ ] Success message wordt getoond
- [ ] Error handling werkt (probeer ongeldige email)

### Production
- [ ] Environment variabelen ingesteld op server
- [ ] Strapi draait en is toegankelijk
- [ ] Next.js deployment succesvol
- [ ] CORS instellingen correct in Strapi
- [ ] SSL certificaat actief (HTTPS)
- [ ] Pipedrive API tokens werken in productie
- [ ] Test formulier op production URL

---

## 📝 Extra Features (Optioneel)

### Email notificaties toevoegen

Wil je een email ontvangen bij elke nieuwe lead? Voeg dit toe aan `/next/app/api/leads/submit/route.ts`:

```typescript
// Na succesvolle Strapi opslag
await fetch('/api/send-notification', {
  method: 'POST',
  body: JSON.stringify({
    to: 'jouw-email@bedrijf.nl',
    subject: `Nieuwe ${formType} lead: ${body.firstName} ${body.lastName}`,
    text: `Nieuwe inschrijving via website...\n\n${JSON.stringify(body, null, 2)}`
  })
});
```

### Google Analytics tracking

Voeg toe aan `signup-form.tsx` na succesvolle submit:

```typescript
// In handleSubmit, na setIsSuccess(true)
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'form_submission', {
    event_category: 'Lead',
    event_label: formType,
  });
}
```

---

## 🎓 Tips & Best Practices

1. **Test beide formulier types** voordat je live gaat
2. **Monitor de eerste week** - check of leads correct binnenkomen
3. **Backup je data** - export leads regelmatig uit Strapi
4. **Gebruik verschillende Pipedrive pipelines** voor zakelijk vs particulier
5. **Personaliseer de messages** - pas de teksten aan naar jouw tone of voice
6. **GDPR compliance** - voeg privacy statement link toe
7. **Rate limiting** overwegen - voorkom spam (bijv. max 5 submits per IP per uur)

---

## 📞 Support

Bij vragen of problemen:
1. Check eerst deze handleiding + Troubleshooting sectie
2. Check browser console (F12) voor errors
3. Check Strapi logs in terminal
4. Check Pipedrive API status: https://status.pipedrive.com/

---

**Succes met je inschrijfformulieren! 🎉**
