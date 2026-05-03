## Context

ESP32 currently drives relay on GPIO23 via hardcoded firmware loop. Board: NodeMCU-32S, framework: Arduino. Relay board has 4 channels (IN1-IN4). Target: add Bluetooth Serial control so a webapp can send ON/OFF commands wirelessly. No WiFi router dependency.

## Goals / Non-Goals

**Goals:**
- ESP32 accepts relay commands over Bluetooth Classic SPP
- 4-channel relay control (GPIO23-26)
- Webapp connects via Web Bluetooth, sends commands, shows connection state
- Works from Chrome/Edge on desktop and Android

**Non-Goals:**
- WiFi-based control (separate concern)
- Mobile native app (Web Bluetooth sufficient)
- Authentication / pairing security beyond BT pairing
- Safari/Firefox support (no Web Bluetooth API)

## Decisions

### D1: Bluetooth Classic SPP vs BLE
**Decision:** Bluetooth Classic (BluetoothSerial library)
**Rationale:** Relay commands are simple ASCII strings. Classic SPP is simpler to implement on ESP32 Arduino. BLE GATT requires characteristic/service UUID setup and more complex webapp code.
**Alternative considered:** BLE — rejected due to complexity and Web Bluetooth BLE being less stable across browsers than Classic.

> **Note:** Web Bluetooth API in Chrome supports BLE, not Classic SPP. Classic SPP requires a native app or Chrome extension. This is a key risk — see Risks section.

### D2: Command Protocol
**Decision:** Simple ASCII over serial: `CH1:ON`, `CH1:OFF`, `CH2:ON` etc.
**Rationale:** Human-readable, easy to debug, no binary framing needed.

### D3: GPIO Pin Mapping
```
IN1 → GPIO23
IN2 → GPIO22
IN3 → GPIO21
IN4 → GPIO19
```
Avoids strapping pins (GPIO0, GPIO2, GPIO12, GPIO15).

### D4: Webapp Stack
**Decision:** Plain HTML + JS, no framework, served from `webapp/index.html`
**Rationale:** No build step, portable, works opened directly from filesystem in Chrome.

### D5: Web Bluetooth vs Serial API
**Decision:** Use **Web Serial API** instead of Web Bluetooth
**Rationale:** Web Bluetooth does NOT support Bluetooth Classic SPP — only BLE. Web Serial API supports USB serial AND Bluetooth Classic COM ports (when OS pairs the device). This is the correct API for SPP.
**Requirement:** User pairs ESP32 via OS Bluetooth settings first, then Web Serial sees it as a serial port.

## Risks / Trade-offs

- [Web Serial API limited to Chrome/Edge desktop] → Document requirement, no mitigation
- [ESP32 BT + WiFi conflict] → Don't use WiFi in this firmware build
- [Active LOW relay logic] → Invert GPIO output in firmware; configurable via `#define RELAY_ACTIVE_LOW`
- [Relay bounce on reconnect] → Initialize all relay pins to safe state (OFF) on boot

## Migration Plan

1. Update `src/main.cpp` — add BluetoothSerial, command parser, 4-channel GPIO
2. Create `webapp/index.html` — Web Serial connect + relay buttons
3. Test: pair ESP32 on OS, open Chrome, connect via Web Serial, send commands
4. Rollback: restore `src/main.cpp.uart.bak`

## Open Questions

- Active LOW or HIGH relay trigger? (currently jumper-selectable on board — default to configurable `#define`)
