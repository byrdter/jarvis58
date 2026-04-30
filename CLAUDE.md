# JARVIS Project Guidelines

> **JARVIS** - Just A Rather Very Intelligent System  
> An AI-powered investment management assistant using Claude Code as its intelligent core.

## Project Overview

JARVIS is a personal AI assistant specialized in investment management using Chris Vermeulen's Asset Revesting methodology. Claude Code serves as the "brain" of the system, orchestrating analysis, recommendations, and learning through a sophisticated context system.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE (Brain)                       │
│                                                              │
│  Uses: Context System + Skills + Hooks + CLI Tools/MCP      │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              [Market Data]  [Database]   [Brokerage]
                    │             │             │
                    └─────────────┼─────────────┘
                                  ▼
                    ┌─────────────────────────────┐
                    │   Full-Stack-Foundations    │
                    │   (Future: Voice + Dashboard)│
                    └─────────────────────────────┘
```

## Path Conventions

Documentation in this repo references two roots via placeholders:

- `${JARVIS_HOME}` = `~/Library/CloudStorage/Dropbox/jarvis` (this public repo)
- `${JARVIS_PRIVATE}` = `~/Library/CloudStorage/Dropbox/jarvis-private` (private peer directory, not on GitHub)

When you see those placeholders in any SKILL.md or doc, substitute mentally before navigating.

## Critical: Context System

**ALWAYS** read `${JARVIS_PRIVATE}/context/CLAUDE.md` at the start of every session. This file orchestrates the entire context system including:
- Memory (learnings, preferences, work status)
- Projects (investments, future domains)
- Tools (CLI tools, MCP servers)

The context system uses **progressive disclosure** - only read detailed context when needed for the current task.

## Directory Structure

```
jarvis/                          # Public GitHub repository
├── CLAUDE.md                    # This file - project guidelines
├── README.md                    # Setup, tech stack, getting started
├── .claude/
│   ├── output-style.md          # JARVIS personality/identity
│   ├── settings.json            # Claude Code settings
│   └── hooks/                   # Behavioral steering
├── ecosystem/                   # Core framework
├── skills/                      # Educational example skills
└── cli-tools/                   # Custom tools

../jarvis-private/               # Private data (not on GitHub)
├── context/
│   ├── CLAUDE.md                # Context system orchestrator
│   ├── memory/                  # Persistent learnings
│   ├── projects/                # Domain-specific context
│   └── tools/                   # CLI/MCP documentation
├── apps/                        # Your work products
├── reports/                     # Generated reports
└── logs/                        # Execution logs
    ├── market-analysis/         # Individual ETF deep dive
    ├── etf-screener/            # Screen 14 ETFs, rank opportunities
    ├── portfolio-builder/       # Construct allocations
    ├── portfolio-monitor/       # Daily/weekly monitoring
    ├── performance-tracker/     # Monthly validation
    ├── market-insights/         # Chris Vermeulen automation
    │   ├── check_new_videos.py  # YouTube automation script
    │   └── transcripts/         # Video transcripts
    └── obsidian-manager/        # Vault organization
