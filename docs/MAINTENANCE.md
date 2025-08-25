# MAINTENANCE.md - Repository Maintenance Guide

## Overview

This guide establishes comprehensive procedures for maintaining the CLI Tools Documentation repository, ensuring it remains current, accurate, and valuable for users over time.

## Regular Maintenance Schedule

### Daily Tasks (As Needed)
- Monitor repository issues and user feedback
- Respond to urgent tool updates or security advisories
- Quick fixes for documentation errors

### Weekly Tasks
- [ ] Review recent system tool additions
- [ ] Check for new Homebrew formula updates
- [ ] Scan for deprecated tool warnings
- [ ] Update any broken examples

### Monthly Tasks
- [ ] **Comprehensive Validation Suite**
  ```bash
  # Run complete validation suite
  ./scripts/run_validation_suite.sh
  
  # Run with fix suggestions
  ./scripts/run_validation_suite.sh --fix-suggestions
  
  # Generate summary report
  ./scripts/run_validation_suite.sh --summary
  ```

- [ ] **Tool Verification**
  ```bash
  # Run comprehensive tool verification
  ./scripts/verify_tools.sh --detailed
  
  # Check for new tools in common paths
  ls /usr/bin | wc -l
  ls /usr/local/bin | wc -l
  ls /opt/homebrew/bin | wc -l
  ```

- [ ] **Documentation Review**
  - Check for consistency in formatting
  - Verify all cross-references work
  - Update tool counts in README.md
  - Review difficulty ratings
  
- [ ] **Index Regeneration**
  ```bash
  # Regenerate comprehensive tool index
  ./scripts/update_stats.sh --generate-index
  
  # Validate keywords and synonyms
  ./scripts/update_stats.sh --check-keywords
  ```

- [ ] **Performance Updates**
  - Re-run benchmarks for performance comparisons
  - Update speed recommendations
  - Check for new performance tools

### Quarterly Tasks
- [ ] **Comprehensive Tool Audit**
  ```bash
  # Generate full tool report
  ./scripts/update_stats.sh --full-report
  
  # Check all documented tools still exist
  ./scripts/verify_tools.sh --all
  
  # Identify missing essential tools
  ./scripts/verify_tools.sh --find-missing
  ```

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

## Automated Validation Suite

### Comprehensive Validation
The repository includes a comprehensive validation suite (`scripts/run_validation_suite.sh`) that orchestrates all validation tools:

#### Validation Checks Performed
1. **Infrastructure Check**: Verifies all required scripts are present and executable
2. **README.md Validation**: Checks statistics markers and consistency
3. **TOOLS.md Metadata**: Validates metadata blocks and format
4. **Documentation Format**: Ensures format consistency across all docs
5. **Internal Links**: Validates cross-references and internal links
6. **Tool Availability**: Verifies documented tools exist on system
7. **Plan Completion**: Checks TRAYCER_PLAN.md implementation status
8. **File Structure**: Ensures all required files and directories exist

#### Running the Validation Suite
```bash
# Full detailed validation
./scripts/run_validation_suite.sh --detailed

# Quick summary only
./scripts/run_validation_suite.sh --summary

# With automated fix suggestions
./scripts/run_validation_suite.sh --fix-suggestions

# JSON output for CI/CD integration
./scripts/run_validation_suite.sh --json
```

#### Interpreting Results
- **Critical Issues**: Must be fixed immediately (missing files, broken structure)
- **Warnings**: Should be addressed soon (missing tools, format inconsistencies)
- **Info Items**: Nice to fix but not urgent (metadata improvements)

## Quality Assurance Procedures

### Tool Verification Process
1. **Existence Check**
   ```bash
   which tool_name
   # or
   command -v tool_name
   ```

2. **Version Verification**
   ```bash
   tool_name --version
   # or
   tool_name -v
   ```

3. **Man Page Availability**
   ```bash
   man tool_name
   ```

4. **Example Testing**
   - Run each documented example
   - Verify output matches description
   - Check for deprecated options

### Documentation Standards Checklist

#### For Each Tool Entry
- [ ] Tool name formatted as `**tool-name**`
- [ ] Metadata block included (HTML comment format)
- [ ] Description from official man page
- [ ] Location path is absolute and correct
- [ ] Common use cases listed (2 minimum)
- [ ] Examples are practical and tested
- [ ] Difficulty rating included (⭐⭐ to ⭐⭐⭐⭐⭐)
- [ ] Safety warnings where applicable
- [ ] Modern alternatives mentioned
- [ ] Cross-references to related tools

