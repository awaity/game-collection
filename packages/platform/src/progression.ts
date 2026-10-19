/** Local progression shared by Canvas, Three and Creator. No DOM or platform APIs. */
export const SKINS = [
  { id: 'classic', name: '经典原色', cost: 0, color: '#55c7f8', trim: '#e9f8ff', mark: '●' },
  { id: 'sunrise', name: '日曜先锋', cost: 180, color: '#ffbc48', trim: '#fff1bc', mark: '✦' },
  { id: 'mint', name: '薄荷游侠', cost: 360, color: '#57dba7', trim: '#d4fff0', mark: '◆' },
  { id: 'orchid', name: '星云旅人', cost: 650, color: '#b99aff', trim: '#f3d4ff', mark: '✧' },
  { id: 'ember', name: '赤焰领航', cost: 1000, color: '#ff7566', trim: '#ffe5b0', mark: '▲' },
];
export const UPGRADES = [
  { id: 'power', name: '火力校准', description: '每级增加 12% 真实攻击伤害' },
  { id: 'haste', name: '快速装填', description: '每级缩短 4% 攻击间隔' },
  { id: 'guard', name: '生存补给', description: '增加开局生命、队员或植物耐久' },
] as const;
export type Upgrade = typeof UPGRADES[number]['id'];
export interface Metrics { kills: number; wins: number; waves: number; seconds: number; runs: number }
const emptyMetrics = (): Metrics => ({kills:0,wins:0,waves:0,seconds:0,runs:0});
const n = (value: unknown, max = 1e9) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0,Math.min(max,Math.floor(value))) : 0;
export const TASKS = [
  {id:'daily-kills',name:'清理防线',metric:'kills',goal:60,coins:120,daily:true},
  {id:'daily-win',name:'凯旋而归',metric:'wins',goal:1,coins:150,daily:true},
  {id:'daily-waves',name:'无尽巡逻',metric:'waves',goal:3,coins:240,daily:true},
  {id:'daily-time',name:'坚持作战',metric:'seconds',goal:180,coins:100,daily:true},
  {id:'first-win',name:'首胜纪念',metric:'wins',goal:1,coins:200,daily:false},
  {id:'veteran',name:'十战老兵',metric:'wins',goal:10,coins:700,daily:false},
  {id:'hunter',name:'千敌破阵',metric:'kills',goal:1000,coins:600,daily:false},
  {id:'endless-10',name:'无尽远征者',metric:'waves',goal:10,coins:900,daily:false},
] as const;
export interface CareerSave {
  version:1; coins:number; earned:number; skin:string; owned:string[]; upgrades:Record<Upgrade,number>;
  totals:Metrics; day:string; daily:Metrics; claimed:string[]; achievements:string[];
  checkin:string; streak:number; clears:string[]; sequence:number;
  active:{id:number;mode:'stage'|'endless';kills:number;waves:number;seconds:number;wins:string[]} | null;
}
/** ISO local day, ordered lexically. A clock rollback cannot reissue older daily rewards. */
export function calendarDay(now = new Date()) { return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
function metrics(value:unknown = {}):Metrics {const raw=(value&&typeof value==='object'?value:{}) as Partial<Metrics>;return {kills:n(raw.kills),wins:n(raw.wins),waves:n(raw.waves),seconds:n(raw.seconds),runs:n(raw.runs)};}
export function normalizeCareer(raw:unknown):CareerSave {
  let v:any=raw;try{if(typeof v==='string')v=JSON.parse(v);}catch{v=null;}
  if(!v||typeof v!=='object'||v.version!==1)v={};
  // Creator's loose Babel transform treats iterable spread as array concat.
  // Explicit conversion preserves purchased skins and claimed rewards on reload.
  const strings=(value:unknown,max=2000)=>Array.isArray(value)?Array.from(new Set(value.filter((x):x is string=>typeof x==='string'&&x.length<90))).slice(0,max):[];
  const date=(x:unknown)=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)?x:'';
  const owned=['classic',...strings(v.owned).filter(x=>x!=='classic'&&SKINS.some(s=>s.id===x))];
  return {version:1,coins:n(v.coins),earned:n(v.earned),skin:owned.includes(v.skin)?v.skin:'classic',owned,
    upgrades:{power:n(v.upgrades?.power,5),haste:n(v.upgrades?.haste,5),guard:n(v.upgrades?.guard,5)},
    totals:metrics(v.totals),day:date(v.day),daily:metrics(v.daily),claimed:strings(v.claimed),achievements:strings(v.achievements),
    checkin:date(v.checkin),streak:n(v.streak,7),clears:strings(v.clears),sequence:n(v.sequence),
    active:v.active&&Number.isSafeInteger(v.active.id)&&v.active.id===n(v.sequence)?{id:v.active.id,mode:v.active.mode==='endless'?'endless':'stage',kills:n(v.active.kills),waves:n(v.active.waves),seconds:n(v.active.seconds),wins:strings(v.active.wins)}:null};
}
export class Career {
  data:CareerSave; message='完成战斗赚金币，皮肤只改变外观。'; lastReward=0;
  private write:(value:CareerSave)=>boolean; private now:()=>Date;
  constructor(raw:unknown,write:(value:CareerSave)=>boolean,now=()=>new Date()){this.data=normalizeCareer(raw);this.write=write;this.now=now;}
  get skin(){return SKINS.find(s=>s.id===this.data.skin)!;}
  get buffs(){return {damage:1+this.data.upgrades.power*.12,interval:1-this.data.upgrades.haste*.04,guard:this.data.upgrades.guard};}
  cost(id:Upgrade){return 100+this.data.upgrades[id]*150;}
  private change(change:(d:CareerSave)=>string|false){
    const next:CareerSave=JSON.parse(JSON.stringify(this.data)),today=calendarDay(this.now());
    if(today>next.day){next.day=today;next.daily=emptyMetrics();next.claimed=[];}
    const message=change(next);if(message===false)return false;
    try{if(!this.write(next)){this.message='保存失败，请检查存储空间后重试。';return false;}}catch{this.message='保存失败，请检查存储空间后重试。';return false;}
    this.data=next;this.message=message;return true;
  }
  begin(mode:'stage'|'endless'){
    this.lastReward=0;
    const ok=this.change(d=>{d.sequence++;d.active={id:d.sequence,mode,kills:0,waves:0,seconds:0,wins:[]};d.totals.runs++;d.daily.runs++;return mode==='endless'?'无尽挑战：击破奖励翻倍，每波至少 120 金币。':'首次通关每张地图另奖 150 金币。';});
    return ok?this.data.sequence:0;
  }
  /** Cumulative counters + persisted run token make retries, pauses and duplicate results idempotent. */
  checkpoint(run:number,values:{kills:number;seconds:number;waves?:number;clear?:string}){
    if(!run||this.data.active?.id!==run)return 0;
    const before=this.data.coins;
    this.change(d=>{
      const a=d.active!;let reward=0;const dk=Math.max(0,n(values.kills)-a.kills),ds=Math.max(0,n(values.seconds)-a.seconds),dw=Math.max(0,n(values.waves)-a.waves);
      if(!dk&&!ds&&!dw&&(!values.clear||a.wins.includes(values.clear)))return false;
      for(const [key,delta] of [['kills',dk],['seconds',ds],['waves',dw]] as const){d.totals[key]+=delta;d.daily[key]+=delta;a[key]+=delta;}
      reward+=dk*(a.mode==='endless'?4:2);
      if(a.mode==='endless')for(let wave=a.waves-dw+1;wave<=a.waves;wave++)reward+=120+Math.min(wave,20)*20;
      if(values.clear&&!a.wins.includes(values.clear)){
        a.wins.push(values.clear);d.totals.wins++;d.daily.wins++;reward+=100;
        if(!d.clears.includes(values.clear)){d.clears.push(values.clear);reward+=150;}
      }
      d.coins=Math.min(1e9,d.coins+reward);d.earned=Math.min(1e9,d.earned+reward);
      return reward?`战斗奖励 +${reward} 金币，已保存。`:this.message;
    });
    const gained=this.data.coins-before;this.lastReward+=gained;return gained;
  }
  checkIn(){
    const today=calendarDay(this.now());
    if(today<=this.data.checkin){this.message='今天已签到，明天再来领取。';return false;}
    return this.change(d=>{
      const yesterday=new Date(this.now());yesterday.setDate(yesterday.getDate()-1);
      d.streak=d.checkin===calendarDay(yesterday)?d.streak%7+1:1;d.checkin=today;
      const reward=100+d.streak*25;d.coins+=reward;d.earned+=reward;return `连续签到 ${d.streak} 天，领取 ${reward} 金币。`;
    });
  }
  taskProgress(id:string){const t=TASKS.find(t=>t.id===id);if(!t)return 0;return t.daily&&calendarDay(this.now())>this.data.day?0:(t.daily?this.data.daily:this.data.totals)[t.metric];}
  claim(id:string){const t=TASKS.find(t=>t.id===id);if(!t)return false;return this.change(d=>{
    const list=t.daily?d.claimed:d.achievements;
    if(list.includes(id)||(t.daily?d.daily:d.totals)[t.metric]<t.goal){this.message='目标尚未完成，或奖励已经领取。';return false;}
    list.push(id);d.coins+=t.coins;d.earned+=t.coins;return `${t.name}：领取 ${t.coins} 金币。`;
  });}
  buySkin(id:string){const skin=SKINS.find(s=>s.id===id);if(!skin)return false;return this.change(d=>{
    if(!d.owned.includes(id)){if(d.coins<skin.cost){this.message=`还需 ${skin.cost-d.coins} 金币。`;return false;}d.coins-=skin.cost;d.owned.push(id);}
    d.skin=id;return `已装备「${skin.name}」，下次出战生效。`;
  });}
  upgrade(id:Upgrade){if(!UPGRADES.some(u=>u.id===id))return false;return this.change(d=>{
    const cost=this.cost(id);if(d.upgrades[id]>=5){this.message='该项已经达到满级。';return false;}
    if(d.coins<cost){this.message=`还需 ${cost-d.coins} 金币。`;return false;}
    d.coins-=cost;d.upgrades[id]++;return `强化至 Lv.${d.upgrades[id]}，下次出战生效。`;
  });}
}
