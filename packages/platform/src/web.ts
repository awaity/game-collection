import type { Platform, PointerInput, Sound, Viewport } from "./types";
import { SOUNDS, synth } from "./synth";
export class WebPlatform implements Platform {
  reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private view: Viewport;
  private audio: AudioContext | null = null;
  private buffers = new Map<Sound, AudioBuffer>();
  private soundEnabled = true;
  private lastSound = new Map<Sound, number>();
  private safe: HTMLDivElement;
  constructor(public canvas: HTMLCanvasElement) {
    this.safe = document.createElement("div");
    this.safe.style.cssText =
      "position:fixed;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)";
    document.body.append(this.safe);
    this.view = this.measure();
  }
  private measure() {
    const bounds = this.canvas.getBoundingClientRect(),
      style = getComputedStyle(this.safe);
    return {
      width: Math.max(1, bounds.width),
      height: Math.max(1, bounds.height),
      dpr: Math.min(devicePixelRatio || 1, 2),
      safeTop: parseFloat(style.paddingTop) || 0,
      safeBottom: parseFloat(style.paddingBottom) || 0,
    };
  }
  viewport() {
    return this.view;
  }
  createCanvas(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  now() {
    return performance.now();
  }
  requestFrame(callback: (time: number) => void) {
    return requestAnimationFrame(callback);
  }
  cancelFrame(id: number) {
    cancelAnimationFrame(id);
  }
  onResize(callback: () => void) {
    const observer = new ResizeObserver(() => {
      this.view = this.measure();
      callback();
    });
    observer.observe(this.canvas);
    return () => observer.disconnect();
  }
  onPointer(callback: (event: PointerInput) => void) {
    const handler = (event: PointerEvent) => {
      if (event.type === "pointerdown" && event.button !== 0) return;
      if (event.type === "pointerdown") {
        this.canvas.focus({ preventScroll: true });
        try {
          this.canvas.setPointerCapture(event.pointerId);
        } catch {
          /* Native capture is optional. */
        }
      }
      const b = this.canvas.getBoundingClientRect();
      const types: Record<string, PointerInput["type"]> = {
        pointerdown: "down",
        pointermove: "move",
        pointerup: "up",
        pointercancel: "cancel",
        lostpointercapture: "cancel",
      };
      callback({
        type: types[event.type],
        x: event.clientX - b.left,
        y: event.clientY - b.top,
        id: event.pointerId,
      });
    };
    const types = [
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
      "lostpointercapture",
    ];
    types.forEach((type) =>
      this.canvas.addEventListener(type, handler as EventListener),
    );
    return () =>
      types.forEach((type) =>
        this.canvas.removeEventListener(type, handler as EventListener),
      );
  }
  onKey(callback: (key: string, down: boolean) => void) {
    const handler = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.tagName === "BUTTON" &&
        (e.code === "Space" || e.code === "Enter")
      )
        return;
      if (
        ["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
          e.code,
        )
      )
        e.preventDefault();
      if (e.repeat) return;
      callback(e.code, e.type === "keydown");
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", handler);
    };
  }
  onVisibility(callback: (visible: boolean) => void) {
    const notify = (visible: boolean) => {
      if (!visible && this.audio) void this.audio.suspend().catch(() => {});
      callback(visible);
    };
    const visibility = () => notify(!document.hidden),
      blur = () => notify(false),
      focus = () => notify(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
    };
  }
  read(key: string): unknown {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "null");
    } catch {
      return null;
    }
  }
  write(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* A private/full storage never prevents a game. */
    }
  }
  unlockAudio() {
    if (!this.soundEnabled) return;
    try {
      if (!this.audio) {
        this.audio = new AudioContext();
        for (const sound of SOUNDS) {
          const samples = synth(sound, this.audio.sampleRate),
            buffer = this.audio.createBuffer(
              1,
              samples.length,
              this.audio.sampleRate,
            );
          buffer.getChannelData(0).set(samples);
          this.buffers.set(sound, buffer);
        }
      }
      if (this.audio.state === "suspended")
        void this.audio.resume().catch(() => {});
    } catch {
      /* Audio is optional. */
    }
  }
  sound(sound: Sound) {
    if (!this.soundEnabled || !this.audio || this.audio.state !== "running")
      return;
    const now = this.audio.currentTime,
      min = sound === "shot" ? 0.065 : sound === "hurt" ? 0.12 : 0;
    if (now - (this.lastSound.get(sound) ?? -10) < min) return;
    this.lastSound.set(sound, now);
    const source = this.audio.createBufferSource();
    source.buffer = this.buffers.get(sound)!;
    source.connect(this.audio.destination);
    source.start();
    source.onended = () => source.disconnect();
  }
  setSound(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled && this.audio) void this.audio.suspend().catch(() => {});
    else if (enabled && this.audio) this.unlockAudio();
  }
  async readAsset(path: string) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Asset ${path}: ${response.status}`);
    return response.arrayBuffer();
  }
  dispose() {
    this.safe.remove();
    void this.audio?.close().catch(() => {});
    this.buffers.clear();
  }
  vibrate() {
    /* Browser haptics are intentionally opt-in at the OS level. */
  }
}
