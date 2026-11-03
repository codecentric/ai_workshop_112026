## ADDED Requirements

### Requirement: Tageszähler anzeigen
Das System SHALL unter der Zeitanzeige die Anzahl der heute abgeschlossenen Pomodoros als "Heute: N Pomodoro(s)" anzeigen ("Pomodoro" bei N = 1).

#### Scenario: Erster Start des Tages
- **WHEN** die Seite an einem Tag ohne gespeicherte Daten geöffnet wird
- **THEN** zeigt das System "Heute: 0 Pomodoros"

### Requirement: Arbeitsphasen zählen
Das System SHALL den Zähler um 1 erhöhen, wenn eine Arbeitsphase regulär endet.

#### Scenario: Arbeitsphase läuft ab
- **WHEN** die Restzeit einer Arbeitsphase 0 erreicht
- **THEN** steigt der Zähler um genau 1

#### Scenario: Verspäteter Tick im Hintergrund-Tab
- **WHEN** der erste Tick nach Phasenende erst Minuten später eintrifft
- **THEN** steigt der Zähler um genau 1

#### Scenario: Pause, Pausenende und Reset
- **WHEN** der Nutzer pausiert, eine Pausenphase endet oder der Nutzer zurücksetzt
- **THEN** bleibt der Zähler unverändert

### Requirement: Zähler bleibt am selben Tag erhalten
Das System SHALL den Zähler im Browser speichern und am selben lokalen Kalendertag wiederherstellen.

#### Scenario: Neuladen
- **WHEN** die Seite am selben Tag neu geladen wird
- **THEN** zeigt das System den zuvor gespeicherten Wert

#### Scenario: Neuer Kalendertag
- **WHEN** der gespeicherte Tag nicht dem heutigen lokalen Kalendertag entspricht
- **THEN** zeigt das System 0 und beginnt neu bei 1

#### Scenario: Phase endet nach Mitternacht
- **WHEN** eine Arbeitsphase um 23:50 beginnt und um 00:15 endet
- **THEN** zählt sie für den neuen Tag

### Requirement: Fehlertoleranz
Das System SHALL bei nicht nutzbarem oder beschädigtem Speicher mit 0 starten und den Timer unbeeinträchtigt weiterlaufen lassen, ohne Fehlerdialog.

#### Scenario: Speicher blockiert
- **WHEN** `localStorage` beim Lesen oder Schreiben eine Ausnahme wirft
- **THEN** läuft der Timer weiter und der Zähler zählt bis zum Neuladen im Speicher weiter

#### Scenario: Beschädigte Daten
- **WHEN** der gespeicherte Wert kein gültiges JSON mit `day` und ganzzahligem `count >= 0` ist
- **THEN** wird er als 0 behandelt
