import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { Assault, CAPACITY, Crowd, Projectiles, BULLET_CAPACITY, exportReplay, importReplay } from '../assets/scripts/core';
const golden = JSON.parse(readFileSync(new URL('./reference-golden.json', import.meta.url), 'utf8')) as {route: number; steps: {tick: number; hash: string; outcome: string; troops: number; boss: number; level: number}[]}[];

for (const fixture of golden) test(`route ${fixture.route}: every reference checkpoint preserves the entire simulation`, () => {
 const game = new Assault(42, fixture.route);
 for (const checkpoint of fixture.steps) {
  while (game.tick < checkpoint.tick) game.step();
  assert.equal(game.hash(), checkpoint.hash, `tick ${checkpoint.tick}`);
  assert.equal(game.crowd.count, checkpoint.troops);
  assert.equal(game.boss.hp, checkpoint.boss);
  assert.equal(game.outcome, checkpoint.outcome);
 }
 // The hardest route genuinely survives with boss HP remaining at the demo deadline.
 // Never substitute a victory animation for a simulated kill.
 if (fixture.route === 2) assert.equal(game.outcome, '进行中');
});

test('takeover records the actual input; replay reproduces exact positions, bullets, damage and result', () => {
 const live = new Assault(1132, 1);
 for (let i = 0; i < 420; i++) live.step();
 live.takeControl();
 for (let i = 0; i < 900; i++) {
  if (i % 60 === 0) live.input('target', Math.sin(i / 150) * 3.3);
  live.step();
 }
 const input = importReplay(JSON.stringify(exportReplay(live)));
 const replay = new Assault(input.seed, input.route, input.inputs);
 while(replay.tick < live.tick) replay.step();
 assert.equal(replay.hash(), live.hash());
 assert.ok(live.shots > 0); assert.ok(live.hits > 0);
});

test('crowd and bullet capacities reject overflow explicitly; no member or shot disappears silently', () => {
 const crowd = new Crowd(); crowd.add(CAPACITY);
 assert.throws(() => crowd.add(1), /容量/);
 assert.equal(new Set(crowd.ids).size, CAPACITY);
 const p = new Projectiles();
 for (let i = 0; i < BULLET_CAPACITY; i++) p.add(i + 1, 0, 0, 1, 0);
 assert.throws(() => p.add(1, 0, 0, 1, 0), /容量/);
 p.remove(11); assert.equal(p.count, BULLET_CAPACITY - 1);
});

test('multiplication gates apply once and refuse an explicit overcapacity result', () => {
 const game = new Assault(); const gate = game.gates.find(g => g.op === '乘')!;
 game.crowd.add(70); assert.equal(game.crowd.count, 80);
 game.applyGate(gate); assert.equal(game.crowd.count, 80); assert.equal(game.rejects, 1);
 game.applyGate(gate); assert.equal(game.rejects, 1);
});

test('replay validation rejects wrong versions, oversized arrays, unordered ticks and invalid moves', () => {
 const good = exportReplay(new Assault());
 for (const bad of [null, {}, {...good, 版本: 'bad'}, {...good, 种子: -1}, {...good, 路线: 3}, {...good, 输入: [{步:0,动作:'定位',数值:100}]}, {...good, 输入: [{步:60,动作:'方向',数值:0},{步:10,动作:'方向',数值:1}]}]) {
  assert.throws(() => importReplay(JSON.stringify(bad)));
 }
});
