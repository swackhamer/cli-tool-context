## Environment & Process Management



**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
# (Add specific examples for this tool)
```
<!-- metadata:
category: Environment & Process Management
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


### **echo** - Display Text**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [echo, display text]
synonyms: [echo]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display line of text to standard output
**Location**: Built-in shell command
**Common Use Cases**:

- Print messages and variables
- Script output and debugging
- Create simple files with content
- Environment variable display

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic text output
echo "Hello, World!"

# Print variables
echo "Current user: $USER"
echo "Home directory: $HOME"

# No trailing newline
echo -n "Enter your name: "

# Enable interpretation of backslash escapes
echo -e "Line 1\nLine 2\nLine 3"

# Create files with content
echo "#!/bin/bash" > script.sh
echo "echo 'Hello'" >> script.sh

# Escape special characters
echo "Price: \$25.99"

# Multiple arguments
echo "File:" $filename "Size:" $size
```


### **alias** - Create Command Aliases**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [alias, create command aliases]
synonyms: [alias]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Create aliases for commands to provide shorthand or modify default behavior
**Location**: Built-in shell command
**Common Use Cases**:

- Create shortcuts for frequently used commands
- Add default options to commands
- Simplify complex command sequences
- Improve productivity and reduce typing

**See Also**: Related tools in this category

**Examples**:

```bash
# Create simple command shortcuts
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'

# Add safety to destructive commands
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'

# Navigation shortcuts
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# List all aliases
alias

# Remove an alias
unalias ll

# Create temporary alias for session
alias grep='grep --color=auto'

# Complex command shortcuts
alias ports='netstat -tuln'
alias meminfo='cat /proc/meminfo'
alias pscpu='ps auxf | sort -nr -k 3'
alias psram='ps auxf | sort -nr -k 4'

# Directory operations
alias mkdir='mkdir -pv'
alias wget='wget -c'
```


### **export** - Set Environment Variables**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [export, set environment variables]
synonyms: [export]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Set environment variables for current shell and child processes
**Location**: Built-in shell command
**Common Use Cases**:

- Configure shell environment
- Set up development environments
- Pass variables to child processes
- Script configuration

**See Also**: Related tools in this category

**Examples**:

```bash
# Export variables
export PATH="/usr/local/bin:$PATH"
export EDITOR="vim"
export JAVA_HOME="/usr/lib/jvm/java-11"

# Export with assignment
export DATABASE_URL="postgresql://localhost/mydb"

# Make existing variable available to child processes
MY_VAR="value"
export MY_VAR

# Show exported variables
export -p

# Development environment setup
export NODE_ENV="development"
export API_KEY="your-api-key"
export DEBUG="true"

# Unset exported variable
export -n VARIABLE
```


### **jobs** - Job Control**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [jobs, job control]
synonyms: [jobs]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display active jobs in current shell session
**Location**: Built-in shell command
**Common Use Cases**:

- Monitor background processes
- Job control management
- Process status checking
- Multi-tasking coordination

**See Also**: Related tools in this category

**Examples**:

```bash
# List all jobs
jobs

# List with process IDs
jobs -l

# List only running jobs
jobs -r

# List only stopped jobs
jobs -s

# Start background job
long_running_command &

# Check job status
jobs %1

# Job management workflow
sleep 100 &  # Start background job
jobs         # Check status
fg %1        # Bring to foreground
# Ctrl+Z     # Stop job
bg %1        # Resume in background
kill %1      # Terminate job
```

### **bg** and **fg** - Background/Foreground Jobs
**Description**: Manage job execution state (background/foreground)
**Location**: Built-in shell commands
**Common Use Cases**:

- Resume stopped jobs
- Switch between foreground/background
- Multi-tasking management
- Long-running process control

**Examples**:

```bash
# Start process, then move to background
long_command
# Ctrl+Z (stop)
bg  # Resume in background

# Move specific job to background
bg %2

# Bring job to foreground
fg %1

# Multiple job management
make &       # Job 1 (background)
vim file &   # Job 2 (background)
jobs         # List all jobs
fg %2        # Bring vim to foreground

# Resume most recent job
fg
bg

# Common workflow
./compile.sh &  # Start compilation in background
vim source.c    # Edit source while compiling
jobs           # Check compilation status
fg %1          # Check compilation output
```


<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [jobs, job control]
synonyms: [jobs]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display active jobs in current shell session
**Location**: Built-in shell command
**Common Use Cases**:

- Monitor background processes
- Job control management
- Process status checking
- Multi-tasking coordination

**Examples**:

```bash
# List all jobs
jobs

# List with process IDs
jobs -l

# List only running jobs
jobs -r

# List only stopped jobs
jobs -s

# Start background job
long_running_command &

# Check job status
jobs %1

# Job management workflow
sleep 100 &  # Start background job
jobs         # Check status
fg %1        # Bring to foreground
# Ctrl+Z     # Stop job
bg %1        # Resume in background
kill %1      # Terminate job
```

### **nohup** - No Hangup**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [nohup, no hangup]
synonyms: [nohup]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Run commands immune to hangups, with output to non-tty
**Location**: `/usr/bin/nohup`
**Common Use Cases**:

