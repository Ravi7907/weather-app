// ═══════════════════════════════════
//  SKYCAST — Service Worker (PWA)
// ═══════════════════════════════════

const CACHE_NAME = 'skycast-v1';
const CACHE_VERSION = 1;

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'
];

// ── Install: Cache all static assets ──
self.addEventListener('install', event => {
  console.log('SKYCAST SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SKYCAST SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ── Activate: Clean old caches ──
self.addEventListener('activate', event => {
  console.log('SKYCAST SW: Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('SKYCAST SW: Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch: Network first, fallback to cache ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // For API calls — always go to network (need live data)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // API failed — return offline message
          return new Response(
            JSON.stringify({ error: 'You are offline. Please check your connection.' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // For static files — cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // Serve from cache
        }
        // Not in cache — fetch from network and cache it
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Both cache and network failed
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});