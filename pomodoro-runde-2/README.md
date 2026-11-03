# Übung: Pomodoro Timer — Runde 2 (mit AGENTS.md)

**Dauer:** 45 Minuten
**Ziel:** Erleben, was ein gutes AGENTS.md verändert — Vorher-Nachher-Vergleich mit Runde 1
**Voraussetzung:** Der eigene Arbeitsordner enthält den Timer-Stand aus Runde 1.
Wer in Runde 1 Option B gewählt hat, übernimmt jetzt einen gemeinsamen Timer-Stand
von einem Dev-Partner oder verwendet den bereitgestellten Ausgangsstand.

---


## Eure Rolle

> **Arbeitsort:** Bleibt in eurem eigenen Arbeitsordner.

### Entwickler — AGENTS.md schreiben + nochmal bauen

**Schritt 1 — AGENTS.md erstellen (15 min):**

Startet OpenCode in eurem eigenen Arbeitsordner und führt **im OpenCode-Chat** aus:
```
opencode
/init
```

Füllt das generierte AGENTS.md mit relevantem Kontext. Mindestens:

```markdown
# Projekt
[Name und Zweck in 1–2 Sätzen]

# Tech-Stack
[Sprache, Framework, Laufzeit — so konkret wie möglich]

# Konventionen
[Benennung, Fehlerbehandlung, Stil — was soll die KI wissen?]
Beispiel TDD: "Schreibe für jede neue Funktion zuerst einen fehlschlagenden Test, erst danach die Implementierung."

# Was die KI nicht tun soll
[z.B. keine externen Libraries, keine globalen Variablen, immer Kommentare auf Deutsch]
```

Nutzt OpenCode, um euer AGENTS.md zu verbessern:
```
Ich baue [Use Case]. Mein AGENTS.md enthält bisher:
[AGENTS.md einfügen]
Was fehlt, damit die KI meinen Code-Stil versteht und konsistentere Ergebnisse liefert?
```

**Schritt 2 — Nochmal bauen (25 min):**

Erstellt darin bei Bedarf einen neuen Branch oder Unterordner, aber behaltet den
Runde-1-Stand als Vergleich. Baut mit demselben Ziel wie in Runde 1 erneut.
Beobachtet: Was ist anders? Was muss ich weniger erklären?

**Schritt 3 — Vergleich (5 min):**

Stellt Runde 1 und Runde 2 nebeneinander:
- Musste ich weniger erklären?
- Ist der Code konsistenter?
- Welche Zeile im AGENTS.md hat am meisten geholfen?

---

### DevOps — AGENTS.md reviewen + Story für den Nachmittag

**Aufgabe A — Eigene Story und AGENTS.md für den Nachmittag vorbereiten (25 min):**

Am Nachmittag (Runde 3) arbeitet ihr mit OpenSpec an einer eigenen Story.
Euer Thema: ein kleiner, abgrenzbarer DevOps-Prozess aus eurem Alltag.

Beispiele:
- Automatisierter Check vor einem Deployment (z.B. Healthcheck-Script)
- Script, das Log-Dateien auswertet und einen Report erzeugt
- Kleines CI-Hilfs-Script (z.B. Branch-Naming prüfen)

Schreibt eine erste grobe User Story (ohne AI):
```
Als [wen?]
möchte ich [was?]
damit [warum?]
```

Ihr verfeinert sie in der Story-Refinement-Übung vor der Mittagspause (siehe `../pomodoro-runde-3-devops/`).

Speichert die Rohfassung direkt als `story.md` in eurem DevOps-Arbeitsordner.
Erstellt daneben ein eigenes `AGENTS.md`. Es enthält mindestens:

```markdown
# Tech-Stack
Node.js >= 20, CommonJS, keine externen Dependencies, Tests mit `node --test`.

# Schnittstelle
Exit-Code 0 = Erfolg, 1 = fachlicher/technischer Fehler, 2 = ungültige Eingabe.
Ergebnis nach stdout; Fortschritt, Diagnose und Usage nach stderr.

# Sicherheit und Betrieb
Keine Secrets oder vollständigen Eingabewerte in Logs. Keine Produktiv- oder
Staging-Zugriffe für Tests; Netzwerk nur nach expliziter Freigabe.
```

**Aufgabe B — AGENTS.md eines Kollegen reviewen (20 min):**

Schaut euch das AGENTS.md eines Dev-Kollegen an. Nutzt OpenCode:
```
Hier ist das AGENTS.md eines Entwicklers: [Inhalt einfügen]
Aus Sicht eines DevOps-Engineers: Was fehlt, was in diesem Projekt wichtig wäre?
(z.B. Build-Prozess, Deployment-Constraints, Umgebungsvariablen, Logging)
```

Gebt dem Kollegen Feedback: Was würdet ihr ergänzen?

## Ablauf für alle (45 min)

| Dauer | Was | Wer |
|---|---|---|
| 15 Minuten | `AGENTS.md` mit `/init` erstellen und ergänzen | Entwickler |
| 25 Minuten | Grobe DevOps-Story und eigenes AGENTS.md für Runde 3/4 vorbereiten | DevOps |
| 25 Minuten | Runde-1-Use-Case mit dem neuen Kontext erneut bauen | Entwickler |
| 20 Minuten | AGENTS.md eines Dev-Kollegen reviewen und Feedback geben | DevOps |
| 5 Minuten | Runde 1 und 2 vergleichen | Entwickler |
| Parallel zur vorherigen Phase | Gemeinsamer Debrief: Wirkung des Kontexts und fehlende Betriebsaspekte besprechen | alle |

---

---

## Debrief (im Anschluss an die Übung)

- Devs: Was hat sich durch das AGENTS.md verändert?
- DevOps: Was habt ihr im AGENTS.md vermisst?
- Alle: Welche Information im AGENTS.md hatte den größten Effekt?

## Übergabe an Runde 3 und 4

### Dev

- [ ] Der Timer-Basisstand, `AGENTS.md` und grüne Tests liegen im eigenen Arbeitsordner.
- [ ] Ihr wisst, welche AGENTS-Regel den größten Effekt hatte.

### DevOps

- [ ] Die Rohstory liegt als `story.md` im eigenen Arbeitsordner.
- [ ] Drei offene Fragen für das Refinement sind notiert.
- [ ] Ein eigenes DevOps-`AGENTS.md` mit Test-, Exit-Code-, Ausgabe- und Sicherheitsregeln liegt vor.
