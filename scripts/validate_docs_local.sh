#!/bin/bash

# Local version of the CI validation script
# Run this before committing to ensure docs pass CI checks

set -e

echo "========================================="
echo "Local Documentation Validation"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
FAILED=0

# 1. Check JSON validity
echo "1. Validating tools.json..."
if python3 -c "
import json
import sys

try:
    with open('site/data/tools.json', 'r') as f:
        data = json.load(f)
        
    # Check required fields
    assert 'tools' in data, 'Missing tools array'
    assert isinstance(data['tools'], list), 'Tools must be an array'
    
    # Validate each tool
    for tool in data['tools']:
        assert 'name' in tool, f'Tool missing name: {tool}'
        assert 'category' in tool, f'Tool {tool.get(\"name\", \"unknown\")} missing category'
        assert 'description' in tool, f'Tool {tool.get(\"name\", \"unknown\")} missing description'
    
    print(f'   ✅ Validated {len(data[\"tools\"])} tools')
    
except Exception as e:
    print(f'   ❌ JSON validation failed: {e}')
    sys.exit(1)
" 2>&1; then
    echo -e "${GREEN}   ✅ JSON validation passed${NC}"
else
    echo -e "${RED}   ❌ JSON validation failed${NC}"
    FAILED=1
fi

# 2. Check CLAUDE.md is up to date
echo ""
echo "2. Checking CLAUDE.md freshness..."

# Save current CLAUDE.md
cp CLAUDE.md CLAUDE.md.bak

# Generate fresh CLAUDE.md
./scripts/build_claude_md.sh > /dev/null 2>&1

# Check if there are differences
if diff -q CLAUDE.md CLAUDE.md.bak > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ CLAUDE.md is up to date${NC}"
    rm CLAUDE.md.bak
else
    echo -e "${YELLOW}   ⚠️  CLAUDE.md is out of date${NC}"
    echo "   Run: ./scripts/build_claude_md.sh"
    mv CLAUDE.md.bak CLAUDE.md  # Restore original
    FAILED=1
fi

# 3. Verify tool counts match
echo ""
echo "3. Verifying tool counts..."

JSON_COUNT=$(python3 -c "
import json
with open('site/data/tools.json', 'r') as f:
    data = json.load(f)
    print(len(data['tools']))
")

CLAUDE_COUNT=$(grep -oE '\*\*[0-9]+ CLI tools\*\*' CLAUDE.md | head -1 | grep -oE '[0-9]+')

if [ "$JSON_COUNT" == "$CLAUDE_COUNT" ]; then
    echo -e "${GREEN}   ✅ Tool counts match: $JSON_COUNT${NC}"
else
    echo -e "${RED}   ❌ Tool count mismatch!${NC}"
    echo "      tools.json: $JSON_COUNT"
    echo "      CLAUDE.md: $CLAUDE_COUNT"
    FAILED=1
fi

# 4. Check required files exist
echo ""
echo "4. Checking documentation completeness..."

REQUIRED_FILES=(
    "README.md"
    "TOOLS.md"
    "CLAUDE.md"
    "CLAUDE.md.tpl"
    "docs/templates/simple_query.md"
    "docs/templates/complex_pipeline.md"
    "docs/snippets/lookup_patterns.md"
    "docs/snippets/debugging_checklist.md"
    "docs/safety/comprehensive_safety_guide.md"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}   ❌ Missing: $file${NC}"
        MISSING=1
        FAILED=1
    fi
done

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}   ✅ All required files present${NC}"
fi

# 5. Check script permissions
echo ""
echo "5. Checking script permissions..."

PERM_FAILED=0
for script in scripts/*.sh; do
    if [ -f "$script" ]; then
        if [ ! -x "$script" ]; then
            echo -e "${RED}   ❌ Not executable: $script${NC}"
            echo "      Run: chmod +x $script"
            PERM_FAILED=1
            FAILED=1
        fi
    fi
done

if [ $PERM_FAILED -eq 0 ]; then
    echo -e "${GREEN}   ✅ All scripts are executable${NC}"
fi

# 6. Check for broken internal links
echo ""
echo "6. Checking for broken internal links..."

BROKEN_LINKS=$(python3 -c "
import re
import os
import glob

broken_links = []

for md_file in glob.glob('**/*.md', recursive=True):
    if 'node_modules' in md_file:
        continue
        
    with open(md_file, 'r') as f:
        content = f.read()
        
    # Find markdown links
    links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
    
    for text, link in links:
        # Skip external links
        if link.startswith('http'):
            continue
            
        # Skip anchors
        if link.startswith('#'):
            continue
            
        # Check if file exists
        if link.startswith('/'):
            # Absolute path
            check_path = link[1:]
        else:
            # Relative path
            base_dir = os.path.dirname(md_file)
            check_path = os.path.join(base_dir, link)
            check_path = os.path.normpath(check_path)
        
        # Remove anchor if present
        if '#' in check_path:
            check_path = check_path.split('#')[0]
            
        if check_path and not os.path.exists(check_path):
            broken_links.append(f'{md_file}: [{text}]({link})')

if broken_links:
    for link in broken_links:
        print(f'   ❌ {link}')
else:
    print('OK')
" 2>&1)

if [ "$BROKEN_LINKS" == "OK" ]; then
    echo -e "${GREEN}   ✅ No broken internal links${NC}"
else
    echo -e "${RED}   ❌ Found broken links:${NC}"
    echo "$BROKEN_LINKS"
    FAILED=1
fi

# Summary
echo ""
echo "========================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All validation checks passed!${NC}"
    echo "Your documentation is ready for commit."
else
    echo -e "${RED}❌ Some validation checks failed.${NC}"
    echo "Please fix the issues above before committing."
fi
echo "========================================="

exit $FAILED