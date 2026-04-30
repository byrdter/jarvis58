import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import type { AvatarZone, VisualStyle, SafeArea } from '../types';
import { getSafeArea } from '../types';

// ─── Shared style configuration ──────────────────────────────────────────────

export const STYLE_CONFIG = {
  title: {
    bg1: '#8B5CF6',
    bg2: '#1E3A8A',
    gridColor: 'rgba(0, 212, 255, 0.08)',
    gridSize: 50,
    particleCount: 30,
    particleColors: ['#00D4FF', '#A855F7', '#7DF9FF'],
    particleSizeRange: [4, 8] as [number, number],
    particleSpeed: 1.2,
    titleSize: 140,
    subtitleSize: 64,
    lineSize: 56,
    titleColor: '#00D4FF',
    textColor: '#FFFFFF',
    glowColor: '#00D4FF',
    glowColor2: '#A855F7',
    cornerColor: '#00D4FF',
    accentColor: '#00D4FF',
    springConfig: { damping: 15, stiffness: 100, mass: 1 },
    pulseSpeed: 2,
    pulseRange: [1.0, 1.3] as [number, number],
  },
  body: {
    bg1: '#0F172A',
    bg2: '#020617',
    gridColor: 'rgba(255, 255, 255, 0.05)',
    gridSize: 60,
    particleCount: 20,
    particleColors: ['#FFFFFF', '#00D4FF', '#E5E7EB'],
    particleSizeRange: [3, 6] as [number, number],
    particleSpeed: 0.6,
    titleSize: 72,
    subtitleSize: 56,
    lineSize: 50,
    titleColor: '#FFFFFF',
    textColor: '#E5E7EB',
    glowColor: 'rgba(255,255,255,0.6)',
    glowColor2: 'rgba(0,212,255,0.3)',
    cornerColor: '#FFFFFF',
    accentColor: '#00D4FF',
    springConfig: { damping: 20, stiffness: 80, mass: 1 },
    pulseSpeed: 3,
    pulseRange: [0.95, 1.0] as [number, number],
  },
  highlight: {
    bg1: '#14B8A6',
    bg2: '#059669',
    gridColor: 'rgba(255, 215, 0, 0.12)',
    gridSize: 40,
    particleCount: 30,
    particleColors: ['#FFD700', '#FF8C00', '#FFF4CC'],
    particleSizeRange: [5, 10] as [number, number],
    particleSpeed: 1.5,
    titleSize: 100,
    subtitleSize: 68,
    lineSize: 60,
    titleColor: '#FFD700',
    textColor: '#FFF4CC',
    glowColor: '#FFD700',
    glowColor2: '#FF8C00',
    cornerColor: '#FFD700',
    accentColor: '#FFD700',
    springConfig: { damping: 12, stiffness: 120, mass: 1 },
    pulseSpeed: 1.5,
    pulseRange: [1.0, 1.4] as [number, number],
  },
} as const;

export type StyleConfig = typeof STYLE_CONFIG[VisualStyle];

// ─── Particle generator ──────────────────────────────────────────────────────

export interface Particle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  phase: number;
  sizeOffset: number;
}

export function generateParticles(count: number, area: SafeArea, seed = 42): Particle[] {
  const particles: Particle[] = [];
  const w = area.w || 1920;
  const h = area.h || 1080;
  for (let i = 0; i < count; i++) {
    const hash = ((seed + i) * 2654435761) >>> 0;
    particles.push({
      x: area.x + (hash % w),
      y: area.y + ((hash >> 8) % h),
      speedX: ((hash >> 4) % 100 - 50) / 80,
      speedY: ((hash >> 12) % 100 - 50) / 80,
      phase: (hash % 628) / 100,
      sizeOffset: (hash >> 16) % 100 / 100,
    });
  }
  return particles;
}

// ─── Reusable background chrome ──────────────────────────────────────────────

