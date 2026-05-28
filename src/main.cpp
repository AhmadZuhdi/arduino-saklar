#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <Preferences.h>

// ── Config ────────────────────────────────────────────────────────────────────
#define RELAY_ACTIVE_LOW false
#define DEVICE_NAME "ESP32-Relay"

Preferences preferences;

// ── GPIO pins ─────────────────────────────────────────────────────────────────
const uint8_t RELAY_PINS[4] = {23, 22, 19, 18};

// ── BLE UUIDs ─────────────────────────────────────────────────────────────────
#define SERVICE_UUID "0000180a-0000-1000-8000-00805f9b34fb"
#define CHAR_CMD_UUID "00002a19-0000-1000-8000-00805f9b34fb"

// ── BLE objects ───────────────────────────────────────────────────────────────
BLEServer *pServer = NULL;
BLECharacteristic *pCharCmd = NULL;
bool deviceConnected = false;

// ── Relay state ───────────────────────────────────────────────────────────────
uint8_t  relayState[4]       = {0, 0, 0, 0};       // intent: 1=on, 0=off
uint16_t relayInterval[4]    = {100, 0, 0, 0};       // toggle half-period ms (0=solid on, default)
bool     relayPhysical[4]    = {false, false, false, false}; // actual GPIO state
uint32_t relayLastToggle[4]  = {0, 0, 0, 0};       // millis() of last toggle

// -- optocoupler
const int optoPin = 21; // Pin connected to PC817 Collector

// ── Forward declarations ───────────────────────────────────────────────────────
void handleCommand(const std::string &cmd);
void applyRelay(int i, bool on);
void readConfig();
void saveConfig();
void changeRelayState(int ch, bool on);

// ── GPIO helper ───────────────────────────────────────────────────────────────
void applyRelay(int i, bool on) {
#if RELAY_ACTIVE_LOW
  digitalWrite(RELAY_PINS[i], on ? LOW : HIGH);
#else
  digitalWrite(RELAY_PINS[i], on ? HIGH : LOW);
#endif
}

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) override {
    Serial.println("[BLE] Client connected");
    deviceConnected = true;
  }
  void onDisconnect(BLEServer *pServer) override {
    Serial.println("[BLE] Client disconnected");
    deviceConnected = false;
    pServer->getAdvertising()->start();
  }
};

class CommandCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override {
    std::string value = pCharacteristic->getValue();
    if (value.length() > 0) {
      Serial.printf("[CMD] Received %d bytes: ", value.length());
      for (size_t i = 0; i < value.length(); i++) {
        Serial.printf("%02X ", (uint8_t)value[i]);
      }
      Serial.println();
      handleCommand(value);
    }
  }
};

void changeRelayState(int ch, bool on) {
  relayState[ch]      = on ? 1 : 0;
  relayPhysical[ch]   = on;
  relayLastToggle[ch] = on ? millis() : 0;
  applyRelay(ch, on);
}

