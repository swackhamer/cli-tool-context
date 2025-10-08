## Terminal & Session Management

### **screen** - Terminal Multiplexer**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [screen, terminal multiplexer]
synonyms: [screen]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Full-screen window manager that multiplexes a physical terminal
**Location**: `/usr/bin/screen`
**Common Use Cases**:

- Remote session management
- Long-running process isolation
- Multiple terminal sessions
- Session persistence

**See Also**: `nohup` (background processes), `tmux` (modern alternative), `jobs` (job control)

**Examples**:

```bash
# Start new screen session
screen

# Start named session
screen -S mysession

# List active sessions
screen -ls

# Reattach to session
screen -r

# Reattach to specific session
screen -r mysession

# Detach from session (within screen)
# Ctrl+A, then D

# Kill session
screen -X -S mysession quit

# Create new window (within screen)
# Ctrl+A, then C

# Switch between windows (within screen)
# Ctrl+A, then N (next) or P (previous)

# Send command to session
screen -S mysession -X stuff "ls\n"
```


### **script** - Record Terminal Session**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [script, record terminal session]
synonyms: [script]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Record terminal sessions
**Location**: `/usr/bin/script`
**Common Use Cases**:

- Session logging
- Training documentation
- Debugging record
- Compliance logging

**See Also**: `screen` (session management), `history` (command history)

**Examples**:

```bash
# Start recording session
script

# Record to specific file
script session.log

# Append to existing file
script -a session.log

# Quiet mode (no start/stop messages)
script -q session.log

# Record with timing
script -t 2>timing.log session.log

# Replay session with timing
scriptreplay timing.log session.log

# Exit recording
exit
```


### **tput** - Terminal Capability Interface**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [tput, terminal capability interface]
synonyms: [tput]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Initialize a terminal or query terminfo database for terminal-dependent capabilities
**Location**: `/usr/bin/tput`
**Common Use Cases**:

- Terminal control and formatting
- Cursor positioning
- Color output generation
- Screen manipulation

**See Also**: Related tools in this category

**Examples**:

```bash
# Clear screen
tput clear

# Move cursor to position (row, col)
tput cup 5 10

# Set text colors
tput setaf 1  # Red text
tput setaf 2  # Green text
tput setaf 3  # Yellow text
tput setaf 4  # Blue text
tput sgr0     # Reset to normal

# Bold and underline text
tput bold
echo "Bold text"
tput smul
echo "Underlined text"
tput rmul  # Remove underline

# Get terminal dimensions
cols=$(tput cols)
lines=$(tput lines)
echo "Terminal: ${cols}x${lines}"

# Save and restore cursor position
tput sc    # Save cursor
tput rc    # Restore cursor

# Terminal bell/beep
tput bel

# Hide and show cursor
tput civis  # Hide cursor
tput cnorm  # Show cursor
```


### **clear** - Clear Terminal Screen**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [clear, clear terminal screen]
synonyms: [clear]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Clear the terminal screen
**Location**: `/usr/bin/clear`
**Common Use Cases**:

- Screen cleanup
- Script presentation
- User interface refresh
- Output organization

**See Also**: Related tools in this category

**Examples**:

```bash
# Clear entire screen
clear

# Clear and reset scrollback (some terminals)
clear && printf '\033[3J'

# Use in scripts for clean output
echo "Starting process..."
sleep 2
clear
echo "Process complete!"

# Alternative using escape sequences
printf "\033c"  # Reset terminal
printf "\033[2J" # Clear screen
printf "\033[H"  # Move cursor to top
```


### **reset** - Reset Terminal Settings**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [reset, reset terminal settings]
synonyms: [reset]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Initialize terminal to default settings
**Location**: `/usr/bin/reset`
**Common Use Cases**:

- Fix corrupted terminal display
- Restore default settings
- Clear stuck terminal states
- Recover from binary output

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic terminal reset
reset

# Hard reset (more thorough)
reset -e

# Fix terminal after displaying binary file
cat binary_file  # Terminal gets corrupted
reset            # Fix terminal

# Alternative reset methods
stty sane        # Reset terminal line settings
tput reset       # Reset using tput
printf "\033c"   # Reset using escape sequence

