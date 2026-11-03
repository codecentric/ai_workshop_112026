# Referenzlösung: Pomodoro Timer — Runde 3 (DevOps-Track)

Referenz zur [README](README.md): Vorgehen, ausgefüllte Prompts und Beispielantworten zum Story Refinement.

> Wie in den Runden davor ist das ein **Vergleichswert**, kein Soll. Der Lerneffekt entsteht, wenn ihr die Fragen selbst beantwortet und die Entscheidungen selbst trefft. Die Referenz behandelt die Story **"Healthcheck vor dem Deployment"** aus Runde 2 (Aufgabe A). Hinweise zu den Themen "Log-Auswertung" und "Branch-Naming" stehen in der Referenzlösung von Runde 4.

| Datei | Zweck |
|---|---|
| [`solution/DoR.md`](solution/DoR.md) | Basis-DoR plus 2 eigene Kriterien |
| [`solution/story.md`](solution/story.md) | Fertige Story (Ergebnis dieser Runde; wird in Runde 4 weiterverwendet) |
---

## Teil 1 — Story Refinement (30 min)

### Phase 1 — Eigene DoR (5 min)

`DoR.md` aus dem Repo-Root in den Ordner kopieren und unter "Unsere Ergänzungen" 1-2 Kriterien ergänzen. Für ein Pipeline-Script sind das **Betriebskriterien**, nicht UI-Kriterien. Referenz:

```markdown
- [ ] Exit-Codes und Ausgabe sind festgelegt (welcher Code für gesund, ungesund, falsche Bedienung; was auf stdout, was auf stderr), sodass CI das Script ohne Interpretation einbinden kann.
- [ ] Die Story ist ohne Zugriff auf Produktivsysteme testbar (lokaler Testserver oder Fake), und das Script gibt keine Secrets in Logs aus.
```

Warum diese beiden: Ein Pipeline-Script scheitert selten an der Idee, sondern an der **Schnittstelle zur Pipeline** (Exit-Code, was im Log steht) und an **Testbarkeit** (wer testet einen Healthcheck, ohne die echte Umgebung anzufassen?). Wer das als DoR-Kriterium festhält, muss es in der Story beantworten. Schwache Ergänzungen: "Script ist robust" (nicht prüfbar), "Best Practices werden eingehalten" (undefiniert).

### Phase 2 — Sokratische Session (20 min)

Ausgangsstory (die Rohfassung aus Runde 2, bewusst lückenhaft):

> Als Release-Verantwortlicher
> möchte ich vor dem Deployment automatisch prüfen, ob die Zielumgebung antwortet
> damit ich nicht in eine nicht erreichbare Umgebung deploye.

Notiert vor der Session eure drei offenen Fragen aus dem Selbsttest von Runde 2 (hier: Was heißt "antwortet"? Wie oft wiederholen? Was passiert bei Fehlschlag?). Danach: Wurden sie von der KI erneut genannt? Welche kamen neu dazu?

Die vier Prompts aus der README, mit **typischen Antworten** und was ihr daraus macht. Die KI-Antworten schwanken, entscheidend ist die Spalte "Konsequenz".

#### Prompt 1 — Annahmen aufdecken

| Verdeckte Annahme | Konsequenz für die Story |
|---|---|
| "Antwortet" = HTTP 200 (und nicht 301, 204, 401?) | Gesund definieren: 2xx |
| Es gibt überhaupt einen HTTP-Endpunkt (und nicht TCP, Datenbank, Message Queue) | Prüfart festlegen: HTTP-GET |
| Ein einzelner Versuch reicht (kein Retry, kein Flackern) | Retry-Regel mit Zahl und Pause |
| Es gibt eine Antwortzeit-Grenze | Timeout als Parameter mit Standardwert |
| Die Pipeline wertet das Ergebnis aus (Exit-Code), nicht ein Mensch | Exit-Codes festlegen |
| Läuft in der Pipeline und lokal gleich | Nur Standardbibliothek, keine Umgebungsvariablen |
| Die URL ist bekannt und enthält keine Geheimnisse | Secrets-Regel, URL-Ausgabe begrenzen |
| "Gesund" heißt "Anwendung funktioniert" | Nicht-Ziel: nur Erreichbarkeit, nicht Korrektheit |

**Was überrascht typischerweise:** Dass "antwortet" mindestens vier Bedeutungen hat (Verbindung, Status, Inhalt, Zeit), und dass die Pipeline einen **Exit-Code** braucht, nicht nur eine Meldung.

#### Prompt 2 — Risiken benennen

| Risiko | Art | Konsequenz |
|---|---|---|
| Healthcheck-Endpunkt meldet "ok", obwohl die App dahinter kaputt ist | Fachlich | Nicht-Ziel ausdrücklich nennen: nur Erreichbarkeit |
| Weiterleitung auf eine Login-Seite wird als gesund gewertet | Technisch | Redirects nicht folgen, 3xx = Fehlschlag |
| Server hängt, Script wartet ewig, Pipeline blockiert | Technisch | AK: Timeout je Versuch |
| Kurzes Flackern (Rolling Deployment) bricht die Pipeline unnötig ab | Betrieb | AK: Retry mit Pause |
| Retries verlängern jeden echten Ausfall um die Pause | Betrieb | Keine Pause nach dem letzten Versuch |
| Token in der URL landet im CI-Log | Sicherheit | AK: URL nur gekürzt ausgeben |
| Unternehmens-Proxy, selbstsigniertes Zertifikat | Betrieb | Als Risiko und Nicht-Ziel notieren |
| Exit-Code 1 für alles: "Umgebung down" nicht von "falsch aufgerufen" unterscheidbar | Schnittstelle | Exit-Code 2 für Bedienfehler |

