import {clamp,TRIALS,type Run,type Upgrades} from './core';

export const SKINS=[
  {id:'traveler',name:'寻山行者',price:0,color:'#296e66',accent:'#dc7862',detail:'青衣、朱色飘带，轻装踏入山海。',form:'traveler'},
  {id:'fox',name:'青丘狐裳',price:360,color:'#81527f',accent:'#f4c8d4',detail:'狐耳与九尾披帛，林间一抹花影。',form:'fox'},
  {id:'feather',name:'羽民云衣',price:720,color:'#347f95',accent:'#f2e7c7',detail:'羽冠与白羽双翼，衣上带着云光。',form:'feather'},
  {id:'bifang',name:'毕方赤羽',price:1100,color:'#344e67',accent:'#f19b58',detail:'赤羽冠、火纹衣，踏过赤水长风。',form:'bifang'},
  {id:'moon',name:'望舒月影',price:1600,color:'#535b91',accent:'#d1e5ee',detail:'银月冠与星纹长袍，照夜而行。',form:'moon'},
] as const;
export const ARTIFACTS=[
  {id:'magnet',name:'引玉铃',description:'自动吸引灵玉，每级延长 1.5 秒。'},
  {id:'shield',name:'玄龟符',description:'抵挡一次碰撞，每级延长 2 秒；不能防止坠落。'},
  {id:'wind',name:'乘风翎',description:'御风冲刺并自动转弯，每级延长 0.6 秒。'},
  {id:'fortune',name:'寻山佩',description:'每级提高 5% 跑酷得分，不改变速度。'},
] as const;
export const LORE=[
  {name:'陆吾',region:'昆仑',source:'《西山经》',text:'昆仑之丘，帝之下都。陆吾虎身而九尾，守望神山。此行者手中的照夜玉，是古道重新显现的钥匙。'},
  {name:'九尾狐',region:'青丘',source:'《南山经》',text:'青丘之山有兽，状如狐而九尾。林间的狐影并非追兵，沿着它留下的花瓣，可找到散落的山海图。'},
  {name:'毕方',region:'赤水',source:'《西山经》',text:'章莪之山有鸟，状如鹤，一足，赤文青质而白喙。赤水古道上的火鸟石门，取意于这位山海异鸟。'},
  {name:'精卫',region:'归墟',source:'《北山经》',text:'发鸠之山，精卫常衔西山之木石，以堙东海。海桥上的羽光沿用这份不息的意志，指向山海归途。'},
] as const;
type Metric='distance'|'coins'|'turns'|'jumps'|'slides'|'runs'|'wins'|'scrolls';
export type Metrics=Record<Metric,number>;
export const QUESTS=[
  {id:'daily-distance',name:'今日赶路',metric:'distance',target:1000,reward:120,daily:true},
  {id:'daily-jade',name:'拾玉成璧',metric:'coins',target:80,reward:100,daily:true},
  {id:'daily-turns',name:'转过群山',metric:'turns',target:12,reward:120,daily:true},
  {id:'daily-jumps',name:'凌空而过',metric:'jumps',target:20,reward:100,daily:true},
  {id:'first-escape',name:'初见山海',metric:'wins',target:1,reward:200,daily:false},
  {id:'long-road',name:'千里之始',metric:'distance',target:10000,reward:360,daily:false},
  {id:'treasure',name:'古道拾遗',metric:'coins',target:1000,reward:420,daily:false},
  {id:'atlas',name:'山海拾卷',metric:'scrolls',target:12,reward:300,daily:false},
] as const;
export interface Ledger {id:number;mode:string;distance:number;coins:number;turns:number;jumps:number;slides:number;scrolls:number;areas:number;finished:boolean;revived:boolean;recorded:boolean;}
export interface Profile {
  version:1;coins:number;best:number;bestDistance:number;skin:string;owned:string[];upgrades:Upgrades;
  unlocked:number;stars:number[];lore:number[];totals:Metrics;daily:Metrics;date:string;claimed:string[];achievements:string[];
  lastCheckin:string;streak:number;serial:number;active:Ledger|null;dailyBest:number;tutorial:boolean;
  settings:{sound:boolean;music:boolean;helpers:boolean;motion:boolean;quality:'low'|'high'};
}
const freshMetrics=():Metrics=>({distance:0,coins:0,turns:0,jumps:0,slides:0,runs:0,wins:0,scrolls:0});
const whole=(value:unknown,max=100000000)=>typeof value==='number'&&Number.isFinite(value)?clamp(Math.floor(value),0,max):0;
export function dateKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function daySeed(key:string){let hash=2166136261;for(const char of 'shanhai/'+key){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return hash>>>0;}
export function freshProfile(day=dateKey()):Profile{return {version:1,coins:0,best:0,bestDistance:0,skin:'traveler',owned:['traveler'],upgrades:{magnet:0,shield:0,wind:0,fortune:0},unlocked:1,stars:Array(8).fill(0),lore:[],totals:freshMetrics(),daily:freshMetrics(),date:day,claimed:[],achievements:[],lastCheckin:'',streak:0,serial:0,active:null,dailyBest:0,tutorial:false,settings:{sound:true,music:true,helpers:true,motion:true,quality:'high'}};}
export function normalizeProfile(raw:unknown,day=dateKey()):Profile {
  const fresh=freshProfile(day);if(!raw||typeof raw!=='object')return fresh;
  const p=raw as Partial<Profile>;if(p.version!==1)return fresh;
  for(const key of ['coins','best','bestDistance','dailyBest','serial','streak'] as const)fresh[key]=whole(p[key]);
  fresh.streak=Math.min(7,fresh.streak);fresh.unlocked=clamp(whole(p.unlocked),1,8);
  if(Array.isArray(p.stars))fresh.stars=fresh.stars.map((_,i)=>whole(p.stars?.[i],3));
  if(Array.isArray(p.lore))fresh.lore=Array.from(new Set(p.lore.filter(x=>Number.isInteger(x)&&x>=0&&x<4)));
  if(Array.isArray(p.owned))fresh.owned=Array.from(new Set(['traveler',...p.owned.filter(id=>SKINS.some(s=>s.id===id))]));
  if(typeof p.skin==='string'&&fresh.owned.includes(p.skin))fresh.skin=p.skin;
  for(const key of Object.keys(fresh.upgrades) as (keyof Upgrades)[])fresh.upgrades[key]=whole(p.upgrades?.[key],5);
  for(const key of Object.keys(fresh.totals) as Metric[]){fresh.totals[key]=whole(p.totals?.[key]);fresh.daily[key]=whole(p.daily?.[key]);}
  const validDate=(value:unknown)=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?value:'';
  fresh.date=validDate(p.date)||day;fresh.lastCheckin=validDate(p.lastCheckin);fresh.tutorial=p.tutorial===true;
  fresh.claimed=Array.isArray(p.claimed)?Array.from(new Set(p.claimed.filter(id=>QUESTS.some(q=>q.daily&&q.id===id)))):[];
  fresh.achievements=Array.isArray(p.achievements)?Array.from(new Set(p.achievements.filter(id=>QUESTS.some(q=>!q.daily&&q.id===id)))):[];
  if(p.active&&typeof p.active==='object'&&whole(p.active.id)>0){
    const a=p.active;fresh.active={id:whole(a.id),mode:String(a.mode),distance:whole(a.distance),coins:whole(a.coins),turns:whole(a.turns),jumps:whole(a.jumps),slides:whole(a.slides),scrolls:whole(a.scrolls),areas:whole(a.areas),finished:a.finished===true,revived:a.revived===true,recorded:a.recorded===true};
    fresh.serial=Math.max(fresh.serial,fresh.active.id);
  }
  if(p.settings){for(const key of ['sound','music','helpers','motion'] as const)if(typeof p.settings[key]==='boolean')fresh.settings[key]=p.settings[key];fresh.settings.quality=p.settings.quality==='low'?'low':'high';}
  rollDate(fresh,day);return fresh;
}
function rollDate(p:Profile,day:string){if(day>p.date){p.date=day;p.daily=freshMetrics();p.claimed=[];p.dailyBest=0;}}
export class Journey {
  data:Profile;
  message='';
  lastEarned=0;
  constructor(raw:unknown,private readonly save:(value:Profile)=>boolean,private readonly today:()=>string=()=>dateKey()){this.data=normalizeProfile(raw,this.today());}
  private transact(change:(next:Profile)=>boolean){
    const next=JSON.parse(JSON.stringify(this.data)) as Profile;rollDate(next,this.today());
    if(!change(next))return false;
    if(!this.save(next)){this.message='本机存储不可用，请释放空间后重试。';return false;}
    this.data=next;return true;
  }
  get skin(){return SKINS.find(s=>s.id===this.data.skin)??SKINS[0];}
  checkin(){
    return this.transact(p=>{
      const day=this.today();if(day<=p.lastCheckin){this.message='今日已领过灵玉。';return false;}
      const prior=new Date(day+'T12:00:00');prior.setDate(prior.getDate()-1);
      p.streak=p.lastCheckin===dateKey(prior)?p.streak%7+1:1;
      const reward=100+(p.streak-1)*25;p.lastCheckin=day;p.coins+=reward;this.message=`第 ${p.streak} 日，领取 ${reward} 灵玉。`;return true;
    });
  }
  buySkin(id:string){return this.transact(p=>{const skin=SKINS.find(s=>s.id===id);if(!skin)return false;if(!p.owned.includes(id)){if(p.coins<skin.price){this.message='灵玉不足，再跑一段山海古道吧。';return false;}p.coins-=skin.price;p.owned.push(id);}p.skin=id;this.message=`已换上${skin.name}。`;return true;});}
  upgrade(id:keyof Upgrades){return this.transact(p=>{if(!ARTIFACTS.some(a=>a.id===id))return false;const level=p.upgrades[id],cost=100+level*125;if(level>=5){this.message='法宝已升至最高等级。';return false;}if(p.coins<cost){this.message=`还需要 ${cost-p.coins} 灵玉。`;return false;}p.coins-=cost;p.upgrades[id]++;this.message=`法宝升至 ${level+1} 级，下次出发时生效。`;return true;});}
  claim(id:string){return this.transact(p=>{const q=QUESTS.find(q=>q.id===id);if(!q)return false;const list=q.daily?p.claimed:p.achievements,metrics=q.daily?p.daily:p.totals;if(list.includes(id)||metrics[q.metric]<q.target)return false;list.push(id);p.coins+=q.reward;this.message=`${q.name}：领取 ${q.reward} 灵玉。`;return true;});}
  setting<K extends keyof Profile['settings']>(key:K,value:Profile['settings'][K]){return this.transact(p=>{p.settings[key]=value;return true;});}
  begin(mode:string){
    let id=0;const saved=this.transact(p=>{id=++p.serial;p.active={id,mode,distance:0,coins:0,turns:0,jumps:0,slides:0,scrolls:0,areas:0,finished:false,revived:false,recorded:false};return true;});
    return saved?id:0;
  }
  checkpoint(id:number,run:Run){
    if(!id||!this.data.active||this.data.active.id!==id||this.data.active.finished)return false;
    this.lastEarned=0;
    const saved=this.transact(p=>{
      const active=p.active!;if(active.id!==id||active.finished)return false;
      if(run.mode==='training'){if(run.phase==='won'){p.tutorial=true;active.finished=true;}return true;}
      const totals:Record<Metric,number>={distance:Math.floor(run.distance),coins:run.stats.coins,turns:run.stats.turns,jumps:run.stats.jumps,slides:run.stats.slides,scrolls:run.stats.scrolls,runs:1,wins:run.phase==='won'?1:0};
      for(const key of ['distance','coins','turns','jumps','slides','scrolls'] as const){const delta=Math.max(0,totals[key]-active[key]);p.totals[key]+=delta;p.daily[key]+=delta;active[key]=Math.max(active[key],totals[key]);}
      const coinGain=Math.max(0,run.stats.coins-this.data.active!.coins)*(run.mode==='endless'?2:1);
      const areaGain=Math.max(0,run.stats.areas-active.areas)*100;
      active.areas=Math.max(active.areas,run.stats.areas);
      let reward=coinGain+areaGain;
      p.best=Math.max(p.best,run.score);p.bestDistance=Math.max(p.bestDistance,Math.floor(run.distance));
      if(run.mode==='daily')p.dailyBest=Math.max(p.dailyBest,run.score);
      for(const area of run.scrollAreas)if(!p.lore.includes(area))p.lore.push(area);
      if(run.phase==='won'||run.phase==='dead'){
        active.finished=true;if(!active.recorded){p.totals.runs++;p.daily.runs++;active.recorded=true;}
        if(run.phase==='won'){
          p.totals.wins++;p.daily.wins++;reward+=100;
          if(run.mode==='trial'){
            if(!p.stars[run.trial])reward+=150;
            p.stars[run.trial]=Math.max(p.stars[run.trial],run.stats.stumbles===0&&!run.revived?3:run.stats.stumbles<3?2:1);
            p.unlocked=Math.max(p.unlocked,Math.min(8,run.trial+2));
            const area=TRIALS[run.trial].area;if(!p.lore.includes(area))p.lore.push(area);
          }
        }
      }
      p.coins+=reward;this.lastEarned=reward;return true;
    });
    if(!saved)this.lastEarned=0;return saved;
  }
  /** Reserve before changing the run; a failed write must never grant a rescue. */
  rescue(id:number){return this.transact(p=>{const active=p.active;if(!active||active.id!==id||!active.finished||active.revived||active.mode==='daily'||active.mode==='training'||p.coins<150)return false;p.coins-=150;active.revived=true;active.finished=false;this.message='还魂玉护住了你，继续前行。';return true;});}
}
