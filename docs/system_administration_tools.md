# System Administration Tools

This document provides comprehensive information about system administration and process management tools, including their purposes, man page descriptions, and practical examples.

**Note**: This is a specialized reference for system administration tools. For the complete CLI tools documentation with 357+ commands across 37+ categories, see [TOOLS.md](../TOOLS.md).

## Process Management Tools

### **ps** - Process Status
**Description:** Display information about running processes with controlling terminals.
**Difficulty:** ⭐⭐⭐ Intermediate

**Man Page Summary:** The ps utility displays a header line, followed by lines containing information about all of your processes that have controlling terminals. Different sets of processes can be selected using various options.

**See Also:** `top` (real-time process monitoring), `htop` (interactive process viewer)

**Common Examples:**

```bash
# List all running processes
ps aux

# List all running processes including the full command string
ps auxww

# Search for a process that matches a string
ps aux | grep string

# Better: Use pgrep for safer process searching
pgrep -af string

# Get the parent PID of a process
ps -o ppid= -p pid

# Sort processes by memory usage (Linux)
ps aux --sort=-%mem | head -n 20

# Sort processes by memory usage (macOS)
ps aux | sort -nrk 4 | head -n 20

# Sort processes by CPU usage
ps -r
```

### **top** - Display Process Information
**Description:** Display sorted information about processes in real-time.
**Difficulty:** ⭐⭐⭐ Intermediate

**Man Page Summary:** Display dynamic real-time information about running processes, sorted by various criteria.

**See Also:** `ps` (process snapshot), `htop` (enhanced interactive version)

**Common Examples:**

```bash
# Start top, all options are available in the interface
top

# Start top sorting processes by internal memory size
top -o mem

# Start top sorting processes first by CPU, then by running time
top -o cpu -O time

# Start top displaying only processes owned by given user
top -user user_name

# Display help about interactive commands (press ? while in top)
# Press ? for help when running top interactively
```

### **htop** - Interactive Process Viewer
**Description:** An enhanced, interactive version of top with better visualization.
**Difficulty:** ⭐⭐⭐ Intermediate

**Note:** Not included by default on macOS. Install with: `brew install htop`

**Man Page Summary:** htop is a cross-platform ncurses-based process viewer similar to top, but allows scrolling vertically and horizontally, mouse interaction, tree view of processes, and multi-process operations.

**See Also:** `top` (basic process monitor), `ps` (process snapshot)

**Common Examples:**

```bash
# Start htop
htop

# Start htop displaying processes owned by a specific user
htop --user username

# Display processes hierarchically in a tree view
htop --tree

# Sort processes by a specified criteria
htop --sort sort_item

# Start htop with specified delay between updates (in tenths of seconds)
htop --delay 50

# See interactive commands while running htop (press ? or F1 for help)
# Press ? or F1 for help when running htop interactively

# Switch to a different tab (press Tab key)
# Press Tab to switch between sections

# Display help
htop --help
```

### **kill** - Terminate Processes
**Description:** Send signals to processes, usually to stop them.
**Difficulty:** ⭐⭐⭐ Intermediate

**Man Page Summary:** Sends a signal to a process. All signals except SIGKILL and SIGSTOP can be intercepted by the process to perform a clean exit.

**See Also:** `killall` (kill by process name), `pkill` (kill by pattern)

**Common Examples:**

```bash
# Terminate a program using the default SIGTERM signal
kill process_id

# List available signal names
kill -l

# Terminate using SIGHUP signal (many daemons reload instead)
kill -1 process_id
kill -HUP process_id

# Terminate using SIGINT signal (like Ctrl+C)
kill -2 process_id
kill -INT process_id

# Force kill a process (cannot be intercepted)
kill -9 process_id
kill -KILL process_id

# Pause a program until SIGCONT signal is received
kill -17 process_id
kill -STOP process_id

# Send SIGUSR1 signal to all processes with given group ID
kill -SIGUSR1 -group_id
```

### **killall** - Kill Processes by Name
**Description:** Kill processes selected by name, as opposed to PID.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Man Page Summary:** The killall utility kills processes selected by name. By default, it sends a TERM signal to all processes with a real UID identical to the caller that match the process name.

**See Also:** `kill` (kill by PID), `pkill` (kill by pattern)

**Common Examples:**

```bash
# Terminate a process using the default SIGTERM signal
killall process_name

# List available signal names
killall --list

# Interactively ask for confirmation before termination
killall --interactive process_name

# Terminate using SIGINT signal
killall -INT process_name

# Force kill a process
killall -KILL process_name
```

### Job Control (Built-in Shell Commands)

#### **jobs** - Display Job Status
**Description:** Display status of jobs in the current session.
**Difficulty:** ⭐⭐ Beginner

**Common Examples:**

