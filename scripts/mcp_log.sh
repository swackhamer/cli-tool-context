#!/bin/bash
# MCP logging wrapper script
# Posts progress and log messages to the MCP server for tracking

set -euo pipefail

# Configuration
# Script name - kept for future use
# SCRIPT_NAME=$(basename "$0")
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

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
📝 MCP Logging Wrapper

USAGE:
    $0 [OPTIONS] <level> <message>
    $0 [OPTIONS] --status <status> <message>
    $0 [OPTIONS] --progress <percentage> <message>

DESCRIPTION:
    Logs messages and status updates to the MCP server for task tracking.

ARGUMENTS:
    level       Log level: debug, info, warn, error, success
    message     Log message to send
    status      Status update: started, running, completed, failed
    percentage  Progress percentage (0-100)

OPTIONS:
    --status        Send status update instead of log message
    --progress      Send progress update with percentage
    --quiet, -q     Suppress local output
    --verbose, -v   Show detailed output
    --help, -h      Show this help message

ENVIRONMENT:
    MCP_ENDPOINT    MCP server endpoint (optional)
    MCP_AUTH_TOKEN  Authentication token for MCP server (if required)
    PROJECT_ROOT    Project root directory

EXAMPLES:
    $0 info "Starting site data generation"
    $0 --status started "Dart script execution"
    $0 --progress 50 "Halfway through processing"
    $0 error "Failed to parse TOOLS.md"

EOF
}

# Logging functions
log_local() {
    local level="$1"
    local message="$2"
    local color=""
    local icon=""
    
    case "$level" in
        debug)   color="$NC"; icon="🔍" ;;
        info)    color="$BLUE"; icon="ℹ️" ;;
        warn)    color="$YELLOW"; icon="⚠️" ;;
        error)   color="$RED"; icon="❌" ;;
        success) color="$GREEN"; icon="✅" ;;
        *)       color="$NC"; icon="📝" ;;
    esac
    
    if [[ "$QUIET" != true ]]; then
        echo -e "${color}${icon} [$level] $message${NC}" >&2
    fi
}

log_verbose() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${BLUE}🔍 $1${NC}" >&2
    fi
}

# Send log to MCP server
send_to_mcp() {
    local type="$1"
    local data="$2"
    
    log_verbose "Sending to MCP: type=$type"
    log_verbose "MCP data: $data"
    
    # Try MCP HTTP endpoint if configured
    if [[ -n "${MCP_ENDPOINT:-}" ]]; then
        log_verbose "Using MCP HTTP endpoint: $MCP_ENDPOINT"
        
        # Prepare curl command
        local curl_args=(
            -X POST
            -H "Content-Type: application/json"
            -d "$data"
            --silent
            --show-error
            --connect-timeout 5
            --max-time 15
        )
        
        if [[ -n "${MCP_AUTH_TOKEN:-}" ]]; then
            curl_args+=(
                -H "Authorization: Bearer $MCP_AUTH_TOKEN"
            )
            log_verbose "Using MCP authentication token"
        fi
        
        # Determine endpoint based on type
        local endpoint="$MCP_ENDPOINT"
        case "$type" in
            log)      endpoint="$MCP_ENDPOINT/log" ;;
            status)   endpoint="$MCP_ENDPOINT/status" ;;
            progress) endpoint="$MCP_ENDPOINT/progress" ;;
        esac
        
        log_verbose "MCP endpoint: $endpoint"
        
        # Execute MCP HTTP request
        if curl "${curl_args[@]}" "$endpoint" 2>/dev/null; then
            log_verbose "Successfully sent to MCP server"
            return 0
        else
            local curl_exit_code=$?
            log_verbose "MCP HTTP request failed with exit code: $curl_exit_code"
        fi
    else
        log_verbose "No MCP_ENDPOINT configured, skipping MCP logging"
    fi
    
    # Try Claude CLI if available
    if command -v claude >/dev/null 2>&1; then
        log_verbose "Attempting to use Claude CLI for MCP logging"
        
        # Create a temporary log entry for Claude CLI
        local temp_log
        temp_log="/tmp/mcp_log_$(date +%s).json"
        echo "$data" > "$temp_log"
        
        # Try to send via Claude CLI (this is a placeholder approach)
        if claude mcp send --file "$temp_log" 2>/dev/null; then
            rm -f "$temp_log"
            log_verbose "Successfully logged via Claude CLI"
            return 0
        else
            rm -f "$temp_log"
            log_verbose "Claude CLI logging failed"
        fi
    else
        log_verbose "Claude CLI not available"
    fi
    
    # If MCP is not available, just log locally
    log_verbose "MCP not available, logging locally only"
    return 0
}

