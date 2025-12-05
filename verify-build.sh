#!/bin/bash
set -e

echo "==================================="
echo "BUILD VERIFICATION REPORT"
echo "==================================="
echo ""

# Navigate to project
cd /Users/florianmahner/academic-template

echo "1. BUILD STATUS"
echo "-----------------------------------"
rm -rf dist .astro
if npm run build > /tmp/build.log 2>&1; then
    echo "✅ Build succeeded"
    cat /tmp/build.log | tail -30
else
    echo "❌ Build failed"
    cat /tmp/build.log
    exit 1
fi
echo ""

echo "2. CONTENT STRUCTURE"
echo "-----------------------------------"
echo "JSON files in src/content:"
find src/content -name "*.json" | sort
echo ""
echo "Total JSON files: $(find src/content -name "*.json" | wc -l | tr -d ' ')"
echo ""

echo "Markdown files in src/content:"
find src/content -name "*.md" | sort
echo ""
echo "Total MD files: $(find src/content -name "*.md" | wc -l | tr -d ' ')"
echo ""

echo "3. DUPLICATE CHECK"
echo "-----------------------------------"
if [ -d "src/content/publications" ]; then
    echo "❌ publications folder still exists"
    ls -la src/content/publications/
else
    echo "✅ publications folder removed"
fi
echo ""

if [ -f "src/content/projects.json" ]; then
    echo "❌ projects.json still exists (duplicate)"
else
    echo "✅ projects.json removed (no duplicate)"
fi
echo ""

echo "4. BUILT PAGES"
echo "-----------------------------------"
if [ -d "dist" ]; then
    echo "Built HTML pages:"
    find dist -name "index.html" | sort | sed 's|dist/||' | sed 's|/index.html||' | sed 's|^|  /|'
    echo ""
    echo "Total pages: $(find dist -name "index.html" | wc -l | tr -d ' ')"
else
    echo "❌ dist directory not found"
fi
echo ""

echo "==================================="
echo "VERIFICATION COMPLETE"
echo "==================================="
