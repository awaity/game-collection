import test from 'node:test';
import assert from 'node:assert/strict';
import {Run,pilot,TRIALS,DT} from '../assets/scripts/core';

function play(run:Run,limit=100000){run.start();for(let i=0;i<limit&&run.phase==='running';i++){pilot(run);run.step();}return run;}
test('all eight trials can be completed using ordinary player inputs',()=>{
  for(let trial=0;trial<TRIALS.length;trial++)for(const seed of [42,91,203]){
    const run=play(new Run({mode:'trial',trial,seed}));
    assert.equal(run.phase,'won',JSON.stringify({trial,seed,...run.snapshot(),reason:run.deathReason}));
    assert.equal(run.distance,TRIALS[trial].distance);assert.ok(run.stats.jumps>0);assert.ok(run.stats.turns>0);
  }
});
test('missing a real corner falls off the track; correct input changes world heading',()=>{
  const missing=new Run();missing.start();
  for(let n=0;n<1200&&missing.phase==='running';n++){
    if(!missing.canTurn)pilot(missing);missing.step();
  }
  assert.equal(missing.deathKind,'fall');assert.ok(missing.deathReason.includes('路口'));
  const turned=new Run();turned.start();
  while(turned.currentSegment===0&&turned.phase==='running'){pilot(turned);turned.step();}
  assert.equal(turned.currentSegment,1);assert.equal(turned.segment.heading,-Math.PI/2);assert.equal(turned.stats.turns,1);
  assert.ok(turned.sample(turned.distance+10).x<turned.sample(turned.distance).x);
});
test('turning toward a missing branch fails',()=>{
  const run=new Run();run.start();while(run.phase==='running'&&!run.canTurn){pilot(run);run.step();}
  run.input(run.turnDirection<0?'right':'left');assert.equal(run.phase,'dying');assert.equal(run.deathKind,'turn');
});
test('jump and slide have distinct poses, duration and collision requirements',()=>{
  const run=new Run();run.start();run.input('jump');
  for(let i=0;i<20;i++)run.step();assert.ok(run.height>1.8);assert.equal(run.input('slide'),false);
  for(let i=0;i<40;i++)run.step();assert.equal(run.height,0);assert.ok(run.input('slide'));assert.equal(run.input('jump'),false);
  for(let i=0;i<55;i++)run.step();assert.equal(run.sliding,false);
  const noJump=new Run();noJump.start();while(noJump.distance<40&&noJump.phase==='running')noJump.step();assert.equal(noJump.stats.stumbles,1);
});
test('pause freezes distance, input, collision and power timers',()=>{
  const run=new Run();run.start();run.activate('magnet');for(let i=0;i<10;i++)run.step();run.pause();
  const before=JSON.stringify(run.snapshot());assert.equal(run.input('jump'),false);for(let i=0;i<600;i++)run.step();
  assert.equal(JSON.stringify(run.snapshot()),before);run.resume();run.step();assert.ok(run.distance>JSON.parse(before).distance);
});
test('same seed and player inputs produce the same route and result',()=>{
  const a=play(new Run({mode:'trial',trial:5,seed:415})),b=play(new Run({mode:'trial',trial:5,seed:415}));
  assert.deepEqual(a.snapshot(),b.snapshot());
  assert.notDeepEqual(new Run({seed:415}).hazards,new Run({seed:416}).hazards);
});
test('long endless runs cover all four areas with bounded generated entities',()=>{
  for(const seed of [7,42,145,941,2026]){
    const run=new Run({seed}),areas=new Set<number>();run.start();
    for(let i=0;i<42000&&run.phase==='running';i++){pilot(run);run.step();areas.add(run.area);
      assert.ok(run.segments.length<10);assert.ok(run.hazards.length<24);assert.ok(run.pickups.length<210);
    }
    assert.equal(run.phase,'running',JSON.stringify({seed,...run.snapshot(),reason:run.deathReason}));
    assert.ok(run.distance>7000);assert.equal(areas.size,4);assert.ok(run.speed>18);assert.ok(run.stats.coins>100);
  }
});
test('daily and training loadouts cannot gain shop upgrades',()=>{
  for(const mode of ['daily','training'] as const)assert.deepEqual(new Run({mode,upgrades:{wind:5,magnet:5,shield:5,fortune:5}}).upgrades,{wind:0,magnet:0,shield:0,fortune:0});
});
test('boost follows corners and ignores hazards for its limited duration',()=>{
  const run=new Run();run.start();while(run.distance<100&&run.phase==='running'){pilot(run);run.step();}
  run.spirit=100;assert.ok(run.input('wind'));assert.equal(run.spirit,0);
  for(let n=0;n<130;n++)run.step();assert.equal(run.phase,'running');assert.ok(run.currentSegment>=1);
  for(let n=0;n<80;n++){pilot(run);run.step();}assert.equal(run.wind,0);
});
test('one rescue resumes safely and cannot be used repeatedly',()=>{
  const run=new Run();run.start();while(run.phase==='running'){if(!run.canTurn)pilot(run);run.step();}
  while(run.phase==='dying')run.step();assert.equal(run.phase,'dead');assert.ok(run.revive());assert.equal(run.revive(),false);
  for(let n=0;n<600;n++){pilot(run);run.step();}assert.equal(run.phase,'running');
  assert.equal(DT,1/60);
});
