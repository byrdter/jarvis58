# REMOTION FIX-UP — TWO ISSUES TO PATCH

The current Remotion project at `03-remotion/` works but has two problems. Apply these two patches **without re-authoring the project from scratch**. Modify `Main.tsx` and (if applicable) `segmentContent.ts` only. Do NOT touch the AnimatedText component, the styles, or the timing logic — those are correct.

---

## ISSUE 1 — Avatar position is not respected

**Symptom:** On every voiceover segment, the Remotion graphic covers the HeyGen avatar. The avatar appears at full-screen size in the background and the Remotion overlay sits on top of it. The `composition` field per segment (BR-C, SR, SL, etc.) is currently ignored.

**Cause:** `Main.tsx` renders `<OffthreadVideo>` at the default full-screen size for every segment. The composition mode is never used to position or size the video.

**Fix:** the HeyGen `<OffthreadVideo>` element must be **positioned and sized per segment** based on the segment's `composition` field. The Remotion graphic continues to render in the remaining area as it does today.

### Per-composition video positioning spec

For each segment, wrap the `<OffthreadVideo>` in an `<AbsoluteFill>` and apply these styles to the video element based on the segment's `composition`:

| Composition | Style on `<OffthreadVideo>` | Visual result |
|---|---|---|
| `FS` | `width: 1920, height: 1080, top: 0, left: 0, objectFit: 'cover'` | Avatar fills frame (current default) |
| `FS-G` | `display: 'none'` | Avatar hidden — Remotion graphic fills the screen |
| `BR-C` | `position: 'absolute', width: 384, height: 384, bottom: 20, right: 20, objectFit: 'cover', borderRadius: '50%', border: '3px solid #00D4FF', boxShadow: '0 4px 24px rgba(0,0,0,0.5)'` | Circle PiP, bottom-right |
| `BR-S` | Same as `BR-C` but `borderRadius: '24px'` | Rounded-square PiP, bottom-right |
| `BL-C` | `width: 384, height: 384, bottom: 20, left: 20, ...rest same as BR-C` | Circle PiP, bottom-left |
| `BL-S` | Same as `BL-C` but `borderRadius: '24px'` | Rounded-square PiP, bottom-left |
| `SL` | `position: 'absolute', width: 640, height: 1080, top: 0, left: 0, objectFit: 'cover'` | Avatar holds left third |
| `SR` | `position: 'absolute', width: 640, height: 1080, top: 0, right: 0, objectFit: 'cover'` | Avatar holds right third |
| `CS` | `position: 'absolute', width: 600, height: 900, top: 90, left: 660, objectFit: 'cover', borderRadius: '24px'` | Avatar centered with orbiting graphics around |

**Important:** `objectFit: 'cover'` may show the HeyGen frame's center area. If the avatar isn't centered in the HeyGen frame, you may need `objectPosition` to bias which portion shows in the PiP — but try `'cover'` first; for most HeyGen recordings the avatar is centered.

### Implementation pattern (Main.tsx)