# Send log message
send_log() {
    local level="$1"
    local message="$2"
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    # Log locally first
    log_local "$level" "$message"
    
    # Prepare JSON payload
    local payload
    payload=$(jq -n \
        --arg level "$level" \
        --arg message "$message" \
        --arg timestamp "$timestamp" \
        --arg source "mcp_log.sh" \
        --arg project_root "$PROJECT_ROOT" \
        '{
            level: $level,
            message: $message,
            timestamp: $timestamp,
            source: $source,
            project_root: $project_root
        }')
    
    send_to_mcp "log" "$payload"
}

# Send status update
send_status() {
    local status="$1"
    local message="$2"
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    # Log locally
    log_local "info" "Status: $status - $message"
    
    # Prepare JSON payload
    local payload
    payload=$(jq -n \
        --arg status "$status" \
        --arg message "$message" \
        --arg timestamp "$timestamp" \
        --arg source "mcp_log.sh" \
        --arg project_root "$PROJECT_ROOT" \
        '{
            status: $status,
            message: $message,
            timestamp: $timestamp,
            source: $source,
            project_root: $project_root
        }')
    
    send_to_mcp "status" "$payload"
}

# Send progress update
send_progress() {
    local percentage="$1"
    local message="$2"
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    # Validate percentage
    if ! [[ "$percentage" =~ ^[0-9]+$ ]] || [[ "$percentage" -lt 0 ]] || [[ "$percentage" -gt 100 ]]; then
        log_local "error" "Invalid percentage: $percentage (must be 0-100)"
        return 1
    fi
    
    # Log locally
    log_local "info" "Progress: ${percentage}% - $message"
    
    # Prepare JSON payload
    local payload
    payload=$(jq -n \
        --arg percentage "$percentage" \
        --arg message "$message" \
        --arg timestamp "$timestamp" \
        --arg source "mcp_log.sh" \
        --arg project_root "$PROJECT_ROOT" \
        '{
            percentage: ($percentage | tonumber),
            message: $message,
            timestamp: $timestamp,
            source: $source,
            project_root: $project_root
        }')
    
    send_to_mcp "progress" "$payload"
}

# Main execution
main() {
    local mode="log"
    local level=""
    local status=""
    local percentage=""
    local message=""
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --status)
                mode="status"
                shift
                if [[ $# -gt 0 ]]; then
                    status="$1"
                    shift
                else
                    echo "Error: --status requires a status value" >&2
                    exit 1
                fi
                ;;
            --progress)
                mode="progress"
                shift
                if [[ $# -gt 0 ]]; then
                    percentage="$1"
                    shift
                else
                    echo "Error: --progress requires a percentage value" >&2
                    exit 1
                fi
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
            --)
                shift
                break
                ;;
            -*)
                echo "Error: Unknown option $1" >&2
                usage >&2
                exit 1
                ;;
            *)
                if [[ "$mode" == "log" ]] && [[ -z "$level" ]]; then
                    level="$1"
                elif [[ -z "$message" ]]; then
                    message="$1"
                else
                    message="$message $1"
                fi
                shift
                ;;
        esac
    done
    
    # Add any remaining arguments to message
    if [[ $# -gt 0 ]]; then
        if [[ -n "$message" ]]; then
            message="$message $*"
        else
            message="$*"
        fi
    fi
    
    # Validate arguments
    case "$mode" in
        log)
            if [[ -z "$level" ]] || [[ -z "$message" ]]; then
                echo "Error: log mode requires level and message" >&2
                usage >&2
                exit 1
            fi
            send_log "$level" "$message"
            ;;
        status)
            if [[ -z "$status" ]] || [[ -z "$message" ]]; then
                echo "Error: status mode requires status and message" >&2
                usage >&2
                exit 1
            fi
            send_status "$status" "$message"
            ;;
        progress)
            if [[ -z "$percentage" ]] || [[ -z "$message" ]]; then
                echo "Error: progress mode requires percentage and message" >&2
                usage >&2
                exit 1
            fi
            send_progress "$percentage" "$message"
            ;;
    esac
}

# Execute main function with all arguments
main "$@"