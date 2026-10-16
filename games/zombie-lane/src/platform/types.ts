export interface Surface {
  width: number;
  height: number;
  getContext(type: '2d', options?: object): CanvasRenderingContext2D | null;
}
export interface PointerInput { type: 'down' | 'move' | 'up' | 'cancel'; x: number; y: number; id: number; }
export interface Viewport { width: number; height: number; dpr: number; safeTop: number; safeBottom: number; }
export type Sound = 'shot' | 'heavy' | 'upgrade' | 'hurt' | 'blast' | 'win' | 'lose' | 'click';
export interface Platform {
  canvas: Surface;
  viewport(): Viewport;
  createCanvas(width: number, height: number): Surface;
  now(): number;
  requestFrame(callback: (time: number) => void): number;
  cancelFrame(id: number): void;
  onPointer(callback: (event: PointerInput) => void): () => void;
  onKey(callback: (key: string, down: boolean) => void): () => void;
  onVisibility(callback: (visible: boolean) => void): () => void;
  onResize(callback: () => void): () => void;
  read(key: string): unknown;
  write(key: string, value: unknown): void;
  unlockAudio(): void;
  sound(sound: Sound): void;
  setSound(enabled: boolean): void;
  vibrate(): void;
  reducedMotion: boolean;
}
