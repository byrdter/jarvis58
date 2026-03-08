#!/bin/bash
# test-scraping.sh - Quick test of Auburn library scraping

set -e

PROFILE="$HOME/.jarvis-auburn-library"

echo "Testing Auburn Library Access"
echo "=============================="
echo ""

# Check profile exists
if [ ! -d "$PROFILE" ]; then
    echo "❌ Profile not found: $PROFILE"
    echo "Please run ./setup-profile.sh first"
    exit 1
fi

echo "✓ Profile found: $PROFILE"
echo ""

# Test 1: Access MIS Quarterly journal page
echo "Test 1: Accessing MIS Quarterly journal page..."
agent-browser --profile "$PROFILE" open "https://research.ebsco.com/c/j6vsfb/search/advanced/publications/MISQ?autocorrect=n&selectedDb=buhjnh" --load networkidle

# Get page title
TITLE=$(agent-browser --profile "$PROFILE" get title)
echo "Page title: $TITLE"
echo ""

# Get snapshot
echo "Test 2: Getting page snapshot..."
agent-browser --profile "$PROFILE" snapshot -i -c --json > /tmp/misq-snapshot.json

# Check if we got data
if [ -s /tmp/misq-snapshot.json ]; then
    echo "✓ Snapshot retrieved"

    # Count references
    REF_COUNT=$(cat /tmp/misq-snapshot.json | grep -o '"e[0-9]*"' | wc -l)
    echo "  References found: $REF_COUNT"

    # Look for issue links
    echo ""
    echo "Looking for issue links (Vol. X Issue X)..."
    cat /tmp/misq-snapshot.json | grep -o '"name":"Vol\. [^"]*"' | head -5
else
    echo "❌ No snapshot data"
fi

echo ""

# Close browser
agent-browser --profile "$PROFILE" close

echo ""
echo "=============================="
echo "Test complete!"
echo "Check /tmp/misq-snapshot.json for full snapshot data"
