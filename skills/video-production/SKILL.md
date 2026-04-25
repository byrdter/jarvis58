# Video Production Skill — Byrddynasty Automated Pipeline

**Purpose:** Take a HeyGen render with 1-second silences between scenes and automatically produce a finished Byrddynasty video with multi-tool visual variety — Remotion, HyperFrames, Motion Canvas, ExcaliMotion, VHS terminal recordings, Playwright browser captures, and Nano Banana Pro stills — composed against a talking-head avatar that moves around the frame deliberately for visual rhythm.

**Status:**
- Stages 1–2 (segmentation + transcription) coded in `video-pipeline/scripts/`
- Stages 3–6 (director, renderer split, PiP composer, assembly) **not yet built** — design locked, implementation pending
- Director will live as HTTP endpoints in `agent-sdk` (so video builds can be triggered remotely via Phase 10 Telegram terminal)

**Canonical design memory:** `~/.claude/projects/-Users-terrybyrd-Library-CloudStorage-Dropbox-jarvis/memory/project_video_automation_design.md` — read that for the full background; this skill is the actionable distillation.

---

## When to use this skill

Read this skill at the start of any task involving:
- Producing a Byrddynasty long-form video
- Building, modifying, or debugging the `video-pipeline/` automation
- Adding a new visual treatment tool
- Writing prompts or selection logic for the director
- Changing the talking-head composition modes

Do NOT use this skill for:
- Short-form 9:16 standalone content → use the local `make-a-video` / `short-form-video` HyperFrames skills directly
- Channel branding, thumbnails, or YouTube package authoring → that's a separate concern from production

---

## Input contract — the spine

The pipeline starts from a single HeyGen render. To make automation possible, the HeyGen file MUST conform to this contract:

### Recording rules

1. **Voiceover is continuous** across the whole video — no fade-outs between scenes.
2. **Exactly 1 second of silence between every scene.** This is the segmentation marker. Without it the pipeline cannot recover boundaries automatically.
3. **Avatar appears in some scenes, not others** — that's fine. Some segments are voiceover-only (those become Remotion / HyperFrames / Motion Canvas / ExcaliMotion / VHS / Playwright / still backgrounds). Others have the talking head and get composed via PiP.
4. **No Nano Banana stills embedded in HeyGen** — stills are inserted by automation from a per-video manifest (Option B). Leave those segments as voiceover-only.
5. **Avatar background is whatever HeyGen renders by default** — no green-screen requirement. The PiP composer crops the avatar to a circle or rounded square; the framing handles separation.

### What the pipeline derives from this input

```
HeyGen render (.mp4)
   │
   ├─► [1] segment-timings.json    via ffmpeg silencedetect
   ├─► [2] transcript.json (word-level)  via AssemblyAI Universal-2
   └─► (used directly for avatar PiP extraction in stage 5)
```

### Segmentation command (stage 1)

```bash
ffmpeg -i raw-heygen.mp4 -af silencedetect=n=-50dB:d=1.0 -f null - 2>&1 | grep silence
```

The `video-pipeline/scripts/auto-edit.sh` wrapper is the canonical entry point for this stage in production runs.

### Transcription (stage 2)

```bash
bun run video-pipeline/scripts/transcribe.ts <segments-tightened.mp4> <out-dir>
```

Outputs `transcript.json` with word-level timestamps in whisper.cpp shape. AssemblyAI Universal-2 costs ~$0.08 for a 12-minute video.

---

## Tool palette — variety is the goal

The director picks one tool per voiceover-only segment. Each tool produces a visually distinct treatment so the finished video has rhythm and surprise.

| Tool | Best for | Where it lives |
|---|---|---|
| **Remotion** | Title cards, bullet lists, stats dashboards, text-heavy slides, video compositing, `createTikTokStyleCaptions` | `Byrddynasty-Videos/<ep>/remotion-project/` |
| **HyperFrames** | Audio-reactive scenes, animated text highlighting (sweeps / scribbles / hand-drawn circles / burst lines), scene transitions, 9:16 short-form variants for repurposing | Global skills (`~/.agents/skills/hyperframes*`, `gsap`, `website-to-hyperframes`) + Nate Herk student kit at `hyperframes-experiments/hyperframes-student-kit/` |
| **Motion Canvas** | Diagrams, network graphs, sequential builds with particle flow, code displays with syntax highlighting, transformation flows (A → B → C), math/LaTeX | `Byrddynasty-Videos/<ep>/motion-canvas-project/` |
| **ExcaliMotion** | Hand-drawn / sketched-feel diagrams, "draws itself in" reveals, animations sourced from existing Excalidraw `.excalidraw` files | Used in Video 7 production; render via the `excalidraw-diagram` local skill (Playwright-backed) + animation pass |
| **VHS** (Charm) | Real terminal sessions — `claude` running, scripts executing, JARVIS in action, recorded as scripted `.tape` files producing MP4 or GIF | Install: `brew install vhs`. Scripts checked into the project's `07-vhs/` bin |
| **Playwright + Claude** | Browser captures — real websites, dashboards, GitHub UI, live app demos, scrolling reveals, click sequences | Available via the `excalidraw-diagram` skill's Playwright; generally usable for any URL |
| **Nano Banana Pro stills** | Static images, a few per video, brand-consistent illustrations — the only static treatment in the mix | Image generator + per-video `stills-manifest.json` |

