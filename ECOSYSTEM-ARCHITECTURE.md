# JARVIS Ecosystem Architecture
**Date:** 2026-02-06
**Purpose:** Document all applications, their responsibilities, integration points, and information flow

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    LEVEL 3: INTEGRATED ECOSYSTEM                 │
│                    (Planned: Dashboard + Voice)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┬──────────────┐
        ▼                    ▼                    ▼              ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐  ┌───────────┐
│ JARVIS Core  │    │  Research    │    │   Content    │  │ Knowledge │
│ (Investment) │    │ Aggregators  │    │  Creation    │  │Management │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘  └─────┬─────┘
       │                   │                   │                 │
       └───────────────────┴───────────────────┴─────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
        ┌───────────────────────┐    ┌──────────────────────┐
        │  LEVEL 1: PATTERNS    │    │ LEVEL 0: FOUNDATIONS │
        │  (Being Extracted)    │    │  (To Be Mapped)      │
        └───────────────────────┘    └──────────────────────┘
```

---

## Application Inventory

### 1. JARVIS Core (Investment Domain)

**Location:** `jarvis/` (root + skills/investment-related)

**Purpose:** Investment management using Asset Revesting methodology

**Responsibilities:**
- Analyze individual stocks/ETFs using 4-stage framework
- Screen 14 ETFs and rank Stage 2 opportunities
- Build portfolio allocations with position sizing
- Monitor portfolios (daily stops, weekly reviews)
- Track performance and validate strategy monthly
- Extract insights from Chris Vermeulen's YouTube analysis
- Maintain investment context and memory

**Key Components:**
- **Context System** (`context/`) - Progressive disclosure, memory, preferences
- **Skills** (`skills/`) - 6 investment skills (market-analysis, etf-screener, portfolio-builder, portfolio-monitor, performance-tracker, market-insights)
- **CLI Tools** (`jarvis-price`) - Market data via Yahoo Finance
- **Alpaca Integration** - Brokerage API for real data (200 SMA, 256+ days)

**Data Sources:**
- Yahoo Finance (via jarvis-price CLI)
- Alpaca Markets API
- Chris Vermeulen YouTube channel
- Manual user input

**Outputs:**
- Analysis reports (saved to `reports/`)
- Portfolio recommendations
- Monitoring alerts
- Performance metrics
- Memory updates (`context/memory/`)

**Current Status:** ✅ Phase 1 Complete (6 skills operational)

---

### 2. Research Aggregators (Research Domain)

**Location:** `jarvis/skills/` (news-aggregator, youtube-content-aggregator, academic-research-aggregator)

**Purpose:** Automated collection and synthesis of information from multiple sources

**Responsibilities:**
- Monitor 16 AI news sources, generate daily digest
- Track 10 YouTube channels, extract transcripts
- Scrape Auburn Library for academic research
- Analyze Chris Vermeulen market insights
- Email digests to user

**Key Components:**

#### a. News Aggregator
- **Script:** `skills/news-aggregator/aggregate_news.py`
- **Automation:** LaunchAgent (9:00 AM daily)
- **Wrapper:** `~/bin/jarvis-news-daily.sh`
- **Sources:** 16 AI news websites
- **Output:** Daily digest markdown + email

#### b. YouTube Content Aggregator
- **Script:** `skills/youtube-content-aggregator/aggregate_content.py`
- **Automation:** LaunchAgent (8:00 AM daily)
- **Wrapper:** `~/bin/jarvis-youtube-daily.sh`
- **Channels:** 10 AI/ML YouTube channels
- **Output:** Weekly digest with transcripts

#### c. Academic Research Aggregator
- **Script:** `skills/academic-research-aggregator/scrape_library.py`
- **Method:** CDP (Chrome DevTools Protocol) automation
- **Source:** Auburn University Library
- **Output:** Research papers and summaries

#### d. Market Insights (Chris Vermeulen)
- **Script:** `skills/market-insights/check_new_videos.py`
- **Method:** YouTube RSS + transcript extraction
- **Purpose:** Automate expert market analysis
- **Output:** Transcripts saved to `skills/market-insights/transcripts/`

**Data Sources:**
- 16 AI news websites (RSS feeds)
- 10 YouTube channels (RSS + transcript API)
- Auburn Library (web scraping via CDP)
- Chris Vermeulen YouTube channel

**Outputs:**
- Daily news digest (markdown + email)
- Weekly YouTube digest with transcripts
- Academic research summaries
- Market insights transcripts

**Current Status:** ✅ Operational (all 4 aggregators working)

---

### 3. Video Generation Pipeline (Content Creation Domain)

**Location:** `jarvis/projects/` (DeepSeek_Efficiency, Model_Retirement, Copyright_Collision)

**Purpose:** Create AI explainer videos for KeyAdvances YouTube channel

**Responsibilities:**
- Script creation (18-21 minute videos)
- Image generation via Lovart.ai CDP automation
- Image-to-video conversion
- YouTube launch packages (thumbnails, titles, descriptions, shorts)

**Key Components:**
- **Script Files:** Full video scripts with image prompts (22 segments per video)
- **Image Generation:** CDP automation for Lovart.ai
- **Video Assembly:** Script → Images → Video workflow
- **Launch Packages:** Thumbnail design, 12 title options, full descriptions, shorts scripts

**Current Projects:**
1. **Model_Retirement** - When successful AI models get deleted
2. **Copyright_Collision** - $3B legal battle over AI training
3. **DeepSeek_Efficiency** - $6M efficiency vs $100M+ Western models

**Data Sources:**
- Research synthesis (from aggregators)
- User topic direction
- AI news and trends

**Outputs:**
- Full video scripts (markdown)
- Image prompts for each segment
- YouTube launch packages
- 5 YouTube Shorts scripts per video

**Current Status:** ✅ 3 videos in production (scripts complete, awaiting image generation)

---

### 4. Knowledge Management (Cross-Domain)

**Location:** `obsidian/` + `context/`

**Purpose:** Organize and maintain multi-domain second brain

**Responsibilities:**
- Manage 7-domain Obsidian vault structure
- Organize JARVIS context files
- Maintain learning documentation
- Structure project documentation

**Key Components:**
- **Obsidian Vault:** 7-domain structure (AI, Tech, Business, Learning, Health, Lifestyle, Other)
- **JARVIS Context:** Progressive disclosure system
- **Memory System:** Learnings, work status, preferences
- **Project Docs:** Multi-domain project organization

**Domains:**
1. AI & Machine Learning
2. Technology & Tools
3. Business & Career
4. Learning & Development
5. Health & Fitness
6. Lifestyle & Interests
7. Other & Miscellaneous

**Data Sources:**
- All other applications
- Manual note-taking
- Context updates

**Outputs:**
- Organized knowledge base
- Context files for JARVIS
- Learning documentation
- Project structure

**Current Status:** ✅ Operational (7-domain structure active)

---

## Integration Points

### Current Integration (Implicit)

1. **Research → Knowledge Management**
   - News digests saved to Obsidian vault
   - YouTube transcripts archived
   - Research papers organized

2. **Knowledge Management → JARVIS Core**
   - Context files inform investment decisions
   - Learnings feed back into analysis
   - Preferences guide behavior

3. **Research → Content Creation**
   - Aggregated content informs video topics
   - Transcripts provide source material
   - News trends identify relevant subjects

4. **All Apps → Memory System**
   - Work status updates after task completion
   - Learnings captured from each domain
   - Preferences refined from user interaction

### Missing Integration (Gaps)

1. **No Direct Inter-App Communication**
   - Apps run independently
   - No shared event bus
   - No API layer between apps

2. **No Centralized Context Store**
   - Each app maintains own state
   - Context not automatically shared
   - Manual bridging required

3. **No Cross-Domain Intelligence**
   - Research insights don't automatically inform investment decisions
   - Content creation doesn't leverage investment analysis
   - Siloed knowledge

---

## Information Flow Diagrams

### Current Flow (Manual/Implicit)

```
News Sources → News Aggregator → Email + Markdown
                                       ↓
