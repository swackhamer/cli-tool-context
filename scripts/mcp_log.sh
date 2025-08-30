#!/bin/bash
set -euo pipefail

# mcp_log.sh - Log progress events to MCP server
# This script provides lightweight MCP task tracking for build processes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
QUIET=false
VERBOSE=false

# MCP Configuration - can be overridden by environment variables
MCP_ENDPOINT="${MCP_ENDPOINT:-http://localhost:3000/api/tasks}"
MCP_AUTH_TOKEN="${MCP_AUTH_TOKEN:-}"
MCP_PROJECT="${MCP_PROJECT:-cli-tool-context}"

usage() {
    cat << EOF
📝 MCP Progress Logging

USAGE:
    $0 <event_type> <message> [task_id] [options]

ARGUMENTS:
    event_type      Type of event: started, progress, completed, failed, error
    message         Human-readable message describing the event
    task_id         Optional task ID for tracking (generates UUID if not provided)

OPTIONS:
    -q, --quiet     Suppress local output (still logs to MCP)
    -v, --verbose   Show detailed logging information
    -h, --help      Show this help message

ENVIRONMENT VARIABLES:
    MCP_ENDPOINT    MCP server endpoint (default: http://localhost:3000/api/tasks)
    MCP_AUTH_TOKEN  Authentication token for MCP server
    MCP_PROJECT     Project identifier (default: cli-tool-context)

EXAMPLES:
    $0 started "Beginning site data generation"
    $0 progress "Parsed 150 tools" task_123
    $0 completed "Site data generation successful" task_123
    $0 failed "Build failed with errors" task_123 --verbose

DESCRIPTION:
    This script provides lightweight task tracking by posting events to an MCP
    server. It's designed to be called from other scripts to provide visibility
    into long-running processes and build automation.

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

# Generate a simple UUID-like identifier
generate_task_id() {
    local timestamp=$(date +%s)
    local random=$(openssl rand -hex 4 2>/dev/null || echo $(( RANDOM * RANDOM )))
    echo "task_${timestamp}_${random}"
}

# Post event to MCP server
post_to_mcp() {
    local event_type="$1"
    local message="$2"
    local task_id="$3"
    
    log_verbose "Posting to MCP: [$event_type] $message (task: $task_id)"
    
    # Create JSON payload
    local payload
    payload=$(cat << EOF
{
  "taskId": "$task_id",
  "eventType": "$event_type",
  "message": "$message",
  "project": "$MCP_PROJECT",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "source": "cli-tools-automation"
}
EOF
)
    
    log_verbose "JSON payload: $payload"
    
    # Try to post to MCP server
    # For now, we'll use a fallback approach since MCP integration is still being implemented
    if command -v curl >/dev/null 2>&1; then
        local curl_cmd="curl -s -X POST"
        
        if [[ -n "$MCP_AUTH_TOKEN" ]]; then
            curl_cmd="$curl_cmd -H \"Authorization: Bearer $MCP_AUTH_TOKEN\""
        fi
        
        curl_cmd="$curl_cmd -H \"Content-Type: application/json\" -d '$payload' '$MCP_ENDPOINT'"
        
        log_verbose "cURL command: $curl_cmd"
        
        # Execute curl and capture response
        local response
        local exit_code
        
        if response=$(eval "$curl_cmd" 2>&1); then
            exit_code=0
        else
            exit_code=$?
        fi
        
        if [[ $exit_code -eq 0 ]]; then
            log_verbose "MCP response: $response"
            log_success "Event logged to MCP server"
            return 0
        else
            log_verbose "cURL failed with exit code $exit_code: $response"
            log_error "Failed to post to MCP server (network/server issue)"
            
            # Fall back to local logging
            local log_file="$SCRIPT_DIR/../logs/mcp_events.log"
            mkdir -p "$(dirname "$log_file")"
            echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") [$event_type] $task_id: $message" >> "$log_file"
            log_verbose "Event logged locally to $log_file"
            return 1
        fi
    else
        log_verbose "curl not available, logging locally only"
        
        # Local logging fallback
        local log_file="$SCRIPT_DIR/../logs/mcp_events.log"
        mkdir -p "$(dirname "$log_file")"
        echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") [$event_type] $task_id: $message" >> "$log_file"
        log_info "Event logged locally (MCP unavailable)"
        return 0
    fi
}

# Validate event type
validate_event_type() {
    local event_type="$1"
    case "$event_type" in
        started|progress|completed|failed|error)
            return 0
            ;;
        *)
            log_error "Invalid event type: $event_type"
            log_error "Valid types: started, progress, completed, failed, error"
            return 1
            ;;
    esac
}

# Main execution
main() {
    # Parse command line arguments
    local event_type=""
    local message=""
    local task_id=""
    local args=()
    
    while [[ $# -gt 0 ]]; do
        case $1 in
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
            -*)
                log_error "Unknown option: $1"
                echo
                usage
                exit 1
                ;;
            *)
                args+=("$1")
                shift
                ;;
        esac
    done
    
    # Check required arguments
    if [[ ${#args[@]} -lt 2 ]]; then
        log_error "Missing required arguments"
        echo
        usage
        exit 1
    fi
    
    event_type="${args[0]}"
    message="${args[1]}"
    task_id="${args[2]:-$(generate_task_id)}"
    
    # Validate inputs
    if ! validate_event_type "$event_type"; then
        exit 1
    fi
    
    if [[ -z "$message" ]]; then
        log_error "Message cannot be empty"
        exit 1
    fi
    
    log_verbose "Event type: $event_type"
    log_verbose "Message: $message"
    log_verbose "Task ID: $task_id"
    log_verbose "MCP endpoint: $MCP_ENDPOINT"
    
    # Post to MCP
    if post_to_mcp "$event_type" "$message" "$task_id"; then
        exit 0
    else
        # Don't fail the script if MCP logging fails - it's not critical
        log_verbose "MCP logging failed, but continuing..."
        exit 0
    fi
}

# Execute main function with all arguments
main "$@"