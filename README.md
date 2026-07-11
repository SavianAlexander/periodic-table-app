# Interactive Academic Periodic Table App 🧪

[![CI Status](https://github.com/SavianAlexander/periodic-table-app/actions/workflows/ci.yml/badge.svg)](https://github.com/SavianAlexander/periodic-table-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/SavianAlexander/periodic-table-app?color=yellow)](https://github.com/SavianAlexander/periodic-table-app/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-18.2-blue?logo=react&logoColor=white)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3-green?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite&logoColor=white)](https://vite.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-orange?logo=playwright&logoColor=white)](https://playwright.dev/)

🚀 **[Live Interactive Demo](https://SavianAlexander.github.io/periodic-table-app/)**

Welcome to the **Interactive Academic Periodic Table App**—the most comprehensive, visually stunning, and educational chemistry reference tool built with React, Vite, and SQLite.

This application is designed for students, educators, and science enthusiasts. It transitions seamlessly between three learning levels (**Beginner**, **Intermediate**, and **Advanced**), adjusting the information density and interactive tools dynamically.

---

## 🌟 Key Features

### 1. Relational SQL Database Backend
- Powered by a relational **SQLite database** (`elements.db`) storing detailed records for all 118 chemical elements.
- Academic properties tracked include:
  - **Basic**: Atomic mass, symbol, classification.
  - **Physical**: Melting point, boiling point, density, state of matter at room temperature.
  - **Chemical**: Pauling electronegativity, ionization energies, electron configurations.
  - **Historical**: Discoverer, year discovered, and everyday uses.
- Includes a data-ingestion pipeline script to seed the database and build-time queries to serialize elements.

### 2. Multi-Tier Academic Dashboards
- **Beginner Mode**: Focused on foundational concepts, featuring clear everyday applications, common chemical classifications, and basic facts.
- **Intermediate Mode**: Focuses on physical properties, discovery history, classification groups, and phase states.
- **Advanced Mode**: Designed for quantum physics and chemistry studies. Displays electronegativity, ionization energies, detailed electron configurations, and advanced visualizers.

### 3. Advanced Scientific Visualizers
- **Interactive SVG Bohr Model**: Generates concentric quantum orbits dynamically based on the element's actual electron shell distribution. Electrons animate in real-time around the central nucleus.
- **Glowing Emission Spectra Visualizer**: Uses physics-based algorithms to map exact element emission wavelengths (in nm) to precise RGB values, rendering an authentic, glowing emission spectrum bar for advanced analysis.

### 4. Interactive Chemical Bonding Simulator
- Synthesize compounds (such as $H_2O$, $CO_2$, $NaCl$, $NH_3$) with customized SVG diagram overlays.
- Displays detailed **VSEPR molecular geometries** (e.g. Bent, Trigonal Pyramidal) and **ideal bond angles**.
- Displays full **Lewis Dot structure** overlays including lone pairs and shared bonding electron pairs.

### 5. Property Analyzer & Trends Graph
- Plots elements' physical/chemical parameters (electronegativity, melting point, density, etc.) in a dynamic comparisons bar graph.

### 6. Interactive Search & Legend Filters
- **Property-Range Search**: Instantly query elements by name, symbol, atomic number, or property ranges (e.g. `mass > 50` or `electronegativity < 2.0`).
- **Interactive Legend**: Highlight elements matching specific chemical groups (Alkali Metals, Transition Metals, Halogens, Noble Gases, Lanthanides, Actinides) on hover or toggle them on click. Non-matching elements dim gracefully to draw focus.

### 7. Historical Discovery Timeline & Map
- An interactive **Discovery Year Slider** from antiquity (prehistoric) to 2026 showing element waves.
- Interactive country/location filter badges (United Kingdom, Sweden, Germany, France, USA, Russia, Antiquity).
- Displays detailed discoverer biographies, discovery year, location, and fun chemistry trivia cards.

### 8. Nuclear Decay & Half-Life Simulator
- Choose between isotopes (Carbon-14, Uranium-238, Cobalt-60, Radium-226, Polonium-210) to observe decay rates.
- Live SVG nuclei grid showing radioactive particle animations (Alpha, Beta, Gamma) in real-time.
- Real-time plotting of the exponential decay curve $N(t) = N_0 e^{-\lambda t}$ against elapsed half-lives.

### 9. 3D Crystal Lattice Visualizer
- Visualizes **FCC (Face-Centered Cubic)**, **BCC (Body-Centered Cubic)**, and **HCP (Hexagonal Close-Packed)** unit cell systems inside a custom 3D rotation projection SVG canvas.
- Integration with elements dataset (Iron, Copper, Gold, Magnesium, Sodium, Zinc) to dynamically scale atomic spheres by real atomic radius parameters.
- Features sliders to adjust X/Y axis rotation angles and transparency/opacity to view inner unit cell fractions.

### 10. Premium Styling & UX
- State-of-the-art **Glassmorphism** styling with animated gradients, custom dark mode, and color-matched category glows.
- Fully responsive design using viewport-unit grid calculations (`vw`, `vh`, `vmin`) that adapts perfectly from mobile devices to ultra-wide displays without scrolling.

---

## 🖼️ Screenshots

### Main Interface (Standard IUPAC Table Layout)
![Main Grid](docs/ux_journey/01_beginner_grid.png)

### Beginner Mode (Everyday Uses & Real-World Element Photo)
![Beginner Mode Dashboard](docs/ux_journey/06_detail_beginner_carbon_en.png)

### Intermediate Mode (Physical & Chemical Parameters & Photo)
![Intermediate Mode Dashboard](docs/ux_journey/08_detail_intermediate_iron.png)

### Advanced Mode (Interactive Bohr Model & Glowing Emission Spectra)
![Advanced Mode Dashboard](docs/ux_journey/09_detail_advanced_hydrogen_bohr.png)

### 🚀 Academic Visualizer Upgrades (New!)

#### 1. Aufbau Electron Configuration Sandbox
![Aufbau Sandbox](docs/ux_journey/13_aufbau_sandbox.png)

#### 2. Chemical Equation Balancing Game
![Equation Balancer](docs/ux_journey/14_equation_balancer.png)

#### 3. Periodic Explorer Quiz Game
![Explorer Quiz](docs/ux_journey/15_explorer_quiz.png)

#### 4. Solubility Matrix Calculator
![Solubility Matrix](docs/ux_journey/16_solubility_matrix.png)

#### 5. Chemical Bonding Simulator
![Bonding Simulator](docs/ux_journey/17_bonding_simulator.png)

#### 6. Property Analyzer
![Property Analyzer](docs/ux_journey/18_property_analyzer.png)

#### 7. Historical Discovery Timeline
![History Timeline](docs/ux_journey/19_history_timeline.png)

#### 8. Nuclear Decay & Half-Life Simulator
![Decay Simulator](docs/ux_journey/20_decay_simulator.png)

#### 9. 3D Crystal Lattice Visualizer
![Lattice Viewer](docs/ux_journey/21_lattice_viewer.png)

---

## 📁 Project Structure

```
periodic-table-app/
├── elements.db               # SQLite database containing enriched elements dataset
├── scripts/
│   ├── ingest_db.py          # Relational SQL database seeder script
│   └── query_db.py           # Database query & JSON compiler utility
├── src/
│   ├── components/
│   │   ├── PeriodicTable.jsx # Periodic table layout grid wrapper
│   │   ├── ElementCard.jsx   # Individual element card (responsive scaling)
│   │   ├── GroupLegend.jsx   # Interactive group filters & legend
│   │   ├── Controls.jsx      # Unified search & difficulty controllers
│   │   ├── RightPanel.jsx    # Glassmorphic detailed view panel
│   │   ├── BohrModel.jsx     # Dynamic quantum Bohr model SVG simulator
│   │   └── EmissionSpectra.jsx # Physics-based glowing spectra canvas
│   ├── data/
│   │   └── elements.json     # Compiled data payload queried from SQLite
│   ├── styles/
│   │   ├── grid.css          # Responsive 18-column grid layout rules
│   │   └── main.css          # Theme colors, glowing highlights, and animations
│   ├── App.jsx               # Application coordinator state
│   └── main.jsx              # React mounting root
├── tests/
│   └── e2e/                  # Playwright E2E integration test suite (Tiers 1-5)
└── playwright.config.ts      # E2E test configuration rules
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and Python installed:
- [Node.js (v18+)](https://nodejs.org/)
- [Python (v3.8+)](https://www.python.org/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/periodic-table-app.git
   cd periodic-table-app
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### Running Locally
Run the Vite development server locally:
```bash
npm run dev
```

### Building for Production
Build the static distribution files (which automatically executes the pre-build SQLite querying routine):
```bash
npm run build
```

---

## 🧪 Running Tests

The application is thoroughly verified using a **Playwright End-to-End** testing suite covering user scenarios, accessibility compliance, keyboard shortcuts, and fallback behaviors.

To execute the test suite (using 3 parallel workers):
```bash
npm test -- --workers=3
```

---

## 📜 License
This project is open-source and available under the MIT License.
