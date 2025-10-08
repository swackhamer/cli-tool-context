# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is a comprehensive CLI tools documentation project that has created the most complete CLI tools reference available for macOS systems. The repository contains documentation for 327 essential CLI tools across 40 categories in comprehensive, well-structured content.

The primary deliverable is **TOOLS.md** - a meticulously formatted reference containing documentation for CLI tools essential to development, system administration, and DevOps workflows.

**Last updated**: October 5, 2025

## Key Files and Structure

```
cli-tool-context/
├── TOOLS.md                 # Main deliverable: 327 CLI tools reference
├── README.md                # Main documentation with integrated tool index
├── README.md                # Project overview and quick start guide
├── archive/
│   ├── TODO.md              # Legacy roadmap and maintenance tasks
│   └── TRAYCER_PLAN.md      # Repository improvement plan
├── docs/
│   ├── CHEATSHEET.md        # Quick reference guide for common CLI operations
│   ├── CLAUDE_GUIDE.md      # Claude Code integration guide
│   ├── MAINTENANCE.md       # Maintenance procedures and schedules
│   └── SYSTEM_ADMINISTRATION_TOOLS.md  # Specialized system admin reference
├── node_tools/              # Node.js/TypeScript infrastructure
│   ├── src/                 # TypeScript source files
│   ├── dist/                # Compiled JavaScript output
│   ├── package.json         # Node.js dependencies and scripts
│   └── tsconfig.json        # TypeScript configuration
├── site/                    # Static website interface
│   ├── index.html           # Homepage with statistics
│   ├── tools.html           # Main tool browser
│   ├── data/                # JSON data files
│   ├── js/                  # JavaScript application logic
│   └── styles/              # CSS stylesheets
└── scripts/
    ├── verify_tools.sh      # Verify tool installation status
    ├── update_stats.sh      # Update statistics and check consistency
    ├── check_plan_completion.sh  # Verify plan completion
    └── run_validation_suite.sh   # Comprehensive validation

```

## Common Development Commands

### Repository Maintenance

```bash
# Run comprehensive validation of documentation
./scripts/run_validation_suite.sh

# Check for formatting and consistency issues
./scripts/update_stats.sh --check-consistency

# Verify which tools are installed on system
./scripts/verify_tools.sh --detailed

# Update repository statistics in README
./scripts/update_stats.sh

# Generate tool index
./scripts/update_stats.sh --generate-index

# Check for broken internal links
./scripts/update_stats.sh --check-links

# Validate metadata headers in TOOLS.md
./scripts/update_stats.sh --check-metadata
```

### Node.js Development Commands

```bash
# Navigate to Node.js infrastructure
cd node_tools/

# Install dependencies
npm install

# Build TypeScript projects
npm run build

# Run tests
npm test

# Development with watch mode
npm run dev

# Generate website data files
npm run generate-site-data
```

### Tool Documentation Workflow

```bash
# Search for specific tools in documentation
grep -n "tool-name" TOOLS.md

# Find tools by category
grep -n "## Category Name" TOOLS.md

# Check tool difficulty ratings
grep "⭐⭐⭐⭐⭐" TOOLS.md  # Expert level tools

# Quick reference lookup
cat docs/CHEATSHEET.md | grep "git"  # Git commands quick reference
```

### Quality Assurance

```bash
# Full validation with fix suggestions
./scripts/run_validation_suite.sh --fix-suggestions

# Check specific file consistency
./scripts/update_stats.sh --update README.md

# Verify tool examples work
./scripts/verify_tools.sh --all --category "Development Tools"

# Generate CSV report of tool statistics
./scripts/update_stats.sh --full-report
```

## Code Architecture

### Documentation Format Standards

Each tool in TOOLS.md follows this exact structure:

```markdown
### **tool-name** - Brief Description
**Description**: Detailed description from man page
**Location**: `/absolute/path/to/executable`
**Common Use Cases**:
- Primary use case for development work
- Secondary use case for system administration

**Examples**:
[Practical usage examples with common patterns]
```

### Metadata System

Tools include structured metadata for enhanced discoverability:

```markdown
<!-- meta
category: File Operations
difficulty: ⭐⭐⭐
aliases: alternative-name
tags: #essential #file-management
related: similar-tool1, similar-tool2
keywords: search find locate
synonyms: alt-name, abbreviation
-->
```

### Tool Categories (40)

