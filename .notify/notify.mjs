// Push-Benachrichtigungen für Kingmans Zentrale (läuft per GitHub Actions)
import fs from 'node:fs';
const {ZENTRALE_PW:PW,DATEN_TOKEN:TOK,NTFY_TOPIC:TOPIC}=process.env;
if(!TOPIC)throw new Error('NTFY_TOPIC fehlt');
const SF='.notify/state.json';let S={};try{S=JSON.parse(fs.readFileSync(SF,'utf8'))}catch{}
const tz='Europe/Berlin';
const dstr=d=>d.toLocaleDateString('sv-SE',{timeZone:tz});           // YYYY-MM-DD
const hour=parseInt(new Date().toLocaleString('en-GB',{timeZone:tz,hour:'2-digit',hour12:false}));
const today=dstr(new Date()),tomorrow=dstr(new Date(Date.now()+864e5));
const dt=d=>d.toLocaleString('de-DE',{timeZone:tz,weekday:'short',hour:'2-digit',minute:'2-digit'});
const msgs=[];
async function push(title,body,tags,prio=3){
  let r;try{r=await fetch('https://ntfy.sh/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic:TOPIC,title,message:body,tags:[tags],priority:prio,click:'https://sakomobil-beep.github.io/zentrale/'})});
  }catch(e){console.log('push fehlgeschlagen',e.message);throw e}console.log('push',title,r.status)}
const once=async(key,...a)=>{if(S[key])return;await push(...a);S[key]=today};

/* --- Daten entschlüsseln --- */
let db=null,KEY=null;
if(PW&&TOK){try{
  const r=await fetch('https://api.github.com/repos/sakomobil-beep/zentrale-daten/contents/daten.enc',{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw'}});
  if(!r.ok)throw new Error('GitHub '+r.status);const o=JSON.parse(await r.text());
  const ub=s=>Buffer.from(s,'base64');const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(PW),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:ub(o.salt),iterations:310000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['decrypt','encrypt']);
  db=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(o.iv)},key,ub(o.ct))));KEY=key;
}catch(e){console.log('Daten nicht lesbar:',e.message)}}

/* --- Müll (Vorabend ab 18 Uhr) --- */
const html=fs.readFileSync('index.html','utf8');
const MUELL=JSON.parse(html.match(/const MUELL=(\[.*?\]);/s)[1]);
const MT=Function('return '+html.match(/const MT=(\{.*?\});/)[1])();
if(hour>=18){const m=MUELL.filter(e=>e[0]==tomorrow).map(e=>MT[e[1]]);
  if(m.length)await once('muell-'+tomorrow,'🗑️ '+m.join(', ')+' morgen','Heute Abend rausstellen!','wastebasket',4)}

/* --- Frost (ab 18 Uhr, Open-Meteo Bad König) --- */
if(hour>=18){try{const j=await (await fetch('https://api.open-meteo.com/v1/forecast?latitude=49.745&longitude=9.004&hourly=temperature_2m&forecast_hours=15&timezone=Europe%2FBerlin')).json();
  const lo=Math.min(...j.hourly.temperature_2m);
  if(lo<=0)await once('frost-'+today,'❄️ Frost heute Nacht','Bis '+lo.toFixed(1).replace('.',',')+' °C – Scheibe abdecken, Pflanzen rein.','snowflake',3)}catch(e){console.log('Frost:',e.message)}}

