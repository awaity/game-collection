import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GardenApp } from '../src/app';
import { newSave, parseSave, SAVE_KEY } from '../src/core/save';
import { mockHost } from './harness';
import { boardLayout } from '../src/render/ui';
import { defend } from './strategy';

test('touch placement, keyboard, pause, background and settings use one state machine', () => {
  const h = mockHost(), app = new GardenApp(h.host);
  const tap = (id: string) => { const hit = app.hits.find(h => h.id === id); assert(hit, id); h.tap(hit.x + hit.w / 2, hit.y + hit.h / 2); };
  tap('continue-level'); tap('start'); assert.equal(app.view.screen, 'playing');
  tap('seed:pea'); tap('cell:2:2'); assert.equal(app.view.game!.plants[0].kind, 'pea'); assert.equal(app.view.game!.sun, 250);
  h.key('1'); h.key('ArrowUp'); h.key('Enter'); assert.equal(app.view.game!.plants.length, 2);
  h.key(' '); assert.equal(app.view.modal, 'pause'); const elapsed = app.view.game!.elapsed; app.advance(10); assert.equal(app.view.game!.elapsed, elapsed);
  tap('settings'); tap('setting:autoSun'); tap('close'); assert.equal(app.view.modal, 'pause'); tap('close'); app.advance(10); assert(app.view.game!.sun > 200);
  h.hide(); assert.equal(app.view.modal, 'pause'); app.advance(20); assert(app.view.game!.elapsed < 11);
  tap('leave'); tap('close'); assert.equal(app.view.modal, 'pause'); tap('leave'); tap('leave:confirm'); assert.equal(app.view.screen, 'home');
  assert(parseSave(h.storage.get(SAVE_KEY)).settings.autoSun); app.destroy();
});

test('winning through gameplay records stars once, unlocks next level and survives reload', () => {
  const h = mockHost(), app = new GardenApp(h.host); app.action('continue-level'); app.action('start');
  for (let i = 0; i < 2000 && app.view.screen === 'playing'; i++) { defend(app.view.game!); app.advance(.25); }
  assert.equal(app.view.screen, 'result'); assert.equal(app.view.game!.state, 'won');
  const kills = app.view.save.totalKills; app.advance(20); assert.equal(app.view.save.totalKills, kills);
  app.action('next'); assert.equal(app.view.brief?.id, '2');
  const raw = h.storage.get(SAVE_KEY); app.destroy();
  const loaded = new GardenApp(mockHost(390, 844, raw).host); loaded.action('levels'); assert.equal(loaded.hits.find(h => h.id === 'level:2')?.disabled, false); assert.equal(loaded.hits.find(h => h.id === 'level:3')?.disabled, true); loaded.destroy();
});

test('adventure upgrades save as a checkpoint and cannot be selected twice', () => {
  const save = newSave(); save.adventure = { round: 2, perks: ['damage'], seed: 314, awaitingPerk: true };
  const h = mockHost(390, 844, JSON.stringify(save)), app = new GardenApp(h.host);
  app.action('adventure:continue'); assert.equal(app.view.screen, 'perks');
  app.action('perk:sun'); assert.equal(app.view.save.adventure!.round, 3); assert.equal(app.view.modal, 'brief'); assert.equal(app.view.brief?.biome, 'night');
  app.action('perk:sun'); assert.equal(app.view.save.adventure!.round, 3);
  const raw = h.storage.get(SAVE_KEY); app.destroy(); const loaded = new GardenApp(mockHost(390, 844, raw).host); loaded.action('adventure:continue'); assert.equal(loaded.view.brief!.startSun, 400); assert.deepEqual(loaded.view.brief!.perks, ['damage', 'sun']); loaded.destroy();
});

test('every screen and modal keeps its controls inside supported mobile and desktop viewports', () => {
  for (const [w, h, safeTop = 0, safeBottom = 0] of [[320, 568], [360, 640], [360, 640, 60, 34], [390, 844], [430, 932], [768, 1024], [844, 390], [1280, 720], [1440, 900]]) {
    const host = mockHost(w, h), app = new GardenApp(host.host);
    if (safeTop || safeBottom) { host.host.size = () => ({ width: w, height: h, dpr: 2, safeTop, safeBottom }); host.resize(w, h); }
    const check = (screen: string) => { for (const hit of app.hits) assert(hit.x >= -1 && hit.y >= -1 && hit.x + hit.w <= app.view.w + 1 && hit.y + hit.h <= app.view.h + 1, `${w}x${h} ${screen}: ${hit.id} out of bounds (${hit.x},${hit.y},${hit.w},${hit.h}) in ${app.view.w}x${app.view.h}`); };
    for (const screen of ['home', 'levels', 'adventure', 'challenges', 'almanac']) {
      app.action(screen); check(screen);
      if(screen==='challenges'){app.action('challenge-page:next');check('expanded challenges');}
      if(screen==='almanac'){app.action('almanac-page:next');check('expanded plants');app.action('almanac:zombies');app.action('almanac-page:next');check('expanded zombies');}
      if (screen === 'home') for (const a of app.hits) for (const b of app.hits) if (a !== b) assert(!(a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y), `${w}x${h} safe area: ${a.id} overlaps ${b.id}`);
    }
    app.action('adventure:continue'); check('adventure brief'); app.action('close');
    app.view.save.adventure = { round: 1, perks: [], seed: 123, awaitingPerk: true }; app.action('adventure:continue'); check('perks');
    app.action('home'); app.action('continue-level'); check('brief'); app.action('start'); check('battle');
    app.action('seeds:next');check('expanded seed bag');app.action('seeds:prev');
    const b = boardLayout(app.view); assert(b.w > 0 && b.h > 0);
    for (const modal of ['pause', 'settings', 'help'] as const) { app.view.modal = modal; app.render(); check(modal); }
    app.view.game!.state = 'lost'; app.view.screen = 'result'; app.view.modal = null; app.render(); check('result');
    assert(host.drawing.operations > 1000); app.destroy();
  }
});
