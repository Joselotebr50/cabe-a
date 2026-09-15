/* ============================================================
   service-worker.js — cache offline para o PWA
   ------------------------------------------------------------
   Correções aplicadas:
   - Filtro para requisições chrome-extension (evita erro no console)
   - Install cacheia SÓ o essencial (não os 90 MB de imagens)
   - Fetch filtra esquemas inválidos antes de tentar cachear
   ============================================================ */

const CACHE = 'cabeca-v2';

/* Só o essencial para o app abrir offline.
   As imagens e fundos entram em cache aos poucos, durante o uso. */
const ESSENCIAIS = [
  './',
  './index.html',
  './estilo.css',
  './audio.js',
  './jogo.js',
  './manifest.json'
];

/* ---------- INSTALAÇÃO ---------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(
        ESSENCIAIS.map(url => cache.add(url).catch(() => null))
      )
    ).then(() => self.skipWaiting())
  );
});

/* ---------- ATIVAÇÃO ---------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---------- FETCH (cache primeiro, depois rede) ---------- */
self.addEventListener('fetch', event => {
  /* 1) Ignora métodos que não são GET */
  if (event.request.method !== 'GET') return;

  /* 2) Ignora esquemas não suportados (chrome-extension:, data:, etc.) */
  const url = event.request.url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(resposta => {
        /* Cacheia o que foi baixado com sucesso (imagens, fundos, etc.) */
        if (resposta && resposta.status === 200 && resposta.type === 'basic'){
          const copia = resposta.clone();
          caches.open(CACHE).then(cache => {
            cache.put(event.request, copia).catch(() => {});
          });
        }
        return resposta;
      }).catch(() => {
        /* Offline + navegação → devolve o index para o app abrir */
        if (event.request.mode === 'navigate'){
          return caches.match('./index.html');
        }
        return new Response('', { status: 404 });
      });
    })
  );
});