```bash
# Show status of all jobs
jobs

# Show status of a particular job
jobs %job_id

# Show status and process IDs of all jobs
jobs -l

# Show process IDs of all jobs
jobs -p
```

#### **bg** - Background Jobs
**Description:** Resume suspended jobs and run them in the background.
**Difficulty:** ⭐⭐ Beginner

**Common Examples:**

```bash
# Resume the most recently suspended job in background
bg

# Resume a specific job in background
bg %job_number
```

#### **fg** - Foreground Jobs
**Description:** Bring background or suspended jobs to the foreground.
**Difficulty:** ⭐⭐ Beginner

**Common Examples:**

```bash
# Bring most recently suspended or background job to foreground
fg

# Bring a specific job to foreground
fg %job_number
```

### **nohup** - Run Commands Immune to Hangups
**Description:** Run commands that continue executing even after the terminal is closed.
**Difficulty:** ⭐⭐⭐ Intermediate

**Man Page Summary:** The nohup utility invokes a command with its arguments and sets the signal SIGHUP to be ignored. If standard output is a terminal, output is appended to nohup.out.

**Common Examples:**

```bash
# Run a process that can live beyond the terminal
nohup command argument1 argument2 ...

# Launch nohup in background mode
nohup command argument1 argument2 ... &

# Run a shell script that can live beyond the terminal
nohup path/to/script.sh &

# Run a process and write output to a specific file
nohup command argument1 argument2 ... > path/to/output_file &
```

## System Monitoring Tools

### **watch** - Execute Programs Periodically
**Description:** Execute a program periodically and monitor the output in full-screen mode.
**Difficulty:** ⭐⭐⭐ Intermediate

**Note:** `watch` is not included by default on macOS. Install with: `brew install watch`

**Man Page Summary:** watch runs a command repeatedly, displaying its output and errors. By default, the command is run every 2 seconds.

**Common Examples:**

```bash
# Repeatedly run a command and show the result
watch command

# Re-run a command every 60 seconds
watch -n 60 command

# Monitor disk space, highlighting differences
watch -d df

# Repeatedly run a pipeline
watch "command_1 | command_2 | command_3"

# Interpret terminal control characters (preserves color)
watch -c "ls -G"

# macOS alternative without watch: Use a while loop
while true; do clear; df -h; sleep 2; done
```

### **uptime** - System Uptime and Load
**Description:** Show how long the system has been running and current load.
**Difficulty:** ⭐⭐ Beginner

**Man Page Summary:** The uptime utility displays the current time, system uptime, number of users, and load averages for the last 1, 5, and 15 minutes.

**Common Examples:**

```bash
# Print current time, uptime, users, and load information
uptime
```

### **iostat** - I/O Statistics
**Description:** Report I/O statistics for devices and CPU.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Man Page Summary:** The iostat utility displays kernel I/O statistics on terminal, device and CPU operations. First statistics are averaged over system uptime.

**Common Examples:**

```bash
# Display snapshot device and CPU statistics
iostat

# Display only device statistics
iostat -d

# Display incremental reports every 2 seconds
iostat 2

# Display statistics for first disk every second indefinitely
iostat -w 1 disk0

# Display statistics for second disk every 3 seconds, 10 times
iostat -w 3 -c 10 disk1

# Display using old-style format
iostat -o

# Display total device statistics
iostat -I
```

## File System Management

### **mount** - Mount File Systems
**Description:** Attach file systems to the directory tree.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Man Page Summary:** The mount command on macOS displays mounted filesystems. Unlike Linux, mounting is typically done through diskutil or hdiutil commands.

**Common Examples:**

```bash
# Show all mounted filesystems
mount

# Mount a disk image (macOS)
hdiutil attach disk_image.dmg

# Mount an external disk using diskutil
diskutil mount disk_identifier

# List all disks and their mount points
diskutil list

# Mount all unmounted disks
diskutil mountDisk disk_identifier

# Mount a specific volume
diskutil mount /dev/disk2s1

# Mount with specific options (read-only)
mount -r -t hfs /dev/disk2s1 /Volumes/MyDisk

# Note: macOS doesn't use /etc/fstab for mounting like Linux
# Use /etc/synthetic.conf for creating synthetic firmlinks instead
```

### **umount** - Unmount File Systems
**Description:** Detach file systems from the directory tree.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Man Page Summary:** The umount command unmounts a mounted filesystem. On macOS, diskutil is often preferred for unmounting.

**Common Examples:**

```bash
# Unmount by mount point
umount /Volumes/MyDisk

# Force unmount
umount -f /Volumes/MyDisk

# Unmount using diskutil (preferred on macOS)
diskutil unmount /Volumes/MyDisk

# Unmount and eject an external disk
diskutil eject /dev/disk2

# Unmount all volumes on a disk
diskutil unmountDisk /dev/disk2

# Force unmount all volumes on a disk
diskutil unmountDisk force /dev/disk2
```

