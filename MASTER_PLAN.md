# MASTER_PLAN.md - Comprehensive Repository Planning & Maintenance Guide

## 🔔 ARCHIVE NOTICE (2025-10-07)

**Major Project Restructuring**: The repository has been refocused as a pure markdown documentation project.

### Archived Components (93 files)
The following components have been moved to `archive/` with complete documentation:
- **Website** (`archive/site/old/`) - 44 website files (HTML, CSS, JavaScript)
- **Node.js Tools** (`archive/node_tools/`) - 22 TypeScript CLI files
  - **CRITICAL**: Parser generates 291 tools instead of 267 (see archive/node_tools/KNOWN_ISSUES.md)
- **Website Scripts** - 5 website generation scripts
- **Test Files** (`archive/website/`) - 4 test/validation files
- **Historical Docs** (`TOOLS_TODO.md`, `WARP.md`) - Planning documents

### Current Focus (267 Tools, 19 Categories)
- **tools/** directory - 267 tools organized into 19 category files (PRIMARY SOURCE)
- **TOOLS.md** - Comprehensive monolithic reference (maintained for compatibility)
- **Documentation** - Pure markdown documentation with active validation
- **Validation Scripts** - 12 active maintenance scripts in `scripts/`
- **Archive Documentation** - Complete revival instructions in `archive/README.md`

*This planning document has been updated to reflect the current repository state after cleanup branch work.*

---

## 🎯 Executive Summary & Vision

This master plan consolidates all repository planning, maintenance, and development documentation into a single comprehensive source of truth. The CLI Tools Documentation repository has successfully achieved its core objective with **267 tools documented across 19 categories**, establishing itself as the definitive macOS CLI tools reference for markdown-based documentation.

### Project Vision
Transform and maintain the CLI tools repository as a cleaner, more maintainable, and LLM-optimized resource that serves both human users and AI assistance effectively, while continuously evolving to meet changing development needs.

### Key Achievements
- ✅ **267 tools** comprehensively documented across 19 category files
- ✅ **19 categories** with logical organization in `tools/` directory
- ✅ **Clean separation** - Documentation in active files, code/website in archive
- ✅ Modern alternatives integrated throughout
- ✅ Safety warnings and best practices included
- ✅ Automated validation and maintenance scripts (12 active scripts)
- ✅ Complete archival documentation with revival instructions
- ✅ Metadata consistency across all category files
- ✅ No duplicate tools - verified with validation scripts

---

## 📋 Current Status & Immediate Priorities

### Repository Status: **Focused Markdown Documentation**
The project has successfully refocused as a pure markdown documentation repository with 267 verified tools across 19 category files. Major cleanup completed (October 2025) including archival of 93 files (website, TypeScript CLI, scripts) with complete documentation and revival instructions.

### Immediate Tasks (High Priority - Complete ASAP)

#### Documentation Consistency ✅ COMPLETED
- [x] Remove legacy documentation files - COMPLETED
- [x] Unify repository statistics (267 tools, 19 categories) - COMPLETED
- [x] Consolidate duplicate files - COMPLETED (removed system_administration_tools.md)
- [x] Archive website and code generation - COMPLETED (93 files archived 2025-10-07)
- [x] Fix tool counts across all documentation - COMPLETED
- [x] Remove orphaned content from category files - COMPLETED (389 lines removed)
- [x] Create comprehensive branch summary - COMPLETED (CLEANUP_BRANCH_SUMMARY.md)
- [x] Validate metadata consistency - COMPLETED (validate_metadata.py)

#### Tool Verification
- [ ] Verify all tool examples still work on current macOS versions
- [ ] Update deprecated command options and flags
- [ ] Test installation instructions via Homebrew
- [ ] Validate cross-references between tools

#### Quality Assurance
- [ ] Run comprehensive validation suite (`./scripts/run_validation_suite.sh`)
- [ ] Fix all validation suite findings
- [ ] Update tool version numbers and compatibility notes
- [ ] Check for security advisories affecting documented tools

---

## 🚀 Implementation Phases

### Phase 1: Repository Cleanup & Organization (Week 1) - COMPLETED ✅

#### 1.1 File Structure Rationalization
**Priority: HIGH** | **Timeline: Immediate** | **Impact: High**

**Naming Conventions:**
- **Documentation Files:** Use UPPER_CASE with underscores (e.g., `MASTER_PLAN.md`, `TOOLS_TODO.md`)
- **Canonical Files:** Keep standard naming (e.g., `README.md`, `LICENSE`, `CHANGELOG.md`)
- **Script Files:** Use lower-case with underscores (e.g., `update_stats.sh`, `verify_tools.sh`)
- **Site Files:** Use lower-case with hyphens for web assets (e.g., `tool-browser.html`, `main.css`)
- **Data Files:** Use lower-case with hyphens (e.g., `tools-data.json`, `categories-list.json`)

**Action Items - COMPLETED:**
```bash
# ℹ️ NOTE: Repository Root Detection & Safe Command Execution
# Always run commands from repository root to ensure portability
# Always run commands from repository root to ensure portability
#
# Method 1: Using git command (preferred for git repositories)
# REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
#
# Method 2: Using script directory (for scripts in scripts/ folder)
# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# REPO_ROOT="$(dirname "$SCRIPT_DIR")"
#
# Method 3: Inline command prefix
# cd "$(git rev-parse --show-toplevel)" && <your-command-here>
#
# Example usage in scripts (see scripts/update_stats.sh for reference):
# REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || \
#   REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ✅ COMPLETED - Duplicate files removed (using git rm for version history):
# git rm CHEATSHEET.md
# git rm system_administration_tools.md

# ✅ COMPLETED - CLAUDE documentation consolidated
# CLAUDE.md + CLAUDE_IMPROVEMENTS.md have been replaced with stubs

# ⚠️ CAUTION - Archive operations (verify before running):
# These commands would move files to archive - verify current state first:
# mkdir -p archive
# git mv TRACER_PLAN.md archive/  # IF file exists and should be archived
# git mv TODO.md archive/          # IF file exists and should be archived
# Note: MAINTENANCE.md remains in docs/ as it's actively referenced by README
# git mv docs/FUTURE_TOOLS.md archive/  # IF file exists
```

**Current Structure (After Cleanup):**
```
cli-tool-context/
├── tools/                   # PRIMARY SOURCE - 19 category files
│   ├── ai-powered-tools.md
│   ├── cloud-container-tools.md
│   ├── development-tools.md
│   ├── file-directory-operations.md
│   ├── network-tools.md
│   ├── system-administration.md
│   ├── text-processing-manipulation.md
│   ├── ... (19 total files)
│   └── README.md           # Category index
├── docs/                    # Project documentation
│   ├── DOCUMENTATION.md    # Combined project docs
│   ├── PROJECT_STATUS.md   # Project status tracking
│   └── templates/          # Documentation templates
├── scripts/                 # Active validation scripts (12 scripts)
│   ├── run_validation_suite.sh
│   ├── update_stats.sh
│   ├── verify_tools.sh
│   └── ... (validation & maintenance)
├── archive/                 # Archived components (93 files)
│   ├── site/old/           # 44 website files
│   ├── node_tools/         # 22 TypeScript CLI files
│   │   ├── KNOWN_ISSUES.md # Parser problems documented
│   │   └── README.md       # Revival instructions
│   ├── scripts/            # 5 website scripts
│   ├── website/            # 4 test files
│   └── README.md           # Complete archive documentation
├── MASTER_PLAN.md          # This comprehensive plan (updated)
├── TOOLS.md                # Comprehensive reference (maintained for compatibility)
├── CLAUDE.md               # AI integration guide (updated for 267 tools)
├── README.md               # Project overview (updated, no website references)
├── check_duplicates.py     # Duplicate verification
├── validate_metadata.py    # Metadata validation
└── CLEANUP_BRANCH_SUMMARY.md  # Branch summary
```

#### 1.2 TODO.md Refactoring
**Priority: MEDIUM** | **Timeline: Week 1** | **Impact: Medium**

Restructure active tasks with clear prioritization:
- 🎯 Current Focus (Top 3 priorities)
- 📋 Active Tasks (In Progress)
- ⏰ Scheduled Tasks (By Timeline)
- ✅ Recently Completed (Last 30 days)
- 🔮 Future Vision (Long-term ideas)

### Phase 2: LLM Context & Structure Optimization (Week 2)

#### 2.1 TOOLS.md Metadata Enhancement
**Priority: HIGH** | **Timeline: Week 2** | **Impact: Very High**

**Add Structured Metadata Headers:**
```markdown
<!-- meta
category: File Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: fd, find
tags: #files #search #essential
related: grep, rg, locate
keywords: search, find, locate, files
synonyms: file-find, search-files
platform: macOS, Linux
installation: brew install fd
-->
```

#### 2.2 Search Optimization
- Add keywords and synonyms for all tools
- Create tool decision trees for common tasks
- Implement consistent tagging system (#essential, #modern-alternative, etc.)
- Enhance cross-references with bidirectional links

### Phase 3: Quality Enhancement & Validation (Week 3)

#### 3.1 Comprehensive Tool Audit
```bash
# For each documented tool, verify:
1. Tool exists at documented location
2. Version information is current
3. All documented flags/options work
4. Examples execute without errors
5. Man page information is accurate
6. Installation instructions are correct
```

#### 3.2 Content Accuracy Updates
- Version update sweep across all tools
- Platform compatibility review (Intel vs Apple Silicon)
- Safety information updates
- Performance comparison matrices

### Phase 4: Documentation Polish & Future Planning (Week 4)

#### 4.1 Final Consistency Check
- Format consistency validation
- Statistics regeneration
- Comprehensive index updates
- User feedback system implementation

#### 4.2 Future Planning Framework
- Establish review cycles (monthly, quarterly, annual)
- Community integration planning
- Technology evolution tracking
- Success metrics monitoring

### Phase 5: Website Interface 📦 ARCHIVED (October 2025)

#### 5.1 Archival Summary
**Status: ARCHIVED** | **Date: 2025-10-07** | **Location: archive/**

**What Was Archived:**
- [x] Complete website (44 files) - `archive/site/old/`
- [x] TypeScript CLI (22 files) - `archive/node_tools/`
- [x] Website scripts (5 files) - `archive/scripts/`
- [x] Test files (4 files) - `archive/website/`

**Why Archived:**
- Repository refocused on pure markdown documentation
- TypeScript CLI parser has critical issues (generates 291 tools instead of 267)
- Website functionality can be restored if needed (see archive/README.md)

**Archive Documentation:**
- ✅ Complete KNOWN_ISSUES.md documenting parser problems
- ✅ Full revival instructions in archive/README.md
- ✅ Validation script (validate_json_output.py) included
- ✅ All issues and solutions documented

#### 5.2 Revival Instructions
If website functionality is needed again:
1. Fix TypeScript CLI parser (see archive/node_tools/KNOWN_ISSUES.md)
2. Modify parser to use `tools/` directory instead of TOOLS.md
3. Test with archive/node_tools/validate_json_output.py
4. Restore website files from archive/site/old/
5. Update data generation scripts to use fixed parser

**Critical Issue:** Parser treats documentation section headers as tools (24 fake tools identified)
**Solution:** Use tools/ directory as source instead of TOOLS.md to avoid parsing documentation sections

---

## 🔧 Ongoing Maintenance Procedures

### Daily Tasks (As Needed)
- Monitor repository issues and user feedback
- Respond to urgent tool updates or security advisories
- Quick fixes for documentation errors
- Statistics consistency checks

### Weekly Tasks
- [ ] Review recent system tool additions
- [ ] Check for new Homebrew formula updates
- [ ] Scan for deprecated tool warnings
- [ ] Update any broken examples
- [ ] Documentation consistency verification

### Monthly Tasks
```bash
# Comprehensive validation
./scripts/run_validation_suite.sh --detailed

# Statistics verification
./scripts/update_stats.sh --verify-stats

# Tool verification
./scripts/verify_tools.sh --detailed

# Metadata validation (tools/ directory)
python3 validate_metadata.py

# Check for duplicate tools
python3 check_duplicates.py

# Format checking
npx markdownlint-cli2 "tools/*.md" "*.md" --config .markdownlint.json
```

### Quarterly Tasks
- [ ] **Comprehensive Tool Audit**
  - Generate full tool report
  - Check all documented tools still exist
  - Identify missing essential tools
- [ ] **Documentation Quality Review**
  - Format consistency check
  - Example verification
  - Safety warning updates
  - Modern alternative additions
- [ ] **Category Reorganization**
  - Assess if categories need splitting
  - Check for new category requirements
  - Update Tool Finder index

### Annual Tasks
- [ ] **Major Version Updates**
  - Full macOS compatibility check
  - Update all version-specific notes
  - Refresh installation instructions
  - Archive deprecated tools
- [ ] **Comprehensive Rewrite Review**
  - Update all tool descriptions
  - Refresh all examples
  - Modernize recommendations
  - Update learning paths

---

## 🔄 Recent Fixes & Updates (October 2025)

### Major Repository Cleanup (Cleanup Branch - 13 Commits)
1. **Tool Count Corrections**: Fixed inconsistent tool counts across documentation
   - Issue: Different counts reported (269, 267, 303) in various files
   - Solution: Verified actual count (267 tools) and updated all documentation
   - Files updated: tools/README.md, CLAUDE.md, README.md

2. **Orphaned Content Removal**: Removed 389 lines of duplicate/misplaced content
   - environment-process-management.md: Removed stty and duplicate jobs content
   - terminal-information-control.md: Removed test content
   - output-manipulation-utilities.md: Removed llm content
   - Created check_duplicates.py to prevent future duplicates

3. **Complete Archival**: Moved 93 files to archive with full documentation
   - 44 website files → archive/site/old/
   - 22 TypeScript CLI files → archive/node_tools/
   - Documented parser issues (generates 291 tools instead of 267)
   - Created KNOWN_ISSUES.md with solutions

### Documentation Improvements
- ✅ All file references updated (no broken links)
- ✅ Metadata consistency validated across all category files
- ✅ Created comprehensive branch summary (CLEANUP_BRANCH_SUMMARY.md)
- ✅ Added validation tooling (validate_metadata.py, check_duplicates.py)
- ✅ Removed all references to archived components

---

## ✅ Quality Assurance Framework

### Validation Suite Components

#### Automated Validation (`scripts/run_validation_suite.sh`)
1. **Infrastructure Check**: Required scripts present and executable
2. **README.md Validation**: Statistics markers and consistency
3. **TOOLS.md Metadata**: Format and completeness
4. **Documentation Format**: Consistency across all docs
5. **Internal Links**: Cross-references validation
6. **Tool Availability**: System verification
7. **Statistics Synchronization**: Count consistency
8. **Cross-Reference Integrity**: Link validation

#### Running Validation
```bash
# Full detailed validation
./scripts/run_validation_suite.sh --detailed

# Quick summary only
./scripts/run_validation_suite.sh --summary

# With automated fix suggestions
./scripts/run_validation_suite.sh --fix-suggestions

# Statistics-focused validation
./scripts/run_validation_suite.sh --validate-stats
```

### Tool Verification Standards

#### For Each Tool Entry
- [ ] Tool name formatted as `**tool-name**`
- [ ] Metadata block included
- [ ] Description from official man page
- [ ] Location path absolute and correct
- [ ] Common use cases listed (2 minimum)
- [ ] Examples practical and tested
- [ ] Difficulty rating included
- [ ] Safety warnings where applicable
- [ ] Modern alternatives mentioned
- [ ] Cross-references to related tools

### Documentation Standards

#### Format Template
```markdown
### **tool-name** - Brief Description
<!-- meta
category: Category Name
difficulty: ⭐⭐⭐ Intermediate
aliases: alias1, alias2
tags: #tag1 #tag2
related: tool1, tool2
keywords: keyword1, keyword2
synonyms: synonym1, synonym2
-->
**Description**: Detailed description
**Location**: `/absolute/path`
**Difficulty**: ⭐⭐⭐
**Common Use Cases**:
- Primary use case
- Secondary use case

**Examples**:
```bash
# Basic usage
tool-name args
```

**Safety**: Warnings if applicable
**Modern Alternative**: modern-tool
**Related**: See also tool-x, tool-y
```

---

## 📈 Tool Management & Expansion

### Tool Addition Criteria

#### Acceptance Standards
1. **Availability**: Must be available via Homebrew or built-in to macOS
2. **Relevance**: Must serve development, sysadmin, or power-user needs
3. **Quality**: Must be actively maintained (updated within 2 years)
4. **Uniqueness**: Must not duplicate existing functionality without benefit
5. **Documentation**: Must have adequate documentation

#### Priority Scoring System
- **High Priority (8-10)**: Essential daily-use tools, modern replacements, security-critical
- **Medium Priority (5-7)**: Specialized but useful, alternative implementations
- **Low Priority (1-4)**: Niche use cases, experimental tools

### Tool Expansion Roadmap

#### Next Wave - High Priority
**Media & Graphics Processing**
- youtube-dl/yt-dlp - Video downloading
- ghostscript/gs - PostScript/PDF processing
- qrencode - QR code generation

**Database & Data Analysis**
- mongodb/mongo - MongoDB shell
- influxdb/influx - Time-series database
- q - SQL on CSV files
- sqlite-utils - Enhanced SQLite utilities

**Performance & System Analysis**
- btop - Modern resource monitor
- valgrind - Memory debugging
- tcpdump - Network packet analyzer
- wireshark/tshark - Protocol analyzer

**Cloud & Container Orchestration**
- kubectl - Kubernetes management
- helm - Kubernetes packages
- k9s - Kubernetes CLI dashboard
- gcloud - Google Cloud CLI
- azure-cli - Microsoft Azure CLI

**Backup & Synchronization**
- borgbackup - Deduplicating backup
- restic - Fast, secure backup
- rclone - Cloud storage sync
- duplicity - Encrypted backup

#### Installation Procedures
```bash
# High-priority media tools
brew install youtube-dl ghostscript qrencode

# Database tools
brew install mongodb influxdb

# System monitoring
brew install btop tcpdump wireshark

# Cloud tools
brew install kubectl helm k9s gcloud azure-cli

# Backup tools
brew install borgbackup restic rclone
```

### Tool Deprecation Process

#### Deprecation Criteria
1. Tool no longer maintained (2+ years)
2. Replaced by superior alternative
3. Security vulnerabilities without fixes
4. No longer compatible with current macOS
5. Functionality merged into another tool

#### Deprecation Workflow
1. Mark tool with deprecation warning
2. Add recommended alternative
3. Keep for 1 quarter with warning
4. Move to archived section
5. Remove after 2 quarters
6. Update all statistics and cross-references

---

## 👥 Community & Contribution Guidelines

### Contribution Standards

#### Adding New Tools
1. Verify tool not already documented
2. Test on current macOS versions
3. Follow documentation format exactly
4. Include difficulty rating
5. Add safety warnings for destructive operations
6. Test all provided examples
7. Update README.md tool index and statistics

#### Quality Requirements
- Maintain consistent formatting
- Provide practical, tested examples
- Include modern alternatives
- Add relevant cross-references
- Document macOS-specific variations
- Verify on target system before submission

### Contribution Process
1. Fork repository and create feature branch
2. Add new tool following quality standards
3. Run validation suite: `./scripts/run_validation_suite.sh`
4. Update documentation statistics
5. Submit pull request with clear description
6. Address review feedback promptly

### Feedback Integration
- **Response Time**: Acknowledge within 48 hours
- **Verification**: Test reported issues
- **Prioritization**: By impact and user value
- **Implementation**: Fix and credit contributors

---

## 🤖 Automation & Scripts

### Core Automation Scripts

#### verify_tools.sh
```bash
# Basic verification
./scripts/verify_tools.sh

# Detailed report
./scripts/verify_tools.sh --detailed

# Check specific category
./scripts/verify_tools.sh --category "Network Tools"
```

#### update_stats.sh
```bash
# Update all statistics (new default requires --fix or --update-all)
./scripts/update_stats.sh --fix
# Or use --update-all for comprehensive updates
./scripts/update_stats.sh --update-all

# Generate index
./scripts/update_stats.sh --generate-index

# Verify statistics (replaces --check-consistency)
./scripts/update_stats.sh --verify-stats

# Comprehensive validation
./scripts/update_stats.sh --validate-stats

# Legacy mode (for backward compatibility)
./scripts/update_stats.sh --legacy-default
# Or set environment variable: UPDATE_STATS_LEGACY_DEFAULT=1
```

#### run_validation_suite.sh
```bash
# Full validation
./scripts/run_validation_suite.sh

# With fix suggestions
./scripts/run_validation_suite.sh --fix-suggestions
```

#### check_plan_completion.sh
```bash
# Check implementation progress
./scripts/check_plan_completion.sh

# Verbose output with details
./scripts/check_plan_completion.sh --verbose

# Summary only
./scripts/check_plan_completion.sh --summary
```

### Pre-commit Hooks
```bash
# Run comprehensive validation
./scripts/run_validation_suite.sh --summary

# Format checking
./scripts/update_stats.sh --check-format

# Link validation
./scripts/update_stats.sh --check-links
```

---

## 📊 Success Metrics & Reporting

### Key Performance Indicators

#### Quantitative Goals
- [ ] **100% tool verification**: All <!-- tools-count -->327<!-- /tools-count --> tools tested and confirmed
- [ ] **Zero broken links**: All references validated
- [ ] **Format consistency**: 100% adherence to standards
- [ ] **Metadata completeness**: Every tool has required metadata
- [ ] **Test coverage**: All examples executable

#### Qualitative Goals
- [ ] **Improved discoverability**: Users find tools quickly
- [ ] **Better LLM context**: Structured data improves AI responses
- [ ] **Maintenance efficiency**: Automated processes reduce manual work
- [ ] **User experience**: Clear navigation and organization
- [ ] **Future scalability**: Easy to add new tools

### Monthly Reporting Template
```markdown
## Monthly Maintenance Report - [Month Year]

### Statistics
- Total Tools: XXX
- New Additions: X
- Deprecations: X
- Updates: X

### Changes
- [List of significant changes]

### Issues Resolved
- [List of resolved issues]

### Upcoming Work
- [Planned improvements]
```

### Annual Metrics Review
- Comprehensive statistics analysis
- Growth metrics evaluation
- User feedback summary
- Major improvements documentation
- Future roadmap planning

---

## 🔧 Troubleshooting & Resources

### Common Issues & Solutions

#### Statistics Inconsistency
```bash
# Check for mismatch
./scripts/update_stats.sh --verify-stats

# Fix statistics markers
./scripts/update_stats.sh --fix README.md
# Or use --update for specific file updates
./scripts/update_stats.sh --update README.md

# Verify manually
echo "Tool count:" && grep -c "^### \*\*.*\*\*" TOOLS.md
```

#### Broken Cross-References
```bash
# Find broken internal links
grep -r "\[.*\](\./.*\.md)" . --include="*.md" | while read line; do
  file=$(echo "$line" | cut -d: -f1)
  link=$(echo "$line" | sed 's/.*](\.\/\(.*\.md\)).*/\1/')
  if [ ! -f "$link" ]; then
    echo "Broken link in $file: $link"
  fi
