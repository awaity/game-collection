import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {presentCocos} from '../../../scripts/cocos-browser.mjs';

export async function verify({p,native,target,viewport,state,click,advance,event,fits,capture}){
 const fresh=async()=>{if(native)await p.evaluate(()=>call({type:'frames',count:2}));else await presentCocos(p);return state();};
 async function play(count){if(native)await p.evaluate(count=>call({type:'zombie-fire-play',count}),count);else await p.evaluate(count=>__zombieFire.play(count),count);return fresh();}
 async function choose(id){for(let n=0;n<30;n++){if((await state()).controls.some(b=>b.id===id)){await click(id);return;}await click('page-next');}throw Error('missing '+id);}
 async function outfitBattle(skin,skill){
  await click('open:gear');await choose('skins');await choose('skin:'+skin);await home();let triggered=false;
  for(let attempt=0;attempt<6&&!triggered;attempt++){
   await click('endless');let s=await state();assert.ok(s.skinProgress);assert.equal(s.skinProgress.skill,skill);assert.equal(s.skinProgress.triggers,0);
   for(let n=0;n<350&&s.skinProgress.triggers===0;n++){
    if(s.battlePhase==='choice'){
     if(!s.learned[skill]&&!s.cards.some(c=>c.id==='learn:'+skill)&&s.rerolls>0){await click('reroll');s=await fresh();continue;}
     const score=c=>c.id==='learn:'+skill?1000:c.skill===skill?500:c.kind==='learn'?0:100;
     const card=[...s.cards].sort((a,b)=>score(b)-score(a))[0];await click('choose:'+s.cards.findIndex(c=>c.id===card.id));
    }else if(s.battlePhase==='playing'){
     // Same deterministic rules, no automatic card choice or health/currency grants.
     const count=s.skinProgress.hits>=s.skinProgress.threshold/2?24:180;
     if(native)await p.evaluate(count=>call({type:'advance',count}),count);else await p.evaluate(count=>__collectionAdvance(count),count);
    }else break;
    s=await fresh();assert.ok(Number.isFinite(s.skinProgress.hits)&&s.skinProgress.hits>=0&&s.skinProgress.hits<s.skinProgress.threshold,'exported charge display must stay finite and within its threshold');
    if(!s.learned[skill]&&Object.keys(s.learned).length>=5)break;
   }
   triggered=s.skinProgress.triggers>0;
   if(triggered){assert.ok(s.learned[skill],skin+' must acquire its weapon through an offered card');assert.ok(s.damage>0);await fits();await capture('passive-'+skin);}
   await home();
  }
  assert.ok(triggered,skin+' must trigger from real hits');
 }
 async function advancedBattle(skill){
  let observed=false;
  const ultimate=['orb:tide','orb:destroy','orb:cycle','orb:ultimate'];
  for(let attempt=0;attempt<(skill==='orb'?8:4)&&!observed;attempt++){
   await click('endless');let s=await state(),evolvedAt21=false,capturedLuck=false;
   for(let n=0;n<(skill==='orb'?750:450);n++){
    let selectedLuck;
    if(s.battlePhase==='choice'){
     if(skill==='orb')for(const [i,c]of s.cards.entries())if(c.id.startsWith('orb:')){
      assert.ok(Number.isInteger(c.luckChange)&&Number.isInteger(c.luckAfter),'visible orb cards resolve luck before input');
      const label=`幸运 ${c.luckChange>=0?'+':''}${c.luckChange} → ${c.luckAfter}`;
      assert.ok(s.labels.includes(label),'the rendered card shows its exact lucky outcome');
      assert.ok(s.controls.find(b=>b.id==='choose:'+i).label.includes(label),'accessible card label includes the same outcome');
      if(s.orbLuck+c.luckChange>21)assert.ok(s.controls.find(b=>b.id==='choose:'+i).label.includes('溢出归1'));
     }
     if(!s.learned[skill]&&!s.cards.some(c=>c.id==='learn:'+skill)&&s.rerolls>0){await click('reroll');s=await fresh();continue;}
     if(skill==='orb'&&s.orbLuck===21&&!s.cards.some(c=>ultimate.includes(c.id))&&s.rerolls>0){await click('reroll');s=await fresh();continue;}
     const score=c=>{
      if(c.id==='learn:'+skill)return 4000;
      if(skill==='orb'&&c.skill==='orb'){
       if(ultimate.includes(c.id))return 3000;
       if(s.orbLuck===21)return 0;
       if(c.luckAfter===21)return 2500;
       if(c.luckAfter>s.orbLuck&&s.orbLuck+c.luckChange<=21)return 2000+c.luckAfter;
       return c.luckChange<0&&s.orbLuck>=16?1200+c.luckAfter:100;
      }
      return c.skill===skill?800:c.kind!=='learn'?500:0;
     };
     if(skill==='orb'&&s.orbLuck===21&&!capturedLuck){await fits();await capture('advanced-orb-lucky-choice');capturedLuck=true;}
     const card=[...s.cards].sort((a,b)=>score(b)-score(a))[0];
     if(card.luckChange!==undefined)selectedLuck={before:s.orbLuck,change:card.luckChange,after:card.luckAfter,overflow:s.orbLuck+card.luckChange>21};
     await click('choose:'+s.cards.findIndex(c=>c.id===card.id));
    }else if(s.battlePhase==='playing'){
     const count=s.learned[skill]?24:180;
     if(native)await p.evaluate(count=>call({type:'advance',count}),count);else await p.evaluate(count=>__collectionAdvance(count),count);
    }else break;
    s=await fresh();
    if(selectedLuck){assert.equal(s.orbLuck,selectedLuck.after);assert.deepEqual(s.lastLuck,selectedLuck,'selecting a card must apply the displayed outcome');}
    if(skill==='orb'&&ultimate.some(id=>s.upgrades[id])&&s.lastLuck?.before===21&&s.lastLuck.overflow)evolvedAt21=true;
    if(!s.learned[skill]&&Object.keys(s.learned).length>=5)break;
    assert.ok(Number.isInteger(s.orbLuck)&&s.orbLuck>=0&&s.orbLuck<=21,'lucky values stay finite in actual exports');
    observed=skill==='drone'?s.projectiles.some(p=>p.skill==='drone'&&p.rebounds>0):skill==='rift'?s.fields.some(f=>f.skill==='rift'):skill==='matrix'?s.fields.some(f=>f.skill==='matrix'&&f.merged>1)&&s.enemies.some(e=>e.bind>0):skill==='pillar'?s.fields.some(f=>f.skill==='pillar'&&f.nodes.length>=3&&f.hits>0):skill==='orb'?evolvedAt21&&s.projectiles.some(p=>p.skill==='orb'&&p.hits>1):s.dragon?.slams>0&&s.fields.some(f=>f.variant==='dragon-slam'&&f.delay<=0);
    observed=observed&&s.battlePhase==='playing';
    if(observed){assert.ok(s.learned[skill]);assert.ok(s.damage>0);assert.ok(s.counts.links<=12);await fits();await capture('advanced-'+skill);break;}
   }
   await home();
  }
  assert.ok(observed,skill+' must be acquired through visible cards and produce its actual battle effect');
 }
 async function luckyBattle(){
  const hitQualities=new Set(),prepared=new Set(),evidence=[];let lightHit=false,highBurst=false,paused=false;
  const complete=()=>hitQualities.size===3&&lightHit&&highBurst&&paused;
  for(let attempt=0;attempt<12&&!complete();attempt++){
   await click('endless');let s=await state();
   for(let n=0;n<1000&&!complete();n++){
    if(s.battlePhase==='choice'){
     if(!s.learned.orb&&!s.cards.some(c=>c.id==='learn:orb')&&s.rerolls>0){await click('reroll');s=await fresh();continue;}
     // Only visible choices influence the strategy; quality is never predicted from RNG state.
     const score=c=>c.id==='learn:orb'?5000:c.id==='orb:haste'?1500:c.skill==='rifle'?1000:c.kind==='learn'&&['frost','electron','thermo'].includes(c.skill)?800:c.kind==='learn'?0:c.id==='orb:cycle'?10:500;
     const card=[...s.cards].sort((a,b)=>score(b)-score(a))[0];await click('choose:'+s.cards.findIndex(c=>c.id===card.id));
    }else if(s.battlePhase==='playing'){
     const count=s.projectiles.some(p=>p.quality)?12:120;
     if(native)await p.evaluate(count=>call({type:'advance',count}),count);else await p.evaluate(count=>__collectionAdvance(count),count);
    }else break;
    s=await fresh();if(!s.learned.orb&&Object.keys(s.learned).length>=5)break;
    const progress=s.luckyProgress;
    assert.ok(progress.charge>=0&&progress.charge<=progress.required);assert.ok(s.counts.projectiles<=320);
    if(s.battlePhase!=='playing')continue;
    for(const ball of s.projectiles.filter(p=>p.source==='lucky')){
     if(ball.prepare>1e-8&&!prepared.has(ball.quality)){
      prepared.add(ball.quality);await fits();await capture('lucky-'+ball.quality+'-prepare');
      if(!paused){
       await click('pause');const before=await state();await advance(120);const after=await state();assert.equal(after.tick,before.tick);assert.deepEqual(after.luckyProgress,before.luckyProgress);assert.deepEqual(after.projectiles,before.projectiles);await click('resume');paused=true;
      }
     }
     if(ball.hits>0&&!hitQualities.has(ball.quality)){
      hitQualities.add(ball.quality);evidence.push({attempt:attempt+1,quality:ball.quality,casts:progress.casts,triggers:progress.triggers,hits:ball.hits,tick:s.tick});await fits();await capture('lucky-'+ball.quality+'-combat');
     }
    }
    if(!lightHit&&s.projectiles.some(p=>p.source==='lucky-light'&&p.hits>0)){lightHit=true;await capture('lucky-light-hit');}
    if(!highBurst&&progress.hitBursts>0&&s.projectiles.some(p=>p.source==='lucky'&&p.quality==='high'&&p.hits>0)){highBurst=true;await capture('lucky-high-burst');}
   }
   await home();
  }
  assert.ok(complete(),`lucky effects need actual legal hits: ${JSON.stringify({qualities:[...hitQualities],lightHit,highBurst,paused})}`);
  await writeFile(`artifacts/cocos/zombie-fire/${target}-${viewport.width}-lucky.json`,JSON.stringify({verifiedAt:new Date().toISOString(),evidence,lightHit,highBurst,preparationPause:paused},null,2)+'\n');
 }
 async function home(){if((await state()).panel)await click('panel-close');if((await state()).battlePhase==='choice')await click('choose:0');if((await state()).battlePhase==='playing')await click('pause');if((await state()).phase!=='menu')await click('home');}
 async function aim(){
  if((await state()).battlePhase==='choice')await click('choose:0');
  let s=await state(),enemy=s.enemies.find(e=>e.y<580&&e.y>120);
  for(let n=0;!enemy&&n<15;n++){s=await play(60);enemy=s.enemies.find(e=>e.y<580&&e.y>120);}
  assert.ok(enemy,'a real enemy must enter the field for the aiming check');
  assert.ok(s.field?.width&&s.field?.height,'read-only geometry includes native safe-area layout');
  const point=(enemy,s)=>({x:s.width/2+s.field.offset+enemy.x*s.field.width/360,y:s.height/2-s.field.bottom-enemy.y*s.field.height/640});
  let {x,y}=point(enemy,s);const previous=s.priority;
  if(native){await event('TouchStart',x,y);await event('TouchCancel',x,y);}else if(viewport.width<900){const c=await p.context().newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await c.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await c.detach();}
  s=await fresh();assert.equal(s.priority,previous,'cancelled gesture must not set a priority');
  enemy=s.enemies.find(e=>e.id===enemy.id)??s.enemies.find(e=>e.y<580&&e.y>120);assert.ok(enemy,'visible target remains available');({x,y}=point(enemy,s));
  if(native){await event('TouchStart',x,y);await event('TouchEnd',x,y);}else if(viewport.width<900)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y);
  assert.equal((await fresh()).priority,enemy.id,'real pointer selects the visible enemy');
 }
 assert.equal((await state()).phase,'menu');await fits();await capture('camp');
 for(const panel of ['gear','research','wall','merc','supply','quests']){await click('open:'+panel);await fits();await capture(panel);await click('panel-close');}
 await click('start');assert.equal((await state()).battlePhase,'choice');await fits();await capture('first-choice');const frozen=(await state()).tick;await advance(120);assert.equal((await state()).tick,frozen);
 await click('reroll');assert.equal((await state()).rerolls,1);if(!native&&viewport.width>900){await p.keyboard.press('1');await fresh();}else await click('choose:0');assert.equal((await state()).battlePhase,'playing');assert.equal((await state()).profile.tutorial,true);
 await advance(90);await fits();await capture('combat');await click('pause');const tick=(await state()).tick;await advance(120);assert.equal((await state()).tick,tick);await fits();await capture('paused');await click('resume');
 if(native){await event('Hide');await event('Show');assert.equal((await fresh()).battlePhase,'paused');await click('resume');}
 await play(600);await aim();await capture('skills');
 if(native){const playback=await p.evaluate(()=>call({type:'frames',count:0}));assert.ok(playback.sounds>0,'native combat must play loaded audio');await writeFile(`artifacts/cocos/zombie-fire/${target}-audio.json`,JSON.stringify({verifiedAt:new Date().toISOString(),target,playsBeforeRestart:playback.sounds},null,2)+'\n');}
 await play(120000);assert.equal((await state()).battlePhase,'won');assert.equal((await state()).unlocked,2);assert.ok((await state()).coins>=700);await fits();await capture('victory');
 await click('next');assert.equal((await state()).stage,1);await home();
 await click('open:supply');await choose('checkin');const checked=(await state()).coins;await choose('checkin');assert.equal((await state()).coins,checked);await choose('chest:free');const gems=(await state()).profile.gems.length;await choose('chest:free');assert.equal((await state()).profile.gems.length,gems);await home();
 await click('open:gear');await choose('upgrade:weapon');assert.equal((await state()).profile.weapon,1);await choose('gear:gloves');assert.equal((await state()).profile.gear.gloves.level,1);await home();
 await click('open:research');await choose('research:thermo');assert.equal((await state()).profile.research.thermo,1);await home();
 await click('open:wall');await choose('upgrade:wall');assert.equal((await state()).profile.wall,1);await home();
 await click('endless');await play(60000);const endless=await state();assert.ok(endless.wave>8,`endless only reached ${endless.wave}`);assert.notEqual(endless.battlePhase,'won');assert.ok(endless.profile.endlessBest>=8);assert.ok(endless.coins>4000);assert.ok(endless.renderNodes<200);await capture('endless');
 await play(200000);assert.equal((await state()).battlePhase,'lost','unbounded pressure must eventually defeat the unmodified defense');assert.equal((await state()).hp,0);await fits();await capture('defeat');await home();
 await click('open:merc');await choose('merc:upgrade:storm');await choose('merc:deploy:storm');assert.deepEqual((await state()).team,['storm']);await choose('merc:upgrade:storm');assert.equal((await state()).profile.mercs.storm,2);await fits();await capture('mercenaries');await home();
 await click('open:gear');await choose('skins');for(const id of ['ranger','ember','arctic','hazard','arc']){await choose('skin:'+id);assert.equal((await state()).skin,id);await fits();}const owned=(await state()).coins;await choose('skin:arc');assert.equal((await state()).coins,owned);await capture('skins');await home();
 for(const [skin,skill]of [['ember','thermo'],['arctic','dryice'],['hazard','blade'],['arc','electro']])await outfitBattle(skin,skill);
 for(const skill of ['drone','rift','matrix','dragon','pillar','orb'])await advancedBattle(skill);
 await luckyBattle();
 await click('open:supply');await choose('supply:gems');const gem=(await state()).profile.gems[0];await choose('gem:equip:'+gem.id);assert.equal((await state()).profile.gear.weapon.gems[0],gem.id);await fits();await capture('gems');await home();
 await click('open:quests');await choose('claim:first-victory');const claimed=(await state()).coins;await choose('claim:first-victory');assert.equal((await state()).coins,claimed);await fits();await capture('quests-earned');await home();
 await click('settings');for(const id of ['sound','motion','quality','volume'])await choose('setting:'+id);assert.equal((await state()).profile.settings.sound,false);assert.equal((await state()).profile.settings.motion,false);assert.equal((await state()).profile.settings.quality,'low');assert.equal((await state()).profile.settings.volume,1);await fits();await capture('settings');await home();
 await click('codex');for(const tab of ['skills','evolutions','enemies','outfits']){await click('codex:'+tab);await fits();await capture('codex-'+tab);await click('page-next');await fits();}await home();
 await click('daily');const daily=await state();await play(300);await home();await click('daily');assert.equal((await state()).randomState,daily.randomState);await home();
 const saved=await state();
 if(native){const {storage}=await p.evaluate(()=>call({type:'frames',count:0}));assert.ok(storage['zombie-fire.save.v1']);await p.reload();await p.evaluate(({target,storage})=>boot('zombie-fire',target,1,storage),{target,storage});}
 else{await p.reload();await p.waitForFunction(()=>window.__collectionSnapshot?.controls?.length,null,{timeout:90000});await p.waitForFunction(()=>!document.querySelector('#collection-entrance'));}
 for(let n=0;n<150;n++){if((await fresh())?.phase==='menu')break;await p.waitForTimeout(50);}
 const restored=await state();assert.equal(restored.coins,saved.coins);assert.equal(restored.skin,'arc');assert.deepEqual(restored.profile.gear,saved.profile.gear);assert.deepEqual(restored.profile.mercs,saved.profile.mercs);assert.deepEqual(restored.profile.settings,saved.profile.settings);assert.equal(restored.profile.tutorial,true);
 return ['legal-first-clear','three-choice-and-reroll','priority-aim-and-touch-cancel','pause-freezes-rules','endless-waves','checkin-and-free-supply','actual-weapon-and-wall-upgrades','research','mercenary-upgrade','five-skins','four-hit-triggered-outfits','drone-wall-rebound','diamond-rift','merging-matrix','energy-gated-dragon-slam','electrode-wire-hits','orb-lucky-21-evolution-and-rebounds','orb-fixed-luck-preview-and-selection','lucky-three-qualities-piercing-lights-and-blasts','lucky-preparation-pause','gem-equip','idempotent-rewards','codex-with-outfit-rules','sound-motion-quality-volume','daily-seed','persistent-restart'];
}
