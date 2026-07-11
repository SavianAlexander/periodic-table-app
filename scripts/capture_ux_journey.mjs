import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("Starting Vite dev server on 127.0.0.1:5173...");
  
  // Start Vite dev server programmatically
  const devServer = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', '5173', '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  // Wait for the dev server to be ready
  await Promise.race([
    new Promise((resolve) => {
      devServer.stdout.on('data', (data) => {
        const output = data.toString();
        console.log("[Vite]", output.trim());
        if (output.includes('Local:') || output.includes('http://') || output.includes('ready in')) {
          resolve();
        }
      });
      devServer.stderr.on('data', (data) => {
        console.error("[Vite Error]", data.toString().trim());
      });
    }),
    delay(20000) // Fallback timeout of 20 seconds
  ]);

  console.log("Dev server is ready. Launching Playwright...");
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  
  const page = await context.newPage();

  // Mock YouTube iframe embeds to look beautiful and premium instead of "video unavailable"
  await page.route('**/youtube.com/embed/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              background-color: #0b0f19;
              color: #8fa0dd;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .play-icon {
              width: 54px;
              height: 54px;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 12px;
              box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
            }
            .play-icon::after {
              content: '';
              display: block;
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 10px 0 10px 18px;
              border-color: transparent transparent transparent #ffffff;
              margin-left: 5px;
            }
            h2 {
              font-size: 14px;
              margin: 0;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            p {
              font-size: 11px;
              color: #64748b;
              margin: 4px 0 0 0;
            }
          </style>
        </head>
        <body>
          <div class="play-icon"></div>
          <h2>Curated YouTube Video</h2>
          <p>Interactive Lesson Active</p>
        </body>
        </html>
      `
    });
  });

  // Mock images-of-elements.com to return beautiful sample SVG cards instead of remaining on "loading" state
  await page.route('**/images-of-elements.com/**', (route) => {
    const url = route.request().url();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const elementName = filename.split('.')[0];
    const formattedName = elementName.charAt(0).toUpperCase() + elementName.slice(1);

    let startColor = '#374151';
    let endColor = '#1f2937';

    if (elementName === 'iron') {
      startColor = '#9ca3af';
      endColor = '#4b5563';
    } else if (elementName === 'hydrogen') {
      startColor = '#60a5fa';
      endColor = '#2563eb';
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${startColor}" />
            <stop offset="100%" stop-color="${endColor}" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
        <circle cx="150" cy="100" r="45" fill="white" opacity="0.08" />
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="#ffffff" opacity="0.95">${formattedName}</text>
        <text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#ffffff" opacity="0.6" letter-spacing="1.5">REAL-WORLD SAMPLE</text>
      </svg>
    `;

    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svg
    });
  });

  // Inject the global mocks script before navigating
  const mocksPath = path.join(process.cwd(), 'tests', 'e2e', 'global-mocks.js');
  console.log(`Injecting global mocks from: ${mocksPath}`);
  await page.addInitScript({ path: mocksPath });

  // Create output directory docs/ux_journey/ if it doesn't exist
  const screenshotDir = path.join(process.cwd(), 'docs', 'ux_journey');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Navigate to the local app
  console.log("Navigating to http://127.0.0.1:5173...");
  await page.goto('http://127.0.0.1:5173');
  await page.waitForSelector('[data-testid="periodic-table-grid"]');
  await delay(1000);

  // 1. 01_beginner_grid.png: Main grid in Beginner mode (click [data-testid="difficulty-beginner"] first)
  console.log("Step 1: Capturing beginner grid...");
  await page.click('[data-testid="difficulty-beginner"]');
  await delay(500);
  await page.screenshot({ path: path.join(screenshotDir, '01_beginner_grid.png') });

  // 2. 02_intermediate_grid.png: Main grid in Intermediate mode (click [data-testid="difficulty-intermediate"])
  console.log("Step 2: Capturing intermediate grid...");
  await page.click('[data-testid="difficulty-intermediate"]');
  await delay(500);
  await page.screenshot({ path: path.join(screenshotDir, '02_intermediate_grid.png') });

  // 3. 03_advanced_grid.png: Main grid in Advanced mode (click [data-testid="difficulty-advanced"])
  console.log("Step 3: Capturing advanced grid...");
  await page.click('[data-testid="difficulty-advanced"]');
  await delay(500);
  await page.screenshot({ path: path.join(screenshotDir, '03_advanced_grid.png') });

  // 4. 04_legend_filter_noble_gas.png: Filter grid to Noble Gases (click [data-testid="legend-noble-gas"])
  console.log("Step 4: Capturing legend filter Noble Gas...");
  await page.click('[data-testid="legend-noble-gas"]');
  await delay(500);
  await page.screenshot({ path: path.join(screenshotDir, '04_legend_filter_noble_gas.png') });

  // 5. 05_legend_filter_alkali_metal.png: Filter grid to Alkali Metals (click [data-testid="legend-alkali-metal"])
  console.log("Step 5: Capturing legend filter Alkali Metal...");
  await page.click('[data-testid="legend-alkali-metal"]');
  await delay(500);
  await page.screenshot({ path: path.join(screenshotDir, '05_legend_filter_alkali_metal.png') });

  // 6. 06_detail_beginner_carbon_en.png: Open detailed panel for Carbon (atomic number 6) in Beginner mode, English. Shows uses and applications.
  console.log("Step 6: Opening Carbon in Beginner mode, English...");
  // Clear the active filter first
  await page.click('[data-testid="legend-alkali-metal"]');
  await delay(500);
  await page.click('[data-testid="difficulty-beginner"]');
  await delay(500);
  await page.click('[data-testid="element-6"]');
  await page.waitForSelector('[data-testid="right-panel"]');
  await page.selectOption('[data-testid="language-select"]', 'en');
  await delay(2000); // Wait for photo and content to load
  await page.screenshot({ path: path.join(screenshotDir, '06_detail_beginner_carbon_en.png') });

  // 7. 07_detail_beginner_carbon_es.png: Switch language selector [data-testid="language-select"] to Spanish ('es') on Carbon panel, showing details in Spanish.
  console.log("Step 7: Switching Carbon panel to Spanish...");
  await page.selectOption('[data-testid="language-select"]', 'es');
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '07_detail_beginner_carbon_es.png') });

  // Close the right panel so we can click on the grid again
  console.log("Closing Carbon panel...");
  await page.click('[data-testid="right-panel-close"]');
  await delay(500);

  // 8. 08_detail_intermediate_iron.png: Open detailed panel for Iron (atomic number 26) in Intermediate mode, English. Shows physical/chemical parameters.
  console.log("Step 8: Opening Iron in Intermediate mode, English...");
  await page.click('[data-testid="difficulty-intermediate"]');
  await delay(500);
  await page.click('[data-testid="element-26"]');
  await page.waitForSelector('[data-testid="right-panel"]');
  await page.selectOption('[data-testid="language-select"]', 'en');
  await delay(2000); // Wait for content and photo to load
  await page.screenshot({ path: path.join(screenshotDir, '08_detail_intermediate_iron.png') });

  // Close the right panel so we can click on the grid again
  console.log("Closing Iron panel...");
  await page.click('[data-testid="right-panel-close"]');
  await delay(500);

  // 9. 09_detail_advanced_hydrogen_bohr.png: Open detailed panel for Hydrogen (atomic number 1) in Advanced mode. Captures the Bohr model Concentric Orbit animation.
  console.log("Step 9: Opening Hydrogen in Advanced mode (Bohr model)...");
  await page.click('[data-testid="difficulty-advanced"]');
  await delay(500);
  await page.click('[data-testid="element-1"]');
  await page.waitForSelector('[data-testid="right-panel"]');
  await page.selectOption('[data-testid="language-select"]', 'en');
  await delay(2000); // Wait for animation & model to render
  await page.screenshot({ path: path.join(screenshotDir, '09_detail_advanced_hydrogen_bohr.png') });

  // 10. 10_detail_advanced_hydrogen_spectra.png: Scroll down the Hydrogen detailed panel so the Bohr model and emission spectra visualizer are fully visible in the viewport. Take a screenshot showing the glowing spectral lines and list.
  console.log("Step 10: Scrolling down to show Emission Spectra visualizer...");
  await page.locator('.emission-spectra-visualizer-container').scrollIntoViewIfNeeded();
  await page.locator('[data-testid="right-panel"]').evaluate(el => el.scrollTop = el.scrollHeight);
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '10_detail_advanced_hydrogen_spectra.png') });

  // 11. 11_floating_video_player.png: Capturing the floating video player layout centered in the screen outside the right panel.
  console.log("Step 11: Capturing floating video player layout...");
  await delay(2000);
  await page.screenshot({ path: path.join(screenshotDir, '11_floating_video_player.png') });

  // 12. 12_narrator_active.png: Interact with the voice narrator dashboard [data-testid="voice-narrator-controls"] (e.g. click the play button). Capture a screenshot showing the active narrator buttons.
  console.log("Step 12: Activating voice narrator...");
  await page.locator('[data-testid="voice-narrator-controls"]').scrollIntoViewIfNeeded();
  await delay(500);
  await page.locator('[data-testid="voice-narrator-controls"] .play-btn').click({ force: true });
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '12_narrator_active.png') });

  // Close panel to return to the main dashboard
  console.log("Closing panel to show main dashboard...");
  await page.click('[data-testid="right-panel-close"]');
  await delay(1000);

  // 13. 13_aufbau_sandbox.png: Navigate to Aufbau Sandbox
  console.log("Step 13: Capturing Aufbau Sandbox tab...");
  await page.click('button:has-text("Aufbau Sandbox")');
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '13_aufbau_sandbox.png') });

  // 14. 14_equation_balancer.png: Navigate to Equation Balancer
  console.log("Step 14: Capturing Equation Balancer tab...");
  await page.click('button:has-text("Equation Balancer")');
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '14_equation_balancer.png') });

  // 15. 15_explorer_quiz.png: Navigate to Explorer Quiz
  console.log("Step 15: Capturing Explorer Quiz tab...");
  await page.click('button:has-text("Explorer Quiz")');
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '15_explorer_quiz.png') });

  // 16. 16_solubility_matrix.png: Navigate to Solubility Matrix
  console.log("Step 16: Capturing Solubility Matrix tab...");
  await page.click('button:has-text("Solubility Matrix")');
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '16_solubility_matrix.png') });

  // 17. 17_bonding_simulator.png: Navigate to Bonding Simulator, synthesize H2O, and take screenshot
  console.log("Step 17: Capturing Bonding Simulator tab with H2O synthesis...");
  await page.click('button:has-text("Bonding Simulator")');
  await delay(1000);
  await page.click('button:has-text("Hydrogen")');
  await delay(200);
  await page.click('button:has-text("Hydrogen")');
  await delay(200);
  await page.click('button:has-text("Oxygen")');
  await delay(200);
  await page.click('button:has-text("Synthesize Bond")');
  await delay(1500);
  await page.screenshot({ path: path.join(screenshotDir, '17_bonding_simulator.png') });

  // 18. 18_property_analyzer.png: Navigate to Property Analyzer
  console.log("Step 18: Capturing Property Analyzer tab...");
  await page.click('button:has-text("Property Analyzer")');
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '18_property_analyzer.png') });

  // 19. 19_history_timeline.png: Navigate to History Timeline
  console.log("Step 19: Capturing History Timeline tab...");
  await page.click('button:has-text("History Timeline")');
  await delay(1000);
  // Click Sweden filter
  await page.click('button.country-filter-btn:has-text("Sweden")');
  await delay(500);
  // Select Oxygen
  await page.click('.mini-grid-cell:has-text("O")');
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '19_history_timeline.png') });

  // 20. 20_decay_simulator.png: Navigate to Decay Simulator
  console.log("Step 20: Capturing Decay Simulator tab...");
  await page.click('button:has-text("Decay Simulator")');
  await delay(1000);
  // Select Uranium-238
  await page.selectOption('select.isotope-select-dropdown', { label: 'Uranium-238' });
  await delay(500);
  // Click Start Decay
  await page.click('button.start-decay-btn');
  await delay(2000); // Allow decay curve graph points to render
  await page.screenshot({ path: path.join(screenshotDir, '20_decay_simulator.png') });

  console.log("Closing browser...");
  await browser.close();

  console.log("Stopping Vite dev server...");
  devServer.kill();
  
  console.log("All 20 screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Error executing walkthrough journey:", err);
  process.exit(1);
});
