#!/bin/bash
set -euo pipefail

# generate_site_data.sh - Generate JSON data files for CLI tools website using Dart parser
# This script uses the Dart parsing infrastructure to generate website data

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

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
🌐 CLI Tools Website Data Generator (Dart Parser)

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
    Generates JSON data files for the CLI tools website by parsing TOOLS.md
    and other documentation files using the Dart parsing infrastructure.

    Requires Dart SDK to be installed and available in PATH.

    Generated files in site/data/:
    • tools.json       Complete tool database with enhanced metadata
    • categories.json   Category statistics and groupings  
    • stats.json        Overall statistics and metrics
    • cheatsheet.json   Cheatsheet content from docs/CHEATSHEET.md

EXAMPLES:
    $0                    # Generate all data files
    $0 --stats            # Generate only statistics
    $0 --quiet            # Silent mode (errors only)
    $0 --incremental      # Update only if needed

INTEGRATION:
    This script is designed to be called from update_stats.sh and other
    maintenance scripts. It requires Dart SDK installation.

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

# Check if output directory needs to be updated
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
    
    # For incremental mode, assume we need to update for now
    # In a real implementation, we could check Dart AI data timestamps
    log_verbose "Incremental update needed (Dart AI data may have changed)"
    return 0
}

# Generate website data using Dart parsing directly
generate_site_data() {
    log_verbose "Starting site data generation using Dart parser..."
    
    local output_dir="$PROJECT_ROOT/site/data"
    
    # Ensure output directory exists
    mkdir -p "$output_dir"
    
    # Check if Dart is available
    if ! command_exists dart; then
        log_error "Dart SDK not found in PATH. Please install Dart SDK or use --dry-run mode"
        return 1
    fi
    
    # Check if dart_tools directory exists
    local dart_tools_dir="$PROJECT_ROOT/dart_tools"
    if [[ ! -d "$dart_tools_dir" ]]; then
        log_error "dart_tools directory not found at $dart_tools_dir"
        return 1
    fi
    
    log_info "Generating website data via Dart parsing..."
    
    # Generate data using Dart parser
    local dart_args=()
    if [[ "$QUIET" == true ]]; then
        dart_args+=(--quiet)
    fi
    if [[ "$VERBOSE" == true ]]; then
        dart_args+=(--verbose)
    fi
    if [[ "$MODE" == "stats" ]]; then
        dart_args+=(--stats-only)
    fi
    dart_args+=("--project-root=$PROJECT_ROOT")
    
    log_verbose "Running: dart run $dart_tools_dir/bin/generate_site_data.dart ${dart_args[*]}"
    
    if ! (cd "$dart_tools_dir" && dart run bin/generate_site_data.dart "${dart_args[@]}"); then
        log_error "Dart parser execution failed"
        return 1
    fi
    
    return 0
}

# Validate generated output
validate_output() {
    log_verbose "Validating generated output..."
    
    local output_dir="$PROJECT_ROOT/site/data"
    local validation_errors=()
    
    # Check that expected files exist based on mode
    local expected_files=()
    if [[ "$MODE" == "stats" ]]; then
        expected_files=("stats.json")
    else
        expected_files=("tools.json" "categories.json" "stats.json" "cheatsheet.json")
    fi
    
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
    
    # Show header
    if [[ "$QUIET" != true ]]; then
        echo "🌐 CLI Tools Website Data Generator (Dart Parser)"
        echo "📁 Project: $PROJECT_ROOT"
        echo "🎯 Mode: $MODE"
        echo
    fi
    
    # Handle incremental mode
    if [[ "$MODE" == "incremental" ]]; then
        if ! needs_update; then
            log_success "Data is up to date, no generation needed"
            exit 0
        fi
        log_info "Data needs updating, generating fresh data..."
    fi
    
    # Generate data
    log_info "Generating website data via Dart parser..."
    
    if ! generate_site_data; then
        log_error "Data generation failed"
        exit 1
    fi
    
    # Validate output
    if ! validate_output; then
        log_error "Output validation failed"
        exit 1
    fi
    
    # Success
    log_success "Website data generation completed successfully"
    
    if [[ "$QUIET" != true ]]; then
        local output_dir="$PROJECT_ROOT/site/data"
        echo
        echo "📊 Generated files:"
        
        local files_to_check=()
        if [[ "$MODE" == "stats" ]]; then
            files_to_check=("stats.json")
        else
            files_to_check=("tools.json" "categories.json" "stats.json" "cheatsheet.json")
        fi
        
        for file in "${files_to_check[@]}"; do
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
        echo "💡 Generated using Dart parsing infrastructure"
    fi
    
    exit 0
}

# Execute main function with all arguments
main "$@"