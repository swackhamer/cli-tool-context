## Text Processing & Manipulation

### **sed** - Stream Editor
<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: [stream-editor]
tags: [#essential, #text-processing, #data, #scripting]
related: [awk, tr, grep, perl, sd]
keywords: [sed, stream, edit, replace, substitute, transform, regex, pattern]
synonyms: [stream-editor, text-transform, pattern-replace, regex-replace]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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
<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [sd, intuitive find & replace]
synonyms: [sd]
platform: [macOS, Linux]
installation: Built-in
-->
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
<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: [gawk, nawk, mawk]
tags: [#essential, #text-processing, #data, #scripting, #programming]
related: [sed, cut, grep, sort, perl]
keywords: [awk, pattern, processing, language, fields, columns, programming, analysis]
synonyms: [gawk, nawk, pattern-processor, field-processor, text-analyzer]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
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


### **cut** - Extract Fields**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: [extract, field-extract]
tags: [#essential, #text-processing, #data, #extraction]
related: [awk, sort, uniq, paste, column]
keywords: [cut, extract, fields, columns, delimiter, range, characters, select]
synonyms: [extract, field-extract, column-extract, select-fields]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Extract specific columns or character ranges from text
**Location**: `/usr/bin/cut`
**Common Use Cases**:

- Extract specific fields from delimited data
- Process CSV files
- Character-based text extraction

**See Also**: Related tools in this category

**Examples**:

```bash
# Extract characters 1-10
cut -c 1-10 file.txt

# Extract fields using delimiter
cut -d',' -f 1,3 file.csv

# Extract from character position to end
cut -c 5- file.txt
```


### **choose** - Human-Friendly cut**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#modern-alternative, #text-processing, #rust, #extraction]
related: [cut, awk, grep]
keywords: [choose, cut alternative, extract, fields, columns, intuitive]
synonyms: [human-cut, friendly-cut, modern-cut]
platform: [macOS, Linux, Windows]
installation: cargo install choose
-->
**Description**: More intuitive alternative to cut for extracting columns (Rust-based)
**Location**: Install via cargo
**Common Use Cases**:

- Extract columns from text with simpler syntax
- Negative indexing for selecting from end
- Better handling of variable whitespace
- Range selection with modern syntax

**Why Better than cut**:
- More intuitive syntax (no confusing flags)
- Negative indexing support (e.g., -1 for last column)
- Better handling of variable whitespace
- Simpler range selection
- More forgiving and predictable behavior

**Examples**:

```bash
# Extract first column (0-indexed)
echo "one two three" | choose 0

# Extract last column
echo "one two three" | choose -1

# Extract multiple columns
echo "one two three four" | choose 0 2

# Extract range
echo "one two three four five" | choose 1:3

# Extract from column to end
echo "one two three four" | choose 1:

# Handle variable whitespace automatically
echo "one    two     three" | choose 1
```

**Installation**:
```bash
cargo install choose
```

**See Also**: `cut` (traditional), `awk` (more powerful), `sd` (text replacement)


### **sort** - Sort Text Lines**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#essential, #text-processing, #data, #sorting]
related: [uniq, cut, awk, comm, join]
keywords: [sort, order, arrange, alphabetical, numeric, reverse, unique, merge]
synonyms: [order, arrange, alphabetize, organize-lines]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Sort lines of text files with various options
**Location**: `/usr/bin/sort`
**Common Use Cases**:

- Data organization and deduplication
- Preparing data for further processing
- Numerical and alphabetical sorting

**See Also**: Related tools in this category

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


### **uniq** - Filter Unique Lines**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: [unique]
tags: [#essential, #text-processing, #data, #filtering]
related: [sort, cut, awk, comm, wc]
keywords: [uniq, unique, duplicate, repeated, filter, count, distinct, deduplicate]
synonyms: [unique, deduplicate, filter-duplicates, distinct-lines]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Report or filter out repeated lines
**Location**: `/usr/bin/uniq`
**Common Use Cases**:

- Remove duplicate lines
- Count occurrences
- Data deduplication

**See Also**: Related tools in this category

**Examples**:

```bash
# Remove duplicates (requires sorted input)
sort file.txt | uniq

# Count occurrences
sort file.txt | uniq -c

# Show only unique lines
sort file.txt | uniq -u
```


### **wc** - Word, Line, Character Count**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [wc, word, line, character count]
synonyms: [wc]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Count lines, words, and characters in files
**Location**: `/usr/bin/wc`
**Common Use Cases**:

- Text analysis and statistics
- File size estimation
- Data quantification

**See Also**: Related tools in this category

**Examples**:

```bash
# Count lines
wc -l file.txt

# Count words
wc -w file.txt

# Count characters
wc -c file.txt
```

### **cw** - Colorful wc**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#modern-alternative, #text-processing, #rust, #statistics]
related: [wc, cat, bat]
keywords: [cw, colorful wc, word count, line count, colored output]
synonyms: [colorful-wc, modern-wc, enhanced-wc]
platform: [macOS, Linux, Windows]
installation: cargo install cw
-->
**Description**: Colorful and enhanced word count with better Unicode support (Rust-based)
**Location**: Install via cargo
**Common Use Cases**:

- Text statistics with visual output
- Better Unicode character counting
- Enhanced file analysis
- Faster processing of large files

**Why Better than wc**:
- Colored output for better readability
- Better Unicode character handling
- More format options
- Faster on large files
- More intuitive display

**Examples**:

```bash
# Basic count with colors
cw file.txt

# Count lines only
cw -l file.txt

# Count words
cw -w file.txt

# Count characters
cw -c file.txt

# Multiple files with totals
cw file1.txt file2.txt file3.txt
```

**Installation**:
```bash
cargo install cw
```

**See Also**: `wc` (traditional), `bat` (colorful cat), `choose` (modern cut)

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


<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [wc, word, line, character count]
synonyms: [wc]
platform: [macOS, Linux]
installation: Built-in
-->
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

### **tr** - Translate Characters**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [tr, translate characters]
synonyms: [tr]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Translate or delete characters from standard input
**Location**: `/usr/bin/tr`
**Common Use Cases**:

- Character set conversion and translation
- Case conversion operations
- Character deletion and replacement
- Data sanitization and cleaning

**See Also**: Related tools in this category

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


### **expand** - Convert Tabs to Spaces**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [expand, convert tabs to spaces]
synonyms: [expand]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Convert tabs to spaces in text files
**Location**: `/usr/bin/expand`
**Common Use Cases**:

- Code formatting standardization
- Tab-to-space conversion
- Text file processing
- Whitespace normalization

**See Also**: Related tools in this category

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

### **unexpand** - Convert Spaces to Tabs**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [unexpand, convert spaces to tabs]
synonyms: [unexpand]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Convert spaces to tabs in text files
**Location**: `/usr/bin/unexpand`
**Common Use Cases**:

- Code compression and consistency
- Space-to-tab conversion
- File size reduction
- Editor configuration matching

**See Also**: Related tools in this category

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


### **comm** - Compare Sorted Files**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [comm, compare sorted files]
synonyms: [comm]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Select or reject lines common to two sorted files
**Location**: `/usr/bin/comm`
**Common Use Cases**:

- File comparison and difference analysis
- Set operations on sorted data
- Finding unique and common elements
- Data deduplication across files

**See Also**: Related tools in this category

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


### **join** - Join Lines from Files**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [join, join lines from files]
synonyms: [join]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Relational database-style join operation on sorted files
**Location**: `/usr/bin/join`
**Common Use Cases**:

- Database-style joins on text files
- Combining related data from multiple sources
- Data merging and correlation
- Creating reports from normalized data

**See Also**: Related tools in this category

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


### **paste** - Merge Lines**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [paste, merge lines]
synonyms: [paste]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Merge corresponding or subsequent lines of files
**Location**: `/usr/bin/paste`
**Common Use Cases**:

- Combining columns from multiple files
- Creating tabular data from separate sources
- Parallel processing of multiple data streams
- Building CSV-like formats

**See Also**: Related tools in this category

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


### **column** - Format in Columns**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [column, format in columns]
synonyms: [column]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Columnate lists and format data in aligned columns
**Location**: `/opt/homebrew/opt/util-linux/bin/column`
**Common Use Cases**:

- Formatting tabular data for display
- Aligning text in columns
- Creating readable reports from delimited data
- Pretty-printing structured text

**See Also**: Related tools in this category

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


### **expand/unexpand** - Tabs and Spaces**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [expand/unexpand, tabs and spaces]
synonyms: [expand/unexpand]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Convert tabs to spaces (expand) and spaces to tabs (unexpand)
**Location**: `/usr/bin/expand`, `/usr/bin/unexpand`
**Common Use Cases**:

- Code formatting and standardization
- Preparing files for processing
- Converting between tab and space indentation
- File format normalization

**See Also**: Related tools in this category

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

### **fold** - Wrap Lines**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [fold, wrap lines]
synonyms: [fold]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Wrap long lines to fit specified width
**Location**: `/usr/bin/fold`
**Common Use Cases**:

- Text formatting for display or printing
- Preparing text for fixed-width displays
- Email and document formatting
- Breaking long lines for readability

**See Also**: Related tools in this category

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


### **fmt** - Format Text**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [fmt, format text]
synonyms: [fmt]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Simple text formatter with word wrapping and paragraph formatting
**Location**: `/usr/bin/fmt`
**Common Use Cases**:

- Text formatting and reflowing
- Paragraph reformatting
- Preparing text for publication
- Standardizing text layout

**See Also**: Related tools in this category

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


### **nl** - Number Lines**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [nl, number lines]
synonyms: [nl]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Number lines in files with configurable formatting
**Location**: `/usr/bin/nl`
**Common Use Cases**:

- Adding line numbers to files
- Code listing preparation
- Document formatting
- Creating numbered references

**See Also**: Related tools in this category

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


### **rev** - Reverse Lines**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [rev, reverse lines]
synonyms: [rev]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Reverse the order of characters in each line
**Location**: `/opt/homebrew/opt/util-linux/bin/rev`
**Common Use Cases**:

- Text manipulation and transformation
- Creating puzzles or encoded text
- Data processing and analysis
- String reversal operations

**See Also**: Related tools in this category

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


### **split** - Split Files**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [split, split files]
synonyms: [split]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Split large files into smaller pieces
**Location**: `/usr/bin/split`
**Common Use Cases**:

- Breaking large files for processing
- Creating manageable file sizes
- Preparing files for transfer or storage
- Parallel processing preparation

**See Also**: Related tools in this category

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


### **csplit** - Context Split**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [csplit, context split]
synonyms: [csplit]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Split files based on context patterns
**Location**: `/usr/bin/csplit`
**Common Use Cases**:

- Splitting files by content patterns
- Extracting sections from structured documents
- Processing multi-part files
- Separating data by markers or delimiters

**See Also**: Related tools in this category

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


<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [csplit, context split]
synonyms: [csplit]
platform: [macOS, Linux]
installation: Built-in
-->
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

### **pr** - Print Formatting**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [pr, print formatting]
synonyms: [pr]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **tee** - Split Output**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [tee, split output]
synonyms: [tee]
platform: [macOS, Linux]
installation: Built-in
-->
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

```


### **od** - Octal Dump**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Text Processing & Manipulation
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [od, octal dump]
synonyms: [od]
platform: [macOS, Linux]
installation: Built-in
-->
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

