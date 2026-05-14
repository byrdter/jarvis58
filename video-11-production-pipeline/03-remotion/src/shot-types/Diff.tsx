import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONT } from './theme';

export interface DiffProps {
  filename: string;
  removed: string[];
  added: string[];
}

export const Diff: React.FC<DiffProps> = ({ filename, removed, added }) => {
  const frame = useCurrentFrame();

  // Phase 1: removed lines fade red, then slide out. Phase 2: added lines slide in green.
  const removeStart = 8;
  const removeFadeEnd = removeStart + 20;
  const removeSlideEnd = removeFadeEnd + 12;
  const addStart = removeSlideEnd + 4;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 1500,
          background: COLORS.bgPanel,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          fontFamily: FONT.mono,
          color: COLORS.textPrimary,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ padding: '14px 22px', background: COLORS.bgRaised, borderBottom: `1px solid ${COLORS.border}`, fontSize: 18, color: COLORS.textDim }}>
          {filename}
        </div>
        <div style={{ padding: '24px 28px', fontSize: 26, lineHeight: 1.5, minHeight: 540 }}>
          {removed.map((line, i) => {
            const fade = interpolate(frame, [removeStart, removeFadeEnd], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const slideOut = interpolate(frame, [removeFadeEnd, removeSlideEnd], [0, -40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const opacity = interpolate(frame, [removeFadeEnd, removeSlideEnd], [fade, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div
                key={`r-${i}`}
                style={{
                  background: COLORS.bad25,
                  padding: '2px 12px',
                  borderLeft: `4px solid ${COLORS.bad}`,
                  opacity,
                  transform: `translateX(${slideOut}px)`,
                }}
              >
                <span style={{ color: COLORS.bad, marginRight: 12 }}>-</span>
                <span style={{ textDecoration: 'line-through', whiteSpace: 'pre' }}>{line}</span>
              </div>
            );
          })}
          {added.map((line, i) => {
            const localF = frame - (addStart + i * 4);
            const opacity = interpolate(localF, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const slide = interpolate(localF, [0, 14], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div
                key={`a-${i}`}
                style={{
                  background: COLORS.good25,
                  padding: '2px 12px',
                  borderLeft: `4px solid ${COLORS.good}`,
                  opacity,
                  transform: `translateX(${slide}px)`,
                  marginTop: 2,
                }}
              >
                <span style={{ color: COLORS.good, marginRight: 12 }}>+</span>
                <span style={{ whiteSpace: 'pre' }}>{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
