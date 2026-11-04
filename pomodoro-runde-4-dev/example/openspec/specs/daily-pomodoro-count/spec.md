# daily-pomodoro-count Specification

## Purpose

Shows users a durable count of work phases completed on their current local calendar day.

## Requirements

### Requirement: Daily count is displayed
The system SHALL continuously display `Heute: X Pomodoros` below the countdown, where X is the number of completed work phases for the current local calendar day.

#### Scenario: Initial display with no completions today
- **WHEN** the user opens the timer and no completion has been stored for the current local day
- **THEN** the timer displays `Heute: 0 Pomodoros` below the countdown

#### Scenario: Displaying a stored count
- **WHEN** the user opens or reloads the timer and a count has been stored for the current local day
- **THEN** the timer displays the stored count below the countdown

### Requirement: Completed work phases are counted once
The system SHALL increment the daily count exactly once when an active 25-minute work phase completes, and SHALL assign that completion to the local calendar day of its scheduled completion time.

#### Scenario: Work phase completes
- **WHEN** an active work phase reaches its scheduled end time
- **THEN** the count for that local calendar day increases by one

#### Scenario: Delayed completion observation crosses midnight
- **WHEN** a work phase reaches its scheduled end before midnight but the browser observes the completion after midnight
- **THEN** the completion is counted for the local day on which the work phase was scheduled to end

#### Scenario: Completion is rendered repeatedly
- **WHEN** the timer renders again after a completed work phase has already been counted
- **THEN** the count is not incremented again

### Requirement: Non-completing phases are excluded
The system SHALL NOT increment the daily count for a break phase, a paused or reset work phase, a work phase abandoned by a page reload or browser closure, or any work phase that does not reach its scheduled end while the timer is active.

#### Scenario: Break phase completes
- **WHEN** an active break phase reaches its end time
- **THEN** the daily count remains unchanged

#### Scenario: Work phase is paused or reset
- **WHEN** the user pauses or resets an active work phase before its scheduled end time
- **THEN** the daily count remains unchanged

#### Scenario: Page is reopened after an active work phase
- **WHEN** the user reloads the page or reopens the browser after leaving a work phase active
- **THEN** the abandoned work phase is not counted retrospectively

### Requirement: Daily counts persist locally and expire by local day
The system SHALL store the daily count only in the local browser, preserve it across page reloads and browser restarts, and display zero when the stored day is not the device's current local calendar day.

#### Scenario: Browser restart
- **WHEN** the user reopens the timer in the same browser after a browser restart on the same local day
- **THEN** the timer displays the previously stored count for that day

#### Scenario: Local day changes
- **WHEN** the current local calendar day differs from the day associated with the stored count
- **THEN** the timer displays `Heute: 0 Pomodoros`

#### Scenario: Different browser or device
- **WHEN** the user opens the timer in another browser or on another device
- **THEN** no synchronization of the count is performed
