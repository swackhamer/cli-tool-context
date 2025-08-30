#!/bin/bash
set -euo pipefail

# generate_site_data_old.sh - Generate JSON data files for CLI tools website (OLD DART VERSION)
# This script executes the Dart data generation script and provides CLI interface

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
# NOTE: This script is deprecated and uses the old Dart implementation
# The new implementation uses Node.js + TypeScript in node_tools/
DART_SCRIPT="$PROJECT_ROOT/archive/dart_tools_deprecated/bin/generate_site_data.dart"

# Source shared library functions
source "$SCRIPT_DIR/lib.sh"

# Default options
QUIET=false
VERBOSE=false
MODE="full"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

usage() {
    cat << EOF
🌐 CLI Tools Website Data Generator (DEPRECATED - DART VERSION)

⚠️  WARNING: This script is DEPRECATED!
    Please use the new Node.js version: scripts/generate_site_data.sh

USAGE:
    $0 [options]

OPTIONS:
    -f, --full          Generate all data files (default)
    -s, --stats         Generate only stats.json
    -i, --incremental   Update only if source files changed
    -q, --quiet         Suppress non-error output
    -v, --verbose       Show detailed output
    -h, --help          Show this help message

DESCRIPTION:
    [DEPRECATED] Generates JSON data files for the CLI tools website by parsing TOOLS.md 
    and other documentation files. Uses the old Dart parsing infrastructure
    from archive/dart_tools_deprecated/ which is no longer maintained.

    ⚠️  This version is kept for reference only. The project has migrated to
    a Node.js + TypeScript implementation for better maintainability.

    Please use: scripts/generate_site_data.sh (Node.js version) instead.

    Requires Dart CLI to be installed and available in PATH. Generated files 
    are written to site/data/ directory.

MIGRATION:
    The new Node.js implementation provides the same functionality with:
    • Modern JavaScript/TypeScript stack
    • Better ecosystem and tooling
    • Easier maintenance and contribution
    • Same JSON output schemas and shell script interface

EOF
}

# Logging functions
log_info() {
    if [[ "$QUIET" != true ]]; then
        echo -e "${BLUE}ℹ️  $1${NC}" >&2
    fi
}

log_success() {
    if [[ "$QUIET" != true ]]; then
        echo -e "${GREEN}✅ $1${NC}" >&2
    fi
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" >&2
}

log_error() {
    echo -e "${RED}❌ $1${NC}" >&2
}

log_verbose() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${BLUE}🔍 $1${NC}" >&2
    fi
}


# Check if Dart CLI is available
check_dart() {
    log_verbose "Checking for Dart CLI..."
    
    if ! command -v dart >/dev/null 2>&1; then
        log_error "Dart CLI not found. Please install Dart:"
        log_error "  - macOS: brew install dart"
        log_error "  - Linux: https://dart.dev/get-dart"
        log_error "  - Windows: https://dart.dev/get-dart"
        return 1
    fi
    
    local dart_version
    dart_version=$(dart --version 2>&1 | head -1)
    log_verbose "Found Dart: $dart_version"
    
    return 0
}

# Check if source files exist
check_source_files() {
    log_verbose "Checking source files..."
    
    local missing_files=()
    
    if [[ ! -f "$PROJECT_ROOT/TOOLS.md" ]]; then
        missing_files+=("TOOLS.md")
    fi
    
    if [[ ! -f "$DART_SCRIPT" ]]; then
        missing_files+=("archive/dart_tools_deprecated/bin/generate_site_data.dart")
    fi
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        log_error "Missing required files:"
        for file in "${missing_files[@]}"; do
            log_error "  - $file"
        done
        return 1
    fi
    
    log_verbose "All source files present"
    return 0
}

# Check if incremental update is needed
needs_update() {
    local output_dir="$PROJECT_ROOT/site/data"
    
    # If output directory doesn't exist, we need to update
    if [[ ! -d "$output_dir" ]]; then
        log_verbose "Output directory doesn't exist, update needed"
        return 0
    fi
    
    # If any output file is missing, we need to update
    local output_files=("tools.json" "categories.json" "stats.json")
    for file in "${output_files[@]}"; do
        if [[ ! -f "$output_dir/$file" ]]; then
            log_verbose "Missing output file: $file, update needed"
            return 0
        fi
    done
    
    # Check if source files are newer than output files
    local tools_mtime cheatsheet_mtime output_mtime
    tools_mtime=$(get_mtime "$PROJECT_ROOT/TOOLS.md")
    
    # Check cheatsheet file if it exists
    local cheatsheet_file="$PROJECT_ROOT/docs/CHEATSHEET.md"
    if [[ -f "$cheatsheet_file" ]]; then
        cheatsheet_mtime=$(get_mtime "$cheatsheet_file")
    else
        cheatsheet_mtime=0
    fi
    
    # Find the oldest output file modification time
    output_mtime=999999999999
    for file in "${output_files[@]}"; do
        local file_mtime
        file_mtime=$(get_mtime "$output_dir/$file")
        if [[ $file_mtime -lt $output_mtime ]]; then
            output_mtime=$file_mtime
        fi
    done
    
    if [[ $tools_mtime -gt $output_mtime ]] || [[ $cheatsheet_mtime -gt $output_mtime ]]; then
        log_verbose "Source files newer than output files, update needed"
        return 0
    fi
    
    log_verbose "Output files are up to date"
    return 1
}

