import {Game,createGame,LEVELS,WEAPONS,DT,clamp,demoInput,validateReplay} from './simulation/game.js';
import {webRuntime} from './render/web-runtime.js';
import {reportGameState} from '@game-collection/platform/web-state';
import {World} from './render/world.js';
import {AudioEngine} from './ui/audio.js';
const $=id=>document.getElementById(id),shell=$('game-shell'),audio=new AudioEngine();
let world,game,level=0,mode='play',replayData=null,replayIndex=0,replayTarget=1.95,manual=false,finished=false,resultPending=false,last=performance.now(),accumulator=0,toastUntil=0,showDiagnostics=false,fps=60,samples=[],keys=new Set(),drag=null,previousFocus=null;
const params=new URLSearchParams(location.search),qa=params.get('qa')==='1'||globalThis.__VOLLEY_QA__===true;
function safeRead(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Private browsing must not block play. */}}
const storedSettings=safeRead('volley.settings.v1',{}),storedProgress=safeRead('volley.progress.v1',{});
const settings={quality:['high','balanced','low'].includes(storedSettings?.quality)?storedSettings.quality:(matchMedia('(max-width: 540px)').matches?'balanced':'high'),sound:storedSettings?.sound!==false};
const progress={best:[0,1,2].map(i=>Number.isFinite(storedProgress?.best?.[i])?clamp(storedProgress.best[i],0,96):0),cleared:Array.isArray(storedProgress?.cleared)?[...new Set(storedProgress.cleared.filter(x=>Number.isInteger(x)&&x>=0&&x<3))]:[]};
function notify(text,bad=false,seconds=1.6){$('toast').textContent=text;$('toast').className='show'+(bad?' bad':'');toastUntil=performance.now()+seconds*1000;}
function syncSound(){ $('audio-btn').textContent=audio.enabled?'♪':'♩';$('audio-btn').style.opacity=audio.enabled?'1':'.55';$('audio-btn').setAttribute('aria-label',audio.enabled?'关闭声音':'开启声音');settings.sound=audio.enabled;save('volley.settings.v1',settings);}
function modal(title,body,actions,kicker='BLUE COMPANY'){
 previousFocus=document.activeElement;$('modal-title').textContent=title;$('modal-body').innerHTML=body;$('modal-kicker').textContent=kicker;$('modal-actions').replaceChildren();
 for(const action of actions){const b=document.createElement('button');b.className=action.primary?'primary-btn':'secondary-btn';b.textContent=action.text;b.addEventListener('click',action.onClick);$('modal-actions').append(b);}
 $('modal').hidden=false;$('modal-actions').querySelector('button')?.focus();
}
function closeModal(){ $('modal').hidden=true;if(game?.phase==='paused'&&!finished)game.pause();previousFocus?.focus?.();keys.clear();accumulator=0;}
function pause(){if(game.phase==='running'){drag=null;keys.clear();game.pause();modal('歇口气，再出发。','<p>队伍与战场已暂停。<br>下一次走位，也许就是翻盘的机会。</p>',[{text:'继续突击',primary:true,onClick:closeModal},{text:'重新开始',onClick:()=>start(mode==='demo'?'demo':'play')},{text:'返回集合点',onClick:home},{text:'导出本次输入回放',onClick:exportReplay}],'TACTICAL PAUSE');}else if(game.phase==='paused')closeModal();}
function controls(e){
 if(e.type==='pointerdown'){if(game.phase!=='running'||mode!=='play')return;drag={id:e.pointerId,x:e.clientX,target:game.targetX};$('world').setPointerCapture(e.pointerId);}
 if(e.type==='pointermove'&&drag&&drag.id===e.pointerId){game.setTarget(drag.target+(e.clientX-drag.x)/shell.clientWidth*11.4);}
 if(e.type==='pointerup'||e.type==='pointercancel')drag=null;
}
function resetState(selected=level,seed=LEVELS[selected].seed,version=2){level=selected;game=createGame({level,seed,version});world.reset(game);finished=false;resultPending=false;accumulator=0;replayIndex=0;replayTarget=game.targetX;keys.clear();drag=null;$('toast').className='';$('mission-index').textContent=String(level+1).padStart(2,'0');$('mission-name').textContent=LEVELS[level].name;$('route-btn').innerHTML=`0${level+1} / ${LEVELS[level].name} <span>切换路线 ↻</span>`;}
function start(nextMode='play',data=null){
 try{audio.unlock();}catch{/* Audio is optional. */}
 mode=nextMode;replayData=data;resetState(data?.level??level,data?.seed??LEVELS[level].seed,data?.version??2);game.start();manual=false;
 $('intro').hidden=true;$('modal').hidden=true;$('hud').hidden=false;$('bottom-hud').hidden=false;$('controls-hint').hidden=mode!=='play';$('replay-badge').hidden=mode==='play';$('replay-badge').textContent=mode==='demo'?'演示控制 · 真实战斗':'输入回放 · 同一种子';
 if(mode==='play')notify('瞄准蓝门，射击增加人数',false,2.8);
}
function home(){mode='play';replayData=null;resetState();$('intro').hidden=false;$('modal').hidden=true;$('hud').hidden=true;$('bottom-hud').hidden=true;$('boss-hud').hidden=true;$('controls-hint').hidden=true;$('replay-badge').hidden=true;}
function showResults(){
 if(finished)return;finished=true;const win=game.phase==='won',s=game.stats,verified=mode==='replay';
 if(win&&mode==='play'){progress.best[level]=Math.max(progress.best[level]||0,game.troops.length);if(!progress.cleared.includes(level))progress.cleared.push(level);save('volley.progress.v1',progress);}
 const body=`<p>${win?'巨型守卫倒下了。<br>每一个留下来的队员，都算数。':'小队没能突破防线。<br>先射蓝色增员门，再击碎武器舱，避开橙色警戒区域。'}</p><div class="stat-grid"><div><strong>${game.troops.length}</strong><span>实际剩余队员</span></div><div><strong>${s.kills}</strong><span>击败敌人</span></div><div><strong>${s.recruited}</strong><span>累计增援</span></div><div><strong>${s.lost}</strong><span>实际损失</span></div></div><p style="font-size:10px;opacity:.75">${(game.tick/60).toFixed(1)} 秒 · 种子 ${game.seed}${mode==='demo'?' · 演示控制（不计个人纪录）':''}${verified?' · 输入回放':''}</p>`;
 const actions=[{text:win&&level<2?'下一条防线':'再来一次',primary:true,onClick:()=>{if(win&&level<2)level++;start('play');}},{text:'导出输入回放',onClick:exportReplay},{text:'返回集合点',onClick:home}];
 modal(win?'突围成功':'这次，还差一点。',body,actions,mode==='demo'?'DEMO / REAL SIMULATION':win?'MISSION COMPLETE':'MISSION FAILED');
}
function exportReplay(){
 const data=game.replay(),blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`volley-run-l${level+1}-seed${game.seed}-t${game.tick}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);notify('输入回放已导出');
}
function help(){const running=game.phase==='running';if(running)game.pause();modal('一支小队，一路火力。',`<div class="help-step"><span>01</span><p><strong>左右拖动，自动射击</strong><br>鼠标、触屏，或 A / D、方向键。每个活着的队员都会独立开火。</p></div><div class="help-step"><span>02</span><p><strong>瞄准数字门，积累增援</strong><br>蓝门被击中会增加数值；红门也能被打到正数。整队中心通过哪一侧，就选择哪一侧。</p></div><div class="help-step"><span>03</span><p><strong>击碎玻璃舱，驶过领取</strong><br>把倒计数打到零，再靠近收取新武器。直接撞上未打开的舱会损失队员。</p></div><div class="help-step"><span>04</span><p><strong>留住队员，击败巨像</strong><br>避开橙色范围预警；敌人和障碍都造成真实损失。只有打空最终守卫血量才算胜利。</p></div>`,[{text:'明白，出发',primary:true,onClick:()=>{if(running)closeModal();else start('play');}}],'FIELD MANUAL');}
function showSettings(){if(game.phase==='running')game.pause();modal('选择你的画质。',`<p>三档画质使用相同游戏规则。<br>手机发热或帧率偏低时，选择「均衡」。</p><div class="settings-options"><button data-quality="high">精细</button><button data-quality="balanced">均衡</button><button data-quality="low">轻量</button></div><p style="font-size:11px">精细：4× 抗锯齿、选择性辉光、4K 阴影，最高 2× 像素比。<br>均衡：2× 抗锯齿、低分辨率辉光与阴影，保留完整模型。<br>轻量：关闭后期处理与实时阴影，保留接触阴影。</p>`,[{text:'完成',primary:true,onClick:closeModal}],'GRAPHICS');
 document.querySelectorAll('[data-quality]').forEach(b=>{b.classList.toggle('active',b.dataset.quality===world.quality);b.onclick=()=>{world.setQuality(b.dataset.quality);settings.quality=world.quality;save('volley.settings.v1',settings);document.querySelectorAll('[data-quality]').forEach(x=>x.classList.toggle('active',x===b));};});
}
function hud(events){
 $('troop-count').textContent=String(game.troops.length);$('weapon-tier').textContent=['MK. I','MK. II','MK. III'][game.weapon];$('weapon-name').textContent=WEAPONS[game.weapon].name;$('progress-fill').style.width=Math.min(100,game.distance/game.config.length*100)+'%';
 $('controls-hint').hidden=mode!=='play'||game.tick>300||game.phase!=='running';
 const boss=game.enemies.find(e=>e.final&&e.alive&&e.d-game.distance<67);$('boss-hud').hidden=!boss||game.phase==='ready'||!$('intro').hidden;if(boss){const projected=world.project(boss.x,boss.d,game,6.42);if(projected.y>80&&projected.y<world.height*.74)$('boss-hud').hidden=true;$('boss-hp').textContent=Math.ceil(boss.hp);$('boss-fill').style.width=boss.hp/boss.maxHP*100+'%';}
 for(const e of events){
  audio.event(e);
  if(e.type==='recruit')notify(`增援 +${e.n}`);
  else if(e.type==='upgrade')notify(`${WEAPONS[e.tier].name} · 火力升级`,false,2);
  else if(e.type==='warning')notify('危险！离开橙色区域',true,1.4);
  else if(e.type==='loss')notify(`损失 ${e.n} 名队员`,true,1.1);
  else if(e.type==='pod-open')notify('武器舱已打开 · 靠近领取',false,1.7);
 }
 if(performance.now()>toastUntil)$('toast').className='';
 if(showDiagnostics){const m=world.metrics();$('diagnostics').textContent=`FPS ${fps.toFixed(1)} / ${m.drawCalls} draws\n${m.triangles.toLocaleString()} tris\nliving ${m.livingBlue} = ${game.troops.length}\ntick ${game.tick} · ${game.phase}\nseed ${game.seed} · ${mode}`;}
}
function tick(){
 if(mode==='demo')game.step(demoInput(game));
 else if(mode==='replay'){
  if(game.tick>=replayData.ticks){game.phase=game.phase==='running'?'paused':game.phase;finished=true;modal('回放结束',`<p>已按原始种子与输入重演 <strong>${game.tick}</strong> 个模拟帧。<br>实际剩余 <strong>${game.troops.length}</strong> 人。</p>`,[{text:'再次播放',primary:true,onClick:()=>start('replay',replayData)},{text:'返回集合点',onClick:home}],'REPLAY COMPLETE');return;}
  while(replayIndex<replayData.inputs.length&&replayData.inputs[replayIndex][0]<=game.tick)replayTarget=replayData.inputs[replayIndex++][1];game.step(replayTarget);
 }else{
  const direction=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);if(direction)game.setTarget(game.targetX+direction*DT*10);game.step();
 }
}
function frame(now){
 reportGameState(!$('intro').hidden?'menu':!$('modal').hidden?(finished?'result':'paused'):game?.phase==='running'?'playing':game?.phase==='ready'?'menu':'result');
 requestAnimationFrame(frame);const rawDelta=Math.max(0,(now-last)/1000),delta=Math.min(.15,rawDelta);last=now;if(rawDelta>0){samples.push(1/rawDelta);if(samples.length>45)samples.shift();fps=samples.length/samples.reduce((s,v)=>s+1/v,0);}
 const events=[];
 if(game?.phase==='running'&&!manual){accumulator+=delta;let n=0;while(accumulator>=DT&&n++<9){tick();events.push(...game.drainEvents());accumulator-=DT;if(game.phase!=='running')break;}}else accumulator=0;
 if(!game)return;if(!manual)world.draw(game,events);hud(events);audio.music(game.phase==='running'&&!manual);
 if((game.phase==='won'||game.phase==='lost')&&!finished&&!resultPending){resultPending=true;const current=game;setTimeout(()=>{if(game===current)showResults();},700);}
}
async function boot(){
 try{
  world=await World.create(webRuntime($('world')),p=>$('loading-fill').style.width=`${p*100}%`);
  world.setQuality(['high','balanced','low'].includes(settings.quality)?settings.quality:'high');if(!settings.sound)audio.enabled=false;syncSound();resetState();$('loading').hidden=true;$('intro').hidden=false;
  $('start-btn').onclick=()=>start();$('demo-btn').onclick=()=>start('demo');$('route-btn').onclick=()=>{level=(level+1)%3;home();};$('pause-btn').onclick=pause;$('audio-btn').onclick=()=>{try{audio.unlock();audio.toggle();syncSound();}catch{notify('此浏览器无法启用音频',true);}};
  $('help-btn').onclick=help;$('settings-btn').onclick=showSettings;$('modal-close').onclick=()=>{if(finished||game.phase==='won'||game.phase==='lost')home();else closeModal();};$('import-btn').onclick=()=>$('replay-file').click();
  $('replay-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5*1024*1024)throw new Error('回放文件超过 5 MB');const data=validateReplay(JSON.parse(await file.text()));start('replay',data);}catch(error){notify(error.message||'回放无法读取',true,3);}e.target.value='';};
  for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])$('world').addEventListener(type,controls);
  window.addEventListener('keydown',e=>{
   if(['Space','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat)return;
   if(!$('modal').hidden&&e.code==='Tab'){const buttons=[...$('modal').querySelectorAll('button')].filter(x=>!x.disabled);const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}
   if(e.code==='Space'){if(game.phase==='ready')start();else if(!finished)pause();}
   else if(e.code==='Escape'){if(!$('modal').hidden){if(finished)home();else closeModal();}else if(game.phase==='running')pause();}
   else if(e.code==='KeyR')start();
   else if(e.code==='F3'){e.preventDefault();showDiagnostics=!showDiagnostics;$('diagnostics').hidden=!showDiagnostics;}
   else if(e.code==='KeyH')shell.classList.toggle('photo');
   keys.add(e.code);
  });window.addEventListener('keyup',e=>keys.delete(e.code));
  const loseFocus=()=>{keys.clear();drag=null;if(game.phase==='running'&&!manual)pause();};window.addEventListener('blur',loseFocus);document.addEventListener('visibilitychange',()=>{if(document.hidden)loseFocus();});
  $('world').addEventListener('render-lost',()=>{if(game.phase==='running')pause();$('error-panel').hidden=false;$('error-panel').innerHTML='<h2>图形上下文已中断</h2><p>战斗已安全暂停。浏览器正在尝试恢复图形资源。</p><button class="primary-btn" onclick="location.reload()">重新载入</button>';});$('world').addEventListener('render-restored',()=>{$('error-panel').hidden=true;notify('图形已恢复 · 点击继续');});
  window.__VOLLEY__={
   ready:true,state:()=>game.summary(),metrics:()=>({...world.metrics(),fps}),exportReplay:()=>game.replay(),
   start:(options={})=>{if(options.level!==undefined)level=clamp(Math.trunc(options.level),0,2);start(options.demo?'demo':'play');},
   steer:x=>game.setTarget(x),pause,
   ...(qa?{
    advance:(ticks=1,automated=false)=>{manual=true;const fromTick=game.tick,events=[];for(let i=0;i<Math.min(36000,ticks);i++){if(game.phase!=='running')break;if(automated)game.step(demoInput(game));else tick();events.push(...game.drainEvents());if(events.length>6000){const cutoff=game.tick-90;while(events.length&&events[0].tick<cutoff)events.shift();}}const recent=events.filter(e=>e.tick>=game.tick-90);world.draw(game,recent);hud(recent.filter(e=>e.tick>game.tick-4));return game.summary();},
    manual:value=>{manual=!!value;},setQuality:q=>world.setQuality(q),getGame:()=>game,audioState:()=>({enabled:audio.enabled,state:audio.ctx?.state??'uninitialized',gain:audio.master?.gain.value??0}),context:()=>world.renderer.getContext(),
    pose:(setup)=>{manual=true;setup(game);world.draw(game,[]);hud([]);return game.summary();},
    render:()=>{world.draw(game,game.drainEvents());hud([]);},
    artState:()=>({parts:world.blue.parts.map(p=>({name:p.name,count:p.mesh.count})),effects:{sparks:world.effects.sparks.count,smoke:world.effects.smoke.count,flashes:world.effects.flashes.count,shards:world.effects.shards.count,ghosts:world.effects.ghosts.length,rings:world.effects.ringMesh.count,ages:world.effects.list.map(p=>({life:p.life,total:p.total})),shardAlpha:Array.from(world.effects.shards.userData.alpha.array.slice(0,world.effects.shards.count))},camera:{fov:world.camera.fov,near:world.camera.near,position:world.camera.position.toArray(),troops:game.troops.map(t=>world.project(t.x,t.d,game,1.1))},post:{enabled:world.postFX.enabled,depthType:world.postFX.colour?.depthTexture?.type},pods:game.pods.map(p=>({id:p.id,unlocked:p.unlocked,alive:p.alive,glass:world.podViews.get(p.id)?.glass.visible,lightning:world.podViews.get(p.id)?.lightning.visible})),legMatrix:Array.from(world.blue.parts.find(p=>p.name==='legL').mesh.instanceMatrix.array.slice(0,16))}),
    inspection:()=>({bossLabels:[...world.bossLabels].map(([id,label])=>({id,visible:label.visible})),followers:world.effects.list.filter(p=>p.follow&&p.life>0&&p.stretch).map(p=>({x:p.x,d:p.d,offsetX:p.ox-p.ax,offsetD:p.od-p.ad,life:p.life})),mean:{x:game.troops.reduce((a,t)=>a+t.x,0)/Math.max(1,game.troops.length),d:game.troops.reduce((a,t)=>a+t.d,0)/Math.max(1,game.troops.length)},corners:game.troops.flatMap(t=>[-1,1].flatMap(side=>[0,1.7].map(y=>world.project(t.x+side*.54,t.d,game,y)))),width:world.width,height:world.height,bossLeg:Array.from(world.boss.parts.find(p=>p.name==='legL').mesh.instanceMatrix.array.slice(0,16)),fxMatrices:{shards:Array.from(world.effects.shards.instanceMatrix.array.slice(0,world.effects.shards.count*16)),rings:Array.from(world.effects.ringMesh.instanceMatrix.array.slice(0,world.effects.ringMesh.count*16))}}),
    replay:data=>{validateReplay(data);start('replay',data);}
   }:{})
  };
  if(params.get('demo')==='1')start('demo');last=performance.now();requestAnimationFrame(frame);
 }catch(error){console.error(error);$('load-note').textContent=error.message;$('error-panel').hidden=false;$('error-panel').innerHTML='<h2>战场暂时无法载入</h2><p>请刷新重试，或使用支持 WebGL 的较新浏览器。</p><button class="primary-btn" onclick="location.reload()">重新载入</button>';}
}
boot();
