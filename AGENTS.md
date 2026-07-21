# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd prime` for full workflow context.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work atomically
bd close <id>         # Complete work
bd dolt push          # Push beads data to remote
```

## Non-Interactive Shell Commands

**ALWAYS use non-interactive flags** with file operations to avoid hanging on confirmation prompts.

Shell commands like `cp`, `mv`, and `rm` may be aliased to include `-i` (interactive) mode on some systems, causing the agent to hang indefinitely waiting for y/n input.

**Use these forms instead:**
```bash
# Force overwrite without prompting
cp -f source dest           # NOT: cp source dest
mv -f source dest           # NOT: mv source dest
rm -f file                  # NOT: rm file

# For recursive operations
rm -rf directory            # NOT: rm -r directory
cp -rf source dest          # NOT: cp -r source dest
```

**Other commands that may prompt:**
- `scp` - use `-o BatchMode=yes` for non-interactive
- `ssh` - use `-o BatchMode=yes` to fail instead of prompting
- `apt-get` - use `-y` flag
- `brew` - use `HOMEBREW_NO_AUTO_UPDATE=1` env var

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->


<claude-mem-context>
# Memory Context

# [jarvis] recent context, 2026-07-21 10:17am GMT+2

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (20,404t read) | 691,108t work | 97% savings

### Jul 19, 2026
4346 11:05a ⚖️ Voice Shell Access Mode: Read-Only by Default, Action-Capable When Needed
4347 1:03p ⚖️ VOICE-MASTER-PLAN.md Approved As-Is — No Two-Lane Classifier in Phase 1
4348 " ✅ Beads Issue Filed: JARVIS Voice Master Tracking Ticket
4349 " ✅ JARVIS Voice Implementation Phases Filed as Beads Issues
4350 1:04p ✅ Voice Phase Dependencies Wired and Phase 1 Claimed in Beads
4351 " 🔵 Claude CLI Confirms --output-format stream-json and Session Resume Flags Available
4352 1:05p 🔵 Claude CLI Streaming Flag Details: --include-partial-messages and --session-id Confirmed
4353 " 🔵 src/voice/ Directory Does Not Exist; JarvisCLIClient Has chat() Method for Voice Use
4354 " 🟣 JARVIS Voice Bridge Implemented: agent-sdk/src/voice/bridge.ts
4355 1:06p 🔵 Voice Bridge Smoke Test: TTFT 4547ms, Total 6961ms — Just Above Phase 1 Gate
4356 " 🟣 Voice Latency Measurement Harness Created: src/voice/measure.ts
4357 " 🔵 Phase 1 Gate PASSED: TTFT p50 2638ms — Voice Architecture Validated, Proceed to Phase 2
4358 1:07p ✅ VOICE-MASTER-PLAN.md Updated with Phase 1 Gate Results and Market Tool Defect
4359 1:08p 🔵 P1 Bug Filed: jarvis-price Tool Not Invoked in claude -p Headless Mode
4360 " 🔵 agent-sdk Is a Separate Git Repo: github.com/byrdter/jarvis_phase2
4361 " 🟣 Voice Phase 1 Committed to jarvis_phase2 and Beads Issue Closed
4363 3:42p 🔵 heylemon.ai "Lemon Supercomputer" Landing Page Claims Analyzed
S1020 Evaluate heylemon.ai vs. JARVIS — should the user adopt Lemon Supercomputer? (Jul 19 at 3:42 PM)
S1021 Deep transcript analysis of @makemoneymatt (Matt Par) YouTube channel — 30 videos, ~130k words — to extract video success criteria, algorithm claims, production workflow, and monetization framework (Jul 19 at 3:44 PM)
### Jul 20, 2026
4364 10:06a 🔵 YouTube Channel Growth Strategy Analysis Task Initiated
4365 " 🔵 yt-dlp Available in Project Environment
4367 " 🟣 VTT Subtitles Downloaded for All 30 @makemoneymatt Videos
4366 10:07a 🔵 Target Channel Identified: @makemoneymatt YouTube Channel
4368 10:08a 🟣 30 @makemoneymatt VTT Transcripts Cleaned and Converted to Plain Text
4369 " 🔵 Keyword Density Scan: "Pacing" Never Appears; "Hook" Most Frequent in Kgdms and xDx9
4370 10:09a 🔵 Matt Par's Core YouTube Video Structure: Hook, Three-Act, Re-Hook Every 60-90 Seconds
4371 " 🔵 Matt Par's "Niche Scorecard" and 7 Recommended YouTube Niches for 2026
4372 " 🔵 Matt Par's "Money Magnet Video" / Flywheel Pillar Strategy for Day-1 Monetization
4373 " 🔵 Matt Par's 3 Key 2026 YouTube Algorithm Changes and Practical Responses
4374 10:10a 🔵 YouTube Channel Shared: @makemoneymatt
4375 10:12a 🔵 @makemoneymatt Video Success Criteria: No Public Rubric Exists — It's Gated
4376 " 🔵 Matt Par (@makemoneymatt) Core Framework: Niche Scorecard + Money Magnet + Flywheel
4377 " 🔵 Matt Par AI Video Production Pipeline: Sponsor-Shaped 8-Step Workflow + Cost Table
S1023 Run outlier score scan on Byrddynasty competitor channel set — session just started, actively searching for the competitor list (Jul 20 at 10:13 AM)
4378 10:44a ✅ RETENTION-AND-HOOKS.md Updated: §7 Ideation Section Pointer Added
4379 " 🟣 §7 Ideation Section Added to RETENTION-AND-HOOKS.md and video-hooks-curiosity-gap.md
4380 10:46a ✅ Ideation Section Committed to jarvis Repo (commit 13de5d0)
S1025 Run outlier scan on 18 competitor YouTube channels to identify candidate video concepts (views ÷ subs ≥5×) (Jul 20 at 10:46 AM)
S1022 Write @makemoneymatt ideation techniques (outlier scoring + combination titling) into RETENTION-AND-HOOKS.md and the .claude rules surface — completed and pushed to origin/main (Jul 20 at 10:46 AM)
4381 12:15p 🔵 yt-dlp --flat-playlist Returns NA for view_count and channel_follower_count
4382 " 🔵 yt-dlp Full Metadata (No --flat-playlist) Returns View Count + Sub Count at ~1.9s/video
4383 12:26p 🟣 Outlier Scan Tooling Built and Running: scan.sh + analyze.py for 18 Competitor Channels
4384 " 🔴 Outlier Scan Progress: bycloudAI Only, 7 Rows — Scan Still Running
S1024 Run outlier scan on 18 competitor YouTube channels to identify candidate video concepts (views ÷ subs ≥5×) (Jul 20 at 12:26 PM)
4385 " 🔴 Outlier Scan Progress at ~4 Minutes: 4 of 18 Channels Done, No Errors
S1026 Run outlier scan on 18 competitor YouTube channels — waiting on remaining 14 channels to complete (Jul 20 at 12:28 PM)
4386 12:31p 🔵 Outlier Scan Complete: 16/18 Channels OK, @WelchLabsVideo and @AI-Search Return HTTP 404
4387 " 🔴 analyze.py Returned 0 Results Due to Missing TSV Files in Run Context
S1029 Outlier scan on 18 competitor channels — fully complete; tool shipped, playbook updated, 4 §7.2 fusion titles delivered (Jul 20 at 12:32 PM)
4388 12:45p 🔴 analyze.py Fixed: yt-dlp --print Emits Literal Backslash-t, Not Tab Characters
4389 " 🟣 Outlier Scan Results: 2 Candidates at ≥5×, Top Concepts Identified Across 17 Channels
4390 " 🔵 Recency-Filtered Outlier Analysis: Top Recent Concepts (2025+) Across 17 Competitor Channels
4391 12:46p 🟣 outlier-scan.py Promoted to Permanent Skill Tool in jarvis-video-production
4392 " ✅ RETENTION-AND-HOOKS.md §7.1 Updated: Threshold Recalibrated to 1.5×, Tool Reference and Two Warning Blocks Added
4393 " 🔵 outlier-scan.py Verified Working in Production Location: 6 Candidates at ≥1.5×, 366 Videos, 16 Channels
4394 12:47p ✅ RETENTION-AND-HOOKS.md §7.4 Added: "Register Beats Topic" — First-Run Strategic Finding
4395 " ✅ outlier-scan.py and Updated RETENTION-AND-HOOKS.md Staged for Git Commit
4396 " ✅ Committed to jarvis repo: outlier-scan tool + §7.1 recalibration (8cf5134)
S1028 Outlier scan on competitor channels — complete: results delivered, tool committed, §7.2 fusion candidates proposed to user (Jul 20 at 12:47 PM)
S1027 Outlier scan complete, analyzed, committed — full results + candidate §7.2 fusion titles delivered to user (Jul 20 at 12:48 PM)
**Investigated**: - 17 competitor channels, 486 videos total, 366 after 2025-01-01 recency floor
    - Per-channel median outlier scores in recent window
    - Register-level comparison (explainer/contrarian vs news/hype)
    - git commit 8cf5134 confirmed on origin/main

**Learned**: - Only 1 video in 366 clears ≥5×: Edan Meyer "The AI Scaling Problem" (12.25×, 985K views, 80K subs)
    - Threshold recalibrated from 5× → 1.5× for AI-explainer niche; 6 candidates at ≥1.5×
    - Age confound confirmed: unfiltered scan fills top 10 with 2019–2020 math videos (vcubingx) — recency floor required
    - Register beats topic: explainer/contrarian channels median 0.26–0.45×; AI news/hype channels median 0.03–0.19× (~15× gap)
    - "Negation not news" is the breakout pattern: every top performer is a limit, correction, or reversal
    - Canonical template shape: "AI can't cross this line and we don't know why" (Welch Labs, 2.75×, pre-cutoff) — hard limit + unexplained = paradox
    - 4 candidate §7.2 fusions proposed; strongest: "AI can't cross this line. Your brain crosses it every morning." (scaling ceiling × brain mechanism)
    - @AI-Search handle still unknown; @WelchLabs corrected and included

**Completed**: - Full scan: 17 channels, 486 videos, outliers.csv produced
    - analyze.py bug fixed (yt-dlp literal \\t delimiter)
    - outlier-scan.py written to .agents/skills/jarvis-video-production/tools/ with canonical CHANNELS, 1.5× threshold, 2025-01-01 floor, --refresh/--all flags
    - RETENTION-AND-HOOKS.md §7.1 updated: threshold 1.5×, CALIBRATION warning, AGE CONFOUND warning, run command
    - RETENTION-AND-HOOKS.md §7.4 added: register-beats-topic finding, breakout title table, "negation not news" pattern, template shape, caveats
    - RETENTION-AND-HOOKS.md §7.4 renumbered to §7.5 (provenance)
    - tools/.gitignore added (excludes raw/, outliers.csv, __pycache__)
    - Committed and pushed: 8cf5134 on origin/main
    - 4 §7.2 fusion title candidates presented to user

**Next Steps**: - User has received the ranked outlier results and 4 candidate fusion titles
    - Likely next: user selects a fusion concept; then GROUNDED research pass on the chosen concept before writing VO
    - Could also: add @AI-Search correct handle to the competitor set if user knows it
    - Could also: run §7.2 combination titling more formally — iterate on paradox test (§3) against the best candidate


Access 691k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>