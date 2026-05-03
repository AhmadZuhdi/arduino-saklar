// ── Config ───────────────────────────────────────────────────────────────────
const BLE_CONFIG = {
  serviceName: "ESP32-Relay",
  serviceUUID: "0000180a-0000-1000-8000-00805f9b34fb",
  charCommandUUID: "00002a19-0000-1000-8000-00805f9b34fb",
  relays: [
    { id: 1, name: "Channel 1" },
    { id: 2, name: "Channel 2" },
    { id: 3, name: "Channel 3" },
    { id: 4, name: "Channel 4" }
  ]
};

// ── State ─────────────────────────────────────────────────────────────────────
let device = null;
let server = null;
let service = null;
let charCommand = null;
let connected = false;

// ── Logging ───────────────────────────────────────────────────────────────────
function addLog(msg, isError = false) {
  const logDiv = document.getElementById("log");
  const entry = document.createElement("div");
  entry.className = `log-entry${isError ? " error" : ""}`;
  const timestamp = new Date().toLocaleTimeString();
  entry.textContent = `[${timestamp}] ${msg}`;
  logDiv.appendChild(entry);
  logDiv.scrollTop = logDiv.scrollHeight;
}

// ── UI ─────────────────────────────────────────────────────────────────────────
function updateUI(isConnected) {
  connected = isConnected;
  const indicator = document.getElementById("statusIndicator");
  const statusText = document.getElementById("statusText");
  const btnConnect = document.getElementById("btnConnect");
  const btnDisconnect = document.getElementById("btnDisconnect");
  const relayButtons = document.querySelectorAll(".btn-relay");

  if (isConnected) {
    indicator.classList.add("connected");
    statusText.textContent = "Connected";
    btnConnect.style.display = "none";
    btnDisconnect.style.display = "block";
    relayButtons.forEach(b => b.disabled = false);
    addLog(`Connected to ${device.name}`);
  } else {
    indicator.classList.remove("connected");
    statusText.textContent = "Disconnected";
    btnConnect.style.display = "block";
    btnDisconnect.style.display = "none";
    relayButtons.forEach(b => b.disabled = true);
    addLog("Disconnected", true);
  }
}

// ── BLE Relay state listener ──────────────────────────────────────────────────
// Disabled for minimal BLE (no state characteristic)
// async function watchRelayState() {
//   ...
// }

// ── Send command ──────────────────────────────────────────────────────────────
async function sendCommand(channel, action) {
  if (!connected) {
    addLog("Not connected", true);
    return;
  }

  try {
    // ASCII format: "CH1:ON\n"
    const cmd = `CH${channel}:${action}\n`;
    const encoded = new TextEncoder().encode(cmd);
    addLog(`[SEND] "${cmd.trim()}" (${encoded.length} bytes)`);
    addLog(`[BYTES] ${Array.from(encoded).map(b => "0x" + b.toString(16).padStart(2, "0")).join(" ")}`);
    
    await charCommand.writeValue(encoded);
    addLog("[SEND] ✓");
  } catch (err) {
    addLog(`[SEND] Error: ${err.message}`, true);
  }
}

// ── Connect ───────────────────────────────────────────────────────────────────
document.getElementById("btnConnect").addEventListener("click", async () => {
  try {
    addLog("[CONNECT] Requesting device...");
    device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: BLE_CONFIG.serviceName }],
      optionalServices: [BLE_CONFIG.serviceUUID]
    });
    addLog(`[CONNECT] Device selected: ${device.name}`);

    addLog("[CONNECT] Connecting to GATT server...");
    server = await device.gatt.connect();
    addLog("[CONNECT] ✓ GATT server connected");

    addLog("[CONNECT] Getting service...");
    service = await server.getPrimaryService(BLE_CONFIG.serviceUUID);
    addLog("[CONNECT] ✓ Service found");

    addLog("[CONNECT] Getting characteristics...");
    charCommand = await service.getCharacteristic(BLE_CONFIG.charCommandUUID);
    addLog("[CONNECT] ✓ Characteristic found");

    updateUI(true);

    device.addEventListener("gattserverdisconnected", () => {
      updateUI(false);
    });
  } catch (err) {
    if (err.name !== "NotFoundError") {
      addLog(`[CONNECT] Error: ${err.name} - ${err.message}`, true);
    }
  }
});

// ── Disconnect ────────────────────────────────────────────────────────────────
document.getElementById("btnDisconnect").addEventListener("click", () => {
  if (device && device.gatt.connected) {
    device.gatt.disconnect();
    updateUI(false);
  }
});

// ── Relay buttons ─────────────────────────────────────────────────────────────
document.querySelectorAll(".btn-relay").forEach(btn => {
  btn.addEventListener("click", () => {
    const channel = btn.getAttribute("data-channel");
    const action = btn.getAttribute("data-action");
    sendCommand(channel, action);
  });
});

// ── Init ──────────────────────────────────────────────────────────────────────
if (!navigator.bluetooth) {
  document.getElementById("unsupported").style.display = "block";
}

updateUI(false);
addLog("Ready. Click Connect to pair.");
addLog("Relay buttons: Click ON/OFF to send commands.");
