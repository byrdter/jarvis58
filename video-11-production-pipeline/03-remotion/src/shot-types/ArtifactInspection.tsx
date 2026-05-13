/**
 * ArtifactInspection — "look at the thing the system produced."
 *
 * Distinct from browser-playback (action happening) and zoom-punch (aggressive
 * push-in on one region). Renders the artifact at fitted scale and reveals it
 * line-by-line / row-by-row with optional highlight callouts. Pacing is
 * slow / contemplative — the viewer is meant to read.
 *
 * Variants share a single chrome:
 *   - lines    → markdown/log/report text
 *   - table    → SQLite table, CSV preview, beads list
 *   - imageSrc → pre-rendered chart, screenshot, beads issue card
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONT } from './theme';
import type { ArtifactTable, ArtifactHighlight } from './types';

export interface ArtifactInspectionProps {
  source: string;
  title?: string;
  lines?: string[];
  table?: ArtifactTable;
  imageSrc?: string;
  highlights?: ArtifactHighlight[];
}

const REVEAL_STAGGER = 5;
const HEADER_REVEAL = 12;

export const ArtifactInspection: React.FC<ArtifactInspectionProps> = ({
  source, title, lines, table, imageSrc, highlights = [],
}) => {
  const frame = useCurrentFrame();
  const chromeOp = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const itemCount = lines?.length ?? table?.rows.length ?? 1;
  const lookupHighlight = (idx: number): number | undefined => {
    const h = highlights.find((x) => (lines ? x.line === idx : x.row === idx));
    if (!h) return undefined;
    return h.appearAt ?? HEADER_REVEAL + itemCount * REVEAL_STAGGER + 12;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', fontFamily: FONT.sans }}>
      <div
        style={{
          width: 1480,
          maxHeight: 920,
          background: COLORS.bgPanel,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
          opacity: chromeOp,
          color: COLORS.textPrimary,
        }}
      >
        {/* Chrome — attribution strip */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 22px',
            background: COLORS.bgRaised,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: COLORS.accentWarm + '22',
              border: `1px solid ${COLORS.accentWarm}66`,
              color: COLORS.accentWarm,
              fontSize: 14, letterSpacing: 2, fontWeight: 700,
            }}
          >
            ARTIFACT
          </span>
          <span style={{ fontFamily: FONT.mono, fontSize: 18, color: COLORS.textDim }}>{source}</span>
          {title && (
            <span style={{ marginLeft: 'auto', fontSize: 18, color: COLORS.textPrimary }}>{title}</span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '30px 36px', minHeight: 480 }}>
          {imageSrc && (
            <Img src={staticFile(imageSrc)} style={{ width: '100%', borderRadius: 8 }} />
          )}

          {lines && (
            <div style={{ fontFamily: FONT.mono, fontSize: 24, lineHeight: 1.55 }}>
              {lines.map((ln, i) => {
                const startF = HEADER_REVEAL + i * REVEAL_STAGGER;
                const op = interpolate(frame - startF, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                const highlightAt = lookupHighlight(i);
                const flashOp =
                  highlightAt !== undefined
                    ? interpolate(frame - highlightAt, [0, 8, 24, 36], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                    : 0;
                return (
                  <div
                    key={i}
                    style={{
                      opacity: op,
                      padding: '2px 12px',
                      borderLeft: flashOp > 0 ? `4px solid ${COLORS.accent}` : '4px solid transparent',
                      background: flashOp > 0 ? `rgba(0,212,255,${0.18 * flashOp})` : 'transparent',
                      transition: 'none',
                    }}
                  >
                    {ln}
                  </div>
                );
              })}
            </div>
          )}

          {table && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT.mono, fontSize: 22 }}>
              <thead>
                <tr>
                  {table.headers.map((h, i) => (
                    <th
                      key={i}
                      style={{
                        textAlign: 'left',
                        padding: '12px 14px',
                        borderBottom: `2px solid ${COLORS.border}`,
                        color: COLORS.textDim,
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => {
                  const startF = HEADER_REVEAL + i * REVEAL_STAGGER;
                  const op = interpolate(frame - startF, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                  const highlightAt = lookupHighlight(i);
                  const flashOp =
                    highlightAt !== undefined
                      ? interpolate(frame - highlightAt, [0, 8, 24, 36], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                      : 0;
                  return (
                    <tr
                      key={i}
                      style={{
                        opacity: op,
                        background: flashOp > 0 ? `rgba(0,212,255,${0.18 * flashOp})` : 'transparent',
                        borderLeft: flashOp > 0 ? `4px solid ${COLORS.accent}` : '4px solid transparent',
                      }}
                    >
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '10px 14px', borderBottom: `1px solid ${COLORS.border}` }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
