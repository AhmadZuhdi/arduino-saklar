import express from 'express'
import https from 'https'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 8000

// Serve dist/ directory (production React bundle)
const distDir = path.join(__dirname, 'dist')
app.use(express.static(distDir))

// SPA fallback: any route returns index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

// Load SSL cert
let server
try {
  const key = fs.readFileSync(path.join(__dirname, 'key.pem'))
  const cert = fs.readFileSync(path.join(__dirname, 'cert.pem'))
  server = https.createServer({ key, cert }, app)
  console.log('✓ Using HTTPS (self-signed certificate)')
} catch (err) {
  console.log('⚠ HTTPS cert not found, using HTTP')
  server = require('http').createServer(app)
}

server.listen(PORT, () => {
  const ifaces = os.networkInterfaces()
  let ip = 'localhost'
  
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ip = iface.address
        break
      }
    }
  }

  const protocol = server instanceof https.Server ? 'https' : 'http'
  console.log(`\n✓ Server running at ${protocol}://localhost:${PORT}`)
  console.log(`✓ Access from phone: ${protocol}://${ip}:${PORT}\n`)
})

