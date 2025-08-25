# Claude Code Enhancement Guide

## 🎯 Purpose
This document provides specific enhancements and usage patterns to help Claude Code work more effectively with the CLI tools documented in this repository.

## 📚 Using TOOLS.md Effectively

### Quick Tool Lookup Patterns
When users ask about CLI operations, Claude should:

1. **Search by Task** - Look for tools by what they do:
   ```bash
   # User asks: "How do I find large files?"
   # Claude searches: disk usage, file size, ncdu, dust, du
   ```

2. **Consider Modern Alternatives** - Always suggest both traditional and modern options:
   ```bash
   # Traditional: grep pattern file.txt
   # Modern: rg pattern file.txt  # Faster, respects .gitignore
   ```

3. **Check Difficulty Ratings** - Match tool complexity to user expertise:
   - ⭐⭐ Beginner → Simple, safe commands
   - ⭐⭐⭐ Intermediate → More options, some risk
   - ⭐⭐⭐⭐ Advanced → Complex operations
   - ⭐⭐⭐⭐⭐ Expert → Requires deep knowledge

## 🔧 Recommended Tool Combinations

### For File Operations
```bash
# Finding and processing files - combine these tools:
fd .txt | xargs rg "pattern"           # Modern approach
find . -name "*.txt" | xargs grep "pattern"  # Traditional approach

# Disk usage analysis pipeline:
dust -d 3 | head -20                   # Quick visual overview
ncdu /path/to/analyze                  # Interactive exploration
```

### For Text Processing
```bash
# Modern text pipeline:
cat file.txt | sd "old" "new" | bat    # Simple replacement with preview

# Data analysis pipeline:
csvcut -c 1,3,5 data.csv | csvstat     # Select columns and analyze
miller --csv stats1 -a mean,sum -f value data.csv  # Statistical operations
```

### For Development Workflows
```bash
# Git enhancement stack:
lazygit                                 # Interactive Git UI
git diff | delta                        # Enhanced diff viewing
git log --oneline | head -10           # Quick history check

# Build system selection:
# Small project → make
# Medium project → cmake + ninja
# Large project → bazel or meson
```

## ⚠️ Safety Recommendations for Claude

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
   - `grep -r` on large dirs → Suggest `rg` instead
   - `masscan` → Can overwhelm networks

## 📊 Tool Selection Guidelines

### Choose Tools Based on Context:

| Task | Small Scale | Medium Scale | Large Scale |
|------|------------|--------------|-------------|
| **Search Text** | `grep` | `rg` (ripgrep) | `rg` with `--threads` |
| **Find Files** | `find` | `fd` | `fd` with parallel |
| **Process Monitor** | `ps` | `htop` | `btop` |
| **Disk Usage** | `du` | `ncdu` | `dust` |
| **Build System** | `make` | `cmake`/`ninja` | `bazel` |
| **Text Replace** | `sed` | `sd` | `sd` with `-i` |

## 🚀 Performance Optimizations

### Suggest Faster Alternatives When:
- User is searching large codebases → Use `rg` not `grep`
- User needs disk usage info → Use `dust` not `du -h`
- User is finding files → Use `fd` not `find`
- User views files often → Use `bat` not `cat`
- User monitors processes → Use `procs` not `ps aux`

### Parallel Processing Opportunities:
```bash
# Instead of sequential:
for file in *.txt; do process "$file"; done

# Suggest parallel:
find . -name "*.txt" | parallel process {}
# or
fd .txt | xargs -P 8 process
```

## 🔍 Debugging Assistance

### When Users Have Issues, Check:

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

## 📝 Response Templates

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

## 🎓 Learning Path Suggestions

### Recommend Tools in This Order:

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

## 🔄 Continuous Improvements

### Regular Updates Needed:
- Check for new Homebrew formula updates
- Add newly discovered macOS native tools
- Update deprecated tool warnings
- Add user-reported tool combinations
- Include new safety considerations

### Feedback Integration:
When users report issues or suggest improvements:
1. Verify the suggestion works on macOS
2. Test with current macOS version
3. Add to appropriate section in TOOLS.md
4. Update cross-references
5. Add safety warnings if needed

## 💡 Pro Tips for Claude Code

1. **Always verify tool availability** before suggesting complex pipelines
2. **Prefer installed tools** over ones requiring installation
3. **Start simple** - basic solution first, then optimize
4. **Include examples** - concrete commands are clearer than descriptions
5. **Cross-reference** - mention related tools for complete solutions
6. **Test commands** - ensure syntax is correct for macOS
7. **Version awareness** - some tools have different options on macOS

## 🏆 Excellence Standards

Every tool suggestion should include:
- ✅ What it does (brief description)
- ✅ How to use it (basic syntax)
- ✅ Real example (working command)
- ✅ Why use it (benefit over alternatives)
- ✅ Any warnings (safety/performance)
- ✅ Modern alternative (if applicable)

---

*This guide helps Claude Code provide superior CLI assistance by leveraging the comprehensive TOOLS.md reference effectively.*