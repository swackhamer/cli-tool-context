# MASTER_PLAN.md - Repository Planning & Maintenance Guide

## 📊 Current Status (October 2025)

**Repository Type:** Pure markdown CLI tools documentation
**Tool Count:** 323 tools across 19 categories
**Primary Source:** `tools/` directory (category-organized)
**Platform:** macOS (Apple Silicon/Intel)

### Key Statistics
- **323 tools** fully documented with metadata
- **19 category files** in tools/ directory
- **70% coverage** of top 50 Homebrew formulae
- **27 modern Rust alternatives** highlighted
- **100% metadata coverage** across all tools

---

## 🎯 Project Vision

Maintain the definitive CLI tools documentation for macOS systems, optimized for:
- **Developers** - Quick reference for development tools
- **System Administrators** - Comprehensive utilities guide
- **AI Assistants** - Structured, searchable documentation
- **Power Users** - Modern alternatives and best practices

### Core Principles
1. **Modern First** - Prioritize Rust-based alternatives (eza, fd, ripgrep, bat)
2. **macOS Native** - Leverage built-in tools (mdfind, defaults, launchctl)
3. **Safety First** - Warn about destructive operations
4. **Always Current** - Regular updates and validation
5. **Maintainability** - Clean structure, automated validation

---

## 📁 Repository Structure

```
cli-tool-context/
├── tools/                   # PRIMARY SOURCE - 19 category files, 323 tools
│   ├── ai-powered-tools.md
│   ├── cloud-container-tools.md
│   ├── data-processing-tools.md
│   ├── development-tools.md
│   ├── file-directory-operations.md
│   ├── macos-specific-tools.md
│   ├── network-tools.md
│   ├── package-managers.md
│   ├── security-tools.md
│   ├── system-administration.md
│   ├── text-processing-manipulation.md
│   ├── version-control.md
│   └── ... (19 total category files)
├── scripts/                 # Validation & maintenance (12 active scripts)
│   ├── run_validation_suite.sh
│   ├── update_stats.sh
│   ├── verify_tools.sh
│   └── validate_and_fix.sh
├── archive/                 # Archived components
│   ├── TOOLS.md             # Legacy monolithic reference (archived 2025-10-09)
│   ├── tui/                 # TUI markdown browser (archived 2025-10-09)
│   ├── site/old/            # Website files (44 files)
│   └── node_tools/          # TypeScript CLI (22 files)
├── .github/workflows/       # CI/CD automation
│   └── validate_docs.yml    # Documentation validation
├── README.md                # Project overview (255 lines, streamlined)
├── CLAUDE.md                # AI assistant guide (115 lines, concise)
├── MASTER_PLAN.md           # This file
└── LICENSE                  # MIT License
```

---

## 🔄 Recent Updates (October 2025)

### Archive Legacy Files (October 9, 2025)
**Branch:** `cleanup/archive-legacy-files`

1. **Archived TOOLS.md** → `archive/TOOLS.md`
   - Marked as legacy comprehensive reference
   - Updated all references throughout documentation
   - Modified `scripts/update_stats.sh` to use archived location

2. **Archived tui/** → `archive/tui/`
   - Python TUI markdown browser for tools/
   - Textual-based application (14MB with .venv)
   - Can be restored if needed

3. **Streamlined CLAUDE.md**
   - Reduced from 297 to 115 lines (60% reduction)
   - Focused on essential AI assistant guidance
   - Removed redundant sections

4. **Streamlined README.md**
   - Reduced from 330 to 255 lines (23% reduction)
   - Removed duplicate sections
   - Fixed all statistics (323 tools, 19 categories)

5. **Modernized CI/CD**
   - Cleaned `.github/workflows/validate_docs.yml`
   - Removed references to non-existent files
   - Uses existing validation scripts
   - Updated to latest GitHub Actions versions
   - Portable regex for macOS/Linux compatibility

---

## ✅ Quality Assurance

### Validation Scripts

**Run comprehensive validation:**
```bash
./scripts/run_validation_suite.sh --detailed --strict
```

**Update statistics:**
```bash
./scripts/update_stats.sh --fix
```

**Verify tool counts:**
```bash
# Tools: 323
grep -h "^### \*\*" tools/*.md | wc -l

# Categories: 19
ls tools/*.md | grep -v README | wc -l
```

**Validate markdown:**
```bash
markdownlint-cli2 "**/*.md" "#archive" "#node_modules"
```

### CI/CD Checks
- ✅ Comprehensive validation suite
- ✅ Markdown formatting
- ✅ Internal link validation
- ✅ Tool count consistency
- ✅ Required files check
- ✅ Script executability

---

## 📋 Maintenance Schedule

### Weekly
- [ ] Check for new Homebrew formula updates
- [ ] Review security advisories for documented tools
- [ ] Update broken examples or deprecated flags

### Monthly
```bash
# Full validation suite
./scripts/run_validation_suite.sh --detailed

# Statistics verification
./scripts/update_stats.sh --verify-stats

# Metadata validation
python3 validate_metadata.py

