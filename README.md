# CLI Tools Reference Documentation

> **The most comprehensive CLI tools reference for macOS development and system administration**

[![Status](https://img.shields.io/badge/Status-Actively%20Maintained-brightgreen)](https://github.com/swackhamer/cli-tool-context) [![Tools](https://img.shields.io/badge/Tools-323-blue)](./tools/) [![Categories](https://img.shields.io/badge/Categories-19-purple)](./tools/) [![Homebrew Coverage](https://img.shields.io/badge/Homebrew%20Top%2050-70%25-orange)](./tools/)

## 🎯 Project Overview

**323 meticulously documented CLI tools** across **19 categories** for macOS systems. Every tool includes complete metadata, extensive examples, use cases, and cross-references.

### Key Features
- ✅ **323 tools** with 50-150 lines of practical examples each
- ✅ **19 category files** organized by use case
- ✅ **70% coverage** of top 50 Homebrew formulae
- ✅ **27 modern Rust alternatives** (eza, fd, ripgrep, bat, sd, etc.)
- ✅ **Complete metadata** (difficulty, tags, installation, related tools)
- ✅ **Safety warnings** for destructive operations

### Recent Additions (October 2025)
- **31+ Cybersecurity Tools**: Metasploit, nmap, wireshark, hashcat, john, hydra, sqlmap, aircrack-ng
- **10 Top Homebrew Tools**: awscli, pyenv, coreutils, rbenv, uv, openjdk, watchman, swiftlint, graphviz, nvm
- **6 macOS-Specific**: mdfind, defaults, launchctl, hdiutil, osascript, screencapture
- **5 Modern Rust Tools**: just, ouch, jless, fx, yt-dlp

---

## 📁 Tools by Category (19 Files, 323 Tools)

| Category | Tools | Description |
|----------|-------|-------------|
| [AI-Powered Tools](./tools/ai-powered-tools.md) | 3 | AI assistants and LLM-powered CLI tools |
| [Cloud & Container Tools](./tools/cloud-container-tools.md) | 14 | Docker, Kubernetes, AWS, GCP |
| [Data Processing Tools](./tools/data-processing-tools.md) | 13 | JSON/CSV/SQL processing |
| [Development Tools](./tools/development-tools.md) | 41 | Compilers, version managers, build tools |
| [Documentation & Help Tools](./tools/documentation-help-tools.md) | 4 | man, tldr, documentation browsers |
| [Environment & Process Management](./tools/environment-process-management.md) | 11 | Process control, env variables |
| [File & Directory Operations](./tools/file-directory-operations.md) | 24 | File management (fd, ripgrep, eza) |
| [macOS-Specific Tools](./tools/macos-specific-tools.md) | 16 | Spotlight, preferences, services |
| [Media Processing Tools](./tools/media-processing-tools.md) | 8 | Audio/video/image processing |
| [Network Tools](./tools/network-tools.md) | 19 | HTTP, SSH, network diagnostics |
| [Output Manipulation](./tools/output-manipulation-utilities.md) | 4 | Output formatting |
| [Package Managers](./tools/package-managers.md) | 14 | Homebrew, npm, pip, cargo, uv |
| [Security Tools](./tools/security-tools.md) | 41 | Encryption, pentesting, vulnerability scanning |
| [System Administration](./tools/system-administration.md) | 46 | Monitoring, disk usage, compression |
| [Terminal Information](./tools/terminal-information-control.md) | 2 | Terminal properties |
| [Terminal & Session Management](./tools/terminal-session-management.md) | 10 | tmux, screen, fzf, zoxide |
| [Text Processing](./tools/text-processing-manipulation.md) | 28 | sed, awk, grep, ripgrep |
| [Utility Tools](./tools/utility-tools.md) | 18 | xargs, coreutils, graphviz |
| [Version Control](./tools/version-control.md) | 7 | git, gh, delta |

*See [tools/README.md](./tools/README.md) for detailed index*

---

## 🚀 Quick Start

### Browse Tools
```bash
# By category
ls tools/                             # List all categories
cat tools/development-tools.md        # View development tools

# Search for specific tools
grep -r "pyenv" tools/                # Python version manager
grep -r "docker" tools/               # Container platform

# Find modern alternatives
grep -r "#rust" tools/                # Rust-based tools
grep -r "#modern-alternative" tools/  # Modern replacements
```

### Install Common Tools
```bash
# Modern Rust alternatives (10-100x faster)
brew install eza fd ripgrep bat sd dust procs bottom just ouch uv

# Essential development tools
brew install pyenv rbenv nvm docker kubectl

# macOS tools (built-in, no installation needed)
which mdfind defaults launchctl hdiutil osascript pbcopy
```

---

## 📖 Quick Reference Commands

### File Operations
```bash
# Modern alternatives (faster, better UX)
eza -la                      # Better ls with colors/icons
fd pattern                   # Better find (5-10x faster)
rg "search"                  # Better grep (10-100x faster)
bat file.txt                 # Better cat (syntax highlighting)
dust                         # Better du (visual tree)

# Traditional commands
ls -la                       # List all files with details
cp -r source/ dest/          # Copy directory recursively
mv file.txt new.txt          # Rename/move file
rm -i file.txt               # Remove with confirmation (use trash instead!)
mkdir -p path/to/dir         # Create nested directories
find . -name "*.txt"         # Find files by name
```

### Text Processing
```bash
grep "pattern" file          # Search in file
rg "pattern"                 # Faster recursive search (ripgrep)
sed 's/old/new/g' file       # Replace text
sd "old" "new" file          # Simpler, safer replacement
awk '{print $1}' file        # Print first column
head -20 file                # First 20 lines
tail -f logfile              # Follow log file
wc -l file                   # Count lines
```

### Git Commands
```bash
git status                   # Check status
git add .                    # Stage all changes
git commit -m "message"      # Commit
git push origin main         # Push to remote
git pull --rebase            # Pull with rebase
git log --oneline -10        # Last 10 commits
git diff HEAD~1              # Compare with last commit
```

### Process & System
```bash
htop                         # Interactive process viewer
procs                        # Better ps (modern, colored)
ps aux | grep process        # Find process
kill -9 PID                  # Force kill
df -h                        # Disk free space
du -sh *                     # Directory sizes
dust                         # Visual disk usage
```

### Network
```bash
curl -O https://url/file     # Download file
ssh user@host                # SSH connection
scp file user@host:~/        # Copy over SSH
ping -c 4 google.com         # Ping 4 times
netstat -an | grep LISTEN    # Listening ports
lsof -i :8080                # What's using port 8080
```

### Docker & Containers
```bash
docker ps                    # Running containers
docker images                # List images
docker exec -it ID bash      # Enter container
docker logs -f ID            # Follow logs
kubectl get pods             # List Kubernetes pods
kubectl logs -f pod          # Follow pod logs
```

---

## 🌟 Modern Alternatives (Rust-Based)

**Use these instead of traditional tools** - faster, better UX, maintained:

| Traditional | Modern | Speed | Key Benefits |
|-------------|--------|-------|--------------|
| ls | **eza** | Fast | Colors, git integration, icons |
| find | **fd** | 5-10x | Intuitive syntax, respects .gitignore |
| grep | **ripgrep (rg)** | 10-100x | Fastest search, smart defaults |
| cat | **bat** | Fast | Syntax highlighting, git diffs |
| sed | **sd** | Faster | Simpler syntax, safer |
| ps | **procs** | Fast | Better formatting, tree view |
| du | **dust** | Fast | Visual bars, intuitive |
| top | **bottom (btm)** | Fast | Modern UI, customizable |
| make | **just** | Fast | Simpler justfiles |
| tar/zip | **ouch** | Fast | Unified compression interface |
| pip | **uv** | 10-100x | Revolutionary Python package speed |

```bash
# Install all modern alternatives
brew install eza fd ripgrep bat sd dust procs bottom just ouch uv
```

---

## ⚠️ Safety Guidelines

### File Deletion Safety

**Never use `rm -rf` without triple-checking!** Use `trash` instead:

```bash
# Install trash (recoverable deletion)
brew install trash

# Safe deletion (moves to trash)
trash file.txt               # Single file
trash directory/             # Directory
trash *.log                  # Multiple files

# Recover if needed
trash -restore file.txt

# Traditional rm with safety
rm -i important.txt          # Interactive (prompts before deletion)
```

### Permission Management

**Avoid `chmod 777`** - it gives everyone full access:

```bash
# Good practices
chmod 644 document.txt       # Standard file (rw-r--r--)
chmod 755 script.sh          # Executable (rwxr-xr-x)
chmod 700 private.sh         # User-only (rwx------)

# Never do this (security risk!)
chmod 777 file               # ❌ Everyone can read/write/execute
```

### Using `sudo` Responsibly

```bash
# When to use sudo
sudo brew install tool       # System-wide installation
sudo vim /etc/hosts          # System files

# When NOT to use sudo
cd ~/ && sudo rm file        # ❌ Never in home directory
sudo npm install             # ❌ Use npm without sudo
sudo pip install             # ❌ Use pip --user or virtual environments
```

### macOS-Specific Safety

```bash
# Safe Spotlight search (no side effects)
mdfind "query"               # Search with Spotlight CLI

# Careful with defaults (backup first!)
defaults read com.app.id > backup.plist    # Backup before changes
defaults write com.app.id key value        # Modify settings

# Safe launchctl operations
launchctl list                             # List services
launchctl print user/$(id -u)              # Show user services
```

---

## 🎯 Common Use Cases

### Software Development
**Tools**: pyenv, rbenv, nvm, just, cmake, docker, kubectl, git, gh

```bash
# Version management
pyenv install 3.11           # Install Python version
rbenv install 3.2.0          # Install Ruby version
nvm install 18               # Install Node.js version

# Build & run
just build                   # Modern build tool
cmake .. && make             # Traditional build
docker-compose up            # Container services
```

### System Administration
**Tools**: htop, btop, procs, defaults, launchctl, mdfind, dust, ncdu

```bash
# Monitoring
htop                         # Interactive process viewer
btop                         # Modern resource monitor
procs                        # Better ps

# macOS admin
mdfind "kind:pdf"            # Find all PDFs with Spotlight
defaults read > backup.txt   # Backup preferences
launchctl list | grep user   # List user services
```

### DevOps & Cloud
**Tools**: awscli, gcloud, terraform, kubectl, helm, docker

```bash
# AWS
aws s3 ls                    # List S3 buckets
aws ec2 describe-instances   # List EC2 instances

# Kubernetes
kubectl get pods -A          # All pods
kubectl logs -f pod-name     # Follow logs
helm list                    # List releases

# Infrastructure as Code
terraform plan               # Preview changes
terraform apply              # Apply changes
```

### Data Processing
**Tools**: jq, sqlite3, miller, csvkit, ripgrep

```bash
# JSON processing
cat data.json | jq '.items[] | .name'    # Extract field
curl api.com | jq -r '.results'          # API response

# CSV processing
csvcut -c name,age data.csv              # Extract columns
csvstat data.csv                         # Statistics

# Text search
rg "error" --json logs/                  # Search logs
rg -C 3 "exception"                      # Context lines
```

---

## 🛠️ Validation & Maintenance

### Run Validations
```bash
# Full validation suite
./scripts/run_validation_suite.sh

# Fix statistics
./scripts/update_stats.sh --fix

# Validate metadata
./scripts/validate_and_fix.sh

# Check tool counts
grep -h "^### \*\*" tools/*.md | wc -l   # Should be 323
```

### Documentation Standards
Each tool entry includes:
1. **Complete metadata** (category, difficulty, tags, installation)
2. **Detailed description** with real-world use cases
3. **50+ lines of practical examples**
4. **Safety warnings** for destructive operations
5. **Modern alternatives** when available
6. **Related tools** and cross-references
7. **Platform-specific notes** (macOS, Linux, Windows)

---

## 🤝 Contributing

### Adding New Tools

1. **Choose appropriate category** in `tools/`
2. **Follow metadata template**:
   ```markdown
   ### **tool-name** - Brief description
   <!-- meta
   category: Category Name
   difficulty: ⭐⭐⭐ Intermediate
   tags: #tag1 #tag2
   related: tool1, tool2
   installation: brew install tool-name
   -->
   ```
3. **Include 50+ lines of examples**
4. **Add safety warnings** if needed
5. **Mention modern alternatives**
6. **Cross-reference related tools**

### Quality Standards
- Test all examples on current macOS
- Include difficulty ratings (⭐⭐ to ⭐⭐⭐⭐⭐)
- Add safety warnings for destructive operations
- Provide practical, real-world examples
- Document macOS-specific variations

### Pull Request Process
1. Fork repository and create feature branch
2. Add/update tools following standards above
3. Run: `./scripts/run_validation_suite.sh --strict`
4. Update statistics: `./scripts/update_stats.sh --fix`
5. Submit PR with clear description

---

## 📊 Project Statistics

**Documentation Coverage:**
- 323 tools across 19 categories with complete metadata
- 50-150 lines of practical examples per tool
- 70% coverage of top 50 Homebrew formulae
- 27 modern Rust alternatives highlighted

**By Difficulty:**
- ⭐⭐ **Beginner** (~60 tools): Everyday commands
- ⭐⭐⭐ **Intermediate** (~130 tools): Common workflows
- ⭐⭐⭐⭐ **Advanced** (~80 tools): Specialized usage
- ⭐⭐⭐⭐⭐ **Expert** (~22 tools): Deep expertise required

---

## 🔗 Quick Links

- **Browse Tools**: [tools/](./tools/) - Start here!
- **AI Integration**: [CLAUDE.md](./CLAUDE.md) - For LLM assistants
- **Master Plan**: [MASTER_PLAN.md](./MASTER_PLAN.md) - Roadmap & maintenance
- **Validation Scripts**: [scripts/](./scripts/) - Automated validation

---

## 📄 License & Acknowledgments

**License**: MIT - Educational and reference purposes. Tool information based on publicly available documentation.

**Acknowledgments**: Homebrew Community • Rust CLI Community • tldr Project • Open Source Community

---

**⭐ Star this repository if you find it useful!**

*Last updated: October 2025 - Actively maintained with 323 tools*
