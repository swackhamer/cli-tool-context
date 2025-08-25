#!/bin/bash

# CLI Tools Installation Verification Script
# This script checks which documented tools are installed on your system

# Current category for tracking
current_category=""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
installed=0
missing=0
total=0
with_version=0

# Output format flags
DETAILED=false
JSON_OUTPUT=false

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --detailed)
            DETAILED=true
            shift
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --detailed   Show version information for installed tools"
            echo "  --json       Output results in JSON format"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check for jq if JSON output is requested
if [ "$JSON_OUTPUT" = true ]; then
    if ! command -v jq &> /dev/null; then
        echo "Error: jq is required for JSON output mode but is not installed." >&2
        echo "Please install jq first: brew install jq" >&2
        exit 1
    fi
fi

# Only show header for non-JSON output
if [ "$JSON_OUTPUT" = false ]; then
    echo "=========================================="
    echo "CLI Tools Installation Verification"
    if [ "$DETAILED" = true ]; then
        echo "(Detailed mode - showing versions)"
    fi
    echo "=========================================="
    echo ""
fi

# Version commands (using a function for compatibility)
get_version_cmd() {
    local tool=$1
    case $tool in
        npm) echo "-v" ;;
        node) echo "--version" ;;
        python3) echo "--version" ;;
        git) echo "--version" ;;
        curl) echo "--version" ;;
        wget) echo "--version" ;;
        ssh) echo "-V" ;;
        scp) echo "-V" ;;
        ping) echo "-V" ;;
        tar) echo "--version" ;;
        zip) echo "-v" ;;
        unzip) echo "-v" ;;
        *) echo "--version" ;;
    esac
}

# JSON data accumulator (we'll build JSON in one pass at the end)
json_data=""

# Function to run command with timeout (macOS compatibility)
run_with_timeout() {
    local timeout_duration="$1"
    shift
    
    # Check for timeout command (GNU coreutils)
    if command -v timeout &> /dev/null; then
        timeout "$timeout_duration" "$@" 2>&1
    # Check for gtimeout (GNU coreutils on macOS via Homebrew)
    elif command -v gtimeout &> /dev/null; then
        gtimeout "$timeout_duration" "$@" 2>&1
    # Try Python fallback for timeout
    elif command -v python3 &> /dev/null; then
        python3 -c "
import subprocess
import sys
try:
    result = subprocess.run(sys.argv[2:], capture_output=True, text=True, timeout=float(sys.argv[1]))
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr)
    sys.exit(result.returncode)
except subprocess.TimeoutExpired:
    sys.exit(124)  # Standard timeout exit code
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
" "$timeout_duration" "$@" 2>&1
    else
        # No timeout available, warn and run directly
        echo "Warning: No timeout mechanism available (install coreutils or python3)" >&2
        "$@" 2>&1
    fi
}

