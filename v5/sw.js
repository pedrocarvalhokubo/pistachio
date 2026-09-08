const CACHE = 'pistachio-v5-gestos-1';
const ARQUIVOS = ['./','./index.html','./manifest.webmanifest','./icone-180.png','./icone-192.png','./icone-512.png','./robots.txt','./assets/arte-b.js?v=4','./assets/catalogo.js?v=4','./assets/estado.js?v=4.1','./assets/jogo.js?v=5','./assets/jogo.css?v=5','./assets/estilo-b-catalogo.png','./assets/estilo-b-cuidados.png','./assets/estilo-b-moveis.png','./assets/cenarios.png','./assets/armario.png','./assets/gestos.js?v=5','./assets/paginas.js?v=5','./assets/roupas-vestidas.png','./assets/banho.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ns=>Promise.all(ns.filter(n=>n.startsWith('pistachio-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(new Request(e.request,{cache:'no-cache'})).then(async r=>{if(!r.ok)throw Error();const c=await caches.open(CACHE);await c.put('./index.html',r.clone());return r;}).catch(()=>caches.match('./index.html')));return;
 }
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(async r=>{if(r.ok&&r.type==='basic'){const c=await caches.open(CACHE);await c.put(e.request,r.clone());}return r;})));
});
