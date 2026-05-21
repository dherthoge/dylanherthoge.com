// Minimal service worker. Its job here is twofold:
// 1. Satisfy Chrome / Edge's PWA installability requirement, which wants a
//    registered service worker with a `fetch` event handler so the browser
//    can show the "Install this app" prompt.
// 2. Stay out of the way. We do NOT cache anything here — Cloudflare's edge
//    cache + the immutable headers on /_astro/* already give us fast
//    repeat visits. A service worker that caches incorrectly would serve
//    stale HTML for hours and undo the whole "push to deploy" loop.
//
// If/when we ever want real offline support or stale-while-revalidate
// behavior, this file is the place to add it.

self.addEventListener('install', () => {
	// Activate immediately instead of waiting for old tabs to close. Safe
	// since we have no cached state to migrate.
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	// Claim any open tabs that loaded before this SW activated.
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
	// Intentional passthrough. The existence of this handler is what tells
	// Chrome the site is "PWA-installable"; the empty body means every
	// request continues to hit the network normally.
});
