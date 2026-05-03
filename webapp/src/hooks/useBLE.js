import { useContext } from 'react'
import { BLEContext } from '../context/BLEContext'

export function useBLE(deviceName = 'ESP32-Relay') {
  const ctx = useContext(BLEContext)
  if (!ctx) throw new Error('useBLE must be used inside BLEProvider')

  const connect = async () => {
    try {
      ctx.addLog('[CONNECT] Requesting device...')
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: deviceName }],
        optionalServices: ['0000180a-0000-1000-8000-00805f9b34fb']
      })
      ctx.addLog(`[CONNECT] Device: ${device.name}`)
      ctx.setDevice(device)

      ctx.addLog('[CONNECT] Connecting to GATT...')
      const server = await device.gatt.connect()
      ctx.setServer(server)
      ctx.addLog('[CONNECT] ✓ GATT connected')

      ctx.addLog('[CONNECT] Getting service...')
      const service = await server.getPrimaryService('0000180a-0000-1000-8000-00805f9b34fb')
      ctx.setService(service)

      ctx.addLog('[CONNECT] Getting characteristic...')
      const charCommand = await service.getCharacteristic('00002a19-0000-1000-8000-00805f9b34fb')
      ctx.setCharCommand(charCommand)
      ctx.addLog('[CONNECT] ✓ Ready')

      ctx.setConnected(true)

      device.addEventListener('gattserverdisconnected', () => {
        ctx.setConnected(false)
        ctx.addLog('Disconnected', true)
      })
    } catch (err) {
      if (err.name !== 'NotFoundError') {
        ctx.addLog(`[CONNECT] Error: ${err.message}`, true)
      }
    }
  }

  const disconnect = async () => {
    if (ctx.device?.gatt.connected) {
      ctx.device.gatt.disconnect()
      ctx.setConnected(false)
    }
  }

  const sendCommand = async (channel, action) => {
    if (!ctx.connected) {
      ctx.addLog('Not connected', true)
      return
    }
    try {
      const cmd = `CH${channel}:${action}\n`
      const encoded = new TextEncoder().encode(cmd)
      ctx.addLog(`[SEND] "${cmd.trim()}"`)
      await ctx.charCommand.writeValue(encoded)
      ctx.addLog('[SEND] ✓')
    } catch (err) {
      ctx.addLog(`[SEND] Error: ${err.message}`, true)
    }
  }

  return { connect, disconnect, sendCommand }
}