#### Format Template
```markdown
### **tool-name** - Brief Description
<!-- meta
category: Category Name
difficulty: ⭐⭐⭐ Intermediate
aliases: alias1, alias2
tags: #tag1 #tag2 #tag3
related: tool1, tool2, tool3
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
**Modern Alternative**: tool-name-modern
**Related**: See also tool-x, tool-y
```

## Tool Metadata Guidelines

### Metadata Format Specification

Each tool entry in `TOOLS.md` must include a structured metadata block using HTML comments immediately after the tool heading. This metadata is invisible in rendered markdown but parseable by scripts for validation and analysis.

#### Required Metadata Fields

1. **category**: The category section containing the tool (e.g., "File & Directory Operations")
2. **difficulty**: Star rating with description (e.g., "⭐⭐⭐ Intermediate")
3. **aliases**: Common alternative names or shortcuts (comma-separated)
4. **tags**: Hashtag labels for categorization (space-separated)
5. **related**: Related tools for cross-reference (comma-separated)

#### Example Metadata Block
```html
<!-- meta
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐⭐ Advanced
aliases: egrep, fgrep
tags: #text-processing #essential #search #patterns
related: awk, sed, rg, ag
-->
```

### Difficulty Levels

- **⭐⭐ Beginner**: Basic usage, minimal options required
- **⭐⭐⭐ Intermediate**: Common options, standard use cases
- **⭐⭐⭐⭐ Advanced**: Complex features, scripting required
- **⭐⭐⭐⭐⭐ Expert**: Deep system knowledge, rare use cases

### Standard Tag Vocabulary

#### Category Tags
- `#files` - File and directory operations
- `#text-processing` - Text manipulation and search
- `#version-control` - Git and other VCS tools
- `#development` - Programming and build tools
- `#network` - Networking and connectivity
- `#security` - Security and encryption tools
- `#system` - System administration
- `#containers` - Docker, Kubernetes, etc.
- `#monitoring` - Performance and monitoring
- `#media` - Audio, video, image processing

#### Feature Tags
- `#essential` - Core Unix/Linux tools everyone should know
- `#modern-alternative` - Modern replacements for traditional tools
- `#macos-specific` - Tools specific to macOS
- `#performance` - Performance-oriented tools
- `#interactive` - Interactive/TUI tools

### Cross-Reference Guidelines

#### Maintaining Related Tools
1. **Bidirectional References**: If tool A references tool B, ensure B also references A
2. **Limit References**: Include 2-4 most relevant related tools
3. **Validate References**: All referenced tools must exist in TOOLS.md
4. **Logical Connections**: Reference tools with similar functionality or common workflows

#### Example Cross-References
- `ls` relates to `eza` (modern alternative), `tree` (tree view), `find` (search)
- `grep` relates to `rg` (faster alternative), `awk` (text processing), `sed` (stream editing)

### Contribution Guidelines

#### Adding New Tools with Metadata
1. Copy the format template including metadata block
2. Fill in all required metadata fields
3. Choose appropriate tags from standard vocabulary
4. Identify 2-4 related tools for cross-references
5. Validate metadata using `scripts/update_stats.sh --check-metadata`

#### Updating Existing Tools
1. Preserve existing metadata when updating content
2. Add new tags if functionality changes
3. Update related tools if better alternatives emerge
4. Maintain consistency with category placement

### Metadata Validation

Run metadata consistency checks:
```bash
# Check metadata presence and format
./scripts/update_stats.sh --check-metadata

# Full consistency check including metadata
./scripts/update_stats.sh --check-consistency

# Validate specific aspects
./scripts/update_stats.sh --check-format --check-metadata
```

