import {DAILY_RULES,ENEMIES,MAPS,SKILLS,SKIN_ABILITIES,STAGES,UPGRADES,enemyById,skinAbility,skillById,upgradeById,type Element,type EnemyId,type Modifier,type SkillId,type SkinId} from './content';
export const DT=1/60,FIELD={halfWidth:170,height:640,wall:60},LIMITS={enemies:180,projectiles:320,fields:64,events:320};
export type Mode='campaign'|'endless'|'daily';
export type Phase='ready'|'playing'|'choice'|'paused'|'won'|'lost';
export interface Loadout {damage:number;haste:number;health:number;crit:number;armor:number;repair:number;research:Partial<Record<SkillId,number>>;mercenaries:string[];mercenaryLevels:Record<string,number>;skin:SkinId}
export const defaultLoadout=():Loadout=>({damage:1,haste:1,health:1000,crit:.05,armor:0,repair:0,research:{},mercenaries:[],mercenaryLevels:{},skin:'ranger'});
export interface Enemy {id:number;kind:EnemyId;x:number;y:number;hp:number;maxHp:number;shield:number;speed:number;radius:number;attack:number;ability:number;warning:number;burn:number;burnPower:number;freeze:number;stun:number;wound:number;vulnerable:number;age:number;child:boolean}
type AttackSource='weapon'|'mercenary'|'skin'|'secondary';
export interface Projectile {id:number;skill:SkillId;x:number;y:number;px:number;py:number;vx:number;vy:number;radius:number;splash:number;damage:number;remaining:number;hits:number[];life:number;mods:Stats;source?:AttackSource}
export interface Field {id:number;skill:SkillId;x:number;y:number;radius:number;life:number;total:number;tick:number;vy:number;delay:number;damage:number;mods:Stats;target?:number;source?:AttackSource;variant?:'plasma'|'ice-storm';pulse?:number}
export interface Fx {id:number;type:'shot'|'hit'|'burst'|'beam'|'chain'|'death'|'wall'|'wave'|'level'|'win'|'lose'|'reload';x:number;y:number;tx?:number;ty?:number;skill?:SkillId;value?:number;crit?:boolean}
export interface Stats {damage:number;interval:number;count:number;radius:number;pierce:number;duration:number;burn:number;freeze:number;stun:number;bounce:number;crit:number;magazine:number;knock:number;vulnerability:number}
export interface Card {id:string;skill:SkillId;name:string;description:string;kind:'learn'|'upgrade'|'evolution'|'supply';rank:number}
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
const finite=(n:number,fallback:number)=>Number.isFinite(n)?n:fallback;
export function segmentDistance(px:number,py:number,ax:number,ay:number,bx:number,by:number){const dx=bx-ax,dy=by-ay,t=clamp(((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(px-ax-t*dx,py-ay-t*dy);}

export class Battle {
 phase:Phase='ready';previous:Phase='playing';tick=0;time=0;wave=0;waveTime=0;spawnClock=0;spawned=0;waveQuota=0;
 readonly stage:number;readonly mode:Mode;readonly seed:number;readonly loadout:Loadout;
 hp:number;maxHp:number;xp=0;level=1;kills=0;bossKills=0;damageDone=0;damageTaken=0;shots=0;ammo=12;reload=0;priority:number|null=null;
 learned:Partial<Record<SkillId,number>>={rifle:1};upgrades:Record<string,number>={};cooldowns:Partial<Record<SkillId,number>>={};cards:Card[]=[];rerolls=2;rerollUsed=0;
 enemies:Enemy[]=[];projectiles:Projectile[]=[];fields:Field[]=[];events:Fx[]=[];
 private skinHits=0;private skinTriggers=0;private skinTargetHits=new Map<number,number>();
 private skinQueue:{x:number;y:number;damage:number}[]=[];
 private randomState:number;private serial=0;private eventSerial=0;private mercClock=0;private repairClock=0;private bossSpawned=false;
 constructor(stage=0,mode:Mode='campaign',seed=12345,loadout:Loadout=defaultLoadout()){
  this.stage=clamp(Math.floor(finite(stage,0)),0,STAGES.length-1);this.mode=mode;this.seed=seed>>>0;this.randomState=this.seed||0x9e3779b9;
  this.loadout={...loadout,damage:clamp(finite(loadout.damage,1),.1,20),haste:clamp(finite(loadout.haste,1),.25,4),health:clamp(finite(loadout.health,1000),1,100000),crit:clamp(finite(loadout.crit,.05),0,1),armor:clamp(finite(loadout.armor,0),0,.7),repair:clamp(finite(loadout.repair,0),0,200),research:{...loadout.research},mercenaries:[...loadout.mercenaries]};
  this.loadout.mercenaryLevels={...loadout.mercenaryLevels};
  this.loadout.skin=Object.prototype.hasOwnProperty.call(SKIN_ABILITIES,loadout.skin)?loadout.skin:'ranger';
  if(this.dailyRule)this.loadout.damage*=this.dailyRule.damage;
  this.hp=this.maxHp=Math.round(this.loadout.health*(this.dailyRule?.wall??1));this.ammo=this.stats('rifle').magazine;
 }
 get dailyRule(){return this.mode==='daily'?DAILY_RULES[this.seed%DAILY_RULES.length]:null;}
 get mapIndex(){return this.mode==='daily'?(this.seed>>>4)%MAPS.length:this.mode==='endless'?(STAGES[this.stage].map+Math.floor(Math.max(0,this.wave-1)/8))%MAPS.length:STAGES[this.stage].map;}
 get map(){return MAPS[this.mapIndex];}
 get maxWaves(){return this.mode==='endless'?Infinity:this.mode==='daily'?10:STAGES[this.stage].waves;}
 get xpNeeded(){return 5+(this.level-1)*3;}
 get specialCount(){return Object.keys(this.learned).filter(k=>k!=='rifle').length;}
 get skinProgress(){const ability=skinAbility(this.loadout.skin);return ability?{name:ability.name,skill:ability.skill,hits:this.loadout.skin==='arc'?Math.max(0,...Array.from(this.skinTargetHits.values())):this.skinHits,threshold:ability.hits,triggers:this.skinTriggers,targets:this.skinTargetHits.size}:null;}
 isEnraged(e:Enemy){return e.age>=(enemyById[e.kind].boss?25:this.mode==='endless'?45:Infinity);}
 private random(){let x=this.randomState;x^=x<<13;x^=x>>>17;x^=x<<5;this.randomState=x>>>0;return this.randomState/4294967296;}
 private event(type:Fx['type'],x=0,y=FIELD.wall,extra:Partial<Fx>={}){this.events.push({id:++this.eventSerial,type,x,y,...extra});if(this.events.length>LIMITS.events)this.events.splice(0,this.events.length-LIMITS.events);}
 drainEvents(){const events=this.events;this.events=[];return events;}
 start(){if(this.phase!=='ready')return false;this.phase='playing';this.nextWave();this.offer();return true;}
 pause(){if(this.phase!=='playing'&&this.phase!=='choice')return false;this.previous=this.phase;this.phase='paused';return true;}
 resume(){if(this.phase!=='paused')return false;this.phase=this.previous;return true;}
 aim(x:number,y:number){if(this.phase!=='playing'||!Number.isFinite(x)||!Number.isFinite(y))return;const e=this.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];this.priority=e&&Math.hypot(e.x-x,e.y-y)<80?e.id:null;}
 private rank(id:string){return (this.upgrades[id]??this.learned[id as SkillId])||0;}
 availableCards():Card[]{
  const available:Card[]=[];
  if(this.specialCount<4)for(const s of SKILLS)if(!this.learned[s.id])available.push({id:'learn:'+s.id,skill:s.id,name:s.name,description:s.description,kind:'learn',rank:1});
  for(const u of UPGRADES)if(this.learned[u.skill]&&(this.upgrades[u.id]??0)<u.max&&u.requires.every(([id,n])=>this.rank(id)>=n))available.push({id:u.id,skill:u.skill,name:u.name,description:u.description,kind:u.evolution?'evolution':'upgrade',rank:(this.upgrades[u.id]??0)+1});
  return available.length?available:[{id:'supply:repair',skill:'rifle',name:'战地维修',description:'修复 12% 防线耐久。',kind:'supply',rank:1},{id:'supply:power',skill:'rifle',name:'火力储备',description:'所有武器伤害增加 5%。',kind:'supply',rank:1},{id:'supply:reload',skill:'rifle',name:'紧急装填',description:'立即装满弹匣并重置武器冷却。',kind:'supply',rank:1}];
 }
 private offer(){
  const pool=this.availableCards(),chosen:Card[]=[];
  // Give an initial special weapon choice; later draws favour the player's build.
  if(this.specialCount===0){const fresh=pool.filter(c=>c.kind==='learn');const c=fresh[Math.floor(this.random()*fresh.length)];if(c){chosen.push(c);pool.splice(pool.indexOf(c),1);}}
  while(chosen.length<3&&pool.length){const weights=pool.map(c=>c.kind==='evolution'?5:c.kind==='learn'?1:2.5);let r=this.random()*weights.reduce((a,b)=>a+b,0),i=0;for(;i<weights.length-1&&r>=weights[i];i++)r-=weights[i];chosen.push(pool.splice(i,1)[0]);}
  this.cards=chosen;this.phase='choice';this.event('level');
 }
 choose(id:string){
  if(this.phase!=='choice')return false;const card=this.cards.find(c=>c.id===id);if(!card)return false;
  if(card.kind==='learn'){if(this.learned[card.skill]||this.specialCount>=4)return false;this.learned[card.skill]=1;this.cooldowns[card.skill]=.15;}
  else if(card.kind==='supply'){
   if(id==='supply:repair')this.hp=Math.min(this.maxHp,this.hp+this.maxHp*.12);
   if(id==='supply:power')this.upgrades['global:power']=(this.upgrades['global:power']??0)+1;
   if(id==='supply:reload'){this.ammo=this.stats('rifle').magazine;this.reload=0;this.cooldowns={};}
  }else {const def=upgradeById[id];if(!def||!this.availableCards().some(c=>c.id===id))return false;this.upgrades[id]=(this.upgrades[id]??0)+1;this.learned[card.skill]=(this.learned[card.skill]??1)+1;}
  this.cards=[];this.phase='playing';this.checkLevel();return true;
 }
 reroll(){if(this.phase!=='choice'||this.rerolls<=0)return false;this.rerolls--;this.rerollUsed++;this.offer();return true;}
 private checkLevel(){if(this.phase==='playing'&&this.xp>=this.xpNeeded){this.xp-=this.xpNeeded;this.level++;this.offer();}}
 stats(id:SkillId):Stats{
  const s=skillById[id],mods:Record<Modifier,number>={damage:0,haste:0,count:0,radius:0,pierce:0,duration:0,burn:0,freeze:0,stun:0,bounce:0,crit:0,magazine:0,knock:0,vulnerability:0};
  for(const u of UPGRADES)if(u.skill===id&&this.upgrades[u.id])for(const [key,value]of Object.entries(u.mods))mods[key as Modifier]+=(value??0)*this.upgrades[u.id];
  return {damage:s.damage*(1+mods.damage+(this.upgrades['global:power']??0)*.05+(this.loadout.research[id]??0)*.04)*this.loadout.damage,interval:s.interval*Math.max(.24,1-mods.haste)/this.loadout.haste,count:1+mods.count,radius:s.radius+mods.radius,pierce:s.pierce+mods.pierce,duration:s.duration+mods.duration,burn:mods.burn,freeze:(id==='frost'?.7:0)+mods.freeze,stun:(id==='electro'?.6:0)+mods.stun,bounce:(id==='electron'?4:0)+mods.bounce,crit:Math.min(.85,this.loadout.crit+mods.crit),magazine:12+mods.magazine+(this.dailyRule?.ammo??0),knock:(id==='thermo'?20:id==='dryice'?7:id==='vehicle'?12:0)+mods.knock,vulnerability:mods.vulnerability};
 }
 private nextWave(){this.wave++;this.waveTime=0;this.spawnClock=.25;this.spawned=0;this.waveQuota=12+Math.min(72,Math.floor(this.stage*.6)+this.wave*3);this.bossSpawned=false;this.event('wave',0,400,{value:this.wave});}
 private spawn(kind:EnemyId,child=false,x?:number,y?:number){
  if(this.enemies.filter(e=>e.hp>0).length>=LIMITS.enemies)return false;
  const def=enemyById[kind],scaling=(1+this.stage*.105+Math.max(0,this.wave-1)*.055)*(this.mode==='endless'?Math.pow(1.065,Math.max(0,this.wave-8)):1),hp=def.hp*scaling*(child?.5:1)*(this.dailyRule?.health??1);
  this.enemies.push({id:++this.serial,kind,x:x??(this.random()*2-1)*150,y:y??(kind==='burrower'?240+this.random()*160:FIELD.height+this.random()*35),hp,maxHp:hp,shield:kind==='shield'?hp*.65:0,speed:def.speed*(this.dailyRule?.speed??1)*(1+Math.min(.45,this.stage*.009))*(this.mode==='endless'?1+Math.min(1.2,Math.max(0,this.wave-8)*.014):1)*(child?1.3:1),radius:def.radius*(child?.7:1),attack:1+this.random(),ability:4+this.random()*4,warning:0,burn:0,burnPower:0,freeze:0,stun:0,wound:0,vulnerable:0,age:0,child});return true;
 }
 private target(excluded:number[]=[]){return this.enemies.filter(e=>e.hp>0&&e.y<=FIELD.height-70&&!excluded.includes(e.id)).sort((a,b)=>(a.id===this.priority?-10000:a.y)-(b.id===this.priority?-10000:b.y)||a.id-b.id)[0];}
 private hurt(e:Enemy,amount:number,skill:SkillId,mods:Stats,dot=false,source:AttackSource='secondary'){
  if(e.hp<=0||amount<=0)return;const def=enemyById[e.kind],element=skillById[skill].element;let damage=amount*(def.resist?.[element]??1)*(1+e.vulnerable);const crit=!dot&&this.random()<mods.crit;if(crit)damage*=2;
  const absorbed=Math.min(e.shield,damage);e.shield-=absorbed;damage-=absorbed;const actual=Math.min(e.hp,damage);e.hp-=damage;this.damageDone+=actual+absorbed;
  if(source==='weapon'&&!dot&&actual+absorbed>0)this.chargeSkin(e,skill,mods.damage);
  if(!dot){
   if(mods.burn&&e.kind!=='fireguard'){e.burn=Math.max(e.burn,3);e.burnPower=Math.max(e.burnPower,mods.burn*this.loadout.damage);}
   if(mods.freeze&&e.kind!=='frostguard'&&!this.isEnraged(e))e.freeze=Math.max(e.freeze,mods.freeze*(def.boss?.4:1));
   if(mods.stun&&e.kind!=='shockguard'&&!this.isEnraged(e))e.stun=Math.max(e.stun,mods.stun*(def.boss?.35:1));
   if(skill==='blade')e.wound=Math.max(e.wound,5);e.vulnerable=Math.max(e.vulnerable,mods.vulnerability);
   e.y=Math.min(FIELD.height+35,e.y+mods.knock*(this.isEnraged(e)?0:def.boss?.18:1));
   this.event('hit',e.x,e.y,{skill,value:Math.round(actual+absorbed),crit});
  }
  if(e.hp<=0){
   this.kills++;this.xp+=Math.max(1,Math.floor(def.xp*(e.child?.5:1)));if(def.boss)this.bossKills++;
   this.event('death',e.x,e.y,{skill,value:def.radius});
   if(e.kind==='splitter'&&!e.child)for(const side of [-1,1])this.spawn('runner',true,clamp(e.x+side*13,-150,150),e.y+12);
   if(e.burn>0&&this.upgrades['thermo:spread'])for(const other of this.enemies)if(other.hp>0&&other.id!==e.id&&Math.hypot(other.x-e.x,other.y-e.y)<65){other.burn=Math.max(other.burn,3);other.burnPower=Math.max(other.burnPower,e.burnPower);}
   if(e.burn>0&&this.upgrades['fuel:death']){
    // Dead enemies cannot trigger twice; secondary explosions may chain through the crowd.
    const blast=this.stats('fuel');this.area(e.x,e.y,65,blast.damage*1.6,'fuel',{...blast,crit:0});
   }
  }
 }
 private chargeSkin(e:Enemy,skill:SkillId,damage:number){
  const ability=skinAbility(this.loadout.skin);if(!ability||ability.skill!==skill)return;
  let hits=this.loadout.skin==='arc'?(this.skinTargetHits.get(e.id)??0)+1:++this.skinHits;
  if(hits>=ability.hits){hits=0;if(this.skinQueue.length<LIMITS.enemies)this.skinQueue.push({x:e.x,y:e.y,damage});}
  if(this.loadout.skin==='arc')this.skinTargetHits.set(e.id,hits);else this.skinHits=hits;
 }
 private releaseSkin(){
  for(const hit of this.skinQueue){
   const skin=this.loadout.skin;
   if(skin==='ember'||skin==='hazard'){
    // Echo projectiles cannot charge another passive, including through splash damage.
    this.fire(skin==='ember'?'thermo':'blade',skin==='ember'?1:.8,'skin',3);
   }else if(this.fields.length<LIMITS.fields){
    const plasma=skin==='arc',skill=plasma?'electro':'dryice',base=this.stats(skill),duration=plasma?.9:1.8;
    this.fields.push({id:++this.serial,skill,x:hit.x,y:hit.y,radius:plasma?70:76,life:duration,total:duration,tick:0,vy:0,delay:0,damage:hit.damage,mods:{...base,crit:0,knock:0,burn:0,stun:0,freeze:plasma?0:.65},source:'skin',variant:plasma?'plasma':'ice-storm',pulse:0});
   }
   this.skinTriggers++;
  }
  this.skinQueue=[];
 }
 private wallDamage(damage:number,x:number){const pressure=this.mode==='endless'?1+Math.max(0,this.wave-8)*.035:1,actual=damage*(1-this.loadout.armor)*(1+this.stage*.035)*pressure;this.hp=Math.max(0,this.hp-actual);this.damageTaken+=actual;this.event('wall',x,FIELD.wall,{value:Math.round(actual)});if(this.hp<=0){this.phase='lost';this.cards=[];this.event('lose');}}
 private area(x:number,y:number,radius:number,damage:number,skill:SkillId,mods:Stats,ground=false,source:AttackSource='secondary',alreadyHit?:number){for(const e of [...this.enemies])if(e.hp>0&&(!ground||e.kind!=='bat')&&Math.hypot(e.x-x,e.y-y)<=radius+e.radius)this.hurt(e,damage,skill,mods,false,e.id===alreadyHit?'secondary':source);this.event('burst',x,y,{skill,value:radius});}
 private fire(id:SkillId,power=1,source:AttackSource='weapon',count?:number){
  const def=skillById[id],base=this.stats(id),mods={...base,damage:base.damage*power,count:count??base.count},used:number[]=[];
  for(let i=0;i<mods.count;i++){
   const e=this.target(used)??this.target();if(!e)return;used.push(e.id);let x=e.x,y=e.y;
   if(def.attack==='bullet'||def.attack==='shell'||def.attack==='blade'){
    if(this.projectiles.length>=LIMITS.projectiles)break;
    const originX=source==='skin'?(i-(mods.count-1)/2)*16:0,angle=Math.atan2(y-FIELD.wall,x-originX)+(mods.count>1?(i-(mods.count-1)/2)*.035:0),speed=id==='thermo'?240:id==='blade'?310:id==='dryice'?380:620;
    this.projectiles.push({id:++this.serial,skill:id,x:originX,y:FIELD.wall,px:originX,py:FIELD.wall,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,radius:id==='rifle'?3:mods.radius,splash:id==='thermo'?mods.radius:id==='rifle'&&this.upgrades['rifle:explosive']?22:0,damage:mods.damage,remaining:mods.pierce,hits:[],life:4,mods,source});
    this.shots++;this.event('shot',0,FIELD.wall,{tx:x,ty:y,skill:id});
   }else if(def.attack==='beam'){
    this.hurt(e,mods.damage,id,mods,false,source);this.event('beam',0,FIELD.wall,{tx:x,ty:y,skill:id,value:mods.radius});
    if(id==='electro')this.area(x,y,mods.radius,mods.damage*.45,id,{...mods,crit:0},false,source,e.id);
    if(mods.bounce){let last=e;for(let b=0;b<mods.bounce;b++){const next=this.enemies.filter(v=>v.hp>0&&!used.includes(v.id)&&Math.hypot(v.x-last.x,v.y-last.y)<140).sort((a,b)=>Math.hypot(a.x-last.x,a.y-last.y)-Math.hypot(b.x-last.x,b.y-last.y))[0];if(!next)break;this.hurt(next,mods.damage*.65,id,mods);this.event('beam',last.x,last.y,{tx:next.x,ty:next.y,skill:id});used.push(next.id);last=next;}}
   }else if(def.attack==='ray'){
    const length=Math.hypot(x,y-FIELD.wall),endX=x/length*750,endY=FIELD.wall+(y-FIELD.wall)/length*750;
    for(const enemy of this.enemies)if(enemy.hp>0&&segmentDistance(enemy.x,enemy.y,0,FIELD.wall,endX,endY)<mods.radius+enemy.radius)this.hurt(enemy,mods.damage,id,mods);
    this.event('beam',0,FIELD.wall,{tx:endX,ty:endY,skill:id,value:mods.radius});
   }else if(def.attack==='chain'){
    let last=e;const hit:number[]=[];for(let b=0;b<mods.bounce;b++){this.hurt(last,mods.damage*Math.max(.55,1-b*.06),id,mods);hit.push(last.id);const next=this.enemies.filter(v=>v.hp>0&&!hit.includes(v.id)&&Math.hypot(v.x-last.x,v.y-last.y)<=mods.radius).sort((a,b)=>Math.hypot(a.x-last.x,a.y-last.y)-Math.hypot(b.x-last.x,b.y-last.y))[0];this.event('chain',b?last.x:0,b?last.y:FIELD.wall,{tx:next?.x??last.x,ty:next?.y??last.y,skill:id});if(!next)break;last=next;}
   }else if(this.fields.length<LIMITS.fields){
    if(def.attack==='tornado'||def.attack==='vehicle'){x=clamp(e.x+(i-(mods.count-1)/2)*55,-135,135);y=FIELD.wall+15;}
    this.fields.push({id:++this.serial,skill:id,x,y,radius:mods.radius,life:mods.duration||.1,total:mods.duration||.1,tick:0,vy:def.attack==='tornado'?85:def.attack==='vehicle'?140:0,delay:def.attack==='airdrop'?1.1:0,damage:mods.damage,mods,source,target:def.attack==='guided'?e.id:undefined});
   }
  }
 }
 step(){
  if(this.phase!=='playing')return;
  this.tick++;this.time+=DT;this.waveTime+=DT;this.spawnClock-=DT;
  if(this.spawned<this.waveQuota&&this.spawnClock<=0){const pool=this.wave<=2&&this.stage===0?['walker','runner'] as EnemyId[]:this.map.enemies;const kind=pool[Math.floor(this.random()*pool.length)] as EnemyId;if(this.spawn(kind)){this.spawned++;this.spawnClock=Math.max(.2,.66-this.wave*.012-this.stage*.004);}}
  const bossWave=this.wave%4===0||this.wave===this.maxWaves;
  if(bossWave&&!this.bossSpawned&&this.spawned>=this.waveQuota){if(this.spawn(this.map.boss)){this.bossSpawned=true;if(this.mode==='campaign'&&STAGES[this.stage].elite&&this.wave===this.maxWaves)this.spawn(this.map.boss,true);}}
  for(const e of [...this.enemies]){
   if(e.hp<=0)continue;e.age+=DT;const def=enemyById[e.kind],enraged=this.isEnraged(e);
   if(enraged){e.freeze=0;e.stun=0;}
   if(e.burn>0){e.burn=Math.max(0,e.burn-DT);this.hurt(e,e.burnPower*DT,'fuel',{...this.stats('fuel'),crit:0},true);}
   e.wound=Math.max(0,e.wound-DT);e.freeze=Math.max(0,e.freeze-DT);e.stun=Math.max(0,e.stun-DT);if(e.hp<=0||e.freeze>0||e.stun>0)continue;
   if(e.warning>0){e.warning-=DT;if(e.warning<=0){if(e.kind==='butcher'){e.y=Math.max(FIELD.wall+e.radius,e.y-100);if(e.y<=FIELD.wall+e.radius+3)this.wallDamage(80,e.x);}else if(e.kind==='mech'){this.wallDamage(32,e.x);for(let n=0;n<2;n++)this.spawn('walker',true,e.x+(n?25:-25),e.y+35);}else{for(let n=0;n<3;n++)this.spawn('runner',true,e.x+(n-1)*25,e.y+35);}}if(this.hp<=0)return;continue;}
   e.ability-=DT;
   if(e.ability<=0){
    e.ability=def.boss?9:e.kind==='healer'?3:6;
    if(def.boss)e.warning=1.4;
    if(e.kind==='healer'||e.kind==='queen')for(const other of this.enemies)if(other.hp>0&&Math.hypot(other.x-e.x,other.y-e.y)<110)other.hp=Math.min(other.maxHp,other.hp+other.maxHp*.06*(other.wound>0?.5:1));
   }
   const ranged=e.kind==='spitter'&&e.y<230,atWall=e.y<=FIELD.wall+e.radius;
   if(!ranged&&!atWall)e.y=Math.max(FIELD.wall+e.radius,e.y-e.speed*DT*(enraged?1.8:1));
   else {e.attack-=DT;if(e.attack<=0){e.attack=def.interval;this.wallDamage(def.damage,e.x);if(e.kind==='bomber'){e.hp=0;this.event('burst',e.x,e.y,{skill:'thermo',value:40});}if(this.hp<=0)return;}}
  }
  this.reload=Math.max(0,this.reload-DT);
  for(const s of SKILLS)if(this.learned[s.id]){
   this.cooldowns[s.id]=Math.max(0,(this.cooldowns[s.id]??0)-DT);
   if(this.cooldowns[s.id]!>0||!this.target()||(s.id==='rifle'&&this.reload>0))continue;
   if(s.id==='rifle'&&this.ammo<=0){this.reload=1.45/this.loadout.haste;this.ammo=this.stats('rifle').magazine;this.event('reload');continue;}
   this.fire(s.id);this.cooldowns[s.id]=this.stats(s.id).interval;if(s.id==='rifle')this.ammo--;
  }
  for(const p of this.projectiles){
   p.px=p.x;p.py=p.y;p.x+=p.vx*DT;p.y+=p.vy*DT;p.life-=DT;
   const hits=this.enemies.filter(e=>e.hp>0&&!p.hits.includes(e.id)&&segmentDistance(e.x,e.y,p.px,p.py,p.x,p.y)<e.radius+(p.skill==='thermo'?8:p.radius)).sort((a,b)=>a.y-b.y);
   for(const e of hits){p.hits.push(e.id);if(p.splash){this.area(e.x,e.y,p.splash,p.damage,p.skill,p.mods,false,p.source??'weapon');p.life=0;break;}this.hurt(e,p.damage,p.skill,p.mods,false,p.source??'weapon');if(p.remaining--<=0){p.life=0;break;}}
  }
  for(const f of this.fields){
   if(f.delay>0){f.delay-=DT;continue;}f.life-=DT;f.y+=f.vy*DT;f.tick-=DT;
   if(f.variant==='plasma'){
    const elapsed=f.total-f.life,pulse=f.pulse??0;
    if((pulse===0&&elapsed>=.3)||(pulse===1&&elapsed>=.75)){this.area(f.x,f.y,f.radius,f.damage*(pulse===0?.1:.05),f.skill,f.mods,false,'skin');f.pulse=pulse+1;}
    continue;
   }
   if(f.variant==='ice-storm'){
    if(f.tick<=0){f.tick=.35;this.area(f.x,f.y,f.radius,f.damage*.2,f.skill,f.mods,false,'skin');}
    continue;
   }
   if(f.skill==='guided'){
    const enemy=this.enemies.find(e=>e.id===f.target&&e.hp>0)??this.target();
    if(enemy){f.target=enemy.id;f.x=enemy.x;f.y=enemy.y;if(f.tick<=0){f.tick=.2;this.hurt(enemy,f.damage*.2,'guided',f.mods);this.event('beam',0,FIELD.wall,{tx:enemy.x,ty:enemy.y,skill:'guided',value:4});
     let previous=enemy;const hit=[enemy.id];for(let n=0;n<f.mods.bounce;n++){const next=this.enemies.filter(e=>e.hp>0&&!hit.includes(e.id)&&Math.hypot(e.x-previous.x,e.y-previous.y)<140).sort((a,b)=>Math.hypot(a.x-previous.x,a.y-previous.y)-Math.hypot(b.x-previous.x,b.y-previous.y))[0];if(!next)break;this.hurt(next,f.damage*.13,'guided',f.mods);this.event('beam',previous.x,previous.y,{tx:next.x,ty:next.y,skill:'guided',value:3});hit.push(next.id);previous=next;}
    }}continue;
   }
   if(f.tick<=0){f.tick=.35;this.area(f.x,f.y,f.radius,f.damage,f.skill,f.mods,f.skill==='fuel'||f.skill==='vehicle');
    if(f.skill==='cyclone')for(const e of this.enemies)if(e.hp>0&&!this.isEnraged(e)&&Math.hypot(e.x-f.x,e.y-f.y)<f.radius+e.radius){e.x+=(f.x-e.x)*.18;e.y=Math.min(FIELD.height+35,e.y+(enemyById[e.kind].boss?.8:5));}
    if(f.skill==='airdrop'){f.life=0;if(this.upgrades['airdrop:nuke']&&this.fields.length<LIMITS.fields)this.fields.push({...f,id:++this.serial,skill:'fuel',delay:0,life:3,total:3,tick:0,damage:f.damage*.12});}
   }
  }
  this.releaseSkin();
  this.mercClock-=DT;if(this.mercClock<=0&&this.target()){this.mercClock=5;for(const merc of this.loadout.mercenaries){const level=clamp(this.loadout.mercenaryLevels[merc]??1,1,10),power=1+(level-1)*.18;if(merc==='engineer')this.hp=Math.min(this.maxHp,this.hp+this.maxHp*.015*power);else this.fire(merc==='frost'?'dryice':merc==='storm'?'electro':'thermo',power,'mercenary');}}
  this.repairClock+=DT;if(this.repairClock>=10){this.repairClock=0;this.hp=Math.min(this.maxHp,this.hp+this.loadout.repair);}
  this.enemies=this.enemies.filter(e=>e.hp>0);this.projectiles=this.projectiles.filter(p=>p.life>0&&p.y<FIELD.height+70&&Math.abs(p.x)<FIELD.halfWidth+80);this.fields=this.fields.filter(f=>f.life>0&&f.y<FIELD.height+100);
  for(const id of this.skinTargetHits.keys())if(!this.enemies.some(e=>e.id===id))this.skinTargetHits.delete(id);
  if(this.spawned>=this.waveQuota&&(!bossWave||this.bossSpawned)&&!this.enemies.length){
   if(this.wave>=this.maxWaves){this.phase='won';this.event('win');return;}this.nextWave();
  }
  this.checkLevel();
 }
 snapshot(){return {phase:this.phase,mode:this.mode,seed:this.seed,dailyRule:this.dailyRule?.id??null,priority:this.priority,stage:this.stage,map:this.mapIndex,tick:this.tick,time:this.time,wave:this.wave,maxWaves:Number.isFinite(this.maxWaves)?this.maxWaves:null,hp:Math.ceil(this.hp),maxHp:this.maxHp,level:this.level,xp:this.xp,xpNeeded:this.xpNeeded,kills:this.kills,bossKills:this.bossKills,damage:Math.round(this.damageDone),damageTaken:Math.round(this.damageTaken),ammo:this.ammo,reload:this.reload,learned:{...this.learned},upgrades:{...this.upgrades},cards:this.cards.map(c=>({...c})),rerolls:this.rerolls,skin:this.loadout.skin,skinProgress:this.skinProgress,counts:{enemies:this.enemies.length,projectiles:this.projectiles.length,fields:this.fields.length},enemies:this.enemies.map(e=>({id:e.id,kind:e.kind,x:Math.round(e.x),y:Math.round(e.y),hp:Math.ceil(e.hp),shield:Math.ceil(e.shield),freeze:e.freeze,stun:e.stun,burn:e.burn,warning:e.warning})),randomState:this.randomState};}
}
