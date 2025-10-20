# 🎉 UPDATE: Titels & Beschrijvingen per Mockup

## ✨ Nieuwe Feature Toegevoegd!

Per iPhone mockup kun je nu **titel** en **beschrijving** toevoegen om uit te leggen wat gebruikers zien in elk scherm.

---

## 🆕 Wat is er veranderd?

### **Strapi Schema Update**
Het `iphone-mockup` component heeft nu 3 velden:
1. **Title** (string, optional) - Korte titel voor de mockup
2. **Description** (text, optional) - Uitleg over wat gebruikers zien
3. **Screenshot** (media, required) - De app screenshot

### **Visual Design**
- Titel en beschrijving verschijnen **onder de iPhone mockup**
- Gecentreerde tekst styling
- Smooth fade-in animaties
- Responsive font sizes (groter op desktop, kleiner op mobiel)

---

## 📝 Gebruik in Strapi CMS

### Stap 1: Herstart Strapi
```bash
cd strapi
npm run develop
```

### Stap 2: Voeg Mockup Toe
Bij elke mockup kun je nu invullen:

```
Title: "Deals & Kortingen"
Description: "Ontdek exclusieve aanbiedingen van bedrijven in jouw buurt"
Screenshot: [upload afbeelding]
```

---

## 💡 Voorbeelden

### Mockup 1: Deals
```
Title: "Deals & Kortingen"
Description: "Ontdek exclusieve aanbiedingen van bedrijven in jouw buurt. Van restaurants tot winkels, allemaal met aantrekkelijke kortingen."
```

### Mockup 2: Vacatures
```
Title: "Vacatures"
Description: "Vind lokale banen bij bedrijven die actief zoeken naar personeel. Direct solliciteren via de app."
```

### Mockup 3: Bedrijfsprofielen
```
Title: "Bedrijfsprofielen"
Description: "Bekijk gedetailleerde informatie over alle aangesloten ondernemers. Openingstijden, contact en reviews."
```

### Mockup 4: Categorieën
```
Title: "Alle Categorieën"
Description: "Blader door restaurants, winkels, diensten en meer. Vind snel wat je zoekt in jouw omgeving."
```

---

## 🎨 Design Specificaties

### Titel
- **Font Size:** 20px (mobiel) → 24px (desktop)
- **Font Weight:** Bold
- **Color:** Gray-900 (#111827)
- **Margin Bottom:** 8px

### Beschrijving
- **Font Size:** 14px (mobiel) → 16px (desktop)
- **Color:** Gray-600 (#4B5563)
- **Line Height:** Relaxed (1.625)
- **Text Align:** Center

### Container
- **Margin Top:** 24px (onder iPhone)
- **Padding X:** 8px (voor breathing room)

---

## ✅ Voordelen

1. **Duidelijkere Communicatie** - Leg precies uit wat elk scherm toont
2. **Betere UX** - Bezoekers begrijpen direct de app functionaliteit
3. **SEO Vriendelijk** - Meer tekstuele content voor zoekmachines
4. **Flexible** - Titel en beschrijving zijn optioneel (niet verplicht)
5. **Meertalig Support** - Per locale andere teksten mogelijk

---

## 🔄 Backwards Compatible

- Titel en beschrijving zijn **optioneel**
- Bestaande mockups zonder titel/beschrijving blijven gewoon werken
- Geen breaking changes in de code

---

## 📱 Responsive Gedrag

| Schermgrootte | Titel Font | Beschrijving Font |
|---------------|------------|-------------------|
| Mobiel (< 768px) | 18px | 14px |
| Tablet (768-1024px) | 20px | 15px |
| Desktop (> 1024px) | 24px | 16px |

---

## 🎯 Resultaat

Elke iPhone mockup heeft nu:
- ✅ Realistisch iPhone frame
- ✅ Oranje oogje icoon rechtsboven
- ✅ App screenshot
- ✅ **NIEUW:** Titel onder mockup
- ✅ **NIEUW:** Beschrijvende tekst onder titel
- ✅ Hover animaties
- ✅ Klikbaar voor lightbox

---

## 🚀 Klaar om te Gebruiken!

Open **`iphone-mockups-preview.html`** in je browser om de nieuwe features te zien!

**Veel succes met je uitgebreide mockup sectie! 📱✨**
