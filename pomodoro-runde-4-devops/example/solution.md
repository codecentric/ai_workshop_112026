# Referenzlösung: Pomodoro Timer — Runde 4 (DevOps-Track)

Referenz zur [README](README.md): vollständiger OpenSpec-Change und Implementierung auf Basis der Story aus Runde 3.

| Datei | Zweck |
|---|---|
| [`solution/story.md`](solution/story.md) | Aus Runde 3 übernommene, fertige Story |
| [`solution/AGENTS.md`](solution/AGENTS.md) | Projektregeln für dieses Script (aus Runde 2 übernommen und für DevOps angepasst) |
| [`solution/openspec/config.yaml`](solution/openspec/config.yaml) | TDD-Regeln für Propose und Apply |
| [`solution/openspec/changes/healthcheck-vor-deployment/`](solution/openspec/changes/healthcheck-vor-deployment/) | `proposal.md`, `design.md`, `specs/healthcheck/spec.md`, `tasks.md` |
| [`solution/healthcheck.js`](solution/healthcheck.js), [`healthcheck.test.js`](solution/healthcheck.test.js) | Script und 22 Tests (`node --test`) |

Ausprobieren:
```bash
cd pomodoro-runde-4-devops/solution
node --test
node healthcheck.js https://example.org/            # echtes Beispiel
echo $?                                              # Exit-Code ansehen
```

---

## Spec Driven Development (55 min)
### Schritt 0 — `openspec init` und TDD in `config.yaml` (2 min)

```bash
cd pomodoro-runde-4-devops/mein-healthcheck   # leerer Arbeitsordner, story.md hineinkopieren
openspec init                                  # Tool "OpenCode" wählen
```

Danach `openspec/config.yaml` ergänzen. Referenz: [`solution/openspec/config.yaml`](solution/openspec/config.yaml)

```yaml
schema: spec-driven

context: |
  Healthcheck-Script (Node >= 20, CommonJS, keine Dependencies, kein Build), läuft in CI-Pipelines.
  Logik und CLI in healthcheck.js, Seiteneffekte (fetch, Uhr, sleep, Ausgabe) werden als deps injiziert.
  Tests mit `node --test`, Netzwerk nur gegen 127.0.0.1. Details stehen in AGENTS.md.

rules:
  specs:
    - Jede Spec nennt Exit-Code und Ausgabekanal (stdout/stderr) des beschriebenen Verhaltens.
  tasks:
    - Vor jedem Feature-Task steht ein Test-Task, der zuerst fehlschlägt.

operations:
  apply:
    guidance:
      - Schreibe für jeden Task zuerst den Test (rot), dann die Implementierung (grün).
      - Führe nach dem Test-Task `node --test` aus und zeige das Scheitern, bevor du implementierst.
      - Keine Netzwerkzugriffe außerhalb von 127.0.0.1.
```

Gegenüber der Dev-Variante gibt es zwei Unterschiede: eine **Spec-Regel** (`rules.specs`), die jede Anforderung zwingt, Exit-Code und Kanal zu nennen, und eine **Sicherheitsleitplanke** für Apply (kein Netzwerk außerhalb `127.0.0.1`). Beides ist typisch für Betriebs-Scripts: Die Schnittstelle zur Pipeline ist das Produkt. Die Struktur (`rules`, `operations.apply.guidance`) kommt aus der README. Falls eure OpenSpec-Version andere Schlüssel erwartet, gilt, was `openspec init` in der generierten Datei vorgibt.

Wenn ihr aus Runde 2 ein DevOps-angepasstes AGENTS.md habt, übernehmt es hierher. Referenz: [`solution/AGENTS.md`](solution/AGENTS.md). Die Bausteine, die Dev-AGENTS.md meist fehlen, sind darin: **Exit-Codes, Deployment-Artefakt, Grenzen für Seiteneffekte**.

### Schritt 1 — Explore (13 min)

```
/opsx:explore @story.md
```

**Regel: kein Code.** Wenn die KI anfängt zu implementieren: "Stopp, wir sind in Explore. Nur Fragen und Optionen."

Typische Rückfragen von OpenSpec und Referenzantworten:

