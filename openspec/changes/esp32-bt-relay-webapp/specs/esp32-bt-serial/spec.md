## ADDED Requirements

### Requirement: ESP32 advertises Bluetooth device name
ESP32 SHALL advertise as "ESP32-Relay" over Bluetooth Classic SPP so clients can discover and pair.

#### Scenario: Device discoverable
- **WHEN** ESP32 boots
- **THEN** it is visible in OS Bluetooth scan as "ESP32-Relay"

### Requirement: ESP32 accepts relay commands over BT serial
ESP32 SHALL receive ASCII commands over Bluetooth Serial and control relay GPIO pins accordingly.

#### Scenario: Valid ON command received
- **WHEN** client sends `CH1:ON\n` over BT serial
- **THEN** GPIO23 is set to relay-active state and ESP32 replies `OK:CH1:ON\n`

#### Scenario: Valid OFF command received
- **WHEN** client sends `CH1:OFF\n` over BT serial
- **THEN** GPIO23 is set to relay-inactive state and ESP32 replies `OK:CH1:OFF\n`

#### Scenario: Invalid command received
- **WHEN** client sends unrecognized command
- **THEN** ESP32 replies `ERR:UNKNOWN\n` and relay state is unchanged

### Requirement: 4-channel relay support
ESP32 SHALL support channels 1–4 mapped to GPIO23, GPIO22, GPIO21, GPIO19 respectively.

#### Scenario: All channels controllable
- **WHEN** client sends `CH2:ON\n`, `CH3:ON\n`, `CH4:ON\n`
- **THEN** GPIO22, GPIO21, GPIO19 activate respectively

### Requirement: Safe state on boot
ESP32 SHALL initialize all relay pins to OFF state on boot regardless of previous state.

#### Scenario: Boot state
- **WHEN** ESP32 powers on
- **THEN** all 4 relay channels are OFF before any BT command is received
