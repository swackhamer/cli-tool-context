## Output Manipulation & Utilities


<!-- metadata:
category: Output Manipulation & Utilities
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#ai, #llm, #cli, #productivity]
related: [aichat, gh-copilot, python]
keywords: [llm, language-model, ai, gpt, claude, cli, simon-willison]
synonyms: [llm-cli, language-model-cli, ai-models]
platform: [macOS, Linux, Windows]
installation: pip install llm
-->
**Description**: Command-line tool for interacting with large language models, created by Simon Willison
**Location**: `~/.local/bin/llm` or `/opt/homebrew/bin/llm`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- LLM interaction and experimentation
- Model comparison
- Prompt engineering
- Data analysis with AI
- Plugin ecosystem

**See Also**: `aichat` (multi-provider), `gh copilot` (GitHub AI), `python` (for scripting)

**Examples**:

```bash
# Installation and setup
pip install llm
llm keys set openai  # Enter API key when prompted
llm keys set anthropic  # Add other providers

# Basic usage
llm "What is Docker?"
echo "Explain this error" | llm
llm "Summarize" < article.txt

# Model selection
llm -m gpt-4 "Complex question"
llm -m claude-3-opus "Write a poem"
llm -m gpt-3.5-turbo "Quick question"
llm models  # List available models

# System prompts
llm "Review this code" -s "You are a senior Python developer"
llm "Translate to Spanish" -s "You are a professional translator"

# Templates and saved prompts
llm "Fix grammar" --save grammar
llm "Check spelling" --template grammar

# Conversations
llm "Start a story about a robot"
llm -c "Continue the story"  # Continue last conversation
llm logs -n 3  # Show last 3 conversations

# Plugins
llm install llm-python  # Python code execution
llm install llm-cmd  # Run system commands
llm install llm-gemini  # Google Gemini support
llm plugins  # List installed plugins

# Python plugin usage
llm python "Calculate fibonacci(10)"
llm python "Read CSV and show summary" -a data.csv

# Embeddings
llm embed -m ada-002 "Text to embed"
llm similar "Query text" documents.db

# Database storage
llm logs  # View conversation history
llm logs -n 5 --json  # Last 5 as JSON
llm logs --search "Docker"  # Search history

# Advanced usage
# Chain commands
cat data.json | llm "Analyze" | llm "Summarize findings"

# Batch processing
for file in *.py; do
  llm "Review and score 1-10" < "$file" >> reviews.txt
done

# Configuration
llm config  # Show configuration
llm config set default_model gpt-4
llm config set max_tokens 2000

# Environment variables
export LLM_DEFAULT_MODEL="gpt-4"
export LLM_TEMPERATURE="0.7"

# Practical examples
git diff | llm "Review changes and suggest improvements"
llm "Generate SQL" -s "Database: PostgreSQL" | psql mydb
docker logs myapp 2>&1 | llm "Debug this error"
curl -s api.example.com | llm "Extract important fields"
```

---


This section demonstrates real-world workflows that combine multiple CLI tools to accomplish common development and system administration tasks.

### **shuf** - Shuffle Lines (GNU Tool)**Location**: `/usr/bin/shuf`
**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Output Manipulation & Utilities
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [shuf, shuffle lines (gnu tool)]
synonyms: [shuf]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Randomly permute input lines or generate random selections
**Status**: Not available on macOS (use `gshuf` if GNU coreutils installed)
**Alternative**: Use `sort -R` or `perl -MList::Util=shuffle`
**Common Use Cases**:

- Randomize data for testing
- Random sampling from datasets
- Shuffle configuration options

**Alternative Methods on macOS**:

```bash
# Shuffle lines using sort
sort -R input.txt

# Shuffle using awk
awk 'BEGIN{srand()} {print rand(), $0}' input.txt | sort -n | cut -d' ' -f2-

# Random selection using head and sort
sort -R input.txt | head -10

# Shuffle with Perl
perl -MList::Util=shuffle -e 'print shuffle(<>)' input.txt
```



