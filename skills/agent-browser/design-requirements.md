# Agent Browser Skill - Design Requirements

> **Purpose:** Quality standards for headless browser automation in JARVIS
> **Skill:** agent-browser
> **Target Success Rate:** 95%+ first-try success

## Design Principles

### 1. Snapshot-First Workflow
**Standard:** Always use snapshot → refs → interact pattern

**Requirements:**
- Get snapshot before any interaction
- Parse refs from snapshot
- Use refs (@e1, @e2) for all interactions
- Re-snapshot after page changes

**Why:** Deterministic, token-efficient, highest success rate

### 2. Compact Output by Default
**Standard:** Use `-i -c` flags on all snapshots

**Requirements:**
- `-i` (interactive only) - Reduces irrelevant elements
- `-c` (compact) - Removes empty structural nodes
- `--json` - Machine-readable output for parsing
- Optional `-d` (depth) - For deeply nested pages

**Example:**
```bash
agent-browser snapshot -i -c --json > snapshot.json
```

### 3. Wait for Stability
**Standard:** Always wait for page to stabilize before snapshot

**Requirements:**
- Use `--load networkidle` for dynamic content
- Use `wait --text` for specific content to appear
- Use `wait <selector>` before interacting with elements
- Add explicit wait times for slow-loading pages

**Example:**
```bash
agent-browser open https://example.com
agent-browser wait --load networkidle
agent-browser snapshot -i -c --json
```

### 4. Error Handling
**Standard:** Graceful degradation with clear error messages

**Requirements:**
- Check for element existence before interaction
- Use `is visible` to verify element state
- Catch and log errors with context
- Provide fallback selectors (ref → CSS → semantic)

**Example:**
```bash
# Check before clicking
if agent-browser is visible @e2 --json | jq -r '.success'; then
  agent-browser click @e2
else
  echo "ERROR: Element @e2 not visible"
  exit 1
fi
```

## Output Quality Standards

### Snapshot Output
**Format:** JSON with refs and accessibility tree

**Required fields:**
- `success` - Boolean status
- `data.snapshot` - Human-readable tree
- `data.refs` - Reference mapping (e1, e2, etc.)

**Quality criteria:**
- Interactive elements clearly identified
- Refs are deterministic and stable
- Accessibility info is complete (role, name, value)

**Example:**
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

### Extracted Content
**Format:** Clean, structured text or JSON

**Quality criteria:**
- Remove navigation, ads, footers
- Extract only relevant content
- Preserve structure (headings, paragraphs)
- Include metadata (title, author, date)

**Example:**
```json
{
  "title": "Article Title",
  "author": "Author Name",
  "date": "2026-01-28",
  "content": "Article text...",
  "url": "https://...",
  "extracted_at": "2026-01-28T12:00:00Z"
}
```

### Error Messages
**Format:** Clear, actionable error descriptions

**Quality criteria:**
- State what failed
- State why it failed (if known)
- Suggest corrective action
- Include context (URL, selector, etc.)

**Example:**
```json
{
  "success": false,
  "error": "Element not found: @e99",
  "context": {
    "url": "https://example.com",
    "action": "click",
    "selector": "@e99"
  },
  "suggestion": "Re-snapshot to get current refs"
}
```

## Integration Patterns

### Pattern 1: Single Page Scraping
**Use case:** Extract content from one page

**Steps:**
1. Open URL
2. Wait for load
3. Snapshot (scoped if possible)
4. Extract content using refs or selectors
5. Format and return data
6. Close browser

**Script template:**
```bash
#!/bin/bash
URL="$1"

agent-browser open "$URL"
agent-browser wait --load networkidle
agent-browser snapshot -i -c -s "article" --json > snapshot.json

# Extract content (use Python/Node to parse JSON)
TITLE=$(agent-browser get text "article h1")
CONTENT=$(agent-browser get text "article .content")

# Output JSON
echo "{\"title\": \"$TITLE\", \"content\": \"$CONTENT\", \"url\": \"$URL\"}"

agent-browser close
```

