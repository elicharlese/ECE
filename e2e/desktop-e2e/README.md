# ECE Desktop E2E Tests

This folder contains end-to-end tests for the ECE desktop application using Playwright.

## Setup

1. Install dependencies: `npm install`

2. Run tests: `npm run test`

## Configuration

- Tests are configured in `playwright.config.ts`
- Uses Electron for desktop application testing
- Runs against localhost:4200
- Includes TypeScript support

## Test Files

- `src/example.spec.ts`: Basic example tests with desktop-specific checks

## Running Tests

- Run all tests: `npm run test`
- Run in headed mode: `npm run test:headed`
- Run specific test: `npx playwright test src/example.spec.ts`
- Debug mode: `npx playwright test --debug`

## Test Structure

Tests are organized by feature:
- Application launch and initialization
- Window management and navigation
- Desktop-specific interactions
- Integration with system features

## CI/CD Integration

Tests can be run in CI/CD pipelines:
- Install Playwright browsers: `npx playwright install`
- Run tests: `npm run test -- --reporter=github`

## Best Practices

- Use descriptive test names
- Test window resizing and maximization
- Verify system tray integration (if applicable)
- Test keyboard shortcuts and hotkeys
- Include proper error handling and assertions
- Test both windowed and fullscreen modes

## Troubleshooting

- Clear Playwright cache: `npx playwright install --force`
- Update browsers: `npx playwright install chromium`
- Run in debug mode for step-by-step execution

## Dependencies

- `@playwright/test`: Core testing framework
- `@nx/playwright`: Nx integration
- TypeScript: For type safety
