import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("Starting Vite dev server...");
  // Launch vite in the background
  const devServer = spawn('npx', ['vite'], {
    shell: true,
    stdio: 'pipe'
  });

  // Listen for the local server URL
  let serverUrl = 'http://localhost:5173';
  await new Promise((resolve) => {
    devServer.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes('Local:') || output.includes('http://')) {
        resolve();
      }
    });
  });

  // Wait a bit to ensure server is fully ready
  await delay(2000);

  console.log("Launching Playwright...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
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

  // Set a clean viewport size for screenshots
  await page.setViewportSize({ width: 1440, height: 900 });

  // Ensure docs/screenshots directory exists
  const screenshotDir = path.join(process.cwd(), 'docs', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Take screenshot of Main Grid
  console.log("Navigating to app...");
  await page.goto(serverUrl);
  await page.waitForSelector('[data-testid="periodic-table-grid"]');
  await delay(1000);
  console.log("Capturing main grid...");
  await page.screenshot({ path: path.join(screenshotDir, 'main_grid.png') });

  // 2. Click Carbon (element-6) in Beginner Mode
  console.log("Opening Carbon in Beginner mode...");
  await page.click('[data-testid="element-6"]');
  await page.waitForSelector('[data-testid="right-panel"]');
  await delay(2000); // Wait for photo to load
  await page.screenshot({ path: path.join(screenshotDir, 'beginner_view.png') });

  // Close panel
  await page.click('[data-testid="right-panel-close"]');

  // 3. Switch to Intermediate and click Iron (element-26)
  console.log("Switching to Intermediate and opening Iron...");
  await page.click('[data-testid="difficulty-intermediate"]');
  await page.click('[data-testid="element-26"]');
  await page.waitForSelector('[data-testid="right-panel"]');
  await delay(2000);
  await page.screenshot({ path: path.join(screenshotDir, 'intermediate_view.png') });

  // Close panel
  await page.click('[data-testid="right-panel-close"]');

  // 4. Switch to Advanced and click Hydrogen (element-1)
  console.log("Switching to Advanced and opening Hydrogen...");
  await page.click('[data-testid="difficulty-advanced"]');
  await page.click('[data-testid="element-1"]');
  await page.waitForSelector('[data-testid="right-panel"]');
  await delay(2000);
  await page.screenshot({ path: path.join(screenshotDir, 'advanced_view.png') });

  console.log("Closing browser...");
  await browser.close();

  console.log("Stopping Vite dev server...");
  devServer.kill();
  console.log("Screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
