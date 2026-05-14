import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, FONT } from './theme';

export interface ZoomPunchProps {
  /** Path under public/ to a wide screenshot. */
  src?: string;
  /** Region (in source-image normalized 0..1 coords) to punch into. */
  focus: { x: number; y: number; w: number; h: number };
  caption?: string;
}

const HOLD_FRAMES = 12;
const ZOOM_FRAMES = 36;
const CAPTION_DELAY = HOLD_FRAMES + ZOOM_FRAMES - 6;

export const ZoomPunch: React.FC<ZoomPunchProps> = ({ src, focus, caption }) => {
  const frame = useCurrentFrame();

  // Compute target transform that puts the focus rect at frame center, scaled up.
  const targetScale = Math.min(1 / focus.w, 1 / focus.h) * 0.9;
  const targetCenterX = focus.x + focus.w / 2;
  const targetCenterY = focus.y + focus.h / 2;
  const targetTx = (0.5 - targetCenterX) * 1920 * targetScale;
  const targetTy = (0.5 - targetCenterY) * 1080 * targetScale;

  const progress = interpolate(
    frame,
    [HOLD_FRAMES, HOLD_FRAMES + ZOOM_FRAMES],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0.1, 0.2, 1) },
  );

  const scale = 1 + (targetScale - 1) * progress;
  const tx = targetTx * progress;
  const ty = targetTy * progress;

  const captionOp = interpolate(frame, [CAPTION_DELAY, CAPTION_DELAY + 14], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Marker rectangle, drawn in source coordinates, fades out as zoom completes.
  const markerOp = interpolate(frame, [HOLD_FRAMES, HOLD_FRAMES + 18], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute', inset: 0,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {src ? (
          <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              background: `repeating-linear-gradient(45deg, ${COLORS.bgPanel} 0 40px, ${COLORS.bgRaised} 40px 80px)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: COLORS.textDim, fontFamily: FONT.sans, fontSize: 28,
            }}
          >
            SCREENSHOT — pass `src` (under public/) to render the real image
          </div>
        )}

        {/* Focus marker box drawn over the source image */}
        <div
          style={{
            position: 'absolute',
            left: `${focus.x * 100}%`,
            top: `${focus.y * 100}%`,
            width: `${focus.w * 100}%`,
            height: `${focus.h * 100}%`,
            border: `4px solid ${COLORS.accentWarm}`,
            borderRadius: 8,
            boxShadow: `0 0 0 4000px rgba(0,0,0,${0.55 * markerOp})`,
            opacity: markerOp,
          }}
        />
      </div>

      {caption && (
        <div
          style={{
            position: 'absolute', bottom: 60, left: 0, right: 0,
            display: 'flex', justifyContent: 'center',
            opacity: captionOp,
          }}
        >
          <div
            style={{
              padding: '16px 28px',
              background: 'rgba(11,14,20,0.92)',
              border: `1px solid ${COLORS.accentWarm}`,
              borderRadius: 14,
              color: COLORS.textPrimary,
              fontFamily: FONT.sans,
              fontSize: 30,
            }}
          >
            {caption}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
