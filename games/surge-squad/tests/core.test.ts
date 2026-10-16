import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Surge} from '../assets/scripts/core';
test('charging supplies a finite laser and paused simulation preserves resources',()=>{const s=new Surge();s.start();for(let i=0;i<180;i++)s.step();assert.equal(s.energy,12);s.aim(-3.12);for(let i=0;i<120;i++)s.step();assert.ok(s.laser);assert.ok(s.energy<12);s.pause();const snapshot=JSON.stringify(s);s.step();assert.equal(JSON.stringify(s),snapshot)});
test('+99 gate remains locked until the first boss is actually destroyed',()=>{const s=new Surge();s.start();s.aim(3.18);for(let i=0;i<2400;i++)s.step();assert.equal(s.gateTaken[2],false);assert.equal(s.boss[0],599);assert.ok(s.troops>1)});
