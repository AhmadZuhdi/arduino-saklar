## 1. State Variables

- [x] 1.1 Change `relayInterval[4]` type from `uint8_t` to `uint16_t` (ms values, 0–65535)
- [x] 1.2 Add `bool relayPhysical[4] = {false, false, false, false}` global — tracks actual GPIO output
- [x] 1.3 Add `uint32_t relayLastToggle[4] = {0, 0, 0, 0}` global — millis() timestamp per relay
- [x] 1.4 Remove `relayTick` (no longer needed — millis replaces tick counter)
- [x] 1.5 Fix `relayOn[i]` undeclared variable in `setup()` — remove those lines

## 2. BLE Command Parsing

- [x] 2.1 In `handleCommand()`, remove direct `digitalWrite` calls — routing through new `applyRelay()` helper instead
- [x] 2.2 Parse optional third field after second `:` using `atoi()` for interval ms value
- [x] 2.3 On `CHn:ON:N` — set `relayInterval[ch-1] = (uint16_t)N`, set `relayState[ch-1] = 1`, set `relayPhysical[ch-1] = true`, call `applyRelay()`, set `relayLastToggle[ch-1] = millis()`
- [x] 2.4 On `CHn:ON` (no interval) — set `relayState[ch-1] = 1`, set `relayPhysical[ch-1] = true`, call `applyRelay()`, set `relayLastToggle[ch-1] = millis()`
- [x] 2.5 On `CHn:OFF` — set `relayState[ch-1] = 0`, set `relayPhysical[ch-1] = false`, call `applyRelay()`, reset `relayLastToggle[ch-1] = 0`

## 3. GPIO Helper

- [x] 3.1 Add `void applyRelay(int i, bool on)` — writes GPIO respecting `RELAY_ACTIVE_LOW` flag

## 4. Non-blocking loop()

- [x] 4.1 Remove `delay(100)` from `loop()`
- [x] 4.2 For each channel `i`: skip if `relayState[i] == 0` or `relayInterval[i] == 0`
- [x] 4.3 For toggling channels: if `millis() - relayLastToggle[i] >= relayInterval[i]` → flip `relayPhysical[i]`, call `applyRelay(i, relayPhysical[i])`, update `relayLastToggle[i] = millis()`

## 5. Build & Verify

- [x] 5.1 Run `pio run` — confirm zero errors and zero warnings
- [ ] 5.2 Manual test: set two channels with different intervals, verify independent toggling
