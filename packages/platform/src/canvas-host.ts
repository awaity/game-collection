export interface CanvasHit { id: string; label: string; x: number; y: number; w: number; h: number; disabled?: boolean }
export interface Size { width: number; height: number; dpr: number; safeTop: number; safeBottom: number }
export interface CanvasHost<Sound extends string = string> {
  canvas: HTMLCanvasElement;
  size(): Size;
  read(key: string): unknown;
  write(key: string, value: string): boolean;
  frame(callback: (time: number) => void): number;
  cancelFrame(id: number): void;
  onPointer(callback: (x: number, y: number) => void): void;
  onMove(callback: (x: number, y: number) => void): void;
  onKey(callback: (key: string) => void): void;
  onResize(callback: () => void): void;
  onHide(callback: () => void): void;
  sound(sound: Sound): void;
  silence(): void;
  reducedMotion?(): boolean;
  syncControls?(hits: CanvasHit[], action: (id: string) => void): void;
  announce?(message: string): void;
  destroy(): void;
}
