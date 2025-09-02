# CLAUDE.md - CLI Tool Context Guide

## Project Overview

This repository provides comprehensive CLI tools documentation with {{TOOL_COUNT}} tools across {{CATEGORY_COUNT}} categories. It serves as the definitive reference for macOS command-line tools, optimized for AI assistants and developers.

## Quick Start

The primary reference is `TOOLS.md` containing:
- **{{TOOL_COUNT}} CLI tools** with detailed documentation
- **{{CATEGORY_COUNT}} categories** for easy navigation
- **{{LINE_COUNT}} lines** of comprehensive reference material
- Modern alternatives (eza, bat, fd, ripgrep)
- Difficulty ratings (⭐⭐ to ⭐⭐⭐⭐⭐)

## Tool Lookup Patterns

### By Task
```bash
# File search: fd, find, locate
# Text search: ripgrep, grep, ag
# Process monitoring: htop, top, procs
# Disk usage: dust, ncdu, du
```

### By Difficulty
- ⭐⭐ **Beginner**: ls, cp, mv, cat
- ⭐⭐⭐ **Intermediate**: grep, sed, awk
- ⭐⭐⭐⭐ **Advanced**: dtrace, nmap, docker
- ⭐⭐⭐⭐⭐ **Expert**: lldb, masscan, bazel

## Modern Tool Replacements

| Traditional | Modern | Benefits |
|------------|--------|----------|
| ls | eza | Colors, git integration, icons |
| find | fd | 5-10x faster, intuitive syntax |
| grep | ripgrep | Fastest, respects .gitignore |
| cat | bat | Syntax highlighting, git diffs |
| sed | sd | Simpler syntax, faster |
| ps | procs | Better formatting, tree view |
| du | dust | Visual bars, tree view |
| top | bottom | Better UI, zoomable charts |

## Safety Guidelines

### Destructive Operations
#### Using `rm` Safely
- **Risky**: `rm -rf /path/*` - Can delete everything recursively
- **Safer Alternative**: Use `trash` command instead
  ```bash
  # Install trash utility
  brew install trash
  
  # Move files to trash instead of permanent deletion
  trash file.txt
  trash -r directory/
  
  # Empty trash when certain
  trash -e
  ```
- **Best Practice**: Always use `-i` flag for interactive confirmation
  ```bash
  rm -i important.txt  # Prompts before deletion
  ```

#### File Permissions (Avoiding chmod 777)
- **Risky**: `chmod 777 file` - Gives everyone full access (read/write/execute)
- **Security Risk**: Opens files to modification by any user or process
- **Safer Alternatives**:
  ```bash
  # User-only access (most secure)
  chmod 700 script.sh     # rwx------
  
  # User + group read/execute
  chmod 750 shared.sh     # rwxr-x---
  
  # Standard file permissions
  chmod 644 document.txt  # rw-r--r-- (readable by all, writable by owner)
  ```
- **Principle of Least Privilege**: Grant minimum permissions necessary

#### Using sudo Responsibly
- **When to use sudo**:
  - System-wide package installation: `sudo apt install package`
  - System configuration changes: `sudo systemctl restart service`
  - Accessing protected system files: `sudo cat /etc/shadow`
  
- **When NOT to use sudo**:
  - Regular file operations in your home directory
  - Running untrusted scripts
  - Package managers with user installs (pip --user, npm)
  
- **Safer Practices**:
  ```bash
  # Review commands before running with sudo
  echo "command to run" | less
  sudo !!  # Only after verification
  
  # Use sudo with specific commands only
  sudo -l  # List what you can run with sudo
  
  # Avoid sudo with redirects (this won't work as expected)
  # Wrong: sudo echo "text" > /etc/file
  # Right: echo "text" | sudo tee /etc/file
  ```

### Performance Considerations
- Large directory searches → Use ripgrep
- System-wide finds → Warn about duration
- Network scans → Own networks only

### Additional Safety Tools
```bash
# Install safety utilities
brew install trash        # Safe file deletion
brew install tldr         # Simplified man pages
brew install shellcheck   # Bash script linting

# Backup before risky operations
cp important.conf important.conf.bak
tar -czf backup.tar.gz directory/
```

## Tool Categories

{{CATEGORIES_LIST}}

## Response Templates

### Simple Query
```
Tool: `command` (/path/to/binary)
Usage: `command [options] file`
Example: `command -flag input.txt`
Alternative: `modern_tool` (faster)
```

### Complex Pipeline
```
Pipeline:
1. `tool1` - prepare data
2. `tool2` - process
3. `tool3` - output

Complete: `tool1 input | tool2 --opt | tool3 > output`
```

## Best Practices

1. **Verify Installation**: `which tool` before suggesting
2. **Prefer Installed**: Use available tools first
3. **Start Simple**: Basic solution, then optimize
4. **Include Examples**: Concrete commands > descriptions
5. **Cross-reference**: Mention related tools
6. **Test Commands**: Ensure macOS compatibility
7. **Version Aware**: Note macOS-specific options

## Debugging Checklist

```bash
which tool_name          # Installation check
tool_name --version      # Version info
echo $PATH              # PATH verification
ls -la file             # Permission check
man tool_name           # Documentation
```

## Key Files

- `TOOLS.md` - Main reference ({{TOOL_COUNT}} tools)
- `README.md` - Project overview & tool index
- `TOOLS_TODO.md` - Rust replacements guide
- `docs/DOCUMENTATION.md` - Combined project docs
- `docs/templates/` - Response templates
- `docs/snippets/` - Code snippets and examples
- `docs/safety/` - Detailed safety guidelines
- `site/` - Interactive web interface
- `scripts/` - Validation & maintenance

## Website Access

```bash
# Generate data
cd node_tools && npm install && npm run build
scripts/generate_site_data.sh

# Serve locally
cd site && python3 -m http.server 8000
# Visit: http://localhost:8000
```

## Maintenance Scripts

- `verify_tools.sh` - Check installations
- `update_stats.sh` - Update statistics
- `generate_site_data.sh` - Build website data
- `run_validation_suite.sh` - Full validation
- `build_claude_md.sh` - Generate this file from template

## Platform Notes

- **Target**: macOS (Apple Silicon/Intel)
- **Paths**: Absolute paths provided
- **Homebrew**: Primary package manager
- **Compatibility**: macOS-specific variations noted

---

*Last updated: {{LAST_UPDATED}}*
*Commit: {{COMMIT_SHA}}*

*Use TOOLS.md as the authoritative reference for all CLI tool queries.*