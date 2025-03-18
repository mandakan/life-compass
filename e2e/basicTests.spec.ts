import { test, expect } from '@playwright/test';

test.describe('Life Compass App End-to-End Tests', () => {
  test('homepage loads and displays main navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait until document title is set
    await page.waitForFunction(() => document.title !== '');
    await expect(page).toHaveTitle(/(Life Compass|Livskompass)/);

    // Check that main navigation exists
    const nav = await page.$('nav');
    expect(nav).not.toBeNull();
  });

  test('footer is visible on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const footer = await page.$('footer');
    expect(footer).not.toBeNull();
  });

  test('language switcher works correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for the language switcher button to appear
    const languageSwitcher = await page.waitForSelector('#language-switcher', {
      state: 'visible',
      timeout: 10000,
    });
    expect(languageSwitcher).not.toBeNull();

    // Click the language switcher to open the language options
    await languageSwitcher.click();

    // Wait for a language option to appear (assume an option with data-lang="sv")
    const swedishOption = await page.waitForSelector('[data-lang="sv"]', {
      state: 'visible',
      timeout: 5000,
    });
    expect(swedishOption).not.toBeNull();

    // Click the Swedish language option
    await swedishOption.click();

    // Wait for the page to update and verify that a Swedish term is present
    await page.waitForTimeout(500);
    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Livskompass');
  });
});
