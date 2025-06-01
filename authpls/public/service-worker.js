/* eslint-disable no-restricted-globals */

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("v1").then((cache) =>
            cache.addAll([
                "/",
                "/index.html",
                "/static/js/bundle.js",
                "/sounds/success.mp3",
                "/sounds/error.mp3",
            ])
        )
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});

/* eslint-enable no-restricted-globals */