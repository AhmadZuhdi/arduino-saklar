import { useEffect, useContext, useState } from 'react'
import { BLEContext } from './context/BLEContext'
import { BLEProvider } from './context/BLEContext'
import { BottomNav } from './components/BottomNav'
import { Home } from './pages/Home'
import { Settings } from './pages/Settings'
import styles from './styles/App.module.css'

const ESP32_NAME = 'ESP32-Relay'

function AppContent() {
  const ctx = useContext(BLEContext)
  const [currentPage, setCurrentPage] = useState('home')

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

      {currentPage === 'home' && <Home deviceName={ESP32_NAME} />}
      {currentPage === 'settings' && <Settings />}

      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
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
