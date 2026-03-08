# Academic Research Aggregator - Current Status

**Date:** 2026-01-29
**Status:** ⏸️ On Hold - Researching Alternative Solutions

---

## What We Built

### ✅ Completed Components

1. **Project Structure**
   - Full skill directory created
   - Python script scaffold (`aggregate-research.py`)
   - Documentation (README.md, README-CDP.md)
   - Setup scripts (setup-profile.sh, setup-cdp.sh, test-scraping.sh)

2. **Core Functionality**
   - Research relevance filtering (AI/ML/innovation keywords)
   - Deduplication logic (URL + 85% title similarity)
   - Markdown digest generation
   - Journal-specific scraping functions (scaffold)

3. **Auburn Library Exploration**
   - Successfully navigated EBSCOhost Business Source Premier
   - Documented interface structure
   - Identified navigation patterns for journals
   - Captured MIS Quarterly article structure
   - Understood metadata available (title, authors, abstract, date)

4. **Target Journals Identified**
   - Sloan Management Review
   - MIT Technology Review
   - MIS Quarterly
   - Harvard Business Review
   - Information Systems Research

---

## What Blocked Us

### Primary Issue: Browser Automation Authentication

**Problem:** Auburn Library uses complex EBSCO authentication that doesn't work well with agent-browser's session management.

**Attempted Solutions:**

1. **agent-browser with Profile Storage**
   - Result: Session cookies don't persist
   - Redirects to EBSCO Sign In page on every run
   - Library authentication flow too complex

2. **Chrome CDP Mode (Chrome DevTools Protocol)**
   - Requires: Chrome running with `--remote-debugging-port=9222`
   - Issue: Conflicts with existing Chrome windows
   - User must close all Chrome to enable debugging port
   - Not practical for daily workflow

3. **Firefox Alternative**
   - User preference: Firefox (separate from Chrome)
   - Issue: agent-browser is Chrome-only (built on Playwright/Chrome)
   - Firefox remote debugging works differently
   - Would need different automation tool

4. **Chrome Canary (Separate App)**
   - Would work (independent from Chrome)
   - Requires installation
   - User wants to explore other options first

---

## Technical Constraints Discovered

### agent-browser Limitations

- **Chrome/Chromium only** - No Firefox support
- **Session persistence issues** with complex auth flows
- **CDP mode conflicts** with existing Chrome instances
- **Excellent for public sites**, challenging for authenticated portals

### Auburn Library Specifics

- **EBSCO authentication** - Multi-step SSO flow
- **Session management** - Cookies expire, complex token refresh
- **Database structure** - EBSCOhost interface with nested navigation
- **Article access** - Multiple formats (PDF, Online full text)

---

## Alternative Approaches to Research

### Option 1: Different Automation Tool
- **Selenium** - More mature, better Firefox support
- **Puppeteer** - Similar to Playwright, Chrome-focused
- **Custom Playwright script** - Direct control, not via agent-browser

### Option 2: Browser Extensions
- **Scraping extensions** (Data Miner, Web Scraper)
- Runs in user's active browser
- No authentication conflicts
- Less automation, more manual triggering

### Option 3: Academic APIs
- Some libraries offer APIs for research access
- Check if Auburn provides API access
- May require institutional approval

### Option 4: RSS Feeds
- Some journals provide RSS feeds
- Limited metadata compared to database
- May not cover all 5 target journals

### Option 5: Hybrid Approach
- Manual navigation, automated extraction
- User browses to journal, script extracts data
- Less automated but no auth conflicts

---

## What Works Today

### News Aggregator (Comparison)

The news-aggregator skill works well with agent-browser because:
- **Public websites** (TechCrunch, Hacker News)
- **No authentication** required
- **Simple navigation** patterns
- **Standard HTML** structures

**Lesson:** agent-browser excels at public web scraping, struggles with authenticated portals.

---

## Value Proposition (Still Valid)

### Current Manual Workflow
- Log into Auburn Library
- Navigate to Business Source Premier
- Check 5 journals × 2-3 issues each = 10-15 checks
- Read titles/abstracts for relevance
- Note relevant articles
- **Time:** 30-60 minutes per session

### Proposed Automated Workflow
- Run one command
- JARVIS checks all 5 journals
- Filters for AI/technology relevance
- Generates organized markdown digest
- **Time:** 2-3 minutes (mostly waiting)

### Annual Impact
- **Frequency:** Weekly or bi-weekly
- **Time savings:** 25-55 minutes per session
- **Annual savings:** 20-44 hours
- **Value:** Access to research competitors don't see

---

## Next Steps (When Ready)

1. **User Research Phase**
   - Explore Selenium with Firefox
   - Investigate browser extensions
   - Check Auburn API availability
   - Evaluate RSS feed coverage
   - Test hybrid approaches

2. **Decision Point**
   - Choose automation approach
   - Balance automation vs. manual effort
   - Consider maintenance overhead

3. **Implementation**
   - Adapt existing code to chosen solution
   - Test with 1-2 journals first
   - Expand to all 5 journals
   - Integrate with Obsidian vault

---

## Files Reference

### Created Files
```
skills/academic-research-aggregator/
├── aggregate-research.py      # Main Python script (scaffold)
├── setup-profile.sh           # Profile-based auth (didn't work)
├── setup-cdp.sh               # CDP mode instructions
├── test-scraping.sh           # Testing script
├── README.md                  # General documentation
├── README-CDP.md              # CDP-specific docs
├── STATUS.md                  # This file
└── requirements.txt           # Python dependencies (requests)
```

### Key Functions (in aggregate-research.py)
- `scrape_journal()` - Main entry point
- `scrape_misq()` - MIS Quarterly specific (scaffold)
- `is_research_relevant()` - Keyword-based filtering
- `deduplicate_articles()` - Remove duplicates
- `generate_research_digest()` - Markdown output

---

## Recommendations

### Short Term
- Complete user research on alternative approaches
- Test 1-2 most promising solutions
- Make pragmatic decision (automation vs. manual)

### Long Term
- If automation too complex, accept manual workflow with helper tools
- Revisit when Playwright/agent-browser adds better auth support
- Consider this feature "nice to have" rather than "must have"

### Alternative Focus
- News aggregator is working well
- Could expand news sources instead
- Add more public research sources (ArXiv, preprints)
- Focus on content creation domain

---

**Bottom Line:** All the groundwork is done. Just need the right automation tool that works with the user's workflow. The value is clear, the technical path is the question.

**Status:** Waiting for user research to identify best path forward.