| Frage | Antwort | Wirkung |
|---|---|---|
| Welche Sprache und Laufzeit? Läuft das auf den Agents? | Node >= 20, ohne Abhängigkeiten | Design-Entscheidung, Alternative curl dokumentieren |
| Wie testet man Timeout und Retry, ohne 5 s zu warten? | Seiteneffekte (`fetch`, `now`, `sleep`) als `deps` injizieren | Struktur: reine Logik, dünner CLI-Start |
| Wie testet man das gegen etwas Echtes? | Lokaler `node:http`-Server auf 127.0.0.1: 200, 503, 302, hängend | Integrationstests ohne Produktivzugriff |
| Folgen wir Weiterleitungen? | Nein, 3xx ist Fehlschlag | Falsch-positiv durch Login-Seite vermieden |
| Was steht im CI-Log, was auf stdout? | Eine Ergebniszeile auf stdout, Fortschritt und Usage auf stderr | Pipeline kann stdout auswerten |
| Welche Exit-Codes? | 0 / 1 / 2 | Spec-Regel erfüllt |
| Was passiert mit Credentials in der URL? | Ausgabe nur Schema/Host/Pfad | Stand zu diesem Zeitpunkt, wird in Apply präzisiert |

Wenn die Fragen eine Lücke in der Story aufdecken, `story.md` anpassen. In der Referenz kam die Frage nach Redirects aus Explore (stand vorher nur als Risiko in Prompt 2).

### Schritt 2 — Propose (20 min)

```
/opsx:propose healthcheck-vor-deployment
```

Erzeugt `openspec/changes/healthcheck-vor-deployment/` mit den Artefakten. Referenz-Ergebnis (gekürzt, vollständig im Ordner):

**[`proposal.md`](solution/openspec/changes/healthcheck-vor-deployment/proposal.md):** Why (Deployment scheitert mittendrin, Grund steht erst spät im Log), What Changes (Script, Retry, Exit-Codes, Ausgabe), Nicht-Ziele, Impact (neue Datei, Pipeline-Schritt, **keine** Secrets/Umgebungsvariablen), offene Fragen (Healthcheck-URL der echten Umgebung, Exit-Code 2 vs. 1 in der Pipeline).

**[`design.md`](solution/openspec/changes/healthcheck-vor-deployment/design.md):** Kernentscheidungen:

| Entscheidung | Begründung |
|---|---|
| Node statt Bash/curl | Timeout, Retry und Exit-Codes sind ohne Zusatzwerkzeug testbar |
| Exit-Codes 0 / 1 / 2 | Ausfall und Fehlbedienung sind für CI unterscheidbar |
| `deps` injizieren | Unit-Tests ohne Netzwerk und ohne echte Wartezeit |
| `AbortSignal.timeout` | Timeout von Verbindungsfehlern unterscheidbar (`TimeoutError`) |
| `redirect: 'manual'` | 3xx als gesund zu werten wäre ein Falsch-Positiv |
| `body.cancel()` | Keine offenen Verbindungen, keine Verzögerung durch große Antworten |
| Keine Pause nach dem letzten Versuch | Ein echter Ausfall verlängert die Pipeline sonst grundlos |
| Credentials-URL ablehnen, Fehlermeldungen ohne Eingabewert | `fetch` verweigert sie ohnehin, und seine Fehlermeldung enthielte den Klartext |

**[`specs/healthcheck/spec.md`](solution/openspec/changes/healthcheck-vor-deployment/specs/healthcheck/spec.md):** 5 Requirements mit `SHALL`, 12 Scenarios in WHEN/THEN. Jedes Scenario entspricht einem Test. Jedes Requirement nennt Exit-Code oder Kanal (die `rules.specs`-Regel).

**[`tasks.md`](solution/openspec/changes/healthcheck-vor-deployment/tasks.md):** 6 Gruppen, jede mit Test-Task vor Implementierungs-Task.

#### Checkliste für das Lesen des Ergebnisses

| Prüfpunkt | Wenn nein |
|---|---|
| Steht vor **jedem** Feature-Task ein Test-Task? (TDD-Probe) | `config.yaml` schärfen, `/opsx:propose` neu, nicht `tasks.md` von Hand flicken |
| Deckt jede AK der Story mindestens ein Scenario ab? | OpenSpec im Chat: "AK 4 fehlt in der Spec" |
| Nennt jedes Requirement Exit-Code und Ausgabekanal? | Regel `rules.specs` prüfen und Propose wiederholen |
| Hat die KI Scope hinzugefügt (Backoff, JSON-Ausgabe, Slack-Benachrichtigung, mehrere URLs)? | Streichen lassen, auf Nicht-Ziele verweisen |
| Greift die Spec auf echte Umgebungen zu ("prüfe gegen staging")? | Ersetzen durch lokalen Testserver |
| Stimmt das Design mit AGENTS.md überein (CommonJS, keine Dependencies, keine `package.json`)? | Korrigieren lassen |