void handleCommand(const std::string &cmd) {
  if (cmd.length() < 3) return;

  // Handle CONFIG command: "CONFIG:CHn:interval=N"
  if (cmd.substr(0, 6) == "CONFIG") {
    Serial.printf("[CONFIG] Parsing: %s\n", cmd.c_str());
    // Example: "CONFIG:CH1:interval=5000"
    size_t ch_pos = cmd.find("CH");
    if (ch_pos != std::string::npos) {
      int ch = cmd[ch_pos + 2] - '0';
      if (ch >= 1 && ch <= 4) {
        size_t eq_pos = cmd.find('=');
        if (eq_pos != std::string::npos) {
          preferences.begin("saklar", false);
          unsigned int oldValue = preferences.getUInt(("relayMs" + String(ch)).c_str(), relayInterval[ch - 1]);
          uint16_t intervalVal = (uint16_t)atoi(cmd.c_str() + eq_pos + 1);
          relayInterval[ch - 1] = intervalVal;
          Serial.printf("[CONFIG] CH%d interval set to %u ms\n", ch, intervalVal);
          if (oldValue != intervalVal) {
            preferences.putUInt(("relayMs" + String(ch)).c_str(), intervalVal);
            Serial.println("[CONFIG] Configuration saved");
          }
        }
      }
    }

    return;
  }

  // Handle relay command: "CHn:ON", "CHn:OFF", or "CHn:ON:N"
  if (cmd[0] == 'C' && cmd[1] == 'H') {
    int ch = cmd[2] - '0';
    bool isOn = (cmd.find("ON") != std::string::npos);

    if (ch >= 1 && ch <= 4) {
      int idx = ch - 1;

      // if (isOn) {
      //   size_t secondColon = cmd.find(':', 4);
      //   if (secondColon != std::string::npos) {
      //     int intervalVal = atoi(cmd.c_str() + secondColon + 1);
      //     relayInterval[idx] = (uint16_t)intervalVal;
      //   }

      //   relayState[idx]      = 1;
      //   relayPhysical[idx]   = true;
      //   relayLastToggle[idx] = millis();
      //   applyRelay(idx, true);
      //   Serial.printf("[Relay] CH%d ON (interval=%ums)\n", ch, relayInterval[idx]);
      // } else {
      //   relayState[idx]      = 0;
      //   relayPhysical[idx]   = false;
      //   relayLastToggle[idx] = 0;
      //   applyRelay(idx, false);
      //   Serial.printf("[Relay] CH%d OFF\n", ch);
      // }
      changeRelayState(idx, isOn);
      return;
    }
  }
  Serial.println("[CMD] Invalid format");
}

void setup() {
  Serial.begin(9600);
  delay(1000);
  Serial.println("[Setup] Starting...");

  for (int i = 0; i < 4; i++) {
    pinMode(RELAY_PINS[i], OUTPUT);
    applyRelay(i, false);
  }
  Serial.println("[Setup] GPIO initialized");

  Serial.println("[BLE] Initializing...");
  BLEDevice::init(DEVICE_NAME);
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharCmd = pService->createCharacteristic(
    CHAR_CMD_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );
  pCharCmd->setCallbacks(new CommandCallbacks());

  pService->start();
  pServer->getAdvertising()->addServiceUUID(SERVICE_UUID);
  pServer->getAdvertising()->start();

  Serial.println("[BLE] Advertising started");
  Serial.printf("[BLE] Device: %s\n", DEVICE_NAME);

  preferences.begin("saklar", false);
  unsigned int counter = preferences.getUInt("counter", 0);
  counter++;
  Serial.printf("Current boot count: %u\n", counter);
  preferences.putUInt("counter", counter);
  preferences.end();

  Serial.println("[Setup] Completed");
  readConfig(); 

  // optocoupler setup
  pinMode(optoPin, INPUT_PULLUP);
}

void readConfig() {
  preferences.begin("saklar", false);
  Serial.println("[Config] loaded configurations");
  for (int i = 0; i < 4; i++) {
    relayInterval[i] = preferences.getUInt(("relayMs" + String(i + 1)).c_str(), relayInterval[i]);
    Serial.printf("[Config] CH%d interval: %u ms\n", i + 1, relayInterval[i]);
  }
  preferences.end();
}

void saveConfig() {
  
}

void loop() {
  uint32_t now = millis();

  for (int i = 0; i < 4; i++) {
    if (relayState[i] == 0 || relayInterval[i] == 0) continue;

    if (now - relayLastToggle[i] >= relayInterval[i]) {
      relayPhysical[i] = !relayPhysical[i];
      applyRelay(i, relayPhysical[i]);
      relayLastToggle[i] = now;
    }
  }

  int sensorValue = digitalRead(optoPin);

  // Remember: Logic is inverted due to INPUT_PULLUP
  if (sensorValue == LOW && !relayState[0]) { // Only trigger if not already on
    Serial.println("Input Signal: DETECTED (ON)");
    changeRelayState(0, true); // Example: Turn on CH1 when signal is detected
  } else if (sensorValue == HIGH && relayState[0]) { // Only trigger if not already off
    Serial.println("Input Signal: NOT DETECTED (OFF)");
    changeRelayState(0, false); // Example: Turn on CH1 when signal is detected
  }
}
