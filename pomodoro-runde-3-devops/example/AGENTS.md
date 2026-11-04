# Tech-Stack
Node.js >= 20, CommonJS, keine externen Dependencies, Tests mit `node --test`.

# Schnittstelle
Exit-Code 0 = Erfolg, 1 = fachlicher/technischer Fehler, 2 = ungültige Eingabe.
Ergebnis nach stdout; Fortschritt, Diagnose und Usage nach stderr.

# CLI- und Betriebsregeln
- Kommandozeilenprogramme validieren ihre Argumente vollständig und akzeptieren nur die dokumentierte Syntax. Bei ungültiger Eingabe bleibt `stdout` frei von Ergebnisdaten, Usage wird nach `stderr` geschrieben und der Prozess endet mit Exit-Code `2`.
- Erfolgreiche Verarbeitung endet mit Exit-Code `0`; fachliche oder technische Fehler mit Exit-Code `1`.
- Maschinenlesbare Ergebnisdaten werden ausschließlich nach `stdout` geschrieben. Status-, Fortschritts- und Diagnosemeldungen gehören nach `stderr`.
- Strukturierte Ergebnisse verwenden ein dokumentiertes, stabiles Schema. Fehlergründe sind knapp, für die automatische Auswertung geeignet und unabhängig von internen Fehlermeldungen.
- Netzwerkzugriffe müssen ein definiertes Timeout haben und Verbindungs-, Timeout- sowie unvollständige oder ungültige Antworten eindeutig behandeln.
- Neue Funktionen werden mit lokalen, reproduzierbaren Tests abgesichert. Externe Systeme werden in Tests durch lokale Server, Fakes oder Mocks ersetzt.

# Sicherheit und Betrieb
Keine Secrets oder vollständigen Eingabewerte in Logs. Keine Produktiv- oder
Staging-Zugriffe für Tests; Netzwerk nur nach expliziter Freigabe.
