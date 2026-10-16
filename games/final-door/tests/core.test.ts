import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Battle } from '../assets/scripts/core';

test('pause freezes combat; bullets and actual hits produce a victory', () => {
  const battle = new Battle();
  battle.step(1); assert.equal(battle.distance, 0);
  battle.phase = 'playing';
  for (let i = 0; i < 2100 && battle.phase === 'playing'; i++) battle.step(1 / 60);
  assert.equal(battle.phase, 'won'); assert.equal(battle.boss.hp, 0);
  assert.ok(battle.shots >= 300);
});

test('shooting and crossing a gate adds exactly the earned gate value once', () => {
  const battle = new Battle(); battle.phase = 'playing'; battle.target = -4;
  for (let i = 0; i < 400; i++) battle.step(1 / 60);
  assert.ok(battle.gate.value > 0); assert.equal(battle.troops, 10 + battle.gate.value);
  const count = battle.troops;
  for (let i = 0; i < 40; i++) battle.step(1 / 60);
  assert.equal(battle.troops, count);
});
