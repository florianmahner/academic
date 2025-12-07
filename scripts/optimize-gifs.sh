#!/bin/bash
# Optimize all GIFs with gifsicle

cd /Users/florianmahner/academic-template/public/previews

echo "=== Optimizing GIFs with gifsicle ==="
echo ""

for f in *.gif; do
    before=$(stat -f%z "$f")
    /usr/local/bin/gifsicle -O3 --colors 128 "$f" -o "/tmp/opt-$f"
    mv "/tmp/opt-$f" "$f"
    after=$(stat -f%z "$f")
    savings=$((100 - after * 100 / before))
    echo "✓ $f: $((before/1024))KB → $((after/1024))KB (-${savings}%)"
done

echo ""
echo "=== Final totals ==="
du -sh .