### Tool selection logic — pure content-driven

The director picks per segment based on voiceover content. **No hard tool budgets.** Variety emerges from the content being varied, not from quotas.

Routing heuristics (the director prompt encodes these):

| Voiceover signal | Route to |
|---|---|
| "as you can see in the diagram", "this loop", "the architecture" | ExcaliMotion or Motion Canvas |
| "watch this run", "let's run it", "in my terminal", "here's the command" | VHS |
| "the website", "the dashboard", "the UI", "go to GitHub", "this app" | Playwright capture |
| "key takeaways", "three things", "the numbers", "X percent" | Remotion (bullets / stats) |
| "from X to Y", "transitions to", "becomes", "evolves into" | Motion Canvas transformation flow |
| "this is exciting", "the moment", emphasis-heavy lines | HyperFrames audio-reactive emphasis |
| Reflective / philosophical / "the big picture" | Nano Banana still (per stills-manifest) with Ken Burns |

When the segment doesn't match any signal, default to **Remotion** for text-driven content or **Motion Canvas** for explanation-driven content.

---

## Talking-head composition modes

The avatar is **not** restricted to intro/outro full-screen plus a static bottom-right PiP. It moves around the frame deliberately.

### The 8 modes

| # | Mode | Description | When to use |
|---|---|---|---|
| 1 | **Full screen** | Avatar fills 1920×1080, no overlay graphics | Intro, outro, hero moments, direct emotional beats |
| 2 | **Center stage with orbiting graphics** | Avatar front-and-center; motion graphics enter from edges and animate around them as they speak | Explaining a concept where the avatar IS the focal point. **Requires Path B (AI matting) for clean background removal — see PiP composition below.** |
| 3 | **Bottom-right PiP, square** | 20% width, sharp rounded corners, drop shadow | Default narrator-over-visuals mode |
| 4 | **Bottom-right PiP, circle** | 20% width, circular crop | Personal / conversational beats |
| 5 | **Bottom-left PiP, square** | Mirror of #3 | When important graphic / text content is on the right |
| 6 | **Bottom-left PiP, circle** | Mirror of #4 | Same as #5 but friendlier |
| 7 | **Side-shifted left (1/3 left, 2/3 right)** | Avatar holds left third; graphic fills right two-thirds | Graphic enters from the right; avatar "presents" it leftward |
| 8 | **Side-shifted right (2/3 left, 1/3 right)** | Mirror — graphic on left, avatar on right | Graphic enters from the left |

### Position selection logic

The director picks a composition mode per segment based on:

1. **Reading order** — English LTR, eyes scan left to right, so important graphics often go right while avatar holds left.
2. **Entry direction** — If the segment's graphic slides in from the right, avatar shifts left (and vice versa) to avoid collision.
3. **Reference direction** — If avatar gestures or refers to "this" / "here" / "look at this", the graphic appears on the side they reference.
4. **Variety budget** — No single position holds for more than ~3 consecutive segments. Rotate to keep visual rhythm. (The director enforces this even though tool selection is content-driven — composition rotation is a soft variety lever, not tool quotas.)
5. **Tool constraints** — Mode #2 (center stage) requires the avatar be cleanly extracted, which costs more (see Path B below). Use sparingly: only when the segment genuinely benefits from graphics flowing behind the avatar.

### Avatar PiP specs (modes 3–8)

- **Width:** 20% of canvas (~384px at 1080p) for corner PiPs (3–6); ~33% for side-shifted (7–8)
- **Padding from edges:** 20px (corner PiPs)
- **Border:** 2px cyan `#00D4FF` (optional but consistent with brand)
- **Shadow:** subtle drop shadow for separation from underlying graphic
- **Safe zone:** keep important graphic content in the 80% of frame *not* covered by the avatar PiP (or the empty 2/3 in side-shifted modes)

