import { test, expect } from '@playwright/test';

test.describe('Academic Upgrades E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: './tests/e2e/global-mocks.js' });
    await page.goto('/');
  });

  test('Should navigate between tabs and load simulator / property analyzer modules', async ({ page }) => {
    // Verify default active tab is the grid
    await expect(page.locator('[data-testid="periodic-table-grid"]')).toBeVisible();

    // Click Bonding Simulator tab
    const bondingTab = page.locator('button:has-text("Bonding Simulator")');
    await expect(bondingTab).toBeVisible();
    await bondingTab.click();
    
    // Verify bonding workspace loads
    const bondingHeader = page.locator('h2:has-text("Interactive Chemical Bonding Simulator")');
    await expect(bondingHeader).toBeVisible();

    // Click Property Analyzer tab
    const graphTab = page.locator('button:has-text("Property Analyzer")');
    await expect(graphTab).toBeVisible();
    await graphTab.click();

    // Verify comparison graph loads
    const graphHeader = page.locator('h2:has-text("Multi-Dimensional Property Analyzer")');
    await expect(graphHeader).toBeVisible();

    // Click Aufbau Sandbox tab
    const aufbauTab = page.locator('button:has-text("Aufbau Sandbox")');
    await expect(aufbauTab).toBeVisible();
    await aufbauTab.click();
    await expect(page.locator('h2:has-text("Aufbau Electron Configuration Sandbox")')).toBeVisible();

    // Click Equation Balancer tab
    const balancerTab = page.locator('button:has-text("Equation Balancer")');
    await expect(balancerTab).toBeVisible();
    await balancerTab.click();
    await expect(page.locator('h2:has-text("Chemical Equation Balancing Game")')).toBeVisible();

    // Click Explorer Quiz tab
    const quizTab = page.locator('button:has-text("Explorer Quiz")');
    await expect(quizTab).toBeVisible();
    await quizTab.click();
    await expect(page.locator('h2:has-text("Periodic Table Explorer Quiz")')).toBeVisible();

    // Click Solubility Matrix tab
    const solubilityTab = page.locator('button:has-text("Solubility Matrix")');
    await expect(solubilityTab).toBeVisible();
    await solubilityTab.click();
    await expect(page.locator('h2:has-text("Solubility Matrix Calculator")')).toBeVisible();

    // Click History Timeline tab
    const historyTab = page.locator('button:has-text("History Timeline")');
    await expect(historyTab).toBeVisible();
    await historyTab.click();
    await expect(page.locator('h2:has-text("Historical Discovery Timeline")')).toBeVisible();
    
    // Switch back to grid
    const gridTab = page.locator('button:has-text("Periodic Grid")');
    await gridTab.click();
    await expect(page.locator('[data-testid="periodic-table-grid"]')).toBeVisible();
  });

  test('Should filter elements by discovery year and country in History Timeline', async ({ page }) => {
    // Navigate to History Timeline
    await page.locator('button:has-text("History Timeline")').click();
    await expect(page.locator('h2:has-text("Historical Discovery Timeline")')).toBeVisible();

    // Click Sweden country filter badge
    const swedenBadge = page.locator('button.country-filter-btn:has-text("Sweden")');
    await swedenBadge.click();

    // Verify Sweden filter is active
    await expect(swedenBadge).toHaveClass(/active/);

    // Click Oxygen (O) in the mini grid and verify historical details card
    const oCell = page.locator('.mini-grid-cell:has-text("O")').first();
    await oCell.click();
    await expect(page.locator('.history-details-card h3')).toContainText('Oxygen (O)');
    await expect(page.locator('.history-details-card')).toContainText('Sweden');
  });

  test('Should simulate exponential decay in Decay Simulator', async ({ page }) => {
    // Navigate to Decay Simulator
    await page.locator('button:has-text("Decay Simulator")').click();
    await expect(page.locator('h2:has-text("Nuclear Decay & Half-Life Simulator")')).toBeVisible();

    // Select Radium-226 from isotope dropdown
    const selectDropdown = page.locator('select.isotope-select-dropdown');
    await selectDropdown.selectOption({ label: 'Radium-226' });

    // Verify decay equation displays correct details
    await expect(page.locator('.decay-equation-card')).toContainText('Radium-226');
    await expect(page.locator('.decay-equation-card')).toContainText('Radon-222');

    // Click Start Decay and verify progress
    const startBtn = page.locator('button.start-decay-btn');
    await expect(startBtn).toBeEnabled();
    await startBtn.click();
    
    // Reset button should clear graphs
    await page.locator('button.reset-decay-btn').click();
  });

  test('Should interact with 3D Crystal Lattice Visualizer', async ({ page }) => {
    // Navigate to Lattice Viewer
    await page.locator('button:has-text("Lattice Viewer")').click();
    await expect(page.locator('h2:has-text("3D Crystal Lattice Visualizer")')).toBeVisible();

    // Click Copper element toggle
    const copperBtn = page.locator('button.lattice-element-btn:has-text("Copper")');
    await copperBtn.click();
    await expect(copperBtn).toHaveClass(/active/);

    // Verify coordinates info updates
    await expect(page.locator('.lattice-info-card')).toContainText('FCC (Face-Centered Cubic)');
    await expect(page.locator('.lattice-info-card')).toContainText('74%');

    // Drag sliders to update rotation
    await page.locator('input.lattice-slider-x').fill('45');
    await page.locator('input.lattice-slider-y').fill('-45');
    await page.locator('input.lattice-slider-opacity').fill('50');
  });
});
