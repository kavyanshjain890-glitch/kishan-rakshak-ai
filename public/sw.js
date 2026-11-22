// Service Worker for KISHAN RAKSHAK AI (PWA Offline First)
const CACHE_NAME = 'kishan-rakshak-v2';
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/scanner',
  '/weather',
  '/diseases',
  '/manifest.json',
  '/favicon.ico'
];

// Install Event: Precache app shell and offline fallback
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching App Shell and Offline Assets');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Non-critical precache fetch issue:', err);
      });
    })
  );
});

// Activate Event: Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-first for dynamic content & API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests or chrome-extension URLs
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // In development (localhost), bypass SW caching for Next.js bundles to allow instant hot reloading
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // Static Next.js chunks, fonts, or images -> Cache-first
  if (url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Navigation requests (HTML pages) -> Network-first with /offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('/offline');
          });
        })
    );
    return;
  }

  // API calls -> Network-first with cached JSON fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
