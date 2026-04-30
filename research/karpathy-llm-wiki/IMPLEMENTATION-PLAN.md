# LLM Wiki Implementation Plan for JARVIS

**Date:** April 11, 2026  
**Status:** Ready for implementation  
**Estimated Timeline:** Phase 1 (1-2 days), Phase 2 (1 week), Phase 3 (ongoing)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Research Foundation](#research-foundation)
3. [Current vs LLM Wiki Approach](#current-vs-llm-wiki-approach)
4. [Architecture Design](#architecture-design)
5. [Implementation Phases](#implementation-phases)
6. [File Structure](#file-structure)
7. [File Templates](#file-templates)
8. [Migration Strategy](#migration-strategy)
9. [Skill Specifications](#skill-specifications)
10. [Integration Points](#integration-points)
11. [Success Metrics](#success-metrics)
12. [Risk Assessment](#risk-assessment)
13. [Appendix](#appendix)

---

## Executive Summary

### Is LLM Wiki Right for JARVIS?

**YES.** The LLM Wiki pattern is an exceptional fit for JARVIS because:

1. **Proven at scale** - 20+ implementations, 5,000+ combined stars, successful wikis with 100+ sources
2. **Token efficiency** - 90-95% reduction in token usage vs current approach
3. **Knowledge compounding** - Each interaction strengthens the knowledge base
4. **Session recovery** - Hot cache pattern enables instant context restoration
5. **Contradiction tracking** - Critical for investment signals (market data vs expert opinions)
6. **Perfect architectural fit** - Aligns with existing JARVIS skills + progressive disclosure system

### The Core Problem LLM Wiki Solves

**Current JARVIS approach:**
- Static context files read every session (10k-20k tokens)
- Knowledge scattered across memory files, learnings, work-status
- No automatic cross-referencing or synthesis
- Session recovery requires re-reading entire context
- Contradictions between sources not explicitly tracked
- Token costs scale linearly with knowledge base size

**LLM Wiki approach:**
- Dynamic, LLM-maintained knowledge base (500-1000 token hot cache)
- Knowledge automatically synthesized and cross-referenced
- Progressive disclosure (read index → specific pages)
- Session recovery via hot.md (90% context in <500 tokens)
- Explicit contradiction tracking with callouts
- Token costs stay constant as knowledge base grows

### Key Innovation: Hot Cache Pattern

The "hot cache" is a rolling ~500 word summary of recent context that enables:
- **Session recovery** - Read hot.md first (500 tokens) instead of full context (20k tokens)
- **Agent-to-agent communication** - Subagents read hot cache, not full wiki
- **Progressive disclosure** - Hot cache → index → specific pages (only when needed)
- **Automatic maintenance** - Updated after every skill execution, daily reflection, session end

This is the killer feature for JARVIS. Phase 3B daily reflection already extracts learnings - now it can also maintain hot.md automatically.

### Expected Outcomes

**1-2 days (Phase 1):**
- SCHEMA.md, hot.md, index.md, log.md created
- Existing context cataloged in index
- 3-5 wiki skills operational (setup, ingest, query, lint, status)

**1 week (Phase 2):**
- Manifest.json delta tracking operational
- Hot cache auto-updates integrated with daily reflection
- Investment domain templates (ETF analysis, market signal, thesis)
- Token usage reduced 70-80% for session recovery

**Ongoing (Phase 3):**
- All existing documentation ingested (Phase 0-3 journey)
- Learnings automatically extracted to concept/entity pages
- Context system becomes self-maintaining
- Knowledge compounds with every skill execution

---

## Research Foundation

### Sources Analyzed

1. **Karpathy's Original Gist**
   - https://gist.github.com/karpathy/1dd0294ef9567971c1e4348a90d69285
   - Defines three-layer architecture (raw → wiki → schema)
   - Establishes core operations (ingest, query, lint)

2. **YouTube Video Analysis (2 videos, 73k words)**
   - "How I Use LLMs" - Practical applications, knowledge compression patterns
   - "Deep Dive into LLMs & ChatGPT" - Technical fundamentals, context management

3. **GitHub Implementation Analysis (20+ repos, 5,000+ stars)**
   - Top 5 implementations deeply analyzed
   - Common patterns extracted across all implementations
   - Best practices, pitfalls, and edge cases documented

### Key Insights from Research

**From GitHub Implementations:**

1. **Universal three-layer architecture** - Every implementation uses raw/ → wiki/ → SCHEMA.md
2. **Index.md is critical** - LLM navigation map, update after every ingest
3. **Log.md enables audit trail** - Chronological operations log, parseable format
4. **Hot cache pattern works** - Session recovery in <500 tokens (claude-obsidian, 433 stars)
5. **Two-phase compilation** - Extract concepts first, then generate pages (prevents duplicates)
6. **Manifest delta tracking** - Hash-based change detection (llm-wiki-compiler, 337 stars)
7. **Project-scoped pages** - Global + project-specific knowledge (obsidian-wiki, 282 stars)
8. **Contradiction callouts** - Obsidian callout blocks for explicit tracking
9. **Query answers filed back** - Explorations compound into wiki, not chat history
10. **Incremental > perfect** - Start small (5-10 sources), refine during lint passes

**From Karpathy's Philosophy:**

- **Wiki is the product, chat is the interface** - The persistent artifact is what matters
- **Knowledge compounds like interest** - Each source makes the whole wiki more valuable
- **LLM maintains, human curates** - Human adds sources, LLM does all writing/filing/cross-referencing
- **Progressive disclosure** - Read summaries first, drill into details only when needed

**Token Efficiency Data:**

| Approach | Session Start | Knowledge Query | Total/Session |
|----------|---------------|-----------------|---------------|
| **Current JARVIS** | 15k tokens (read all context) | 5k tokens (find relevant files) | 20k tokens |
| **LLM Wiki** | 500 tokens (hot.md) | 1k tokens (index → pages) | 1.5k tokens |
| **Savings** | 97% reduction | 80% reduction | **92% reduction** |

---

## Current vs LLM Wiki Approach

### Current JARVIS Context System

**Structure:**
```
jarvis-private/context/
├── CLAUDE.md              # Orchestrator (read every session)
├── memory/
│   ├── learnings.md       # Accumulated insights
│   ├── user-preferences.md
│   └── work-status.md     # Current task tracking
├── projects/
│   └── investments/
│       └── CLAUDE.md      # Asset Revesting methodology
└── tools/
    ├── market-data-cli.md
    ├── agent-browser.md
    └── obsidian-vault.md
```

**Workflow:**
1. Session starts → Read CLAUDE.md (2k tokens)
2. Read work-status.md (1k tokens)
3. If task involves investments → Read projects/investments/CLAUDE.md (5k tokens)
4. If using tool → Read tools/[tool-name].md (2k tokens)
5. Execute skill → Update memory files manually
6. Total: 10k-15k tokens per session start

**Strengths:**
- Progressive disclosure working (don't read all files upfront)
- Memory system tracks learnings and work status
- Project-scoped knowledge (investments, content creation)
- Tool documentation centralized

**Weaknesses:**
- No automatic cross-referencing (learnings in one file, not linked to projects)
- Session recovery still requires reading 10k+ tokens
- No contradiction tracking (market signal vs expert opinion conflicts)
- Knowledge doesn't compound (learnings stay static, not synthesized)
- Manual updates required (human decides what to write in learnings.md)
- No audit trail (can't see history of context evolution)

### LLM Wiki Approach

**Structure:**
```
jarvis-private/context/
├── SCHEMA.md              # LLM Wiki schema (instructions for maintenance)
├── hot.md                 # 500-word rolling summary (read first!)
├── index.md               # Content catalog (navigation map)
├── log.md                 # Operations log (audit trail)
├── .manifest.json         # Delta tracking (what's been processed)
├── memory/                # Existing (gradually migrate to wiki format)
├── projects/              # Existing (add wiki/ subdirectories)
├── tools/                 # Existing (compile into wiki/tools/)
└── wiki/
    ├── sources/           # Per-source summaries (skills, tools, market data)
    ├── entities/          # People, orgs, tools (Chris Vermeulen, Alpaca API)
    ├── concepts/          # Ideas, patterns (Asset Revesting, MACD divergence)
    ├── synthesis/         # Cross-cutting analysis (investment thesis)
    └── outputs/           # Filed query answers (explorations)
```

**Workflow:**
1. Session starts → Read hot.md (500 tokens) - recent context summary
2. If need more detail → Read index.md (1k tokens) - catalog of all pages
3. If specific query → Read 3-5 relevant pages (2k tokens)
4. Execute skill → Auto-update hot.md, log.md, index.md (LLM maintains)
5. Total: 500-3.5k tokens per session start (depending on depth needed)

**Strengths:**
- **92% token reduction** (500 tokens vs 15k for session start)
- **Automatic cross-referencing** (wikilinks between entities, concepts, sources)
- **Contradiction tracking** (explicit callouts for conflicting signals)
- **Knowledge compounding** (each skill execution enriches the wiki)
- **Self-maintaining** (LLM updates index, log, hot cache automatically)
- **Audit trail** (log.md shows every operation with timestamps)
- **Session recovery** (hot.md = 90% context in <500 tokens)
- **Progressive disclosure** (hot → index → specific pages)

**Migration Path:**
- Existing context files stay in place
- Wiki structure added alongside
- Gradually migrate content over 1-2 weeks
- No breaking changes (progressive enhancement)

### Hybrid Recommendation: Best of Both Worlds

**Keep from Current:**
- CLAUDE.md as orchestrator (now points to SCHEMA.md for wiki operations)
- Project structure (projects/investments/, projects/content-creation/)
- Tool documentation (tools/*.md)

**Add from LLM Wiki:**
- hot.md (rolling summary)
- index.md (content catalog)
- log.md (operations log)
- .manifest.json (delta tracking)
- wiki/ subdirectory (entities, concepts, synthesis)

**Result:** Unified system that preserves existing knowledge while adding compounding, self-maintaining capabilities.

---

## Architecture Design

### Three-Layer Model (Karpathy's Pattern)

```
┌──────────────────────────────────────────────────────────┐
│                    Layer 1: RAW SOURCES                   │
│                     (Immutable, Read-Only)                │
├──────────────────────────────────────────────────────────┤
│  - Skill documentation (skills/*/SKILL.md)               │
│  - Tool documentation (context/tools/*.md)               │
│  - Market data (Alpaca API responses, JSON)              │
│  - Expert content (Chris Vermeulen transcripts)          │
│  - Execution logs (agent-sdk/logs/*.log)                 │
│  - Reports (reports/market-analysis/*.md)                │
│  - Documentation (PHASE-*.md, README.md)                 │
└──────────────────────────────────────────────────────────┘
                            ↓
                    LLM reads, extracts
                            ↓
┌──────────────────────────────────────────────────────────┐
│               Layer 2: WIKI (LLM-Maintained)              │
│                   (Dynamic, Compounding)                  │
├──────────────────────────────────────────────────────────┤
│  wiki/sources/       Per-source summaries                │
│    ├── market-data-cli.md                                │
│    ├── etf-screener-skill.md                             │
│    └── vermeulen-video-2026-04-10.md                     │
│                                                           │
│  wiki/entities/      People, orgs, tools                 │
│    ├── chris-vermeulen.md                                │
│    ├── alpaca-api.md                                     │
│    └── asset-revesting.md                                │
│                                                           │
│  wiki/concepts/      Ideas, patterns                     │
│    ├── stage-analysis.md                                 │
│    ├── macd-divergence.md                                │
│    └── progressive-disclosure.md                         │
│                                                           │
│  wiki/synthesis/     Cross-cutting analysis              │
│    ├── investment-thesis.md                              │
│    ├── tool-ecosystem.md                                 │
│    └── jarvis-evolution.md                               │
│                                                           │
│  wiki/outputs/       Filed query answers                 │
│    └── spy-analysis-exploration.md                       │
└──────────────────────────────────────────────────────────┘
                            ↑
                    LLM navigates via
                            ↑
┌──────────────────────────────────────────────────────────┐
│              Layer 3: SCHEMA (Instructions)               │
│                  (Human-Curated, Evolves)                 │
├──────────────────────────────────────────────────────────┤
│  SCHEMA.md           How to maintain the wiki            │
│  hot.md              Recent context (500 words)          │
│  index.md            Content catalog (navigation)        │
│  log.md              Operations log (audit trail)        │
│  .manifest.json      Delta tracking (hash-based)         │
└──────────────────────────────────────────────────────────┘
```

### Data Flow

**Ingest Operation (Skill Execution):**
```
1. User executes skill: /market-analysis SPY
2. Skill reads raw source: Alpaca API → SPY data
3. Skill generates report: reports/market-analysis/SPY-2026-04-11.md
4. wiki-ingest triggers:
   a. Read report (raw source)
   b. Extract key concepts (MACD divergence, Stage 2, etc.)
   c. Update/create wiki pages:
      - wiki/sources/market-analysis-spy-2026-04-11.md
      - wiki/concepts/macd-divergence.md (update)
      - wiki/entities/spy-etf.md (update)
   d. Update index.md (add new entries)
   e. Update log.md (append operation record)
   f. Update hot.md (recent context summary)
   g. Update .manifest.json (track processed file)
5. Knowledge compounded: Next query about "MACD" automatically references SPY example
```

**Query Operation (Context Retrieval):**
```
1. Session starts or question asked
2. Read hot.md (500 tokens) - "What's recent?"
3. If need more: Read index.md (1k tokens) - "What exists?"
4. If specific: grep/search keywords in wiki/ - "Where is it?"
5. Read 3-5 relevant pages (2-3k tokens) - "Deep dive"
6. Synthesize answer with citations
7. If valuable: File answer to wiki/outputs/ or wiki/synthesis/
8. Update hot.md (add to recent context)
```

**Daily Reflection Integration (Phase 3B):**
```
1. 8 AM: Daily reflection triggers
2. Reads yesterday's logs (agent-sdk/logs/*.log)
3. Extracts learnings (existing Phase 3B logic)
4. NEW: Instead of updating learnings.md manually:
   a. Run wiki-ingest on extracted learnings
   b. Creates/updates wiki/concepts/ pages
   c. Cross-references with existing entities
   d. Updates hot.md with new insights
   e. Appends to log.md
5. Morning briefing includes hot.md summary
6. Knowledge automatically compounds daily
```

### Progressive Disclosure Flow

```
Session Start
    ↓
Read hot.md (500 tokens)
    ↓
Sufficient? → YES → Execute task
    ↓ NO
Read index.md (1k tokens)
    ↓
Find relevant pages via categories/tags
    ↓
Read 3-5 specific pages (2-3k tokens)
    ↓
Deep dive complete → Execute task
    ↓
After task: Update hot.md, log.md, index.md
```

**Token Comparison:**

| Scenario | Current | LLM Wiki | Savings |
|----------|---------|----------|---------|
| Quick task (portfolio check) | 15k tokens | 500 tokens | 97% |
| Medium task (market analysis) | 20k tokens | 2k tokens | 90% |
| Deep research (new strategy) | 30k tokens | 5k tokens | 83% |

---

## Implementation Phases

### Phase 1: Foundation (1-2 Days)

**Goal:** Create core wiki infrastructure and catalog existing context.

**Tasks:**

1. **Create SCHEMA.md** (2 hours)
   - Adapt from top GitHub implementations
   - Customize for JARVIS domains (investments, content creation)
   - Define page templates (entity, concept, source, synthesis)
   - Specify ingest/query/lint workflows
   - Include frontmatter conventions

2. **Create hot.md** (30 minutes)
   - Initial summary of current JARVIS state
   - Recent work from work-status.md
   - Active projects and next steps
   - Template for auto-updates

3. **Create index.md** (2 hours)
   - Catalog all existing context files
   - Organize by category (memory, projects, tools)
   - Add one-line summaries
   - Include tags for searchability

4. **Create log.md** (30 minutes)
   - Bootstrap with recent session history
   - Extract from git commits (last 30 days)
   - Add Phase 0-3 milestones
   - Establish format for future entries

5. **Create .manifest.json** (1 hour)
   - List all existing context files with hashes
   - Include metadata (last updated, category)
   - Track skills and tools
   - Set up delta detection logic

6. **Create wiki/ directory structure** (30 minutes)
   ```bash
   mkdir -p ../jarvis-private/context/wiki/{sources,entities,concepts,synthesis,outputs}
   ```

7. **Create initial wiki skills** (4-6 hours)
   - `/wiki-setup` - Initialize new domains
   - `/wiki-ingest` - Process sources into wiki
   - `/wiki-query` - Search wiki and file answers
   - `/wiki-lint` - Check consistency and contradictions
   - `/wiki-status` - Show recent activity and stats

**Deliverables:**
- `SCHEMA.md` (1,500-2,000 words)
- `hot.md` (500 words)
- `index.md` (100-150 entries)
- `log.md` (30 entries from git history)
- `.manifest.json` (50+ files tracked)
- `wiki/` directory with subdirectories
- 5 wiki skills in `skills/wiki-*`

**Success Criteria:**
- Can read hot.md and understand current JARVIS state
- Can navigate index.md to find any existing context file
- Can run `/wiki-status` and see overview
- Token usage for session start: <1k tokens (vs 15k current)

**Time Estimate:** 10-12 hours total (1-2 workdays)

---

### Phase 2: Enhancement (1 Week)

**Goal:** Integrate with existing workflows and enable automatic maintenance.

**Tasks:**

1. **Implement hot cache auto-updates** (4 hours)
   - Hook into skill execution (post-tool hook)
   - Update hot.md after every skill completes
   - Extract key changes to summary
   - Limit to 500 words (rolling window)

2. **Integrate with daily reflection** (6 hours)
   - Modify Phase 3B daily reflection task
   - After extracting learnings, run `/wiki-ingest`
   - Auto-create/update concept pages
   - Cross-reference with entities
   - Update hot.md with insights

3. **Create investment domain templates** (4 hours)
   - ETF analysis template (for sources)
   - Market signal template (for concepts)
   - Investment thesis template (for synthesis)
   - Expert opinion template (Chris Vermeulen videos)

4. **Add contradiction tracking** (3 hours)
   - Obsidian callout syntax for contradictions
   - `/wiki-lint` detects conflicting claims
   - Create `wiki/contradictions/` directory
   - Example: Market signal vs expert opinion

5. **Implement manifest delta tracking** (4 hours)
   - Hash-based change detection
   - Only process changed files
   - Track which sources produced which pages
   - Enable "what's new since yesterday" queries

6. **Create compilation workflow for tools/skills** (6 hours)
   - Two-phase: Extract capabilities → Generate pages
   - Catalog all CLI tools (market-data, agent-browser)
   - Catalog all skills (market-analysis, etf-screener, etc.)
   - Generate unified tool reference in wiki/tools/
   - Auto-update when new tools/skills added

7. **Add project-scoped pages** (3 hours)
   - `wiki/projects/investments/` subdirectory
   - Investment-specific entities (ETFs, indicators)
   - Cross-link to global concepts
   - Enable domain isolation

**Deliverables:**
- Auto-updating hot.md (after every skill + daily reflection)
- Investment domain templates (4 templates)
- Contradiction tracking system
- Manifest-based delta detection
- Compiled tool/skill catalog
- Project-scoped wiki pages

**Success Criteria:**
- hot.md updates automatically after market-analysis skill
- Daily reflection creates concept pages from learnings
- Can detect contradictions (e.g., signal vs expert opinion)
- Can query "what's new since yesterday" (manifest delta)
- Tool/skill catalog auto-generated from documentation

**Time Estimate:** 30 hours total (1 week with 4-6 hours/day)

---

### Phase 3: Migration & Scaling (Ongoing)

**Goal:** Gradually migrate existing knowledge and establish maintenance rhythm.

**Week 1-2: Content Migration**

1. **Ingest existing documentation** (10 hours)
   - Phase 0-3 journey documents (OPTIONS-A-B-C-D-SUMMARY.md, etc.)
   - Extract milestones, decisions, learnings
   - Create entity pages (Alpaca API, Chris Vermeulen, etc.)
   - Create concept pages (Asset Revesting, Stage Analysis, etc.)

2. **Ingest existing learnings** (6 hours)
   - memory/learnings.md → wiki/concepts/
   - Extract individual learnings to concept pages
   - Cross-reference with sources
   - Retire old learnings.md (redirect to wiki)

3. **Ingest existing reports** (8 hours)
   - reports/market-analysis/*.md → wiki/sources/
   - Extract signals to wiki/concepts/
   - Link to ETF entities
   - Build historical signal database

**Week 3-4: Automation & Refinement**

4. **Establish maintenance rhythm** (ongoing)
   - Daily: hot.md auto-update via reflection
   - Weekly: `/wiki-lint` pass (check contradictions, orphans)
   - Monthly: `/wiki-refactor` (consolidate, prune stale content)

5. **Extend to new domains** (as needed)
   - Content creation domain wiki
   - Research domain wiki (when Phase 3+ adds research projects)
   - Health domain wiki (future)

**Deliverables:**
- All Phase 0-3 documentation ingested
- All learnings extracted to concept pages
- All market analysis reports ingested
- Maintenance rhythm established
- New domains bootstrapped as needed

**Success Criteria:**
- Can query "What did we learn in Phase 1?" → get synthesized answer
- Can search "MACD divergence" → see all examples across reports
- Can detect "What contradictions exist in investment signals?"
- hot.md always reflects accurate recent state
- Context system is 90% self-maintaining

**Time Estimate:** 4 weeks with 4-6 hours/week (ongoing background task)

---

## File Structure

### Complete Directory Layout

```
${JARVIS_PRIVATE}/context/

├── CLAUDE.md                    # [EXISTING] Orchestrator (now references SCHEMA.md)
├── SCHEMA.md                    # [NEW] LLM Wiki schema and instructions
├── hot.md                       # [NEW] Rolling 500-word summary (read first!)
├── index.md                     # [NEW] Content catalog (navigation map)
├── log.md                       # [NEW] Operations log (append-only)
├── .manifest.json               # [NEW] Delta tracking (hash-based)
│
├── memory/                      # [EXISTING] Gradually migrate to wiki format
│   ├── learnings.md             # [MIGRATE] → wiki/concepts/
│   ├── user-preferences.md      # [KEEP] Evolves to wiki/entities/terry-byrd.md
│   └── work-status.md           # [KEEP] Source for hot.md updates
│
├── projects/                    # [EXISTING] Add wiki/ subdirectories
│   ├── investments/
│   │   ├── CLAUDE.md            # [EXISTING] Methodology reference
│   │   └── wiki/                # [NEW] Investment-specific wiki
│   │       ├── entities/        # ETFs, indicators, brokers
│   │       ├── concepts/        # Signals, patterns, strategies
│   │       └── synthesis/       # Investment thesis, portfolio evolution
│   └── content-creation/
│       ├── CLAUDE.md            # [EXISTING]
│       └── wiki/                # [NEW] Content-specific wiki
│
├── tools/                       # [EXISTING] Compile to wiki/tools/
│   ├── README.md                # [EXISTING] Tool index
│   ├── market-data-cli.md       # [EXISTING] → becomes source for wiki
│   ├── agent-browser.md         # [EXISTING] → becomes source for wiki
│   └── obsidian-vault.md        # [EXISTING] → becomes source for wiki
│
└── wiki/                        # [NEW] Global wiki (cross-domain)
    ├── sources/                 # Per-source summaries
    │   ├── market-data-cli.md
    │   ├── etf-screener-skill.md
    │   ├── phase-1-complete.md
    │   └── vermeulen-video-2026-04-10.md
    │
    ├── entities/                # People, orgs, tools
    │   ├── chris-vermeulen.md
    │   ├── alpaca-api.md
    │   ├── claude-code.md
    │   └── terry-byrd.md
    │
    ├── concepts/                # Ideas, patterns
    │   ├── asset-revesting.md
    │   ├── stage-analysis.md
    │   ├── macd-divergence.md
    │   ├── progressive-disclosure.md
    │   └── llm-wiki-pattern.md
    │
    ├── synthesis/               # Cross-cutting analysis
    │   ├── jarvis-evolution.md
    │   ├── investment-thesis.md
    │   ├── tool-ecosystem.md
    │   └── phase-learnings.md
    │
    └── outputs/                 # Filed query answers
        ├── spy-analysis-exploration.md
        └── macd-vs-rsi-comparison.md
```

### File Size Guidelines

| File | Target Size | Max Size | Update Frequency |
|------|-------------|----------|------------------|
| hot.md | 500 words | 700 words | After every skill, daily |
| index.md | 2-3k words | 5k words | After every ingest |
| log.md | Growing | Unlimited | After every operation |
| SCHEMA.md | 1.5-2k words | 3k words | Monthly (evolve schema) |
| Entity page | 300-500 words | 1k words | As new info added |
| Concept page | 500-800 words | 2k words | As new sources ingested |
| Source page | 500-1k words | 3k words | Once (immutable) |
| Synthesis page | 1-2k words | 5k words | Monthly (major updates) |

---

## File Templates

### 1. SCHEMA.md Template

```markdown
# JARVIS Wiki Schema

> LLM-maintained knowledge base following Karpathy's LLM Wiki pattern.
> This file defines how the wiki is structured and maintained.
> Updated: 2026-04-11

---

## What This Is

JARVIS maintains a persistent, compounding wiki inside the private context directory. You don't just execute skills and forget. You build and maintain a structured knowledge base that gets richer with every skill execution, market analysis, and learning extraction.

The human (Terry) curates sources and asks questions. You (Claude) do all the writing, cross-referencing, filing, and maintenance.

The wiki is the product. Chat is just the interface.

**Key difference from current approach:** The wiki is a persistent artifact. Cross-references are already there. Contradictions have been flagged. Synthesis already reflects everything learned. Knowledge compounds like interest.

---

## Three-Layer Architecture

### Layer 1: Raw Sources (Immutable)

Sources you READ from but NEVER modify:

- **Skill documentation:** `skills/*/SKILL.md`
- **Tool documentation:** `context/tools/*.md`
- **Market data:** Alpaca API responses (JSON)
- **Expert content:** Chris Vermeulen video transcripts
- **Execution logs:** `agent-sdk/logs/*.log`
- **Reports:** `reports/market-analysis/*.md`
- **Documentation:** `PHASE-*.md`, `README.md`

**Rule:** Never edit raw sources. They are the immutable record.

### Layer 2: Wiki (LLM-Maintained)

Knowledge you WRITE and MAINTAIN:

```
wiki/
├── sources/      Per-source summaries (one per raw source ingested)
├── entities/     People, orgs, tools (Chris Vermeulen, Alpaca API, SPY ETF)
├── concepts/     Ideas, patterns (MACD divergence, Stage 2, progressive disclosure)
├── synthesis/    Cross-cutting analysis (investment thesis, tool ecosystem)
└── outputs/      Filed query answers (explorations worth preserving)
```

**Rule:** Update these files freely. Cross-reference liberally. Synthesize actively.

### Layer 3: Schema (Instructions)

Files that guide your wiki maintenance:

- **SCHEMA.md** (this file) - How to maintain the wiki
- **hot.md** - Rolling 500-word summary (recent context)
- **index.md** - Content catalog (navigation map)
- **log.md** - Operations log (audit trail)
- **.manifest.json** - Delta tracking (what's been processed)

**Rule:** Update these after every operation (ingest, query, lint).

---

## Core Operations

### 1. Ingest (Process New Source)

**When:** Skill completes, market data fetched, learning extracted

**Steps:**
1. Read raw source
2. Create summary in `wiki/sources/[source-name].md`
3. Extract 3-7 key concepts/entities
4. Update or create entity/concept pages (link to source)
5. Cross-reference related pages (wikilinks)
6. Update `index.md` (add new entries)
7. Update `log.md` (append operation record)
8. Update `hot.md` (refresh recent context)
9. Update `.manifest.json` (track file hash)

**Example:**
```
Source: reports/market-analysis/SPY-2026-04-11.md
  ↓
Creates/Updates:
  - wiki/sources/market-analysis-spy-2026-04-11.md (summary)
  - wiki/concepts/macd-divergence.md (detected in SPY)
  - wiki/entities/spy-etf.md (add latest analysis)
  - index.md (add source + concept entries)
  - log.md (append ingest operation)
  - hot.md (update: "Latest market analysis detected MACD divergence in SPY")
```

### 2. Query (Answer Question)

**When:** User asks question, session starts

**Steps:**
1. Read `hot.md` (500 tokens) - recent context
2. Read `index.md` (1k tokens) - content catalog
3. Search/grep wiki for relevant keywords
4. Read 3-5 relevant pages (2-3k tokens)
5. Synthesize answer with citations
6. If valuable: File answer to `wiki/outputs/` or `wiki/synthesis/`
7. Update `hot.md` (add query context)
8. Update `log.md` (append query record)

**Progressive disclosure:**
- Quick questions: hot.md only (500 tokens)
- Medium questions: hot.md + index.md + 2-3 pages (2k tokens)
- Deep research: hot.md + index.md + 5-10 pages (5k tokens)

### 3. Lint (Check Consistency)

**When:** Weekly (Sunday night), after major ingest batch

**Checks:**
- **Contradictions:** Pages making conflicting claims
- **Orphans:** Pages with no inbound links
- **Broken links:** Wikilinks to non-existent pages
- **Missing cross-refs:** Related pages not linked
- **Stale claims:** Source updated but wiki page didn't
- **Index inconsistencies:** File exists but not in index

**Output:** Create/update `wiki/meta/lint-report-YYYY-MM-DD.md`

**Fix:** Update pages, add cross-refs, flag contradictions

### 4. Refactor (Consolidate & Prune)

**When:** Monthly, when wiki gets large (>100 pages)

**Actions:**
- Merge duplicate concepts
- Split overly large pages
- Archive stale synthesis
- Reorganize categories
- Update hot.md with major changes

---

## Page Templates

### Source Page Template

```yaml
---
title: Source Title
type: source
source_type: skill | tool | market_data | expert_content | documentation
source_path: path/to/raw/source
ingested: 2026-04-11
tags: [tag1, tag2, tag3]
---

# Source Title

**Type:** [skill/tool/market_data/expert_content/documentation]  
**Date:** 2026-04-11  
**Raw Source:** [path](link)

## Summary

2-3 paragraphs summarizing the source.

## Key Concepts

- [[Concept 1]] — Brief explanation
- [[Concept 2]] — Brief explanation
- [[Concept 3]] — Brief explanation

## Entities Mentioned

- [[Entity 1]] — Role in this source
- [[Entity 2]] — Role in this source

## Insights

- Bullet points of key insights
- Cross-referenced to concepts/entities

## Related

- [[Related Source 1]]
- [[Concept Page 1]]
```

### Entity Page Template

```yaml
---
title: Entity Name
type: entity
entity_type: person | organization | tool | system | etf
created: 2026-04-11
updated: 2026-04-11
tags: [tag1, tag2]
sources: [source1.md, source2.md]
---

# Entity Name

**Type:** [person/organization/tool/system/etf]  
**Status:** Active/Retired/In Development

## Overview

2-3 paragraphs describing what this entity is.

## Key Characteristics

- Characteristic 1
- Characteristic 2
- Characteristic 3

## Relationships

- **Related to** [[Entity 2]] — nature of relationship
- **Uses** [[Tool 1]] — how it's used
- **Part of** [[System 1]] — broader context

## History

Timeline of important events or changes.

## In JARVIS

How this entity is used in JARVIS context.

## Sources

- [[Source 1]] — What we learned
- [[Source 2]] — Additional info
```

### Concept Page Template

```yaml
---
title: Concept Name
type: concept
created: 2026-04-11
updated: 2026-04-11
tags: [tag1, tag2]
sources: [source1.md, source2.md]
---

# Concept Name

## Definition

Clear, concise definition (2-3 sentences).

## Explanation

2-4 paragraphs explaining the concept in depth.

## Examples

Concrete examples from JARVIS usage:

1. **Example 1** — Context and outcome
2. **Example 2** — Context and outcome

## Related Concepts

- [[Concept 1]] — relationship
- [[Concept 2]] — relationship

## Applications in JARVIS

How this concept is used in practice.

## Contradictions

> [!contradiction]
> [[Source A]] claims X but [[Source B]] says Y.
> Resolution needed: [action item]

## Sources

- [[Source 1]] — Where we learned this
- [[Source 2]] — Additional perspective
```

### Synthesis Page Template

```yaml
---
title: Synthesis Topic
type: synthesis
created: 2026-04-11
updated: 2026-04-11
tags: [tag1, tag2]
sources: [source1.md, source2.md, source3.md]
---

# Synthesis Topic

**Last Updated:** 2026-04-11  
**Sources Integrated:** 5

## Overview

2-3 paragraphs synthesizing knowledge from multiple sources.

## Key Themes

### Theme 1

Synthesis across sources.

### Theme 2

Synthesis across sources.

## Patterns

Patterns observed across multiple sources/experiences.

## Open Questions

- Question 1 requiring more research
- Question 2 requiring more data

## Evolution

Timeline of how this synthesis has evolved:

- **2026-01:** Initial understanding from source 1
- **2026-02:** Updated with source 2, shifted perspective
- **2026-04:** Current synthesis incorporating 5 sources

## Sources

- [[Source 1]] — Contribution
- [[Source 2]] — Contribution
```

---

## Frontmatter Conventions

All wiki pages use YAML frontmatter:

```yaml
---
title: Page Title
type: source | entity | concept | synthesis | output
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2, tag3]
sources: [source1.md, source2.md]
status: draft | active | archived  # optional
---
```

**Tags taxonomy:**

- **Domain:** investments, content-creation, research, health
- **Type:** tool, skill, pattern, methodology, signal
- **Stage:** planning, active, complete, archived
- **Priority:** critical, high, medium, low

---

## Cross-Referencing

### Wikilinks

Use Obsidian-compatible wikilinks:

- Basic: `[[page-name]]`
- With display text: `[[page-name|Display Name]]`
- With path: `[[wiki/concepts/page-name]]`

### Source Attribution

Cite sources inline or in frontmatter:

- Inline: `According to [[Source 1]], ...`
- Frontmatter: `sources: [source1.md, source2.md]`

### Relationship Types

- **Mentions:** Casual reference
- **Supports:** Provides evidence for
- **Contradicts:** Conflicts with
- **Builds On:** Extends idea from
- **Questions:** Challenges assumption in

---

## Contradiction Tracking

Use Obsidian callout syntax:

```markdown
> [!contradiction]
> [[Page A]] claims transformers are 2017, but [[Page B]] says 2014.
> Resolution: Check Attention paper publication date.
```

Create dedicated page for major contradictions: `wiki/meta/contradictions.md`

**Investment domain example:**

```markdown
> [!contradiction]
> [[Chris Vermeulen Video 2026-04-10]] recommends long position in SPY.
> [[Market Analysis 2026-04-11]] detected bearish MACD divergence.
> Resolution: Wait for 200 SMA confirmation before entry.
```

---

## Maintenance Rhythm

### Daily (Automatic)

- **8 AM:** Daily reflection extracts learnings → `/wiki-ingest`
- **After every skill:** Update `hot.md`, `log.md`

### Weekly (Manual)

- **Sunday night:** Run `/wiki-lint` (check contradictions, orphans)
- **Review:** Check `wiki/meta/lint-report.md`, fix issues

### Monthly (Manual)

- **First Sunday:** Run `/wiki-refactor` (consolidate, prune)
- **Schema review:** Evolve SCHEMA.md based on usage patterns

---

## JARVIS-Specific Domains

### Investments Domain

**Entity types:**
- ETFs (SPY, QQQ, TLT, etc.)
- Indicators (MACD, RSI, SMA)
- Brokers (Alpaca, Interactive Brokers)
- Experts (Chris Vermeulen, Stan Weinstein)

**Concept types:**
- Stage Analysis (Accumulation, Markup, Distribution, Decline)
- Signals (MACD divergence, RSI overbought, breakout)
- Strategies (Asset Revesting, position sizing, stop loss)
- Patterns (Cup and handle, head and shoulders)

**Synthesis types:**
- Investment thesis (current market view)
- Portfolio evolution (allocation changes over time)
- Strategy performance (backtesting results)

### Content Creation Domain

**Entity types:**
- Platforms (YouTube, Instagram, TikTok)
- Tools (Lovart AI, HeyGen, NotebookLM)
- Brands (Byrddynasty)

**Concept types:**
- Content formats (YouTube Shorts, Instagram Reels)
- Promotional strategies (10-day blitz, drip campaigns)
- Image systems (catalog, URL management)

**Synthesis types:**
- Content library evolution
- Platform performance analysis
- Brand identity refinement

---

## Success Metrics

**Token efficiency:**
- Session start: <1k tokens (vs 15k current)
- Medium query: <3k tokens (vs 20k current)
- Deep research: <5k tokens (vs 30k current)

**Knowledge compounding:**
- New source ingested → 5-10 pages updated
- Query answered → 1-2 pages created/updated
- Weekly lint → 3-5 improvements made

**Self-maintenance:**
- 90% of updates automatic (via daily reflection, skill hooks)
- 10% manual (weekly lint, monthly refactor)

**Audit trail:**
- Every operation logged in `log.md`
- Every file tracked in `.manifest.json`
- Every change visible in git history

---

## Next Steps After Bootstrap

1. Ingest existing documentation (Phase 0-3 journey)
2. Migrate learnings.md to wiki/concepts/
3. Compile tools/skills to wiki/tools/
4. Establish daily maintenance rhythm
5. Extend to new domains as needed

---

## References

- **Karpathy's Gist:** https://gist.github.com/karpathy/1dd0294ef9567971c1e4348a90d69285
- **Top Implementation:** https://github.com/AgriciDaniel/claude-obsidian (hot cache pattern)
- **JARVIS Context:** `../context/CLAUDE.md` (orchestrator)
- **JARVIS Skills:** `../../skills/` (execution layer)
```

---

### 2. hot.md Template

```markdown
---
type: meta
title: "Hot Cache - Recent Context"
updated: 2026-04-11T15:30:00
---

# JARVIS Hot Cache

> Rolling summary of recent context. Read this FIRST at session start.
> Auto-updated after every skill execution and daily reflection.

**Last Updated:** April 11, 2026 3:30 PM

---

## Current State

**Phase:** 3B Complete (Daily Reflection + Morning Briefing operational)  
**Active Projects:** Investments (portfolio monitoring), Content Creation (launch planning)  
**Latest:** Researching LLM Wiki implementation for context system enhancement

---

## Recent Work (Last 7 Days)

### April 11, 2026
- Researched Karpathy's LLM Wiki pattern
- Analyzed 20+ GitHub implementations
- Extracted best practices for JARVIS integration
- Planning implementation (hot cache, manifest delta, contradiction tracking)

### April 10, 2026
- Added knowledge base GUI to Command Center
- Integrated YouTube scraper with auto-updates
- 125 videos indexed, 2,087 segments searchable
- Weekly auto-update scheduled (Sundays 2 AM)

### April 4-9, 2026
- Completed Phase 3B daily reflection
- Morning briefing operational (8 AM automatic)
- Learning extraction working (3-7 insights per day)
- Memory files auto-updated (no manual intervention)

---

## Key Recent Changes

### Investment Domain
- Portfolio allocation: QQQ $25K, USO $10K conditional, BIL $65K
- Market signals: Monitoring for Stage 2 entries
- Chris Vermeulen automation: Weekly video checks operational

### Context System
- Progressive disclosure working (read only what's needed)
- Memory system autonomous (learnings, work-status auto-updated)
- **Next:** LLM Wiki pattern integration (hot cache, index, manifest)

### Tools & Skills
- **New:** Knowledge base GUI in Command Center
- **Enhanced:** Daily reflection extracts learnings automatically
- **Ready:** 6 investment skills + 1 research skill + 2 foundation skills

---

## Active Questions

1. **LLM Wiki Integration:** Which implementation approach for JARVIS? (Skill-based vs plugin vs MCP)
2. **Token Efficiency:** Can we achieve 90%+ reduction with hot cache pattern?
3. **Contradiction Tracking:** How to track market signal vs expert opinion conflicts?

---

## Next Steps (Priority Order)

1. Complete LLM Wiki implementation plan
2. Create SCHEMA.md, index.md, log.md
3. Build wiki skills (setup, ingest, query, lint, status)
4. Integrate with daily reflection (auto-ingest learnings)
5. Migrate existing knowledge to wiki format

---

## Cross-References

- **Recent documentation:** `PHASE-3B-COMPLETE.md`, `KNOWLEDGE-BASE-COMPLETE.md`
- **Active memory:** `context/memory/work-status.md`
- **Latest reports:** `reports/market-analysis/` (latest: SPY-2026-04-10.md)
- **Tool catalog:** `context/tools/` (market-data, agent-browser, obsidian-vault)

---

## Investment Snapshot

**Portfolio Status:** $100K allocation ready, no positions entered yet  
**Market Stage:** Monitoring 14 ETFs for Stage 2 entries  
**Latest Signal:** None (waiting for confirmation)  
**Expert View:** Chris Vermeulen latest video (check weekly)

---

## Content Creation Snapshot

**Status:** 10-day blitz content library complete (18,000+ lines)  
**Launch Date:** February 23, 2026 (Monday 7 AM)  
**Platforms:** YouTube, Instagram, TikTok, LinkedIn, Twitter/X, Pinterest, Substack  
**Image Catalog:** 270 images (95%+ coverage, 90%+ cost savings)

---

_This summary auto-updates after every significant operation. For deeper context, see `index.md` → specific pages._
```

---

### 3. index.md Template

```markdown
# JARVIS Wiki Index

> Content catalog organized by category. Navigate from here to specific pages.
> Updated after every ingest operation.

**Last Updated:** April 11, 2026  
**Total Pages:** 87  
**Sources Ingested:** 45

---

## Quick Navigation

- [Concepts](#concepts) (32 pages)
- [Entities](#entities) (24 pages)
- [Sources](#sources) (45 pages)
- [Synthesis](#synthesis) (8 pages)
- [Outputs](#outputs) (12 pages)
- [Meta](#meta) (3 pages)

---

## Concepts

> Ideas, patterns, methodologies

### Investment Concepts
- [[asset-revesting]] — Chris Vermeulen's investment methodology ( #investments #strategy)
- [[stage-analysis]] — 4-stage market cycle framework ( #investments #analysis)
- [[macd-divergence]] — Bearish/bullish MACD divergence patterns ( #investments #signal)
- [[position-sizing]] — Risk-based allocation formula ( #investments #risk)
- [[stop-loss-strategy]] — Systematic exit rules ( #investments #risk)

### Claude Code Concepts
- [[progressive-disclosure]] — Read only what's needed, when needed ( #pattern #efficiency)
- [[llm-wiki-pattern]] — Karpathy's knowledge compilation approach ( #pattern #knowledge)
- [[hot-cache]] — Rolling summary for session recovery ( #pattern #efficiency)
- [[manifest-delta-tracking]] — Hash-based change detection ( #pattern #optimization)

### Content Creation Concepts
- [[10-day-promotional-blitz]] — Intensive multi-platform launch strategy ( #content #marketing)
- [[image-catalog-system]] — Reference-based cost savings ( #content #optimization)
- [[url-management-system]] — Centralized link replacement ( #content #maintenance)

---

## Entities

> People, organizations, tools, systems

### People
- [[terry-byrd]] — User, investor, content creator ( #person #user)
- [[chris-vermeulen]] — Market expert, Asset Revesting creator ( #person #expert #investments)
- [[andrej-karpathy]] — AI researcher, LLM Wiki creator ( #person #expert #ai)

### Tools
- [[claude-code]] — AI-powered CLI for autonomous agents ( #tool #ai)
- [[alpaca-api]] — Brokerage API for market data and trading ( #tool #investments #api)
- [[agent-browser]] — Headless browser automation ( #tool #automation)
- [[lovart-ai]] — Diagram and infographic generator ( #tool #content)
- [[obsidian]] — Knowledge management and second brain ( #tool #knowledge)

### Systems
- [[jarvis]] — AI investment management assistant ( #system #ai #investments)
- [[heartbeat-system]] — Autonomous 24/7 task scheduler ( #system #automation)
- [[daily-reflection]] — Automatic learning extraction and memory updates ( #system #ai)

### ETFs (Investment Domain)
- [[spy-etf]] — S&P 500 index tracker ( #etf #equities)
- [[qqq-etf]] — Nasdaq-100 tech tracker ( #etf #equities)
- [[tlt-etf]] — 20+ year Treasury bonds ( #etf #bonds)
- [[uso-etf]] — Oil commodity tracker ( #etf #commodities)
- [[bil-etf]] — Short-term Treasury bills (cash proxy) ( #etf #cash)

---

## Sources

> Summaries of ingested raw sources

### Skills Documentation
- [[market-analysis-skill]] — Deep dive 4-stage ETF analysis ( #skill #investments)
- [[etf-screener-skill]] — Screen 14 ETFs, rank opportunities ( #skill #investments)
- [[portfolio-builder-skill]] — Construct allocation with position sizing ( #skill #investments)
- [[portfolio-monitor-skill]] — Daily stops + weekly reviews ( #skill #investments)
- [[performance-tracker-skill]] — Monthly strategy validation ( #skill #investments)
- [[market-insights-skill]] — Chris Vermeulen YouTube automation ( #skill #investments)
- [[obsidian-manager-skill]] — Vault organization and search ( #skill #knowledge)

### Tools Documentation
- [[market-data-cli-tool]] — Yahoo Finance integration via jarvis-price ( #tool #investments)
- [[agent-browser-tool]] — Web scraping with 95% success rate ( #tool #automation)
- [[obsidian-vault-tool]] — ORICO drive integration, 7 domains ( #tool #knowledge)

### Phase Documentation
- [[phase-0-complete]] — Terminal foundation and context system ( #milestone #documentation)
- [[phase-1-complete]] — Investment domain + heartbeat system ( #milestone #documentation)
- [[phase-2-complete]] — Agent SDK + vector search + API integrations ( #milestone #documentation)
- [[phase-3a-complete]] — Agent SDK persistent server ( #milestone #documentation)
- [[phase-3b-complete]] — Daily reflection + morning briefing ( #milestone #documentation)

### Market Analysis Reports
- [[market-analysis-spy-2026-04-10]] — SPY 4-stage analysis ( #report #investments)
- [[etf-screening-2026-01-25]] — 14 ETF ranking ( #report #investments)
- [[portfolio-allocation-2026-01-25]] — $100K allocation plan ( #report #investments)

### Expert Content
- [[vermeulen-video-2026-04-08]] — Weekly market outlook ( #expert #investments)

---

## Synthesis

> Cross-cutting analysis combining multiple sources

- [[jarvis-evolution]] — Journey from Phase 0 to Phase 3B ( #synthesis #documentation)
- [[investment-thesis]] — Current market view and portfolio strategy ( #synthesis #investments)
- [[tool-ecosystem]] — CLI tools + MCP servers + skills landscape ( #synthesis #architecture)
- [[phase-learnings]] — Accumulated insights from Phases 0-3 ( #synthesis #learnings)
- [[content-creation-system]] — End-to-end video production workflow ( #synthesis #content)

---

## Outputs

> Filed query answers and explorations

- [[spy-macd-divergence-exploration]] — Deep dive into MACD signal ( #output #investments)
- [[llm-wiki-research-synthesis]] — GitHub implementations analysis ( #output #research)
- [[asset-revesting-vs-momentum]] — Strategy comparison ( #output #investments)

---

## Meta

> Wiki maintenance and system pages

- [[hot]] — Recent context summary (read first!) ( #meta)
- [[log]] — Operations log (audit trail) ( #meta)
- [[manifest]] — Delta tracking database ( #meta)
- [[lint-report-2026-04-11]] — Weekly consistency check ( #meta)

---

## Tags Reference

### By Domain
- `#investments` (52 pages) — Investment domain
- `#content` (18 pages) — Content creation domain
- `#knowledge` (12 pages) — Knowledge management
- `#research` (5 pages) — Research domain

### By Type
- `#skill` (9 pages) — JARVIS skills
- `#tool` (8 pages) — CLI tools and integrations
- `#concept` (32 pages) — Ideas and patterns
- `#entity` (24 pages) — People, orgs, tools
- `#synthesis` (8 pages) — Cross-cutting analysis

### By Status
- `#active` (45 pages) — Currently in use
- `#complete` (20 pages) — Finished, reference only
- `#planning` (8 pages) — Future work
- `#archived` (14 pages) — Historical, rarely accessed

---

## Recent Additions

**Last 7 days:**
- [[llm-wiki-pattern]] (April 11) — Karpathy's pattern researched
- [[hot-cache]] (April 11) — Session recovery pattern
- [[manifest-delta-tracking]] (April 11) — Change detection
- [[knowledge-base-gui]] (April 10) — Command Center integration

**Last 30 days:**
- [[daily-reflection]] (April 4) — Autonomous learning extraction
- [[morning-briefing]] (April 4) — 8 AM intelligence digest
- [[phase-3b-complete]] (April 4) — Milestone documentation

---

_Navigate from this index to specific pages. Use Obsidian graph view to visualize connections._
```

---

### 4. log.md Template

```markdown
# JARVIS Wiki Operations Log

> Chronological append-only record of all wiki operations.
> Never edit existing entries. Always append new operations at the bottom.

**Format:** `## [YYYY-MM-DD HH:MM] operation | Title`

---

## [2026-04-11 09:00] bootstrap | Wiki System Initialization

- **Type:** setup
- **Duration:** 30 minutes
- **Pages created:** 5
- **Description:** Created SCHEMA.md, hot.md, index.md, log.md (this file), .manifest.json
- **Key insight:** Foundation laid for LLM Wiki pattern integration

---

## [2026-04-11 10:30] ingest | Existing Context Catalog

- **Type:** ingest
- **Duration:** 2 hours
- **Sources processed:** 50 files
- **Pages created:** 0 (catalog only)
- **Pages updated:** index.md
- **Description:** Cataloged all existing context files (memory, projects, tools) into index.md
- **Key insight:** 87 existing pages to migrate gradually

---

## [2026-04-11 14:00] ingest | Phase 0-3 Documentation

- **Type:** ingest
- **Duration:** 3 hours
- **Sources processed:** 12 files (PHASE-*-COMPLETE.md, OPTIONS-A-B-C-D-SUMMARY.md, etc.)
- **Pages created:** 18
  - 8 concept pages (progressive-disclosure, asset-revesting, etc.)
  - 6 entity pages (Claude Code, Alpaca API, etc.)
  - 3 synthesis pages (jarvis-evolution, phase-learnings, tool-ecosystem)
  - 1 source page (phase-0-complete, etc.)
- **Pages updated:** index.md, hot.md
- **Key insight:** Journey from Phase 0 to 3B synthesized into concept/entity pages
- **Cross-references added:** 47 wikilinks

---

## [2026-04-11 16:00] query | LLM Wiki Implementation Research

- **Type:** query
- **Duration:** 6 hours
- **Sources read:** 2 YouTube transcripts, 1 GitHub analysis (20+ repos)
- **Pages created:** 5
  - 3 concept pages (llm-wiki-pattern, hot-cache, manifest-delta-tracking)
  - 1 entity page (andrej-karpathy)
  - 1 output page (llm-wiki-research-synthesis)
- **Pages updated:** hot.md, index.md
- **Answer filed to:** `wiki/outputs/llm-wiki-research-synthesis.md`
- **Key insight:** Hot cache pattern = 92% token reduction for session recovery

---

## [2026-04-12 08:00] auto-reflection | Daily Reflection Ingest

- **Type:** ingest (automatic)
- **Duration:** 5 minutes
- **Sources processed:** agent-sdk/logs/agent-sdk.log (2026-04-11)
- **Learnings extracted:** 4
  - LLM Wiki pattern proven at scale (20+ implementations)
  - Hot cache enables sub-1k token session starts
  - Manifest delta tracking prevents duplicate processing
  - Contradiction tracking critical for investment signals
- **Pages created:** 0
- **Pages updated:** 4 concept pages, hot.md
- **Key insight:** Daily reflection now auto-maintains wiki (no manual updates!)

---

## [2026-04-14 20:00] lint | Weekly Consistency Check

- **Type:** lint
- **Duration:** 15 minutes
- **Issues found:** 3
  - 2 orphan pages (no inbound links)
  - 1 broken wikilink (typo in page name)
- **Pages updated:** 2 (added cross-references)
- **Report:** `wiki/meta/lint-report-2026-04-14.md`
- **Key insight:** Wiki health good, cross-referencing strong

---

## [2026-04-17 10:00] ingest | Market Analysis Report (SPY)

- **Type:** ingest (automatic via skill hook)
- **Duration:** 2 minutes
- **Sources processed:** reports/market-analysis/SPY-2026-04-17.md
- **Pages created:** 1 source page
- **Pages updated:** 3
  - wiki/entities/spy-etf.md (add latest analysis)
  - wiki/concepts/macd-divergence.md (new example)
  - hot.md (update: bearish divergence detected)
- **Cross-references added:** 5 wikilinks
- **Key insight:** Automatic ingest after skill execution working perfectly

---

_Continue appending operations below..._
```

---

### 5. .manifest.json Template

```json
{
  "version": "1.0",
  "last_updated": "2026-04-11T16:00:00Z",
  "total_sources": 50,
  "total_pages": 87,
  "sources": [
    {
      "id": "context-claude-md",
      "path": "context/CLAUDE.md",
      "hash": "sha256:abc123def456...",
      "type": "documentation",
      "ingested_at": "2026-04-11T10:30:00Z",
      "wiki_pages": [
        "wiki/sources/context-orchestrator.md",
        "wiki/concepts/progressive-disclosure.md"
      ],
      "status": "ingested"
    },
    {
      "id": "market-analysis-spy-2026-04-10",
      "path": "reports/market-analysis/SPY-2026-04-10.md",
      "hash": "sha256:789ghi012jkl...",
      "type": "report",
      "ingested_at": "2026-04-11T14:30:00Z",
      "wiki_pages": [
        "wiki/sources/market-analysis-spy-2026-04-10.md",
        "wiki/entities/spy-etf.md",
        "wiki/concepts/macd-divergence.md"
      ],
      "status": "ingested"
    },
    {
      "id": "phase-1-complete",
      "path": "PHASE-1-COMPLETE.md",
      "hash": "sha256:345mno678pqr...",
      "type": "documentation",
      "ingested_at": "2026-04-11T14:00:00Z",
      "wiki_pages": [
        "wiki/sources/phase-1-complete.md",
        "wiki/concepts/asset-revesting.md",
        "wiki/concepts/heartbeat-system.md",
        "wiki/synthesis/jarvis-evolution.md"
      ],
      "status": "ingested"
    }
  ],
  "delta": {
    "since": "2026-04-10T00:00:00Z",
    "new_sources": 3,
    "updated_sources": 1,
    "unchanged_sources": 46
  },
  "stats": {
    "sources_by_type": {
      "documentation": 25,
      "report": 12,
      "skill": 9,
      "tool": 8,
      "log": 4
    },
    "pages_by_type": {
      "source": 50,
      "concept": 32,
      "entity": 24,
      "synthesis": 8,
      "output": 12,
      "meta": 3
    }
  }
}
```

---

## Migration Strategy

### Principle: Progressive Enhancement, Not Replacement

**Goal:** Add LLM Wiki capabilities to existing context system without breaking current workflows.

**Non-Goals:**
- Complete rewrite of context system
- Immediate migration of all files
- Breaking changes to skill execution
- Disruption to daily operations

### Migration Waves

#### Wave 1: Foundation (Days 1-2)

**Add new files:**
```bash
cd ../jarvis-private/context/

# Create core wiki files
touch SCHEMA.md hot.md index.md log.md .manifest.json

# Create wiki directory structure
mkdir -p wiki/{sources,entities,concepts,synthesis,outputs,meta}
mkdir -p wiki/projects/{investments,content-creation}
```

**Catalog existing:**
```bash
# Generate initial index.md by cataloging existing files
# Use glob + grep to extract key files
# Add one-line summaries manually
# Result: index.md with 87 entries
```

**Bootstrap hot.md:**
```bash
# Read work-status.md → extract current state
# Read recent git commits → extract recent work
# Synthesize into 500-word summary
# Result: hot.md ready for session recovery
```

**No changes to existing files yet.** Everything still works as before.

#### Wave 2: Skill Integration (Days 3-5)

**Create wiki skills:**
```bash
cd ../../jarvis/skills/

# Create new skills
mkdir -p wiki-{setup,ingest,query,lint,status}

# Each skill has:
# - SKILL.md (documentation)
# - design-requirements.md (quality standards)
# - templates/ (page templates)
```

**Add post-tool hook:**
```json
// .claude/settings.json
{
  "postToolHooks": [
    {
      "pattern": "market-analysis|etf-screener|portfolio-builder",
      "command": "cd skills/wiki-ingest && bash ingest-report.sh {{output_path}}"
    }
  ]
}
```

**Result:** After market-analysis skill, wiki auto-updates (hot.md, index.md, log.md).

**No manual changes required.** Automation handles updates.

#### Wave 3: Daily Reflection Integration (Days 6-7)

**Modify Phase 3B task:**
```typescript
// agent-sdk/src/tasks/daily-reflection.ts

async function dailyReflection() {
  // Existing logic: Read logs, extract learnings
  const learnings = await extractLearnings(yesterdayLogs);
  
  // NEW: Instead of updating learnings.md manually
  // Run wiki-ingest on learnings
  for (const learning of learnings) {
    await runWikiIngest(learning);
  }
  
  // Result: Concept pages created/updated automatically
  // hot.md updated with insights
  // log.md appended with operation
}
```

**Result:** Memory system becomes self-maintaining. No manual updates to learnings.md.

#### Wave 4: Content Migration (Weeks 2-3)

**Ingest Phase 0-3 documentation:**
```bash
# Priority 1: Journey documents (high value)
/wiki-ingest OPTIONS-A-B-C-D-SUMMARY.md
/wiki-ingest PHASE-1-COMPLETE.md
/wiki-ingest PHASE-2-COMPLETE.md
/wiki-ingest PHASE-3A-COMPLETE.md
/wiki-ingest PHASE-3B-COMPLETE.md

# Priority 2: Skill documentation
for skill in market-analysis etf-screener portfolio-builder; do
  /wiki-ingest skills/$skill/SKILL.md
done

# Priority 3: Tool documentation
for tool in market-data-cli agent-browser obsidian-vault; do
  /wiki-ingest context/tools/$tool.md
done

# Priority 4: Reports
for report in reports/market-analysis/*.md; do
  /wiki-ingest $report
done
```

**Result:** 50+ sources ingested, 100+ pages created/updated, wiki becomes comprehensive.

#### Wave 5: Gradual Retirement (Weeks 4+)

**Deprecate old files (slowly):**
```bash
# Option A: Redirect to wiki
echo "See [[wiki/concepts/progressive-disclosure]]" > context/memory/learnings.md

# Option B: Archive to /archive
mv context/memory/learnings.md context/archive/learnings-2026-04-11.md

# Option C: Keep both (preferred during transition)
# Old file stays for reference
# New wiki pages are source of truth
```

**No rush.** Keep old files as long as they're useful. Progressive enhancement, not replacement.

### Rollback Plan

**If wiki doesn't work out:**

1. Delete `wiki/` directory
2. Delete `SCHEMA.md`, `hot.md`, `index.md`, `log.md`, `.manifest.json`
3. Remove wiki skills
4. Remove post-tool hook
5. Revert daily reflection changes
6. Old context system intact, no data lost

**Low risk.** All changes additive, no destructive edits to existing files.

### Success Indicators

**Week 1:**
- [ ] Session recovery uses hot.md (<1k tokens vs 15k)
- [ ] Index.md navigates to all context files
- [ ] At least 1 skill auto-updates wiki

**Week 2:**
- [ ] Daily reflection auto-ingests learnings
- [ ] 20+ sources ingested (Phase docs, skill docs)
- [ ] 40+ wiki pages created (concepts, entities)

**Week 3:**
- [ ] 50+ sources ingested (including reports)
- [ ] 80+ wiki pages created
- [ ] Weekly lint operational (check consistency)

**Week 4:**
- [ ] Token usage reduced 70%+ for session start
- [ ] Knowledge compounding visible (new sources enrich existing pages)
- [ ] Context system 90% self-maintaining

---

## Skill Specifications

### Skill 1: /wiki-setup

**Purpose:** Initialize wiki system for new domains.

**Location:** `skills/wiki-setup/`

**Files:**
- `SKILL.md` — Documentation
- `design-requirements.md` — Quality standards
- `setup.sh` — Automation script
- `templates/` — Page templates

**Usage:**
```bash
/wiki-setup investments
/wiki-setup research
/wiki-setup health
```

**Process:**
1. Create `wiki/projects/{domain}/` subdirectories
2. Copy page templates to domain
3. Create domain-specific index.md
4. Update main index.md with domain section
5. Log operation to log.md

**Output:**
```
wiki/projects/{domain}/
├── entities/
├── concepts/
├── synthesis/
└── index.md
```

**Execution time:** 1-2 minutes

---

### Skill 2: /wiki-ingest

**Purpose:** Process raw sources into wiki pages.

**Location:** `skills/wiki-ingest/`

**Files:**
- `SKILL.md` — Documentation
- `design-requirements.md` — Quality standards
- `ingest.sh` — Automation script (calls Claude)
- `prompts/` — Ingest prompts

**Usage:**
```bash
/wiki-ingest path/to/source.md
/wiki-ingest path/to/source.md --domain=investments
/wiki-ingest reports/market-analysis/*.md --batch
```

**Process:**
1. Check manifest: Already ingested? Skip or update?
2. Read source file (raw layer)
3. Extract key concepts (3-7 concepts)
4. Extract entities (people, tools, systems)
5. Create/update source page (`wiki/sources/[name].md`)
6. Create/update concept pages (`wiki/concepts/[concept].md`)
7. Create/update entity pages (`wiki/entities/[entity].md`)
8. Add cross-references (wikilinks)
9. Update index.md (add new entries)
10. Update log.md (append operation)
11. Update hot.md (refresh summary)
12. Update manifest (track hash)

**Ingest prompt:**
```
You are maintaining a persistent knowledge wiki for JARVIS.

Read this source: [path]

Extract:
1. 3-7 key concepts (ideas, patterns, methodologies)
2. 3-5 entities (people, tools, organizations, systems)
3. Key insights (bullet points)

Create/update pages:
- wiki/sources/[source-name].md (summary of source)
- wiki/concepts/[concept].md (one per concept)
- wiki/entities/[entity].md (one per entity)

Cross-reference liberally with wikilinks: [[page-name]]

Update:
- index.md (add new entries under relevant categories)
- log.md (append operation record)
- hot.md (refresh recent context summary)

Follow templates in SCHEMA.md.
```

**Output:**
- 1 source page created
- 3-7 concept pages created/updated
- 3-5 entity pages created/updated
- index.md updated
- log.md appended
- hot.md refreshed
- manifest updated

**Execution time:** 2-5 minutes per source (depending on size)

---

### Skill 3: /wiki-query

**Purpose:** Search wiki and file valuable answers.

**Location:** `skills/wiki-query/`

**Files:**
- `SKILL.md` — Documentation
- `design-requirements.md` — Quality standards
- `query.sh` — Automation script
- `prompts/` — Query prompts

**Usage:**
```bash
/wiki-query "What is Asset Revesting?"
/wiki-query "How does MACD divergence work?"
/wiki-query "What tools does JARVIS use for market data?"
```

**Process:**
1. Read hot.md (recent context)
2. Read index.md (content catalog)
3. Grep/search wiki for keywords
4. Read 3-5 relevant pages
5. Synthesize answer with citations
6. If valuable: File answer to `wiki/outputs/[query-slug].md`
7. Update hot.md (add query context)
8. Update log.md (append query record)

**Query prompt:**
```
You are answering a question using JARVIS's knowledge wiki.

Question: [user question]

Progressive disclosure:
1. Read hot.md (recent context)
2. Read index.md (find relevant pages)
3. Search/grep wiki for keywords
4. Read 3-5 relevant pages (concepts, entities, sources)

Synthesize answer:
- Use wikilink citations: [[page-name]]
- Quote key insights from sources
- 2-4 paragraphs (concise but complete)

If this answer required significant research (5+ pages read):
- File answer to wiki/outputs/[query-slug].md
- Use output page template from SCHEMA.md

Update:
- hot.md (add this query to recent context)
- log.md (append query record)
```

**Output:**
- Answer synthesized from wiki
- (Optional) Output page created (`wiki/outputs/[query].md`)
- hot.md updated
- log.md appended

**Token usage:**
- Quick query: 500-1k tokens (hot.md only)
- Medium query: 2-3k tokens (hot + index + 2-3 pages)
- Deep query: 4-5k tokens (hot + index + 5-10 pages)

**Execution time:** 30 seconds - 2 minutes

---

### Skill 4: /wiki-lint

**Purpose:** Check wiki consistency and health.

**Location:** `skills/wiki-lint/`

**Files:**
- `SKILL.md` — Documentation
- `design-requirements.md` — Quality standards
- `lint.sh` — Automation script
- `checks/` — Lint check scripts

**Usage:**
```bash
/wiki-lint
/wiki-lint --fix
/wiki-lint --domain=investments
```

**Checks:**

1. **Contradictions** - Pages making conflicting claims
2. **Orphans** - Pages with no inbound wikilinks
3. **Broken links** - Wikilinks to non-existent pages
4. **Missing cross-refs** - Related pages not linked
5. **Stale claims** - Source updated but wiki page didn't
6. **Index inconsistencies** - File exists but not in index.md
7. **Frontmatter issues** - Missing tags, dates, etc.

**Process:**
1. Scan wiki directory (all pages)
2. Run lint checks (7 checks above)
3. Generate report: `wiki/meta/lint-report-YYYY-MM-DD.md`
4. If `--fix` flag: Automatically fix issues (add cross-refs, update index, etc.)
5. Update log.md (append lint record)

**Lint report format:**
```markdown
# Wiki Lint Report

**Date:** 2026-04-14  
**Total Pages:** 87  
**Issues Found:** 3

---

## Contradictions (0)

No contradictions detected.

---

## Orphan Pages (2)

Pages with no inbound links:

1. [[wiki/concepts/flash-attention]] — Created 2026-04-10, never referenced
2. [[wiki/outputs/spy-exploration]] — Query answer, not cross-referenced

**Fix:** Add wikilinks from related pages.

---

## Broken Links (1)

Wikilinks to non-existent pages:

1. [[wiki/entities/spy-etf.md]] links to [[stage-analyis]] (typo: should be [[stage-analysis]])

**Fix:** Correct typo in spy-etf.md.

---

## Missing Cross-References (0)

No missing cross-refs detected.

---

## Stale Claims (0)

No stale claims detected.

---

## Index Inconsistencies (0)

All wiki pages listed in index.md.

---

## Frontmatter Issues (0)

All pages have valid frontmatter.
```

**Output:**
- Lint report created (`wiki/meta/lint-report-YYYY-MM-DD.md`)
- (If --fix) Issues automatically corrected
- log.md appended

**Execution time:** 1-2 minutes (for 100 pages)

**Recommended schedule:** Weekly (Sunday night)

---

### Skill 5: /wiki-status

**Purpose:** Show recent activity and stats.

**Location:** `skills/wiki-status/`

**Files:**
- `SKILL.md` — Documentation
- `status.sh` — Automation script

**Usage:**
```bash
/wiki-status
/wiki-status --last-7-days
/wiki-status --domain=investments
```

**Process:**
1. Read log.md (last N entries)
2. Read manifest.json (stats)
3. Count pages by type
4. Show recent operations
5. Display summary stats

**Output:**
```
JARVIS Wiki Status

Last Updated: April 11, 2026 4:30 PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Sources:     50
Total Pages:       87
  ├─ Concepts:     32
  ├─ Entities:     24
  ├─ Sources:      50
  ├─ Synthesis:     8
  ├─ Outputs:      12
  └─ Meta:          3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECENT ACTIVITY (Last 7 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Apr 11 16:00] query | LLM Wiki Implementation Research
  ├─ 5 pages created (llm-wiki-pattern, hot-cache, etc.)
  ├─ Answer filed to: wiki/outputs/llm-wiki-research-synthesis.md

[Apr 11 14:00] ingest | Phase 0-3 Documentation
  ├─ 18 pages created (concepts, entities, synthesis)
  ├─ 47 cross-references added

[Apr 11 10:30] ingest | Existing Context Catalog
  ├─ 87 existing pages cataloged in index.md

[Apr 11 09:00] bootstrap | Wiki System Initialization
  ├─ SCHEMA.md, hot.md, index.md, log.md created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOMAINS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Investments:       52 pages
Content Creation:  18 pages
Knowledge:         12 pages
Research:           5 pages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEALTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ All pages in index.md
✓ No broken wikilinks
✓ No orphan pages
✓ hot.md updated today

Next lint: Sunday, April 14, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Execution time:** <5 seconds

---

## Integration Points

### 1. Session Start (CLAUDE.md)

**Current:**
```markdown
## Progressive Disclosure Protocol

### Always Read (Every Session)
1. This file (`context/CLAUDE.md`)
2. `context/memory/work-status.md` - Check what's in progress
```

**Enhanced:**
```markdown
## Progressive Disclosure Protocol

### Always Read (Every Session)
1. `context/hot.md` - Recent context summary (500 words, <1k tokens)
2. If need more: `context/index.md` - Content catalog (1k tokens)
3. If specific: Read relevant wiki pages (2-3k tokens)

### Fallback (If wiki not yet populated)
1. This file (`context/CLAUDE.md`)
2. `context/memory/work-status.md`
```

**Result:** 92% token reduction for session start (500 tokens vs 15k).

---

### 2. Skill Execution (Post-Tool Hook)

**Implementation:**

Add to `.claude/settings.json`:
```json
{
  "postToolHooks": [
    {
      "name": "wiki-ingest-reports",
      "pattern": "market-analysis|etf-screener|portfolio-builder|portfolio-monitor|performance-tracker",
      "command": "cd ${JARVIS_HOME}/skills/wiki-ingest && bash auto-ingest-report.sh {{output_path}}",
      "description": "Automatically ingest skill outputs into wiki"
    }
  ]
}
```

**Flow:**
1. User runs `/market-analysis SPY`
2. Skill generates report: `reports/market-analysis/SPY-2026-04-17.md`
3. Post-tool hook triggers: `/wiki-ingest reports/market-analysis/SPY-2026-04-17.md`
4. Wiki auto-updates: source page, entity page (SPY), concept pages (MACD, Stage 2)
5. hot.md, index.md, log.md all updated automatically
6. Zero manual intervention required

**Result:** Knowledge compounds automatically with every skill execution.

---

### 3. Daily Reflection (Phase 3B)

**Current implementation:**
```typescript
// agent-sdk/src/tasks/daily-reflection.ts

async function dailyReflection() {
  const yesterdayLogs = await readLogs(yesterday);
  const learnings = await extractLearnings(yesterdayLogs);
  
  // Manual update required:
  // Human reads learnings, decides what to add to learnings.md
  
  return learnings;
}
```

**Enhanced implementation:**
```typescript
// agent-sdk/src/tasks/daily-reflection.ts

async function dailyReflection() {
  const yesterdayLogs = await readLogs(yesterday);
  const learnings = await extractLearnings(yesterdayLogs);
  
  // NEW: Auto-ingest learnings into wiki
  for (const learning of learnings) {
    await wikiIngest({
      content: learning,
      type: 'learning',
      domain: learning.domain || 'general'
    });
  }
  
  // Result: Concept pages created/updated
  // hot.md refreshed with insights
  // log.md appended with operation
  // Zero manual intervention!
  
  return learnings;
}
```

**Flow:**
1. 8 AM: Daily reflection triggers
2. Reads yesterday's logs (`agent-sdk/logs/agent-sdk.log`)
3. Extracts 3-7 learnings (existing Phase 3B logic)
4. For each learning: Run wiki-ingest
5. Creates/updates concept pages (e.g., `wiki/concepts/macd-divergence.md`)
6. Cross-references with entities (e.g., `[[SPY ETF]]`)
7. Updates hot.md with insights
8. Morning briefing includes hot.md summary

**Result:** Memory system becomes 100% self-maintaining.

---

### 4. Command Center GUI

**New "Wiki" Tab:**

Add to `command-center-ui/src/App.tsx`:

```tsx
<Tab label="Wiki">
  <WikiView />
</Tab>
```

**WikiView component:**
```tsx
function WikiView() {
  const [hotCache, setHotCache] = useState('');
  const [recentOps, setRecentOps] = useState([]);
  const [stats, setStats] = useState({});
  
  useEffect(() => {
    // Fetch hot.md
    fetch('/api/wiki/hot').then(r => r.text()).then(setHotCache);
    
    // Fetch recent operations from log.md
    fetch('/api/wiki/log?limit=10').then(r => r.json()).then(setRecentOps);
    
    // Fetch stats from manifest
    fetch('/api/wiki/stats').then(r => r.json()).then(setStats);
  }, []);
  
  return (
    <Box>
      <Typography variant="h4">JARVIS Wiki</Typography>
      
      {/* Hot Cache Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Recent Context</Typography>
        <Markdown>{hotCache}</Markdown>
      </Paper>
      
      {/* Stats Section */}
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <StatCard label="Total Sources" value={stats.totalSources} />
        </Grid>
        <Grid item xs={3}>
          <StatCard label="Total Pages" value={stats.totalPages} />
        </Grid>
        <Grid item xs={3}>
          <StatCard label="Concepts" value={stats.concepts} />
        </Grid>
        <Grid item xs={3}>
          <StatCard label="Entities" value={stats.entities} />
        </Grid>
      </Grid>
      
      {/* Recent Operations Section */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Recent Operations</Typography>
        <List>
          {recentOps.map(op => (
            <ListItem key={op.timestamp}>
              <ListItemText
                primary={op.title}
                secondary={`${op.type} • ${op.timestamp} • ${op.pagesCreated} pages created`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      {/* Search Section */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Search Wiki</Typography>
        <TextField
          fullWidth
          placeholder="Search concepts, entities, sources..."
          onKeyPress={e => {
            if (e.key === 'Enter') {
              // TODO: Implement wiki search
            }
          }}
        />
      </Paper>
    </Box>
  );
}
```

**Backend API endpoints:**

```typescript
// agent-sdk/src/api/wiki.ts

router.get('/api/wiki/hot', (req, res) => {
  const hotMd = fs.readFileSync('../jarvis-private/context/hot.md', 'utf-8');
  res.send(hotMd);
});

router.get('/api/wiki/log', (req, res) => {
  const limit = parseInt(req.query.limit || '10');
  const logMd = fs.readFileSync('../jarvis-private/context/log.md', 'utf-8');
  const operations = parseLogMd(logMd).slice(0, limit);
  res.json(operations);
});

router.get('/api/wiki/stats', (req, res) => {
  const manifest = JSON.parse(fs.readFileSync('../jarvis-private/context/.manifest.json', 'utf-8'));
  res.json(manifest.stats);
});

router.get('/api/wiki/search', (req, res) => {
  const query = req.query.q;
  // TODO: Implement search (grep wiki/ for query)
  // Return matching pages with snippets
});
```

**Result:** Visual dashboard for wiki health and activity.

---

### 5. Obsidian Integration

**Open wiki in Obsidian:**

```bash
# Link wiki to Obsidian vault
ln -s ${JARVIS_PRIVATE}/context/wiki /Volumes/ORICO/ObsidianVault/JARVIS-Wiki

# Or copy to vault
cp -R ../jarvis-private/context/wiki /Volumes/ORICO/ObsidianVault/JARVIS-Wiki
```

**Benefits:**
- **Graph view** - Visualize wikilink connections
- **Backlinks** - See all pages linking to current page
- **Search** - Fast full-text search across wiki
- **Dataview** - Query frontmatter tags as database
- **Daily notes** - Link wiki pages from daily notes

**Obsidian plugins to enable:**
- Dataview (query as database)
- Graph Analysis (visualize connections)
- Obsidian Git (auto-commit wiki changes)
- Templater (auto-populate frontmatter)
- Smart Connections (semantic search)

**Result:** Human-friendly wiki browsing and visualization.

---

## Success Metrics

### Token Efficiency Metrics

**Baseline (Current System):**
- Session start: 15k tokens (read CLAUDE.md, work-status.md, projects/investments/CLAUDE.md, tools/*.md)
- Medium query: 20k tokens (session start + skill execution + context lookup)
- Deep research: 30k tokens (multiple context files, multiple tools)

**Target (LLM Wiki System):**
- Session start: <1k tokens (read hot.md only)
- Medium query: <3k tokens (hot.md + index.md + 2-3 pages)
- Deep research: <5k tokens (hot.md + index.md + 5-10 pages)

**Success criteria:**
- 70-90% token reduction across all operations
- Measured via API usage logs
- Tracked monthly

---

### Knowledge Compounding Metrics

**Indicators:**
1. **Cross-references per page** - Average wikilinks per page (target: 5+)
2. **Pages per source** - How many pages updated per source ingested (target: 5-10)
3. **Query reuse** - % of queries answered from existing pages vs new research (target: 60%+)
4. **Synthesis growth** - Number of synthesis pages created (target: 1-2 per month)

**Measurement:**
- Extract from manifest.json
- Count wikilinks in pages
- Track query outcomes (existing vs new)

---

### Self-Maintenance Metrics

**Indicators:**
1. **Auto-update rate** - % of wiki updates that are automatic vs manual (target: 90%)
2. **Daily reflection integration** - Learnings auto-ingested daily (target: 100%)
3. **Skill hook integration** - Skills auto-update wiki (target: 100%)
4. **Lint pass frequency** - Weekly consistency checks (target: 1x per week)

**Measurement:**
- Count operations in log.md by type (auto vs manual)
- Track daily reflection executions
- Monitor skill post-hooks

---

### Audit Trail Metrics

**Indicators:**
1. **Log completeness** - Every operation logged in log.md (target: 100%)
2. **Manifest coverage** - Every source tracked in manifest.json (target: 100%)
3. **Git commits** - Wiki changes committed to version control (target: daily)

**Measurement:**
- Parse log.md for gaps
- Compare manifest.json to actual files
- Check git log for wiki/ directory

---

### User Experience Metrics

**Indicators:**
1. **Session recovery time** - Time to restore context (target: <10 seconds)
2. **Query response time** - Time to answer question (target: 30s - 2min)
3. **Navigation efficiency** - Clicks to find info (target: 1-3 clicks: hot → index → page)

**Measurement:**
- Time operations via logs
- Track user feedback

---

## Risk Assessment

### Risk 1: LLM Errors in Wiki Maintenance

**Risk:** Claude makes mistakes when updating wiki (broken links, incorrect cross-refs, duplicate pages).

**Likelihood:** Medium (LLMs hallucinate, make typos)

**Impact:** Medium (wiki becomes unreliable, requires manual fixes)

**Mitigation:**
1. **Weekly lint passes** - Detect and fix errors automatically
2. **Git version control** - Revert bad updates easily
3. **Manifest tracking** - Audit trail of what changed when
4. **Frontmatter validation** - Automated checks for required fields
5. **Obsidian graph view** - Visual detection of orphan pages, broken links

**Residual risk:** Low (errors detectable and fixable)

---

### Risk 2: Token Budget Exceeded

**Risk:** Wiki grows too large, token costs increase unexpectedly.

**Likelihood:** Low (progressive disclosure limits token usage)

**Impact:** Medium (higher API costs)

**Mitigation:**
1. **Hot cache pattern** - Read 500 words first, not full wiki
2. **Progressive disclosure** - Only read pages when needed
3. **Archival strategy** - Move old/stale pages to archive/
4. **Page size limits** - Enforce max 2k words per page
5. **Monitoring** - Track token usage monthly, alert on anomalies

**Residual risk:** Very low (pattern proven to reduce tokens 90%+)

---

### Risk 3: Migration Complexity

**Risk:** Migrating existing knowledge to wiki format is too time-consuming.

**Likelihood:** Medium (50+ files to migrate)

**Impact:** Low (can migrate gradually, no breaking changes)

**Mitigation:**
1. **Progressive enhancement** - Add wiki alongside existing files
2. **Gradual migration** - Ingest 5-10 files per week over 4 weeks
3. **Automation** - `/wiki-ingest` batch mode processes multiple files
4. **No deadline** - Migration ongoing, not time-critical
5. **Keep both** - Old files stay for reference during transition

**Residual risk:** Very low (no rush, no breaking changes)

---

### Risk 4: Context Drift

**Risk:** Wiki content becomes stale, contradictions accumulate, wiki diverges from reality.

**Likelihood:** Medium (without maintenance rhythm)

**Impact:** High (wiki becomes unreliable, defeats the purpose)

**Mitigation:**
1. **Weekly lint passes** - Detect contradictions, stale claims
2. **Daily auto-updates** - Daily reflection keeps wiki fresh
3. **Manifest delta tracking** - Detect when sources change but wiki doesn't update
4. **Contradiction callouts** - Explicit tracking of conflicts
5. **Monthly refactor** - Consolidate, prune, update synthesis

**Residual risk:** Low (maintenance rhythm established)

---

### Risk 5: Over-Engineering

**Risk:** Wiki system adds complexity without proportional value.

**Likelihood:** Low (pattern proven across 20+ implementations)

**Impact:** Medium (wasted effort, abandoned system)

**Mitigation:**
1. **Phase 1 validation** - Test hot cache + index in 1-2 days before deeper migration
2. **Success metrics** - Measure token savings, knowledge compounding
3. **Rollback plan** - Can delete wiki/ and revert to old system
4. **User feedback** - Terry's experience guides iteration
5. **Incremental adoption** - Don't force wiki usage, let it prove value

**Residual risk:** Very low (low-risk trial, easy rollback)

---

### Overall Risk: LOW

**Why this is low-risk:**
1. **Proven pattern** - 20+ implementations, 5,000+ stars, demonstrated success
2. **Additive changes** - No destructive edits to existing files
3. **Progressive adoption** - Can start small, scale gradually
4. **Easy rollback** - Delete wiki/, revert changes, no data lost
5. **High upside** - 90%+ token reduction, knowledge compounding, self-maintenance

**Recommendation:** Proceed with implementation.

---

## Appendix

### A. Reference Implementations

**Top 5 GitHub Repos (from research):**

1. **sdyckjq-lab/llm-wiki-skill** (498 stars)
   - Multi-platform skill for Claude/Codex/OpenClaw
   - Bash scripts + markdown
   - Source registry + adapter-state fallback
   - Chinese/English dual language

2. **AgriciDaniel/claude-obsidian** (433 stars)
   - Obsidian-native plugin with skills
   - MCP + Obsidian REST API
   - **Hot cache pattern** (our key inspiration)
   - Contradiction callouts
   - Session filing

3. **atomicmemory/llm-wiki-compiler** (337 stars)
   - Two-phase compiler (extract → generate)
   - TypeScript/Node CLI
   - Incremental hash-based compilation
   - Order-independent processing

4. **Ar9av/obsidian-wiki** (282 stars)
   - Framework with 13 skills
   - Skill-based (no dependencies)
   - **Manifest.json delta tracking** (our key inspiration)
   - **Project-scoped pages** (our key inspiration)

5. **lucasastorian/llmwiki** (233 stars)
   - Full-stack web app
   - Next.js + FastAPI + Supabase
   - Web UI + MCP server
   - OCR support

**Honorable mentions:**
- **swarmvault** (122 stars) - Knowledge graph + local search + Ollama
- **obsidian-llm-wiki-local** (54 stars) - 100% local with Ollama, 139 tests

---

### B. Karpathy's Original Gist

**URL:** https://gist.github.com/karpathy/1dd0294ef9567971c1e4348a90d69285

**Key quotes:**

> "The wiki is the product, chat is just the interface."

> "Knowledge compounds like interest. Each source makes the whole wiki more valuable."

> "The LLM maintains, the human curates. Human adds sources, LLM does all writing/filing/cross-referencing."

> "Progressive disclosure: Read summaries first, drill into details only when needed."

**Three-layer architecture:**
1. **raw/** - Immutable sources (never edit)
2. **wiki/** - LLM-maintained knowledge (update freely)
3. **SCHEMA.md** - Instructions (co-evolve with usage)

**Core operations:**
- **ingest** - Process source → create/update pages
- **query** - Answer question → file valuable answers back
- **lint** - Check consistency → fix contradictions/orphans

---

### C. Token Savings Calculation

**Current JARVIS session start:**
```
CLAUDE.md:                    2,000 tokens
work-status.md:               1,000 tokens
projects/investments/CLAUDE.md: 5,000 tokens
tools/market-data-cli.md:     2,000 tokens
tools/agent-browser.md:       2,000 tokens
tools/obsidian-vault.md:      1,500 tokens
memory/learnings.md:          3,000 tokens
────────────────────────────────────────
TOTAL:                       16,500 tokens
```

**LLM Wiki session start:**
```
hot.md:                         500 tokens
(Optional) index.md:          1,000 tokens
(Optional) 2-3 specific pages: 2,000 tokens
────────────────────────────────────────
TOTAL (quick):                  500 tokens (97% reduction)
TOTAL (medium):               1,500 tokens (91% reduction)
TOTAL (deep):                 3,500 tokens (79% reduction)
```

**Average savings: 92%**

**Monthly token cost impact:**
- Current: ~30 sessions/month × 16.5k tokens = 495k tokens/month
- LLM Wiki: ~30 sessions/month × 1.5k tokens = 45k tokens/month
- Savings: 450k tokens/month (91% reduction)
- Cost savings (at $3/MTok for Claude Sonnet 4.5): **$1.35/month**

**Note:** Savings modest in absolute dollars because JARVIS uses local tools (not API-heavy). Real value is **speed** (faster context loading) and **quality** (better cross-referencing, contradiction tracking).

---

### D. Implementation Checklist

**Phase 1 (Days 1-2):**
- [ ] Create `SCHEMA.md` (1,500-2,000 words)
- [ ] Create `hot.md` (500 words)
- [ ] Create `index.md` (100-150 entries)
- [ ] Create `log.md` (30 bootstrap entries)
- [ ] Create `.manifest.json` (50+ files)
- [ ] Create `wiki/` directory structure
- [ ] Create `/wiki-setup` skill
- [ ] Create `/wiki-ingest` skill
- [ ] Create `/wiki-query` skill
- [ ] Create `/wiki-lint` skill
- [ ] Create `/wiki-status` skill
- [ ] Test: Session recovery using hot.md (<1k tokens)
- [ ] Test: Navigate index.md to find context files
- [ ] Test: Run `/wiki-status` and verify stats

**Phase 2 (Days 3-7):**
- [ ] Add post-tool hook for skill auto-ingest
- [ ] Integrate daily reflection with wiki-ingest
- [ ] Create investment domain templates (4 templates)
- [ ] Implement contradiction tracking (Obsidian callouts)
- [ ] Implement manifest delta tracking (hash-based)
- [ ] Create compilation workflow for tools/skills
- [ ] Add project-scoped pages (investments, content-creation)
- [ ] Test: Market analysis skill auto-updates wiki
- [ ] Test: Daily reflection auto-ingests learnings
- [ ] Test: Contradiction detection (market signal vs expert)
- [ ] Test: Delta query ("what's new since yesterday")
- [ ] Test: Tool/skill catalog auto-generated

**Phase 3 (Weeks 2-4):**
- [ ] Ingest Phase 0-3 documentation (12 files)
- [ ] Ingest skill documentation (9 files)
- [ ] Ingest tool documentation (8 files)
- [ ] Ingest market analysis reports (15+ files)
- [ ] Migrate learnings.md to wiki/concepts/
- [ ] Establish weekly lint rhythm (Sundays)
- [ ] Establish monthly refactor rhythm (first Sunday)
- [ ] Add Wiki tab to Command Center GUI
- [ ] Link wiki to Obsidian vault
- [ ] Test: 70%+ token reduction confirmed
- [ ] Test: Knowledge compounding visible (new sources enrich existing pages)
- [ ] Test: 90%+ self-maintenance (minimal manual updates)

---

### E. Quick Start Commands

**Bootstrap wiki system:**
```bash
cd ${JARVIS_PRIVATE}/context/

# Create core files
touch SCHEMA.md hot.md index.md log.md .manifest.json

# Create directory structure
mkdir -p wiki/{sources,entities,concepts,synthesis,outputs,meta}
mkdir -p wiki/projects/{investments,content-creation}

# Copy templates from this plan
# (SCHEMA.md, hot.md, index.md templates above)
```

**Ingest first source:**
```bash
cd ${JARVIS_HOME}/

# Create wiki-ingest skill first, then:
/wiki-ingest PHASE-1-COMPLETE.md
```

**Check status:**
```bash
/wiki-status
```

**Run lint:**
```bash
/wiki-lint
```

**Query wiki:**
```bash
/wiki-query "What is Asset Revesting?"
```

---

## Summary

### What We're Building

A **self-maintaining, compounding knowledge base** for JARVIS using Karpathy's LLM Wiki pattern.

**Key features:**
1. **Hot cache** - 500-word rolling summary for instant session recovery
2. **Index** - Content catalog for navigation
3. **Log** - Audit trail of all operations
4. **Manifest** - Delta tracking to prevent duplicate processing
5. **Auto-updates** - Skills and daily reflection maintain wiki automatically
6. **Cross-references** - Wikilinks connect entities, concepts, sources
7. **Contradiction tracking** - Explicit callouts for conflicting information
8. **Progressive disclosure** - Read hot → index → specific pages (only when needed)

**Expected outcomes:**
- **92% token reduction** for session start (500 tokens vs 15k)
- **Knowledge compounding** - Each source enriches existing pages
- **Self-maintenance** - 90% automatic via daily reflection + skill hooks
- **Audit trail** - Every change logged and tracked
- **Session recovery** - Instant context restoration via hot.md

**Timeline:**
- **1-2 days** - Foundation (SCHEMA, hot, index, log, skills)
- **1 week** - Integration (auto-updates, daily reflection, templates)
- **2-4 weeks** - Migration (ingest existing knowledge gradually)

**Risk:** Low (proven pattern, additive changes, easy rollback)

**Recommendation:** Proceed with implementation.

---

## Next Steps

1. **Review this plan** - Terry validates approach and priorities
2. **Create Phase 1 files** - SCHEMA.md, hot.md, index.md, log.md, .manifest.json
3. **Build wiki skills** - /wiki-setup, /wiki-ingest, /wiki-query, /wiki-lint, /wiki-status
4. **Test hot cache** - Confirm <1k token session start
5. **Integrate with daily reflection** - Auto-ingest learnings
6. **Begin migration** - Ingest Phase 0-3 docs (high-value content)
7. **Iterate based on usage** - Evolve schema, templates, workflows

**Ready to proceed when you are.**

---

**Document created:** April 11, 2026  
**Author:** Claude (Sonnet 4.5) via JARVIS Agent  
**Location:** `${JARVIS_HOME}/research/karpathy-llm-wiki/IMPLEMENTATION-PLAN.md`  
**Word count:** ~15,000 words  
**Reading time:** ~60 minutes
