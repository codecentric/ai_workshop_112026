## Entscheidungen

**Speicher: `localStorage`, ein Schlüssel `pomodoro.history`, Wert `{"day":"YYYY-MM-DD","count":N}`.**
Alternative Liste aller Phasen mit Zeitstempel: mehr Daten, nützlich erst für Mehrtagesverlauf (Nicht-Ziel). Ein Datensatz pro Tag genügt und ist beim Tageswechsel trivial zu verwerfen.

**Logik rein in `timer.js`, Speicherzugriff in `index.html`.**
Die Funktionen bekommen den Rohstring und den Tagesschlüssel und geben einen neuen Rohstring zurück. So sind sie ohne Browser und ohne Fake-Storage testbar. `localStorage` selbst bleibt in der dünnen UI-Schicht (passt zu AGENTS.md: keine Geschäftslogik in `index.html`).

**Tag = lokaler Kalendertag.** `dayKey(ms)` nutzt `getFullYear/getMonth/getDate`, nicht `toISOString()` (UTC würde um 01:00/02:00 lokal den Tag wechseln).

**Zählzeitpunkt = Phasenende laut `tick`.** `tick` liefert `phaseEnded` und neu `endedMode`. Gezählt wird nur bei `endedMode === 'work'`. Da `tick` die Phase beim Erkennen sofort auf "Pause, gestoppt" umstellt, kann ein verspäteter Tick im Hintergrund-Tab nicht doppelt zählen.

**Fehlertoleranz.** `readCount` wirft nie: fehlende, kaputte oder veraltete Daten ergeben 0. `index.html` kapselt `getItem`/`setItem` in try/catch und hält den Rohstring zusätzlich im Speicher, damit der Zähler bei blockiertem Storage bis zum Neuladen weiterzählt.

**Tageswechsel bei offener Seite.** Wird beim nächsten `render` erkannt (Vergleich `day` mit heutigem Schlüssel), kein eigener Timer nötig.

## Risiken

- Safari/Private Mode kann `setItem` verweigern: durch try/catch abgedeckt.
- Systemuhr wird zurückgestellt: Zähler kann für "heute" zurückspringen. Akzeptiert.
