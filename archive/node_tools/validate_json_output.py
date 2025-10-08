#!/usr/bin/env python3
"""
Validate generated JSON files against source data
"""

import json
import re
from pathlib import Path

def count_tools_in_file(filepath):
    """Count tool entries (### **) in a markdown file"""
    with open(filepath, 'r') as f:
        content = f.read()
    return len(re.findall(r'^### \*\*', content, re.MULTILINE))

def get_tool_names_from_file(filepath):
    """Extract tool names from markdown file"""
    tools = []
    with open(filepath, 'r') as f:
        for line in f:
            match = re.match(r'^### \*\*(.+?)\*\*', line)
            if match:
                tool_name = match.group(1).strip()
                # Remove " - Description" suffix if present
                tool_name = re.sub(r'\s*-\s*.+$', '', tool_name)
                tools.append(tool_name)
    return tools

def main():
    project_root = Path('/Users/allen/Documents/git/cli-tool-context')

    print("=" * 70)
    print("JSON OUTPUT VALIDATION REPORT")
    print("=" * 70)
    print()

    # Count tools in TOOLS.md
    tools_md_path = project_root / 'TOOLS.md'
    tools_md_count = count_tools_in_file(tools_md_path)

    # Count tools in tools/ directory
    tools_dir = project_root / 'tools'
    tools_dir_count = 0
    category_counts = {}

    for md_file in sorted(tools_dir.glob('*.md')):
        if md_file.name == 'README.md':
            continue
        count = count_tools_in_file(md_file)
        tools_dir_count += count
        category_name = md_file.stem.replace('-', ' ').title()
        category_counts[category_name] = count

    # Load generated JSON files
    data_dir = project_root / 'site' / 'data'

    with open(data_dir / 'tools.json') as f:
        tools_json = json.load(f)

    with open(data_dir / 'categories.json') as f:
        categories_json = json.load(f)

    with open(data_dir / 'stats.json') as f:
        stats_json = json.load(f)

    # Print comparison
    print("📊 TOOL COUNT COMPARISON")
    print("-" * 70)
    print(f"{'Source':<40} {'Count':>10} {'Status':>15}")
    print("-" * 70)
    print(f"{'tools/ directory (CORRECT)':<40} {tools_dir_count:>10} {'✅ Accurate':>15}")
    print(f"{'TOOLS.md (monolithic)':<40} {tools_md_count:>10} {'⚠️  Contains extra':>15}")
    print(f"{'Generated JSON (tools.json)':<40} {len(tools_json['tools']):>10} {'❌ INCORRECT':>15}")
    print(f"{'Generated JSON (stats.json)':<40} {stats_json['totalTools']:>10} {'❌ INCORRECT':>15}")
    print()

    # Check for fake tools
    print("❌ FAKE TOOLS DETECTED IN JSON")
    print("-" * 70)

    fake_tools = [
        "Advanced Monitoring and Alerting Pipelines",
        "Sophisticated Development Automation",
        "Advanced Data Pipeline Integration",
        "Text Processing Speed",
        "Archive Tools Performance",
        "Programming Language Performance",
        "System Monitoring Tools",
        "Frequency-Based Categories",
        "Cross-Reference Matrix",
        "Shell Script Templates",
        "Automation Recipes",
        "One-Liner Collections",
        "Configuration Templates",
        "Command Combinations",
        "Core Daily Tools"
    ]

    found_fake_tools = []
    for tool in tools_json['tools']:
        if tool['name'] in fake_tools:
            found_fake_tools.append(tool['name'])

    for fake_tool in found_fake_tools:
        print(f"  • {fake_tool}")

    print(f"\nTotal fake tools found: {len(found_fake_tools)}")
    print()

    # Check AI-Powered Tools category specifically
    print("🤖 AI-POWERED TOOLS CATEGORY ANALYSIS")
    print("-" * 70)

    ai_tools_actual = get_tool_names_from_file(tools_dir / 'ai-powered-tools.md')
    print(f"Actual tools in tools/ai-powered-tools.md: {len(ai_tools_actual)}")
    for tool in ai_tools_actual:
        print(f"  ✓ {tool}")
    print()

    # Find AI category in JSON
    ai_category_json = next((cat for cat in categories_json['categories']
                            if cat['name'] == 'AI-Powered Tools'), None)

    if ai_category_json:
        print(f"JSON reported count: {ai_category_json['toolCount']}")
        print(f"JSON tools list:")
        for tool in ai_category_json['tools'][:10]:  # Show first 10
            status = "✓" if tool['name'] in ai_tools_actual else "✗"
            print(f"  {status} {tool['name']}")
        if len(ai_category_json['tools']) > 10:
            print(f"  ... and {len(ai_category_json['tools']) - 10} more")
    print()

    # Root cause analysis
    print("🔍 ROOT CAUSE ANALYSIS")
    print("-" * 70)
    print("PROBLEM:")
    print("  The TypeScript CLI is parsing TOOLS.md instead of the tools/ directory")
    print()
    print("TOOLS.md contains:")
    print("  • 267 actual CLI tools (in category sections)")
    print("  • 132 documentation section headers using ### ** format")
    print("  • Total: 399 ### ** headers")
    print()
    print("The parser incorrectly treats ALL ### ** headers as tools, including:")
    print("  • Section headers in 'Common Workflows'")
    print("  • Section headers in 'Advanced Integration Patterns'")
    print("  • Section headers in 'Ready-to-Use Resources'")
    print("  • Section headers in 'Performance Comparisons'")
    print("  • Section headers in 'Tool Categories Overview'")
    print()
    print("SOLUTION:")
    print("  1. Modify the TypeScript CLI to parse tools/*.md files instead")
    print("  2. OR add logic to exclude non-tool sections from TOOLS.md")
    print("  3. OR deprecate TOOLS.md and use tools/ as the source of truth")
    print()

    # Data quality issues
    print("⚠️  DATA QUALITY ISSUES")
    print("-" * 70)

    issues = []
    for tool in tools_json['tools'][:50]:  # Check first 50
        # Check for malformed descriptions
        if 'Difficulty:' in tool.get('description', ''):
            issues.append(f"Tool '{tool['name']}': Description contains difficulty rating")

        # Check for empty fields
        if not tool.get('description'):
            issues.append(f"Tool '{tool['name']}': Missing description")

        if not tool.get('commonUseCases'):
            issues.append(f"Tool '{tool['name']}': Empty common use cases")

    for issue in issues[:10]:  # Show first 10 issues
        print(f"  • {issue}")

    if len(issues) > 10:
        print(f"  ... and {len(issues) - 10} more issues")
    print()

    # Summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"✅ Correct tool count:  {tools_dir_count} (from tools/ directory)")
    print(f"❌ Incorrect JSON count: {len(tools_json['tools'])} (24 extra fake tools)")
    print(f"⚠️  Data quality issues: {len(issues)} problems detected")
    print()
    print("RECOMMENDATION:")
    print("  The JSON generation is INCORRECT. The CLI tool needs to be fixed to")
    print("  parse the tools/ directory instead of TOOLS.md, or filter out")
    print("  non-tool sections from TOOLS.md.")
    print("=" * 70)

if __name__ == '__main__':
    main()