```

## Core Principles

### 1. Progressive Disclosure
- Don't read all context upfront
- Read detailed files only when needed for the current task
- Use `glob` and `grep` to find specific information

### 2. Memory Management
- Update `../jarvis-private/context/memory/work-status.md` after completing tasks
- Create new learnings in `../jarvis-private/context/memory/learnings.md`
- Respect user preferences in `../jarvis-private/context/memory/user-preferences.md`

### 3. Skill Execution
- Skills are in `skills/` directory
- Always read `SKILL.md` before executing a skill
- Follow design requirements exactly
- Produce high-quality, detailed outputs

### 4. Human-in-the-Loop
- Always confirm before executing trades or financial actions
- Present analysis and recommendations, await approval
- Log all decisions and rationale

## Development Phases

### Phase 0: Terminal Foundation ✅ COMPLETE (Jan 24, 2026)
- [x] Claude Code as brain via terminal
- [x] Context system operational (progressive disclosure working)
- [x] Market Analysis skill (with real data integration)
- [x] Memory system working (autonomous updates)
- [x] **Real market data integration** (CLI tool with yfinance)
- [x] **Live market analysis** (detected first MACD signal in SPY)
- [x] **Level 1 patterns documented** (ready for extraction)

**Key Achievement:** JARVIS detected first real market signal (MACD divergence)
**Documentation:** See `OPTIONS-A-B-C-D-SUMMARY.md` for complete journey

### Phase 1: Investment Domain Complete ✅ COMPLETE (Feb 13, 2026)
- [x] **ETF Screener skill** - Screen 14 ETFs, rank Stage 2 opportunities
- [x] **Portfolio Builder skill** - Construct allocation with position sizing
- [x] **Portfolio Monitor skill** - Daily stop checks + weekly reviews
- [x] **Performance Tracker skill** - Monthly strategy validation
- [x] **Market Insights skill** - Automated Chris Vermeulen YouTube analysis
- [x] **Obsidian Integration** - Multi-domain second brain (7 domains)
- [x] **Alpaca API Integration** - 200 SMA capable, 256+ days data
- [x] **$100K Portfolio Allocation** - QQQ $25K, USO $10K conditional, BIL $65K
- [x] **Heartbeat System** - Fully autonomous proactive execution (all 3 phases complete)

**Key Achievement:** Complete Asset Revesting workflow automated + expert validation + **Autonomous 24/7 execution**
**Documentation:** See `HEARTBEAT-COMPLETE.md` and `context/memory/work-status.md` for details

#### Phase 1 Extended: Content Creation Domain ✅ COMPLETE (Feb 22, 2026)
- [x] **10-Day Promotional Blitz Content Library** - 18,000+ lines of pre-written content
- [x] **Image Catalog System** - 270 images analyzed (95%+ coverage, 90%+ cost savings)
- [x] **URL Management System** - Centralized in .env + automated replacement (134 placeholders)
- [x] **Manual Posting Strategy** - Complete 17-day tactical schedule for 7 platforms
- [x] **Launch Ready** - Monday, February 23, 2026 @ 7:00 AM
  - 234+ content pieces (YouTube, Instagram, TikTok, LinkedIn, Twitter/X, Pinterest, Substack)
  - 70+ pieces complete and ready for copy/paste
  - Templates for remaining pieces (~3 hours to finish)

**Key Achievement:** Complete promotional blitz content library created - multi-platform distribution ready
**Documentation:** See `apps/content-creation/video-generator/projects/byrddynasty/content-library/LAUNCH-READY-SUMMARY.md`

### Phase 2: Agent SDK + Vector Search + API Integrations ✅ COMPLETE (Apr 1, 2026)
- [x] **Phase 2A:** Bun runtime + TypeScript environment
- [x] **Phase 2B:** Hybrid vector + keyword search (local embeddings, $0 cost)
- [x] **Phase 2C:** Gmail + Calendar integrations (OAuth, programmatic access)
- [x] **Phase 2D:** 24/7 heartbeat + specialized subagents

**Key Achievement:** Zero-cost autonomous agent with intelligent memory search and direct API integrations
**Documentation:** See `PHASE-2-COMPLETE.md` and `agent-sdk/` directory

**Capabilities Added:**
- Semantic vector search (70% vector + 30% keyword, ~60-200ms, $0 cost)
- Read emails programmatically (search, filter, check broker alerts)
- Access calendar events (today, upcoming, earnings calendar)
- 24/7 autonomous monitoring (survives reboots, CLI-first, $0/month)

### Phase 3: Autonomous Intelligence & Remote Access ⏳ IN PROGRESS (Apr 4, 2026)

#### Phase 3A: Agent SDK ✅ COMPLETE (Apr 4, 2026)
- [x] **Persistent Bun server** - 24/7 execution on port 3000
- [x] **CLI subprocess approach** - Using Claude Code CLI (Cole Medin method)
- [x] **HTTP/WebSocket APIs** - Remote query endpoints
- [x] **Event loop** - Time-based triggers (8 AM, 9:30 AM, 4 PM)
- [x] **Execution logging** - SQLite database tracking
- [x] **$0/month cost** - OAuth token (no API charges)

**Key Achievement:** True persistent autonomous agent using CLI subprocesses instead of expensive API calls  
**Documentation:** See `PHASE-3A-COMPLETE.md` and `PHASE-3-CLI-SUBPROCESS-APPROACH.md`

#### Phase 3B: Daily Reflection ✅ COMPLETE (Apr 4, 2026)
- [x] **8 AM automatic reflection** - Reviews yesterday's logs
- [x] **Learning extraction** - JARVIS analyzes patterns, extracts insights
- [x] **Memory file updates** - Auto-updates learnings.md and work-status.md
- [x] **Morning briefing** - Market + Portfolio + Calendar + Email + Priorities
- [x] **Zero manual intervention** - Self-improving AI that learns from every execution

**Key Achievement:** JARVIS manages its own memory and delivers actionable morning intelligence daily  
**Documentation:** See `PHASE-3B-COMPLETE.md`

**Capabilities Added:**
- CLI subprocess execution (full JARVIS context, $0 cost)
- Daily learning cycle (3-7 insights per day)
- Automatic memory management (no human updates needed)
- Morning briefings (portfolio alerts, priorities, calendar awareness)

#### Phase 3C: Remote Access 🔄 NEXT
- [ ] Chat interface (Slack/Telegram bot for mobile access)
- [ ] Push notifications for portfolio alerts
- [ ] Natural language queries from anywhere

#### Phase 3D: Voice Interface (Future)
- Voice interface (Whisper + ElevenLabs + React frontend)

### Phase 4: Full Integration
- Brokerage integration (Alpaca - if needed for trading)
- Database persistence (Supabase)
- Dashboard and reporting

## Commands Reference

```bash
# Start JARVIS session
claude

