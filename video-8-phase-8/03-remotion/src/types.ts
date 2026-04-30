// Avatar position vocabulary from REMOTION-PRODUCTION-PROMPT.md
export type AvatarZone =
  | 'FS'    // Avatar full screen — render NO graphics (or background-only)
  | 'FS-G'  // Graphic-only segment — full frame is yours
  | 'BR-C'  // Bottom-right circle PiP ~384px
  | 'BR-S'  // Bottom-right rounded-square PiP ~384px
  | 'BL-C'  // Bottom-left circle PiP
  | 'BL-S'  // Bottom-left rounded-square PiP
  | 'SL'    // Avatar holds left third (x=0..640)
  | 'SR'    // Avatar holds right third (x=1280..1920)
  | 'CS';   // Avatar centered (x=660..1260, full height)

export type VisualStyle = 'title' | 'body' | 'highlight';

// Bounding box of the area available for graphics (avoids the avatar's reserved zone)
export interface SafeArea {
  x: number;
  y: number;
  w: number;
  h: number;
  // Side accent line position
  accentSide: 'left' | 'right' | 'none';
}

/**
 * Returns the available rendering area for a given avatar composition mode.
 * Graphics MUST stay within this box to avoid colliding with the avatar.
 */
export function getSafeArea(zone: AvatarZone): SafeArea {
  switch (zone) {
    case 'FS':
      // Avatar fills entire frame; no rendering area
      return { x: 0, y: 0, w: 0, h: 0, accentSide: 'none' };
    case 'FS-G':
      return { x: 0, y: 0, w: 1920, h: 1080, accentSide: 'left' };
    case 'BR-C':
    case 'BR-S':
      // Avatar PiP in bottom-right ~420×420; the avatar video is overlaid on
      // top of the chrome, so the chrome can fill the FULL frame — the PiP
      // covers its own corner. Layout components keep main content out of
      // the bottom-right corner via their internal positioning.
      return { x: 0, y: 0, w: 1920, h: 1080, accentSide: 'left' };
    case 'BL-C':
    case 'BL-S':
      return { x: 0, y: 0, w: 1920, h: 1080, accentSide: 'right' };
    case 'SL':
      // Avatar holds left third (0..640); chrome fills right two-thirds.
      return { x: 640, y: 0, w: 1280, h: 1080, accentSide: 'right' };
    case 'SR':
      // Avatar holds right third (1280..1920); chrome fills left two-thirds.
      return { x: 0, y: 0, w: 1280, h: 1080, accentSide: 'left' };
    case 'CS':
      // Avatar centered (660..1260); we render around the edges
      return { x: 0, y: 0, w: 1920, h: 1080, accentSide: 'none' };
  }
}

// Segment-specific kinds for custom components
export type SegmentKind =
  | 'standard'         // Generic AnimatedText (title + lines)
  | 'lower-third'      // Segment 1 — TV news-style banner
  | 'numbered-badges'  // Segment 7 — three floating numerals
  | 'wiki-conflict'    // Segment 4 — pages disagreeing
  | 'silo-bridge'      // Segment 5 — two clouds bridging
  | 'queue-list'       // Segment 6 — scrolling queue
  | 'three-phase'      // Segment 8 — contradiction detection demo
  | 'flowchart'        // Segment 9
  | 'terminal'         // Segments 10, 16
  | 'bridge-clusters'  // Segment 11
  | 'sketched-bridge'  // Segment 12
  | 'card-sort'        // Segment 14
  | 'risk-table'       // Segment 15
  | 'loop-diagram'     // Segment 17
  | 'daily-timeline'   // Segment 19
  | 'cost-dashboard'   // Segment 20
  | 'live-queue'       // Segment 21
  | 'apply-cards'      // Segment 22
  | 'orbiting'         // Segment 23
  | 'verb-sweeps'      // Segment 27
  | 'end-card'         // Segment 28
  | 'none';            // Segments 2, 13, 18, 24, 25, 26, 29 — no overlay

export interface SegmentSpec {
  segment: number;
  start: number;
  end: number;
  duration: number;
  type: 'voiceover' | 'image';
  composition: AvatarZone;
  kind: SegmentKind;
  style: VisualStyle;
  title: string;
  subtitle?: string;
  lines?: string[];
  // Optional custom data for specific kinds
  data?: Record<string, unknown>;
}
