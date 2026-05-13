import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { COLORS, FONT } from './theme';
import type { TerminalLine } from './types';

export interface TerminalTapeProps {
  title?: string;
  prompt?: string;
  lines: TerminalLine[];
}

const TYPE_CHARS_PER_FRAME = 1.2;
const PAUSE_BETWEEN_LINES = 12;

export const TerminalTape: React.FC<TerminalTapeProps> = ({
  title = 'terminal',
  prompt = '~ $',
  lines,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute per-line start frames sequentially.
  const lineStarts: number[] = [];
  let cursor = 12;
  for (const ln of lines) {
    lineStarts.push(cursor);
    const cmdLen = (ln.cmd?.length ?? 0) / TYPE_CHARS_PER_FRAME;
    const outLen = ln.out ? 8 + ln.out.split('\n').length * 4 : 0;
    cursor += Math.ceil(cmdLen) + outLen + PAUSE_BETWEEN_LINES;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 1500,
          background: COLORS.bgPanel,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          fontFamily: FONT.mono,
          color: COLORS.textPrimary,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '14px 18px',
            background: COLORS.bgRaised,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
          <span style={{ marginLeft: 16, fontSize: 16, color: COLORS.textDim }}>{title}</span>
        </div>

        <div style={{ padding: '26px 32px', fontSize: 26, lineHeight: 1.5, minHeight: 540 }}>
          {lines.map((ln, i) => {
            const startF = lineStarts[i];
            const localF = frame - startF;
            if (localF < 0) return null;

            const cmd = ln.cmd ?? '';
            const typed = Math.min(cmd.length, Math.floor(localF * TYPE_CHARS_PER_FRAME));
            const cmdDone = typed >= cmd.length;
            const outStart = Math.ceil(cmd.length / TYPE_CHARS_PER_FRAME) + 6;
            const outVisible = cmdDone && localF >= outStart;

            return (
              <div key={i} style={{ marginBottom: 10 }}>
                {ln.cmd && (
                  <div>
                    <span style={{ color: COLORS.accent, marginRight: 12 }}>{prompt}</span>
                    <span>{cmd.slice(0, typed)}</span>
                    {!cmdDone && (
                      <span style={{ opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0 }}>▌</span>
                    )}
                  </div>
                )}
                {ln.out && outVisible && (
                  <div style={{ color: COLORS.textDim, whiteSpace: 'pre-wrap' }}>{ln.out}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