### Pattern 2: Multi-Page Scraping
**Use case:** Navigate through multiple pages, extract from each

**Steps:**
1. Open starting page
2. Get list of target links (refs)
3. For each link:
   - Click link (by ref)
   - Wait for load
   - Extract content
   - Go back
4. Close browser

**Script template:**
```bash
#!/bin/bash
agent-browser open "https://news-site.com"
agent-browser wait --load networkidle
agent-browser snapshot -i -c --json > links.json

# Parse links.json to get article refs (e.g., e1, e2, e3)

for ref in e1 e2 e3; do
  agent-browser click @$ref
  agent-browser wait --load networkidle

  # Extract content
  CONTENT=$(agent-browser get text "article")
  echo "$CONTENT" > "article-$ref.txt"

  agent-browser back
  agent-browser wait --load networkidle
done

agent-browser close
```

### Pattern 3: Authenticated Session
**Use case:** Login once, maintain session, perform actions

**Steps:**
1. Use persistent profile
2. Open site
3. Check if logged in (snapshot)
4. If not logged in, perform login
5. Navigate and perform actions
6. Close (profile saves auth)

**Script template:**
```bash
#!/bin/bash
PROFILE="$HOME/.jarvis-site-profile"

agent-browser --profile "$PROFILE" open "https://site.com"
agent-browser snapshot -i --json > state.json

# Check if logged in (parse state.json for login form)
if grep -q "Email" state.json; then
  # Not logged in
  agent-browser find label "Email" fill "user@example.com"
  agent-browser find label "Password" fill "$PASSWORD"
  agent-browser find role button click --name "Sign in"
  agent-browser wait --url "**/dashboard"
fi

# Now authenticated, perform actions
agent-browser open "https://site.com/target-page"
agent-browser snapshot -i -c --json > data.json

agent-browser close
```

### Pattern 4: Daily Automation
**Use case:** Check for new content, extract if found

**Steps:**
1. Open site
2. Get first/latest item ref
3. Compare with last processed (from state file)
4. If new, extract and process
5. Update state file
6. Close

**Script template:**
```bash
#!/bin/bash
STATE_FILE="last-processed.txt"

agent-browser open "https://blog.example.com"
agent-browser wait --load networkidle
agent-browser snapshot -i -c --json > latest.json

# Extract first article ref from JSON
LATEST_REF=$(jq -r '.data.refs | keys[0]' latest.json)

# Check state file
if [ -f "$STATE_FILE" ]; then
  LAST_PROCESSED=$(cat "$STATE_FILE")
  if [ "$LATEST_REF" = "$LAST_PROCESSED" ]; then
    echo "No new content"
    agent-browser close
    exit 0
  fi
fi

# New content found, extract it
agent-browser click @$LATEST_REF
agent-browser wait --load networkidle
CONTENT=$(agent-browser get text "article")
echo "$CONTENT" > "new-article-$(date +%Y-%m-%d).txt"

# Update state
echo "$LATEST_REF" > "$STATE_FILE"

agent-browser close
```

## Performance Requirements

### Speed
- **Snapshot generation:** < 2 seconds
- **Page load wait:** < 10 seconds (with timeout)
- **Element interaction:** < 500ms
- **Full scraping session:** < 30 seconds per page

### Resource Usage
- **Memory:** < 500MB per browser instance
- **CPU:** < 50% during active scraping
- **Disk:** < 100MB per profile (cookies, cache)

### Reliability
- **Success rate:** 95%+ first-try
- **Recovery:** Retry on timeout (max 3 attempts)
- **Error detection:** Clear error messages on failure

## Security Standards

### Profile Management
**Requirements:**
- Store profiles in secure locations (`~/.jarvis-profiles/`)
- Use separate profiles for different accounts
- Never commit profiles to git
- Clear profiles when testing with personal accounts

### Credential Handling
**Requirements:**
- Use environment variables for passwords/tokens
- Never log credentials
- Use `--headers` for token-based auth (safer than login forms)
- Clear console history after entering credentials

