/* NEPA-PRO Dialer — Service Worker
   Cache-first for app shell, network-first with cache fallback for other GETs.
*/
const VERSION = 'nepa-dialer-v1.0.0';
const CORE = [
  './',
  './index.html',
  './app.js',
  './leads-pizza.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-1024.png',
  './icons/apple-touch-icon.png',
  './icons/icon-152.png',
  './icons/icon-167.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './icons/favicon.ico',
  './icons/icon.svg',
  './icons/og-card.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(VERSION).then(c=> c.addAll(CORE).catch(err=>{
      console.warn('[SW] Some core assets failed to cache:', err);
      // best-effort caching
      return Promise.all(CORE.map(u=> c.add(u).catch(()=>null)));
    }))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==VERSION).map(k=> caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Don't cache cross-origin (e.g., QR API) — let network handle
  if (url.origin !== self.location.origin) return;

  // Cache-first for core assets and same-origin static
  e.respondWith(
    caches.match(req).then(cached=>{
      if (cached) return cached;
      return fetch(req).then(res=>{
        // Only cache successful basic responses
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(VERSION).then(c=> c.put(req, clone));
        return res;
      }).catch(()=> caches.match('./index.html'));
    })
  );
});

// Allow page to nudge updates
self.addEventListener('message', e=>{
  if (e.data === 'skipWaiting') self.skipWaiting();
});
