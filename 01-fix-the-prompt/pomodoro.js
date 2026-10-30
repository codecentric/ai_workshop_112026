#!/usr/bin/env node

const args = process.argv.slice(2);
const WORK_MIN = parseFloat(args[0]) || 1;
const BREAK_MIN = parseFloat(args[1]) || 1;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function runTimer(label, minutes) {
  return new Promise((resolve) => {
    let remaining = minutes * 60;
    process.stdout.write(`\n${label} — ${formatTime(remaining)}`);

    const interval = setInterval(() => {
      remaining--;
      process.stdout.write(`\r${label} — ${formatTime(remaining)}`);
      if (remaining <= 0) {
        clearInterval(interval);
        process.stdout.write('\n');
        resolve();
      }
    }, 1000);
  });
}

async function main() {
  let session = 1;
  console.log(`Pomodoro Timer — work: ${WORK_MIN}m, break: ${BREAK_MIN}m — Ctrl+C to stop\n`);

  while (true) {
    await runTimer(`Work #${session}`, WORK_MIN);
    console.log('\x07Session done! Take a break.');
    await runTimer('Break', BREAK_MIN);
    console.log('\x07Break over! Back to work.');
    session++;
  }
}

main();
