#!/usr/bin/env python3
"""Validate metadata consistency across all tools/ category files"""

import re
from pathlib import Path
from collections import defaultdict

def parse_tool_metadata(file_path):
    """Extract all tool entries and their metadata from a file"""
    with open(file_path, 'r') as f:
        content = f.read()

    tools = []
    # Pattern to find tool headers - more flexible
    tool_pattern = r'^### \*\*(.+?)\*\*'
    # Pattern to find metadata blocks
    metadata_pattern = r'<!-- metadata:(.*?)-->'

    # Find all tools
    for match in re.finditer(tool_pattern, content, re.MULTILINE):
        tool_header = match.group(1)
        # Extract just the tool name (before any " - " descriptor)
        tool_name = tool_header.split(' - ')[0].strip()

        # Find metadata block after this tool
        start_pos = match.end()
        metadata_match = re.search(metadata_pattern, content[start_pos:start_pos+500], re.DOTALL)

        if metadata_match:
            metadata_text = metadata_match.group(1)
            # Parse metadata fields
            category_match = re.search(r'category:\s*(.+)', metadata_text)
            difficulty_match = re.search(r'difficulty:\s*(.+)', metadata_text)

            tools.append({
                'name': tool_name,
                'category': category_match.group(1).strip() if category_match else None,
                'difficulty': difficulty_match.group(1).strip() if difficulty_match else None,
                'has_metadata': True,
                'position': match.start()
            })
        else:
            tools.append({
                'name': tool_name,
                'category': None,
                'difficulty': None,
                'has_metadata': False,
                'position': match.start()
            })

    return tools

def validate_file(file_path):
    """Validate a single category file"""
    issues = []

    # Expected category from filename
    filename = file_path.stem
    # Special case mappings
    category_map = {
        'ai-powered-tools': 'AI-Powered Tools',
        'cloud-container-tools': 'Cloud & Container Tools',
        'macos-specific-tools': 'macOS-Specific Tools',
        'documentation-help-tools': 'Documentation & Help Tools',
        'file-directory-operations': 'File & Directory Operations',
        'media-processing-tools': 'Media Processing Tools',
        'network-tools': 'Network Tools',
        'package-managers': 'Package Managers',
        'security-tools': 'Security Tools',
        'system-administration': 'System Administration',
        'terminal-information-control': 'Terminal Information & Control',
        'terminal-session-management': 'Terminal & Session Management',
        'text-processing-manipulation': 'Text Processing & Manipulation',
        'utility-tools': 'Utility Tools',
        'version-control': 'Version Control',
        'development-tools': 'Development Tools',
        'environment-process-management': 'Environment & Process Management',
        'output-manipulation-utilities': 'Output Manipulation & Utilities',
        'data-processing-tools': 'Data Processing Tools'
    }
    expected_category = category_map.get(filename, filename.replace('-', ' ').title())

    tools = parse_tool_metadata(file_path)

    for tool in tools:
        # Check for missing metadata
        if not tool['has_metadata']:
            issues.append(f"  ❌ {tool['name']}: Missing metadata block")

        # Check category consistency
        elif tool['category'] != expected_category:
            issues.append(f"  ❌ {tool['name']}: Category mismatch (expected '{expected_category}', got '{tool['category']}')")

        # Check difficulty format
        elif tool['difficulty']:
            if not re.match(r'^⭐+\s+(Beginner|Intermediate|Advanced|Expert)$', tool['difficulty']):
                issues.append(f"  ❌ {tool['name']}: Invalid difficulty format: '{tool['difficulty']}')")

    return issues, len(tools)

def main():
    tools_dir = Path('tools')

    if not tools_dir.exists():
        print("❌ tools/ directory not found")
        return 1

    print("Validating metadata consistency across all tools/ files...")
    print("=" * 70)

    total_issues = []
    total_tools = 0
    files_checked = 0

    for md_file in sorted(tools_dir.glob('*.md')):
        if md_file.name == 'README.md':
            continue

        files_checked += 1
        issues, tool_count = validate_file(md_file)
        total_tools += tool_count

        if issues:
            print(f"\n📄 {md_file.name} ({tool_count} tools):")
            for issue in issues:
                print(issue)
                total_issues.append((md_file.name, issue))
        else:
            print(f"✅ {md_file.name} ({tool_count} tools) - All metadata valid")

    print("\n" + "=" * 70)
    print(f"\nValidation Summary:")
    print(f"  Files checked: {files_checked}")
    print(f"  Total tools: {total_tools}")
    print(f"  Issues found: {len(total_issues)}")

    if total_issues:
        print(f"\n❌ Validation failed with {len(total_issues)} issues")
        return 1
    else:
        print(f"\n✅ All metadata is consistent and valid!")
        return 0

if __name__ == '__main__':
    exit(main())
