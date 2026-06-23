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
    delay(5000) // Fallback timeout of 5 seconds
  ]);

  console.log("Dev server is ready. Launching Playwright...");
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  
  const page = await context.newPage();

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

  // 11. 11_floating_video_player.png: While on Hydrogen, click the tab button to select the Local video player tab (this renders video[data-testid="element-video-player"]), displaying the floating video player centered in the screen outside the right panel. Take a screenshot showing this layout.
  console.log("Step 11: Switching to Local Video Player (floating layout)...");
  await page.locator('.media-section .tab-btn').first().click({ force: true });
  await delay(2000);
  await page.screenshot({ path: path.join(screenshotDir, '11_floating_video_player.png') });

  // 12. 12_narrator_active.png: Interact with the voice narrator dashboard [data-testid="voice-narrator-controls"] (e.g. click the play button). Capture a screenshot showing the active narrator buttons.
  console.log("Step 12: Activating voice narrator...");
  await page.locator('[data-testid="voice-narrator-controls"]').scrollIntoViewIfNeeded();
  await delay(500);
  await page.locator('[data-testid="voice-narrator-controls"] .play-btn').click({ force: true });
  await delay(1000);
  await page.screenshot({ path: path.join(screenshotDir, '12_narrator_active.png') });

  console.log("Closing browser...");
  await browser.close();

  console.log("Stopping Vite dev server...");
  devServer.kill();
  
  console.log("All 12 screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Error executing walkthrough journey:", err);
  process.exit(1);
});
