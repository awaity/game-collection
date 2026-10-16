import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adventureConfig, challengeConfig, levelConfig, LEVELS, PLANT_ORDER, type PerkId } from '../src/core/content';
import { Game } from '../src/core/game';
import { newSave, parseSave, recordResult, unlockedLevel } from '../src/core/save';
import { play } from './strategy';

test('planting enforces funds, cooldown, occupancy, grid and mode restrictions', () => {
  const g = new Game(levelConfig(1));
  assert.equal(g.plant('pea', 0, 0), true); assert.equal(g.sun, 250);
  assert.equal(g.plant('pea', 1, 0), false); assert.equal(g.plant('sunflower', 0, 0), false);
  assert.equal(g.plant('sunflower', -1, 0), false); assert.equal(g.plant('sunflower', 0, 9), false);
  assert.equal(g.plant('sunflower', .5, 0), false); assert.equal(g.plant('repeater', 0, 1), false);
  g.update(5.1); assert.equal(g.plant('pea', 1, 0), true);
  assert.equal(g.shovel(1, 0), true); assert.equal(g.sun, 150); assert.equal(g.shovel(1, 0), false);
  g.sun = 0; assert.equal(g.plant('wallnut', 2, 2), false);
});

test('sun must be collected, expires, and production follows night and drought rules', () => {
  const g = new Game(levelConfig(1));
  g.plant('sunflower', 2, 0); g.update(6);
  assert.equal(g.sun, 300); assert.equal(g.suns.length, 2);
  const id = g.suns[0].id; assert(g.collectSun(id)); assert.equal(g.sun, 325); assert(!g.collectSun(id));
  g.collectAll(); assert.equal(g.sun, 350);
  const night = new Game(levelConfig(5)); night.update(8); assert.equal(night.suns.length, 0);
  night.plant('sunflower', 0, 0); night.update(6); assert.equal(night.suns.length, 1);
  const drought = new Game(challengeConfig('drought')); assert.equal(drought.sun, 1200); assert(!drought.plant('sunflower', 0, 0)); drought.update(20); assert.equal(drought.suns.length, 0);
  const expiry = new Game({ ...levelConfig(1), skySun: false }); expiry.suns.push({ id: 999, x: 2, y: 2, target: 2, value: 25, age: 15.9 }); expiry.update(.2); assert.equal(expiry.suns.length, 0);
});

const zombie = (row = 0, x = 6, hp = 165, kind: 'walker' | 'paper' = 'walker') => ({ id: 1000 + row, kind, row, x, hp, maxHp: hp, slow: 0, flash: 0, age: 0, eating: false });
test('projectiles hit the nearest enemy in their lane; ice applies a temporary slow', () => {
  const g = new Game({ ...levelConfig(8), startSun: 2000 });
  g.plant('ice', 0, 0); g.zombies = [zombie(0, 4), { ...zombie(0, 6), id: 2000 }, zombie(1, 4)];
  g.update(1); assert(g.zombies[0].hp < 165); assert(g.zombies[0].slow > 0); assert.equal(g.zombies[1].hp, 165); assert.equal(g.zombies[2].hp, 165);
  g.shovel(0, 0); g.projectiles = []; g.update(4.1); assert.equal(g.zombies[0].slow, 0);
});

test('cherry damages three lanes in range; potato mine must arm before triggering', () => {
  const g = new Game({ ...levelConfig(8), startSun: 2000 });
  g.plant('cherry', 2, 4); g.zombies = [zombie(1, 4.5, 1200), zombie(2, 5, 1200), zombie(3, 4.5, 1200), zombie(4, 4.5, 1200), zombie(0, 8, 1200)];
  g.update(1); assert.equal(g.kills, 3); assert.equal(g.plants.length, 0); assert.equal(g.zombies.length, 2);
  const mine = new Game(levelConfig(2)); mine.plant('mine', 0, 5); mine.update(8); assert(mine.plants.length); mine.update(1.1); mine.zombies = [zombie(0, 5.9, 1000)]; mine.update(.1); assert.equal(mine.kills, 1);
  const fresh = new Game(levelConfig(2)); fresh.plant('mine', 0, 5); fresh.zombies = [zombie(0, 5.9)]; fresh.update(.1); assert.equal(fresh.kills, 0);
});

