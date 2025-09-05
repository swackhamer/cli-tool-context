#!/bin/bash

# lib.sh - Shared utility functions for CLI tool context scripts
# This library provides common functions used across multiple scripts

# Robust slugify function for GitHub-style anchors
# Converts text to lowercase, removes special characters, and replaces spaces with hyphens
# Matches GitHub's anchor generation rules
slugify() {
    local text="$1"
    echo "$text" | \
        tr '[:upper:]' '[:lower:]' | \
        sed -E "s/\*|\`|\"|\\'//g" | \
        sed -E 's/[^a-z0-9[:space:]-]//g' | \
        sed -E 's/[[:space:]]+/-/g' | \
        sed -E 's/-+/-/g' | \
        sed -E 's/^-|-$//g'
}

# Test anchor generation with sample cases
test_slugify() {
    local test_cases=(
        "Tool Name - Description" "tool-name---description"
        "sed and awk - Text Processing" "sed-and-awk---text-processing"
        "Tool with 'Quotes' & Symbols" "tool-with-quotes--symbols"
        "Multiple   Spaces" "multiple-spaces"
        "Special*Chars\`Here\"Test" "specialcharshere-test"
    )
    
    echo "Testing slugify function:"
    for ((i=0; i<${#test_cases[@]}; i+=2)); do
        local input="${test_cases[i]}"
        local expected="${test_cases[i+1]}"
        local actual
        actual=$(slugify "$input")
        
        if [[ "$actual" == "$expected" ]]; then
            echo "✓ '$input' -> '$actual'"
        else
            echo "✗ '$input' -> '$actual' (expected '$expected')"
        fi
    done
}

# Portable function to get file modification time
get_mtime() {
    local file="$1"
    if [[ "$(uname)" == "Darwin" ]]; then
        # macOS
        stat -f %m "$file" 2>/dev/null || echo "0"
    else
        # Linux and others
        stat -c %Y "$file" 2>/dev/null || echo "0"
    fi
}

# Helper function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Helper function to safely parse JSON with jq, with fallback
safe_jq() {
    local json="$1"
    local query="$2"
    local default="${3:-}"
    
    if command_exists jq; then
        echo "$json" | jq -r "$query" 2>/dev/null || echo "$default"
    else
        echo "$default"
    fi
}

# Helper function to check if JSON has a key
json_has_key() {
    local json="$1"
    local key="$2"
    
    if command_exists jq; then
        echo "$json" | jq -e "$key" >/dev/null 2>&1
        return $?
    else
        return 1
    fi
}