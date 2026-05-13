/**
 * ShotDemo — single composition that previews every shot type back-to-back.
 *
 * Render with: `bun run demo` (or `npm run demo`). Total length 52 s @ 25 fps.
 *
 * Goal: see the skeleton of the menu before wiring a real video. Each entry
 * uses placeholder data so no media assets are required.
 */
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  TalkingHeadFull,
  TalkingHeadPip,
  TerminalTape,
  CodeReveal,
  DiagramBuild,
  FileTree,
  Diff,
  BrowserPlayback,
  ArtifactInspection,
  ZoomPunch,
  Notification,
  MetricTicker,
  SideBySide,
  COLORS, FONT,
} from './shot-types';

const PER_SHOT = 100; // 4 s @ 25 fps
const INTRO = 60;     // 2.4 s

type Entry = { kind: string; node: React.ReactNode };

const ENTRIES: Entry[] = [
  { kind: 'talking-head-full', node: <TalkingHeadFull label="Intro / outro shot" /> },
  {
    kind: 'talking-head-pip',
    node: (
      <TalkingHeadPip
        corner="BR"
        shape="circle"
        underlay={
          <DiagramBuild
            title="Avatar PiP over any underlay"
            nodes={[
              { id: 'a', label: 'Script', x: 0.15, y: 0.30, shape: 'pill' },
              { id: 'b', label: 'Pipeline', x: 0.50, y: 0.30, shape: 'pill', accent: 'warm' },
              { id: 'c', label: 'Video', x: 0.85, y: 0.30, shape: 'pill', accent: 'good' },
            ]}
            edges={[{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]}
          />
        }
      />
    ),
  },
  {
    kind: 'terminal-tape',
    node: (
      <TerminalTape
        title="claude — bash"
        prompt="$"
        lines={[
          { cmd: 'remotion render src/index.ts Main out/v11.mp4' },
          { out: '> Bundled in 2.4s' },
          { out: '> Rendering frames 0..2400  ████████████░  92%' },
          { cmd: 'open out/v11.mp4' },
        ]}
      />
    ),
  },
  {
    kind: 'code-reveal',
    node: (
      <CodeReveal
        title="src/composer.ts"
        language="ts"
        lines={[
          'import { renderShot } from "./shot-types";',
          '',
          'export function compose(script: Segment[]) {',
          '  return script.map((seg) => renderShot(seg.shot, seg.data));',
          '}',
          '',
          '// One menu. Twelve shapes. Endless videos.',
        ]}
      />
    ),
  },
  {
    kind: 'diagram-build',
    node: (
      <DiagramBuild
        title="Three Paths Converge"
        nodes={[
          { id: 'api', label: 'Path A\nAPI', x: 0.15, y: 0.25, shape: 'rect' },
          { id: 'browser', label: 'Path B\nBrowser', x: 0.15, y: 0.55, shape: 'rect', accent: 'warm' },
          { id: 'manual', label: 'Path C\nManual', x: 0.15, y: 0.85, shape: 'rect', accent: 'good' },
          { id: 'folder', label: 'MP4 Folder', x: 0.55, y: 0.55, shape: 'pill' },
          { id: 'video', label: 'Final Video', x: 0.90, y: 0.55, shape: 'circle' },
        ]}
        edges={[
          { from: 'api', to: 'folder' },
          { from: 'browser', to: 'folder' },
          { from: 'manual', to: 'folder' },
          { from: 'folder', to: 'video' },
        ]}
      />
    ),
  },
  {
    kind: 'file-tree',
    node: (
      <FileTree
        root="video-11-production-pipeline/03-remotion/src"
        entries={[
          { path: 'shot-types', isDir: true, depth: 0 },
          { path: 'TalkingHeadFull.tsx', isDir: false, depth: 1 },
          { path: 'TerminalTape.tsx', isDir: false, depth: 1 },
          { path: 'DiagramBuild.tsx', isDir: false, depth: 1 },
          { path: 'CodeReveal.tsx', isDir: false, depth: 1 },
          { path: 'index.ts', isDir: false, depth: 1 },
          { path: 'ShotDemo.tsx', isDir: false, depth: 0 },
          { path: 'Root.tsx', isDir: false, depth: 0 },
        ]}
      />
    ),
  },
  {
    kind: 'diff',
    node: (
      <Diff
        filename="src/Main.tsx"
        removed={[
          'function renderSegment(seg) {',
          '  switch (seg.kind) { /* 22 cases */ }',
          '}',
        ]}
        added={[
          'function renderSegment(seg) {',
          '  return renderShot(seg.shot, seg.data);',
          '}',
        ]}
      />
    ),
  },
  {
    kind: 'browser-playback',
    node: (
      <BrowserPlayback
        url="app.heygen.com/studio"
        caption="Path B — Claude Code drives the HeyGen editor"
        speedX={4}
      />
    ),
  },
  {
    kind: 'artifact-inspection',
    node: (
      <ArtifactInspection
        source="beads:jarvis-q28"
        title="Build shot-types/ menu"
        table={{
          headers: ['field', 'value'],
          rows: [
            ['status', 'in_progress'],
            ['priority', 'P2'],
            ['type', 'feature'],
            ['claimed_by', 'claude'],
            ['target', 'video-11-production-pipeline/03-remotion'],
          ],
        }}
        highlights={[{ row: 0 }, { row: 4 }]}
      />
    ),
  },
  {
    kind: 'zoom-punch',
    node: (
      <ZoomPunch
        focus={{ x: 0.62, y: 0.28, w: 0.20, h: 0.22 }}
        caption="The cost dashboard — $0 / month"
      />
    ),
  },
  {
    kind: 'notification',
    node: (
      <Notification
        app="telegram"
        from="JARVIS"
        text="MACD divergence on SPY — review queued."
      />
    ),
  },
  {
    kind: 'metric-ticker',
    node: <MetricTicker label="Render minutes saved per video" from={0} to={47} suffix=" min" />,
  },
  {
    kind: 'side-by-side',
    node: <SideBySide leftLabel="Manual workflow" rightLabel="Pipeline" />,
  },
];

const TOTAL = INTRO + ENTRIES.length * PER_SHOT;
export const SHOT_DEMO_FRAMES = TOTAL;

const TitleStrip: React.FC<{ index: number; kind: string }> = ({ index, kind }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute', top: 30, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: op,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '10px 22px',
          background: 'rgba(11,14,20,0.85)',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 999,
          color: COLORS.textPrimary,
          fontFamily: FONT.mono,
          fontSize: 20,
          letterSpacing: 1,
        }}
      >
        <span style={{ color: COLORS.textDim }}>
          {String(index + 1).padStart(2, '0')} / {String(ENTRIES.length).padStart(2, '0')} ·{' '}
        </span>
        <span style={{ color: COLORS.accent }}>{kind}</span>
      </div>
    </div>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${COLORS.bgRaised}, ${COLORS.bg})`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.sans,
        color: COLORS.textPrimary,
        opacity: op,
      }}
    >
      <div style={{ color: COLORS.accent, fontSize: 26, letterSpacing: 6, marginBottom: 16 }}>
        VIDEO 11 — SHOT MENU
      </div>
      <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2, marginBottom: 18 }}>
        13 shot types
      </div>
      <div style={{ fontSize: 28, color: COLORS.textDim }}>
        Every segment of every video maps to exactly one of these.
      </div>
    </AbsoluteFill>
  );
};

export const ShotDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sequence from={0} durationInFrames={INTRO} name="Intro">
        <Intro />
      </Sequence>
      {ENTRIES.map((entry, i) => (
        <Sequence
          key={entry.kind}
          from={INTRO + i * PER_SHOT}
          durationInFrames={PER_SHOT}
          name={`${i + 1}. ${entry.kind}`}
        >
          {entry.node}
          <TitleStrip index={i} kind={entry.kind} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