Die häufigsten KI-Fehler in diesem Schritt: **Scope-Aufblähung** (Backoff, Metriken, Konfigurationsdatei), **zusätzliche Dependencies** (`axios`, `commander`) und **nur Happy Path** (kein Timeout-Scenario, kein Usage-Fehler).

### Schritt 3 — Apply (20 min oder Rest)

```
/opsx:apply
```

Erwarteter Ablauf pro Task-Gruppe, beobachtet den TDD-Effekt:

**Gruppe 1, Test (rot):**
```
$ node --test
✖ parseArgs applies defaults
  error: parseArgs is not a function
```
**Gruppe 1, Implementierung (grün):** `parseArgs` mit Defaults und Validierung.

Der Verlauf der Referenz bei den Nachträgen (Credentials, siehe unten): 
```
# tests 22
# pass 19
# fail 3     (rot: Tests für Credentials-Ablehnung und Fehlergrund vor der Implementierung)
```
Nach der Implementierung:
```
# tests 22
# pass 22
# fail 0
```

#### Die Implementierung im Überblick

Neu in [`healthcheck.js`](solution/healthcheck.js), Kern ist `checkOnce` (ein Versuch) und `runHealthcheck` (Retry-Schleife):

```js
async function checkOnce(url, timeoutMs, { fetch: fetchFn, now }) {
  const start = now();
  try {
    // Redirects are not followed: a 3xx means the target is not where we expect it.
    const res = await fetchFn(url, { redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) });
    const ms = now() - start;
    if (res.body && res.body.cancel) await res.body.cancel();
    if (res.status >= 200 && res.status < 300) return { ok: true, status: res.status, ms };
    return { ok: false, reason: `HTTP ${res.status}`, ms };
  } catch (err) {
    const ms = now() - start;
    if (err && err.name === 'TimeoutError') return { ok: false, reason: `Timeout nach ${timeoutMs} ms`, ms };
    const cause = err && err.cause;
    const detail = (cause && (cause.code || cause.message)) || (err && err.message) || 'unbekannt';
    return { ok: false, reason: `Verbindungsfehler: ${detail}`, ms };
  }
}

async function runHealthcheck(options, deps) {
  const results = [];
  for (let i = 1; i <= options.attempts; i++) {
    const result = await checkOnce(options.url, options.timeoutMs, deps);
    results.push(result);
    deps.log(`Versuch ${i}/${options.attempts}: ${result.ok ? `HTTP ${result.status}` : result.reason} (${result.ms} ms)`);
    if (result.ok) return { healthy: true, results };
    if (i < options.attempts) await deps.sleep(options.delayMs);   // no pause after the last attempt
  }
  return { healthy: false, results };
}
```

`main` verdrahtet beides mit Exit-Codes und den zwei Ausgabezeilen. Der CLI-Start steht unter `require.main === module`, damit die Tests die Datei importieren können, ohne dass etwas ausgeführt wird.

#### Einbindung in die Pipeline

Das Script ist bewusst CI-neutral. Jedes System, das bei Exit-Code ungleich 0 abbricht, braucht nur diesen Schritt:

```yaml
# Beispiel GitHub Actions; Jenkins/GitLab analog
- name: Healthcheck Zielumgebung
  run: node healthcheck.js "$TARGET_URL" --attempts 5 --delay-ms 3000
- name: Deploy
  run: ./deploy.sh      # läuft nur, wenn der Schritt davor 0 lieferte
```

Das Deployment-Artefakt ist nur `healthcheck.js` (siehe AGENTS.md), keine Tests.

#### Manuell prüfen (nach `/opsx:apply`)

Die Tests decken Logik und lokale Server ab. Prüft zusätzlich von Hand, wie sich das Script **aus Pipeline-Sicht** verhält:

| Schritt | Erwartung |
|---|---|
| Lokalen Server mit 200 starten, `node healthcheck.js http://127.0.0.1:PORT/ok; echo $?` | stderr: `Versuch 1/3: HTTP 200 (..ms)`, stdout: `OK ... (Versuch 1/3)`, `0` |
| Server mit 503, `--delay-ms 200` | 3 Versuchszeilen, `FEHLER ... nach 3 Versuchen: HTTP 503`, `1` |
| Server, der nie antwortet, `--timeout-ms 300 --attempts 2` | `Timeout nach 300 ms`, `1`, Gesamtdauer etwa 0,7 s |
| `node healthcheck.js ftp://x; echo $?` | Usage auf stderr, `2`, kein Netzwerk |
| `node healthcheck.js "http://user:secret@127.0.0.1:8099/ok?token=abc"` | Exit-Code 2, `secret` und `token` tauchen nirgends auf |
| Aufruf mit `2>/dev/null` | Nur die eine Ergebniszeile bleibt übrig |
| Aufruf mit `> /dev/null` | Nur das Versuchsprotokoll bleibt übrig |

