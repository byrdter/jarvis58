import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONT } from './theme';

export interface BrowserPlaybackProps {
  /** Path under public/ to the screen-capture clip (Playwright/ffmpeg output). */
  src?: string;
  /** Address bar text. */
  url?: string;
  caption?: string;
  fallbackTitle?: string;
  fallbackSteps?: string[];
  /** Playback speedup multiplier hint (visual only — apply real speedup via ffmpeg pre-render). */
  speedX?: number;
}

export const BrowserPlayback: React.FC<BrowserPlaybackProps> = ({
  src,
  url = 'about:capture',
  caption,
  fallbackTitle = 'Recorded workflow',
  fallbackSteps = ['Open source project', 'Run capture script', 'Write assets', 'Render proof'],
  speedX,
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
        <div style={{ position: 'relative', width: 1640, height: 920, background: '#050812' }}>
          {src ? (
            <OffthreadVideo
              src={staticFile(src)}
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                padding: 54,
                color: COLORS.textPrimary,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: COLORS.textDim, fontFamily: FONT.mono, fontSize: 18, textTransform: 'uppercase' }}>
                    Screen capture
                  </div>
                  <div style={{ marginTop: 10, fontSize: 46, fontWeight: 800 }}>{fallbackTitle}</div>
                </div>
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: 999,
                    background: 'rgba(0,212,255,0.14)',
                    border: `1px solid ${COLORS.accent}`,
                    color: COLORS.accent,
                    fontFamily: FONT.mono,
                    fontSize: 18,
                  }}
                >
                  LIVE RUN
                </div>
              </div>

              <div style={{ marginTop: 54, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                {fallbackSteps.map((step, index) => {
                  const appear = interpolate(frame, [index * 10 + 8, index * 10 + 20], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
                  const progress = interpolate(frame, [index * 14 + 18, index * 14 + 58], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });

                  return (
                    <div
                      key={step}
                      style={{
                        opacity: appear,
                        transform: `translateY(${(1 - appear) * 18}px)`,
                        padding: 28,
                        minHeight: 170,
                        borderRadius: 14,
                        background: 'rgba(14,21,34,0.92)',
                        border: `1px solid ${index % 2 === 0 ? COLORS.accent : COLORS.accentWarm}`,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: index % 2 === 0 ? COLORS.accent : COLORS.accentWarm,
                            color: '#071018',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                          }}
                        >
                          {index + 1}
                        </div>
                        <div style={{ fontSize: 26, fontWeight: 800 }}>{step}</div>
                      </div>
                      <div
                        style={{
                          marginTop: 28,
                          height: 12,
                          borderRadius: 999,
                          background: 'rgba(255,255,255,0.08)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.round(progress * 100)}%`,
                            height: '100%',
                            background: index % 2 === 0 ? COLORS.accent : COLORS.accentWarm,
                          }}
                        />
                      </div>
                      <div style={{ marginTop: 18, color: COLORS.textDim, fontFamily: FONT.mono, fontSize: 17 }}>
                        {progress >= 1 ? 'done' : 'running...'}
                      </div>
                    </div>
                  );
                })}
              </div>
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
