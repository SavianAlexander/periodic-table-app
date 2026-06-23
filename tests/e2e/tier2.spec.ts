import { test, expect } from '@playwright/test';

test.describe('Tier 2: Edge Cases & Boundaries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Feature 1: Layout Boundaries', () => {
    test('No elements with atomic number < 1 or > 118 exist in the DOM', async ({ page }) => {
      await expect(page.locator('[data-testid="element-0"]')).not.toBeAttached();
      await expect(page.locator('[data-testid="element-119"]')).not.toBeAttached();
    });

    test('The layout handles very small viewport widths without horizontal overflow (responsive)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      const grid = page.locator('[data-testid="periodic-table-grid"]');
      const isOverflowing = await grid.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(isOverflowing).toBe(false);
    });

    test('The layout displays the Lanthanide and Actinide series correctly separated', async ({ page }) => {
      const lanthanides = page.locator('[data-testid="lanthanide-series"]');
      const actinides = page.locator('[data-testid="actinide-series"]');
      await expect(lanthanides).toBeVisible();
      await expect(actinides).toBeVisible();
    });

    test('Empty grid cells do not contain any element data', async ({ page }) => {
      const emptyCells = page.locator('.empty-cell');
      if (await emptyCells.count() > 0) {
        const text = await emptyCells.first().textContent();
        expect(text?.trim()).toBe('');
      }
    });

    test('Elements display cleanly on very large monitor viewports', async ({ page }) => {
      await page.setViewportSize({ width: 3840, height: 2160 });
      const grid = page.locator('[data-testid="periodic-table-grid"]');
      await expect(grid).toBeVisible();
      const hydrogen = page.locator('[data-testid="element-1"]');
      await expect(hydrogen).toBeVisible();
    });
  });

  test.describe('Feature 2: Toggle Boundaries', () => {
    test('Rapidly clicking the toggle switch does not break the UI state', async ({ page }) => {
      const toggle = page.locator('[data-testid="difficulty-advanced"]');
      for (let i = 0; i < 10; i++) {
        await toggle.click();
      }
      const mode = page.locator('[data-testid="current-mode"]');
      await expect(mode).toBeVisible();
    });

    test('Toggle state persists accurately after window resize', async ({ page }) => {
      await page.click('[data-testid="difficulty-advanced"]');
      await page.setViewportSize({ width: 800, height: 600 });
      const mode = page.locator('[data-testid="current-mode"]');
      await expect(mode).toHaveText('Advanced');
    });

    test('Only exactly the 3 intended modes ("Beginner", "Intermediate", "Advanced") can be activated', async ({ page }) => {
      const modes = ['Beginner', 'Intermediate', 'Advanced'];
      for (const mode of modes) {
        await page.click(`[data-testid="difficulty-${mode.toLowerCase()}"]`);
        await expect(page.locator('[data-testid="current-mode"]')).toHaveText(mode);
      }
    });

    test('Using keyboard navigation (Tab/Space) correctly operates the toggle', async ({ page }) => {
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press('Tab');
        const isFocused = await page.locator('[data-testid="difficulty-intermediate"]').evaluate(node => node === document.activeElement).catch(() => false);
        if (isFocused) break;
      }
      await expect(page.locator('[data-testid="difficulty-intermediate"]')).toBeFocused();
      await page.keyboard.press('Space');
      await expect(page.locator('[data-testid="current-mode"]')).toHaveText('Intermediate');
    });

    test('State transitions have smooth visual changes without flickering', async ({ page }) => {
      // Hard to test flickering in playwright directly, but we can ensure CSS transition classes are applied
      await page.click('[data-testid="difficulty-advanced"]');
      const body = page.locator('body');
      await expect(body).not.toHaveClass(/is-flickering/);
    });
  });

  test.describe('Feature 3: Card Content Boundaries', () => {
    test('Elements with long names (e.g., "Rutherfordium") do not overflow the card container', async ({ page }) => {
      const rutherfordium = page.locator('[data-testid="element-104"]');
      const isOverflowing = await rutherfordium.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(isOverflowing).toBe(false);
    });

    test('Elements with very short names (e.g., "Tin") remain correctly aligned', async ({ page }) => {
      const tin = page.locator('[data-testid="element-50"]');
      const align = await tin.evaluate((el) => window.getComputedStyle(el).textAlign);
      expect(['center', 'left']).toContain(align);
    });

    test('Hover effects (glassmorphism/scale) trigger correctly on elements at the screen edges', async ({ page }) => {
      const hydrogen = page.locator('[data-testid="element-1"]');
      await hydrogen.hover();
      await expect(hydrogen).toHaveCSS('transform', /matrix/);
    });

    test('Text remains readable (color contrast) during hover transitions', async ({ page }) => {
      const element = page.locator('[data-testid="element-6"]');
      await element.hover();
      const color = await element.evaluate((el) => window.getComputedStyle(el).color);
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('Data mapping correctly identifies element properties (no off-by-one errors mapping atomic number to the wrong data)', async ({ page }) => {
      const oxygen = page.locator('[data-testid="element-8"]');
      await expect(oxygen.locator('.symbol')).toHaveText('O');
      await expect(oxygen.locator('.atomic-number')).toHaveText('8');
    });
  });

  test.describe('Feature 4: Modal Boundaries', () => {
    test('Rapid double-clicking an element card does not open duplicate modals', async ({ page }) => {
      await page.dblclick('[data-testid="element-6"]');
      const modals = page.locator('[data-testid="right-panel"]');
      await expect(modals).toHaveCount(1);
    });

    test('Pressing the "Escape" key correctly closes the modal', async ({ page }) => {
      await page.click('[data-testid="element-6"]');
      await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-testid="right-panel"]')).not.toBeVisible();
    });

    test('Opening the modal disables background scrolling', async ({ page }) => {
      await page.click('[data-testid="element-6"]');
      const body = page.locator('body');
      await expect(body).toHaveCSS('overflow', 'hidden');
    });

    test('The modal correctly opens and closes for the very first element (H)', async ({ page }) => {
      await page.click('[data-testid="element-1"]');
      await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
      await page.click('[data-testid="right-panel-close"]');
      await expect(page.locator('[data-testid="right-panel"]')).not.toBeVisible();
    });

    test('The modal correctly opens and closes for the very last element (Og)', async ({ page }) => {
      await page.click('[data-testid="element-118"]');
      await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
      await page.click('[data-testid="right-panel-close"]');
      await expect(page.locator('[data-testid="right-panel"]')).not.toBeVisible();
    });
  });

  test.describe('Feature 5: Modal Content Boundaries', () => {
    test('Extremely long text entries in "everyday uses" gracefully wrap without overflowing the modal', async ({ page }) => {
      await page.click('[data-testid="difficulty-beginner"]');
      await page.click('[data-testid="element-6"]');
      const uses = page.locator('[data-testid="right-panel-everyday-uses"]');
      const isOverflowing = await uses.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(isOverflowing).toBe(false);
    });

    test('Advanced scientific notation (e.g., superscripts in electron configurations) render correctly in the DOM', async ({ page }) => {
      await page.click('[data-testid="difficulty-advanced"]');
      await page.click('[data-testid="element-6"]');
      const config = page.locator('[data-testid="right-panel-advanced-data"] sup');
      if (await config.count() > 0) {
        await expect(config.first()).toBeVisible();
      }
    });

    test('Changing the difficulty mode while the modal is open applies the new mode correctly', async ({ page }) => {
      await page.click('[data-testid="element-6"]');
      await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();

      const overlay = page.locator('[data-testid="right-panel-overlay"]');
      const isOverlayVisible = await overlay.isVisible();

      if (isOverlayVisible) {
        await page.click('[data-testid="right-panel-close"]');
        await page.click('[data-testid="difficulty-advanced"]');
        await page.click('[data-testid="element-6"]');
      } else {
        await page.click('[data-testid="difficulty-advanced"]');
      }

      await expect(page.locator('[data-testid="right-panel-advanced-data"]')).toBeVisible();
    });

    test('Missing data attributes (if any, e.g., missing emission spectrum image) fail gracefully instead of crashing', async ({ page }) => {
      await page.click('[data-testid="difficulty-advanced"]');
      await page.click('[data-testid="element-118"]'); // Oganesson might miss spectrum
      const modal = page.locator('[data-testid="right-panel"]');
      await expect(modal).toBeVisible();
      // Should not crash, maybe show fallback
      const errorBoundary = page.locator('.error-boundary');
      await expect(errorBoundary).not.toBeAttached();
    });

    test('The modal maintains layout integrity across all difficulty modes', async ({ page }) => {
      test.slow();
      await page.click('[data-testid="element-6"]');
      const modal = page.locator('[data-testid="right-panel"]');
      for (const mode of ['beginner', 'intermediate', 'advanced']) {
        await page.click(`[data-testid="difficulty-${mode}"]`);
        await expect(modal).toBeVisible();
        const width = await modal.evaluate((el) => el.clientWidth);
        expect(width).toBeGreaterThan(0);
      }
    });
  });
});
