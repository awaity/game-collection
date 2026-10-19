import {Game as LegacyGame, runReplay as runLegacyReplay} from './game-v1.js';
/** Deterministic game rules. No DOM, rendering, wall-clock, or Math.random here. */
export const DT=1/60, MAX_TROOPS=96, ROAD_HALF=5.25;
export const WEAPONS=[{name:'脉冲步枪',damage:1,interval:11,speed:44},{name:'电弧连射',damage:2,interval:10,speed:49},{name:'双联重炮',damage:3,interval:9,speed:52}];
export const LEVELS=[{name:'赤岩长桥',subtitle:'CANYON CROSSING',length:143,speed:8.6,bossHP:1700,seed:91261},{name:'烈日防线',subtitle:'SUNBREAK LINE',length:166,speed:9.0,bossHP:2200,seed:28017},{name:'最后一击',subtitle:'LAST VOLLEY',length:188,speed:9.3,bossHP:2800,seed:74139},{name:'翡翠栈道',subtitle:'EMERALD PASS',length:156,speed:8.4,bossHP:1950,seed:62731,theme:1},{name:'极光长桥',subtitle:'AURORA BRIDGE',length:174,speed:8.8,bossHP:2400,seed:19287,theme:2},{name:'霓虹环线',subtitle:'NEON CIRCUIT',length:194,speed:9.5,bossHP:2850,seed:81823,theme:3}];
// Geometry and projectile/selection bounds share this width; no invisible wide gate.
export const gateWidth=value=>clamp(1.20+Math.abs(value)*.26,1.50,3.65);
export function rng(seed){let a=seed>>>0||1;return()=>{a^=a<<13;a^=a>>>17;a^=a<<5;return(a>>>0)/4294967296;};}
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function formation(n){
 const cells=[];for(let row=-8;row<=8;row++)for(let col=-8;col<=8;col++){
  const x=(col+(row&1)*.5)*.62,d=row*.56;
  cells.push({x,d,score:x*x+d*d*1.15});
 }
 cells.sort((a,b)=>a.score-b.score||b.d-a.d||a.x-b.x);
 const chosen=cells.slice(0,n),cx=chosen.reduce((s,p)=>s+p.x,0)/Math.max(n,1),cd=chosen.reduce((s,p)=>s+p.d,0)/Math.max(n,1);
 return chosen.map(p=>({x:p.x-cx,d:p.d-cd}));
}
export class Game{
 constructor({level=0,seed=LEVELS[level]?.seed??91261,modifiers={}}={}){
  this.level=Number.isFinite(level)?clamp(Math.trunc(level),0,LEVELS.length-1):0;this.config=LEVELS[this.level];this.seed=(Number.isFinite(seed)?seed:this.config.seed)>>>0;this.random=rng(this.seed);
  this.modifiers={power:clamp(Math.floor(modifiers.power||0),0,5),haste:clamp(Math.floor(modifiers.haste||0),0,5),guard:clamp(Math.floor(modifiers.guard||0),0,5),pressure:clamp(Math.floor(modifiers.pressure||0),0,30),carry:clamp(Math.floor(modifiers.carry||0),0,96)};
  this.config={...this.config,bossHP:this.config.bossHP*(1+this.modifiers.pressure*.08)};
  this.tick=0;this.distance=0;this.phase='ready';this.targetX=1.95;this.centerX=1.95;this.weapon=0;
  this.troops=[];this.enemies=[];this.gates=[];this.pods=[];this.bullets=[];this.events=[];this.inputLog=[];this.nextId=1;this.slots=[];this.lastInput=null;
  this.stats={shots:0,hits:0,kills:0,recruited:0,lost:0,upgrades:0,gates:0,peak:8,bossDamage:0};this.finalBossKilled=false;this.reason='';
  this.addTroops(Math.max(8+this.modifiers.guard*2,this.modifiers.carry),false);this.layout();this.events=[];
 }
 id(){return this.nextId++;}
 emit(type,data={}){this.events.push({type,tick:this.tick,...data});if(this.events.length>320)this.events.shift();}
 layout(){
  const level=this.level%3;
  const gate=(d,x,value,operation='add')=>this.gates.push({id:this.id(),d,x,width:gateWidth(value),base:value,value,operation,maxGain:d>=128?4:12,charge:0,alive:true,flash:-100});
  const pod=(d,x,hp,tier)=>this.pods.push({id:this.id(),d,x,width:3.65,hp,maxHP:hp,tier,alive:true,unlocked:false,flash:-100});
  const addEnemy=(x,d,hp)=>this.enemies.push({id:this.id(),kind:'raider',x,d,hp:hp+level,maxHP:hp+level,alive:true,phase:this.random()*6.28,hitTick:-100,move:.35+this.random()*.35});
  const wave=(d,x,n,hp=2,spread=1)=>{for(const p of formation(n))addEnemy(x+p.x*spread,d+p.d,hp);};
  const boss=(d,x,hp,final=false)=>this.enemies.push({id:this.id(),kind:'boss',x,d,hp,maxHP:hp,alive:true,final,phase:0,hitTick:-100,move:0,nextAttack:0,warning:null});
  // Compact, authored encounters: recruit → pressure → heavy weapon → dense final front.
  wave(17,-2.7,3);gate(29,2.65,3);pod(29,-2.65,40,1);
  wave(46,0,8);pod(58,2.65,87,1);boss(60,-1.45,100+level*35);
  wave(72,-2.6,8,4);wave(75,2.45,7,4);
  for(const e of this.enemies)if(e.kind==='raider'&&e.d>68&&e.d<79){e.rush=true;e.move=2.4;}
  pod(98,-2.65,57+level*9,2);gate(98,2.65,-8);
  wave(112,-.2,9,2);gate(128,-2.65,1);pod(128,2.65,64+level*8,2);
  if(level>=1){wave(140,-2.2,9,3);gate(150,2.65,3);pod(150,-2.65,72,2);}
  if(level===2){wave(164,2.2,10,3);gate(175,-2.65,3);pod(175,2.65,85,2);}
  if(this.level>=3){for(const entity of [...this.gates,...this.pods])if(entity.d>40)entity.x*=-1;wave(84,0,6+level*2,3);pod(this.config.length-12,0,45+level*8,2);}
  const end=this.config.length;
  boss(end+16,0,this.config.bossHP,true);
  // Rectangular, staggered ranks rather than a circular fan. Every figure has real HP.
  const columns=17,rows=10+level*2;
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
   const x=(col-(columns-1)/2)*.55+(row%2?.11:-.11);
   addEnemy(x,end+24+row*.61,5);
  }
 }

 start(){if(this.phase==='ready')this.phase='running';}
 pause(){if(this.phase==='running')this.phase='paused';else if(this.phase==='paused')this.phase='running';}
 addTroops(n,announce=true){
  n=clamp(Math.floor(n),0,MAX_TROOPS-this.troops.length);if(!n)return 0;
  const old=this.troops.length;
  for(let i=0;i<n;i++)this.troops.push({id:this.id(),x:this.centerX+(this.random()-.5)*.2,d:this.distance-1-this.random(),born:this.tick,phase:this.random()*6.28});
  this.slots=formation(this.troops.length);
  if(!announce){for(let i=0;i<this.troops.length;i++){this.troops[i].x=this.centerX+this.slots[i].x;this.troops[i].d=this.distance+this.slots[i].d;}}
  if(announce){this.stats.recruited+=n;this.emit('recruit',{n,x:this.centerX,d:this.distance,count:this.troops.length});}
  this.stats.peak=Math.max(this.stats.peak,old+n);return n;
 }
 removeTroops(ids,reason='enemy'){
  const set=new Set(ids);const removed=this.troops.filter(t=>set.has(t.id));
  for(const t of removed)this.emit('casualty',{x:t.x,d:t.d,id:t.id,reason});
  this.troops=this.troops.filter(t=>!set.has(t.id));this.stats.lost+=removed.length;this.slots=formation(this.troops.length);
  if(removed.length)this.emit('loss',{n:removed.length,x:this.centerX,d:this.distance});
  return removed.length;
 }
 hitEnemy(e,damage){
  if(!e.alive)return;
  const actual=Math.min(e.hp,damage);e.hp-=damage;e.hitTick=this.tick;
  if(e.kind==='boss')this.stats.bossDamage+=actual;
  if(e.hp<=0){e.hp=0;e.alive=false;this.stats.kills++;this.emit(e.kind==='boss'?'boss-kill':'kill',{x:e.x,d:e.d,id:e.id,final:!!e.final});if(e.final)this.finalBossKilled=true;}
 }
 setTarget(x){if(Number.isFinite(x))this.targetX=clamp(x,-4.8,4.8);}
 step(input=this.targetX,record=true){
  if(this.phase!=='running')return;
  if(Number.isFinite(input))this.setTarget(input);
  const quantized=Math.round(this.targetX*1000)/1000;this.targetX=quantized;
  if(record&&quantized!==this.lastInput){this.inputLog.push([this.tick,quantized]);this.lastInput=quantized;}
  this.tick++;
  const scroll=this.finalBossKilled?0:Math.min(this.config.speed*DT,Math.max(0,this.config.length-this.distance));this.distance+=scroll;
  const radius=this.slots.reduce((r,p)=>Math.max(r,Math.abs(p.x)),0)+.38;
  const edge=Math.max(0,ROAD_HALF-radius);this.centerX+=(clamp(this.targetX,-edge,edge)-this.centerX)*.14;
  const weapon=WEAPONS[this.weapon];
  for(let i=0;i<this.troops.length;i++){
   const t=this.troops[i],p=this.slots[i];t.x+=(this.centerX+p.x-t.x)*.19;t.d+=(this.distance+p.d-t.d)*.25;
   const period=weapon.interval*(1-this.modifiers.haste*.04),shotTick=this.tick+t.id*7;
   if(Math.floor(shotTick/period)>Math.floor((shotTick-1)/period)){
    this.bullets.push({id:this.id(),x:t.x+.20,d:t.d+.72,prevD:t.d+.72,damage:weapon.damage*(1+this.modifiers.power*.12),speed:weapon.speed,tier:this.weapon,born:this.tick,alive:true});this.stats.shots++;
    this.emit('shot',{x:t.x+.20,d:t.d+.73,tier:this.weapon,id:t.id});
   }
  }
  // Only nearby objects participate in swept forward projectile tests; distant authored waves cost no collision work.
  const objects=[...this.gates.filter(e=>e.alive),...this.pods.filter(e=>e.alive&&!e.unlocked),...this.enemies.filter(e=>e.alive)].filter(e=>e.d>this.distance-5&&e.d<this.distance+61);
  for(const b of this.bullets){
   if(!b.alive)continue;b.prevD=b.d;b.d+=b.speed*DT;
   let nearest=null,nearestD=Infinity;
   for(const e of objects){
    if(!e.alive||e.unlocked)continue;
    const half=e.width?e.width*.5:e.kind==='boss'?1.65:.30;
    const depth=e.width?.40:e.kind==='boss'?.65:.28;
    const front=e.d-depth;
    if(Math.abs(b.x-e.x)>half||b.prevD>e.d+depth||b.d<front)continue;
    const hitD=Math.max(b.prevD,front);
    if(hitD<nearestD){nearest=e;nearestD=hitD;}
   }
   if(nearest){
    const e=nearest;b.alive=false;b.d=nearestD;this.stats.hits++;
    if(e.operation){e.charge+=1;e.value=e.operation==='multiply'?e.base:Math.min(e.base+(e.maxGain??12),e.base+Math.floor(e.charge/18));e.width=gateWidth(e.value);e.flash=this.tick;}
    else if(e.tier!==undefined){e.hp=Math.max(0,e.hp-b.damage);e.flash=this.tick;if(e.hp===0&&!e.unlocked){e.unlocked=true;this.emit('pod-open',{x:e.x,d:e.d,tier:e.tier});}}
    else this.hitEnemy(e,b.damage);
    this.emit('impact',{x:b.x,d:nearestD,tier:b.tier,enemy:!!e.kind,boss:e.kind==='boss'});
   }
   if(b.d>this.distance+60||this.tick-b.born>150)b.alive=false;
  }
  this.bullets=this.bullets.filter(b=>b.alive);
  for(const g of this.gates){
   if(!g.alive||g.d>this.distance)continue;g.alive=false;
   if(Math.abs(this.centerX-g.x)<g.width*.5){
    const old=this.troops.length;this.stats.gates++;
    if(g.operation==='multiply')this.addTroops(old*(g.value-1));
    else if(g.value>=0)this.addTroops(g.value);
    else this.removeTroops(this.troops.slice(-Math.abs(g.value)).map(t=>t.id),'negative-gate');
    this.emit('gate',{x:g.x,d:g.d,value:g.value,operation:g.operation,delta:this.troops.length-old});
   }
  }
  for(const p of this.pods){
   if(!p.alive||p.d>this.distance)continue;p.alive=false;
   if(Math.abs(this.centerX-p.x)<p.width*.5){
    if(p.unlocked){const prev=this.weapon;this.weapon=Math.min(2,Math.max(this.weapon,p.tier));this.stats.upgrades+=this.weapon>prev?1:0;this.emit('upgrade',{x:this.centerX,d:this.distance,tier:this.weapon,count:this.troops.length});if(prev===this.weapon)this.addTroops(5);}
    else{const victims=this.troops.filter(t=>Math.abs(t.x-p.x)<p.width*.5).slice(0,Math.ceil(p.hp/7));this.removeTroops(victims.map(t=>t.id),'sealed-pod');this.emit('pod-break',{x:p.x,d:p.d});}
   }
  }
  for(const e of this.enemies){
   if(!e.alive)continue;const range=e.d-this.distance;
   if(range>70)continue;
   if(e.kind==='raider'){
    if(e.rush&&range>0&&range<18)e.x+=clamp(this.centerX-e.x,-1.8*DT,1.8*DT);
    e.d-=e.move*DT;
    if(range<-5){e.alive=false;continue;}
    if(Math.abs(e.d-this.distance)<4.5){
     const victim=this.troops.find(t=>Math.hypot(t.x-e.x,t.d-e.d)<.52);
     if(victim){this.removeTroops([victim.id],'enemy-contact');e.alive=false;this.emit('kill',{x:e.x,d:e.d,id:e.id});}
    }
   }else{
    if(range<(e.final?50:18)){
     if(e.final)e.d-=Math.min(3.2*DT,Math.max(0,e.d-(this.config.length+8)));
     if(!e.nextAttack)e.nextAttack=this.tick+24;
     if(this.tick>=e.nextAttack&&!e.warning){e.warning={x:this.centerX,until:this.tick+78};this.emit('warning',{x:e.warning.x,d:this.distance,radius:1.95,bossId:e.id});}
     if(e.warning&&this.tick>=e.warning.until){
      const x=e.warning.x;const victims=this.troops.filter(t=>Math.abs(t.x-x)<1.75);
      this.removeTroops(victims.filter((_,i)=>i%2===0).map(t=>t.id),'boss-strike');
      this.emit('strike',{x,d:this.distance,bossId:e.id});e.warning=null;e.nextAttack=this.tick+150;
     }
    }
    if(range<2.0){
     const ids=this.troops.filter(t=>Math.abs(t.x-e.x)<1.70).map(t=>t.id);this.removeTroops(ids,'boss-contact');
     if(!e.final&&range<-6)e.alive=false;
    }
   }
  }
  if(this.troops.length===0){this.phase='lost';this.reason='小队全员撤离战场';this.emit('defeat');}
  else if(this.finalBossKilled){this.phase='won';this.reason='巨型守卫已被真实击败';this.emit('victory');}
 }
 drainEvents(){const events=this.events;this.events=[];return events;}
 summary(){return {version:2,seed:this.seed,level:this.level,tick:this.tick,phase:this.phase,distance:+this.distance.toFixed(4),count:this.troops.length,weapon:this.weapon,stats:{...this.stats},bosses:this.enemies.filter(e=>e.kind==='boss').map(e=>({id:e.id,hp:e.hp,alive:e.alive,final:!!e.final})),inputCount:this.inputLog.length};}
 replay(){const expected=this.summary();if(expected.phase==='paused'||expected.phase==='ready')expected.phase='running';return {format:'volley-run.replay',version:this.level>=3||Object.values(this.modifiers).some(v=>v>0)?3:2,modifiers:{...this.modifiers},seed:this.seed,level:this.level,ticks:this.tick,inputs:this.inputLog.map(a=>[...a]),expected};}
}
export function validateReplay(data){
 if(!data||data.format!=='volley-run.replay'||![1,2,3].includes(data.version))throw new Error('不是受支持的回放文件');
 if(!Number.isInteger(data.level)||data.level<0||data.level>(data.version===3?LEVELS.length-1:2)||!Number.isInteger(data.seed)||data.seed<0||data.seed>0xffffffff)throw new Error('关卡或种子无效');
 if(!Number.isInteger(data.ticks)||data.ticks<0||data.ticks>60*60*15)throw new Error('回放长度无效（最多 15 分钟）');
 if(!Array.isArray(data.inputs)||data.inputs.length>60000)throw new Error('输入记录无效');
 if(data.modifiers){for(const key of ['power','haste','guard','pressure','carry'])if(!Number.isInteger(data.modifiers[key])||data.modifiers[key]<0||data.modifiers[key]>(key==='pressure'?30:key==='carry'?96:5))throw new Error('回放成长数据无效');}
 let prev=-1;for(const a of data.inputs){if(!Array.isArray(a)||a.length!==2||!Number.isInteger(a[0])||a[0]<0||a[0]<=prev||a[0]>=data.ticks||!Number.isFinite(a[1])||Math.abs(a[1])>4.8)throw new Error('回放输入超出范围');prev=a[0];}
 return data;
}
export function createGame(options={}){return options.version===1?new LegacyGame(options):new Game(options);}
export function runReplay(data){validateReplay(data);if(data.version===1)return runLegacyReplay(data);const g=new Game(data);g.start();let index=0,target=g.targetX;for(let i=0;i<data.ticks;i++){while(index<data.inputs.length&&data.inputs[index][0]<=g.tick)target=data.inputs[index++][1];g.step(target);}return g;}
/** Visible demo / QA steering only. It cannot modify health, counts, damage or outcomes. */
export function demoInput(g){
 let desired=0;
 const rows=[...g.gates,...g.pods].filter(e=>e.alive&&e.d>g.distance+.2&&e.d<g.distance+44);
 if(rows.length){
  const nearest=Math.min(...rows.map(e=>e.d));const choices=rows.filter(e=>Math.abs(e.d-nearest)<2);
  const score=e=>e.operation?(e.operation==='multiply'?g.troops.length:e.value)+8:(e.tier>g.weapon?65:1)+(e.unlocked?12:0);
  choices.sort((a,b)=>score(b)-score(a));desired=nearest<40?2.65:choices[0].x;
 }else{
  const foes=g.enemies.filter(e=>e.alive&&e.d>g.distance+2&&e.d<g.distance+68).sort((a,b)=>a.d-b.d);
  desired=foes.length?foes[0].x:0;
 }
 const mini=g.enemies.find(e=>e.alive&&e.kind==='boss'&&!e.final&&e.d-g.distance>14&&e.d-g.distance<45);
 if(mini&&g.distance>30)desired=mini.x;
 // Plan around the whole formation, not just the center. Passing a giant is a
 // physical obstacle even between telegraphed attacks; never shortcut through it.
 const warnings=g.enemies.filter(e=>e.alive&&e.warning);
 const bodies=g.enemies.filter(e=>e.alive&&e.kind==='boss'&&e.d-g.distance<7&&e.d-g.distance>-7);
 if(!warnings.length&&!bodies.length)return desired;
 const radius=g.slots.reduce((r,p)=>Math.max(r,Math.abs(p.x)),0)+.38,edge=Math.max(0,ROAD_HALF-radius);
 const candidates=[desired,g.centerX,-edge,edge,0,-2,2].map(x=>clamp(x,-edge,edge));
 const cost=x=>g.slots.reduce((s,p)=>s+warnings.reduce((a,b)=>a+(Math.abs(x+p.x-b.warning.x)<1.85?1:0),0)+bodies.reduce((a,b)=>a+(Math.abs(x+p.x-b.x)<1.7?4:0),0),0)+Math.abs(x-desired)*.03+Math.abs(x-g.centerX)*.015;
 candidates.sort((a,b)=>cost(a)-cost(b));return candidates[0];
}
