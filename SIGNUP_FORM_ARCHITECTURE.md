# 📊 Architectuur Diagram - Inschrijfformulier

## Systeem Overzicht

```
┌─────────────────────────────────────────────────────────────────┐
│                         STRAPI CMS                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           Content Manager (Admin Panel)                │    │
│  │                                                         │    │
│  │  Page Dynamic Zone:                                    │    │
│  │  ├─ Hero                                               │    │
│  │  ├─ Features                                           │    │
│  │  ├─ 📝 Signup Form (Zakelijk)    ←─ Configureerbaar   │    │
│  │  │   ├─ Form Type: zakelijk                           │    │
│  │  │   ├─ Show Company: ✓                               │    │
│  │  │   ├─ Pipedrive Enabled: ✓                          │    │
│  │  │   └─ Heading, Button Text, etc.                    │    │
│  │  ├─ Pricing                                            │    │
│  │  └─ 📝 Signup Form (Particulier)  ←─ Configureerbaar   │    │
│  │      ├─ Form Type: particulier                         │    │
│  │      ├─ Show Company: ✗                                │    │
│  │      └─ Pipedrive Enabled: ✓                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           Lead Content Type (Database)                 │    │
│  │                                                         │    │
│  │  Stored Leads:                                         │    │
│  │  ┌───────────────────────────────────────────────┐    │    │
│  │  │ ID: 1                                         │    │    │
│  │  │ Name: Jan de Vries                           │    │    │
│  │  │ Email: jan@bedrijf.nl                        │    │    │
│  │  │ Type: zakelijk                               │    │    │
│  │  │ Company: Bedrijf BV                          │    │    │
│  │  │ Pipedrive ID: 12345                          │    │    │
│  │  │ Sync Status: ✅ synced                        │    │    │
│  │  └───────────────────────────────────────────────┘    │    │
│  │  ┌───────────────────────────────────────────────┐    │    │
│  │  │ ID: 2                                         │    │    │
│  │  │ Name: Emma Jansen                            │    │    │
│  │  │ Email: emma@email.com                        │    │    │
│  │  │ Type: particulier                            │    │    │
│  │  │ Pipedrive ID: 12346                          │    │    │
│  │  │ Sync Status: ✅ synced                        │    │    │
│  │  └───────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓ API (REST)
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP                              │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │     Frontend Components                                │    │
│  │                                                         │    │
│  │     /components/dynamic-zone/signup-form.tsx          │    │
│  │     ┌──────────────────────────────────────┐          │    │
│  │     │  📝 Inschrijfformulier              │          │    │
│  │     │                                      │          │    │
│  │     │  ┌────────────────────────────────┐ │          │    │
│  │     │  │ Voornaam: [_______________]    │ │          │    │
│  │     │  │ Achternaam: [_____________]    │ │          │    │
│  │     │  │ Email: [___________________]   │ │          │    │
│  │     │  │ Telefoon: [________________]   │ │          │    │
│  │     │  │ Bedrijf: [_________________]   │ │ (zakelijk)
│  │     │  │ Bericht: [_________________]   │ │          │    │
│  │     │  │          [_________________]   │ │          │    │
│  │     │  │                                │ │          │    │
│  │     │  │      [ Verstuur ]              │ │          │    │
│  │     │  └────────────────────────────────┘ │          │    │
│  │     └──────────────────────────────────────┘          │    │
│  └────────────────────────────────────────────────────────┘    │
│                              │                                  │
│                              ↓ POST                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │     API Routes                                         │    │
│  │                                                         │    │
│  │     /app/api/leads/submit/route.ts                    │    │
│  │     ┌──────────────────────────────────────┐          │    │
│  │     │  1. Valideer data                    │          │    │
│  │     │  2. Sync naar Pipedrive              │          │    │
│  │     │  3. Opslaan in Strapi                │          │    │
│  │     │  4. Return response                  │          │    │
│  │     └──────────────────────────────────────┘          │    │
│  └────────────────────────────────────────────────────────┘    │
│                       │              │                          │
│                       │              └──────────┐               │
│  ┌────────────────────┘                         │               │
│  │                                               ↓               │
│  │    /lib/pipedrive.ts                                         │
│  │    ┌──────────────────────────────────────┐                 │
│  │    │  Pipedrive Helper Functions:         │                 │
│  │    │  • createPerson()                    │                 │
│  │    │  • createOrganization()              │                 │
│  │    │  • createLead()                      │                 │
│  │    │  • addNote()                         │                 │
│  │    │  • syncLeadToPipedrive()             │                 │
│  │    └──────────────────────────────────────┘                 │
│  └──────────────────────┼────────────────────────────────────  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ↓ HTTPS API Calls
┌─────────────────────────────────────────────────────────────────┐
│                      PIPEDRIVE API                              │
│                                                                 │
│  Zakelijk Account (PIPEDRIVE_API_TOKEN_ZAKELIJK):             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Pipeline: Business Leads                              │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  Lead: "Bedrijf BV - Jan de Vries"          │     │    │
│  │  │  Person: Jan de Vries                       │     │    │
│  │  │  Organization: Bedrijf BV                   │     │    │
│  │  │  Note: "Bericht van website: ..."          │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Particulier Account (PIPEDRIVE_API_TOKEN_PARTICULIER):       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Pipeline: Personal Leads                              │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  Lead: "Emma Jansen"                        │     │    │
│  │  │  Person: Emma Jansen                        │     │    │
│  │  │  Note: "Interesse in product..."           │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Gebruiker vult formulier in

```
┌──────────────┐
│   Gebruiker   │
│   Website     │
└───────┬──────┘
        │ Vult formulier in + klikt "Verstuur"
        ↓
