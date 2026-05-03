// ── Config ───────────────────────────────────────────────────────────────────
const CONFIG = {
  baudRate: 9600,
  deviceName: "ESP32-Relay",
  relays: [
    { id: 1, name: "Channel 1" },
    { id: 2, name: "Channel 2" },
    { id: 3, name: "Channel 3" },
    { id: 4, name: "Channel 4" }
  ]
};

// Load config from localStorage or use defaults
function loadConfig() {
  const saved = localStorage.getItem("relayConfig");
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(CONFIG, parsed);
  }
}

// Save config to localStorage
function saveConfig() {
  localStorage.setItem("relayConfig", JSON.stringify(CONFIG));
}

// Update relay names in DOM
function updateRelayNames() {
  CONFIG.relays.forEach((relay, idx) => {
    const input = document.getElementById(`relayName${relay.id}`);
    if (input) input.value = relay.name;
  });
}

// ── State ─────────────────────────────────────────────────────────────────────
let port = null;
let reader = null;
let writer = null;
let connected = false;

// ── Log utility ───────────────────────────────────────────────────────────────
function addLog(msg, isError = false) {
  const logDiv = document.getElementById("log");
  const entry = document.createElement("div");
  entry.className = `log-entry${isError ? " error" : ""}`;
  const timestamp = new Date().toLocaleTimeString();
  entry.textContent = `[${timestamp}] ${msg}`;
  logDiv.appendChild(entry);
  logDiv.scrollTop = logDiv.scrollHeight;
}

// ── UI update ─────────────────────────────────────────────────────────────────
function updateUI(isConnected) {
  connected = isConnected;
  const indicator = document.getElementById("statusIndicator");
  const statusText = document.getElementById("statusText");
  const btnConnect = document.getElementById("btnConnect");
  const btnDisconnect = document.getElementById("btnDisconnect");
  const relayButtons = document.querySelectorAll(".btn-relay");
  const configInputs = document.querySelectorAll(".config-field input");

  if (isConnected) {
    indicator.classList.add("connected");
    statusText.textContent = "Connected";
    btnConnect.style.display = "none";
    btnDisconnect.style.display = "block";
    relayButtons.forEach(b => b.disabled = false);
    configInputs.forEach(i => i.disabled = true);
    addLog("Connected to ESP32-Relay");
  } else {
    indicator.classList.remove("connected");
    statusText.textContent = "Disconnected";
    btnConnect.style.display = "block";
    btnDisconnect.style.display = "none";
    relayButtons.forEach(b => b.disabled = true);
    configInputs.forEach(i => i.disabled = false);
    addLog("Disconnected", true);
  }
}

// ── Serial communication ──────────────────────────────────────────────────────
async function sendCommand(channel, action) {
  if (!connected) {
    addLog("Not connected", true);
    return;
  }
  const cmd = `CH${channel}:${action}\n`;
  try {
    addLog(`[SEND] "${cmd.trim()}" (${cmd.length} bytes)`);
    const encoded = new TextEncoder().encode(cmd);
    addLog(`[BYTES] ${Array.from(encoded).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}`);
    await writer.write(encoded);
  } catch (err) {
    addLog(`Send error: ${err.message}`, true);
  }
}

async function readSerial() {
  try {
    addLog("[READ] Starting to read from ESP32...");
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        addLog("[READ] Stream closed", true);
        break;
      }
      const text = new TextDecoder().decode(value);
      addLog(`[RECV] ${JSON.stringify(text)}`);
      addLog(`[BYTES] ${Array.from(value).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}`);
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      addLog(`Read error: ${err.message}`, true);
    }
  }
  updateUI(false);
}

// ── Connect ───────────────────────────────────────────────────────────────────
document.getElementById("btnConnect").addEventListener("click", async () => {
  try {
    addLog("[CONNECT] Requesting port from user...");
    port = await navigator.serial.requestPort();
    const info = port.getInfo();
    addLog(`[CONNECT] Port selected - VendorID: ${info.usbVendorId}, ProductID: ${info.usbProductId}`);

    addLog(`[CONNECT] Opening port at ${CONFIG.baudRate} baud...`);
    await port.open({ baudRate: CONFIG.baudRate });
    addLog("[CONNECT] ✓ Port opened");

    addLog("[CONNECT] Setting up text encoder stream...");
    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
    addLog("[CONNECT] ✓ Writer ready");

    addLog("[CONNECT] Setting up text decoder stream...");
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();
    addLog("[CONNECT] ✓ Reader ready");

    addLog("[CONNECT] ✓ Connection established");
    updateUI(true);
    readSerial();
  } catch (err) {
    if (err.name !== "NotFoundError") {
      addLog(`[CONNECT] Error: ${err.name} - ${err.message}`, true);
    } else {
      addLog("[CONNECT] Port selection cancelled", true);
    }
  }
});

// ── Disconnect ────────────────────────────────────────────────────────────────
document.getElementById("btnDisconnect").addEventListener("click", async () => {
  addLog("[DISCONNECT] Closing connection...");
  if (reader) {
    reader.cancel();
    addLog("[DISCONNECT] Reader cancelled");
  }
  if (writer) {
    writer.releaseLock();
    addLog("[DISCONNECT] Writer lock released");
  }
  if (port) {
    await port.close();
    addLog("[DISCONNECT] Port closed");
  }
  port = null;
  reader = null;
  writer = null;
  updateUI(false);
});

// ── Relay buttons ─────────────────────────────────────────────────────────────
document.querySelectorAll(".btn-relay").forEach(btn => {
  btn.addEventListener("click", () => {
    const channel = btn.getAttribute("data-channel");
    const action = btn.getAttribute("data-action");
    sendCommand(channel, action);
  });
});

// ── Config update listeners ───────────────────────────────────────────────────
document.getElementById("baudRateInput").addEventListener("change", (e) => {
  CONFIG.baudRate = parseInt(e.target.value);
  saveConfig();
  addLog(`Config: baud rate set to ${CONFIG.baudRate}`);
});

CONFIG.relays.forEach((relay) => {
  const input = document.getElementById(`relayName${relay.id}`);
  if (input) {
    input.addEventListener("change", (e) => {
      relay.name = e.target.value;
      saveConfig();
      // Update displayed name
      const card = document.querySelector(`[data-relay-id="${relay.id}"] .relay-title`);
      if (card) card.textContent = relay.name;
      addLog(`Config: relay ${relay.id} renamed to "${relay.name}"`);
    });
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
if (!navigator.serial) {
  document.getElementById("unsupported").style.display = "block";
}

loadConfig();
updateRelayNames();
updateUI(false);
addLog("Ready. Click Connect to begin.");
addLog("Relay buttons: Click ON/OFF to send CH<n>:ON / CH<n>:OFF commands");
