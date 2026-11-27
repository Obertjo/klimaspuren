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

  // Legendenbilder nach OGC-WMS-Standard. Falls erlaubt, werden die im
  // GetCapabilities dokumentierten LegendURL- und Abstract-Angaben bevorzugt.
  const legendName = document.getElementById('climate-legend-name');
  const legendLink = document.getElementById('climate-legend-link');
  const legendStatus = document.getElementById('climate-legend-status');
  const legendWrap = document.getElementById('climate-legend-image-wrap');
  const legendImage = document.getElementById('climate-legend-image');
  const detailsTitle = document.getElementById('climate-dataset-title');
  const detailsCitation = document.getElementById('climate-dataset-citation');
  const detailsDesc = document.getElementById('climate-dataset-description');
  const detailsInterpretation = document.getElementById('climate-dataset-interpretation');
  const detailsLimitation = document.getElementById('climate-dataset-limitation');
  const capsLink = document.getElementById('climate-dataset-capabilities');
  const serviceDescription = document.getElementById('climate-service-description');
  const serviceAbstract = document.getElementById('climate-service-abstract');
  const serviceMetadata = new Map();
  const wmsURL = (parameters) => {
    const u = new URL(cfg.climateWms, window.location.href);
    Object.entries(parameters).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.href;
  };
  const capabilitiesUrl = wmsURL({SERVICE:'WMS', VERSION:'1.3.0', REQUEST:'GetCapabilities'});
  capsLink.href = capabilitiesUrl;
  const standardLegendUrl = key => wmsURL({ SERVICE:'WMS', VERSION:'1.3.0', REQUEST:'GetLegendGraphic', FORMAT:'image/png', LAYER:key });

  function updateDatasetInfo(key) {
    const theme = cfg.climateLayers.find(x => x.key === key);
    const metadata = serviceMetadata.get(key);
    const display = theme?.label || key;
    legendName.textContent = display;
    detailsTitle.textContent = display;
    detailsDesc.textContent = theme?.description || 'Für diesen Layer ist noch keine Kurzbeschreibung hinterlegt.';
    if (detailsCitation) detailsCitation.textContent = theme?.citation || 'Stadt Frankfurt am Main, 2026b';
    detailsInterpretation.textContent = theme?.interpretation || theme?.question || '';
    detailsLimitation.textContent = theme?.limitation || 'Für die Interpretation die originale Legende und die Metadaten heranziehen.';
    if (metadata?.abstract) {
      serviceAbstract.textContent = metadata.abstract;
      serviceDescription.hidden = false;
    } else {
      serviceAbstract.textContent = '';
      serviceDescription.hidden = true;
    }

    const generatedUrl = standardLegendUrl(key);
    // Externe LegendURL nur mit HTTP(S) zulassen, um defekte/metadatenfremde Adressen abzufangen.
    let candidates = [generatedUrl];
    if (metadata?.legendUrl) {
      try {
        const candidate = new URL(metadata.legendUrl, cfg.climateWms);
        if (window.location.protocol === 'https:' && candidate.protocol === 'http:') candidate.protocol = 'https:';
        if (['https:', 'http:'].includes(candidate.protocol)) candidates = [candidate.href, generatedUrl];
      } catch (_) { /* Standard-URL bleibt verfügbar. */ }
    }
    let attempt = 0;
    const requestedKey = key;
    legendImage.onload = () => {
      if (select.value !== requestedKey) return;
      legendWrap.hidden = false;
      legendStatus.hidden = true;
    };
    legendImage.onerror = () => {
      if (select.value !== requestedKey) return;
      attempt += 1;
      if (attempt < candidates.length) {
        legendImage.src = candidates[attempt];
        legendLink.href = candidates[attempt];
      } else {
        legendWrap.hidden = true;
        legendStatus.hidden = false;
        legendStatus.textContent = 'Der Dienst liefert derzeit kein darstellbares Legendenbild. Bitte die Legende beim Kartendienst prüfen.';
      }
    };
    legendWrap.hidden = true;
    legendStatus.hidden = false;
    legendStatus.textContent = 'Legende wird vom WMS angefordert …';
    legendImage.alt = 'Originallegende für ' + display + ' aus dem Klimaplanatlas Frankfurt 2026';
    legendLink.href = candidates[0];
    legendImage.src = candidates[0];
  }

  // Cross-Origin-GetCapabilities kann vom Server gesperrt sein. Die Seite bleibt
  // dank hinterlegter Kurztexte und GetLegendGraphic auch ohne XML-Zugriff nutzbar.
  async function loadLayerMetadata() {
    try {
      const response = await fetch(capabilitiesUrl, {mode:'cors'});
      if (!response.ok) return;
      const xmlText = await response.text();
      const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
      if (doc.querySelector('parsererror')) return;
      for (const layer of doc.getElementsByTagName('Layer')) {
        const direct = (node, name) => [...node.children].find(el => el.localName === name);
        const name = direct(layer, 'Name')?.textContent?.trim();
        if (!name || !cfg.climateLayers.some(item => item.key === name)) continue;
        const abstract = direct(layer, 'Abstract')?.textContent?.trim() || '';
        const style = direct(layer, 'Style');
        const legend = style ? [...style.getElementsByTagName('*')].find(el => el.localName === 'OnlineResource') : null;
        const legendUrl = legend?.getAttribute('xlink:href') || legend?.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
        serviceMetadata.set(name, {abstract, legendUrl});
      }
      updateDatasetInfo(select.value);
    } catch (_) { /* CORS/Netzwerkfehler sind für die Zusatzinformationen nicht kritisch. */ }
  }

  function updateClimate() {
    const rev = ++revision;
    const key = select.value;
    if (climate) { right.removeLayer(climate); climate = null; }
    const theme = cfg.climateLayers.find(x => x.key === key);
    updateDatasetInfo(key);
    document.getElementById('prompt-title').textContent = 'Frage: ' + (theme?.label || 'Klimaplanatlas');
    document.getElementById('prompt-body').textContent = theme?.question || 'Welche räumlichen Unterschiede sind sichtbar?';
    if (show.value === 'off') {
      info.textContent = 'Klimakarte ausgeschaltet (OpenStreetMap sichtbar)';
      report('Klima-Layer ausgeschaltet. Wähle „Ja“, um ihn einzublenden.');
      return;
    }
    info.textContent = 'Ausgewählt: ' + (theme?.label || 'Stadtklimatische Ebene');
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
  loadLayerMetadata();
})();
