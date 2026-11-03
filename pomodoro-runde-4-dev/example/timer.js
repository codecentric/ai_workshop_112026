// Pure timer logic. No DOM, no Date.now(): the caller passes `now` in.
const DURATIONS_MS = { work: 25 * 60 * 1000, break: 5 * 60 * 1000 };

function createState(mode = 'work') {
  return { mode, remainingMs: DURATIONS_MS[mode], endAt: null };
}

function isRunning(state) {
  return state.endAt !== null;
}

function format(ms) {
  // ceil, so 00:00 only shows once the time has really elapsed
  const totalSeconds = Math.ceil(ms / 1000);
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function start(state, now) {
  if (isRunning(state)) return state; // double click must not restart
  return { ...state, endAt: now + state.remainingMs };
}

function pause(state, now) {
  if (!isRunning(state)) return state;
  return { ...state, remainingMs: Math.max(0, state.endAt - now), endAt: null };
}

function reset() {
  return createState('work');
}

// Returns the new state and whether a phase just ended.
function tick(state, now) {
  if (!isRunning(state)) return { state, phaseEnded: false };
  const remainingMs = Math.max(0, state.endAt - now);
  if (remainingMs > 0) return { state: { ...state, remainingMs }, phaseEnded: false };
  // Switch phase and wait for the user to start the next one.
  return {
    state: createState(state.mode === 'work' ? 'break' : 'work'),
    phaseEnded: true,
    endedMode: state.mode,
  };
}

// --- Session history: pomodoros completed today ---
// Persisted as a raw JSON string `{ day, count }`; the caller owns the storage.

// Local calendar day as YYYY-MM-DD ("today" means the user's wall clock, not UTC).
function dayKey(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Never throws: missing, corrupt or stale data counts as 0.
function parseRecord(raw) {
  try {
    const r = JSON.parse(raw);
    if (r && typeof r.day === 'string' && Number.isInteger(r.count) && r.count >= 0) return r;
  } catch {
    // fall through
  }
  return null;
}

function readCount(raw, today) {
  const r = parseRecord(raw);
  return r && r.day === today ? r.count : 0;
}

// Returns the new raw string to store.
function addPomodoro(raw, today) {
  return JSON.stringify({ day: today, count: readCount(raw, today) + 1 });
}

if (typeof module !== 'undefined') {
  module.exports = { DURATIONS_MS, createState, isRunning, format, start, pause, reset, tick, dayKey, readCount, addPomodoro };
}
