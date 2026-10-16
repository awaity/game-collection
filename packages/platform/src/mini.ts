import type { Platform, PointerInput, Sound, Surface, Viewport } from "./types";
interface MiniTouch {
  identifier: number;
  clientX?: number;
  clientY?: number;
  x?: number;
  y?: number;
}
interface TouchEvent {
  changedTouches: MiniTouch[];
}
interface MiniSound {
  src: string;
  volume: number;
  play(): void;
  stop(): void;
  seek(time: number): void;
  destroy?(): void;
  onError?(callback: (error: unknown) => void): void;
}
interface SystemInfo {
  windowWidth: number;
  windowHeight: number;
  pixelRatio: number;
  screenHeight?: number;
  safeArea?: { top: number; bottom: number };
}
export interface MiniAPI {
  createCanvas(): Surface;
  getSystemInfoSync(): SystemInfo;
  getWindowInfo?(): SystemInfo;
  getMenuButtonBoundingClientRect?(): { bottom: number };
  getStorageSync(key: string): unknown;
  setStorageSync(key: string, value: unknown): void;
  onTouchStart(cb: (e: TouchEvent) => void): void;
  offTouchStart?(cb: (e: TouchEvent) => void): void;
  onTouchMove(cb: (e: TouchEvent) => void): void;
  offTouchMove?(cb: (e: TouchEvent) => void): void;
  onTouchEnd(cb: (e: TouchEvent) => void): void;
  offTouchEnd?(cb: (e: TouchEvent) => void): void;
  onTouchCancel(cb: (e: TouchEvent) => void): void;
  offTouchCancel?(cb: (e: TouchEvent) => void): void;
  onHide(cb: () => void): void;
  offHide?(cb: () => void): void;
  onShow(cb: () => void): void;
  offShow?(cb: () => void): void;
  onWindowResize?(cb: () => void): void;
  offWindowResize?(cb: () => void): void;
  getFileSystemManager?(): {
    readFile(options: {
      filePath: string;
      success: (result: { data: ArrayBuffer }) => void;
      fail: (error: unknown) => void;
    }): void;
  };
  createInnerAudioContext(): MiniSound;
  vibrateShort?(options: { type: string }): void;
}
/** One adapter for both native Mini Game APIs; no DOM shim or WebView. */
export class MiniPlatform implements Platform {
  canvas: Surface;
  reducedMotion = false;
  private view: Viewport;
  private enabled = true;
  private sounds = new Map<Sound, MiniSound[]>();
  private indexes = new Map<Sound, number>();
  private lastSound = new Map<Sound, number>();
  constructor(private api: MiniAPI) {
    this.canvas = api.createCanvas();
    this.view = this.measure();
  }
  private measure(): Viewport {
    const info = this.api.getWindowInfo?.() ?? this.api.getSystemInfoSync();
    let top = info.safeArea?.top ?? 0;
    try {
      top = Math.max(
        top,
        this.api.getMenuButtonBoundingClientRect?.().bottom ?? 0,
      );
    } catch {
      /* Not present on every platform version. */
    }
    return {
      width: info.windowWidth,
      height: info.windowHeight,
      dpr: Math.min(info.pixelRatio || 1, 2),
      safeTop: top,
      safeBottom: Math.max(
        0,
        (info.screenHeight ?? info.windowHeight) -
          (info.safeArea?.bottom ?? info.windowHeight),
      ),
    };
  }
  viewport() {
    return this.view;
  }
  createCanvas(width: number, height: number) {
    const canvas = this.api.createCanvas();
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  now() {
    return typeof performance !== "undefined" ? performance.now() : Date.now();
  }
  requestFrame(callback: (time: number) => void) {
    return requestAnimationFrame(() => callback(this.now()));
  }
  cancelFrame(id: number) {
    cancelAnimationFrame(id);
  }
  onPointer(callback: (event: PointerInput) => void) {
    const handler = (type: PointerInput["type"]) => (e: TouchEvent) => {
      for (const touch of e.changedTouches)
        callback({
          type,
          x: touch.clientX ?? touch.x ?? 0,
          y: touch.clientY ?? touch.y ?? 0,
          id: touch.identifier,
        });
    };
    const start = handler("down"),
      move = handler("move"),
      end = handler("up"),
      cancel = handler("cancel");
    this.api.onTouchStart(start);
    this.api.onTouchMove(move);
    this.api.onTouchEnd(end);
    this.api.onTouchCancel(cancel);
    return () => {
      this.api.offTouchStart?.(start);
      this.api.offTouchMove?.(move);
      this.api.offTouchEnd?.(end);
      this.api.offTouchCancel?.(cancel);
    };
  }
  onKey() {
    return () => {};
  }
  onVisibility(callback: (visible: boolean) => void) {
    const hide = () => {
        this.sounds.forEach((pool) => pool.forEach((audio) => audio.stop()));
        callback(false);
      },
      show = () => callback(true);
    this.api.onHide(hide);
    this.api.onShow(show);
    return () => {
      this.api.offHide?.(hide);
      this.api.offShow?.(show);
    };
  }
  onResize(callback: () => void) {
    const resize = () => {
      this.view = this.measure();
      callback();
    };
    this.api.onWindowResize?.(resize);
    return () => this.api.offWindowResize?.(resize);
  }
  read(key: string): unknown {
    try {
      const v = this.api.getStorageSync(key);
      return typeof v === "string" ? JSON.parse(v) : v;
    } catch {
      return null;
    }
  }
  write(key: string, value: unknown) {
    try {
      this.api.setStorageSync(key, JSON.stringify(value));
    } catch {
      /* Storage is not required to play. */
    }
  }
  readAsset(path: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const fs = this.api.getFileSystemManager?.();
      if (!fs) {
        reject(new Error("Local asset loading is unavailable"));
        return;
      }
      fs.readFile({
        filePath: path.replace(/^\.\//, ""),
        success: (result) => resolve(result.data),
        fail: reject,
      });
    });
  }
  dispose() {
    this.sounds.forEach((pool) =>
      pool.forEach((audio) => {
        audio.stop();
        audio.destroy?.();
      }),
    );
    this.sounds.clear();
  }
  unlockAudio() {}
  setSound(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled)
      this.sounds.forEach((pool) => pool.forEach((audio) => audio.stop()));
  }
  sound(sound: Sound) {
    if (!this.enabled) return;
    const now = this.now();
    if (
      now - (this.lastSound.get(sound) ?? -1000) <
      (sound === "shot" ? 75 : 120)
    )
      return;
    this.lastSound.set(sound, now);
    try {
      if (!this.sounds.has(sound)) {
        const pool = Array.from({ length: sound === "shot" ? 2 : 1 }, () => {
          const audio = this.api.createInnerAudioContext();
          audio.src = `audio/${sound}.wav`;
          audio.volume = 0.8;
          audio.onError?.(() => {});
          return audio;
        });
        this.sounds.set(sound, pool);
      }
      const pool = this.sounds.get(sound)!,
        index = this.indexes.get(sound) ?? 0,
        audio = pool[index % pool.length];
      audio.stop();
      audio.play();
      this.indexes.set(sound, index + 1);
    } catch {
      /* Unsupported sound does not interrupt simulation. */
    }
  }
  vibrate() {
    try {
      this.api.vibrateShort?.({ type: "light" });
    } catch {
      /* Haptics are optional. */
    }
  }
}
