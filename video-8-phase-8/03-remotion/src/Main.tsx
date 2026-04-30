import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  OffthreadVideo,
  Audio,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { SEGMENTS } from './segmentContent';
import { AnimatedText } from './compositions/AnimatedText';
import {
  LowerThird,
  NumberedBadges,
  WikiConflict,
  BlindSpotsPanels,
  SiloBridge,
  QueueList,
  Terminal,
  ThreePhase,
  Flowchart,
  BridgeClusters,
  SketchedBridge,
  CardSort,
  RiskTable,
  LoopDiagram,
  DailyTimeline,
  CostDashboard,
  LiveQueue,
  ApplyCards,
  Orbiting,
  VerbSweeps,
  EndCard,
} from './compositions/customSegments';
import type { SegmentSpec } from './types';

function renderSegment(seg: SegmentSpec, durationInFrames: number) {
  switch (seg.kind) {
    case 'none':
      return null;

    case 'lower-third':
      return (
        <LowerThird
          title={seg.title}
          subtitle={seg.subtitle || ''}
          sweepInAt={(seg.data?.sweepInAt as number) || 0}
          durationInFrames={durationInFrames}
        />
      );

    case 'numbered-badges':
      return <NumberedBadges labels={(seg.data?.labels as string[]) || []} durationInFrames={durationInFrames} />;

    case 'wiki-conflict':
      // Segment 3 reuses this slot but with three-panel layout
      if (seg.segment === 3) {
        return (
          <BlindSpotsPanels
            zone={seg.composition}
            title={seg.title}
            lines={seg.lines || []}
            durationInFrames={durationInFrames}
          />
        );
      }
      return (
        <WikiConflict
          zone={seg.composition}
          title={seg.title}
          data={seg.data as { leftWiki: { name: string; value: string }; rightWiki: { name: string; value: string } }}
          durationInFrames={durationInFrames}
        />
      );

    case 'silo-bridge':
      return (
        <SiloBridge
          zone={seg.composition}
          title={seg.title}
          data={seg.data as { topCloud: { name: string; concept: string }; bottomCloud: { name: string; concept: string } }}
          durationInFrames={durationInFrames}
        />
      );

    case 'queue-list':
      return (
        <QueueList
          zone={seg.composition}
          title={seg.title}
          subtitle={seg.subtitle}
          durationInFrames={durationInFrames}
        />
      );

    case 'three-phase':
      return (
        <ThreePhase
          zone={seg.composition}
          title={seg.title}
          data={seg.data as { phases: Array<{ duration: number; label: string }> }}
          durationInFrames={durationInFrames}
        />
      );

    case 'flowchart':
      return (
        <Flowchart
          zone={seg.composition}
          title={seg.title}
          data={seg.data as { nodes: Array<{ id: string; label: string; pos: { col: number; row: number }; shape?: string }> }}
          durationInFrames={durationInFrames}
        />
      );

    case 'terminal':
      return (
        <Terminal
          zone={seg.composition}
          lines={(seg.data?.lines as string[]) || []}
          durationInFrames={durationInFrames}
        />
      );

    case 'bridge-clusters':
      return (
        <BridgeClusters
          zone={seg.composition}
          title={seg.title}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={seg.data as any}
          durationInFrames={durationInFrames}
        />
      );

    case 'sketched-bridge':
      return (
        <SketchedBridge
          zone={seg.composition}
          title={seg.title}
          data={seg.data as { leftCard: { title: string; phrase: string }; rightCard: { title: string; phrase: string } }}
          durationInFrames={durationInFrames}
        />
      );

    case 'card-sort':
      return (
        <CardSort
          zone={seg.composition}
          title={seg.title}
          data={seg.data as { cards: Array<{ title: string; target: string; tier: 'low' | 'medium' | 'high' }> }}
          durationInFrames={durationInFrames}
        />
      );

    case 'risk-table':
      return (
        <RiskTable
          zone={seg.composition}
          title={seg.title}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={seg.data as any}
          durationInFrames={durationInFrames}
        />
      );

    case 'loop-diagram':
      return (
        <LoopDiagram
          data={seg.data as { nodes: Array<{ id: string; label: string; color: string; angle: number }> }}
          durationInFrames={durationInFrames}
        />
      );

    case 'daily-timeline':
      return (
        <DailyTimeline
          zone={seg.composition}
          title={seg.title}
          data={seg.data as { events: Array<{ time: string; label: string; icon: string }> }}
          durationInFrames={durationInFrames}
        />
      );

    case 'cost-dashboard':
      return (
        <CostDashboard
          zone={seg.composition}
          title={seg.title}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={seg.data as any}
          durationInFrames={durationInFrames}
        />
      );

    case 'live-queue':
      return (
        <LiveQueue
          zone={seg.composition}
          title={seg.title}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={seg.data as any}
          durationInFrames={durationInFrames}
        />
      );

    case 'apply-cards':
      return (
        <ApplyCards
          zone={seg.composition}
          title={seg.title}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={seg.data as any}
          durationInFrames={durationInFrames}
        />
      );

    case 'orbiting':
      return (
        <Orbiting
          data={seg.data as { elements: Array<{ pos: string; icon: string; label: string }> }}
          durationInFrames={durationInFrames}
        />
      );

    case 'verb-sweeps':
      return <VerbSweeps data={seg.data as { verbs: string[] }} durationInFrames={durationInFrames} />;

    case 'end-card':
      return (
        <EndCard
          zone={seg.composition}
          data={seg.data as { chips: string[] }}
          durationInFrames={durationInFrames}
        />
      );

    case 'standard':
      return (
        <AnimatedText
          title={seg.title}
          subtitle={seg.subtitle}
          lines={seg.lines}
          style={seg.style}
          zone={seg.composition}
          durationInFrames={durationInFrames}
        />
      );

    default:
      return null;
  }
}

