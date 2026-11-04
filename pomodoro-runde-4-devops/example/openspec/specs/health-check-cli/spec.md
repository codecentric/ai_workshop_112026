# health-check-cli Specification

## Purpose

Stellt einen lokalen, maschinenlesbaren Health Check für Anwendungen bereit, deren Gesundheitszustand als HTTP-Status verdichtet angeboten wird.

## Requirements

### Requirement: Validierter lokaler CLI-Aufruf
Das System SHALL über `node health-check.js --url <health-endpoint-url>` ausführbar sein. Es MUST genau einen nichtleeren, syntaktisch gültigen URL-Wert akzeptieren. Bei fehlendem, leerem oder ungültigem Wert MUST es mit Exit-Code `2` enden, `stdout` leer lassen und Usage auf `stderr` ausgeben.

#### Scenario: Gültige URL wird akzeptiert
- **WHEN** der Betreiber einen syntaktisch gültigen Wert mit `--url` übergibt
- **THEN** das CLI startet genau eine Health-Prüfung dieses Ziels

#### Scenario: URL fehlt oder ist ungültig
- **WHEN** `--url` fehlt, keinen Wert hat oder keinen syntaktisch gültigen URL-Wert enthält
- **THEN** das CLI endet mit Exit-Code `2`, gibt keine Ergebnis-JSON auf `stdout` aus und schreibt Usage auf `stderr`

### Requirement: Bewertung erfolgreicher Health-Antworten
Das System SHALL jeden HTTP-Status von `200` bis `299` als gesunden, vom Health-Endpunkt aggregierten Zustand bewerten. Es MUST mit Exit-Code `0` enden und auf `stdout` eine JSON mit Gesamtstatus `healthy` sowie einem gesunden Check namens `application` ausgeben.

#### Scenario: Endpunkt antwortet mit 200
- **WHEN** der Health-Endpunkt innerhalb von fünf Sekunden mit HTTP `200` antwortet
- **THEN** das CLI gibt ausschließlich eine gesunde Ergebnis-JSON auf `stdout` aus und endet mit Exit-Code `0`

#### Scenario: Endpunkt antwortet mit anderem 2xx-Status
- **WHEN** der Health-Endpunkt innerhalb von fünf Sekunden mit einem HTTP-Status von `201` bis `299` antwortet
- **THEN** das CLI bewertet die Anwendung als gesund und endet mit Exit-Code `0`

### Requirement: Bewertung ungesunder Health-Ergebnisse
Das System SHALL nicht erfolgreiche HTTP-Antworten und technische Fehler als ungesund bewerten. Es MUST mit Exit-Code `1` enden und eine Ergebnis-JSON mit Gesamtstatus `unhealthy`, einem ungesunden Check namens `application` und einem passenden Grund ausgeben.

#### Scenario: Endpunkt antwortet mit nicht erfolgreichem HTTP-Status
- **WHEN** der Health-Endpunkt mit einem HTTP-Status außerhalb von `200` bis `299` antwortet
- **THEN** das CLI gibt `unhealthy` mit Grund `http_error` auf `stdout` aus, endet mit Exit-Code `1` und darf den Statuscode nur auf `stderr` diagnostizieren

#### Scenario: Ziel ist nicht erreichbar
- **WHEN** die Anfrage wegen eines DNS- oder Netzwerkfehlers nicht aufgebaut werden kann
- **THEN** das CLI gibt `unhealthy` mit Grund `unreachable` auf `stdout` aus und endet mit Exit-Code `1`

#### Scenario: Antwort überschreitet die Frist
- **WHEN** innerhalb von fünf Sekunden keine vollständige HTTP-Antwort vorliegt
- **THEN** das CLI bricht die Prüfung ab, gibt `unhealthy` mit Grund `timeout` auf `stdout` aus und endet mit Exit-Code `1`

### Requirement: Sichere Kanaltrennung und lokale Testbarkeit
Das System SHALL Ergebnisdaten ausschließlich als JSON auf `stdout` schreiben. Es MUST Fortschritt, Usage und technische Diagnosen ausschließlich auf `stderr` schreiben und darf weder vollständige Eingabe-URLs noch Secrets, Tokens oder Passwörter in einem Ausgabekanal offenlegen. Automatisierte Tests MUST ausschließlich lokale Server oder Fakes verwenden.

#### Scenario: Technische Diagnose wird getrennt ausgegeben
- **WHEN** eine Prüfung wegen eines Netzwerkfehlers oder HTTP-Fehlers fehlschlägt
- **THEN** `stdout` enthält nur die Ergebnis-JSON und `stderr` enthält höchstens eine anonymisierte technische Diagnose

#### Scenario: Tests laufen ohne externe Ziele
- **WHEN** die automatisierte Testsuite mit `node --test` ausgeführt wird
- **THEN** verwendet sie ausschließlich lokale Testserver oder Fakes und kontaktiert keine Produktiv- oder Staging-Systeme
