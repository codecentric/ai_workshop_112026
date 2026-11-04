const test = require('node:test');
const assert = require('node:assert/strict');
const { getCurrentCount, recordCompletion } = require('./daily-count.js');

const TODAY = new Date(2026, 10, 4, 12, 0, 0).getTime();

test('reads a stored count for the current local day', () => {
  const record = { day: '2026-11-04', count: 3 };

  assert.equal(getCurrentCount(record, TODAY), 3);
});

test('treats expired or malformed records as zero', () => {
  assert.equal(getCurrentCount({ day: '2026-11-03', count: 3 }, TODAY), 0);
  assert.equal(getCurrentCount({ day: '2026-11-04', count: '3' }, TODAY), 0);
  assert.equal(getCurrentCount(null, TODAY), 0);
});

test('records a delayed completion on its scheduled end day', () => {
  const scheduledEnd = new Date(2026, 10, 3, 23, 59, 0).getTime();
  const observedAfterMidnight = new Date(2026, 10, 4, 0, 5, 0).getTime();

  assert.ok(observedAfterMidnight > scheduledEnd);
  assert.deepEqual(recordCompletion({ day: '2026-11-03', count: 2 }, scheduledEnd), {
    day: '2026-11-03',
    count: 3,
  });
});
