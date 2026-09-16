// ============================================================
//  SERVICE WORKER - Mental Math Trainer v3.0.0
//  Handles offline caching and app functionality
// ============================================================

const CACHE_NAME = 'math-trainer-v3';

// All files to cache for offline use
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// ============================================================
//  INSTALL EVENT
//  Downloads and caches all important files
// ============================================================
self.addEventListener('install', event => {
    console.log('📦 Service Worker: Installing...');

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

    // Activate immediately without waiting
    self.skipWaiting();
});

// ============================================================
//  ACTIVATE EVENT
//  Cleans up old caches when a new version is available
// ============================================================
self.addEventListener('activate', event => {
    console.log('🟢 Service Worker: Activated');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    // Delete old caches that don't match current version
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );

    // Take control of all pages immediately
    self.clients.claim();
});

// ============================================================
//  FETCH EVENT
//  Intercepts network requests
//  Serves from cache if available, falls back to network
// ============================================================
self.addEventListener('fetch', event => {

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {

                // If found in cache, return cached version
                if (cachedResponse) {
                    console.log('📂 Service Worker: Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // If not in cache, fetch from network
                console.log('🌐 Service Worker: Fetching from network:', event.request.url);

                return fetch(event.request)
                    .then(networkResponse => {

                        // Don't cache if not a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone the response (can only be used once)
                        const responseToCache = networkResponse.clone();

                        // Cache the new resource for next time
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    });
            })
            .catch(err => {
                console.log('⚠️ Service Worker: Fetch failed:', err);

                // If both cache and network fail
                // Return cached index.html for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});

// ============================================================
//  MESSAGE EVENT
//  Listen for messages from the main app
//  Useful for triggering cache updates
// ============================================================
self.addEventListener('message', event => {

    // Force update cache when app sends update message
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('🔄 Service Worker: Skipping wait, activating new version');
        self.skipWaiting();
    }

    // Clear all caches when app sends clear message
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        console.log('🗑️ Service Worker: Clearing all caches');
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cache => caches.delete(cache));
        });
    }
});