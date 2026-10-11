const CACHE_NAME = "ius-routine-v4";

const CORE_PAGES = [
  "/",
  "/section",
  "/today",
  "/retake",
  "/teacher",
  "/room",
  "/author"
];

const STATIC_ASSETS = [
  "/manifest.json",
  "/logo.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/og-image.png",
  "/building-sketch.jpg"
];

// Precache core pages and assets on install
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        [...CORE_PAGES, ...STATIC_ASSETS].map(async (url) => {
          try {
            const res = await fetch(url, { cache: "reload" });
            if (res && res.status === 200) {
              await cache.put(url, res);
            }
          } catch (err) {
            console.warn(`[SW] Precache failed for ${url}:`, err);
          }
        })
      );
    })
  );
});

// Take immediate control on activate & remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
    ])
  );
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // 1. Static Next.js Chunks, CSS, and Images -> Cache First (Instant 0ms load)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2?)$/i)
  ) {
    event.respondWith(
      caches.match(request).then(async (cached) => {
        if (cached) return cached;
        try {
          const networkRes = await fetch(request);
          if (networkRes && networkRes.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkRes.clone());
          }
          return networkRes;
        } catch (err) {
          return caches.match(url.pathname);
        }
      })
    );
    return;
  }

  // 2. Navigation & Next.js RSC / Data requests -> Network First with smart offline fallback
  event.respondWith(
    fetch(request)
      .then(async (networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkRes.clone());
          // Also cache under clean pathname without query params (vital for ?_rsc=...)
          if (url.search) {
            cache.put(url.pathname, networkRes.clone());
          }
        }
        return networkRes;
      })
      .catch(async () => {
        // We are offline!
        // Try exact request match
        const exactMatch = await caches.match(request);
        if (exactMatch) return exactMatch;

        // Try pathname without query string (vital for Next.js ?_rsc=... client navigations)
        const pathnameMatch = await caches.match(url.pathname);
        if (pathnameMatch) return pathnameMatch;

        // If navigating to a page, fall back to cached homepage shell
        if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
          const rootMatch = await caches.match("/");
          if (rootMatch) return rootMatch;
        }

        // Return responsive offline page if route was never visited
        return new Response(
          `<!DOCTYPE html>
          <html lang="en" class="dark">
          <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>IUS Routine - Offline Mode</title>
            <style>
              body { background: #0B1120; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
              .card { background: #1E293B; border: 1px solid #334155; padding: 32px; border-radius: 24px; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
              h2 { margin: 0 0 12px 0; color: #F59E0B; }
              p { color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
              button { background: #4F46E5; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>⚡ Offline Mode Active</h2>
              <p>You are currently offline. Open any previously loaded routine section or tap below to open the cached home page.</p>
              <button onclick="window.location.href='/'">Go to Cached Routine Home</button>
            </div>
          </body>
          </html>`,
          { headers: { "Content-Type": "text/html" } }
        );
      })
  );
});
