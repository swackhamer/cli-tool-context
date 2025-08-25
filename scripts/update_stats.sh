#!/bin/bash

# update_stats.sh - Update repository statistics and ensure consistency
# Usage: ./scripts/update_stats.sh [options]
# Options:
#   --report-only     Generate report without updating files
#   --check-consistency  Check for inconsistencies only
#   --update FILE     Update specific file
#   --full-report     Generate comprehensive report
#   --help           Show this help message

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
TOOLS_FILE="$REPO_ROOT/TOOLS.md"
README_FILE="$REPO_ROOT/README.md"
TODO_FILE="$REPO_ROOT/TODO.md"

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

# Statistics variables
TOTAL_TOOLS=0
TOTAL_CATEGORIES=0
TOTAL_LINES=0
TOOLS_BY_CATEGORY=""
DIFFICULTY_DISTRIBUTION=""

# Tracking arrays for issues
declare -a BROKEN_LINKS=()
declare -a FORMAT_ISSUES=()
LINK_COUNT=0
BROKEN_LINK_COUNT=0
FORMAT_ISSUE_COUNT=0

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
    echo "  --full-report        Generate comprehensive report"
    echo "  --generate-index     Generate comprehensive tool index"
    echo "  --check-keywords     Check keywords and synonyms in metadata"
    echo "  --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                           # Update all statistics"
    echo "  $0 --report-only            # Generate report only"
    echo "  $0 --check-consistency      # Check all consistency issues"
    echo "  $0 --check-links           # Check internal links only"
    echo "  $0 --check-format          # Check format consistency only"
    echo "  $0 --check-metadata        # Check metadata headers only"
    echo "  $0 --update README.md       # Update specific file"
    echo "  $0 --full-report           # Generate detailed report"
}

# Count tools in TOOLS.md
count_tools() {
    echo -e "${BLUE}Counting tools in TOOLS.md...${NC}"
    
    # Count tool entries (lines starting with ### **)
    TOTAL_TOOLS=$(grep -c "^### \*\*" "$TOOLS_FILE" || echo "0")
    
    # Count total lines
    TOTAL_LINES=$(wc -l < "$TOOLS_FILE")
    
    # Count categories (lines starting with ##)
    TOTAL_CATEGORIES=$(grep -c "^## " "$TOOLS_FILE" || echo "0")
    
    echo -e "${GREEN}Found $TOTAL_TOOLS tools across $TOTAL_CATEGORIES categories${NC}"
    echo -e "${GREEN}Total lines: $TOTAL_LINES${NC}"
}

