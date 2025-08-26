# Repository Maintenance Guide

*Quick reference for maintaining the CLI Tools Documentation repository*

## Overview

This guide provides essential maintenance procedures for keeping the CLI Tools Documentation repository current, accurate, and valuable. For comprehensive maintenance procedures, see [archive/MAINTENANCE.md](../archive/MAINTENANCE.md).

## Quick Reference

### Daily Tasks (As Needed)
- Monitor repository issues and user feedback
- Quick fixes for documentation errors
- Statistics consistency spot checks

### Weekly Tasks

```bash
# Verify statistics consistency
./scripts/update_stats.sh --verify-stats

# Validate cross-references
./scripts/run_validation_suite.sh --validate-links

# Quick tool availability check
./scripts/verify_tools.sh --quick
```

### Monthly Tasks

```bash
# Run comprehensive validation suite
./scripts/run_validation_suite.sh --detailed

# Regenerate tool index
./scripts/update_stats.sh --generate-index

# Full statistics and cross-reference audit
./scripts/run_validation_suite.sh --validate-stats
```

## Key Quality Standards

### Statistics Consistency
- Tool counts, category counts, and line counts must be synchronized across all files
- Use statistics markers: `<!-- tools-count -->347+<!-- /tools-count -->`
- Validate with: `./scripts/update_stats.sh --verify-stats`

### Cross-Reference Integrity
- All internal links must be validated before commits
- File references must point to existing files
- Use: `./scripts/run_validation_suite.sh --validate-links`

### Documentation Standards
- Follow format templates from [DOCUMENTATION_STANDARDS.md](./DOCUMENTATION_STANDARDS.md)
- Include complete metadata blocks for all tools
- Test all examples on target macOS system
- Include safety warnings for destructive operations

## Essential Validation Commands

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

## Contributing Guidelines

### Before Making Changes
1. Read [DOCUMENTATION_STANDARDS.md](./DOCUMENTATION_STANDARDS.md)
2. Understand current statistics and structure
3. Plan changes to minimize cross-reference impact

### Adding New Tools
1. Follow the standard tool template format
2. Include complete metadata block
3. Test all examples on macOS
4. Update statistics markers
5. Add cross-references to related tools
6. Run validation suite

### Tool Documentation Template

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
- Primary use case
- Secondary use case

**Examples**:
```bash
# Basic usage
tool-name basic-args

# Advanced usage
tool-name --advanced-flag input
```

**Safety**: Any warnings
**Modern Alternative**: modern-tool-name
**Related**: See also tool-x, tool-y

```bash

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

- **Comprehensive Guide**: [archive/MAINTENANCE.md](../archive/MAINTENANCE.md)
- **Documentation Standards**: [DOCUMENTATION_STANDARDS.md](./DOCUMENTATION_STANDARDS.md)  
- **Master Plan**: [MASTER_PLAN.md](../MASTER_PLAN.md)
- **Tool Index**: [TOOL_INDEX.md](./TOOL_INDEX.md)
- **Claude Integration**: [CLAUDE_GUIDE.md](./CLAUDE_GUIDE.md)

## Automation Scripts

All maintenance operations can be automated using the scripts in the `scripts/` directory:

- `run_validation_suite.sh` - Comprehensive validation orchestration
- `update_stats.sh` - Statistics management and consistency
- `verify_tools.sh` - Tool availability and testing
- `check_plan_completion.sh` - Project status tracking

---

*For detailed maintenance procedures, troubleshooting, and advanced operations, refer to [archive/MAINTENANCE.md](../archive/MAINTENANCE.md)*

*Last updated: 2025-08-26*
