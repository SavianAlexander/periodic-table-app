import { test, expect } from '@playwright/test';

test.describe('Multimedia and Multilingual Features E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Should change language, update labels, and render video player and voice controls', async ({ page }) => {
    // Open element card for Hydrogen (atomic number 1)
    const elementCard = page.locator('[data-testid="element-1"]');
    await elementCard.click();

    // Verify right panel is visible
    const rightPanel = page.locator('[data-testid="right-panel"]');
    await expect(rightPanel).toBeVisible();

    // Language dropdown should be visible
    const langSelect = page.locator('[data-testid="language-select"]');
    await expect(langSelect).toBeVisible();
    await expect(langSelect).toHaveValue('en');

    // Video player should be present and active
    const videoPlayer = page.locator('[data-testid="element-video-player"]');
    await expect(videoPlayer).toBeVisible();
    await expect(videoPlayer).toHaveAttribute('src', '/videos/hydrogen_en.mp4');

    // Check voice narrator controls container is visible
    const voiceControls = page.locator('[data-testid="voice-narrator-controls"]');
    await expect(voiceControls).toBeVisible();

    // Check play, pause, stop buttons exist
    const playBtn = voiceControls.locator('.play-btn');
    const pauseBtn = voiceControls.locator('.pause-btn');
    const stopBtn = voiceControls.locator('.stop-btn');
    await expect(playBtn).toBeVisible();
    await expect(pauseBtn).toBeVisible();
    await expect(stopBtn).toBeVisible();

    // Switch to Spanish
    await langSelect.selectOption('es');
    await expect(langSelect).toHaveValue('es');

    // Video player src should update to Spanish video
    await expect(videoPlayer).toHaveAttribute('src', '/videos/hydrogen_es.mp4');

    // Change to French
    await langSelect.selectOption('fr');
    await expect(langSelect).toHaveValue('fr');

    // Video player src should update to French video
    await expect(videoPlayer).toHaveAttribute('src', '/videos/hydrogen_fr.mp4');
  });
});
