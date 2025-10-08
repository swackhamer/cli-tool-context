## Terminal Information & Control



**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
# (Add specific examples for this tool)
```
<!-- metadata:
category: Terminal Information & Control
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [test, evaluate conditions]
synonyms: [test]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Evaluate conditional expressions and return exit status
**Location**: Built-in shell command (also `/usr/bin/test`)
**Common Use Cases**:

- Shell script conditionals
- File system tests
- String comparisons
- Numerical comparisons

**File Tests**:

```bash
# File existence and types
test -e filename    # exists
test -f filename    # regular file
test -d dirname     # directory
test -L linkname    # symbolic link
test -r filename    # readable
test -w filename    # writable
test -x filename    # executable

# File comparisons
test file1 -nt file2    # newer than
test file1 -ot file2    # older than
test file1 -ef file2    # same file
```

**String Tests**:

```bash
# String length and equality
test -z "$string"       # empty string
test -n "$string"       # non-empty string
test "$str1" = "$str2"  # equal
test "$str1" != "$str2" # not equal
test "$str1" \< "$str2" # lexicographically less
```

**Numerical Tests**:

```bash
# Numerical comparisons
test 5 -eq 5     # equal
test 5 -ne 3     # not equal
test 5 -gt 3     # greater than
test 5 -ge 5     # greater or equal
test 3 -lt 5     # less than
test 3 -le 5     # less or equal
```

**Script Examples**:

```bash
#!/bin/bash
# Backup script with conditions
if test -f "$1"; then
    cp "$1" "${1}.backup"
    echo "Backup created"
else
    echo "File not found: $1"
    exit 1
fi

# System check
if test $(df / | tail -1 | awk '{print $5}' | cut -d% -f1) -gt 90; then
    echo "WARNING: Root filesystem over 90% full"
fi
```

### **tty** - Terminal Name**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Terminal Information & Control
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [tty, terminal name]
synonyms: [tty]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Returns the name of the terminal attached to standard input
**Location**: `/usr/bin/tty`
**Common Use Cases**:

- Script behavior based on terminal type
- Security checks in scripts
- System administration
- Terminal identification

**Basic Usage**:

```bash
# Show current terminal
tty    # /dev/ttys001

# Silent mode (only exit status)
tty -s && echo "Running in terminal" || echo "Not in terminal"

# Check if running interactively
if tty -s; then
    echo "Interactive session"
else
    echo "Non-interactive (script/pipe)"
fi
```

**Script Applications**:

```bash
#!/bin/bash
# Different behavior for interactive vs non-interactive
if tty -s; then
    # Interactive - show progress
    echo "Starting backup..."
    rsync -av --progress source/ dest/
else
    # Non-interactive - quiet mode
    rsync -av source/ dest/ 2>/dev/null
fi

# Log which terminal ran the script
echo "Script run from: $(tty)" >> script.log

# Security check
current_tty=$(tty)
if [[ "$current_tty" =~ ^/dev/pts/ ]]; then
    echo "Running in pseudo-terminal (SSH session)"
elif [[ "$current_tty" =~ ^/dev/tty ]]; then
    echo "Running in physical terminal"
fi
```



**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
# (Add specific examples for this tool)
```
### **stty** - Terminal Settings**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Terminal Information & Control
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [stty, terminal settings]
synonyms: [stty]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Set or display terminal characteristics and settings
**Location**: `/bin/stty`
**Common Use Cases**:

- Configure terminal behavior
- Password input without echo
- Terminal size detection
- Raw mode for special applications

**Display Settings**:

```bash
# Show all settings
stty -a

# Show specific settings
stty size           # rows columns
stty speed          # baud rate
stty -echo          # disable echo
stty echo           # enable echo
```

**Terminal Configuration**:

```bash
# Disable echo (for password input)
stty -echo
read -p "Password: " password
stty echo
echo

# Set terminal size
stty rows 50 cols 132

# Raw mode (no special character processing)
stty raw
# Reset to normal
stty sane

# Prevent Ctrl+C interruption
stty -isig
# Restore interrupt capability
stty isig
```

**Automation Examples**:

```bash
# Secure password input function
read_password() {
    echo -n "Enter password: "
    stty -echo
    read password
    stty echo
    echo
}

# Save and restore terminal settings
save_terminal() {
    SAVED_STTY=$(stty -g)
}

restore_terminal() {
    stty "$SAVED_STTY"
}

# Terminal size-aware scripts
get_terminal_size() {
    local size=$(stty size)
    ROWS=${size% *}
    COLS=${size#* }
}

# Setup for full-screen application
setup_fullscreen() {
    stty -echo -icanon
    tput clear
    tput civis  # hide cursor
}

cleanup_fullscreen() {
    stty echo icanon
    tput cnorm  # show cursor
}
```

**Interactive Scripts**:

```bash
#!/bin/bash
# Menu system with terminal control
show_menu() {
    clear
    echo "System Administration Menu"
    echo "1. View disk usage"
    echo "2. Check processes"
    echo "3. System logs"
    echo "q. Quit"
}

# Disable line buffering for immediate response
stty -icanon min 1 time 0

while true; do
    show_menu
    read -n 1 choice
    case $choice in
        1) df -h | less ;;
        2) ps aux | less ;;
        3) tail -f /var/log/syslog ;;
        q) break ;;
    esac
done

# Restore normal terminal behavior
stty icanon
```

---

