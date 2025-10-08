# Tools TODO - Modern Rust Replacements

## Popular Tools with Rust Alternatives

This section documents popular CLI tools that have been rewritten in Rust and are now widely considered superior alternatives to their traditional counterparts.

### File & Directory Tools

#### **ls** → **eza** (formerly exa)
- **Original**: `ls` - List directory contents (C, 1971)
- **Rust Alternative**: `eza` - Modern replacement for ls
- **Why Better**: 
  - Color-coded file types and permissions
  - Git integration showing file status
  - Tree view support built-in
  - Human-readable file sizes by default
  - Icons support for file types
- **Installation**: `brew install eza` or `cargo install eza`
- **Adoption**: Widely accepted, recommended in modern dotfiles

#### **find** → **fd**
- **Original**: `find` - Search for files and directories (C)
- **Rust Alternative**: `fd` - Simple, fast alternative to find
- **Why Better**:
  - 5-10x faster than find
  - Intuitive syntax (no complex flags)
  - Smart case sensitivity
  - Respects .gitignore by default
  - Parallel command execution
- **Installation**: `brew install fd` or `cargo install fd-find`
- **Adoption**: Extremely popular, 50k+ GitHub stars

#### **grep** → **ripgrep (rg)**
- **Original**: `grep` - Pattern searching tool (C)
- **Rust Alternative**: `ripgrep` - Recursively search directories
- **Why Better**:
  - Fastest grep alternative available
  - Respects .gitignore by default
  - Automatic encoding detection
  - Compressed file search support
  - Better Unicode support
- **Installation**: `brew install ripgrep` or `cargo install ripgrep`
- **Adoption**: Industry standard, used by VS Code internally

#### **cat** → **bat**
- **Original**: `cat` - Concatenate and display files (C)
- **Rust Alternative**: `bat` - Cat clone with wings
- **Why Better**:
  - Syntax highlighting for 150+ languages
  - Git integration showing modifications
  - Line numbers and grid borders
  - Automatic paging with less
  - Maintains compatibility with cat
- **Installation**: `brew install bat` or `cargo install bat`
- **Adoption**: Very popular, 45k+ GitHub stars

### Text Processing Tools

#### **sed** → **sd**
- **Original**: `sed` - Stream editor (C)
- **Rust Alternative**: `sd` - Intuitive find & replace
- **Why Better**:
  - Simpler, more intuitive syntax
  - 2-10x faster than sed
  - Better error messages
  - No need to escape special characters
  - Consistent regex syntax
- **Installation**: `brew install sd` or `cargo install sd`
- **Adoption**: Growing adoption, simpler for basic use cases

#### **cut** → **choose** ✅ *[Documented in tools/text-processing-manipulation.md]*
- **Original**: `cut` - Extract columns from text (C)
- **Rust Alternative**: `choose` - Human-friendly cut
- **Why Better**:
  - More intuitive syntax
  - Negative indexing support
  - Better handling of variable whitespace
  - Range selection improvements
- **Installation**: `cargo install choose`
- **Adoption**: Niche but growing

### System Monitoring Tools

#### **ps** → **procs** ✅ *[Documented in TOOLS.md]*
- **Original**: `ps` - Process status (C)
- **Rust Alternative**: `procs` - Modern ps replacement
- **Why Better**:
  - Colored output with better formatting
  - Tree view for process hierarchy
  - More intuitive column selection
  - Better search capabilities
  - Multi-column keyword search
- **Installation**: `brew install procs` or `cargo install procs`
- **Adoption**: Growing in DevOps communities

#### **top/htop** → **bottom (btm)** ✅ *[Documented in TOOLS.md]*
- **Original**: `top/htop` - Process viewer (C/C++)
- **Rust Alternative**: `bottom` - Cross-platform graphical process/system monitor
- **Why Better**:
  - Better UI with mouse support
  - Process grouping
  - Zoomable charts
  - Better resource usage visualization
  - Cross-platform consistency
- **Installation**: `brew install bottom` or `cargo install bottom`
- **Adoption**: Popular alternative, especially on macOS

#### **du** → **dust** ✅ *[Documented in TOOLS.md]*
- **Original**: `du` - Disk usage (C)
- **Rust Alternative**: `dust` - More intuitive du
- **Why Better**:
  - Tree visualization by default
  - Percentage bars showing usage
  - Better sorting options
  - Cleaner output format
  - Faster performance
