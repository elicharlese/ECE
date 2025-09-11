import { test, expect } from '@playwright/test';

test('user profile page', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.locator('text=Profile')).toBeVisible();
});

test('edit profile', async ({ page }) => {
  await page.goto('/profile');
  await page.click('text=Edit Profile');
  await expect(page.locator('text=Save Changes')).toBeVisible();
});

test('profile mobile', async ({ page, isMobile }) => {
  if (isMobile) {
    await page.goto('/profile');
    await page.tap('text=Profile');
    await expect(page.locator('text=Profile')).toBeVisible();
  }
});
