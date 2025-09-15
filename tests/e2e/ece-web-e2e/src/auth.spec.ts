import { test, expect } from '@playwright/test';

test('wallet connection', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Connect Wallet');
  await expect(page).toHaveURL(/auth/);
});

test('wallet connection mobile', async ({ page, isMobile }) => {
  if (isMobile) {
    await page.goto('/');
    await page.tap('text=Connect Wallet');
    await expect(page).toHaveURL(/auth/);
  }
});
