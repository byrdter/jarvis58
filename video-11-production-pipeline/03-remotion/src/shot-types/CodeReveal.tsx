import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONT } from './theme';

export interface CodeRevealProps {
  title?: string;
  language?: string;
  lines: string[];
}

const STAGGER = 6;

function colorize(line: string): React.ReactNode {
  // Lightweight syntax accenting — keywords, strings, comments.
  const keywords = /\b(const|let|var|function|return|if|else|import|export|from|class|new|async|await|type|interface)\b/g;
  const strings = /(["'`])(?:\\.|(?!\1).)*\1/g;
  const comments = /(\/\/.*$|#.*$)/;

  const c = line.match(comments);
  if (c) {
    return <span style={{ color: COLORS.textDim, fontStyle: 'italic' }}>{line}</span>;
  }

  const parts: Array<{ text: string; color?: string }> = [];
  let last = 0;
  const matches: Array<{ start: number; end: number; color: string }> = [];
  for (const m of line.matchAll(keywords)) {
    matches.push({ start: m.index ?? 0, end: (m.index ?? 0) + m[0].length, color: COLORS.accent });
  }
  for (const m of line.matchAll(strings)) {
    matches.push({ start: m.index ?? 0, end: (m.index ?? 0) + m[0].length, color: COLORS.good });
  }
  matches.sort((a, b) => a.start - b.start);
  for (const m of matches) {
    if (m.start > last) parts.push({ text: line.slice(last, m.start) });
    parts.push({ text: line.slice(m.start, m.end), color: m.color });
    last = m.end;
  }
  if (last < line.length) parts.push({ text: line.slice(last) });

  return parts.map((p, i) => (
    <span key={i} style={p.color ? { color: p.color } : undefined}>{p.text}</span>
  ));
}

export const CodeReveal: React.FC<CodeRevealProps> = ({ title, language = 'ts', lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 1500,
          background: COLORS.bgPanel,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          fontFamily: FONT.mono,
          color: COLORS.textPrimary,
          overflow: 'hidden',
        }}
      >
        {title && (
          <div
            style={{
              padding: '14px 22px',
              background: COLORS.bgRaised,
              borderBottom: `1px solid ${COLORS.border}`,
              fontSize: 18,
              color: COLORS.textDim,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{title}</span>
            <span style={{ color: COLORS.accentWarm }}>{language}</span>
          </div>
        )}
        <div style={{ padding: '32px 36px', fontSize: 28, lineHeight: 1.5, minHeight: 540 }}>
          {lines.map((line, i) => {
            const startF = 8 + i * STAGGER;
            const localF = frame - startF;
            const opacity = interpolate(localF, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const dx = interpolate(localF, [0, 12], [-18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{ display: 'flex', opacity, transform: `translateX(${dx}px)` }}>
                <span style={{ width: 56, color: COLORS.textDim, userSelect: 'none' }}>{i + 1}</span>
                <span style={{ whiteSpace: 'pre' }}>{colorize(line)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
