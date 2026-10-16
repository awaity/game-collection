export interface Tone { frequency: number; end: number; duration: number; volume: number; type: OscillatorType }
export function toneWav(note: Tone): Uint8Array {
  const rate = 22050, samples = Math.ceil(note.duration * rate), buffer = new ArrayBuffer(44 + samples * 2), view = new DataView(buffer);
  const str = (offset: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); view.setUint32(4, 36 + samples * 2, true); str(8, 'WAVE'); str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, samples * 2, true);
  let phase = 0;
  for (let i = 0; i < samples; i++) {
    const t = i / samples, frequency = note.frequency + (note.end - note.frequency) * t;
    phase += frequency / rate;
    const s = note.type === 'sawtooth' ? 2 * (phase % 1) - 1 : note.type === 'triangle' ? 1 - 4 * Math.abs(Math.round(phase) - phase) : Math.sin(phase * Math.PI * 2);
    const envelope = Math.min(1, t * 30) * (1 - t) ** 2;
    view.setInt16(44 + i * 2, Math.round(s * envelope * note.volume * 32767), true);
  }
  return new Uint8Array(buffer);
}
