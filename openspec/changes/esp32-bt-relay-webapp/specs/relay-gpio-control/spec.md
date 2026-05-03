## MODIFIED Requirements

### Requirement: Relay GPIO control is command-driven
ESP32 relay GPIO pins SHALL be controlled by parsed commands from an input source (Bluetooth Serial) rather than a hardcoded loop.

#### Scenario: Command drives GPIO
- **WHEN** a valid relay command is received from any input source
- **THEN** the corresponding GPIO pin changes state within 10ms

#### Scenario: Active LOW support
- **WHEN** `RELAY_ACTIVE_LOW` is defined as `true`
- **THEN** relay ON state maps to GPIO LOW, OFF maps to GPIO HIGH

#### Scenario: Active HIGH support
- **WHEN** `RELAY_ACTIVE_LOW` is defined as `false`
- **THEN** relay ON state maps to GPIO HIGH, OFF maps to GPIO LOW
