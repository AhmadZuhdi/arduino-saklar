## Context

Single-file Arduino firmware on ESP32. `loop()` previously used `delay(100)` — this blocks all relays to same 100ms cadence, making independent per-relay timing impossible. Four relay channels, each with `relayState[i]` (intent) and `relayInterval[i]` (toggle half-period in ms).

## Goals / Non-Goals

**Goals:**
- When `relayState[i] = 1` and `relayInterval[i] > 0`: relay toggles on/off every `relayInterval[i]` ms, independently of other channels
- When `relayState[i] = 1` and `relayInterval[i] = 0`: relay stays ON solid
- When `relayState[i] = 0`: relay forced OFF, timer reset
- BLE command optionally sets interval in ms: `CH1:ON:500` → 500ms half-period
- All 4 relays run simultaneously with different periods without mutual interference

**Non-Goals:**
- Sub-1ms resolution
- Asymmetric on/off durations
- Persisting state across resets

## Decisions

**D1: millis()-based non-blocking timer per relay**
Replace `delay(100)` with `millis()` comparison. Add `uint32_t relayLastToggle[4]` timestamps. Each loop iteration checks `millis() - relayLastToggle[i] >= relayInterval[i]` independently per channel. No delay in loop(). Chosen over FreeRTOS `xTimerCreate()` — simpler, no RTOS API surface, canonical Arduino pattern, zero cross-channel coupling.

**D2: relayInterval type → uint16_t, unit = milliseconds**
`uint8_t` ticks (0–255 × 100ms) replaced by `uint16_t` ms (0–65535ms). More intuitive for BLE client (send `500` for 500ms). Slightly larger BLE payload per command — acceptable.

**D3: relayInterval set via extended BLE command**
`CH1:ON:N` where N is decimal ms value. Parse after second `:` using `atoi()`. If absent, interval unchanged. Alternative (separate characteristic) rejected — extra UUID, more BLE surface.

**D4: Physical GPIO state tracked separately from intent**
Add `bool relayPhysical[4]` to track actual pin output for toggling. `relayState` = intent, `relayPhysical` = current physical output. Clean separation, avoids reading GPIO pin state.

## Risks / Trade-offs

- `millis()` overflows at ~49 days → unsigned arithmetic wraps correctly, no issue
- Min useful interval ~50ms (relay mechanical response) → Document min recommended ~100ms
- BLE `onWrite` callback vs loop() on same Arduino core — `uint16_t` write not atomic on 8-bit MCU, but ESP32 is 32-bit; 16-bit write is atomic → No mutex needed
- Removing `delay()` increases loop() call frequency → negligible CPU impact, BLE stack has its own task
