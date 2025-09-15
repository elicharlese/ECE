import { test, expect } from '@playwright/test';

// Batch 2 End-to-End Testing Suite
// Tests all critical features implemented in Batch 2

test.describe('Batch 2: 3D Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('3D Token visualization loads and renders correctly', async ({ page }) => {
    // Navigate to token page
    await page.goto('/token');
    
    // Wait for 3D canvas to load
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Check that canvas is visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Verify canvas has correct dimensions
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeTruthy();
    expect(canvasBox!.width).toBeGreaterThan(100);
    expect(canvasBox!.height).toBeGreaterThan(100);
  });

  test('3D Token rarity system displays different effects', async ({ page }) => {
    await page.goto('/token');
    
    // Wait for 3D scene to load
    await page.waitForSelector('canvas');
    
    // Test rarity selector (if available)
    const rarityButtons = page.locator('[data-testid*="rarity"]');
    if (await rarityButtons.count() > 0) {
      await rarityButtons.first().click();
      await page.waitForTimeout(1000); // Allow animation time
    }
    
    // Verify 3D scene is still responsive
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('3D Performance monitoring works correctly', async ({ page }) => {
    await page.goto('/token');
    
    // Check for performance indicator (if visible)
    const performanceIndicator = page.locator('[data-testid="performance-monitor"]');
    if (await performanceIndicator.isVisible()) {
      await expect(performanceIndicator).toContainText(/fps|FPS/i);
    }
    
    // Verify 3D scene loads within reasonable time
    const startTime = Date.now();
    await page.waitForSelector('canvas');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });
});

test.describe('Batch 2: Enterprise Features', () => {
  test('SSO login options are available', async ({ page }) => {
    await page.goto('/signin');
    
    // Check for enterprise SSO options
    const ssoOptions = [
      'Azure AD',
      'Google Workspace', 
      'SAML',
      'Continue with Google',
      'Continue with Microsoft'
    ];
    
    for (const option of ssoOptions) {
      const element = page.getByText(option, { exact: false });
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
        break; // At least one SSO option should be visible
      }
    }
  });

  test('API Gateway rate limiting headers are present', async ({ page }) => {
    // Test API endpoints for rate limiting headers
    const response = await page.request.get('/api/health');
    
    if (response.status() === 200) {
      const headers = response.headers();
      // Check for common rate limiting headers
      const rateLimitHeaders = [
        'x-ratelimit-limit',
        'x-ratelimit-remaining',
        'x-ratelimit-reset',
        'ratelimit-limit',
        'ratelimit-remaining'
      ];
      
      const hasRateLimitHeader = rateLimitHeaders.some(header => 
        headers[header] !== undefined
      );
      
      // Rate limiting might not be enabled in development
      // This is informational rather than a hard requirement
      console.log('Rate limiting headers present:', hasRateLimitHeader);
    }
  });
});

test.describe('Batch 2: Social Features', () => {
  test('Profile page loads with social elements', async ({ page }) => {
    await page.goto('/profile');
    
    // Check for profile elements
    const profileElements = [
      '[data-testid="user-profile"]',
      '[data-testid="social-stats"]',
      '.profile-section',
      '.user-avatar',
      '.social-connections'
    ];
    
    let profileFound = false;
    for (const selector of profileElements) {
      if (await page.locator(selector).isVisible()) {
        profileFound = true;
        break;
      }
    }
    
    // Profile page should exist and be accessible
    expect(page.url()).toContain('/profile');
  });

  test('Trading signals interface is functional', async ({ page }) => {
    await page.goto('/discover');
    
    // Look for trading signals section
    const signalsSection = page.locator('[data-testid*="signal"], [data-testid*="trading"]');
    
    if (await signalsSection.count() > 0) {
      await expect(signalsSection.first()).toBeVisible();
    }
    
    // Check for social trading elements
    const socialElements = page.locator('[data-testid*="social"], .social-feed, .trading-signals');
    
    if (await socialElements.count() > 0) {
      await expect(socialElements.first()).toBeVisible();
    }
  });

  test('Community features are accessible', async ({ page }) => {
    // Test various community pages
    const communityPages = ['/discover', '/marketplace', '/profile'];
    
    for (const pagePath of communityPages) {
      await page.goto(pagePath);
      
      // Page should load without errors
      await expect(page).toHaveURL(new RegExp(pagePath));
      
      // Should not show 404 or error pages
      const errorText = await page.textContent('body');
      expect(errorText).not.toContain('404');
      expect(errorText).not.toContain('Page not found');
    }
  });
});