- **Installation**: `brew install dust` or `cargo install du-dust`
- **Adoption**: Widely recommended

#### **df** → **duf** ✅ *[Documented in TOOLS.md]*
- **Original**: `df` - Disk free space (C)
- **Rust Alternative**: `duf` - Disk Usage/Free utility
- **Why Better**:
  - Better visual presentation
  - Grouped output (local, network, special)
  - Adaptive to terminal width
  - JSON output support
  - Theme support
- **Installation**: `brew install duf`
- **Adoption**: Popular for interactive use

### Network Tools

#### **ping** → **gping** ✅ *[Documented in TOOLS.md]*
- **Original**: `ping` - Network connectivity test (C)
- **Rust Alternative**: `gping` - Ping with graph
- **Why Better**:
  - Real-time graph visualization
  - Multiple host support
  - Better statistics display
  - Cross-platform consistency
- **Installation**: `brew install gping` or `cargo install gping`
- **Adoption**: Popular for monitoring

### Shell & Terminal Tools

#### **cd** → **zoxide** ✅ *[Documented in TOOLS.md]*
- **Original**: `cd` - Change directory (shell builtin)
- **Rust Alternative**: `zoxide` - Smarter cd command
- **Why Better**:
  - Learns your habits (frecency algorithm)
  - Jump to directories from anywhere
  - Interactive selection with fzf
  - 10-100x faster than autojump/z
- **Installation**: `brew install zoxide` or `cargo install zoxide`
- **Adoption**: Very popular, replacing autojump/z

#### **man** → **tldr** (tealdeer) ✅ *[Documented in TOOLS.md]*
- **Original**: `man` - Manual pages (C)
- **Rust Alternative**: `tealdeer` - Fast tldr client
- **Why Better**:
  - Practical examples instead of exhaustive docs
  - Much faster to find what you need
  - Community-maintained examples
  - Offline cache support
- **Installation**: `brew install tealdeer` or `cargo install tealdeer`
- **Adoption**: Widely used alongside man pages

### File Management Tools

#### **rm** → **rip** ✅ *[Documented in tools/file-directory-operations.md]*
- **Original**: `rm` - Remove files (C)
- **Rust Alternative**: `rip` - Safe rm replacement
- **Why Better**:
  - Moves to graveyard instead of deleting
  - Can recover deleted files
  - Safer for important data
  - Respects .gitignore
- **Installation**: `cargo install rm-improved`
- **Adoption**: Niche but valuable for safety

#### **cp** → **xcp** ✅ *[Documented in tools/file-directory-operations.md]*
- **Original**: `cp` - Copy files (C)
- **Rust Alternative**: `xcp` - Extended cp
- **Why Better**:
  - Progress bar for large operations
  - .gitignore support
  - Better performance on SSDs
  - Parallel copying
- **Installation**: `cargo install xcp`
- **Adoption**: Growing for large file operations

### Development Tools

#### **time** → **hyperfine**
- **Original**: `time` - Time command execution (C)
- **Rust Alternative**: `hyperfine` - Command-line benchmarking
- **Why Better**:
  - Statistical analysis over multiple runs
  - Warmup runs support
  - Parameterized benchmarks
  - Export results to various formats
  - Beautiful progress bars
- **Installation**: `brew install hyperfine` or `cargo install hyperfine`
- **Adoption**: Standard for CLI benchmarking

#### **wc** → **cw** ✅ *[Documented in tools/text-processing-manipulation.md]*
- **Original**: `wc` - Word count (C)
- **Rust Alternative**: `cw` - Count Words (colorful wc)
- **Why Better**:
  - Colored output
  - Better Unicode handling
  - More format options
  - Faster on large files
- **Installation**: `cargo install cw`
- **Adoption**: Niche alternative

### HTTP Tools

#### **curl/wget** → **xh** ✅ *[Documented in TOOLS.md]*
- **Original**: `curl/wget` - HTTP clients (C)
- **Rust Alternative**: `xh` - Friendly HTTP client
- **Why Better**:
  - HTTPie-like syntax but faster
  - Better formatted output
  - Built-in JSON support
  - Simpler for common tasks
- **Installation**: `brew install xh` or `cargo install xh`
- **Adoption**: Growing, especially for API testing

## Why Rust Replacements Are Often Better

### Performance
- **Memory Safety**: No segfaults or memory leaks
- **Speed**: Often faster due to zero-cost abstractions
- **Parallelism**: Better multi-threading support built-in

