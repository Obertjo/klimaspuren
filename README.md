# Klimaspuren – GitHub Pages / Minimal Mistakes 4.28.0

Interaktive OER-Webseite zu Grünstrukturen, Versiegelung und Stadtklima. Die Seite basiert auf [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) **4.28.0** (Remote Theme). 

## GitHub Pages – Einrichten und Aktualisieren

Repository: `https://github.com/Obertjo/klimaspuren`  
Website: `https://obertjo.github.io/klimaspuren/`

1. Alle Projektdateien **im Wurzelverzeichnis** des Repositories speichern, nicht in einem zusätzlichen Unterordner.
2. In **Settings → Pages** `Deploy from a branch`, `main`, `/(root)` auswählen. Das Repository ist für die hier gesetzte URL/BaseURL konfiguriert.
3. In **Actions** den Pages-Build überprüfen. Falls der Build fehlschlägt, die Fehlermeldung aus dem Build-Protokoll prüfen.
4. Beim Wechsel von Version 0.1 **unbedingt die alte Datei `_layouts/default.html` entfernen**. Sonst überschreibt das alte Layout das Minimal-Mistakes-Layout. Die alte `_includes/header.html` und `assets/js/site.js` werden nicht mehr benötigt.

### Dateien bequem über github.dev übertragen

Das Repository in GitHub öffnen und `.` drücken (oder `https://github.dev/Obertjo/klimaspuren` verwenden). Im Web-Editor den aktualisierten Inhalt des ZIP-Projekts in das Repository übernehmen, gelöschte Altdateien ebenfalls löschen, unter **Source Control** alle Änderungen stagen und committen. Der Web-Editor benötigt keine lokale Installation.

## Gestaltung (Version 0.3)

Die Oberfläche orientiert sich an klassischen universitären Kurswebseiten: kapitelorientierte Seitenleiste, sachlicher Titelbereich, Fließtexte, tabellarischer Modulüberblick und einfache Arbeitsaufträge. Keine großflächige Hero-Grafik, keine dekorativen Kacheln, Farbverläufe oder Schatten. Die Karte und die Erfassung bleiben eigenständige Funktionsseiten.

**Wichtig bei der Aktualisierung eines bestehenden GitHub-Repositories:** Die `update.zip` enthält nur veränderte Dateien; die `komplett.zip` enthält das vollständige Projekt. Die ZIP-Dateien jeweils entpacken und die enthaltenen Dateien und Unterordner ins **Hauptverzeichnis** hochladen (bestehende Dateien mit identischen Pfaden überschreiben). Die Unterordner `assets`, `_layouts`, `_data` und die Kapitelordner müssen erhalten bleiben. Bereits vorhandene zusätzliche Dateien wie `_layouts/default.html`, falls aus einer älteren Version, müssen weiterhin entfernt bleiben.

## Architektur

- `_config.yml`: `remote_theme: "mmistakes/minimal-mistakes@4.28.0"` mit schlichtem `default`-Skin, deutscher Locale, GitHub-Pages-Basis-URL.
- `_data/navigation.yml`: Navigation des Minimal-Mistakes-Mastheads.
- `_layouts/klimaspuren.html`: eigenes Layout, erbt das Theme-Layout `default`; die alte eigene Datei `_layouts/default.html` wird nicht mehr benutzt.
- `_includes/head/custom.html`: projektspezifische CSS und Leaflet-CSS.
- `_includes/footer/custom.html`: projektbezogene Hinweise und bedingtes Laden der Karten- und Erfassungsskripte.
- `assets/css/main.scss`: kompiliert die Minimal-Mistakes-Styles; `assets/css/site.css` ergänzt projektspezifische Komponenten.
- `kartenvergleich/`: synchronisierte Orthofoto-/Stadtklima-Karten.
- `erfassen/`: lokale Fotodokumentation und qualitative Erfassung.
- `auswertung/`: Kartenansicht, Filter, Import von GeoJSON.
- `klimawissen/` und `materialien/`: didaktische Inhalte, Beobachtungsbogen und Arbeitsauftrag.

## Bildmaterial (Version 0.4)

