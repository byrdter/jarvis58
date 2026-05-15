# Video 12 Remotion Production Notes

## Source

HeyGen source used:

`../10-videos/heygen-source.mp4`

Original upload path retained:

`../10-ouput/heygen-source.mp4`

The source is 1920x1080, 25fps, 730.007 seconds.

## Timing

`transcribe_and_align.py` created `segment-timings.json` from word timestamps.

The actual HeyGen MP4 does not contain every segment from the written script. In the transcript, segment 3 is absorbed into the long segment 2 block, and the planned scoped-MCP / skills narration block for segments 14-16 is absent. The Remotion timeline follows the actual audio in the MP4 instead of forcing silent visual slots for missing narration.

## Visual Approach

The automated Chrome screenshot pass was unreliable in this environment. The render therefore uses source-proof artifact panels with browser chrome, source URLs, highlighted figures, metrics, tables, and workflow cards. This is still evidence-oriented, but it is not a literal screenshot capture of each article page.

## QA

Checks completed:

- TypeScript compile: passed.
- Still frame checks:
  - intro avatar,
  - source-proof panel,
  - side-avatar layout,
  - CTA card,
  - closing avatar.
- Final render: `../10-videos/video-12.mp4`
- Final MP4: 1920x1080, 25fps, H.264 video, AAC audio, 730.069 seconds.

