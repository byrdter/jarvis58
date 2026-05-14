import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, useVideoConfig } from 'remotion';
import { COLORS, FONT } from './theme';

export interface MetricTickerProps {
  label: string;
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  /** Seconds spent counting (default 1.6). */
  durationSec?: number;
}

export const MetricTicker: React.FC<MetricTickerProps> = ({
  label, from, to, prefix = '', suffix = '', durationSec = 1.6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = Math.round(durationSec * fps);
  const startF = 10;

  const value = interpolate(
    frame,
    [startF, startF + duration],
    [from, to],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0.7, 0.2, 1) },
  );

  const pop = interpolate(frame, [startF + duration - 4, startF + duration + 2, startF + duration + 8], [1, 1.08, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const decimals = Number.isInteger(from) && Number.isInteger(to) ? 0 : 1;
  const formatted = value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${COLORS.bgRaised}, ${COLORS.bg})`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ color: COLORS.textDim, fontSize: 32, letterSpacing: 6, marginBottom: 24 }}>
        {label.toUpperCase()}
      </div>
      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: 240,
          fontWeight: 700,
          color: COLORS.accent,
          textShadow: `0 0 60px ${COLORS.accent}66`,
          transform: `scale(${pop})`,
          letterSpacing: -4,
        }}
      >
        {prefix}{formatted}{suffix}
      </div>
    </AbsoluteFill>
  );
};
