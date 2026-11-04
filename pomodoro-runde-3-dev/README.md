# Übung: Story Refinement + Pomodoro Timer — Runde 3 (Dev-Track)

## Teil 1 — Story Refinement (sokratisch)

**Dauer:** 30 Minuten

**Ziel:** Eine DoR-konforme User Story schreiben — durch eigenes Denken + AI als Sparringspartner

**Output:** Eine fertige Story, die ihr am Nachmittag als Input für OpenSpec verwendet

> **Arbeitsort:** Bleibt in eurem eigenen Dev-Arbeitsordner. Dieser enthält bereits
> euren Runde-2-Stand (Code und `AGENTS.md`).
> Prüft das kurz, bevor ihr startet. `DoR.md` kopiert ihr in Phase 1 aus dem Repo-Root hinein.


### Kontext

Ihr baut in Runde 4 euren Pomodoro Timer mit Spec Driven Development weiter aus. Die Basis ist euer eigener Timer-Stand aus Runde 2 — ihr erweitert ihn.

Ihr bekommt gleich eine vorbereitete User Story für ein Feature — genau wie im Alltag, wo die Story meist vom Product Owner kommt und nicht von euch selbst geschrieben wird.

**Aber: AI schreibt die Story nicht für euch — auch nicht fertig um.** AI stresstestet sie — bevor ihr anfangt zu bauen.

### Phase 1 — Ausgangspunkt + eigene DoR (5 min)

Kopiert `DoR.md` vom Repo-Root in euren Arbeitsordner und ergänzt unter "Unsere Ergänzungen" 1–2 eigene Kriterien, die euch für euer Feature wichtig sind (z. B. "Keine Annahmen über Browser-Unterstützung" oder "Fehlerfall X ist benannt"). Das ist jetzt *eure* DoR, nicht nur eine vorgegebene Liste.

Wählt eine der beiden vorbereiteten Stories (wie beim echten PO-Handoff: nicht perfekt, nicht vollständig):

> **Story A — Pausen-Benachrichtigung**
> Als Nutzer möchte ich benachrichtigt werden, wenn eine Pause beginnt oder endet, damit ich das nicht verpasse.

> **Story B — Sitzungshistorie**
> Als Nutzer möchte ich sehen können, wie viele Pomodoros ich heute schon gemacht habe, damit ich meinen Fortschritt im Blick behalte.

Lest eure Story einmal durch — das ist euer Ausgangspunkt für Phase 2. Beide sind absichtlich so lückenhaft formuliert, wie eine Story im Alltag oft bei euch ankommt (keine Akzeptanzkriterien, offene Begriffe, keine Edge Cases).

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
| 5 Minuten | Ausgangsstory wählen, eigene DoR ergänzen | Dev-Track |
| 20 Minuten | Sokratische AI-Session: Annahmen, Risiken und Lücken prüfen; bei Zeit Advocatus Diaboli | Dev-Track |
| 5 Minuten | Story fertigstellen, gegen die DoR prüfen und als `story.md` für Runde 4 speichern | Dev-Track |

### Abschluss

Speichert eure fertige Story als `story.md` in eurem Arbeitsordner — diese verwendet ihr am Nachmittag in Runde 4 mit OpenSpec weiter.

## Übergabe an Runde 4

- [ ] `story.md` liegt neben Code und `AGENTS.md` im eigenen Arbeitsordner.

**Reflexionsfrage:** War die AI-Rückfrage-Session nützlicher als wenn AI die Story direkt geschrieben hätte? Warum?