---

## Static images — Nano Banana Pro (Option B, manifest-driven)

A few static stills appear in every video for variety against the motion-heavy tool mix. Stills are **not** embedded in the HeyGen render — they are inserted by the pipeline from a per-video manifest.

### Manifest format — `stills-manifest.json`

```json
{
  "segment_006": {
    "image_path": "stills/markets-overview.png",
    "ken_burns": {
      "start_box": [0.0, 0.0, 1.0, 1.0],
      "end_box":   [0.15, 0.10, 0.85, 0.90],
      "easing": "ease-in-out"
    },
    "talking_head_mode": "side_shifted_right"
  },
  "segment_014": {
    "image_path": "stills/dashboard-mockup.png",
    "ken_burns": {
      "start_box": [0.10, 0.0, 1.0, 0.85],
      "end_box":   [0.0, 0.15, 0.90, 1.0],
      "easing": "linear"
    },
    "talking_head_mode": "full_screen"
  }
}
```

- `start_box` / `end_box` are normalized [x1, y1, x2, y2] crop rectangles for Ken Burns pan-and-zoom. `[0,0,1,1]` is "no zoom, full frame."
- `talking_head_mode` lets a still be paired with any composition mode — including full screen (still becomes the entire scene, no avatar) or side-shifted (avatar on one side, still Ken-Burnsing on the other).

The director consults this manifest first; segments listed here bypass tool selection and route directly to the stills renderer.

---

## Pipeline architecture

```
HeyGen render (.mp4 with 1s silences, no embedded stills)
        │
        ▼
[1] ffmpeg silencedetect          ──►  segment-timings.json
        │                                      │
        ▼                                      ▼
[2] AssemblyAI Universal-2        ──►  transcript.json (word-level)
    on HeyGen audio
        │                                      │
        └──────┬───────────────────────────────┘
               ▼
[3] Director  (HTTP endpoint in agent-sdk)
    Inputs:  segment-timings.json
             transcript.json
             stills-manifest.json (per-video)
             channel-style.md (visual library + brand)
    Output:  plan.json
             [{segment, start, end, tool, treatment, talking_head_mode, payload}]
        │
        ▼
[4] Renderer split (parallel where possible):
        • Remotion          → bg.mp4 per segment
        • HyperFrames       → bg.mp4 per segment
        • Motion Canvas     → bg.mp4 per segment
        • ExcaliMotion      → bg.mp4 per segment
        • VHS               → bg.mp4 per segment
        • Playwright        → bg.mp4 per segment
        • Stills + Ken Burns → bg.mp4 per segment
        │
        ▼
[5] PiP composer
    Per segment:
      - If talking_head_mode == "full_screen" → use HeyGen segment as-is (no bg overlay)
      - Else: composite avatar (cropped/masked per mode) onto the bg.mp4 from stage 4
        • Path A (modes 3–8): circle/rounded-square crop with border + shadow
        • Path B (mode 2 only): AI matting (RVM / MediaPipe / BackgroundMattingV2) for true cutout
        │
        ▼
[6] Caption burn-in + assembly
    Captions: HyperFrames karaoke OR Remotion createTikTokStyleCaptions, driven by transcript.json
    Concat:   ffmpeg concat with audio normalization to -14 LUFS
        │
        ▼
final-video.mp4
```

### PiP composition — Path A (default)

Used for talking-head modes 3–8 (every PiP and side-shifted mode). The HeyGen avatar comes with its background; we crop to a circle or rounded square and frame it. The frame's border + shadow does the visual separation. Implementation: ffmpeg with an alpha-mask PNG or `geq` filter for the circle case; rounded-rect via `crop` + alpha overlay.

**Cost:** near-zero, fully ffmpeg-local.

### PiP composition — Path B (center-stage only)

Used **only** for talking-head mode 2 (center stage with orbiting graphics) where graphics need to flow behind the avatar without showing the HeyGen background. Run an AI matting pass per segment to extract the avatar with a clean alpha channel.

Candidate models: RVM (Robust Video Matting), MediaPipe Selfie Segmentation, BackgroundMattingV2.

**Cost:** GPU/CPU pass per center-stage segment. Reserve mode 2 for genuinely-justified uses to keep cost low.

### Director hosts in agent-sdk

The director is **not** a standalone CLI. It runs as HTTP endpoints on the existing `agent-sdk` server (port 3000):

- `POST /video/plan` — body: paths to segment-timings + transcript + stills-manifest. Returns plan.json.
- `POST /video/build` — body: video id + paths. Triggers full pipeline. Long-running; return 202 immediately, write status to DB.
- `GET /video/status/:id` — current build state.

