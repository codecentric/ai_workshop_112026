export default function TimerControls({ isRunning, onStart, onPause, onReset }) {
  return <div className="controls">
    <button className="primary-button" type="button" onClick={isRunning ? onPause : onStart} aria-label={isRunning ? 'Timer pausieren' : 'Timer starten'}>{isRunning ? 'Pausieren' : 'Starten'}</button>
    <button className="secondary-button" type="button" onClick={onReset} aria-label="Timer zurücksetzen" title="Timer zurücksetzen">↺</button>
  </div>;
}
