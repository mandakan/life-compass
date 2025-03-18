import { test, expect } from '@playwright/test';

test('homepage has expected title', async ({ page }) => {
  await page.goto('/');
  // Wait until the document.title is set
  await page.waitForFunction(() => document.title !== '');
  await expect(page).toHaveTitle(/(Life Compass|Livskompass)/);
});
