# Projekt
Pomodoro Timer als Web-App: 25 min Arbeit, 5 min Pause, Start/Pause/Reset, Countdown als MM:SS.
Lernprojekt im Workshop; Ziel ist kleiner, lesbarer, getesteter Code.

# Tech-Stack
- Vanilla JavaScript (ES2022), HTML, CSS. Keine Frameworks, keine Dependencies, kein Build-Schritt.
- Läuft per Doppelklick auf `index.html` (file://). Deshalb keine ES-Module (`import`/`export`) im Browser-Code.
- Tests mit dem eingebauten Node-Testrunner: `node --test` (Node >= 20). Kein Jest, kein npm.

# Struktur
- `timer.js`: reine Logik ohne DOM, ohne `Date.now()`, ohne Timer. Die Zeit wird als Parameter `now` übergeben.
- `timer.test.js`: Tests für `timer.js`.
- `index.html`: UI, Verdrahtung (`setInterval`, DOM, Tab-Titel). Enthält keine Geschäftslogik.

# Konventionen
- Tests: Jede neue Funktionalität in `timer.js` wird durch Tests abgesichert (Normalfall und relevante Randfälle). Getestet wird das beobachtbare Verhalten, nicht die interne Implementierung.
- Restzeit immer aus Endzeitpunkt (`endAt - now`) berechnen, nie per `remaining--` dekrementieren (Drift, Hintergrund-Tabs).
- Zustand ist ein einfaches Objekt `{ mode, remainingMs, endAt }`. Funktionen sind rein und geben neuen Zustand zurück.
- Zeiten intern in Millisekunden, Konstanten in `UPPER_SNAKE_CASE`, Funktionen und Variablen in `camelCase`, DOM-Elemente mit Suffix `El`.
- Ein `setInterval` zur Zeit. Vor jedem Start prüfen oder vorher `clearInterval`.
- Fehler bei optionalen Features fangen und ignorieren, der Timer läuft weiter. Kein `alert()`.
- Kommentare auf Englisch, nur für das Warum. Benutzer-Texte in der UI auf Deutsch.

# Was die KI nicht tun soll
- Keine externen Libraries, kein npm, keine `package.json`, keine zusätzlichen Dateien ohne Rückfrage.
- Keine globalen veränderlichen Variablen außerhalb von `index.html`.
- Keine Änderungen außerhalb des Ordners, in dem `AGENTS.md` liegt.
- Keine Refactorings, die nicht verlangt wurden. Pro Auftrag eine Änderung.

# Definition of Done
- `node --test` ist grün.
- Am Ende in max. 5 Zeilen erklären, was geändert wurde und wie man es prüft.
