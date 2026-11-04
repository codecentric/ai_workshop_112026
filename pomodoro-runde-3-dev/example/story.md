# User Story: Heutige Pomodoros anzeigen

Als Nutzer möchte ich jederzeit sehen, wie viele Pomodoros ich am heutigen lokalen Kalendertag vollständig abgeschlossen habe, damit ich meinen Fortschritt im Blick behalte.

## Akzeptanzkriterien

- Unter dem Countdown wird dauerhaft `Heute: X Pomodoros` angezeigt.
- Ein Pomodoro ist eine vollständig abgelaufene 25-Minuten-Arbeitsphase.
- Der Zähler erhöht sich genau einmal, wenn eine Arbeitsphase endet.
- Pausen werden nicht gezählt.
- Eine pausierte, zurückgesetzte oder vorzeitig abgebrochene Arbeitsphase wird nicht gezählt.
- „Heute“ bedeutet den lokalen Kalendertag des Geräts; an einem neuen Kalendertag beginnt der Zähler bei `0`.
- Der Zähler bleibt beim Neuladen der Seite und nach einem Browser-Neustart erhalten.
- Die Speicherung erfolgt ausschließlich lokal im Browser; eine Synchronisierung zwischen Geräten oder Browsern ist nicht Bestandteil dieser Story.
