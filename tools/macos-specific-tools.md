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


### **mdfind** - Spotlight Search**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#search, #spotlight, #file-search, #macos]
related: [find, fd, locate, grep]
keywords: [mdfind, spotlight, search, metadata, find files, macos search]
synonyms: [spotlight-search, metadata-find]
platform: [macOS]
installation: Built-in
-->
**Description**: Command-line interface to macOS Spotlight search - powerful file and metadata searching
**Location**: `/usr/bin/mdfind`
**Common Use Cases**:

- Fast file searching using Spotlight index
- Search by file content, metadata, or attributes
- Find files by kind, author, or other properties
- Much faster than find for indexed locations
- Complex metadata queries

**Why Better than find**:
- Uses Spotlight index (much faster)
- Searches file contents and metadata
- Natural language-like queries
- Instant results for indexed files
- Can search by file attributes (kind, author, etc.)

**See Also**: `find` (traditional file search), `fd` (modern alternative), `locate` (indexed search)

**Examples**:

```bash
# Basic file search
mdfind "presentation"                    # Find files containing "presentation"
mdfind "kMDItemDisplayName == 'README.md'"  # Find exact filename

# Search by file type/kind
mdfind "kind:pdf"                        # Find all PDF files
mdfind "kind:image"                      # Find all images
mdfind "kind:audio"                      # Find all audio files
mdfind "kind:document"                   # Find all documents
mdfind "kind:presentation"               # Find all presentations
mdfind "kind:email"                      # Find email messages

# Search by metadata
mdfind "author:john"                     # Files by author
mdfind "from:alice@example.com"          # Emails from sender
mdfind "kMDItemAuthors == 'John Doe'"    # Exact author match

# Content and metadata combined
mdfind "kind:pdf author:smith"           # PDFs by Smith
mdfind "kind:image date:today"           # Images from today

# Date-based searches
mdfind "date:today"                      # Modified today
mdfind "date:yesterday"                  # Modified yesterday
mdfind "date:this week"                  # Modified this week
mdfind "kMDItemFSContentChangeDate >= \$time.today(-7)"  # Last 7 days

# Search in specific directory
mdfind -onlyin ~/Documents "proposal"    # Search only in Documents
mdfind -onlyin /Users "kind:pdf"         # Search in all user folders

# Live updates (wait for new results)
mdfind -live "kind:pdf"                  # Update as new PDFs are created

# Count results
mdfind -count "kind:image"               # Just show count, not files

# Get file attributes
mdfind "README" | head -5                # First 5 results
mdls file.pdf                            # Show metadata attributes

# Complex queries
mdfind "kind:pdf AND author:john AND date:this month"
mdfind "(kind:image OR kind:pdf) AND date:today"

# Case-sensitive search
mdfind "kMDItemDisplayName == 'README.md'c"  # Case-sensitive

# Combine with other tools
mdfind "kind:pdf" | wc -l                # Count PDFs
mdfind "kind:image" | xargs -I {} cp {} ~/backup/  # Backup images
mdfind "date:today" | while read f; do echo "Modified: $f"; done

# Search for files NOT backed up to Time Machine
mdfind "com_apple_backup_excludeItem = '*'"

# Find large files
mdfind "kMDItemFSSize > 1000000000"      # Files > 1GB

# Common use cases
mdfind -name config.json                 # Find by filename
mdfind -name "*.py" -onlyin ~/projects   # Find Python files in projects
mdfind "todo" -onlyin ~/Documents        # Find todos in Documents

# Get help on available attributes
mdimport -A                              # List all attributes
```

**Common Metadata Attributes**:
- `kMDItemDisplayName` - File name
- `kMDItemFSSize` - File size in bytes
- `kMDItemContentType` - File type
- `kMDItemContentCreationDate` - Creation date
- `kMDItemFSContentChangeDate` - Modification date
- `kMDItemAuthors` - Authors
- `kMDItemTitle` - Title
- `kMDItemKeywords` - Keywords


### **defaults** - macOS Preferences System**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#system, #configuration, #preferences, #macos, #customization]
related: [plutil, scutil, pmset]
keywords: [defaults, preferences, plist, settings, configuration, macos customize]
synonyms: [preferences, user-defaults, system-settings]
platform: [macOS]
installation: Built-in
-->
**Description**: Read, write, and delete macOS user preferences and system settings
**Location**: `/usr/bin/defaults`
**Common Use Cases**:

