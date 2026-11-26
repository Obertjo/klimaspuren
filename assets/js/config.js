// Öffentliche WMS-Dienste. Technische Layernamen stammen teilweise aus der QGIS-Layerliste.
// Live-GetCapabilities und Browseraufruf vor Veröffentlichung abgleichen.
window.KLIMASPUREN_CONFIG = Object.freeze({
  center: [50.1258, 8.6618],
  zoom: 15,
  orthophotoWms: 'https://www.gds-srv.hessen.de/cgi-bin/lika-services/ogc-free-images.ows',
  orthophotoLayer: 'he_dop_rgb',
  climateWms: 'https://geowebdienste.frankfurt.de/Klimaplanatlas_2026',
  climateLayers: [
    {key:'Klimatope_2026', label:'Klimatope', question:'Wie unterscheidet der Atlas stadtklimatische Teilräume?'},
    {key:'Straßen_mit_Vegetationsdefizit_2026', label:'Straßen mit Vegetationsdefizit', question:'Wo fallen im Orthofoto wenig begrünte Straßenräume auf?'},
    {key:'Vegetationshoehenraster_2026', label:'Vegetationshöhen', question:'Welche Unterschiede zwischen niedriger und hoher Vegetation erkennst du?'},
    {key:'Sky_View_Faktor_2026', label:'Sky View Factor', question:'Wo ist der sichtbare Himmelsanteil durch Gebäude und Baumkronen eingeschränkt?'},
    {key:'Kaltluftabfluss_2026_M2000', label:'Kaltluftabfluss (M2000)', question:'Welche Kaltluftströmungen werden modelliert, und in welcher Situation?'},
  ]
});
