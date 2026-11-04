# Tasks

## 1. CLI-Eingabe und Ausgabe-Vertrag

- [x] 1.1 Einen zunächst fehlschlagenden Prozess-Test für gültige und ungültige `--url`-Aufrufe erstellen, einschließlich Exit-Code `2`, leerem `stdout` und Usage auf `stderr`; mit `node --test` ausführen und das erwartete Fehlschlagen bestätigen.
- [x] 1.2 Argumentvalidierung und eine zentrale, ausschließlich JSON schreibende Ergebnisausgabe im CommonJS-CLI implementieren; den Test aus 1.1 grün ausführen.

## 2. HTTP-Statusbewertung

- [x] 2.1 Zunächst fehlschlagende Tests mit lokalem HTTP-Testserver für `200`, einen weiteren 2xx-Status und einen Nicht-2xx-Status schreiben; `stdout`-JSON, Exit-Code sowie `http_error` und kanalgetrennte Statusdiagnose prüfen.
- [x] 2.2 Den einmaligen Health-Request und die Bewertung aller Status `200` bis `299` als `healthy`, anderer HTTP-Status als `unhealthy` mit `http_error` implementieren; die lokalen HTTP-Status-Tests grün ausführen.

## 3. Technische Fehler und Schutz vor Datenabfluss

- [x] 3.1 Zunächst fehlschlagende Tests für nicht erreichbare lokale Ziele, die Fünf-Sekunden-Frist sowie fehlende oder unvollständige Antworten schreiben; `unreachable`, `timeout` beziehungsweise `invalid_response`, Exit-Code `1` und genau eine Ergebnis-JSON prüfen.
- [x] 3.2 Request-Abbruch, Fehlerklassifikation und Schutz gegen verspätete Ereignisse implementieren; die Fehlerpfad-Tests grün ausführen.
- [x] 3.3 Einen zunächst fehlschlagenden Test mit sensitiven URL-Bestandteilen erstellen, der prüft, dass weder `stdout` noch `stderr` die vollständige Eingabe oder sensible Werte enthalten.
- [x] 3.4 Diagnosen auf anonymisierte Kategorien und zulässige technische Metadaten begrenzen; den Sicherheits-Test grün ausführen.

## 4. Gesamtnachweis

- [x] 4.1 Die vollständige Suite mit `node --test` ausführen und bestätigen, dass sie nur lokale Testserver oder Fakes verwendet und alle Tests erfolgreich sind.

## Workflow follow-up

- Nach Review und abgeschlossener Implementierung die Änderung archivieren und das archivierte Ergebnis verifizieren.
