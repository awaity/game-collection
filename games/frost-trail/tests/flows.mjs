import assert from 'node:assert/strict';
export async function verify({p,native,state,click,advance,event,fits,capture}){
 async function find(id){for(let i=0;i<30;i++){const s=await state();if(s.controls.some(b=>b.id===id))return;if(!s.controls.some(b=>b.id==='page-next'))break;await click('page-next')}throw Error('Cannot find '+id)}
 async function choose(id){await find(id);await click(id);await fits()}
 async function menu(panel){const s=await state();if(s.panel){if(s.panel!=='menu')await click('panel-back')}else await click('pause');if(panel)await choose(panel)}
 await fits();assert.equal((await state()).phase,'playing');await capture('initial');
 await advance(0);await click('quest-guide');await advance(300);assert.ok((await state()).inventory.includes('wood'),'wood actually harvested');assert.ok((await state()).cash>=20);await fits();
 await click('quest-guide');await advance(480);assert.ok((await state()).inventory.includes('raw'),'real raw harvest');
 await click('quest-guide');await advance(420);assert.ok((await state()).inventory.includes('cooked'),'raw cooks with wood fuel');
 await click('quest-guide');await advance(360);assert.ok((await state()).sold>=5,'travellers buy food');assert.ok((await state()).cash>=160,'counter cash collected');await capture('economy');
 await menu('upgrades');await choose('build-hunters');await advance(300);assert.equal((await state()).purchases.hunters,true);
 await menu('upgrades');await choose('build-woodcutters');await advance(360);assert.equal((await state()).purchases.woodcutters,true);
 await menu('upgrades');await choose('build-rawBelt');await advance(300);assert.equal((await state()).purchases.rawBelt,true);
 await menu('upgrades');await choose('build-woodBelt');await advance(300);assert.equal((await state()).purchases.woodBelt,true);
 await menu('staff');await choose('hire-seller');await choose('hire-cashier');assert.equal((await state()).staff.seller.hired,true);assert.equal((await state()).staff.cashier.hired,true);await click('panel-back');await click('panel-back');await advance(3600);const working=await state();assert.ok(working.sold>5);assert.ok(working.renderObjects<30000,'bounded scene nodes');await capture('automation');
 await menu();const before=await state();await advance(120);assert.equal((await state()).tick,before.tick,'pause stops all clocks');
 for(const tab of['routes','era','factions','supply','powers','events','endgame','help']){await menu(tab);for(let i=0;i<3;i++){await fits();if(!(await state()).controls.some(b=>b.id==='page-next'))break;await click('page-next')}await click('panel-back')}
 await menu('powers');await choose('power-harvest');assert.equal((await state()).powerUses.harvest,1,'real power action');await click('panel-back');
 await menu('settings');await choose('setting-sound');assert.equal((await state()).sound,false);await choose('quality');assert.equal((await state()).quality,'low');await choose('camera');assert.equal((await state()).classic,true);await choose('save');await click('panel-back');await click('panel-back');await capture('settings-applied');
 if(native){await event('Hide');await event('Show');assert.equal((await state()).phase,'paused');await click('panel-back')}else{await p.reload();await p.waitForFunction(()=>window.__collectionSnapshot?.phase==='playing');assert.equal((await state()).sound,false);assert.equal((await state()).quality,'low');assert.equal((await state()).classic,true);assert.ok((await state()).purchases.woodBelt)}
 await fits();return['finite-resource-harvest','cooking-fuel','sales-and-real-cash','workers','belts','counter-staff','pause','all-management-panels','power-action','settings','save-or-lifecycle'];
}
