/**
 * Video 11 — segment → shot-kind mapping.
 *
 * Source: ../01-script/VIDEO-11-SCRIPT-V2.md (30 segments, 2026-05-13).
 * REC = candidate for real screen recording (Playwright/VHS/ffmpeg).
 * MUST-REC = must record live for credibility.
 *
 * The composer reads this table and renders the matching shot per segment.
 * Edit `shot` to swap a generated visual for a screen recording later.
 */

import type { ShotKind } from './shot-types';

export interface SegmentPlan {
  seg: number;
  /** Spoken seconds (from script). */
  dur: number;
  /** Avatar position. FS = full-frame talking head; PIP-BR/BL = corner; NONE = avatar hidden. */
  avatar: 'FS' | 'PIP-BR' | 'PIP-BL' | 'NONE';
  shot: ShotKind;
  /** Short title from the script. */
  title: string;
  /** REC candidate flagged in the script, if any. */
  rec?: 'medium' | 'high' | 'must';
}

export const VIDEO_11_PLAN: SegmentPlan[] = [
  { seg:  1, dur: 25, avatar: 'FS',     shot: 'talking-head-full', title: 'Hook — made in under an hour' },
  { seg:  2, dur: 22, avatar: 'FS',     shot: 'diagram-build',     title: 'Three paths tease' },
  { seg:  3, dur: 28, avatar: 'PIP-BR', shot: 'side-by-side',      title: 'Manual vs pipeline' },
  { seg:  4, dur: 28, avatar: 'PIP-BR', shot: 'diagram-build',     title: 'The stack (four-quadrant)' },
  { seg:  5, dur: 24, avatar: 'PIP-BR', shot: 'diagram-build',     title: 'Optional connectors (radial)' },
  { seg:  6, dur: 22, avatar: 'PIP-BR', shot: 'diagram-build',     title: 'Three forking paths' },
  { seg:  7, dur: 28, avatar: 'PIP-BR', shot: 'terminal-tape',     title: 'Path A — API curl + orchestration', rec: 'high' },
  { seg:  8, dur: 30, avatar: 'PIP-BR', shot: 'metric-ticker',     title: 'Path A — pricing tiers' },
  { seg:  9, dur: 26, avatar: 'PIP-BR', shot: 'browser-playback',  title: 'Path B — Claude drives HeyGen UI', rec: 'must' },
  { seg: 10, dur: 28, avatar: 'PIP-BR', shot: 'side-by-side',      title: 'Path B — API vs Browser cost' },
  { seg: 11, dur: 28, avatar: 'PIP-BR', shot: 'browser-playback',  title: 'Path C — 20-min HeyGen session (time-lapse)', rec: 'must' },
  { seg: 12, dur: 30, avatar: 'PIP-BR', shot: 'code-reveal',       title: 'Path C — SSML pause protocol + waveform' },
  { seg: 13, dur: 22, avatar: 'PIP-BR', shot: 'browser-playback',  title: 'Path C — Finder drag handoff', rec: 'medium' },
  { seg: 14, dur: 20, avatar: 'PIP-BR', shot: 'diagram-build',     title: 'Three paths converge' },
  { seg: 15, dur: 12, avatar: 'PIP-BR', shot: 'diagram-build',     title: '5 stages preview (numbered icons)' },
  { seg: 16, dur: 28, avatar: 'PIP-BR', shot: 'terminal-tape',     title: 'Stage 1 — AssemblyAI JSON + waveform', rec: 'medium' },
  { seg: 17, dur: 26, avatar: 'PIP-BR', shot: 'diagram-build',     title: 'Stage 2 — AI director maps visuals' },
  { seg: 18, dur: 30, avatar: 'PIP-BR', shot: 'browser-playback',  title: 'Stage 3 — HyperFrames preview', rec: 'high' },
  { seg: 19, dur: 30, avatar: 'PIP-BR', shot: 'file-tree',         title: 'Stage 4 — Remotion is React (src/ tree)', rec: 'must' },
  { seg: 20, dur: 28, avatar: 'PIP-BR', shot: 'code-reveal',       title: 'Stage 4 — transitions + captions (split)', rec: 'high' },
  { seg: 21, dur: 26, avatar: 'PIP-BR', shot: 'terminal-tape',     title: 'Stage 5 — remotion render', rec: 'must' },
  { seg: 22, dur: 24, avatar: 'PIP-BR', shot: 'diagram-build',     title: 'Stage 5 — QA loop branches' },
  { seg: 23, dur: 10, avatar: 'FS',     shot: 'talking-head-full', title: 'Bridge — which path?' },
  { seg: 24, dur: 22, avatar: 'PIP-BL', shot: 'diagram-build',     title: 'Decision — volume (Path A)' },
  { seg: 25, dur: 24, avatar: 'PIP-BL', shot: 'diagram-build',     title: 'Decision — budget (Path B)' },
  { seg: 26, dur: 30, avatar: 'PIP-BL', shot: 'metric-ticker',     title: 'Decision — Path C: 20 + 40 = 60 min' },
  { seg: 27, dur: 22, avatar: 'PIP-BL', shot: 'zoom-punch',        title: 'Why Path C — avatar in spotlight' },
  { seg: 28, dur: 20, avatar: 'PIP-BL', shot: 'diagram-build',     title: 'Framework recap (three-path summary)' },
  { seg: 29, dur: 28, avatar: 'FS',     shot: 'side-by-side',      title: 'Takeaways 1 & 2' },
  { seg: 30, dur: 26, avatar: 'FS',     shot: 'talking-head-full', title: 'Takeaway 3 + send-off' },
];

// Sanity: every shot kind used in the plan is in the menu.
const _kindsUsed = new Set(VIDEO_11_PLAN.map((p) => p.shot));
export const VIDEO_11_KIND_HISTOGRAM = Array.from(_kindsUsed).sort();
