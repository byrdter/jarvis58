import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import type { AvatarZone, SafeArea } from '../types';
import { getSafeArea } from '../types';
import { BackgroundChrome, STYLE_CONFIG } from './AnimatedText';

// ─── Helper: spring entrance ─────────────────────────────────────────────────
function useEntrance(delay = 0, config = { damping: 18, stiffness: 90, mass: 1 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - Math.floor(delay * fps)),
    fps,
    config,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 1 — Lower-third announcement
// ════════════════════════════════════════════════════════════════════════════

export const LowerThird: React.FC<{ title: string; subtitle: string; sweepInAt: number; durationInFrames: number }> = ({
  title,
  subtitle,
  sweepInAt,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweepFrame = Math.floor(sweepInAt * fps);

  const sweepIn = spring({
    frame: Math.max(0, frame - sweepFrame),
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
  });

  const exitFrames = Math.floor(0.5 * fps);
  const exitProgress = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < sweepFrame) return null;

  const translateY = interpolate(sweepIn, [0, 1], [240, 0]);
  const opacity = (1 - exitProgress) * sweepIn;

  // Icon flash sequencing
  const iconStart = sweepFrame + Math.floor(0.4 * fps);
  const iconFlashes = [0, 0.15, 0.3].map((d) => {
    const start = iconStart + Math.floor(d * fps);
    return interpolate(frame, [start, start + 8, start + 18], [0.5, 1, 0.5], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 1920,
        height: 220,
        transform: `translateY(${translateY}px)`,
        opacity,
        background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))',
        borderTop: '4px solid #00D4FF',
        boxShadow: '0 -10px 40px rgba(0,212,255,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      {/* Icon row */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
        {['⚠️', '🔗', '⚡'].map((icon, i) => (
          <div
            key={i}
            style={{
              fontSize: 40,
              filter: `drop-shadow(0 0 ${10 + iconFlashes[i] * 25}px rgba(0,212,255,${iconFlashes[i]}))`,
              opacity: 0.5 + iconFlashes[i] * 0.5,
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Main title + subtitle row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 30 }}>
        <div
          style={{
            fontSize: 130,
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: '#00D4FF',
            textShadow: '0 0 30px #00D4FF, 0 0 60px #A855F7',
            lineHeight: 1,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 44,
            color: '#FFFFFF',
            fontWeight: 400,
            textShadow: '0 0 12px rgba(255,255,255,0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 7 — Numbered badges floating in background
// ════════════════════════════════════════════════════════════════════════════

export const NumberedBadges: React.FC<{ labels: string[]; durationInFrames: number }> = ({ labels, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalSec = durationInFrames / fps;

  // Three timed slots — each number replaces the previous in the SAME left-side
  // spot, so it never lands on the avatar's face. Word label is large + bold.
  const slotStarts = [0.5, totalSec / 3 + 0.5, (totalSec / 3) * 2 + 0.5];
  const t = frame / fps;

  // Determine the active slot (0, 1, or 2) and its local progress
  let activeIdx = -1;
  if (t >= slotStarts[2]) activeIdx = 2;
  else if (t >= slotStarts[1]) activeIdx = 1;
  else if (t >= slotStarts[0]) activeIdx = 0;

  if (activeIdx < 0) return null;

  const activeStartSec = slotStarts[activeIdx];
  const activeStartFrame = Math.floor(activeStartSec * fps);
  const localFrame = Math.max(0, frame - activeStartFrame);
  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 1 },
  });

  const num = activeIdx + 1;
  const label = labels[activeIdx] ?? '';

  // Anchor point — far left, vertically centered, well clear of avatar's face
  const anchorX = 240;
  const anchorY = 540;

  const badgeScale = interpolate(entrance, [0, 1], [0.5, 1]);
  const badgeOpacity = entrance;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* The single big numbered badge */}
      <div
        key={`badge-${num}`}
        style={{
          position: 'absolute',
          left: anchorX - 130,
          top: anchorY - 130,
          width: 260,
          height: 260,
          borderRadius: '50%',
          border: '6px solid #00D4FF',
          boxShadow: `0 0 ${40 + entrance * 30}px rgba(0,212,255,0.7)`,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 160,
          fontWeight: 900,
          color: '#00D4FF',
          textShadow: '0 0 30px #00D4FF',
          transform: `scale(${badgeScale})`,
          opacity: badgeOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {num}
      </div>

      {/* The big readable word label, below the badge */}
      <div
        key={`label-${num}`}
        style={{
          position: 'absolute',
          left: 0,
          top: anchorY + 160,
          width: 540,
          textAlign: 'center',
          fontSize: 64,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          textShadow: '0 0 30px rgba(0,212,255,0.9), 0 4px 12px rgba(0,0,0,0.8)',
          opacity: badgeOpacity,
          transform: `translateY(${interpolate(entrance, [0, 1], [40, 0])}px)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 4 — Wiki contradiction (two pages disagreeing)
// ════════════════════════════════════════════════════════════════════════════

export const WikiConflict: React.FC<{
  zone: AvatarZone;
  title: string;
  data: { leftWiki: { name: string; value: string }; rightWiki: { name: string; value: string } };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const cfg = STYLE_CONFIG.body;

  const titleEntry = useEntrance(0);
  const leftEntry  = useEntrance(0.6);
  const rightEntry = useEntrance(0.9);
  const boltEntry  = useEntrance(1.4, { damping: 10, stiffness: 110, mass: 1 });

  const time = frame / fps;
  const valuePulse = Math.sin(time * Math.PI * 2.5) * 0.5 + 0.5;

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cardW = 360;
  const cardH = 380;
  const centerX = area.x + area.w / 2;
  const cardY = 280;
  const gap = 80;

  const renderWikiCard = (wiki: { name: string; value: string }, side: 'left' | 'right', entry: number) => {
    const slideX = interpolate(entry, [0, 1], [side === 'left' ? -60 : 60, 0]);
    return (
      <div
        style={{
          position: 'absolute',
          left: side === 'left' ? centerX - cardW - gap / 2 : centerX + gap / 2,
          top: cardY,
          width: cardW,
          height: cardH,
          background: 'rgba(15,23,42,0.85)',
          border: '2px solid rgba(0,212,255,0.5)',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          padding: 24,
          opacity: entry,
          transform: `translateX(${slideX}px)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ fontSize: 22, color: '#00D4FF', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>{wiki.name}</div>
        <div style={{ height: 2, background: 'rgba(0,212,255,0.4)', marginBottom: 24 }} />
        <div style={{ fontSize: 18, color: '#94A3B8', lineHeight: 1.6, marginBottom: 16 }}>Position sizing rule:</div>
        <div style={{ fontSize: 18, color: '#94A3B8', lineHeight: 1.6 }}>
          Maximum allocation per position{' '}
          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: '#FF6B6B',
              textShadow: `0 0 ${15 + valuePulse * 20}px rgba(255,107,107,${0.6 + valuePulse * 0.4})`,
              display: 'inline-block',
              transform: `scale(${1 + valuePulse * 0.05})`,
            }}
          >
            {wiki.value}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 80,
          width: area.w,
          textAlign: 'center',
          fontSize: 64,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          textShadow: '0 0 25px rgba(255,107,107,0.5)',
          transform: `scale(${interpolate(titleEntry, [0, 1], [0.85, 1])})`,
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {/* Wiki cards */}
      <div style={{ opacity: exitOpacity }}>
        {renderWikiCard(data.leftWiki, 'left', leftEntry)}
        {renderWikiCard(data.rightWiki, 'right', rightEntry)}
      </div>

      {/* Lightning bolt + CONTRADICTION label */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 80,
          top: cardY + 110,
          width: 160,
          height: 220,
          opacity: boltEntry * exitOpacity,
          transform: `scale(${interpolate(boltEntry, [0, 1], [0.5, 1])})`,
          filter: `drop-shadow(0 0 ${20 + valuePulse * 15}px rgba(255,107,107,0.8))`,
        }}
      >
        <svg viewBox="0 0 160 220" width="160" height="220">
          <path
            d="M 90,10 L 50,110 L 80,110 L 60,210 L 110,100 L 80,100 Z"
            fill="#FF6B6B"
            stroke="#FFD700"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: cardY + 250,
          width: area.w,
          textAlign: 'center',
          fontSize: 56,
          fontWeight: 900,
          color: '#FF6B6B',
          letterSpacing: '0.1em',
          textShadow: '0 0 30px rgba(255,107,107,0.7)',
          opacity: boltEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        CONTRADICTION
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 3 — Three blind spots (sketched panels)
// ════════════════════════════════════════════════════════════════════════════

export const BlindSpotsPanels: React.FC<{
  zone: AvatarZone;
  title: string;
  lines: string[];
  durationInFrames: number;
}> = ({ zone, title, lines, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const panelW = Math.min(area.w - 200, 1100);
  const panelH = 200;
  const panelX = area.x + (area.w - panelW) / 2;

  const icons = [
    // Two pages with ≠?
    (
      <svg viewBox="0 0 200 100" width="160" height="80">
        <rect x="10" y="15" width="60" height="70" fill="none" stroke="#00D4FF" strokeWidth="3" rx="4" />
        <rect x="130" y="15" width="60" height="70" fill="none" stroke="#00D4FF" strokeWidth="3" rx="4" />
        <text x="100" y="60" fontSize="32" fill="#FF6B6B" fontWeight="900" textAnchor="middle">≠?</text>
      </svg>
    ),
    // Two cylinders with broken connection
    (
      <svg viewBox="0 0 200 100" width="160" height="80">
        <ellipse cx="40" cy="20" rx="30" ry="8" fill="none" stroke="#00D4FF" strokeWidth="3" />
        <path d="M 10,20 L 10,80 Q 10,90 40,90 Q 70,90 70,80 L 70,20" fill="none" stroke="#00D4FF" strokeWidth="3" />
        <ellipse cx="160" cy="20" rx="30" ry="8" fill="none" stroke="#00D4FF" strokeWidth="3" />
        <path d="M 130,20 L 130,80 Q 130,90 160,90 Q 190,90 190,80 L 190,20" fill="none" stroke="#00D4FF" strokeWidth="3" />
        <line x1="80" y1="50" x2="100" y2="50" stroke="#FF6B6B" strokeWidth="3" />
        <line x1="115" y1="50" x2="120" y2="50" stroke="#FF6B6B" strokeWidth="3" />
      </svg>
    ),
    // Queue stack with stamps
    (
      <svg viewBox="0 0 200 100" width="160" height="80">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="20" y={10 + i * 18} width="120" height="14" fill="none" stroke="#00D4FF" strokeWidth="2" rx="2" />
            <circle cx="160" cy={17 + i * 18} r="8" fill="none" stroke="#FFD700" strokeWidth="2" />
            <text x="160" y={22 + i * 18} fontSize="11" fill="#FFD700" fontWeight="900" textAnchor="middle">✓</text>
          </g>
        ))}
      </svg>
    ),
  ];

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 60,
          width: area.w,
          textAlign: 'center',
          fontSize: 64,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.08em',
          textShadow: '0 0 20px rgba(0,212,255,0.5)',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {lines.map((line, i) => {
        const entry = useEntrance(0.5 + i * 0.3, { damping: 15, stiffness: 80, mass: 1 });
        const slideX = interpolate(entry, [0, 1], [-80, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: panelX,
              top: 200 + i * (panelH + 20),
              width: panelW,
              height: panelH,
              background: 'rgba(15,23,42,0.7)',
              border: '2px dashed rgba(0,212,255,0.5)',
              borderRadius: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              padding: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              opacity: entry * exitOpacity,
              transform: `translateX(${slideX}px)`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ flexShrink: 0, opacity: entry }}>{icons[i]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, color: '#94A3B8', marginBottom: 6 }}>#{i + 1}</div>
              <div style={{ fontSize: 56, color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.02em' }}>{line}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 5 — Silos with bridge attempts
// ════════════════════════════════════════════════════════════════════════════

export const SiloBridge: React.FC<{
  zone: AvatarZone;
  title: string;
  data: { topCloud: { name: string; concept: string }; bottomCloud: { name: string; concept: string } };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const topEntry = useEntrance(0.4);
  const bottomEntry = useEntrance(0.7);

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 3 connection attempts (fail, fail, success at end)
  const attemptStarts = [3.5, 6.5, 9.5];
  const attemptProgress = attemptStarts.map((s) => {
    const f = frame - Math.floor(s * fps);
    if (f < 0) return 0;
    if (f > 30) return 1;
    return f / 30;
  });
  // First two attempts retract; third holds
  const isLast = attemptProgress[2] > 0;

  const cloudW = 460;
  const cloudH = 200;
  const centerX = area.x + area.w / 2;
  const topY = 220;
  const bottomY = 670;

  const renderCloud = (data: { name: string; concept: string }, y: number, entry: number, color: string) => (
    <div
      style={{
        position: 'absolute',
        left: centerX - cloudW / 2,
        top: y,
        width: cloudW,
        height: cloudH,
        background: 'rgba(15,23,42,0.8)',
        border: `3px solid ${color}`,
        borderRadius: '50% / 40%',
        boxShadow: `0 0 30px ${color}55`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: entry,
        transform: `scale(${interpolate(entry, [0, 1], [0.8, 1])})`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: 30,
      }}
    >
      <div style={{ fontSize: 32, color, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 14 }}>{data.name}</div>
      <div style={{ fontSize: 24, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.3 }}>{data.concept}</div>
    </div>
  );

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 60,
          width: area.w,
          textAlign: 'center',
          fontSize: 56,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      <div style={{ opacity: exitOpacity }}>
        {renderCloud(data.topCloud, topY, topEntry, '#00D4FF')}
        {renderCloud(data.bottomCloud, bottomY, bottomEntry, '#FFD700')}

        {/* Bridge line attempts */}
        {[0, 1, 2].map((i) => {
          const p = attemptProgress[i];
          if (p === 0) return null;
          const isSuccess = i === 2;
          const showFailing = !isLast && i < 2;
          const startY = topY + cloudH;
          const endY = bottomY;
          const targetH = endY - startY;
          // Fail attempts: extend, then retract
          let h = p * targetH;
          if (i < 2 && p === 1) {
            // hold a moment, then retract handled by isLast check
            const f = frame - Math.floor((attemptStarts[i] + 1.2) * fps);
            if (f > 0) {
              h = Math.max(0, targetH - (f / 15) * targetH * 0.5);
            }
          }
          if (i < 2 && isLast) return null; // hide failed attempts once success draws

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: centerX - 2,
                  top: startY,
                  width: 4,
                  height: h,
                  background: isSuccess
                    ? 'linear-gradient(180deg, #00D4FF, #FFD700)'
                    : 'rgba(255,107,107,0.6)',
                  borderRadius: 2,
                  boxShadow: isSuccess ? '0 0 25px #00D4FF' : 'none',
                  opacity: showFailing ? 0.6 : 1,
                }}
              />
              {isSuccess && p > 0.9 && (
                <div
                  style={{
                    position: 'absolute',
                    left: centerX - 60,
                    top: (startY + endY) / 2 - 20,
                    width: 120,
                    height: 40,
                    borderRadius: 20,
                    background: '#00D4FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 18,
                    color: '#0A1628',
                    boxShadow: '0 0 30px #00D4FF',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  until now
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 6 — Scrolling queue list
// ════════════════════════════════════════════════════════════════════════════

const QUEUE_ITEMS: Array<{ title: string; tag: string; risk: 'low' | 'med' | 'high' }> = [
  { title: 'fix typo: methodology.md', tag: 'typo', risk: 'low' },
  { title: 'broken link: trade-execution.md', tag: 'broken-link', risk: 'low' },
  { title: 'missing link: position-sizing → strategy', tag: 'missing-link', risk: 'low' },
  { title: 'format fix: ai-filmmaking.md', tag: 'format', risk: 'low' },
  { title: 'cross-wiki: ops ↔ claude-code', tag: 'restructure', risk: 'med' },
  { title: 'fix typo: cinematography.md', tag: 'typo', risk: 'low' },
  { title: 'add link: subprocess pattern', tag: 'missing-link', risk: 'low' },
  { title: 'restructure: risk-tiers.md', tag: 'restructure', risk: 'med' },
  { title: 'contradiction: sizing rules', tag: 'judgment', risk: 'high' },
  { title: 'broken link: scheduler.md', tag: 'broken-link', risk: 'low' },
  { title: 'format fix: oauth-setup.md', tag: 'format', risk: 'low' },
  { title: 'fix typo: vector-search.md', tag: 'typo', risk: 'low' },
  { title: 'cross-wiki: AI film ↔ investments', tag: 'restructure', risk: 'med' },
  { title: 'broken link: alpaca-api.md', tag: 'broken-link', risk: 'low' },
  { title: 'fix typo: heartbeat.md', tag: 'typo', risk: 'low' },
  { title: 'remove duplicate section', tag: 'judgment', risk: 'high' },
  { title: 'add link: regime classification', tag: 'missing-link', risk: 'low' },
  { title: 'format fix: gmail-integration.md', tag: 'format', risk: 'low' },
];

const RISK_COLORS = { low: '#10B981', med: '#F59E0B', high: '#EF4444' };

export const QueueList: React.FC<{
  zone: AvatarZone;
  title: string;
  subtitle?: string;
  durationInFrames: number;
}> = ({ zone, title, subtitle, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const itemH = 70;
  const listX = area.x + 60;
  const listY = 220;
  const listW = area.w - 120;
  const listH = 720;
  const scrollOffset = (frame * 0.6) % (QUEUE_ITEMS.length * itemH);

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 70,
          width: area.w,
          textAlign: 'center',
          fontSize: 60,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            position: 'absolute',
            left: area.x,
            top: 145,
            width: area.w,
            textAlign: 'center',
            fontSize: 28,
            color: '#94A3B8',
            opacity: titleEntry * exitOpacity,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Scrolling list */}
      <div
        style={{
          position: 'absolute',
          left: listX,
          top: listY,
          width: listW,
          height: listH,
          overflow: 'hidden',
          background: 'rgba(15,23,42,0.5)',
          borderRadius: 12,
          border: '1px solid rgba(0,212,255,0.2)',
          opacity: exitOpacity,
        }}
      >
        {/* Render items twice for seamless loop */}
        {[...QUEUE_ITEMS, ...QUEUE_ITEMS].map((item, i) => {
          const yPos = i * itemH - scrollOffset;
          if (yPos < -itemH || yPos > listH) return null;
          // Brief flash for low-risk items to highlight noise
          const flashCycle = (frame + i * 17) % 200;
          const isFlashing = item.risk === 'low' && flashCycle < 12;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                top: yPos,
                width: listW,
                height: itemH,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 20px',
                background: isFlashing ? `${RISK_COLORS[item.risk]}22` : 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              <div style={{ width: 6, height: 40, background: RISK_COLORS[item.risk], borderRadius: 3, boxShadow: `0 0 10px ${RISK_COLORS[item.risk]}` }} />
              <div style={{ flex: 1, fontSize: 24, color: '#FFFFFF' }}>{item.title}</div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.1)',
                  color: '#94A3B8',
                  letterSpacing: '0.05em',
                }}
              >
                {item.tag}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENTS 10 & 16 — Mock terminal output
// ════════════════════════════════════════════════════════════════════════════

export const Terminal: React.FC<{
  zone: AvatarZone;
  lines: string[];
  durationInFrames: number;
}> = ({ zone, lines, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);

  const entry = useEntrance(0, { damping: 18, stiffness: 80, mass: 1 });
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const termW = Math.min(area.w - 80, 1300);
  const termH = Math.min(area.h - 100, 880);
  const termX = area.x + (area.w - termW) / 2;
  const termY = (area.h - termH) / 2 + area.y;

  // Type-on effect: each line appears at a specific time
  const totalSec = durationInFrames / fps;
  const linesStart = 0.5;
  const linesEnd = totalSec - 1.0;
  const perLine = (linesEnd - linesStart) / lines.length;
  const cursorBlink = Math.floor(frame / 12) % 2 === 0;

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: termX,
          top: termY,
          width: termW,
          height: termH,
          background: '#0F172A',
          borderRadius: 14,
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,212,255,0.15)',
          border: '1px solid rgba(0,212,255,0.3)',
          opacity: entry * exitOpacity,
          transform: `scale(${interpolate(entry, [0, 1], [0.95, 1])})`,
          overflow: 'hidden',
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 36,
            background: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#28C840' }} />
          <div style={{ flex: 1, textAlign: 'center', fontSize: 14, color: '#94A3B8', letterSpacing: '0.05em' }}>
            claude-code
          </div>
        </div>

        {/* Terminal body */}
        <div style={{ padding: 24, fontSize: 22, lineHeight: 1.55 }}>
          {lines.map((line, i) => {
            const lineStart = linesStart + i * perLine;
            const localFrame = frame - Math.floor(lineStart * fps);
            const charsPerSec = 60;
            const charsToShow = Math.max(0, Math.floor((localFrame / fps) * charsPerSec));
            if (localFrame < 0) return null;

            const isCommand = line.startsWith('$');
            const isCheckmark = line.includes('✓');
            const visibleText = line.slice(0, charsToShow);
            const isFullyTyped = charsToShow >= line.length;

            let color = '#E5E7EB';
            if (isCommand) color = '#FFFFFF';
            else if (isCheckmark) color = '#10B981';
            else if (line.startsWith('[')) color = '#7DD3FC';

            return (
              <div
                key={i}
                style={{
                  color,
                  whiteSpace: 'pre',
                  textShadow: isCheckmark && isFullyTyped ? '0 0 12px rgba(16,185,129,0.6)' : 'none',
                  fontWeight: isCommand ? 700 : 400,
                  transform: isCheckmark && isFullyTyped ? `scale(${1 + Math.sin(((frame - Math.floor(lineStart * fps)) / 6) % 6.28) * 0.01})` : 'none',
                  transformOrigin: 'left',
                }}
              >
                {visibleText}
                {!isFullyTyped && cursorBlink && <span style={{ background: '#00D4FF', color: '#0F172A' }}> </span>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 8 — Three-phase contradiction detection
// ════════════════════════════════════════════════════════════════════════════

export const ThreePhase: React.FC<{
  zone: AvatarZone;
  title: string;
  data: { phases: Array<{ duration: number; label: string }> };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const totalSec = durationInFrames / fps;
  const elapsedSec = frame / fps;

  // Determine current phase
  let cumulativeSec = 0;
  let currentPhase = 0;
  for (let i = 0; i < data.phases.length; i++) {
    if (elapsedSec < cumulativeSec + data.phases[i].duration) {
      currentPhase = i;
      break;
    }
    cumulativeSec += data.phases[i].duration;
    if (i === data.phases.length - 1) currentPhase = i;
  }

  const titleEntry = useEntrance(0);
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cardW = 380;
  const cardH = 480;
  const centerX = area.x + area.w / 2;
  const cardY = 200;
  const gap = 50;

  // Phase progress within current phase
  const phaseStartSec = data.phases.slice(0, currentPhase).reduce((s, p) => s + p.duration, 0);
  const phaseSecondsIn = elapsedSec - phaseStartSec;
  const phaseProgress = Math.min(1, phaseSecondsIn / data.phases[currentPhase].duration);

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 60,
          width: area.w,
          textAlign: 'center',
          fontSize: 56,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {/* Two wiki page cards */}
      {(['left', 'right'] as const).map((side) => {
        const x = side === 'left' ? centerX - cardW - gap / 2 : centerX + gap / 2;
        return (
          <div
            key={side}
            style={{
              position: 'absolute',
              left: x,
              top: cardY,
              width: cardW,
              height: cardH,
              background: 'rgba(15,23,42,0.85)',
              border: '2px solid rgba(0,212,255,0.4)',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              opacity: exitOpacity,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ fontSize: 22, color: '#00D4FF', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>
              {side === 'left' ? 'PAGE A' : 'PAGE B'}
            </div>
            <div style={{ height: 2, background: 'rgba(0,212,255,0.4)', marginBottom: 16 }} />

            {/* Phase 1: dim text with cyan highlights */}
            {currentPhase === 0 && (
              <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
                {[
                  side === 'left' ? 'Lorem ipsum dolor sit amet,' : 'Sed do eiusmod tempor incididunt',
                  side === 'left' ? 'consectetur adipiscing elit,' : 'ut labore et dolore magna,',
                  side === 'left' ? 'sed do eiusmod tempor.' : 'ut enim ad minim veniam.',
                  side === 'left' ? 'Position sizing ≤ 25%' : 'Position sizing ≤ 20%',
                ].map((t, j) => (
                  <div key={j} style={{ marginBottom: 8 }}>
                    {t.split(' ').map((w, k) => {
                      const isShared = ['sed', 'do', 'tempor', 'Position', 'sizing'].includes(w.toLowerCase().replace(/[^a-z]/g, '')) || w === 'Position' || w === 'sizing';
                      return (
                        <span key={k} style={{ color: isShared ? '#00D4FF' : 'rgba(255,255,255,0.3)' }}>
                          {w}{' '}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Phase 2: bullet chips reveal */}
            {currentPhase === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(side === 'left'
                  ? ['Maximum allocation 25% per position', 'Stop loss at 8%', 'Sector cap 40%', 'Daily review required', 'Avoid leverage > 1.5x']
                  : ['Maximum allocation 20% per position', 'Stop loss at 10%', 'Sector cap 35%', 'Weekly review required', 'No leverage allowed']
                ).map((bullet, j) => {
                  const bulletStart = j * 0.3;
                  const localFrame = phaseSecondsIn - bulletStart;
                  const opacity = Math.max(0, Math.min(1, localFrame * 4));
                  return (
                    <div
                      key={j}
                      style={{
                        background: 'rgba(0,212,255,0.15)',
                        border: '1px solid rgba(0,212,255,0.4)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 16,
                        color: '#FFFFFF',
                        opacity,
                        transform: `translateX(${(1 - opacity) * 30}px)`,
                      }}
                    >
                      • {bullet}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Phase 3: comparison badges */}
            {currentPhase === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { match: true, text: 'allocation rule' },
                  { match: false, text: 'stop loss %', isHero: true },
                  { match: true, text: 'sector cap' },
                  { match: false, text: 'review cadence' },
                  { match: true, text: 'leverage policy' },
                ].map((item, j) => {
                  const heroPulse = item.isHero ? Math.sin(elapsedSec * 4) * 0.5 + 0.5 : 0;
                  const color = item.match ? '#10B981' : '#EF4444';
                  return (
                    <div
                      key={j}
                      style={{
                        background: `${color}22`,
                        border: `2px solid ${color}`,
                        borderRadius: 8,
                        padding: '10px 12px',
                        fontSize: 16,
                        color: '#FFFFFF',
                        boxShadow: item.isHero ? `0 0 ${10 + heroPulse * 25}px ${color}` : 'none',
                        transform: item.isHero ? `scale(${1 + heroPulse * 0.04})` : 'none',
                      }}
                    >
                      {item.match ? '✓ agree:' : '✗ conflict:'} {item.text}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Question mark between pages */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 30,
          top: cardY + cardH / 2 - 40,
          fontSize: 70,
          fontWeight: 900,
          color: currentPhase === 2 ? '#FF6B6B' : '#00D4FF',
          textShadow: `0 0 25px ${currentPhase === 2 ? '#FF6B6B' : '#00D4FF'}`,
          opacity: exitOpacity * 0.8,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        ?
      </div>

      {/* Phase subtitle */}
      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: cardY + cardH + 30,
          width: area.w,
          textAlign: 'center',
          fontSize: 36,
          fontWeight: 700,
          color: currentPhase === 2 ? '#10B981' : '#00D4FF',
          textShadow: `0 0 20px ${currentPhase === 2 ? '#10B981' : '#00D4FF'}`,
          opacity: exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontStyle: 'italic',
        }}
      >
        {data.phases[currentPhase].label}
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 9 — Flowchart
// ════════════════════════════════════════════════════════════════════════════

export const Flowchart: React.FC<{
  zone: AvatarZone;
  title: string;
  data: { nodes: Array<{ id: string; label: string; pos: { col: number; row: number }; shape?: string }> };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const centerX = area.x + area.w / 2;
  const startY = 200;
  const rowGap = 130;
  const nodeW = 380;
  const nodeH = 90;

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 60,
          width: area.w,
          textAlign: 'center',
          fontSize: 60,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {data.nodes.map((node, i) => {
        const entry = useEntrance(0.5 + i * 0.5);
        const y = startY + node.pos.row * rowGap;
        const x = centerX - nodeW / 2;
        const isDiamond = node.shape === 'diamond';
        return (
          <React.Fragment key={node.id}>
            {/* Connection line from previous node */}
            {i > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: centerX - 2,
                  top: startY + (i - 1) * rowGap + nodeH,
                  width: 4,
                  height: rowGap - nodeH,
                  background: 'linear-gradient(180deg, #00D4FF, transparent)',
                  borderRadius: 2,
                  opacity: entry * 0.7,
                  boxShadow: '0 0 10px #00D4FF',
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: nodeW,
                height: nodeH,
                background: isDiamond ? 'rgba(255,215,0,0.15)' : 'rgba(15,23,42,0.85)',
                border: `2px solid ${isDiamond ? '#FFD700' : '#00D4FF'}`,
                borderRadius: isDiamond ? 0 : 12,
                transform: `${isDiamond ? 'rotate(45deg) ' : ''}scale(${interpolate(entry, [0, 1], [0.7, 1])})`,
                opacity: entry * exitOpacity,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isDiamond ? '0 0 25px rgba(255,215,0,0.4)' : '0 0 20px rgba(0,212,255,0.3)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: isDiamond ? '#FFD700' : '#FFFFFF',
                  letterSpacing: '0.02em',
                  transform: isDiamond ? 'rotate(-45deg)' : 'none',
                  textShadow: `0 0 10px ${isDiamond ? '#FFD700' : '#00D4FF'}`,
                }}
              >
                {node.label}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 11 — Bridge clusters (4 corners)
// ════════════════════════════════════════════════════════════════════════════

export const BridgeClusters: React.FC<{
  zone: AvatarZone;
  title: string;
  data: {
    clusters: Array<{ pos: string; name: string; color: string; pills: string[] }>;
    bridgeFrom: { cluster: string; pill: string };
    bridgeTo: { cluster: string; pill: string };
    caption: string;
  };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Cluster positions (avoiding bottom-right where avatar lives)
  const positions: Record<string, { x: number; y: number }> = {
    TL: { x: 80, y: 200 },
    TR: { x: 880, y: 200 },
    CL: { x: 80, y: 540 },
    BL: { x: 80, y: 800 },
  };

  const clusterW = 380;
  const clusterH = 240;

  // Bridge animation (last 8s)
  const bridgeStartSec = durationInFrames / fps - 12;
  const bridgePulse = (frame / fps - bridgeStartSec) > 0;
  const time = frame / fps;
  const pulseAlpha = Math.sin(time * 4) * 0.5 + 0.5;

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 70,
          width: area.w,
          textAlign: 'center',
          fontSize: 58,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {data.clusters.map((cluster, i) => {
        const entry = useEntrance(0.5 + i * 0.3);
        const pos = positions[cluster.pos] || { x: 0, y: 0 };
        return (
          <div
            key={cluster.pos}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: clusterW,
              height: clusterH,
              background: 'rgba(15,23,42,0.7)',
              border: `2px solid ${cluster.color}`,
              borderRadius: 16,
              padding: 16,
              opacity: entry * exitOpacity,
              transform: `scale(${interpolate(entry, [0, 1], [0.85, 1])})`,
              boxShadow: `0 0 25px ${cluster.color}33`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ fontSize: 24, color: cluster.color, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 12 }}>
              {cluster.name}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cluster.pills.map((pill, j) => {
                const isFromPill = data.bridgeFrom.cluster === cluster.pos && data.bridgeFrom.pill === pill;
                const isToPill = data.bridgeTo.cluster === cluster.pos && data.bridgeTo.pill === pill;
                const shouldGlow = bridgePulse && (isFromPill || isToPill);
                return (
                  <div
                    key={j}
                    style={{
                      fontSize: 16,
                      padding: '6px 12px',
                      borderRadius: 14,
                      background: shouldGlow ? '#00D4FF' : 'rgba(255,255,255,0.06)',
                      border: shouldGlow ? '2px solid #00D4FF' : '1px solid rgba(255,255,255,0.1)',
                      color: shouldGlow ? '#0F172A' : '#E5E7EB',
                      fontWeight: shouldGlow ? 700 : 400,
                      boxShadow: shouldGlow ? `0 0 ${10 + pulseAlpha * 15}px #00D4FF` : 'none',
                      transform: shouldGlow ? `scale(${1 + pulseAlpha * 0.05})` : 'none',
                    }}
                  >
                    {pill}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Bridge line — TR to TL */}
      {bridgePulse && (
        <svg
          style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}
        >
          <defs>
            <linearGradient id="bridgeGrad" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <path
            d={`M ${positions.TR.x + 80} ${positions.TR.y + 60} Q ${(positions.TR.x + positions.TL.x + clusterW) / 2} 100 ${positions.TL.x + 200} ${positions.TL.y + 100}`}
            stroke="url(#bridgeGrad)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8 4"
            opacity={Math.min(1, (time - bridgeStartSec) / 1.5)}
            style={{ filter: `drop-shadow(0 0 10px #00D4FF)` }}
          />
        </svg>
      )}

      {/* Caption */}
      {bridgePulse && (
        <div
          style={{
            position: 'absolute',
            left: area.x,
            bottom: 40,
            width: area.w - 420,
            textAlign: 'center',
            fontSize: 32,
            color: '#00D4FF',
            fontWeight: 700,
            opacity: Math.min(1, (time - bridgeStartSec) / 2) * exitOpacity,
            textShadow: '0 0 20px #00D4FF',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: 'italic',
          }}
        >
          {data.caption}
        </div>
      )}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 12 — Sketched bridge example
// ════════════════════════════════════════════════════════════════════════════

export const SketchedBridge: React.FC<{
  zone: AvatarZone;
  title: string;
  data: { leftCard: { title: string; phrase: string }; rightCard: { title: string; phrase: string } };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const leftEntry = useEntrance(0.4);
  const rightEntry = useEntrance(0.7);
  const circleEntry = useEntrance(1.2);
  const arcEntry = useEntrance(2.0);
  const checkEntry = useEntrance(durationInFrames / fps - 2.5);

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cardW = 460;
  const cardH = 400;
  const cardY = 240;
  const centerX = area.x + area.w / 2;
  const gap = 80;

  const renderCard = (card: { title: string; phrase: string }, side: 'left' | 'right', entry: number) => {
    const x = side === 'left' ? centerX - cardW - gap / 2 : centerX + gap / 2;
    return (
      <div
        style={{
          position: 'absolute',
          left: x,
          top: cardY,
          width: cardW,
          height: cardH,
          background: 'rgba(254,250,240,0.95)',
          border: '2px solid #1E293B',
          borderRadius: 6,
          padding: 28,
          opacity: entry * exitOpacity,
          transform: `scale(${interpolate(entry, [0, 1], [0.92, 1])}) rotate(${side === 'left' ? '-1' : '1'}deg)`,
          boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
          fontFamily: 'Georgia, serif',
          color: '#1E293B',
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, letterSpacing: '0.05em' }}>
          {card.title}
        </div>
        <div style={{ height: 1, background: '#1E293B', marginBottom: 16 }} />
        <div style={{ fontSize: 18, lineHeight: 1.7, color: '#475569' }}>
          A pattern emerges when you constrain the system: the most expressive output comes not from infinite optionality, but from{' '}
          <span style={{ position: 'relative', display: 'inline-block', fontWeight: 700, color: '#1E293B' }}>
            {card.phrase}
            {/* Hand-drawn circle */}
            {circleEntry > 0 && (
              <svg
                style={{
                  position: 'absolute',
                  left: -10,
                  top: -8,
                  width: 'calc(100% + 20px)',
                  height: 'calc(100% + 16px)',
                  pointerEvents: 'none',
                  opacity: circleEntry,
                }}
                viewBox="0 0 200 50"
                preserveAspectRatio="none"
              >
                <ellipse
                  cx="100"
                  cy="25"
                  rx="95"
                  ry="22"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeDasharray="600"
                  strokeDashoffset={600 - 600 * circleEntry}
                  style={{ filter: 'drop-shadow(0 0 4px #D4AF37)' }}
                />
              </svg>
            )}
          </span>{' '}
          choices. The boundary creates the form.
        </div>
      </div>
    );
  };

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 60,
          width: area.w,
          textAlign: 'center',
          fontSize: 56,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {renderCard(data.leftCard, 'left', leftEntry)}
      {renderCard(data.rightCard, 'right', rightEntry)}

      {/* Sketched arc connecting the two phrases */}
      {arcEntry > 0 && (
        <svg
          style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}
        >
          <path
            d={`M ${centerX - cardW / 2 - gap / 2 - 60} ${cardY + cardH / 2 + 40} Q ${centerX} ${cardY + cardH + 80} ${centerX + cardW / 2 + gap / 2 + 60} ${cardY + cardH / 2 + 40}`}
            stroke="#D4AF37"
            strokeWidth="3"
            fill="none"
            strokeDasharray="800"
            strokeDashoffset={800 - 800 * arcEntry}
            opacity={arcEntry * exitOpacity}
            style={{ filter: 'drop-shadow(0 0 5px #D4AF37)' }}
          />
        </svg>
      )}

      {/* [[wiki-link]] label */}
      {arcEntry > 0.5 && (
        <div
          style={{
            position: 'absolute',
            left: centerX - 120,
            top: cardY + cardH + 60,
            width: 240,
            textAlign: 'center',
            fontSize: 28,
            color: '#FFD700',
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            opacity: ((arcEntry - 0.5) * 2) * exitOpacity,
            textShadow: '0 0 15px rgba(255,215,0,0.6)',
            fontWeight: 700,
          }}
        >
          [[wiki-link]]
        </div>
      )}

      {/* Approval checkmark stamp */}
      {checkEntry > 0 && (
        <div
          style={{
            position: 'absolute',
            left: centerX - 80,
            top: cardY + cardH + 130,
            width: 160,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: checkEntry * exitOpacity,
            transform: `scale(${interpolate(checkEntry, [0, 1], [0.5, 1])}) rotate(-8deg)`,
            border: '4px solid #10B981',
            borderRadius: 8,
            background: 'rgba(16,185,129,0.1)',
            color: '#10B981',
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: '0.1em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxShadow: '0 0 25px rgba(16,185,129,0.5)',
          }}
        >
          ✓ APPROVED
        </div>
      )}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 14 — Card sort into buckets
// ════════════════════════════════════════════════════════════════════════════

export const CardSort: React.FC<{
  zone: AvatarZone;
  title: string;
  data: { cards: Array<{ title: string; target: string; tier: 'low' | 'medium' | 'high' }> };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const tierColors = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };
  const tierLabels = {
    low: 'LOW RISK · auto-apply',
    medium: 'MEDIUM · notify',
    high: 'HIGH RISK · review',
  };

  const stackX = area.x + 80;
  const stackY = 240;
  const cardW = 320;
  const cardH = 80;

  const bucketX = area.x + 600;
  const bucketY: Record<string, number> = { low: 230, medium: 380, high: 530 };
  const bucketW = 480;
  const bucketH = 120;

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 60,
          width: area.w,
          textAlign: 'center',
          fontSize: 60,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {/* Stack label */}
      <div
        style={{
          position: 'absolute',
          left: stackX,
          top: stackY - 40,
          width: cardW,
          textAlign: 'center',
          fontSize: 22,
          color: '#94A3B8',
          letterSpacing: '0.08em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: exitOpacity,
        }}
      >
        PROPOSAL QUEUE
      </div>

      {/* Buckets */}
      {(['low', 'medium', 'high'] as const).map((tier) => (
        <div
          key={tier}
          style={{
            position: 'absolute',
            left: bucketX,
            top: bucketY[tier],
            width: bucketW,
            height: bucketH,
            background: `${tierColors[tier]}15`,
            border: `3px dashed ${tierColors[tier]}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 800,
            color: tierColors[tier],
            letterSpacing: '0.06em',
            opacity: exitOpacity,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {tierLabels[tier]}
        </div>
      ))}

      {/* Cards animating */}
      {data.cards.map((card, i) => {
        const flyStart = 1.0 + i * 1.2; // staggered
        const localSec = frame / fps - flyStart;
        const flyDuration = 1.2;
        const tValue = Math.max(0, Math.min(1, localSec / flyDuration));
        const easedT = Easing.bezier(0.4, 0, 0.2, 1)(tValue);

        // Start position: stack
        const startX = stackX;
        const startY = stackY + i * 8; // slightly stacked
        // End position: bucket
        const endX = bucketX + 80;
        const endY = bucketY[card.tier] + (bucketH - cardH) / 2;

        // Arc trajectory — peak at midpoint
        const arcHeight = -120;
        const x = startX + (endX - startX) * easedT;
        const y = startY + (endY - startY) * easedT + Math.sin(Math.PI * easedT) * arcHeight;

        const colorBlend = tValue;
        const startColor = '#94A3B8';
        const endColor = tierColors[card.tier];
        // Simple blend
        const cardColor = tValue < 0.6 ? startColor : endColor;
        const isLanded = tValue >= 1;
        const landingPulse = isLanded ? Math.max(0, 1 - (localSec - flyDuration) * 3) : 0;

        if (frame / fps < flyStart - 0.2) {
          // Show stacked at start
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: startX + (i % 3) * 4,
                top: startY,
                width: cardW,
                height: cardH,
                background: 'rgba(15,23,42,0.85)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                padding: '8px 16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                opacity: exitOpacity,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 700 }}>{card.title}</div>
              <div style={{ fontSize: 14, color: '#94A3B8' }}>{card.target}</div>
            </div>
          );
        }

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: cardW,
              height: cardH,
              background: 'rgba(15,23,42,0.95)',
              border: `2px solid ${cardColor}`,
              borderRadius: 8,
              padding: '8px 16px',
              transform: `scale(${1 + landingPulse * 0.08}) rotate(${(1 - tValue) * 5}deg)`,
              boxShadow: isLanded
                ? `0 0 ${20 + landingPulse * 25}px ${cardColor}`
                : '0 8px 25px rgba(0,0,0,0.7)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              opacity: exitOpacity,
            }}
          >
            <div style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 700 }}>{card.title}</div>
            <div style={{ fontSize: 14, color: cardColor }}>{card.target}</div>
          </div>
        );
      })}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 15 — Risk tier table + stacked bar
// ════════════════════════════════════════════════════════════════════════════

export const RiskTable: React.FC<{
  zone: AvatarZone;
  title: string;
  data: {
    rows: Array<{ tier: string; color: string; examples: string; action: string }>;
    split: { low: number; medium: number; high: number };
    splitLabel: string;
  };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const tableX = area.x + 60;
  const tableY = 200;
  const tableW = area.w - 120;
  const rowH = 130;

  // Stacked bar progress
  const barEntry = useEntrance(2.5, { damping: 18, stiffness: 60, mass: 1 });
  const counters = data.split;
  const lowCount = Math.floor(counters.low * barEntry);
  const medCount = Math.floor(counters.medium * barEntry);
  const highCount = Math.floor(counters.high * barEntry);

  return (
    <>
      <BackgroundChrome style="highlight" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 60,
          width: area.w,
          textAlign: 'center',
          fontSize: 100,
          fontWeight: 900,
          color: '#FFD700',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textShadow: '0 0 30px #FFD700, 0 0 60px #FF8C00',
          opacity: titleEntry * exitOpacity,
          transform: `scale(${interpolate(titleEntry, [0, 1], [0.7, 1])})`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {/* Table rows */}
      {data.rows.map((row, i) => {
        const entry = useEntrance(0.7 + i * 0.6);
        const slideX = interpolate(entry, [0, 1], [-60, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: tableX,
              top: tableY + i * rowH,
              width: tableW,
              height: rowH - 10,
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              background: 'rgba(15,23,42,0.85)',
              border: `3px solid ${row.color}`,
              borderLeft: `12px solid ${row.color}`,
              borderRadius: 10,
              opacity: entry * exitOpacity,
              transform: `translateX(${slideX}px)`,
              boxShadow: `0 0 25px ${row.color}55`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div
              style={{
                width: 200,
                fontSize: 44,
                fontWeight: 900,
                color: row.color,
                letterSpacing: '0.05em',
                textShadow: `0 0 15px ${row.color}`,
              }}
            >
              {row.tier}
            </div>
            <div style={{ flex: 1, fontSize: 24, color: '#FFFFFF' }}>{row.examples}</div>
            <div
              style={{
                width: 280,
                textAlign: 'right',
                fontSize: 26,
                fontWeight: 700,
                color: '#FFD700',
                letterSpacing: '0.05em',
              }}
            >
              {row.action}
            </div>
          </div>
        );
      })}

      {/* Stacked bar */}
      <div
        style={{
          position: 'absolute',
          left: tableX,
          top: tableY + 3 * rowH + 20,
          width: tableW,
          height: 70,
          display: 'flex',
          borderRadius: 10,
          overflow: 'hidden',
          opacity: barEntry * exitOpacity,
          boxShadow: '0 0 25px rgba(255,215,0,0.3)',
        }}
      >
        <div style={{ width: `${lowCount}%`, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>
          {lowCount}%
        </div>
        <div style={{ width: `${medCount}%`, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>
          {medCount}%
        </div>
        <div style={{ width: `${highCount}%`, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>
          {highCount}%
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: tableX,
          top: tableY + 3 * rowH + 100,
          width: tableW,
          textAlign: 'center',
          fontSize: 26,
          color: '#FFF4CC',
          fontStyle: 'italic',
          opacity: barEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {data.splitLabel}
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 17 — Loop diagram (in background, FS)
// ════════════════════════════════════════════════════════════════════════════

export const LoopDiagram: React.FC<{
  data: { nodes: Array<{ id: string; label: string; color: string; angle: number }> };
  durationInFrames: number;
}> = ({ data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const totalSec = durationInFrames / fps;

  const cx = 960;
  const cy = 540;
  const radius = 280;

  // Each node lights up when its name is spoken (approximate timing)
  const nodeTimings = [
    { id: 'detect', activeFrom: 0,    activeTo: totalSec / 3 },
    { id: 'draft',  activeFrom: totalSec / 3,    activeTo: 2 * totalSec / 3 },
    { id: 'apply',  activeFrom: 2 * totalSec / 3, activeTo: totalSec },
  ];

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Cooler tones at end ("while we relax")
  const transitionAt = totalSec - 8;
  const isCool = time > transitionAt;
  const coolFactor = Math.max(0, Math.min(1, (time - transitionAt) / 2));

  const overallOpacity = 0.35 + coolFactor * 0.05;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: exitOpacity }}>
      {/* Background subtle pulse */}
      <AbsoluteFill
        style={{
          background: isCool
            ? `radial-gradient(circle at center, rgba(30,58,138,${0.3 * coolFactor}), transparent 70%)`
            : 'transparent',
        }}
      />

      <svg width="1920" height="1080" style={{ position: 'absolute', opacity: overallOpacity }}>
        <defs>
          <radialGradient id="loopGlow">
            <stop offset="0%" stopColor="rgba(0,212,255,0.3)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0)" />
          </radialGradient>
        </defs>

        {/* Curved arrows between nodes */}
        {data.nodes.map((node, i) => {
          const next = data.nodes[(i + 1) % data.nodes.length];
          const a1 = (node.angle * Math.PI) / 180;
          const a2 = (next.angle * Math.PI) / 180;
          const x1 = cx + Math.cos(a1) * radius;
          const y1 = cy + Math.sin(a1) * radius;
          const x2 = cx + Math.cos(a2) * radius;
          const y2 = cy + Math.sin(a2) * radius;
          // Curved path
          const midA = ((node.angle + next.angle) / 2) * Math.PI / 180;
          const midRadius = radius * 1.15;
          const mx = cx + Math.cos(midA) * midRadius;
          const my = cy + Math.sin(midA) * midRadius;

          // Particle position along arc
          const particleT = ((time * 0.4) + i * 0.33) % 1;
          const px = (1 - particleT) ** 2 * x1 + 2 * (1 - particleT) * particleT * mx + particleT ** 2 * x2;
          const py = (1 - particleT) ** 2 * y1 + 2 * (1 - particleT) * particleT * my + particleT ** 2 * y2;

          return (
            <g key={i}>
              <path
                d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                stroke="rgba(0,212,255,0.5)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="6 4"
              />
              <circle cx={px} cy={py} r="6" fill="#00D4FF" style={{ filter: 'drop-shadow(0 0 8px #00D4FF)' }} />
            </g>
          );
        })}

        {/* Nodes */}
        {data.nodes.map((node, i) => {
          const a = (node.angle * Math.PI) / 180;
          const x = cx + Math.cos(a) * radius;
          const y = cy + Math.sin(a) * radius;
          const isActive =
            time >= nodeTimings[i].activeFrom && time <= nodeTimings[i].activeTo;
          const pulse = isActive ? Math.sin(time * 4) * 0.5 + 0.5 : 0;
          const glowR = 80 + pulse * 30;
          return (
            <g key={node.id}>
              <circle cx={x} cy={y} r={glowR} fill={node.color} opacity={0.15 + pulse * 0.2} />
              <circle cx={x} cy={y} r="60" fill="rgba(15,23,42,0.9)" stroke={node.color} strokeWidth="4" />
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                fontSize="28"
                fontWeight="900"
                fill={node.color}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', filter: `drop-shadow(0 0 ${5 + pulse * 10}px ${node.color})` }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 19 — Daily timeline
// ════════════════════════════════════════════════════════════════════════════

export const DailyTimeline: React.FC<{
  zone: AvatarZone;
  title: string;
  data: { events: Array<{ time: string; label: string; icon: string }> };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const lineY = 750;
  const lineX1 = area.x + 100;
  const lineX2 = area.x + area.w - 100;
  const lineW = lineX2 - lineX1;
  const totalSec = durationInFrames / fps;
  const progress = Math.min(1, (frame / fps) / totalSec);

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 70,
          width: area.w,
          textAlign: 'center',
          fontSize: 64,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {/* Timeline base */}
      <div
        style={{
          position: 'absolute',
          left: lineX1,
          top: lineY,
          width: lineW,
          height: 6,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 3,
          opacity: exitOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: lineX1,
          top: lineY,
          width: lineW * progress,
          height: 6,
          background: 'linear-gradient(90deg, #00D4FF, #FFD700)',
          borderRadius: 3,
          boxShadow: '0 0 20px #00D4FF',
          opacity: exitOpacity,
        }}
      />

      {/* Events */}
      {data.events.map((evt, i) => {
        const entry = useEntrance(0.5 + i * 0.8);
        const xRatio = i / (data.events.length - 1);
        const x = lineX1 + lineW * xRatio;
        return (
          <React.Fragment key={i}>
            {/* Marker */}
            <div
              style={{
                position: 'absolute',
                left: x - 16,
                top: lineY - 14,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#00D4FF',
                border: '4px solid #FFFFFF',
                boxShadow: '0 0 25px #00D4FF',
                opacity: entry * exitOpacity,
                transform: `scale(${interpolate(entry, [0, 1], [0.3, 1])})`,
              }}
            />
            {/* Label above */}
            <div
              style={{
                position: 'absolute',
                left: x - 130,
                top: lineY - 200,
                width: 260,
                textAlign: 'center',
                opacity: entry * exitOpacity,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 10 }}>{evt.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#00D4FF', marginBottom: 4 }}>{evt.time}</div>
              <div style={{ fontSize: 26, color: '#FFFFFF', fontWeight: 600 }}>{evt.label}</div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 20 — Cost dashboard
// ════════════════════════════════════════════════════════════════════════════

export const CostDashboard: React.FC<{
  zone: AvatarZone;
  title: string;
  data: {
    items: Array<{ label: string; value: string; target: number; perVideo?: boolean }>;
    total: { label: string; value: string; target: number };
    caption: string;
  };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const item1Entry = useEntrance(0.6);
  const item2Entry = useEntrance(1.4);
  const totalEntry = useEntrance(2.6, { damping: 12, stiffness: 100, mass: 1 });
  const captionEntry = useEntrance(4.0);

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const time = frame / fps;
  const dollarPulse = Math.sin(time * 4) * 0.5 + 0.5;

  // Counter for $0.08
  const item2Counter = (item2Entry * 0.08).toFixed(2);

  const dashboardX = area.x + 120;
  const dashboardW = area.w - 240;
  const dashboardY = 220;

  return (
    <>
      <BackgroundChrome style="highlight" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 80,
          width: area.w,
          textAlign: 'center',
          fontSize: 110,
          fontWeight: 900,
          color: '#FFD700',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textShadow: '0 0 35px #FFD700, 0 0 70px #FF8C00',
          opacity: titleEntry * exitOpacity,
          transform: `scale(${interpolate(titleEntry, [0, 1], [0.7, 1])})`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {/* Item 1: $0 with dollar particles */}
      <div
        style={{
          position: 'absolute',
          left: dashboardX,
          top: dashboardY,
          width: dashboardW,
          height: 130,
          display: 'flex',
          alignItems: 'center',
          padding: '0 30px',
          background: 'rgba(15,23,42,0.7)',
          border: '2px solid rgba(255,215,0,0.4)',
          borderRadius: 12,
          opacity: item1Entry * exitOpacity,
          transform: `translateX(${interpolate(item1Entry, [0, 1], [-60, 0])}px)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ flex: 1, fontSize: 32, color: '#FFFFFF' }}>{data.items[0].label}</div>
        <div
          style={{
            position: 'relative',
            fontSize: 96,
            fontWeight: 900,
            color: '#FFD700',
            textShadow: `0 0 ${30 + dollarPulse * 25}px #FFD700, 0 0 ${50 + dollarPulse * 30}px #00D4FF`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          $0
          <span style={{ fontSize: 32, color: '#94A3B8', fontWeight: 400, marginLeft: 12 }}>/ month</span>
          {/* Floating dollar particles */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const phase = (time * 1.5 + i * 1.2) % 3;
            const opacity = phase < 0.3 ? phase / 0.3 : phase > 2.5 ? (3 - phase) / 0.5 : 1;
            const yOffset = -phase * 60;
            const xOffset = Math.sin(phase * 3 + i) * 30;
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: 30 + i * 12,
                  top: 30,
                  fontSize: 28,
                  color: i % 2 === 0 ? '#FFD700' : '#00D4FF',
                  opacity: opacity * 0.7,
                  transform: `translate(${xOffset}px, ${yOffset}px)`,
                  pointerEvents: 'none',
                }}
              >
                $
              </span>
            );
          })}
        </div>
      </div>

      {/* Item 2: $0.08 with counter */}
      <div
        style={{
          position: 'absolute',
          left: dashboardX,
          top: dashboardY + 160,
          width: dashboardW,
          height: 130,
          display: 'flex',
          alignItems: 'center',
          padding: '0 30px',
          background: 'rgba(15,23,42,0.7)',
          border: '2px solid rgba(255,215,0,0.4)',
          borderRadius: 12,
          opacity: item2Entry * exitOpacity,
          transform: `translateX(${interpolate(item2Entry, [0, 1], [-60, 0])}px)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ flex: 1, fontSize: 32, color: '#FFFFFF' }}>{data.items[1].label}</div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            color: '#FFD700',
            textShadow: '0 0 25px #FFD700',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          ${item2Counter}
          <span style={{ fontSize: 28, color: '#94A3B8', fontWeight: 400, marginLeft: 12 }}>/ video</span>
        </div>
      </div>

      {/* Total */}
      <div
        style={{
          position: 'absolute',
          left: dashboardX,
          top: dashboardY + 350,
          width: dashboardW,
          height: 160,
          display: 'flex',
          alignItems: 'center',
          padding: '0 30px',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(20,184,166,0.25))',
          border: '4px solid #FFD700',
          borderRadius: 16,
          boxShadow: `0 0 ${30 + dollarPulse * 20}px rgba(255,215,0,0.5)`,
          opacity: totalEntry * exitOpacity,
          transform: `scale(${interpolate(totalEntry, [0, 1], [0.85, 1])})`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ flex: 1, fontSize: 44, fontWeight: 900, color: '#FFD700', letterSpacing: '0.1em' }}>
          {data.total.label}
        </div>
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: '0 0 35px #FFD700, 0 0 70px #FF8C00',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {data.total.value}
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          position: 'absolute',
          left: dashboardX,
          top: dashboardY + 540,
          width: dashboardW,
          textAlign: 'center',
          fontSize: 32,
          fontStyle: 'italic',
          color: '#FFF4CC',
          opacity: captionEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: '0 0 15px rgba(255,215,0,0.5)',
        }}
      >
        {data.caption}
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 21 — Live queue UI mockup
// ════════════════════════════════════════════════════════════════════════════

export const LiveQueue: React.FC<{
  zone: AvatarZone;
  title: string;
  data: {
    url: string;
    filter: string;
    rows: Array<{ type: string; title: string; when: string; status: string }>;
    stats: string;
  };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const appX = area.x + 60;
  const appY = 200;
  const appW = area.w - 120;
  const appH = 770;

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 70,
          width: area.w,
          textAlign: 'center',
          fontSize: 56,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {/* Browser frame */}
      <div
        style={{
          position: 'absolute',
          left: appX,
          top: appY,
          width: appW,
          height: appH,
          background: '#0F172A',
          borderRadius: 12,
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          border: '1px solid rgba(0,212,255,0.2)',
          opacity: exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* URL bar */}
        <div
          style={{
            height: 50,
            background: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 12,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <div style={{ flex: 1, background: '#0F172A', padding: '6px 14px', borderRadius: 6, fontSize: 16, color: '#7DD3FC', fontFamily: 'Menlo, Monaco, "Courier New", monospace' }}>
            {data.url}
          </div>
        </div>

        {/* Filter pill */}
        <div style={{ padding: '20px 20px 12px' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(0,212,255,0.15)',
              border: '1px solid #00D4FF',
              borderRadius: 16,
              padding: '6px 14px',
              fontSize: 16,
              color: '#00D4FF',
            }}
          >
            {data.filter}
          </div>
        </div>

        {/* Rows */}
        <div style={{ padding: '0 20px' }}>
          {data.rows.map((row, i) => {
            const entry = useEntrance(0.5 + i * 0.3);
            const isAuto = row.status === 'auto-applied';
            // Hover effect — subtle glow that moves through rows
            const hoverCycle = (frame / fps - i * 0.2) % 6;
            const isHovered = hoverCycle < 0.4;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: isHovered ? 'rgba(0,212,255,0.08)' : 'transparent',
                  opacity: entry,
                  transform: `translateX(${(1 - entry) * -20}px)`,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                <div style={{ flex: 1, fontSize: 22, color: '#E5E7EB' }}>{row.title}</div>
                <div style={{ width: 100, fontSize: 16, color: '#94A3B8' }}>{row.when}</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: isAuto ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    border: `1px solid ${isAuto ? '#10B981' : '#F59E0B'}`,
                    color: isAuto ? '#10B981' : '#F59E0B',
                  }}
                >
                  {isAuto ? '✓ ' : ''}{row.status}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats footer */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            background: '#1E293B',
            padding: '14px 24px',
            fontSize: 18,
            color: '#94A3B8',
            borderTop: '1px solid rgba(0,212,255,0.2)',
            letterSpacing: '0.02em',
          }}
        >
          {data.stats}
        </div>
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 22 — Apply cards
// ════════════════════════════════════════════════════════════════════════════

export const ApplyCards: React.FC<{
  zone: AvatarZone;
  title: string;
  data: {
    cards: Array<{
      title: string;
      field1: { label: string; value: string };
      field2: { label: string; value: string };
      when: string;
    }>;
  };
  durationInFrames: number;
}> = ({ zone, title, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const titleEntry = useEntrance(0);
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const time = frame / fps;

  const cardW = Math.min(area.w - 100, 1100);
  const cardH = 240;
  const cardX = area.x + (area.w - cardW) / 2;
  const cardYStart = 200;
  const cardGap = 30;

  return (
    <>
      <BackgroundChrome style="body" zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: 60,
          width: area.w,
          textAlign: 'center',
          fontSize: 56,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.06em',
          opacity: titleEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </div>

      {data.cards.map((card, i) => {
        const entry = useEntrance(0.5 + i * 0.5);
        const hover = Math.sin((time + i * 0.5) * 1.5) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cardX,
              top: cardYStart + i * (cardH + cardGap),
              width: cardW,
              height: cardH,
              background: 'rgba(15,23,42,0.85)',
              border: '2px solid rgba(0,212,255,0.4)',
              borderRadius: 14,
              padding: 28,
              opacity: entry * exitOpacity,
              transform: `translateY(${interpolate(entry, [0, 1], [40, 0])}px) scale(${1 + hover * 0.005})`,
              boxShadow: '0 15px 40px rgba(0,0,0,0.4), 0 0 25px rgba(0,212,255,0.15)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#FFFFFF' }}>{card.title}</div>
              <div
                style={{
                  background: 'rgba(16,185,129,0.2)',
                  border: '2px solid #10B981',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#10B981',
                  letterSpacing: '0.06em',
                  textShadow: '0 0 10px rgba(16,185,129,0.5)',
                }}
              >
                ✓ AUTO-APPLIED
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 22 }}>
              <div>
                <span style={{ color: '#94A3B8' }}>{card.field1.label}: </span>
                <span style={{ color: '#7DD3FC', fontFamily: 'Menlo, Monaco, "Courier New", monospace' }}>{card.field1.value}</span>
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>{card.field2.label}: </span>
                <span style={{ color: '#7DD3FC', fontFamily: 'Menlo, Monaco, "Courier New", monospace' }}>{card.field2.value}</span>
              </div>
              <div style={{ marginTop: 'auto', color: '#64748B', fontSize: 18, fontStyle: 'italic' }}>{card.when}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 23 — Orbiting elements (avatar centered, CS mode)
// ════════════════════════════════════════════════════════════════════════════

export const Orbiting: React.FC<{
  data: { elements: Array<{ pos: string; icon: string; label: string }> };
  durationInFrames: number;
}> = ({ data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const totalSec = durationInFrames / fps;

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Each element fades up at a specific time
  const fadeStarts = [
    totalSec * 0.15, // wiki page brightens on "less noise"
    totalSec * 0.35, // magnifying glass on "self-sharpening"
    totalSec * 0.55, // checkmarks on "more accurate"
    totalSec * 0.75, // growth arrow on "compounds"
  ];

  // Orbit positions — keeping CENTER COLUMN clear (x=660..1260)
  // Larger 2.2× elements need a bit more room — pull anchors slightly inboard
  const orbitalPositions = {
    TL: { x: 320, y: 270 },
    TR: { x: 1600, y: 270 },
    BL: { x: 320, y: 810 },
    BR: { x: 1600, y: 810 },
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: exitOpacity }}>
      {/* Subtle particle field around center */}
      {Array.from({ length: 40 }).map((_, i) => {
        const hash = ((42 + i) * 2654435761) >>> 0;
        const angle = (hash % 360) * Math.PI / 180;
        const baseR = 380 + (hash >> 8) % 200;
        const r = baseR + Math.sin(time + i * 0.5) * 30;
        const x = 960 + Math.cos(angle + time * 0.1) * r;
        const y = 540 + Math.sin(angle + time * 0.1) * r * 0.7;
        const size = 3 + (hash >> 16) % 6;
        const isCenter = x > 660 && x < 1260; // skip if it would land in avatar zone
        if (isCenter) return null;
        const colorIdx = i % 2;
        const color = colorIdx === 0 ? '#00D4FF' : '#FFD700';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              opacity: 0.4 + Math.sin(time * 1.5 + i) * 0.3,
            }}
          />
        );
      })}

      {/* Four orbiting elements */}
      {data.elements.map((elem, i) => {
        const pos = orbitalPositions[elem.pos as keyof typeof orbitalPositions];
        if (!pos) return null;
        const fadeStart = fadeStarts[i];
        const isActive = time >= fadeStart && time <= fadeStart + 5;
        const fadeUp = Math.max(0, Math.min(1, (time - fadeStart) * 0.8));
        const baseOpacity = 0.4 + fadeUp * 0.5;
        const pulse = isActive ? Math.sin((time - fadeStart) * 4) * 0.2 + 0.8 : 0.6;

        // Slow orbital motion
        const orbitOffset = {
          x: Math.cos(time * 0.3 + i * Math.PI / 2) * 25,
          y: Math.sin(time * 0.3 + i * Math.PI / 2) * 25,
        };

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos.x - 220 + orbitOffset.x,
              top: pos.y - 200 + orbitOffset.y,
              width: 440,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: baseOpacity,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div
              style={{
                fontSize: 200,
                marginBottom: 28,
                filter: `drop-shadow(0 0 ${30 + pulse * 35}px ${i % 2 === 0 ? '#00D4FF' : '#FFD700'})`,
                transform: `scale(${pulse})`,
              }}
            >
              {elem.icon}
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 800,
                color: i % 2 === 0 ? '#00D4FF' : '#FFD700',
                textAlign: 'center',
                textShadow: `0 0 25px ${i % 2 === 0 ? '#00D4FF' : '#FFD700'}, 0 4px 12px rgba(0,0,0,0.8)`,
                letterSpacing: '0.04em',
              }}
            >
              {elem.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 27 — Verb sweeps
// ════════════════════════════════════════════════════════════════════════════

export const VerbSweeps: React.FC<{
  data: { verbs: string[] };
  durationInFrames: number;
}> = ({ data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalSec = durationInFrames / fps;
  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Spread verbs across segment (with last 3s held for "less work")
  const verbWindow = totalSec - 3;
  const perVerb = verbWindow / data.verbs.length;
  const time = frame / fps;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: exitOpacity }}>
      {/* Subtle pulsing cyan/gold particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const hash = ((101 + i) * 2654435761) >>> 0;
        const x = ((hash % 1700) + 110) % 1920;
        const y = ((hash >> 8) % 900) + 90;
        const isInCenter = x > 660 && x < 1260 && y > 200 && y < 880;
        if (isInCenter) return null;
        const size = 4 + (hash >> 16) % 6;
        const phase = (hash % 628) / 100;
        const opacity = (Math.sin(time * 1.2 + phase) * 0.5 + 0.5) * 0.5;
        const color = i % 2 === 0 ? '#00D4FF' : '#FFD700';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin(time + phase) * 20,
              top: y + Math.cos(time * 0.7 + phase) * 15,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              opacity,
            }}
          />
        );
      })}

      {/* Verb sweeps (one at a time, fade in/out) */}
      {data.verbs.map((verb, i) => {
        const verbStart = i * perVerb;
        const local = time - verbStart;
        if (local < 0 || local > 2.0) return null;
        const opacity = local < 0.4 ? local / 0.4 * 0.35 : local > 1.5 ? (2.0 - local) / 0.5 * 0.35 : 0.35;
        const x = interpolate(local, [0, 2.0], [-300, 1920 + 200]);
        const y = 100 + (i % 3) * 280;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontSize: 110,
              fontWeight: 200,
              color: '#7DF9FF',
              letterSpacing: '0.1em',
              opacity,
              textShadow: '0 0 30px rgba(125,249,255,0.5)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontStyle: 'italic',
            }}
          >
            {verb}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SEGMENT 28 — End card (CTA)
// ════════════════════════════════════════════════════════════════════════════

export const EndCard: React.FC<{
  zone: AvatarZone;
  data: { chips: string[] };
  durationInFrames: number;
}> = ({ zone, data, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const area = getSafeArea(zone);
  const time = frame / fps;
  const totalSec = durationInFrames / fps;

  const buttonEntry = useEntrance(0.3, { damping: 12, stiffness: 110, mass: 1 });
  const shareEntry = useEntrance(1.2);
  const chipsEntry = useEntrance(1.0);

  const exitFrames = Math.floor(0.5 * fps);
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subscribe button click micro-animation around 1s in
  const clickFrame = Math.floor(1.5 * fps);
  const clickProgress = interpolate(frame, [clickFrame, clickFrame + 4, clickFrame + 8, clickFrame + 12], [1, 0.94, 1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Chip rotation
  const chipDuration = 4;
  const currentChipIdx = Math.floor((time / chipDuration) % data.chips.length);
  const chipPhase = (time / chipDuration) % 1;
  const chipOpacity = chipPhase < 0.15 ? chipPhase / 0.15 : chipPhase > 0.85 ? (1 - chipPhase) / 0.15 : 1;

  // Pulse for subscribe button
  const buttonPulse = Math.sin(time * 2.5) * 0.5 + 0.5;

  const subscribeX = 760;
  const subscribeY = 380;

  return (
    <>
      <BackgroundChrome style="title" zone={zone} area={area} />

      {/* SUBSCRIBE button */}
      <div
        style={{
          position: 'absolute',
          left: subscribeX,
          top: subscribeY,
          width: 400,
          height: 140,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #00D4FF, #0EA5E9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 54,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.1em',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          boxShadow: `0 10px 40px rgba(0,212,255,${0.4 + buttonPulse * 0.3}), 0 0 ${30 + buttonPulse * 30}px rgba(0,212,255,0.4)`,
          opacity: buttonEntry * exitOpacity,
          transform: `scale(${interpolate(buttonEntry, [0, 1], [0.5, 1]) * clickProgress})`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          cursor: 'pointer',
        }}
      >
        SUBSCRIBE
      </div>

      {/* Comment chip row */}
      <div
        style={{
          position: 'absolute',
          left: subscribeX,
          top: subscribeY + 180,
          width: 400,
          textAlign: 'center',
          opacity: chipsEntry * exitOpacity,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ fontSize: 22, color: '#94A3B8', marginBottom: 14 }}>💬 comment about</div>
        <div
          style={{
            display: 'inline-block',
            padding: '12px 26px',
            borderRadius: 24,
            background: '#0F172A',
            border: '2px solid #FFD700',
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 600,
            opacity: chipOpacity,
            boxShadow: '0 0 25px rgba(255,215,0,0.4)',
            letterSpacing: '0.04em',
          }}
        >
          {data.chips[currentChipIdx]}
        </div>
      </div>

      {/* Share arrow on left */}
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 460,
          opacity: shareEntry * exitOpacity,
          transform: `scale(${1 + Math.sin(time * 3) * 0.05})`,
          filter: 'drop-shadow(0 0 20px #00D4FF)',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="55" fill="rgba(0,212,255,0.15)" stroke="#00D4FF" strokeWidth="3" />
          <path d="M 35,60 L 75,60 M 60,40 L 80,60 L 60,80" fill="none" stroke="#00D4FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ textAlign: 'center', fontSize: 22, color: '#00D4FF', fontWeight: 700, marginTop: 8, letterSpacing: '0.1em', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          SHARE
        </div>
      </div>

      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          bottom: 60,
          fontSize: 24,
          fontWeight: 700,
          color: '#FFD700',
          letterSpacing: '0.15em',
          textShadow: '0 0 15px rgba(255,215,0,0.5)',
          opacity: exitOpacity * 0.7,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        BYRDDYNASTY
      </div>
    </>
  );
};