# Execute the Dart script directly
run_dart_generator() {
    log_verbose "Executing Dart data generation script..."
    
    local dart_args=()
    
    if [[ "$QUIET" == true ]]; then
        dart_args+=("--quiet")
    fi
    
    if [[ "$VERBOSE" == true ]]; then
        dart_args+=("--verbose")
    fi
    
    # Add stats-only mode if requested
    if [[ "$MODE" == "stats" ]]; then
        dart_args+=("--stats-only")
    fi
    
    # Add project root argument
    dart_args+=("--project-root=$PROJECT_ROOT")
    
    if [[ ${#dart_args[@]} -gt 0 ]]; then
        log_verbose "Running: dart $DART_SCRIPT ${dart_args[*]}"
    else
        log_verbose "Running: dart $DART_SCRIPT"
    fi
    
    # Execute the Dart script directly
    if dart "$DART_SCRIPT" "${dart_args[@]}"; then
        return 0
    else
        local exit_code=$?
        log_error "Dart script execution failed with exit code $exit_code"
        return $exit_code
    fi
}

# Validate generated output
validate_output() {
    log_verbose "Validating generated output..."
    
    local output_dir="$PROJECT_ROOT/site/data"
    local validation_errors=()
    
    # Check that all expected files exist
    local expected_files=("tools.json" "categories.json" "stats.json" "cheatsheet.json")
    for file in "${expected_files[@]}"; do
        local filepath="$output_dir/$file"
        if [[ ! -f "$filepath" ]]; then
            validation_errors+=("Missing file: $file")
        elif [[ ! -s "$filepath" ]]; then
            validation_errors+=("Empty file: $file")
        fi
    done
    
    # Basic JSON validation if jq is available
    if command_exists jq; then
        for file in "${expected_files[@]}"; do
            local filepath="$output_dir/$file"
            if [[ -f "$filepath" ]]; then
                if ! jq empty "$filepath" >/dev/null 2>&1; then
                    validation_errors+=("Invalid JSON: $file")
                fi
            fi
        done
    fi
    
    if [[ ${#validation_errors[@]} -gt 0 ]]; then
        log_error "Output validation failed:"
        for error in "${validation_errors[@]}"; do
            log_error "  - $error"
        done
        return 1
    fi
    
    log_verbose "Output validation passed"
    return 0
}

# MCP logging helper
mcp_log() {
    local event_type="$1"
    local message="$2"
    local task_id="${3:-site_data_gen_$(date +%s)}"
    
    local mcp_logger="$SCRIPT_DIR/mcp_log.sh"
    if [[ -f "$mcp_logger" && -x "$mcp_logger" ]]; then
        if [[ "$QUIET" == true ]]; then
            "$mcp_logger" "$event_type" "$message" "$task_id" --quiet 2>/dev/null || true
        elif [[ "$VERBOSE" == true ]]; then
            "$mcp_logger" "$event_type" "$message" "$task_id" --verbose || true
        else
            "$mcp_logger" "$event_type" "$message" "$task_id" || true
        fi
    fi
}

# Main execution function
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--full)
                MODE="full"
                shift
                ;;
            -s|--stats)
                MODE="stats"
                shift
                ;;
            -i|--incremental)
                MODE="incremental"
                shift
                ;;
            -q|--quiet)
                QUIET=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                echo
                usage
                exit 1
                ;;
        esac
    done
    
    # Show header and log start
    if [[ "$QUIET" != true ]]; then
        echo "🌐 CLI Tools Website Data Generator (DEPRECATED - DART VERSION)"
        echo "⚠️  WARNING: Please use scripts/generate_site_data.sh (Node.js version) instead"
        echo "📁 Project: $PROJECT_ROOT"
        echo "🎯 Mode: $MODE"
        echo
    fi
    
    # Log start event to MCP
    mcp_log "started" "Website data generation starting (mode: $MODE)"
    
    # Pre-flight checks
    log_info "Running pre-flight checks..."
    
    if ! check_dart; then
        exit 1
    fi
    
    if ! check_source_files; then
        exit 1
    fi
    
    # Handle incremental mode
    if [[ "$MODE" == "incremental" ]]; then
        if ! needs_update; then
            log_success "Data is up to date, no generation needed"
            exit 0
        fi
        log_info "Source files have changed, generating updated data..."
    fi
    
    # Generate data
    log_info "Generating website data..."
    mcp_log "progress" "Starting data generation process"
    
    if ! run_dart_generator; then
        log_error "Data generation failed"
        mcp_log "failed" "Data generation process failed"
        exit 1
    fi
    
    mcp_log "progress" "Data generation completed successfully"
    
    # Validate output
    if ! validate_output; then
        log_error "Output validation failed"
        mcp_log "failed" "Output validation failed"
        exit 1
    fi
    
    # Success
    log_success "Website data generation completed successfully"
    mcp_log "completed" "Website data generation completed successfully"
    
    if [[ "$QUIET" != true ]]; then
        local output_dir="$PROJECT_ROOT/site/data"
        echo
        echo "📊 Generated files:"
        for file in tools.json categories.json stats.json; do
            if [[ -f "$output_dir/$file" ]]; then
                local size
                if [[ "$(uname)" == "Darwin" ]]; then
                    size=$(stat -f%z "$output_dir/$file" 2>/dev/null || echo "0")
                else
                    size=$(stat -c%s "$output_dir/$file" 2>/dev/null || echo "0")
                fi
                
                # Convert bytes to human readable
                local human_size
                if [[ $size -gt 1048576 ]]; then
                    human_size="$(( size / 1048576 ))MB"
                elif [[ $size -gt 1024 ]]; then
                    human_size="$(( size / 1024 ))KB"
                else
                    human_size="${size}B"
                fi
                
                echo "  ✓ $file ($human_size)"
            fi
        done
        echo
        echo "🚀 Website data is ready for use!"
    fi
    
    exit 0
}

# Execute main function with all arguments
main "$@"