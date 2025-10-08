## System Administration

### **sudo** - Execute as Root/Other User
<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [sudo, execute as root/other user]
synonyms: [sudo]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Execute commands as another user with authentication
**Location**: `/usr/bin/sudo`
**Difficulty**: ⭐⭐ Beginner (Basic usage) / ⭐⭐⭐⭐ Advanced (Policy configuration)
**Common Use Cases**:

- Administrative task execution
- Privilege escalation
- User impersonation
- Security policy enforcement

🛡️ **SECURITY WARNING**:

- **`sudo` grants FULL ADMINISTRATIVE PRIVILEGES** - use with extreme caution
- **Every sudo command runs with ROOT ACCESS** - can damage/compromise system
- **Malicious commands can destroy your system** when run with sudo
- **Always verify commands before adding sudo** - double-check spelling and paths
- **Avoid `sudo rm -rf`** and other destructive combinations

**Security Best Practices**:

- **Principle of Least Privilege**: Only use sudo when necessary
- **Verify commands**: Read and understand what you're running
- **Be suspicious of online commands**: Never blindly copy-paste sudo commands
- **Use specific commands**: Avoid `sudo su` or `sudo -i` unless needed
- **Check sudo access**: Use `sudo -l` to see what you're allowed to run
- **Time-limited**: sudo access expires after 15 minutes by default

**Safe Usage Guidelines**:

- Use package managers instead of manual installs when possible
- Prefer `sudo command` over `sudo su` for single operations
- Be extra careful with file operations: `sudo rm`, `sudo mv`, `sudo chmod`
- Always specify full paths when uncertain
- Use `sudo -u username` instead of switching to root when possible

**See Also**: Related tools in this category

**Examples**:

```bash
# Execute command as root
sudo command

# Execute as specific user
sudo -u username command

# Switch to root shell
sudo -i

# Switch to user shell
sudo -u username -i

# Execute with environment preserved
sudo -E command

# List sudo privileges
sudo -l

# Edit sudoers file safely
sudo visudo

# Execute command without password prompt
sudo -n command

# Run command in background as root
sudo nohup long_command &

# Execute multiple commands
sudo bash -c "command1 && command2"

# Validate sudo timestamp
sudo -v

# Clear sudo timestamp
sudo -k
```


### **md5** - MD5 Hash**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [md5, md5 hash]
synonyms: [md5]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Calculate MD5 cryptographic checksums
**Location**: `/sbin/md5`
**Common Use Cases**:

- File integrity verification
- Data checksums
- Password hashing (deprecated)
- Duplicate detection

**See Also**: `shasum` (SHA hashes), `openssl` (various hashes), `base64` (encoding)

**Examples**:

```bash
# Calculate MD5 hash of file
md5 file.txt

# Hash multiple files
md5 *.txt

# Hash from stdin
echo "hello world" | md5

# Quiet output (hash only)
md5 -q file.txt

# Reverse check (verify hash)
md5 -r file.txt

# Time-trial mode
md5 -t

# String input
md5 -s "hello world"
```


### **ps** - Process Status**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ps, process status]
synonyms: [ps]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display information about running processes
**Location**: `/bin/ps`
**Common Use Cases**:

- Process monitoring
- System diagnostics
- Resource usage analysis

**See Also**: Related tools in this category

**Examples**:

```bash
# List all processes
ps aux

# Find specific process
ps aux | grep process_name

# Show process tree
ps -ef
```


### **top** - Real-time Process Monitor**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [top, real-time process monitor]
synonyms: [top]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display and update sorted information about running processes
**Location**: `/usr/bin/top`
**Common Use Cases**:

- Real-time system monitoring
- Resource usage tracking
- Performance analysis

**See Also**: Related tools in this category

**Examples**:

```bash
# Start top
top

# Sort by memory usage
top -o mem

# Filter by user
top -user username
```


### **kill** - Terminate Processes**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [kill, terminate processes]
synonyms: [kill]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Send signals to processes
**Location**: Built-in command
**Common Use Cases**:

- Process termination
- Signal sending
- System management

**See Also**: Related tools in this category

**Examples**:

```bash
# Terminate process
kill PID

# Force kill
kill -9 PID

# Send specific signal
kill -USR1 PID
```


### **procs** - Modern Process Viewer
<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [procs, modern process viewer]
synonyms: [procs]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: A modern replacement for ps written in Rust with colored output and additional information
**Location**: `/opt/homebrew/bin/procs`
**Difficulty**: ⭐⭐ Beginner (Enhanced ps) / ⭐⭐⭐ Intermediate (Advanced filtering)
**Common Use Cases**:

- Enhanced process monitoring with colors and tree view
- Process analysis with better formatting
- System diagnostics with improved readability
- Modern alternative to traditional ps

**See Also**: `ps` (traditional process viewer), `htop` (interactive process viewer), `btop` (modern system monitor)

**Examples**:

```bash
# Basic process listing (colored, formatted)
procs                                          # Show all processes

# Filter by process name
procs firefox                                  # Show processes containing "firefox"
procs --or chrome firefox                      # Show chrome OR firefox processes
procs --and python script                      # Show processes containing both "python" and "script"

# Tree view of processes
procs --tree                                   # Show process tree
procs --tree --thread                          # Include threads in tree

# Sort and format options
procs --sortd cpu                             # Sort by CPU usage (descending)
procs --sorta memory                          # Sort by memory usage (ascending)
procs --watch                                 # Continuously update (like watch)
procs --watch-interval 2                     # Update every 2 seconds

# Show specific columns
procs --only pid,user,cpu,memory,command      # Show only specified columns
procs --insert tcp,udp                       # Insert TCP and UDP port columns

# Filter by user, state, etc.
procs --user root                             # Show processes for root user
procs --state running                         # Show only running processes
procs --state sleeping                        # Show only sleeping processes

# Advanced filtering
procs --tcp                                   # Show processes with TCP connections
procs --udp                                   # Show processes with UDP connections
procs --docker                                # Show Docker-related processes
```


