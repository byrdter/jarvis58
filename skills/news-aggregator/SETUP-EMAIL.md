# Email Delivery Setup Guide

This guide will help you configure email delivery for daily AI news digests.

---

## Quick Setup (5 minutes)

### Step 1: Run Setup Script

```bash
cd /Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator
./setup-email.sh
```

The interactive script will guide you through:
1. Selecting your email provider (Gmail, Outlook, Yahoo, or custom)
2. Entering your email credentials
3. Testing email delivery

### Step 2: Done!

Once configured, daily digests will be automatically emailed to you at 9:00 AM.

---

## Email Provider Instructions

### Option 1: Gmail (Recommended)

**Requirements:**
- Gmail account
- 2-factor authentication enabled
- App password generated

**Steps:**

1. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device
   - Enter "JARVIS News Aggregator"
   - Copy the 16-character password

2. **Run Setup:**
   ```bash
   ./setup-email.sh
   ```

3. **When prompted:**
   - Select: `1` (Gmail)
   - Email address: `your-email@gmail.com`
   - Password: Paste the 16-character app password
   - Send to: Press Enter (same as FROM) or enter different email

**Security Notes:**
- ✅ App passwords are safer than using your main password
- ✅ You can revoke app passwords anytime
- ✅ Credentials stored locally only (not shared)

---

### Option 2: Outlook/Hotmail

**Steps:**

1. **Run Setup:**
   ```bash
   ./setup-email.sh
   ```

2. **When prompted:**
   - Select: `2` (Outlook)
   - Email address: `your-email@outlook.com` or `your-email@hotmail.com`
   - Password: Your regular Outlook password
   - Send to: Press Enter or enter different email

**Note:** Outlook may require enabling "Allow less secure apps" or creating an app password for SMTP access.

---

### Option 3: Yahoo Mail

**Requirements:**
- Yahoo account
- App password generated

**Steps:**

1. **Generate App Password:**
   - Go to Yahoo Account Security settings
   - Select "Generate app password"
   - Select "Other App"
   - Enter "JARVIS News Aggregator"
   - Copy the password

2. **Run Setup:**
   ```bash
   ./setup-email.sh
   ```

3. **When prompted:**
   - Select: `3` (Yahoo)
   - Email address: `your-email@yahoo.com`
   - Password: Paste the app password
   - Send to: Press Enter or enter different email

---

### Option 4: Custom SMTP

For other email providers (work email, custom domain, etc.)

**You'll need:**
- SMTP server hostname (e.g., `smtp.yourdomain.com`)
- SMTP port (usually `587` for TLS)
- Your email address
- Your email password

**Steps:**

1. **Run Setup:**
   ```bash
   ./setup-email.sh
   ```

2. **When prompted:**
   - Select: `4` (Other)
   - Enter your SMTP server details
   - Enter credentials

**Common SMTP Settings:**
- **Gmail:** smtp.gmail.com:587
- **Outlook:** smtp-mail.outlook.com:587
- **Yahoo:** smtp.mail.yahoo.com:587
- **iCloud:** smtp.mail.me.com:587
- **Zoho:** smtp.zoho.com:587

---

## Testing Email Delivery

### Manual Test

After setup, test email delivery manually:

```bash
cd /Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator
source email-config.sh
python3 send-email.py /Users/terrybyrd/Dropbox/jarvis/reports/news-digests/ai-news-digest-2026-01-30.md
```

You should see:
```
Connecting to smtp.gmail.com:587...
Logging in as your-email@gmail.com...
Sending email to your-email@gmail.com...
✓ Email sent successfully: JARVIS AI News Digest - 2026-01-30 (32 articles)
```

### Check Your Inbox

Within 1-2 minutes, check your email for:
- **Subject:** `JARVIS AI News Digest - 2026-01-30 (32 articles)`
- **From:** Your configured email address
- **Content:** HTML-formatted digest with articles

---

## Email Content Preview

You'll receive an HTML email with:

- **Header:** Digest date and article count
- **Top Stories:** Each article with:
  - Title (linked)
  - Source and topics
  - Summary (if available)
  - "Read full article" link
- **Statistics:** Article and source breakdown
- **Footer:** JARVIS attribution

**Sample:**

```
Subject: JARVIS AI News Digest - 2026-01-30 (32 articles)

AI News Digest - 2026-01-30

📰 Top Stories

Amazon is reportedly in talks to invest $50B in OpenAI
Source: TechCrunch | Topics: Business

If a deal materializes, it would mean Amazon is backing
competing startups in the race for AI supremacy.

[Read full article →]

---

[... more articles ...]

📊 Statistics
- Total articles: 32
- Sources: Hacker News (3), TechCrunch (8), OpenAI (5), ...
```

---

## Troubleshooting

### Email not sending

**Check logs:**
```bash
cat /Users/terrybyrd/Dropbox/jarvis/logs/news-aggregator-$(date +%Y-%m-%d).log
```

**Common issues:**

1. **"Email authentication failed"**
   - Gmail: Make sure you're using an App Password, not your regular password
   - Check credentials in `email-config.sh`

2. **"Connection refused"**
   - Check SMTP server and port are correct
   - Check firewall/network settings

3. **"No such file or directory"**
   - Make sure `email-config.sh` exists
   - Run `./setup-email.sh` to create it

### Reconfigure email settings

To change email settings:

```bash
cd /Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator
./setup-email.sh
```

Select `y` when asked to overwrite existing configuration.

### Manual configuration

Advanced users can manually edit `email-config.sh`:

```bash
cd /Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator
nano email-config.sh
```

**Format:**
```bash
export EMAIL_SMTP_SERVER="smtp.gmail.com"
export EMAIL_SMTP_PORT="587"
export EMAIL_FROM="your-email@gmail.com"
export EMAIL_PASSWORD="your-app-password"
export EMAIL_TO="your-email@gmail.com"
export EMAIL_SUBJECT_PREFIX="JARVIS AI News Digest"
```

---

## Security & Privacy

### Credentials Storage

- Credentials stored in: `email-config.sh`
- File permissions: `600` (only you can read/write)
- Not committed to git (listed in `.gitignore`)
- Stored locally only (never sent to cloud)

### Email Sending

- Uses standard SMTP protocol with TLS encryption
- No third-party services (direct SMTP connection)
- Only sends to email address you configure
- No tracking or analytics

### Best Practices

- ✅ Use app passwords instead of regular passwords
- ✅ Review email configuration periodically
- ✅ Revoke app passwords if no longer needed
- ✅ Don't share `email-config.sh` file
- ❌ Don't commit `email-config.sh` to version control

---

## Disabling Email Delivery

To stop receiving email digests:

### Option 1: Remove Configuration (Temporary)

```bash
cd /Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator
rm email-config.sh
```

Digests will still generate but won't be emailed.

### Option 2: Disable All Automation (Permanent)

```bash
launchctl unload ~/Library/LaunchAgents/com.jarvis.news-aggregator.plist
```

Stops both digest generation and email delivery.

To re-enable:
```bash
launchctl load ~/Library/LaunchAgents/com.jarvis.news-aggregator.plist
```

---

## Support

If you encounter issues:

1. Check logs: `/Users/terrybyrd/Dropbox/jarvis/logs/`
2. Test manually: `python3 send-email.py <digest-file>`
3. Verify email config: `cat email-config.sh`
4. Re-run setup: `./setup-email.sh`

---

**Last Updated:** 2026-01-30
**Status:** Ready for setup
