const CACHE_NAME = 'two-hearts-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;

// Assets to cache immediately (critical for offline game functionality)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/game/Game.js',
  '/src/game/Player.js',
  '/src/game/ClimbingWall.js',
  '/src/game/Renderer.js',
  '/src/game/InputManager.js',
  '/src/game/QuestionManager.js',
  '/src/utils/EventEmitter.js',
  '/manifest.json'
];

// Network-first resources (multiplayer functionality)
const NETWORK_FIRST = [
  '/src/network/',
  'socket.io'
];

// Cache-first resources (static game assets)
const CACHE_FIRST = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.woff',
  '.woff2'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('two-hearts-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests except for CDN assets
  if (url.origin !== location.origin && !url.hostname.includes('cdn')) {
    return;
  }

  // Network-first strategy for multiplayer/network resources
  if (NETWORK_FIRST.some(pattern => request.url.includes(pattern))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Cache-first strategy for static assets
  if (CACHE_FIRST.some(ext => request.url.includes(ext))) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Stale-while-revalidate for HTML and other resources
  event.respondWith(staleWhileRevalidateStrategy(request));
});

// Network-first: Try network, fallback to cache (good for dynamic content)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline - Network required for this feature', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache-first: Try cache, fallback to network (good for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to fetch:', request.url, error);
    return new Response('Resource not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Stale-while-revalidate: Return cache immediately, update in background
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkResponsePromise;
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any queued offline actions here
  console.log('[SW] Processing background sync tasks');
}

// Handle push notifications (for future multiplayer notifications)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Your climbing partner is waiting!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'climbing-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'join',
          title: 'Join Game'
        },
        {
          action: 'dismiss',
          title: 'Later'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Two Hearts, One Summit', options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'join') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});