import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miniHost, type MiniAPI } from '../src/platform/mini';
import { NOTES, wav } from '../src/platform/audio';
import type { Sound } from '../src/core/game';
import { mockCanvas } from './harness';

test('native adapter maps physical touch coordinates, safe areas, storage and lifecycle', () => {
  const drawing = mockCanvas(); let touch: Parameters<MiniAPI['onTouchStart']>[0] | null = null, hide = () => {}, resize = () => {}, off = 0, stopped = 0, destroyed = 0;
  const store = new Map<string, unknown>(), sources: string[] = [];
  const api: MiniAPI = {
    createCanvas: () => drawing.canvas, getSystemInfoSync: () => ({ windowWidth: 390, windowHeight: 844, pixelRatio: 3, safeArea: { top: 24, bottom: 810 } }),
    getMenuButtonBoundingClientRect: () => ({ top: 28, bottom: 60, left: 280, right: 370 }),
    getStorageSync: key => store.get(key), setStorageSync: (key, value) => { store.set(key, value); },
    onTouchStart: cb => { touch = cb; }, offTouchStart: () => { off++; }, onHide: cb => { hide = cb; }, offHide: () => { off++; },
    onWindowResize: cb => { resize = cb; }, offWindowResize: () => { off++; },
    createInnerAudioContext: () => ({ get src() { return ''; }, set src(v: string) { sources.push(v); }, volume: 1, play() {}, stop() { stopped++; }, destroy() { destroyed++; } }),
  };
  let frameTime=0;Object.assign(drawing.canvas,{requestAnimationFrame:(cb:(t:number)=>void)=>{cb(frameTime);return 1;}});
  const host = miniHost(api);host.frame(()=>{}); assert.deepEqual(host.size(), { width: 390, height: 844, dpr: 2, safeTop: 60, safeBottom: 34 });
  let point: number[] = [], paused = false, resized = false;
  host.onPointer((x, y) => { point = [x, y]; }); assert(touch); (touch as Parameters<MiniAPI['onTouchStart']>[0])({ changedTouches: [{ clientX: 120, clientY: 280 }] }); assert.deepEqual(point, [],'entrance consumes the first touch');
  frameTime=900;host.frame(()=>{});(touch as Parameters<MiniAPI['onTouchStart']>[0])({ changedTouches: [{ clientX: 120, clientY: 280 }] });assert.deepEqual(point,[120,280]);
  (touch as Parameters<MiniAPI['onTouchStart']>[0])({ changedTouches: [{ x: 40, y: 90 }] }); assert.deepEqual(point, [40, 90]);
  host.onHide(() => { paused = true; }); hide(); assert(paused); host.onResize(() => { resized = true; }); resize(); assert(resized);
  assert(host.write('save', 'value')); assert.equal(host.read('save'), 'value'); host.sound('sun'); assert.deepEqual(sources, ['audio/sun.wav']); host.silence(); assert(stopped > 0); host.destroy(); assert.equal(destroyed, 1); assert.equal(off, 3);
  api.setStorageSync = () => { throw new Error('storage full'); }; assert.equal(host.write('save', 'next'), false);
});

test('every sound is a valid mono PCM wav, with no network dependency', () => {
  for (const name of Object.keys(NOTES) as Sound[]) { const data = wav(name); const view = new DataView(data.buffer); assert.equal(Buffer.from(data.slice(0, 4)).toString(), 'RIFF'); assert.equal(Buffer.from(data.slice(8, 12)).toString(), 'WAVE'); assert.equal(view.getUint16(22, true), 1); assert.equal(view.getUint32(24, true), 22050); assert.equal(view.getUint32(40, true), data.length - 44); assert(data.length > 1000); }
});
