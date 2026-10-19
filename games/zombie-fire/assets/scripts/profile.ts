import {Battle,defaultLoadout,type Loadout,type Mode} from './core';
import {SKILLS,STAGES,type SkillId,type SkinId} from './content';
export const SLOTS=['weapon','helmet','armor','gloves','trousers','boots'] as const;
export type Slot=typeof SLOTS[number];
export const SLOT_NAMES:Record<Slot,string>={weapon:'枪械',helmet:'头盔',armor:'战甲',gloves:'手套',trousers:'护腿',boots:'战靴'};
export const GEM_TYPES=[{id:'power',name:'强攻',color:'#e58a72'},{id:'haste',name:'急速',color:'#79c7d0'},{id:'crit',name:'鹰眼',color:'#d2a4dd'},{id:'health',name:'坚壁',color:'#b0c87f'},{id:'armor',name:'守护',color:'#80aade'},{id:'repair',name:'修复',color:'#d7b46e'}] as const;
export type GemType=typeof GEM_TYPES[number]['id'];
export const GRADES=['普通','精良','稀有','史诗','传说','绝世'];
export const MERCENARIES=[{id:'engineer',name:'工程指挥使',cost:450,description:'周期修复防线，适合持久战。'},{id:'flame',name:'火焰尖兵',cost:550,description:'定时发射温压弹，补充范围火力。'},{id:'frost',name:'寒霜先锋',cost:650,description:'定时发射干冰弹，穿透接近的尸群。'},{id:'storm',name:'电磁卫士',cost:750,description:'定时释放电磁雷击，麻痹密集敌人。'}] as const;
export const SKINS=[{id:'ranger',name:'防线游骑',price:0,color:'#637e91',accent:'#e6b16a'},{id:'ember',name:'赤焰突击',price:450,color:'#b55743',accent:'#ffd17d'},{id:'arctic',name:'极地守卫',price:650,color:'#acc2cc',accent:'#7de3ef'},{id:'hazard',name:'荒野猎手',price:800,color:'#aa9756',accent:'#dbea82'},{id:'arc',name:'霓虹先驱',price:1000,color:'#82649f',accent:'#84e7dc'}] as const;
type Metric='kills'|'waves'|'bosses'|'runs'|'wins';
export const QUESTS=[
 {id:'daily-kills',name:'清理街区',metric:'kills',target:120,reward:150,daily:true},
 {id:'daily-waves',name:'守住十波',metric:'waves',target:10,reward:180,daily:true},
 {id:'daily-run',name:'整装出击',metric:'runs',target:2,reward:100,daily:true},
 {id:'first-victory',name:'第一道曙光',metric:'wins',target:1,reward:250,daily:false},
 {id:'hunter',name:'千敌克星',metric:'kills',target:1000,reward:600,daily:false},
 {id:'boss-hunter',name:'首领猎手',metric:'bosses',target:20,reward:650,daily:false},
 {id:'veteran',name:'防线老兵',metric:'wins',target:12,reward:800,daily:false},
] as const;
export interface Gear {level:number;tier:number;gems:(number|null)[]}
export interface Gem {id:number;type:GemType;grade:number}
interface Ledger {id:number;stage:number;mode:Mode;kills:number;waves:number;bosses:number;finished:boolean}
export interface Profile {version:1;coins:number;diamonds:number;scrap:number;unlocked:number;stars:number[];best:number[];serial:number;active:Ledger|null;weapon:number;wall:number;gear:Record<Slot,Gear>;gems:Gem[];gemSerial:number;research:Partial<Record<SkillId,number>>;mercs:Record<string,number>;team:string[];skin:string;owned:string[];date:string;checkin:string;streak:number;freeChest:string;chests:number;totals:Record<Metric,number>;daily:Record<Metric,number>;claimed:string[];achievements:string[];endlessBest:number;dailyBest:number;settings:{sound:boolean;music:boolean;motion:boolean;quality:'low'|'high';volume:number};tutorial:boolean}
const metrics=():Record<Metric,number>=>({kills:0,waves:0,bosses:0,runs:0,wins:0});
const integer=(value:unknown,max=100000000)=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(max,Math.floor(value))):0;
export const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function daySeed(day:string){let hash=2166136261;for(const c of 'zombie-fire/'+day){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619);}return hash>>>0;}
export function fresh(day=dayKey()):Profile{return {version:1,coins:0,diamonds:0,scrap:0,unlocked:1,stars:Array(STAGES.length).fill(0),best:Array(STAGES.length).fill(0),serial:0,active:null,weapon:0,wall:0,gear:Object.fromEntries(SLOTS.map(s=>[s,{level:0,tier:0,gems:Array(5).fill(null)}])) as Record<Slot,Gear>,gems:[],gemSerial:0,research:{},mercs:{},team:[],skin:'ranger',owned:['ranger'],date:day,checkin:'',streak:0,freeChest:'',chests:0,totals:metrics(),daily:metrics(),claimed:[],achievements:[],endlessBest:0,dailyBest:0,settings:{sound:true,music:true,motion:true,quality:'high',volume:.75},tutorial:false};}
function rollDay(p:Profile,day:string){if(day>p.date){p.date=day;p.daily=metrics();p.claimed=[];p.dailyBest=0;}}
export function normalize(raw:unknown,day=dayKey()):Profile{
 const p=fresh(day);if(!raw||typeof raw!=='object'||(raw as Profile).version!==1)return p;const s=raw as Partial<Profile>;
 for(const k of ['coins','diamonds','scrap','serial','gemSerial','chests','endlessBest','dailyBest'] as const)p[k]=integer(s[k]);
 p.unlocked=Math.max(1,integer(s.unlocked,STAGES.length));p.weapon=integer(s.weapon,30);p.wall=integer(s.wall,30);p.streak=integer(s.streak,7);p.tutorial=s.tutorial===true;
 for(const k of ['date','checkin','freeChest'] as const)if(typeof s[k]==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s[k]!))p[k]=s[k]!;
 for(const k of ['stars','best'] as const)if(Array.isArray(s[k]))p[k]=p[k].map((_,i)=>integer(s[k]?.[i],k==='stars'?3:10000000));
 if(Array.isArray(s.gems)){const seen=new Set<number>();for(const g of s.gems){if(!g||!Number.isSafeInteger(g.id)||g.id<1||g.id>100000000||seen.has(g.id)||!GEM_TYPES.some(t=>t.id===g.type))continue;seen.add(g.id);p.gems.push({id:g.id,type:g.type,grade:integer(g.grade,5)});if(p.gems.length>=500)break;}}
 p.gemSerial=Math.max(p.gemSerial,...p.gems.map(g=>g.id));const equipped=new Set<number>();
 for(const slot of SLOTS){const gear=s.gear?.[slot];if(!gear)continue;p.gear[slot]={level:integer(gear.level,30),tier:integer(gear.tier,5),gems:Array.from({length:5},(_,i)=>{const id=gear.gems?.[i];if(typeof id!=='number'||equipped.has(id)||!p.gems.some(g=>g.id===id))return null;equipped.add(id);return id;})};}
 for(const skill of SKILLS)p.research[skill.id]=integer(s.research?.[skill.id],10);
 for(const merc of MERCENARIES)if(integer(s.mercs?.[merc.id],10))p.mercs[merc.id]=integer(s.mercs?.[merc.id],10);
 if(Array.isArray(s.team))p.team=Array.from(new Set(s.team.filter(id=>MERCENARIES.some(m=>m.id===id)&&p.mercs[id]>0))).slice(0,2);
 if(Array.isArray(s.owned))p.owned=Array.from(new Set(['ranger',...s.owned.filter(id=>SKINS.some(k=>k.id===id))]));if(typeof s.skin==='string'&&p.owned.includes(s.skin))p.skin=s.skin;
 for(const metric of Object.keys(p.totals) as Metric[]){p.totals[metric]=integer(s.totals?.[metric]);p.daily[metric]=integer(s.daily?.[metric]);}
 p.claimed=Array.isArray(s.claimed)?Array.from(new Set(s.claimed.filter(id=>QUESTS.some(q=>q.daily&&q.id===id)))):[];p.achievements=Array.isArray(s.achievements)?Array.from(new Set(s.achievements.filter(id=>QUESTS.some(q=>!q.daily&&q.id===id)))):[];
 if(s.active&&integer(s.active.id)>0&&['campaign','endless','daily'].includes(s.active.mode)){const a=s.active;p.active={id:integer(a.id),stage:integer(a.stage,STAGES.length-1),mode:a.mode,kills:integer(a.kills),waves:integer(a.waves),bosses:integer(a.bosses),finished:a.finished===true};p.serial=Math.max(p.serial,p.active.id);}
 if(s.settings){for(const k of ['sound','music','motion'] as const)if(typeof s.settings[k]==='boolean')p.settings[k]=s.settings[k];p.settings.quality=s.settings.quality==='low'?'low':'high';if(typeof s.settings.volume==='number'&&Number.isFinite(s.settings.volume))p.settings.volume=Math.min(1,Math.max(0,s.settings.volume));}
 rollDay(p,day);return p;
}
export class Armory {
 data:Profile;message='';lastEarned=0;
 constructor(raw:unknown,private save:(p:Profile)=>boolean,private today=()=>dayKey()){this.data=normalize(raw,this.today());}
 currentDay(){return this.today()>this.data.date?this.today():this.data.date;}
 private change(fn:(p:Profile)=>boolean){const next=JSON.parse(JSON.stringify(this.data)) as Profile;rollDay(next,this.today());if(!fn(next))return false;try{if(!this.save(next))throw Error('storage');}catch{this.message='存储空间不足，操作未扣款。请稍后重试。';return false;}this.data=next;return true;}
 private spend(p:Profile,coins:number,scrap=0){if(p.coins<coins||p.scrap<scrap){this.message=`需要 ${coins} 金币${scrap?'和 '+scrap+' 零件':''}。`;return false;}p.coins-=coins;p.scrap-=scrap;return true;}
 checkin(){return this.change(p=>{const day=this.today();if(day<=p.checkin){this.message='今日已签到。';return false;}const previous=new Date(day+'T12:00:00');previous.setDate(previous.getDate()-1);p.streak=p.checkin===dayKey(previous)?p.streak%7+1:1;p.checkin=day;p.coins+=150+p.streak*25;p.scrap+=10;p.diamonds+=10;this.message=`签到成功：${150+p.streak*25} 金币、10 零件、10 钻石。`;return true;});}
 upgradeBase(kind:'weapon'|'wall'){return this.change(p=>{if(!['weapon','wall'].includes(kind)||p[kind]>=30)return false;const cost=100+p[kind]*65;if(!this.spend(p,cost))return false;p[kind]++;this.message=kind==='weapon'?'枪械火力提升，下次出战生效。':'防线耐久提升，下次出战生效。';return true;});}
 upgradeGear(slot:Slot,ascend=false){return this.change(p=>{if(!SLOTS.includes(slot))return false;const g=p.gear[slot];if(ascend){if(g.tier>=5||g.level<(g.tier+1)*5||!this.spend(p,350*(g.tier+1),20*(g.tier+1)))return false;g.tier++;}else{if(g.level>=30||!this.spend(p,70+g.level*35,2+Math.floor(g.level/3)))return false;g.level++;}this.message=`${SLOT_NAMES[slot]}已${ascend?'升阶':'强化'}。`;return true;});}
 research(id:SkillId){return this.change(p=>{if(!SKILLS.some(s=>s.id===id))return false;const level=p.research[id]??0;if(level>=10||!this.spend(p,100+level*80,5+level*2))return false;p.research[id]=level+1;this.message='技能研究完成，下次出战生效。';return true;});}
 mercenary(id:string,deploy=false){return this.change(p=>{const m=MERCENARIES.find(m=>m.id===id);if(!m)return false;const level=p.mercs[id]??0;if(deploy){if(!level)return false;const at=p.team.indexOf(id);if(at>=0)p.team.splice(at,1);else{if(p.team.length>=2){this.message='最多出战两名佣兵，请先撤下其中一名。';return false;}p.team.push(id);}}else{if(level>=10||!this.spend(p,level?150+level*120:m.cost,level?level*5:0))return false;p.mercs[id]=level+1;}this.message=deploy?'已更新出战阵容。':'佣兵培养完成。';return true;});}
 skin(id:string){return this.change(p=>{const skin=SKINS.find(s=>s.id===id);if(!skin)return false;if(!p.owned.includes(id)){if(!this.spend(p,skin.price))return false;p.owned.push(id);}p.skin=id;this.message='已换上'+skin.name+'。';return true;});}
 chest(free=false,premium=false){return this.change(p=>{if(p.gems.length>=500||p.gemSerial>=100000000){this.message='宝石仓库已满，请先合成。';return false;}if(free){if(this.today()<=p.freeChest){this.message='今日补给已领取。';return false;}p.freeChest=this.today();}else if(premium){if(p.diamonds<40){this.message='需要 40 钻石。';return false;}p.diamonds-=40;}else if(!this.spend(p,300))return false;
  const key=p.date+'/'+(++p.chests)+'/'+p.serial,hash=daySeed(key+'/grade'),type=GEM_TYPES[daySeed(key+'/type')%GEM_TYPES.length].id,grade=premium?(hash%100<10?3:2):(hash%100<8?2:hash%100<35?1:0),scrap=premium?16:8;p.gems.push({id:++p.gemSerial,type,grade});p.scrap+=scrap;this.message=`获得${GRADES[grade]}${GEM_TYPES.find(t=>t.id===type)!.name}宝石和 ${scrap} 零件。`;return true;});}
 equip(slot:Slot,socket:number,id:number|null){return this.change(p=>{if(!SLOTS.includes(slot)||!Number.isInteger(socket)||socket<0||socket>=5)return false;if(id!==null&&!p.gems.some(g=>g.id===id))return false;if(id!==null)for(const s of SLOTS)p.gear[s].gems=p.gear[s].gems.map(g=>g===id?null:g);p.gear[slot].gems[socket]=id;this.message=id===null?'已卸下宝石。':'宝石已镶嵌。';return true;});}
 merge(id:number){return this.change(p=>{const gem=p.gems.find(g=>g.id===id);if(!gem||gem.grade>=5)return false;const equipped=SLOTS.flatMap(s=>p.gear[s].gems),matches=p.gems.filter(g=>g.type===gem.type&&g.grade===gem.grade&&!equipped.includes(g.id)).slice(0,3);if(matches.length<3){this.message='需要三颗同类同阶、未镶嵌的宝石。';return false;}p.gems=p.gems.filter(g=>!matches.some(m=>m.id===g.id));p.gems.push({id:++p.gemSerial,type:gem.type,grade:gem.grade+1});this.message='宝石合成成功。';return true;});}
 claim(id:string){return this.change(p=>{const q=QUESTS.find(q=>q.id===id);if(!q)return false;const claimed=q.daily?p.claimed:p.achievements,counts=q.daily?p.daily:p.totals;if(claimed.includes(id)||counts[q.metric]<q.target)return false;claimed.push(id);p.coins+=q.reward;p.diamonds+=q.daily?5:20;this.message=`${q.name}奖励已领取。`;return true;});}
 setting(key:keyof Profile['settings']){return this.change(p=>{if(key==='volume')p.settings.volume=Math.round((p.settings.volume+.25)*100)%125/100;else if(key==='quality')p.settings.quality=p.settings.quality==='low'?'high':'low';else if(['sound','music','motion'].includes(key))p.settings[key]=!p.settings[key];else return false;return true;});}
 completeTutorial(){return this.data.tutorial||this.change(p=>{p.tutorial=true;return true;});}
 begin(stage:number,mode:Mode){let id=0;const result=this.change(p=>{if(!Number.isInteger(stage)||stage<0||stage>=STAGES.length||stage>=p.unlocked||!['campaign','endless','daily'].includes(mode))return false;id=++p.serial;p.active={id,stage,mode,kills:0,waves:0,bosses:0,finished:false};return true;});return result?id:0;}
 checkpoint(id:number,b:Battle,finish=false){
  this.lastEarned=0;const a=this.data.active;if(!a||a.id!==id||a.finished||a.stage!==b.stage||a.mode!==b.mode)return false;
  let reward=0;const result=this.change(p=>{const a=p.active!;const terminal=finish||b.phase==='won'||b.phase==='lost',completed=Math.max(0,b.wave-(b.phase==='won'?0:1));
   const kills=Math.max(0,b.kills-a.kills),waves=Math.max(0,completed-a.waves),bosses=Math.max(0,b.bossKills-a.bosses);reward=kills*(b.mode==='endless'?4:b.mode==='daily'?3:2)+waves*(b.mode==='endless'?45:b.mode==='daily'?35:20)+bosses*40;
   for(const [metric,delta]of [['kills',kills],['waves',waves],['bosses',bosses]] as [Metric,number][]){p.totals[metric]+=delta;p.daily[metric]+=delta;}
   a.kills=Math.max(a.kills,b.kills);a.waves=Math.max(a.waves,completed);a.bosses=Math.max(a.bosses,b.bossKills);p.scrap+=waves*3+bosses*2;
   if(b.mode==='endless')p.endlessBest=Math.max(p.endlessBest,completed);if(b.mode==='daily')p.dailyBest=Math.max(p.dailyBest,b.kills);
   if(terminal){a.finished=true;p.totals.runs++;p.daily.runs++;if(b.phase==='won'){p.totals.wins++;p.daily.wins++;reward+=180;if(b.mode==='campaign'){if(!p.stars[b.stage]){reward+=200;p.diamonds+=20;if(STAGES[b.stage].elite){reward+=400;p.diamonds+=15;p.scrap+=30;}}p.stars[b.stage]=Math.max(p.stars[b.stage],b.hp/b.maxHp>=.8?3:b.hp/b.maxHp>=.4?2:1);p.best[b.stage]=Math.max(p.best[b.stage],Math.round(100000/b.time));p.unlocked=Math.max(p.unlocked,Math.min(STAGES.length,b.stage+2));}}}
   p.coins+=reward;return true;});if(result)this.lastEarned=reward;return result;
 }
 loadout():Loadout{
  const p=this.data,l=defaultLoadout();l.damage+=p.weapon*.07;l.health+=p.wall*120;l.research={...p.research};l.mercenaries=[...p.team];l.mercenaryLevels={...p.mercs};l.skin=p.skin as SkinId;
  for(const slot of SLOTS){const g=p.gear[slot],bonus=g.level*.008+g.tier*.045;if(['helmet','armor','trousers'].includes(slot))l.health+=Math.round(bonus*1200);else l.damage+=bonus;
   for(const id of g.gems){const gem=p.gems.find(g=>g.id===id);if(!gem)continue;const power=(gem.grade+1)*(gem.grade+2)/2;if(gem.type==='power')l.damage+=power*.015;if(gem.type==='haste')l.haste+=power*.008;if(gem.type==='crit')l.crit+=power*.008;if(gem.type==='health')l.health+=power*35;if(gem.type==='armor')l.armor+=power*.005;if(gem.type==='repair')l.repair+=power*2;}
  }return l;
 }
}
