# Übung: Pomodoro Timer — Runde 1 (Freestyle)

**Dauer:** 65 Minuten

**Ziel:** OpenCode kennenlernen — einfach loslegen, sehen wie weit man kommt

**Kein Zieldruck:** Es geht nicht darum, eine fertige App zu haben. Es geht darum zu erleben, wie sich die Zusammenarbeit mit OpenCode anfühlt.

> **Arbeitsort:** Arbeitet in eurem eigenen persistenten Arbeitsordner.

---

## Eure Rolle

### Entwickler (SAS, PowerBuilder, JS, Java)

**Option A — Pomodoro Timer (empfohlen als gemeinsame Referenz):**
Baut einen einfachen Pomodoro Timer als Web-App:
- 25 min Arbeitsphase, 5 min Pause
- Start/Pause/Reset-Button
- Countdown-Anzeige

**Option B — Euer eigener Mini-Use-Case:**
Ihr habt ein kleines, abgrenzbares Problem aus eurem Alltag?
- Ein Script, das euch nervt
- Eine Funktion, die ihr schon immer schreiben wolltet
- Etwas, das ihr in ~1h angehen könntet

> Kriterien für Option B: Code-nah (nicht reine Textaufgabe), klein genug für 1h, testbar.

> **Wichtig für den weiteren Workshop:** Option B ist ein Freestyle-Pfad für Runde 1.
> Ab Runde 2 arbeitet der Dev-Track mit dem gemeinsamen Pomodoro-Timer weiter,
> damit `AGENTS.md`, Story Refinement und OpenSpec am gleichen Projekt vergleichbar
> bleiben. Wer Option B gewählt hat, übernimmt dafür einen Timer-Stand eines
> Dev-Partners oder den bereitgestellten Ausgangsstand.

Sprecht kurz mit dem Trainer, wenn ihr unsicher seid.

**Review (10 min):**
Wechselt in den Plan Mode (Shift+Tab) und **zu einem anderen Modell als dem, mit dem ihr gebaut habt**. Ein zweites Modell hat andere blinde Flecken als das erste.
```
Reviewe meinen Code in [Datei]: Welche Bugs, Edge Cases (z. B. Tab im Hintergrund) oder Unklarheiten siehst du? Ändere nichts.
```
Vergleicht: Was hat das zweite Modell gefunden, das euch beim Bauen entgangen ist?

---

### DevOps — Rolle: Product Owner

Ihr baut heute nichts selbst — ihr definiert, was gebaut werden soll, und bewertet das Ergebnis.

**Phase 1 — Anforderungen formulieren (15 min):**
Schreibt für den Pomodoro Timer:
- 3–5 konkrete Anforderungen ("Der Timer muss…")
- Was ist ein gutes Ergebnis? Was ist inakzeptabel?
- Welche Edge Cases interessieren euch? (Was, wenn der Browser-Tab im Hintergrund ist? Was, wenn jemand den Tab schließt?)

Nutzt OpenCode, um eure Anforderungen zu schärfen:
```
Ich bin Product Owner für einen Pomodoro Timer. Ich habe folgende Anforderungen:
[eure Liste]
Welche wichtigen Anforderungen habe ich vergessen?
```

**Zwischenzeit (30 min):**
Schaut den Devs über die Schulter, stellt Rückfragen, verfeinert eure Anforderungsliste bei Bedarf. Wenn ein Dev-Kollege schon einen ersten Stand hat: lasst ihn euch zeigen.

**Phase 2 — Review (10 min):**
Schaut euch das Ergebnis eines Dev-Kollegen an.
Nutzt OpenCode (Plan Mode, Modell frei wählbar — gern ein anderes als der Dev-Kollege) für Code-Review:
```
Reviewe diesen Code: [Code einfügen oder Datei referenzieren]
Erfüllt er folgende Anforderungen? [eure Liste]
Was fehlt? Was könnte besser sein?
```

---

## Ablauf für alle (65 min)

| Dauer | Was | Wer |
|---|---|---|
| 5 Minuten | Einstieg — Use Case wählen, OpenCode starten | alle |
| 45 Minuten | Build Mode — Code generieren, ausprobieren, anpassen | Devs |
| 45 Minuten | Anforderungen schärfen + Devs begleiten | DevOps |
| 10 Minuten | Review — Plan Mode, Devs mit anderem Modell als beim Bauen | alle |
| 5 Minuten | Sichern — Code speichern, wird morgen gebraucht | alle |

---

## Tipps für den Build

- **Startet mit einem klaren Prompt.** Sagt OpenCode, was ihr baut, in welcher Sprache, für welche Plattform.
- **Build Mode für Code, Plan Mode für Analyse.** Shift+Tab schaltet um.
- **Modell wechseln lohnt sich:** GPT 5.6 Sol für komplexe Logik, Deepseek Flash für schnelle Iteration.
- **Wenn ihr feststeckt:** fragt OpenCode "Was fehlt noch, damit das funktioniert?" statt die Fehlermeldung blind einzufügen.

---

## Debrief-Fragen (im Plenum)

- Wie weit seid ihr gekommen? Was hat überrascht?
- Wo hat OpenCode gut geholfen, wo hat es euch gebremst?
- Was würdet ihr beim nächsten Mal anders machen?
- Devs: Hat das zweite Modell etwas gefunden, das das erste übersehen hat?
- DevOps: Wurde eure Anforderungsliste erfüllt?

## Übergabe an Runde 2

### Dev

- [ ] Der Timer-Stand liegt im eigenen Arbeitsordner und wurde kurz ausprobiert.
- [ ] Mindestens zwei Anweisungen sind notiert, die ihr der KI mehrfach geben musstet.
- [ ] Der Stand ist gesichert (z. B. Commit oder Kopie).

Diese wiederholten Anweisungen werden in Runde 2 zu Regeln in `AGENTS.md`.

### DevOps

- [ ] Eure priorisierte Anforderungsliste ist gespeichert.
- [ ] Ihr habt mindestens zwei Betriebs- oder Qualitätsrisiken notiert.
- [ ] Euer Dev-Partner für die nächste Runde ist klar.
