import { MODES } from '../constants';

export default function ModeSelector({ activeMode, onSelect }) {
  return <div className="mode-list" role="group" aria-label="Timer-Modus auswählen">
    {Object.entries(MODES).map(([key, { label }]) => (
      <button className="mode-button" type="button" key={key} aria-pressed={activeMode === key} onClick={() => onSelect(key)}>{label}</button>
    ))}
  </div>;
}
