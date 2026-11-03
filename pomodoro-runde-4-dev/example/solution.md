# Referenzlösung: Pomodoro Timer — Runde 4 (Dev-Track)

Referenz zur [README](README.md): vollständiger OpenSpec-Change und Implementierung auf Basis der Story aus Runde 3.

| Datei | Zweck |
|---|---|
| [`solution/story.md`](solution/story.md) | Aus Runde 3 übernommene, fertige Story |
| [`solution/AGENTS.md`](solution/AGENTS.md) | Projektregeln aus Runde 2 |
| [`solution/openspec/config.yaml`](solution/openspec/config.yaml) | TDD-Regeln für Propose und Apply |
| [`solution/openspec/changes/sitzungshistorie/`](solution/openspec/changes/sitzungshistorie/) | `proposal.md`, `design.md`, `specs/history/spec.md`, `tasks.md` |
| [`solution/timer.js`](solution/timer.js), [`timer.test.js`](solution/timer.test.js), [`index.html`](solution/index.html) | Runde-2-Stand plus Feature (19 Tests, `node --test`) |

Ausprobieren:
```bash
cd pomodoro-runde-4-dev/solution
node --test
open index.html   # Prüfschritte: siehe "Manuell prüfen"
```

---

## Spec Driven Development (55 min)
### Schritt 0 — `openspec init` und TDD in `config.yaml` (2 min)

```bash
cd pomodoro-runde-4-dev/mein-timer   # Runde-2-Stand als Basis kopieren
openspec init                        # Tool "OpenCode" wählen
```

Danach `openspec/config.yaml` ergänzen. Referenz: [`solution/openspec/config.yaml`](solution/openspec/config.yaml)

```yaml
schema: spec-driven

context: |
  Pomodoro Timer, Vanilla JS, läuft per Doppelklick (file://), keine Dependencies, kein Build.
  Logik in timer.js (rein, ohne DOM und Date.now), UI in index.html, Tests mit `node --test`.
  Details stehen in AGENTS.md.

rules:
  tasks:
    - Vor jedem Feature-Task steht ein Test-Task, der zuerst fehlschlägt.

operations:
  apply:
    guidance:
      - Schreibe für jeden Task zuerst den Test (rot), dann die Implementierung (grün).
      - Führe nach dem Test-Task `node --test` aus und zeige das Scheitern, bevor du implementierst.
```

Der `context`-Block ist optional, aber nützlich: Er ersetzt, dass OpenSpec das Projekt erst erraten muss. Die zweite `guidance`-Zeile ist die Verschärfung aus Runde 2 ("Scheitern zeigen"). Die Struktur (`rules.tasks`, `operations.apply.guidance`) kommt aus der README. Falls eure OpenSpec-Version andere Schlüssel erwartet, gilt, was `openspec init` in der generierten Datei vorgibt.

**Unterschied zu AGENTS.md:** AGENTS.md steuert OpenCode immer; `config.yaml` nur die OpenSpec-Phasen und strukturierter.

### Schritt 1 — Explore (13 min)

```
/opsx:explore @story.md
```

**Regel: kein Code.** Wenn die KI anfängt zu implementieren: "Stopp, wir sind in Explore. Nur Fragen und Optionen."

Typische Rückfragen von OpenSpec und Referenzantworten:

| Frage | Antwort | Wirkung |
|---|---|---|
| Wo wird der Zähler gespeichert? | `localStorage`, ein Schlüssel, ein Datensatz `{day, count}` | Design-Entscheidung |
| Was passiert bei Phasenende im Hintergrund-Tab? | `tick` erkennt es beim nächsten Aufruf, einmal zählen | AK 2 bestätigt |
| Woher weiß die UI, dass eine *Arbeits*phase endete? | `tick` liefert zusätzlich `endedMode` | Kleine Änderung an bestehender API |
| Wo lebt die Zähl-Logik? | `timer.js`, rein; Rohstring rein, Rohstring raus | Testbar ohne Browser |
| Neuer Tag bei offener Seite? | Wird beim nächsten `render` erkannt | Kein eigener Timer |

Wenn die Fragen eine Lücke in der Story aufdecken, `story.md` anpassen. In der Referenz kam dabei die Frage nach `endedMode` hinzu, das war vorher nicht in der Story, nur im Design.

### Schritt 2 — Propose (20 min)

```
/opsx:propose sitzungshistorie
```

Erzeugt `openspec/changes/sitzungshistorie/` mit den Artefakten. Referenz-Ergebnis (gekürzt, vollständig im Ordner):

