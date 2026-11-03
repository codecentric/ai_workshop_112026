# Referenzlösung: Pomodoro Timer — Runde 3 (Dev-Track)

Referenz zur [README](README.md): Vorgehen, ausgefüllte Prompts und Beispielantworten zum Story Refinement.

> Wie in den Runden davor ist das ein **Vergleichswert**, kein Soll. Der Lerneffekt entsteht, wenn ihr die Fragen selbst beantwortet und die Entscheidungen selbst trefft. Die Referenz behandelt **Story B (Sitzungshistorie)**. Hinweise zu Story A stehen in der Referenzlösung von Runde 4.

| Datei | Zweck |
|---|---|
| [`solution/DoR.md`](solution/DoR.md) | Basis-DoR plus 2 eigene Kriterien |
| [`solution/story.md`](solution/story.md) | Fertige Story (Ergebnis dieser Runde; wird in Runde 4 weiterverwendet) |
---

## Teil 1 — Story Refinement (30 min)

### Phase 1 — Eigene DoR (5 min)

`DoR.md` aus dem Repo-Root kopieren und unter "Unsere Ergänzungen" 1-2 Kriterien ergänzen. Gute Ergänzungen sind **feature-spezifisch** und prüfbar. Referenz:

```markdown
- [ ] Zeitbegriffe ("heute", "Phase beendet") sind mit Zeitbezug definiert (lokale Zeit vs. UTC, Verhalten um Mitternacht, Hintergrund-Tab).
- [ ] Fehlerfall des Speichers ist benannt (nicht verfügbar, beschädigt), und der Timer darf davon nie beeinträchtigt werden.
```

Warum diese beiden: Ein "Tageszähler" scheitert in der Praxis fast nie an der Idee, sondern an Zeit (Mitternacht, UTC) und Persistenz (Storage blockiert). Wer das vorab als DoR-Kriterium festhält, zwingt sich, es in der Story zu beantworten. Schwache Ergänzungen: "Story ist gut formuliert" (nicht prüfbar), "Code ist sauber" (gehört nicht in eine DoR).

### Phase 2 — Sokratische Session (20 min)

Ausgangsstory (Story B, bewusst lückenhaft):

> Als Nutzer möchte ich sehen können, wie viele Pomodoros ich heute schon gemacht habe, damit ich meinen Fortschritt im Blick behalte.

Die vier Prompts aus der README, mit **typischen Antworten** und was ihr daraus macht. Die KI-Antworten schwanken, entscheidend ist die Spalte "Konsequenz".

#### Prompt 1 — Annahmen aufdecken

Typische Antwort (gekürzt):

| Verdeckte Annahme | Konsequenz für die Story |
|---|---|
| "Pomodoro" = abgeschlossene Arbeitsphase (nicht Pause, nicht abgebrochene) | Begriff definieren |
| "heute" = Kalendertag, aber in welcher Zeitzone? | Lokaler Kalendertag festlegen |
| Der Wert überlebt Neuladen (Persistenz) | Speicherort und Plattform benennen |
| Nur ein Gerät/Browser | In die Nicht-Ziele |
| Anzeige ist permanent sichtbar | Ort der Anzeige festlegen |
| Reset zählt nicht / zählt doch? | Akzeptanzkriterium |

**Was überrascht typischerweise:** "heute" und die Persistenz. Beides wirkt trivial und ist die Hauptquelle von Rückfragen.

#### Prompt 2 — Risiken benennen

| Risiko | Art | Konsequenz |
|---|---|---|
| Phase endet im Hintergrund-Tab, `tick` kommt verspätet, Zählung doppelt oder gar nicht | Technisch | AK: genau einmal zählen |
| Phase läuft über Mitternacht | Fachlich | Regel: zählt für den Tag, an dem sie endet |
| `localStorage` blockiert/voll/Private Mode | Technisch | AK: Fehlertoleranz |
| `toISOString()` liefert UTC-Tag, Wechsel um 01:00/02:00 lokal | Technisch | Design: lokalen Tag verwenden |
| Nutzer erwartet Verlauf über Tage ("Historie" im Titel) | Missverständnis | Nicht-Ziel ausdrücklich nennen |
| Zähler verloren nach Browserdaten löschen | UX | Akzeptiert, kurz erwähnen |

**Hinweis:** Der Titel "Sitzungshistorie" verspricht mehr als die Story fordert. Das ist das klassische Missverständnis zwischen PO und Entwickler. Eine Zeile "Nicht-Ziele" löst es.

