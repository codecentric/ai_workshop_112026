# Übung: Spec Driven Development am Pomodoro Timer — Runde 4 (Dev-Track)

## Spec Driven Development

**Dauer:** 55 Minuten
**Ziel:** Den OpenSpec-Workflow einmal vollständig durchlaufen — Explore → Propose → Apply
**Input:** Eure `story.md`, Timer-Code, Tests und `AGENTS.md` aus dem eigenen Arbeitsordner
**Voraussetzung:** OpenSpec läuft mit eigenen Slash-Commands (`/opsx:...`). Falls hier noch nicht geschehen: einmal `openspec init` ausführen — installiert die Commands für OpenCode.

**Ziel für 55 Minuten:** Explore und Propose vollständig — Apply soweit die Zeit reicht.

## Vor dem Start

Öffnet euren bestehenden Dev-Arbeitsordner aus Runde 2/3. Er enthält:

- den Timer-Code und die Tests aus Runde 2,
- `AGENTS.md`,
- die in Runde 3 fertiggestellte `story.md`.

Erstellt keinen neuen leeren Ordner. OpenSpec erweitert den vorhandenen Projektstand.

### Phase 1 — TDD verankern + Explore (15 min)

**Schritt 0 — TDD in `config.yaml` verankern (2 min):**

`openspec init` hat neben den Commands auch `openspec/config.yaml` angelegt — sie wird bei **jedem** `/opsx:propose` und `/opsx:apply` automatisch mit eingelesen. Ergänzt sie einmalig:

```yaml
rules:
  tasks:
    - Vor jedem Feature-Task steht ein Test-Task, der zuerst fehlschlägt.

operations:
  apply:
    guidance:
      - Schreibe für jeden Task zuerst den Test (rot), dann die Implementierung (grün).
```

> Unterschied zu eurem AGENTS.md aus Runde 2: Das AGENTS.md im Projekt-Root steuert OpenCode generell. `openspec/config.yaml` steuert strukturiert, was in jede OpenSpec-Phase einfließt — `rules` beeinflusst die Artefakt-Erzeugung (Propose), `operations.apply.guidance` die Ausführung (Apply).

Das reicht — ihr müsst TDD ab jetzt bei keiner Story mehr manuell einfordern.

**Schritt 1 — Explore (13 min):**

OpenSpec bringt eigene Slash-Commands mit — kein Freitext-Prompt nötig.

Die in Runde 3 gespeicherte `story.md` liegt bereits im Arbeitsordner. Referenziert sie mit `@` direkt im selben Befehl:
```
/opsx:explore @story.md
```

OpenSpec liest die Story und stellt euch Rückfragen dazu — beantwortet sie im Chat.

Explore-Regeln:
- **Kein Code** in dieser Phase — das ist die wichtigste Regel
- Ziel: ein klares, geteiltes Verständnis, was gebaut werden soll

Passt `story.md` an, wenn die Fragen Lücken aufdecken.

### Phase 2 — Propose (20 min)

Aus dem Explore-Ergebnis entsteht jetzt ein Plan:

```
/opsx:propose <kurzer-name-fuer-euer-feature>
```

Beispiel: `/opsx:propose pause-benachrichtigung`

OpenSpec erzeugt automatisch einen Ordner mit:
- `proposal.md` — Ziel, Nicht-Ziel, Architektur-Entscheidungen, offene Fragen
- `specs/` — Technische Spezifikationen
- `design.md` — Design-Entscheidungen
- `tasks.md` — Aufgabenliste mit Checkboxen

Lest das Ergebnis durch: Macht es Sinn? Fehlt etwas? Wenn ja — sagt es OpenSpec im Chat, bevor ihr weitermacht.

**TDD-Probe:** Steht in der `tasks.md` vor jedem Feature-Task ein Test-Task? Wenn ja — das ist der Beleg, dass `config.yaml` (`rules.tasks`) wirkt. Wenn nein — schärft lieber die Regel in `config.yaml`, statt die `tasks.md` einmalig manuell zu korrigieren.

### Phase 3 — Apply (20 min oder Rest)

Jetzt schreibt OpenSpec Code — Aufgabe für Aufgabe aus der tasks.md, in TDD-Reihenfolge (Test → rot → Implementierung → grün):

```
/opsx:apply
```

OpenSpec arbeitet die tasks.md ab und hakt erledigte Aufgaben selbst ab. Beobachtet genau, ob der Test wirklich zuerst fehlschlägt — das ist der eigentliche TDD-Lerneffekt. Wenn die Zeit läuft, stoppt ihr einfach — der Plan bleibt erhalten.

> Optional, wenn ihr fertig werdet: `/opsx:archive` schließt die Change ab und führt die Spec in den Gesamt-Stand des Projekts zusammen.

### Was ihr am Ende haben solltet

| Artefakt | Inhalt |
|---|---|
| `proposal.md` | Ziel, Nicht-Ziel, Architektur, offene Fragen |
| `tasks.md` | Checkboxen — einige davon abgehakt |
| Code | Soweit die Zeit gereicht hat |

## Ablauf (55 min)

| Dauer | Was | Wer |
|---|---|---|
| 2 Minuten | `openspec init` ausführen und TDD-Regeln in `config.yaml` ergänzen | Dev-Track |
| 13 Minuten | Vorhandene `story.md` mit `/opsx:explore` klären — noch kein Code | Dev-Track |
| 20 Minuten | Mit `/opsx:propose` Change und Aufgabenplan erstellen; TDD-Reihenfolge prüfen | Dev-Track |
| 20 Minuten | Mit `/opsx:apply` Aufgaben in Test-then-Implementation-Reihenfolge bearbeiten | Dev-Track |

### Debrief

- Wo hat der Plan geholfen, wo hat er gebremst?
- Was war anders als in Runde 1 (Freestyle)?
- Würdet ihr diesen Workflow in euren Alltag übernehmen — für welche Art von Aufgaben?
