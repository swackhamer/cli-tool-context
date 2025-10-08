## Utility Tools

### **xargs** - Execute Commands with Arguments**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [xargs, execute commands with argument]
synonyms: [xargs]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Build and execute command lines from standard input
**Location**: `/usr/bin/xargs`
**Common Use Cases**:

- Command construction from input
- Parallel execution
- Pipeline processing

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
echo "file1 file2" | xargs rm

# One argument per command
find . -name "*.tmp" | xargs -I {} rm {}

# Parallel execution
find . -name "*.log" | xargs -P 4 gzip
```


### **which** - Locate Commands**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [which, locate commands]
synonyms: [which]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Locate a command in PATH
**Location**: `/usr/bin/which`
**Common Use Cases**:

- Command location discovery
- PATH verification
- Script debugging

**See Also**: Related tools in this category

**Examples**:

```bash
# Find command location
which python3

# Find all matches
which -a python
```


### **units** - Unit Conversion Calculator
<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [units, unit conversion calculator]
synonyms: [units]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Interactive unit conversion between various measurement systems
**Location**: `/usr/bin/units`
**Difficulty**: ⭐⭐ Beginner (Easy to use with helpful prompts)
**Common Use Cases**:

- Scientific calculations
- Engineering conversions
- International unit conversions
- Educational purposes

**See Also**: Related tools in this category

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


### **chmod** - Change File Permissions**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [chmod, change file permissions]
synonyms: [chmod]
platform: [macOS, Linux]
installation: Built-in
-->
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

**See Also**: Related tools in this category

**Examples**:

```bash
# Make executable
chmod +x script.sh

# Set specific permissions
chmod 755 file

# Recursive change
chmod -R 644 directory/
```


### **env** - Environment Management**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [env, environment management]
synonyms: [env]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **date** - Date and Time Display**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [date, date and time display]
synonyms: [date]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **bc** - Basic Calculator**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [bc, basic calculator]
synonyms: [bc]
platform: [macOS, Linux]
installation: Built-in
-->
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
<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [dc, desk calculator (rpn)]
synonyms: [dc]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Reverse Polish Notation (RPN) calculator
**Location**: `/usr/bin/dc`
**Difficulty**: ⭐⭐⭐ Intermediate (RPN notation requires learning)
**Common Use Cases**:

- Stack-based calculations
- Scripting mathematical operations
- Precise arithmetic calculations
- Educational purposes for RPN

**See Also**: Related tools in this category

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


### **cal** - Calendar Display**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [cal, calendar display]
synonyms: [cal]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **yes** - Repeat Output**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [yes, repeat output]
synonyms: [yes]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **seq** - Sequence Generator**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [seq, sequence generator]
synonyms: [seq]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **realpath** - Absolute Path Resolution**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [realpath, absolute path resolution]
synonyms: [realpath]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **expr** - Expression Evaluation**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [expr, expression evaluation]
synonyms: [expr]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **apply** - Execute Commands with Arguments**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [apply, execute commands with argument]
synonyms: [apply]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Apply a command to a set of arguments
**Location**: `/usr/bin/apply`
**Common Use Cases**:

- Batch command execution
- Parameter substitution
- Script automation
- File processing workflows

**See Also**: Related tools in this category

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
<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [locale, locale information]
synonyms: [locale]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display and set locale information for internationalization
**Location**: `/usr/bin/locale`
**Difficulty**: ⭐⭐ Beginner (Simple information display)
**Common Use Cases**:

- Check current locale settings
- Debug internationalization issues
- Script environment configuration
- System administration

**See Also**: Related tools in this category

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
<!-- metadata:
category: Utility Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [iconv, character set conversion]
synonyms: [iconv]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Convert text between different character encodings
**Location**: `/usr/bin/iconv`
**Difficulty**: ⭐⭐⭐ Intermediate (Requires understanding of character encodings)
**Common Use Cases**:

- Convert file encodings
- Text data migration
- Web content processing
- Legacy system integration

**See Also**: Related tools in this category

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

