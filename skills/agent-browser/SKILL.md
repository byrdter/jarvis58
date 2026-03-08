---
name: agent-browser
description: Automated web browsing and content extraction
metadata:
  jarvis:
    requires:
      bins:
        - agent-browser
      env:
        []
      config: []
      mcp_servers:
        []
    primaryEnv: ""
    domain: general
    security_level: medium
    requires_approval: false
    allowed_operations:
      - read
      - network
      - execute
    version: 1.0.0
    author: JARVIS
    tags:
      - general
      - web
      - automation
      - scraping
    integrates_with:
      []
    feeds_into:
      []
    consumes_from:
      []
---
# Agent Browser Skill

> **Purpose:** Headless browser automation for web scraping, content extraction, and platform automation
> **CLI Tool:** `agent-browser` (Vercel Labs)
> **Installation:** `npm install -g agent-browser && agent-browser install`

## Overview

Agent Browser is a headless browser automation CLI built specifically for AI agents. It provides a **95% first-try success rate** compared to 80% with Playwright MCP and 75% with Chrome DevTools Protocol.

**Key advantages:**
- **Snapshot-based navigation**: Takes snapshots → creates element references → agents use refs (deterministic)
- **Token efficient**: Compact accessibility trees reduce token usage
- **Reliable**: Built on Playwright with agent-friendly design
- **Free & open source**: No API costs
- **Fast**: Rust CLI with Node.js daemon architecture

## When to Use This Skill

Use agent-browser for:

1. **Web scraping** - Extract content from websites (news, blogs, social media)
2. **Platform automation** - Automate posting to websites without APIs
3. **Data collection** - Gather stats, metrics, or content for analysis
4. **Research automation** - Navigate sites, extract information, follow links
5. **Authentication workflows** - Login to sites, maintain sessions

## Core Workflow

The optimal AI workflow with agent-browser:

```bash
# 1. Navigate to page
agent-browser open https://example.com

# 2. Get interactive elements with refs
agent-browser snapshot -i --json

# 3. Parse snapshot, identify target elements by refs (@e1, @e2, etc.)

# 4. Interact using refs (deterministic, fast)
agent-browser click @e2
agent-browser fill @e3 "input text"

# 5. Get new snapshot after page changes
agent-browser snapshot -i --json

# 6. Close when done
agent-browser close
```

## Essential Commands

### Navigation
```bash
agent-browser open <url>              # Navigate to URL
agent-browser back                    # Go back
agent-browser forward                 # Go forward
agent-browser reload                  # Reload page
agent-browser close                   # Close browser
```

### Snapshot (Most Important)
```bash
agent-browser snapshot                # Full accessibility tree
agent-browser snapshot -i             # Interactive elements only (recommended)
agent-browser snapshot -c             # Compact (remove empty elements)
agent-browser snapshot -d 3           # Limit depth to 3 levels
agent-browser snapshot -s "#main"     # Scope to CSS selector
agent-browser snapshot -i -c --json   # AI-optimized: interactive + compact + JSON
```

**Snapshot options:**
- `-i, --interactive` - Only interactive elements (buttons, links, inputs) - **use this by default**
- `-c, --compact` - Remove empty structural elements - **use this by default**
- `-d, --depth <n>` - Limit tree depth (reduces token usage)
- `-s, --selector <sel>` - Scope to specific area
- `--json` - JSON output for parsing - **use this by default**

### Interaction (Use refs from snapshot)
```bash
agent-browser click @e2               # Click element by ref
agent-browser fill @e3 "text"         # Fill input by ref
agent-browser hover @e4               # Hover element by ref
agent-browser get text @e1            # Get text content by ref
```

### Get Information
```bash
agent-browser get text <sel>          # Get text content
agent-browser get html <sel>          # Get innerHTML
agent-browser get value <sel>         # Get input value
agent-browser get attr <sel> <attr>   # Get attribute
agent-browser get title               # Get page title
agent-browser get url                 # Get current URL
```

### Wait for Elements
```bash
agent-browser wait <selector>         # Wait for element to be visible
agent-browser wait <ms>               # Wait for time (milliseconds)
agent-browser wait --text "Welcome"   # Wait for text to appear
agent-browser wait --url "**/dash"    # Wait for URL pattern
agent-browser wait --load networkidle # Wait for network idle
```

### Sessions (Multiple isolated browsers)
```bash
# Different sessions for different tasks
agent-browser --session news open news-site.com
agent-browser --session social open twitter.com

# Or via environment variable
AGENT_BROWSER_SESSION=news agent-browser snapshot -i
```