- Long-running processes that survive logout
- Remote server commands via SSH
- Batch processing jobs
- Background services

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic nohup usage
nohup long_running_script.sh &

# Custom output file
nohup command > output.log 2>&1 &

# Multiple commands
nohup bash -c "command1 && command2" &

# Check nohup output
tail -f nohup.out

# Server deployment example
nohup python server.py > server.log 2>&1 &

# Batch processing
nohup find /large/directory -name "*.log" -exec gzip {} \; &

# Backup script
nohup rsync -av /source/ /backup/ > backup.log 2>&1 &

# Get process ID for later management
nohup command & echo $! > command.pid
```


### **sleep** - Delay Execution**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [sleep, delay execution]
synonyms: [sleep]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Suspend execution for specified time interval
**Location**: `/usr/bin/sleep`
**Common Use Cases**:

- Script timing control
- Rate limiting
- Batch processing delays
- System monitoring intervals

**See Also**: Related tools in this category

**Examples**:

```bash
# Sleep for seconds
sleep 5

# Different time units
sleep 2m      # 2 minutes
sleep 1h      # 1 hour
sleep 0.5     # Half second

# Script delays
echo "Starting process..."
sleep 3
echo "Process started"

# Monitoring loop
while true; do
    check_system_status
    sleep 30
done

# Rate-limited operations
for file in *.txt; do
    process_file "$file"
    sleep 1  # Prevent overwhelming system
done

# Retry with backoff
retry_count=0
while ! connect_to_service; do
    retry_count=$((retry_count + 1))
    echo "Retry $retry_count failed, waiting..."
    sleep $((retry_count * 2))
done
```


### **time** - Time Command Execution**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [time, time command execution]
synonyms: [time]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Time the execution of commands and report resource usage
**Location**: `/usr/bin/time` (also built-in shell command)
**Common Use Cases**:

- Performance measurement
- Benchmark testing
- Resource usage analysis
- Script optimization

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic timing
time command

# Detailed timing (external time command)
/usr/bin/time -p command

# Format output
/usr/bin/time -f "Time: %E, Memory: %M KB" command

# Save timing to file
/usr/bin/time -o timing.log -a command

# Compare different approaches
time approach1.sh
time approach2.sh

# Script performance analysis
time make clean && make all

# Memory usage monitoring
/usr/bin/time -v memory_intensive_program

# Benchmark multiple runs
for i in {1..10}; do
    echo "Run $i:"
    time test_script.sh
done
```


### **wait** - Wait for Process Completion**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [wait, wait for process completion]
synonyms: [wait]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Wait for background processes to complete
**Location**: Built-in shell command
**Common Use Cases**:

- Synchronize parallel processes
- Ensure completion before proceeding
- Parallel processing coordination
- Script flow control

**See Also**: Related tools in this category

**Examples**:

```bash
# Wait for all background jobs
command1 &
command2 &
command3 &
wait  # Wait for all to complete

# Wait for specific process
command &
PID=$!
wait $PID

# Parallel processing with synchronization
for file in *.txt; do
    process_file "$file" &
done
wait  # Wait for all processing to complete

# Conditional waiting
long_task &
BG_PID=$!
while kill -0 $BG_PID 2>/dev/null; do
    echo "Still running..."
    sleep 5
done
echo "Task completed"

# Error handling with wait
risky_command &
if wait $!; then
    echo "Command succeeded"
else
    echo "Command failed"
fi
```


### **trap** - Signal Handling**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [trap, signal handling]
synonyms: [trap]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Execute commands when shell receives signals
**Location**: Built-in shell command
**Common Use Cases**:

- Cleanup operations on script exit
- Signal handling in scripts
- Resource management
- Graceful shutdown procedures

**See Also**: Related tools in this category

**Examples**:

```bash
# Cleanup on exit
cleanup() {
    echo "Cleaning up temporary files..."
    rm -f /tmp/script.$$.*
}
trap cleanup EXIT

# Handle interruption
trap 'echo "Script interrupted, exiting..."; exit 1' INT TERM

# Ignore specific signals
trap '' HUP  # Ignore hangup signal

# Debug mode
trap 'echo "Line $LINENO: $BASH_COMMAND"' DEBUG

# Resource management
setup_resources() {
    lock_file="/tmp/script.lock"
    touch "$lock_file"
}

cleanup_resources() {
    rm -f "$lock_file"
}

trap cleanup_resources EXIT INT TERM
setup_resources

# Network connection cleanup
trap 'pkill -P $$; exit' INT TERM
```


### **disown** - Remove Jobs from Shell**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Environment & Process Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [disown, remove jobs from shell]
synonyms: [disown]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Remove jobs from shell's job table
**Location**: Built-in shell command
**Common Use Cases**:

- Detach processes from shell
- Prevent SIGHUP on shell exit
- Long-running background processes
- Process independence

**See Also**: Related tools in this category

**Examples**:

```bash
# Start and disown process
long_running_command &
disown

# Disown specific job
command &
disown %1

# Disown all jobs
disown -a

# Keep job in job table but remove SIGHUP
disown -h %1

# Common pattern for detached processes
nohup long_command > output.log 2>&1 &
disown

# Server process management
./start_server.sh &
SERVER_PID=$!
disown
echo $SERVER_PID > server.pid
```

---

