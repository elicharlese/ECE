# ECE E2E Tests

This folder contains comprehensive end-to-end tests for all ECE platform applications across web, mobile, and desktop platforms.

## Structure

### app-e2e/
Contains Playwright tests for the ECE web application
- Supports desktop and mobile browsers
- Tests authentication, trading, and treasury features
- Located at: `/e2e/app-e2e/`

### ece-mobile-e2e/
Contains Detox tests for the ECE mobile application
- Supports iOS and Android platforms
- Tests wallet connection, navigation, and app features
- Located at: `/e2e/ece-mobile-e2e/`

### desktop-e2e/
Contains Playwright tests for the ECE desktop application
- Uses Electron for desktop testing
- Tests window management and desktop-specific features
- Located at: `/e2e/desktop-e2e/`

## Global Setup

1. Ensure all dependencies are installed in root: `npm install`
2. Configure test environments and API keys
3. Set up local development servers

## Running Tests

### Web E2E Tests
```bash
cd e2e/app-e2e
npx playwright test                    # Run all tests
npx playwright test --project=chromium # Desktop only
npx playwright test --project=Mobile\ Chrome # Mobile only
npx playwright test --headed          # Run in browser
```

### Mobile E2E Tests
```bash
cd e2e/ece-mobile-e2e
npm run e2e                           # Run all tests
detox test --configuration ios.sim.debug   # iOS only
detox test --configuration android.emu.debug # Android only
```

### Desktop E2E Tests
```bash
cd e2e/desktop-e2e
npm run test                          # Run all tests
npm run test:headed                   # Run in browser
```

## Test Coverage

### Authentication
- Wallet connection (ThirdWeb)
- User onboarding flow
- Session management

### Trading
- Marketplace browsing
- Card purchasing/selling
- Transaction processing

### Treasury
- Balance monitoring
- Payout processing
- Emergency controls

### Platform Features
- Navigation and routing
- Responsive design
- Error handling
- Performance validation

## CI/CD Integration

Tests are designed to run in automated pipelines:
- Parallel test execution
- Screenshot and video capture on failures
- Test result reporting
- Environment-specific configurations

## Best Practices

- Tests are written in TypeScript for type safety
- Use descriptive test names and assertions
- Leverage framework-specific matchers
- Include proper setup and teardown
- Test both positive and negative scenarios
- Maintain test independence

## Troubleshooting

### Common Issues
- **Port conflicts**: Ensure test servers run on unique ports
- **Browser dependencies**: Run `npx playwright install` for web tests
- **Device setup**: Configure simulators/emulators for mobile tests
- **Cache issues**: Clear caches with framework-specific commands

### Debug Mode
- Web: `npx playwright test --debug`
- Mobile: `detox test --inspect`

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add appropriate test data
3. Include error scenarios
4. Update documentation
5. Test across all platforms

## Dependencies

- **Playwright**: Web and desktop testing
- **Detox**: Mobile testing
- **Jest**: Test runner for mobile
- **TypeScript**: Type safety
- **Nx**: Monorepo tooling

## Environment Variables

Set the following for test execution:
- `BASE_URL`: Application URL for tests
- `TEST_USER`: Test user credentials
- `API_KEY`: Third-party service keys

## Reports and Results

Test results are generated in each subfolder:
- `app-e2e/playwright-report/`
- `ece-mobile-e2e/test-results/`
- `desktop-e2e/test-results/`

## Support

For test-related issues:
- Check framework documentation
- Review existing test examples
- Ensure environment setup is correct
- Verify application is running
