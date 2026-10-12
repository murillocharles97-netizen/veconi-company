import { cp, mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const source = new URL('../public/', import.meta.url);
export const DEFAULT_SITE_URL = 'https://murillocharles97-netizen.github.io/veconi-company/';
export async function build(destination = new URL('../dist/', import.meta.url), siteUrl = DEFAULT_SITE_URL) {
const url = new URL(siteUrl);
if (url.protocol !== 'https:' || url.search || url.hash || url.username || url.password) throw new Error('SITE_URL must be a public HTTPS base URL');
const baseUrl = url.href.replace(/\/+$/, '') + '/';
await mkdir(destination, {recursive:true});
// Copy only public assets: tests, internal docs and local screenshots are never published.
await cp(source, destination, { recursive:true });
// No custom domain until explicitly authorized; remove any stale generated CNAME too.
await rm(new URL('CNAME', destination), {force:true});
for (const name of ['index.html', '404.html', 'robots.txt', 'sitemap.xml']) {
  const path = new URL(name, destination);
  const content = await readFile(path, 'utf8');
  await writeFile(path, content.replaceAll('https://company.veconi.app.br/', baseUrl));
}
console.log(`Static site prepared: ${fileURLToPath(destination)} (${(await readdir(destination)).length} root entries)`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await build(undefined, process.env.SITE_URL || DEFAULT_SITE_URL);
}
