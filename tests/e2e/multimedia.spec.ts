import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    __speechSynthesisCalls: any[];
  }
}

test.describe('Multimedia and Multilingual Features E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Listen for page errors
    page.on('pageerror', (err) => {
      console.error('Browser Page Error:', err.message);
    });
    // Listen for console messages
    page.on('console', (msg) => {
      console.log(`BROWSER CONSOLE (${msg.type()}):`, msg.text());
    });

    await page.goto('/');
  });

  test('Should change language, verify curated video player, switch to local video and verify fallback/existence, and test speech synthesis stubbing', async ({ page }) => {
    // Clicking Hydrogen (element-1) displays the right panel
    const elementCard = page.locator('[data-testid="element-1"]');
    await elementCard.click();

    const rightPanel = page.locator('[data-testid="right-panel"]');
    await expect(rightPanel).toBeVisible();

    // Language select dropdown exists and has English ('en') selected by default
    const langSelect = page.locator('[data-testid="language-select"]');
    await expect(langSelect).toBeVisible();
    await expect(langSelect).toHaveValue('en');

    // Curated video player (iframe) is visible by default (since 'curated' is the default active video tab in RightPanel)
    const curatedIframe = page.locator('iframe.curated-video-iframe');
    await expect(curatedIframe).toBeVisible();

    // The iframe's src attribute includes correct language parameters (hl=en, cc_lang_pref=en, cc_load_policy=1)
    const enSrc = await curatedIframe.getAttribute('src');
    expect(enSrc).not.toBeNull();
    expect(enSrc).toContain('hl=en');
    expect(enSrc).toContain('cc_lang_pref=en');
    expect(enSrc).toContain('cc_load_policy=1');

    // Switching to Spanish ('es') updates the iframe's src attribute to have hl=es, cc_lang_pref=es, cc_load_policy=1
    await langSelect.selectOption('es');
    await expect(langSelect).toHaveValue('es');

    const esSrc = await curatedIframe.getAttribute('src');
    expect(esSrc).not.toBeNull();
    expect(esSrc).toContain('hl=es');
    expect(esSrc).toContain('cc_lang_pref=es');
    expect(esSrc).toContain('cc_load_policy=1');

    // Switch to the local video player tab (by clicking the 'Video Narrative' button)
    const localVideoTabBtn = page.locator('.media-section .tab-btn').first();
    await localVideoTabBtn.click();

    // Verify that the local video tab displays the fallback message data-testid="local-video-fallback":
    // "Offline local video narration not available. Please use the Curated Video tab to watch the online video lesson."
    const localVideoFallback = page.locator('[data-testid="local-video-fallback"]');
    await expect(localVideoFallback).toBeVisible();
    await expect(localVideoFallback).toHaveText(
      'Offline local video narration not available. Please use the Curated Video tab to watch the online video lesson.'
    );

    // Verify that the <video> element with data-testid="element-video-player" is still present in the DOM
    const videoPlayer = page.locator('[data-testid="element-video-player"]');
    await expect(videoPlayer).toBeAttached();

    // Reset calls list in case other things loaded/cancelled speech during transition
    await page.evaluate(() => {
      window.__speechSynthesisCalls = [];
    });

    // Click the Play button in the Voice Narrator controls, and evaluate window.__speechSynthesisCalls to assert that it contains a record for 'speak' with the correct narration text
    const voiceControls = page.locator('[data-testid="voice-narrator-controls"]');
    const playBtn = voiceControls.locator('.play-btn');
    await playBtn.click();

    const expectedNarrationText = "Hydrogen. Símbolo: H. Número Atómico: 1. Hydrogen (H) es un elemento químico con número atómico 1. Clasificado como un nonmetal, tiene una masa atómica de 1.008 u. Se usa comúnmente en aplicaciones como Balloons y Rocket fuel.";
    
    await expect.poll(async () => {
      const calls = await page.evaluate(() => window.__speechSynthesisCalls);
      const isSpeechObj = await page.evaluate(() => typeof window.speechSynthesis);
      console.log('DEBUG speech synthesis calls:', calls, 'type:', isSpeechObj);
      return calls.find(c => c.method === 'speak');
    }).toBeDefined();

    const callsSpeak = await page.evaluate(() => window.__speechSynthesisCalls);
    const speakCall = callsSpeak.find(c => c.method === 'speak');
    expect(speakCall.text).toBe(expectedNarrationText);

    // Click the Pause button, and assert that it contains a record for 'pause'
    const pauseBtn = voiceControls.locator('.pause-btn');
    await pauseBtn.click();

    await expect.poll(async () => {
      const calls = await page.evaluate(() => window.__speechSynthesisCalls);
      return calls.find(c => c.method === 'pause');
    }).toBeDefined();

    // Click the Stop button, and assert that it contains a record for 'cancel'
    const stopBtn = voiceControls.locator('.stop-btn');
    await stopBtn.click();

    await expect.poll(async () => {
      const calls = await page.evaluate(() => window.__speechSynthesisCalls);
      return calls.find(c => c.method === 'cancel');
    }).toBeDefined();
  });
});

