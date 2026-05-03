## 1. ESP32 Firmware

- [x] 1.1 Add `BluetoothSerial` include and instance to `src/main.cpp`
- [x] 1.2 Define GPIO pin mapping for 4 relay channels (GPIO23, 22, 21, 19)
- [x] 1.3 Add `#define RELAY_ACTIVE_LOW true` config flag
- [x] 1.4 Initialize all 4 relay pins as OUTPUT and set to OFF state in `setup()`
- [x] 1.5 Start BluetoothSerial with device name `ESP32-Relay` in `setup()`
- [x] 1.6 Implement command parser — read BT serial line, parse `CH<n>:ON` / `CH<n>:OFF`
- [x] 1.7 Implement `relaySet(channel, state)` function respecting `RELAY_ACTIVE_LOW`
- [x] 1.8 Send `OK:<cmd>\n` on valid command, `ERR:UNKNOWN\n` on invalid
- [x] 1.9 Build and upload firmware, verify "ESP32-Relay" appears in OS Bluetooth scan

## 2. Webapp

- [x] 2.1 Create `webapp/` directory in repo root
- [x] 2.2 Create `webapp/index.html` with Web Serial API check on load
- [x] 2.3 Add Connect/Disconnect button with status indicator
- [x] 2.4 Add 4-channel relay control buttons (CH1–CH4 ON/OFF each)
- [x] 2.5 Implement Web Serial connect logic — request port, open at 9600 baud
- [x] 2.6 Implement send command function — writes ASCII line to serial writer
- [x] 2.7 Disable relay buttons when disconnected, enable when connected
- [x] 2.8 Read and display responses from ESP32 in a status/log area

## 3. Integration Test

- [ ] 3.1 Pair ESP32 via OS Bluetooth settings
- [ ] 3.2 Open `webapp/index.html` in Chrome, connect via Web Serial port picker
- [ ] 3.3 Send CH1:ON — verify relay clicks and GPIO23 activates
- [ ] 3.4 Send CH1:OFF — verify relay releases
- [ ] 3.5 Test all 4 channels
- [ ] 3.6 Test invalid command — verify `ERR:UNKNOWN` returned
