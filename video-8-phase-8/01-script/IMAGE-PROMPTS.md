# Video 8 — Static Image Prompts (for Nano Banana Pro)

**Episode:** JARVIS Video 8 — Phase 8: The Second Brain Gets Sharper
**Purpose:** 6 static images to be generated and baked into the HeyGen recording at the matching segment boundaries.
**Workflow:** generate each PNG, save to `09-stills/segment-NNN.png`, then bake into HeyGen at the corresponding segment timestamps. After HeyGen renders, hand the MP4 to Claude to produce `segment-timings.json` + the Remotion production prompt for CC Desktop.

**Brand colors (Byrddynasty):**
- Background dark navy: `#0F172A`
- Primary cyan: `#00D4FF`
- Secondary gold: `#FFD700`
- Success green: `#00FF88`
- Text white: `#FFFFFF`

**All images:** 1920×1080 landscape, full-bleed.

---

## Segment 002 — Phase 7 self-improvement loop (recap)

**Output:** `09-stills/segment-002.png`
**Composition:** image is full-frame; HeyGen avatar BR-C circle PiP overlays it.

```
A clean tech infographic on a dark navy (#0F172A) background, 1920×1080 landscape, with a faint blueprint grid (cyan, 4% opacity, 60px squares) behind everything.

Title at the top center: "PHASE 7 — SELF-IMPROVEMENT LOOP" in bold white sans-serif (Montserrat-style), 56pt, with a thin 4px cyan (#00D4FF) accent line beneath it spanning ~400px.

A circular four-node loop dominates the center of the frame, ~700px diameter. Four nodes equally spaced (top, right, bottom, left), each consisting of:
- A 110px diameter colored circle holding an icon glyph
- A bold 32pt white label below the circle
- A 22pt muted-white sub-label one line below

Nodes (clockwise from top):
1. WATCH — top. Cyan eye-icon in cyan ring. Sub-label: "monitors wikis"
2. NOTICE — right. Yellow warning-triangle icon. Sub-label: "stale page · broken link · missing topic"
3. DRAFT — bottom. Gold (#FFD700) pencil-on-document icon. Sub-label: "claude subprocess writes the fix"
4. APPROVE — left. Cyan checkmark icon in cyan ring. Sub-label: "human reviews · wiki updates"

Curved cyan arrows (8px stroke, with subtle 12px-blur glow) connect each node to the next, going clockwise. Tiny dot-particles trail along each arrow, suggesting flow.

Center of the loop: a stylized brain glyph in cyan (192px), with a soft pulse-glow halo.

Bottom of frame, centered, muted cyan 24pt monospace: "running for 6 weeks · 100% reviewed · the baseline"

Lower-right corner: small "BYRDDYNASTY" channel watermark in 18pt muted cyan.

Style: polished tech infographic — Stripe / Vercel / Anthropic architecture-diagram aesthetic. Crisp lines, generous whitespace, professional. NO photo-realistic textures.
```

---

## Segment 013 — Wiki graph after Phase 8

**Output:** `09-stills/segment-013.png`
**Composition:** FS-G (no avatar). Image fills the full frame.

