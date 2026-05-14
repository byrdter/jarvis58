# Video 11 Codex Pipeline Spec

This is the build spec for the Codex-produced version of Video 11. It is intentionally separate from the general script files so the final MP4 can be reproduced after the HeyGen source video is available.

Current source of truth:

- Voice and segment text: `02-heygen-vo/VO-MASTER.md`
- Paste blocks: `02-heygen-vo/HEYGEN-PASTE.txt`
- HeyGen export: `10-videos/heygen-source.mp4`
- Still images: `09-stills/`
- Remotion project: `03-remotion/`

The older `01-script/VIDEO-11-SCRIPT-V2.md` is useful context, but it is no longer exact: it still describes 30 segments and the old segment 27. The production build follows the 31-segment HeyGen VO plan.

## Production Runbook

### Inputs

The HeyGen export is:

```text
video-11-production-pipeline/10-videos/heygen-source.mp4
```

Current inspected metadata:

```text
1920x1080
25 fps
duration: 460.268 seconds
```

The current still-image inputs are:

```text
video-11-production-pipeline/09-stills/003-treadmill.png
video-11-production-pipeline/09-stills/003-assembly.png
```

Do not generate `seg-027-spotlight.png`. Segment 27 is now a Remotion diagram about selective automation, not an avatar spotlight image.

### Remotion Asset Wiring

Remotion should resolve assets without copying canonical files:

```bash
cd /Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/video-11-production-pipeline/03-remotion
mkdir -p public
ln -sfn ../../09-stills public/stills
ln -sfn ../../10-videos/heygen-source.mp4 public/heygen-source.mp4
```

Use these Remotion paths:

```ts
staticFile('heygen-source.mp4')
staticFile('stills/003-treadmill.png')
staticFile('stills/003-assembly.png')
```

### Timing Workflow

Detect segment starts from the one-second HeyGen pauses, then manually handle the continuous block I split:

- Blocks A, C, E, G are single visible-avatar blocks.
- Blocks B, D, F, H contain graphics-only segments separated by one-second pauses.
- Block I contains segments 29-31 as one continuous Avatar V take with no internal pause.

Expected alignment behavior:

- Silence detection should recover most boundaries for segments 1-28.
- Segment 29 starts at the beginning of block I.
- Segment 30 and 31 must be split by transcript phrase matching or proportional word timing inside block I:
  - Segment 29 starts at: "Before we wrap up..."
  - Segment 30 starts at: "Two things to take away..."
  - Segment 31 starts at: "And the third one..."

The Remotion `Main` composition should use measured timings, not the rough duration numbers in `video-11-segments.ts`.

### Build Commands

After `Main` exists:

```bash
cd /Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/video-11-production-pipeline/03-remotion
npm install --package-lock=false --ignore-scripts
npx tsc --noEmit
npx remotion preview src/index.ts
npx remotion render src/index.ts Main ../10-videos/video-11-codex.mp4
```

Render target:

```text
video-11-production-pipeline/10-videos/video-11-codex.mp4
```

Use `ShotDemo` only to inspect the shot vocabulary. The deliverable must be `Main`.

### Main Composition Rules

The `Main` composition should be table-driven:

```text
measured segment timing + shot spec -> renderShot(...)
```

Do not return to the older Video 8/9 pattern where `Main.tsx` contains a large per-video switch statement. The Video 11 architecture should keep the shot menu reusable.

Layering rules:

- Visible-avatar segments: use the HeyGen video as the foreground or side-view layer and render the supporting graphic in the remaining space.
- Graphics-only segments: hide the HeyGen video visually and use the HeyGen audio only.
- Block I: full-screen Avatar V remains primary; overlay only restrained takeaway graphics or lower-thirds if needed.
- Captions are optional in the first pass, but if added, they should come from word-level timing rather than hand-authored subtitles.

## Segment Creative Spec

