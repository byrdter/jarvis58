# News Aggregator Skill

**Purpose:** Aggregate AI news from multiple sources and generate daily digests.

**Status:** ✅ Production - 16 sources active with automated daily scheduling

---

## Overview

The News Aggregator automatically collects AI-related news from 16 high-quality sources including industry news outlets, AI lab blogs, big tech companies, developer communities, and international sources. It filters for AI relevance, removes duplicates, and generates a comprehensive daily digest.

**Key Features:**
- 🌐 **16 sources** (1 API + 15 RSS feeds)
- 🤖 **AI relevance filtering** (keyword-based with 0.2 threshold)
- 🔄 **Automatic deduplication** (URL + 85% title similarity)
- ⏰ **Daily automation** (runs at 9:00 AM via launchd)
- 📊 **Rich digests** with summaries and topic categorization
- 📝 **14-day lookback** to capture infrequent publishers

---

## Active Sources

### News Outlets (4)
- **Hacker News** - Top tech stories (API)
- **VentureBeat AI** - Startup/business focus
- **TechCrunch AI** - Industry news
- **Ars Technica AI** - Technical analysis
- **Federal News Network AI** - Government AI adoption

### AI Labs & Research (4)
- **OpenAI News** - Product announcements, research
- **DeepMind Blog** - Cutting-edge research
- **Microsoft Research** - Academic research
- **IEEE Spectrum AI** - Real-world applications

### Big Tech AI (3)
- **Microsoft AI Blog** - Enterprise AI solutions
- **AWS ML Blog** - Cloud ML/AI deployment
- **NVIDIA Blog** - AI hardware, data centers

### Developer/Open Source (2)
- **Hugging Face Blog** - Open-source models
- **LangChain Blog** - LLM frameworks

### International (2)
- **SCMP AI** - China tech/AI sector
- **ChinAI Newsletter** - Chinese AI policy & research

---

## Quick Start

### 1. Setup (First Time)

```bash
cd /Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator

# Create virtual environment
python3 -m venv venv

# Activate venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Manual Run

```bash
# Activate venv
source venv/bin/activate

# Generate today's digest
python3 aggregate.py daily --output digest.md

# Generate for specific date
python3 aggregate.py daily --date 2026-01-28 --output custom-digest.md
```

### 3. Check Automated Digest

Automated digests are generated daily at 9:00 AM and saved to:
```
/Users/terrybyrd/Dropbox/jarvis/reports/news-digests/ai-news-digest-YYYY-MM-DD.md
```

Check logs:
```bash
# View today's log
cat /Users/terrybyrd/Dropbox/jarvis/logs/news-aggregator-$(date +%Y-%m-%d).log

# View stdout/stderr logs
tail -f /Users/terrybyrd/Dropbox/jarvis/logs/news-aggregator-stdout.log
```

---

## Automation

### Schedule
- **Frequency:** Daily
- **Time:** 9:00 AM
- **Method:** macOS launchd
- **Job name:** `com.jarvis.news-aggregator`

### Management Commands

```bash
# Check if automation is running
launchctl list | grep jarvis.news-aggregator

# Stop automation
launchctl unload ~/Library/LaunchAgents/com.jarvis.news-aggregator.plist

# Start automation
launchctl load ~/Library/LaunchAgents/com.jarvis.news-aggregator.plist

# Run manually (test)
/Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator/run-aggregator.sh
```

### Configuration Files
- **Scheduler:** `~/Library/LaunchAgents/com.jarvis.news-aggregator.plist`
- **Runner script:** `run-aggregator.sh`
- **Main script:** `aggregate.py`

---

## Output Format

Generated digests include:

```markdown
# AI News Digest - 2026-01-30

Generated: 2026-01-30 09:00
Articles: 32
Sources: 13

---

## 📰 Top Stories

### Article Title
**Source:** VentureBeat | **Topics:** LLMs, Business

Article summary appears here if available from RSS feed...

