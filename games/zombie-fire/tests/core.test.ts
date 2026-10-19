import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle,DT,FIELD,LIMITS,defaultLoadout,segmentDistance,type Enemy,type Loadout} from '../assets/scripts/core';
import {ENEMIES,SKILLS,STAGES,UPGRADES,enemyById,type EnemyId,type SkillId,type SkinId} from '../assets/scripts/content';
import {Armory} from '../assets/scripts/profile';
import {Session} from '../assets/scripts/session';

function enemy(kind:EnemyId='walker',patch:Partial<Enemy>={}):Enemy {
 const def=enemyById[kind];
 return {id:1,kind,x:0,y:270,hp:def.hp,maxHp:def.hp,shield:0,speed:0,radius:def.radius,attack:999,ability:999,warning:0,burn:0,burnPower:0,freeze:0,stun:0,wound:0,vulnerable:0,age:0,child:false,...patch};
}
// Isolated fixtures exercise collision and status rules. Full victories below use only public inputs.
function arena(skill?:SkillId,loadout:Loadout=defaultLoadout()) {
 const b=new Battle(0,'campaign',41,loadout);b.phase='playing';b.wave=1;b.spawnClock=999;b.waveQuota=999;
 b.learned=skill?{[skill]:1}:{};return b;
}
function steps(b:Battle,count:number){for(let n=0;n<count;n++){if(b.phase==='choice')b.choose(b.cards[0].id);b.step();}}
function legalSession(seed=71,mode:'campaign'|'endless'|'daily'='campaign'){
 const a=new Armory(null,()=>true,()=> '2026-10-19'),s=new Session(a);assert.equal(s.begin(0,mode,seed),true);return s;
}

test('fixed-step runs are deterministic and exposed snapshots do not mutate rules',()=>{
 const a=legalSession(),b=legalSession();a.play(12000);b.play(12000);assert.deepEqual(a.battle.snapshot(),b.battle.snapshot());
 const copy=a.battle.snapshot();copy.learned.rifle=99;copy.upgrades.fake=99;assert.notEqual(a.battle.learned.rifle,99);assert.equal(a.battle.upgrades.fake,undefined);
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

