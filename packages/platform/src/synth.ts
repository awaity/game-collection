import type { Sound } from "./types";
export const SOUNDS: Sound[] = [
  "shot",
  "heavy",
  "upgrade",
  "hurt",
  "blast",
  "win",
  "lose",
  "click",
];
export function synth(sound: Sound, sampleRate = 22050): Float32Array {
  const duration = {
    shot: 0.075,
    heavy: 0.2,
    upgrade: 0.55,
    hurt: 0.18,
    blast: 0.7,
    win: 1.0,
    lose: 0.7,
    click: 0.045,
  }[sound];
  const data = new Float32Array(Math.ceil(duration * sampleRate));
  let seed = 42;
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate,
      p = t / duration;
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    let value = 0;
    if (sound === "shot")
      value = (noise * 0.6 + Math.sin(t * 820) * 0.4) * Math.exp(-p * 9) * 0.24;
    if (sound === "heavy" || sound === "blast")
      value =
        (noise * 0.65 + Math.sin(t * (sound === "heavy" ? 370 : 190)) * 0.35) *
        Math.exp(-p * 5) *
        0.44;
    if (sound === "hurt")
      value =
        (noise * 0.3 + Math.sin(t * 460 * (1 - p * 0.4)) * 0.5) *
        Math.exp(-p * 4) *
        0.3;
    if (sound === "click") value = Math.sin(t * 2100) * Math.exp(-p * 8) * 0.15;
    if (sound === "upgrade" || sound === "win") {
      const notes =
        sound === "upgrade"
          ? [523, 659, 784, 1046]
          : [523, 659, 784, 1046, 1318];
      const span = duration / notes.length,
        index = Math.min(notes.length - 1, Math.floor(t / span));
      value =
        Math.sin(t * Math.PI * 2 * notes[index]) *
        Math.exp(-((t % span) / span) * 3) *
        0.19;
    }
    if (sound === "lose")
      value =
        Math.sin(t * Math.PI * 2 * (250 - 100 * p)) * Math.exp(-p * 3) * 0.2;
    data[i] = value * Math.min(1, t / 0.003);
  }
  return data;
}
