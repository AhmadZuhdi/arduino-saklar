## ADDED Requirements

### Requirement: Bottom navigation bar
The system SHALL display navigation bar at bottom of screen with Home and Settings tabs.

#### Scenario: Navigate to Settings
- **WHEN** user clicks Settings in bottom nav
- **THEN** app displays Settings page

#### Scenario: Navigate to Home
- **WHEN** user clicks Home in bottom nav
- **THEN** app displays relay control page

#### Scenario: Indicate active tab
- **WHEN** user is on a page
- **THEN** corresponding nav tab is highlighted/active

### Requirement: Tab styling
The system SHALL style nav bar with distinct colors and responsive layout.

#### Scenario: Mobile layout
- **WHEN** screen is mobile-sized
- **THEN** nav bar is compact (~50px height) and positioned at bottom
