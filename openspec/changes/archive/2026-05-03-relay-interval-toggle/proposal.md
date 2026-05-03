## Why

`relayState` directly drives relay GPIO. Need interval-based toggling: when relay is "ON", it pulses at a configurable interval instead of staying on permanently. Enables timed switching without BLE client polling.

## What Changes

- `relayState[i]` becomes intent flag (ON = toggling active, OFF = relay forced off)
- `relayInterval[i]` sets toggle half-period in 100ms ticks (0 = no toggle, relay stays ON)
- `loop()` drives per-relay toggle timer logic
- BLE command extended to accept interval value: `CH1:ON:5` (optional, 0 = solid on)

## Capabilities

### New Capabilities
- `relay-interval-toggle`: Per-channel interval toggling — when channel is set ON with a non-zero interval, relay toggles on/off at that interval; zero interval keeps relay on solid

### Modified Capabilities
- (none)

## Impact

- `src/main.cpp`: `loop()`, `handleCommand()`, global state vars
- No new libraries needed
- No BLE UUID changes; command string format extended (backward-compatible: old `CH1:ON` still works)
