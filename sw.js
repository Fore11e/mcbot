// Speichert die App-Dateien, damit sie auch ohne Netz startet. Holt aber IMMER zuerst die neueste Version.
const CACHE = 'mcbot-v12';
const DATEIEN = ['./', './index.html', './manifest.json', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Daten (Firebase usw.) nie aus dem Cache
  // cache: 'no-store' = am Browser-Zwischenspeicher vorbei, damit Updates sofort ankommen
  e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => { const k = r.clone(); caches.open(CACHE).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request)));
});