# Markdown linting
markdownlint-cli2 "**/*.md" "#archive"
```

### Quarterly
- [ ] Comprehensive tool audit (verify all tools still work)
- [ ] Update version numbers and compatibility notes
- [ ] Review and update modern alternatives
- [ ] Check for new essential tools to add

### Annual
- [ ] Full macOS compatibility check (new OS version)
- [ ] Refresh all tool descriptions and examples
- [ ] Update installation instructions
- [ ] Archive deprecated tools

---

## 🛠️ Tool Management

### Adding New Tools

**Criteria:**
1. Available via Homebrew or built-in to macOS
2. Serves development, sysadmin, or power-user needs
3. Actively maintained (updated within 2 years)
4. Not duplicate functionality without clear benefit
5. Has adequate official documentation

**Process:**
1. Choose appropriate category file in `tools/`
2. Follow metadata template:
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
3. Include 50+ lines of practical examples
4. Add safety warnings if needed
5. Mention modern alternatives
6. Cross-reference related tools
7. Run validation: `./scripts/run_validation_suite.sh`
8. Update statistics: `./scripts/update_stats.sh --fix`

### Tool Deprecation

**Criteria:**
- No longer maintained (2+ years)
- Replaced by superior alternative
- Security vulnerabilities without fixes
- Incompatible with current macOS
- Functionality merged into another tool

**Process:**
1. Mark with deprecation warning
2. Add recommended alternative
3. Keep for 1 quarter with warning
4. Move to `archive/deprecated/`
5. Update all statistics and cross-references

---

## 🎯 Priority Tools to Add

### High Priority
**Media & Graphics:**
- yt-dlp - Video downloading (modern youtube-dl)
- ghostscript - PostScript/PDF processing
- qrencode - QR code generation

**Database:**
- mongodb - MongoDB shell
- influxdb - Time-series database
- sqlite-utils - Enhanced SQLite utilities

**Performance:**
- btop - Modern resource monitor (already documented?)
- valgrind - Memory debugging
- tcpdump - Network packet analyzer

**Backup:**
- restic - Fast, secure backup
- rclone - Cloud storage sync
- borgbackup - Deduplicating backup

---

## 🤝 Contributing

### Standards
- Follow existing documentation format
- Test all examples on current macOS
- Include difficulty ratings
- Add safety warnings for destructive operations
- Provide practical use cases
- Run validation suite before submitting

### Pull Request Process
1. Fork repository and create feature branch
2. Add/update tools following quality standards
3. Run: `./scripts/run_validation_suite.sh --strict`
4. Update statistics: `./scripts/update_stats.sh --fix`
5. Submit PR with clear description
6. Address review feedback

---

## 📊 Success Metrics

### Quantitative Goals
- ✅ **323 tools** documented with metadata
- ✅ **100% metadata coverage** across all tools
- ✅ **19 categories** logically organized
- ✅ **70% Homebrew coverage** (top 50 formulae)
- [ ] **Zero broken links** (ongoing validation)
- [ ] **All examples tested** on latest macOS

### Qualitative Goals
- ✅ **Modern alternatives** prominently featured
- ✅ **Safety warnings** for destructive operations
- ✅ **Streamlined documentation** (README, CLAUDE.md)
- ✅ **Automated validation** via CI/CD
- [ ] **Fast tool discovery** (<30 seconds)
- [ ] **Active maintenance** (<2 hours/month)

---

## 🔧 Troubleshooting

### Statistics Mismatch
```bash
# Check actual counts
echo "Tools: $(grep -h '^### \*\*' tools/*.md | wc -l)"
echo "Categories: $(ls tools/*.md | grep -v README | wc -l)"

# Fix statistics
./scripts/update_stats.sh --fix
```

### Broken Links
```bash
# Check for broken internal links
./scripts/run_validation_suite.sh --detailed | grep "broken"
```

### Tool Not Found
```bash
# Check if installed
which tool-name

# Install via Homebrew
brew install tool-name

# Check PATH
echo $PATH
```

---

## 🚀 Future Roadmap

### Short Term (Next Quarter)
- [ ] Complete comprehensive tool audit
- [ ] Add priority tools (media, database, backup)
- [ ] Update all version numbers
- [ ] Improve search/discovery mechanisms

### Medium Term (Next Year)
- [ ] Expand to 400+ tools
- [ ] Add interactive tool selector
- [ ] Create learning paths for different roles
- [ ] Community contribution framework

### Long Term (Multi-Year)
- [ ] Multi-platform support (Linux, Windows)
- [ ] Video tutorials for complex tools
- [ ] Integration with package managers
- [ ] API for programmatic access

---

## 📝 Notes

### Archive Information
**TOOLS.md** - Archived 2025-10-09 to `archive/TOOLS.md`
- Previously: Legacy monolithic reference (327 tools documented)
- Reason: Project refocused on `tools/` directory as primary source
- Status: Maintained in archive for historical reference
- Scripts updated to use `archive/TOOLS.md` for compatibility

**tui/** - Archived 2025-10-09 to `archive/tui/`
- Python TUI application using Textual library
- Markdown browser for tools/ directory
- Can be restored if needed (see archive/tui/README.md)

### Key Decisions
1. **tools/ is PRIMARY SOURCE** - All documentation work happens here
2. **Automated validation** - CI/CD enforces quality standards
3. **Modern alternatives first** - Rust tools prioritized
4. **Safety critical** - Always warn about destructive operations
5. **macOS focused** - Platform-specific optimizations

---

## 📄 License & Acknowledgments

**License:** MIT - Educational and reference purposes
**Tool Information:** Based on publicly available documentation

**Acknowledgments:**
- Homebrew Community - Analytics and package ecosystem
- Rust CLI Community - Modern, fast, user-friendly tools
- tldr Project - Practical examples and contributions
- Open Source Community - Best practices and innovations

---

*Last updated: October 9, 2025*
*Current branch: cleanup/archive-legacy-files*
*Status: Active maintenance - 323 tools, 19 categories*
*Next review: Monthly maintenance (November 2025)*
