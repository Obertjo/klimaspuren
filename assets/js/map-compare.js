(() => {
  'use strict';
  const statusEl = document.getElementById('map-status');
  const report = (message) => { if (statusEl) statusEl.textContent = message; };
  if (!window.L) {
    report('Leaflet konnte nicht geladen werden. Die Karten benötigen Internetzugang zu einer Leaflet-JavaScript-Bibliothek.');
    return;
  }
  const cfg = window.KLIMASPUREN_CONFIG;
  if (!cfg) { report('Karteneinstellungen fehlen: assets/js/config.js prüfen.'); return; }
  const mapOptions = { preferCanvas: true, zoomControl: true, attributionControl: true };
  const left = L.map('map-left', mapOptions).setView(cfg.center, cfg.zoom);
  const right = L.map('map-right', mapOptions).setView(cfg.center, cfg.zoom);
  const osm = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const osmOptions = { maxZoom: 19, attribution: '© OpenStreetMap-Mitwirkende' };
  L.tileLayer(osm, osmOptions).addTo(left);
  L.tileLayer(osm, osmOptions).addTo(right);

  // Leaflet berechnet Kartenabmessungen bei erstem Seitenaufbau gelegentlich zu früh.
  // Bei Layout-/Schriftänderungen und Fenstergrößenwechsel beide Karten neu vermessen.
  const refresh = () => {
    if (!document.getElementById('map-left')?.offsetWidth) return;
    left.invalidateSize({ pan: false, debounceMoveend: true });
    right.invalidateSize({ pan: false, debounceMoveend: true });
  };
  [0, 250, 900, 2000].forEach(t => window.setTimeout(refresh, t));
  window.addEventListener('load', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('resize', refresh, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(refresh);
    observer.observe(document.getElementById('map-left'));
    observer.observe(document.getElementById('map-right'));
  }
  document.fonts?.ready?.then(refresh).catch(() => {});

  let orthLoaded = false;
  const orth = L.tileLayer.wms(cfg.orthophotoWms, {
    layers: cfg.orthophotoLayer,
    format: 'image/png',
    transparent: false,
    version: '1.3.0',
    maxZoom: 20,
    attribution: '© Hessische Verwaltung für Bodenmanagement und Geoinformation · Orthofotos'
  }).addTo(left);
  let orthErrors = 0;
  orth.on('tileload', () => { orthLoaded = true; orthErrors = 0; });
  orth.on('tileerror', () => {
    if (++orthErrors >= 3 && !orthLoaded) {
      left.removeLayer(orth);
      report('Orthofoto-WMS fehlgeschlagen: links wird nur OpenStreetMap angezeigt. Bitte Dienst und WMS-Parameter über den GetCapabilities-Link prüfen.');
    }
  });

  let syncing = false;
  const sync = (from, to) => from.on('moveend', () => {
    if (syncing) return;
    const center = from.getCenter(), zoom = from.getZoom();
    if (to.getZoom() === zoom && to.getCenter().distanceTo(center) < 0.5) return;
    syncing = true;
    to.setView(center, zoom, { animate: false });
    syncing = false;
  });
  sync(left, right);
  sync(right, left);

  const select = document.getElementById('climate-select');
  const opacity = document.getElementById('climate-opacity');
  const show = document.getElementById('climate-show');
  const info = document.getElementById('map-layer-info');
  let climate = null;
  let revision = 0;
  function updateClimate() {
    const rev = ++revision;
    const key = select.value;
    if (climate) { right.removeLayer(climate); climate = null; }
    const theme = cfg.climateLayers.find(x => x.key === key);
    document.getElementById('prompt-title').textContent = 'Frage: ' + (theme?.label || 'Klimaplanatlas');
    document.getElementById('prompt-body').textContent = theme?.question || 'Welche räumlichen Unterschiede sind sichtbar?';
    if (show.value === 'off') {
      info.textContent = 'Klimakarte ausgeschaltet (OpenStreetMap sichtbar)';
      report('Klima-Layer ausgeschaltet. Wähle „Ja“, um ihn einzublenden.');
      return;
    }
    info.textContent = 'WMS-Layer: ' + key + ' · prüfe die Darstellung im rechten Kartenfenster';
    climate = L.tileLayer.wms(cfg.climateWms, {
      layers: key, format: 'image/png', transparent: true,
      version: '1.3.0', opacity: Number(opacity.value) / 100,
      maxZoom: 19,
      attribution: '© Stadt Frankfurt am Main, Klimareferat · Klimaplanatlas 2026'
    }).addTo(right);
    let failures = 0, loaded = false;
    climate.on('tileload', () => {
      if (rev !== revision) return;
      if (!loaded) report('Karten geladen. Falls rechts trotzdem keine Fachinformation sichtbar ist: Layername, Transparenz und WMS-Unterstützung prüfen.');
      loaded = true;
    });
    climate.on('tileerror', () => {
      if (rev !== revision) return;
      if (++failures >= 2 && !loaded) {
        report('Klimaplanatlas-WMS konnte nicht geladen werden. Rechts bleibt OpenStreetMap sichtbar. Über den GetCapabilities-Link den Layernamen und unterstützte CRS prüfen.');
      }
    });
  }
  select.addEventListener('change', updateClimate);
  show.addEventListener('change', updateClimate);
  opacity.addEventListener('input', () => {
    if (climate) climate.setOpacity(Number(opacity.value) / 100);
  });
  document.getElementById('map-reset').addEventListener('click', () => {
    left.setView(cfg.center, cfg.zoom);
    refresh();
  });
  updateClimate();
})();