**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
# (Add specific examples for this tool)
```
### **factor** - Prime Factorization (GNU Tool)**Location**: `/usr/bin/factor`
**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Output Manipulation & Utilities
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [factor, prime factorization (gnu tool)]
synonyms: [factor]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Factor integers into prime factors
**Status**: Not available on macOS (use `python` or `bc` alternatives)
**Common Use Cases**:

- Mathematical analysis
- Cryptographic applications
- Number theory exploration

**Alternative Methods**:

```bash
# Using Python for factorization
python3 -c "
import sys
n = int(sys.argv[1])
factors = []
d = 2
while d * d <= n:
    while n % d == 0:
        factors.append(d)
        n //= d
    d += 1
if n > 1:
    factors.append(n)
print(' '.join(map(str, factors)))
" 60

# Simple factorization with bc
factor_with_bc() {
    local n=$1
    local d=2
    while [ $((d * d)) -le $n ]; do
        while [ $((n % d)) -eq 0 ]; do
            echo $d
            n=$((n / d))
        done
        d=$((d + 1))
    done
    [ $n -gt 1 ] && echo $n
}
```



**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
# (Add specific examples for this tool)
```
### **test** - Evaluate Conditions**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Output Manipulation & Utilities
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [test, evaluate conditions]
synonyms: [test]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Evaluate conditional expressions and return exit status
**Location**: Built-in shell command (also `/usr/bin/test`)
**Common Use Cases**:

- Shell script conditionals
- File system tests
- String comparisons
- Numerical comparisons

**File Tests**:

```bash
# File existence and types
test -e filename    # exists
test -f filename    # regular file
test -d dirname     # directory
test -L linkname    # symbolic link
test -r filename    # readable
test -w filename    # writable
test -x filename    # executable

# File comparisons
test file1 -nt file2    # newer than
test file1 -ot file2    # older than
test file1 -ef file2    # same file
```

**String Tests**:

```bash
# String length and equality
test -z "$string"       # empty string
test -n "$string"       # non-empty string
test "$str1" = "$str2"  # equal
test "$str1" != "$str2" # not equal
test "$str1" \< "$str2" # lexicographically less
```

**Numerical Tests**:

```bash
# Numerical comparisons
test 5 -eq 5     # equal
test 5 -ne 3     # not equal
test 5 -gt 3     # greater than
test 5 -ge 5     # greater or equal
test 3 -lt 5     # less than
test 3 -le 5     # less or equal
```

**Script Examples**:

```bash
#!/bin/bash
# Backup script with conditions
if test -f "$1"; then
    cp "$1" "${1}.backup"
    echo "Backup created"
else
    echo "File not found: $1"
    exit 1
fi

# System check
if test $(df / | tail -1 | awk '{print $5}' | cut -d% -f1) -gt 90; then
    echo "WARNING: Root filesystem over 90% full"
fi
```

### **true** and **false** - Exit Status Commands
**Description**: Commands that always return success (0) or failure (1) exit status
**Location**: Built-in shell commands
**Common Use Cases**:

- Infinite loops in shell scripts
- Default conditions in case statements
- Testing and debugging
- Pipeline control

**Basic Usage**:

```bash
# Always succeeds
true && echo "This will always run"

# Always fails
false || echo "This will always run"

# Check exit status
true; echo $?    # 0
false; echo $?   # 1
```

**Loop Control**:

```bash
# Infinite loop
while true; do
    echo "Running..."
    sleep 1
done

# Alternative to infinite loop
while :; do    # : is alias for true
    echo "Running..."
    sleep 1
done

# Conditional loop with break
while true; do
    read -p "Continue? (y/n): " answer
    [ "$answer" = "n" ] && break
    echo "Continuing..."
done
```

**Script Examples**:

```bash
# Default case in conditionals
case "$input" in
    start) start_service ;;
    stop) stop_service ;;
    *) echo "Unknown command" && false ;;
esac

# Testing script logic
if true; then
    echo "This branch always executes"
fi

# Placeholder for future implementation
deploy_to_production() {
    echo "Not implemented yet"
    false  # Indicate failure
}
```

---

