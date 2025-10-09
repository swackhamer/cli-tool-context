# Recommended Tools for Future Documentation

This file contains CLI tools that would be valuable additions to the documentation. These tools may or may not be installed on the current system but are well-regarded and compatible with macOS.

**Status Update (October 2025)**:
- The repository now uses the `tools/` directory with 19 category files containing **271 documented tools**
- Many tools previously listed here have been documented in various category files
- Tools marked with ✅ indicate they are now documented, with file locations in parentheses
- This file serves as a roadmap for future expansion beyond the current 271 tools

## High Priority Tools

### Media & Graphics Processing
- ✅ **ffmpeg** - DOCUMENTED - Comprehensive media processing
- ✅ **imagemagick** / **convert** - DOCUMENTED - Image manipulation
- **gimp** - GNU Image Manipulation Program (command-line interface)
- ✅ **exiftool** - DOCUMENTED - Read/write metadata in files
- ✅ **sox** - DOCUMENTED - Sound processing utilities
- **youtube-dl** / **yt-dlp** - Download videos from YouTube and other sites
- **mencoder** - Movie encoder for various formats
- **ghostscript** / **gs** - PostScript and PDF processor
- ✅ **pandoc** - DOCUMENTED - Universal document converter
- **qrencode** - QR code generator

### Database & Data Analysis Tools
- ✅ **mysql** / **mariadb** - DOCUMENTED - MySQL database client
- ✅ **postgresql** / **psql** - DOCUMENTED - PostgreSQL database client
- ✅ **redis-cli** - DOCUMENTED - Redis key-value store client
- **mongodb** / **mongo** - MongoDB NoSQL database shell
- **influxdb** / **influx** - InfluxDB time-series database client
- ✅ **csvkit** - DOCUMENTED - Suite of utilities for CSV files
- ✅ **miller** / **mlr** - DOCUMENTED - Data processing tool
- **q** - Run SQL on CSV and delimited files
- ✅ **datamash** - DOCUMENTED - Statistical operations on text files
- **sqlite-utils** - Enhanced SQLite command-line utilities

### Performance & System Analysis
- ✅ **htop** - DOCUMENTED - Enhanced process viewer
- ✅ **btop** - DOCUMENTED (tools/system-administration.md) - Modern resource monitor with better visualization
- **iotop** - I/O monitoring by process (Linux equivalent on macOS)
- **ctop** - Container-based process monitoring
- **nettop** - Network usage monitor (macOS native)
- **perf** - Performance analysis tools (Linux equivalent)
- **valgrind** - Memory debugging and profiling
- **gprof** - GNU profiler for performance analysis
- **tcpdump** - Network packet analyzer
- **wireshark** / **tshark** - Network protocol analyzer
- ✅ **iftop** - DOCUMENTED - Bandwidth usage monitor
- **nethogs** - Per-process network bandwidth monitor

### Cloud & Container Orchestration
- ✅ **kubectl** - DOCUMENTED (tools/cloud-container-tools.md) - Kubernetes cluster management
- ✅ **helm** - DOCUMENTED (tools/cloud-container-tools.md) - Kubernetes package manager
- **kind** - Kubernetes in Docker
- **minikube** - Local Kubernetes cluster
- ✅ **k9s** - DOCUMENTED (tools/cloud-container-tools.md) - Kubernetes CLI dashboard
- ✅ **docker-compose** - DOCUMENTED - Multi-container Docker applications
- **buildah** - Build container images
- ✅ **podman** - DOCUMENTED (tools/cloud-container-tools.md) - Container runtime alternative to Docker
- ✅ **aws-cli** - DOCUMENTED - Amazon Web Services command line
- **gcloud** - Google Cloud Platform CLI
- **azure-cli** - Microsoft Azure command line
- ✅ **terraform** - DOCUMENTED - Infrastructure as code
- ✅ **ansible** - DOCUMENTED - IT automation
- **vagrant** - Development environment provisioning

