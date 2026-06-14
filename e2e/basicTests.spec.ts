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
    const languageSwitcher = await page.getByTestId('language-switcher-home');

    expect(languageSwitcher).not.toBeNull();

    // Click the language switcher to open the language options
    await languageSwitcher.click();

    // Wait for a language option to appear
    const swedishOption = await page.getByRole('option', { name: /svenska/i });
    expect(swedishOption).not.toBeNull();

    // Click the Swedish language option
    await swedishOption.click();

    // Wait for the page to update and verify that a Swedish term is present
    await page.waitForTimeout(500);
    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Livskompass');
  });

  test('a saved snapshot survives a page reload', async ({ page }) => {
    // Skip the onboarding overlay. addInitScript re-runs on every navigation,
    // including the reload below, so the flag stays set.
    await page.addInitScript(() => {
      window.localStorage.setItem('tutorialCompleted', 'true');
    });

    // Enter at the root and navigate via the app's own router so the URL keeps
    // whatever base path the build uses (e.g. /life-compass on GitHub Pages).
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page
      .getByRole('button', { name: /start your journey/i })
      .first()
      .click();

    // Open the quick-actions popover and give the snapshot some content.
    await page.getByRole('button', { name: /quick actions/i }).click();
    await page.getByRole('button', { name: /add predefined/i }).click();

    // Save a dated snapshot through the real UI.
    await page.getByRole('button', { name: /save snapshot/i }).click();

    // The history section appears once at least one snapshot exists.
    await expect(
      page.getByRole('heading', { name: /snapshot history/i }),
    ).toBeVisible();

    // The whole point: it must still be there after a full reload (persistence).
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /snapshot history/i }),
    ).toBeVisible();
  });
});
