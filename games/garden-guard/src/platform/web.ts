import { createWebCanvasHost } from '@game-collection/platform/canvas-web';
import { reportGameState } from '@game-collection/platform/web-state';
import { NOTES } from './audio';
export const webHost = (canvas: HTMLCanvasElement) => ({ ...createWebCanvasHost(canvas, NOTES), reportState: reportGameState });
