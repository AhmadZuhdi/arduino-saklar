## ADDED Requirements

### Requirement: Vite Build Configuration
The system SHALL bundle React app using Vite with hot module replacement in dev.

#### Scenario: Development server
- **WHEN** developer runs `npm run dev`
- **THEN** Vite starts dev server at localhost:5173 with hot reload

#### Scenario: Production build
- **WHEN** developer runs `npm run build`
- **THEN** system generates optimized bundle in `dist/` directory

### Requirement: React Integration
The system SHALL use React 18+ with JSX syntax and functional components.

#### Scenario: Mount React app
- **WHEN** `index.html` loads
- **THEN** React mounts to root element and renders App component

#### Scenario: Use React hooks
- **WHEN** components use useState, useEffect, useContext
- **THEN** React lifecycle and side effects work correctly

### Requirement: CSS Modules
The system SHALL style components using CSS Modules for scoped styling.

#### Scenario: Component styles
- **WHEN** component imports `.module.css` file
- **THEN** styles apply only to that component, preventing name collisions

### Requirement: Node.js Server Integration
The system SHALL serve compiled React bundle from Node.js HTTPS server.

#### Scenario: Serve production bundle
- **WHEN** `npm start` runs `node server.js`
- **THEN** server serves files from `dist/` directory at https://0.0.0.0:8000

#### Scenario: Fallback to index.html
- **WHEN** user navigates to any route
- **THEN** server returns `index.html` (SPA fallback)

### Requirement: Dependencies
The system SHALL declare all required npm packages in package.json.

#### Scenario: Install dependencies
- **WHEN** developer runs `npm install`
- **THEN** all packages installed: react, react-dom, vite, @vitejs/plugin-react, express, https

#### Scenario: Dev dependencies
- **WHEN** package.json specifies devDependencies
- **THEN** Vite, build tools installed for local development
