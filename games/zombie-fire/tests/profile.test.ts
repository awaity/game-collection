import test from 'node:test';
import assert from 'node:assert/strict';
import {Armory,fresh,normalize,daySeed,SLOTS} from '../assets/scripts/profile';
import {Battle} from '../assets/scripts/core';
import {Session} from '../assets/scripts/session';
const today='2026-10-19';
const profile=()=>{const p=fresh(today);p.coins=10000;p.scrap=500;p.diamonds=100;return p;};
const armory=(p:unknown=profile())=>new Armory(p,()=>true,()=>today);

test('malformed and duplicated inventory cannot create aliases or repeated equipped bonuses',()=>{
 const p=profile();p.gems=[{id:1,type:'power',grade:0},{id:1,type:'power',grade:5},{id:1e15,type:'power',grade:5},{id:1e14,type:'power',grade:5}];p.gear.weapon.gems=[1,1,1,1,1];p.gear.helmet.gems=[1,1,1,1,1];
 const a=armory(p);assert.equal(a.data.gems.length,1);assert.equal(SLOTS.flatMap(s=>a.data.gear[s].gems).filter(Boolean).length,1);assert.equal(a.loadout().damage,1.015);assert.equal(normalize({version:9}).coins,0);
});
test('unknown and inherited property names cannot enter the mercenary team',()=>{
 const p=profile();p.mercs.storm=2;p.team=['constructor','__proto__','unknown','storm','storm'];const a=armory(p);assert.deepEqual(a.data.team,['storm']);assert.deepEqual(a.loadout().mercenaries,['storm']);
});
test('save failures and thrown storage exceptions roll back purchases and all rewards',()=>{
 for(const save of [()=>false,()=>{throw Error('quota')}]){const a=new Armory(profile(),save,()=>today),before=structuredClone(a.data);assert.equal(a.upgradeBase('weapon'),false);assert.deepEqual(a.data,before);assert.equal(a.checkin(),false);assert.deepEqual(a.data,before);assert.equal(a.chest(true),false);assert.deepEqual(a.data,before);assert.match(a.message,/未扣款/);}
});
test('daily checkin/chest cannot repeat or reopen when the local date moves backward',()=>{
 let day=today;const a=new Armory(null,()=>true,()=>day);assert.equal(a.checkin(),true);assert.equal(a.checkin(),false);assert.equal(a.chest(true),true);assert.equal(a.chest(true),false);assert.equal(a.data.coins,175);
 day='2026-10-20';assert.equal(a.checkin(),true);assert.equal(a.data.streak,2);assert.equal(a.chest(true),true);const balance=a.data.coins;day='2026-10-18';assert.equal(a.checkin(),false);assert.equal(a.chest(true),false);assert.equal(a.data.coins,balance);assert.equal(a.currentDay(),'2026-10-20');
});
test('base, gear, research, and mercenary upgrades all enter the combat loadout',()=>{
 const a=armory(),before=a.loadout();assert.equal(a.upgradeBase('weapon'),true);assert.equal(a.upgradeBase('wall'),true);assert.equal(a.upgradeGear('gloves'),true);assert.equal(a.research('thermo'),true);assert.equal(a.mercenary('storm'),true);assert.equal(a.mercenary('storm',true),true);assert.equal(a.mercenary('storm'),true);
 const after=a.loadout();assert.ok(after.damage>before.damage);assert.ok(after.health>before.health);assert.equal(after.mercenaryLevels.storm,2);assert.equal(after.research.thermo,1);assert.ok(new Battle(0,'campaign',1,after).stats('thermo').damage>new Battle().stats('thermo').damage);
});
test('research variant unlock is atomic, persists, and applies only to later battles',()=>{
 assert.deepEqual(normalize(fresh(today),today).research,fresh(today).research,'fresh and reloaded profiles have the same zero-level research entries');
 let writable=true,saved:unknown;const a=new Armory(profile(),p=>{if(!writable)return false;saved=structuredClone(p);return true;},()=>today);
 for(let n=0;n<5;n++)assert.equal(a.research('orb'),true);
 const entered=new Battle(0,'campaign',1,a.loadout());entered.learned={orb:1};
 const before=structuredClone(a.data);writable=false;assert.equal(a.research('orb'),false);assert.deepEqual(a.data,before);writable=true;
 assert.equal(a.research('orb'),true);assert.equal(a.data.research.orb,6);assert.equal(a.data.coins,before.coins-500);assert.equal(a.data.scrap,before.scrap-15);
 const restored=new Armory(saved,()=>true,()=>today),next=new Battle(0,'campaign',1,restored.loadout());next.learned={orb:1};
 assert.equal(entered.availableCards().find(c=>c.id==='orb:rise')!.name,'升维');assert.equal(next.availableCards().find(c=>c.id==='orb:rise')!.name,'升维+');
});
test('equipment tiers, research caps, and locked purchases reject without losing currency',()=>{
 const a=armory();assert.equal(a.upgradeGear('weapon',true),false);assert.equal(a.data.coins,10000);for(let i=0;i<5;i++)assert.equal(a.upgradeGear('weapon'),true);assert.equal(a.upgradeGear('weapon',true),true);assert.equal(a.data.gear.weapon.tier,1);
 const p=profile();p.research.thermo=10;p.weapon=30;const capped=armory(p);assert.equal(capped.research('thermo'),false);assert.equal(capped.upgradeBase('weapon'),false);assert.equal(capped.data.coins,10000);
});
test('gems move without duplication; only three unequipped matching gems can merge',()=>{
 const p=profile();p.gems=[1,2,3,4].map(id=>({id,type:'power',grade:0}));p.gemSerial=4;const a=armory(p);a.equip('weapon',0,1);a.equip('helmet',2,1);assert.equal(a.data.gear.weapon.gems[0],null);assert.equal(a.data.gear.helmet.gems[2],1);
 assert.equal(a.merge(2),true);assert.equal(a.data.gems.length,2);assert.equal(a.data.gems.find(g=>g.id===5)?.grade,1);assert.equal(a.data.gear.helmet.gems[2],1);assert.equal(a.merge(1),false);assert.equal(a.equip('weapon',5,1),false);assert.equal(a.equip('weapon',0,99),false);
});
test('owned skins equip without repeated charges and teams are limited to two',()=>{
 const a=armory();a.skin('arc');const coins=a.data.coins;a.skin('arc');assert.equal(a.data.coins,coins);assert.equal(a.data.skin,'arc');assert.equal(a.skin('unknown'),false);
 for(const id of ['engineer','flame','frost'])a.mercenary(id);assert.equal(a.mercenary('engineer',true),true);assert.equal(a.mercenary('flame',true),true);assert.equal(a.mercenary('frost',true),false);a.mercenary('engineer',true);assert.equal(a.mercenary('frost',true),true);
});
test('diamond supply spends earned diamonds and publishes the same quality guarantee',()=>{
 const a=armory();assert.equal(a.chest(false,true),true);assert.equal(a.data.diamonds,60);assert.ok(a.data.gems[0].grade>=2);assert.equal(a.data.scrap,516);
 const empty=armory(fresh(today));assert.equal(empty.chest(false,true),false);assert.equal(empty.data.gems.length,0);
});
test('checkpoints award only deltas; old runs and repeated finalization cannot mint coins',()=>{
 const a=armory(fresh(today)),id=a.begin(0,'campaign'),b=new Battle();b.start();b.kills=10;b.wave=2;
 assert.equal(a.checkpoint(id,b),true);assert.equal(a.data.coins,40);a.checkpoint(id,b);assert.equal(a.data.coins,40);b.kills=13;a.checkpoint(id,b);assert.equal(a.data.coins,46);
 b.phase='won';b.wave=8;b.time=300;b.bossKills=2;a.checkpoint(id,b);const saved=structuredClone(a.data);assert.equal(a.checkpoint(id,b),false);assert.deepEqual(a.data,saved);assert.equal(a.data.unlocked,2);assert.equal(a.data.stars[0],3);
 const next=a.begin(1,'campaign');assert.ok(next>id);assert.equal(a.checkpoint(id,b),false);assert.equal(a.checkpoint(next,b),false);
});
test('failed reward writes can be retried exactly once and do not spin every frame',()=>{
 let writable=true,writes=0;const a=new Armory(null,()=>{writes++;return writable;},()=>today),s=new Session(a);s.begin();s.battle.kills=9;s.battle.phase='lost';writable=false;s.step();assert.equal(s.saveFailed,true);const attempts=writes;for(let i=0;i<300;i++)s.step();assert.equal(writes,attempts);assert.equal(a.data.coins,0);
 writable=true;assert.equal(s.checkpoint(),true);assert.equal(a.data.coins,18);const balance=a.data.coins;assert.equal(s.checkpoint(),true);assert.equal(a.data.coins,balance);assert.equal(s.saveFailed,false);
});
test('quest claims are idempotent and daily resets preserve achievements',()=>{
 let day=today;const p=profile();p.daily.kills=120;p.totals.wins=1;const a=new Armory(p,()=>true,()=>day);assert.equal(a.claim('daily-kills'),true);assert.equal(a.claim('daily-kills'),false);assert.equal(a.claim('first-victory'),true);assert.equal(a.claim('first-victory'),false);
 day='2026-10-20';a.checkin();assert.deepEqual(a.data.claimed,[]);assert.equal(a.data.daily.kills,0);assert.deepEqual(a.data.achievements,['first-victory']);
});
test('daily seeds follow the injected calendar and survive save/reload without spending changes',()=>{
 const a=armory(),s=new Session(a);s.begin(0,'daily');assert.equal(s.battle.seed,daySeed(today));s.home();s.begin(0,'daily');assert.equal(s.battle.seed,daySeed(today));s.home();
 a.skin('ember');a.setting('sound');const restored=armory(JSON.parse(JSON.stringify(a.data)));assert.deepEqual(restored.data,a.data);assert.equal(restored.data.settings.sound,false);
});
