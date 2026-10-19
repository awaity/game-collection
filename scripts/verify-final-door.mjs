import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from './browser.mjs';
import {once} from 'node:events';
import {createSiteServer} from './preview-site.mjs';
import {createMiniHost} from './mini-host.mjs';
const output=new URL('../artifacts/cocos/',import.meta.url);await mkdir(output,{recursive:true});const mode=process.argv[2]??'all';
const server=createSiteServer(process.cwd());server.listen(0,'127.0.0.1');await once(server,'listening');const webBase=`http://127.0.0.1:${server.address().port}/game-collection/`;
const host=await createMiniHost({cocos:true}),browser=await launchBrowser(),report=[];
try{
for(const target of (mode==='web'?[]:['weixin','douyin'])){
 const p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));
 try{
  await p.goto(host.url);let s=await p.evaluate(target=>boot('final-door',target,1),target);
  async function frames(count=3){s=await p.evaluate(count=>call({type:'frames',count}),count);assert.deepEqual(s.errors,[]);assert.deepEqual(errors,[]);return s;}
  async function event(name,x=0,y=0){s=await p.evaluate(({name,x,y})=>call({type:'event',name,event:{touches:name==='TouchEnd'?[]:[{identifier:1,clientX:x,clientY:y,pageX:x,pageY:y}],changedTouches:[{identifier:1,clientX:x,clientY:y,pageX:x,pageY:y}]}}),{name,x,y});}
  async function tap(id){const b=s.state.controls.find(b=>b.id===id);assert.ok(b,`Missing ${id}: ${s.state.controls.map(b=>b.id)}`);await event('TouchStart',b.x,b.y);await event('TouchEnd',b.x,b.y);await frames();}
  for(let i=0;i<100&&(!s.state||s.state.phase==='loading');i++){await p.waitForTimeout(60);await frames();}
  assert.equal(s.state.phase,'playing');assert.ok(s.graphics.colors>100);assert.equal(s.graphics.error,0);assert.equal(s.environment.documentAbsent,true);
  const soundReady=s.reads.filter(x=>x.endsWith('.wav')).length;assert.equal(soundReady,3);
  await tap('play');const before=s.state.tick;await frames(12);assert.equal(s.state.tick,before);
  await tap('more');await tap('settings');assert.equal(s.state.menu,'settings');await tap('sound');assert.equal(s.state.sound,true);await tap('quality');assert.equal(s.state.quality,'流畅');
  await tap('menu-back');await tap('manual');assert.equal(s.state.automatic,false);assert.equal(s.state.phase,'playing');await frames(120);
  await event('TouchStart',195,600);await event('TouchMove',60,600);await frames(5);await event('TouchCancel',60,600);
  await event('Hide');await event('Show');await frames();assert.equal(s.state.phase,'paused');const paused=s.state.tick;await frames(10);assert.equal(s.state.tick,paused);
  await tap('play');await frames(120);assert.ok(s.state.tick>paused);assert.ok(s.state.shots>0);assert.ok(s.sounds>0,`native audio ${JSON.stringify({sounds:s.sounds,reads:s.reads.filter(x=>x.endsWith('.wav'))})}`);
  await tap('more');await tap('replays');await tap('export-replay');const replay=JSON.parse(s.clipboard);assert.ok(replay.输入.length>0);
  await tap('import-replay');assert.equal(s.state.phase,'paused');assert.equal(s.state.tick,0);assert.equal(s.state.automatic,true);
  await tap('more');await tap('replays');await tap('copy-link');assert.match(s.clipboard,/game-collection\/games\/final-door\/\?seed=42&route=0&mode=interactive/);
  await tap('report');assert.ok(s.state.labels.some(x=>x.includes('首领剩余耐久')));await tap('menu-back');await tap('route2');assert.equal(s.state.route,2);await tap('more');await tap('demo');s=await p.evaluate(()=>call({type:'advance',count:2700}));await frames();assert.equal(s.state.phase,'result');assert.equal(s.state.bossHP,1833);assert.equal(s.state.outcome,'进行中');await tap('more');await tap('route0');await tap('more');await tap('demo');s=await p.evaluate(()=>call({type:'advance',count:2700}));await frames();assert.equal(s.state.outcome,'胜利');
  await p.screenshot({path:`artifacts/cocos/final-native-${target}.png`});
  report.push({target,environment:s.environment,errors,graphics:s.graphics,sounds:s.sounds,flows:['touch','takeover','pause','settings','audio','hide/show','resume','replay-export','replay-import','challenge-link','report','route']});console.log(target,JSON.stringify(report.at(-1)));
 }finally{await p.close()}
}
for(const viewport of (mode==='native'?[]:[{width:390,height:844},{width:1440,height:900},{width:844,height:390},{width:320,height:568}])){
 const ctx=await browser.newContext({viewport,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 try{
  await p.addInitScript(()=>window.__COLLECTION_TEST__=true);await p.goto(webBase+'games/final-door/dist/web/');await p.waitForFunction(()=>window.__collectionSnapshot?.controls?.some(b=>b.id==='more'),null,{timeout:30000});await p.waitForFunction(()=>!document.querySelector('#collection-entrance'));
  const state=()=>p.evaluate(()=>window.__collectionSnapshot);
  async function click(id){let s=await state(),b=s.controls.find(b=>b.id===id);while(!b&&s.controls.some(b=>b.id==='prev-page')){await p.getByRole('button',{name:'上一页',exact:true}).click();await p.waitForTimeout(100);s=await state();b=s.controls.find(b=>b.id===id)}for(let tries=0;!b&&tries<8;tries++){const next=s.controls.find(b=>b.id==='next-page');assert.ok(next,`missing ${id}`);await p.getByRole('button',{name:next.label,exact:true}).click();await p.waitForTimeout(100);s=await state();b=s.controls.find(b=>b.id===id)}assert.ok(b);await p.getByRole('button',{name:b.label,exact:true}).click();await p.waitForTimeout(120)}
  async function fits(){const s=await state();for(const b of s.controls){assert.ok(b.x-b.width/2>=0&&b.x+b.width/2<=viewport.width+1,`horizontal overflow: ${b.id}`);assert.ok(b.y-b.height/2>=0&&b.y+b.height/2<=viewport.height+1,`vertical overflow: ${b.id}`)}const overlap=[];for(let i=0;i<s.controls.length;i++)for(let j=i+1;j<s.controls.length;j++){const a=s.controls[i],b=s.controls[j];if(Math.abs(a.x-b.x)<(a.width+b.width)/2&&Math.abs(a.y-b.y)<(a.height+b.height)/2)overlap.push([a.id,b.id])}assert.deepEqual(overlap,[])}
  assert.equal((await state()).tick,0);await fits();await p.screenshot({path:`artifacts/cocos/final-web-${viewport.width}-menu.png`});await click('more');await fits();await p.screenshot({path:`artifacts/cocos/final-web-${viewport.width}-more.png`});await click('settings');await fits();await click('sound');assert.equal((await state()).sound,true);await click('menu-back');await click('manual');assert.equal((await state()).automatic,false);await click('play');const before=(await state()).tick;await p.waitForTimeout(250);assert.equal((await state()).tick,before);
  await click('more');if((await state()).controls.some(b=>b.id==='replays')||(await state()).controls.some(b=>b.id==='next-page'))await click('replays');await fits();const download=p.waitForEvent('download');await click('export-replay');const d=await download;assert.match(d.suggestedFilename(),/replay/);await d.saveAs(`artifacts/cocos/final-export-${viewport.width}.json`);
  const chooser=p.waitForEvent('filechooser');await click('import-replay');await(await chooser).setFiles(`artifacts/cocos/final-export-${viewport.width}.json`);await p.waitForFunction(()=>window.__collectionSnapshot.menu==='');assert.equal((await state()).tick,0);
  await click('more');if((await state()).controls.some(b=>b.id==='replays')||(await state()).controls.some(b=>b.id==='next-page'))await click('replays');await click('copy-link');assert.match(await p.evaluate(()=>navigator.clipboard.readText()),/seed=42&route=0/);await click('report');await fits();await p.screenshot({path:`artifacts/cocos/final-web-${viewport.width}-report.png`});assert.deepEqual(errors,[]);
  report.push({target:'web',viewport,errors,flows:['menu','responsive-controls','settings','play','pause','download','file-import','challenge-link','report']});console.log('web',viewport,'passed');
 }finally{await ctx.close()}
}
await writeFile(`artifacts/cocos/final-${mode}-verification.json`,JSON.stringify(report,null,2));
}finally{await browser.close();await host.close();server.closeAllConnections();await new Promise(r=>server.close(r))}
