#!/bin/bash
#
# setup-email.sh - Interactive email configuration setup
#

SCRIPT_DIR="/Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator"
CONFIG_FILE="$SCRIPT_DIR/email-config.sh"

echo "=========================================="
echo "JARVIS News Aggregator - Email Setup"
echo "=========================================="
echo ""

# Check if config already exists
if [ -f "$CONFIG_FILE" ]; then
    echo "⚠️  Email configuration already exists at:"
    echo "   $CONFIG_FILE"
    echo ""
    read -p "Overwrite existing configuration? (y/N): " overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
    echo ""
fi

echo "Email Provider Setup"
echo "--------------------"
echo "1) Gmail"
echo "2) Outlook/Hotmail"
echo "3) Yahoo"
echo "4) Other (custom SMTP)"
echo ""
read -p "Select your email provider (1-4): " provider

case $provider in
    1)
        SMTP_SERVER="smtp.gmail.com"
        SMTP_PORT="587"
        echo "Selected: Gmail"
        echo ""
        echo "📝 IMPORTANT: Gmail requires an App Password"
        echo "   1. Go to: https://myaccount.google.com/apppasswords"
        echo "   2. Generate an app password for 'Mail'"
        echo "   3. Use that password (not your regular Gmail password)"
        echo ""
        ;;
    2)
        SMTP_SERVER="smtp-mail.outlook.com"
        SMTP_PORT="587"
        echo "Selected: Outlook/Hotmail"
        echo ""
        ;;
    3)
        SMTP_SERVER="smtp.mail.yahoo.com"
        SMTP_PORT="587"
        echo "Selected: Yahoo"
        echo ""
        echo "📝 IMPORTANT: Yahoo requires an App Password"
        echo "   1. Go to Yahoo Account Security settings"
        echo "   2. Generate an app password"
        echo "   3. Use that password (not your regular password)"
        echo ""
        ;;
    4)
        read -p "SMTP server hostname: " SMTP_SERVER
        read -p "SMTP server port (default 587): " SMTP_PORT
        SMTP_PORT=${SMTP_PORT:-587}
        ;;
    *)
        echo "Invalid selection. Exiting."
        exit 1
        ;;
esac

# Get email credentials
read -p "Your email address (FROM): " EMAIL_FROM
read -p "Password or App Password: " -s EMAIL_PASSWORD
echo ""
read -p "Send digests to (default: same as FROM): " EMAIL_TO
EMAIL_TO=${EMAIL_TO:-$EMAIL_FROM}

read -p "Email subject prefix (default: JARVIS AI News Digest): " SUBJECT_PREFIX
SUBJECT_PREFIX=${SUBJECT_PREFIX:-"JARVIS AI News Digest"}

# Create configuration file
cat > "$CONFIG_FILE" << EOF
# Email Configuration
# Generated: $(date)
# DO NOT commit this file to git (contains credentials)

# SMTP Server Configuration
export EMAIL_SMTP_SERVER="$SMTP_SERVER"
export EMAIL_SMTP_PORT="$SMTP_PORT"

# Email Credentials
export EMAIL_FROM="$EMAIL_FROM"
export EMAIL_PASSWORD="$EMAIL_PASSWORD"

# Recipient
export EMAIL_TO="$EMAIL_TO"

# Email Settings
export EMAIL_SUBJECT_PREFIX="$SUBJECT_PREFIX"
EOF

chmod 600 "$CONFIG_FILE"  # Secure file permissions

echo ""
echo "=========================================="
echo "✓ Email configuration saved!"
echo "=========================================="
echo ""
echo "Configuration saved to: $CONFIG_FILE"
echo ""
echo "Testing email delivery..."
echo ""

# Test email delivery
source "$CONFIG_FILE"

# Find the most recent digest
LATEST_DIGEST=$(ls -t /Users/terrybyrd/Dropbox/jarvis/reports/news-digests/ai-news-digest-*.md 2>/dev/null | head -1)

if [ -n "$LATEST_DIGEST" ]; then
    echo "Sending test email using: $LATEST_DIGEST"
    python3 "$SCRIPT_DIR/send-email.py" "$LATEST_DIGEST"

    if [ $? -eq 0 ]; then
        echo ""
        echo "=========================================="
        echo "✓ Email setup complete!"
        echo "=========================================="
        echo ""
        echo "Check your inbox at: $EMAIL_TO"
        echo ""
        echo "Daily digests will now be automatically emailed at 9:00 AM"
    else
        echo ""
        echo "=========================================="
        echo "✗ Email test failed"
        echo "=========================================="
        echo ""
        echo "Please check your credentials and try again."
        echo "Run: ./setup-email.sh"
    fi
else
    echo "No digest file found to test with."
    echo "Email configuration is saved. It will be used for the next digest."
fi
