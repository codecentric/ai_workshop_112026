# Übung: Story Refinement — Runde 3 (DevOps-Track)

## Teil 1 — Story Refinement (sokratisch)

**Dauer:** 30 Minuten
**Ziel:** Eine DoR-konforme User Story schreiben — durch eigenes Denken + AI als Sparringspartner
**Output:** Eine fertige Story, die ihr am Nachmittag als Input für OpenSpec verwendet

> **Arbeitsort:** Bleibt in eurem eigenen DevOps-Arbeitsordner. Dieser enthält
> bereits die Rohstory `story.md` und das DevOps-`AGENTS.md` aus Runde 2.


### Kontext

Ihr schreibt eine Story für einen kleinen DevOps-Prozess aus eurem Alltag — die nehmt ihr am Nachmittag in Runde 4 mit in OpenSpec.

**Aber: AI schreibt die Story nicht für euch — auch nicht fertig um.** AI stresstestet sie — bevor ihr anfangt zu bauen.

### Phase 1 — Ausgangspunkt + eigene DoR (5 min)

Kopiert `DoR.md` vom Repo-Root in euren Arbeitsordner und ergänzt unter "Unsere Ergänzungen" 1–2 eigene Kriterien, die euch für euer Feature/Projekt wichtig sind. Das ist jetzt *eure* DoR, nicht nur eine vorgegebene Liste.

Ihr habt eure grobe Story bereits in Runde 2, **Aufgabe A** (siehe `../pomodoro-runde-2/`), geschrieben. Öffnet die `story.md` aus eurem Arbeitsordner — das ist euer Ausgangspunkt für Phase 2. Beispiele: Deployment-Healthcheck, Log-Report-Script, Branch-Naming-CI-Check.

### Phase 2 — Sokratische AI-Session (20 min)

Jetzt kommt AI ins Spiel — aber nicht als Ghostwriter. Ihr führt sie durch eine Reihe von Fragen.

Öffnet OpenCode und nutzt diese Prompt-Sequenz:

**Prompt 1 — Annahmen aufdecken:**
```
Ich habe folgende User Story geschrieben:

[Eure Story hier einfügen]

Welche Annahmen habe ich in dieser Story getroffen, die ich nicht explizit gemacht habe?
Liste sie auf — ohne sie zu bewerten.
```
→ Lest die Antwort. Welche Annahmen überraschen euch?

**Prompt 2 — Risiken benennen:**
```
Was könnte schiefgehen, wenn wir diese Story genau so implementieren?
Denk an: technische Risiken, UX-Probleme, Missverständnisse zwischen Entwickler und Auftraggeber.
```
→ Gibt es Risiken, die ihr noch nicht auf dem Schirm hattet?

**Prompt 3 — Lücken finden:**
```
Was fehlt noch, damit ein Entwickler diese Story ohne Rückfragen umsetzen kann?
Beziehe dich auf: fehlende Akzeptanzkriterien, unklar definierte Begriffe, fehlende Edge Cases.
```
→ Ergänzt Akzeptanzkriterien auf Basis der Antwort.

**Prompt 4 — Advocatus Diaboli (optional, wenn Zeit):**
```
Spiele den skeptischen Kollegen: Was würde jemand, der diese Story ablehnen will,
als Argument bringen? Was ist schwammig, zu groß, nicht testbar?
```
→ Macht die Story kleiner oder schärfer, wenn nötig.

### Phase 3 — Story verfeinern + DoR-Check (5 min)

Überarbeitet eure Story auf Basis des AI-Feedbacks aus Phase 2.

Prüft sie dann mit eurer eigenen `DoR.md` gegen:
```
Prüfe meine Story gegen @DoR.md. Erfüllt sie alle Kriterien? Was fehlt noch konkret?
```

> Nehmt die Antwort nicht einfach so hin — wenn die KI "passt alles" sagt, obwohl ihr selbst noch unsicher seid, fragt gezielt nach ("Bist du sicher bei Kriterium X? Warum?"). Ein zu wohlwollendes "ja, konform" ist genau die Art von AI-Antwort, der man nicht blind vertrauen sollte.

## Ablauf (30 min)

| Dauer | Was | Wer |
|---|---|---|
| 5 Minuten | Grobe DevOps-Story aus Runde 2 und eigene DoR vorbereiten | DevOps-Track |
| 20 Minuten | Sokratische AI-Session: Annahmen, Risiken und Lücken prüfen; bei Zeit Advocatus Diaboli | DevOps-Track |
| 5 Minuten | Story fertigstellen, gegen die DoR prüfen und als `story.md` für Runde 4 speichern | DevOps-Track |

### Abschluss

Speichert eure fertige Story als `story.md` in eurem Arbeitsordner — diese verwendet ihr am Nachmittag in Runde 4 mit OpenSpec weiter.

## Übergabe an Runde 4

- [ ] Die verfeinerte `story.md` liegt neben eurem DevOps-`AGENTS.md` im Arbeitsordner.
- [ ] Jedes Akzeptanzkriterium ist testbar; Exit-Codes und Ausgabekanäle sind benannt.
- [ ] Nicht-Ziele, Fehlerfälle und Sicherheitsgrenzen sind dokumentiert.

Runde 4 verwendet diesen Arbeitsordner direkt. Ein leerer neuer Ordner ist nicht nötig.

**Reflexionsfrage:** War die AI-Rückfrage-Session nützlicher als wenn AI die Story direkt geschrieben hätte? Warum?
