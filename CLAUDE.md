# CLAUDE.md - CLI Tool Context Guide

## Project Overview

This repository provides comprehensive CLI tools documentation for macOS systems, optimized for AI assistants and developers. It serves as the definitive reference for command-line tools with complete metadata, extensive examples, and real-world use cases.

## Quick Start

### Primary References

- **tools/** directory - Organized category files (PRIMARY SOURCE for tool documentation)
- **TOOLS.md** - Legacy comprehensive reference (historical)
- **README.md** - Project overview and quick navigation
- Modern alternatives emphasized (Rust-based tools: eza, bat, fd, ripgrep, uv)
- Complete metadata, difficulty ratings, and cross-references

### Finding Tools

```bash
# Browse by category
ls tools/                          # List all category files
cat tools/development-tools.md     # Version managers, compilers, build tools
cat tools/macos-specific-tools.md  # macOS-only utilities

# Search for specific tools
grep -r "docker" tools/            # Find Docker documentation
grep -r "#rust" tools/             # Find Rust-based modern tools
grep -r "pyenv" tools/             # Find Python version manager
```

## Tool Lookup Patterns

### By Task
```bash
# File search: fd, find, ripgrep, locate, mdfind (macOS Spotlight)
# Text search: ripgrep, grep, ag, sd
# Process monitoring: htop, btop, bottom, procs, top
# Disk usage: dust, ncdu, duf, du
# Version management: pyenv, rbenv, nvm, asdf
# Cloud infrastructure: awscli, gcloud, kubectl, terraform
# Package management: brew, npm, pip, cargo, uv (ultra-fast)
```

### By Difficulty
- ⭐⭐ **Beginner**: ls, cp, mv, cat, mkdir, rm
- ⭐⭐⭐ **Intermediate**: grep, sed, awk, docker, git
- ⭐⭐⭐⭐ **Advanced**: kubectl, terraform, awscli, launchctl
- ⭐⭐⭐⭐⭐ **Expert**: dtrace, lldb, masscan, bazel

## Modern Tool Replacements

**Rust-based alternatives** (faster, better UX):

| Traditional | Modern | Speed | Key Benefits |
|------------|--------|-------|--------------|
| ls | **eza** | Fast | Colors, git integration, icons |
| find | **fd** | 5-10x | Intuitive syntax, respects .gitignore |
| grep | **ripgrep (rg)** | 10-100x | Fastest, smart defaults |
| cat | **bat** | Fast | Syntax highlighting, git diffs |
| sed | **sd** | Faster | Simpler syntax, safer |
| ps | **procs** | Fast | Better formatting, tree view |
| du | **dust** | Fast | Visual bars, intuitive output |
| top | **bottom (btm)** | Fast | Modern UI, customizable |
| make | **just** | Fast | Simpler justfiles, better ergonomics |
| tar/zip | **ouch** | Fast | Unified compression interface |
| pip | **uv** | 10-100x | Revolutionary Python package speed |

## Top Tools by Category

### Development
- **Version Managers**: pyenv, rbenv, nvm (Python, Ruby, Node)
- **Build Tools**: just, cmake, gradle, maven
- **Compilers**: gcc/clang, rustc, go, javac (openjdk)
- **Linters**: swiftlint, eslint, rubocop
- **File Watchers**: watchman (Meta's file monitoring)

### Cloud & DevOps
- **Cloud CLIs**: awscli (#2 on Homebrew), gcloud, azure-cli
- **Containers**: docker, kubectl, colima, k9s, helm
- **Infrastructure**: terraform, ansible
- **Monitoring**: stern, gping

### macOS-Specific
- **Spotlight**: mdfind (CLI Spotlight search)
- **Preferences**: defaults (read/write macOS settings)
- **Services**: launchctl (manage daemons/agents)
- **Disk Images**: hdiutil (create/manipulate .dmg)
- **Automation**: osascript (AppleScript/JXA)
- **Utilities**: screencapture, pbcopy/pbpaste, open, caffeinate

### System Administration
- **Monitoring**: htop, btop, bottom, procs
- **Disk Tools**: dust, ncdu, duf
- **Compression**: ouch, tar, gzip, zstd
- **GNU Tools**: coreutils (for macOS compatibility)

### Data & Text Processing
- **JSON**: jq, jless, fx
- **Text**: sed, awk, ripgrep, sd
- **Data**: sqlite3, mysql, psql, redis-cli
- **CSV**: miller, csvkit, datamash

### Utilities
- **Visualization**: graphviz (dot diagrams)
- **GNU Utils**: coreutils (gls, gdate, etc. for macOS)
- **Search**: fzf (fuzzy finder), zoxide (smart cd)

## Safety Guidelines

### Destructive Operations

#### Using `rm` Safely
- **Risky**: `rm -rf /path/*` - Can delete everything recursively
- **Safer Alternative**: Use `trash` command
  ```bash
  brew install trash
  trash file.txt           # Moves to trash (recoverable)
  trash -r directory/      # Recursive trash
  ```
- **Best Practice**: Use `-i` flag for confirmation
  ```bash
  rm -i important.txt      # Prompts before deletion
  ```

#### File Permissions (Avoiding chmod 777)
- **Risky**: `chmod 777 file` - Gives everyone full access
- **Safer Alternatives**:
  ```bash
  chmod 700 script.sh      # User-only (rwx------)
  chmod 750 shared.sh      # User + group (rwxr-x---)
  chmod 644 document.txt   # Standard file (rw-r--r--)
  ```
- **Principle**: Grant minimum permissions necessary

#### Using sudo Responsibly
- **When to use sudo**:
  - System-wide package installation
  - System configuration changes
  - Accessing protected system files

- **When NOT to use sudo**:
  - Regular file operations in home directory
  - Running untrusted scripts
  - Package managers with user installs (pip --user, npm)

- **Best Practices**:
  ```bash
  sudo -l                  # List sudo permissions
  echo "text" | sudo tee /etc/file  # Proper redirect
  ```

### Performance Considerations
- Large directory searches → Use ripgrep or fd
- System-wide finds → Warn about duration, use mdfind on macOS
- Network scans → Own networks only
- Python packages → Use uv instead of pip (10-100x faster)

### Safety Utilities
```bash
brew install trash        # Safe file deletion
brew install tldr         # Simplified man pages
brew install shellcheck   # Bash script linting
```

## Response Templates

### Simple Query
```
Tool: `command`
Location: /path/to/binary
Usage: `command [options] file`
Example: `command -flag input.txt`
Alternative: `modern_tool` (faster, better UX)
```

### Complex Pipeline
```
Pipeline:
1. `tool1` - prepare data
2. `tool2` - process
3. `tool3` - output

Complete: `tool1 input | tool2 --opt | tool3 > output`
```

### Tool Recommendation
```
For [task]:
- Modern: `modern_tool` (Rust, 10x faster)
- Traditional: `classic_tool`
- macOS: `macos_tool` (built-in)

Example: `modern_tool --flag input`
```

## Best Practices

1. **Verify Installation**: Check `which tool` before suggesting
2. **Prefer Modern Tools**: Suggest Rust alternatives when appropriate
3. **macOS Native First**: Use built-in macOS tools when available
4. **Include Examples**: Concrete commands > descriptions
5. **Show Alternatives**: Mention both traditional and modern options
6. **Safety First**: Warn about destructive operations
7. **Cross-reference**: Link related tools and workflows
8. **Version Aware**: Note platform-specific variations

## Tool Discovery Workflow

```bash
# Find tool by category
ls tools/                        # Browse categories
cat tools/development-tools.md   # Read category

# Search for functionality
grep -r "json" tools/            # Find JSON tools
grep -r "docker" tools/          # Find Docker tools
grep -r "#modern-alternative" tools/  # Find Rust alternatives

# Check if tool exists
which pyenv                      # Installation check
pyenv --version                  # Version info

# Get help
man pyenv                        # Full documentation
tldr pyenv                       # Quick examples (if installed)
```

## Debugging Checklist

```bash
which tool_name          # Check if installed
tool_name --version      # Verify version
echo $PATH               # Check PATH
type tool_name           # Show command type
ls -la /path/to/tool     # Check permissions
man tool_name            # Read documentation
```

## Repository Structure

### Essential Files
- **tools/** - PRIMARY SOURCE: Category-organized tool documentation
- **README.md** - Project overview, quick navigation
- **TOOLS.md** - Legacy comprehensive reference (historical)
- **MASTER_PLAN.md** - Project planning and maintenance
- **docs/** - Documentation standards and guides
- **scripts/** - Validation and build automation
- **archive/** - Historical documentation

### Category Files (tools/ directory)
- ai-powered-tools.md - AI assistants (GitHub Copilot, aichat, llm)
- cloud-container-tools.md - Docker, Kubernetes, AWS, GCP
- data-processing-tools.md - JSON/CSV/SQL processing
- development-tools.md - Compilers, version managers, build tools
- file-directory-operations.md - File search/navigation (fd, ripgrep)
- macos-specific-tools.md - macOS-only utilities
- network-tools.md - HTTP clients, SSH, diagnostics
- package-managers.md - brew, npm, pip, cargo, uv
- system-administration.md - Monitoring, compression, services
- text-processing-manipulation.md - sed, awk, grep, ripgrep
- version-control.md - git, gh, delta, lazygit
- utility-tools.md - coreutils, graphviz, misc tools

## Maintenance Scripts

```bash
scripts/verify_tools.sh           # Check tool installations
scripts/update_stats.sh --fix     # Update statistics
scripts/run_validation_suite.sh   # Full validation
scripts/validate_and_fix.sh       # Metadata validation
```

## Platform Notes

- **Target**: macOS (Apple Silicon/Intel)
- **Paths**: Absolute paths provided where applicable
- **Package Manager**: Homebrew (primary)
- **Compatibility**: macOS-specific variations clearly noted
- **GNU Tools**: coreutils provides GNU versions for Linux compatibility

## Key Insights for AI Assistants

1. **Modern First**: Prioritize Rust-based alternatives (faster, better UX)
2. **macOS Native**: Use built-in macOS tools (mdfind, defaults, launchctl)
3. **Version Managers**: Essential for development (pyenv, rbenv, nvm)
4. **Cloud Tools**: AWS CLI is #2 most popular Homebrew package
5. **Fast Python**: uv is revolutionizing Python package management (10-100x faster)
6. **Unified Compression**: ouch handles all formats with simple interface
7. **Spotlight CLI**: mdfind is incredibly fast for file search on macOS
8. **Safety**: Always warn about rm -rf, chmod 777, sudo usage

---

*This documentation is actively maintained with regular updates based on Homebrew analytics and community needs.*

*Use the tools/ directory as the authoritative reference for all CLI tool queries.*
