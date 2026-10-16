import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, DIFFICULTIES, WIDTH, HEIGHT } from "../src/core/game.ts";
import { FixedClock } from "@game-collection/platform/loop";

test("difficulty, five weapon patterns and supply caps preserve upstream rules", () => {
  for (const difficulty of ["easy", "normal", "hard"] as const) {
    const g = new Game("stage", difficulty);
    assert.equal(g.player.lives, DIFFICULTIES[difficulty].lives);
    assert.equal(g.spawnInterval, DIFFICULTIES[difficulty].spawn);
    const e = g.spawnEnemy(100, "elite");
    assert.equal(e.hp, 3 * DIFFICULTIES[difficulty].health);
    assert.equal(e.score, Math.ceil(50 * DIFFICULTIES[difficulty].score));
  }
  const g = new Game();
  for (let level = 1; level <= 5; level++) {
    g.bullets = [];
    g.player.weapon = level;
    g.shoot();
    assert.equal(g.bullets.length, level);
    assert.ok(g.bullets.every((b) => b.damage === (level === 5 ? 2 : 1)));
  }
  for (let i = 0; i < 10; i++) {
    g.collect("weapon");
    g.collect("health");
  }
  assert.equal(g.player.weapon, 5);
  assert.equal(g.player.lives, 5);
  g.collect("shield");
  g.hurt();
  assert.equal(g.player.lives, 5);
  assert.equal(g.player.shield, false);
  g.hurt();
  assert.equal(g.player.lives, 4);
});
test("a projectile hits one live target and an enemy scores once", () => {
  const g = new Game();
  g.start();
  const a = g.spawnEnemy(210, "normal"),
    b = g.spawnEnemy(210, "normal");
  a.y = b.y = 200;
  a.speed = b.speed = 0;
  g.bullets = [g.bullet(210, 208, 0, -8)];
  g.player.cooldown = 99;
  g.step();
  assert.equal(g.kills, 1);
  assert.equal(g.score, 10);
  assert.equal(g.enemies.length, 1);
  // Two simultaneous bullets cannot credit the same last enemy twice.
  g.bullets = [g.bullet(210, 208, 0, -8), g.bullet(210, 208, 0, -8)];
  g.step();
  assert.equal(g.kills, 2);
  assert.equal(g.score, 20);
});
test("stage boss, radial/aimed fire, clear and next-stage progression", () => {
  const g = new Game();
  g.start();
  g.stageKills = 20;
  g.step();
  assert.ok(g.boss);
  assert.equal(g.boss.hp, 70);
  assert.equal(g.enemies.length, 0);
  g.boss.y = 100;
  g.boss.cooldown = 0;
  g.step();
  assert.equal(g.enemyBullets.length, 11);
  g.boss.hp = 1;
  g.bullets = [g.bullet(g.boss.x, g.boss.y + 8, 0, -8)];
  g.step();
  assert.equal(g.phase, "cleared");
  assert.equal(g.score, 500);
  assert.equal(g.boss, null);
  const tick = g.tick;
  g.step();
  assert.equal(g.tick, tick);
  g.nextStage();
  assert.equal(g.stage, 2);
  assert.equal(g.killsNeeded, 25);
  assert.equal(g.spawnInterval, 54);
  assert.equal(g.phase, "playing");
  assert.equal(g.enemyBullets.length, 0);
  const restarted = new Game(g.mode, g.difficulty);
  assert.equal(restarted.killsNeeded, 20);
  assert.equal(restarted.spawnTimer, 0);
  assert.equal(restarted.supplyTimer, 0);
});
test("zero coordinates, normalized keyboard movement and four-sided bullet cleanup", () => {
  const g = new Game();
  g.start();
  g.player.x = 21;
  g.player.y = 21;
  g.step({ x: 0, y: 0 });
  assert.equal(g.player.x, 20);
  assert.equal(g.player.y, 20);
  g.player.x = 210;
  g.player.y = 500;
  g.step({ dx: 1, dy: 1 });
  assert.ok(
    Math.abs(Math.hypot(g.player.x - 210, g.player.y - 500) - 5) < 1e-10,
  );
  g.enemyBullets = [
    g.bullet(-101, 100, -3, 0),
    g.bullet(WIDTH + 101, 100, 3, 0),
    g.bullet(100, -101, 0, -3),
    g.bullet(100, HEIGHT + 101, 0, 3),
  ];
  g.step();
  assert.equal(g.enemyBullets.length, 0);
});
test("fixed time yields identical simulations at 30, 60 and 120 Hz", () => {
  const simulate = (fps: number) => {
    const g = new Game("endless", "easy", 42),
      clock = new FixedClock();
    g.start();
    clock.advance(0, true, () => g.step());
    for (let i = 1; i <= fps * 5; i++)
      clock.advance((i * 1000) / fps, true, () => g.step({ x: 100, y: 600 }));
    return g.summary();
  };
  assert.deepEqual(simulate(30), simulate(60));
  assert.deepEqual(simulate(120), simulate(60));
  assert.equal(simulate(60).tick, 300);
});
test("pause freezes timers and seeded endless pressure rises without stage bosses", () => {
  const g = new Game("endless", "easy", 7);
  g.start();
  g.player.lives = 100000;
  for (let i = 0; i < 1800; i++) {
    g.step({ x: 30, y: 700 });
    g.drainEvents();
  }
  assert.equal(g.stage, 2);
  assert.equal(g.spawnInterval, 87);
  assert.equal(g.boss, null);
  g.pause();
  const before = g.summary();
  for (let i = 0; i < 30; i++) g.step();
  assert.deepEqual(g.summary(), before);
  g.resume();
  g.step();
  assert.equal(g.tick, 1801);
});
