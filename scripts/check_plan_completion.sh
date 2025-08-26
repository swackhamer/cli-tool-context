#!/bin/bash

# check_plan_completion.sh - Verify MASTER_PLAN.md task completion status
# 
# Usage: ./scripts/check_plan_completion.sh [options]
# Options:
#   --verbose    Show detailed output for each task
#   --summary    Show only summary statistics
#   --help       Show this help message
#
# Exit codes:
#   0 - All required tasks are complete
#   1 - Some required tasks are incomplete
#   2 - Plan file (MASTER_PLAN.md) not found

# Comment 9: Removed set -e to avoid premature exits
# set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
# Support both new MASTER_PLAN.md and legacy TRAYCER_PLAN.md for compatibility
if [[ -f "$REPO_ROOT/MASTER_PLAN.md" ]]; then
    PLAN_FILE="$REPO_ROOT/MASTER_PLAN.md"
elif [[ -f "$REPO_ROOT/archive/TRAYCER_PLAN.md" ]]; then
    PLAN_FILE="$REPO_ROOT/archive/TRAYCER_PLAN.md"
else
    PLAN_FILE="$REPO_ROOT/TRAYCER_PLAN.md"  # Fallback for backwards compatibility
fi

# Options
VERBOSE=false
SUMMARY_ONLY=false
INCLUDE_SECTIONS=""  # Comment 9: Added include-sections option

# Statistics
TOTAL_TASKS=0
COMPLETED_TASKS=0
INCOMPLETE_TASKS=0
declare -a INCOMPLETE_TASK_LIST=()

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --verbose)
                VERBOSE=true
                shift
                ;;
            --summary)
                SUMMARY_ONLY=true
                shift
                ;;
            --include-sections)
                # Comment 9: Added option to specify additional sections
                INCLUDE_SECTIONS="$2"
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
    echo "check_plan_completion.sh - Verify MASTER_PLAN.md task completion status"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --verbose               Show detailed output for each task"
    echo "  --summary               Show only summary statistics"
    echo "  --include-sections SEC  Include additional sections (comma-separated)"
    echo "  --help                  Show this help message"
    echo ""
    echo "Exit codes:"
    echo "  0 - All required tasks are complete"
    echo "  1 - Some required tasks are incomplete"
    echo "  2 - Plan file (MASTER_PLAN.md) not found"
    echo ""
    echo "Examples:"
    echo "  $0                   # Check completion status"
    echo "  $0 --verbose        # Show all tasks with status"
    echo "  $0 --summary        # Show only statistics"
}

# Check if plan file exists
check_plan_file() {
    if [[ ! -f "$PLAN_FILE" ]]; then
        echo -e "${RED}Error: Plan file not found at $PLAN_FILE${NC}"
        echo -e "${YELLOW}Looking for MASTER_PLAN.md or archived TRAYCER_PLAN.md${NC}"
        exit 2
    fi
}

