import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle,DT,FIELD,LIMITS,defaultLoadout,segmentDistance,inRift,nextLuck,onPillarLine,type Enemy,type Field,type Projectile,type Loadout} from '../assets/scripts/core';
import {ENEMIES,SKILLS,STAGES,UPGRADES,enemyById,type EnemyId,type SkillId,type SkinId} from '../assets/scripts/content';
import {Armory} from '../assets/scripts/profile';
import {Session} from '../assets/scripts/session';

function enemy(kind:EnemyId='walker',patch:Partial<Enemy>={}):Enemy {
 const def=enemyById[kind];
 return {id:1,kind,x:0,y:270,hp:def.hp,maxHp:def.hp,shield:0,speed:0,haste:0,hinder:0,radius:def.radius,attack:999,ability:999,warning:0,burn:0,burnPower:0,freeze:0,stun:0,slow:0,root:0,bind:0,wound:0,vulnerable:0,orbSlow:0,orbSlowPower:0,fractures:0,fractureTime:0,age:0,child:false,...patch};
}
// Isolated fixtures exercise collision and status rules. Full victories below use only public inputs.
function arena(skill?:SkillId,loadout:Loadout=defaultLoadout(),seed=41) {
 const b=new Battle(0,'campaign',seed,loadout);b.phase='playing';b.wave=1;b.spawnClock=999;b.waveQuota=999;
 b.learned=skill?{[skill]:1}:{};return b;
}
function steps(b:Battle,count:number){for(let n=0;n<count;n++){if(b.phase==='choice')b.choose(b.cards[0].id);b.step();}}
function legalSession(seed=71,mode:'campaign'|'endless'|'daily'='campaign'){
 const a=new Armory(null,()=>true,()=> '2026-10-19'),s=new Session(a);assert.equal(s.begin(0,mode,seed),true);return s;
}