### **df** - Disk Free Space**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [df, disk free space]
synonyms: [df]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display filesystem disk space usage
**Location**: `/bin/df`
**Common Use Cases**:

- Disk space monitoring
- Filesystem analysis
- Storage management

**See Also**: Related tools in this category

**Examples**:

```bash
# Show disk usage
df -h

# Show all filesystems
df -a

# Show inodes
df -i
```


### **du** - Disk Usage**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [du, disk usage]
synonyms: [du]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display directory space usage
**Location**: `/usr/bin/du`
**Common Use Cases**:

- Directory size analysis
- Storage cleanup
- File system management

**See Also**: Related tools in this category

**Examples**:

```bash
# Show directory sizes
du -h

# Show total only
du -sh directory/

# Sort by size
du -h | sort -hr
```


### **ncdu** - NCurses Disk Usage Analyzer
<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ncdu, ncurses disk usage analyzer]
synonyms: [ncdu]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Disk usage analyzer with an ncurses interface, providing interactive navigation
**Location**: `/opt/homebrew/bin/ncdu`
**Difficulty**: ⭐⭐ Beginner (Simple navigation) / ⭐⭐⭐ Intermediate (Advanced features)
**Common Use Cases**:

- Interactive disk space analysis
- Finding large files and directories
- Storage cleanup and optimization
- Visual directory size exploration

**See Also**: `du` (basic disk usage), `df` (filesystem usage), `dust` (modern alternative)

**Examples**:

```bash
# Basic usage
ncdu                        # Analyze current directory
ncdu /path/to/directory     # Analyze specific directory
ncdu /                      # Analyze entire filesystem (requires time)

# Navigation inside ncdu
# Arrow keys or j/k - navigate up/down
# Enter or right arrow - enter directory
# Left arrow or < - go back to parent directory
# d - delete selected file/directory (with confirmation)
# t - toggle between different display modes
# g - show/hide percentage and graph
# a - toggle between apparent size and disk usage
# s - toggle sorting order
# r - refresh/rescan current directory
# q - quit

# Advanced options
ncdu -x /                   # Don't cross filesystem boundaries
ncdu --exclude="*.log"      # Exclude specific patterns
ncdu --exclude-from=file    # Exclude patterns from file
ncdu -o output.txt /home    # Export results to file
ncdu -f output.txt          # Import previously saved results

# Integration examples
ncdu /var/log               # Find large log files
ncdu ~/.cache               # Check cache directory size
sudo ncdu /                 # Full system analysis (as root)
ncdu --exclude="node_modules" ~/projects  # Exclude build artifacts
```


### **dust** - Intuitive Disk Usage Analyzer
<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [dust, intuitive disk usage analyzer]
synonyms: [dust]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: A more intuitive version of du written in Rust, with graphical output and better default behavior
**Location**: `/opt/homebrew/bin/dust`
**Difficulty**: ⭐⭐ Beginner (Simple and intuitive) / ⭐⭐⭐ Intermediate (Advanced options)
**Common Use Cases**:

- Fast disk usage analysis with visual tree representation
- Finding large files and directories with intuitive output
- Modern alternative to du with better defaults
- Quick storage cleanup assessment

**See Also**: `du` (traditional disk usage), `ncdu` (interactive ncurses), `df` (filesystem usage)

**Examples**:

```bash
# Basic usage - show disk usage tree
dust                                          # Analyze current directory
dust /path/to/directory                       # Analyze specific directory
dust ~                                        # Analyze home directory

# Control output depth and limits
dust -d 3                                     # Show only 3 levels deep
dust -n 20                                    # Show top 20 entries
dust -d 2 -n 10                              # Combine: 2 levels, top 10

# Different output formats
dust -t                                       # Tree view (default)
dust -b                                       # Show only file count, not size
dust -c                                       # Don't use colors
dust -f                                       # Show full paths

# Size thresholds and filtering
dust -s                                       # Only show directories
dust -r                                       # Reverse order (smallest first)
dust -X .git                                  # Exclude .git directories
dust -x                                       # Stay on filesystem (don't cross mounts)

# Human-readable sizes
dust -H                                       # Use binary units (1024-based)
dust                                          # Default uses decimal (1000-based)

# Practical examples
dust -d 3 -n 15 /var/log                     # Find large log files (3 levels, top 15)
dust -s ~/Downloads                          # Show subdirectory sizes only
dust -X node_modules -X .git ~/projects      # Exclude common bloat directories
sudo dust -d 2 /                            # Quick system-wide analysis (2 levels)

# Compare with traditional du
dust ~/projects                              # Fast, visual
du -h --max-depth=2 ~/projects | sort -hr   # Traditional equivalent
```


### **htop** - Interactive Process Viewer**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [htop, interactive process viewer]
synonyms: [htop]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Interactive process viewer and system monitor (enhanced version of top)
**Location**: `/opt/homebrew/bin/htop` (install via `brew install htop`)
**Common Use Cases**:

- Real-time system monitoring
- Process management
- Resource usage analysis
- System performance troubleshooting

**See Also**: Related tools in this category

**Examples**:

```bash
# Start htop
htop

# Sort by CPU usage (default)
# Press 'P' in htop

# Sort by memory usage
# Press 'M' in htop

# Filter processes
# Press 'F4' and type filter

# Kill process
# Select process and press 'F9'

# Tree view
# Press 'F5' for tree view

# Show only user processes
# Press 'u' and select user

# Configuration
# Press 'F2' for setup
```


### **btop** - Modern System Monitor**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [btop, modern system monitor]
synonyms: [btop]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Modern and colorful system monitor that shows usage and stats for processor, memory, disks, network and processes
**Location**: `/opt/homebrew/bin/btop`
**Common Use Cases**:

- Advanced system monitoring with beautiful interface
- Real-time process and resource tracking
- Network and disk I/O monitoring
- Modern alternative to htop with more features

