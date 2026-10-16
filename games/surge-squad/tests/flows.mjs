import assert from 'node:assert/strict';
export async function verify({p,native,viewport,state,click,advance,event,fits,capture}){
 assert.equal((await state()).phase,'ready');await fits();await capture('menu');await click('chapter1');assert.equal((await state()).chapter,0);
 await click('start');assert.equal((await state()).phase,'playing');await click('pause');assert.equal((await state()).phase,'paused');await fits();
 if(viewport.height<490)await click('settings');await click('music');assert.equal((await state()).music,false);await click('motion');assert.equal((await state()).reducedMotion,native);await click('quality-low');assert.equal((await state()).quality,'low');await capture('settings');if(viewport.height<490)await click('settings-back');await click('resume');
 let s=await advance(360);assert.ok(s.energy>0);const energy=s.energy;await click('attack');s=await advance(100);assert.ok(s.energy<energy);assert.ok(s.kills>0);await capture('playing');
 if(native){await event('Hide');await event('Show');assert.equal((await state()).phase,'paused');await click('resume')}
 await click('pause');const paused=(await state()).tick;await advance(120);assert.equal((await state()).tick,paused);await click('clean');assert.equal((await state()).clean,true);await click('restore-hud');assert.equal((await state()).clean,false);await click('pause');await click('home');
 await click('demo');if((await state()).sound)await click('sound');s=await advance(3600);assert.equal(s.phase,'victory');assert.equal(s.score,66996);assert.equal(s.troops,7);assert.equal(s.unlocked,1,'automatic demo must not unlock manual progression');await fits();await capture('result');
 await click('next');assert.equal((await state()).chapter,1);assert.equal((await state()).demo,false);await click('pause');await click('home');
 if(!native){await p.reload();await p.waitForFunction(()=>window.__collectionSnapshot?.phase==='ready');s=await state();assert.equal(s.music,false);assert.equal(s.quality,'low');assert.equal(s.sound,false);}
 return ['chapter-lock','manual-start','settings','charging','finite-laser','real-damage','pause','hide/show','clean-view','demo-victory','next-chapter','save-settings'];
}
