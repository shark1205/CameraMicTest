self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('task-cache').then(cache => {
      return cache.addAll([
        '/CameraMicTest/',
        '/CameraMicTest/index.html',
        '/CameraMicTest/manifest.json',
        '/CameraMicTest/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});