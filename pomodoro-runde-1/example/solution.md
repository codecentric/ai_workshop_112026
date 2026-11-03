# Referenzlösung: Pomodoro Timer — Runde 1 (Freestyle)

Referenz zur [README](README.md): Vorgehen, Beispiel-Prompts, eine funktionierende Implementierung ([`index.html`](index.html)) und Prüfpunkte für Review und Debrief.

> Runde 1 ist bewusst Freestyle. Die Lösung ist ein **Vergleichswert**, kein Soll. Wichtiger als das Ergebnis ist, was ihr über die Zusammenarbeit mit OpenCode lernt.

---

## Entwickler — Option A: Pomodoro Timer

### Schritt 1 — Klarer Startprompt (Build Mode)

Der Tipp aus der README lautet: Was, welche Sprache, welche Plattform.

**Schwacher Prompt (zum Vergleich):**
```
Bau mir einen Pomodoro Timer.
```
Die KI entscheidet selbst über Framework, Dateistruktur, Styling und Umfang. Oft kommt ein React-Projekt mit Build-Setup, obwohl eine Datei reicht.

**Guter Startprompt:**
```
Baue einen Pomodoro Timer als Web-App.

Technik: Eine einzige Datei index.html mit inline CSS und Vanilla JavaScript.
Keine Frameworks, keine Dependencies, kein Build-Schritt. Muss per Doppelklick
im Browser laufen.

Funktionen:
- 25 Minuten Arbeitsphase, danach 5 Minuten Pause
- Buttons: Start/Pause (ein Toggle-Button) und Reset
- Countdown-Anzeige im Format MM:SS
- Aktuelle Phase (Arbeit/Pause) ist sichtbar

Technische Vorgaben:
- Die Restzeit wird aus Date.now() berechnet, nicht aus einem dekrementierten
  Zähler (der driftet und friert in Hintergrund-Tabs ein).
- Am Phasenende ein kurzer Signalton; Fehler beim Audio dürfen den Timer nicht stoppen.
- Der Tab-Titel zeigt die Restzeit.

Ändere nichts außerhalb von pomodoro-runde-1/. Erkläre am Ende in max. 5 Zeilen,
wie ich es starte und teste.
```

**Warum es wirkt:** Plattform und Technik sind festgelegt, der Umfang ist begrenzt, und die zwei bekannten Timer-Fallen (Drift, Hintergrund-Tab) stehen schon im Prompt.

### Schritt 2 — Ausprobieren

`open pomodoro-runde-1/index.html`

Schnelltest ohne 25 Minuten Wartezeit: In den DevTools-Konsole `DURATIONS_MS.work = 5000` ausführen und dann Reset drücken. Es geht auch über einen Prompt (siehe Schritt 3).

### Schritt 3 — Iterieren (je Prompt eine Änderung)

| Reihenfolge | Prompt |
|---|---|
| 1 | `Mach die Dauern per URL-Parameter konfigurierbar (?work=0.1&break=0.05, Werte in Minuten), damit ich schnell testen kann. Ungültige Werte (≤ 0, NaN) fallen auf 25/5 zurück.` |
| 2 | `Zeige zusätzlich einen Zähler der abgeschlossenen Arbeitsphasen.` |
| 3 | `Nach Phasenende soll die nächste Phase automatisch starten. Mach das über eine Checkbox "Auto-Start" abschaltbar.` |
| 4 | `Speichere den Zustand in localStorage (Phase, Endzeitpunkt, laufend ja/nein), sodass ein Seiten-Reload den Timer fortsetzt.` |

**Wenn ihr feststeckt** (Tipp aus der README), statt die Fehlermeldung einzufügen:
```
Der Timer springt nach einem Tab-Wechsel auf einen falschen Wert.
Was fehlt noch, damit das korrekt funktioniert? Analysiere zuerst, ändere noch nichts.
```

### Schritt 4 — Referenzimplementierung abgleichen

[`index.html`](index.html) deckt ab:

| Anforderung | Umsetzung |
|---|---|
| 25 min Arbeit / 5 min Pause | `DURATIONS_MS`, Phasenwechsel in `tick()` |
| Start/Pause/Reset | `start()`, `pause()`, `reset()`; Start und Pause teilen sich einen Toggle-Button |
| Countdown MM:SS | `format()` mit `Math.ceil`, damit `00:00` erst bei wirklichem Ablauf erscheint |
| Kein Drift | `endAt = Date.now() + remainingMs`; Restzeit wird bei jedem Tick neu berechnet |
| Hintergrund-Tab | Browser drosseln `setInterval` in Hintergrund-Tabs. Weil die Anzeige aus `endAt` abgeleitet wird, stimmt die Zeit beim Zurückwechseln trotzdem. |
| Pause behält Restzeit | `pause()` speichert `endAt - Date.now()` in `remainingMs` |
| Phasenende | Signalton (`beep()`), Phasenwechsel, Timer wartet auf erneutes Start |
| Sichtbarkeit | Phase als Label, Farbwechsel, Restzeit im Tab-Titel |