**[`proposal.md`](solution/openspec/changes/sitzungshistorie/proposal.md):** Why (Pomodoros im Kopf zählen), What Changes (Zähler, `endedMode`, localStorage), Nicht-Ziele, Impact (nur `timer.js` und `index.html`), offene Frage Mehrfach-Tabs.

**[`design.md`](solution/openspec/changes/sitzungshistorie/design.md):** Kernentscheidungen:

| Entscheidung | Begründung |
|---|---|
| Ein Datensatz `{day, count}` statt Liste aller Phasen | Mehrtagesverlauf ist Nicht-Ziel; Tageswechsel = Datensatz verwerfen |
| Rohstring rein, Rohstring raus | Logik ohne Storage-Mock testbar |
| `dayKey` über lokale Getter, nicht `toISOString()` | UTC würde den Tag zur falschen lokalen Zeit wechseln |
| Zählen bei `endedMode === 'work'` | `tick` stellt die Phase sofort um, ein späterer Tick kann nicht doppelt zählen |
| try/catch um `localStorage`, Rohstring zusätzlich im Speicher | Blockierter Storage darf Timer nicht stoppen |

**[`specs/history/spec.md`](solution/openspec/changes/sitzungshistorie/specs/history/spec.md):** 4 Requirements mit `SHALL`, 8 Scenarios in WHEN/THEN. Jedes Scenario entspricht einem Test.

**[`tasks.md`](solution/openspec/changes/sitzungshistorie/tasks.md):** 5 Gruppen, jede mit Test-Task vor Implementierungs-Task.

#### Checkliste für das Lesen des Ergebnisses

| Prüfpunkt | Wenn nein |
|---|---|
| Steht vor **jedem** Feature-Task ein Test-Task? (TDD-Probe) | `config.yaml` schärfen, `/opsx:propose` neu, nicht `tasks.md` von Hand flicken |
| Deckt jede AK der Story mindestens ein Scenario ab? | OpenSpec im Chat: "AK 3 fehlt in der Spec" |
| Hat die KI Scope hinzugefügt (Tagesziel, Statistik, Reset-Button)? | Streichen lassen, auf Nicht-Ziele verweisen |
| Stimmt das Design mit AGENTS.md überein (Logik in `timer.js`, kein Modul-Import)? | Korrigieren lassen |

Die häufigsten KI-Fehler in diesem Schritt: **Scope-Aufblähung** (Verlauf der letzten 7 Tage), **falsche Architektur** (Logik in `index.html`) und **fehlende Fehlerfälle** (nur der Happy Path in den Scenarios).

### Schritt 3 — Apply (20 min oder Rest)

```
/opsx:apply
```

Erwarteter Ablauf pro Task-Gruppe. Das ist der echte TDD-Lerneffekt, beobachtet ihn:

**Gruppe 1, Test (rot):**
```
$ node --test
✖ tick reports which mode just ended
  error: ... endedMode ... undefined
```
**Gruppe 1, Implementierung (grün):** `tick` gibt `endedMode: state.mode` zurück.

Der erste Gesamtlauf der Referenz mit allen neuen Tests, bevor implementiert war:
```
# tests 19
# pass 10
# fail 9     (addPomodoro is not a function, ...)
```
Nach der Implementierung:
```
# tests 19
# pass 19
# fail 0
```

#### Die Implementierung im Überblick

Neu in [`timer.js`](solution/timer.js):

```js
function dayKey(ms) {                     // local calendar day, not UTC
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseRecord(raw) {               // never throws
  try {
    const r = JSON.parse(raw);
    if (r && typeof r.day === 'string' && Number.isInteger(r.count) && r.count >= 0) return r;
  } catch { /* fall through */ }
  return null;
}

function readCount(raw, today) {
  const r = parseRecord(raw);
  return r && r.day === today ? r.count : 0;
}

function addPomodoro(raw, today) {        // returns the new raw string to store
  return JSON.stringify({ day: today, count: readCount(raw, today) + 1 });
}
```

Und `tick` meldet bei Phasenende `endedMode: state.mode` mit.

`new Date(ms)` in `timer.js` ist mit der AGENTS.md-Regel "kein `Date.now()`" vereinbar: Die Funktion bekommt die Zeit als Parameter, nur die Kalender-Zerlegung läuft intern.

Verdrahtung in [`index.html`](solution/index.html):
```js
if (result.endedMode === 'work') {
  rawHistory = addPomodoro(rawHistory, dayKey(Date.now()));
  saveRaw(rawHistory);              // try/catch inside, timer keeps running
}
```

#### Manuell prüfen (nach `/opsx:apply`)

Die Tests decken die Logik ab, nicht die Verdrahtung. Kurzer Check im Browser (DevTools-Konsole), ohne 25 Minuten zu warten:

