## Why

Relay names hardcoded as "Channel 1-4". Users can't customize. Settings page needed for preferences (relay names, device name, etc).

## What Changes

- Add bottom navigation bar
- Add Settings page accessible via bottom nav
- Store relay names & device name in localStorage
- Relay names display on RelayCard
- Device name used in BLE filter

## Capabilities

### New Capabilities
- `settings-page`: Settings UI with relay name inputs and persistence
- `bottom-navigation`: Navigation bar at bottom with Home/Settings tabs
- `localStorage-config`: Relay and device name storage and retrieval

## Impact

- New route/page in React (Home vs Settings)
- Bottom nav component added
- Settings.jsx component created
- localStorage integration
- Relay names passed as props to RelayCard
