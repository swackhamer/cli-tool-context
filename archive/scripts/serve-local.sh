#!/bin/bash

# serve-local.sh - Simple script to start a local HTTP server for the CLI Tool Context website
# This helps users avoid file:// protocol issues in Chrome and other browsers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default settings
PORT=8000
SITE_DIR="site"
OPEN_BROWSER=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -d|--dir)
            SITE_DIR="$2"
            shift 2
            ;;
        --no-browser)
            OPEN_BROWSER=false
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  -p, --port PORT      Port to run the server on (default: 8000)"
            echo "  -d, --dir DIR        Directory to serve (default: site)"
            echo "  --no-browser         Don't open browser automatically"
            echo "  -h, --help           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                   # Start server on port 8000"
            echo "  $0 -p 3000           # Start server on port 3000"
            echo "  $0 --no-browser      # Start without opening browser"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Run '$0 --help' for usage information"
            exit 1
            ;;
    esac
done

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to open browser
open_browser() {
    local url="http://localhost:$PORT"
    
    if [ "$OPEN_BROWSER" = true ]; then
        sleep 1  # Give the server a moment to start
        
        if command_exists open; then
            # macOS
            open "$url"
        elif command_exists xdg-open; then
            # Linux with desktop environment
            xdg-open "$url"
        elif command_exists gnome-open; then
            # GNOME
            gnome-open "$url"
        elif command_exists kde-open; then
            # KDE
            kde-open "$url"
        else
            echo -e "${YELLOW}Please open your browser to: $url${NC}"
        fi
    else
        echo -e "${GREEN}Server running at: $url${NC}"
    fi
}

# Main script
echo -e "${BLUE}===================================${NC}"
echo -e "${BLUE}  CLI Tool Context - Local Server ${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "$SITE_DIR" ]; then
    # Try to find the site directory
    if [ -d "../site" ]; then
        cd ..
    elif [ -d "../../site" ]; then
        cd ../..
    fi
    
    if [ ! -d "$SITE_DIR" ]; then
        echo -e "${RED}Error: Cannot find '$SITE_DIR' directory${NC}"
        echo "Please run this script from the project root or scripts directory"
        exit 1
    fi
fi

# Check if port is available
if ! check_port $PORT; then
    echo -e "${YELLOW}Warning: Port $PORT is already in use${NC}"
    echo -n "Try another port? (suggested: $((PORT + 1))) [Y/n]: "
    read -r response
    if [[ ! "$response" =~ ^[Nn]$ ]]; then
        PORT=$((PORT + 1))
        while ! check_port $PORT && [ $PORT -lt 9999 ]; do
            PORT=$((PORT + 1))
        done
        echo -e "${GREEN}Using port $PORT${NC}"
    else
        echo -e "${RED}Exiting...${NC}"
        exit 1
    fi
fi

# Change to site directory
cd "$SITE_DIR"

# Try different server options in order of preference
echo -e "${GREEN}Starting local server on port $PORT...${NC}"
echo ""

# Option 1: Python 3 (most common)
if command_exists python3; then
    echo -e "${GREEN}Using Python 3 HTTP server${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    open_browser &
    exec python3 -m http.server $PORT --bind 127.0.0.1

# Option 2: Python 2 (legacy)
elif command_exists python; then
    # Check if it's Python 2
    if python --version 2>&1 | grep -q "Python 2"; then
        echo -e "${GREEN}Using Python 2 SimpleHTTPServer${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
        echo ""
        open_browser &
        exec python -m SimpleHTTPServer $PORT
    else
        # It's Python 3 with 'python' command
        echo -e "${GREEN}Using Python HTTP server${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
        echo ""
        open_browser &
        exec python -m http.server $PORT --bind 127.0.0.1
    fi

# Option 3: Node.js with npx
elif command_exists npx; then
    echo -e "${GREEN}Using Node.js http-server via npx${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    open_browser &
    exec npx http-server -p $PORT -a localhost --cors -c-1

# Option 4: PHP
elif command_exists php; then
    echo -e "${GREEN}Using PHP built-in web server${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    open_browser &
    exec php -S localhost:$PORT

# Option 5: Ruby
elif command_exists ruby; then
    echo -e "${GREEN}Using Ruby WEBrick server${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    open_browser &
    exec ruby -run -e httpd . -p $PORT -b 127.0.0.1

# Option 6: Busybox httpd (embedded systems)
elif command_exists busybox && busybox --list | grep -q httpd; then
    echo -e "${GREEN}Using Busybox httpd${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    open_browser &
    exec busybox httpd -f -p $PORT

# No server available
else
    echo -e "${RED}Error: No suitable HTTP server found${NC}"
    echo ""
    echo "Please install one of the following:"
    echo ""
    echo -e "${YELLOW}Python 3 (recommended):${NC}"
    echo "  macOS:  brew install python3"
    echo "  Ubuntu: sudo apt-get install python3"
    echo "  Fedora: sudo dnf install python3"
    echo ""
    echo -e "${YELLOW}Node.js:${NC}"
    echo "  macOS:  brew install node"
    echo "  Ubuntu: sudo apt-get install nodejs"
    echo "  Visit:  https://nodejs.org/"
    echo ""
    echo -e "${YELLOW}PHP:${NC}"
    echo "  macOS:  brew install php"
    echo "  Ubuntu: sudo apt-get install php"
    echo ""
    echo -e "${YELLOW}Ruby:${NC}"
    echo "  macOS:  brew install ruby"
    echo "  Ubuntu: sudo apt-get install ruby"
    echo ""
    exit 1
fi