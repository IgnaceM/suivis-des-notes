const CACHE_NAME = "suivis-des-notes-v1";
const APP_SHELL_URL = new URL("./", self.registration.scope).href;
const INDEX_URL = new URL("./index.html", self.registration.scope).href;
const MANIFEST_URL = new URL("./manifest.json", self.registration.scope).href;
const CACHED_ASSET_DESTINATIONS = new Set(["script", "style", "image", "font"]);

async function precacheAppShell() {
	const cache = await caches.open(CACHE_NAME);
	await cache.addAll([APP_SHELL_URL, INDEX_URL, MANIFEST_URL]);

	const indexResponse = await cache.match(INDEX_URL);
	if (!indexResponse) {
		throw new Error("Impossible de mettre en cache la page principale.");
	}

	const html = await indexResponse.text();
	const basePath = new URL("./", self.registration.scope).pathname;
	const htmlAssetUrls = [];
	const assetPattern = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
	let assetMatch = assetPattern.exec(html);
	while (assetMatch) {
		const url = new URL(assetMatch[1], INDEX_URL);
		if (
			url.origin === self.location.origin &&
			url.pathname.startsWith(basePath) &&
			/\.(?:js|css|svg|png|ico|webp)$/i.test(url.pathname)
		) {
			htmlAssetUrls.push(url.href);
		}
		assetMatch = assetPattern.exec(html);
	}
	const manifestResponse = await cache.match(MANIFEST_URL);
	if (!manifestResponse) {
		throw new Error("Impossible de mettre en cache le manifeste de l'application.");
	}
	const manifest = await manifestResponse.json();
	const iconUrls = manifest.icons.map((icon) => new URL(icon.src, MANIFEST_URL).href);

	await cache.addAll([...new Set([...htmlAssetUrls, ...iconUrls])]);
}

self.addEventListener("install", (event) => {
	event.waitUntil(
		precacheAppShell().then(() => self.skipWaiting())
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames
						.filter(
							(cacheName) =>
								cacheName.startsWith("suivis-des-notes-") &&
								cacheName !== CACHE_NAME
						)
						.map((cacheName) => caches.delete(cacheName))
				)
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	const { request } = event;
	const requestUrl = new URL(request.url);

	if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
		return;
	}

	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request).catch(async () => {
				const cachedShell = await caches.match(INDEX_URL);
				if (!cachedShell) {
					throw new Error("La page hors ligne n'est pas disponible dans le cache.");
				}
				return cachedShell;
			})
		);
		return;
	}

	if (!CACHED_ASSET_DESTINATIONS.has(request.destination)) {
		return;
	}

	event.respondWith(
		caches.match(request).then(async (cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}

			const response = await fetch(request);
			if (response.ok) {
				const cache = await caches.open(CACHE_NAME);
				await cache.put(request, response.clone());
			}
			return response;
		})
	);
});