- Customize macOS system behavior
- Configure application settings
- Automate system configuration
- Backup and restore preferences
- Enable hidden features

**See Also**: `plutil` (plist manipulation), `scutil` (system configuration)

**Examples**:

```bash
# Read preferences
defaults read                                    # Read all defaults
defaults read com.apple.finder                   # Read Finder preferences
defaults read NSGlobalDomain                     # Read global preferences

# Write/change preferences
defaults write com.apple.finder AppleShowAllFiles YES    # Show hidden files
defaults write com.apple.dock autohide -bool true        # Auto-hide Dock
defaults write NSGlobalDomain AppleShowScrollBars -string "Always"  # Show scrollbars

# Delete preferences
defaults delete com.apple.finder AppleShowAllFiles       # Reset to default
defaults delete com.apple.dock                           # Reset Dock to defaults

# Common Finder customizations
defaults write com.apple.finder ShowPathbar -bool true   # Show path bar
defaults write com.apple.finder ShowStatusBar -bool true # Show status bar
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false  # Disable extension warning
defaults write com.apple.finder _FXShowPosixPathInTitle -bool true  # Show full path in title
defaults write com.apple.finder NewWindowTarget -string "PfHm"      # New window opens home

# Dock customizations
defaults write com.apple.dock tilesize -int 36           # Dock icon size
defaults write com.apple.dock autohide-delay -float 0    # No autohide delay
defaults write com.apple.dock show-recents -bool false   # Hide recent apps
defaults write com.apple.dock mineffect -string "scale"  # Minimize effect

# Screenshot customizations
defaults write com.apple.screencapture location ~/Desktop/Screenshots  # Screenshot location
defaults write com.apple.screencapture type -string "png"             # Screenshot format
defaults write com.apple.screencapture disable-shadow -bool true      # No window shadows

# Global/System-wide settings
defaults write NSGlobalDomain AppleKeyboardUIMode -int 3              # Full keyboard access
defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool false    # Disable press-and-hold
defaults write NSGlobalDomain KeyRepeat -int 2                        # Fast key repeat
defaults write NSGlobalDomain InitialKeyRepeat -int 15                # Short delay before repeat

# Safari customizations
defaults write com.apple.Safari IncludeInternalDebugMenu -bool true  # Enable debug menu
defaults write com.apple.Safari ShowFullURLInSmartSearchField -bool true  # Show full URL

# Export and import
defaults export com.apple.finder ~/finder-prefs.plist    # Export preferences
defaults import com.apple.finder ~/finder-prefs.plist    # Import preferences

# Backup all user preferences
defaults read > ~/all-defaults-backup.txt                # Backup to text file

# Find preference domain for an app
defaults domains | tr ',' '\n' | grep -i safari          # Find Safari domains

# Check current value
defaults read com.apple.finder AppleShowAllFiles         # Check specific setting

# Use with specific types
defaults write com.example.app setting -string "value"   # String
defaults write com.example.app setting -int 42           # Integer
defaults write com.example.app setting -float 3.14       # Float
defaults write com.example.app setting -bool true        # Boolean
defaults write com.example.app setting -array item1 item2  # Array

# After changing defaults, restart the app
killall Finder                                           # Restart Finder
killall Dock                                             # Restart Dock
killall SystemUIServer                                   # Restart system UI

# Common useful defaults
# Show Library folder
chflags nohidden ~/Library

# Disable the "Are you sure you want to open this application?" dialog
defaults write com.apple.LaunchServices LSQuarantine -bool false

# Disable auto-correct
defaults write NSGlobalDomain NSAutomaticSpellingCorrectionEnabled -bool false

# Require password immediately after sleep
defaults write com.apple.screensaver askForPassword -int 1
defaults write com.apple.screensaver askForPasswordDelay -int 0

# Disable smart quotes and dashes
defaults write NSGlobalDomain NSAutomaticQuoteSubstitutionEnabled -bool false
defaults write NSGlobalDomain NSAutomaticDashSubstitutionEnabled -bool false
```

