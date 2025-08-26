#!/bin/bash

# Anchor Link Validation Script
# Validates that all anchor links in TOOL_INDEX.md point to valid anchors in TOOLS.md
# Ensures counts and categories are consistent between files

set -euo pipefail

# Script directory and shared library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$SCRIPT_DIR/lib.sh"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Files to check
TOOLS_FILE="TOOLS.md"
INDEX_FILE="docs/TOOL_INDEX.md"

# Error tracking
VALIDATION_ERRORS=()
VALIDATION_WARNINGS=()

# Note: slugify function now sourced from lib.sh

echo -e "${BLUE}=== Anchor Link Validation Script ===${NC}"
echo

# Check if required files exist
if [[ ! -f "$TOOLS_FILE" ]]; then
    echo -e "${RED}Error: $TOOLS_FILE not found${NC}"
    exit 1
fi

if [[ ! -f "$INDEX_FILE" ]]; then
    echo -e "${RED}Error: $INDEX_FILE not found${NC}"
    exit 1
fi

# Step 1: Build anchor index from TOOLS.md
echo -e "${BLUE}Step 1: Building anchor index from TOOLS.md...${NC}"
TOOLS_ANCHORS_FILE=$(mktemp)
TOOL_CATEGORIES_FILE=$(mktemp)

# Setup cleanup trap for temporary files
CATEGORY_LIST_FILE=$(mktemp)
cleanup() {
    rm -f "$TOOLS_ANCHORS_FILE" "$TOOL_CATEGORIES_FILE" "$CATEGORY_LIST_FILE"
}
trap cleanup EXIT

TOOLS_COUNT=0
CATEGORY_SET=""
current_tool=""

