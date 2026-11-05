import { render, screen } from '@testing-library/react';
import TimerDisplay from './TimerDisplay';

test('formats remaining seconds as MM:SS', () => {
  render(<TimerDisplay seconds={65} />);
  expect(screen.getByRole('timer')).toHaveTextContent('01:05');
  expect(screen.getByRole('timer')).toHaveAccessibleName('Verbleibende Zeit: 01:05');
});
