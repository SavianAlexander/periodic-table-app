import { test, expect } from '@playwright/test';

test.describe('Adversarial Challenger: Robustness & Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Searching for non-existent elements', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // 1. Search for non-existent symbol/name "Xyz"
    await searchInput.fill('Xyz');
    
    // All 118 standard elements should be dimmed, none highlighted
    const elementsCount = 118;
    for (let i = 1; i <= elementsCount; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
      await expect(card).not.toHaveClass(/highlighted/);
    }

    // 2. Search for non-existent element "Nonexistentium"
    await searchInput.fill('Nonexistentium');
    for (let i = 1; i <= elementsCount; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
      await expect(card).not.toHaveClass(/highlighted/);
    }

    // 3. Search for non-existent atomic number "999"
    await searchInput.fill('999');
    for (let i = 1; i <= elementsCount; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
      await expect(card).not.toHaveClass(/highlighted/);
    }

    // 4. Special/Regex character safety
    await searchInput.fill('[a-z]+');
    for (let i = 1; i <= elementsCount; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
    }
  });

  test('Range queries with extreme values', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // 1. Extreme mass > 1000000 (all elements should be dimmed, none highlighted)
    await searchInput.fill('mass > 1000000');
    for (let i = 1; i <= 118; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
      await expect(card).not.toHaveClass(/highlighted/);
    }

    // 2. Extreme electronegativity < -100 (all elements should be dimmed)
    await searchInput.fill('electronegativity < -100');
    for (let i = 1; i <= 118; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
    }

    // 3. Negative mass filter (mass < 0) (all elements should be dimmed)
    await searchInput.fill('mass < 0');
    for (let i = 1; i <= 118; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
    }

    // 4. Negative atomic number filter (number = -1) (all elements should be dimmed)
    await searchInput.fill('number = -1');
    for (let i = 1; i <= 118; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
    }

    // 5. Query matching all elements (mass > -10) -> all elements should be highlighted, none dimmed
    await searchInput.fill('mass > -10');
    for (let i = 1; i <= 118; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/highlighted/);
      await expect(card).not.toHaveClass(/dimmed/);
    }

    // 6. Malformed query: "mass >" (treated as substring, all dimmed)
    await searchInput.fill('mass >');
    for (let i = 1; i <= 118; i++) {
      const card = page.locator(`[data-testid="element-${i}"]`);
      await expect(card).toHaveClass(/dimmed/);
    }
  });

  test('Rapid mode and legend transitions', async ({ page }) => {
    test.slow();
    // 1. Rapidly click difficulty modes
    const beginnerBtn = page.locator('[data-testid="difficulty-beginner"]');
    const intermediateBtn = page.locator('[data-testid="difficulty-intermediate"]');
    const advancedBtn = page.locator('[data-testid="difficulty-advanced"]');
    const currentMode = page.locator('[data-testid="current-mode"]');

    // Perform rapid transitions
    await beginnerBtn.click({ force: true });
    await intermediateBtn.click({ force: true });
    await advancedBtn.click({ force: true });
    await beginnerBtn.click({ force: true });
    await advancedBtn.click({ force: true });

    // Verify it ends up in the correct final state and does not crash
    await expect(currentMode).toHaveText('Advanced');

    // 2. Rapidly toggle legend groups
    const alkaliBtn = page.locator('[data-testid="legend-alkali-metal"]');
    const nobleBtn = page.locator('[data-testid="legend-noble-gas"]');

    await alkaliBtn.click({ force: true });
    await expect(alkaliBtn).toHaveClass(/active/);
    await alkaliBtn.click({ force: true }); // toggle off alkali
    await expect(alkaliBtn).not.toHaveClass(/active/);

    await nobleBtn.click({ force: true });
    await expect(nobleBtn).toHaveClass(/active/);
    await nobleBtn.click({ force: true }); // toggle off noble gas
    await expect(nobleBtn).not.toHaveClass(/active/);

    // 3. Rapid open/close of Right Panel
    const hCard = page.locator('[data-testid="element-1"]');
    const heCard = page.locator('[data-testid="element-2"]');
    const rightPanel = page.locator('[data-testid="right-panel"]');
    const closeBtn = page.locator('[data-testid="right-panel-close"]');

    // Open Hydrogen, close it
    await hCard.click({ force: true });
    await expect(rightPanel).toBeVisible();
    await closeBtn.click({ force: true });
    await expect(rightPanel).not.toBeVisible();

    // Open Helium, close it
    await heCard.click({ force: true });
    await expect(rightPanel).toBeVisible();
    await closeBtn.click({ force: true });
    await expect(rightPanel).not.toBeVisible();

    // Open Hydrogen, switch difficulty *while* open
    await hCard.click({ force: true });
    await expect(rightPanel).toBeVisible();

    await beginnerBtn.click({ force: true });
    await expect(page.locator('[data-testid="right-panel-everyday-uses"]')).toBeVisible();

    await intermediateBtn.click({ force: true });
    await expect(page.locator('[data-testid="right-panel-intermediate-details"]')).toBeVisible();

    await advancedBtn.click({ force: true });
    await expect(page.locator('[data-testid="right-panel-advanced-data"]')).toBeVisible();

    // Close panel
    await closeBtn.click({ force: true });
    await expect(rightPanel).not.toBeVisible();
  });
});
