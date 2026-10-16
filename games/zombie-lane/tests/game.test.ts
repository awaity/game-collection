import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Game, MAX_BULLETS, MAX_ENEMIES } from '../src/core/game.ts';
import { steer } from './strategy.ts';

test('a real player input sequence earns every weapon and defeats the boss on both difficulties',()=>{
  for(const difficulty of ['normal','hard'] as const)for(const seed of [1,2,3,61728,998172]){
    const game=new Game(difficulty,seed);game.start();const upgrades:string[]=[],waves:number[]=[];
    for(let tick=0;tick<9000&&game.phase==='playing';tick++){
      game.step(steer(game));
      for(const event of game.drainEvents()){if(event.kind==='upgrade')upgrades.push(event.text!);if(event.kind==='wave'&&event.value)waves.push(event.value);}
      assert.ok(game.enemies.length<=MAX_ENEMIES);assert.ok(game.bullets.length<=MAX_BULLETS);
    }
    assert.equal(game.phase,'won',`${difficulty}, seed ${seed}`);assert.equal(game.bossKilled,true);assert.ok(game.time>=58&&game.time<100);
    assert.equal(game.tier,2);assert.equal(game.pellets,2);assert.ok(game.power>=1.5);assert.ok(game.stats.kills>150);assert.ok(game.stats.peakEnemies>30);
    assert.ok(upgrades.includes('双发齐射 · 子弹 ×2'));assert.ok(upgrades.includes('加特林就位！转身清场'));assert.ok(upgrades.includes('雷霆火炮！范围爆破'));assert.deepEqual(waves,[2,3]);
  }
});
test('neglecting either side loses: no hidden timer victory or automatic upgrades',()=>{
  for(const position of [-2.6,2.3]){const game=new Game();game.start();for(let tick=0;tick<9000&&game.phase==='playing';tick++){game.step(position);game.drainEvents();}assert.equal(game.phase,'lost');assert.equal(game.hp,0);assert.equal(game.bossKilled,false);if(position>0){assert.equal(game.tier,0);assert.equal(game.stats.upgrades,0);assert.equal(game.gate?.hp,game.gate?.maxHp);}}
});
test('gates require projectile contact and upgrade immediately on breaking',()=>{
  const game=new Game();game.start();game.step(-2.6);assert.equal(game.pellets,1);assert.equal(game.gate?.hp,100);
  for(let tick=0;tick<180;tick++)game.step(-2.6);
  assert.equal(game.pellets,2);assert.equal(game.stats.upgrades,1);assert.equal(game.gate,null);
});
test('fast projectiles hit through swept collision instead of tunneling',()=>{
  const game=new Game();game.start();game.nextSpawn=999;game.nextShot=999;game.spawn('walker',10,2);const hp=game.enemies[0].hp;
  game.bullets.push({id:999,x:2,z:0,vx:0,vz:1200,damage:20,tier:0,age:0,target:'enemy'});game.step();assert.equal(game.enemies[0].hp,hp-20);assert.equal(game.bullets.length,0);
});
test('rockets damage a group but ordinary bullets damage only their first target',()=>{
  for(const tier of [0,2]){const game=new Game();game.start();game.nextShot=999;game.nextSpawn=999;game.spawn('walker',10,2);game.spawn('walker',10.5,2.9);game.bullets.push({id:999,x:2,z:9.7,vx:0,vz:30,damage:100,tier,age:0,target:'enemy'});game.step();assert.equal(game.stats.kills,tier===2?2:1);}
});
test('pause freezes time, projectile positions, health, waves and cooldowns',()=>{
  const game=new Game();game.start();for(let i=0;i<600;i++)game.step(-2.6);game.airstrike();game.pause();const before=JSON.stringify(game.summary()),enemies=JSON.stringify(game.enemies);
  for(let i=0;i<1200;i++)game.step(3);assert.equal(JSON.stringify(game.summary()),before);assert.equal(JSON.stringify(game.enemies),enemies);assert.equal(game.airstrike(),false);game.resume();game.step();assert.equal(game.tick,601);assert.ok(Math.abs(game.time-601/60)<1e-10);
});
test('airstrike is a real attack with a 28 second cooldown and cannot heal the defense',()=>{
  const game=new Game();assert.equal(game.airstrike(),false);game.start();game.spawn('walker',10);game.hp=40;assert.equal(game.airstrike(),true);assert.equal(game.stats.kills,1);assert.equal(game.hp,40);assert.equal(game.airstrike(),false);
  game.time=28;assert.equal(game.airstrike(),true);assert.equal(game.stats.airstrikes,2);
});
test('identical seeds and movement reproduce the same outcome',()=>{
  const a=new Game('normal',717),b=new Game('normal',717);a.start();b.start();for(let i=0;i<6000;i++){a.step(steer(a));b.step(steer(b));a.drainEvents();b.drainEvents();}assert.deepEqual(a.summary(),b.summary());
});
test('invalid input is ignored, bounds hold, and terminal states cannot continue combat',()=>{
  const game=new Game();game.start();game.setTarget(NaN);assert.equal(game.targetX,1.8);game.setTarget(Infinity);assert.equal(game.targetX,1.8);game.step(10000);assert.equal(game.targetX,3.8);game.step(-10000);assert.equal(game.targetX,-3.8);
  game.hp=0;game.step();assert.equal(game.phase,'lost');const before=game.summary();for(let i=0;i<600;i++)game.step();assert.deepEqual(game.summary(),before);
});
test('a repair gate caps health and a lethal breach takes precedence over a simultaneous boss kill',()=>{
  const game=new Game();game.start();game.hp=90;game.gate!.kind='repair';game.gate!.hp=0;game.breakGate();assert.equal(game.hp,100);game.hp=0;game.bossKilled=true;game.step();assert.equal(game.phase,'lost');
});
