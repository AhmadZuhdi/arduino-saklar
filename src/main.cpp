#include <Arduino.h>
#include <BluetoothSerial.h>

// ── Config ────────────────────────────────────────────────────────────────────
#define RELAY_ACTIVE_LOW false   // true = LOW triggers relay ON

// ── GPIO pin mapping (4 channels) ────────────────────────────────────────────
const uint8_t RELAY_PINS[4] = {23, 22, 21, 19}; // CH1–CH4

// ── Bluetooth ─────────────────────────────────────────────────────────────────
BluetoothSerial BT;
String btBuffer = "";
bool btConnected = false;
unsigned long lastHeartbeat = 0;

// ── BT connection callback ──────────────────────────────────────────────────────
void btCallback(esp_spp_cb_event_t event, esp_spp_cb_param_t *param) {
  if (event == ESP_SPP_SRV_OPEN_EVT) {
    Serial.println("[BT] ✓ CLIENT CONNECTED (callback)");
    btConnected = true;
  } else if (event == ESP_SPP_CLOSE_EVT) {
    Serial.println("[BT] ✗ CLIENT DISCONNECTED (callback)");
    btConnected = false;
  }
}

// ── Relay control ─────────────────────────────────────────────────────────────
void relaySet(uint8_t channel, bool on) {
  if (channel < 1 || channel > 4) return;
  uint8_t pin = RELAY_PINS[channel - 1];
#if RELAY_ACTIVE_LOW
  digitalWrite(pin, on ? LOW : HIGH);
#else
  digitalWrite(pin, on ? HIGH : LOW);
#endif
  Serial.printf("[Relay] CH%d %s (GPIO%d)\n", channel, on ? "ON" : "OFF", pin);
}

// ── Command parser ────────────────────────────────────────────────────────────
void handleCommand(const String& cmd) {
  // Expected format: CH<n>:ON or CH<n>:OFF
  Serial.printf("[BT] Raw bytes: ");
  for (int i = 0; i < cmd.length(); i++) {
    Serial.printf("%02X ", (uint8_t)cmd[i]);
  }
  Serial.printf("(len=%d)\n", cmd.length());

  if (cmd.startsWith("CH") && cmd.length() >= 6) {
    int ch = cmd.substring(2, 3).toInt();
    String action = cmd.substring(4); // after ":"

    Serial.printf("[BT] Parse: channel=%d, action='%s'\n", ch, action.c_str());

    if (ch >= 1 && ch <= 4) {
      if (action == "ON") {
        Serial.printf("[BT] ✓ Valid command CH%d:ON\n", ch);
        relaySet(ch, true);
        BT.printf("OK:%s\n", cmd.c_str());
        return;
      } else if (action == "OFF") {
        Serial.printf("[BT] ✓ Valid command CH%d:OFF\n", ch);
        relaySet(ch, false);
        BT.printf("OK:%s\n", cmd.c_str());
        return;
      }
    }
  }
  Serial.printf("[BT] ✗ Invalid command format: '%s'\n", cmd.c_str());
  BT.println("ERR:UNKNOWN");
}

void setup() {
  Serial.begin(9600);

  // Init relay pins — all OFF on boot
  for (int i = 0; i < 4; i++) {
    pinMode(RELAY_PINS[i], OUTPUT);
    relaySet(i + 1, false);
  }

  // Start Bluetooth
  Serial.println("[BT] Initializing BluetoothSerial...");
  BT.register_callback(&btCallback);
  BT.begin("ESP32-Relay");
  Serial.println("[BT] ✓ Started as 'ESP32-Relay'");
  Serial.println("[BT] Waiting for client connection...");
}

void loop() {
  // Periodic heartbeat to test if BT is actually functional
  unsigned long now = millis();
  if (now - lastHeartbeat > 5000) {
    lastHeartbeat = now;
    Serial.printf("[BT] Heartbeat: connected=%d, available=%d\n", 
                  btConnected, BT.available());
    if (btConnected) {
      BT.println("[ESP] Heartbeat");
    }
  }

  // Read BT serial line by line
  // NOTE: Process data REGARDLESS of btConnected state
  // (callback may not fire reliably)
  if (BT.available()) {
    Serial.printf("[BT] Data available! Reading...\n");
    while (BT.available()) {
      char c = BT.read();
      Serial.printf("[BT] Byte in: 0x%02X (%c)\n", (uint8_t)c, c);
      if (c == '\n' || c == '\r') {
        btBuffer.trim();
        if (btBuffer.length() > 0) {
          Serial.printf("[BT] ✓ Complete line received (%d chars)\n", btBuffer.length());
          handleCommand(btBuffer);
          btBuffer = "";
        }
      } else {
        btBuffer += c;
      }
    }
  }
}
