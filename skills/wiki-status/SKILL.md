# Wiki Status Skill

**Purpose:** Quick overview of wiki health and recent activity  
**When to use:** Session start, after operations, or checking progress  
**Speed:** <1 minute (fast stats, no deep analysis)

---

## What This Skill Does

Provides instant wiki health dashboard:
1. Page counts by domain
2. Recent activity summary
3. Hot cache preview
4. Last operations
5. Health indicators
6. Next scheduled tasks

---

## How to Use

**Quick status:**
```
User: "Wiki status" or "How's the wiki?"
```

**Detailed status:**
```
User: "Full wiki status" or "Show me wiki analytics"
```

---

## Execution Steps

### 1. Count Pages

**Total pages:**
```bash
find wiki/ -name "*.md" -type f ! -name "hot.md" ! -name "index.md" ! -name "log.md" | wc -l
```

**By domain:**
```bash
# Read frontmatter from all pages
for domain in investments health business content research personal system; do
  count=$(grep -rl "^domain: $domain" wiki/ | wc -l)
  echo "$domain: $count pages"
done
```

**By type:**
```bash
for type in concept entity source synthesis meta; do
  count=$(grep -rl "^type: $type" wiki/ | wc -l)
  echo "$type: $count pages"
done
```

### 2. Read .manifest.json Stats

**Quick stats:**
```json
{
  "stats": {
    "total_sources": N,
    "total_pages": M,
    "last_lint": "YYYY-MM-DD",
    "last_ingest": "YYYY-MM-DD"
  },
  "domains": {
    "investments": { "pages": X, "sources": Y },
    ...
  }
}
```

### 3. Check Recent Activity

**Last 5 operations from log.md:**
```bash
grep "^## \[" wiki/log.md | tail -5
```

**Parse:**
- Operation type (ingest, query, lint, setup)
- Date
- Source/topic
- Pages affected

### 4. Read Hot Cache Summary

**File:** `wiki/hot.md`

**Extract:**
- Last activity timestamp
- Active focus (top 3 priorities)
- Recent learnings (last 3)
- Quick links (top 3 pages)

### 5. Calculate Health Indicators

**A. Connectivity (cross-references):**
```bash
# Average links per page
total_links=$(grep -roh "\[\[[^]]*\]\]" wiki/*.md | wc -l)
total_pages=$(find wiki/ -name "*.md" -type f ! -name "hot.md" ! -name "index.md" ! -name "log.md" | wc -l)
avg_links=$((total_links / total_pages))
```

**Health:**
- <2 links/page = Poor
- 2-5 links/page = Good
- 5+ links/page = Excellent

**B. Freshness:**
```bash
# Pages updated in last 7 days
recent=$(find wiki/ -name "*.md" -type f -mtime -7 ! -name "hot.md" | wc -l)
```

**Health:**
- 0 recent = Stale
- 1-5 recent = Active
- 5+ recent = Very Active

**C. Coverage:**
```bash
# Domains with content
active_domains=$(for d in investments health business content research personal system; do grep -rl "^domain: $d" wiki/ 2>/dev/null && break; done | wc -l)
```

**Health:**
- 1 domain = Limited
- 2-3 domains = Growing
- 4+ domains = Comprehensive

**D. Index sync:**
```bash
# Pages in wiki but not in index
# (From lint logic)
```

**Health:**
- 0 missing = Perfect sync
- 1-3 missing = Minor drift
- 4+ missing = Out of sync

### 6. Check Scheduled Tasks

**From .manifest.json:**
```json
{
  "scheduled_tasks": {
    "weekly_lint": {
      "schedule": "Sundays 2:30 AM",
      "last_run": "YYYY-MM-DD",
      "next_run": "YYYY-MM-DD"
    },
    "daily_reflection_integration": {
      "enabled": false,
      "note": "Enable in Phase 2"
    }
  }
}
```

### 7. Generate Status Report

**Quick status (default):**
```markdown
## Wiki Status

**Last updated:** YYYY-MM-DD HH:MM

### 📊 Stats
- **Total pages:** N (+ M from existing context cataloged)
- **Sources ingested:** X
- **Domains:** Y active (Z total)
- **Types:** Concepts (A), Entities (B), Sources (C), Synthesis (D)

### 🎯 Recent Activity
- Last ingest: YYYY-MM-DD ([Source Name])
- Last query: YYYY-MM-DD ([Question])
- Last lint: YYYY-MM-DD (Health: Good ✅)
- Pages created last 7 days: N

### 💓 Health
- Connectivity: Excellent (avg 5.2 links/page)
- Freshness: Active (8 pages updated this week)
- Coverage: Growing (3 domains active)
- Index sync: Perfect ✅

### 🔥 Hot Cache
**Active Focus:**
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

**Recent Learnings:**
- [Learning 1]
- [Learning 2]

### 📅 Next
- Weekly lint: Sunday 2:30 AM
- Daily reflection integration: Phase 2
```

