import { test, expect } from '@playwright/test';

test.describe('Empirical Verification: Keyboard Double Click Bug', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Rapid double-Enter on an element card', async ({ page }) => {
    const elementCard = page.locator('[data-testid="element-6"]');
    
    // Focus the card
    await elementCard.focus();

    // Press Enter to open
    await page.keyboard.press('Enter');
    
    // The panel should open and focus should move to close button
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();

    // If user presses Enter again very quickly, it hits the close button
    await page.keyboard.press('Enter');

    // The panel closes. This is expected since they triggered the close button.
    await expect(page.locator('[data-testid="right-panel"]')).not.toBeVisible();
  });
});