# Function to get tool version
get_tool_version() {
    local tool=$1
    local version_cmd=$(get_version_cmd "$tool")
    local version=""
    
    # Special case for scp - use ssh -V instead
    if [ "$tool" = "scp" ]; then
        if command -v ssh &> /dev/null; then
            local raw_output=$(run_with_timeout 2 ssh -V 2>&1)
            version=$(echo "$raw_output" | grep -oE 'OpenSSH_[0-9]+\.[0-9]+' | sed 's/OpenSSH_//' | head -n1)
        fi
    else
        # Try to get version with timeout to prevent hanging
        local raw_output=$(run_with_timeout 2 "$tool" $version_cmd 2>&1)
        
        # Apply per-tool specific parsing overrides
        case $tool in
            zip|unzip)
                # Zip/unzip have version in format "UnZip 6.00 of ..."
                version=$(echo "$raw_output" | head -n2 | grep -oE '[0-9]+\.[0-9]+' | head -n1)
                ;;
            ping)
                # On macOS, ping doesn't have a version flag
                # Check if it's BSD ping (macOS) vs GNU ping
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    # macOS ping doesn't report version, return a generic indicator
                    version="BSD"
                else
                    version=$(echo "$raw_output" | head -n1 | grep -oE 's[0-9]+\.[0-9]+' | sed 's/s//' | head -n1)
                    if [ -z "$version" ]; then
                        # Try alternate format
                        version=$(echo "$raw_output" | grep -oE 'version [0-9]+\.[0-9]+' | grep -oE '[0-9]+\.[0-9]+' | head -n1)
                    fi
                fi
                ;;
            ssh)
                # SSH version format: OpenSSH_x.xpx
                version=$(echo "$raw_output" | grep -oE 'OpenSSH_[0-9]+\.[0-9]+' | sed 's/OpenSSH_//' | head -n1)
                ;;
            tar)
                # Check for BSD tar (macOS) vs GNU tar
                if echo "$raw_output" | grep -q "bsdtar"; then
                    # BSD tar format: bsdtar x.x.x
                    version=$(echo "$raw_output" | grep -oE 'bsdtar [0-9]+\.[0-9]+' | sed 's/bsdtar //' | head -n1)
                elif [[ "$OSTYPE" == "darwin"* ]] && ! echo "$raw_output" | grep -q "GNU"; then
                    # macOS default tar doesn't always report version clearly
                    version="BSD"
                else
                    # GNU tar format: tar (GNU tar) x.xx
                    version=$(echo "$raw_output" | head -n1 | grep -oE '\) [0-9]+\.[0-9]+' | sed 's/) //' | head -n1)
                fi
                ;;
            *)
                # Default extraction pattern
                version=$(echo "$raw_output" | head -n1 | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -n1)
                if [ -z "$version" ]; then
                    # Try alternate patterns if first attempt failed
                    version=$(echo "$raw_output" | grep -i version | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -n1)
                fi
                ;;
        esac
    fi
    
    if [ -n "$version" ]; then
        with_version=$((with_version + 1))
        echo "$version"
        return 0
    fi
    
    # Don't echo anything for missing version - return non-zero
    return 1
}

# Function to check if a command exists
check_tool() {
    local tool=$1
    local description=$2
    local category="${3:-General}"
    total=$((total + 1))
    
    if command -v "$tool" &> /dev/null; then
        local status="installed"
        local version=""
        
        if [ "$DETAILED" = true ] || [ "$JSON_OUTPUT" = true ]; then
            version=$(get_tool_version "$tool")
        fi
        
        if [ "$JSON_OUTPUT" = true ]; then
            # Accumulate data for later JSON processing
            json_data="${json_data}${tool}|${description}|${status}|${version}|${category}\n"
        else
            if [ "$DETAILED" = true ] && [ -n "$version" ]; then
                echo -e "${GREEN}✓${NC} $tool - $description ${BLUE}(v$version)${NC}"
            else
                echo -e "${GREEN}✓${NC} $tool - $description"
            fi
        fi
        installed=$((installed + 1))
    else
        local status="missing"
        
        if [ "$JSON_OUTPUT" = true ]; then
            # Accumulate data for later JSON processing
            json_data="${json_data}${tool}|${description}|${status}||${category}\n"
        else
            echo -e "${RED}✗${NC} $tool - $description"
        fi
        missing=$((missing + 1))
    fi
}

# Function to check tools in a category
check_category() {
    if [ "$JSON_OUTPUT" = false ]; then
        echo ""
        echo -e "${YELLOW}$1${NC}"
        echo "----------------------------------------"
    fi
    current_category="$1"
}

# Core File & Directory Operations
check_category "File & Directory Operations"
check_tool "ls" "List directory contents" "$current_category"
check_tool "cp" "Copy files" "$current_category"
check_tool "mv" "Move/rename files" "$current_category"
check_tool "rm" "Remove files" "$current_category"
check_tool "mkdir" "Make directories" "$current_category"
check_tool "find" "Find files" "$current_category"
check_tool "fd" "Modern find alternative" "$current_category"
check_tool "eza" "Modern ls alternative" "$current_category"
check_tool "tree" "Directory tree view" "$current_category"
check_tool "stat" "File statistics" "$current_category"

# Text Processing
check_category "Text Processing"
check_tool "grep" "Search text patterns" "$current_category"
check_tool "rg" "Ripgrep - fast search" "$current_category"
check_tool "sed" "Stream editor" "$current_category"
check_tool "sd" "Modern sed alternative" "$current_category"
check_tool "awk" "Pattern processing" "$current_category"
check_tool "cut" "Extract columns" "$current_category"
check_tool "sort" "Sort lines" "$current_category"
check_tool "uniq" "Remove duplicates" "$current_category"
check_tool "cat" "Concatenate files" "$current_category"
check_tool "bat" "Cat with syntax highlighting" "$current_category"

