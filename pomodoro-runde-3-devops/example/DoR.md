# Definition of Ready (Basis)

Eine Story ist "ready" (bereit für Spec Driven Development / die nächste Runde), wenn sie folgende Kriterien erfüllt:

- [ ] User, Feature und Nutzen klar benannt
- [ ] Mindestens 3 konkrete Akzeptanzkriterien
- [ ] Keine undefinierten Begriffe (z. B. "schnell", "einfach", "besser")
- [ ] Keine impliziten Annahmen über Technik oder Plattform
- [ ] Story ist in einem Sprint umsetzbar (nicht zu groß)

## Unsere Ergänzungen

- [ ] Exit-Codes und Ausgabe sind festgelegt (welcher Code für gesund, ungesund, falsche Bedienung; was auf stdout, was auf stderr), sodass CI das Script ohne Interpretation einbinden kann.
- [ ] Die Story ist ohne Zugriff auf Produktivsysteme testbar (lokaler Testserver oder Fake), und das Script gibt keine Secrets in Logs aus.
