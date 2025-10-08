## File & Directory Operations

### **ls** - List Directory Contents
<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: [dir, ll, ls-G]
tags: [#essential, #filesystem, #files]
related: [eza, tree, find, fd]
keywords: [list, directory, files, folders, contents, show, display, permissions, timestamps]
synonyms: [dir, ll, list, show files, directory listing]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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


### **eza** - Modern ls Replacement**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: [exa]
tags: [#modern-alternative, #filesystem, #files, #git]
related: [ls, tree, fd, find]
keywords: [list, directory, files, folders, modern, colors, git, icons, enhanced]
synonyms: [exa, ls-replacement, modern-ls, enhanced-listing]
platform: [macOS, Linux, Windows]
installation: brew install eza
-->
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


### **tree** - Directory Tree Display**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#essential, #filesystem, #files, #visualization]
related: [ls, eza, find, fd]
keywords: [tree, directory, structure, hierarchy, visualization, ascii, display, recursive]
synonyms: [dir-tree, folder-tree, directory-tree, file-hierarchy]
platform: [macOS, Linux, Windows]
installation: brew install tree
-->
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


### **find** - File Search**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#essential, #filesystem, #files, #search]
related: [fd, locate, grep, rg]
keywords: [find, search, locate, files, directories, recursive, criteria, filter]
synonyms: [search, locate, discover, file-search, directory-search]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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


### **fd** - Modern Find Alternative**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#modern-alternative, #filesystem, #files, #search, #performance]
related: [find, rg, locate, grep]
keywords: [find, search, fast, modern, regex, gitignore, parallel, performance]
synonyms: [find-alternative, fast-find, modern-find, parallel-search]
platform: [macOS, Linux, Windows]
installation: brew install fd
-->
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
<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #overview]
related: []
keywords: [grep, pattern searching]
synonyms: [grep]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **rg (ripgrep)** - Fast Text Search**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #overview]
related: []
keywords: [rg (ripgrep), fast text search]
synonyms: [rg-(ripgrep)]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **cp** - Copy Files and Directories
<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: [copy]
tags: [#essential, #filesystem, #files, #basic-operations]
related: [mv, rm, rsync, tar]
keywords: [copy, duplicate, backup, recursive, permissions, preserve, safety]
synonyms: [copy, duplicate, backup-files, file-copy]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Copy files and directories with various options for recursive copying, permissions, and safety
**Location**: `/bin/cp`
**Difficulty**: ⭐⭐ Beginner (Basic copying) / ⭐⭐⭐ Intermediate (Recursive & permissions)
**Common Use Cases**:

- Duplicate files and directories
- Backup operations
- File distribution and deployment

**See Also**: Related tools in this category

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


### **mv** - Move and Rename Files**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: [move, rename]
tags: [#essential, #filesystem, #files, #basic-operations]
related: [cp, rm, rename, find]
keywords: [move, rename, relocate, transfer, organize, restructure]
synonyms: [move, rename, relocate, transfer-files]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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

**See Also**: Related tools in this category

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


### **rm** - Remove Files and Directories**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐⭐ Advanced
aliases: [remove, delete]
tags: [#essential, #filesystem, #files, #basic-operations, #dangerous]
related: [rmdir, trash, find, shred]
keywords: [remove, delete, unlink, destroy, cleanup, recursive, force]
synonyms: [remove, delete, unlink, destroy-files, cleanup]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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

**See Also**: Related tools in this category

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


### **cat** - Display and Concatenate Files**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐ Beginner
aliases: [concatenate]
tags: [#essential, #filesystem, #files, #text-processing]
related: [bat, less, head, tail, more]
keywords: [cat, display, concatenate, view, print, output, combine, merge]
synonyms: [concatenate, display-file, view-file, print-file]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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


### **bat** - Enhanced Cat with Syntax Highlighting**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#modern-alternative, #filesystem, #files, #text-processing, #syntax-highlighting]
related: [cat, less, head, tail, more]
keywords: [bat, syntax-highlighting, git, paging, enhanced, modern, colors, cat-replacement]
synonyms: [enhanced-cat, modern-cat, syntax-cat, highlighted-cat]
platform: [macOS, Linux, Windows]
installation: brew install bat
-->
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
<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐ Beginner
aliases: [pager]
tags: [#essential, #filesystem, #files, #text-processing]
related: [more, bat, cat, head, tail]
keywords: [less, pager, view, scroll, navigate, search, terminal, text-viewer]
synonyms: [pager, text-viewer, file-viewer, scroll-viewer]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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
<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#essential, #filesystem, #files, #text-processing]
related: [less, bat, cat, head, tail]
keywords: [more, pager, view, screen, page, simple, basic, text-viewer]
synonyms: [simple-pager, basic-pager, screen-pager]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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


### **mkdir** - Create Directories**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐ Beginner
aliases: [make-directory]
tags: [#essential, #filesystem, #files, #basic-operations]
related: [rmdir, cp, mv, touch]
keywords: [mkdir, create, directory, folder, make, recursive, permissions]
synonyms: [make-directory, create-folder, make-folder]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Create directories with specified permissions
**Location**: `/bin/mkdir`
**Common Use Cases**:

- Directory structure creation
- Project setup
- File organization

**See Also**: Related tools in this category

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


### **mkfifo** - Create Named Pipes (FIFOs)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [mkfifo, create named pipes (fifos)]
synonyms: [mkfifo]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Create named pipes (FIFOs) for inter-process communication
**Location**: `/usr/bin/mkfifo`
**Common Use Cases**:

- Inter-process communication
- Data pipeline creation
- Process synchronization
- Streaming data between commands

**See Also**: Related tools in this category

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


### **rmdir** - Remove Empty Directories**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [rmdir, remove empty directories]
synonyms: [rmdir]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Remove empty directories safely
**Location**: `/bin/rmdir`
**Common Use Cases**:

- Clean up empty directories
- Safe directory removal
- Directory structure maintenance

**See Also**: Related tools in this category

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


### **ln** - Create Links**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐⭐ Advanced
aliases: [link, symlink]
tags: [#essential, #filesystem, #files, #advanced-operations]
related: [cp, mv, file, ls]
keywords: [link, symlink, hard-link, symbolic, reference, pointer, filesystem]
synonyms: [link, symlink, symbolic-link, hard-link, file-link]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Create hard and symbolic links between files
**Location**: `/bin/ln`
**Common Use Cases**:

- Create file shortcuts (symbolic links)
- Share files without duplication (hard links)
- Configuration management
- Path abstraction

**See Also**: Related tools in this category

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


### **touch** - Create/Update File Timestamps**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐ Beginner
aliases: [create-file]
tags: [#essential, #filesystem, #files, #basic-operations]
related: [mkdir, cat, echo, file]
keywords: [touch, create, timestamp, modify, access, time, empty-file]
synonyms: [create-file, update-timestamp, make-file, timestamp-update]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Create empty files or update file access and modification times
**Location**: `/usr/bin/touch`
**Common Use Cases**:

- Create empty files quickly
- Update file timestamps
- File existence testing
- Build system triggers

**See Also**: Related tools in this category

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


### **file** - Determine File Type**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: [filetype]
tags: [#essential, #filesystem, #security, #files, #identification]
related: [stat, ls, head, hexdump]
keywords: [file, type, identify, magic, format, mime, detection, analysis]
synonyms: [filetype, type-detection, identify-file, file-analysis]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Analyze files and determine their type and format
**Location**: `/usr/bin/file`
**Common Use Cases**:

- Identify unknown file types
- Verify file formats
- Security analysis
- Data recovery operations

**See Also**: Related tools in this category

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


### **stat** - File Statistics and Information**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: [file-stat, file-info]
tags: [#essential, #filesystem, #files, #information]
related: [ls, file, du, wc]
keywords: [stat, statistics, permissions, size, timestamps, inode, metadata]
synonyms: [file-stat, file-info, file-statistics, file-metadata]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Display detailed file and filesystem status information
**Location**: `/usr/bin/stat`
**Common Use Cases**:

- File permission analysis
- Timestamp examination
- Inode information
- File system debugging

**See Also**: Related tools in this category

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


### **basename/dirname** - Path Manipulation**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: File & Directory Operations
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [basename/dirname, path manipulation]
synonyms: [basename/dirname]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Extract filename or directory portions from file paths
**Location**: `/usr/bin/basename`, `/usr/bin/dirname`
**Common Use Cases**:

- Script path processing
- Filename extraction
- Directory navigation
- Build system automation

**See Also**: Related tools in this category

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