Common validation errors:
- Missing metadata block
- Missing required fields
- Invalid tag format (must start with #)
- Non-existent related tools
- Mismatched difficulty ratings

## Automated Index Generation

The repository includes powerful automation for generating comprehensive tool indexes and maintaining documentation consistency.

### Index Generation Workflow

#### Generate Tool Index
```bash
# Generate comprehensive tool index with three views
./scripts/update_stats.sh --generate-index

# This creates/updates docs/TOOL_INDEX.md with:
# - Alphabetical listing of all tools
# - Category-based grouping
# - Difficulty-sorted index within categories
```

The generated index includes:
- **Alphabetical Index**: All tools A-Z with descriptions and metadata
- **Category Index**: Tools grouped by category with counts
- **Difficulty Index**: Tools sorted by difficulty within each category

#### Validate Search Keywords and Synonyms
```bash
# Check that all tools have keywords and synonyms
./scripts/update_stats.sh --check-keywords

# Combined check with other validations
./scripts/update_stats.sh --check-consistency --check-keywords
```

### Search Optimization Guidelines

#### Choosing Effective Keywords
1. **Functionality-based**: Include words describing what the tool does
2. **User-intent focused**: Think about what users search for
3. **Action verbs**: Include verbs like "find", "search", "copy", "move"
4. **Technical terms**: Include relevant technical terminology
5. **Space-separated**: Keywords should be single words separated by spaces

Example:
```html
<!-- meta
keywords: search find locate files directories recursive pattern
-->
```

#### Synonym Selection Criteria
1. **Common alternatives**: Include alternative tool names
2. **Abbreviations**: Add common abbreviations (e.g., "dir" for "directory")
3. **Misspellings**: Include common misspellings for better search
4. **Related terms**: Add closely related terminology
5. **Comma-separated**: Synonyms should be comma-separated

Example:
```html
<!-- meta
synonyms: ripgrep, rg, fast-grep, grep-alternative
-->
```

### Automation Integration

#### Monthly Maintenance Tasks
Add index generation to monthly maintenance:
```bash
# Regenerate tool index
./scripts/update_stats.sh --generate-index

# Validate all metadata including keywords
./scripts/update_stats.sh --check-consistency --check-keywords

# Update statistics in README
./scripts/update_stats.sh --update README.md
```

#### Pre-commit Quality Checks
Include in pre-commit hooks:
```bash
# Run full validation suite
./scripts/update_stats.sh --check-consistency --check-keywords

# Check for issues (exit code 0 = success)
if [ $? -ne 0 ]; then
    echo "Fix validation issues before committing"
    exit 1
fi
```

#### CI/CD Integration
The update_stats.sh script returns proper exit codes for CI integration:
- `0`: All checks passed
- `1`: Validation errors found

Example GitHub Actions workflow:
```yaml
- name: Validate Documentation
  run: |
    ./scripts/update_stats.sh --check-consistency
    ./scripts/update_stats.sh --check-keywords
    
- name: Generate Index
  run: ./scripts/update_stats.sh --generate-index
```

### Quality Assurance Procedures

#### Index Quality Checks
1. **Completeness**: Verify all tools appear in index
2. **Link validity**: Check all links to TOOLS.md sections work
3. **Description accuracy**: Ensure descriptions match tool functionality
4. **Category accuracy**: Verify tools are in correct categories
5. **Difficulty consistency**: Check difficulty ratings match TOOLS.md

#### Search Optimization Validation
1. **Keyword presence**: All tools must have keywords field
2. **Synonym presence**: All tools must have synonyms field
3. **Format validation**: Keywords space-separated, synonyms comma-separated
4. **Relevance check**: Keywords and synonyms should be relevant
5. **No duplicates**: Avoid duplicate keywords within same tool

### Troubleshooting

#### Common Index Generation Issues
1. **Missing descriptions**: Tool descriptions show as "PENDING_DESC"
   - Solution: Ensure **Description** section follows tool header
   
2. **Incorrect anchors**: Links to TOOLS.md don't work
   - Solution: Check tool names for special characters
   
3. **Missing tools**: Some tools don't appear in index
   - Solution: Verify metadata blocks are properly formatted

4. **Category mismatch**: Tools appear in wrong category
   - Solution: Check category field in metadata blocks

#### Fixing Validation Errors
```bash
# Find tools missing keywords
./scripts/update_stats.sh --check-keywords | grep "missing keywords"

# Find tools with invalid metadata
./scripts/update_stats.sh --check-metadata | grep "missing required field"

# Generate report of all issues
./scripts/update_stats.sh --check-consistency > validation_report.txt
```

## Tool Management

### Adding New Tools

#### Criteria for Addition
1. **Relevance**: Tool must be useful for development or system administration
2. **Availability**: Installable on macOS via standard methods
3. **Stability**: Tool should be mature and maintained
4. **Documentation**: Must have adequate documentation
5. **Non-redundancy**: Not duplicate existing tool functionality

#### Addition Process
1. Verify tool meets all criteria
2. Test tool on target macOS system
3. Document following standard format
4. Add to appropriate category
5. Update Tool Finder index
6. Add to performance comparisons if relevant
7. Update tool count in README.md
8. Run verification script

### Deprecating Tools

#### Criteria for Deprecation
1. Tool no longer maintained (2+ years)
2. Replaced by superior alternative
3. Security vulnerabilities without fixes
4. No longer compatible with current macOS
5. Functionality merged into another tool

#### Deprecation Process
1. Mark tool with deprecation warning
2. Add recommended alternative
3. Keep for 1 quarter with warning
4. Move to archived section
5. Remove after 2 quarters
6. Update all cross-references

### Version Compatibility Tracking

#### macOS Version Matrix
| macOS Version | Verification Date | Notes |
|--------------|------------------|-------|
| Sonoma (14.x) | Current | Primary target |
| Ventura (13.x) | Supported | Most tools compatible |
| Monterey (12.x) | Legacy | Some modern tools unavailable |

#### Tool Version Tracking
- Document minimum version requirements
- Note version-specific features
- Track breaking changes
- Update compatibility warnings

## Community Contributions

### Accepting Contributions

#### Contribution Guidelines
1. **Format Compliance**: Must follow documentation standards
2. **Testing**: All examples must be tested
3. **Relevance**: Tool must meet addition criteria
4. **Quality**: Clear, concise, accurate documentation

#### Review Process
1. Check format compliance
2. Verify tool existence and examples
3. Test on target system
4. Check for duplicates
5. Validate difficulty rating
6. Ensure safety warnings present
7. Merge and update indices

### Feedback Integration

#### User Feedback Channels
- GitHub Issues
- Pull Requests
- Direct feedback via repository

#### Feedback Processing
1. Acknowledge within 48 hours
2. Verify reported issues
3. Prioritize by impact
4. Implement fixes
5. Credit contributors

## Automation and Scripts

### Verification Scripts

#### verify_tools.sh
```bash
# Basic verification
./scripts/verify_tools.sh

# Detailed report
./scripts/verify_tools.sh --detailed

# Check specific category
./scripts/verify_tools.sh --category "Network Tools"

# Find missing tools
./scripts/verify_tools.sh --find-missing
```

#### update_stats.sh
```bash
# Update all statistics
./scripts/update_stats.sh

# Generate report only
./scripts/update_stats.sh --report-only

# Update specific files
./scripts/update_stats.sh --update README.md

# Check consistency
./scripts/update_stats.sh --check-consistency
```

### Automated Checks

#### Pre-commit Hooks
```bash
# Run comprehensive validation
./scripts/run_validation_suite.sh --summary

# Format checking
./scripts/update_stats.sh --check-format

# Link validation
./scripts/update_stats.sh --check-links

# Example/metadata verification
./scripts/update_stats.sh --check-metadata
```

#### CI/CD Integration
- Automated tool verification
- Format consistency checks
- Link validation
- Statistics update
- Documentation generation

## Update Schedules

### Priority Levels

#### Critical (Immediate)
- Security vulnerabilities
- Breaking changes
- Major errors in documentation
- Tool removal from system

#### High (Within 48 hours)
- New essential tools
- Significant feature updates
- Important deprecations
- Major alternative tools

#### Medium (Weekly)
- Minor tool updates
- Example improvements
- Cross-reference additions
- Performance updates

#### Low (Monthly)
- Formatting improvements
- Minor corrections
- Additional examples
- Learning path updates

### Emergency Updates

#### Security Advisory Response
1. Immediate assessment of impact
2. Update affected tool documentation
3. Add prominent security warning
4. Provide mitigation steps
5. Document alternative tools
6. Notify users via README

#### Breaking Change Response
1. Verify change across versions
2. Update examples to working versions
3. Document version-specific behavior
4. Provide migration guidance
5. Update compatibility matrix

## Report Generation

### Monthly Reports
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

### Annual Report
- Comprehensive statistics
- Growth metrics
- User feedback summary
- Major improvements
- Future roadmap

## Best Practices

### Documentation Principles
1. **Accuracy First**: Never document untested information
2. **Clarity**: Write for users of all skill levels
3. **Completeness**: Cover common use cases thoroughly
4. **Currency**: Keep information up-to-date
5. **Consistency**: Maintain format standards

### Maintenance Philosophy
1. **Proactive**: Anticipate changes and updates
2. **Responsive**: Address user needs quickly
3. **Systematic**: Follow established procedures
4. **Transparent**: Document all changes
5. **Collaborative**: Welcome community input

## Troubleshooting

### Common Issues

#### Tool Not Found
```bash
# Check if tool is installed
which tool_name || echo "Not found"

# Check PATH
echo $PATH

# Find tool location
find / -name tool_name 2>/dev/null
```

#### Version Mismatch
```bash
# Check installed version
tool_name --version

# Check available versions
brew search tool_name
brew info tool_name
```

#### Documentation Inconsistency
- Run consistency checker
- Verify against source
- Update all occurrences
- Check cross-references

## Resources

### Official Documentation
- Man pages: Primary source of truth
- Tool websites: Latest features and updates
- Package managers: Installation and versions
- Community forums: Usage patterns and issues

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

## Conclusion

This maintenance guide ensures the CLI Tools Documentation repository remains a valuable, accurate, and current resource. Regular maintenance, community engagement, and systematic procedures guarantee long-term sustainability and usefulness.

---

*Last updated: 2025 - Maintenance procedures for the CLI Tools Documentation project*