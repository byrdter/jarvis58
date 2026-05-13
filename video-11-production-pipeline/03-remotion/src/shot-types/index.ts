/**
 * Shot-type menu. The composer imports from here only — never from the
 * individual component files — so adding a new shot is one-stop.
 */

export { TalkingHeadFull } from './TalkingHeadFull';
export { TalkingHeadPip } from './TalkingHeadPip';
export { TerminalTape } from './TerminalTape';
export { CodeReveal } from './CodeReveal';
export { DiagramBuild } from './DiagramBuild';
export { FileTree } from './FileTree';
export { Diff } from './Diff';
export { BrowserPlayback } from './BrowserPlayback';
export { ArtifactInspection } from './ArtifactInspection';
export { ZoomPunch } from './ZoomPunch';
export { Notification } from './Notification';
export { MetricTicker } from './MetricTicker';
export { SideBySide } from './SideBySide';

export type {
  ShotKind, Shot, Corner, Shape,
  TerminalLine, DiagramNode, DiagramEdge, FileTreeEntry,
  ArtifactTable, ArtifactHighlight,
} from './types';
export { COLORS, FONT, FRAME } from './theme';
