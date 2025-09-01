# Documentation Standards & Maintenance Guide

*Comprehensive documentation standards and maintenance procedures for the CLI Tools Reference Documentation repository.*

## Overview

This guide establishes definitive standards for creating, maintaining, and validating documentation within the CLI Tools Reference Documentation repository. It ensures consistency, accuracy, and maintainability across all documentation files while serving both human users and LLM integration effectively.

## Table of Contents

1. [File Organization Standards](#file-organization-standards)
2. [Content Standards](#content-standards)
3. [Statistics and Reference Standards](#statistics-and-reference-standards)
4. [Quality Assurance Standards](#quality-assurance-standards)
5. [Maintenance Procedures](#maintenance-procedures)
6. [Integration Standards](#integration-standards)
7. [Troubleshooting](#troubleshooting)

---

## File Organization Standards

### Primary File Structure

The repository follows a strict hierarchical organization with clear separation of concerns:

```
/
├── README.md                    # Project overview and quick start
├── TOOLS.md                     # Comprehensive CLI tools reference
├── TODO.md                      # Project roadmap and status
├── LICENSE                      # Legal information
├── CLAUDE.md                    # LLM integration guide
├── docs/                        # Specialized documentation
│   ├── CHEATSHEET.md           # Quick reference guide
│   ├── DOCUMENTATION.md        # This standards & maintenance guide
│   ├── PROJECT_STATUS.md       # Project status reports
│   └── SYSTEM_ADMINISTRATION_TOOLS.md # System admin reference
├── scripts/                     # Automation and validation scripts
└── node_tools/                  # Node.js validation toolkit
```

### Content Distribution Rules

#### README.md Content Guidelines
**Include in README.md:**
- Project overview and achievements
- Quick start instructions
- Essential statistics and metrics
- Basic tool discovery methods
- Category summaries with links to detailed documentation
- Brief usage examples
- Contributing guidelines

**Exclude from README.md:**
- Detailed tool documentation (belongs in TOOLS.md)
- Comprehensive maintenance procedures (belongs in this document)
- Extended integration guides (belongs in CLAUDE.md)
- Detailed project status (belongs in PROJECT_STATUS.md)

#### Specialized Documentation Guidelines

| File | Purpose | Content Type |
|------|---------|--------------|
| **TOOLS.md** | Authoritative tool reference | Complete tool documentation with consistent format |
| **CLAUDE.md** | LLM integration | Complete integration instructions |
| **docs/DOCUMENTATION.md** | Standards & maintenance | Documentation standards and maintenance procedures |
| **docs/PROJECT_STATUS.md** | Project status | Implementation progress and verification reports |
| **docs/CHEATSHEET.md** | Quick reference | Condensed common operations |
| **docs/SYSTEM_ADMINISTRATION_TOOLS.md** | Specialized reference | System admin tool collection |

### File Naming Conventions

- **Primary files**: ALL_CAPS.md (README.md, TOOLS.md, TODO.md, CLAUDE.md)
- **Documentation files**: TITLE_CASE.md (DOCUMENTATION.md, PROJECT_STATUS.md)
- **Script files**: lowercase_with_underscores.sh
- **Directory names**: lowercase (docs, scripts, node_tools)

---

## Content Standards

### Formatting Consistency

#### Universal Formatting Rules

1. **Headers**: Use consistent hierarchy
   ```markdown
   # Primary Title (Repository/File level)
   ## Major Sections
   ### Subsections
   #### Detail Sections
   ```

2. **Code Blocks**: Always specify language
   ```markdown
   ```bash
   command --option argument
   ```
   ```

3. **Tool Names**: Format consistently
   ```markdown
   ### **tool-name** - Brief Description
   ```

4. **Links**: Use descriptive text, absolute paths for files
   ```markdown
   [Tool Index](./TOOL_INDEX.md)
   [View Details](./TOOL_INDEX.md#category-name)
   ```

### Tool Documentation Format

**Standard Tool Entry Template:**
```markdown
### **tool-name** - Brief Description
<!-- meta
category: Category Name
difficulty: ⭐⭐⭐ Intermediate
aliases: alias1, alias2
tags: #tag1 #tag2 #tag3
related: tool1, tool2, tool3
keywords: keyword1, keyword2, keyword3
synonyms: synonym1, synonym2
-->
**Description**: Detailed description from man page
**Location**: `/absolute/path/to/executable`
**Difficulty**: ⭐⭐⭐
**Common Use Cases**:
- Primary use case for development work
- Secondary use case for system administration

**Examples**:
```bash
# Basic usage example
tool-name basic-args

# Advanced usage example
tool-name --advanced-flag input
```

**Safety**: Any warnings about destructive operations
**Modern Alternative**: modern-tool-name
**Related**: See also tool-x, tool-y
```

### Difficulty Rating Standards

| Rating | Level | Description | User Profile |
|--------|--------|-------------|--------------|
| ⭐⭐ | Beginner | Basic usage, minimal options, safe operations | New CLI users |
| ⭐⭐⭐ | Intermediate | Common options, moderate complexity | Regular CLI users |
| ⭐⭐⭐⭐ | Advanced | Complex features, scripting, some risk | Experienced users |
| ⭐⭐⭐⭐⭐ | Expert | Deep knowledge required, system-level | Power users/admins |

---

## Statistics and Reference Standards

### Statistics Markers System

All files containing tool counts, category counts, or line counts must use standardized markers:

```html
<!-- tools-count -->327<!-- /tools-count -->
<!-- categories-count -->35<!-- /categories-count -->
<!-- lines-count -->16852<!-- /lines-count -->
```

### Statistics Consistency Rules

1. **Primary Source**: TOOLS.md is authoritative for all counts
2. **Automatic Updates**: Use update_stats.sh to maintain consistency
3. **Validation Required**: All statistics must be verified before commits
4. **Multiple File Sync**: Statistics must match across all files that reference them

### Cross-Reference Integrity Standards

1. **File References**: All relative file paths must exist
2. **Section Anchors**: All section links must point to existing headers
3. **Tool References**: All tool cross-references must exist in TOOLS.md
4. **Bidirectional Consistency**: Related tools must reference each other

### Required Metadata Fields

Every tool in TOOLS.md must include a complete metadata block:

| Field | Format | Requirements |
|-------|--------|--------------|
| category | String | Must match actual category header |
| difficulty | Stars + Level | Use standard rating scale |
| aliases | Comma-separated | Alternative command names |
| tags | Space-separated hashtags | Categorization labels |
| related | Comma-separated | Tools with related functionality |
| keywords | Space-separated | Search terms |
| synonyms | Comma-separated | Alternative terminology |

---

## Quality Assurance Standards

### Pre-Commit Validation

Before any commit, the following checks must pass:

1. **Statistics Consistency**
   ```bash
   ./scripts/update_stats.sh --verify-stats
   ```

2. **Cross-Reference Integrity**
   ```bash
   ./scripts/run_validation_suite.sh --validate-links
   ```

3. **Format Consistency**
   ```bash
   ./scripts/update_stats.sh --check-format
   ```

4. **Metadata Validation**
   ```bash
   ./scripts/update_stats.sh --check-metadata
   ```

### Validation Error Categories

| Category | Severity | Action Required |
|----------|----------|-----------------|
| **Critical** | Must fix | Statistics mismatch, broken structure |
| **High** | Fix before merge | Broken links, missing metadata |
| **Medium** | Fix within week | Format inconsistencies, minor errors |
| **Low** | Fix when convenient | Optimization opportunities |

### Documentation Testing Standards

1. **Syntax Testing**: All code examples must be syntactically correct
2. **Execution Testing**: Examples should be tested on target system
3. **Output Verification**: Expected output should match actual results
4. **Error Handling**: Examples should handle common error conditions

---

## Maintenance Procedures

### Quick Reference

#### Daily Tasks (As Needed)
- Monitor repository issues and user feedback
- Quick fixes for documentation errors
- Statistics consistency spot checks

#### Weekly Tasks
```bash
# Verify statistics consistency
./scripts/update_stats.sh --verify-stats

# Validate cross-references
./scripts/run_validation_suite.sh --validate-links

# Quick tool availability check
./scripts/verify_tools.sh --quick
```

#### Monthly Tasks
```bash
# Run comprehensive validation suite
./scripts/run_validation_suite.sh --detailed

# Regenerate tool index
./scripts/update_stats.sh --generate-index

# Full statistics and cross-reference audit
./scripts/run_validation_suite.sh --validate-stats
```

#### Quarterly Tasks
- Full tool audit
- Documentation quality review
- Category reorganization assessment
- Performance benchmark updates

### Essential Validation Commands

```bash
# Complete validation suite
./scripts/run_validation_suite.sh --detailed

# Statistics validation
./scripts/update_stats.sh --verify-stats

# Cross-reference validation  
./scripts/run_validation_suite.sh --validate-links

# Format and metadata validation
./scripts/update_stats.sh --check-format --check-metadata

# Tool availability verification
./scripts/verify_tools.sh --detailed
```

### Contributing Guidelines

#### Before Making Changes
1. Read this documentation standards guide
2. Understand current statistics and structure
3. Plan changes to minimize cross-reference impact

#### Adding New Tools
1. Follow the standard tool template format
2. Include complete metadata block
3. Test all examples on macOS
4. Update statistics markers
5. Add cross-references to related tools
6. Run validation suite

### Change Management Standards

#### Documentation Change Process
1. **Impact Assessment**: Evaluate changes for statistics and cross-reference impact
2. **Consistency Check**: Ensure changes don't break existing patterns
3. **Validation Testing**: Run full validation suite
4. **Update Propagation**: Update all affected files and references

#### Statistics Update Workflow
When making changes that affect counts:
1. **Before Changes**: Note current statistics
2. **Make Changes**: Implement documentation updates
3. **Update Statistics**: Run statistics update scripts
4. **Validate Consistency**: Ensure all files reflect new counts
5. **Cross-Reference Update**: Update any affected links or references

### Version Control Standards

#### Commit Message Standards
```
type(scope): brief description

Longer description explaining the change and its impact.
Statistics updated: tools +2, categories +0, lines +143
Cross-references updated: tool_index.md, related tools

- Change detail 1
- Change detail 2
```

#### Commit Types
- `feat`: New tool or major feature additions
- `fix`: Bug fixes or corrections
- `docs`: Documentation improvements
- `style`: Formatting changes
- `refactor`: Restructuring without functional changes
- `stats`: Statistics updates and consistency fixes
- `validate`: Validation improvements and fixes

---

## Integration Standards

### LLM Integration Requirements

Documentation must support effective LLM integration:
1. **Structured Metadata**: Machine-readable metadata for all tools
2. **Consistent Patterns**: Predictable structure for parsing
3. **Complete Context**: Self-contained information in tool entries
4. **Safety Information**: Clear warnings for dangerous operations

### CI/CD Integration Standards

Required CI/CD checks:
1. **Documentation Build**: Verify all files parse correctly
2. **Link Validation**: Ensure all internal links work
3. **Statistics Consistency**: Verify counts match across files
4. **Metadata Validation**: Check all metadata is complete and valid
5. **Tool Availability**: Basic availability checks

### Script Behavior Changes & Backward Compatibility

#### update_stats.sh Default Behavior
**Important**: The default behavior of `update_stats.sh` has changed. Previously, running with no arguments would perform `--update-all`. Now it shows a report without making changes.

**Migration Options:**

Option 1: Use new explicit flags
```bash
# Old way (deprecated)
./scripts/update_stats.sh

# New way (explicit)
./scripts/update_stats.sh --fix
```

Option 2: Use legacy mode
```bash
# Environment variable (permanent)
export UPDATE_STATS_LEGACY_DEFAULT=true

# Command line flag (per-run)
./scripts/update_stats.sh --legacy-default
```

#### CI Mode
The validation suite automatically detects CI environments and applies stricter validation:
```bash
# Automatic CI detection
CI=true ./scripts/run_validation_suite.sh

# Manual CI mode
./scripts/run_validation_suite.sh --ci
```

### JSON Schema Documentation

The scripts provide JSON output for machine-readable integration. The JSON schema is versioned to ensure backward compatibility.

**Schema Version 1.0:**
```json
{
  "schemaVersion": "1.0",
  "timestamp": "2025-09-01T12:34:56Z",
  "status": "success|warning|failed",
  "statistics": {
    "total_tools": 327,
    "total_categories": 35
  },
  "validation": {
    "total_issues": 0,
    "consistency_issues": 0,
    "cross_ref_issues": 0
  },
  "issues": {
    "consistency": [],
    "format": [],
    "broken_links": []
  }
}
```

---

## Troubleshooting

### Statistics Mismatch
```bash
# Check current statistics
echo "Tool count:" && grep -c "^### \*\*.*\*\*" TOOLS.md
echo "Category count:" && grep -c "^## " TOOLS.md  
echo "Line count:" && wc -l < TOOLS.md

# Fix statistics in README.md
./scripts/update_stats.sh --update README.md
```

### Broken Links
```bash
# Find broken internal links
grep -r "\[.*\](\./.*\.md)" . --include="*.md" | while read line; do
    file=$(echo "$line" | cut -d: -f1)
    link=$(echo "$line" | sed 's/.*](\.\/\(.*\.md\)).*/\1/')
    [ -f "$link" ] || echo "Broken link in $file: $link"
done
```

### Missing Referenced Files
```bash
# Validate all file references in README.md
grep -o "\[.*\](\./[^)]*\.md)" README.md | while read link; do
    file=$(echo "$link" | sed 's/.*](\.\/\([^)]*\))/\1/')
    [ -f "$file" ] || echo "Missing referenced file: $file"
done
```

## Resources

- **Project Status**: [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Master Plan**: [MASTER_PLAN.md](../MASTER_PLAN.md)
- **Tool Index**: Integrated in [README.md](../README.md#quick-tool-discovery)
- **LLM Integration**: [CLAUDE.md](../CLAUDE.md)

## Compliance and Enforcement

### Error Handling Standards

1. **Critical Errors**: Block commits until resolved
2. **Warning Errors**: Allow commits with documentation
3. **Info Errors**: Log for future resolution
4. **Format Errors**: Auto-fix when possible

### Quality Gates

Before any documentation is considered complete:
- ✅ All statistics markers are consistent
- ✅ All cross-references are valid
- ✅ All examples are tested and working
- ✅ All metadata is complete and accurate
- ✅ All safety warnings are included
- ✅ Format follows established standards

## Key Principles

1. **Consistency Above All**: Every piece of documentation should follow identical patterns
2. **Accuracy First**: Never document untested or unverified information
3. **User-Centric**: Design for both human readability and machine parsing
4. **Maintainable**: Structure for long-term sustainability and updates
5. **Comprehensive**: Cover all aspects without duplication
6. **Validated**: Every element must be automatically verifiable

---

*This guide serves as the authoritative reference for all documentation standards and maintenance procedures within the CLI Tools Reference Documentation repository. All contributors and maintainers must adhere to these standards to ensure continued quality and consistency.*

*Last updated: 2025-09-01*