**See Also**: `htop` (interactive process viewer), `top` (basic process monitor), `iostat` (I/O statistics)

**Examples**:

```bash
# Start btop
btop

# Interactive commands within btop:
# 'q' or Ctrl+C to quit
# '+' or '-' to adjust update time
# 'Tab' to switch between different views
# Mouse click or arrow keys for navigation
# 't' to toggle process tree mode
# 'f' to filter processes
# 'k' to kill selected process
# 'r' to toggle reverse sorting
# 'm' to cycle through memory views
# 'n' to cycle through network views
```


### **bottom (btm)** - Modern System Monitor ⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [modern, system, monitor]
synonyms: [bottom-btm]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: Cross-platform graphical process/system monitor with a customizable interface, charts, and comprehensive system information display. A modern alternative to htop and top with more visual appeal and features.
**Location**: `/opt/homebrew/bin/btm`
**Installation**: `brew install bottom`
**Common Use Cases**:

- Advanced system monitoring with customizable interface
- Real-time process, CPU, memory, network, and disk monitoring
- Visual system performance analysis with graphs and charts
- Resource usage tracking with historical data
- Temperature monitoring and system diagnostics

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
btm                              # Start bottom with default interface
bottom                           # Alternative command name

# Display options
btm --basic                      # Use basic mode (less fancy UI)
btm --dot-marker                 # Use dot markers for graphs
btm --color default              # Use default color scheme
btm --color gruvbox              # Use gruvbox color scheme

# Process options
btm -c                          # Enable CPU percentage for processes
btm -m                          # Enable memory percentage for processes
btm -p                          # Show process PID
btm --tree                      # Show processes in tree mode
btm --regex                     # Use regex for process filtering

# Network and disk
btm -n                          # Show network usage
btm -d                          # Show disk usage
btm --network_use_binary_prefix # Use binary prefixes for network

# Time and refresh
btm -r 1000                     # Set refresh rate to 1000ms
btm -t                          # Show average CPU usage
btm --hide_table_gap            # Hide gaps in tables

# Advanced configurations
btm --config ~/.config/bottom/bottom.toml  # Use custom config file
btm --hide_time                 # Hide time axis labels
btm --expanded                  # Start in expanded view
btm --use_old_network_legend    # Use old network legend

# Interactive commands (within bottom):
# 'q' or Ctrl+C - quit
# '?' - show help menu
# '/' - search processes
# 'Tab' - cycle through widgets
# 'Shift+Tab' - reverse cycle
# '+' and '-' - adjust time intervals
# 'f' - freeze/unfreeze display
# 'k' - kill selected process
# 'e' - toggle expanded view
# 'd' - kill selected process (alternative)
# 'c' - sort by CPU
# 'm' - sort by memory
# 'p' - sort by PID
# 'n' - sort by name
```
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [leaks, memory leak detection (macos)]
synonyms: [leaks]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Search a process's memory for leaks (native macOS developer tool)
**Location**: `/usr/bin/leaks`
**Difficulty**: ⭐⭐⭐ Intermediate (Memory debugging) / ⭐⭐⭐⭐ Advanced (Analysis interpretation)
**Common Use Cases**:

- Memory leak detection in applications
- Memory analysis and debugging
- Performance troubleshooting
- Application profiling on macOS

**See Also**: `heap` (heap analysis), `malloc_history` (allocation tracking), `instruments` (Xcode profiler)

**Examples**:

```bash
# Find leaks in running process
leaks pid                                       # Check process by PID
leaks process_name                              # Check process by name
sudo leaks -nocontext -quiet process_name       # Quiet mode, no context

# Analyze specific process types
leaks `pgrep Safari`                           # Check Safari for leaks
leaks `pgrep -f node`                          # Check Node.js processes

# Generate reports
leaks -outputGraph /tmp/leaks.dot process_name  # Export as DOT graph
leaks -atExit -- ./my_program                  # Check leaks when program exits

# Continuous monitoring
while true; do leaks process_name; sleep 60; done  # Check every minute

# Memory usage summary
leaks -nocontext process_name | head -20        # Summary without full traces
```


### **heap** - Heap Analysis (macOS)
<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [heap, heap analysis (macos)]
synonyms: [heap]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: List all malloc'd blocks in heap of specified process (native macOS tool)
**Location**: `/usr/bin/heap`
**Difficulty**: ⭐⭐⭐ Intermediate (Memory analysis) / ⭐⭐⭐⭐ Advanced (Detailed debugging)
**Common Use Cases**:

- Heap memory analysis
- Memory allocation debugging
- Investigating memory usage patterns
- Application memory profiling

**See Also**: `leaks` (leak detection), `malloc_history` (allocation history), `vm_stat` (virtual memory stats)

**Examples**:

```bash
# Basic heap analysis
heap pid                                       # Analyze heap by process ID
heap process_name                              # Analyze heap by process name
sudo heap `pgrep Safari`                      # Analyze Safari's heap

# Detailed analysis options
heap -addresses process_name                   # Show allocation addresses
heap -sortBySize process_name                  # Sort allocations by size
heap -sumObjectFields process_name             # Summarize object fields

# Filtering and output
heap -showOnly CLASS_NAME process_name         # Show only specific class
heap -hideStackFrames process_name             # Hide stack frame details
heap -guessNonObjects process_name             # Identify potential non-objects

# Continuous monitoring
heap -addresses `pgrep myapp` > heap_snapshot.txt  # Save heap snapshot
```


### **vm_stat** - Virtual Memory Statistics (macOS)
<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [vm_stat, virtual memory statistics (mac]
synonyms: [vm_stat]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Show virtual memory statistics (native macOS system tool)
**Location**: `/usr/bin/vm_stat`
**Difficulty**: ⭐⭐ Beginner (Basic stats) / ⭐⭐⭐ Intermediate (Analysis)
**Common Use Cases**:

- System memory monitoring
- Virtual memory analysis
- Performance troubleshooting
- System health monitoring

**See Also**: `top` (process monitoring), `activity monitor` (GUI alternative), `iostat` (I/O stats)

**Examples**:

```bash
# Basic memory statistics
vm_stat                                        # Current memory stats
vm_stat 5                                      # Update every 5 seconds
vm_stat 2 10                                   # Update every 2 seconds, 10 times

