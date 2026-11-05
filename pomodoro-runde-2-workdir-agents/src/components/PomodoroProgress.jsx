export default function PomodoroProgress({ completedSessions }) {
  return <section className="progress" aria-label="Pomodoro-Fortschritt">
    <h2>Fokus-Fortschritt</h2>
    <p>{completedSessions} von 4 Sessions abgeschlossen</p>
    <div className="dots" aria-label={`${completedSessions} von 4 Fokus-Sessions abgeschlossen`}>
      {[0, 1, 2, 3].map((dot) => <span className={`dot ${dot < completedSessions ? 'completed' : ''}`} key={dot} aria-hidden="true" />)}
    </div>
  </section>;
}