done
```

#### Tool Not Found
```bash
# Check installation
which tool_name || echo "Not found"

# Check PATH
echo $PATH

# Find tool location
find / -name tool_name 2>/dev/null
```

### Useful Commands
```bash
# Find all executables
find /usr/bin /usr/local/bin /opt/homebrew/bin -type f -perm +111

# Check man page availability
apropos . | wc -l

# List Homebrew packages
brew list

# Check for updates
brew outdated
```

### Official Resources
- **Man pages**: Primary source of truth
- **Tool websites**: Latest features and updates
- **Package managers**: Installation and versions
- **Community forums**: Usage patterns and issues

---

## 🎉 Expected Outcomes

### Immediate Benefits
- **Cleaner repository structure** - easier navigation and maintenance
- **Reduced duplication** - single source of truth for information
- **Better organization** - logical grouping and consistent naming
- **Improved automation** - less manual maintenance work required

### Long-term Benefits
- **Enhanced LLM context** - structured data improves AI assistance quality
- **Scalable maintenance** - easier to add new tools and maintain quality
- **Better user experience** - faster tool discovery and clearer guidance
- **Community ready** - structure supports external contributions
- **Future-proof foundation** - prepared for growth and evolution

### Success Indicators
- Repository passes all automated quality checks
- New users can find needed tools within 30 seconds
- LLM responses become more accurate and helpful
- Maintenance overhead reduces to <2 hours per month
- Community contributions increase

---

## 📋 Implementation Timeline Summary

### Week 1: Immediate Cleanup ✅
- Remove duplicate files
- Consolidate documentation
- Update references
- Streamline README.md
- Archive old planning docs

### Week 2: Structure Optimization
- Add metadata headers
- Implement tagging system
- Create tool decision trees
- Enhance validation scripts
- Run comprehensive audit

### Week 3: Quality Enhancement
- Complete accuracy updates
- Validate cross-references
- Test all examples
- Generate performance matrices
- Create maintenance schedule

### Week 4: Documentation Polish
- Final consistency check
- Update all statistics
- Regenerate indexes
- Create feedback system
- Establish ongoing procedures

---

## 🚀 Conclusion

This MASTER_PLAN.md serves as the single, comprehensive source of truth for all repository planning, maintenance, and development activities. It consolidates the strategic vision from TRACER_PLAN, operational tasks from TODO, detailed procedures from MAINTENANCE, and expansion roadmap from FUTURE_TOOLS into one unified guide.

The plan ensures the CLI Tools Documentation repository continues to serve as the definitive macOS CLI tools reference while becoming easier to maintain and more effective for both human users and AI assistance.

**Total estimated effort**: Major cleanup completed (October 2025), now in ongoing maintenance mode

**Status**: ✅ **CLEANUP COMPLETED - FOCUSED DOCUMENTATION**

**Branch Status**: cleanup/remove-duplicates-and-fix-metadata ready for merge (13 commits, 108 files changed)

---

*Last updated: 2025-10-07 - Major cleanup completed, 267 tools across 19 categories verified*
*Branch: cleanup/remove-duplicates-and-fix-metadata (ready for merge)*
*This document supersedes: TRACER_PLAN.md, TODO.md, MAINTENANCE.md, FUTURE_TOOLS.md*