# Version Control
check_category "Version Control"
check_tool "git" "Version control system" "$current_category"
check_tool "gh" "GitHub CLI" "$current_category"
check_tool "delta" "Git diff viewer" "$current_category"
check_tool "lazygit" "Git TUI" "$current_category"
check_tool "tig" "Git repository browser" "$current_category"

# Development Tools
check_category "Development Tools"
check_tool "gcc" "GNU C compiler" "$current_category"
check_tool "clang" "LLVM C compiler" "$current_category"
check_tool "make" "Build automation" "$current_category"
check_tool "cmake" "Cross-platform build" "$current_category"
check_tool "ninja" "Fast build system" "$current_category"
check_tool "meson" "Modern build system" "$current_category"
check_tool "bazel" "Google build system" "$current_category"
check_tool "python3" "Python interpreter" "$current_category"
check_tool "node" "Node.js runtime" "$current_category"
check_tool "npm" "Node package manager" "$current_category"
check_tool "cargo" "Rust package manager" "$current_category"
check_tool "go" "Go language" "$current_category"

# Network Tools
check_category "Network Tools"
check_tool "curl" "Transfer data" "$current_category"
check_tool "wget" "Download files" "$current_category"
check_tool "ssh" "Secure shell" "$current_category"
check_tool "scp" "Secure copy" "$current_category"
check_tool "rsync" "Sync files" "$current_category"
check_tool "ping" "Test connectivity" "$current_category"
check_tool "dig" "DNS lookup" "$current_category"
check_tool "netstat" "Network statistics" "$current_category"
check_tool "nmap" "Network scanner" "$current_category"
check_tool "masscan" "Fast port scanner" "$current_category"
check_tool "iftop" "Bandwidth monitor" "$current_category"

# System Administration
check_category "System Administration"
check_tool "ps" "Process status" "$current_category"
check_tool "procs" "Modern ps alternative" "$current_category"
check_tool "top" "Process monitor" "$current_category"
check_tool "htop" "Interactive process viewer" "$current_category"
check_tool "btop" "Modern system monitor" "$current_category"
check_tool "df" "Disk free space" "$current_category"
check_tool "du" "Disk usage" "$current_category"
check_tool "dust" "Modern du alternative" "$current_category"
check_tool "ncdu" "NCurses disk usage" "$current_category"
check_tool "kill" "Terminate processes" "$current_category"
check_tool "sudo" "Execute as root" "$current_category"
check_tool "iostat" "I/O statistics" "$current_category"
check_tool "lsof" "List open files" "$current_category"

# Archive & Compression
check_category "Archive & Compression"
check_tool "tar" "Tape archive" "$current_category"
check_tool "zip" "ZIP compression" "$current_category"
check_tool "unzip" "ZIP extraction" "$current_category"
check_tool "gzip" "GNU zip" "$current_category"
check_tool "bzip2" "BZIP2 compression" "$current_category"
check_tool "xz" "XZ compression" "$current_category"
check_tool "zstd" "Zstandard compression" "$current_category"

# Data Processing
check_category "Data Processing"
check_tool "jq" "JSON processor" "$current_category"
check_tool "yq" "YAML processor" "$current_category"
check_tool "sqlite3" "SQLite database" "$current_category"
check_tool "csvkit" "CSV toolkit" "$current_category"
check_tool "miller" "Data processing" "$current_category"
check_tool "datamash" "Statistical operations" "$current_category"
check_tool "csvq" "SQL on CSV" "$current_category"
check_tool "dsq" "SQL on structured data" "$current_category"

# Database Clients
check_category "Database Clients"
check_tool "mysql" "MySQL client" "$current_category"
check_tool "psql" "PostgreSQL client" "$current_category"
check_tool "redis-cli" "Redis client" "$current_category"

# Media Processing
check_category "Media Processing"
check_tool "ffmpeg" "Media converter" "$current_category"
check_tool "sox" "Sound processor" "$current_category"
check_tool "exiftool" "Metadata tool" "$current_category"
# ImageMagick is typically available as 'magick' or 'convert' command
if command -v magick &> /dev/null; then
    check_tool "magick" "Image processor (ImageMagick)" "$current_category"
elif command -v convert &> /dev/null; then
    check_tool "convert" "Image processor (ImageMagick)" "$current_category"
else
    # Fallback to check for imagemagick (although it's not typically an executable)
    check_tool "imagemagick" "Image processor" "$current_category"