# Analyze tools by category
analyze_categories() {
    echo -e "${BLUE}Analyzing tools by category...${NC}"
    
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
    echo -e "${BLUE}Analyzing difficulty ratings...${NC}"
    
    local beginner=$(grep -c "⭐⭐[^⭐]" "$TOOLS_FILE" || echo "0")
    local intermediate=$(grep -c "⭐⭐⭐[^⭐]" "$TOOLS_FILE" || echo "0")
    local advanced=$(grep -c "⭐⭐⭐⭐[^⭐]" "$TOOLS_FILE" || echo "0")
    local expert=$(grep -c "⭐⭐⭐⭐⭐" "$TOOLS_FILE" || echo "0")
    
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
        elif [[ $line =~ ^##\ [A-Z] ]]; then
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

# Parse metadata from HTML comment block
parse_metadata() {
    local metadata_block="$1"
    local field="$2"
    
    echo "$metadata_block" | grep "^$field:" | sed "s/^$field: *//"
}

# Check metadata consistency in TOOLS.md
check_metadata_consistency() {
    echo -e "${BLUE}Checking metadata consistency in TOOLS.md...${NC}"
    
    local issues_found=false
    local metadata_issues=()
    local metadata_issue_count=0
    local tools_with_metadata=0
    local tools_without_metadata=0
    
    # Get all tool names for cross-reference validation
    local all_tools=$(grep "^### \*\*" "$TOOLS_FILE" | sed 's/### \*\*\([^*]*\)\*\*.*/\1/' | tr '[:upper:]' '[:lower:]')
    
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
                    
                    # Check keywords and synonyms if CHECK_KEYWORDS is enabled
                    if [[ $CHECK_KEYWORDS == true ]]; then
                        if [[ -z $keywords ]]; then
                            metadata_issues+=("Tool '$current_tool' metadata missing keywords field")
                            ((metadata_issue_count++))
                            issues_found=true
                        elif [[ $keywords =~ [,] ]]; then
                            metadata_issues+=("Tool '$current_tool' keywords should be space-separated, not comma-separated")
                            ((metadata_issue_count++))
                            issues_found=true
                        fi
                        
                        if [[ -z $synonyms ]]; then
                            metadata_issues+=("Tool '$current_tool' metadata missing synonyms field")
                            ((metadata_issue_count++))
                            issues_found=true
                        elif [[ ! $synonyms =~ , ]] && [[ $(echo "$synonyms" | wc -w) -gt 1 ]]; then
                            metadata_issues+=("Tool '$current_tool' synonyms should be comma-separated")
                            ((metadata_issue_count++))
                            issues_found=true
                        fi
                    fi
                    
                    # Validate related tools exist
                    if [[ -n $related ]]; then
                        IFS=',' read -ra related_tools <<< "$related"
                        for tool in "${related_tools[@]}"; do
                            tool=$(echo "$tool" | xargs | tr '[:upper:]' '[:lower:]')
                            if [[ -n $tool ]] && ! echo "$all_tools" | grep -qi "^$tool$"; then
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
        if [[ $line =~ ^##\ [A-Z] ]]; then
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

# Check for consistency issues
check_consistency() {
    echo -e "${BLUE}Checking for consistency issues...${NC}"
    
    local issues_found=false
    
    # Check README.md for tool count
    local readme_count=$(grep -oE "[0-9]+\+ (essential |)?(CLI )?tools" "$README_FILE" | head -1 | grep -oE "[0-9]+" || echo "0")
    
    if [[ $readme_count -ne $TOTAL_TOOLS ]]; then
        echo -e "${YELLOW}Warning: README.md shows $readme_count tools but TOOLS.md has $TOTAL_TOOLS${NC}"
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
        echo -e "${YELLOW}Warning: Tools without difficulty ratings:${NC}"
        echo "$tools_without_rating"
        issues_found=true
    fi
    
    # Check for duplicate tools
    local duplicates=$(grep "^### \*\*" "$TOOLS_FILE" | sort | uniq -d)
    
    if [[ -n $duplicates ]]; then
        echo -e "${YELLOW}Warning: Duplicate tool entries found:${NC}"
        echo "$duplicates"
        issues_found=true
    fi
    
    if [[ $issues_found == false ]]; then
        echo -e "${GREEN}No basic consistency issues found!${NC}"
    fi
    
    return $([ "$issues_found" = true ] && echo 1 || echo 0)
}

# Validate internal links in markdown files
validate_links() {
    echo -e "${BLUE}Validating internal links...${NC}"
    
    local issues_found=false
    BROKEN_LINKS=()
    LINK_COUNT=0
    BROKEN_LINK_COUNT=0
    
    # Find all markdown files, excluding .git and node_modules directories
    while IFS= read -r -d '' file; do
        # Process links using process substitution to avoid subshell
        while IFS= read -r link; do
            # Skip external links (http://, https://, mailto:)
            if [[ $link =~ ^(https?://|mailto:) ]]; then
                continue
            fi
            
            # Skip anchor links
            if [[ $link =~ ^# ]]; then
                continue
            fi
            
            ((LINK_COUNT++))
            
            # Remove anchor from link if present
            local clean_link=$(echo "$link" | sed 's/#.*//')
            
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
            
            # Normalize path
            if [[ -d "$(dirname "$target_path")" ]]; then
                target_path="$(cd "$(dirname "$target_path")" 2>/dev/null && pwd)/$(basename "$target_path")"
            fi
            
            # Check if target exists
            if [[ ! -f "$target_path" ]] && [[ ! -d "$target_path" ]]; then
                # Compute relative path without realpath for macOS compatibility
                local relative_file="${file#$REPO_ROOT/}"
                BROKEN_LINKS+=("$relative_file: $link")
                ((BROKEN_LINK_COUNT++))
                issues_found=true
            fi
        done < <(grep -oE '\[([^\]]+)\]\(([^)]*(\([^)]*\)[^)]*)*)\)' "$file" | sed -E 's/\[([^\]]+)\]\(([^)]*(\([^)]*\)[^)]*)*)\)/\2/g')
    done < <(find "$REPO_ROOT" -name "*.md" -type f -not -path "*/.git/*" -not -path "*/node_modules/*" -print0)
    
    if [[ ${#BROKEN_LINKS[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Warning: Found $BROKEN_LINK_COUNT broken internal links:${NC}"
        for broken_link in "${BROKEN_LINKS[@]}"; do
            echo "  - $broken_link"
        done
    else
        echo -e "${GREEN}All $LINK_COUNT internal links are valid!${NC}"
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
    
    # Remove backup file
    rm -f "${README_FILE}.bak"
    
    echo -e "${GREEN}README.md updated successfully${NC}"
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

# Generate comprehensive tool index
generate_tool_index() {
    echo -e "${BLUE}Generating comprehensive tool index...${NC}"
    
    local index_file="$REPO_ROOT/docs/TOOL_INDEX.md"
    
    # Create docs directory if it doesn't exist
    mkdir -p "$REPO_ROOT/docs"
    
    # Create temporary files for storing tool data
    local tmp_dir=$(mktemp -d)
    local tool_data_file="$tmp_dir/tool_data.txt"
    
    # Parse TOOLS.md and store tool data in a structured format
    local current_category=""
    local current_tool=""
    local in_metadata=false
    local metadata_block=""
    local capturing_description=false
    local description=""
    local line_num=0
    
    while IFS= read -r line; do
        ((line_num++))
        
        # Check for category header
        if [[ $line =~ ^##[[:space:]]+(.+) ]]; then
            current_category="${BASH_REMATCH[1]}"
        # Check for tool entry
        elif [[ $line =~ ^###[[:space:]]\*\*([^*]+)\*\* ]]; then
            current_tool="${BASH_REMATCH[1]}"
            in_metadata=false
            metadata_block=""
            capturing_description=false
            description=""
        # Check for metadata block
        elif [[ $line == "<!-- meta" ]]; then
            in_metadata=true
            metadata_block=""
        elif [[ $in_metadata == true ]]; then
            metadata_block="$metadata_block$line
"
            if [[ $line == "-->" ]]; then
                in_metadata=false
                # Parse metadata and save tool data
                local difficulty=$(echo "$metadata_block" | grep "^difficulty:" | sed 's/^difficulty: *//')
                local keywords=$(echo "$metadata_block" | grep "^keywords:" | sed 's/^keywords: *//')
                local synonyms=$(echo "$metadata_block" | grep "^synonyms:" | sed 's/^synonyms: *//')
                
                # Save tool data (will get description later)
                echo "TOOL|$current_tool|$current_category|$difficulty|$keywords|$synonyms|PENDING_DESC" >> "$tool_data_file"
            fi
        # Capture description
        elif [[ $line =~ \*\*Description\*\* ]]; then
            capturing_description=true
            description=""
        elif [[ $capturing_description == true ]]; then
            if [[ $line =~ ^(\*\*|###|##) ]] || [[ -z $line ]]; then
                # End of description - update the tool data
                capturing_description=false
                description=$(echo "$description" | xargs | head -c 100)
                # Update the last tool entry with description
                if [[ -n $current_tool ]] && [[ -n $description ]]; then
                    # Use a different approach - rewrite the file
                    local tmp_file="${tool_data_file}.tmp"
                    while IFS= read -r line; do
                        if [[ $line =~ \|${current_tool}\|.*\|PENDING_DESC$ ]]; then
                            echo "${line%PENDING_DESC}${description}" >> "$tmp_file"
                        else
                            echo "$line" >> "$tmp_file"
                        fi
                    done < "$tool_data_file"
                    mv "$tmp_file" "$tool_data_file"
                fi
            else
                description="$description $line"
            fi
        fi
    done < "$TOOLS_FILE"
    
    # Generate index file
    cat > "$index_file" << 'EOF'
# CLI Tool Index

A comprehensive index of all CLI tools documented in this repository. Use this index to quickly find tools by name, category, or difficulty level.

**Quick Stats:**
EOF
    
    local total_tools=$(grep -c "^TOOL|" "$tool_data_file" || echo "0")
    local total_categories=$(cut -d'|' -f3 "$tool_data_file" | sort -u | wc -l | xargs)
    
    echo "- Total Tools: $total_tools" >> "$index_file"
    echo "- Categories: $total_categories" >> "$index_file"
    echo "- Last Updated: $(date '+%Y-%m-%d %H:%M:%S')" >> "$index_file"
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
            
            # Create anchor link (convert to lowercase and replace spaces with hyphens)
            local anchor=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
            
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
                    local anchor=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
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
                            local anchor=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
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
    
    echo -e "${GREEN}Tool index generated successfully at $index_file${NC}"
}

# Main execution
main() {
    parse_args "$@"
    
    echo -e "${GREEN}CLI Tools Repository Statistics Updater${NC}"
    echo "========================================="
    echo ""
    
    # Verify TOOLS.md exists
    if [[ ! -f "$TOOLS_FILE" ]]; then
        echo -e "${RED}Error: TOOLS.md not found at $TOOLS_FILE${NC}"
        exit 1
    fi
    
    # Gather statistics
    count_tools
    analyze_categories
    analyze_difficulty
    
    # Perform requested operations
    local consistency_result=0
    local link_result=0
    local format_result=0
    local metadata_result=0
    
    if [[ $CHECK_CONSISTENCY == true ]]; then
        set +e  # Disable exit on error temporarily
        check_consistency
        consistency_result=$?
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
        if [[ $UPDATE_FILE == "README.md" ]]; then
            update_readme
        else
            echo -e "${YELLOW}Update for $UPDATE_FILE not implemented yet${NC}"
        fi
    elif [[ $REPORT_ONLY == false ]] && [[ $CHECK_CONSISTENCY == false ]] && [[ $CHECK_LINKS == false ]] && [[ $CHECK_FORMAT == false ]] && [[ $CHECK_METADATA == false ]] && [[ $GENERATE_INDEX == false ]] && [[ $CHECK_KEYWORDS == false ]]; then
        # Default: update all files
        update_readme
    fi
    
    # Generate report
    generate_report
    
    if [[ $FULL_REPORT == true ]]; then
        generate_csv_report
    fi
    
    echo "========================================="
    if [[ ${exit_code:-0} -eq 0 ]]; then
        echo -e "${GREEN}Statistics update complete!${NC}"
    else
        echo -e "${YELLOW}Statistics update complete with warnings${NC}"
        exit ${exit_code:-0}
    fi
}

# Run main function
main "$@"