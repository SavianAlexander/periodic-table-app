import { test, expect } from '@playwright/test';

test.describe('GHS Safety Hazard Symbols Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5173');
  });

  test('Should display correct GHS hazard symbols for Hydrogen and Gold in Intermediate mode', async ({ page }) => {
    // Select Intermediate difficulty
    await page.locator('button:has-text("Intermediate")').click();

    // Click Hydrogen (H) card
    await page.locator('[data-testid="element-1"]').click();

    // Verify detail panel is open and has GHS Safety section
    const panel = page.locator('[data-testid="right-panel"]');
    await expect(panel).toBeVisible();
    await expect(panel.locator('[data-testid="ghs-safety-section"]')).toBeVisible();
    await expect(panel.locator('.ghs-hazard-card')).toContainText('Flammable');
    await expect(panel.locator('.ghs-hazard-card')).toContainText('H220');

    // Close panel
    await page.locator('[data-testid="right-panel-close"]').click();

    // Click Gold (Au) card
    await page.locator('[data-testid="element-79"]').click();
    await expect(panel.locator('[data-testid="ghs-safety-section"]')).toBeVisible();
    await expect(panel.locator('.ghs-hazard-card')).toContainText('Non-Hazardous');
  });

  test('Should hide GHS safety warnings in Beginner difficulty mode', async ({ page }) => {
    // Select Beginner difficulty
    await page.locator('button:has-text("Beginner")').click();

    // Click Hydrogen (H) card
    await page.locator('[data-testid="element-1"]').click();

    // Verify detail panel is open, but has NO GHS Safety section
    const panel = page.locator('[data-testid="right-panel"]');
    await expect(panel).toBeVisible();
    await expect(panel.locator('[data-testid="ghs-safety-section"]')).not.toBeVisible();
  });
});
