## ADDED Requirements

### Requirement: Settings page form
The system SHALL display form with editable relay names and device name.

#### Scenario: User updates relay name
- **WHEN** user types in relay name input
- **THEN** input value updates in real-time

#### Scenario: Save settings
- **WHEN** user changes name and navigates away
- **THEN** settings persist to localStorage

### Requirement: Relay name list
The system SHALL display 4 inputs for relay names (CH1-CH4).

#### Scenario: Display current names
- **WHEN** settings page loads
- **THEN** inputs show saved relay names or defaults ("Channel 1-4")

### Requirement: Device name config
The system SHALL allow user to set BLE device name to search for.

#### Scenario: Change device name
- **WHEN** user edits device name input and saves
- **THEN** next BLE search uses new device name