while IFS= read -r line; do
    if [[ "$line" =~ ^###[[:space:]]+\*\*([^\*]+)\*\*[[:space:]]*(and[[:space:]]+\*\*([^\*]+)\*\*)?[[:space:]]+-[[:space:]]+(.*) ]]; then
        tool_name="${BASH_REMATCH[1]}"
        tool_name2="${BASH_REMATCH[3]:-}"
        tool_desc="${BASH_REMATCH[4]}"
        
        if [[ -n "$tool_name2" ]]; then
            full_header="$tool_name and $tool_name2 - $tool_desc"
        else
            full_header="$tool_name - $tool_desc"
        fi
        
        anchor=$(slugify "$full_header")
        echo "$anchor $tool_name" >> "$TOOLS_ANCHORS_FILE"
        current_tool="$tool_name"
        ((TOOLS_COUNT++))
        
        # For compound tools, also add individual anchors if they might be referenced separately
        if [[ -n "$tool_name2" ]]; then
            individual_anchor1=$(slugify "$tool_name - $tool_desc")
            individual_anchor2=$(slugify "$tool_name2 - $tool_desc")
            echo "$individual_anchor1 $tool_name" >> "$TOOLS_ANCHORS_FILE"
            echo "$individual_anchor2 $tool_name2" >> "$TOOLS_ANCHORS_FILE"
        fi
    elif [[ "$line" =~ ^category:[[:space:]]+(.*) ]]; then
        category="${BASH_REMATCH[1]}"
        if [[ -n "$category" && -n "$current_tool" ]]; then
            echo "$current_tool $category" >> "$TOOL_CATEGORIES_FILE"
            # Use exact match check with grep to avoid false positives
            if ! grep -Fxq "$category" "$CATEGORY_LIST_FILE" 2>/dev/null; then
                echo "$category" >> "$CATEGORY_LIST_FILE"
                CATEGORY_SET="$CATEGORY_SET|$category"
            fi
        fi
    fi
done < "$TOOLS_FILE"

# Count unique categories by counting unique category names
CATEGORY_COUNT=$(echo "$CATEGORY_SET" | tr '|' '\n' | grep -v '^$' | sort -u | wc -l)

echo -e "${GREEN}Found $TOOLS_COUNT tools and $CATEGORY_COUNT categories in TOOLS.md${NC}"

# Step 2: Extract and validate anchor links from TOOL_INDEX.md
echo -e "${BLUE}Step 2: Validating anchor links in TOOL_INDEX.md...${NC}"
BROKEN_LINKS=0
VALID_LINKS=0
INDEX_TOOL_COUNT=0

while IFS= read -r line; do
    if [[ "$line" =~ \[([^\]]+)\]\(\.\./TOOLS\.md#([^\)]+)\) ]]; then
        link_text="${BASH_REMATCH[1]}"
        anchor="${BASH_REMATCH[2]}"
        ((INDEX_TOOL_COUNT++))
        
        # Check if anchor exists in our anchors file
        if grep -q "^$anchor " "$TOOLS_ANCHORS_FILE"; then
            ((VALID_LINKS++))
        else
            ((BROKEN_LINKS++))
            VALIDATION_ERRORS+=("Broken anchor: $link_text -> #$anchor")
        fi
    fi
done < "$INDEX_FILE"

echo -e "${GREEN}Validated $VALID_LINKS valid links${NC}"
if [[ $BROKEN_LINKS -gt 0 ]]; then
    echo -e "${RED}Found $BROKEN_LINKS broken links${NC}"
fi

# Step 3: Validate counts match
echo -e "${BLUE}Step 3: Validating tool and category counts...${NC}"

# Extract counts from TOOL_INDEX.md header
INDEX_HEADER_TOOLS=$(grep -o 'Total Tools: [0-9]*' "$INDEX_FILE" | sed 's/Total Tools: //' || echo "0")
INDEX_HEADER_CATEGORIES=$(grep -o 'Categories: [0-9]*' "$INDEX_FILE" | sed 's/Categories: //' || echo "0")

echo "TOOL_INDEX.md header claims: $INDEX_HEADER_TOOLS tools, $INDEX_HEADER_CATEGORIES categories"
echo "TOOLS.md actually contains: $TOOLS_COUNT tools, $CATEGORY_COUNT categories"
echo "TOOL_INDEX.md contains: $INDEX_TOOL_COUNT tool links"

if [[ "$INDEX_HEADER_TOOLS" != "$TOOLS_COUNT" ]]; then
    VALIDATION_ERRORS+=("Tool count mismatch: index header says $INDEX_HEADER_TOOLS but TOOLS.md has $TOOLS_COUNT")
fi

if [[ "$INDEX_HEADER_CATEGORIES" != "$CATEGORY_COUNT" ]]; then
    VALIDATION_ERRORS+=("Category count mismatch: index header says $INDEX_HEADER_CATEGORIES but TOOLS.md has $CATEGORY_COUNT")
fi

if [[ "$INDEX_TOOL_COUNT" != "$TOOLS_COUNT" ]]; then
    VALIDATION_WARNINGS+=("Index contains $INDEX_TOOL_COUNT links but TOOLS.md has $TOOLS_COUNT tools")
fi

# Step 4: Validate category anchors
echo -e "${BLUE}Step 4: Validating category section anchors...${NC}"
CATEGORY_ERRORS=0

# Extract category links from Category Index section
while IFS= read -r line; do
    if [[ "$line" =~ ^###[[:space:]]+(.*) ]] && [[ ! "$line" =~ ^###[[:space:]]+[A-Z]$ ]]; then
        if [[ ${BASH_REMATCH[1]:-} ]]; then
            category="${BASH_REMATCH[1]}"
            expected_anchor=$(slugify "$category")
            
            # Check if this category exists in our category list using exact match
            if ! grep -Fxq "$category" "$CATEGORY_LIST_FILE" 2>/dev/null && [[ "$category" != "Advanced Text Processing Pipelines" ]]; then
                ((CATEGORY_ERRORS++))
                VALIDATION_WARNINGS+=("Category '$category' in index not found in TOOLS.md")
            fi
        fi
    fi
done < <(sed -n '/^## Category Index/,/^## Difficulty Index/p' "$INDEX_FILE")

if [[ $CATEGORY_ERRORS -gt 0 ]]; then
    echo -e "${YELLOW}Found $CATEGORY_ERRORS category mismatches${NC}"
fi

# Step 5: Report results
echo
echo -e "${BLUE}=== Validation Summary ===${NC}"

if [[ ${#VALIDATION_ERRORS[@]} -eq 0 ]] && [[ ${#VALIDATION_WARNINGS[@]} -eq 0 ]]; then
    echo -e "${GREEN}✓ All validations passed!${NC}"
    echo -e "${GREEN}  - All $VALID_LINKS anchor links are valid${NC}"
    echo -e "${GREEN}  - Tool counts match: $TOOLS_COUNT${NC}"
    echo -e "${GREEN}  - Category counts match: $CATEGORY_COUNT${NC}"
    exit 0
else
    if [[ ${#VALIDATION_ERRORS[@]} -gt 0 ]]; then
        echo -e "${RED}✗ Validation failed with ${#VALIDATION_ERRORS[@]} errors:${NC}"
        for error in "${VALIDATION_ERRORS[@]}"; do
            echo -e "${RED}  - $error${NC}"
        done
    fi
    
    if [[ ${#VALIDATION_WARNINGS[@]} -gt 0 ]]; then
        echo -e "${YELLOW}⚠ ${#VALIDATION_WARNINGS[@]} warnings:${NC}"
        for warning in "${VALIDATION_WARNINGS[@]}"; do
            echo -e "${YELLOW}  - $warning${NC}"
        done
    fi
    
    echo
    echo -e "${YELLOW}To fix these issues, run:${NC}"
    echo -e "${BLUE}  ./scripts/update_stats.sh --generate-index${NC}"
    
    # Cleanup temporary files
    rm -f "$TOOLS_ANCHORS_FILE" "$TOOL_CATEGORIES_FILE" "$CATEGORY_LIST_FILE"
    exit 1
fi

# Cleanup temporary files
rm -f "$TOOLS_ANCHORS_FILE" "$TOOL_CATEGORIES_FILE" "$CATEGORY_LIST_FILE"