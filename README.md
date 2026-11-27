# Klimaspuren

**Grünstrukturen, Versiegelung und Stadtklima untersuchen**

Klimaspuren ist eine frei zugängliche Lernwebseite zur Beobachtung und räumlichen Untersuchung klimarelevanter Eigenschaften städtischer Räume. Im Mittelpunkt stehen Grünstrukturen, versiegelte Flächen und ihre mögliche Bedeutung für das lokale Stadtklima.

Die Webseite ist für eigenständige Erkundungen und kleinere Lehrveranstaltungen gedacht. Eigene Beobachtungen lassen sich mit Orthofotos und thematischen Stadtklimakarten vergleichen. Dabei soll deutlich werden, welche Informationen aus einer Kartierung hervorgehen und wo zusätzliche Daten notwendig sind.

**Webseite:** https://obertjo.github.io/klimaspuren/

## Inhalte

- **Klimawissen:** Grundlagen zu Strahlung, Wärmehaushalt, Vegetation und Versiegelung.
- **Kartenvergleich:** Zwei synchronisierte Ansichten desselben Raumausschnitts. Links wird ein Orthofoto gezeigt, rechts ein Layer des Frankfurter Klimaplanatlas 2026.
- **Eigene Erfassung:** Beobachtungsorte, Fotos, Standortmerkmale und persönliche Wahrnehmungen dokumentieren.
- **Auswertung:** Gesammelte Beobachtungen kartografisch darstellen, filtern und als GeoJSON austauschen.
- **Materialien und Quellen:** Arbeitsaufträge, Beobachtungsbogen, Literatur und Bildnachweise.

Die vier Raumkonzepte nach Wardenga (2002) dienen als Grundlage für den Wechsel zwischen unterschiedlichen geographischen Betrachtungsweisen. Sichtbare Raummerkmale, ihre räumliche Verteilung und die persönliche Wahrnehmung werden bewusst unterschieden. Fachliche Kurzbelege sind in die Lerntexte eingebunden; das Literaturverzeichnis steht auf der Webseite unter `Materialien und Quellen`.

## Einsatz als Lernmaterial

Ein möglicher Ablauf für eine kurze Erkundung:

1. Einen Weg oder Stadtbereich auswählen und Grünstrukturen sowie versiegelte Oberflächen beobachten.
2. Fotos und qualitative Beschreibungen mit Standortbezug erfassen.
3. Den Bereich im Orthofoto und in einer stadtklimatischen Fachkarte betrachten.
4. Gemeinsam diskutieren, welche Zusammenhänge erkennbar sind und welche Aussagen sich aus den verfügbaren Daten nicht ableiten lassen.

Die Beobachtungen ersetzen keine standardisierten meteorologischen Messungen. Auch die Fachkarten sollten im Hinblick auf Datengrundlage, Maßstab und Aussagegrenzen gelesen werden.

## Technische Umsetzung

Die Webseite wird mit Jekyll über GitHub Pages veröffentlicht. Als Grundlage für das Seitenlayout dient das Remote Theme [Minimal Mistakes 4.28.0](https://mmistakes.github.io/minimal-mistakes/). Karten und Formulare sind mit HTML, CSS und JavaScript umgesetzt.

Für die Karten werden [Leaflet](https://leafletjs.com/), ein hessischer Orthofoto-WMS und WMS-Layer aus dem Klimaplanatlas 2026 der Stadt Frankfurt am Main verwendet. Die Layerkonfiguration befindet sich in `assets/js/config.js`. Die Legenden werden, soweit verfügbar, vom jeweiligen WMS geladen.

Wichtige Projektdateien:

- `_config.yml`: Einstellungen für Jekyll, Theme und GitHub Pages.
- `assets/css/site.css`: Eigene Gestaltung der Webseite.
- `assets/js/`: Karten- und Erfassungsfunktionen.
- `kartenvergleich/`, `erfassen/`, `auswertung/`: Interaktive Seiten.
- `klimawissen/`, `materialien/`: Lerntexte, Aufgaben und Quellen.
- `_data/oer_images.yml`: Angaben zu den verwendeten Fotografien.

### Lokal ausführen

Für einen lokalen Jekyll-Build werden Ruby und Bundler benötigt.

```bash
bundle install
bundle exec jekyll serve
```

Die lokale Webseite ist anschließend unter `http://localhost:4000/klimaspuren/` erreichbar, sofern die Einstellungen aus `_config.yml` unverändert bleiben.

## Beobachtungsdaten

Beobachtungen und ausgewählte Fotos werden derzeit lokal im Browser verarbeitet. Es gibt keine zentrale Datensammlung und keinen öffentlichen Upload. Die Beobachtungen lassen sich als GeoJSON exportieren und wieder importieren.

Eine spätere gemeinsame Sammlung würde eine gesonderte Lösung für Speicherung, Freigabe und Datenschutz benötigen. Insbesondere vor der Veröffentlichung von Fotos und genauen Ortsangaben müssten Nutzungsrechte und sensible Inhalte geprüft werden.

## Quellen und Nachnutzung

Die fachwissenschaftlichen Quellen und die Nachweise der verwendeten Kartenlayer stehen auf der Seite [Materialien und Quellen](https://obertjo.github.io/klimaspuren/materialien/).

Die Fotografien werden derzeit direkt von Wikimedia Commons geladen. Urheber, Lizenz und Fundstelle sind in `_data/oer_images.yml` erfasst und unter den Bildern angegeben. Für diese Aufnahmen gelten die jeweiligen Einzellizenzen, nicht automatisch die Lizenz der übrigen Lernmaterialien.

Für die eigenen Lernmaterialien ist **CC BY 4.0** vorgesehen. Der eigene Programmcode steht unter der **MIT-Lizenz** (`LICENSE-CODE`). Bei einer Weiterverwendung müssen die Rechte an externen Bildern, Geodaten, Softwarebibliotheken und am Theme gesondert beachtet werden.

## Stand und offene Punkte

Die Webseite ist ein weiterentwickelbarer OER-Prototyp. Die Erfassungsfunktion arbeitet derzeit ohne Serveranbindung. Die WMS-Dienste setzen eine Internetverbindung voraus; ihre Verfügbarkeit und technischen Layernamen sollten bei Änderungen der Datenangebote erneut geprüft werden.
