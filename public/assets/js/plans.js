// Informational marketing copy only. Billing and entitlements remain in the app.
export const PLAN_CATALOG = Object.freeze({
  essential: Object.freeze({ name: 'Essencial', monthlyCents: 2990 }),
  professional: Object.freeze({ name: 'Gestão', monthlyCents: 5990 }),
  premium: Object.freeze({ name: 'Pro', monthlyCents: 11990 }),
});
export const ANNUAL_DISCOUNT_PERCENT = 20;
export function priceFor(planId, period = 'monthly') {
  const plan = PLAN_CATALOG[planId];
  if (!plan || !['monthly', 'yearly'].includes(period)) throw new RangeError('Plano ou período inválido');
  const totalCents = period === 'yearly'
    ? Math.round(plan.monthlyCents * 12 * (100 - ANNUAL_DISCOUNT_PERCENT) / 100)
    : plan.monthlyCents;
  return { totalCents, equivalentMonthlyCents: period === 'yearly' ? Math.round(totalCents / 12) : totalCents };
}
export const formatNumber = cents => (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatBRL = cents => `R$ ${formatNumber(cents)}`;
export function billingLabel(planId, period) {
  return period === 'yearly' ? `Cobrado ${formatBRL(priceFor(planId, period).totalCents)}/ano` : 'Cobrado mensalmente';
}
