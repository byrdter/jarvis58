# Video 12 Visual Spec

Purpose: make the video feel like an engineering investigation using real screens, source proof, cursor/callout motion, and artifact inspection. Avoid generic circle-node diagrams except where the shot is explicitly a layered architecture map.

Asset convention:

- Stills: `video-12-mcp-token-stack/09-stills/NNN-description.png`
- Recordings: `video-12-mcp-token-stack/09-recordings/NNN-description.mp4`
- HeyGen source: `video-12-mcp-token-stack/10-videos/heygen-source.mp4`

## Segment-by-Segment Visual Plan

| Seg | Treatment | Visual foundation | Motion / annotation |
|---:|---|---|---|
| 1 | Avatar full-screen | HeyGen Avatar V | Lower-third title: "The 2026 Agent Token Stack" |
| 2 | Real-doc + token flood | Anthropic Advanced Tool Use screenshot, lines showing 55K/134K | Token meter fills red; cursor circles "before the conversation even starts" |
| 3 | Source zoom | Anthropic Tool Search screenshot, 77K -> 8.7K / 85% reduction | Split before/after meter; green compression wipe |
| 4 | Punch-card | Dark background, three large warning cards | Cards slam in: "Outputs still cost", "Workflows still copy data", "Search can miss" |
| 5 | Benchmark board | Anthropic accuracy rows + Arcade 4,027-tool results | Row highlights: 49->74, 79.5->88.1, then 56/64 stress-test bars |
| 6 | Avatar side-screen | Avatar V on right, animated stack on left | Four vertical layers: MCP, Skills, CLI, Code Execution |
| 7 | Browser source | Cloudflare Code Mode article hero + 1,000 tokens line | Browser chrome, scroll to headline, marker circle on "1,000 tokens" |
| 8 | Metric ticker | Cloudflare 1.17M -> 1K comparison | Huge counter drains from 1,170,000 to 1,000; "99.9%" stamp |
| 9 | Source proof | Anthropic Code Execution with MCP article, Google Drive/Salesforce example | Cursor traces Google Drive -> model -> Salesforce |
| 10 | Data-flow animation | Two-lane workflow: naive vs sandbox | Transcript blob passes through context twice, then stays inside `const transcript` |
| 11 | Metric ticker + code | `150,000 -> 2,000` with TypeScript wrapper snippet | Counter collapse; code lines reveal one by one |
| 12 | Docs inspection | Programmatic Tool Calling docs restriction | Zoom punch to "Tools provided by an MCP connector"; red underline |
| 13 | Avatar side-screen | Avatar V left, sandbox checklist right | Checklist: V8 isolate, no filesystem, no env vars, fetch disabled |
| 14 | Source/table | Bright Data tools docs, groups and `GROUPS=` / `TOOLS=` | Browser screenshot with group names highlighted, terminal config inset |
| 15 | Artifact inspection | Local skills folder screenshot / file tree | File-tree fly-through: skill.md opens; "procedure, not connector" badge |
| 16 | JARVIS artifact | Local video/remotion/heygen skill or Video 11 pipeline files | Cursor opens real files; callouts for path conventions |
| 17 | Benchmark comparison | Scalekit token table | Bars: 1,365 CLI vs 44,026 MCP; cost multiplier appears |
| 18 | Side-by-side | Left: local developer CLI; right: multi-tenant SaaS permission boundary | Wipe reveal; labels "acting as me" vs "acting for customers" |
| 19 | Output filtering | Messy scrape payload collapsing to three fields | JSON/markdown block shrinks; unused fields fade out |
| 20 | TOON caution | JSON vs TOON tabular example + warning badges | Tabular rows compress, nested object shakes and fails badge appears |
| 21 | Dense comparison table | Seven-row token-stack table | Reveal one row per beat; use large readable type, no tiny spreadsheet |
| 22 | Avatar side-screen | Avatar V right, four decision cards left | Cards light up with the rule: permission, procedure, deterministic, data movement |
| 23 | JARVIS architecture | Real local folder/file screenshots arranged as layers | Use actual path labels: wiki, skills, scripts, MCP, scheduled jobs |
| 24 | Measurement plan | Four-run experiment board | Columns fill: naive MCP, Tool Search, JARVIS stack, Code Execution |
| 25 | Migration phase 1 | Checklist over live `/mcp` or mocked terminal | Terminal tape with `mcp`, disconnect, scope groups |
| 26 | Migration phase 2 | File moves: CLAUDE.md -> skills, local script execution | Diff-style animation showing context file shrinking |
| 27 | Migration phase 3 | Sandbox diagram based on Cloudflare/Anthropic | Code enters sandbox; only final result exits |
| 28 | Mistakes | Three "bad take" cards shredded/replaced | Red cards flip to green corrected versions |
| 29 | Evidence wall | Mosaic of source screenshots | Camera pan across Cloudflare, Anthropic, Arcade, Scalekit, JARVIS |
| 30 | Graphics CTA | Channel CTA visual, no avatar | Subscribe button tap, like icon pulse, notification bell ring, next-video teaser |
| 31 | Avatar full-screen | HeyGen Avatar V | Minimal overlay: "Right layer. Right scope. Measured output." |
| 32 | Avatar full-screen | HeyGen Avatar V | Clean close; no extra CTA over face |

## Required Captures

Create these before Remotion implementation:

- `002-anthropic-schema-overhead.png`
- `003-anthropic-tool-search.png`
- `005-arcade-tool-search.png`
- `007-cloudflare-code-mode.png`
- `009-anthropic-code-exec-mcp.png`
- `012-programmatic-mcp-restriction.png`
- `014-brightdata-groups.png`
- `017-scalekit-cli-vs-mcp.png`
- `020-toon-arxiv.png`
- `023-jarvis-architecture-local.png`

## Shot-Type Guidance

Use these Remotion shot types as the base vocabulary:

- `ArtifactInspection` for docs, local files, and benchmark tables.
- `MetricTicker` for token numbers.
- `TerminalTape` for command-line sections.
- `CodeReveal` for code execution snippets.
- `SideBySide` for naive vs optimized comparisons.
- `ZoomPunch` for source-page callouts.
- `FileTree` for JARVIS local artifacts.
- `DiagramBuild` only for layered architecture, not generic circles.

## Readability Rules

- No body text under 42px at 1080p.
- Tables must reveal rows; do not show all rows at once in tiny type.
- Source screenshots should be cropped to the relevant claim, with URL/source badge.
- Cursor movement should be slow enough to follow, then the highlight should hold.
- Every source proof needs one clear visual verb: circle, underline, zoom, row flash, counter, or wipe.