Zwei einfache Testserver für Python 3 oder Node:
```bash
python3 -m http.server 8099 --bind 127.0.0.1                     # liefert 200 (und 404 für fehlende Pfade)
node -e "require('http').createServer(()=>{}).listen(8098,'127.0.0.1')"   # antwortet nie (Timeout)
```

#### Was beim manuellen Test auffiel (und die Spec nicht vorhergesehen hatte)

Ein Beispiel dafür, warum der manuelle Schritt bleibt:

1. **Secret im Log.** Mit der ersten Fassung (`safeUrl` für Ausgaben) rief `node healthcheck.js "http://user:secret@host/ok?token=abc"` `fetch` auf. `fetch` verweigert URLs mit Zugangsdaten mit einem Fehler, dessen **Text die ganze URL enthält**, und das Script gab diesen Text als "Verbindungsfehler" aus. Das Secret stand im Log, obwohl `safeUrl` getestet war. Die Tests prüften nur den Erfolgs- und 503-Pfad, nicht den Pfad "Fehlertext enthält Eingabewert".
   - **Entscheidung:** URLs mit `user:pass@` werden in `parseArgs` mit Exit-Code 2 abgelehnt, die Meldung wiederholt den Wert nicht. Header-Authentifizierung bleibt Nicht-Ziel. Story (AK 6), Spec, Design und Tasks wurden angepasst (Task-Gruppe 5b).
   - **Lehre:** Bei Scripts mit Secrets ist die Frage "Welcher Fehlertext einer Bibliothek enthält meine Eingabe?" eine eigene Testklasse.
2. **Verbindungsfehler ohne Code.** Gegen `127.0.0.1:1` meldete das Script nur `fetch failed`. Ursache: Node blockiert Port 1 selbst (`bad port` steht in `err.cause.message`, nicht in `err.cause.code`). Fix: Fallback auf `cause.message`. Das ist ein Testartefakt, aber ein Hinweis, dass die Fehlerklassifikation auf `cause` schauen muss, nicht auf `err.message`.

Beide Funde entstanden durch das Ausführen gegen echte Prozesse, nicht durch die Unit-Tests mit Fake-`fetch`. Das ist das Argument für die wenigen Integrationstests in der Referenz.

Optional: `/opsx:archive` führt die Delta-Spec in `openspec/specs/healthcheck/spec.md` zusammen.

### Besondere Beobachtungsaufgabe — DevOps vs. Dev

Vergleicht Explore und Proposal mit denen der Dev-Kollegen (Sitzungshistorie als Referenz):

| Aspekt | Dev (Tageszähler) | DevOps (Healthcheck) |
|---|---|---|
| Typische Explore-Fragen | Zeitzone, Persistenz, Tageswechsel, Anzeige | Exit-Codes, Timeout, Retry, Logausgabe, Secrets, Testbarkeit ohne Produktivsystem |
| Wer ist der "Nutzer"? | Mensch vor dem Bildschirm | Eine Pipeline (und ein Mensch, der das Log liest) |
| Schnittstelle | UI-Text | Exit-Code, stdout/stderr, Optionen |
| Zentrales Risiko | Datenverlust, falscher Tag | Falsch-positiv ("gesund", obwohl nicht), Pipeline hängt, Secret im Log |
| Fehlerfälle | Speicher blockiert | Netzwerk, Timeout, Redirect, Fehlbedienung |
| Testbarkeit | `localStorage` per Rohstring entkoppelt | Netzwerk per `deps` entkoppelt, lokaler Server |
| Proposal-Schwerpunkt | Verhalten für Nutzer | Betriebsverhalten: Exit-Codes, Logs, Artefakt, Pipeline-Einbindung |
| Typischer KI-Fehler | Scope-Aufblähung (Statistik) | Zusätzliche Dependencies, Zugriff auf echte Umgebungen, nur Happy Path |

Auffällig: Beim Dev-Feature fragt die KI nach **Nutzererwartung**, beim DevOps-Prozess nach **Betriebsgrenzen** (Was ist, wenn das Netzwerk hängt? Wo landet das Secret?). Die Entscheidungen sind weniger sichtbar, aber folgenreicher: Ein falscher Exit-Code deployt in die falsche Umgebung.

### Was ihr am Ende haben solltet

