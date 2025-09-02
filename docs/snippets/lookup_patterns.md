# Tool Lookup Patterns

Common patterns for finding the right tool for specific tasks.

## By Task

### File Operations
```bash
# File search
fd              # Modern, fast file finder
find            # Traditional UNIX finder
locate          # Database-based finder

# File viewing
bat             # Syntax highlighting viewer
cat             # Simple concatenate/view
less            # Pager for large files
```

### Text Processing
```bash
# Text search
ripgrep         # Fastest grep alternative
grep            # Traditional pattern search
ag              # The Silver Searcher

# Text manipulation
sd              # Modern sed replacement
sed             # Stream editor
awk             # Pattern scanning
```

### Process Management
```bash
# Process monitoring
htop            # Interactive process viewer
top             # Traditional process monitor
procs           # Modern ps replacement
bottom          # Resource monitor with graphs

# Process control
kill            # Terminate processes
pkill           # Kill by name
killall         # Kill all by name
```

### Disk Usage
```bash
# Disk analysis
dust            # Visual disk usage
ncdu            # NCurses disk usage
du              # Traditional disk usage
df              # Filesystem usage
```

## By Difficulty Level

### ⭐⭐ Beginner Tools
- `ls`, `cd`, `pwd` - Basic navigation
- `cp`, `mv`, `rm` - File operations
- `cat`, `echo` - Text display
- `mkdir`, `touch` - File creation

### ⭐⭐⭐ Intermediate Tools
- `grep`, `sed`, `awk` - Text processing
- `find`, `xargs` - File searching
- `tar`, `zip` - Archive management
- `ssh`, `scp` - Remote access

### ⭐⭐⭐⭐ Advanced Tools
- `dtrace` - System tracing
- `nmap` - Network scanning
- `docker` - Container management
- `git` - Version control

### ⭐⭐⭐⭐⭐ Expert Tools
- `lldb` - Low-level debugging
- `masscan` - Port scanning
- `bazel` - Build system
- `perf` - Performance analysis