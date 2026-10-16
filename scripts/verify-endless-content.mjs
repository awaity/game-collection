import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdir,writeFile } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';
import { presentCocos } from './cocos-browser.mjs';
import { createSiteServer } from './preview-site.mjs';
import { createMiniHost } from './mini-host.mjs';
const mode=process.argv[2]??'all',out='artifacts/cocos/endless-night/content',report=[];
await mkdir(out,{recursive:true});
const server=createSiteServer(process.cwd());server.listen(0,'127.0.0.1');await once(server,'listening');const host=await createMiniHost({cocos:true}),browser=await launchBrowser();
try{for(const target of mode==='native'?['weixin','douyin']:mode==='web'?['web']:['web','weixin','douyin'])for(let stage=0;stage<6;stage++){
 if(process.env.ENDLESS_CONTENT_STAGE&&stage!==Number(process.env.ENDLESS_CONTENT_STAGE))continue;
 const hero=['wren','mira','oskar','sable','wren','mira'][stage],saved={version:1,progress:{embers:2500,cleared:[true,true,true,true,true,false],items:{ward:2},storyRead:1,hearth:{headstart:1}},settings:{stage,hero,safetySeen:true,calm:true}},native=target!=='web',context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});let latest,dirty=true;
 try{
  if(native){await p.goto(host.url);latest=await p.evaluate(({target,saved})=>boot('endless-night',target,1,{'endless-night.save.v1':JSON.stringify(saved)}),{target,saved})}
  else{await p.addInitScript(saved=>{window.__COLLECTION_TEST__=true;localStorage.setItem('endless-night.save.v1',JSON.stringify(saved))},saved);await p.goto(`http://127.0.0.1:${server.address().port}/game-collection/games/endless-night/dist/web/`);await p.waitForFunction(()=>window.__collectionSnapshot,null,{timeout:90000})}
  async function state(){if(native){latest=await p.evaluate(count=>call({type:'frames',count}),dirty?2:0);assert.deepEqual(latest.errors,[]);dirty=!latest.state||latest.state.phase==='loading';return latest.state}const snapshot=dirty?await presentCocos(p):await p.evaluate(()=>window.__collectionSnapshot);dirty=!snapshot||snapshot.phase==='loading';return snapshot}
  async function ready(){for(let i=0;i<240;i++){const s=await state();if(s?.controls?.length&&s.phase!=='loading')return s;await p.waitForTimeout(60)}throw Error('Loading timeout')}
  async function click(id){const s=await state(),b=s.controls.find(b=>b.id===id);assert.ok(b,`${id}: ${s.controls.map(b=>b.id)}`);if(native){for(const name of['TouchStart','TouchEnd'])await p.evaluate(({name,x,y})=>call({type:'event',name,event:{touches:name==='TouchEnd'?[]:[{identifier:1,clientX:x,clientY:y}],changedTouches:[{identifier:1,clientX:x,clientY:y}]}}),{name,x:b.x,y:b.y});dirty=true;await state()}else{await p.getByRole('button',{name:b.label,exact:true}).nth(s.controls.filter(c=>c.label===b.label).findIndex(c=>c.id===id)).click();dirty=true;await state()}await p.waitForTimeout(120)}
  async function choose(id){for(let i=0;i<20;i++){const s=await ready();if(s.controls.some(b=>b.id===id)){await click(id);return}await click('page-next')}throw Error('Cannot find '+id)}
  async function advance(n){if(native){latest=await p.evaluate(count=>call({type:'advance',count}),n);dirty=true}else{await p.evaluate(count=>__collectionAdvance(count),n);dirty=true}return state()}
  await ready();assert.equal((await state()).hero,hero);assert.equal((await state()).stage,stage);
  await choose('play');await choose('heroes-next');await choose('stages-next');await choose('begin');await ready();await advance(1);
  let initialChoices=0;
  for(let i=0;i<40;i++){const s=await state();if(s.runPhase==='levelup'){await choose('card-0');initialChoices++}else if(s.runPhase==='chest')await choose('chest-ok');else break;await advance(1)}
  assert.equal(initialChoices,(stage===5?24:stage*2)+2,'all starting upgrades were selected');assert.equal((await state()).runPhase,'play');
  await advance(90);assert.equal((await state()).activeCd,0,'initial skill cooldown elapsed');await choose('item-ward');await advance(1);assert.equal((await state()).progress.items.ward,1,'consumable deducted once');await choose('active');const skill=await advance(2);await writeFile(`${out}/${target}-${stage}-state.json`,JSON.stringify({skill,errors},null,2));assert.ok(skill.activeCd>60,'active skill starts a new cooldown');await advance(118);const s=await state();assert.ok(s.renderObjects>200);assert.equal(s.stage,stage);assert.equal(s.hero,hero);await p.screenshot({path:`${out}/${target}-${stage}-${hero}.png`});assert.deepEqual(errors,[]);if(native){assert.equal(latest.graphics.error,0);assert.ok(latest.graphics.colors>100);assert.ok(latest.sounds>0,'real local audio was requested')}
  report.push({target,stage,hero,initialChoices,errors,renderObjects:s.renderObjects,flows:['unlocked-save-fixture','stage-and-hero','headstart-upgrade','consumable-once','active-skill','native-bundles-and-audio']});console.log(target,stage,hero,'passed');
 }catch(error){await p.screenshot({path:`${out}/${target}-${stage}-failure.png`}).catch(()=>{});await writeFile(`${out}/${target}-${stage}-failure.json`,JSON.stringify({error:String(error),errors,latest,snapshot:await p.evaluate(()=>window.__collectionSnapshot).catch(()=>null)},null,2));throw error}finally{await context.close()}
}await writeFile(`${out}/${mode}.json`,JSON.stringify(report,null,2)+'\n')}finally{await browser.close();await host.close();server.closeAllConnections();await new Promise(r=>server.close(r))}
