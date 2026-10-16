import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createContext, runInContext } from 'node:vm';
import { mockCanvas } from './harness';
import type { MiniAPI } from '../src/platform/mini';
import { boardLayout } from '../src/render/ui';
import { SAVE_KEY } from '../src/core/save';

for (const platform of ['weixin', 'douyin']) test(`${platform}: actual built package boots without a DOM and supports native touch, settings, battle and background`, async () => {
  const code = await readFile(`dist/${platform}/game.js`, 'utf8'), config = JSON.parse(await readFile(`dist/${platform}/game.json`, 'utf8')), project = JSON.parse(await readFile(`dist/${platform}/project.config.json`, 'utf8'));
  assert.equal(config.deviceOrientation, 'portrait'); assert.equal(project.compileType, 'game'); assert.equal(project.miniprogramRoot, './');
  assert(code.length < 200_000);
  const drawing = mockCanvas(), storage = new Map<string, string>(), audioPaths: string[] = [];
  const callbacks = new Map<number, (t: number) => void>(); let raf = 0, time = 1, created = 0;
  let touch: Parameters<MiniAPI['onTouchStart']>[0] = () => {}, hide = () => {};
  const api: MiniAPI = {
    createCanvas: () => { created++; return drawing.canvas; },
    getSystemInfoSync: () => ({ windowWidth: 390, windowHeight: 844, pixelRatio: 3, safeArea: { top: 24, bottom: 810 } }),
    getMenuButtonBoundingClientRect: () => ({ top: 24, bottom: 56, left: 280, right: 370 }),
    getStorageSync: k => storage.get(k), setStorageSync: (k, v) => { storage.set(k, v); },
    onTouchStart: cb => { touch = cb; }, onHide: cb => { hide = cb; },
    createInnerAudioContext: () => ({ get src() { return ''; }, set src(v: string) { audioPaths.push(v); }, volume: 1, play() {}, stop() {}, destroy() {} }),
  };
  const context = createContext({ [platform === 'weixin' ? 'wx' : 'tt']: api, requestAnimationFrame: (cb: (t: number) => void) => { callbacks.set(++raf, cb); return raf; }, cancelAnimationFrame: (id: number) => callbacks.delete(id), setTimeout, clearTimeout, console });
  assert.equal(runInContext('typeof document', context), 'undefined'); assert.equal(runInContext('typeof window', context), 'undefined');
  runInContext(code, context, { timeout: 10000 });
  const frame = (count = 1) => { for (let i = 0; i < count; i++) { const entries = [...callbacks.values()]; callbacks.clear(); time += 1000 / 30; for (const cb of entries) cb(time); } };
  const tap = (x: number, y: number) => { touch({ changedTouches: [{ clientX: x, clientY: y }] }); frame(); };
  const tapText = (text: string) => { const found = drawing.texts.find(t => t.text === text); assert(found, `Missing native button ${text}`); tap(found.x, found.y); };
  frame(); assert.equal(created, 1); assert.equal(drawing.canvas.width, 780); assert.equal(drawing.canvas.height, 1688);
  tap(344, 86); tapText('自动收集阳光'); tapText('保存并返回'); assert.equal(JSON.parse(storage.get(SAVE_KEY)!).settings.autoSun, true);
  tapText('开始守卫'); tapText('开始种植'); assert(drawing.texts.some(t => t.text === '准备种植'));
  const board = boardLayout({ w: 390, h: 844, safeTop: 56, safeBottom: 34 });
  tap(board.x + board.cw * .5, board.y + board.rh * 2.5);
  assert(drawing.texts.some(t => t.text === '300'));
  frame(330); const sunNumbers = drawing.texts.filter(t => t.x === 62 && t.y === 87).map(t => Number(t.text)); assert(sunNumbers.some(n => n >= 350), `Native collection did not work: ${JSON.stringify(drawing.texts.slice(0, 5))}`);
  hide(); frame(); assert(drawing.texts.some(t => t.text === '花园休息一下')); frame(60); assert(drawing.texts.some(t => t.text === '继续守卫'));
  tapText('继续守卫'); assert(!drawing.texts.some(t => t.text === '花园休息一下'));
  assert(audioPaths.includes('audio/plant.wav')); assert(audioPaths.includes('audio/sun.wav'));
  for (const path of new Set(audioPaths)) assert((await stat(`dist/${platform}/${path}`)).size > 44);
  assert(drawing.operations > 100000);
});
