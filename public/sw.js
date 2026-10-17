const CACHE_VERSION = 'alpine-explorers-v4-api-origin'
const NAVIGATE_FALLBACK_DENYLIST = [/^\/api\//, /^\/uploads\//]
const EXCLUDED_HOSTS = ['alpineexplorers.onrender.com', 'supabase.co', 'supabase.in']

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.filter((name) => name !== CACHE_VERSION).map((name) => caches.delete(name)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url)
  const isExcludedHost = EXCLUDED_HOSTS.some((host) => requestUrl.hostname === host || requestUrl.hostname.endsWith(`.${host}`))
  const isApiOrUpload = NAVIGATE_FALLBACK_DENYLIST.some((pattern) => pattern.test(requestUrl.pathname))

  // API, uploads, Render, and Supabase are network-only and never enter a cache.
  if (isExcludedHost || isApiOrUpload) {
    event.respondWith(fetch(event.request))
  }
})