**Bewusst nicht enthalten** (gute Folgeprompts, siehe Schritt 3): Persistenz über Reload, Konfiguration, Auto-Start, Benachrichtigungen. Der Tab-Titel ist in Hintergrund-Tabs der einzige Hinweis, ein Phasenende wird dort aber nur über den Ton bemerkt.

### Typische Probleme bei KI-generierten Timern

Mit diesen Punkten lässt sich das eigene Ergebnis prüfen:

| # | Problem | Prüfen |
|---|---|---|
| 1 | Zähler wird per `remaining--` dekrementiert und driftet. | Timer 5 Min laufen lassen, mit Handy-Stoppuhr vergleichen. |
| 2 | Hintergrund-Tab: Der Timer läuft langsamer oder friert ein. | Start, Tab 1 Min wechseln, zurückkehren. |
| 3 | Mehrfacher Klick auf Start erzeugt mehrere Intervalle und der Timer läuft doppelt so schnell. | Start schnell mehrfach klicken. |
| 4 | Pause setzt auf 25:00 zurück statt fortzusetzen. | Start, Pause, Start. |
| 5 | Reset während der Pause lässt das Intervall weiterlaufen. | Reset drücken, prüfen ob die Anzeige weiter tickt. |
| 6 | Anzeige zeigt `0:5` oder `25:0`. | Alle Werte unter 10 prüfen (Padding). |
| 7 | `alert()` am Phasenende blockiert den Browser-Tab. | Phasenende abwarten. |
| 8 | Unnötige Komplexität: Node-Projekt, Bundler, Tests, 15 Dateien. | `ls`. Für Freestyle-Runde 1 sind das Warnsignale. |

---

## Entwickler — Option B: Eigener Mini-Use-Case

Kriterien aus der README: code-nah, klein genug für 1h, testbar.

**Prüffragen vor dem Start (30 Sekunden):**
1. Gibt es eine Eingabe und eine erwartete Ausgabe, die ich beschreiben kann?
2. Kann ich es mit 2-3 Beispielen prüfen?
3. Passt es in eine Datei oder Funktion?

**Beispiele:**
| Use-Case | Testbarkeit |
|---|---|
| Log-Datei nach Fehlern gruppieren und zählen | Beispiel-Logfile, erwartete Tabelle |
| CSV mit Dubletten bereinigen | Eingabe-CSV, erwartete CSV |
| Funktion, die Datumsangaben in verschiedenen Formaten vereinheitlicht | Tabelle Eingabe → Ausgabe |
| SAS-Makro-Logik als JS/Java-Funktion nachbauen | Gleiche Eingabe, gleiches Ergebnis |

**Prompt-Vorlage:**
```
Ich brauche [Funktion/Script] in [Sprache, Version].

Eingabe: [Format, Beispiel]
Ausgabe: [Format, Beispiel]
Randfälle: [leere Eingabe, Sonderzeichen, ...]

Schreibe zuerst 3 Testfälle (Eingabe → erwartete Ausgabe), warte auf meine
Bestätigung, und implementiere dann die Funktion so, dass die Tests grün werden.
```

Die Test-zuerst-Variante lässt die KI nicht raten, was "richtig" bedeutet. Das ist der entscheidende Vorteil gegenüber einem freien "Schreib mir ...".

---

## DevOps — Rolle: Product Owner

### Phase 1 — Anforderungen formulieren

**Referenzliste für den Pomodoro Timer:**

| # | Anforderung | Prüfbar durch |
|---|---|---|
| R1 | Der Timer muss eine Arbeitsphase von 25 Minuten und eine Pause von 5 Minuten abbilden. | Phase starten und Dauer messen |
| R2 | Der Timer muss Start, Pause und Reset bieten. Nach Pause läuft er mit der Restzeit weiter. | Start, Pause, Start: Zeit springt nicht zurück |
| R3 | Der Timer muss die Restzeit als MM:SS anzeigen. | Sichtprüfung inkl. einstelliger Werte |
| R4 | Der Timer muss die aktuelle Phase (Arbeit/Pause) eindeutig anzeigen. | Sichtprüfung |
| R5 | Der Timer muss das Ende einer Phase erkennbar machen (Ton und/oder visuell). | Phasenende abwarten |
| R6 | Der Timer darf pro Minute nicht mehr als 1 Sekunde von der realen Zeit abweichen. | Vergleich mit Stoppuhr über 5 Min |

**Was ist ein gutes Ergebnis?** Alle R1-R6 erfüllt, ohne Installation lauffähig, Code in einer Datei verständlich.
**Was ist inakzeptabel?** Falsche Zeit nach Pause oder Tab-Wechsel, mehrere gleichzeitige Timer nach wiederholtem Klick, blockierende `alert()`-Dialoge.

**Edge Cases** (mit erwartetem Verhalten):