| Schritt | Erwartung |
|---|---|
| In `timer.js` temporär `work: 5 * 1000` setzen, Seite öffnen, Start | Nach 5 s Pausenmodus, "Heute: 1 Pomodoro", Ton |
| Seite neu laden | Weiterhin "Heute: 1 Pomodoro" |
| Während Arbeitsphase auf Reset klicken | Zähler unverändert |
| Pausenphase ablaufen lassen (`break` kurz setzen) | Zähler unverändert |
| Konsole: `localStorage.setItem('pomodoro.history', '{"day":"2000-01-01","count":9}')`, neu laden | "Heute: 0 Pomodoros" |
| Konsole: `localStorage.setItem('pomodoro.history', 'kaputt')`, neu laden | "Heute: 0 Pomodoros", kein Fehler |
| Storage blockieren (Browser-Einstellung "Cookies/Seitendaten blockieren") | Timer läuft, Zähler zählt bis zum Neuladen |

Dauern danach wieder auf 25/5 zurücksetzen.

Optional: `/opsx:archive` führt die Delta-Spec in `openspec/specs/history/spec.md` zusammen.

### Was ihr am Ende haben solltet

| Artefakt | Referenz |
|---|---|
| `story.md` | [`solution/story.md`](solution/story.md) |
| `proposal.md` | [`…/sitzungshistorie/proposal.md`](solution/openspec/changes/sitzungshistorie/proposal.md) |
| `tasks.md` mit Haken | [`…/sitzungshistorie/tasks.md`](solution/openspec/changes/sitzungshistorie/tasks.md) |
| Code | [`solution/timer.js`](solution/timer.js), [`index.html`](solution/index.html), 19 Tests grün |

---

## Debrief — Orientierungsantworten

| Frage | Typische Beobachtung |
|---|---|
| Wo hat der Plan geholfen? | Die Mitternachts- und Hintergrund-Tab-Fälle standen vor dem ersten Code fest. Ohne Spec hätte die KI `toISOString()` genutzt und der Fehler wäre erst nachts aufgefallen. |
| Wo hat der Plan gebremst? | Für eine ~40-Zeilen-Änderung sind 4 Artefakte Overhead. Der Aufwand lohnt sich bei Features mit Randfällen, nicht bei Textänderungen. |
| Was war anders als Runde 1? | Runde 1: Freestyle, Annahmen implizit, Korrekturen am fertigen Code. Runde 3: Annahmen explizit vor dem Code, Korrektur am Plan (billig). |
| Rolle von AGENTS.md vs. OpenSpec? | AGENTS.md = **Wie** (Stil, Struktur, Grenzen), dauerhaft. OpenSpec = **Was** (Verhalten dieses Features), pro Change. |
| Für welche Aufgaben übernehmen? | Features mit Fachlogik, Randfällen und mehreren Beteiligten. Weniger für Bugfixes mit klarer Ursache oder Spikes. |
| Was ging schief? | Typisch: KI ignoriert TDD in Apply (Regel in `config.yaml` schärfen), Scope-Aufblähung in Propose, Spec beschreibt nur den Happy Path. |

**Ehrlicher Hinweis:** Ein einzelner Durchlauf ist anekdotisch. Die Spec ist nur so gut wie die Story, die Fragen der KI sind nur so gut wie eure Antworten.

---

## Story A (Pausen-Benachrichtigung) — Abweichungen

Wer Story A gewählt hat, braucht andere Schwerpunkte:

| Thema | Offene Frage in Phase 2 | Referenzentscheidung |
|---|---|---|
| "Benachrichtigt" | Ton, Titel, System-Notification? | Web Notifications API **zusätzlich** zum bestehenden Ton, nur wenn der Nutzer erlaubt hat |
| Berechtigung | Wann fragen? | Erst beim ersten Klick auf Start, nie beim Laden (Browser blockieren sonst) |
| Berechtigung verweigert | Was dann? | Ton und Tab-Titel wie bisher, keine Fehlermeldung |
| `file://` | Funktioniert Notification dort? | Browserabhängig, **nicht garantiert**. Das ist eine Plattformannahme, die in die Story gehört |
| Beginn *und* Ende der Pause | Zwei Ereignisse? | Beginn = Ende der Arbeitsphase, Ende = Ende der Pause: beide über `phaseEnded` mit `endedMode` |
| Tab sichtbar | Notification trotzdem? | Nur wenn Tab nicht sichtbar (`document.hidden`), sonst doppelt gemoppelt |

Architektur analog: Entscheidung "welche Meldung zu welchem Ereignis" als reine Funktion in `timer.js` (`notificationFor(endedMode)` liefert Text oder `null`), `Notification` selbst nur in `index.html`, in try/catch.
