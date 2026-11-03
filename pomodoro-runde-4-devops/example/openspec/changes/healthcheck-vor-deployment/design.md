## Entscheidungen

**Node statt Bash/curl.** Timeout, Retry und Exit-Codes sind in Node mit `node --test` ohne Zusatzwerkzeug testbar. Alternative `curl --retry --max-time -f`: kürzer, aber Mapping auf die gewünschten Ausgabezeilen und Exit-Codes (curl liefert 22, 28, 7 ...) und Tests wären aufwendiger.

**Exit-Codes 0/1/2.** 1 bedeutet "Umgebung ungesund", 2 "falsch bedient". CI kann so zwischen Pipeline-Konfigurationsfehler und echtem Ausfall unterscheiden, falls gewünscht.

**Seiteneffekte als `deps` injizieren (`fetch`, `now`, `sleep`, `log`, `out`).** Unit-Tests laufen ohne Netzwerk und ohne echte Wartezeit. Wenige Integrationstests prüfen gegen einen lokalen `node:http`-Server, was ein Fake nicht zeigt (echter Timeout, geschlossener Port, 302).

**Timeout per `AbortSignal.timeout`.** Ein Timeout wird über `err.name === 'TimeoutError'` erkannt und getrennt von Verbindungsfehlern gemeldet (`err.cause.code`, z. B. `ECONNREFUSED`).

**Keine Weiterleitungen (`redirect: 'manual'`).** Eine 3xx-Antwort heißt, die Umgebung antwortet nicht dort, wo erwartet (z. B. Login-Seite). Als gesund zu werten wäre ein falsch-positives Ergebnis.

**Antwortkörper wird abgebrochen (`body.cancel()`).** Verbindungen bleiben nicht offen, und große Antworten verzögern das Ergebnis nicht.

**Keine Pause nach dem letzten Versuch.** Sonst verlängert jeder endgültige Fehlschlag die Pipeline um `delayMs` ohne Nutzen.

**`safeUrl` für jede Ausgabe, Credentials in der URL ablehnen.** CI-Logs sind oft breit lesbar, Tokens in der Query dürfen dort nie landen. URLs mit `user:pass@` werden schon in `parseArgs` mit Exit-Code 2 abgelehnt: `fetch` verweigert sie ohnehin, und seine Fehlermeldung enthielte den Klartext. Auch Fehlermeldungen dürfen den Eingabewert nicht wiederholen. Entdeckt wurde das erst beim manuellen Test, nicht in der Spec (siehe solution.md).

## Risiken

- Der Healthcheck-Endpunkt kann "gesund" melden, obwohl die Anwendung dahinter fehlerhaft ist. Das Script prüft Erreichbarkeit, nicht Korrektheit (Nicht-Ziel).
- Unternehmens-Proxys: Node-`fetch` nutzt keine `HTTP_PROXY`-Variablen automatisch. Wird die Umgebung nur über Proxy erreicht, scheitert das Script. Akzeptiert und dokumentiert, siehe Nicht-Ziele der Story.
- Selbstsignierte Zertifikate führen zu einem Verbindungsfehler. Gewollt: kein stillschweigendes Abschalten der TLS-Prüfung.
