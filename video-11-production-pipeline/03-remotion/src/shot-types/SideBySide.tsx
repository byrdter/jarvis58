import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, FONT } from './theme';

export interface SideBySideProps {
  leftLabel: string;
  rightLabel: string;
  leftSrc?: string;
  rightSrc?: string;
}

export const SideBySide: React.FC<SideBySideProps> = ({
  leftLabel, rightLabel, leftSrc, rightSrc,
}) => {
  const frame = useCurrentFrame();

  // Wipe sweeps in from 0 → 50% over ~24 frames.
  const wipe = interpolate(frame, [8, 32], [0, 50], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.3, 0.1, 0.2, 1),
  });
  const dividerOp = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rightOp = interpolate(frame, [10, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONT.sans, color: COLORS.textPrimary }}>
      {/* LEFT panel */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, bottom: 0,
          width: `${wipe}%`,
          background: COLORS.bgPanel,
          overflow: 'hidden',
          borderRight: `2px solid ${COLORS.border}`,
        }}
      >
        {leftSrc ? (
          <Img src={staticFile(leftSrc)} style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textDim }}>
            {leftLabel}
          </div>
        )}
        <div
          style={{
            position: 'absolute', top: 60, left: 60,
            padding: '12px 22px',
            background: 'rgba(0,0,0,0.7)',
            borderLeft: `4px solid ${COLORS.bad}`,
            fontSize: 28, letterSpacing: 1,
          }}
        >
          {leftLabel}
        </div>
      </div>

      {/* RIGHT panel */}
      <div
        style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0,
          width: `${100 - wipe}%`,
          background: COLORS.bg,
          opacity: rightOp,
          overflow: 'hidden',
        }}
      >
        {rightSrc ? (
          <Img src={staticFile(rightSrc)} style={{ width: 1920, height: 1080, objectFit: 'cover', marginLeft: -(wipe / 100) * 1920 }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textDim }}>
            {rightLabel}
          </div>
        )}
        <div
          style={{
            position: 'absolute', top: 60, right: 60,
            padding: '12px 22px',
            background: 'rgba(0,0,0,0.7)',
            borderRight: `4px solid ${COLORS.good}`,
            fontSize: 28, letterSpacing: 1,
          }}
        >
          {rightLabel}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: `${wipe}%`,
          width: 4,
          background: COLORS.accent,
          opacity: dividerOp,
          boxShadow: `0 0 24px ${COLORS.accent}`,
        }}
      />
    </AbsoluteFill>
  );
};
