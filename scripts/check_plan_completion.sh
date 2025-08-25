#!/bin/bash

# check_plan_completion.sh - Verify TRAYCER_PLAN.md task completion status
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
#   2 - TRAYCER_PLAN.md file not found

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
PLAN_FILE="$REPO_ROOT/TRAYCER_PLAN.md"

# Options
VERBOSE=false
SUMMARY_ONLY=false

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
    echo "check_plan_completion.sh - Verify TRAYCER_PLAN.md task completion status"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --verbose    Show detailed output for each task"
    echo "  --summary    Show only summary statistics"
    echo "  --help       Show this help message"
    echo ""
    echo "Exit codes:"
    echo "  0 - All required tasks are complete"
    echo "  1 - Some required tasks are incomplete"
    echo "  2 - TRAYCER_PLAN.md file not found"
    echo ""
    echo "Examples:"
    echo "  $0                   # Check completion status"
    echo "  $0 --verbose        # Show all tasks with status"
    echo "  $0 --summary        # Show only statistics"
}

# Check if TRAYCER_PLAN.md exists
check_plan_file() {
    if [[ ! -f "$PLAN_FILE" ]]; then
        echo -e "${RED}Error: TRAYCER_PLAN.md not found at $PLAN_FILE${NC}"
        exit 2
    fi
}

# Parse tasks from TRAYCER_PLAN.md
parse_tasks() {
    local in_implementation_section=false
    local in_future_section=false
    local line_num=0
    
    while IFS= read -r line; do
        ((line_num++))
        
        # Check for Implementation Schedule section
        if [[ $line =~ "Implementation Schedule" ]] || [[ $line =~ "Implementation Tasks" ]]; then
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
        
        # Check for end of relevant sections
        if [[ $line =~ ^#[[:space:]] ]] && [[ $in_implementation_section == true ]]; then
            # New major section, stop processing
            break
        fi
        
        # Skip if we're in future/optional sections
        if [[ $in_future_section == true ]]; then
            continue
        fi
        
        # Look for task items (- [ ] or - [x])
        if [[ $line =~ ^[[:space:]]*-[[:space:]]\[([ x])\][[:space:]](.+) ]]; then
            local status="${BASH_REMATCH[1]}"
            local task="${BASH_REMATCH[2]}"
            
            ((TOTAL_TASKS++))
            
            if [[ $status == "x" ]]; then
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
        echo "   TRAYCER_PLAN.md Completion Report"
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
        echo "  2. Update TRAYCER_PLAN.md as tasks are completed"
        echo "  3. Mark tasks with [x] when finished"
        echo ""
    fi
}

# Main execution
main() {
    parse_args "$@"
    
    if [[ $SUMMARY_ONLY == false ]] && [[ $VERBOSE == false ]]; then
        echo -e "${GREEN}Checking TRAYCER_PLAN.md Task Completion${NC}"
        echo "========================================="
    fi
    
    # Check if plan file exists
    check_plan_file
    
    # Parse tasks
    if [[ $VERBOSE == true ]]; then
        echo -e "${BLUE}Parsing tasks from TRAYCER_PLAN.md...${NC}"
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