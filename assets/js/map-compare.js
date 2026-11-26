(() => {
const say = (msg)=>{const s=document.getElementById('map-status'); if(s)s.textContent=msg;};
if (!window.L) {say('Die Kartenbibliothek Leaflet wurde nicht geladen. Bitte Internetverbindung prüfen.');return;}
const cfg=window.KLIMASPUREN_CONFIG;
if(!cfg){say('Karteneinstellungen fehlen.');return;}
const opts={preferCanvas:true,zoomControl:true};
const left=L.map('map-left',opts).setView(cfg.center,cfg.zoom);
const right=L.map('map-right',opts).setView(cfg.center,cfg.zoom);
const osmUrl='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
function createBackground(map){
 L.tileLayer(osmUrl,{maxZoom:19,attribution:'© OpenStreetMap-Mitwirkende'}).addTo(map);
 const orth=L.tileLayer.wms(cfg.orthophotoWms,{layers:cfg.orthophotoLayer,format:'image/jpeg',transparent:false,version:'1.3.0',attribution:'© HVBG Hessen · Digitale Orthofotos',maxZoom:20}).addTo(map);
 let errors=0;
 orth.on('tileerror',()=>{if(++errors===3){map.removeLayer(orth);say('Orthofoto-WMS derzeit nicht verfügbar; OpenStreetMap wird als Ersatzkarte angezeigt. Den hessischen WMS bitte prüfen.');}});
}
createBackground(left);createBackground(right);
let syncing=false;
const sync=(src,dst)=>src.on('moveend',()=>{if(syncing)return;const c=src.getCenter(),z=src.getZoom();if(dst.getZoom()===z && dst.getCenter().distanceTo(c)<.5)return;syncing=true;dst.setView(c,z,{animate:false});syncing=false;});
sync(left,right);sync(right,left);
const select=document.getElementById('climate-select');const opacity=document.getElementById('climate-opacity');
const visible=document.getElementById('climate-show');let overlay=null;let current='';
function update(){
 const key=select.value;
 if(overlay)right.removeLayer(overlay);
 current=key;
 if(visible.value==='off'){document.getElementById('map-layer-info').textContent='Klimaebene ausgeblendet';return;}
 overlay=L.tileLayer.wms(cfg.climateWms,{layers:key,format:'image/png',transparent:true,version:'1.3.0',opacity:Number(opacity.value)/100,attribution:'© Stadt Frankfurt am Main, Klimareferat · Klimaplanatlas 2026'}).addTo(right);
 document.getElementById('map-layer-info').textContent='WMS: '+ key;
 let fails=0;
 overlay.on('tileerror',()=>{if(current===key && ++fails===2){say('Der Klimaplanatlas-Layer „'+key+'“ konnte nicht geladen werden. WMS-Verfügbarkeit und technischen Layernamen im GetCapabilities-Dokument prüfen.');}});
 const theme=cfg.climateLayers.find(x=>x.key===key);
 document.getElementById('prompt-title').textContent='Frage: '+(theme?.label||'Klimaplanatlas');
 document.getElementById('prompt-body').textContent=theme?.question||'Welche räumlichen Unterschiede sind sichtbar?';
}
select.addEventListener('change',update);visible.addEventListener('change',update);
opacity.addEventListener('input',()=>{if(overlay)overlay.setOpacity(Number(opacity.value)/100);});
document.getElementById('map-reset').addEventListener('click',()=>left.setView(cfg.center,cfg.zoom));
update();
window.setTimeout(()=>{left.invalidateSize();right.invalidateSize();},100);
})();
