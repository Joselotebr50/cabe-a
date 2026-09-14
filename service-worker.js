/* ============================================================
   service-worker.js — cache offline para o PWA
   ============================================================ */

const CACHE = 'cabeca-v1';

/* Arquivos essenciais (obrigatórios para abrir o app) */
const ESSENCIAIS = [
  './',
  './index.html',
  './estilo.css',
  './audio.js',
  './jogo.js',
  './manifest.json'
];

/* Lista de bichos (para pré-cachear imagens) */
const BICHOS = [
  'gato','cachorro','coelho','passarinho','peixinho','hamster',
  'vaca','porco','ovelha','galinha','cavalo','pato',
  'leao','elefante','macaco','tigre','panda',
  'sapo','golfinho','baleia','pinguim','tartaruga'
];

/* Fundos */
const FUNDOS = ['casa','fazenda','selva','agua','rainbow','trofeu'];

/* Monta a lista completa de recursos */
const RECURSOS = [...ESSENCIAIS];
BICHOS.forEach(id => {
  RECURSOS.push(`./imagens/${id}_corpo.png`);
  RECURSOS.push(`./imagens/${id}_cabeca.png`);
});
FUNDOS.forEach(f => RECURSOS.push(`./fundos/${f}.jpg`));

/* ---------- INSTALAÇÃO ---------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      /* addAll falha se algum arquivo não existir.
         Aqui usamos Promise.allSettled para que os que faltam
         não derrubem o cache inteiro. */
      return Promise.allSettled(
        RECURSOS.map(url => cache.add(url).catch(() => null))
      );
    }).then(() => self.skipWaiting())
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

/* ---------- FETCH (estratégia: cache primeiro, depois rede) ---------- */
self.addEventListener('fetch', event => {
  /* Ignora requisições que não são GET */
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(resposta => {
        /* Cacheia o que acabou de baixar (imagens, etc.) */
        if (resposta && resposta.status === 200 && resposta.type === 'basic'){
          const copia = resposta.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copia));
        }
        return resposta;
      }).catch(() => {
        /* Se estiver offline e for uma página, devolve o index */
        if (event.request.mode === 'navigate'){
          return caches.match('./index.html');
        }
        return new Response('', { status: 404 });
      });
    })
  );
});