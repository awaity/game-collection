import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createSiteServer} from './preview-site.mjs';
import {createMiniHost} from './mini-host.mjs';
import {launchBrowser} from './browser.mjs';
import {presentCocos} from './cocos-browser.mjs';

const mode=process.argv[2]??'web';
const games=['garden-guard','surge-squad','final-door','volley-run','plane-battle'];
const isCocos=slug=>['surge-squad','final-door'].includes(slug);
const output='artifacts/growth';await mkdir(output,{recursive:true});
const server=createSiteServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}/game-collection/games/`;
const browser=await launchBrowser(),reports=[];
process.once('SIGTERM',()=>void browser.close());
let nativeHost,cocosHost;
const parse=value=>typeof value==='string'?JSON.parse(value):value;
const metrics={kills:60,wins:1,waves:3,seconds:180,runs:1};
// Shop/UI fixtures are explicit; real combat rewards are verified separately.
function shopFixture(saved){return {...saved,coins:5000,daily:metrics,totals:metrics,clears:Array.from({length:24},(_,i)=>String(i))};}
try{
 if(mode==='web')for(const viewport of [{width:390,height:844},{width:320,height:568},{width:1440,height:900},{width:844,height:390}])for(const slug of games){
  if(process.env.VERIFY_GAME&&slug!==process.env.VERIFY_GAME)continue;
  const context=await browser.newContext({viewport,reducedMotion:'reduce',hasTouch:viewport.width<600}),page=await context.newPage(),errors=[];
  page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(String(e)));
  await page.addInitScript(()=>{window.__COLLECTION_TEST__=true;localStorage.setItem('volley.settings.v1',JSON.stringify({quality:'low',sound:false}));});
  const cocos=isCocos(slug),key=slug+'.career.v1';
  const pulse=async()=>{if(cocos)return presentCocos(page);};
  const ready=async()=>{
   if(cocos){await page.waitForFunction(()=>window.__collectionSnapshot,null,{timeout:90000});for(let n=0;n<200;n++){const s=await pulse();if(s?.controls?.some(b=>b.id==='career:open'))return;await page.waitForTimeout(50);}throw Error('Career entry missing');}
   await page.locator(slug==='volley-run'?'#career-open':'[data-action="career:open"]').waitFor();
   if(slug==='volley-run')await page.evaluate(()=>__VOLLEY__.manual(true));
  };
  const has=async id=>cocos?(await pulse()).controls.some(b=>b.id===id):await page.locator(`[data-action="${id}"]`).count()>0;
  async function click(id){
   let locator;
   if(cocos){const s=await pulse(),b=s.controls.find(b=>b.id===id);assert.ok(b,'Missing '+id);locator=page.getByRole('button',{name:b.label,exact:true}).nth(s.controls.filter(c=>c.label===b.label).findIndex(c=>c.id===id));}
   else locator=page.locator(id==='career:open'&&slug==='volley-run'?'#career-open':`[data-action="${id}"]`);
   if(await locator.evaluate(el=>getComputedStyle(el).pointerEvents==='none')){const b=await locator.boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);}else await locator.click();
   await pulse();
  }
  const data=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  async function assertEquipped(){
   // Read the actual battle state, not just the untouched storage string.
   const equipped=await page.evaluate(async slug=>{
    if(slug==='garden-guard'){const c=__GARDEN__.view.game.config;return {color:c.skinColor,damage:c.damageScale,interval:c.intervalScale,guard:c.guardLevel};}
    if(slug==='plane-battle'){const g=__PLANE__.app.game;return {color:g.skinColor,damage:g.damageScale,interval:g.intervalScale};}
    if(slug==='volley-run'){const g=__VOLLEY__.getGame();__VOLLEY__.render();return {color:g.skin.color,upgrades:g.modifiers};}
    const {director,Component,Label}=await System.import('cc');const c=director.getScene().getComponentsInChildren(Component).find(c=>c.career&&c.sim);
    const numericOverflow=director.getScene().getComponentsInChildren(Label).filter(l=>l.node.activeInHierarchy&&/\d+\.\d{4}/.test(l.string)).map(l=>l.string);
    return slug==='surge-squad'?{color:c.sim.skinColor,damage:c.sim.damageScale,interval:c.sim.intervalScale,skin:c.career.data.skin,numericOverflow}:{color:c.art.skinColor,upgrades:c.sim.loadout,skin:c.career.data.skin,numericOverflow};
   },slug);
   assert.equal(equipped.color,'#b99aff',`${slug}: equipped skin must reach the battlefield after reload`);
   if(equipped.damage!==undefined){assert.equal(equipped.damage,1.12);assert.equal(equipped.interval,.96);}
   if(equipped.upgrades)for(const id of ['power','haste','guard'])assert.equal(equipped.upgrades[id],1);
   if(equipped.numericOverflow)assert.deepEqual(equipped.numericOverflow,[],'fractional damage must not overflow health labels');
   const loaded=await data();for(const field of ['owned','claimed','achievements','clears'])assert.deepEqual(loaded[field],expected[field],`${slug}: ${field} survives reload`);
  }
  let expected;
  async function fits(){
   const boxes=await page.locator(cocos?'.cocos-control:not([hidden])':'[data-action^="career:"]').evaluateAll(nodes=>nodes.filter(el=>el.getClientRects().length).map(el=>{const b=el.getBoundingClientRect();return {id:el.dataset.action??el.getAttribute('aria-label'),x:b.x,y:b.y,w:b.width,h:b.height};}));
   for(const b of boxes)assert.ok(b.x>=-1&&b.y>=-1&&b.x+b.w<=viewport.width+1&&b.y+b.h<=viewport.height+1,`${slug} ${b.id} outside viewport`);
   for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert.ok(a.x+a.w<=b.x+.5||b.x+b.w<=a.x+.5||a.y+a.h<=b.y+.5||b.y+b.h<=a.y+.5,`${slug}: ${a.id} overlaps ${b.id}`);}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  }
  async function choose(id){for(let n=0;n<25;n++){if(await has(id)){await click(id);return;}await click('career:page:1');}throw Error('Paged item missing: '+id);}
  try{
   console.log('Growth start',slug,viewport.width);await page.goto(origin+slug+'/?qa=1&mode=capture');await ready();await click('career:open');await fits();
   await click('career:checkin');assert.equal((await data()).coins,125);await click('career:checkin');assert.equal((await data()).coins,125);
   await click('career:tab:weapons');await click('career:upgrade:power');assert.equal((await data()).coins,25);assert.equal((await data()).upgrades.power,1);
   await page.reload();await ready();assert.equal((await data()).coins,25);assert.equal((await data()).upgrades.power,1);
   await page.evaluate(({key,fixture,slug})=>{
    localStorage.setItem(key,JSON.stringify(fixture));
    if(slug==='garden-guard')localStorage.setItem(slug+'.save.v1',JSON.stringify({version:1,levels:Object.fromEntries(Array.from({length:24},(_,i)=>[i+1,3]))}));
    if(slug==='surge-squad')localStorage.setItem(slug+'.save.v1',JSON.stringify({version:1,unlocked:6,best:[1,1,1,1,1,1]}));
   },{key,fixture:shopFixture(await data()),slug});
   await page.reload();await ready();await click('career:open');await click('career:tab:tasks');await click('career:claim:daily-kills');assert.equal((await data()).coins,5120);
   await choose('career:claim:first-win');assert.equal((await data()).coins,5320);
   await click('career:tab:skins');
   for(const skin of (viewport.width===390?['sunrise','mint','orchid','ember']:['orchid']))await choose('career:skin:'+skin);
   await click('career:tab:skins');await choose('career:skin:classic');const before=(await data()).coins;await choose('career:skin:orchid');assert.equal((await data()).coins,before,'owned skins are not charged twice');
   await click('career:tab:weapons');await choose('career:upgrade:haste');await choose('career:upgrade:guard');await fits();
   await page.screenshot({path:`${output}/${slug}-${viewport.width}-upgrades.png`});
   expected=await data();await page.reload();await ready();assert.deepEqual((await data()).upgrades,expected.upgrades);assert.equal((await data()).skin,'orchid');
   await click('career:open');await click('career:tab:maps');const last=slug==='garden-guard'?23:slug==='plane-battle'?11:5;
   await choose('career:start:'+last);
   const selected=await page.evaluate(async slug=>{
    if(slug==='garden-guard')return Number(__GARDEN__.view.game.config.id)-1;
    if(slug==='plane-battle')return __PLANE__.app.game.mission;
    if(slug==='volley-run'){__VOLLEY__.manual(true);return __VOLLEY__.getGame().level;}
    return slug==='surge-squad'?__collectionSnapshot.chapter:__collectionSnapshot.route;
   },slug);assert.equal(selected,last,'last map can be selected through pagination');
   await assertEquipped();
   await page.screenshot({path:`${output}/${slug}-${viewport.width}-new-map.png`});
   await page.reload();await ready();await click('career:open');await click('career:endless');assert.equal((await data()).active.mode,'endless');
   if(cocos){const s=await pulse();assert.equal(s.endless,true);}
   else if(slug==='garden-guard')assert.equal(await page.evaluate(()=>__GARDEN__.view.game.config.allowed.length),18);
   else if(slug==='plane-battle')assert.equal(await page.evaluate(()=>__PLANE__.app.game.damageScale),1.12);
   else await page.evaluate(()=>__VOLLEY__.manual(true));
   await assertEquipped();
   if(viewport.width===390&&['surge-squad','final-door'].includes(slug)){
    // Drive the same legal steering methods as user input, with untouched HP,
    // damage, clocks and enemy entities. Manual reward eligibility comes from UI.
    const result=await page.evaluate(async slug=>{
     const {director,Component}=await System.import('cc');
     const component=director.getScene().getComponentsInChildren(Component).find(c=>c.career&&c.sim);
     const s=component.sim;
     if(slug==='surge-squad')for(let n=0;n<10800&&s.phase==='playing';n++){s.autoPilot();component.step();}
     else{
      const points=[[0,-3.65],[6.65,0],[7.8,.3],[8.6,3.55],[12.1,0],[18.3,3.55],[21,-3.35],[25.2,0],[29.2,0],[33,0],[33.9,3.4],[34.95,0],[36.3,-3.4],[37.4,0],[38.68,3.4],[39.8,0],[41.07,-3.4],[42.2,0],[43.5,3.4]];let at=0;
      while(s.tick<2700&&s.outcome==='进行中'){if(at<points.length&&s.tick>=Math.round(points[at][0]*60))s.input('target',points[at++][1]);s.step();}
     }
     component.update(0);return {outcome:s.outcome??s.phase,save:component.career.data};
    },slug);
    assert.ok(['胜利','victory'].includes(result.outcome));assert.equal(result.save.active.waves,1);const earned=result.save.coins;await pulse();assert.equal((await data()).coins,earned);
    await click(slug==='surge-squad'?'next':'retry');assert.equal((await pulse()).wave,2);assert.equal((await data()).active.id,result.save.active.id);
   }
   if(viewport.width===390&&slug==='volley-run'){
    const result=await page.evaluate(()=>__VOLLEY__.advance(2400,true));assert.equal(result.phase,'won');assert.equal((await data()).active.waves,1);
    const earned=(await data()).coins;await page.evaluate(()=>__VOLLEY__.render());assert.equal((await data()).coins,earned);
    await page.getByRole('button',{name:'第 2 波 · 继续无尽',exact:true}).click();assert.ok(await page.evaluate(()=>{__VOLLEY__.manual(true);return __VOLLEY__.getGame().modifiers.carry>0}));
   }
   await pulse();await page.screenshot({path:`${output}/${slug}-${viewport.width}-endless.png`});assert.deepEqual(errors,[]);
   reports.push({slug,viewport,flows:['check-in-once','upgrade-real-funds','reload','shop-and-task-fixture','skin-purchase-and-equip','last-map-pagination','endless-start'],errors});
   console.log('Growth web',slug,viewport.width,'passed');
  }catch(error){await page.screenshot({path:`${output}/${slug}-${viewport.width}-failure.png`}).catch(()=>{});throw error;}finally{await context.close();}
 }
 if(mode==='native'){
  nativeHost=await createMiniHost();cocosHost=await createMiniHost({cocos:true});
  for(const slug of games)for(const target of ['weixin','douyin']){
   if(process.env.VERIFY_GAME&&slug!==process.env.VERIFY_GAME)continue;
   const page=await browser.newPage({viewport:{width:390,height:844}}),cocos=isCocos(slug),key=slug+'.career.v1';let latest;
   try{
    await page.goto((cocos?cocosHost:nativeHost).url);latest=await page.evaluate(({slug,target})=>boot(slug,target,1),{slug,target});
    // Keep each software-WebGL request bounded while still rendering every frame.
    const frames=async(count=2)=>{for(let remaining=count;remaining>0;remaining-=8){latest=await page.evaluate(count=>call({type:'frames',count}),Math.min(remaining,8));assert.deepEqual(latest.errors,[]);}return latest;};
    const items=()=>cocos?latest.state?.controls??[]:latest.texts??[];
    for(let n=0;n<160&&!items().some(b=>cocos?b.id==='career:open':/军需|补给站|机库|远征 ·/.test(b.label));n++){await page.waitForTimeout(60);await frames();}
    async function tap(match){const b=items().find(c=>typeof match==='string'?(c.id===match||c.label===match):match.test(c.label));assert.ok(b,`${slug}/${target} missing ${String(match)}`);
     for(const name of ['TouchStart','TouchEnd'])latest=await page.evaluate(({name,x,y})=>call({type:'event',name,event:{touches:name==='TouchEnd'?[]:[{identifier:1,clientX:x,clientY:y,pageX:x,pageY:y}],changedTouches:[{identifier:1,clientX:x,clientY:y,pageX:x,pageY:y}]}}),{name,x:b.x,y:b.y});await frames();}
    const saved=()=>parse(latest.storage[key]);
    await tap(cocos?'career:open':/军需|补给站|机库|远征 ·/);await tap('每日签到');assert.equal(saved().coins,125);
    await tap('今日已签到');assert.equal(saved().coins,125);await tap('强化');
    if(cocos)await tap('career:upgrade:power');else await tap('100 金币');assert.equal(saved().coins,25);assert.equal(saved().upgrades.power,1);
    await page.screenshot({path:`${output}/${slug}-${target}-career.png`});
    await tap('无尽挑战 · 双倍击破金币');assert.equal(saved().active.mode,'endless');
    await frames(10);assert.equal(cocos?latest.environment.documentAbsent:latest.domAbsent,true);
    const store=latest.storage;await page.reload();latest=await page.evaluate(({slug,target,store})=>boot(slug,target,1,store),{slug,target,store});
    for(let n=0;n<160&&!items().some(b=>cocos?b.id==='career:open':/军需|补给站|机库|远征 ·/.test(b.label));n++){await page.waitForTimeout(60);await frames();}
    assert.equal(saved().upgrades.power,1);assert.ok(saved().coins>=25);assert.deepEqual(latest.errors,[]);
    const fixtureStore={...latest.storage,[key]:JSON.stringify(shopFixture(saved()))};
    await page.reload();latest=await page.evaluate(({slug,target,store})=>boot(slug,target,1,store),{slug,target,store:fixtureStore});
    for(let n=0;n<160&&!items().some(b=>cocos?b.id==='career:open':/军需|补给站|机库|远征 ·/.test(b.label));n++){await page.waitForTimeout(60);await frames();}
    await tap(cocos?'career:open':/军需|补给站|机库|远征 ·/);await tap('皮肤');await tap(cocos?'career:skin:orchid':'650 金币');
    assert.equal(saved().skin,'orchid');assert.equal(saved().coins,4350);await tap('无尽挑战 · 双倍击破金币');await frames(60);
    // A full native reboot must load the purchase into the next battle.
    const equippedStore=latest.storage;await page.reload();latest=await page.evaluate(({slug,target,store})=>boot(slug,target,1,store),{slug,target,store:equippedStore});
    for(let n=0;n<160&&!items().some(b=>cocos?b.id==='career:open':/军需|补给站|机库|远征 ·/.test(b.label));n++){await page.waitForTimeout(60);await frames();}
    await tap(cocos?'career:open':/军需|补给站|机库|远征 ·/);await tap('无尽挑战 · 双倍击破金币');await frames(20);
    assert.equal(saved().skin,'orchid');assert.ok(saved().owned.includes('orchid'));assert.equal(saved().upgrades.power,1);
    if(cocos){assert.equal(latest.state.skinColor,'#b99aff');assert.equal(latest.state.career.skin,'orchid');assert.equal(latest.state.career.upgrades.power,1);}
    await page.screenshot({path:`${output}/${slug}-${target}-skin.png`});
    reports.push({slug,target,flows:['native-touch','check-in-once','upgrade','endless','storage-reboot','skin-shop-fixture'],domAbsent:true,errors:latest.errors});console.log('Growth native',slug,target,'passed');
   }finally{await page.close();}
  }
 }
 await writeFile(`${output}/${mode}-report.json`,JSON.stringify({checkedAt:new Date().toISOString(),reports},null,2)+'\n');
}finally{await browser.close();await nativeHost?.close();await cocosHost?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
console.log('Growth verification browsers and servers closed.');
