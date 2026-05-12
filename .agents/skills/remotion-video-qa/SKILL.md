---
name: remotion-video-qa
description: Quality-control workflow for Jarvis Remotion videos. Use when Codex is creating, editing, rendering, or reviewing Remotion video projects and needs to prevent or diagnose avatar motion jitter, hard scene cuts, bad transitions, avatar/graphics overlap, wrong layer order, blank frames, audio/video drift, poor render settings, Dropbox/CloudStorage render failures, or other final-video imperfections.
---

# Remotion Video QA

Use this skill as a required QA pass while building Jarvis Remotion videos, not only after the final render. Prefer fixing the Remotion source composition over patching a flattened MP4.

For the full checklist, read [references/remotion-qa-checklist.md](references/remotion-qa-checklist.md).

## Core Workflow

1. **Work from local storage**
   - Do not render from Dropbox/iCloud `CloudStorage` folders when large video assets or `node_modules` are involved.
   - Prefer a local project copy such as `/Volumes/ORICO/...`, `~/Movies/...`, or `/private/tmp/...`.
   - Keep Dropbox for finished files and backups, not active Remotion rendering.

2. **Verify source structure before rendering**
   - Inspect `src/Main.tsx`, `src/Root.tsx`, `src/segmentContent.ts`, `public/`, and `package.json`.
   - Confirm large media exists locally with `ffprobe`.
   - Run `npx tsc --noEmit --pretty false`.

3. **Protect avatar continuity**
   - Avoid remounting a new `<Video>` for each segment when the same talking avatar should play continuously.
   - Prefer one continuous `<OffthreadVideo>` avatar layer for the source clip, with animated layout/crop/opacity changes per segment.
   - If segment layouts change from full-screen to PiP or side panels, interpolate layout values instead of hard-cutting.

4. **Check layer order**
   - Decide per segment whether graphics render under the avatar or over it.
   - Full-screen avatar segments may need overlays above the avatar.
   - PiP/side-avatar segments usually need graphics behind the avatar.
   - Verify the avatar does not cover important text, charts, or UI, and graphics do not cover the avatar face unless intentionally designed.

5. **Render targeted QA clips**
   - Before a full render, render short clips around risky areas:
     - intro: `--frames=0-875` for the first ~35 seconds at 25fps
     - segment boundaries: render 5-10 seconds before and after each transition being changed
     - end card: render the final 20-30 seconds
   - Use stills for quick layout checks and short MP4 clips for motion checks.

6. **Inspect the finished MP4**
   - Run `ffprobe` on the final output.
   - Sample frames from the intro, several middle transitions, and the end.
   - Watch at least the intro and changed transitions as motion, not stills only.

## Commands

Use these from the Remotion project directory:

```bash
npx tsc --noEmit --pretty false
ffprobe -v error -show_entries format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate -of default=noprint_wrappers=1 public/heygen-remotion-proxy.mp4
npx remotion still src/index.ts Main out/check-frame.png --frame=708 --scale=0.25
npx remotion render src/index.ts Main out/intro-transition-check.mp4 --frames=0-875 --codec=h264 --concurrency=4
npx remotion render src/index.ts Main out/video-remotion-fixed.mp4 --codec=h264 --concurrency=4
```

Use the local video watch workflow for rendered clips:

```bash
python3 /Users/terrybyrd/.agents/skills/watch/scripts/watch.py out/video-remotion-fixed.mp4 --start 0 --end 35 --max-frames 18 --no-whisper
```

## Pass Criteria

A Jarvis Remotion render is not done until:

- TypeScript passes.
- The intro talking avatar motion is smooth.
- Segment transitions animate or intentionally cut cleanly.
- Avatar PiP/side/full-screen placement changes do not remount or seek the source clip unexpectedly.
- Graphics and avatar layers do not obscure each other in important areas.
- Representative intro, middle, and ending samples look correct.
- Final MP4 has expected duration, resolution, video codec, and audio stream.
