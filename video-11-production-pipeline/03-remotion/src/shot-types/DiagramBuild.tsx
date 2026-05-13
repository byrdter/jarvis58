import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONT } from './theme';
import type { DiagramNode, DiagramEdge } from './types';

export interface DiagramBuildProps {
  title?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const W = 1600;
const H = 760;
const MARGIN_TOP = 200;
const MARGIN_LEFT = 160;

function accentColor(a?: DiagramNode['accent']) {
  switch (a) {
    case 'warm': return COLORS.accentWarm;
    case 'good': return COLORS.good;
    case 'bad': return COLORS.bad;
    default: return COLORS.accent;
  }
}

export const DiagramBuild: React.FC<DiagramBuildProps> = ({ title, nodes, edges }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodeFrames = new Map<string, number>(nodes.map((n, i) => [n.id, 10 + i * 8] as const));

  const px = (n: DiagramNode) => MARGIN_LEFT + n.x * W;
  const py = (n: DiagramNode) => MARGIN_TOP + n.y * H;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONT.sans }}>
      {title && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center', color: COLORS.textPrimary, fontSize: 44, fontWeight: 600, letterSpacing: 1 }}>
          {title}
        </div>
      )}

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {edges.map((e, i) => {
          const from = nodes.find((n) => n.id === e.from);
          const to = nodes.find((n) => n.id === e.to);
          if (!from || !to) return null;
          const startF = Math.max(nodeFrames.get(e.from) ?? 0, nodeFrames.get(e.to) ?? 0) + 6;
          const drawn = interpolate(frame - startF, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const x1 = px(from); const y1 = py(from);
          const x2 = px(to); const y2 = py(to);
          const ix = x1 + (x2 - x1) * drawn;
          const iy = y1 + (y2 - y1) * drawn;
          const dashArray = e.style === 'dashed' ? '8 8' : undefined;
          return (
            <line key={i} x1={x1} y1={y1} x2={ix} y2={iy} stroke={COLORS.border} strokeWidth={3} strokeDasharray={dashArray} />
          );
        })}
      </svg>

      {nodes.map((n) => {
        const startF = nodeFrames.get(n.id) ?? 0;
        const pop = spring({ frame: frame - startF, fps, config: { damping: 14, mass: 0.4 } });
        const color = accentColor(n.accent);
        const isCircle = n.shape !== 'rect' && n.shape !== 'pill';
        const w = n.shape === 'pill' ? 260 : isCircle ? 160 : 240;
        const h = isCircle ? 160 : 88;
        const radius = isCircle ? '50%' : n.shape === 'pill' ? 999 : 16;
        return (
          <div
            key={n.id}
            style={{
              position: 'absolute',
              left: px(n) - w / 2,
              top: py(n) - h / 2,
              width: w,
              height: h,
              borderRadius: radius,
              background: COLORS.bgPanel,
              border: `2px solid ${color}`,
              color: COLORS.textPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isCircle ? 22 : 26,
              textAlign: 'center',
              padding: 8,
              transform: `scale(${0.4 + 0.6 * pop})`,
              opacity: pop,
              boxShadow: `0 4px 20px ${color}33`,
            }}
          >
            {n.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
