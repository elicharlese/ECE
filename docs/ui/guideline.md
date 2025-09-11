# ECE Platform Screenshot Capture Guidelines

## Overview

The `capture-screenshot.ts` script automates the process of capturing screenshots across the ECE platform for documentation and UI testing purposes. It organizes screenshots by app version, categorizing them into pages, components, and layouts for easy reference.

## Features

- **Version Management**: Screenshots are stored in versioned folders (e.g., `/v1.0.0`, `/v2.0.0`)
- **Categorized Capture**:
  - **Pages**: Full-page screenshots of key routes
  - **Components**: Individual component screenshots using data-testid selectors
  - **Layouts**: Responsive design captures across different viewport sizes
- **Headless Browser**: Uses Playwright for consistent, automated capturing
- **Error Handling**: Graceful failure handling with detailed logging

## Folder Structure

```
docs/ui/screenshots/
├── v1.0.0/
│   ├── pages/
│   │   ├── home.png
│   │   ├── trading.png
│   │   ├── profile.png
│   │   ├── auth.png
│   │   └── admin.png
│   ├── components/
│   │   ├── navigation.png
│   │   ├── wallet-connect.png
│   │   ├── trading-card.png
│   │   └── modal.png
│   └── layouts/
│       ├── desktop.png
│       ├── tablet.png
│       └── mobile.png
└── v2.0.0/
    └── ...
```

## Setup

### Prerequisites

1. **Node.js** (v16 or higher)
2. **ECE Platform** running on `http://localhost:3000` (default)
3. **Playwright** installed

### Installation

```bash
# Install Playwright globally or locally
npm install playwright

# Install browser binaries
npx playwright install
```

### App Preparation

Before running the script, ensure your ECE app is running:

```bash
# From the root directory
npm run start:all
# or
./scripts/start-all.sh
```

This will start all ECE apps (web on :3000, mobile, desktop).

## Usage

### Basic Usage

```bash
# Run with default version (from package.json or v1.0.0)
npx ts-node docs/ui/capture-screenshot.ts

# Specify custom version
npx ts-node docs/ui/capture-screenshot.ts v1.2.0

# Specify custom base URL
npx ts-node docs/ui/capture-screenshot.ts v1.2.0 http://localhost:3001
```

### Environment Variables

You can set environment variables to override defaults:

```bash
# Set version from package.json
npm_package_version=v1.0.0 npx ts-node docs/ui/capture-screenshot.ts

# Set custom base URL
BASE_URL=http://localhost:3001 npx ts-node docs/ui/capture-screenshot.ts
```

### Programmatic Usage

```typescript
import { ScreenshotCapture } from './capture-screenshot';

const capture = new ScreenshotCapture({
  version: 'v1.0.0',
  baseUrl: 'http://localhost:3000',
  outputDir: './docs/ui/screenshots'
});

await capture.run();
```

## Configuration

### Pages to Capture

Edit the `pages` array in `capturePages()` method to add/remove routes:

```typescript
const pages = [
  { name: 'home', path: '/' },
  { name: 'trading', path: '/trading' },
  { name: 'profile', path: '/profile' },
  { name: 'auth', path: '/auth' },
  { name: 'admin', path: '/admin' }
];
```

### Components to Capture

Update the `components` array with your component selectors (preferably using `data-testid`):

```typescript
const components = [
  { name: 'navigation', selector: 'nav' },
  { name: 'wallet-connect', selector: '[data-testid="wallet-connect"]' },
  { name: 'trading-card', selector: '[data-testid="trading-card"]' },
  { name: 'modal', selector: '[data-testid="modal"]' }
];
```

### Viewport Sizes

Modify viewport configurations in `captureLayouts()`:

```typescript
const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];
```

## Best Practices

### Component Selectors

- Use `data-testid` attributes for reliable component targeting
- Ensure components are visible before capture (no loading states)
- Test selectors in browser dev tools first

### Timing

- The script includes a 2-second wait for dynamic content
- Adjust `waitForTimeout` if needed for slower components
- Use `waitForSelector` for specific elements

### Error Handling

- Screenshots will be skipped if pages/components are not found
- Check console output for detailed error messages
- Manual verification recommended after automated capture

### Performance

- Run in headless mode for faster execution
- Close other browser instances before running
- Consider running during off-peak hours

## Maintenance

### Adding New Pages

1. Add route to the `pages` array
2. Ensure the route exists in your app
3. Test the capture manually first

### Adding New Components

1. Add `data-testid` to the component in your JSX
2. Add entry to the `components` array
3. Verify the selector works in dev tools

### Version Bumping

- Update version in `package.json` for automatic detection
- Or specify version manually when running the script
- Archive old versions as needed

## Troubleshooting

### Common Issues

**"Browser not found"**
```bash
npx playwright install
```

**"Page timeout"**
- Increase timeout in `page.goto()` options
- Check if app is running on specified port
- Verify network connectivity

**"Selector not found"**
- Verify `data-testid` attributes are present
- Check if component is conditionally rendered
- Use browser dev tools to inspect elements

**"Permission denied"**
```bash
chmod +x docs/ui/capture-screenshot.ts
```

### Debug Mode

For debugging, you can modify the script to run in non-headless mode:

```typescript
this.browser = await chromium.launch({
  headless: false,  // Set to false for debugging
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

## Integration with CI/CD

To automate screenshot capture in your pipeline:

```yaml
# In your GitHub Actions workflow
- name: Capture Screenshots
  run: |
    npm run dev &
    sleep 10
    npx ts-node docs/ui/capture-screenshot.ts ${{ github.ref_name }}
    kill %1
```

## Contributing

When modifying the script:

1. Test changes locally first
2. Update this guideline if adding new features
3. Ensure backward compatibility
4. Add appropriate error handling

## Support

For issues with the screenshot script:

1. Check console logs for error messages
2. Verify app is running and accessible
3. Test selectors manually in browser
4. Review Playwright documentation for advanced features