| Artefakt | Referenz |
|---|---|
| `story.md` | [`solution/story.md`](solution/story.md) |
| `proposal.md` | [`…/healthcheck-vor-deployment/proposal.md`](solution/openspec/changes/healthcheck-vor-deployment/proposal.md) |
| `tasks.md` mit Haken | [`…/healthcheck-vor-deployment/tasks.md`](solution/openspec/changes/healthcheck-vor-deployment/tasks.md) |
| Code | [`solution/healthcheck.js`](solution/healthcheck.js), 22 Tests grün |

---

## Debrief — Orientierungsantworten

| Frage | Typische Beobachtung |
|---|---|
| Wo hat der Plan geholfen? | Exit-Codes, Ausgabekanäle, Redirect- und Timeout-Verhalten standen vor dem ersten Code fest. Ohne Spec hätte die KI `axios` eingebunden, Redirects stillschweigend gefolgt und nur einen Versuch gemacht. |
| Wo hat der Plan gebremst? | Für ein ~100-Zeilen-Script sind vier Artefakte Overhead. Der Aufwand lohnt sich, wenn das Script in einer Pipeline hängt und andere sich darauf verlassen. Für ein Wegwerf-Script nicht. |
| Was war anders als bei einem reinen Feature-Request? | Die Schnittstelle ist nicht UI, sondern Exit-Code und Log. Testbarkeit ohne Produktivsystem war von Anfang an Teil der Story (eigene DoR-Zeile), bei Dev-Features ist das selbstverständlicher. |
| Rolle von AGENTS.md vs. OpenSpec? | AGENTS.md = **Wie** (Stack, Struktur, Grenzen wie "kein Netzwerk außer 127.0.0.1"), dauerhaft. OpenSpec = **Was** (Verhalten dieses Scripts), pro Change. |
| Für welche Aufgaben übernehmen? | Für Scripts und Pipeline-Schritte, deren Exit-Code und Ausgabe andere automatisieren. Weniger für einmalige Admin-Handgriffe oder Skripte mit einem Aufrufer. |
| Was ging schief? | Typisch: Die KI zieht eine Dependency, testet gegen echte URLs, ignoriert TDD in Apply (Regel in `config.yaml` schärfen), gibt Eingabewerte in Fehlertexten aus. Spec beschreibt nur den Happy Path. |
| Welche Betriebsfrage fehlt oft? | "Was steht im Log, wenn es schiefgeht, und wer darf es lesen?" |

---

## Hinweise zu den anderen Themen

Falls eure Gruppe eine andere Rohstory aus Runde 2 gewählt hat, tragen dieselben Methoden. Die kritischen Entscheidungen unterscheiden sich:

**Log-Auswertung** ("Fehler nach Typ und Häufigkeit")

- Kritische Fragen aus Prompt 1-3: Welches Log-Format (Zeile mit Zeitstempel, JSON)? Was zählt als Fehler (Level `ERROR`, HTTP 5xx, beides)? Wie wird der Typ bestimmt (Muster, Fehlerklasse)? Zeitraum? Leeres Log? Zeilen, die kein erwartetes Format haben (zählen, ignorieren, abbrechen)?
- Eigene DoR-Kriterien: "Beispiel-Logdatei mit erwarteter Ausgabe liegt bei (Golden File)" und "Maximale Dateigröße bzw. Streaming statt Komplett-Laden ist entschieden".
- Teststrategie: Golden-File-Tests, keine echten Logs (Datenschutz: Logs enthalten oft Personenbezug).
- Typische KI-Fehler: liest die ganze Datei in den Speicher, rät das Format, gibt echte IPs oder User-IDs in den Beispielen aus.

**Branch-Naming prüfen** ("vor dem Push, lokal oder in CI")

- Kritische Fragen: Wie lautet die Konvention exakt (Regex, Beispiele gültig/ungültig)? Ausnahmen (`main`, `release/*`, `dependabot/*`)? Wo läuft es (Git-Hook, CI, beides)? Meldung bei Verstoß mit Korrekturhinweis? Exit-Code?
- Eigene DoR-Kriterien: "Mindestens 5 gültige und 5 ungültige Beispielnamen stehen in der Story" und "Meldung nennt die Regel und ein gültiges Beispiel".
- Teststrategie: reine Funktion `isValidBranch(name)` mit Tabelle, kein Git nötig; Hook-Verdrahtung separat und dünn.
- Typische KI-Fehler: Regex zu streng oder zu lax, Ausnahmen vergessen, Git-Aufrufe in der Logik (nicht testbar).

**Gemeinsamer Rahmen für alle drei:** ein Aufruf, eine Ausgabe, ein Exit-Code, testbar ohne Produktivsystem, keine Secrets im Log.
