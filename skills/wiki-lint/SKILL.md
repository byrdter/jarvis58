# Wiki Lint Skill

**Purpose:** Health check the LLM Wiki for inconsistencies and gaps  
**When to use:** Weekly, before big decisions, or when wiki feels "off"  
**Frequency:** Sundays 2:30 AM (automated) or manual on demand

---

## What This Skill Does

Runs comprehensive health checks on the wiki:
1. Finds inconsistencies and contradictions
2. Identifies missing data and gaps
3. Detects orphan pages and broken links
4. Suggests new pages and syntheses
5. Validates structure and conventions
6. Generates lint report
7. Updates log.md

---

## How to Use

**Full lint:**
```
User: "Run wiki lint" or "Check wiki health"
```

**Quick lint (recent pages only):**
```
User: "Quick lint on recent pages"
```

**Targeted lint:**
```
User: "Lint the investments domain"
```

---

## Execution Steps

### 1. Sample Pages (Avoid Full Scan)

**Sampling strategy:**
- Random 10 pages (diversity)
- Recent 10 pages (most likely to have issues)
- Total: 20 pages checked

**Why sample?**
- Full scan expensive (100+ pages = 50k+ tokens)
- Recent pages most likely to have new issues
- Random sample catches old issues

**How to sample:**
```bash
# Recent 10 pages (by modification time)
find wiki/ -name "*.md" -type f ! -name "hot.md" ! -name "index.md" ! -name "log.md" -exec ls -t {} + | head -10

# Random 10 pages
find wiki/ -name "*.md" -type f ! -name "hot.md" ! -name "index.md" ! -name "log.md" | shuf | head -10
```

**Full lint option:**
- User explicitly requests it
- Before major refactoring
- Monthly deep check

### 2. Check for Inconsistencies

**What to look for:**

**A. Contradictions between pages:**
```bash
# Look for explicit contradiction callouts
grep -r "\[!contradiction\]" wiki/

# Look for conflicting claims
# Example: Stage 2 entry criteria
grep -ri "stage 2" wiki/ | grep -i "entry"
```

**Manual check:**
- Read pages claiming same concept
- Compare definitions, criteria, examples
- Note differences

**Report if found:**
```markdown
⚠️ **Contradiction found:**
- [[Page A]] claims: [statement A]
- [[Page B]] claims: [statement B]
- **Impact:** [Which pages affected]
- **Resolution needed:** [Suggest investigation or web search]
```

**B. Stale claims (source updated, page not):**
```bash
# Check .manifest.json for sources with different hash
# Compare source ingest date to page update date
```

**Report if found:**
```markdown
⚠️ **Stale page detected:**
- [[Page X]] — Last updated: YYYY-MM-DD
- Source [[Source Y]] — Re-ingested: YYYY-MM-DD
- **Action:** Re-read source and update page
```

### 3. Identify Missing Data

**What to look for:**

**A. Concepts mentioned but not defined:**
```bash
# Find wikilinks that don't exist
grep -roh "\[\[[^]]*\]\]" wiki/ | sort | uniq > /tmp/wiki-links.txt
find wiki/ -name "*.md" | xargs basename -s .md | sort > /tmp/wiki-pages.txt
comm -23 /tmp/wiki-links.txt /tmp/wiki-pages.txt
```

**Report:**
```markdown
📝 **Missing pages** (mentioned but don't exist):
- [[Concept A]] — Mentioned in 3 pages
- [[Entity B]] — Mentioned in 2 pages
- **Suggestion:** Create stub pages or ingest sources
```

**B. Incomplete frontmatter:**
```bash
# Check for pages missing required fields
for file in wiki/*.md; do
  if ! grep -q "^title:" "$file"; then
    echo "$file missing title"
  fi
  if ! grep -q "^type:" "$file"; then
    echo "$file missing type"
  fi
  if ! grep -q "^tags:" "$file"; then
    echo "$file missing tags"
  fi
done
```

**Report:**
```markdown
⚠️ **Incomplete frontmatter:**
- [[Page X]] — Missing: type, tags
- [[Page Y]] — Missing: sources
- **Action:** Add missing frontmatter fields
```

**C. Gaps in knowledge:**

**Questions to ask:**
- Are there domains with 0 pages? (should there be?)
- Are there concepts mentioned 5+ times with no dedicated page?
- Are there entities that need more detail?

