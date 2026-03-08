# Academic Research Aggregator - Quick Start

## ✅ Status: WORKING!

The automation successfully extracts AI/business research articles from Auburn Library's Business Source Premier database using the proven CDP browser automation pattern.

**Recent Fix (2026-02-01):** Article links now extract correctly - all 30 articles include clickable links to Auburn Library detail pages.

---

## 🚀 Weekly Usage (Simple!)

**Run this command once a week:**

```bash
~/Dropbox/jarvis/skills/academic-research-aggregator/weekly-research.sh
```

**What it does:**
1. Checks if Chrome is running (or launches it for you)
2. Opens Auburn Library AI in Business search
3. Extracts 30 latest articles
4. Saves markdown digest to Obsidian vault (or jarvis folder)

**Time:** 15-30 seconds total

---

## 📂 Output Location

**Primary (if Obsidian vault exists):**
```
~/ORICO/OBSIDIAN-VAULT/research/academic/ai-business-digest-YYYY-MM-DD.md
```

**Fallback:**
```
~/Dropbox/jarvis/research-digests/ai-business-digest-YYYY-MM-DD.md
```

Both locations also get a JSON file with the raw data.

---

## 🔧 Configure Obsidian Path (Optional)

**Current status:** Using fallback location (Obsidian vault not found)

If you want to save directly to your Obsidian vault, edit the script:

```bash
nano ~/Dropbox/jarvis/skills/academic-research-aggregator/scrape-ai-business.py
```

Find line 18 and update to your vault location:
```python
OBSIDIAN_VAULT = Path.home() / "ORICO" / "OBSIDIAN-VAULT" / "research" / "academic"
```

If you don't configure this, digests will save to `~/Dropbox/jarvis/research-digests/` (works fine!).

---

## 📋 What You Get

**Each digest contains:**
- 30 article titles from AI in Business topic
- Publication names (when detected)
- Authors (when detected)
- Dates (when detected)
- Direct links to Auburn Library articles

**Example articles:**
- Harvard Business Review: "Turn Generative AI from an Existential Threat..."
- "Stop Running So Many AI Pilots"
- "The Gen AI Playbook for Organizations"
- "Artificial Intelligence and Corporate Financing Decisions"

---

## 🎯 Success Metrics

**vs. Manual Process:**
- **Manual:** 30-60 minutes to check journals
- **Automated:** 15 seconds extraction
- **Savings:** ~50 hours/year

**Automation Coverage:**
- ✅ 44,763 total articles in database
- ✅ Extracts 30 most recent/relevant
- ✅ Cross-source (academic + business publications)
- ✅ Pre-filtered for AI/business topics

---

## 🔮 Future Enhancements

**Potential additions:**
1. **More topics** - Leadership, Digital Transformation, Innovation
2. **Better metadata** - Improve author/date/publication extraction
3. **Filtering** - Only show articles from last 30 days
4. **Summaries** - Add AI-generated abstracts
5. **Scheduling** - Auto-run weekly via cron

---

## 🛠️ Troubleshooting

### Chrome not connecting
```bash
# Manually launch Chrome with CDP:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --user-data-dir="$HOME/.jarvis-auburn-profile" \
  --remote-debugging-port=9223 &
```

### Session expired
- Log into Auburn Library in the Chrome window
- Run the script again

### Wrong page
- Make sure you're on the AI in Business search results
- URL should contain: `research.ebsco.com/c/l6vsfb/search/results`

---

## 📊 Sample Output

```markdown
# AI in Business Research Digest
**Generated:** 2026-02-01
**Articles Found:** 30

### Turn Generative AI from an Existential Threat into a Competitive Advantage
**Publication:** Harvard Business Review

### Stop Running So Many AI Pilots
**Publication:** Harvard Business Review

[... 28 more articles ...]
```

---

## 🎉 Achievement Unlocked!

You've successfully automated academic research that was previously blocked by authentication issues. The same CDP pattern that works for lovart.ai image generation now works for Auburn Library research - proving the pattern is robust and reusable across JARVIS skills!

**Created:** 2026-02-01
**Pattern:** OpenClaw CDP browser automation
**Status:** Production ready ✅
