# Implementation Plan - Academic Periodic Table App Upgrade

This plan details the steps required to implement the relational SQLite database backend, advanced dashboards, interactive visualizers, and robust search capabilities.

## Phase 1: Database & Data Ingestion Backend (Milestone 1)
- **Step 1.1**: Design the relational SQLite database schema.
  - Create table `elements` for academic properties.
  - Create table `isotopes` for isotope listings.
  - Create table `everyday_uses` for applications.
  - Create table `emission_spectra` for wavelength lines.
- **Step 1.2**: Write `scripts/ingest_db.py` to seed `elements.db`.
  - The script should populate database records.
  - Include an API fetch or fallback to local seed data containing all 118 elements with complete academic fields.
- **Step 1.3**: Write `scripts/query_db.py` to extract elements data from `elements.db` and output it to `src/data/elements.json`.
- **Step 1.4**: Update `package.json` to run the DB generation scripts before `dev` and `build`.
- **Verification**: Run build and verify that SQLite database is created, populated, and successfully compiled into `elements.json`.

## Phase 2: Frontend Layout, Dashboards & Styling (Milestone 2)
- **Step 2.1**: Refactor `src/components/RightPanel.jsx` and other views to parse the new data fields (Mass, category, electronegativity, ionization energy, density, melting/boiling points, crystal structure, isotopes list, etc.).
- **Step 2.2**: Implement three dashboards based on difficulty:
  - **Beginner**: Basic properties, everyday uses, and fundamental features.
  - **Intermediate**: Physical/chemical properties, discovery details, and basic categorization.
  - **Advanced**: Full quantum settings (electron configuration, shell details, ionization charts, and emission spectra lines).
- **Step 2.3**: Style the layout with premium glassmorphism, responsive grid scaling (zero-scroll), and group hover highlights.
- **Verification**: Ensure visually responsive styling works without overflow.

## Phase 3: Bohr Model & Emission Spectra Visualizers (Milestone 3)
- **Step 3.1**: Implement Bohr model simulation inside the right panel.
  - Dynamically calculate shell orbits from electron configuration or shell counts.
  - Render concentric circles (shells) and animate orbiting electron particles (SVG/Canvas).
- **Step 3.2**: Implement Emission Spectra visualizer for Advanced mode.
  - Draw a visual spectral bar (Canvas/SVG) representing exact wavelength lines with correct color mapping (e.g. 380nm-750nm mapped to RGB colors).
- **Verification**: Visually verify interactive Bohr model orbits and spectra lines.

## Phase 4: Search, Legend Filtering & Test Compliance (Milestone 4)
- **Step 4.1**: Implement complex search bar filtering.
  - Highlight cards matching search string (name, symbol, atomic number, or property ranges like `mass > 50` or `electronegativity < 2`).
- **Step 4.2**: Implement legend group filters.
  - Highlight group block cards (Alkali metals, noble gases, halogens, etc.) on click/hover.
- **Step 4.3**: Run Playwright test suite and verify all 5 tiers pass natively.
- **Step 4.4**: Trigger Forensic Auditor and Victory Audit.
- **Verification**: E2E tests return 100% pass rate.