Major categories include:
- **File & Directory Operations** - Core filesystem tools
- **Text Processing & Manipulation** - Text analysis and transformation
- **Version Control** - Git and related tools
- **Development Tools** - Compilers, build systems, debuggers
- **Package Managers** - Language-specific and system package managers
- **Network Tools** - Connectivity, DNS, transfer utilities
- **Security Tools** - Encryption, authentication, checksums
- **System Administration** - Process management, monitoring
- **Archive & Compression** - File archiving and compression
- **Data Processing** - JSON, CSV, database tools
- **Container & Cloud Tools** - Docker, Kubernetes, cloud CLIs

### Difficulty Rating System

- ⭐⭐ = Beginner - Simple, safe commands
- ⭐⭐⭐ = Intermediate - More options, some risk
- ⭐⭐⭐⭐ = Advanced - Complex operations
- ⭐⭐⭐⭐⭐ = Expert - Requires deep knowledge

## Important Conventions

### Modern Tool Alternatives

The documentation includes both traditional and modern alternatives:
- `ls` → `eza` (better formatting, icons)
- `grep` → `rg` (ripgrep, 5-10x faster)
- `find` → `fd` (respects .gitignore, simpler syntax)
- `cat` → `bat` (syntax highlighting)
- `du` → `dust` (visual tree)
- `ps` → `procs` (colored, formatted)
- `sed` → `sd` (intuitive syntax)

### Safety Warnings

Destructive operations are clearly marked with warnings. Always note safety concerns when documenting risky commands (e.g., `rm -rf`, `dd`, system modifications).

### Platform Awareness

Documentation focuses on macOS but notes cross-platform variations. BSD vs GNU tool differences are documented where relevant.

## Script Utilities

### verify_tools.sh
- Checks which documented tools are installed
- Supports JSON output for automation
- Can filter by category
- Suggests installation commands for missing tools

### update_stats.sh
- Updates tool counts and statistics
- Validates internal links
- Checks format consistency
- Generates comprehensive tool index
- Validates metadata headers

### run_validation_suite.sh
- Comprehensive quality assurance
- Checks all aspects of documentation
- Provides fix suggestions
- Generates summary reports

## Quality Standards

When modifying documentation:

1. **Maintain Format Consistency** - Every tool must follow the exact same structure
2. **Test Examples** - All command examples must be tested on macOS
3. **Include Difficulty Ratings** - Every tool needs a star rating
4. **Add Safety Warnings** - Mark destructive operations clearly
5. **Document Alternatives** - Include modern tool alternatives where applicable
6. **Verify Tool Paths** - Use actual paths from macOS systems
7. **Update Statistics** - Run update_stats.sh after changes

## Common Maintenance Tasks

### Adding a New Tool

1. Find appropriate category in TOOLS.md
2. Follow exact format of existing tools
3. Include metadata header
4. Test all examples
5. Run validation: `./scripts/run_validation_suite.sh`
6. Update statistics: `./scripts/update_stats.sh`
7. Regenerate index: `./scripts/update_stats.sh --generate-index`

### Updating Tool Documentation

1. Locate tool in TOOLS.md
2. Update description/examples
3. Verify changes with: `./scripts/update_stats.sh --check-format`
4. Test updated examples
5. Check links: `./scripts/update_stats.sh --check-links`

### Ongoing Maintenance

1. Monthly: Run full validation suite
2. Check for new system tools: `./scripts/verify_tools.sh`
3. Update version information
4. Review security advisories
5. Update deprecated options

## Project Status

✅ **COMPLETE**: Core documentation with 327 tools
- Phase 1-8 completed with comprehensive coverage
- Enhanced with navigation, performance guides, and resources
- Modern alternatives integrated throughout
- Ready-to-use scripts and automation included

🔄 **ONGOING**: Quality assurance and maintenance
- Regular validation and updates
- Tool verification on current macOS versions
- Documentation consistency improvements

## Tips for Development

1. **Use ripgrep for fast searches**: `rg "pattern" TOOLS.md`
2. **Quick tool lookup**: Use README.md for alphabetical/category views and comprehensive index
3. **Check installation**: Run `./scripts/verify_tools.sh` before documenting
4. **Validate changes**: Always run validation suite before committing
5. **Reference cheatsheet**: ./docs/CHEATSHEET.md has quick command templates

## Support Resources

- **Quick Reference**: ./docs/CHEATSHEET.md - Common commands
- **Tool Index**: ./README.md - Browse all tools with integrated index
- **Claude Guide**: ./docs/CLAUDE_GUIDE.md - AI integration patterns
- **Maintenance Guide**: ./docs/MAINTENANCE.md - Update procedures
- **Archive Resources**: ./archive/ - Historical documentation and plans
