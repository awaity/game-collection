import {test} from 'node:test';import assert from 'node:assert/strict';import {Game,CHAPTERS} from '../assets/scripts/core';
test('all new maps are completable through normal steering and bounded firing',()=>{
 assert.equal(CHAPTERS.length,6);
 for(let i=3;i<6;i++){const g=new Game(i);g.demo=true;g.start();for(let t=0;t<12000&&g.phase==='playing';t++){g.step();g.drainEvents();assert.ok(g.bullets.length<=180);}assert.equal(g.phase,'victory',CHAPTERS[i].name);assert.equal(g.stats.bosses,2);}
});
test('weapon upgrades and endless pressure modify real shots, troops and enemy health',()=>{
 const g=new Game(0);const hp=g.level.bosses[0].hp;g.configure(3,4,2,5);g.start();g.fireBullets(1/60);
 assert.ok(g.bullets[0].damage>5.2);assert.ok(g.player.shotClock<.165);assert.equal(g.player.troops,3);assert.ok(g.level.bosses[0].hp>hp);
});
