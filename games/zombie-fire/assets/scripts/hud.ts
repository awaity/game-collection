import {Graphics,UITransform} from 'cc';
import {GameView,color} from 'db://assets/collection/runtime';
import {Session} from './session';
import {DAILY_RULES,ENEMIES,LUCKY_ORB,MAPS,SKILLS,STAGES,UPGRADES,describeUpgrade,signedLuck,skinAbility,skillById,upgradeById} from './content';
import {daySeed,GEM_TYPES,GRADES,MERCENARIES,QUESTS,SKINS,SLOTS,SLOT_NAMES,type Slot} from './profile';
import type {Mode} from './core';
import {skillIcon} from './icons';
import type {SkillId} from './content';
import {drawCamp,drawSoldier} from './illustration';
const ink='#172029',paper='#e9dfc6',orange='#f39626',blue='#49b7ef';
interface Row {id:string;title:string;detail:string;actions?:{id:string;label:string;run:()=>void;disabled?:boolean}[];tint?:string;skin?:string}
export class BattlefieldUI {
 panel='';page=0;stage=0;gemSlot:Slot='weapon';socket=0;earned=0;codexTab='skills';
 constructor(private ui:GameView,private session:Session,private begin:(mode:Mode,stage:number)=>void,private home:()=>void){}
 private get top(){return this.ui.height/2-this.ui.insets.top-24;}
 private get bottom(){return -this.ui.height/2+this.ui.insets.bottom+18;}
 private button(id:string,label:string,x:number,y:number,width:number,action:()=>void,accent=false,height=44,disabled=false){const node=this.ui.button(id,label,x,y,width,disabled?()=>{}:action,accent,height),g=node.getComponent(Graphics)!;g.clear();g.fillColor=color(disabled?'#39464d':accent?orange:'#455560');g.strokeColor=color(disabled?'#536069':accent?'#f6d698':'#84938f');g.lineWidth=1.5;g.roundRect(-width/2,-height/2,width,height,6);g.fill();g.stroke();this.ui.buttons.get(id)!.label.color=color(disabled?'#899995':accent?ink:paper);return node;}
 private text(id:string,value:string,x:number,y:number,size=15,tint=paper,width=300,bold=false,height=size*2.6){const label=this.ui.text(id,value,x,y,size,tint,width);label.isBold=bold;label.node.getComponent(UITransform)!.setContentSize(width,height);return label;}
 private icon(id:string,skill:SkillId,x:number,y:number,size:number,seal=false){this.ui.panel(id,x,y,size,size,'#33464e');skillIcon(this.ui.objects.get('panel:'+id)!.getComponent(Graphics)!,skill,size,seal);}
 open(panel:string){this.panel=panel;this.page=0;this.session.armory.message='';}
 draw(){
  const b=this.session.battle,a=this.session.armory,p=a.data,w=Math.min(720,this.ui.width-24),top=this.top,bottom=this.bottom;
  if(this.panel){this.drawPanel();return;}
  if(b.phase==='ready'){
   this.ui.panel('camp:shade',0,0,this.ui.width,this.ui.height,'#293b45');
   const wide=this.ui.width>this.ui.height*1.35,menuX=wide?w*.25:0,menuW=wide?w*.48:w,titleX=wide?-w*.26:0,titleW=wide?w*.46:w;
   const startY=wide?Math.max(bottom+157,-70):bottom+170,titleY=wide?Math.min(top-49,startY+230):top-49;
   this.text('title','向僵尸开炮',titleX,titleY,34,paper,titleW,true);this.text('subtitle','守住防线，每一次升级都改变战局',titleX,titleY-35,13,'#c9d1c8',titleW);
   this.text('currency',`金币 ${p.coins}    零件 ${p.scrap}    钻石 ${p.diamonds}`,titleX,titleY-66,14,orange,titleW);
   this.button('settings','设置',w/2-30,top,60,()=>this.open('settings'));
   this.button('codex','图鉴',-w/2+30,top,60,()=>this.open('codex'));
   const pictureTop=titleY-86,pictureBottom=wide?Math.max(bottom+28,startY-142):startY+139,pictureHeight=Math.max(32,pictureTop-pictureBottom),pictureY=(pictureTop+pictureBottom)/2,pictureWidth=wide?titleW:Math.min(340,w);
   this.ui.panel('camp:illustration',titleX,pictureY,pictureWidth,pictureHeight,'#00000000');drawCamp(this.ui.objects.get('panel:camp:illustration')!.getComponent(Graphics)!,pictureWidth,pictureHeight,p.skin,MAPS[STAGES[this.stage].map].accent);
   this.text('stage',`第 ${this.stage+1} 关\n${STAGES[this.stage].name}`,menuX,startY+109,16,paper,menuW-160,true);
   this.button('stage-prev','上一关',menuX-menuW/2+38,startY+109,72,()=>{this.stage=Math.max(0,this.stage-1)});
   this.button('stage-next','下一关',menuX+menuW/2-38,startY+109,72,()=>{this.stage=Math.min(p.unlocked-1,this.stage+1)});
   this.text('stars',p.stars[this.stage]?'★'.repeat(p.stars[this.stage]):'完成防守，解锁下一处战场',menuX,startY+78,12,orange,menuW);
   this.button('endless','无尽挑战',menuX-menuW/4-4,startY+43,menuW/2-10,()=>this.begin('endless',this.stage),false,38);
   this.button('daily','每日试炼',menuX+menuW/4+4,startY+43,menuW/2-10,()=>this.begin('daily',0),false,38);
   this.button('start','开始守卫',menuX,startY-8,menuW-6,()=>this.begin('campaign',this.stage),true,50);
   const links=[['gear','装备'],['research','研究'],['wall','防线'],['merc','佣兵'],['supply','补给'],['quests','任务']];
   links.forEach(([id,label],i)=>this.button('open:'+id,label,menuX+(i%3-1)*(menuW/3+1),startY-64-Math.floor(i/3)*50,menuW/3-7,()=>this.open(id)));
   this.text('notice',a.message||'今日试炼 · '+DAILY_RULES[daySeed(a.currentDay())%DAILY_RULES.length].name,0,bottom+9,12,orange,w);
   return;
  }
  this.ui.panel('hud:bar',0,top-8,w,57,'#2d3d49e8');
  if(b.phase==='playing')this.button('pause','暂停',-w/2+31,top-9,56,()=>this.session.pause(),false,40);
  this.text('wave',`${b.dailyRule?b.dailyRule.name+' · ':''}第 ${b.wave} / ${Number.isFinite(b.maxWaves)?b.maxWaves:'∞'} 波`,0,top+2,16,paper,w-135,true);
  this.text('clock',`${Math.floor(b.time/60).toString().padStart(2,'0')}:${Math.floor(b.time%60).toString().padStart(2,'0')}    击杀 ${b.kills}`,0,top-20,12,'#d3d8cd',w-130);
  this.text('level','Lv.'+b.level,w/2-35,top-8,18,orange,65,true);
  this.ui.panel('xp:bg',0,top-43,w,8,'#283f4b');this.ui.panel('xp:fill',-(1-b.xp/b.xpNeeded)*w/2,top-43,Math.max(1,w*b.xp/b.xpNeeded),8,blue);
  const compact=this.ui.width>this.ui.height&&this.ui.height-this.ui.insets.top-this.ui.insets.bottom<500;
  const splitFooter=compact&&!!b.learned.orb;
  this.text('wall',`防线 ${Math.ceil(b.hp)} / ${b.maxHp}    ${b.reload>0?'装填中':`弹匣 ${b.ammo}`}`,splitFooter?-w/4:0,bottom+28,13,paper,splitFooter?w/2-12:w);
  if(this.session.saveFailed)this.text('save:warning','奖励等待保存 · 暂停后可重试',0,bottom+6,12,orange,w);
  else if(b.skinProgress){const s=b.skinProgress;this.text('skin:charge',`${s.name} ${s.hits}/${s.threshold} · 已触发 ${s.triggers} 次`,0,bottom+6,11,skillById[s.skill].color,w);}
  const learned=Object.entries(b.learned),skillX=Math.min(480,this.ui.width-84)/2+12,spacing=Math.min(67,(top-bottom-98)/Math.max(1,learned.length));
  learned.forEach(([id,rank],i)=>{const y=top-91-i*spacing,size=Math.min(42,spacing-17);this.icon('skill:icon'+i,id as SkillId,skillX,y,size);const caption=id==='orb'?`幸${b.orbLuck}/21`:id==='dragon'&&b.dragon?`${Math.floor(b.dragon.energy)}/${b.dragon.maxEnergy}`:'Lv.'+rank;this.text('skill:'+i,caption,skillX,y-size/2-8,10,skillById[id as SkillId].color,56);});
  if(b.learned.orb){const progress=b.luckyProgress,quality=LUCKY_ORB.qualities.find(q=>q.id===progress.quality);this.text('orb:charge',`幸运弹球 ${progress.charge}/${progress.required}${quality?' · 上次'+quality.name:''}`,splitFooter?w/4:0,bottom+(splitFooter?28:55),11,quality?.color??skillById.orb.color,splitFooter?w/2-12:Math.min(350,w-24));}
  if(b.time<12&&b.phase==='playing')this.text('aim:hint','自动射击 · 轻触敌人可优先集火',0,compact?top-55:bottom+(b.learned.orb?77:55),11,paper,Math.min(350,w-24));
  if(b.phase==='choice')this.choices();
  if(b.phase==='paused'){
   this.ui.panel('pause:shade',0,0,this.ui.width,this.ui.height,'#24333de9');this.text('pause:title','战线暂歇',0,105,30,paper,w,true);this.text('pause:detail','返回后可继续当前战斗',0,65,14,'#bdc9c4',w);
   this.button('resume','继续守卫',0,2,230,()=>this.session.resume(),true,50);this.button('home','返回营地',0,-61,230,this.home);
   if(this.session.saveFailed)this.button('retry-save','重试保存奖励',0,-119,230,()=>this.session.checkpoint());
  }
  if(b.phase==='won'||b.phase==='lost'){
   this.ui.panel('result:shade',0,0,this.ui.width,this.ui.height,'#24333df0');this.text('result:title',b.phase==='won'?'防守成功':'防线失守',0,135,32,b.phase==='won'?orange:'#e9957a',w,true);
   this.text('result:detail',`坚持 ${Math.floor(b.time)} 秒 · 消灭 ${b.kills} 名敌人\n本局获得 ${this.session.earned} 金币`,0,78,16,paper,w);
   this.text('result:hint',this.session.saveFailed?'存档写入失败，请重试保存。':b.phase==='won'?'整备装备，向下一处战场出发。':'在营地强化装备，尝试不同的技能组合。',0,20,13,'#bccbc8',w);
   const next=b.phase==='won'&&b.mode==='campaign'&&b.stage+1<p.unlocked;
   this.button(next?'next':'retry',next?'前往下一关':'重新挑战',0,-46,230,()=>this.begin(b.mode,b.stage+(next?1:0)),true,48);this.button('home','返回营地',0,-107,230,this.home);
   if(this.session.saveFailed)this.button('retry-save','重试保存奖励',0,-163,230,()=>this.session.checkpoint(),false,40);
  }
 }
 private choices(){
  const b=this.session.battle,w=Math.min(650,this.ui.width-18),height=Math.min(320,this.ui.height-210),cardWidth=(w-18)/3,center=this.ui.height<500?5:8;
  this.ui.panel('choice:shade',0,0,this.ui.width,this.ui.height,'#1e2c3ee9');this.text('choice:title',this.session.armory.data.tutorial?'选择技能':'选择第一项技能',0,center+height/2+47,27,orange,w,true);
  this.text('choice:hint',b.learned.orb?`幸运 ${b.orbLuck}/21 · ${b.orbLuck===21?'终极词条已开启':'超过21点重置为1'}`:b.dailyRule&&b.time===0?b.dailyRule.description:'战斗已暂停 · 选择后自动射击',0,center+height/2+21,12,paper,w);
  b.cards.forEach((card,i)=>{
   const hasLuck=card.luckChange!==undefined,luck=hasLuck?`幸运 ${signedLuck(card.luckChange!)} → ${card.luckAfter}`:'',overflow=hasLuck&&b.orbLuck+card.luckChange!>21;
   const x=(i-1)*(cardWidth+7);const node=this.button('choose:'+i,'选择 '+card.name+(hasLuck?`，${luck}${overflow?'，溢出归1':''}`:''),x,center,cardWidth,()=>{if(b.choose(card.id))this.session.armory.completeTutorial();},false,height);this.ui.buttons.get('choose:'+i)!.label.node.active=false;
   const g=node.getComponent(Graphics)!;g.clear();g.fillColor=color(paper);g.strokeColor=color(card.kind==='evolution'?orange:'#b5b2a1');g.lineWidth=card.kind==='evolution'?3:1.5;g.rect(-cardWidth/2,-height/2,cardWidth,height);g.fill();g.stroke();
   // Original archive paper: faint drafting grid, perforation and folded corner.
   g.strokeColor=color('#958d7440');g.lineWidth=.5;
   const gridTop=height/2-48,gridBottom=-height*.05;
   for(let xx=-cardWidth/2+7;xx<cardWidth/2-5;xx+=12){g.moveTo(xx,gridBottom);g.lineTo(xx,gridTop);}
   for(let yy=gridBottom;yy<gridTop;yy+=12){g.moveTo(-cardWidth/2+5,yy);g.lineTo(cardWidth/2-5,yy);}g.stroke();
   g.strokeColor=color('#857c64');g.lineWidth=1;for(let xx=-cardWidth/2+9;xx<cardWidth/2-8;xx+=5){g.moveTo(xx,gridBottom-3);g.lineTo(xx+2,gridBottom-3);}g.stroke();
   g.fillColor=color('#baad90');g.moveTo(cardWidth/2-13,-height/2);g.lineTo(cardWidth/2,-height/2+13);g.lineTo(cardWidth/2-1,-height/2);g.close();g.fill();
   this.ui.panel('choice:header'+i,x,center+height/2-24,cardWidth-4,43,'#514b3c');
   const header=this.ui.objects.get('panel:choice:header'+i)!.getComponent(Graphics)!;header.clear();header.fillColor=color('#514b3c');header.rect(-(cardWidth-4)/2,-21.5,cardWidth-4,43);header.fill();header.fillColor=color('#9a9077');for(const side of [-1,1]){header.circle(side*(cardWidth/2-7),0,1.5);header.fill();}
   this.text('choice:name'+i,card.name,x,center+height/2-24,13,paper,cardWidth-8,true);
   this.icon('choice:icon'+i,card.skill,x,center+height*.16,Math.min(64,height*.24),true);
   const descriptionTop=height*.01,descriptionBottom=-height/2+(hasLuck?54:33);
   this.text('choice:description'+i,card.description,x,center+(descriptionTop+descriptionBottom)/2,cardWidth<110?12:13,ink,cardWidth-15,false,descriptionTop-descriptionBottom);
   if(hasLuck)this.text('choice:luck'+i,luck,x,center-height/2+41,cardWidth<110?11:13,overflow?'#a04424':card.luckAfter===21?'#735113':'#51406a',cardWidth-8,true,22);
   this.text('choice:key'+i,`${overflow?'溢出归1':card.kind==='learn'?'新技能':card.kind==='evolution'?'进化':'Lv.'+card.rank}  ${i+1}`,x,center-height/2+18,11,card.kind==='evolution'?'#9b581d':'#756d5b',cardWidth-8,true);
  });
  this.button('reroll',`刷新选项（${b.rerolls}）`,0,center-height/2-40,210,()=>b.reroll(),false,40,b.rerolls<=0);
  this.button('choice:pause','暂停',-w/2+32,this.bottom+21,60,()=>this.session.pause(),false,40);
 }
 private drawPanel(){
  const u=this.ui,a=this.session.armory,p=a.data,w=Math.min(720,u.width-20),top=this.top,bottom=this.bottom;
  const titles:Record<string,string>={gear:'战备装备',research:'技能研究',wall:'防线工程',merc:'佣兵营地',supply:'补给仓库',quests:'任务与成就',settings:'设置',skins:'时装',gems:'宝石工坊',codex:'战术图鉴'};
  u.panel('panel:shade',0,0,u.width,u.height,'#2c3a44f5');this.text('panel:title',titles[this.panel]??'',-w/2+90,top-9,22,paper,170,true);
  this.button('panel-close','返回',w/2-36,top-9,70,()=>{this.panel='';a.message='';});
  if(this.panel==='codex')[['skills','武器'],['evolutions','进化'],['enemies','敌人'],['outfits','时装']].forEach(([id,title],i)=>this.button('codex:'+id,title,(i-1.5)*w/4,top-49,w/4-8,()=>{this.codexTab=id;this.page=0;},this.codexTab===id,34));
  else this.text('panel:funds',`${p.coins} 金币   ${p.scrap} 零件   ${p.diamonds} 钻石`,0,top-49,13,orange,w);
  const rows:Row[]=[];
  if(this.panel==='gear'){
   rows.push({id:'weapon',title:`枪械火力  Lv.${p.weapon}`,detail:'每级提高基础火力 7%。',actions:[{id:'upgrade:weapon',label:`${100+p.weapon*65} 金币`,run:()=>{a.upgradeBase('weapon')}}]});
   for(const s of SLOTS){const g=p.gear[s];rows.push({id:s,title:`${SLOT_NAMES[s]}  Lv.${g.level} · ${GRADES[g.tier]}`,detail:`强化 ${70+g.level*35} 金币 / ${2+Math.floor(g.level/3)} 零件 · 宝石 ${g.gems.filter(Boolean).length}/5`,actions:[{id:'gear:'+s,label:g.level>=30?'已满级':'强化',disabled:g.level>=30,run:()=>{a.upgradeGear(s)}},{id:'ascend:'+s,label:g.tier>=5?'已满阶':g.level<(g.tier+1)*5?'需Lv.'+(g.tier+1)*5:'升阶',disabled:g.tier>=5||g.level<(g.tier+1)*5,run:()=>{a.upgradeGear(s,true)}}]});}
   rows.push({id:'gems',title:'宝石工坊',detail:'镶嵌、卸下与三合一。',actions:[{id:'gems',label:'打开',run:()=>this.open('gems')}]},{id:'skins',title:'专属时装',detail:'选择你的防线装扮。',actions:[{id:'skins',label:'打开',run:()=>this.open('skins')}]});
  }
  if(this.panel==='research')for(const s of SKILLS){const level=p.research[s.id]??0;rows.push({id:s.id,title:`${s.name}  Lv.${level}`,detail:`每级增伤 4% · ${100+level*80} 金币 / ${5+level*2} 零件`,tint:s.color,actions:[{id:'research:'+s.id,label:level>=10?'已满级':'研究',disabled:level>=10,run:()=>{a.research(s.id)}}]});}
  if(this.panel==='wall')rows.push({id:'wall',title:`防线加固  Lv.${p.wall}`,detail:`每级增加 120 耐久；现有 ${a.loadout().health}。`,actions:[{id:'upgrade:wall',label:`${100+p.wall*65} 金币`,run:()=>{a.upgradeBase('wall')}}]},{id:'armor',title:'防护与维修',detail:`装备宝石提供减伤与持续维修。当前减伤 ${Math.round(a.loadout().armor*100)}%。`,actions:[{id:'wall:gems',label:'宝石',run:()=>this.open('gems')}]});
  if(this.panel==='merc')for(const m of MERCENARIES)rows.push({id:m.id,title:`${m.name} ${p.mercs[m.id]?'Lv.'+p.mercs[m.id]:'未招募'}`,detail:m.description+' 每级提高效果 18%。',actions:[{id:'merc:upgrade:'+m.id,label:p.mercs[m.id]?'升级':m.cost+'币',run:()=>{a.mercenary(m.id)}},{id:'merc:deploy:'+m.id,label:p.team.includes(m.id)?'撤下':'出战',run:()=>{a.mercenary(m.id,true)}}]});
  if(this.panel==='skins')for(const s of SKINS){const ability=skinAbility(s.id);rows.push({id:s.id,title:s.name,detail:(ability?.name??'基础衣装')+' · '+(p.skin===s.id?'已装备':p.owned.includes(s.id)?'已拥有':s.price+'金币')+'\n效果详见图鉴 · 时装',tint:s.accent,skin:s.id,actions:[{id:'skin:'+s.id,label:p.skin===s.id?'已装备':p.owned.includes(s.id)?'换装':'解锁',disabled:p.skin===s.id,run:()=>{a.skin(s.id)}}]});}
  if(this.panel==='quests')for(const q of QUESTS){const value=(q.daily?p.daily:p.totals)[q.metric],claimed=(q.daily?p.claimed:p.achievements).includes(q.id);rows.push({id:q.id,title:(q.daily?'每日 · ':'成就 · ')+q.name,detail:`${Math.min(value,q.target)} / ${q.target} · 奖励 ${q.reward} 金币`,actions:[{id:'claim:'+q.id,label:claimed?'已领取':value<q.target?'未完成':'领取',disabled:claimed||value<q.target,run:()=>{a.claim(q.id)}}]});}
  if(this.panel==='supply')rows.push({id:'checkin',title:'每日签到',detail:'金币、零件与钻石，连续签到增加金币。',actions:[{id:'checkin',label:p.checkin>=a.currentDay()?'已签到':'签到',disabled:p.checkin>=a.currentDay(),run:()=>{a.checkin()}}]},{id:'free-chest',title:'每日补给',detail:'免费领取一颗宝石和 8 零件。',actions:[{id:'chest:free',label:p.freeChest>=a.currentDay()?'已领取':'领取',disabled:p.freeChest>=a.currentDay(),run:()=>{a.chest(true)}}]},{id:'chest',title:'装备补给箱',detail:'300 金币 · 普通 65%、精良 27%、稀有 8%。',actions:[{id:'chest:buy',label:'开启',run:()=>{a.chest()}}]},{id:'premium',title:'精密补给箱',detail:'40 钻石 · 稀有 90%、史诗 10%，附送 16 零件。',actions:[{id:'chest:premium',label:'开启',run:()=>{a.chest(false,true)}}]},{id:'gems',title:`宝石仓库 · ${p.gems.length} 颗`,detail:'装备同类同阶宝石，或将三颗合成高一阶。',actions:[{id:'supply:gems',label:'打开',run:()=>this.open('gems')}]});
  if(this.panel==='gems'){
   rows.push({id:'target',title:`镶嵌位置：${SLOT_NAMES[this.gemSlot]} · 槽 ${this.socket+1}`,detail:'每件装备有五个宝石槽；重复装备会移至新位置。',actions:[{id:'gem:slot',label:'换装备',run:()=>{this.gemSlot=SLOTS[(SLOTS.indexOf(this.gemSlot)+1)%SLOTS.length]}},{id:'gem:socket',label:'换槽位',run:()=>{this.socket=(this.socket+1)%5}}]});
   rows.push({id:'unequip',title:'当前宝石',detail:p.gear[this.gemSlot].gems[this.socket]?'已镶嵌，可免费卸下。':'这个槽位尚未镶嵌。',actions:[{id:'gem:unequip',label:'卸下',run:()=>{a.equip(this.gemSlot,this.socket,null)}}]});
   for(const gem of p.gems){const type=GEM_TYPES.find(t=>t.id===gem.type)!;rows.push({id:'gem'+gem.id,title:GRADES[gem.grade]+type.name,detail:SLOTS.some(s=>p.gear[s].gems.includes(gem.id))?'已镶嵌':'未镶嵌，可装备或三合一。',tint:type.color,actions:[{id:'gem:equip:'+gem.id,label:'镶嵌',run:()=>{a.equip(this.gemSlot,this.socket,gem.id)}},{id:'gem:merge:'+gem.id,label:'合成',run:()=>{a.merge(gem.id)}}]});}
  }
  if(this.panel==='codex'){
   if(this.codexTab==='skills'){
    for(const s of SKILLS)rows.push({id:s.id,title:s.name,detail:s.description,tint:s.color});
    rows.push({id:'orb-luck',title:'弹球幸运值',detail:'卡牌显示本次幸运增减与选择后的点数。10点起出现高维词条，21点开启终极词条；超过21变为1，扣减最低到0。',tint:skillById.orb.color});
    rows.push({id:'orb-lucky',title:'幸运弹球',detail:'多维弹球每施放6次触发，额外连发和裂变不计数。准备后穿透敌人、撞墙反弹，飞行5秒；普通弹球强化不会全部传递给它。',tint:skillById.orb.color});
    rows.push({id:'orb-quality',title:'幸运弹球品质',detail:'辉银、耀紫、鎏金的基础权重为100:50:10。耀紫命中可衍生穿透光球，鎏金再追加爆炸；同一弹球的衍生效果间隔3秒。',tint:LUCKY_ORB.qualities[2].color});
   }
   if(this.codexTab==='evolutions')for(const u of UPGRADES.filter(u=>u.evolution))rows.push({id:u.id,title:'进化 · '+u.name,detail:u.luck?`需要多维弹球幸运值 ${u.luck.min} 点。${describeUpgrade(u)}`:'需要 '+u.requires.map(([id,rank])=>(upgradeById[id]?.name??skillById[id as SkillId]?.name??id)+' '+rank+'级').join(' + '),tint:skillById[u.skill].color});
   if(this.codexTab==='outfits'){
    for(const s of SKINS){const ability=skinAbility(s.id);rows.push({id:s.id,title:s.name+(ability?' · '+ability.name:''),detail:ability?.description??'基础衣装，无额外技能。其他衣装可在装备 → 专属时装中解锁。',tint:s.accent});}
    rows.push({id:'outfit-rules',title:'命中与充能',detail:'仅自身对应武器的直接命中计数；佣兵、持续伤害和时装追加攻击不充能。每局重新计数。'});
   }
   if(this.codexTab==='enemies'){
    rows.push({id:'endless-rule',title:'无尽狂潮',detail:'每八波更换地图。敌人持续强化；存活45秒后狂暴，挣脱控制并加速。',tint:orange});
    for(const e of ENEMIES)rows.push({id:e.id,title:e.name+(e.boss?' · 首领':''),detail:e.description+(e.boss?' 存活25秒后狂暴，挣脱控制并加速。':''),tint:e.color});
   }
  }
  if(this.panel==='settings')for(const [key,label]of [['sound','战斗音效'],['music','背景音乐'],['motion','画面动态'],['quality','画面品质'],['volume','总音量']] as const)rows.push({id:key,title:label,detail:key==='motion'?'关闭后减少装饰运动与镜头冲击。':key==='quality'?'流畅模式减少装饰特效。':'音量设置保存在本机。',actions:[{id:'setting:'+key,label:key==='volume'?Math.round(p.settings.volume*100)+'%':key==='quality'?p.settings.quality==='high'?'精细':'流畅':p.settings[key]?'开启':'关闭',run:()=>{a.setting(key)}}]});
  const perPage=Math.max(2,Math.floor((top-bottom-155)/86)),pages=Math.max(1,Math.ceil(rows.length/perPage));this.page=Math.min(this.page,pages-1);
  rows.slice(this.page*perPage,(this.page+1)*perPage).forEach((row,i)=>{
   const y=top-112-i*86,actions=row.actions??[],actionW=actions.length>1?61:90,iconSpace=row.skin?57:0,textW=w-(actions.length>1?144:actions.length?106:24)-iconSpace,textX=-w/2+12+iconSpace+textW/2;
   u.panel('row:'+i,0,y,w,77,'#3b4b55');this.text('row:title'+i,row.title,textX,y+18,15,row.tint??paper,textW,true);this.text('row:detail'+i,row.detail,textX,y-14,12,'#bbc9c7',textW,false,actions.length?33:43);
   if(row.skin){u.panel('skin:preview'+i,-w/2+35,y,58,75,'#00000000');const g=u.objects.get('panel:skin:preview'+i)!.getComponent(Graphics)!;g.clear();drawSoldier(g,row.skin,0,-2,.8);}
   actions.forEach((action,n)=>this.button(action.id,action.label,w/2-8-actionW/2-(actions.length-1-n)*(actionW+5),y,actionW,action.run,false,42,action.disabled));
  });
  this.text('panel:message',a.message,0,bottom+61,12,orange,w);
  this.button('page-prev','上一页',-w/2+45,bottom+18,88,()=>{this.page=(this.page-1+pages)%pages},false,38);
  this.text('page-count',`${this.page+1} / ${pages}`,0,bottom+18,14,paper,90);
  this.button('page-next','下一页',w/2-45,bottom+18,88,()=>{this.page=(this.page+1)%pages},false,38);
 }
}
