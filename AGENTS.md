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

# [jarvis] recent context, 2026-06-17 1:01pm GMT+2

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (28,037t read) | 1,116,436t work | 97% savings

### Jun 16, 2026
1209 1:14p 🔵 Full Citation Details Confirmed via WebFetch + Additional Papers from Agent Sub-searches
1210 1:19p 🔵 Additional Sources Surfaced by Google Scholar Comprehensive Search Agent
1211 1:20p ✅ 2024–2026 Research Corpus Partially Retrieved to New Directory
1212 5:27p 🟣 Retrieved 2024–2026 Research Corpus Catalogued in EffectAI24-26 Directory
1213 " 🟣 RETRIEVED-PAPERS-ANALYSIS.md Created with Coverage Gap Assessment
1214 5:55p 🔵 HBR "Augmentation Over Automation" Article Fully Retrieved as Markdown — Not Actually Paywalled
1215 " ⚖️ Video Production Phase Initiated — First 5 Videos Authorized
1217 6:04p ⚖️ User Confirmed: Script Video 1 Next
1218 6:58p 🟣 First 5 Video Outlines Created: Research-Grounded AI & Work Series
1219 " ⚖️ Show Bible Framework Validated by 2026 Research
1220 6:59p 🔵 Jarvis Video Production Skill: Canonical 9-Step Workflow and Block Library
1221 7:01p 🟣 Video 1 Full Production Script Created: 7-Scene HyperFrames Blueprint
### Jun 17, 2026
1222 12:05a 🟣 Video 1 HyperFrames Project Directory Scaffolded
1223 " 🟣 Video 01 Command Center Scaffolded via scaffold-command-center.sh
1224 " 🔵 byrddynasty-blocks Library Missing from Expected Path
1225 12:06a 🟣 Video 01 EPISODE.md Command Center Populated with Production Details
1226 " ✅ Video 01 EPISODE.md Updated with Research Citations and Active Next Actions
1227 " 🟣 Scene 1 VO Script File Created at scenes/01-hook/vo-script.txt
1228 " 🔵 byrddynasty-blocks Library Found at jarvis-private, Not in Skill Directory
1229 12:07a 🔵 byrddynasty-blocks Full Inventory Confirmed: 20 Blocks Available
1230 " 🟣 Scene 1 (Hook) HyperFrames Composition Built and Written to Disk
1231 12:08a 🟣 Scene 1 hyperframes.json Created — Scene Package Complete
1232 " ✅ Scene 1 SCENE-NOTES.md Created with Known Limitations and Improvement Roadmap
1233 " 🟣 SCENE-STATUS.md Populated with All 7 Scenes and Production Queue
1234 12:19a ⚖️ Video Production Structure Corrected: HeyGen Avatar Bookends All Episodes
1235 12:20a 🔵 HeyGen Avatar Skill Found: skills/video-production/SKILL.md (Legacy Pipeline)
1236 " ⚖️ Full VO Script Recorded in HeyGen for All Segments — Avatar and Non-Avatar Alike
1237 " 🟣 Complete Production Script Written for Video 1: "The Choice No One's Making"
S466 Video 1 "Strategic Pivot" — complete production script package delivered; session at handoff point awaiting Terry's review before HeyGen recording (Jun 17 at 8:48 AM)
1238 8:50a 🟣 VO-ONLY.md Created for HeyGen Recording Session
S465 Video 1 production script package complete — COMPLETE-SCRIPT.md and VO-ONLY.md written and ready for HeyGen recording; awaiting Terry's review and approval (Jun 17 at 8:50 AM)
S467 Asset inventory and sourcing prep completed for Video 1 — existing clip library catalogued, Pexels search plan created, episode directories scaffolded, Terry handed off clear download priorities (Jun 17 at 8:51 AM)
1239 8:53a 🔵 Existing Video Clip Library Found at video-assets/clip-library/pixelvideos/ — 41 Clips Available
1240 8:54a 🟣 ASSET-INVENTORY.md Populated with Available and Required B-Roll Mapped to Segments
1241 8:55a 🟣 ASSET-INVENTORY.md Expanded with Company Assets, Data Visualizations, and Quote Cards Sections
1242 " 🟣 ASSET-INVENTORY.md Finalized with Pexels Search Plan, Coverage Summary, and Risk Assessment
1243 " 🟣 PEXELS-SEARCH-URLS.md Created — Ready-to-Use B-Roll Download Guide for Terry
1244 8:56a ✅ Episode Asset Directory Structure Created for Video 1
1245 " 🟣 ASSET-STATUS-SUMMARY.md Created — Human-Facing Production Handoff Document for Terry
1246 " ⚖️ Video 1 VO Revised: Runtime Extended, Segments 7-8 Updated, No "Series" Language, 1.5s Inter-Segment Pause
S468 Video 1 VO extension and revision: extend runtime from 7:50 to 10-12 minutes, update Segments 7 and 8, remove series language, change inter-segment silence to 1.5 seconds (Jun 17 at 8:56 AM)
1247 10:17a 🔴 VO-ONLY.md Content Additions Partially Missing: Only Segment 2 Expansion Persisted
S469 Video 1 VO-ONLY.md fully revised: runtime extended from 7:50 to ~11:40, four content expansions added, all inter-segment silences changed to 1.5 seconds, Segments 7 and 8 replaced with Terry's new text (Jun 17 at 10:17 AM)
S470 Terry reported missing VO content additions (Segments 3, 4, 5 expansions were absent despite prior edit confirmations) — re-applied all missing expansions and verified with grep (Jun 17 at 10:20 AM)
S471 VO-ONLY.md script fully verified and confirmed complete: all 4 content expansions present, 1.5s silences throughout, Segments 7 and 8 updated — script ready for HeyGen recording (Jun 17 at 10:33 AM)
S472 Video 1 Post-Production: HeyGen Recording Analysis, Segment Timing Extraction, and segment-timings.json Production (Jun 17 at 10:33 AM)
1248 11:12a 🔵 HeyGen Recording for Video 1 Completed and Delivered
1249 " 🔵 HeyGen Video 1 File Confirmed: 61MB, 706.7 Seconds (~11m 47s)
1250 " 🔵 ffmpeg silencedetect Detected 10 Silence Events — More Than the Expected 7 Inter-Segment Boundaries
1252 " 🟣 match-segments.py Created: Whisper Transcript → Segment Timing Extractor with Fuzzy Fallback
1251 11:13a 🔵 whisper-cli Tool Confirmed at /opt/homebrew/bin/whisper-cli — Transcription Launched as Background Task
1253 " 🔵 whisper-cli Transcript Lacks Word-Level Data: "words" Key Absent Despite -ml 1 Flag
1254 11:14a 🔵 whisper-cli Produces One-Word-Per-Segment Output with -ml 1 Flag; "Byrd" Transcribed as "Bird"
1255 " 🔴 match-segments-v2.py: Rewritten to Concatenate All Words Then Find Opener Phrase by Character Position
1256 " 🔵 match-segments-v2.py: Three Critical Bugs Found — Wrong Offset Units, Apostrophe Token Splitting, Out-of-Order Segment Matches
1257 " 🔴 segment-timings.json COMPLETE: 8-Segment Breakdown Manually Compiled from ffmpeg Silencedetect — Total 11m 46s
1258 " ⚖️ B-Roll Production Method Changed: Pexels Abandoned in Favor of AI-Generated Clips via Nana Banana Pro + Runway
1259 " 🔵 segment-timings.json Persistently Reverts to Broken Whisper Version — Dropbox Sync Conflict Suspected
S473 B-Roll Production Switch to Nana Banana Pro + Runway; segment-timings.json Re-verified and Confirmed Stable (Jun 17 at 11:16 AM)
S474 B-Roll AI Generation Prompts: Complete Nana Banana Pro + Runway Prompt Guide Created for All 15 Video 1 Clips (Jun 17 at 12:46 PM)
**Investigated**: - segment-timings.json read again (still reverting to broken 5-segment version) — written correctly a 4th time with Python verification confirming correct 8-segment data
    - Reviewed all 8 segments and their B-roll needs to design 15 clip prompts covering Segments 2-6