# Reset specific terminal types
TERM=xterm reset
TERM=vt100 reset
```


### **tmux** - Terminal Multiplexer
<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#terminal, #session, #multiplexer, #modern-alternative]
related: [screen, nohup, jobs, zellij]
keywords: [tmux, terminal, multiplexer, session, window, pane, split, attach, detach]
synonyms: [terminal-multiplexer, session-manager, screen-alternative]
platform: [macOS, Linux, Windows]
installation: brew install tmux
-->
**Description**: Modern terminal multiplexer allowing multiple sessions, windows, and panes
**Location**: `/opt/homebrew/bin/tmux`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic usage) / ⭐⭐⭐⭐ Advanced (Custom configuration)
**Common Use Cases**:

- Persistent remote sessions
- Multiple terminal layouts
- Pair programming sessions
- Development environment management
- Long-running process monitoring

**See Also**: `screen` (older alternative), `nohup` (background processes), `zellij` (modern Rust alternative)

**Examples**:

```bash
# Session management
tmux new -s dev              # Create named session
tmux ls                      # List all sessions
tmux attach -t dev           # Attach to session
tmux detach                  # Detach from session (Ctrl-b d)
tmux kill-session -t dev     # Kill specific session

# Window management (inside tmux)
# Ctrl-b c     - Create new window
# Ctrl-b n     - Next window
# Ctrl-b p     - Previous window
# Ctrl-b 0-9   - Switch to window number
# Ctrl-b ,     - Rename current window

# Pane management
tmux split-window -h         # Split horizontally
tmux split-window -v         # Split vertically
# Ctrl-b %     - Split pane vertically
# Ctrl-b "     - Split pane horizontally
# Ctrl-b arrow - Navigate between panes
# Ctrl-b z     - Toggle pane zoom

# Advanced usage
tmux new -s dev -d           # Create detached session
tmux send-keys -t dev:0 'npm start' C-m  # Send commands to session
tmux capture-pane -t dev:0 -p > output.txt  # Capture pane output
```


### **fzf** - Fuzzy Finder
<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#terminal, #productivity, #search, #fuzzy-finder]
related: [find, fd, ripgrep, peco, skim]
keywords: [fzf, fuzzy, finder, search, filter, interactive, selection, preview]
synonyms: [fuzzy-finder, interactive-filter, command-line-fuzzy-finder]
platform: [macOS, Linux, Windows]
installation: brew install fzf
-->
**Description**: Command-line fuzzy finder for interactive filtering and selection
**Location**: `/opt/homebrew/bin/fzf`
**Difficulty**: ⭐⭐ Beginner (Basic usage) / ⭐⭐⭐ Intermediate (Shell integration)
**Common Use Cases**:

- Interactive file selection
- Command history search
- Process killing
- Git branch switching
- Directory navigation

**See Also**: `peco` (simpler alternative), `skim` (Rust implementation), `fd` (file finding)

**Examples**:

```bash
# Basic file selection
vim $(fzf)                   # Open selected file in vim
cat $(fzf)                   # Display selected file

# Preview files while selecting
fzf --preview 'cat {}'       # Show file contents
fzf --preview 'head -100 {}'  # Preview first 100 lines
fzf --preview 'bat --color=always {}'  # Preview with syntax highlighting

# Command history search (after sourcing shell integration)
# Ctrl-R - Search command history interactively

# Process management
kill -9 $(ps aux | fzf | awk '{print $2}')  # Kill selected process

# Git operations
git checkout $(git branch -a | fzf)  # Switch to selected branch
git log --oneline | fzf --preview 'git show {1}'  # Browse commits

# Directory navigation with preview
cd $(find . -type d | fzf --preview 'ls -la {}')

# Multiple selection
fzf --multi                  # Select multiple items with Tab
rm $(fzf --multi)           # Delete multiple selected files

# Custom key bindings
fzf --bind 'ctrl-y:execute(echo {} | pbcopy)'  # Copy to clipboard
```


### **zoxide** - Smart Directory Navigation
<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐ Beginner
aliases: [z]
tags: [#terminal, #productivity, #navigation, #modern-alternative]
related: [cd, autojump, z, fasd]
keywords: [zoxide, z, cd, directory, navigation, jump, frecency, smart-cd]
synonyms: [smart-cd, z-command, directory-jumper, autojump-alternative]
platform: [macOS, Linux, Windows]
installation: brew install zoxide
-->
**Description**: Smarter cd command that learns your habits using frecency algorithm
**Location**: `/opt/homebrew/bin/zoxide`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- Quick directory navigation
- Project switching
- Frecency-based jumping
- Partial path matching
- Interactive directory selection

**See Also**: `cd` (standard navigation), `autojump` (older alternative), `fasd` (similar tool)

**Examples**:

```bash
# Initial setup (add to shell config)
eval "$(zoxide init zsh)"    # For zsh
eval "$(zoxide init bash)"   # For bash

