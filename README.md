# CLI Tools Reference Documentation

> **The most comprehensive CLI tools reference for macOS development and system administration**

[![Status](https://img.shields.io/badge/Status-Actively%20Maintained-brightgreen)](https://github.com/swackhamer/cli-tool-context) [![Tools](https://img.shields.io/badge/Tools-313-blue)](./tools/) [![Categories](https://img.shields.io/badge/Categories-19-purple)](./tools/) [![Homebrew Coverage](https://img.shields.io/badge/Homebrew%20Top%2050-70%25-orange)](./tools/)

## 🎯 Project Overview

This repository provides the **most comprehensive CLI tools documentation** for macOS systems, with **313 meticulously documented tools** across **19 categories**. Every tool includes complete metadata, extensive examples, use cases, and cross-references.

### ✨ What's New (October 2025)

**Recent additions based on Homebrew analytics and community needs:**

- ✅ **20 Cybersecurity Tools**: nmap, masscan, wireshark, hashcat, john, hydra, sqlmap, nikto, gobuster, lynis, clamav, radare2, binwalk, aircrack-ng, nuclei, amass, and more
- ✅ **10 Top Homebrew Tools**: awscli (#2), pyenv (#5), coreutils (#19), rbenv (#22), uv (#24), openjdk (#25), watchman (#35), swiftlint (#43), graphviz (#44), nvm (#47)
- ✅ **6 macOS-Specific Tools**: mdfind, defaults, launchctl, hdiutil, osascript, screencapture
- ✅ **5 Modern Rust Alternatives**: just, ouch, jless, fx, yt-dlp
- ✅ **70% coverage** of top 50 Homebrew CLI tools
- ✅ All tools include 50-150 lines of practical examples

### 🏆 Primary Reference: tools/ Directory

**313 essential CLI tools** meticulously documented across **19 category files** with:
- ✅ Complete metadata (category, difficulty, tags, installation)
- ✅ Comprehensive examples (50-150 lines per tool)
- ✅ Modern alternatives highlighted (Rust-based tools)
- ✅ Real-world use cases and workflows
- ✅ Cross-platform compatibility notes
- ✅ Related tools and ecosystem context

## 📚 Repository Structure

### Essential Files
- **[tools/](./tools/)** - 📁 **PRIMARY SOURCE**: 19 category files, 313 tools with complete documentation
- **[TOOLS.md](./TOOLS.md)** - 📄 Legacy comprehensive reference (327 tools, historical)
- **[CLAUDE.md](./CLAUDE.md)** - 🤖 LLM integration guide for AI assistants
- **[MASTER_PLAN.md](./MASTER_PLAN.md)** - 📋 Project planning & maintenance guide
- **[scripts/](./scripts/)** - 🛠️ Validation and build automation scripts

### 📁 Tools by Category (19 Files, 313 Tools)

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
| [Security Tools](./tools/security-tools.md) | 30 | Encryption, pentesting, vulnerability scanning, password cracking |
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
- **[docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)** - Project status and verification reports

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

### Quick Discovery
- **Browse by category**: `ls tools/` - 19 organized category files
- **Search by name**: `grep -r "tool-name" tools/`
- **Find by tag**: `grep -r "#rust" tools/` or `grep -r "#macos" tools/`
- **Modern alternatives**: `grep -r "modern-alternative" tools/`

### Tool Categories at a Glance

**Most Popular Categories:**
- 🏆 **Development Tools** (41) - pyenv, rbenv, nvm, watchman, swiftlint, openjdk
- 🔧 **System Administration** (46) - monitoring, compression, disk tools
- 📁 **File Operations** (24) - fd, ripgrep, bat, eza, tree
- 📝 **Text Processing** (28) - sed, awk, grep, ripgrep, sd
- ☁️ **Cloud & Containers** (14) - docker, kubectl, awscli, gcloud

**Specialized Categories:**
- 🍎 **macOS-Specific** (16) - mdfind, defaults, launchctl, hdiutil
- 🤖 **AI-Powered** (3) - GitHub Copilot, aichat, llm
- 🔐 **Security** (10) - gpg, openssl, ssh-keygen
- 📦 **Package Managers** (14) - brew, npm, pip, uv (ultra-fast)

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

### Documentation Quality
- **292 tools** across **19 categories**
- **50-150 lines** of examples per tool
- **Complete metadata** for every tool
- **Real-world use cases** and workflows
- **Cross-references** and related tools
- **Modern alternatives** prominently featured
- **Platform compatibility** clearly marked

### Tool Distribution

**By Category:**
- Development Tools: 41 (version managers, compilers, linters)
- System Administration: 46 (monitoring, compression, services)
- File Operations: 24 (search, navigation, management)
- Text Processing: 28 (sed, awk, grep, ripgrep)
- Network Tools: 19 (HTTP, SSH, diagnostics)
- macOS-Specific: 16 (Spotlight, preferences, services)
- Cloud & Containers: 14 (Docker, K8s, AWS, GCP)
- Package Managers: 14 (including ultra-fast uv)

**By Difficulty:**
- ⭐⭐ **Beginner**: ~60 tools - Everyday commands
- ⭐⭐⭐ **Intermediate**: ~130 tools - Common workflows
- ⭐⭐⭐⭐ **Advanced**: ~80 tools - Specialized usage
- ⭐⭐⭐⭐⭐ **Expert**: ~22 tools - Deep expertise required

## 🎯 Use Cases

### For Software Development
- **Version Management**: pyenv, rbenv, nvm - manage Python, Ruby, Node versions
- **Build Systems**: just, cmake, gradle - modern build automation
- **Code Quality**: swiftlint, eslint - enforce standards
- **Containers**: docker, kubectl, colima - containerization
- **Cloud**: awscli, gcloud - cloud infrastructure

### For System Administration
- **Monitoring**: htop, btop, bottom, procs - system monitoring
- **macOS Admin**: defaults, launchctl, mdfind - macOS management
- **File Search**: fd, ripgrep - blazing fast searching
- **Disk Management**: dust, ncdu, duf - disk usage analysis
- **Compression**: ouch, tar, gzip, zstd - unified compression

### For DevOps & Infrastructure
- **Cloud Platforms**: awscli, gcloud - AWS, GCP management
- **Container Orchestration**: kubectl, helm, k9s - Kubernetes
- **Infrastructure as Code**: terraform - multi-cloud provisioning
- **Observability**: stern, gping - monitoring and diagnostics
- **Automation**: watchman - file watching and triggers

## 🛠️ Maintenance & Validation

### Validation Scripts

Comprehensive validation scripts ensure documentation quality:

**`scripts/update_stats.sh`**
- `--fix` - Automatically fix issues
- `--verify-stats` - Verify statistics consistency
- `--validate-stats` - Comprehensive validation
- `--ci` - CI mode with strict validation
- `--json` - JSON output for automation

**`scripts/run_validation_suite.sh`**
- `--summary` - Brief overview
- `--detailed` - Full diagnostics
- `--fix-suggestions` - Automated fixes
- `--strict` - Fail on all errors

**`scripts/validate_and_fix.sh`**
- `--suggest-metadata` - Generate metadata suggestions
- Pre-flight dependency checks
- Multi-line metadata validation

## 🤝 Contributing

Contributions are welcome! See [docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md) for:
- Documentation standards and style guide
- Metadata requirements (complete spec)
- Quality assurance processes
- Validation procedures
- CI/CD integration guidelines

### Adding New Tools

Each tool should include:
1. **Complete metadata block** (category, difficulty, tags, installation)
2. **Detailed description** with use cases
3. **50+ lines of examples** covering common scenarios
4. **Related tools** and cross-references
5. **Platform-specific notes** (macOS, Linux, Windows)

## 📄 License

MIT License - This documentation project is created for educational and reference purposes. All CLI tool information is based on publicly available documentation.

## 🤝 Acknowledgments

- **Homebrew Community** - Analytics and package ecosystem
- **Rust CLI Community** - Modern, fast, user-friendly tools
- **Man Pages** - Authoritative system documentation
- **tldr Project** - Practical examples and community contributions
- **macOS** - Comprehensive built-in utilities
- **Open Source Community** - Best practices and innovations

---

## 📈 Project Statistics

```
Total Tools:           292
Categories:            19
Documentation Lines:   ~50,000+
Average Examples:      75 lines per tool
Metadata Coverage:     100%
Homebrew Top 50:       70% coverage
Modern Alternatives:   27 Rust-based tools
macOS-Specific:        16 tools
Cloud/DevOps:          14 tools
```

## 🔗 Quick Links

- **Browse Tools**: [tools/](./tools/) - Start here!
- **AI Integration**: [CLAUDE.md](./CLAUDE.md) - For LLM assistants
- **Documentation Guide**: [docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)
- **Project Status**: [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)
- **Master Plan**: [MASTER_PLAN.md](./MASTER_PLAN.md)

---

**⭐ Star this repository if you find it useful for your CLI work!**

*Last updated: October 2025 - Actively maintained with regular updates based on community needs and Homebrew analytics*
