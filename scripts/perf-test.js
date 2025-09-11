// ECE Performance Testing Script
// Usage: node scripts/perf-test.js

const { chromium } = require('playwright');

async function runPerformanceTest() {
  console.log('🚀 Starting ECE Performance Tests...\n');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Configure page for performance monitoring
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Measure page load performance
    console.log('📊 Testing page load performance...');
    const startTime = Date.now();

    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const loadTime = Date.now() - startTime;
    console.log(`⏱️  Page load time: ${loadTime}ms`);

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
      };
    });

    console.log(`🎨 First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
    console.log(`📝 First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`📄 DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`🔄 Load Complete: ${metrics.loadComplete.toFixed(2)}ms\n`);

    // Test key user interactions
    console.log('🖱️  Testing user interactions...');

    // Test navigation
    const navStart = Date.now();
    await page.click('text=Trading');
    await page.waitForURL('**/trading');
    const navTime = Date.now() - navStart;
    console.log(`🧭 Navigation time: ${navTime}ms`);

    // Test API response time (if applicable)
    console.log('\n🔗 Testing API endpoints...');
    // Add API tests here if endpoints are available

    // Performance thresholds
    const thresholds = {
      loadTime: 3000, // 3 seconds
      navigationTime: 1000, // 1 second
    };

    console.log('\n📈 Performance Results:');
    console.log(`   Load Time: ${loadTime < thresholds.loadTime ? '✅' : '❌'} (${loadTime}ms)`);
    console.log(`   Navigation: ${navTime < thresholds.navigationTime ? '✅' : '❌'} (${navTime}ms)`);

    if (loadTime < thresholds.loadTime && navTime < thresholds.navigationTime) {
      console.log('\n🎉 All performance tests passed!');
    } else {
      console.log('\n⚠️  Some performance tests failed. Consider optimization.');
    }

  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the performance test
runPerformanceTest().catch(console.error);
