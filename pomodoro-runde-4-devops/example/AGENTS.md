# Projekt
Healthcheck-Script für Pipelines: prüft per HTTP-GET, ob eine Zielumgebung vor dem Deployment antwortet.
Lernprojekt im Workshop; Ziel ist ein kleines, CI-taugliches, getestetes Script.

# Tech-Stack
- Node.js >= 20, CommonJS, nur Standardbibliothek (`fetch`, `AbortSignal.timeout`, `node:test`). Keine Dependencies, kein npm, keine `package.json`, kein Build.
- Tests: `node --test` (Exit-Code ungleich 0 bei Fehlern, damit CI es übernehmen kann).

# Struktur
- `healthcheck.js`: Logik und CLI in einer Datei. Netzwerk, Uhr, Warten und Ausgabe kommen als `deps` (`fetch`, `now`, `sleep`, `log`, `out`) in die Funktionen, damit Tests sie ersetzen können. Der CLI-Start steht unter `require.main === module`.
- `healthcheck.test.js`: Unit-Tests mit Fake-`fetch` plus wenige Integrationstests gegen einen lokalen `node:http`-Server.

# Konventionen
- TDD: Zuerst ein fehlschlagender Test, Scheitern zeigen, dann implementieren.
- Exit-Codes: 0 gesund, 1 ungesund, 2 falsche Bedienung. Nicht ändern ohne Rückfrage.
- stdout enthält genau eine Ergebniszeile, Fortschritt und Usage gehen auf stderr.
- URLs nie vollständig ausgeben, nur über `safeUrl` (keine Credentials, keine Query).
- Kommentare auf Englisch, nur für das Warum. Meldungen für Nutzer auf Deutsch.

# Was die KI nicht tun soll
- Keine echten Netzwerkaufrufe in Tests außer gegen `127.0.0.1`.
- Keine Aufrufe gegen reale Umgebungen, kein `git push`, keine Installationen, keine Änderungen außerhalb dieses Ordners.
- Keine Refactorings, die nicht verlangt wurden. Pro Auftrag eine Änderung.

# Deployment-Artefakt
- Ausgeliefert wird nur `healthcheck.js`. Tests und Spezifikationen gehören nicht ins Artefakt.
- Keine Konfiguration über Umgebungsvariablen, keine Secrets.

# Definition of Done
- `node --test` ist grün.
- Am Ende in max. 5 Zeilen erklären, was geändert wurde und wie man es prüft.
