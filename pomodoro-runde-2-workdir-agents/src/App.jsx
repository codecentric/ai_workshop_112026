import { useCallback } from 'react';
import ModeSelector from './components/ModeSelector';
import PomodoroProgress from './components/PomodoroProgress';
import TimerControls from './components/TimerControls';
import TimerDisplay from './components/TimerDisplay';
import { MODES } from './constants';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';

function playSignal() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    oscillator.connect(context.destination);
    oscillator.frequency.value = 660;
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch { /* Browser may block audio until interaction. */ }
}

export default function App() {
  const onComplete = useCallback(playSignal, []);
  const timer = usePomodoroTimer(onComplete);
  const { mode, remainingSeconds, isRunning, sessionComplete, completedFocusSessions, start, pause, reset, selectMode } = timer;
  const currentMode = MODES[mode];
  return <main className="app-shell" style={{ '--accent': currentMode.accent }}>
    <article className="timer-card" aria-labelledby="app-title">
      <p className="eyebrow">Dein Fokus-Rhythmus</p>
      <h1 id="app-title">Pomodoro Timer</h1>
      <ModeSelector activeMode={mode} onSelect={selectMode} />
      <TimerDisplay seconds={remainingSeconds} />
      <p className={`status ${sessionComplete ? 'complete' : ''}`} role="status">{sessionComplete ? 'Session beendet — gut gemacht!' : `${currentMode.label} bereit`}</p>
      <TimerControls isRunning={isRunning} onStart={start} onPause={pause} onReset={reset} />
      <PomodoroProgress completedSessions={completedFocusSessions} />
    </article>
  </main>;
}
