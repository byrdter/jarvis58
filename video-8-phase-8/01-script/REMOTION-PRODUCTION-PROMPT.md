# REMOTION PROJECT CREATION PROMPT — JARVIS VIDEO 8

## PROJECT OVERVIEW

Create a polished, energetic Remotion video composition for JARVIS Phase 8: The Second Brain Gets Sharper.

This is a 13-minute long-form video. **The HeyGen avatar is present in most segments** (full screen, side-shifted, or PiP corner positions) — graphics MUST respect the avatar's position per segment. This is different from JARVIS Video 2, where the avatar was absent during voiceover segments.

**Six segments are static images already baked into the HeyGen video** — those segments need NO Remotion graphics. The HeyGen MP4 is the source of all audio AND the avatar visuals AND the embedded static images.

---

## CRITICAL VIDEO FILES

**HeyGen source video** (audio + avatar + 6 baked-in static images):
```
${JARVIS_HOME}/video-8-phase-8/02-heygen/heygen-source.mp4
```

**Segment timing data:**
```
${JARVIS_HOME}/video-8-phase-8/10-output/segment-timings.json
```

**Voiceover-only reference (script content per segment):**
```
${JARVIS_HOME}/video-8-phase-8/01-script/VO-ONLY.md
```

**Full script with imagery descriptions:**
```
${JARVIS_HOME}/video-8-phase-8/01-script/SCRIPT-AND-PLAN.md
```

## OUTPUT DIRECTORY

```
${JARVIS_HOME}/video-8-phase-8/03-remotion/
```

(Create this directory and the Remotion project inside it.)

## VIDEO SPECIFICATIONS

- **Resolution:** 1920×1080 (Full HD)
- **Frame rate:** 25 fps
- **Total duration:** 13:18 (798.082 seconds)
- **Total frames:** 19,952 (798.082 × 25)
- **Total segments:** 29
  - **Image segments:** 6 (segments 2, 13, 18, 24, 25, 26) — NO GRAPHICS NEEDED
  - **Voiceover/avatar segments:** 23 — NEED GRAPHICS that respect avatar position
- **Audio:** taken from HeyGen video — pass-through, no re-encoding

---

## SEGMENT TYPES — CRITICAL READING

### Image segments (6 total) — NO GRAPHICS NEEDED

Segments **2, 13, 18, 24, 25, 26** already have full-screen Nano Banana images baked into the HeyGen video. These images may also have the HeyGen avatar overlaid as a PiP corner per the composition mode. **Do NOT create any Remotion graphics for these segments — just let the HeyGen video play through unaltered for those time windows.**

### Voiceover/avatar segments (23 total) — NEED GRAPHICS

All other segments have the avatar in some position (full screen, PiP corner, or side-shifted). Remotion graphics overlay onto the HeyGen video — but graphics MUST avoid colliding with the avatar's position.

---

## AVATAR POSITION VOCABULARY — READ THIS FIRST

Every voiceover segment has a `composition` mode in `segment-timings.json`. This tells you where the avatar appears in the HeyGen video, which dictates where Remotion graphics may safely render.

| Mode | Avatar position in HeyGen video | Where graphics may render | Avatar zone to RESERVE |
|------|--------------------------------|--------------------------|------------------------|
| **FS** | Avatar fills full 1920×1080 | NOWHERE — render NO graphics OR a small lower-third only at specific moments | Entire frame is avatar |
| **FS-G** | Avatar is ABSENT (graphic-only segment) | Full 1920×1080 — graphics fill the entire frame, no avatar to avoid | None — full frame is yours |
| **BR-C** | Bottom-right CIRCLE PiP, ~384px wide, 20px from edges | Most of the frame; keep ~420×420px clear in BOTTOM-RIGHT | Bottom-right corner (1500..1920 horizontally, 660..1080 vertically) |
| **BR-S** | Bottom-right rounded SQUARE PiP, ~384px wide | Same as BR-C — keep bottom-right ~420×420 clear | Bottom-right corner (same coordinates) |
| **BL-C** | Bottom-left CIRCLE PiP, ~384px wide | Most of the frame; keep ~420×420px clear in BOTTOM-LEFT | Bottom-left corner (0..420 horizontally, 660..1080 vertically) |
| **BL-S** | Bottom-left rounded SQUARE PiP, ~384px wide | Same as BL-C — keep bottom-left ~420×420 clear | Bottom-left corner (same coordinates) |
| **SL** | Avatar holds LEFT third (~640px wide, full height) | RIGHT TWO-THIRDS only (x=640..1920) | Left third (x=0..640, full height) |
| **SR** | Avatar holds RIGHT third (~640px wide, full height) | LEFT TWO-THIRDS only (x=0..1280) | Right third (x=1280..1920, full height) |
| **CS** | Avatar centered, full height | AROUND a center reserved zone — particles/orbits/edges | Center column (x=660..1260, full height) — keep clear of primary content |

**RULE:** When a voiceover segment is in a non-full-frame composition, design the graphic for the available area only. Do NOT render text or important content into the avatar's reserved zone — the avatar is already there in the HeyGen video and would cover/clash with anything drawn underneath it.

---

## THREE VISUAL STYLES

(Same three styles that worked for Video 2 — reuse them here for brand consistency.)

### TITLE STYLE — for major section headers, hero moments, phase announcements

