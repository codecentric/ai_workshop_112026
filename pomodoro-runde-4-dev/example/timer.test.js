const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DURATIONS_MS, createState, format, start, pause, reset, tick,
  dayKey, readCount, addPomodoro,
} = require('./timer.js');

test('format pads minutes and seconds', () => {
  assert.equal(format(5 * 1000), '00:05');
  assert.equal(format(DURATIONS_MS.work), '25:00');
});

test('format rounds up so 00:00 means elapsed', () => {
  assert.equal(format(1), '00:01');
  assert.equal(format(0), '00:00');
});

test('start sets endAt from now', () => {
  const s = start(createState(), 1000);
  assert.equal(s.endAt, 1000 + DURATIONS_MS.work);
});

test('start on a running timer changes nothing', () => {
  const running = start(createState(), 1000);
  assert.equal(start(running, 5000), running);
});

test('pause keeps the remaining time and resume continues from it', () => {
  const running = start(createState(), 0);
  const paused = pause(running, 60 * 1000);
  assert.equal(paused.remainingMs, DURATIONS_MS.work - 60 * 1000);
  assert.equal(paused.endAt, null);
  assert.equal(start(paused, 999999).endAt, 999999 + paused.remainingMs);
});

test('tick derives remaining time from the clock, not from the tick count', () => {
  const running = start(createState(), 0);
  // a throttled background tab ticks only once after 10 minutes
  const { state, phaseEnded } = tick(running, 10 * 60 * 1000);
  assert.equal(state.remainingMs, 15 * 60 * 1000);
  assert.equal(phaseEnded, false);
});

test('tick at the end switches to break and stops', () => {
  const running = start(createState(), 0);
  const { state, phaseEnded } = tick(running, DURATIONS_MS.work + 50);
  assert.equal(phaseEnded, true);
  assert.equal(state.mode, 'break');
  assert.equal(state.remainingMs, DURATIONS_MS.break);
  assert.equal(state.endAt, null);
});

test('break switches back to work', () => {
  const running = start(createState('break'), 0);
  assert.equal(tick(running, DURATIONS_MS.break).state.mode, 'work');
});

test('tick on a stopped timer does nothing', () => {
  const idle = createState();
  assert.deepEqual(tick(idle, 12345), { state: idle, phaseEnded: false });
});

test('reset returns to a fresh work phase', () => {
  assert.deepEqual(reset(), createState('work'));
});

// --- Session history (pomodoros completed today) ---

const local = (y, mo, d, h = 12, mi = 0) => new Date(y, mo - 1, d, h, mi).getTime();

test('tick reports which mode just ended', () => {
  const work = tick(start(createState('work'), 0), DURATIONS_MS.work);
  const brk = tick(start(createState('break'), 0), DURATIONS_MS.break);
  assert.equal(work.endedMode, 'work');
  assert.equal(brk.endedMode, 'break');
});

test('dayKey uses the local calendar day', () => {
  assert.equal(dayKey(local(2026, 10, 30, 0, 0)), '2026-10-30');
  assert.equal(dayKey(local(2026, 10, 30, 23, 59)), '2026-10-30');
  assert.equal(dayKey(local(2026, 1, 5)), '2026-01-05');
});

test('readCount is 0 without stored data', () => {
  assert.equal(readCount(null, '2026-10-30'), 0);
});

test('readCount returns the stored count for the same day', () => {
  const raw = JSON.stringify({ day: '2026-10-30', count: 3 });
  assert.equal(readCount(raw, '2026-10-30'), 3);
});

test('readCount is 0 on a new day', () => {
  const raw = JSON.stringify({ day: '2026-10-29', count: 3 });
  assert.equal(readCount(raw, '2026-10-30'), 0);
});

test('readCount is 0 for corrupt or invalid data', () => {
  for (const raw of ['not json', '{}', '[]', '{"day":"2026-10-30","count":-1}',
    '{"day":"2026-10-30","count":1.5}', '{"day":"2026-10-30","count":"2"}']) {
    assert.equal(readCount(raw, '2026-10-30'), 0, raw);
  }
});

test('addPomodoro increments within a day and returns the raw string to store', () => {
  const once = addPomodoro(null, '2026-10-30');
  assert.deepEqual(JSON.parse(once), { day: '2026-10-30', count: 1 });
  assert.equal(JSON.parse(addPomodoro(once, '2026-10-30')).count, 2);
});

test('addPomodoro starts at 1 on a new day', () => {
  const yesterday = JSON.stringify({ day: '2026-10-29', count: 7 });
  assert.deepEqual(JSON.parse(addPomodoro(yesterday, '2026-10-30')), { day: '2026-10-30', count: 1 });
});

test('addPomodoro recovers from corrupt data', () => {
  assert.equal(JSON.parse(addPomodoro('garbage', '2026-10-30')).count, 1);
});
