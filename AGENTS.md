# AGENTS.md

## Project

PlatformIO firmware for **NodeMCU-32S** (ESP32). Framework: Arduino. Single source file: `src/main.cpp`.

## Commands

```sh
# Build
pio run

# Upload to board (auto-detects port)
pio run --target upload

# Serial monitor (9600 baud, matches Serial.begin in main.cpp)
pio device monitor --baud 9600

# Build + upload in one step
pio run --target upload && pio device monitor --baud 9600

# Run native unit tests (test/ dir currently empty)
pio test
```

## Key facts

- Target env name: `nodemcu-32s` — pass `-e nodemcu-32s` if running multi-env commands.
- No extra libraries declared in `platformio.ini` yet. Add under `lib_deps =` in `[env:nodemcu-32s]`.
- `lib/` and `include/` are empty stubs. Local libraries go in `lib/<LibName>/`, shared headers in `include/`.
- Upload port auto-detected; if multiple devices connected use `--upload-port /dev/cu.usbserial-XXXX`.
- No linter, formatter, or CI config present.
