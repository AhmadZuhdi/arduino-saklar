import { useEffect, useContext } from 'react'
import { useRelayState } from './hooks/useRelayState'
import { BLEContext } from './context/BLEContext'
import { BLEProvider } from './context/BLEContext'
import { ConnectButton } from './components/ConnectButton'
import { StatusIndicator } from './components/StatusIndicator'
import { RelayGrid } from './components/RelayGrid'
import { DebugLog } from './components/DebugLog'
import styles from './styles/App.module.css'

const ESP32_NAME = 'ESP32-Relay'

function AppContent() {
  const { state: relayState, toggleRelay } = useRelayState()
  const ctx = useContext(BLEContext)

  useEffect(() => {
    if (!ctx.initialized.current) {
      if (!navigator.bluetooth) {
        ctx.addLog('⚠ Web Bluetooth not supported', true)
      } else {
        ctx.addLog('Ready. Click Connect to pair.')
      }
      ctx.markInitialized()
    }
  }, [ctx])

  return (
    <div className={styles.container}>
      <h1>⚡ ESP32 Relay BLE</h1>

      <div className={styles.section}>
        <h2>Connection</h2>
        <StatusIndicator />
        <ConnectButton deviceName={ESP32_NAME} />
      </div>

      <div>
        <h2>Relay Control</h2>
        <RelayGrid relayState={relayState} onToggle={toggleRelay} />
      </div>

      <DebugLog />
    </div>
  )
}

export function App() {
  return (
    <BLEProvider>
      <AppContent />
    </BLEProvider>
  )
}
