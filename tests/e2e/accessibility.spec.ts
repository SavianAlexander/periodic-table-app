import { test, expect } from '@playwright/test';

test.describe('Government Compliance & Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main application page
    await page.goto('http://127.0.0.1:5173');
  });

  test('Should toggle high-contrast accessibility mode and update elements', async ({ page }) => {
    // Locate accessibility toggle button
    const accessibilityBtn = page.locator('button.accessibility-toggle-btn');
    await expect(accessibilityBtn).toBeVisible();

    // Click to enable accessibility mode
    await accessibilityBtn.click();
    await expect(accessibilityBtn).toContainText('High Contrast Mode Active');

    // Verify root App container has accessibility-mode class
    await expect(page.locator('.App')).toHaveClass(/accessibility-mode/);

    // Click again to disable accessibility mode
    await accessibilityBtn.click();
    await expect(accessibilityBtn).toContainText('Enable High Contrast');
    await expect(page.locator('.App')).not.toHaveClass(/accessibility-mode/);
  });

  test('Should navigate to Teacher Resources and inspect NGSS standards alignment', async ({ page }) => {
    // Navigate to Teacher Resources
    await page.locator('button:has-text("Teacher Resources")').click();
    await expect(page.locator('h2:has-text("Official Government K-12 Teacher Resources")')).toBeVisible();

    // Verify standards cards are rendered
    await expect(page.locator('.standards-panel')).toContainText('HS-PS1-1');
    await expect(page.locator('.standards-panel')).toContainText('HS-PS1-7');
    await expect(page.locator('.standards-panel')).toContainText('HS-PS1-8');

    // Verify student laboratory sheets are present
    await expect(page.locator('.labsheets-panel')).toContainText('Dr. Covalent: Organic Molecule Stabilities');
    await expect(page.locator('.labsheets-panel')).toContainText('Titration Lab: Analytical Neutralization');
  });
});