fi
check_tool "pandoc" "Document converter" "$current_category"

# Container Tools
check_category "Container & Cloud Tools"
check_tool "docker" "Container platform" "$current_category"
check_tool "docker-compose" "Multi-container apps" "$current_category"
check_tool "kubectl" "Kubernetes CLI" "$current_category"
check_tool "terraform" "Infrastructure as code" "$current_category"
check_tool "ansible" "Automation platform" "$current_category"
check_tool "aws" "AWS CLI" "$current_category"

# Performance Analysis
check_category "Performance Analysis"
check_tool "time" "Time commands" "$current_category"
check_tool "hyperfine" "Benchmarking tool" "$current_category"
check_tool "leaks" "Memory leak detection" "$current_category"
check_tool "heap" "Heap analysis" "$current_category"
check_tool "vm_stat" "Virtual memory stats" "$current_category"
check_tool "gprof2dot" "Profile visualization" "$current_category"

# Security Tools
check_category "Security Tools"
check_tool "gpg" "GNU Privacy Guard" "$current_category"
check_tool "openssl" "Cryptography toolkit" "$current_category"
check_tool "ssh-keygen" "SSH key generation" "$current_category"
check_tool "shasum" "SHA checksums" "$current_category"

# Package Managers
check_category "Package Managers"
check_tool "brew" "Homebrew" "$current_category"
check_tool "pip3" "Python packages" "$current_category"
check_tool "gem" "Ruby gems" "$current_category"
check_tool "yarn" "JavaScript packages" "$current_category"
check_tool "composer" "PHP packages" "$current_category"

# Output results based on format
if [ "$JSON_OUTPUT" = true ]; then
    # Build JSON array from accumulated data in one pass
    json_array=$(echo -e "$json_data" | grep -v '^$' | jq -Rs '
        split("\n") |
        map(select(length > 0)) |
        map(split("|")) |
        map({
            tool: .[0],
            description: .[1],
            status: .[2],
            version: (if .[3] == "" then null else .[3] end),
            category: .[4]
        })
    ')
    
    # Output JSON with summary
    jq -n \
        --argjson tools "$json_array" \
        --arg total "$total" \
        --arg installed "$installed" \
        --arg missing "$missing" \
        --arg with_version "$with_version" \
        --arg coverage "$((installed * 100 / total))" \
        '{
            summary: {
                total: ($total | tonumber),
                installed: ($installed | tonumber),
                missing: ($missing | tonumber),
                with_version: ($with_version | tonumber),
                coverage_percentage: ($coverage | tonumber)
            },
            tools: $tools
        }'
else
    # Print summary
    echo ""
    echo "=========================================="
    echo "Summary"
    echo "=========================================="
    echo -e "${GREEN}Installed:${NC} $installed tools"
    echo -e "${RED}Missing:${NC} $missing tools"
    if [ "$DETAILED" = true ] && [ $installed -gt 0 ]; then
        echo -e "${BLUE}With version info:${NC} $with_version tools"
    fi
    echo -e "Total checked: $total tools"
    echo ""
    percentage=$((installed * 100 / total))
    echo "Installation coverage: ${percentage}%"
fi

# Suggest installation for missing tools (only for non-JSON output)
if [ $missing -gt 0 ] && [ "$JSON_OUTPUT" = false ]; then
    echo ""
    echo "=========================================="
    echo "Installation Suggestions"
    echo "=========================================="
    echo ""
    echo "Most missing tools can be installed via Homebrew:"
    echo ""
    echo "Essential modern tools:"
    echo "  brew install ripgrep fd bat eza delta lazygit"
    echo ""
    echo "System monitoring:"
    echo "  brew install htop btop ncdu dust procs"
    echo ""
    echo "Development tools:"
    echo "  brew install cmake ninja meson bazel"
    echo ""
    echo "Data processing:"
    echo "  brew install jq miller csvkit datamash"
    echo ""
    echo "Network tools:"
    echo "  brew install nmap masscan iftop"
    echo ""
    echo "Media tools:"
    echo "  brew install ffmpeg sox exiftool imagemagick pandoc"
    echo ""
    echo "Cloud/Container tools:"
    echo "  brew install docker kubectl terraform ansible awscli"
fi

if [ "$JSON_OUTPUT" = false ]; then
    echo ""
    echo "For detailed documentation on any tool, see TOOLS.md"
    echo "For quick command reference, see CHEATSHEET.md"
fi