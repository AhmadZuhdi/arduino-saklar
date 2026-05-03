import { useContext } from 'react'
import { BLEContext } from '../context/BLEContext'
import { useBLE } from '../hooks/useBLE'
import styles from '../styles/components.module.css'

export function ConnectButton({ deviceName = 'ESP32-Relay' }) {
  const ctx = useContext(BLEContext)
  const { connect, disconnect } = useBLE(deviceName)

  return (
    <div>
      <button
        className={styles.btnConnect}
        onClick={connect}
        style={{ display: ctx.connected ? 'none' : 'block' }}
      >
        Connect
      </button>
      <button
        className={styles.btnDisconnect}
        onClick={disconnect}
        style={{ display: ctx.connected ? 'block' : 'none' }}
      >
        Disconnect
      </button>
    </div>
  )
}
