# Documentation Standards Guide

*Comprehensive documentation standards for maintaining consistency, quality, and accuracy across all repository documentation.*

## Overview

This guide establishes definitive standards for creating, maintaining, and validating documentation within the CLI Tools Reference Documentation repository. These standards ensure consistency, accuracy, and maintainability across all documentation files while serving both human users and LLM integration effectively.

## Table of Contents

1. [File Organization Standards](#file-organization-standards)
2. [Content Standards](#content-standards)
3. [Statistics and Reference Standards](#statistics-and-reference-standards)
4. [Quality Assurance Standards](#quality-assurance-standards)
5. [Maintenance Standards](#maintenance-standards)
6. [Integration Standards](#integration-standards)

---

## File Organization Standards

### 1.1 Primary File Structure

The repository follows a strict hierarchical organization with clear separation of concerns:

```
/
├── README.md                    # Project overview and quick start
├── TOOLS.md                     # Comprehensive CLI tools reference
├── TODO.md                      # Project roadmap and status
├── LICENSE                      # Legal information
├── docs/                        # Specialized documentation
│   ├── CHEATSHEET.md           # Quick reference guide
│   ├── CLAUDE_GUIDE.md         # LLM integration guide
│   ├── DOCUMENTATION_STANDARDS.md # This standards guide
│   ├── FUTURE_TOOLS.md         # Future recommendations
│   ├── MAINTENANCE.md          # Maintenance procedures
│   ├── SYSTEM_ADMINISTRATION_TOOLS.md # System admin reference
│   └── TOOL_INDEX.md           # Comprehensive tool index
├── scripts/                     # Automation and validation scripts
└── node_tools/                  # Node.js validation toolkit
```

### 1.2 Content Distribution Rules

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
- Comprehensive maintenance procedures (belongs in MAINTENANCE.md)
- Extended integration guides (belongs in CLAUDE_GUIDE.md)
- Detailed indexes (belongs in TOOL_INDEX.md)

#### Specialized Documentation Guidelines

| File | Purpose | Content Type |
|------|---------|--------------|
| **TOOLS.md** | Authoritative tool reference | Complete tool documentation with consistent format |
| **docs/TOOL_INDEX.md** | Tool discovery | Searchable indexes with multiple views |
| **docs/CHEATSHEET.md** | Quick reference | Condensed common operations |
| **docs/CLAUDE_GUIDE.md** | LLM integration | Complete integration instructions |
| **docs/MAINTENANCE.md** | Repository maintenance | Procedures, schedules, and validation |
| **docs/SYSTEM_ADMINISTRATION_TOOLS.md** | Specialized reference | System admin tool collection |
| **docs/FUTURE_TOOLS.md** | Recommendations | Future additions and suggestions |

### 1.3 File Naming Conventions

#### Standard Naming Patterns
- **Primary files**: ALL_CAPS.md (README.md, TOOLS.md, TODO.md)
- **Documentation files**: TITLE_CASE.md (CLAUDE_GUIDE.md, MAINTENANCE.md)
- **Script files**: lowercase_with_underscores.sh
- **Directory names**: lowercase (docs, scripts, node_tools)

#### When to Create New Documentation Files

**Create new files when:**
- Content exceeds 500 lines and serves distinct purpose
- Specialized audience requires dedicated reference
- Integration requirements need comprehensive guide
- Maintenance procedures become complex

**Avoid creating new files for:**
- Content that can be integrated into existing documents
- Temporary or project-specific information
- Duplicate information already covered elsewhere

### 1.4 Directory Organization

#### Documentation Directory (docs/)
- **Purpose**: Specialized documentation that supports but doesn't duplicate README.md
- **File limit**: Maximum 10 files to maintain navigability
- **Naming**: Descriptive, consistent with content purpose

#### Scripts Directory (scripts/)
- **Purpose**: Automation, validation, and maintenance tools
- **File types**: Shell scripts with .sh extension
- **Requirements**: All scripts must be executable and well-documented

---

## Content Standards

### 2.1 Formatting Consistency

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
   [Tool Index](./docs/TOOL_INDEX.md)
   [View Details](./docs/TOOL_INDEX.md#category-name)
   ```

5. **Lists**: Consistent bullet/numbering style
   ```markdown
   - Item one
   - Item two
     - Sub-item
   
   1. Numbered item
   2. Numbered item
   ```

#### Tool Documentation Format

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

### 2.2 Cross-Reference Standards

#### Internal Linking Rules

1. **File References**: Always use relative paths from repository root
   ```markdown
   [TOOLS.md](./TOOLS.md)
   [Tool Index](./docs/TOOL_INDEX.md)
   ```

2. **Section Anchors**: Use consistent anchor format
   ```markdown
   [File Operations](./TOOLS.md#file--directory-operations)
   [Network Tools](./docs/TOOL_INDEX.md#network-tools)
   ```

3. **Bidirectional References**: Ensure cross-references work both ways
   - If README.md links to TOOL_INDEX.md, TOOL_INDEX.md should reference README.md
   - If tool A mentions tool B, tool B should mention tool A (where relevant)

#### Link Validation Requirements

1. **All internal links must be validated** before committing
2. **Section anchors must match actual headings** in target files
3. **File paths must be verified** to exist in repository
4. **No broken links allowed** in any documentation

### 2.3 Example Presentation Standards

#### Code Example Requirements

1. **All examples must be tested** on target macOS system
2. **Include expected output** when helpful for understanding
3. **Use realistic file/directory names** in examples
4. **Provide context** for when to use each example

#### Example Format Standards
```markdown
**Examples**:
```bash
# Comment explaining what this does
command --option file.txt

# Expected output:
# processed file.txt successfully

# Advanced example with pipeline
command --option file.txt | other-command --format
```
```

#### Safety and Warning Standards

**Always include warnings for:**
- Destructive operations (rm, mv with overwrite, chmod 777)
- System-wide changes (sudo commands, system configuration)
- Performance-intensive operations (find /, large directory scans)
- Network operations that could impact others

**Warning Format:**
```markdown
**Safety**: ⚠️ WARNING: This command permanently deletes files. Use with extreme caution.
```

### 2.4 Difficulty Rating Standards

#### Rating Scale Definition

| Rating | Level | Description | User Profile |
|--------|--------|-------------|--------------|
| ⭐⭐ | Beginner | Basic usage, minimal options, safe operations | New CLI users |
| ⭐⭐⭐ | Intermediate | Common options, moderate complexity | Regular CLI users |
| ⭐⭐⭐⭐ | Advanced | Complex features, scripting, some risk | Experienced users |
| ⭐⭐⭐⭐⭐ | Expert | Deep knowledge required, system-level | Power users/admins |

#### Rating Assignment Criteria

- **Beginner (⭐⭐)**: ls, cat, pwd, which
- **Intermediate (⭐⭐⭐)**: grep, find, git, sed (basic usage)
- **Advanced (⭐⭐⭐⭐)**: awk, docker, make, ssh tunneling
- **Expert (⭐⭐⭐⭐⭐)**: dtrace, system debugging, network security

---

## Statistics and Reference Standards

### 3.1 Statistics Markers System

#### Required Statistics Markers

All files containing tool counts, category counts, or line counts must use standardized markers:

```html
<!-- tools-count -->327<!-- /tools-count -->
<!-- categories-count -->35<!-- /categories-count -->
<!-- lines-count -->16852<!-- /lines-count -->
```

#### Statistics Consistency Rules

1. **Primary Source**: TOOLS.md is authoritative for all counts
2. **Automatic Updates**: Use update_stats.sh to maintain consistency
3. **Validation Required**: All statistics must be verified before commits
4. **Multiple File Sync**: Statistics must match across all files that reference them

#### Statistics Validation Process

```bash
# Verify tool count consistency
actual_tools=$(grep -c "^### \*\*.*\*\*" TOOLS.md)
readme_tools=$(grep -o "tools-count -->.*<!-- /tools-count" README.md | sed 's/.*-->\(.*\)<.*/\1/')

# Verify category count consistency  
actual_categories=$(grep -c "^## " TOOLS.md)
readme_categories=$(grep -o "categories-count -->.*<!-- /categories-count" README.md | sed 's/.*-->\(.*\)<.*/\1/')

# Verify line count consistency
actual_lines=$(wc -l < TOOLS.md)
readme_lines=$(grep -o "lines-count -->.*<!-- /lines-count" README.md | sed 's/.*-->\(.*\)<.*/\1/')
```

### 3.2 Cross-Reference Integrity Standards

#### Internal Link Requirements

1. **File References**: All relative file paths must exist
2. **Section Anchors**: All section links must point to existing headers
3. **Tool References**: All tool cross-references must exist in TOOLS.md
4. **Bidirectional Consistency**: Related tools must reference each other

#### Cross-Reference Validation

```bash
# Validate internal file links
grep -r "\[.*\](\./.*\.md)" . --include="*.md" | while read link; do
    file=$(echo "$link" | sed 's/.*](\.\/\(.*\))/\1/')
    [ -f "$file" ] || echo "Broken link: $link -> $file"
done

# Validate tool cross-references
grep -o "See also [^.]*" TOOLS.md | while read ref; do
    tools=$(echo "$ref" | sed 's/See also //' | tr ',' '\n' | sed 's/^ *//')
    echo "$tools" | while read tool; do
        [ -n "$tool" ] && grep -q "^### \*\*$tool\*\*" TOOLS.md || echo "Missing tool: $tool"
    done
done
```

### 3.3 Metadata Standards

#### Required Metadata Fields

Every tool in TOOLS.md must include a complete metadata block:

```html
<!-- meta
category: Category Name
difficulty: ⭐⭐⭐ Intermediate
aliases: alias1, alias2
tags: #tag1 #tag2 #tag3
related: tool1, tool2, tool3
keywords: keyword1, keyword2, keyword3
synonyms: synonym1, synonym2
-->
```

#### Metadata Field Specifications

| Field | Format | Requirements | Example |
|-------|--------|--------------|---------|
| category | String | Must match actual category header | "File & Directory Operations" |
| difficulty | Stars + Level | Use standard rating scale | "⭐⭐⭐ Intermediate" |
| aliases | Comma-separated | Alternative command names | "egrep, fgrep" |
| tags | Space-separated hashtags | Categorization labels | "#text-processing #essential" |
| related | Comma-separated | Tools with related functionality | "grep, awk, sed" |
| keywords | Space-separated | Search terms | "search pattern text filter" |
| synonyms | Comma-separated | Alternative terminology | "text search, pattern matching" |

#### Metadata Validation Rules

1. **Completeness**: All fields must be present (empty values allowed for some fields)
2. **Format Compliance**: Each field must follow specified format
3. **Reference Validity**: Related tools must exist in documentation
4. **Category Accuracy**: Category must match tool's actual section
5. **Tag Consistency**: Use standard tag vocabulary from maintenance guide

---

## Quality Assurance Standards

### 4.1 Pre-Commit Validation

#### Required Validation Checks

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

5. **Example Testing**
   ```bash
   ./scripts/verify_tools.sh --test-examples
   ```

#### Validation Error Categories

| Category | Severity | Action Required |
|----------|----------|-----------------|
| **Critical** | Must fix | Statistics mismatch, broken structure |
| **High** | Fix before merge | Broken links, missing metadata |
| **Medium** | Fix within week | Format inconsistencies, minor errors |
| **Low** | Fix when convenient | Optimization opportunities |

### 4.2 Documentation Testing Standards

#### Example Verification Process

1. **Syntax Testing**: All code examples must be syntactically correct
2. **Execution Testing**: Examples should be tested on target system
3. **Output Verification**: Expected output should match actual results
4. **Error Handling**: Examples should handle common error conditions

#### Tool Availability Verification

```bash
# Verify documented tools exist on system
while read tool; do
    command -v "$tool" >/dev/null || echo "Missing: $tool"
done < <(grep -o "^### \*\*[^*]*\*\*" TOOLS.md | sed 's/### \*\*\(.*\)\*\*.*/\1/')
```

### 4.3 Content Accuracy Standards

#### Source Verification Requirements

1. **Man Page Accuracy**: Descriptions must match official documentation
2. **Version Compatibility**: Examples must work on documented versions
3. **Location Verification**: All tool paths must be accurate for macOS
4. **Feature Currency**: Documented features must be current

#### Accuracy Validation Process

```bash
# Verify tool descriptions against man pages
tool_name="$1"
documented_desc=$(grep -A 1 "^### \*\*$tool_name\*\*" TOOLS.md | tail -1 | sed 's/\*\*Description\*\*: //')
man_desc=$(man "$tool_name" 2>/dev/null | head -20 | grep -i "description\|summary" | head -1)
```

### 4.4 Consistency Validation

#### Format Consistency Checks

1. **Header Hierarchy**: Consistent heading levels and formatting
2. **Code Block Languages**: All code blocks must specify language
3. **List Formatting**: Consistent bullet and numbering styles
4. **Link Formatting**: Consistent link text and path formats

#### Content Consistency Requirements

1. **Terminology**: Use consistent terms throughout documentation
2. **Style**: Maintain consistent writing style and tone
3. **Structure**: Follow template structure for all tool entries
4. **Cross-References**: Ensure related content is properly linked

---

## Maintenance Standards

### 5.1 Regular Review Schedule

#### Daily Maintenance (As Needed)
- Monitor for urgent issues or security advisories
- Quick fixes for critical errors
- Statistics consistency spot checks

#### Weekly Maintenance
- **Statistics Verification**
  ```bash
  ./scripts/update_stats.sh --verify-stats
  ```
- **Link Validation**
  ```bash
  ./scripts/run_validation_suite.sh --validate-links
  ```
- **Tool Availability Check**
  ```bash
  ./scripts/verify_tools.sh --quick
  ```

#### Monthly Maintenance
- **Comprehensive Validation**
  ```bash
  ./scripts/run_validation_suite.sh --detailed
  ```
- **Index Regeneration**
  ```bash
  ./scripts/update_stats.sh --generate-index
  ```
- **Content Review and Updates**
- **Cross-Reference Audit**

#### Quarterly Maintenance
- **Full Tool Audit**
- **Documentation Quality Review**
- **Category Reorganization Assessment**
- **Performance Benchmark Updates**

### 5.2 Change Management Standards

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

### 5.3 Version Control Standards

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

### 6.1 LLM Integration Requirements

#### Claude Code Integration

Documentation must support effective LLM integration:

1. **Structured Metadata**: Machine-readable metadata for all tools
2. **Consistent Patterns**: Predictable structure for parsing
3. **Complete Context**: Self-contained information in tool entries
4. **Safety Information**: Clear warnings for dangerous operations

#### Integration Validation

```bash
# Validate LLM integration requirements
./scripts/run_validation_suite.sh --llm-integration
```

### 6.2 CI/CD Integration Standards

#### Automated Validation Pipeline

Required CI/CD checks:

1. **Documentation Build**: Verify all files parse correctly
2. **Link Validation**: Ensure all internal links work
3. **Statistics Consistency**: Verify counts match across files
4. **Metadata Validation**: Check all metadata is complete and valid
5. **Tool Availability**: Basic availability checks

#### CI/CD Configuration Example

```yaml
name: Documentation Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate Documentation
        run: |
          ./scripts/run_validation_suite.sh --ci-mode
          ./scripts/update_stats.sh --verify-stats
```

### 6.3 Automation Integration

#### Script Integration Standards

All validation and maintenance scripts must:

1. **Return Proper Exit Codes**: 0 for success, non-zero for errors
2. **Provide JSON Output**: For programmatic consumption
3. **Support Batch Operations**: Allow multiple validations in single run
4. **Include Progress Reporting**: Show progress for long operations

#### Automation Workflow Integration

```bash
# Example automation workflow
./scripts/run_validation_suite.sh --json > validation_report.json
if [ $? -eq 0 ]; then
    ./scripts/update_stats.sh --generate-index
    ./scripts/update_stats.sh --update-all
fi
```

### 6.4 External Tool Integration

#### Validation Tool Integration

The repository integrates with external validation tools:

1. **Markdown Linters**: Format and syntax validation
2. **Link Checkers**: Comprehensive link validation
3. **Spell Checkers**: Content accuracy verification
4. **Code Validators**: Example syntax verification

#### Tool Configuration Standards

All external tools should be configured to:
- Respect repository-specific standards
- Integrate with existing validation pipeline
- Provide consistent output formats
- Support automation requirements

---

## Compliance and Enforcement

### Error Handling Standards

#### Validation Failure Response

1. **Critical Errors**: Block commits until resolved
2. **Warning Errors**: Allow commits with documentation
3. **Info Errors**: Log for future resolution
4. **Format Errors**: Auto-fix when possible

#### Error Reporting Format

```json
{
  "validation_type": "statistics_consistency",
  "severity": "critical",
  "file": "README.md",
  "line": 13,
  "error": "Tool count mismatch: documented 325, actual 327",
  "fix_command": "./scripts/update_stats.sh --update README.md"
}
```

### Quality Gates

#### Minimum Quality Requirements

Before any documentation is considered complete:

1. ✅ All statistics markers are consistent
2. ✅ All cross-references are valid
3. ✅ All examples are tested and working
4. ✅ All metadata is complete and accurate
5. ✅ All safety warnings are included
6. ✅ Format follows established standards

#### Review Checklist

- [ ] Statistics updated and consistent across all files
- [ ] Cross-references validated and bidirectional where appropriate
- [ ] New tools include complete metadata blocks
- [ ] Examples tested on target macOS system
- [ ] Safety warnings included for dangerous operations
- [ ] Related tools cross-referenced appropriately
- [ ] Format follows established template
- [ ] No duplication with existing documentation

---

## Conclusion

These documentation standards ensure the CLI Tools Reference Documentation repository maintains the highest quality, consistency, and usability standards. By following these guidelines, contributors can maintain the repository's reputation as the definitive CLI tools reference while supporting both human users and LLM integration effectively.

### Key Principles

1. **Consistency Above All**: Every piece of documentation should follow identical patterns
2. **Accuracy First**: Never document untested or unverified information
3. **User-Centric**: Design for both human readability and machine parsing
4. **Maintainable**: Structure for long-term sustainability and updates
5. **Comprehensive**: Cover all aspects without duplication
6. **Validated**: Every element must be automatically verifiable

### Implementation Priority

1. **High Priority**: Statistics consistency, cross-reference integrity, safety warnings
2. **Medium Priority**: Format consistency, metadata completeness, example testing
3. **Low Priority**: Style improvements, optimization opportunities, minor enhancements

---

*This standards guide serves as the authoritative reference for all documentation within the CLI Tools Reference Documentation repository. All contributors and maintainers must adhere to these standards to ensure continued quality and consistency.*

*Last updated: 2025-09-01*
