# Referenzlösung: Pomodoro Timer — Runde 2 (mit AGENTS.md)

Referenz zur [README](README.md): Vorgehen, Beispiel-Prompts, ein Referenz-AGENTS.md, eine Implementierung ([`solution/`](solution/)) und Prüfpunkte für Vergleich und Debrief.

> Wie in Runde 1 ist die Lösung ein **Vergleichswert**, kein Soll. Der Lerneffekt entsteht, wenn ihr euer eigenes AGENTS.md schreibt und seinen Effekt selbst beobachtet.

Inhalt der Referenz in [`solution/`](solution/):

| Datei | Zweck |
|---|---|
| [`AGENTS.md`](solution/AGENTS.md) | Referenz-AGENTS.md (aus den Lehren von Runde 1) |
| [`timer.js`](solution/timer.js) | Reine Timer-Logik, ohne DOM und ohne `Date.now()` |
| [`timer.test.js`](solution/timer.test.js) | 10 Tests, `node --test` |
| [`index.html`](solution/index.html) | UI und Verdrahtung |

---

## Entwickler

### Schritt 0 — Vorbereitung (2 min)

Neuer Arbeitsordner, damit Runde 1 als Vergleich erhalten bleibt (die README sagt: leeres Verzeichnis oder neuer Branch):

```bash
cd pomodoro-runde-2
mkdir mein-timer && cd mein-timer
opencode
```

Bei Bedarf Runde 1 daneben öffnen: `open ../../pomodoro-runde-1/index.html`.

### Schritt 1 — AGENTS.md erstellen (15 min)

#### 1a. Sammeln, bevor ihr schreibt (3 min)

Der Leitgedanke aus der Runde-1-Lösung: **Alles, was ihr in Runde 1 in jedem Prompt wiederholen musstet, gehört in die AGENTS.md.** Geht eure Runde-1-Prompts durch und markiert Wiederholungen:

| In Runde 1 mehrfach gesagt | Gehört in Abschnitt |
|---|---|
| "Eine Datei, Vanilla JS, keine Dependencies" | Tech-Stack |
| "Restzeit aus `Date.now()`, nicht dekrementieren" | Konventionen |
| "Ändere nichts außerhalb von `pomodoro-runde-1/`" | Was die KI nicht tun soll |
| "Audio-Fehler dürfen den Timer nicht stoppen" | Konventionen |
| "Erkläre am Ende in max. 5 Zeilen" | Definition of Done |

Dazu kommt, was ihr in Runde 1 **nicht** gesagt habt, aber hättet sagen sollen: Teststrategie, Dateistruktur, Benennung.

#### 1b. `opencode init` ausführen

`opencode init` analysiert das Verzeichnis und erzeugt ein AGENTS.md. In einem leeren Ordner kommt wenig Brauchbares heraus. Das ist normal. Der Befehl liefert das Gerüst, den Inhalt liefert ihr. Wer Runde-1-Code im Ordner hat, bekommt eine bessere Vorlage, die ihr dann **kürzen** müsst.

#### 1c. Das Referenz-AGENTS.md

Vollständig in [`solution/AGENTS.md`](solution/AGENTS.md). Die Kernaussagen:

```markdown
# Projekt
Pomodoro Timer als Web-App: 25 min Arbeit, 5 min Pause, Start/Pause/Reset, Countdown als MM:SS.
Lernprojekt im Workshop; Ziel ist kleiner, lesbarer, getesteter Code.

# Tech-Stack
- Vanilla JavaScript (ES2022), HTML, CSS. Keine Frameworks, keine Dependencies, kein Build-Schritt.
- Läuft per Doppelklick auf `index.html` (file://). Deshalb keine ES-Module im Browser-Code.
- Tests mit dem eingebauten Node-Testrunner: `node --test` (Node >= 20). Kein Jest, kein npm.

# Struktur
- `timer.js`: reine Logik ohne DOM, ohne `Date.now()`, ohne Timer. Zeit kommt als Parameter `now`.
- `timer.test.js`: Tests für `timer.js`.
- `index.html`: UI, Verdrahtung. Keine Geschäftslogik.

# Konventionen
- TDD: Für jede neue Funktion in `timer.js` zuerst einen fehlschlagenden Test, erst danach die Implementierung.
- Restzeit immer aus Endzeitpunkt (`endAt - now`) berechnen, nie per `remaining--` dekrementieren.
- Zustand ist ein Objekt `{ mode, remainingMs, endAt }`. Funktionen sind rein.
- ... (Benennung, ein Interval zur Zeit, Audio-Fehler fangen, kein alert(), Kommentar-Sprache)

# Was die KI nicht tun soll
- Keine Libraries, kein npm, keine package.json, keine zusätzlichen Dateien ohne Rückfrage.
- Keine Änderungen außerhalb dieses Ordners. Keine ungefragten Refactorings.
```

