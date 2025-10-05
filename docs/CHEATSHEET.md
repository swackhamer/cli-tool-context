# CLI Tools Quick Reference Cheat Sheet

> Quick commands for common tasks. For detailed documentation, see [TOOLS.md](../TOOLS.md). Updated with <!-- cheat-tools-count -->327<!-- /cheat-tools-count --> tools across <!-- cheat-categories-count -->40<!-- /cheat-categories-count --> categories. Last updated: October 5, 2025

## 🚀 Most Used Commands - Quick Copy & Paste

### File Operations
```bash
ls -la                      # List all files with details
ls -lh                      # Human-readable sizes
cp -r source/ dest/         # Copy directory recursively  
mv old.txt new.txt          # Rename/move file
rm -i file.txt              # Remove with confirmation
mkdir -p path/to/dir        # Create nested directories
touch newfile.txt           # Create empty file
```

### Modern Alternatives (Faster & Better)
```bash
eza -la                     # Better ls with icons/colors
fd pattern                  # Better find (respects .gitignore)
rg "search"                 # Better grep (5-10x faster)
bat file.txt                # Better cat (syntax highlighting)
dust                        # Better du (visual tree)
procs                       # Better ps (colored, formatted)
sd "old" "new" file.txt     # Better sed (intuitive syntax)
```

### Text Processing Essentials
```bash
grep "pattern" file.txt                      # Search in file
grep -r "pattern" .                          # Recursive search
sed 's/old/new/g' file.txt                   # Replace text
awk '{print $1}' file.txt                    # Print first column
cut -d',' -f1,3 file.csv                     # Extract columns 1,3
sort file.txt | uniq                         # Sort and deduplicate
head -20 file.txt                            # First 20 lines
tail -f logfile.log                          # Follow log file
wc -l file.txt                               # Count lines
```

### Git One-Liners
```bash
git status                                   # Check status
git add .                                    # Stage all changes
git commit -m "message"                      # Commit with message
git push origin main                         # Push to remote
git pull --rebase                           # Pull with rebase
git log --oneline -10                       # Last 10 commits
git diff HEAD~1                              # Compare with last commit
git stash                                    # Stash changes
git branch -a                                # List all branches
git checkout -b new-branch                   # Create & switch branch
```

### Network & Download
```bash
curl -O https://example.com/file.zip        # Download file
curl -I https://example.com                 # Headers only
wget -c https://example.com/large.iso       # Resume download
ssh user@host                                # SSH connection
scp file.txt user@host:~/                   # Copy over SSH
rsync -avz source/ user@host:dest/          # Sync directories
ping -c 4 google.com                        # Ping 4 times
dig example.com                              # DNS lookup
netstat -an | grep LISTEN                   # Show listening ports
lsof -i :8080                               # What's using port 8080
```

### Process Management
```bash
ps aux | grep process                       # Find process
kill -9 PID                                 # Force kill process
killall process_name                        # Kill by name
top                                         # System monitor
htop                                        # Better system monitor
jobs                                        # List background jobs
fg %1                                       # Bring job to foreground
bg %1                                       # Send job to background
nohup command &                             # Run immune to hangups
```

### Disk & Storage
```bash
df -h                                       # Disk free space
du -sh *                                    # Directory sizes
du -h . | sort -hr | head -20              # Top 20 largest
ncdu /path                                  # Interactive disk usage
find . -size +100M                         # Files over 100MB
find . -mtime -7                           # Modified in last 7 days
```

### Archives & Compression
```bash
tar -czf archive.tar.gz files/             # Create compressed archive
tar -xzf archive.tar.gz                    # Extract compressed archive
tar -tf archive.tar                        # List contents
zip -r archive.zip folder/                 # Create zip
unzip archive.zip                          # Extract zip
gzip file.txt                              # Compress file
gunzip file.txt.gz                         # Decompress file
```

### Data Processing
```bash
jq '.' file.json                           # Pretty print JSON
jq '.field' file.json                      # Extract JSON field
csvcut -c 1,3 data.csv                     # Select CSV columns
csvstat data.csv                           # CSV statistics
miller --csv stats1 -a mean -f value data.csv  # CSV math operations
sqlite3 db.sqlite "SELECT * FROM table;"   # Query SQLite
```

