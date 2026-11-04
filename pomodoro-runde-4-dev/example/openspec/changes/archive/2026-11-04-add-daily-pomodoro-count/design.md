# Design

## Context

The timer keeps a pure in-memory phase state in `timer.js`; `index.html` owns browser APIs, the interval, rendering, audio, and `Date.now()`. A completed phase is currently reported by `tick` as `phaseEnded`, then the UI stops the interval. See `proposal.md` for motivation and `specs/daily-pomodoro-count/spec.md` for required behavior.

## Goals / Non-Goals

**Goals:**
- Keep timer-domain functions deterministic and testable with supplied timestamps.
- Count only a completed work phase, once per completion event.
- Preserve the daily count through browser-local storage without adding dependencies.
- Determine the count's day from the phase's scheduled end time.

**Non-Goals:**
- Persisting or resuming the active timer state across a reload or browser restart.
- Recovering a completion missed while the page was closed.
- Synchronizing counts between browsers, profiles, or devices.
- Maintaining historical daily totals beyond the current displayed day.

## Decisions

### Separate deterministic daily-count rules from browser integration

`daily-count.js` contains pure functions for creating local calendar-day keys from supplied timestamps, reading valid current-day records, and creating updated records. Its companion `daily-count.test.js` verifies those rules with fixed timestamps and records. `timer.js` remains free of DOM, storage, `Date.now()`, and timer APIs.

`index.html` owns `localStorage`, DOM rendering, `Date.now()`, and wiring completion events to the helper. Storage access failures are caught in the UI layer so the timer continues running.

Alternative considered: adding persisted count data to timer state. Rejected because persistence and day boundaries are not timer-domain concerns, and it would enlarge the existing minimal timer-state contract.

### Identify a completed work phase from the pre-tick state

Before applying `tick`, the UI can retain the phase mode and `endAt`. When `tick` reports a phase end, it increments the stored daily count only if that pre-tick mode was `work`. This event is emitted once because `tick` returns a stopped state for the next phase.

Alternative considered: infer completion from the post-tick phase. Rejected because the post-tick mode has already switched and cannot distinguish a completed work phase from a completed break without reversing the transition.

### Date completions from the scheduled end time

The persisted record stores a local calendar-day key plus a numeric count. On a work completion, the day key comes from the pre-tick `endAt`, not from the delayed `onTick` invocation. On initial load and each render, a record with a non-current local day is treated as zero.

Alternative considered: use the current clock time when the interval detects completion. Rejected because throttled background tabs can detect an end after midnight and would assign it to the wrong day.

### Use one small local-storage record and recover safely

Store only a version-independent record containing the day key and count under a dedicated application key. Missing, malformed, or unavailable storage is treated as an empty count; storage failures are caught so the timer continues running.

Alternative considered: store a history keyed by date. Rejected because the capability only requires the current day's count and historical reporting would expand scope.

## Risks / Trade-offs

- [Browser storage can be unavailable, malformed, or cleared] -> Fall back to a zero in-memory display and ignore storage errors; timer operation remains unaffected.
- [The system clock or time zone changes during a session] -> Recompute the current local day when reading/rendering; no attempt is made to reconcile previously recorded counts with clock changes.
- [A tab is suspended] -> Count only the single completion exposed when it resumes; no active-timer persistence means closure or reload intentionally does not create a retrospective count.

## Migration Plan

No migration is required because this adds a new optional local-storage record. Deploying the static files enables the counter; removing or rolling back the change leaves any unused local record harmless.
