# Debugging Checklist

Standard checklist for troubleshooting CLI tool issues.

## Installation Verification
```bash
which tool_name          # Check if tool is in PATH
type tool_name          # Alternative to which
command -v tool_name    # POSIX-compliant check
```

## Version Information
```bash
tool_name --version     # Most common
tool_name -v           # Short form
tool_name version      # Subcommand style
```

## Path Verification
```bash
echo $PATH             # Check PATH variable
which -a tool_name     # Find all instances
ls -la $(which tool)   # Check permissions
```

## Permission Checks
```bash
ls -la file            # Check file permissions
stat file              # Detailed file info
id                     # Current user info
groups                 # User group membership
```

## Documentation Access
```bash
man tool_name          # Manual pages
tool_name --help       # Built-in help
tool_name -h          # Short help
tldr tool_name        # Simplified examples
```

## Common Issues & Solutions

### Command Not Found
```bash
# Check installation
brew list | grep tool_name
port installed | grep tool_name

# Install if missing
brew install tool_name
sudo port install tool_name
```

### Permission Denied
```bash
# Check file ownership
ls -la problematic_file

# Fix ownership (careful!)
sudo chown $USER:staff file

# Fix permissions
chmod u+x script.sh    # Add execute for user
chmod 644 config.txt   # Standard file permissions
```

### Path Issues
```bash
# Add to PATH temporarily
export PATH="/usr/local/bin:$PATH"

# Add permanently (zsh)
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Add permanently (bash)
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```