### Docker & Containers
```bash
docker ps                                   # List running containers
docker ps -a                               # List all containers
docker images                              # List images
docker run -it ubuntu bash                 # Run interactive container
docker exec -it container_id bash          # Enter running container
docker-compose up -d                       # Start services detached
docker logs container_id                   # View container logs
docker system prune -a                     # Clean everything
```

### System Information
```bash
uname -a                                   # System info
uptime                                     # System uptime
whoami                                     # Current user
which command                              # Command location
env                                        # Environment variables
echo $PATH                                 # Show PATH
date                                       # Current date/time
cal                                        # Calendar
```

## 🔥 Power User Combos

### Find and Process Files
```bash
# Find and delete old logs
find /var/log -name "*.log" -mtime +30 -delete

# Find and grep in files
find . -type f -name "*.js" -exec grep -l "TODO" {} \;

# Better: using fd and rg
fd -e js -x rg -l "TODO"

# Find large files and sort
find . -type f -size +10M -exec ls -lh {} \; | sort -k5 -hr
```

### Text Processing Pipelines
```bash
# Top 10 most frequent words
cat file.txt | tr ' ' '\n' | sort | uniq -c | sort -rn | head -10

# Extract emails from file
grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b" file.txt

# Count lines of code (excluding blanks and comments)
find . -name "*.py" | xargs grep -v '^\s*#' | grep -v '^\s*$' | wc -l
```

### Git Advanced
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Show files changed in last 5 commits
git diff --name-only HEAD~5

# Find who changed a line
git blame file.txt | grep "line content"

# Clean untracked files (dry run first!)
git clean -n  # dry run
git clean -f  # actually clean
```

### Performance Monitoring
```bash
# Monitor command execution time
time command
hyperfine 'command1' 'command2'  # Compare performance

# Watch command output
watch -n 2 'df -h'  # Update every 2 seconds

# Monitor network bandwidth
sudo iftop -i en0

# Memory usage by process
ps aux | sort -nrk 4 | head -10
```

## ⚡ Speed Tips

| Task | Slow | Fast | Fastest |
|------|------|------|---------|
| Search text | `grep -r` | `rg` | `rg --threads 8` |
| Find files | `find` | `fd` | `fd -j 8` |
| List files | `ls -la` | `eza -la` | `eza -la --icons` |
| View file | `cat` | `bat` | `bat --style=numbers` |
| Disk usage | `du -h` | `ncdu` | `dust` |
| Process list | `ps aux` | `htop` | `btop` |

## 🚨 Safety Aliases

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
alias rm='rm -i'                          # Confirm before delete
alias cp='cp -i'                          # Confirm before overwrite
alias mv='mv -i'                          # Confirm before overwrite
alias ls='ls --color=auto'                # Colored output
alias grep='grep --color=auto'            # Colored matches
alias df='df -h'                          # Human readable by default
# macOS: Use 'vm_stat' or 'memory_pressure' instead of 'free'
alias meminfo='vm_stat'                   # macOS memory info
alias du='du -h'                          # Human readable sizes
```

## 🎯 Quick Troubleshooting

```bash
# Command not found
which command_name                        # Check if installed
echo $PATH                                # Check PATH
brew install command_name                 # Install via Homebrew

# Permission denied
ls -la file                              # Check permissions
chmod +x script.sh                       # Make executable
sudo command                             # Run as root

# Disk full
df -h                                    # Check disk space
dust -d 3 /                              # Find space hogs
brew cleanup                             # Clean Homebrew cache

# Process stuck
ps aux | grep process_name              # Find PID
kill -9 PID                             # Force kill
killall process_name                    # Kill all by name

# Network issues
ping 8.8.8.8                            # Test connectivity
dig google.com                          # Test DNS
netstat -an | grep ESTABLISHED          # Active connections
```

## 📌 Essential Shortcuts

### Terminal Navigation
- `Ctrl+A` - Beginning of line
- `Ctrl+E` - End of line
- `Ctrl+K` - Delete to end of line
- `Ctrl+U` - Delete to beginning
- `Ctrl+L` - Clear screen
- `Ctrl+R` - Search history
- `Ctrl+C` - Cancel command
- `Ctrl+Z` - Suspend to background
- `Ctrl+D` - Exit/EOF

