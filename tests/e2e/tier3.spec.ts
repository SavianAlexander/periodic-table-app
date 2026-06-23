import { test, expect } from '@playwright/test';

test.describe('Tier 3: Pairwise Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('Mode = Beginner + Action = Open Panel + Target = Alkali Metal', async ({ page }) => {
    await page.click('[data-testid="difficulty-beginner"]');
    await page.click('[data-testid="element-3"]'); // Lithium
    await expect(page.locator('[data-testid="right-panel-everyday-uses"]')).toBeVisible();
    await expect(page.locator('[data-testid="right-panel-element-name"]')).toHaveText('Lithium');
  });

  test('Mode = Advanced + Action = Open Panel + Target = Noble Gas', async ({ page }) => {
    await page.click('[data-testid="difficulty-advanced"]');
    await page.click('[data-testid="element-10"]'); // Neon
    await expect(page.locator('[data-testid="right-panel-advanced-data"]')).toBeVisible();
    await expect(page.locator('[data-testid="right-panel-element-name"]')).toHaveText('Neon');
  });

  test('Window Resize + Action = Toggle Mode + Verification = Card Layout remains stable', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.click('[data-testid="difficulty-intermediate"]');
    const grid = page.locator('[data-testid="periodic-table-grid"]');
    const columns = await grid.evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
    expect(columns).not.toBe('none');
  });

  test('State = Panel Open + Action = Resize Window + Verification = Panel remains right-aligned', async ({ page }) => {
    await page.click('[data-testid="element-6"]');
    const panel = page.locator('[data-testid="right-panel"]');
    await expect(panel).toBeVisible();
    await page.setViewportSize({ width: 800, height: 600 });
    
    const boundingBox = await panel.boundingBox();
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      const rightEdge = boundingBox.x + boundingBox.width;
      expect(Math.abs(rightEdge - 800)).toBeLessThan(10); // Right-aligned to viewport
    }
  });

  test('Cycle Mode (Beg -> Int -> Adv -> Beg) + Action = Hover Element + Verification = Animations perform smoothly in all states', async ({ page }) => {
    test.slow();
    const modes = ['beginner', 'intermediate', 'advanced', 'beginner'];
    const element = page.locator('[data-testid="element-6"]');
    
    for (const mode of modes) {
      await page.click(`[data-testid="difficulty-${mode}"]`);
      await element.hover();
      await expect(element).toHaveCSS('transform', /matrix/);
    }
  });

  test('State = Panel Open in Beginner -> Close Panel -> Switch to Advanced -> Open same Panel -> Verify deep content loads', async ({ page }) => {
    // Open in Beginner
    await page.click('[data-testid="difficulty-beginner"]');
    await page.click('[data-testid="element-6"]');
    await expect(page.locator('[data-testid="right-panel-everyday-uses"]')).toBeVisible();
    
    // Close Panel
    await page.click('[data-testid="right-panel-close"]');
    
    // Switch to Advanced
    await page.click('[data-testid="difficulty-advanced"]');
    
    // Open Same Panel
    await page.click('[data-testid="element-6"]');
    await expect(page.locator('[data-testid="right-panel-advanced-data"]')).toBeVisible();
    await expect(page.locator('[data-testid="right-panel-everyday-uses"]')).not.toBeVisible();
  });
});
