import*as d from'./domain';
export type HeroId='wren'|'mira'|'oskar'|'sable';
export interface Settings{master:number;sfx:number;music:number;quality:'low'|'high'|'ultra';numbers:boolean;shake:boolean;calm:boolean;safetySeen:boolean;hero:HeroId;stage:number;blood:boolean;zoom:number}
export interface Progress{embers:number;hearth:Record<string,number>;cleared:boolean[];clearedBlood:boolean[];best:({time:number;kills:number;won:boolean;keepers:number}|null)[];totalKills:number;maxLevel:number;runs:number;seenMonsters:string[];seenWeapons:string[];seenRelics:string[];storyRead:number;heroWins:Record<string,number>;items:Record<string,number>;itemsUsed:number;ach:Record<string,number>}
export interface RunResult{stage:number;stageId:string;hero:HeroId;blood:boolean;won:boolean;time:number;kills:number;level:number;embers:number;tithe:number;weapons:{id:string;level:number;dmg:number;kills:number}[];passives:Record<string,number>;relics:string[];damageTaken:number;evolved:string[];fastKeeper:boolean;itemsUsed:number;keepers:number;monstersSeen:string[];weaponsSeen:string[];relicsSeen:string[]}
export interface SavedNight{version:1;progress:Progress;settings:Settings}
const record=(v:unknown):Record<string,any>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v:{};
const number=(v:unknown,max=1e9)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
export function restoreNight(raw:unknown):SavedNight{const v=record(raw),p=record(v.progress),s=record(v.settings),progress:Progress=d.defaultProgress(),settings:Settings={...d.defaultSettings,zoom:1};
 for(const k of['embers','totalKills','maxLevel','runs','itemsUsed','storyRead']as const)progress[k]=number(p[k]);
 for(const k of['cleared','clearedBlood']as const)progress[k]=Array.from({length:6},(_,i)=>p[k]?.[i]===true);
 for(const h of d.HEARTH)progress.hearth[h.id]=Math.min(h.max,number(record(p.hearth)[h.id]));
 for(const id of d.ITEM_IDS)progress.items[id]=number(record(p.items)[id],9);
 for(const h of d.HEROES)progress.heroWins[h.id]=number(record(p.heroWins)[h.id]);
 for(const a of d.ACHIEVEMENTS)if(number(record(p.ach)[a.id]))progress.ach[a.id]=number(p.ach[a.id],Number.MAX_SAFE_INTEGER);
 for(const[k,ids]of[['seenMonsters',Object.keys(d.MONSTERS)],['seenWeapons',Object.keys(d.WEAPONS)],['seenRelics',d.RELICS]]as const){const a=p[k];progress[k]=Array.isArray(a)?Array.from(new Set(a.filter((x:unknown):x is string=>typeof x==='string'&&ids.includes(x)))):[]}
 progress.best=Array.from({length:6},(_,i)=>{const b=record(p.best?.[i]);return Object.keys(b).length?{time:number(b.time),kills:number(b.kills),won:b.won===true,keepers:number(b.keepers,5)}:null});
 for(const k of['master','sfx','music','zoom']as const)if(typeof s[k]==='number'&&Number.isFinite(s[k]))settings[k]=Math.max(k==='zoom'?.7:0,Math.min(k==='zoom'?1.4:1,s[k]));
 for(const k of['numbers','shake','calm','safetySeen','blood']as const)if(typeof s[k]==='boolean')settings[k]=s[k];
 if(['low','high','ultra'].includes(s.quality))settings.quality=s.quality;if(d.HEROES.some((h:any)=>h.id===s.hero&&d.heroUnlocked(progress,h)))settings.hero=s.hero;const stage=number(s.stage,5);if(d.stageUnlocked(progress,stage))settings.stage=stage;
 return{version:1,progress,settings};
}
/** Owns transitions and settlement. The reference rules own combat and progression values. */
export class NightSession{
 progress:Progress;settings:Settings;run:any;phase:'menu'|'play'|'paused'|'result'='menu';result:RunResult|null=null;unlocks:{kind:string;id:string}[]=[];deeds:any[]=[];toast='';toastTime=0;private settled=false;
 constructor(raw:unknown,private write:(save:SavedNight)=>boolean){const v=restoreNight(raw);this.progress=v.progress;this.settings=v.settings;d.configurePersistence(()=>this.save());this.toMenu()}
 save(){const ok=this.write({version:1,progress:this.progress,settings:this.settings});if(!ok)this.notify('本机存储暂不可用，当前游戏仍可继续。');return ok}
 notify(text:string){this.toast=text;this.toastTime=3}
 toMenu(){this.run?.phys.dispose();if(!d.heroUnlocked(this.progress,d.HEROES.find((h:any)=>h.id===this.settings.hero)))this.settings.hero='wren';if(!d.stageUnlocked(this.progress,this.settings.stage))this.settings.stage=0;this.phase='menu';this.run=d.createRun({stageIndex:this.settings.stage,heroId:this.settings.hero,seed:7,title:true});this.result=null}
 selectHero(id:HeroId){const h=d.HEROES.find((x:any)=>x.id===id);if(!h||!d.heroUnlocked(this.progress,h))return false;this.settings.hero=id;this.save();this.toMenu();return true}
 selectStage(index:number){if(!d.stageUnlocked(this.progress,index))return false;this.settings.stage=index;this.save();this.toMenu();return true}
 start(seed=(Date.now()&0x7fffffff)^Math.floor(Math.random()*1e9)){this.run?.phys.dispose();this.run=d.createRun({stageIndex:this.settings.stage,heroId:this.settings.hero,hearth:this.progress.hearth,blood:this.settings.blood&&!!this.progress.cleared[this.settings.stage],seed,unlocked:d.unlockedWeapons(this.progress),items:this.progress.items});this.phase='play';this.result=null;this.settled=false}
 step(input:{mx:number;my:number}|null){if(this.phase==='paused'||this.phase==='result')return;d.stepRun(this.run,input);if(!this.run.title){for(const id of this.run.itemLog.splice(0))d.consumeItem(this.progress,id);if((this.run.phase==='dead'||this.run.phase==='won')&&this.run.phaseT>=(this.run.phase==='won'?192:144))this.finish()}}
 pause(){if(this.phase==='play')this.phase='paused';this.save()}
 resume(){if(this.phase==='paused')this.phase='play'}
 finish(){if(this.settled||this.run.title)return;this.settled=true;this.result=d.runResult(this.run);this.unlocks=d.recordResult(this.progress,this.result);this.deeds=d.awardAchievements(this.progress,this.result);this.phase='result';if(this.result!.won&&this.result!.stage<5&&!this.progress.cleared[this.result!.stage+1])this.settings.stage=this.result!.stage+1;this.save()}
 abandon(){if(this.run.title)return;this.run.phase='dead';this.finish()}
 buyHearth(id:string){const h=d.HEARTH.find((x:any)=>x.id===id);if(!h)return false;const level=this.progress.hearth[id]??0,cost=d.hearthCost(h,level);if(level>=h.max||this.progress.embers<cost)return false;this.progress.embers-=cost;this.progress.hearth[id]=level+1;this.deeds=d.awardAchievements(this.progress);this.save();return true}
 buyItem(id:string){const item=d.ITEMS.find((x:any)=>x.id===id),count=this.progress.items[id]??0;if(!item||count>=9||this.progress.embers<item.cost)return false;this.progress.embers-=item.cost;this.progress.items[id]=count+1;this.save();return true}
 reset(){this.progress=d.defaultProgress();this.settings.hero='wren';this.settings.stage=0;this.settings.blood=false;this.toMenu();this.save()}
 destroy(){this.run?.phys.dispose();d.configurePersistence(()=>{})}
}
