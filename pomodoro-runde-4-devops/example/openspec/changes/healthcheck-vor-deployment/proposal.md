## Why

Pipelines deployen aktuell, ohne vorher zu prüfen, ob die Zielumgebung erreichbar ist. Das Deployment scheitert dann mittendrin, hinterlässt halbfertige Zustände, und der Grund steht erst nach Minuten im Log.

## What Changes

- Neues Script `healthcheck.js`: HTTP-GET gegen eine URL, Erfolg bei Status 200-299 innerhalb des Timeouts.
- Wiederholung bei Fehlschlag (Standard 3 Versuche, 2000 ms Pause, 5000 ms Timeout je Versuch), jeweils per Option änderbar.
- Ergebnis als Exit-Code (0 gesund, 1 ungesund, 2 falsche Bedienung) und eine Ergebniszeile auf stdout. Fortschritt je Versuch auf stderr.
- Keine Query-Parameter in der Ausgabe; URLs mit Zugangsdaten (`user:pass@`) werden abgelehnt.

## Nicht-Ziele

Antwortinhalt prüfen, Authentifizierung per Header, mehrere URLs je Aufruf, CI-spezifische Integration, Backoff, Metriken.

## Capabilities

### New Capabilities
- `healthcheck`: Erreichbarkeitsprüfung einer Zielumgebung mit Retry und Exit-Code

### Modified Capabilities
- keine

## Impact

- Neue Datei `healthcheck.js` (Auslieferung), `healthcheck.test.js` (nicht ausgeliefert).
- Pipeline-Schritt vor dem Deployment: `node healthcheck.js "$TARGET_URL"`. Ein Exit-Code ungleich 0 bricht die Pipeline ab (Standardverhalten der meisten CI-Systeme).
- Keine neuen Dependencies, keine Umgebungsvariablen, keine Secrets.

## Offene Fragen

- Welche URL ist der Healthcheck-Endpunkt der echten Zielumgebung? Das ist eine Vorgabe des Teams, nicht Teil des Scripts.
- Soll die Pipeline bei Exit-Code 2 anders reagieren als bei 1? Wird derzeit nicht unterschieden (beides bricht ab).