┌──────────────────────────────────────────────┐
│  SignupForm Component                        │
│  • Validate input                            │
│  • POST naar /api/leads/submit               │
└───────┬──────────────────────────────────────┘
        │
        ↓
┌──────────────────────────────────────────────┐
│  /api/leads/submit Route Handler             │
│                                              │
│  Step 1: Validatie                          │
│  ├─ Check required fields                   │
│  ├─ Validate email format                   │
│  └─ Check leadType (zakelijk/particulier)   │
│                                              │
│  Step 2: Pipedrive Sync (if enabled)        │
│  ├─ Get correct API token (zakelijk/part.)  │
│  ├─ Create Organization (if company)        │
│  ├─ Create Person                           │
│  ├─ Create Lead                             │
│  └─ Add Note (if message)                   │
│     ↓                                        │
│  ┌──────────────────────────┐               │
│  │ Success: pipedriveId ✅   │               │
│  └──────────────────────────┘               │
│  ┌──────────────────────────┐               │
│  │ Failed: error message ❌  │               │
│  └──────────────────────────┘               │
│                                              │
│  Step 3: Strapi Opslag (ALWAYS)            │
│  ├─ POST naar /api/leads                    │
│  ├─ Save with sync status                   │
│  └─ Return lead ID                          │
│                                              │
│  Step 4: Response                           │
│  └─ { success: true, data: {...} }          │
└───────┬──────────────────────────────────────┘
        │
        ↓
┌──────────────────────────────────────────────┐
│  Success Message Shown                       │
│  ✅ "Bedankt! We nemen contact op."          │
└──────────────────────────────────────────────┘
```

## Environment Variabelen

```
┌──────────────────────────────────────────────┐
│  .env.local (Next.js)                        │
│                                              │
│  PIPEDRIVE_API_TOKEN_ZAKELIJK    ────────┐  │
│  PIPEDRIVE_API_TOKEN_PARTICULIER ────┐   │  │
│  STRAPI_API_TOKEN (optional)          │   │  │
│  NEXT_PUBLIC_STRAPI_URL              │   │  │
└──────────────────────────────────────┼───┼──┘
                                       │   │
                  ┌────────────────────┘   │
                  │                        │
                  ↓                        ↓
         Pipedrive Zakelijk      Pipedrive Particulier
         API Token               API Token
         (voor B2B leads)        (voor B2C leads)
```

## CMS Configuratie Flow

```
Strapi Admin Panel
        │
        ↓
Content Manager → Page
        │
        ↓
Dynamic Zone → Add Component
        │
        ├─→ Signup Form (Component)
        │       │
        │       ├─ heading: "Schrijf je in"
        │       ├─ formType: "zakelijk" of "particulier" ← BELANGRIJK
        │       ├─ showCompanyField: true/false
        │       ├─ showPhoneField: true/false
        │       ├─ showMessageField: true/false
        │       ├─ buttonText: "Verstuur"
        │       ├─ successMessage: "Bedankt!"
        │       ├─ backgroundColor: "white"/"gray"/"gradient"
        │       └─ pipedriveEnabled: true/false ← Sync on/off
        │
        ↓
Save + Publish
        │
        ↓
Website (Next.js) fetches page data via Strapi API
        │
        ↓
DynamicZoneManager renders SignupForm component
        │
        ↓
Gebruiker ziet formulier met alle configuratie opties!
```

## Foutafhandeling

```
┌─────────────────────────────────────────┐
│  Scenario 1: Pipedrive is offline       │
├─────────────────────────────────────────┤
│  1. Formulier submit                    │
│  2. Pipedrive sync FAILS ❌              │
│  3. Lead opgeslagen in Strapi ✅         │
│     - pipedriveSyncStatus: "failed"     │
│     - pipedriveSyncError: "Connection   │
│       timeout"                          │
│  4. Success message getoond aan user ✅  │
│  5. Admin kan later handmatig synce     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Scenario 2: Strapi is offline          │
├─────────────────────────────────────────┤
│  1. Formulier submit                    │
│  2. Pipedrive sync SUCCESS ✅            │
│  3. Strapi opslag FAILS ❌               │
│  4. Error message aan user              │
│  5. Lead WEL in Pipedrive               │
│     (niet verloren!)                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Scenario 3: Ongeldige data             │
├─────────────────────────────────────────┤
│  1. Formulier submit met invalid email  │
│  2. Validatie FAILS in API route ❌      │
│  3. Error: "Ongeldig e-mailadres"       │
│  4. NIETS opgeslagen (correct!)         │
│  5. User kan herstellen                 │
└─────────────────────────────────────────┘
```

## Component Structuur

```
next/components/dynamic-zone/
│
├── manager.tsx                 (Routes components)
│   └─→ Imports signup-form.tsx
│
└── signup-form.tsx             (Main component)
    │
    ├── Props (from Strapi CMS):
    │   ├─ heading
    │   ├─ sub_heading
    │   ├─ formType ← Determines Pipedrive API
    │   ├─ showCompanyField
    │   ├─ showPhoneField
    │   ├─ showMessageField
    │   ├─ buttonText
    │   ├─ successMessage
    │   ├─ privacyText
    │   ├─ backgroundColor
    │   └─ pipedriveEnabled
    │
    ├── State:
    │   ├─ formData (user input)
    │   ├─ isSubmitting (loading state)
    │   ├─ isSuccess (show success message)
    │   └─ error (show error message)
    │
    └── Functions:
        ├─ handleChange() - Update form data
        ├─ handleSubmit() - Submit to API
        └─ Render logic - Conditional fields
```

---

**Dit diagram geeft een volledig overzicht van de architectuur!** 🎉
