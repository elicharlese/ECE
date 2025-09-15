import { test, expect } from '@playwright/test';

test('trading marketplace', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Trading');
  await expect(page).toHaveURL(/trading/);
});

test('card details', async ({ page }) => {
  await page.goto('/trading');
  await page.click('text=Card 1');
  await expect(page).toHaveURL(/card/);
});

test('trading mobile', async ({ page, isMobile }) => {
  if (isMobile) {
    await page.goto('/');
    await page.tap('text=Trading');
    await expect(page).toHaveURL(/trading/);
  }
});
