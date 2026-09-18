// ============================================================
//  SERVICE WORKER - Mental Math Trainer v3.2.0
//  Version 8 Cache - Forces fresh files
// ============================================================

const CACHE_NAME = 'math-trainer-v8';

const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// INSTALL - Cache all files
self.addEventListener('install', event => {
    console.log('📦 Service Worker: Installing v8...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Service Worker: Caching all files');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('❌ Service Worker: Cache failed:', err);
            })
    );
    // IMPORTANT: Activate immediately, don't wait
    self.skipWaiting();
});

// ACTIVATE - Delete ALL old caches
self.addEventListener('activate', event => {
    console.log('🟢 Service Worker: Activated v8');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // IMPORTANT: Take control immediately
    self.clients.claim();
});

// FETCH - Network First, then Cache
// This ensures users always get the latest version
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Got fresh response from network
                if (networkResponse && networkResponse.status === 200) {
                    // Save it to cache for offline use
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return networkResponse;
            })
            .catch(() => {
                // Network failed, try cache (offline mode)
                console.log('📂 Service Worker: Serving from cache (offline)');
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // If nothing in cache either, return index.html
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Listen for update messages
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cache => caches.delete(cache));
        });
    }
});
