import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { COLORS, FONT } from './theme';

export interface TalkingHeadFullProps {
  /** Path under public/ to the HeyGen avatar clip. */
  src?: string;
  /** Stub label when no clip is provided. */
  label?: string;
}

export const TalkingHeadFull: React.FC<TalkingHeadFullProps> = ({ src, label }) => {
  if (src) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <OffthreadVideo src={staticFile(src)} muted={false} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${COLORS.bgRaised}, ${COLORS.bg})`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.sans,
      }}
    >
      <div
        style={{
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: COLORS.bgPanel,
          border: `4px solid ${COLORS.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: COLORS.textDim,
          fontSize: 28,
          letterSpacing: 4,
        }}
      >
        AVATAR
      </div>
      <div style={{ marginTop: 36, color: COLORS.textDim, fontSize: 22, letterSpacing: 2 }}>
        {label ?? 'HeyGen avatar — full frame'}
      </div>
    </AbsoluteFill>
  );
};
