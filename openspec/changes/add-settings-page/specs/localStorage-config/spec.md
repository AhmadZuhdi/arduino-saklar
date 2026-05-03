## ADDED Requirements

### Requirement: Save and load config
The system SHALL persist relay names and device name to browser localStorage.

#### Scenario: Save config
- **WHEN** user updates settings
- **THEN** system stores config object to localStorage key "relayConfig"

#### Scenario: Load config on startup
- **WHEN** app initializes
- **THEN** system loads config from localStorage and applies defaults if missing

### Requirement: Config structure
The system SHALL maintain config with relay names and device name.

#### Scenario: Config contains relay names
- **WHEN** user views or loads config
- **THEN** config includes array of 4 relay name strings

#### Scenario: Config contains device name
- **WHEN** user views or loads config
- **THEN** config includes deviceName string for BLE filter
