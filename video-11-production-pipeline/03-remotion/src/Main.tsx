import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {
  ArtifactInspection,
  BrowserPlayback,
  CodeReveal,
  DiagramBuild,
  FileTree,
  MetricTicker,
  SideBySide,
  TerminalTape,
  COLORS,
  FONT,
} from './shot-types';
import type { DiagramNode, DiagramEdge, TerminalLine } from './shot-types';

const SOURCE = 'heygen-source.mp4';
export const VIDEO_11_DURATION_SECONDS = 460.28;
export const VIDEO_11_FRAMES = Math.ceil(VIDEO_11_DURATION_SECONDS * 25);

type AvatarMode = 'full' | 'side-right' | 'none';
type ShotKind =
  | 'talking-head'
  | 'diagram'
  | 'side-by-side'
  | 'terminal'
  | 'metric'
  | 'browser'
  | 'code'
  | 'file-tree'
  | 'artifact';

type Segment = {
  seg: number;
  start: number;
  end: number;
  avatar: AvatarMode;
  shot: ShotKind;
  title: string;
};

const SEGMENTS: Segment[] = [
  { seg: 1, start: 0.02, end: 19.24, avatar: 'full', shot: 'talking-head', title: 'Made in under an hour' },
  { seg: 2, start: 19.24, end: 28.24, avatar: 'none', shot: 'diagram', title: 'Three paths to one video' },
  { seg: 3, start: 28.24, end: 49.94, avatar: 'none', shot: 'side-by-side', title: 'Manual workflow vs pipeline' },
  { seg: 4, start: 49.94, end: 70.84, avatar: 'side-right', shot: 'diagram', title: 'The stack' },
  { seg: 5, start: 70.84, end: 83.12, avatar: 'none', shot: 'diagram', title: 'Optional connectors' },
  { seg: 6, start: 83.12, end: 98.04, avatar: 'none', shot: 'diagram', title: 'Where the choice lives' },
  { seg: 7, start: 98.04, end: 118.92, avatar: 'none', shot: 'terminal', title: 'Path A: API automation' },
  { seg: 8, start: 118.92, end: 141.84, avatar: 'none', shot: 'metric', title: 'Path A cost' },
  { seg: 9, start: 141.84, end: 159.86, avatar: 'none', shot: 'browser', title: 'Path B: browser automation' },
  { seg: 10, start: 159.86, end: 179.54, avatar: 'none', shot: 'side-by-side', title: 'API fees vs browser credits' },
  { seg: 11, start: 179.54, end: 189.96, avatar: 'none', shot: 'browser', title: 'Path C: manual plus pipeline' },
  { seg: 12, start: 189.96, end: 210.02, avatar: 'none', shot: 'code', title: 'Pause protocol' },
  { seg: 13, start: 210.02, end: 220.16, avatar: 'none', shot: 'browser', title: 'The handoff' },
  { seg: 14, start: 220.16, end: 234.05, avatar: 'side-right', shot: 'diagram', title: 'Remotion takes the ball' },
  { seg: 15, start: 234.05, end: 236.77, avatar: 'none', shot: 'diagram', title: 'Five stages' },
  { seg: 16, start: 236.77, end: 254.73, avatar: 'none', shot: 'terminal', title: 'Stage 1: transcribe' },
  { seg: 17, start: 254.73, end: 270.17, avatar: 'none', shot: 'diagram', title: 'Stage 2: plan' },
  { seg: 18, start: 270.17, end: 291.39, avatar: 'none', shot: 'browser', title: 'Stage 3: generate visuals' },
  { seg: 19, start: 291.39, end: 310.61, avatar: 'none', shot: 'file-tree', title: 'Stage 4: Remotion is React' },
  { seg: 20, start: 310.61, end: 327.27, avatar: 'none', shot: 'code', title: 'Transitions and captions' },
  { seg: 21, start: 327.27, end: 339.09, avatar: 'none', shot: 'terminal', title: 'Stage 5: render' },
  { seg: 22, start: 339.09, end: 357.39, avatar: 'side-right', shot: 'diagram', title: 'QA loop' },
  { seg: 23, start: 357.39, end: 360.77, avatar: 'none', shot: 'diagram', title: 'Which path?' },
  { seg: 24, start: 360.77, end: 368.69, avatar: 'none', shot: 'diagram', title: 'Decision: volume' },
  { seg: 25, start: 368.69, end: 377.97, avatar: 'none', shot: 'diagram', title: 'Decision: budget' },
  { seg: 26, start: 377.97, end: 393.97, avatar: 'none', shot: 'metric', title: 'Path C formula' },
  { seg: 27, start: 393.97, end: 409.27, avatar: 'none', shot: 'diagram', title: 'Selective automation' },
  { seg: 28, start: 409.27, end: 417.25, avatar: 'none', shot: 'diagram', title: 'Framework recap' },
  { seg: 29, start: 417.25, end: 426.87, avatar: 'full', shot: 'talking-head', title: 'Subscribe' },
  { seg: 30, start: 426.87, end: 444.99, avatar: 'full', shot: 'talking-head', title: 'Takeaways 1 and 2' },
  { seg: 31, start: 444.99, end: 460.27, avatar: 'full', shot: 'talking-head', title: 'Pause protocol takeaway' },
];