# Understanding output:
# Pages free: Available physical memory pages
# Pages active: Currently used memory pages
# Pages inactive: Memory that can be reclaimed
# Pages speculative: Memory that might be reclaimed
# Pages wired down: Memory that cannot be paged out

# Continuous monitoring
vm_stat 1 | while read line; do echo "$(date): $line"; done  # Timestamped output

# Memory pressure analysis
vm_stat | grep -E "(free|active|inactive|wired)"  # Key memory indicators
```


### **gprof2dot** - Profile Data Visualization
<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [gprof2dot, profile data visualization]
synonyms: [gprof2dot]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Convert profiling output to dot graphs for visualization
**Location**: `/opt/homebrew/bin/gprof2dot`
**Difficulty**: ⭐⭐⭐ Intermediate (Profiling knowledge) / ⭐⭐⭐⭐ Advanced (Graph interpretation)
**Common Use Cases**:

- Visualizing profiling data
- Performance bottleneck analysis
- Call graph generation
- Profiling report enhancement

**See Also**: `graphviz` (graph visualization), `gprof` (GNU profiler), `instruments` (macOS profiler)

**Examples**:

```bash
# Convert gprof output to graph
gprof program gmon.out | gprof2dot | dot -Tpng -o profile.png

# Python profiling visualization
python -m cProfile -o profile.pstats script.py
gprof2dot -f pstats profile.pstats | dot -Tpng -o python_profile.png

# Callgrind visualization (if available)
gprof2dot -f callgrind callgrind.out.12345 | dot -Tsvg -o callgrind.svg

# Custom formatting
gprof2dot --color-nodes-by-selftime profile.pstats | dot -Tpdf -o profile.pdf
gprof2dot --node-thres=5.0 profile.pstats | dot -Tpng -o filtered_profile.png

# Multiple format support
gprof2dot -f prof profile.prof | dot -Tsvg -o profile.svg  # .prof files
gprof2dot -f hprof java.hprof | dot -Tpng -o java_profile.png  # Java hprof
```


### **bottom** - Modern System Monitor
<!-- metadata:
category: System Administration
difficulty: ⭐⭐ Beginner
aliases: [btm]
tags: [#monitoring, #system, #modern-alternative, #rust]
related: [htop, top, btop, gotop]
keywords: [bottom, btm, system, monitor, cpu, memory, network, process, rust]
synonyms: [btm, rust-monitor, system-monitor, resource-monitor]
platform: [macOS, Linux, Windows]
installation: brew install bottom
-->
**Description**: Cross-platform graphical process/system monitor written in Rust
**Location**: `/opt/homebrew/bin/btm`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- Real-time system monitoring with graphs
- Process management and filtering
- Network usage tracking
- Temperature monitoring
- Battery status (laptops)

**See Also**: `htop` (interactive top), `top` (classic), `btop` (C++ alternative), `gotop` (Go alternative)

**Examples**:

```bash
# Launch bottom
btm                         # Start with default view
bottom                      # Alternative command

# Layout options
btm --basic                # Basic layout (no graphs)
btm --default              # Default layout
btm --battery              # Show battery widget

# Update rates
btm --rate 250            # Update every 250ms (faster)
btm --rate 5000           # Update every 5 seconds (slower)

# Color schemes
btm --color default       # Default colors
btm --color gruvbox       # Gruvbox theme
btm --color nord          # Nord theme

# Process options
btm --group              # Group processes by name
btm --case_sensitive     # Case-sensitive search
btm --whole_word        # Whole word search
btm --regex             # Enable regex search

# Temperature units
btm --fahrenheit        # Use Fahrenheit
btm --kelvin           # Use Kelvin
btm --celsius          # Use Celsius (default)

# Navigation (inside btm)
# Tab/Shift+Tab     - Cycle through widgets
# Arrow keys        - Navigate within widget
# Enter            - Expand/select
# dd               - Kill process
# c                - Sort by CPU
# m                - Sort by memory
# p                - Sort by PID
# n                - Sort by name
# /                - Search
# ?                - Help
# q/Ctrl+C         - Quit

# Configuration file (~/.config/bottom/bottom.toml)
mkdir -p ~/.config/bottom
cat > ~/.config/bottom/bottom.toml << 'EOF'
[flags]
rate = 1000
default_widget_type = "proc"
group_processes = true
case_sensitive = false
whole_word = false
regex = false
temperature_type = "c"
[colors]
theme = "gruvbox"
EOF
related: [df, lsblk, diskutil, mount]
keywords: [duf, df, disk, free, filesystem, mount, usage, modern]
synonyms: [df-replacement, disk-free, filesystem-usage]
platform: [macOS, Linux, Windows]
installation: brew install duf
-->
**Description**: Better df alternative with colors and user-friendly output
**Location**: `/opt/homebrew/bin/duf`
**Difficulty**: ⭐ Beginner
**Common Use Cases**:

- Filesystem usage overview
- Mount point inspection
- Available space checking
- Device type identification
- Cloud storage monitoring

**See Also**: `df` (traditional), `lsblk` (block devices), `diskutil` (macOS), `mount` (mount points)

**Examples**:

