#!/bin/bash
#
# run-aggregator.sh - Automated news aggregator runner
# Runs daily to generate AI news digest
#

# Configuration
SCRIPT_DIR="/Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator"
VENV_PATH="$SCRIPT_DIR/venv"
OUTPUT_DIR="/Users/terrybyrd/Dropbox/jarvis/reports/news-digests"
OBSIDIAN_DIR="/Users/terrybyrd/Documents/Obsidian Vault/Research/AI News"
LOG_DIR="/Users/terrybyrd/Dropbox/jarvis/logs"

# Load email configuration if it exists
EMAIL_CONFIG="$SCRIPT_DIR/email-config.sh"
if [ -f "$EMAIL_CONFIG" ]; then
    source "$EMAIL_CONFIG"
fi

# Create output and log directories if they don't exist
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OBSIDIAN_DIR"
mkdir -p "$LOG_DIR"

# Generate filename with today's date
DATE=$(date +%Y-%m-%d)
OUTPUT_FILE="$OUTPUT_DIR/ai-news-digest-$DATE.md"
LOG_FILE="$LOG_DIR/news-aggregator-$DATE.log"

# Log start
echo "============================================" >> "$LOG_FILE"
echo "AI News Aggregator - $DATE" >> "$LOG_FILE"
echo "Started: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "============================================" >> "$LOG_FILE"

# Activate virtual environment and run aggregator
cd "$SCRIPT_DIR"
source "$VENV_PATH/bin/activate"

python3 aggregate.py daily --output "$OUTPUT_FILE" >> "$LOG_FILE" 2>&1

EXIT_CODE=$?

# Log completion
echo "" >> "$LOG_FILE"
echo "Completed: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "Exit code: $EXIT_CODE" >> "$LOG_FILE"

if [ $EXIT_CODE -eq 0 ]; then
    echo "✓ Digest saved to: $OUTPUT_FILE" >> "$LOG_FILE"

    # Copy to Obsidian vault
    OBSIDIAN_FILE="$OBSIDIAN_DIR/AI News - $DATE.md"
    cp "$OUTPUT_FILE" "$OBSIDIAN_FILE"
    echo "✓ Copied to Obsidian: $OBSIDIAN_FILE" >> "$LOG_FILE"

    # Send email digest
    python3 "$SCRIPT_DIR/send-email.py" "$OUTPUT_FILE" >> "$LOG_FILE" 2>&1
    EMAIL_EXIT=$?

    if [ $EMAIL_EXIT -eq 0 ]; then
        echo "✓ Email sent successfully" >> "$LOG_FILE"
    else
        echo "✗ Email failed (exit code: $EMAIL_EXIT)" >> "$LOG_FILE"
    fi
else
    echo "✗ Error occurred during aggregation" >> "$LOG_FILE"
fi

exit $EXIT_CODE
