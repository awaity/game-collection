import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {Game,CONFIG,defaultSave,normalizeSave,recordVictory,traceRay,weaponSocket} from '../assets/scripts/core';
const gold=JSON.parse(readFileSync(new URL('./reference-golden.json',import.meta.url),'utf8'));
for(let chapter=0;chapter<3;chapter++)test(`chapter ${chapter}: complete state and authoritative result match reference 1.2.0`,()=>{
 const game=new Game(chapter);game.demo=true;game.start();let tick=0;
 for(const check of gold.checkpoints.filter((c:{chapter:number})=>c.chapter===chapter)){
  while(tick<check.time*60){game.step();game.drainEvents();tick++}
  assert.equal(createHash('sha256').update(JSON.stringify(game)).digest('hex'),check.sha256,`time ${check.time}`);
  assert.deepEqual(game.snapshot(),check.snapshot);
 }
 assert.equal(game.phase,'victory');assert.equal(game.stats.bosses,2);
});
test('pause and invalid dt preserve resources; charging cells supply a finite laser',()=>{
 const g=new Game();g.start();for(let i=0;i<400;i++)g.step();assert.ok(g.player.energy>0);const before=JSON.stringify(g);g.step(-1);g.step(NaN);assert.equal(JSON.stringify(g),before);
 g.pause();const paused=JSON.stringify(g);for(let i=0;i<120;i++)g.step();assert.equal(JSON.stringify(g),paused);g.resume();g.aim(-3.12);for(let i=0;i<15;i++)g.step();assert.equal(g.player.laser,true);const energy=g.player.energy;for(let i=0;i<30;i++)g.step();assert.ok(g.player.energy<energy);
});
test('the +99 energy gate stays locked until a real first-boss kill; rewards are not fake troop grants',()=>{
 const g=new Game();g.start();const gate=g.level.gates[2],hp=gate.hp;g.hitGate(gate,1e6);assert.equal(gate.hp,hp);g.hitBoss(g.level.bosses[0],1e6);g.hitGate(gate,1e6);assert.equal(gate.state,'open');g.distance=gate.d;g.player.x=gate.x;const troops=g.player.troops;g.updatePickups(1/60);assert.equal(gate.state,'taken');assert.equal(g.player.troops,troops);assert.equal(g.player.energy,CONFIG.energyMax);assert.equal(g.player.boost,8);
});
test('front solid gate blocks ray damage from reaching enemies behind it',()=>{
 const g=new Game(),socket=weaponSocket(g.player,{x:0,z:0},0,0,0),hit=traceRay(g,socket);assert.equal(hit?.kind,'gate');assert.equal(hit?.item.id,'gate-1');
});
test('validated saves keep unlocked chapters and best scores monotonic',()=>{
 const a=defaultSave(),b=recordVictory(a,0,66996);assert.equal(a.unlocked,1);assert.equal(b.unlocked,2);assert.equal(recordVictory(b,0,5).best[0],66996);assert.deepEqual(recordVictory(b,4,20),b);assert.deepEqual(normalizeSave({version:7}),defaultSave());assert.equal(normalizeSave({version:1,unlocked:999,best:[NaN,-3,5],settings:{quality:'bad'}}).unlocked,3);
});
