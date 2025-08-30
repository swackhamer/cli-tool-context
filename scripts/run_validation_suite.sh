#!/bin/bash

# Comprehensive Validation Suite for CLI Tool Context Documentation
# This script orchestrates all validation tools to identify documentation issues

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
README_FILE="$PROJECT_ROOT/README.md"
MISSING_FILES=0
OUTPUT_MODE="detailed"
FIX_SUGGESTIONS=false
JSON_OUTPUT=false
VALIDATE_STATS=false
CHECK_KEYWORDS=false
STRICT_MODE=false
AUTO_FIX_PERMS=false
CI_MODE=false
TOTAL_ISSUES=0
CRITICAL_ISSUES=0
WARNINGS=0
INFO_ITEMS=0

# Timing
START_TIME=$(date +%s)

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --summary)
            OUTPUT_MODE="summary"
            shift
            ;;
        --detailed)
            OUTPUT_MODE="detailed"
            shift
            ;;
        --fix-suggestions)
            FIX_SUGGESTIONS=true
            shift
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        --validate-stats)
            VALIDATE_STATS=true
            shift
            ;;
        --check-keywords)
            CHECK_KEYWORDS=true
            shift
            ;;
        --strict)
            STRICT_MODE=true
            shift
            ;;
        --auto-fix-perms)
            AUTO_FIX_PERMS=true
            shift
            ;;
        --ci)
            CI_MODE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --summary          Show brief overview of issues"
            echo "  --detailed         Show full diagnostic output (default)"
            echo "  --fix-suggestions  Include automated fix recommendations"
            echo "  --json            Output results in JSON format"
            echo "  --validate-stats  Run comprehensive statistics validation"
            echo "  --check-keywords  Run optional keywords and synonyms validation"
            echo "  --strict          Strict mode - all files required (no downgrades to warnings)"
            echo "  --auto-fix-perms  Automatically fix script permissions when needed"
            echo "  --ci              CI mode - stricter validation and appropriate exit codes"
            echo "  --help            Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Detect CI environment or --ci flag
if [[ "${CI:-false}" == "true" ]] || [[ "$CI_MODE" == "true" ]]; then
    CI_MODE=true
    # In CI mode, enable stricter defaults
    STRICT_MODE=true
    AUTO_FIX_PERMS=false  # Never auto-fix in CI
    
    # Force JSON output in CI if not already set
    if [[ "$JSON_OUTPUT" != "true" ]]; then
        JSON_OUTPUT=true
    fi
fi

# Check for jq availability when JSON output is requested
if [ "$JSON_OUTPUT" = true ]; then
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is required for JSON output but is not installed.${NC}" >&2
        echo -e "${YELLOW}Please install jq to use the --json flag.${NC}" >&2
        echo -e "${CYAN}Installation instructions:${NC}" >&2
        echo -e "  - macOS: brew install jq" >&2
        echo -e "  - Ubuntu/Debian: sudo apt-get install jq" >&2
        echo -e "  - RHEL/CentOS: sudo yum install jq" >&2
        exit 1
    fi
    SECTIONS_JSON='[]'
fi

# Helper function to print section headers
print_header() {
    local title="$1"
    if [ "$JSON_OUTPUT" = false ]; then
        echo ""
        echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BOLD}${CYAN}  $title${NC}"
        echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    fi
}

# Helper function to print subheaders
print_subheader() {
    local title="$1"
    if [ "$JSON_OUTPUT" = false ]; then
        echo ""
        echo -e "${BOLD}${MAGENTA}▶ $title${NC}"
        echo -e "${MAGENTA}────────────────────────────────────────${NC}"
    fi
}

# Helper function to check if update_stats.sh supports a feature
check_capability() {
    local flag="$1"
    if "$SCRIPT_DIR/update_stats.sh" --capabilities 2>/dev/null | grep -q "$flag"; then
        return 0
    elif "$SCRIPT_DIR/update_stats.sh" --help 2>&1 | grep -q "\-\-$flag"; then
        return 0
    else
        return 1
    fi
}

# Helper function to record issues
record_issue() {
    local severity="$1"
    local category="$2"
    local message="$3"
    
    # Add to JSON structure if enabled using jq
    if [ "$JSON_OUTPUT" = true ] && [ "$severity" != "SUCCESS" ]; then
        if command -v jq &> /dev/null; then
            # Use jq to properly append to JSON array
            SECTIONS_JSON=$(echo "$SECTIONS_JSON" | jq \
                --arg cat "$category" \
                --arg sev "$severity" \
                --arg msg "$message" \
                '. + [{"category": $cat, "severity": $sev, "message": $msg}]')
        fi
    fi
    
    case "$severity" in
        "CRITICAL")
            ((CRITICAL_ISSUES++))
            ((TOTAL_ISSUES++))
            if [ "$JSON_OUTPUT" = false ]; then
                echo -e "${RED}✗ [CRITICAL]${NC} $message"
            fi
            ;;
        "WARNING")
            ((WARNINGS++))
            ((TOTAL_ISSUES++))
            if [ "$JSON_OUTPUT" = false ]; then
                echo -e "${YELLOW}⚠ [WARNING]${NC} $message"
            fi
            ;;
        "INFO")
            ((INFO_ITEMS++))
            if [ "$JSON_OUTPUT" = false ] && [ "$OUTPUT_MODE" = "detailed" ]; then
                echo -e "${CYAN}ℹ [INFO]${NC} $message"
            fi
            ;;
        "SUCCESS")
            if [ "$JSON_OUTPUT" = false ]; then
                echo -e "${GREEN}✓${NC} $message"
            fi
            ;;
    esac
}

