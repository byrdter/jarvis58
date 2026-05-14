import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONT } from './theme';
import type { FileTreeEntry } from './types';

export interface FileTreeProps {
  root: string;
  entries: FileTreeEntry[];
}

const STAGGER = 4;

export const FileTree: React.FC<FileTreeProps> = ({ root, entries }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 1300,
          background: COLORS.bgPanel,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: '40px 44px',
          fontFamily: FONT.mono,
          fontSize: 28,
          color: COLORS.textPrimary,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ color: COLORS.accent, marginBottom: 16 }}>📁 {root}/</div>
        {entries.map((e, i) => {
          const startF = 6 + i * STAGGER;
          const opacity = interpolate(frame - startF, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const dx = interpolate(frame - startF, [0, 10], [-12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${dx}px)`,
                paddingLeft: e.depth * 32,
                color: e.isDir ? COLORS.accent : COLORS.textPrimary,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: COLORS.textDim, marginRight: 8 }}>{e.isDir ? '▸' : '·'}</span>
              {e.path}
              {e.isDir && '/'}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