**Full status (detailed):**
```markdown
## Wiki Status - Full Report

**Generated:** YYYY-MM-DD HH:MM

---

### 📊 Detailed Statistics

**Total Pages:** N

**By Domain:**
- Investments: X pages, Y sources
- Content: X pages, Y sources
- Business: X pages, Y sources
- System: X pages, Y sources
- Health: X pages, Y sources (future)
- Research: X pages, Y sources (future)
- Personal: X pages, Y sources (future)

**By Type:**
- Concept pages: N
- Entity pages: M
- Source pages: P
- Synthesis pages: Q
- Meta pages: 3 (hot, index, log)

**Sources Ingested:**
- Total: N
- This week: X
- This month: Y

---

### 📈 Growth Over Time

**Last 7 days:**
- Pages created: N
- Pages updated: M
- Sources ingested: P

**Last 30 days:**
- Pages created: N
- Pages updated: M
- Sources ingested: P

**All time:**
- Pages: N (started YYYY-MM-DD)
- Sources: M
- Operations: P

---

### 🔥 Hot Cache

**Last Activity:** YYYY-MM-DD HH:MM
[Full hot cache preview]

---

### 📋 Recent Operations (Last 10)

1. [YYYY-MM-DD] ingest | [Source Name]
2. [YYYY-MM-DD] query | [Question]
3. [YYYY-MM-DD] lint | Weekly Health Check
4. ...

---

### 💓 Health Indicators

**Connectivity:** Excellent ✅
- Average links per page: 5.2
- Orphan pages: 0
- Hub pages (10+ links): 3

**Freshness:** Active ✅
- Updated last 7 days: 8 pages
- Updated last 30 days: 23 pages
- Stale pages (>90 days): 0

**Coverage:** Growing 📈
- Active domains: 3 of 7
- Concepts documented: 15
- Entities documented: 8

**Quality:** Good ✅
- Index sync: Perfect (0 missing)
- Frontmatter complete: 98%
- Convention violations: 2

---

### 🎯 Active Focus Areas

**From hot.md:**
1. [Priority 1 with details]
2. [Priority 2 with details]
3. [Priority 3 with details]

---

### 📅 Scheduled Tasks

**Weekly:**
- Wiki lint: Sundays 2:30 AM (last: YYYY-MM-DD, next: YYYY-MM-DD)

**Daily:**
- Reflection integration: Not yet enabled (Phase 2)

**Monthly:**
- Deep lint: First Sunday of month

---

### 🚀 Recommendations

Based on current status:

1. **High priority:** [Action based on health indicators]
2. **Medium priority:** [Growth opportunities]
3. **Low priority:** [Nice-to-haves]

**Suggested next steps:**
- Ingest [suggested source]
- Create synthesis page for [topic]
- Fix [identified issue]

---

### 📍 Quick Links

**Most accessed pages (from hot.md):**
- [[Page 1]]
- [[Page 2]]
- [[Page 3]]

**Recently updated:**
- [[Page A]] (YYYY-MM-DD)
- [[Page B]] (YYYY-MM-DD)
- [[Page C]] (YYYY-MM-DD)

---

### 📂 File Locations

- **Wiki:** ${JARVIS_PRIVATE}/context/wiki/
- **Raw:** ${JARVIS_PRIVATE}/context/raw/
- **SCHEMA:** ${JARVIS_PRIVATE}/context/SCHEMA.md
- **Manifest:** ${JARVIS_PRIVATE}/context/.manifest.json

---

### 🔧 Commands

**Status:** `wiki-status` (this command)  
**Ingest:** `wiki-ingest raw/path/to/source.md`  
**Query:** `wiki-query "your question"`  
**Lint:** `wiki-lint`  
**Setup:** `wiki-setup`
```

---

## Quick vs Full Status

### Quick Status (Default)
- Stats summary
- Recent activity (last 3)
- Health scores
- Hot cache preview
- <1 minute

### Full Status (On Request)
- Detailed stats breakdown
- Growth over time
- Last 10 operations
- All health indicators
- Recommendations
- File locations
- 2-3 minutes

---

## Health Scoring

### Overall Health

**Excellent:** ✅
- Connectivity: 5+ links/page
- Freshness: 5+ updates/week
- Coverage: 4+ domains active
- Index: Perfect sync

**Good:** ✅
- Connectivity: 3-5 links/page
- Freshness: 2-5 updates/week
- Coverage: 2-3 domains active
- Index: Minor drift (<3 missing)

**Fair:** ⚠️
- Connectivity: 1-3 links/page
- Freshness: 1 update/week
- Coverage: 1 domain active
- Index: Some drift (3-5 missing)

**Needs Attention:** ❌
- Connectivity: <1 link/page
- Freshness: 0 updates/week
- Coverage: 0 active domains
- Index: Out of sync (5+ missing)

---

## Integration Points

**Called by:**
- User (quick health check)
- Session start (optional)
- After operations (verify success)
- Morning briefing (wiki status section)

**Calls:**
- .manifest.json (stats)
- hot.md (recent context)
- log.md (recent operations)
- wiki/*.md (page counts, health metrics)

**Updates:**
- None (read-only skill)

---

## Performance

**Quick status:**
- Read .manifest.json: 100 tokens
- Read hot.md: 500 tokens
- Grep log.md: 200 tokens
- Count pages: 100 tokens
- **Total: ~900 tokens**

**Full status:**
- All of above + detailed analysis: ~2k tokens

---

## Success Criteria

Status report is successful when:
1. All stats accurate
2. Recent activity shown (last 3-5)
3. Health indicators calculated
4. Hot cache preview included
5. Recommendations relevant
6. <1 minute for quick status
7. User can see wiki health at a glance

---

## Notes

- **Fast by design:** <1k tokens for quick status
- **Read-only:** Doesn't modify wiki
- **Morning briefing ready:** Can be called automatically
- **Health tracking:** Shows wiki growing over time
- **Recommendations:** Suggests next actions based on status

---

**End of Skill**