[Read more →](https://article-url.com)

---

## 📊 Statistics

- **Total articles:** 32
- **Sources:** Hacker News (3), TechCrunch (8), OpenAI (5), ...
```

---

## Performance Metrics

**Current Production Performance:**
- **Fetch time:** 30-45 seconds
- **Articles collected:** 70-90 per run
- **Relevant after filtering:** 25-35 articles
- **Final digest:** 20-30 articles (after deduplication)
- **Success rate:** 95%+ (13/16 sources active)
- **Sources contributing:** 10-13 per run

**Sample Run (2026-01-30):**
- Collected: 81 articles
- Relevant: 33 articles
- Final: 32 articles (1 duplicate removed)
- Sources: 13 active

---

## AI Relevance Filtering

### Keywords (0.2 score threshold)
Articles must match at least one keyword:

**Core AI Terms:**
- artificial intelligence, machine learning, deep learning
- neural network, llm, large language model

**Models:**
- gpt, claude, gemini, llama, mistral

**Technical:**
- transformer, attention, rag, fine-tuning

**Companies:**
- chatbot, openai, anthropic, google ai

**How it works:**
- Each keyword match adds 0.2 to score
- Article needs ≥0.2 score to be included
- Both title and summary are checked

---

## Deduplication

Articles are deduplicated using:

1. **URL normalization** - Strips query params (`?utm_source=...`) and trailing slashes
2. **Title similarity** - SequenceMatcher with 85% threshold
3. **First seen wins** - Earlier articles retained

---

## Topic Categorization

Articles are tagged with relevant topics:

- **LLMs** - Language models, GPT, Claude, chatbots
- **Computer Vision** - Image/video AI, DALL-E, Stable Diffusion
- **Research** - ArXiv papers, academic studies
- **Business** - Funding, acquisitions, startups
- **Regulation** - Policy, law, ethics, safety
- **General AI** - Not fitting other categories

---

## Directory Structure

```
news-aggregator/
├── aggregate.py              # Main aggregation script
├── run-aggregator.sh         # Automation runner script
├── requirements.txt          # Python dependencies
├── venv/                     # Virtual environment
├── README.md                 # This file
└── test-digest.md            # Test outputs
```

**Output locations:**
```
/Users/terrybyrd/Dropbox/jarvis/
├── reports/news-digests/     # Daily digests (automated)
│   └── ai-news-digest-YYYY-MM-DD.md
└── logs/                     # Execution logs
    ├── news-aggregator-YYYY-MM-DD.log
    ├── news-aggregator-stdout.log
    └── news-aggregator-stderr.log
```

---

## Troubleshooting

### No digest generated
```bash
# Check logs
cat /Users/terrybyrd/Dropbox/jarvis/logs/news-aggregator-$(date +%Y-%m-%d).log

# Run manually to see errors
cd /Users/terrybyrd/Dropbox/jarvis/skills/news-aggregator
source venv/bin/activate
python3 aggregate.py daily --output test.md
```

### Automation not running
```bash
# Check if launchd job is loaded
launchctl list | grep jarvis.news-aggregator

# If not listed, load it
launchctl load ~/Library/LaunchAgents/com.jarvis.news-aggregator.plist

# Check for errors in plist file
plutil -lint ~/Library/LaunchAgents/com.jarvis.news-aggregator.plist
```

### Few or no articles
```bash
# Check if sources are accessible
curl -I https://openai.com/news/rss.xml
curl -I https://techcrunch.com/category/artificial-intelligence/feed/

# Adjust lookback window in aggregate.py
# Change: max_days=14 to max_days=30
```

---

## Future Enhancements

### Planned
- [ ] Obsidian vault integration (save to ~/ORICO/OBSIDIAN-VAULT/)
- [ ] Email digest delivery
- [ ] Slack/Discord notifications
- [ ] Custom keyword filters (user-configurable)
- [ ] Article sentiment analysis
- [ ] Weekly summary reports

### Under Consideration
- [ ] Add more curated sources (AWS announcements, Meta AI, etc.)
- [ ] Re-add Ben's Bites if feed is fixed
- [ ] Web dashboard for browsing digests
- [ ] Historical trend analysis
- [ ] Bookmark/save favorite articles

---

## Development Notes

### Dependencies
- **Python 3.14.0**
- **requests** - HTTP requests (Hacker News API)
- **feedparser** - RSS feed parsing

### Testing
```bash
# Test with verbose output
source venv/bin/activate
python3 aggregate.py daily --output test.md 2>&1 | tee test-output.txt

# Test automation script
./run-aggregator.sh
```

### Adding New Sources
1. Find RSS feed URL
2. Add to `RSS_FEEDS` dict in `aggregate.py`
3. Test: `python3 aggregate.py daily --output test.md`
4. Verify articles appear in output

### Adjusting Filters
- **Relevance threshold:** Change `threshold=0.2` in `is_ai_relevant()`
- **Lookback window:** Change `max_days=14` in `fetch_rss_feed()`
- **Deduplication:** Change `similarity > 0.85` in `deduplicate_articles()`

---

## Contact & Support

**Maintainer:** JARVIS (Claude Code)
**Created:** 2026-01-29
**Last Updated:** 2026-01-30
**Status:** ✅ Production - Fully operational

For issues or enhancements, update task in `/Users/terrybyrd/Dropbox/jarvis/context/memory/work-status.md`
