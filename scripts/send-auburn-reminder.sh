#!/bin/bash
# Sunday Morning Auburn Library Reminder
# Prompts Terry to ensure Auburn Library Chrome session is active

osascript <<EOF
display notification "Weekly academic research will run in 15 minutes. Please ensure Chrome is running with Auburn Library logged in." with title "JARVIS Auburn Reminder" sound name "Glass"
EOF

echo "[$(date)] Auburn Library reminder sent"
