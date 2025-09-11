#!/bin/bash

echo "Running all ECE E2E tests..."

# Run web tests
echo "Running web e2e tests..."
cd ece-web-e2e && npx playwright test --reporter=github
cd ..

# Run mobile tests
echo "Running mobile e2e tests..."
cd ece-mobile-e2e && npm run e2e
cd ..

# Run desktop tests
echo "Running desktop e2e tests..."
cd desktop-e2e && npm run test
cd ..

echo "All tests completed!"