### **df** - Display File System Disk Space
**Description:** Display statistics about disk space usage on mounted file systems.
**Difficulty:** ⭐⭐ Beginner

**Man Page Summary:** The df utility displays statistics about free disk space on specified mounted file systems or files. Block counts are displayed with an assumed block size of 512 bytes by default.

**See Also:** `du` (directory usage), `diskutil` (macOS disk management)

**Common Examples:**

```bash
# Display all filesystems using 512-byte units
df

# Use human-readable units (powers of 1024)
df -h

# Use human-readable units based on powers of 1000
df -H

# Display filesystem containing given file or directory
df path/to/file_or_directory

# Include inode statistics
df -i

# Use 1024-byte units
df -k

# Display in portable POSIX format
df -P

# Show filesystem types (macOS)
df -T hfs,apfs,exfat

# Note: macOS df doesn't have -c flag for grand total
# Use: df -h | awk 'NR>1 {sum+=$2} END {print "Total: " sum}'
```

### **du** - Display Directory Space Usage
**Description:** Display disk usage statistics for files and directories.
**Difficulty:** ⭐⭐⭐ Intermediate

**Man Page Summary:** The du utility displays file system block usage for each file argument and for each directory in the file hierarchy rooted in each directory argument.

**See Also:** `df` (filesystem space), `ncdu` (interactive disk usage analyzer)

**Common Examples:**

```bash
# List sizes in specified units (KiB/MiB/GiB)
du -k path/to/directory
du -m path/to/directory
du -g path/to/directory

# List sizes in human-readable form
du -h path/to/directory

# Show size of single directory
du -sh path/to/directory

# List human-readable sizes of directory and all contents
du -ah path/to/directory

# List sizes up to N levels deep
du -h -d 2 path/to/directory

# Show cumulative total for specific file types
du -ch */*.jpg
```

## Network and System Information

### **lsof** - List Open Files
**Description:** List information about files opened by processes.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Man Page Summary:** lsof lists on its standard output file information about files opened by processes. Root privileges are required to list files opened by other users.

**See Also:** `netstat` (network connections), `fuser` (identify processes using files)

**Common Examples:**

```bash
# Find processes that have a given file open
lsof path/to/file

# Find process that opened a local internet port
lsof -i :port

# Only output the process ID (PID)
lsof -t path/to/file

# List files opened by given user
lsof -u username

# List files opened by given command or process
lsof -c process_or_command_name

# List files opened by specific process PID
lsof -p PID

# List open files in a directory
lsof +D path/to/directory

# Find process listening on IPv6 TCP port
lsof -i6TCP:port -sTCP:LISTEN -n -P
```

### **netstat** - Network Status
**Description:** Display network-related information such as open connections and socket ports.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Man Page Summary:** The netstat command symbolically displays the contents of various network-related data structures with different output formats depending on options.

**See Also:** `lsof` (list open files including network), `ss` (modern netstat alternative on Linux)

**Common Examples:**

```bash
# Display PID and program name listening on specific protocol
netstat -p protocol

# Print routing table without resolving IP addresses
netstat -nr

# Print routing table of IPv4 addresses
netstat -nr -f inet
```

## Scheduling and Task Management

### **cron** - Task Scheduler Daemon
**Description:** Daemon to execute scheduled commands.
**Difficulty:** ⭐⭐⭐⭐⭐ Expert

**Man Page Summary:** The cron utility is launched by launchd when it sees the existence of /etc/crontab or files in /usr/lib/cron/tabs. It searches for crontab files and wakes up every minute to examine stored crontabs.

### **crontab** - Cron Table Management
**Description:** Maintain crontab files for individual users.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Man Page Summary:** The crontab utility is used to install, deinstall or list the tables used to drive the cron daemon. Each user can have their own crontab.

**Common Examples:**

```bash
# Edit the crontab file for current user
crontab -e

# Edit crontab file for specific user
sudo crontab -e -u user

# Replace current crontab with contents of given file
crontab path/to/file

# View existing cron jobs for current user
crontab -l

# Remove all cron jobs for current user
crontab -r

# Sample job running at 10:00 every day
0 10 * * * command_to_execute

# Sample job running every 10 minutes
*/10 * * * * command_to_execute

# Sample job running at 02:30 every Friday
30 2 * * Fri /path/to/script.sh
```

## macOS-Specific Service Management

### **launchctl** - Launchd Interface
**Description:** Interface with launchd to manage daemons and agents on macOS.
**Difficulty:** ⭐⭐⭐⭐⭐ Expert

**Man Page Summary:** launchctl interfaces with launchd to manage and inspect daemons, agents and XPC services. It manages domains, services, and endpoints.

**See Also:** `systemctl` (Linux service management), `brew services` (Homebrew service management)

**Common Examples:**

