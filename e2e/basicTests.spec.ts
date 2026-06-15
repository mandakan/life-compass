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
    // Wait for the language switcher button to appear (now in the global nav)
    const languageSwitcher = await page.getByTestId('language-switcher');

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
    // Enter at the root. An empty store opens on the first-run Welcome.
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Build a compass from the suggestions so there is something to snapshot.
    await page
      .getByRole('button', { name: 'Start from a few common areas' })
      .click();
    await page.getByRole('button', { name: 'Work', exact: true }).click();
    await page.getByRole('button', { name: /^Continue with/ }).click();

    // Save a dated snapshot via the quiet overflow menu -> History dialog.
    await page.getByRole('button', { name: 'More' }).click();
    await page.getByRole('button', { name: 'History' }).click();
    await page.getByRole('button', { name: 'Save snapshot' }).click();

    // The history list appears once at least one snapshot exists.
    await expect(
      page.getByRole('heading', { name: /snapshot history/i }),
    ).toBeVisible();

    // The whole point: it must still be there after a full reload (persistence).
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'More' }).click();
    await page.getByRole('button', { name: 'History' }).click();
    await expect(
      page.getByRole('heading', { name: /snapshot history/i }),
    ).toBeVisible();
  });

  test('a goal with a checked step survives a page reload', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Build a compass and open the "Work" area's editor.
    await page
      .getByRole('button', { name: 'Start from a few common areas' })
      .click();
    await page.getByRole('button', { name: 'Work', exact: true }).click();
    await page.getByRole('button', { name: /^Continue with/ }).click();
    await page.getByRole('button', { name: 'Open Work' }).click();

    // Goals live behind the quiet affordance in the area editor.
    await page.getByRole('button', { name: 'Goals' }).click();

    // Add a goal through the real UI.
    const goalInput = page.getByLabel('Add goal');
    await goalInput.fill('Run a 5k');
    await page.getByRole('button', { name: 'Add goal' }).click();
    await expect(page.getByText('Run a 5k')).toBeVisible();

    // Expand the goal and add a step.
    await page.getByRole('button', { name: 'Show steps' }).click();
    const stepInput = page.getByLabel('Add step');
    await stepInput.fill('Buy shoes');
    await page.getByRole('button', { name: 'Add step' }).click();

    // Check the step off; progress should read 1/1.
    await page.getByRole('checkbox', { name: 'Buy shoes' }).check();
    await expect(page.getByText('1/1')).toBeVisible();

    // The whole point: it must survive a full reload.
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Open Work' }).click();
    await page.getByRole('button', { name: 'Goals' }).click();
    await expect(page.getByText('Run a 5k')).toBeVisible();
    await page.getByRole('button', { name: 'Show steps' }).click();
    await expect(page.getByText('1/1')).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: 'Buy shoes' }),
    ).toBeChecked();
  });

  test('the compass has no horizontal overflow on a narrow viewport', async ({
    page,
  }) => {
    // 320px is the narrow floor (small phones); guards the header, the
    // perspective switcher, and the radial map.
    await page.setViewportSize({ width: 320, height: 780 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Build a compass so the map, header, and switcher all render.
    await page
      .getByRole('button', { name: 'Start from a few common areas' })
      .click();
    await page.getByRole('button', { name: 'Work', exact: true }).click();
    await page.getByRole('button', { name: /^Continue with/ }).click();
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    // The compass (header, switcher, radial map) renders here. Nothing may
    // extend past the viewport's right edge, or mobile browsers allow sideways
    // scrolling.
    const maxRight = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      let max = 0;
      document.querySelectorAll('body *').forEach((el) => {
        const right = el.getBoundingClientRect().right;
        if (right > max) max = right;
      });
      return Math.round(max - vw);
    });
    expect(maxRight).toBeLessThanOrEqual(1);
  });
});