### User Experience
- **Better Defaults**: Sensible defaults for modern workflows
- **Colored Output**: Better visual feedback
- **Error Messages**: More helpful error messages
- **Cross-Platform**: Consistent behavior across OS

### Modern Features
- **Git Integration**: Many tools respect .gitignore
- **Unicode Support**: Better international text handling
- **Progress Bars**: Visual feedback for long operations
- **JSON Output**: Easy integration with other tools

## Installation Strategy

### Recommended Approach
1. Install tools gradually as needed
2. Alias traditional commands to Rust versions
3. Keep originals available with different names
4. Test thoroughly before replacing in scripts

### Example Shell Configuration
```bash
# ~/.zshrc or ~/.bashrc
alias ls='eza'
alias l='eza -l'
alias la='eza -la'
alias tree='eza --tree'
alias find='fd'
alias grep='rg'
alias cat='bat'
alias ps='procs'
alias du='dust'
alias cd='z'  # after setting up zoxide
```

## Tools Under Development

These Rust alternatives are promising but not yet widely adopted:

- **make** → **just**: Command runner improving on make
- **awk** → **frawk**: Faster AWK implementation  
- **less** → **minus**: Pager written in Rust
- **ssh** → **rathole**: Reverse tunnel tool
- **tar** → **ouch**: Unified compression tool

## AI-Powered CLI Tools (2024-2025 Trends)

The emergence of AI and large language models has brought a new category of command-line tools that leverage AI capabilities directly from the terminal. These tools represent a significant shift in how developers interact with their systems.

### AI Assistants & Code Generation

#### **GitHub Copilot CLI** ✅ *[Documented in TOOLS.md]*
- **Purpose**: AI-powered command-line assistant
- **Features**:
  - Generate shell commands from natural language
  - Explain existing commands
  - Debug error messages
  - Suggest command improvements
- **Installation**: Via GitHub CLI extension
- **Adoption**: Rapidly growing among GitHub users

#### **aichat** ✅ *[Documented in TOOLS.md]*
- **Purpose**: Interactive AI chat in the terminal
- **Features**:
  - Multiple LLM support (OpenAI, Claude, etc.)
  - Code generation and explanation
  - Context-aware conversations
  - File and directory context
- **Installation**: `brew install aichat`
- **Adoption**: Popular among developers for quick AI queries

#### **llm** ✅ *[Documented in TOOLS.md]*
- **Purpose**: CLI tool for interacting with Large Language Models
- **Features**:
  - Support for multiple LLM providers
  - Plugin system for extensions
  - Prompt management
  - Output formatting options
- **Installation**: `pip install llm`
- **Adoption**: Growing in data science and ML communities

### AI Tool Trends

1. **Natural Language Interfaces**: Tools that accept natural language input to generate commands
2. **Context Awareness**: AI tools that understand project context and history
3. **Multi-Model Support**: Tools supporting various LLM providers (OpenAI, Anthropic, local models)
4. **Workflow Integration**: AI tools that integrate with existing CLI workflows
5. **Local vs Cloud**: Balance between cloud-based power and local privacy

## Completion Statistics

### Tools Now Documented in tools/ Directory
- ✅ **Modern Replacements**: fd, ripgrep, bat, eza, sd, dust, procs, bottom, duf, gping, xh, zoxide, tldr, hyperfine
- ✅ **File Management**: choose, cw, rip, xcp (Added October 2025)
- ✅ **Terminal Multiplexers**: tmux, screen
- ✅ **Shell Enhancements**: fzf, starship, direnv
- ✅ **Development Tools**: neovim, scc, dive, lazydocker, lazygit
- ✅ **AI-Powered Tools**: GitHub Copilot CLI, aichat, llm

### Remaining Tools (Under Development - Not Yet Ready)
- **Under Development**: just, frawk, minus, rathole, ouch (Marked as "not yet widely adopted")

### Documentation Coverage (Updated October 2025)
- **Total Rust Replacements Listed**: 30+ tools
- **Documented in tools/**: 25 tools (83% coverage of ready tools)
- **Newly Added**: choose, cw, rip, xcp (4 tools)
- **Categories**: 19 category files
- **Total Tool Count**: 271 tools across all categories

## Contributing

To add a new Rust replacement or AI-powered tool:
1. Tool must be stable and actively maintained
2. Should have significant advantages over alternatives
3. Include installation instructions
4. Document adoption level
5. Provide migration tips if applicable
6. For AI tools: specify LLM requirements and API key needs