**Background:**
- Animated gradient: Purple (#8B5CF6) → Deep Blue (#1E3A8A) → Purple
- Diagonal moving grid (50px squares, subtle cyan lines at 8% opacity)
- 30 floating particles (cyan/purple, 4-8px, random drift)
- Rotating geometric corner accents (cyan glow)

**Text:**
- Title: 120-156px, bold, uppercase, letter-spacing 0.1em
- Subtitle: 56-72px, sentence case
- Color: Cyan (#00D4FF) with gradient to light cyan (#7DF9FF)
- Effects: Inner cyan glow 20px + outer purple glow 40px; text shadow 0 0 60px cyan; pulsing 1.0 → 1.3 → 1.0 over 2s

**Animations:**
- Entrance (0-1s): Spring physics — scale 0.5 → 1.0 (damping 15, stiffness 100), rotate -10° → 0°, slide from left -200px → 0, opacity 0 → 1
- Hold: pulsing glow, drifting particles, rotating corners, scrolling grid
- Exit (last 0.5s): scale to 1.2, fade to 0

**Additional elements:**
- Animated accent bar under title (width 0% → 100% over 0.8s, 6px, cyan)
- Corner brackets (animated stroke, cyan, 100px in each corner)

---

### BODY STYLE — for explanations, descriptions, technical content

**Background:**
- Animated gradient: Dark Navy (#0F172A) → Darker Blue (#020617) → Dark Navy
- Subtle vertical grid (60px lines at 10% opacity, white)
- 20 floating particles (white/cyan, 3-6px, slow drift)
- Minimal corner glows (white, soft, pulsing)

**Text:**
- Main: 72px, clean sans-serif
- Supporting: 52px, lighter
- Color: White (#FFFFFF) with subtle gradient to light gray (#E5E7EB)
- Effects: subtle white glow 15px, light pulsing opacity 0.95 → 1.0 → 0.95 over 3s, text shadow 0 0 30px white

**Animations:**
- Entrance (0-1s): smooth spring — scale 0.7 → 1.0 (damping 20, stiffness 80), rotate 5° → 0°, slide from left -150px → 0, opacity 0 → 1
- Hold: gentle particle drift, subtle grid, soft corner pulse
- Exit (last 0.5s): scale to 1.15, fade to 0

**Additional elements:**
- Side accent line (vertical, 4px, cyan, height 0% → 100% over 0.6s — on the side OPPOSITE the avatar's reserved zone)
- Subtle vignette (edges, pulsing 60% → 80%)

---

### HIGHLIGHT STYLE — for key takeaways, lists, stats, big-impact moments

**Background:**
- Animated gradient: Teal (#14B8A6) → Green (#059669) → Teal
- Dynamic grid (both axes, 40px squares, gold lines at 20% opacity)
- 30 floating particles (gold/orange, 5-10px, energetic)
- Rotating geometric corner shapes (triangles/squares, gold glow)

**Text:**
- Main: 90-110px, bold
- Supporting/bullets: 64-72px, medium weight
- Color: Gold (#FFD700) with gradient to light gold (#FFF4CC)
- Effects: dual-color glow (inner gold 25px, outer orange #FF8C00 45px), strong pulsing 1.0 → 1.4 → 1.0 over 1.5s, text shadow 0 0 50px gold

**Animations:**
- Entrance (0-1.2s): explosive spring — scale 0.3 → 1.0 (damping 12, stiffness 120), rotate 15° → 0°, slide from left -250px → 0, opacity 0 → 1
- Hold: strong pulsing, energetic particles, rotating corners, moving grid
- Exit (last 0.5s): scale to 1.3, rotate 5°, fade to 0

**Additional elements:**
- Numbered badges (circular, 80px, gold border, white background, gold number)
- Multiple accent bars (top + bottom, staggered, gold gradient)
- Brief explosion effect on entrance (particle burst from center, fades fast)

---

## ANIMATION REQUIREMENTS

### Spring physics
```typescript
{
  title:    { damping: 15, stiffness: 100, mass: 1 },
  body:     { damping: 20, stiffness: 80,  mass: 1 },
  highlight:{ damping: 12, stiffness: 120, mass: 1 },
}
```

### Particle system
- Random initial positions, distributed across the AVAILABLE rendering area (NOT the avatar zone)
- Sin/cos drift movement
- Size pulsing ±20%
- Opacity 40%–100% variation

### Grid animation
- Continuous diagonal scroll for title style; vertical for body; both axes for highlight
- Speed 20-30px/sec
- Loop seamlessly

### Corner accents
- Continuous 360° rotation over 4-6 seconds
- Scale pulsing 0.8 → 1.0 → 0.8 over 2s

---

## SEGMENT-BY-SEGMENT INSTRUCTIONS

For each segment below, the layout BUDGET is the area NOT occupied by the avatar. Refer to the avatar position vocabulary above.

---

### SEGMENT 1 (0:00 — 0:39, 39.2s) — TITLE STYLE
**Composition:** FS (avatar full screen)
**Avatar position:** entire frame
**Layout budget:** essentially nothing — the avatar carries this

**Treatment:** For most of this segment, render NO graphics — let the avatar speak alone (this is the hook + intro).

At the FINAL beat ("Phase 8 fixed all three. Hi, I am an avatar for Dr. Terry Byrd..."), sweep in a Remotion lower-third along the bottom of the frame:
- A wide bar (1920×220px) at the bottom of the frame (y=860 to 1080)
- Massive cyan title "PHASE 8" (140px, uppercase, cyan glow)
- Subtitle "the second brain gets sharper" (44px, white)
- Three small icons above the title: warning triangle, link, lightning bolt — each 48px, briefly flash cyan in sequence
- Stay on screen until segment end

**STUNNING note:** The lower-third should feel like a TV news bug or a major announcement card. Sweep entrance from off-bottom, brief icon flash sequence, hold, exit at segment end.

---

### SEGMENT 2 (0:40 — 1:05, 24.3s) — IMAGE SEGMENT
**Image baked into HeyGen:** `002-segment.png` (Phase 7 self-improvement loop diagram)
**NO REMOTION GRAPHICS — let video play through.**

---

### SEGMENT 3 (1:06 — 1:28, 22.2s) — BODY STYLE
**Composition:** SR (avatar holds right third)
**Avatar position:** RIGHT third (x=1280..1920)
**Layout budget:** LEFT TWO-THIRDS (x=0..1280, full height)

**Title (top of left 2/3):** "THREE BLIND SPOTS"
**Content (left 2/3):** Three sketched-style problem panels stacking vertically inside the left 2/3:

1. Two page rectangles with "≠?" between them. Caption: "pages contradict"
2. Two wiki silos (cylinder shapes) with broken connection. Caption: "knowledge stuck"
3. A queue stack with a stamp icon over every item. Caption: "approve everything"

Each panel "draws in" with a sketched-stroke entrance (0.6s each, 0.3s stagger).

Side accent line on far-left (x=20..24, full height, cyan, height animates 0% → 100%).

**STUNNING note:** Hand-sketched feel for the panels (rough lines, organic strokes), but render in Remotion using SVG path-draw animations or stroke-dasharray reveals. Cyan + white palette, navy background.

---

### SEGMENT 4 (1:29 — 1:44, 14.9s) — BODY STYLE
**Composition:** SL (avatar holds left third)
**Avatar position:** LEFT third (x=0..640)
**Layout budget:** RIGHT TWO-THIRDS (x=640..1920)

**Title (top of right 2/3):** "PROBLEM 1: PAGES THAT DISAGREE"
**Content:** Two wiki page mockups side-by-side in the right 2/3:
- LEFT card: "INVESTMENTS WIKI" header, body text "Position sizing... ≤ 25%". The "25%" pulses red.
- RIGHT card: "METHODOLOGY WIKI" header, body text "Position sizing... ≤ 20%". The "20%" pulses red.
- Between the two cards, a jagged lightning-bolt SVG draws in with the word "CONTRADICTION" in red 56px above it.

Side accent line on right side (x=1896..1900, full height, cyan).

**STUNNING note:** The lightning bolt is the hero — sketched, rough strokes, glowing red. The two page mockups should feel like real wiki documents (header bar, faux text lines, page border).

---

### SEGMENT 5 (1:45 — 2:00, 14.3s) — BODY STYLE
**Composition:** SR (avatar on right)
**Avatar position:** RIGHT third
**Layout budget:** LEFT TWO-THIRDS

**Title:** "PROBLEM 2: KNOWLEDGE IN SILOS"
**Content (left 2/3):** Two cloud shapes with concepts inside:
- Top cloud: "AI FILMMAKING" (cyan border) — contains a film-camera icon and the phrase "constraint-driven creativity"
- Bottom cloud: "INVESTMENTS" (gold border) — contains a pie-chart icon and the phrase "position sizing limits"
- Between them, a dashed line tries to connect: it animates as 3 failed attempts (draws halfway, retracts, draws again) — then on the last attempt, COMPLETES with a glowing cyan connection at the moment "until now" is spoken.

**STUNNING note:** The connection completing at "until now" is the emotional beat. Make it earn it — strong cyan glow, particle burst at the connection point.

---

### SEGMENT 6 (2:01 — 2:26, 25.2s) — BODY STYLE
**Composition:** SL (avatar on left)
**Avatar position:** LEFT third
**Layout budget:** RIGHT TWO-THIRDS

**Title:** "THE QUEUE — PRE-PHASE-8"
**Content (right 2/3):** A scrolling queue list (Remotion-rendered) with ~15-20 items:
- Each item is a card with: title text, type badge (typo / missing-link / restructure / etc.), risk-color band (green / yellow / red)
- ~70% are GREEN (low-risk: typos, missing links, format)
- ~20% are YELLOW (medium)
- ~10% are RED (judgment calls)
- The list slowly scrolls upward
- Green items briefly flash highlight then dim — emphasizing "every typo was waiting for me"
- Subtitle at top of list: "PHASE 7 QUEUE — every item needed approval"

**STUNNING note:** Make the queue feel REAL — like a Linear or Asana view. The user should feel the noise volume.

---

### SEGMENT 7 (2:27 — 2:52, 24.4s) — TITLE STYLE
**Composition:** FS (full screen avatar)
**Avatar position:** entire frame
**Layout budget:** background only (behind/around avatar, very subtle)

**Treatment:** Avatar is hero; do NOT cover them.

In the BACKGROUND (behind/around the avatar — subtle, 50% opacity max):
- Three large floating numerical badges appear in sequence: "1", "2", "3"
- Each badge is a circular outline (140px diameter, cyan stroke 4px, transparent center, no fill — viewer sees avatar through them)
- They appear in the upper background as the avatar speaks "one... two... three..."
- Word-level timing for badge entrance (sync with VO if AssemblyAI captions available; otherwise approximately 1/3, 2/3, end of segment)
- Badge "1" sits upper-left background, "2" upper-center, "3" upper-right — accumulating
- Each fades in via spring (scale 0.6 → 1.0, opacity 0 → 0.5) and stays until segment end
- Faint ghost-text labels drift across upper background at very low opacity (15%): "CONTRADICTIONS" → "BRIDGES" → "AUTO-APPLY" — each one drifts in, holds 2s, fades out

**STUNNING note:** This is a hero moment — the numbered badges should NEVER cover the avatar's face. Keep them in the upper third of the frame, behind the avatar.

---

### SEGMENT 8 (2:54 — 3:18, 24.5s) — BODY STYLE
**Composition:** BR-C (bottom-right circle PiP)
**Avatar position:** Bottom-right corner ~384×384
**Layout budget:** Most of frame — keep bottom-right ~420×420 clear

**Title (top center):** "CONTRADICTION DETECTION"
**Content:** Two wiki-page rectangles side by side in the upper/center area, with a question-mark icon hovering between them.

The comparison evolves in three phases driven by spring physics:

**Phase 1 (0-7s):** STRING-MATCH ATTEMPT. Identical words highlight cyan on both pages. Most of the page content is dim — clearly not catching the contradiction. Subtitle: "string match: catches nothing"

**Phase 2 (7-15s):** LLM READING. Each page's facts are extracted into bullet-point chips that reveal sequentially with stagger (0.4s between bullets). 4-5 bullets per page. Subtitle: "LLM reads each page"

**Phase 3 (15-24s):** SEMANTIC COMPARISON. Matching bullet pairs glow GREEN with a "✓ agree" tag. Conflicting pairs glow RED with a "✗ conflict" tag. One conflict pair pulses dramatically. Subtitle: "semantic match: conflict found"

Each phase transitions with a brief crossfade.

**STUNNING note:** The Phase 3 conflict pulse is the payoff — make the red glow feel triumphant (we caught it!).

---

### SEGMENT 9 (3:19 — 3:46, 26.4s) — BODY STYLE
**Composition:** SR (avatar on right)
**Avatar position:** RIGHT third
**Layout budget:** LEFT TWO-THIRDS

**Title (top):** "HOW IT WORKS"
**Content (left 2/3):** A flowchart drawn in sequence (each box appears via spring entrance, 0.5s stagger):

```
[Page Pair Selector]
      ↓
[Claude Subprocess]   ← small Anthropic logo
      ↓
   ◇ Contradicts? ◇
    /         \
   YES        NO
   ↓           ↓
[Structured  [skip]
 Proposal]
   ↓
[improvements_queue]   ← database icon
```

Each box pulses cyan when its label is spoken (timing approximate per VO).
Cyan particle trails flow along connection lines.
Final box "improvements_queue" gets a satisfying landing animation when the segment ends.

**STUNNING note:** The branching diamond is the conceptual hero — make the YES/NO branches visually distinct (YES branch glows cyan, NO branch greys out).

---

### SEGMENT 10 (3:48 — 4:14, 26.7s) — BODY STYLE
**Composition:** BL-C (bottom-left circle PiP — terminal output deserves the right side)
**Avatar position:** Bottom-left corner ~384×384
**Layout budget:** most of frame; keep bottom-left ~420×420 clear

**Treatment:** Mock-terminal recording rendered in Remotion. Position the terminal in the upper-right two-thirds of the frame.

Terminal styling:
- Dark slate background (#1E293B), rounded corners, drop shadow
- Title bar: macOS-style red/yellow/green dots, label "claude-code"
- Monospace font, cyan-tinted output, white commands

Content (typed/scrolled in over 24s):
```
$ bun run video-pipeline/detect-contradictions.ts --wiki investments
[selecting page pairs by tag overlap...]
[5 candidate pairs identified]
[spawning claude subprocess... pid 47291]
[scanning pair 1/5: position-sizing-rules.md ↔ methodology.md]
[scanning pair 2/5: stop-loss-strategy.md ↔ trade-execution.md]
...
✓ contradiction: position-sizing-rules.md ↔ methodology.md
✓ contradiction: stop-loss-strategy.md ↔ trade-execution.md
[2 proposals queued]
```

The "✓ contradiction" lines glow green when they appear.
A brief "scanning..." dots animation between commands.

**STUNNING note:** Make this feel like a REAL terminal session — not a perfect demo. Variable typing speed, brief pauses, output that scrolls naturally.

---

### SEGMENT 11 (4:16 — 4:46, 29.9s) — BODY STYLE
**Composition:** BR-S (bottom-right rounded-square PiP)
**Avatar position:** Bottom-right corner ~384×384
**Layout budget:** most of frame; keep bottom-right ~420×420 clear

**Title (top):** "CROSS-WIKI BRIDGES"
**Content:** Four blob-clusters at corners of the layout (avoiding the bottom-right):
- TOP-LEFT: "INVESTMENTS" (gold border, ~5 floating concept-tag pills inside)
- TOP-RIGHT: "AI FILMMAKING" (cyan border, ~5 pills)
- CENTER-LEFT: "OPERATIONS" (white border, ~5 pills)
- BOTTOM-LEFT (NOT bottom-right — avoid avatar): "CLAUDE CODE" (pale cyan border, ~5 pills)

Each pill has a short label (e.g. "constraint-driven design", "position sizing", "subprocess pattern", "review queue").

As VO progresses:
- Two specific pills pulse: "constraint-driven design" (in AI FILMMAKING) and "position sizing limits" (in INVESTMENTS) — both glow cyan in unison
- Then a glowing cyan line draws between them via spring physics, with cyan particles flowing along it
- Caption appears: "the bridge detector finds these"

**STUNNING note:** Make the bridge connection feel like a discovery moment — the pulse-then-connect is the emotional beat.

---

### SEGMENT 12 (4:47 — 5:10, 22.9s) — BODY STYLE
**Composition:** SR (avatar on right)
**Avatar position:** RIGHT third
**Layout budget:** LEFT TWO-THIRDS

**Title:** "BRIDGE — REAL EXAMPLE"
**Content (left 2/3):** Two sketched-feel wiki page cards:

LEFT card titled: "THE CONSTRAINT LOOP (filmmaking)"
- Body text lines (sketched/handwritten font)
- The phrase "constraint-driven" highlighted with a hand-drawn circle (sketched stroke, gold)

RIGHT card titled: "POSITION SIZING AS CONSTRAINT"
- Body text lines
- The phrase "constraint-driven" highlighted with a hand-drawn circle (sketched stroke, gold)

Then a sketched arc draws between the two highlighted phrases. On the arc, a label appears: `[[wiki-link]]` in monospace.
Approval checkmark stamps in (green ✓) at the end.

**STUNNING note:** The hand-drawn circles around the same phrase are the visual proof — the system saw what we missed.

---

### SEGMENT 13 (5:12 — 5:41, 29.8s) — IMAGE SEGMENT
**Image baked into HeyGen:** `013-segment.png` (wiki graph after Phase 8)
**NO REMOTION GRAPHICS — let video play through.**

---

### SEGMENT 14 (5:43 — 6:03, 20.4s) — BODY STYLE
**Composition:** BR-C (bottom-right circle PiP)
**Avatar position:** bottom-right corner
**Layout budget:** most of frame; keep bottom-right ~420×420 clear

**Title (top):** "AUTO-APPLY TIER"
**Content:** A stack of "proposal cards" on the LEFT side of the frame (~5 cards stacked, each with a fake title like "fix typo on methodology.md", "add link from sizing→strategy", etc.).

Three labeled BUCKETS appear across the upper-right:
- "LOW RISK · auto-apply" (green)
- "MEDIUM · notify" (yellow)
- "HIGH RISK · review" (red)

Cards then sequence-shoot from the stack into the appropriate bucket using spring physics — color-shifting to match the bucket on arrival. ~5-6 cards total flying.

**STUNNING note:** The card-flying animation is the hero. Use spring physics with arcing trajectories — like sorting mail into mailboxes.

---

### SEGMENT 15 (6:05 — 6:31, 25.5s) — HIGHLIGHT STYLE
**Composition:** SL (avatar on left)
**Avatar position:** LEFT third
**Layout budget:** RIGHT TWO-THIRDS

**Title (top of right 2/3):** "RISK TIERS"

**Content:** A clean three-row table:

| TIER | EXAMPLES | ACTION |
|------|----------|--------|
| **LOW** (green band) | typo · missing link · format fix · broken-link replace | AUTO-APPLY |
| **MEDIUM** (yellow band) | cross-wiki bridge · additive content | AUTO + NOTIFY |
| **HIGH** (red band) | contradiction resolve · content removal · structural | HUMAN REVIEW |

Below the table: a horizontal stacked bar showing 70% green / 20% yellow / 10% red, labeled "actual split, last 14 days."

Rows reveal sequentially with stagger (0.6s each).

**STUNNING note:** The table should look polished — clean borders, good typography. The stacked bar at the bottom is the proof — show it building from 0% to its final split with a counting animation.

---

### SEGMENT 16 (6:32 — 7:04, 31.4s) — BODY STYLE
**Composition:** BR-S (bottom-right rounded-square PiP)
**Avatar position:** bottom-right corner
**Layout budget:** most of frame; keep bottom-right clear

**Treatment:** Mock-terminal in upper-left two-thirds.

Content:
```
$ bun run video-pipeline/run-auto-apply.ts
[2026-04-25 12:00:01] starting daily-auto-apply
[scanning improvements_queue for unreviewed proposals...]
[14 proposals found]
[classifying by risk tier...]
[low-risk: 9, medium: 3, high: 2]
[applying 9 low-risk proposals...]
✓ typo-fix: methodology.md (PR #482)
✓ broken-link: trade-execution.md (PR #483)
✓ missing-link: position-sizing.md (PR #484)
✓ format-fix: ai-filmmaking-overview.md (PR #485)
✓ typo-fix: cinematography.md (PR #486)
✓ missing-link: subprocess-pattern.md (PR #487)
✓ broken-link: scheduler.md (PR #488)
✓ format-fix: oauth-setup.md (PR #489)
✓ typo-fix: vector-search.md (PR #490)
[3 medium-risk: notification sent]
[2 high-risk: queued for review]
[done in 47s]
```

Variable typing speed, ✓ checkmarks glow green when they appear.

**STUNNING note:** The cascade of green checkmarks is the proof — each one is a fix that didn't need a human. Make them visually satisfying (slight scale bounce on each).

---

### SEGMENT 17 (7:05 — 7:32, 27.1s) — HIGHLIGHT STYLE (audio-reactive feel)
**Composition:** FS (full screen avatar)
**Avatar position:** entire frame
**Layout budget:** background only — subtle, behind avatar

**Treatment:** This is a hero / act-break moment. Avatar is centered. BEHIND the avatar (low opacity, 30-40%):

A pulsing loop diagram with three nodes:
- DETECT (top) — cyan
- DRAFT (right) — gold
- APPLY (left) — green

Connected with curved arrows in a triangle, animated cyan particle trails flowing clockwise around the loop.

Each node lights up (full brightness pulse) when its name is spoken in the VO ("the detector finds...", "the drafter writes...", "the auto-apply ships...").

The loop pulses slightly with the audio rhythm (gentle scale 1.0 → 1.05 → 1.0 over 1.5s).

When VO says "while we relax" — the scene SUBTLY transitions to a moonlit gradient (cooler tones), motion settles.

**STUNNING note:** This is the most cinematic moment. Avatar is hero, loop is atmospheric. Audio-reactive feel without overwhelming the speaker.

---

### SEGMENT 18 (7:34 — 7:55, 21.0s) — IMAGE SEGMENT
**Image baked into HeyGen:** `018-segment.png` (architecture diagram, SR composition with avatar on right third)
**NO REMOTION GRAPHICS — let video play through.**

---

### SEGMENT 19 (7:56 — 8:29, 33.3s) — BODY STYLE
**Composition:** SL (avatar on left)
**Avatar position:** LEFT third
**Layout budget:** RIGHT TWO-THIRDS

**Title (top of right 2/3):** "DAILY SCHEDULE"

**Content:** Horizontal timeline from "6 AM" to "9 PM" along the bottom of the right 2/3. Each event labeled with an icon and time:

- 8 AM "Daily Reflection" 🌅
- 10 AM "Detector Scan" 🔍
- 11 AM-12 PM "Drafter Pass" ✍️
- 12 PM "Auto-Apply Run" ⚡
- 6 PM "User Review" 👁️

Events animate in sequentially as VO names them — each one drops a marker on the timeline with a label that fades in below.

A subtle horizontal progress bar runs along the bottom edge — slowly filling left to right over the segment duration.

**STUNNING note:** Make the timeline feel like a real schedule — clean, professional, like a dashboard.

---

### SEGMENT 20 (8:31 — 8:55, 23.9s) — HIGHLIGHT STYLE
**Composition:** BR-C (bottom-right circle PiP)
**Avatar position:** bottom-right corner
**Layout budget:** most of frame; keep bottom-right clear

**Title (top center):** "THE COST"

**Content:** A cost dashboard rendered Remotion-style:

```
Claude calls (OAuth subprocess)    $0 / month
AssemblyAI captions                 $0.08 / video
─────────────────────────────────
TOTAL                               ~$2 / month
```

Big bold numerals: "$0" pulses gold + cyan dollar-sign particles.
"$0.08" appears with a counting animation (counts up from 0).
"$2" lands with an emphasized pulse + brief celebration particle burst.

Sub-caption: "a second brain that improves itself for the price of dinner once a month"

**STUNNING note:** The "$0" dollar-particle effect is the visual hook. Make the zero feel like an achievement.

---

### SEGMENT 21 (8:57 — 9:17, 20.5s) — BODY STYLE
**Composition:** SR (avatar on right)
**Avatar position:** RIGHT third
**Layout budget:** LEFT TWO-THIRDS

**Title (top):** "LIVE QUEUE — RIGHT NOW"

**Content (left 2/3):** A live-queue UI mockup styled like the actual command-center app:
- URL bar at top: `localhost:3000/queue`
- Filter pill: "Last 7 days"
- A list of ~6-8 entries with:
  - Green checkmark badges + "auto-applied" tag (most rows)
  - Yellow/red pending badges (a few rows)
- Stats footer: "11 auto-applied · 4 pending · 2 contradictions · 3 bridges this week"

Hover effects on rows (subtle glow as if cursor moves over them).

> **Recording note:** the original script said capture this LIVE day-of-recording via Playwright. For the static/Remotion version, the mockup numbers above are placeholder; if Terry has live numbers from recording day, update them in this segment.

**STUNNING note:** Make this look like a REAL app — design quality matters. The aesthetic should match a Linear or Vercel dashboard.

---

### SEGMENT 22 (9:18 — 9:48, 30.0s) — BODY STYLE
**Composition:** SL (avatar on left)
**Avatar position:** LEFT third
**Layout budget:** RIGHT TWO-THIRDS

**Title (top):** "THIS WEEK'S AUTO-APPLIES"

**Content (right 2/3):** Three "card" reveals stacked vertically (each ~280px tall, 1100px wide):

CARD 1:
- Title: "Missing Link Added"
- Source: position-sizing.md
- Target: methodology.md
- Badge: green "AUTO-APPLIED" + timestamp "applied 2d ago"

CARD 2:
- Title: "Typo Fixed"
- File: ai-filmmaking-overview.md
- Detail: 'cinematograhy' → 'cinematography'
- Badge: green "AUTO-APPLIED" + timestamp "applied 4d ago"

CARD 3:
- Title: "Cross-Wiki Bridge"
- From: operations wiki
- To: claude code wiki
- Concept: "context window management"
- Badge: green "AUTO-APPLIED" + timestamp "applied 1d ago"

Cards stagger in 0.5s apart with spring entrance. Each card has a subtle hover lift (scale 1.0 → 1.02 → 1.0 over 2s).

> **Recording note:** original script said pull three actual recent proposals at recording time. The above are placeholders; update with real proposals if available.

**STUNNING note:** Each card should feel like a real notification card — clean borders, good info hierarchy, the green badge punches the success.

---

### SEGMENT 23 (9:50 — 10:17, 27.3s) — HIGHLIGHT STYLE (center-stage / orbiting)
**Composition:** CS (avatar centered with orbiting graphics)
**Avatar position:** CENTER (x=660..1260, full height)
**Layout budget:** AROUND the center column — particles, orbits, edge content

**Treatment:** This is the one center-stage moment in the video. Avatar is centered. AROUND the avatar (NOT in the center column), four graphic elements orbit slowly:

- TOP-LEFT orbit position: a wiki-page icon (gets cleaner / brighter on each pulse)
- TOP-RIGHT orbit: a magnifying-glass icon (sharper focus)
- BOTTOM-LEFT orbit: a checkmark cluster (more checks accumulating)
- BOTTOM-RIGHT orbit: an upward arrow / growth curve

All four orbit in a slow rotation around the center, beat-synced to audio.

Each element FADES UP on key VO words:
- "self-sharpening" → magnifying glass intensifies
- "more accurate" → checkmark cluster intensifies
- "less noise" → wiki-page icon brightens
- "compounds" → growth arrow accelerates

A subtle particle field fills the space between the four orbiting elements — cyan + gold motes, slow drift.

**STUNNING note:** This is the most cinematic moment of the video. The avatar is hero; the orbits are atmospheric. NEVER let the orbiting elements drift into the center column. Beat-synced motion only.

---

### SEGMENT 24 (10:19 — 10:42, 23.3s) — IMAGE SEGMENT
**Image baked into HeyGen:** `024-segment.png` (Phase roadmap)
**NO REMOTION GRAPHICS — let video play through.**

---

### SEGMENT 25 (10:43 — 11:04, 21.1s) — IMAGE SEGMENT
**Image baked into HeyGen:** `025-segment.png` (Phase 9 tease — YouTube to second brain)
**NO REMOTION GRAPHICS — let video play through.**

---

### SEGMENT 26 (11:06 — 11:37, 31.2s) — IMAGE SEGMENT
**Image baked into HeyGen:** `026-segment.png` (Phase 10 tease — Telegram terminal)
**NO REMOTION GRAPHICS — let video play through.**

---

### SEGMENT 27 (11:38 — 12:08, 29.7s) — TITLE STYLE (audio-reactive feel)
**Composition:** FS (full screen avatar)
**Avatar position:** entire frame
**Layout budget:** background only — very subtle

**Treatment:** Avatar carries this moment (vision close).

In the BACKGROUND (low opacity, 25-35%):
- Soft pulse of cyan-and-gold particles, beat-synced to audio
- Avoid the central avatar zone (particles drift around the edges and behind)

As VO hits each verb, a small ghost-text label sweeps across the background and dissolves (each at ~30% opacity, 80px text, fades fully within ~2s):
- "captures"
- "organizes"
- "heals"
- "sharpens"
- "listens"
- "responds"

End on the line "less work" — motion settles into a held, quiet pulse for the last 3 seconds.

**STUNNING note:** This is the vision moment. Atmospheric, NOT busy. The verbs sweep through one at a time — each one a brief glimpse, never two at once.

---

### SEGMENT 28 (12:09 — 12:32, 23.0s) — TITLE STYLE
**Composition:** BR-C (bottom-right circle PiP)
**Avatar position:** bottom-right corner
**Layout budget:** most of frame; keep bottom-right clear

**Treatment:** End-card / CTA design.

CENTER of frame (large, 280px wide): SUBSCRIBE button (cyan, rounded rectangle, white text "SUBSCRIBE", subtle pulsing glow). On the word "subscribe" in the VO, the button gets a satisfying click micro-animation (scale 1.0 → 0.94 → 1.06 → 1.0 over 0.4s).

BELOW the subscribe button: a comment-icon row with rotating prompt chips:
- "agent commerce"
- "alignment"
- "regulation"
- "your own stack"

Each chip is a rounded pill (gold border, navy fill, white text), they rotate through the row position, fading in/out (one at a time, 4s each).

LEFT SIDE of frame: a "share" arrow icon (cyan, 80px), pulsing.

LOWER-LEFT corner: small Byrddynasty channel logo / watermark.

**STUNNING note:** Make this feel like a TV broadcast end-card — energetic, focused, action-oriented.

---

### SEGMENT 29 (12:33 — 13:18, 44.2s) — NO OVERLAY
**Composition:** FS (full screen avatar)
**Avatar position:** entire frame
**Layout budget:** NONE — render NO graphics for this segment

**Treatment:** This is the emotional close. The avatar carries it alone — NO Remotion overlay AT ALL. Pure HeyGen pass-through. Fade to black on the cut at the very end (last 1.0s of the segment).

---

## TECHNICAL IMPLEMENTATION

### Project structure
```
03-remotion/
├── public/
│   └── heygen-source.mp4          ← symlink or copy of 02-heygen/heygen-source.mp4
├── src/
│   ├── index.ts                   ← entry point (registerRoot)
│   ├── Root.tsx                   ← composition registry (durationInFrames=19952, fps=25, 1920×1080)
│   ├── Main.tsx                   ← orchestrator: Audio + OffthreadVideo + segment overlays
│   ├── segmentContent.ts          ← all 29 segment data (timings, types, content, avatar zone)
│   └── compositions/
│       └── AnimatedText.tsx       ← style implementation (Title / Body / Highlight)
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

### Main.tsx orchestration

For each segment, based on type:
- `type === "image"`: render NOTHING from Remotion (the OffthreadVideo passes through)
- `type === "voiceover"`:
  - Determine the avatar's reserved zone from `composition`
  - Render an `AnimatedText` overlay positioned in the AVAILABLE rendering area only
  - Pass props: { style, title, text, segmentNumber, avatarZone }

Use `OffthreadVideo` for the source HeyGen video (more frame-accurate than `Video` in preview). Use `Audio` separately to ensure clean audio passthrough.

```typescript
<AbsoluteFill>
  <Audio src={staticFile('heygen-source.mp4')} />
  <OffthreadVideo src={staticFile('heygen-source.mp4')} muted />
  {segments.map(seg => (
    seg.type === 'image' ? null : (
      <Sequence
        key={seg.segment}
        from={Math.round(seg.start * 25)}
        durationInFrames={Math.round(seg.duration * 25)}
      >
        <AnimatedText
          style={seg.style}        // 'title' | 'body' | 'highlight'
          title={seg.titleText}
          text={seg.bodyText}
          segmentNumber={seg.segment}
          avatarZone={seg.composition}  // FS, BR-C, SR, etc.
        />
      </Sequence>
    )
  ))}
</AbsoluteFill>
```

### AnimatedText.tsx — avatar zone

The component must accept `avatarZone` and constrain its layout accordingly:

```typescript
type AvatarZone = 'FS' | 'FS-G' | 'BR-C' | 'BR-S' | 'BL-C' | 'BL-S' | 'SL' | 'SR' | 'CS';

function getAvailableArea(zone: AvatarZone): { x: number; y: number; w: number; h: number } {
  switch (zone) {
    case 'FS':    return { x: 0, y: 0, w: 0, h: 0 };           // no rendering area
    case 'FS-G':  return { x: 0, y: 0, w: 1920, h: 1080 };
    case 'BR-C':
    case 'BR-S':  return { x: 0, y: 0, w: 1500, h: 1080 };     // avoid bottom-right ~420×420 (rendering may extend full width above y=660)
    case 'BL-C':
    case 'BL-S':  return { x: 420, y: 0, w: 1500, h: 1080 };
    case 'SL':    return { x: 640, y: 0, w: 1280, h: 1080 };
    case 'SR':    return { x: 0, y: 0, w: 1280, h: 1080 };
    case 'CS':    return { x: 0, y: 0, w: 1920, h: 1080 };     // render around center column 660..1260
  }
}
```

For `FS` segments where rendering area is 0, the component should render NO graphics (return null) UNLESS the segment specification explicitly requires a small overlay (e.g. segment 1's lower-third, segment 7's floating numerical badges, segment 27's edge particles). Those are explicit per-segment exceptions — handle them as one-off compositions rather than the generic AnimatedText.

### Animation timing
- Entrance: first 1.0-1.2s of segment
- Hold: middle (with continuous animations)
- Exit: last 0.5s

### Performance
- Particle count 20-30 max
- CSS transforms (GPU-accelerated)
- Memoize particle starting positions
- Grid as CSS background, not individual elements

### Rendering
```bash
cd 03-remotion
npm install
npm start              # preview at localhost:3000
npm run render         # final render to out/video.mp4
```

Expected render time: 2-3 hours for the full 13:18 video.

---

## SUCCESS CRITERIA

✅ All 29 segments have correct timing from `segment-timings.json`
✅ Image segments (2, 13, 18, 24, 25, 26): NO Remotion overlays (HeyGen video plays through)
✅ Voiceover segments (23 total): Remotion overlays render ONLY in the avatar's available zone
✅ Avatar position is RESPECTED for every voiceover segment (no graphic overlaps the avatar's PiP / side / center area)
✅ Three visual styles (Title / Body / Highlight) implemented per the brand spec
✅ HeyGen audio passes through cleanly — NO re-encoding, NO drift
✅ Spring physics, particles, grids, glows all polished
✅ Final render at `03-remotion/out/video.mp4`, 1920×1080, 25fps, 798.082s, with all overlays + audio

---

## DESIGN PHILOSOPHY

**RESPECT THE AVATAR.** Most segments have the HeyGen avatar visible. Graphics enhance, never compete. The avatar's reserved zone is sacred — never render text or hero content into it.

**ENERGY where appropriate.** Hero moments (segments 1, 7, 17, 23, 27, 28) get explosive visual energy. Explanatory segments (3-6, 8-12, 14-16, 19-22) are clean and information-rich, not flashy.

**SCALE.** Where graphics fill the available area, fill it. Big text. Layered depth. Don't make the available area feel empty.

**RHYTHM.** Stagger animations within a segment. Sequential reveals create visual flow.

**POLISH.** Smooth springs, pulsing glows, professional execution. The viewer should feel that every segment was crafted, not generated.

**Push Remotion to its limits — but never at the avatar's expense.** This is a presentation, not a slideshow.
