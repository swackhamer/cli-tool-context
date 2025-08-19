# CLI Tools Reference for Claude

## Overview
This comprehensive reference documents 312+ essential CLI tools for programming and system administration. Tools are organized by category with descriptions and practical examples.

**Total Tools Documented**: 312+ commands
**Coverage**: Programming, system administration, networking, security, cloud/containers, media processing, data analysis, and modern tool alternatives
**Organization**: 25+ categories with difficulty ratings (⭐⭐ to ⭐⭐⭐⭐⭐), cross-references, and safety warnings

---

## File & Directory Operations

### **ls** - List Directory Contents
**Description**: Lists directory contents with various formatting options
**Location**: `/bin/ls` (aliased to `ls -G`)
**Difficulty**: ⭐⭐ Beginner (Basic options) / ⭐⭐⭐ Intermediate (Advanced formatting)
**Common Use Cases**:
- Directory inspection and navigation
- File system exploration
- Checking file permissions and timestamps

**See Also**: `eza` (modern alternative with colors and Git integration), `tree` (directory tree view)

**Examples**:
```bash
# List files one per line
ls -1

# List all files including hidden
ls --all

# Long format with human-readable sizes
ls -l --human-readable

# List only directories
ls --directory */

# Sort by modification time (oldest first)
ls -lt --reverse
```

### **eza** - Modern ls Replacement
**Description**: A modern replacement for ls with colors, Git integration, and enhanced features
**Location**: `/opt/homebrew/bin/eza`
**Common Use Cases**:
- Enhanced directory listing with colors and icons
- Git repository status integration
- Tree view of directory structures

**See Also**: `ls` (traditional listing), `tree` (dedicated tree view), `fd` (modern find alternative)

**Examples**:
```bash
# List with icons and Git status
eza --long --header --icons --git

# Tree view three levels deep
eza --long --tree --level 3

# Don't list files in .gitignore
eza --git-ignore
```

### **tree** - Directory Tree Display
**Description**: Display directories as trees with optional color/HTML output
**Location**: `/opt/homebrew/bin/tree`
**Common Use Cases**:
- Visualize directory structure
- Document project layout
- Generate ASCII tree diagrams
- Explore file hierarchies

**See Also**: `ls` (basic listing), `eza` (modern listing with tree mode), `find` (search directories)

**Examples**:
```bash
# Display directory tree
tree

# Limit depth to 2 levels
tree -L 2

# Show hidden files
tree -a

# Display only directories
tree -d

# Show file sizes
tree -s

# Generate HTML output
tree -H http://localhost -o tree.html

# Show full path for each file
tree -f

# Sort files by modification time
tree -t

# Display tree with file type indicators
tree -F

# Exclude patterns (like .git directories)
tree -I "*.git|node_modules"

# Show tree with file permissions
tree -p

# Colorize output (if terminal supports it)
tree -C

# Display files with their last modification date
tree -D
```

### **find** - File Search
**Description**: Recursively search for files and directories based on various criteria
**Location**: `/usr/bin/find`
**Common Use Cases**:
- Locate files by name, type, size, or modification time
- Execute commands on found files
- Clean up temporary or old files

**See Also**: `fd` (modern, faster alternative), `locate` (indexed search), `grep` (content search)

**Examples**:
```bash
# Find files by extension
find /path -name '*.ext'

# Find and delete empty files
find /path -type f -empty -delete

# Find files modified today
find /path -daystart -mtime -1

# Execute command on found files
find /path -name '*.log' -exec gzip {} \;
```

### **fd** - Modern Find Alternative
**Description**: Fast, user-friendly alternative to find with regex support
**Location**: `/opt/homebrew/bin/fd`
**Common Use Cases**:
- Fast file searching with regex patterns
- Respects .gitignore by default
- Parallel execution for speed

**See Also**: `find` (traditional file search), `rg` (content search), `locate` (indexed search)

**Examples**:
```bash
# Find files matching pattern
fd "pattern"

# Include hidden and ignored files
fd --hidden --no-ignore "pattern"

# Execute command on results
fd "pattern" --exec command
```

### **grep** - Pattern Searching
**Description**: Search for patterns in files using regular expressions
**Location**: `/usr/bin/grep` (aliased with color and exclusions)
**Difficulty**: ⭐⭐ Beginner (Simple patterns) / ⭐⭐⭐⭐ Advanced (Complex regex)
**Common Use Cases**:
- Code search and analysis
- Log file analysis
- Text filtering and extraction

**See Also**: `rg` (ripgrep - faster alternative), `find` (file searching), `awk` (pattern processing)

**Examples**:
```bash
# Recursive search with line numbers
grep -rn "pattern" directory/

# Case-insensitive with context
grep -i -C 3 "pattern" file.txt

# Invert match (exclude lines)
grep -v "pattern" file.txt

# Multiple patterns with extended regex
grep -E "pattern1|pattern2" file.txt
```

### **rg (ripgrep)** - Fast Text Search
**Description**: Extremely fast recursive search tool that respects .gitignore
**Location**: `/opt/homebrew/bin/rg`
**Common Use Cases**:
- Fast code searching in large repositories
- Log analysis with intelligent filtering
- Content discovery with automatic exclusions

**See Also**: `grep` (traditional pattern search), `ag` (the silver searcher), `find` (file searching)

**Examples**:
```bash
# Search recursively in current directory
rg "pattern"

# Search with file type filtering
rg "pattern" --type js

# Show only file names with matches
rg --files-with-matches "pattern"
```

### **tree** - Directory Tree Display
**Description**: Display directory structure in tree format
**Location**: `/opt/homebrew/bin/tree`
**Common Use Cases**:
- Visualize project structure
- Document directory layouts
- Understand file hierarchies

**Examples**:
```bash
# Show tree with depth limit
tree -L 2

# Show directories only
tree -d

# Show with file sizes
tree -s -h
```

### **cp** - Copy Files and Directories
**Description**: Copy files and directories with various options for recursive copying, permissions, and safety
**Location**: `/bin/cp`
**Difficulty**: ⭐⭐ Beginner (Basic copying) / ⭐⭐⭐ Intermediate (Recursive & permissions)
**Common Use Cases**:
- Duplicate files and directories
- Backup operations
- File distribution and deployment

**Examples**:
```bash
# Copy single file
cp source.txt destination.txt

# Copy file to directory (keeps filename)
cp source.txt /path/to/directory/

# Copy multiple files to directory
cp file1.txt file2.txt /path/to/directory/

# Recursive directory copy
cp -r source_directory/ destination_directory/

# Interactive copy (prompt before overwrite)
cp -i source.txt destination.txt

# Preserve permissions and timestamps
cp -p source.txt destination.txt

# Verbose output showing copied files
cp -v source.txt destination.txt

# Copy with backup of existing files
cp --backup=numbered source.txt destination.txt
```

**Safety Notes**:
- Use `-i` for interactive mode to prevent accidental overwrites
- Use `-n` to never overwrite existing files
- Use `-u` to only copy when source is newer than destination

### **mv** - Move and Rename Files
**Description**: Move or rename files and directories
**Location**: `/bin/mv`
**Common Use Cases**:
- File and directory renaming
- Organizing file systems
- Moving files between directories

⚠️ **SAFETY WARNING**:
- **`mv` can OVERWRITE existing files** without warning by default
- **Moves are immediate and permanent** - no undo functionality
- **Always verify destination paths** before moving important files
- **Use `mv -i` for interactive confirmation** before overwrites
- **Use `mv -n` to prevent overwriting** existing files entirely

**Safe Usage Tips**:
- Check if destination exists: `ls destination.txt` before moving
- Use interactive mode: `alias mv='mv -i'` for safety
- Backup important files before bulk operations
- Use `-i` to prompt before overwriting existing files
- Use `-n` to prevent overwriting existing files entirely
- Consider backups before bulk move operations

**Examples**:
```bash
# Rename file or directory
mv old_name.txt new_name.txt

# Move file to directory
mv file.txt /path/to/directory/

# Move multiple files to directory
mv file1.txt file2.txt file3.txt /path/to/directory/

# Interactive move (prompt before overwrite)
mv -i source.txt destination.txt

# Never overwrite existing files
mv -n source.txt destination.txt

# Verbose output
mv -v old_name.txt new_name.txt

# Force overwrite without prompting
mv -f source.txt destination.txt
```

**Safety Notes**:
- CRITICAL: `mv` permanently moves/renames files - use with caution
- Use `-i` to prompt before overwriting existing files
- Use `-n` to prevent overwriting existing files entirely
- Consider backups before bulk move operations

### **rm** - Remove Files and Directories
**Description**: Remove (delete) files and directories
**Location**: `/bin/rm`
**Common Use Cases**:
- File cleanup and deletion
- Directory removal
- System maintenance

⚠️ **CRITICAL SAFETY WARNING**:
- **`rm` is DESTRUCTIVE and PERMANENT** - deleted files cannot be recovered easily
- **NEVER use `rm -rf /`** - this will delete your entire system
- **Always double-check paths** before running rm commands
- **Use `rm -i` for interactive confirmation** when uncertain
- **Consider using trash/bin utilities** for recoverable deletion
- **Test with `ls` first** to verify what will be deleted

**Safe Usage Tips**:
- Create aliases: `alias rm='rm -i'` for interactive mode
- Use `ls` to verify target files: `ls file.txt && rm file.txt`
- For large deletions, use `find` with `-print` first to preview
- Keep backups of important data before bulk deletions

**Examples**:
```bash
# Remove single file
rm file.txt

# Remove multiple files
rm file1.txt file2.txt file3.txt

# Interactive removal (prompt for each file)
rm -i file.txt

# Force removal without prompts
rm -f file.txt

# Remove directories recursively
rm -r directory/

# Remove directory contents recursively with force
rm -rf directory/

# Verbose output showing deleted files
rm -v file.txt

# Remove files matching pattern
rm *.tmp
```

**DANGER WARNINGS**:
- **EXTREMELY DESTRUCTIVE**: `rm` permanently deletes files - NO RECOVERY
- **NEVER run `rm -rf /` or similar system paths**
- Use `-i` for interactive confirmation on important files
- Consider `trash` command as safer alternative for user files
- Test with `ls` first: `ls *.tmp` before `rm *.tmp`
- Double-check paths, especially with wildcards

### **cat** - Display and Concatenate Files
**Description**: Display file contents, concatenate multiple files, and create files from input
**Location**: `/bin/cat`
**Common Use Cases**:
- View file contents
- Combine multiple files
- Create files from command input
- Pipe file contents to other commands

**See Also**: `bat` (syntax highlighting), `less` (paginated viewing), `head` (first lines), `tail` (last lines)

**Examples**:
```bash
# Display file contents
cat file.txt

# Display multiple files
cat file1.txt file2.txt

# Concatenate files into new file
cat file1.txt file2.txt > combined.txt

# Append files to existing file
cat file1.txt file2.txt >> existing.txt

# Display with line numbers
cat -n file.txt

# Display with line numbers (non-blank lines only)
cat -b file.txt

# Show non-printing characters
cat -v file.txt

# Create file from stdin (Ctrl+D to end)
cat > newfile.txt

# Copy file contents
cat source.txt > destination.txt
```

### **bat** - Enhanced Cat with Syntax Highlighting
**Description**: A cat clone with syntax highlighting, Git integration, and automatic paging
**Location**: `/opt/homebrew/bin/bat`
**Common Use Cases**:
- View source code with syntax highlighting
- Pretty-print files with line numbers
- Git diff visualization
- Modern alternative to cat and less

**See Also**: `cat` (basic file display), `less` (paging), `head` (first lines), `tail` (last lines)

**Examples**:
```bash
# Display file with syntax highlighting
bat file.py

# Show line numbers
bat --number file.txt

# Display specific line range
bat --line-range 40:60 file.py

# Show only differences in Git repo
bat --diff

# Set theme
bat --theme="Monokai Extended" file.py

# List available themes
bat --list-themes

# Display multiple files
bat file1.py file2.js

# Use as pager for other commands
tail -f /var/log/system.log | bat --paging=never -l log

# Show non-printable characters
bat --show-all file.txt

# Disable decorations (plain output)
bat --style=plain file.txt
```

### **less** - Terminal Pager
**Description**: Terminal pager program for viewing text files one screen at a time
**Location**: `/usr/bin/less`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:
- View large files without loading entire content
- Search within files interactively
- Navigate logs and documentation
- Pipe command output for paginated viewing

**See Also**: `more` (simpler pager), `bat` (modern alternative), `head`, `tail`

**Examples**:
```bash
# Basic file viewing
less file.txt

# View with line numbers
less -N file.txt

# Follow file updates (like tail -f)
less +F /var/log/system.log

# Search forward for pattern (press / then type)
less file.txt
# Then type: /search_term

# Search backward (press ? then type)
less file.txt
# Then type: ?search_term

# Jump to line 100
less +100 file.txt

# View multiple files
less file1.txt file2.txt
# Use :n for next, :p for previous

# Pipe command output
ls -la | less
ps aux | less

# View compressed files
less file.gz

# Key commands while in less:
# q          - quit
# g          - go to beginning
# G          - go to end
# /pattern   - search forward
# ?pattern   - search backward
# n          - next match
# N          - previous match
# Space      - next page
# b          - previous page
# h          - help
```

### **more** - Simple Pager
**Description**: Filter for paging through text one screenful at a time
**Location**: `/usr/bin/more`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:
- Basic file viewing
- Simple text pagination
- Quick file preview
- Legacy script compatibility

**See Also**: `less` (more features), `bat` (modern alternative), `cat`

**Examples**:
```bash
# Basic usage
more file.txt

# Display percentage through file
more -d file.txt

# Start at line 20
more +20 file.txt

# Squeeze multiple blank lines
more -s file.txt

# Pipe output through more
dmesg | more
cat large_file.txt | more

# Key commands in more:
# Space      - next page
# Enter      - next line
# q          - quit
# /pattern   - search
# h          - help
# =          - show line number
```

### **mkdir** - Create Directories
**Description**: Create directories with specified permissions
**Location**: `/bin/mkdir`
**Common Use Cases**:
- Directory structure creation
- Project setup
- File organization

**Examples**:
```bash
# Create single directory
mkdir new_directory

# Create multiple directories
mkdir dir1 dir2 dir3

# Create parent directories as needed
mkdir -p path/to/nested/directory

# Create with specific permissions
mkdir -m 755 directory

# Create with verbose output
mkdir -v new_directory

# Create nested structure
mkdir -p project/{src,docs,tests}

# Create with timestamp
mkdir "backup_$(date +%Y%m%d)"
```

### **mkfifo** - Create Named Pipes (FIFOs)
**Description**: Create named pipes (FIFOs) for inter-process communication
**Location**: `/usr/bin/mkfifo`
**Common Use Cases**:
- Inter-process communication
- Data pipeline creation
- Process synchronization
- Streaming data between commands

**Examples**:
```bash
# Create a named pipe
mkfifo mypipe

# Create with specific permissions
mkfifo -m 644 datapipe

# Create multiple pipes
mkfifo pipe1 pipe2 pipe3

# Use pipe for communication (in one terminal)
cat > mypipe

# Read from pipe (in another terminal)
cat < mypipe

# Process data through pipe
mkfifo /tmp/logpipe
tail -f /var/log/system.log > /tmp/logpipe &
grep ERROR < /tmp/logpipe

# Compress data stream
mkfifo /tmp/compress_pipe
gzip < /tmp/compress_pipe > output.gz &
cat large_file.txt > /tmp/compress_pipe

# Cleanup pipes after use
rm mypipe
```

### **rmdir** - Remove Empty Directories
**Description**: Remove empty directories safely
**Location**: `/bin/rmdir`
**Common Use Cases**:
- Clean up empty directories
- Safe directory removal
- Directory structure maintenance

**Examples**:
```bash
# Remove empty directory
rmdir empty_directory

# Remove multiple empty directories
rmdir dir1 dir2 dir3

# Remove parent directories if they become empty
rmdir -p path/to/nested/directory

# Verbose output
rmdir -v empty_directory

# Remove all empty subdirectories
rmdir */
```

**Safety Notes**:
- Only removes empty directories (safer than `rm -r`)
- Will fail if directory contains files (prevents accidental data loss)
- Use `rm -r` only when you need to remove non-empty directories

### **ln** - Create Links
**Description**: Create hard and symbolic links between files
**Location**: `/bin/ln`
**Common Use Cases**:
- Create file shortcuts (symbolic links)
- Share files without duplication (hard links)
- Configuration management
- Path abstraction

**Examples**:
```bash
# Create symbolic link (most common)
ln -s /path/to/original /path/to/link

# Create hard link
ln /path/to/original /path/to/hardlink

# Force creation (overwrite existing link)
ln -sf /new/path/to/original /path/to/link

# Create symbolic link in current directory
ln -s /long/path/to/file.txt shortcut.txt

# Link directory (symbolic only)
ln -s /path/to/directory link_to_dir

# Create relative symbolic link
ln -s ../config/settings.conf current_settings.conf
```

**Key Differences**:
- **Symbolic links**: Point to path (can cross filesystems, can break if target moves)
- **Hard links**: Point to file data (same filesystem only, survive target deletion)

### **touch** - Create/Update File Timestamps
**Description**: Create empty files or update file access and modification times
**Location**: `/usr/bin/touch`
**Common Use Cases**:
- Create empty files quickly
- Update file timestamps
- File existence testing
- Build system triggers

**Examples**:
```bash
# Create empty file
touch newfile.txt

# Create multiple files
touch file1.txt file2.txt file3.txt

# Update existing file timestamp to current time
touch existing_file.txt

# Set specific timestamp
touch -t 202401150930.45 file.txt

# Use another file's timestamp as reference
touch -r reference_file.txt target_file.txt

# Update only access time
touch -a file.txt

# Update only modification time
touch -m file.txt

# Don't create file if it doesn't exist
touch -c file.txt

# Create files with sequence
touch file{01..10}.txt
```

### **file** - Determine File Type
**Description**: Analyze files and determine their type and format
**Location**: `/usr/bin/file`
**Common Use Cases**:
- Identify unknown file types
- Verify file formats
- Security analysis
- Data recovery operations

**Examples**:
```bash
# Identify file type
file document.pdf

# Check multiple files
file *.txt

# Get MIME type
file --mime document.pdf

# Brief output (type only)
file -b image.jpg

# Examine compressed files
file -z archive.tar.gz

# Follow symbolic links
file -L symlink

# Check special/device files
file --special-files /dev/null

# Output MIME encoding
file --mime-encoding text_file.txt
```

### **stat** - File Statistics and Information
**Description**: Display detailed file and filesystem status information
**Location**: `/usr/bin/stat`
**Common Use Cases**:
- File permission analysis
- Timestamp examination
- Inode information
- File system debugging

**Examples**:
```bash
# Show all file information
stat file.txt

# Verbose format (Linux-style output)
stat -x file.txt

# Show only file permissions (octal)
stat -f "%Mp%Lp" file.txt

# Show owner and group
stat -f "%Su %Sg" file.txt

# Show file size
stat -f "%z" file.txt

# Show access time
stat -f "%Sa" file.txt

# Show modification time
stat -f "%Sm" file.txt

# Custom format string
stat -f "Size: %z bytes, Type: %HT" file.txt
```

### **basename/dirname** - Path Manipulation
**Description**: Extract filename or directory portions from file paths
**Location**: `/usr/bin/basename`, `/usr/bin/dirname`
**Common Use Cases**:
- Script path processing
- Filename extraction
- Directory navigation
- Build system automation

**Examples**:
```bash
# Extract filename from path
basename /path/to/file.txt
# Output: file.txt

# Extract filename without extension
basename /path/to/file.txt .txt
# Output: file

# Extract directory portion
dirname /path/to/file.txt
# Output: /path/to

# Process multiple paths
dirname /path/to/file1.txt /path/to/file2.txt

# Common usage in scripts
SCRIPT_DIR="$(dirname "$0")"
SCRIPT_NAME="$(basename "$0")"

# Extract parent directory name
basename "$(dirname /path/to/file.txt)"
# Output: to

# Use with variables
filepath="/var/log/system.log"
filename=$(basename "$filepath")
directory=$(dirname "$filepath")
```

---

## Text Processing & Manipulation

### **sed** - Stream Editor
**Description**: Non-interactive stream editor for text transformation
**Location**: `/usr/bin/sed`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic substitutions) / ⭐⭐⭐⭐⭐ Expert (Complex scripts)
**Common Use Cases**:
- Find and replace operations
- Text transformation in pipelines
- Configuration file editing

**See Also**: `awk` (pattern processing), `tr` (character translation), `grep` (pattern search), `perl` (advanced regex)

**Examples**:
```bash
# Replace all occurrences
sed 's/old/new/g' file.txt

# Edit file in-place with backup
sed -i.bak 's/old/new/g' file.txt

# Delete lines matching pattern
sed '/pattern/d' file.txt

# Print specific line range
sed -n '1,10p' file.txt
```

### **sd** - Intuitive Find & Replace
**Description**: An intuitive find & replace CLI, a simpler alternative to sed for common tasks
**Location**: `/opt/homebrew/bin/sd`
**Difficulty**: ⭐⭐ Beginner (Simple syntax) / ⭐⭐⭐ Intermediate (Regex and advanced features)
**Common Use Cases**:
- Simple find and replace operations
- Text transformation with intuitive syntax  
- Modern alternative to sed for basic tasks
- Batch file editing with regex support

**See Also**: `sed` (powerful stream editor), `perl` (advanced text processing), `rg` (search)

**Examples**:
```bash
# Basic find and replace
sd "old_text" "new_text" file.txt            # Replace in file
sd "old_text" "new_text"                      # Replace from stdin (pipe)
echo "hello world" | sd "world" "universe"   # Pipe usage

# In-place editing
sd -i "old_text" "new_text" file.txt         # Edit file in-place (like sed -i)
sd -i "TODO" "DONE" *.md                     # Replace in multiple files

# Regular expressions
sd '\d+' '0' file.txt                        # Replace all digits with 0
sd '(\w+)@(\w+)' 'user at $2' emails.txt     # Regex with capture groups
sd '\s+' ' ' file.txt                        # Replace multiple whitespace with single space

# Case-insensitive matching
sd -f i "hello" "hi" file.txt                # Case-insensitive flag (-f i)
sd -f m '^line' 'LINE' file.txt              # Multi-line mode (-f m)

# Preview mode (dry run)
sd --preview "old" "new" file.txt            # Show what would change without modifying
sd -p "old" "new" file.txt                   # Short form of preview

# Working with directories
find . -name "*.txt" -exec sd -i "old" "new" {} \;  # Replace in all .txt files
sd -i "old_function" "new_function" src/**/*.js     # Replace in JS files

# String literals (no regex)
sd -s "literal.text" "replacement" file.txt  # Treat pattern as literal string (-s)

# Advanced regex features
sd '(?P<name>\w+)' 'Hello $name' file.txt     # Named capture groups
sd '\b(\w+)\b' '[$1]' file.txt               # Word boundaries
sd '^(.*)$' '> $1' file.txt                  # Add prefix to each line

# Compare with sed equivalent
sd "old" "new" file.txt                       # Simple and readable
sed 's/old/new/g' file.txt                   # Traditional sed syntax
```

### **awk** - Pattern Processing Language
**Description**: Versatile programming language for text processing
**Location**: `/usr/bin/awk`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic field processing) / ⭐⭐⭐⭐⭐ Expert (Programming constructs)
**Common Use Cases**:
- Field-based data processing
- Mathematical operations on data
- Complex text analysis and reporting

**See Also**: `sed` (stream editing), `cut` (column extraction), `grep` (pattern matching), `sort` (sorting)

**Examples**:
```bash
# Print specific column
awk '{print $5}' file.txt

# Sum values in column
awk '{sum+=$1} END {print sum}' file.txt

# Process CSV with custom separator
awk -F',' '{print $NF}' file.csv

# Conditional processing
awk '$1 > 100 {print $0}' file.txt
```

### **cut** - Extract Fields
**Description**: Extract specific columns or character ranges from text
**Location**: `/usr/bin/cut`
**Common Use Cases**:
- Extract specific fields from delimited data
- Process CSV files
- Character-based text extraction

**Examples**:
```bash
# Extract characters 1-10
cut -c 1-10 file.txt

# Extract fields using delimiter
cut -d',' -f 1,3 file.csv

# Extract from character position to end
cut -c 5- file.txt
```

### **sort** - Sort Text Lines
**Description**: Sort lines of text files with various options
**Location**: `/usr/bin/sort`
**Common Use Cases**:
- Data organization and deduplication
- Preparing data for further processing
- Numerical and alphabetical sorting

**Examples**:
```bash
# Numerical sort
sort -n file.txt

# Sort by specific field
sort -k 2,2n file.txt

# Remove duplicates while sorting
sort -u file.txt

# Reverse sort
sort -r file.txt
```

### **uniq** - Filter Unique Lines
**Description**: Report or filter out repeated lines
**Location**: `/usr/bin/uniq`
**Common Use Cases**:
- Remove duplicate lines
- Count occurrences
- Data deduplication

**Examples**:
```bash
# Remove duplicates (requires sorted input)
sort file.txt | uniq

# Count occurrences
sort file.txt | uniq -c

# Show only unique lines
sort file.txt | uniq -u
```

### **wc** - Word, Line, Character Count
**Description**: Count lines, words, and characters in files
**Location**: `/usr/bin/wc`
**Common Use Cases**:
- Text analysis and statistics
- File size estimation
- Data quantification

**Examples**:
```bash
# Count lines
wc -l file.txt

# Count words
wc -w file.txt

# Count characters
wc -c file.txt
```

### **head** and **tail** - File Portions
**Description**: Display first (head) or last (tail) parts of files
**Location**: `/usr/bin/head`, `/usr/bin/tail`
**Common Use Cases**:
- Sample large files
- Monitor log files
- Extract file portions

**Examples**:
```bash
# Show first 20 lines
head -n 20 file.txt

# Show last 10 lines
tail -n 10 file.txt

# Follow file changes (log monitoring)
tail -f logfile.txt

# Show from line 100 to end
tail -n +100 file.txt
```

### **tr** - Translate Characters
**Description**: Translate or delete characters from standard input
**Location**: `/usr/bin/tr`
**Common Use Cases**:
- Character set conversion and translation
- Case conversion operations
- Character deletion and replacement
- Data sanitization and cleaning

**Examples**:
```bash
# Convert lowercase to uppercase
echo "hello world" | tr 'a-z' 'A-Z'

# Replace spaces with underscores
echo "hello world" | tr ' ' '_'

# Delete specific characters
echo "hello123world" | tr -d '0-9'

# Squeeze repeated characters
echo "hello    world" | tr -s ' '

# Convert Windows line endings to Unix
tr -d '\r' < windows_file.txt > unix_file.txt

# ROT13 encoding
echo "secret message" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

### **expand** - Convert Tabs to Spaces
**Description**: Convert tabs to spaces in text files
**Location**: `/usr/bin/expand`
**Common Use Cases**:
- Code formatting standardization
- Tab-to-space conversion
- Text file processing
- Whitespace normalization

**Examples**:
```bash
# Convert tabs to spaces (default 8 spaces per tab)
expand file.txt

# Specify custom tab width
expand -t 4 file.txt

# Convert only initial tabs
expand -i file.txt

# Convert multiple files
expand *.c > formatted_output.txt

# Process stdin
cat file_with_tabs.txt | expand -t 2

# Combine with other text tools
expand -t 4 source.py | grep -n "def "
```

### **unexpand** - Convert Spaces to Tabs
**Description**: Convert spaces to tabs in text files
**Location**: `/usr/bin/unexpand`
**Common Use Cases**:
- Code compression and consistency
- Space-to-tab conversion
- File size reduction
- Editor configuration matching

**Examples**:
```bash
# Convert spaces to tabs (default 8 spaces = 1 tab)
unexpand file.txt

# Specify custom tab width  
unexpand -t 4 file.txt

# Convert only initial spaces
unexpand --first-only file.txt

# Convert all runs of 2+ spaces
unexpand -a file.txt

# Process multiple files
unexpand -t 2 *.py

# Pipeline processing
cat spaced_file.txt | unexpand -t 4 > tabbed_file.txt
```

### **comm** - Compare Sorted Files
**Description**: Select or reject lines common to two sorted files
**Location**: `/usr/bin/comm`
**Common Use Cases**:
- File comparison and difference analysis
- Set operations on sorted data
- Finding unique and common elements
- Data deduplication across files

**Examples**:
```bash
# Show three columns: unique to file1, unique to file2, common
comm file1.txt file2.txt

# Show only lines unique to first file
comm -23 file1.txt file2.txt

# Show only lines common to both files
comm -12 file1.txt file2.txt

# Show only lines unique to second file
comm -13 file1.txt file2.txt

# Compare command outputs
comm <(sort file1.txt) <(sort file2.txt)
```

### **join** - Join Lines from Files
**Description**: Relational database-style join operation on sorted files
**Location**: `/usr/bin/join`
**Common Use Cases**:
- Database-style joins on text files
- Combining related data from multiple sources
- Data merging and correlation
- Creating reports from normalized data

**Examples**:
```bash
# Join on first field (default)
join users.txt roles.txt

# Join on specific fields
join -1 2 -2 1 file1.txt file2.txt

# Use custom field separator
join -t',' users.csv departments.csv

# Left join (include unmatched from first file)
join -a 1 file1.txt file2.txt

# Specify output format
join -o 1.1,1.2,2.3 file1.txt file2.txt

# Case-insensitive join
join -i file1.txt file2.txt
```

### **paste** - Merge Lines
**Description**: Merge corresponding or subsequent lines of files
**Location**: `/usr/bin/paste`
**Common Use Cases**:
- Combining columns from multiple files
- Creating tabular data from separate sources
- Parallel processing of multiple data streams
- Building CSV-like formats

**Examples**:
```bash
# Merge files side by side with tabs
paste file1.txt file2.txt

# Use custom delimiter
paste -d',' file1.txt file2.txt

# Merge multiple files
paste file1.txt file2.txt file3.txt

# Serial paste (all lines from file1, then file2)
paste -s file1.txt file2.txt

# Create columns from single file
paste -d' ' - - - < data.txt

# Transpose rows to columns
paste -s -d',' file.txt
```

### **column** - Format in Columns
**Description**: Columnate lists and format data in aligned columns
**Location**: `/opt/homebrew/opt/util-linux/bin/column`
**Common Use Cases**:
- Formatting tabular data for display
- Aligning text in columns
- Creating readable reports from delimited data
- Pretty-printing structured text

**Examples**:
```bash
# Auto-format into columns
echo -e "apple pie\nbanana bread\ncherry tart" | column -t

# Specify separator for input
column -t -s',' file.csv

# Fill columns before rows
column -c 80 list.txt

# Create table with specific separator
column -t -s':' /etc/passwd

# JSON-like output formatting
column -t -N NAME,SIZE,TYPE file_list.txt

# Right-align columns
column -t -R 2,3 data.txt
```

### **expand/unexpand** - Tabs and Spaces
**Description**: Convert tabs to spaces (expand) and spaces to tabs (unexpand)
**Location**: `/usr/bin/expand`, `/usr/bin/unexpand`
**Common Use Cases**:
- Code formatting and standardization
- Preparing files for processing
- Converting between tab and space indentation
- File format normalization

**Examples**:
```bash
# Convert tabs to spaces (default 8)
expand file.txt

# Convert tabs to 4 spaces
expand -t 4 file.txt

# Convert multiple tab stops
expand -t 4,8,12 file.txt

# Convert spaces back to tabs
unexpand -a file.txt

# Convert only leading spaces
unexpand file.txt

# Pipeline usage
cat source.c | expand -t 4 > formatted.c
```

### **fold** - Wrap Lines
**Description**: Wrap long lines to fit specified width
**Location**: `/usr/bin/fold`
**Common Use Cases**:
- Text formatting for display or printing
- Preparing text for fixed-width displays
- Email and document formatting
- Breaking long lines for readability

**Examples**:
```bash
# Wrap at 80 characters (default)
fold long_text.txt

# Wrap at specific width
fold -w 60 file.txt

# Break at word boundaries
fold -s -w 70 file.txt

# Count width in bytes rather than columns
fold -b -w 100 file.txt

# Format for email
fold -s -w 72 message.txt

# Prepare for terminal display
cat article.txt | fold -s -w $(tput cols)
```

### **fmt** - Format Text
**Description**: Simple text formatter with word wrapping and paragraph formatting
**Location**: `/usr/bin/fmt`
**Common Use Cases**:
- Text formatting and reflowing
- Paragraph reformatting
- Preparing text for publication
- Standardizing text layout

**Examples**:
```bash
# Format to default width (65 characters)
fmt file.txt

# Format to specific width
fmt -w 80 file.txt

# Format with different goal and maximum
fmt 70 80 file.txt

# Crown margin (preserve first line indent)
fmt -c file.txt

# Split lines only, don't join short lines
fmt -s file.txt

# Format email or code comments
fmt -w 72 message.txt
```

### **nl** - Number Lines
**Description**: Number lines in files with configurable formatting
**Location**: `/usr/bin/nl`
**Common Use Cases**:
- Adding line numbers to files
- Code listing preparation
- Document formatting
- Creating numbered references

**Examples**:
```bash
# Number all lines
nl file.txt

# Number only non-empty lines
nl -b t file.txt

# Use different number format
nl -n rz -w 3 file.txt

# Start numbering from specific value
nl -v 100 file.txt

# Use different separator
nl -s '. ' file.txt

# Number with custom increment
nl -i 5 file.txt

# Number specific sections
nl -b p'^Chapter' book.txt
```

### **rev** - Reverse Lines
**Description**: Reverse the order of characters in each line
**Location**: `/opt/homebrew/opt/util-linux/bin/rev`
**Common Use Cases**:
- Text manipulation and transformation
- Creating puzzles or encoded text
- Data processing and analysis
- String reversal operations

**Examples**:
```bash
# Reverse characters in each line
echo "hello world" | rev

# Reverse multiple lines
rev file.txt

# Reverse and process
cat names.txt | rev | sort | rev

# Create mirror text
echo "stressed" | rev  # outputs: desserts

# Pipeline with other tools
cat log.txt | grep "ERROR" | rev | cut -d' ' -f1 | rev
```

### **split** - Split Files
**Description**: Split large files into smaller pieces
**Location**: `/usr/bin/split`
**Common Use Cases**:
- Breaking large files for processing
- Creating manageable file sizes
- Preparing files for transfer or storage
- Parallel processing preparation

**Examples**:
```bash
# Split by lines (default 1000)
split large_file.txt

# Split into specific line counts
split -l 500 data.txt chunk_

# Split by size
split -b 1M bigfile.dat part_

# Split into specific number of files
split -n 5 data.txt section_

# Split with custom suffix length
split -a 3 -l 1000 data.txt part_

# Split and preserve file extension
split -d -l 1000 data.csv data_split_.csv
```

### **csplit** - Context Split
**Description**: Split files based on context patterns
**Location**: `/usr/bin/csplit`
**Common Use Cases**:
- Splitting files by content patterns
- Extracting sections from structured documents
- Processing multi-part files
- Separating data by markers or delimiters

**Examples**:
```bash
# Split on pattern
csplit file.txt '/^Chapter/'

# Split and keep files on error
csplit -k file.txt '/^Section/' '{*}'

# Split with custom prefix
csplit -f part_ file.txt '/^---/'

# Split and suppress byte counts
csplit -s file.txt '/^BEGIN/' '/^END/'

# Split log files by date
csplit server.log '/^2024-/' '{*}'

# Extract function definitions
csplit code.c '/^function/' '{*}'
```

### **Advanced Text Processing Pipelines**

These tools are most powerful when combined in pipelines for complex text processing tasks:

**Data Processing Examples**:
```bash
# Extract and analyze CSV data
cut -d',' -f2,3 data.csv | tr '[:upper:]' '[:lower:]' | sort | uniq -c

# Create aligned reports from multiple files
paste users.txt departments.txt | column -t | nl -s ': '

# Process log files with formatting
grep "ERROR" system.log | cut -d' ' -f1-3,5- | fold -s -w 80 | nl

# Compare and merge sorted datasets
comm -3 <(sort file1.txt) <(sort file2.txt) | tr '\t' ',' > differences.csv

# Format code with consistent indentation
expand -t 4 source.c | fold -s -w 120 | unexpand -t 4 > formatted.c

# Create numbered documentation from sections
csplit manual.txt '/^#/' && for f in xx*; do nl -s'. ' "$f" > "section_$f.txt"; done

# Process data with transformations and joins
join -t',' <(sort -t',' -k1 users.csv) <(sort -t',' -k1 roles.csv) | \
  tr ',' '\t' | column -t | head -20
```

**Text Analysis Pipelines**:
```bash
# Analyze word frequency with cleanup
tr '[:space:][:punct:]' '\n' < document.txt | \
  tr '[:upper:]' '[:lower:]' | \
  grep -v '^$' | \
  sort | uniq -c | sort -nr | head -20

# Create reverse indexes
nl -s': ' document.txt | \
  tr '[:upper:]' '[:lower:]' | \
  tr -s '[:space:][:punct:]' '\n' | \
  paste -d'|' - - | \
  sort -k2

# Process structured data extraction
grep "^Date:" emails.txt | \
  cut -d' ' -f2- | \
  tr '/' '-' | \
  sort | uniq -c | \
  column -t

# Format configuration files
expand config.ini | \
  grep -v '^#' | \
  cut -d'=' -f1,2 | \
  column -t -s'=' | \
  nl -s') '
```

### **column** - Column Formatting
**Description**: Format input into columns
**Location**: `/opt/homebrew/opt/util-linux/bin/column`
**Common Use Cases**:
- Table formatting
- Data alignment
- Report generation
- CSV processing

**See Also**: `pr` (print formatting), `fmt` (text formatting), `awk` (data processing)

**Examples**:
```bash
# Auto-detect columns
column -t file.txt

# Specify delimiter
column -t -s ',' file.csv

# Output delimiter
column -t -s ',' -o ' | ' file.csv

# Align right
column -t -R 2,3 file.txt

# JSON output
column -t -J file.txt

# Fill columns
column -c 80 file.txt

# Input from pipe
ps aux | column -t
```

### **pr** - Print Formatting
**Description**: Convert text files for printing
**Location**: `/usr/bin/pr`
**Common Use Cases**:
- Page formatting
- Multi-column layout
- Header/footer addition
- Print preparation

**See Also**: `column` (column formatting), `fmt` (text wrapping)

**Examples**:
```bash
# Add page headers
pr filename

# Multi-column output
pr -2 filename

# Custom header
pr -h "Custom Header" filename

# Line numbering
pr -n filename

# Page length
pr -l 60 filename

# No header
pr -t filename

# Tab replacement
pr -e filename

# Double spacing
pr -d filename
```

### **fold** - Line Wrapping
**Description**: Wrap lines to specified width
**Location**: `/usr/bin/fold`
**Common Use Cases**:
- Text wrapping
- Line length control
- Email formatting
- Terminal output fitting

**See Also**: `fmt` (text formatting), `pr` (print formatting)

**Examples**:
```bash
# Wrap at 80 characters
fold -w 80 file.txt

# Break at spaces
fold -s -w 80 file.txt

# Wrap at bytes
fold -b -w 80 file.txt

# Wrap stdin
echo "very long line of text" | fold -w 10

# Multiple files
fold -w 72 *.txt
```

### **fmt** - Text Formatting
**Description**: Simple text formatter
**Location**: `/usr/bin/fmt`
**Common Use Cases**:
- Paragraph formatting
- Text reflowing
- Email composition
- Document preparation

**See Also**: `fold` (line wrapping), `pr` (print formatting)

**Examples**:
```bash
# Format paragraphs
fmt file.txt

# Specific width
fmt -w 72 file.txt

# Preserve indentation
fmt -s file.txt

# Uniform spacing
fmt -u file.txt

# Crown margin
fmt -c file.txt

# Tagged paragraphs
fmt -t file.txt
```

### **nl** - Line Numbering
**Description**: Number lines of files
**Location**: `/usr/bin/nl`
**Common Use Cases**:
- Code listing
- Line reference
- Document numbering
- Error reporting

**See Also**: `cat -n` (simple numbering), `pr -n` (print numbering)

**Examples**:
```bash
# Number all lines
nl file.txt

# Number only non-empty lines
nl -b t file.txt

# Custom format
nl -n rz -w 4 file.txt

# Different increment
nl -i 2 file.txt

# Section numbering
nl -s '. ' file.txt

# Right justified
nl -n rn file.txt

# Leading zeros
nl -n rz file.txt
```

### **split** - File Splitting
**Description**: Split files into pieces
**Location**: `/usr/bin/split`
**Common Use Cases**:
- Large file handling
- Batch processing
- File size management
- Archive preparation

**See Also**: `csplit` (context splitting), `cut` (column extraction)

**Examples**:
```bash
# Split by lines (default 1000)
split file.txt

# Split by specific line count
split -l 500 file.txt part_

# Split by size
split -b 10M file.txt chunk_

# Split by kilobytes
split -b 1024 file.txt

# Numeric suffixes
split -d -l 100 file.txt part_

# Custom suffix length
split -a 3 -l 100 file.txt

# Verbose output
split -l 1000 --verbose file.txt
```

### **join** - Join Lines
**Description**: Join lines of two files on a common field
**Location**: `/usr/bin/join`
**Common Use Cases**:
- Database-like joins
- Data merging
- Report combination
- Table operations

**See Also**: `comm` (line comparison), `paste` (side-by-side merge), `sort` (sorting)

**Examples**:
```bash
# Join on first field (files must be sorted)
join file1.txt file2.txt

# Join on specific field
join -1 2 -2 1 file1.txt file2.txt

# Custom delimiter
join -t ',' file1.csv file2.csv

# Left outer join
join -a 1 file1.txt file2.txt

# Full outer join
join -a 1 -a 2 file1.txt file2.txt

# Ignore case
join -i file1.txt file2.txt

# Custom output format
join -o 1.1,2.2,1.3 file1.txt file2.txt
```

### **comm** - Compare Lines
**Description**: Compare two sorted files line by line
**Location**: `/usr/bin/comm`
**Common Use Cases**:
- File comparison
- Set operations
- Difference analysis
- Data validation

**See Also**: `diff` (detailed comparison), `join` (line joining), `sort` (sorting)

**Examples**:
```bash
# Compare files (3 columns: unique to file1, unique to file2, common)
comm file1.txt file2.txt

# Show only unique to file1
comm -23 file1.txt file2.txt

# Show only unique to file2
comm -13 file1.txt file2.txt

# Show only common lines
comm -12 file1.txt file2.txt

# Check if files are identical
comm -3 file1.txt file2.txt | wc -l

# Case insensitive (sort first)
sort -f file1.txt > temp1
sort -f file2.txt > temp2
comm temp1 temp2
```

### **tee** - Split Output
**Description**: Read from input and write to output and files
**Location**: `/usr/bin/tee`
**Common Use Cases**:
- Duplicate output streams
- Log command output while displaying
- Pipeline branching
- Debugging pipelines

**See Also**: `cat` (display files), `split` (split files), `> >()` (process substitution)

**Examples**:
```bash
# Display output and save to file
ls -la | tee output.txt

# Append to file instead of overwriting
ls -la | tee -a log.txt

# Multiple output files
ps aux | tee proc1.txt proc2.txt

# Use in long pipelines
cat data.txt | grep pattern | tee intermediate.txt | sort

# Combine with other commands
make 2>&1 | tee build.log

# Save error output separately
command 2>&1 | tee output.log

# Interactive use with confirmation
echo "Are you sure? (y/n)" | tee /dev/stderr
```

### **paste** - Merge Lines
**Description**: Merge lines of files side by side
**Location**: `/usr/bin/paste`
**Common Use Cases**:
- Combine data from multiple files
- Create columns from separate sources
- Data merging and formatting
- Report generation

**See Also**: `join` (database-like joins), `column` (column formatting), `cat` (concatenate)

**Examples**:
```bash
# Merge files side by side
paste file1.txt file2.txt

# Custom delimiter
paste -d ',' file1.txt file2.txt

# Merge all lines into one line
paste -s file.txt

# Custom separator for serial mode
paste -s -d ',' file.txt

# Multiple files with custom delimiter
paste -d ':|' file1.txt file2.txt file3.txt

# Read from stdin
echo -e "a\nb\nc" | paste - file.txt

# Transpose data (rows to columns)
paste -s file.txt
```

### **rev** - Reverse Lines
**Description**: Reverse lines characterwise
**Location**: `/opt/homebrew/opt/util-linux/bin/rev`
**Common Use Cases**:
- Text manipulation
- Data transformation
- String reversal
- Text puzzles and games

**See Also**: `tac` (reverse line order), `sort -r` (reverse sort), `tr` (character translation)

**Examples**:
```bash
# Reverse each line
rev file.txt

# Reverse stdin
echo "hello world" | rev

# Use in pipeline
cat file.txt | rev | sort

# Reverse and restore
rev file.txt | rev  # should match original

# Process multiple files
rev *.txt
```

### **od** - Octal Dump
**Description**: Display files in octal and other formats
**Location**: `/usr/bin/od`
**Common Use Cases**:
- Binary file analysis
- Character encoding inspection
- Data format debugging
- Non-printable character detection

**See Also**: `xxd` (hex dump), `hexdump` (hex display), `strings` (extract text)

**Examples**:
```bash
# Octal dump
od file.bin

# Hexadecimal dump
od -x file.bin

# ASCII dump
od -c file.txt

# Decimal dump
od -d file.bin

# Address in decimal
od -A d file.bin

# Skip bytes
od -j 100 file.bin

# Limit output
od -N 200 file.bin

# Multiple formats
od -t x1 -t c file.bin

# No address column
od -A n -t x1 file.bin
```

### **csplit** - Context Split
**Description**: Split files based on context
**Location**: `/usr/bin/csplit`
**Common Use Cases**:
- Split files at pattern matches
- Extract sections from documents
- Process structured text files
- Create multiple files from one

**See Also**: `split` (simple splitting), `awk` (pattern processing), `sed` (stream editing)

**Examples**:
```bash
# Split at pattern (keep pattern in second file)
csplit file.txt '/pattern/'

# Split at pattern (keep pattern in first file)
csplit file.txt '/pattern/' '{*}'

# Split at multiple patterns
csplit file.txt '/start/' '/end/'

# Split with repeat
csplit file.txt '/chapter/' '{*}'

# Silent mode
csplit -s file.txt '/pattern/'

# Custom prefix
csplit file.txt '/pattern/' -f section_

# Number of digits in suffix
csplit file.txt '/pattern/' -n 3

# Suppress zero-length files
csplit -z file.txt '/pattern/' '{*}'
```

### **diff3** - Three-Way File Comparison
**Description**: Compare three files line by line
**Location**: `/usr/bin/diff3`
**Common Use Cases**:
- Merge conflict resolution
- Three-way file merging
- Version control operations
- Configuration file merging

**See Also**: `diff` (two-way comparison), `patch` (apply changes), `merge` (file merging)

**Examples**:
```bash
# Basic three-way comparison
diff3 file1.txt file2.txt file3.txt

# Show only overlapping changes
diff3 -x file1.txt file2.txt file3.txt

# Merge files with conflict markers
diff3 -m file1.txt file2.txt file3.txt > merged.txt

# Show which file each line came from
diff3 -A file1.txt file2.txt file3.txt

# Exit with status indicating conflicts
diff3 -e file1.txt file2.txt file3.txt

# Use in git merge scenarios
diff3 -m base.txt branch1.txt branch2.txt

# Generate ed script for merging
diff3 -e file1.txt file2.txt file3.txt > merge.ed
```

### **patch** - Apply Differences
**Description**: Apply a diff file to an original
**Location**: `/usr/bin/patch`
**Common Use Cases**:
- Apply code patches
- Update configuration files
- Software maintenance
- Version control operations

**See Also**: `diff` (create patches), `git apply` (git patches), `diff3` (three-way merge)

**Examples**:
```bash
# Apply patch to file
patch file.txt < changes.patch

# Apply patch to multiple files
patch -p1 < multi-file.patch

# Dry run (don't actually apply)
patch --dry-run -p1 < changes.patch

# Reverse a patch
patch -R file.txt < changes.patch

# Create backup before patching
patch -b file.txt < changes.patch

# Apply patch from specific directory level
patch -p0 < local.patch  # Current directory
patch -p1 < repo.patch   # Strip one directory level

# Verbose output
patch -v file.txt < changes.patch

# Force application even with offset/fuzz
patch -f file.txt < changes.patch

# Interactive mode for conflicts
patch -t file.txt < changes.patch

# Common workflow: create and apply patches
diff -u original.txt modified.txt > changes.patch
patch original.txt < changes.patch
```

---

## Version Control

### **git** - Distributed Version Control
**Description**: Complete distributed version control system
**Location**: `/usr/bin/git`
**Version**: 2.39.5 (Apple Git-154)
**Difficulty**: ⭐⭐ Beginner (Basic commands) / ⭐⭐⭐⭐ Advanced (Branching, merging, rebasing)
**Common Use Cases**:
- Source code management
- Collaboration and branching
- History tracking and rollback

**See Also**: `diff` (compare files), `patch` (apply changes), `rsync` (sync repositories)

**Core Commands**:
```bash
# Repository initialization and cloning
git init                                    # Initialize new repository
git clone https://example.com/repo.git     # Clone remote repository
git clone --depth 1 https://repo.git       # Shallow clone (latest commit only)

# Basic workflow
git status                                  # Check working directory status
git add file.txt                          # Stage specific file
git add --all                             # Stage all changes
git commit -m "Add new feature"           # Commit with message
git commit --amend                        # Modify last commit
git push                                  # Push to remote
git pull                                  # Fetch and merge from remote
git fetch                                 # Fetch changes without merging

# Branch management
git branch                                # List branches
git branch new-feature                    # Create new branch
git switch new-feature                    # Switch to branch (Git 2.23+)
git checkout main                         # Switch to branch (older syntax)
git merge feature-branch                  # Merge branch into current
git branch -d feature-branch              # Delete merged branch
git branch -D force-delete                # Force delete branch

# History and inspection
git log                                   # Show commit history
git log --oneline --graph --all          # Compact visual history
git log --since="2 weeks ago"            # Filter by date
git diff                                  # Show unstaged changes
git diff --staged                        # Show staged changes
git diff HEAD~1                          # Compare with previous commit
git show commit-hash                      # Show specific commit details
git blame file.txt                       # Show line-by-line authorship

# Undoing changes
git restore file.txt                      # Discard working directory changes
git restore --staged file.txt            # Unstage file
git reset --soft HEAD~1                  # Undo commit, keep changes staged
git reset --hard HEAD~1                  # Undo commit, discard changes
git revert commit-hash                    # Create new commit that undoes changes
git stash                                 # Temporarily save changes
git stash pop                             # Apply and remove latest stash
git stash push -m "work in progress"      # Stash with message
```

**Advanced Operations**:
```bash
# Rebasing and history modification
git rebase main                           # Rebase current branch onto main
git rebase -i HEAD~3                      # Interactive rebase (last 3 commits)
git cherry-pick commit-hash               # Apply specific commit to current branch
git reflog                                # Show reference log (recovery tool)

# Remote management
git remote -v                             # List remotes with URLs
git remote add origin https://repo.git    # Add remote repository
git remote set-url origin new-url         # Change remote URL
git fetch --all                          # Fetch from all remotes
git push --set-upstream origin feature    # Push and set tracking branch
git push --force-with-lease               # Safe force push
git push --tags                          # Push tags to remote

# Collaboration workflows
git pull --rebase                         # Pull with rebase instead of merge
git merge --no-ff feature                 # Create merge commit even for fast-forward
git tag v1.0.0                           # Create lightweight tag
git tag -a v1.0.0 -m "Release version"   # Create annotated tag

# Advanced features
git submodule add https://repo.git path   # Add submodule
git submodule update --init --recursive   # Initialize and update submodules
git worktree add ../hotfix main           # Create linked working tree
git bisect start                          # Start binary search for bug
git clean -fd                             # Remove untracked files and directories

# Configuration and aliases
git config --global user.name "Name"      # Set global username
git config --global user.email "email"    # Set global email
git config --global alias.st status       # Create alias for status
git config --list                         # Show all configuration
```

### **delta** - Enhanced Git Diff Viewer
**Description**: A syntax-highlighting pager for git, diff, and grep output
**Location**: `/opt/homebrew/bin/delta`
**Difficulty**: ⭐⭐ Beginner (Basic viewing) / ⭐⭐⭐ Intermediate (Configuration)
**Common Use Cases**:
- Enhanced git diff visualization
- Side-by-side diff viewing
- Syntax-highlighted output
- Better merge conflict resolution

**See Also**: `git diff` (standard diff), `bat` (syntax highlighting), `diff` (file comparison)

**Examples**:
```bash
# Use delta as git pager (configure in ~/.gitconfig)
git config --global core.pager delta
git config --global interactive.diffFilter "delta --color-only"
git config --global delta.navigate true
git config --global delta.light false

# View git diff with delta
git diff                    # Automatically uses delta if configured
git log -p                  # Shows commit diffs with syntax highlighting
git show HEAD               # Enhanced commit viewing

# Side-by-side diff mode
git config --global delta.side-by-side true
git diff HEAD~1             # Shows side-by-side diff

# Manual usage (without git config)
git diff | delta            # Pipe git diff to delta
diff file1 file2 | delta   # Enhance regular diff output

# Advanced features
git config --global delta.line-numbers true        # Show line numbers
git config --global delta.decorations true         # File headers and rulers
git config --global delta.syntax-theme Dracula     # Set color theme

# Compare files directly
delta file1.txt file2.txt   # Direct file comparison
```

### **lazygit** - Terminal UI for Git
**Description**: Simple terminal UI for git commands with interactive interface
**Location**: `/opt/homebrew/bin/lazygit`
**Difficulty**: ⭐⭐ Beginner (Basic navigation) / ⭐⭐⭐ Intermediate (Advanced features)
**Common Use Cases**:
- Visual git repository management
- Interactive staging and committing
- Branch visualization and switching
- Merge conflict resolution

**See Also**: `git` (command line), `tig` (text-based git browser), `gitk` (graphical interface)

**Examples**:
```bash
# Launch lazygit in current repository
lazygit

# Launch in specific directory
lazygit -p /path/to/repo

# Key bindings (inside lazygit)
# Tab - switch between panels
# Enter - select/open item
# Space - stage/unstage files
# c - commit changes
# P - push to remote
# p - pull from remote
# b - checkout branch
# n - create new branch
# d - delete branch/file
# u - undo last action
# R - refresh view
# ? - help menu

# Configuration
# Edit ~/.config/lazygit/config.yml for custom settings
# Common configurations:
# - Change color scheme
# - Modify key bindings
# - Set default commands
# - Configure git behavior

# Useful workflows
# 1. Stage files: Navigate to files, press Space to stage
# 2. Commit: Press 'c', write message, press Enter
# 3. Push: Press 'P' to push to remote
# 4. Switch branch: Press 'b', select branch
# 5. Merge: Navigate to branch, press 'M'
```

### **tig** - Text-based Interface for Git
**Description**: Text-based interface for git repositories with interactive browsing
**Location**: `/opt/homebrew/bin/tig`
**Difficulty**: ⭐⭐⭐ Intermediate (Learning key bindings) / ⭐⭐⭐⭐ Advanced (Custom configurations)
**Common Use Cases**:
- Visual git repository browsing
- Interactive commit and diff exploration
- Git log visualization and navigation
- Code review and history analysis

**See Also**: `git` (command line), `lazygit` (terminal UI), `gitk` (graphical interface)

**Examples**:
```bash
# Basic tig usage
tig                          # Browse current repository
tig --all                    # Show all branches and tags
tig status                   # Show working tree status (like git status)
tig log                      # Browse commit log

# Browse specific references
tig main                     # Browse main branch
tig v1.0..v2.0              # Browse commits between tags
tig feature-branch          # Browse specific branch
tig --since="1 week ago"    # Browse recent commits

# File and blame views
tig blame file.txt          # Blame view for specific file
tig show HEAD               # Show specific commit
tig grep "search term"      # Search repository content

# Key bindings (inside tig)
# h - help menu
# q - quit current view
# Enter - select/drill down
# Tab - switch between views
# j/k - navigate up/down
# / - search
# n/N - next/previous search result

# Main view navigation
# R - refresh view
# C - cherry-pick commit
# ! - revert commit
# @ - stage/unstage changes

# Customization
# Edit ~/.tigrc for custom configuration
# Examples:
# set main-view-date = relative
# set blame-view = id:yes,author:abbreviated,date:relative,line-number:yes
# bind main C !git cherry-pick %(commit)

# Advanced usage with git integration
tig stash                   # Browse stash entries
tig refs                    # Browse all references
tig log --grep="pattern"    # Browse commits matching pattern
tig log --author="name"     # Browse commits by author
```

---

## Development Tools

### **gcc/clang** - C/C++ Compilers
**Description**: GNU Compiler Collection (aliased to clang on macOS)
**Location**: `/usr/bin/gcc`, `/usr/bin/clang`
**Common Use Cases**:
- Compile C/C++ programs
- Debug symbol generation
- Optimization and linking

**Examples**:
```bash
# Basic compilation
gcc source.c -o executable

# With warnings and debug symbols
gcc -Wall -g source.c -o executable

# Optimization levels
gcc -O2 source.c -o executable

# Link libraries
gcc source.c -lmath -o executable
```

### **make** - Build Automation
**Description**: Build automation tool using Makefiles
**Location**: `/usr/bin/make`
**Common Use Cases**:
- Project building and compilation
- Task automation
- Dependency management

**Examples**:
```bash
# Build default target
make

# Parallel build
make -j4

# Specific target
make clean

# Override variables
make CC=clang
```

### **cmake** - Cross-Platform Build System
**Description**: Cross-platform build system generator
**Location**: `/opt/homebrew/bin/cmake`
**Common Use Cases**:
- Generate build files for complex projects
- Cross-platform compilation
- Dependency management

**Examples**:
```bash
# Generate build files
cmake .

# Build project
cmake --build .

# Install built artifacts
cmake --install . --prefix /usr/local
```

### **ninja** - Small Build System
**Description**: A small build system with a focus on speed, designed to have build files generated by higher-level build systems
**Location**: `/opt/homebrew/bin/ninja`
**Difficulty**: ⭐⭐⭐ Intermediate (Generated files) / ⭐⭐⭐⭐ Advanced (Manual configuration)
**Common Use Cases**:
- Fast incremental builds
- Generated by CMake, Meson, or other meta-build systems
- Large-scale C/C++ projects
- Performance-critical build environments

**See Also**: `make` (traditional build), `cmake` (generates ninja files), `meson` (modern meta-build)

**Examples**:
```bash
# Basic usage (typically with generated build.ninja)
ninja                                         # Build all targets
ninja target_name                            # Build specific target
ninja -j 8                                   # Use 8 parallel jobs
ninja -v                                     # Verbose output (show commands)

# Information and debugging
ninja -t targets                             # List all available targets
ninja -t graph > build.dot                   # Generate dependency graph
ninja -t deps target_name                    # Show dependencies for target
ninja -t clean                               # Clean built files

# Performance and analysis
ninja -t browse                              # Start dependency browsing server
ninja -t msvc                                # MSVC helper (Windows)
ninja -t recompact                           # Recompact ninja log
ninja -d stats                               # Show build statistics

# Integration with other build systems
cmake -G Ninja ..                            # Generate ninja files with CMake
meson builddir --backend ninja               # Use ninja backend with Meson
ninja -C builddir                            # Run ninja in specific directory

# Common workflow
mkdir build && cd build
cmake -G Ninja ..                            # Configure with Ninja generator
ninja                                        # Build
ninja test                                   # Run tests (if available)
ninja install                               # Install
```

### **meson** - Modern Build System
**Description**: An open source build system meant to be both extremely fast and as user-friendly as possible
**Location**: `/opt/homebrew/bin/meson`
**Difficulty**: ⭐⭐⭐ Intermediate (Learning syntax) / ⭐⭐⭐⭐ Advanced (Complex projects)
**Common Use Cases**:
- Modern C/C++/Rust/Python project builds
- Cross-compilation and multi-platform builds
- Fast and user-friendly alternative to Autotools/CMake
- Projects requiring sophisticated dependency management

**See Also**: `ninja` (backend), `cmake` (alternative build system), `make` (traditional)

**Examples**:
```bash
# Project setup and configuration
meson setup builddir                         # Configure build in builddir/
meson setup builddir --buildtype=release     # Release configuration
meson setup builddir --prefix=/usr/local     # Custom install prefix
meson setup builddir --cross-file cross.txt  # Cross-compilation

# Building
meson compile -C builddir                    # Build project
meson compile -C builddir target_name        # Build specific target
meson compile -C builddir -j 8               # Use 8 parallel jobs

# Testing
meson test -C builddir                       # Run tests
meson test -C builddir --verbose             # Verbose test output
meson test -C builddir test_name             # Run specific test
meson test -C builddir --benchmark           # Run benchmarks

# Installation and distribution
meson install -C builddir                    # Install to configured prefix
meson dist -C builddir                       # Create distribution tarball
DESTDIR=/tmp/stage meson install -C builddir # Staged install

# Project introspection
meson introspect builddir --targets          # List build targets
meson introspect builddir --dependencies     # Show dependencies
meson introspect builddir --tests            # List tests
meson introspect builddir --installed        # Show installed files

# Configuration management
meson configure builddir                     # Show current configuration
meson configure builddir -Doption=value     # Set build option
meson configure builddir --buildtype=debug  # Change build type

# Example meson.build file:
# project('myproject', 'cpp', version: '1.0')
# executable('myapp', 'main.cpp', install: true)
# dependency('threads')

# Subprojects and wrapping
meson wrap install gtest                     # Install dependency wrap
meson subprojects update                     # Update all subprojects
```

### **bazel** - Google's Build System
**Description**: A build tool that builds code quickly and reliably for large-scale software development
**Location**: `/opt/homebrew/bin/bazel`
**Difficulty**: ⭐⭐⭐⭐ Advanced (Complex configuration) / ⭐⭐⭐⭐⭐ Expert (Large-scale projects)
**Common Use Cases**:
- Large-scale multi-language projects
- Reproducible and hermetic builds
- Google-scale software development
- Projects requiring precise dependency management

**See Also**: `make` (simple builds), `cmake` (C/C++ builds), `buck` (Facebook's build system)

**Examples**:
```bash
# Basic building
bazel build //...                           # Build everything
bazel build //src:main                      # Build specific target
bazel build --config=release //src:main     # Build with configuration

# Testing
bazel test //...                            # Run all tests
bazel test //src:test                       # Run specific test
bazel test --test_output=all //src:test     # Show test output

# Running
bazel run //src:main                        # Build and run target
bazel run //src:main -- arg1 arg2           # Pass arguments to target

# Project information
bazel query //...                           # List all targets
bazel query 'deps(//src:main)'              # Show dependencies
bazel query 'rdeps(//..., //lib:mylib)'     # Reverse dependencies

# Build configuration
bazel build --verbose_failures //src:main   # Show detailed errors
bazel build --compilation_mode=dbg //src:main  # Debug build
bazel build --cpu=k8 //src:main             # Specify CPU architecture

# Cleaning and cache
bazel clean                                  # Clean build outputs
bazel clean --expunge                       # Clean everything including cache
bazel shutdown                              # Shutdown Bazel server

# Remote execution and caching
bazel build --remote_executor=grpc://server:port //src:main
bazel build --remote_cache=grpc://cache:port //src:main

# Example BUILD file:
# cc_binary(
#     name = "main",
#     srcs = ["main.cpp"],
#     deps = ["//lib:mylib"],
# )

# Workspace management
bazel sync                                   # Synchronize workspace
bazel fetch //...                           # Fetch external dependencies
```

### **javac** - Java Compiler
**Description**: Java programming language compiler from Oracle/OpenJDK
**Location**: `/usr/bin/javac`
**Common Use Cases**:
- Java source code compilation
- Class file generation
- Build automation integration
- Development workflow

**Examples**:
```bash
# Basic compilation
javac HelloWorld.java

# Compile with classpath
javac -cp /path/to/libs/*.jar MyClass.java

# Compile multiple files
javac *.java
javac src/main/java/**/*.java

# Specify output directory
javac -d build src/**/*.java

# Include debug information
javac -g MyClass.java

# Show verbose compilation
javac -verbose MyClass.java

# Set specific Java version compatibility
javac -source 11 -target 11 MyClass.java

# Enable warnings
javac -Xlint:all MyClass.java

# Compile with annotation processing
javac -processor MyProcessor MyClass.java

# Generate native headers (JNI)
javac -h native_headers MyClass.java

# Cross-compilation with bootclasspath
javac -bootclasspath /path/to/rt.jar MyClass.java

# Compile with module system (Java 9+)
javac --module-path /path/to/modules -d out --module mymodule src/mymodule/**/*.java
```

### **nm** - Symbol Table Display
**Description**: Display symbol table of object files
**Location**: `/usr/bin/nm`
**Common Use Cases**:
- Symbol analysis and debugging
- Library dependency checking
- Reverse engineering
- Build troubleshooting

**Examples**:
```bash
# Display symbols in object file
nm object.o

# Display symbols in library
nm libmath.a

# Show dynamic symbols only
nm -D library.so

# Display with addresses
nm -n program

# Show undefined symbols only
nm -u program

# Display symbols with type information
nm -t program

# Show external symbols only
nm -g program

# Display symbol sizes
nm -S program

# Sort by symbol name
nm -p program

# Show debugging symbols
nm -a program

# Format output differently
nm -f bsd program    # BSD format
nm -f sysv program   # System V format
nm -f posix program  # POSIX format
```

### **objdump** - Object File Disassembler
**Description**: Display information from object files and executables
**Location**: `/usr/bin/objdump`
**Common Use Cases**:
- Assembly code analysis
- Reverse engineering
- Debugging optimized code
- Security research

**Examples**:
```bash
# Disassemble executable
objdump -d program

# Show all headers
objdump -x program

# Display file header
objdump -f program

# Show section headers
objdump -h program

# Disassemble specific section
objdump -j .text -d program

# Show source code intermixed with assembly
objdump -S program

# Display relocation entries
objdump -r object.o

# Show dynamic relocation
objdump -R program

# Display symbol table
objdump -t program

# Dynamic symbol table
objdump -T program

# Show assembly with line numbers
objdump -l -d program

# Intel syntax (x86)
objdump -M intel -d program

# Start disassembly at specific address
objdump --start-address=0x1000 -d program

# Stop at specific address
objdump --stop-address=0x2000 -d program
```

### **strings** - Extract Printable Strings
**Description**: Extract printable character sequences from binary files
**Location**: `/usr/bin/strings`
**Common Use Cases**:
- Binary analysis and reverse engineering
- Configuration extraction
- Malware analysis
- Debug information discovery

**Examples**:
```bash
# Basic string extraction
strings program

# Show strings with minimum length
strings -n 10 program

# Display string offsets
strings -o program

# Show strings from all sections
strings -a program

# Scan specific sections
strings -t d program  # decimal offsets
strings -t x program  # hexadecimal offsets
strings -t o program  # octal offsets

# Extract from specific encoding
strings -e l program  # little-endian 16-bit
strings -e b program  # big-endian 16-bit
strings -e L program  # little-endian 32-bit
strings -e B program  # big-endian 32-bit

# Filter by specific patterns
strings program | grep -i password
strings program | grep -E "https?://"

# Analyze multiple files
strings *.so | grep "version"

# Find configuration strings
strings config.bin | grep -E "^[A-Z_]+="

# Extract from core dumps
strings core.dump | grep -i error
```

### **hexdump** - Hexadecimal File Dump
**Description**: Display file contents in hexadecimal, decimal, octal, or ASCII
**Location**: `/usr/bin/hexdump`
**Common Use Cases**:
- Binary file analysis
- Data format investigation
- Debugging binary protocols
- File corruption analysis

**Examples**:
```bash
# Basic hex dump
hexdump file.bin

# Canonical hex+ASCII display
hexdump -C file.bin

# One-byte hex format
hexdump -x file.bin

# Two-byte hex format
hexdump -X file.bin

# Decimal format
hexdump -d file.bin

# Octal format
hexdump -o file.bin

# Custom format string
hexdump -e '16/1 "%02x " "\n"' file.bin

# Skip bytes at beginning
hexdump -s 1024 file.bin

# Limit number of bytes
hexdump -n 256 file.bin

# Format with addresses
hexdump -e '"%08.8_ax  " 8/1 "%02x " " " 8/1 "%02x "' -e '"  |" 16/1 "%_p" "|\n"' file.bin

# Show only printable characters
hexdump -e '16/1 "%_p"' -e '"\n"' file.bin

# Compare two files
hexdump -C file1.bin > dump1.txt
hexdump -C file2.bin > dump2.txt
diff dump1.txt dump2.txt
```

### **xxd** - Hex Dump (Alternative)
**Description**: Make a hexdump or do the reverse (available in vim package)
**Location**: `/usr/bin/xxd`
**Common Use Cases**:
- Binary file editing workflow
- Data conversion tasks
- Patch creation
- Protocol analysis

**Examples**:
```bash
# Standard hex dump
xxd file.bin

# Limit output lines
xxd -l 320 file.bin

# Uppercase hex digits
xxd -u file.bin

# Group bytes differently
xxd -g 1 file.bin    # 1 byte groups
xxd -g 2 file.bin    # 2 byte groups (default)
xxd -g 4 file.bin    # 4 byte groups

# Plain hex output (no formatting)
xxd -p file.bin

# Continuous hex string
xxd -p -c 256 file.bin

# Reverse operation (hex to binary)
xxd -r -p hexfile.txt > binary.bin

# Edit binary files workflow
xxd file.bin > file.hex
# Edit file.hex with text editor
xxd -r file.hex > file.bin

# Create binary from hex
echo "48656c6c6f20576f726c64" | xxd -r -p

# Seek to offset
xxd -s 0x100 file.bin

# Include only certain range
xxd -s 0x100 -l 0x50 file.bin

# Binary diff visualization
xxd file1.bin > file1.hex
xxd file2.bin > file2.hex
diff -u file1.hex file2.hex
```

### **file** - File Type Detection (Enhanced)
**Description**: Comprehensive file type identification using magic numbers
**Location**: `/usr/bin/file`
**Common Use Cases**:
- Forensic analysis
- File format verification
- Security scanning
- Data recovery

**Examples**:
```bash
# Detailed file analysis
file -i file.bin    # MIME type
file -b file.bin    # Brief output
file -z file.bin    # Look inside compressed files

# Custom magic file
file -m custom.magic file.bin

# Follow symbolic links
file -L symlink

# Don't pad filenames
file -N *.bin

# Raw output format
file -r file.bin

# Special file analysis
file --special-files /dev/sda1

# Preserve modification time
file -p file.bin

# Multiple files with separator
file -F '::' *.bin

# Exclude specific magic types
file --exclude-quiet *.txt
```

### **patch** - Apply Source Patches
**Description**: Apply patch files to source code
**Location**: `/usr/bin/patch`
**Common Use Cases**:
- Source code patching
- Bug fix application
- Version control operations
- Collaborative development

**Examples**:
```bash
# Apply patch file
patch < patch.diff
patch -p1 < patch.diff

# Apply specific file patch
patch file.c < file.patch

# Dry run (test without applying)
patch --dry-run < patch.diff

# Reverse patch
patch -R < patch.diff

# Create backup files
patch -b < patch.diff

# Custom backup suffix
patch -b -z .orig < patch.diff

# Strip path components
patch -p0 < patch.diff  # use full path
patch -p1 < patch.diff  # strip 1 component
patch -p2 < patch.diff  # strip 2 components

# Force application
patch -f < patch.diff

# Interactive mode
patch -t < patch.diff

# Verbose output
patch -v < patch.diff

# Create patch files
diff -u original.c modified.c > changes.patch
diff -ur original_dir/ modified_dir/ > project.patch

# Apply git patches
patch -p1 < 0001-feature.patch

# Reject failed hunks
patch -r rejected.rej < patch.diff
```

### **diff** - Compare Files/Directories
**Description**: Compare files line by line or directories
**Location**: `/usr/bin/diff`
**Common Use Cases**:
- Source code comparison
- Configuration changes
- Backup verification
- Version analysis

**Examples**:
```bash
# Basic file comparison
diff file1.txt file2.txt

# Unified format (patch-friendly)
diff -u original.c modified.c

# Context format
diff -c file1.txt file2.txt

# Side-by-side comparison
diff -y file1.txt file2.txt

# Ignore case differences
diff -i file1.txt file2.txt

# Ignore whitespace changes
diff -b file1.txt file2.txt
diff -w file1.txt file2.txt  # ignore all whitespace

# Recursive directory comparison
diff -r dir1/ dir2/

# Show only file names that differ
diff -q dir1/ dir2/

# Exclude files by pattern
diff -r --exclude="*.o" --exclude="*.a" src1/ src2/

# Generate patch
diff -u original.c modified.c > changes.patch

# Compare binary files
diff --brief file1.bin file2.bin

# Show differences with line numbers
diff -n file1.txt file2.txt

# Ignore blank lines
diff -B file1.txt file2.txt

# Minimal diff
diff --minimal file1.txt file2.txt

# Show function names in C code
diff -p original.c modified.c
```

### **cmp** - Compare Files Byte by Byte
**Description**: Compare two files byte by byte
**Location**: `/usr/bin/cmp`
**Common Use Cases**:
- Binary file verification
- Data integrity checking
- Exact comparison needs
- Performance-critical comparisons

**Examples**:
```bash
# Basic comparison
cmp file1.bin file2.bin

# Verbose output showing differences
cmp -l file1.bin file2.bin

# Silent mode (exit status only)
cmp -s file1.bin file2.bin

# Show first difference only
cmp file1.bin file2.bin

# Compare with byte count limit
cmp -n 1024 file1.bin file2.bin

# Skip bytes at beginning
cmp -i 100 file1.bin file2.bin

# Skip different amounts in each file
cmp -i 100:200 file1.bin file2.bin

# Use in scripts
if cmp -s file1 file2; then
    echo "Files are identical"
else
    echo "Files differ"
fi

# Verify backup integrity
cmp original.data backup.data && echo "Backup verified"

# Find first difference position
cmp -l file1 file2 | head -1
```

### **ld** - Linker
**Description**: Link object files and libraries into executables
**Location**: `/usr/bin/ld`
**Common Use Cases**:
- Custom linking requirements
- Embedded systems development
- Library creation
- Low-level system programming

**Examples**:
```bash
# Basic linking
ld -o program crt0.o main.o -lc

# Link with specific library path
ld -L/usr/local/lib -o program main.o -lcustom

# Create shared library
ld -shared -o libmath.so math1.o math2.o

# Static linking
ld -static -o program main.o -lm

# Set entry point
ld -e _start -o program main.o

# Generate map file
ld -Map=program.map -o program main.o

# Link script
ld -T custom.lds -o program main.o

# Cross-platform linking
ld -m elf_i386 -o program main.o

# Dynamic linker
ld -dynamic-linker /lib64/ld-linux-x86-64.so.2 -o program main.o

# Version script
ld --version-script=version.map -shared -o lib.so objects.o

# Note: Usually called indirectly through gcc/clang
gcc -Wl,-Map=output.map -o program main.c
```

### **ar** - Archive Manager (Enhanced)
**Description**: Create, modify, and extract from archive files
**Location**: `/usr/bin/ar`
**Common Use Cases**:
- Static library creation
- Object file archiving
- Embedded development
- Package building

**Examples**:
```bash
# Create archive with symbol table
ar rcs libmath.a add.o sub.o mul.o div.o

# Add files to existing archive
ar r libmath.a newmath.o

# List archive contents
ar t libmath.a

# Verbose listing with details
ar tv libmath.a

# Extract files from archive
ar x libmath.a
ar x libmath.a specific.o  # extract specific file

# Delete files from archive
ar d libmath.a obsolete.o

# Replace files in archive
ar r libmath.a updated.o

# Insert files before specific member
ar ib existing.o libmath.a new.o

# Insert files after specific member
ar ia existing.o libmath.a new.o

# Create deterministic archive (reproducible builds)
ar rcsD libmath.a *.o

# Show symbol table
ar s libmath.a

# Thin archive (references instead of copies)
ar rcT libmath.a *.o

# Quick append
ar q libmath.a new.o

# Update only newer files
ar ru libmath.a *.o
```

### **ranlib** - Archive Index Generator
**Description**: Generate index for archive files
**Location**: `/usr/bin/ranlib`
**Common Use Cases**:
- Optimize library linking
- Archive maintenance
- Build system integration
- Legacy compatibility

**Examples**:
```bash
# Add symbol table to archive
ranlib libmath.a

# Verbose output
ranlib -v libmath.a

# Update multiple archives
ranlib lib*.a

# Check if archive needs updating
ranlib -t libmath.a

# Use in Makefiles
libmath.a: $(OBJECTS)
	ar rcs $@ $^
	ranlib $@

# Modern alternative (ar with 's' flag)
ar rcs libmath.a *.o  # includes ranlib functionality
```

### **ldd** - Shared Library Dependencies
**Description**: Print shared library dependencies
**Location**: `/usr/bin/otool -L` (macOS equivalent)
**Common Use Cases**:
- Dependency analysis
- Deployment preparation
- Library troubleshooting
- Security auditing

**Examples**:
```bash
# Show shared library dependencies (macOS)
otool -L program

# Show all dependencies recursively
otool -L program | grep -v ":" | xargs -I {} otool -L {}

# Check if library is dynamically linked
otool -L program | grep libname

# Verify library paths
otool -L program

# Show library load commands
otool -l program | grep -A 5 LC_LOAD_DYLIB

# Alternative with nm for symbols
nm -D program | grep "U "

# Check for missing libraries
for lib in $(otool -L program | awk '{print $1}' | grep -v ":"); do
    if [ ! -f "$lib" ]; then
        echo "Missing: $lib"
    fi
done

# Linux equivalent (if available)
# ldd program
# ldd -v program  # verbose
# ldd -d program  # missing dependencies
# ldd -r program  # missing symbols
```

### **python3** - Python Interpreter
**Description**: Python 3 programming language interpreter
**Location**: `/Users/allen/.pyenv/shims/python3`
**Common Use Cases**:
- Script execution
- Interactive development
- Module and package management

**Examples**:
```bash
# Run script
python3 script.py

# Interactive REPL
python3

# Run module
python3 -m http.server

# Install packages
python3 -m pip install package
```

### **python** - Python Interpreter (Generic)
**Description**: Python programming language interpreter (version may vary)
**Location**: `/Users/allen/.pyenv/shims/python`
**Difficulty**: ⭐⭐ Beginner (Readable syntax, extensive libraries)
**Common Use Cases**:
- Quick scripting and automation
- Data analysis and processing
- System administration
- Educational programming

**Examples**:
```bash
# Check Python version
python --version

# Run Python script
python script.py

# Interactive mode
python

# One-liner operations
python -c "print('Hello, World!')"
python -c "import math; print(math.pi)"

# Text processing
python -c "import sys; print(sys.stdin.read().upper())" < file.txt

# Mathematical operations
python -c "print(sum(range(1, 101)))"   # Sum 1-100
python -c "import random; print(random.randint(1, 100))"

# JSON processing
python -c "import json, sys; print(json.load(sys.stdin)['key'])" < data.json

# File operations
python -c "with open('file.txt') as f: print(len(f.readlines()))"

# HTTP server (quick web server)
python -m http.server 8000

# Install packages
python -m pip install package_name

# List installed packages
python -m pip list
```

### **perl** - Perl Programming Language
**Description**: Practical Extraction and Reporting Language interpreter
**Location**: `/usr/bin/perl`
**Difficulty**: ⭐⭐⭐⭐ Advanced (Complex syntax and extensive features)
**Common Use Cases**:
- Text processing and parsing
- System administration scripts
- Regular expression operations
- Legacy system maintenance

**Examples**:
```bash
# Run Perl script
perl script.pl

# One-liner text processing
perl -pe 's/old/new/g' file.txt         # Replace text
perl -lane 'print $F[0]' file.txt       # Print first column
perl -ne 'print if /pattern/' file.txt  # Print matching lines

# Regular expressions
perl -pe 's/(\d{4})-(\d{2})-(\d{2})/$2\/$3\/$1/g' dates.txt  # Reformat dates

# Text manipulation
perl -i -pe 's/foo/bar/g' *.txt         # In-place editing
perl -00 -pe 's/\n/ /g' file.txt        # Join paragraphs
perl -F: -lane 'print $F[0]' /etc/passwd # Parse colon-separated

# Data extraction
perl -MJSON -ne 'print decode_json($_)->{key}' data.json
perl -MXML::Simple -e 'print XMLin("file.xml")->{element}'

# File operations
perl -e 'print "Hello\n" x 5'           # Print repeated text
perl -e 'print join("\n", reverse <>)' file.txt  # Reverse file lines

# Interactive mode (debugger)
perl -d script.pl
```

### **ruby** - Ruby Programming Language  
**Description**: Dynamic, open source programming language with focus on simplicity
**Location**: `/usr/bin/ruby`
**Difficulty**: ⭐⭐⭐ Intermediate (Object-oriented with readable syntax)
**Common Use Cases**:
- Web development (Rails)
- Automation scripts
- System administration
- Quick scripting tasks

**Examples**:
```bash
# Run Ruby script
ruby script.rb

# One-liner operations
ruby -e 'puts "Hello World"'            # Print text
ruby -pe '$_.upcase!' file.txt          # Convert to uppercase
ruby -ne 'puts $_ if $_.match(/pattern/)' file.txt  # Pattern matching

# Text processing
ruby -pe '$_.gsub!(/old/, "new")' file.txt  # Replace text
ruby -lane 'puts $F[0]' file.txt        # Print first field
ruby -e 'puts ARGF.readlines.reverse' file.txt  # Reverse lines

# JSON processing
ruby -rjson -e 'puts JSON.parse(STDIN.read)["key"]' < data.json

# Interactive Ruby shell
irb

# Mathematical operations
ruby -e 'puts (1..100).sum'             # Sum of numbers 1-100
ruby -e 'puts Math.sqrt(144)'           # Square root

# File operations
ruby -e 'Dir["*.txt"].each {|f| puts File.size(f)}' # File sizes
ruby -e 'puts File.readlines("file.txt").size'      # Line count
```

### **swift** - Swift Programming Language
**Description**: Apple's powerful and intuitive programming language
**Location**: `/usr/bin/swift`
**Difficulty**: ⭐⭐⭐ Intermediate (Modern syntax, Apple ecosystem)
**Common Use Cases**:
- iOS/macOS app development
- Server-side development
- System scripting
- Command-line tools

**Examples**:
```bash
# Run Swift script
swift script.swift

# Interactive Swift REPL
swift

# Compile Swift program
swiftc program.swift -o program

# One-liner Swift execution
swift -e 'print("Hello, World!")'

# File processing
swift -e 'import Foundation; let content = try String(contentsOfFile: "file.txt"); print(content.uppercased())'

# JSON processing
swift -e 'import Foundation; let data = Data("{}".utf8); let json = try JSONSerialization.jsonObject(with: data)'

# Mathematical operations
swift -e 'print(Array(1...100).reduce(0, +))'  # Sum 1-100

# Package manager
swift package init                      # Initialize package
swift build                           # Build package  
swift test                            # Run tests
swift run                             # Run executable

# Swift format (if available)
swift-format source.swift
```

### **node** - Node.js Runtime
**Description**: JavaScript runtime built on V8 engine
**Location**: `/opt/homebrew/bin/node`
**Common Use Cases**:
- JavaScript execution outside browser
- Server-side development
- Build tool execution

**Examples**:
```bash
# Run JavaScript file
node script.js

# Interactive REPL
node

# Debug with inspector
node --inspect script.js
```

### **npm** - Node Package Manager
**Description**: Package manager for Node.js
**Location**: `/opt/homebrew/bin/npm`
**Common Use Cases**:
- Package installation and management
- Script execution
- Project initialization

**Examples**:
```bash
# Install dependencies
npm install

# Install specific package
npm install package-name

# Install globally
npm install -g package-name

# Run scripts
npm run script-name
```

### **xxd** - Hex Dump
**Description**: Create hex dump or reverse it
**Location**: `/usr/bin/xxd`
**Common Use Cases**:
- Binary file analysis
- Hex editing
- Data format inspection
- Reverse engineering

**See Also**: `hexdump` (alternative hex dump), `od` (octal dump), `strings` (text extraction)

**Examples**:
```bash
# Hex dump of file
xxd file.bin

# Limit output to first 128 bytes
xxd -l 128 file.bin

# Plain hex dump (no ASCII column)
xxd -p file.bin

# Reverse hex dump back to binary
xxd -r -p hexfile.txt > output.bin

# Create binary from hex string
echo "48656c6c6f" | xxd -r -p

# Custom columns
xxd -c 8 file.bin  # 8 bytes per line

# Skip bytes
xxd -s 100 file.bin  # Skip first 100 bytes

# Upper case hex
xxd -u file.bin
```

### **strings** - Extract Text
**Description**: Extract printable strings from binary files
**Location**: `/usr/bin/strings`
**Common Use Cases**:
- Binary analysis
- Error message extraction
- Configuration discovery
- Reverse engineering

**See Also**: `xxd` (hex dump), `file` (file type detection), `nm` (symbol dump)

**Examples**:
```bash
# Extract all strings
strings binary_file

# Minimum string length
strings -n 10 binary_file

# Include filename in output
strings -f *.bin

# Show file offset of strings
strings -o binary_file

# Only ASCII strings
strings -a binary_file

# Extract from all sections
strings -a -t x binary_file  # with hex offsets

# Search for specific patterns
strings binary_file | grep -i password
strings binary_file | grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
```

### **nm** - Symbol Dump
**Description**: Display symbol table of object files
**Location**: `/usr/bin/nm`
**Common Use Cases**:
- Symbol analysis
- Library inspection
- Debugging information
- Link-time debugging

**See Also**: `objdump` (object file dump), `strings` (text extraction), `otool` (macOS object tool)

**Examples**:
```bash
# List symbols
nm object_file.o

# Include undefined symbols
nm -u object_file.o

# Sort by address
nm -n object_file.o

# Dynamic symbols only
nm -D library.so

# Demangle C++ symbols
nm -C object_file.o

# Show symbol sizes
nm -S object_file.o

# External symbols only
nm -g object_file.o

# Print value, type, and name
nm -f bsd object_file.o
```

### **otool** - Object File Display (macOS)
**Description**: Object file displaying tool for macOS
**Location**: `/usr/bin/otool`
**Common Use Cases**:
- Mach-O file analysis
- Dependency inspection
- Architecture information
- Code analysis

**See Also**: `nm` (symbol dump), `objdump` (object dump), `file` (file type)

**Examples**:
```bash
# Show header information
otool -h binary_file

# Show library dependencies
otool -L binary_file

# Disassemble text section
otool -t binary_file

# Show load commands
otool -l binary_file

# Show shared library
otool -D library.dylib

# Show all sections
otool -s __TEXT __text binary_file

# Verbose output
otool -v -t binary_file

# Show architectures
otool -f binary_file
```

### **stat** - File Statistics
**Description**: Display file or file system status
**Location**: `/usr/bin/stat`
**Common Use Cases**:
- File metadata inspection
- Permission analysis
- Timestamp checking
- Inode information

**See Also**: `ls` (basic file info), `file` (file type), `du` (disk usage)

**Examples**:
```bash
# Detailed file information
stat filename

# Format output
stat -f "%N %z %m" filename  # name, size, modification time

# File system information
stat -f filename

# Custom format
stat -f "Size: %z bytes, Modified: %Sm" filename

# Multiple files
stat file1 file2 file3

# Follow symbolic links
stat -L symlink

# Portable format
stat -x filename

# Specific information
stat -f "%p" filename  # permissions in octal
stat -f "%u %g" filename  # user and group IDs
```

### **hyperfine** - Command-Line Benchmarking Tool
**Description**: A command-line benchmarking tool with statistical analysis
**Location**: `/opt/homebrew/bin/hyperfine`
**Difficulty**: ⭐⭐ Beginner (Basic benchmarks) / ⭐⭐⭐ Intermediate (Statistical analysis)
**Common Use Cases**:
- Performance benchmarking of commands
- Comparing alternative implementations
- Performance regression testing
- Optimization validation

**See Also**: `time` (basic timing), `perf` (Linux performance profiling), `dtrace` (macOS system tracing)

**Examples**:
```bash
# Basic benchmark
hyperfine 'sleep 1'

# Compare multiple commands
hyperfine 'grep pattern file.txt' 'rg pattern file.txt' 'ag pattern file.txt'

# Benchmark with warm-up runs
hyperfine --warmup 3 'python script.py'

# Set number of runs for better statistics
hyperfine --runs 50 'quick_command'

# Benchmark with parameters
hyperfine 'sort {}.txt' --parameter-list filename file1,file2,file3

# Export results to different formats
hyperfine --export-json results.json 'command1' 'command2'
hyperfine --export-csv results.csv 'command1' 'command2'
hyperfine --export-markdown results.md 'command1' 'command2'

# Set preparation and cleanup commands
hyperfine --prepare 'make clean' --cleanup 'rm -f *.o' 'make'

# Ignore exit codes (for commands that may fail)
hyperfine --ignore-failure 'unreliable_command'

# Show output of benchmarked commands
hyperfine --show-output 'ls -la'

# Compare build systems
hyperfine 'make clean && make' 'ninja -t clean && ninja'

# Database query performance
hyperfine --warmup 1 \
  'psql -c "SELECT * FROM users LIMIT 1000"' \
  'psql -c "SELECT * FROM users WHERE active = true LIMIT 1000"'

# Algorithm comparison
hyperfine 'python bubble_sort.py' 'python quick_sort.py' 'python merge_sort.py'

# Compiler optimization levels
hyperfine 'gcc -O0 program.c -o test && ./test' \
          'gcc -O2 program.c -o test && ./test' \
          'gcc -O3 program.c -o test && ./test'
```

### **tokei** - Code Statistics Tool
**Description**: Fast and accurate code statistics tool that counts lines of code
**Location**: `/opt/homebrew/bin/tokei`
**Difficulty**: ⭐⭐ Beginner (Basic counting) / ⭐⭐⭐ Intermediate (Custom output formats)
**Common Use Cases**:
- Project size analysis and metrics
- Code base assessment for documentation
- Language breakdown in multi-language projects
- Development progress tracking

**See Also**: `cloc` (alternative code counter), `wc` (basic line counting), `scc` (fast code counter)

**Examples**:
```bash
# Basic code statistics
tokei                        # Count code in current directory
tokei /path/to/project      # Count code in specific directory
tokei --files               # Show per-file statistics

# Language-specific analysis
tokei --type rust           # Count only Rust files
tokei --type python,javascript  # Count specific languages
tokei --exclude "*.test.js" # Exclude test files

# Output formats
tokei --output json         # JSON output for scripting
tokei --output yaml         # YAML format
tokei --output cbor         # Compact binary format

# Sorting and filtering
tokei --sort lines          # Sort by lines of code
tokei --sort files          # Sort by number of files
tokei --sort blanks         # Sort by blank lines

# Detailed analysis
tokei --verbose             # Show detailed breakdown
tokei --no-ignore          # Include all files (ignore .gitignore)
tokei --hidden              # Include hidden files and directories

# Custom exclusions
tokei --exclude="target/*"  # Exclude build directories
tokei --exclude="node_modules/*" "*.min.js"  # Exclude multiple patterns

# Integration examples
tokei --output json | jq '.Total.code'  # Extract total lines with jq
tokei | grep -E "(Rust|Python|JavaScript)"  # Filter specific languages
```

### **cloc** - Count Lines of Code (Classic Tool)
**Description**: Classic and comprehensive tool for counting source lines of code
**Location**: `/opt/homebrew/bin/cloc`
**Difficulty**: ⭐⭐ Beginner (Basic usage) / ⭐⭐⭐ Intermediate (Advanced filtering)
**Common Use Cases**:
- Detailed code analysis and reporting
- Legacy project assessment
- Academic research and documentation
- Cross-project comparison

**See Also**: `tokei` (modern alternative), `scc` (fast counter), `wc` (basic counting)

**Examples**:
```bash
# Basic usage
cloc .                      # Count code in current directory
cloc /path/to/project       # Count code in specific directory
cloc file1.py file2.js      # Count specific files

# Language analysis
cloc --by-file              # Show per-file breakdown
cloc --by-file-by-lang      # Group by language and file
cloc --show-lang            # List supported languages
cloc --force-lang=Python script.txt  # Force language detection

# Output formats
cloc --csv                  # CSV output for spreadsheets
cloc --xml                  # XML format
cloc --json                 # JSON format
cloc --yaml                 # YAML format

# Filtering and exclusions
cloc --exclude-dir=node_modules,target  # Exclude directories
cloc --exclude-ext=min.js   # Exclude file extensions
cloc --ignore-whitespace    # More aggressive blank line detection
cloc --exclude-list-file=exclude.txt    # Use exclusion file

# Comparison and diff
cloc --diff old_version/ new_version/   # Compare two versions
cloc --git --diff HEAD~1 HEAD          # Compare git commits
cloc --sum-reports report1.txt report2.txt  # Combine multiple reports

# Advanced features
cloc --strip-comments=nc    # Remove comments and rewrite files
cloc --stat                 # Show processing statistics
cloc --progress-rate=10     # Show progress every 10 files
cloc --quiet                # Suppress progress messages

# Integration examples
cloc --csv . > code_stats.csv          # Export to spreadsheet
cloc --json . | jq '.SUM.code'         # Extract total with jq
find . -name "*.py" | cloc --list-file=-  # Use with find command
```

---

## Package Managers

### **brew** - Homebrew Package Manager (macOS)
**Description**: Missing package manager for macOS (and Linux)
**Location**: `/opt/homebrew/bin/brew`
**Common Use Cases**:
- Software installation and management
- Development environment setup
- System tool installation
- Application distribution

**Examples**:
```bash
# Search for packages
brew search package-name

# Install package
brew install package-name

# Install cask (GUI applications)
brew install --cask application-name

# Update Homebrew
brew update

# Upgrade all packages
brew upgrade

# Upgrade specific package
brew upgrade package-name

# List installed packages
brew list

# Show package information
brew info package-name

# Uninstall package
brew uninstall package-name

# Clean up old versions
brew cleanup

# Check system for issues
brew doctor

# Show dependencies
brew deps package-name

# Create Brewfile (package list)
brew bundle dump

# Install from Brewfile
brew bundle install

# Add custom tap
brew tap user/repo

# Services management
brew services start service-name
brew services stop service-name
brew services list
```

### **pip3** - Python Package Installer
**Description**: Package installer for Python 3
**Location**: `/Users/allen/.pyenv/shims/pip3`
**Common Use Cases**:
- Python package installation
- Dependency management
- Virtual environment setup
- Development environment configuration

**Examples**:
```bash
# Install package
pip3 install package-name

# Install specific version
pip3 install package-name==1.2.3

# Install from requirements file
pip3 install -r requirements.txt

# Install in development mode
pip3 install -e .

# Upgrade package
pip3 install --upgrade package-name

# Uninstall package
pip3 uninstall package-name

# List installed packages
pip3 list

# Show package information
pip3 show package-name

# Check for outdated packages
pip3 list --outdated

# Generate requirements file
pip3 freeze > requirements.txt

# Install from Git repository
pip3 install git+https://github.com/user/repo.git

# Install with extra dependencies
pip3 install package-name[extra]

# Install user-specific
pip3 install --user package-name

# Search packages (deprecated, use PyPI web)
# pip3 search package-name

# Create virtual environment
python3 -m venv venv
source venv/bin/activate
pip3 install package-name
```

### **gem** - Ruby Package Manager
**Description**: Package manager for Ruby programming language
**Location**: `/usr/bin/gem`
**Common Use Cases**:
- Ruby gem installation
- Development environment setup
- Tool installation
- Dependency management

**Examples**:
```bash
# Install gem
gem install gem-name

# Install specific version
gem install gem-name -v 1.2.3

# Update all gems
gem update

# Update specific gem
gem update gem-name

# Uninstall gem
gem uninstall gem-name

# List installed gems
gem list

# Show gem information
gem info gem-name

# Search for gems
gem search gem-name

# Check for outdated gems
gem outdated

# Install gem locally
gem install gem-name --user-install

# Install from source
gem build gemspec-file.gemspec
gem install gem-file.gem

# Generate gem documentation
gem rdoc --all

# Clear gem cache
gem cleanup

# Set gem sources
gem sources --add https://rubygems.org/
gem sources --list

# Install bundler
gem install bundler

# Bundle install (using Gemfile)
bundle install
bundle update
```

### **cargo** - Rust Package Manager
**Description**: Package manager and build system for Rust
**Location**: `/Users/allen/.cargo/bin/cargo`
**Common Use Cases**:
- Rust package management
- Project building and testing
- Dependency management
- Tool installation

**Examples**:
```bash
# Create new project
cargo new project-name
cargo new --lib library-name

# Build project
cargo build
cargo build --release

# Run project
cargo run

# Run tests
cargo test

# Check code (fast compile check)
cargo check

# Update dependencies
cargo update

# Install binary crate
cargo install crate-name

# Uninstall binary crate
cargo uninstall crate-name

# Search for crates
cargo search crate-name

# Show dependency tree
cargo tree

# Clean build artifacts
cargo clean

# Generate documentation
cargo doc
cargo doc --open

# Run benchmarks
cargo bench

# Format code
cargo fmt

# Lint code
cargo clippy

# Add dependency
cargo add dependency-name

# Remove dependency
cargo remove dependency-name

# Login to crates.io
cargo login

# Publish crate
cargo publish
```

### **go** - Go Module Manager
**Description**: Go programming language module management
**Location**: `/opt/homebrew/bin/go`
**Common Use Cases**:
- Go module management
- Package installation
- Build and testing
- Dependency resolution

**Examples**:
```bash
# Initialize module
go mod init module-name

# Add dependency
go get package-name
go get package-name@version

# Update dependencies
go get -u
go get -u package-name

# Remove unused dependencies
go mod tidy

# Download dependencies
go mod download

# Vendor dependencies
go mod vendor

# Build project
go build

# Install binary
go install

# Run project
go run main.go

# Run tests
go test
go test ./...

# Show module info
go mod why package-name
go mod graph

# List modules
go list -m all

# Check for updates
go list -u -m all

# Clean module cache
go clean -modcache

# Work with local modules
go mod edit -replace=old-module=./local-path

# Format code
go fmt

# Vet code
go vet
```

### **mvn** - Maven (Java)
**Description**: Build automation and dependency management for Java
**Location**: `/opt/homebrew/bin/mvn`
**Common Use Cases**:
- Java project building
- Dependency management
- Testing and packaging
- Release management

**Examples**:
```bash
# Create new project
mvn archetype:generate -DgroupId=com.example -DartifactId=my-app

# Compile project
mvn compile

# Run tests
mvn test

# Package project
mvn package

# Install to local repository
mvn install

# Clean project
mvn clean

# Full clean and install
mvn clean install

# Skip tests
mvn package -DskipTests

# Run specific test
mvn test -Dtest=TestClassName

# Generate site documentation
mvn site

# Show dependency tree
mvn dependency:tree

# Update dependencies
mvn versions:display-dependency-updates

# Deploy to repository
mvn deploy

# Execute main class
mvn exec:java -Dexec.mainClass="com.example.Main"

# Run with specific profile
mvn clean install -P production

# Debug mode
mvn -X compile

# Show effective POM
mvn help:effective-pom
```

### **gradle** - Gradle Build Tool (Java/Kotlin)
**Description**: Build automation tool for JVM languages
**Location**: `/opt/homebrew/bin/gradle`
**Common Use Cases**:
- Java/Kotlin/Groovy project building
- Dependency management
- Multi-project builds
- Android development

**Examples**:
```bash
# Initialize new project
gradle init

# Build project
gradle build

# Run tests
gradle test

# Clean project
gradle clean

# Assemble project
gradle assemble

# Show tasks
gradle tasks

# Show dependencies
gradle dependencies

# Run specific task
gradle taskName

# Run with specific profile
gradle build -Pprofile=production

# Run application
gradle run

# Generate wrapper
gradle wrapper

# Use wrapper (recommended)
./gradlew build
./gradlew test

# Continuous build
gradle build --continuous

# Debug mode
gradle build --debug

# Refresh dependencies
gradle build --refresh-dependencies

# Show project info
gradle projects

# Generate build scan
gradle build --scan

# Custom task execution
gradle customTask -Pprop=value
```

### **composer** - PHP Package Manager
**Description**: Dependency manager for PHP
**Location**: `/opt/homebrew/bin/composer`
**Common Use Cases**:
- PHP package management
- Autoloading setup
- Project dependency resolution
- Framework installation

**Examples**:
```bash
# Initialize new project
composer init

# Install dependencies
composer install

# Add package
composer require package/name

# Add development dependency
composer require --dev package/name

# Update dependencies
composer update

# Update specific package
composer update package/name

# Remove package
composer remove package/name

# Show installed packages
composer show

# Show package information
composer show package/name

# Check for security issues
composer audit

# Validate composer.json
composer validate

# Dump autoloader
composer dump-autoload

# Optimize autoloader
composer dump-autoload --optimize

# Clear cache
composer clear-cache

# Self-update composer
composer self-update

# Create project from template
composer create-project package/name project-name

# Run scripts
composer run-script script-name

# Global package installation
composer global require package/name
```

### **yarn** - Fast JavaScript Package Manager
**Description**: Fast, reliable, and secure dependency management for JavaScript
**Location**: `/opt/homebrew/bin/yarn`
**Common Use Cases**:
- JavaScript package management
- Faster npm alternative
- Workspace management
- Dependency resolution

**Examples**:
```bash
# Initialize new project
yarn init

# Install dependencies
yarn install

# Add package
yarn add package-name

# Add development dependency
yarn add --dev package-name

# Add global package
yarn global add package-name

# Upgrade package
yarn upgrade package-name

# Remove package
yarn remove package-name

# Run scripts
yarn run script-name
yarn script-name

# Show installed packages
yarn list

# Show outdated packages
yarn outdated

# Check integrity
yarn check

# Clear cache
yarn cache clean

# Show workspace info
yarn workspaces info

# Run in workspace
yarn workspace workspace-name command

# Create lockfile
yarn install --frozen-lockfile

# Audit dependencies
yarn audit

# Fix audit issues
yarn audit --fix

# Show why package is installed
yarn why package-name

# Set version
yarn version

# Publish package
yarn publish
```

### **pnpm** - Performant Node Package Manager
**Description**: Fast, disk space efficient package manager for JavaScript
**Location**: `/opt/homebrew/bin/pnpm`
**Common Use Cases**:
- Space-efficient package management
- Faster installs than npm/yarn
- Monorepo management
- Strict dependency management

**Examples**:
```bash
# Install dependencies
pnpm install

# Add package
pnpm add package-name

# Add development dependency
pnpm add -D package-name

# Add global package
pnpm add -g package-name

# Update dependencies
pnpm update

# Remove package
pnpm remove package-name

# Run scripts
pnpm run script-name

# List packages
pnpm list

# Show outdated packages
pnpm outdated

# Show why package exists
pnpm why package-name

# Audit dependencies
pnpm audit

# Create project
pnpm create package-name

# Execute package binary
pnpm exec command

# Manage store
pnpm store status
pnpm store prune

# Workspace commands
pnpm -r run script-name  # recursive
pnpm --filter workspace-name command

# Import from other lockfiles
pnpm import

# Rebuild packages
pnpm rebuild

# Set npm registry
pnpm config set registry https://registry.npmjs.org/
```

### **deno** - Deno Package Management
**Description**: Secure runtime for JavaScript and TypeScript with built-in package management
**Location**: `/opt/homebrew/bin/deno`
**Common Use Cases**:
- TypeScript/JavaScript execution
- URL-based module imports
- Built-in tooling
- Secure by default execution

**Examples**:
```bash
# Run TypeScript/JavaScript file
deno run file.ts
deno run https://deno.land/std/examples/welcome.ts

# Run with permissions
deno run --allow-net --allow-read script.ts

# Install and run script
deno install --allow-net --name myapp https://example.com/script.ts

# Format code
deno fmt

# Lint code
deno lint

# Type check
deno check file.ts

# Test code
deno test

# Bundle for distribution
deno bundle input.ts output.js

# REPL
deno

# Compile to executable
deno compile --output myapp script.ts

# Show information
deno info
deno info script.ts

# Cache dependencies
deno cache deps.ts

# Upgrade deno
deno upgrade

# Show documentation
deno doc

# Task runner
deno task task-name

# Vendor dependencies
deno vendor main.ts
```

### **docker** - Container Platform
**Description**: Platform for developing, shipping, and running applications in containers
**Location**: `/Applications/Docker.app/Contents/Resources/bin/docker`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic containers) / ⭐⭐⭐⭐ Advanced (Networking, volumes)
**Common Use Cases**:
- Application containerization
- Development environment isolation
- Deployment automation

**Essential Examples**:
```bash
# Container Management
docker ps                    # List running containers
docker ps -a                 # List all containers (including stopped)
docker images                # List downloaded images
docker pull nginx:latest     # Download image from registry

# Running Containers
docker run -d nginx                      # Run container in background
docker run -p 8080:80 nginx             # Map port 8080 to container port 80
docker run -it ubuntu bash              # Interactive container with bash
docker run --name myapp -d nginx        # Run with custom name
docker run -v /host:/container nginx    # Mount volume from host

# Container Operations
docker start container_name     # Start stopped container
docker stop container_name      # Stop running container
docker restart container_name   # Restart container
docker rm container_name        # Remove container
docker logs container_name      # View container logs
docker logs -f container_name   # Follow container logs

# Executing Commands in Containers
docker exec -it container_name bash     # Interactive bash session
docker exec container_name ls -la       # Run single command
docker exec -u root container_name bash # Execute as specific user

# Building Images
docker build -t myapp:latest .              # Build image with tag
docker build -f Dockerfile.prod -t myapp .  # Use specific Dockerfile
docker build --no-cache -t myapp .          # Build without cache

# Image Management
docker tag myapp:latest myapp:v1.0     # Tag image
docker push myapp:latest               # Push to registry
docker rmi image_name                  # Remove image
docker system prune                    # Clean up unused resources

# Development Workflows
docker run --rm -v $(pwd):/workspace -w /workspace node:16 npm install
docker-compose up -d                   # Start multi-container application
docker-compose down                    # Stop multi-container application
```

### **docker-compose** - Multi-Container Docker Applications
**Description**: Tool for defining and running multi-container Docker applications
**Location**: `/opt/homebrew/bin/docker-compose`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic compose) / ⭐⭐⭐⭐ Advanced (Complex orchestration)
**Common Use Cases**:
- Multi-container application development
- Local development environment setup
- Testing complex service architectures
- Container orchestration

**See Also**: `docker` (single containers), `kubectl` (Kubernetes), `docker swarm` (Docker native clustering)

**Examples**:
```bash
# Basic docker-compose operations
docker-compose up                    # Start all services defined in docker-compose.yml
docker-compose up -d                 # Start services in background (detached mode)
docker-compose down                  # Stop and remove containers, networks, volumes
docker-compose ps                    # List running services
docker-compose logs                  # View logs from all services
docker-compose logs -f web           # Follow logs for specific service

# Service management
docker-compose start web             # Start specific service
docker-compose stop web              # Stop specific service
docker-compose restart web           # Restart specific service
docker-compose pull                  # Pull latest images for all services
docker-compose build                 # Build images for services with build configuration

# Scaling services
docker-compose up --scale web=3      # Scale web service to 3 instances
docker-compose scale web=2 worker=4 # Scale multiple services

# Development workflows
docker-compose exec web bash         # Execute bash in running web container
docker-compose run --rm web npm test # Run one-off command in new container
docker-compose config                # Validate and view compose configuration

# Environment and configuration
docker-compose -f docker-compose.prod.yml up  # Use specific compose file
docker-compose --env-file .env.prod up        # Use specific environment file
docker-compose up --build                     # Force rebuild of images

# Example docker-compose.yml structure:
# version: '3.8'
# services:
#   web:
#     build: .
#     ports:
#       - "3000:3000"
#     environment:
#       - NODE_ENV=development
#     volumes:
#       - .:/app
#   db:
#     image: postgres:13
#     environment:
#       - POSTGRES_DB=myapp
#       - POSTGRES_PASSWORD=password
#     volumes:
#       - postgres_data:/var/lib/postgresql/data
# volumes:
#   postgres_data:
```

### **terraform** - Infrastructure as Code
**Description**: Tool for building, changing, and versioning infrastructure safely and efficiently
**Location**: `/opt/homebrew/bin/terraform`
**Difficulty**: ⭐⭐⭐⭐ Advanced (Requires infrastructure knowledge) / ⭐⭐⭐⭐⭐ Expert (Complex deployments)
**Common Use Cases**:
- Infrastructure provisioning and management
- Cloud resource automation
- Multi-cloud deployments
- Infrastructure version control

**See Also**: `ansible` (configuration management), `kubectl` (Kubernetes), `aws` (AWS CLI), `gcloud` (Google Cloud)

**Examples**:
```bash
# Basic terraform workflow
terraform init                      # Initialize working directory
terraform plan                      # Create execution plan
terraform apply                     # Apply changes to infrastructure
terraform destroy                   # Destroy managed infrastructure

# State management
terraform show                      # Show current state
terraform state list                # List resources in state
terraform state show resource_name  # Show specific resource details
terraform refresh                   # Update state with real infrastructure

# Workspace management
terraform workspace new dev         # Create new workspace
terraform workspace select prod     # Switch workspace
terraform workspace list            # List workspaces

# Variable and output management
terraform plan -var="region=us-west-2"        # Set variable
terraform plan -var-file="prod.tfvars"        # Use variable file
terraform output                              # Show all outputs
terraform output instance_ip                  # Show specific output

# Import existing infrastructure
terraform import aws_instance.example i-1234567890abcdef0

# Advanced operations
terraform plan -target=aws_instance.web       # Plan specific resource
terraform apply -auto-approve                 # Apply without confirmation
terraform plan -destroy                       # Plan destruction
terraform validate                            # Validate configuration syntax
terraform fmt                                 # Format configuration files

# Example main.tf structure:
# terraform {
#   required_providers {
#     aws = {
#       source  = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#   }
# }
# 
# provider "aws" {
#   region = var.aws_region
# }
# 
# resource "aws_instance" "web" {
#   ami           = "ami-0c55b159cbfafe1d0"
#   instance_type = "t2.micro"
#   tags = {
#     Name = "HelloWorld"
#   }
# }
```

### **kubectl** - Kubernetes Command Line Tool
**Description**: Command-line tool for controlling Kubernetes clusters
**Location**: `/Applications/Docker.app/Contents/Resources/bin/kubectl`
**Difficulty**: ⭐⭐⭐⭐ Advanced (Requires Kubernetes knowledge)
**Common Use Cases**:
- Kubernetes cluster management
- Application deployment and scaling
- Container orchestration
- Service discovery and networking

**Essential Examples**:
```bash
# Cluster Information
kubectl cluster-info                    # Display cluster information
kubectl version                        # Show client and server versions
kubectl config get-contexts            # List available contexts
kubectl config use-context my-context  # Switch to different cluster

# Pod Management
kubectl get pods                       # List all pods in current namespace
kubectl get pods -A                    # List pods in all namespaces
kubectl describe pod my-pod            # Get detailed pod information
kubectl logs my-pod                    # View pod logs
kubectl exec -it my-pod -- bash       # Execute commands in pod

# Deployment Operations
kubectl create deployment nginx --image=nginx    # Create deployment
kubectl get deployments               # List deployments
kubectl scale deployment nginx --replicas=3     # Scale deployment
kubectl set image deployment/nginx nginx=nginx:1.20  # Update image
kubectl rollout status deployment/nginx         # Check rollout status

# Service Management
kubectl expose deployment nginx --port=80 --type=LoadBalancer  # Create service
kubectl get services                   # List services
kubectl port-forward service/nginx 8080:80      # Forward local port to service

# Configuration and Secrets
kubectl create configmap my-config --from-file=config.yaml
kubectl create secret generic my-secret --from-literal=key=value
kubectl get configmaps                 # List config maps
kubectl get secrets                    # List secrets

# Namespace Operations
kubectl get namespaces                 # List namespaces
kubectl create namespace my-namespace  # Create namespace
kubectl config set-context --current --namespace=my-namespace  # Switch namespace

# Resource Management
kubectl apply -f deployment.yaml      # Apply configuration from file
kubectl delete -f deployment.yaml     # Delete resources from file
kubectl get all                       # List all resources in namespace

# Troubleshooting
kubectl describe nodes                 # Check node status
kubectl top nodes                     # Show node resource usage
kubectl top pods                      # Show pod resource usage
```

### **gcloud** - Google Cloud Platform CLI
**Description**: Command-line tool for Google Cloud Platform services and resources
**Location**: `/Users/allen/Downloads/google-cloud-sdk/bin/gcloud`
**Common Use Cases**:
- Google Cloud resource management
- Application deployment
- Service configuration
- Infrastructure management

**Essential Examples**:
```bash
# Authentication and Configuration
gcloud auth login                      # Authenticate with Google account
gcloud config set project my-project  # Set default project
gcloud config list                    # Show current configuration
gcloud auth application-default login # Set up Application Default Credentials

# Project Management
gcloud projects list                   # List all projects
gcloud projects create my-new-project # Create new project
gcloud config set project PROJECT_ID  # Switch to different project

# Compute Engine
gcloud compute instances list          # List VM instances
gcloud compute instances create my-vm --image-family=debian-10 --image-project=debian-cloud
gcloud compute instances start my-vm   # Start instance
gcloud compute instances stop my-vm    # Stop instance
gcloud compute ssh my-vm              # SSH into instance

# Cloud Storage
gcloud storage buckets list           # List storage buckets
gcloud storage buckets create gs://my-bucket  # Create bucket
gcloud storage cp file.txt gs://my-bucket/    # Upload file
gcloud storage cp gs://my-bucket/file.txt .   # Download file

# App Engine
gcloud app deploy                     # Deploy application
gcloud app browse                     # Open app in browser
gcloud app logs tail -s default       # Stream logs

# Cloud Run
gcloud run services list              # List Cloud Run services
gcloud run deploy --image gcr.io/my-project/my-app --platform managed
gcloud run services delete my-service # Delete service

# Container Registry
gcloud builds submit --tag gcr.io/my-project/my-app  # Build and push image
gcloud container images list         # List container images

# Identity and Access Management (IAM)
gcloud iam service-accounts list     # List service accounts
gcloud iam service-accounts create my-account --display-name="My Service Account"
gcloud projects add-iam-policy-binding my-project --member="user:email@gmail.com" --role="roles/viewer"

# Cloud SQL
gcloud sql instances list            # List database instances
gcloud sql instances create my-db --tier=db-f1-micro --region=us-central1
gcloud sql databases create my-database --instance=my-db

# Kubernetes Engine
gcloud container clusters list       # List GKE clusters
gcloud container clusters create my-cluster --num-nodes=3
gcloud container clusters get-credentials my-cluster  # Configure kubectl

# Monitoring and Logging
gcloud logging logs list             # List available logs
gcloud logging read "resource.type=gce_instance" --limit=10  # Read logs
```

---

## Network Tools

### **curl** - Data Transfer Tool
**Description**: Tool for transferring data with URLs supporting many protocols
**Location**: `/usr/bin/curl`
**Difficulty**: ⭐⭐ Beginner (Simple requests) / ⭐⭐⭐⭐ Advanced (Complex auth, scripting)
**Common Use Cases**:
- HTTP API testing
- File downloading
- Web service interaction

**See Also**: `wget` (batch downloading), `ssh` (secure remote access), `rsync` (file synchronization)

**Examples**:
```bash
# Basic HTTP requests
curl https://api.example.com                    # Simple GET request
curl -I https://example.com                     # Headers only (HEAD request)
curl -L https://example.com                     # Follow redirects
curl -s https://api.example.com                 # Silent mode (no progress)

# POST requests and data submission
curl -X POST https://api.example.com            # Basic POST
curl -X POST -d "name=value" https://api.example.com
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://api.example.com
curl -X POST -d @data.json https://api.example.com  # POST from file

# Authentication
curl -u username:password https://api.example.com   # Basic auth
curl -H "Authorization: Bearer token123" https://api.example.com
curl -H "X-API-Key: key123" https://api.example.com

# File operations
curl -O https://example.com/file.zip            # Download with original filename
curl -o custom.zip https://example.com/file.zip # Download with custom filename
curl -C - -O https://example.com/large.iso      # Resume interrupted download
curl -T file.txt ftp://server.com/              # Upload file

# Advanced options
curl -v https://api.example.com                 # Verbose output for debugging
curl --cookie "session=abc123" https://example.com
curl --cookie-jar cookies.txt https://example.com
curl -w "%{http_code} %{time_total}\n" https://api.example.com  # Custom output format
curl --max-time 30 https://api.example.com      # Timeout after 30 seconds

# Multiple requests
curl https://api.example.com/{users,posts,comments}  # Multiple URLs
curl -Z https://example.com/file[1-10].txt      # Parallel downloads

# Testing and monitoring
curl -w "@curl-format.txt" https://api.example.com  # Custom timing format
curl --trace-ascii debug.txt https://api.example.com  # Full trace
curl -o /dev/null -s -w "%{http_code}\n" https://api.example.com  # Status code only
```

### **wget** - File Downloader
**Description**: Non-interactive network downloader
**Location**: `/opt/homebrew/bin/wget`
**Common Use Cases**:
- Bulk file downloading
- Website mirroring
- Automated downloads

**See Also**: `curl` (HTTP API testing), `rsync` (bidirectional sync), `scp` (secure copy)

**Examples**:
```bash
# Download file
wget https://example.com/file.zip

# Mirror website
wget -m -np https://example.com/

# Limit download speed
wget --limit-rate=300k url
```

### **ssh** - Secure Shell
**Description**: OpenSSH remote login client
**Location**: `/opt/homebrew/bin/ssh`
**Common Use Cases**:
- Remote server access
- Secure file transfer
- Tunnel creation

**Examples**:
```bash
# Connect to server
ssh user@hostname

# Use specific key
ssh -i keyfile user@hostname

# Port forwarding
ssh -L 8080:localhost:80 user@hostname

# Jump through bastion
ssh -J bastion@host user@target
```

### **scp** - Secure Copy
**Description**: OpenSSH secure file copy
**Location**: `/opt/homebrew/bin/scp`
**Common Use Cases**:
- Secure file transfer between hosts
- Remote file copying
- Backup operations

**Examples**:
```bash
# Copy file to remote
scp file.txt user@host:/path/

# Copy from remote
scp user@host:/path/file.txt .

# Recursive directory copy
scp -r directory/ user@host:/path/
```

### **rsync** - File Synchronization
**Description**: Efficient file transfer and synchronization
**Location**: `/usr/bin/rsync`
**Common Use Cases**:
- Incremental backups
- Large file transfers
- Directory synchronization

**Examples**:
```bash
# Sync directories
rsync -av source/ destination/

# Remote sync with compression
rsync -avz source/ user@host:/path/

# Delete extra files
rsync -av --delete source/ destination/
```

### **ping** - Network Connectivity Test
**Description**: Send ICMP echo requests to test network connectivity
**Location**: `/sbin/ping`
**Common Use Cases**:
- Network troubleshooting
- Connectivity testing
- Network latency measurement
- Host reachability verification

**Examples**:
```bash
# Basic ping
ping google.com

# Ping specific number of times
ping -c 4 8.8.8.8

# Ping with interval
ping -i 2 hostname

# Ping with specific packet size
ping -s 1000 hostname

# Quiet output (only summary)
ping -q -c 10 hostname

# Ping IPv6
ping6 ipv6.google.com

# Ping with timestamp
ping -D hostname

# Continuous ping with statistics
ping -c 100 hostname | tail -2
```

### **dig** - DNS Lookup Tool
**Description**: DNS lookup utility for querying DNS servers
**Location**: `/usr/bin/dig`
**Common Use Cases**:
- DNS troubleshooting
- Domain information lookup
- DNS server testing
- Network diagnostics

**Examples**:
```bash
# Basic DNS lookup
dig example.com

# Query specific record type
dig example.com MX
dig example.com AAAA
dig example.com TXT

# Query specific DNS server
dig @8.8.8.8 example.com

# Reverse DNS lookup
dig -x 8.8.8.8

# Short answer format
dig +short example.com
dig +short example.com MX

# Trace DNS resolution path
dig +trace example.com

# Query all record types
dig example.com ANY

# Query with specific DNS class
dig example.com IN A

# Batch queries from file
dig -f hostnames.txt

# DNS server testing
dig @ns1.example.com example.com SOA
```

### **nslookup** - DNS Lookup (Interactive)
**Description**: Interactive DNS lookup utility
**Location**: `/usr/bin/nslookup`
**Common Use Cases**:
- Interactive DNS queries
- DNS server configuration testing
- Domain troubleshooting
- Legacy DNS lookups

**Examples**:
```bash
# Basic lookup
nslookup example.com

# Specify DNS server
nslookup example.com 8.8.8.8

# Interactive mode
nslookup
> set type=MX
> example.com
> set server=8.8.8.8
> example.com
> exit

# Reverse lookup
nslookup 8.8.8.8

# Query specific record types
nslookup -type=SOA example.com
nslookup -type=NS example.com
nslookup -type=TXT example.com

# Debug mode
nslookup -debug example.com
```

### **host** - DNS Lookup Utility
**Description**: Simple DNS lookup utility
**Location**: `/usr/bin/host`
**Common Use Cases**:
- Quick DNS lookups
- Simple domain verification
- Scripted DNS queries
- Basic network troubleshooting

**Examples**:
```bash
# Basic lookup
host example.com

# Specific record type
host -t MX example.com
host -t AAAA example.com
host -t TXT example.com

# All record types
host -a example.com

# Reverse lookup
host 8.8.8.8

# Specify DNS server
host example.com 8.8.8.8

# Verbose output
host -v example.com

# Query class and type
host -C example.com
host -t ANY example.com
```

### **whois** - Domain Information
**Description**: Query domain registration and ownership information
**Location**: `/usr/bin/whois`
**Common Use Cases**:
- Domain ownership research
- Registration expiration checking
- Contact information lookup
- IP address block information

**Examples**:
```bash
# Domain whois lookup
whois example.com

# IP address whois
whois 8.8.8.8

# Specific whois server
whois -h whois.verisign-grs.com example.com

# ASN lookup
whois AS15169

# Network range lookup
whois -B 192.168.1.1

# Disable referral following
whois -r example.com

# Raw output format
whois -R example.com
```

### **nc (netcat)** - Network Swiss Army Knife
**Description**: Versatile networking utility for reading/writing network connections
**Location**: `/usr/bin/nc`
**Common Use Cases**:
- Port scanning
- Network service testing
- File transfer over network
- Simple client/server setup

**Examples**:
```bash
# Port scanning
nc -zv hostname 22
nc -zv hostname 80-443

# Listen on port (server mode)
nc -l 8080

# Connect to service
nc hostname 80

# File transfer (sender)
nc -l 9999 < file.txt

# File transfer (receiver)
nc hostname 9999 > received_file.txt

# Chat server
nc -l 9999

# Banner grabbing
echo \"\" | nc hostname 80

# UDP mode
nc -u hostname 53

# Test HTTP service
echo -e \"GET / HTTP/1.0\\n\\n\" | nc hostname 80

# Proxy/relay
nc -l 8080 | nc target_host 80

# Port forwarding
mkfifo backpipe
nc -l 8080 0<backpipe | nc target_host 80 1>backpipe
```

### **telnet** - Remote Terminal Connection
**Description**: User interface to TELNET protocol for remote connections
**Location**: `/usr/bin/telnet`
**Common Use Cases**:
- Service connectivity testing
- Protocol debugging
- Legacy system access
- Network service troubleshooting

**Examples**:
```bash
# Connect to telnet service
telnet hostname 23

# Test HTTP service
telnet hostname 80
# Then type: GET / HTTP/1.0

# Test SMTP service
telnet mail.server.com 25

# Test SSH service (check if listening)
telnet hostname 22

# Escape commands in telnet session
# Ctrl+] to enter command mode
# quit to exit

# Test custom port
telnet hostname 8080

# Connect with specific options
telnet -e ! hostname

# Script-friendly connection test
echo \"quit\" | telnet hostname port
```

### **traceroute** - Network Path Tracing
**Description**: Trace the route packets take to reach destination
**Location**: `/usr/sbin/traceroute`
**Common Use Cases**:
- Network path analysis
- Routing troubleshooting
- Network latency identification
- Connection problem diagnosis

**Examples**:
```bash
# Basic traceroute
traceroute google.com

# Specify maximum hops
traceroute -m 20 hostname

# Use ICMP instead of UDP
traceroute -I hostname

# Use TCP SYN packets
traceroute -T hostname

# Specify port
traceroute -p 80 hostname

# Disable hostname resolution
traceroute -n hostname

# Specify interface
traceroute -i eth0 hostname

# IPv6 traceroute
traceroute6 hostname

# Continuous traceroute
while true; do traceroute hostname; sleep 60; done
```

### **netstat** - Network Statistics
**Description**: Display network connections, routing tables, and network statistics
**Location**: `/usr/bin/netstat`
**Common Use Cases**:
- Active connection monitoring
- Port usage analysis
- Network troubleshooting
- Service verification

**Examples**:
```bash
# Show all connections
netstat -a

# Show listening ports only
netstat -l

# Show with process names (requires privileges)
netstat -p

# Show numerical addresses
netstat -n

# Show routing table
netstat -r

# Show network statistics
netstat -s

# Show specific protocol
netstat -t  # TCP
netstat -u  # UDP

# Continuous monitoring
netstat -c

# Show listening TCP ports with processes
netstat -tlnp

# Find who's using a specific port
netstat -tulpn | grep :80

# Show network interfaces
netstat -i
```

### **ss** - Socket Statistics (Modern netstat)
**Description**: Modern replacement for netstat with better performance
**Location**: `/usr/bin/ss` (if available)
**Common Use Cases**:
- Fast socket information display
- Network connection analysis
- Service monitoring
- Performance-optimized network stats

**Examples**:
```bash
# Show all sockets
ss -a

# Show listening sockets
ss -l

# Show TCP sockets
ss -t

# Show UDP sockets
ss -u

# Show with process information
ss -p

# Show numerical addresses
ss -n

# Show socket summary
ss -s

# Filter by state
ss state listening
ss state established

# Filter by port
ss -tulpn | grep :80
ss dst :443

# Show socket memory usage
ss -m

# Continuous monitoring
ss -i
```

### **arp** - Address Resolution Protocol
**Description**: Display and modify ARP cache (IP to MAC address mapping)
**Location**: `/usr/sbin/arp`
**Common Use Cases**:
- Network troubleshooting
- MAC address discovery
- ARP cache management
- Local network analysis

**Examples**:
```bash
# Display ARP cache
arp -a

# Show specific host
arp hostname

# Show numerical addresses
arp -n

# Delete ARP entry
arp -d hostname

# Add static ARP entry
arp -s hostname 00:11:22:33:44:55

# Flush entire ARP cache
arp -d -a

# Show ARP cache for specific interface
arp -i eth0 -a
```

### **ifconfig** - Network Interface Configuration
**Description**: Configure and display network interface parameters
**Location**: `/sbin/ifconfig`
**Common Use Cases**:
- Interface configuration
- IP address management
- Network troubleshooting
- Interface status checking

**Examples**:
```bash
# Show all interfaces
ifconfig

# Show specific interface
ifconfig en0

# Assign IP address
ifconfig en0 192.168.1.100

# Set netmask
ifconfig en0 192.168.1.100 netmask 255.255.255.0

# Enable/disable interface
ifconfig en0 up
ifconfig en0 down

# Set MAC address
ifconfig en0 ether 00:11:22:33:44:55

# Configure MTU
ifconfig en0 mtu 1500

# Show interface statistics
ifconfig -a

# Create alias interface
ifconfig en0:1 192.168.1.101
```

### **nslookup** - DNS Lookup
**Description**: Query DNS servers for domain name or IP address mapping
**Location**: `/usr/bin/nslookup`
**Common Use Cases**:
- DNS troubleshooting
- Domain name resolution
- Reverse DNS lookups
- DNS record queries

**See Also**: `dig` (advanced DNS tool), `host` (simple DNS lookup)

**Examples**:
```bash
# Basic domain lookup
nslookup google.com

# Reverse lookup (IP to domain)
nslookup 8.8.8.8

# Query specific DNS server
nslookup google.com 8.8.8.8

# Interactive mode
nslookup
> set type=MX
> google.com
> exit

# Query specific record types
nslookup -type=MX google.com
nslookup -type=NS google.com
nslookup -type=TXT google.com
```

### **host** - DNS Lookup Utility
**Description**: Simple DNS lookup utility
**Location**: `/usr/bin/host`
**Common Use Cases**:
- Quick DNS queries
- Domain validation
- DNS record enumeration
- Reverse lookups

**See Also**: `nslookup` (interactive DNS), `dig` (detailed DNS)

**Examples**:
```bash
# Basic lookup
host google.com

# Reverse lookup
host 8.8.8.8

# All record types
host -a google.com

# Specific record types
host -t MX google.com
host -t NS google.com
host -t TXT google.com

# Use specific DNS server
host google.com 8.8.8.8

# Verbose output
host -v google.com
```

### **whois** - Domain Information Lookup
**Description**: Client for the whois directory service
**Location**: `/usr/bin/whois`
**Common Use Cases**:
- Domain registration information
- IP address ownership
- Contact information lookup
- Domain expiration checking

**See Also**: `host` (DNS lookup), `nslookup` (DNS queries)

**Examples**:
```bash
# Domain information
whois google.com

# IP address information
whois 8.8.8.8

# Specific whois server
whois -h whois.internic.net google.com

# Brief output
whois -B google.com

# Follow referrals
whois -R google.com
```

### **arp** - Address Resolution Protocol
**Description**: Display and modify ARP cache
**Location**: `/usr/sbin/arp`
**Common Use Cases**:
- Network troubleshooting
- MAC address discovery
- ARP cache management
- Local network analysis

**See Also**: `ping` (connectivity test), `netstat` (network status)

**Examples**:
```bash
# Display ARP cache
arp -a

# Look up specific host
arp hostname

# Display numeric addresses
arp -n

# Delete ARP entry (requires sudo)
sudo arp -d hostname

# Add static ARP entry (requires sudo)
sudo arp -s ip_address mac_address
```

### **finger** - User Information Lookup
**Description**: User information lookup program
**Location**: `/usr/bin/finger`
**Common Use Cases**:
- User information display
- Login status checking
- Remote user queries
- System user enumeration

**See Also**: `who` (logged in users), `w` (user activity)

**Examples**:
```bash
# Local user information
finger username

# All local users
finger

# Remote user (if enabled)
finger user@hostname

# Short format
finger -s

# Long format
finger -l

# Show only login name and full name
finger -p username
```

### **tcpdump** - Network Packet Analyzer
**Description**: Command-line packet analyzer for network traffic capture and analysis
**Location**: `/usr/sbin/tcpdump`
**Common Use Cases**:
- Network troubleshooting
- Security monitoring
- Protocol analysis
- Performance debugging

**See Also**: `wireshark` (GUI alternative), `netstat` (network status), `lsof` (network connections)

**Examples**:
```bash
# Capture all traffic on interface
sudo tcpdump -i en0

# Capture specific protocol
sudo tcpdump icmp
sudo tcpdump tcp
sudo tcpdump udp

# Capture specific port
sudo tcpdump port 80
sudo tcpdump port 443
sudo tcpdump port ssh

# Capture specific host
sudo tcpdump host google.com
sudo tcpdump src host 192.168.1.1
sudo tcpdump dst host 10.0.0.1

# Save to file
sudo tcpdump -w capture.pcap

# Read from file
tcpdump -r capture.pcap

# Verbose output with timestamps
sudo tcpdump -tttt -v

# Capture specific number of packets
sudo tcpdump -c 100

# Don't resolve hostnames (faster)
sudo tcpdump -n

# Show packet contents in hex and ASCII
sudo tcpdump -X

# Complex filters
sudo tcpdump 'tcp port 80 and (src host 192.168.1.1 or dst host 192.168.1.1)'
sudo tcpdump 'not port 22'  # Exclude SSH traffic

# Monitor HTTP traffic
sudo tcpdump -A -s 0 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)'
```

### **nmap** - Network Discovery and Security Auditing
**Description**: Network exploration tool and security/port scanner
**Location**: `/opt/homebrew/bin/nmap`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic scans) / ⭐⭐⭐⭐⭐ Expert (Advanced techniques)
**Common Use Cases**:
- Network discovery and mapping
- Port scanning and service detection
- Security auditing and vulnerability assessment
- Network troubleshooting

**See Also**: `nc` (netcat), `masscan` (fast port scanner), `zmap` (internet-wide scanner)

**Examples**:
```bash
# Basic host discovery
nmap 192.168.1.1                   # Scan single host
nmap 192.168.1.0/24               # Scan entire subnet
nmap 192.168.1.1-100              # Scan IP range

# Port scanning
nmap -p 80,443 192.168.1.1         # Scan specific ports
nmap -p 1-1000 192.168.1.1         # Scan port range
nmap -p- 192.168.1.1               # Scan all ports (1-65535)
nmap --top-ports 100 192.168.1.1   # Scan most common 100 ports

# Service and OS detection
nmap -sV 192.168.1.1               # Version detection
nmap -sS 192.168.1.1               # SYN scan (stealth)
nmap -O 192.168.1.1                # OS detection
nmap -A 192.168.1.1                # Aggressive scan (OS, version, scripts)

# Host discovery
nmap -sn 192.168.1.0/24            # Ping scan (no port scan)
nmap -PS80,443 192.168.1.0/24      # TCP SYN ping
nmap -PU 192.168.1.0/24            # UDP ping

# Stealth and timing
nmap -sS -T4 192.168.1.1           # Fast SYN scan
nmap -sF 192.168.1.1               # FIN scan
nmap -sN 192.168.1.1               # Null scan
nmap -T1 192.168.1.1               # Paranoid timing (very slow)

# Output formats
nmap -oN scan_results.txt 192.168.1.1      # Normal output
nmap -oX scan_results.xml 192.168.1.1      # XML output
nmap -oG scan_results.gnmap 192.168.1.1    # Greppable output
nmap -oA scan_results 192.168.1.1          # All formats

# NSE scripts (Nmap Scripting Engine)
nmap --script vuln 192.168.1.1             # Vulnerability detection
nmap --script default 192.168.1.1          # Default scripts
nmap --script http-enum 192.168.1.1        # HTTP enumeration
nmap --script ssl-cert 192.168.1.1         # SSL certificate info

# CAUTION: Use responsibly and only on networks you own or have permission to scan
```

### **masscan** - Fast Port Scanner
**Description**: Extremely fast Internet port scanner, capable of scanning the entire Internet in under 6 minutes
**Location**: `/opt/homebrew/bin/masscan`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic scans) / ⭐⭐⭐⭐⭐ Expert (Internet-scale scanning)
**Common Use Cases**:
- High-speed port scanning of large networks
- Internet-wide scanning and reconnaissance
- Fast discovery of open ports across many hosts
- Performance-critical network reconnaissance

**See Also**: `nmap` (detailed scanning), `zmap` (Internet-wide scanning), `unicornscan` (packet manipulation)

⚠️ **SECURITY WARNING**: 
- **Extremely powerful tool** - can overwhelm networks and systems
- **Use only on networks you own** or have explicit permission to scan
- **Can appear as attacks** to intrusion detection systems
- **Follow responsible disclosure** for any vulnerabilities found

**Examples**:
```bash
# Basic port scanning
masscan -p80 192.168.1.0/24              # Scan port 80 on subnet
masscan -p22,80,443 192.168.1.1-100      # Multiple ports, IP range
masscan -p1-1000 192.168.1.1             # Port range

# Rate limiting (important!)
masscan -p80 192.168.1.0/24 --rate 1000  # Limit to 1000 packets/second
masscan -p80 192.168.1.0/24 --rate 100   # Conservative rate
masscan -p80 192.168.1.0/24 --rate 10000 # Aggressive rate (use carefully)

# Output formats
masscan -p80 192.168.1.0/24 -oG scan.gnmap    # Greppable format
masscan -p80 192.168.1.0/24 -oX scan.xml      # XML format
masscan -p80 192.168.1.0/24 -oJ scan.json     # JSON format
masscan -p80 192.168.1.0/24 -oL scan.list     # List format

# Advanced scanning options
masscan -p80 192.168.1.0/24 --banners         # Grab banners (service detection)
masscan -p80 192.168.1.0/24 --source-port 40000  # Use specific source port
masscan -p80 192.168.1.0/24 --adapter-ip 192.168.1.200  # Set source IP

# Large-scale scanning (use with extreme caution)
masscan -p80,443 0.0.0.0/0 --rate 1000 --exclude 255.255.255.255  # Scan entire Internet
masscan -p22 10.0.0.0/8 --rate 100 --excludefile exclude.txt      # Scan private network

# Configuration file
masscan -c /path/to/masscan.conf           # Use configuration file
# Example config file content:
# rate = 1000
# output-format = xml
# output-filename = scan.xml
# ports = 80,443,22,21,25,53,110,143,993,995
# range = 192.168.1.0/24

# Performance and safety tips
masscan -p80 192.168.1.0/24 --rate 100 --wait 2    # Add delay between packets
masscan -p80 192.168.1.0/24 --adapter en0           # Specify network interface
masscan --list-adapters                             # List available adapters

# Integration with other tools
masscan -p80 192.168.1.0/24 -oL - | awk '{print $4}' | sort -u  # Extract IPs
nmap -sV -p $(masscan -p1-1000 192.168.1.1 -oL - | grep open | cut -d' ' -f3 | tr '\n' ',' | sed 's/,$//') 192.168.1.1
```

### **iftop** - Network Bandwidth Monitor
**Description**: Real-time network bandwidth usage monitor by host
**Location**: `/opt/homebrew/bin/iftop`
**Difficulty**: ⭐⭐⭐ Intermediate (Requires root, interface knowledge)
**Common Use Cases**:
- Monitor network bandwidth usage in real-time
- Identify network-heavy processes and connections
- Network troubleshooting and analysis
- Bandwidth usage by host pairs

**See Also**: `netstat` (network connections), `ss` (socket statistics), `vnstat` (network statistics)

**Examples**:
```bash
# Basic usage (requires root privileges)
sudo iftop                         # Monitor default interface
sudo iftop -i eth0                 # Monitor specific interface
sudo iftop -i en0                  # Monitor specific interface (macOS)

# Filtering options
sudo iftop -f "port 80"            # Monitor only HTTP traffic
sudo iftop -f "host 192.168.1.1"  # Monitor traffic to/from specific host
sudo iftop -f "not port 22"       # Exclude SSH traffic

# Display options
sudo iftop -P                      # Show port numbers
sudo iftop -n                      # Don't resolve hostnames
sudo iftop -N                      # Don't resolve port numbers
sudo iftop -b                      # Don't show bar graphs

# Sorting and limits
sudo iftop -o 2s                   # Sort by 2-second average
sudo iftop -o 10s                  # Sort by 10-second average
sudo iftop -o 40s                  # Sort by 40-second average

# Key bindings inside iftop:
# h - help
# n - toggle hostname resolution
# s/d - toggle show source/destination
# p - toggle port display
# P - pause display
# b - toggle bar graph display
# B - cycle through bar graph styles
# t - cycle through line display modes
# T - toggle cumulative line totals
# j/k - scroll down/up
# < > - sort by left/right column
# q - quit

# Useful filtering examples
sudo iftop -f "dst net 192.168.1.0/24"    # Traffic to local network
sudo iftop -f "port http or port https"    # Web traffic only
sudo iftop -f "not port domain"            # Exclude DNS traffic

# Note: iftop requires root privileges to capture packets
# Use with caution and only monitor networks you own or have permission to monitor
```

### **ansible** - IT Automation and Configuration Management
**Description**: Automation platform for configuration management, application deployment, and task automation
**Location**: `/opt/homebrew/bin/ansible`
**Difficulty**: ⭐⭐⭐⭐ Advanced (Infrastructure knowledge required) / ⭐⭐⭐⭐⭐ Expert (Complex playbooks)
**Common Use Cases**:
- Server configuration management
- Application deployment automation
- Infrastructure provisioning
- Multi-system orchestration

**See Also**: `terraform` (infrastructure as code), `puppet` (configuration management), `chef` (automation platform)

**Examples**:
```bash
# Basic ansible commands
ansible all -m ping                        # Test connectivity to all hosts
ansible webservers -m ping                 # Test specific group
ansible-inventory --list                   # List inventory
ansible-config dump                        # Show configuration

# Ad-hoc commands
ansible all -m setup                       # Gather facts from all hosts
ansible webservers -m shell -a "uptime"    # Run shell command
ansible all -m copy -a "src=/etc/hosts dest=/tmp/hosts"  # Copy files
ansible dbservers -m service -a "name=mysql state=started"  # Manage services

# Using ansible-playbook
ansible-playbook playbook.yml             # Run playbook
ansible-playbook playbook.yml --check     # Dry run (check mode)
ansible-playbook playbook.yml --diff      # Show file differences
ansible-playbook playbook.yml --limit webservers  # Limit to specific hosts

# Inventory management
ansible-inventory -i inventory.ini --list # Use specific inventory
ansible all -i "localhost," -c local -m ping  # Use dynamic inventory

# Variable handling
ansible-playbook playbook.yml -e "variable=value"  # Extra variables
ansible-playbook playbook.yml --ask-vault-pass     # Prompt for vault password

# Example playbook structure:
# ---
# - hosts: webservers
#   become: yes
#   tasks:
#     - name: Install nginx
#       package:
#         name: nginx
#         state: present
#     - name: Start nginx
#       service:
#         name: nginx
#         state: started
#         enabled: yes

# Vault for sensitive data
ansible-vault create secrets.yml          # Create encrypted file
ansible-vault edit secrets.yml            # Edit encrypted file
ansible-vault encrypt vars.yml            # Encrypt existing file
ansible-vault decrypt vars.yml            # Decrypt file

# Galaxy for roles and collections
ansible-galaxy install geerlingguy.nginx  # Install role from Galaxy
ansible-galaxy collection install community.general  # Install collection
```

### **aws** - Amazon Web Services CLI
**Description**: Unified command line interface for Amazon Web Services
**Location**: `/opt/homebrew/bin/aws`
**Difficulty**: ⭐⭐⭐⭐ Advanced (AWS knowledge required) / ⭐⭐⭐⭐⭐ Expert (Complex operations)
**Common Use Cases**:
- AWS resource management and automation
- Cloud infrastructure operations
- Service deployment and monitoring
- Data transfer and backup operations

**See Also**: `gcloud` (Google Cloud), `azure` (Microsoft Azure), `terraform` (multi-cloud IaC)

**Examples**:
```bash
# Configuration and authentication
aws configure                              # Interactive configuration
aws configure set aws_access_key_id YOUR_KEY
aws configure set aws_secret_access_key YOUR_SECRET
aws configure set default.region us-west-2
aws configure list                         # Show current configuration

# S3 operations
aws s3 ls                                  # List all buckets
aws s3 ls s3://bucket-name                 # List bucket contents
aws s3 cp file.txt s3://bucket-name/       # Upload file
aws s3 cp s3://bucket-name/file.txt ./     # Download file
aws s3 sync ./local-folder s3://bucket-name/  # Sync directories
aws s3 rm s3://bucket-name/file.txt        # Delete file

# EC2 operations
aws ec2 describe-instances                 # List all instances
aws ec2 describe-instances --instance-ids i-1234567890abcdef0
aws ec2 start-instances --instance-ids i-1234567890abcdef0
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
aws ec2 describe-security-groups          # List security groups

# IAM operations
aws iam list-users                         # List IAM users
aws iam get-user --user-name username      # Get specific user info
aws iam list-policies                      # List policies
aws iam create-user --user-name newuser    # Create user

# CloudFormation
aws cloudformation list-stacks             # List CloudFormation stacks
aws cloudformation describe-stacks --stack-name my-stack
aws cloudformation create-stack --stack-name my-stack --template-body file://template.yaml

# Lambda functions
aws lambda list-functions                  # List Lambda functions
aws lambda invoke --function-name my-function output.txt
aws lambda update-function-code --function-name my-function --zip-file fileb://function.zip

# Output formatting
aws ec2 describe-instances --output table  # Table format
aws ec2 describe-instances --output json   # JSON format (default)
aws ec2 describe-instances --output text   # Text format

# JQ integration for JSON processing
aws ec2 describe-instances | jq '.Reservations[].Instances[].InstanceId'
aws s3api list-objects --bucket my-bucket | jq '.Contents[].Key'

# Profiles for multiple accounts
aws configure --profile production
aws s3 ls --profile production
aws configure set profile.development.region us-east-1
```

---

## Security Tools

### **gpg** - GNU Privacy Guard
**Description**: Complete implementation of OpenPGP standard for encryption and digital signatures
**Location**: `/opt/homebrew/bin/gpg`
**Common Use Cases**:
- File encryption and decryption
- Digital signatures
- Key management
- Secure communication

**Examples**:
```bash
# Generate new key pair
gpg --generate-key

# List keys
gpg --list-keys
gpg --list-secret-keys

# Encrypt file
gpg --encrypt --recipient user@example.com file.txt

# Decrypt file
gpg --decrypt file.txt.gpg

# Sign file
gpg --sign file.txt

# Verify signature
gpg --verify file.txt.gpg

# Export public key
gpg --export --armor user@example.com > publickey.asc

# Import key
gpg --import publickey.asc

# Encrypt and sign
gpg --encrypt --sign --recipient user@example.com file.txt

# Symmetric encryption
gpg --symmetric file.txt
```

### **openssl** - SSL/TLS Toolkit
**Description**: Cryptography toolkit implementing SSL/TLS protocols
**Location**: `/usr/bin/openssl`
**Common Use Cases**:
- Certificate generation and management
- Encryption and decryption
- Hash generation
- SSL/TLS testing

**Examples**:
```bash
# Generate RSA private key
openssl genrsa -out private.key 2048

# Generate public key from private
openssl rsa -in private.key -pubout -out public.key

# Create certificate signing request
openssl req -new -key private.key -out cert.csr

# Generate self-signed certificate
openssl req -x509 -new -key private.key -days 365 -out cert.crt

# View certificate details
openssl x509 -in cert.crt -text -noout

# Test SSL connection
openssl s_client -connect hostname:443

# Generate password hash
openssl passwd -6 mypassword

# Encrypt file
openssl enc -aes256 -in file.txt -out file.enc

# Decrypt file
openssl dec -aes256 -in file.enc -out file.txt

# Generate random data
openssl rand -base64 32

# Calculate file hash
openssl dgst -sha256 file.txt

# Convert certificate formats
openssl x509 -in cert.crt -outform DER -out cert.der
```

### **ssh-keygen** - SSH Key Generation
**Description**: Generate, manage, and convert SSH authentication keys
**Location**: `/usr/bin/ssh-keygen`
**Common Use Cases**:
- SSH key pair generation
- Key conversion and management
- Host key management
- Authentication setup

**Examples**:
```bash
# Generate new SSH key pair
ssh-keygen -t rsa -b 4096 -C "user@example.com"

# Generate Ed25519 key (recommended)
ssh-keygen -t ed25519 -C "user@example.com"

# Generate key with specific filename
ssh-keygen -t rsa -f ~/.ssh/specific_key

# Change key passphrase
ssh-keygen -p -f ~/.ssh/id_rsa

# Show key fingerprint
ssh-keygen -lf ~/.ssh/id_rsa.pub

# Convert private key format
ssh-keygen -p -m PEM -f ~/.ssh/id_rsa

# Generate host keys
ssh-keygen -A

# Remove host from known_hosts
ssh-keygen -R hostname

# Test key against server
ssh-keygen -F hostname

# Export public key in different format
ssh-keygen -e -f ~/.ssh/id_rsa.pub
```

### **md5sum/shasum** - Checksum Utilities
**Description**: Calculate and verify MD5/SHA checksums
**Location**: `/usr/bin/md5`, `/usr/bin/shasum`
**Common Use Cases**:
- File integrity verification
- Data corruption detection
- Security auditing
- Change detection

**Examples**:
```bash
# Calculate MD5 checksum (macOS)
md5 file.txt

# Calculate SHA checksums
shasum -a 1 file.txt    # SHA-1
shasum -a 256 file.txt  # SHA-256
shasum -a 512 file.txt  # SHA-512

# Create checksum file
shasum -a 256 *.txt > checksums.sha256

# Verify checksums
shasum -a 256 -c checksums.sha256

# Compare two files
shasum file1.txt file2.txt

# Calculate for multiple files
find . -type f -exec shasum -a 256 {} \;

# Quick integrity check
original_hash=$(shasum -a 256 file.txt)
# ... file transfer ...
new_hash=$(shasum -a 256 file.txt)
[ "$original_hash" = "$new_hash" ] && echo "File intact"
```

### **base64** - Base64 Encoding/Decoding
**Description**: Encode and decode data using Base64
**Location**: `/usr/bin/base64`
**Common Use Cases**:
- Data encoding for transmission
- Configuration file encoding
- Email attachment encoding
- Binary data handling

**Examples**:
```bash
# Encode file
base64 file.txt > encoded.txt

# Encode string
echo "Hello World" | base64

# Decode file
base64 -d encoded.txt > decoded.txt

# Decode string
echo "SGVsbG8gV29ybGQ=" | base64 -d

# Encode without line wrapping
base64 -w 0 file.txt

# Encode binary file
base64 image.jpg > image.b64

# URL-safe encoding (if supported)
echo "data" | base64 | tr '+/' '-_' | tr -d '='

# Practical usage in scripts
API_KEY=$(echo -n "user:password" | base64)
curl -H "Authorization: Basic $API_KEY" api.example.com
```

### **security** - macOS Keychain Tool
**Description**: macOS keychain and security framework command-line interface
**Location**: `/usr/bin/security`
**Common Use Cases**:
- Keychain management
- Certificate handling
- Password management
- Security policy configuration

**Examples**:
```bash
# List keychains
security list-keychains

# Create new keychain
security create-keychain test.keychain

# Add keychain to search list
security list-keychains -s login.keychain test.keychain

# Add password to keychain
security add-generic-password -a account -s service -w password

# Retrieve password
security find-generic-password -a account -s service -w

# Add internet password
security add-internet-password -a user -s server.com -w password

# Export certificate
security export -k keychain -t certs -f pemseq -o certs.pem

# Import certificate
security import cert.p12 -k keychain

# Show keychain info
security show-keychain-info keychain

# Lock/unlock keychain
security lock-keychain keychain
security unlock-keychain keychain
```

### **codesign** - Code Signing (macOS)
**Description**: Create and verify code signatures for macOS applications
**Location**: `/usr/bin/codesign`
**Common Use Cases**:
- Application signing
- Security verification
- Distribution preparation
- Malware detection

**Examples**:
```bash
# Sign application
codesign -s "Developer ID" app.app

# Verify signature
codesign -v app.app

# Deep verification
codesign -v -v app.app

# Display signing information
codesign -d -vv app.app

# Sign with entitlements
codesign -s "Developer ID" --entitlements entitlements.plist app.app

# Remove signature
codesign --remove-signature app.app

# Check if binary is signed
codesign -dv app.app 2>&1 | grep "Authority"

# Sign with timestamp
codesign -s "Developer ID" --timestamp app.app
```

### **spctl** - System Policy Control (macOS)
**Description**: Manage system security policies and Gatekeeper
**Location**: `/usr/sbin/spctl`
**Common Use Cases**:
- Gatekeeper management
- Application security assessment
- Policy configuration
- Security troubleshooting

**Examples**:
```bash
# Check Gatekeeper status
spctl --status

# Assess application
spctl --assess app.app

# Assess with verbose output
spctl --assess -vv app.app

# Enable/disable Gatekeeper
sudo spctl --master-enable
sudo spctl --master-disable

# Add application to whitelist
sudo spctl --add app.app

# Remove from whitelist
sudo spctl --remove app.app

# List rules
spctl --list

# Assess installer package
spctl --assess --type install package.pkg
```

### **dscl** - Directory Service Command Line (macOS)
**Description**: Directory Service command-line utility for user/group management
**Location**: `/usr/bin/dscl`
**Common Use Cases**:
- User account management
- Group administration
- Directory service queries
- System administration

**Examples**:
```bash
# List all users
dscl . -list /Users

# Show user information
dscl . -read /Users/username

# Create new user
sudo dscl . -create /Users/newuser
sudo dscl . -create /Users/newuser UserShell /bin/bash
sudo dscl . -create /Users/newuser RealName "New User"

# Set user password
sudo dscl . -passwd /Users/username newpassword

# Delete user
sudo dscl . -delete /Users/username

# List groups
dscl . -list /Groups

# Add user to group
sudo dscl . -append /Groups/admin GroupMembership username

# Check group membership
dscl . -read /Groups/admin GroupMembership

# Change user's home directory
sudo dscl . -change /Users/username NFSHomeDirectory /old/path /new/path
```

### **keytool** - Java Key and Certificate Management
**Description**: Tool for managing private keys and X.509 certificate chains for Java applications
**Location**: `/usr/bin/keytool`
**Common Use Cases**:
- Java keystore management
- SSL certificate handling
- Cryptographic key generation
- Certificate signing and verification

**Examples**:
```bash
# Generate new key pair in keystore
keytool -genkey -alias mykey -keyalg RSA -keystore mystore.jks

# List entries in keystore
keytool -list -keystore mystore.jks

# Export certificate
keytool -export -alias mykey -file mycert.cer -keystore mystore.jks

# Import certificate into keystore
keytool -import -alias trustcert -file cert.cer -keystore truststore.jks

# View certificate details
keytool -printcert -file mycert.cer

# Delete entry from keystore
keytool -delete -alias mykey -keystore mystore.jks

# Change keystore password
keytool -storepasswd -keystore mystore.jks

# Change key password
keytool -keypasswd -alias mykey -keystore mystore.jks

# Generate certificate signing request (CSR)
keytool -certreq -alias mykey -file request.csr -keystore mystore.jks

# Import signed certificate
keytool -import -alias mykey -file signed.cer -keystore mystore.jks

# Verify certificate chain
keytool -list -v -keystore mystore.jks -alias mykey
```

---

## System Administration

### **sudo** - Execute as Root/Other User
**Description**: Execute commands as another user with authentication
**Location**: `/usr/bin/sudo`
**Difficulty**: ⭐⭐ Beginner (Basic usage) / ⭐⭐⭐⭐ Advanced (Policy configuration)
**Common Use Cases**:
- Administrative task execution
- Privilege escalation
- User impersonation
- Security policy enforcement

🛡️ **SECURITY WARNING**:
- **`sudo` grants FULL ADMINISTRATIVE PRIVILEGES** - use with extreme caution
- **Every sudo command runs with ROOT ACCESS** - can damage/compromise system
- **Malicious commands can destroy your system** when run with sudo
- **Always verify commands before adding sudo** - double-check spelling and paths
- **Avoid `sudo rm -rf`** and other destructive combinations

**Security Best Practices**:
- **Principle of Least Privilege**: Only use sudo when necessary
- **Verify commands**: Read and understand what you're running
- **Be suspicious of online commands**: Never blindly copy-paste sudo commands
- **Use specific commands**: Avoid `sudo su` or `sudo -i` unless needed
- **Check sudo access**: Use `sudo -l` to see what you're allowed to run
- **Time-limited**: sudo access expires after 15 minutes by default

**Safe Usage Guidelines**:
- Use package managers instead of manual installs when possible
- Prefer `sudo command` over `sudo su` for single operations
- Be extra careful with file operations: `sudo rm`, `sudo mv`, `sudo chmod`
- Always specify full paths when uncertain
- Use `sudo -u username` instead of switching to root when possible

**Examples**:
```bash
# Execute command as root
sudo command

# Execute as specific user
sudo -u username command

# Switch to root shell
sudo -i

# Switch to user shell
sudo -u username -i

# Execute with environment preserved
sudo -E command

# List sudo privileges
sudo -l

# Edit sudoers file safely
sudo visudo

# Execute command without password prompt
sudo -n command

# Run command in background as root
sudo nohup long_command &

# Execute multiple commands
sudo bash -c "command1 && command2"

# Validate sudo timestamp
sudo -v

# Clear sudo timestamp
sudo -k
```

### **md5** - MD5 Hash
**Description**: Calculate MD5 cryptographic checksums
**Location**: `/sbin/md5`
**Common Use Cases**:
- File integrity verification
- Data checksums
- Password hashing (deprecated)
- Duplicate detection

**See Also**: `shasum` (SHA hashes), `openssl` (various hashes), `base64` (encoding)

**Examples**:
```bash
# Calculate MD5 hash of file
md5 file.txt

# Hash multiple files
md5 *.txt

# Hash from stdin
echo "hello world" | md5

# Quiet output (hash only)
md5 -q file.txt

# Reverse check (verify hash)
md5 -r file.txt

# Time-trial mode
md5 -t

# String input
md5 -s "hello world"
```

### **shasum** - SHA Checksums
**Description**: Print or check SHA checksums
**Location**: `/usr/bin/shasum`
**Common Use Cases**:
- File integrity verification
- Secure checksums
- Data validation
- Download verification

**See Also**: `md5` (MD5 hashes), `openssl` (crypto functions), `base64` (encoding)

**Examples**:
```bash
# SHA-1 hash (default)
shasum file.txt

# SHA-256 hash
shasum -a 256 file.txt

# SHA-512 hash
shasum -a 512 file.txt

# Check against saved checksums
shasum -c checksums.txt

# Create checksum file
shasum *.txt > checksums.txt

# Verify specific algorithm
shasum -a 256 -c checksums.sha256

# Quiet mode
shasum -q file.txt

# Binary mode
shasum -b file.bin
```

### **base64** - Base64 Encoding
**Description**: Base64 encode/decode data
**Location**: `/usr/bin/base64`
**Common Use Cases**:
- Data encoding for transmission
- Binary data in text format
- URL-safe encoding
- Email attachments

**See Also**: `openssl` (encryption), `xxd` (hex encoding), `uuencode` (UU encoding)

**Examples**:
```bash
# Encode file
base64 file.txt

# Decode file
base64 -d encoded.txt

# Encode string
echo "hello world" | base64

# Decode string
echo "aGVsbG8gd29ybGQ=" | base64 -d

# No line wrapping
base64 -w 0 file.txt

# Output to file
base64 file.txt > encoded.b64
base64 -d encoded.b64 > decoded.txt

# URL-safe encoding (manual)
base64 file.txt | tr '+/' '-_' | tr -d '='
```

### **security** - macOS Security Framework
**Description**: Command-line interface to macOS Security framework
**Location**: `/usr/bin/security`
**Common Use Cases**:
- Keychain management
- Certificate operations
- Password retrieval
- Security policy management

**See Also**: `codesign` (code signing), `spctl` (security policy), `openssl` (certificates)

**Examples**:
```bash
# List keychains
security list-keychains

# Find generic password
security find-generic-password -s "service" -a "account"

# Add generic password
security add-generic-password -s "service" -a "account" -w "password"

# Delete password
security delete-generic-password -s "service" -a "account"

# List certificates
security find-certificate -a

# Export certificate
security find-certificate -c "cert name" -p > cert.pem

# Lock keychain
security lock-keychain

# Unlock keychain
security unlock-keychain

# Create keychain
security create-keychain test.keychain
```

### **codesign** - Code Signing
**Description**: Create and manipulate code signatures
**Location**: `/usr/bin/codesign`
**Common Use Cases**:
- Sign applications and binaries
- Verify code signatures
- Remove signatures
- Developer tool integration

**See Also**: `security` (certificate management), `spctl` (security assessment), `otool` (binary analysis)

**Examples**:
```bash
# Sign application
codesign -s "Developer ID" MyApp.app

# Verify signature
codesign -v MyApp.app

# Verbose verification
codesign -vv MyApp.app

# Display signature information
codesign -d MyApp.app

# Deep verification
codesign -v --deep MyApp.app

# Remove signature
codesign --remove-signature MyApp.app

# Force signing
codesign -f -s "Developer ID" MyApp.app

# Sign with entitlements
codesign -s "Developer ID" --entitlements app.entitlements MyApp.app
```

### **spctl** - Security Assessment Policy
**Description**: Security assessment policy subsystem
**Location**: `/usr/sbin/spctl`
**Common Use Cases**:
- Gatekeeper policy management
- Application security assessment
- Developer certificate verification
- System security enforcement

**See Also**: `codesign` (code signing), `security` (keychain access)

**Examples**:
```bash
# Assess application
spctl -a MyApp.app

# Verbose assessment
spctl -a -v MyApp.app

# Check installer
spctl -a -t install MyInstaller.pkg

# List system policies
sudo spctl --list

# Enable Gatekeeper
sudo spctl --master-enable

# Disable Gatekeeper
sudo spctl --master-disable

# Add to whitelist
sudo spctl --add MyApp.app

# Remove from policies
sudo spctl --remove MyApp.app
```

---

## System Administration

### **ps** - Process Status
**Description**: Display information about running processes
**Location**: `/bin/ps`
**Common Use Cases**:
- Process monitoring
- System diagnostics
- Resource usage analysis

**Examples**:
```bash
# List all processes
ps aux

# Find specific process
ps aux | grep process_name

# Show process tree
ps -ef
```

### **top** - Real-time Process Monitor
**Description**: Display and update sorted information about running processes
**Location**: `/usr/bin/top`
**Common Use Cases**:
- Real-time system monitoring
- Resource usage tracking
- Performance analysis

**Examples**:
```bash
# Start top
top

# Sort by memory usage
top -o mem

# Filter by user
top -user username
```

### **kill** - Terminate Processes
**Description**: Send signals to processes
**Location**: Built-in command
**Common Use Cases**:
- Process termination
- Signal sending
- System management

**Examples**:
```bash
# Terminate process
kill PID

# Force kill
kill -9 PID

# Send specific signal
kill -USR1 PID
```

### **procs** - Modern Process Viewer
**Description**: A modern replacement for ps written in Rust with colored output and additional information
**Location**: `/opt/homebrew/bin/procs`
**Difficulty**: ⭐⭐ Beginner (Enhanced ps) / ⭐⭐⭐ Intermediate (Advanced filtering)
**Common Use Cases**:
- Enhanced process monitoring with colors and tree view
- Process analysis with better formatting
- System diagnostics with improved readability
- Modern alternative to traditional ps

**See Also**: `ps` (traditional process viewer), `htop` (interactive process viewer), `btop` (modern system monitor)

**Examples**:
```bash
# Basic process listing (colored, formatted)
procs                                          # Show all processes

# Filter by process name
procs firefox                                  # Show processes containing "firefox"
procs --or chrome firefox                      # Show chrome OR firefox processes
procs --and python script                      # Show processes containing both "python" and "script"

# Tree view of processes
procs --tree                                   # Show process tree
procs --tree --thread                          # Include threads in tree

# Sort and format options
procs --sortd cpu                             # Sort by CPU usage (descending)
procs --sorta memory                          # Sort by memory usage (ascending)
procs --watch                                 # Continuously update (like watch)
procs --watch-interval 2                     # Update every 2 seconds

# Show specific columns
procs --only pid,user,cpu,memory,command      # Show only specified columns
procs --insert tcp,udp                       # Insert TCP and UDP port columns

# Filter by user, state, etc.
procs --user root                             # Show processes for root user
procs --state running                         # Show only running processes
procs --state sleeping                        # Show only sleeping processes

# Advanced filtering
procs --tcp                                   # Show processes with TCP connections
procs --udp                                   # Show processes with UDP connections
procs --docker                                # Show Docker-related processes
```

### **df** - Disk Free Space
**Description**: Display filesystem disk space usage
**Location**: `/bin/df`
**Common Use Cases**:
- Disk space monitoring
- Filesystem analysis
- Storage management

**Examples**:
```bash
# Show disk usage
df -h

# Show all filesystems
df -a

# Show inodes
df -i
```

### **du** - Disk Usage
**Description**: Display directory space usage
**Location**: `/usr/bin/du`
**Common Use Cases**:
- Directory size analysis
- Storage cleanup
- File system management

**Examples**:
```bash
# Show directory sizes
du -h

# Show total only
du -sh directory/

# Sort by size
du -h | sort -hr
```

### **ncdu** - NCurses Disk Usage Analyzer
**Description**: Disk usage analyzer with an ncurses interface, providing interactive navigation
**Location**: `/opt/homebrew/bin/ncdu`
**Difficulty**: ⭐⭐ Beginner (Simple navigation) / ⭐⭐⭐ Intermediate (Advanced features)
**Common Use Cases**:
- Interactive disk space analysis
- Finding large files and directories
- Storage cleanup and optimization
- Visual directory size exploration

**See Also**: `du` (basic disk usage), `df` (filesystem usage), `dust` (modern alternative)

**Examples**:
```bash
# Basic usage
ncdu                        # Analyze current directory
ncdu /path/to/directory     # Analyze specific directory
ncdu /                      # Analyze entire filesystem (requires time)

# Navigation inside ncdu
# Arrow keys or j/k - navigate up/down
# Enter or right arrow - enter directory
# Left arrow or < - go back to parent directory
# d - delete selected file/directory (with confirmation)
# t - toggle between different display modes
# g - show/hide percentage and graph
# a - toggle between apparent size and disk usage
# s - toggle sorting order
# r - refresh/rescan current directory
# q - quit

# Advanced options
ncdu -x /                   # Don't cross filesystem boundaries
ncdu --exclude="*.log"      # Exclude specific patterns
ncdu --exclude-from=file    # Exclude patterns from file
ncdu -o output.txt /home    # Export results to file
ncdu -f output.txt          # Import previously saved results

# Integration examples
ncdu /var/log               # Find large log files
ncdu ~/.cache               # Check cache directory size
sudo ncdu /                 # Full system analysis (as root)
ncdu --exclude="node_modules" ~/projects  # Exclude build artifacts
```

### **dust** - Intuitive Disk Usage Analyzer
**Description**: A more intuitive version of du written in Rust, with graphical output and better default behavior
**Location**: `/opt/homebrew/bin/dust`
**Difficulty**: ⭐⭐ Beginner (Simple and intuitive) / ⭐⭐⭐ Intermediate (Advanced options)
**Common Use Cases**:
- Fast disk usage analysis with visual tree representation
- Finding large files and directories with intuitive output
- Modern alternative to du with better defaults
- Quick storage cleanup assessment

**See Also**: `du` (traditional disk usage), `ncdu` (interactive ncurses), `df` (filesystem usage)

**Examples**:
```bash
# Basic usage - show disk usage tree
dust                                          # Analyze current directory
dust /path/to/directory                       # Analyze specific directory
dust ~                                        # Analyze home directory

# Control output depth and limits
dust -d 3                                     # Show only 3 levels deep
dust -n 20                                    # Show top 20 entries
dust -d 2 -n 10                              # Combine: 2 levels, top 10

# Different output formats
dust -t                                       # Tree view (default)
dust -b                                       # Show only file count, not size
dust -c                                       # Don't use colors
dust -f                                       # Show full paths

# Size thresholds and filtering
dust -s                                       # Only show directories
dust -r                                       # Reverse order (smallest first)
dust -X .git                                  # Exclude .git directories
dust -x                                       # Stay on filesystem (don't cross mounts)

# Human-readable sizes
dust -H                                       # Use binary units (1024-based)
dust                                          # Default uses decimal (1000-based)

# Practical examples
dust -d 3 -n 15 /var/log                     # Find large log files (3 levels, top 15)
dust -s ~/Downloads                          # Show subdirectory sizes only
dust -X node_modules -X .git ~/projects      # Exclude common bloat directories
sudo dust -d 2 /                            # Quick system-wide analysis (2 levels)

# Compare with traditional du
dust ~/projects                              # Fast, visual
du -h --max-depth=2 ~/projects | sort -hr   # Traditional equivalent
```

### **htop** - Interactive Process Viewer
**Description**: Interactive process viewer and system monitor (enhanced version of top)
**Location**: `/opt/homebrew/bin/htop` (install via `brew install htop`)
**Common Use Cases**:
- Real-time system monitoring
- Process management
- Resource usage analysis
- System performance troubleshooting

**Examples**:
```bash
# Start htop
htop

# Sort by CPU usage (default)
# Press 'P' in htop

# Sort by memory usage
# Press 'M' in htop

# Filter processes
# Press 'F4' and type filter

# Kill process
# Select process and press 'F9'

# Tree view
# Press 'F5' for tree view

# Show only user processes
# Press 'u' and select user

# Configuration
# Press 'F2' for setup
```

### **btop** - Modern System Monitor
**Description**: Modern and colorful system monitor that shows usage and stats for processor, memory, disks, network and processes
**Location**: `/opt/homebrew/bin/btop`
**Common Use Cases**:
- Advanced system monitoring with beautiful interface
- Real-time process and resource tracking
- Network and disk I/O monitoring
- Modern alternative to htop with more features

**See Also**: `htop` (interactive process viewer), `top` (basic process monitor), `iostat` (I/O statistics)

**Examples**:
```bash
# Start btop
btop

# Interactive commands within btop:
# 'q' or Ctrl+C to quit
# '+' or '-' to adjust update time
# 'Tab' to switch between different views
# Mouse click or arrow keys for navigation
# 't' to toggle process tree mode
# 'f' to filter processes
# 'k' to kill selected process
# 'r' to toggle reverse sorting
# 'm' to cycle through memory views
# 'n' to cycle through network views
```

### **leaks** - Memory Leak Detection (macOS)
**Description**: Search a process's memory for leaks (native macOS developer tool)
**Location**: `/usr/bin/leaks`
**Difficulty**: ⭐⭐⭐ Intermediate (Memory debugging) / ⭐⭐⭐⭐ Advanced (Analysis interpretation)
**Common Use Cases**:
- Memory leak detection in applications
- Memory analysis and debugging
- Performance troubleshooting
- Application profiling on macOS

**See Also**: `heap` (heap analysis), `malloc_history` (allocation tracking), `instruments` (Xcode profiler)

**Examples**:
```bash
# Find leaks in running process
leaks pid                                       # Check process by PID
leaks process_name                              # Check process by name
sudo leaks -nocontext -quiet process_name       # Quiet mode, no context

# Analyze specific process types
leaks `pgrep Safari`                           # Check Safari for leaks
leaks `pgrep -f node`                          # Check Node.js processes

# Generate reports
leaks -outputGraph /tmp/leaks.dot process_name  # Export as DOT graph
leaks -atExit -- ./my_program                  # Check leaks when program exits

# Continuous monitoring
while true; do leaks process_name; sleep 60; done  # Check every minute

# Memory usage summary
leaks -nocontext process_name | head -20        # Summary without full traces
```

### **heap** - Heap Analysis (macOS)
**Description**: List all malloc'd blocks in heap of specified process (native macOS tool)
**Location**: `/usr/bin/heap`
**Difficulty**: ⭐⭐⭐ Intermediate (Memory analysis) / ⭐⭐⭐⭐ Advanced (Detailed debugging)
**Common Use Cases**:
- Heap memory analysis
- Memory allocation debugging
- Investigating memory usage patterns
- Application memory profiling

**See Also**: `leaks` (leak detection), `malloc_history` (allocation history), `vm_stat` (virtual memory stats)

**Examples**:
```bash
# Basic heap analysis
heap pid                                       # Analyze heap by process ID
heap process_name                              # Analyze heap by process name
sudo heap `pgrep Safari`                      # Analyze Safari's heap

# Detailed analysis options
heap -addresses process_name                   # Show allocation addresses
heap -sortBySize process_name                  # Sort allocations by size
heap -sumObjectFields process_name             # Summarize object fields

# Filtering and output
heap -showOnly CLASS_NAME process_name         # Show only specific class
heap -hideStackFrames process_name             # Hide stack frame details
heap -guessNonObjects process_name             # Identify potential non-objects

# Continuous monitoring
heap -addresses `pgrep myapp` > heap_snapshot.txt  # Save heap snapshot
```

### **vm_stat** - Virtual Memory Statistics (macOS)
**Description**: Show virtual memory statistics (native macOS system tool)
**Location**: `/usr/bin/vm_stat`
**Difficulty**: ⭐⭐ Beginner (Basic stats) / ⭐⭐⭐ Intermediate (Analysis)
**Common Use Cases**:
- System memory monitoring
- Virtual memory analysis
- Performance troubleshooting
- System health monitoring

**See Also**: `top` (process monitoring), `activity monitor` (GUI alternative), `iostat` (I/O stats)

**Examples**:
```bash
# Basic memory statistics
vm_stat                                        # Current memory stats
vm_stat 5                                      # Update every 5 seconds
vm_stat 2 10                                   # Update every 2 seconds, 10 times

# Understanding output:
# Pages free: Available physical memory pages
# Pages active: Currently used memory pages
# Pages inactive: Memory that can be reclaimed
# Pages speculative: Memory that might be reclaimed
# Pages wired down: Memory that cannot be paged out

# Continuous monitoring
vm_stat 1 | while read line; do echo "$(date): $line"; done  # Timestamped output

# Memory pressure analysis
vm_stat | grep -E "(free|active|inactive|wired)"  # Key memory indicators
```

### **gprof2dot** - Profile Data Visualization
**Description**: Convert profiling output to dot graphs for visualization
**Location**: `/opt/homebrew/bin/gprof2dot`
**Difficulty**: ⭐⭐⭐ Intermediate (Profiling knowledge) / ⭐⭐⭐⭐ Advanced (Graph interpretation)
**Common Use Cases**:
- Visualizing profiling data
- Performance bottleneck analysis
- Call graph generation
- Profiling report enhancement

**See Also**: `graphviz` (graph visualization), `gprof` (GNU profiler), `instruments` (macOS profiler)

**Examples**:
```bash
# Convert gprof output to graph
gprof program gmon.out | gprof2dot | dot -Tpng -o profile.png

# Python profiling visualization
python -m cProfile -o profile.pstats script.py
gprof2dot -f pstats profile.pstats | dot -Tpng -o python_profile.png

# Callgrind visualization (if available)
gprof2dot -f callgrind callgrind.out.12345 | dot -Tsvg -o callgrind.svg

# Custom formatting
gprof2dot --color-nodes-by-selftime profile.pstats | dot -Tpdf -o profile.pdf
gprof2dot --node-thres=5.0 profile.pstats | dot -Tpng -o filtered_profile.png

# Multiple format support
gprof2dot -f prof profile.prof | dot -Tsvg -o profile.svg  # .prof files
gprof2dot -f hprof java.hprof | dot -Tpng -o java_profile.png  # Java hprof
```

### **iostat** - I/O Statistics
**Description**: Report input/output statistics for devices and partitions
**Location**: `/usr/bin/iostat`
**Common Use Cases**:
- Disk performance monitoring
- I/O bottleneck identification
- Storage system analysis
- Performance tuning

**Examples**:
```bash
# Basic I/O statistics
iostat

# Continuous monitoring (every 2 seconds)
iostat 2

# Detailed disk statistics
iostat -d

# Extended statistics
iostat -x

# Specific device monitoring
iostat -d disk0

# CPU and I/O combined
iostat -c

# Human-readable output
iostat -h

# Network filesystem statistics
iostat -n

# Monitor for specific duration
iostat 1 10  # Every 1 second for 10 times
```

### **lsof** - List Open Files
**Description**: List open files and the processes using them
**Location**: `/usr/bin/lsof`
**Common Use Cases**:
- Find which process is using a file
- Network connection monitoring
- Troubleshoot "file busy" errors
- Security investigation

**Examples**:
```bash
# List all open files
lsof

# Files opened by specific process
lsof -p PID

# Files opened by user
lsof -u username

# Files in specific directory
lsof +D /path/to/directory

# Network connections
lsof -i

# Specific port
lsof -i :80
lsof -i :22

# TCP connections only
lsof -i tcp

# UDP connections only
lsof -i udp

# Files opened by command name
lsof -c ssh

# Which process is using a file
lsof /path/to/file

# Deleted files still in use
lsof +L1

# IPv6 connections
lsof -i 6
```

### **pgrep/pkill** - Process Lookup and Signal
**Description**: Look up or signal processes based on name and attributes
**Location**: `/usr/bin/pgrep`, `/usr/bin/pkill`
**Common Use Cases**:
- Find process IDs by name
- Kill processes by name or pattern
- Process management automation
- System cleanup scripts

**Examples**:
```bash
# Find processes by name
pgrep ssh
pgrep -f "python script.py"

# Show process names with PIDs
pgrep -l ssh

# Find by user
pgrep -u username

# Find newest/oldest process
pgrep -n ssh  # newest
pgrep -o ssh  # oldest

# Kill processes by name
pkill ssh
pkill -f "python script.py"

# Kill by user
pkill -u username

# Send specific signal
pkill -USR1 nginx
pkill -HUP sshd

# Kill with confirmation
pkill -i firefox

# Exact match only
pgrep -x ssh

# Parent process filtering
pgrep -P parent_pid
```

### **uptime** - System Uptime and Load
**Description**: Show system uptime and load averages
**Location**: `/usr/bin/uptime`
**Common Use Cases**:
- Check system uptime
- Monitor load averages
- System health assessment
- Performance baseline establishment

**Examples**:
```bash
# Show uptime and load
uptime

# Pretty format (if supported)
uptime -p

# Since when system is up
uptime -s

# Load averages explanation:
# - 1 minute average
# - 5 minute average  
# - 15 minute average

# Monitor load continuously
watch uptime

# Log uptime periodically
while true; do
    echo "$(date): $(uptime)"
    sleep 300
done >> uptime.log
```

### **w** - Show Logged-in Users
**Description**: Show who is logged on and what they are doing
**Location**: `/usr/bin/w`
**Common Use Cases**:
- Monitor user activity
- System security auditing
- User session management
- Load investigation

**Examples**:
```bash
# Show all logged-in users
w

# Show specific user
w username

# Short format (no process info)
w -s

# No header
w -h

# Show IP addresses instead of hostnames
w -i

# From where users logged in
w -f

# Show only user and terminal
w -u

# Monitor user activity
watch -n 30 w
```

### **who** - Show Logged-in Users (Simple)
**Description**: Show who is logged on (simpler than w)
**Location**: `/usr/bin/who`
**Common Use Cases**:
- Quick user list
- Login session information
- System access monitoring
- Security auditing

**Examples**:
```bash
# Show logged-in users
who

# Show with login time
who -T

# Show only usernames
who -q

# Show system boot time
who -b

# Show run level
who -r

# Show all information
who -a

# Show current user info
who am i
whoami

# Show users and idle times
who -u

# Monitor logins
watch who
```

### **whoami** - Show Current Username
**Description**: Print the username associated with the current effective user ID
**Location**: `/usr/bin/whoami`
**Common Use Cases**:
- Script user identification
- Security verification
- Environment debugging
- Access control checks

**Examples**:
```bash
# Show current username
whoami

# Use in scripts for conditional logic
if [ "$(whoami)" = "root" ]; then
    echo "Running as administrator"
fi

# Combine with other commands
echo "User $(whoami) logged in at $(date)"

# Check effective vs real user (useful with sudo)
whoami  # shows effective user
id -un  # shows real user
```

### **groups** - Show Group Memberships
**Description**: Print group memberships for the current user or specified users
**Location**: `/usr/bin/groups`
**Common Use Cases**:
- Access permission verification
- Security auditing
- User account analysis
- Troubleshooting file access

**Examples**:
```bash
# Show current user's groups
groups

# Show groups for specific user
groups username

# Show groups for multiple users
groups user1 user2 user3

# Use in scripts for permission checks
if groups | grep -q "admin"; then
    echo "User has admin privileges"
fi

# Compare with id command output
groups          # simple group list
id -Gn          # same info via id command
id -Gn username # groups for specific user
```

### **last** - Show Login History
**Description**: Show listing of last logged-in users
**Location**: `/usr/bin/last`
**Common Use Cases**:
- Login audit trails
- Security investigation
- User access history
- System access patterns

**Examples**:
```bash
# Show last logins
last

# Show specific user
last username

# Show specific terminal
last tty1

# Limit number of entries
last -n 10

# Show from specific time
last -s yesterday
last -s "2024-01-01"

# Show until specific time
last -t "2024-01-31"

# Show hostnames
last -d

# Show IPs instead of hostnames
last -i

# Show bad logins (failed attempts)
last -f /var/log/btmp

# Show system reboots
last reboot

# Show shutdowns
last shutdown
```

### **vmstat** - Virtual Memory Statistics
**Description**: Report virtual memory statistics and system activity
**Location**: `/usr/bin/vm_stat` (macOS equivalent)
**Common Use Cases**:
- Memory usage monitoring
- System performance analysis
- Resource bottleneck identification
- Capacity planning

**Examples**:
```bash
# Basic memory statistics (macOS)
vm_stat

# Continuous monitoring
vm_stat 5  # Every 5 seconds

# Show in different units
vm_stat -c 10 5  # 10 samples, 5 second intervals

# Understanding output:
# - free: available memory
# - active: memory in use
# - inactive: memory not actively used
# - wired: kernel memory (can't be swapped)
# - compressed: compressed memory pages

# Script for monitoring
#!/bin/bash
while true; do
    echo "=== $(date) ==="
    vm_stat
    echo
    sleep 60
done
```

### **activity_monitor** - macOS Activity Monitor CLI
**Description**: Command-line access to Activity Monitor functionality
**Location**: Various system utilities
**Common Use Cases**:
- Process monitoring
- Resource usage tracking
- System performance analysis
- Troubleshooting performance issues

**Examples**:
```bash
# CPU usage by process
ps aux | sort -k3nr | head -10

# Memory usage by process
ps aux | sort -k4nr | head -10

# Real-time process monitoring
top -o cpu -s 2

# Disk usage by process
sudo fs_usage -w -f filesys | head -20

# Network activity by process
sudo netstat -i -b

# System activity summary
sar -u 1 5  # If sysstat installed

# Energy usage (macOS)
sudo powermetrics -n 1 -i 1000

# Comprehensive system info
system_profiler SPHardwareDataType
```

### **dtruss** - DTrace Process Tracing (macOS)
**Description**: Dynamic tracing of process system calls (DTrace-based)
**Location**: `/usr/bin/dtruss`
**Common Use Cases**:
- System call tracing
- Process debugging
- Performance analysis
- Security investigation

**Examples**:
```bash
# Trace system calls for process
sudo dtruss -p PID

# Trace new process execution
sudo dtruss command

# Trace specific system calls
sudo dtruss -t open command

# Trace file operations
sudo dtruss -t read,write -p PID

# Trace network operations
sudo dtruss -t socket,connect -p PID

# Count system calls
sudo dtruss -c -p PID

# Follow child processes
sudo dtruss -f command

# Trace with timestamps
sudo dtruss -t all -e -p PID
```

### **fs_usage** - File System Usage (macOS)
**Description**: Monitor file system activity in real-time
**Location**: `/usr/bin/fs_usage`
**Common Use Cases**:
- File access monitoring
- Disk I/O analysis
- Application behavior investigation
- Performance troubleshooting

**Examples**:
```bash
# Monitor all file system activity
sudo fs_usage

# Filter by process name
sudo fs_usage -w grep

# Filter by specific process
sudo fs_usage -p PID

# Show only specific operations
sudo fs_usage -f filesys

# Network file system operations
sudo fs_usage -f network

# Exclude certain processes
sudo fs_usage -e Mail -e Safari

# Wide output format
sudo fs_usage -w

# Monitor specific path
sudo fs_usage | grep "/path/to/watch"
```

### **iotop** - I/O Usage by Process
**Description**: Display I/O usage by processes (third-party tool)
**Location**: Install via `brew install iotop` or similar
**Common Use Cases**:
- Identify I/O-heavy processes
- Disk performance troubleshooting
- Resource usage optimization
- System bottleneck identification

**Examples**:
```bash
# Monitor I/O by process
sudo iotop

# Sort by total I/O
sudo iotop -o

# Show accumulated I/O
sudo iotop -a

# Only show processes doing I/O
sudo iotop -o

# Batch mode for logging
sudo iotop -b -n 5

# Filter by user
sudo iotop -u username

# Alternative: Use built-in tools
sudo fs_usage -w -f filesys | grep -E "W|R"
```

### **uname** - System Information
**Description**: Display system information
**Location**: `/usr/bin/uname`
**Common Use Cases**:
- System identification
- Platform detection
- Kernel information
- Architecture discovery

**See Also**: `hostname` (system name), `uptime` (system uptime)

**Examples**:
```bash
# Basic system info
uname

# All information
uname -a

# Kernel name
uname -s

# Kernel version
uname -r

# Kernel release
uname -v

# Machine hardware name
uname -m

# Processor type
uname -p

# Hardware platform
uname -i

# Operating system
uname -o

# Node name (hostname)
uname -n
```

### **hostname** - System Name
**Description**: Display or set system hostname
**Location**: `/bin/hostname`
**Common Use Cases**:
- System identification
- Network configuration
- Script customization
- Remote system identification

**See Also**: `uname` (system info), `whoami` (current user)

**Examples**:
```bash
# Display hostname
hostname

# Display FQDN (Fully Qualified Domain Name)
hostname -f

# Display IP address
hostname -I

# Display short name
hostname -s

# Display all addresses
hostname -a

# Set hostname (requires sudo)
sudo hostname newhostname

# Display domain name
hostname -d
```

### **last** - Login History
**Description**: Display last logins of users and terminals
**Location**: `/usr/bin/last`
**Common Use Cases**:
- Security auditing
- Login monitoring
- User activity tracking
- System access history

**See Also**: `who` (current users), `w` (user activity), `finger` (user info)

**Examples**:
```bash
# Show last logins
last

# Show last logins for specific user
last username

# Show last 10 entries
last -10

# Show logins since specific date
last -s yesterday

# Show logins until specific date
last -t yesterday

# Show full domain names
last -d

# Show IP addresses instead of hostnames
last -i

# Show time in different format
last -t
```

### **dtruss** - Dynamic Tracing (macOS)
**Description**: Script that uses DTrace to trace system calls
**Location**: `/usr/bin/dtruss`
**Common Use Cases**:
- System call tracing
- Process debugging
- Performance analysis
- Security auditing

**See Also**: `lsof` (open files), `fs_usage` (file system usage), `strace` (Linux equivalent)

**Examples**:
```bash
# Trace all system calls for a command
sudo dtruss ls

# Trace specific process by PID
sudo dtruss -p process_id

# Trace file operations only
sudo dtruss -t open,read,write command

# Exclude specific system calls
sudo dtruss -X write command

# Count system calls
sudo dtruss -c command

# Follow child processes
sudo dtruss -f command

# Output to file
sudo dtruss -o trace.log command
```

### **fs_usage** - File System Usage (macOS)
**Description**: Report system calls and page faults related to filesystem activity
**Location**: `/usr/bin/fs_usage`
**Common Use Cases**:
- File system monitoring
- I/O performance analysis
- Application debugging
- Resource usage tracking

**See Also**: `dtruss` (system call tracing), `lsof` (open files), `iostat` (I/O statistics)

**Examples**:
```bash
# Monitor all filesystem activity
sudo fs_usage

# Monitor specific process
sudo fs_usage -p process_id

# Filter by operation type
sudo fs_usage -w  # writes only

# Exclude specific processes
sudo fs_usage -e Mail

# Show extended info
sudo fs_usage -e

# Save to file
sudo fs_usage > fs_activity.log

# Monitor specific file/directory
sudo fs_usage -f /path/to/monitor
```

### **vm_stat** - Virtual Memory Statistics
**Description**: Display virtual memory statistics
**Location**: `/usr/bin/vm_stat`
**Common Use Cases**:
- Memory usage monitoring
- Performance troubleshooting
- System health checking
- Memory leak detection

**See Also**: `top` (process memory), `ps` (process info), `activity monitor` (GUI)

**Examples**:
```bash
# Show current VM stats
vm_stat

# Continuous monitoring (every 5 seconds)
vm_stat 5

# Show specific number of samples
vm_stat 1 10  # every 1 second, 10 times

# Human-readable output
vm_stat | awk '{print $1, $2/256, "MB"}'

# Monitor page-outs (swapping)
vm_stat 2 | grep "Pages paged out"
```

### **purge** - Force Memory Cleanup
**Description**: Force disk cache to be purged (flushed and emptied)
**Location**: `/usr/sbin/purge`
**Common Use Cases**:
- Free up memory
- Performance testing
- Clear file cache
- System maintenance

**See Also**: `vm_stat` (memory stats), `sync` (flush buffers)

**Examples**:
```bash
# Purge disk cache and free memory
sudo purge

# Check memory before and after
vm_stat && sudo purge && vm_stat

# Use in performance testing scripts
sudo purge; time command_to_test
```

### **printenv** - Print Environment
**Description**: Display environment variables
**Location**: `/usr/bin/printenv`
**Common Use Cases**:
- Environment inspection
- Shell configuration debugging
- Variable verification
- System setup checking

**See Also**: `env` (environment management), `export` (set variables), `set` (shell variables)

**Examples**:
```bash
# Print all environment variables
printenv

# Print specific variable
printenv PATH

# Print multiple variables
printenv HOME USER SHELL

# Check if variable exists
printenv JAVA_HOME || echo "JAVA_HOME not set"

# Compare environments
printenv | sort > env1.txt
# ... make changes ...
printenv | sort > env2.txt
diff env1.txt env2.txt
```

---

## Archive & Compression Tools

### **tar** - Archive Tool
**Description**: Manipulate tape archives, supports multiple formats
**Location**: `/usr/bin/tar`
**Common Use Cases**:
- File archiving and backup
- Compression and decompression
- Directory packaging

**See Also**: `zip` (cross-platform archives), `gzip` (individual file compression), `rsync` (sync with compression)

**Examples**:
```bash
# Create compressed archive
tar czf archive.tar.gz directory/

# Extract archive
tar xzf archive.tar.gz

# List archive contents
tar tzf archive.tar.gz

# Create with auto-compression
tar caf archive.tar.xz files/
```

### **zip/unzip** - ZIP Archives
**Description**: Create and extract ZIP archives
**Location**: `/usr/bin/zip`, `/usr/bin/unzip`
**Common Use Cases**:
- Cross-platform archiving
- File compression
- Package distribution

**Examples**:
```bash
# Create ZIP archive
zip -r archive.zip directory/

# Extract ZIP
unzip archive.zip

# List ZIP contents
unzip -l archive.zip

# Extract to specific directory
unzip archive.zip -d /path/
```

### **gzip/gunzip** - GZIP Compression
**Description**: Compress files using GZIP algorithm
**Location**: `/usr/bin/gzip`, `/usr/bin/gunzip`
**Common Use Cases**:
- File compression
- Log file management
- Space optimization

**Examples**:
```bash
# Compress file
gzip file.txt

# Decompress file
gunzip file.txt.gz

# Keep original file
gzip -k file.txt
```

### **bzip2/bunzip2** - BZIP2 Compression
**Description**: Block-sorting file compressor using Burrows-Wheeler algorithm
**Location**: `/usr/bin/bzip2`, `/usr/bin/bunzip2`
**Compression**: Excellent (better than gzip, slower)
**Speed**: Moderate
**Common Use Cases**:
- High-compression archiving
- Backup storage optimization
- Long-term file storage

**Examples**:
```bash
# Compress file (removes original)
bzip2 file.txt

# Decompress file
bunzip2 file.txt.bz2

# Keep original file while compressing
bzip2 -k file.txt

# Decompress to stdout
bzcat file.txt.bz2

# Test archive integrity
bzip2 -t file.txt.bz2

# Verbose compression with ratio display
bzip2 -v file.txt

# Integration with tar
tar cjf archive.tar.bz2 directory/
tar xjf archive.tar.bz2
```

### **xz/unxz** - XZ Compression
**Description**: High-ratio compression using LZMA/LZMA2 algorithms
**Location**: `/opt/homebrew/bin/xz`, `/opt/homebrew/bin/unxz`
**Compression**: Excellent (best ratio, slowest)
**Speed**: Slow compression, fast decompression
**Common Use Cases**:
- Maximum compression for archival
- Software distribution
- Kernel and system packages

**Examples**:
```bash
# Compress file
xz file.txt

# Decompress file
unxz file.txt.xz

# Keep original file
xz -k file.txt

# Compress with specific level (0=fastest, 9=best)
xz -9 file.txt

# Decompress to stdout
xzcat file.txt.xz

# LZMA format compatibility
xz --format=lzma file.txt
unlzma file.txt.lzma

# Integration with tar
tar cJf archive.tar.xz directory/
tar xJf archive.tar.xz
```

### **zstd** - Zstandard Compression
**Description**: Fast lossless compression algorithm by Facebook
**Location**: `/opt/homebrew/bin/zstd`
**Compression**: Good (balanced ratio and speed)
**Speed**: Very fast
**Common Use Cases**:
- Real-time compression
- Network data transfer
- Modern backup systems

**Examples**:
```bash
# Compress file
zstd file.txt

# Decompress file
zstd -d file.txt.zst

# Compress with level (1=fastest, 19=slowest, 3=default)
zstd -3 file.txt

# Ultra compression (up to level 22)
zstd --ultra -22 file.txt

# Decompress to stdout
zstdcat file.txt.zst

# Integration with tar
tar --use-compress-program=zstd -cf archive.tar.zst directory/
tar --use-compress-program=zstd -xf archive.tar.zst
```

### **lz4** - LZ4 Compression
**Description**: Extremely fast compression focusing on speed over ratio
**Location**: `/opt/homebrew/bin/lz4`
**Compression**: Moderate (prioritizes speed)
**Speed**: Extremely fast
**Common Use Cases**:
- Real-time data compression
- Temporary file compression
- High-throughput applications

**Examples**:
```bash
# Compress file
lz4 file.txt file.txt.lz4

# Decompress file
lz4 -d file.txt.lz4

# Decompress to stdout
lz4 -dc file.txt.lz4

# Best compression mode
lz4 --best file.txt

# Integration with tar
tar cf - directory/ | lz4 - archive.tar.lz4
lz4 -dc archive.tar.lz4 | tar -xv
```

### **compress/uncompress** - Classic UNIX Compression
**Description**: Traditional UNIX compression using adaptive Lempel-Ziv coding
**Location**: `/usr/bin/compress`, `/usr/bin/uncompress`
**Compression**: Poor (legacy tool)
**Speed**: Fast
**Common Use Cases**:
- Legacy system compatibility
- Historical file recovery
- Simple compression needs

**Examples**:
```bash
# Compress file (creates .Z extension)
compress file.txt

# Decompress file
uncompress file.txt.Z

# Force compression even if no size reduction
compress -f file.txt

# Compress to stdout
compress -c file.txt > file.txt.Z
```

### **cpio** - Copy In/Out Archives
**Description**: Archive tool that copies files to and from archives
**Location**: `/usr/bin/cpio`
**Common Use Cases**:
- System backups
- File system imaging
- Legacy archive handling

**Examples**:
```bash
# Create archive from file list
find directory/ | cpio -o > archive.cpio

# Extract archive
cpio -i < archive.cpio

# Create with verbose output
find directory/ | cpio -ov > archive.cpio

# Extract specific files
cpio -i "*.txt" < archive.cpio

# Create with gzip compression
find directory/ | cpio -o | gzip > archive.cpio.gz

# Extract gzipped archive
gunzip -c archive.cpio.gz | cpio -i
```

### **ar** - Archive Library Files
**Description**: Create and maintain library archives (mainly for static libraries)
**Location**: `/usr/bin/ar`
**Common Use Cases**:
- Creating static libraries (.a files)
- Debian package manipulation
- Object file archiving

**Examples**:
```bash
# Create archive with object files
ar rcs libmath.a math1.o math2.o math3.o

# List archive contents
ar t libmath.a

# Extract all files from archive
ar x libmath.a

# Add files to existing archive
ar r libmath.a newmath.o

# Insert object file index (ranlib equivalent)
ar s libmath.a
```

### **strip** - Remove Symbols
**Description**: Remove or modify symbol tables from executables
**Location**: `/usr/bin/strip`
**Common Use Cases**:
- Reducing executable size
- Removing debug information
- Preparing for distribution

**Examples**:
```bash
# Strip all symbols from executable
strip executable

# Strip debug symbols only
strip --strip-debug program.o

# Strip to specific output file
strip input_file -o output_file

# Check file size before/after
ls -l program
strip program
ls -l program
```

### **gzip** - GNU Zip Compression
**Description**: Compress or decompress files using Lempel-Ziv coding
**Location**: `/usr/bin/gzip`
**Common Use Cases**:
- File compression
- Log file compression
- Data transfer optimization
- Archive compression

**See Also**: `gunzip` (decompress), `zcat` (view compressed), `bzip2` (better compression)

**Examples**:
```bash
# Compress file (replaces original)
gzip file.txt

# Keep original file
gzip -k file.txt

# Compress with specific level (1-9)
gzip -9 file.txt  # maximum compression
gzip -1 file.txt  # fastest compression

# Decompress
gunzip file.txt.gz

# View compressed file
zcat file.txt.gz

# Compress multiple files
gzip *.txt

# Test integrity
gzip -t file.txt.gz

# Verbose output
gzip -v file.txt

# Force compression
gzip -f file.txt
```

### **bzip2** - Block-sorting Compression
**Description**: High-quality block-sorting file compressor
**Location**: `/usr/bin/bzip2`
**Common Use Cases**:
- High compression ratio
- Archive compression
- Backup compression
- Large file compression

**See Also**: `bunzip2` (decompress), `bzcat` (view compressed), `gzip` (faster compression)

**Examples**:
```bash
# Compress file
bzip2 file.txt

# Keep original
bzip2 -k file.txt

# Decompress
bunzip2 file.txt.bz2

# View compressed file
bzcat file.txt.bz2

# Compress with different levels
bzip2 -9 file.txt  # best compression
bzip2 -1 file.txt  # fastest

# Test integrity
bzip2 -t file.txt.bz2

# Verbose mode
bzip2 -v file.txt

# Force overwrite
bzip2 -f file.txt
```

### **compress** - LZW Compression
**Description**: Compress data using Lempel-Ziv-Welch algorithm
**Location**: `/usr/bin/compress`
**Common Use Cases**:
- Legacy system compatibility
- Simple compression
- Unix system compatibility
- Quick compression

**See Also**: `uncompress` (decompress), `gzip` (modern alternative), `bzip2` (better compression)

**Examples**:
```bash
# Compress file
compress file.txt

# Verbose mode
compress -v file.txt

# Force compression
compress -f file.txt

# Decompress
uncompress file.txt.Z

# Compress multiple files
compress *.txt

# Check compression ratio
compress -v file.txt 2>&1 | grep "compression:"
```

### **zcat** - View Compressed Files
**Description**: Display compressed files without decompressing to disk
**Location**: `/usr/bin/zcat`
**Common Use Cases**:
- View compressed logs
- Pipe compressed data
- Read compressed files directly
- Compress file analysis

**See Also**: `gzip` (compression), `bzcat` (bzip2 files), `cat` (uncompressed files)

**Examples**:
```bash
# View gzipped file
zcat file.txt.gz

# View multiple compressed files
zcat *.gz

# Pipe to other commands
zcat log.gz | grep ERROR

# Search in compressed files
zcat *.gz | grep pattern

# Count lines in compressed file
zcat file.gz | wc -l

# Combine compressed files
zcat file1.gz file2.gz > combined.txt
```

## Compression Comparison Summary

Based on benchmark testing with a 1MB test file:

| Tool | Compression Ratio | Speed | Best Use Case |
|------|------------------|-------|---------------|
| **lz4** | 4.0KB (99.6%) | Fastest | Real-time compression |
| **zstd** | 102B (99.99%) | Very Fast | Balanced performance |
| **gzip** | 1.0KB (99.9%) | Fast | General purpose |
| **bzip2** | 96B (99.99%) | Moderate | High compression |
| **xz** | 328B (99.97%) | Slow | Maximum compression |
| **compress** | 1.9KB (99.8%) | Fast | Legacy compatibility |

### **Choosing the Right Tool**:

- **For Speed**: lz4 > zstd > gzip > compress > bzip2 > xz
- **For Compression**: bzip2 ≈ zstd > xz > gzip > compress > lz4
- **For Balance**: zstd (best overall), gzip (widely supported)
- **For Archives**: Use with tar (e.g., tar czf, tar cjf, tar cJf)

---

## Data Processing Tools

### **jq** - JSON Processor
**Description**: Command-line JSON processor
**Location**: `/opt/homebrew/bin/jq`
**Common Use Cases**:
- JSON data manipulation
- API response processing
- Configuration file editing

**Examples**:
```bash
# Pretty print JSON
jq '.' file.json

# Extract field
jq '.field' file.json

# Filter array elements
jq '.[] | select(.status == "active")' file.json

# Transform data
jq '{name: .user.name, id: .user.id}' file.json
```

### **sqlite3** - SQLite Database
**Description**: Command-line interface for SQLite databases
**Location**: `/usr/bin/sqlite3`
**Common Use Cases**:
- Database operations
- Data analysis
- Structured data storage

**Examples**:
```bash
# Open database
sqlite3 database.db

# Execute query
sqlite3 db.sqlite "SELECT * FROM table;"

# Import CSV
sqlite3 db.sqlite ".import data.csv table"

# Export to CSV
sqlite3 db.sqlite ".mode csv" ".output data.csv" "SELECT * FROM table;"
```

### **csvkit** - Suite of CSV Tools
**Description**: Utilities for converting to and working with CSV files
**Location**: `/opt/homebrew/bin/csvstat`, `/opt/homebrew/bin/csvcut`, etc.
**Difficulty**: ⭐⭐ Beginner (Basic operations) / ⭐⭐⭐ Intermediate (Complex analysis)
**Common Use Cases**:
- CSV data analysis and manipulation
- Data cleaning and transformation
- Statistical analysis of tabular data
- CSV format conversion

**See Also**: `miller` (data processing), `datamash` (statistical operations), `awk` (text processing)

**Examples**:
```bash
# Get statistics about CSV data
csvstat data.csv                           # Basic statistics for all columns
csvstat -c column_name data.csv            # Statistics for specific column
csvstat --sum -c revenue data.csv          # Sum of revenue column

# Select and filter columns
csvcut -c 1,3,5 data.csv                   # Select columns 1, 3, 5
csvcut -c name,age,city data.csv           # Select columns by name
csvcut -n data.csv                         # Show column names and numbers

# Search and filter rows
csvgrep -c status -m "active" data.csv     # Filter rows where status is "active"
csvgrep -c age -r "^[3-9][0-9]" data.csv   # Regex: ages 30 and above
csvgrep -c city -f cities.txt data.csv     # Filter using values from file

# Format and convert
csvformat -T data.csv                      # Convert CSV to TSV
csvformat -U 1 data.csv                    # Remove duplicate headers
csvlook data.csv                           # Pretty print as table

# Sort and manipulate
csvsort -c column_name data.csv            # Sort by column
csvsort -c age -r data.csv                 # Reverse sort by age
csvstack file1.csv file2.csv > combined.csv  # Stack CSV files vertically

# Convert between formats
in2csv data.xlsx > data.csv                # Excel to CSV
in2csv --format ndjson data.json > data.csv  # NDJSON to CSV
csvjson data.csv > data.json               # CSV to JSON
```

### **miller** - Data Processing Multi-Tool
**Description**: Miller (mlr) processes name-indexed data (CSV, TSV, JSON) like awk, sed, cut, join, sort for structured data
**Location**: `/opt/homebrew/bin/mlr`
**Difficulty**: ⭐⭐⭐ Intermediate (Learning syntax) / ⭐⭐⭐⭐ Advanced (Complex transformations)
**Common Use Cases**:
- Multi-format data processing (CSV, TSV, JSON, XML)
- Data transformation and aggregation
- Stream processing of structured data
- Complex data analysis pipelines

**See Also**: `csvkit` (CSV-specific), `jq` (JSON processing), `datamash` (statistics)

**Examples**:
```bash
# Basic operations
mlr --csv cut -f name,age data.csv                    # Select columns
mlr --csv filter '$age > 30' data.csv                 # Filter rows
mlr --csv sort -f name data.csv                       # Sort by column
mlr --csv head -n 10 data.csv                         # First 10 rows

# Format conversion
mlr --icsv --ojson cat data.csv                       # CSV to JSON
mlr --ijson --ocsv cat data.json                      # JSON to CSV
mlr --icsv --otsv cat data.csv                        # CSV to TSV
mlr --icsv --opprint cat data.csv                     # CSV to pretty-printed table

# Statistical operations
mlr --csv stats1 -a mean,count -f age data.csv        # Mean and count of age
mlr --csv stats2 -a corr -f height,weight data.csv    # Correlation between columns
mlr --csv histogram -f age data.csv                   # Histogram of age values

# Data transformation
mlr --csv put '$age_group = ($age < 30) ? "young" : "old"' data.csv  # Add computed column
mlr --csv put '$salary *= 1.05' data.csv              # Increase salary by 5%
mlr --csv rename 'old_name,new_name' data.csv         # Rename column

# Aggregation and grouping
mlr --csv stats1 -a mean,sum -f salary -g department data.csv  # Group by department
mlr --csv count -f department data.csv                # Count by department
mlr --csv tac then sort -f name data.csv              # Reverse then sort

# Advanced pipeline
mlr --csv filter '$age > 25' then put '$bonus = $salary * 0.1' then stats1 -a sum -f bonus data.csv
```

### **datamash** - Statistical Operations
**Description**: Command-line program performing basic numeric, textual and statistical operations on input textual data files
**Location**: `/opt/homebrew/bin/datamash`
**Difficulty**: ⭐⭐ Beginner (Basic stats) / ⭐⭐⭐ Intermediate (Complex operations)
**Common Use Cases**:
- Statistical analysis of column data
- Mathematical operations on datasets
- Data grouping and aggregation
- Scientific data processing

**See Also**: `miller` (data processing), `csvkit` (CSV tools), `awk` (text processing)

**Examples**:
```bash
# Basic statistics
datamash mean 1 < data.txt                    # Mean of first column
datamash sum 1 count 1 < data.txt             # Sum and count
datamash min 1 max 1 median 1 < data.txt      # Min, max, median
datamash sstdev 1 var 1 < data.txt            # Standard deviation and variance

# Multiple columns
datamash mean 1 mean 2 sum 3 < data.txt       # Different operations on different columns
datamash -t, mean 2 sum 3 < data.csv          # CSV input (comma-separated)
datamash -W mean 1 sum 2 < data.txt           # Ignore whitespace

# Grouping operations
datamash -t, -g 1 mean 2 < data.csv           # Group by column 1, mean of column 2
datamash -t, -g 1,2 sum 3 count 3 < data.csv  # Group by two columns
datamash -g 1 unique 2 < data.txt             # Unique values in column 2 for each group

# Field operations
datamash transpose < data.txt                  # Transpose rows and columns
datamash reverse < data.txt                    # Reverse field order
datamash check < data.txt                      # Check data consistency

# Mathematical operations
seq 10 | datamash sum 1                       # Sum of numbers 1-10
echo -e "1 2\n3 4\n5 6" | datamash mean 1 mean 2  # Column means
```

### **csvq** - SQL on CSV Files
**Description**: SQL-like query language for CSV files
**Location**: `/opt/homebrew/bin/csvq`
**Difficulty**: ⭐⭐⭐ Intermediate (SQL knowledge required) / ⭐⭐⭐⭐ Advanced (Complex queries)
**Common Use Cases**:
- SQL queries on CSV files
- Data joining and analysis
- Complex data filtering and transformation
- CSV-based reporting

**See Also**: `dsq` (alternative SQL tool), `miller` (data processing), `sqlite3` (relational database)

**Examples**:
```bash
# Basic queries
csvq 'SELECT * FROM data.csv'                        # Select all data
csvq 'SELECT name, age FROM data.csv WHERE age > 30' # Filter and select columns
csvq 'SELECT COUNT(*) FROM data.csv'                 # Count rows
csvq 'SELECT DISTINCT department FROM data.csv'      # Unique values

# Aggregation and grouping
csvq 'SELECT department, AVG(salary) FROM data.csv GROUP BY department'
csvq 'SELECT department, COUNT(*) as count FROM data.csv GROUP BY department'
csvq 'SELECT MAX(age), MIN(age) FROM data.csv'

# Joins between CSV files
csvq 'SELECT e.name, e.salary, d.name as dept FROM employees.csv e JOIN departments.csv d ON e.dept_id = d.id'

# Output formatting
csvq -o output.csv 'SELECT * FROM data.csv WHERE age > 30'  # Save to file
csvq -f JSON 'SELECT name, age FROM data.csv'               # JSON output
csvq -f TSV 'SELECT * FROM data.csv'                        # TSV output

# Advanced queries
csvq 'SELECT name, CASE WHEN age < 30 THEN "young" ELSE "old" END as age_group FROM data.csv'
csvq 'SELECT * FROM data.csv ORDER BY salary DESC LIMIT 10' # Top 10 by salary
```

### **dsq** - SQL Queries on Structured Data
**Description**: Run SQL queries against JSON, CSV, Excel, Parquet, and more
**Location**: `/opt/homebrew/bin/dsq`
**Difficulty**: ⭐⭐⭐ Intermediate (SQL knowledge) / ⭐⭐⭐⭐ Advanced (Multiple formats)
**Common Use Cases**:
- SQL queries on multiple data formats
- Data format conversion via SQL
- Complex analytical queries
- Data pipeline processing

**See Also**: `csvq` (CSV-specific SQL), `jq` (JSON processing), `miller` (data processing)

**Examples**:
```bash
# Basic queries on different formats
dsq data.csv 'SELECT * FROM data WHERE age > 30'     # CSV query
dsq data.json 'SELECT name, age FROM data'           # JSON query  
dsq data.xlsx 'SELECT * FROM {} ORDER BY salary'     # Excel query
dsq data.parquet 'SELECT COUNT(*) FROM {}'           # Parquet query

# Multi-file queries
dsq employees.csv departments.json 'SELECT e.name, d.department FROM employees e JOIN departments d ON e.dept_id = d.id'

# Format conversion via SQL
dsq --output-format json data.csv 'SELECT * FROM data'    # CSV to JSON
dsq --output-format csv data.json 'SELECT * FROM data'    # JSON to CSV
dsq data.xlsx --output-format parquet 'SELECT * FROM {}'  # Excel to Parquet

# Complex analytical queries
dsq sales.csv 'SELECT region, SUM(amount) as total FROM sales GROUP BY region HAVING total > 10000'
dsq logs.json 'SELECT DATE(timestamp) as date, COUNT(*) as events FROM logs GROUP BY date ORDER BY date'
```

### **mysql** - MySQL Database Client
**Description**: Command-line tool for the MySQL database server
**Location**: `/opt/homebrew/bin/mysql`
**Difficulty**: ⭐⭐⭐ Intermediate (SQL knowledge) / ⭐⭐⭐⭐⭐ Expert (Database administration)
**Common Use Cases**:
- Database querying and management
- MySQL server administration
- Data import/export operations
- Application database integration

**See Also**: `psql` (PostgreSQL), `sqlite3` (SQLite), `mysqldump` (backup), `mysql_secure_installation`

**Examples**:
```bash
# Connect to MySQL server
mysql -u username -p                           # Connect with username (password prompt)
mysql -u root -h localhost -P 3306 -p          # Connect with specific host and port
mysql -u user -p database_name                 # Connect to specific database

# Execute queries from command line
mysql -u root -p -e "SHOW DATABASES;"          # Show all databases
mysql -u root -p -e "USE mydb; SHOW TABLES;"   # Show tables in database
mysql -u root -p database_name < script.sql    # Execute SQL script

# Database operations
mysql -u root -p -e "CREATE DATABASE myapp;"   # Create database
mysql -u root -p -e "DROP DATABASE olddb;"     # Delete database
mysql -u root -p -e "SHOW PROCESSLIST;"        # Show running queries

# Data import/export
mysqldump -u root -p database_name > backup.sql     # Export database
mysql -u root -p database_name < backup.sql         # Import database
mysql -u root -p -e "LOAD DATA INFILE 'data.csv' INTO TABLE mytable FIELDS TERMINATED BY ',';"

# User management
mysql -u root -p -e "CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON database_name.* TO 'newuser'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

# Performance and monitoring
mysql -u root -p -e "SHOW STATUS;"              # Server status
mysql -u root -p -e "SHOW VARIABLES;"           # Configuration variables
mysql -u root -p -e "EXPLAIN SELECT * FROM table WHERE condition;"  # Query analysis
```

### **psql** - PostgreSQL Interactive Terminal
**Description**: Interactive terminal for working with PostgreSQL database
**Location**: `/opt/homebrew/bin/psql`
**Difficulty**: ⭐⭐⭐ Intermediate (SQL knowledge) / ⭐⭐⭐⭐⭐ Expert (Advanced features)
**Common Use Cases**:
- PostgreSQL database querying and administration
- Interactive SQL command execution
- Database schema management
- Data analysis and reporting

**See Also**: `mysql` (MySQL), `sqlite3` (SQLite), `pg_dump` (backup), `createdb`, `dropdb`

**Examples**:
```bash
# Connect to PostgreSQL
psql -U username -d database_name               # Connect to specific database
psql -h localhost -p 5432 -U postgres           # Connect with host and port
psql -U postgres -c "SELECT version();"         # Execute single command

# Database operations
psql -U postgres -c "CREATE DATABASE myapp;"    # Create database
psql -U postgres -c "DROP DATABASE olddb;"      # Delete database
psql -U postgres -l                             # List all databases

# Meta-commands (within psql)
# \l                                            # List databases
# \c database_name                              # Connect to database
# \dt                                           # List tables
# \d table_name                                 # Describe table structure
# \du                                           # List users
# \q                                            # Quit psql

# Data import/export
pg_dump -U postgres database_name > backup.sql  # Export database
psql -U postgres database_name < backup.sql     # Import database
psql -U postgres -d mydb -c "\copy table FROM 'data.csv' CSV HEADER;"  # Import CSV

# Advanced queries
psql -U postgres -d mydb -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
psql -U postgres -d mydb -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='mytable';"

# JSON operations (PostgreSQL specific)
psql -U postgres -d mydb -c "SELECT data->>'name' FROM json_table WHERE data->>'status' = 'active';"
psql -U postgres -d mydb -c "SELECT jsonb_pretty(data) FROM json_table LIMIT 1;"

# Performance monitoring
psql -U postgres -c "SELECT * FROM pg_stat_activity;"           # Active connections
psql -U postgres -c "SELECT schemaname, tablename, attname, n_distinct, most_common_vals FROM pg_stats LIMIT 5;"
```

### **redis-cli** - Redis Command Line Interface
**Description**: Interactive command-line client for Redis key-value store
**Location**: `/opt/homebrew/bin/redis-cli`
**Difficulty**: ⭐⭐ Beginner (Basic commands) / ⭐⭐⭐⭐ Advanced (Complex operations)
**Common Use Cases**:
- Redis database operations and management
- Caching operations and testing
- Real-time data manipulation
- Session storage management

**See Also**: `redis-server` (Redis server), `redis-benchmark` (performance testing)

**Examples**:
```bash
# Connect to Redis
redis-cli                                       # Connect to localhost:6379
redis-cli -h hostname -p 6380                   # Connect to specific host/port
redis-cli -a password                           # Connect with authentication
redis-cli --scan --pattern "user:*"             # Scan keys with pattern

# Basic key-value operations
redis-cli SET mykey "Hello World"               # Set key-value
redis-cli GET mykey                             # Get value by key
redis-cli DEL mykey                             # Delete key
redis-cli EXISTS mykey                          # Check if key exists

# String operations
redis-cli INCR counter                          # Increment number
redis-cli DECR counter                          # Decrement number
redis-cli APPEND mykey " - appended"            # Append to string
redis-cli STRLEN mykey                          # Get string length

# List operations
redis-cli LPUSH mylist "item1" "item2"          # Push to list (left)
redis-cli RPUSH mylist "item3"                  # Push to list (right)
redis-cli LRANGE mylist 0 -1                   # Get all list items
redis-cli LPOP mylist                           # Pop from list (left)

# Set operations
redis-cli SADD myset "member1" "member2"        # Add to set
redis-cli SMEMBERS myset                        # Get all set members
redis-cli SISMEMBER myset "member1"             # Check set membership
redis-cli SCARD myset                           # Get set size

# Hash operations
redis-cli HSET user:1000 name "John Doe" age 30  # Set hash fields
redis-cli HGET user:1000 name                   # Get hash field
redis-cli HGETALL user:1000                     # Get all hash fields
redis-cli HDEL user:1000 age                    # Delete hash field

# Key management and info
redis-cli KEYS "*"                              # List all keys (use carefully)
redis-cli SCAN 0 MATCH "user:*" COUNT 100       # Scan keys safely
redis-cli TTL mykey                             # Get key expiration time
redis-cli EXPIRE mykey 3600                     # Set key expiration (1 hour)

# Database operations
redis-cli FLUSHDB                               # Clear current database
redis-cli FLUSHALL                              # Clear all databases
redis-cli SELECT 1                              # Switch to database 1
redis-cli INFO                                  # Server information
redis-cli MONITOR                               # Monitor all commands (debugging)

# Batch operations
redis-cli --eval script.lua                     # Execute Lua script
redis-cli --pipe < commands.txt                 # Execute multiple commands from file
```

---

## Media Processing Tools

### **ffmpeg** - Media Processing Swiss Army Knife
**Description**: Complete cross-platform solution for recording, converting, and streaming audio and video
**Location**: `/opt/homebrew/bin/ffmpeg`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic conversion) / ⭐⭐⭐⭐⭐ Expert (Complex processing)
**Common Use Cases**:
- Video and audio format conversion
- Media compression and optimization
- Stream processing and manipulation
- Video/audio editing and filtering

**See Also**: `imagemagick` (image processing), `sox` (audio processing), `youtube-dl` (media downloading)

**Examples**:
```bash
# Basic format conversion
ffmpeg -i input.mp4 output.avi           # Convert video format
ffmpeg -i input.wav output.mp3           # Convert audio format
ffmpeg -i input.mp4 output.mp3           # Extract audio from video

# Video compression and quality control
ffmpeg -i input.mp4 -crf 23 output.mp4               # Variable bitrate (good quality)
ffmpeg -i input.mp4 -b:v 1M output.mp4               # Fixed bitrate
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4    # Resize video

# Audio processing
ffmpeg -i input.mp3 -ab 128k output.mp3              # Change audio bitrate
ffmpeg -i input.wav -ac 1 output.wav                 # Convert to mono
ffmpeg -i input.mp3 -ar 44100 output.mp3             # Change sample rate

# Video manipulation
ffmpeg -i input.mp4 -ss 00:01:30 -t 00:00:30 output.mp4    # Extract 30-second clip starting at 1:30
ffmpeg -i input.mp4 -vf "crop=640:480:0:0" output.mp4      # Crop video
ffmpeg -i input.mp4 -vf "rotate=90*PI/180" output.mp4      # Rotate 90 degrees

# Concatenation and merging
ffmpeg -f concat -i filelist.txt -c copy output.mp4   # Concatenate videos (filelist.txt contains file paths)
ffmpeg -i video.mp4 -i audio.wav -c:v copy -c:a aac output.mp4  # Add audio track to video

# Streaming and live processing
ffmpeg -f avfoundation -i "0" -vcodec libx264 -f flv rtmp://server/live/stream  # Stream webcam (macOS)
ffmpeg -re -i input.mp4 -f flv rtmp://server/live/stream  # Stream video file

# Advanced filtering
ffmpeg -i input.mp4 -vf "drawtext=text='Watermark':x=10:y=10" output.mp4  # Add text overlay
ffmpeg -i input.mp4 -vf "fps=30" output.mp4                               # Change frame rate
```

### **sox** - Sound Exchange Audio Processor
**Description**: Swiss Army knife of sound processing programs, command-line audio manipulation
**Location**: `/opt/homebrew/bin/sox`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic operations) / ⭐⭐⭐⭐ Advanced (Complex effects)
**Common Use Cases**:
- Audio format conversion
- Audio effects and filtering
- Audio analysis and statistics
- Batch audio processing

**See Also**: `ffmpeg` (video/audio conversion), `play` (sox playback), `rec` (sox recording)

**Examples**:
```bash
# Format conversion
sox input.wav output.mp3                    # Convert WAV to MP3
sox input.flac output.wav                   # Convert FLAC to WAV
sox input.mp3 -r 44100 output.wav          # Convert with sample rate

# Audio effects
sox input.wav output.wav vol 0.5            # Reduce volume by half
sox input.wav output.wav reverb             # Add reverb effect
sox input.wav output.wav echo 0.8 0.9 1000 0.3  # Add echo effect
sox input.wav output.wav speed 1.5          # Speed up audio by 50%

# Audio analysis
sox input.wav -n stat                       # Show audio statistics
sox input.wav -n trim 0 10 stat            # Stats for first 10 seconds
soxi input.wav                              # Show file information

# Audio manipulation
sox input.wav output.wav trim 30 60         # Extract 60 seconds starting at 30s
sox input.wav output.wav fade 3 -0 3        # Add 3-second fade in/out
sox input1.wav input2.wav output.wav        # Concatenate audio files
sox input.wav output.wav channels 1         # Convert to mono

# Batch processing
for file in *.wav; do sox "$file" "${file%.wav}.mp3"; done  # Convert all WAV to MP3
```

### **exiftool** - Metadata Reader/Writer
**Description**: Platform-independent Perl application for reading, writing and editing meta information
**Location**: `/opt/homebrew/bin/exiftool`
**Difficulty**: ⭐⭐ Beginner (Reading metadata) / ⭐⭐⭐⭐ Advanced (Complex editing)
**Common Use Cases**:
- Image/video metadata analysis
- GPS and camera information extraction
- Bulk metadata editing
- Digital forensics and investigation

**See Also**: `imagemagick` (image processing), `ffmpeg` (media metadata), `file` (basic file info)

**Examples**:
```bash
# Read metadata
exiftool image.jpg                          # Show all metadata
exiftool -s -s -s -Make image.jpg          # Get camera make only
exiftool -GPS* image.jpg                   # Show GPS information
exiftool -CreateDate image.jpg             # Show creation date

# Write/modify metadata
exiftool -Artist="John Doe" image.jpg      # Set artist name
exiftool -Copyright="©2024" *.jpg          # Add copyright to all JPGs
exiftool -GPS*= image.jpg                  # Remove all GPS data
exiftool -overwrite_original -GPS*= *.jpg  # Strip GPS from all images

# Batch operations
exiftool -r -ext jpg -Make .               # Find all JPG files and show camera make
exiftool -csv -r -ext jpg . > metadata.csv # Export metadata to CSV
exiftool -d "%Y-%m-%d %H:%M:%S" -CreateDate -r . # Show creation dates recursively

# Rename files based on metadata
exiftool '-filename<CreateDate' -d "%Y%m%d_%H%M%S%%+c.%%e" *.jpg
# Rename: IMG_1234.jpg → 20240315_143022.jpg

# Advanced metadata manipulation
exiftool -TagsFromFile source.jpg target.jpg    # Copy metadata between files
exiftool -geotag gps_log.gpx *.jpg             # Add GPS coordinates from GPX file
```

### **imagemagick (convert/magick)** - Image Manipulation Suite  
**Description**: Software suite for displaying, converting, and editing raster image and vector image files
**Location**: `/opt/homebrew/bin/convert`, `/opt/homebrew/bin/magick`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic operations) / ⭐⭐⭐⭐⭐ Expert (Complex compositions)
**Common Use Cases**:
- Image format conversion
- Image resizing and manipulation
- Batch image processing
- Image effects and compositing

**See Also**: `exiftool` (metadata handling), `ffmpeg` (video processing), `sips` (macOS image processing)

**Examples**:
```bash
# Format conversion
convert image.png image.jpg                 # PNG to JPG
convert image.tiff image.webp               # TIFF to WebP
magick *.png pdf_output.pdf                # Multiple images to PDF

# Resizing and scaling
convert input.jpg -resize 800x600 output.jpg           # Resize to 800x600
convert input.jpg -resize 50% output.jpg               # Resize to 50% of original
convert input.jpg -thumbnail 200x200 output.jpg        # Create thumbnail

# Image effects and manipulation
convert input.jpg -rotate 90 output.jpg                # Rotate 90 degrees
convert input.jpg -flip output.jpg                     # Flip vertically
convert input.jpg -flop output.jpg                     # Flip horizontally
convert input.jpg -negate output.jpg                   # Invert colors

# Quality and compression
convert input.jpg -quality 80 output.jpg               # Set JPEG quality
convert input.png -strip output.png                    # Remove metadata
convert input.jpg -colorspace Gray output.jpg          # Convert to grayscale

# Batch processing
mogrify -resize 800x600 *.jpg                         # Resize all JPGs in place
mogrify -format png *.jpg                             # Convert all JPGs to PNG
for img in *.jpg; do convert "$img" -resize 400x400 "thumb_$img"; done

# Advanced operations
convert input.jpg -crop 300x300+100+100 output.jpg    # Crop 300x300 starting at (100,100)
convert input.jpg -blur 2x2 output.jpg                # Apply blur
convert -background white -fill black -font Arial -pointsize 72 label:"Hello" text.png
```

### **pandoc** - Universal Document Converter
**Description**: Universal markup converter supporting numerous document formats
**Location**: `/opt/homebrew/bin/pandoc`
**Difficulty**: ⭐⭐ Beginner (Basic conversion) / ⭐⭐⭐⭐ Advanced (Custom templates)
**Common Use Cases**:
- Convert between document formats (Markdown, HTML, PDF, Word, etc.)
- Generate documentation from markup
- Academic paper preparation
- Static site generation support

**See Also**: `markdown` (Markdown processor), `latex` (LaTeX typesetting), `asciidoc` (text document format)

**Examples**:
```bash
# Basic format conversions
pandoc document.md -o document.html              # Markdown to HTML
pandoc document.md -o document.pdf               # Markdown to PDF
pandoc document.html -o document.docx            # HTML to Word document
pandoc document.docx -o document.md              # Word document to Markdown

# Advanced PDF generation
pandoc document.md -o document.pdf --pdf-engine=xelatex          # Use XeLaTeX engine
pandoc document.md -o document.pdf --toc                         # Include table of contents
pandoc document.md -o document.pdf --template=custom.latex       # Use custom template

# Multiple input files
pandoc chapter1.md chapter2.md chapter3.md -o book.pdf          # Combine multiple files
pandoc *.md -o complete_guide.html                              # Convert all markdown files

# Customization and metadata
pandoc document.md -o document.html --css=styles.css            # Add CSS styling
pandoc document.md -o document.pdf --metadata title="My Title"  # Add metadata
pandoc document.md -o document.html --self-contained            # Embed all assets

# Academic writing
pandoc paper.md -o paper.pdf --bibliography=refs.bib --csl=apa.csl  # With citations
pandoc document.md -o document.html --mathjax                       # Math support for web
pandoc document.md -o document.pdf --number-sections                # Numbered sections

# Presentation generation
pandoc slides.md -o slides.html -t revealjs                     # HTML presentation
pandoc slides.md -o slides.pdf -t beamer                        # PDF slides (LaTeX Beamer)

# Advanced filtering and processing
pandoc document.md -o document.html --filter pandoc-crossref    # Cross-references
pandoc document.md -o document.pdf --lua-filter=custom.lua      # Custom Lua filter
```

### **imagemagick** - Image Processing Suite
**Description**: Software suite for creating, editing, composing, and converting images
**Location**: `/opt/homebrew/bin/magick` (ImageMagick 7) or `/opt/homebrew/bin/convert` (legacy)
**Difficulty**: ⭐⭐⭐ Intermediate (Basic operations) / ⭐⭐⭐⭐ Advanced (Complex image manipulation)
**Common Use Cases**:
- Image format conversion and optimization
- Batch image processing
- Image resizing and manipulation
- Automated image workflows

**See Also**: `ffmpeg` (video processing), `exiftool` (metadata), `gimp` (advanced editing)

**Examples**:
```bash
# Basic format conversion
magick input.jpg output.png               # Convert JPEG to PNG
magick input.tiff output.jpg              # Convert TIFF to JPEG
magick *.jpg output.pdf                   # Combine images into PDF

# Resizing and scaling
magick input.jpg -resize 800x600 output.jpg          # Resize to specific dimensions
magick input.jpg -resize 50% output.jpg              # Resize to 50% of original
magick input.jpg -resize 800x600! output.jpg         # Force exact dimensions (ignore aspect ratio)
magick input.jpg -thumbnail 200x200 output.jpg       # Create thumbnail

# Image enhancement and effects
magick input.jpg -enhance output.jpg                 # Enhance image
magick input.jpg -normalize output.jpg               # Normalize contrast
magick input.jpg -sharpen 0x1 output.jpg            # Sharpen image
magick input.jpg -blur 0x8 output.jpg               # Blur image
magick input.jpg -rotate 90 output.jpg              # Rotate 90 degrees

# Color and brightness adjustments
magick input.jpg -brightness-contrast 10x5 output.jpg    # Adjust brightness/contrast
magick input.jpg -modulate 120,80,100 output.jpg         # Adjust brightness, saturation, hue
magick input.jpg -colorspace Gray output.jpg             # Convert to grayscale
magick input.jpg -sepia-tone 80% output.jpg              # Apply sepia effect

# Batch processing
magick mogrify -resize 800x600 *.jpg                     # Resize all JPEG files in place
magick mogrify -format png *.jpg                         # Convert all JPEG to PNG
for img in *.jpg; do magick "$img" -resize 50% "small_$img"; done  # Batch with prefix

# Advanced composition and effects
magick input.jpg -crop 300x300+100+100 output.jpg        # Crop image
magick input1.jpg input2.jpg -append output.jpg          # Combine vertically
magick input1.jpg input2.jpg +append output.jpg          # Combine horizontally
magick input.jpg -flip output.jpg                        # Flip vertically
magick input.jpg -flop output.jpg                        # Flip horizontally

# Text and watermarks
magick input.jpg -pointsize 30 -fill white -annotate +50+100 'Watermark' output.jpg
magick -size 800x600 xc:white -pointsize 48 -fill black -annotate +100+300 'Hello World' text.jpg
```

---

## Text Editors

### **vim** - Vi Improved
**Description**: Highly configurable text editor
**Location**: `/usr/bin/vim`
**Difficulty**: ⭐⭐⭐⭐⭐ Expert (Steep learning curve, modal editing)
**Common Use Cases**:
- Code editing
- Configuration file editing
- Remote file editing

**Basic Commands**:
```bash
# Open file
vim filename

# Insert mode: i
# Command mode: Esc
# Save and quit: :wq
# Quit without saving: :q!
# Search: /pattern
# Replace: :%s/old/new/g
```

### **nano** - Simple Text Editor
**Description**: Simple, user-friendly text editor
**Location**: `/usr/bin/nano`
**Difficulty**: ⭐ Beginner (Very user-friendly with on-screen help)
**Common Use Cases**:
- Quick file editing
- Configuration changes
- Simple text manipulation

**Examples**:
```bash
# Edit file
nano filename

# Ctrl+O: Save
# Ctrl+X: Exit
# Ctrl+W: Search
# Ctrl+K: Cut line
# Ctrl+U: Paste
```

---

## Utility Tools

### **xargs** - Execute Commands with Arguments
**Description**: Build and execute command lines from standard input
**Location**: `/usr/bin/xargs`
**Common Use Cases**:
- Command construction from input
- Parallel execution
- Pipeline processing

**Examples**:
```bash
# Basic usage
echo "file1 file2" | xargs rm

# One argument per command
find . -name "*.tmp" | xargs -I {} rm {}

# Parallel execution
find . -name "*.log" | xargs -P 4 gzip
```

### **which** - Locate Commands
**Description**: Locate a command in PATH
**Location**: `/usr/bin/which`
**Common Use Cases**:
- Command location discovery
- PATH verification
- Script debugging

**Examples**:
```bash
# Find command location
which python3

# Find all matches
which -a python
```

### **file** - File Type Detection
**Description**: Determine file type
**Location**: `/usr/bin/file`
**Common Use Cases**:
- File type identification
- Content analysis
- Security verification

**Examples**:
```bash
# Identify file type
file filename

# MIME type
file --mime filename

# Brief output
file -b filename
```

### **units** - Unit Conversion Calculator
**Description**: Interactive unit conversion between various measurement systems
**Location**: `/usr/bin/units`
**Difficulty**: ⭐⭐ Beginner (Easy to use with helpful prompts)
**Common Use Cases**:
- Scientific calculations
- Engineering conversions
- International unit conversions
- Educational purposes

**Examples**:
```bash
# Interactive mode
units
# You have: 100 celsius
# You want: fahrenheit
# * 212
# / 0.0055556

# Command line conversions
units "100 celsius" "fahrenheit"     # Temperature conversion
units "1 mile" "km"                  # Distance conversion
units "1 gallon" "liters"            # Volume conversion
units "1 pound" "kg"                 # Weight conversion

# Complex unit conversions
units "60 mph" "m/s"                 # Speed conversion
units "1 acre" "square meters"       # Area conversion
units "1 horsepower" "watts"         # Power conversion
units "1 psi" "bar"                  # Pressure conversion

# Scientific conversions
units "1 light year" "km"            # Astronomical distances
units "1 joule" "calories"           # Energy conversion
units "1 newton" "pounds force"      # Force conversion
units "1 tesla" "gauss"              # Magnetic field

# Currency (if data available)
units "100 USD" "EUR"                # Currency conversion

# Mathematical expressions
units "pi * 2 * 6371 km" "miles"     # Earth's circumference
units "9.8 m/s^2 * 70 kg" "newtons" # Force calculation

# List available units
units --help                         # Show help
units "meter" ""                     # Show meter definitions
units "" "temperature"               # Show temperature units

# Useful shortcuts
units "100F" "C"                     # Fahrenheit to Celsius
units "1 ft" "m"                     # Feet to meters
units "1 cup" "ml"                   # Cooking measurements
```

### **chmod** - Change File Permissions
**Description**: Change file mode bits
**Location**: `/bin/chmod`
**Common Use Cases**:
- Security management
- File permission setting
- Access control

⚠️ **SECURITY WARNING**:
- **Incorrect permissions can COMPROMISE SYSTEM SECURITY**
- **`chmod 777` makes files readable/writable by EVERYONE** - avoid unless necessary
- **Recursive permission changes affect ALL subdirectories** - use with caution
- **Wrong permissions can BREAK system functionality** or lock you out
- **Always understand permission numbers** before applying them

**Permission Safety Guidelines**:
- **Files**: Generally use 644 (readable by all, writable by owner only)
- **Executables**: Use 755 (executable by all, writable by owner only)
- **Private files**: Use 600 (readable/writable by owner only)
- **Directories**: Use 755 for accessible directories, 700 for private
- **NEVER use 777** unless absolutely necessary and temporary

**Safe Usage Tips**:
- Check current permissions first: `ls -l file`
- Test on copies of important files first
- Use `stat` to see detailed permission info
- Understand octal notation: 755 = rwxr-xr-x
- Be careful with recursive (`-R`) operations

**Examples**:
```bash
# Make executable
chmod +x script.sh

# Set specific permissions
chmod 755 file

# Recursive change
chmod -R 644 directory/
```

### **env** - Environment Management
**Description**: Display or modify the environment for command execution
**Location**: `/usr/bin/env`
**Common Use Cases**:
- View environment variables
- Execute commands with modified environment
- Scripting with portable interpreters
- Clean environment execution

**See Also**: `export` (set variables), `unset` (remove variables), `printenv` (display variables)

**Examples**:
```bash
# Display all environment variables
env

# Display specific environment variable
env | grep PATH

# Run command with modified environment
env VAR=value command

# Run command with clean environment
env -i command

# Run with specific environment additions
env PATH=/usr/bin:/bin command

# Common in scripts for portable interpreter
#!/usr/bin/env python3
#!/usr/bin/env bash

# Run command without a specific variable
env -u HOME command

# Show differences between environments
env | sort > before.env
export NEW_VAR=value
env | sort > after.env
diff before.env after.env
```

### **date** - Date and Time Display
**Description**: Display or set the system date and time
**Location**: `/bin/date`
**Common Use Cases**:
- Current date/time display
- Timestamp generation
- Date arithmetic and formatting
- Script timestamping

**See Also**: `cal` (calendar display), `uptime` (system uptime)

**Examples**:
```bash
# Current date and time
date

# Custom format
date "+%Y-%m-%d %H:%M:%S"

# ISO format
date -I

# Unix timestamp
date +%s

# Date from timestamp
date -r 1234567890

# Date arithmetic (macOS)
date -v+1d  # Tomorrow
date -v-1w  # One week ago
date -v+1m  # One month from now

# UTC time
date -u

# Custom formats
date "+%A, %B %d, %Y"  # Monday, January 01, 2024
date "+%Y%m%d_%H%M%S"  # 20240101_120000 (for filenames)

# Parse date string
date -j -f "%Y-%m-%d" "2024-01-01"
```

### **bc** - Basic Calculator
**Description**: Arbitrary precision calculator language
**Location**: `/usr/bin/bc`
**Common Use Cases**:
- Command-line calculations
- Floating-point arithmetic
- Mathematical scripting
- Precision calculations

**See Also**: `dc` (desk calculator), `expr` (expression evaluation)

**Examples**:
```bash
# Interactive calculator
bc

# Quick calculation
echo "2 + 3" | bc

# Floating point with precision
echo "scale=2; 22/7" | bc

# Scientific calculations
echo "sqrt(2)" | bc -l

# Hexadecimal conversion
echo "obase=16; 255" | bc

# Binary conversion
echo "obase=2; 255" | bc

# Power calculation
echo "2^10" | bc

# Scripted calculations
bc <<< "scale=4; 1/3"

# Mathematical functions (with -l option)
echo "s(3.14159/2)" | bc -l  # sine
echo "c(0)" | bc -l          # cosine
echo "l(2.718)" | bc -l      # natural log
```

### **dc** - Desk Calculator (RPN)
**Description**: Reverse Polish Notation (RPN) calculator
**Location**: `/usr/bin/dc`
**Difficulty**: ⭐⭐⭐ Intermediate (RPN notation requires learning)
**Common Use Cases**:
- Stack-based calculations
- Scripting mathematical operations
- Precise arithmetic calculations
- Educational purposes for RPN

**Examples**:
```bash
# Basic arithmetic (RPN: operands first, then operator)
echo "2 3 + p" | dc    # 2 + 3 = 5 (p prints result)
echo "5 4 - p" | dc    # 5 - 4 = 1
echo "6 7 * p" | dc    # 6 * 7 = 42
echo "15 3 / p" | dc   # 15 / 3 = 5

# Power and roots
echo "2 10 ^ p" | dc   # 2^10 = 1024
echo "2 v p" | dc      # square root of 2

# Stack operations
echo "5 3 2 + * p" | dc    # 5 * (3 + 2) = 25
echo "10 3 2 + / p" | dc   # 10 / (3 + 2) = 2

# Precision (k sets decimal places)
echo "2 k 22 7 / p" | dc   # 22/7 with 2 decimal places

# Number base conversion
echo "16 o 255 p" | dc     # Convert 255 to hexadecimal (FF)
echo "2 o 42 p" | dc       # Convert 42 to binary

# Variables and macros
echo "5 sa la 3 + p" | dc  # Store 5 in 'a', load 'a', add 3

# Interactive mode
dc
# > 5 3 +
# > p
# 8
# > q

# Useful one-liners
echo "16 i FF p" | dc      # Convert FF (hex) to decimal
echo "8 i 755 p" | dc      # Convert 755 (octal) to decimal
```

### **cal** - Calendar Display
**Description**: Display calendar
**Location**: `/opt/homebrew/opt/util-linux/bin/cal`
**Common Use Cases**:
- Date reference
- Planning and scheduling
- Quick date lookups
- Month/year overview

**See Also**: `date` (current date/time), `ncal` (alternative calendar)

**Examples**:
```bash
# Current month calendar
cal

# Specific month and year
cal 12 2024

# Whole year
cal 2024

# Highlight today (when available)
cal -h

# Monday as first day of week
cal -m

# Julian day numbers
cal -j

# Three months (previous, current, next)
cal -3

# Specific number of months before/after
cal -A 2 -B 1  # 1 month before, current, 2 months after
```

### **yes** - Repeat Output
**Description**: Output a string repeatedly until killed
**Location**: `/usr/bin/yes`
**Common Use Cases**:
- Automated responses to prompts
- Generate test data streams
- Stress testing
- Pipeline testing

**See Also**: `seq` (number sequences), `repeat` (shell builtin)

**Examples**:
```bash
# Output 'y' repeatedly (default)
yes

# Output specific string repeatedly
yes "hello world"

# Pipe to another command (be careful!)
yes | head -5

# Generate large files for testing
yes "test line" | head -1000000 > large_test_file.txt

# Automated responses to prompts
yes | apt-get install package
```

### **seq** - Sequence Generator
**Description**: Print sequences of numbers
**Location**: `/usr/bin/seq`
**Common Use Cases**:
- Generate number sequences
- Loop iteration in scripts
- Create ranges for processing
- Test data generation

**See Also**: `yes` (repeat strings), `range` (Python equivalent)

**Examples**:
```bash
# Count from 1 to 10
seq 10

# Count from 5 to 15
seq 5 15

# Count with step
seq 1 2 10  # 1, 3, 5, 7, 9

# Reverse sequence
seq 10 -1 1

# With formatting
seq -f "file%03g.txt" 1 5  # file001.txt, file002.txt, etc.

# Separator
seq -s ", " 1 5  # 1, 2, 3, 4, 5

# Equal width padding
seq -w 1 10  # 01, 02, 03, ..., 10

# Use in loops
for i in $(seq 1 5); do echo "Processing $i"; done

# Generate test files
seq 1 100 | xargs -I{} touch "file{}.txt"
```

### **basename** - Extract Filename
**Description**: Return filename portion of pathname
**Location**: `/usr/bin/basename`
**Common Use Cases**:
- Extract filename from path
- Script path manipulation
- File processing loops
- Remove directory components

**See Also**: `dirname` (extract directory), `realpath` (absolute paths)

**Examples**:
```bash
# Extract filename
basename /path/to/file.txt  # outputs: file.txt

# Remove extension
basename /path/to/file.txt .txt  # outputs: file

# Multiple extensions
basename file.tar.gz .tar.gz  # outputs: file

# Use in scripts
filename=$(basename "$0")  # Get script name
for file in *.txt; do
    name=$(basename "$file" .txt)
    echo "Processing $name"
done

# With variables
path="/home/user/documents/report.pdf"
filename=$(basename "$path")  # report.pdf
name=$(basename "$path" .pdf)  # report
```

### **dirname** - Extract Directory
**Description**: Return directory portion of pathname
**Location**: `/usr/bin/dirname`
**Common Use Cases**:
- Extract directory from path
- Navigate to file's directory
- Script directory detection
- Path manipulation

**See Also**: `basename` (extract filename), `realpath` (absolute paths)

**Examples**:
```bash
# Extract directory
dirname /path/to/file.txt  # outputs: /path/to

# Current directory case
dirname file.txt  # outputs: .

# Root directory case
dirname /file.txt  # outputs: /

# Use in scripts
script_dir=$(dirname "$0")  # Get script directory
cd "$(dirname "$0")"  # Change to script directory

# Process files in their directories
for file in /path/to/*/*.txt; do
    dir=$(dirname "$file")
    name=$(basename "$file")
    echo "File $name in directory $dir"
done

# Create backup in same directory
file="/path/to/important.txt"
backup_dir=$(dirname "$file")
cp "$file" "$backup_dir/$(basename "$file").backup"
```

### **realpath** - Absolute Path Resolution
**Description**: Return absolute pathname
**Location**: `/bin/realpath`
**Common Use Cases**:
- Resolve relative paths
- Follow symbolic links
- Canonical path determination
- Script path resolution

**See Also**: `readlink` (resolve links), `pwd` (current directory)

**Examples**:
```bash
# Convert relative to absolute path
realpath ./file.txt

# Resolve symbolic links
realpath symbolic_link

# Multiple paths
realpath file1.txt ../dir/file2.txt

# Canonicalize path (remove . and ..)
realpath /path/to/../from/./file.txt

# Get script's real path
script_path=$(realpath "$0")
script_dir=$(dirname "$(realpath "$0")")

# Relative to specific directory
realpath --relative-to=/home/user /home/user/documents/file.txt
# outputs: documents/file.txt

# Check if paths are the same after resolution
if [ "$(realpath path1)" = "$(realpath path2)" ]; then
    echo "Same file"
fi
```

### **expr** - Expression Evaluation
**Description**: Evaluate expressions
**Location**: `/bin/expr`
**Common Use Cases**:
- Arithmetic calculations
- String operations
- Conditional expressions
- Script mathematics

**See Also**: `bc` (advanced calculator), `test` (conditional testing)

**Examples**:
```bash
# Basic arithmetic
expr 5 + 3  # outputs: 8
expr 10 - 4  # outputs: 6
expr 6 \* 7  # outputs: 42 (note escaped *)
expr 15 / 3  # outputs: 5
expr 17 % 5  # outputs: 2 (remainder)

# String length
expr length "hello world"  # outputs: 11

# Substring extraction
expr substr "hello world" 1 5  # outputs: hello
expr substr "hello world" 7 5  # outputs: world

# String matching
expr "hello123" : '.*[0-9]*'  # outputs: 8 (length of match)
expr "hello123" : '[a-z]*'    # outputs: 5

# Index of character
expr index "hello" "l"  # outputs: 3 (first occurrence)

# Use in scripts
counter=1
counter=$(expr $counter + 1)  # increment

# Comparison (returns 1 for true, 0 for false)
expr 5 \> 3   # outputs: 1
expr 2 \< 1   # outputs: 0
expr 5 = 5    # outputs: 1
```

### **apply** - Execute Commands with Arguments
**Description**: Apply a command to a set of arguments
**Location**: `/usr/bin/apply`
**Common Use Cases**:
- Batch command execution
- Parameter substitution
- Script automation
- File processing workflows

**Examples**:
```bash
# Basic usage - apply echo to multiple arguments
apply echo file1.txt file2.txt file3.txt

# Use placeholders - %1 for first arg, %2 for second, etc.
apply 'mv %1 %1.bak' *.txt

# Process pairs of arguments
apply 'diff %1 %2' file1.old file1.new file2.old file2.new

# Copy files with specific pattern
apply 'cp %1 backup/%1' *.conf

# Execute command with multiple parameters per call
apply -2 'cmp %1 %2' file1 file2 file3 file4

# Rename files with pattern substitution
apply 'mv %1 $(basename %1 .tmp).txt' *.tmp

# Create directories and move files
apply 'mkdir -p dir_%1 && mv file_%1 dir_%1/' 1 2 3 4 5

# Process log files
apply 'gzip %1 && mv %1.gz archive/' *.log

# Batch image processing (if tools available)
apply 'convert %1 -resize 50% thumb_%1' *.jpg

# Archive files by date pattern
apply 'tar -czf archive_%1.tar.gz *_%1.txt' 2023 2024
```

### **locale** - Locale Information
**Description**: Display and set locale information for internationalization
**Location**: `/usr/bin/locale`
**Difficulty**: ⭐⭐ Beginner (Simple information display)
**Common Use Cases**:
- Check current locale settings
- Debug internationalization issues
- Script environment configuration
- System administration

**Examples**:
```bash
# Display current locale settings
locale

# Show all available locales
locale -a

# Display specific locale category
locale LC_TIME
locale LC_NUMERIC
locale LC_MONETARY

# Show all locale categories with values
locale -k LC_ALL

# Check specific locale variables
echo $LANG
echo $LC_ALL

# Set locale for current session
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Test locale-specific formatting
date                    # Date in current locale
printf "%'.2f\n" 1234.56  # Number formatting

# Generate locale definition (advanced)
locale charmap          # Show character mapping
locale era             # Show era information
locale yesexpr         # Show yes/no expressions
```

### **iconv** - Character Set Conversion
**Description**: Convert text between different character encodings
**Location**: `/usr/bin/iconv`
**Difficulty**: ⭐⭐⭐ Intermediate (Requires understanding of character encodings)
**Common Use Cases**:
- Convert file encodings
- Text data migration
- Web content processing
- Legacy system integration

**Examples**:
```bash
# List available encodings
iconv --list

# Convert file from one encoding to another
iconv -f ISO-8859-1 -t UTF-8 input.txt > output.txt

# Convert from default encoding to UTF-8
iconv -t UTF-8 file.txt

# Convert Windows text to Unix
iconv -f CP1252 -t UTF-8 windows_file.txt > unix_file.txt

# Handle conversion errors
iconv -f UTF-8 -t ASCII//IGNORE input.txt    # Ignore unconvertible chars
iconv -f UTF-8 -t ASCII//TRANSLIT input.txt  # Transliterate when possible

# Convert in place (using temp file)
iconv -f ISO-8859-1 -t UTF-8 file.txt > temp.txt && mv temp.txt file.txt

# Convert multiple files
for file in *.txt; do
  iconv -f ISO-8859-1 -t UTF-8 "$file" > "${file%.txt}_utf8.txt"
done

# Check if file needs conversion
file -b --mime-encoding filename.txt

# Common encoding conversions
iconv -f SHIFT_JIS -t UTF-8 japanese.txt     # Japanese text
iconv -f GBK -t UTF-8 chinese.txt           # Chinese text
iconv -f KOI8-R -t UTF-8 russian.txt        # Russian text

# Pipe usage
curl -s http://example.com | iconv -f ISO-8859-1 -t UTF-8
```

---

## macOS-Specific Tools

### **pbcopy** - Pasteboard Copy
**Description**: Copy data to the macOS clipboard
**Location**: `/usr/bin/pbcopy`
**Common Use Cases**:
- Copy command output to clipboard
- Script automation
- Data transfer between applications
- Quick text sharing

**See Also**: `pbpaste` (paste from clipboard), `open` (open files/URLs)

**Examples**:
```bash
# Copy file contents to clipboard
pbcopy < file.txt

# Copy command output
ls -la | pbcopy

# Copy text directly
echo "Hello World" | pbcopy

# Copy with formatting
ps aux | pbcopy

# Copy current directory path
pwd | pbcopy

# Copy git commit hash
git rev-parse HEAD | pbcopy
```

### **pbpaste** - Pasteboard Paste
**Description**: Paste data from the macOS clipboard
**Location**: `/usr/bin/pbpaste`
**Common Use Cases**:
- Retrieve clipboard contents
- Process clipboard data
- Script input from clipboard
- Data pipeline integration

**See Also**: `pbcopy` (copy to clipboard), `open` (open files/URLs)

**Examples**:
```bash
# Paste clipboard contents
pbpaste

# Save clipboard to file
pbpaste > clipboard.txt

# Process clipboard data
pbpaste | grep "pattern"

# Count lines in clipboard
pbpaste | wc -l

# Append clipboard to file
pbpaste >> log.txt

# Use in scripts
if pbpaste | grep -q "error"; then
    echo "Error found in clipboard"
fi
```

### **open** - Open Files and Applications
**Description**: Open files, directories, and URLs with default applications
**Location**: `/usr/bin/open`
**Common Use Cases**:
- Open files with default apps
- Launch applications
- Open URLs in browsers
- Reveal files in Finder

**See Also**: `pbcopy` (copy data), `say` (text to speech)

**Examples**:
```bash
# Open file with default application
open file.txt

# Open URL in default browser
open https://google.com

# Open directory in Finder
open .

# Open with specific application
open -a "Visual Studio Code" file.txt

# Open new instance
open -n -a Calculator

# Open and wait for application to quit
open -W -a TextEdit file.txt

# Reveal in Finder
open -R file.txt

# Edit file (uses default editor)
open -e file.txt

# Open multiple files
open *.pdf
```

### **say** - Text to Speech
**Description**: Convert text to speech using macOS speech synthesis
**Location**: `/usr/bin/say`
**Common Use Cases**:
- Accessibility features
- Notifications and alerts
- Script feedback
- Audio announcements

**See Also**: `open` (open files), `pbpaste` (clipboard access)

**Examples**:
```bash
# Speak text
say "Hello World"

# Speak file contents
say -f file.txt

# Different voice
say -v Alex "Hello"

# List available voices
say -v '?'

# Custom speaking rate
say -r 200 "Fast speech"

# Save to audio file
say -o output.aiff "Hello World"

# Speak from clipboard
pbpaste | say

# Background speaking
say "Process complete" &

# Use in scripts for notifications
if command_succeeds; then
    say "Task completed successfully"
else
    say "Task failed"
fi
```

### **plutil** - Property List Utility
**Description**: Convert and manipulate property list files (plist)
**Location**: `/usr/bin/plutil`
**Difficulty**: ⭐⭐⭐ Intermediate (Requires plist knowledge)
**Common Use Cases**:
- macOS configuration management
- Application preference editing
- System settings modification
- Development and debugging

**Examples**:
```bash
# Check plist syntax
plutil file.plist

# Convert between formats
plutil -convert xml1 file.plist              # Convert to XML
plutil -convert binary1 file.plist           # Convert to binary
plutil -convert json file.plist              # Convert to JSON

# Create output file
plutil -convert xml1 -o output.plist input.plist

# Extract values (requires key path)
plutil -extract "CFBundleVersion" raw Info.plist

# Replace values
plutil -replace "CFBundleVersion" -string "1.2.0" Info.plist

# Insert new key-value pairs
plutil -insert "NewKey" -string "NewValue" file.plist

# Remove keys
plutil -remove "UnwantedKey" file.plist

# Validate and show contents
plutil -p file.plist                         # Pretty print

# Check specific app preferences
plutil -p ~/Library/Preferences/com.apple.finder.plist

# Backup before modifying
cp file.plist file.plist.backup
plutil -replace "key" -string "value" file.plist
```

### **sw_vers** - Software Version Information
**Description**: Display macOS version and build information
**Location**: `/usr/bin/sw_vers`
**Difficulty**: ⭐ Beginner (Simple information display)
**Common Use Cases**:
- System information gathering
- Script environment detection
- Compatibility checking
- System administration

**Examples**:
```bash
# Show all version information
sw_vers

# Show only product name
sw_vers -productName

# Show only version number
sw_vers -productVersion

# Show only build version
sw_vers -buildVersion

# Use in scripts for version checking
if [[ $(sw_vers -productVersion | cut -d. -f1) -ge 11 ]]; then
    echo "macOS Big Sur or later"
fi

# Get major version number
MACOS_VERSION=$(sw_vers -productVersion | cut -d. -f1)
echo "macOS major version: $MACOS_VERSION"

# Combined system info
echo "System: $(sw_vers -productName) $(sw_vers -productVersion)"
echo "Build: $(sw_vers -buildVersion)"
echo "Architecture: $(uname -m)"
```

### **system_profiler** - System Information
**Description**: Generate detailed system configuration reports
**Location**: `/usr/sbin/system_profiler`
**Difficulty**: ⭐⭐ Beginner (Many options but straightforward)
**Common Use Cases**:
- Hardware inventory
- System diagnostics
- Configuration documentation
- Technical support

**Examples**:
```bash
# List all available data types
system_profiler -listDataTypes

# Full system profile (very detailed)
system_profiler

# Hardware overview
system_profiler SPHardwareDataType

# Software information
system_profiler SPSoftwareDataType

# Storage devices
system_profiler SPStorageDataType

# Network configuration
system_profiler SPNetworkDataType

# USB devices
system_profiler SPUSBDataType

# Memory information
system_profiler SPMemoryDataType

# Multiple categories
system_profiler SPHardwareDataType SPSoftwareDataType

# Export to file
system_profiler SPHardwareDataType > hardware_info.txt

# JSON output
system_profiler -json SPHardwareDataType

# XML output
system_profiler -xml SPHardwareDataType

# Detailed timeout for slow operations
system_profiler -timeout 30 SPHardwareDataType

# Quick hardware summary
system_profiler SPHardwareDataType | grep -E "(Model|Processor|Memory|Serial)"
```

### **caffeinate** - Prevent Sleep
**Description**: Prevent system from sleeping
**Location**: `/usr/bin/caffeinate`
**Common Use Cases**:
- Long-running processes
- Prevent system sleep during tasks
- Presentation mode
- Background job management

**See Also**: `pmset` (power management), `nohup` (run after logout)

**Examples**:
```bash
# Prevent sleep indefinitely
caffeinate

# Prevent sleep for specific duration (seconds)
caffeinate -t 3600

# Prevent sleep while command runs
caffeinate make install

# Prevent display sleep only
caffeinate -d

# Prevent system sleep only
caffeinate -i

# Prevent disk sleep
caffeinate -m

# Verbose output
caffeinate -v long_running_command

# Background prevention
caffeinate -t 7200 &  # 2 hours
```

### **diskutil** - Disk Utility
**Description**: Disk and volume management utility
**Location**: `/usr/sbin/diskutil`
**Common Use Cases**:
- Disk information and management
- Volume mounting/unmounting
- Disk repair and verification
- Partition management

**See Also**: `df` (disk space), `mount` (mount filesystems), `umount` (unmount)

**Examples**:
```bash
# List all disks
diskutil list

# Get disk information
diskutil info disk0

# Mount volume
diskutil mount disk1s1

# Unmount volume
diskutil unmount disk1s1

# Eject disk
diskutil eject disk1

# Verify disk
diskutil verifyVolume /

# Repair permissions (older macOS)
diskutil repairPermissions /

# Create partition
sudo diskutil partitionDisk disk1 2 GPT "Case-sensitive Journaled HFS+" "Partition1" 50% "Case-sensitive Journaled HFS+" "Partition2" 50%

# Erase disk
sudo diskutil eraseDisk JHFS+ "NewName" disk1
```

### **banner** - Text Banner Generator
**Description**: Create large text banners using ASCII characters
**Location**: `/usr/bin/banner`
**Difficulty**: ⭐ Beginner (Simple text formatting tool)
**Common Use Cases**:
- Script headers and separators
- Terminal output formatting
- System notifications
- Log file section markers

**Examples**:
```bash
# Basic banner
banner "Hello"

# Multiple words (separate arguments)
banner "BUILD" "COMPLETE"

# Script section separator
banner "Starting Backup Process"

# Error notifications
banner "ERROR" "CHECK LOGS"

# Use in scripts for visibility
echo "=== DEPLOYMENT SCRIPT ==="
banner "DEPLOY"
echo "Starting deployment at $(date)"

# Combine with other tools
banner "WARNING" | tee -a deployment.log

# Create visual separators
echo; banner "SECTION 1"; echo
echo "Content for section 1"
echo; banner "SECTION 2"; echo
echo "Content for section 2"

# Use with colors (if terminal supports)
printf "\033[1;31m"  # Red
banner "CRITICAL"
printf "\033[0m"     # Reset

# Log file headers
{
  echo "=== LOG START $(date) ==="
  banner "SYSTEM CHECK"
  echo "=========================="
} >> system.log
```

---

## Documentation & Help Tools

### **man** - Manual Pages
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

### **whatis** - Brief Command Descriptions
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

### **apropos** - Search Manual Pages
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

---

## Terminal & Session Management

### **screen** - Terminal Multiplexer
**Description**: Full-screen window manager that multiplexes a physical terminal
**Location**: `/usr/bin/screen`
**Common Use Cases**:
- Remote session management
- Long-running process isolation
- Multiple terminal sessions
- Session persistence

**See Also**: `nohup` (background processes), `tmux` (modern alternative), `jobs` (job control)

**Examples**:
```bash
# Start new screen session
screen

# Start named session
screen -S mysession

# List active sessions
screen -ls

# Reattach to session
screen -r

# Reattach to specific session
screen -r mysession

# Detach from session (within screen)
# Ctrl+A, then D

# Kill session
screen -X -S mysession quit

# Create new window (within screen)
# Ctrl+A, then C

# Switch between windows (within screen)
# Ctrl+A, then N (next) or P (previous)

# Send command to session
screen -S mysession -X stuff "ls\n"
```

### **script** - Record Terminal Session
**Description**: Record terminal sessions
**Location**: `/usr/bin/script`
**Common Use Cases**:
- Session logging
- Training documentation
- Debugging record
- Compliance logging

**See Also**: `screen` (session management), `history` (command history)

**Examples**:
```bash
# Start recording session
script

# Record to specific file
script session.log

# Append to existing file
script -a session.log

# Quiet mode (no start/stop messages)
script -q session.log

# Record with timing
script -t 2>timing.log session.log

# Replay session with timing
scriptreplay timing.log session.log

# Exit recording
exit
```

### **tput** - Terminal Capability Interface
**Description**: Initialize a terminal or query terminfo database for terminal-dependent capabilities
**Location**: `/usr/bin/tput`
**Common Use Cases**:
- Terminal control and formatting
- Cursor positioning
- Color output generation
- Screen manipulation

**Examples**:
```bash
# Clear screen
tput clear

# Move cursor to position (row, col)
tput cup 5 10

# Set text colors
tput setaf 1  # Red text
tput setaf 2  # Green text
tput setaf 3  # Yellow text
tput setaf 4  # Blue text
tput sgr0     # Reset to normal

# Bold and underline text
tput bold
echo "Bold text"
tput smul
echo "Underlined text"
tput rmul  # Remove underline

# Get terminal dimensions
cols=$(tput cols)
lines=$(tput lines)
echo "Terminal: ${cols}x${lines}"

# Save and restore cursor position
tput sc    # Save cursor
tput rc    # Restore cursor

# Terminal bell/beep
tput bel

# Hide and show cursor
tput civis  # Hide cursor
tput cnorm  # Show cursor
```

### **clear** - Clear Terminal Screen
**Description**: Clear the terminal screen
**Location**: `/usr/bin/clear`
**Common Use Cases**:
- Screen cleanup
- Script presentation
- User interface refresh
- Output organization

**Examples**:
```bash
# Clear entire screen
clear

# Clear and reset scrollback (some terminals)
clear && printf '\033[3J'

# Use in scripts for clean output
echo "Starting process..."
sleep 2
clear
echo "Process complete!"

# Alternative using escape sequences
printf "\033c"  # Reset terminal
printf "\033[2J" # Clear screen
printf "\033[H"  # Move cursor to top
```

### **reset** - Reset Terminal Settings
**Description**: Initialize terminal to default settings
**Location**: `/usr/bin/reset`
**Common Use Cases**:
- Fix corrupted terminal display
- Restore default settings
- Clear stuck terminal states
- Recover from binary output

**Examples**:
```bash
# Basic terminal reset
reset

# Hard reset (more thorough)
reset -e

# Fix terminal after displaying binary file
cat binary_file  # Terminal gets corrupted
reset            # Fix terminal

# Alternative reset methods
stty sane        # Reset terminal line settings
tput reset       # Reset using tput
printf "\033c"   # Reset using escape sequence

# Reset specific terminal types
TERM=xterm reset
TERM=vt100 reset
```

---

## Common Workflows

This section demonstrates real-world workflows that combine multiple CLI tools to accomplish common development and system administration tasks.

### **Development Workflows**

#### **Code Search and Analysis**
Find and analyze code patterns across a project:
```bash
# Find all JavaScript functions and count them
find . -name "*.js" -exec grep -l "function " {} \; | wc -l

# Find TODO comments with context
rg -n "TODO|FIXME|BUG" --type js -A 2 -B 1

# Analyze code complexity - find long functions
find . -name "*.py" -exec awk '/^def |^class / {name=$2; line=NR} /^$/ && name {print FILENAME ":" line ":" name " (" NR-line " lines)"; name=""}' {} \;

# Search for security vulnerabilities
rg -i "password|secret|token" --type js | grep -v node_modules
```

#### **Git Workflow Automation**
Complete feature development workflow:
```bash
# Create feature branch and switch
git checkout -b feature/new-feature

# Stage all changes and commit
git add . && git commit -m "feat: implement new feature"

# Rebase onto latest main before pushing
git fetch origin main
git rebase origin/main

# Push and create PR
git push -u origin feature/new-feature
gh pr create --title "Add new feature" --body "Description of changes"

# Clean up after merge
git checkout main && git pull origin main
git branch -d feature/new-feature
```

#### **Build and Deployment Pipeline**
Automated build, test, and deploy:
```bash
# Clean and install dependencies
rm -rf node_modules package-lock.json
npm install

# Run tests and generate coverage
npm test -- --coverage
[ $? -eq 0 ] || exit 1

# Build for production
npm run build

# Create deployment package
tar -czf deploy-$(date +%Y%m%d-%H%M%S).tar.gz dist/

# Deploy to server
scp deploy-*.tar.gz user@server:/opt/app/
ssh user@server 'cd /opt/app && tar -xzf deploy-*.tar.gz && systemctl restart app'
```

### **Data Processing Workflows**

#### **Log Analysis Pipeline**
Extract and analyze application logs:
```bash
# Extract error logs from the last hour
find /var/log -name "*.log" -newermt "1 hour ago" \
  -exec grep -l "ERROR\|FATAL" {} \; \
  | xargs cat \
  | sort \
  | uniq -c \
  | sort -nr

# Parse and analyze access logs
cat access.log \
  | awk '{print $1}' \
  | sort \
  | uniq -c \
  | sort -nr \
  | head -10

# Monitor real-time error patterns
tail -f application.log \
  | grep --line-buffered "ERROR" \
  | awk '{print $1, $2, $4}' \
  | tee error_summary.log
```

#### **CSV Data Processing**
Process and analyze CSV data files:
```bash
# Extract specific columns and filter
cat sales_data.csv \
  | cut -d',' -f1,3,5 \
  | grep "2024" \
  | sort -t',' -k3nr \
  | head -20 > top_sales.csv

# Calculate statistics
awk -F',' 'NR>1 {sum+=$3; count++} END {print "Average:", sum/count}' sales_data.csv

# Join data from multiple files
join -t',' -1 1 -2 1 <(sort users.csv) <(sort orders.csv) > user_orders.csv
```

### **System Administration Workflows**

#### **Server Health Check**
Complete system health monitoring:
```bash
#!/bin/bash
# System health check script

echo "=== System Health Report $(date) ===" | tee health_report.txt

# System information
echo "System Info:" >> health_report.txt
uname -a >> health_report.txt
uptime >> health_report.txt

# Disk usage
echo -e "\nDisk Usage:" >> health_report.txt
df -h | grep -E "(Filesystem|/dev/)" >> health_report.txt

# Memory usage
echo -e "\nMemory Usage:" >> health_report.txt
free -h >> health_report.txt

# Top processes
echo -e "\nTop CPU Processes:" >> health_report.txt
ps aux --sort=-%cpu | head -6 >> health_report.txt

# Network connections
echo -e "\nNetwork Status:" >> health_report.txt
netstat -tuln | grep LISTEN >> health_report.txt

# Check critical services
echo -e "\nService Status:" >> health_report.txt
for service in nginx mysql redis; do
    if pgrep -x "$service" > /dev/null; then
        echo "$service: RUNNING" >> health_report.txt
    else
        echo "$service: NOT RUNNING" >> health_report.txt
    fi
done
```

#### **Backup and Sync Operations**
Automated backup workflow:
```bash
# Create timestamped backup
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/$BACKUP_DATE"
mkdir -p "$BACKUP_DIR"

# Backup databases
mysqldump -u root -p database_name > "$BACKUP_DIR/database.sql"
gzip "$BACKUP_DIR/database.sql"

# Backup application files
rsync -av --exclude='node_modules' \
      --exclude='.git' \
      /var/www/app/ "$BACKUP_DIR/app/"

# Create archive
tar -czf "/backups/backup_$BACKUP_DATE.tar.gz" -C "$BACKUP_DIR" .

# Sync to remote backup server
rsync -av "/backups/backup_$BACKUP_DATE.tar.gz" \
      backup@remote-server:/backups/

# Clean old backups (keep last 7 days)
find /backups -name "backup_*.tar.gz" -mtime +7 -delete
```

### **Container and Cloud Workflows**

#### **Docker Development Environment**
Set up complete development environment:
```bash
# Build development image
docker build -t myapp:dev -f Dockerfile.dev .

# Start development stack
docker-compose up -d database redis

# Run application in development mode
docker run -it --rm \
  --network myapp_default \
  -v $(pwd):/app \
  -p 3000:3000 \
  myapp:dev npm run dev

# Development database operations
docker exec -it myapp_database_1 mysql -u root -p myapp

# View logs from all services
docker-compose logs -f --tail=100
```

#### **Kubernetes Deployment Workflow**
Deploy application to Kubernetes:
```bash
# Set up cluster context
kubectl config use-context production

# Create namespace if not exists
kubectl create namespace myapp --dry-run=client -o yaml | kubectl apply -f -

# Deploy application
kubectl apply -f k8s/
kubectl rollout status deployment/myapp -n myapp

# Check deployment health
kubectl get pods -n myapp
kubectl describe deployment myapp -n myapp

# Scale application
kubectl scale deployment myapp --replicas=3 -n myapp

# Update application
kubectl set image deployment/myapp app=myapp:v2.0 -n myapp
kubectl rollout status deployment/myapp -n myapp

# Rollback if needed
kubectl rollout undo deployment/myapp -n myapp
```

### **Security and Monitoring Workflows**

#### **Security Audit Pipeline**
Automated security checks:
```bash
#!/bin/bash
# Security audit script

echo "=== Security Audit $(date) ===" | tee security_audit.txt

# Check file permissions
echo "Checking sensitive file permissions:" >> security_audit.txt
find /etc -name "passwd" -o -name "shadow" -o -name "sudoers" \
  -exec ls -la {} \; >> security_audit.txt

# Check for SUID binaries
echo -e "\nSUID binaries:" >> security_audit.txt
find / -perm -4000 -type f 2>/dev/null >> security_audit.txt

# Active network connections
echo -e "\nActive connections:" >> security_audit.txt
netstat -tuln >> security_audit.txt

# Failed login attempts
echo -e "\nRecent failed logins:" >> security_audit.txt
grep "Failed password" /var/log/auth.log | tail -20 >> security_audit.txt

# Check for updates
echo -e "\nSecurity updates available:" >> security_audit.txt
apt list --upgradable 2>/dev/null | grep -i security >> security_audit.txt
```

### **Performance Analysis Workflows**

#### **Application Performance Profiling**
Analyze application performance:
```bash
# Monitor system resources during load test
(
  # Start monitoring in background
  iostat -x 1 > io_stats.txt &
  IO_PID=$!
  
  # Run load test
  curl -w "@curl-format.txt" -s -o /dev/null \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}' \
    http://localhost:3000/api/test
  
  # Stop monitoring
  kill $IO_PID
  
  # Analyze results
  echo "I/O Statistics:"
  tail -20 io_stats.txt
)

# Profile memory usage
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -20

# Network performance test
ping -c 10 google.com | tail -1 | awk -F'/' '{print "Average latency:", $5 "ms"}'
```

---

## Advanced Integration Patterns

This section covers sophisticated CLI tool combinations, advanced pipeline techniques, and expert-level integration patterns for complex tasks.

### **Complex Pipeline Patterns**

#### **Multi-Stage Data Processing Pipeline**
Advanced data transformation with error handling and progress tracking:
```bash
#!/bin/bash
# Advanced data processing pipeline with error handling and logging

set -euo pipefail  # Exit on error, undefined vars, pipe failures

LOG_FILE="processing_$(date +%Y%m%d_%H%M%S).log"
exec 1> >(tee -a "$LOG_FILE")
exec 2> >(tee -a "$LOG_FILE" >&2)

echo "Starting data processing pipeline at $(date)"

# Stage 1: Data collection and validation
echo "Stage 1: Data Collection"
find /data/input -name "*.csv" -type f -size +0c | \
while IFS= read -r file; do
    echo "Processing: $file"
    # Validate CSV structure
    if head -1 "$file" | grep -q "timestamp,value,status"; then
        echo "✓ Valid format: $file"
        echo "$file" >> valid_files.list
    else
        echo "✗ Invalid format: $file" >&2
        echo "$file" >> invalid_files.list
    fi
done

# Stage 2: Parallel processing with progress tracking
echo "Stage 2: Data Transformation"
total_files=$(wc -l < valid_files.list)
current=0

cat valid_files.list | \
xargs -I {} -P 4 bash -c '
    file="$1"
    output_file="/data/processed/$(basename "$file" .csv)_processed.csv"
    
    # Complex transformation pipeline
    cat "$file" | \
    awk -F"," "NR>1 {
        # Data cleaning and transformation
        gsub(/[^a-zA-Z0-9,.-]/, \"\", \$0)  # Remove special chars
        if (\$2 > 0 && \$3 ~ /^(active|inactive)\$/) {
            print \$1 \",\" \$2 * 1.1 \",\" \$3 \",processed\"
        }
    }" | \
    sort -t"," -k1,1 > "$output_file"
    
    echo "Processed: $(basename "$file")"
' -- {}

echo "Stage 3: Data Aggregation and Reporting"
# Combine all processed files and generate report
find /data/processed -name "*_processed.csv" | \
xargs cat | \
awk -F"," '
BEGIN { 
    print "=== Processing Report ==="
    total_records = 0
    active_count = 0
    sum_values = 0
}
{
    total_records++
    sum_values += $2
    if ($3 == "active") active_count++
}
END {
    print "Total records:", total_records
    print "Active records:", active_count
    print "Average value:", sum_values / total_records
    print "Processing completed at", strftime("%Y-%m-%d %H:%M:%S")
}' | tee processing_report.txt

echo "Pipeline completed successfully at $(date)"
```

#### **Intelligent File Processing with Conditional Branching**
Dynamic processing based on file types and content analysis:
```bash
#!/bin/bash
# Intelligent file processor with conditional branching

process_file() {
    local file="$1"
    local file_type=$(file -b --mime-type "$file")
    local file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
    
    echo "Processing: $file (Type: $file_type, Size: $file_size bytes)"
    
    case "$file_type" in
        "text/plain")
            # Text file analysis
            if [[ $file_size -gt 1048576 ]]; then  # > 1MB
                echo "Large text file - using streaming analysis"
                tail -f "$file" | \
                while IFS= read -r line; do
                    echo "$line" | grep -E "(ERROR|WARN|FATAL)" | \
                    awk '{print strftime("%Y-%m-%d %H:%M:%S"), $0}' >> errors_$(basename "$file").log
                done &
                BG_PID=$!
                sleep 5  # Process for 5 seconds
                kill $BG_PID 2>/dev/null
            else
                echo "Small text file - full analysis"
                wc -l "$file"
                grep -c "ERROR\|WARN" "$file" || echo "0 errors/warnings found"
            fi
            ;;
        "application/json")
            echo "JSON file - validating and extracting data"
            if jq empty "$file" 2>/dev/null; then
                jq -r '.[] | select(.status == "error") | .message' "$file" > "$(basename "$file" .json)_errors.txt"
                echo "✓ Valid JSON processed"
            else
                echo "✗ Invalid JSON format" >&2
                return 1
            fi
            ;;
        "text/csv")
            echo "CSV file - statistical analysis"
            # Dynamic column analysis
            headers=$(head -1 "$file")
            num_cols=$(echo "$headers" | tr ',' '\n' | wc -l)
            num_rows=$(tail -n +2 "$file" | wc -l)
            
            echo "CSV Analysis:"
            echo "  Columns: $num_cols"
            echo "  Rows: $num_rows"
            
            # Find numeric columns and calculate statistics
            for ((i=1; i<=num_cols; i++)); do
                col_name=$(echo "$headers" | cut -d',' -f$i)
                # Check if column contains numbers
                if tail -n +2 "$file" | cut -d',' -f$i | grep -E '^[0-9]+(\.[0-9]+)?$' >/dev/null 2>&1; then
                    avg=$(tail -n +2 "$file" | cut -d',' -f$i | awk '{sum+=$1; count++} END {if(count>0) print sum/count; else print 0}')
                    echo "  $col_name (numeric): average = $avg"
                fi
            done
            ;;
        *)
            echo "Unknown file type - performing basic analysis"
            ls -la "$file"
            hexdump -C "$file" | head -5
            ;;
    esac
}

# Main processing loop with parallel execution
export -f process_file

find "$1" -type f | \
head -50 | \
xargs -I {} -P 8 bash -c 'process_file "$@"' _ {}
```

### **Advanced Monitoring and Alerting Pipelines**

#### **Real-time System Monitoring with Intelligent Alerting**
Sophisticated system monitoring with threshold-based alerting:
```bash
#!/bin/bash
# Advanced monitoring system with intelligent alerting

ALERT_EMAIL="admin@company.com"
LOG_FILE="/var/log/system_monitor.log"
ALERT_THRESHOLDS="cpu:80,memory:85,disk:90,load:5.0"

# Parse thresholds
declare -A thresholds
for threshold in ${ALERT_THRESHOLDS//,/ }; do
    key=${threshold%:*}
    value=${threshold#*:}
    thresholds[$key]=$value
done

log_with_timestamp() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

send_alert() {
    local metric="$1"
    local current="$2"
    local threshold="$3"
    local message="ALERT: $metric is at $current%, threshold is $threshold%"
    
    log_with_timestamp "$message"
    
    # Send email alert (if mail is configured)
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "System Alert: $metric" "$ALERT_EMAIL"
    fi
    
    # Send to system log
    logger -p user.warn "$message"
}

# Continuous monitoring loop
while true; do
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # CPU usage
    cpu_usage=$(ps aux | awk '{cpu += $3} END {print int(cpu)}')
    if [[ $cpu_usage -gt ${thresholds[cpu]} ]]; then
        send_alert "CPU" "$cpu_usage" "${thresholds[cpu]}"
    fi
    
    # Memory usage
    if command -v free >/dev/null 2>&1; then
        memory_usage=$(free | awk '/^Mem:/{printf("%.0f", $3/$2 * 100)}')
    else
        # macOS alternative
        memory_usage=$(vm_stat | awk '
            /Pages free:/ { free = $3 }
            /Pages active:/ { active = $3 }
            /Pages inactive:/ { inactive = $3 }
            /Pages speculative:/ { speculative = $3 }
            /Pages wired down:/ { wired = $4 }
            END {
                total = (free + active + inactive + speculative + wired)
                used = (active + inactive + wired)
                printf("%.0f", used / total * 100)
            }')
    fi
    
    if [[ $memory_usage -gt ${thresholds[memory]} ]]; then
        send_alert "Memory" "$memory_usage" "${thresholds[memory]}"
    fi
    
    # Disk usage
    disk_usage=$(df -h / | awk 'NR==2 {print int($5)}')
    if [[ $disk_usage -gt ${thresholds[disk]} ]]; then
        send_alert "Disk" "$disk_usage" "${thresholds[disk]}"
    fi
    
    # Load average
    if command -v uptime >/dev/null 2>&1; then
        load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}' | tr -d ' ')
        if (( $(echo "$load_avg > ${thresholds[load]}" | bc -l) )); then
            send_alert "Load Average" "$load_avg" "${thresholds[load]}"
        fi
    fi
    
    # Log current status
    log_with_timestamp "Status - CPU: ${cpu_usage}%, Memory: ${memory_usage}%, Disk: ${disk_usage}%, Load: ${load_avg}"
    
    sleep 60  # Check every minute
done
```

### **Sophisticated Development Automation**

#### **Intelligent Code Quality Pipeline**
Advanced code analysis and quality assurance:
```bash
#!/bin/bash
# Advanced code quality pipeline with multiple analysis tools

set -euo pipefail

PROJECT_ROOT="${1:-.}"
QUALITY_REPORT="quality_report_$(date +%Y%m%d_%H%M%S).md"

echo "# Code Quality Report - $(date)" > "$QUALITY_REPORT"
echo "## Project: $(basename $(pwd))" >> "$QUALITY_REPORT"
echo "" >> "$QUALITY_REPORT"

# Function to add section to report
add_section() {
    local title="$1"
    local content="$2"
    echo "## $title" >> "$QUALITY_REPORT"
    echo '```' >> "$QUALITY_REPORT"
    echo "$content" >> "$QUALITY_REPORT"
    echo '```' >> "$QUALITY_REPORT"
    echo "" >> "$QUALITY_REPORT"
}

echo "Running comprehensive code quality analysis..."

# 1. Code complexity analysis
echo "Analyzing code complexity..."
complexity_analysis=$(find "$PROJECT_ROOT" -name "*.py" -o -name "*.js" -o -name "*.java" -o -name "*.c" -o -name "*.cpp" | \
while IFS= read -r file; do
    case "${file##*.}" in
        py)
            # Python complexity (count indentation levels)
            max_indent=$(awk '{
                gsub(/\t/, "    ", $0)
                indent = length($0) - length(ltrim($0))
                if (indent > max) max = indent
            } 
            function ltrim(str) { gsub(/^ +/, "", str); return str }
            END { print max/4 }' "$file")
            echo "$file: Max nesting level $max_indent"
            ;;
        js)
            # JavaScript complexity (count braces)
            brace_depth=$(awk '
            { 
                for(i=1; i<=length($0); i++) {
                    char = substr($0, i, 1)
                    if (char == "{") depth++
                    else if (char == "}") depth--
                    if (depth > max) max = depth
                }
            } 
            END { print max }' "$file")
            echo "$file: Max brace depth $brace_depth"
            ;;
        *)
            line_count=$(wc -l < "$file")
            if [[ $line_count -gt 500 ]]; then
                echo "$file: Large file ($line_count lines) - consider refactoring"
            fi
            ;;
    esac
done | sort -k3 -nr)

add_section "Code Complexity Analysis" "$complexity_analysis"

# 2. Security vulnerability scan
echo "Scanning for potential security issues..."
security_scan=$(find "$PROJECT_ROOT" -type f -name "*.py" -o -name "*.js" -o -name "*.java" | \
xargs grep -nH -E "(password|secret|token|api_key|private_key)" | \
grep -v -E "(#.*|//.*|\*.*)" | \
head -20)

if [[ -n "$security_scan" ]]; then
    add_section "⚠️  Potential Security Issues" "$security_scan"
else
    add_section "✅ Security Scan" "No obvious security issues found"
fi

# 3. Code duplication detection
echo "Detecting code duplication..."
duplication_report=$(find "$PROJECT_ROOT" -name "*.py" -o -name "*.js" | \
while IFS= read -r file1; do
    find "$PROJECT_ROOT" -name "*.py" -o -name "*.js" | \
    while IFS= read -r file2; do
        if [[ "$file1" < "$file2" ]]; then  # Avoid duplicate comparisons
            # Simple similarity check using common lines
            common_lines=$(comm -12 <(sort "$file1") <(sort "$file2") | wc -l)
            total_lines=$(wc -l < "$file1")
            if [[ $common_lines -gt 10 && $total_lines -gt 0 ]]; then
                similarity=$((common_lines * 100 / total_lines))
                if [[ $similarity -gt 30 ]]; then
                    echo "$file1 and $file2: $similarity% similar ($common_lines common lines)"
                fi
            fi
        fi
    done
done | head -10)

if [[ -n "$duplication_report" ]]; then
    add_section "Code Duplication Report" "$duplication_report"
else
    add_section "✅ Code Duplication" "No significant code duplication detected"
fi

# 4. Dependency analysis
echo "Analyzing dependencies..."
dependency_analysis=""

# Python dependencies
if find "$PROJECT_ROOT" -name "requirements.txt" -o -name "Pipfile" | head -1 | read -r; then
    dependency_analysis+="Python Dependencies:\n"
    find "$PROJECT_ROOT" -name "requirements.txt" -exec cat {} \; | head -20
    dependency_analysis+="\n"
fi

# JavaScript dependencies
if find "$PROJECT_ROOT" -name "package.json" | head -1 | read -r; then
    dependency_analysis+="JavaScript Dependencies:\n"
    find "$PROJECT_ROOT" -name "package.json" -exec jq -r '.dependencies | keys[]' {} \; 2>/dev/null | head -20
fi

if [[ -n "$dependency_analysis" ]]; then
    add_section "Dependency Analysis" "$dependency_analysis"
fi

# 5. Generate summary metrics
echo "Generating summary metrics..."
total_files=$(find "$PROJECT_ROOT" -type f -name "*.py" -o -name "*.js" -o -name "*.java" -o -name "*.c" -o -name "*.cpp" | wc -l)
total_lines=$(find "$PROJECT_ROOT" -type f -name "*.py" -o -name "*.js" -o -name "*.java" -o -name "*.c" -o -name "*.cpp" -exec wc -l {} \; | awk '{sum+=$1} END {print sum}')

summary="Total Code Files: $total_files
Total Lines of Code: $total_lines
Average Lines per File: $((total_lines / total_files))
Analysis Completed: $(date)
Report Location: $QUALITY_REPORT"

add_section "📊 Summary Metrics" "$summary"

echo "Code quality analysis complete. Report saved to: $QUALITY_REPORT"
```

### **Advanced Data Pipeline Integration**

#### **Multi-Source Data Aggregation with Error Recovery**
Robust data pipeline with fallback mechanisms:
```bash
#!/bin/bash
# Advanced data aggregation pipeline with error recovery

set -euo pipefail

# Configuration
declare -A DATA_SOURCES=(
    ["api"]="curl -s https://api.example.com/data"
    ["database"]="mysql -u user -p'pass' -e 'SELECT * FROM metrics' db"
    ["logs"]="find /var/log -name '*.log' -mtime -1 -exec grep 'METRIC' {} \;"
    ["files"]="find /data/input -name '*.csv' -mtime -1"
)

TEMP_DIR=$(mktemp -d)
OUTPUT_FILE="aggregated_data_$(date +%Y%m%d_%H%M%S).json"
ERROR_LOG="pipeline_errors.log"

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

log_error() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') ERROR: $1" | tee -a "$ERROR_LOG" >&2
}

log_info() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') INFO: $1"
}

# Fetch data from source with retry logic
fetch_data() {
    local source_name="$1"
    local command="$2"
    local output_file="$TEMP_DIR/${source_name}.json"
    local retry_count=0
    local max_retries=3
    
    while [[ $retry_count -lt $max_retries ]]; do
        log_info "Fetching data from $source_name (attempt $((retry_count + 1)))"
        
        if eval "$command" > "$output_file" 2>/dev/null; then
            # Validate JSON format for API sources
            if [[ "$source_name" == "api" ]]; then
                if jq empty "$output_file" 2>/dev/null; then
                    log_info "Successfully fetched data from $source_name"
                    return 0
                else
                    log_error "Invalid JSON from $source_name"
                fi
            else
                # For non-JSON sources, convert to JSON format
                case "$source_name" in
                    "database")
                        # Convert MySQL output to JSON
                        awk -F'\t' '
                        NR==1 { for(i=1; i<=NF; i++) headers[i]=$i; next }
                        { 
                            printf "{"
                            for(i=1; i<=NF; i++) {
                                printf "\"%s\":\"%s\"", headers[i], $i
                                if(i<NF) printf ","
                            }
                            printf "}\n"
                        }' "$output_file" | jq -s '.' > "${output_file}.tmp" && mv "${output_file}.tmp" "$output_file"
                        ;;
                    "logs")
                        # Convert log entries to JSON
                        sed 's/.*METRIC: \(.*\)/{"metric": "\1", "timestamp": "'$(date -Iseconds)'"}/' "$output_file" | jq -s '.' > "${output_file}.tmp" && mv "${output_file}.tmp" "$output_file"
                        ;;
                    "files")
                        # List files as JSON array
                        jq -R -s 'split("\n") | map(select(length > 0)) | map({"file": .})' "$output_file" > "${output_file}.tmp" && mv "${output_file}.tmp" "$output_file"
                        ;;
                esac
                log_info "Successfully processed data from $source_name"
                return 0
            fi
        else
            log_error "Failed to fetch data from $source_name"
        fi
        
        retry_count=$((retry_count + 1))
        sleep $((retry_count * 2))  # Exponential backoff
    done
    
    log_error "Failed to fetch data from $source_name after $max_retries attempts"
    echo '[]' > "$output_file"  # Create empty JSON array as fallback
    return 1
}

# Parallel data fetching
log_info "Starting data aggregation pipeline"

for source in "${!DATA_SOURCES[@]}"; do
    fetch_data "$source" "${DATA_SOURCES[$source]}" &
done

wait  # Wait for all background processes

# Aggregate all data sources
log_info "Aggregating data from all sources"
jq -s '
{
    "timestamp": now | strftime("%Y-%m-%d %H:%M:%S"),
    "sources": {
        "api": .[0],
        "database": .[1], 
        "logs": .[2],
        "files": .[3]
    },
    "summary": {
        "api_records": (.[0] | length),
        "database_records": (.[1] | length),
        "log_entries": (.[2] | length),
        "file_count": (.[3] | length),
        "total_records": ((.[0] | length) + (.[1] | length) + (.[2] | length) + (.[3] | length))
    }
}' "$TEMP_DIR"/*.json > "$OUTPUT_FILE"

log_info "Data aggregation completed. Output saved to $OUTPUT_FILE"

# Generate summary report
jq -r '
"=== Data Aggregation Report ===",
"Timestamp: \(.timestamp)",
"Total Records: \(.summary.total_records)",
"API Records: \(.summary.api_records)",
"Database Records: \(.summary.database_records)", 
"Log Entries: \(.summary.log_entries)",
"Files Processed: \(.summary.file_count)",
"Output File: '"$OUTPUT_FILE"'"
' "$OUTPUT_FILE"
```

---

## Performance Comparisons & Tool Selection Guide

This section provides benchmarks and guidance for choosing between alternative tools based on performance, features, and use cases.

### **Search Tools Comparison**

#### **grep vs rg (ripgrep) vs ag (the_silver_searcher)**
**Use Case**: Searching for text patterns in large codebases

| Tool | Speed | Features | Best For |
|------|-------|----------|----------|
| **grep** | Baseline | Standard regex, widely available | Small files, standard regex, universal compatibility |
| **rg (ripgrep)** | 5-10x faster | Git-aware, Unicode, parallel search | Large codebases, modern development |
| **ag** | 3-5x faster | Ignore patterns, good defaults | Medium projects, legacy systems |

**Performance Examples**:
```bash
# Benchmark search across large codebase
time grep -r "function" /large/codebase     # ~2.5 seconds
time rg "function" /large/codebase          # ~0.3 seconds  
time ag "function" /large/codebase          # ~0.7 seconds

# Memory usage comparison (approximate)
grep: ~50MB memory usage
rg:   ~80MB memory usage (parallelization overhead)
ag:   ~60MB memory usage
```

**Recommendation Matrix**:
- **Small projects (<1000 files)**: Use `grep` - simplicity wins
- **Large projects (>1000 files)**: Use `rg` - speed matters
- **Legacy systems**: Use `ag` - good balance of speed and compatibility
- **Shell scripts**: Use `grep` - universal availability

### **File Listing Comparison**

#### **ls vs eza vs tree**
**Use Case**: Directory content visualization

| Tool | Speed | Features | Best For |
|------|-------|----------|----------|
| **ls** | Fast | Standard, universal | Quick listing, scripting |
| **eza** | Fast | Colors, Git status, icons | Interactive use, modern terminals |
| **tree** | Slower | Hierarchical view | Structure visualization |

**Performance Examples**:
```bash
# Large directory listing (10,000 files)
time ls -la /large/directory               # ~0.1 seconds
time eza -la /large/directory              # ~0.2 seconds
time tree /large/directory                 # ~1.5 seconds

# Memory usage
ls:   ~10MB
eza:  ~25MB (Git integration overhead)
tree: ~30MB (structure building)
```

### **Text Processing Speed**

#### **sed vs awk vs perl vs python**
**Use Case**: Text transformation and processing

| Tool | Speed | Complexity | Best For |
|------|-------|------------|----------|
| **sed** | Fastest | Simple substitutions | Single-line replacements |
| **awk** | Fast | Field processing | Column-based data |
| **perl** | Medium | Complex regex | Advanced text manipulation |
| **python** | Slower | Full programming | Complex logic, maintainability |

**Benchmark Example** (Processing 1M line file):
```bash
# Simple substitution
time sed 's/old/new/g' large_file.txt          # ~2 seconds
time awk '{gsub(/old/, "new"); print}' large_file.txt  # ~4 seconds
time perl -pe 's/old/new/g' large_file.txt     # ~6 seconds
time python -c "import sys; print(sys.stdin.read().replace('old', 'new'))" < large_file.txt  # ~15 seconds
```

### **Archive Tools Performance**

#### **Compression Speed vs Ratio**
**Use Case**: File archiving and compression

| Tool | Speed | Compression Ratio | Best For |
|------|-------|------------------|----------|
| **gzip** | Fast | Good | General purpose, compatibility |
| **bzip2** | Slow | Better | High compression needs |
| **xz** | Very Slow | Best | Maximum compression |
| **zstd** | Very Fast | Good | Real-time compression |

**Performance Matrix** (1GB test file):
```bash
# Compression speed and results
gzip:  ~15 seconds → 300MB (70% compression)
bzip2: ~45 seconds → 250MB (75% compression)  
xz:    ~90 seconds → 200MB (80% compression)
zstd:  ~8 seconds  → 280MB (72% compression)

# Decompression speed
gzip:  ~3 seconds
bzip2: ~12 seconds
xz:    ~8 seconds
zstd:  ~2 seconds
```

**Selection Guide**:
- **Fast archiving**: Use `zstd` or `gzip`
- **Best compression**: Use `xz` for long-term storage
- **Balanced**: Use `gzip` for general purpose
- **Legacy compatibility**: Use `gzip` (most widely supported)

### **Network Tools Comparison**

#### **curl vs wget vs httpie**
**Use Case**: HTTP requests and file downloads

| Tool | Features | Best For |
|------|----------|----------|
| **curl** | Most flexible, many protocols | API testing, complex requests |
| **wget** | Recursive downloads, mirrors | Bulk downloads, site mirroring |
| **httpie** | Human-friendly syntax | Quick API testing |

**Use Case Examples**:
```bash
# Simple API test
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' api.com/endpoint
http POST api.com/endpoint key=value    # httpie - more readable

# Bulk download
wget -r -np -k https://example.com/     # wget excels here
curl -O https://example.com/file[1-100].txt  # curl can do ranges

# File download with resume
wget -c https://example.com/large-file.iso    # wget resumes automatically
curl -C - -O https://example.com/large-file.iso  # curl needs explicit flag
```

### **Programming Language Performance**

#### **Script Execution Speed Comparison**
**Use Case**: Quick automation scripts

| Language | Startup Time | Execution Speed | Best For |
|----------|-------------|-----------------|----------|
| **bash** | Instant | Variable | System operations, pipelines |
| **python** | ~100ms | Medium | Data processing, readability |
| **ruby** | ~150ms | Medium | Text processing, quick scripts |
| **perl** | ~50ms | Fast | Regex-heavy operations |
| **swift** | ~200ms | Fast | Apple ecosystem integration |

**Micro-benchmark** (Simple text processing):
```bash
# Count lines in file
time wc -l large_file.txt                    # ~0.1s (C implementation)
time python -c "print(len(open('large_file.txt').readlines()))"  # ~0.8s
time ruby -e "puts File.readlines('large_file.txt').size"        # ~0.6s
time perl -e "print scalar(<>)" large_file.txt                   # ~0.3s
```

### **System Monitoring Tools**

#### **ps vs htop vs top**
**Use Case**: Process monitoring

| Tool | Features | Resource Usage | Best For |
|------|----------|----------------|----------|
| **ps** | Snapshot, scriptable | Minimal | Scripts, automation |
| **top** | Real-time, standard | Low | Basic monitoring |
| **htop** | Interactive, colorful | Medium | Interactive troubleshooting |

**Decision Matrix**:
- **Scripting**: Always use `ps` for programmatic access
- **Quick check**: Use `top` for basic system overview
- **Deep analysis**: Use `htop` for interactive exploration
- **Remote systems**: Use `top` (widely available)

### **Selection Guidelines by Use Case**

#### **Development Workflows**
```bash
# Code search: rg > ag > grep
rg "function.*component" --type tsx

# File operations: eza (interactive) / ls (scripts)
eza -la --git                    # During development
ls -la | awk '{print $9, $5}'   # In scripts

# Text processing: sed (simple) → awk (fields) → python (complex)
```

#### **System Administration**
```bash
# Monitoring: ps (scripts) / htop (interactive)
ps aux --sort=-%cpu | head -10   # Top CPU in scripts
htop                             # Interactive debugging

# Log analysis: grep (simple) / rg (complex) / awk (structured)
grep ERROR /var/log/syslog       # Simple search
rg -A5 -B5 "FATAL.*database"    # Context search
awk '/ERROR/ {print $1, $2, $5}' /var/log/syslog  # Structured extraction
```

#### **Data Processing**
```bash
# Small data: awk / sed
# Medium data: perl / ruby  
# Large data: python with pandas / specialized tools

# Choose based on data size and complexity:
awk -F',' '{sum+=$3} END {print sum/NR}' small_data.csv
python -c "import pandas as pd; print(pd.read_csv('large_data.csv').mean())"
```

---

## Tool Finder & Quick Reference Index

This section provides enhanced navigation and categorization to help you quickly find the right tool for your task.

### **Quick Reference by Task**

#### **🔍 Search & Find Operations**
- **Simple text search**: `grep` ⭐⭐ (universal)
- **Fast code search**: `rg` ⭐⭐⭐ (modern, recommended)
- **File finding**: `find` ⭐⭐⭐ (complex) / `fd` ⭐⭐ (simple)
- **Pattern matching**: `grep`, `rg`, `awk` ⭐⭐-⭐⭐⭐⭐
- **Content search**: `grep -r`, `rg`, `ag` ⭐⭐-⭐⭐⭐

#### **📁 File Operations**
- **Daily use**: `ls` ⭐⭐, `cp` ⭐⭐, `mv` ⭐⭐, `rm` ⭐⭐
- **Modern listing**: `eza` ⭐⭐ (colorful, Git-aware)
- **Directory trees**: `tree` ⭐⭐
- **File information**: `file` ⭐⭐, `stat` ⭐⭐⭐, `du` ⭐⭐
- **Permissions**: `chmod` ⭐⭐⭐, `chown` ⭐⭐⭐

#### **📝 Text Processing**
- **Quick edits**: `sed` ⭐⭐⭐ (simple) / `nano` ⭐ (interactive)
- **Column processing**: `awk` ⭐⭐⭐⭐ / `cut` ⭐⭐
- **Advanced editing**: `vim` ⭐⭐⭐⭐⭐ / `emacs` ⭐⭐⭐⭐⭐
- **Character conversion**: `tr` ⭐⭐⭐, `iconv` ⭐⭐⭐
- **Formatting**: `fmt` ⭐⭐, `fold` ⭐⭐, `column` ⭐⭐

#### **🔄 Version Control**
- **Essential Git**: `git add`, `git commit`, `git push` ⭐⭐
- **Branching**: `git branch`, `git checkout`, `git merge` ⭐⭐⭐
- **Advanced Git**: `git rebase`, `git cherry-pick` ⭐⭐⭐⭐
- **History**: `git log`, `git diff`, `git blame` ⭐⭐⭐, `tig` ⭐⭐⭐

#### **🛠️ Development**
- **Compilation**: `gcc` ⭐⭐⭐, `clang` ⭐⭐⭐, `javac` ⭐⭐⭐
- **Build systems**: `make` ⭐⭐⭐, `cmake` ⭐⭐⭐⭐
- **Scripting**: `python` ⭐⭐, `ruby` ⭐⭐⭐, `perl` ⭐⭐⭐⭐
- **Code analysis**: `tokei` ⭐⭐, `cloc` ⭐⭐⭐
- **Package managers**: `npm` ⭐⭐, `pip3` ⭐⭐, `brew` ⭐⭐

#### **🌐 Network & Communication**
- **HTTP requests**: `curl` ⭐⭐⭐⭐ (flexible) / `wget` ⭐⭐ (downloads)
- **Remote access**: `ssh` ⭐⭐⭐, `scp` ⭐⭐⭐
- **File sync**: `rsync` ⭐⭐⭐⭐
- **Network diagnostics**: `ping` ⭐, `dig` ⭐⭐⭐, `netstat` ⭐⭐⭐, `nmap` ⭐⭐⭐⭐, `iftop` ⭐⭐⭐

#### **🔐 Security & Encryption**
- **Encryption**: `gpg` ⭐⭐⭐⭐, `openssl` ⭐⭐⭐⭐⭐
- **Hashing**: `md5` ⭐⭐, `shasum` ⭐⭐
- **SSH keys**: `ssh-keygen` ⭐⭐⭐
- **Certificates**: `keytool` ⭐⭐⭐ (Java), `openssl` ⭐⭐⭐⭐⭐

#### **⚙️ System Administration**
- **Process management**: `ps` ⭐⭐, `top` ⭐⭐, `htop` ⭐⭐
- **System info**: `uname` ⭐, `uptime` ⭐, `who` ⭐⭐
- **Disk usage**: `df` ⭐⭐, `du` ⭐⭐, `ncdu` ⭐⭐⭐
- **User management**: `sudo` ⭐⭐⭐⭐, `id` ⭐, `groups` ⭐

#### **🗜️ Archive & Compression**
- **General purpose**: `tar` ⭐⭐⭐, `gzip` ⭐⭐
- **ZIP files**: `zip` ⭐⭐, `unzip` ⭐⭐
- **Modern compression**: `zstd` ⭐⭐⭐ (fast), `xz` ⭐⭐⭐ (small)

#### **🐳 Containers & Cloud**
- **Containers**: `docker` ⭐⭐⭐, `docker-compose` ⭐⭐⭐⭐
- **Infrastructure**: `terraform` ⭐⭐⭐⭐⭐, `ansible` ⭐⭐⭐⭐
- **Cloud CLI**: `aws` ⭐⭐⭐⭐, `gcloud` ⭐⭐⭐⭐
- **Orchestration**: `kubectl` ⭐⭐⭐⭐⭐

#### **📊 Data Processing & Analysis**
- **CSV Tools**: `csvkit` ⭐⭐⭐ (comprehensive), `miller` ⭐⭐⭐⭐ (powerful)
- **SQL on Files**: `csvq` ⭐⭐⭐, `dsq` ⭐⭐⭐⭐ (multi-format)
- **Statistics**: `datamash` ⭐⭐⭐, `awk` ⭐⭐⭐⭐
- **JSON Processing**: `jq` ⭐⭐⭐⭐ (essential)

#### **🗄️ Database Tools**
- **Relational**: `mysql` ⭐⭐⭐⭐, `psql` ⭐⭐⭐⭐, `sqlite3` ⭐⭐⭐
- **NoSQL**: `redis-cli` ⭐⭐⭐
- **File-based**: `csvq` ⭐⭐⭐, `dsq` ⭐⭐⭐⭐

#### **🎬 Media Processing**
- **Video/Audio**: `ffmpeg` ⭐⭐⭐⭐⭐ (comprehensive)
- **Audio Only**: `sox` ⭐⭐⭐ (effects and conversion)
- **Images**: `imagemagick` ⭐⭐⭐⭐, `convert` ⭐⭐⭐
- **Metadata**: `exiftool` ⭐⭐⭐⭐
- **Documents**: `pandoc` ⭐⭐⭐

#### **⚡ Performance & Memory Analysis**
- **Benchmarking**: `hyperfine` ⭐⭐⭐, `time` ⭐⭐
- **System Monitoring**: `btop` ⭐⭐⭐, `htop` ⭐⭐⭐, `top` ⭐⭐
- **Memory Analysis (macOS)**: `leaks` ⭐⭐⭐⭐, `heap` ⭐⭐⭐⭐, `vm_stat` ⭐⭐
- **Profiling**: `gprof2dot` ⭐⭐⭐⭐, `malloc_history` ⭐⭐⭐⭐⭐

#### **🔧 Modern Alternatives & Replacements**
- **Process Viewers**: `procs` ⭐⭐ (ps replacement), `htop`/`btop` ⭐⭐⭐ (top replacement)
- **Disk Usage**: `dust` ⭐⭐ (du replacement), `ncdu` ⭐⭐⭐ (interactive du)
- **Text Processing**: `sd` ⭐⭐ (sed replacement), `rg` ⭐⭐⭐ (grep replacement)
- **File Operations**: `fd` ⭐⭐ (find replacement), `bat` ⭐⭐ (cat replacement)
- **Git Enhancement**: `delta` ⭐⭐⭐ (diff enhancement), `lazygit` ⭐⭐⭐ (git TUI)

#### **🏗️ Build Systems & Tools**
- **Traditional**: `make` ⭐⭐⭐, `cmake` ⭐⭐⭐⭐
- **Modern Fast**: `ninja` ⭐⭐⭐, `meson` ⭐⭐⭐⭐
- **Large Scale**: `bazel` ⭐⭐⭐⭐⭐ (Google), `buck` ⭐⭐⭐⭐ (Facebook)

#### **🔒 Security & Network Analysis**
- **Port Scanning**: `nmap` ⭐⭐⭐⭐ (comprehensive), `masscan` ⭐⭐⭐⭐⭐ (high-speed)
- **Network Monitoring**: `iftop` ⭐⭐⭐, `netstat` ⭐⭐⭐, `ss` ⭐⭐⭐
- **Traffic Analysis**: `tcpdump` ⭐⭐⭐⭐, `wireshark` ⭐⭐⭐⭐

### **Frequency-Based Categories**

#### **📅 Daily Use Tools** (Use multiple times per day)
Essential tools for everyday development and system work:
- `ls` ⭐⭐ - Directory listing
- `cd` - Directory navigation (built-in)
- `git` ⭐⭐⭐⭐ - Version control
- `grep` ⭐⭐⭐⭐ - Text search
- `cat` ⭐ - File viewing
- `ssh` ⭐⭐⭐ - Remote access
- `curl` ⭐⭐⭐⭐ - HTTP requests
- `nano` ⭐ / `vim` ⭐⭐⭐⭐⭐ - Text editing

#### **🗓️ Weekly Use Tools** (Use several times per week)
Important tools for regular development tasks:
- `find` ⭐⭐⭐ - File searching
- `tar` ⭐⭐⭐ - Archiving
- `docker` ⭐⭐⭐⭐ - Containerization
- `make` ⭐⭐⭐ - Build automation
- `awk` ⭐⭐⭐⭐ - Text processing
- `sed` ⭐⭐⭐ - Stream editing
- `rsync` ⭐⭐⭐⭐ - File synchronization

#### **📆 Monthly Use Tools** (Use occasionally)
Specialized tools for specific tasks:
- `jq` ⭐⭐⭐ - JSON processing
- `openssl` ⭐⭐⭐⭐⭐ - Cryptography
- `kubectl` ⭐⭐⭐⭐⭐ - Kubernetes
- `lsof` ⭐⭐⭐ - Open files
- `dtruss` ⭐⭐⭐⭐ - System tracing
- `system_profiler` ⭐⭐ - Hardware info

#### **🔧 Situational Tools** (Use when needed)
Tools for specific situations or troubleshooting:
- `strace` ⭐⭐⭐⭐ - System call tracing (Linux)
- `hexdump` ⭐⭐⭐ - Binary analysis
- `tcpdump` ⭐⭐⭐⭐ - Network capture
- `plutil` ⭐⭐⭐ - macOS plist editing
- `iconv` ⭐⭐⭐ - Character encoding
- `units` ⭐⭐ - Unit conversion

### **Learning Path Recommendations**

#### **🌱 Beginner Path** (Start here)
1. **File basics**: `ls`, `cd`, `cat`, `cp`, `mv` ⭐⭐
2. **Text viewing**: `head`, `tail`, `less` ⭐⭐
3. **Simple search**: `grep` ⭐⭐
4. **Basic editing**: `nano` ⭐
5. **Help system**: `man`, `--help` ⭐

#### **🌿 Intermediate Path** (Build skills)
1. **Advanced search**: `find`, `rg` ⭐⭐⭐
2. **Text processing**: `awk`, `sed` ⭐⭐⭐⭐
3. **Version control**: `git` basics ⭐⭐⭐
4. **Network tools**: `curl`, `ssh` ⭐⭐⭐
5. **System monitoring**: `ps`, `top` ⭐⭐

#### **🌳 Advanced Path** (Expert level)
1. **Complex text**: `perl`, `vim` ⭐⭐⭐⭐⭐
2. **System internals**: `lsof`, `dtruss` ⭐⭐⭐⭐
3. **Advanced Git**: `rebase`, `cherry-pick` ⭐⭐⭐⭐
4. **Containers**: `docker`, `kubectl` ⭐⭐⭐⭐⭐
5. **Security**: `openssl`, `gpg` ⭐⭐⭐⭐⭐

#### **🏆 Expert Path** (Mastery)
1. **Custom automation**: Complex shell scripting
2. **Performance tuning**: `perf`, profiling tools
3. **Security auditing**: `nmap`, `wireshark`
4. **Infrastructure**: `terraform`, `ansible`
5. **Kernel debugging**: Advanced system tools

### **Cross-Reference Matrix**

#### **Similar Tools Comparison**
| Task | Standard | Modern Alternative | Specialist |
|------|----------|-------------------|------------|
| **List files** | `ls` ⭐⭐ | `eza` ⭐⭐ | `tree` ⭐⭐ |
| **Find files** | `find` ⭐⭐⭐ | `fd` ⭐⭐ | `locate` ⭐ |
| **Search text** | `grep` ⭐⭐⭐⭐ | `rg` ⭐⭐⭐ | `ag` ⭐⭐⭐ |
| **View text** | `cat` ⭐ | `bat` ⭐⭐ | `less` ⭐⭐ |
| **Edit text** | `nano` ⭐ | `vim` ⭐⭐⭐⭐⭐ | `emacs` ⭐⭐⭐⭐⭐ |
| **Process monitoring** | `top` ⭐⭐ | `htop` ⭐⭐ | `btop` ⭐⭐ |
| **HTTP requests** | `curl` ⭐⭐⭐⭐ | `httpie` ⭐⭐ | `wget` ⭐⭐ |
| **Compression** | `gzip` ⭐⭐ | `zstd` ⭐⭐⭐ | `xz` ⭐⭐⭐ |

#### **Tool Compatibility Notes**
- **macOS specific**: `pbcopy`, `pbpaste`, `say`, `diskutil`, `system_profiler`
- **Linux alternatives**: Use `xclip` instead of `pbcopy`, `systemctl` instead of `launchctl`
- **Cross-platform**: `git`, `docker`, `python`, `node`, `curl`, `ssh`
- **Modern replacements available**: Consider `eza` → `ls`, `rg` → `grep`, `fd` → `find`

---

## Tool Finder & Quick Reference Index

This section provides enhanced navigation and search capabilities to quickly find the right tool for your task.

### **🔍 Find Tools by Task**

#### **📁 File Operations**
| Task | Primary Tool | Alternative | Specialist |
|------|-------------|-------------|------------|
| **List files** | `ls` ⭐⭐ | `eza` ⭐⭐ | `tree` ⭐⭐ |
| **Find files** | `find` ⭐⭐⭐ | `fd` ⭐⭐ | `locate` ⭐ |
| **Search text** | `grep` ⭐⭐⭐⭐ | `rg` ⭐⭐⭐ | `ag` ⭐⭐⭐ |
| **Copy files** | `cp` ⭐⭐ | `rsync` ⭐⭐⭐⭐ | `rclone` ⭐⭐⭐ |
| **Move files** | `mv` ⭐⭐ | `rename` ⭐⭐⭐ | `mmv` ⭐⭐⭐ |
| **Delete files** | `rm` ⭐⭐ | `trash` ⭐⭐ | `shred` ⭐⭐⭐ |
| **File info** | `file` ⭐⭐ | `stat` ⭐⭐⭐ | `mediainfo` ⭐⭐⭐ |
| **Permissions** | `chmod` ⭐⭐⭐ | `chown` ⭐⭐⭐ | `setfacl` ⭐⭐⭐⭐ |

#### **📝 Text Processing**
| Task | Primary Tool | Alternative | Specialist |
|------|-------------|-------------|------------|
| **View text** | `cat` ⭐ | `bat` ⭐⭐ | `less` ⭐⭐ |
| **Edit text** | `nano` ⭐ | `vim` ⭐⭐⭐⭐⭐ | `emacs` ⭐⭐⭐⭐⭐ |
| **Search/replace** | `sed` ⭐⭐⭐ | `perl` ⭐⭐⭐⭐ | `awk` ⭐⭐⭐⭐ |
| **Sort/unique** | `sort` ⭐⭐ | `uniq` ⭐⭐ | `tsort` ⭐⭐⭐ |
| **Count lines** | `wc` ⭐⭐ | `nl` ⭐⭐ | `cloc` ⭐⭐⭐ |
| **Format text** | `fmt` ⭐⭐ | `fold` ⭐⭐ | `column` ⭐⭐⭐ |
| **JSON processing** | `jq` ⭐⭐⭐ | `yq` ⭐⭐⭐ | `fx` ⭐⭐ |

#### **🌐 Network Operations**
| Task | Primary Tool | Alternative | Specialist |
|------|-------------|-------------|------------|
| **Download files** | `curl` ⭐⭐⭐⭐ | `wget` ⭐⭐ | `aria2` ⭐⭐⭐ |
| **Test connectivity** | `ping` ⭐⭐ | `nc` ⭐⭐⭐ | `nmap` ⭐⭐⭐⭐ |
| **DNS lookup** | `dig` ⭐⭐⭐ | `nslookup` ⭐⭐ | `host` ⭐⭐ |
| **Copy remote** | `scp` ⭐⭐⭐ | `rsync` ⭐⭐⭐⭐ | `rclone` ⭐⭐⭐ |
| **SSH connection** | `ssh` ⭐⭐⭐ | `mosh` ⭐⭐⭐ | `telnet` ⭐⭐ |
| **Port scanning** | `nc` ⭐⭐⭐ | `nmap` ⭐⭐⭐⭐ | `masscan` ⭐⭐⭐⭐ |
| **Network info** | `netstat` ⭐⭐⭐ | `ss` ⭐⭐⭐ | `lsof` ⭐⭐⭐ |

#### **🛠️ Development Tasks**
| Task | Primary Tool | Alternative | Specialist |
|------|-------------|-------------|------------|
| **Version control** | `git` ⭐⭐⭐⭐ | `svn` ⭐⭐⭐ | `hg` ⭐⭐⭐ |
| **Build projects** | `make` ⭐⭐⭐ | `cmake` ⭐⭐⭐⭐ | `ninja` ⭐⭐⭐ |
| **Compile C/C++** | `gcc` ⭐⭐⭐ | `clang` ⭐⭐⭐ | `icc` ⭐⭐⭐⭐ |
| **Debug programs** | `gdb` ⭐⭐⭐⭐ | `lldb` ⭐⭐⭐⭐ | `valgrind` ⭐⭐⭐⭐ |
| **Analyze binaries** | `nm` ⭐⭐⭐ | `objdump` ⭐⭐⭐⭐ | `strings` ⭐⭐ |
| **Package management** | `npm` ⭐⭐⭐ | `yarn` ⭐⭐⭐ | `pnpm` ⭐⭐⭐ |
| **Container work** | `docker` ⭐⭐⭐⭐ | `podman` ⭐⭐⭐⭐ | `kubectl` ⭐⭐⭐⭐⭐ |
| **Multi-container** | `docker-compose` ⭐⭐⭐ | `kubectl` ⭐⭐⭐⭐⭐ | `docker swarm` ⭐⭐⭐⭐ |
| **Infrastructure** | `terraform` ⭐⭐⭐⭐ | `ansible` ⭐⭐⭐⭐ | `cloudformation` ⭐⭐⭐⭐ |
| **Benchmarking** | `hyperfine` ⭐⭐⭐ | `time` ⭐⭐ | `perf` ⭐⭐⭐⭐ |
| **Git enhanced** | `lazygit` ⭐⭐⭐ | `tig` ⭐⭐⭐ | `git` ⭐⭐⭐⭐ |
| **Diff enhanced** | `delta` ⭐⭐ | `diff` ⭐⭐ | `vimdiff` ⭐⭐⭐ |

#### **🎨 Media Processing**
| Task | Primary Tool | Alternative | Specialist |
|------|-------------|-------------|------------|
| **Video processing** | `ffmpeg` ⭐⭐⭐⭐⭐ | `mencoder` ⭐⭐⭐⭐ | `handbrake` ⭐⭐⭐ |
| **Image processing** | `imagemagick` ⭐⭐⭐⭐ | `gimp` ⭐⭐⭐⭐⭐ | `photoshop` ⭐⭐⭐⭐⭐ |
| **Document conversion** | `pandoc` ⭐⭐⭐ | `markdown` ⭐⭐ | `latex` ⭐⭐⭐⭐ |
| **Audio processing** | `ffmpeg` ⭐⭐⭐⭐ | `sox` ⭐⭐⭐ | `audacity` ⭐⭐⭐ |

#### **⚙️ System Administration**
| Task | Primary Tool | Alternative | Specialist |
|------|-------------|-------------|------------|
| **Process monitor** | `top` ⭐⭐ | `htop` ⭐⭐ | `btop` ⭐⭐ |
| **Kill processes** | `kill` ⭐⭐ | `killall` ⭐⭐ | `pkill` ⭐⭐⭐ |
| **System info** | `uname` ⭐⭐ | `hostnamectl` ⭐⭐ | `system_profiler` ⭐⭐ |
| **Disk usage** | `df` ⭐⭐ | `du` ⭐⭐ | `ncdu` ⭐⭐⭐ |
| **User management** | `sudo` ⭐⭐⭐ | `su` ⭐⭐ | `doas` ⭐⭐⭐ |
| **Service control** | `launchctl` ⭐⭐⭐ | `systemctl` ⭐⭐⭐ | `service` ⭐⭐ |
| **Log analysis** | `tail` ⭐⭐ | `journalctl` ⭐⭐⭐ | `lnav` ⭐⭐⭐ |

### **🎯 Quick Command Reference by Function**

#### **🚀 Most Frequently Used** (Daily)
```bash
# Essential navigation and files
ls, cd, pwd, cat, cp, mv, rm, mkdir, touch, find

# Text processing basics  
grep, head, tail, less, wc, sort, uniq

# Development core
git, make, vim, diff, chmod

# System essentials
ps, top, kill, sudo, ssh, curl
```

#### **⚡ Power User Tools** (Weekly)
```bash
# Advanced text processing
sed, awk, cut, tr, join, paste

# Advanced file operations
rsync, tar, zip, find, xargs

# Development advanced
gcc, gdb, nm, objdump, strip

# System monitoring
lsof, netstat, iostat, dtruss

# Network tools
ping, dig, nc, traceroute
```

#### **🔧 Specialist Tools** (Monthly)
```bash
# Security & encryption
gpg, openssl, ssh-keygen, shasum

# Package management
brew, npm, pip3, gem, cargo

# Container & cloud
docker, kubectl, helm

# Database & data
sqlite3, jq, csvkit

# Performance & debugging
strace, tcpdump, wireshark
```

### **📚 Tool Categories by Complexity**

#### **🌱 Beginner-Friendly Tools** (⭐⭐)
- **File Basics**: `ls`, `cat`, `cp`, `mv`, `rm`, `mkdir`, `touch`
- **Text Viewing**: `head`, `tail`, `less`, `more`  
- **Basic Search**: `grep`, `find`
- **Simple Editing**: `nano`
- **System Info**: `ps`, `top`, `who`, `uptime`

#### **🌿 Intermediate Tools** (⭐⭐⭐)
- **Advanced Search**: `find`, `rg`, `ag`
- **Text Processing**: `sed`, `awk`, `cut`, `sort`
- **Version Control**: `git` (basic operations)
- **Network**: `curl`, `ssh`, `ping`, `dig`
- **Archives**: `tar`, `zip`, `gzip`

#### **🌳 Advanced Tools** (⭐⭐⭐⭐)
- **Complex Text**: `perl`, `vim`, `emacs`
- **System Internals**: `lsof`, `strace`, `dtruss`
- **Build Systems**: `make`, `cmake`, `gcc`
- **Network Advanced**: `nc`, `nmap`, `tcpdump`
- **Containers**: `docker`, `docker-compose`

#### **🏆 Expert Tools** (⭐⭐⭐⭐⭐)
- **Low-level**: `gdb`, `objdump`, `nm`, `hexdump`
- **Security**: `openssl`, `gpg`, `nmap`
- **Orchestration**: `kubectl`, `helm`, `terraform`
- **Performance**: `perf`, `valgrind`, `dtrace`
- **Advanced Editors**: `vim` (expert level), `emacs` (expert level)

### **🔗 Tool Relationship Map**

#### **File Processing Pipeline**
```
find → xargs → command
fd → xargs → command  
grep → awk → sort → uniq
rg → cut → sort → head
```

#### **Development Workflow**
```
git → make → gcc → gdb
git → npm → node → pm2
git → docker → kubectl → helm
```

#### **System Analysis Chain**
```
ps → grep → awk → sort
lsof → grep → cut → sort
netstat → awk → sort → uniq
```

#### **Data Processing Pipeline**
```
curl → jq → awk → sort → head
cat → grep → sed → awk → tee
tail → grep → cut → sort → uniq
```

### **🎛️ Context-Aware Tool Selection**

#### **For Code Development**
- **Small projects**: `git`, `make`, `vim`, `grep`, `find`
- **Large projects**: `git`, `cmake`, `vim`/`emacs`, `rg`, `fd`, `ag`
- **Web development**: `git`, `npm`, `curl`, `jq`, `docker`
- **System programming**: `git`, `gcc`, `gdb`, `make`, `nm`, `objdump`

#### **For System Administration**
- **Daily monitoring**: `top`, `ps`, `df`, `tail`, `grep`
- **Troubleshooting**: `lsof`, `netstat`, `dtruss`, `tcpdump`, `strace`
- **Maintenance**: `cron`, `rsync`, `tar`, `sudo`, `chmod`
- **Security**: `sudo`, `ssh`, `gpg`, `openssl`, `fail2ban`

#### **For Data Analysis**
- **Text data**: `grep`, `sed`, `awk`, `sort`, `uniq`, `cut`
- **JSON data**: `curl`, `jq`, `grep`, `sort`, `head`
- **Log analysis**: `tail`, `grep`, `awk`, `sort`, `uniq`, `cut`
- **CSV data**: `csvkit`, `awk`, `cut`, `sort`, `join`

#### **For Network Operations**
- **Connectivity**: `ping`, `traceroute`, `nc`, `telnet`
- **DNS**: `dig`, `nslookup`, `host`, `whois`
- **Transfer**: `curl`, `wget`, `scp`, `rsync`, `rclone`
- **Security**: `ssh`, `ssh-keygen`, `openssl`, `nmap`

### **📋 Quick Reference Cheat Sheets**

#### **Essential One-Liners**
```bash
# Find largest files
find . -type f -exec ls -la {} \; | sort -k5 -rn | head -10

# Process monitoring
ps aux --sort=-%cpu | head -10

# Network connections
lsof -i -P -n | grep LISTEN

# Disk usage by directory  
du -h --max-depth=1 | sort -hr

# Find and replace in multiple files
find . -name "*.txt" -exec sed -i 's/old/new/g' {} \;

# Git commit count by author
git shortlog -sn

# Remove Docker containers and images
docker system prune -af

# Monitor file changes
fswatch -o /path | xargs -n1 -I{} echo "Changed at $(date)"
```

#### **Performance Troubleshooting**
```bash
# CPU usage by process
ps aux --sort=-%cpu | head -20

# Memory usage by process  
ps aux --sort=-%mem | head -20

# I/O intensive processes
iostat -x 1

# Network connections and bandwidth
netstat -i && iftop

# Disk I/O by process
iotop -o (Linux) || fs_usage -w -f filesys (macOS)

# System calls by process
strace -p PID (Linux) || dtruss -p PID (macOS)
```

---

## Ready-to-Use Resources

This section provides production-ready script templates, automation recipes, and one-liner collections for common tasks.

### **Shell Script Templates**

#### **📋 Basic Script Template**
```bash
#!/bin/bash
# Script: script_name.sh
# Purpose: Brief description of what this script does
# Author: Your Name
# Date: $(date +%Y-%m-%d)
# Usage: ./script_name.sh [options] [arguments]

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/script.log"
DEBUG=${DEBUG:-false}

# Functions
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

debug() {
    if [[ "$DEBUG" == "true" ]]; then
        echo "DEBUG: $1" >&2
    fi
}

error() {
    echo "ERROR: $1" >&2
    exit 1
}

usage() {
    cat << EOF
Usage: $0 [OPTIONS] [ARGUMENTS]

Description:
    Brief description of script functionality

Options:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose output
    -d, --debug     Enable debug mode
    
Arguments:
    arg1            Description of first argument
    arg2            Description of second argument

Examples:
    $0 --verbose arg1 arg2
    $0 -d example_input

EOF
    exit 0
}

# Main function
main() {
    log "Starting script execution"
    
    # Your main logic here
    echo "Script is running..."
    
    log "Script completed successfully"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -v|--verbose)
            set -x
            shift
            ;;
        -d|--debug)
            DEBUG=true
            shift
            ;;
        *)
            # Handle positional arguments
            ARGS+=("$1")
            shift
            ;;
    esac
done

# Trap for cleanup
cleanup() {
    log "Cleaning up..."
    # Add cleanup code here
}
trap cleanup EXIT

# Execute main function
main "$@"
```

#### **🔄 Backup Script Template**
```bash
#!/bin/bash
# Automated backup script with rotation and compression

set -euo pipefail

# Configuration
SOURCE_DIR="/path/to/source"
BACKUP_DIR="/path/to/backups"
RETENTION_DAYS=30
COMPRESS=true
EXCLUDE_PATTERNS=("*.tmp" "*.log" ".git" "node_modules")

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Build exclude options
EXCLUDE_OPTS=()
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    EXCLUDE_OPTS+=(--exclude="$pattern")
done

# Perform backup
if [[ "$COMPRESS" == "true" ]]; then
    tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
        "${EXCLUDE_OPTS[@]}" \
        -C "$(dirname "$SOURCE_DIR")" \
        "$(basename "$SOURCE_DIR")"
    echo "Compressed backup created: ${BACKUP_NAME}.tar.gz"
else
    rsync -av "${EXCLUDE_OPTS[@]}" \
        "$SOURCE_DIR/" \
        "${BACKUP_DIR}/${BACKUP_NAME}/"
    echo "Backup created: $BACKUP_NAME"
fi

# Cleanup old backups
find "$BACKUP_DIR" -name "backup_*" -mtime +$RETENTION_DAYS -delete
echo "Cleaned up backups older than $RETENTION_DAYS days"
```

#### **📊 System Health Check Template**
```bash
#!/bin/bash
# Comprehensive system health check script

set -euo pipefail

REPORT_FILE="health_check_$(date +%Y%m%d_%H%M%S).txt"

{
    echo "=== SYSTEM HEALTH CHECK REPORT ==="
    echo "Generated: $(date)"
    echo "Hostname: $(hostname)"
    echo "User: $(whoami)"
    echo

    echo "=== SYSTEM INFO ==="
    uname -a
    sw_vers 2>/dev/null || cat /etc/os-release 2>/dev/null || echo "OS info unavailable"
    echo

    echo "=== UPTIME ==="
    uptime
    echo

    echo "=== DISK USAGE ==="
    df -h
    echo

    echo "=== MEMORY USAGE ==="
    if command -v free >/dev/null 2>&1; then
        free -h
    else
        vm_stat | head -10
    fi
    echo

    echo "=== TOP PROCESSES (CPU) ==="
    ps aux --sort=-%cpu | head -11
    echo

    echo "=== TOP PROCESSES (MEMORY) ==="
    ps aux --sort=-%mem | head -11
    echo

    echo "=== NETWORK CONNECTIONS ==="
    netstat -tuln 2>/dev/null | head -10 || echo "netstat unavailable"
    echo

    echo "=== RECENT ERRORS (Last 50 lines) ==="
    if [[ -f /var/log/syslog ]]; then
        tail -50 /var/log/syslog | grep -i error || echo "No recent errors found"
    elif [[ -f /var/log/system.log ]]; then
        tail -50 /var/log/system.log | grep -i error || echo "No recent errors found"
    else
        echo "System log not accessible"
    fi

} | tee "$REPORT_FILE"

echo "Health check report saved to: $REPORT_FILE"
```

### **Automation Recipes**

#### **🔄 Git Workflow Automation**
```bash
# Quick commit and push
git_quick_commit() {
    local message="${1:-Quick commit $(date)}"
    git add .
    git commit -m "$message"
    git push
}

# Feature branch workflow
git_feature() {
    local branch_name="$1"
    git checkout -b "feature/$branch_name"
    git push -u origin "feature/$branch_name"
}

# Cleanup merged branches
git_cleanup() {
    git checkout main
    git pull origin main
    git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d
}

# Sync fork with upstream
git_sync_fork() {
    git fetch upstream
    git checkout main
    git merge upstream/main
    git push origin main
}
```

#### **📁 File Management Automation**
```bash
# Organize downloads by file type
organize_downloads() {
    local downloads_dir="$HOME/Downloads"
    cd "$downloads_dir"
    
    mkdir -p Images Documents Videos Audio Archives
    
    find . -maxdepth 1 -name "*.jpg" -o -name "*.png" -o -name "*.gif" | xargs -I {} mv {} Images/
    find . -maxdepth 1 -name "*.pdf" -o -name "*.doc" -o -name "*.txt" | xargs -I {} mv {} Documents/
    find . -maxdepth 1 -name "*.mp4" -o -name "*.avi" -o -name "*.mov" | xargs -I {} mv {} Videos/
    find . -maxdepth 1 -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" | xargs -I {} mv {} Audio/
    find . -maxdepth 1 -name "*.zip" -o -name "*.tar.gz" -o -name "*.rar" | xargs -I {} mv {} Archives/
}

# Batch rename files
batch_rename() {
    local pattern="$1"
    local replacement="$2"
    find . -name "*$pattern*" -type f | while read -r file; do
        mv "$file" "${file/$pattern/$replacement}"
    done
}

# Find and remove empty directories
remove_empty_dirs() {
    find "${1:-.}" -type d -empty -delete
}
```

#### **🌐 Network & API Automation**
```bash
# Test API endpoint with retries
test_api() {
    local url="$1"
    local max_attempts=5
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        echo "Attempt $attempt/$max_attempts..."
        if curl -f -s "$url" >/dev/null; then
            echo "✓ API is responding"
            return 0
        fi
        sleep 2
        ((attempt++))
    done
    
    echo "✗ API failed after $max_attempts attempts"
    return 1
}

# Download with progress and resume
smart_download() {
    local url="$1"
    local output="${2:-$(basename "$url")}"
    
    curl -L -C - -o "$output" \
         --progress-bar \
         --retry 3 \
         --retry-delay 2 \
         "$url"
}

# Check website status
check_websites() {
    local sites=("$@")
    for site in "${sites[@]}"; do
        status=$(curl -o /dev/null -s -w "%{http_code}" "$site")
        if [[ "$status" == "200" ]]; then
            echo "✓ $site (HTTP $status)"
        else
            echo "✗ $site (HTTP $status)"
        fi
    done
}
```

### **One-Liner Collections**

#### **🔍 Text Processing One-Liners**
```bash
# Find and replace in multiple files
find . -name "*.txt" -exec sed -i '' 's/old/new/g' {} \;

# Count lines of code (excluding comments and blank lines)
find . -name "*.py" -exec grep -v "^#\|^$" {} \; | wc -l

# Extract emails from text files
grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b" *.txt

# Find largest files in directory
find . -type f -exec ls -la {} \; | sort -k5 -rn | head -10

# Remove duplicate lines while preserving order
awk '!seen[$0]++' file.txt

# Convert tabs to spaces in all files
find . -name "*.txt" -exec expand -t 4 {} \; -exec mv {} {}.tmp \; -exec mv {}.tmp {} \;
```

#### **📊 System Monitoring One-Liners**
```bash
# Top memory consuming processes
ps aux --sort=-%mem | awk 'NR<=11{print $0}'

# Find files modified in last 24 hours
find /path -type f -mtime -1

# Monitor file changes in real-time
fswatch -o /path/to/directory | xargs -n1 -I{} echo "Directory changed at $(date)"

# Check disk usage by directory
du -h --max-depth=1 | sort -hr

# Find processes listening on ports
lsof -i -P -n | grep LISTEN

# Monitor CPU usage every 5 seconds
while true; do ps -A -o %cpu | awk '{s+=$1} END {print s}'; sleep 5; done
```

#### **🐳 Docker One-Liners**
```bash
# Remove all stopped containers
docker container prune -f

# Remove all unused images
docker image prune -a -f

# Stop all running containers
docker stop $(docker ps -q)

# Get container IP addresses
docker ps -q | xargs -n 1 docker inspect --format '{{.Name}} {{.NetworkSettings.IPAddress}}'

# Monitor container resource usage
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Backup container data
docker run --rm -v container_data:/data -v $(pwd):/backup ubuntu tar czf /backup/backup.tar.gz /data
```

#### **🔄 Git One-Liners**
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Show files changed in last commit
git diff-tree --no-commit-id --name-only -r HEAD

# Find commits that changed a specific file
git log --follow -p -- filename

# Show branch graph
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# Remove file from git history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch filename' --prune-empty --tag-name-filter cat -- --all

# Count commits by author
git shortlog -sn
```

### **Configuration Templates**

#### **⚙️ .bashrc/.zshrc Enhancements**
```bash
# Useful aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'
alias gd='git diff'

# Modern tool aliases (if available)
command -v eza >/dev/null && alias ls='eza --color=auto'
command -v rg >/dev/null && alias grep='rg'
command -v fd >/dev/null && alias find='fd'
command -v bat >/dev/null && alias cat='bat'

# Useful functions
mkcd() { mkdir -p "$1" && cd "$1"; }
extract() { 
    case $1 in
        *.tar.bz2) tar xjf "$1" ;;
        *.tar.gz) tar xzf "$1" ;;
        *.bz2) bunzip2 "$1" ;;
        *.rar) unrar x "$1" ;;
        *.gz) gunzip "$1" ;;
        *.tar) tar xf "$1" ;;
        *.tbz2) tar xjf "$1" ;;
        *.tgz) tar xzf "$1" ;;
        *.zip) unzip "$1" ;;
        *.Z) uncompress "$1" ;;
        *.7z) 7z x "$1" ;;
        *) echo "'$1' cannot be extracted via extract()" ;;
    esac
}
```

---

## Best Practices for Claude

### **Command Combinations**
Many tasks are best accomplished by combining tools:

```bash
# Find and process files
find . -name "*.log" | xargs grep "ERROR" | sort | uniq -c

# Data analysis pipeline
cat data.csv | cut -d',' -f1,3 | grep -v "^#" | sort -k2n | head -10

# System monitoring
ps aux | sort -k3nr | head -10  # Top CPU users

# Log analysis
tail -f /var/log/system.log | grep "ERROR" | awk '{print $1, $2, $5}'
```

### **Performance Considerations**
- Use `ripgrep (rg)` instead of `grep` for large codebases
- Use `fd` instead of `find` for faster file searching
- Use `eza` instead of `ls` for enhanced directory listing
- Prefer `rsync` over `cp` for large file transfers

### **Safety Guidelines**
- Always use `-i` (interactive) flags for destructive operations
- Test commands with `--dry-run` when available
- Use `which` to verify command locations before execution
- Backup important files before batch operations

---

## Quick Reference Summary

**File Operations**: `ls`, `eza`, `find`, `fd`, `grep`, `rg`, `tree`, `cp`, `mv`, `rm`, `cat`, `mkdir`, `rmdir`, `ln`, `touch`, `file`, `stat`, `basename`, `dirname`, `chmod`  

**Text Processing**: `sed`, `awk`, `cut`, `sort`, `uniq`, `head`, `tail`, `tr`, `comm`, `join`, `paste`, `column`, `expand`, `unexpand`, `fold`, `fmt`, `nl`, `rev`, `split`, `csplit`  

**Environment & Process**: `echo`, `env`, `export`, `jobs`, `bg`, `fg`, `nohup`, `sleep`, `time`, `wait`, `trap`, `disown`  

**Development Tools**: `git`, `make`, `cmake`, `gcc`, `clang`, `nm`, `objdump`, `strings`, `hexdump`, `xxd`, `patch`, `diff`, `cmp`, `ld`, `ar`, `ranlib`, `strip`  

**Package Managers**: `brew`, `pip3`, `gem`, `cargo`, `go`, `mvn`, `gradle`, `composer`, `yarn`, `pnpm`, `deno`, `npm`  

**Network Tools**: `curl`, `wget`, `ssh`, `scp`, `rsync`, `ping`, `dig`, `nslookup`, `host`, `whois`, `nc`, `telnet`, `traceroute`, `netstat`, `ss`, `arp`, `ifconfig`  

**Security Tools**: `gpg`, `openssl`, `ssh-keygen`, `md5`, `shasum`, `base64`, `security`, `codesign`, `spctl`, `dscl`, `sudo`  

**System Monitoring**: `ps`, `top`, `htop`, `iostat`, `lsof`, `pgrep`, `pkill`, `uptime`, `w`, `who`, `last`, `vmstat`, `dtruss`, `fs_usage`  

**System Administration**: `df`, `du`, `kill`, `sudo`  

**Archive & Compression**: `tar`, `zip`, `unzip`, `gzip`, `gunzip`, `bzip2`, `bunzip2`, `xz`, `unxz`, `zstd`, `lz4`, `compress`, `uncompress`, `cpio`, `ar`  

**Data Processing**: `jq`, `sqlite3`, `awk`  

**Text Editors**: `vim`, `nano`  

**Terminal & Session**: `screen`, `tmux`, `script`, `tee`, `yes`, `seq`, `expr`, `test`, `true`, `false`, `tty`, `stty`  

**Utilities**: `xargs`, `which`, `file`, `chmod`  

---

## Tool Categories Overview

### **Core Daily Tools** (Essential for most tasks)
`ls`, `cd`, `pwd`, `cp`, `mv`, `rm`, `cat`, `grep`, `find`, `git`, `ssh`, `curl`, `tar`, `ps`, `top`, `sudo`

### **Text Processing Powerhouses** 
`sed`, `awk`, `grep`, `rg`, `cut`, `sort`, `uniq`, `tr`, `jq`

### **Development Essentials**
`git`, `make`, `gcc`, `python3`, `node`, `npm`, `vim`, `diff`, `patch`, `strings`, `hexdump`

### **System Administration**
`ps`, `top`, `htop`, `lsof`, `netstat`, `df`, `du`, `iostat`, `sudo`, `dtruss`, `fs_usage`

### **Network Diagnostics**
`ping`, `dig`, `curl`, `ssh`, `netstat`, `lsof`, `traceroute`, `nc`, `telnet`

### **Security & Encryption**
`gpg`, `openssl`, `ssh-keygen`, `shasum`, `base64`, `security`, `codesign`

### **Package Management**
`brew`, `pip3`, `npm`, `yarn`, `gem`, `cargo`, `go`, `mvn`, `gradle`, `composer`

### **Binary Analysis**
`nm`, `objdump`, `strings`, `hexdump`, `xxd`, `file`, `otool`, `strip`

### **Archive & Compression**
`tar`, `zip`, `gzip`, `xz`, `zstd`, `bzip2` (ordered by modern preference: zstd > xz > gzip > bzip2)

### **Performance Analysis**
`time`, `htop`, `iostat`, `lsof`, `dtruss`, `fs_usage`, `vm_stat`, `activity_monitor`  

---

## Terminal & Session Management

### **screen** - Terminal Multiplexer
**Description**: Full-screen window manager that multiplexes a physical terminal between several processes
**Location**: `/usr/bin/screen`
**Version**: 4.00.03 (FAU) 23-Oct-06
**Common Use Cases**:
- Long-running processes that survive disconnection
- Multiple terminal sessions in single SSH connection
- Remote work with unreliable connections
- Server administration and monitoring

**Basic Session Management**:
```bash
# Start new screen session
screen

# Start named session
screen -S session_name

# List active sessions
screen -ls

# Reattach to session
screen -r session_name

# Detach from current session (inside screen)
Ctrl+A d

# Kill session
screen -X -S session_name quit
```

**Advanced Usage**:
```bash
# Start session with command
screen -S backup -dm /path/to/backup_script.sh

# Share session between users
screen -x session_name

# Log session output
screen -L

# Create window with specific title
Ctrl+A c
Ctrl+A A  # rename window

# Split screen horizontally
Ctrl+A S
# Split vertically
Ctrl+A |
```

**Automation Use Cases**:
```bash
# Run multiple monitoring processes
screen -S monitoring -dm htop
screen -S logs -dm tail -f /var/log/syslog
screen -S backup -dm ./backup_daemon.sh

# Remote deployment script
screen -S deploy -dm bash -c 'cd /app && git pull && make deploy'
```

### **tmux** - Terminal Multiplexer (Modern Alternative)
**Description**: Modern terminal multiplexer with improved features and active development
**Location**: `/opt/homebrew/bin/tmux`
**Difficulty**: ⭐⭐⭐ Intermediate (Session management) / ⭐⭐⭐⭐ Advanced (Custom configurations)
**Common Use Cases**:
- Enhanced session management with configuration
- Better window/pane management than screen
- Scriptable session creation
- Plugin ecosystem support

**See Also**: `screen` (traditional multiplexer), `zellij` (modern alternative), `byobu` (enhanced tmux)

**Basic Usage**:
```bash
# Session management

tmux new-session -s session_name      # Start new named session
tmux new -s dev                     # Short form
tmux                                # Start unnamed session

# Session management
tmux list-sessions                  # List all sessions (tmux ls)
tmux attach-session -t session_name # Attach to session (tmux a -t name)
tmux kill-session -t session_name  # Kill specific session
tmux kill-server                    # Kill all sessions

# Window management (inside tmux)
Ctrl+B c        # Create new window
Ctrl+B n        # Next window
Ctrl+B p        # Previous window
Ctrl+B 0-9      # Switch to window by number
Ctrl+B ,        # Rename current window
Ctrl+B &        # Kill current window

# Pane management (inside tmux)
Ctrl+B %        # Split pane vertically
Ctrl+B "        # Split pane horizontally
Ctrl+B arrow    # Switch between panes
Ctrl+B o        # Switch to next pane
Ctrl+B x        # Kill current pane
Ctrl+B z        # Toggle pane zoom (fullscreen)

# Session control (inside tmux)
Ctrl+B d        # Detach from session
Ctrl+B s        # List sessions and switch
Ctrl+B (        # Switch to previous session
Ctrl+B )        # Switch to next session

# Advanced features
tmux new -s work -d                 # Create detached session
tmux send-keys -t work 'ls' Enter   # Send commands to session
tmux new-window -t work -n logs     # Create named window in session

# Configuration and customization
# Edit ~/.tmux.conf for custom settings:
# set -g prefix C-a                 # Change prefix key
# set -g mouse on                   # Enable mouse support
# set -g status-bg blue             # Change status bar color
# bind r source-file ~/.tmux.conf   # Reload config key

# Scripted session creation
tmux new-session -s project -d
tmux split-window -h -t project
tmux split-window -v -t project
tmux send-keys -t project:0.0 'vim' Enter
tmux send-keys -t project:0.1 'npm start' Enter
tmux send-keys -t project:0.2 'git status' Enter
tmux attach-session -t project
```

### **script** - Record Terminal Sessions
**Description**: Makes a typescript of everything printed on your terminal
**Location**: `/usr/bin/script`
**Common Use Cases**:
- Documentation of command-line workflows
- Proof of work for assignments or audits
- Debugging session recording
- Training and demonstration materials

**Basic Recording**:
```bash
# Start recording to default file (typescript)
script

# Record to specific file
script session_log.txt

# Record with timing information
script -t 2>timing.log session.log

# Quiet mode (no start/stop messages)
script -q session.log

# Exit recording session
exit
```

**Advanced Features**:
```bash
# Append to existing file
script -a existing_log.txt

# Run specific command and record
script -c "ls -la && ps aux" command_output.txt

# Record with flush after each write
script -f session.log

# Playback recorded session with timing
scriptreplay timing.log session.log
```

**Automation Examples**:
```bash
# Record deployment process
script -q -c "./deploy.sh" deployment_$(date +%Y%m%d_%H%M%S).log

# Record system diagnostics
script -q -c "uname -a && df -h && free -m" system_check.log

# Create training materials
script -t 2>demo_timing.log demo_session.log
# Then playback: scriptreplay demo_timing.log demo_session.log
```

---

## Output Manipulation & Utilities

### **tee** - Duplicate Output
**Description**: Copies standard input to standard output while making copies in files
**Location**: `/usr/bin/tee`
**Common Use Cases**:
- Save command output while still displaying it
- Log pipeline outputs at multiple stages
- Monitor long-running processes
- Split output streams for different processing

**Basic Usage**:
```bash
# Display and save output
command | tee output.log

# Append to file instead of overwriting
command | tee -a logfile.txt

# Write to multiple files
command | tee file1.log file2.log file3.log

# Ignore interrupt signals
command | tee -i output.log
```

**Pipeline Integration**:
```bash
# Monitor and log build process
make 2>&1 | tee build.log

# Save intermediate results in data pipeline
curl api.example.com | jq '.' | tee raw_data.json | jq '.items[]' | tee processed.json

# Monitor system performance while logging
top -l 1 | tee -a system_monitor.log | grep "CPU usage"

# Debug pipeline stages
grep "ERROR" logfile | tee errors.txt | wc -l
```

**System Administration Examples**:
```bash
# Monitor installation while logging
sudo apt update 2>&1 | tee package_update.log

# Track system changes
dmesg | tee -a system_messages.log | grep -i error

# Log cron job output
0 2 * * * /backup/script.sh 2>&1 | tee -a /var/log/backup.log
```

### **yes** - Repeat String
**Description**: Outputs a string (default "y") repeatedly until killed
**Location**: `/usr/bin/yes`
**Common Use Cases**:
- Automated responses to interactive prompts
- Stress testing applications
- Generating test data
- Pipeline testing

**Basic Usage**:
```bash
# Output "y" repeatedly
yes

# Output custom string
yes "hello world"

# Use with commands requiring confirmation
yes | command_that_asks_questions

# Generate specific number of lines
yes | head -100
```

**Automation Examples**:
```bash
# Auto-confirm package installations
yes | sudo apt install package_name

# Generate test data
yes "test line" | head -1000 > test_data.txt

# Clear swap space (answer yes to prompts)
yes | sudo swapoff -a

# Fill file with repeated pattern
yes "$(seq 1 10)" | head -1000 > pattern_file.txt
```

**Stress Testing**:
```bash
# Generate continuous output for testing
yes | application_under_test

# Create load for testing pipes
yes | gzip > /dev/null &

# Test application with many inputs
yes "input_data" | ./test_application
```

### **seq** - Generate Number Sequences
**Description**: Prints sequences of numbers with customizable format and increment
**Location**: `/usr/bin/seq`
**Common Use Cases**:
- Loop iteration in shell scripts
- Generate test data
- Create numbered files or directories
- Mathematical sequences

**Basic Syntax**:
```bash
# Generate sequence 1 to 10
seq 10

# Generate sequence with start and end
seq 5 15

# Generate with increment
seq 1 2 10  # 1, 3, 5, 7, 9

# Reverse sequence
seq 10 -1 1
```

**Formatting Options**:
```bash
# Equal width padding
seq -w 1 100  # 001, 002, ..., 100

# Custom format
seq -f "file_%03g.txt" 1 5  # file_001.txt, file_002.txt, etc.

# Custom separator
seq -s ", " 1 5  # 1, 2, 3, 4, 5

# No final newline
seq -t, 1 3  # 1,2,3,
```

**Automation Examples**:
```bash
# Create numbered directories
seq 1 10 | xargs -I {} mkdir project_{}

# Generate test files
seq -f "test_%02g.txt" 1 50 | xargs touch

# Batch process with numbered parameters
seq 1 100 | xargs -I {} ./process_item.sh {}

# Create backup rotation
seq 1 7 | xargs -I {} cp logfile logfile.{}
```

**Mathematical Uses**:
```bash
# Generate decimal sequences
seq 0.1 0.1 1.0

# Create time series
seq -f "$(date +%Y%m%d)_%02g" 1 24  # hourly timestamps

# Generate port numbers for testing
seq 8000 8010 | xargs -I {} netstat -an | grep {}
```

---

## Mathematical & Logic Utilities

### **shuf** - Shuffle Lines (GNU Tool)
**Description**: Randomly permute input lines or generate random selections
**Status**: Not available on macOS (use `gshuf` if GNU coreutils installed)
**Alternative**: Use `sort -R` or `perl -MList::Util=shuffle`
**Common Use Cases**:
- Randomize data for testing
- Random sampling from datasets
- Shuffle configuration options

**Alternative Methods on macOS**:
```bash
# Shuffle lines using sort
sort -R input.txt

# Shuffle using awk
awk 'BEGIN{srand()} {print rand(), $0}' input.txt | sort -n | cut -d' ' -f2-

# Random selection using head and sort
sort -R input.txt | head -10

# Shuffle with Perl
perl -MList::Util=shuffle -e 'print shuffle(<>)' input.txt
```

### **factor** - Prime Factorization (GNU Tool)
**Description**: Factor integers into prime factors
**Status**: Not available on macOS (use `python` or `bc` alternatives)
**Common Use Cases**:
- Mathematical analysis
- Cryptographic applications
- Number theory exploration

**Alternative Methods**:
```bash
# Using Python for factorization
python3 -c "
import sys
n = int(sys.argv[1])
factors = []
d = 2
while d * d <= n:
    while n % d == 0:
        factors.append(d)
        n //= d
    d += 1
if n > 1:
    factors.append(n)
print(' '.join(map(str, factors)))
" 60

# Simple factorization with bc
factor_with_bc() {
    local n=$1
    local d=2
    while [ $((d * d)) -le $n ]; do
        while [ $((n % d)) -eq 0 ]; do
            echo $d
            n=$((n / d))
        done
        d=$((d + 1))
    done
    [ $n -gt 1 ] && echo $n
}
```

### **expr** - Evaluate Expressions
**Description**: Evaluates mathematical and string expressions
**Location**: `/bin/expr`
**Common Use Cases**:
- Shell script calculations
- String manipulation
- Conditional evaluation
- Variable arithmetic

**Mathematical Operations**:
```bash
# Basic arithmetic
expr 5 + 3        # 8
expr 10 - 4       # 6
expr 6 \* 7       # 42 (escape * in shell)
expr 15 / 3       # 5
expr 17 % 5       # 2 (modulo)

# Complex expressions
expr \( 5 + 3 \) \* 2    # 16

# Variables in calculations
a=10; b=5
expr $a + $b      # 15
```

**String Operations**:
```bash
# String length
expr length "hello world"    # 11

# Substring extraction
expr substr "hello world" 7 5    # "world"

# Pattern matching
expr "hello123" : '.*\([0-9]*\)'    # 3

# Index of character
expr index "hello" "l"    # 3
```

**Shell Script Examples**:
```bash
#!/bin/bash
# Counter loop using expr
i=1
while [ $i -le 10 ]; do
    echo "Iteration: $i"
    i=$(expr $i + 1)
done

# File size calculation
file_size=$(wc -c < file.txt)
kb_size=$(expr $file_size / 1024)
echo "File size: ${kb_size}KB"

# Simple calculator function
calculate() {
    echo "Result: $(expr $1 $2 $3)"
}
calculate 10 + 5
```

### **test** - Evaluate Conditions
**Description**: Evaluate conditional expressions and return exit status
**Location**: Built-in shell command (also `/usr/bin/test`)
**Common Use Cases**:
- Shell script conditionals
- File system tests
- String comparisons
- Numerical comparisons

**File Tests**:
```bash
# File existence and types
test -e filename    # exists
test -f filename    # regular file
test -d dirname     # directory
test -L linkname    # symbolic link
test -r filename    # readable
test -w filename    # writable
test -x filename    # executable

# File comparisons
test file1 -nt file2    # newer than
test file1 -ot file2    # older than
test file1 -ef file2    # same file
```

**String Tests**:
```bash
# String length and equality
test -z "$string"       # empty string
test -n "$string"       # non-empty string
test "$str1" = "$str2"  # equal
test "$str1" != "$str2" # not equal
test "$str1" \< "$str2" # lexicographically less
```

**Numerical Tests**:
```bash
# Numerical comparisons
test 5 -eq 5     # equal
test 5 -ne 3     # not equal
test 5 -gt 3     # greater than
test 5 -ge 5     # greater or equal
test 3 -lt 5     # less than
test 3 -le 5     # less or equal
```

**Script Examples**:
```bash
#!/bin/bash
# Backup script with conditions
if test -f "$1"; then
    cp "$1" "${1}.backup"
    echo "Backup created"
else
    echo "File not found: $1"
    exit 1
fi

# System check
if test $(df / | tail -1 | awk '{print $5}' | cut -d% -f1) -gt 90; then
    echo "WARNING: Root filesystem over 90% full"
fi
```

### **true** and **false** - Exit Status Commands
**Description**: Commands that always return success (0) or failure (1) exit status
**Location**: Built-in shell commands
**Common Use Cases**:
- Infinite loops in shell scripts
- Default conditions in case statements
- Testing and debugging
- Pipeline control

**Basic Usage**:
```bash
# Always succeeds
true && echo "This will always run"

# Always fails
false || echo "This will always run"

# Check exit status
true; echo $?    # 0
false; echo $?   # 1
```

**Loop Control**:
```bash
# Infinite loop
while true; do
    echo "Running..."
    sleep 1
done

# Alternative to infinite loop
while :; do    # : is alias for true
    echo "Running..."
    sleep 1
done

# Conditional loop with break
while true; do
    read -p "Continue? (y/n): " answer
    [ "$answer" = "n" ] && break
    echo "Continuing..."
done
```

**Script Examples**:
```bash
# Default case in conditionals
case "$input" in
    start) start_service ;;
    stop) stop_service ;;
    *) echo "Unknown command" && false ;;
esac

# Testing script logic
if true; then
    echo "This branch always executes"
fi

# Placeholder for future implementation
deploy_to_production() {
    echo "Not implemented yet"
    false  # Indicate failure
}
```

---

## Terminal Information & Control

### **tty** - Terminal Name
**Description**: Returns the name of the terminal attached to standard input
**Location**: `/usr/bin/tty`
**Common Use Cases**:
- Script behavior based on terminal type
- Security checks in scripts
- System administration
- Terminal identification

**Basic Usage**:
```bash
# Show current terminal
tty    # /dev/ttys001

# Silent mode (only exit status)
tty -s && echo "Running in terminal" || echo "Not in terminal"

# Check if running interactively
if tty -s; then
    echo "Interactive session"
else
    echo "Non-interactive (script/pipe)"
fi
```

**Script Applications**:
```bash
#!/bin/bash
# Different behavior for interactive vs non-interactive
if tty -s; then
    # Interactive - show progress
    echo "Starting backup..."
    rsync -av --progress source/ dest/
else
    # Non-interactive - quiet mode
    rsync -av source/ dest/ 2>/dev/null
fi

# Log which terminal ran the script
echo "Script run from: $(tty)" >> script.log

# Security check
current_tty=$(tty)
if [[ "$current_tty" =~ ^/dev/pts/ ]]; then
    echo "Running in pseudo-terminal (SSH session)"
elif [[ "$current_tty" =~ ^/dev/tty ]]; then
    echo "Running in physical terminal"
fi
```

### **stty** - Terminal Settings
**Description**: Set or display terminal characteristics and settings
**Location**: `/bin/stty`
**Common Use Cases**:
- Configure terminal behavior
- Password input without echo
- Terminal size detection
- Raw mode for special applications

**Display Settings**:
```bash
# Show all settings
stty -a

# Show specific settings
stty size           # rows columns
stty speed          # baud rate
stty -echo          # disable echo
stty echo           # enable echo
```

**Terminal Configuration**:
```bash
# Disable echo (for password input)
stty -echo
read -p "Password: " password
stty echo
echo

# Set terminal size
stty rows 50 cols 132

# Raw mode (no special character processing)
stty raw
# Reset to normal
stty sane

# Prevent Ctrl+C interruption
stty -isig
# Restore interrupt capability
stty isig
```

**Automation Examples**:
```bash
# Secure password input function
read_password() {
    echo -n "Enter password: "
    stty -echo
    read password
    stty echo
    echo
}

# Save and restore terminal settings
save_terminal() {
    SAVED_STTY=$(stty -g)
}

restore_terminal() {
    stty "$SAVED_STTY"
}

# Terminal size-aware scripts
get_terminal_size() {
    local size=$(stty size)
    ROWS=${size% *}
    COLS=${size#* }
}

# Setup for full-screen application
setup_fullscreen() {
    stty -echo -icanon
    tput clear
    tput civis  # hide cursor
}

cleanup_fullscreen() {
    stty echo icanon
    tput cnorm  # show cursor
}
```

**Interactive Scripts**:
```bash
#!/bin/bash
# Menu system with terminal control
show_menu() {
    clear
    echo "System Administration Menu"
    echo "1. View disk usage"
    echo "2. Check processes"
    echo "3. System logs"
    echo "q. Quit"
}

# Disable line buffering for immediate response
stty -icanon min 1 time 0

while true; do
    show_menu
    read -n 1 choice
    case $choice in
        1) df -h | less ;;
        2) ps aux | less ;;
        3) tail -f /var/log/syslog ;;
        q) break ;;
    esac
done

# Restore normal terminal behavior
stty icanon
```

---

## Terminal Productivity Best Practices

### **Session Management Workflows**
```bash
# Development session setup
screen -S dev
# Window 0: editor
# Window 1: build/test
# Window 2: git/docs
# Window 3: monitoring

# Remote server maintenance
screen -S maintenance -dm
screen -S maintenance -X screen -t logs tail -f /var/log/syslog
screen -S maintenance -X screen -t top top
screen -S maintenance -X screen -t backup ./backup_script.sh
```

### **Output Monitoring Patterns**
```bash
# Multi-stage logging
command 2>&1 | tee >(grep ERROR > errors.log) >(grep WARN > warnings.log)

# Progress monitoring with checkpoints
long_process | tee >(grep "Progress:" | tee progress.log) | grep "Complete"

# Performance monitoring
while true; do
    date; ps aux | grep myapp; echo "---"
    sleep 5
done | tee performance.log
```

### **Automation Helpers**
```bash
# Confirmation bypass wrapper
yes_wrapper() {
    yes | timeout 30 "$@" || {
        echo "Command timed out or failed: $@"
        return 1
    }
}

# Terminal-aware error handling
error_handler() {
    if tty -s; then
        echo "ERROR: $1" >&2
        read -p "Continue anyway? (y/N): " response
        [[ "$response" =~ ^[Yy] ]] || exit 1
    else
        echo "ERROR: $1" | logger
        exit 1
    fi
}
```

---

## Environment & Process Management

### **echo** - Display Text
**Description**: Display line of text to standard output
**Location**: Built-in shell command
**Common Use Cases**:
- Print messages and variables
- Script output and debugging
- Create simple files with content
- Environment variable display

**Examples**:
```bash
# Basic text output
echo "Hello, World!"

# Print variables
echo "Current user: $USER"
echo "Home directory: $HOME"

# No trailing newline
echo -n "Enter your name: "

# Enable interpretation of backslash escapes
echo -e "Line 1\nLine 2\nLine 3"

# Create files with content
echo "#!/bin/bash" > script.sh
echo "echo 'Hello'" >> script.sh

# Escape special characters
echo "Price: \$25.99"

# Multiple arguments
echo "File:" $filename "Size:" $size
```

### **env** - Environment Variables
**Description**: Display or modify environment variables for command execution
**Location**: `/usr/bin/env`
**Common Use Cases**:
- View environment variables
- Run commands with modified environment
- Shebang lines for portable scripts
- Environment debugging

**Examples**:
```bash
# Display all environment variables
env

# Show specific variables
env | grep PATH
env | grep USER

# Run command with modified environment
env PATH="/custom/path:$PATH" command

# Set temporary variables
env PYTHONPATH="/custom/python" python script.py

# Clear environment and run command
env -i command

# Portable shebang lines
#!/usr/bin/env python3
#!/usr/bin/env bash

# Remove specific variable
env -u VARIABLE command

# Debug environment issues
env | sort > current_env.txt
```

### **alias** - Create Command Aliases
**Description**: Create aliases for commands to provide shorthand or modify default behavior
**Location**: Built-in shell command
**Common Use Cases**:
- Create shortcuts for frequently used commands
- Add default options to commands
- Simplify complex command sequences
- Improve productivity and reduce typing

**Examples**:
```bash
# Create simple command shortcuts
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'

# Add safety to destructive commands
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'

# Navigation shortcuts
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# List all aliases
alias

# Remove an alias
unalias ll

# Create temporary alias for session
alias grep='grep --color=auto'

# Complex command shortcuts
alias ports='netstat -tuln'
alias meminfo='cat /proc/meminfo'
alias pscpu='ps auxf | sort -nr -k 3'
alias psram='ps auxf | sort -nr -k 4'

# Directory operations
alias mkdir='mkdir -pv'
alias wget='wget -c'
```

### **export** - Set Environment Variables
**Description**: Set environment variables for current shell and child processes
**Location**: Built-in shell command
**Common Use Cases**:
- Configure shell environment
- Set up development environments
- Pass variables to child processes
- Script configuration

**Examples**:
```bash
# Export variables
export PATH="/usr/local/bin:$PATH"
export EDITOR="vim"
export JAVA_HOME="/usr/lib/jvm/java-11"

# Export with assignment
export DATABASE_URL="postgresql://localhost/mydb"

# Make existing variable available to child processes
MY_VAR="value"
export MY_VAR

# Show exported variables
export -p

# Development environment setup
export NODE_ENV="development"
export API_KEY="your-api-key"
export DEBUG="true"

# Unset exported variable
export -n VARIABLE
```

### **jobs** - Job Control
**Description**: Display active jobs in current shell session
**Location**: Built-in shell command
**Common Use Cases**:
- Monitor background processes
- Job control management
- Process status checking
- Multi-tasking coordination

**Examples**:
```bash
# List all jobs
jobs

# List with process IDs
jobs -l

# List only running jobs
jobs -r

# List only stopped jobs
jobs -s

# Start background job
long_running_command &

# Check job status
jobs %1

# Job management workflow
sleep 100 &  # Start background job
jobs         # Check status
fg %1        # Bring to foreground
# Ctrl+Z     # Stop job
bg %1        # Resume in background
kill %1      # Terminate job
```

### **bg** and **fg** - Background/Foreground Jobs
**Description**: Manage job execution state (background/foreground)
**Location**: Built-in shell commands
**Common Use Cases**:
- Resume stopped jobs
- Switch between foreground/background
- Multi-tasking management
- Long-running process control

**Examples**:
```bash
# Start process, then move to background
long_command
# Ctrl+Z (stop)
bg  # Resume in background

# Move specific job to background
bg %2

# Bring job to foreground
fg %1

# Multiple job management
make &       # Job 1 (background)
vim file &   # Job 2 (background)
jobs         # List all jobs
fg %2        # Bring vim to foreground

# Resume most recent job
fg
bg

# Common workflow
./compile.sh &  # Start compilation in background
vim source.c    # Edit source while compiling
jobs           # Check compilation status
fg %1          # Check compilation output
```

### **nohup** - No Hangup
**Description**: Run commands immune to hangups, with output to non-tty
**Location**: `/usr/bin/nohup`
**Common Use Cases**:
- Long-running processes that survive logout
- Remote server commands via SSH
- Batch processing jobs
- Background services

**Examples**:
```bash
# Basic nohup usage
nohup long_running_script.sh &

# Custom output file
nohup command > output.log 2>&1 &

# Multiple commands
nohup bash -c "command1 && command2" &

# Check nohup output
tail -f nohup.out

# Server deployment example
nohup python server.py > server.log 2>&1 &

# Batch processing
nohup find /large/directory -name "*.log" -exec gzip {} \; &

# Backup script
nohup rsync -av /source/ /backup/ > backup.log 2>&1 &

# Get process ID for later management
nohup command & echo $! > command.pid
```

### **sleep** - Delay Execution
**Description**: Suspend execution for specified time interval
**Location**: `/usr/bin/sleep`
**Common Use Cases**:
- Script timing control
- Rate limiting
- Batch processing delays
- System monitoring intervals

**Examples**:
```bash
# Sleep for seconds
sleep 5

# Different time units
sleep 2m      # 2 minutes
sleep 1h      # 1 hour
sleep 0.5     # Half second

# Script delays
echo "Starting process..."
sleep 3
echo "Process started"

# Monitoring loop
while true; do
    check_system_status
    sleep 30
done

# Rate-limited operations
for file in *.txt; do
    process_file "$file"
    sleep 1  # Prevent overwhelming system
done

# Retry with backoff
retry_count=0
while ! connect_to_service; do
    retry_count=$((retry_count + 1))
    echo "Retry $retry_count failed, waiting..."
    sleep $((retry_count * 2))
done
```

### **time** - Time Command Execution
**Description**: Time the execution of commands and report resource usage
**Location**: `/usr/bin/time` (also built-in shell command)
**Common Use Cases**:
- Performance measurement
- Benchmark testing
- Resource usage analysis
- Script optimization

**Examples**:
```bash
# Basic timing
time command

# Detailed timing (external time command)
/usr/bin/time -p command

# Format output
/usr/bin/time -f "Time: %E, Memory: %M KB" command

# Save timing to file
/usr/bin/time -o timing.log -a command

# Compare different approaches
time approach1.sh
time approach2.sh

# Script performance analysis
time make clean && make all

# Memory usage monitoring
/usr/bin/time -v memory_intensive_program

# Benchmark multiple runs
for i in {1..10}; do
    echo "Run $i:"
    time test_script.sh
done
```

### **wait** - Wait for Process Completion
**Description**: Wait for background processes to complete
**Location**: Built-in shell command
**Common Use Cases**:
- Synchronize parallel processes
- Ensure completion before proceeding
- Parallel processing coordination
- Script flow control

**Examples**:
```bash
# Wait for all background jobs
command1 &
command2 &
command3 &
wait  # Wait for all to complete

# Wait for specific process
command &
PID=$!
wait $PID

# Parallel processing with synchronization
for file in *.txt; do
    process_file "$file" &
done
wait  # Wait for all processing to complete

# Conditional waiting
long_task &
BG_PID=$!
while kill -0 $BG_PID 2>/dev/null; do
    echo "Still running..."
    sleep 5
done
echo "Task completed"

# Error handling with wait
risky_command &
if wait $!; then
    echo "Command succeeded"
else
    echo "Command failed"
fi
```

### **trap** - Signal Handling
**Description**: Execute commands when shell receives signals
**Location**: Built-in shell command
**Common Use Cases**:
- Cleanup operations on script exit
- Signal handling in scripts
- Resource management
- Graceful shutdown procedures

**Examples**:
```bash
# Cleanup on exit
cleanup() {
    echo "Cleaning up temporary files..."
    rm -f /tmp/script.$$.*
}
trap cleanup EXIT

# Handle interruption
trap 'echo "Script interrupted, exiting..."; exit 1' INT TERM

# Ignore specific signals
trap '' HUP  # Ignore hangup signal

# Debug mode
trap 'echo "Line $LINENO: $BASH_COMMAND"' DEBUG

# Resource management
setup_resources() {
    lock_file="/tmp/script.lock"
    touch "$lock_file"
}

cleanup_resources() {
    rm -f "$lock_file"
}

trap cleanup_resources EXIT INT TERM
setup_resources

# Network connection cleanup
trap 'pkill -P $$; exit' INT TERM
```

### **disown** - Remove Jobs from Shell
**Description**: Remove jobs from shell's job table
**Location**: Built-in shell command
**Common Use Cases**:
- Detach processes from shell
- Prevent SIGHUP on shell exit
- Long-running background processes
- Process independence

**Examples**:
```bash
# Start and disown process
long_running_command &
disown

# Disown specific job
command &
disown %1

# Disown all jobs
disown -a

# Keep job in job table but remove SIGHUP
disown -h %1

# Common pattern for detached processes
nohup long_command > output.log 2>&1 &
disown

# Server process management
./start_server.sh &
SERVER_PID=$!
disown
echo $SERVER_PID > server.pid
```

---

## 🔧 Troubleshooting Guide

### **Common CLI Issues and Solutions**

#### **Command Not Found**
```bash
# Problem: "command not found" error
# Solutions:

# 1. Check if tool is installed
which command_name
type command_name
command -v command_name

# 2. Check PATH variable
echo $PATH

# 3. Use full path to command
/usr/local/bin/command_name

# 4. Install missing tool
brew install command_name        # macOS with Homebrew
apt install command_name          # Debian/Ubuntu
yum install command_name          # RHEL/CentOS

# 5. Source shell configuration
source ~/.bashrc                  # Bash
source ~/.zshrc                   # Zsh
```

#### **Permission Denied**
```bash
# Problem: "Permission denied" errors
# Solutions:

# 1. Check file permissions
ls -la file_name

# 2. Make file executable
chmod +x script.sh

# 3. Change ownership
sudo chown $(whoami) file_name

# 4. Run with elevated privileges
sudo command_name

# 5. Check directory permissions
ls -ld directory_name
```

#### **Disk Space Issues**
```bash
# Problem: "No space left on device"
# Solutions:

# 1. Check disk usage
df -h                            # Overview
du -sh *                         # Current directory
dust                             # Visual tree (if installed)
ncdu /                           # Interactive explorer

# 2. Find large files
find / -size +100M -type f 2>/dev/null

# 3. Clean package manager cache
brew cleanup                     # Homebrew
apt clean                        # APT
yum clean all                    # YUM

# 4. Remove old logs
sudo rm -rf /var/log/*.old
sudo journalctl --vacuum-time=7d  # SystemD logs
```

#### **Process Issues**
```bash
# Problem: Process won't stop/hung process
# Solutions:

# 1. Find process
ps aux | grep process_name
pgrep process_name

# 2. Graceful termination
kill PID
killall process_name

# 3. Force kill
kill -9 PID
killall -9 process_name

# 4. Check zombie processes
ps aux | grep defunct

# 5. Check resource limits
ulimit -a
```

#### **Network Connection Problems**
```bash
# Problem: Can't connect to network/internet
# Solutions:

# 1. Test connectivity
ping 8.8.8.8                     # Test internet
ping google.com                  # Test DNS
ifconfig                         # Check interfaces
ip addr                          # Modern alternative

# 2. DNS issues
dig google.com
nslookup google.com
cat /etc/resolv.conf

# 3. Port issues
lsof -i :PORT                    # What's using port
netstat -tulnp                   # All listening ports
nc -zv hostname PORT             # Test port connection

# 4. Firewall issues
sudo iptables -L                 # Linux
sudo pfctl -s rules              # macOS
```

#### **Git Problems**
```bash
# Problem: Git merge conflicts, push failures
# Solutions:

# 1. Merge conflicts
git status                       # See conflicted files
git diff                         # View conflicts
# Edit files to resolve
git add resolved_file
git commit

# 2. Push rejected
git pull --rebase origin main
git push

# 3. Undo last commit
git reset --soft HEAD~1          # Keep changes
git reset --hard HEAD~1          # Discard changes

# 4. Clean working directory
git clean -n                     # Dry run
git clean -fd                    # Force clean
```

#### **File Encoding Issues**
```bash
# Problem: Strange characters in files
# Solutions:

# 1. Check encoding
file -bi filename
chardet filename                 # If installed

# 2. Convert encoding
iconv -f ISO-8859-1 -t UTF-8 input.txt > output.txt

# 3. Remove BOM
sed -i '1s/^\xEF\xBB\xBF//' file.txt

# 4. Fix line endings
dos2unix file.txt                # DOS to Unix
unix2dos file.txt                # Unix to DOS
```

#### **Performance Issues**
```bash
# Problem: System running slowly
# Solutions:

# 1. Check system resources
top                              # Real-time view
htop                             # Better interface
btop                             # Modern alternative

# 2. Check disk I/O
iostat -x 1
iotop                            # If available

# 3. Check memory
free -h                          # Linux
vm_stat                          # macOS

# 4. Find resource hogs
ps aux --sort=-%cpu | head       # Top CPU users
ps aux --sort=-%mem | head       # Top memory users
```

---

## 🔄 Common Workflows and Pipelines

### **Development Workflows**

#### **Project Setup Workflow**
```bash
# Complete new project setup
mkdir project-name && cd project-name
git init
echo "# Project Name" > README.md
echo "node_modules/" > .gitignore
npm init -y
git add .
git commit -m "Initial commit"
gh repo create --public
git push -u origin main
```

#### **Code Search and Replace Workflow**
```bash
# Find and replace across entire codebase
# Using ripgrep and sd (modern tools)
rg "old_function" --files-with-matches | xargs sd "old_function" "new_function"

# Traditional approach
find . -type f -name "*.js" -exec sed -i 's/old/new/g' {} +

# With backup
find . -type f -name "*.py" -exec sed -i.bak 's/old/new/g' {} \;
```

#### **Testing and CI Workflow**
```bash
# Run tests with coverage
npm test -- --coverage
# or
pytest --cov=src tests/

# Run linting and formatting
npm run lint
npm run format
# or
black . && isort . && flake8

# Full CI simulation
npm run lint && npm test && npm run build
```

### **Data Processing Workflows**

#### **Log Analysis Pipeline**
```bash
# Extract errors from logs
tail -f /var/log/app.log | grep ERROR | tee errors.log

# Analyze access patterns
cat access.log | \
  awk '{print $1}' | \
  sort | uniq -c | \
  sort -rn | \
  head -20

# Time-based log analysis
grep "2024-01" app.log | \
  grep ERROR | \
  cut -d' ' -f2 | \
  uniq -c | \
  sort -rn
```

#### **CSV/JSON Processing Pipeline**
```bash
# CSV processing
csvcut -c name,email,status data.csv | \
  csvgrep -c status -m "active" | \
  csvstat

# JSON processing
curl -s https://api.example.com/data | \
  jq '.items[] | select(.status=="active")' | \
  jq -s 'sort_by(.timestamp) | reverse | .[0:10]'

# Convert CSV to JSON
csvjson data.csv > data.json
```

### **System Administration Workflows**

#### **Backup and Restore Workflow**
```bash
# Create timestamped backup
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude='*.log' \
  --exclude='node_modules' \
  /path/to/backup

# Restore from backup
tar -xzf backup_20240101_120000.tar.gz -C /restore/path

# Incremental backup with rsync
rsync -avz --delete \
  --exclude='*.tmp' \
  --backup --backup-dir=/backups/incremental_$(date +%Y%m%d) \
  /source/ /destination/
```

#### **Server Health Check Workflow**
```bash
# Quick health check pipeline
echo "=== System Health ===" && \
uptime && \
echo "=== Disk Usage ===" && \
df -h | grep -v tmpfs && \
echo "=== Memory ===" && \
free -h && \
echo "=== Top Processes ===" && \
ps aux --sort=-%cpu | head -5
```

### **Security Workflows**

#### **Security Audit Workflow**
```bash
# Check for exposed ports
sudo lsof -i -P -n | grep LISTEN

# Find SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Check failed login attempts
grep "Failed password" /var/log/auth.log | tail -20

# SSL certificate check
echo | openssl s_client -connect domain.com:443 2>/dev/null | \
  openssl x509 -noout -dates
```

#### **File Integrity Workflow**
```bash
# Generate checksums
find . -type f -exec sha256sum {} \; > checksums.txt

# Verify integrity
sha256sum -c checksums.txt

# Monitor file changes
find /etc -type f -mtime -1 -ls
```

### **Container Workflows**

#### **Docker Development Workflow**
```bash
# Build, run, and debug
docker build -t app:latest .
docker run -d -p 8080:8080 --name app app:latest
docker logs -f app
docker exec -it app /bin/bash

# Cleanup workflow
docker stop $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images -q -f dangling=true)
docker system prune -a
```

#### **Kubernetes Deployment Workflow**
```bash
# Deploy application
kubectl apply -f deployment.yaml
kubectl rollout status deployment/app
kubectl get pods -w

# Debug issues
kubectl describe pod pod-name
kubectl logs -f pod-name
kubectl exec -it pod-name -- /bin/bash

# Rollback if needed
kubectl rollout undo deployment/app
```

---

## Conclusion

This comprehensive reference now documents **312+ essential CLI tools** across all critical categories for Claude's programming and system administration work. The expansion includes Phase 8 additions with complete coverage of:

- **File & Directory Operations** (20+ tools)
- **Text Processing & Manipulation** (25+ tools)  
- **Environment & Process Management** (12+ tools)
- **Version Control** (Git ecosystem with modern tools: delta, lazygit)
- **Development Tools** (30+ tools including compilers, debuggers, analyzers, benchmarking)
- **Network Tools** (15+ tools for connectivity, DNS, diagnostics)
- **Security Tools** (12+ tools for encryption, authentication, system security)
- **System Monitoring** (15+ tools for performance, processes, resources)
- **System Administration** (Core system management tools)
- **Package Managers** (12+ managers for all major languages/platforms)
- **Archive & Compression Tools** (10+ tools with performance comparisons)
- **Data Processing Tools** (JSON, SQL, structured data)
- **Media Processing Tools** (ffmpeg, imagemagick, pandoc for video/image/document processing)
- **Container & Cloud Tools** (docker-compose, terraform, kubectl for modern infrastructure)
- **Text Editors** (vim, nano)
- **Terminal & Session Management** (screen, tmux, session tools)
- **Utility Tools** (Supporting tools and helpers)

### Key Features:
- **Practical Examples**: Each tool includes real-world usage examples
- **Performance Guidance**: Modern alternatives highlighted (e.g., `rg` vs `grep`, `fd` vs `find`)
- **Safety Notes**: Critical warnings for destructive operations
- **Pipeline Integration**: Examples showing tool combinations
- **Cross-Platform Awareness**: macOS-specific variations noted
- **Security Best Practices**: Safe usage patterns and authentication workflows

This reference enables efficient handling of everything from basic file operations to complex development workflows, system administration tasks, network diagnostics, security operations, and performance analysis.
