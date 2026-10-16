import type { Host } from '../src/platform/types';
import type { Sound } from '../src/core/game';
export interface TextDraw { text: string; x: number; y: number }
export function mockCanvas() {
  let draws: TextDraw[] = [], operations = 0;
  const state: Record<string, unknown> = { font: '16px sans-serif' };
  const ctx = new Proxy(state, { get(target, key: string) {
    if (key in target) return target[key];
    if (key === 'clearRect') return () => { draws = []; operations++; };
    if (key === 'fillText') return (text: string, x: number, y: number) => { draws.push({ text, x, y }); operations++; };
    if (key === 'measureText') return (text: string) => ({ width: text.length * (Number(String(target.font).match(/([\d.]+)px/)?.[1] ?? 16) * .8) });
    if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop() {} });
    return (...args: unknown[]) => { for (const a of args) if (typeof a === 'number' && !Number.isFinite(a)) throw new Error(`Non-finite canvas parameter in ${key}`); operations++; };
  } }) as unknown as CanvasRenderingContext2D;
  const canvas = { width: 0, height: 0, getContext: () => ctx } as unknown as HTMLCanvasElement;
  return { canvas, ctx, get texts() { return draws; }, get operations() { return operations; } };
}
export function mockHost(width = 390, height = 844, raw: unknown = null) {
  const drawing = mockCanvas(), storage = new Map<string, string>(), sounds: Sound[] = [];
  let hidden: () => void = () => {}, resized: () => void = () => {}, key: (key: string) => void = () => {}, pointer: (x: number, y: number) => void = () => {}, frame: ((t: number) => void) | null = null;
  const host: Host = {
    canvas: drawing.canvas, size: () => ({ width, height, dpr: 2, safeTop: 0, safeBottom: 0 }),
    read: k => storage.get(k) ?? raw, write: (k, v) => { storage.set(k, v); return true; },
    frame: cb => { frame = cb; return 1; }, cancelFrame: () => { frame = null; },
    onPointer: cb => { pointer = cb; }, onMove: () => {}, onKey: cb => { key = cb; }, onResize: cb => { resized = cb; }, onHide: cb => { hidden = cb; },
    sound: s => { sounds.push(s); }, silence: () => {}, destroy: () => {},
  };
  return { host, drawing, storage, sounds, hide: () => hidden(), key: (s: string) => key(s), tap: (x: number, y: number) => pointer(x, y), frame: (time: number) => frame?.(time), resize: (w: number, h: number) => { width = w; height = h; resized(); } };
}
