## macOS-Specific Tools

### **pbcopy** - Pasteboard Copy**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [pbcopy, pasteboard copy]
synonyms: [pbcopy]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **pbpaste** - Pasteboard Paste**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [pbpaste, pasteboard paste]
synonyms: [pbpaste]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **open** - Open Files and Applications**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [open, open files and applications]
synonyms: [open]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **say** - Text to Speech**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [say, text to speech]
synonyms: [say]
platform: [macOS, Linux]
installation: Built-in
-->
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
<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [plutil, property list utility]
synonyms: [plutil]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Convert and manipulate property list files (plist)
**Location**: `/usr/bin/plutil`
**Difficulty**: ⭐⭐⭐ Intermediate (Requires plist knowledge)
**Common Use Cases**:

- macOS configuration management
- Application preference editing
- System settings modification
- Development and debugging

**See Also**: Related tools in this category

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
<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [sw_vers, software version information]
synonyms: [sw_vers]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display macOS version and build information
**Location**: `/usr/bin/sw_vers`
**Difficulty**: ⭐ Beginner (Simple information display)
**Common Use Cases**:

- System information gathering
- Script environment detection
- Compatibility checking
- System administration

**See Also**: Related tools in this category

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
<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [system_profiler, system information]
synonyms: [system_profiler]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Generate detailed system configuration reports
**Location**: `/usr/sbin/system_profiler`
**Difficulty**: ⭐⭐ Beginner (Many options but straightforward)
**Common Use Cases**:

- Hardware inventory
- System diagnostics
- Configuration documentation
- Technical support

**See Also**: Related tools in this category

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


### **caffeinate** - Prevent Sleep**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [caffeinate, prevent sleep]
synonyms: [caffeinate]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **diskutil** - Disk Utility**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [diskutil, disk utility]
synonyms: [diskutil]
platform: [macOS, Linux]
installation: Built-in
-->
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
<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [banner, text banner generator]
synonyms: [banner]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Create large text banners using ASCII characters
**Location**: `/usr/bin/banner`
**Difficulty**: ⭐ Beginner (Simple text formatting tool)
**Common Use Cases**:

- Script headers and separators
- Terminal output formatting
- System notifications
- Log file section markers

**See Also**: Related tools in this category

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

