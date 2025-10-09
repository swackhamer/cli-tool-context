## Development Tools


### **rustc** - Rust Compiler ⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [rust, compiler]
synonyms: [rustc]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: The Rust programming language compiler that transforms Rust source code into executable binaries. Provides safety guarantees through its ownership system and produces highly optimized machine code.
**Location**: `/opt/homebrew/bin/rustc` (Homebrew) or `/usr/local/bin/rustc`
**Installation**: `brew install rust` or via rustup: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
**Common Use Cases**:

- Compiling Rust programs to native code
- Checking code for errors without building
- Generating optimized release builds
- Cross-compilation to different targets
- Producing WebAssembly modules

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic compilation
rustc main.rs                        # Compile to executable 'main'
rustc main.rs -o myprogram          # Specify output name
rustc lib.rs --crate-type=lib       # Compile as library

# Optimization levels
rustc -O main.rs                    # Optimize for speed (level 2)
rustc -C opt-level=3 main.rs        # Maximum optimization
rustc -C opt-level=s main.rs        # Optimize for size
rustc -C opt-level=z main.rs        # Optimize for minimal size

# Debug and release builds
rustc -g main.rs                    # Include debug symbols
rustc --release main.rs             # Release build with optimizations

# Error checking
rustc --edition=2021 main.rs        # Use Rust 2021 edition
rustc --explain E0308               # Explain error code
rustc -W warnings main.rs           # Treat warnings as errors

# Output types
rustc --emit=asm main.rs           # Generate assembly
rustc --emit=llvm-ir main.rs       # Generate LLVM IR
rustc --emit=mir main.rs            # Generate MIR (Mid-level IR)
rustc --emit=metadata main.rs      # Generate metadata only

# Cross-compilation
rustc --target=wasm32-unknown-unknown main.rs  # Compile to WebAssembly
rustc --target=x86_64-pc-windows-gnu main.rs   # Cross-compile to Windows
rustc --print target-list           # List available targets

# Linking options
rustc -C prefer-dynamic main.rs     # Prefer dynamic linking
rustc -C link-arg=-s main.rs        # Pass arguments to linker
rustc -L dependency=/path/to/libs main.rs  # Add library search path

# Feature flags
rustc --cfg 'feature="foo"' main.rs # Enable conditional compilation
rustc --test main.rs                # Build with test harness
rustc --bench main.rs               # Build with benchmark harness

# Version and help
rustc --version                     # Show compiler version
rustc --version --verbose           # Detailed version info
rustc --print sysroot              # Show installation directory
```



### **asdf** - Version Manager for Multiple Runtimes
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#version-management, #development, #runtime]
related: [nvm, rbenv, pyenv, mise]
keywords: [version, manager, runtime, node, ruby, python, golang, elixir]
synonyms: [asdf-vm, version-manager, runtime-manager]
platform: [macOS, Linux]
installation: brew install asdf
-->
**Description**: Extendable version manager with support for Ruby, Node.js, Elixir, Erlang & more
**Location**: `/opt/homebrew/bin/asdf`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- Managing multiple language versions
- Project-specific runtime versions
- Team development environment consistency
- CI/CD environment setup

**See Also**: `mise` (faster alternative), `nvm` (Node.js only), `rbenv` (Ruby only), `pyenv` (Python only)

**Examples**:

```bash
# Install a plugin
asdf plugin add nodejs
asdf plugin add python

# List available versions
asdf list all nodejs

# Install a specific version
asdf install nodejs 18.17.0
asdf install python 3.11.4

# Set global version
asdf global nodejs 18.17.0

# Set local version for project
asdf local nodejs 16.20.1

# List installed versions
asdf list nodejs

# Current versions
asdf current

# Update plugins
asdf plugin update --all
```


### **mise** - Fast Development Environment Setup Tool
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: [rtx]
tags: [#version-management, #development, #runtime, #environment]
related: [asdf, nvm, rbenv, pyenv]
keywords: [mise, rtx, version, manager, runtime, environment, fast]
synonyms: [rtx, mise-en-place, runtime-executor]
platform: [macOS, Linux]
installation: brew install mise
-->
**Description**: Fast, polyglot runtime version manager (formerly rtx), compatible with asdf
**Location**: `/opt/homebrew/bin/mise`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- Fast runtime version management
- Development environment setup
- asdf-compatible plugin system
- Project-specific tool versions

**See Also**: `asdf` (original version manager), `nvm` (Node.js specific), `direnv` (environment variables)

**Examples**:

```bash
# Install mise
brew install mise

# Initialize shell
echo 'eval "$(mise activate bash)"' >> ~/.bashrc

# Install tools
mise install node@18
mise install python@3.11
mise install rust@latest

# Use specific versions
mise use node@18.17.0
mise use python@3.11.4

# Set global defaults
mise global node@18
mise global python@3.11

# List installed versions
mise list

# Show current versions
mise current

# Install from .tool-versions
mise install

# Shell into environment
mise shell node@16
```


### **act** - Run GitHub Actions Locally
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#ci-cd, #github, #testing, #automation]
related: [gh, docker, github-actions]
keywords: [act, github, actions, ci, cd, local, testing, workflow]
synonyms: [github-act, local-actions, workflow-runner]
platform: [macOS, Linux, Windows]
installation: brew install act
-->
**Description**: Run your GitHub Actions locally for testing and debugging
**Location**: `/opt/homebrew/bin/act`
**Difficulty**: ⭐⭐⭐⭐ Advanced
**Common Use Cases**:

- Testing GitHub Actions workflows locally
- Debugging CI/CD pipelines
- Faster iteration on workflow development
- Avoiding unnecessary commits for testing

**See Also**: `gh` (GitHub CLI), `docker` (required dependency), `nektos/act` (project page)

**Examples**:

```bash
# List available workflows
act -l

# Run default push event
act

# Run specific workflow
act -W .github/workflows/test.yml

# Run specific job
act -j build

# Run pull request event
act pull_request

# Use specific event file
act -e payload.json

# Dry run (show what would run)
act -n

# Run with secrets
act -s GITHUB_TOKEN=mytoken

# Use different runner image
act -P ubuntu-latest=nektos/act-environments-ubuntu:18.04

# Verbose output
act -v

# Reuse containers
act -r
```

### **gcc/clang** - C/C++ Compilers**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [gcc/clang, c/c++ compilers]
synonyms: [gcc/clang]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: GNU Compiler Collection (aliased to clang on macOS)
**Location**: `/usr/bin/gcc`, `/usr/bin/clang`
**Common Use Cases**:

- Compile C/C++ programs
- Debug symbol generation
- Optimization and linking

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic compilation
gcc source.c -o executable

# With warnings and debug symbols
gcc -Wall -g source.c -o executable

# Optimization levels
gcc -O2 source.c -o executable

# Link libraries
gcc source.c -lmath -o executable
```