# Parse tasks from plan file
parse_tasks() {
    local in_implementation_section=false
    local in_future_section=false
    local in_included_section=false
    local line_num=0
    local current_section=""
    
    while IFS= read -r line; do
        ((line_num++))
        
        # Comment 9: Improved section detection
        # Check for section headers (## level)
        if [[ $line =~ ^##[[:space:]]+(.+) ]]; then
            current_section="${BASH_REMATCH[1]}"
            
            # Check if this is an included section
            in_included_section=false
            if [[ -n "$INCLUDE_SECTIONS" ]]; then
                IFS=',' read -ra sections <<< "$INCLUDE_SECTIONS"
                for section in "${sections[@]}"; do
                    if [[ "$current_section" =~ "$section" ]]; then
                        in_included_section=true
                        break
                    fi
                done
            fi
        fi
        
        # Check for Implementation Schedule section
        if [[ $line =~ "Implementation Schedule" ]] || [[ $line =~ "Implementation Tasks" ]] || [[ $line =~ "Immediate Actions" ]]; then
            in_implementation_section=true
            in_future_section=false
            continue
        fi
        
        # Check for Future Enhancements or Optional sections (exclude these)
        if [[ $line =~ "Future Enhancements" ]] || [[ $line =~ "Optional" ]] || [[ $line =~ "Nice to Have" ]]; then
            in_implementation_section=false
            in_future_section=true
            continue
        fi
        
        # Comment 9: Better end-of-section detection
        # Stop when encountering a header of equal or higher level (## or #)
        if [[ $line =~ ^#{1,2}[[:space:]] ]] && [[ $in_implementation_section == true ]]; then
            # Check if it's a subsection (###) or new section (## or #)
            if [[ ! $line =~ ^###[[:space:]] ]]; then
                # Only stop if not in an explicitly included section
                if [[ $in_included_section == false ]]; then
                    in_implementation_section=false
                fi
            fi
        fi
        
        # Skip if we're in future/optional sections
        if [[ $in_future_section == true ]]; then
            continue
        fi
        
        # Comment 9: Support more checklist syntax variants
        # Look for task items (- [ ], - [x], - [X], * [ ], * [x], * [X])
        if [[ $line =~ ^[[:space:]]*[-*][[:space:]]\[([ xX])\][[:space:]](.+) ]]; then
            local status="${BASH_REMATCH[1]}"
            local task="${BASH_REMATCH[2]}"
            
            ((TOTAL_TASKS++))
            
            if [[ $status == "x" ]] || [[ $status == "X" ]]; then
                ((COMPLETED_TASKS++))
                if [[ $VERBOSE == true ]]; then
                    echo -e "${GREEN}✓${NC} Line $line_num: $task"
                fi
            else
                ((INCOMPLETE_TASKS++))
                INCOMPLETE_TASK_LIST+=("Line $line_num: $task")
                if [[ $VERBOSE == true ]]; then
                    echo -e "${RED}✗${NC} Line $line_num: $task"
                fi
            fi
        fi
    done < "$PLAN_FILE"
}

# Generate report
generate_report() {
    if [[ $SUMMARY_ONLY == false ]]; then
        echo ""
        echo "========================================="
        echo "   Plan Completion Report"
        echo "   ($(basename "$PLAN_FILE"))"
        echo "========================================="
        echo ""
    fi
    
    echo -e "${BLUE}Summary Statistics:${NC}"
    echo "  Total Tasks: $TOTAL_TASKS"
    echo "  Completed: $COMPLETED_TASKS"
    echo "  Incomplete: $INCOMPLETE_TASKS"
    
    if [[ $TOTAL_TASKS -gt 0 ]]; then
        local completion_percentage=$((COMPLETED_TASKS * 100 / TOTAL_TASKS))
        echo "  Completion: ${completion_percentage}%"
        
        # Visual progress bar
        echo -n "  Progress: ["
        local bar_length=20
        local filled_length=$((completion_percentage * bar_length / 100))
        
        for ((i = 0; i < filled_length; i++)); do
            echo -n "="
        done
        for ((i = filled_length; i < bar_length; i++)); do
            echo -n " "
        done
        echo "] ${completion_percentage}%"
    fi
    
    echo ""
    
    # Show incomplete tasks if any
    if [[ $INCOMPLETE_TASKS -gt 0 ]] && [[ $SUMMARY_ONLY == false ]]; then
        echo -e "${YELLOW}Incomplete Tasks:${NC}"
        for task in "${INCOMPLETE_TASK_LIST[@]}"; do
            echo "  - $task"
        done
        echo ""
    fi
    
    # Recommendations
    if [[ $INCOMPLETE_TASKS -gt 0 ]]; then
        echo -e "${YELLOW}Recommendations:${NC}"
        echo "  1. Review incomplete tasks listed above"
        echo "  2. Update MASTER_PLAN.md as tasks are completed"
        echo "  3. Mark tasks with [x] when finished"
        echo ""
    fi
}

# Main execution
main() {
    parse_args "$@"
    
    if [[ $SUMMARY_ONLY == false ]] && [[ $VERBOSE == false ]]; then
        echo -e "${GREEN}Checking MASTER_PLAN.md Task Completion${NC}"
        echo "========================================="
    fi
    
    # Check if plan file exists
    check_plan_file
    
    # Parse tasks
    if [[ $VERBOSE == true ]]; then
        echo -e "${BLUE}Parsing tasks from $(basename "$PLAN_FILE")...${NC}"
        echo ""
    fi
    
    parse_tasks
    
    # Generate report
    generate_report
    
    # Exit with appropriate code
    if [[ $INCOMPLETE_TASKS -eq 0 ]]; then
        echo -e "${GREEN}✓ All required tasks are complete!${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠ ${INCOMPLETE_TASKS} task(s) remain incomplete${NC}"
        exit 1
    fi
}

# Run main function
main "$@"