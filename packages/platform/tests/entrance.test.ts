import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Entrance} from '../src/brand';

test('entry never reveals an unready game, including a queued skip',()=>{
  const e=new Entrance();e.skip();assert.equal(e.update(90000,false),true);assert.equal(e.done,false);
  assert.equal(e.update(91000,true),false);assert.equal(e.done,true);
});
test('entry measures from readiness, finishes once, and never replays on later frames',()=>{
  const e=new Entrance();assert.equal(e.update(8000,false),true);assert.equal(e.update(9000),true);
  assert.equal(e.update(9400),true);assert.equal(e.update(9850),false);assert.equal(e.update(10000,false),false);
});
test('reduced motion has a short reveal and a skip ends only the entrance',()=>{
  const e=new Entrance();e.reduced=true;e.update(40);assert.equal(e.update(159),true);assert.equal(e.update(160),false);
  const manual=new Entrance();manual.update(1000);manual.skip();assert.equal(manual.done,false);assert.equal(manual.update(1001),false);
});