**Hinweis:** Das Risiko "Token im Log" fällt in der KI-Antwort oft nur beiläufig auf. Es lohnt sich, es als eigenes Akzeptanzkriterium festzuhalten. Der Nutzen zeigt sich in Teil 2 (siehe "Was beim manuellen Test auffiel").

#### Prompt 3 — Lücken finden

Aus der Antwort entstehen die Akzeptanzkriterien. Referenz (6 Stück, siehe [`story.md`](solution/story.md)):

1. Aufruf, Exit-Code 0, genau eine OK-Zeile auf stdout
2. Erster Erfolg beendet sofort, keine unnötigen Pausen
3. Alle Versuche scheitern: Exit-Code 1, Fehlerzeile mit Grund des letzten Versuchs
4. Jeder Versuch wird auf stderr protokolliert
5. Ungültige Eingaben: Exit-Code 2, ohne Netzwerkzugriff
6. Keine Query-Parameter in der Ausgabe, URLs mit Zugangsdaten werden abgelehnt

**Prüffrage zu den AK:** Kann man jedes davon als Test schreiben, ohne eine Rückfrage zu stellen? "Das Script ist schnell" ist es nicht, "Timeout je Versuch Standard 5000 ms" ist es.

**Begriffe nicht vergessen:** Die Referenz-Story definiert *gesund*, *Versuch*, *Timeout*, *Wiederholung* und *Fehlschlag* in einem eigenen Abschnitt. Ohne ihn würden Entwickler und Release-Verantwortlicher "antwortet" unterschiedlich lesen.

#### Prompt 4 — Advocatus Diaboli (optional)

| Einwand | Reaktion |
|---|---|
| "Dafür gibt es `curl --retry --fail`. Warum ein Script?" | Berechtigt. Entscheidung dokumentiert: eigene Exit-Codes, einheitliche Ausgabezeilen und Tests wären mit curl-Wrapper aufwendiger. Wer nur 'curl -f' braucht, braucht die Story nicht. |
| "Retry versteckt echte Instabilität." | Stimmt, deshalb wird jeder Versuch auf stderr protokolliert (AK 4). Die Pipeline sieht: "gesund im 3. Versuch" ist kein stilles Okay. |
| "Zu viele Optionen für den Anfang." | Es sind drei, alle mit Standardwert. Mehr-URL-Aufruf und Header-Authentifizierung sind Nicht-Ziele. |
| "Was, wenn die Umgebung Auth verlangt?" | Nicht-Ziel. 401 gilt als Fehlschlag, Header-Support wäre eine Folgestory. |

**Regel für die Reaktion:** Nicht jeden Einwand einbauen. Entscheiden und **die Entscheidung notieren** (Nicht-Ziel oder AK).

### Phase 3 — DoR-Check (5 min)

Prompt: `Prüfe meine Story gegen @DoR.md. Erfüllt sie alle Kriterien? Was fehlt noch konkret?`

Die KI sagt oft "alles erfüllt". Gezielt nachhaken:

```
Bist du sicher bei "Keine impliziten Annahmen über Technik oder Plattform"?
Die Story nennt Node.js >= 20. Ist das eine versteckte Annahme oder eine bewusst benannte?
```
```
Kriterium "Ein Entwickler könnte sie ohne Rückfragen starten": Nenne drei Fragen,
die ein Entwickler trotzdem stellen würde. Wenn du keine findest, begründe, warum.
```

**Gute Antwort der KI:** Sie findet noch etwas (z. B. "Was passiert bei IPv6-Adressen?", "Wird der Header `User-Agent` gesetzt?", "Welche Zeitzone haben Logzeilen?"). **Schlechte Antwort:** pauschales "ja". Dann selbst gegen jedes Kriterium prüfen. Für die Referenz sind das die Ergebnisse:

| Kriterium | Erfüllt | Beleg |
|---|---|---|
| User, Feature, Nutzen | Ja | Kopf der Story (Release-Verantwortlicher, Healthcheck mit Exit-Code, kein Deployment in tote Umgebung) |
| Mind. 3 AK | Ja | 6 AK |
| Keine undefinierten Begriffe | Ja | Abschnitt "Begriffe": gesund, Versuch, Timeout, Wiederholung, Fehlschlag |
| Keine impliziten Annahmen | Ja | Abschnitt "Offene Entscheidung": Node.js >= 20 ausdrücklich, Bash/curl als Alternative genannt |
| In einem Sprint umsetzbar | Ja | Ein Script, ca. 100 Zeilen, vier Funktionen |
| Ohne Rückfragen startbar | Ja | AK sind testbar, Nicht-Ziele benannt |
| Eigen: Exit-Codes und Ausgabe | Ja | AK 1, 3, 4, 5 |
| Eigen: ohne Produktivzugriff testbar, keine Secrets in Logs | Ja | Lokaler Testserver; AK 6 |

Ergebnis: [`story.md`](solution/story.md), das ihr in Runde 4 weiterverwendet.

**Reflexionsfrage, Orientierungsantwort:** Die sokratische Session war nützlicher, weil die KI Fragen **an euch** stellt und ihr die Entscheidungen trefft (Was ist "gesund"? Folgen wir Redirects? Was darf im Log stehen?). Bei einem DevOps-Thema kommt dazu: Die KI kann eine "vollständige" Story schreiben, aber sie kennt eure **Pipeline, euer Netzwerk und eure Betriebsregeln** nicht. Genau diese Entscheidungen gehören dem Team.
