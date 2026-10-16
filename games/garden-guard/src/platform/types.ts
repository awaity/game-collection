import type { CanvasHost } from '@game-collection/platform/canvas-host';
import type { Sound } from '../core/game';
export type { Size } from '@game-collection/platform/canvas-host';
export interface Host extends CanvasHost<Sound> { reportState?(state: 'menu' | 'playing' | 'paused' | 'result'): void }
