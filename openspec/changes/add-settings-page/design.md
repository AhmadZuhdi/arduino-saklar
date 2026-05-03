## Context

App currently has single view (relay control). Need multi-page navigation with settings.

## Goals / Non-Goals

**Goals:**
- Add Settings page for user configuration
- Bottom navigation (Home, Settings)
- Persist relay names + device name to localStorage
- Load config on app init

**Non-Goals:**
- Cloud sync
- Export/import settings
- Advanced user management

## Decisions

**1. Bottom nav over top menu**
- **Why**: Mobile-friendly, thumb access, conventional mobile app pattern
- **Alternatives**: Top navbar (less mobile-friendly), drawer menu (more complex)

**2. localStorage for persistence**
- **Why**: Simple, no backend needed, built-in
- **Alternatives**: IndexedDB (overkill), server sync (requires backend)

**3. Separate Settings component (not modal)**
- **Why**: Full page allows more settings later, cleaner UX
- **Alternatives**: Modal (cluttered, small), inline (hard to manage)

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| localStorage limited to 5-10MB | Settings data tiny; not an issue |
| Page reload loses temp state | Use localStorage for persistence |
| Mobile nav takes screen space | Design compact nav (~50px height) |

## Migration Plan

1. Add bottom navigation component
2. Convert App to multi-page (Home page + Settings page)
3. Add Settings component with relay name inputs
4. Implement localStorage hooks
5. Load and apply config on startup
6. Pass relay names to RelayCard
