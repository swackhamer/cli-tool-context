#!/bin/bash

# update_stats.sh - Update repository statistics and ensure consistency
# Usage: ./scripts/update_stats.sh [options]
# Options:
#   --report-only     Generate report without updating files
#   --check-consistency  Check for inconsistencies only
#   --update FILE     Update specific file
#   --full-report     Generate comprehensive report
#   --help           Show this help message

# Comment 16: Improved error handling - avoid global set -e
# set -e  # Disabled to handle errors more gracefully

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to output only when not in JSON mode
print_if_not_json() {
    if [[ $JSON_OUTPUT == false ]]; then
        echo -e "$@"
    else
        # In JSON mode, send to stderr so it doesn't corrupt JSON output
        echo -e "$@" >&2
    fi
}

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
TOOLS_FILE="$REPO_ROOT/TOOLS.md"
README_FILE="$REPO_ROOT/README.md"
TODO_FILE="$REPO_ROOT/TODO.md"
CHEATSHEET_FILE="$REPO_ROOT/docs/CHEATSHEET.md"
CLAUDE_GUIDE_FILE="$REPO_ROOT/docs/CLAUDE_GUIDE.md"
SYSADMIN_TOOLS_FILE="$REPO_ROOT/docs/SYSTEM_ADMINISTRATION_TOOLS.md"
TOOL_INDEX_FILE="$REPO_ROOT/docs/TOOL_INDEX.md"
MAINTENANCE_FILE="$REPO_ROOT/docs/MAINTENANCE.md"
FUTURE_TOOLS_FILE="$REPO_ROOT/docs/FUTURE_TOOLS.md"

# Operation flags
REPORT_ONLY=false
CHECK_CONSISTENCY=false
CHECK_LINKS=false
CHECK_FORMAT=false
CHECK_METADATA=false
UPDATE_FILE=""
FULL_REPORT=false
GENERATE_INDEX=false
CHECK_KEYWORDS=false
COMPREHENSIVE_VALIDATION=false
QUICK_VALIDATION=false
VERIFY_STATS=false
VALIDATE_STATS=false
FIX_MODE=false
JSON_OUTPUT=false
LEGACY_DEFAULT=false
CI_MODE=false
SOFT_EXIT=false
UPDATE_README_CATEGORIES=false
METADATA_THRESHOLD=${METADATA_THRESHOLD:-80}

# Statistics variables
TOTAL_TOOLS=0
TOTAL_CATEGORIES=0
TOTAL_LINES=0
TOOLS_BY_CATEGORY=""
DIFFICULTY_DISTRIBUTION=""

# Tracking arrays for issues
declare -a BROKEN_LINKS=()
declare -a FORMAT_ISSUES=()
declare -a CONSISTENCY_ISSUES=()
declare -a CROSS_REF_ISSUES=()
declare -a STRUCTURAL_ISSUES=()
LINK_COUNT=0
BROKEN_LINK_COUNT=0
FORMAT_ISSUE_COUNT=0
CONSISTENCY_ISSUE_COUNT=0
CROSS_REF_ISSUE_COUNT=0
STRUCTURAL_ISSUE_COUNT=0

# Check for legacy default behavior
check_legacy_mode() {
    if [[ "$UPDATE_STATS_LEGACY_DEFAULT" == "true" ]] || [[ "$UPDATE_STATS_LEGACY_DEFAULT" == "1" ]]; then
        return 0
    fi
    return 1
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --report-only)
                REPORT_ONLY=true
                shift
                ;;
            --check-consistency)
                CHECK_CONSISTENCY=true
                CHECK_LINKS=true
                CHECK_FORMAT=true
                CHECK_METADATA=true
                shift
                ;;
            --check-links)
                CHECK_LINKS=true
                shift
                ;;
            --check-format)
                CHECK_FORMAT=true
                shift
                ;;
            --check-metadata)
                CHECK_METADATA=true
                shift
                ;;
            --update)
                UPDATE_FILE="$2"
                shift 2
                ;;
            --update-all)
                UPDATE_FILE="ALL"
                shift
                ;;
            --full-report)
                FULL_REPORT=true
                shift
                ;;
            --generate-index)
                GENERATE_INDEX=true
                shift
                ;;
            --check-keywords)
                CHECK_KEYWORDS=true
                shift
                ;;
            --comprehensive)
                COMPREHENSIVE_VALIDATION=true
                CHECK_CONSISTENCY=true
                CHECK_LINKS=true
                CHECK_FORMAT=true
                CHECK_METADATA=true
                CHECK_KEYWORDS=true
                shift
                ;;
            --quick)
                QUICK_VALIDATION=true
                shift
                ;;
            --verify-stats)
                VERIFY_STATS=true
                shift
                ;;
            --validate-stats)
                VALIDATE_STATS=true
                shift
                ;;
            --fix)
                FIX_MODE=true
                shift
                ;;
            --json)
                JSON_OUTPUT=true
                shift
                ;;
            --legacy-default)
                LEGACY_DEFAULT=true
                shift
                ;;
            --ci)
                CI_MODE=true
                shift
                ;;
            --soft-exit)
                SOFT_EXIT=true
                shift
                ;;
            --update-readme-categories)
                UPDATE_README_CATEGORIES=true
                shift
                ;;
            --metadata-threshold)
                METADATA_THRESHOLD="$2"
                shift 2
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
}

# Show help message
show_help() {
    echo "update_stats.sh - Update repository statistics and ensure consistency"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --report-only        Generate report without updating files"
    echo "  --check-consistency  Check for all inconsistencies (includes links, format, and metadata)"
    echo "  --check-links        Check internal links validity"
    echo "  --check-format       Check format consistency in TOOLS.md"
    echo "  --check-metadata     Check metadata headers in TOOLS.md"
    echo "  --update FILE        Update specific file"
    echo "  --update-all         Update all documentation files with current statistics"
    echo "  --full-report        Generate comprehensive report"
    echo "  --generate-index     Generate comprehensive tool index"
    echo "  --check-keywords     Check keywords and synonyms in metadata"
    echo "  --comprehensive      Run all validations (full consistency check)"
    echo "  --quick             Run basic validations only (faster)"
    echo "  --verify-stats      Check basic statistics consistency without making changes"
    echo "  --validate-stats    Perform comprehensive statistics validation (includes deep link checks)"
    echo "  --fix               Automatically fix statistics inconsistencies"
    echo "  --json              Output results in JSON format (for integration with other tools)"
    echo "  --legacy-default    Use legacy behavior (update-all when no flags given)"
    echo "  --ci                CI mode (strict validation, fail on warnings)"
    echo "  --soft-exit         Don't fail on warnings (exit 0 even with warnings)"
    echo "  --update-readme-categories  Update README category table from statistics"
    echo "  --metadata-threshold N  Set metadata coverage threshold percentage (default: 80)"
    echo "  --help              Show this help message"
    echo ""
    echo "Default behavior: Report-only mode (safe, no changes made)"
    echo "To update files, use --update-all or --fix"
    echo ""
    echo "Legacy Compatibility:"
    echo "  Set UPDATE_STATS_LEGACY_DEFAULT=true or use --legacy-default to"
    echo "  restore old behavior (update-all when no flags given)."
    echo "  Note: Legacy mode is deprecated and will be removed in a future version."
    echo ""
    echo "CI Integration:"
    echo "  --ci mode enables strict validation (fails on warnings)"
    echo "  --soft-exit mode prevents exit code failure on warnings"
    echo ""
    echo "Examples:"
    echo "  $0                           # Generate report only (default safe mode)"
    echo "  $0 --update-all            # Update all statistics"
    echo "  $0 --report-only            # Generate report only (explicit)"
    echo "  $0 --check-consistency      # Check all consistency issues"
    echo "  $0 --check-links           # Check internal links only"
    echo "  $0 --check-format          # Check format consistency only"
    echo "  $0 --check-metadata        # Check metadata headers only"
    echo "  $0 --update README.md       # Update specific file"
    echo "  $0 --update-all            # Update all documentation files"
    echo "  $0 --full-report           # Generate detailed report"
    echo "  $0 --comprehensive         # Full consistency validation"
    echo "  $0 --quick                 # Quick validation (basic checks)"
    echo "  $0 --verify-stats          # Basic statistics verification"
    echo "  $0 --validate-stats        # Comprehensive statistics validation"
    echo "  $0 --fix                   # Auto-fix statistics inconsistencies"
    echo ""
    echo "Validation Levels:"
    echo "  --verify-stats checks:      Basic statistics markers, file presence"
    echo "  --validate-stats checks:    Everything in --verify-stats plus:"
    echo "                              - Deep link validation"
    echo "                              - Cross-reference checks"
    echo "                              - Complete metadata validation"
}

# Count tools in TOOLS.md
# Performance Note (Comment 10): This function could be optimized to parse TOOLS.md
# once and extract all metrics simultaneously. Currently using multiple grep passes
# for simplicity and maintainability. Consider caching results if called multiple times.
count_tools() {
    [[ $JSON_OUTPUT == false ]] && echo -e "${BLUE}Counting tools in TOOLS.md...${NC}"
    
    # Count tool entries (lines starting with ### **)
    TOTAL_TOOLS=$(grep -c "^### \*\*" "$TOOLS_FILE" || echo "0")
    
    # Count total lines (trim whitespace from wc output)
    TOTAL_LINES=$(wc -l < "$TOOLS_FILE" | tr -d ' ')
    
    # Count categories (lines starting with ##)
    TOTAL_CATEGORIES=$(grep -c "^## " "$TOOLS_FILE" || echo "0")
    
    [[ $JSON_OUTPUT == false ]] && echo -e "${GREEN}Found $TOTAL_TOOLS tools across $TOTAL_CATEGORIES categories${NC}"
    [[ $JSON_OUTPUT == false ]] && echo -e "${GREEN}Total lines: $TOTAL_LINES${NC}"
}

