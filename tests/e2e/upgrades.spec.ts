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
    
    // Switch back to grid
    const gridTab = page.locator('button:has-text("Periodic Grid")');
    await gridTab.click();
    await expect(page.locator('[data-testid="periodic-table-grid"]')).toBeVisible();
  });
});
