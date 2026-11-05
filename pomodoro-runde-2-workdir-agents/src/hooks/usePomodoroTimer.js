import { useCallback, useEffect, useRef, useState } from 'react';
import { MODES } from '../constants';

export function usePomodoroTimer(onComplete) {
  const [mode, setMode] = useState('focus');
  const [remainingSeconds, setRemainingSeconds] = useState(MODES.focus.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const intervalRef = useRef(null);
  const completionRef = useRef(onComplete);

  useEffect(() => { completionRef.current = onComplete; }, [onComplete]);
  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const pause = useCallback(() => { clearTimer(); setIsRunning(false); }, [clearTimer]);
  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setSessionComplete(false);
    setRemainingSeconds(MODES[mode].seconds);
  }, [clearTimer, mode]);
  const selectMode = useCallback((nextMode) => {
    clearTimer();
    setIsRunning(false);
    setSessionComplete(false);
    setMode(nextMode);
    setRemainingSeconds(MODES[nextMode].seconds);
  }, [clearTimer]);

  const start = useCallback(() => {
    if (isRunning || remainingSeconds === 0) return;
    setSessionComplete(false);
    setIsRunning(true);
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    if (!isRunning) return undefined;
    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds > 1) return seconds - 1;
        clearTimer();
        setIsRunning(false);
        setSessionComplete(true);
        if (mode === 'focus') setCompletedFocusSessions((count) => (count + 1) % 4);
        completionRef.current?.();
        return 0;
      });
    }, 1000);
    return clearTimer;
  }, [clearTimer, isRunning, mode]);

  useEffect(() => clearTimer, [clearTimer]);
  return { mode, remainingSeconds, isRunning, sessionComplete, completedFocusSessions, start, pause, reset, selectMode };
}
