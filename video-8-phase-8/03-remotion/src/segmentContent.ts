import type { SegmentSpec } from './types';

// ─── Corrected timings (2026-04-30) ──────────────────────────────────────
// Previously: 29 segments with drift (false-positive silence at 104.7s split
// script seg 4 in two, shifting all later segment numbers by one).
// Now: 28 segments. Boundaries pinned via whisper-cpp word-level transcript
// matching opener phrases. Recording's seg 28 is the merged CTA + emotional
// close (script segs 28 + 29) — the user merged them during HeyGen recording.

export const SEGMENTS: SegmentSpec[] = [
  // ─── SEGMENT 1 — Hook + intro, lower-third sweeps in at end ──────────────
  {
    segment: 1,
    start: 0.00,
    end: 39.20,
    duration: 39.20,
    type: 'voiceover',
    composition: 'FS',
    kind: 'lower-third',
    style: 'title',
    title: 'PHASE 8',
    subtitle: 'the second brain gets sharper',
    data: { sweepInAt: 33.0 },
  },

  // ─── SEGMENT 2 — IMAGE (Phase 7 self-improvement loop) ───────────────────
  {
    segment: 2,
    start: 40.68,
    end: 65.07,
    duration: 24.39,
    type: 'image',
    composition: 'BR-C',
    kind: 'none',
    style: 'body',
    title: '',
  },

  // ─── SEGMENT 3 — Three blind spots ───────────────────────────────────────
  {
    segment: 3,
    start: 66.68,
    end: 88.75,
    duration: 22.07,
    type: 'voiceover',
    composition: 'SR',
    kind: 'wiki-conflict',
    style: 'body',
    title: 'THREE BLIND SPOTS',
    lines: ['pages contradict', 'knowledge stuck', 'approve everything'],
  },

  // ─── SEGMENT 4 — Pages that disagree ─────────────────────────────────────
  // Now full-length (was incorrectly split into two short segments before)
  {
    segment: 4,
    start: 90.08,
    end: 120.03,
    duration: 29.95,
    type: 'voiceover',
    composition: 'SL',
    kind: 'wiki-conflict',
    style: 'body',
    title: 'PROBLEM 1: PAGES THAT DISAGREE',
    data: {
      leftWiki: { name: 'INVESTMENTS WIKI', value: '≤ 25%' },
      rightWiki: { name: 'METHODOLOGY WIKI', value: '≤ 20%' },
    },
  },

  // ─── SEGMENT 5 — Knowledge in silos ──────────────────────────────────────
  {
    segment: 5,
    start: 121.56,
    end: 146.52,
    duration: 24.96,
    type: 'voiceover',
    composition: 'SR',
    kind: 'silo-bridge',
    style: 'body',
    title: 'PROBLEM 2: KNOWLEDGE IN SILOS',
    data: {
      topCloud: { name: 'AI FILMMAKING', concept: 'constraint-driven creativity' },
      bottomCloud: { name: 'INVESTMENTS', concept: 'position sizing limits' },
    },
  },

  // ─── SEGMENT 6 — Queue full of obvious fixes ─────────────────────────────
  {
    segment: 6,
    start: 147.84,
    end: 172.12,
    duration: 24.28,
    type: 'voiceover',
    composition: 'SL',
    kind: 'queue-list',
    style: 'body',
    title: 'THE QUEUE — PRE-PHASE-8',
    subtitle: 'every item needed approval',
  },

  // ─── SEGMENT 7 — Phase 8: three additions ────────────────────────────────
  {
    segment: 7,
    start: 173.64,
    end: 198.02,
    duration: 24.38,
    type: 'voiceover',
    composition: 'FS',
    kind: 'numbered-badges',
    style: 'title',
    title: '',
    data: { labels: ['CONTRADICTIONS', 'BRIDGES', 'AUTO-APPLY'] },
  },

  // ─── SEGMENT 8 — Contradiction detection: concept ────────────────────────
  {
    segment: 8,
    start: 200.60,
    end: 226.23,
    duration: 25.63,
    type: 'voiceover',
    composition: 'BR-C',
    kind: 'three-phase',
    style: 'body',
    title: 'CONTRADICTION DETECTION',
    data: {
      phases: [
        { duration: 7, label: 'string match: catches nothing' },
        { duration: 8, label: 'LLM reads each page' },
        { duration: 9, label: 'semantic match: conflict found' },
      ],
    },
  },

  // ─── SEGMENT 9 — Contradiction detection: how it works ───────────────────
  {
    segment: 9,
    start: 227.96,
    end: 254.42,
    duration: 26.46,
    type: 'voiceover',
    composition: 'SR',
    kind: 'flowchart',
    style: 'body',
    title: 'HOW IT WORKS',
    data: {
      nodes: [
        { id: 'pair',     label: 'Page Pair Selector',  pos: { col: 0, row: 0 } },
        { id: 'claude',   label: 'Claude Subprocess',   pos: { col: 0, row: 1 } },
        { id: 'check',    label: 'Contradicts?',        pos: { col: 0, row: 2 }, shape: 'diamond' },
        { id: 'proposal', label: 'Structured Proposal', pos: { col: 0, row: 3 } },
        { id: 'queue',    label: 'improvements_queue',  pos: { col: 0, row: 4 } },
      ],
    },
  },

  // ─── SEGMENT 10 — Contradiction detector demo (terminal) ─────────────────
  {
    segment: 10,
    start: 255.08,
    end: 285.71,
    duration: 30.63,
    type: 'voiceover',
    composition: 'BL-C',
    kind: 'terminal',
    style: 'body',
    title: '',
    data: {
      lines: [
        '$ bun run video-pipeline/detect-contradictions.ts --wiki investments',
        '[selecting page pairs by tag overlap...]',
        '[5 candidate pairs identified]',
        '[spawning claude subprocess... pid 47291]',
        '[scanning pair 1/5: position-sizing-rules.md ↔ methodology.md]',
        '[scanning pair 2/5: stop-loss-strategy.md ↔ trade-execution.md]',
        '[scanning pair 3/5: risk-management.md ↔ stop-loss-strategy.md]',
        '[scanning pair 4/5: trade-execution.md ↔ daily-checklist.md]',
        '[scanning pair 5/5: position-sizing-rules.md ↔ risk-management.md]',
        '✓ contradiction: position-sizing-rules.md ↔ methodology.md',
        '✓ contradiction: stop-loss-strategy.md ↔ trade-execution.md',
        '[2 proposals queued]',
      ],
    },
  },

  // ─── SEGMENT 11 — Cross-wiki bridges concept ─────────────────────────────
  {
    segment: 11,
    start: 287.88,
    end: 310.31,
    duration: 22.43,
    type: 'voiceover',
    composition: 'BR-S',
    kind: 'bridge-clusters',
    style: 'body',
    title: 'CROSS-WIKI BRIDGES',
    data: {
      clusters: [
        { pos: 'TL', name: 'INVESTMENTS',  color: '#FFD700', pills: ['position sizing', 'stop losses', 'asset class', 'risk tier', 'regime'] },
        { pos: 'TR', name: 'AI FILMMAKING', color: '#00D4FF', pills: ['constraint-driven design', 'shot list', 'reference film', 'mood board', 'look dev'] },
        { pos: 'CL', name: 'OPERATIONS',   color: '#FFFFFF', pills: ['weekly review', 'metrics', 'OKRs', 'team rituals', 'cadence'] },
        { pos: 'BL', name: 'CLAUDE CODE',  color: '#7DF9FF', pills: ['subprocess pattern', 'review queue', 'prompt design', 'context', 'tools'] },
      ],
      bridgeFrom: { cluster: 'TR', pill: 'constraint-driven design' },
      bridgeTo:   { cluster: 'TL', pill: 'position sizing' },
      caption: 'the bridge detector finds these',
    },
  },

  // ─── SEGMENT 12 — Bridge real example ────────────────────────────────────
  {
    segment: 12,
    start: 311.96,
    end: 341.49,
    duration: 29.53,
    type: 'voiceover',
    composition: 'SR',
    kind: 'sketched-bridge',
    style: 'body',
    title: 'BRIDGE — REAL EXAMPLE',
    data: {
      leftCard:  { title: 'THE CONSTRAINT LOOP (filmmaking)',     phrase: 'constraint-driven' },
      rightCard: { title: 'POSITION SIZING AS CONSTRAINT',        phrase: 'constraint-driven' },
    },
  },

  // ─── SEGMENT 13 — IMAGE (wiki graph after Phase 8) ───────────────────────
  {
    segment: 13,
    start: 343.00,
    end: 363.17,
    duration: 20.17,
    type: 'image',
    composition: 'FS-G',
    kind: 'none',
    style: 'body',
    title: '',
  },

  // ─── SEGMENT 14 — Auto-apply tier concept ────────────────────────────────
  {
    segment: 14,
    start: 365.72,
    end: 390.88,
    duration: 25.16,
    type: 'voiceover',
    composition: 'BR-C',
    kind: 'card-sort',
    style: 'body',
    title: 'AUTO-APPLY TIER',
    data: {
      cards: [
        { title: 'fix typo', target: 'methodology.md',         tier: 'low'    },
        { title: 'add link', target: 'sizing→strategy',        tier: 'low'    },
        { title: 'format fix', target: 'oauth-setup.md',       tier: 'low'    },
        { title: 'cross-wiki bridge', target: 'context-mgmt',  tier: 'medium' },
        { title: 'restructure', target: 'risk-tiers.md',       tier: 'medium' },
        { title: 'contradiction', target: 'sizing-rules.md',   tier: 'high'   },
      ],
    },
  },

  // ─── SEGMENT 15 — Risk tiers ─────────────────────────────────────────────
  {
    segment: 15,
    start: 392.48,
    end: 423.60,
    duration: 31.12,
    type: 'voiceover',
    composition: 'SL',
    kind: 'risk-table',
    style: 'highlight',
    title: 'RISK TIERS',
    data: {
      rows: [
        { tier: 'LOW',    color: '#10B981', examples: 'typo • missing link • format • broken-link', action: 'AUTO-APPLY' },
        { tier: 'MEDIUM', color: '#F59E0B', examples: 'cross-wiki bridge • additive content',       action: 'AUTO + NOTIFY' },
        { tier: 'HIGH',   color: '#EF4444', examples: 'contradiction resolve • removal • structural', action: 'HUMAN REVIEW' },
      ],
      split: { low: 70, medium: 20, high: 10 },
      splitLabel: 'actual split, last 14 days',
    },
  },

  // ─── SEGMENT 16 — Auto-apply running (terminal) ──────────────────────────
  {
    segment: 16,
    start: 425.40,
    end: 452.27,
    duration: 26.87,
    type: 'voiceover',
    composition: 'BR-S',
    kind: 'terminal',
    style: 'body',
    title: '',
    data: {
      lines: [
        '$ bun run video-pipeline/run-auto-apply.ts',
        '[2026-04-25 12:00:01] starting daily-auto-apply',
        '[scanning improvements_queue for unreviewed proposals...]',
        '[14 proposals found]',
        '[classifying by risk tier...]',
        '[low-risk: 9, medium: 3, high: 2]',
        '[applying 9 low-risk proposals...]',
        '✓ typo-fix: methodology.md (PR #482)',
        '✓ broken-link: trade-execution.md (PR #483)',
        '✓ missing-link: position-sizing.md (PR #484)',
        '✓ format-fix: ai-filmmaking-overview.md (PR #485)',
        '✓ typo-fix: cinematography.md (PR #486)',
        '✓ missing-link: subprocess-pattern.md (PR #487)',
        '✓ broken-link: scheduler.md (PR #488)',
        '✓ format-fix: oauth-setup.md (PR #489)',
        '✓ typo-fix: vector-search.md (PR #490)',
        '[3 medium-risk: notification sent]',
        '[2 high-risk: queued for review]',
        '[done in 47s]',
      ],
    },
  },

  // ─── SEGMENT 17 — All three running together — avatar carries the moment ─
  // (Previously had a loop-diagram overlay, but the dim cyan/gold nodes landed
  //  on top of the avatar's face and the user couldn't tell what they were
  //  for. Cleaner to let the FS avatar carry this beat alone.)
  {
    segment: 17,
    start: 453.96,
    end: 474.63,
    duration: 20.67,
    type: 'voiceover',
    composition: 'FS',
    kind: 'none',
    style: 'highlight',
    title: '',
  },

  // ─── SEGMENT 18 — IMAGE (architecture diagram) ───────────────────────────
  // CRITICAL: type='image' → no Remotion overlay renders here.
  {
    segment: 18,
    start: 476.12,
    end: 509.25,
    duration: 33.13,
    type: 'image',
    composition: 'SR',
    kind: 'none',
    style: 'body',
    title: '',
  },

  // ─── SEGMENT 19 — Daily schedule timeline ────────────────────────────────
  {
    segment: 19,
    start: 511.48,
    end: 535.26,
    duration: 23.78,
    type: 'voiceover',
    composition: 'SL',
    kind: 'daily-timeline',
    style: 'body',
    title: 'DAILY SCHEDULE',
    data: {
      events: [
        { time: '8 AM',        label: 'Daily Reflection', icon: '🌅' },
        { time: '10 AM',       label: 'Detector Scan',    icon: '🔍' },
        { time: '11 AM-12 PM', label: 'Drafter Pass',     icon: '✍️' },
        { time: '12 PM',       label: 'Auto-Apply Run',   icon: '⚡' },
        { time: '6 PM',        label: 'User Review',      icon: '👁️' },
      ],
    },
  },

  // ─── SEGMENT 20 — The cost (dinner caption removed) ──────────────────────
  {
    segment: 20,
    start: 536.52,
    end: 557.20,
    duration: 20.68,
    type: 'voiceover',
    composition: 'BR-C',
    kind: 'cost-dashboard',
    style: 'highlight',
    title: 'THE COST',
    data: {
      items: [
        { label: 'Claude calls (OAuth subprocess)', value: '$0',    target: 0 },
        { label: 'AssemblyAI captions',              value: '$0.08', target: 0.08, perVideo: true },
      ],
      total: { label: 'TOTAL', value: '~$2 / month', target: 2 },
      caption: '',
    },
  },

  // ─── SEGMENT 21 — Live queue right now ───────────────────────────────────
  {
    segment: 21,
    start: 558.56,
    end: 588.48,
    duration: 29.92,
    type: 'voiceover',
    composition: 'SR',
    kind: 'live-queue',
    style: 'body',
    title: 'LIVE QUEUE — RIGHT NOW',
    data: {
      url: 'localhost:3000/queue',
      filter: 'Last 7 days',
      rows: [
        { type: 'auto',    title: 'fix typo on methodology.md',       when: '2h ago', status: 'auto-applied' },
        { type: 'auto',    title: 'add link sizing→strategy',         when: '5h ago', status: 'auto-applied' },
        { type: 'auto',    title: 'broken-link in scheduler.md',      when: '1d ago', status: 'auto-applied' },
        { type: 'pending', title: 'cross-wiki bridge: ops↔claude-code', when: '6h ago', status: 'pending' },
        { type: 'auto',    title: 'format-fix vector-search.md',      when: '1d ago', status: 'auto-applied' },
        { type: 'pending', title: 'contradiction: sizing rules',      when: '3h ago', status: 'pending' },
      ],
      stats: '11 auto-applied · 4 pending · 2 contradictions · 3 bridges this week',
    },
  },

  // ─── SEGMENT 22 — This week's auto-applies (cards) ───────────────────────
  {
    segment: 22,
    start: 590.08,
    end: 617.22,
    duration: 27.14,
    type: 'voiceover',
    composition: 'SL',
    kind: 'apply-cards',
    style: 'body',
    title: 'THIS WEEK’S AUTO-APPLIES',
    data: {
      cards: [
        {
          title: 'Missing Link Added',
          field1: { label: 'Source', value: 'position-sizing.md' },
          field2: { label: 'Target', value: 'methodology.md' },
          when: 'applied 2d ago',
        },
        {
          title: 'Typo Fixed',
          field1: { label: 'File',   value: 'ai-filmmaking-overview.md' },
          field2: { label: 'Detail', value: '‘cinematograhy’ → ‘cinematography’' },
          when: 'applied 4d ago',
        },
        {
          title: 'Cross-Wiki Bridge',
          field1: { label: 'From→To', value: 'operations → claude code' },
          field2: { label: 'Concept', value: 'context window management' },
          when: 'applied 1d ago',
        },
      ],
    },
  },

  // ─── SEGMENT 23 — The compounding effect (orbiting) ──────────────────────
  {
    segment: 23,
    start: 618.68,
    end: 642.05,
    duration: 23.37,
    type: 'voiceover',
    composition: 'CS',
    kind: 'orbiting',
    style: 'highlight',
    title: '',
    data: {
      elements: [
        { pos: 'TL', icon: '📄', label: 'cleaner pages' },
        { pos: 'TR', icon: '🔍', label: 'sharper focus' },
        { pos: 'BL', icon: '✓✓', label: 'more checks'   },
        { pos: 'BR', icon: '📈', label: 'compounds'     },
      ],
    },
  },

  // ─── SEGMENT 24 — IMAGE (Phase roadmap) ──────────────────────────────────
  {
    segment: 24,
    start: 643.80,
    end: 664.51,
    duration: 20.71,
    type: 'image',
    composition: 'FS',
    kind: 'none',
    style: 'body',
    title: '',
  },

  // ─── SEGMENT 25 — IMAGE (Phase 9 tease) ──────────────────────────────────
  {
    segment: 25,
    start: 666.37,
    end: 696.97,
    duration: 30.60,
    type: 'image',
    composition: 'SR',
    kind: 'none',
    style: 'body',
    title: '',
  },

  // ─── SEGMENT 26 — IMAGE (Phase 10 tease) ─────────────────────────────────
  {
    segment: 26,
    start: 698.80,
    end: 728.16,
    duration: 29.36,
    type: 'image',
    composition: 'SL',
    kind: 'none',
    style: 'body',
    title: '',
  },

  // ─── SEGMENT 27 — Vision close (verb sweeps over avatar) ─────────────────
  {
    segment: 27,
    start: 729.60,
    end: 752.44,
    duration: 22.84,
    type: 'voiceover',
    composition: 'FS',
    kind: 'verb-sweeps',
    style: 'title',
    title: '',
    data: { verbs: ['captures', 'organizes', 'heals', 'sharpens', 'listens', 'responds'] },
  },

  // ─── SEGMENT 28 — Merged CTA + emotional close ───────────────────────────
  // The user merged script segs 28 & 29 during recording. Composition is BR-C
  // so the avatar shrinks to a corner PiP and the end-card graphic fills the
  // rest of the frame (subscribe button, comment chips, share).
  {
    segment: 28,
    start: 754.00,
    end: 798.08,
    duration: 44.08,
    type: 'voiceover',
    composition: 'BR-C',
    kind: 'end-card',
    style: 'title',
    title: 'SUBSCRIBE',
    data: { chips: ['agent commerce', 'alignment', 'regulation', 'your own stack'] },
  },
];
