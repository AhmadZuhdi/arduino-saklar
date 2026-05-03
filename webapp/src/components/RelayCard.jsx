import { useContext } from 'react'
import { BLEContext } from '../context/BLEContext'
import { useBLE } from '../hooks/useBLE'
import styles from '../styles/components.module.css'

export function RelayCard({ channel, relayState, onToggle, relayName }) {
  const ctx = useContext(BLEContext)
  const { sendCommand } = useBLE()

  const handleClick = async () => {
    const newState = relayState ? 'OFF' : 'ON'
    onToggle(channel)
    await sendCommand(channel, newState)
  }

  return (
    <div className={styles.relayCard}>
      <div className={styles.relayTitle}>{relayName || `Channel ${channel}`}</div>
      <button
        className={`${styles.toggleBtn} ${relayState ? styles.on : ''}`}
        onClick={handleClick}
        disabled={!ctx.connected}
      >
        {relayState ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}
