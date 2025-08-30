#!/bin/bash
# mcp_log.sh - MCP logging utility
# No-op implementation for local development

# Function to log MCP events
mcp_log() {
    local level="$1"
    local message="$2"
    local context="${3:-}"
    
    # For local development, just log to stdout
    echo "[MCP-LOG] [$level] $message${context:+ ($context)}" >&2
}

# Export the function if being sourced
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    export -f mcp_log
else
    # If run directly, execute the logging function with arguments
    mcp_log "$@"
fi