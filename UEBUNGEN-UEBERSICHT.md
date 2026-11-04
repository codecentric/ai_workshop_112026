# Workshop AI Assisted Coding — Übersicht aller Übungen

Gesamtdauer: ca. 220 Minuten (25 + 65 + 45 + 30 + 55). Alle Übungen laufen mit **OpenCode**, Node.js ≥ 20 und (ab Runde 4) **OpenSpec**.
Zwei Tracks: **Dev** (Pomodoro-Timer) und **DevOps** (Rolle PO in Runde 1, danach eigener Betriebsprozess, Referenz: Healthcheck-Script).

## Was ist ein Pomodoro Timer?

Die **Pomodoro-Technik** ist eine Zeitmanagement-Methode, entwickelt von Francesco Cirillo Ende der 1980er Jahre. Der Name kommt vom tomatenförmigen Küchenwecker („pomodoro“ = Tomate), mit dem er sie erstmals anwandte.

**Ablauf:**
1. Eine Aufgabe wählen.
2. Den Timer auf **25 Minuten** stellen und konzentriert arbeiten (ein „Pomodoro“).
3. Wenn der Timer klingelt, **5 Minuten Pause** machen.
4. Nach vier Pomodoros eine längere Pause (üblich: 15–30 Minuten).

Ein **Pomodoro Timer** ist die Software dazu: eine Countdown-Anzeige mit Phasen „Arbeit“ und „Pause“, Start/Pause/Reset und einem Signal am Phasenende.

**Warum eignet er sich als Workshop-Beispiel?**
- Er ist klein und für alle sofort verständlich, sodass die Zeit in die Zusammenarbeit mit der KI fließt und nicht ins Erklären der Fachlichkeit.
- Er hat echte technische Fallstricke, an denen man KI-Ergebnisse prüfen kann:
  - **Drift:** Wer die Restzeit mit `remaining--` herunterzählt, weicht von der echten Zeit ab. Besser ist `endAt - Date.now()`.
  - **Hintergrund-Tabs:** Browser drosseln `setInterval`, die Anzeige muss trotzdem stimmen.
  - **Pause und Reset:** Pause muss die Restzeit behalten, Reset darf kein Intervall weiterlaufen lassen.
  - **Mehrfach-Klicks:** Mehrfaches Start darf nicht mehrere Intervalle erzeugen.
- Er lässt sich gut erweitern, etwa um einen Tageszähler, Benachrichtigungen oder eine Historie. Das sind die Features für die Story-Refinement- und OpenSpec-Runden.
- Die Logik ist rein und gut testbar (`timer.js` mit `node --test`).

---

## Überblick

| # | Übung | Verwendet | Aufgabe | Ergebnis |
|---|---|---|---|---|
| 1 | Fix the Prompt (25 min) | OpenCode, `pomodoro.js` | 1–2 von 4 schlechten Prompts verbessern: zu vage, implizites Wissen, kein Format, zu viel auf einmal | Bessere Prompts und ein Vergleich |
| 2 | Runde 1, Freestyle (65 min) | OpenCode (Build- und Plan-Mode, 2 Modelle) | Dev baut den Timer und reviewt ihn mit einem zweiten Modell. DevOps agiert als PO und schreibt Anforderungen. | Lauffähiger Timer; DevOps: Anforderungsliste und Risiken |
| 3 | Runde 2, AGENTS.md (45 min) | `/init`, `AGENTS.md`, `node --test` | Dev schreibt `AGENTS.md` und baut den Timer neu. DevOps schreibt Rohstory und eigenes `AGENTS.md`, reviewt dann das `AGENTS.md` eines Devs. | Timer, `AGENTS.md` und Tests; DevOps: `story.md` und `AGENTS.md` |
| 4 | Runde 3, Story Refinement (30 min) | `DoR.md`, sokratische AI-Session mit vier Prompts | Story mit der KI stresstesten und gegen die eigene DoR prüfen | DoR-konforme `story.md` |
| 5 | Runde 4, Spec Driven Development (55 min) | OpenSpec (`/opsx:explore`, `propose`, `apply`), `config.yaml` mit TDD-Regeln | Explore, dann Propose, dann Apply mit Test zuerst | `proposal.md`, `tasks.md` und Code |

Gesamtdauer: 220 Minuten. In Runde 3 und 4 arbeitet Dev an einem Timer-Feature und DevOps an einem Healthcheck-Script.

Rote Linie: Prompt-Qualität → Kontext (AGENTS.md) → Anforderungsqualität (Story/DoR) → strukturierter Workflow (OpenSpec + TDD). Die Runden bauen aufeinander auf; Runde 4 setzt den eigenen Arbeitsstand fort.

**Ordnerlogik:** `<übung>/` enthält README (Aufgabe) und `example/` (Referenzlösung). `<übung>-workdir/` ist der Startordner der Teilnehmenden.

---

## 1. Fix the Prompt (`01-fix-the-prompt/`)

