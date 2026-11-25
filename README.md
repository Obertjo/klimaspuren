# Klimaspuren – GitHub-Pages-OER (Version 0.1)

**Stand:** 25. November 2026  
**Thema:** Grünstrukturen, Versiegelung und Stadtklima  
**Technik:** Jekyll, GitHub Pages, Leaflet, WMS, GeoJSON

## Enthaltene Seiten

- `/` – Startseite
- `/klimawissen/` – Stadtklima-Grundlagen und Quiz
- `/kartenvergleich/` – synchronisierte Karten mit Orthofoto und Klimaplanatlas-WMS
- `/erfassen/` – eigene Beobachtungen mit Kartenauswahl, Foto und qualitativem Formular (lokaler Browser-Speicher)
- `/auswertung/` – lokale GeoJSON-Beobachtungen auf Karte mit Kategoriefilter; optional fiktive Beispieldaten
- `/materialien/` – Arbeitsauftrag, CSV-Beobachtungsbogen, Beispieldaten, Quellen/Lizenzen

## In GitHub Pages veröffentlichen

1. Auf GitHub **New repository** wählen, z. B. `klimaspuren`. Für GitHub Free das Repository **public** anlegen.
2. Den **Inhalt dieses ZIP-Ordners** (nicht den übergeordneten Ordner) in die oberste Ebene des Repositorys hochladen; versteckte Ordner `_layouts`, `_includes` usw. mitnehmen.
3. In `_config.yml` den Eintrag `baseurl: ""` zu `baseurl: "/klimaspuren"` ändern, wenn die URL `https://BENUTZERNAME.github.io/klimaspuren/` lautet. Bei einer **User-/Organization-Page** (`BENUTZERNAME.github.io`) bleibt der Wert `""`.
4. Unter **Settings → Pages → Build and deployment** `Deploy from a branch`, `main`, `/(root)` wählen; speichern. GitHub baut eine Jekyll-Website automatisch.
5. Unter **Actions** den Build verfolgen und anschließend die veröffentlichte Pages-URL öffnen.

Mehr Informationen: https://docs.github.com/en/pages

## Lokal testen (optional)

Wenn Ruby und Bundler installiert sind:

```bash
bundle install
bundle exec jekyll serve
```

Dann `http://127.0.0.1:4000/` öffnen. Bei lokalem Test das `baseurl` auf `""` setzen. Nur `python -m http.server` reicht für die Jekyll-Layouts nicht aus.

## Wichtige Einschränkungen

**Erfassung und Fotos:** Daten werden nur im Browser (localStorage) gespeichert. Hochgeladene Fotos werden im Browser verkleinert und als JPEG in den GeoJSON-Export eingebettet. Es findet **kein Upload auf einen gemeinsamen Server** statt. Bei vollem Browser-Speicher erscheint ein Hinweis und die Beobachtung kann zur Sicherung exportiert werden. Import und Export sind lokale Vorgänge. Auf der Auswertungsseite importierte Dateien werden nur für die jeweilige Ansicht angezeigt, nicht dauerhaft gespeichert.

**WMS:** Die URLs und Layernamen befinden sich in `assets/js/config.js`. Der Klima-WMS ist aus dem Klimaplanatlas 2026 der Stadt Frankfurt übernommen. Die technischen Layernamen der Layerauswahl stammen teilweise aus QGIS-Screenshots und wurden **nicht live gegen GetCapabilities überprüft**. Falls eine Ebene nicht lädt, die Schreibweise und die Browsereinbindung prüfen.

- Frankfurt Klima WMS: `https://geowebdienste.frankfurt.de/Klimaplanatlas_2026`
- Hessen DOP WMS: `https://www.gds-srv.hessen.de/cgi-bin/lika-services/ogc-free-images.ows`
- WMS Capabilities: Endpunkt mit `?SERVICE=WMS&REQUEST=GetCapabilities` aufrufen.

**Interpretation:** Die stadtklimatischen Fachkarten sind modelliert bzw. abgeleitet und keine Live-Lufttemperaturmessungen. Ein Baumkronenbild weist nicht automatisch eine Temperaturdifferenz nach. Die Winterkartierung zeigt nur die aktuell sichtbaren Merkmale und aktuelle Beschattung, nicht die sommerliche Wirkung von Laubbäumen.

**Offene Veröffentlichung:** Die eigene Lehrressource ist für CC BY 4.0 vorgesehen; der Code unter MIT. **Die tatsächliche Autorenschaft muss vor Abgabe ergänzt werden.** Fremde Geodaten, Ortophotos und WMS-Visualisierungen haben gesonderte Bedingungen, die vor Veröffentlichung geprüft und entsprechend gekennzeichnet werden müssen.

## Nächste Ausbaustufe

1. WMS-Endpunkte und Layernamen im Browser testen; Originallegenden und Modellbeschreibung ergänzen.
2. Beobachtungsbogen in einer kleinen Pilot-Lehrveranstaltung testen und fachlich nachschärfen.
3. Externe Einsende- und Speicherlösung mit Datenschutz, Fotorechten, Prüfung und Moderation planen (z. B. KoboToolbox + moderierte GeoJSON-Veröffentlichung).
4. Eigene Lehrgrafiken und konkrete Beispielaufgaben zu ausgewählten Orten ergänzen.

---

**Hinweis:** Es gibt keinen persönlichen GitHub-Zugriff über das ZIP. Veröffentlichung erfolgt nach Upload ins eigene Repository oder über eine verbundene GitHub-App.
