#!/bin/bash

# validate_and_fix.sh - Comprehensive validation and fix script for MASTER_PLAN.md implementation
# This script orchestrates the complete Phase 1 cleanup process

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
LOG_FILE="$PROJECT_ROOT/validation_fix.log"
BACKUP_DIR="$PROJECT_ROOT/.backup_$(date +%Y%m%d_%H%M%S)"
FIX_MODE=false
VALIDATE_ONLY=false
ROLLBACK=false
VERBOSE=false
PHASE=1

# Statistics tracking
ISSUES_FOUND=0
ISSUES_FIXED=0
WARNINGS=0

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --fix)
            FIX_MODE=true
            shift
            ;;
        --validate)
            VALIDATE_ONLY=true
            shift
            ;;
        --rollback)
            ROLLBACK=true
            shift
            ;;
        --phase)
            PHASE="$2"
            shift 2
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --fix          Apply automatic fixes for detected issues"
            echo "  --validate     Validation only (no changes)"
            echo "  --rollback     Rollback to previous backup"
            echo "  --phase N      Run specific phase (1-4) from MASTER_PLAN.md"
            echo "  --verbose      Show detailed output"
            echo "  --help         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --validate               # Check for issues without fixing"
            echo "  $0 --fix                    # Apply automatic fixes"
            echo "  $0 --fix --phase 2          # Run Phase 2 fixes"
            echo "  $0 --rollback               # Restore from latest backup"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Initialize log file
init_log() {
    echo "=== Validation and Fix Script ===" > "$LOG_FILE"
    echo "Started at: $(date)" >> "$LOG_FILE"
    echo "Phase: $PHASE" >> "$LOG_FILE"
    echo "Fix Mode: $FIX_MODE" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
}

# Helper function to log messages
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    
    case "$level" in
        "ERROR")
            echo -e "${RED}✗ ERROR:${NC} $message"
            ((ISSUES_FOUND++))
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠ WARNING:${NC} $message"
            ((WARNINGS++))
            ;;
        "SUCCESS")
            echo -e "${GREEN}✓ SUCCESS:${NC} $message"
            ;;
        "INFO")
            if [[ $VERBOSE == true ]]; then
                echo -e "${CYAN}ℹ INFO:${NC} $message"
            fi
            ;;
        "FIXED")
            echo -e "${GREEN}✅ FIXED:${NC} $message"
            ((ISSUES_FIXED++))
            ;;
    esac
}

# Create backup of critical files
create_backup() {
    log_message "INFO" "Creating backup at $BACKUP_DIR"
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup critical files
    cp "$PROJECT_ROOT/README.md" "$BACKUP_DIR/" 2>/dev/null || true
    cp "$PROJECT_ROOT/TOOLS.md" "$BACKUP_DIR/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/docs" "$BACKUP_DIR/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/scripts" "$BACKUP_DIR/" 2>/dev/null || true
    
    log_message "SUCCESS" "Backup created successfully"
}

# Rollback to previous backup
perform_rollback() {
    # Find most recent backup
    local latest_backup=$(ls -dt "$PROJECT_ROOT"/.backup_* 2>/dev/null | head -1)
    
    if [[ -z "$latest_backup" ]]; then
        log_message "ERROR" "No backup found to rollback to"
        exit 1
    fi
    
    echo -e "${YELLOW}Rolling back to: $latest_backup${NC}"
    echo -e "${YELLOW}Warning: This will overwrite current files with backup versions${NC}"
    
    # Ask for confirmation
    read -p "Do you want to continue? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_message "INFO" "Rollback cancelled by user"
        exit 0
    fi
    
    # Log which files will be overwritten
    log_message "INFO" "Files to be restored from backup:"
    
    # Restore files and log each action
    if [[ -f "$latest_backup/README.md" ]]; then
        cp "$latest_backup/README.md" "$PROJECT_ROOT/"
        log_message "INFO" "Restored: README.md"
    fi
    
    if [[ -f "$latest_backup/TOOLS.md" ]]; then
        cp "$latest_backup/TOOLS.md" "$PROJECT_ROOT/"
        log_message "INFO" "Restored: TOOLS.md"
    fi
    
    if [[ -d "$latest_backup/docs" ]]; then
        # List files being restored
        for file in "$latest_backup/docs/"*; do
            if [[ -f "$file" ]]; then
                local basename=$(basename "$file")
                cp "$file" "$PROJECT_ROOT/docs/"
                log_message "INFO" "Restored: docs/$basename"
            fi
        done
    fi
    
    if [[ -d "$latest_backup/scripts" ]]; then
        # Selective restore with prompt for scripts directory
        echo -e "${YELLOW}Scripts directory contains active code. Review changes:${NC}"
        for file in "$latest_backup/scripts/"*; do
            if [[ -f "$file" ]]; then
                local basename=$(basename "$file")
                echo -e "  - $basename"
            fi
        done
        
        read -p "Restore scripts directory? [y/N] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            for file in "$latest_backup/scripts/"*; do
                if [[ -f "$file" ]]; then
                    local basename=$(basename "$file")
                    cp "$file" "$PROJECT_ROOT/scripts/"
                    log_message "INFO" "Restored: scripts/$basename"
                fi
            done
        else
            log_message "INFO" "Scripts directory restore skipped by user"
        fi
    fi
    
    log_message "SUCCESS" "Rollback completed successfully"
    exit 0
}

