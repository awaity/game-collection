import {test} from 'node:test';import assert from 'node:assert/strict';import {Assault,ROUTES,exportReplay,importReplay} from '../assets/scripts/core';
test('new maps support real victories and all growth parameters survive replay',()=>{
 assert.equal(ROUTES.length,6);
 for(let route=3;route<6;route++){
  const g=new Assault(42,route);for(let i=0;i<2700;i++)g.step();assert.equal(g.outcome,'胜利',ROUTES[route].name);assert.equal(g.boss.hp,0);
 }
 const live=new Assault(42,4,undefined,{power:3,haste:2,guard:1,pressure:2,carry:24});for(let i=0;i<1600;i++)live.step();
 const replay=importReplay(JSON.stringify(exportReplay(live))),copy=new Assault(replay.seed,replay.route,replay.inputs,replay.loadout);while(copy.tick<live.tick)copy.step();assert.equal(copy.hash(),live.hash());assert.deepEqual(copy.loadout,live.loadout);
 assert.throws(()=>new Assault(42,0,[],{power:6,haste:0,guard:0}));
 const shots=(haste:number)=>{const g=new Assault(42,0,[],{power:0,haste,guard:0});for(let i=0;i<180;i++)g.step();return g.shots;};
 assert.ok(shots(1)>shots(0));assert.ok(shots(2)>shots(1));
});
