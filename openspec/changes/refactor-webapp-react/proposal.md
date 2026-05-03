## Why

Current vanilla JS webapp is hard to maintain and scale. No component reusability, state management scattered, difficult to add features. React provides structured component architecture, easier testing, better tooling.

## What Changes

- Replace vanilla JS with React component structure
- Implement proper state management (hooks/Context API)
- Add component-based UI (ConnectButton, RelayCard, DebugLog)
- Upgrade build toolchain (Vite for dev server and bundling)
- Maintain same functionality (BLE control, toggle relay buttons, debug log)
- Keep HTTPS support and Node.js server

## Capabilities

### New Capabilities
- `react-components`: Modular React UI components (ConnectButton, RelayCard, StatusIndicator, DebugLog)
- `react-state-management`: Centralized state management using React hooks and Context API
- `build-system`: Vite-based development and production build toolchain

### Modified Capabilities
- `ble-webapp-ui`: Behavior unchanged, refactored from vanilla JS to React

## Impact

- Frontend codebase: `webapp/` restructured with `src/` directory containing React components
- Build process: Add `npm run dev` (Vite dev server) and `npm run build` (production bundle)
- Dependencies: Add React, ReactDOM, Vite, @vitejs/plugin-react
- No API changes — ESP32 protocol remains identical
- No breaking changes for users — same HTTPS endpoint, same relay control UX
