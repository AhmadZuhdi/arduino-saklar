## ADDED Requirements

### Requirement: ConnectButton component
The system SHALL provide a button component that initiates BLE connection with device discovery.

#### Scenario: Initiate BLE connection
- **WHEN** user clicks Connect button
- **THEN** system shows BLE device picker and connects to selected device

#### Scenario: Disconnect on button click
- **WHEN** user clicks Disconnect button while connected
- **THEN** system gracefully closes BLE connection

### Requirement: RelayCard component
The system SHALL provide a card component for each relay channel with toggle button and status.

#### Scenario: Toggle relay ON
- **WHEN** user clicks relay toggle button in OFF state
- **THEN** button changes to ON state and sends CH<n>:ON command to ESP32

#### Scenario: Toggle relay OFF
- **WHEN** user clicks relay toggle button in ON state
- **THEN** button changes to OFF state and sends CH<n>:OFF command to ESP32

### Requirement: StatusIndicator component
The system SHALL display real-time connection status with visual indicator.

#### Scenario: Show connected state
- **WHEN** BLE device is successfully connected
- **THEN** status indicator shows green and displays "Connected"

#### Scenario: Show disconnected state
- **WHEN** BLE device is disconnected or connection fails
- **THEN** status indicator shows red and displays "Disconnected"

### Requirement: DebugLog component
The system SHALL display timestamped debug messages for connection, commands, and errors.

#### Scenario: Log command sent
- **WHEN** user sends relay command
- **THEN** debug log displays "[HH:MM:SS] [SEND] CH<n>:<action>"

#### Scenario: Log error
- **WHEN** command send fails
- **THEN** debug log displays error in red "[HH:MM:SS] [ERROR] <message>"

### Requirement: App component root
The system SHALL compose all UI components and manage BLE connection lifecycle.

#### Scenario: Initialize on mount
- **WHEN** React App component mounts
- **THEN** system checks Web Bluetooth API support and initializes UI

#### Scenario: Cleanup on unmount
- **WHEN** React App component unmounts
- **THEN** system gracefully disconnects BLE device
