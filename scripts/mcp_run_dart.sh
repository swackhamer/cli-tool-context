#!/bin/bash
set -euo pipefail

# mcp_run_dart.sh - MCP-aware Dart script execution wrapper
# Tries MCP server integration first, falls back to direct Dart CLI execution

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" >&2
}

log_verbose() {
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo -e "${BLUE}🔍 $1${NC}" >&2
    fi
}

# Check if we have MCP integration available
has_mcp_integration() {
    # Check for MCP endpoint environment variable
    if [[ -n "${MCP_ENDPOINT:-}" ]]; then
        return 0
    fi
    
    # Check for Claude CLI with MCP support
    if command -v claude >/dev/null 2>&1; then
        # Try to see if claude has MCP capabilities
        if claude --help 2>/dev/null | grep -q "mcp\|server" >/dev/null 2>&1; then
            return 0
        fi
    fi
    
    return 1
}

# Execute via MCP (placeholder for future implementation)
execute_via_mcp() {
    local dart_script="$1"
    shift
    local dart_args=("$@")
    
    log_verbose "Attempting MCP server integration..."
    
    # For now, this is a placeholder. In a real implementation, this would
    # communicate with an MCP server to execute the Dart script.
    # Since MCP integration is not fully implemented yet, we'll fall back.
    
    if [[ -n "${MCP_ENDPOINT:-}" ]]; then
        log_warning "MCP_ENDPOINT is set but MCP integration not yet implemented"
    fi
    
    return 1  # Always fall back for now
}

# Execute directly via Dart CLI
execute_via_dart() {
    local dart_script="$1"
    shift
    local dart_args=("$@")
    
    log_verbose "Executing via direct Dart CLI: dart $dart_script ${dart_args[*]}"
    
    # Check if Dart CLI is available
    if ! command -v dart >/dev/null 2>&1; then
        echo "Error: Dart CLI not found. Please install Dart or configure MCP integration." >&2
        return 1
    fi
    
    # Execute the Dart script directly
    exec dart "$dart_script" "${dart_args[@]}"
}

# Main execution logic
main() {
    if [[ $# -lt 1 ]]; then
        echo "Usage: $0 <dart_script> [args...]" >&2
        echo "  Executes a Dart script via MCP server or falls back to direct execution" >&2
        return 1
    fi
    
    local dart_script="$1"
    shift
    local dart_args=("$@")
    
    # Check if the Dart script exists
    if [[ ! -f "$dart_script" ]]; then
        echo "Error: Dart script not found: $dart_script" >&2
        return 1
    fi
    
    # Try MCP integration first
    if has_mcp_integration; then
        log_verbose "MCP integration detected, attempting MCP execution..."
        if execute_via_mcp "$dart_script" "${dart_args[@]}"; then
            return 0
        fi
        log_warning "MCP execution failed, falling back to direct Dart CLI"
    else
        log_verbose "No MCP integration available, using direct Dart CLI"
    fi
    
    # Fall back to direct Dart execution
    execute_via_dart "$dart_script" "${dart_args[@]}"
}

# Execute main function with all arguments
main "$@"
