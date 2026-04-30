# Wiki Ingest Skill

**Purpose:** Ingest source documents into the LLM Wiki knowledge base  
**When to use:** After adding new sources to raw/ or generating reports  
**Quality:** Interactive > Batch (ask questions for better synthesis)

---

## What This Skill Does

Takes a source document from `raw/` and synthesizes it into the wiki:
1. Reads source document
2. Asks context questions (what to emphasize, how granular, purpose)
3. Extracts key concepts (3-7)
4. Extracts entities (people, orgs, tools)
5. Creates/updates wiki pages
6. Updates index.md
7. Updates log.md
8. Updates hot.md
9. Updates .manifest.json

---

## How to Use

**Interactive (recommended):**
```
User: "Ingest raw/documents/phase-0-journey.md"
```

**With context:**
```
User: "Ingest the Asset Revesting methodology. This is extremely important for the investments domain, be thorough."
```

**Batch (lower quality):**
```
User: "Ingest all files in raw/documents/"
```

---

## Execution Steps

### 1. Read Source

**Locate source:**
```bash
# User specifies path
raw/documents/phase-0-journey.md

# Or search for it
find raw/ -name "*phase-0*"
```

**Read file:**
- Get full content
- Note file size, type, format
- Check if already ingested (check .manifest.json)

**If already ingested:**
- Compare hash to detect changes
- If unchanged: "Already ingested, no changes detected"
- If changed: "Source updated since last ingest, re-processing"

### 2. Ask Context Questions

**Interactive mode (recommended):**

```markdown
I've read [source name]. Before I synthesize it into the wiki, help me understand your intent:

1. **What do you want to emphasize from this source?**
   (e.g., "The 4-stage methodology" or "The MACD divergence signals")

2. **How granular should I be?**
   - Light: Overview + key concepts (5-10 pages)
   - Medium: Detailed analysis + examples (10-20 pages)
   - Thorough: Comprehensive with all details (20-30 pages)

3. **What's the purpose?**
   - Research: Deep understanding, all connections
   - Reference: Quick lookup, core facts only
   - Decision support: Actionable insights, recommendations

4. **Domain?**
   - investments, health, business, content, research, personal, system
```

**Use answers to guide:**
- Chunking granularity
- Concept extraction depth
- Entity identification
- Cross-referencing intensity

### 3. Extract Key Information

**Concepts (3-7):**
- Main ideas, frameworks, patterns
- Technical terms, methodologies
- Processes, workflows

**Example from Asset Revesting:**
- 4-Stage Analysis
- Stage 2 Entry Signals
- MACD Divergence
- 200 SMA Support
- Portfolio Monitoring

**Entities (people, orgs, tools):**
- Authors, experts mentioned
- Organizations, companies
- Tools, platforms, services

**Example from Asset Revesting:**
- Chris Vermeulen
- Alpaca Markets
- TradingView
- Market Data CLI

### 4. Create/Update Wiki Pages

**Page types to create:**

**A. Source summary page:**
```markdown
---
title: [Source Name]
type: source
domain: [domain]
tags: [tag1, tag2, tag3]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: []
status: reviewed
---

# [Source Name]

**Source:** ^[raw/path/to/source.md]  
**Domain:** [domain]  
**Ingested:** YYYY-MM-DD

## Overview
[1-2 paragraph summary]

## Key Takeaways
- Takeaway 1
- Takeaway 2
- Takeaway 3

## Main Concepts
- [[Concept 1]] — Brief description
- [[Concept 2]] — Brief description

## Entities Mentioned
- [[Entity 1]] — Role/relevance
- [[Entity 2]] — Role/relevance

## Related Pages
- [[Related 1]]
- [[Related 2]]
```

**B. Concept pages (new or update existing):**
```markdown
---
title: [Concept Name]
type: concept
domain: [domain]
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [source1.md, source2.md]
status: draft
---

# [Concept Name]

Brief summary (1-2 sentences).

## Overview
[Comprehensive explanation]

## Key Points
- Point 1
- Point 2
- Point 3

## How It Works (if applicable)
[Step-by-step or detailed mechanics]

## JARVIS Application (if applicable)
[How JARVIS uses this concept]

## Sources
Information derived from:
- [[Source 1]] ^[raw/path]
- [[Source 2]] ^[raw/path]

## Related Concepts
- [[Related 1]] — Relationship
- [[Related 2]] — Relationship
```

**C. Entity pages (people, orgs, tools):**
```markdown
---
title: [Entity Name]
type: entity
domain: [domain]
tags: [person|org|tool, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [source1.md]
status: draft
---

# [Entity Name]

**Type:** Person | Organization | Tool  
**Domain:** [primary domain]  
**Relevance:** [Why this entity matters to JARVIS]

## Overview
[Description of entity]

## Role in JARVIS
[How JARVIS interacts with or uses this entity]

## Key Information
- Fact 1
- Fact 2
- Fact 3

## Mentioned In
- [[Source 1]] ^[raw/path]
- [[Page 1]] — Context

## Related
- [[Related Entity 1]]
- [[Related Entity 2]]
```

### 5. Update index.md

**Add new entries to appropriate sections:**

```markdown
## [Domain] Domain

### Concepts
- [[New Concept]] — One-line summary ( #domain #tag)

### Entities
- [[New Entity]] — One-line summary ( #type #tag)

### Sources
- [[New Source]] — One-line summary ( #source-type #tag)
```

