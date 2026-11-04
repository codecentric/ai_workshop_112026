# Übung: Spec Driven Development für DevOps-Automatisierung — Runde 4 (DevOps-Track)

## Spec Driven Development (eigener Prozess)

**Dauer:** 55 Minuten

**Ziel:** Den OpenSpec-Workflow einmal vollständig durchlaufen — Explore → Propose → Apply

**Input:** Eure `story.md` und euer DevOps-`AGENTS.md` aus dem eigenen Arbeitsordner

**Voraussetzung:** OpenSpec ist installiert (`openspec --version`, siehe Preflight im [README](../README.md#technischer-preflight)). Falls nicht: `npm install -g @fission-ai/openspec@latest`.

Ihr durchlauft denselben Workflow wie die Dev-Kollegen — aber mit eurem eigenen Use Case.

## Vor dem Start

Öffnet euren eigenen Arbeitsordner aus Runde 2/3. Er enthält:

- die in Runde 3 fertiggestellte `story.md`,
- euer DevOps-`AGENTS.md`.

Fehlt etwas, kopiert die fehlenden Dateien aus [`pomodoro-runde-4-devops-workdir/`](../pomodoro-runde-4-devops-workdir/).

Erstellt keinen neuen leeren Ordner. OpenSpec erzeugt die Spezifikation und implementiert anschließend nur so weit,
wie die Zeit reicht.


### Phase 1 — OpenSpec einrichten + Explore (15 min)

**Schritt 0 — `openspec init` + TDD in `config.yaml` verankern (2 min):**

Führt im Terminal in eurem Arbeitsordner aus:

```bash
openspec init
```

Das installiert die `/opsx:...`-Commands für OpenCode (falls sie nicht erscheinen: OpenCode neu starten) und legt `openspec/config.yaml` an — sie wird bei **jedem** `/opsx:propose` und `/opsx:apply` automatisch mit eingelesen. Ergänzt sie einmalig:

```yaml
rules:
  tasks:
    - Vor jedem Feature-Task steht ein Test-Task, der zuerst fehlschlägt.

operations:
  apply:
    guidance:
      - Schreibe für jeden Task zuerst den Test (rot), dann die Implementierung (grün).
```

Das reicht — ihr müsst TDD ab jetzt bei keiner Story mehr manuell einfordern.

**Schritt 1 — Explore (13 min):**

Die in Runde 3 gespeicherte `story.md` liegt bereits im Arbeitsordner. Referenziert sie mit `@`:

```
/opsx:explore @story.md
```

OpenSpec liest die Story und stellt euch Rückfragen dazu — beantwortet sie im Chat.

Explore-Regeln:
- **Kein Code** in dieser Phase — das ist die wichtigste Regel
- Ziel: ein klares, geteiltes Verständnis, was gebaut werden soll

Passt `story.md` an, wenn die Fragen Lücken aufdecken.

### Phase 2 — Propose (20 min)

```
/opsx:propose <kurzer-name-fuer-euren-prozess>
```

OpenSpec erzeugt automatisch einen Ordner mit `proposal.md`, `specs/`, `design.md`, `tasks.md`.

Lest das Ergebnis durch: Macht es Sinn? Fehlt etwas?

**TDD-Probe:** Steht in der `tasks.md` vor jedem Feature-Task ein Test-Task? Wenn nein — schärft die Regel in `config.yaml`, statt `tasks.md` einmalig manuell zu korrigieren.

**Schnittstellen-Probe:** Übernehmen `specs/` und `tasks.md` die Schnittstelle aus eurem `AGENTS.md` — Exit-Codes (0 = Erfolg, 1 = Fehler, 2 = ungültige Eingabe) und Ergebnis nach stdout, Diagnose nach stderr? Gibt es dafür Test-Tasks? Wenn nein — sagt es OpenSpec im Chat, bevor ihr mit Apply startet.

### Phase 3 — Apply (20 min oder Rest)

```
/opsx:apply
```

OpenSpec arbeitet die tasks.md ab, in TDD-Reihenfolge (Test → rot → Implementierung → grün). Wenn die Zeit läuft, stoppt ihr einfach — der Plan bleibt erhalten.

### Besondere Beobachtungsaufgabe

Notiert während Explore und Propose für den Debrief:
- Welche Fragen stellt die KI zu eurem DevOps-Prozess, die bei einem Timer-Feature vermutlich nicht kämen?
- Was steht in eurem Proposal, das bei einem UI-Feature fehlen würde (z. B. Exit-Codes, Fehlerfälle, Betrieb, Sicherheit)?

Im Debrief vergleicht ihr eure Beobachtungen mit den Erfahrungen des Dev-Tracks.

### Was ihr am Ende haben solltet

| Artefakt | Inhalt |
|---|---|
| `proposal.md` | Ziel, Nicht-Ziel, Architektur, offene Fragen |
| `tasks.md` | Checkboxen — einige davon abgehakt |
| Code | Soweit die Zeit gereicht hat |

## Ablauf (55 min)

| Dauer | Was | Wer |
|---|---|---|
| 2 Minuten | `openspec init` ausführen und TDD-Regeln in `config.yaml` ergänzen | DevOps-Track |
| 13 Minuten | Vorhandene `story.md` mit `/opsx:explore` klären — noch kein Code | DevOps-Track |
| 20 Minuten | Mit `/opsx:propose` Change und Aufgabenplan erstellen; TDD-Reihenfolge prüfen | DevOps-Track |
| 20 Minuten | Mit `/opsx:apply` Aufgaben in Test-then-Implementation-Reihenfolge bearbeiten und Beobachtungen für den Vergleich mit dem Dev-Track notieren | DevOps-Track |

### Debrief

- Wo hat der Plan geholfen, wo hat er gebremst?
- Was war anders als bei einem reinen Feature-Request?
- Würdet ihr diesen Workflow in euren Alltag übernehmen — für welche Art von Aufgaben?