**Was wird benutzt:** OpenCode; Beispielcode `pomodoro.js` (CLI-Timer, Node.js, siehe `01-fix-the-prompt-workdir/`); Prompt-Konzepte (Objective, Context, Audience, Response Format, COSTAR).

**Aufgabe:** Mindestens 1 (bei Zeit 2) von 4 absichtlich schlechten Prompts erst ausführen, dann verbessern und die Ergebnisse vergleichen.

| Prompt | Schwäche | Hebel |
|---|---|---|
| 1 „Hilf mir mit meinem Code“ | zu vage | Ziel, Sprache, Ergebnisformat |
| 2 „Verbessere diesen Code“ (`runTimer`) | implizites Wissen | Kriterien, Konventionen |
| 3 „Erkläre pomodoro.js“ | kein Format | Zielgruppe, Länge, Struktur |
| 4 „Analysiere, Bugs, Tests, Doku, Refactoring“ | zu viel auf einmal | eine Aufgabe oder Meta-Prompt |

**Output:** Die eigenen verbesserten Prompts (in der README einzutragen) und ein Debrief („Was hat den größten Unterschied gemacht?“).
**Referenzlösung:** Verbesserte Prompts je Fall plus Bug-Liste von `pomodoro.js` (0 wird zu 1, negative Werte, Dezimalwerte, Drift, kein SIGINT-Handler, fehlendes `.catch`). Den größten Effekt haben meist Format und Scope („max. 5 Findings als Tabelle“, „ändere noch keine Dateien“).

---

## 2. Pomodoro Timer — Runde 1, Freestyle (`pomodoro-runde-1/`)

**Was wird benutzt:** OpenCode (Build Mode / Plan Mode per Shift+Tab), mehrere Modelle (Bauen und Review mit unterschiedlichen Modellen), Browser. Ergebnis: Vanilla-JS-Web-App.

**Aufgabe:**
- **Dev:** Pomodoro Timer als Web-App (25 min Arbeit / 5 min Pause, Start/Pause/Reset, Countdown). Alternativ eigener Mini-Use-Case (Option B: code-nah, ca. 1 h, testbar). Danach 10 min Review im Plan Mode mit **anderem Modell** („Bugs, Edge Cases, ändere nichts“).
- **DevOps (Rolle Product Owner):** 3–5 Anforderungen („Der Timer muss…“), Edge Cases und Akzeptanz formulieren, die KI nach vergessenen Anforderungen fragen, den Devs über die Schulter schauen, am Ende das Dev-Ergebnis gegen die Anforderungen reviewen.

**Output:**
- Dev: lauffähiger Timer im eigenen Arbeitsordner, gesichert, plus mindestens 2 notierte Anweisungen, die mehrfach wiederholt werden mussten (Input für AGENTS.md).
- DevOps: priorisierte Anforderungsliste, mindestens 2 Betriebs-/Qualitätsrisiken, Dev-Partner für Runde 2.

**Referenzlösung:** `index.html` (eine Datei, Restzeit aus `Date.now()` statt Zähler, damit kein Drift und Hintergrund-Tab korrekt), Tabelle typischer KI-Timer-Fehler (Drift, Mehrfach-Intervalle, Pause setzt zurück, `alert()` blockiert …), Anforderungen R1–R6 samt Edge-Case-Tabelle.

---

## 3. Pomodoro Timer — Runde 2, mit AGENTS.md (`pomodoro-runde-2/`)

**Was wird benutzt:** OpenCode `/init`, `AGENTS.md`, `node --test` (eingebauter Testrunner), Vanilla JS.

**Aufgabe:**
- **Dev (15 + 25 + 5 min):** `AGENTS.md` erstellen (Projekt, Tech-Stack, Konventionen, „Was die KI nicht tun soll“, Definition of Done), mit OpenCode verbessern, dann denselben Timer wie in Runde 1 neu bauen und Runde 1 vs. 2 vergleichen.
- **DevOps (25 + 20 min):** Rohe User Story für einen eigenen DevOps-Prozess schreiben, **ohne AI** („Als … möchte ich … damit …“; z. B. Healthcheck vor Deployment, Log-Report, Branch-Naming-Check) als `story.md`; eigenes `AGENTS.md` (Node ≥ 20, CommonJS, keine Dependencies, Exit-Codes 0/1/2, stdout vs. stderr, keine Secrets in Logs); danach das `AGENTS.md` eines Dev-Kollegen aus DevOps-Sicht reviewen.

**Output:**
- Dev: Timer-Basisstand + `AGENTS.md` + grüne Tests; Wissen, welche Regel am meisten wirkte.
- DevOps: Rohstory `story.md`, drei offene Fragen fürs Refinement, DevOps-`AGENTS.md`.

**Referenzlösung** (liegt unter `example/`): `AGENTS.md`, `timer.js` (reine Logik ohne DOM und ohne `Date.now()`), `timer.test.js` (10 Tests), `index.html` (UI). Prinzip: Alles, was in Runde 1 wiederholt gesagt wurde, gehört ins `AGENTS.md`.
*Hinweis:* `solution.md` verweist auf `solution/`, die Dateien liegen aber in `example/`.

