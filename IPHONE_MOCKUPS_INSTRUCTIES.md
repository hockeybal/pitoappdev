# iPhone Mockups Component - Instructies

## 📱 Overzicht

Het **Launches** component is nu getransformeerd naar een prachtig **iPhone Mockups** showcasesysteem! Dit toont 1-4 iPhone mockups met jouw app screenshots, compleet met het oranje oogje-icoon en een fullscreen lightbox.

---

## 🎨 Features

✅ **1-4 iPhone Mockups** - Variabel aantal (min 1, max 4)  
✅ **Oranje Oogje Icoon** - Rechtsboven elke mockup (zoals in je afbeelding)  
✅ **Titel & Subtitel** - Volledig aanpasbaar via CMS  
✅ **Per Mockup Titel & Beschrijving** - Leg uit wat gebruikers zien in elk scherm  
✅ **Lightbox Functionaliteit** - Klik op mockup voor grotere weergave  
✅ **Responsive Grid** - Perfect op mobiel, tablet én desktop  
✅ **iPhone Frame** - Realistisch iPhone design met notch  
✅ **Smooth Animations** - Framer Motion hover & scroll effects  

---

## 🚀 Gebruik in Strapi CMS

### Stap 1: Strapi Herstarten
Na deze wijzigingen moet je Strapi herstarten om de nieuwe schema's te laden:

```bash
cd strapi
npm run develop
```

### Stap 2: Component Toevoegen
1. Ga naar **Content Manager** → **Pages** (of Blog Page / Product Page)
2. Scroll naar de **Dynamic Zone**
3. Klik op **+ Add component**
4. Selecteer **App Mockups** (voorheen "Launches")

### Stap 3: Content Invullen
Vul de volgende velden in:

#### **Heading** (Titel)
```
Zo ziet jouw plek in de app eruit
```

#### **Sub Heading** (Subtitel met oogje icoon)
```
Hier wordt jouw bedrijf zichtbaar met PITO Partner
```

#### **Mockups** (1-4 stuks)
Voor elke mockup:
1. Klik op **+ Add new entry**
2. Vul de **Titel** in (bijv. "Deals & Kortingen")
3. Vul de **Beschrijving** in (bijv. "Bekijk exclusieve deals van lokale bedrijven in jouw buurt")
4. Upload een **Screenshot** (aanbevolen: 1170 × 2532 px - iPhone aspect ratio)
5. Vul **Alternative Text** in voor toegankelijkheid

**Voorbeeld:**
```
Mockup 1:
  Titel: "Deals & Kortingen"
  Beschrijving: "Ontdek exclusieve aanbiedingen van bedrijven in jouw buurt"
  Screenshot: deals-screen.png

Mockup 2:
  Titel: "Vacatures"
  Beschrijving: "Vind lokale banen bij bedrijven die actief zoeken naar personeel"
  Screenshot: vacatures-screen.png

Mockup 3:
  Titel: "Bedrijfsprofielen"
  Beschrijving: "Bekijk gedetailleerde informatie over alle aangesloten ondernemers"
  Screenshot: business-detail.png

Mockup 4:
  Titel: "Alle Categorieën"
  Beschrijving: "Blader door restaurants, winkels, diensten en meer"
  Screenshot: categories-screen.png
```

---

## 📐 Aanbevolen Screenshot Specificaties

### Ideale Afmetingen
- **Breedte:** 1170px
- **Hoogte:** 2532px
- **Aspect Ratio:** 9:19.5 (iPhone 14 Pro)
- **Formaat:** PNG of JPG
- **Max grootte:** 2MB voor snelle laadtijden

### Screenshot Tips
1. **Maak screenshots** op een iPhone (via simulator of echt apparaat)
2. **Verwijder de status bar** indien gewenst (tijd, batterij, etc.)
3. **Gebruik lichte achtergronden** voor beste contrast
4. **Zorg voor duidelijke content** - tekst moet leesbaar zijn

---

## 🎯 Responsive Gedrag

| Aantal Mockups | Mobiel | Tablet | Desktop |
|----------------|--------|---------|---------|
| 1 mockup       | 1 kolom | 1 kolom | 1 kolom (gecentreerd) |
| 2 mockups      | 1 kolom | 2 kolommen | 2 kolommen |
| 3 mockups      | 1 kolom | 3 kolommen | 3 kolommen |
| 4 mockups      | 1 kolom | 2 kolommen | 4 kolommen |

