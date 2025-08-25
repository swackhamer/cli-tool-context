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
OUTPUT_MODE="detailed"
FIX_SUGGESTIONS=false
JSON_OUTPUT=false
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
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --summary          Show brief overview of issues"
            echo "  --detailed         Show full diagnostic output (default)"
            echo "  --fix-suggestions  Include automated fix recommendations"
            echo "  --json            Output results in JSON format"
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

# JSON output structure
if [ "$JSON_OUTPUT" = true ]; then
    JSON_RESULTS='{"timestamp":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",'
    JSON_RESULTS+='"validation_results":{'
    JSON_SECTIONS='"sections":['
    FIRST_SECTION=true
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

# Helper function to record issues
record_issue() {
    local severity="$1"
    local category="$2"
    local message="$3"
    
    # Add to JSON structure if enabled
    if [ "$JSON_OUTPUT" = true ] && [ "$severity" != "SUCCESS" ]; then
        if [ "$FIRST_SECTION" = false ]; then
            JSON_SECTIONS+=','
        fi
        JSON_SECTIONS+='{"category":"'$category'","severity":"'$severity'","message":"'$(echo "$message" | sed 's/"/\\"/g')'"}'
        FIRST_SECTION=false
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
        # Auto-fix permissions with notice
        record_issue "WARNING" "script_permissions" "Script not executable: $script_path (fixing permissions)"
        chmod +x "$script_path"
        if [ -x "$script_path" ]; then
            record_issue "SUCCESS" "script_permissions" "Fixed permissions for: $(basename "$script_path")"
        else
            record_issue "CRITICAL" "script_permissions" "Failed to fix permissions for: $script_path"
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
fi

# SECTION 1: Check Script Availability
print_header "1. VALIDATION INFRASTRUCTURE CHECK"

REQUIRED_SCRIPTS=(
    "$SCRIPT_DIR/update_stats.sh"
    "$SCRIPT_DIR/verify_tools.sh"
    "$SCRIPT_DIR/check_plan_completion.sh"
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
    echo -e "${CYAN}Running: update_stats.sh --check-consistency${NC}"
fi

CONSISTENCY_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-consistency 2>&1 || true)
if echo "$CONSISTENCY_OUTPUT" | grep -q "ERROR\|WARNING"; then
    while IFS= read -r line; do
        if [[ "$line" =~ ERROR ]]; then
            record_issue "CRITICAL" "readme_consistency" "$line"
        elif [[ "$line" =~ WARNING ]]; then
            record_issue "WARNING" "readme_consistency" "$line"
        fi
    done <<< "$CONSISTENCY_OUTPUT"
else
    record_issue "SUCCESS" "readme_consistency" "README.md statistics are consistent"
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

LINKS_OUTPUT=$("$SCRIPT_DIR/update_stats.sh" --check-links 2>&1 || true)
if echo "$LINKS_OUTPUT" | grep -q "ERROR\|WARNING\|BROKEN"; then
    while IFS= read -r line; do
        if [[ "$line" =~ ERROR|BROKEN ]]; then
            record_issue "CRITICAL" "links" "$line"
        elif [[ "$line" =~ WARNING ]]; then
            record_issue "WARNING" "links" "$line"
        fi
    done <<< "$LINKS_OUTPUT"
else
    record_issue "SUCCESS" "links" "All internal links are valid"
fi

# SECTION 6: Tool Availability Check
print_header "6. TOOL AVAILABILITY VALIDATION"
print_subheader "Verifying documented tools are available on system"

if [ "$OUTPUT_MODE" = "detailed" ]; then
    echo -e "${CYAN}Running: verify_tools.sh --detailed${NC}"
fi

TOOLS_OUTPUT=$("$SCRIPT_DIR/verify_tools.sh" --detailed 2>&1 || true)
MISSING_TOOLS=$(echo "$TOOLS_OUTPUT" | grep -c "NOT FOUND" || true)
if [ "$MISSING_TOOLS" -gt 0 ]; then
    record_issue "WARNING" "tool_availability" "Found $MISSING_TOOLS tools not available on system"
    if [ "$OUTPUT_MODE" = "detailed" ]; then
        echo "$TOOLS_OUTPUT" | grep "NOT FOUND" | head -10
        if [ "$MISSING_TOOLS" -gt 10 ]; then
            echo "... and $((MISSING_TOOLS - 10)) more"
        fi
    fi
else
    record_issue "SUCCESS" "tool_availability" "All documented tools are available"
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
    record_issue "INFO" "plan_status" "Found $INCOMPLETE_TASKS incomplete tasks in TRAYCER_PLAN.md"
else
    record_issue "SUCCESS" "plan_status" "TRAYCER plan implementation is complete"
fi

# SECTION 8: Keywords and Synonyms Validation (optional)
if [ "$OUTPUT_MODE" = "detailed" ] || [[ "$@" == *"--check-keywords"* ]]; then
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

REQUIRED_FILES=(
    "README.md"
    "TOOLS.md"
    "TODO.md"
    "TRAYCER_PLAN.md"
    "docs/TOOL_INDEX.md"
    "docs/CHEATSHEET.md"
    "docs/MAINTENANCE.md"
    "docs/CLAUDE_GUIDE.md"
    "docs/FUTURE_TOOLS.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$PROJECT_ROOT/$file" ]; then
        record_issue "CRITICAL" "file_structure" "Required file missing: $file"
    else
        if [ "$OUTPUT_MODE" = "detailed" ]; then
            record_issue "SUCCESS" "file_structure" "Found: $file"
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
            echo "1. Run: ${CYAN}$SCRIPT_DIR/update_stats.sh --fix${NC} to auto-fix statistics"
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
        echo "1. ${CYAN}$SCRIPT_DIR/update_stats.sh --fix${NC}"
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
    # Complete JSON output with per-section details
    JSON_SECTIONS+=']'
    
    # Use jq if available to properly construct JSON
    if command -v jq &> /dev/null; then
        # Build fix suggestions array
        FIX_SUGGESTIONS_JSON='[]'
        if [ "$FIX_SUGGESTIONS" = true ] && ([ "$CRITICAL_ISSUES" -gt 0 ] || [ "$WARNINGS" -gt 0 ]); then
            FIX_SUGGESTIONS_JSON=$(jq -n '[
                {type: "command", description: "Auto-fix statistics", command: "./scripts/update_stats.sh --fix"},
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
        
        # Build complete JSON output
        echo "$JSON_SECTIONS" | jq -s \
            --arg timestamp "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --arg total "$TOTAL_ISSUES" \
            --arg critical "$CRITICAL_ISSUES" \
            --arg warnings "$WARNINGS" \
            --arg info "$INFO_ITEMS" \
            --arg duration "$DURATION" \
            --arg status "$STATUS" \
            --argjson fix_suggestions "$FIX_SUGGESTIONS_JSON" '
            {
                timestamp: $timestamp,
                validation_results: {
                    sections: .[0],
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
            }'
    else
        # Fallback to manual JSON construction
        JSON_RESULTS+=$JSON_SECTIONS','
        
        # Add fix suggestions if requested
        if [ "$FIX_SUGGESTIONS" = true ]; then
            JSON_RESULTS+='"fix_suggestions":['
            if [ "$CRITICAL_ISSUES" -gt 0 ] || [ "$WARNINGS" -gt 0 ]; then
                JSON_RESULTS+='{"type":"command","description":"Auto-fix statistics","command":"./scripts/update_stats.sh --fix"},'
                JSON_RESULTS+='{"type":"command","description":"Regenerate TOOL_INDEX.md","command":"./scripts/update_stats.sh --generate-index"},'
                JSON_RESULTS+='{"type":"manual","description":"Review and fix remaining issues"},'
                JSON_RESULTS+='{"type":"command","description":"Re-run validation","command":"./scripts/run_validation_suite.sh"}'
            fi
            JSON_RESULTS+='],'
        fi
        
        JSON_RESULTS+='"summary":{'
        JSON_RESULTS+='"total_issues":'$TOTAL_ISSUES','
        JSON_RESULTS+='"critical_issues":'$CRITICAL_ISSUES','
        JSON_RESULTS+='"warnings":'$WARNINGS','
        JSON_RESULTS+='"info_items":'$INFO_ITEMS','
        JSON_RESULTS+='"duration_seconds":'$DURATION','
        JSON_RESULTS+='"status":"'
        if [ "$CRITICAL_ISSUES" -gt 0 ]; then
            JSON_RESULTS+='failed"'
            EXIT_CODE=2
        elif [ "$WARNINGS" -gt 0 ]; then
            JSON_RESULTS+='warning"'
            EXIT_CODE=1
        else
            JSON_RESULTS+='passed"'
            EXIT_CODE=0
        fi
        JSON_RESULTS+='}}}'
        echo "$JSON_RESULTS"
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