import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const output=path.resolve('artifacts/public-references');await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
const targets=[['endless-night','https://endless-night.qilei991012.chatgpt.site/']];
try{
for(const [slug,origin] of targets){
 const dir=path.join(output,slug),seen=new Set(),queue=[],writes=[],report={origin,capturedAt:new Date().toISOString(),requests:[],states:[],errors:[]};await mkdir(dir,{recursive:true});
 const save=async(url,body,type)=>{const parsed=new URL(url);if(parsed.origin!==new URL(origin).origin)return;let rel=decodeURIComponent(parsed.pathname).replace(/^\//,'')||'index.html';if(rel.includes('..'))return;if(rel.endsWith('/'))rel+='index.html';const dest=path.join(dir,'mirror',rel);await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,body);report.requests.push({url,path:rel,bytes:body.length,type});if(/javascript|text\/css/.test(type)||/\.(js|css)$/.test(rel)){const text=body.toString();for(const m of text.matchAll(/["'`](\.{1,2}\/[^"'`\s]+\.(?:js|json|wasm|glb|png|webp|svg|css)|\/(?:src|assets|vendor|design)\/[^"'`\s]+)["'`]/g)){const target=new URL(m[1],url).href;if(!seen.has(target)){seen.add(target);queue.push(target)}}}};
 for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
 const ctx=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'reduce',locale:'zh-CN',isMobile:viewport.width<600,hasTouch:viewport.width<600}),p=await ctx.newPage();p.setDefaultTimeout(12000);
 p.on('pageerror',e=>report.errors.push(String(e)));p.on('response',r=>{if(r.ok()&&r.url().startsWith(origin)){const task=r.body().then(body=>save(r.url(),body,r.headers()['content-type']??'')).catch(e=>report.errors.push(String(e)));writes.push(task)}});
 try{
 await p.goto(origin,{waitUntil:'domcontentloaded',timeout:60000}).catch(e=>report.errors.push(String(e)));await p.waitForTimeout(4500);
 const snap=async(state)=>{const file=`${viewport.width}-${state}.png`;await p.screenshot({path:path.join(dir,file)});await writeFile(path.join(dir,`${viewport.width}-${state}.html`),await p.content());const buttons=await p.getByRole('button').allTextContents();report.states.push({file,viewport,state,buttons});console.log(slug,viewport.width,state,buttons)};
 await snap('initial');
 if(slug==='surge-squad'){
 for(const title of ['设置','玩法']){const b=p.getByRole('button',{name:new RegExp(title)}).first();if(await b.isVisible()){await b.click();await p.waitForTimeout(300);await snap(title);const close=p.getByRole('button',{name:/关闭|返回/}).first();if(await close.isVisible())await close.click()}}
 const play=p.getByRole('button',{name:/开始|出击|突破|演示/}).first();if(await play.isVisible()){await play.click();await p.waitForTimeout(6000);await snap('playing');}
 }else if(slug==='frost-trail'){
 const play=p.getByRole('button',{name:/开始|进入|出发|继续/}).first();if(await play.isVisible()){await play.click();await p.waitForTimeout(1500)}await snap('playing');
 await p.keyboard.down('KeyW');await p.waitForTimeout(1000);await p.keyboard.up('KeyW');
 for(const title of ['营地','建造','地图','设置']){const b=p.getByRole('button',{name:new RegExp(title)}).first();if(await b.isVisible()){await b.click();await p.waitForTimeout(400);await snap(title);const close=p.getByRole('button',{name:/关闭|返回/}).first();if(await close.isVisible())await close.click()}}
 }else{
 for(const title of ['减少闪烁','Reduce flashing','我已了解','Continue','继续','确认']){const b=p.getByRole('button',{name:new RegExp(title)}).first();if(await b.isVisible()){await b.click();await p.waitForTimeout(2000);break}}
 await snap('menu');for(let step=0;step<5;step++){const play=p.getByRole('button',{name:/^(Play|Continue|Start|Begin|Embark|继续|开始|启程|出发|进入)/i}).first();if(!(await play.isVisible()))break;await play.click();await p.waitForTimeout(3000);await snap('play-step-'+step)}
 }
 }catch(e){report.errors.push(String(e));await p.screenshot({path:path.join(dir,`${viewport.width}-error.png`)}).catch(()=>{})}finally{await ctx.close()}
 }
 await Promise.allSettled(writes);
 for(let n=0;n<queue.length&&n<200;n++){
 const url=queue[n];try{const r=await fetch(url,{signal:AbortSignal.timeout(15000)});if(r.ok)await save(url,Buffer.from(await r.arrayBuffer()),r.headers.get('content-type')??'');else report.errors.push(`${r.status} ${url}`)}catch(e){report.errors.push(`${url} ${e}`)}
 }
 await writeFile(path.join(dir,'report.json'),JSON.stringify(report,null,2));console.log(slug,'saved',report.requests.length,'requests',report.states.length,'states');
}
}finally{await browser.close()}
