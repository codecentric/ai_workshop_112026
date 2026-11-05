import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { MODES } from './constants';

beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.runOnlyPendingTimers(); jest.useRealTimers(); });

test('supports selecting modes, starting, pausing, and resetting', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Kurze Pause' }));
  expect(screen.getByRole('timer')).toHaveTextContent('05:00');
  fireEvent.click(screen.getByRole('button', { name: 'Timer starten' }));
  act(() => jest.advanceTimersByTime(2000));
  expect(screen.getByRole('timer')).toHaveTextContent('04:58');
  fireEvent.click(screen.getByRole('button', { name: 'Timer pausieren' }));
  act(() => jest.advanceTimersByTime(2000));
  expect(screen.getByRole('timer')).toHaveTextContent('04:58');
  fireEvent.click(screen.getByRole('button', { name: 'Timer zurücksetzen' }));
  expect(screen.getByRole('timer')).toHaveTextContent('05:00');
});

test('clears a running timer when selecting a different mode', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Timer starten' }));
  fireEvent.click(screen.getByRole('button', { name: 'Lange Pause' }));
  act(() => jest.advanceTimersByTime(2000));
  expect(screen.getByRole('timer')).toHaveTextContent('15:00');
});

test('ends focus sessions, plays a signal, and cycles the progress after four sessions', () => {
  const originalSeconds = MODES.focus.seconds;
  const originalAudioContext = window.AudioContext;
  const oscillator = { connect: jest.fn(), start: jest.fn(), stop: jest.fn(), frequency: { value: 0 } };
  window.AudioContext = jest.fn(() => ({ createOscillator: () => oscillator, destination: {}, currentTime: 1 }));
  MODES.focus.seconds = 1;
  render(<App />);

  for (let session = 0; session < 4; session += 1) {
    fireEvent.click(screen.getByRole('button', { name: 'Timer starten' }));
    act(() => jest.advanceTimersByTime(1000));
    expect(screen.getByText('Session beendet — gut gemacht!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Timer zurücksetzen' }));
  }

  expect(screen.getByText('0 von 4 Sessions abgeschlossen')).toBeInTheDocument();
  expect(oscillator.start).toHaveBeenCalledTimes(4);
  MODES.focus.seconds = originalSeconds;
  window.AudioContext = originalAudioContext;
});