# Function to check if a script exists and is executable
check_script() {
    local script_path="$1"
    if [ ! -f "$script_path" ]; then
        record_issue "CRITICAL" "missing_script" "Required script not found: $script_path"
        return 1
    elif [ ! -x "$script_path" ]; then
        if [ "$AUTO_FIX_PERMS" = true ]; then
            # Auto-fix permissions when flag is set
            record_issue "WARNING" "script_permissions" "Script not executable: $script_path (fixing permissions)"
            chmod +x "$script_path"
            if [ -x "$script_path" ]; then
                record_issue "SUCCESS" "script_permissions" "Fixed permissions for: $(basename "$script_path")"
            else
                record_issue "CRITICAL" "script_permissions" "Failed to fix permissions for: $script_path"
                return 1
            fi
        else
            # Just record as critical without fixing when flag not set
            record_issue "CRITICAL" "script_permissions" "Script not executable: $script_path (use --auto-fix-perms to fix)"
            return 1
        fi
    fi
    return 0
}

# Start validation suite
if [ "$JSON_OUTPUT" = false ]; then
    echo -e "${BOLD}${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║        CLI TOOL CONTEXT - COMPREHENSIVE VALIDATION          ║"
    echo "║                    Documentation Quality Assurance           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "${CYAN}Started at: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo -e "${CYAN}Project Root: $PROJECT_ROOT${NC}"
    echo -e "${CYAN}Output Mode: $OUTPUT_MODE${NC}"
    if [[ "$CI_MODE" == "true" ]]; then
        echo -e "${CYAN}CI Mode: ENABLED (stricter validation)${NC}"
    fi
    
    # Warn about legacy environment variable
    if [[ "${UPDATE_STATS_LEGACY_DEFAULT:-}" == "true" ]] || [[ "${UPDATE_STATS_LEGACY_DEFAULT:-}" == "1" ]]; then
        echo -e "${YELLOW}⚠ WARNING: UPDATE_STATS_LEGACY_DEFAULT is set - using deprecated behavior${NC}"
        echo -e "${YELLOW}  Consider updating scripts to use explicit --fix or --update-all flags${NC}"
        echo -e "${YELLOW}  See docs/MAINTENANCE.md for migration guidance${NC}"
    fi
fi

# SECTION 1: Check Script Availability
print_header "1. VALIDATION INFRASTRUCTURE CHECK"

REQUIRED_SCRIPTS=(
    "$SCRIPT_DIR/update_stats.sh"
    "$SCRIPT_DIR/verify_tools.sh"
    "$SCRIPT_DIR/check_plan_completion.sh"
    "$SCRIPT_DIR/validate_anchors.sh"
)

SCRIPTS_AVAILABLE=true
for script in "${REQUIRED_SCRIPTS[@]}"; do
    if check_script "$script"; then
        record_issue "SUCCESS" "infrastructure" "Found: $(basename "$script")"
    else
        SCRIPTS_AVAILABLE=false
    fi
done

if [ "$SCRIPTS_AVAILABLE" = false ]; then
    echo -e "${RED}${BOLD}ERROR: Required validation scripts are missing or not executable${NC}"
    echo -e "${RED}Please ensure all scripts in the scripts/ directory are present and executable${NC}"
    exit 1
fi

# SECTION 2: README Statistics and Consistency Check
print_header "2. README.MD VALIDATION"
print_subheader "Checking statistics markers and consistency"

if [ "$OUTPUT_MODE" = "detailed" ]; then
    echo -e "${CYAN}Running: update_stats.sh --verify-stats${NC}"
fi

