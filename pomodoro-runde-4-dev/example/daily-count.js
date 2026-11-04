// Pure daily-count rules; browser storage is handled by the UI.
function getDayKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentCount(record, now) {
  if (!record || record.day !== getDayKey(now) || !Number.isInteger(record.count) || record.count < 0) {
    return 0;
  }
  return record.count;
}

function recordCompletion(record, completedAt) {
  const day = getDayKey(completedAt);
  const count = record && record.day === day && Number.isInteger(record.count) && record.count >= 0
    ? record.count + 1
    : 1;
  return { day, count };
}

if (typeof module !== 'undefined') {
  module.exports = { getDayKey, getCurrentCount, recordCompletion };
}
