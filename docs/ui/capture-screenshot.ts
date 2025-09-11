import { firefox } from 'playwright';
import type { Browser, Page } from 'playwright';

import { fileURLToPath } from 'url';

import { dirname } from 'path';

import * as fs from 'fs';

import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

interface ScreenshotConfig {
  version: string;
  baseUrl: string;
  outputDir: string;
}

class ScreenshotCapture {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: ScreenshotConfig;

  constructor(config: Partial<ScreenshotConfig> = {}) {
    this.config = {
      version: config.version || process.env['npm_package_version'] || 'v1.0.0',
      baseUrl: config.baseUrl || 'http://localhost:3000',
      outputDir: config.outputDir || path.join(__dirname, 'screenshots'),
      ...config
    };
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing screenshot capture...');

    // Launch browser
    this.browser = await firefox.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create new page
    this.page = await this.browser.newPage();

    // Set viewport for consistent screenshots
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    console.log('✅ Browser initialized');
  }

  async ensureDirectories(): Promise<void> {
    const dirs = [
      this.config.outputDir,
      path.join(this.config.outputDir, this.config.version),
      path.join(this.config.outputDir, this.config.version, 'pages'),
      path.join(this.config.outputDir, this.config.version, 'components'),
      path.join(this.config.outputDir, this.config.version, 'layouts')
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }
  }

  async capturePages(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    console.log('📸 Capturing page screenshots...');

    const pages = [
      { name: 'home', path: '/' },
      { name: 'trading', path: '/trading' },
      { name: 'profile', path: '/profile' },
      { name: 'auth', path: '/auth' },
      { name: 'admin', path: '/admin' }
    ];

    for (const pageConfig of pages) {
      try {
        console.log(`  📄 Capturing ${pageConfig.name}...`);

        await this.page.goto(`${this.config.baseUrl}${pageConfig.path}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });

        // Wait for dynamic content to load
        await this.page.waitForTimeout(2000);

        const screenshotPath = path.join(
          this.config.outputDir,
          this.config.version,
          'pages',
          `${pageConfig.name}.png`
        );

        await this.page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        console.log(`    ✅ Saved: ${screenshotPath}`);
      } catch (error) {
        console.error(`    ❌ Failed to capture ${pageConfig.name}:`, (error as Error).message);
      }
    }
  }

  async captureComponents(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    console.log('🧩 Capturing component screenshots...');

    // This would require setting up individual component rendering
    // For now, we'll capture key UI components from pages
    const components = [
      { name: 'navigation', selector: 'nav' },
      { name: 'wallet-connect', selector: '[data-testid="wallet-connect"]' },
      { name: 'trading-card', selector: '[data-testid="trading-card"]' },
      { name: 'modal', selector: '[data-testid="modal"]' }
    ];

    for (const component of components) {
      try {
        const element = await this.page.$(component.selector);
        if (element) {
          console.log(`  🧩 Capturing ${component.name}...`);

          const screenshotPath = path.join(
            this.config.outputDir,
            this.config.version,
            'components',
            `${component.name}.png`
          );

          await element.screenshot({ path: screenshotPath });
          console.log(`    ✅ Saved: ${screenshotPath}`);
        } else {
          console.log(`    ⚠️  Component ${component.name} not found`);
        }
      } catch (error) {
        console.error(`    ❌ Failed to capture ${component.name}:`, (error as Error).message);
      }
    }
  }

  async captureLayouts(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    console.log('📐 Capturing layout screenshots...');

    // Capture different screen sizes for responsive design
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      try {
        console.log(`  📐 Capturing ${viewport.name} layout...`);

        await this.page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        const screenshotPath = path.join(
          this.config.outputDir,
          this.config.version,
          'layouts',
          `${viewport.name}.png`
        );

        await this.page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        console.log(`    ✅ Saved: ${screenshotPath}`);
      } catch (error) {
        console.error(`    ❌ Failed to capture ${viewport.name} layout:`, (error as Error).message);
      }
    }

    // Reset to desktop viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async run(): Promise<void> {
    try {
      console.log(`🎯 Starting screenshot capture for ${this.config.version}`);

      await this.initialize();
      await this.ensureDirectories();

      await this.capturePages();
      await this.captureComponents();
      await this.captureLayouts();

      console.log('🎉 Screenshot capture completed successfully!');
      console.log(`📂 Screenshots saved to: ${path.join(this.config.outputDir, this.config.version)}`);

    } catch (error) {
      console.error('❌ Screenshot capture failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// CLI interface
async function main() {
  const version = process.argv[2] || process.env['npm_package_version'] || 'v1.0.0';
  const baseUrl = process.argv[3] || process.env['BASE_URL'] || 'http://localhost:3000';

  const capture = new ScreenshotCapture({
    version,
    baseUrl
  });

  await capture.run();
}

// Export for programmatic use
export { ScreenshotCapture };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
