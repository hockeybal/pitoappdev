# 📊 Inschrijfformulier - Data Flow Overzicht

## 🔄 Hoe werkt de data opslag?

### Zakelijke Leads (B2B)
```
Gebruiker vult zakelijk formulier in
              ↓
    POST /api/leads/submit
              ↓
    ┌─────────────────────┐
    │  1. Validatie       │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │  2. Pipedrive Sync  │ ← ACTIEF voor zakelijk
    │     ✅ Gesynchroniseerd
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │  3. Strapi Opslag   │
    │     ✅ Opgeslagen
    │     pipedriveSyncStatus: "synced"
    │     pipedriveId: "12345"
    └─────────────────────┘
              ↓
         Success!
```

### Particuliere Leads (B2C)
```
Gebruiker vult particulier formulier in
              ↓
    POST /api/leads/submit
              ↓
    ┌─────────────────────┐
    │  1. Validatie       │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │  2. Pipedrive Sync  │ ← OVERGESLAGEN voor particulier
    │     ⏭️ Niet uitgevoerd
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │  3. Strapi Opslag   │
    │     ✅ Opgeslagen
    │     pipedriveSyncStatus: "pending"
    │     pipedriveId: null
    └─────────────────────┘
              ↓
         Success!
```

## 💾 Database Overzicht

### Strapi - Alle leads worden opgeslagen

**Content Manager → Lead**

| ID | Naam | Email | Type | Pipedrive Status | Pipedrive ID |
|----|------|-------|------|------------------|--------------|
| 1 | Jan de Vries | jan@bedrijf.nl | **zakelijk** | ✅ synced | 12345 |
| 2 | Emma Jansen | emma@gmail.com | **particulier** | ⏭️ pending | null |
| 3 | Piet Bakker | piet@company.nl | **zakelijk** | ✅ synced | 12346 |
| 4 | Lisa de Jong | lisa@hotmail.com | **particulier** | ⏭️ pending | null |

### Pipedrive - Alleen zakelijke leads

**Pipeline: Business Leads**

| Lead ID | Naam | Organization | Status |
|---------|------|--------------|--------|
| 12345 | Jan de Vries | Bedrijf BV | New |
| 12346 | Piet Bakker | Company BV | New |

**Let op:** Emma en Lisa staan NIET in Pipedrive - alleen in de Strapi database.

## ⚙️ Environment Variabelen

**Je hebt maar 1 Pipedrive token nodig!**

```bash
# /next/.env.local

# Pipedrive (alleen voor zakelijk)
PIPEDRIVE_API_TOKEN_ZAKELIJK=abc123def456...

# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=xyz789...  # Optioneel
```

## 🎯 Formulier Configuratie

### Zakelijk Formulier
```
In Strapi CMS:
├─ Form Type: "zakelijk"
├─ Show Company Field: ✓
├─ Pipedrive Enabled: ✓ (wordt gebruikt!)
└─ Resultaat: Opgeslagen in Strapi + Pipedrive
```

### Particulier Formulier
```
In Strapi CMS:
├─ Form Type: "particulier"
├─ Show Company Field: ✗
├─ Pipedrive Enabled: ✓ of ✗ (maakt niet uit!)
└─ Resultaat: ALLEEN opgeslagen in Strapi
```

## 📝 Code Logica

**In `/next/app/api/leads/submit/route.ts`:**

```typescript
// Sync naar Pipedrive ALLEEN voor zakelijke leads
if (body.leadType === 'zakelijk' && body.pipedriveEnabled !== false) {
  // ✅ Zakelijk → naar Pipedrive
  await syncLeadToPipedrive({ ... });
} else if (body.leadType === 'particulier') {
  // ⏭️ Particulier → skip Pipedrive
  console.log('Particuliere lead - alleen database');
}

// Altijd opslaan in Strapi (beide types)
await fetch(`${STRAPI_URL}/api/leads`, { ... });
```

## 🔍 Leads Filteren in Strapi

### Alleen zakelijke leads (met Pipedrive sync)
```
Filters:
├─ Lead Type: zakelijk
└─ Pipedrive Sync Status: synced
```

### Alleen particuliere leads (database only)
```
Filters:
├─ Lead Type: particulier
└─ Pipedrive Sync Status: pending
```

## 💡 Waarom deze aanpak?

### Voordelen:
✅ **Privacy**: Particuliere klanten staan niet in je CRM  
✅ **Simpeler**: Maar 1 Pipedrive token nodig  
✅ **Flexibel**: Alle data nog steeds in Strapi  
✅ **Sales focus**: Pipedrive alleen voor B2B sales  
✅ **Cost efficient**: Geen Pipedrive seats voor particulieren  

### Gebruik cases:
- **Zakelijk formulier**: Voor bedrijven die je wilt benaderen via sales team
- **Particulier formulier**: Voor vroege toegang/waitlist van eindgebruikers

## 🎛️ Later Pipedrive toch activeren voor particulier?

Wil je later toch particuliere leads naar Pipedrive? Pas dit aan:

**In `/next/app/api/leads/submit/route.ts`:**

```typescript
// Verander van:
if (body.leadType === 'zakelijk' && body.pipedriveEnabled !== false) {

// Naar:
if (body.pipedriveEnabled !== false) {
```

En voeg dan een tweede token toe aan `.env.local`:
```bash
PIPEDRIVE_API_TOKEN_ZAKELIJK=...
PIPEDRIVE_API_TOKEN_PARTICULIER=...
```

## 📊 Rapportage Mogelijkheden

### In Strapi:
- Totaal aantal leads: `Content Manager → Lead → Alle entries`
- Zakelijke leads: Filter op `leadType: zakelijk`
- Particuliere leads: Filter op `leadType: particulier`
- Export naar CSV voor analyse

### In Pipedrive:
- Alleen zakelijke leads zichtbaar
- Gebruik Pipedrive's sales pipeline tracking
- Automatische follow-ups instellen

---

**Dit geeft je het beste van beide werelden:** 🎯
- Zakelijke leads in je CRM voor sales
- Particuliere leads in je database voor later gebruik
