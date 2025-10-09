## AI-Powered Tools

### **GitHub Copilot CLI** - AI Pair Programmer for Command Line
<!-- metadata:
category: AI-Powered Tools
difficulty: ⭐⭐ Beginner
aliases: [copilot, gh-copilot]
tags: [#ai, #github, #productivity, #automation]
related: [gh, git, llm, aichat]
keywords: [copilot, github, ai, cli, command, suggestion, explain, assistant]
synonyms: [gh-copilot, copilot-cli, github-ai, ai-assistant]
platform: [macOS, Linux, Windows]
installation: gh extension install github/gh-copilot
-->
**Description**: AI-powered command-line assistant that helps with commands, explanations, and suggestions
**Location**: `gh copilot` (GitHub CLI extension)
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- Command suggestions and completions
- Error explanations and fixes
- Command explanations
- Script generation
- Git workflow assistance

**See Also**: `gh` (GitHub CLI), `llm` (general LLM tool), `aichat` (multi-provider chat)

**Examples**:

```bash
# Installation
gh extension install github/gh-copilot
gh auth refresh -h github.com -s copilot  # Authenticate

# Suggest commands
gh copilot suggest "find all python files modified in last week"
gh copilot suggest "compress all images in current directory"
gh copilot suggest "kill process using port 3000"

# Explain commands
gh copilot explain "git rebase -i HEAD~3"
gh copilot explain "find . -type f -name '*.log' -mtime +30 -delete"
gh copilot explain "docker run -d -p 8080:80 --name web nginx"

# Interactive mode
gh copilot suggest  # Interactive prompt
gh copilot explain  # Interactive explain mode

# Shell integration (alias setup)
echo 'alias ??="gh copilot suggest"' >> ~/.zshrc
echo 'alias git?="gh copilot suggest git"' >> ~/.zshrc
echo 'alias explain="gh copilot explain"' >> ~/.zshrc

# Usage with aliases
?? "how to find large files"
git? "undo last commit"
explain "tar -xzvf file.tar.gz"

# Advanced usage patterns
# Get command and execute
eval "$(gh copilot suggest "list all docker containers" | head -1)"

# Explain error messages
your_command 2>&1 | gh copilot explain

# Generate scripts
gh copilot suggest "bash script to backup database daily"
gh copilot suggest "python script to process CSV files"

# Configuration
gh copilot config  # View configuration
gh copilot config set editor vim  # Set preferred editor
```


### **aichat** - All-in-One AI CLI Tool
<!-- metadata:
category: AI-Powered Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#ai, #chat, #llm, #productivity]
related: [llm, gh-copilot, chatgpt]
keywords: [aichat, ai, chat, gpt, claude, llm, assistant, multi-provider]
synonyms: [ai-terminal, llm-chat, ai-assistant, multi-ai]
platform: [macOS, Linux, Windows]
installation: brew install aichat
-->
**Description**: Terminal-based AI chat client supporting multiple providers (OpenAI, Claude, Gemini, etc.)
**Location**: `/opt/homebrew/bin/aichat`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- Interactive AI conversations
- Code generation and review
- Command-line assistance
- Text processing and analysis
- Multi-provider model comparison

**See Also**: `llm` (LLM CLI), `gh copilot` (GitHub's AI), `chatgpt` (OpenAI specific)

**Examples**:

```bash
# Initial setup
aichat --init  # Interactive configuration
export OPENAI_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"

# Basic chat
aichat "Explain Docker containers"
aichat "Write a Python function to sort a list"
echo "Fix this code" | aichat

# Interactive session
aichat  # Start interactive mode
# .exit - Exit session
# .clear - Clear conversation
# .save chat.md - Save conversation
# .model gpt-4 - Switch model

# Model selection
aichat -m gpt-4 "Complex question"
aichat -m claude-3 "Code review this"
aichat -m gemini-pro "Explain quantum computing"
aichat --list-models  # Show available models

# Roles and personas
aichat -r coder "Write a REST API in Go"
aichat -r reviewer "Review this Python code"
aichat -r shell "How do I find large files?"

# File operations
aichat -f script.py "Explain this code"
aichat -f data.json "Analyze this JSON"
cat error.log | aichat "What's wrong?"

# Code execution (careful!)
aichat -e "Python code to list files"  # Execute returned code
aichat --no-execute "Shell command to backup"  # Don't execute

# Sessions and history
aichat --session project1  # Named session
aichat --list-sessions    # Show all sessions
aichat --clear-history    # Clear history

# Output formats
aichat -o markdown "Explain REST APIs"
aichat -o json "Parse this text into JSON"
aichat -o code "Convert this to Python"

# Configuration file (~/.config/aichat/config.yaml)
cat > ~/.config/aichat/config.yaml << 'EOF'
model: gpt-4
temperature: 0.7
max_tokens: 2000
providers:
  - type: openai
    api_key: ${OPENAI_API_KEY}
  - type: anthropic
    api_key: ${ANTHROPIC_API_KEY}
roles:
  - name: coder
    prompt: "You are an expert programmer. Write clean, efficient code."
  - name: reviewer
    prompt: "You are a code reviewer. Analyze for bugs and improvements."
EOF

# Practical examples
git diff | aichat "Review these changes"
aichat "Convert this curl to Python requests" < curl_command.txt
docker logs container 2>&1 | aichat "Debug this error"
```


### **llm** - Access Large Language Models
<!-- metadata:
category: AI-Powered Tools
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

