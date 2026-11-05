# Pomodoro Timer – MVP Build-Prompt

Baue eine schlanke, responsive Pomodoro-Timer-Webanwendung als MVP.

## Ziel

Die Anwendung soll Nutzer:innen ermöglichen, fokussierte Arbeitsphasen und Pausen mit einem einfachen Pomodoro-Timer zu steuern. Die Bedienung soll unmittelbar verständlich und auf Desktop sowie Mobilgeräten nutzbar sein.

## Kernfunktionen

### Timer

- Drei auswählbare Modi:
  - Fokus: 25 Minuten
  - Kurze Pause: 5 Minuten
  - Lange Pause: 15 Minuten
- Zeige die verbleibende Zeit prominent im Format `MM:SS`.
- Biete folgende Steuerung:
  - Start
  - Pause
  - Zurücksetzen
- Beim Zurücksetzen wird die Zeit auf die Dauer des aktuell gewählten Modus gesetzt.
- Wenn der Timer abläuft:
  - stoppe den Timer,
  - zeige deutlich an, dass die Session beendet ist,
  - spiele nach Möglichkeit ein einfaches akustisches Signal ab.

### Pomodoro-Fortschritt

- Zähle abgeschlossene Fokus-Sessions.
- Zeige den Fortschritt in einer einfachen Darstellung mit vier Punkten oder Kreisen an.
- Nach vier abgeschlossenen Fokus-Sessions wird der Zähler wieder auf null gesetzt.
- Ein automatischer Wechsel zwischen Fokus und Pausen ist für den MVP nicht erforderlich.

## UI/UX

- Erstelle eine zentrale Timer-Karte mit:
  - klaren Umschaltern für die drei Modi,
  - großer Timer-Anzeige,
  - Start-/Pause-Button,
  - Reset-Button,
  - Anzeige des Pomodoro-Fortschritts.
- Verwende ein ruhiges, minimalistisches und hochwertiges Design.
- Hebe den aktiven Modus eindeutig hervor.
- Nutze je Modus unterschiedliche, dezente Akzentfarben:
  - Fokus: Koralle oder Rot
  - kurze Pause: Blau oder Türkis
  - lange Pause: Violett oder Grün
- Mobile-first umsetzen.
- Semantisches HTML, sichtbare Fokuszustände und sinnvolle ARIA-Labels verwenden.

## Technische Anforderungen

- Bestehende Projektstruktur und Konventionen beibehalten.
- Keine unnötigen externen Bibliotheken ergänzen.
- Stelle sicher, dass niemals mehrere Timer-Intervalle parallel laufen.
- Räume laufende Intervalle beim Pausieren, Zurücksetzen, Moduswechsel und Unmount zuverlässig auf.
- Strukturiere den Code nachvollziehbar, beispielsweise mit Komponenten für:
  - Timer-Anzeige
  - Modusauswahl
  - Timer-Steuerung
  - Pomodoro-Fortschritt
- Wiederverwendbare Timer-Logik kann bei Bedarf in einen eigenen Hook ausgelagert werden.

## Abschluss

- Prüfe die Anwendung lokal auf die Kernfunktionen.
- Fasse anschließend kurz zusammen, welche Komponenten erstellt oder angepasst wurden.
