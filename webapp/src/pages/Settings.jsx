import { useContext, useState, useEffect } from 'react'
import { BLEContext } from '../context/BLEContext'
import { useConfig } from '../hooks/useConfig'
import styles from '../styles/Settings.module.css'

export function Settings() {
  const ctx = useContext(BLEContext)
  const { config, updateRelayName, updateDeviceName, updateRelayInterval, loading } = useConfig()
  const [localDeviceName, setLocalDeviceName] = useState('')
  const [localRelayNames, setLocalRelayNames] = useState(['', '', '', ''])
  const [localRelayIntervals, setLocalRelayIntervals] = useState([0, 0, 0, 0])
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (config && !loading) {
      setLocalDeviceName(config.deviceName)
      setLocalRelayNames(config.relayNames)
      setLocalRelayIntervals(config.relayIntervals || [0, 0, 0, 0])
    }
  }, [config, loading])

  const handleRelayNameChange = (index, value) => {
    const updated = [...localRelayNames]
    updated[index] = value
    setLocalRelayNames(updated)
  }

  const handleIntervalChange = (index, value) => {
    const updated = [...localRelayIntervals]
    const parsed = parseInt(value, 10)
    updated[index] = isNaN(parsed) ? 0 : parsed
    setLocalRelayIntervals(updated)
  }

  const handleSave = async () => {
    localRelayNames.forEach((name, idx) => {
      updateRelayName(idx, name)
    })
    localRelayIntervals.forEach((interval, idx) => {
      updateRelayInterval(idx, interval)
    })
    await updateDeviceName(localDeviceName)
    ctx.addLog('Settings saved to IndexedDB')
  }

  const handleSync = async () => {
    if (!ctx.connected) {
      ctx.addLog('Not connected to device', true)
      return
    }
    setSyncing(true)
    try {
      for (let i = 0; i < 4; i++) {
        const cmd = `CONFIG:CH${i + 1}:interval=${localRelayIntervals[i]}\n`
        const encoded = new TextEncoder().encode(cmd)
        ctx.addLog(`[SYNC] Sending: "${cmd.trim()}"`)
        await ctx.charCommand.writeValue(encoded)
        // Brief delay between commands
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      ctx.addLog('✓ Config synced to device')
    } catch (err) {
      ctx.addLog(`Sync failed: ${err.message}`, true)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return <div className={styles.settingsPage}><p>Loading settings...</p></div>
  }

  return (
    <div className={styles.settingsPage}>
      <h2>Settings</h2>

      <div className={styles.section}>
        <label>Device Name</label>
        <input
          type="text"
          value={localDeviceName}
          onChange={(e) => setLocalDeviceName(e.target.value)}
          placeholder="ESP32-Relay"
        />
      </div>

      <div className={styles.section}>
        <h3>Relay Names & Intervals</h3>
        {localRelayNames.map((name, idx) => (
          <div key={idx} className={styles.relayConfig}>
            <div className={styles.relayInput}>
              <label>Channel {idx + 1} Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleRelayNameChange(idx, e.target.value)}
                placeholder={`Channel ${idx + 1}`}
              />
            </div>
            <div className={styles.relayInput}>
              <label>Interval (ms) - 0 for solid on</label>
              <input
                type="number"
                min="0"
                max="60000"
                step="100"
                value={localRelayIntervals[idx]}
                onChange={(e) => handleIntervalChange(idx, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <button className={styles.saveBtn} onClick={handleSave}>
        Save Settings Locally
      </button>

      <button 
        className={`${styles.syncBtn} ${!ctx.connected || syncing ? styles.disabled : ''}`}
        onClick={handleSync}
        disabled={!ctx.connected || syncing}
      >
        {syncing ? 'Syncing...' : 'Sync Config to Device'}
      </button>
    </div>
  )
}