### Persistent Profiles (Authentication)
```bash
# Use persistent profile to maintain login sessions
agent-browser --profile ~/.jarvis-twitter-profile open twitter.com

# Login once, then all future sessions are authenticated
agent-browser --profile ~/.jarvis-twitter-profile snapshot -i
```

### Authenticated Sessions (Headers)
```bash
# Set auth headers for specific origin (skips login flow)
agent-browser open api.example.com --headers '{"Authorization": "Bearer <token>"}'
```

### Screenshot & Debug
```bash
agent-browser screenshot page.png     # Take screenshot
agent-browser screenshot --full page.png  # Full page screenshot
agent-browser console                 # View console messages
agent-browser errors                  # View page errors
```

## Selectors

### Refs (Recommended for AI)
```bash
# 1. Get snapshot with refs
agent-browser snapshot -i

# Output:
# - button "Submit" [ref=e1]
# - textbox "Email" [ref=e2]
# - link "Learn more" [ref=e3]

# 2. Use refs to interact (deterministic, fast)
agent-browser click @e1
agent-browser fill @e2 "test@example.com"
```

**Why use refs?**
- Deterministic (exact element from snapshot)
- Fast (no DOM re-query)
- AI-friendly (snapshot + ref workflow is optimal)

### CSS Selectors (Fallback)
```bash
agent-browser click "#submit-button"
agent-browser fill ".email-input" "test@example.com"
```

### Semantic Locators (Human-friendly)
```bash
agent-browser find role button click --name "Submit"
agent-browser find label "Email" fill "test@example.com"
agent-browser find text "Sign In" click
```

## Common Patterns

### Pattern 1: Extract Article Content
```bash
# Open article page
agent-browser open "https://techcrunch.com/some-article"

# Get title
TITLE=$(agent-browser get title)

# Get article text (scoped to article element)
agent-browser snapshot -s "article" --json > article-snapshot.json

# Extract specific content
agent-browser get text "article h1"
agent-browser get text "article .article-content"

# Close
agent-browser close
```

### Pattern 2: Web Scraping with Multiple Pages
```bash
# Open news site
agent-browser open "https://news-site.com"

# Get list of articles with refs
agent-browser snapshot -i --json > homepage.json

# Parse JSON, extract article links (refs like @e5, @e7, etc.)

# Click first article link
agent-browser click @e5

# Wait for page load
agent-browser wait --load networkidle

# Extract article content
agent-browser get text "article"

# Go back and process next article
agent-browser back
agent-browser click @e7

# Close when done
agent-browser close
```

### Pattern 3: Login and Navigate
```bash
# Use persistent profile
agent-browser --profile ~/.jarvis-linkedin-profile open linkedin.com

# Check if already logged in
agent-browser snapshot -i --json > snapshot.json

# If not logged in, perform login
agent-browser find label "Email" fill "user@example.com"
agent-browser find label "Password" fill "password"
agent-browser find role button click --name "Sign in"

# Wait for dashboard
agent-browser wait --url "**/feed"

# Now authenticated session is saved in profile
# Future sessions will skip login

# Navigate to target page
agent-browser open "https://linkedin.com/in/someone"

# Extract data
agent-browser snapshot -i --json

# Close
agent-browser close
```

### Pattern 4: Check for New Content (Daily Automation)
```bash
# Open site
agent-browser open "https://blog.example.com"

# Get first article ref
agent-browser snapshot -i --json > latest.json

# Parse JSON, extract first article title and link
# Compare with last processed article (from state file)

# If new, click and extract content
agent-browser click @e1
agent-browser wait --load networkidle
agent-browser get text "article" > article-content.txt

# Save state (latest article ID)
echo "e1" > last-processed.txt

# Close
agent-browser close
```

## JSON Output Format

When using `--json`, all commands return:

```json
{
  "success": true,
  "data": {
    "snapshot": "- button \"Submit\" [ref=e1]\n- textbox \"Email\" [ref=e2]",
    "refs": {
      "e1": {"role": "button", "name": "Submit"},
      "e2": {"role": "textbox", "name": "Email"}
    }
  }
}
```

Or on error:
```json
{
  "success": false,
  "error": "Element not found: @e99"
}
```

## Integration with JARVIS Skills

### For Research Skills
```bash
# news-aggregator, paper-analyzer, content-miner
# Use agent-browser to scrape sources without APIs

agent-browser open "https://techcrunch.com/category/artificial-intelligence"
agent-browser snapshot -i --json > articles.json
# Parse JSON, extract article refs, process each
```

