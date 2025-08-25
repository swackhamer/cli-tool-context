# Claude Code Integration Guide

## Project Overview

This repository contains the most comprehensive CLI tools reference available for macOS systems, with 312+ tools documented across 25+ categories. This guide helps Claude Code work effectively with the repository's resources to provide superior CLI assistance.

## Repository Structure

### Core Files
- **`TOOLS.md`** - Main deliverable: 312+ CLI tools with 14,500 lines of documentation
- **`README.md`** - Repository overview and quick start guide
- **`TODO.md`** - Active roadmap for remaining work
- **`LICENSE`** - Legal information

### Documentation (docs/)
- **`CHEATSHEET.md`** - Quick reference for common operations
- **`system_administration_tools.md`** - Specialized sysadmin reference
- **`FUTURE_TOOLS.md`** - Recommendations for future additions
- **`MAINTENANCE.md`** - Maintenance procedures and schedules
- **`CLAUDE_GUIDE.md`** - This integration guide

### Scripts (scripts/)
- **`verify_tools.sh`** - Tool installation verification
- **`update_stats.sh`** - Statistics and consistency checker

## Using TOOLS.md Effectively

### Quick Tool Lookup Patterns

When users ask about CLI operations:

1. **Search by Task** - Find tools by what they accomplish:
   ```bash
   # User asks: "How do I find large files?"
   # Search for: disk usage, file size, ncdu, dust, du
   ```

2. **Consider Modern Alternatives** - Always present both traditional and modern options:
   ```bash
   # Traditional: grep pattern file.txt
   # Modern: rg pattern file.txt  # Faster, respects .gitignore
   ```

3. **Match Difficulty to User Expertise**:
   - ⭐⭐ Beginner → Simple, safe commands
   - ⭐⭐⭐ Intermediate → More options, some risk
   - ⭐⭐⭐⭐ Advanced → Complex operations
   - ⭐⭐⭐⭐⭐ Expert → Requires deep knowledge

### Documentation Standards

All tools follow this consistent format:
```markdown
### **tool-name** - Brief Description
**Description**: Detailed description from man page
**Location**: `/path/to/executable`
**Common Use Cases**:
- Primary use case for development work
- Secondary use case for system administration

**Examples**:
[Practical usage examples with common patterns]
```

## Tool Selection Guidelines

### Context-Based Recommendations

| Task | Small Scale | Medium Scale | Large Scale |
|------|------------|--------------|-------------|
| **Search Text** | `grep` | `rg` (ripgrep) | `rg --threads` |
| **Find Files** | `find` | `fd` | `fd` with parallel |
| **Process Monitor** | `ps` | `htop` | `btop` |
| **Disk Usage** | `du` | `ncdu` | `dust` |
| **Build System** | `make` | `cmake`/`ninja` | `bazel` |
| **Text Replace** | `sed` | `sd` | `sd -i` |

### Performance Optimization

Suggest faster alternatives when users are:
- Searching large codebases → Use `rg` not `grep`
- Checking disk usage → Use `dust` not `du -h`
- Finding files → Use `fd` not `find`
- Viewing files frequently → Use `bat` not `cat`
- Monitoring processes → Use `procs` not `ps aux`

### Parallel Processing Opportunities

```bash
# Instead of sequential:
for file in *.txt; do process "$file"; done

# Suggest parallel:
fd .txt | xargs -P 8 process
# or
find . -name "*.txt" | parallel process {}
```

## Safety Considerations

### Always Include Warnings For:

1. **Destructive Operations**
   - `rm -rf` → Suggest `trash` or `rm -i` first
   - `mv` → Warn about overwriting
   - `chmod 777` → Explain security risks

2. **System-Wide Changes**
   - `sudo` commands → Explain what they modify
   - Network scanners → Only on owned networks
   - System configuration → Suggest backups first

3. **Performance Impact**
   - `find /` → May take very long
   - `grep -r` on large directories → Suggest `rg` instead
   - `masscan` → Can overwhelm networks

## Response Templates

### For Simple Questions:
```
The tool you need is `toolname` (location: /path/to/tool)
Basic usage: `toolname [options] file`
Example: `toolname -flag input.txt`
Modern alternative: `modern_tool` (faster, better UX)
```

