import { differenceInDays, endOfMonth, startOfDay } from 'date-fns';

export interface Plan {
  id: number;
  name: string;
  price: number;
  billing_period?: 'monthly' | 'yearly';
}

export interface Customer {
  id: number;
  user_id: number;
  user_email: string;
  plan: Plan;
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'trial';
  subscription_start_date: string;
  subscription_end_date: string;
  mollie_customer_id?: string;
}

export interface ProRatedCalculation {
  current_plan: Plan;
  new_plan: Plan;
  remaining_days: number;
  total_days_in_period: number;
  unused_amount: number;
  upgrade_cost: number;
  final_amount_to_pay: number;
  discount_percentage: number;
}

/**
 * Berekent pro-rated billing voor plan upgrades
 * @param customer Huidige customer met actieve subscription
 * @param newPlan Nieuwe plan waar customer naar wil upgraden
 * @returns ProRatedCalculation met alle berekende waarden
 */
export function calculateProRatedUpgrade(
  customer: Customer,
  newPlan: Plan
): ProRatedCalculation {
  if (customer.subscription_status !== 'active') {
    throw new Error('Customer heeft geen actieve subscription');
  }

  if (!customer.subscription_start_date || !customer.subscription_end_date) {
    throw new Error('Subscription datums zijn niet beschikbaar');
  }

  const currentPlan = customer.plan;
  const today = startOfDay(new Date());
  const subscriptionStart = new Date(customer.subscription_start_date);
  const subscriptionEnd = new Date(customer.subscription_end_date);

  // Controleer of de subscription nog actief is
  if (today > subscriptionEnd) {
    throw new Error('Subscription is al verlopen');
  }

  // Bereken resterende dagen
  const remainingDays = differenceInDays(subscriptionEnd, today);
  const totalDaysInPeriod = differenceInDays(subscriptionEnd, subscriptionStart);

  // Bereken ongebruikt bedrag van huidige plan
  const dailyRate = currentPlan.price / totalDaysInPeriod;
  const unusedAmount = dailyRate * remainingDays;

  // Bereken kosten voor upgrade
  const upgradeCost = newPlan.price;

  // Bereken finaal te betalen bedrag (upgrade kosten min credit van ongebruikt bedrag)
  const finalAmountToPay = Math.max(0, upgradeCost - unusedAmount);

  // Bereken discount percentage
  const discountPercentage = unusedAmount > 0 ? (unusedAmount / upgradeCost) * 100 : 0;

  return {
    current_plan: currentPlan,
    new_plan: newPlan,
    remaining_days: remainingDays,
    total_days_in_period: totalDaysInPeriod,
    unused_amount: Math.round(unusedAmount * 100) / 100, // Rond af op 2 decimalen
    upgrade_cost: upgradeCost,
    final_amount_to_pay: Math.round(finalAmountToPay * 100) / 100, // Rond af op 2 decimalen
    discount_percentage: Math.round(discountPercentage * 100) / 100, // Rond af op 2 decimalen
  };
}

/**
 * Berekent het exacte bedrag dat aan Mollie moet worden gestuurd (in centen)
 * @param proRatedCalculation Het resultaat van calculateProRatedUpgrade
 * @returns Bedrag in centen voor Mollie API
 */
export function getAmountForMollie(proRatedCalculation: ProRatedCalculation): string {
  const amountInCents = Math.round(proRatedCalculation.final_amount_to_pay * 100);
  return amountInCents.toFixed(0);
}

/**
 * Genereert een beschrijving voor de betaling die duidelijk maakt wat er wordt betaald
 * @param calculation Pro-rated berekening
 * @returns Beschrijving string voor betaling
 */
export function generatePaymentDescription(calculation: ProRatedCalculation): string {
  const { current_plan, new_plan, unused_amount, final_amount_to_pay } = calculation;
  
  if (final_amount_to_pay === 0) {
    return `Upgrade van ${current_plan.name} naar ${new_plan.name} - Geen extra kosten dankzij resterende credit`;
  }
  
  if (unused_amount > 0) {
    return `Upgrade van ${current_plan.name} naar ${new_plan.name} - €${final_amount_to_pay} (€${unused_amount} credit toegepast)`;
  }
  
  return `Upgrade van ${current_plan.name} naar ${new_plan.name} - €${final_amount_to_pay}`;
}

/**
 * Valideert of een upgrade mogelijk is
 * @param currentPlan Huidige plan
 * @param newPlan Nieuwe plan
 * @returns true als upgrade mogelijk is, anders false
 */
export function isUpgradeValid(currentPlan: Plan, newPlan: Plan): boolean {
  // Controleer of het niet hetzelfde plan is
  if (currentPlan.id === newPlan.id) {
    return false;
  }

  // Controleer of het nieuwe plan duurder is (echte upgrade)
  // Dit kun je aanpassen naar je eigen logica
  return newPlan.price > currentPlan.price;
}

/**
 * Formatteert een bedrag voor weergave in de UI
 * @param amount Bedrag als number
 * @returns Geformatteerd bedrag string
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}