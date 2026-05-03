#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

// ── Config ────────────────────────────────────────────────────────────────────
#define RELAY_ACTIVE_LOW false
#define DEVICE_NAME "ESP32-Relay"

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
uint8_t relayState[4] = {0, 0, 0, 0};

// ── Forward declaration ────────────────────────────────────────────────────────
void handleCommand(const std::string &cmd);

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

void handleCommand(const std::string &cmd) {
  // Format: "CH1:ON\n"
  if (cmd.length() < 5) return;

  if (cmd[0] == 'C' && cmd[1] == 'H') {
    int ch = cmd[2] - '0';
    bool isOn = (cmd.find("ON") != std::string::npos);
    if (ch >= 1 && ch <= 4) {
      Serial.printf("[Relay] CH%d %s\n", ch, isOn ? "ON" : "OFF");
      uint8_t pin = RELAY_PINS[ch - 1];
#if RELAY_ACTIVE_LOW
      digitalWrite(pin, isOn ? LOW : HIGH);
#else
      digitalWrite(pin, isOn ? HIGH : LOW);
#endif
      relayState[ch - 1] = isOn ? 1 : 0;
      return;
    }
  }
  Serial.println("[CMD] Invalid format");
}

void setup() {
  Serial.begin(9600);
  delay(1000);
  Serial.println("[Setup] Starting...");

  // Init pins
  for (int i = 0; i < 4; i++) {
    pinMode(RELAY_PINS[i], OUTPUT);
    digitalWrite(RELAY_PINS[i], LOW);
  }
  Serial.println("[Setup] GPIO initialized");

  // BLE
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
}

void loop() {
  delay(100);
}
