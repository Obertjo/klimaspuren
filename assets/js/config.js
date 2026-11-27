// Öffentliche WMS-Dienste. Technische Layernamen stammen teilweise aus der QGIS-Layerliste.
// Live-GetCapabilities und Browseraufruf vor Veröffentlichung abgleichen.
window.KLIMASPUREN_CONFIG = Object.freeze({
  center: [50.1258, 8.6618],
  zoom: 15,
  orthophotoWms: 'https://www.gds-srv.hessen.de/cgi-bin/lika-services/ogc-free-images.ows',
  orthophotoLayer: 'he_dop_rgb',
  climateWms: 'https://geowebdienste.frankfurt.de/Klimaplanatlas_2026',
  climateLayers: [
    {key:'Klimatope_2026', label:'Klimatope 2026', question:'Wie unterscheidet der Atlas stadtklimatische Teilräume?', description:'Die Klimatopkarte gliedert den Stadtraum in Bereiche mit vergleichbaren stadtklimatischen Eigenschaften.', interpretation:'Vergleiche die dargestellten Klimatope mit Grünflächen, Bebauung und Oberflächenstrukturen im Orthofoto.', limitation:'Klimatope sind eine fachliche Klassifikation und keine ortsgenauen Temperaturmesswerte.'},
    {key:'Straßen_mit_Vegetationsdefizit_2026', label:'Straßen mit Vegetationsdefizit', question:'Wo fallen im Orthofoto wenig begrünte Straßenräume auf?', description:'Die Themenkarte kennzeichnet Straßenräume, die im Klimaplanatlas als Bereiche mit Vegetationsdefizit dargestellt werden.', interpretation:'Prüfe, welche Baumreihen, Grünstreifen oder anderen Vegetationsstrukturen im Orthofoto zu erkennen sind.', limitation:'Die genaue Methodik und die Schwellen der Einstufung sind in den fachlichen Originalmetadaten zu prüfen. Aus einem Defizit allein lässt sich keine Temperatur ableiten.'},
    {key:'Vegetationshoehenraster_2026', label:'Vegetationshöhenraster 2026', question:'Welche Unterschiede zwischen niedriger und hoher Vegetation erkennst du?', description:'Das Vegetationshöhenraster stellt die räumliche Verteilung unterschiedlicher Vegetationshöhen dar. Laut Geoportal Frankfurt basiert die Auswertung auf Luftbildern, Geländedaten und einem maschinellen Lernverfahren.', interpretation:'Suche Unterschiede zwischen niedriger Vegetation und höheren Gehölzstrukturen und vergleiche sie mit dem Orthofoto.', limitation:'Die Vegetationshöhe ist kein direkter Messwert für Beschattung, Kühlleistung oder Biodiversität.'},
    {key:'Sky_View_Faktor_2026', label:'Sky View Factor 2026', question:'Wo ist der sichtbare Himmelsanteil durch Gebäude und Baumkronen eingeschränkt?', description:'Der Sky View Factor beschreibt, welcher Anteil des Himmels von einem Standort aus geometrisch sichtbar ist. Er ist ein Indikator für städtische Strahlungsverhältnisse.', interpretation:'Vergleiche enge Straßenräume, Plätze und Grünflächen und prüfe mögliche Einflüsse der umgebenden Strukturen.', limitation:'Der Sky View Factor ist nicht gleichbedeutend mit der aktuellen Beschattung oder einer gemessenen Lufttemperatur.'},
  ]
});
