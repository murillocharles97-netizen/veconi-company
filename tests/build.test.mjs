import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, stat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, DEFAULT_SITE_URL } from '../scripts/build.mjs';

test('Pages artifact uses project base URL, preserves app CTAs and excludes custom domain', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'veconi-company-build-'));
  const destination = pathToFileURL(directory + '/');
  try {
    await writeFile(new URL('CNAME',destination), 'company.veconi.app.br');
    await build(destination);
    await assert.rejects(stat(new URL('CNAME',destination)), {code:'ENOENT'});
    for (const name of ['index.html','404.html','robots.txt','sitemap.xml']) {
      const content = await readFile(new URL(name,destination),'utf8');
      assert.ok(content.includes(DEFAULT_SITE_URL), name);
      assert.doesNotMatch(content,/https:\/\/company\.veconi\.app\.br/);
    }
    const html = await readFile(new URL('index.html',destination),'utf8');
    assert.match(html,/href="https:\/\/veconi.app.br\/#\/planos"/);
    assert.match(html,/href="\.\/assets\/css\/site.css"/);
    assert.ok((await stat(new URL('assets/images/og-veconi.png',destination))).size > 1000);
    await assert.rejects(stat(new URL('tests',destination)), {code:'ENOENT'});
    await assert.rejects(build(destination,'http://invalid.example/'));
  } finally {
    // Only this test's uniquely created temporary output directory is removed.
    await rm(directory,{recursive:true,force:true});
  }
});
