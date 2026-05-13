import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONT } from './theme';

export interface NotificationProps {
  app: 'slack' | 'telegram' | 'email';
  from: string;
  text: string;
  avatar?: string;
}

const APP_META: Record<NotificationProps['app'], { name: string; color: string; icon: string }> = {
  slack: { name: 'Slack', color: '#4A154B', icon: '#' },
  telegram: { name: 'Telegram', color: '#229ED9', icon: '✈' },
  email: { name: 'Mail', color: '#0078D4', icon: '✉' },
};

export const Notification: React.FC<NotificationProps> = ({ app, from, text, avatar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 6, fps, config: { damping: 14, mass: 0.6 } });
  const exit = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const slideX = interpolate(enter, [0, 1], [400, 0]) + exit * 400;
  const opacity = enter * (1 - exit);

  const meta = APP_META[app];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONT.sans }}>
      {/* Subtle backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 80% 20%, ${COLORS.bgRaised}, ${COLORS.bg})` }} />

      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 60,
          width: 540,
          padding: 22,
          background: 'rgba(20,24,32,0.96)',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
          transform: `translateX(${slideX}px)`,
          opacity,
          color: COLORS.textPrimary,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: meta.color,
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700,
            }}
          >
            {meta.icon}
          </span>
          <span style={{ color: COLORS.textDim, fontSize: 16, letterSpacing: 1 }}>{meta.name}</span>
          <span style={{ marginLeft: 'auto', color: COLORS.textDim, fontSize: 14 }}>now</span>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: COLORS.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000', fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {avatar ?? from.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{from}</div>
            <div style={{ fontSize: 18, color: COLORS.textPrimary, lineHeight: 1.4 }}>{text}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
