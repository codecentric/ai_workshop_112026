# Story: Healthcheck vor dem Deployment

Als Release-Verantwortlicher
möchte ich vor dem Deployment per Script prüfen, ob die Zielumgebung auf einen HTTP-Healthcheck antwortet, und das Ergebnis als Exit-Code in der Pipeline auswerten können,
damit eine Pipeline nicht in eine nicht erreichbare Umgebung deployt und ich den Grund des Abbruchs im Log sehe.

## Begriffe

- **Gesund:** Die Zielumgebung antwortet innerhalb des Timeouts mit einem HTTP-Status 200 bis 299. Der Antwortinhalt wird nicht geprüft.
- **Versuch:** Ein einzelner HTTP-GET auf die angegebene URL. Weiterleitungen (3xx) werden nicht verfolgt und zählen als Fehlschlag.
- **Timeout:** Maximale Dauer eines einzelnen Versuchs, Standard 5000 ms. Gilt vom Verbindungsaufbau bis zum Eintreffen der Antwort-Header.
- **Wiederholung:** Bei Fehlschlag wird bis zu einer Gesamtzahl von Versuchen (Standard 3) wiederholt, mit Pause (Standard 2000 ms) zwischen den Versuchen.
- **Fehlschlag:** Status außerhalb 200-299, Timeout, oder Verbindungsfehler (DNS, Verbindung abgelehnt, TLS).

## Akzeptanzkriterien

1. Aufruf: `node healthcheck.js <url> [--attempts N] [--timeout-ms N] [--delay-ms N]`. Ist die Umgebung gesund, endet das Script mit Exit-Code 0 und gibt genau eine Zeile auf stdout aus: `OK <url> HTTP <status> in <ms> ms (Versuch i/N)`.
2. Der erste erfolgreiche Versuch beendet die Prüfung sofort. Es gibt keine Pause nach dem letzten Versuch und keine Pause nach einem Erfolg.
3. Schlagen alle Versuche fehl, endet das Script mit Exit-Code 1 und gibt eine Zeile `FEHLER <url> nach N Versuchen: <Grund des letzten Versuchs>` auf stdout aus. Der Grund nennt Status (`HTTP 503`), Timeout (`Timeout nach 5000 ms`) oder Verbindungsfehler (`Verbindungsfehler: ECONNREFUSED`).
4. Jeder einzelne Versuch wird auf stderr protokolliert: `Versuch i/N: <Ergebnis> (<ms> ms)`.
5. Fehlende oder ungültige Eingaben (keine URL, anderes Schema als http/https, Zahlen außerhalb des erlaubten Bereichs, unbekannte Option) beenden das Script mit Exit-Code 2 und einer Usage-Meldung auf stderr, ohne dass ein Netzwerkzugriff stattfindet.
6. Query-Parameter der URL (`?token=...`) erscheinen in keiner Ausgabe, angezeigt wird nur Schema, Host, Port und Pfad. URLs mit Zugangsdaten (`user:pass@host`) werden mit Exit-Code 2 abgelehnt, und die Meldung wiederholt den Wert nicht.

## Nicht-Ziele

- Prüfung des Antwortinhalts (JSON-Felder, Versionsnummer), Authentifizierung per Header, Client-Zertifikate.
- Prüfung mehrerer URLs in einem Aufruf (Pipeline ruft das Script mehrfach auf).
- Anbindung an ein bestimmtes CI-System, Benachrichtigungen, Metriken.
- Exponentielles Backoff, Jitter, parallele Versuche.
- Proxy-Konfiguration (es gilt das Verhalten von Node).

## Offene Entscheidung (bewusst getroffen)

Laufzeit ist Node.js >= 20 ohne Abhängigkeiten (`fetch` und `AbortSignal.timeout` sind eingebaut), da die Pipeline-Agents und die Workshop-Rechner Node bereits haben. Eine Umsetzung in Bash/curl wäre ebenfalls möglich; sie ist hier nicht gewählt, weil sich Timeout, Retry und Exit-Codes in Node per `node --test` ohne Hilfsmittel testen lassen.
