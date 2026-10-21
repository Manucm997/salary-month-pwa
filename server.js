// Tiny dependency-free server: serves the app and stores data in data.json
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'www'),dbf=path.join(__dirname,'data.json');
const port=process.env.PORT||3000,host=process.env.HOST||'127.0.0.1';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml'};
http.createServer((q,s)=>{
  const u=decodeURIComponent(new URL(q.url,'http://x').pathname);
  if(u==='/api/data'){
    if(q.method==='GET'){fs.readFile(dbf,'utf8',(e,t)=>{s.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});s.end(e?'{}':t)});return}
    if(q.method==='PUT'){
      let b='';q.on('data',c=>{b+=c;if(b.length>5e6)q.destroy()});
      q.on('end',()=>{try{JSON.parse(b);fs.writeFileSync(dbf+'.tmp',b);fs.renameSync(dbf+'.tmp',dbf);s.writeHead(204);s.end()}catch(e){s.writeHead(400);s.end()}});
      return;
    }
    s.writeHead(405);return s.end();
  }
  const f=path.normalize(path.join(root,u==='/'?'index.html':u));
  if(!f.startsWith(root)){s.writeHead(403);return s.end()}
  fs.readFile(f,(e,d)=>{
    if(e){s.writeHead(404);return s.end('Not found')}
    s.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-cache'});s.end(d);
  });
}).listen(port,host,()=>console.log('Salary Month is running at http://localhost:'+port));