/* --- Polarlicht (jederzeit, einmal pro Sturm) --- */
try{const j=await (await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json')).json();
  let rows;if(Array.isArray(j[0])){const h=j[0].map(x=>String(x).toLowerCase()),ti=h.indexOf('time_tag'),ki=h.indexOf('kp');rows=j.slice(1).map(r=>({t:new Date(String(r[ti]).replace(' ','T')+'Z'),kp:+r[ki]}))}
  else rows=j.map(r=>({t:new Date(String(r.time_tag).replace(' ','T').replace(/Z?$/,'Z')),kp:+r.kp}));
  const now=Date.now(),win=rows.filter(r=>r.t>now-3*36e5&&r.t<now+24*36e5),mx=win.reduce((a,r)=>r.kp>a.kp?r:a,{kp:0});
  if(mx.kp>=6){const last=S.aurora?new Date(S.aurora):0;
    if(!last||now-last>36*36e5){await push('🌌 Polarlicht möglich!','Kp '+mx.kp.toFixed(1).replace('.',',')+(mx.t<=now?' jetzt':' erwartet '+dt(mx.t)+' Uhr')+' – im Odenwald nach Norden schauen.','milky_way',5);S.aurora=new Date().toISOString()}}
}catch(e){console.log('Polarlicht:',e.message)}

/* --- Auto-Fristen & eigene Termine (morgens ab 7 Uhr) --- */
if(db&&hour>=7){
  for(const d of (db.car&&db.car.dl)||[]){const n=Math.round((new Date(d.date+'T12:00Z')-new Date(today+'T12:00Z'))/864e5);
    for(const s of [30,7,1,0])if(n==s)await once('car-'+d.kind+'-'+d.date+'-'+s,'🚗 '+d.kind+(n==0?' heute':' in '+n+(n==1?' Tag':' Tagen')),'Fällig am '+d.date.split('-').reverse().join('.')+(d.note?' – '+d.note:''),'red_car',4);
    if(n<0)await once('car-over-'+d.kind+'-'+d.date+'-'+today.slice(0,7),'🚗 '+d.kind+' überfällig!','War fällig am '+d.date.split('-').reverse().join('.'),'warning',4)}
  const ev=(db.cal||[]).filter(e=>e.date==today).map(e=>e.text);
  if(ev.length)await once('cal-'+today,'📌 Heute',ev.join('\n'),'pushpin',3)}

/* --- Spritpreis (täglich ab 11 Uhr, Tankerkönig) --- */
if(hour>=11&&process.env.TK_KEY){try{
  const j=await (await fetch('https://creativecommons.tankerkoenig.de/json/list.php?lat=49.743&lng=9.006&rad=10&sort=price&type=e10&apikey='+encodeURIComponent(process.env.TK_KEY))).json();
  if(!j.ok)throw new Error(j.message);const op=(j.stations||[]).filter(s=>s.price&&s.isOpen);
  if(op.length){const p=v=>v.toFixed(3).replace('.',','),b=op[0];
    const txt=op.slice(0,3).map((s,i)=>(i?'':'👉 ')+p(s.price)+' € – '+(s.brand||s.name)+' '+s.place+' ('+s.dist.toFixed(1).replace('.',',')+' km)').join('\n');
    await once('sprit-'+today,'⛽ E10 ab '+p(b.price)+' € bei '+(b.brand||b.name),txt,'fuelpump',3)}
}catch(e){console.log('Sprit:',e.message)}}

/* --- Regen-Radar (DWD RADOLAN über Bright Sky), 6–23 Uhr --- */
if(hour>=6&&hour<23){try{
  const j=await (await fetch('https://api.brightsky.dev/radar?lat=49.743&lon=9.006&distance=0&format=plain&tz=Europe/Berlin')).json();
  const now=Date.now(),L=(j.radar||[]).map(r=>{const v=r.precipitation_5,x=Array.isArray(v)?(Array.isArray(v[0])?v[0][0]:v[0]):v;return{t:new Date(r.timestamp),mm:(+x||0)/100}}).filter(r=>r.t>=now-3e5).sort((a,b)=>a.t-b.t);
  const wet=r=>r.mm>=0.01,hm=d=>d.toLocaleTimeString('de-DE',{timeZone:tz,hour:'2-digit',minute:'2-digit'});
  if(L.length&&!wet(L[0])){const first=L.find(r=>wet(r)&&r.t-now<=75*6e4);
    const last=S.rain?new Date(S.rain).getTime():0;
    if(first&&now-last>3*36e5){const rest=L.slice(L.indexOf(first)),dry=rest.find(r=>!wet(r)),seg=rest.slice(0,dry?rest.indexOf(dry):rest.length);
      const mmh=Math.max(...seg.map(r=>r.mm))*12,art=mmh<0.5?'leichter':mmh<4?'mäßiger':'starker',mins=Math.max(5,Math.round((first.t-now)/6e4/5)*5);
      await push('☔ Regen in ca. '+mins+' Minuten',art[0].toUpperCase()+art.slice(1)+' Regen ab ca. '+hm(first.t)+' Uhr'+(dry?', bis etwa '+hm(dry.t)+' Uhr.':'.')+' Wäsche rein, Fenster zu!','umbrella',4);S.rain=new Date().toISOString()}}
  if(L.length&&wet(L[0]))S.rain=new Date().toISOString(); /* während es regnet: keine erneute Warnung */
}catch(e){console.log('Radar:',e.message)}}

/* --- Website-Statistik (GoatCounter) → verschlüsselt nach zentrale-daten, stündlich --- */
if(KEY&&process.env.GC_TOKEN&&(!S.statsAt||Date.now()-new Date(S.statsAt)>50*6e4)){try{
  const api='https://'+(process.env.GC_CODE||'wetter-badkoenig')+'.goatcounter.com/api/v0',h={Authorization:'Bearer '+process.env.GC_TOKEN,'Content-Type':'application/json'};
  const end=dstr(new Date(Date.now()+864e5)),start=dstr(new Date(Date.now()-29*864e5)),q='start='+start+'&end='+end;
  const g=async u=>{const r=await fetch(api+u,{headers:h});if(!r.ok)throw new Error(u+' '+r.status);await new Promise(x=>setTimeout(x,300));return r.json()};
  const st=async n=>((await g('/stats/'+n+'?'+q+'&limit=10')).stats||[]);
  const W={at:Date.now(),total:await g('/stats/total?'+q),hits:((await g('/stats/hits?'+q+'&limit=15')).hits||[]).map(x=>({path:x.path,title:x.title,count:x.count})),
    refs:await st('toprefs'),loc:await st('locations'),sizes:await st('sizes'),br:await st('browsers'),sys:await st('systems')};
  const iv=crypto.getRandomValues(new Uint8Array(12)),ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},KEY,new TextEncoder().encode(JSON.stringify(W))));
  const body=JSON.stringify({v:1,iv:Buffer.from(iv).toString('base64'),ct:Buffer.from(ct).toString('base64')});
  const U='https://api.github.com/repos/sakomobil-beep/zentrale-daten/contents/stats-wetter.enc',GH={Authorization:'Bearer '+TOK,Accept:'application/vnd.github+json'};
  const old=await fetch(U,{headers:GH});const sha=old.ok?(await old.json()).sha:undefined;
  const r=await fetch(U,{method:'PUT',headers:GH,body:JSON.stringify({message:'Website-Statistik',content:Buffer.from(body).toString('base64'),...(sha?{sha}:{})})});
  console.log('Statistik gespeichert',r.status);if(r.ok)S.statsAt=new Date().toISOString();
}catch(e){console.log('Statistik:',e.message)}}

/* --- aufräumen & speichern --- */
const cut=dstr(new Date(Date.now()-60*864e5));for(const k in S)if(k!='aurora'&&k!='rain'&&k!='statsAt'&&S[k]<cut)delete S[k];
fs.writeFileSync(SF,JSON.stringify(S,null,1));
