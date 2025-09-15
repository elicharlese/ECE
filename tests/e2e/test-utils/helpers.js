// Test utilities for ECE E2E tests

const { expect } = require('@playwright/test');

class TestHelpers {
  static async login(page, walletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e') {
    await page.goto('/');
    await page.click('text=Connect Wallet');
    // Mock wallet connection for testing
    await page.evaluate((address) => {
      window.localStorage.setItem('walletAddress', address);
      window.dispatchEvent(new Event('walletConnected'));
    }, walletAddress);
    await expect(page.locator('text=Connected')).toBeVisible();
  }

  static async waitForLoading(page) {
    await page.waitForSelector('[data-testid="loading"]', { state: 'hidden', timeout: 10000 });
  }

  static async takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png` });
  }

  static async fillForm(page, fields) {
    for (const [selector, value] of Object.entries(fields)) {
      await page.fill(selector, value);
    }
  }

  static async waitForElement(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { timeout });
  }

  static async mockAPIResponse(page, url, response) {
    await page.route(url, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }
}

module.exports = TestHelpers;
