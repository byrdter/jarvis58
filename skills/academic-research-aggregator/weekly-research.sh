#!/bin/bash
# Weekly Academic Research Automation
# Run this once a week to get latest AI/business research

echo "=========================================="
echo "Weekly Academic Research Aggregation"
echo "=========================================="
echo ""

# Check if Chrome is already running with CDP
if curl -s http://localhost:9223/json/version > /dev/null 2>&1; then
    echo "✅ Chrome is already running with Auburn Library session"
    echo ""
else
    echo "Starting Chrome with Auburn Library profile..."
    echo ""

    # Launch Chrome with dedicated profile
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
      --user-data-dir="$HOME/.jarvis-auburn-profile" \
      --remote-debugging-port=9223 \
      "https://research.ebsco.com/c/l6vsfb/search/results?autocorrect=y&db=buh&q=%28%22artificial+intelligence%22+OR+%22generative+AI%22%29+AND+%28%22corporations%22+OR+%22business%22%29" \
      > /dev/null 2>&1 &

    sleep 5
    echo "✅ Chrome launched"
    echo ""
    echo "📌 IMPORTANT: Make sure you're logged into Auburn Library"
    echo "   The browser should open to the AI in Business search results"
    echo ""
    read -p "Press Enter when you're ready to continue..."
fi

echo ""
echo "Extracting research articles..."
echo ""

# Activate venv and run scraper
cd /Users/terrybyrd/Dropbox/jarvis/repos/VIDEO-GENERATOR_FOUNDATIONS
source venv/bin/activate
python3 /Users/terrybyrd/Dropbox/jarvis/skills/academic-research-aggregator/scrape-ai-business.py

echo ""
echo "=========================================="
echo "Research aggregation complete!"
echo ""
echo "💡 TIP: You can keep Chrome running for future"
echo "   research sessions, or close it if done."
echo "=========================================="
