import { useContext } from 'react'
import { BLEContext } from '../context/BLEContext'
import styles from '../styles/components.module.css'

export function StatusIndicator() {
  const ctx = useContext(BLEContext)

  return (
    <div className={styles.statusLine}>
      <span className={`${styles.statusIndicator} ${ctx.connected ? styles.connected : ''}`}></span>
      <span className={styles.statusText}>
        {ctx.connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  )
}