**Important Notes**:
- Always backup before modifying system preferences
- Some changes require app restart or logout
- Use `killall` to restart affected applications
- Check Apple's documentation for valid preference keys


### **launchctl** - Service Management**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#system, #services, #daemons, #agents, #macos, #launchd]
related: [systemctl, service]
keywords: [launchctl, launchd, services, daemons, agents, background processes, startup]
synonyms: [service-manager, daemon-manager, launchd-control]
platform: [macOS]
installation: Built-in
-->
**Description**: Interface to launchd for managing system and user services (daemons and agents)
**Location**: `/bin/launchctl`
**Common Use Cases**:

- Start/stop background services
- Manage startup items
- Load/unload launch agents and daemons
- Debug service issues
- Schedule recurring tasks

**See Also**: `systemctl` (Linux equivalent), `cron` (scheduled tasks)

**Examples**:

```bash
# List all loaded services
launchctl list                               # All services
launchctl list | grep -i apple               # Apple services only
launchctl list | grep -v "apple\|com\.apple" # Third-party services

# Get service status
launchctl list com.apple.Dock               # Specific service
launchctl print system/com.apple.Dock        # Detailed info

# Load/unload services
launchctl load ~/Library/LaunchAgents/com.example.app.plist    # Load user agent
launchctl unload ~/Library/LaunchAgents/com.example.app.plist  # Unload user agent
sudo launchctl load /Library/LaunchDaemons/com.example.daemon.plist  # Load system daemon

# Start/stop services
launchctl start com.example.service         # Start service
launchctl stop com.example.service          # Stop service
launchctl kickstart system/com.example.service  # Restart service

# Disable/enable services
launchctl disable system/com.example.service  # Disable at boot
launchctl enable system/com.example.service   # Enable at boot

# Bootstrap/bootout (modern macOS)
launchctl bootstrap gui/501 ~/Library/LaunchAgents/com.example.plist  # Load for user
launchctl bootout gui/501/com.example.service  # Unload service

# Service domains
launchctl print gui/501                      # User domain (501 is UID)
launchctl print system                       # System domain
launchctl print user/501                     # Per-user domain

# Check if service is running
launchctl list | grep com.example.service

# View service configuration
launchctl print gui/501/com.example.service

# Restart a service
launchctl kickstart -k gui/501/com.apple.Dock  # Kill and restart Dock

# Remove service from memory
launchctl remove com.example.service

# Common system services
launchctl list com.apple.Dock                # Dock
launchctl list com.apple.Finder              # Finder
launchctl list com.apple.mDNSResponder       # Bonjour/network discovery

# Debug service issues
launchctl error                              # Show error codes
launchctl dumpstate                          # Dump launchd state

# Environment variables
launchctl setenv VAR_NAME value              # Set environment variable
launchctl unsetenv VAR_NAME                  # Remove environment variable
launchctl getenv VAR_NAME                    # Get environment variable

# User services vs system services
# User: ~/Library/LaunchAgents/              (runs as user)
# Global: /Library/LaunchAgents/             (runs as user, all users)
# System: /Library/LaunchDaemons/            (runs as root)
# Apple User: /System/Library/LaunchAgents/
# Apple System: /System/Library/LaunchDaemons/

# Create a simple launch agent example
cat > ~/Library/LaunchAgents/com.example.hello.plist <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.example.hello</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/say</string>
        <string>Hello World</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer>
</dict>
</plist>
EOF

# Load and start the agent
launchctl load ~/Library/LaunchAgents/com.example.hello.plist

# Useful for development
launchctl list | grep -v "^-" | awk '{print $3}' | sort  # List all service names
```

**Common Scenarios**:
```bash
# Restart a stuck service
launchctl kickstart -k gui/$(id -u)/com.apple.Dock

# Disable a service temporarily
launchctl unload -w ~/Library/LaunchAgents/com.example.service.plist

# Enable a service
launchctl load -w ~/Library/LaunchAgents/com.example.service.plist

# Remove all user-installed agents (careful!)
ls ~/Library/LaunchAgents/*.plist | xargs -I {} launchctl unload {}
```