### Vim Survival
```
i         - Insert mode
Esc       - Normal mode
:w        - Save
:q        - Quit
:wq       - Save and quit
:q!       - Quit without saving
/pattern  - Search
n         - Next match
dd        - Delete line
u         - Undo
```

## 🆕 New Power Tools Quick Reference

### Fuzzy Finding with fzf
```bash
# Interactive file selection
fzf                                # Basic fuzzy finder
vim $(fzf)                         # Open selected file in vim
cd $(find * -type d | fzf)        # Change to selected directory

# Command history search (after setup)
Ctrl+R                             # Fuzzy search command history

# Kill process interactively
kill -9 $(ps aux | fzf | awk '{print $2}')

# Git branch switching
git checkout $(git branch -a | fzf)
```

### Terminal Multiplexing with tmux
```bash
# Session management
tmux new -s session_name          # Create named session
tmux attach -t session_name        # Attach to session
tmux ls                           # List sessions
tmux detach                       # Detach from session (Ctrl+b d)

# Window & pane management (after starting tmux)
Ctrl+b c                          # Create new window
Ctrl+b ,                          # Rename window
Ctrl+b %                          # Split pane vertically
Ctrl+b "                          # Split pane horizontally
Ctrl+b arrow_key                  # Navigate between panes
Ctrl+b x                          # Kill current pane
```

### Smart Navigation with zoxide
```bash
# Setup (add to ~/.zshrc or ~/.bashrc)
eval "$(zoxide init zsh)"          # or bash

# Usage
z folder_name                      # Jump to most frecent matching folder
zi folder_name                     # Interactive selection with fzf
z -                               # Go to previous directory
z ~                               # Go to home directory

# Examples
z proj                            # Jumps to ~/Documents/projects if frequently used
z down                            # Jumps to ~/Downloads
```

### Modern Vim with Neovim
```bash
# Launch
nvim file.txt                     # Open file in neovim
nvim .                            # Open file explorer

# Key differences from vim
:checkhealth                      # Check nvim configuration
:terminal                         # Open integrated terminal
:split term://bash                # Terminal in split window

# Plugin management (with vim-plug)
:PlugInstall                      # Install plugins
:PlugUpdate                       # Update plugins
:PlugClean                        # Remove unused plugins
```

### Quick Help with tldr
```bash
# Get practical examples
tldr git                          # Quick git examples
tldr tar                          # Common tar usage
tldr docker                       # Docker command examples
tldr --update                     # Update tldr pages cache

# Comparison with man
man tar                           # Full manual (detailed)
tldr tar                          # Just the examples you need
```

### Shell Prompt with Starship
```bash
# Installation
curl -sS https://starship.rs/install.sh | sh

# Setup (add to ~/.zshrc or ~/.bashrc)
eval "$(starship init zsh)"       # or bash

# Configuration (~/.config/starship.toml)
starship config                   # Open config in editor
starship preset nerd-font-symbols # Apply preset
starship explain                  # Explain current prompt
```

### Environment Management with direnv
```bash
# Setup
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc  # or bash

# Usage in project directory
echo 'export API_KEY="secret"' > .envrc
direnv allow                       # Approve the .envrc file

# Automatic loading
cd project/                       # Env vars loaded automatically
cd ..                             # Env vars unloaded automatically
```

## 🤖 AI-Powered CLI Tools

### GitHub Copilot CLI
```bash
# Installation
gh extension install github/gh-copilot

# Generate commands
gh copilot suggest "find all Python files modified today"
gh copilot suggest "compress all images in current directory"

# Explain commands
gh copilot explain "git rebase -i HEAD~3"
gh copilot explain "find . -type f -exec chmod 644 {} \;"
```

### Interactive AI Chat (aichat)
```bash
# Basic usage
aichat "How do I find large files on macOS?"
aichat -r developer "Review this code: $(cat script.py)"

# With context
aichat -f file.py "Explain this function"
aichat -c "Continue our previous discussion"
```

### LLM Command Line
```bash
# Basic queries
llm "Generate a bash script to backup MySQL database"
llm -m gpt-4 "Optimize this SQL query: $(cat query.sql)"

# With plugins
llm install llm-python
llm python "Generate a Flask REST API boilerplate"
```

---

*Keep this cheat sheet handy for quick command reference. For detailed usage, see ../TOOLS.md*
