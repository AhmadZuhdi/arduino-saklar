## Context

Current webapp is vanilla JS (~150 lines) with direct DOM manipulation and scattered event handlers. No build step, no tooling, difficult to test or extend. ESP32 BLE protocol is stable (`CH<n>:ON/OFF` commands).

## Goals / Non-Goals

**Goals:**
- Refactor vanilla JS to modular React components
- Maintain identical UX and BLE protocol (no breaking changes)
- Add development workflow (dev server, build tooling)
- Improve code testability and maintainability
- Keep HTTPS + Node.js server working

**Non-Goals:**
- Change ESP32 firmware or BLE protocol
- Add new relay control features
- Change design/styling
- Add authentication or cloud integration

## Decisions

**1. Use React with Hooks + Context API (over Redux/Zustand)**
- **Why**: BLE connection state simple enough; Context API sufficient for this scope
- **Alternatives**: Redux (overkill), Zustand (adds dependency), MobX (over-engineered)
- **Trade-off**: Less boilerplate than Redux, sufficient for single-page relay control

**2. Use Vite as build tool (over Create React App/Webpack)**
- **Why**: Fast dev server, minimal config, good for small projects
- **Alternatives**: CRA (slow, bloated), Webpack (manual config), Parcel (less control)
- **Trade-off**: Less ecosystem than CRA, but faster iteration

**3. Keep Node.js server unchanged, Vite only for frontend bundling**
- **Why**: Server already works; isolate UI changes from backend
- **Alternatives**: Full-stack JS framework (Next.js) — overkill here
- **Trade-off**: Separate dev/build workflows, but clear separation of concerns

**4. Component structure: App → (ConnectSection, RelayGrid, DebugLog)**
- **Why**: Simple hierarchy, easy to test each piece
- **Alternatives**: Flat component list (less organized), state machine (overkill)
- **Trade-off**: More files, but better organization

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| React learning curve slows initial refactor | Leverage existing component structure; use hooks gradually |
| Vite build step adds dev complexity | Document setup, provide npm run dev/build scripts |
| BLE API can fail silently | Already has debug log; keep all logging |
| State sync issues (React ↔ BLE) | Use useEffect callbacks to track BLE connection state |

## Migration Plan

1. Set up Vite + React in `webapp/src/`
2. Build components incrementally (preserve old `index.html` temporarily)
3. Test BLE connection in React dev server
4. Build production bundle with Vite
5. Update `server.js` to serve bundled assets from `dist/`
6. Remove old vanilla JS files
7. Update npm start script to run Node.js server

## Open Questions

- Should we pre-render relay state from ESP32 on connect, or start fresh?
- How often should we poll ESP32 for relay state updates? (Or only on user action?)