### **hdiutil** - Disk Image Utility**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#disk, #image, #dmg, #storage, #macos]
related: [diskutil, dd]
keywords: [hdiutil, disk image, dmg, iso, create disk image, mount, convert]
synonyms: [disk-image-utility, dmg-tool]
platform: [macOS]
installation: Built-in
-->
**Description**: Create, manipulate, and mount disk images (.dmg, .iso, etc.)
**Location**: `/usr/bin/hdiutil`
**Common Use Cases**:

- Create disk images for software distribution
- Mount/unmount disk images
- Convert between image formats
- Verify disk images
- Create encrypted disk images

**See Also**: `diskutil` (disk management), `dd` (disk/image copying)

**Examples**:

```bash
# Create disk image from folder
hdiutil create -volname "MyApp" -srcfolder ./myapp -format UDZO myapp.dmg
hdiutil create -volname "Backup" -srcfolder ~/Documents -format UDZO backup.dmg

# Create empty disk image
hdiutil create -size 100m -volname "Storage" -format UDZO empty.dmg
hdiutil create -size 1g -volname "Data" -fs HFS+ data.dmg

# Mount disk image
hdiutil attach myapp.dmg                    # Mount read-only
hdiutil attach myapp.dmg -mountpoint /tmp/mount  # Specific mount point
hdiutil attach myapp.dmg -noverify          # Skip verification

# Unmount/detach disk image
hdiutil detach /Volumes/MyApp               # Unmount by mount point
hdiutil detach /dev/disk2                   # Unmount by device

# Force unmount
hdiutil detach /Volumes/MyApp -force

# Convert image formats
hdiutil convert input.dmg -format UDZO -o output.dmg  # Compressed (default)
hdiutil convert input.dmg -format UDRO -o output.dmg  # Read-only
hdiutil convert input.dmg -format UDRW -o output.dmg  # Read-write
hdiutil convert input.dmg -format UDTO -o output.iso  # DVD/CD master
hdiutil convert input.dmg -format UDSP -o output.dmg  # Sparse image

# Create compressed image
hdiutil create -srcfolder ./app -format UDZO -imagekey zlib-level=9 app.dmg  # Max compression

# Verify disk image
hdiutil verify myapp.dmg                    # Check integrity
hdiutil imageinfo myapp.dmg                 # Show image information

# Create encrypted disk image
hdiutil create -encryption -size 100m -volname "Secure" -fs HFS+ secure.dmg
hdiutil create -encryption AES-256 -size 500m -volname "Secret" secret.dmg

# Resize disk image
hdiutil resize -size 200m image.dmg         # Resize to 200MB
hdiutil resize -limits image.dmg            # Show min/max/current size

# Burn disk image to CD/DVD
hdiutil burn image.dmg                      # Interactive burn
hdiutil burn -noverifyburn -noeject image.dmg  # Fast burn

# Create hybrid ISO (macOS + Windows)
hdiutil makehybrid -o output.iso -iso -joliet folder/

# Compact sparse images
hdiutil compact sparse_image.sparseimage

# Image from device
hdiutil create -srcdevice /dev/disk2 -format UDZO backup.dmg

# List mounted images
hdiutil info                                # Show all mounted images
hdiutil info | grep "image-path"            # Show image paths only

# Create bootable installer (example)
hdiutil create -size 8g -fs HFS+ -volname "Installer" installer.dmg
hdiutil attach installer.dmg -mountpoint /Volumes/Installer

# Segment large images
hdiutil create -size 2g -segmentSize 700m -format UDZO large.dmg  # Create segments

# Common use case: Software distribution
# 1. Create folder with app
mkdir MyApp_Installer
cp -r MyApp.app MyApp_Installer/
cp README.txt MyApp_Installer/

# 2. Create compressed DMG
hdiutil create -volname "MyApp 1.0" -srcfolder MyApp_Installer -format UDZO MyApp-1.0.dmg

# 3. Make it internet-enabled (flattens on download)
hdiutil internet-enable -yes MyApp-1.0.dmg

# Checksum disk image
hdiutil checksum -type SHA256 myapp.dmg     # SHA256 checksum
hdiutil checksum -type MD5 myapp.dmg        # MD5 checksum

# Create from ISO
hdiutil convert input.iso -format UDRW -o output.dmg
```

