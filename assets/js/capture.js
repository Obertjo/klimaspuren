(() => {
const store=window.KSStore, cfg=window.KLIMASPUREN_CONFIG;
const status=document.getElementById('capture-status');
if(!window.L || !store || !cfg){status.textContent='Kartenbibliothek oder Skript nicht geladen. Bitte Internetverbindung prüfen.';return;}
const map=L.map('capture-map').setView(cfg.center,cfg.zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap-Mitwirkende'}).addTo(map);
const group=L.layerGroup().addTo(map);let selected=null, pin=null,photo='';
let observations=store.read();
const coord=document.getElementById('capture-coordinates');
const obsDate=document.getElementById('obs-date');
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
obsDate.value=today();
function setPos(ll){selected=ll;if(pin)map.removeLayer(pin);pin=L.circleMarker(ll,{radius:8,color:'#c7864e',weight:3,fillColor:'#f5d6a5',fillOpacity:1}).addTo(map);coord.textContent=`${ll.lat.toFixed(5)}, ${ll.lng.toFixed(5)}`;}
map.on('click',e=>setPos(e.latlng));
document.getElementById('capture-reset').addEventListener('click',()=>{selected=null;if(pin)map.removeLayer(pin);pin=null;coord.textContent='Noch kein Ort ausgewählt';map.setView(cfg.center,cfg.zoom);});
function announce(text,warning=false){status.textContent=text;status.classList.toggle('warn',warning);}
const fileInput=document.getElementById('obs-photo');const preview=document.getElementById('obs-photo-preview');
function convertPhoto(file){return new Promise((resolve,reject)=>{
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))return reject(Error('Nur JPEG, PNG oder WebP erlaubt.'));
 if(file.size>8*1024*1024)return reject(Error('Das Ausgangsfoto darf höchstens 8 MB groß sein.'));
 const reader=new FileReader();reader.onerror=()=>reject(Error('Foto konnte nicht gelesen werden.'));
 reader.onload=()=>{const image=new Image();image.onerror=()=>reject(Error('Ungültige Bilddatei.'));
 image.onload=()=>{const max=1100,scale=Math.min(1,max/Math.max(image.width,image.height));const w=Math.round(image.width*scale),h=Math.round(image.height*scale);if(!w||!h)return reject(Error('Ungültige Bildgröße.'));
 const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(image,0,0,w,h);const out=c.toDataURL('image/jpeg',.72);if(out.length>1500000)return reject(Error('Foto ist nach Komprimierung zu groß.'));resolve(out);};image.src=reader.result;};reader.readAsDataURL(file);
});}
fileInput.addEventListener('change',async()=>{photo='';preview.style.display='none';const f=fileInput.files?.[0];if(!f)return;announce('Foto wird lokal verarbeitet …');try{photo=await convertPhoto(f);preview.src=photo;preview.style.display='block';announce('Foto für den lokalen Datensatz vorbereitet. Es wurde nicht hochgeladen.');}catch(e){announce(e.message,true);fileInput.value='';}});
function render(){group.clearLayers();document.getElementById('capture-count').textContent=`(${observations.length})`;const list=document.getElementById('capture-list');list.replaceChildren();if(!observations.length){const p=document.createElement('p');p.className='muted';p.textContent='Noch keine Beobachtungen gespeichert.';list.appendChild(p);return;}
 [...observations].reverse().forEach((f)=>{const p=f.properties;const loc=L.latLng(f.geometry.coordinates[1],f.geometry.coordinates[0]);const colors={Gruenstruktur:'#3d8455',Versiegelung:'#a16d56',Potenzial:'#b28c37'};L.circleMarker(loc,{radius:8,weight:2,color:'#fff',fillColor:colors[p.category]||'#32724c',fillOpacity:1}).bindPopup(store.safePopup(f)).addTo(group);
 const row=document.createElement('div');row.className='observation';if(p.photo_data_url){const image=document.createElement('img');image.className='observation-image';image.src=p.photo_data_url;image.alt='Foto der Beobachtung';row.appendChild(image);}
 const body=document.createElement('div');body.style.flex='1';const title=document.createElement('strong');title.textContent=p.site||store.categoryName(p.category);const meta=document.createElement('span');meta.className='meta';meta.textContent=`${store.categoryName(p.category)} · ${p.date || 'ohne Datum'}`;const info=document.createElement('div');info.className='small muted';info.textContent=p.note||p.green||'';body.append(title,meta,info);row.appendChild(body);
 const deleteBtn=document.createElement('button');deleteBtn.className='btn quiet smallbtn';deleteBtn.type='button';deleteBtn.textContent='Löschen';deleteBtn.addEventListener('click',()=>{observations=observations.filter(a=>a.properties.id!==p.id);store.write(observations);render();announce('Beobachtung gelöscht.');});row.appendChild(deleteBtn);list.appendChild(row);
 });}
const val=id=>document.getElementById(id).value.trim();
document.getElementById('observation-form').addEventListener('submit',e=>{
 e.preventDefault();if(!selected){announce('Bitte zunächst einen Standort durch Klick auf die Karte auswählen.',true);return;}
 if(observations.length>=100){announce('Maximal 100 Beobachtungen in der lokalen Sammlung. Bitte zuerst exportieren.',true);return;}
 const feature={type:'Feature',geometry:{type:'Point',coordinates:[Number(selected.lng.toFixed(6)),Number(selected.lat.toFixed(6))]},properties:{id:'obs-'+Date.now()+'-'+Math.floor(Math.random()*10000),site:val('obs-site'),date:val('obs-date'),time:val('obs-time'),category:val('obs-category'),green:val('obs-green'),surface:val('obs-surface'),sealing:val('obs-seal'),shade:val('obs-shade'),perception:val('obs-perception'),proposal:val('obs-proposal'),note:val('obs-note'),photo_data_url:photo,created_at:new Date().toISOString()}};
 const f=store.sanitize(feature);observations.push(f);const saved=store.write(observations);render();
 document.getElementById('observation-form').reset();const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
obsDate.value=today();photo='';preview.style.display='none';preview.removeAttribute('src');
 announce(saved?'Beobachtung im Browser gespeichert. Du kannst sie unten als GeoJSON herunterladen.':'Beobachtung nur für diese Sitzung erfasst; Speicher voll oder nicht verfügbar. Bitte GeoJSON jetzt herunterladen.',!saved);
});
document.getElementById('capture-export').addEventListener('click',()=>{if(!observations.length){announce('Es gibt noch keine Beobachtungen zum Exportieren.',true);return;}store.exportGeoJSON(observations);announce('GeoJSON-Datei wird heruntergeladen.');});
document.getElementById('capture-import').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>15*1024*1024)throw Error('Datei ist zu groß.');const data=JSON.parse(await file.text());if(data.type!=='FeatureCollection'||!Array.isArray(data.features))throw Error('Bitte eine gültige GeoJSON-FeatureCollection auswählen.');const clean=data.features.slice(0,100).map(store.sanitize).filter(Boolean);if(!clean.length)throw Error('Keine gültigen Punktbeobachtungen gefunden.');const ids=new Set(observations.map(f=>f.properties.id));const extras=clean.filter(f=>!ids.has(f.properties.id));observations=observations.concat(extras).slice(0,100);const saved=store.write(observations);render();announce(`${extras.length} Punktbeobachtungen eingelesen. ${saved?'Im Browser gespeichert.':'Bitte sofort exportieren; lokaler Speicher nicht verfügbar.'}`,!saved);}catch(ex){announce('Import nicht möglich: '+ex.message,true);}e.target.value='';});
render();setTimeout(()=>map.invalidateSize(),150);
})();
