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

    // Open the overflow "More" menu (action bar) and seed some content.
    await page.getByRole('button', { name: /quick actions/i }).click();
    await page.getByRole('button', { name: /add predefined/i }).click();

    // The segmented Cards / Radar view toggle replaces the old mystery FAB.
    await page.getByRole('button', { name: /^radar/i }).click();
    await page.getByRole('button', { name: /^cards/i }).click();

    // Save a dated snapshot through the real UI (reopen the overflow menu).
    await page.getByRole('button', { name: /quick actions/i }).click();
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

  test('a goal with a checked step survives a page reload', async ({
    page,
  }) => {
    // Skip onboarding; addInitScript re-runs on the reload below too.
    await page.addInitScript(() => {
      window.localStorage.setItem('tutorialCompleted', 'true');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page
      .getByRole('button', { name: /start your journey/i })
      .first()
      .click();

    // Seed some life areas so a card with a Goals button exists.
    await page.getByRole('button', { name: /quick actions/i }).click();
    await page.getByRole('button', { name: /add predefined/i }).click();

    // Open the first card's goals dialog (flag icon + count).
    await page
      .getByRole('button', { name: /^goals/i })
      .first()
      .click();

    // Add a goal through the real UI.
    const goalInput = page.getByLabel(/add goal/i);
    await goalInput.fill('Run a 5k');
    await page.getByRole('button', { name: /add goal/i }).click();
    await expect(page.getByText('Run a 5k')).toBeVisible();

    // Expand the goal and add a step.
    await page.getByRole('button', { name: /show steps/i }).click();
    const stepInput = page.getByLabel(/add step/i);
    await stepInput.fill('Buy shoes');
    await page.getByRole('button', { name: /add step/i }).click();

    // Check the step off; progress should read 1/1.
    await page.getByRole('checkbox', { name: 'Buy shoes' }).check();
    await expect(page.getByText('1/1')).toBeVisible();

    // The whole point: it must survive a full reload.
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page
      .getByRole('button', { name: /^goals/i })
      .first()
      .click();
    await expect(page.getByText('Run a 5k')).toBeVisible();
    await page.getByRole('button', { name: /show steps/i }).click();
    await expect(page.getByText('1/1')).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: 'Buy shoes' }),
    ).toBeChecked();
  });
});
