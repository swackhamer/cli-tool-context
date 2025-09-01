#!/bin/bash

# Browser test runner for CI
# Runs browser tests using headless Chrome or available browser

set -e

echo "Starting browser test runner..."

# Check if we're in the right directory
if [ ! -f "site/tools.html" ]; then
    echo "Error: Must run from project root directory"
    exit 1
fi

# Start a simple HTTP server in the background
echo "Starting test server..."
python3 -m http.server 8000 --directory . > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Function to cleanup on exit
cleanup() {
    echo "Cleaning up..."
    kill $SERVER_PID 2>/dev/null || true
}
trap cleanup EXIT

# Run tests based on available tools
if command -v npx &> /dev/null && npx playwright --version &> /dev/null 2>&1; then
    echo "Running tests with Playwright..."
    npx playwright test test/browser-tests.spec.js
elif command -v google-chrome &> /dev/null; then
    echo "Running tests with headless Chrome..."
    google-chrome --headless --disable-gpu --no-sandbox \
        --enable-logging --dump-dom \
        "http://localhost:8000/site/tools.html#test" \
        2>&1 | grep -E "(✅|⚠️|❌|Summary)"
elif command -v chromium &> /dev/null; then
    echo "Running tests with headless Chromium..."
    chromium --headless --disable-gpu --no-sandbox \
        --enable-logging --dump-dom \
        "http://localhost:8000/site/tools.html#test" \
        2>&1 | grep -E "(✅|⚠️|❌|Summary)"
else
    echo "Warning: No suitable browser found for testing"
    echo "Install Playwright (npm install -D @playwright/test) or Chrome/Chromium"
    exit 0
fi

echo "Browser tests completed"