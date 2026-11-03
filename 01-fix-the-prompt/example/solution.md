# Referenzlösung: Fix the Prompt

Referenz-Prompts für die vier schlechten Prompts aus der [README](README.md), plus die tatsächlich in `pomodoro.js` enthaltenen Bugs zum Abgleichen der KI-Ergebnisse.

---

## Prompt 1 — Zu vage

**Problem:** Kein Ziel, kein Code, kein Kontext, kein Format.

**Verbesserter Prompt:**
```
Du bist ein erfahrener Node.js-Entwickler.

Aufgabe: Führe ein Code-Review der Datei 01-fix-the-prompt/pomodoro.js durch.
Kontext: Das ist ein CLI-Pomodoro-Timer in reinem Node.js (keine Dependencies),
der von Entwicklern im Terminal genutzt wird.
Fokus: Korrektheit und Robustheit (Fehleingaben, Edge Cases), nicht Stil.

Ausgabeformat: Tabelle mit den Spalten Nr. | Zeile | Problem | Schweregrad (hoch/mittel/niedrig) | Fix-Vorschlag.
Maximal 5 Findings, nach Schweregrad sortiert. Ändere noch keine Dateien.
```

**Warum es wirkt:** Objective (Review), Context (Node-CLI), Scope (Fokus, Limit) und Response Format (Tabelle) sind explizit. "Ändere noch keine Dateien" verhindert eigenmächtige Änderungen.

---

## Prompt 2 — Implizites Wissen

**Problem:** "Verbessern" ohne Kriterium — die KI erfindet die Standards selbst.

**Verbesserter Prompt:**
```
Refactore die Funktion runTimer in 01-fix-the-prompt/pomodoro.js.

Kontext: CLI-Tool, Node.js ≥ 18, CommonJS, keine externen Dependencies.

Konkrete Ziele (nur diese, sonst nichts ändern):
1. Eingaben validieren: minutes muss eine positive Zahl sein, sonst klare Fehlermeldung.
2. Der Countdown soll nicht driften. Berechne die Restzeit aus Date.now() statt
   aus einem dekrementierten Zähler.
3. Beim Überschreiben der Zeile mit \r dürfen keine Reste der vorherigen Ausgabe
   stehen bleiben.
4. Die öffentliche Signatur runTimer(label, minutes) → Promise bleibt gleich.

Konventionen: camelCase, const statt let wo möglich, Kommentare auf Englisch,
nur wo das "Warum" nicht offensichtlich ist.

Ausgabe: Nur die geänderte Funktion plus ein Diff-Überblick in max. 3 Bullet Points.
```

**Warum es wirkt:** Kriterien, Konventionen und Kommentarsprache stehen im Prompt, der Scope ist begrenzt.

---

## Prompt 3 — Kein Format

**Problem:** Keine Zielgruppe, keine Länge, kein Format.

**Verbesserter Prompt:**
```
Erkläre 01-fix-the-prompt/pomodoro.js für einen Entwickler, der JavaScript kann,
aber noch nie mit setInterval, Promises und process.stdout.write in einem
CLI-Tool gearbeitet hat.

Format:
- Maximal 150 Wörter, Deutsch
- Zuerst ein Satz: Was macht das Programm?
- Dann 4-5 Bullets in der Reihenfolge des Programmablaufs
- Ein kurzes Code-Snippet (max. 5 Zeilen) für den Teil, der am schwersten
  zu verstehen ist, mit einer Zeile Erklärung dazu
- Keine Einleitung, kein Fazit
```

**Warum es wirkt:** Audience, Vorwissen, Länge, Struktur und Sprache sind festgelegt — die Antwort wird vorhersehbar und vergleichbar.

---

## Prompt 4 — Zu viel auf einmal

**Problem:** Fünf Aufgaben ohne Priorisierung.

### Variante A: Eine Aufgabe, Rest folgt separat
```
Finde Bugs in 01-fix-the-prompt/pomodoro.js.

Prüfe gezielt: Eingabevalidierung (0, negative Werte, NaN, Dezimalwerte wie 0.025),
Verhalten bei Ctrl+C, Anzeige-Artefakte im Terminal.

Ausgabe: Nummerierte Liste, je Bug: Zeile, Reproduktionsschritt (Befehl), erwartetes
vs. tatsächliches Verhalten. Noch keine Fixes, keine Tests, kein Refactoring.
```

Empfohlene Reihenfolge der Folge-Prompts: Bugs fixen → Tests schreiben → Funktionen dokumentieren → Refactoring vorschlagen. So testen die Tests schon den korrigierten Code.

### Variante B: Meta-Prompt
```
Ich möchte pomodoro.js analysieren, Bugs finden, Unit Tests schreiben,
Funktionen dokumentieren und einen Refactoring-Vorschlag bekommen.

Erledige noch nichts davon. Schlage stattdessen eine sinnvolle Reihenfolge
der Schritte vor und begründe sie kurz (warum zuerst X, dann Y).
Formuliere für jeden Schritt einen fertigen Prompt, den ich einzeln ausführen kann.
```

---

## Referenz: Bugs in `pomodoro.js`

Zum Abgleichen der KI-Ergebnisse.

| # | Bug | Auslöser |
|---|---|---|
| 1 | `parseFloat(args[0]) \|\| 1` verwandelt `0` stillschweigend in `1`. | `node pomodoro.js 0` |
| 2 | Negative Werte werden akzeptiert; `remaining` ist negativ, `formatTime` gibt Unsinn aus. | `node pomodoro.js -5` |
| 3 | Bei Dezimalwerten ist `remaining` nicht ganzzahlig, `formatTime` zeigt z. B. `00:1.5`. | `node pomodoro.js 0.025` |
| 4 | `setInterval` driftet, weil der Zähler nicht an die echte Zeit gekoppelt ist. | langer Lauf |
| 5 | Kein SIGINT-Handler: Ctrl+C lässt den Cursor mitten in der Zeile, keine saubere Abschlussmeldung. | Ctrl+C |
| 6 | Erste Anzeige sofort, erster Tick erst nach 1 s (Kleinigkeit). | – |
| 7 | `main()` ohne `.catch` → unhandled rejections bei künftigen Fehlern. | – |

---

## Debrief

Den größten Unterschied machen meist **Format und Scope** ("maximal 5 Findings als Tabelle", "nur diese 4 Ziele, sonst nichts ändern"). Ein einzelner Zusatz wie "Ändere noch keine Dateien" verhindert viel Streuung. Explizite Kriterien (Prompt 2) und eine einzige Aufgabe pro Prompt (Prompt 4) sind der zweitwichtigste Hebel.