### Advanced Development Tools
- ✅ **lldb** - DOCUMENTED - LLVM debugger
- ✅ **gdb** - DOCUMENTED - GNU debugger
- ✅ **strace** - DOCUMENTED - System call tracer (dtruss on macOS)
- **ltrace** - Library call tracer
- **perf** - Performance monitoring (Linux equivalent)
- ✅ **ripgrep** / **rg** - DOCUMENTED - Fast text search
- ✅ **fd** - DOCUMENTED - Fast file finder
- ✅ **exa** / **eza** - DOCUMENTED - Modern ls replacement
- ✅ **bat** - DOCUMENTED - Cat with syntax highlighting
- ✅ **delta** - DOCUMENTED - Git diff with syntax highlighting
- ✅ **lazygit** - DOCUMENTED - Simple terminal UI for git
- ✅ **tig** - DOCUMENTED - Text-based Git repository browser

### Backup & Synchronization
- **rsnapshot** - Filesystem snapshot utility
- **duplicity** - Encrypted bandwidth-efficient backup
- **rclone** - Sync files to cloud storage
- **borgbackup** - Deduplicating backup program
- **restic** - Fast, secure backup program
- **rdiff-backup** - Reverse differential backup tool
- **unison** - File synchronization tool
- **lsyncd** - Live syncing daemon
- **syncthing** - Continuous file synchronization
- **timeshift** - System snapshot and restore (Linux equivalent)

## Medium Priority Tools

### Text Processing & Editors
- **emacs** - Extensible text editor (may not be pre-installed)
- **micro** - Modern terminal text editor
- **helix** - Post-modern modal text editor
- **kakoune** - Code editor inspired by Vim
- **sublime_text** / **subl** - Sublime Text command line
- **code** - Visual Studio Code command line (often available)
- **atom** - Atom editor command line (deprecated but still used)

### System Utilities
- ✅ **ncdu** - DOCUMENTED - NCurses-based disk usage analyzer
- ✅ **dust** - DOCUMENTED - More intuitive version of du
- ✅ **hyperfine** - DOCUMENTED (tools/development-tools.md) - Command-line benchmarking tool
- ✅ **procs** - DOCUMENTED (tools/system-administration.md) - Modern replacement for ps
- ✅ **sd** - DOCUMENTED (tools/text-processing-manipulation.md) - Intuitive find & replace CLI
- ✅ **tokei** - DOCUMENTED (tools/development-tools.md) - Code statistics tool
- ✅ **cloc** - DOCUMENTED (tools/development-tools.md) - Count lines of code
- ✅ **scc** - DOCUMENTED (tools/development-tools.md) - Fast code counter
- **loc** - Count lines of code (Rust implementation)

### Network & Security
- **nmap** - Network discovery and security auditing
- **masscan** - Mass IP port scanner
- **zmap** - Internet-wide network scanner
- **nikto** - Web server scanner
- **dirb** - Web content scanner
- **gobuster** - Directory/file & DNS busting tool
- **john** - John the Ripper password cracker
- **hashcat** - Advanced password recovery
- **aircrack-ng** - WiFi security auditing tools
- **metasploit** - Penetration testing framework

### Package Managers & Build Tools
- **conan** - C/C++ package manager
- **vcpkg** - C/C++ library manager
- **spack** - Package manager for HPC
- ✅ **bazel** - DOCUMENTED (tools/development-tools.md) - Build tool for large-scale software
- **buck** - Build system by Facebook
- ✅ **ninja** - DOCUMENTED (tools/development-tools.md) - Small build system with focus on speed
- ✅ **meson** - DOCUMENTED (tools/development-tools.md) - Build system designed to be fast
- **xmake** - Modern C/C++ build utility

## Low Priority / Specialized Tools

### Scientific & Mathematical
- **octave** - GNU Octave mathematical programming language
- **maxima** - Computer algebra system
- **scilab** - Numerical computational package
- **gnuplot** - Plotting program
- **r** - R statistical computing language
- **julia** - High-performance programming language
- **sage** - Mathematics software system

### Document Processing
- **latex** / **pdflatex** - LaTeX document preparation
- **bibtex** - Bibliography tool for LaTeX
- **asciidoc** / **asciidoctor** - Text document format
- **sphinx** - Documentation generator
- **mkdocs** - Fast documentation generator
- **hugo** - Static site generator
- **jekyll** - Static site generator

### Archival & File Systems
- **7z** - 7-Zip archiver
- **rar** / **unrar** - WinRAR archiver
- **p7zip** - 7-Zip port
- **arc** - Archive utility
- **zoo** - Archive format
- **lha** / **lhz** - LHA archiver
- **rpmdb** - RPM database tools
- **dpkg** - Debian package manager tools

