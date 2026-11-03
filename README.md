# Workshop AI Assisted Coding

## Setup

```bash
opencode
```

## Technischer Preflight

Vor Beginn der ersten Übung einmal gemeinsam prüfen:

- [ ] `opencode` startet und das Workshop-Repository ist lokal geöffnet.
- [ ] Node.js ist verfügbar (`node --version`, empfohlen: >= 20) und `node --test` funktioniert.
- [ ] Lokale HTML-Dateien können im Browser geöffnet werden.
- [ ] `openspec --version` funktioniert; in Runde 4 stehen nach `openspec init` die `/opsx:...`-Commands bereit.

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
| 30 Minuten | [Story Refinement — Runde 3](pomodoro-runde-3-dev/README.md) | Dev: Timer-Feature · DevOps: eigener Betriebsprozess |
| 55 Minuten | [Spec Driven Development — Runde 4](pomodoro-runde-4-dev/README.md) | Dev: Timer-Feature · DevOps: Automatisierungs-Script |

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
> Sichert euren eigenen Arbeitsstand vor der Mittagspause; Runde 4 setzt ihn direkt fort.