# Check capabilities using new --capabilities flag, fallback to help grep
if check_capability "verify-stats"; then
    # Use JSON output if jq is available
    if command -v jq &> /dev/null; then
        # Add --ci flag when in CI mode
        ci_flag=""
        if [[ "$CI_MODE" == "true" ]]; then
            ci_flag="--ci"
        fi
        
        CONSISTENCY_JSON=$("$SCRIPT_DIR/update_stats.sh" --verify-stats --json $ci_flag 2>/dev/null || echo "{}")
        # Parse JSON using correct schema from update_stats.sh with fallback detection
        if echo "$CONSISTENCY_JSON" | jq -e '.status' >/dev/null 2>&1; then
            STATUS=$(echo "$CONSISTENCY_JSON" | jq -r '.status // ""')
            if [ "$STATUS" = "failed" ] || [ "$STATUS" = "warning" ]; then
                # Parse consistency issues if they exist
                if echo "$CONSISTENCY_JSON" | jq -e '.issues.consistency' >/dev/null 2>&1; then
                    echo "$CONSISTENCY_JSON" | jq -r '.issues.consistency[]? // empty' | while IFS= read -r issue; do
                        [ -n "$issue" ] && record_issue "CRITICAL" "readme_consistency" "$issue"
                    done
                fi
                # Parse format issues if they exist
                if echo "$CONSISTENCY_JSON" | jq -e '.issues.format' >/dev/null 2>&1; then
                    echo "$CONSISTENCY_JSON" | jq -r '.issues.format[]? // empty' | while IFS= read -r issue; do
                        [ -n "$issue" ] && record_issue "WARNING" "readme_consistency" "$issue"
                    done
                fi
            fi
        else
            # Fallback to text parsing when JSON doesn't have expected structure
            echo "INFO: Falling back to text parsing for consistency check (JSON structure not recognized)" >&2
            CONSISTENCY_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --verify-stats 2>&1 || true)
            if echo "$CONSISTENCY_OUTPUT" | grep -qE "^(ERROR|WARNING):"; then
                while IFS= read -r line; do
                    if [[ "$line" =~ ^ERROR: ]]; then
                        record_issue "CRITICAL" "readme_consistency" "${line#ERROR: }"
                    elif [[ "$line" =~ ^WARNING: ]]; then
                        record_issue "WARNING" "readme_consistency" "${line#WARNING: }"
                    fi
                done <<< "$CONSISTENCY_OUTPUT"
            else
                record_issue "SUCCESS" "readme_consistency" "README.md statistics are consistent"
            fi
        fi
    else
        # No jq, use improved text parsing
        echo "INFO: Using text parsing for consistency check (jq not available)" >&2
        CONSISTENCY_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --verify-stats 2>&1 || true)
        if echo "$CONSISTENCY_OUTPUT" | grep -qE "^(ERROR|WARNING):"; then
            while IFS= read -r line; do
                if [[ "$line" =~ ^ERROR: ]]; then
                    record_issue "CRITICAL" "readme_consistency" "${line#ERROR: }"
                elif [[ "$line" =~ ^WARNING: ]]; then
                    record_issue "WARNING" "readme_consistency" "${line#WARNING: }"
                fi
            done <<< "$CONSISTENCY_OUTPUT"
        else
            record_issue "SUCCESS" "readme_consistency" "README.md statistics are consistent"
        fi
    fi
else
    CONSISTENCY_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-consistency 2>&1 || true)
    if echo "$CONSISTENCY_OUTPUT" | grep -qE "^(ERROR|WARNING):"; then
        while IFS= read -r line; do
            if [[ "$line" =~ ^ERROR: ]]; then
                record_issue "CRITICAL" "readme_consistency" "${line#ERROR: }"
            elif [[ "$line" =~ ^WARNING: ]]; then
                record_issue "WARNING" "readme_consistency" "${line#WARNING: }"
            fi
        done <<< "$CONSISTENCY_OUTPUT"
    else
        record_issue "SUCCESS" "readme_consistency" "README.md statistics are consistent"
    fi
fi

# Run validate-stats if requested or validate-stats flag is set
if [ "$VALIDATE_STATS" = true ]; then
    print_subheader "Running comprehensive statistics validation"
    if [ "$OUTPUT_MODE" = "detailed" ]; then
        echo -e "${CYAN}Running: update_stats.sh --validate-stats${NC}"
    fi
    
    # Check if --validate-stats is supported using capabilities or fallback to help grep
    if check_capability "validate-stats"; then
        VALIDATE_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --validate-stats 2>&1 || true)
    else
        record_issue "INFO" "stats_validation" "--validate-stats flag not supported, using existing consistency checks"
        VALIDATE_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-consistency --check-format 2>&1 || true)
    fi
    if echo "$VALIDATE_OUTPUT" | grep -q "ERROR\|WARNING"; then
        while IFS= read -r line; do
            if [[ "$line" =~ ERROR ]]; then
                record_issue "CRITICAL" "stats_validation" "$line"
            elif [[ "$line" =~ WARNING ]]; then
                record_issue "WARNING" "stats_validation" "$line"
            fi
        done <<< "$VALIDATE_OUTPUT"
    else
        record_issue "SUCCESS" "stats_validation" "Comprehensive statistics validation passed"
    fi
fi

# SECTION 3: TOOLS.md Metadata Validation
print_header "3. TOOLS.MD METADATA VALIDATION"
print_subheader "Checking metadata blocks and format"

if [ "$OUTPUT_MODE" = "detailed" ]; then
    echo -e "${CYAN}Running: update_stats.sh --check-metadata${NC}"
fi

METADATA_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-metadata 2>&1 || true)
if echo "$METADATA_OUTPUT" | grep -q "ERROR\|WARNING"; then
    while IFS= read -r line; do
        if [[ "$line" =~ ERROR ]]; then
            record_issue "CRITICAL" "tools_metadata" "$line"
        elif [[ "$line" =~ WARNING ]]; then
            record_issue "WARNING" "tools_metadata" "$line"
        fi
    done <<< "$METADATA_OUTPUT"
else
    record_issue "SUCCESS" "tools_metadata" "TOOLS.md metadata is valid"
fi

# SECTION 4: Documentation Format Check
print_header "4. DOCUMENTATION FORMAT VALIDATION"
print_subheader "Checking format consistency across all documentation"

