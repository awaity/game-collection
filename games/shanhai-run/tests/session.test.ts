import test from 'node:test';
import assert from 'node:assert/strict';
import {Session} from '../assets/scripts/session';
import {Journey} from '../assets/scripts/profile';
const make=()=>new Session(new Journey(null,()=>true));
test('interactive tutorial stops at every required action and cannot be skipped with wrong input',()=>{
 const s=make();s.begin('training');assert.equal(s.input('jump'),false);
 for(const action of ['jump','slide','left','left'] as const){
  for(let n=0;n<3000&&!s.waiting;n++)s.step();
  assert.equal(s.waiting,action);const d=s.run.distance;
  for(let n=0;n<120;n++)s.step();assert.equal(s.run.distance,d);
  assert.equal(s.input('right'),false);assert.equal(s.waiting,action);
  assert.equal(s.input(action),true);
 }
 for(let n=0;n<2000&&s.run.phase==='running';n++)s.step();
 assert.equal(s.run.phase,'won');assert.equal(s.run.stats.stumbles,0);assert.equal(s.journey.data.tutorial,true);
 assert.equal(s.journey.data.coins,0);assert.equal(s.journey.data.totals.distance,0);
});
test('all eight trials unlock and settle once through the real session',()=>{
 const s=make();assert.equal(s.begin('trial',1),false);
 for(let i=0;i<8;i++){
  assert.equal(s.begin('trial',i),true);s.play(15000);
  assert.equal(s.run.phase,'won',`trial ${i}`);assert.ok(s.journey.data.stars[i]>=1);
  const balance=s.journey.data.coins;s.save();s.save();assert.equal(s.journey.data.coins,balance);
 }
 assert.equal(s.journey.data.unlocked,8);assert.equal(s.journey.data.totals.wins,8);assert.equal(s.journey.data.lore.length,4);
});
test('pause, background checkpoint, restart and daily seed preserve their boundaries',()=>{
 const s=make();s.begin('daily');const seed=s.run.seed;s.play(400);s.pause();
 const tick=s.run.tick,balance=s.journey.data.coins;for(let n=0;n<100;n++)s.step();assert.equal(s.run.tick,tick);
 s.home();assert.equal(s.journey.data.coins,balance);s.begin('daily');assert.equal(s.run.seed,seed);
 assert.equal(s.run.distance,0);assert.equal(s.run.upgrades.magnet,0);
});
test('paid rescue resumes actual death only once and cannot grant a free rescue on write failure',()=>{
 let writable=true;const s=new Session(new Journey(null,()=>writable));
 s.journey.checkin();s.begin('endless');s.play(3000);
 for(let n=0;n<3000&&s.run.phase!=='dead';n++)s.step();
 assert.equal(s.run.phase,'dead');assert.ok(s.journey.data.coins>=150);const balance=s.journey.data.coins;
 writable=false;assert.equal(s.rescue(),false);assert.equal(s.run.phase,'dead');assert.equal(s.journey.data.coins,balance);
 writable=true;assert.equal(s.rescue(),true);assert.equal(s.journey.data.coins,balance-150);assert.equal(s.run.revived,true);
 assert.equal(s.rescue(),false);for(let n=0;n<5000&&s.run.phase!=='dead';n++)s.step();
 assert.equal(s.journey.data.totals.runs,1);
});
