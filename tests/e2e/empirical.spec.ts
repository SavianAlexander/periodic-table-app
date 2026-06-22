import { test, expect } from '@playwright/test';

test.describe('Empirical Verification: Double Click Bug', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Rapid double-clicking an element card should keep the panel open', async ({ page }) => {
    const elementCard = page.locator('[data-testid="element-6"]');
    
    // We simulate a double click where the first click triggers the panel
    // and the second click lands on the overlay.
    // page.dblclick() might target the same element twice. Let's do manual clicks to simulate exactly.
    // Wait, if the overlay appears instantly, the second click of page.dblclick() will hit the overlay?
    // Let's just use page.mouse.click.
    
    const box = await elementCard.boundingBox();
    if (!box) throw new Error("Could not find box");
    
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    // First click to open the panel
    await page.mouse.click(x, y, { clickCount: 1 });
    
    // Ensure panel is open
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();

    // Second click rapidly at the same coordinates, with clickCount: 2 to simulate the second part of a double click
    // Note: Playwright's page.mouse.click with clickCount sends multiple clicks. 
    // We can also just use dblclick() on the coordinates.
    // Let's use dblclick to be realistic to user behavior.
    
    // Wait, let's close it first and test a natural double click.
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="right-panel"]')).not.toBeVisible();

    // Natural double click on the card coordinates
    await page.mouse.dblclick(x, y);

    // After double click, the panel should be visible!
    // If the bug exists, the second click of the double click will hit the overlay and close it, so it won't be visible.
    // If the fix works, it will stay visible.
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
  });
});
