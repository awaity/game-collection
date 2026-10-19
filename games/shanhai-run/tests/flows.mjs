import assert from 'node:assert/strict';
import {presentCocos} from '../../../scripts/cocos-browser.mjs';
export async function verify({p,native,target,viewport,state,click,advance,event,fits,capture}){
 const pulse=async()=>native?await p.evaluate(()=>call({type:'frames',count:2})):await presentCocos(p);
 const fresh=async()=>{await pulse();return state();};
 async function play(count){if(native)await p.evaluate(count=>call({type:'shanhai-play',count}),count);else await p.evaluate(count=>__shanhai.play(count),count);return fresh();}
 async function choose(id){for(let n=0;n<12;n++){if((await state()).controls.some(b=>b.id===id)){await click(id);return;}await click('page-next');}throw Error('missing '+id);}
 async function home(){const s=await state();if(s.panel)await click('panel-close');if((await state()).phase==='playing')await click('pause');if((await state()).phase!=='menu')await click('home');}
 async function swipe(action){
  const x=viewport.width*.50,y=viewport.height*.55,dx=action==='left'?-85:action==='right'?85:0,dy=action==='jump'?-85:action==='slide'?85:0;
  if(native){await event('TouchStart',x,y);await event('TouchMove',x+dx,y+dy);await event('TouchEnd',x+dx,y+dy);}
  else{const c=await p.context().newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx,y:y+dy}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach();}
  await fresh();
 }
 async function cancelGesture(){
  const x=viewport.width*.5,y=viewport.height*.55;
  if(native){await event('TouchStart',x,y);await event('TouchMove',x+12,y);await event('TouchCancel',x+12,y);}
  else if(viewport.width<900){const c=await p.context().newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+12,y}]});await c.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await c.detach();}
  const s=await fresh();assert.equal(s.x,0,'cancelled short gesture does not move lanes');assert.equal(s.stats.jumps,0);
 }
 assert.equal((await state()).phase,'menu');await fits();await capture('menu');
 // A fresh profile earns every coin used below; no currency or unlock fixtures.
 if((await state()).controls.some(b=>b.id==='checkin')){await click('checkin');assert.equal((await state()).coins,100);await click('checkin');assert.equal((await state()).coins,100);}
 await click('training');
 for(const [i,action]of ['jump','slide','left','left'].entries()){
  await advance(600);assert.equal((await state()).waiting,action);const tick=(await state()).tick;
  await advance(120);assert.equal((await state()).tick,tick,'lesson freezes before the hazard');
  await click('right');assert.equal((await state()).lesson,i,'wrong tutorial answer rejected');
  if(!native&&viewport.width>900){await p.keyboard.press({jump:'ArrowUp',slide:'ArrowDown',left:'ArrowLeft'}[action]);await fresh();}else await swipe(action);
  assert.equal((await state()).lesson,i+1);await fits();if(i===0)await capture('tutorial');
 }
 await advance(300);assert.equal((await state()).runPhase,'won');assert.equal((await state()).tutorial,true);await capture('tutorial-complete');await home();
 await click('trials');await fits();await click('trial:0');
 for(let i=0;i<8;i++){
  assert.equal((await state()).trial,i);await play(240);await fits();if(i%2===0)await capture('area-'+Math.floor(i/2));
  await play(15000);const s=await state();assert.equal(s.runPhase,'won',`trial ${i}`);assert.equal(s.unlocked,Math.min(8,i+2));assert.ok(s.stars[i]>0);await fits();
  if(i<7)await click('next');
 }
 await capture('last-trial');await home();await click('start');await cancelGesture();
 // Batched rendering keeps software GPU work bounded; all 42,000 rule steps run.
 for(let i=0;i<7;i++){const s=await play(6000);assert.equal(s.runPhase,'running');assert.ok(s.renderObjects<100,'old meshes/nodes recycled');}
 const long=await state();assert.ok(long.distance>7000);assert.ok(long.stats.areas>=12);assert.ok(long.coins>4500);await capture('endless');
 await click('pause');const tick=(await state()).tick;await advance(120);assert.equal((await state()).tick,tick);await fits();await click('resume');
 if(native){await event('Hide');await event('Show');assert.equal((await fresh()).phase,'paused');await click('resume');}
 await home();await click('wardrobe');
 for(const skin of ['fox','feather','bifang','moon']){await click('tab:skins');await choose('skin:'+skin);assert.equal((await state()).skin,skin);await fits();await capture('wardrobe-'+skin);await click('panel-close');await capture('outfit-'+skin);await click('wardrobe');}
 const balance=(await state()).coins;await choose('skin:moon');assert.equal((await state()).coins,balance);
 await click('tab:artifacts');for(const id of ['magnet','shield','wind','fortune']){await choose('upgrade:'+id);assert.equal((await state()).upgrades[id],1);}await fits();await capture('artifacts');
 await click('tab:quests');await choose('claim:daily-distance');await click('tab:quests');await choose('claim:first-escape');await fits();await capture('quests');
 await click('tab:lore');assert.equal((await state()).lore.length,4);for(let i=0;i<4;i++){await fits();await capture('lore-'+i);if(i<3)await click('page-next');}
 await click('panel-close');await click('settings');await choose('setting:sound');assert.equal((await state()).settings.sound,false);await choose('setting:quality');assert.equal((await state()).settings.quality,'low');await fits();await capture('settings');await click('panel-close');
 await click('daily');const seed=(await state()).seed;await play(300);await home();await click('daily');assert.equal((await state()).seed,seed);await home();
 await click('start');await advance(3000);assert.equal((await state()).runPhase,'dead');await fits();await capture('death');const preRescue=(await state()).coins;await click('rescue');assert.equal((await state()).revived,true);assert.equal((await state()).coins,preRescue-150);await play(400);assert.equal((await state()).phase,'playing');await home();
 const saved=await state();
 if(native){const result=await p.evaluate(()=>call({type:'frames',count:0}));const storage=result.storage;assert.ok(storage['shanhai-run.save.v1']);await p.reload();await p.evaluate(({target,storage})=>boot('shanhai-run',target,1,storage),{target,storage});}
 else await p.reload();
 if(!native)await p.waitForFunction(()=>window.__collectionSnapshot?.controls?.length,null,{timeout:90000});
 for(let n=0;n<180;n++){const s=await fresh();if(s?.controls?.some(b=>b.id==='start'))break;await p.waitForTimeout(60);}
 const loaded=await state();assert.equal(loaded.skin,'moon');assert.deepEqual(loaded.upgrades,saved.upgrades);assert.equal(loaded.coins,saved.coins);assert.equal(loaded.settings.sound,false);assert.equal(loaded.settings.quality,'low');assert.equal(loaded.tutorial,true);
 await click('start');await play(150);await capture('equipped');await home();await fits();
 return ['real-gestures','touch-cancel','interactive-tutorial','eight-legal-trial-clears','four-regions','7000m-endless','bounded-scene','checkin-and-earned-currency','five-outfits','four-artifacts','quests','lore','pause','paid-rescue','daily-seed','settings','persistent-restart'];
}
