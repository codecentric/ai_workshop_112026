import { render, screen } from '@testing-library/react';
import PomodoroProgress from './PomodoroProgress';

test('renders visual and accessible focus progress', () => {
  const { container } = render(<PomodoroProgress completedSessions={2} />);
  expect(screen.getByText('2 von 4 Sessions abgeschlossen')).toBeInTheDocument();
  expect(screen.getByLabelText('2 von 4 Fokus-Sessions abgeschlossen')).toBeInTheDocument();
  expect(container.querySelectorAll('.dot.completed')).toHaveLength(2);
});