#### Prompt 3 — Lücken finden

Aus der Antwort entstehen die Akzeptanzkriterien. Referenz (6 Stück, siehe [`story.md`](solution/story.md)):

1. Anzeige-Format inkl. Einzahl ("Heute: 0 Pomodoros", "Heute: 1 Pomodoro")
2. Zählung bei regulärem Ende einer Arbeitsphase, genau einmal, auch bei verspätetem Tick
3. Pausenende, Pause/Fortsetzen und Reset zählen nicht
4. Zähler bleibt nach Neuladen am selben Tag
5. Neuer lokaler Kalendertag beginnt bei 0, Vortage nicht sichtbar
6. Speicher nicht nutzbar: Start bei 0, Timer unbeeinträchtigt, kein Dialog

**Prüffrage zu den AK:** Kann man jedes davon als Test schreiben, ohne eine Rückfrage zu stellen? Wenn nicht, ist es noch zu vage.

#### Prompt 4 — Advocatus Diaboli (optional)

Typische Einwände:

| Einwand | Reaktion |
|---|---|
| "Persistenz macht die Story größer als nötig." | Bewusst drin: ohne Persistenz ist ein Tageszähler wertlos (Neuladen = 0). Alternativ in zwei Stories splitten, wenn der Sprint knapp ist. |
| "Mitternachtsregel ist Randfall, streichen." | Bleibt als Regel in den Begriffen, kostet keinen eigenen Code (ergibt sich aus `dayKey` zum Endzeitpunkt). |
| "'Fortschritt im Blick' ist nicht testbar." | Stimmt, ist der Nutzen, nicht das AK. Die AK sind testbar. |
| "Mehrere Tabs?" | Nicht-Ziel, ausdrücklich dokumentiert. |

**Regel für die Reaktion:** Nicht jeden Einwand einbauen. Entscheiden und **die Entscheidung notieren** (Nicht-Ziel oder AK).

### Phase 3 — DoR-Check (5 min)

Prompt: `Prüfe meine Story gegen @DoR.md. Erfüllt sie alle Kriterien? Was fehlt noch konkret?`

Die KI sagt oft "alles erfüllt". Gezielt nachhaken, besonders bei den Kriterien, bei denen ihr unsicher seid:

```
Bist du sicher bei "Keine impliziten Annahmen über Technik oder Plattform"?
Die Story nennt localStorage. Ist das eine versteckte Annahme oder eine bewusst benannte?
```
```
Kriterium "Ein Entwickler könnte sie ohne Rückfragen starten": Nenne drei Fragen,
die ein Entwickler trotzdem stellen würde. Wenn du keine findest, begründe, warum.
```

**Gute Antwort der KI:** Sie findet noch etwas (z. B. Pluralform, Position der Anzeige, Tageswechsel bei offener Seite). **Schlechte Antwort:** pauschales "ja". Dann selbst gegen jedes Kriterium prüfen. Für die Referenz sind das die Ergebnisse:

| Kriterium | Erfüllt | Beleg |
|---|---|---|
| User, Feature, Nutzen | Ja | Kopf der Story |
| Mind. 3 AK | Ja | 6 AK |
| Keine undefinierten Begriffe | Ja | Abschnitt "Begriffe": Pomodoro, heute, abgeschlossen |
| Keine impliziten Annahmen | Ja | Abschnitt "Offene Entscheidung": localStorage ausdrücklich |
| In einem Sprint umsetzbar | Ja | Eine Datei-Logik, ca. 4 Funktionen, UI-Zeile |
| Ohne Rückfragen startbar | Ja | AK sind testbar, Nicht-Ziele benannt |
| Eigen: Zeitbegriffe definiert | Ja | lokal, Mitternacht, Hintergrund-Tab |
| Eigen: Speicher-Fehlerfall | Ja | AK 6 |

Ergebnis: [`story.md`](solution/story.md), das ihr in Runde 4 weiterverwendet.

**Reflexionsfrage, Orientierungsantwort:** Die sokratische Session war nützlicher, weil die KI Fragen **an euch** stellt und ihr die Entscheidungen trefft (Mitternacht, Persistenz, Nicht-Ziele). Eine von der KI geschriebene Story wäre vollständiger formuliert, aber ohne dass ihr sie versteht oder vertretet. Die Fragen decken außerdem auf, was *ihr* nicht wusstet.
