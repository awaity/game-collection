import {test} from 'node:test';import assert from 'node:assert/strict';
import {Campaign} from '../src/campaign.js';import {demoInput,runReplay} from '../src/simulation/game.js';
test('endless carries survivors across waves, pays once and resumes with increasing pressure',()=>{
 const store=new Map(),c=new Campaign(k=>store.get(k),(k,v)=>{store.set(k,structuredClone(v));return true},()=>{});c.endless=true;
 let g=c.start(0);g.start();while(g.phase==='running'&&g.tick<10000)g.step(demoInput(g));assert.equal(g.phase,'won');
 c.checkpoint(g);const coins=c.career.data.coins;assert.ok(coins>500);c.checkpoint(g);assert.equal(c.career.data.coins,coins);
 const level=c.next(g),survivors=g.troops.length;g=c.start(level,'play',null,true);assert.equal(c.wave,2);assert.ok(g.troops.length>=survivors);assert.equal(g.modifiers.pressure,1);
 g.start();for(let i=0;i<600;i++)g.step(demoInput(g));assert.deepEqual(runReplay(g.replay()).summary(),g.summary());
});
test('demos and imported replays never award coins or consume a reward run',()=>{
 const c=new Campaign(()=>null,()=>true,()=>{});const g=c.start(0,'demo');g.start();for(let i=0;i<2000&&g.phase==='running';i++)g.step(demoInput(g));c.checkpoint(g);assert.equal(c.career.data.coins,0);assert.equal(c.career.data.sequence,0);
});
test('the first reload upgrade increases actual squad firing',()=>{
 const shots=haste=>{const c=new Campaign(()=>({version:1,upgrades:{haste}}),()=>true,()=>{}),g=c.start(0);g.start();for(let i=0;i<120;i++)g.step();return g.stats.shots;};
 assert.ok(shots(1)>shots(0));assert.ok(shots(2)>shots(1));
});
