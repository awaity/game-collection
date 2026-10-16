import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {Game, LEVELS, MAX_TROOPS, demoInput, runReplay, validateReplay, createGame} from '../src/simulation/game.js';

function finish(game, input = demoInput) {
  game.start();
  const events = new Set();
  while (game.phase === 'running' && game.tick < 15000) {
    game.step(input(game));
    for (const event of game.drainEvents()) events.add(event.type);
    assert.ok(game.troops.length <= MAX_TROOPS);
    assert.equal(new Set(game.troops.map(t => t.id)).size, game.troops.length);
  }
  return events;
}

// Outcomes captured from the original public simulation, with unmodified steering.
const originalOutcomes = [
  {tick:1136,count:23,weapon:2,recruited:16,lost:1,kills:108},
  {tick:1293,count:26,weapon:2,recruited:21,lost:3,kills:153},
  {tick:1489,count:26,weapon:2,recruited:27,lost:9,kills:122},
];
for (const [level, config] of LEVELS.entries()) {
  test(`${config.name}: complete combat, upgrades, real victory, and deterministic replay`, () => {
    const game = new Game({level});
    const events = finish(game);
    const state = game.summary();
    assert.equal(state.phase, 'won');
    assert.deepEqual({tick:state.tick,count:state.count,weapon:state.weapon,recruited:state.stats.recruited,lost:state.stats.lost,kills:state.stats.kills}, originalOutcomes[level]);
    assert.equal(state.count, 8 + state.stats.recruited - state.stats.lost);
    assert.equal(state.stats.upgrades, 2);
    assert.equal(state.bosses.find(b => b.final).hp, 0);
    for (const type of ['shot','impact','gate','recruit','pod-open','upgrade','warning','boss-kill','victory']) assert.ok(events.has(type), type);
    assert.deepEqual(runReplay(game.replay()).summary(), state);
  });
}

test('reaching the end of the road with a living boss is a defeat, not a victory', () => {
  const game = new Game();
  finish(game, () => -4.8);
  assert.equal(game.distance, game.config.length);
  assert.equal(game.phase, 'lost');
  assert.equal(game.troops.length, 0);
  assert.equal(game.stats.lost, 8 + game.stats.recruited);
  assert.ok(game.enemies.find(e => e.final).hp > 0);
  assert.equal(game.finalBossKilled, false);
});

test('pause freezes simulation and resumes the same run', () => {
  const game = new Game();
  game.start();
  for (let i = 0; i < 180; i++) game.step(2.65);
  game.pause();
  const before = game.summary();
  for (let i = 0; i < 180; i++) game.step(-4.8);
  assert.deepEqual(game.summary(), before);
  game.pause();
  game.step();
  assert.equal(game.tick, before.tick + 1);
});

test('replays reject corrupt, unordered, oversized, and out-of-bounds input', () => {
  const valid = {format:'volley-run.replay',version:2,level:0,seed:91261,ticks:60,inputs:[[0,2.65],[20,-2.65]]};
  assert.equal(validateReplay(valid), valid);
  for (const change of [
    {version:9}, {level:3}, {seed:-1}, {ticks:54001}, {inputs:[[0,Infinity]]},
    {inputs:[[0,4.81]]}, {inputs:[[20,0],[10,1]]}, {inputs:[[0,0],[0,1]]},
    {inputs:[[60,0]]}, {inputs:null},
  ]) assert.throws(() => validateReplay({...valid,...change}));
  assert.throws(() => validateReplay(null));
});

test('legacy version 1 recordings remain playable', () => {
  const original = createGame({level:0,seed:91261,version:1});
  original.start();
  for (let i=0;i<240;i++) original.step(i<120?2.6:-2.6);
  assert.deepEqual(runReplay(original.replay()).summary(), original.summary());
});

test('all five original 3D model files are complete GLB assets', () => {
  for (const name of ['blue-scout','red-raider','red-colossus','pulse-rifle','heavy-cannon']) {
    const bytes = readFileSync(new URL(`../public/assets/${name}.glb`, import.meta.url));
    assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
    assert.equal(bytes.readUInt32LE(4), 2);
    assert.equal(bytes.readUInt32LE(8), bytes.length);
    const jsonLength = bytes.readUInt32LE(12);
    const gltf = JSON.parse(bytes.toString('utf8',20,20+jsonLength));
    assert.ok(gltf.meshes.length > 0);
    assert.ok(gltf.buffers.every(buffer => !buffer.uri));
    assert.equal(gltf.images?.length ?? 0, 0, 'native loading needs an image adapter before textured GLBs are added');
    assert.equal(gltf.extensionsRequired?.length ?? 0, 0, 'new required GLTF extensions need native validation');
  }
});
