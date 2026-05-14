# Video 12 Production Plan: MCP Token Stack

## Working Title

**MCP Token Costs Changed. Here's What Still Matters.**

Alternate thumbnail/title tests:

- **The 1,000-Token API: How Cloudflare and Anthropic Broke MCP**
- **MCP Is Not Dead. But Your Setup Probably Is.**
- **Skills, MCP, Code Execution: The 2026 Agent Token Stack**

## Thesis

The old "MCP burns your whole context window" take is no longer precise enough. Tool Search, scoped loading, and Code Mode changed the token math. But the real lesson is bigger: modern agent systems need a token stack, not one favorite integration method.

The video should not argue "skills beat MCP." It should argue:

> MCP is the protocol layer. Skills are procedural knowledge. CLI scripts are deterministic local execution. Code execution is the heavy-duty compression layer. The smart stack uses each one where it is strongest.

## Runtime Target

Target length: 11-13 minutes.

Segment rhythm:

- 31 total segments.
- Short segments: 8-12 seconds for claims, surprises, and resets.
- Standard segments: 18-25 seconds for explanation.
- Longer segments: 28-35 seconds only for the code-execution and migration-playbook sections.

The pacing should feel unpredictable on purpose: full-screen avatar, document proof, animated token counters, terminal evidence, side-by-side comparisons, then back to direct address.

## Avatar Plan

Visible avatar blocks:

| Block | Segments | Treatment | Purpose |
|---|---:|---|---|
| A | 1 | Avatar V full-screen | Cold open and promise |
| C | 6 | Avatar V side-screen | Thesis reset |
| E | 13 | Avatar V side-screen | Security warning |
| G | 22 | Avatar V side-screen | Practical rule |
| H | 30 | Hidden avatar / voice-only | Subscribe / like / notification CTA before closing avatar |
| I | 31-32 | Avatar V full-screen | Recap and close |

All other HeyGen scenes should be blank / hidden-avatar voice-only. Remotion and HyperFrames fill those frames with real docs, screenshots, terminal captures, tables, code, and animated annotations.

## Production Rule

This video must not look like generic circles connected to circles.

Every non-avatar segment needs one of these visual foundations:

- a real source page screenshot with highlighted text,
- a terminal or code execution capture,
- a browser capture,
- a local JARVIS artifact,
- a dense comparison table,
- an animated token meter,
- or a concrete mock workflow with data moving through systems.

Generated images are optional and should be rare. Static images can be used as a base layer, but the main lift comes from Remotion/HyperFrames overlays: zoom punches, cursor movement, marker circles, row highlights, typing, counters, wipes, and callouts.

## HeyGen Workflow

Use one HeyGen project with 9 scenes:

1. Block A: Avatar V full-screen.
2. Block B: hidden avatar / voice-only.
3. Block C: Avatar V side-screen.
4. Block D: hidden avatar / voice-only.
5. Block E: Avatar V side-screen.
6. Block F: hidden avatar / voice-only.
7. Block G: Avatar V side-screen.
8. Block H: hidden avatar / voice-only.
9. Block I: Avatar V full-screen.

Use the block text from `02-script/HEYGEN-PASTE.txt`.

Dialogue rule:

- Use collective language: we, our, ours.
- Avoid first-person singular in the dialogue.
- The only approved exception is the first sentence of segment 1: "I am the avatar for Dr. Terry Byrd..."
- Put subscribe / like / notification-bell CTA before the final full-screen talking-head closing block, not inside the final close.

For graphics-only blocks, keep the 1-second SSML breaks between segments. Those pauses become reliable scene boundaries for Remotion timing.

## Remotion / HyperFrames Build

Primary media path after HeyGen export:

`video-12-mcp-token-stack/10-videos/heygen-source.mp4`

Recommended asset folders:

- `09-stills/`: screenshots and generated stills.
- `09-recordings/`: short screen recordings, terminal captures, browser captures.
- `03-remotion/public/stills/`: symlink to `09-stills`.
- `03-remotion/public/recordings/`: symlink to `09-recordings`.

Build sequence:

1. Drop HeyGen MP4 at `10-videos/heygen-source.mp4`.
2. Detect 1-second pauses and derive segment timing.
3. Capture source screenshots listed in `02-script/VISUAL-SPEC.md`.
4. Build `Main.tsx` as segment data mapped to shot components.
5. Render a 60-second preview first: segments 1-6.
6. QA for text size, blank frames, avatar overlap, audio sync, and generic visuals.
7. Render full MP4.

## Capture Priorities

The video needs real evidence. Capture these first:

- Cloudflare Code Mode article: 1,000-token API and 1.17M comparison.
- Anthropic Tool Search article: 55K token setup, 85% reduction, accuracy numbers.
- Anthropic Code Execution with MCP article: Google Drive to Salesforce, 150K to 2K.
- Anthropic Programmatic Tool Calling docs: MCP connector restriction.
- Arcade 4,027-tool test: 56% regex, 64% BM25.
- Scalekit benchmark: 1,365 CLI tokens vs 44,026 MCP tokens and 28% failure rate.
- Bright Data tools docs: 11 groups and `GROUPS=` / `TOOLS=` scope loading.
- JARVIS local artifacts: skills folder, CLI scripts, wiki/command-center evidence, a `/mcp` token-cost screenshot if available.

## Success Standard

The finished video should feel like an engineering investigation, not a slide deck:

- The viewer sees the claims in source material.
- The viewer sees real token numbers, not only narration.
- The viewer gets a concrete migration order.
- The viewer understands where MCP still wins.
- The viewer leaves with a mental model they can implement.
