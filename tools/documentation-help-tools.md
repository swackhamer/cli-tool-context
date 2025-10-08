## Documentation & Help Tools

### **man** - Manual Pages**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Documentation & Help Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [man, manual pages]
synonyms: [man]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display manual pages for commands
**Location**: `/usr/bin/man`
**Common Use Cases**:

- Command documentation lookup
- Syntax reference
- Option discovery
- Learning command usage

**See Also**: `whatis` (brief descriptions), `apropos` (keyword search), `help` (builtin help)

**Examples**:

```bash
# Display manual page
man ls

# Search manual sections
man 1 printf  # section 1 (commands)
man 3 printf  # section 3 (library functions)

# Search for pattern in manual
man -k networking

# Display all sections
man -a intro

# Format for printing
man -t ls | lpr

# Save manual page to file
man ls > ls_manual.txt

# Display brief description
man -f ls

# Search path for manual pages
man -w ls
```


### **whatis** - Brief Command Descriptions**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Documentation & Help Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [whatis, brief command descriptions]
synonyms: [whatis]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display brief descriptions of commands
**Location**: `/usr/bin/whatis`
**Common Use Cases**:

- Quick command summaries
- Command identification
- Batch description lookup
- Learning new commands

**See Also**: `man` (full manual), `apropos` (keyword search), `info` (info documents)

**Examples**:

```bash
# Get brief description
whatis ls

# Multiple commands
whatis ls cd pwd mkdir

# Wildcard search
whatis "ls*"

# Update whatis database
sudo /usr/libexec/makewhatis

# Search with exact match
whatis -w ls
```


### **apropos** - Search Manual Pages**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Documentation & Help Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [apropos, search manual pages]
synonyms: [apropos]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Search manual page names and descriptions
**Location**: `/usr/bin/apropos`
**Common Use Cases**:

- Find commands by functionality
- Discover related tools
- Learning command ecosystem
- Topic-based searching

**See Also**: `man` (manual pages), `whatis` (brief descriptions)

**Examples**:

```bash
# Search for networking commands
apropos network

# Search for file operations
apropos "file copy"

# Case-insensitive search
apropos -i NETWORK

# Exact word matching
apropos -w copy

# Search in descriptions only
apropos -d archive

# Multiple keywords
apropos compress archive

# Section-specific search
apropos -s 1 copy
```


### **tldr** - Simplified Man Pages
<!-- metadata:
category: Documentation & Help Tools
difficulty: ⭐ Beginner
aliases: []
tags: [#documentation, #help, #modern-alternative, #community]
related: [man, apropos, whatis, cheat]
keywords: [tldr, man, manual, help, documentation, examples, simplified, community-driven]
synonyms: [too-long-didnt-read, simple-man, quick-help, example-based-help]
platform: [macOS, Linux, Windows]
installation: brew install tldr
-->
**Description**: Community-driven simplified and practical help pages with examples
**Location**: `/opt/homebrew/bin/tldr`
**Difficulty**: ⭐ Beginner
**Common Use Cases**:

- Quick command examples
- Practical usage patterns
- Learning new commands
- Refreshing command syntax
- Mobile-friendly documentation

**See Also**: `man` (full documentation), `apropos` (search), `whatis` (brief description), `cheat` (cheat sheets)

**Examples**:

```bash
# Basic usage
tldr tar                    # Show examples for tar command
tldr git commit            # Show git commit examples
tldr docker               # Show docker examples

# Update local cache
tldr --update             # Update pages cache
tldr -u                   # Short form

# Platform-specific pages
tldr --platform linux tar  # Linux-specific examples
tldr --platform osx brew  # macOS-specific examples
tldr --platform windows dir # Windows-specific examples

# List all available pages
tldr --list               # Show all available pages
tldr --list | grep docker # Search available pages

# Language selection
tldr --language es tar    # Spanish documentation
tldr --language fr git    # French documentation

# Render as markdown
tldr --render tar         # Output as rendered markdown

# Common tldr examples
tldr find                 # File searching examples
tldr curl                 # HTTP request examples
tldr ssh                  # SSH connection examples
tldr rsync               # File sync examples
tldr ffmpeg              # Media processing examples

# Configuration (~/.tldrrc)
cat > ~/.tldrrc << 'EOF'
{
  "theme": "ocean",
  "cache_timeout": 168,
  "update_on_startup": true
}
EOF

# Alternative clients
npm install -g tldr       # Node.js client
pip install tldr         # Python client
cargo install tealdeer   # Rust client (faster)

# Offline usage
tldr --offline tar       # Use cached pages without internet

# Contributing
# Pages are stored at: https://github.com/tldr-pages/tldr
# Format: Markdown with specific structure
# Example page structure:
# # command-name
# > Brief description
#
# - Example description:
#   `command --option argument`

# Integration with other tools
alias man='tldr'         # Replace man with tldr (brave!)
alias help='tldr'        # Use tldr as help command

# Batch learning
for cmd in ls cd grep find; do
  echo "=== $cmd ==="
  tldr $cmd | head -20
done
```

---

