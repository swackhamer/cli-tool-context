#!/usr/bin/env python3
"""Check for duplicate tool entries in TOOLS.md"""

import re
from collections import Counter

# Read TOOLS.md
with open('TOOLS.md', 'r') as f:
    content = f.read()

# Extract all tool names
tool_pattern = r'^### \*\*(.+?)\*\*'
tools = re.findall(tool_pattern, content, re.MULTILINE)

# Clean tool names (remove " - Description" suffix)
cleaned_tools = []
for tool in tools:
    # Remove everything after " - " if present
    clean_name = tool.split(' - ')[0].strip()
    cleaned_tools.append(clean_name)

# Find duplicates
tool_counts = Counter(cleaned_tools)
duplicates = {name: count for name, count in tool_counts.items() if count > 1}

if duplicates:
    print(f"Found {len(duplicates)} duplicate tool names:")
    print("=" * 70)
    for name, count in sorted(duplicates.items()):
        print(f"  {name}: appears {count} times")
    print("=" * 70)
    print(f"\nTotal unique tools: {len(tool_counts)}")
    print(f"Total tool entries: {sum(tool_counts.values())}")
    print(f"Duplicate entries: {sum(tool_counts.values()) - len(tool_counts)}")
else:
    print("✓ No duplicate tool names found!")
    print(f"Total unique tools: {len(tool_counts)}")
