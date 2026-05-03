## Why

Relay board is wired to ESP32 but currently controlled only via hardcoded firmware. A Bluetooth-connected webapp would allow wireless relay control from any phone or laptop without requiring WiFi infrastructure or re-flashing firmware.

## What Changes

- Enable Bluetooth Classic (Serial Profile) on ESP32 firmware
- ESP32 listens for relay commands over BT serial and drives GPIO pins accordingly
- New webapp (separate project) connects to ESP32 via Web Bluetooth API and sends relay ON/OFF commands

## Capabilities

### New Capabilities

- `esp32-bt-serial`: ESP32 firmware receives relay commands over Bluetooth Classic Serial (SPP), maps commands to GPIO23–GPIO26 (4 channels)
- `webapp-bt-relay`: Browser-based webapp using Web Bluetooth API to discover, connect, and send relay commands to ESP32

### Modified Capabilities

- `relay-gpio-control`: Existing GPIO toggle logic extended to support 4 channels driven by BT commands instead of hardcoded loop

## Impact

- `src/main.cpp`: Add BluetoothSerial, command parser, 4-channel GPIO control
- New project directory: `webapp/` — plain HTML/JS or React app
- Dependency: `BluetoothSerial` library (built-in with ESP32 Arduino core)
- Web Bluetooth API only works in Chrome/Edge (not Firefox/Safari)
- ESP32 Bluetooth Classic and WiFi cannot run simultaneously
