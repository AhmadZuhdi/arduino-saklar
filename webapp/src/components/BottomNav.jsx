import styles from '../styles/BottomNav.module.css'

export function BottomNav({ currentPage, onPageChange }) {
  return (
    <nav className={styles.bottomNav}>
      <button
        className={`${styles.navBtn} ${currentPage === 'home' ? styles.active : ''}`}
        onClick={() => onPageChange('home')}
      >
        🏠 Home
      </button>
      <button
        className={`${styles.navBtn} ${currentPage === 'settings' ? styles.active : ''}`}
        onClick={() => onPageChange('settings')}
      >
        ⚙️ Settings
      </button>
    </nav>
  )
}