### Data Privacy
**Requirements:**
- Scrape only public data or authorized content
- Respect robots.txt and rate limits
- Don't collect personal information
- Include user-agent header identifying JARVIS

**Example:**
```bash
AGENT_BROWSER_USER_AGENT="JARVIS/1.0 (Personal Assistant; +https://terrybyrd.com)" agent-browser open https://example.com
```

## Testing Standards

### Before Deployment
**Required tests:**
1. **Headed mode test** - Verify workflow manually
2. **Error handling test** - Test with invalid selectors
3. **Timeout test** - Test with slow-loading pages
4. **Profile test** - Verify auth persistence
5. **JSON parsing test** - Verify output format

**Example test:**
```bash
# Test with headed mode first
agent-browser open https://example.com --headed
agent-browser snapshot -i -c
agent-browser close

# Then test in headless mode (production)
agent-browser open https://example.com
agent-browser snapshot -i -c --json > test.json
jq . test.json  # Verify valid JSON
agent-browser close
```

### Continuous Monitoring
**Requirements:**
- Log all errors to `logs/agent-browser-errors.log`
- Track success rate daily
- Alert on success rate < 90%
- Review failed sessions weekly

## Integration with JARVIS Skills

### For Research Skills (news-aggregator, paper-analyzer, etc.)
**Requirements:**
- Return structured JSON
- Include source URL and timestamp
- Handle pagination if needed
- Extract clean content (no ads, nav, etc.)

### For Platform Publisher Skills (platform-publisher)
**Requirements:**
- Use persistent profiles
- Verify success after posting
- Take screenshots for verification
- Log all actions for audit trail

### For Analytics Skills (analytics-aggregator)
**Requirements:**
- Extract numeric metrics reliably
- Handle missing data gracefully
- Store historical data for trends
- Validate data ranges (no negative views, etc.)

## Debugging Checklist

When agent-browser fails:

1. **Run in headed mode** - `agent-browser open URL --headed`
2. **Check console** - `agent-browser console`
3. **Check errors** - `agent-browser errors`
4. **Take screenshot** - `agent-browser screenshot debug.png`
5. **Verify snapshot** - `agent-browser snapshot` (full, not compact)
6. **Test selector** - Try CSS selector instead of ref
7. **Add wait time** - Increase wait duration
8. **Check network** - Use browser DevTools

## Documentation Standards

Every script using agent-browser must include:

1. **Purpose** - What the script does
2. **Usage** - How to run it
3. **Requirements** - Dependencies, profiles, env vars
4. **Output** - What it produces
5. **Error handling** - What happens on failure
6. **Examples** - Sample usage

**Template:**
```bash
#!/bin/bash
# Purpose: Extract daily AI news from TechCrunch
# Usage: ./scrape-techcrunch.sh > output.json
# Requirements: agent-browser, jq
# Output: JSON array of articles
# Errors: Logs to stderr, exits with non-zero code

set -e  # Exit on error

agent-browser open "https://techcrunch.com/category/artificial-intelligence"
# ... rest of script
```

## Validation Metrics

Track these metrics for all agent-browser usage:

### Success Metrics
- **First-try success rate:** Target 95%+
- **Average execution time:** < 30s per page
- **Error rate:** < 5%

### Quality Metrics
- **Content accuracy:** Manual spot-check 10% of extractions
- **Format compliance:** 100% valid JSON output
- **Missing data rate:** < 1%

### Performance Metrics
- **Pages per minute:** Track throughput
- **Memory usage:** Monitor for leaks
- **Profile size:** Alert if > 100MB

## Updates and Maintenance

### Version Compatibility
- **Current version:** 0.8.4+
- **Update check:** Monthly `npm update -g agent-browser`
- **Breaking changes:** Test with `--headed` mode first

### Skill Evolution
- **Review patterns:** Quarterly review of integration patterns
- **Update templates:** When new features available
- **Share learnings:** Document new patterns in this file

---

**Last Updated:** 2026-01-28
**Version:** 1.0
**Maintainer:** JARVIS (Claude Code)
