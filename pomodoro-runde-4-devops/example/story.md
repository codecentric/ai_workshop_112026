# User Story: Health-Check-CLI

Als Betreiber möchte ich über ein lokales Kommando einen Health Check für eine konfigurierte Anwendung ausführen können, damit ich anhand eines eindeutigen, maschinenlesbaren Ergebnisses feststellen kann, ob die Anwendung und ihre als kritisch definierten Abhängigkeiten betriebsbereit sind.

## Begriffe und Abgrenzung

- **Betreiber:** Person oder CI-/Betriebsprozess, die bzw. der das bereitgestellte CLI-Skript ausführen darf.
- **Health Check:** Einmalige technische Prüfung des aktuellen Zustands der Anwendung und ihrer kritischen Abhängigkeiten.
- **Gesund / betriebsbereit:** Die Anwendung ist erreichbar und alle kritischen Prüfungen sind erfolgreich.
- **Ungesund / nicht betriebsbereit:** Die Anwendung ist nicht erreichbar, eine kritische Prüfung schlägt fehl oder läuft in ein Timeout.
- **Kritische Abhängigkeit:** Komponente, ohne die die Anwendung ihren Kernbetrieb nicht aufnehmen oder fortführen kann.
- **Ausführen:** Starten des lokalen Node.js-CLI-Skripts mit einem gültigen Ziel.

Die Story umfasst ein Node.js-CLI-Skript ohne externe Dependencies. Es prüft den konfigurierten Health-Endpunkt der Anwendung und die dort gemeldeten kritischen Komponenten. Benutzeroberfläche, Alarmierung, Scheduling, Monitoring-Anbindung, Kubernetes-Probes sowie Produktiv- oder Staging-Zugriffe in Tests sind nicht Bestandteil dieser Story.

## Schnittstelle

```bash
node health-check.js --url <health-endpoint-url>
```

Beispiel:

```bash
node health-check.js --url http://localhost:3000/health
```

### Ausgabe und Exit-Codes

- Das Ergebnis wird ausschließlich als JSON auf `stdout` ausgegeben.
- Fortschritt, technische Diagnose, Fehlermeldungen und Usage werden ausschließlich auf `stderr` ausgegeben.
- Ausgaben dürfen keine Secrets, Tokens, Passwörter oder vollständigen sensitiven Eingabewerte enthalten.

| Exit-Code | Bedeutung |
| --- | --- |
| `0` | Anwendung und alle kritischen Komponenten sind gesund. |
| `1` | Fachlicher oder technischer Fehler: Anwendung ist ungesund, nicht erreichbar oder ein Timeout ist aufgetreten. |
| `2` | Ungültige Eingabe, etwa fehlender oder syntaktisch ungültiger `--url`-Wert. |

Beispiel für eine erfolgreiche Ausgabe:

```json
{
  "status": "healthy",
  "checks": [
    { "name": "application", "status": "healthy" }
  ]
}
```

Beispiel für eine fehlerhafte Ausgabe:

```json
{
  "status": "unhealthy",
  "checks": [
    { "name": "application", "status": "unhealthy", "reason": "timeout" }
  ]
}
```

Erlaubte Statuswerte sind `healthy` und `unhealthy`.

## Akzeptanzkriterien

1. **Erfolgreicher Health Check:** Bei einem gültigen `--url`-Parameter und einem Health-Endpunkt, der für alle kritischen Komponenten `healthy` meldet, beendet sich das Skript mit Exit-Code `0` und schreibt eine Ergebnis-JSON mit `status: "healthy"` auf `stdout`.

2. **Nicht erreichbare Anwendung:** Ist das Ziel einer gültigen URL nicht erreichbar, beendet sich das Skript mit Exit-Code `1`, schreibt eine Ergebnis-JSON mit `status: "unhealthy"` und `reason: "unreachable"` auf `stdout` und gibt technische Diagnose nur auf `stderr` aus.

3. **Fehler einer kritischen Komponente:** Meldet ein erreichbarer Health-Endpunkt mindestens eine kritische Komponente als `unhealthy`, beendet sich das Skript mit Exit-Code `1` und nennt die betroffene Komponente einschließlich Status im JSON-Ergebnis.

4. **Timeout:** Liefert das Ziel innerhalb von fünf Sekunden keine vollständige Antwort, bricht das Skript die Prüfung ab, beendet sich mit Exit-Code `1` und liefert `status: "unhealthy"` sowie `reason: "timeout"`.

5. **Ungültige Eingabe:** Bei fehlendem `--url`, leerem URL-Wert oder syntaktisch ungültiger URL beendet sich das Skript mit Exit-Code `2`, schreibt keine Ergebnis-JSON auf `stdout` und gibt eine Usage-Nachricht auf `stderr` aus.

6. **Ausgabekanäle:** Jede Ergebnis-JSON steht ausschließlich auf `stdout`; Fortschritt, Diagnose, Fehlerdetails und Usage stehen ausschließlich auf `stderr`.

7. **Sensible Daten:** Weder `stdout` noch `stderr` enthalten Secrets, Tokens, Passwörter oder vollständige sensible Eingabewerte.

8. **Lokal testbar:** Die mit `node --test` ausgeführten automatisierten Tests verwenden ausschließlich lokale Testserver oder Fakes und greifen nicht auf Produktiv- oder Staging-Systeme zu.

## Edge Cases

| Situation | Erwartetes Verhalten |
| --- | --- |
| DNS- oder Netzwerkfehler | `unhealthy`, Exit-Code `1`, Grund `unreachable`. |
| HTTP-Fehlerstatus | `unhealthy`, Exit-Code `1`; HTTP-Status darf als Diagnose auf `stderr` erscheinen. |
| Ungültiges oder unvollständiges JSON | `unhealthy`, Exit-Code `1`, Grund `invalid_response`. |
| Mehrere fehlerhafte kritische Komponenten | Alle ermittelten Komponenten stehen im Ergebnis; Exit-Code `1`. |
| Fehler einer optionalen Komponente | Verändert den Gesamtstatus nicht; optionale Komponenten sind nicht Teil dieser Story. |
| Parallele Aufrufe | Jeder Aufruf arbeitet unabhängig und speichert keinen gemeinsamen Zustand. |
| Antwort nach Timeout | Die Antwort wird ignoriert; Ergebnis bleibt `unhealthy` mit Grund `timeout`. |

## Nichtfunktionale Anforderungen

- Node.js mindestens Version 20, CommonJS und keine externen Dependencies.
- Tests werden mit `node --test` ausgeführt.
- Der Check führt keine schreibenden oder fachlichen Seiteneffekte aus.
- Netzwerkzugriffe außerhalb lokaler Tests erfolgen nur nach expliziter Freigabe.
