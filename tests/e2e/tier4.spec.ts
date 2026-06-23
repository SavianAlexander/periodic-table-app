import { test, expect } from '@playwright/test';

test.describe('Tier 4: Real-World Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: A beginner exploring basic elements and their uses', async ({ page }) => {
    // Assert basic mode is default
    await expect(page.locator('[data-testid="current-mode"]')).toHaveText('Beginner');
    
    // Check Carbon
    await page.click('[data-testid="element-6"]');
    await expect(page.locator('[data-testid="right-panel-element-name"]')).toHaveText('Carbon');
    await expect(page.locator('[data-testid="right-panel-everyday-uses"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
    
    // Switch mode briefly to see it works, then back
    await page.click('[data-testid="difficulty-intermediate"]');
    await expect(page.locator('[data-testid="current-mode"]')).toHaveText('Intermediate');
    await page.click('[data-testid="difficulty-beginner"]');
    
    // Check Oxygen
    await page.click('[data-testid="element-8"]');
    await expect(page.locator('[data-testid="right-panel-element-name"]')).toHaveText('Oxygen');
    await expect(page.locator('[data-testid="right-panel-everyday-uses"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
    
    // Check Iron
    await page.click('[data-testid="element-26"]');
    await expect(page.locator('[data-testid="right-panel-element-name"]')).toHaveText('Iron');
    await expect(page.locator('[data-testid="right-panel-everyday-uses"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
  });

  test('Scenario 2: An advanced user studying electron configurations and spectra', async ({ page }) => {
    // Set mode to Advanced
    await page.click('[data-testid="difficulty-advanced"]');
    await expect(page.locator('[data-testid="current-mode"]')).toHaveText('Advanced');
    
    // Examine transition metal (e.g., Titanium)
    const titaniumCard = page.locator('[data-testid="element-22"]');
    await expect(titaniumCard.locator('.electron-configuration')).toBeVisible();
    
    // Open modal for spectra
    await titaniumCard.click();
    await expect(page.locator('[data-testid="right-panel-element-name"]')).toHaveText('Titanium');
    await expect(page.locator('[data-testid="right-panel-advanced-data"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
    
    // Examine another transition metal (e.g., Copper)
    await page.click('[data-testid="element-29"]');
    await expect(page.locator('[data-testid="right-panel-element-name"]')).toHaveText('Copper');
    await expect(page.locator('[data-testid="right-panel-advanced-data"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
  });

  test('Scenario 3: A user rapidly switching modes while exploring different element groups', async ({ page }) => {
    // Toggle to Intermediate
    await page.click('[data-testid="difficulty-intermediate"]');
    
    // Click a Halogen (Fluorine)
    await page.click('[data-testid="element-9"]');
    await expect(page.locator('[data-testid="right-panel-intermediate-details"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
    
    // Rapid toggle
    await page.click('[data-testid="difficulty-advanced"]');
    await page.click('[data-testid="difficulty-beginner"]');
    await page.click('[data-testid="difficulty-advanced"]');
    
    // Click an Actinide (Uranium)
    await page.click('[data-testid="element-92"]');
    await expect(page.locator('[data-testid="right-panel-advanced-data"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
  });

  test('Scenario 4: A user opening modals and closing them across random elements', async ({ page }) => {
    test.slow();
    const randomElements = [1, 15, 30, 45, 60, 75, 90, 118]; // Just a deterministic spread
    
    for (const atomicNumber of randomElements) {
      await page.click(`[data-testid="element-${atomicNumber}"]`);
      await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
      await page.click('[data-testid="right-panel-close"]');
      await expect(page.locator('[data-testid="right-panel"]')).not.toBeVisible();
    }
  });

  test('Scenario 5: A complete walkthrough from beginner to advanced on a single element', async ({ page }) => {
    // Beginner mode on Carbon
    await expect(page.locator('[data-testid="current-mode"]')).toHaveText('Beginner');
    await page.click('[data-testid="element-6"]');
    await expect(page.locator('[data-testid="right-panel-everyday-uses"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
    
    // Intermediate mode on Carbon
    await page.click('[data-testid="difficulty-intermediate"]');
    await page.click('[data-testid="element-6"]');
    await expect(page.locator('[data-testid="right-panel-intermediate-details"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
    
    // Advanced mode on Carbon
    await page.click('[data-testid="difficulty-advanced"]');
    await page.click('[data-testid="element-6"]');
    await expect(page.locator('[data-testid="right-panel-advanced-data"]')).toBeVisible();
    await page.click('[data-testid="right-panel-close"]');
  });
});
