import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { COLORS, FONT, FRAME } from './theme';
import type { Corner, Shape } from './types';

export interface TalkingHeadPipProps {
  src?: string;
  corner: Corner;
  shape: Shape;
  /** Optional underlay (typically a screen-capture shot rendered below). */
  underlay?: React.ReactNode;
  size?: number;
}

const PADDING = 40;

function cornerStyle(corner: Corner, size: number): React.CSSProperties {
  const base: React.CSSProperties = { position: 'absolute', width: size, height: size };
  switch (corner) {
    case 'BR': return { ...base, bottom: PADDING, right: PADDING };
    case 'BL': return { ...base, bottom: PADDING, left: PADDING };
    case 'TR': return { ...base, top: PADDING, right: PADDING };
    case 'TL': return { ...base, top: PADDING, left: PADDING };
  }
}

export const TalkingHeadPip: React.FC<TalkingHeadPipProps> = ({
  src, corner, shape, underlay, size = 384,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const popIn = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const radius = shape === 'circle' ? '50%' : 24;
  const pos = cornerStyle(corner, size);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {underlay}
      <div
        style={{
          ...pos,
          transform: `scale(${0.6 + 0.4 * popIn})`,
          opacity: popIn,
          borderRadius: radius,
          overflow: 'hidden',
          border: `3px solid ${COLORS.accent}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
        }}
      >
        {src ? (
          <OffthreadVideo src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted={false} />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              background: COLORS.bgRaised,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: COLORS.textDim, fontFamily: FONT.sans, fontSize: 18, letterSpacing: 3,
            }}
          >
            AVATAR
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