```
A network graph visualization on dark navy (#0F172A) background, 1920×1080 landscape. Subtle 60px-grid pattern (cyan, 3% opacity).

Title in upper-left: "THE WIKI GRAPH — AFTER PHASE 8" in white 48pt Montserrat. Subtitle directly below in cyan (#00D4FF) 28pt: "~3 weeks of cross-wiki bridges"

Four distinct node clusters distributed across the canvas with clear separation:
- INVESTMENTS — upper-left quadrant, 8 nodes in a tight cluster, cluster label in gold (#FFD700) 32pt above the cluster
- AI FILMMAKING — upper-right, 7 nodes, label in cyan 32pt
- OPERATIONS — lower-left, 6 nodes, label in white 32pt
- CLAUDE CODE — lower-right, 9 nodes, label in pale cyan 32pt

Each node: 24px circle, white fill, 2px cyan border. Inside-cluster edges: thin white lines (2px, 60% opacity), forming dense webbing inside each cluster.

THE HERO — 15 cross-cluster bridges: bright cyan lines (4px stroke) with strong glow haze (24px blur at 50% opacity), connecting nodes across cluster boundaries. Each bridge has a small floating tag-label at its midpoint, monospace white 14pt:
- "constraint-driven"
- "context windows"
- "position sizing"
- "subprocess pattern"
- "review queues"
- "stage detection"
- "confidence scoring"
- "promotion rules"
- (additional bridges without labels for visual density)

Bottom-right corner: stat block in light gray 22pt monospace, three lines:
"15 bridges"
"4 wikis"
"0 manual"

Lower-left corner: small "BYRDDYNASTY" watermark in 18pt muted cyan.

Style: clean network-graph aesthetic — Neo4j Bloom or Obsidian graph view, polished. The cyan bridges should feel ALIVE against the navy background. NO 3D, NO photo-textures.
```

---

## Segment 018 — Architecture diagram

**Output:** `09-stills/segment-018.png`
**Composition:** SR — image holds left 2/3; avatar on the right third.

```
A clean software-architecture diagram on dark navy (#0F172A) background, 1920×1080 landscape, with a faint blueprint-grid pattern (cyan, 3% opacity).

Most content occupies the LEFT TWO-THIRDS of the frame (right third left empty for avatar overlay).

Title at top of the working area: "WHERE PHASE 8 LIVES" in white 56pt Montserrat. Subtitle in cyan (#00D4FF) 28pt directly below: "agent-sdk/src/improvements/"

The diagram is a TWO-LAYER STACK with clear visual hierarchy:

BOTTOM LAYER — labeled "PHASE 7 BASE" (label in muted gray 24pt monospace, far-left side rotated 90°). Three rounded rectangles in muted slate-gray (#475569) with thin gray borders, arranged horizontally:
- detectors.ts (320×100 box)
- scheduler.ts (320×100 box)
- server-command-center.ts (380×100 box)
Filenames in 28pt monospace pale gray (#CBD5E1). Tiny file-icon glyph in upper-left of each box. These boxes feel SETTLED, in the background.

TOP LAYER — labeled "PHASE 8 ADDITIONS" (label in cyan 24pt monospace, far-left side rotated 90°). Three rounded rectangles in dark navy with bright cyan (#00D4FF) borders (3px), each surrounded by a soft cyan glow halo (32px blur at 60% opacity). Arranged horizontally above the Phase 7 boxes:
- contradiction-detector.ts (380×110 box) — small ≠ glyph in upper-left
- cross-wiki-bridge.ts (380×110 box) — small chain-link glyph in upper-left
- auto-apply.ts (320×110 box) — small lightning-bolt glyph in upper-left
Filenames in 30pt monospace bright cyan. These boxes feel ALIVE — the glow is the focal point.

Connection lines between layers: thin cyan lines (2px) with tiny dot-particles, showing each Phase 8 box importing from the Phase 7 base. contradiction-detector → detectors.ts; auto-apply → scheduler.ts; all three → server-command-center.ts.

Right edge of working area, vertical text: "+ ~30 KB new code" in gold (#FFD700) 28pt monospace, rotated 90°.

Bottom of working area, centered: "plugs into the existing pipeline · doesn't touch what already worked" in white 22pt italic.

Lower-left corner: "BYRDDYNASTY" watermark, 18pt muted cyan.

Style: clean architecture-diagram aesthetic — somewhere between Excalidraw polish and a tech-blog system-design illustration. Sharp typography, intentional whitespace.
```

---

## Segment 024 — Phase roadmap

**Output:** `09-stills/segment-024.png`
**Composition:** FS — image fills the frame. Avatar may overlay on top per HeyGen direction.

