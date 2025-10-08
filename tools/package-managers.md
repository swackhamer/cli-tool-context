## Package Managers

### **npm** - Node Package Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#essential, #development, #programming, #javascript, #packages]
related: [node, yarn, pnpm, bun]
keywords: [npm, package, manager, install, dependencies, modules, registry, javascript]
synonyms: [package-manager, js-package-manager, node-package-manager]
platform: [macOS, Linux, Windows]
installation: Included with Node.js (brew install node)
-->
**Description**: Package manager for Node.js
**Location**: `/opt/homebrew/bin/npm`
**Common Use Cases**:

- Package installation and management
- Script execution
- Project initialization

**See Also**: Related tools in this category

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


### **brew** - Homebrew Package Manager (macOS)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [brew, homebrew package manager (maco]
synonyms: [brew]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Missing package manager for macOS (and Linux)
**Location**: `/opt/homebrew/bin/brew`
**Common Use Cases**:

- Software installation and management
- Development environment setup
- System tool installation
- Application distribution

**See Also**: Related tools in this category

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


### **pip3** - Python Package Installer**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [pip3, python package installer]
synonyms: [pip3]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Package installer for Python 3
**Location**: `/Users/allen/.pyenv/shims/pip3`
**Common Use Cases**:

- Python package installation
- Dependency management
- Virtual environment setup
- Development environment configuration

**See Also**: Related tools in this category

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


### **gem** - Ruby Package Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [gem, ruby package manager]
synonyms: [gem]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Package manager for Ruby programming language
**Location**: `/usr/bin/gem`
**Common Use Cases**:

- Ruby gem installation
- Development environment setup
- Tool installation
- Dependency management

**See Also**: Related tools in this category

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


### **cargo** - Rust Package Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [cargo, rust package manager]
synonyms: [cargo]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Package manager and build system for Rust
**Location**: `/Users/allen/.cargo/bin/cargo`
**Common Use Cases**:

- Rust package management
- Project building and testing
- Dependency management
- Tool installation

**See Also**: Related tools in this category

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


### **go** - Go Module Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [go, go module manager]
synonyms: [go]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Go programming language module management
**Location**: `/opt/homebrew/bin/go`
**Common Use Cases**:

- Go module management
- Package installation
- Build and testing
- Dependency resolution

**See Also**: Related tools in this category

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


### **mvn** - Maven (Java)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [mvn, maven (java)]
synonyms: [mvn]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Build automation and dependency management for Java
**Location**: `/opt/homebrew/bin/mvn`
**Common Use Cases**:

- Java project building
- Dependency management
- Testing and packaging
- Release management

**See Also**: Related tools in this category

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


### **gradle** - Gradle Build Tool (Java/Kotlin)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [gradle, gradle build tool (java/kotlin]
synonyms: [gradle]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Build automation tool for JVM languages
**Location**: `/opt/homebrew/bin/gradle`
**Common Use Cases**:

- Java/Kotlin/Groovy project building
- Dependency management
- Multi-project builds
- Android development

**See Also**: Related tools in this category

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


### **composer** - PHP Package Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [composer, php package manager]
synonyms: [composer]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Dependency manager for PHP
**Location**: `/opt/homebrew/bin/composer`
**Common Use Cases**:

- PHP package management
- Autoloading setup
- Project dependency resolution
- Framework installation

**See Also**: Related tools in this category

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


### **yarn** - Fast JavaScript Package Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [yarn, fast javascript package manage]
synonyms: [yarn]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Fast, reliable, and secure dependency management for JavaScript
**Location**: `/opt/homebrew/bin/yarn`
**Common Use Cases**:

- JavaScript package management
- Faster npm alternative
- Workspace management
- Dependency resolution

**See Also**: Related tools in this category

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


### **pnpm** - Performant Node Package Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [pnpm, performant node package manage]
synonyms: [pnpm]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Fast, disk space efficient package manager for JavaScript
**Location**: `/opt/homebrew/bin/pnpm`
**Common Use Cases**:

- Space-efficient package management
- Faster installs than npm/yarn
- Monorepo management
- Strict dependency management

**See Also**: Related tools in this category

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


### **deno** - Deno Package Management**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [deno, deno package management]
synonyms: [deno]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Secure runtime for JavaScript and TypeScript with built-in package management
**Location**: `/opt/homebrew/bin/deno`
**Common Use Cases**:

- TypeScript/JavaScript execution
- URL-based module imports
- Built-in tooling
- Secure by default execution

**See Also**: Related tools in this category

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


### **bun** - Fast JavaScript Runtime & Package Manager ⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Package Managers
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [fast, javascript, runtime, package, manager]
synonyms: [bun]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: All-in-one JavaScript runtime and toolkit designed for speed. Includes a bundler, test runner, and Node.js-compatible package manager that's significantly faster than npm, yarn, or pnpm.
**Location**: `/opt/homebrew/bin/bun` (Homebrew) or `~/.bun/bin/bun`
**Installation**: `brew install oven-sh/bun/bun` or `curl -fsSL https://bun.sh/install | bash`
**Common Use Cases**:

- Ultra-fast package installation
- Running TypeScript/JavaScript files directly
- Building and bundling applications
- Running tests with built-in test runner
- Replacing Node.js for many use cases

**See Also**: Related tools in this category

**Examples**:

```bash
# Package Management (npm-compatible)
bun install                          # Install dependencies (3-10x faster than npm)
bun add express                      # Add dependency
bun add -d @types/node              # Add dev dependency
bun add -g typescript                # Global install
bun remove express                   # Remove dependency
bun update                          # Update dependencies
bun outdated                        # Check for outdated packages

# Running Scripts
bun run index.js                    # Run JavaScript file
bun run index.ts                    # Run TypeScript directly (no compilation needed)
bun run start                       # Run package.json script
bun run --watch index.ts            # Auto-restart on changes
bun run --hot server.ts             # Hot reload server

# Creating Projects
bun create react-app my-app         # Create React app
bun create next-app my-app          # Create Next.js app
bun create vite my-app              # Create Vite project
bun init                            # Initialize new project

# Building and Bundling
bun build ./src/index.ts --outdir ./dist  # Bundle TypeScript/JavaScript
bun build ./src/index.ts --minify         # Minified output
bun build ./src/index.ts --target=node    # Target Node.js
bun build ./src/index.ts --target=browser # Target browsers

# Testing
bun test                            # Run all tests
bun test auth.test.ts              # Run specific test file
bun test --watch                   # Watch mode
bun test --coverage                # With coverage report

# HTTP Server
bun serve --port 3000              # Start HTTP server
bun --hot server.ts                # Hot reload development server

# Shell Completions
bun completions                    # Generate shell completions

# Performance Features
bunx cowsay "Hello"                # Like npx but faster
bun link                           # Link local package
bun pm cache                       # Manage package cache
bun pm ls                          # List installed packages

# Environment and Config
bun --version                      # Show bun version
bun upgrade                        # Upgrade bun itself
bun --print process.versions       # Show runtime versions
```

