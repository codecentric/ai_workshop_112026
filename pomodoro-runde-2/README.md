# Übung: Pomodoro Timer — Runde 2 (mit AGENTS.md)

**Wann:** Tag 2, 10:00 Uhr — 45 Minuten
**Ziel:** Erleben, was ein gutes AGENTS.md verändert — Vorher-Nachher-Vergleich mit Runde 1
**Voraussetzung:** Code aus Runde 1 liegt noch irgendwo (siehe `../pomodoro-runde-1/`)

---

## Eure Rolle

### Entwickler — AGENTS.md schreiben + nochmal bauen

**Schritt 1 — AGENTS.md erstellen (15 min):**

Führt in diesem Ordner aus:
```
opencode init
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

Startet neu (leeres Verzeichnis oder neuer Branch) — mit demselben Ziel wie in Runde 1.
Beobachtet: Was ist anders? Was muss ich weniger erklären?

**Schritt 3 — Vergleich (5 min):**

Stellt Runde 1 und Runde 2 nebeneinander:
- Musste ich weniger erklären?
- Ist der Code konsistenter?
- Welche Zeile im AGENTS.md hat am meisten geholfen?

---

### DevOps — AGENTS.md reviewen + Story für den Nachmittag

**Aufgabe A — AGENTS.md eines Kollegen reviewen (20 min):**

Schaut euch das AGENTS.md eines Dev-Kollegen an. Nutzt OpenCode:
```
Hier ist das AGENTS.md eines Entwicklers: [Inhalt einfügen]
Aus Sicht eines DevOps-Engineers: Was fehlt, was in diesem Projekt wichtig wäre?
(z.B. Build-Prozess, Deployment-Constraints, Umgebungsvariablen, Logging)
```

Gebt dem Kollegen Feedback: Was würdet ihr ergänzen?

**Aufgabe B — Story für den Nachmittag vorbereiten (25 min):**

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

---

## Debrief (im Anschluss an die Übung)

- Devs: Was hat sich durch das AGENTS.md verändert?
- DevOps: Was habt ihr im AGENTS.md vermisst?
- Alle: Welche Information im AGENTS.md hatte den größten Effekt?