```bash
# Basic usage
duf                      # All filesystems
duf /path/to/dir        # Specific path's filesystem
duf /dev/disk1          # Specific device

# Filtering
duf --only local        # Only local filesystems
duf --only network      # Only network filesystems
duf --only fuse         # Only FUSE filesystems
duf --only special      # Only special filesystems

# Hide filesystem types
duf --hide special      # Hide special filesystems
duf --hide network      # Hide network filesystems
duf --hide fuse         # Hide FUSE filesystems
duf --hide loops        # Hide loop devices

# Output options
duf --json             # JSON output
duf --theme dark       # Dark theme
duf --theme light      # Light theme
duf --all              # Show all filesystems
duf --inodes           # Show inode information

# Sorting
duf --sort size        # Sort by size
duf --sort used        # Sort by used space
duf --sort avail       # Sort by available space
duf --sort usage       # Sort by usage percentage

# Display options
duf --hide-mp /boot    # Hide specific mount point
duf --hide-fs tmpfs    # Hide filesystem type
duf --output mountpoint,size,used,avail  # Custom columns

# Warnings
duf --warn-usage 80    # Warn when usage exceeds 80%

# Examples with specific paths
duf ~                  # Home directory filesystem
duf /tmp /var          # Multiple paths
duf --only-mp /,/home  # Specific mount points
```

### **gping** - Ping with Graph
<!-- metadata:
category: System Administration
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#network, #monitoring, #modern-alternative, #rust]
related: [ping, mtr, traceroute, prettyping]
keywords: [gping, ping, graph, latency, network, visual, monitoring]
synonyms: [graphical-ping, visual-ping, ping-graph]
platform: [macOS, Linux, Windows]
installation: brew install gping
-->
**Description**: Ping with real-time graph visualization
**Location**: `/opt/homebrew/bin/gping`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- Visual network latency monitoring
- Connection stability testing
- Multiple host comparison
- Network troubleshooting
- Real-time latency graphs

**See Also**: `ping` (traditional), `mtr` (traceroute+ping), `traceroute` (path tracing), `prettyping` (pretty ping)

**Examples**:

```bash
# Basic usage
gping google.com         # Ping single host
gping 8.8.8.8           # Ping IP address
gping google.com github.com  # Multiple hosts

# Interface selection
gping --interface en0 google.com  # Use specific interface
gping -I en0 google.com           # Short form

# Timing options
gping -n 0.5 google.com  # 500ms interval
gping -n 2 google.com    # 2 second interval

# Buffer and display
gping -b 120 google.com  # 120 second buffer (default: 30)
gping --horizontal-margin 10 google.com  # Adjust margins
gping --vertical-margin 5 google.com

# IPv4/IPv6
gping -4 google.com      # Force IPv4
gping -6 google.com      # Force IPv6

# Simple mode (no graph)
gping -s google.com      # Simple text output

# Watch mode
gping --watch-interval 60 google.com  # Clear and restart every 60s

# Multiple hosts with labels
gping google.com:Google github.com:GitHub  # Custom labels

# Execution options
gping --cmd "ping -c 1" google.com  # Custom ping command
gping google.com &       # Run in background

# Configuration
# Graph legend:
# . = <30ms (good)
# _ = 30-80ms (okay)
# - = 80-130ms (slow)
# = = >130ms (bad)
# ? = timeout/error

# Practical examples
gping 1.1.1.1 8.8.8.8 9.9.9.9  # Compare DNS servers
gping gateway.local     # Monitor local gateway
gping $(curl -s ifconfig.me)  # Ping your external IP
```


### **iostat** - I/O Statistics**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [iostat, i/o statistics]
synonyms: [iostat]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Report input/output statistics for devices and partitions
**Location**: `/usr/bin/iostat`
**Common Use Cases**:

- Disk performance monitoring
- I/O bottleneck identification
- Storage system analysis
- Performance tuning

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic I/O statistics
iostat

# Continuous monitoring (every 2 seconds)
iostat 2

# Detailed disk statistics
iostat -d

# Extended statistics
iostat -x

# Specific device monitoring
iostat -d disk0

# CPU and I/O combined
iostat -c

# Human-readable output
iostat -h

# Network filesystem statistics
iostat -n

# Monitor for specific duration
iostat 1 10  # Every 1 second for 10 times
```


### **lsof** - List Open Files**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [lsof, list open files]
synonyms: [lsof]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: List open files and the processes using them
**Location**: `/usr/bin/lsof`
**Common Use Cases**:

- Find which process is using a file
- Network connection monitoring
- Troubleshoot "file busy" errors
- Security investigation

**See Also**: Related tools in this category

**Examples**:

```bash
# List all open files
lsof

# Files opened by specific process
lsof -p PID

# Files opened by user
lsof -u username

# Files in specific directory
lsof +D /path/to/directory

# Network connections
lsof -i

# Specific port
lsof -i :80
lsof -i :22

# TCP connections only
lsof -i tcp

# UDP connections only
lsof -i udp

# Files opened by command name
lsof -c ssh

# Which process is using a file
lsof /path/to/file

# Deleted files still in use
lsof +L1

# IPv6 connections
lsof -i 6
```


### **pgrep/pkill** - Process Lookup and Signal**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [pgrep/pkill, process lookup and signal]
synonyms: [pgrep/pkill]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Look up or signal processes based on name and attributes
**Location**: `/usr/bin/pgrep`, `/usr/bin/pkill`
**Common Use Cases**:

- Find process IDs by name
- Kill processes by name or pattern
- Process management automation
- System cleanup scripts

**See Also**: Related tools in this category

**Examples**:

```bash
# Find processes by name
pgrep ssh
pgrep -f "python script.py"

# Show process names with PIDs
pgrep -l ssh

# Find by user
pgrep -u username

# Find newest/oldest process
pgrep -n ssh  # newest
pgrep -o ssh  # oldest

# Kill processes by name
pkill ssh
pkill -f "python script.py"

# Kill by user
pkill -u username

# Send specific signal
pkill -USR1 nginx
pkill -HUP sshd

# Kill with confirmation
pkill -i firefox

# Exact match only
pgrep -x ssh

