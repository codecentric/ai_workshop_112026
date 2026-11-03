## 1. Phasenende melden

- [x] 1.1 Test: `tick` liefert `endedMode: 'work'` bzw. `'break'` (rot)
- [x] 1.2 `tick` um `endedMode` erweitern (grün)

## 2. Tagesschlüssel

- [x] 2.1 Test: `dayKey` nutzt lokalen Kalendertag, auch um 00:00 und 23:59 (rot)
- [x] 2.2 `dayKey(ms)` implementieren (grün)

## 3. Zähler lesen

- [x] 3.1 Tests: `readCount` für leer, gleicher Tag, neuer Tag, beschädigt/ungültig (rot)
- [x] 3.2 `readCount(raw, today)` implementieren, wirft nie (grün)

## 4. Zähler erhöhen

- [x] 4.1 Tests: `addPomodoro` im selben Tag, neuer Tag, beschädigte Daten (rot)
- [x] 4.2 `addPomodoro(raw, today)` implementieren (grün)

## 5. UI-Verdrahtung

- [x] 5.1 Anzeige "Heute: N Pomodoro(s)" in `index.html`
- [x] 5.2 Beim Phasenende mit `endedMode === 'work'` zählen und speichern
- [x] 5.3 `localStorage` in try/catch, Rohstring im Speicher halten
- [x] 5.4 Manuell prüfen: Neuladen, Reset, Pausenende, Storage blockiert (siehe solution.md)