**Learned**: - segment-timings.json Dropbox reversion is a persistent recurring issue — every session must write the file before using it; the Python bash verification always shows correct data immediately after write, suggesting Dropbox syncs the old version back after ~seconds
    - B-roll for Segment 4 (Six-Phase Trajectories, 2m 48s) is by far the most clip-intensive: needs 12 unique clips (6 showing the Automation path trajectory, 6 showing the Augmentation path trajectory), one pair per phase
    - Fork in road clip is the most critical single asset — reused in both Segment 2 and Segment 6 to create visual bookending/callback

**Completed**: - NANA-BANANA-RUNWAY-PROMPTS.md created at: jarvis-private/video-production/strategic-pivot-launch/video-01-the-choice/NANA-BANANA-RUNWAY-PROMPTS.md
    - 15 B-roll clips documented with two prompts each (Nana Banana Pro image + Runway motion):
      * Clip 1: Fork in road aerial drone (CRITICAL — Segs 2 &amp; 6) → fork-road-drone.mp4
      * Clip 2: Office collaboration meeting → office-collaboration.mp4
      * Clip 3: Contemplative worker at desk → worker-contemplative.mp4
      * Clip 4: Retail store aisle dolly → retail-store-aisle.mp4
      * Clip 5: Store manager with tablet → manager-tablet-inventory.mp4
      * Clips 6A-6F: Automation path phases 1-6 (uncertain/empty office/overwhelmed/leaving/empty booth/leadership gap)
      * Clips 7A-7F: Augmentation path phases 1-6 (engaged/happy meeting/training/celebrating/busy booth/mentorship)
      * Clip 8: Microsoft campus exterior → microsoft-campus.mp4
      * Clip 9: Vibrant office environment → office-vibrant.mp4
    - All clips specify: 1920×1080, 10-15 second duration, photorealistic style, subtle cinematic camera movements
    - Production notes include color palette (Navy #0F172A, Cyan #00D4FF, Gold #FFD700), Runway settings, priority order, and file naming convention
    - segment-timings.json corrected for the 4th time and verified correct

**Next Steps**: Terry will generate B-roll clips in Nana Banana Pro → Runway (priority: fork-road-drone first, then 12 phase clips, then supporting). Suggested parallel work: begin HyperFrames data visualizations (survey charts, J-curves, phase timeline graphics) for Segments 2-6 — these don't depend on B-roll and can be built immediately while Terry generates clips. The offer was made at end of Claude's response.


Access 1116k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>