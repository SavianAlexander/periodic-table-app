# Original User Request

## Initial Request — 2026-06-09T13:56:47Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

An interactive, multi-tiered educational web application covering the Periodic Table, built with React, Vite, and Vanilla CSS.

Working directory: `C:\Users\Administrator\.gemini\antigravity\scratch\periodic-table-app`
Integrity mode: development

## Requirements

### R1. Core Architecture & Aesthetics
Build a responsive CSS Grid layout that accurately represents the Periodic Table's distinct shape. Use React (via Vite) and Vanilla CSS to create a highly custom, performant, and visually stunning application with glassmorphism, dynamic hover effects, and micro-animations.

### R2. Difficulty Modes & Dynamic Content
Implement a global toggle switch for difficulty levels ("Beginner", "Intermediate", "Advanced"). The data shown on the individual element cards (e.g., Atomic number vs. electron configuration) must dynamically change based on the active mode. 

### R3. Detailed View Modal
Clicking an element must open a beautiful overlay/modal containing deep information corresponding to the active difficulty mode (e.g., everyday uses for beginners, emission spectra for advanced users).

### R4. Data Source
Generate or source a comprehensive JSON dataset containing properties for all 118 elements required to support the different difficulty modes.

## Acceptance Criteria

### Functionality & UI
- [ ] The application successfully starts and runs locally via `npm run dev`.
- [ ] The main grid correctly displays 118 elements in the standard IUPAC layout.
- [ ] Toggling the difficulty mode visibly changes the data density/information displayed on the element cards.
- [ ] Clicking any element successfully opens a detailed modal with information appropriate to the current difficulty mode.
- [ ] The app features a premium design aesthetic (e.g., no plain generic colors; utilizes smooth transitions and hover states).

## Follow-up — 2026-06-10T14:42:59Z

# Teamwork Project Prompt — Draft

> Status: Ready for launch — awaiting user approval
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Enhance the Periodic Table application by perfectly scaling the grid to eliminate scrolling, and dramatically increasing the information density of the educational right panel so there is no empty space.

Working directory: `C:\Users\Administrator\.gemini\antigravity\scratch\periodic-table-app`
Integrity mode: development

## Requirements

### R1. Zero-Scroll Viewport Scaling
Upgrade the CSS Grid and global layout so the entire 118-element periodic table perfectly fits within the user's viewport without requiring any vertical or horizontal scrolling. The UI must remain highly readable, premium, and dynamically responsive.

### R2. Information-Dense Educational Panel
Ensure the Right Panel is a complete educational tool. It must be fully populated with deep, rich content for every element (e.g., history, isotopes, variations, scientific properties). There must be absolutely no empty spaces or dead zones in the panel. If data is sparse for certain elements, implement engaging educational fallbacks or interactive placeholders to keep the layout dense and premium.

### R3. Maintain Test Coverage
The application must continue to natively pass the rigorous 5-tier E2E Playwright test suite. Update any assertions if the layout changes affect the test hooks.

## Acceptance Criteria

### UI & UX
- [ ] The entire periodic table grid fits 100% on the screen without native browser scrollbars.
- [ ] The Right Panel is visually dense, utilizing all available space to display engaging educational data.

### Verification
- [ ] The E2E tests (`npm run test`) continue to report a 100% pass rate across all 5 tiers.
- [ ] The app successfully runs locally via `npm run dev` with no errors or warnings in the console.

## Follow-up — 2026-06-22T20:06:35Z

The user wants to polish and elevate the existing React-based Periodic Table App to an academic, highly educational standard, replacing generic/simple elements with rich themed designs, interactive simulations (e.g. Bohr model, emission spectrum visualizer), search & filter utilities, and ensuring it is ready for GitHub.

Working directory: c:/Users/Administrator/Desktop/periodic-table-app
Integrity mode: development

## Requirements

### R1. Highly Educational, Academic-Level Content & Interactivity
- Expand the information provided for all 118 elements based on the selected difficulty (Beginner, Intermediate, Advanced).
- Add new academic properties (e.g. Electronegativity, Melting/Boiling Points, Discovery Year / Discoverer, State of matter at room temp) to the database and elements view.
- Implement a fully dynamic, interactive Bohr Model visualization that parses the electron configuration of the selected element to show exact orbital shells and orbiting electrons.
- Implement an interactive Emission Spectrum visualization for Advanced mode, rendering wavelength colors dynamically on a visual spectral bar.

### R2. Advanced UI/UX, Aesthetics & Visual Theme
- Enhance the visual layout to feel premium and state-of-the-art: custom modern typography, sleek gradients, responsive card layouts, and micro-animations.
- Replace simple/generic styling elements with cohesive glassmorphism and group-specific glowing effects on hover.

### R3. Search & Group Filtering
- Add a search input and an interactive group legend to filter/highlight cards on the periodic table grid.

### R4. Integrity and Test Passing
- Ensure all existing Playwright E2E tests continue to pass successfully.

## Acceptance Criteria

### Core Functionality & Interactivity
- [ ] Element cards scale and adapt dynamically to screen size without layout overflow or text clipping.
- [ ] Selecting an element displays a right panel containing the interactive Bohr model with the correct number of shells and electrons.
- [ ] Advanced mode displays a rendering of the emission spectra using precise wavelength-to-color mapping.
- [ ] Element panel displays additional academic properties (Electronegativity, Melting/Boiling Points, Discovery Year / Discoverer).
- [ ] Search input highlights matching elements by name, symbol, or atomic number.
- [ ] Clicking group items in the legend highlights elements in that group block.