# Parent process filtering
pgrep -P parent_pid
```


### **uptime** - System Uptime and Load**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [uptime, system uptime and load]
synonyms: [uptime]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Show system uptime and load averages
**Location**: `/usr/bin/uptime`
**Common Use Cases**:

- Check system uptime
- Monitor load averages
- System health assessment
- Performance baseline establishment

**See Also**: Related tools in this category

**Examples**:

```bash
# Show uptime and load
uptime

# Pretty format (if supported)
uptime -p

# Since when system is up
uptime -s

# Load averages explanation:
# - 1 minute average
# - 5 minute average
# - 15 minute average

# Monitor load continuously
watch uptime

# Log uptime periodically
while true; do
    echo "$(date): $(uptime)"
    sleep 300
done >> uptime.log
```


### **w** - Show Logged-in Users**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [w, show logged-in users]
synonyms: [w]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Show who is logged on and what they are doing
**Location**: `/usr/bin/w`
**Common Use Cases**:

- Monitor user activity
- System security auditing
- User session management
- Load investigation

**See Also**: Related tools in this category

**Examples**:

```bash
# Show all logged-in users
w

# Show specific user
w username

# Short format (no process info)
w -s

# No header
w -h

# Show IP addresses instead of hostnames
w -i

# From where users logged in
w -f

# Show only user and terminal
w -u

# Monitor user activity
watch -n 30 w
```


### **who** - Show Logged-in Users (Simple)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [who, show logged-in users (simple)]
synonyms: [who]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Show who is logged on (simpler than w)
**Location**: `/usr/bin/who`
**Common Use Cases**:

- Quick user list
- Login session information
- System access monitoring
- Security auditing

**See Also**: Related tools in this category

**Examples**:

```bash
# Show logged-in users
who

# Show with login time
who -T

# Show only usernames
who -q

# Show system boot time
who -b

# Show run level
who -r

# Show all information
who -a

# Show current user info
who am i
whoami

# Show users and idle times
who -u

# Monitor logins
watch who
```


### **whoami** - Show Current Username**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [whoami, show current username]
synonyms: [whoami]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Print the username associated with the current effective user ID
**Location**: `/usr/bin/whoami`
**Common Use Cases**:

- Script user identification
- Security verification
- Environment debugging
- Access control checks

**See Also**: Related tools in this category

**Examples**:

```bash
# Show current username
whoami

# Use in scripts for conditional logic
if [ "$(whoami)" = "root" ]; then
    echo "Running as administrator"
fi

# Combine with other commands
echo "User $(whoami) logged in at $(date)"

# Check effective vs real user (useful with sudo)
whoami  # shows effective user
id -un  # shows real user
```


### **groups** - Show Group Memberships**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [groups, show group memberships]
synonyms: [groups]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Print group memberships for the current user or specified users
**Location**: `/usr/bin/groups`
**Common Use Cases**:

- Access permission verification
- Security auditing
- User account analysis
- Troubleshooting file access

**See Also**: Related tools in this category

**Examples**:

```bash
# Show current user's groups
groups

# Show groups for specific user
groups username

# Show groups for multiple users
groups user1 user2 user3

# Use in scripts for permission checks
if groups | grep -q "admin"; then
    echo "User has admin privileges"
fi

# Compare with id command output
groups          # simple group list
id -Gn          # same info via id command
id -Gn username # groups for specific user
```


### **last** - Show Login History**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [last, show login history]
synonyms: [last]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Show listing of last logged-in users
**Location**: `/usr/bin/last`
**Common Use Cases**:

- Login audit trails
- Security investigation
- User access history
- System access patterns

**See Also**: Related tools in this category

**Examples**:

```bash
# Show last logins
last

# Show specific user
last username

# Show specific terminal
last tty1

# Limit number of entries
last -n 10

# Show from specific time
last -s yesterday
last -s "2024-01-01"

# Show until specific time
last -t "2024-01-31"

# Show hostnames
last -d

# Show IPs instead of hostnames
last -i

# Show bad logins (failed attempts)
last -f /var/log/btmp

# Show system reboots
last reboot

# Show shutdowns
last shutdown
```


### **vmstat** - Virtual Memory Statistics**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [vmstat, virtual memory statistics]
synonyms: [vmstat]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Report virtual memory statistics and system activity
**Location**: `/usr/bin/vm_stat` (macOS equivalent)
**Common Use Cases**:

- Memory usage monitoring
- System performance analysis
- Resource bottleneck identification
- Capacity planning

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic memory statistics (macOS)
vm_stat

# Continuous monitoring
vm_stat 5  # Every 5 seconds

# Show in different units
vm_stat -c 10 5  # 10 samples, 5 second intervals

# Understanding output:
# - free: available memory
# - active: memory in use
# - inactive: memory not actively used
# - wired: kernel memory (can't be swapped)
# - compressed: compressed memory pages

# Script for monitoring
#!/bin/bash
while true; do
    echo "=== $(date) ==="
    vm_stat
    echo
    sleep 60
done
```


### **activity_monitor** - macOS Activity Monitor CLI**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [activity_monitor, macos activity monitor cli]
synonyms: [activity_monitor]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Command-line access to Activity Monitor functionality
**Location**: Various system utilities
**Common Use Cases**:

- Process monitoring
- Resource usage tracking
- System performance analysis
- Troubleshooting performance issues

**See Also**: Related tools in this category

**Examples**:

```bash
# CPU usage by process
ps aux | sort -k3nr | head -10

# Memory usage by process
ps aux | sort -k4nr | head -10

# Real-time process monitoring
top -o cpu -s 2

# Disk usage by process
sudo fs_usage -w -f filesys | head -20

# Network activity by process
sudo netstat -i -b

# System activity summary
sar -u 1 5  # If sysstat installed

# Energy usage (macOS)
sudo powermetrics -n 1 -i 1000

# Comprehensive system info
system_profiler SPHardwareDataType
```


### **dtruss** - DTrace Process Tracing (macOS)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [dtruss, dtrace process tracing (macos)]
synonyms: [dtruss]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Dynamic tracing of process system calls (DTrace-based)
**Location**: `/usr/bin/dtruss`
**Common Use Cases**:

