# Remotion QA Checklist

## Storage And Environment

- Render from local storage, not Dropbox/iCloud CloudStorage, when using large media or `node_modules`.
- If Remotion, Git, or Node reports file read timeouts, copy the project source plus `public/` assets to a local folder and run `npm ci`.
- Keep final MP4s in Dropbox only after rendering.
- Confirm `node_modules` exists or install with `npm ci`.
- Confirm the browser required by Remotion can launch; if needed, run `npx remotion browser`.

## Source Inspection

Check these files before editing:

- `src/Main.tsx`: composition assembly, video layer, layout transitions, graphic layers.
- `src/Root.tsx`: total duration, FPS, width, height.
- `src/segmentContent.ts`: segment timings, compositions, and scene types.
- `src/compositions/*`: text, charts, custom graphics, and exit animations.
- `public/`: HeyGen proxy video and audio assets.

Run:

```bash
npx tsc --noEmit --pretty false
ffprobe -v error -show_entries format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate -of default=noprint_wrappers=1 public/heygen-remotion-proxy.mp4
ffprobe -v error -show_entries format=duration,size:stream=index,codec_type,codec_name -of default=noprint_wrappers=1 public/heygen-audio.m4a
```

## Avatar Continuity

Use one continuous avatar media layer when the avatar should play continuously over the narration.

Preferred pattern:

- Render `<OffthreadVideo src={videoSrc} muted />` once at the top composition level.
- Compute the active segment from the global frame.
- Map each segment to an avatar layout: full-screen, hidden, lower-right circle, side panel, centered, etc.
- Interpolate from the previous layout to the current layout over 12-18 frames with eased progress.
- Keep the audio as a separate continuous `<Audio src={audioSrc} />`.

Avoid:

- Mounting a new `<Video>` inside every segment for the same avatar clip.
- Seeking with `startFrom={fromFrame}` inside many short sequences unless the clip truly needs independent timing.
- Switching `display: none` abruptly for avatar layout changes that should look like editorial transitions.

## Layering Rules

Decide layer order intentionally:

- Background graphics render below the avatar for PiP or side-avatar scenes.
- Full-screen lower thirds, title graphics, and end-card overlays can render above the avatar.
- Image/full-graphic segments can hide the avatar only when that is the intended visual.

Inspect for:

- Avatar face covering text, charts, buttons, labels, or important UI.
- Graphics covering the avatar face or mouth during narration.
- PiP border/circle cropping cutting off the face awkwardly.
- Text running under the avatar circle at lower-right or lower-left.

## Transition Checks

At every changed boundary, inspect:

- 5 seconds before the boundary.
- The boundary frame.
- 5 seconds after the boundary.

Look for:

- hard jumps caused by remounted video elements,
- black frames,
- duplicate or skipped frames,
- graphics disappearing too early,
- exit animations still running after the next scene starts,
- avatar changing size/position without easing,
- PiP popping in before/after the background scene.

Render targeted clips:

```bash
# First ~35 seconds at 25fps
npx remotion render src/index.ts Main out/intro-transition-check.mp4 --frames=0-875 --codec=h264 --concurrency=4

# One transition window. Replace frame numbers with the target range.
npx remotion render src/index.ts Main out/transition-check.mp4 --frames=680-760 --codec=h264 --concurrency=4
```

Render quick stills:

```bash
npx remotion still src/index.ts Main out/check-transition.png --frame=708 --scale=0.25
```

## Final Render QA

After rendering:

```bash
ffprobe -v error -show_entries format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate -of default=noprint_wrappers=1 out/video-remotion-fixed.mp4
```

Then sample frames from:

- intro, especially the talking avatar before the first transition,
- early transition from full-screen avatar to PiP,
- at least one image/graphic-only segment,
- at least one mid-video PiP segment,
- final 30 seconds.

Use:

```bash
python3 /Users/terrybyrd/.agents/skills/watch/scripts/watch.py out/video-remotion-fixed.mp4 --start 0 --end 35 --max-frames 18 --no-whisper
python3 /Users/terrybyrd/.agents/skills/watch/scripts/watch.py out/video-remotion-fixed.mp4 --start 2:20 --end 2:35 --max-frames 12 --no-whisper
python3 /Users/terrybyrd/.agents/skills/watch/scripts/watch.py out/video-remotion-fixed.mp4 --start 12:00 --end 12:27 --max-frames 12 --no-whisper
```

## Common Fixes

### Herky-Jerky Intro Avatar Motion

Likely cause: the avatar video is mounted, seeked, or decoded in a way that differs from the source clip.

Fix:

- Use one continuous `<OffthreadVideo>` for the avatar.
- Avoid per-segment source remounts.
- Keep audio continuous and independent.
- Render a short intro clip and inspect motion, not just stills.

### Abrupt Scene Transitions

Likely cause: each segment has isolated video and graphic mounting.

Fix:

- Extend segment ranges to cover gaps only when needed.
- Interpolate layout between previous and current avatar placements.
- Add a small transition wash only if it improves the edit.
- Keep graphic exit animations timed to the original segment duration.

### Avatar Or Graphics Cover Important Content

Likely cause: segment composition zones were not checked against actual text layout.

Fix:

- Reposition PiP avatar to the opposite corner or lower the opacity only if intentional.
- Move text safe areas away from avatar zones.
- Render stills at each segment where the avatar changes zone.

### Final Render Is Slow

`OffthreadVideo` is more deterministic for exact frame rendering, but can be slower with huge source clips.

Use local storage, reduce concurrency if Chrome crashes, and avoid Dropbox/iCloud during render. Do not revert to per-segment `<Video>` if that reintroduces motion problems.
