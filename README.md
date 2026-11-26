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

## Architektur

- `_config.yml`: `remote_theme: "mmistakes/minimal-mistakes@4.28.0"` mit `mint`-Skin, deutscher Locale, GitHub-Pages-Basis-URL.
- `_data/navigation.yml`: Navigation des Minimal-Mistakes-Mastheads.
- `_layouts/klimaspuren.html`: eigenes Layout, erbt das Theme-Layout `default`; die alte eigene Datei `_layouts/default.html` wird nicht mehr benutzt.
- `_includes/head/custom.html`: projektspezifische CSS und Leaflet-CSS.
- `_includes/footer/custom.html`: projektbezogene Hinweise und bedingtes Laden der Karten- und Erfassungsskripte.
- `assets/css/main.scss`: kompiliert die Minimal-Mistakes-Styles; `assets/css/site.css` ergänzt projektspezifische Komponenten.
- `kartenvergleich/`: synchronisierte Orthofoto-/Stadtklima-Karten.
- `erfassen/`: lokale Fotodokumentation und qualitative Erfassung.
- `auswertung/`: Kartenansicht, Filter, Import von GeoJSON.
- `klimawissen/` und `materialien/`: didaktische Inhalte, Beobachtungsbogen und Arbeitsauftrag.

## Zur Kartenfunktion

WMS-Adressen und Layernamen stehen in `assets/js/config.js`. Die Layer sind vor produktiver Nutzung anhand der aktuellen GetCapabilities-Dokumente und Originallegenden zu prüfen. Wenn ein WMS nicht antwortet, erscheint ggf. eine OpenStreetMap-Hintergrundkarte.

## Datenspeicherung und Datenschutz

Beobachtungen und ausgewählte Fotos werden **ausschließlich lokal im Browser** verarbeitet/gespeichert; sie werden nicht an einen zentralen Server geschickt. Mit GeoJSON lassen sich Beobachtungen exportieren und importieren. Für eine echte öffentliche Sammlung wäre später ein Backend mit Einwilligungs- und Moderationsprozess nötig. Foto- und Nutzungsrechte sowie Metadaten müssen dabei geprüft werden.

## Lizenz

Eigene Lehrmaterialien: CC BY 4.0 (Autorenschaft noch konkretisieren); eigener Code: MIT in `LICENSE-CODE`. Für Minimal Mistakes, Leaflet und fremde Geodaten gelten deren jeweilige Lizenz-/Quellenbedingungen.

## Lokal testen

Ruby + Bundler erforderlich: `bundle install` und `bundle exec jekyll serve`. Bei Installation via GitHub Pages erfolgt der Build normalerweise serverseitig. 
