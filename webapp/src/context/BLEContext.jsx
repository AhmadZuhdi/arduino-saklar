import { createContext, useState, useCallback, useRef } from 'react'

export const BLEContext = createContext()

export function BLEProvider({ children }) {
  const [device, setDevice] = useState(null)
  const [server, setServer] = useState(null)
  const [service, setService] = useState(null)
  const [charCommand, setCharCommand] = useState(null)
  const [connected, setConnected] = useState(false)
  const [log, setLog] = useState([])
  const initialized = useRef(false)

  const addLog = useCallback((msg, isError = false) => {
    const timestamp = new Date().toLocaleTimeString()
    setLog(prev => [...prev, { timestamp, msg, isError }])
  }, [])

  const markInitialized = () => {
    initialized.current = true
  }

  const value = {
    device, setDevice,
    server, setServer,
    service, setService,
    charCommand, setCharCommand,
    connected, setConnected,
    log, setLog, addLog,
    initialized, markInitialized
  }

  return (
    <BLEContext.Provider value={value}>
      {children}
    </BLEContext.Provider>
  )
}
