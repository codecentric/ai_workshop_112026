import { fireEvent, render, screen } from '@testing-library/react';
import TimerControls from './TimerControls';

test('starts and resets an idle timer', () => {
  const start = jest.fn(); const pause = jest.fn(); const reset = jest.fn();
  render(<TimerControls isRunning={false} onStart={start} onPause={pause} onReset={reset} />);
  fireEvent.click(screen.getByRole('button', { name: 'Timer starten' }));
  fireEvent.click(screen.getByRole('button', { name: 'Timer zurücksetzen' }));
  expect(start).toHaveBeenCalledTimes(1);
  expect(pause).not.toHaveBeenCalled();
  expect(reset).toHaveBeenCalledTimes(1);
});

test('pauses a running timer', () => {
  const pause = jest.fn();
  render(<TimerControls isRunning onStart={jest.fn()} onPause={pause} onReset={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Timer pausieren' }));
  expect(pause).toHaveBeenCalledTimes(1);
});
