import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { PLAN_CATALOG, priceFor, billingLabel, formatNumber } from '../public/assets/js/plans.js';
const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../public/assets/css/site.css', import.meta.url), 'utf8');
const script = await readFile(new URL('../public/assets/js/site.js', import.meta.url), 'utf8');
test('monthly prices match approved catalog', () => {
  assert.deepEqual(Object.values(PLAN_CATALOG).map(p => p.monthlyCents), [2990,5990,11990]);
});
test('annual totals and equivalents are calculated in cents', () => {
  assert.deepEqual(priceFor('essential','yearly'), { totalCents:28704,equivalentMonthlyCents:2392 });
  assert.deepEqual(priceFor('professional','yearly'), { totalCents:57504,equivalentMonthlyCents:4792 });
  assert.deepEqual(priceFor('premium','yearly'), { totalCents:115104,equivalentMonthlyCents:9592 });
});
test('invalid plans and billing periods cannot be evaluated', () => {
  assert.throws(() => priceFor('fake'),RangeError);
  assert.throws(() => priceFor('premium','weekly'),RangeError);
});
test('annual price copy discloses actual full-year charge', () => {
  assert.equal(billingLabel('premium','yearly'),'Cobrado R$ 1.151,04/ano');
  assert.equal(formatNumber(2990),'29,90');
});
test('all external CTA anchors lead only to the official app', () => {
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);
  assert.ok(links.length>10);
  for (const href of links) assert.ok(href.startsWith('#') || ['https://veconi.app.br','https://veconi.app.br/#/planos'].includes(href),href);
});
test('all in-page anchors exist and IDs are unique', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id),id);
});
test('landing does not access backend, cookies, storage, billing or app service worker', () => {
  assert.doesNotMatch(script,/fetch\(|XMLHttpRequest|firebase|serviceWorker|localStorage|sessionStorage|document\.cookie|checkout|mercadopago/i);
  assert.doesNotMatch(html,/<form|<iframe|firebase|service-worker|manifest\.json/i);
  assert.match(html,/connect-src 'none'/);
});
test('essential excludes finance; higher plans and future integrations are honest', () => {
  const essential = html.split('data-plan="essential"')[1].split('</article>')[0];
  assert.match(essential,/Não inclui o módulo Financeiro/);
  assert.doesNotMatch(essential,/<li>Financeiro/);
  assert.match(html.split('data-plan="professional"')[1].split('</article>')[0],/Financeiro completo/);
  const pro = html.split('data-plan="premium"')[1].split('</article>')[0];
  assert.match(pro,/Equipe e funcionários/); assert.equal((pro.match(/Em breve/g)||[]).length,2);
});
test('demonstration is labeled and no testimonial metrics are fabricated', () => {
  assert.match(html,/Prévia ilustrativa · dados de demonstração/);
  assert.doesNotMatch(html,/<blockquote|\d+[.,]?\d*\+ clientes|mil empresas/i);
});
test('SEO and full OG metadata', () => {
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/<html lang="pt-BR"/);
  assert.match(html,/<link rel="canonical" href="https:\/\/company.veconi.app.br\/"/);
  for(const key of ['type','locale','site_name','title','description','url','image','image:width','image:height','image:alt']) assert.ok(html.includes(`property="og:${key}"`),key);
  assert.match(html,/name="twitter:card" content="summary_large_image"/);
});
test('all referenced local files exist', async () => {
  const refs = [...html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)].map(m=>m[1]);
  for(const path of refs) assert.ok((await stat(new URL('../public/'+path,import.meta.url))).isFile(),path);
  assert.ok((await stat(new URL('../public/assets/images/og-veconi.png',import.meta.url))).size>1000);
});
test('SVG icon definitions resolve', () => {
  const definitions = [...html.matchAll(/<symbol id="([^"]+)"/g)].map(m=>m[1]);
  for(const [,id] of html.matchAll(/<use href="#([^"]+)"/g)) assert.ok(definitions.includes(id),id);
});
test('native FAQ, skip link, focus and motion preferences', () => {
  assert.equal((html.match(/<details>/g)||[]).length,6);
  assert.match(html,/class="skip-link"/); assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(script,/reducedMotion.matches/); assert.match(script,/cancelAnimationFrame/);
  assert.match(script,/ArrowLeft/); assert.match(html,/aria-pressed="true"/);
});
test('GitHub Pages deploy is manual and scoped to dist', async () => {
  const workflow = await readFile(new URL('../.github/workflows/deploy-pages.yml',import.meta.url),'utf8');
  assert.match(workflow,/workflow_dispatch/); assert.doesNotMatch(workflow,/\bpush:|pull_request:|firebase/);
  assert.match(workflow,/path: dist/);
  await assert.rejects(stat(new URL('../public/CNAME',import.meta.url)), {code:'ENOENT'});
  assert.match(workflow,/SITE_URL: \$\{\{ steps.pages.outputs.base_url \}\}/);
});
test('site stays dependency free at runtime', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
  assert.equal(Object.keys(pkg.dependencies||{}).length,0);
  assert.doesNotMatch(html,/https:\/\/fonts\.|cdn\.|unpkg\./);
});