```
A horizontal phase-roadmap infographic on dark navy (#0F172A) background, 1920×1080 landscape. Subtle radial vignette making the corners slightly darker.

Title centered at top: "THE JARVIS PHASE MAP" in white 60pt Montserrat. Subtitle in cyan (#00D4FF) 28pt directly below: "a second brain, in stages"

A horizontal timeline arc spanning the full width with ~150px margins on left and right. The arc curves gently downward at the edges (subtle bow shape, not flat). Phase nodes sit on the arc, evenly spaced.

COMPLETED PHASES — Phase 1, Phase 2, Phase 3, Phase 7. Each is a circle (110px diameter) with bright cyan (#00D4FF) border (3px), cyan-tinted glow halo (24px blur), white interior, with a bright green (#00FF88) checkmark glyph in the center. Below each circle, two stacked labels:
- Phase number in white 28pt Montserrat
- Brief title in cyan 22pt:
  - Phase 1 — Investment Domain
  - Phase 2 — Vector Search
  - Phase 3 — Autonomous
  - Phase 7 — Self-Healing

THE HERO — Phase 8: a larger circle (150px diameter), gold (#FFD700) border (4px), strong gold glow halo (40px blur), gold checkmark in center. Below: "Phase 8 — Self-Sharpening" in gold 32pt. This circle clearly stands out as "you are here."

FILLER PHASES — between Phase 3 and Phase 7, three smaller dots (40px diameter, muted gray #475569) sit on the arc with no labels — they preserve the timeline visually without claiming completed features.

COMING PHASES — Phase 9 and Phase 10. Empty circles (110px diameter) with cyan outline only, no fill, no checkmark, 70% opacity. Below each:
- Phase 9 — YouTube Integration · coming
- Phase 10 — Telegram Terminal · coming

Connecting line along the arc: thin cyan line (2px). SOLID between Phase 1 → Phase 3. DASHED between Phase 3 → Phase 7 (gap). SOLID Phase 7 → Phase 8. DASHED forward Phase 8 → Phase 9 → Phase 10.

Bottom-right corner: small monospace text in muted cyan 22pt: "april 2026 · the map keeps expanding"

Lower-left corner: "BYRDDYNASTY" watermark, 18pt muted cyan.

Style: clean journey-map / product-roadmap aesthetic. Polished, brand-consistent. The gold Phase 8 instantly catches the eye.
```

---

## Segment 025 — Phase 9 tease (YouTube → second brain)

**Output:** `09-stills/segment-025.png`
**Composition:** SR — image holds left 2/3; avatar on right third.

```
A cinematic tech illustration on dark navy (#0F172A) background, 1920×1080 landscape, with soft cyan-and-gold gradient bloom in the background atmosphere.

Most content occupies the LEFT TWO-THIRDS of the frame.

LEFT SECTION (about 35% of working width): a stack of three video thumbnail cards floating in 3D space, slightly tilted (15°), staggered in depth. Each card is 360×200, dark slate background with a centered red "play" triangle glyph (a generic play icon, NOT a YouTube logo). Each card has a thin white title bar at the top:
- top card: "AI Builders Daily"
- middle card: "Phase 9 · Episode 12"
- bottom card: "How We Ship Each Week"
Each card has a subtle red glow halo. A small red "subscribe" pill sits in the corner of the top card.

CENTER SECTION (about 30% of working width): a flowing stream of cyan particle motes (8–16px), drifting diagonally from the video cards toward the right side. Some particles have thin cyan light-trail tails, like soft comets. The motion implies "content flowing."

RIGHT SECTION (about 35% of working width): an abstract second-brain visualization — six interconnected wiki-page rectangles (each ~180×120, dark navy with cyan borders), arranged in a constellation. Each page has two faint horizontal lines suggesting text content and a small cyan tag-pill in the corner. The pages are connected by glowing cyan edges, forming a small network. At the center of this network: a brain-glyph nucleus (cyan, 96px) with a soft pulse glow.

Top of frame, centered: "PHASE 9 · YOUTUBE → SECOND BRAIN" in 48pt white Montserrat, with light letter-spacing, plus a 4px gold (#FFD700) accent bar beneath it (~360px wide).

Bottom of frame, centered: "new channel · same pipeline · pull · transcribe · summarize · route" in 22pt monospace muted cyan.

Lower-right of working area (left 2/3): "BYRDDYNASTY" watermark, 18pt muted cyan.

Style: cinematic tech illustration — DeepMind / Anthropic blog header energy. Polished, atmospheric, depth-rich. The left-to-right flow reads as a story: video content streams into the second brain.
```