**Image Format Types**:
- **UDZO** - Compressed (zlib), read-only (most common for distribution)
- **UDRO** - Read-only, uncompressed
- **UDRW** - Read-write
- **UDSP** - Sparse image (grows as needed)
- **UDTO** - DVD/CD master
- **UDCO** - ADC compressed


### **osascript** - AppleScript Executor**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#automation, #scripting, #applescript, #macos, #gui]
related: [automator, defaults]
keywords: [osascript, applescript, automation, execute script, macos automation, javascript]
synonyms: [applescript-runner, script-executor]
platform: [macOS]
installation: Built-in
-->
**Description**: Execute AppleScript and JavaScript for Automation (JXA) from the command line
**Location**: `/usr/bin/osascript`
**Common Use Cases**:

- GUI automation
- Application control
- System notifications
- Dialog boxes and user input
- Cross-application workflows

**See Also**: `automator` (visual automation), `defaults` (preferences)

**Examples**:

```bash
# Execute inline AppleScript
osascript -e 'display notification "Hello World" with title "Greeting"'
osascript -e 'tell application "Safari" to activate'
osascript -e 'tell application "iTunes" to play'

# Display dialog
osascript -e 'display dialog "Continue?" buttons {"No", "Yes"} default button "Yes"'
osascript -e 'display alert "Warning" message "This is important"'

# Get user input
osascript -e 'text returned of (display dialog "Enter your name:" default answer "")'

# Choose from list
osascript -e 'choose from list {"Option 1", "Option 2", "Option 3"}'

# Choose file/folder
osascript -e 'POSIX path of (choose file)'
osascript -e 'POSIX path of (choose folder)'

# System sounds
osascript -e 'beep 3'                      # Beep 3 times

# Application control
osascript -e 'tell application "Safari" to make new document'
osascript -e 'tell application "TextEdit" to quit'
osascript -e 'tell application "Finder" to empty trash'

# Execute script file
osascript script.scpt                      # Run .scpt file
osascript script.applescript               # Run .applescript file

# JavaScript for Automation (JXA)
osascript -l JavaScript -e 'Application("Safari").activate()'
osascript -l JavaScript -e 'app = Application.currentApplication(); app.displayNotification("Done")'

# Get application info
osascript -e 'tell application "System Events" to get name of every process'

# Control System Preferences
osascript -e 'tell application "System Preferences" to activate'
osascript -e 'tell application "System Preferences" to reveal pane "com.apple.preference.dock"'

# Volume control
osascript -e 'set volume output volume 50'
osascript -e 'set volume output muted true'

# Brightness (if supported)
osascript -e 'tell application "System Events" to key code 144'  # Brightness up

# Multi-line scripts
osascript <<EOF
tell application "Finder"
    activate
    make new Finder window
    set target of front window to home
end tell
EOF

# Get clipboard
osascript -e 'the clipboard'
osascript -e 'the clipboard as text'

# Set clipboard
osascript -e 'set the clipboard to "Hello"'

# Open URL
osascript -e 'open location "https://www.apple.com"'

# Get file info
osascript -e 'tell application "Finder" to get size of (choose file)'

# iTunes/Music control
osascript -e 'tell application "Music" to play'
osascript -e 'tell application "Music" to pause'
osascript -e 'tell application "Music" to next track'

# Screenshot with dialog
osascript -e 'do shell script "screencapture -i ~/Desktop/screenshot.png"'

# Send email (Mail.app)
osascript <<EOF
tell application "Mail"
    set newMessage to make new outgoing message with properties {subject:"Test", content:"Hello", visible:true}
    tell newMessage
        make new to recipient with properties {email address:"test@example.com"}
    end tell
end tell
EOF

# Progress indicator
osascript -e 'tell application "System Events" to display dialog "Processing..." giving up after 2'

# Get Wi-Fi status
osascript -e 'tell application "System Events" to tell process "SystemUIServer" to first menu item of menu bar 1 whose description is "Wi-Fi"'

# Useful for scripts
# Exit with dialog result
result=$(osascript -e 'button returned of (display dialog "Continue?" buttons {"No", "Yes"})')
if [ "$result" = "Yes" ]; then
    echo "User chose Yes"
fi

# Create notification after long task
./long_running_script.sh && osascript -e 'display notification "Task complete!" with title "Script Finished"'

# Error handling
osascript -e 'try' -e 'tell application "NonExistent" to activate' -e 'on error errMsg' -e 'display alert errMsg' -e 'end try'
```


