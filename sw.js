const CACHE = 'pistachio-v3-arte-b-2';
const ARQUIVOS = ['./','./index.html','./manifest.webmanifest','./icone-180.png','./icone-192.png','./icone-512.png','./robots.txt','./assets/arte-b.js','./assets/estilo-b-catalogo.png','./assets/estilo-b-cuidados.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(ARQUIVOS.map(url => new Request(url, {cache:'reload'}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ns => Promise.all(ns.filter(n => n.startsWith('pistachio-') && n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  // Revalidate the game document online; preserve the installed game offline.
  if(e.request.mode === 'navigate'){
    e.respondWith(fetch(new Request(e.request, {cache:'no-cache'})).then(async res => {
      if(!res.ok) throw new Error('Navigation unavailable');
      const c = await caches.open(CACHE);
      await c.put(e.request, res.clone());
      return res;
    }).catch(async () => (await caches.match(e.request, {ignoreSearch:true})) || caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(async res => {
    if(res.ok && res.type === 'basic'){
      const c = await caches.open(CACHE);
      await c.put(e.request, res.clone());
    }
    return res;
  })));
});
