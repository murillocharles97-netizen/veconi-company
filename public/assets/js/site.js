import { PLAN_CATALOG, priceFor, formatNumber, formatBRL, billingLabel } from './plans.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const frames = new Map();
const displayed = new Map(Object.entries(PLAN_CATALOG).map(([id, plan]) => [id, plan.monthlyCents]));
let currentPeriod = 'monthly';

function animatePrice(id, target) {
  const node = document.querySelector(`[data-price="${id}"]`);
  if (frames.has(id)) cancelAnimationFrame(frames.get(id));
  const from = displayed.get(id);
  node.closest('.price').setAttribute('aria-label', `${formatBRL(target)} por mês${currentPeriod === 'yearly' ? ', equivalente na cobrança anual' : ''}`);
  const finish = () => {
    node.textContent = formatNumber(target);
    displayed.set(id, target);
    node.closest('.price').classList.remove('is-animating');
    frames.delete(id);
  };
  if (reducedMotion.matches || from === target) { finish(); return; }
  const start = performance.now();
  node.closest('.price').classList.add('is-animating');
  function tick(time) {
    if (reducedMotion.matches) { finish(); return; }
    const progress = Math.min(1, (time - start) / 440);
    const amount = Math.round(from + (target - from) * (1 - (1 - progress) ** 3));
    displayed.set(id, amount);
    node.textContent = formatNumber(amount);
    if (progress < 1) frames.set(id, requestAnimationFrame(tick));
    else finish();
  }
  frames.set(id, requestAnimationFrame(tick));
}

const buttons = [...document.querySelectorAll('[data-period]')];
function selectPeriod(period) {
  if (period === currentPeriod || !['monthly', 'yearly'].includes(period)) return;
  currentPeriod = period;
  document.querySelector('.billing-switch').classList.toggle('is-yearly', period === 'yearly');
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.period === period)));
  for (const id of Object.keys(PLAN_CATALOG)) {
    animatePrice(id, priceFor(id, period).equivalentMonthlyCents);
    document.querySelector(`[data-billing="${id}"]`).textContent = billingLabel(id, period);
  }
  document.querySelector('#pricing-announcement').textContent = period === 'yearly'
    ? 'Cobrança anual com 20% de desconto. Essencial: R$ 287,04 por ano. Gestão: R$ 575,04 por ano. Pro: R$ 1.151,04 por ano.'
    : 'Cobrança mensal. Essencial: R$ 29,90. Gestão: R$ 59,90. Pro: R$ 119,90.';
}
buttons.forEach(button => {
  button.addEventListener('click', () => selectPeriod(button.dataset.period));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? buttons[0] : event.key === 'End' ? buttons[1] : buttons[1 - buttons.indexOf(button)];
    next.focus();
    selectPeriod(next.dataset.period);
  });
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