// ─── Per-composition <OffthreadVideo> styling ────────────────────────────────
//
// The HeyGen source video is full-frame avatar at 1920×1080. To respect each
// segment's `composition`, we size/position the video element so the avatar
// appears in its assigned zone (full-screen, side-third, PiP corner, etc.).
// The Remotion graphic renders BEHIND for non-FS segments (so it fills the
// area not covered by the avatar) and ON TOP for FS segments where the
// graphic is meant to overlay the avatar (lower-third, badges, etc.).

type CompositionMode =
  | 'FS' | 'FS-G' | 'BR-C' | 'BR-S' | 'BL-C' | 'BL-S' | 'SL' | 'SR' | 'CS';

function getVideoStyle(composition: CompositionMode): React.CSSProperties {
  const pipBase: React.CSSProperties = {
    position: 'absolute',
    width: 384,
    height: 384,
    objectFit: 'cover',
    border: '3px solid #00D4FF',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  };

  switch (composition) {
    case 'FS':
      return {
        position: 'absolute',
        width: 1920,
        height: 1080,
        top: 0,
        left: 0,
        objectFit: 'cover',
      };
    case 'FS-G':
      // Avatar hidden — graphic fills the screen
      return { display: 'none' };
    case 'BR-C':
      return { ...pipBase, bottom: 20, right: 20, borderRadius: '50%' };
    case 'BR-S':
      return { ...pipBase, bottom: 20, right: 20, borderRadius: 24 };
    case 'BL-C':
      return { ...pipBase, bottom: 20, left: 20, borderRadius: '50%' };
    case 'BL-S':
      return { ...pipBase, bottom: 20, left: 20, borderRadius: 24 };
    case 'SL':
      return {
        position: 'absolute',
        width: 640,
        height: 1080,
        top: 0,
        left: 0,
        objectFit: 'cover',
      };
    case 'SR':
      return {
        position: 'absolute',
        width: 640,
        height: 1080,
        top: 0,
        right: 0,
        objectFit: 'cover',
      };
    case 'CS':
      return {
        position: 'absolute',
        width: 600,
        height: 900,
        top: 90,
        left: 660,
        objectFit: 'cover',
        borderRadius: 24,
      };
  }
}

// FS segments where the graphic should render ON TOP of the full-screen avatar
// (vs. behind it, which is the default for non-FS voiceover segments).
const FS_GRAPHIC_ON_TOP_KINDS = new Set([
  'lower-third',     // segment 1 — sweeps in over avatar
  'numbered-badges', // segment 7 — semi-transparent badges in upper background
  'loop-diagram',    // segment 17 — loop diagram in background (semi-transparent)
  'verb-sweeps',     // segment 27 — verbs sweep across at low opacity
]);

export const Main: React.FC = () => {
  const { fps } = useVideoConfig();
  const toFrames = (seconds: number) => Math.round(seconds * fps);
  const videoSrc = staticFile('heygen-source.mp4');

  // Build sequence ranges that cover every frame of the composition.
  // Each segment's Sequence runs from its start until the NEXT segment's
  // start (or to composition end for the last one). This keeps the HeyGen
  // video visible during the natural pauses/transitions between segments.
  const ranges = SEGMENTS.map((seg, i) => {
    const start = seg.start;
    const end = i < SEGMENTS.length - 1 ? SEGMENTS[i + 1].start : 798.082;
    return { seg, fromFrame: toFrames(start), durationInFrames: toFrames(end - start) };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Audio plays continuously across the whole composition */}
      <Audio src={videoSrc} />

      {/* Per-segment: video positioning + graphic per composition mode */}
      {ranges.map(({ seg, fromFrame, durationInFrames }) => {
        // For displayed graphic content we use the segment's ORIGINAL duration
        // (not the extended Sequence duration that covers the gap), so exit
        // animations time correctly.
        const graphicDurationInFrames = toFrames(seg.duration);

        // ── Image segments: HeyGen video full-screen, NO graphic ────────────
        if (seg.type === 'image') {
          return (
            <Sequence
              key={seg.segment}
              from={fromFrame}
              durationInFrames={durationInFrames}
              name={`Seg ${seg.segment} — image`}
            >
              <OffthreadVideo
                src={videoSrc}
                muted
                startFrom={fromFrame}
                style={{
                  position: 'absolute',
                  width: 1920,
                  height: 1080,
                  top: 0,
                  left: 0,
                  objectFit: 'cover',
                }}
              />
            </Sequence>
          );
        }

        // ── Voiceover segments ──────────────────────────────────────────────
        const overlay = renderSegment(seg, graphicDurationInFrames);
        const videoStyle = getVideoStyle(seg.composition);
        const isFS = seg.composition === 'FS';
        const renderGraphicOnTop = isFS && overlay && FS_GRAPHIC_ON_TOP_KINDS.has(seg.kind);

        return (
          <Sequence
            key={seg.segment}
            from={fromFrame}
            durationInFrames={durationInFrames}
            name={`Seg ${seg.segment} — ${seg.title || seg.kind}`}
          >
            {/* Non-FS: graphic underneath as background; avatar PiP'd on top */}
            {!isFS && overlay}

            {/* HeyGen video positioned per the segment's composition */}
            <OffthreadVideo
              src={videoSrc}
              muted
              startFrom={fromFrame}
              style={videoStyle}
            />

            {/* FS segments with overlays meant to layer on top (lower-third etc.) */}
            {renderGraphicOnTop && overlay}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
