#pragma once
#include <Arduino.h>
#include <WiFi.h>

// ── WiFi TCP relay (HCW AP mode, port 8080) ──────────────────────────────────
class RelayBoard {
public:
  RelayBoard(const char* ip, uint16_t port = 8080)
    : _ip(ip), _port(port) {}

  bool control(uint8_t channel, bool state) {
    WiFiClient client;
    client.setTimeout(5000);
    if (!client.connect(_ip, _port)) {
      Serial.printf("[Relay/WiFi] CH%d %s — connect failed\n", channel, state ? "ON" : "OFF");
      return false;
    }
    _send(client, channel, state);
    client.stop();
    Serial.printf("[Relay/WiFi] CH%d %s\n", channel, state ? "ON" : "OFF");
    return true;
  }

  bool on(uint8_t channel)  { return control(channel, true);  }
  bool off(uint8_t channel) { return control(channel, false); }

private:
  const char* _ip;
  uint16_t    _port;

  void _send(WiFiClient& client, uint8_t channel, bool state) {
    uint8_t cmd[4];
    cmd[0] = 0xA0;
    cmd[1] = channel;
    cmd[2] = state ? 1 : 0;
    cmd[3] = cmd[0] + cmd[1] + cmd[2];
    client.write(cmd, 4);
  }
};

// ── UART relay (direct TX/RX wired to ESP01, 9600 baud) ──────────────────────
class UARTRelayBoard {
public:
  UARTRelayBoard(uint8_t rxPin, uint8_t txPin)
    : _rx(rxPin), _tx(txPin) {}

  void begin() {
    Serial2.begin(9600, SERIAL_8N1, _rx, _tx);
  }

  bool control(uint8_t channel, bool state) {
    uint8_t cmd[4];
    cmd[0] = 0xA0;
    cmd[1] = channel;
    cmd[2] = state ? 1 : 0;
    cmd[3] = cmd[0] + cmd[1] + cmd[2];
    Serial2.write(cmd, 4);
    Serial.printf("[Relay/UART] CH%d %s\n", channel, state ? "ON" : "OFF");
    return true;
  }

  bool on(uint8_t channel)  { return control(channel, true);  }
  bool off(uint8_t channel) { return control(channel, false); }

private:
  uint8_t _rx, _tx;
};