test('mowers sweep their lane once, and a later breach loses the match', () => {
  const g = new Game(levelConfig(1)); g.zombies = [zombie(0, .01), { ...zombie(0, 5), id: 1001 }];
  g.update(2); assert.equal(g.mowers[0].state, 'used'); assert.equal(g.kills, 2); assert.equal(g.state, 'playing');
  g.zombies.push(zombie(0, -.96)); g.update(.01); assert.equal(g.state, 'lost');
  const before = g.elapsed; g.update(5); assert.equal(g.elapsed, before); assert(!g.plant('wallnut', 0, 0));
});

test('game waits for every wave; paper zombies rage; simulation is deterministic', () => {
  const g = new Game(levelConfig(1)); g.update(10); assert.equal(g.state, 'playing'); assert.equal(g.wave, 0);
  g.update(4); assert.equal(g.wave, 1); assert(g.zombies.length > 0);
  const a = new Game(levelConfig(7)), b = new Game(levelConfig(7)); a.update(40); b.update(20); b.update(20);
  assert.deepEqual(a.zombies.map(z => [z.id, z.kind, z.row, z.hp]), b.zombies.map(z => [z.id, z.kind, z.row, z.hp]));
  a.zombies.forEach((z, i) => assert(Math.abs(z.x - b.zombies[i].x) < 1e-9));
  const paper = new Game(levelConfig(7)); paper.zombies = [zombie(0, 5, 300, 'paper'), { ...zombie(1, 5, 300, 'paper'), hp: 140 }]; paper.update(1); assert(paper.zombies[1].x < paper.zombies[0].x);
});

test('save parsing rejects damage, unlocks only contiguous wins and preserves best scores', () => {
  assert.deepEqual(parseSave('broken'), newSave());
  const s = parseSave({ version: 1, levels: { 1: 999, 2: -2, 3: 2 }, settings: { sound: false, autoSun: 'true' }, adventure: { round: 4, perks: [], seed: 1, awaitingPerk: false } });
  assert.equal(s.levels['1'], 3); assert.equal(unlockedLevel(s), 2); assert.equal(s.settings.sound, false); assert.equal(s.settings.autoSun, false); assert.equal(s.adventure, null);
  const game = new Game(levelConfig(2)); game.state = 'won'; recordResult(s, game); assert.equal(unlockedLevel(s), 4); assert.equal(s.levels['2'], 3);
  game.mowers[0].state = 'used'; recordResult(s, game); assert.equal(s.levels['2'], 3);
  s.adventure = { round: 1, perks: [], seed: 1, awaitingPerk: true }; assert.deepEqual(parseSave(JSON.stringify(s)), s);
});

test('all twelve levels are winnable through legal placement and resource collection', t => {
  for (const l of LEVELS) {
    const g = play(new Game(levelConfig(l.id)));
    t.diagnostic(`Level ${l.id}: ${g.state}, ${g.stars} stars, ${g.kills} kills, ${Math.round(g.elapsed)} seconds`);
    assert.equal(g.state, 'won', `Level ${l.id} is not winnable by the reference strategy`); assert(g.planted > 5);
  }
});

test('all five adventure rounds with earned upgrades can be completed', t => {
  const perks: PerkId[] = [], s = newSave(); s.adventure = { round: 1, perks: [], seed: 137, awaitingPerk: false };
  for (let round = 1; round <= 5; round++) {
    const g = play(new Game(adventureConfig(round, perks, 137)));
    t.diagnostic(`Adventure ${round}: ${g.state}, ${g.stars} stars`); assert.equal(g.state, 'won');
    recordResult(s, g);
    if (round < 5) { assert(s.adventure?.awaitingPerk); const perk: PerkId = round === 1 ? 'damage' : round === 2 ? 'sun' : round === 3 ? 'health' : 'bank'; perks.push(perk); s.adventure!.round++; s.adventure!.perks.push(perk); s.adventure!.awaitingPerk = false; }
  }
  assert.equal(s.adventure, null); assert.equal(s.adventuresWon, 1);
});

test('finite challenges are winnable and endless progresses beyond finite wave counts', t => {
  for (const id of ['drought', 'rush', 'fortress']) {
    const g = play(new Game(challengeConfig(id))); t.diagnostic(`${id}: ${g.state}, ${g.kills} kills`); assert.equal(g.state, 'won', id);
  }
  const endless = play(new Game(challengeConfig('endless')), 400);
  assert(endless.wave > 4); assert.notEqual(endless.state, 'won');
  assert(endless.zombies.length <= 80); assert(endless.projectiles.length <= 160); assert(endless.suns.length <= 36);
  assert.equal(new Set(PLANT_ORDER).size, 8);
});