---

## Segment 026 — Phase 10 tease (Telegram terminal)

**Output:** `09-stills/segment-026.png`
**Composition:** SL — image holds right 2/3; avatar on left third.

```
A cinematic product-illustration on dark navy (#0F172A) background, 1920×1080 landscape, with dramatic side-lighting from the right.

Most content occupies the RIGHT TWO-THIRDS of the frame.

CENTER OF WORKING AREA: a modern smartphone in landscape orientation, large (~950px wide), tilted 15° toward the camera with subtle highlights on the matte-black bezel. Slight reflection beneath the device on a darker surface.

PHONE SCREEN CONTENT (Telegram chat interface, custom JARVIS theme):
- Top header bar: "JARVIS" in white, a cyan circular avatar showing a stylized "J" glyph, and a small green online-dot
- Three message bubbles:
  1. User outgoing bubble (right-aligned, dark-blue fill): "/build-video phase-9"
  2. JARVIS incoming bubble (left-aligned, dark navy with thin cyan border) styled as terminal output, monospace cyan-glowing text:
     ▸ pulling latest plan…
     ▸ heygen render: ready
     ▸ remotion compose: queued
     [████████░░] 80%
  3. Smaller JARVIS bubble below: "eta 4 min · I'll ping you when done"

THE HERO DETAIL — the terminal-style cyan text inside the JARVIS bubble GLOWS with strong cyan light (12px blur, 80% opacity), spilling soft glow onto the surrounding screen elements. The phone screen is the brightest source in the image.

RIGHT EDGE OF FRAME: faint floating semi-transparent UI rectangles labeled with monospace text, suggesting "more remote commands available":
- /queue-status
- /scan-markets
- /wiki-search
- /build-video
Stacked vertically, fading out toward the right edge (50% opacity → 10%).

Top of working area: "PHASE 10 · TELEGRAM TERMINAL" in 48pt white Montserrat with thin gold (#FFD700) accent bar beneath (~340px wide).

Bottom-right of working area: small subtext in 22pt monospace muted cyan: "the desk goes mobile · same commands · anywhere"

ATMOSPHERIC DETAILS: subtle airborne particle dust around the phone, lit cyan by the screen glow. A faint cyan light-cone emanating from the phone screen toward the camera, making the screen feel like the source of all light in the frame.

Lower-right corner: "BYRDDYNASTY" watermark, 18pt muted cyan.

Style: product-photography meets tech-illustration. Apple-keynote launch aesthetic. The glowing terminal text inside the chat is the hero — atmospheric, readable, clearly conveys "shell-via-phone."
```

---

## Generation checklist

- [ ] Segment 002 generated → saved to `09-stills/segment-002.png`
- [ ] Segment 013 generated → saved to `09-stills/segment-013.png`
- [ ] Segment 018 generated → saved to `09-stills/segment-018.png`
- [ ] Segment 024 generated → saved to `09-stills/segment-024.png`
- [ ] Segment 025 generated → saved to `09-stills/segment-025.png`
- [ ] Segment 026 generated → saved to `09-stills/segment-026.png`
- [ ] All 6 images reviewed for brand consistency (cyan/gold/navy palette, Byrddynasty watermark)
- [ ] Images baked into HeyGen at the matching segment timestamps
- [ ] HeyGen MP4 rendered with images embedded → handed to Claude for `segment-timings.json` + Remotion production prompt
