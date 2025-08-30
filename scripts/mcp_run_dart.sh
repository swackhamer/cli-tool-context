#!/bin/bash
set -euo pipefail

# mcp_run_dart.sh - Execute Dart scripts via MCP server
# This wrapper invokes the connected Dart MCP server instead of direct Dart CLI

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
QUIET=false
VERBOSE=false

usage() {
    cat << EOF
🔗 MCP Dart Execution Wrapper

USAGE:
    $0 <dart_script> [dart_args...]

DESCRIPTION:
    Executes Dart scripts through the connected MCP server instead of direct CLI.
    This ensures proper integration with Dart's task management system.

ARGUMENTS:
    dart_script     Path to the Dart script to execute
    dart_args       Arguments to pass to the Dart script

ENVIRONMENT:
    MCP_ENDPOINT    MCP server endpoint (optional, uses default if not set)
    MCP_AUTH_TOKEN  Authentication token for MCP server (if required)

EXAMPLES:
    $0 dart_tools/bin/generate_site_data.dart --quiet
    $0 dart_tools/bin/generate_site_data.dart --stats-only

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

log_error() {
    echo -e "${RED}❌ $1${NC}" >&2
}

log_verbose() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${BLUE}🔍 $1${NC}" >&2
    fi
}

# Execute Dart script via MCP server
execute_via_mcp() {
    local dart_script="$1"
    shift
    local dart_args=("$@")
    
    log_verbose "Executing via MCP server: $dart_script ${dart_args[*]}"
    
    # Convert relative path to absolute
    if [[ ! "$dart_script" =~ ^/ ]]; then
        dart_script="$PROJECT_ROOT/$dart_script"
    fi
    
    if [[ ! -f "$dart_script" ]]; then
        log_error "Dart script not found: $dart_script"
        return 1
    fi
    
    log_verbose "Resolved script path: $dart_script"
    log_info "Executing Dart script via MCP server..."
    
    # Use Claude's MCP executeCode tool to run the Dart script
    # This is a placeholder approach - in a real implementation this would
    # use a dedicated MCP client or HTTP API calls to the MCP server
    
    # For now, we'll simulate MCP execution by creating a task and running the script
    local task_id="dart_exec_$(date +%s)"
    local task_title="Execute Dart script: $(basename "$dart_script")"
    local task_description="Running $(basename "$dart_script") with args: ${dart_args[*]}"
    
    log_verbose "Creating MCP task: $task_id"
    log_verbose "Task: $task_title"
    
    # In a real MCP setup, this would use the Dart MCP server's executeCode tool
    # to run the Dart script remotely and track progress
    
    # Since we need to actually execute the script, we'll use a hybrid approach:
    # 1. Log to MCP that we're starting
    # 2. Execute via Claude's tools if available
    # 3. Report results back to MCP
    
    report_progress "started" "Executing Dart script via MCP server: $(basename "$dart_script")"
    
    # Try to execute using Claude Code's MCP integration
    # This assumes Claude Code is running and has MCP server access
    if command -v claude >/dev/null 2>&1; then
        log_verbose "Using Claude Code MCP integration"
        if claude --mcp-execute-dart "$dart_script" "${dart_args[@]}" 2>/dev/null; then
            report_progress "completed" "Dart script execution successful via Claude MCP"
            log_success "Dart script execution completed successfully via MCP"
            return 0
        else
            log_verbose "Claude MCP execution failed, trying alternative approach"
        fi
    fi
    
    # Fallback: Use Node.js to call MCP server directly if available
    local mcp_client="$SCRIPT_DIR/mcp_dart_client.js"
    if [[ -f "$mcp_client" ]] && command -v node >/dev/null 2>&1; then
        log_verbose "Using Node.js MCP client"
        if node "$mcp_client" "$dart_script" "${dart_args[@]}"; then
            report_progress "completed" "Dart script execution successful via Node MCP client"
            log_success "Dart script execution completed successfully via MCP"
            return 0
        else
            log_verbose "Node.js MCP client failed"
        fi
    fi
    
    # If MCP execution fails, report error but don't fall back to direct execution
    log_error "MCP server execution failed - Dart MCP server may not be configured"
    log_error "Please ensure the Dart MCP server is running and accessible"
    log_error "This script requires MCP server integration, not direct Dart CLI access"
    
    report_progress "failed" "MCP server execution failed - server may not be configured"
    return 1
}

# Progress reporting to MCP (placeholder for future implementation)
report_progress() {
    local status="$1"
    local message="$2"
    
    log_verbose "MCP Progress: [$status] $message"
    
    # TODO: Implement actual MCP progress reporting
    # This could use curl to POST to MCP endpoints or use a Node.js client
    # For now, this is a placeholder that logs progress locally
}

# Main execution
main() {
    # Parse quiet/verbose from args first
    local filtered_args=()
    for arg in "$@"; do
        case "$arg" in
            -q|--quiet)
                QUIET=true
                filtered_args+=("$arg")
                ;;
            -v|--verbose)
                VERBOSE=true
                filtered_args+=("$arg")
                ;;
            *)
                filtered_args+=("$arg")
                ;;
        esac
    done
    
    # Check for help or no arguments
    if [[ $# -eq 0 ]] || [[ "${filtered_args[0]}" == "--help" ]] || [[ "${filtered_args[0]}" == "-h" ]]; then
        usage
        exit 0
    fi
    
    local dart_script="${filtered_args[0]}"
    local dart_args=("${filtered_args[@]:1}")
    
    log_verbose "MCP Dart Wrapper starting..."
    log_verbose "Script: $dart_script"
    log_verbose "Args: ${dart_args[*]}"
    
    # Report start to MCP
    report_progress "started" "Executing Dart script: $dart_script"
    
    # Execute the script
    if execute_via_mcp "$dart_script" "${dart_args[@]}"; then
        report_progress "completed" "Dart script execution successful"
        exit 0
    else
        local exit_code=$?
        report_progress "failed" "Dart script execution failed with exit code $exit_code"
        exit $exit_code
    fi
}

# Execute main function with all arguments
main "$@"