# Pre-flight checks
run_preflight_checks() {
    echo -e "${CYAN}${BOLD}Running pre-flight checks...${NC}"
    
    local all_good=true
    
    # Check for required scripts
    local required_scripts=(
        "$SCRIPT_DIR/update_stats.sh"
        "$SCRIPT_DIR/verify_tools.sh"
        "$SCRIPT_DIR/run_validation_suite.sh"
        "$SCRIPT_DIR/check_plan_completion.sh"
    )
    
    for script in "${required_scripts[@]}"; do
        if [[ ! -f "$script" ]]; then
            log_message "ERROR" "Required script not found: $script"
            all_good=false
        elif [[ ! -x "$script" ]]; then
            if [[ $FIX_MODE == true ]]; then
                chmod +x "$script"
                log_message "FIXED" "Made executable: $script"
            else
                log_message "WARNING" "Script not executable: $script"
            fi
        else
            log_message "SUCCESS" "Found: $(basename "$script")"
        fi
    done
    
    # Check for required files
    if [[ ! -f "$PROJECT_ROOT/TOOLS.md" ]]; then
        log_message "ERROR" "TOOLS.md not found"
        all_good=false
    fi
    
    if [[ ! -f "$PROJECT_ROOT/MASTER_PLAN.md" ]]; then
        log_message "WARNING" "MASTER_PLAN.md not found - some features may not work"
    fi
    
    if [[ $all_good == false ]]; then
        echo -e "${RED}Pre-flight checks failed. Please fix errors before continuing.${NC}"
        exit 1
    fi
    
    log_message "SUCCESS" "Pre-flight checks passed"
}

# Phase 1: Immediate Cleanup Tasks
run_phase1() {
    echo -e "${CYAN}${BOLD}Phase 1: Immediate Cleanup Tasks${NC}"
    
    # 1. Fix statistics inconsistencies
    echo -e "${BLUE}Checking statistics consistency...${NC}"
    
    # Run both verify-stats and validate-stats for comprehensive checking
    local stats_issues=false
    
    # Basic verification
    if "$SCRIPT_DIR/update_stats.sh" --verify-stats 2>&1 | grep -q "ERROR\|WARNING"; then
        log_message "WARNING" "Basic statistics inconsistencies found"
        stats_issues=true
    fi
    
    # Comprehensive validation
    if "$SCRIPT_DIR/update_stats.sh" --validate-stats 2>&1 | grep -q "ERROR\|WARNING"; then
        log_message "WARNING" "Comprehensive statistics validation issues found"
        stats_issues=true
    fi
    
    if [[ $stats_issues == true ]]; then
        if [[ $FIX_MODE == true ]]; then
            "$SCRIPT_DIR/update_stats.sh" --fix
            log_message "FIXED" "Statistics updated across all files"
        fi
    else
        log_message "SUCCESS" "Statistics are consistent"
    fi
    
    # 2. Check and fix file structure
    echo -e "${BLUE}Checking file structure compliance...${NC}"
    
    # Check for missing directories
    local required_dirs=("docs" "scripts" "archive")
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$PROJECT_ROOT/$dir" ]]; then
            log_message "WARNING" "Directory not found: $dir"
            if [[ $FIX_MODE == true ]]; then
                mkdir -p "$PROJECT_ROOT/$dir"
                log_message "FIXED" "Created directory: $dir"
            fi
        fi
    done
    
    # 3. Regenerate TOOL_INDEX.md if needed
    echo -e "${BLUE}Checking TOOL_INDEX.md...${NC}"
    if [[ ! -f "$PROJECT_ROOT/docs/TOOL_INDEX.md" ]] || [[ $(find "$PROJECT_ROOT/docs/TOOL_INDEX.md" -mtime +7 -print) ]]; then
        if [[ $FIX_MODE == true ]]; then
            "$SCRIPT_DIR/update_stats.sh" --generate-index
            log_message "FIXED" "Regenerated TOOL_INDEX.md"
        else
            log_message "WARNING" "TOOL_INDEX.md needs regeneration"
        fi
    else
        log_message "SUCCESS" "TOOL_INDEX.md is up to date"
    fi
    
    # 4. Validate internal links
    echo -e "${BLUE}Checking internal links...${NC}"
    local link_issues=$("$SCRIPT_DIR/update_stats.sh" --check-links 2>&1 | grep -c "BROKEN" || echo "0")
    if [[ $link_issues -gt 0 ]]; then
        log_message "WARNING" "Found $link_issues broken internal links"
    else
        log_message "SUCCESS" "All internal links are valid"
    fi
    
    # 5. Run comprehensive validation
    echo -e "${BLUE}Running comprehensive validation...${NC}"
    "$SCRIPT_DIR/run_validation_suite.sh" --summary 2>&1 | while read -r line; do
        if [[ $VERBOSE == true ]]; then
            echo "$line"
        fi
        echo "$line" >> "$LOG_FILE"
    done
}

