importScripts('https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/6.5.1/workbox-sw.js');

workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.NetworkFirst()
)