YouTube Channels → YouTube Aggregator → Weekly Digest
                                       ↓
                                 Obsidian Vault
                                       ↓
                                 (Manual Reading)
                                       ↓
                              User Directs JARVIS
                                       ↓
                              JARVIS Context System
                                       ↓
                        Investment Analysis/Decisions
```

### Desired Flow (Integrated)

```
┌──────────────────────────────────────────────────────┐
│              Shared Context Store/Event Bus          │
└────┬──────────┬──────────┬──────────┬───────────────┘
     │          │          │          │
     ▼          ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│Research │ │JARVIS  │ │ Content  │ │Knowledge │
│Pipeline │ │  Core  │ │ Creation │ │  Mgmt    │
└────┬────┘ └───┬────┘ └────┬─────┘ └────┬─────┘
     │          │           │            │
     └──────────┴───────────┴────────────┘
                    ↓
            Dashboard + Voice
```

---

## Shared Components

### Currently Shared

1. **Context System Pattern**
   - Progressive disclosure
   - Memory management (learnings, work-status, preferences)
   - Used by: JARVIS Core (explicitly), Other apps (implicitly via documentation)

2. **CDP Automation Pattern**
   - Browser control for web automation
   - Used by: Academic research aggregator, Lovart.ai image generation

3. **CLI Tool Pattern**
   - JSON output, venv management, documentation
   - Used by: jarvis-price (market data), aggregator scripts

4. **Skills Framework**
   - SKILL.md structure
   - Capability packaging
   - Used by: JARVIS Core (6 investment skills)

5. **Automation via LaunchAgent**
   - macOS scheduled tasks
   - Wrapper scripts in ~/bin/
   - Used by: News aggregator (daily), YouTube aggregator (daily)

### Should Be Shared (Candidates for Level 1 Extraction)

1. **Progressive Disclosure Protocol** - How to manage context efficiently
2. **Skills Framework Template** - How to package capabilities
3. **Autonomous Memory System** - How apps update their own knowledge
4. **CLI Tool Architecture** - How to build reusable command-line tools
5. **CDP Automation Pattern** - How to control browsers programmatically
6. **Context System Design** - How to organize AI assistant context

---

## Mapping to 4-Level Architecture

### Level 0: Full-Stack-Foundations
**Status:** ⚠️ Not Explicitly Mapped

**Action Required:**
- Review Full-Stack-Foundations repo
- Identify which foundation patterns we're using
- Document gaps (what we should be using but aren't)
- Create mapping document: "How JARVIS Uses Full-Stack-Foundations"

**Expected Components:**
- Database patterns (for future Supabase integration)
- API design patterns (for future app integration)
- Authentication patterns (for dashboard)
- Frontend patterns (for dashboard)
- Backend patterns (for API layer)

---

### Level 1: Domain-Agnostic Patterns
**Status:** ⚠️ Patterns Exist, Not Formalized

**Patterns to Extract:**

1. **Progressive Disclosure Protocol**
   - Source: JARVIS context system
   - Application: Any AI assistant needing efficient context management
   - Template: How to structure context files, when to load what

2. **Skills Framework Template**
   - Source: JARVIS investment skills
   - Application: Packaging capabilities for any domain
   - Template: SKILL.md structure, execution pattern, output format

3. **Autonomous Memory System**
   - Source: JARVIS memory system
   - Application: AI systems that update their own knowledge
   - Template: Learnings structure, work status tracking, preference management

4. **CLI Tool Architecture**
   - Source: jarvis-price tool
   - Application: Building reusable command-line tools
   - Template: JSON output, venv management, error handling, documentation

5. **CDP Automation Pattern**
   - Source: Lovart.ai, Auburn Library scrapers
   - Application: Browser control for data/image generation
   - Template: Connection management, navigation, interaction patterns

6. **Context System Design**
   - Source: JARVIS context/ directory structure
   - Application: Organizing AI assistant knowledge
   - Template: Directory structure, file naming, orchestration file

**Action Required:**
- Create template for each pattern
- Document when to use each pattern
- Write examples for each pattern
- Publish to Level 1 pattern library

---

### Level 2: Domain-Specific Applications
**Status:** ✅ Apps Exist, ⚠️ Documentation Incomplete

**Applications:**

1. **Investment Management** (JARVIS Core)
   - Domain: Financial markets, Asset Revesting methodology
   - Tech: Python, CLI tools, Alpaca API, Yahoo Finance
   - Patterns Used: Context System, Skills Framework, Memory System, CLI Tools
   - Status: Phase 1 Complete (6 skills operational)

2. **Research Aggregation**
   - Domain: AI/ML news, YouTube content, academic research
   - Tech: Python, RSS feeds, YouTube API, CDP, email
   - Patterns Used: CLI Tools, CDP Automation, LaunchAgent scheduling
   - Status: Operational (4 aggregators running)

3. **Content Creation**
   - Domain: AI explainer videos for YouTube
   - Tech: CDP automation, Lovart.ai, script generation
   - Patterns Used: CDP Automation, structured project organization
   - Status: 3 videos in production

4. **Knowledge Management**
   - Domain: Multi-domain personal knowledge
   - Tech: Obsidian, markdown
   - Patterns Used: Context System Design, Memory System
   - Status: 7-domain structure operational

**Action Required:**
- Create README.md for each app
- Document responsibilities clearly
- Map integration points
- Identify shared components

---

### Level 3: Integrated Ecosystem
**Status:** ⚠️ Planned, Not Started

**Vision:**
- Dashboard to view ecosystem status
- Voice interface (Whisper + ElevenLabs)
- Cross-app communication (event bus or API layer)
- Unified context store
- Intelligence sharing between domains

**Components Needed:**

1. **Dashboard**
   - View all app statuses
   - Recent outputs (digests, analyses, videos)
   - Quick actions (run skill, check news, etc.)
   - Stack: React? Next.js? Svelte? (TBD)

2. **Voice Interface**
   - Speech-to-text (Whisper)
   - Text-to-speech (ElevenLabs)
   - Command routing to appropriate app
   - Conversational interaction

3. **Integration Layer**
   - Shared context store (database?)
   - Event bus for app communication
   - API layer between apps
   - Pub/sub pattern for information sharing

**Action Required:**
- Design integration layer architecture
- Choose dashboard stack
- Plan voice interface implementation
- Create Phase 4, 5, 6 implementation plans

---

## Technology Stack by Application

### JARVIS Core (Investment)
- **Language:** Python 3.x
- **APIs:** Alpaca Markets, Yahoo Finance (via yfinance)
- **CLI Tools:** jarvis-price (custom)
- **Storage:** File-based (markdown reports)
- **Context:** Progressive disclosure system (markdown)

### Research Aggregators
- **Language:** Python 3.x
- **APIs:** YouTube RSS, YouTube Transcript API
- **Web Scraping:** CDP (Chrome DevTools Protocol)
- **Automation:** macOS LaunchAgent
- **Email:** Gmail SMTP
- **Storage:** Markdown digests, transcript files

### Content Creation
- **Language:** Python 3.x (for automation)
- **Image Generation:** Lovart.ai (CDP automation)
- **Video Tools:** (TBD - image-to-video conversion)
- **Storage:** Markdown scripts, image files

### Knowledge Management
- **Tool:** Obsidian
- **Format:** Markdown
- **Organization:** 7-domain vault structure
- **Integration:** Manual (currently)

### Future (Level 3)
- **Dashboard:** React/Next.js/Svelte (TBD)
- **Voice:** Whisper (STT), ElevenLabs (TTS)
- **Integration:** API layer, event bus, shared database
- **Database:** Supabase (planned)
- **Backend:** Node.js or Python (TBD)

---

## App Communication Strategy (Proposed)

### Option A: Shared Context Store
```
┌─────────────────────────────────┐
│   Shared Context Database       │
│   (Supabase or SQLite)          │
└────────────┬────────────────────┘
             │
    ┌────────┼────────┬────────┐
    ▼        ▼        ▼        ▼
  App 1    App 2    App 3    App 4
  (Read/Write to shared context)