Vier offen lizenzierte Beispiel-Fotos von Wikimedia Commons wurden an fachlich passenden Stellen eingebunden:

- **Einführung:** Platanenallee am Frankfurter Mainufer – Dguendel, CC BY 3.0.
- **Klimatische Grundlagen:** Stadtbaum in der Fahrgasse – Yair-haklai, CC BY-SA 4.0; Parkplatz mit wasserdurchlässigem Belag und Asphalt – Aaron Volkening, CC BY 2.0.
- **Eigene Erfassung:** Miquelallee im Winter – Daviidos, CC BY-SA 3.0.

Die URLs, Urheber, Lizenzlinks, Bildbeschreibungen und Quellen werden in `_data/oer_images.yml` verwaltet und über `_includes/oer-image.html` ausgegeben. Eine tabellarische Datei liegt unter `assets/data/bildnachweise.csv`. Die Urhebernennung erfolgt unmittelbar unter jedem Foto; eine zweite Übersicht befindet sich auf der Seite **Materialien und Quellen**. Die Fotografien bleiben unter ihrer jeweiligen Original-Lizenz. Bei Bearbeitung von CC-BY-SA-Bildern gelten die Share-Alike-Pflichten. Das Copyright der Fotos wird nicht vom CC-BY-4.0-Hinweis für eigene Lehrtexte umfasst.

**Technischer Hinweis:** Die Vorschaubilder werden derzeit aus Wikimedia Commons geladen und sind **nicht lokal im Repository gespeichert**. Das spart Dateigröße, benötigt jedoch eine Internetverbindung und die Erreichbarkeit von Wikimedia Commons. Für eine vollständig eigenständig nachnutzbare Offline-OER können die Bilder gemäß den individuellen Lizenzen lokal gespeichert und die URL-Felder in `_data/oer_images.yml` entsprechend angepasst werden. Die externen Bildquellen und Lizenzen müssen dabei erhalten bleiben.

## Zur Kartenfunktion

WMS-Adressen und Layernamen stehen in `assets/js/config.js`. Die Layer sind vor produktiver Nutzung anhand der aktuellen GetCapabilities-Dokumente und Originallegenden zu prüfen. Wenn ein WMS nicht antwortet, erscheint ggf. eine OpenStreetMap-Hintergrundkarte.

## Datenspeicherung und Datenschutz

Beobachtungen und ausgewählte Fotos werden **ausschließlich lokal im Browser** verarbeitet/gespeichert; sie werden nicht an einen zentralen Server geschickt. Mit GeoJSON lassen sich Beobachtungen exportieren und importieren. Für eine echte öffentliche Sammlung wäre später ein Backend mit Einwilligungs- und Moderationsprozess nötig. Foto- und Nutzungsrechte sowie Metadaten müssen dabei geprüft werden.

## Lizenz

Eigene Lehrmaterialien: CC BY 4.0 (Autorenschaft noch konkretisieren); eigener Code: MIT in `LICENSE-CODE`. Für Minimal Mistakes, Leaflet und fremde Geodaten gelten deren jeweilige Lizenz-/Quellenbedingungen.

## Lokal testen

Ruby + Bundler erforderlich: `bundle install` und `bundle exec jekyll serve`. Bei Installation via GitHub Pages erfolgt der Build normalerweise serverseitig. 


## Reparatur v0.5 – Kartenvergleich

Die Darstellung von Leaflet wurde robuster gemacht: zusätzliches CSS-CDN, lokale Leaflet-Kernstile, Karten-Neuvermessung per ResizeObserver und Statusmeldungen bei WMS-Ausfällen. Die Orthofotoebene links und Klimaplanatlasebene rechts sind getrennt. Das hessische Orthofoto nutzt den veröffentlichten WMS `he_dop_rgb` (Hessische Verwaltung für Bodenmanagement und Geoinformation).

**Offene Punkte:** Externe Live-GetMap-Aufrufe konnten in der Entwicklungsumgebung nicht getestet werden. Die Klimaplanatlas-Layer und die vom WMS unterstützten Koordinatensysteme sind auf der veröffentlichten Website über die neuen GetCapabilities-Links zu prüfen.
