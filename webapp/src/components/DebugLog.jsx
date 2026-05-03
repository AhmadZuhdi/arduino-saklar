import { useContext, useEffect, useRef } from 'react'
import { BLEContext } from '../context/BLEContext'
import styles from '../styles/components.module.css'

export function DebugLog() {
  const ctx = useContext(BLEContext)
  const logRef = useRef(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [ctx.log])

  return (
    <div className={styles.logSection}>
      <div className={styles.logTitle}>Debug Log</div>
      <div className={styles.log} ref={logRef}>
        {ctx.log.map((entry, idx) => (
          <div key={idx} className={`${styles.logEntry} ${entry.isError ? styles.error : ''}`}>
            [{entry.timestamp}] {entry.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