- System call tracing
- Process debugging
- Performance analysis
- Security investigation

**See Also**: Related tools in this category

**Examples**:

```bash
# Trace system calls for process
sudo dtruss -p PID

# Trace new process execution
sudo dtruss command

# Trace specific system calls
sudo dtruss -t open command

# Trace file operations
sudo dtruss -t read,write -p PID

# Trace network operations
sudo dtruss -t socket,connect -p PID

# Count system calls
sudo dtruss -c -p PID

# Follow child processes
sudo dtruss -f command

# Trace with timestamps
sudo dtruss -t all -e -p PID
```


### **fs_usage** - File System Usage (macOS)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [fs_usage, file system usage (macos)]
synonyms: [fs_usage]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Monitor file system activity in real-time
**Location**: `/usr/bin/fs_usage`
**Common Use Cases**:

- File access monitoring
- Disk I/O analysis
- Application behavior investigation
- Performance troubleshooting

**See Also**: Related tools in this category

**Examples**:

```bash
# Monitor all file system activity
sudo fs_usage

# Filter by process name
sudo fs_usage -w grep

# Filter by specific process
sudo fs_usage -p PID

# Show only specific operations
sudo fs_usage -f filesys

# Network file system operations
sudo fs_usage -f network

# Exclude certain processes
sudo fs_usage -e Mail -e Safari

# Wide output format
sudo fs_usage -w

# Monitor specific path
sudo fs_usage | grep "/path/to/watch"
```


### **iotop** - I/O Usage by Process**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [iotop, i/o usage by process]
synonyms: [iotop]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display I/O usage by processes (third-party tool)
**Location**: Install via `brew install iotop` or similar
**Common Use Cases**:

- Identify I/O-heavy processes
- Disk performance troubleshooting
- Resource usage optimization
- System bottleneck identification

**See Also**: Related tools in this category

**Examples**:

```bash
# Monitor I/O by process
sudo iotop

# Sort by total I/O
sudo iotop -o

# Show accumulated I/O
sudo iotop -a

# Only show processes doing I/O
sudo iotop -o

# Batch mode for logging
sudo iotop -b -n 5

# Filter by user
sudo iotop -u username

# Alternative: Use built-in tools
sudo fs_usage -w -f filesys | grep -E "W|R"
```


### **uname** - System Information**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [uname, system information]
synonyms: [uname]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display system information
**Location**: `/usr/bin/uname`
**Common Use Cases**:

- System identification
- Platform detection
- Kernel information
- Architecture discovery

**See Also**: `hostname` (system name), `uptime` (system uptime)

**Examples**:

```bash
# Basic system info
uname

# All information
uname -a

# Kernel name
uname -s

# Kernel version
uname -r

# Kernel release
uname -v

# Machine hardware name
uname -m

# Processor type
uname -p

# Hardware platform
uname -i

# Operating system
uname -o

# Node name (hostname)
uname -n
```


### **hostname** - System Name**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [hostname, system name]
synonyms: [hostname]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display or set system hostname
**Location**: `/bin/hostname`
**Common Use Cases**:

- System identification
- Network configuration
- Script customization
- Remote system identification

**See Also**: `uname` (system info), `whoami` (current user)

**Examples**:

```bash
# Display hostname
hostname

# Display FQDN (Fully Qualified Domain Name)
hostname -f

# Display IP address
hostname -I

# Display short name
hostname -s

# Display all addresses
hostname -a

# Set hostname (requires sudo)
sudo hostname newhostname

# Display domain name
hostname -d
```


### **tar** - Archive Tool**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [tar, archive tool]
synonyms: [tar]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Manipulate tape archives, supports multiple formats
**Location**: `/usr/bin/tar`
**Common Use Cases**:

- File archiving and backup
- Compression and decompression
- Directory packaging

**See Also**: `zip` (cross-platform archives), `gzip` (individual file compression), `rsync` (sync with compression)

**Examples**:

```bash
# Create compressed archive
tar czf archive.tar.gz directory/

# Extract archive
tar xzf archive.tar.gz

# List archive contents
tar tzf archive.tar.gz

# Create with auto-compression
tar caf archive.tar.xz files/
```


### **zip/unzip** - ZIP Archives**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [zip/unzip, zip archives]
synonyms: [zip/unzip]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Create and extract ZIP archives
**Location**: `/usr/bin/zip`, `/usr/bin/unzip`
**Common Use Cases**:

- Cross-platform archiving
- File compression
- Package distribution

**See Also**: Related tools in this category

**Examples**:

```bash
# Create ZIP archive
zip -r archive.zip directory/

# Extract ZIP
unzip archive.zip

# List ZIP contents
unzip -l archive.zip

# Extract to specific directory
unzip archive.zip -d /path/
```


### **gzip/gunzip** - GZIP Compression**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [gzip/gunzip, gzip compression]
synonyms: [gzip/gunzip]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Compress files using GZIP algorithm
**Location**: `/usr/bin/gzip`, `/usr/bin/gunzip`
**Common Use Cases**:

- File compression
- Log file management
- Space optimization

**See Also**: Related tools in this category

**Examples**:

```bash
# Compress file
gzip file.txt

# Decompress file
gunzip file.txt.gz

# Keep original file
gzip -k file.txt
```

### **bzip2/bunzip2** - BZIP2 Compression**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [bzip2/bunzip2, bzip2 compression]
synonyms: [bzip2/bunzip2]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Block-sorting file compressor using Burrows-Wheeler algorithm
**Location**: `/usr/bin/bzip2`, `/usr/bin/bunzip2`
**Compression**: Excellent (better than gzip, slower)
**Speed**: Moderate
**Common Use Cases**:

- High-compression archiving
- Backup storage optimization
- Long-term file storage

**See Also**: Related tools in this category

**Examples**:

