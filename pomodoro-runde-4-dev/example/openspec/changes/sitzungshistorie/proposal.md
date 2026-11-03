## Why

Nutzer zählen ihre Pomodoros im Kopf oder auf Papier. Der Timer kennt die Information bereits (Ende einer Arbeitsphase), zeigt sie aber nicht an.

## What Changes

- Neuer Tageszähler "Heute: N Pomodoros" unter der Zeitanzeige.
- Zähler steigt, wenn eine **Arbeitsphase** regulär endet. Pausen, Pause/Fortsetzen und Reset zählen nicht.
- Zähler wird im Browser (`localStorage`) gespeichert und gilt für den lokalen Kalendertag.
- `tick` meldet zusätzlich, welcher Modus gerade endete (`endedMode`).

## Nicht-Ziele

Mehrtagesverlauf, Statistik, manuelles Zurücksetzen, Geräte-Sync, Sonderbehandlung mehrerer Tabs.

## Capabilities

### New Capabilities
- `history`: Tageszähler abgeschlossener Pomodoros

### Modified Capabilities
- keine (Timer-Verhalten unverändert, `tick` bekommt nur ein zusätzliches Feld)

## Impact

- `timer.js`: `tick` Rückgabewert um `endedMode` erweitert, neue Funktionen `dayKey`, `readCount`, `addPomodoro`.
- `index.html`: Anzeige, Lesen/Schreiben von `localStorage` mit Fehlerbehandlung.
- Keine neuen Dateien, keine Dependencies.

## Offene Fragen

- Mehrere Tabs gleichzeitig: bewusst nicht behandelt (letzter Schreiber gewinnt).
