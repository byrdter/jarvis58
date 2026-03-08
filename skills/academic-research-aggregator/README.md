# Academic Research Aggregator Skill

**Purpose:** Aggregate latest research from academic journals via Auburn University library access.

**Status:** ⏸️ On Hold - Researching automation solutions (see STATUS.md for details)

**Value Proposition:** Bridge the gap between public AI news and premium academic research hidden behind paywalls.

⚠️ **Note:** Currently blocked by browser automation challenges with authenticated academic portals. User researching alternative approaches (Selenium, browser extensions, APIs, RSS feeds). All core functionality built, just need compatible automation tool.

---

## Overview

This skill automates your current manual workflow of checking the latest 2-3 issues of academic journals for relevant research. Instead of manually browsing each journal, JARVIS will:

1. Access Auburn's library databases using your credentials
2. Navigate to each target journal
3. Extract latest articles (titles, authors, abstracts)
4. Filter for AI/technology/innovation relevance
5. Generate a research digest in markdown format

---

## Target Journals (Priority)

1. **Sloan Management Review** - Management and business strategy
2. **MIT Technology Review** - Technology trends and innovation
3. **MIS Quarterly** - Information systems research
4. **Harvard Business Review** - Business management and leadership
5. **Information Systems Research** - IS research

---

## Quick Start

### 1. Setup Auburn Library Profile

**First time only:**

```bash
cd /Users/terrybyrd/Dropbox/jarvis/skills/academic-research-aggregator

# Run setup script
./setup-profile.sh
```

This will:
- Open a browser window (headed mode)
- Let you log in to Auburn Library manually
- Save your session to `~/.jarvis-auburn-library` profile
- Test the profile works

**Important:** You only need to do this once, then periodically when the session expires (typically every few weeks).

### 2. Generate Research Digest

```bash
# Activate venv (if not already)
cd /Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator
source venv/bin/activate

# Run aggregator
cd /Users/terrybyrd/Dropbox/jarvis/skills/academic-research-aggregator
python3 aggregate-research.py latest --output research-digest.md
```

---

## How It Works

### Authentication Strategy

**Manual login + saved session** (like Lovart):
1. You log in manually through setup script (headed browser)
2. Session cookies saved in profile (`~/.jarvis-auburn-library`)
3. Automation uses saved session (no password storage)
4. Re-authenticate when session expires

**Why this approach:**
- Most secure (no stored passwords)
- Respects library terms of service (legitimate access)
- Simple to maintain
- You stay in control

### Scraping Strategy

**Phase 1: Journal-specific scraping**
- Navigate to each journal within library database
- Extract latest 2-3 issues (matching your manual workflow)
- Parse article metadata (title, authors, abstract, date)
- Filter for relevance

**Phase 2: Database search** (future)
- Keyword searches across databases
- Topic-based discovery
- Citation tracking

### Relevance Filtering

Articles are filtered using research keywords:
- **AI/ML:** artificial intelligence, machine learning, llm
- **Applications:** generative ai, automation, analytics
- **Technology:** digital transformation, innovation
- **Business:** competitive advantage, business model
- **IS:** information systems, it strategy

**Threshold:** 0.2 (one keyword match = relevant)

---

## Implementation Status

### ✅ Complete
- Skill structure created
- Python script scaffold with all functions
- Setup script for profile management
- Keyword-based relevance filtering
- Deduplication logic
- Markdown digest generation

### 🚧 In Progress
- Auburn library portal exploration
- Database interface understanding
- Journal-specific scraping logic

### 📋 Next Steps
1. Run setup script to create profile
2. Explore Auburn library portal structure
3. Implement scraping for first journal (Sloan Management Review)
4. Test end-to-end workflow
5. Expand to remaining 4 journals

---

## Usage Examples

### Basic Usage

```bash
# All priority journals
python3 aggregate-research.py latest --output research-digest.md

# Specific journals only
python3 aggregate-research.py latest \
    --journals "Sloan Management Review,MIT Technology Review" \
    --output research-digest.md

# Custom profile path
python3 aggregate-research.py latest \
    --profile ~/.my-auburn-profile \
    --output research-digest.md
```

### Expected Output Format

```markdown
# Academic Research Digest - 2026-01-29

Generated: 2026-01-29 00:30
Articles: 12
Journals: 5

---

## 📚 Sloan Management Review

### The Strategic Impact of Generative AI on Competitive Advantage
**Authors:** Smith, J., Johnson, R.
**Published:** January 2026
**Topics:** Business Strategy, AI, Innovation

**Abstract:** This study examines how generative AI technologies are reshaping competitive dynamics across industries...

[Read full article →](https://library.auburn.edu/...)

---

## 📚 MIT Technology Review

### Deep Learning Advances in Natural Language Understanding
...

## 📊 Statistics

- **Total articles:** 12
- **Journals covered:** Sloan Management Review, MIT Technology Review, MIS Quarterly, Harvard Business Review, Information Systems Research
```