```bash
# Compress file (removes original)
bzip2 file.txt

# Decompress file
bunzip2 file.txt.bz2

# Keep original file while compressing
bzip2 -k file.txt

# Decompress to stdout
bzcat file.txt.bz2

# Test archive integrity
bzip2 -t file.txt.bz2

# Verbose compression with ratio display
bzip2 -v file.txt

# Integration with tar
tar cjf archive.tar.bz2 directory/
tar xjf archive.tar.bz2
```

### **xz/unxz** - XZ Compression**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [xz/unxz, xz compression]
synonyms: [xz/unxz]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: High-ratio compression using LZMA/LZMA2 algorithms
**Location**: `/opt/homebrew/bin/xz`, `/opt/homebrew/bin/unxz`
**Compression**: Excellent (best ratio, slowest)
**Speed**: Slow compression, fast decompression
**Common Use Cases**:

- Maximum compression for archival
- Software distribution
- Kernel and system packages

**See Also**: Related tools in this category

**Examples**:

```bash
# Compress file
xz file.txt

# Decompress file
unxz file.txt.xz

# Keep original file
xz -k file.txt

# Compress with specific level (0=fastest, 9=best)
xz -9 file.txt

# Decompress to stdout
xzcat file.txt.xz

# LZMA format compatibility
xz --format=lzma file.txt
unlzma file.txt.lzma

# Integration with tar
tar cJf archive.tar.xz directory/
tar xJf archive.tar.xz
```


### **zstd** - Zstandard Compression**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [zstd, zstandard compression]
synonyms: [zstd]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Fast lossless compression algorithm by Facebook
**Location**: `/opt/homebrew/bin/zstd`
**Compression**: Good (balanced ratio and speed)
**Speed**: Very fast
**Common Use Cases**:

- Real-time compression
- Network data transfer
- Modern backup systems

**See Also**: Related tools in this category

**Examples**:

```bash
# Compress file
zstd file.txt

# Decompress file
zstd -d file.txt.zst

# Compress with level (1=fastest, 19=slowest, 3=default)
zstd -3 file.txt

# Ultra compression (up to level 22)
zstd --ultra -22 file.txt

# Decompress to stdout
zstdcat file.txt.zst

# Integration with tar
tar --use-compress-program=zstd -cf archive.tar.zst directory/
tar --use-compress-program=zstd -xf archive.tar.zst
```


### **lz4** - LZ4 Compression**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [lz4, lz4 compression]
synonyms: [lz4]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Extremely fast compression focusing on speed over ratio
**Location**: `/opt/homebrew/bin/lz4`
**Compression**: Moderate (prioritizes speed)
**Speed**: Extremely fast
**Common Use Cases**:

- Real-time data compression
- Temporary file compression
- High-throughput applications

**See Also**: Related tools in this category

**Examples**:

```bash
# Compress file
lz4 file.txt file.txt.lz4

# Decompress file
lz4 -d file.txt.lz4

# Decompress to stdout
lz4 -dc file.txt.lz4

# Best compression mode
lz4 --best file.txt

# Integration with tar
tar cf - directory/ | lz4 - archive.tar.lz4
lz4 -dc archive.tar.lz4 | tar -xv
```


### **compress/uncompress** - Classic UNIX Compression**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [compress/uncompress, classic unix compression]
synonyms: [compress/uncompress]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Traditional UNIX compression using adaptive Lempel-Ziv coding
**Location**: `/usr/bin/compress`, `/usr/bin/uncompress`
**Compression**: Poor (legacy tool)
**Speed**: Fast
**Common Use Cases**:

- Legacy system compatibility
- Historical file recovery
- Simple compression needs

**See Also**: Related tools in this category

**Examples**:

```bash
# Compress file (creates .Z extension)
compress file.txt

# Decompress file
uncompress file.txt.Z

# Force compression even if no size reduction
compress -f file.txt

# Compress to stdout
compress -c file.txt > file.txt.Z
```

### **cpio** - Copy In/Out Archives**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [cpio, copy in/out archives]
synonyms: [cpio]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Archive tool that copies files to and from archives
**Location**: `/usr/bin/cpio`
**Common Use Cases**:

- System backups
- File system imaging
- Legacy archive handling

**See Also**: Related tools in this category

**Examples**:

```bash
# Create archive from file list
find directory/ | cpio -o > archive.cpio

# Extract archive
cpio -i < archive.cpio

# Create with verbose output
find directory/ | cpio -ov > archive.cpio

# Extract specific files
cpio -i "*.txt" < archive.cpio

# Create with gzip compression
find directory/ | cpio -o | gzip > archive.cpio.gz

# Extract gzipped archive
gunzip -c archive.cpio.gz | cpio -i
```


### **strip** - Remove Symbols**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [strip, remove symbols]
synonyms: [strip]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Remove or modify symbol tables from executables
**Location**: `/usr/bin/strip`
**Common Use Cases**:

- Reducing executable size
- Removing debug information
- Preparing for distribution

**See Also**: Related tools in this category

**Examples**:

```bash
# Strip all symbols from executable
strip executable

# Strip debug symbols only
strip --strip-debug program.o

# Strip to specific output file
strip input_file -o output_file

# Check file size before/after
ls -l program
strip program
ls -l program
```


### **zcat** - View Compressed Files**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: System Administration
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [zcat, view compressed files]
synonyms: [zcat]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display compressed files without decompressing to disk
**Location**: `/usr/bin/zcat`
**Common Use Cases**:

- View compressed logs
- Pipe compressed data
- Read compressed files directly
- Compress file analysis

**See Also**: `gzip` (compression), `bzcat` (bzip2 files), `cat` (uncompressed files)

**Examples**:

```bash
# View gzipped file
zcat file.txt.gz

# View multiple compressed files
zcat *.gz

# Pipe to other commands
zcat log.gz | grep ERROR

# Search in compressed files
zcat *.gz | grep pattern

# Count lines in compressed file
zcat file.gz | wc -l

# Combine compressed files
zcat file1.gz file2.gz > combined.txt
```

