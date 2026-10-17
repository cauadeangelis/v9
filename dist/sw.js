/* Numera Academy — service worker (PWA).
   Guarda os arquivos do site no aparelho para funcionar sem internet.
   VERSION é calculada a partir do conteúdo dos arquivos (tests/pwa/atualizar-sw.cjs); quando algo muda,
   a versão muda, o cache novo é montado e o antigo é apagado. Não edite VERSION à mão. */
const VERSION = 'numera-v9-102bc967be';
const ASSETS = ['./', 'index.html', 'styles.css', 'calculator.css', 'treino.css', 'convergencia.css', 'math-engine.js', 'content.js', 'progress.js', 'convergencia.js', 'treino-data.js', 'treino.js', 'app.js', 'calculator.js', 'favicon.svg', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'maskable-512.png', 'apple-touch-icon.png'];
const FONTS = 'numera-fontes';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Fontes do Google: primeiro o cache (elas não mudam), depois a rede.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(caches.open(FONTS).then(cache => cache.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => hit))));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // Páginas: tenta a rede (para pegar a versão nova) e cai para o cache sem internet.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('index.html', { ignoreSearch: true })));
    return;
  }
  // Arquivos do site: cache primeiro; a versão nova chega junto com um VERSION novo.
  event.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
