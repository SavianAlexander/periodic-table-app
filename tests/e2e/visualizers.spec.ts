import { test, expect } from '@playwright/test';

test.describe('Milestone 3: Bohr Model and Emission Spectra Visualizers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Bohr Model: Renders concentric orbits, electron dots, and correct shell legend for Lithium', async ({ page }) => {
    // Switch to Advanced Mode
    await page.click('[data-testid="difficulty-advanced"]');
    
    // Click Lithium (Atomic Number 3)
    await page.click('[data-testid="element-3"]');
    
    // Check Right Panel is visible
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
    
    // Check Bohr Model container is visible
    const bohrContainer = page.locator('.bohr-model-container');
    await expect(bohrContainer).toBeVisible();
    
    // Verify the central nucleus displays Lithium's symbol
    const nucleusText = bohrContainer.locator('text');
    await expect(nucleusText).toHaveText('Li');
    
    // Lithium electron config: [He] 2s1 => shells: [2, 1], total: 3 electrons
    // Check the legend text
    const legend = bohrContainer.locator('.bohr-model-legend');
    await expect(legend).toContainText('Shells: 2 • 1 (3 e⁻)');

    // Verify orbits are present (should have 2 concentric dash circles)
    const orbits = bohrContainer.locator('circle[fill="none"]');
    await expect(orbits).toHaveCount(2);

    // Verify electrons are present (should have 3 dots)
    const electrons = bohrContainer.locator('circle.bohr-electron-glow');
    await expect(electrons).toHaveCount(3);
  });

  test('Bohr Model: Handles missing electronConfiguration gracefully by displaying fallback', async ({ page }) => {
    // Intercept elements.json network request to inject mock data for fallback testing.
    await page.route('**/elements.json*', async (route) => {
      const mockData = [
        {
          atomicNumber: 119,
          symbol: "Uue",
          name: "Ununennium",
          atomicMass: 315,
          // Intentionally omitting electronConfiguration
        }
      ];
      await route.fulfill({
        contentType: 'application/javascript',
        body: `export default ${JSON.stringify(mockData)};`
      });
    });

    await page.goto('/');
    await page.click('[data-testid="difficulty-advanced"]');
    await page.click('[data-testid="element-119"]');

    // Verify Bohr Model displays fallback message
    const fallback = page.locator('.bohr-model-fallback');
    await expect(fallback).toBeVisible();
    await expect(fallback).toContainText('Bohr model data not available');
  });

  test('Emission Spectra: Renders glowing visible wavelength lines for Hydrogen', async ({ page }) => {
    // Switch to Advanced Mode
    await page.click('[data-testid="difficulty-advanced"]');
    
    // Click Hydrogen (Atomic Number 1)
    await page.click('[data-testid="element-1"]');
    
    // Check right panel is visible
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();

    // Check Emission Spectra container is visible
    const spectraContainer = page.locator('.emission-spectra-visualizer-container');
    await expect(spectraContainer).toBeVisible();

    // Hydrogen has 4 visible lines in elements.json: 410, 434, 486, 656 nm
    const lines = spectraContainer.locator('.spectra-line');
    await expect(lines).toHaveCount(4);

    // Verify that the lines have correct color/shadow styles (at least checking they exist)
    const firstLine = lines.first();
    const styleAttr = await firstLine.getAttribute('style');
    expect(styleAttr).toContain('rgb('); // Should contain calculated RGB color
    expect(styleAttr).toContain('box-shadow:'); // Should contain glow shadow
    
    // Verify the numeric display matches
    const numericDisplay = spectraContainer.locator('.spectra-numeric');
    await expect(numericDisplay).toHaveText('410 nm, 434 nm, 486 nm, 656 nm');
  });

  test('Emission Spectra: Handles missing/invalid spectra data gracefully', async ({ page }) => {
    await page.route('**/elements.json*', async (route) => {
      const mockData = [
        {
          atomicNumber: 119,
          symbol: "Uue",
          name: "Ununennium",
          atomicMass: 315,
          emissionSpectra: null // Null value
        }
      ];
      await route.fulfill({
        contentType: 'application/javascript',
        body: `export default ${JSON.stringify(mockData)};`
      });
    });

    await page.goto('/');
    await page.click('[data-testid="difficulty-advanced"]');
    await page.click('[data-testid="element-119"]');

    // Section should show fallback
    const spectraSection = page.locator('.right-panel-section').filter({ hasText: 'Emission Spectra' });
    await expect(spectraSection).toContainText('Data not available');
  });
});