### **make** - Build Automation**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: [gmake]
tags: [#essential, #development, #programming, #build-tools]
related: [cmake, ninja, meson, gcc, clang]
keywords: [make, build, compile, automation, makefile, dependency, target, rule]
synonyms: [gmake, build-tool, compile-tool, makefile-processor]
platform: [macOS, Linux, Windows]
installation: Built-in (Xcode Command Line Tools)
-->
**Description**: Build automation tool using Makefiles
**Location**: `/usr/bin/make`
**Common Use Cases**:

- Project building and compilation
- Task automation
- Dependency management

**See Also**: Related tools in this category

**Examples**:

```bash
# Build default target
make

# Parallel build
make -j4

# Specific target
make clean

# Override variables
make CC=clang
```


### **just** - Command Runner (Make Alternative)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#modern-alternative, #build-tools, #rust, #task-runner, #automation]
related: [make, task, cmake, ninja]
keywords: [just, command runner, task runner, make alternative, justfile, build automation, recipes]
synonyms: [justfile, command-runner, task-runner, make-replacement]
platform: [macOS, Linux, Windows]
installation: brew install just
-->
**Description**: Modern command runner written in Rust - simpler and more reliable alternative to make
**Location**: `/opt/homebrew/bin/just` (Homebrew) or install via cargo
**Installation**: `brew install just` or `cargo install just`
**Common Use Cases**:

- Project task automation with simpler syntax than make
- Running development workflows (test, build, deploy)
- Cross-platform command execution
- Local development scripts with better error messages
- Just-in-time command evaluation

**Why Better than Make**:
- Simpler, more intuitive syntax
- Better error messages
- Cross-platform consistency
- No tab/space sensitivity issues
- Just-in-time evaluation of commands
- Command-line argument support for recipes

**See Also**: Related tools in this category

**Examples**:

```bash
# Create a justfile (equivalent to Makefile)
cat > justfile <<'EOF'
# Default recipe (runs when you just type 'just')
default:
  @echo "Available commands:"
  @just --list

# Build the project
build:
  cargo build --release

# Run tests
test:
  cargo test

# Clean build artifacts
clean:
  cargo clean
  rm -rf target/

# Recipe with parameters
run binary_name:
  cargo run --bin {{binary_name}}

# Recipe with dependencies
deploy: test build
  scp target/release/myapp server:/opt/
EOF

# List available recipes
just --list
just -l

# Run default recipe
just

# Run specific recipe
just build
just test
just clean

# Run recipe with arguments
just run server

# Run recipe from specific justfile
just --justfile ./other/justfile build

# Set working directory
just --working-directory ./subproject test

# Show what would be executed (dry run)
just --dry-run deploy
just -n deploy

# Run recipe even if up to date
just --force build

# Execute in different shell
just --shell bash --shell-arg -c build

# Verbose output
just --verbose build

# Choose recipe interactively (with fzf)
just --choose

# Format justfile
just --fmt --unstable

# Show justfile summary
just --summary

# Dump evaluated justfile
just --dump

# Invoke recipe from subdirectory (searches upward for justfile)
cd src/
just build  # Finds and uses justfile in parent directory
```

**Common Justfile Patterns**:

```bash
# Variables
version := "1.0.0"
binary := "myapp"

# Recipe dependencies
all: test build

# Platform-specific recipes
build-mac:
  cargo build --target x86_64-apple-darwin

build-linux:
  cargo build --target x86_64-unknown-linux-gnu

# Conditional execution
@check-deps:
  command -v cargo >/dev/null || (echo "cargo not found" && exit 1)

# Multi-line commands
install: build
  mkdir -p /usr/local/bin
  cp target/release/{{binary}} /usr/local/bin/

# Recipe with default arguments
serve port="8000":
  python3 -m http.server {{port}}

# Private recipes (not shown in --list)
_private-task:
  @echo "This is private"
```


### **cmake** - Cross-Platform Build System**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [cmake, cross-platform build system]
synonyms: [cmake]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Cross-platform build system generator
**Location**: `/opt/homebrew/bin/cmake`
**Common Use Cases**:

- Generate build files for complex projects
- Cross-platform compilation
- Dependency management

**See Also**: Related tools in this category

**Examples**:

```bash
# Generate build files
cmake .

# Build project
cmake --build .

# Install built artifacts
cmake --install . --prefix /usr/local
```


### **ninja** - Small Build System
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ninja, small build system]
synonyms: [ninja]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: A small build system with a focus on speed, designed to have build files generated by higher-level build systems
**Location**: `/opt/homebrew/bin/ninja`
**Difficulty**: ⭐⭐⭐ Intermediate (Generated files) / ⭐⭐⭐⭐ Advanced (Manual configuration)
**Common Use Cases**:

- Fast incremental builds
- Generated by CMake, Meson, or other meta-build systems
- Large-scale C/C++ projects
- Performance-critical build environments

**See Also**: `make` (traditional build), `cmake` (generates ninja files), `meson` (modern meta-build)

**Examples**:

```bash
# Basic usage (typically with generated build.ninja)
ninja                                         # Build all targets
ninja target_name                            # Build specific target
ninja -j 8                                   # Use 8 parallel jobs
ninja -v                                     # Verbose output (show commands)

# Information and debugging
ninja -t targets                             # List all available targets
ninja -t graph > build.dot                   # Generate dependency graph
ninja -t deps target_name                    # Show dependencies for target
ninja -t clean                               # Clean built files

# Performance and analysis
ninja -t browse                              # Start dependency browsing server
ninja -t msvc                                # MSVC helper (Windows)
ninja -t recompact                           # Recompact ninja log
ninja -d stats                               # Show build statistics

# Integration with other build systems
cmake -G Ninja ..                            # Generate ninja files with CMake
meson builddir --backend ninja               # Use ninja backend with Meson
ninja -C builddir                            # Run ninja in specific directory

# Common workflow
mkdir build && cd build
cmake -G Ninja ..                            # Configure with Ninja generator
ninja                                        # Build
ninja test                                   # Run tests (if available)
ninja install                               # Install
```


### **meson** - Modern Build System
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [meson, modern build system]
synonyms: [meson]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: An open source build system meant to be both extremely fast and as user-friendly as possible
**Location**: `/opt/homebrew/bin/meson`
**Difficulty**: ⭐⭐⭐ Intermediate (Learning syntax) / ⭐⭐⭐⭐ Advanced (Complex projects)
**Common Use Cases**:

- Modern C/C++/Rust/Python project builds
- Cross-compilation and multi-platform builds
- Fast and user-friendly alternative to Autotools/CMake
- Projects requiring sophisticated dependency management

**See Also**: `ninja` (backend), `cmake` (alternative build system), `make` (traditional)

**Examples**:

```bash
# Project setup and configuration
meson setup builddir                         # Configure build in builddir/
meson setup builddir --buildtype=release     # Release configuration
meson setup builddir --prefix=/usr/local     # Custom install prefix
meson setup builddir --cross-file cross.txt  # Cross-compilation

# Building
meson compile -C builddir                    # Build project
meson compile -C builddir target_name        # Build specific target
meson compile -C builddir -j 8               # Use 8 parallel jobs

# Testing
meson test -C builddir                       # Run tests
meson test -C builddir --verbose             # Verbose test output
meson test -C builddir test_name             # Run specific test
meson test -C builddir --benchmark           # Run benchmarks

# Installation and distribution
meson install -C builddir                    # Install to configured prefix
meson dist -C builddir                       # Create distribution tarball
DESTDIR=/tmp/stage meson install -C builddir # Staged install

# Project introspection
meson introspect builddir --targets          # List build targets
meson introspect builddir --dependencies     # Show dependencies
meson introspect builddir --tests            # List tests
meson introspect builddir --installed        # Show installed files

# Configuration management
meson configure builddir                     # Show current configuration
meson configure builddir -Doption=value     # Set build option
meson configure builddir --buildtype=debug  # Change build type

# Example meson.build file:
# project('myproject', 'cpp', version: '1.0')
# executable('myapp', 'main.cpp', install: true)
# dependency('threads')

# Subprojects and wrapping
meson wrap install gtest                     # Install dependency wrap
meson subprojects update                     # Update all subprojects
```


