## 1. Setup & Dependencies

- [x] 1.1 Create `webapp/src/` directory with `main.jsx` entry point
- [x] 1.2 Update `package.json` with React, ReactDOM, Vite, @vitejs/plugin-react
- [x] 1.3 Create `vite.config.js` with React plugin
- [x] 1.4 Create `index.html` in `webapp/` with root element and script tag

## 2. React Context & Hooks

- [x] 2.1 Create `src/context/BLEContext.jsx` for connection state management
- [x] 2.2 Create `src/hooks/useBLE.js` for connection/command methods
- [x] 2.3 Create `src/hooks/useRelayState.js` for relay state tracking
- [x] 2.4 Create `src/hooks/useDebugLog.js` for log management

## 3. UI Components

- [x] 3.1 Create `src/components/ConnectButton.jsx` with connect/disconnect logic
- [x] 3.2 Create `src/components/StatusIndicator.jsx` with connection status display
- [x] 3.3 Create `src/components/RelayCard.jsx` with toggle button per channel
- [x] 3.4 Create `src/components/DebugLog.jsx` with scrollable log display
- [x] 3.5 Create `src/components/RelayGrid.jsx` to compose 4 RelayCard components

## 4. Main App Component

- [x] 4.1 Create `src/App.jsx` root component with context provider
- [x] 4.2 Compose ConnectButton, StatusIndicator, RelayGrid, DebugLog in App
- [x] 4.3 Create `src/main.jsx` entry point, render App to DOM

## 5. Styling

- [x] 5.1 Create `src/styles/App.module.css` with layout and component styles
- [x] 5.2 Create `src/styles/components.module.css` with component-specific styles
- [x] 5.3 Import and apply CSS modules to all components

## 6. BLE Integration

- [x] 6.1 Port Web Bluetooth API connect logic to useBLE hook
- [x] 6.2 Port relay command send logic with error handling
- [x] 6.3 Implement log entry generation on all events (connect, send, error)
- [x] 6.4 Test BLE connection in dev server (npm run dev)

## 7. Build & Server Integration

- [x] 7.1 Create build command: `npm run build` runs Vite build
- [x] 7.2 Update `server.js` to serve `dist/` directory
- [x] 7.3 Update `server.js` SPA fallback to return `dist/index.html`
- [x] 7.4 Test production build locally

## 8. Testing & Cleanup

- [x] 8.1 Test full workflow: npm run dev → connect → toggle relay → check logs
- [x] 8.2 Test production build: npm run build && npm start
- [x] 8.3 Verify HTTPS cert still works with bundled app
- [x] 8.4 Remove old vanilla JS files from `webapp/`
- [x] 8.5 Update `.gitignore` to exclude `node_modules/`, `dist/`

## 9. Documentation

- [ ] 9.1 Update README with new dev/build commands
- [ ] 9.2 Document project structure (`src/`, `public/`, `dist/`)