if [ "$OUTPUT_MODE" = "detailed" ]; then
    echo -e "${CYAN}Running: update_stats.sh --check-format${NC}"
fi

FORMAT_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-format 2>&1 || true)
if echo "$FORMAT_OUTPUT" | grep -q "ERROR\|WARNING"; then
    while IFS= read -r line; do
        if [[ "$line" =~ ERROR ]]; then
            record_issue "CRITICAL" "format" "$line"
        elif [[ "$line" =~ WARNING ]]; then
            record_issue "WARNING" "format" "$line"
        fi
    done <<< "$FORMAT_OUTPUT"
else
    record_issue "SUCCESS" "format" "Documentation format is consistent"
fi

# SECTION 5: Internal Links Validation
print_header "5. INTERNAL LINKS VALIDATION"
print_subheader "Checking cross-references and internal links"

if [ "$OUTPUT_MODE" = "detailed" ]; then
    echo -e "${CYAN}Running: update_stats.sh --check-links${NC}"
fi

# Use JSON output for link checking if available
if command -v jq &> /dev/null; then
    LINKS_JSON=$("$SCRIPT_DIR/update_stats.sh" --check-links --json 2>/dev/null || echo "{}")
    # Parse JSON using correct schema from update_stats.sh with fallback detection
    if echo "$LINKS_JSON" | jq -e '.validation.broken_links' >/dev/null 2>&1; then
        BROKEN_COUNT=$(echo "$LINKS_JSON" | jq -r '.validation.broken_links // 0')
        if [ "$BROKEN_COUNT" -gt 0 ]; then
            # Parse broken links from correct JSON path
            echo "$LINKS_JSON" | jq -r '.issues.broken_links[]? // empty' | while IFS= read -r link; do
                [ -n "$link" ] && record_issue "CRITICAL" "links" "Broken link: $link"
            done
        fi
    else
        # Fallback to text parsing when JSON doesn't have expected structure
        echo "INFO: Falling back to text parsing for link check (JSON structure not recognized)" >&2
        LINKS_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-links 2>&1 || true)
        if echo "$LINKS_OUTPUT" | grep -qE "^(ERROR|WARNING):"; then
            while IFS= read -r line; do
                if [[ "$line" =~ ^ERROR: ]]; then
                    record_issue "CRITICAL" "links" "${line#ERROR: }"
                elif [[ "$line" =~ ^WARNING: ]]; then
                    record_issue "WARNING" "links" "${line#WARNING: }"
                fi
            done <<< "$LINKS_OUTPUT"
        else
            record_issue "SUCCESS" "links" "All internal links are valid"
        fi
    fi
else
    # No jq, use improved text parsing - avoid false positives from 'BROKEN' word
    echo "INFO: Using text parsing for link check (jq not available)" >&2
    LINKS_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-links 2>&1 || true)
    if echo "$LINKS_OUTPUT" | grep -qE "^(ERROR|WARNING):"; then
        while IFS= read -r line; do
            if [[ "$line" =~ ^ERROR: ]]; then
                record_issue "CRITICAL" "links" "${line#ERROR: }"
            elif [[ "$line" =~ ^WARNING: ]]; then
                record_issue "WARNING" "links" "${line#WARNING: }"
            fi
        done <<< "$LINKS_OUTPUT"
    else
        record_issue "SUCCESS" "links" "All internal links are valid"
    fi
fi

# SECTION 5.1: Anchor Link Consistency Validation
print_header "5.1. ANCHOR LINK CONSISTENCY VALIDATION"
print_subheader "Validating TOOL_INDEX.md anchor links match TOOLS.md"

# Check if validate_anchors.sh exists
if check_script "$SCRIPT_DIR/validate_anchors.sh"; then
    if [ "$OUTPUT_MODE" = "detailed" ]; then
        echo -e "${CYAN}Running: validate_anchors.sh${NC}"
    fi
    
    # Run anchor validation
    ANCHOR_OUTPUT=$("$SCRIPT_DIR/validate_anchors.sh" 2>&1 || true)
    ANCHOR_EXIT_CODE=$?
    
    if [ $ANCHOR_EXIT_CODE -eq 0 ]; then
        record_issue "SUCCESS" "anchor_consistency" "All anchor links are consistent"
    else
        # Parse validation errors and warnings from the output
        while IFS= read -r line; do
            if [[ "$line" =~ "✗ Validation failed with" ]]; then
                # Extract the section after "errors:" or "warnings:"
                continue
            elif [[ "$line" =~ ^[[:space:]]*-[[:space:]]*(.+)$ ]]; then
                issue="${BASH_REMATCH[1]}"
                if [[ "$issue" =~ "Broken anchor" ]]; then
                    record_issue "CRITICAL" "anchor_consistency" "$issue"
                elif [[ "$issue" =~ "count mismatch" ]]; then
                    record_issue "WARNING" "anchor_consistency" "$issue"
                else
                    record_issue "WARNING" "anchor_consistency" "$issue"
                fi
            fi
        done <<< "$ANCHOR_OUTPUT"
        
        # If we didn't find specific issues, record a general failure
        if ! echo "$ANCHOR_OUTPUT" | grep -q "✓ All validations passed"; then
            if ! echo "$ANCHOR_OUTPUT" | grep -qE "^[[:space:]]*-[[:space:]]"; then
                record_issue "CRITICAL" "anchor_consistency" "Anchor validation failed - run validate_anchors.sh for details"
            fi
        fi
    fi
