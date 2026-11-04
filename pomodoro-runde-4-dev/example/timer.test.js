const test = require('node:test');
const assert = require('node:assert/strict');
const { DURATIONS_MS, createState, format, start, pause, reset, tick } = require('./timer.js');

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
  const { state, phaseEnded, completedMode } = tick(running, DURATIONS_MS.work + 50);
  assert.equal(phaseEnded, true);
  assert.equal(completedMode, 'work');
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
