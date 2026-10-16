import assert from'node:assert/strict';import{test}from'node:test';import{Night}from'../assets/scripts/core';
test('automatic attacks kill actual approaching enemies and drop souls',()=>{const s=new Night();s.start();for(let i=0;i<1200;i++)s.step();assert.ok(s.kills>0);assert.equal(s.xp,s.kills)});
test('pause freezes movement and wave timers',()=>{const s=new Night();s.start();s.step();s.pause();const before=JSON.stringify(s);for(let i=0;i<60;i++)s.step(1,1);assert.equal(JSON.stringify(s),before)});