**Suggest web searches or sources to ingest:**
```markdown
🔍 **Suggested research:**
- "Flash Attention" mentioned 8 times, no page → Search and ingest
- "Portfolio rebalancing" mentioned 5 times, no page → Create from existing pages
```

### 4. Detect Structural Issues

**A. Orphan pages (no inbound links):**
```bash
# Find pages with 0 references
for file in wiki/*.md; do
  filename=$(basename "$file" .md)
  count=$(grep -r "\[\[$filename\]\]" wiki/ | wc -l)
  if [ "$count" -eq 0 ]; then
    echo "$filename is orphaned"
  fi
done
```

**Report:**
```markdown
🏝️ **Orphan pages** (no inbound links):
- [[Page A]] — Not linked from any other page
- [[Page B]] — Not linked from any other page
- **Action:** Add cross-references or verify page is needed
```

**B. Hubs (>10 inbound links):**
```bash
# Find pages with many references (may need splitting)
for file in wiki/*.md; do
  filename=$(basename "$file" .md)
  count=$(grep -r "\[\[$filename\]\]" wiki/ | wc -l)
  if [ "$count" -gt 10 ]; then
    echo "$filename has $count references (hub)"
  fi
done
```

**Report:**
```markdown
📊 **Hub pages** (10+ inbound links):
- [[4-Stage Analysis]] — 23 references
- [[JARVIS]] — 15 references
- **Consider:** May be too broad, consider splitting into subtopics
```

**C. Index inconsistencies:**
```bash
# Pages exist but not in index
find wiki/ -name "*.md" -type f ! -name "hot.md" ! -name "index.md" ! -name "log.md" -exec basename {} .md \; | sort > /tmp/wiki-files.txt
grep -oh "\[\[[^]]*\]\]" wiki/index.md | sed 's/\[\[\|\]\]//g' | sort > /tmp/index-entries.txt
comm -23 /tmp/wiki-files.txt /tmp/index-entries.txt
```

**Report:**
```markdown
📋 **Index missing entries:**
- [[Page X]] exists but not in index.md
- [[Page Y]] exists but not in index.md
- **Action:** Add to appropriate index section
```

### 5. Validate Conventions

**A. File naming:**
```bash
# Check for non-standard names (spaces, capitals, etc.)
find wiki/ -name "*[A-Z ]*" -type f
```

**B. Tag format:**
```bash
# Check for inconsistent tag format
grep -rh "^tags:" wiki/ | grep -E "[A-Z]|[^a-z0-9\-,\[\] ]"
```

**C. Wikilink format:**
```bash
# Check for broken wikilink syntax
grep -rn "\[\[[^]]*\]\]" wiki/ | grep -E "\[\[ |\[\[.*[^]]\]"
```

**Report if issues found:**
```markdown
⚠️ **Convention violations:**
- [[Page Name With Spaces]] — Should use hyphens
- Tag: #InvestMents — Should be lowercase
- Wikilink: [[ Page ]] — No spaces after [[
```

### 6. Suggest Opportunities

**A. New page candidates:**
```bash
# Topics mentioned 5+ times without dedicated page
# (Already found in missing data check)
```

**B. Synthesis opportunities:**
```bash
# Find related pages that could be synthesized
# Example: 3+ pages about same general topic
```

**Report:**
```markdown
✨ **Synthesis opportunities:**
- Pages about token efficiency (3 pages) → Could create synthesis: "Token Reduction Strategies"
- Pages about Stage 2 signals (4 pages) → Could create synthesis: "Complete Stage 2 Guide"
- **Action:** Consider creating synthesis pages
```

**C. Suggested web searches:**

Based on gaps, suggest:
```markdown
🌐 **Suggested web searches:**
- "Flash Attention vs standard attention" → Fill knowledge gap
- "MACD divergence reliability" → Add research to methodology
```

### 7. Generate Lint Report

**Create:** `wiki/lint-reports/YYYY-MM-DD.md`

