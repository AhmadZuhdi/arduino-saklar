## ADDED Requirements

### Requirement: Relay toggles independently when interval is non-zero
When a channel is set ON with a non-zero `relayInterval[i]`, the physical relay output SHALL toggle (on→off→on) every `relayInterval[i]` milliseconds. Each channel SHALL toggle independently — concurrent channels with different intervals SHALL NOT interfere with each other.

#### Scenario: Relay toggles at configured interval
- **WHEN** `relayState[i] = 1` and `relayInterval[i] = 500`
- **THEN** relay GPIO toggles every 500ms

#### Scenario: Two relays run simultaneously with different intervals
- **WHEN** CH1 has `relayInterval = 300` and CH2 has `relayInterval = 700`, both ON
- **THEN** CH1 toggles every 300ms and CH2 toggles every 700ms simultaneously without phase drift caused by either channel

#### Scenario: First physical state is ON when toggling starts
- **WHEN** channel transitions from OFF to ON with non-zero interval
- **THEN** relay GPIO goes to active state immediately, then toggles after first interval elapses

### Requirement: Relay stays ON when interval is zero
When a channel is set ON with `relayInterval[i] = 0`, the relay SHALL remain in ON state continuously — no toggling.

#### Scenario: Solid ON with zero interval
- **WHEN** `relayState[i] = 1` and `relayInterval[i] = 0`
- **THEN** relay GPIO stays ON permanently until channel set OFF

### Requirement: Relay forced OFF when channel disabled
When `relayState[i] = 0`, relay GPIO SHALL be forced OFF and the per-relay toggle timestamp SHALL reset.

#### Scenario: Toggle stops on OFF command
- **WHEN** channel is toggling and receives OFF command
- **THEN** relay GPIO goes OFF and `relayLastToggle[i]` resets

### Requirement: BLE command accepts optional interval parameter in milliseconds
The BLE command format SHALL support an optional third field for interval in ms: `CHn:ON:N` where N is a decimal uint16 millisecond value. If omitted, existing `relayInterval[i]` is unchanged.

#### Scenario: Command with interval sets interval in ms
- **WHEN** BLE receives `CH2:ON:500`
- **THEN** `relayInterval[1] = 500` and channel 2 starts toggling at 500ms half-period

#### Scenario: Command without interval preserves existing interval
- **WHEN** BLE receives `CH2:ON` (no third field)
- **THEN** `relayInterval[1]` unchanged, channel 2 activates with existing interval

#### Scenario: OFF command ignores interval field
- **WHEN** BLE receives `CH2:OFF`
- **THEN** channel 2 goes OFF, interval value preserved in memory
