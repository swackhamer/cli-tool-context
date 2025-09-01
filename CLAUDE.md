# CLAUDE.md - CLI Tool Context Guide

## Project Overview

This repository provides comprehensive CLI tools documentation with 336 tools across 37 categories. It serves as the definitive reference for macOS command-line tools, optimized for AI assistants and developers.

## Quick Start

The primary reference is `TOOLS.md` containing:
- **336 CLI tools** with detailed documentation
- **37 categories** for easy navigation
- **17,500+ lines** of comprehensive reference material
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
- `rm -rf` → Suggest `trash` first
- `chmod 777` → Explain security risks
- `sudo` commands → Clarify system changes

### Performance Considerations
- Large directory searches → Use ripgrep
- System-wide finds → Warn about duration
- Network scans → Own networks only

## Tool Categories

1. **File Operations**: ls, find, cp, mv, rm (23 tools)
2. **Text Processing**: sed, awk, grep, cut (38 tools)
3. **Version Control**: git, gh, svn (4 tools)
4. **Development**: gcc, make, docker (35 tools)
5. **Package Managers**: brew, npm, pip (16 tools)
6. **Network**: curl, ssh, ping (28 tools)
7. **Security**: gpg, openssl (10 tools)
8. **System Admin**: ps, top, sudo (43 tools)
9. **Archive**: tar, zip, gzip (15 tools)
10. **Data Processing**: jq, sqlite3 (10 tools)

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

- `TOOLS.md` - Main reference (336 tools)
- `README.md` - Project overview & tool index
- `TOOLS_TODO.md` - Rust replacements guide
- `docs/DOCUMENTATION.md` - Combined project docs
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

## Platform Notes

- **Target**: macOS (Apple Silicon/Intel)
- **Paths**: Absolute paths provided
- **Homebrew**: Primary package manager
- **Compatibility**: macOS-specific variations noted

---

*Use TOOLS.md as the authoritative reference for all CLI tool queries.*
