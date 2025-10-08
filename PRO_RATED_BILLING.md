# Pro-Rated Billing Implementatie

Deze implementatie zorgt ervoor dat klanten bij een plan upgrade niet het volledige bedrag hoeven te betalen, maar automatisch korting krijgen voor de resterende tijd van hun huidige plan.

## Hoe het werkt

### 1. Berekening van Pro-Rated Billing

De core logica zit in `/lib/shared/pro-rated-billing.ts`:

- **Resterende dagen berekenen**: Hoeveel dagen zijn er nog over van de huidige subscription?
- **Ongebruikt bedrag**: `(dagprijs × resterende dagen)`
- **Finaal bedrag**: `nieuwe plan prijs - ongebruikt bedrag`

### 2. API Endpoints

#### `GET /api/upgrade-plan?planId=123`
- Preview van upgrade kosten
- Toont wat klant gaat betalen incl. korting
- Geen betaling aanmaken

#### `POST /api/upgrade-plan`
- Daadwerkelijke upgrade proces
- Maakt Mollie betaling aan (als bedrag > €0)
- Update subscription direct als geen betaling nodig

#### `POST /api/webhook-upgrade` 
- Mollie webhook specifiek voor upgrades
- Update customer record na succesvolle betaling
- Logging voor audit trail

### 3. Frontend Components

#### `UpgradePreview`
- Toont upgrade kosten breakdown
- Real-time berekening
- Upgrade knop met Mollie redirect

#### `PricingWithUpgrades`
- Aangepaste pricing component
- Toont "Upgrade" in plaats van "Kies Plan"
- Markeert huidige plan
- Modal voor upgrade preview

### 4. Database Wijzigingen

Toegevoegd aan `customer` schema:
```json
{
  "current_subscription_id": "string",
  "last_payment_date": "datetime", 
  "total_paid": "decimal",
  "credits_available": "decimal",
  "billing_period": "monthly|yearly"
}
```

## Gebruik

### Voor bestaande klanten
```typescript
// Toon upgrade opties
<PricingWithUpgrades 
  plans={plans}
  currentPlanId={customer.plan.id}
  heading="Upgrade je plan"
  sub_heading="Betaal alleen het verschil"
/>
```

### Standalone upgrade preview
```typescript
<UpgradePreview
  currentPlanId={1}
  newPlanId={3}
  onUpgrade={(calculation) => { /* handle upgrade */ }}
/>
```

## Voorbeelden

### Scenario 1: Mid-cycle upgrade
- **Huidig plan**: €50/maand, nog 15 dagen over
- **Nieuw plan**: €100/maand  
- **Credit**: €25 (15/30 × €50)
- **Te betalen**: €75 (€100 - €25)

### Scenario 2: Gratis upgrade
- **Huidig plan**: €100/maand, nog 20 dagen over
- **Nieuw plan**: €60/maand
- **Credit**: €67 (20/30 × €100) 
- **Te betalen**: €0 (credit > nieuwe plan prijs)

## Veiligheid & Validatie

- ✅ Authenticatie vereist voor alle upgrade endpoints
- ✅ Validatie dat nieuwe plan anders/duurder is dan huidig
- ✅ Controle op actieve subscription status
- ✅ Mollie webhook signature verificatie (TODO)
- ✅ Error handling en logging
- ✅ Audit trail voor alle upgrades

## Testing

Test de volgende scenarios:

1. **Normal upgrade**: van goedkoper naar duurder plan
2. **Free upgrade**: credit > nieuwe plan kosten  
3. **Same plan**: zou moeten falen
4. **Expired subscription**: zou moeten falen
5. **Invalid plan ID**: zou moeten falen
6. **Mollie payment failure**: error handling
7. **Webhook processing**: database updates

## Configuratie

Zorg ervoor dat deze environment variables zijn ingesteld:

```env
MOLLIE_API_KEY=test_xxx...
STRAPI_API_TOKEN=xxx...
STRAPI_API_URL=http://localhost:1337
NEXTAUTH_URL=http://localhost:3000
```

## Toekomstige Uitbreidingen

- **Downgrade support**: Credit voor volgende maand
- **Jaarlijkse billing**: Pro-rated op jaar basis
- **Subscription pausing**: Tijdelijk pauzeren
- **Refunds**: Automatische terugbetalingen
- **Usage-based pricing**: Pro-rated op basis van gebruik