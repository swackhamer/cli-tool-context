# CLAUDE.md - AI Assistant Guide

## Project Overview

Comprehensive CLI tools documentation for macOS, optimized for AI assistants. **Primary source**: `tools/` directory with category-organized tool documentation.

## Quick Reference

**Finding Tools:**
```bash
# Browse categories
ls tools/                     # List all categories
cat tools/[category].md       # Read specific category

# Search
grep -r "keyword" tools/      # Find by keyword
grep -r "#rust" tools/        # Find modern alternatives
```

**Common Tasks:**
- File search: `fd`, `ripgrep`, `mdfind` (macOS Spotlight)
- Text processing: `ripgrep`, `sed`, `awk`, `sd`
- Process monitoring: `htop`, `btop`, `procs`
- Disk usage: `dust`, `ncdu`, `duf`
- Version management: `pyenv`, `rbenv`, `nvm`
- Containers: `docker`, `kubectl`, `colima`
- Cloud: `awscli`, `gcloud`, `terraform`

## Modern Tool Replacements

**Prefer Rust-based alternatives** (faster, better UX):

| Traditional | Modern | Speed Improvement |
|------------|--------|-------------------|
| ls | **eza** | Fast, git-aware |
| find | **fd** | 5-10x faster |
| grep | **ripgrep** | 10-100x faster |
| cat | **bat** | Syntax highlighting |
| sed | **sd** | Simpler, safer |
| ps | **procs** | Better formatting |
| du | **dust** | Visual output |
| top | **bottom** | Modern UI |
| pip | **uv** | 10-100x faster |

## Essential Tools by Category

**Development**: pyenv, rbenv, nvm, just, cmake, rustc, go, watchman
**Cloud/DevOps**: awscli, gcloud, docker, kubectl, terraform, helm
**macOS-Specific**: mdfind, defaults, launchctl, hdiutil, pbcopy/pbpaste
**Data Processing**: jq, sqlite3, miller, csvkit
**Security**: nmap, wireshark, metasploit, aircrack-ng, hashcat

## Safety Guidelines

**Always warn about:**
- `rm -rf` → Suggest `trash` instead (brew install trash)
- `chmod 777` → Use `chmod 644` (files) or `chmod 755` (executables)
- `sudo` in home directory → Usually unnecessary
- System-wide searches → Use `mdfind` on macOS
- Network scans → Own networks only

**Performance:**
- File search: `fd` or `mdfind` (not `find`)
- Text search: `ripgrep` (not `grep`)
- Python packages: `uv` (not `pip`)

## Best Practices

1. **Modern first**: Prefer Rust alternatives (eza, fd, ripgrep, bat, sd)
2. **macOS native**: Use built-in tools (mdfind, defaults, launchctl)
3. **Verify first**: Check `which tool` before suggesting
4. **Include examples**: Show concrete commands
5. **Safety first**: Warn about rm -rf, chmod 777, sudo misuse

## Repository Structure

**Primary Source**: `tools/` - Category-organized documentation
- ai-powered-tools.md, cloud-container-tools.md, data-processing-tools.md
- development-tools.md, file-directory-operations.md, network-tools.md
- package-managers.md, system-administration.md, text-processing-manipulation.md
- version-control.md, utility-tools.md, macos-specific-tools.md
- cybersecurity-tools.md

**Other Files**:
- `README.md` - Project overview (comprehensive single source)
- `MASTER_PLAN.md` - Project planning and maintenance
- `scripts/` - Validation scripts

**Maintenance**:
```bash
scripts/run_validation_suite.sh   # Full validation
grep -h "^### \*\*" tools/*.md | wc -l   # Count tools (should be 323)
```

## Platform

- **Target**: macOS (Apple Silicon/Intel)
- **Package Manager**: Homebrew
- **GNU Tools**: Use coreutils for GNU compatibility (gls, gdate, etc.)

## Key Insights

1. **Always prefer modern Rust tools**: eza, fd, ripgrep, bat, sd, dust, bottom
2. **macOS-native tools are powerful**: mdfind (Spotlight), defaults, launchctl
3. **Speed matters**: uv for Python (10-100x faster than pip)
4. **Version managers are essential**: pyenv, rbenv, nvm
5. **Security tools included**: Full cybersecurity toolkit documented
6. **Safety first**: Always warn about destructive operations

---

*Primary reference: `tools/` directory. Keep responses concise with concrete examples.*