### Terminal Enhancement
- **tmux** - Terminal multiplexer (often installed)
- **screen** - Terminal multiplexer (pre-installed)
- **zellij** - Terminal workspace with batteries included
- **byobu** - Enhanced terminal multiplexer
- **terminator** - Terminal emulator with advanced features
- **alacritty** - GPU-accelerated terminal emulator
- **kitty** - Fast, feature-rich terminal emulator

## Installation Notes

### Homebrew Packages
Most of these tools can be installed via Homebrew:
```bash
# High-priority media tools
brew install ffmpeg imagemagick exiftool sox youtube-dl pandoc

# Database tools
brew install mysql postgresql redis mongodb

# Development tools
brew install ripgrep fd exa bat delta lazygit tig

# System monitoring
brew install htop btop ctop

# Cloud tools
brew install kubectl helm terraform ansible

# Performance tools
brew install hyperfine tokei cloc

# Network tools
brew install nmap tcpdump wireshark
```

### Manual Installation Required
Some tools may require manual installation or compilation:
- **Valgrind**: Requires special installation on macOS
- **Perf**: Linux-specific, use Instruments on macOS instead
- **Strace**: Use dtruss on macOS instead

### macOS Alternatives
For some Linux tools, macOS has native alternatives:
- **strace** → **dtruss** (already documented)
- **lsof** → **lsof** (already documented)
- **netstat** → **netstat** (already documented)
- **iotop** → **iotop** (available via Homebrew)
- **htop** → **top** (native) or **htop** (Homebrew)

## Tool Categories Summary

### By Installation Method
- **Pre-installed on macOS**: Many system tools already documented
- **Homebrew installable**: Most development and utility tools
- **Manual compilation**: Some specialized tools
- **Commercial/Licensed**: Some professional tools

### By Use Case (Updated October 2025)
- **Daily Development**: ✅ ripgrep, fd, bat, delta, lazygit (all documented)
- **System Administration**: ✅ htop, btop, ansible (documented); nmap (not yet)
- **Media Processing**: ✅ ffmpeg, imagemagick, sox (all documented)
- **Data Analysis**: ✅ csvkit, jq, datamash (all documented)
- **Cloud/DevOps**: ✅ kubectl, helm, k9s, terraform, docker-compose, podman (documented)
- **Security**: nmap, john, hashcat, metasploit (not yet documented)

### By Complexity (Updated October 2025)
- **Beginner-friendly**: ✅ htop, btop, ripgrep, fd, bat (all documented)
- **Intermediate**: ✅ kubectl, terraform, ansible (documented); nmap (not yet)
- **Advanced**: valgrind, metasploit, custom compilation tools (not yet documented)
- **Expert**: Performance profiling, security research tools (not yet documented)

## Current Documentation Status (October 2025)

### Tools Now Documented (in tools/ directory)
The following categories have comprehensive documentation across 19 category files:
- ✅ **Cloud & Container Tools**: kubectl, helm, k9s, podman, docker-compose (13 tools total)
- ✅ **Development Tools**: bazel, ninja, meson, hyperfine, tokei, cloc, scc (34 tools total)
- ✅ **System Administration**: btop, procs, htop, iftop (45 tools total)
- ✅ **Text Processing**: sd, choose, cw (28 tools total)
- ✅ **Modern Replacements**: fd, ripgrep, bat, eza, dust, duf, gping, zoxide, xh (documented)
- ✅ **Total**: 271 tools across 19 category files

### Next Steps for Further Expansion

**High Priority Remaining Tools:**
1. **Security Tools**: nmap, masscan, john, hashcat (security auditing)
2. **Media Processing**: youtube-dl/yt-dlp, ghostscript, qrencode (additional media tools)
3. **Database Tools**: mongodb, influxdb, sqlite-utils (specialized databases)
4. **Performance Analysis**: valgrind, tcpdump, wireshark/tshark (debugging/profiling)
5. **Cloud Tools**: gcloud, azure-cli, kind, minikube (additional cloud platforms)

**Process for Adding New Tools:**
1. Verify availability on target macOS system
2. Install via Homebrew where possible
3. Test functionality and gather usage examples
4. Add to appropriate category file in `tools/` directory
5. Update `tools/README.md` with new tool count
6. Follow existing metadata format and quality standards

This list provides a roadmap for expanding beyond the current 271 documented tools while maintaining the project's focus on practical, high-quality documentation.