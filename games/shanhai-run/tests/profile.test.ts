import test from 'node:test';
import assert from 'node:assert/strict';
import {Journey,normalizeProfile,freshProfile,daySeed,QUESTS} from '../assets/scripts/profile';
import {Run,pilot} from '../assets/scripts/core';
const journey=(raw:unknown=freshProfile('2026-10-19'))=>new Journey(raw,()=>true,()=> '2026-10-19');
test('check-in and purchases are transactional, persist and do not double-charge owned skins',()=>{
 let saved:unknown;const j=new Journey(null,p=>(saved=JSON.parse(JSON.stringify(p)),true),()=> '2026-10-19');
 assert.ok(j.checkin());assert.equal(j.data.coins,100);assert.equal(j.checkin(),false);assert.ok(j.upgrade('magnet'));assert.equal(j.data.coins,0);
 const reloaded=journey(saved);assert.equal(reloaded.data.upgrades.magnet,1);assert.equal(reloaded.checkin(),false);
 const fixture=freshProfile('2026-10-19');fixture.coins=1200;const shop=journey(fixture);
 assert.ok(shop.buySkin('fox'));assert.equal(shop.data.coins,840);shop.buySkin('traveler');shop.buySkin('fox');assert.equal(shop.data.coins,840);
 const equipped=journey(JSON.parse(JSON.stringify(shop.data)));assert.equal(equipped.data.skin,'fox');assert.deepEqual(equipped.data.owned,['traveler','fox']);
});
test('blocked storage rolls back rewards, upgrades and appearance',()=>{
 const fixture=freshProfile('2026-10-19');fixture.coins=1000;const j=new Journey(fixture,()=>false,()=> '2026-10-19'),before=JSON.stringify(j.data);
 assert.equal(j.checkin(),false);assert.equal(j.buySkin('fox'),false);assert.equal(j.upgrade('wind'),false);assert.equal(JSON.stringify(j.data),before);
});
test('run checkpoints award only deltas and ignore stale sessions',()=>{
 const j=journey(),run=new Run();run.start();const id=j.begin('endless');
 for(let n=0;n<1000;n++){pilot(run);run.step();}assert.ok(j.checkpoint(id,run));assert.ok(j.data.coins>0);
 const paid=j.data.coins,total=j.data.totals.distance;j.checkpoint(id,run);assert.equal(j.data.coins,paid);assert.equal(j.data.totals.distance,total);
 const reload=journey(JSON.parse(JSON.stringify(j.data)));reload.checkpoint(id,run);assert.equal(reload.data.coins,paid);
 reload.begin('endless');assert.equal(reload.checkpoint(id,run),false);assert.equal(reload.data.coins,paid);
});
test('legal trial clear grants first-clear rewards once and unlocks the next trial',()=>{
 const j=journey(),run=new Run({mode:'trial'});run.start();const id=j.begin('trial');
 while(run.phase==='running'){pilot(run);run.step();}assert.equal(run.phase,'won');j.checkpoint(id,run);
 assert.equal(j.data.unlocked,2);assert.equal(j.data.stars[0],3);assert.equal(j.data.totals.wins,1);
 assert.equal(j.data.coins,run.stats.coins+250);const balance=j.data.coins;assert.equal(j.checkpoint(id,run),false);assert.equal(j.data.coins,balance);
 const second=j.begin('trial');j.checkpoint(second,run);assert.equal(j.data.coins,balance+run.stats.coins+100);
});
test('date rollover resets daily goals while preserving achievements and resisting clock rollback',()=>{
 let day='2026-10-19';const j=new Journey(null,()=>true,()=>day);j.checkin();day='2026-10-20';j.checkin();assert.equal(j.data.streak,2);assert.equal(j.data.coins,225);
 day='2026-10-19';assert.equal(j.checkin(),false);assert.equal(j.data.coins,225);
 const fixture=freshProfile('2026-10-19');fixture.claimed=['daily-jade'];fixture.achievements=['first-escape'];fixture.daily.coins=100;
 const p=normalizeProfile(fixture,'2026-10-20');assert.deepEqual(p.claimed,[]);assert.equal(p.daily.coins,0);assert.deepEqual(p.achievements,['first-escape']);
});
test('quest claims survive reloading and reject duplicate claims',()=>{
 const fixture=freshProfile('2026-10-19');for(const q of QUESTS)(q.daily?fixture.daily:fixture.totals)[q.metric]=q.target;
 const j=journey(fixture);for(const q of QUESTS)assert.ok(j.claim(q.id));const balance=j.data.coins;
 const reload=journey(JSON.parse(JSON.stringify(j.data)));for(const q of QUESTS)assert.equal(reload.claim(q.id),false);assert.equal(reload.data.coins,balance);
});
test('invalid saves are bounded and deterministic daily seeds change by date',()=>{
 const p=normalizeProfile({version:1,coins:Infinity,unlocked:-30,owned:['invalid','traveler'],skin:'invalid',upgrades:{wind:99}});
 assert.equal(p.coins,0);assert.equal(p.unlocked,1);assert.equal(p.skin,'traveler');assert.equal(p.upgrades.wind,5);
 assert.equal(daySeed('2026-10-19'),daySeed('2026-10-19'));assert.notEqual(daySeed('2026-10-19'),daySeed('2026-10-20'));
});