### For Platform Publisher Skills
```bash
# platform-publisher (automate posting where APIs unavailable)

agent-browser --profile ~/.jarvis-linkedin-profile open "https://linkedin.com"
agent-browser find role button click --name "Start a post"
agent-browser fill @e3 "Post content here"
agent-browser click @e5  # Publish button
```

### For Analytics Aggregator Skills
```bash
# analytics-aggregator (collect stats from platforms)

agent-browser --profile ~/.jarvis-youtube-profile open "https://studio.youtube.com"
agent-browser snapshot -i --json > studio-data.json
# Extract view counts, engagement metrics, etc.
```

## Options Reference

### Global Options
```bash
--session <name>            # Isolated session name
--profile <path>            # Persistent browser profile directory
--json                      # JSON output (for agents)
--headed                    # Show browser window (debugging)
--debug                     # Debug output
```

### Environment Variables
```bash
AGENT_BROWSER_SESSION=name       # Session name
AGENT_BROWSER_PROFILE=/path      # Profile directory
AGENT_BROWSER_USER_AGENT="..."   # Custom user agent
AGENT_BROWSER_PROXY=url          # Proxy server URL
```

## Error Handling

Always check for success in scripts:

```bash
# Test with headed mode first (shows browser window)
agent-browser open https://example.com --headed

# Check if element exists before interacting
agent-browser wait "#submit-button"
agent-browser click "#submit-button"

# Use wait commands for dynamic content
agent-browser wait --load networkidle
agent-browser wait --text "Dashboard"
```

## Performance Tips

1. **Use `-i -c` flags** on snapshot to reduce token usage (interactive + compact)
2. **Limit depth** with `-d` flag if page is deeply nested
3. **Scope snapshots** with `-s` to specific sections
4. **Reuse profiles** for authenticated sessions (avoids repeated login)
5. **Use sessions** for parallel scraping tasks
6. **Close browsers** when done to free resources

## Debugging

```bash
# Show browser window
agent-browser open https://example.com --headed

# View console messages
agent-browser console

# View page errors
agent-browser errors

# Take screenshot
agent-browser screenshot debug.png

# Get full snapshot (not just interactive)
agent-browser snapshot
```

## Security Considerations

1. **Profiles contain auth tokens** - Store in secure locations
2. **Headers are scoped to origin** - Safe for auth tokens
3. **Don't log sensitive data** - Passwords, tokens, etc.
4. **Use environment variables** - For API keys and credentials
5. **Clear sessions** - When testing with personal accounts

## JARVIS Usage Examples

### Example 1: Daily AI News Scraping (news-aggregator skill)
```bash
#!/bin/bash
# Scrape TechCrunch AI section

agent-browser open "https://techcrunch.com/category/artificial-intelligence"
agent-browser wait --load networkidle
agent-browser snapshot -i -c -s ".post-block" --json > articles.json

# Process JSON with Python/Node to extract:
# - Article titles
# - Links
# - Summaries
# - Publication dates

agent-browser close
```

### Example 2: LinkedIn Post Automation (platform-publisher skill)
```bash
#!/bin/bash
# Post to LinkedIn

agent-browser --profile ~/.jarvis-linkedin-profile open "https://linkedin.com"
agent-browser snapshot -i --json > linkedin.json

# Check if logged in (parse JSON for "Start a post" button)

agent-browser find text "Start a post" click
agent-browser wait --text "Share your thoughts"
agent-browser fill @e3 "Your post content here"
agent-browser click @e5  # Post button
agent-browser wait --text "Post successful"

agent-browser close
```

### Example 3: YouTube Stats Collection (analytics-aggregator skill)
```bash
#!/bin/bash
# Collect YouTube video stats

agent-browser --profile ~/.jarvis-youtube-profile open "https://studio.youtube.com"
agent-browser wait --url "**/videos"
agent-browser snapshot -i -c --json > videos.json

# Parse JSON to extract:
# - Video titles
# - View counts
# - Likes
# - Comments
# - Watch time

agent-browser close
```

## Resources

- **GitHub:** https://github.com/vercel-labs/agent-browser
- **Full Documentation:** See README.md in repository
- **Installation:** `npm install -g agent-browser && agent-browser install`
- **Version:** 0.8.4+ (as of Jan 2026)

## Quality Standards

See `design-requirements.md` for output quality standards, error handling patterns, and integration requirements.
