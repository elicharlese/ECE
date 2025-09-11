# ECE Web E2E Tests

This folder contains end-to-end tests for the ECE web application using Playwright.

## Setup

1. Install dependencies: `npm install`

2. Run tests: `npx playwright test`

## Configuration

- Tests are configured in `playwright.config.ts`
- Supports desktop browsers (Chromium, Firefox, Webkit)
- Supports mobile browsers (Mobile Chrome, Mobile Safari)
- Runs against localhost:4200

## Test Files

- `src/example.spec.ts`: Basic example tests
- `src/auth.spec.ts`: Authentication and wallet connection tests
- `src/trading.spec.ts`: Trading marketplace tests

## Running Tests

- All tests: `npx playwright test`
- Desktop only: `npx playwright test --project=chromium`
- Mobile only: `npx playwright test --project=Mobile\ Chrome`
- Headed mode: `npx playwright test --headed`
- Debug mode: `npx playwright test --debug`

## Test Structure

Tests are organized by feature:
- Auth tests: Wallet connection, authentication flows
- Trading tests: Marketplace browsing, card trading
- General tests: Navigation, UI interactions

## CI/CD Integration

Tests can be run in CI/CD pipelines:
- Install Playwright browsers: `npx playwright install`
- Run tests: `npx playwright test --reporter=github`

## Best Practices

- Use descriptive test names
- Group related tests in describe blocks
- Use page fixtures for common setup
- Leverage Playwright's auto-waiting capabilities
- Test both desktop and mobile viewports