test('fixed-step runs are deterministic and exposed snapshots do not mutate rules',()=>{
 const a=legalSession(),b=legalSession();a.play(12000);b.play(12000);assert.deepEqual(a.battle.snapshot(),b.battle.snapshot());
 const copy=a.battle.snapshot();copy.learned.rifle=99;copy.upgrades.fake=99;assert.notEqual(a.battle.learned.rifle,99);assert.equal(a.battle.upgrades.fake,undefined);
 copy.weaponStats.rifle.damage=999;assert.notEqual(a.battle.stats('rifle').damage,999);
});
test('choice and pause stop combat; invalid choices, extra rerolls, locked evolutions are rejected',()=>{
 const b=new Battle();b.start();assert.equal(b.phase,'choice');const before=b.snapshot();stepsNoChoice(b,60);assert.deepEqual(b.snapshot(),before);
 assert.equal(b.choose('thermo:super'),false);assert.equal(b.reroll(),true);assert.equal(b.reroll(),true);assert.equal(b.reroll(),false);
 b.pause();assert.equal(b.choose(b.cards[0].id),false);stepsNoChoice(b,120);assert.equal(b.tick,0);b.resume();assert.equal(b.phase,'choice');assert.equal(b.choose(b.cards[0].id),true);
 b.pause();stepsNoChoice(b,120);assert.equal(b.tick,0);b.resume();steps(b,10);assert.equal(b.tick,10);
});
function stepsNoChoice(b:Battle,count:number){for(let n=0;n<count;n++)b.step();}
test('evolution prerequisites and four special slots follow the actual build',()=>{
 const b=arena();b.learned={rifle:1,thermo:1,dryice:1,fuel:1,ray:1};assert.equal(b.specialCount,4);assert.ok(!b.availableCards().some(c=>c.kind==='learn'));
 assert.ok(!b.availableCards().some(c=>c.id==='thermo:super'));b.upgrades['thermo:heat']=1;b.upgrades['thermo:salvo']=1;assert.ok(b.availableCards().some(c=>c.id==='thermo:super'));
 b.upgrades['thermo:super']=1;assert.ok(!b.availableCards().some(c=>c.id==='thermo:super'));
 for(const u of UPGRADES)for(const [required]of u.requires)assert.ok(SKILLS.some(s=>s.id===required)||UPGRADES.some(u=>u.id===required),required);
});
test('bullets travel before damage, swept collision catches hits and penetration reaches a second enemy',()=>{
 assert.equal(segmentDistance(0,10,0,0,0,20),0);
 const b=arena('rifle',{...defaultLoadout(),crit:0});b.upgrades['rifle:pierce']=1;b.enemies=[enemy('walker',{hp:500,maxHp:500,y:270}),enemy('walker',{id:2,hp:500,maxHp:500,y:310})];
 b.step();assert.equal(b.damageDone,0);assert.equal(b.projectiles.length,1);steps(b,30);assert.ok(b.enemies.every(e=>e.hp<500));
});
test('every weapon produces actual damage with bounded live objects',()=>{
 for(const s of SKILLS){const b=arena(s.id,{...defaultLoadout(),crit:0});b.enemies=[enemy('brute',{hp:100000,maxHp:100000})];steps(b,700);assert.ok(b.damageDone>0,`${s.id} never damaged an enemy`);assert.ok(b.projectiles.length<=LIMITS.projectiles);assert.ok(b.fields.length<=LIMITS.fields);assert.ok(b.events.length<=LIMITS.events);}
});
test('reference cooldowns govern actual orb, laser and vehicle casts across pause',()=>{
 for(const [skill,period]of [['orb',8],['guided',10.3],['vehicle',17.4]] as const){
  const b=arena(skill,{...defaultLoadout(),crit:0});b.enemies=[enemy('brute',{hp:1000000,maxHp:1000000})];b.step();
  const ids=()=>[...b.projectiles,...b.fields].filter(p=>p.skill===skill).map(p=>p.id),first=ids();assert.ok(first.length>0);
  const frames=Math.round(period/DT);stepsNoChoice(b,frames-1);assert.ok(ids().every(id=>first.includes(id)),'no next cast before the configured period');
  b.pause();const paused=b.snapshot();stepsNoChoice(b,600);assert.deepEqual(b.snapshot(),paused);b.resume();b.step();
  assert.ok(ids().some(id=>!first.includes(id)),skill+' casts on the first eligible fixed frame');assert.equal(b.stats(skill).interval,period);
 }
});
test('sixth orb research replaces rise damage and the visible card without mutating shared definitions',()=>{
 for(const level of [5,6,10]){
  const loadout={...defaultLoadout(),crit:0,research:{orb:level}},b=arena('orb',loadout),card=b.availableCards().find(c=>c.id==='orb:rise')!;
  const variant=level>=6;assert.equal(card.name,variant?'升维+':'升维');assert.ok(card.description.includes(variant?'伤害提高10%':'伤害降低10%'));
  b.phase='choice';b.cards=[{...card,luckChange:8,luckAfter:8}];assert.equal(b.choose(card.id),true);assert.equal(b.orbLuck,8);
  loadout.research.orb=0;assert.equal(b.loadout.research.orb,level,'battle captures research when entering');
  b.enemies=[enemy('walker',{hp:10000,maxHp:10000})];b.step();b.learned={};
  const expected=38*(1+level*.04+(variant?.1:-.1));assert.ok(Math.abs(b.projectiles[0].damage-expected)<1e-8);until(b,()=>b.damageDone>0,180);assert.ok(Math.abs(b.damageDone-expected)<1e-8);
 }
 const base=arena('orb').availableCards().find(c=>c.id==='orb:rise')!;assert.equal(base.name,'升维');assert.match(base.description,/伤害降低10%/);
});
test('airdrop direct explosions use physical resistance, independently of later burning upgrades',()=>{
 const hit=(kind:EnemyId)=>{const b=arena('airdrop',{...defaultLoadout(),crit:0});b.enemies=[enemy(kind,{hp:10000,maxHp:10000})];stepsNoChoice(b,75);return b.damageDone;};
 assert.equal(hit('walker'),130);assert.equal(hit('fireguard'),130);assert.ok(Math.abs(hit('armor')-130*.35)<1e-8);
});
test('shields absorb first and armored enemies resist physical shots',()=>{
 const b=arena('rifle',{...defaultLoadout(),crit:0});b.enemies=[enemy('shield',{hp:1000,maxHp:1000,shield:1000})];steps(b,40);assert.equal(b.enemies[0].hp,1000);assert.ok(b.enemies[0].shield<1000);assert.ok(b.damageDone<28*2);
 const a=arena('rifle',{...defaultLoadout(),crit:0}),c=arena('rifle',{...defaultLoadout(),crit:0});a.enemies=[enemy('armor',{hp:1000,maxHp:1000})];c.enemies=[enemy('walker',{hp:1000,maxHp:1000})];steps(a,50);steps(c,50);assert.ok(a.damageDone<c.damageDone*.4);
});
test('freeze and paralysis stop movement; elemental immunities remain effective',()=>{
 const b=arena();b.enemies=[enemy('runner',{speed:24,freeze:2}),enemy('runner',{id:2,speed:24,stun:2})];steps(b,60);assert.deepEqual(b.enemies.map(e=>e.y),[270,270]);steps(b,80);assert.ok(b.enemies.every(e=>e.y<270));
 const ice=arena('frost'),lightning=arena('electro');ice.enemies=[enemy('frostguard',{hp:10000,maxHp:10000})];lightning.enemies=[enemy('shockguard',{hp:10000,maxHp:10000})];steps(ice,10);steps(lightning,10);assert.equal(ice.enemies[0].freeze,0);assert.equal(lightning.enemies[0].stun,0);
});
test('wounds reduce healer recovery and burn cannot affect fire guards',()=>{
 const b=arena();b.enemies=[enemy('healer',{ability:0}),enemy('walker',{id:2,hp:100,maxHp:1000,x:30,wound:2}),enemy('walker',{id:3,hp:100,maxHp:1000,x:-30})];b.step();assert.equal(b.enemies[1].hp,130);assert.equal(b.enemies[2].hp,160);
 const fire=arena('thermo');fire.upgrades['thermo:ignite']=1;fire.enemies=[enemy('fireguard',{hp:10000,maxHp:10000})];steps(fire,100);assert.equal(fire.enemies[0].burn,0);
});
test('death explosion deals damage, propagation and split kills are counted once',()=>{
 const b=arena();b.upgrades['fuel:death']=1;b.enemies=[enemy('walker',{hp:.01,burn:2,burnPower:50}),enemy('brute',{id:2,x:40,hp:1000,maxHp:1000})];b.step();assert.equal(b.kills,1);assert.ok(b.enemies[0].hp<999,'explosion must cause direct damage');
 const split=arena();split.enemies=[enemy('splitter',{hp:.01,burn:2,burnPower:50})];split.step();assert.equal(split.kills,1);assert.equal(split.enemies.length,2);assert.ok(split.enemies.every(e=>e.child));
});
test('tracking laser retargets during its lifetime; bombing waits for its warning',()=>{
 const b=arena('guided',{...defaultLoadout(),crit:0});b.enemies=[enemy('walker',{hp:1}),enemy('brute',{id:2,x:30,y:280,hp:1000,maxHp:1000})];b.step();assert.equal(b.kills,1);steps(b,20);assert.ok(b.enemies[0].hp<1000);assert.equal(b.fields[0].target,2);
 const bomb=arena('airdrop');bomb.enemies=[enemy('brute',{hp:1000,maxHp:1000})];steps(bomb,60);assert.equal(bomb.damageDone,0);steps(bomb,15);assert.ok(bomb.damageDone>0);
});
test('flying enemies bypass ground flames and vehicles',()=>{
 for(const skill of ['fuel','vehicle'] as SkillId[]){const b=arena(skill);b.enemies=[enemy('bat',{hp:10000,maxHp:10000})];steps(b,300);assert.equal(b.damageDone,0,skill);}
});
test('mercenary levels increase real attacks and repairs',()=>{
 const run=(level:number,id:string)=>{const b=arena(undefined,{...defaultLoadout(),crit:0,mercenaries:[id],mercenaryLevels:{[id]:level}});b.hp=500;b.enemies=[enemy('brute',{hp:10000,maxHp:10000})];steps(b,120);return b;};
 assert.ok(run(5,'storm').damageDone>run(1,'storm').damageDone*1.5);assert.ok(run(5,'engineer').hp>run(1,'engineer').hp);
});
function skinArena(skin:SkinId,skill?:SkillId){
 const b=arena(skill,{...defaultLoadout(),skin,crit:0});b.enemies=[enemy('walker',{hp:1000000,maxHp:1000000})];return b;
}
function until(b:Battle,condition:()=>boolean,limit=15000){for(let n=0;n<limit&&!condition();n++)b.step();assert.ok(condition(),'condition did not occur through normal rule steps');}
test('electromagnetic skin counts each target once per strike, then deals both stated pulse ratios',()=>{
 const b=skinArena('arc','electro');b.step();assert.equal(b.skinProgress?.hits,1);assert.equal(b.skinProgress?.triggers,0,'direct strike and its splash are one hit');
 until(b,()=>b.skinProgress?.triggers===1);assert.equal(b.skinProgress?.hits,0);assert.equal(b.fields.filter(f=>f.variant==='plasma').length,1);
 const before=b.damageDone,base=b.stats('electro').damage;
 stepsNoChoice(b,20);assert.ok(Math.abs(b.damageDone-before-base*.1)<.0001,'expansion is 10% electric damage');
 stepsNoChoice(b,28);assert.ok(Math.abs(b.damageDone-before-base*.15)<.0001,'contraction adds 5% electric damage');
 assert.equal(b.skinProgress?.hits,0,'the plasma cannot charge itself');assert.equal(b.skinProgress?.triggers,1);
});
test('electromagnetic charge belongs to an individual living enemy',()=>{
 const b=skinArena('arc','electro');b.enemies.push(enemy('walker',{id:2,x:135,hp:1000000,maxHp:1000000}));b.step();
 b.aim(135,270);until(b,()=>b.enemies[1].hp<1000000);assert.equal(b.skinProgress?.triggers,0,'two different enemies are not two hits on one enemy');assert.equal(b.skinProgress?.targets,2);
 b.enemies[0].hp=0;b.step();assert.equal(b.skinProgress?.targets,1,'dead targets release their charge entries');
 until(b,()=>b.skinProgress?.triggers===1);assert.equal(b.skinProgress?.hits,0);
});
test('thermo and blade outfits release real volleys at their hit thresholds without recursive charge',()=>{
 for(const [skin,skill,threshold,power]of [['ember','thermo',12,1],['hazard','blade',36,.8]] as const){
  const b=skinArena(skin,skill);until(b,()=>b.skinProgress?.hits===threshold-1);assert.equal(b.skinProgress?.triggers,0);
  until(b,()=>b.skinProgress?.triggers===1);const volley=b.projectiles.filter(p=>p.source==='skin');assert.equal(volley.length,3);
  assert.equal(new Set(volley.map(p=>p.x)).size,3,'the extra volley has separate muzzle positions');assert.ok(volley.every(p=>p.damage===b.stats(skill).damage*power));
  const damage=b.damageDone;b.enemies[0].wound=0;until(b,()=>b.damageDone>damage,180);assert.equal(b.skinProgress?.hits,0);assert.equal(b.skinProgress?.triggers,1);
  if(skill==='blade')assert.ok(b.enemies[0].wound>0,'extra blades apply the same healing wound');
 }
});
test('ice outfit creates a damaging freezing storm, pauses with combat, and resets each run',()=>{
 const b=skinArena('arctic','dryice');until(b,()=>b.skinProgress?.hits===31);assert.equal(b.skinProgress?.triggers,0);
 until(b,()=>b.skinProgress?.triggers===1);assert.ok(b.fields.some(f=>f.variant==='ice-storm'));const damage=b.damageDone;
 b.step();assert.ok(b.damageDone>damage);assert.ok(b.enemies[0].freeze>0);assert.equal(b.skinProgress?.hits,0);
 b.pause();const snapshot=b.snapshot(),life=b.fields[0].life;stepsNoChoice(b,180);assert.deepEqual(b.snapshot(),snapshot);assert.equal(b.fields[0].life,life);
 b.resume();stepsNoChoice(b,120);assert.ok(!b.fields.some(f=>f.variant==='ice-storm'));
 const next=skinArena('arctic','dryice');assert.equal(next.skinProgress?.hits,0);assert.equal(next.skinProgress?.triggers,0);
});
test('mercenary attacks and unrelated player weapons cannot charge an outfit',()=>{
 const b=arena(undefined,{...defaultLoadout(),skin:'arc',mercenaries:['storm'],mercenaryLevels:{storm:5},crit:0});b.enemies=[enemy('walker',{hp:1000000,maxHp:1000000})];stepsNoChoice(b,900);
 assert.ok(b.damageDone>0);assert.equal(b.skinProgress?.hits,0);assert.equal(b.skinProgress?.triggers,0);
 const other=skinArena('ember','rifle');stepsNoChoice(other,1800);assert.ok(other.damageDone>0);assert.equal(other.skinProgress?.hits,0);
 assert.equal(skinArena('ranger','electro').skinProgress,null);
});
test('outfit loadout is captured at battle start and invalid outfit identifiers are harmless',()=>{
 const armory=new Armory({version:1,coins:2000},()=>true);assert.equal(armory.skin('arc'),true);
 const b=new Battle(0,'campaign',3,armory.loadout());assert.equal(b.loadout.skin,'arc');assert.equal(armory.skin('ranger'),true);assert.equal(b.loadout.skin,'arc');
 const bad=new Battle(0,'campaign',3,{...defaultLoadout(),skin:'constructor' as SkinId});assert.equal(bad.skinProgress,null);
});
test('lethal boss attacks end immediately without revival from repair or later kills',()=>{
 const b=arena('electro',{...defaultLoadout(),repair:100,mercenaries:['engineer']});b.hp=1;b.enemies=[enemy('mech',{y:FIELD.wall+39,warning:DT/2,hp:1})];b.step();assert.equal(b.phase,'lost');assert.equal(b.hp,0);assert.equal(b.kills,0);const tick=b.tick;steps(b,100);assert.equal(b.tick,tick);
});
test('long-lived bosses escape permanent control and continue toward the wall',()=>{
 const b=arena('frost');b.upgrades['frost:heavy']=1;b.enemies=[enemy('butcher',{hp:100000,maxHp:100000,age:26,speed:7,freeze:10,stun:10})];steps(b,90);assert.equal(b.enemies[0].freeze,0);assert.equal(b.enemies[0].stun,0);assert.ok(b.enemies[0].y<260);assert.ok(b.damageDone>0,'enraged enemies can still be damaged');
});
test('late endless waves increase incoming pressure as well as enemy health',()=>{
 const attack=(wave:number)=>{const b=new Battle(0,'endless');b.phase='playing';b.wave=wave;b.spawnClock=999;b.waveQuota=999;b.learned={};b.enemies=[enemy('walker',{y:FIELD.wall+15,attack:0})];b.step();return b.damageTaken;};
 assert.ok(attack(40)>attack(8)*2,'high-level repairs must face growing attack pressure');
});
test('first campaign clears with a fresh profile using legal choices only',()=>{
 const s=legalSession();s.play(120000);assert.equal(s.battle.phase,'won',JSON.stringify(s.battle.snapshot()));assert.equal(s.battle.wave,STAGES[0].waves);assert.ok(s.battle.bossKills>=2);assert.ok(s.battle.damageDone>0);assert.equal(s.armory.data.unlocked,2);assert.ok(s.armory.data.stars[0]>0);assert.ok(s.armory.data.coins>600);
});
test('endless continues beyond campaign waves, rotates maps, and remains bounded',()=>{
 const s=legalSession(71,'endless');s.play(120000);assert.ok(s.battle.wave>STAGES[0].waves,`reached only wave ${s.battle.wave}`);assert.notEqual(s.battle.phase,'won');assert.ok(s.armory.data.endlessBest>=8);assert.ok(s.armory.data.coins>1500);assert.ok(s.battle.enemies.length<=LIMITS.enemies);assert.ok(s.battle.projectiles.length<=LIMITS.projectiles);assert.ok(s.battle.fields.length<=LIMITS.fields);
});
test('daily variants change combat rules and the same seed repeats the same challenge',()=>{
 const normal=new Battle();
 const rush=new Battle(0,'daily',4),heavy=new Battle(0,'daily',5),short=new Battle(0,'daily',6),breach=new Battle(0,'daily',7);
 assert.equal(short.ammo,normal.ammo-4);assert.ok(short.stats('rifle').damage>normal.stats('rifle').damage);assert.equal(breach.maxHp,700);
 for(const b of [rush,heavy]){b.start();b.choose(b.cards[0].id);steps(b,20);assert.equal(b.maxWaves,10);assert.ok(b.enemies.length>0);}
 assert.ok(rush.enemies[0].speed>enemyById[rush.enemies[0].kind].speed);assert.ok(heavy.enemies[0].maxHp>enemyById[heavy.enemies[0].kind].hp);
 const a=legalSession(6,'daily'),b=legalSession(6,'daily');a.play(3000);b.play(3000);assert.deepEqual(a.battle.snapshot(),b.battle.snapshot());
});

