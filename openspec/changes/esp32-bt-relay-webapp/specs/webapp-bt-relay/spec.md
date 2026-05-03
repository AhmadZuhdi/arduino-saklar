## ADDED Requirements

### Requirement: Webapp connects to ESP32 via Web Serial API
The webapp SHALL use the Web Serial API to connect to a paired ESP32 Bluetooth serial port.

#### Scenario: User connects
- **WHEN** user clicks "Connect" button in Chrome/Edge
- **THEN** browser shows port picker, user selects ESP32, connection established and button shows "Connected"

#### Scenario: Unsupported browser
- **WHEN** webapp is opened in a browser without Web Serial API support
- **THEN** webapp shows error message "Web Serial API not supported. Use Chrome or Edge."

### Requirement: Webapp sends relay ON/OFF commands
The webapp SHALL send ASCII relay commands to ESP32 when user clicks channel buttons.

#### Scenario: Relay ON button clicked
- **WHEN** user clicks "CH1 ON" button while connected
- **THEN** webapp sends `CH1:ON\n` over serial and updates button state to active

#### Scenario: Relay OFF button clicked
- **WHEN** user clicks "CH1 OFF" button while connected
- **THEN** webapp sends `CH1:OFF\n` over serial and updates button state to inactive

#### Scenario: Command sent while disconnected
- **WHEN** user clicks relay button while not connected
- **THEN** webapp shows "Not connected" message and does not send command

### Requirement: Webapp shows connection status
The webapp SHALL display current connection state at all times.

#### Scenario: Status updates on connect/disconnect
- **WHEN** connection state changes
- **THEN** status indicator updates immediately to reflect current state