---

## 4. Story Refinement — Runde 3 (`pomodoro-runde-3-dev/` und `pomodoro-runde-3-devops/`)

**Was wird benutzt:** OpenCode als Sparringspartner (nicht als Ghostwriter), `DoR.md` (Definition of Ready, im Repo-Root, mit eigenen Ergänzungen), Prompt-Sequenz.

**Aufgabe (beide Tracks, gleicher Ablauf):**
1. **5 min:** `DoR.md` ins Arbeitsverzeichnis kopieren, 1–2 eigene Kriterien unter „Unsere Ergänzungen“ ergänzen.
2. **20 min:** Sokratische Session mit 4 Prompts: Annahmen aufdecken, Risiken benennen, Lücken finden (Akzeptanzkriterien, Begriffe, Edge Cases), Advocatus Diaboli (optional).
3. **5 min:** Story überarbeiten und mit „Prüfe gegen @DoR.md“ prüfen. Zu wohlwollende KI-Antworten hinterfragen.

| Track | Ausgangspunkt | Referenz-Ergebnis |
|---|---|---|
| Dev | Wahl zwischen Story A „Pausen-Benachrichtigung“ und Story B „Sitzungshistorie“, absichtlich lückenhaft | Story „Tageszähler für abgeschlossene Pomodoros“: Begriffe, 6 testbare Akzeptanzkriterien, Nicht-Ziele, bewusste Entscheidung (`localStorage`) |
| DevOps | eigene Rohstory aus Runde 2 | Story „Healthcheck vor dem Deployment“: `node healthcheck.js <url> [--attempts --timeout-ms --delay-ms]`, Exit-Codes 0/1/2, Ausgabe auf stdout/stderr, keine Query-Parameter/Credentials in der Ausgabe, Nicht-Ziele, Entscheidung für Node ≥ 20 |

**Output:** Eine DoR-konforme `story.md` neben Code/Tests/`AGENTS.md` im Arbeitsordner. Jedes Akzeptanzkriterium ist testbar, Nicht-Ziele und Fehlerfälle sind benannt. DevOps benennt zusätzlich Exit-Codes, Ausgabekanäle und Sicherheitsgrenzen.
**Reflexionsfrage:** War die Rückfrage-Session nützlicher, als die Story von der AI schreiben zu lassen?

---

## 5. Spec Driven Development — Runde 4 (`pomodoro-runde-4-dev/` und `pomodoro-runde-4-devops/`)

**Was wird benutzt:** **OpenSpec** (`openspec init`, Slash-Commands `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, optional `/opsx:archive`), `openspec/config.yaml` mit TDD-Regeln (`rules.tasks`, `operations.apply.guidance`), `story.md`, `AGENTS.md`, `node --test`.

**Aufgabe (gleicher Workflow in beiden Tracks):**
1. **Phase 1, 15 min:** TDD in `config.yaml` verankern (vor jedem Feature-Task ein fehlschlagender Test-Task). Danach `/opsx:explore @story.md`: **kein Code**, nur gemeinsames Verständnis, `story.md` bei Lücken anpassen.
2. **Phase 2, 20 min:** `/opsx:propose <name>` erzeugt `proposal.md`, `specs/`, `design.md`, `tasks.md`. Lesen und schärfen. **TDD-Probe:** steht vor jedem Feature-Task ein Test-Task? Wenn nicht, die Regel in `config.yaml` verbessern statt `tasks.md` manuell zu korrigieren.
3. **Phase 3, 20 min:** `/opsx:apply` arbeitet die Tasks in Reihenfolge Test (rot), Implementierung (grün) ab. Stoppen, wenn die Zeit endet.

| Track | Feature | Besonderheit |
|---|---|---|
| Dev | Timer-Erweiterung (Referenz: Sitzungshistorie/Tageszähler im Timer-Code, `timer.js`, `index.html`) | erweitert den bestehenden Stand aus Runde 2/3, keine neue Anlage |
| DevOps | Healthcheck-Script (`healthcheck.js`, `healthcheck.test.js`) | Prüfen von Exit-Codes und Ausgabekanälen; Beobachtungsaufgabe: Unterschiede von Explore und Proposal gegenüber einem Feature-Request der Devs |

**Output:** `proposal.md` (Ziel, Nicht-Ziele, Architektur, offene Fragen), `tasks.md` (teilweise abgehakt), Code soweit die Zeit reicht. Die Referenzlösungen enthalten jeweils `openspec/changes/<change>/` mit proposal, design, specs und tasks, außerdem `config.yaml`, Code und Tests.
**Debrief:** Wo half der Plan, wo bremste er? Unterschied zu Runde 1? Für welche Aufgaben im Alltag sinnvoll?

---

## Voraussetzungen (technischer Preflight)

- `opencode` startet, Repository lokal geöffnet
- `node --version` ≥ 20, `node --test` funktioniert
- lokale HTML-Dateien öffnen sich im Browser
- `openspec --version` funktioniert (ab Runde 4, nach `openspec init` stehen die `/opsx:...`-Commands bereit)
