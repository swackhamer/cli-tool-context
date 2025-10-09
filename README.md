# CLI Tools Reference Documentation

> **The most comprehensive CLI tools reference for macOS development and system administration**

[![Status](https://img.shields.io/badge/Status-Actively%20Maintained-brightgreen)](https://github.com/swackhamer/cli-tool-context) [![Tools](https://img.shields.io/badge/Tools-323-blue)](./tools/) [![Categories](https://img.shields.io/badge/Categories-19-purple)](./tools/) [![Homebrew Coverage](https://img.shields.io/badge/Homebrew%20Top%2050-70%25-orange)](./tools/)

## 🎯 Project Overview

This repository provides the **most comprehensive CLI tools documentation** for macOS systems, with **323 meticulously documented tools** across **19 categories**. Every tool includes complete metadata, extensive examples, use cases, and cross-references.

### ✨ What's New (October 2025)

**Recent additions based on Homebrew analytics and community needs:**

- ✅ **31+ Cybersecurity Tools**: Metasploit, SET, WPScan, Medusa, TheHarvester, Recon-ng, DNSRecon, Responder, Bettercap, Scapy, Wifite, nmap, masscan, wireshark, hashcat, john, hydra, sqlmap, nikto, gobuster, lynis, clamav, radare2, binwalk, aircrack-ng, nuclei, amass, and more
- ✅ **10 Top Homebrew Tools**: awscli (#2), pyenv (#5), coreutils (#19), rbenv (#22), uv (#24), openjdk (#25), watchman (#35), swiftlint (#43), graphviz (#44), nvm (#47)
- ✅ **6 macOS-Specific Tools**: mdfind, defaults, launchctl, hdiutil, osascript, screencapture
- ✅ **5 Modern Rust Alternatives**: just, ouch, jless, fx, yt-dlp
- ✅ **70% coverage** of top 50 Homebrew CLI tools
- ✅ All tools include 50-150 lines of practical examples

### 🏆 Primary Reference: tools/ Directory

**323 essential CLI tools** meticulously documented across **19 category files** with:
- ✅ Complete metadata (category, difficulty, tags, installation)
- ✅ Comprehensive examples (50-150 lines per tool)
- ✅ Modern alternatives highlighted (Rust-based tools)
- ✅ Real-world use cases and workflows
- ✅ Cross-platform compatibility notes
- ✅ Related tools and ecosystem context

## 📚 Repository Structure

### Essential Files
- **[tools/](./tools/)** - 📁 **PRIMARY SOURCE**: 19 category files, 323 tools with complete documentation
- **[CLAUDE.md](./CLAUDE.md)** - 🤖 LLM integration guide for AI assistants
- **[MASTER_PLAN.md](./MASTER_PLAN.md)** - 📋 Project planning & maintenance guide
- **[scripts/](./scripts/)** - 🛠️ Validation and build automation scripts

### 📁 Tools by Category (19 Files, 323 Tools)

| Category | Tools | Description |
|----------|-------|-------------|
| [AI-Powered Tools](./tools/ai-powered-tools.md) | 3 | AI assistants and LLM-powered CLI tools |
| [Cloud & Container Tools](./tools/cloud-container-tools.md) | 14 | Docker, Kubernetes, AWS, GCP, container tools |
| [Data Processing Tools](./tools/data-processing-tools.md) | 13 | JSON/CSV/SQL processing, data transformation |
| [Development Tools](./tools/development-tools.md) | 41 | Compilers, debuggers, version managers, build tools |
| [Documentation & Help Tools](./tools/documentation-help-tools.md) | 4 | man pages, tldr, documentation browsers |
| [Environment & Process Management](./tools/environment-process-management.md) | 11 | Process control, environment variables, job control |
| [File & Directory Operations](./tools/file-directory-operations.md) | 24 | File management, searching, navigation (includes fd, rg) |
| [macOS-Specific Tools](./tools/macos-specific-tools.md) | 16 | macOS-only utilities (Spotlight, preferences, services) |
| [Media Processing Tools](./tools/media-processing-tools.md) | 8 | Audio/video processing, image manipulation |
| [Network Tools](./tools/network-tools.md) | 19 | HTTP clients, SSH, network diagnostics |
| [Output Manipulation & Utilities](./tools/output-manipulation-utilities.md) | 4 | Output formatting and manipulation |
| [Package Managers](./tools/package-managers.md) | 14 | Homebrew, npm, pip, cargo, uv (ultra-fast) |
| [Security Tools](./tools/security-tools.md) | 41 | Encryption, pentesting, exploitation, vulnerability scanning |
| [System Administration](./tools/system-administration.md) | 46 | System monitoring, disk usage, compression |
| [Terminal Information & Control](./tools/terminal-information-control.md) | 2 | Terminal properties and control |
| [Terminal & Session Management](./tools/terminal-session-management.md) | 10 | tmux, screen, fzf, zoxide, starship |
| [Text Processing & Manipulation](./tools/text-processing-manipulation.md) | 28 | sed, awk, grep, ripgrep, text transformation |
| [Utility Tools](./tools/utility-tools.md) | 18 | xargs, coreutils (GNU), graphviz, misc utilities |
| [Version Control](./tools/version-control.md) | 7 | git, gh, delta, version control tools |

*All metadata validated ✅ | See [tools/README.md](./tools/README.md) for detailed index*

### 📖 Documentation Library

#### Core Documentation
- **[CLAUDE.md](./CLAUDE.md)** - LLM integration guide optimized for Claude Code
- **[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)** - Documentation standards and metadata requirements
- **[MASTER_PLAN.md](./MASTER_PLAN.md)** - Repository planning and maintenance guide

#### Reference Guides
- **[docs/CHEATSHEET.md](./docs/CHEATSHEET.md)** - Quick reference for common CLI operations
- **[archive/](./archive/)** - Historical documentation and archived code

## 🚀 Quick Start

### For Developers
```bash
# Browse tools by category
cat tools/development-tools.md        # 41 dev tools
cat tools/version-control.md          # git, gh, delta
cat tools/package-managers.md         # npm, pip, cargo, uv

# Find specific tools
grep -r "pyenv" tools/                # Python version manager
grep -r "docker" tools/               # Container platform
grep -r "awscli" tools/               # AWS CLI

# Discover modern alternatives
grep -r "#rust" tools/                # Rust-based modern tools
grep -r "#modern-alternative" tools/  # Modern replacements
```

### For System Administrators
```bash
# System monitoring and administration
cat tools/system-administration.md   # 46 system tools
cat tools/macos-specific-tools.md    # 16 macOS utilities

# Security and network tools
cat tools/security-tools.md          # Encryption, SSL/TLS
cat tools/network-tools.md           # Network diagnostics

# Cloud and containers
cat tools/cloud-container-tools.md   # Docker, K8s, AWS, GCP
```

### For LLM Integration
```bash
# Claude Code integration
cat CLAUDE.md                        # Comprehensive AI assistant guide

# Quick reference
cat docs/CHEATSHEET.md              # Common operations cheat sheet
```

## 🔍 Finding Tools

**Quick Discovery:**
- **Browse by category**: `ls tools/` - 19 organized category files
- **Search by name**: `grep -r "tool-name" tools/`
- **Find by tag**: `grep -r "#rust" tools/` or `grep -r "#macos" tools/`
- **Modern alternatives**: `grep -r "modern-alternative" tools/`

## 🌟 Highlights

### Modern Alternatives (Rust-Based Tools)

This documentation emphasizes **modern, fast, user-friendly alternatives** written in Rust:

| Traditional | Modern | Speed | Features |
|-------------|--------|-------|----------|
| ls | **eza** | Fast | Colors, git integration, icons |
| find | **fd** | 5-10x | Intuitive syntax, gitignore support |
| grep | **ripgrep (rg)** | 10-100x | Fastest, respects .gitignore |
| cat | **bat** | Fast | Syntax highlighting, git diffs |
| sed | **sd** | Faster | Simpler regex, safer |
| ps | **procs** | Fast | Better formatting, tree view |
| du | **dust** | Fast | Visual bars, intuitive |
| top | **bottom** | Fast | Better UI, zoomable charts |
| make | **just** | Fast | Simpler syntax, better UX |
| tar/zip | **ouch** | Fast | Unified interface |
| pip | **uv** | 10-100x | Revolutionary speed |

### Homebrew Coverage

**70% of top 50 Homebrew formulae documented**, including:

**Top 10 by popularity:**
1. ✅ **awscli** (#2) - AWS command line
2. ✅ **pyenv** (#5) - Python version manager
3. ✅ **coreutils** (#19) - GNU utilities for macOS
4. ✅ **rbenv** (#22) - Ruby version manager
5. ✅ **uv** (#24) - Ultra-fast Python installer
6. ✅ **openjdk** (#25) - Java JDK
7. ✅ **watchman** (#35) - File watcher (Meta)
8. ✅ **swiftlint** (#43) - Swift linter
9. ✅ **graphviz** (#44) - Graph visualization
10. ✅ **nvm** (#47) - Node version manager

### macOS-Specific Excellence

**16 macOS-only tools** with deep integration:

**System & Preferences:**
- **mdfind** - Spotlight search from CLI (lightning fast)
- **defaults** - Read/write macOS preferences
- **launchctl** - Manage macOS services and daemons
- **hdiutil** - Create/manipulate disk images (.dmg)

**Automation & Utilities:**
- **osascript** - Execute AppleScript/JXA from CLI
- **screencapture** - Take screenshots programmatically
- **pbcopy/pbpaste** - Clipboard integration
- **open** - Open files/apps from terminal

## 📊 Project Metrics

**Documentation Quality:**
- **323 tools** across **19 categories** with complete metadata
- **50-150 lines** of practical examples per tool
- **70% coverage** of top 50 Homebrew formulae
- **27 modern Rust alternatives** highlighted
- Real-world use cases and cross-references

**By Difficulty:**
- ⭐⭐ **Beginner**: ~60 tools - Everyday commands
- ⭐⭐⭐ **Intermediate**: ~130 tools - Common workflows
- ⭐⭐⭐⭐ **Advanced**: ~80 tools - Specialized usage
- ⭐⭐⭐⭐⭐ **Expert**: ~22 tools - Deep expertise required

## 🎯 Common Use Cases

**Software Development:**
- Version management: pyenv, rbenv, nvm
- Build systems: just, cmake, gradle
- Code quality: swiftlint, eslint
- Containers: docker, kubectl, colima

**System Administration:**
- Monitoring: htop, btop, bottom, procs
- macOS admin: defaults, launchctl, mdfind
- File search: fd, ripgrep
- Disk management: dust, ncdu, duf

**DevOps & Infrastructure:**
- Cloud platforms: awscli, gcloud, terraform
- Container orchestration: kubectl, helm, k9s
- Observability: stern, gping
- Automation: watchman

## 🛠️ Maintenance & Validation

**Validation Scripts:**
```bash
scripts/update_stats.sh --fix         # Fix statistics
scripts/run_validation_suite.sh       # Full validation
scripts/validate_and_fix.sh           # Metadata validation
```

See script help (`--help`) for detailed options.

## 🤝 Contributing

Contributions welcome! Each tool requires:
1. Complete metadata (category, difficulty, tags, installation)
2. Detailed description with use cases
3. 50+ lines of practical examples
4. Related tools and cross-references
5. Platform-specific notes

See [docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md) for complete guidelines.

## 🔗 Quick Links

- **Browse Tools**: [tools/](./tools/) - Start here!
- **AI Integration**: [CLAUDE.md](./CLAUDE.md) - For LLM assistants
- **Documentation**: [docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)
- **Master Plan**: [MASTER_PLAN.md](./MASTER_PLAN.md) - Roadmap & maintenance

---

## 📄 License

MIT License - Educational and reference purposes. Tool information based on publicly available documentation.

**Acknowledgments:** Homebrew Community • Rust CLI Community • tldr Project • Open Source Community

---

**⭐ Star this repository if you find it useful!**

*Last updated: October 2025 - Actively maintained*