# Basic usage (after visiting directories)
z proj                      # Jump to most frecent directory matching 'proj'
z dot config                # Jump to directory matching both 'dot' and 'config'

# Interactive selection
zi proj                     # Interactive selection with fzf
zi                         # Browse all indexed directories

# Adding directories manually
zoxide add /path/to/directory  # Add directory without visiting

# Query and management
zoxide query proj           # Show matching directories
zoxide query -l            # List all directories with scores
zoxide query -s proj       # Show scores for matching directories

# Remove directories
zoxide remove /path/to/dir  # Remove specific directory
zoxide remove proj         # Remove directories matching 'proj'

# Advanced patterns
z - # Go to previous directory (like cd -)
z ~  # Go to home directory
z /  # Go to root directory
```


### **starship** - Cross-Shell Prompt
<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#terminal, #productivity, #prompt, #customization]
related: [oh-my-zsh, powerline, p10k]
keywords: [starship, prompt, shell, customization, theme, powerline, git-aware]
synonyms: [shell-prompt, custom-prompt, prompt-theme, powerline-alternative]
platform: [macOS, Linux, Windows]
installation: brew install starship
-->
**Description**: Fast, customizable, and intelligent prompt for any shell
**Location**: `/opt/homebrew/bin/starship`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- Custom shell prompts
- Git status display
- Language version indicators
- Command duration display
- Context-aware information

**See Also**: `oh-my-zsh` (Zsh framework), `powerline` (older alternative), `p10k` (Powerlevel10k)

**Examples**:

```bash
# Installation and setup
# Add to ~/.zshrc or ~/.bashrc:
eval "$(starship init zsh)"   # For zsh
eval "$(starship init bash)"  # For bash

# Configuration (~/.config/starship.toml)
# Minimal prompt
cat > ~/.config/starship.toml << 'EOF'
format = "$directory$git_branch$git_status$character"

[directory]
truncation_length = 3
truncate_to_repo = false

[git_branch]
format = "[$branch]($style) "

[character]
success_symbol = "[➜](bold green)"
error_symbol = "[➜](bold red)"
EOF

# Show configuration
starship config              # Open config in editor
starship print-config        # Print current configuration
starship explain            # Explain current prompt

# Module testing
starship module git_branch   # Test specific module
starship module directory    # Test directory module

# Performance profiling
starship timings            # Show module timings

# Presets
starship preset nerd-font-symbols > ~/.config/starship.toml
starship preset plain-text-symbols > ~/.config/starship.toml
starship preset pure-preset > ~/.config/starship.toml
```


### **direnv** - Directory Environment Manager
<!-- metadata:
category: Terminal & Session Management
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#terminal, #productivity, #environment, #development]
related: [dotenv, autoenv, shadowenv]
keywords: [direnv, environment, variables, directory, .envrc, project-specific, auto-load]
synonyms: [environment-manager, env-loader, directory-env, project-environment]
platform: [macOS, Linux, Windows]
installation: brew install direnv
-->
**Description**: Load and unload environment variables depending on current directory
**Location**: `/opt/homebrew/bin/direnv`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- Project-specific environment variables
- Automatic virtual environment activation
- Secrets management
- Development environment setup
- PATH modifications per project

**See Also**: `dotenv` (library approach), `autoenv` (simpler alternative), `shadowenv` (Rust alternative)

**Examples**:

```bash
# Initial setup (add to shell config)
eval "$(direnv hook zsh)"    # For zsh
eval "$(direnv hook bash)"   # For bash

# Create .envrc file in project directory
echo 'export API_KEY="secret"' > .envrc
echo 'export NODE_ENV="development"' >> .envrc
echo 'PATH_add bin' >> .envrc  # Add ./bin to PATH

# Allow/trust the .envrc file
direnv allow                 # Trust current directory's .envrc
direnv allow .              # Same as above
direnv deny                 # Revoke trust

# Common .envrc patterns
# Python virtual environment
cat > .envrc << 'EOF'
layout python3
source .venv/bin/activate
EOF

# Node.js version management
cat > .envrc << 'EOF'
use node 18.0.0
layout node
EOF

# Ruby version
cat > .envrc << 'EOF'
use ruby 3.0.0
layout ruby
EOF

# Status and debugging
direnv status               # Show current status
direnv reload              # Reload current environment
direnv edit                # Edit and reload .envrc

# Security and management
direnv prune               # Remove old allowed directories
direnv show-config         # Show configuration
```

---