| Seg | Avatar | Shot | Visual data and direction |
|---:|---|---|---|
| 001 | Avatar V FS | talking-head-full | Keep the avatar full-frame. Add a subtle lower-third or small title only: "Made in under an hour". Do not cover the face. |
| 002 | None | diagram-build | Three paths converge on one final video. Nodes: API Automation, Browser Automation, Manual + Pipeline, Final MP4. Use cost badges `$$$`, `$`, and `best balance`. This is a graphics-only hook immediately after the face intro. |
| 003 | None | side-by-side | Use `stills/003-treadmill.png` on left labeled "Manual workflow"; use `stills/003-assembly.png` on right labeled "Production pipeline". Animated divider wipe from left to right. |
| 004 | Avatar V side | diagram-build | Four-part stack: HeyGen, Remotion, HyperFrames, Claude Code + Codex. Avatar visible at side. Graphic should occupy the opposite two-thirds. |
| 005 | None | diagram-build | Core stack in center with optional connectors orbiting: Higgsfield, Nano Banana Pro, ElevenLabs, MCP servers. Keep these as satellites, not equal to the core pipeline. |
| 006 | None | diagram-build | Three forked paths from "Avatar work": HeyGen API, Browser automation, Manual HeyGen session. End state for all paths: `heygen-source.mp4`. |
| 007 | None | terminal-tape | Scripted API flow. Lines: create script segments, POST to HeyGen, poll render status, download MP4s. This can become a real capture later, but terminal tape is acceptable for the Codex first pass. |
| 008 | None | metric-ticker | Pricing comparison. Show API pricing as a cost ladder: Avatar III $1/min, Avatar IV $4/min, 4K Digital Twin $5/min. Add note: browser/manual Studio path uses subscription credits and is cheaper for this channel. |
| 009 | None | browser-playback | If no real HeyGen browser capture is available, render a browser frame placeholder showing the workflow: login, paste, generate, download. This is a credibility segment, so real capture should replace placeholder when possible. |
| 010 | None | side-by-side | API cost vs browser Studio cost. Left: API fees, reliable, scalable. Right: subscription credits, lower cost, UI fragility. The conclusion should visually favor Browser/Path B for budget creators. |
| 011 | None | browser-playback | Time-lapse concept for Path C: a HeyGen Studio session compressed into a few seconds. If real footage is absent, show a browser chrome plus step cards: Pick avatar, paste block, render, download. |
| 012 | None | code-reveal | Show the pause protocol as code/text: `<break time="1s"/>` creates scene boundaries. Add a waveform strip or boundary ticks underneath if practical. |
| 013 | None | browser-playback | Handoff moment. Prefer Finder/file-drop capture if available. Otherwise render a browser/file panel showing `heygen-source.mp4` moving into `10-videos/`. |
| 014 | Avatar V side | diagram-build | Three paths converge into `10-videos/heygen-source.mp4`, then arrow to Remotion. This is a baton-handoff moment: "Now Remotion takes the ball." |
| 015 | None | diagram-build | Five-stage overview: Transcribe, Plan, Generate, Compose, Render. Large numbered icons, fast reveal. |
| 016 | None | terminal-tape | Stage 1. Show transcript JSON/word timestamps and detected gaps. Lines should feel real: words, timestamps, `gap >= 1.0s -> boundary`. |
| 017 | None | diagram-build | AI director maps script to visuals. Nodes: script, transcript, shot menu, segment plan. Edges converge into `Main composition`. |
| 018 | None | browser-playback | Visual-generation factory. If no HyperFrames capture exists, render a browser frame with preview pane and animated title-card placeholder. |
| 019 | None | file-tree | Real Remotion structure. Show `03-remotion/src`, `shot-types/`, `Main.tsx`, `video-11-segments.ts`, `Root.tsx`. This must communicate "Remotion is React". |
| 020 | None | code-reveal | Code-driven transitions and captions. Show a small TSX snippet with transition/caption data, then a preview panel. |
| 021 | None | terminal-tape | Render command. Lines: `npx remotion render src/index.ts Main ../10-videos/video-11-codex.mp4`, bundle, render frames, output MP4. |
| 022 | Avatar V side | diagram-build | QA loop. Nodes: rendered MP4, watch/inspect, detect defects, pass/fix list. Green done branch and amber fix branch. |
| 023 | None | diagram-build | Short bridge: "Which path?" Three doors/cards: A, B, C. Keep minimal because segment is short. |
| 024 | None | diagram-build | Decision tree for volume. Question: `10+ videos/month?` Yes -> Path A. Highlight Path A only. |
| 025 | None | diagram-build | Decision tree for budget. Question: `Every dollar counts?` Yes -> Path B. Include `zero marginal API cost` language. |
| 026 | None | metric-ticker | Path C formula. Count up `20 min manual + 40 min automated = 60 min total`. This is the channel's default path. |
| 027 | None | diagram-build | Selective automation diagram. Left warm zone: Human judgment, avatar take, read, pacing, tone. Right cyan zone: Automation, graphics, transitions, captions, render. Add a glowing handoff line between zones. |
| 028 | None | diagram-build | Framework recap. Three horizontal cards: match path to bottleneck, do not automate what does not need it, do not overpay for what the browser can drive. |
| 029 | Avatar V FS | talking-head-full | CTA. Full-screen avatar. Add only a restrained subscribe/like/bell lower-third if it does not distract. |
| 030 | Avatar V FS | talking-head-full | Takeaways 1 and 2. Full-screen avatar remains primary. Optional two small takeaway cards can slide in at side/lower third. |
| 031 | Avatar V FS | talking-head-full | Takeaway 3 and send-off. Full-screen avatar. Optional waveform card for "pause protocol" and final text: "Build it once. Ship weekly." |