export const BackgroundChrome: React.FC<{
  style: VisualStyle;
  zone: AvatarZone;
  area: SafeArea;
  opacity?: number;
}> = ({ style, zone, area, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cfg = STYLE_CONFIG[style];

  const time = frame / fps;
  const pulse = Math.sin((time * Math.PI * 2) / cfg.pulseSpeed) * 0.5 + 0.5;
  const gridOffset = frame * (style === 'title' ? 1.2 : style === 'highlight' ? 1.0 : 0.6);

  const particles = useMemo(
    () => generateParticles(cfg.particleCount, area, 42 + (style.charCodeAt(0) || 0)),
    [cfg.particleCount, area.x, area.y, area.w, area.h, style]
  );

  // Constrained background: only render inside the safe area for non-FS zones
  const isFullFrame = zone === 'FS-G' || zone === 'CS' || (area.w === 1920 && area.h === 1080 && area.x === 0 && area.y === 0);
  const containerStyle: React.CSSProperties = isFullFrame
    ? {}
    : {
        position: 'absolute',
        left: area.x,
        top: area.y,
        width: area.w,
        height: area.h,
        overflow: 'hidden',
      };

  const gradientAngle = 135 + Math.sin(time * 0.3) * 15;

  return (
    <div style={containerStyle}>
      {/* Gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${cfg.bg1} 0%, ${cfg.bg2} 50%, ${cfg.bg1} 100%)`,
          opacity,
        }}
      />

      {/* Grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            style === 'title'
              ? `linear-gradient(45deg, ${cfg.gridColor} 1px, transparent 1px), linear-gradient(135deg, ${cfg.gridColor} 1px, transparent 1px)`
              : style === 'highlight'
              ? `linear-gradient(0deg, ${cfg.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${cfg.gridColor} 1px, transparent 1px)`
              : `linear-gradient(0deg, ${cfg.gridColor} 1px, transparent 1px)`,
          backgroundSize: `${cfg.gridSize}px ${cfg.gridSize}px`,
          transform:
            style === 'title'
              ? `translate(${gridOffset}px, ${gridOffset}px)`
              : `translateY(${gridOffset}px)`,
          opacity: 0.5 * opacity,
        }}
      />

      {/* Particles — positioned relative to container */}
      <AbsoluteFill style={{ opacity: opacity * 0.85 }}>
        {particles.map((p, i) => {
          const localX = ((p.x - area.x) + frame * p.speedX * cfg.particleSpeed + Math.sin(time + p.phase) * 30) % area.w;
          const localY = ((p.y - area.y) + frame * p.speedY * cfg.particleSpeed + Math.cos(time * 0.7 + p.phase) * 25) % area.h;
          const px = (localX < 0 ? localX + area.w : localX);
          const py = (localY < 0 ? localY + area.h : localY);
          const pSize =
            cfg.particleSizeRange[0] + p.sizeOffset * (cfg.particleSizeRange[1] - cfg.particleSizeRange[0]);
          const sizePulse = pSize * (1 + Math.sin(time * 2 + p.phase) * 0.2);
          const pOpacity = interpolate(Math.sin(time * 1.5 + p.phase), [-1, 1], [0.3, 0.85]);
          const color = cfg.particleColors[i % cfg.particleColors.length];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: px,
                top: py,
                width: sizePulse,
                height: sizePulse,
                borderRadius: '50%',
                background: color,
                opacity: pOpacity,
                boxShadow: `0 0 ${sizePulse * 3}px ${color}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Vignette for body style */}
      {style === 'body' && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${interpolate(pulse, [0, 1], [0.3, 0.5])}) 100%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Side accent line */}
      {area.accentSide !== 'none' && (
        <div
          style={{
            position: 'absolute',
            [area.accentSide]: 30,
            top: '8%',
            width: 4,
            height: '84%',
            background: `linear-gradient(180deg, ${cfg.accentColor}, transparent)`,
            borderRadius: 2,
            boxShadow: `0 0 12px ${cfg.accentColor}`,
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
};

// ─── Main AnimatedText component ─────────────────────────────────────────────

export interface AnimatedTextProps {
  title: string;
  subtitle?: string;
  lines?: string[];
  style: VisualStyle;
  zone: AvatarZone;
  durationInFrames: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  title,
  subtitle,
  lines = [],
  style,
  zone,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cfg = STYLE_CONFIG[style];
  const area = getSafeArea(zone);

  // FS = no rendering area
  if (area.w === 0 || area.h === 0) return null;

  // ─── Animations ────────────────────────────────────────────────────────────
  const entranceProgress = spring({ frame, fps, config: cfg.springConfig });
  const time = frame / fps;
  const pulse = Math.sin((time * Math.PI * 2) / cfg.pulseSpeed) * 0.5 + 0.5;
  const pulseScale = interpolate(pulse, [0, 1], cfg.pulseRange);
  const glowIntensity = interpolate(pulse, [0, 1], [20, 45]);

  const exitFrames = Math.floor(0.5 * fps);
  const exitStart = durationInFrames - exitFrames;
  const exitProgress = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, style === 'highlight' ? 1.3 : 1.2]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitRotate = interpolate(exitProgress, [0, 1], [0, style === 'highlight' ? 5 : -3]);

  const titleScale = interpolate(entranceProgress, [0, 1], [style === 'highlight' ? 0.4 : 0.6, 1]);
  const titleOpacity = entranceProgress;
  const titleRotate = interpolate(entranceProgress, [0, 1], [style === 'highlight' ? 12 : -6, 0]);
  const titleSlideX = interpolate(entranceProgress, [0, 1], [-150, 0]);

  const accentDelay = spring({
    frame: Math.max(0, frame - Math.floor(fps * 0.3)),
    fps,
    config: { damping: 20, stiffness: 60, mass: 1 },
  });

  const lineDelay = style === 'highlight' ? 0.35 : style === 'title' ? 0.3 : 0.2;
  function getLineEntrance(idx: number) {
    const delay = Math.floor((0.5 + idx * lineDelay) * fps);
    return spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 18, stiffness: 90, mass: 1 },
    });
  }

  // Title font sizing — shrink for narrow safe areas
  const titleSizeAdjusted =
    area.w < 1400
      ? Math.round(cfg.titleSize * 0.78)
      : cfg.titleSize;

  return (
    <>
      <BackgroundChrome style={style} zone={zone} area={area} />

      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: area.y,
          width: area.w,
          height: area.h,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '50px 70px',
          gap: 14,
        }}
      >
        {title && (
          <div
            style={{
              fontSize: titleSizeAdjusted,
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: cfg.titleColor,
              textAlign: 'center',
              textTransform: style === 'title' ? 'uppercase' : 'none',
              letterSpacing: style === 'title' ? '0.08em' : '0.02em',
              textShadow: `0 0 ${glowIntensity}px ${cfg.glowColor}, 0 0 ${glowIntensity * 2}px ${cfg.glowColor2}`,
              transform: `scale(${titleScale * exitScale * pulseScale}) rotate(${titleRotate + exitRotate}deg) translateX(${titleSlideX}px)`,
              opacity: titleOpacity * exitOpacity,
              lineHeight: 1.1,
              maxWidth: '95%',
            }}
          >
            {title}
          </div>
        )}

        {subtitle && (
          <div
            style={{
              fontSize: cfg.subtitleSize,
              fontWeight: 400,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: style === 'title' ? '#FFFFFF' : cfg.textColor,
              textAlign: 'center',
              textShadow: `0 0 15px ${cfg.glowColor}`,
              transform: `scale(${interpolate(entranceProgress, [0, 1], [0.7, 1]) * exitScale}) translateX(${interpolate(entranceProgress, [0, 1], [-80, 0])}px)`,
              opacity: interpolate(
                spring({
                  frame: Math.max(0, frame - Math.floor(fps * 0.2)),
                  fps,
                  config: { damping: 18, stiffness: 80, mass: 1 },
                }),
                [0, 1],
                [0, 1]
              ) * exitOpacity,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        )}

        {(title || subtitle) && (
          <div
            style={{
              width: interpolate(accentDelay, [0, 1], [0, 600]),
              height: style === 'title' ? 6 : 4,
              background: `linear-gradient(90deg, ${cfg.accentColor}, transparent)`,
              borderRadius: 3,
              boxShadow: `0 0 ${glowIntensity * 0.5}px ${cfg.accentColor}`,
              opacity: titleOpacity * exitOpacity,
              marginTop: 4,
              marginBottom: 8,
            }}
          />
        )}

        {lines.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, maxWidth: '90%' }}>
            {lines.map((line, idx) => {
              if (line.trim() === '') return <div key={idx} style={{ height: 14 }} />;

              const nonEmptyIdx = lines.slice(0, idx).filter((l) => l.trim() !== '').length;
              const lineEntrance = getLineEntrance(nonEmptyIdx);
              const lineSlideX = interpolate(lineEntrance, [0, 1], [-60, 0]);
              const lineScale = interpolate(lineEntrance, [0, 1], [0.9, 1]);

              const isIndented = line.startsWith('   ');
              const isEmphasis = line.startsWith('=') || line.trim() === '+';
              const hasCheck = line.includes('✓');
              const hasCross = line.includes('✗');
              const isNumbered = /^[①②③④⑤]/.test(line.trim());

              let lineColor: string = cfg.textColor;
              let lineFontSize: number = cfg.lineSize;
              let lineFontWeight: number = 500;

              if (isIndented) {
                lineFontSize = cfg.lineSize - 8;
                lineColor = style === 'highlight' ? '#FFF4CC' : '#B0B8C8';
              } else if (isEmphasis) {
                lineFontSize = cfg.lineSize + 12;
                lineColor = cfg.titleColor;
                lineFontWeight = 800;
              } else if (hasCheck) {
                lineColor = '#4ADE80';
              } else if (hasCross) {
                lineColor = '#FF6B6B';
              } else if (isNumbered) {
                lineFontSize = cfg.lineSize + 6;
                lineFontWeight = 700;
                lineColor = cfg.titleColor;
              }

              return (
                <div
                  key={idx}
                  style={{
                    fontSize: lineFontSize,
                    fontWeight: lineFontWeight,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: lineColor,
                    textAlign: 'center',
                    textShadow:
                      isEmphasis || isNumbered
                        ? `0 0 ${glowIntensity * 0.6}px ${cfg.glowColor}`
                        : `0 0 8px rgba(0,0,0,0.5)`,
                    transform: `translateX(${lineSlideX}px) scale(${lineScale * exitScale})`,
                    opacity: lineEntrance * exitOpacity,
                    lineHeight: 1.35,
                    paddingLeft: isIndented ? 30 : 0,
                  }}
                >
                  {line.trim()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
