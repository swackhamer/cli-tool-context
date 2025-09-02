# Comprehensive CLI Safety Guide

A detailed guide for safe command-line operations on macOS.

## Table of Contents
1. [File Operations Safety](#file-operations-safety)
2. [Permission Management](#permission-management)
3. [Privilege Escalation](#privilege-escalation)
4. [Network Operations](#network-operations)
5. [System Modifications](#system-modifications)
6. [Data Protection](#data-protection)

## File Operations Safety

### Safe Deletion Practices

#### The Problem with `rm -rf`
The `rm -rf` command permanently deletes files without any recovery option. One typo can lead to catastrophic data loss.

#### Safer Alternatives

##### Using `trash` Command
```bash
# Installation
brew install trash

# Basic usage
trash file.txt                  # Move single file to trash
trash -r directory/             # Move directory to trash
trash *.log                     # Move multiple files

# Managing trash
trash -l                        # List items in trash
trash -e                        # Empty trash (permanent)
trash -restore file.txt         # Restore from trash
```

##### Using `rm` with Safety Flags
```bash
# Interactive mode - prompts before each deletion
rm -i important.txt

# Verbose mode - shows what's being deleted
rm -v old_files/*

# Combine for maximum safety
rm -iv *.tmp

# Create an alias for safety
alias rm='rm -i'
```

##### Backup Before Deletion
```bash
# Create backup before risky operations
cp -r important_dir important_dir.bak
tar -czf backup_$(date +%Y%m%d).tar.gz important_dir/

# Then safely remove
rm -rf important_dir
```

### Safe Moving and Copying

```bash
# Prevent overwriting with interactive mode
mv -i source.txt dest.txt
cp -i source.txt dest.txt

# Preserve attributes and create backups
cp -p important.conf important.conf.bak
rsync -av --backup source/ destination/

# Use version control for configuration
git add important.conf
git commit -m "Backup before changes"
```

## Permission Management

### Understanding Unix Permissions

```bash
# Permission format: rwxrwxrwx (user, group, other)
# r=4, w=2, x=1

# View permissions
ls -la file.txt
stat -f "%OLp %N" file.txt    # macOS specific

# Common permission patterns
644  # rw-r--r-- (standard file)
755  # rwxr-xr-x (executable/directory)
600  # rw------- (private file)
700  # rwx------ (private executable/directory)
```

### Avoiding chmod 777

#### Why chmod 777 is Dangerous
- Gives EVERYONE full read, write, and execute permissions
- Allows any user or process to modify the file
- Creates security vulnerabilities
- Can break applications expecting specific permissions

#### Secure Permission Patterns

```bash
# Web server files (readable by web server, writable by owner)
chmod 644 index.html           # rw-r--r--
chmod 755 cgi-bin/            # rwxr-xr-x

# Configuration files (owner only)
chmod 600 ~/.ssh/config        # rw-------
chmod 600 database.yml         # rw-------

# Shared scripts (executable by group)
chmod 750 shared_script.sh     # rwxr-x---

# Private directories
chmod 700 ~/private/           # rwx------

# Fixing overly permissive files
find . -type f -perm 777 -exec chmod 644 {} \;
find . -type d -perm 777 -exec chmod 755 {} \;
```

### Special Permissions

```bash
# Setuid (run as file owner)
chmod u+s executable           # Use with extreme caution

# Setgid (inherit group)
chmod g+s directory/           # Useful for shared directories

# Sticky bit (only owner can delete)
chmod +t /tmp/shared/          # Protect shared directories
```

## Privilege Escalation

### Using sudo Responsibly

#### When to Use sudo
```bash
# System package management
sudo apt update && sudo apt upgrade
sudo brew services start postgresql

# System configuration
sudo systemctl restart nginx
sudo vim /etc/hosts

# Hardware/kernel operations
sudo dmesg | tail
sudo lsof -i :80
```

#### When NOT to Use sudo
```bash
# User-level package managers
pip install --user package     # Not: sudo pip install
npm install -g package         # Use nvm instead
gem install --user-install gem # Not: sudo gem install

# File operations in home directory
chmod 755 ~/script.sh          # Not: sudo chmod
rm ~/old_file.txt             # Not: sudo rm

# Running untrusted scripts
./unknown_script.sh           # NEVER: sudo ./unknown_script.sh
```

#### sudo Best Practices
```bash
# Check what you can run
sudo -l

# Run specific command only
sudo -u www-data command      # Run as specific user

# Edit files safely
sudoedit /etc/config          # Better than: sudo vim /etc/config

# Avoid shell redirects with sudo
# Wrong:
sudo echo "text" > /etc/file

# Right:
echo "text" | sudo tee /etc/file
sudo sh -c 'echo "text" > /etc/file'
```

### Alternative to Root Access

```bash
# Use virtual environments
python -m venv myenv
source myenv/bin/activate

# User-specific installations
export PREFIX=$HOME/.local
./configure --prefix=$PREFIX

# Container-based isolation
docker run --rm -it ubuntu bash
podman run --rm -it alpine sh
```

## Network Operations

### Safe Network Scanning

```bash
# ONLY scan networks you own or have permission to scan

# Local network discovery
arp -a                        # Show local ARP cache
ping -c 1 192.168.1.1        # Single ping test

# Port checking (localhost)
nc -zv localhost 80          # Check if port is open
lsof -i :3000               # What's using port 3000

# Safe nmap usage
nmap -sn 192.168.1.0/24     # Ping scan only (no ports)
nmap localhost              # Scan only your machine
```

### Secure Remote Operations

```bash
# Use SSH keys instead of passwords
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id user@host

# Secure file transfers
scp -i ~/.ssh/key file.txt user@host:/path/
rsync -avz -e "ssh -i ~/.ssh/key" source/ user@host:/dest/

# SSH config for convenience and security
cat >> ~/.ssh/config << EOF
Host myserver
    HostName server.example.com
    User myuser
    IdentityFile ~/.ssh/mykey
    Port 22
EOF
```

## System Modifications

### Safe System Changes

```bash
# Backup before modifying system files
sudo cp /etc/hosts /etc/hosts.bak.$(date +%Y%m%d)

# Use configuration management
# Instead of manual edits, use:
brew install ansible
ansible-playbook site.yml --check  # Dry run first

# Test changes in isolation
docker run -it --rm ubuntu:latest bash
# Make changes in container first
```

### Service Management

```bash
# Check service status first
brew services list
launchctl list | grep service

# Safe service operations
brew services start service    # Not: sudo service start
brew services restart service  # Graceful restart
brew services stop service     # Clean shutdown

# System services (use with caution)
sudo launchctl load -w /System/Library/LaunchDaemons/service.plist
sudo launchctl unload -w /System/Library/LaunchDaemons/service.plist
```

## Data Protection

### Preventing Data Loss

```bash
# Version control for code
git init
git add .
git commit -m "Initial commit"

# Time Machine for system backups
tmutil startbackup
tmutil status

# Manual backups before risky operations
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz important_data/
rsync -av --progress source/ backup/

# Database backups
pg_dump database > backup.sql
mongodump --out ./backup/
```

### Secure Sensitive Data

```bash
# Never commit secrets
# Add to .gitignore:
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore
echo ".env" >> .gitignore

# Encrypt sensitive files
openssl enc -aes-256-cbc -in secret.txt -out secret.txt.enc
gpg --encrypt --recipient user@example.com file.txt

# Secure deletion (when really needed)
rm -P sensitive.txt           # Overwrite before deletion (macOS)
shred -vfz -n 3 sensitive.txt # Linux alternative
```

## Emergency Recovery

### When Things Go Wrong

```bash
# Accidentally deleted files
# Check if still in trash
trash -l

# File recovery tools
brew install testdisk
brew install photorec

# Process stuck/frozen
# Find process
ps aux | grep process_name
# Kill gracefully
kill -TERM pid
# Force kill if necessary
kill -KILL pid

# System recovery
# Boot into Recovery Mode: Cmd+R during startup
# Use Disk Utility to repair disk
# Restore from Time Machine backup
```

## Safety Checklist

Before running any command:
- [ ] Do I understand what this command does?
- [ ] Have I made a backup if needed?
- [ ] Am I in the correct directory?
- [ ] Have I checked the command for typos?
- [ ] Is sudo really necessary?
- [ ] Am I using the safest alternative?

## Additional Resources

- `man safety` - macOS safety manual
- `tldr` - Simplified command examples
- `shellcheck` - Bash script linting
- `explain-shell.com` - Command explanation