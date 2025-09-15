# Test Results

This folder contains all test execution results, reports, and artifacts from ECE E2E test runs.

## Directory Structure

```
test-results/
├── playwright-report/     # HTML reports from Playwright tests
│   ├── index.html        # Main report file
│   └── assets/           # Report assets (CSS, JS, images)
├── detox/                # Screenshots and logs from Detox tests
│   ├── ios/              # iOS device screenshots
│   └── android/          # Android device screenshots
├── screenshots/          # Screenshots captured during test failures
├── videos/              # Video recordings of failed tests
└── logs/                # Test execution logs
```

## Viewing Reports

### Playwright Reports
- Open `playwright-report/index.html` in your browser
- View test results, screenshots, and traces
- Filter by test status, duration, or tags

### Detox Reports
- Check `detox/` folder for device-specific screenshots
- Review test logs in `detox/test.log`
- View device recordings if enabled

### CI/CD Integration
- Reports are automatically uploaded as GitHub artifacts
- Available for download from the Actions tab
- Retention period: 30 days

## Report Analysis

### Test Metrics
- Total tests run
- Pass/fail/skip counts
- Test execution time
- Browser/device coverage

### Failure Analysis
- Screenshot capture on failures
- Video recordings for debugging
- Stack traces and error logs
- Network request logs

## Cleanup Procedures

To clean up old reports and free up disk space:

```bash
# Remove all test results
rm -rf test-results/*

# Remove specific report types
rm -rf test-results/playwright-report/
rm -rf test-results/detox/
rm -rf test-results/screenshots/
rm -rf test-results/videos/
```

## Automated Cleanup

Reports older than 7 days can be automatically cleaned up using:

```bash
find test-results -type f -mtime +7 -delete
find test-results -type d -empty -delete
```

## Best Practices

- Review reports after each test run
- Address flaky tests promptly
- Use screenshots/videos for debugging
- Archive important reports for regression analysis
- Monitor test execution times for performance issues