```typescript
import { AbsoluteFill, OffthreadVideo, Audio, Sequence, staticFile } from 'remotion';

type Composition = 'FS' | 'FS-G' | 'BR-C' | 'BR-S' | 'BL-C' | 'BL-S' | 'SL' | 'SR' | 'CS';

function getVideoStyle(composition: Composition): React.CSSProperties {
  switch (composition) {
    case 'FS':
      return { position: 'absolute', width: 1920, height: 1080, top: 0, left: 0, objectFit: 'cover' };
    case 'FS-G':
      return { display: 'none' };
    case 'BR-C':
      return {
        position: 'absolute', width: 384, height: 384, bottom: 20, right: 20,
        objectFit: 'cover', borderRadius: '50%',
        border: '3px solid #00D4FF',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      };
    case 'BR-S':
      return {
        position: 'absolute', width: 384, height: 384, bottom: 20, right: 20,
        objectFit: 'cover', borderRadius: '24px',
        border: '3px solid #00D4FF',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      };
    case 'BL-C':
      return {
        position: 'absolute', width: 384, height: 384, bottom: 20, left: 20,
        objectFit: 'cover', borderRadius: '50%',
        border: '3px solid #00D4FF',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      };
    case 'BL-S':
      return {
        position: 'absolute', width: 384, height: 384, bottom: 20, left: 20,
        objectFit: 'cover', borderRadius: '24px',
        border: '3px solid #00D4FF',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      };
    case 'SL':
      return { position: 'absolute', width: 640, height: 1080, top: 0, left: 0, objectFit: 'cover' };
    case 'SR':
      return { position: 'absolute', width: 640, height: 1080, top: 0, right: 0, objectFit: 'cover' };
    case 'CS':
      return {
        position: 'absolute', width: 600, height: 900, top: 90, left: 660,
        objectFit: 'cover', borderRadius: '24px',
      };
  }
}

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Audio plays continuously across all segments — this stays as-is */}
      <Audio src={staticFile('heygen-source.mp4')} />

      {/* For each segment, render the OffthreadVideo with the correct positioning */}
      {segments.map((seg) => {
        const fromFrame = Math.round(seg.start * 25);
        const durationFrames = Math.round(seg.duration * 25);

        return (
          <Sequence key={seg.segment} from={fromFrame} durationInFrames={durationFrames}>
            {/* Remotion graphic background fills 1920x1080 first (only for voiceover segments that need it) */}
            {seg.type === 'voiceover' && seg.composition !== 'FS' && (
              <AnimatedText
                style={seg.style}
                title={seg.titleText}
                text={seg.bodyText}
                segmentNumber={seg.segment}
                avatarZone={seg.composition}
              />
            )}

            {/* HeyGen avatar layered on top, sized + positioned per composition */}
            <OffthreadVideo
              src={staticFile('heygen-source.mp4')}
              muted
              style={getVideoStyle(seg.composition)}
              startFrom={fromFrame}     // play the right portion of the source
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

**Key change:** the Remotion graphic renders FIRST (as the background), then the HeyGen video renders ON TOP of it but constrained to its assigned PiP/side area. The graphic is visible in the area NOT covered by the video. For `FS-G`, the video is hidden; for `FS`, only the video shows.

For `FS` segments, no graphic is rendered — only the HeyGen video. (Special exceptions like segment 1's lower-third or segment 7's badges should still render — check the original production prompt for those.)

---

## ISSUE 2 — Segment 18 has a Remotion graphic when it shouldn't

**Symptom:** Segment 18 ("Architecture: where everything lives") shows a Remotion-authored graphic on top of the baked-in `018-segment.png` image. Both the HeyGen image AND the Remotion overlay appear.

**Cause:** `segmentContent.ts` (or wherever segment routing is decided) treats segment 18 as a voiceover segment instead of an image segment.

**Fix:** Segment 18 must be classified as an image segment, exactly like segments 2, 13, 24, 25, 26. Image segments render NO Remotion overlay — only the HeyGen video plays through.

Per `segment-timings.json`:
```json
{ "segment": 18, "type": "image", "imageFile": "018-segment.png", "composition": "SR", ... }
```

The `type: "image"` is the source of truth. The orchestrator should use:

```typescript
{seg.type === 'image' ? (
  // Just render the HeyGen video (the image is baked in there)
  <OffthreadVideo
    src={staticFile('heygen-source.mp4')}
    muted
    style={{ position: 'absolute', width: 1920, height: 1080, top: 0, left: 0, objectFit: 'cover' }}
    startFrom={fromFrame}
  />
) : (
  // Voiceover segment: graphic background + positioned avatar PiP
  <>
    <AnimatedText ... />
    <OffthreadVideo ... style={getVideoStyle(seg.composition)} ... />
  </>
)}
```

For image segments, ALWAYS render the HeyGen video at full-screen regardless of the `composition` field — the image is already in the frame and the avatar (if any) is composed in by HeyGen.

**The complete list of image segments to skip Remotion overlays for:** 2, 13, 18, 24, 25, 26.

---

## VERIFICATION CHECKLIST

After applying both patches, render a 30-second test clip covering segment 28 (BR-C composition):

```bash
cd 03-remotion
npx remotion render src/index.ts Main out/test-segment-28.mp4 \
  --frames=18225-18800
```

**Expected result:** the avatar appears as a circle PiP in the bottom-right corner (~384px wide, cyan border, shadow), and the SUBSCRIBE button + SHARE arrow + comment chips render in the rest of the frame. No more full-screen gradient covering the avatar.

Then test segment 18:

```bash
npx remotion render src/index.ts Main out/test-segment-18.mp4 \
  --frames=11341-11865
```

**Expected result:** only the HeyGen-baked architecture diagram image is visible (with whatever avatar HeyGen put on top of it). NO Remotion overlay.

If both test clips look correct, run the full render again:

```bash
npm run render
```

---

## SUMMARY OF CHANGES

- `Main.tsx`: add `getVideoStyle(composition)` helper; restructure each `<Sequence>` to render Remotion graphic FIRST then `<OffthreadVideo>` ON TOP with the per-composition style
- Image segments (2, 13, 18, 24, 25, 26): skip the AnimatedText overlay entirely, render only the full-screen HeyGen video
- Audio: NO CHANGES — keeps the single `<Audio>` element at root level for clean passthrough

Do not modify `AnimatedText.tsx`, the visual styles, the spring physics, or `Root.tsx`.