const frameFromSeconds = (seconds: number, fps: number) => Math.round(seconds * fps);

const TitlePill: React.FC<{ seg: Segment }> = ({ seg }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, 70, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 34,
        left: 42,
        zIndex: 30,
        opacity,
        padding: '10px 18px',
        borderRadius: 999,
        border: `1px solid ${COLORS.border}`,
        background: 'rgba(11,14,20,0.78)',
        color: COLORS.textPrimary,
        fontFamily: FONT.mono,
        fontSize: 18,
        boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      }}
    >
      <span style={{ color: COLORS.textDim }}>SEG {String(seg.seg).padStart(2, '0')}</span>
      <span style={{ color: COLORS.accent, margin: '0 10px' }}>/</span>
      {seg.title}
    </div>
  );
};

const LowerThird: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 18], [42, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        bottom: 72,
        zIndex: 40,
        width: 760,
        padding: '22px 28px',
        borderRadius: 14,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `5px solid ${COLORS.accent}`,
        background: 'rgba(11,14,20,0.78)',
        color: COLORS.textPrimary,
        fontFamily: FONT.sans,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ fontSize: 42, fontWeight: 700 }}>{title}</div>
      {subtitle && <div style={{ marginTop: 8, fontSize: 24, color: COLORS.textDim }}>{subtitle}</div>}
    </div>
  );
};

const AvatarVideo: React.FC<{ start: number; end: number; mode: Exclude<AvatarMode, 'none'> }> = ({ start, end, mode }) => {
  const { fps } = useVideoConfig();
  const full = mode === 'full';
  return (
    <Sequence
      from={frameFromSeconds(start, fps)}
      durationInFrames={Math.max(1, frameFromSeconds(end - start, fps))}
      name={`Avatar ${mode} ${start.toFixed(2)}-${end.toFixed(2)}`}
    >
      <OffthreadVideo
        src={staticFile(SOURCE)}
        muted
        startFrom={frameFromSeconds(start, fps)}
        style={{
          position: 'absolute',
          zIndex: 20,
          pointerEvents: 'none',
          left: full ? 0 : 1280,
          top: 0,
          width: full ? 1920 : 640,
          height: 1080,
          objectFit: 'cover',
          borderLeft: full ? undefined : `1px solid ${COLORS.border}`,
          boxShadow: full ? undefined : '-22px 0 60px rgba(0,0,0,0.42)',
        }}
      />
    </Sequence>
  );
};

const AvatarVideos: React.FC = () => (
  <>
    <AvatarVideo start={0.02} end={19.24} mode="full" />
    <AvatarVideo start={49.94} end={70.84} mode="side-right" />
    <AvatarVideo start={220.16} end={234.05} mode="side-right" />
    <AvatarVideo start={339.09} end={357.39} mode="side-right" />
    <AvatarVideo start={417.25} end={460.27} mode="full" />
  </>
);

const ShiftForAvatar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ right: 640, width: 1280, overflow: 'hidden' }}>{children}</AbsoluteFill>
);

const diagram = (title: string, nodes: DiagramNode[], edges: DiagramEdge[]) => (
  <DiagramBuild title={title} nodes={nodes} edges={edges} />
);