function field(b:Battle,skill:SkillId,patch:Partial<Field>={}):Field {
 const mods=b.stats(skill),life=mods.duration||2.5;
 return {id:100,skill,x:0,y:300,radius:mods.radius,life,total:life,tick:0,vy:0,delay:0,damage:mods.damage,mods:{...mods,crit:0},...patch};
}
function drone(b:Battle,patch:Partial<Projectile>={}):Projectile {
 const mods=b.stats('drone');return {id:200,skill:'drone',x:0,y:300,px:0,py:300,vx:220,vy:0,radius:mods.radius,splash:0,damage:mods.damage,remaining:99,hits:[],life:mods.duration,mods:{...mods,crit:0},rebounds:0,hitTimes:{},...patch};
}
test('drones reflect, can hit the same enemy again, slow it, and expire without unbounded amplification',()=>{
 const b=arena();b.upgrades['drone:slow']=1;b.upgrades['drone:rebound']=1;b.enemies=[enemy('walker',{y:300,hp:10000,maxHp:10000})];
 const p=drone(b);b.projectiles=[p];b.step();assert.equal(b.damageDone,42);assert.equal(b.enemies[0].slow,.5);
 stepsNoChoice(b,20);assert.equal(b.damageDone,42,'continuous contact does not deal damage every frame');
 until(b,()=>b.damageDone>42,180);assert.ok(p.rebounds!>=1);assert.ok(p.vx<0);assert.equal(p.hits.length,0);assert.equal(Object.keys(p.hitTimes!).length,1);
 const capped=arena();capped.upgrades['drone:rebound']=1;capped.enemies=[enemy('walker',{y:300,hp:1000,maxHp:1000})];capped.projectiles=[drone(capped,{rebounds:100})];capped.step();assert.equal(capped.damageDone,84,'wall boost caps at +100%');
 b.enemies[0].hp=0;b.step();assert.deepEqual(p.hitTimes,{});stepsNoChoice(b,600);assert.equal(b.projectiles.length,0);
});
test('rifle ricochet flies toward a new enemy and never re-hits its original target',()=>{
 const b=arena('rifle',{...defaultLoadout(),crit:0});b.upgrades['rifle:ricochet']=2;
 b.enemies=[enemy('walker',{x:0,y:220,hp:1000,maxHp:1000}),enemy('walker',{id:2,x:110,y:240,hp:1000,maxHp:1000}),enemy('walker',{id:3,x:100,y:320,hp:1000,maxHp:1000})];
 b.step();b.learned={};const p=b.projectiles[0];until(b,()=>p.hits.length===1);assert.ok(p.vx>0);assert.equal(b.enemies[1].hp,1000,'bounce is not instant damage');
 until(b,()=>b.projectiles.length===0,180);assert.deepEqual(p.hits,[1,2,3]);assert.equal(p.rebounds,2);assert.ok(b.enemies.every(e=>e.hp===972));
});
test('rift damage follows a diamond, ticks every 0.4s and expires at 2.5s',()=>{
 const b=arena(),f=field(b,'rift');b.fields=[f];b.enemies=[enemy('walker',{y:300,radius:1,hp:1000,maxHp:1000}),enemy('walker',{id:2,x:48,y:330,radius:1,hp:1000,maxHp:1000})];
 assert.equal(inRift(b.enemies[0],f),true);assert.equal(inRift(b.enemies[1],f),false);
 b.step();assert.equal(b.enemies[0].hp,978);assert.equal(b.enemies[1].hp,1000);
 stepsNoChoice(b,23);assert.equal(b.enemies[0].hp,978);b.step();assert.equal(b.enemies[0].hp,956);
 stepsNoChoice(b,125);assert.equal(b.fields.length,0);assert.equal(b.enemies[0].hp,846);assert.equal(b.enemies[1].hp,1000);
});
test('rifts extend new debuffs and future wormholes accelerate burn only inside their area',()=>{
 const b=arena();b.fields=[field(b,'rift',{damage:0}),field(b,'frost',{id:101,damage:1})];b.enemies=[enemy('walker',{y:300,hp:1000,maxHp:1000})];b.step();assert.ok(Math.abs(b.enemies[0].freeze-.84)<1e-8);
 const run=(future:boolean,x:number)=>{const a=arena();a.fields=[field(a,'rift',{damage:0})];if(future)a.upgrades['rift:future']=1;a.enemies=[enemy('walker',{x,y:300,hp:1000,maxHp:1000,burn:2,burnPower:100})];stepsNoChoice(a,60);return a.damageDone;};
 assert.ok(Math.abs(run(true,0)-115)<1e-6);assert.ok(Math.abs(run(false,0)-100)<1e-6);assert.ok(Math.abs(run(true,140)-100)<1e-6);
});
test('rift collapse teleports at most three ordinary enemies and leaves bosses in place',()=>{
 const b=arena();b.upgrades['rift:fall']=1;b.fields=[field(b,'rift',{damage:0,life:DT,total:DT})];
 b.enemies=[...Array.from({length:5},(_,i)=>enemy('walker',{id:i+1,x:i*2,y:300})),enemy('butcher',{id:6,y:300})];b.step();
 assert.equal(b.enemies.filter(e=>e.y>=FIELD.height-40).length,3);assert.equal(b.enemies.find(e=>e.kind==='butcher')!.y,300);assert.equal(b.fields.length,0);
});
test('quantum links transfer only health damage since linking, once, and expire after ten seconds',()=>{
 const b=arena();b.upgrades['rift:quantum']=1;b.fields=[field(b,'rift')];
 b.enemies=[enemy('walker',{y:300,hp:250,maxHp:1000,shield:100}),enemy('walker',{id:2,x:145,y:500,hp:1000,maxHp:1000}),enemy('walker',{id:3,x:-145,y:500,hp:200,maxHp:1000})];
 b.step();assert.equal(b.links.length,1);assert.equal(b.links[0].damage[1],0,'shield loss is not health damage');
 b.enemies[0].burn=2;b.enemies[0].burnPower=800;until(b,()=>b.kills>=2,90);
 assert.equal(b.enemies.length,1);assert.equal(b.enemies[0].hp,750,'pre-link missing health and second linked death do not amplify the transfer');assert.equal(b.links.length,0);
 const a=arena();a.upgrades['rift:quantum']=1;a.fields=[field(a,'rift',{damage:0,life:.1,total:.1})];a.enemies=[enemy('walker',{y:300}),enemy('walker',{id:2,x:145,y:500}),enemy('walker',{id:3,x:-145,y:500})];a.step();assert.equal(a.links.length,1);
 const snap=a.snapshot();snap.links[0].ids[0]=999;snap.links[0].damage[1]=999;assert.notEqual(a.links[0].ids[0],999);assert.notEqual(a.links[0].damage[1],999);
 stepsNoChoice(a,599);assert.equal(a.links.length,1);a.step();assert.equal(a.links.length,0);assert.equal(a.damageDone,0);
});
test('matrix fields merge and bind gradually; leaving releases roots and enraged enemies resist control',()=>{
 const b=arena('matrix',{...defaultLoadout(),crit:0});b.enemies=[enemy('walker',{y:300,hp:10000,maxHp:10000,speed:10})];b.step();b.learned={};
 assert.ok(b.fields.length<3);assert.equal(b.fields.reduce((sum,f)=>sum+(f.merged??1),0),3);assert.ok(b.fields.some(f=>f.radius>43));
 assert.equal(b.enemies[0].root,0);stepsNoChoice(b,65);assert.ok(b.enemies[0].root>0);const y=b.enemies[0].y;stepsNoChoice(b,10);assert.equal(b.enemies[0].y,y);assert.ok(b.damageDone>0);
 b.fields=[];stepsNoChoice(b,60);assert.equal(b.enemies[0].root,0);assert.equal(b.enemies[0].bind,0);assert.ok(b.enemies[0].y<y);
 const a=arena();a.fields=[field(a,'matrix',{radius:140})];a.enemies=[enemy('butcher',{age:26,y:300,hp:10000,maxHp:10000,speed:10,slow:10,root:10,bind:1.5})];stepsNoChoice(a,80);
 assert.equal(a.enemies[0].root,0);assert.equal(a.enemies[0].slow,0);assert.equal(a.enemies[0].bind,0);assert.ok(a.enemies[0].y<280);assert.ok(a.damageDone>0);
});
test('merged matrix attracts enemies only with its center-field branch',()=>{
 const run=(core:boolean)=>{const b=arena();b.fields=[field(b,'matrix',{radius:100,merged:2,damage:0})];b.enemies=[enemy('walker',{x:70,y:300})];if(core)b.upgrades['matrix:core']=1;stepsNoChoice(b,60);return b.enemies[0].x;};
 assert.equal(run(false),70);assert.ok(run(true)<55);
});
test('the ice dragon pursues targets, claws, waits for energy, warns, then lands two damaging pulses',()=>{
 const b=arena('dragon',{...defaultLoadout(),crit:0});b.enemies=[enemy('walker',{y:300,hp:10000,maxHp:10000})];b.step();assert.ok(b.dragon);assert.ok(b.dragon.y>FIELD.wall+85);assert.equal(b.damageDone,0);assert.equal(b.fields.length,0);
 until(b,()=>b.damageDone>0,180);assert.equal(b.damageDone,62);assert.equal(b.dragon.slams,0);
 until(b,()=>b.dragon!.slams===1,2500);assert.ok(b.time>=100/3,'passive regeneration must fill the entire energy bar');assert.ok(b.dragon.energy<1);const slam=b.fields.find(f=>f.variant==='dragon-slam')!;assert.ok(slam.delay>0);
 const prior={...b.dragon},snapshot=b.snapshot();b.pause();stepsNoChoice(b,120);assert.deepEqual(b.dragon,prior);assert.equal(slam.pulse,0);b.resume();
 b.learned={};const damage=b.damageDone;stepsNoChoice(b,30);assert.equal(b.damageDone,damage);stepsNoChoice(b,8);assert.ok(b.damageDone>damage);assert.equal(slam.pulse,1);assert.ok(b.enemies[0].freeze>0);
 stepsNoChoice(b,18);assert.equal(slam.pulse,2);assert.ok(Math.abs(b.damageDone-damage-62*2.2*1.45)<1e-6);snapshot.dragon!.energy=999;assert.notEqual(b.dragon.energy,999);
});
test('dragon kills charge energy and hearts; cooldown and caps prevent repeated instant slams',()=>{
 const b=arena('dragon',{...defaultLoadout(),crit:0});b.upgrades['dragon:heart']=1;b.upgrades['dragon:energy']=2;
 b.enemies=Array.from({length:12},(_,i)=>enemy('walker',{id:i+1,y:180,hp:1,maxHp:1}));until(b,()=>b.kills===12,120);
 assert.equal(b.dragon!.hearts,9);assert.equal(b.dragon!.maxEnergy,100);assert.ok(b.dragon!.energy<=100);assert.equal(b.dragon!.slams,1);
 const count=b.dragon!.slams;b.enemies=[enemy('brute',{id:50,y:300,hp:100000,maxHp:100000}),...Array.from({length:12},(_,i)=>enemy('walker',{id:51+i,y:180,hp:1,maxHp:1}))];steps(b,300);assert.equal(b.dragon!.slams,count);assert.equal(b.dragon!.energy,100,'a full bar still respects the skill cooldown');
 steps(b,80);assert.ok(b.dragon!.slams>count);b.upgrades['dragon:awaken']=1;b.step();assert.equal(b.dragon!.maxEnergy,140);
});