# Continue previous session
claude --continue

# Resume specific session
claude --resume

# Run in YOLO mode (if not set in settings.json)
claude --dangerously-skip-permissions
```

## Key Files to Read

### Every Session
1. `../jarvis-private/context/CLAUDE.md` - Context system orchestrator (always read first)
2. `../jarvis-private/context/memory/work-status.md` - Current state and recent work

### When Needed
3. `../jarvis-private/context/projects/investments/CLAUDE.md` - Asset Revesting methodology
4. `skills/market-analysis/SKILL.md` - When performing market analysis
5. `../jarvis-private/context/tools/market-data-cli.md` - When using market data tool
6. `../jarvis-private/context/memory/learnings.md` - Past insights and patterns
7. `../jarvis-private/context/memory/user-preferences.md` - Terry's preferences

## Byrddynasty Video Content

**CRITICAL: ALWAYS check this skill FIRST when user requests Byrddynasty video content:**
- `skills/video-image-creation/SKILL.md`

**When user asks for:**
- Long-form Byrddynasty videos (10-15 minutes)
- Video scripts and image prompts
- Multi-part video series
- Educational/tutorial content for the channel
- ANY Byrddynasty video-related requests

**You MUST:**
1. Read `skills/video-image-creation/SKILL.md` FIRST (before creating anything)
2. Follow **20-30 second script segments** (break longer segments into multiple images)
3. Create **1:1 script-to-image ratio** (each segment = one numbered image)
4. Use **large headings, vibrant colors, simple visuals** (not text-heavy)
5. Sequential numbering only (001, 002, 003... NO sub-versions like 001A)
6. Reference quality examples in SKILL.md

**KEY REQUIREMENT:** Each script segment must be 20-30 seconds MAX. If longer, break into multiple segments with separate images.

**This is AUTOMATIC - do NOT wait to be reminded.**

## Important Documentation

### For Understanding the System
- **`README.md`** - Overview, architecture, getting started
- **`LEVEL-1-PATTERNS.md`** - Domain-agnostic patterns (for extraction)
- **`NINE-SKILLS-MAPPING.md`** - Connection to Nine Essential Skills framework
- **`OPTIONS-A-B-C-D-SUMMARY.md`** - Complete Phase 0 development journey

### For Context Recovery (If Session Lost)
- `../jarvis-private/context/memory/work-status.md` - What was completed, what's next
- `../jarvis-private/context/memory/learnings.md` - All accumulated knowledge
- `SESSION-ACCOMPLISHMENTS.md` - Latest session achievements

## Current Capabilities

### Market Analysis
- **Real-time data** via `jarvis-price` CLI tool (Yahoo Finance, 15-20 min delay)
- **4-stage detection** (Accumulation, Markup, Distribution, Decline)
- **Technical indicators** (SMAs, RSI, MACD)
- **Composite scoring** with grades
- **Actionable recommendations** with entry/exit points

### Tools Available (Phase 0)
- `jarvis-price indicators SPY --json` - Get all technical indicators
- `jarvis-price stage QQQ --json` - Quick stage assessment
- `jarvis-price current SYMBOL` - Current price and market data
- `jarvis-price history SYMBOL --days N` - Historical data

See `../jarvis-private/context/tools/market-data-cli.md` for complete documentation.

### MCP Integration (Phase 3+)
- **Lazy loading enabled** in `.claude/settings.json` (`enableToolSearch: true`)
- **Claude Code 2.17+** supports on-demand MCP tool loading
- **Future expansion ready**: Can add 100+ MCP servers with zero context bloat
- **Strategy**: Keep custom CLI tools for investment domain, add MCP servers for new domains (research, social, productivity)

## What JARVIS Can Do Now

1. **Analyze any stock/ETF** using Asset Revesting 4-stage framework
2. **Detect market signals** from real Yahoo Finance data
3. **Generate professional reports** saved to `../jarvis-private/reports/`
4. **Update its own memory** after completing tasks
5. **Learn from experience** via `learnings.md`
6. **Maintain continuity** across sessions
7. **Ready for MCP expansion** when adding new domains (future)
