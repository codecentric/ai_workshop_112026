# Design

## Context

Das Projekt enthält bislang nur die Story und keine Implementierung. Die Anforderungen der neuen Capability stehen in `specs/health-check-cli/spec.md`; Motivation und Umfang stehen in `proposal.md`. Das CLI muss mit Node.js 20, CommonJS und ohne externe Dependencies arbeiten.

## Goals / Non-Goals

**Goals:**
- Einen einzelnen HTTP-Health-Aufruf mit fester Fünf-Sekunden-Frist sicher ausführen.
- Den aggregierten Status des Endpunkts in eine stabile JSON-Ausgabe und dokumentierte Exit-Codes übersetzen.
- Testbarkeit durch Dependency-freie, lokale Node-Testserver gewährleisten.

**Non-Goals:**
- Keine Interpretation eines Response-Bodys oder Darstellung einzelner Abhängigkeiten.
- Keine Konfiguration von Authentisierung, Retries, Redirects, Scheduling, Alarmierung oder Monitoring.
- Keine Zugriffe auf nicht-lokale Ziele in der Testsuite.

## Decisions

### Eingebaute HTTP-API mit Timeout-Abbruch

Die Implementierung verwendet die in Node.js 20 eingebaute HTTP-Funktionalität und einen Abbruch nach 5.000 ms. Der Timeout gilt für die vollständige Antwort, nicht nur für den Verbindungsaufbau. Das erlaubt eine eindeutige Zuordnung zu `timeout` und verhindert hängende CLI-Prozesse.

Alternative: `fetch` mit einem zeitgesteuerten `AbortController`. Das wäre ebenfalls in Node 20 verfügbar, aber eine explizite Request/Response-Steuerung mit Node-Kernmodulen erleichtert die Behandlung unvollständiger Antworten und lokaler Testserver.

### Statusklasse als Endpoint-Vertrag

Das CLI bewertet jeden Status `200` bis `299` als `healthy`; alle anderen HTTP-Status werden mit `http_error` als `unhealthy` ausgegeben. Der Endpunkt aggregiert den Zustand kritischer Komponenten selbst. Das CLI erwartet deshalb weder JSON noch eine Komponentenliste vom Endpunkt.

Alternative: Ausschließlich HTTP `200` zu akzeptieren. Das würde unnötig von einer einzelnen erfolgreichen Statusvariante abhängen und widerspricht dem vereinbarten 2xx-Vertrag.

### Deterministische Ergebnisform und getrennte Ausgabekanäle

Eine zentrale Ergebniserzeugung erzeugt genau eine JSON-Zeile auf `stdout`: einen Gesamtstatus und den Check `application`, bei Fehlern ergänzt um einen kontrollierten Grund. Usage und diagnostische Informationen gehen an `stderr`. Diagnosen verwenden Kategorien und gegebenenfalls HTTP-Statuscodes, aber keine vollständige Ziel-URL und keine sensitiven Werte.

Alternative: Rohfehler oder die URL in Diagnosen auszugeben. Das hilft nur begrenzt bei der Diagnose und kann Query-Parameter oder Zugangsdaten offenlegen.

### Prozessnahe Integrationstests mit lokalen Servern

Tests starten lokale HTTP-Server oder nutzen Fakes und führen das CLI als separaten Node-Prozess aus. So lassen sich Exit-Code, `stdout`, `stderr`, Timeout und die strikte Kanaltrennung wie in CI prüfen.

Alternative: Nur exportierte Hilfsfunktionen zu testen. Das wäre schneller, würde aber Fehler bei Argumenten, Prozessausgabe und Exit-Codes nicht abdecken.

## Risks / Trade-offs

- [Antwort trifft nach dem Timeout ein] -> Request wird abgebrochen und spätere Ereignisse werden ignoriert, damit nur das Timeout-Ergebnis ausgegeben wird.
- [Ungültige oder unvollständige HTTP-Antwort] -> Als technischer Fehler mit `invalid_response` behandeln; keine erfolgreiche Bewertung aus unvollständigen Daten ableiten.
- [Shell- oder URL-Werte enthalten Geheimnisse] -> Weder Eingabewerte noch Rohfehler in Ausgaben spiegeln; Tests prüfen dies mit sensitiven Query-Parametern.
- [Subprozess-Tests können zeitkritisch sein] -> Testserver und Prozesse nach jedem Test zuverlässig schließen; nur der vorgesehene Timeout-Test wartet nahe der Fünf-Sekunden-Grenze.

## Migration Plan

1. Das neue CLI und seine Tests werden zum Projekt hinzugefügt.
2. Betreiber rufen das Skript mit dem bestehenden Health-Endpunkt auf.
3. Ein Rollback besteht aus dem Entfernen der neuen CLI-Integration; es werden weder Daten noch gemeinsamer Zustand migriert.
