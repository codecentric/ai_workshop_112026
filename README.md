# Workshop AI Assisted Coding

## Setup

Legt einmal euren eigenen Arbeitsordner an und startet OpenCode darin:

```bash
mkdir -p ~/ai-workshop
cd ~/ai-workshop
opencode
```

## Technischer Preflight

Vor Beginn der ersten Übung einmal gemeinsam prüfen:

- [ ] Das Workshop-Repository ist lokal geöffnet (zum Lesen der Übungen und Entnehmen der Ausgangsstände).
- [ ] Der eigene Arbeitsordner (z. B. `~/ai-workshop/`) ist angelegt und `opencode` startet darin.
- [ ] Node.js ist verfügbar (`node --version`, empfohlen: >= 20) und `node --test` funktioniert.
- [ ] Lokale HTML-Dateien können im Browser geöffnet werden.
- [ ] `openspec --version` funktioniert; in Runde 4 stehen nach `openspec init` die `/opsx:...`-Commands bereit.

## Arbeitsordner

Jede Person arbeitet über alle Runden hinweg in **einem eigenen Arbeitsordner**
außerhalb dieses Repos (z. B. `~/ai-workshop/`). Dort entstehen Code, `AGENTS.md`,
`DoR.md` und `story.md`, und jede Runde setzt auf dem eigenen Stand der vorherigen auf.

Die `*-workdir/`-Ordner im Repo sind **Ausgangsstände zum Entnehmen**, nicht zum
Darin-Arbeiten. Wer einen Stand nicht hat (z. B. Option B in Runde 1, kaputter Stand,
verpasste Runde), kopiert nur die **fehlenden** Dateien aus dem Workdir der jeweiligen
Runde in den eigenen Arbeitsordner. Eigene Dateien (z. B. eure `story.md`) nicht überschreiben.

| Workdir | Enthält | Wofür |
|---|---|---|
| `01-fix-the-prompt-workdir/` | `pomodoro.js` | Beispielcode für Fix the Prompt |
| `pomodoro-runde-1-workdir/` | (leer) | Runde 1 startet bewusst bei null |
| `pomodoro-runde-2-workdir/` | `index.html` | Timer-Stand, falls aus Runde 1 keiner vorliegt |
| `pomodoro-runde-3-dev-workdir/` | Code, Tests, `AGENTS.md`, `DoR.md` | Runde-2-Stand für den Dev-Track |
| `pomodoro-runde-3-devops-workdir/` | `AGENTS.md`, Roh-`story.md` | Runde-2-Stand für den DevOps-Track |
| `pomodoro-runde-4-dev-workdir/` | Code, Tests, `AGENTS.md`, `story.md` | Runde-3-Stand für den Dev-Track |
| `pomodoro-runde-4-devops-workdir/` | `AGENTS.md`, `story.md` | Runde-3-Stand für den DevOps-Track |

## Zusammenarbeit

Dev und DevOps bilden für Runde 1 und 2 feste Paare oder Kleingruppen. DevOps
begleitet und reviewed den Stand des zugeordneten Dev-Partners. Falls dessen Stand
noch nicht bereit ist, wechselt für die Review-Phase zu einem anderen Paar oder
bittet den Trainer um einen geeigneten Review-Stand.

## Ablauf

| Dauer | Was | Wer |
|---|---|---|
| 25 Minuten | [Fix the Prompt](01-fix-the-prompt/README.md) | alle |
| 65 Minuten | [Pomodoro Timer — Runde 1](pomodoro-runde-1/README.md) | alle |
| 45 Minuten | [Pomodoro Timer — Runde 2](pomodoro-runde-2/README.md) | alle |
| 30 Minuten | Story Refinement — Runde 3 ([Dev](pomodoro-runde-3-dev/README.md) · [DevOps](pomodoro-runde-3-devops/README.md)) | Dev: Timer-Feature · DevOps: eigener Betriebsprozess |
| 55 Minuten | Spec Driven Development — Runde 4 ([Dev](pomodoro-runde-4-dev/README.md) · [DevOps](pomodoro-runde-4-devops/README.md)) | Dev: Timer-Feature · DevOps: Automatisierungs-Script |

## Zuordnung Ordner → Übung/Demo

| Ordner | Übung/Demo | Dauer |
|---|---|---|
| `01-fix-the-prompt/` | Übung "Fix the Prompt" + Demo "Semantic Anchors" | 25 Minuten |
| `pomodoro-runde-1/` | Übung "Pomodoro Timer — Runde 1 (Freestyle)" | 65 Minuten |
| `pomodoro-runde-2/` | Übung "Pomodoro Timer — Runde 2 (mit AGENTS.md)" | 45 Minuten |
| `pomodoro-runde-3-dev/` | Übung "Story Refinement" (Dev-Track) | 30 Minuten |
| `pomodoro-runde-3-devops/` | Übung "Story Refinement" (DevOps-Track) | 30 Minuten |
| `pomodoro-runde-4-dev/` | Übung "Spec Driven Development am Pomodoro Timer" (Dev-Track) | 55 Minuten |
| `pomodoro-runde-4-devops/` | Übung "Spec Driven Development für DevOps-Automatisierung" (DevOps-Track) | 55 Minuten |

> Die Runden-Ordner liegen bewusst nebeneinander (nicht als Git-Branches), um Vergleiche zu vereinfachen.
> Sichert euren eigenen Arbeitsordner vor der Mittagspause (z. B. per Commit); Runde 4 setzt ihn direkt fort.