**Keep alphabetically sorted within each section**

### 6. Update log.md

**Add operation entry:**

```markdown
## [YYYY-MM-DD] ingest | [Source Name]

- **Type:** ingest
- **Source:** raw/path/to/source.md
- **Pages updated:** N
- **Pages created:** M
- **Topics extracted:** [topic1, topic2, topic3]
- **Entities identified:** [entity1, entity2]
- **Key insight:** [Most important finding]
- **Duration:** X minutes
- **Granularity:** light | medium | thorough

**Pages affected:**
- Created: [[Page 1]], [[Page 2]], [[Page 3]]
- Updated: [[Existing 1]], [[Existing 2]]

**Cross-references added:** N
```

### 7. Update hot.md

**Add to "Recent Wiki Updates":**

```markdown
## Recent Wiki Updates
- Created [[New Concept]] from source [[Source Name]]
- Updated [[Existing Page]] with new findings
- Added N cross-references
```

**If major source:**
Update "Active Focus" and "Quick Links"

### 8. Update .manifest.json

**Add source entry:**

```json
{
  "sources": [
    {
      "path": "raw/documents/source.md",
      "hash": "sha256:...",
      "ingested_at": "YYYY-MM-DDTHH:MM:SSZ",
      "wiki_pages": [
        "wiki/source-summary.md",
        "wiki/concept-1.md",
        "wiki/concept-2.md"
      ],
      "page_count": 8,
      "topics": ["topic1", "topic2"],
      "domain": "investments"
    }
  ],
  "stats": {
    "total_sources": [increment],
    "total_pages": [update count],
    "last_ingest": "YYYY-MM-DDTHH:MM:SSZ"
  },
  "domains": {
    "[domain]": {
      "pages": [increment],
      "sources": [increment]
    }
  }
}
```

### 9. Report to User

```markdown
## Ingest Complete: [Source Name]

**Source:** raw/path/to/source.md  
**Duration:** X minutes  
**Granularity:** [light|medium|thorough]

**Created:**
- [[Page 1]] — Concept
- [[Page 2]] — Concept
- [[Page 3]] — Entity

**Updated:**
- [[Existing Page]] — Added new findings

**Stats:**
- Pages created: N
- Pages updated: M
- Cross-references added: X
- Concepts extracted: [list]
- Entities identified: [list]

**Key Insight:**
[Most important finding from this source]

**Next Suggestions:**
- Ingest [related source] for deeper understanding of [topic]
- Run wiki-lint to check consistency
- Query wiki for [suggested question]
```

---

## Special Cases

### Investment Reports

**Auto-ingest from skills:**
- market-analysis → raw/reports/market-analysis/SYMBOL-YYYY-MM-DD.md
- etf-screener → raw/reports/etf-screener/YYYY-MM-DD.md

**Use investment template:**
```markdown
---
type: source
domain: investments
tags: [symbol, stage-X, analysis]
---

# [SYMBOL] Analysis YYYY-MM-DD

**Stage:** X  
**Signal:** Buy|Hold|Sell  
**Entry:** $XXX  
**Stop:** $XXX

[Standard market analysis format from SCHEMA.md]
```

### Video Transcripts

**From market-insights skill:**
- raw/transcripts/chris-vermeulen/video-id.md

**Extract:**
- Key predictions
- Market outlook
- Specific stock/ETF mentions
- Timeframe

**Create:**
- Source summary page
- Update entity page: Chris Vermeulen
- Update concept pages if new methodology mentioned

### Large Documents (>100 pages)

**Truncate if needed:**
```markdown
---
truncated: true
original_chars: 250000
processed_chars: 50000
---
```

**Focus on:**
- Executive summary
- Key sections user specified
- Methodology if present

---

## Quality Guidelines

**High-quality ingests:**
- Ask context questions (don't assume)
- Extract 5-7 concepts (not too many, not too few)
- Write clear one-line summaries for index
- Create meaningful cross-references (3+ per page)
- File key insights in synthesis pages if cross-cutting

**Avoid:**
- Batch processing without review
- Creating pages with no cross-references (orphans)
- Overly granular chunking (100+ pages from one source)
- Missing index updates
- Forgetting to update log.md

---

## Integration Points

**Called by:**
- User (manual)
- Daily reflection (auto-ingest learnings)
- Skills (post-tool hooks in Phase 2)

**Calls:**
- SCHEMA.md (for templates)
- index.md (for cataloging)
- log.md (for logging)
- hot.md (for updates)
- .manifest.json (for tracking)

**Updates:**
- wiki/*.md (create/update pages)
- index.md
- log.md
- hot.md
- .manifest.json

---

## Success Criteria

Ingest is successful when:
1. Source read and understood
2. Context questions asked (interactive) or defaults used (batch)
3. Concepts extracted (3-7)
4. Entities identified (1-5)
5. Wiki pages created/updated (5-25 typical)
6. index.md updated
7. log.md updated
8. hot.md updated if significant
9. .manifest.json updated
10. User informed of results

---

## Notes

- **Interactive > Batch:** Asking questions produces better synthesis
- **Typical timing:** 10-15 minutes per source (thorough), 5 minutes (light)
- **Batch timing:** 14 minutes for 36 sources (but lower quality)
- **Cross-references:** More is better (makes wiki more connected)
- **Contradictions:** Flag explicitly, don't smooth over
- **Investment domain:** Use templates from SCHEMA.md

---

**End of Skill**
