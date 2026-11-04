# Übung: Fix the Prompt

**Dauer:** 25 Minuten

**Ziel:** Schlechte Prompts verbessern und den Unterschied live in OpenCode sehen

**Aufgabe:** Wählt mindestens 1, wenn Zeit bleibt 2 der 4 Prompts. Führt erst den schlechten aus — dann eure verbesserte Version. Vergleicht die Ergebnisse.

> Tipp: Ihr müsst keinen "perfekten" Prompt schreiben. Schon eine Verbesserung zeigt den Effekt.

---


## Prompt 1 — Zu vage

**Der schlechte Prompt:**
```
Hilf mir mit meinem Code.
```

Führt ihn in OpenCode aus. Was bekommt ihr?

**Was ist das Problem?**
Kein Ziel, keine Sprache, kein Kontext, kein gewünschtes Ergebnis.
Die KI muss raten — und rät meistens falsch oder fragt nach.

**Hinweise für euren verbesserten Prompt:**
- Was soll die KI konkret tun? (→ Objective)
- In welcher Sprache / welchem Framework? (→ Context)
- Was soll das Ergebnis sein — Code, Erklärung, Review? (→ Response Format)

**Euer verbesserter Prompt:**
```
[hier einfügen]
```

---

## Prompt 2 — Implizites Wissen

**Der schlechte Prompt:**
```
Verbessere diesen Code:

function runTimer(label, minutes) {
  return new Promise((resolve) => {
    let remaining = minutes * 60;
    process.stdout.write(`\n${label} — ${formatTime(remaining)}`);

    const interval = setInterval(() => {
      remaining--;
      process.stdout.write(`\r${label} — ${formatTime(remaining)}`);
      if (remaining <= 0) {
        clearInterval(interval);
        process.stdout.write('\n');
        resolve();
      }
    }, 1000);
  });
}
```

Führt ihn aus. Was bekommt ihr?

**Was ist das Problem?**
"Verbessern" nach welchen Kriterien? Performance? Lesbarkeit? Fehlerbehandlung? Benennung?
Die KI kennt eure Standards nicht — sie erfindet sie.

**Hinweise für euren verbesserten Prompt:**
- Was soll konkret besser werden? (→ Objective)
- Für welchen Kontext läuft der Code? (→ Context)
- Welche Konventionen gelten bei euch? (→ System Prompt / COSTAR-C)
- Sollen Kommentare ergänzt werden? Auf Deutsch oder Englisch?

**Euer verbesserter Prompt:**
```
[hier einfügen]
```

---

## Prompt 3 — Kein Format

**Der schlechte Prompt:**
```
Erkläre mir die Datei pomodoro.js.
```

Führt ihn aus. Wie lang ist die Antwort? Für wen ist sie geschrieben?

**Was ist das Problem?**
Ohne Format-Angabe entscheidet die KI selbst: Essay oder Einzeiler, Anfänger oder Senior, mit oder ohne Code.
Das Ergebnis ist selten das, was ihr braucht.

**Hinweise für euren verbesserten Prompt:**
- Für wen ist die Erklärung? (→ Audience)
- Wie lang soll sie sein? (→ Response Format)
- Mit oder ohne Code-Beispiel?
- Welches Vorwissen habt ihr? (→ Context)

**Euer verbesserter Prompt:**
```
[hier einfügen]
```

---

## Prompt 4 — Zu viel auf einmal

**Der schlechte Prompt:**
```
Analysiere diesen Code, finde alle Bugs, schreib Unit Tests dafür,
dokumentiere die Funktionen und mach einen Refactoring-Vorschlag.

const args = process.argv.slice(2);
const WORK_MIN = parseFloat(args[0]) || 1;
const BREAK_MIN = parseFloat(args[1]) || 1;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

async function main() {
  let session = 1;
  console.log(`Pomodoro Timer — work: ${WORK_MIN}m, break: ${BREAK_MIN}m — Ctrl+C to stop\n`);

  while (true) {
    await runTimer(`Work #${session}`, WORK_MIN);
    console.log('\x07Session done! Take a break.');
    await runTimer('Break', BREAK_MIN);
    console.log('\x07Break over! Back to work.');
    session++;
  }
}
```

Führt ihn aus. Was bekommt ihr — und was fehlt?

**Was ist das Problem?**
Fünf komplexe Aufgaben in einem Prompt. Die KI erledigt alle halbherzig.
Keine Priorisierung → kein gutes Ergebnis bei einer einzigen davon.

**Hinweise für euren verbesserten Prompt:**
- Wählt **eine** Aufgabe — die wichtigste. (→ Objective)
- Stellt die anderen in eine Reihenfolge, die ihr danach separat abarbeitet. (→ Schritt-für-Schritt)
- Oder: nutzt einen Meta-Prompt, der die KI selbst eine Reihenfolge vorschlagen lässt.

**Euer verbesserter Prompt:**
```
[hier einfügen]
```

## Ablauf (25 min)

| Dauer | Was | Wer |
|---|---|---|
| 2 Minuten | Einstieg — Prompt auswählen und Ziel der Verbesserung festlegen | alle |
| 18 Minuten | Schlechte und verbesserte Prompts in OpenCode vergleichen — mindestens einen, bei Zeit zwei Prompts bearbeiten | alle |
| 5 Minuten | Debrief in Paaren oder im Plenum | alle |

---

---

## Debrief-Fragen

Drei Minuten pro Person / Paar:
- Welchen Prompt habt ihr gewählt?
- Was hat sich verändert?
- **Was hat den größten Unterschied gemacht** — ein Wort, ein Satz, eine Technik?
