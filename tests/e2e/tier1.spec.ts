import { test, expect } from '@playwright/test';

test.describe('Tier 1: Core Functionality (Happy Path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Feature 1: IUPAC Layout', () => {
    test('Main grid container is visible and utilizes CSS Grid', async ({ page }) => {
      const grid = page.locator('[data-testid="periodic-table-grid"]');
      await expect(grid).toBeVisible();
      const display = await grid.evaluate((el) => window.getComputedStyle(el).display);
      expect(display).toBe('grid');
    });

    test('Exactly 118 element cards are rendered in the DOM', async ({ page }) => {
      const elements = page.locator('[data-testid^="element-"]');
      await expect(elements).toHaveCount(118);
    });

    test('Element 1 (Hydrogen) is in the top-left position', async ({ page }) => {
      const hydrogen = page.locator('[data-testid="element-1"]');
      await expect(hydrogen).toBeVisible();
      const text = await hydrogen.textContent();
      expect(text).toContain('H');
    });

    test('Element 2 (Helium) is in the top-right position', async ({ page }) => {
      const helium = page.locator('[data-testid="element-2"]');
      await expect(helium).toBeVisible();
      const text = await helium.textContent();
      expect(text).toContain('He');
    });

    test('Element 118 (Oganesson) is present at the end of the 7th period', async ({ page }) => {
      const oganesson = page.locator('[data-testid="element-118"]');
      await expect(oganesson).toBeVisible();
      const text = await oganesson.textContent();
      expect(text).toContain('Og');
    });
  });

  test.describe('Feature 2: Difficulty Toggle', () => {
    test('Toggle UI is visible on the page', async ({ page }) => {
      const toggle = page.locator('[data-testid="difficulty-toggle"]');
      await expect(toggle).toBeVisible();
    });

    test('Default difficulty mode is set to "Beginner"', async ({ page }) => {
      const mode = page.locator('[data-testid="current-mode"]');
      await expect(mode).toHaveText('Beginner');
    });

    test('User can switch to "Intermediate" mode', async ({ page }) => {
      await page.click('[data-testid="difficulty-intermediate"]');
      const mode = page.locator('[data-testid="current-mode"]');
      await expect(mode).toHaveText('Intermediate');
    });

    test('User can switch to "Advanced" mode', async ({ page }) => {
      await page.click('[data-testid="difficulty-advanced"]');
      const mode = page.locator('[data-testid="current-mode"]');
      await expect(mode).toHaveText('Advanced');
    });

    test('User can cycle back from Advanced to Beginner mode', async ({ page }) => {
      await page.click('[data-testid="difficulty-advanced"]');
      await page.click('[data-testid="difficulty-beginner"]');
      const mode = page.locator('[data-testid="current-mode"]');
      await expect(mode).toHaveText('Beginner');
    });
  });

  test.describe('Feature 3: Card Content Updates', () => {
    test('Beginner mode displays basic properties (Symbol, Atomic Number)', async ({ page }) => {
      await page.click('[data-testid="difficulty-beginner"]');
      const element = page.locator('[data-testid="element-6"]');
      await expect(element.locator('.symbol')).toHaveText('C');
      await expect(element.locator('.atomic-number')).toHaveText('6');
      await expect(element.locator('.atomic-mass')).not.toBeVisible();
    });

    test('Intermediate mode displays extended properties (Atomic Mass)', async ({ page }) => {
      await page.click('[data-testid="difficulty-intermediate"]');
      const element = page.locator('[data-testid="element-6"]');
      await expect(element.locator('.atomic-mass')).toBeVisible();
    });

    test('Advanced mode displays complex properties (e.g., Electron Configuration)', async ({ page }) => {
      await page.click('[data-testid="difficulty-advanced"]');
      const element = page.locator('[data-testid="element-6"]');
      await expect(element.locator('.electron-configuration')).toBeVisible();
    });

    test('Toggling the difficulty updates the text content of existing cards dynamically', async ({ page }) => {
      const element = page.locator('[data-testid="element-6"]');
      await page.click('[data-testid="difficulty-beginner"]');
      await expect(element.locator('.electron-configuration')).not.toBeVisible();
      await page.click('[data-testid="difficulty-advanced"]');
      await expect(element.locator('.electron-configuration')).toBeVisible();
    });

    test('Element symbols are always visible regardless of the selected mode', async ({ page }) => {
      const element = page.locator('[data-testid="element-6"]');
      await page.click('[data-testid="difficulty-beginner"]');
      await expect(element.locator('.symbol')).toBeVisible();
      await page.click('[data-testid="difficulty-intermediate"]');
      await expect(element.locator('.symbol')).toBeVisible();
      await page.click('[data-testid="difficulty-advanced"]');
      await expect(element.locator('.symbol')).toBeVisible();
    });
  });

  test.describe('Feature 4: Detailed View Panel', () => {
    test('Clicking an element card opens a right panel overlay', async ({ page }) => {
      await page.click('[data-testid="element-6"]');
      const panel = page.locator('[data-testid="right-panel"]');
      await expect(panel).toBeVisible();
    });

    test('The panel displays the full name of the clicked element', async ({ page }) => {
      await page.click('[data-testid="element-6"]');
      const panelName = page.locator('[data-testid="right-panel-element-name"]');
      await expect(panelName).toHaveText('Carbon');
    });

    test('The panel contains a visible "Close" button', async ({ page }) => {
      await page.click('[data-testid="element-6"]');
      const closeButton = page.locator('[data-testid="right-panel-close"]');
      await expect(closeButton).toBeVisible();
    });

    test('Clicking the "Close" button removes the panel from the screen', async ({ page }) => {
      await page.click('[data-testid="element-6"]');
      await page.click('[data-testid="right-panel-close"]');
      const panel = page.locator('[data-testid="right-panel"]');
      await expect(panel).not.toBeVisible();
    });

    test('Clicking outside the panel area closes the panel', async ({ page }) => {
      await page.click('[data-testid="element-6"]');
      const panelOverlay = page.locator('[data-testid="right-panel-overlay"]');
      await panelOverlay.click({ position: { x: 10, y: 10 } });
      const panel = page.locator('[data-testid="right-panel"]');
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('Feature 5: Panel Content Updates', () => {
    test('In Beginner mode, the panel displays "everyday uses"', async ({ page }) => {
      await page.click('[data-testid="difficulty-beginner"]');
      await page.click('[data-testid="element-6"]');
      const uses = page.locator('[data-testid="right-panel-everyday-uses"]');
      await expect(uses).toBeVisible();
    });

    test('In Intermediate mode, the panel displays intermediate scientific details', async ({ page }) => {
      await page.click('[data-testid="difficulty-intermediate"]');
      await page.click('[data-testid="element-6"]');
      const details = page.locator('[data-testid="right-panel-intermediate-details"]');
      await expect(details).toBeVisible();
    });

    test('In Advanced mode, the panel displays "emission spectra" or advanced data', async ({ page }) => {
      await page.click('[data-testid="difficulty-advanced"]');
      await page.click('[data-testid="element-6"]');
      const advanced = page.locator('[data-testid="right-panel-advanced-data"]');
      await expect(advanced).toBeVisible();
    });

    test('Panel content changes its structure/density corresponding to the active mode', async ({ page }) => {
      await page.click('[data-testid="difficulty-advanced"]');
      await page.click('[data-testid="element-6"]');
      const content = page.locator('[data-testid="right-panel-content"]');
      await expect(content).toHaveClass(/density-high/);
    });

    test('The panel content successfully renders for elements from different blocks (s, p, d, f)', async ({ page }) => {
      const blocks = ['element-1', 'element-6', 'element-26', 'element-60']; // H (s), C (p), Fe (d), Nd (f)
      for (const id of blocks) {
        await page.click(`[data-testid="${id}"]`);
        await expect(page.locator('[data-testid="right-panel-element-name"]')).toBeVisible();
        await page.click('[data-testid="right-panel-close"]');
      }
    });
  });
});