| Edge Case | Erwartung |
|---|---|
| Tab liegt im Hintergrund | Zeit bleibt korrekt (kein Einfrieren, kein Verlangsamen) |
| Tab wird geschlossen / Seite neu geladen | Festlegen: Timer startet neu **oder** wird fortgesetzt. Beides ist okay, aber **explizit entschieden**. |
| Rechner geht in den Ruhezustand | Nach Aufwachen stimmt die Restzeit anhand der Uhrzeit, oder der Timer zeigt abgelaufen. |
| Doppelklick auf Start | Nur ein Timer läuft |
| Reset während laufendem Timer | Timer stoppt, Anzeige 25:00, Phase = Arbeit |
| Phasenende, niemand schaut hin | Signalton; im Tab-Titel erkennbar |
| Systemuhr wird umgestellt | Offen: Wird akzeptiert oder abgesichert? (in `Date.now()`-Lösung relevant) |

### Prompt zum Schärfen (aus der README, erweitert)

```
Ich bin Product Owner für einen Pomodoro Timer (Web-App, 25 min Arbeit / 5 min Pause,
Start/Pause/Reset, Countdown). Meine Anforderungen:
[eure Liste]

Welche wichtigen Anforderungen habe ich vergessen?

Format: Tabelle mit den Spalten Thema | Warum relevant | Vorschlag für eine
prüfbare Anforderung. Maximal 8 Zeilen, nach Wichtigkeit sortiert.
Nenne explizit Annahmen, die ich implizit getroffen habe.
```

**Typische Ergänzungen, die die KI findet:** Verhalten bei Reload, Benachrichtigung bei Phasenende, lange Pause nach vier Durchläufen, Konfigurierbarkeit der Dauer, Barrierefreiheit (Tastatur, Screenreader), mehrere Tabs, Zähler abgeschlossener Sessions.
**Eure Aufgabe als PO:** Entscheiden, was **jetzt** gebraucht wird und was nicht. Die KI liefert Vorschläge, nicht Prioritäten.

### Zwischenzeit

Fragen an die Entwickler, die sich lohnen:
- "Was passiert, wenn ich den Tab 2 Minuten im Hintergrund lasse?"
- "Wie habt ihr die Zeit gemessen: Zähler oder Systemzeit?"
- "Kannst du mir zeigen, wie ich die Phase auf 10 Sekunden stelle, damit ich schnell testen kann?"

### Phase 2 — Review (Plan Mode, Shift+Tab)

```
Reviewe pomodoro-runde-1/index.html. Ändere keine Dateien.

Prüfe gegen diese Anforderungen:
[eure Liste R1-R6]

Format: Tabelle mit Anforderung | erfüllt (ja / teilweise / nein) | Beleg (Zeile, Funktion) |
Anmerkung. Danach maximal 5 weitere Findings (Bugs, Edge Cases, Wartbarkeit),
nach Schweregrad sortiert.
```

**Zweites Modell:** Gleichen Prompt mit einem anderen Modell ausführen (z. B. GPT 5.6 Sol vs. Deepseek Flash) und vergleichen:
- Welche Findings kommen von beiden? Das sind vermutlich echte Probleme.
- Welche nur von einem? Selbst nachprüfen, es können Halluzinationen sein.
- Hat eines eine Anforderung als erfüllt bewertet, die ihr beim Ausprobieren verletzt gesehen habt?

**Hinweis zur Review-Qualität:** Ein Review aus dem Code heraus ersetzt keinen Praxistest. Mindestens R2 (Pause/Weiter) und den Tab-Wechsel selbst im Browser ausprobieren.

---

## Sichern (15:30-15:35)

Der Code wird in Runde 2 gebraucht.

```bash
git add pomodoro-runde-1/
git commit -m "Pomodoro Runde 1: Ergebnis"
```

Wer eigenen Code hat, legt ihn in einem eigenen Unterordner ab, z. B. `pomodoro-runde-1/<name>/`. Diese Referenzlösung nicht überschreiben.

---

## Debrief — Orientierungsantworten

| Frage | Typische Beobachtung |
|---|---|
| Wie weit seid ihr gekommen? | Ein lauffähiger Timer nach 10-15 Minuten. Die restliche Zeit geht in Edge Cases und Wünsche. |
| Was hat überrascht? | Wie schnell der erste Stand da ist, und wie viele Annahmen die KI stillschweigend getroffen hat (Framework, Struktur, Verhalten am Phasenende). |
| Wo hat OpenCode geholfen? | Boilerplate, UI, Standardlogik. Schnelle Iteration bei klaren Einzelwünschen. |
| Wo hat es gebremst? | Zu große Prompts, ungewollt viele Dateien, Änderungen an Stellen, die nicht gemeint waren. Der Fehler wird erst später entdeckt. |
| Anders beim nächsten Mal? | Technik und Scope im ersten Prompt festlegen, pro Prompt eine Änderung, Anforderungen **vorher** schreiben. Das ist die Brücke zu Runde 2 (AGENTS.md). |
| DevOps: Anforderungen erfüllt? | Meist teilweise. Die lückenhaften Punkte sind Edge Cases, die nicht in der Liste standen. Daran sieht man den Wert expliziter Anforderungen. |

**Leitgedanke für Runde 2:** Alles, was ihr in Runde 1 in jedem Prompt wiederholen musstet (Vanilla JS, eine Datei, keine Dependencies, Date.now statt Zähler), gehört in die `AGENTS.md`.
