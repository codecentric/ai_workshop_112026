# Proposal

## Why

Users currently lose visibility of their daily progress once a work phase ends. A persistent, local count of completed work phases makes that progress visible across page reloads and browser restarts without expanding the timer into a cross-device service.

## What Changes

- Display the number of Pomodoros completed on the device's current local calendar day below the countdown.
- Count a Pomodoro exactly once when an active 25-minute work phase completes; do not count breaks, paused work, resets, or abandoned work phases.
- Persist the daily count only in the browser and reset the displayed count to zero when the local calendar day changes.
- Use the scheduled work-phase completion time to assign a completion to its local day, including when a delayed browser tick observes the end after midnight.
- Do not restore or retrospectively count a work phase that was active when the page was reloaded or the browser was closed.

## Capabilities

### New Capabilities
- `daily-pomodoro-count`: Tracks and locally persists completed work phases for the current local calendar day.

### Modified Capabilities
- None.

## Impact

- Affects `index.html` for count rendering, browser-local persistence, and phase-completion handling.
- Adds a small dependency-free helper and Node tests for deterministic daily-count record and local-day handling.
- Affects `timer.js` and `timer.test.js` only as needed to expose or verify the completion information required to distinguish work phases from breaks.
- Adds no dependencies, server APIs, or cross-browser/device synchronization.