function orb(b:Battle,patch:Partial<Projectile>={}):Projectile {
 const mods={...b.stats('orb'),crit:0};return {id:500,skill:'orb',x:0,y:300,px:0,py:300,vx:320,vy:0,radius:mods.radius,splash:0,damage:mods.damage,remaining:mods.bounce,hits:[],life:mods.duration,mods,source:'weapon',rebounds:0,hitTimes:{},...patch};
}
test('electrode damage follows consecutive links, hits crossings once, pauses and expires',()=>{
 const b=arena(),f=field(b,'pillar',{nodes:[{x:-100,y:260},{x:100,y:260},{x:0,y:350}],radius:9});b.fields=[f];
 b.enemies=[enemy('walker',{x:100,y:260,hp:1000,maxHp:1000}),enemy('walker',{id:2,x:0,y:310,hp:1000,maxHp:1000})];
 assert.equal(onPillarLine(b.enemies[0],f),true);assert.equal(onPillarLine(b.enemies[1],f),false,'inside the polygon is not inside a wire');
 b.step();assert.equal(b.enemies[0].hp,971,'two wires sharing a node do not double-hit');assert.equal(b.enemies[1].hp,1000);
 stepsNoChoice(b,17);assert.equal(b.enemies[0].hp,971);b.step();assert.equal(b.enemies[0].hp,942);
 b.pause();const frozen=b.snapshot();stepsNoChoice(b,300);assert.deepEqual(b.snapshot(),frozen);b.resume();
 const copy=b.snapshot();copy.fields[0].nodes![0].x=500;assert.equal(f.nodes![0].x,-100);
 stepsNoChoice(b,240);assert.equal(b.fields.length,0);const damage=b.damageDone;stepsNoChoice(b,60);assert.equal(b.damageDone,damage);
});
test('lucky cards enforce gates, update only on selection, wrap above 21 and replay deterministically',()=>{
 const a=arena('orb'),b=arena('orb');
 for(const run of [a,b]){
  assert.ok(!run.availableCards().some(c=>c.id==='orb:ultimate'||c.id==='orb:rain'));
  const select=(id:string,luckChange:number)=>{const c=run.availableCards().find(c=>c.id===id);assert.ok(c);run.phase='choice';run.cards=[{...c,luckChange,luckAfter:nextLuck(run.orbLuck,luckChange)}];assert.equal(run.choose(id),true);};
  select('orb:rise',9);assert.equal(run.orbLuck,9);assert.ok(!run.availableCards().some(c=>c.id==='orb:rain'));
  select('orb:power',4);assert.equal(run.orbLuck,13);assert.ok(run.availableCards().some(c=>c.id==='orb:rain'));assert.ok(!run.availableCards().some(c=>c.kind==='evolution'));
  select('orb:power',4);select('orb:bounce',4);assert.equal(run.orbLuck,21);assert.ok(run.availableCards().some(c=>c.id==='orb:ultimate'));
  select('orb:ultimate',2);assert.equal(run.orbLuck,1);assert.ok(run.lastLuck!.overflow);assert.equal(run.lastLuck!.before,21);assert.equal(run.lastLuck!.change,2);
  const prior=run.snapshot();assert.equal(run.choose('orb:rain'),false);assert.deepEqual(run.snapshot(),prior);
 }
 assert.deepEqual(a.snapshot(),b.snapshot());assert.equal(nextLuck(10,-13),0);assert.equal(nextLuck(17,4),21);assert.equal(nextLuck(20,4),1);
 const copy=a.snapshot();copy.lastLuck!.after=999;assert.equal(a.lastLuck!.after,1);assert.equal(new Battle().orbLuck,0);
});
test('offered lucky values are stable across reads and pauses, then applied without another random draw',()=>{
 const observed=new Map<string,Set<number>>();
 for(let seed=1;seed<=160;seed++)for(const luck of [0,13,21]){
  const b=new Battle(0,'campaign',seed);b.learned={orb:1};b.orbLuck=luck;b.start();
  const offered=b.cards.map(c=>({...c})),before=b.snapshot();b.availableCards();b.snapshot();b.pause();stepsNoChoice(b,120);b.resume();assert.deepEqual(b.snapshot(),before);
  for(const c of offered){
   if(c.luckChange===undefined){assert.equal(c.luckAfter,undefined);continue;}
   assert.equal(c.skill,'orb');assert.ok(Number.isInteger(c.luckChange));assert.equal(c.luckAfter,nextLuck(luck,c.luckChange));
   const values=observed.get(c.id)??new Set();values.add(c.luckChange);observed.set(c.id,values);
  }
  const lucky=offered.find(c=>c.luckChange!==undefined);if(!lucky)continue;
  const copy=b.snapshot();copy.cards.find(c=>c.id===lucky.id)!.luckChange=999;assert.deepEqual(b.cards,offered);
  assert.ok(b.choose(lucky.id));assert.equal(b.orbLuck,lucky.luckAfter);assert.equal(b.lastLuck!.change,lucky.luckChange);assert.equal(b.snapshot().randomState,before.randomState);
 }
 for(const [id,lo,hi]of [['rise',8,10],['power',3,5],['wall-split',4,6],['split',6,8],['rain',4,8],['hinder',-8,-6],['wall-blast',-12,-9],['tide',1,2]] as const){
  const values=observed.get('orb:'+id);assert.ok(values?.has(lo)&&values.has(hi),id+' reaches both signed endpoints');assert.ok([...values].every(n=>n>=lo&&n<=hi),id+' stays within its configured endpoints');
 }
 const b=new Battle(0,'campaign',312);b.learned={orb:1};b.orbLuck=13;b.start();const before=b.snapshot();assert.equal(b.reroll(),true);assert.equal(b.rerolls,before.rerolls-1);assert.equal(b.orbLuck,13);assert.equal(b.lastLuck,null);assert.notEqual(b.snapshot().randomState,before.randomState);
});
test('invalid lucky outcomes cannot partly apply a card or consume the offer',()=>{
 for(const patch of [{luckChange:undefined},{luckChange:NaN},{luckChange:Infinity},{luckChange:3},{luckChange:3.5},{luckChange:12},{luckAfter:21},{luckAfter:NaN}]){
  const b=arena('orb'),card=b.availableCards().find(c=>c.id==='orb:rise')!;b.phase='choice';b.cards=[{...card,luckChange:9,luckAfter:9,...patch}];
  const before=b.snapshot();assert.equal(b.choose(card.id),false);assert.deepEqual(b.snapshot(),before);
 }
});
test('tidal orb makes two additional real contacts before expiring',()=>{
 const contacts=(tide:boolean)=>{const b=arena();if(tide)b.upgrades['orb:tide']=1;
  b.enemies=[enemy('walker',{x:-60,y:300,hp:10000,maxHp:10000}),enemy('walker',{id:2,x:80,y:320,hp:10000,maxHp:10000})];
  const p=orb(b,{x:-95,px:-95,mods:{...b.stats('orb'),crit:0,knock:0}});b.projectiles=[p];until(b,()=>b.projectiles.length===0,900);
  assert.equal(b.damageDone,p.hits.length*38);assert.ok(p.hits.every((id,i)=>id===i%2+1),'contacts alternate between living enemies');return p.hits.length;};
 assert.equal(contacts(false),4);assert.equal(contacts(true),6);
});
test('hinder halves only haste, expires independently of cripple, freezes while paused and ignores rage',()=>{
 const hit=(haste:number,cripple=false,rage=false)=>{const b=arena();b.upgrades['orb:hinder']=1;if(cripple)b.upgrades['orb:cripple']=1;
  b.enemies=[enemy(rage?'butcher':'walker',{y:300,hp:100000,maxHp:100000,speed:60,haste,age:rage?26:0})];
  b.projectiles=[orb(b,{x:-20,px:-20,remaining:0,mods:{...b.stats('orb'),knock:0,crit:0}})];b.step();return b;};
 const movement=(b:Battle)=>{const y=b.enemies[0].y;b.step();return y-b.enemies[0].y;};
 const close=(actual:number,expected:number)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);
 const ordinary=hit(0),fast=hit(.3);assert.equal(ordinary.enemies[0].hinder,1);close(movement(ordinary),1);close(movement(fast),1.15);
 fast.pause();const paused=fast.snapshot();stepsNoChoice(fast,120);assert.deepEqual(fast.snapshot(),paused);fast.resume();stepsNoChoice(fast,61);assert.equal(fast.enemies[0].hinder,0);close(movement(fast),1.3);
 const combined=hit(.3,true);close(movement(combined),.115);stepsNoChoice(combined,31);assert.equal(combined.enemies[0].orbSlow,0);assert.ok(combined.enemies[0].hinder>0);close(movement(combined),1.15);
 const rage=hit(.3,true,true);assert.equal(rage.enemies[0].hinder,0);assert.equal(rage.enemies[0].orbSlow,0);close(movement(rage),2.34);
 const enraging=hit(.3);enraging.enemies[0].kind='butcher';enraging.enemies[0].age=26;close(movement(enraging),2.34);assert.equal(enraging.enemies[0].hinder,0);
});
test('balls travel between living targets, deal physical damage and have finite enemy redirects',()=>{
 const b=arena();b.enemies=[enemy('walker',{x:0,y:300,hp:10000,maxHp:10000}),enemy('armor',{id:2,x:100,y:330,hp:10000,maxHp:10000})];
 const p=orb(b,{x:-40,px:-40});b.projectiles=[p];until(b,()=>p.hits.length===1,20);assert.equal(b.enemies[0].hp,9962);assert.equal(b.enemies[1].hp,10000,'retargeting cannot deal instant damage');assert.ok(p.vx>0&&p.vy>0);
 until(b,()=>p.hits.length===2,60);assert.ok(Math.abs(b.enemies[1].hp-(10000-38*.35))<1e-6);assert.deepEqual(p.hits,[1,2]);
 until(b,()=>b.projectiles.length===0,900);assert.ok(p.hits.length<=4,'three redirects allow at most four target contacts');
});
test('armed balls guarantee their first two contact criticals, then use normal critical chance',()=>{
 const b=arena();b.upgrades['orb:armed']=1;b.enemies=[enemy('walker',{x:-60,y:300,hp:10000,maxHp:10000}),enemy('walker',{id:2,x:80,y:320,hp:10000,maxHp:10000})];
 const p=orb(b,{x:-95,px:-95});b.projectiles=[p];
 until(b,()=>p.hits.length===1);assert.equal(b.damageDone,76);until(b,()=>p.hits.length===2);assert.equal(b.damageDone,152);until(b,()=>p.hits.length===3);assert.equal(b.damageDone,190);
});
test('wall impacts cause optional blasts and unenhanced children cannot recursively split',()=>{
 const b=arena(undefined,{...defaultLoadout(),crit:0});b.upgrades['orb:wall-split']=1;b.upgrades['orb:wall-blast']=1;b.enemies=[enemy('walker',{x:140,y:340,hp:10000,maxHp:10000})];
 const parent=orb(b,{x:159,px:159,y:300,py:300,remaining:0,damage:100});b.projectiles=[parent];b.step();assert.equal(b.damageDone,80);assert.equal(b.projectiles.length,2);assert.equal(parent.remaining,0);
 const child=b.projectiles.find(p=>p.source==='secondary')!;assert.ok(child);assert.equal(child.damage,38);assert.equal(child.radius,7);assert.ok(Math.abs(Math.hypot(child.vx,child.vy)-320*14/18)<1e-8);
 b.projectiles=[child];stepsNoChoice(b,600);assert.equal(b.projectiles.length,0);assert.ok(b.damageDone<=80+38*4,'children cannot inherit the wall blast or spawn a growing chain');
 const full=arena();full.upgrades['orb:wall-split']=1;full.projectiles=Array.from({length:LIMITS.projectiles},(_,id)=>orb(full,{id,x:159,px:159}));full.step();assert.equal(full.projectiles.length,LIMITS.projectiles);
});
test('orb volley rounds are delayed, freeze on pause, and snapshot their cast stats',()=>{
 const b=arena('orb',{...defaultLoadout(),crit:0});b.upgrades['orb:repeat']=1;b.upgrades['orb:salvo']=1;b.enemies=[enemy('walker',{y:500,hp:100000,maxHp:100000})];b.step();b.learned={};assert.equal(b.shots,2);assert.equal(b.snapshot().pendingVolleys,1);
 b.pause();const snap=b.snapshot();stepsNoChoice(b,120);assert.deepEqual(b.snapshot(),snap);b.resume();b.upgrades['orb:ultimate']=1;
 stepsNoChoice(b,29);assert.equal(b.shots,2);stepsNoChoice(b,1);assert.equal(b.shots,4);assert.equal(b.snapshot().pendingVolleys,0);assert.ok(b.projectiles.every(p=>p.damage===38),'a queued volley keeps its original stats');
});
test('ordinary balls expire at eight seconds and fission children at three and a half, excluding pauses',()=>{
 const b=arena('orb');b.enemies=[enemy('walker',{y:500,hp:10000,maxHp:10000})];b.step();b.learned={};b.enemies=[];
 const p=b.projectiles[0];assert.equal(p.source,'weapon');p.vx=p.vy=0;stepsNoChoice(b,478);assert.ok(b.projectiles.includes(p));assert.ok(p.life>0&&p.life<.017);
 b.pause();const paused=b.snapshot();stepsNoChoice(b,120);assert.deepEqual(b.snapshot(),paused);b.resume();b.step();assert.equal(p.life,0);assert.equal(b.projectiles.length,0);
 const f=arena();f.upgrades['orb:wall-split']=1;f.projectiles=[orb(f,{x:159,px:159,remaining:0})];f.step();
 const child=f.projectiles.find(p=>p.source==='secondary')!;assert.ok(child);assert.equal(child.life,3.5);f.projectiles=[child];child.x=child.px=0;child.vx=child.vy=0;
 stepsNoChoice(f,209);assert.ok(f.projectiles.includes(child));f.phase='choice';const choice=f.snapshot();stepsNoChoice(f,60);assert.deepEqual(f.snapshot(),choice);f.phase='playing';f.step();assert.equal(child.life,0);assert.equal(f.projectiles.length,0);
});
test('ordinary ball repeat hits wait half a second per target without locking other targets',()=>{
 for(const source of ['weapon','secondary'] as const){
  const b=arena();b.enemies=[enemy('walker',{y:300,hp:10000,maxHp:10000}),enemy('walker',{id:2,y:300,hp:10000,maxHp:10000})];
  const p=orb(b,{source,vx:0,vy:0,remaining:10,mods:{...b.stats('orb'),crit:0,knock:0}});b.projectiles=[p];
  b.step();assert.deepEqual(p.hits,[1,2]);stepsNoChoice(b,29);assert.deepEqual(p.hits,[1,2]);
  b.pause();const paused=b.snapshot();stepsNoChoice(b,120);assert.deepEqual(b.snapshot(),paused);b.resume();
  b.step();assert.deepEqual(p.hits,[1,2,1,2]);assert.equal(b.damageDone,152);assert.equal(p.remaining,6);
 }
});
test('boundary reflections preserve the enemy redirect budget until the ball expires',()=>{
 for(const source of ['weapon','secondary'] as const){
  const small=source==='secondary',b=arena(),p=orb(b,{source,life:small?3.5:8,radius:small?7:10,vx:small?320*14/18:320});b.projectiles=[p];stepsNoChoice(b,small?180:360);
  assert.equal(p.remaining,3);assert.deepEqual(p.hits,[]);assert.ok(p.wallRebounds!>=(small?2:5));assert.ok(p.life>0);
  b.pause();const frozen=b.snapshot();stepsNoChoice(b,120);assert.deepEqual(b.snapshot(),frozen);b.resume();stepsNoChoice(b,small?30:120);assert.equal(b.projectiles.length,0);
 }
});
test('orb collision follows both wall segments and resolves the first circle surface',()=>{
 const b=arena();b.enemies=[enemy('walker',{x:169,y:300,radius:1,hp:10000,maxHp:10000})];
 const p=orb(b,{x:155,px:155,vx:600,remaining:0,mods:{...b.stats('orb'),crit:0,knock:0}});b.projectiles=[p];b.step();assert.deepEqual(p.hits,[1]);assert.ok(Math.abs(p.x-158)<1e-8,'contact occurs on the surface, not at the enemy center');assert.equal(p.wallRebounds??0,0,'the enemy is reached before the wall');
 const corner=arena();corner.enemies=[enemy('walker',{x:164.5,y:305,radius:.25,hp:10000,maxHp:10000})];
 const q=orb(corner,{x:164.5,px:164.5,y:300,py:300,radius:.5,vx:600,vy:600});corner.projectiles=[q];corner.step();assert.deepEqual(q.hits,[],'the chord between reflected endpoints is not a travelled path');assert.equal(q.wallRebounds,1);assert.equal(q.remaining,3);assert.ok(Math.abs(q.x-164.5)<1e-8&&Math.abs(q.y-310)<1e-8);
 const sizes=arena();sizes.enemies=[enemy('walker',{y:211,radius:1,hp:10000,maxHp:10000}),enemy('brute',{id:2,y:224,radius:20,hp:10000,maxHp:10000})];
 const r=orb(sizes,{x:0,px:0,y:200,py:200,radius:1,vx:0,vy:600,remaining:0,mods:{...sizes.stats('orb'),crit:0,knock:0}});sizes.projectiles=[r];sizes.step();assert.deepEqual(r.hits,[2],'the larger enemy surface is closer despite its farther center');assert.ok(Math.abs(r.y-203)<1e-8);assert.equal(sizes.enemies[0].hp,10000);
});
test('target redirects can reach a distant living enemy across the battlefield',()=>{
 const b=arena();b.enemies=[enemy('walker',{x:-120,y:200,hp:10000,maxHp:10000}),enemy('walker',{id:2,x:120,y:570,hp:10000,maxHp:10000})];
 const p=orb(b,{x:-160,px:-160,y:200,py:200,mods:{...b.stats('orb'),crit:0,knock:0}});b.projectiles=[p];until(b,()=>p.hits.length===1,30);assert.ok(p.vx>0&&p.vy>0);assert.equal(b.enemies[1].hp,10000);
 until(b,()=>p.hits.includes(2),180);assert.equal(b.enemies[1].hp,9962);
});
test('repeated wall contacts rate-limit their effects without consuming target redirects',()=>{
 const b=arena(undefined,{...defaultLoadout(),crit:0});b.upgrades['orb:wall-split']=1;b.upgrades['orb:wall-blast']=1;b.enemies=[enemy('walker',{x:140,y:340,hp:10000,maxHp:10000})];
 const p=orb(b,{x:159,px:159,y:300,py:300,damage:100});
 const wall=()=>{p.x=159;p.y=300;p.vx=320;p.vy=0;b.projectiles=[p];b.step();};
 wall();assert.equal(b.damageDone,80);assert.equal(b.projectiles.length,2);for(let n=0;n<29;n++)wall();assert.equal(b.damageDone,80);assert.equal(b.projectiles.length,1);
 wall();assert.equal(b.damageDone,160);assert.equal(b.projectiles.length,2);assert.equal(p.remaining,3);assert.equal(p.wallRebounds,31);
});
test('kinetic fission occurs on the fourth real contact and small balls can apply destruction stacks',()=>{
 const b=arena();b.upgrades['orb:split']=1;b.upgrades['orb:destroy']=1;b.enemies=[enemy('walker',{x:-70,y:300,hp:100000,maxHp:100000}),enemy('walker',{id:2,x:80,y:320,hp:100000,maxHp:100000})];
 const p=orb(b,{x:-100,px:-100,remaining:8});b.projectiles=[p];until(b,()=>p.hits.length===3,180);assert.equal(b.projectiles.length,1);
 until(b,()=>p.hits.length===4,90);const child=b.projectiles.find(p=>p.source==='secondary')!;assert.ok(child);assert.equal(child.hits.length,0,'newly spawned children wait until the next frame');
 b.projectiles=[child];const before=b.enemies.reduce((sum,e)=>sum+e.fractures,0);until(b,()=>child.hits.length===1,120);assert.equal(b.enemies.reduce((sum,e)=>sum+e.fractures,0),before+1);
});
test('cripple expires, enraged enemies resist it, and vulnerability stacks have an independent cap and timer',()=>{
 const run=(rage:boolean)=>{const b=arena();b.upgrades['orb:cripple']=1;b.upgrades['orb:destroy']=1;b.enemies=[enemy(rage?'butcher':'walker',{y:300,hp:100000,maxHp:100000,speed:20,age:rage?26:0})];b.projectiles=[orb(b,{x:-20,px:-20,remaining:0})];b.step();return b;};
 const b=run(false),rage=run(true);assert.equal(b.enemies[0].orbSlowPower,.9);assert.equal(rage.enemies[0].orbSlowPower,0);assert.equal(b.enemies[0].fractures,1);
 stepsNoChoice(b,31);assert.equal(b.enemies[0].orbSlowPower,0);assert.equal(b.enemies[0].fractures,1);
 for(let n=0;n<25;n++){const e=b.enemies[0];b.projectiles=[orb(b,{x:e.x-20,y:e.y,remaining:0,mods:{...b.stats('orb'),knock:0,crit:0}})];b.step();}
 assert.equal(b.enemies[0].fractures,20);stepsNoChoice(b,181);assert.equal(b.enemies[0].fractures,0);assert.equal(b.enemies[0].fractureTime,0);
});

