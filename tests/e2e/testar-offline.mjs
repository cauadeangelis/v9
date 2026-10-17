// PWA: depois da primeira visita, o site abre e calcula SEM internet.
// Uso: node testar-offline.mjs http://127.0.0.1:8000/
import { abrir, ok, fim, BASE } from './comum.mjs';
const { browser, ctx, page, erros } = await abrir();
await page.goto(BASE + 'index.html#home');
await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller !== undefined);
const reg = await page.evaluate(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
ok(reg, 'service worker ativo');
await page.reload(); await page.waitForTimeout(300);
ok(await page.evaluate(() => !!navigator.serviceWorker.controller), 'página controlada pelo service worker');
const caches = await page.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys.find(k => k.startsWith('numera-v9'))); return { keys, n: (await c.keys()).length }; });
ok(caches.n >= 19, `arquivos no cache offline: ${caches.n}`);
const man = await page.evaluate(async () => (await fetch(document.querySelector('link[rel=manifest]').href)).json());
ok(man.short_name === 'Numera' && man.icons.length >= 4, 'manifesto carregado');
await ctx.setOffline(true);
for (const hash of ['home', 'treino', 'academy', 'lab']) {
  await page.goto(BASE + 'index.html#' + hash); await page.waitForTimeout(200);
  ok(await page.evaluate(() => document.querySelector('#app').innerHTML.length > 1000), 'offline: página ' + hash);
}
await page.fill('#source', 'x^3 - x - 2 = 0'); await page.click('#terminal-form button[type=submit]');
await page.waitForSelector('.answer-result');
ok((await page.textContent('.answer-result strong')).includes('1,52137'), 'offline: o terminal resolve x³ − x − 2 = 0');
ok(erros.length === 0, 'sem erros de JavaScript: ' + erros.join(' | '));
await browser.close(); fim('Offline (PWA)');
