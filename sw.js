

//1. Nombre del cache y archivos a cachear 
const CACHE_NAME = 'mi-cache-v1';
const urlsToCache = [
    "index.html",
    "offline.html",
    "login.html"
];

//2. INSTALL -> se ejecuta al instalar el SW
self.addEventListener("install", event =>{
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache=> cache.addAll(urlsToCache))
    );
});

//3. ACTIVATE -> se ejecuta al activarse (limoia caches viejas)
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key=>key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
})

//4. FETCH -> intercepta participaciones de la app 
//Intercepta cada peticion de la PWA
//Busca primero en cache
//si no esta, busca en internet
//en caso de faltar busca en la pagina offline.html

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch (() => caches.match("offline.html"));
        })
    );
});

//5. PUSH -> notificaciones en segundo plano 
self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificacion sin texto";
    event.waitUntil(
        self.registration.showNotification("Mi PWA", {body: data})
    )
})