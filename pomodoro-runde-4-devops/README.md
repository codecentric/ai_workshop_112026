# Übung: Spec Driven Development für DevOps-Automatisierung — Runde 4 (DevOps-Track)

## Spec Driven Development (eigener Prozess)

**Dauer:** 55 Minuten
**Ziel:** Den OpenSpec-Workflow einmal vollständig durchlaufen — Explore → Propose → Apply
**Input:** Eure `story.md` und euer DevOps-`AGENTS.md` aus dem eigenen Arbeitsordner
**Voraussetzung:** OpenSpec läuft mit eigenen Slash-Commands (`/opsx:...`). Falls hier noch nicht geschehen: einmal `openspec init` ausführen — installiert die Commands für OpenCode.

Ihr durchlauft denselben Workflow wie die Dev-Kollegen — aber mit eurem eigenen Use Case.

## Vor dem Start

Öffnet euren bestehenden DevOps-Arbeitsordner aus Runde 2/3. Er enthält:

- die in Runde 3 fertiggestellte `story.md`,
- euer DevOps-`AGENTS.md`,
- optional schon leere Script- und Testdateien, z. B. `healthcheck.js` und
  `healthcheck.test.js`.

Erstellt keinen neuen leeren Ordner. OpenSpec erzeugt die Spezifikation und implementiert anschließend nur so weit,
wie die Zeit reicht.

## Was gilt als Erfolg?

| Stufe | Ergebnis |
|---|---|
| **Minimum** | `story.md` ist geklärt; Explore und Propose sind abgeschlossen. |
| **Gut** | Die Spec deckt alle Akzeptanzkriterien ab; Exit-Codes, stdout/stderr und Test-Tasks sind enthalten. |
| **Sehr gut** | Eine kleine, vollständige Task-Gruppe wurde test-first umgesetzt. |
| **Stretch** | Mehrere Tasks oder die gesamte Story sind implementiert und die Tests sind grün. |

Eine nicht vollständig umgesetzte Story ist kein Misserfolg. Im Vordergrund stehen
klare Betriebsentscheidungen und ein belastbarer Plan vor dem Code.


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

### Phase 3 — Apply (20 min oder Rest)

```
/opsx:apply
```

OpenSpec arbeitet die tasks.md ab, in TDD-Reihenfolge (Test → rot → Implementierung → grün). Wenn die Zeit läuft, stoppt ihr einfach — der Plan bleibt erhalten.

### Besondere Beobachtungsaufgabe

Vergleicht Explore bei eurem DevOps-Prozess vs. einem Feature-Request der Dev-Kollegen:
- Welche anderen Fragen stellt die KI?
- Wie unterscheidet sich das Proposal von dem eines Dev-Kollegen?

Teilt eure Beobachtung im Debrief.

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
| 20 Minuten | Mit `/opsx:propose` Change und Aufgabenplan erstellen; TDD-Reihenfolge sowie Exit-Codes und Ausgabekanäle prüfen | DevOps-Track |
| 20 Minuten | Mit `/opsx:apply` Aufgaben in Test-then-Implementation-Reihenfolge bearbeiten und Beobachtungen für den Vergleich mit dem Dev-Track notieren | DevOps-Track |

### Debrief

- Wo hat der Plan geholfen, wo hat er gebremst?
- Was war anders als bei einem reinen Feature-Request?
- Würdet ihr diesen Workflow in euren Alltag übernehmen — für welche Art von Aufgaben?
