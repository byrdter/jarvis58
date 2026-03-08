# JARVIS Quick Reference

**Last Updated:** January 26, 2026
**Phase:** 1 Complete ✅ | Investment Domain Fully Operational

---

## 🚀 Getting Started After Context Loss

If you lose conversation context, read these files in order:

1. **`context/CLAUDE.md`** - Context system status and structure
2. **`context/memory/work-status.md`** - Recent work and current state
3. **`CLAUDE.md`** - Project guidelines and current capabilities
4. **This file** - Quick commands and paths

---

## 📁 Critical File Paths

### Documentation (Read First)
```
README.md                           # Project overview
CLAUDE.md                           # Project guidelines
context/CLAUDE.md                   # Context orchestrator
context/memory/work-status.md       # Current state
```

### Memory System
```
context/memory/learnings.md         # Accumulated knowledge
context/memory/user-preferences.md  # Terry's preferences
context/memory/work-status.md       # Current tasks
```

### Skills (Investment Domain - 6 Complete)
```
skills/market-analysis/SKILL.md              # Individual ETF deep dive
skills/etf-screener/SKILL.md                 # Screen 14 ETFs, rank opportunities
skills/portfolio-builder/SKILL.md            # Construct allocations with risk mgmt
skills/portfolio-monitor/SKILL.md            # Daily/weekly monitoring
skills/performance-tracker/SKILL.md          # Monthly strategy validation
skills/market-insights/SKILL.md              # Chris Vermeulen automation
skills/market-insights/check_new_videos.py   # YouTube automation script
skills/obsidian-manager/SKILL.md             # Vault organization
```

### Tools
```
cli-tools/jarvis-price                     # Market data CLI wrapper
cli-tools/market-data/                     # CLI tool source
context/tools/market-data-cli.md           # Tool documentation
```

### Reports (Obsidian Vault)
```
/Volumes/ORICO/jarvis/obsidian-vault/
├── investments/
│   ├── reports/                           # Screening, allocation, performance
│   │   ├── etf-screening-*.md
│   │   ├── portfolio-allocation-*.md
│   │   ├── performance-*.md
│   │   └── analysis-*.md
│   └── monitoring/                        # Daily/weekly checks
│       ├── daily-check-*.md
│       └── weekly-review-*.md
└── research/
    └── daily-insights/                    # Chris Vermeulen analysis
        └── vermeulen-*.md
```

### Session Documentation
```
OPTIONS-A-B-C-D-SUMMARY.md          # Complete Phase 0 journey
SESSION-ACCOMPLISHMENTS.md          # Latest session achievements
LEVEL-1-PATTERNS.md                 # Extracted patterns
NINE-SKILLS-MAPPING.md              # Connection to Nine Skills
```

---

## 🛠️ Essential Commands

### Market Data CLI

**Get Technical Indicators:**
```bash
/Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/cli-tools/jarvis-price indicators SPY --json
```

**Quick Stage Assessment:**
```bash
/Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/cli-tools/jarvis-price stage QQQ --json
```

**Current Price:**
```bash
/Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/cli-tools/jarvis-price current AAPL
```

**Historical Data:**
```bash
/Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/cli-tools/jarvis-price history SPY --days 200 --json
```

### Claude Code Sessions

**Start JARVIS:**
```bash
cd /Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis
claude
```

**Continue Last Session:**
```bash
claude --continue
```

**Resume Specific Session:**
```bash
claude --resume
```

---

## 📊 Current Capabilities

### What JARVIS Can Do Now (Phase 0 Complete)

✅ **Real-Time Market Analysis**
- Fetch live data from Yahoo Finance (15-20 min delay)
- Calculate technical indicators (SMAs, RSI, MACD)
- Detect market stage (1-4) using Asset Revesting framework
- Generate composite scores with grades
- Provide actionable recommendations with entry/exit points

✅ **Memory & Learning**
- Autonomous memory updates after tasks
- Persistent learnings across sessions
- User preference tracking
- Work status maintenance

✅ **Professional Reporting**
- Structured markdown reports
- Asset Revesting methodology applied
- PHARE framework positioning
- Data quality documentation

✅ **Skills Framework**
- market-analysis skill operational
- Real data integration working
- Design requirements enforced

---

## 🔑 Key Concepts

### Progressive Disclosure
Only read context files when needed. Don't load everything upfront.

### Memory System
- **Episodic:** work-status.md (what happened)
- **Semantic:** learnings.md (what we know)
- **Procedural:** skills/ (how to do things)

### Skills Framework
Each skill has:
- `SKILL.md` - Execution workflow
- `design-requirements.md` - Quality standards
- Supporting files as needed

### Tool Integration
- CLI tools with JSON output
- Documentation in `context/tools/`
- Wrapper scripts for easy use

---

## 🎯 Common Tasks

### Perform Market Analysis

