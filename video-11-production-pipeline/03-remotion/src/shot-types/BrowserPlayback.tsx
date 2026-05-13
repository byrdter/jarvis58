import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONT } from './theme';

export interface BrowserPlaybackProps {
  /** Path under public/ to the screen-capture clip (Playwright/ffmpeg output). */
  src?: string;
  /** Address bar text. */
  url?: string;
  caption?: string;
  /** Playback speedup multiplier hint (visual only — apply real speedup via ffmpeg pre-render). */
  speedX?: number;
}

export const BrowserPlayback: React.FC<BrowserPlaybackProps> = ({
  src, url = 'about:capture', caption, speedX,
}) => {
  const frame = useCurrentFrame();
  const captionOpacity = caption
    ? interpolate(frame, [12, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', fontFamily: FONT.sans }}>
      <div
        style={{
          width: 1640,
          background: COLORS.bgPanel,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 18px',
            background: COLORS.bgRaised,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
          <div
            style={{
              flex: 1, marginLeft: 16,
              padding: '8px 16px',
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              fontFamily: FONT.mono,
              fontSize: 18,
              color: COLORS.textDim,
            }}
          >
            🔒  {url}
          </div>
          {speedX && (
            <span
              style={{
                marginLeft: 10,
                padding: '6px 12px',
                borderRadius: 999,
                background: COLORS.accent,
                color: '#000',
                fontSize: 16, fontWeight: 700,
              }}
            >
              {speedX}× speed
            </span>
          )}
        </div>

        {/* Capture surface */}
        <div style={{ position: 'relative', width: 1640, height: 920, background: '#000' }}>
          {src ? (
            <OffthreadVideo
              src={staticFile(src)}
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.textDim, fontSize: 24, letterSpacing: 2,
              }}
            >
              SCREEN CAPTURE — drop Playwright / ffmpeg .mp4 into public/ and pass `src`
            </div>
          )}
          {caption && (
            <div
              style={{
                position: 'absolute', left: 24, bottom: 24,
                padding: '12px 18px',
                background: 'rgba(11,14,20,0.85)',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                color: COLORS.textPrimary,
                fontSize: 22,
                opacity: captionOpacity,
              }}
            >
              {caption}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
