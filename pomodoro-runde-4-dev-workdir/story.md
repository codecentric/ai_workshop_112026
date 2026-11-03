# Story: Tageszähler für abgeschlossene Pomodoros

Als Nutzer des Pomodoro Timers
möchte ich auf dem Timer-Bildschirm sehen, wie viele Arbeitsphasen ich heute abgeschlossen habe,
damit ich meinen Fortschritt im Blick behalte, ohne mitzuzählen.

## Begriffe

- **Pomodoro:** eine Arbeitsphase, die regulär bis 00:00 gelaufen ist. Pausenphasen, per Reset abgebrochene und pausierte Phasen zählen nicht.
- **Heute:** der aktuelle Kalendertag nach lokaler Uhrzeit des Geräts (Wechsel um 00:00 Uhr lokal, nicht UTC).
- **Abgeschlossen** bedeutet: der Moment, in dem die Phase endet. Endet sie nach Mitternacht, zählt sie für den neuen Tag.

## Akzeptanzkriterien

1. Beim ersten Öffnen an einem Tag zeigt der Timer "Heute: 0 Pomodoros". Bei genau einem: "Heute: 1 Pomodoro".
2. Endet eine Arbeitsphase regulär, erhöht sich der Zähler um genau 1. Das gilt auch, wenn der Tab im Hintergrund war und der Timer erst verspätet bemerkt, dass die Phase vorbei ist (einmal zählen, nicht mehrfach).
3. Pausenende, Pause/Fortsetzen und Reset verändern den Zähler nicht. Reset während der Arbeitsphase zählt nicht.
4. Nach Neuladen der Seite oder Schließen und Öffnen des Browsers am selben Tag bleibt der Zähler erhalten.
5. An einem neuen Kalendertag (lokal) beginnt der Zähler bei 0. Vortage werden nicht angezeigt.
6. Ist der Speicher nicht nutzbar (blockiert, voll, beschädigte Daten), startet der Zähler bei 0, der Timer läuft normal weiter, es erscheint kein Fehlerdialog. Der Zähler zählt dann bis zum Neuladen weiter.

## Nicht-Ziele

- Verlauf über mehrere Tage, Statistik, Export.
- Manuelles Zurücksetzen oder Korrigieren des Zählers.
- Synchronisierung zwischen Geräten oder Browsern. Mehrere Tabs im selben Browser: letzter Schreiber gewinnt, wird nicht gesondert behandelt.
- Tagesziel oder Benachrichtigung bei Erreichen eines Ziels.

## Offene Entscheidung (bewusst getroffen)

Speicherort ist der Browser des Nutzers (`localStorage`). Das ist eine Plattformannahme, die hier ausdrücklich steht: Die App läuft per Doppelklick (`file://`), es gibt kein Backend.
