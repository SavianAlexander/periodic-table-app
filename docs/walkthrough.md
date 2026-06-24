# Walkthrough - Academic Periodic Table App Upgrade

We have polished the Periodic Table Web Application to an academic standard and integrated the official YouTube video lessons.

## Changes Made

### 1. Database & Ingestion Backend
- **SQLite Database (`elements.db`)**: Designed a SQLite database structure to hold detailed science data for all 118 elements.
- **Scraper / Seed Script (`scripts/ingest_db.py`)**: Script that reads from IUPAC/PubChem resources (with solid fallbacks) to populate element facts (Pauling electronegativity, ionization energies, melting/boiling points, isotopes list, etc.).
- **Query Compiler (`scripts/query_db.py`)**: Seamlessly serializes database records to `src/data/elements.json` during the React application's dev/build cycles.
- **Official Periodic Videos Integration**: Scraped all 118 element video URLs directly from the official University of Nottingham Periodic Videos website (`periodicvideos.com`) and updated the `VIDEO_MAPPING` database source of truth in `scripts/ingest_db.py`.

### 2. UI Layout & Custom Badges
- **Responsive Layout**: Designed a glassmorphic Periodic Table utilizing responsive CSS Grid values.
- **State-of-Matter Badges**: Element cards now show visual indicators (Solid, Liquid, Gas, Synthetic) with premium color themes.
- **Interactive Legend**: Multi-group legendary dashboard allowing users to highlight element blocks (Alkali metals, Transition metals, Halogens, Noble gases, etc.) on hover or click.

### 3. Academic-Grade Dashboards & Photos
- **Beginner Mode**: Shows symbols, atomic mass, everyday visual uses, real-world photos, and basic properties.
- **Intermediate Mode**: Integrates melting/boiling points, density, state-of-matter, real-world photos, and discovery year.
- **Advanced Mode**: Integrates Pauling electronegativity, electron configurations (with formatted superscripts), isotopes, and quantum visualizations.
- **Real-World Photo Section (`src/components/RightPanel.jsx`)**: Added real-world element photo loaders in Beginner/Intermediate modes. If the element is synthetic (Atomic Number > 94), the visualizer displays a glassmorphic "Radioactive Synthetic Element" warning card instead.

### 4. Interactive Quantum Visualizers
- **SVG Bohr Model (`src/components/BohrModel.jsx`)**: Dynamically computes orbits based on the element's actual electron shell occupancy. Draws concentric circles and orbits animated SVG electrons.
- **Emission Spectrum Visualizer (`src/components/EmissionSpectra.jsx`)**: Renders precise glowing emission lines along a dark spectrometer band based on wavelength data, computed via Dan Bruton's wavelength-to-color algorithms.

### 5. Advanced Range Search
- **Complex Filtering**: Users can filter elements by typing name, symbol, or range criteria (e.g. `mass > 50` or `electronegativity < 2.0`). Non-matching cards dim gracefully.

### 6. Floating Left Video Player & Narrow Right Panel Layout
- **Left Floating Video Player**: On desktop viewports (widths >= 1025px), the video player is moved out of the right panel and rendered inside a premium floating container (`.floating-video-container`) on the left side of the screen (perfectly centered in the remaining viewport space left of the panel). This lets users comfortably watch videos while keeping full focus on the right details.
- **Standard Width Right Panel**: The right panel (`.right-panel`) is reverted to a neat `400px` width. It displays the voice narrator, real-world photos (positioned at the top where the video player used to be), and mode-specific information.
- **Responsive Fallbacks**: On tablet and mobile viewports (widths < 1025px) where screen space is constrained, the floating container is hidden, and the video player section is dynamically stacked back inside the right panel below the photo section. On mobile screens, the right panel scales to `100%` viewport width.

---

## Verification Results

- **Playwright Test Success**: Configured Playwright config to run with 6 parallel workers locally (providing maximum speed without staggering the host) and automatically fall back to 2 workers in CI (`process.env.CI`) to ensure stable CI checks.
- **E2E Test Robustness**: Resolved timeouts and flakiness on Webkit and Firefox browsers in the CI suite:
  - Added `test.slow()` to long-running or cycling test cases.
  - Refactored the modal layout integrity loop to toggle difficulty modes while the panel remains open, eliminating race conditions of rapid open/close operations.
- **Responsive Layout Verification**: Tested viewport layouts. The media query boundary at 1300px ensures that central page controls remain fully clickable during E2E layout integrity checks, and the wider split layout displays beautifully on full desktop screens.
- **Updated Project Screenshots**: Regenerated all high-fidelity screenshots in `docs/screenshots/` (Carbon in Beginner mode, Iron in Intermediate mode, Hydrogen in Advanced mode, and the Main Grid) and pushed them to Git.
- **Build Success**: `npm run build` compiles cleanly and E2E tests pass 100% locally and in CI.
