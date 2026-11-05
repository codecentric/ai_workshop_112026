import { fireEvent, render, screen } from '@testing-library/react';
import ModeSelector from './ModeSelector';

test('shows all modes and reports the active mode', () => {
  const select = jest.fn();
  render(<ModeSelector activeMode="focus" onSelect={select} />);
  expect(screen.getByRole('button', { name: 'Fokus' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Lange Pause' }));
  expect(select).toHaveBeenCalledWith('longBreak');
});
