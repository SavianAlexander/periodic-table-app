# Project: periodic-table-app

## Architecture
- React, Vite, Vanilla CSS.
- Relational SQLite database backend (`elements.db`) generated via Python data ingestion.
- Data compilation script generates `src/data/elements.json` dynamically from the SQLite DB at build/dev time.
- Main entry point: `src/main.jsx` -> `src/App.jsx`.
- State Management: React useState / props for difficulty and filtering.
- Layout: Responsive CSS Grid matching IUPAC layout with zero-scroll.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Database Backend | SQLite setup, python crawlers, build-time compilation script | none | PLANNED |
| 2 | Dashboards & UX | Multi-mode dashboards, glassmorphism, responsive grid scaling | M1 | PLANNED |
| 3 | Visualizers | Dynamic Bohr model SVG simulation, emission spectra wavelength visualizer | M2 | PLANNED |
| 4 | Search & Filtering | Advanced search, legend group highlighting, E2E compliance | M3 | PLANNED |

## Interface Contracts
### App ↔ Controls
- `difficulty` string ('Beginner', 'Intermediate', 'Advanced')
- `setDifficulty(mode)` function
- `searchQuery` string
- `setSearchQuery(query)` function
- `activeGroup` string
- `setActiveGroup(group)` function

### App ↔ PeriodicTable
- `difficulty` prop
- `searchQuery` prop
- `activeGroup` prop
- `onElementClick(element)` callback

### PeriodicTable ↔ ElementCard
- `element` object with complete properties
- `difficulty` prop
- `isHighlighted` boolean based on search/legend filters
- `onClick` callback

### App ↔ RightPanel
- `element` object
- `difficulty` prop
- `onClose` callback

## Code Layout
- `scripts/`
  - `ingest_db.py` - Seeds elements.db
  - `query_db.py` - Outputs elements.json from elements.db
- `src/components/`
  - `PeriodicTable.jsx`
  - `ElementCard.jsx`
  - `RightPanel.jsx`
  - `Controls.jsx`
  - `BohrModel.jsx` - Bohr model visualizer
  - `EmissionSpectra.jsx` - Emission spectra visualizer
- `src/styles/`
  - `main.css`
  - `grid.css`
- `src/data/`
  - `elements.json` - Compiled from elements.db
