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

//Se instala el Service Worker, pasa solo 1 vez
self.addEventListener('install', e => {
    e.waitUntil(
        //Abrime en el cacheStorage el cache con ese nombre, devuelve una promesa
        caches.open(CACHE_NAME)
            .then(cache => {
                //Una vez que hayas abierto el cache con ese nombre, añadi todas estas Urls a ese cache
                return cache.addAll(urlsToCache)
                    //Evitamos la espera, se activo ni bien termina la instalación
                    .then(() => self.skipWaiting())
            })
            .catch(err => console.log(err))
    )
})


//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME]

    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        //Eliminamos lo que ya no se necesita en cache
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
            // Le indica al SW activar el cache actual
            .then(() => self.clients.claim())
    )
})


//Cuando el navegador recupera una url
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