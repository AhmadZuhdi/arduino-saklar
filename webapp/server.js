const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 8000;

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
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

  console.log(`\n✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Access from phone: http://${ip}:${PORT}\n`);
});
