#!/bin/bash
# setup-profile.sh - Set up Auburn University Library profile for agent-browser

set -e

PROFILE_PATH="$HOME/.jarvis-auburn-library"
LIBRARY_URL="https://library.auburn.edu"

echo "=========================================="
echo "Auburn Library Profile Setup"
echo "=========================================="
echo ""

# Check if agent-browser is installed
if ! command -v agent-browser &> /dev/null; then
    echo "❌ agent-browser not found"
    echo ""
    echo "Please install agent-browser first:"
    echo "  npm install -g agent-browser"
    echo "  agent-browser install"
    exit 1
fi

# Check if profile already exists
if [ -d "$PROFILE_PATH" ]; then
    echo "✓ Profile already exists: $PROFILE_PATH"
    echo ""
    read -p "Do you want to recreate it? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    echo "Removing existing profile..."
    rm -rf "$PROFILE_PATH"
fi

echo "Setting up profile at: $PROFILE_PATH"
echo ""

# Close any existing agent-browser sessions
echo "Closing any existing agent-browser sessions..."
agent-browser close 2>/dev/null || true
sleep 2

echo ""
echo "=========================================="
echo "MANUAL AUTHENTICATION REQUIRED"
echo "=========================================="
echo ""
echo "A browser window will open. Please:"
echo "  1. Log in to Auburn Library with your credentials"
echo "  2. Navigate to one of the research databases"
echo "  3. Verify you can access the database"
echo "  4. Close the browser window when done"
echo ""
echo "Your session will be saved for future automation."
echo ""
read -p "Press ENTER when ready to open browser..."

# Open browser in headed mode for manual login
echo ""
echo "Opening browser..."
agent-browser --profile "$PROFILE_PATH" open "$LIBRARY_URL" --headed

echo ""
echo "Browser is now open. Please:"
echo "  1. Log in to Auburn Library"
echo "  2. Navigate to a research database"
echo "  3. Verify you can access journals"
echo ""
read -p "Press ENTER when you're done (this will close the browser)..."

# Close the browser to save the session
echo ""
echo "Closing browser and saving session..."
agent-browser --profile "$PROFILE_PATH" close

echo ""
echo "=========================================="
echo "Testing Profile"
echo "=========================================="
echo ""

# Wait a bit
sleep 2

# Test the profile
echo "Testing saved session..."
agent-browser --profile "$PROFILE_PATH" open "$LIBRARY_URL" --load networkidle

# Get current URL to verify we're logged in
CURRENT_URL=$(agent-browser --profile "$PROFILE_PATH" get url)
echo "Current URL: $CURRENT_URL"

# Close browser
agent-browser --profile "$PROFILE_PATH" close

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Profile saved to: $PROFILE_PATH"
echo ""
echo "Next steps:"
echo "  1. Test scraping: python3 aggregate-research.py latest --output test.md"
echo "  2. If session expires, run this setup script again"
echo ""