Long-running renders use the same subprocess pattern as the drafter: Bun `idleTimeout` ≥ 255s; check status via DB rather than polling HTTP. Auth piggybacks on whatever Phase 10 (Telegram terminal) establishes — meaning a Telegram message like `/build-video ep-08` is the eventual remote trigger.

---

## Bin convention — canonical directory layout

Every video project follows this structure (proven in Video 7 manual production, formalized for automation):

```
Byrddynasty-Videos/<episode>/
├── 01-script/                  # script.md, voiceover-prompt.md, stills-manifest.json
├── 02-heygen/                  # raw-heygen.mp4 + any HeyGen scratch files
├── 03-remotion/                # Remotion project + per-segment MP4 outputs
├── 04-hyperframes/             # HyperFrames project + per-segment MP4 outputs
├── 05-motioncanvas/            # Motion Canvas project + per-segment MP4 outputs
├── 06-diagrams/                # ExcaliMotion .excalidraw sources + animated MP4s
├── 07-vhs/                     # .tape scripts + recorded MP4/GIF outputs
├── 08-playwright/              # browser-capture scripts + recorded MP4 outputs
├── 09-stills/                  # Nano Banana PNGs referenced by stills-manifest.json
└── 10-output/
    ├── segment-timings.json
    ├── transcript.json
    ├── plan.json
    ├── per-segment-final/      # post-PiP composite, per segment
    ├── captions.mp4
    └── final-video.mp4
```

The director's plan.json points at exact paths in `03–09/` for renderer outputs and at `02-heygen/` for the avatar source.

---

## Quality bar — push Remotion and HyperFrames to their limits

When the director picks Remotion or HyperFrames, the ceiling should be high. Default to "advanced compositions, not beginner templates."

The director prompt encodes this bias:

- **Data segments** — not just bar charts. Animated reveals with axis-build, value-counting, emphasis pulses, color-coded zones.
- **Diagram segments** — not just static nodes. Sequential builds, particle flow on connections, glow on the active node, depth/parallax.
- **Title cards** — not just text-fade-in. Layered entrances with stagger, depth, motion blur, particle accents.
- **Audio-reactive moments** — genuine beat-synced motion, not decorative pulses. Use the HyperFrames audio-reactive primitives.
- **Transitions between segments** — leverage HyperFrames scene transitions (crossfades, wipes, reveals, shader transitions) rather than hard cuts.

Mastery references to keep on hand (work-in-progress — pin in `video-pipeline/director/references/`):

- **Remotion docs** (`https://www.remotion.dev/docs`) — animations, spring physics, sequence/timeline, video compositing, `<Sequence>`, `<Audio>`, dynamic durations, transitions, server-side rendering, `createTikTokStyleCaptions`
- **HyperFrames + GSAP** local skills (`~/.agents/skills/hyperframes*`, `gsap`, `website-to-hyperframes`) — audit these for advanced-technique coverage; particularly audio-reactive scenes, scene transitions, animated text highlighting, face-mode 4-layer scaffold
- **Nate Herk YouTube videos** (URLs to be re-captured) — already the source for HyperFrames + Remotion automation patterns. Two videos watched as reference; the `hyperframes-student-kit` repo is his companion code.
- **Search terms for ceiling-pushers**: "Remotion advanced animation", "Remotion timeline composition", "Remotion product demo", "HyperFrames audio reactive", "HyperFrames advanced techniques", "Remotion vs After Effects"
- Save findings to `video-pipeline/director/references/youtube-references.md` with title + URL + 2-3 line technique note.

---

## Brand and animation defaults

### Colors (Byrddynasty)

- Background dark navy `#0F172A`
- Primary cyan `#00D4FF`
- Secondary gold `#FFD700`
- Success green `#00FF88`
- Warning orange `#FF6B35`
- Error red `#FF3333`
- Text white `#FFFFFF`

### Animation timing

- **Entrance:** 0.8–1.2s
- **Hold:** remainder of segment
- **Exit:** 0.5s
- **Sequential delays:** 0.2–0.4s between items
- **Spring physics** for natural feel; ease-out for entrances; ease-in for exits

### Typography (text-heavy treatments)

- Main titles 100–156px
- Subtitles 56–72px
- Body text 48–72px
- Supporting text 36–52px
- Minimum readable on mobile: 48px

---

## Reference repos cloned to disk