# Phase 2: LLM Optimization
run_phase2() {
    echo -e "${CYAN}${BOLD}Phase 2: LLM Optimization${NC}"
    
    # Check metadata enhancement
    echo -e "${BLUE}Checking metadata blocks...${NC}"
    local metadata_issues=$("$SCRIPT_DIR/update_stats.sh" --check-metadata 2>&1 | grep -c "WARNING\|ERROR" || echo "0")
    
    if [[ $metadata_issues -gt 0 ]]; then
        log_message "WARNING" "Found $metadata_issues metadata issues"
        if [[ $FIX_MODE == true ]]; then
            log_message "INFO" "Metadata enhancement requires manual review - see MASTER_PLAN.md Phase 2"
        fi
    else
        log_message "SUCCESS" "Metadata blocks are properly formatted"
    fi
}

# Phase 3: Quality Enhancement
run_phase3() {
    echo -e "${CYAN}${BOLD}Phase 3: Quality Enhancement${NC}"
    
    # Check for difficulty ratings
    echo -e "${BLUE}Checking difficulty ratings...${NC}"
    local tools_without_difficulty=$(grep -c "^### \*\*" "$PROJECT_ROOT/TOOLS.md" || echo "0")
    local tools_with_difficulty=$(grep -c "difficulty:" "$PROJECT_ROOT/TOOLS.md" || echo "0")
    
    if [[ $tools_with_difficulty -lt $tools_without_difficulty ]]; then
        log_message "WARNING" "Some tools missing difficulty ratings"
    else
        log_message "SUCCESS" "All tools have difficulty ratings"
    fi
}

# Phase 4: Documentation Polish
run_phase4() {
    echo -e "${CYAN}${BOLD}Phase 4: Documentation Polish${NC}"
    
    # Check MASTER_PLAN.md completion
    echo -e "${BLUE}Checking MASTER_PLAN.md completion status...${NC}"
    if [[ -f "$SCRIPT_DIR/check_plan_completion.sh" ]]; then
        local completion=$("$SCRIPT_DIR/check_plan_completion.sh" 2>&1 | grep "completion" | grep -o "[0-9]*%" || echo "0%")
        log_message "INFO" "MASTER_PLAN.md completion: $completion"
    fi
}

# Generate summary report
generate_summary() {
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}           VALIDATION AND FIX SUMMARY REPORT            ${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""
    
    echo -e "${BOLD}Phase $PHASE Execution Complete${NC}"
    echo ""
    echo -e "${BOLD}Results:${NC}"
    echo -e "  Issues Found:    ${YELLOW}$ISSUES_FOUND${NC}"
    echo -e "  Issues Fixed:    ${GREEN}$ISSUES_FIXED${NC}"
    echo -e "  Warnings:        ${YELLOW}$WARNINGS${NC}"
    echo ""
    
    if [[ $FIX_MODE == true ]]; then
        echo -e "${GREEN}Automatic fixes have been applied.${NC}"
        echo -e "Backup created at: ${CYAN}$BACKUP_DIR${NC}"
    else
        if [[ $ISSUES_FOUND -gt 0 ]] || [[ $WARNINGS -gt 0 ]]; then
            echo -e "${YELLOW}To apply automatic fixes, run:${NC}"
            echo -e "  ${CYAN}$0 --fix${NC}"
        fi
    fi
    
    echo ""
    echo -e "Full log available at: ${CYAN}$LOG_FILE${NC}"
    echo ""
    
    # Set exit code based on issues
    if [[ $ISSUES_FOUND -gt $ISSUES_FIXED ]]; then
        echo -e "${YELLOW}Some issues require manual intervention.${NC}"
        exit 1
    else
        echo -e "${GREEN}All issues have been resolved!${NC}"
        exit 0
    fi
}

# Main execution
main() {
    init_log
    
    echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${CYAN}║     MASTER PLAN VALIDATION AND FIX SCRIPT          ║${NC}"
    echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if [[ $ROLLBACK == true ]]; then
        perform_rollback
    fi
    
    run_preflight_checks
    
    if [[ $FIX_MODE == true ]]; then
        create_backup
    fi
    
    # Run appropriate phase(s)
    case $PHASE in
        1)
            run_phase1
            ;;
        2)
            run_phase1
            run_phase2
            ;;
        3)
            run_phase1
            run_phase2
            run_phase3
            ;;
        4)
            run_phase1
            run_phase2
            run_phase3
            run_phase4
            ;;
        *)
            echo -e "${RED}Invalid phase: $PHASE${NC}"
            exit 1
            ;;
    esac
    
    generate_summary
}

# Run main function
main