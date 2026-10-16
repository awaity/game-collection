import { toneWav, type Tone } from '@game-collection/platform/tones';
import type { Sound } from '../core/game';
export const NOTES: Record<Sound, Tone> = {
  plant: { frequency: 340, end: 580, duration: .11, volume: .13, type: 'sine' },
  shoot: { frequency: 480, end: 240, duration: .045, volume: .035, type: 'triangle' },
  sun: { frequency: 860, end: 1400, duration: .17, volume: .1, type: 'sine' },
  hit: { frequency: 190, end: 110, duration: .06, volume: .04, type: 'triangle' },
  boom: { frequency: 130, end: 34, duration: .35, volume: .2, type: 'sawtooth' },
  mower: { frequency: 95, end: 160, duration: .4, volume: .1, type: 'sawtooth' },
  win: { frequency: 660, end: 1320, duration: .6, volume: .14, type: 'sine' },
  lose: { frequency: 250, end: 100, duration: .6, volume: .13, type: 'triangle' },
  click: { frequency: 620, end: 520, duration: .045, volume: .04, type: 'sine' },
};
export const wav = (sound: Sound) => toneWav(NOTES[sound]);
