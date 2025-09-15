import { test, expect } from '@playwright/test';

test('treasury dashboard', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Treasury');
  await expect(page).toHaveURL(/treasury/);
});

test('treasury balance', async ({ page }) => {
  await page.goto('/treasury');
  await expect(page.locator('text=Balance')).toBeVisible();
});

test('treasury mobile', async ({ page, isMobile }) => {
  if (isMobile) {
    await page.goto('/');
    await page.tap('text=Treasury');
    await expect(page).toHaveURL(/treasury/);
  }
});