else
    record_issue "WARNING" "anchor_consistency" "Anchor validation script not available - skipping"
fi

# SECTION 5.2: README Category Anchor Validation
print_header "5.2. README CATEGORY ANCHOR VALIDATION"
print_subheader "Validating README category links match TOOL_INDEX.md anchors"

# Source the shared library for slugify function
if [[ -f "$SCRIPT_DIR/lib.sh" ]]; then
    source "$SCRIPT_DIR/lib.sh"
    
    # Extract category references from README.md table rows
    README_CATEGORIES=()
    if [[ -f "$README_FILE" ]]; then
        while IFS= read -r line; do
            # Look for table rows with category information
            # Format: | **💾 Category Name** | count | tools | [View Details](docs/TOOL_INDEX.md#anchor) |
            if [[ $line =~ ^\|[[:space:]]*\*\*[^*]+\*\*[[:space:]]*\|.*\|.*\|[[:space:]]*\[([^\]]+)\]\(\./docs/TOOL_INDEX\.md#([^\)]+)\)[[:space:]]*\| ]]; then
                # Extract the anchor from the fourth column link
                link_text="${BASH_REMATCH[1]}"  # This is "View Details" - ignore this
                anchor="${BASH_REMATCH[2]}"
                
                # Extract the category name from the first column (remove ** markdown and emoji, trim)
                first_column=$(echo "$line" | cut -d'|' -f2 | sed 's/\*\*//g' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sed 's/^[^[:alpha:]]*[[:space:]]*//')
                if [[ -n "$first_column" ]]; then
                    README_CATEGORIES+=("$first_column:$anchor")
                fi
            fi
        done < "$README_FILE"
        
        # Validate each category anchor exists in TOOL_INDEX.md
        INDEX_FILE="$PROJECT_ROOT/docs/TOOL_INDEX.md"
        if [[ -f "$INDEX_FILE" ]]; then
            category_errors=0
            for category_entry in "${README_CATEGORIES[@]}"; do
                IFS=':' read -r category_name expected_anchor <<< "$category_entry"
                
                # Generate expected anchor using our slugify function
                generated_anchor=$(slugify "$category_name")
                
                # Check if the expected anchor matches generated anchor
                if [[ "$expected_anchor" != "$generated_anchor" ]]; then
                    record_issue "WARNING" "readme_categories" "README category '$category_name' uses anchor '$expected_anchor' but should be '$generated_anchor'"
                    ((category_errors++))
                fi
                
                # Check if anchor actually exists in TOOL_INDEX.md
                if ! grep -q "### $category_name" "$INDEX_FILE" && ! grep -q "## $category_name" "$INDEX_FILE"; then
                    record_issue "CRITICAL" "readme_categories" "README references category '$category_name' but it doesn't exist in TOOL_INDEX.md"
                    ((category_errors++))
                fi
            done
            
            if [[ $category_errors -eq 0 && ${#README_CATEGORIES[@]} -gt 0 ]]; then
                record_issue "SUCCESS" "readme_categories" "All ${#README_CATEGORIES[@]} README category anchors are valid"
            elif [[ ${#README_CATEGORIES[@]} -eq 0 ]]; then
                record_issue "INFO" "readme_categories" "No category links found in README.md"
            fi
        else
            record_issue "WARNING" "readme_categories" "TOOL_INDEX.md not found - cannot validate category anchors"
        fi
    else
        record_issue "WARNING" "readme_categories" "README.md not found - cannot validate category anchors"
    fi
else
    record_issue "WARNING" "readme_categories" "lib.sh not found - skipping category anchor validation"
fi

# SECTION 5.5: README File References Validation (Consolidated)
print_header "5.5. README FILE REFERENCES VALIDATION"
print_subheader "Using update_stats.sh for comprehensive README link validation"

if [ "$OUTPUT_MODE" = "detailed" ]; then
    echo -e "${CYAN}Running consolidated README validation via update_stats.sh${NC}"
fi

# Use update_stats.sh for README validation to avoid duplication
# This leverages the existing link checking logic in update_stats.sh
README_CHECK_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-links 2>&1 | grep -i "README" || true)
if [ -n "$README_CHECK_OUTPUT" ]; then
    while IFS= read -r line; do
        if [[ "$line" =~ ^ERROR: ]]; then
            record_issue "CRITICAL" "missing_referenced_file" "${line#ERROR: }"
        elif [[ "$line" =~ ^WARNING: ]]; then
            record_issue "WARNING" "file_references" "${line#WARNING: }"
        fi
    done <<< "$README_CHECK_OUTPUT"
    
    # Check non-.md file references if README exists
    if [[ -f "$README_FILE" ]]; then
        # Extract links properly with improved regex
        while IFS= read -r link; do
            # Extract path from markdown link format [text](path)
            file_path=$(echo "$link" | grep -oE '\]\(\./[^)]+\)' | sed 's/](\.\/\([^)]*\))/\1/' || true)
            # Strip fragment identifiers (anchors)
            file_path=${file_path%%#*}
            
            # Skip if empty, .md file, URL, or mailto
            if [[ -z "$file_path" ]] || [[ "$file_path" == *.md ]] || [[ "$file_path" == http* ]] || [[ "$file_path" == mailto:* ]]; then
                continue
            fi
            
            full_path="$PROJECT_ROOT/$file_path"
            
            if [ ! -f "$full_path" ] && [ ! -d "$full_path" ]; then
                record_issue "CRITICAL" "missing_referenced_file" "README.md references missing file/directory: $file_path"
                ((MISSING_FILES++))
            elif [ "$OUTPUT_MODE" = "detailed" ]; then
                record_issue "SUCCESS" "file_references" "Found referenced file/directory: $file_path"
            fi
        done < <(grep -oE '\[[^]]+\]\(\./[^)]+\)' "$README_FILE" 2>/dev/null || true)
    fi
    
    if [ "$MISSING_FILES" -eq 0 ]; then
        record_issue "SUCCESS" "file_references" "All README.md file references are valid"
    fi
else
    # When README_CHECK_OUTPUT is empty, check if README.md actually exists
    if [[ -f "$README_FILE" ]]; then
        record_issue "SUCCESS" "file_references" "README.md exists and no link issues detected"
    else
        record_issue "CRITICAL" "missing_file" "README.md not found"
    fi
fi

# SECTION 6: Tool Availability Check
print_header "6. TOOL AVAILABILITY VALIDATION"
print_subheader "Verifying documented tools are available on system"

if [ "$OUTPUT_MODE" = "detailed" ]; then
    echo -e "${CYAN}Running: verify_tools.sh --detailed${NC}"
fi

# Prefer JSON output with jq if available
if command -v jq &> /dev/null; then
    TOOLS_JSON=$("$SCRIPT_DIR/verify_tools.sh" --json 2>/dev/null || echo "{}")
    MISSING_TOOLS=$(echo "$TOOLS_JSON" | jq -r '.summary.missing // 0')
    
    if [ "$MISSING_TOOLS" -gt 0 ]; then
        record_issue "WARNING" "tool_availability" "Found $MISSING_TOOLS tools not available on system"
        if [ "$OUTPUT_MODE" = "detailed" ]; then
            # Extract missing tool names from JSON
            echo "$TOOLS_JSON" | jq -r '.categories[]?.tools[]? | select(.installed == false) | .name' 2>/dev/null | head -10 | while IFS= read -r tool; do
                [ -n "$tool" ] && echo "  ✗ $tool"
            done
            if [ "$MISSING_TOOLS" -gt 10 ]; then
                echo "  ... and $((MISSING_TOOLS - 10)) more"
            fi
        fi
    else
        record_issue "SUCCESS" "tool_availability" "All documented tools are available"
    fi
else
    # Fallback: Count lines with the missing marker (✗ at start of line)
    echo "INFO: Using text parsing for tool availability check (jq not available)" >&2
    TOOLS_OUTPUT=$("$SCRIPT_DIR/verify_tools.sh" --detailed 2>&1 || true)
    MISSING_TOOLS=$(echo "$TOOLS_OUTPUT" | grep -c "^✗\|^\\[0;31m✗" || true)
    
    if [ "$MISSING_TOOLS" -gt 0 ]; then
        record_issue "WARNING" "tool_availability" "Found $MISSING_TOOLS tools not available on system"
        if [ "$OUTPUT_MODE" = "detailed" ]; then
            echo "$TOOLS_OUTPUT" | grep "^✗\|^\\[0;31m✗" | head -10
            if [ "$MISSING_TOOLS" -gt 10 ]; then
                echo "  ... and $((MISSING_TOOLS - 10)) more"
            fi
        fi
    else
        record_issue "SUCCESS" "tool_availability" "All documented tools are available"
    fi
fi

# SECTION 7: TRAYCER Plan Completion Status
print_header "7. TRAYCER PLAN COMPLETION STATUS"
print_subheader "Checking implementation plan completion"

if [ "$OUTPUT_MODE" = "detailed" ]; then
    echo -e "${CYAN}Running: check_plan_completion.sh${NC}"
fi

PLAN_OUTPUT=$("$SCRIPT_DIR/check_plan_completion.sh" 2>&1 || true)
if echo "$PLAN_OUTPUT" | grep -q "incomplete\|pending"; then
    INCOMPLETE_TASKS=$(echo "$PLAN_OUTPUT" | grep -c "pending" || true)
    record_issue "INFO" "plan_status" "Found $INCOMPLETE_TASKS incomplete tasks in plan file"
else
    record_issue "SUCCESS" "plan_status" "TRAYCER plan implementation is complete"
fi

# SECTION 8: Keywords and Synonyms Validation (optional)
if [ "$CHECK_KEYWORDS" = true ]; then
    print_header "8. KEYWORDS AND SYNONYMS VALIDATION"
    print_subheader "Checking search optimization keywords"
    
    echo -e "${CYAN}Running: update_stats.sh --check-keywords${NC}"
    
    KEYWORDS_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-keywords 2>&1 || true)
    if echo "$KEYWORDS_OUTPUT" | grep -q "ERROR\|WARNING"; then
        while IFS= read -r line; do
            if [[ "$line" =~ ERROR ]]; then
                record_issue "CRITICAL" "keywords" "$line"
            elif [[ "$line" =~ WARNING ]]; then
                record_issue "WARNING" "keywords" "$line"
            fi
        done <<< "$KEYWORDS_OUTPUT"
    else
        record_issue "SUCCESS" "keywords" "Keywords and synonyms are properly configured"
    fi
fi

# SECTION 9: File Structure Validation
print_header "9. FILE STRUCTURE VALIDATION"
print_subheader "Checking required files and directories"

# Define core required files (always critical) and optional files (warning unless --strict)
CORE_REQUIRED_FILES=(
    "README.md"
    "TOOLS.md"
    "MASTER_PLAN.md"
)

OPTIONAL_FILES=(
    "docs/TOOL_INDEX.md"
    "docs/CHEATSHEET.md"
    "docs/CLAUDE_GUIDE.md"
    "docs/MAINTENANCE.md"
    "archive/"
)

# Check core required files - always critical
for file in "${CORE_REQUIRED_FILES[@]}"; do
    if [ ! -f "$PROJECT_ROOT/$file" ]; then
        record_issue "CRITICAL" "file_structure" "Required core file missing: $file"
    else
        if [ "$OUTPUT_MODE" = "detailed" ]; then
            record_issue "SUCCESS" "file_structure" "Found core file: $file"
        fi
    fi
done

# Check optional files - warnings unless --strict mode
for file in "${OPTIONAL_FILES[@]}"; do
    # Check if it's a directory (ends with /)
    if [[ "$file" == */ ]]; then
        if [ ! -d "$PROJECT_ROOT/$file" ]; then
            if [ "$STRICT_MODE" = true ]; then
                record_issue "CRITICAL" "file_structure" "Required directory missing (strict mode): $file"
            else
                record_issue "WARNING" "file_structure" "Optional directory missing: $file"
            fi
        else
            if [ "$OUTPUT_MODE" = "detailed" ]; then
                record_issue "SUCCESS" "file_structure" "Found: $file"
            fi
        fi
    else
        if [ ! -f "$PROJECT_ROOT/$file" ]; then
            if [ "$STRICT_MODE" = true ]; then
                record_issue "CRITICAL" "file_structure" "Required file missing (strict mode): $file"
            else
                record_issue "WARNING" "file_structure" "Optional file missing: $file"
            fi
        else
            if [ "$OUTPUT_MODE" = "detailed" ]; then
                record_issue "SUCCESS" "file_structure" "Found: $file"
            fi
        fi
    fi
done

# SECTION 10: Generate Fix Suggestions (if requested)
if [ "$FIX_SUGGESTIONS" = true ]; then
    print_header "10. AUTOMATED FIX SUGGESTIONS"
    
    if [ "$CRITICAL_ISSUES" -gt 0 ] || [ "$WARNINGS" -gt 0 ]; then
        echo -e "${YELLOW}${BOLD}Suggested Fixes:${NC}"
        echo ""
        
        if [ "$CRITICAL_ISSUES" -gt 0 ]; then
            echo -e "${RED}Critical Issues to Fix:${NC}"
            if check_capability "fix"; then
                echo "1. Run: ${CYAN}$SCRIPT_DIR/update_stats.sh --fix${NC} to auto-fix statistics"
            else
                echo "1. Run: ${CYAN}$SCRIPT_DIR/update_stats.sh --update-all${NC} to auto-fix statistics"
            fi
            echo "2. Run: ${CYAN}$SCRIPT_DIR/update_stats.sh --generate-index${NC} to regenerate TOOL_INDEX.md"
            echo "3. Check and fix any missing required files"
        fi
        
        if [ "$WARNINGS" -gt 0 ]; then
            echo -e "${YELLOW}Warnings to Address:${NC}"
            echo "1. Review and update tool metadata in TOOLS.md"
            echo "2. Install missing tools or update documentation"
            echo "3. Fix broken internal links and cross-references"
        fi
        
        echo ""
        echo -e "${GREEN}Recommended workflow:${NC}"
        if check_capability "fix"; then
            echo "1. ${CYAN}$SCRIPT_DIR/update_stats.sh --fix${NC}"
        else
            echo "1. ${CYAN}$SCRIPT_DIR/update_stats.sh --update-all${NC}"
        fi
        echo "2. ${CYAN}$SCRIPT_DIR/update_stats.sh --generate-index${NC}"
        echo "3. Review and manually fix remaining issues"
        echo "4. Re-run this validation suite to confirm fixes"
    else
        echo -e "${GREEN}No issues found that require fixes!${NC}"
    fi
fi

# SECTION 11: Summary Report
print_header "VALIDATION SUMMARY REPORT"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ "$JSON_OUTPUT" = true ]; then
    # Use jq if available to properly construct JSON
    if command -v jq &> /dev/null; then
        # Build fix suggestions array
        FIX_SUGGESTIONS_JSON='[]'
        if [ "$FIX_SUGGESTIONS" = true ] && ([ "$CRITICAL_ISSUES" -gt 0 ] || [ "$WARNINGS" -gt 0 ]); then
            if check_capability "fix"; then
                FIX_CMD="./scripts/update_stats.sh --fix"
            else
                FIX_CMD="./scripts/update_stats.sh --update-all"
            fi
            FIX_SUGGESTIONS_JSON=$(jq -n --arg fix_cmd "$FIX_CMD" '[
                {type: "command", description: "Auto-fix statistics", command: $fix_cmd},
                {type: "command", description: "Regenerate TOOL_INDEX.md", command: "./scripts/update_stats.sh --generate-index"},
                {type: "manual", description: "Review and fix remaining issues"},
                {type: "command", description: "Re-run validation", command: "./scripts/run_validation_suite.sh"}
            ]')
        fi
        
        # Determine status
        if [ "$CRITICAL_ISSUES" -gt 0 ]; then
            STATUS="failed"
            EXIT_CODE=2
        elif [ "$WARNINGS" -gt 0 ]; then
            STATUS="warning"
            EXIT_CODE=1
        else
            STATUS="passed"
            EXIT_CODE=0
        fi
        
        # Build complete JSON output using the SECTIONS_JSON array
        jq -n \
            --arg timestamp "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --arg total "$TOTAL_ISSUES" \
            --arg critical "$CRITICAL_ISSUES" \
            --arg warnings "$WARNINGS" \
            --arg info "$INFO_ITEMS" \
            --arg duration "$DURATION" \
            --arg status "$STATUS" \
            --argjson sections "$SECTIONS_JSON" \
            --argjson fix_suggestions "$FIX_SUGGESTIONS_JSON" '
            {
                timestamp: $timestamp,
                validation_results: {
                    sections: $sections,
                    fix_suggestions: $fix_suggestions,
                    summary: {
                        total_issues: ($total | tonumber),
                        critical_issues: ($critical | tonumber),
                        warnings: ($warnings | tonumber),
                        info_items: ($info | tonumber),
                        duration_seconds: ($duration | tonumber),
                        status: $status
                    }
                }
            }' || {
                # If jq fails, output a simple error JSON
                echo '{"error": "Failed to generate JSON output", "status": "error"}'
            }
    else
        # Fallback when jq is not available - output simple JSON
        echo '{'
        echo '  "warning": "jq not installed - JSON output limited",'
        echo '  "summary": {'
        echo '    "total_issues": '$TOTAL_ISSUES','
        echo '    "critical_issues": '$CRITICAL_ISSUES','
        echo '    "warnings": '$WARNINGS','
        echo '    "info_items": '$INFO_ITEMS','
        echo '    "duration_seconds": '$DURATION','
        if [ "$CRITICAL_ISSUES" -gt 0 ]; then
            echo '    "status": "failed"'
            EXIT_CODE=2
        elif [ "$WARNINGS" -gt 0 ]; then
            echo '    "status": "warning"'
            EXIT_CODE=1
        else
            echo '    "status": "passed"'
            EXIT_CODE=0
        fi
        echo '  }'
        echo '}'
    fi
else
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Issue counts with color coding
    echo -e "${BOLD}Issue Summary:${NC}"
    if [ "$CRITICAL_ISSUES" -gt 0 ]; then
        echo -e "  ${RED}● Critical Issues: $CRITICAL_ISSUES${NC}"
    else
        echo -e "  ${GREEN}● Critical Issues: 0${NC}"
    fi
    
    if [ "$WARNINGS" -gt 0 ]; then
        echo -e "  ${YELLOW}● Warnings: $WARNINGS${NC}"
    else
        echo -e "  ${GREEN}● Warnings: 0${NC}"
    fi
    
    echo -e "  ${CYAN}● Info Items: $INFO_ITEMS${NC}"
    echo -e "  ${BOLD}● Total Issues: $TOTAL_ISSUES${NC}"
    
    echo ""
    echo -e "${BOLD}Validation Status:${NC}"
    if [ "$CRITICAL_ISSUES" -gt 0 ]; then
        echo -e "  ${RED}${BOLD}✗ FAILED - Critical issues found${NC}"
        EXIT_CODE=2
    elif [ "$WARNINGS" -gt 0 ]; then
        echo -e "  ${YELLOW}${BOLD}⚠ PASSED WITH WARNINGS${NC}"
        EXIT_CODE=1
    else
        echo -e "  ${GREEN}${BOLD}✓ PASSED - All checks successful${NC}"
        EXIT_CODE=0
    fi
    
    echo ""
    echo -e "${CYAN}Validation completed in ${DURATION} seconds${NC}"
    echo -e "${CYAN}Finished at: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    
    # Provide next steps
    if [ "$CRITICAL_ISSUES" -gt 0 ] || [ "$WARNINGS" -gt 0 ]; then
        echo ""
        echo -e "${BOLD}Next Steps:${NC}"
        echo -e "  1. Review the issues identified above"
        echo -e "  2. Run with ${CYAN}--fix-suggestions${NC} for automated fix recommendations"
        echo -e "  3. Fix critical issues first, then warnings"
        echo -e "  4. Re-run validation to confirm all issues are resolved"
    fi
fi

# Exit with appropriate code
exit ${EXIT_CODE:-0}