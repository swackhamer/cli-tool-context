# CLI Tools Reference Documentation

> **The most comprehensive CLI tools reference for macOS development and system administration**

[![Status](https://img.shields.io/badge/Status-Complete%20%2B%20Enhanced-brightgreen)](https://github.com/swackhamer/cli-tool-context) [![Tools](https://img.shields.io/badge/Tools-357%2B-blue)](./TOOLS.md) [![Lines](https://img.shields.io/badge/Lines-18470-orange)](./TOOLS.md) [![Categories](https://img.shields.io/badge/Categories-37%2B-purple)](./TOOLS.md)

## 🎯 Project Overview

This repository contains a comprehensive documentation project that successfully created the most complete CLI tools reference available for macOS systems. The documentation provides essential knowledge for programming, system administration, and development workflows.

### 🏆 Main Achievement: TOOLS.md

**<!-- tools-count -->357+<!-- /tools-count --> essential CLI tools** documented across **<!-- categories-count -->37+<!-- /categories-count --> categories** in **<!-- lines-count -->18,470<!-- /lines-count --> lines** of comprehensive documentation with enhanced navigation, performance guides, and ready-to-use resources. Phase 8 expansion completed with modern alternatives, cloud tools, media processing, and data analysis utilities.

## 📚 Repository Structure

### Essential Files
- **[TOOLS.md](./TOOLS.md)** - 🌟 Main CLI tools reference (357+ tools)
- **[MASTER_PLAN.md](./MASTER_PLAN.md)** - 📋 Comprehensive planning & maintenance guide
- **[docs/TOOL_INDEX.md](./docs/TOOL_INDEX.md)** - 🔍 Searchable tool index
- **[docs/CHEATSHEET.md](./docs/CHEATSHEET.md)** - Quick reference guide
- **[docs/CLAUDE_GUIDE.md](./docs/CLAUDE_GUIDE.md)** - Claude Code integration
- **[scripts/verify_tools.sh](./scripts/verify_tools.sh)** - Check tool installation
- **[site/](./site/)** - 🌐 Interactive website for browsing tools

### Specialized Documentation
- **[docs/SYSTEM_ADMINISTRATION_TOOLS.md](./docs/SYSTEM_ADMINISTRATION_TOOLS.md)** - System admin reference
- **[archive/](./archive/)** - Historical planning documents (consolidated into MASTER_PLAN.md)


## 🚀 Quick Start

### 🌐 Website Interface

Access the interactive website for the best browsing experience:

```bash
# Generate website data (requires Dart)
scripts/generate_site_data.sh

# Serve the website locally
cd site && python3 -m http.server 8000
# Then visit: http://localhost:8000
```

**Website Features:**
- 🔍 **Advanced Search** - Full-text search across all 357+ tools with Lunr.js
- 📊 **Smart Filtering** - Filter by category, difficulty, platform, and installation method
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📋 **Interactive Cheat Sheet** - Searchable command reference with copy-to-clipboard
- 🔗 **Deep Links** - Shareable URLs for searches and specific tools

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
cat docs/SYSTEM_ADMINISTRATION_TOOLS.md
```

### For LLM Integration
```bash
# Review Claude Code integration guide
cat docs/CLAUDE_GUIDE.md

# Quick reference for common operations
cat docs/CHEATSHEET.md
```

## 🔍 Finding Tools

### Quick Tool Discovery
- **[📚 Tool Index](./docs/TOOL_INDEX.md)** - Browse all tools alphabetically, by category, or difficulty level
- **Search by function**: `grep -i "network" docs/TOOL_INDEX.md`
- **Find by difficulty**: `grep "⭐⭐⭐⭐⭐" docs/TOOL_INDEX.md`
- **Browse categories**: Each tool includes metadata for easy filtering

## 📊 Project Metrics

### Coverage & Quality
- **357+ tools** documented across **37+ categories** in **18,470 lines**
- Difficulty ratings (⭐⭐ to ⭐⭐⭐⭐⭐) for skill-appropriate learning
- Modern alternatives included (eza, bat, fd, rg, procs, dust, sd)
- macOS-specific variations and safety warnings
- Format consistency and regular accuracy verification

## 🗂️ Tool Categories

| Category | Count | Key Tools | Link |
|----------|-------|-----------|------|
| **📁 File & Directory Operations** | 25 | `ls`, `find`, `grep`, `cp`, `chmod` | [View Details](./docs/TOOL_INDEX.md#file--directory-operations) |
| **📝 Text Processing** | 20 | `sed`, `awk`, `cut`, `sort`, `diff` | [View Details](./docs/TOOL_INDEX.md#text-processing--manipulation) |
| **🔀 Version Control** | 15 | `git`, `gh`, `svn` | [View Details](./docs/TOOL_INDEX.md#version-control) |
| **🛠️ Development Tools** | 18 | `gcc`, `make`, `python3`, `lldb` | [View Details](./docs/TOOL_INDEX.md#development-tools) |
| **📦 Package Managers** | 12 | `brew`, `npm`, `pip3`, `cargo` | [View Details](./docs/TOOL_INDEX.md#package-managers) |
| **🌐 Network Tools** | 15 | `curl`, `ssh`, `ping`, `netstat` | [View Details](./docs/TOOL_INDEX.md#network-tools) |
| **🔐 Security Tools** | 12 | `gpg`, `ssh-keygen`, `openssl` | [View Details](./docs/TOOL_INDEX.md#security-tools) |
| **⚙️ System Administration** | 18 | `ps`, `top`, `sudo`, `lsof` | [View Details](./docs/TOOL_INDEX.md#system-administration) |
| **🗜️ Archive & Compression** | 10 | `tar`, `zip`, `gzip`, `xz` | [View Details](./docs/TOOL_INDEX.md#archive--compression-tools) |
| **💾 Data Processing** | 8 | `jq`, `sqlite3`, `mysql` | [View Details](./docs/TOOL_INDEX.md#data-processing-tools) |

> **See all categories**: Browse the complete [Tool Index](./docs/TOOL_INDEX.md) for detailed listings and search functionality.

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
- Integrates with existing Dart parsing infrastructure for consistency

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

Contributions are welcome! Please see [docs/MAINTENANCE.md](./docs/MAINTENANCE.md) for detailed guidelines on:
- Tool documentation standards
- Metadata requirements (platform, installation, keywords, synonyms)
- Quality assurance processes
- Validation procedures
- CI/CD integration

## 📄 License

This documentation project is created for educational and reference purposes. All CLI tool information is based on publicly available man pages and community documentation.

## 🤝 Acknowledgments

- **Man Pages**: Authoritative descriptions from system documentation
- **tldr Project**: Practical examples and community contributions
- **macOS System**: Tool availability and location verification
- **Development Community**: Best practices and modern alternatives

---

**⭐ Star this repository if you find it useful for your CLI work!**

*Last updated: 2025 - The most comprehensive CLI tools reference for macOS development and system administration*