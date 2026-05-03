import { useRelayState } from '../hooks/useRelayState'
import { useConfig } from '../hooks/useConfig'
import { ConnectButton } from '../components/ConnectButton'
import { StatusIndicator } from '../components/StatusIndicator'
import { RelayGrid } from '../components/RelayGrid'
import { DebugLog } from '../components/DebugLog'
import styles from '../styles/App.module.css'

export function Home({ deviceName }) {
  const { state: relayState, toggleRelay } = useRelayState()
  const { config } = useConfig()

  return (
    <div className={styles.pageContent}>
      <div className={styles.section}>
        <h2>Connection</h2>
        <StatusIndicator />
        <ConnectButton deviceName={deviceName} />
      </div>

      <div>
        <h2>Relay Control</h2>
        <RelayGrid 
          relayState={relayState} 
          onToggle={toggleRelay}
          relayNames={config.relayNames}
        />
      </div>

      <DebugLog />
    </div>
  )
}
