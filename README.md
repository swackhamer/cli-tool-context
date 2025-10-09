# CLI Tools Reference Documentation

> **The most comprehensive CLI tools reference for macOS development and system administration**

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/swackhamer/cli-tool-context) [![Tools](https://img.shields.io/badge/Tools-327-blue)](./TOOLS.md) [![Unique](https://img.shields.io/badge/Unique-327-teal)](./TOOLS.md) [![Categories](https://img.shields.io/badge/Categories-40-purple)](./TOOLS.md)

## 🎯 Project Overview

This repository contains a comprehensive documentation project in **maintenance mode** that has successfully created the most complete CLI tools reference available for macOS systems. The project has achieved its core objectives with 327 documented tools and is now focused on quality assurance and maintenance.

### 🏆 Main Achievement: TOOLS.md

**<!-- tools-count -->327<!-- /tools-count --> essential CLI tools** (<!-- unique-count -->327<!-- /unique-count --> unique) documented across **<!-- categories-count -->40<!-- /categories-count --> categories** in **<!-- lines-count -->32734<!-- /lines-count --> lines** of comprehensive documentation. Parser accurately distinguishes between actual tools and documentation sections.

## 📚 Repository Structure

### Essential Files
- **[TOOLS.md](./TOOLS.md)** - 🌟 Main CLI tools reference (327 tools, all unique)
- **[tools/](./tools/)** - 📁 Tools organized by category (19 category files, 282 tools)
- **[MASTER_PLAN.md](./MASTER_PLAN.md)** - 📋 Comprehensive planning & maintenance guide
- **[scripts/verify_tools.sh](./scripts/verify_tools.sh)** - Check tool installation

### 📁 Tools by Category (19 Files, 282 Tools)

| Category | Tools | Description |
|----------|-------|-------------|
| [AI-Powered Tools](./tools/ai-powered-tools.md) | 3 | AI assistants and LLM-powered CLI tools |
| [Cloud & Container Tools](./tools/cloud-container-tools.md) | 13 | Docker, Kubernetes, and cloud infrastructure tools |
| [Data Processing Tools](./tools/data-processing-tools.md) | 13 | Data transformation, JSON/CSV processing |
| [Development Tools](./tools/development-tools.md) | 35 | Compilers, debuggers, build tools, IDEs |
| [Documentation & Help Tools](./tools/documentation-help-tools.md) | 4 | man pages, documentation browsers |
| [Environment & Process Management](./tools/environment-process-management.md) | 11 | Process control, environment variables |
| [File & Directory Operations](./tools/file-directory-operations.md) | 24 | File management, searching, navigation |
| [macOS-Specific Tools](./tools/macos-specific-tools.md) | 16 | macOS-only utilities (pbcopy, open, etc.) |
| [Media Processing Tools](./tools/media-processing-tools.md) | 8 | Audio/video processing, image manipulation |
| [Network Tools](./tools/network-tools.md) | 19 | HTTP clients, SSH, network diagnostics |
| [Output Manipulation & Utilities](./tools/output-manipulation-utilities.md) | 4 | Output formatting and manipulation |
| [Package Managers](./tools/package-managers.md) | 13 | Homebrew, npm, pip, cargo, etc. |
| [Security Tools](./tools/security-tools.md) | 10 | Encryption, SSL/TLS, password management |
| [System Administration](./tools/system-administration.md) | 46 | System monitoring, disk usage, permissions |
| [Terminal Information & Control](./tools/terminal-information-control.md) | 2 | Terminal properties and control |
| [Terminal & Session Management](./tools/terminal-session-management.md) | 10 | tmux, screen, session management |
| [Text Processing & Manipulation](./tools/text-processing-manipulation.md) | 28 | sed, awk, grep, text transformation |
| [Utility Tools](./tools/utility-tools.md) | 16 | xargs, which, date, time utilities |
| [Version Control](./tools/version-control.md) | 7 | git, delta, version control tools |

*All metadata validated ✅ | See [tools/README.md](./tools/README.md) for detailed index*

### 📖 Documentation Library

#### Core Documentation
- **[CLAUDE.md](./CLAUDE.md)** - LLM integration guide and Claude Code usage
- **[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)** - Documentation standards and maintenance procedures
- **[docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)** - Project status, implementation progress, and verification reports

#### Reference Guides
- **[docs/CHEATSHEET.md](./docs/CHEATSHEET.md)** - Quick reference guide for common CLI operations
- **[tools/system-administration.md](tools/system-administration.md)** - System administration tools (45 tools)

### Archive
- **[archive/](./archive/)** - Historical planning documents (consolidated into MASTER_PLAN.md)

## 📋 Prerequisites & Setup

### System Requirements

**Minimum Requirements:**
- **Bash Shell** - For running validation scripts
- **Standard Unix tools** - grep, sed, awk (pre-installed on macOS)

**Optional Enhancements:**
- **Python 3** - For running Python-based validation scripts
- **jq** - For JSON processing in some validation scripts

## 🚀 Quick Start

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

# Browse system administration tools by category
cat tools/system-administration.md
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
- **Browse by category**: See organized tools in `tools/` directory (19 category files)
- **Use the index**: See alphabetical tool index below

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
- **327 tools** documented across **40 categories** in **32,734 lines**
- All unique tools (no duplicates)
- Modern alternatives included (eza, bat, fd, rg, procs, dust, sd)
- macOS-specific variations and safety warnings
- Format consistency and regular accuracy verification

### Difficulty Distribution (327 Total Tools)
- ⭐ **Beginner (Easy)**: ~50 tools - Basic commands for everyday use
- ⭐⭐ **Novice (Medium)**: ~70 tools - Common tools with more options
- ⭐⭐⭐ **Intermediate (Hard)**: ~90 tools - Advanced features and complex syntax
- ⭐⭐⭐⭐ **Advanced (Expert)**: ~35 tools - Specialized tools requiring deep knowledge
- ⭐⭐⭐⭐⭐ **Expert (Legend)**: ~11 tools - Master-level tools with steep learning curves

## 🗂️ Tool Categories

<!-- categories-start -->
### Primary Tool Categories (<!-- tools-count -->327<!-- /tools-count --> total tools across <!-- categories-count -->40<!-- /categories-count --> categories)

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

**Note**: Default behavior has changed - now validates without making changes by default. Use `--fix` or `--update-all` to apply fixes. Set `UPDATE_STATS_LEGACY_DEFAULT=true` or use `--legacy-default` to restore old behavior.

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

*Last updated: October 5, 2025 - The most comprehensive CLI tools reference for macOS development and system administration*
