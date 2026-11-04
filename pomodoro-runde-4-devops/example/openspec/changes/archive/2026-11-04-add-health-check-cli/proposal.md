# Proposal

## Why

Betreiber und CI-Prozesse benötigen ein eindeutiges, maschinenlesbares Ergebnis, um lokal festzustellen, ob eine Anwendung betriebsbereit ist. Der Health-Endpunkt verdichtet den Zustand der Anwendung und ihrer kritischen Abhängigkeiten bereits in seinem HTTP-Status; ein CLI macht dieses Ergebnis mit stabiler Ausgabe und Exit-Codes nutzbar.

## What Changes

- Ein lokales CommonJS-CLI `health-check.js` wird eingeführt und erwartet genau `--url <health-endpoint-url>`.
- Das CLI ruft den Health-Endpunkt einmalig auf und bewertet jeden HTTP-Status der Klasse `2xx` als gesund.
- Nicht-`2xx`-Antworten, Netzwerkfehler, unvollständige Antworten nach fünf Sekunden und ungültige Antworten werden als ungesund ausgegeben.
- Das CLI schreibt ausschließlich eine Ergebnis-JSON auf `stdout`; Usage und anonymisierte technische Diagnosen werden ausschließlich auf `stderr` geschrieben.
- Lokale automatisierte Tests decken alle Ergebnis- und Fehlerklassen ohne Zugriffe auf Produktiv- oder Staging-Systeme ab.

## Capabilities

### New Capabilities
- `health-check-cli`: Führt einen lokalen HTTP-basierten Health Check aus und stellt dessen Ergebnis sicher für Automatisierung bereit.

### Modified Capabilities

- Keine.

## Impact

- Neue CLI-Datei `health-check.js` sowie zugehörige Node-Testdateien.
- Keine externen Dependencies; Node.js 20 oder neuer und das eingebaute `node --test` werden verwendet.
- Der abgefragte Health-Endpunkt muss den kombinierten Zustand seiner kritischen Abhängigkeiten über seinen HTTP-Status bereitstellen; einzelne Komponenten werden nicht an das CLI übertragen.
