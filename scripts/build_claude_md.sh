#!/bin/bash

# Build CLAUDE.md from template with dynamic values
# This script reads data from tools.json and generates CLAUDE.md

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Building CLAUDE.md from template..."

# Check for required files
if [ ! -f "$PROJECT_ROOT/CLAUDE.md.tpl" ]; then
    echo "Error: CLAUDE.md.tpl not found"
    exit 1
fi

if [ ! -f "$PROJECT_ROOT/site/data/tools.json" ]; then
    echo "Error: site/data/tools.json not found"
    exit 1
fi

# Extract data from tools.json using Python (more reliable JSON parsing)
TOOL_COUNT=$(python3 -c "
import json
with open('$PROJECT_ROOT/site/data/tools.json', 'r') as f:
    data = json.load(f)
    print(len(data['tools']))
")

CATEGORY_COUNT=$(python3 -c "
import json
with open('$PROJECT_ROOT/site/data/tools.json', 'r') as f:
    data = json.load(f)
    categories = set()
    for tool in data['tools']:
        if 'category' in tool:
            categories.add(tool['category'])
    print(len(categories))
")

# Count lines in TOOLS.md
if [ -f "$PROJECT_ROOT/TOOLS.md" ]; then
    LINE_COUNT=$(wc -l < "$PROJECT_ROOT/TOOLS.md" | tr -d ' ')
    # Format with comma for thousands
    LINE_COUNT=$(printf "%'d" "$LINE_COUNT" 2>/dev/null || echo "$LINE_COUNT")
else
    LINE_COUNT="N/A"
fi

# Get current date and git commit
LAST_UPDATED=$(date "+%Y-%m-%d %H:%M:%S %Z")
COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Generate categories list with counts
CATEGORIES_LIST=$(python3 -c "
import json
from collections import defaultdict

with open('$PROJECT_ROOT/site/data/tools.json', 'r') as f:
    data = json.load(f)
    
    # Count tools per category
    category_counts = defaultdict(int)
    category_examples = defaultdict(list)
    
    for tool in data['tools']:
        if 'category' in tool:
            cat = tool['category']
            category_counts[cat] += 1
            if len(category_examples[cat]) < 5:  # Keep first 5 examples
                category_examples[cat].append(tool['name'])
    
    # Sort categories by name
    sorted_cats = sorted(category_counts.keys())
    
    # Generate formatted list
    lines = []
    for i, cat in enumerate(sorted_cats, 1):
        count = category_counts[cat]
        examples = ', '.join(category_examples[cat][:3])
        if len(category_examples[cat]) > 3:
            examples += ', ...'
        lines.append(f'{i}. **{cat}**: {examples} ({count} tools)')
    
    print('\\n'.join(lines))
")

# Use Python for more reliable template replacement
python3 -c "
import sys

# Read template
with open('$PROJECT_ROOT/CLAUDE.md.tpl', 'r') as f:
    content = f.read()

# Replace placeholders
replacements = {
    '{{TOOL_COUNT}}': '$TOOL_COUNT',
    '{{CATEGORY_COUNT}}': '$CATEGORY_COUNT',
    '{{LINE_COUNT}}': '$LINE_COUNT',
    '{{LAST_UPDATED}}': '$LAST_UPDATED',
    '{{COMMIT_SHA}}': '$COMMIT_SHA',
    '{{CATEGORIES_LIST}}': '''$CATEGORIES_LIST'''
}

for placeholder, value in replacements.items():
    content = content.replace(placeholder, value)

# Write output
with open('$PROJECT_ROOT/CLAUDE.md', 'w') as f:
    f.write(content)
"

echo "✅ CLAUDE.md generated successfully"
echo "   - Tools: $TOOL_COUNT"
echo "   - Categories: $CATEGORY_COUNT"
echo "   - Lines in TOOLS.md: $LINE_COUNT"
echo "   - Commit: $COMMIT_SHA"