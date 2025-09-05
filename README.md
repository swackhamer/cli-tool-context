# CLI Tools Reference Documentation

> **The most comprehensive CLI tools reference for macOS development and system administration**

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/swackhamer/cli-tool-context) [![Tools](https://img.shields.io/badge/Tools-336-blue)](./TOOLS.md) [![Unique](https://img.shields.io/badge/Unique-336-teal)](./TOOLS.md) [![Categories](https://img.shields.io/badge/Categories-37-purple)](./TOOLS.md)

## 🎯 Project Overview

This repository contains a comprehensive documentation project in **maintenance mode** that has successfully created the most complete CLI tools reference available for macOS systems. The project has achieved its core objectives with 336 documented tools and is now focused on quality assurance and maintenance.

### 🏆 Main Achievement: TOOLS.md

**<!-- tools-count -->336<!-- /tools-count --> essential CLI tools** (<!-- unique-count -->336<!-- /unique-count --> unique) documented across **<!-- categories-count -->37<!-- /categories-count --> categories** in **<!-- lines-count -->17,500<!-- /lines-count --> lines** of comprehensive documentation. Parser accurately distinguishes between actual tools and documentation sections.

## 📚 Repository Structure

### Essential Files
- **[TOOLS.md](./TOOLS.md)** - 🌟 Main CLI tools reference (336 tools, all unique)
- **[MASTER_PLAN.md](./MASTER_PLAN.md)** - 📋 Comprehensive planning & maintenance guide
- **[scripts/verify_tools.sh](./scripts/verify_tools.sh)** - Check tool installation
- **[site/](./site/)** - 🌐 Interactive website for browsing tools

### 📖 Documentation Library

#### Core Documentation
- **[CLAUDE.md](./CLAUDE.md)** - LLM integration guide and Claude Code usage
- **[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)** - Documentation standards and maintenance procedures
- **[docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)** - Project status, implementation progress, and verification reports

#### Reference Guides
- **[docs/CHEATSHEET.md](./docs/CHEATSHEET.md)** - Quick reference guide for common CLI operations
- **[docs/system_administration_tools.md](docs/system_administration_tools.md)** - Specialized system administration reference

### Archive
- **[archive/](./archive/)** - Historical planning documents (consolidated into MASTER_PLAN.md)

## 📋 Prerequisites & Setup

### System Requirements

**Minimum Requirements:**
- **Node.js >= 18.0.0** - Required for data generation (`node --version`)
- **npm** - Node.js package manager (`npm --version`)
- **Bash Shell** - For running automation scripts
- **Modern Web Browser** - For viewing the website interface

**Optional Enhancements:**
- **MCP (Model Context Protocol)** - For enhanced progress tracking and logging
- **Python 3** - For local development server
- **jq** - For JSON validation during data generation

### MCP Integration

The system supports **MCP (Model Context Protocol)** integration for enhanced development workflows:

**When MCP is Available:**
- Enhanced progress tracking through MCP server communication
- Detailed logging and task management integration
- Advanced error reporting and debugging capabilities

**Automatic Fallback (when MCP is not configured):**
- Direct Node.js CLI execution with console logging
- Basic progress reporting and error handling
- All functionality preserved with graceful degradation

**MCP Configuration (Optional):**
```bash
# Set MCP endpoint (if using MCP server)
export MCP_ENDPOINT="your-mcp-server-endpoint"
export MCP_AUTH_TOKEN="your-auth-token"  # if required

# Or use Claude CLI with MCP support
# Scripts will auto-detect and use Claude CLI if available
```

## 🚀 Quick Start

### 🌐 Website Interface

Access the interactive website for the best browsing experience:

```bash
# Install Node.js tools dependencies
cd node_tools && npm install && npm run build

# Generate website data (requires Node.js >= 18.0.0, with optional MCP integration)
scripts/generate_site_data.sh

# Serve the website locally (RECOMMENDED - avoids file:// protocol issues)
# Option 1: Use the provided script (auto-detects available server)
scripts/serve-local.sh

# Option 2: Python 3 (most common)
cd site && python3 -m http.server 8000
# Then visit: http://localhost:8000

# Option 3: Node.js
cd site && npx http-server -p 8000

# Option 4: PHP
cd site && php -S localhost:8000
```

**⚠️ File Protocol Warning:** Opening HTML files directly (file://) has limitations:
- **Chrome:** Blocks local file access - use a server or Firefox instead
- **Firefox:** Works with file:// protocol (recommended for direct viewing)
- **Automatic Fallback:** Site uses embedded data (303 tools) when file:// restrictions detected

**MCP Integration:** The data generation script includes MCP (Model Context Protocol) integration for enhanced progress tracking and logging, but falls back gracefully to direct Node.js CLI execution when MCP is not available.

**Website Features:**
- 🔍 **Advanced Search** - Full-text search across all <!-- tools-count -->336<!-- /tools-count --> tools with Lunr.js
- 📊 **Smart Filtering** - Filter by category, difficulty, platform, and installation method
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📋 **Interactive Cheat Sheet** - Searchable command reference with copy-to-clipboard
- 🔗 **Deep Links** - Shareable URLs for searches and specific tools
- ⚡ **File Protocol Support** - Automatic fallback to embedded data when file:// restrictions detected
- 🚀 **Local Server Script** - Easy setup with `./scripts/serve-local.sh`

### For Developers
```bash
# Find the right tool for your task
grep -n "text processing" TOOLS.md
grep -n "version control" TOOLS.md
grep -n "package manager" TOOLS.md

# Look up specific tools
grep -A 10 "### \*\*grep\*\*" TOOLS.md
grep -A 10 "### \*\*docker\*\*" TOOLS.md

# Verify tool availability
scripts/verify_tools.sh
```

### For System Administrators
```bash
# Find system monitoring tools
grep -n "system administration" TOOLS.md
grep -n "process management" TOOLS.md

# Security and network tools
grep -n "security tools" TOOLS.md
grep -n "network tools" TOOLS.md

# Check specialized system tools
cat docs/system_administration_tools.md
```

### For LLM Integration
```bash
# Review Claude Code integration guide
cat CLAUDE.md

# Quick reference for common operations
cat docs/CHEATSHEET.md
```

## 🔍 Finding Tools

### Quick Tool Discovery
- **Search by function**: `grep -i "network" TOOLS.md`
- **Find by difficulty**: `grep "⭐⭐⭐⭐⭐" TOOLS.md`
- **Browse categories**: Each tool includes metadata for easy filtering
- **Use the website**: Interactive search and filtering at `site/index.html`

### 📖 Alphabetical Tool Index

<!-- tools-index-start -->
#### Complete Tool List (323 Unique Tools, 348 Total Entries)

*Note: Some tools appear in multiple categories accounting for the difference between unique tools and total entries.*

**A-B:** activity_monitor, aichat, alias, apply, apropos, ar, arp, awk, banner, base64, basename, bat, bazel, bc, bg, bottom (btm), brew, btop, bun

**C:** caffeinate, cal, cargo, cat, chmod, clear, cloc, cmake, cmp, codesign, column, comm, composer, cp, cpio, csplit, csvq, curl, cut

**D:** datamash, date, dc, delta, df, diff, dig, direnv, dirname, diskutil, disown, dive, docker, docker-compose, dscl, dsq, dtruss, du, duf, dust

**E-F:** echo, env, exiftool, expand, expand/unexpand, export, expr, eza, factor, fd, ffmpeg, file, find, fmt, fold, fs_usage, fzf

**G:** gcc/clang, gcloud, gem, gh, git, github_copilot_cli, glab, go, gpg, gping, gprof2dot, gradle, grep, groups

**H-I:** head, helm, hexdump, host, hostname, htop, hub, hyperfine, iconv, imagemagick, imagemagick (convert/magick), iostat, iotop

**J-L:** javac, jobs, join, jq, kill, kubectl, last, lazydocker, lazygit, ld, ldd, leaks, less, llm, ln, locale, ls, lsof

**M:** man, md5, md5sum/shasum, meson, miller, mkdir, mkfifo, more, mv, mvn, mysql

**N-O:** nano, nc (netcat), ncdu, neovim, netstat, ninja, nl, nm, node, nohup, npm, nslookup, objdump, open, openssl, otool

**P:** pandoc, paste, patch, pbcopy, pbpaste, perl, pgrep/pkill, ping, pip3, plutil, pnpm, podman, pr, procs, ps, psql, python, python3

**R:** ranlib, redis-cli, reset, rev, rg (ripgrep), rm, rmdir, rsync, ruby, rustc

**S:** say, scc, scp, screen, script, sd, security, sed, seq, shasum, shuf, sleep, sort, sox, spctl, split, sqlite3, ss, ssh, ssh-keygen, starship, stat, strings, strip, stty, sudo, sw_vers, swift, system_profiler

**T:** tar, tee, telnet, terraform, test, tig, time, tldr, tmux, tokei, top, touch, tput, tr, trap, tree, true, tty

**U-V:** uname, unexpand, uniq, units, uptime, vim, vm_stat, vmstat

**W-Z:** w, wait, wc, wget, whatis, which, who, whoami, whois, xargs, xh, xxd, yarn, yes, zcat, zip/unzip, zoxide
<!-- tools-index-end -->

## 📊 Project Metrics

### Coverage & Quality
- **348 tools** documented across **36 categories** in **16,852 lines**
- **323 unique tools** (some appear in multiple categories)
- Modern alternatives included (eza, bat, fd, rg, procs, dust, sd)
- macOS-specific variations and safety warnings
- Format consistency and regular accuracy verification

### Difficulty Distribution (348 Total Tools)
- ⭐ **Beginner (Easy)**: ~50 tools - Basic commands for everyday use
- ⭐⭐ **Novice (Medium)**: ~70 tools - Common tools with more options
- ⭐⭐⭐ **Intermediate (Hard)**: ~90 tools - Advanced features and complex syntax
- ⭐⭐⭐⭐ **Advanced (Expert)**: ~35 tools - Specialized tools requiring deep knowledge
- ⭐⭐⭐⭐⭐ **Expert (Legend)**: ~11 tools - Master-level tools with steep learning curves

## 🗂️ Tool Categories

<!-- categories-start -->
### Primary Tool Categories (<!-- tools-count -->348<!-- /tools-count --> total tools across <!-- categories-count -->36<!-- /categories-count --> categories)

1. **File & Directory Operations** (<!-- file-ops-count -->21<!-- /file-ops-count --> tools)
   - Basic: `ls`, `cp`, `mv`, `rm`, `mkdir`, `rmdir`
   - Modern: `eza`, `fd`, `rg`, `bat`
   - Advanced: `find`, `tree`, `stat`, `file`

2. **Text Processing & Manipulation** (<!-- text-proc-count -->31<!-- /text-proc-count --> tools)
   - Core: `sed`, `awk`, `grep`, `cut`, `sort`, `uniq`
   - Modern: `sd`, `rg`
   - Formatting: `column`, `pr`, `fold`, `fmt`
   - Comparison: `diff`, `comm`, `join`

3. **Version Control** (<!-- version-control-count -->7<!-- /version-control-count --> tools)
   - Git ecosystem: `git`, `gh`, `hub`, `tig`
   - Others: `svn`, `hg`

4. **Development Tools** (<!-- dev-tools-count -->34<!-- /dev-tools-count --> tools)
   - Compilers: `gcc`, `clang`, `rustc`, `go`
   - Package managers: `npm`, `yarn`, `pip`, `cargo`
   - Build tools: `make`, `cmake`, `gradle`
   - Debuggers: `gdb`, `lldb`, `valgrind`

5. **Network Tools** (16 tools)
   - Basics: `ping`, `traceroute`, `netstat`, `ss`
   - Advanced: `nmap`, `tcpdump`, `wireshark`
   - HTTP: `curl`, `wget`, `httpie`

6. **System Administration** (7 tools)
   - Process management: `ps`, `top`, `htop`, `kill`
   - System info: `uname`, `uptime`, `who`, `w`
   - Service management: `systemctl`, `service`

7. **Security Tools** (9 tools)
   - Encryption: `gpg`, `openssl`, `ssh-keygen`
   - Permissions: `chmod`, `chown`, `umask`
   - Auditing: `lynis`, `chkrootkit`

8. **Archive & Compression** (6 tools)
   - Compression: `gzip`, `bzip2`, `xz`, `lz4`, `zstd`
   - Archives: `tar`, `zip`, `unzip`, `7z`

9. **Package Managers** (19 tools)
   - System: `apt`, `yum`, `dnf`, `pacman`, `brew`
   - Language: `npm`, `pip`, `gem`, `cargo`, `go`

10. **Media Processing** (6 tools)
    - Images: `imagemagick`, `ffmpeg`
    - Audio/Video: `sox`, `mencoder`

11. **macOS-Specific Tools** (10 tools)
    - System: `defaults`, `launchctl`, `diskutil`
    - Development: `xcodebuild`, `codesign`

12. **Process & Resource Management** (32 tools)
    - Process tools: `ps`, `top`, `htop`, `kill`, `pkill`
    - System monitoring: `iostat`, `vmstat`, `netstat`

### Additional Categories

- **Terminal & Session Management** (5 tools) - `screen`, `script`, `tput`, `clear`, `reset`
- **Data Processing Tools** (9 tools) - `jq`, `sqlite3`, `miller`, `datamash`
- **Utility Tools** (17 tools) - `xargs`, `watch`, `which`, `bc`, `dc`, `expr`
- **Environment & Process Management** (12 tools) - `echo`, `env`, `export`, `jobs`
- **Mathematical & Logic Utilities** (5 tools) - `test`, `true`, `false`, `yes`, `seq`
- **Output Manipulation** (3 tools) - `tee`, `expect`, `seq`
- **Documentation & Help Tools** (3 tools) - `man`, `tldr`, `apropos`
- **Text Editors** (2 tools) - `vim`, `nano`
<!-- categories-end -->

### Tool Distribution by Purpose (348 Tools Total)
- **File Management**: 21 tools
- **Text Processing**: 31 tools
- **Development**: 34 tools
- **Networking**: 16 tools
- **Process Management**: 32 tools
- **System Admin**: 7 tools
- **Security**: 9 tools
- **Package Managers**: 19 tools
- **Data Processing**: 9 tools
- **Archive/Compression**: 6 tools
- **Utilities & Other**: 72 tools

## 🎯 Use Cases

### For Software Development
Git workflows, build systems, debugging tools, package management, and deployment utilities.

### For System Administration  
Process monitoring, security management, network diagnostics, and system maintenance.

### For DevOps & Infrastructure
Container orchestration, infrastructure automation, security operations, and performance monitoring.

### For Interactive Browsing
**🌐 Web Interface** - Use the interactive website for:
- Visual tool discovery with search and filtering
- Mobile-friendly reference during development
- Quick access to command examples with copy functionality
- Category-based exploration for learning new tools

## 🛠️ Maintenance & Validation

### Validation Scripts

This repository includes comprehensive validation and maintenance scripts:

#### update_stats.sh
- `--fix`: Fix issues automatically
- `--update-all`: Legacy alias for `--fix` (backward compatibility)
- `--verify-stats`: Verify README statistics consistency
- `--validate-stats`: Run comprehensive statistics validation
- `--generate-index`: Generate tool index files
- `--legacy-default`: Legacy mode for backward compatibility
- `--ci`: CI mode with strict validation (fails on warnings)
- `--soft-exit`: Don't fail on warnings
- `--update-readme-categories`: Update category table from statistics
- `--metadata-threshold N`: Set metadata coverage threshold (default: 80%)
- `--json`: Output results in JSON format for CI integration
- `--generate-site-data`: Generate website JSON data files

**Note**: Default behavior has changed - now validates without making changes by default. Use `--fix` or `--update-all` to apply fixes. Set `UPDATE_STATS_LEGACY_DEFAULT=true` or use `--legacy-default` to restore old behavior.

#### generate_site_data.sh
- `--full`: Generate all website data files (default)
- `--incremental`: Update only if source files have changed  
- `--stats`: Generate only statistics data
- `--quiet`: Suppress non-error output
- `--verbose`: Show detailed generation progress
- Validates JSON output and provides comprehensive error reporting
- Integrates with Node.js + TypeScript parsing infrastructure for modern maintainability

#### run_validation_suite.sh
- `--summary`: Show brief overview of issues
- `--detailed`: Show full diagnostic output (default)
- `--fix-suggestions`: Include automated fix recommendations
- `--validate-stats`: Run comprehensive statistics validation
- `--json`: Output results in JSON format
- `--strict`: Strict mode - all files required (no downgrades to warnings)
- `--auto-fix-perms`: Automatically fix script permissions
- Enhanced JSON parsing with defensive fallbacks for robust error detection
- Consolidated link validation to reduce duplication
- Capability checking for optional flags

#### validate_and_fix.sh  
- `--suggest-metadata`: Generate metadata suggestions for incomplete tools
- Portable file age checking across platforms
- Pre-flight checks for external dependencies (jq, sed, awk, grep)
- Fixed date expansion in suggestion templates
- Improved metadata detection with flexible regex patterns
- Multi-line metadata block validation with proper closing tag detection

## 🤝 Contributing

Contributions are welcome! Please see [docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md) for detailed guidelines on:
- Tool documentation standards
- Metadata requirements (platform, installation, keywords, synonyms)
- Quality assurance processes
- Validation procedures
- CI/CD integration

## 📄 License

This documentation project is created for educational and reference purposes. All CLI tool information is based on publicly available man pages and community documentation.

## ⚠️ Known Issues

### Documentation Discrepancies
During comprehensive verification, the following issues were identified:

- **Duplicate Sections in TOOLS.md**: System Administration, Tool Finder & Quick Reference Index, and Terminal & Session Management sections appear twice
- **Duplicate Tool Entries**: Approximately 30-40 tools have duplicate entries within their categories  
- **Category Count Variations**: Some categories have grown beyond initial documentation, leading to discrepancies between claimed and actual tool counts

For a complete analysis of these issues and recommendations for resolution, see the [Project Status Report](./docs/PROJECT_STATUS.md).

## 🤝 Acknowledgments

- **Man Pages**: Authoritative descriptions from system documentation
- **tldr Project**: Practical examples and community contributions
- **macOS System**: Tool availability and location verification
- **Development Community**: Best practices and modern alternatives

---

**⭐ Star this repository if you find it useful for your CLI work!**

*Last updated: 2025 - The most comprehensive CLI tools reference for macOS development and system administration*
