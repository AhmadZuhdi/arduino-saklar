## ADDED Requirements

### Requirement: BLE Connection Context
The system SHALL manage global BLE connection state accessible to all components.

#### Scenario: Provide connection state
- **WHEN** any component reads from BLEContext
- **THEN** system provides current device, server, service, and connection status

#### Scenario: Update connection on device change
- **WHEN** user connects to a new device
- **THEN** context updates all state variables and notifies subscribed components

### Requirement: Relay State Management
The system SHALL track relay toggle state locally and sync with ESP32.

#### Scenario: Track local relay state
- **WHEN** user toggles relay button
- **THEN** system updates local state and derives button appearance

#### Scenario: Update state on command
- **WHEN** relay command succeeds
- **THEN** system updates relay state to match sent command

### Requirement: Debug Log State
The system SHALL maintain timestamped log entries accessible from any component.

#### Scenario: Add log entry
- **WHEN** connection event or command occurs
- **THEN** system appends timestamped entry to log array

#### Scenario: Scroll log to latest
- **WHEN** new log entry added and user hasn't scrolled up
- **THEN** debug log component auto-scrolls to bottom

### Requirement: Component Hooks
The system SHALL provide custom hooks for BLE operations (useBLE, useRelayState, useLog).

#### Scenario: Use BLE hook
- **WHEN** component calls useBLE()
- **THEN** hook returns connection methods (connect, disconnect, sendCommand)

#### Scenario: Use Relay State hook
- **WHEN** component calls useRelayState(channel)
- **THEN** hook returns current state and toggle function for that channel
