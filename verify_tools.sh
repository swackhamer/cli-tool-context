#!/bin/bash

# CLI Tools Installation Verification Script
# This script checks which documented tools are installed on your system

echo "=========================================="
echo "CLI Tools Installation Verification"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
installed=0
missing=0
total=0

# Function to check if a command exists
check_tool() {
    local tool=$1
    local description=$2
    total=$((total + 1))
    
    if command -v "$tool" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $tool - $description"
        installed=$((installed + 1))
    else
        echo -e "${RED}✗${NC} $tool - $description"
        missing=$((missing + 1))
    fi
}

# Function to check tools in a category
check_category() {
    echo ""
    echo -e "${YELLOW}$1${NC}"
    echo "----------------------------------------"
}

# Core File & Directory Operations
check_category "File & Directory Operations"
check_tool "ls" "List directory contents"
check_tool "cp" "Copy files"
check_tool "mv" "Move/rename files"
check_tool "rm" "Remove files"
check_tool "mkdir" "Make directories"
check_tool "find" "Find files"
check_tool "fd" "Modern find alternative"
check_tool "eza" "Modern ls alternative"
check_tool "tree" "Directory tree view"
check_tool "stat" "File statistics"

# Text Processing
check_category "Text Processing"
check_tool "grep" "Search text patterns"
check_tool "rg" "Ripgrep - fast search"
check_tool "sed" "Stream editor"
check_tool "sd" "Modern sed alternative"
check_tool "awk" "Pattern processing"
check_tool "cut" "Extract columns"
check_tool "sort" "Sort lines"
check_tool "uniq" "Remove duplicates"
check_tool "cat" "Concatenate files"
check_tool "bat" "Cat with syntax highlighting"

# Version Control
check_category "Version Control"
check_tool "git" "Version control system"
check_tool "gh" "GitHub CLI"
check_tool "delta" "Git diff viewer"
check_tool "lazygit" "Git TUI"
check_tool "tig" "Git repository browser"

# Development Tools
check_category "Development Tools"
check_tool "gcc" "GNU C compiler"
check_tool "clang" "LLVM C compiler"
check_tool "make" "Build automation"
check_tool "cmake" "Cross-platform build"
check_tool "ninja" "Fast build system"
check_tool "meson" "Modern build system"
check_tool "bazel" "Google build system"
check_tool "python3" "Python interpreter"
check_tool "node" "Node.js runtime"
check_tool "npm" "Node package manager"
check_tool "cargo" "Rust package manager"
check_tool "go" "Go language"

# Network Tools
check_category "Network Tools"
check_tool "curl" "Transfer data"
check_tool "wget" "Download files"
check_tool "ssh" "Secure shell"
check_tool "scp" "Secure copy"
check_tool "rsync" "Sync files"
check_tool "ping" "Test connectivity"
check_tool "dig" "DNS lookup"
check_tool "netstat" "Network statistics"
check_tool "nmap" "Network scanner"
check_tool "masscan" "Fast port scanner"
check_tool "iftop" "Bandwidth monitor"

# System Administration
check_category "System Administration"
check_tool "ps" "Process status"
check_tool "procs" "Modern ps alternative"
check_tool "top" "Process monitor"
check_tool "htop" "Interactive process viewer"
check_tool "btop" "Modern system monitor"
check_tool "df" "Disk free space"
check_tool "du" "Disk usage"
check_tool "dust" "Modern du alternative"
check_tool "ncdu" "NCurses disk usage"
check_tool "kill" "Terminate processes"
check_tool "sudo" "Execute as root"
check_tool "iostat" "I/O statistics"
check_tool "lsof" "List open files"

# Archive & Compression
check_category "Archive & Compression"
check_tool "tar" "Tape archive"
check_tool "zip" "ZIP compression"
check_tool "unzip" "ZIP extraction"
check_tool "gzip" "GNU zip"
check_tool "bzip2" "BZIP2 compression"
check_tool "xz" "XZ compression"
check_tool "zstd" "Zstandard compression"

# Data Processing
check_category "Data Processing"
check_tool "jq" "JSON processor"
check_tool "yq" "YAML processor"
check_tool "sqlite3" "SQLite database"
check_tool "csvkit" "CSV toolkit"
check_tool "miller" "Data processing"
check_tool "datamash" "Statistical operations"
check_tool "csvq" "SQL on CSV"
check_tool "dsq" "SQL on structured data"

# Database Clients
check_category "Database Clients"
check_tool "mysql" "MySQL client"
check_tool "psql" "PostgreSQL client"
check_tool "redis-cli" "Redis client"

# Media Processing
check_category "Media Processing"
check_tool "ffmpeg" "Media converter"
check_tool "sox" "Sound processor"
check_tool "exiftool" "Metadata tool"
check_tool "imagemagick" "Image processor"
check_tool "pandoc" "Document converter"

# Container Tools
check_category "Container & Cloud Tools"
check_tool "docker" "Container platform"
check_tool "docker-compose" "Multi-container apps"
check_tool "kubectl" "Kubernetes CLI"
check_tool "terraform" "Infrastructure as code"
check_tool "ansible" "Automation platform"
check_tool "aws" "AWS CLI"

# Performance Analysis
check_category "Performance Analysis"
check_tool "time" "Time commands"
check_tool "hyperfine" "Benchmarking tool"
check_tool "leaks" "Memory leak detection"
check_tool "heap" "Heap analysis"
check_tool "vm_stat" "Virtual memory stats"
check_tool "gprof2dot" "Profile visualization"

# Security Tools
check_category "Security Tools"
check_tool "gpg" "GNU Privacy Guard"
check_tool "openssl" "Cryptography toolkit"
check_tool "ssh-keygen" "SSH key generation"
check_tool "shasum" "SHA checksums"

# Package Managers
check_category "Package Managers"
check_tool "brew" "Homebrew"
check_tool "pip3" "Python packages"
check_tool "gem" "Ruby gems"
check_tool "yarn" "JavaScript packages"
check_tool "composer" "PHP packages"

# Print summary
echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo -e "${GREEN}Installed:${NC} $installed tools"
echo -e "${RED}Missing:${NC} $missing tools"
echo -e "Total checked: $total tools"
echo ""
percentage=$((installed * 100 / total))
echo "Installation coverage: ${percentage}%"

# Suggest installation for missing tools
if [ $missing -gt 0 ]; then
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

echo ""
echo "For detailed documentation on any tool, see TOOLS.md"
echo "For quick command reference, see CHEATSHEET.md"