**Warum diese Zeilen wirken:**

| Zeile | Wirkung |
|---|---|
| "Läuft per Doppelklick (file://), deshalb keine ES-Module" | Verhindert die häufige Falle: `<script type="module">` funktioniert unter `file://` nicht (CORS). Das Begründen ("deshalb") hilft der KI, Folgeentscheidungen selbst richtig zu treffen. |
| "`timer.js` ohne `Date.now()`, Zeit als Parameter" | Macht die Logik deterministisch testbar, ohne Fake-Timer. Das ist die wichtigste Strukturentscheidung. |
| "TDD: erst fehlschlagender Test" | Die KI zeigt rote Tests, bevor sie implementiert. Ihr seht, **was sie für richtig hält**, bevor Code existiert. |
| "Keine Änderungen außerhalb dieses Ordners" | Verhindert Streuschäden an der Referenzlösung und Runde 1. |
| "Zusätzliche Dateien nur nach Rückfrage" | Bremst Dateiinflation (Warnsignal #8 aus Runde 1). |

**Was NICHT hineingehört:**
- Dinge, die im Code stehen oder sich per Lesen ergeben (Dateiliste in Prosa wiederholen, jede Funktion beschreiben).
- Wünsche statt Regeln ("schöner Code", "gute Qualität"). Nicht prüfbar, wirkt nicht.
- Lange Texte. Das AGENTS.md wird bei **jeder** Anfrage mitgeladen und kostet Kontext. Faustregel: unter ca. 60 Zeilen.

#### 1d. AGENTS.md mit OpenCode verbessern

Der Prompt aus der README, ausgefüllt und mit Format versehen:

```
Ich baue einen Pomodoro Timer (Web-App, 25/5 min, Start/Pause/Reset, Vanilla JS, eine
index.html, läuft per Doppelklick). Mein AGENTS.md enthält bisher:

[AGENTS.md einfügen]

Was fehlt, damit die KI meinen Code-Stil versteht und konsistentere Ergebnisse liefert?

Format: Tabelle Lücke | Warum relevant | konkreter Formulierungsvorschlag (1 Zeile).
Maximal 6 Zeilen. Nenne auch Zeilen, die überflüssig oder widersprüchlich sind.
Ändere die Datei nicht.
```

**Typische Vorschläge der KI:** Fehlerbehandlung, Umgang mit Zeitzonen/Systemuhr, Barrierefreiheit, Commit-Konventionen, Linter.
**Eure Aufgabe:** Filtern. Nur übernehmen, was für **dieses** Projekt eine Regel ist. Die KI neigt dazu, AGENTS.md aufzublähen. Streicht großzügig.

### Schritt 2 — Nochmal bauen (25 min)

Bewusst **den gleichen Auftrag wie in Runde 1**, damit der Vergleich fair ist. Nur kürzer, weil Technik und Konventionen jetzt im AGENTS.md stehen.

**Startprompt Runde 2:**
```
Baue einen Pomodoro Timer.

Funktionen:
- 25 Minuten Arbeitsphase, danach 5 Minuten Pause
- Start/Pause als Toggle-Button, Reset
- Countdown als MM:SS, aktuelle Phase sichtbar, Restzeit im Tab-Titel
- Signalton am Phasenende

Halte dich an die AGENTS.md.
```

Vergleich zu Runde 1: Der Prompt hat etwa die Hälfte an Text, es fehlen Technik, Drift-Hinweis, Scope-Grenze, Ausgabeformat.

**Erwarteter Ablauf mit TDD-Regel:**

1. Die KI schreibt `timer.test.js` und führt `node --test` aus: rot (Modul fehlt).
2. Implementierung von `timer.js`, grün.
3. `index.html` als dünne Schicht.

Wenn die KI diese Reihenfolge nicht einhält, ist das ein **Befund für euer AGENTS.md**: Die Regel ist zu schwach formuliert. Verschärft sie ("Zeige den fehlschlagenden Testlauf, bevor du implementierst") und startet neu.

**Iterations-Prompts** (gleiche wie Runde 1, jetzt mit weniger Erklärung nötig):

| Reihenfolge | Prompt | Was ihr beobachten sollt |
|---|---|---|
| 1 | `Mach die Dauern per URL-Parameter konfigurierbar (?work=0.1&break=0.05, Minuten). Ungültige Werte fallen auf 25/5 zurück.` | Kommt zuerst ein Test für die Parameter-Auswertung? Landet die Logik in `timer.js` statt in `index.html`? |
| 2 | `Zeige einen Zähler der abgeschlossenen Arbeitsphasen.` | Wird der Zähler in den Zustand `{ mode, remainingMs, endAt }` aufgenommen und getestet? |
| 3 | `Nach Phasenende soll die nächste Phase automatisch starten, abschaltbar per Checkbox.` | Bleibt `tick` rein? Bleibt es bei **einer** Änderung? |

#### Prüfpunkte für das Ergebnis

Die Tabelle "Typische Probleme" aus Runde 1 gilt weiter. Zusätzlich:

| # | Prüfpunkt | Wie prüfen |
|---|---|---|
| 1 | `node --test` ist grün, und die Tests prüfen Verhalten (Pause/Resume, Phasenwechsel, Hintergrund-Tab), nicht nur Formatierung. | `node --test` ausführen, Testnamen lesen |
| 2 | Keine `package.json`, kein `node_modules`, keine Extra-Dateien. | `ls -a` |
| 3 | Browser-Code enthält kein `import`/`export`. | Doppelklick auf `index.html`, Konsole prüfen |
| 4 | `timer.js` enthält weder `Date.now()` noch `document`. | `grep -nE "Date.now|document" timer.js` |
| 5 | Nichts außerhalb des Ordners geändert. | `git status` im Repo-Root |

#### Referenzimplementierung

[`solution/timer.js`](solution/timer.js) ist bewusst klein:

| Funktion | Aufgabe |
|---|---|
| `createState(mode)` | Neuer Zustand mit voller Phasendauer |
| `start(state, now)` | Setzt `endAt = now + remainingMs`. Läuft er schon, ist es ein No-op (Doppelklick-Schutz). |
| `pause(state, now)` | Speichert `endAt - now` als `remainingMs`, löscht `endAt` |
| `tick(state, now)` | Berechnet Restzeit aus der Uhr. Am Ende: Phasenwechsel, Timer steht, `phaseEnded: true` |
| `reset()` | Frische Arbeitsphase |
| `format(ms)` | `MM:SS` mit `Math.ceil` |

Die Tests rufen alles mit festen `now`-Werten auf. Der Hintergrund-Tab-Fall ist ein Einzeiler (`tick` einmal nach 10 Minuten, Restzeit stimmt), ganz ohne Fake-Timer und ohne Warten.

Ausprobieren:
```bash
cd pomodoro-runde-2/solution
node --test
open index.html
```

### Schritt 3 — Vergleich (5 min)

Vorlage zum Ausfüllen:

| Kriterium | Runde 1 | Runde 2 |
|---|---|---|
| Länge des Startprompts (Zeilen) | | |
| Zeit bis zum ersten lauffähigen Stand | | |
| Anzahl Korrekturprompts ("nein, nicht so") | | |
| Anzahl Dateien | | |
| Tests vorhanden / grün | | |
| Hintergrund-Tab korrekt | | |
| Code-Stil in Iterationen konsistent | | |

**Orientierungsantworten:**

| Frage | Typische Beobachtung |
|---|---|
| Musste ich weniger erklären? | Ja bei Technik, Scope und Ausgabeformat. Nein bei fachlichen Wünschen, die stehen weiter im Prompt. |
| Ist der Code konsistenter? | Ja, vor allem über mehrere Iterationen: gleiche Benennung, gleiche Struktur, Logik bleibt in `timer.js`. |
| Welche Zeile half am meisten? | Meist die **Strukturregel** (Logik getrennt von UI, Zeit als Parameter) oder die **TDD-Regel**. Weniger die Tech-Stack-Zeilen, die setzt eine gute Prompt-Formulierung auch. |
| Was hat nicht funktioniert? | Regeln, die die KI ignoriert hat. Meist zu vage oder zu weit oben im langen Dokument. Positiv und konkret formulieren ("Nutze X") statt nur "Nutze nicht Y". |
| Kostet das AGENTS.md etwas? | Ja: Es wird bei jeder Anfrage in den Kontext geladen. Kurz und aktuell halten. |

**Ehrlicher Hinweis:** Ein einzelner Vergleich ist anekdotisch. KI-Ausgaben schwanken. Wenn Runde 2 besser aussieht, könnte das auch daran liegen, dass ihr die Aufgabe nach Runde 1 besser versteht. Die Lerneinsicht ist nicht "AGENTS.md macht es X% besser", sondern "diese Zeilen steuern das Verhalten messbar".

---

## DevOps

### Aufgabe B — AGENTS.md eines Kollegen reviewen (20 min)

#### Vorgehen

1. AGENTS.md des Dev-Kollegen lesen, **bevor** ihr die KI fragt (5 min). Notiert eigene Lücken.
2. Prompt ausführen, Ergebnis mit eurer Liste abgleichen (10 min).
3. Dem Kollegen 3-5 priorisierte Rückmeldungen geben (5 min).

**Prompt (ausgefüllt, Plan Mode mit Shift+Tab):**
```
Hier ist das AGENTS.md eines Entwicklers für einen Pomodoro Timer
(Web-App, statische Dateien):

[Inhalt einfügen]

Aus Sicht eines DevOps-Engineers: Was fehlt, was in diesem Projekt wichtig wäre?
(z.B. Build-Prozess, Deployment-Constraints, Umgebungsvariablen, Logging)

Format: Tabelle Lücke | Warum relevant für Betrieb | Formulierungsvorschlag.
Maximal 6 Zeilen, nach Wichtigkeit sortiert.
Sag auch, wo etwas für DIESES Projekt unnötig wäre (z.B. Umgebungsvariablen bei
einer statischen Seite). Ändere keine Dateien.
```

#### Bewertungsraster

| Bereich | Frage ans AGENTS.md | Relevant für Pomodoro? |
|---|---|---|
| Build | Wie wird gebaut? Gibt es einen Build? | Ja, die Aussage "kein Build-Schritt" muss drinstehen |
| Test-Kommando | Ist das Kommando eindeutig und CI-tauglich (Exit-Code)? | Ja, `node --test` |
| Laufzeitversion | Welche Node-Version? | Ja, `>= 20` |
| Deployment | Wohin, wie? Welche Dateien gehören ins Artefakt? | Ja: nur `index.html` und `timer.js`, **nicht** die Tests |
| Konfiguration/Secrets | Umgebungsvariablen? | Nein. Statische Seite, ein Satz "keine Konfiguration, keine Secrets" reicht |
| Logging/Fehler | Wie werden Fehler sichtbar? | Gering: Konsolenfehler im Browser. Audio-Fehler bewusst ignoriert |
| Abhängigkeiten | Lizenz, Updates, Supply Chain | Positiv: keine Dependencies, sollte als Regel stehen |
| Grenzen für die KI | Verbotene Aktionen, z. B. `git push`, Löschen | Ja, Dateien außerhalb des Ordners |
| Git | Branch-/Commit-Konventionen | Optional |

**Typische Ergänzungen, die ein DevOps-Review findet:**
- "Test-Befehl und Exit-Code dokumentieren, damit CI ihn übernehmen kann."
- "Welche Dateien werden ausgeliefert?" (Tests gehören nicht ins Artefakt.)
- "Browser-Unterstützung festlegen" (z. B. aktuelle Chrome/Firefox/Safari), sonst entscheidet die KI beliebig, welche APIs sie nutzt.
- "KI darf keine Befehle mit Seiteneffekten außerhalb des Projekts ausführen (`git push`, `rm -rf`, Installationen)."

**Gutes Feedback ist:** konkret (Formulierungsvorschlag mitliefern), priorisiert (Top 3), projektbezogen (nicht jede Best Practice, sondern was hier zählt).

### Aufgabe A — Story und eigenes AGENTS.md für den Nachmittag vorbereiten (25 min)

Ihr schreibt eine **grobe** User Story ohne KI. Die Verfeinerung gegen die [Definition of Ready](../DoR.md) kommt später in der Story-Refinement-Übung. Die Story muss jetzt noch nicht fertig sein, aber so klar, dass ihr sie später gezielt schärfen könnt.

#### Vorgehen

1. Alltagssituation wählen (5 min): Was habt ihr zuletzt von Hand gemacht und dabei gedacht "das müsste ein Script tun"?
2. Eingrenzen (5 min): Passt es in **ein** Script mit klarer Ein- und Ausgabe? Ist es prüfbar, ohne Zugriff auf Produktivsysteme?
3. Story schreiben (10 min), nur Als/möchte/damit.
4. Selbsttest (5 min): Drei Fragen, die ihr noch nicht beantworten könnt, notieren. Das sind die Punkte fürs Refinement.

#### Auswahlkriterien

| Kriterium | Gut | Schlecht |
|---|---|---|
| Größe | Ein Script, ein Zweck | "CI-Pipeline neu bauen" |
| Testbarkeit | Ein Beispiel-Input, erwarteter Output | Braucht echtes Cluster/Produktivzugang |
| Abhängigkeiten | Läuft lokal | Braucht Secrets oder Netzfreigaben |
| Fachwissen | Ihr kennt die Domäne | Ihr müsstet erst recherchieren |

#### Beispiel: gute Rohfassung

**Thema: Branch-Naming prüfen**
```
Als Entwickler im Team
möchte ich vor dem Push automatisch prüfen lassen, ob mein Branch-Name unserer Konvention entspricht
damit ungültige Branch-Namen nicht in der Pipeline scheitern.
```
Offene Fragen für das Refinement (Selbsttest): Wie genau lautet die Konvention? Welche Branches sind ausgenommen (`main`, `release/*`)? Wo läuft die Prüfung (lokal, CI, beides)? Welche Meldung bei Verstoß? Welcher Exit-Code?

**Thema: Log-Auswertung**
```
Als Betriebsverantwortlicher
möchte ich aus einer Log-Datei eine Zusammenfassung der Fehler nach Typ und Häufigkeit erhalten
damit ich nach einem Vorfall in unter einer Minute sehe, was am häufigsten schiefging.
```
Offene Fragen: Welches Log-Format? Welcher Zeitraum? Was zählt als Fehler? Ausgabe als Tabelle, JSON oder Datei? Was bei leerem Log?

**Thema: Healthcheck vor Deployment**
```
Als Release-Verantwortlicher
möchte ich vor dem Deployment automatisch prüfen, ob die Zielumgebung antwortet
damit ich nicht in eine nicht erreichbare Umgebung deploye.
```
Offene Fragen: Was heißt "antwortet" (HTTP 200? Antwortzeit?)? Wie viele Wiederholungen, welches Timeout? Was passiert bei Fehlschlag (Abbruch, Warnung)?

#### Typische Fehler in der Rohfassung (jetzt schon vermeiden)

| Fehler | Beispiel | Besser |
|---|---|---|
| Lösung statt Nutzen | "damit wir Bash und Python einsetzen" | Nutzen für den Anwender nennen |
| Unscharfes Wort | "schnell", "einfach", "robust" | Messbar machen: "unter 1 Minute" |
| Implizite Technik | "Jenkins-Plugin für ..." | Plattform erst im Refinement festlegen |
| Zu groß | "gesamtes Monitoring" | Einen Ausschnitt wählen |
| Rolle fehlt | "Als Nutzer" | Konkrete Rolle: "Als Release-Verantwortlicher" |

Die gute Rohfassung hat **offene Fragen**, keine Lücken, die ihr übersehen habt. Wer jetzt alles beantwortet hat, hat die Story schon verfeinert. Das ist auch in Ordnung.

---

## Debrief — Orientierungsantworten

| Frage | Typische Beobachtung |
|---|---|
| Devs: Was hat sich durch das AGENTS.md verändert? | Kürzere Prompts, weniger Nacharbeit bei Technik und Struktur. Mehr Konsistenz über Iterationen. Mit TDD-Regel kommen Tests vor dem Code. |
| DevOps: Was habt ihr im AGENTS.md vermisst? | Test-Kommando mit Exit-Code, Deployment-Artefakt, unterstützte Browser/Laufzeit, Grenzen für Befehle mit Seiteneffekten. Betriebsthemen fehlen, weil Devs sie nicht mitdenken. |
| Alle: Welche Information hatte den größten Effekt? | Strukturregeln und Verbote ("nicht tun") wirken stärker als Beschreibungen. Wer nur Tech-Stack aufschrieb, merkte wenig Unterschied. |
| Was gehört nicht ins AGENTS.md? | Alles, was die KI aus dem Code lesen kann, Wünsche ohne Prüfbarkeit, einmalige Aufgaben. |
| Wie bleibt die Datei gut? | Wie Code behandeln: im Repo, reviewt, bei wiederholten Korrekturen ergänzt ("Wenn ich etwas zweimal sage, gehört es hinein") und von Überholtem befreit. |

**Brücke zu Runde 3:** AGENTS.md regelt das **Wie** (Stil, Struktur, Grenzen). Das **Was** (konkretes Verhalten einer Funktion) gehört in eine Spezifikation. Genau dafür kommt am Nachmittag OpenSpec, und eure heute geschriebene Story ist der Input.
