import type { CanvasHost, Size } from './canvas-host';
export interface MiniCanvas extends HTMLCanvasElement { requestAnimationFrame?: (fn: (t: number) => void) => number; cancelAnimationFrame?: (id: number) => void }
export interface MiniTouch { clientX?: number; clientY?: number; x?: number; y?: number; identifier?: number }
interface TouchEvent { changedTouches: MiniTouch[]; touches?: MiniTouch[] }
interface Audio { src: string; volume: number; play(): void; stop(): void; destroy(): void; seek?(time: number): void; onError?(fn: () => void): void }
export interface MiniAPI {
  createCanvas(): MiniCanvas;
  getWindowInfo?(): { windowWidth: number; windowHeight: number; pixelRatio: number; safeArea?: { top: number; bottom: number }; statusBarHeight?: number };
  getSystemInfoSync(): { windowWidth: number; windowHeight: number; pixelRatio: number; safeArea?: { top: number; bottom: number }; statusBarHeight?: number };
  getMenuButtonBoundingClientRect?(): { bottom: number; top: number; left: number; right: number };
  getStorageSync(key: string): unknown;
  setStorageSync(key: string, value: string): void;
  onTouchStart(callback: (event: TouchEvent) => void): void;
  offTouchStart?(callback: (event: TouchEvent) => void): void;
  onTouchMove?(callback: (event: TouchEvent) => void): void;
  offTouchMove?(callback: (event: TouchEvent) => void): void;
  onWindowResize?(callback: () => void): void;
  offWindowResize?(callback: () => void): void;
  onHide(callback: () => void): void;
  offHide?(callback: () => void): void;
  createInnerAudioContext?(): Audio;
  setKeepScreenOn?(options: { keepScreenOn: boolean }): void;
}
export function createMiniCanvasHost<Sound extends string>(api: MiniAPI): CanvasHost<Sound> {
  const canvas = api.createCanvas(), cleanup: (() => void)[] = [], sounds = new Map<Sound, Audio>(), played: Partial<Record<Sound, number>> = {};
  const size = (): Size => {
    const info = api.getWindowInfo?.() ?? api.getSystemInfoSync();
    let capsule = 0; try { capsule = api.getMenuButtonBoundingClientRect?.().bottom ?? 0; } catch { /* Older runtimes. */ }
    return { width: info.windowWidth, height: info.windowHeight, dpr: Math.min(info.pixelRatio || 1, 2), safeTop: Math.max(info.safeArea?.top ?? info.statusBarHeight ?? 0, capsule), safeBottom: Math.max(0, info.windowHeight - (info.safeArea?.bottom ?? info.windowHeight)) };
  };
  try { api.setKeepScreenOn?.({ keepScreenOn: true }); } catch { /* Optional feature. */ }
  return {
    canvas, size,
    read(key) { try { return api.getStorageSync(key); } catch { return null; } },
    write(key, value) { try { api.setStorageSync(key, value); return true; } catch { return false; } },
    frame(callback) { if (typeof globalThis.requestAnimationFrame === 'function') return globalThis.requestAnimationFrame(callback); if (canvas.requestAnimationFrame) return canvas.requestAnimationFrame(callback); return setTimeout(() => callback(Date.now()), 16) as unknown as number; },
    cancelFrame(id) { if (typeof globalThis.cancelAnimationFrame === 'function') globalThis.cancelAnimationFrame(id); else if (canvas.cancelAnimationFrame) canvas.cancelAnimationFrame(id); else clearTimeout(id); },
    onPointer(callback) { const handler = (event: TouchEvent) => { const t = event.changedTouches[0]; if (t) callback(t.clientX ?? t.x ?? 0, t.clientY ?? t.y ?? 0); }; api.onTouchStart(handler); cleanup.push(() => api.offTouchStart?.(handler)); },
    onMove(callback) { const handler = (event: TouchEvent) => { const t = event.changedTouches[0]; if (t) callback(t.clientX ?? t.x ?? 0, t.clientY ?? t.y ?? 0); }; api.onTouchMove?.(handler); cleanup.push(() => api.offTouchMove?.(handler)); },
    onKey() { /* Touch is the primary input on mini-game hosts. */ },
    onResize(callback) { api.onWindowResize?.(callback); cleanup.push(() => api.offWindowResize?.(callback)); },
    onHide(callback) { api.onHide(callback); cleanup.push(() => api.offHide?.(callback)); },
    sound(sound) {
      if (!api.createInnerAudioContext || Date.now() - (played[sound] ?? 0) < (sound === 'shoot' ? 100 : 45)) return;
      played[sound] = Date.now();
      try { let audio = sounds.get(sound); if (!audio) { audio = api.createInnerAudioContext(); audio.src = `audio/${sound}.wav`; audio.volume = 1; audio.onError?.(() => {}); sounds.set(sound, audio); } audio.stop(); audio.play(); } catch { /* Audio failures must not stop gameplay. */ }
    },
    silence() { for (const a of sounds.values()) try { a.stop(); } catch { /* Optional audio. */ } },
    destroy() { for (const c of cleanup) c(); for (const a of sounds.values()) try { a.destroy(); } catch { /* Optional audio. */ } },
  };
}
