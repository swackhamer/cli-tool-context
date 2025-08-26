#!/bin/bash

# Test script for JSON mode exit codes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UPDATE_STATS="$SCRIPT_DIR/../update_stats.sh"

echo "Testing JSON mode exit codes..."

# Test 1: Normal mode with no issues (should exit 0)
echo "Test 1: Normal mode with no issues"
JSON_OUTPUT=$($UPDATE_STATS --json --report-only 2>/dev/null)
EXIT_CODE=$?
REPORTED_EXIT_CODE=$(echo "$JSON_OUTPUT" | jq -r '.exitCode // "null"' 2>/dev/null)
if [[ $EXIT_CODE -eq 0 ]] && [[ "$REPORTED_EXIT_CODE" == "0" ]]; then
    echo "  ✓ PASS: Exit code $EXIT_CODE matches reported exit code $REPORTED_EXIT_CODE"
else
    echo "  ✗ FAIL: Exit code $EXIT_CODE does not match reported exit code $REPORTED_EXIT_CODE"
fi

# Test 2: CI mode with no issues (should still exit 0)
echo "Test 2: CI mode with no issues"
JSON_OUTPUT=$($UPDATE_STATS --json --report-only --ci 2>/dev/null)
EXIT_CODE=$?
REPORTED_EXIT_CODE=$(echo "$JSON_OUTPUT" | jq -r '.exitCode // "null"' 2>/dev/null)
CI_MODE=$(echo "$JSON_OUTPUT" | jq -r '.execution.ci_mode // "null"' 2>/dev/null)
if [[ $EXIT_CODE -eq 0 ]] && [[ "$REPORTED_EXIT_CODE" == "0" ]] && [[ "$CI_MODE" == "true" ]]; then
    echo "  ✓ PASS: CI mode enabled, exit code $EXIT_CODE matches reported exit code $REPORTED_EXIT_CODE"
else
    echo "  ✗ FAIL: CI mode test failed - exit: $EXIT_CODE, reported: $REPORTED_EXIT_CODE, ci_mode: $CI_MODE"
fi

# Test 3: Soft-exit mode with no issues (should exit 0)
echo "Test 3: Soft-exit mode with no issues"
JSON_OUTPUT=$($UPDATE_STATS --json --report-only --soft-exit 2>/dev/null)
EXIT_CODE=$?
REPORTED_EXIT_CODE=$(echo "$JSON_OUTPUT" | jq -r '.exitCode // "null"' 2>/dev/null)
SOFT_EXIT=$(echo "$JSON_OUTPUT" | jq -r '.execution.soft_exit // "null"' 2>/dev/null)
if [[ $EXIT_CODE -eq 0 ]] && [[ "$REPORTED_EXIT_CODE" == "0" ]] && [[ "$SOFT_EXIT" == "true" ]]; then
    echo "  ✓ PASS: Soft-exit mode enabled, exit code $EXIT_CODE matches reported exit code $REPORTED_EXIT_CODE"
else
    echo "  ✗ FAIL: Soft-exit mode test failed - exit: $EXIT_CODE, reported: $REPORTED_EXIT_CODE, soft_exit: $SOFT_EXIT"
fi

echo "JSON exit code tests completed."