import { test, expect } from '@playwright/test';

test.describe('Tier 5: Adversarial Coverage Hardening', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ElementCard keyboard interaction: Enter and Space keys open the modal', async ({ page }) => {
    const card = page.locator('[data-testid="element-1"]');
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
    await page.keyboard.press('Escape'); // Also tests escape key closing
    await expect(page.locator('[data-testid="right-panel"]')).not.toBeVisible();

    await card.focus();
    await page.keyboard.press(' '); // Space
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
  });

  test('ElementModal: Escape key closes the modal', async ({ page }) => {
    await page.locator('[data-testid="element-2"]').click();
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="right-panel"]')).not.toBeVisible();
  });

  test('ElementModal: Tab focus trapping inside the modal', async ({ page }) => {
    await page.locator('[data-testid="element-3"]').click();
    const modal = page.locator('[data-testid="right-panel"]');
    await expect(modal).toBeVisible();

    // Verify initial focus is on close button
    const closeBtn = page.locator('[data-testid="right-panel-close"]');
    await expect(closeBtn).toBeFocused();

    // Press Tab
    await page.keyboard.press('Tab');
    
    // Evaluate if focus is still within the modal
    const isFocusInside = await modal.evaluate((modalNode) => modalNode.contains(document.activeElement));
    expect(isFocusInside).toBe(true);

    // Press Shift+Tab
    await page.keyboard.press('Shift+Tab');
    const isFocusInsideShift = await modal.evaluate((modalNode) => modalNode.contains(document.activeElement));
    expect(isFocusInsideShift).toBe(true);
  });

  test('ElementModal: Restores focus to modal if tabbed from outside', async ({ page }) => {
    await page.locator('[data-testid="element-4"]').click();
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();

    // Move focus outside modal artificially
    await page.evaluate(() => {
      const input = document.createElement('input');
      input.id = 'outside-input';
      document.body.appendChild(input);
      input.focus();
    });

    // Press Tab - should trap it back to the modal
    await page.keyboard.press('Tab');
    
    const modal = page.locator('[data-testid="right-panel"]');
    const isFocusInside = await modal.evaluate((modalNode) => modalNode.contains(document.activeElement));
    expect(isFocusInside).toBe(true);
  });

  test('Missing Data Fallbacks: Renders "Data not available" for missing data', async ({ page }) => {
    // Intercept elements.json network request to inject mock data for fallback testing.
    await page.route('**/elements.json*', async (route) => {
      const mockData = [
        {
          atomicNumber: 119,
          symbol: "Uue",
          name: "Ununennium",
          atomicMass: 315,
          // Intentionally omitting groupBlock, electronConfiguration, emissionSpectra, everydayUses
        }
      ];
      await route.fulfill({
        contentType: 'application/javascript',
        body: `export default ${JSON.stringify(mockData)};`
      });
    });

    // Reload the page to attempt route interception
    await page.goto('/');
    
    // We check if the mock was successfully applied
    const mockCard = page.locator('[data-testid="element-119"]');
    await expect(mockCard).toBeVisible();

    await mockCard.click();
    
    // Test beginner right-panel-everyday-uses fallback
    await expect(page.locator('.right-panel-section').filter({ hasText: 'Everyday Uses' })).toContainText('Data not available');
    
    // Switch to Advanced to test other fallbacks
    await page.click('[data-testid="right-panel-close"]');
    await page.click('[data-testid="difficulty-advanced"]');
    await mockCard.click();

    // Test electronConfiguration fallback
    await expect(page.locator('.right-panel-section').filter({ hasText: 'Electron Configuration' })).toContainText('Data not available');
    
    // Test emissionSpectra fallback
    await expect(page.locator('.right-panel-section').filter({ hasText: 'Emission Spectra' })).toContainText('Data not available');
  });

  test('Grid Layout Fallback: Handle invalid atomic numbers gracefully', async ({ page }) => {
    // Tests the grid positioning fallback logic (return { row: 1, col: 1 }) using the same mock strategy.
    await page.route('**/elements.json*', async (route) => {
      const mockData = [
        {
          atomicNumber: 999, // Exceeds all normal ranges
          symbol: "Mock",
          name: "Mockium",
          atomicMass: 1000,
        }
      ];
      await route.fulfill({
        contentType: 'application/javascript',
        body: `export default ${JSON.stringify(mockData)};`
      });
    });

    await page.goto('/');
    
    const mockCard = page.locator('[data-testid="element-999"]');
    await expect(mockCard).toBeVisible();

    // The fallback in getGridPosition should set row 1, col 1
    await expect(mockCard).toHaveCSS('grid-row-start', '1');
    await expect(mockCard).toHaveCSS('grid-column-start', '1');
  });
});
