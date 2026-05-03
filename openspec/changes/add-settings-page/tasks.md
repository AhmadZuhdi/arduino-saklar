## 1. Configuration Management

- [x] 1.1 Create `src/hooks/useConfig.js` hook for localStorage management
- [x] 1.2 Load config on app init with defaults
- [x] 1.3 Implement save/load config functions

## 2. Settings Page Component

- [x] 2.1 Create `src/pages/Settings.jsx` component
- [x] 2.2 Add 4 relay name input fields
- [x] 2.3 Add device name input field
- [x] 2.4 Implement form state management

## 3. Bottom Navigation

- [x] 3.1 Create `src/components/BottomNav.jsx` component
- [x] 3.2 Add Home and Settings tabs with icons/labels
- [x] 3.3 Style nav bar with CSS module
- [x] 3.4 Highlight active tab based on current page

## 4. Page Routing

- [x] 4.1 Create `src/pages/Home.jsx` (move relay control here)
- [x] 4.2 Add page state to App.jsx (currentPage: 'home' | 'settings')
- [x] 4.3 Implement page navigation on bottom nav click
- [x] 4.4 Update App.jsx layout to include BottomNav

## 5. Config Integration

- [x] 5.1 Update BLEContext to include config state
- [x] 5.2 Pass device name from config to useBLE hook
- [x] 5.3 Pass relay names from config to RelayCard components
- [x] 5.4 Load initial config in App.jsx useEffect

## 6. Settings Form Functionality

- [x] 6.1 Implement relay name input onChange handlers
- [x] 6.2 Implement device name input onChange handler
- [x] 6.3 Add Save button in Settings page
- [x] 6.4 Update context on Save click

## 7. Styling & Layout

- [x] 7.1 Update App.module.css for new layout (content area + bottom nav)
- [x] 7.2 Create Settings.module.css for form styling
- [x] 7.3 Update BottomNav styling
- [x] 7.4 Ensure responsive design (mobile-first)

## 8. Testing

- [x] 8.1 Test Settings form input and save
- [x] 8.2 Test bottom nav switching between pages
- [x] 8.3 Test localStorage persistence (reload page)
- [x] 8.4 Test relay names display on Home page
- [x] 8.5 Test device name used in BLE search
