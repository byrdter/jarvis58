#!/bin/bash
# Weekly arXiv Research Aggregation
# Runs every Sunday to collect latest AI/ML papers

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "============================================"
echo "WEEKLY ARXIV RESEARCH AGGREGATION"
echo "============================================"
echo "Started: $(date)"
echo

# Run the aggregation (last 7 days, up to 50 papers)
python3 "$SCRIPT_DIR/aggregate-arxiv.py" --days 7 --max-results 50

echo
echo "Completed: $(date)"
