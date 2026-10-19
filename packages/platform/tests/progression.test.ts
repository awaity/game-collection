import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Career,normalizeCareer} from '../src/progression';
test('checkpoint rewards survive reload and repeated result callbacks without double credit',()=>{
 let saved:unknown;const c=new Career(null,v=>{saved=structuredClone(v);return true});const id=c.begin('stage');
 assert.equal(c.checkpoint(id,{kills:10,seconds:30,clear:'0'}),270);
 assert.equal(c.checkpoint(id,{kills:10,seconds:30,clear:'0'}),0);
 const reload=new Career(saved,()=>true);assert.equal(reload.checkpoint(id,{kills:10,seconds:30,clear:'0'}),0);
 assert.equal(reload.checkpoint(id,{kills:15,seconds:35}),10);assert.equal(reload.data.coins,280);
 const next=reload.begin('stage');assert.equal(reload.checkpoint(id,{kills:10000,seconds:600}),0);
 assert.equal(reload.checkpoint(next,{kills:0,seconds:20,clear:'0'}),100);
});
test('endless earns double kills and progressive wave bonuses, with task and achievement claims once',()=>{
 const c=new Career(null,()=>true);const run=c.begin('endless');
 assert.equal(c.checkpoint(run,{kills:60,seconds:180,waves:3}),720);
 assert.equal(c.claim('daily-waves'),true);assert.equal(c.claim('daily-waves'),false);
 assert.equal(c.claim('daily-kills'),true);assert.equal(c.data.coins,1080);
});
test('daily check-in rolls over once, consecutive streaks and clock rollback cannot duplicate',()=>{
 let date=new Date(2026,9,19,12);const c=new Career(null,()=>true,()=>date);
 assert.equal(c.checkIn(),true);assert.equal(c.data.coins,125);assert.equal(c.checkIn(),false);
 date=new Date(2026,9,20,12);assert.equal(c.checkIn(),true);assert.equal(c.data.coins,275);
 date=new Date(2026,9,19,12);assert.equal(c.checkIn(),false);
 date=new Date(2026,9,22,12);assert.equal(c.checkIn(),true);assert.equal(c.data.streak,1);
});
test('purchases debit once; equipping is free; upgrades have costs and a hard maximum',()=>{
 const c=new Career({...normalizeCareer(null),coins:10000},()=>true);
 assert.equal(c.buySkin('sunrise'),true);assert.equal(c.data.coins,9820);
 c.buySkin('classic');c.buySkin('sunrise');assert.equal(c.data.coins,9820);
 for(let i=0;i<5;i++)assert.equal(c.upgrade('power'),true);
 assert.equal(c.upgrade('power'),false);assert.equal(c.buffs.damage,1.6);
 assert.equal(new Career(null,()=>true).buySkin('mint'),false);
});
test('storage failures roll back purchases and rewards; damaged saves do not crash',()=>{
 const c=new Career({...normalizeCareer(null),coins:500},()=>false);
 assert.equal(c.buySkin('sunrise'),false);assert.equal(c.data.coins,500);assert.deepEqual(c.data.owned,['classic']);
 assert.equal(c.begin('endless'),0);assert.equal(c.checkIn(),false);
 for(const raw of [null,'bad',{version:1,totals:null,upgrades:{power:Infinity},coins:-50,owned:['unknown'],skin:'ember'}]){
 const p=normalizeCareer(raw);assert.equal(p.coins,0);assert.equal(p.skin,'classic');assert.equal(p.upgrades.power,0);
 }
});
test('serialized reload preserves equipped purchases, claimed rewards and first-clear history',()=>{
 let saved='';const write=(v:unknown)=>{saved=JSON.stringify(v);return true;};
 const first=new Career({...normalizeCareer(null),coins:1000},write);
 first.buySkin('orchid');first.upgrade('power');const run=first.begin('stage');
 first.checkpoint(run,{kills:60,seconds:180,clear:'5'});first.claim('daily-kills');first.claim('first-win');
 const c=new Career(saved,write),before=c.data.coins;
 assert.equal(c.skin.id,'orchid');assert.deepEqual(c.data.owned,['classic','orchid']);assert.equal(c.buffs.damage,1.12);
 assert.equal(c.claim('daily-kills'),false);assert.equal(c.claim('first-win'),false);assert.equal(c.data.coins,before);
 assert.equal(c.checkpoint(run,{kills:60,seconds:180,clear:'5'}),0);
 assert.equal(c.checkpoint(c.begin('stage'),{kills:0,seconds:20,clear:'5'}),100);
});
