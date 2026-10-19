import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {once} from 'node:events';
import {launchBrowser} from './browser.mjs';
import {presentCocos} from './cocos-browser.mjs';
import {createSiteServer} from './preview-site.mjs';
import {createMiniHost} from './mini-host.mjs';
const [slug,mode='all']=process.argv.slice(2);if(!/^[a-z-]+$/.test(slug??''))throw Error('Provide a game slug');
const {verify}=await import(`../games/${slug}/tests/flows.mjs`),output=`artifacts/cocos/${slug}`;await mkdir(output,{recursive:true});
const server=createSiteServer(process.cwd());server.listen(0,'127.0.0.1');await once(server,'listening');const host=await createMiniHost({cocos:true}),browser=await launchBrowser(),report=[];
try{
 const cases=[...(mode==='web'?[]:['weixin','douyin'].map(target=>({target,viewport:{width:390,height:844}}))),...(mode==='native'?[]:[{width:390,height:844},{width:1440,height:900},{width:844,height:390},{width:320,height:568}].map(viewport=>({target:'web',viewport})))];
 for(const {target,viewport}of cases){
  const context=await browser.newContext({viewport,reducedMotion:'reduce',hasTouch:viewport.width<900}),p=await context.newPage(),errors=[],diagnostics=[];
  p.on('pageerror',e=>errors.push(String(e)));
  p.on('console',m=>{if(m.type()==='error'){
    // Creator 3.8 calls preventDefault on browser-generated, non-cancelable
    // touchcancel events. Record this Chrome diagnostic; still assert that the
    // cancelled gesture is cleared, and fail on every other console error.
    if(m.text().startsWith('Ignored attempt to cancel a touchcancel event with cancelable=false,'))diagnostics.push(m.text());
    else errors.push(m.text());
  }});let latest;
  try{
   const native=target!=='web';let dirty=true;
   if(native){await p.goto(host.url);latest=await p.evaluate(({slug,target})=>boot(slug,target,1),{slug,target});}
   else{await p.addInitScript(()=>window.__COLLECTION_TEST__=true);await p.goto(`http://127.0.0.1:${server.address().port}/game-collection/games/${slug}/dist/web/`);await p.waitForFunction(()=>window.__collectionSnapshot,null,{timeout:90000})}
   async function state(){if(native){latest=await p.evaluate(count=>call({type:'frames',count}),dirty?2:0);assert.deepEqual(latest.errors,[]);dirty=!latest.state||latest.state.phase==='loading';return latest.state}const snapshot=dirty?await presentCocos(p):await p.evaluate(()=>window.__collectionSnapshot);dirty=!snapshot||snapshot.phase==='loading';return snapshot}
   for(let i=0;i<150;i++){const s=await state();if(s&&s.phase!=='loading')break;await p.waitForTimeout(75)}
   assert.ok((await state())?.controls?.length,'Creator scene failed to load');
   if(!native)await p.waitForFunction(()=>!document.querySelector('#collection-entrance'));
   async function event(name,x=0,y=0){dirty=true;latest=await p.evaluate(({name,x,y})=>call({type:'event',name,event:{touches:name==='TouchEnd'?[]:[{identifier:1,clientX:x,clientY:y,pageX:x,pageY:y}],changedTouches:[{identifier:1,clientX:x,clientY:y,pageX:x,pageY:y}]}}),{name,x,y});}
   async function click(id){const s=await state(),b=s.controls.find(b=>b.id===id);assert.ok(b,`missing ${id}: ${s.controls.map(b=>b.id)}`);if(native){await event('TouchStart',b.x,b.y);await event('TouchEnd',b.x,b.y);await state()}else{await p.getByRole('button',{name:b.label,exact:true}).nth(s.controls.filter(c=>c.label===b.label).findIndex(c=>c.id===id)).click();dirty=true;await state()}}
   async function advance(count){if(native)latest=await p.evaluate(count=>call({type:'advance',count}),count);else{await presentCocos(p);await p.evaluate(count=>__collectionAdvance(count),count);dirty=true}await p.waitForTimeout(80);return state()}
   async function fits(){const s=await state();for(const b of s.controls){assert.ok(b.x-b.width/2>=-1&&b.x+b.width/2<=viewport.width+1,`horizontal overflow ${b.id}`);assert.ok(b.y-b.height/2>=-1&&b.y+b.height/2<=viewport.height+1,`vertical overflow ${b.id}`)}for(let i=0;i<s.controls.length;i++)for(let j=i+1;j<s.controls.length;j++){const a=s.controls[i],b=s.controls[j];assert.ok(Math.abs(a.x-b.x)>=(a.width+b.width)/2-.1||Math.abs(a.y-b.y)>=(a.height+b.height)/2-.1,`controls overlap ${a.id}/${b.id}`)}}
   async function capture(name){dirty=true;await state();await p.screenshot({path:`${output}/${target}-${viewport.width}-${name}.png`})}
   const flows=await verify({p,native,target,viewport,state,click,advance,event,fits,capture});
   assert.deepEqual(errors,[]);if(native){assert.equal(latest.environment.documentAbsent,true);assert.equal(latest.environment.windowAbsent,true);assert.equal(latest.graphics.error,0);assert.ok(latest.graphics.colors>100);}
   report.push({target,viewport,flows,errors,diagnostics,...native?{environment:latest.environment,graphics:latest.graphics,sounds:latest.sounds}:{}});console.log(slug,target,viewport.width,'passed');
  }catch(e){await p.screenshot({path:`${output}/${target}-${viewport.width}-failure.png`});await writeFile(`${output}/${target}-${viewport.width}-failure.json`,JSON.stringify({message:String(e),errors,latest},null,2));throw e}finally{await context.close()}
 }
 await writeFile(`${output}/${mode}-verification.json`,JSON.stringify(report,null,2)+'\n');
}finally{await browser.close();await host.close();server.closeAllConnections();await new Promise(r=>server.close(r))}
