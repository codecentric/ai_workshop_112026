import { formatTime } from '../constants';

export default function TimerDisplay({ seconds }) {
  return <div className="timer-display" role="timer" aria-live="off" aria-label={`Verbleibende Zeit: ${formatTime(seconds)}`}>{formatTime(seconds)}</div>;
}
