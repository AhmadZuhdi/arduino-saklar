const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 8000;

app.use(express.static(path.join(__dirname)));

// Load SSL cert (or use HTTP if not available)
let server;
try {
  const key = fs.readFileSync(path.join(__dirname, 'key.pem'));
  const cert = fs.readFileSync(path.join(__dirname, 'cert.pem'));
  server = https.createServer({ key, cert }, app);
  console.log('✓ Using HTTPS (self-signed certificate)');
} catch (err) {
  console.log('⚠ HTTPS cert not found, using HTTP');
  server = require('http').createServer(app);
}

server.listen(PORT, () => {
  const ifaces = os.networkInterfaces();
  let ip = 'localhost';
  
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ip = iface.address;
        break;
      }
    }
  }

  const protocol = server instanceof https.Server ? 'https' : 'http';
  console.log(`\n✓ Server running at ${protocol}://localhost:${PORT}`);
  console.log(`✓ Access from phone: ${protocol}://${ip}:${PORT}\n`);
  console.log('Note: Self-signed cert — accept warning on first visit\n');
});

