# Tasks

## 1. Completion-event coverage

- [x] 1.1 Add a failing `timer.test.js` test that verifies the phase-completion result retains the completed phase information needed to distinguish work from break, then verify `node --test` fails for that test.
- [x] 1.2 Extend the pure timer completion result in `timer.js` without adding browser APIs, and verify the new and existing `node --test` cases pass.

## 2. Daily count persistence and UI

- [x] 2.1 Add failing `daily-count.test.js` tests for reading a current-day local count, treating an expired or malformed record as zero, and attributing a delayed completion to its scheduled end day; verify `node --test` fails before implementation.
- [x] 2.2 Add the dependency-free `daily-count.js` helper and make its new and existing Node tests pass.
- [x] 2.3 Add the count display and browser-local read/write handling in `index.html`, safely ignoring storage failures, and update `onTick` to increment and persist exactly once only for a completed work phase using its pre-tick scheduled end time; verify reload-safe same-day display, zero after a local-day change, and that breaks, pauses, resets, and reload-abandoned work phases do not change the count.

## 3. Integration verification

- [x] 3.1 Run `node --test` and verify all timer and daily-count tests pass.
- [x] 3.2 Open `index.html` directly and verify `Heute: X Pomodoros` is visible below the countdown, increments once after a completed work phase, survives a same-day reload, and does not increment after a completed break.