```markdown
---
title: Wiki Lint Report YYYY-MM-DD
type: meta
domain: system
tags: [lint, health-check]
created: YYYY-MM-DD
---

# Wiki Lint Report

**Date:** YYYY-MM-DD  
**Type:** Full | Quick | Targeted  
**Pages checked:** N  
**Duration:** X minutes

---

## Summary

- ✅ Contradictions: N found
- ✅ Missing data: M gaps identified
- ✅ Orphan pages: X found
- ✅ Broken links: Y found
- ✅ Convention violations: Z found

**Overall health:** Excellent | Good | Fair | Needs Attention

---

## Inconsistencies

[List contradictions found]

---

## Missing Data

[List gaps, missing pages, incomplete frontmatter]

---

## Structural Issues

[List orphans, hubs, index inconsistencies]

---

## Suggestions

### New Pages
[List candidates]

### Synthesis Opportunities
[List potential syntheses]

### Web Searches
[List suggested research]

---

## Actions Taken

[If lint auto-fixed anything]

---

## Recommendations

1. [Action 1]
2. [Action 2]
3. [Action 3]

---

## Next Lint

**Scheduled:** [Next Sunday or on-demand]
```

### 8. Update log.md

```markdown
## [YYYY-MM-DD] lint | Weekly Health Check

- **Type:** lint
- **Pages checked:** N (random 10 + recent 10)
- **Inconsistencies found:** X
- **Orphan pages:** Y
- **Missing cross-refs:** Z
- **Suggestions:** M new pages, P syntheses
- **Duration:** X minutes
- **Overall health:** Good

**Report:** wiki/lint-reports/YYYY-MM-DD.md
```

### 9. Update .manifest.json

```json
{
  "stats": {
    "last_lint": "YYYY-MM-DDTHH:MM:SSZ"
  }
}
```

### 10. Report to User

**Summary report:**
```markdown
## Wiki Lint Complete

**Pages checked:** N  
**Health:** Good ✅

**Found:**
- Contradictions: X
- Missing pages: Y
- Orphan pages: Z

**Suggestions:**
- Create N new pages
- M synthesis opportunities
- P web searches recommended

**Full report:** wiki/lint-reports/YYYY-MM-DD.md

**Top priority:**
1. [Most important action]
2. [Second priority]
3. [Third priority]

Would you like me to:
1. Fix orphan pages (add cross-references)?
2. Create missing pages?
3. Research suggested topics?
```

---

## Lint Types

### Quick Lint (Default)
- Sample 20 pages (recent 10 + random 10)
- Basic checks (contradictions, orphans, index)
- 5-10 minutes
- Good for weekly rhythm

### Full Lint (Monthly)
- Check all pages
- Deep consistency checks
- Convention validation
- 30-60 minutes
- Before major refactoring

### Targeted Lint (On-Demand)
- Specific domain or topic
- All pages in domain
- Focused checks
- 10-20 minutes
- Before big decisions

### Pre-Decision Lint
- Check pages related to decision
- Find contradictions that could affect decision
- Validate information is current
- 5 minutes
- Before portfolio rebalancing, major changes

---

## Quality Guidelines

**High-quality lint:**
- Sample appropriately (don't scan all pages unless needed)
- Surface contradictions explicitly
- Suggest concrete actions
- Prioritize findings (not all findings equal)
- File detailed report

**Avoid:**
- Full scans every time (expensive)
- Listing trivial issues
- Not suggesting fixes
- Overwhelming user with minor issues

---

## Integration Points

**Called by:**
- User (manual)
- Scheduled task (Sundays 2:30 AM)
- Before big decisions
- After batch ingests

**Calls:**
- wiki/*.md (sample or all)
- index.md (validation)
- .manifest.json (update)
- log.md (record operation)

**Updates:**
- wiki/lint-reports/YYYY-MM-DD.md (create)
- log.md (add entry)
- .manifest.json (update last_lint)

---

## Success Criteria

Lint is successful when:
1. Appropriate sample checked (or all if requested)
2. Inconsistencies identified
3. Missing data found
4. Structural issues detected
5. Suggestions made
6. Report generated
7. Actions prioritized
8. log.md updated
9. User informed

---

## Notes

- **Sample, don't scan:** 20 pages sufficient for weekly checks
- **Prioritize findings:** Not all issues equal priority
- **Suggest fixes:** Don't just report problems
- **Weekly rhythm:** Sundays after knowledge update
- **Before decisions:** Run targeted lint on decision-relevant pages
- **Investment domain:** Contradictions critical (market data vs expert opinions)

---

**End of Skill**