---

## 🔧 Code Structuur

### Frontend Component
**Locatie:** `/next/components/dynamic-zone/launches.tsx`

**Key Features:**
- iPhone frame met CSS (border-radius, shadows)
- Oranje oogje icoon (IconEye van Tabler Icons)
- Framer Motion animaties (fade-in, hover, scale)
- Lightbox modal met backdrop blur
- Next.js Image optimalisatie

### Strapi Schema's

#### Dynamic Zone Component
**Locatie:** `/strapi/src/components/dynamic-zone/launches.json`

```json
{
  "heading": "string",
  "sub_heading": "string",
  "mockups": "component (repeatable, min: 1, max: 4)"
}
```

#### Shared Component
**Locatie:** `/strapi/src/components/shared/iphone-mockup.json`

```json
{
  "title": "string (optional)",
  "description": "text (optional)",
  "screenshot": "media (single image)"
}
```

---

## 💡 Voorbeeld Gebruik

### In Strapi:
```
Heading: "Zo ziet jouw plek in de app eruit"
Sub Heading: "Hier wordt jouw bedrijf zichtbaar met PITO Partner"

Mockups:
  1. Title: "Deals & Kortingen"
     Description: "Ontdek exclusieve aanbiedingen van bedrijven in jouw buurt"
     Screenshot: deals-screen.png
     
  2. Title: "Vacatures"
     Description: "Vind lokale banen bij actieve werkgevers"
     Screenshot: vacatures-screen.png
     
  3. Title: "Bedrijfsprofielen"
     Description: "Bekijk informatie over aangesloten ondernemers"
     Screenshot: business-detail-screen.png
     
  4. Title: "Categorieën"
     Description: "Blader door restaurants, winkels en diensten"
     Screenshot: categories-screen.png
```

### Resultaat:
Een rij van 4 iPhone mockups met jouw screenshots, elk met:
- ✅ Oranje oogje icoon rechtsboven
- ✅ Hover effect (omhoog + schaal)
- ✅ Klikbaar voor fullscreen weergave
- ✅ Smooth fade-in animaties
- ✅ **Titel en beschrijving onder elke mockup**

---

## 🎨 Styling Aanpassingen

### Kleuren Wijzigen
De oranje kleur komt van je Tailwind theme:
```tsx
// In launches.tsx, zoek naar:
from-brand-orange to-[#ff9a56]

// Vervang met jouw kleuren:
from-blue-500 to-blue-600
```

### iPhone Frame Aanpassen
```tsx
// Huidige styling:
className="... rounded-[3rem] p-3 ..."

// Grotere radius:
className="... rounded-[4rem] p-4 ..."
```

### Grid Layout Wijzigen
```tsx
// In launches.tsx, pas aan bij:
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

// Bijvoorbeeld altijd 3 kolommen:
grid-cols-1 md:grid-cols-3
```

---

## 🐛 Troubleshooting

### Probleem: Strapi toont oude "Launches" component
**Oplossing:** Herstart Strapi volledig en clear je browser cache

### Probleem: Afbeeldingen laden niet
**Oplossing:** Check of `NEXT_PUBLIC_API_URL` correct is ingesteld in `.env`

### Probleem: Layout lijkt gebroken
**Oplossing:** Zorg dat je minimaal 1 mockup hebt toegevoegd

### Probleem: Lightbox werkt niet
**Oplossing:** Check of `framer-motion` geïnstalleerd is:
```bash
cd next
npm install framer-motion
```

---

## 🚀 Volgende Stappen

1. ✅ **Test de component** - Maak een testpagina aan
2. ✅ **Upload screenshots** - 4 mooie app screenshots
3. ✅ **Check responsive design** - Test op mobiel/tablet/desktop
4. ✅ **Optimaliseer afbeeldingen** - Comprimeer indien nodig
5. ✅ **Deploy naar productie** - Als alles werkt!

---

## 📞 Support

Heb je vragen of wil je iets aanpassen? Laat het me weten! Ik kan helpen met:
- Styling aanpassingen
- Extra functies toevoegen
- Performance optimalisaties
- Animatie tweaks

---

**Veel plezier met je nieuwe iPhone Mockups component! 🎉📱**
