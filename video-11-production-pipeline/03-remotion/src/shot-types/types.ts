/**
 * Closed shot-type menu for the video pipeline.
 *
 * Every script segment maps to exactly one shot kind. The composer reads
 * (segment_text, kind, data) and renders the matching component. Pure
 * table-driven production — no per-video bespoke React.
 */

export type ShotKind =
  | 'talking-head-full'
  | 'talking-head-pip'
  | 'terminal-tape'
  | 'code-reveal'
  | 'diagram-build'
  | 'file-tree'
  | 'diff'
  | 'browser-playback'
  | 'artifact-inspection'
  | 'zoom-punch'
  | 'notification'
  | 'metric-ticker'
  | 'side-by-side';

export interface ArtifactTable {
  headers: string[];
  rows: string[][];
}

export interface ArtifactHighlight {
  /** 0-indexed line for markdown/lines variant. */
  line?: number;
  /** 0-indexed row for table variant. */
  row?: number;
  /** Frame on which to reveal the highlight. Computed default if omitted. */
  appearAt?: number;
}

export type Corner = 'BR' | 'BL' | 'TR' | 'TL';
export type Shape = 'circle' | 'square';

export interface TerminalLine {
  /** Command line (typewriter-in). */
  cmd?: string;
  /** Output line (fade-in after cmd). */
  out?: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  /** 0..1 horizontal, 0..1 vertical. */
  x: number;
  y: number;
  shape?: 'circle' | 'rect' | 'pill';
  accent?: 'primary' | 'warm' | 'good' | 'bad';
}

export interface DiagramEdge {
  from: string;
  to: string;
  /** 'solid' | 'dashed' (default solid). */
  style?: 'solid' | 'dashed';
  label?: string;
}

export interface FileTreeEntry {
  path: string;
  isDir: boolean;
  depth: number;
}

export interface NotificationProps {
  app: 'slack' | 'telegram' | 'email';
  from: string;
  text: string;
  avatar?: string;
}

/**
 * Discriminated union of every shot in the menu.
 * The composer routes on `kind`.
 */
export type Shot =
  | { kind: 'talking-head-full'; src?: string; label?: string }
  | { kind: 'talking-head-pip'; src?: string; corner: Corner; shape: Shape; underlay?: Shot }
  | { kind: 'terminal-tape'; title?: string; prompt?: string; lines: TerminalLine[] }
  | { kind: 'code-reveal'; title?: string; language?: string; lines: string[] }
  | { kind: 'diagram-build'; title?: string; nodes: DiagramNode[]; edges: DiagramEdge[] }
  | { kind: 'file-tree'; root: string; entries: FileTreeEntry[] }
  | { kind: 'diff'; filename: string; removed: string[]; added: string[] }
  | { kind: 'browser-playback'; src?: string; url?: string; caption?: string; speedX?: number }
  | {
      kind: 'artifact-inspection';
      /** Attribution label shown in the chrome (e.g. "beads:jarvis-q28", "command-center.db"). */
      source: string;
      title?: string;
      /** Plain-text/markdown lines, fade-revealed top-to-bottom. */
      lines?: string[];
      /** Table content (mutually exclusive with `lines`). */
      table?: ArtifactTable;
      /** Image rendering (e.g. a pre-rendered chart, screenshot, or beads card). */
      imageSrc?: string;
      /** Optional callouts that flash a row/line in sequence. */
      highlights?: ArtifactHighlight[];
    }
  | { kind: 'zoom-punch'; src?: string; focus: { x: number; y: number; w: number; h: number }; caption?: string }
  | { kind: 'notification'; app: 'slack' | 'telegram' | 'email'; from: string; text: string; avatar?: string }
  | { kind: 'metric-ticker'; label: string; from: number; to: number; prefix?: string; suffix?: string; durationSec?: number }
  | { kind: 'side-by-side'; leftLabel: string; rightLabel: string; leftSrc?: string; rightSrc?: string };
