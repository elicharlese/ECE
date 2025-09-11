# ECE Mobile E2E Tests

This folder contains end-to-end tests for the ECE mobile application using Detox.

## Setup

1. Install dependencies: `npm install`

2. Build the app for testing:
   - iOS: `npx expo build --platform ios`
   - Android: `npx expo build --platform android`

3. Run tests: `npm run e2e`

## Configuration

- Tests are configured in `.detoxrc.json`
- Supports iOS simulator and Android emulator
- Runs against the built Expo app
- Uses Jest as the test runner

## Test Files

- `e2e/init.js`: Detox initialization and cleanup
- `e2e/config.json`: Jest configuration for Detox
- `e2e/firstTest.e2e.js`: Basic example tests

## Running Tests

- iOS simulator: `detox test --configuration ios.sim.debug`
- Android emulator: `detox test --configuration android.emu.debug`
- Specific test: `detox test e2e/firstTest.e2e.js`
- Debug mode: `detox test --configuration ios.sim.debug --inspect`

## Test Structure

Tests are organized by feature:
- App initialization tests
- Authentication tests (wallet connection)
- Navigation tests
- Feature-specific tests

## Device Setup

### iOS
- Install Xcode and iOS Simulator
- Ensure simulator is available: `xcrun simctl list devices`

### Android
- Install Android Studio and SDK
- Create emulator: `emulator -avd <avd_name>`
- Ensure adb is available

## Best Practices

- Use descriptive test names
- Group related tests in describe blocks
- Use element IDs for reliable element selection
- Leverage Detox's built-in matchers
- Test both portrait and landscape orientations
- Include proper error handling and assertions

## CI/CD Integration

Tests can be run in CI/CD pipelines:
- Build the app before running tests
- Use pre-configured simulators/emulators
- Generate test reports and screenshots

## Troubleshooting

- Clear Detox cache: `detox clean-framework-cache`
- Reset simulators: `xcrun simctl erase all`
- Rebuild app: `npx expo build --clear`
