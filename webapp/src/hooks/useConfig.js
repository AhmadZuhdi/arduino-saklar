import { useState, useCallback, useEffect } from 'react'

const DEFAULT_CONFIG = {
  deviceName: 'ESP32-Relay',
  relayNames: ['Channel 1', 'Channel 2', 'Channel 3', 'Channel 4'],
  relayIntervals: [0, 0, 0, 0] // ms per relay (0 = solid on, default)
}

const DB_NAME = 'relayControlDB'
const STORE_NAME = 'config'
const CONFIG_KEY = 'relayConfig'

// Initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

// Load config from IndexedDB
const loadFromDB = async () => {
  try {
    const db = await initDB()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(CONFIG_KEY)
      request.onsuccess = () => {
        const loaded = request.result || {}
        // Merge with defaults to handle missing fields
        const merged = {
          ...DEFAULT_CONFIG,
          ...loaded,
          // Ensure relayIntervals is always an array
          relayIntervals: loaded.relayIntervals || DEFAULT_CONFIG.relayIntervals
        }
        resolve(merged)
      }
      request.onerror = () => {
        resolve(DEFAULT_CONFIG)
      }
    })
  } catch (err) {
    console.error('Failed to load config from IndexedDB:', err)
    return DEFAULT_CONFIG
  }
}

// Save config to IndexedDB
const saveToDB = async (config) => {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.put(config, CONFIG_KEY)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.error('Failed to save config to IndexedDB:', err)
  }
}

export function useConfig() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  // Load from IndexedDB on mount
  useEffect(() => {
    loadFromDB().then((loaded) => {
      setConfig(loaded)
      setLoading(false)
    })
  }, [])

  const saveConfig = useCallback(async (newConfig) => {
    setConfig(newConfig)
    await saveToDB(newConfig)
  }, [])

  const updateRelayName = useCallback(async (index, name) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        relayNames: [...prev.relayNames]
      }
      updated.relayNames[index] = name
      saveToDB(updated)
      return updated
    })
  }, [])

  const updateDeviceName = useCallback(async (name) => {
    setConfig(prev => {
      const updated = { ...prev, deviceName: name }
      saveToDB(updated)
      return updated
    })
  }, [])

  const updateRelayInterval = useCallback(async (index, intervalMs) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        relayIntervals: [...prev.relayIntervals]
      }
      const parsed = parseInt(intervalMs, 10)
      updated.relayIntervals[index] = isNaN(parsed) ? 0 : parsed
      saveToDB(updated)
      return updated
    })
  }, [])

  return { config, saveConfig, updateRelayName, updateDeviceName, updateRelayInterval, loading }
}
