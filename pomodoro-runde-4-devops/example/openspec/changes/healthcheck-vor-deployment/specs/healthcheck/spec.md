## ADDED Requirements

### Requirement: Gesunde Umgebung erkennen
Das System SHALL eine Umgebung als gesund melden, wenn ein Versuch innerhalb des Timeouts mit HTTP-Status 200 bis 299 antwortet, und mit Exit-Code 0 enden. Die Ergebniszeile `OK <url> HTTP <status> in <ms> ms (Versuch i/N)` steht auf stdout.

#### Scenario: Erster Versuch erfolgreich
- **WHEN** die URL beim ersten Versuch mit 200 antwortet
- **THEN** endet das Script mit Exit-Code 0 und wartet nicht

#### Scenario: Anderer 2xx-Status
- **WHEN** die URL mit 204 antwortet
- **THEN** gilt sie als gesund

### Requirement: Fehlschläge erkennen
Das System SHALL jeden Status außerhalb 200-299, jeden Timeout und jeden Verbindungsfehler als Fehlschlag eines Versuchs werten.

#### Scenario: Server-Fehler
- **WHEN** die URL mit 503 antwortet
- **THEN** gilt der Versuch als fehlgeschlagen mit Grund `HTTP 503`

#### Scenario: Weiterleitung
- **WHEN** die URL mit 302 antwortet
- **THEN** wird der Weiterleitung nicht gefolgt und der Versuch gilt als fehlgeschlagen

#### Scenario: Timeout
- **WHEN** innerhalb des Timeouts keine Antwort eintrifft
- **THEN** gilt der Versuch als fehlgeschlagen mit Grund `Timeout nach <ms> ms`

#### Scenario: Verbindung abgelehnt
- **WHEN** an der Adresse nichts lauscht
- **THEN** gilt der Versuch als fehlgeschlagen mit Grund `Verbindungsfehler: ECONNREFUSED`

### Requirement: Wiederholung
Das System SHALL nach einem Fehlschlag bis zur Gesamtzahl der Versuche (Standard 3) wiederholen und zwischen den Versuchen die Pause (Standard 2000 ms) einhalten.

#### Scenario: Erholung beim zweiten Versuch
- **WHEN** der erste Versuch mit 503 und der zweite mit 200 antwortet
- **THEN** endet das Script mit Exit-Code 0 und führt keinen dritten Versuch aus

#### Scenario: Alle Versuche scheitern
- **WHEN** alle Versuche fehlschlagen
- **THEN** endet das Script mit Exit-Code 1 und gibt `FEHLER <url> nach N Versuchen: <Grund des letzten Versuchs>` auf stdout aus
- **AND** wartet nach dem letzten Versuch nicht mehr

### Requirement: Nachvollziehbare Ausgabe
Das System SHALL jeden Versuch als `Versuch i/N: <Ergebnis> (<ms> ms)` auf stderr protokollieren und in keiner Ausgabe Query-Parameter der URL zeigen.

#### Scenario: URL mit Token in der Query
- **WHEN** die URL `https://host/health?token=abc` lautet
- **THEN** erscheint `token` weder in stdout noch in stderr

### Requirement: Eingaben validieren
Das System SHALL bei fehlenden oder ungültigen Eingaben mit Exit-Code 2 und einer Usage-Meldung auf stderr enden, ohne das Netzwerk zu benutzen.

#### Scenario: Falsches Schema
- **WHEN** die URL mit `ftp://` beginnt
- **THEN** endet das Script mit Exit-Code 2

#### Scenario: Zugangsdaten in der URL
- **WHEN** die URL `https://user:secret@host/health` lautet
- **THEN** endet das Script mit Exit-Code 2, ohne Netzwerkzugriff, und `secret` erscheint in keiner Ausgabe

#### Scenario: Zahl außerhalb des Bereichs
- **WHEN** `--attempts 0` übergeben wird
- **THEN** endet das Script mit Exit-Code 2