### **bazel** - Google's Build System
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [bazel, google's build system]
synonyms: [bazel]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: A build tool that builds code quickly and reliably for large-scale software development
**Location**: `/opt/homebrew/bin/bazel`
**Difficulty**: ⭐⭐⭐⭐ Advanced (Complex configuration) / ⭐⭐⭐⭐⭐ Expert (Large-scale projects)
**Common Use Cases**:

- Large-scale multi-language projects
- Reproducible and hermetic builds
- Google-scale software development
- Projects requiring precise dependency management

**See Also**: `make` (simple builds), `cmake` (C/C++ builds), `buck` (Facebook's build system)

**Examples**:

```bash
# Basic building
bazel build //...                           # Build everything
bazel build //src:main                      # Build specific target
bazel build --config=release //src:main     # Build with configuration

# Testing
bazel test //...                            # Run all tests
bazel test //src:test                       # Run specific test
bazel test --test_output=all //src:test     # Show test output

# Running
bazel run //src:main                        # Build and run target
bazel run //src:main -- arg1 arg2           # Pass arguments to target

# Project information
bazel query //...                           # List all targets
bazel query 'deps(//src:main)'              # Show dependencies
bazel query 'rdeps(//..., //lib:mylib)'     # Reverse dependencies

# Build configuration
bazel build --verbose_failures //src:main   # Show detailed errors
bazel build --compilation_mode=dbg //src:main  # Debug build
bazel build --cpu=k8 //src:main             # Specify CPU architecture

# Cleaning and cache
bazel clean                                  # Clean build outputs
bazel clean --expunge                       # Clean everything including cache
bazel shutdown                              # Shutdown Bazel server

# Remote execution and caching
bazel build --remote_executor=grpc://server:port //src:main
bazel build --remote_cache=grpc://cache:port //src:main

# Example BUILD file:
# cc_binary(
#     name = "main",
#     srcs = ["main.cpp"],
#     deps = ["//lib:mylib"],
# )

# Workspace management
bazel sync                                   # Synchronize workspace
bazel fetch //...                           # Fetch external dependencies
```


### **javac** - Java Compiler**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [javac, java compiler]
synonyms: [javac]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Java programming language compiler from Oracle/OpenJDK
**Location**: `/usr/bin/javac`
**Common Use Cases**:

- Java source code compilation
- Class file generation
- Build automation integration
- Development workflow

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic compilation
javac HelloWorld.java

# Compile with classpath
javac -cp /path/to/libs/*.jar MyClass.java

# Compile multiple files
javac *.java
javac src/main/java/**/*.java

# Specify output directory
javac -d build src/**/*.java

# Include debug information
javac -g MyClass.java

# Show verbose compilation
javac -verbose MyClass.java

# Set specific Java version compatibility
javac -source 11 -target 11 MyClass.java

# Enable warnings
javac -Xlint:all MyClass.java

# Compile with annotation processing
javac -processor MyProcessor MyClass.java

# Generate native headers (JNI)
javac -h native_headers MyClass.java

# Cross-compilation with bootclasspath
javac -bootclasspath /path/to/rt.jar MyClass.java

# Compile with module system (Java 9+)
javac --module-path /path/to/modules -d out --module mymodule src/mymodule/**/*.java
```


### **nm** - Symbol Table Display**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [nm, symbol table display]
synonyms: [nm]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display symbol table of object files
**Location**: `/usr/bin/nm`
**Common Use Cases**:

- Symbol analysis and debugging
- Library dependency checking
- Reverse engineering
- Build troubleshooting

**See Also**: Related tools in this category

**Examples**:

```bash
# Display symbols in object file
nm object.o

# Display symbols in library
nm libmath.a

# Show dynamic symbols only
nm -D library.so

# Display with addresses
nm -n program

# Show undefined symbols only
nm -u program

# Display symbols with type information
nm -t program

# Show external symbols only
nm -g program

# Display symbol sizes
nm -S program

# Sort by symbol name
nm -p program

# Show debugging symbols
nm -a program

# Format output differently
nm -f bsd program    # BSD format
nm -f sysv program   # System V format
nm -f posix program  # POSIX format
```


### **objdump** - Object File Disassembler**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [objdump, object file disassembler]
synonyms: [objdump]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display information from object files and executables
**Location**: `/usr/bin/objdump`
**Common Use Cases**:

- Assembly code analysis
- Reverse engineering
- Debugging optimized code
- Security research

**See Also**: Related tools in this category

**Examples**:

```bash
# Disassemble executable
objdump -d program

# Show all headers
objdump -x program

# Display file header
objdump -f program

# Show section headers
objdump -h program

# Disassemble specific section
objdump -j .text -d program

# Show source code intermixed with assembly
objdump -S program

# Display relocation entries
objdump -r object.o

# Show dynamic relocation
objdump -R program

# Display symbol table
objdump -t program

# Dynamic symbol table
objdump -T program

# Show assembly with line numbers
objdump -l -d program

# Intel syntax (x86)
objdump -M intel -d program

# Start disassembly at specific address
objdump --start-address=0x1000 -d program

# Stop at specific address
objdump --stop-address=0x2000 -d program
```


### **strings** - Extract Printable Strings**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [strings, extract printable strings]
synonyms: [strings]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Extract printable character sequences from binary files
**Location**: `/usr/bin/strings`
**Common Use Cases**:

- Binary analysis and reverse engineering
- Configuration extraction
- Malware analysis
- Debug information discovery

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic string extraction
strings program

# Show strings with minimum length
strings -n 10 program

# Display string offsets
strings -o program

# Show strings from all sections
strings -a program

# Scan specific sections
strings -t d program  # decimal offsets
strings -t x program  # hexadecimal offsets
strings -t o program  # octal offsets

# Extract from specific encoding
strings -e l program  # little-endian 16-bit
strings -e b program  # big-endian 16-bit
strings -e L program  # little-endian 32-bit
strings -e B program  # big-endian 32-bit

# Filter by specific patterns
strings program | grep -i password
strings program | grep -E "https?://"

# Analyze multiple files
strings *.so | grep "version"

# Find configuration strings
strings config.bin | grep -E "^[A-Z_]+="

# Extract from core dumps
strings core.dump | grep -i error
```


### **hexdump** - Hexadecimal File Dump**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [hexdump, hexadecimal file dump]
synonyms: [hexdump]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display file contents in hexadecimal, decimal, octal, or ASCII
**Location**: `/usr/bin/hexdump`
**Common Use Cases**:

- Binary file analysis
- Data format investigation
- Debugging binary protocols
- File corruption analysis

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic hex dump
hexdump file.bin

# Canonical hex+ASCII display
hexdump -C file.bin

# One-byte hex format
hexdump -x file.bin

# Two-byte hex format
hexdump -X file.bin

# Decimal format
hexdump -d file.bin

# Octal format
hexdump -o file.bin

# Custom format string
hexdump -e '16/1 "%02x " "\n"' file.bin

# Skip bytes at beginning
hexdump -s 1024 file.bin

# Limit number of bytes
hexdump -n 256 file.bin

# Format with addresses
hexdump -e '"%08.8_ax  " 8/1 "%02x " " " 8/1 "%02x "' -e '"  |" 16/1 "%_p" "|\n"' file.bin

# Show only printable characters
hexdump -e '16/1 "%_p"' -e '"\n"' file.bin

# Compare two files
hexdump -C file1.bin > dump1.txt
hexdump -C file2.bin > dump2.txt
diff dump1.txt dump2.txt
```


### **xxd** - Hex Dump (Alternative)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [xxd, hex dump (alternative)]
synonyms: [xxd]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Make a hexdump or do the reverse (available in vim package)
**Location**: `/usr/bin/xxd`
**Common Use Cases**:

- Binary file editing workflow
- Data conversion tasks
- Patch creation
- Protocol analysis

**See Also**: Related tools in this category

**Examples**:

```bash
# Standard hex dump
xxd file.bin

# Limit output lines
xxd -l 320 file.bin

# Uppercase hex digits
xxd -u file.bin

# Group bytes differently
xxd -g 1 file.bin    # 1 byte groups
xxd -g 2 file.bin    # 2 byte groups (default)
xxd -g 4 file.bin    # 4 byte groups

# Plain hex output (no formatting)
xxd -p file.bin

# Continuous hex string
xxd -p -c 256 file.bin

# Reverse operation (hex to binary)
xxd -r -p hexfile.txt > binary.bin

# Edit binary files workflow
xxd file.bin > file.hex
# Edit file.hex with text editor
xxd -r file.hex > file.bin

# Create binary from hex
echo "48656c6c6f20576f726c64" | xxd -r -p

# Seek to offset
xxd -s 0x100 file.bin

# Include only certain range
xxd -s 0x100 -l 0x50 file.bin

# Binary diff visualization
xxd file1.bin > file1.hex
xxd file2.bin > file2.hex
diff -u file1.hex file2.hex
```


### **patch** - Apply Source Patches**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [patch, apply source patches]
synonyms: [patch]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Apply patch files to source code
**Location**: `/usr/bin/patch`
**Common Use Cases**:

- Source code patching
- Bug fix application
- Version control operations
- Collaborative development

**See Also**: Related tools in this category

**Examples**:

```bash
# Apply patch file
patch < patch.diff
patch -p1 < patch.diff

# Apply specific file patch
patch file.c < file.patch

# Dry run (test without applying)
patch --dry-run < patch.diff

# Reverse patch
patch -R < patch.diff

# Create backup files
patch -b < patch.diff

# Custom backup suffix
patch -b -z .orig < patch.diff

# Strip path components
patch -p0 < patch.diff  # use full path
patch -p1 < patch.diff  # strip 1 component
patch -p2 < patch.diff  # strip 2 components

# Force application
patch -f < patch.diff

# Interactive mode
patch -t < patch.diff

# Verbose output
patch -v < patch.diff

# Create patch files
diff -u original.c modified.c > changes.patch
diff -ur original_dir/ modified_dir/ > project.patch

# Apply git patches
patch -p1 < 0001-feature.patch

# Reject failed hunks
patch -r rejected.rej < patch.diff
```


### **diff** - Compare Files/Directories**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [diff, compare files/directories]
synonyms: [diff]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Compare files line by line or directories
**Location**: `/usr/bin/diff`
**Common Use Cases**:

- Source code comparison
- Configuration changes
- Backup verification
- Version analysis

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic file comparison
diff file1.txt file2.txt

# Unified format (patch-friendly)
diff -u original.c modified.c

# Context format
diff -c file1.txt file2.txt

# Side-by-side comparison
diff -y file1.txt file2.txt

# Ignore case differences
diff -i file1.txt file2.txt

# Ignore whitespace changes
diff -b file1.txt file2.txt
diff -w file1.txt file2.txt  # ignore all whitespace

# Recursive directory comparison
diff -r dir1/ dir2/

# Show only file names that differ
diff -q dir1/ dir2/

# Exclude files by pattern
diff -r --exclude="*.o" --exclude="*.a" src1/ src2/

# Generate patch
diff -u original.c modified.c > changes.patch

# Compare binary files
diff --brief file1.bin file2.bin

# Show differences with line numbers
diff -n file1.txt file2.txt

# Ignore blank lines
diff -B file1.txt file2.txt

# Minimal diff
diff --minimal file1.txt file2.txt

# Show function names in C code
diff -p original.c modified.c
```


### **cmp** - Compare Files Byte by Byte**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [cmp, compare files byte by byte]
synonyms: [cmp]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Compare two files byte by byte
**Location**: `/usr/bin/cmp`
**Common Use Cases**:

- Binary file verification
- Data integrity checking
- Exact comparison needs
- Performance-critical comparisons

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic comparison
cmp file1.bin file2.bin

# Verbose output showing differences
cmp -l file1.bin file2.bin

# Silent mode (exit status only)
cmp -s file1.bin file2.bin

# Show first difference only
cmp file1.bin file2.bin

# Compare with byte count limit
cmp -n 1024 file1.bin file2.bin

# Skip bytes at beginning
cmp -i 100 file1.bin file2.bin

# Skip different amounts in each file
cmp -i 100:200 file1.bin file2.bin

# Use in scripts
if cmp -s file1 file2; then
    echo "Files are identical"
else
    echo "Files differ"
fi

# Verify backup integrity
cmp original.data backup.data && echo "Backup verified"

# Find first difference position
cmp -l file1 file2 | head -1
```


### **ld** - Linker**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ld, linker]
synonyms: [ld]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Link object files and libraries into executables
**Location**: `/usr/bin/ld`
**Common Use Cases**:

- Custom linking requirements
- Embedded systems development
- Library creation
- Low-level system programming

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic linking
ld -o program crt0.o main.o -lc

# Link with specific library path
ld -L/usr/local/lib -o program main.o -lcustom

# Create shared library
ld -shared -o libmath.so math1.o math2.o

# Static linking
ld -static -o program main.o -lm

# Set entry point
ld -e _start -o program main.o

# Generate map file
ld -Map=program.map -o program main.o

# Link script
ld -T custom.lds -o program main.o

# Cross-platform linking
ld -m elf_i386 -o program main.o

# Dynamic linker
ld -dynamic-linker /lib64/ld-linux-x86-64.so.2 -o program main.o

# Version script
ld --version-script=version.map -shared -o lib.so objects.o

# Note: Usually called indirectly through gcc/clang
gcc -Wl,-Map=output.map -o program main.c
```


### **ar** - Archive Manager (Enhanced)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ar, archive manager (enhanced)]
synonyms: [ar]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Create, modify, and extract from archive files
**Location**: `/usr/bin/ar`
**Common Use Cases**:

- Static library creation
- Object file archiving
- Embedded development
- Package building

**See Also**: Related tools in this category

**Examples**:

```bash
# Create archive with symbol table
ar rcs libmath.a add.o sub.o mul.o div.o

# Add files to existing archive
ar r libmath.a newmath.o

# List archive contents
ar t libmath.a

# Verbose listing with details
ar tv libmath.a

# Extract files from archive
ar x libmath.a
ar x libmath.a specific.o  # extract specific file

# Delete files from archive
ar d libmath.a obsolete.o

# Replace files in archive
ar r libmath.a updated.o

# Insert files before specific member
ar ib existing.o libmath.a new.o

# Insert files after specific member
ar ia existing.o libmath.a new.o

# Create deterministic archive (reproducible builds)
ar rcsD libmath.a *.o

# Show symbol table
ar s libmath.a

# Thin archive (references instead of copies)
ar rcT libmath.a *.o

# Quick append
ar q libmath.a new.o

# Update only newer files
ar ru libmath.a *.o
```


### **ranlib** - Archive Index Generator**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ranlib, archive index generator]
synonyms: [ranlib]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Generate index for archive files
**Location**: `/usr/bin/ranlib`
**Common Use Cases**:

- Optimize library linking
- Archive maintenance
- Build system integration
- Legacy compatibility

**See Also**: Related tools in this category

**Examples**:

```bash
# Add symbol table to archive
ranlib libmath.a

# Verbose output
ranlib -v libmath.a

# Update multiple archives
ranlib lib*.a

# Check if archive needs updating
ranlib -t libmath.a

# Use in Makefiles
libmath.a: $(OBJECTS)
 ar rcs $@ $^
 ranlib $@

# Modern alternative (ar with 's' flag)
ar rcs libmath.a *.o  # includes ranlib functionality
```


### **ldd** - Shared Library Dependencies**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ldd, shared library dependencies]
synonyms: [ldd]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Print shared library dependencies
**Location**: `/usr/bin/otool -L` (macOS equivalent)
**Common Use Cases**:

- Dependency analysis
- Deployment preparation
- Library troubleshooting
- Security auditing

**See Also**: Related tools in this category

**Examples**:

```bash
# Show shared library dependencies (macOS)
otool -L program

# Show all dependencies recursively
otool -L program | grep -v ":" | xargs -I {} otool -L {}

# Check if library is dynamically linked
otool -L program | grep libname

# Verify library paths
otool -L program

# Show library load commands
otool -l program | grep -A 5 LC_LOAD_DYLIB

# Alternative with nm for symbols
nm -D program | grep "U "

# Check for missing libraries
for lib in $(otool -L program | awk '{print $1}' | grep -v ":"); do
    if [ ! -f "$lib" ]; then
        echo "Missing: $lib"
    fi
done

# Linux equivalent (if available)
# ldd program
# ldd -v program  # verbose
# ldd -d program  # missing dependencies
# ldd -r program  # missing symbols
```


### **python3** - Python Interpreter**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [python3, python interpreter]
synonyms: [python3]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Python 3 programming language interpreter
**Location**: `/Users/allen/.pyenv/shims/python3`
**Common Use Cases**:

- Script execution
- Interactive development
- Module and package management

**See Also**: Related tools in this category

**Examples**:

```bash
# Run script
python3 script.py

# Interactive REPL
python3

# Run module
python3 -m http.server

# Install packages
python3 -m pip install package
```


### **python** - Python Interpreter (Generic)
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐ Beginner
aliases: [python3, py, python2]
tags: [#essential, #development, #programming, #scripting, #interpreted]
related: [pip, python3, virtualenv, conda]
keywords: [python, interpreter, scripting, programming, language, interactive, repl]
synonyms: [python3, py, python-interpreter, python-repl]
platform: [macOS, Linux, Windows]
installation: Built-in (macOS), brew install python
-->
**Description**: Python programming language interpreter (version may vary)
**Location**: `/Users/allen/.pyenv/shims/python`
**Difficulty**: ⭐⭐ Beginner (Readable syntax, extensive libraries)
**Common Use Cases**:

- Quick scripting and automation
- Data analysis and processing
- System administration
- Educational programming

**See Also**: Related tools in this category

**Examples**:

```bash
# Check Python version
python --version

# Run Python script
python script.py

# Interactive mode
python

# One-liner operations
python -c "print('Hello, World!')"
python -c "import math; print(math.pi)"

# Text processing
python -c "import sys; print(sys.stdin.read().upper())" < file.txt

# Mathematical operations
python -c "print(sum(range(1, 101)))"   # Sum 1-100
python -c "import random; print(random.randint(1, 100))"

# JSON processing
python -c "import json, sys; print(json.load(sys.stdin)['key'])" < data.json

# File operations
python -c "with open('file.txt') as f: print(len(f.readlines()))"

# HTTP server (quick web server)
python -m http.server 8000

# Install packages
python -m pip install package_name

# List installed packages
python -m pip list
```


### **perl** - Perl Programming Language
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [perl, perl programming language]
synonyms: [perl]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Practical Extraction and Reporting Language interpreter
**Location**: `/usr/bin/perl`
**Difficulty**: ⭐⭐⭐⭐ Advanced (Complex syntax and extensive features)
**Common Use Cases**:

- Text processing and parsing
- System administration scripts
- Regular expression operations
- Legacy system maintenance

**See Also**: Related tools in this category

**Examples**:

```bash
# Run Perl script
perl script.pl

# One-liner text processing
perl -pe 's/old/new/g' file.txt         # Replace text
perl -lane 'print $F[0]' file.txt       # Print first column
perl -ne 'print if /pattern/' file.txt  # Print matching lines

# Regular expressions
perl -pe 's/(\d{4})-(\d{2})-(\d{2})/$2\/$3\/$1/g' dates.txt  # Reformat dates

# Text manipulation
perl -i -pe 's/foo/bar/g' *.txt         # In-place editing
perl -00 -pe 's/\n/ /g' file.txt        # Join paragraphs
perl -F: -lane 'print $F[0]' /etc/passwd # Parse colon-separated

# Data extraction
perl -MJSON -ne 'print decode_json($_)->{key}' data.json
perl -MXML::Simple -e 'print XMLin("file.xml")->{element}'

# File operations
perl -e 'print "Hello\n" x 5'           # Print repeated text
perl -e 'print join("\n", reverse <>)' file.txt  # Reverse file lines

# Interactive mode (debugger)
perl -d script.pl
```


### **ruby** - Ruby Programming Language
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ruby, ruby programming language  ]
synonyms: [ruby]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Dynamic, open source programming language with focus on simplicity
**Location**: `/usr/bin/ruby`
**Difficulty**: ⭐⭐⭐ Intermediate (Object-oriented with readable syntax)
**Common Use Cases**:

- Web development (Rails)
- Automation scripts
- System administration
- Quick scripting tasks

**See Also**: Related tools in this category

**Examples**:

```bash
# Run Ruby script
ruby script.rb

# One-liner operations
ruby -e 'puts "Hello World"'            # Print text
ruby -pe '$_.upcase!' file.txt          # Convert to uppercase
ruby -ne 'puts $_ if $_.match(/pattern/)' file.txt  # Pattern matching

# Text processing
ruby -pe '$_.gsub!(/old/, "new")' file.txt  # Replace text
ruby -lane 'puts $F[0]' file.txt        # Print first field
ruby -e 'puts ARGF.readlines.reverse' file.txt  # Reverse lines

# JSON processing
ruby -rjson -e 'puts JSON.parse(STDIN.read)["key"]' < data.json

# Interactive Ruby shell
irb

# Mathematical operations
ruby -e 'puts (1..100).sum'             # Sum of numbers 1-100
ruby -e 'puts Math.sqrt(144)'           # Square root

# File operations
ruby -e 'Dir["*.txt"].each {|f| puts File.size(f)}' # File sizes
ruby -e 'puts File.readlines("file.txt").size'      # Line count
```


### **swift** - Swift Programming Language
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [swift, swift programming language]
synonyms: [swift]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Apple's powerful and intuitive programming language
**Location**: `/usr/bin/swift`
**Difficulty**: ⭐⭐⭐ Intermediate (Modern syntax, Apple ecosystem)
**Common Use Cases**:

- iOS/macOS app development
- Server-side development
- System scripting
- Command-line tools

**See Also**: Related tools in this category

**Examples**:

```bash
# Run Swift script
swift script.swift

# Interactive Swift REPL
swift

# Compile Swift program
swiftc program.swift -o program

# One-liner Swift execution
swift -e 'print("Hello, World!")'

# File processing
swift -e 'import Foundation; let content = try String(contentsOfFile: "file.txt"); print(content.uppercased())'

# JSON processing
swift -e 'import Foundation; let data = Data("{}".utf8); let json = try JSONSerialization.jsonObject(with: data)'

# Mathematical operations
swift -e 'print(Array(1...100).reduce(0, +))'  # Sum 1-100

# Package manager
swift package init                      # Initialize package
swift build                           # Build package
swift test                            # Run tests
swift run                             # Run executable

# Swift format (if available)
swift-format source.swift
```


### **node** - Node.js Runtime**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: [nodejs]
tags: [#essential, #development, #programming, #javascript, #runtime]
related: [npm, yarn, pnpm, bun]
keywords: [node, nodejs, javascript, runtime, v8, server-side, async, event-driven]
synonyms: [nodejs, js-runtime, javascript-runtime, node-runtime]
platform: [macOS, Linux, Windows]
installation: brew install node
-->
**Description**: JavaScript runtime built on V8 engine
**Location**: `/opt/homebrew/bin/node`
**Common Use Cases**:

- JavaScript execution outside browser
- Server-side development
- Build tool execution

**See Also**: Related tools in this category

**Examples**:

```bash
# Run JavaScript file
node script.js

# Interactive REPL
node

# Debug with inspector
node --inspect script.js
```



### **otool** - Object File Display (macOS)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [otool, object file display (macos)]
synonyms: [otool]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Object file displaying tool for macOS
**Location**: `/usr/bin/otool`
**Common Use Cases**:

- Mach-O file analysis
- Dependency inspection
- Architecture information
- Code analysis

**See Also**: `nm` (symbol dump), `objdump` (object dump), `file` (file type)

**Examples**:

```bash
# Show header information
otool -h binary_file

# Show library dependencies
otool -L binary_file

# Disassemble text section
otool -t binary_file

# Show load commands
otool -l binary_file

# Show shared library
otool -D library.dylib

# Show all sections
otool -s __TEXT __text binary_file

# Verbose output
otool -v -t binary_file

# Show architectures
otool -f binary_file
```


### **hyperfine** - Command-Line Benchmarking Tool
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [hyperfine, command-line benchmarking tool]
synonyms: [hyperfine]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: A command-line benchmarking tool with statistical analysis
**Location**: `/opt/homebrew/bin/hyperfine`
**Difficulty**: ⭐⭐ Beginner (Basic benchmarks) / ⭐⭐⭐ Intermediate (Statistical analysis)
**Common Use Cases**:

- Performance benchmarking of commands
- Comparing alternative implementations
- Performance regression testing
- Optimization validation

**See Also**: `time` (basic timing), `perf` (Linux performance profiling), `dtrace` (macOS system tracing)

**Examples**:

```bash
# Basic benchmark
hyperfine 'sleep 1'

# Compare multiple commands
hyperfine 'grep pattern file.txt' 'rg pattern file.txt' 'ag pattern file.txt'

# Benchmark with warm-up runs
hyperfine --warmup 3 'python script.py'

# Set number of runs for better statistics
hyperfine --runs 50 'quick_command'

# Benchmark with parameters
hyperfine 'sort {}.txt' --parameter-list filename file1,file2,file3

# Export results to different formats
hyperfine --export-json results.json 'command1' 'command2'
hyperfine --export-csv results.csv 'command1' 'command2'
hyperfine --export-markdown results.md 'command1' 'command2'

# Set preparation and cleanup commands
hyperfine --prepare 'make clean' --cleanup 'rm -f *.o' 'make'

# Ignore exit codes (for commands that may fail)
hyperfine --ignore-failure 'unreliable_command'

# Show output of benchmarked commands
hyperfine --show-output 'ls -la'

# Compare build systems
hyperfine 'make clean && make' 'ninja -t clean && ninja'

# Database query performance
hyperfine --warmup 1 \
  'psql -c "SELECT * FROM users LIMIT 1000"' \
  'psql -c "SELECT * FROM users WHERE active = true LIMIT 1000"'

# Algorithm comparison
hyperfine 'python bubble_sort.py' 'python quick_sort.py' 'python merge_sort.py'

# Compiler optimization levels
hyperfine 'gcc -O0 program.c -o test && ./test' \
          'gcc -O2 program.c -o test && ./test' \
          'gcc -O3 program.c -o test && ./test'
```


### **tokei** - Code Statistics Tool
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [tokei, code statistics tool]
synonyms: [tokei]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Fast and accurate code statistics tool that counts lines of code
**Location**: `/opt/homebrew/bin/tokei`
**Difficulty**: ⭐⭐ Beginner (Basic counting) / ⭐⭐⭐ Intermediate (Custom output formats)
**Common Use Cases**:

- Project size analysis and metrics
- Code base assessment for documentation
- Language breakdown in multi-language projects
- Development progress tracking

**See Also**: `cloc` (alternative code counter), `wc` (basic line counting), `scc` (fast code counter)

**Examples**:

```bash
# Basic code statistics
tokei                        # Count code in current directory
tokei /path/to/project      # Count code in specific directory
tokei --files               # Show per-file statistics

# Language-specific analysis
tokei --type rust           # Count only Rust files
tokei --type python,javascript  # Count specific languages
tokei --exclude "*.test.js" # Exclude test files

# Output formats
tokei --output json         # JSON output for scripting
tokei --output yaml         # YAML format
tokei --output cbor         # Compact binary format

# Sorting and filtering
tokei --sort lines          # Sort by lines of code
tokei --sort files          # Sort by number of files
tokei --sort blanks         # Sort by blank lines

# Detailed analysis
tokei --verbose             # Show detailed breakdown
tokei --no-ignore          # Include all files (ignore .gitignore)
tokei --hidden              # Include hidden files and directories

# Custom exclusions
tokei --exclude="target/*"  # Exclude build directories
tokei --exclude="node_modules/*" "*.min.js"  # Exclude multiple patterns

# Integration examples
tokei --output json | jq '.Total.code'  # Extract total lines with jq
tokei | grep -E "(Rust|Python|JavaScript)"  # Filter specific languages
```


### **cloc** - Count Lines of Code (Classic Tool)
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [cloc, count lines of code (classic t]
synonyms: [cloc]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Classic and comprehensive tool for counting source lines of code
**Location**: `/opt/homebrew/bin/cloc`
**Difficulty**: ⭐⭐ Beginner (Basic usage) / ⭐⭐⭐ Intermediate (Advanced filtering)
**Common Use Cases**:

- Detailed code analysis and reporting
- Legacy project assessment
- Academic research and documentation
- Cross-project comparison

**See Also**: `tokei` (modern alternative), `scc` (fast counter), `wc` (basic counting)

**Examples**:

```bash
# Basic usage
cloc .                      # Count code in current directory
cloc /path/to/project       # Count code in specific directory
cloc file1.py file2.js      # Count specific files

# Language analysis
cloc --by-file              # Show per-file breakdown
cloc --by-file-by-lang      # Group by language and file
cloc --show-lang            # List supported languages
cloc --force-lang=Python script.txt  # Force language detection

# Output formats
cloc --csv                  # CSV output for spreadsheets
cloc --xml                  # XML format
cloc --json                 # JSON format
cloc --yaml                 # YAML format

# Filtering and exclusions
cloc --exclude-dir=node_modules,target  # Exclude directories
cloc --exclude-ext=min.js   # Exclude file extensions
cloc --ignore-whitespace    # More aggressive blank line detection
cloc --exclude-list-file=exclude.txt    # Use exclusion file

# Comparison and diff
cloc --diff old_version/ new_version/   # Compare two versions
cloc --git --diff HEAD~1 HEAD          # Compare git commits
cloc --sum-reports report1.txt report2.txt  # Combine multiple reports

# Advanced features
cloc --strip-comments=nc    # Remove comments and rewrite files
cloc --stat                 # Show processing statistics
cloc --progress-rate=10     # Show progress every 10 files
cloc --quiet                # Suppress progress messages

# Integration examples
cloc --csv . > code_stats.csv          # Export to spreadsheet
cloc --json . | jq '.SUM.code'         # Extract total with jq
find . -name "*.py" | cloc --list-file=-  # Use with find command
```


### **scc** - Sloc, Cloc and Code
<!-- metadata:
category: Development Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#programming, #development, #modern-alternative, #statistics]
related: [tokei, cloc, wc, loc]
keywords: [scc, sloc, cloc, code, counter, statistics, lines, complexity]
synonyms: [code-counter, line-counter, sloc-counter, fast-cloc]
platform: [macOS, Linux, Windows]
installation: brew install scc
-->
**Description**: Ultra-fast and accurate code counter with complexity calculations
**Location**: `/opt/homebrew/bin/scc`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- Rapid code statistics generation
- Complexity analysis
- Large codebase assessment
- CI/CD metrics collection
- Multi-repository analysis

**See Also**: `tokei` (Rust alternative), `cloc` (classic tool), `wc` (basic counting), `loc` (simple counter)

**Examples**:

```bash
# Basic usage
scc                         # Count code in current directory
scc /path/to/project       # Count code in specific path
scc file1.js file2.py      # Count specific files

# Output formats
scc --format json          # JSON output for parsing
scc --format csv           # CSV for spreadsheets
scc --format html          # HTML report
scc --format sql           # SQL insert statements
scc --format wide          # Wide terminal format

# Filtering and exclusions
scc --exclude-dir node_modules,vendor  # Exclude directories
scc --include-ext go,rs,js            # Include only specific extensions
scc --not-match "test|spec"           # Exclude files matching pattern
scc --no-ignore                       # Don't respect .gitignore

# Complexity and duplicates
scc --no-complexity        # Skip complexity calculations (faster)
scc --no-duplicates       # Skip duplicate detection
scc --dupe-threshold 50   # Set duplicate detection threshold

# Performance options
scc --threads 8           # Use 8 threads (default: CPU count)
scc --file-gc-count 1000  # Garbage collect after N files

# Advanced analysis
scc --by-file             # Show per-file breakdown
scc --sort complexity     # Sort by complexity
scc --sort lines         # Sort by lines
scc --top 10            # Show only top 10 results

# Size filtering
scc --min-file-size 100   # Skip files smaller than 100 bytes
scc --max-file-size 50000 # Skip files larger than 50KB

# Git integration
scc --git-ignore         # Respect .gitignore (default)
scc --no-git            # Disable git features
scc --remap-all         # Remap all language names

# Comparison with other tools
# scc is typically 10-100x faster than cloc
time scc                 # Fast execution
time cloc .             # Compare with cloc
time tokei              # Compare with tokei

# CI/CD integration
scc --format json | jq '.[] | select(.Name=="Go") | .Code'  # Extract Go lines
scc --ci                # Exit with error if no files found
```

---


### **pyenv** - Python Version Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#python, #version-manager, #development, #environment]
related: [rbenv, nvm, asdf, virtualenv, pip3]
keywords: [pyenv, python version manager, python versions, multiple python, python switcher]
synonyms: [python-version-manager, python-env]
platform: [macOS, Linux]
installation: brew install pyenv
-->
**Description**: Simple Python version management tool - switch between multiple Python versions
**Location**: `/opt/homebrew/bin/pyenv`
**Common Use Cases**:

- Managing multiple Python versions per project
- Testing code across Python versions
- Installing Python versions without sudo
- Per-directory Python version switching
- CI/CD environment consistency

**Why Essential**: Different projects require different Python versions. pyenv allows seamless switching without system-level conflicts.

**See Also**: `rbenv` (Ruby), `nvm` (Node.js), `asdf` (multi-language), `virtualenv` (virtual environments)

**Examples**:

```bash
# Installation and setup
brew install pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

# List available Python versions
pyenv install --list                 # All available versions
pyenv install --list | grep "^  3\." # Python 3.x versions only

# Install Python versions
pyenv install 3.11.5                 # Install specific version
pyenv install 3.12.0                 # Install Python 3.12
pyenv install 2.7.18                 # Install Python 2 (legacy)

# List installed versions
pyenv versions                       # Show all installed versions
pyenv version                        # Show currently active version

# Set Python version
pyenv global 3.11.5                  # Set global default version
pyenv local 3.12.0                   # Set version for current directory (creates .python-version)
pyenv shell 3.10.0                   # Set version for current shell session

# Check active version
python --version                     # Check Python version
which python                         # Show Python binary path
pyenv which python                   # Show full path to active Python

# Uninstall versions
pyenv uninstall 3.9.0                # Remove a Python version

# Refresh shims (after installing packages with new executables)
pyenv rehash                         # Rebuild shim executables

# Update pyenv itself
brew upgrade pyenv                   # Update via Homebrew

# Per-project version management
cd ~/my-project
pyenv local 3.11.5                   # Creates .python-version file
cat .python-version                  # Shows: 3.11.5
python --version                     # Now uses Python 3.11.5

# Multiple versions for testing
pyenv install 3.9.0 3.10.0 3.11.0 3.12.0
pyenv local 3.11.0 3.10.0            # Set multiple versions

# Integration with virtualenv
pip install pyenv-virtualenv          # Plugin for virtual environments
pyenv virtualenv 3.11.5 myproject    # Create virtualenv
pyenv activate myproject             # Activate virtualenv
pyenv deactivate                     # Deactivate

# Development workflow
cd ~/new-project
pyenv local 3.12.0                   # Set project Python version
python -m venv venv                  # Create virtual environment
source venv/bin/activate             # Activate venv
pip install -r requirements.txt      # Install dependencies
```

---


### **rbenv** - Ruby Version Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#ruby, #version-manager, #development, #environment]
related: [pyenv, nvm, asdf, gem, bundler]
keywords: [rbenv, ruby version manager, ruby versions, multiple ruby, ruby switcher]
synonyms: [ruby-version-manager, ruby-env]
platform: [macOS, Linux]
installation: brew install rbenv
-->
**Description**: Simple Ruby version management tool - switch between multiple Ruby versions
**Location**: `/opt/homebrew/bin/rbenv`
**Common Use Cases**:

- Managing multiple Ruby versions per project
- Testing gems across Ruby versions
- Installing Ruby versions without sudo
- Per-directory Ruby version switching
- Rails development with specific Ruby requirements

**Why Essential**: Different Ruby projects require different Ruby versions. rbenv provides clean, conflict-free version management.

**See Also**: `pyenv` (Python), `nvm` (Node.js), `asdf` (multi-language), `bundler` (Ruby dependencies)

**Examples**:

```bash
# Installation and setup
brew install rbenv ruby-build
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc

# List available Ruby versions
rbenv install --list                 # All available versions
rbenv install --list | grep "^3\."  # Ruby 3.x versions only

# Install Ruby versions
rbenv install 3.2.2                  # Install specific version
rbenv install 3.3.0                  # Install latest Ruby 3.3
rbenv install 2.7.8                  # Install Ruby 2.7 (legacy)

# List installed versions
rbenv versions                       # Show all installed versions
rbenv version                        # Show currently active version

# Set Ruby version
rbenv global 3.2.2                   # Set global default version
rbenv local 3.3.0                    # Set version for current directory (creates .ruby-version)
rbenv shell 3.1.0                    # Set version for current shell session

# Check active version
ruby --version                       # Check Ruby version
which ruby                           # Show Ruby binary path
rbenv which ruby                     # Show full path to active Ruby

# Uninstall versions
rbenv uninstall 3.0.0                # Remove a Ruby version

# Refresh shims (after installing gems with executables)
rbenv rehash                         # Rebuild shim executables

# Update rbenv itself
brew upgrade rbenv ruby-build        # Update via Homebrew

# Per-project version management
cd ~/my-rails-app
rbenv local 3.2.2                    # Creates .ruby-version file
cat .ruby-version                    # Shows: 3.2.2
ruby --version                       # Now uses Ruby 3.2.2

# Development workflow with Bundler
cd ~/new-rails-project
rbenv local 3.3.0                    # Set project Ruby version
gem install bundler                  # Install Bundler
bundle install                       # Install project dependencies
rbenv rehash                         # Rebuild shims for new executables

# Common gem management
gem install rails                    # Install Rails gem
gem list                             # List installed gems
gem update --system                  # Update RubyGems
rbenv rehash                         # Update shims after gem installs

# Multiple Ruby versions for testing
rbenv install 3.1.0 3.2.0 3.3.0
rbenv versions                       # List all installed
```

---


### **nvm** - Node Version Manager**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#nodejs, #javascript, #version-manager, #development, #environment]
related: [pyenv, rbenv, asdf, npm, yarn]
keywords: [nvm, node version manager, node versions, multiple node, nodejs switcher]
synonyms: [node-version-manager, nodejs-version-manager]
platform: [macOS, Linux]
installation: brew install nvm
-->
**Description**: Node Version Manager - manage multiple Node.js versions
**Location**: `~/.nvm/nvm.sh` (sourced in shell config)
**Common Use Cases**:

- Managing multiple Node.js versions per project
- Testing applications across Node versions
- Switching between LTS and current releases
- Per-directory Node version switching
- Frontend development with specific Node requirements

**Why Essential**: JavaScript projects often require specific Node.js versions. nvm enables seamless version management.

**See Also**: `pyenv` (Python), `rbenv` (Ruby), `asdf` (multi-language), `npm` (package manager)

**Examples**:

```bash
# Installation (via Homebrew on macOS)
brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"' >> ~/.zshrc

# List available Node versions
nvm ls-remote                        # All available versions
nvm ls-remote --lts                  # LTS versions only
nvm ls-remote | grep "Latest LTS"    # Latest LTS versions

# Install Node versions
nvm install node                     # Install latest version
nvm install --lts                    # Install latest LTS version
nvm install 20                       # Install latest Node 20.x
nvm install 18.17.0                  # Install specific version
nvm install 16                       # Install Node 16.x

# List installed versions
nvm ls                               # Show all installed versions
nvm current                          # Show currently active version

# Switch Node version
nvm use 20                           # Use Node 20.x
nvm use 18.17.0                      # Use specific version
nvm use --lts                        # Use latest LTS version
nvm use node                         # Use latest installed version

# Set default version
nvm alias default 20                 # Set default to Node 20
nvm alias default node               # Set default to latest version
nvm alias default --lts              # Set default to LTS

# Check active version
node --version                       # Check Node.js version
npm --version                        # Check npm version
which node                           # Show Node binary path

# Uninstall versions
nvm uninstall 16                     # Remove Node 16.x
nvm uninstall 18.15.0                # Remove specific version

# Per-project version management (.nvmrc file)
cd ~/my-project
echo "20.9.0" > .nvmrc               # Create .nvmrc file
nvm use                              # Use version from .nvmrc
nvm install                          # Install version from .nvmrc if not present

# Auto-switching with .nvmrc (add to ~/.zshrc)
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  fi
}
add-zsh-hook chpwd load-nvmrc        # Auto-switch on directory change

# Running commands with specific version
nvm exec 18 node app.js              # Run app with Node 18
nvm exec 20 npm test                 # Run tests with Node 20

# Development workflow
cd ~/new-project
nvm install 20                       # Install Node 20
nvm use 20                           # Use Node 20
echo "20" > .nvmrc                   # Save version for project
npm init -y                          # Initialize package.json
npm install express                  # Install dependencies

# Multiple versions for testing
nvm install 16 18 20
nvm use 16 && npm test              # Test with Node 16
nvm use 18 && npm test              # Test with Node 18
nvm use 20 && npm test              # Test with Node 20

# Migration helpers
nvm reinstall-packages 18            # Reinstall packages from Node 18 to current version
```

---


### **watchman** - File Watching Service**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#file-watcher, #development, #build-tools, #react-native, #facebook]
related: [fswatch, nodemon, chokidar]
keywords: [watchman, file watcher, file monitoring, react native, build automation, file changes]
synonyms: [file-watcher, filesystem-watcher]
platform: [macOS, Linux, Windows]
installation: brew install watchman
-->
**Description**: File watching service by Meta (Facebook) - monitors files and triggers actions on changes
**Location**: `/opt/homebrew/bin/watchman`
**Common Use Cases**:

- React Native development (required dependency)
- Build automation and live reload
- File system monitoring for large projects
- Test runners with watch mode
- Hot module replacement (HMR)
- Development server auto-restart

**Why Essential**: Required for React Native and many JavaScript build tools. More efficient than native file watching for large codebases.

**See Also**: `nodemon` (Node.js auto-restart), `fswatch` (simpler alternative), `chokidar` (Node.js library)

**Examples**:

```bash
# Installation
brew install watchman

# Version and info
watchman version                     # Show version
watchman get-sockname                # Show socket path

# Watch directories
watchman watch ~/my-project          # Start watching directory
watchman watch-list                  # List watched directories
watchman watch-del ~/my-project      # Stop watching directory
watchman watch-del-all               # Stop watching all directories

# Triggers (run commands on file changes)
watchman -- trigger ~/my-project build '*.js' -- npm run build
watchman trigger-list ~/my-project   # List triggers for directory
watchman trigger-del ~/my-project build  # Delete trigger

# Query file changes
watchman find ~/my-project '*.js'    # Find all .js files
watchman find ~/my-project -name '*.test.js'  # Find test files

# React Native usage (typically automatic)
watchman watch-del-all               # Clear watches (troubleshooting)
watchman shutdown-server             # Restart watchman server
npx react-native start               # Watchman used automatically

# State and diagnostics
watchman watch-list                  # Show all watched roots
watchman get-config ~/my-project     # Get watch configuration
watchman clock ~/my-project          # Get current clock value

# Performance tuning
# Increase file descriptor limits for large projects
ulimit -n 10240

# Troubleshooting React Native
watchman watch-del-all && rm -rf $TMPDIR/react-* && npm start

# Debugging
watchman --log-level=2               # Enable verbose logging
watchman debug-show-cursors          # Show watch cursors
```

---


### **swiftlint** - Swift Code Linter**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#swift, #linter, #ios, #macos, #code-quality, #apple]
related: [eslint, rubocop, pylint]
keywords: [swiftlint, swift linter, swift code quality, ios development, swift style, swift formatting]
synonyms: [swift-linter, swift-lint]
platform: [macOS]
installation: brew install swiftlint
-->
**Description**: Tool to enforce Swift style and conventions
**Location**: `/opt/homebrew/bin/swiftlint`
**Common Use Cases**:

- Enforcing Swift coding standards
- iOS/macOS app development
- Code review automation
- CI/CD quality checks
- Team code consistency
- Xcode integration

**Why Essential**: Essential for Swift/iOS development teams to maintain code quality and consistency across projects.

**See Also**: `eslint` (JavaScript), `rubocop` (Ruby), `pylint` (Python)

**Examples**:

```bash
# Installation
brew install swiftlint

# Basic usage
swiftlint                            # Lint current directory
swiftlint lint                       # Explicit lint command
swiftlint --path Sources/            # Lint specific directory

# Configuration
swiftlint rules                      # List all available rules
swiftlint generate-docs              # Generate rule documentation

# Auto-fix violations
swiftlint --fix                      # Auto-fix violations
swiftlint --fix --format             # Fix and format

# Strict mode
swiftlint --strict                   # Treat warnings as errors

# Output formats
swiftlint --reporter json            # JSON output
swiftlint --reporter csv             # CSV output
swiftlint --reporter checkstyle      # Checkstyle XML
swiftlint --reporter junit           # JUnit XML
swiftlint --reporter html            # HTML report
swiftlint --reporter xcode           # Xcode format (default)

# Configuration file (.swiftlint.yml)
cat > .swiftlint.yml << 'EOF'
disabled_rules:
  - trailing_whitespace
  - line_length
opt_in_rules:
  - empty_count
  - missing_docs
included:
  - Sources
excluded:
  - Carthage
  - Pods
  - vendor
line_length:
  warning: 120
  error: 200
identifier_name:
  min_length: 2
  max_length: 50
EOF

# Xcode integration (Run Script Phase)
# Add this to Xcode Build Phases -> New Run Script Phase:
if which swiftlint >/dev/null; then
  swiftlint
else
  echo "warning: SwiftLint not installed"
fi

# CI/CD integration
swiftlint lint --strict --reporter json > swiftlint-result.json

# Custom configuration
swiftlint --config custom-swiftlint.yml

# Version check
swiftlint version                    # Show version

# Analyze specific files
swiftlint lint --path MyFile.swift   # Lint single file

# Common workflow
cd ~/MyiOSApp
swiftlint                            # Check for violations
swiftlint --fix                      # Auto-fix what's possible
swiftlint --strict                   # Verify no violations remain
```

---


### **openjdk** - Open Java Development Kit**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Development Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: [java, javac]
tags: [#java, #jdk, #development, #compiler, #jvm]
related: [maven, gradle, kotlin, scala]
keywords: [openjdk, java, jdk, java development kit, javac, java compiler, jvm]
synonyms: [java-jdk, jdk, java-development-kit]
platform: [macOS, Linux, Windows]
installation: brew install openjdk
-->
**Description**: Open-source Java Development Kit - compile and run Java applications
**Location**: `/opt/homebrew/opt/openjdk/bin/java`
**Common Use Cases**:

- Java application development
- Running Java applications
- Android development
- Enterprise software development
- Build tool execution (Maven, Gradle)
- JVM language development (Kotlin, Scala)

**Why Essential**: Java remains one of the most widely-used programming languages for enterprise and Android development.

**See Also**: `mvn` (Maven), `gradle` (Gradle), `kotlin` (Kotlin compiler)

**Examples**:

```bash
# Installation
brew install openjdk
sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk

# Version check
java --version                       # Java runtime version
javac --version                      # Java compiler version

# Compile Java programs
javac HelloWorld.java                # Compile single file
javac -d bin src/*.java              # Compile to bin directory
javac -cp lib/*:. MyApp.java         # Compile with classpath

# Run Java programs
java HelloWorld                      # Run compiled class
java -jar myapp.jar                  # Run JAR file
java -cp bin:lib/* com.example.Main  # Run with classpath

# Create JAR files
jar cvf myapp.jar -C bin .           # Create JAR from bin directory
jar cvfe myapp.jar Main -C bin .     # Create executable JAR with main class
jar tf myapp.jar                     # List JAR contents
jar xf myapp.jar                     # Extract JAR contents

# JVM options
java -Xmx4g -jar myapp.jar           # Set max heap to 4GB
java -Xms512m -Xmx2g MyApp           # Set initial and max heap
java -XX:+UseG1GC -jar myapp.jar     # Use G1 garbage collector

# Debugging
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar myapp.jar

# System properties
java -Dproperty=value MyApp          # Set system property
java -version                        # Show version
java -XshowSettings:all              # Show all JVM settings

# Module system (Java 9+)
java --list-modules                  # List available modules
java -p modulepath -m module/Main    # Run modular application

# Common development workflow
mkdir -p src/com/example
cat > src/com/example/Hello.java << 'EOF'
package com.example;
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
EOF

javac -d bin src/com/example/Hello.java
java -cp bin com.example.Hello

# Environment variables
export JAVA_HOME=$(/usr/libexec/java_home)  # Set JAVA_HOME (macOS)
export PATH="$JAVA_HOME/bin:$PATH"          # Add to PATH
```

---

