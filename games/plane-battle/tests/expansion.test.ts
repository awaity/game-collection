import {test} from 'node:test';import assert from 'node:assert/strict';
import {Game,MAPS,MISSIONS} from '../src/core/game';
test('twelve missions have distinct terrain rules and upgrades affect actual projectiles',()=>{
 assert.equal(MAPS.length,4);assert.equal(MISSIONS.length,12);
 const base=new Game(),enhanced=new Game();base.configure(0);enhanced.configure(3,{damage:1.6,interval:.8,guard:3});
 base.shoot();enhanced.shoot();assert.ok(enhanced.bullets[0].damage>base.bullets[0].damage);assert.ok(enhanced.player.cooldown<base.player.cooldown);assert.equal(enhanced.player.lives,base.player.lives+3);assert.notEqual(enhanced.map.wind,base.map.wind);
 const continued=new Game();continued.configure(2);continued.phase='cleared';continued.nextStage();const selected=new Game();selected.configure(3);
 assert.equal(continued.killsNeeded,selected.killsNeeded);assert.equal(continued.spawnInterval,selected.spawnInterval);assert.equal(continued.map,selected.map);
});
test('endless changes maps over time and retains bounded enemy/projectile pools',()=>{
 const g=new Game('endless','easy');g.configure(0);g.start();
 for(let i=0;i<9000;i++){g.player.lives=100;g.step({x:210+Math.sin(i/90)*150,y:680});g.drainEvents();}
 assert.equal(g.phase,'playing');assert.equal(g.stage,6);assert.equal(g.map,MAPS[2]);assert.ok(g.enemies.length<80);assert.ok(g.enemyBullets.length<700);
});
test('the first reload upgrade fires more volleys during real simulation',()=>{
 const volleys=(interval:number)=>{const g=new Game();g.configure(0,{damage:1,interval,guard:0});g.start();let shots=0;
  for(let i=0;i<180;i++){g.step();shots+=g.drainEvents().filter(e=>e.type==='shot').length;}
  assert.equal(g.phase,'playing');return shots;
 };
 assert.equal(volleys(1),20);assert.equal(volleys(.96),21);
});

import {flyMission} from './pilot';
test('all twelve missions can be cleared without purchased upgrades or restored health',()=>{
 for(let mission=0;mission<MISSIONS.length;mission++){const g=flyMission(mission);assert.equal(g.phase,'cleared',MISSIONS[mission].name);assert.ok(g.player.lives>0);assert.equal(g.boss,null);}
});