const renderDiagram = (seg: Segment) => {
  switch (seg.seg) {
    case 2:
      return diagram(
        'Three paths. One finished video.',
        [
          { id: 'api', label: 'API\n$$$', x: 0.12, y: 0.32, shape: 'rect', accent: 'warm' },
          { id: 'browser', label: 'Browser\n$', x: 0.12, y: 0.55, shape: 'rect', accent: 'good' },
          { id: 'manual', label: 'Manual +\nPipeline', x: 0.12, y: 0.78, shape: 'rect' },
          { id: 'mp4', label: 'HeyGen\nMP4', x: 0.52, y: 0.55, shape: 'pill' },
          { id: 'final', label: 'Finished\nVideo', x: 0.86, y: 0.55, shape: 'circle', accent: 'good' },
        ],
        [
          { from: 'api', to: 'mp4' },
          { from: 'browser', to: 'mp4' },
          { from: 'manual', to: 'mp4' },
          { from: 'mp4', to: 'final' },
        ],
      );
    case 4:
      return (
        <ShiftForAvatar>
          {diagram(
            'Production stack',
            [
              { id: 'heygen', label: 'HeyGen\nAvatar', x: 0.18, y: 0.28, shape: 'rect', accent: 'warm' },
              { id: 'remotion', label: 'Remotion\nFinal video', x: 0.58, y: 0.28, shape: 'rect', accent: 'good' },
              { id: 'hyper', label: 'HyperFrames\nHTML motion', x: 0.18, y: 0.72, shape: 'rect' },
              { id: 'agents', label: 'Claude Code\n+ Codex', x: 0.58, y: 0.72, shape: 'rect' },
            ],
            [
              { from: 'heygen', to: 'remotion' },
              { from: 'hyper', to: 'remotion' },
              { from: 'agents', to: 'remotion' },
              { from: 'agents', to: 'heygen', style: 'dashed' },
            ],
          )}
        </ShiftForAvatar>
      );
    case 5:
      return diagram(
        'Optional connectors orbit the core',
        [
          { id: 'core', label: 'Core\nPipeline', x: 0.5, y: 0.52, shape: 'circle', accent: 'good' },
          { id: 'higgs', label: 'Higgsfield\nB-roll', x: 0.18, y: 0.24, shape: 'pill', accent: 'warm' },
          { id: 'nano', label: 'Nano Banana\nImages', x: 0.82, y: 0.24, shape: 'pill' },
          { id: 'eleven', label: 'ElevenLabs\nTTS', x: 0.18, y: 0.82, shape: 'pill' },
          { id: 'mcp', label: 'MCP\nServers', x: 0.82, y: 0.82, shape: 'pill' },
        ],
        [
          { from: 'higgs', to: 'core', style: 'dashed' },
          { from: 'nano', to: 'core', style: 'dashed' },
          { from: 'eleven', to: 'core', style: 'dashed' },
          { from: 'mcp', to: 'core', style: 'dashed' },
        ],
      );
    case 6:
      return diagram(
        'The avatar choice lives here',
        [
          { id: 'avatar', label: 'Avatar\nwork', x: 0.14, y: 0.52, shape: 'circle', accent: 'warm' },
          { id: 'api', label: 'Path A\nAPI', x: 0.48, y: 0.25, shape: 'rect' },
          { id: 'browser', label: 'Path B\nBrowser', x: 0.48, y: 0.52, shape: 'rect', accent: 'good' },
          { id: 'manual', label: 'Path C\nManual', x: 0.48, y: 0.79, shape: 'rect' },
          { id: 'source', label: 'heygen-source.mp4', x: 0.84, y: 0.52, shape: 'pill', accent: 'good' },
        ],
        [
          { from: 'avatar', to: 'api' },
          { from: 'avatar', to: 'browser' },
          { from: 'avatar', to: 'manual' },
          { from: 'api', to: 'source' },
          { from: 'browser', to: 'source' },
          { from: 'manual', to: 'source' },
        ],
      );
    case 14:
      return (
        <ShiftForAvatar>
          {diagram(
            'Now Remotion takes the ball',
            [
              { id: 'a', label: 'Path A', x: 0.1, y: 0.3, shape: 'pill' },
              { id: 'b', label: 'Path B', x: 0.1, y: 0.52, shape: 'pill', accent: 'good' },
              { id: 'c', label: 'Path C', x: 0.1, y: 0.74, shape: 'pill' },
              { id: 'folder', label: 'MP4\nFolder', x: 0.45, y: 0.52, shape: 'rect', accent: 'warm' },
              { id: 'remotion', label: 'Remotion\nComposition', x: 0.78, y: 0.52, shape: 'circle', accent: 'good' },
            ],
            [
              { from: 'a', to: 'folder' },
              { from: 'b', to: 'folder' },
              { from: 'c', to: 'folder' },
              { from: 'folder', to: 'remotion' },
            ],
          )}
        </ShiftForAvatar>
      );
    case 15:
      return diagram(
        'Five stages',
        [
          { id: 't', label: '1\nTranscribe', x: 0.1, y: 0.55, shape: 'circle' },
          { id: 'p', label: '2\nPlan', x: 0.3, y: 0.55, shape: 'circle' },
          { id: 'g', label: '3\nGenerate', x: 0.5, y: 0.55, shape: 'circle' },
          { id: 'c', label: '4\nCompose', x: 0.7, y: 0.55, shape: 'circle' },
          { id: 'r', label: '5\nRender', x: 0.9, y: 0.55, shape: 'circle', accent: 'good' },
        ],
        [
          { from: 't', to: 'p' },
          { from: 'p', to: 'g' },
          { from: 'g', to: 'c' },
          { from: 'c', to: 'r' },
        ],
      );
    case 17:
      return diagram(
        'AI director maps scenes to shots',
        [
          { id: 'script', label: 'Script', x: 0.13, y: 0.36, shape: 'rect' },
          { id: 'transcript', label: 'Transcript\n+ timing', x: 0.13, y: 0.7, shape: 'rect' },
          { id: 'menu', label: '13-shot\nmenu', x: 0.5, y: 0.52, shape: 'circle', accent: 'warm' },
          { id: 'plan', label: 'Segment\nPlan', x: 0.84, y: 0.36, shape: 'rect', accent: 'good' },
          { id: 'main', label: 'Main.tsx', x: 0.84, y: 0.7, shape: 'rect' },
        ],
        [
          { from: 'script', to: 'menu' },
          { from: 'transcript', to: 'menu' },
          { from: 'menu', to: 'plan' },
          { from: 'plan', to: 'main' },
        ],
      );
    case 22:
      return (
        <ShiftForAvatar>
          {diagram(
            'QA loop',
            [
              { id: 'mp4', label: 'Rendered\nMP4', x: 0.18, y: 0.52, shape: 'rect' },
              { id: 'watch', label: 'Watch\nframes', x: 0.46, y: 0.52, shape: 'circle' },
              { id: 'pass', label: 'DONE', x: 0.78, y: 0.34, shape: 'pill', accent: 'good' },
              { id: 'fix', label: 'FIX LIST', x: 0.78, y: 0.72, shape: 'pill', accent: 'warm' },
            ],
            [
              { from: 'mp4', to: 'watch' },
              { from: 'watch', to: 'pass' },
              { from: 'watch', to: 'fix' },
            ],
          )}
        </ShiftForAvatar>
      );
    case 23:
      return diagram(
        'Which path should you pick?',
        [
          { id: 'a', label: 'A\nVolume', x: 0.25, y: 0.55, shape: 'rect', accent: 'warm' },
          { id: 'b', label: 'B\nBudget', x: 0.5, y: 0.55, shape: 'rect', accent: 'good' },
          { id: 'c', label: 'C\nControl', x: 0.75, y: 0.55, shape: 'rect' },
        ],
        [],
      );
    case 24:
      return diagram(
        'Decision: volume',
        [
          { id: 'q', label: '10+ videos\nper month?', x: 0.28, y: 0.55, shape: 'circle' },
          { id: 'yes', label: 'Path A\nAPI', x: 0.66, y: 0.38, shape: 'rect', accent: 'warm' },
          { id: 'no', label: 'Not yet', x: 0.66, y: 0.72, shape: 'rect' },
        ],
        [
          { from: 'q', to: 'yes' },
          { from: 'q', to: 'no', style: 'dashed' },
        ],
      );
    case 25:
      return diagram(
        'Decision: budget',
        [
          { id: 'q', label: 'Every dollar\ncounts?', x: 0.28, y: 0.55, shape: 'circle' },
          { id: 'yes', label: 'Path B\nBrowser', x: 0.66, y: 0.4, shape: 'rect', accent: 'good' },
          { id: 'note', label: 'Zero marginal\nAPI cost', x: 0.66, y: 0.72, shape: 'pill' },
        ],
        [
          { from: 'q', to: 'yes' },
          { from: 'yes', to: 'note' },
        ],
      );
    case 27:
      return diagram(
        'Selective automation',
        [
          { id: 'human', label: 'Human\njudgment', x: 0.22, y: 0.5, shape: 'circle', accent: 'warm' },
          { id: 'read', label: 'Read', x: 0.1, y: 0.28, shape: 'pill', accent: 'warm' },
          { id: 'tone', label: 'Tone', x: 0.1, y: 0.73, shape: 'pill', accent: 'warm' },
          { id: 'auto', label: 'Automation', x: 0.62, y: 0.5, shape: 'circle', accent: 'good' },
          { id: 'graphics', label: 'Graphics', x: 0.86, y: 0.25, shape: 'pill' },
          { id: 'render', label: 'Render', x: 0.86, y: 0.75, shape: 'pill' },
        ],
        [
          { from: 'read', to: 'human' },
          { from: 'tone', to: 'human' },
          { from: 'human', to: 'auto' },
          { from: 'auto', to: 'graphics' },
          { from: 'auto', to: 'render' },
        ],
      );
    case 28:
      return diagram(
        'Framework recap',
        [
          { id: 'bottle', label: 'Match path\nto bottleneck', x: 0.24, y: 0.48, shape: 'rect' },
          { id: 'need', label: 'Do not automate\nwhat does not need it', x: 0.5, y: 0.48, shape: 'rect', accent: 'warm' },
          { id: 'pay', label: 'Do not overpay\nfor browser work', x: 0.76, y: 0.48, shape: 'rect', accent: 'good' },
        ],
        [],
      );
    default:
      return diagram(seg.title, [{ id: 'n', label: seg.title, x: 0.5, y: 0.5, shape: 'rect' }], []);
  }
};

