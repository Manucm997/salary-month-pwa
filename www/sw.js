const CACHE='salary-month-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.pathname.includes('/api/'))return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;
  }).catch(()=>caches.match('index.html'))));
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('./'))});