# Analyze tools by category
analyze_categories() {
    [[ $JSON_OUTPUT == false ]] && echo -e "${BLUE}Analyzing tools by category...${NC}"
    
    local current_category=""
    local category_count=0
    local category_list=""
    
    while IFS= read -r line; do
        if [[ $line =~ ^##[[:space:]]+(.+) ]]; then
            if [[ -n $current_category ]] && [[ $category_count -gt 0 ]]; then
                category_list="${category_list}${current_category}: ${category_count} tools\n"
            fi
            current_category="${BASH_REMATCH[1]}"
            category_count=0
        elif [[ $line =~ ^###\ \*\* ]]; then
            ((category_count++))
        fi
    done < "$TOOLS_FILE"
    
    # Add last category
    if [[ -n $current_category ]] && [[ $category_count -gt 0 ]]; then
        category_list="${category_list}${current_category}: ${category_count} tools\n"
    fi
    
    TOOLS_BY_CATEGORY="$category_list"
}

# Analyze difficulty ratings
analyze_difficulty() {
    [[ $JSON_OUTPUT == false ]] && echo -e "${BLUE}Analyzing difficulty ratings...${NC}"
    
    # Define the star character
    local STAR=$(printf '⭐')
    
    # Count difficulty levels using literal star patterns
    local beginner=$(grep -o "${STAR}${STAR}[^${STAR}]" "$TOOLS_FILE" | wc -l || echo "0")
    local intermediate=$(grep -o "${STAR}${STAR}${STAR}[^${STAR}]" "$TOOLS_FILE" | wc -l || echo "0")
    local advanced=$(grep -o "${STAR}${STAR}${STAR}${STAR}[^${STAR}]" "$TOOLS_FILE" | wc -l || echo "0")
    local expert=$(grep -o "${STAR}${STAR}${STAR}${STAR}${STAR}" "$TOOLS_FILE" | wc -l || echo "0")
    
    DIFFICULTY_DISTRIBUTION="Beginner (⭐⭐): $beginner
Intermediate (⭐⭐⭐): $intermediate
Advanced (⭐⭐⭐⭐): $advanced
Expert (⭐⭐⭐⭐⭐): $expert"
}

# Check format consistency in TOOLS.md
check_format_consistency() {
    echo -e "${BLUE}Checking format consistency in TOOLS.md...${NC}"
    
    local issues_found=false
    FORMAT_ISSUES=()
    FORMAT_ISSUE_COUNT=0
    
    # Read TOOLS.md and check each tool entry
    local in_tool_section=false
    local current_tool=""
    local has_description=false
    local has_difficulty=false
    local has_examples=false
    local line_num=0
    
    while IFS= read -r line; do
        ((line_num++))
        
        # Check for tool entry start
        if [[ $line =~ ^###\ \*\*(.+)\*\* ]]; then
            # Check previous tool if exists
            if [[ -n $current_tool ]]; then
                if [[ $has_description == false ]]; then
                    FORMAT_ISSUES+=("Line $((line_num-1)): Tool '$current_tool' missing **Description** section")
                    ((FORMAT_ISSUE_COUNT++))
                    issues_found=true
                fi
                if [[ $has_difficulty == false ]]; then
                    FORMAT_ISSUES+=("Line $((line_num-1)): Tool '$current_tool' missing difficulty rating")
                    ((FORMAT_ISSUE_COUNT++))
                    issues_found=true
                fi
                if [[ $has_examples == false ]]; then
                    FORMAT_ISSUES+=("Line $((line_num-1)): Tool '$current_tool' missing **Examples** section")
                    ((FORMAT_ISSUE_COUNT++))
                    issues_found=true
                fi
            fi
            
            # Start new tool
            current_tool="${BASH_REMATCH[1]}"
            in_tool_section=true
            has_description=false
            has_difficulty=false
            has_examples=false
        elif [[ $line =~ ^##[[:space:]]+ ]]; then
            # Category header - reset tool tracking
            if [[ -n $current_tool ]] && [[ $in_tool_section == true ]]; then
                # Check last tool in previous category
                if [[ $has_description == false ]]; then
                    FORMAT_ISSUES+=("Line $line_num: Tool '$current_tool' missing **Description** section")
                    ((FORMAT_ISSUE_COUNT++))
                    issues_found=true
                fi
                if [[ $has_difficulty == false ]]; then
                    FORMAT_ISSUES+=("Line $line_num: Tool '$current_tool' missing difficulty rating")
                    ((FORMAT_ISSUE_COUNT++))
                    issues_found=true
                fi
                if [[ $has_examples == false ]]; then
                    FORMAT_ISSUES+=("Line $line_num: Tool '$current_tool' missing **Examples** section")
                    ((FORMAT_ISSUE_COUNT++))
                    issues_found=true
                fi
            fi
            current_tool=""
            in_tool_section=false
        elif [[ $in_tool_section == true ]]; then
            # Check for required sections
            if [[ $line =~ \*\*Description\*\* ]]; then
                has_description=true
            elif [[ $line =~ \*\*Examples\*\* ]]; then
                has_examples=true
            elif [[ $line =~ ⭐ ]]; then
                has_difficulty=true
            fi
        fi
    done < "$TOOLS_FILE"
    
    # Check last tool
    if [[ -n $current_tool ]] && [[ $in_tool_section == true ]]; then
        if [[ $has_description == false ]]; then
            FORMAT_ISSUES+=("End of file: Tool '$current_tool' missing **Description** section")
            ((FORMAT_ISSUE_COUNT++))
            issues_found=true
        fi
        if [[ $has_difficulty == false ]]; then
            FORMAT_ISSUES+=("End of file: Tool '$current_tool' missing difficulty rating")
            ((FORMAT_ISSUE_COUNT++))
            issues_found=true
        fi
        if [[ $has_examples == false ]]; then
            FORMAT_ISSUES+=("End of file: Tool '$current_tool' missing **Examples** section")
            ((FORMAT_ISSUE_COUNT++))
            issues_found=true
        fi
    fi
    
    # Additional format checks (Comment 3: required sections)
    local in_code_block=false
    local prev_line=""
    local line_num=0
    
    while IFS= read -r line; do
        ((line_num++))
        
        # Check code block formatting
        if [[ $line =~ ^\`\`\` ]]; then
            in_code_block=$([[ $in_code_block == true ]] && echo false || echo true)
        fi
        
        # Check header spacing (no more than 2 blank lines)
        if [[ -z $line ]] && [[ -z $prev_line ]]; then
            local next_line
            IFS= read -r next_line || true
            if [[ -z $next_line ]]; then
                FORMAT_ISSUES+=("Line $line_num: Excessive blank lines (more than 2)")
                ((FORMAT_ISSUE_COUNT++))
                issues_found=true
            fi
        fi
        
        prev_line="$line"
    done < "$TOOLS_FILE"
    
    if [[ ${#FORMAT_ISSUES[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Warning: Found $FORMAT_ISSUE_COUNT format consistency issues:${NC}"
        for issue in "${FORMAT_ISSUES[@]}"; do
            echo "  - $issue"
        done
    else
        echo -e "${GREEN}All tool entries follow consistent format!${NC}"
    fi
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Parse metadata from HTML comment block (Comment 11: improved whitespace/case handling)
parse_metadata() {
    local metadata_block="$1"
    local field="$2"
    
    # Case-insensitive matching with flexible whitespace
    echo "$metadata_block" | grep -iE "^[[:space:]]*$field[[:space:]]*:" | sed -E "s/^[[:space:]]*$field[[:space:]]*:[[:space:]]*//I" | xargs
}

# Find line number for a given pattern in a file
find_line_number() {
    local file="$1"
    local pattern="$2"
    local context="${3:-}"
    
    if [[ -f "$file" ]]; then
        local line_num=$(grep -n "$pattern" "$file" | head -1 | cut -d: -f1)
        if [[ -n "$line_num" ]]; then
            echo "line $line_num"
        elif [[ -n "$context" ]]; then
            # Try to find context line
            local context_num=$(grep -n "$context" "$file" | head -1 | cut -d: -f1)
            if [[ -n "$context_num" ]]; then
                echo "near line $context_num"
            else
                echo "location unknown"
            fi
        else
            echo "location unknown"
        fi
    else
        echo "file not found"
    fi
}

# Generate detailed issue report with line numbers
report_issue_with_location() {
    local file="$1"
    local issue="$2" 
    local pattern="$3"
    local context="${4:-}"
    
    local location=$(find_line_number "$file" "$pattern" "$context")
    echo "  - $(basename "$file") ($location): $issue"
}

# Slugify function for GitHub-style anchors (Comment 2 & 6: robust anchor generation)
# Enhanced to handle special characters and punctuation properly
slugify() {
    local text="$1"
    echo "$text" | \
        tr '[:upper:]' '[:lower:]' | \
        sed -E 's/\*|`|"|'\''//g' | \
        sed -E 's/[^a-z0-9[:space:]-]//g' | \
        sed -E 's/[[:space:]]+/-/g' | \
        sed -E 's/-+/-/g' | \
        sed -E 's/^-|-$//g'
}

# Test anchor generation for tools with special characters
validate_anchor_generation() {
    local test_cases=(
        "tool-name"
        "tool.name"
        "tool/name"
        "tool(name)"
        "tool&name"
        "tool@host"
        "tool#tag"
        "tool!bang"
    )
    
    echo -e "${BLUE}Testing anchor generation for special characters:${NC}"
    for test in "${test_cases[@]}"; do
        local anchor=$(slugify "$test")
        echo "  $test -> #$anchor"
    done
}

# Check metadata consistency in TOOLS.md
# Calculate metadata schema coverage
calculate_metadata_coverage() {
    local total_tools=$1
    local tools_with_full_schema=0
    local current_tool=""
    local metadata_block=""
    local in_metadata=false
    
    while IFS= read -r line; do
        if [[ $line =~ ^###\ \*\*(.+)\*\* ]]; then
            # Check previous tool's metadata
            if [[ -n $metadata_block ]]; then
                local has_platform=$(parse_metadata "$metadata_block" "platform")
                local has_installation=$(parse_metadata "$metadata_block" "installation")
                local has_keywords=$(parse_metadata "$metadata_block" "keywords")
                local has_synonyms=$(parse_metadata "$metadata_block" "synonyms")
                
                if [[ -n $has_platform ]] && [[ -n $has_installation ]] && [[ -n $has_keywords ]] && [[ -n $has_synonyms ]]; then
                    ((tools_with_full_schema++))
                fi
            fi
            
            current_tool="${BASH_REMATCH[1]}"
            metadata_block=""
            in_metadata=false
        elif [[ $line == "<!-- meta" ]]; then
            in_metadata=true
            metadata_block="$line"
        elif [[ $in_metadata == true ]]; then
            metadata_block="$metadata_block\n$line"
            if [[ $line == "-->" ]]; then
                in_metadata=false
            fi
        fi
    done < "$TOOLS_FILE"
    
    # Check last tool
    if [[ -n $metadata_block ]]; then
        local has_platform=$(parse_metadata "$metadata_block" "platform")
        local has_installation=$(parse_metadata "$metadata_block" "installation")
        local has_keywords=$(parse_metadata "$metadata_block" "keywords")
        local has_synonyms=$(parse_metadata "$metadata_block" "synonyms")
        
        if [[ -n $has_platform ]] && [[ -n $has_installation ]] && [[ -n $has_keywords ]] && [[ -n $has_synonyms ]]; then
            ((tools_with_full_schema++))
        fi
    fi
    
    local coverage_percentage=0
    if [[ $total_tools -gt 0 ]]; then
        coverage_percentage=$(( (tools_with_full_schema * 100) / total_tools ))
    fi
    
    echo -e "${BLUE}Metadata Schema Coverage:${NC}"
    echo -e "  Tools with full schema: $tools_with_full_schema / $total_tools ($coverage_percentage%)${NC}"
    
    if [[ $coverage_percentage -lt $METADATA_THRESHOLD ]]; then
        echo -e "${YELLOW}Warning: Metadata coverage ($coverage_percentage%) is below threshold ($METADATA_THRESHOLD%)${NC}"
        return 1
    else
        echo -e "${GREEN}Metadata coverage meets threshold ($coverage_percentage% >= $METADATA_THRESHOLD%)${NC}"
        return 0
    fi
}

# Update README category table
update_readme_categories() {
    echo -e "${BLUE}Updating README category table with proper anchors...${NC}"
    
    # Calculate category statistics with anchors
    local category_stats=""
    local current_category=""
    local category_count=0
    
    while IFS= read -r line; do
        if [[ $line =~ ^##[[:space:]]+(.+) ]]; then
            if [[ -n $current_category ]] && [[ $category_count -gt 0 ]]; then
                # Generate proper anchor using slugify
                local anchor=$(slugify "$current_category")
                # Create linked category name
                category_stats="${category_stats}| [$current_category](./docs/TOOL_INDEX.md#$anchor) | $category_count |\n"
            fi
            current_category="${BASH_REMATCH[1]}"
            category_count=0
        elif [[ $line =~ ^###\ \*\* ]]; then
            ((category_count++))
        fi
    done < "$TOOLS_FILE"
    
    # Add last category
    if [[ -n $current_category ]] && [[ $category_count -gt 0 ]]; then
        # Generate proper anchor using slugify
        local anchor=$(slugify "$current_category")
        # Create linked category name
        category_stats="${category_stats}| [$current_category](./docs/TOOL_INDEX.md#$anchor) | $category_count |\n"
    fi
    
    # Create new table with links
    local new_table="| Category | Count |\n| --- | --- |\n$category_stats"
    
    # Find and replace the table in README
    local in_table=false
    local table_start_line=0
    local table_end_line=0
    local line_num=0
    
    while IFS= read -r line; do
        ((line_num++))
        if [[ $line == "| Category | Count |" ]]; then
            in_table=true
            table_start_line=$line_num
        elif [[ $in_table == true ]] && [[ ! $line =~ ^\| ]]; then
            table_end_line=$((line_num - 1))
            break
        fi
    done < "$README_FILE"
    
    if [[ $table_start_line -gt 0 ]] && [[ $table_end_line -gt 0 ]]; then
        # Create temporary file with updated table
        head -n $((table_start_line - 1)) "$README_FILE" > "${README_FILE}.tmp"
        echo -e "$new_table" >> "${README_FILE}.tmp"
        tail -n +$((table_end_line + 1)) "$README_FILE" >> "${README_FILE}.tmp"
        mv "${README_FILE}.tmp" "$README_FILE"
        echo -e "${GREEN}README category table updated successfully with proper anchors${NC}"
        
        # Verify anchors match TOOL_INDEX.md
        if [[ -f "$REPO_ROOT/docs/TOOL_INDEX.md" ]]; then
            echo -e "${BLUE}Verifying category anchors match TOOL_INDEX.md...${NC}"
            local mismatched=0
            while IFS= read -r line; do
                if [[ $line =~ ^##[[:space:]]+(.+) ]]; then
                    local category="${BASH_REMATCH[1]}"
                    local expected_anchor=$(slugify "$category")
                    if ! grep -q "^### $category" "$REPO_ROOT/docs/TOOL_INDEX.md"; then
                        echo -e "${YELLOW}Warning: Category '$category' not found in TOOL_INDEX.md${NC}"
                        ((mismatched++))
                    fi
                fi
            done < "$TOOLS_FILE"
            
            if [[ $mismatched -eq 0 ]]; then
                echo -e "${GREEN}All category anchors verified successfully${NC}"
            else
                echo -e "${YELLOW}Found $mismatched category anchor mismatches - run --generate-index to sync${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}Warning: Could not find category table in README${NC}"
        return 1
    fi
    
    return 0
}

check_metadata_consistency() {
    echo -e "${BLUE}Checking metadata consistency in TOOLS.md...${NC}"
    
    local issues_found=false
    local metadata_issues=()
    local metadata_issue_count=0
    local tools_with_metadata=0
    local tools_without_metadata=0
    
    # Get all tool names for cross-reference validation (Comment 15: handle uppercase/edge cases)
    local all_tools=$(grep -E "^###[[:space:]]+\*\*" "$TOOLS_FILE" | sed -E 's/###[[:space:]]+\*\*([^*]+)\*\*.*/\1/' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Read TOOLS.md and check each tool entry
    local in_tool_section=false
    local in_metadata=false
    local current_tool=""
    local metadata_block=""
    local line_num=0
    local lines_after_tool=0
    
    while IFS= read -r line; do
        ((line_num++))
        
        # Check for tool entry start
        if [[ $line =~ ^###\ \*\*(.+)\*\* ]]; then
            # Check previous tool's metadata if exists
            if [[ -n $current_tool ]] && [[ $in_tool_section == true ]]; then
                if [[ -z $metadata_block ]]; then
                    metadata_issues+=("Tool '$current_tool' missing metadata block")
                    ((metadata_issue_count++))
                    ((tools_without_metadata++))
                    issues_found=true
                fi
            fi
            
            # Start new tool
            current_tool="${BASH_REMATCH[1]}"
            in_tool_section=true
            in_metadata=false
            metadata_block=""
            lines_after_tool=0
        elif [[ $in_tool_section == true ]]; then
            ((lines_after_tool++))
            
            # Check for metadata block start
            if [[ $lines_after_tool -le 5 ]] && [[ $line == "<!-- meta" ]]; then
                in_metadata=true
                metadata_block="$line"
            elif [[ $in_metadata == true ]]; then
                metadata_block="$metadata_block
$line"
                
                # Check for metadata block end
                if [[ $line == "-->" ]]; then
                    in_metadata=false
                    ((tools_with_metadata++))
                    
                    # Validate metadata fields
                    local category=$(parse_metadata "$metadata_block" "category")
                    local difficulty=$(parse_metadata "$metadata_block" "difficulty")
                    local aliases=$(parse_metadata "$metadata_block" "aliases")
                    local tags=$(parse_metadata "$metadata_block" "tags")
                    local related=$(parse_metadata "$metadata_block" "related")
                    local keywords=$(parse_metadata "$metadata_block" "keywords")
                    local synonyms=$(parse_metadata "$metadata_block" "synonyms")
                    local platform=$(parse_metadata "$metadata_block" "platform")
                    local installation=$(parse_metadata "$metadata_block" "installation")
                    
                    # Check required fields
                    if [[ -z $category ]]; then
                        metadata_issues+=("Tool '$current_tool' metadata missing required field: category")
                        ((metadata_issue_count++))
                        issues_found=true
                    fi
                    
                    if [[ -z $difficulty ]]; then
                        metadata_issues+=("Tool '$current_tool' metadata missing required field: difficulty")
                        ((metadata_issue_count++))
                        issues_found=true
                    elif [[ ! $difficulty =~ ⭐ ]]; then
                        metadata_issues+=("Tool '$current_tool' difficulty field missing star symbols")
                        ((metadata_issue_count++))
                        issues_found=true
                    fi
                    
                    if [[ -z $tags ]]; then
                        metadata_issues+=("Tool '$current_tool' metadata missing required field: tags")
                        ((metadata_issue_count++))
                        issues_found=true
                    elif [[ ! $tags =~ ^#[a-z] ]]; then
                        metadata_issues+=("Tool '$current_tool' has invalid tag format: $tags")
                        ((metadata_issue_count++))
                        issues_found=true
                    fi
                    
                    # Always check keywords and synonyms presence (Comment 5)
                    if [[ -z $keywords ]]; then
                        metadata_issues+=("Tool '$current_tool' metadata missing keywords field")
                        ((metadata_issue_count++))
                        issues_found=true
                    fi
                    
                    if [[ -z $synonyms ]]; then
                        metadata_issues+=("Tool '$current_tool' metadata missing synonyms field")
                        ((metadata_issue_count++))
                        issues_found=true
                    fi
                    
                    # Check for platform and installation fields (Comment 13)
                    if [[ -z $platform ]]; then
                        metadata_issues+=("Tool '$current_tool' metadata missing platform field")
                        ((metadata_issue_count++))
                        issues_found=true
                    fi
                    
                    if [[ -z $installation ]]; then
                        metadata_issues+=("Tool '$current_tool' metadata missing installation field")
                        ((metadata_issue_count++))
                        issues_found=true
                    fi
                    
                    # Additional validation if CHECK_KEYWORDS is enabled
                    if [[ $CHECK_KEYWORDS == true ]]; then
                        if [[ -n $keywords ]] && [[ $keywords =~ [,] ]]; then
                            metadata_issues+=("Tool '$current_tool' keywords should be space-separated, not comma-separated")
                            ((metadata_issue_count++))
                            issues_found=true
                        fi
                        
                        if [[ -n $synonyms ]] && [[ ! $synonyms =~ , ]] && [[ $(echo "$synonyms" | wc -w) -gt 1 ]]; then
                            metadata_issues+=("Tool '$current_tool' synonyms should be comma-separated")
                            ((metadata_issue_count++))
                            issues_found=true
                        fi
                    fi
                    
                    # Validate related tools exist
                    if [[ -n $related ]]; then
                        IFS=',' read -ra related_tools <<< "$related"
                        for tool in "${related_tools[@]}"; do
                            tool=$(echo "$tool" | xargs)
                            # Normalize for comparison
                            local normalized_tool=$(echo "$tool" | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:]]//g')
                            local tool_found=false
                            while IFS= read -r existing_tool; do
                                local normalized_existing=$(echo "$existing_tool" | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:]]//g')
                                if [[ "$normalized_tool" == "$normalized_existing" ]]; then
                                    tool_found=true
                                    break
                                fi
                            done <<< "$all_tools"
                            
                            if [[ $tool_found == false ]] && [[ -n $tool ]]; then
                                metadata_issues+=("Tool '$current_tool' references non-existent related tool: $tool")
                                ((metadata_issue_count++))
                                issues_found=true
                            fi
                        done
                    fi
                fi
            elif [[ $lines_after_tool -gt 5 ]] && [[ -z $metadata_block ]]; then
                # No metadata found within 5 lines
                metadata_issues+=("Tool '$current_tool' missing metadata block")
                ((metadata_issue_count++))
                ((tools_without_metadata++))
                issues_found=true
                in_tool_section=false
            fi
        fi
        
        # Reset on new category
        if [[ $line =~ ^##[[:space:]]+ ]]; then
            # Check last tool's metadata if needed
            if [[ -n $current_tool ]] && [[ $in_tool_section == true ]] && [[ -z $metadata_block ]]; then
                metadata_issues+=("Tool '$current_tool' missing metadata block")
                ((metadata_issue_count++))
                ((tools_without_metadata++))
                issues_found=true
            fi
            current_tool=""
            in_tool_section=false
            in_metadata=false
            metadata_block=""
        fi
    done < "$TOOLS_FILE"
    
    # Check last tool
    if [[ -n $current_tool ]] && [[ $in_tool_section == true ]] && [[ -z $metadata_block ]]; then
        metadata_issues+=("Tool '$current_tool' missing metadata block")
        ((metadata_issue_count++))
        ((tools_without_metadata++))
        issues_found=true
    fi
    
    # Report results
    echo -e "${GREEN}Tools with metadata: $tools_with_metadata${NC}"
    echo -e "${YELLOW}Tools without metadata: $tools_without_metadata${NC}"
    
    if [[ ${#metadata_issues[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Warning: Found $metadata_issue_count metadata issues:${NC}"
        for issue in "${metadata_issues[@]}"; do
            echo "  - $issue"
        done
    else
        echo -e "${GREEN}All tool entries have valid metadata!${NC}"
    fi
    
    # Store in global FORMAT_ISSUES for compatibility
    FORMAT_ISSUES+=("${metadata_issues[@]}")
    FORMAT_ISSUE_COUNT=$((FORMAT_ISSUE_COUNT + metadata_issue_count))
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Comprehensive cross-file consistency validation
check_comprehensive_consistency() {
    echo -e "${BLUE}Performing comprehensive consistency validation across all documentation...${NC}"
    
    local issues_found=false
    CONSISTENCY_ISSUES=()
    CONSISTENCY_ISSUE_COUNT=0
    
    # 1. Extract statistics from all relevant files
    local tools_main_file=$(grep -c "^### \*\*" "$TOOLS_FILE" 2>/dev/null || echo "0")
    local categories_main_file=$(grep -c "^## " "$TOOLS_FILE" 2>/dev/null || echo "0")
    local lines_main_file=$(wc -l < "$TOOLS_FILE" 2>/dev/null | xargs || echo "0")
    
    echo -e "${BLUE}Base statistics from TOOLS.md: $tools_main_file tools, $categories_main_file categories, $lines_main_file lines${NC}"
    
    # 2. Check README.md consistency
    if [[ -f "$README_FILE" ]]; then
        local readme_tools=$(grep "tools-count" "$README_FILE" | sed -E 's/.*tools-count -->([0-9]+).*/\1/' | head -1 || echo "0")
        local readme_categories=$(grep "categories-count" "$README_FILE" | sed -E 's/.*categories-count -->([0-9]+).*/\1/' | head -1 || echo "0")
        local readme_lines=$(grep "lines-count" "$README_FILE" | sed -E 's/.*lines-count -->([0-9,]+).*/\1/' | tr -d ',' | head -1 || echo "0")
        
        if [[ "$readme_tools" != "$tools_main_file" ]] && [[ "$readme_tools" != "0" ]]; then
            CONSISTENCY_ISSUES+=("README.md tool count ($readme_tools) doesn't match TOOLS.md ($tools_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
        
        if [[ "$readme_categories" != "$categories_main_file" ]] && [[ "$readme_categories" != "0" ]]; then
            CONSISTENCY_ISSUES+=("README.md category count ($readme_categories) doesn't match TOOLS.md ($categories_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
        
        if [[ "$readme_lines" != "$lines_main_file" ]] && [[ "$readme_lines" != "0" ]]; then
            CONSISTENCY_ISSUES+=("README.md line count ($readme_lines) doesn't match TOOLS.md ($lines_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
    fi
    
    # 3. Check CHEATSHEET.md consistency
    if [[ -f "$CHEATSHEET_FILE" ]]; then
        local cheat_tools=$(grep "cheat-tools-count" "$CHEATSHEET_FILE" | sed -E 's/.*cheat-tools-count -->([0-9]+).*/\1/' | head -1 || echo "0")
        local cheat_categories=$(grep "cheat-categories-count" "$CHEATSHEET_FILE" | sed -E 's/.*cheat-categories-count -->([0-9]+).*/\1/' | head -1 || echo "0")
        
        if [[ "$cheat_tools" != "$tools_main_file" ]] && [[ "$cheat_tools" != "0" ]]; then
            CONSISTENCY_ISSUES+=("CHEATSHEET.md tool count ($cheat_tools) doesn't match TOOLS.md ($tools_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
        
        if [[ "$cheat_categories" != "$categories_main_file" ]] && [[ "$cheat_categories" != "0" ]]; then
            CONSISTENCY_ISSUES+=("CHEATSHEET.md category count ($cheat_categories) doesn't match TOOLS.md ($categories_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
    fi
    
    # 4. Check CLAUDE_GUIDE.md consistency
    if [[ -f "$CLAUDE_GUIDE_FILE" ]]; then
        # Look for tool and line count references in the guide
        local guide_tools=$(grep -oE '([0-9]+)\+ tools' "$CLAUDE_GUIDE_FILE" | grep -oE '[0-9]+' | head -1 || echo "0")
        local guide_lines=$(grep -oE '([0-9,]+) lines' "$CLAUDE_GUIDE_FILE" | grep -oE '[0-9,]+' | head -1 | tr -d ',' || echo "0")
        
        if [[ "$guide_tools" != "$tools_main_file" ]] && [[ "$guide_tools" != "0" ]]; then
            CONSISTENCY_ISSUES+=("CLAUDE_GUIDE.md tool count ($guide_tools) doesn't match TOOLS.md ($tools_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
        
        if [[ "$guide_lines" != "$lines_main_file" ]] && [[ "$guide_lines" != "0" ]]; then
            CONSISTENCY_ISSUES+=("CLAUDE_GUIDE.md line count ($guide_lines) doesn't match TOOLS.md ($lines_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
    fi
    
    # 5. Check SYSTEM_ADMINISTRATION_TOOLS.md for referenced tool counts
    if [[ -f "$SYSADMIN_TOOLS_FILE" ]]; then
        # Look for references to the main TOOLS.md file
        local sysadmin_refs=$(grep -oE '([0-9]+)\+ (commands|tools)' "$SYSADMIN_TOOLS_FILE" | grep -oE '[0-9]+' | head -1 || echo "0")
        local sysadmin_categories=$(grep -oE '([0-9]+)\+ categories' "$SYSADMIN_TOOLS_FILE" | grep -oE '[0-9]+' | head -1 || echo "0")
        
        if [[ "$sysadmin_refs" != "0" ]] && [[ "$sysadmin_refs" != "$tools_main_file" ]]; then
            CONSISTENCY_ISSUES+=("SYSTEM_ADMINISTRATION_TOOLS.md tool count reference ($sysadmin_refs) doesn't match TOOLS.md ($tools_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
        
        if [[ "$sysadmin_categories" != "0" ]] && [[ "$sysadmin_categories" != "$categories_main_file" ]]; then
            CONSISTENCY_ISSUES+=("SYSTEM_ADMINISTRATION_TOOLS.md category count reference ($sysadmin_categories) doesn't match TOOLS.md ($categories_main_file)")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
    fi
    
    # 6. Validate file existence and structure consistency
    local required_files=(
        "$README_FILE:README.md"
        "$TOOLS_FILE:TOOLS.md" 
        "$CHEATSHEET_FILE:docs/CHEATSHEET.md"
        "$CLAUDE_GUIDE_FILE:docs/CLAUDE_GUIDE.md"
        "$SYSADMIN_TOOLS_FILE:docs/SYSTEM_ADMINISTRATION_TOOLS.md"
        "$TOOL_INDEX_FILE:docs/TOOL_INDEX.md"
    )
    
    for file_spec in "${required_files[@]}"; do
        local file_path="${file_spec%:*}"
        local file_name="${file_spec#*:}"
        
        if [[ ! -f "$file_path" ]]; then
            CONSISTENCY_ISSUES+=("Required file missing: $file_name")
            ((CONSISTENCY_ISSUE_COUNT++))
            issues_found=true
        fi
    done
    
    # 7. Check that all statistics markers are properly formatted and present
    check_statistics_markers
    local marker_result=$?
    if [[ $marker_result -ne 0 ]]; then
        issues_found=true
    fi
    
    # Report results
    if [[ ${#CONSISTENCY_ISSUES[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Warning: Found $CONSISTENCY_ISSUE_COUNT comprehensive consistency issues:${NC}"
        for issue in "${CONSISTENCY_ISSUES[@]}"; do
            echo "  - $issue"
        done
    else
        echo -e "${GREEN}All comprehensive consistency checks passed!${NC}"
    fi
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Check statistics markers consistency across files
check_statistics_markers() {
    print_if_not_json "${BLUE}Checking statistics markers consistency...${NC}"
    
    local issues_found=false
    local marker_files=(
        "$README_FILE"
        "$CHEATSHEET_FILE"
    )
    
    for file in "${marker_files[@]}"; do
        if [[ -f "$file" ]]; then
            local file_name=$(basename "$file")
            
            # Check for required markers based on file type
            case "$file_name" in
                "README.md")
                    local required_markers=("tools-count" "categories-count" "lines-count")
                    ;;
                "CHEATSHEET.md")  
                    local required_markers=("cheat-tools-count" "cheat-categories-count")
                    ;;
            esac
            
            for marker in "${required_markers[@]}"; do
                if ! grep -q "<!-- $marker -->" "$file"; then
                    CONSISTENCY_ISSUES+=("Missing statistics marker '$marker' in $file_name")
                    ((CONSISTENCY_ISSUE_COUNT++))
                    issues_found=true
                fi
                
                if ! grep -q "<!-- /$marker -->" "$file"; then
                    CONSISTENCY_ISSUES+=("Missing closing statistics marker '/$marker' in $file_name")
                    ((CONSISTENCY_ISSUE_COUNT++))
                    issues_found=true
                fi
            done
        fi
    done
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Check cross-references between documentation files
check_cross_references() {
    echo -e "${BLUE}Checking cross-references between documentation files...${NC}"
    
    local issues_found=false
    CROSS_REF_ISSUES=()
    CROSS_REF_ISSUE_COUNT=0
    
    # Extract all tool names from TOOLS.md
    local all_tools_list=$(grep -E "^###[[:space:]]+\*\*" "$TOOLS_FILE" | sed -E 's/###[[:space:]]+\*\*([^*]+)\*\*.*/\1/' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Check references in specialized documentation files
    local files_to_check=(
        "$SYSADMIN_TOOLS_FILE:SYSTEM_ADMINISTRATION_TOOLS.md"
        "$CHEATSHEET_FILE:CHEATSHEET.md"
        "$CLAUDE_GUIDE_FILE:CLAUDE_GUIDE.md"
    )
    
    for file_spec in "${files_to_check[@]}"; do
        local file_path="${file_spec%:*}"
        local file_name="${file_spec#*:}"
        
        if [[ -f "$file_path" ]]; then
            # Look for tool references (backticked commands)
            while IFS= read -r referenced_tool; do
                if [[ -n "$referenced_tool" ]]; then
                    local tool_found=false
                    
                    # Check if this tool exists in TOOLS.md
                    while IFS= read -r existing_tool; do
                        if [[ "$(echo "$referenced_tool" | tr '[:upper:]' '[:lower:]')" == "$(echo "$existing_tool" | tr '[:upper:]' '[:lower:]')" ]]; then
                            tool_found=true
                            break
                        fi
                    done <<< "$all_tools_list"
                    
                    if [[ "$tool_found" == false ]] && [[ ${#referenced_tool} -gt 1 ]] && [[ "$referenced_tool" != "string" ]] && [[ "$referenced_tool" != "pid" ]]; then
                        CROSS_REF_ISSUES+=("$file_name references tool '$referenced_tool' not found in TOOLS.md")
                        ((CROSS_REF_ISSUE_COUNT++))
                        issues_found=true
                    fi
                fi
            done < <(grep -oE '`[a-zA-Z][a-zA-Z0-9_.-]+`' "$file_path" | sed 's/`//g' | sort -u)
            
            # Check for broken internal links to TOOLS.md
            while IFS= read -r link_match; do
                # Extract link target from [text](target) format
                local link_target=$(echo "$link_match" | sed -E 's/.*\]\(([^)]+)\).*/\1/')
                if [[ -n "$link_target" ]] && [[ "$link_target" != "$link_match" ]]; then
                    
                    # Check links to TOOLS.md specifically
                    if [[ "$link_target" =~ TOOLS\.md(#(.+))? ]]; then
                        local anchor="${BASH_REMATCH[2]}"
                        
                        if [[ -n "$anchor" ]]; then
                            # Check if the anchor exists in TOOLS.md
                            local anchor_exists=false
                            
                            while IFS= read -r line; do
                                if [[ $line =~ ^#{1,6}[[:space:]]+(.+) ]]; then
                                    local heading="${BASH_REMATCH[1]}"
                                    heading=$(echo "$heading" | sed 's/\*\*//g')
                                    local generated_anchor=$(slugify "$heading")
                                    
                                    if [[ "$generated_anchor" == "$anchor" ]]; then
                                        anchor_exists=true
                                        break
                                    fi
                                fi
                            done < "$TOOLS_FILE"
                            
                            if [[ "$anchor_exists" == false ]]; then
                                CROSS_REF_ISSUES+=("$file_name contains broken anchor link to TOOLS.md#$anchor")
                                ((CROSS_REF_ISSUE_COUNT++))
                                issues_found=true
                            fi
                        fi
                    fi
                fi
            done < <(grep -oE '\[([^\]]+)\]\(([^)]*(\([^)]*\)[^)]*)*)\)' "$file_path")
        fi
    done
    
    # Check bidirectional references
    check_bidirectional_references
    local bidirect_result=$?
    if [[ $bidirect_result -ne 0 ]]; then
        issues_found=true
    fi
    
    # Report results
    if [[ ${#CROSS_REF_ISSUES[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Warning: Found $CROSS_REF_ISSUE_COUNT cross-reference issues:${NC}"
        for issue in "${CROSS_REF_ISSUES[@]}"; do
            echo "  - $issue"
        done
    else
        echo -e "${GREEN}All cross-references are valid!${NC}"
    fi
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Check bidirectional references between files
check_bidirectional_references() {
    echo -e "${BLUE}Checking bidirectional references...${NC}"
    
    local issues_found=false
    
    # Check README.md -> docs/ file references
    if [[ -f "$README_FILE" ]]; then
        local readme_refs=(
            "docs/CHEATSHEET.md"
            "docs/CLAUDE_GUIDE.md" 
            "docs/SYSTEM_ADMINISTRATION_TOOLS.md"
            "docs/TOOL_INDEX.md"
        )
        
        for ref in "${readme_refs[@]}"; do
            if ! grep -q "$ref" "$README_FILE"; then
                CROSS_REF_ISSUES+=("README.md missing reference to $ref")
                ((CROSS_REF_ISSUE_COUNT++))
                issues_found=true
            fi
        done
    fi
    
    # Check that docs files reference back to main files appropriately
    local doc_files=(
        "$CHEATSHEET_FILE:TOOLS.md"
        "$CLAUDE_GUIDE_FILE:README.md"
        "$SYSADMIN_TOOLS_FILE:TOOLS.md"
    )
    
    for file_spec in "${doc_files[@]}"; do
        local file_path="${file_spec%:*}"
        local expected_ref="${file_spec#*:}"
        local file_name=$(basename "$file_path")
        
        if [[ -f "$file_path" ]] && ! grep -q "$expected_ref" "$file_path"; then
            CROSS_REF_ISSUES+=("$file_name missing reference to $expected_ref")
            ((CROSS_REF_ISSUE_COUNT++))
            issues_found=true
        fi
    done
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Check documentation duplication
check_documentation_duplication() {
    echo -e "${BLUE}Checking for documentation duplication...${NC}"
    
    local issues_found=false
    local duplication_issues=()
    local duplication_count=0
    
    # Extract tool entries from specialized files and check against TOOLS.md
    local specialized_files=(
        "$SYSADMIN_TOOLS_FILE:SYSTEM_ADMINISTRATION_TOOLS.md"
    )
    
    for file_spec in "${specialized_files[@]}"; do
        local file_path="${file_spec%:*}"
        local file_name="${file_spec#*:}"
        
        if [[ -f "$file_path" ]]; then
            # Extract tool entries (lines with ### **tool**)
            while IFS= read -r tool_line; do
                if [[ $tool_line =~ \*\*([^*]+)\*\* ]]; then
                    local tool_name="${BASH_REMATCH[1]}"
                    
                    # Check if this exact tool is documented in TOOLS.md
                    if grep -q "^### \*\*$tool_name\*\*" "$TOOLS_FILE"; then
                        duplication_issues+=("Tool '$tool_name' documented in both TOOLS.md and $file_name")
                        ((duplication_count++))
                        issues_found=true
                    fi
                fi
            done < <(grep -E "^###[[:space:]]*\*\*" "$file_path")
        fi
    done
    
    # Check for duplicate sections within TOOLS.md
    local duplicate_tools=$(grep "^### \*\*" "$TOOLS_FILE" | sort | uniq -d)
    if [[ -n "$duplicate_tools" ]]; then
        while IFS= read -r dup_tool; do
            if [[ -n "$dup_tool" ]]; then
                duplication_issues+=("Duplicate tool entry in TOOLS.md: $dup_tool")
                ((duplication_count++))
                issues_found=true
            fi
        done <<< "$duplicate_tools"
    fi
    
    # Add to main tracking arrays
    CONSISTENCY_ISSUES+=("${duplication_issues[@]}")
    CONSISTENCY_ISSUE_COUNT=$((CONSISTENCY_ISSUE_COUNT + duplication_count))
    
    if [[ $duplication_count -gt 0 ]]; then
        echo -e "${YELLOW}Warning: Found $duplication_count documentation duplication issues${NC}"
    else
        echo -e "${GREEN}No documentation duplication found!${NC}"
    fi
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Check repository structure consistency  
check_repository_structure() {
    echo -e "${BLUE}Checking repository structure consistency...${NC}"
    
    local issues_found=false
    STRUCTURAL_ISSUES=()
    STRUCTURAL_ISSUE_COUNT=0
    
    # Define expected structure based on README.md
    local expected_structure=(
        ".:TOOLS.md README.md TODO.md LICENSE"
        "docs:CHEATSHEET.md CLAUDE_GUIDE.md SYSTEM_ADMINISTRATION_TOOLS.md TOOL_INDEX.md MAINTENANCE.md FUTURE_TOOLS.md"
        "scripts:update_stats.sh verify_tools.sh check_plan_completion.sh run_validation_suite.sh"
    )
    
    for structure_spec in "${expected_structure[@]}"; do
        local dir_name="${structure_spec%:*}"
        local expected_files="${structure_spec#*:}"
        
        local base_path="$REPO_ROOT"
        if [[ "$dir_name" != "." ]]; then
            base_path="$REPO_ROOT/$dir_name"
        fi
        
        # Check directory exists
        if [[ ! -d "$base_path" ]]; then
            STRUCTURAL_ISSUES+=("Missing directory: $dir_name")
            ((STRUCTURAL_ISSUE_COUNT++))
            issues_found=true
            continue
        fi
        
        # Check expected files
        for expected_file in $expected_files; do
            local file_path="$base_path/$expected_file"
            
            if [[ ! -f "$file_path" ]]; then
                STRUCTURAL_ISSUES+=("Missing file: $dir_name/$expected_file")
                ((STRUCTURAL_ISSUE_COUNT++))
                issues_found=true
            fi
        done
    done
    
    # Check that documented structure matches README.md claims
    if [[ -f "$README_FILE" ]]; then
        # Extract file references from README.md
        while IFS= read -r file_ref; do
            if [[ -n "$file_ref" ]] && [[ "$file_ref" != *"http"* ]]; then
                # Convert relative paths to absolute paths
                local abs_path="$REPO_ROOT/$file_ref"
                if [[ "$file_ref" =~ ^\./(.+) ]]; then
                    abs_path="$REPO_ROOT/${BASH_REMATCH[1]}"
                fi
                
                if [[ ! -f "$abs_path" ]] && [[ ! -d "$abs_path" ]]; then
                    STRUCTURAL_ISSUES+=("README.md references non-existent path: $file_ref")
                    ((STRUCTURAL_ISSUE_COUNT++))
                    issues_found=true
                fi
            fi
        done < <(grep -oE '\[([^\]]+)\]\(([^)#]+)' "$README_FILE" | sed -E 's/\[([^\]]+)\]\(([^)#]+).*/\2/' | grep -v '^http' | sort -u)
    fi
    
    # Report results
    if [[ ${#STRUCTURAL_ISSUES[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Warning: Found $STRUCTURAL_ISSUE_COUNT repository structure issues:${NC}"
        for issue in "${STRUCTURAL_ISSUES[@]}"; do
            echo "  - $issue"
        done
    else
        echo -e "${GREEN}Repository structure is consistent!${NC}"
    fi
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Generate comprehensive consistency report
generate_comprehensive_report() {
    echo ""
    echo "========================================="
    echo "   Comprehensive Consistency Report"
    echo "========================================="
    echo ""
    
    local total_issues=$((CONSISTENCY_ISSUE_COUNT + CROSS_REF_ISSUE_COUNT + STRUCTURAL_ISSUE_COUNT + FORMAT_ISSUE_COUNT + BROKEN_LINK_COUNT))
    
    echo -e "${BLUE}Validation Summary:${NC}"
    echo "  Consistency Issues: $CONSISTENCY_ISSUE_COUNT"
    echo "  Cross-Reference Issues: $CROSS_REF_ISSUE_COUNT" 
    echo "  Structural Issues: $STRUCTURAL_ISSUE_COUNT"
    echo "  Format Issues: $FORMAT_ISSUE_COUNT"
    echo "  Broken Links: $BROKEN_LINK_COUNT"
    echo "  Total Issues Found: $total_issues"
    echo ""
    
    if [[ $total_issues -gt 0 ]]; then
        echo -e "${YELLOW}Issues by Category:${NC}"
        echo ""
        
        if [[ $CONSISTENCY_ISSUE_COUNT -gt 0 ]]; then
            echo -e "${YELLOW}Statistics Consistency Issues ($CONSISTENCY_ISSUE_COUNT):${NC}"
            for issue in "${CONSISTENCY_ISSUES[@]}"; do
                echo "  • $issue"
            done
            echo ""
        fi
        
        if [[ $CROSS_REF_ISSUE_COUNT -gt 0 ]]; then
            echo -e "${YELLOW}Cross-Reference Issues ($CROSS_REF_ISSUE_COUNT):${NC}"
            for issue in "${CROSS_REF_ISSUES[@]}"; do
                echo "  • $issue"
            done
            echo ""
        fi
        
        if [[ $STRUCTURAL_ISSUE_COUNT -gt 0 ]]; then
            echo -e "${YELLOW}Repository Structure Issues ($STRUCTURAL_ISSUE_COUNT):${NC}"
            for issue in "${STRUCTURAL_ISSUES[@]}"; do
                echo "  • $issue"
            done
            echo ""
        fi
        
        echo -e "${BLUE}Recommended Actions:${NC}"
        echo "1. Run: $0 --fix to automatically fix statistics inconsistencies"
        echo "2. Run: $0 --update-all to update all documentation files (fallback)"
        echo "3. Fix missing files and broken references manually"
        echo "4. Run: $0 --generate-index to update tool index"
        echo "5. Re-run comprehensive validation to verify fixes"
        echo ""
        
        return 1
    else
        echo -e "${GREEN}✓ All comprehensive consistency checks passed!${NC}"
        echo -e "${GREEN}✓ Documentation is fully consistent across all files${NC}"
        echo ""
        return 0
    fi
}

# Check for consistency issues
check_consistency() {
    print_if_not_json "${BLUE}Checking for consistency issues...${NC}"
    
    local issues_found=false
    local consistency_issues_count=0
    
    # Check README.md for tool count
    local readme_count=$(grep -E "[0-9]+\+? .*(CLI )?tools" "$README_FILE" | head -1 | sed 's/[^0-9]//g' | head -c3 || echo "0")
    
    if [[ $readme_count -ne $TOTAL_TOOLS ]]; then
        echo -e "${YELLOW}Warning: README.md shows $readme_count tools but TOOLS.md has $TOTAL_TOOLS${NC}"
        ((consistency_issues_count++))
        issues_found=true
    fi
    
    # Check for tools without difficulty ratings using awk
    local tools_without_rating=$(awk '
        /^### \*\*/ {
            # Extract tool name
            tool = $0
            gsub(/^### \*\*/, "", tool)
            gsub(/\*\*.*/, "", tool)
            
            # Look ahead up to 10 lines for a star rating
            found_rating = 0
            for (i = 1; i <= 10 && (getline next_line) > 0; i++) {
                if (next_line ~ /⭐/) {
                    found_rating = 1
                    break
                }
                # Stop if we hit another tool or category
                if (next_line ~ /^###? /) {
                    break
                }
            }
            
            if (!found_rating) {
                print tool
            }
        }
    ' "$TOOLS_FILE")
    
    if [[ -n $tools_without_rating ]]; then
        print_if_not_json "${YELLOW}Warning: Tools without difficulty ratings:${NC}"
        print_if_not_json "$tools_without_rating"
        local rating_count=$(echo "$tools_without_rating" | wc -l | xargs)
        ((consistency_issues_count += rating_count))
        issues_found=true
    fi
    
    # Check for duplicate tools
    local duplicates=$(grep "^### \*\*" "$TOOLS_FILE" | sort | uniq -d)
    
    if [[ -n $duplicates ]]; then
        print_if_not_json "${YELLOW}Warning: Duplicate tool entries found:${NC}"
        print_if_not_json "$duplicates"
        local duplicate_count=$(echo "$duplicates" | wc -l | xargs)
        ((consistency_issues_count += duplicate_count))
        issues_found=true
    fi
    
    # Update global counter
    CONSISTENCY_ISSUE_COUNT=$((CONSISTENCY_ISSUE_COUNT + consistency_issues_count))
    
    if [[ $issues_found == false ]]; then
        echo -e "${GREEN}No basic consistency issues found!${NC}"
    fi
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Validate internal links in markdown files with enhanced edge case handling
validate_links() {
    echo -e "${BLUE}Validating internal links...${NC}"
    
    local issues_found=false
    BROKEN_LINKS=()
    LINK_COUNT=0
    BROKEN_LINK_COUNT=0
    local processed_files=0
    
    # Build comprehensive anchor index from target files (optimized for performance)
    build_anchor_index() {
        local file="$1"
        local anchor_index=""
        local in_code_fence=false
        
        # Use awk for better performance on large files
        awk '
            /^[[:space:]]*```/ { 
                in_code_fence = !in_code_fence
                next
            }
            !in_code_fence && /^#{1,6}[[:space:]]+/ {
                heading = $0
                gsub(/^#{1,6}[[:space:]]+/, "", heading)
                gsub(/\*\*/, "", heading)  # Remove **bold** formatting
                gsub(/`/, "", heading)     # Remove `code` formatting
                # Simple slugify - convert to lowercase and replace spaces/special chars with hyphens
                heading = tolower(heading)
                gsub(/[^a-z0-9[:space:]-]/, "", heading)
                gsub(/[[:space:]]+/, "-", heading)
                gsub(/-+/, "-", heading)
                gsub(/^-|-$/, "", heading)
                print heading
            }
        ' "$file"
    }
    
    # Extract links from file while respecting code blocks (optimized)
    extract_links_from_file() {
        local file="$1"
        
        # Use sed/grep approach that's compatible with macOS
        local in_code_fence=false
        while IFS= read -r line; do
            # Track code fence state
            if [[ $line =~ ^[[:space:]]*\`\`\`.*$ ]]; then
                in_code_fence=$([[ $in_code_fence == true ]] && echo false || echo true)
                continue
            fi
            
            # Skip link extraction if inside code fence
            if [[ $in_code_fence == true ]]; then
                continue
            fi
            
            # Extract markdown links using sed (works reliably on macOS)
            if [[ "$line" == *"["* && "$line" == *"]("* && "$line" == *")"* ]]; then
                echo "$line" | sed -n 's/.*\[\([^]]*\)\](\([^)]*\)).*/\2/p'
            fi
        done < "$file"
    }
    
    echo -e "${BLUE}Processing markdown files for link validation...${NC}"
    
    # Find all markdown files, excluding .git, node_modules, and archive directories
    while IFS= read -r -d '' file; do
        # Skip archived files to reduce noise
        if [[ $file =~ /archive/ ]] || [[ $file =~ /\.archive/ ]] || [[ $file =~ archived ]]; then
            continue
        fi
        
        ((processed_files++))
        local relative_file="${file#$REPO_ROOT/}"
        echo -e "${BLUE}Processing: $relative_file${NC}" >&2
        
        # Extract links from file while respecting code blocks
        while IFS= read -r link; do
            # Skip empty lines
            [[ -z "$link" ]] && continue
            
            # Skip external links (http://, https://, mailto:, ftp://)
            if [[ $link =~ ^(https?://|mailto:|ftp://) ]]; then
                continue
            fi
            
            # Skip anchor-only links (#anchor)
            if [[ $link =~ ^# ]]; then
                continue
            fi
            
            # Skip common non-file links
            if [[ $link =~ ^(javascript:|tel:|data:) ]]; then
                continue
            fi
            
            ((LINK_COUNT++))
            
            # Extract anchor if present
            local anchor=""
            local clean_link="$link"
            if [[ $link =~ ^([^#]*)#(.+)$ ]]; then
                clean_link="${BASH_REMATCH[1]}"
                anchor="${BASH_REMATCH[2]}"
            fi
            
            # Resolve relative path
            local file_dir=$(dirname "$file")
            local target_path
            
            if [[ $clean_link =~ ^/ ]]; then
                # Absolute path from repo root
                target_path="$REPO_ROOT$clean_link"
            else
                # Relative path from current file
                target_path="$file_dir/$clean_link"
            fi
            
            # Normalize path (handle . and .. components)
            if [[ -d "$(dirname "$target_path")" ]]; then
                target_path="$(cd "$(dirname "$target_path")" 2>/dev/null && pwd)/$(basename "$target_path")" 2>/dev/null || target_path
            fi
            
            # Check if target exists
            if [[ ! -f "$target_path" ]] && [[ ! -d "$target_path" ]]; then
                # Compute relative path for reporting
                BROKEN_LINKS+=("$relative_file: $link (file not found)")
                ((BROKEN_LINK_COUNT++))
                issues_found=true
            elif [[ -n $anchor ]] && [[ -f "$target_path" ]]; then
                # Build anchor index for target file (only if not already cached)
                local cache_key="anchors_$(echo "$target_path" | sed 's/[^a-zA-Z0-9]/_/g')"
                if [[ -z ${!cache_key} ]]; then
                    declare -g "$cache_key"="$(build_anchor_index "$target_path")"
                fi
                local target_anchors="${!cache_key}"
                
                # Check if anchor exists in target file
                if ! echo -e "$target_anchors" | grep -qx "$anchor"; then
                    BROKEN_LINKS+=("$relative_file: $link (anchor #$anchor not found)")
                    ((BROKEN_LINK_COUNT++))
                    issues_found=true
                fi
            fi
        done < <(extract_links_from_file "$file")
    done < <(find "$REPO_ROOT" -name "*.md" -type f -not -path "*/.git/*" -not -path "*/node_modules/*" -not -path "*/archive/*" -not -path "*/.*archive*" -print0)
    
    echo -e "${BLUE}Processed $processed_files markdown files.${NC}"
    
    # Report results
    if [[ ${#BROKEN_LINKS[@]} -gt 0 ]]; then
        echo -e "${YELLOW}WARNING: Found $BROKEN_LINK_COUNT broken internal links${NC}"
        for broken_link in "${BROKEN_LINKS[@]}"; do
            echo "  - $broken_link"
        done
        echo ""
        echo -e "${BLUE}Note: Code blocks and archived files are automatically excluded from validation${NC}"
    else
        echo -e "${GREEN}All $LINK_COUNT internal links are valid!${NC}"
        echo -e "${GREEN}(Code blocks and archived files excluded from validation)${NC}"
    fi
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Update README.md with current statistics
update_readme() {
    if [[ $REPORT_ONLY == true ]]; then
        return
    fi
    
    echo -e "${BLUE}Updating README.md statistics...${NC}"
    
    # Update tool count using markers
    sed -i.bak -E "s/<!-- tools-count -->[0-9]+\+?<!-- \/tools-count -->/<!-- tools-count -->${TOTAL_TOOLS}+<!-- \/tools-count -->/g" "$README_FILE"
    sed -i.bak -E "s/<!-- tools-count-table -->[0-9]+\+?<!-- \/tools-count-table -->/<!-- tools-count-table -->${TOTAL_TOOLS}+<!-- \/tools-count-table -->/g" "$README_FILE"
    sed -i.bak -E "s/<!-- tools-documented -->[0-9]+\+?<!-- \/tools-documented -->/<!-- tools-documented -->${TOTAL_TOOLS}+<!-- \/tools-documented -->/g" "$README_FILE"
    
    # Update line count using markers (format as comma-separated for thousands)
    local formatted_lines=$(printf "%'d" $TOTAL_LINES 2>/dev/null || echo $TOTAL_LINES)
    sed -i.bak -E "s/<!-- lines-count -->[0-9,]+<!-- \/lines-count -->/<!-- lines-count -->${formatted_lines}<!-- \/lines-count -->/g" "$README_FILE"
    sed -i.bak -E "s/<!-- lines-count-table -->[0-9,]+<!-- \/lines-count-table -->/<!-- lines-count-table -->${formatted_lines}<!-- \/lines-count-table -->/g" "$README_FILE"
    
    # Update category count using markers
    sed -i.bak -E "s/<!-- categories-count -->[0-9]+\+?<!-- \/categories-count -->/<!-- categories-count -->${TOTAL_CATEGORIES}+<!-- \/categories-count -->/g" "$README_FILE"
    sed -i.bak -E "s/<!-- categories-sections -->[0-9]+\+?<!-- \/categories-sections -->/<!-- categories-sections -->${TOTAL_CATEGORIES}+<!-- \/categories-sections -->/g" "$README_FILE"
    
    # Update badge URLs - Lines badge
    sed -i.bak -E "s/Lines-[0-9,]+/Lines-${TOTAL_LINES}/g" "$README_FILE"
    
    # Update badge URLs - Tools badge
    sed -i.bak -E "s/Tools-[0-9]+%2B/Tools-${TOTAL_TOOLS}%2B/g" "$README_FILE"
    
    # Update badge URLs - Categories badge  
    sed -i.bak -E "s/Categories-[0-9]+%2B/Categories-${TOTAL_CATEGORIES}%2B/g" "$README_FILE"
    
    # Update any line count references in the README text that aren't in HTML comments
    # This handles patterns like "17,680 lines" but avoids HTML comment content
    sed -i.bak -E "s/([^-])[0-9,]+ lines/\1${formatted_lines} lines/g" "$README_FILE"
    
    # Remove backup file
    rm -f "${README_FILE}.bak"
    
    echo -e "${GREEN}README.md updated successfully${NC}"
}

# Update all documentation files with current statistics
update_all_files() {
    if [[ $REPORT_ONLY == true ]]; then
        return
    fi
    
    echo -e "${BLUE}Updating all documentation files with current statistics...${NC}"
    
    # Update README.md
    update_readme
    
    # Update CHEATSHEET.md markers
    if [[ -f "$CHEATSHEET_FILE" ]]; then
        echo -e "${BLUE}Updating CHEATSHEET.md statistics...${NC}"
        
        # Update tool count using markers
        sed -i.bak -E "s/<!-- cheat-tools-count -->[0-9]+<!-- \/cheat-tools-count -->/<!-- cheat-tools-count -->${TOTAL_TOOLS}<!-- \/cheat-tools-count -->/g" "$CHEATSHEET_FILE"
        
        # Update category count using markers
        sed -i.bak -E "s/<!-- cheat-categories-count -->[0-9]+<!-- \/cheat-categories-count -->/<!-- cheat-categories-count -->${TOTAL_CATEGORIES}<!-- \/cheat-categories-count -->/g" "$CHEATSHEET_FILE"
        
        # Remove backup file
        rm -f "${CHEATSHEET_FILE}.bak"
        
        echo -e "${GREEN}CHEATSHEET.md updated successfully${NC}"
    fi
    
    # Update CLAUDE_GUIDE.md if it has statistics references
    if [[ -f "$CLAUDE_GUIDE_FILE" ]]; then
        echo -e "${BLUE}Updating CLAUDE_GUIDE.md statistics...${NC}"
        
        # Update tool count references
        sed -i.bak -E "s/([0-9]+)\+ tools/${TOTAL_TOOLS}+ tools/g" "$CLAUDE_GUIDE_FILE"
        
        # Update line count references (handle comma-separated numbers)
        local formatted_lines=$(printf "%'d" $TOTAL_LINES 2>/dev/null || echo $TOTAL_LINES)
        sed -i.bak -E "s/([0-9,]+) lines/${formatted_lines} lines/g" "$CLAUDE_GUIDE_FILE"
        
        # Remove backup file
        rm -f "${CLAUDE_GUIDE_FILE}.bak"
        
        echo -e "${GREEN}CLAUDE_GUIDE.md updated successfully${NC}"
    fi
    
    # Update SYSTEM_ADMINISTRATION_TOOLS.md if it has references to main counts
    if [[ -f "$SYSADMIN_TOOLS_FILE" ]]; then
        echo -e "${BLUE}Updating SYSTEM_ADMINISTRATION_TOOLS.md references...${NC}"
        
        # Update references to main tool counts
        sed -i.bak -E "s/([0-9]+)\+ (commands|tools) across ([0-9]+)\+ categories/${TOTAL_TOOLS}+ \\2 across ${TOTAL_CATEGORIES}+ categories/g" "$SYSADMIN_TOOLS_FILE"
        
        # Remove backup file  
        rm -f "${SYSADMIN_TOOLS_FILE}.bak"
        
        echo -e "${GREEN}SYSTEM_ADMINISTRATION_TOOLS.md updated successfully${NC}"
    fi
    
    echo -e "${GREEN}All documentation files updated successfully${NC}"
}

# Generate report
generate_report() {
    echo ""
    echo "========================================="
    echo "   Repository Statistics Report"
    echo "========================================="
    echo ""
    echo -e "${BLUE}Summary:${NC}"
    echo "  Total Tools: $TOTAL_TOOLS"
    echo "  Total Categories: $TOTAL_CATEGORIES"
    echo "  Total Lines: $TOTAL_LINES"
    
    # Avoid division by zero
    if [[ $TOTAL_TOOLS -gt 0 ]]; then
        echo "  Average Lines per Tool: $((TOTAL_LINES / TOTAL_TOOLS))"
    else
        echo "  Average Lines per Tool: N/A"
    fi
    echo ""
    
    if [[ $FULL_REPORT == true ]]; then
        echo -e "${BLUE}Tools by Category:${NC}"
        echo -e "$TOOLS_BY_CATEGORY"
        
        echo -e "${BLUE}Difficulty Distribution:${NC}"
        echo "$DIFFICULTY_DISTRIBUTION"
        echo ""
        
        if [[ $CHECK_LINKS == true ]] || [[ $CHECK_CONSISTENCY == true ]]; then
            echo -e "${BLUE}Link Validation Summary:${NC}"
            echo "  Total internal links: $LINK_COUNT"
            echo "  Broken links: $BROKEN_LINK_COUNT"
            echo ""
        fi
        
        if [[ $CHECK_FORMAT == true ]] || [[ $CHECK_CONSISTENCY == true ]]; then
            echo -e "${BLUE}Format Consistency Summary:${NC}"
            echo "  Format issues found: $FORMAT_ISSUE_COUNT"
            echo ""
        fi
    fi
    
    echo -e "${BLUE}Repository Files:${NC}"
    echo "  TOOLS.md: $([ -f "$TOOLS_FILE" ] && echo "✓ Present" || echo "✗ Missing")"
    echo "  README.md: $([ -f "$README_FILE" ] && echo "✓ Present" || echo "✗ Missing")"
    echo "  TODO.md: $([ -f "$TODO_FILE" ] && echo "✓ Present" || echo "✗ Missing")"
    echo ""
    
    # Check key directories
    echo -e "${BLUE}Directory Structure:${NC}"
    echo "  docs/: $([ -d "$REPO_ROOT/docs" ] && echo "✓ Present" || echo "✗ Missing")"
    echo "  scripts/: $([ -d "$REPO_ROOT/scripts" ] && echo "✓ Present" || echo "✗ Missing")"
    echo ""
}

# Generate detailed CSV report
generate_csv_report() {
    local csv_file="$REPO_ROOT/tool_statistics.csv"
    
    echo "Category,Tool Count" > "$csv_file"
    echo "$TOOLS_BY_CATEGORY" | while IFS=: read -r category count; do
        if [[ -n $category ]]; then
            count=$(echo "$count" | grep -oE "[0-9]+")
            echo "\"$category\",$count" >> "$csv_file"
        fi
    done
    
    echo -e "${GREEN}CSV report saved to $csv_file${NC}"
}

# Generate comprehensive tool index (Comments 1,4,7,8,12,13: optimized single-pass)
# Validate TOOL_INDEX.md header markers and counts
validate_index_headers() {
    local index_file="$1"
    
    if [[ ! -f "$index_file" ]]; then
        echo -e "${RED}Error: Index file not found: $index_file${NC}"
        return 1
    fi
    
    # Extract actual counts from the index
    local index_tool_count=$(grep -c "^- \*\*\[" "$index_file" || echo "0")
    local index_category_count=$(grep -c "^### " "$index_file" || echo "0")
    
    # Check if counts match
    if [[ $index_tool_count -ne $TOTAL_TOOLS ]]; then
        echo -e "${YELLOW}Warning: Index tool count ($index_tool_count) doesn't match TOOLS.md count ($TOTAL_TOOLS)${NC}"
        echo -e "${BLUE}Updating index header with correct counts...${NC}"
        
        # Update the Quick Stats section
        sed -i.bak "s/Total Tools: [0-9]*/Total Tools: $TOTAL_TOOLS/" "$index_file"
        sed -i.bak "s/Total Categories: [0-9]*/Total Categories: $TOTAL_CATEGORIES/" "$index_file"
        rm "${index_file}.bak"
        
        return 1
    fi
    
    echo -e "${GREEN}Index validation passed: $index_tool_count tools, $index_category_count categories${NC}"
    return 0
}

generate_tool_index() {
    echo -e "${BLUE}Generating comprehensive tool index...${NC}"
    
    local index_file="$REPO_ROOT/docs/TOOL_INDEX.md"
    
    # Create docs directory if it doesn't exist
    mkdir -p "$REPO_ROOT/docs"
    
    # Create temporary files for storing tool data
    local tmp_dir=$(mktemp -d)
    local tool_data_file="$tmp_dir/tool_data.txt"
    
    # Use > to overwrite, not append (Comment 1)
    > "$tool_data_file"
    
    # Single-pass extraction with metadata validation (Comments 4,7,12)
    local current_category=""
    local current_tool=""
    local in_metadata=false
    local metadata_block=""
    local capturing_description=false
    local description=""
    local has_valid_metadata=false
    local difficulty=""
    local keywords=""
    local synonyms=""
    
    while IFS= read -r line; do
        # Check for category header
        if [[ $line =~ ^##[[:space:]]+(.+) ]]; then
            current_category="${BASH_REMATCH[1]}"
            # Clear tool state when entering new category
            current_tool=""
            has_valid_metadata=false
        # Check for tool entry
        elif [[ $line =~ ^###[[:space:]]\*\*([^*]+)\*\* ]]; then
            current_tool="${BASH_REMATCH[1]}"
            in_metadata=false
            metadata_block=""
            capturing_description=false
            description=""
            has_valid_metadata=false
            difficulty=""
            keywords=""
            synonyms=""
        # Check for metadata block
        elif [[ $line == "<!-- meta" ]] && [[ -n $current_tool ]]; then
            in_metadata=true
            metadata_block=""
        elif [[ $in_metadata == true ]]; then
            metadata_block="$metadata_block$line
"
            if [[ $line == "-->" ]]; then
                in_metadata=false
                # Parse metadata using the improved parse_metadata function
                difficulty=$(parse_metadata "$metadata_block" "difficulty")
                keywords=$(parse_metadata "$metadata_block" "keywords")
                synonyms=$(parse_metadata "$metadata_block" "synonyms")
                local category=$(parse_metadata "$metadata_block" "category")
                
                # Only mark as valid if required fields are present (Comment 4,7)
                if [[ -n $category ]] && [[ -n $difficulty ]]; then
                    has_valid_metadata=true
                fi
            fi
        # Capture description
        elif [[ $line =~ \*\*Description\*\* ]] && [[ $has_valid_metadata == true ]]; then
            capturing_description=true
            description=""
        elif [[ $capturing_description == true ]]; then
            if [[ $line =~ ^(\*\*|###|##) ]] || [[ -z $line ]]; then
                # End of description - save tool data only if valid
                capturing_description=false
                description=$(echo "$description" | xargs | head -c 100)
                
                # Only add tool if it has valid metadata (Comment 4,7)
                if [[ $has_valid_metadata == true ]]; then
                    # Handle PENDING_DESC edge case (Comment 13)
                    if [[ -z $description ]]; then
                        description=""
                    fi
                    echo "TOOL|$current_tool|$current_category|$difficulty|$keywords|$synonyms|$description" >> "$tool_data_file"
                fi
            else
                description="$description $line"
            fi
        fi
    done < "$TOOLS_FILE"
    
    # Deduplicate tool data (Comment 1)
    sort -t'|' -k2,2 -f -u "$tool_data_file" -o "$tool_data_file"
    
    # Generate index file
    cat > "$index_file" << 'EOF'
# CLI Tool Index

A comprehensive index of all CLI tools documented in this repository. Use this index to quickly find tools by name, category, or difficulty level.

**Quick Stats:**
EOF
    
    # Use global variables for consistency with the main script
    echo "- Total Tools: $TOTAL_TOOLS" >> "$index_file"
    echo "- Categories: $TOTAL_CATEGORIES" >> "$index_file"
    echo "- Last Updated: $(date '+%Y-%m-%d %H:%M:%S')" >> "$index_file"
    
    # Validation check: ensure header counts match computed totals
    local computed_tools=$(grep -c "^TOOL|" "$tool_data_file" || echo "0")
    local computed_categories=$(cut -d'|' -f3 "$tool_data_file" | sort -u | wc -l | xargs)
    
    if [[ "$TOTAL_TOOLS" != "$computed_tools" ]]; then
        echo -e "${YELLOW}Warning: Header tool count ($TOTAL_TOOLS) doesn't match computed count ($computed_tools)${NC}"
    fi
    
    if [[ "$TOTAL_CATEGORIES" != "$computed_categories" ]]; then
        echo -e "${YELLOW}Warning: Header category count ($TOTAL_CATEGORIES) doesn't match computed count ($computed_categories)${NC}"
    fi
    echo "" >> "$index_file"
    echo "## Navigation" >> "$index_file"
    echo "" >> "$index_file"
    echo "- [Alphabetical Index](#alphabetical-index) - All tools A-Z" >> "$index_file"
    echo "- [Category Index](#category-index) - Tools grouped by category" >> "$index_file"
    echo "- [Difficulty Index](#difficulty-index) - Tools sorted by difficulty within categories" >> "$index_file"
    echo "" >> "$index_file"
    echo "## Search Tips" >> "$index_file"
    echo "" >> "$index_file"
    echo "- Use browser search (Ctrl+F / Cmd+F) to find specific tools" >> "$index_file"
    echo "- Each tool entry includes keywords and synonyms for better searchability" >> "$index_file"
    echo "- Click on any tool name to jump directly to its documentation in TOOLS.md" >> "$index_file"
    echo "" >> "$index_file"
    echo "---" >> "$index_file"
    echo "" >> "$index_file"
    
    # Alphabetical Index
    echo "## Alphabetical Index" >> "$index_file"
    echo "" >> "$index_file"
    echo "All tools listed alphabetically with brief descriptions." >> "$index_file"
    echo "" >> "$index_file"
    
    # Sort tools alphabetically
    local current_letter=""
    while IFS='|' read -r type name category difficulty keywords synonyms desc; do
        if [[ $type == "TOOL" ]]; then
            first_letter=$(echo "$name" | cut -c1 | tr '[:lower:]' '[:upper:]')
            if [[ "$first_letter" != "$current_letter" ]]; then
                current_letter="$first_letter"
                echo "" >> "$index_file"
                echo "### $current_letter" >> "$index_file"
                echo "" >> "$index_file"
            fi
            
            # Use default values if fields are empty
            difficulty=${difficulty:-⭐⭐⭐}
            desc=${desc:-No description available}
            
            # Find the actual header in TOOLS.md to generate correct anchor
            # Headers are in format: ### **toolname** - Description
            local full_header=$(grep -m1 "^### \*\*${name}\*\*" "$TOOLS_FILE" || echo "")
            local anchor
            
            if [[ -n "$full_header" ]]; then
                # Remove the ### prefix and extract everything for the anchor
                full_header=$(echo "$full_header" | sed 's/^### //')
                # Remove ** markers but keep the full text for anchor generation
                full_header=$(echo "$full_header" | sed 's/\*\*//g')
                anchor=$(slugify "$full_header")
            else
                # Fallback to just the name if header not found
                anchor=$(slugify "$name")
            fi
            
            echo "- **[$name](../TOOLS.md#$anchor)** $difficulty - $desc" >> "$index_file"
            
            # Add keywords and synonyms if available
            if [[ -n $keywords ]]; then
                echo "  - Keywords: $keywords" >> "$index_file"
            fi
            if [[ -n $synonyms ]]; then
                echo "  - Also known as: $synonyms" >> "$index_file"
            fi
        fi
    done < <(sort -t'|' -k2 -f "$tool_data_file")
    
    echo "" >> "$index_file"
    echo "---" >> "$index_file"
    echo "" >> "$index_file"
    
    # Category Index
    echo "## Category Index" >> "$index_file"
    echo "" >> "$index_file"
    echo "Tools organized by their primary category." >> "$index_file"
    echo "" >> "$index_file"
    
    # Get unique categories and process each
    local categories=$(cut -d'|' -f3 "$tool_data_file" | sort -u)
    
    while IFS= read -r category; do
        if [[ -n $category ]]; then
            echo "### $category" >> "$index_file"
            
            # Count tools in category
            local tool_count=$(grep -c "^TOOL|[^|]*|$category|" "$tool_data_file" || echo "0")
            echo "" >> "$index_file"
            echo "**$tool_count tools**" >> "$index_file"
            echo "" >> "$index_file"
            
            # List tools in this category
            while IFS='|' read -r type name cat difficulty keywords synonyms desc; do
                if [[ $type == "TOOL" ]] && [[ $cat == "$category" ]]; then
                    difficulty=${difficulty:-⭐⭐⭐}
                    desc=${desc:-No description available}
                    
                    # Find the actual header in TOOLS.md to generate correct anchor
                    local full_header=$(grep -m1 "^### \*\*${name}\*\*" "$TOOLS_FILE" || echo "")
                    local anchor
                    
                    if [[ -n "$full_header" ]]; then
                        full_header=$(echo "$full_header" | sed 's/^### //')
                        full_header=$(echo "$full_header" | sed 's/\*\*//g')
                        anchor=$(slugify "$full_header")
                    else
                        anchor=$(slugify "$name")
                    fi
                    
                    echo "- **[$name](../TOOLS.md#$anchor)** $difficulty - $desc" >> "$index_file"
                fi
            done < <(grep "^TOOL|[^|]*|$category|" "$tool_data_file" | sort -t'|' -k2 -f)
            echo "" >> "$index_file"
        fi
    done <<< "$categories"
    
    echo "---" >> "$index_file"
    echo "" >> "$index_file"
    
    # Difficulty Index
    echo "## Difficulty Index" >> "$index_file"
    echo "" >> "$index_file"
    echo "Tools sorted by difficulty level within each category." >> "$index_file"
    echo "" >> "$index_file"
    echo "- ⭐⭐ = Beginner" >> "$index_file"
    echo "- ⭐⭐⭐ = Intermediate" >> "$index_file"
    echo "- ⭐⭐⭐⭐ = Advanced" >> "$index_file"
    echo "- ⭐⭐⭐⭐⭐ = Expert" >> "$index_file"
    echo "" >> "$index_file"
    
    # Get unique categories
    local categories=$(cut -d'|' -f3 "$tool_data_file" | sort -u)
    
    while IFS= read -r category; do
        if [[ -n $category ]]; then
            echo "### $category" >> "$index_file"
            echo "" >> "$index_file"
            
            # Process each difficulty level for this category
            for level in "⭐⭐" "⭐⭐⭐" "⭐⭐⭐⭐" "⭐⭐⭐⭐⭐"; do
                # Check if there are tools at this difficulty level
                local level_tools=$(grep "^TOOL|[^|]*|$category|$level|" "$tool_data_file")
                
                if [[ -n $level_tools ]]; then
                    echo "**$level**" >> "$index_file"
                    echo "" >> "$index_file"
                    
                    while IFS='|' read -r type name cat difficulty keywords synonyms desc; do
                        if [[ $type == "TOOL" ]]; then
                            desc=${desc:-No description available}
                            
                            # Find the actual header in TOOLS.md to generate correct anchor
                            local full_header=$(grep -m1 "^### \*\*${name}\*\*" "$TOOLS_FILE" || echo "")
                            local anchor
                            
                            if [[ -n "$full_header" ]]; then
                                full_header=$(echo "$full_header" | sed 's/^### //')
                                full_header=$(echo "$full_header" | sed 's/\*\*//g')
                                anchor=$(slugify "$full_header")
                            else
                                anchor=$(slugify "$name")
                            fi
                            
                            echo "- **[$name](../TOOLS.md#$anchor)** - $desc" >> "$index_file"
                        fi
                    done < <(echo "$level_tools" | sort -t'|' -k2 -f)
                    echo "" >> "$index_file"
                fi
            done
        fi
    done <<< "$categories"
    
    echo "---" >> "$index_file"
    echo "" >> "$index_file"
    echo "*Generated by update_stats.sh*" >> "$index_file"
    
    # Clean up temporary files
    rm -rf "$tmp_dir"
    
    # Validate generated index header markers and counts
    validate_index_headers "$index_file"
    
    echo -e "${GREEN}Tool index generated successfully at $index_file${NC}"
}

# Generate JSON output for integration
generate_json_output() {
    local total_issues=$((CONSISTENCY_ISSUE_COUNT + CROSS_REF_ISSUE_COUNT + STRUCTURAL_ISSUE_COUNT + FORMAT_ISSUE_COUNT + BROKEN_LINK_COUNT))
    
    # Determine status
    local status="passed"
    if [[ $total_issues -gt 0 ]]; then
        if [[ $CONSISTENCY_ISSUE_COUNT -gt 0 ]] || [[ $STRUCTURAL_ISSUE_COUNT -gt 0 ]]; then
            status="failed"
        else
            status="warning"
        fi
    fi
    
    # Use jq if available for proper JSON formatting
    if command -v jq &> /dev/null; then
        jq -n \
            --arg timestamp "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --arg status "$status" \
            --arg total_tools "$TOTAL_TOOLS" \
            --arg total_categories "$TOTAL_CATEGORIES" \
            --arg consistency_issues "$CONSISTENCY_ISSUE_COUNT" \
            --arg cross_ref_issues "$CROSS_REF_ISSUE_COUNT" \
            --arg structural_issues "$STRUCTURAL_ISSUE_COUNT" \
            --arg format_issues "$FORMAT_ISSUE_COUNT" \
            --arg broken_links "$BROKEN_LINK_COUNT" \
            --arg total_issues "$total_issues" \
            --argjson consistency_issues_list "$(printf '%s\n' "${CONSISTENCY_ISSUES[@]}" | jq -R . | jq -s . 2>/dev/null || echo '[]')" \
            --argjson cross_ref_issues_list "$(printf '%s\n' "${CROSS_REF_ISSUES[@]}" | jq -R . | jq -s . 2>/dev/null || echo '[]')" \
            --argjson format_issues_list "$(printf '%s\n' "${FORMAT_ISSUES[@]}" | jq -R . | jq -s . 2>/dev/null || echo '[]')" \
            --argjson broken_links_list "$(printf '%s\n' "${BROKEN_LINKS[@]}" | jq -R . | jq -s . 2>/dev/null || echo '[]')" \
            '{
                timestamp: $timestamp,
                status: $status,
                statistics: {
                    total_tools: ($total_tools | tonumber),
                    total_categories: ($total_categories | tonumber)
                },
                validation: {
                    total_issues: ($total_issues | tonumber),
                    consistency_issues: ($consistency_issues | tonumber),
                    cross_ref_issues: ($cross_ref_issues | tonumber),
                    structural_issues: ($structural_issues | tonumber),
                    format_issues: ($format_issues | tonumber),
                    broken_links: ($broken_links | tonumber)
                },
                issues: {
                    consistency: $consistency_issues_list,
                    cross_references: $cross_ref_issues_list,
                    format: $format_issues_list,
                    broken_links: $broken_links_list
                }
            }'
    else
        # Fallback to simple JSON output without jq
        cat <<EOF
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "status": "$status",
    "statistics": {
        "total_tools": $TOTAL_TOOLS,
        "total_categories": $TOTAL_CATEGORIES
    },
    "validation": {
        "total_issues": $total_issues,
        "consistency_issues": $CONSISTENCY_ISSUE_COUNT,
        "cross_ref_issues": $CROSS_REF_ISSUE_COUNT,
        "structural_issues": $STRUCTURAL_ISSUE_COUNT,
        "format_issues": $FORMAT_ISSUE_COUNT,
        "broken_links": $BROKEN_LINK_COUNT
    }
}
EOF
    fi
}

# Main execution
main() {
    parse_args "$@"
    
    # Handle legacy default mode
    if [[ $# -eq 0 ]] && ( [[ $LEGACY_DEFAULT == true ]] || check_legacy_mode ); then
        echo -e "${YELLOW}DEPRECATION NOTICE: Legacy default mode is being used.${NC}"
        echo -e "${YELLOW}This behavior (update-all on no flags) will be removed in a future version.${NC}"
        echo -e "${YELLOW}Please use --update-all explicitly or set report-only mode.${NC}"
        echo ""
        UPDATE_FILE="ALL"
    fi
    
    # Skip normal output if JSON mode
    if [[ $JSON_OUTPUT == false ]]; then
        echo -e "${GREEN}CLI Tools Repository Statistics Updater${NC}"
        echo "========================================="
        echo ""
    fi
    
    # Verify TOOLS.md exists
    if [[ ! -f "$TOOLS_FILE" ]]; then
        if [[ $JSON_OUTPUT == true ]]; then
            echo '{"error": "TOOLS.md not found", "status": "error"}'
        else
            echo -e "${RED}Error: TOOLS.md not found at $TOOLS_FILE${NC}"
        fi
        exit 1
    fi
    
    # Gather statistics
    count_tools
    analyze_categories
    analyze_difficulty
    
    # Check metadata coverage if requested
    if [[ $CHECK_METADATA == true ]] || [[ $COMPREHENSIVE_VALIDATION == true ]]; then
        calculate_metadata_coverage $TOTAL_TOOLS
        local coverage_result=$?
    fi
    
    # Update README categories if requested
    if [[ $UPDATE_README_CATEGORIES == true ]]; then
        update_readme_categories
    fi
    
    # Perform requested operations
    local consistency_result=0
    local link_result=0
    local format_result=0
    local metadata_result=0
    local comprehensive_result=0
    
    # Handle new statistics flags
    if [[ $VERIFY_STATS == true ]]; then
        echo -e "${BLUE}Verifying statistics consistency...${NC}"
        check_consistency
        consistency_result=$?
    fi
    
    if [[ $VALIDATE_STATS == true ]]; then
        echo -e "${BLUE}Performing comprehensive statistics validation...${NC}"
        check_comprehensive_consistency
        comprehensive_result=$?
        check_statistics_markers
        local markers_result=$?
        if [[ $markers_result -ne 0 ]]; then
            comprehensive_result=1
        fi
    fi
    
    if [[ $FIX_MODE == true ]]; then
        echo -e "${BLUE}Auto-fixing statistics inconsistencies...${NC}"
        update_all_files
        echo -e "${GREEN}Statistics fixed across all documentation files${NC}"
    fi
    
    if [[ $CHECK_CONSISTENCY == true ]] || [[ $COMPREHENSIVE_VALIDATION == true ]] || [[ $QUICK_VALIDATION == true ]]; then
        set +e  # Disable exit on error temporarily
        if [[ $COMPREHENSIVE_VALIDATION == true ]]; then
            # Run comprehensive validation which includes all checks
            check_comprehensive_consistency
            comprehensive_result=$?
            
            check_cross_references
            local cross_ref_result=$?
            
            check_documentation_duplication
            local duplication_result=$?
            
            check_repository_structure  
            local structure_result=$?
            
            # Set overall result based on any failures
            if [[ $comprehensive_result -ne 0 ]] || [[ $cross_ref_result -ne 0 ]] || [[ $duplication_result -ne 0 ]] || [[ $structure_result -ne 0 ]]; then
                consistency_result=1
            fi
        elif [[ $QUICK_VALIDATION == true ]]; then
            # Run quick validation - basic consistency and statistics markers
            print_if_not_json "${BLUE}Running quick validation (basic checks only)...${NC}"
            check_consistency
            consistency_result=$?
            
            check_statistics_markers
            local markers_result=$?
            if [[ $markers_result -ne 0 ]]; then
                consistency_result=1
            fi
        else
            # Run basic consistency check
            check_consistency
            consistency_result=$?
        fi
        set -e  # Re-enable exit on error
    fi
    
    if [[ $CHECK_LINKS == true ]]; then
        set +e  # Disable exit on error temporarily
        validate_links
        link_result=$?
        set -e  # Re-enable exit on error
    fi
    
    if [[ $CHECK_FORMAT == true ]]; then
        set +e  # Disable exit on error temporarily
        check_format_consistency
        format_result=$?
        set -e  # Re-enable exit on error
    fi
    
    if [[ $CHECK_METADATA == true ]]; then
        set +e  # Disable exit on error temporarily
        check_metadata_consistency
        metadata_result=$?
        set -e  # Re-enable exit on error
    fi
    
    # Exit with error if any check failed
    if [[ $consistency_result -ne 0 ]] || [[ $link_result -ne 0 ]] || [[ $format_result -ne 0 ]] || [[ $metadata_result -ne 0 ]]; then
        local exit_code=1
    else
        local exit_code=0
    fi
    
    # Generate comprehensive report if comprehensive validation was run
    if [[ $COMPREHENSIVE_VALIDATION == true ]]; then
        generate_comprehensive_report
        local report_result=$?
        if [[ $report_result -ne 0 ]]; then
            exit_code=1
        fi
    fi
    
    # Generate index if requested
    if [[ $GENERATE_INDEX == true ]]; then
        generate_tool_index
    fi
    
    # Check keywords if requested
    if [[ $CHECK_KEYWORDS == true ]]; then
        set +e
        check_metadata_consistency
        local keyword_result=$?
        set -e
        if [[ $keyword_result -ne 0 ]]; then
            exit_code=1
        fi
    fi
    
    if [[ -n $UPDATE_FILE ]]; then
        if [[ $UPDATE_FILE == "ALL" ]]; then
            update_all_files
        elif [[ $UPDATE_FILE == "README.md" ]]; then
            update_readme
        else
            echo -e "${YELLOW}Update for $UPDATE_FILE not implemented yet${NC}"
        fi
    elif [[ $REPORT_ONLY == false ]] && [[ $CHECK_CONSISTENCY == false ]] && [[ $CHECK_LINKS == false ]] && [[ $CHECK_FORMAT == false ]] && [[ $CHECK_METADATA == false ]] && [[ $GENERATE_INDEX == false ]] && [[ $CHECK_KEYWORDS == false ]] && [[ $COMPREHENSIVE_VALIDATION == false ]] && [[ $QUICK_VALIDATION == false ]] && [[ $VERIFY_STATS == false ]] && [[ $VALIDATE_STATS == false ]] && [[ $FIX_MODE == false ]]; then
        # Default: report-only mode (safer default behavior)
        echo -e "${YELLOW}Running in report-only mode by default (no files will be modified)${NC}"
        echo -e "${CYAN}Use --update-all or --fix to update files${NC}"
        echo ""
        REPORT_ONLY=true
    fi
    
    # Generate report or JSON output
    if [[ $JSON_OUTPUT == true ]]; then
        # Output JSON instead of regular report
        generate_json_output
    else
        generate_report
        
        if [[ $FULL_REPORT == true ]]; then
            generate_csv_report
        fi
        
        echo "========================================="
    fi
    
    # Determine final exit code based on all results
    local final_exit_code=0
    
    # Check all result variables properly
    if [[ ${consistency_result:-0} -ne 0 ]] || [[ ${link_result:-0} -ne 0 ]] || [[ ${format_result:-0} -ne 0 ]] || [[ ${metadata_result:-0} -ne 0 ]] || [[ ${comprehensive_result:-0} -ne 0 ]]; then
        final_exit_code=2
    fi
    
    local total_issues=$((CONSISTENCY_ISSUE_COUNT + CROSS_REF_ISSUE_COUNT + STRUCTURAL_ISSUE_COUNT + FORMAT_ISSUE_COUNT + BROKEN_LINK_COUNT))
    
    # Determine exit code based on CI mode and soft-exit flags
    local determined_exit_code=0
    if [[ $total_issues -gt 0 ]] || [[ $final_exit_code -ne 0 ]]; then
        if [[ $CONSISTENCY_ISSUE_COUNT -gt 0 ]] || [[ $STRUCTURAL_ISSUE_COUNT -gt 0 ]] || [[ $final_exit_code -eq 2 ]]; then
            determined_exit_code=2  # Critical issues
        else
            determined_exit_code=1  # Warnings
        fi
    fi
    
    # Apply CI mode and soft-exit logic
    if [[ $CI_MODE == true ]] && [[ $determined_exit_code -eq 1 ]]; then
        # In CI mode, warnings become failures
        determined_exit_code=2
    elif [[ $SOFT_EXIT == true ]] && [[ $determined_exit_code -eq 1 ]]; then
        # In soft-exit mode, warnings don't fail
        determined_exit_code=0
    fi
    
    final_exit_code=$determined_exit_code
    
    # Skip status messages if JSON mode
    if [[ $JSON_OUTPUT == false ]]; then
        if [[ $total_issues -gt 0 ]] || [[ $final_exit_code -ne 0 ]]; then
            # Critical issues get exit code 2, warnings get exit code 1
            if [[ $CONSISTENCY_ISSUE_COUNT -gt 0 ]] || [[ $STRUCTURAL_ISSUE_COUNT -gt 0 ]] || [[ $final_exit_code -eq 2 ]]; then
                echo -e "${RED}Statistics update completed with CRITICAL ISSUES ($total_issues total issues found)${NC}"
                if [[ $CI_MODE == true ]]; then
                    echo -e "${RED}CI/CD Status: FAILED - Critical issues or warnings in CI mode${NC}"
                else
                    echo -e "${RED}CI/CD Status: FAILED - Critical documentation inconsistencies detected${NC}"
                fi
            else
                if [[ $SOFT_EXIT == true ]]; then
                    echo -e "${YELLOW}Statistics update completed with warnings ($total_issues total issues found) [soft-exit mode]${NC}"
                    echo -e "${GREEN}CI/CD Status: PASSED - Warnings ignored due to --soft-exit${NC}"
                else
                    echo -e "${YELLOW}Statistics update completed with warnings ($total_issues total issues found)${NC}"
                    echo -e "${YELLOW}CI/CD Status: PASSED WITH WARNINGS - Some issues should be addressed${NC}"
                fi
            fi
            
            echo ""
            echo -e "${BLUE}For detailed issue analysis, run:${NC}"
            echo -e "  $0 --comprehensive --full-report"
            echo ""
            echo -e "${BLUE}To fix issues automatically, run:${NC}"
            echo -e "  $0 --fix"
            echo ""
        else
            echo -e "${GREEN}Statistics update complete! All consistency checks passed.${NC}"
            echo -e "${GREEN}CI/CD Status: PASSED - Documentation is fully consistent${NC}"
        fi
    else
        # Exit code already determined above with CI/soft-exit logic
        # Just output JSON status
        true
    fi
    
    # Export results for CI/CD systems
    if [[ -n "${GITHUB_ACTIONS:-}" ]] || [[ -n "${CI:-}" ]]; then
        echo "VALIDATION_TOTAL_ISSUES=$total_issues" >> "${GITHUB_ENV:-/dev/null}" 2>/dev/null || true
        echo "VALIDATION_CONSISTENCY_ISSUES=$CONSISTENCY_ISSUE_COUNT" >> "${GITHUB_ENV:-/dev/null}" 2>/dev/null || true
        echo "VALIDATION_EXIT_CODE=$final_exit_code" >> "${GITHUB_ENV:-/dev/null}" 2>/dev/null || true
        
        if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
            if [[ $final_exit_code -eq 2 ]]; then
                echo "::error::Critical documentation consistency issues found ($total_issues total)"
            elif [[ $final_exit_code -eq 1 ]]; then
                echo "::warning::Documentation consistency warnings found ($total_issues total)"
            fi
        fi
    fi
    
    exit $final_exit_code
}

# Run main function
main "$@"