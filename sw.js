const CACHE_NAME = `temperature-converter-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      './',
      './js/converter.js',
      './css/converter.css',
      './manifest.json',
      './img/icon512.png'
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Si está en caché, lo devuelve inmediatamente (Adiós FOUC)
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Si no, va a la red
      return fetch(event.request).then(fetchResponse => {
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        // Clonamos el recurso para guardarlo en caché para la próxima
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return fetchResponse;
      }).catch(() => {
        // Fallback en caso de error de red sin caché
      });
    })
  );
});