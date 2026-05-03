import { RelayCard } from './RelayCard'
import styles from '../styles/components.module.css'

export function RelayGrid({ relayState, onToggle }) {
  return (
    <div className={styles.relayGrid}>
      {[1, 2, 3, 4].map(ch => (
        <RelayCard
          key={ch}
          channel={ch}
          relayState={relayState[ch - 1]}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
