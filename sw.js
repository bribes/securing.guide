const CACHE_NAME = 'securing.guide-v1.1';

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Make this SW activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll([
            '/',
            '/2fa',
            '/discord',
            '/minecraft',
            '/tiktok',
            '/twitch',
            '/epic',
            '/snapchat',
            '/kick',
            '/twitter',
            '/valorant',
            '/instagram',
            '/playstation',
            '/steam',
            '/steam-id',
            '/js/generate.js',
            '/js/steamid.js',
            '/guides/discord.js',
            '/guides/minecraft.js',
            '/guides/steam.js',
            '/guides/tiktok.js',
            '/guides/twitch.js',
            '/guides/epic.js',
            '/guides/snapchat.js',
            '/guides/kick.js',
            '/guides/twitter.js',
            '/guides/valorant.js',
            '/guides/instagram.js',
            '/guides/playstation.js',
            'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy.umd.min.js',
            'https://totp.codes/js/rolling-number.js'
        ]))
    );
});

self.addEventListener('activate', (event) => {
    self.clients.claim(); // Take control of clients immediately
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});

self.addEventListener('fetch', (event) => {
    // Always try the network first
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                const cloned = networkResponse.clone();

                // If it's a good response, cache it
                if (
                    networkResponse &&
                    (networkResponse.type === 'basic' || networkResponse.type === 'cors') &&
                    networkResponse.status === 200
                ) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, cloned);
                    });
                }

                return networkResponse;
            })
            .catch(() => {
                // If network fails, use cache
                return caches.match(event.request).then((cachedResponse) => {
                    // For navigation fallback
                    if (!cachedResponse && event.request.mode === 'navigate') {
                        return caches.match('/');
                    }
                    return cachedResponse;
                });
            })
    );
});