### **screencapture** - Screenshot Utility**Difficulty**: ⭐⭐ Beginner

<!-- metadata:
category: macOS-Specific Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#screenshot, #image, #capture, #macos, #screen]
related: [sips, imagemagick]
keywords: [screencapture, screenshot, screen capture, image, grab, macos screenshot]
synonyms: [screenshot, screen-grab, capture-screen]
platform: [macOS]
installation: Built-in
-->
**Description**: Capture screenshots from the command line
**Location**: `/usr/sbin/screencapture`
**Common Use Cases**:

- Automated screenshot capture
- Scripted screen recording
- Documentation generation
- Testing and QA
- Screen monitoring

**See Also**: `sips` (image processing), `defaults` (screenshot preferences)

**Examples**:

```bash
# Basic screenshot
screencapture screenshot.png                # Entire screen
screencapture -x screenshot.png             # No camera sound

# Interactive selection
screencapture -i screenshot.png             # Select area or window
screencapture -iW screenshot.png            # Select window only
screencapture -io screenshot.png            # Select window, no shadow

# Capture specific display
screencapture -D 1 display1.png             # Main display
screencapture -D 2 display2.png             # Second display

# Timed capture
screencapture -T 5 delayed.png              # 5 second delay
screencapture -T 10 -i delayed.png          # 10 second delay, then interactive

# Capture to clipboard
screencapture -c                            # Entire screen to clipboard
screencapture -ic                           # Interactive to clipboard

# Window capture
screencapture -l $(osascript -e 'tell app "Safari" to id of window 1') safari.png

# No window shadow
screencapture -io noshadow.png              # Interactive, no shadow
screencapture -o selected.png               # Selected window, no shadow

# Specific formats
screencapture -t jpg screenshot.jpg         # JPEG format
screencapture -t pdf screenshot.pdf         # PDF format
screencapture -t tiff screenshot.tiff       # TIFF format

# Capture with mouse cursor
screencapture -C screenshot.png             # Include cursor

# Multiple displays
screencapture -x all_displays.png           # All displays in one image

# Bounded region
screencapture -R 0,0,800,600 region.png     # x,y,width,height

# Silent mode (no sound)
screencapture -x silent.png

# Open in Preview immediately
screencapture -P screenshot.png             # Capture and open

# Send to Mail
screencapture -M screenshot.png             # Capture and email

# Capture specific app window
# Get window ID first
osascript -e 'tell application "System Events" to tell process "Safari" to get id of window 1'
# Then capture
screencapture -l <window_id> window.png

# Automation examples
# Capture every 5 seconds for 60 seconds
for i in {1..12}; do
  screencapture -x "capture_$i.png"
  sleep 5
done

# Capture with timestamp
screencapture "screenshot_$(date +%Y%m%d_%H%M%S).png"

# Capture all windows of an app
screencapture -io -T 1 window.png           # 1 sec delay, click window

# Combine with other tools
screencapture -x temp.png && sips -s format jpeg temp.png --out screenshot.jpg

# Monitor script - capture every minute
while true; do
  screencapture -x "monitor_$(date +%H%M).png"
  sleep 60
done

# Quality settings for JPEG
screencapture -t jpg -Q 50 screenshot.jpg   # Lower quality (smaller file)
screencapture -t jpg -Q 100 screenshot.jpg  # High quality

# Useful combinations
screencapture -i -c                         # Interactive select to clipboard
screencapture -T 3 -x screenshot.png        # 3 sec delay, no sound
screencapture -io -P window.png             # Window no shadow, open preview

# Create screenshot folder
mkdir -p ~/Screenshots
defaults write com.apple.screencapture location ~/Screenshots
screencapture ~/Screenshots/screenshot.png
```

**Common Options**:
- `-i` - Interactive (select area or window)
- `-c` - Send to clipboard
- `-C` - Include cursor
- `-o` - No window shadow
- `-W` - Capture window only (with -i)
- `-x` - No sound
- `-T n` - Delay n seconds
- `-t format` - Image format (png, jpg, pdf, tiff)


---