1. Read skill: `skills/market-analysis/SKILL.md`
2. Fetch data: `jarvis-price indicators SYMBOL --json`
3. Apply 4-stage framework
4. Generate report to `reports/`
5. Update `context/memory/work-status.md`

### Check Current Status

1. Read: `context/memory/work-status.md`
2. Read: `context/memory/learnings.md`
3. Check recent reports in `reports/`

### Use a Tool

1. Read tool docs: `context/tools/[tool-name].md`
2. Execute command with `--json` flag
3. Parse JSON output
4. Use in analysis

---

## 📈 Phase 0 Achievements

**Date Completed:** January 24, 2026

✅ Context system operational (progressive disclosure)
✅ Skills framework validated
✅ Memory system autonomous updates
✅ Real market data integration (CLI tool)
✅ Live market analysis (SPY, QQQ tested)
✅ First real signal detected (MACD divergence)
✅ Level 1 patterns documented
✅ 3 professional reports generated
✅ 1,500+ lines of documentation created

**Key Discovery:** MACD bearish divergence in SPY
- MACD: 1.83 vs Signal: 2.68
- Changes recommendation from "buy" to "wait for pullback"
- Sample data couldn't provide this insight

---

## 🚦 What's Next (Phase 1)

### Planned Enhancements
- [ ] Portfolio review skill
- [ ] Risk assessment skill
- [ ] Trade recommendation skill
- [ ] Multiple data sources (Alpha Vantage, TradingView)
- [ ] Position tracking
- [ ] Alert system

### Level 1 Extraction
- [ ] Extract patterns to full-stack-foundations
- [ ] Create templates for each pattern
- [ ] Write integration guides
- [ ] Test with second application

### MCP Integration (Phase 3+)
- [x] MCP lazy loading enabled (`enableToolSearch: true`)
- [ ] Add research MCPs (Exa, Perplexity, arXiv)
- [ ] Add social MCPs (Twitter, LinkedIn)
- [ ] Add productivity MCPs (Gmail, Google Calendar)
- [ ] Docker MCP toolkit for server management

**Strategy:** Keep custom CLI tools for investment domain, use MCP servers for new domains

---

## 🔍 Troubleshooting

### Context Lost?
Read these in order:
1. `context/CLAUDE.md`
2. `context/memory/work-status.md`
3. `CLAUDE.md`
4. `SESSION-ACCOMPLISHMENTS.md`

### CLI Tool Not Working?
```bash
cd /Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/cli-tools/market-data
source .venv/bin/activate
jarvis-price indicators SPY
```

### Memory Not Updated?
Check if hook is working:
- `.claude/hooks/memory-reminder.md` should trigger on user prompt

### Need to Reinstall CLI Tool?
```bash
cd /Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/cli-tools/market-data
uv venv
source .venv/bin/activate
uv pip install -e .
```

---

## 📚 Educational Resources

### For Nine Essential Skills
- **YouTube Series:** Terry's channel
- **GitHub Repo:** https://github.com/byrdter/nine-skills-agentic-ai
- **JARVIS Mapping:** `NINE-SKILLS-MAPPING.md`

### For Level 1 Patterns
- **Pattern Documentation:** `LEVEL-1-PATTERNS.md`
- **Implementation Journey:** `OPTIONS-A-B-C-D-SUMMARY.md`
- **Session Summary:** `SESSION-ACCOMPLISHMENTS.md`

### For Asset Revesting
- **Methodology:** `context/projects/investments/CLAUDE.md`
- **Resources:** `Docs/` folder (books, guides, analysis)

---

## 💡 Pro Tips

1. **Always read `context/CLAUDE.md` first** - It tells you current status
2. **Check work-status.md** - See what was completed recently
3. **Use grep/glob** - Search don't scan for specific info
4. **Trust the memory system** - It's maintained automatically
5. **CLI tool is fast** - Real data in 2-3 seconds
6. **Reports are saved** - Check `reports/` for past analyses
7. **Documentation is comprehensive** - Almost everything is documented

---

## 🎓 Key Files for Learning

If you want to understand how JARVIS works:

1. **Architecture:** `LEVEL-1-PATTERNS.md`
2. **Development Journey:** `OPTIONS-A-B-C-D-SUMMARY.md`
3. **Skill Example:** `skills/market-analysis/SKILL.md`
4. **Tool Example:** `context/tools/market-data-cli.md`
5. **Memory Example:** `context/memory/learnings.md`

---

## ✅ Verification Checklist

To verify JARVIS is working:

- [ ] Can read `context/CLAUDE.md`
- [ ] Can access `context/memory/work-status.md`
- [ ] Can execute `jarvis-price indicators SPY --json`
- [ ] Can read `skills/market-analysis/SKILL.md`
- [ ] Can generate analysis report
- [ ] Memory updates automatically

If all checked, JARVIS is operational! 🚀

---

*This quick reference is updated as JARVIS evolves.*
*Last verified: January 24, 2026 - Phase 0 Complete*
