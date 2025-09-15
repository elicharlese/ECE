#!/bin/bash

echo "Setting up E2E test environment for ECE platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Setup environment variables
echo "Setting up environment variables..."
cp .env.example .env.test 2>/dev/null || echo "No .env.example found, skipping..."

# Setup test database
echo "Setting up test database..."
if npm run db:seed:test 2>/dev/null; then
    echo "Test database seeded successfully"
else
    echo "Warning: Test database seeding failed or not configured"
fi

# Start test servers
echo "Starting test servers..."
if npm run start:test 2>/dev/null; then
    echo "Test servers started"
else
    echo "Starting default development server..."
    npm run dev &
    SERVER_PID=$!
    echo "Server PID: $SERVER_PID"
fi

# Wait for servers to be ready
echo "Waiting for servers to be ready..."
sleep 15

# Health check
echo "Performing health check..."
if curl -f http://localhost:4200 > /dev/null 2>&1; then
    echo "✅ Web server is ready at http://localhost:4200"
else
    echo "❌ Web server is not responding"
fi

# Setup mobile testing environment
echo "Setting up mobile testing environment..."
if [ -d "e2e/ece-mobile-e2e" ]; then
    cd e2e/ece-mobile-e2e
    npm install
    cd ../..
fi

echo "✅ E2E test environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Run web tests: cd e2e/ece-web-e2e && npx playwright test"
echo "2. Run mobile tests: cd e2e/ece-mobile-e2e && npm run e2e"
echo "3. Run desktop tests: cd e2e/desktop-e2e && npm run test"
echo "4. Run all tests: ./e2e/run-all-tests.sh"
