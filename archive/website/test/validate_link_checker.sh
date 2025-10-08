#!/bin/bash

# Test script to validate the improved link checker in GitHub Actions
# Creates test markdown files with various link types and verifies correct behavior

set -e

echo "Setting up test environment..."

# Create test directory structure
mkdir -p test_workspace/docs
cd test_workspace

# Create a valid target file
echo "# Valid Document" > docs/valid.md

# Test 1: Create markdown with image links (should be ignored)
cat > test_images.md << 'EOF'
# Test Images

Regular link: [Valid Document](docs/valid.md)
Image link that should be ignored: ![Screenshot](screenshot.png)
Remote image: ![Logo](https://example.com/logo.png)
Another regular link: [Missing](missing.md)
EOF

# Test 2: Create markdown with various URL schemes (should be filtered)
cat > test_schemes.md << 'EOF'
# Test URL Schemes

These should be skipped:
- [Email](mailto:user@example.com)
- [Phone](tel:+1-555-0100)
- [FTP](ftp://ftp.example.com)
- [File protocol](file:///etc/hosts)
- [Data URL](data:text/plain;base64,SGVsbG8=)
- [JavaScript](javascript:void(0))

These should be checked:
- [Local file](docs/valid.md)
- [Missing file](docs/missing.md)
EOF

# Test 3: Create markdown with anchors
cat > test_anchors.md << 'EOF'
# Test Anchors

Pure anchors (should be skipped):
- [Introduction](#introduction)
- [Conclusion](#conclusion)

File with anchor (file should be checked):
- [Document section](docs/valid.md#section)
- [Missing with anchor](missing.md#section)
EOF

# Run the link checker Python script inline
echo ""
echo "Running link checker test..."
echo ""

python3 << 'PYTHON_SCRIPT'
import re
import sys
import glob
from pathlib import Path

def test_link_checker():
    broken_links = []
    stats = {
        'total_files': 0,
        'total_links': 0,
        'skipped_images': 0,
        'skipped_schemes': 0,
        'skipped_anchors': 0,
        'checked_links': 0
    }

    for md_file in glob.glob('**/*.md', recursive=True):
        if 'node_modules' in md_file:
            continue
            
        stats['total_files'] += 1
        md_path = Path(md_file)
        with open(md_path, 'r') as f:
            content = f.read()
        
        # Count image links (should be excluded by regex)
        image_links = re.findall(r'!\[([^\]]+)\]\(([^)]+)\)', content)
        stats['skipped_images'] += len(image_links)
        
        # Find markdown links, excluding image links
        links = re.findall(r'(?<!\!)\[([^\]]+)\]\(([^)]+)\)', content)
        stats['total_links'] += len(links)
        
        for text, link in links:
            # Skip external links (http/https)
            if link.startswith(('http://', 'https://')):
                stats['skipped_schemes'] += 1
                continue
                
            # Skip non-file schemes
            if any(link.startswith(scheme) for scheme in ['mailto:', 'tel:', 'ftp:', 'file://', 'data:', 'javascript:']):
                stats['skipped_schemes'] += 1
                continue
                
            # Skip anchors
            if link.startswith('#'):
                stats['skipped_anchors'] += 1
                continue
                
            stats['checked_links'] += 1
            
            # Check if file exists using pathlib
            if link.startswith('/'):
                check_path = Path(link[1:])
            else:
                check_path = md_path.parent / link
                check_path = check_path.resolve()
            
            # Remove anchor if present
            link_without_anchor = str(check_path).split('#')[0] if '#' in str(check_path) else str(check_path)
            check_path = Path(link_without_anchor)
                
            if link_without_anchor and not check_path.exists():
                broken_links.append(f'{md_file}: [{text}]({link})')

    # Print statistics
    print("Link Checker Statistics:")
    print(f"  Files processed: {stats['total_files']}")
    print(f"  Total links found: {stats['total_links']}")
    print(f"  Image links skipped: {stats['skipped_images']}")
    print(f"  URL schemes skipped: {stats['skipped_schemes']}")
    print(f"  Anchors skipped: {stats['skipped_anchors']}")
    print(f"  Links checked: {stats['checked_links']}")
    print(f"  Broken links found: {len(broken_links)}")
    print()

    # Verify expected behavior
    expected_broken = 3  # missing.md appears 3 times
    
    if len(broken_links) == expected_broken:
        print(f"✅ Test PASSED: Found {expected_broken} expected broken links")
        for link in broken_links:
            print(f"   - {link}")
        return 0
    else:
        print(f"❌ Test FAILED: Expected {expected_broken} broken links, found {len(broken_links)}")
        for link in broken_links:
            print(f"   - {link}")
        return 1

sys.exit(test_link_checker())
PYTHON_SCRIPT

TEST_RESULT=$?

# Cleanup
cd ..
rm -rf test_workspace

if [ $TEST_RESULT -eq 0 ]; then
    echo ""
    echo "✅ All link checker tests passed successfully!"
    exit 0
else
    echo ""
    echo "❌ Link checker tests failed!"
    exit 1
fi