function luckyCast(seed=41,upgrades:Record<string,number>={}){
 const b=arena('orb',{...defaultLoadout(),crit:0},seed);b.upgrades={...upgrades};b.enemies=[enemy('butcher',{age:30,hp:1000000,maxHp:1000000})];
 // Isolate the cast event from cooldown tuning. Runtime flows retain real cooldowns.
 for(let n=0;n<b.luckyProgress.required;n++){b.cooldowns.orb=0;b.step();}
 assert.equal(b.luckyProgress.triggers,1);const p=b.projectiles.find(p=>p.source==='lucky')!;assert.ok(p);return {b,p};
}
test('lucky balls count cooldown casts, not simultaneous shots, delayed volleys or fission',()=>{
 const b=arena('orb',{...defaultLoadout(),crit:0});b.upgrades={'orb:repeat':1,'orb:salvo':1,'orb:split':1};b.enemies=[enemy('butcher',{age:30,hp:1000000,maxHp:1000000})];
 until(b,()=>b.luckyProgress.casts===5,1921);assert.equal(b.tick,1921);assert.equal(b.luckyProgress.triggers,0);assert.equal(b.luckyProgress.charge,5);assert.ok(b.shots>b.luckyProgress.casts*2);
 b.pause();const paused=b.snapshot();stepsNoChoice(b,120);assert.deepEqual(b.snapshot(),paused);b.resume();
 stepsNoChoice(b,479);assert.equal(b.luckyProgress.triggers,0);b.step();assert.equal(b.tick,2401);assert.equal(b.luckyProgress.triggers,1);assert.equal(b.luckyProgress.casts,6);assert.equal(b.luckyProgress.charge,0);
 assert.equal(b.projectiles.filter(p=>p.source==='lucky').length,1);const copy=b.snapshot();copy.luckyProgress.charge=999;assert.equal(b.luckyProgress.charge,0);
});
test('three lucky qualities replay deterministically, and ordinary card bonuses do not leak into them',()=>{
 const seen=new Set();
 for(let seed=1;seed<=160;seed++){
  const mixed=Math.imul(seed,0x9e3779b1)>>>0,a=luckyCast(mixed),b=luckyCast(mixed);assert.deepEqual(a.b.snapshot(),b.b.snapshot());seen.add(a.p.quality);
  assert.equal(a.p.damage,190);assert.equal(a.p.source,'lucky');assert.equal(a.p.quality,a.b.luckyProgress.quality);
 }
 assert.deepEqual([...seen].sort(),['high','low','mid']);
 const plain=luckyCast(),power=luckyCast(41,{'orb:power':3,'orb:armed':1,'orb:rain':1,'orb:high-repeat':1,'orb:cripple':1,'orb:hinder':1});
 assert.equal(power.p.damage,plain.p.damage);assert.equal(power.p.radius,plain.p.radius);assert.ok(Math.abs(Math.hypot(power.p.vx,power.p.vy)-Math.hypot(plain.p.vx,plain.p.vy))<1e-8);assert.equal(power.b.luckyProgress.spawned,1);
});
test('lucky preparation cannot move or hit; flight pierces, respects armor and expires',()=>{
 const {b,p}=luckyCast();b.learned={};b.projectiles=[p];p.quality='low';p.prepare=2.8;p.x=p.px=0;p.y=p.py=200;p.vx=0;p.vy=280;
 b.enemies=[enemy('walker',{y:260,hp:10000,maxHp:10000}),enemy('armor',{id:2,y:320,hp:10000,maxHp:10000})];const initialDamage=b.damageDone;
 stepsNoChoice(b,168);assert.equal(p.y,200);assert.equal(b.damageDone,initialDamage);assert.ok(p.prepare!<1e-8);
 b.pause();const paused=b.snapshot();stepsNoChoice(b,120);assert.deepEqual(b.snapshot(),paused);b.resume();
 until(b,()=>p.hits.length===2,80);assert.deepEqual(p.hits,[1,2]);assert.equal(b.enemies[0].hp,9810);assert.ok(Math.abs(b.enemies[1].hp-(10000-190*.35))<1e-8);assert.equal(p.vy,280);
 until(b,()=>p.rebounds!>0,150);assert.equal(p.vy,-280);assert.ok(p.life>0,'walls reflect without consuming the ordinary rebound budget');
 until(b,()=>b.projectiles.length===0,400);assert.ok(b.luckyProgress.hits>=2);assert.equal(b.luckyProgress.triggers,1);
});
test('mid and high lucky hits spawn real nonrecursive light damage; high adds a bounded explosion',()=>{
 for(const quality of ['low','mid','high'] as const){
  const {b,p}=luckyCast();b.learned={};b.projectiles=[p];p.quality=quality;p.prepare=0;p.x=p.px=-36;p.y=p.py=300;p.vx=600;p.vy=0;
  b.upgrades={'orb:split':1,'orb:wall-split':1,'orb:armed':1,'orb:cripple':1,'orb:hinder':1};
  b.enemies=[enemy('walker',{y:300,hp:10000,maxHp:10000}),enemy('walker',{id:2,x:45,y:300,hp:10000,maxHp:10000})];
  b.step();assert.equal(p.hits.length,1);assert.equal(b.luckyProgress.lights,quality==='low'?0:1);assert.equal(b.luckyProgress.bursts,quality==='high'?1:0);
  assert.equal(b.enemies[0].hp,10000-190-(quality==='high'?152:0));assert.equal(b.enemies[1].hp,10000-(quality==='high'?152:0));assert.equal(b.enemies[0].hinder,0);assert.equal(b.enemies[0].orbSlow,0);
  const light=b.projectiles.find(p=>p.source==='lucky-light');
  if(light){
   assert.equal(light.hits.length,0);assert.equal(light.damage,152);b.projectiles=[light];light.x=light.px=-26;light.y=light.py=300;light.vx=600;light.vy=0;const before=b.enemies[0].hp;
   until(b,()=>light.hits.length>0,5);assert.equal(b.enemies[0].hp,before-152);assert.equal(b.luckyProgress.lights,1);assert.equal(b.luckyProgress.bursts,quality==='high'?1:0);
   until(b,()=>b.projectiles.length===0,180);
  }
 }
});
test('repeat contacts respect half-second damage and three-second derivative intervals',()=>{
 const {b,p}=luckyCast();b.learned={};p.quality='mid';p.prepare=0;p.x=p.px=0;p.y=p.py=300;p.vx=p.vy=0;b.projectiles=[p];b.enemies=[enemy('walker',{y:300,hp:100000,maxHp:100000})];
 b.step();assert.equal(p.hits.length,1);assert.equal(b.luckyProgress.lights,1);stepsNoChoice(b,29);assert.equal(p.hits.length,1);b.step();assert.equal(p.hits.length,2);
 stepsNoChoice(b,149);assert.equal(b.luckyProgress.lights,1);b.step();assert.equal(b.luckyProgress.lights,2);assert.equal(b.luckyProgress.triggers,1);
});
test('lucky evolution effects change count, size, cast threshold and real wall explosions',()=>{
 const plain=luckyCast(),tide=luckyCast(41,{'orb:tide':1}),large=luckyCast(41,{'orb:ultimate':1}),fast=luckyCast(41,{'orb:destroy':1}),cycle=luckyCast(41,{'orb:cycle':1,'orb:wall-blast':1});
 assert.equal(tide.b.luckyProgress.spawned,2);assert.equal(tide.b.luckyProgress.casts,6);assert.equal(large.p.radius,plain.p.radius*1.15);assert.equal(large.p.damage,190);
 assert.equal(fast.b.luckyProgress.casts,5);assert.equal(fast.b.luckyProgress.required,5);assert.equal(fast.b.luckyProgress.charge,0);
 const {b,p}=cycle;b.learned={};b.projectiles=[p];p.quality='low';p.prepare=0;p.x=p.px=FIELD.halfWidth-p.radius-.1;p.y=p.py=350;p.vx=120;p.vy=0;b.enemies=[enemy('walker',{x:p.x-10,y:395,hp:10000,maxHp:10000})];
 b.step();assert.equal(b.enemies[0].hp,10000-114);assert.equal(p.hits.length,0);assert.equal(b.luckyProgress.bursts,1);assert.ok(p.vx<0);
 assert.equal(p.damage,190);assert.equal(b.events.at(-1)?.quality,'low');
});
test('lucky derivatives respect the shared projectile limit and all expire',()=>{
 const {b,p}=luckyCast();b.learned={};p.quality='high';p.prepare=0;p.x=p.px=0;p.y=p.py=300;p.vx=p.vy=0;
 b.enemies=[enemy('walker',{y:300,hp:100000,maxHp:100000})];b.projectiles=[p,...Array.from({length:LIMITS.projectiles-1},(_,i)=>({...p,id:i+500,source:'lucky-light' as const,quality:undefined,x:150,px:150,y:600,py:600,hits:[],hitTimes:{}}))];
 b.step();assert.equal(b.projectiles.length,LIMITS.projectiles);assert.equal(b.luckyProgress.lights,0);assert.equal(b.luckyProgress.bursts,1);
 stepsNoChoice(b,310);assert.equal(b.projectiles.length,0);assert.ok(b.events.length<=LIMITS.events);
});