```bash
# Load user-specific agent
launchctl load ~/Library/LaunchAgents/my_script.plist

# Load agent requiring root privileges
sudo launchctl load /Library/LaunchAgents/root_script.plist

# Load system-wide daemon
sudo launchctl load /Library/LaunchDaemons/system_daemon.plist

# Show all loaded agents/daemons with PIDs and exit codes
launchctl list

# Unload currently loaded agent
launchctl unload ~/Library/LaunchAgents/my_script.plist

# Manually run a known agent/daemon
launchctl start script_file

# Manually kill process associated with agent/daemon
launchctl stop script_file
```

## System Information and User Management

### **id** - User Identity
**Description:** Display current user and group identity information.
**Difficulty:** ⭐⭐ Beginner

**Man Page Summary:** Return user identity information including UID, GID, and group memberships.

**Common Examples:**

```bash
# Display current user's ID, group ID and groups
id

# Display current user identity by name (macOS)
id -un

# Display current user identity as number (macOS)
id -u

# Display current primary group by name (macOS)
id -gn

# Display current primary group as number (macOS)
id -g

# Display arbitrary user's information
id username

# Display real user ID
id -ru

# Display all groups for current user
id -G

# Display all groups by name
id -Gn
```

### **who** - Logged-in Users
**Description:** Display who is currently logged in to the system.
**Difficulty:** ⭐⭐ Beginner

**Man Page Summary:** The who utility displays information about currently logged in users, including login name, tty name, date and time of login, and remote hostname if not local.

**Common Examples:**

```bash
# Display username, line, and time of logged-in sessions
who

# Display all available information (macOS uses -a)
who -a

# Display with column headers (macOS uses -H)
who -H

# Display current terminal only
who am i

# Display system boot time
who -b

# Display dead processes
who -d

# Display user's message status
who -T
```

### **w** - User Activity
**Description:** Show who is logged in and what they are doing.
**Difficulty:** ⭐⭐⭐ Intermediate

**Man Page Summary:** The w utility prints a summary of current activity on the system, including what each user is doing, along with system uptime and load averages.

**Common Examples:**

```bash
# Show logged-in users information
w

# Show information without header
w -h

# Show information sorted by idle time
w -i
```

### **sudo** - Execute as Another User
**Description:** Execute commands as the superuser or another user.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Common Examples:**

```bash
# Run command as superuser
sudo less /var/log/system.log

# Edit file as superuser with default editor (macOS)
sudo -e /etc/hosts
env EDITOR=nano sudo -e /etc/fstab

# Run command as another user and/or group (macOS)
sudo -u user -g group id -a

# Repeat last command with sudo (in Bash/Zsh)
sudo !!

# Launch shell with superuser privileges and login files (macOS)
sudo -i
sudo su -

# Launch shell with superuser privileges without changing environment (macOS)
sudo -s
sudo sh

# Launch shell as specified user with their environment (macOS)
sudo -i -u user
sudo su - user

# List allowed and forbidden commands (macOS)
sudo -l
sudo -ll
```

## System Messages and Logs

### **dmesg** - Display System Messages
**Description:** Display the system message buffer contents.
**Difficulty:** ⭐⭐⭐⭐ Advanced

**Man Page Summary:** dmesg displays the contents of the system message buffer. This command needs to be run as root.

**Common Examples:**

```bash
# Show kernel messages
dmesg

# Show physical memory information
dmesg | grep -i memory

# Show kernel messages one page at a time
dmesg | less
```

## Notes

- Many of these tools require elevated privileges (sudo/root) for full functionality
- On macOS, some Linux-specific tools like systemctl are not available; launchctl is used instead
- Shell built-ins (jobs, bg, fg, kill) are part of the shell and may have slightly different behavior across different shells
- Always consult the man pages (`man command`) for complete documentation and system-specific details
- Use `tldr command` for quick, practical examples of command usage

## Tool Availability by Platform

**Available on macOS:**
- ps, top, htop, kill, killall, jobs, bg, fg, nohup
- cron, crontab, mount, umount, df, du, lsof, netstat, uptime
- iostat, dmesg, launchctl, id, who, w, sudo

**Not available on macOS by default:**
- systemctl, service, ss, free, vmstat, sar, lscpu, lsblk, journalctl, systemd-analyze
- watch (install with: `brew install watch`)
- htop (install with: `brew install htop`)

**macOS alternatives and equivalents:**
- launchctl (instead of systemctl/service)
- diskutil/hdiutil (for disk mounting/unmounting operations)
- Activity Monitor app (GUI alternative to system monitoring tools)
- Console app (for viewing logs instead of journalctl)
- vm_stat (instead of free for memory statistics)
- system_profiler (instead of lscpu for hardware information)
- diskutil list (instead of lsblk for block devices)
- log show (instead of journalctl for system logs)
