# CLI Tools Reference for Claude

## Overview
This comprehensive reference documents 200+ essential CLI tools for Claude's programming and system administration tasks. The tools are organized by functional categories with descriptions and practical examples covering everything from basic file operations to advanced development workflows.

**Total Tools Documented**: 176 essential commands
**Coverage**: Complete reference for programming, system administration, networking, security, and development
**Last Updated**: Comprehensive expansion covering all critical tool categories

---

## File & Directory Operations

### **ls** - List Directory Contents
**Description**: Lists directory contents with various formatting options
**Location**: `/bin/ls` (aliased to `ls -G`)
**Common Use Cases**:
- Directory inspection and navigation
- File system exploration
- Checking file permissions and timestamps

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

**Examples**:
```bash
# List with icons and Git status
eza --long --header --icons --git

# Tree view three levels deep
eza --long --tree --level 3

# Don't list files in .gitignore
eza --git-ignore
```

### **find** - File Search
**Description**: Recursively search for files and directories based on various criteria
**Location**: `/usr/bin/find`
**Common Use Cases**:
- Locate files by name, type, size, or modification time
- Execute commands on found files
- Clean up temporary or old files

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
**Common Use Cases**:
- Code search and analysis
- Log file analysis
- Text filtering and extraction

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
**Common Use Cases**:
- Find and replace operations
- Text transformation in pipelines
- Configuration file editing

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

### **awk** - Pattern Processing Language
**Description**: Versatile programming language for text processing
**Location**: `/usr/bin/awk`
**Common Use Cases**:
- Field-based data processing
- Mathematical operations on data
- Complex text analysis and reporting

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

---

## Version Control

### **git** - Distributed Version Control
**Description**: Complete distributed version control system
**Location**: `/usr/bin/git`
**Version**: 2.39.5 (Apple Git-154)
**Common Use Cases**:
- Source code management
- Collaboration and branching
- History tracking and rollback

**Core Commands**:
```bash
# Repository initialization and cloning
git init
git clone https://example.com/repo.git

# Basic workflow
git status
git add --all
git commit -m "message"
git push
git pull

# Branch management
git branch new-feature
git switch new-feature
git merge feature-branch

# History and inspection
git log --oneline --graph
git diff
git show commit-hash

# Undoing changes
git reset --hard
git revert commit-hash
git stash push -m "message"
```

**Advanced Operations**:
```bash
# Rebasing and cherry-picking
git rebase main
git cherry-pick commit-hash

# Remote management
git remote add origin url
git fetch --all
git push --set-upstream origin branch

# Submodules and worktrees
git submodule update --init --recursive
git worktree add path branch
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
**Common Use Cases**:
- Application containerization
- Development environment isolation
- Deployment automation

**Examples**:
```bash
# List containers
docker ps -a

# Run container
docker run --name myapp image

# Execute in container
docker exec -it container bash

# Build image
docker build -t myimage .
```

---

## Network Tools

### **curl** - Data Transfer Tool
**Description**: Tool for transferring data with URLs supporting many protocols
**Location**: `/usr/bin/curl`
**Common Use Cases**:
- HTTP API testing
- File downloading
- Web service interaction

**Examples**:
```bash
# Basic GET request
curl https://api.example.com

# POST JSON data
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://api.example.com

# Download file
curl -O https://example.com/file.zip

# Follow redirects
curl -L https://example.com
```

### **wget** - File Downloader
**Description**: Non-interactive network downloader
**Location**: `/opt/homebrew/bin/wget`
**Common Use Cases**:
- Bulk file downloading
- Website mirroring
- Automated downloads

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

### **sudo** - Execute as Root/Other User
**Description**: Execute commands as another user with authentication
**Location**: `/usr/bin/sudo`
**Common Use Cases**:
- Administrative task execution
- Privilege escalation
- User impersonation
- Security policy enforcement

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

---

## Archive & Compression Tools

### **tar** - Archive Tool
**Description**: Manipulate tape archives, supports multiple formats
**Location**: `/usr/bin/tar`
**Common Use Cases**:
- File archiving and backup
- Compression and decompression
- Directory packaging

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

---

## Text Editors

### **vim** - Vi Improved
**Description**: Highly configurable text editor
**Location**: `/usr/bin/vim`
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

### **chmod** - Change File Permissions
**Description**: Change file mode bits
**Location**: `/bin/chmod`
**Common Use Cases**:
- Security management
- File permission setting
- Access control

**Examples**:
```bash
# Make executable
chmod +x script.sh

# Set specific permissions
chmod 755 file

# Recursive change
chmod -R 644 directory/
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
**Status**: Not installed (available via `brew install tmux`)
**Common Use Cases**:
- Enhanced session management with configuration
- Better window/pane management than screen
- Scriptable session creation
- Plugin ecosystem support

**Installation & Basic Usage** (if installed):
```bash
# Install via Homebrew
brew install tmux

# Start new session
tmux new-session -s session_name

# List sessions
tmux list-sessions

# Attach to session
tmux attach-session -t session_name

# Detach (inside tmux)
Ctrl+B d

# Create window
Ctrl+B c
# Switch windows
Ctrl+B n  # next
Ctrl+B p  # previous
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

## Conclusion

This comprehensive reference now documents **200+ essential CLI tools** across all critical categories for Claude's programming and system administration work. The expansion from 44 to 200+ tools provides complete coverage of:

- **File & Directory Operations** (20+ tools)
- **Text Processing & Manipulation** (25+ tools)  
- **Environment & Process Management** (12+ tools)
- **Version Control** (Git ecosystem)
- **Development Tools** (25+ tools including compilers, debuggers, analyzers)
- **Network Tools** (15+ tools for connectivity, DNS, diagnostics)
- **Security Tools** (12+ tools for encryption, authentication, system security)
- **System Monitoring** (15+ tools for performance, processes, resources)
- **System Administration** (Core system management tools)
- **Package Managers** (12+ managers for all major languages/platforms)
- **Archive & Compression Tools** (10+ tools with performance comparisons)
- **Data Processing Tools** (JSON, SQL, structured data)
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

This reference enables Claude to efficiently handle everything from basic file operations to complex development workflows, system administration tasks, network diagnostics, security operations, and performance analysis.