| Repo | Path | Origin |
|---|---|---|
| HyperFrames student kit (Nate Herk) | `hyperframes-experiments/hyperframes-student-kit/` | `nateherkai/hyperframes-student-kit` |
| Long-form video generator | `repos/VIDEO-GENERATOR_FOUNDATIONS/` | `byrdter/VIDEO-GENERATOR_FOUNDATIONS` |
| Long-form video generator (sister) | `repos/LONGFORM-VIDEO-GENERATOR/` | `byrdter/LONGFORM-VIDEO-GENERATOR` |

The two `VIDEO-GENERATOR_*` repos are documentary-style stills-and-Ken-Burns generators (Edge TTS + Gemini) — useful as reference for the stills + Ken Burns path in stage 4 and for the long-form orchestration pattern.

---

## Current implementation status (2026-04-25)

| Stage | Status | Where |
|---|---|---|
| 1 — Segmentation | ✅ Working | `video-pipeline/scripts/auto-edit.sh` |
| 2 — Transcription | ✅ Working | `video-pipeline/scripts/transcribe.ts` |
| 3 — Director | ❌ Not built | Will live as HTTP endpoint in `agent-sdk` |
| 4 — Renderer split | ⚠️ Partial — Remotion / Motion Canvas projects exist per-video; no per-tool dispatcher yet | `Byrddynasty-Videos/<ep>/` |
| 5 — PiP composer | ❌ Not built | Path A is ffmpeg-only (small); Path B needs matting model selection |
| 6 — Caption + assembly | ❌ Not built | Captions via HyperFrames or Remotion `createTikTokStyleCaptions`; concat via ffmpeg |

**Adjacent:** `AUTOMATED-VIDEO-PIPELINE-PLAN.md` (project root) describes a parallel "raw take" input mode (you record yourself talking to camera, no HeyGen). That mode shares stages 2–6 with this skill — only stage 1's input differs. Treat it as an alternate entry point, not a replacement.

---

## Quick reference — common commands

### Smoke-test stages 1–2 on any MP4

```bash
cd /Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis/video-pipeline

./scripts/auto-edit.sh /path/to/heygen-render.mp4 projects/<ep>
bun run scripts/transcribe.ts projects/<ep>/tight.mp4 projects/<ep>
```

### Verify ffmpeg silence detection on a HeyGen render

```bash
ffmpeg -i raw-heygen.mp4 -af silencedetect=n=-50dB:d=1.0 -f null - 2>&1 | grep silence_end
```

If fewer silences are reported than expected scenes, the 1-second-silence rule wasn't followed during HeyGen authoring. Re-author HeyGen with proper gaps before running the pipeline.

### Render a single Remotion segment

```bash
cd Byrddynasty-Videos/<ep>/03-remotion
npx remotion render Main out/segment_004.mp4 --props='{"segmentId":"004"}'
```

### Render a VHS terminal recording

```bash
cd Byrddynasty-Videos/<ep>/07-vhs
vhs segment_011.tape  # produces segment_011.mp4 next to the .tape file
```

### Final assembly (manual fallback while stage 6 is unbuilt)

```bash
cd Byrddynasty-Videos/<ep>/10-output/per-segment-final
ls *.mp4 | sort | sed "s/^/file '/;s/$/'/" > segments.txt
ffmpeg -f concat -safe 0 -i segments.txt -c copy ../final-video.mp4
```

---

## Build order for the missing stages

When you come back to build stages 3–6, do them in this order — each unblocks the next and gives a usable end-to-end pipeline at every step:

1. **Director (stage 3) — minimum viable.** HTTP endpoint in `agent-sdk` that takes timings + transcript and returns plan.json with content-driven tool selection. Start with conservative routing (default to Remotion / Motion Canvas); add HyperFrames / VHS / Playwright / ExcaliMotion routing as the prompt matures.
2. **Renderer dispatcher (stage 4) — start with Remotion + Motion Canvas only.** Read plan.json, render each segment to its bin path. Stub the other tools (skip + log) so you can run end-to-end before all tools are wired.
3. **PiP composer Path A (stage 5).** ffmpeg-only — circle / rounded-square crop, mode 3 only first, then add modes 4–8.
4. **Assembly + captions (stage 6).** Concat + caption burn-in. At this point you have a working pipeline producing finished videos with two tools and one composition mode — already a huge improvement.
5. **Add HyperFrames routing + remaining composition modes** incrementally.
6. **Add VHS, Playwright, ExcaliMotion routing.**
7. **Add Path B matting** for center-stage mode (only when content demands it).

Don't try to build all six stages with all seven tools and all eight composition modes before shipping anything. Walk it in.
