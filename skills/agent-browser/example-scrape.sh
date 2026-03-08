#!/bin/bash
# Purpose: Example web scraping script using agent-browser
# Usage: ./example-scrape.sh <url>
# Output: JSON with page title and first article text

set -e  # Exit on error

URL="${1:-https://example.com}"

echo "Scraping: $URL" >&2

# Open page
agent-browser open "$URL"
agent-browser wait --load networkidle

# Get page title
TITLE=$(agent-browser get title)

# Get snapshot of interactive elements
agent-browser snapshot -i -c --json > /tmp/snapshot.json

# Extract first link text (if any)
FIRST_LINK=$(jq -r '.data.refs | to_entries[0]? | "\(.key): \(.value.name)"' /tmp/snapshot.json 2>/dev/null || echo "No links found")

# Close browser
agent-browser close

# Output JSON
cat <<EOF
{
  "url": "$URL",
  "title": "$TITLE",
  "first_link": "$FIRST_LINK",
  "scraped_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

rm -f /tmp/snapshot.json
