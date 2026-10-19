import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {once} from 'node:events';
import path from 'node:path';
import {launchBrowser} from './browser.mjs';
import {createSiteServer} from './preview-site.mjs';
import {createMiniHost} from './mini-host.mjs';
import {readCatalog,root,base} from './site-config.mjs';
import {brandHtml} from '../packages/build-tools/src/brand.mjs';
const mode=process.argv[2]??'web';assert.ok(['web','native'].includes(mode));
const {games,targets}=await readCatalog(),out=path.join(root,'artifacts/entrance'),report=[];
await mkdir(out,{recursive:true});const browser=await launchBrowser();let server,hosts=[];
try {
 if(mode==='web'){
  // Exercise the shell contract independently of game loading and with genuine
  // DOM focus/keyboard events: pending assets, late readiness, failure, retry.
  const fixture=await brandHtml('<html><head></head><body><canvas tabindex="0"></canvas><button id="game">Start</button><div id="already-inert" inert></div><script>window.actions=0;document.addEventListener("keydown",()=>actions++);document.addEventListener("keyup",()=>actions++);document.getElementById("game").onclick=()=>actions++;</script></body></html>','入场恢复检查');
  for(const reducedMotion of ['no-preference','reduce']){
   const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion}),p=await ctx.newPage();let requests=0;
   await p.route('https://entrance.test/**',r=>{requests++;return r.fulfill({contentType:'text/html',body:fixture});});
   await p.goto('https://entrance.test/game-collection/games/fixture/');
   assert.equal(await p.locator('[data-skip]').isDisabled(),true);await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');
   await p.waitForTimeout(950);assert.equal(await p.locator('#collection-entrance').count(),1,'loading cannot time out into an empty game');
   assert.equal(await p.evaluate(()=>actions),0);
   await p.evaluate(()=>{const b=document.createElement('button');b.id='late';document.body.append(b);});
   assert.equal(await p.locator('#late').evaluate(e=>e.inert),true);
   await p.evaluate(()=>document.documentElement.dataset.collectionState='loading');await p.waitForTimeout(50);
   assert.equal(await p.locator('[data-skip]').isDisabled(),true);
   await p.evaluate(()=>document.documentElement.dataset.collectionState='menu');
   if(reducedMotion==='no-preference'){
    await p.waitForTimeout(100);assert.equal(await p.locator('#collection-entrance[data-leaving]').count(),0,'duration starts when assets are ready');
    await p.keyboard.down('Enter');await p.waitForFunction(()=>!document.querySelector('#collection-entrance'));await p.keyboard.up('Enter');
   }else await p.waitForFunction(()=>!document.querySelector('#collection-entrance'));
   assert.equal(await p.evaluate(()=>actions),0,'skip never reaches the game');
   assert.equal(await p.locator('#game').evaluate(e=>e.inert),false);assert.equal(await p.locator('#already-inert').evaluate(e=>e.inert),true);
   await p.locator('#game').click();assert.equal(await p.evaluate(()=>actions),1,'controls recover');
   await p.reload();await p.evaluate(()=>window.dispatchEvent(new ErrorEvent('error',{message:'fixture failed asset'})));
   assert.equal(await p.locator('[data-retry]').isVisible(),true);assert.match(await p.locator('[data-back]').getAttribute('href'),/^\/game-collection\/$/);
   await p.locator('[data-retry]').focus();const n=requests,navigation=p.waitForNavigation({waitUntil:'domcontentloaded'});await p.keyboard.press('Enter');await navigation;assert.ok(requests>n,'retry works by keyboard');
   await ctx.close();report.push({contract:true,reducedMotion,passed:['pending','late-ready','no-key-through','restore-inert','error','keyboard-retry']});
  }
  server=createSiteServer();server.listen(0,'127.0.0.1');await once(server,'listening');
  for(const [i,game]of games.entries()){
   const ctx=await browser.newContext({viewport:i%2?{width:1440,height:900}:{width:390,height:844},reducedMotion:'no-preference'}),p=await ctx.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(String(e)));await p.addInitScript(()=>window.__COLLECTION_TEST__=true);
   let release;const gate=new Promise(r=>release=r);
   await p.route(/\.js(?:\?|$)/,async r=>{await gate;await r.continue();});
   await p.goto(`http://127.0.0.1:${server.address().port}${base}games/${game.slug}/`,{waitUntil:'commit'});
   await p.locator('#collection-entrance').waitFor();assert.equal(await p.locator('[data-skip]').isDisabled(),true);
   await p.screenshot({path:`${out}/web-${game.slug}-entrance.png`});release();
   await p.waitForFunction(()=>document.documentElement.dataset.collectionState,null,{timeout:90000});
   // Touch/mouse skip exercises the same button at its actual position.
   if(await p.locator('[data-skip]').isVisible())await p.locator('[data-skip]').click({timeout:3000}).catch(async e=>{if(await p.locator('#collection-entrance').count())throw e;});
   await p.waitForFunction(()=>!document.querySelector('#collection-entrance'));
   assert.deepEqual(errors,[]);assert.equal(await p.locator('body > [inert]').count(),0);
   if(targets[game.slug].engine==='cocos'){
    const settings=JSON.parse(await readFile(path.join(root,'dist/site/games',game.slug,'src/settings.json'),'utf8'));
    assert.equal(settings.splashScreen.totalTime,0);assert.equal(settings.splashScreen.logo.type,'none');
   }
   await p.screenshot({path:`${out}/web-${game.slug}-ready.png`});await ctx.close();report.push({slug:game.slug,target:'web',passed:['delayed-real-assets','branded-first-frame','ready','skip','restored-controls']});console.log('entrance',game.slug,'web passed');
  }
 }else{
  const normal=await createMiniHost(),cocos=await createMiniHost({cocos:true});hosts=[normal,cocos];
  const labels={'plane-battle':'即刻起飞  →','zombie-lane':'开始守线    ›','garden-guard':'开始守卫','volley-run':'全员出击 →'};
  const phases={'shanhai-run':'menu','surge-squad':'ready','endless-night':'menu','frost-trail':'playing','final-door':'playing'};
  for(const game of games)for(const target of ['weixin','douyin']){
   const isCocos=targets[game.slug].engine==='cocos',p=await browser.newPage({viewport:{width:390,height:844}});
   try{
    await p.goto((isCocos?cocos:normal).url);
    let s=await p.evaluate(({slug,target})=>boot(slug,target,1,{},true),{slug:game.slug,target});
    for(let n=0;n<300&&!s.entrance?.ready;n++){s=await p.evaluate(()=>call({type:'frames',count:1}));assert.deepEqual(s.errors,[]);await p.waitForTimeout(15);}
    assert.equal(s.entrance?.ready,true);assert.equal(s.entrance.done,false);
    assert.ok(isCocos?s.state.labels.includes('开局游戏'):s.texts.some(t=>t.label==='开局游戏'));
    await p.screenshot({path:`${out}/${target}-${game.slug}-entrance.png`});
    // All games consume a full touch gesture on the entrance, including where
    // underlying menu actions will appear. It must only dismiss the entrance.
    for(const name of ['TouchStart','TouchEnd'])await p.evaluate(name=>call({type:'event',name,event:{touches:name==='TouchStart'?[{identifier:1,clientX:195,clientY:640}]:[],changedTouches:[{identifier:1,clientX:195,clientY:640}]}}),name);
    s=await p.evaluate(()=>call({type:'frames',count:4}));assert.equal(s.entrance.done,true);assert.deepEqual(s.errors,[]);
    if(isCocos){assert.deepEqual(s.bootBrand,{drawn:true,ended:true});assert.ok(!s.reads.some(name=>/(^|\/)(logo|slogan)\.png$/.test(name)),'legacy engine branding is never loaded');assert.equal(s.state.phase,phases[game.slug]);assert.ok(!s.state.labels.includes('开局游戏'));assert.equal(s.environment.documentAbsent,true);assert.equal(s.graphics.error,0);}
    else assert.ok(s.texts.some(t=>t.label===labels[game.slug]),'skip leaves initial menu intact');
    await p.screenshot({path:`${out}/${target}-${game.slug}-ready.png`});report.push({slug:game.slug,target,passed:['real-export','brand-drawn','skip-consumed','initial-state-intact']});console.log('entrance',game.slug,target,'passed');
   }finally{await p.close();}
  }
 }
 await writeFile(path.join(out,`${mode}-verification.json`),JSON.stringify(report,null,2)+'\n');
}finally{await browser.close();for(const h of hosts)await h.close();if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}}
