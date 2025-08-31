#!/bin/bash

# build_standalone.sh - Build standalone HTML files with embedded data for file:// protocol

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Building standalone HTML files with embedded data..."

# Read the JSON data files
TOOLS_JSON=$(cat "$PROJECT_ROOT/site/data/tools.json")
CATEGORIES_JSON=$(cat "$PROJECT_ROOT/site/data/categories.json")
STATS_JSON=$(cat "$PROJECT_ROOT/site/data/stats.json")

# Create embedded data script
cat > "$PROJECT_ROOT/site/embedded-data.js" << EOF
// Auto-generated embedded data for file:// protocol support
window.EMBEDDED_CLI_DATA = {
    tools: ${TOOLS_JSON}.tools || [],
    categories: ${CATEGORIES_JSON}.categories || [],
    stats: ${STATS_JSON}
};
console.log('Embedded data loaded:', {
    tools: window.EMBEDDED_CLI_DATA.tools.length,
    categories: window.EMBEDDED_CLI_DATA.categories.length
});
EOF

echo "✅ Created embedded-data.js"

# Update HTML files to include the embedded data script
for html_file in "$PROJECT_ROOT/site/"*.html; do
    if grep -q "embedded-data.js" "$html_file"; then
        echo "⏭️  Skipping $(basename "$html_file") - already has embedded data"
    else
        # Add embedded-data.js before main.js
        sed -i.bak '/<script src="js\/main.js"/i\
    <script src="embedded-data.js"><\/script>' "$html_file"
        echo "✅ Updated $(basename "$html_file")"
    fi
done

# Clean up backup files
rm -f "$PROJECT_ROOT/site/"*.html.bak

echo ""
echo "✅ Standalone build complete!"
echo "📁 You can now open the HTML files directly with file:// protocol"
echo "   Example: file://$PROJECT_ROOT/site/tools.html"