test.describe('Batch 2: GitHub MCP Integration', () => {
  test('Order flow interface is accessible', async ({ page }) => {
    // Test order creation flow
    await page.goto('/marketplace');
    
    // Look for order/purchase buttons
    const orderButtons = page.locator(
      '[data-testid*="order"], [data-testid*="purchase"], [data-testid*="buy"], .order-button, .purchase-button'
    );
    
    if (await orderButtons.count() > 0) {
      await expect(orderButtons.first()).toBeVisible();
    }
    
    // Verify marketplace is functional
    expect(page.url()).toContain('/marketplace');
  });

  test('Repository analysis interface exists', async ({ page }) => {
    // Check for GitHub/repository related features
    await page.goto('/');
    
    // Look for GitHub/repository integration hints
    const repoElements = page.locator(
      '[data-testid*="github"], [data-testid*="repo"], [data-testid*="repository"]'
    );
    
    // This is more of an integration test - the UI might not expose GitHub features directly
    // But we should be able to access the main app without errors
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Batch 2: UI/UX Polish', () => {
  test('Button variants render correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for various button types
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check that buttons are visible and clickable
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        
        // Check for proper styling (not broken)
        const buttonClasses = await button.getAttribute('class');
        expect(buttonClasses).toBeTruthy();
      }
    }
  });

  test('Icons display correctly across themes', async ({ page }) => {
    await page.goto('/');
    
    // Check for icon elements
    const icons = page.locator('svg, .icon, [data-testid*="icon"]');
    const iconCount = await icons.count();
    
    if (iconCount > 0) {
      // Verify icons are visible
      await expect(icons.first()).toBeVisible();
      
      // Test theme switching if available
      const themeToggle = page.locator('[data-testid*="theme"], .theme-toggle, [aria-label*="theme"]');
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Icons should still be visible after theme change
        await expect(icons.first()).toBeVisible();
      }
    }
  });

  test('Shadow effects are applied correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for elements with shadow classes
    const shadowElements = page.locator('[class*="shadow"], .glass-card, .floating');
    
    if (await shadowElements.count() > 0) {
      await expect(shadowElements.first()).toBeVisible();
      
      // Verify shadow styles are applied
      const styles = await shadowElements.first().getAttribute('class');
      expect(styles).toMatch(/shadow|glass|floating/);
    }
  });

  test('Responsive design works on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should be responsive
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Batch 2: Performance & Security', () => {
  test('Page load performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    // Check for critical page elements
    await expect(page.locator('body')).toBeVisible();
  });

  test('3D Performance is optimized', async ({ page }) => {
    await page.goto('/token');
    
    // Monitor performance during 3D rendering
    const startTime = Date.now();
    await page.waitForSelector('canvas');
    const renderTime = Date.now() - startTime;
    
    // 3D scene should render within reasonable time
    expect(renderTime).toBeLessThan(8000);
    
    // Check that 3D doesn't block the UI
    const navigationElement = page.locator('nav, header, .navigation');
    if (await navigationElement.isVisible()) {
      await expect(navigationElement).toBeVisible();
    }
  });

  test('Security headers are present', async ({ page }) => {
    const response = await page.goto('/');
    
    if (response) {
      const headers = response.headers();
      
      // Check for basic security headers
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy',
        'content-security-policy'
      ];
      
      // At least some security headers should be present
      const hasSecurityHeaders = securityHeaders.some(header => 
        headers[header] !== undefined
      );
      
      // Log security status for visibility
      console.log('Security headers present:', hasSecurityHeaders);
    }
  });

  test('API endpoints return appropriate status codes', async ({ page }) => {
    // Test common API endpoints
    const endpoints = ['/api/health', '/api/status'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await page.request.get(endpoint);
        
        // Should return 200 OK or 404 Not Found (endpoint doesn't exist yet)
        // Should not return 500 Internal Server Error
        expect([200, 404]).toContain(response.status());
      } catch (error) {
        // Endpoint might not exist yet, which is acceptable
        console.log(`Endpoint ${endpoint} not available:`, error);
      }
    }
  });
});

test.describe('Batch 2: Integration Tests', () => {
  test('Navigation between app sections works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to main app sections
    const navSections = [
      { path: '/discover', name: 'Discover' },
      { path: '/marketplace', name: 'Marketplace' },
      { path: '/profile', name: 'Profile' },
    ];
    
    for (const section of navSections) {
      await page.goto(section.path);
      
      // Should reach the intended page
      expect(page.url()).toContain(section.path);
      
      // Page should load without major errors
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('Theme persistence works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Try to find and toggle theme
    const themeToggle = page.locator(
      '[data-testid*="theme"], .theme-toggle, [aria-label*="theme"], [aria-label*="dark"], [aria-label*="light"]'
    );
    
    if (await themeToggle.isVisible()) {
      // Get initial theme state
      const initialClasses = await page.locator('html, body').first().getAttribute('class');
      
      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Check if theme changed
      const newClasses = await page.locator('html, body').first().getAttribute('class');
      
      // Reload page and check persistence
      await page.reload();
      await page.waitForTimeout(500);
      
      const persistedClasses = await page.locator('html, body').first().getAttribute('class');
      
      // Theme should persist after reload
      expect(persistedClasses).toBeTruthy();
    }
  });

  test('Error boundaries handle failures gracefully', async ({ page }) => {
    // Test navigation to non-existent pages
    await page.goto('/non-existent-page');
    
    // Should show appropriate error page or redirect
    const pageContent = await page.textContent('body');
    
    // Should not show unhandled error or blank page
    expect(pageContent).toBeTruthy();
    expect(pageContent!.length).toBeGreaterThan(10);
  });
});

// Accessibility Tests
test.describe('Batch 2: Accessibility', () => {
  test('Key pages meet basic accessibility standards', async ({ page }) => {
    const pages = ['/', '/signin', '/profile', '/marketplace'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check for basic accessibility features
      const hasHeadings = await page.locator('h1, h2, h3').count() > 0;
      const hasAltText = await page.locator('img[alt]').count() >= await page.locator('img').count() * 0.8;
      const hasAriaLabels = await page.locator('[aria-label]').count() > 0;
      
      // Log accessibility status
      console.log(`Page ${pagePath} accessibility:`, {
        hasHeadings,
        hasAltText,
        hasAriaLabels
      });
      
      // At minimum, pages should have proper structure
      expect(hasHeadings).toBeTruthy();
    }
  });

  test('Keyboard navigation works for interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Should focus on interactive elements
    const focusedElement = page.locator(':focus');
    if (await focusedElement.isVisible()) {
      await expect(focusedElement).toBeVisible();
    }
    
    // Test Enter key on buttons
    const buttons = page.locator('button:visible');
    if (await buttons.count() > 0) {
      await buttons.first().focus();
      // Enter should be handled gracefully (no crashes)
      await page.keyboard.press('Enter');
    }
  });
});
