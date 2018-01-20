const CACHE_NAME = "css-grid-playground";
const URLS_TO_CACHE  = [
    "https://michalgrochowski.github.io/grid-playground/dist/",
    "https://michalgrochowski.github.io/grid-playground/dist/index.html",
    "https://michalgrochowski.github.io/grid-playground/dist/manifest.json",
    "https://fonts.googleapis.com/css?family=Ubuntu:400,700&amp;subset=latin-ext",
    "https://michalgrochowski.github.io/grid-playground/dist/css/main.min.css",
    "https://michalgrochowski.github.io/grid-playground/dist/js/main.min.js",
    "https://michalgrochowski.github.io/grid-playground/dist/font/fontello.eot",
    "https://michalgrochowski.github.io/grid-playground/dist/font/fontello.svg",
    "https://michalgrochowski.github.io/grid-playground/dist/font/fontello.ttf",
    "https://michalgrochowski.github.io/grid-playground/dist/font/fontello.woff",
    "https://michalgrochowski.github.io/grid-playground/dist/font/fontello.woff2",
    "https://michalgrochowski.github.io/grid-playground/dist/android-chrome-36x36.png",
    "https://michalgrochowski.github.io/grid-playground/dist/android-chrome-48x48.png",
    "https://michalgrochowski.github.io/grid-playground/dist/android-chrome-72x72.png",
    "https://michalgrochowski.github.io/grid-playground/dist/android-chrome-96x96.png",
    "https://michalgrochowski.github.io/grid-playground/dist/android-chrome-144x144.png",
    "https://michalgrochowski.github.io/grid-playground/dist/android-chrome-192x192.png",
    "https://michalgrochowski.github.io/grid-playground/dist/android-chrome-256x256.png",
    "https://michalgrochowski.github.io/grid-playground/dist/android-chrome-512x512.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-60x60.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-57x57.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-72x72.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-76x76.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-114x114.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-120x120.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-144x144.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-152x152.png",
    "https://michalgrochowski.github.io/grid-playground/dist/apple-touch-icon-180x180.png",
    "https://michalgrochowski.github.io/grid-playground/dist/browserconfig.xml",
    "https://michalgrochowski.github.io/grid-playground/dist/favicon.ico",
    "https://michalgrochowski.github.io/grid-playground/dist/favicon-16x16.png",
    "https://michalgrochowski.github.io/grid-playground/dist/favicon-32x32.png",
    "https://michalgrochowski.github.io/grid-playground/dist/mstile-144x144.png",
    "https://michalgrochowski.github.io/grid-playground/dist/mstile-150x150.png",
    "https://michalgrochowski.github.io/grid-playground/dist/safari-pinned-tab.svg"
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.includes("css-grid-playground") && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
            if (response) {
                return response;
            }
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(
            function(response) {
                if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
                .then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                }
            );
        })
    );
});