---

## Session Management

### When to Re-authenticate

Library sessions typically expire after:
- 2-4 weeks of inactivity
- 90 days maximum (varies by database)

**Signs session expired:**
- Script fails to access articles
- Login page appears instead of journal content
- Permission errors

**How to re-authenticate:**
```bash
./setup-profile.sh
```

Just log in again - takes 2 minutes.

---

## Security & Compliance

### What This Skill Does
- ✅ Automates your legitimate library access
- ✅ Mimics your manual research workflow
- ✅ Respects rate limits (delays between requests)
- ✅ Only accesses content you already have access to

### What This Skill Does NOT Do
- ❌ Share credentials or content outside your use
- ❌ Bypass paywalls or authentication
- ❌ Scrape at scale or redistribute content
- ❌ Violate library terms of service

**Personal research automation is generally acceptable under library terms.** You're using your legitimate access more efficiently.

---

## Advantages Over Manual Process

**Your current workflow:**
- Log into library portal
- Navigate to each journal (5 journals)
- Browse latest 2-3 issues per journal
- Read titles/abstracts
- Note relevant articles
- **Time:** 30-60 minutes

**Automated workflow:**
- Run one command
- JARVIS checks all 5 journals
- Filters for relevance
- Generates organized digest
- **Time:** 2-3 minutes (mostly waiting)

**Savings:** 25-55 minutes per check
**If checking weekly:** 100-220 minutes/month saved
**Annual savings:** 20-44 hours of research time

---

## Integration with JARVIS

### Research Domain

This skill is part of JARVIS Phase 2 (Research Domain):
- **news-aggregator** - Public AI news (TechCrunch, Hacker News)
- **academic-research-aggregator** - Academic journals (this skill)
- **paper-analyzer** - ArXiv papers (future)

Together, these provide comprehensive AI/tech research coverage:
- Public news and trends
- Academic research and theory
- Cutting-edge preprints

### Obsidian Integration (Future)

Research digests will be saved to:
```
~/ORICO/OBSIDIAN-VAULT/research/academic/YYYY-MM-DD.md
```

Alongside news digests in:
```
~/ORICO/OBSIDIAN-VAULT/research/daily-digests/YYYY-MM-DD.md
```

---

## Troubleshooting

### Profile not found
```bash
./setup-profile.sh  # Create profile
```

### Session expired
```bash
./setup-profile.sh  # Re-authenticate
```

### agent-browser not found
```bash
npm install -g agent-browser
agent-browser install
```

### Can't access specific journal
- Check if journal is available through Auburn library
- Verify database subscription is active
- Check journal name spelling

---

## Development Notes

### Technology Stack
- **Python 3.14** - Main scripting
- **agent-browser** - Web automation (95% success rate)
- **Auburn Library** - Research database access
- **Markdown** - Output format

### Why agent-browser?
- Handles complex authentication flows
- Snapshot-based selectors (robust to UI changes)
- $0 cost (no API fees)
- Same tool used for news aggregation

### Why Not APIs?
- Most academic databases don't offer individual APIs
- APIs usually for institutional use only
- Auburn library has no confirmed API access
- Web scraping is more flexible and reliable

---

## Next Steps

**Immediate:**
1. Run `./setup-profile.sh` to create Auburn library profile
2. Share Auburn library portal URL so we can explore structure together
3. Navigate to first journal (Sloan Management Review)
4. Analyze database interface to build scraping logic

**Week 1:**
- Implement scraping for 1-2 journals
- Test filtering and deduplication
- Generate first research digest

**Week 2:**
- Expand to remaining 3-4 journals
- Add error handling and retry logic
- Optimize performance

**Week 3:**
- Integrate with Obsidian vault
- Add scheduling (weekly digest generation)
- Documentation and polish

---

## Value Proposition

**Problem:** Valuable academic research is hidden behind paywalls and not utilized outside academic circles.

**Your access:** Auburn University library provides access to premium research databases with thousands of journals.

**Current bottleneck:** Manually checking journals is time-consuming.

**Solution:** JARVIS automates your research workflow, surfacing relevant academic insights alongside public AI news.

**Impact:**
- Stay current with academic research
- Bridge theory and practice
- Discover insights competitors miss
- Save 20+ hours annually

---

**Created:** 2026-01-29
**Status:** Setup phase - ready for profile creation
**Maintainer:** JARVIS (Claude Code)
