import { createMiniCanvasHost, type MiniAPI } from '@game-collection/platform/canvas-mini';
import type { Sound } from '../core/game';
export type { MiniAPI } from '@game-collection/platform/canvas-mini';
export const miniHost = (api: MiniAPI) => createMiniCanvasHost<Sound>(api);
