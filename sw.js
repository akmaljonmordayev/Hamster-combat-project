const cacheName = 'hamster-combat-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(response => response || fetch(evt.request))
  );
});
  