const terminalLines = (seg: number): TerminalLine[] => {
  if (seg === 7) {
    return [
      { cmd: 'python split_script.py --blocks heygen' },
      { out: '31 segments ready' },
      { cmd: 'curl -X POST https://api.heygen.com/v2/video/generate' },
      { out: 'render_id=api_07 status=processing' },
      { cmd: 'python poll_and_download.py --all' },
      { out: 'saved clips/segment-001.mp4 ... segment-031.mp4' },
    ];
  }
  if (seg === 16) {
    return [
      { cmd: 'python transcribe_and_align.py' },
      { out: 'word timestamps: 1,238' },
      { out: 'gap >= 1.0s -> segment boundary' },
      { out: 'aligned 31/31 segments' },
    ];
  }
  return [
    { cmd: 'npx remotion render src/index.ts Main ../10-videos/video-11-codex.mp4' },
    { out: 'Bundling project...' },
    { out: 'Rendering frames with headless Chrome workers' },
    { out: 'output: video-11-codex.mp4' },
  ];
};

const renderShot = (seg: Segment) => {
  if (seg.shot === 'talking-head') {
    if (seg.seg === 1) return <LowerThird title="Made in under an hour" subtitle="Avatar manual. Everything else automated." />;
    if (seg.seg === 29) return <LowerThird title="Subscribe" subtitle="Like, ring the bell, and follow the weekly builds." />;
    if (seg.seg === 30) return <LowerThird title="Two takeaways" subtitle="HeyGen makes the avatar. Remotion makes everything else." />;
    return <LowerThird title="Build it once" subtitle="The pause protocol makes the pipeline reliable." />;
  }
  if (seg.shot === 'side-by-side') {
    if (seg.seg === 3) {
      return (
        <SideBySide
          leftLabel="Manual workflow"
          rightLabel="Production pipeline"
          leftSrc="stills/003-treadmill.png"
          rightSrc="stills/003-assembly.png"
        />
      );
    }
    return (
      <SideBySide
        leftLabel={seg.seg === 10 ? 'API fees' : 'Manual workflow'}
        rightLabel={seg.seg === 10 ? 'Browser credits' : 'Pipeline'}
      />
    );
  }
  if (seg.shot === 'diagram') return renderDiagram(seg);
  if (seg.shot === 'terminal') return <TerminalTape title={seg.title} prompt="$" lines={terminalLines(seg.seg)} />;
  if (seg.shot === 'metric') {
    if (seg.seg === 8) return <MetricTicker label="API digital twin" from={0} to={5} prefix="$" suffix="/min" />;
    return <MetricTicker label="Path C total time" from={0} to={60} suffix=" min" durationSec={2.2} />;
  }
  if (seg.shot === 'browser') {
    const captions: Record<number, string> = {
      9: 'Browser automation drives HeyGen Studio like a human would',
      11: 'Path C compresses the HeyGen session into a reusable handoff',
      13: 'Drop heygen-source.mp4 into the pipeline folder',
      18: 'Generated visuals and HTML motion become Remotion assets',
    };
    const fallbackSteps: Record<number, string[]> = {
      9: ['Open HeyGen Studio', 'Paste block script', 'Render avatar take', 'Export source MP4'],
      11: ['Launch browser session', 'Load scene blocks', 'Preserve pauses', 'Save reusable handoff'],
      13: ['Receive heygen-source.mp4', 'Detect pause boundaries', 'Map 31 segments', 'Queue Remotion render'],
      18: ['Generate still assets', 'Build HTML motion', 'Capture screen clips', 'Register Remotion shots'],
    };
    return (
      <BrowserPlayback
        url={seg.seg === 13 ? 'file:///video-11-production-pipeline/10-videos' : 'app.heygen.com/studio'}
        caption={captions[seg.seg]}
        fallbackTitle={seg.title}
        fallbackSteps={fallbackSteps[seg.seg]}
        speedX={seg.seg === 11 ? 8 : 4}
      />
    );
  }
  if (seg.shot === 'code') {
    if (seg.seg === 12) {
      return (
        <CodeReveal
          title="pause-protocol.txt"
          language="ssml"
          lines={[
            'Segment text...',
            '<break time="1s"/>',
            '',
            '// pipeline rule',
            'if (gap >= 1.0) boundary.create();',
            'scene.start = wordTimestamp.next;',
          ]}
        />
      );
    }
    return (
      <CodeReveal
        title="Scene.tsx"
        language="tsx"
        lines={[
          'const transition = crossfade({ duration: 18 });',
          'const captions = words.filter(inScene);',
          '',
          'return <Scene avatar={clip} overlay={shot} captions={captions} />;',
        ]}
      />
    );
  }
  if (seg.shot === 'file-tree') {
    return (
      <FileTree
        root="video-11-production-pipeline/03-remotion/src"
        entries={[
          { path: 'shot-types', isDir: true, depth: 0 },
          { path: 'DiagramBuild.tsx', isDir: false, depth: 1 },
          { path: 'TerminalTape.tsx', isDir: false, depth: 1 },
          { path: 'SideBySide.tsx', isDir: false, depth: 1 },
          { path: 'Main.tsx', isDir: false, depth: 0 },
          { path: 'Root.tsx', isDir: false, depth: 0 },
          { path: 'video-11-segments.ts', isDir: false, depth: 0 },
        ]}
      />
    );
  }
  return (
    <ArtifactInspection
      source="video-11-production-pipeline"
      title={seg.title}
      lines={['Shot menu selected', 'Timing aligned', 'Render artifact ready']}
      highlights={[{ line: 1 }]}
    />
  );
};

export const Main: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONT.sans }}>
      <Audio src={staticFile(SOURCE)} />

      {SEGMENTS.map((seg) => {
        const from = frameFromSeconds(seg.start, fps);
        const durationInFrames = Math.max(1, frameFromSeconds(seg.end - seg.start, fps));
        return (
          <Sequence key={seg.seg} from={from} durationInFrames={durationInFrames} name={`Segment ${seg.seg}: ${seg.title}`}>
            {renderShot(seg)}
            {seg.avatar === 'none' && <TitlePill seg={seg} />}
          </Sequence>
        );
      })}

      <AvatarVideos />
    </AbsoluteFill>
  );
};
