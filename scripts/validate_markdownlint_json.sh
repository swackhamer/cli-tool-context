#!/bin/bash

# JSON validation script for .markdownlint.json
# This script validates that .markdownlint.json contains valid JSON before committing
# Part of the documentation quality assurance suite

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$PROJECT_ROOT/.markdownlint.json"
EXIT_CODE=0

# Parse command line arguments
QUIET=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --quiet|-q)
            QUIET=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Validates that .markdownlint.json contains valid JSON."
            echo ""
            echo "Options:"
            echo "  --quiet, -q    Suppress success messages"
            echo "  --help, -h     Show this help message"
            echo ""
            echo "Exit codes:"
            echo "  0  JSON is valid"
            echo "  1  JSON is invalid or file doesn't exist"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check if .markdownlint.json exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}ERROR: .markdownlint.json not found at $CONFIG_FILE${NC}" >&2
    exit 1
fi

# Function to validate JSON using available tools
validate_json() {
    local file="$1"
    local validation_method=""
    local validation_output=""
    
    # Try jq first (most reliable)
    if command -v jq &> /dev/null; then
        validation_method="jq"
        if validation_output=$(jq empty "$file" 2>&1); then
            return 0
        else
            echo "jq validation failed: $validation_output" >&2
            return 1
        fi
    # Try Node.js if available
    elif command -v node &> /dev/null; then
        validation_method="node"
        if validation_output=$(node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8')); console.log('Valid JSON');" 2>&1); then
            return 0
        else
            echo "Node.js validation failed: $validation_output" >&2
            return 1
        fi
    # Try Python as fallback
    elif command -v python3 &> /dev/null; then
        validation_method="python3"
        if validation_output=$(python3 -c "import json; json.load(open('$file'))" 2>&1); then
            return 0
        else
            echo "Python3 validation failed: $validation_output" >&2
            return 1
        fi
    elif command -v python &> /dev/null; then
        validation_method="python"
        if validation_output=$(python -c "import json; json.load(open('$file'))" 2>&1); then
            return 0
        else
            echo "Python validation failed: $validation_output" >&2
            return 1
        fi
    else
        echo -e "${RED}ERROR: No JSON validation tool available (jq, node, or python required)${NC}" >&2
        echo -e "${YELLOW}Please install one of the following:${NC}" >&2
        echo -e "  - jq: brew install jq (macOS) or apt-get install jq (Linux)" >&2
        echo -e "  - Node.js: https://nodejs.org/" >&2
        echo -e "  - Python: https://python.org/" >&2
        return 2
    fi
}

# Validate the JSON
if [ "$QUIET" = false ]; then
    echo "Validating $CONFIG_FILE..."
fi

if validate_json "$CONFIG_FILE"; then
    if [ "$QUIET" = false ]; then
        echo -e "${GREEN}✓ .markdownlint.json is valid JSON${NC}"
    fi
    EXIT_CODE=0
else
    echo -e "${RED}✗ .markdownlint.json contains invalid JSON${NC}" >&2
    EXIT_CODE=1
fi

exit $EXIT_CODE