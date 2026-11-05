export const MODES = {
  focus: { label: 'Fokus', seconds: 25 * 60, accent: '#e96b63' },
  shortBreak: { label: 'Kurze Pause', seconds: 5 * 60, accent: '#40a6b7' },
  longBreak: { label: 'Lange Pause', seconds: 15 * 60, accent: '#8171c7' },
};

export const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
