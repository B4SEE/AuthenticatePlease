/* eslint-disable no-restricted-globals */

// Cache names
const CACHE_NAME = 'authpls-v1';
const DYNAMIC_CACHE = 'authpls-dynamic-v1';

// Assets to cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/static/js/bundle.js',
  '/sounds/success.mp3',
  '/sounds/error.mp3',
  '/logo.svg',
  '/AuthenticatePlease.png',
  '/manifest.json',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        // Make network request and cache the response
        return fetch(fetchRequest)
          .then((response) => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it can only be used once
            const responseToCache = response.clone();

            // Cache the fetched response
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If offline and requesting a page, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Handle offline sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncGameData') {
    event.waitUntil(syncGameData());
  }
});

// Background sync function
async function syncGameData() {
  try {
    const gameData = await localforage.getItem('offlineGameData');
    if (gameData) {
      await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      await localforage.removeItem('offlineGameData');
    }
  } catch (error) {
    console.error('Error syncing data:', error);
  }
}

/* eslint-enable no-restricted-globals */