### Test Suite Compliance
- [ ] All Playwright E2E tests (Tiers 1-5, empirical, etc.) pass successfully.


## Follow-up — 2026-06-22T20:07:30Z

The user wants to construct the most comprehensive, academic-grade educational Periodic Table tool in existence. The application must leverage a relational SQL database populated with scraped/ingested world-leading accurate science data, and featuring advanced visualizers (Bohr model, emission spectra) and multi-dimensional analysis toolsets.

Working directory: c:/Users/Administrator/Desktop/periodic-table-app
Integrity mode: development

## Requirements

### R1. Relational SQL Database & Science Data Ingestion
- Implement a relational SQL database (e.g., SQLite) to store comprehensive academic chemical data for all 118 elements.
- Data must include: basic properties (mass, category, configuration), advanced properties (electronegativity, ionization energy, density, melting/boiling points, crystal structure), isotopes list, discovery history (discoverer, year), and everyday applications.
- Create a data ingestion script to crawl, scrape, or fetch verified science data from leading chemical resource APIs or datasets to seed the database.

### R2. High-Fidelity React Frontend & Multi-Mode Dashboards
- Create an advanced frontend interface showing the periodic table grid with instant search (by name, symbol, number, or properties) and multi-dimensional filtering (by phase, group block, electronegativity range).
- Implement three academic difficulty dashboards:
  - **Beginner**: Visual applications, everyday uses, and fundamental properties.
  - **Intermediate**: Physical and chemical parameters, phase state diagrams, and basic classification.
  - **Advanced**: Quantum properties, electron shell distributions, emission spectrum visualizer, and ionization energy charts.

### R3. Advanced Interactive Visualizers
- **Interactive Bohr Model**: Live SVG/Canvas simulation rendering electron shells and orbiting electrons dynamically calculated from the exact configuration.
- **Emission Spectrum Visualizer**: Dynamic canvas/gradient representation of exact wavelength emission lines with color-rendering calculations.

### R4. Integrity and Test Passing
- Ensure all existing Playwright E2E tests continue to pass successfully.

## Acceptance Criteria

### Data & SQL Backend
- [ ] Database contains complete, verified chemical records for all 118 elements.
- [ ] Backend or build process successfully queries the SQLite database to serve element data dynamically to the React application.

### UI & Filtering
- [ ] Search input allows complex queries (e.g., searching by property ranges like `mass > 50` or simply by names/symbols).
- [ ] Interactive legend and category filters dynamically dim/highlight the periodic table.
- [ ] Bohr model simulation shows concentric circles matching the shell counts and orbiting electron particles.
- [ ] Emission spectrum draws precise glowing lines matching elements' wavelength arrays.

### Test Compliance
- [ ] All Playwright E2E tests pass without error.


## Follow-up — 2026-06-23T00:33:16Z

The user wants to add an interactive multimedia feature to the Periodic Table App: when an element card is clicked and the detailed panel opens, the user can watch a curated video showing the element's materials and listen to a read-aloud voice explanation in their chosen language. The user must be able to control (play, pause, resume) both the video and the voice narration while reading the right panel details.

Working directory: c:/Users/Administrator/Desktop/periodic-table-app
Integrity mode: benchmark

## Requirements

### R1. Curated Multilingual Video Player
- Integrate a video player within the element detailed view panel.
- Play a curated video demonstrating the element's physical appearance, materials, or real-world applications.
- Videos can use embed sources (e.g. YouTube/Vimeo) or fallback local video mock files.
- The UI should support changing the interface/narration language (e.g. English, Spanish, French) and update the video/narrator target settings accordingly.

### R2. Voice Narration / Read-Aloud (Web Speech API)
- Provide a voice read-aloud narration of the element's information displayed in the right panel.
- Use the browser's native Web Speech API (`SpeechSynthesis`) to generate voice narration in the selected language.
- Provide simple controls (Play/Pause/Stop) for the voice narrator.

### R3. Non-Blocking Interactive Controls
- Both the video player and voice narrator controls must be non-blocking, allowing the user to read through the right panel text, scroll, and interact with other panel elements simultaneously.
- Closing the right panel must immediately stop/terminate any active video playback and voice narration.

## Acceptance Criteria

### Video Player
- [ ] Clicking any element card renders a visible video player in the detail panel (e.g. `data-testid="element-video-player"`).
- [ ] The video player has controls to play and pause the media.

### Voice Narration
- [ ] A voice narrator control dashboard is visible (e.g. `data-testid="voice-narrator-controls"`).
- [ ] Clicking the play button triggers the browser's voice synthesis to read aloud element details.
- [ ] The narrator correctly detects and uses the active language voice if available in the browser.

### Layout & Cleanup
- [ ] Right panel remains scrollable and interactive during active playback.
- [ ] Closing the panel stops all voice synthesis and pauses/destroys the video player context.


## Follow-up — 2026-06-23T00:34:30Z

The user explicitly emphasized: "Like i need a complete video really nice and super planned for each element you know?"
Ensure that you curate/map actual high-quality educational video links (e.g., embedding elements' videos from the renowned "Periodic Videos" YouTube channel by Brady Haran, or CrashCourse Chemistry) directly into the database/mappings for each element, rather than just using generic placeholders, so that the video content is genuinely curated and informative for each individual element.


## Follow-up — 2026-06-23T00:35:50Z

The user requested that the real-world appearance photos shouldn't get cut off. I have modified src/styles/main.css to set .element-photo to object-fit: contain; instead of object-fit: cover;. Please ensure that during the multimedia feature implementation, the right panel styling preserves this or layout elements keep photos and the new video player scaled nicely.
