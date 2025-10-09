## Version Control

### **git** - Distributed Version Control
<!-- metadata:
category: Version Control
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#essential, #version-control, #development, #git, #collaboration]
related: [delta, lazygit, tig, gh, diff, patch]
keywords: [git, version, control, repository, commit, branch, merge, clone, distributed]
synonyms: [version-control, source-control, repository-management, git-scm]
platform: [macOS, Linux, Windows]
installation: brew install git
-->
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



**Examples**:

```bash
# Basic usage
# (Add specific examples for this tool)
```
### **delta** - Enhanced Git Diff Viewer
<!-- metadata:
category: Version Control
difficulty: ⭐⭐⭐ Intermediate
aliases: [git-delta]
tags: [#modern-alternative, #version-control, #development, #syntax-highlighting]
related: [git, diff, bat, lazygit]
keywords: [delta, git, diff, syntax-highlighting, pager, enhanced, visual, colors]
synonyms: [git-delta, enhanced-diff, syntax-diff, visual-diff]
platform: [macOS, Linux, Windows]
installation: brew install git-delta
-->
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
<!-- metadata:
category: Version Control
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#modern-alternative, #version-control, #development, #git, #tui]
related: [git, tig, delta, gh]
keywords: [lazygit, terminal, ui, git, interactive, visual, interface, tui, gui]
synonyms: [git-ui, interactive-git, visual-git, terminal-git]
platform: [macOS, Linux, Windows]
installation: brew install lazygit
-->
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
<!-- metadata:
category: Version Control
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [tig, text-based interface for git]
synonyms: [tig]
platform: [macOS, Linux]
installation: Built-in
-->
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


### **gh** - GitHub CLI ⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Version Control
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [github, cli]
synonyms: [gh]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: Official command-line interface for GitHub, enabling seamless interaction with GitHub repositories, issues, pull requests, and workflows from the terminal
**Location**: `/opt/homebrew/bin/gh`
**Installation**: `brew install gh`
**Common Use Cases**:

- Create and manage pull requests
- Clone and fork repositories
- Manage issues and releases
- View repository information and statistics
- Authenticate with GitHub

**See Also**: Related tools in this category

**Examples**:

```bash
# Authentication
gh auth login                    # Login to GitHub
gh auth status                   # Check authentication status

# Repository management
gh repo create my-project        # Create new repository
gh repo clone owner/repo         # Clone repository
gh repo fork owner/repo          # Fork repository
gh repo view owner/repo          # View repository details

# Pull request management
gh pr create --title "Add feature" --body "Description"
gh pr list                       # List pull requests
gh pr view 123                   # View specific PR
gh pr checkout 123               # Check out PR locally
gh pr merge 123                  # Merge pull request
gh pr review --approve 123       # Review and approve PR

# Issue management
gh issue create --title "Bug report" --body "Details"
gh issue list                    # List issues
gh issue view 456                # View specific issue
gh issue close 456               # Close issue

# Release management
gh release create v1.0.0         # Create new release
gh release list                  # List releases
gh release view v1.0.0           # View release details

# GitHub Actions
gh run list                      # List workflow runs
gh run view 789                  # View specific run
gh run rerun 789                 # Rerun workflow

# Advanced usage
gh api repos/:owner/:repo        # Make API calls
gh browse                        # Open repo in browser
gh gist create file.txt          # Create gist
```


### **hub** - GitHub Wrapper for Git ⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Version Control
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [github, wrapper, git]
synonyms: [hub]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: Command-line wrapper for git that provides additional GitHub functionality and can be aliased to git for seamless integration
**Location**: `/opt/homebrew/bin/hub`
**Installation**: `brew install hub`
**Common Use Cases**:

- Enhanced git commands with GitHub integration
- Create pull requests from command line
- Fork repositories and clone with GitHub context
- Browse repository and issues in browser

**See Also**: Related tools in this category

**Examples**:

```bash
# Setup (optional alias)
alias git=hub                    # Use hub as git replacement

# Repository operations
hub clone owner/repo             # Clone with GitHub context
hub fork                         # Fork current repository
hub create                       # Create GitHub repo for current directory
hub browse                       # Open repository in browser
hub browse -- issues             # Open issues page
hub browse -- pulls              # Open pull requests page

# Pull request management
hub pull-request                 # Create pull request
hub pull-request -m "Title" -m "Description"
hub pull-request -i 123          # Convert issue to PR
hub pr list                      # List pull requests
hub pr show 456                  # Show pull request details

# Issue management
hub issue                        # List issues
hub issue create                 # Create new issue
hub issue show 123               # Show issue details

# Comparison and releases
hub compare                      # Open compare view
hub release                      # List releases
hub release show v1.0.0          # Show release details

# Git integration examples (when aliased)
git clone owner/repo             # Works like hub clone
git fork                         # Fork repository
git pull-request                 # Create PR
```


### **glab** - GitLab CLI ⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Version Control
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [gitlab, cli]
synonyms: [glab]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: Official command-line interface for GitLab, providing comprehensive GitLab functionality including merge requests, issues, CI/CD pipelines, and project management
**Location**: `/opt/homebrew/bin/glab`
**Installation**: `brew install glab`
**Common Use Cases**:

- Manage GitLab merge requests and issues
- Monitor CI/CD pipelines
- Clone and manage GitLab projects
- Interact with GitLab API from command line

**See Also**: Related tools in this category

**Examples**:

```bash
# Authentication
glab auth login                  # Login to GitLab
glab auth status                 # Check authentication status

# Project management
glab repo clone group/project    # Clone project
glab repo fork group/project     # Fork project
glab repo create my-project      # Create new project
glab repo view group/project     # View project details

# Merge request management
glab mr create --title "Add feature" --description "Details"
glab mr list                     # List merge requests
glab mr view 123                 # View specific MR
glab mr checkout 123             # Check out MR locally
glab mr merge 123                # Merge request
glab mr approve 123              # Approve merge request
glab mr close 123                # Close merge request

# Issue management
glab issue create --title "Bug" --description "Details"
glab issue list                  # List issues
glab issue view 456              # View specific issue
glab issue close 456             # Close issue
glab issue note 456 "Comment"    # Add comment to issue

# Pipeline management
glab pipeline list               # List pipelines
glab pipeline view 789           # View pipeline details
glab pipeline run                # Trigger new pipeline
glab pipeline retry 789          # Retry pipeline

# CI/CD job management
glab job list                    # List jobs
glab job view 101112             # View job details
glab job trace 101112            # View job logs

# Release management
glab release list                # List releases
glab release view v1.0.0         # View release details
glab release create v1.0.0       # Create release

# Advanced usage
glab api projects                # Make API calls
glab browse                      # Open project in browser
glab snippet create file.txt     # Create snippet
```

---