### For Complex Tasks:
```
This requires multiple tools:
1. First, use `tool1` to prepare data
2. Then pipe to `tool2` for processing  
3. Finally, use `tool3` for output

Complete pipeline:
`tool1 input | tool2 --option | tool3 > output`

Safety note: [any warnings]
Performance tip: [optimization if applicable]
```

## Debugging Assistance

When users encounter issues, check:

1. **Tool Installation**
   ```bash
   which tool_name                      # Is it installed?
   brew list | grep tool_name           # Installed via Homebrew?
   tool_name --version                  # Version check
   ```

2. **Permission Issues**
   ```bash
   ls -la file                          # Check permissions
   whoami                               # Current user
   sudo -l                              # What can user sudo?
   ```

3. **Path Problems**
   ```bash
   echo $PATH                           # Check PATH
   which -a tool_name                   # All locations
   /full/path/to/tool                  # Use absolute path
   ```

## Learning Path Recommendations

### Progressive Skill Development

**Beginners (⭐⭐)**
1. Basic file ops: `ls`, `cp`, `mv`, `mkdir`
2. Text viewing: `cat`, `head`, `tail`, `less`
3. Simple search: `grep`, `find`

**Intermediate (⭐⭐⭐)**
1. Modern alternatives: `fd`, `rg`, `bat`
2. Text processing: `sed`, `awk`, `cut`
3. Git basics: `git`, `delta`, `lazygit`

**Advanced (⭐⭐⭐⭐)**
1. System analysis: `htop`, `iostat`, `lsof`
2. Network tools: `nmap`, `tcpdump`, `curl`
3. Build systems: `cmake`, `ninja`, `docker`

**Expert (⭐⭐⭐⭐⭐)**
1. Performance: `dtrace`, `instruments`, `valgrind`
2. Security: `masscan`, `openssl`, `gpg`
3. Scale: `bazel`, `kubernetes`, `terraform`

## Best Practices for Claude Code

### Excellence Standards

Every tool suggestion should include:
- ✅ What it does (brief description)
- ✅ How to use it (basic syntax)
- ✅ Real example (working command)
- ✅ Why use it (benefit over alternatives)
- ✅ Any warnings (safety/performance)
- ✅ Modern alternative (if applicable)

### Pro Tips

1. **Always verify tool availability** before suggesting complex pipelines
2. **Prefer installed tools** over ones requiring installation
3. **Start simple** - basic solution first, then optimize
4. **Include examples** - concrete commands are clearer than descriptions
5. **Cross-reference** - mention related tools for complete solutions
6. **Test commands** - ensure syntax is correct for macOS
7. **Version awareness** - some tools have different options on macOS

## Recommended Tool Combinations

### File Operations Pipeline
```bash
# Finding and processing files:
fd .txt | xargs rg "pattern"           # Modern approach
find . -name "*.txt" | xargs grep "pattern"  # Traditional

# Disk usage analysis:
dust -d 3 | head -20                   # Quick overview
ncdu /path/to/analyze                  # Interactive exploration
```

### Text Processing Pipeline
```bash
# Modern text pipeline:
cat file.txt | sd "old" "new" | bat    # Simple replacement with preview

# Data analysis:
csvcut -c 1,3,5 data.csv | csvstat     # Select columns and analyze
miller --csv stats1 -a mean,sum -f value data.csv  # Statistical operations
```

### Development Workflow
```bash
# Git enhancement:
lazygit                                 # Interactive Git UI
git diff | delta                        # Enhanced diff viewing
git log --oneline | head -10           # Quick history check

# Build system selection:
# Small project → make
# Medium project → cmake + ninja
# Large project → bazel or meson
```

## Platform Awareness

- **Primary Target**: macOS (Apple Silicon/Intel)
- **Tool Locations**: Absolute paths provided for each tool
- **Alternatives**: Modern replacements noted (e.g., eza vs ls, bat vs cat)
- **Availability**: macOS-specific variations and limitations documented

## Quality Assurance

This repository maintains high standards through:
- Verified tool existence on target macOS systems
- Consistent formatting across all 312+ tools
- Modern alternatives and best practices highlighted
- Enhanced navigation and performance guides
- Production-ready scripts and automation resources

---

*This guide ensures Claude Code provides superior CLI assistance by leveraging the comprehensive TOOLS.md reference effectively.*