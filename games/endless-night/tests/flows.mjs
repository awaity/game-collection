import assert from 'node:assert/strict';
export async function verify({p,native,state,click,advance,event,fits,capture}){
 async function find(id){for(let i=0;i<30;i++){const s=await state();if(s.controls.some(b=>b.id===id))return;if(!s.controls.some(b=>b.id==='page-next'))break;await click('page-next')}throw Error('Cannot find '+id)}
 async function choose(id){await find(id);await click(id);await fits()}
 async function ready(){for(let i=0;i<200;i++){const s=await state();if(s?.phase!=='loading'&&s?.controls?.length)return s;await p.waitForTimeout(60)}throw Error('Scene failed to load')}
 await ready();await fits();await choose('calm-start');assert.equal((await state()).settings.calm,true);await capture('menu');
 for(const panel of['help','deeds','journal','hearth','shop']){await choose(panel);await fits();if((await state()).controls.some(b=>b.id==='page-next')){await click('page-next');await fits()}await choose('back')}
 await choose('settings');await choose('setting-master');await choose('quality');const settings=(await state()).settings;assert.equal(settings.quality,'ultra');await choose('back');
 await choose('play');await choose('story-next');assert.equal((await state()).screen,'heroes');await choose('heroes-next');await choose('stages-next');await choose('begin');await ready();await advance(0);assert.equal((await state()).phase,'play');await capture('battle');
 const start=await state();
 if(native){await event('TouchStart',100,460);await event('TouchMove',150,460);await advance(90);await event('TouchEnd',150,460)}else{await p.keyboard.down('ArrowRight');await p.waitForTimeout(200);await advance(90);await p.keyboard.up('ArrowRight')}
 assert.ok((await state()).player.x>start.player.x+15,'real movement through Rapier');await choose('active');await advance(2);assert.ok((await state()).activeCd>0,'hero skill consumes cooldown');
 await choose('pause');const paused=(await state()).frame;await advance(120);assert.equal((await state()).frame,paused);await choose('equipment');await choose('back');await choose('resume');
 let cards=0;for(let i=0;i<16;i++){let s=await advance(240);if(s.runPhase==='levelup'){await fits();if(!cards)await capture('upgrade');await choose('card-0');cards++}if(s.runPhase==='chest')await choose('chest-ok');if(s.phase==='result')break}
 const battle=await state();assert.ok(battle.kills>0,'weapons really defeat monsters');assert.ok(battle.renderObjects>200,'source geometry renders in Creator');
 if(battle.phase!=='result'){if(battle.runPhase==='levelup')await choose('card-0');if(battle.runPhase==='chest')await choose('chest-ok');await choose('pause');await choose('abandon');await choose('confirm-yes')}
 assert.equal((await state()).phase,'result');assert.equal((await state()).progress.runs,1);await capture('result');await choose('result-menu');await ready();
 if(native){await choose('play');await choose('heroes-next');await choose('stages-next');await choose('begin');await ready();await event('Hide');await event('Show');assert.equal((await state()).phase,'paused');await choose('resume')}else{await p.reload();await p.waitForFunction(()=>window.__collectionSnapshot?.phase==='menu');assert.equal((await state()).progress.runs,1);assert.equal((await state()).settings.master,settings.master);assert.equal((await state()).settings.quality,settings.quality)}
 await fits();return['safety','all-menu-panels','story-hero-stage-intro','rapier-movement','active-skill','pause-equipment','real-combat','upgrades:'+cards,'settlement-once','settings','persistence-or-native-lifecycle'];
}
