import { test, expect } from '@playwright/test';

test.describe('Milestone 4: Search, Legend Filtering & E2E Test Passing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Search Input is rendered and performs basic substring filtering', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // Search for "Carbon"
    await searchInput.fill('Carbon');
    
    // Carbon (element-6) should be highlighted, Helium (element-2) should be dimmed
    const carbon = page.locator('[data-testid="element-6"]');
    const helium = page.locator('[data-testid="element-2"]');
    
    await expect(carbon).toHaveClass(/highlighted/);
    await expect(helium).toHaveClass(/dimmed/);

    // Search for symbol "H"
    await searchInput.fill('H');
    const hydrogen = page.locator('[data-testid="element-1"]');
    await expect(hydrogen).toHaveClass(/highlighted/);
  });

  test('Interactive Legend toggles active group filter', async ({ page }) => {
    const legendBtn = page.locator('[data-testid="legend-noble-gas"]');
    await expect(legendBtn).toBeVisible();

    // Click Noble Gas legend
    await legendBtn.click();
    await expect(legendBtn).toHaveClass(/active/);

    // Neon (element-10) should be highlighted, Hydrogen (element-1) should be dimmed
    const neon = page.locator('[data-testid="element-10"]');
    const hydrogen = page.locator('[data-testid="element-1"]');
    
    await expect(neon).toHaveClass(/highlighted/);
    await expect(hydrogen).toHaveClass(/dimmed/);

    // Click again to toggle off
    await legendBtn.click();
    await expect(legendBtn).not.toHaveClass(/active/);

    // Both should no longer be dimmed or highlighted (class highlighted/dimmed should not be present)
    await expect(neon).not.toHaveClass(/highlighted/);
    await expect(neon).not.toHaveClass(/dimmed/);
    await expect(hydrogen).not.toHaveClass(/highlighted/);
    await expect(hydrogen).not.toHaveClass(/dimmed/);
  });

  test('Reactive nonmetal legend filter matches both nonmetal and halogen elements', async ({ page }) => {
    const legendBtn = page.locator('[data-testid="legend-reactive-nonmetal"]');
    await expect(legendBtn).toBeVisible();

    // Click Reactive Nonmetal
    await legendBtn.click();
    await expect(legendBtn).toHaveClass(/active/);

    // Oxygen (Nonmetal, element-8) and Fluorine (Halogen, element-9) should be highlighted
    const oxygen = page.locator('[data-testid="element-8"]');
    const fluorine = page.locator('[data-testid="element-9"]');
    const neon = page.locator('[data-testid="element-10"]'); // Noble Gas
    
    await expect(oxygen).toHaveClass(/highlighted/);
    await expect(fluorine).toHaveClass(/highlighted/);
    await expect(neon).toHaveClass(/dimmed/);
  });

  test('Regex property range queries filter elements correctly', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');

    // Query 1: mass > 200
    await searchInput.fill('mass > 200');
    // Bismuth (mass ~208.98, element-83) should be highlighted, Carbon (mass ~12, element-6) should be dimmed
    const bismuth = page.locator('[data-testid="element-83"]');
    const carbon = page.locator('[data-testid="element-6"]');
    await expect(bismuth).toHaveClass(/highlighted/);
    await expect(carbon).toHaveClass(/dimmed/);

    // Query 2: electronegativity < 1.0
    await searchInput.fill('electronegativity < 1.0');
    // Sodium (en 0.9, element-11) should be highlighted, Fluorine (en 3.98, element-9) should be dimmed
    const sodium = page.locator('[data-testid="element-11"]');
    const fluorine = page.locator('[data-testid="element-9"]');
    await expect(sodium).toHaveClass(/highlighted/);
    await expect(fluorine).toHaveClass(/dimmed/);

    // Query 3: number = 6
    await searchInput.fill('number = 6');
    await expect(carbon).toHaveClass(/highlighted/);
    await expect(bismuth).toHaveClass(/dimmed/);
  });

  test('Logical intersection of search input and legend group filter works', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    const nobleGasLegend = page.locator('[data-testid="legend-noble-gas"]');

    // Click Noble Gas
    await nobleGasLegend.click();

    // Type "Neon"
    await searchInput.fill('Neon');

    // Neon (element-10) matches both and should be highlighted
    const neon = page.locator('[data-testid="element-10"]');
    await expect(neon).toHaveClass(/highlighted/);

    // Helium (element-2, Noble Gas but name doesn't match Neon) should be dimmed
    const helium = page.locator('[data-testid="element-2"]');
    await expect(helium).toHaveClass(/dimmed/);
  });
});
