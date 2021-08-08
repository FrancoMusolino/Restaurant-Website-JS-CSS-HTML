const CACHE_NAME = 'v1_cache_restaurant_website',
    urlsToCache = [
        './',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
        'https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJbecmNE.woff2',
        'https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css',
        'https://cdn.jsdelivr.net/npm/boxicons@2.0.5/fonts/boxicons.woff2',
        './assets/css/style.css',
        './assets/js/main.js',
        './assets/img/plate1.png',
        './assets/img/plate2.png',
        './assets/img/favicon.ico'
    ]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return caches.addAll(urlsToCache)
                    .then(() => self.skipWaiting())
            })
            .catch(err => console.log(err))
    )
})

self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME]

    e.waitUntil(
        caches.keys()
            .then(cachesNames => {
                return Promise.all(
                    cachesNames.map(cacheName => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
            .then(() => self.clients.claim())
    )
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if (res) {
                    return res
                }

                return fetch(e.request)
            })
    )
})