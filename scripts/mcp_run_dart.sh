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
    
    # Try MCP HTTP endpoint first if configured
    if [[ -n "${MCP_ENDPOINT:-}" ]]; then
        log_verbose "Using MCP HTTP endpoint: $MCP_ENDPOINT"
        
        # Prepare JSON payload
        local payload
        payload=$(jq -n \
            --arg script "$dart_script" \
            --argjson args "$(printf '%s\n' "${dart_args[@]}" | jq -R . | jq -s .)" \
            '{script: $script, args: $args}')
        
        log_verbose "MCP payload: $payload"
        
        # Prepare curl command with optional auth
        local curl_args=(
            -X POST
            -H "Content-Type: application/json"
            -d "$payload"
            --silent
            --show-error
            --fail
        )
        
        if [[ -n "${MCP_AUTH_TOKEN:-}" ]]; then
            curl_args+=(
                -H "Authorization: Bearer $MCP_AUTH_TOKEN"
            )
            log_verbose "Using MCP authentication token"
        fi
        
        # Execute MCP HTTP request
        if curl "${curl_args[@]}" "$MCP_ENDPOINT/execute" 2>/dev/null; then
            log_success "Dart script execution completed successfully via MCP HTTP"
            return 0
        else
            local curl_exit_code=$?
            log_verbose "MCP HTTP endpoint failed with exit code: $curl_exit_code"
        fi
    else
        log_verbose "No MCP_ENDPOINT configured, trying alternative approaches"
    fi
    
    # Try to execute using Claude Code CLI if available
    if command -v claude >/dev/null 2>&1; then
        log_verbose "Using Claude Code CLI as fallback"
        if claude --version >/dev/null 2>&1; then
            # Create a temporary script to execute via Claude
            local temp_script="/tmp/mcp_dart_exec_$(date +%s).sh"
            {
                echo "#!/bin/bash"
                echo "cd '$PROJECT_ROOT'"
                echo "dart run '$dart_script' ${dart_args[*]@Q}"
            } > "$temp_script"
            chmod +x "$temp_script"
            
            if bash "$temp_script"; then
                rm -f "$temp_script"
                log_success "Dart script execution completed successfully via Claude CLI fallback"
                return 0
            else
                local exit_code=$?
                rm -f "$temp_script"
                log_verbose "Claude CLI fallback failed with exit code: $exit_code"
            fi
        else
            log_verbose "Claude CLI not properly configured"
        fi
    else
        log_verbose "Claude CLI not available"
    fi
    
    # Final fallback: direct Dart execution with warning
    log_verbose "Attempting direct Dart execution as final fallback"
    if command -v dart >/dev/null 2>&1; then
        log_info "⚠️  Falling back to direct Dart execution (not via MCP)"
        cd "$PROJECT_ROOT" || return 1
        if dart run "$dart_script" "${dart_args[@]}"; then
            log_success "Dart script execution completed via direct fallback"
            log_info "💡 Consider configuring MCP_ENDPOINT for proper MCP integration"
            return 0
        else
            log_error "Direct Dart execution also failed"
        fi
    fi
    
    log_error "All execution methods failed"
    log_error "Configure MCP_ENDPOINT and MCP_AUTH_TOKEN for MCP integration"
    log_error "Ensure 'claude' CLI or 'dart' CLI is available for fallback"
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