```

**Pros:** Simple, each app can query shared state
**Cons:** Tight coupling, need database setup

### Option B: Event Bus
```
┌─────────────────────────────────┐
│        Event Bus/Pub-Sub         │
│   (Redis, RabbitMQ, or custom)  │
└────────────┬────────────────────┘
             │
    ┌────────┼────────┬────────┐
    ▼        ▼        ▼        ▼
  App 1    App 2    App 3    App 4
  (Publish/Subscribe to events)
```

**Pros:** Loose coupling, async communication
**Cons:** More complex setup, event design needed

### Option C: API Layer
```
┌─────────────────────────────────┐
│      Central API Service        │
│     (REST or GraphQL)           │
└────────────┬────────────────────┘
             │
    ┌────────┼────────┬────────┐
    ▼        ▼        ▼        ▼
  App 1    App 2    App 3    App 4
  (HTTP requests to central API)
```

**Pros:** Clear interface, familiar pattern
**Cons:** Requires API server, latency

### Option D: Hybrid (Recommended)
- **Shared file-based context** (current state, lightweight)
- **Event bus for real-time communication** (future)
- **API layer for dashboard** (Level 3)

**Implementation:**
1. **Phase 1:** Continue file-based, standardize format
2. **Phase 2:** Add event bus for inter-app notifications
3. **Phase 3:** Add API layer when dashboard is built

---

## Immediate Architecture Actions (Next 48 Hours)

1. ✅ **ARCHITECTURE-ASSESSMENT.md created** - Gap analysis complete
2. ✅ **ECOSYSTEM-ARCHITECTURE.md created** - This document
3. ⬜ **App README files** - Create for each app:
   - `jarvis/apps/investment/README.md`
   - `jarvis/apps/research/README.md`
   - `jarvis/apps/content-creation/README.md`
   - `jarvis/apps/knowledge-management/README.md`
4. ⬜ **Foundation mapping** - Review Full-Stack-Foundations, map to JARVIS
5. ⬜ **Extract first Level 1 pattern** - Progressive Disclosure Protocol template

---

## Success Metrics

**Architecture is well-documented when:**
- [ ] Can draw complete ecosystem diagram
- [ ] Each app has clear responsibilities documented
- [ ] Integration points are mapped
- [ ] Can explain information flow between apps
- [ ] New features reference which app and pattern they use
- [ ] Can identify which components are shared vs app-specific

**Foundation alignment achieved when:**
- [ ] Can explain how JARVIS uses Full-Stack-Foundations
- [ ] Have documented gaps (what we should use but don't)
- [ ] Future features reference foundation patterns

**Pattern extraction complete when:**
- [ ] 6 Level 1 patterns have templates
- [ ] Each pattern has "when to use" documentation
- [ ] Examples provided for each pattern
- [ ] Published to Level 1 pattern library

**Ecosystem integration ready when:**
- [ ] Integration layer designed (shared context/event bus/API)
- [ ] Basic inter-app communication works
- [ ] Test case complete: News → Obsidian → JARVIS context flow
- [ ] Dashboard foundation begun

---

**Bottom Line:** We've built 4 distinct applications across 3 domains, each with valuable capabilities. This document formalizes their architecture, identifies integration gaps, and provides roadmap for Level 3 ecosystem integration while ensuring Level 0 foundation alignment and Level 1 pattern extraction.
