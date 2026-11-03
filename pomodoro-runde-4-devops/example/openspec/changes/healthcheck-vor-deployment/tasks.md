## 1. Argumente lesen

- [x] 1.1 Tests: `parseArgs` für Defaults, Overrides, fehlende URL, falsches Schema, ungültige Zahlen, unbekannte Option (rot)
- [x] 1.2 `parseArgs(argv)` implementieren, wirft nie (grün)

## 2. URL sicher anzeigen

- [x] 2.1 Test: `safeUrl` entfernt Credentials, Query und Fragment (rot)
- [x] 2.2 `safeUrl(url)` implementieren (grün)

## 3. Einzelner Versuch

- [x] 3.1 Tests: `checkOnce` für 2xx, 3xx/4xx/5xx, Timeout, Verbindungsfehler, `redirect: 'manual'` (rot)
- [x] 3.2 `checkOnce(url, timeoutMs, deps)` implementieren (grün)

## 4. Wiederholung

- [x] 4.1 Tests: `runHealthcheck` stoppt beim ersten Erfolg, wiederholt nach Fehlschlag, gibt nach N Versuchen auf, keine Pause nach dem letzten Versuch (rot)
- [x] 4.2 `runHealthcheck(options, deps)` implementieren (grün)

## 5. Exit-Codes und Ausgabe

- [x] 5.1 Tests: `main` liefert 0 / 1 / 2, genau eine stdout-Zeile, kein Netzwerk bei Usage-Fehler, keine Query-Parameter in der Ausgabe (rot)
- [x] 5.2 `main(argv, deps)` und CLI-Start unter `require.main === module` implementieren (grün)

## 5b. Credentials in der URL (Nachtrag aus manuellem Test)

- [x] 5b.1 Tests: `parseArgs` und `main` lehnen `user:pass@` mit Exit-Code 2 ab und wiederholen den Wert nicht (rot)
- [x] 5b.2 Prüfung in `parseArgs` ergänzen (grün)

## 6. Integration

- [x] 6.1 Integrationstests gegen lokalen Server: 200, 503, 302, hängende Antwort (Timeout), geschlossener Port
- [x] 6.2 Manuell prüfen: Aufruf in der Shell, Exit-Code mit `echo $?` (siehe solution.md)
