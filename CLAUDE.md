# CLAUDE.md - CLI Tool Context Guide

## Project Overview

This repository provides comprehensive CLI tools documentation with 267 tools across 19 categories. It serves as the definitive reference for macOS command-line tools, optimized for AI assistants and developers.

## Quick Start

The primary references are:
- **TOOLS.md** - Comprehensive monolithic reference with all tools
- **tools/** directory - 267 CLI tools organized into 19 category files
- Modern alternatives (eza, bat, fd, ripgrep)
- Difficulty ratings (⭐⭐ to ⭐⭐⭐⭐⭐)
- Complete metadata, examples, and use cases

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

All tools are organized in the `tools/` directory:

1. **AI-Powered Tools**: GitHub Copilot CLI, aichat, llm (3 tools)
2. **Cloud & Container Tools**: docker, colima, k9s, stern (13 tools)
3. **Data Processing Tools**: jq, csvkit, miller (11 tools)
4. **Development Tools**: asdf, mise, act, gcc, make (34 tools)
5. **Documentation & Help Tools**: man, tldr, whatis, apropos (4 tools)
6. **Environment & Process Management**: export, jobs, nohup, wait (11 tools)
7. **File & Directory Operations**: ls, eza, fd, tree, find (22 tools)
8. **macOS-Specific Tools**: pbcopy, pbpaste, open, say (10 tools)
9. **Media Processing Tools**: ffmpeg, sox, imagemagick (7 tools)
10. **Network Tools**: curl, wget, ssh, ngrok (19 tools)
11. **Output Manipulation & Utilities**: llm, test, true (4 tools)
12. **Package Managers**: brew, npm, pip3, cargo (13 tools)
13. **Security Tools**: gpg, openssl, ssh-keygen (10 tools)
14. **System Administration**: top, htop, ps, sudo, lsof (45 tools)
15. **Terminal Information & Control**: tty, stty (2 tools)
16. **Terminal & Session Management**: tmux, screen, fzf (10 tools)
17. **Text Processing & Manipulation**: sed, awk, grep, ripgrep (26 tools)
18. **Utility Tools**: xargs, which, date, time (16 tools)
19. **Version Control**: git, gh, delta, lazygit, tig (7 tools)

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

- `TOOLS.md` - Main reference (comprehensive monolithic file)
- `tools/` - Tools organized by category (19 files, 267 tools)
- `README.md` - Project overview & tool index
- `docs/DOCUMENTATION.md` - Combined project docs
- `docs/templates/` - Response templates
- `docs/snippets/` - Code snippets and examples
- `docs/safety/` - Detailed safety guidelines
- `scripts/` - Validation & maintenance
- `archive/` - Archived website and historical docs

## Maintenance Scripts

- `verify_tools.sh` - Check tool installations
- `update_stats.sh` - Update statistics
- `run_validation_suite.sh` - Full validation
- `validate_and_fix.sh` - Metadata validation

## Platform Notes

- **Target**: macOS (Apple Silicon/Intel)
- **Paths**: Absolute paths provided
- **Homebrew**: Primary package manager
- **Compatibility**: macOS-specific variations noted

---

*Last updated: 2025-09-03 10:36:09 CEST*
*Commit: 682e23a*

*Use TOOLS.md as the authoritative reference for all CLI tool queries.*