## Required Remotion Mapping Updates

The current `03-remotion/src/video-11-segments.ts` still reflects the older 30-segment plan. Update it before building `Main`:

- Segment 002: avatar should be `NONE`, not `FS`.
- Segment 003: avatar should be `NONE`, not `PIP-BR`.
- Segments 005-013: avatar should be `NONE`.
- Segments 015-21: avatar should be `NONE`.
- Segments 023-28: avatar should be `NONE`.
- Segment 027: shot should be `diagram-build`, not `zoom-punch`.
- Add segment 029 as CTA, full-screen avatar.
- Renumber old 029 -> 030 and old 030 -> 031.

Avatar V visible blocks:

```text
A: 001 full-screen
C: 004 side
E: 014 side
G: 022 side
I: 029-031 full-screen continuous
```

Graphics-only blocks:

```text
B: 002-003
D: 005-013
F: 015-021
H: 023-028
```

## Capture Priority

For the Codex version, the first render may use scripted placeholders, but these are the credibility shots worth replacing with real captures:

| Segment | Preferred real capture |
|---:|---|
| 009 | HeyGen browser automation sequence, sped up |
| 011 | Real Path C HeyGen Studio session, time-lapsed |
| 019 | VS Code showing the actual Remotion `src/` tree |
| 021 | Real `remotion render` terminal output |

If time is limited, prioritize segments 019 and 021 first because they prove the Remotion pipeline exists and runs. Segments 009 and 011 are stronger with real HeyGen footage, but placeholders can carry the explanation temporarily.

## Acceptance Bar For The Codex MP4

The Codex output is acceptable when:

- The rendered MP4 uses the real HeyGen audio/video source.
- All 31 segments are represented in order.
- Graphics-only segments do not show the hidden Avatar III scenes.
- Visible Avatar V segments are not covered by busy graphics.
- Segment 3 uses the two real stills from `09-stills/`.
- Segment 27 uses the selective-automation diagram, not a spotlight image.
- Render output lands at `10-videos/video-11-codex.mp4`.
- TypeScript passes and at least one still frame from `Main` renders successfully before the full render.
