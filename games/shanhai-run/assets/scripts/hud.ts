import {Color,Graphics,Label,LabelOutline,UITransform} from 'cc';
import {GameView} from 'db://assets/collection/runtime';
import {AREAS,TRIALS,Run,type Action,type Mode} from './core';
import {ARTIFACTS,Journey,LORE,QUESTS,SKINS,dateKey} from './profile';
export type Panel=''|'trials'|'skins'|'artifacts'|'quests'|'lore'|'settings';
export interface Commands {start:(mode:Mode,trial?:number)=>void;action:(action:Action)=>void;pause:()=>void;resume:()=>void;home:()=>void;rescue:()=>void;}
const ink='#153d3b',paper='#f3e6c6',gold='#e9bc64',soft='#b9d1c5';

/** Canvas UI and Web semantic controls share the same visible bounds and actions. */
export class ShanhaiUI {
  panel:Panel='';page=0;notice='';trainingHint='';
  private ui:GameView;
  private journey!:Journey;
  private run!:Run;
  constructor(ui:GameView,private readonly commands:Commands){this.ui=ui;}
  get previewSkin(){return SKINS[this.page%SKINS.length];}
  open(panel:Panel){this.commands.pause();this.panel=panel;this.page=0;}
  close(){this.panel='';this.page=0;}
  private text(id:string,text:string,x:number,y:number,size=14,width=300,hex=paper,title=false,align=Label.HorizontalAlign.CENTER,height=size*1.8){
    const label=this.ui.text(id,text,x,y,size,hex,width);label.fontFamily=title?'Noto Serif CJK SC':'Noto Sans CJK SC';label.isBold=title;label.horizontalAlign=align;
    if(['area','power','trial-goal','daily-label','notice','swipe-hint','dying','desktop-story','desktop-guide','message','endless-reward'].includes(id)){
      label.color=new Color().fromHEX(paper);const outline=label.node.getComponent(LabelOutline)??label.node.addComponent(LabelOutline);outline.color=new Color().fromHEX(ink);outline.width=1.5;
    }
    label.node.getComponent(UITransform)!.setContentSize(width,height);return label;
  }
  private frame(id:string,x:number,y:number,w:number,h:number,fill=ink,border='#728b6855'){
    const u=this.ui;u.panel(id,x,y,w,h,fill);const g=u.objects.get('panel:'+id)!.getComponent(Graphics)!;
    g.clear();g.fillColor=new Color().fromHEX(fill);g.strokeColor=new Color().fromHEX(border);g.lineWidth=1;
    const cut=6;g.moveTo(-w/2+cut,-h/2);g.lineTo(w/2-cut,-h/2);g.lineTo(w/2,-h/2+cut);g.lineTo(w/2,h/2-cut);g.lineTo(w/2-cut,h/2);g.lineTo(-w/2+cut,h/2);g.lineTo(-w/2,h/2-cut);g.lineTo(-w/2,-h/2+cut);g.close();g.fill();g.stroke();
  }
  private button(id:string,text:string,x:number,y:number,w:number,action:()=>void,primary=false,h=44,muted=false){
    const node=this.ui.button(id,text,x,y,w,action,primary,h),g=node.getComponent(Graphics)!,b=this.ui.buttons.get(id)!;
    g.clear();g.fillColor=new Color().fromHEX(primary?gold:muted?'#36544cdd':'#17423fed');g.strokeColor=new Color().fromHEX(primary?'#ffe2a6':'#8bba9d80');g.lineWidth=1;
    const cut=5;g.moveTo(-w/2+cut,-h/2);g.lineTo(w/2-cut,-h/2);g.lineTo(w/2,-h/2+cut);g.lineTo(w/2,h/2-cut);g.lineTo(w/2-cut,h/2);g.lineTo(-w/2+cut,h/2);g.lineTo(-w/2,h/2-cut);g.lineTo(-w/2,-h/2+cut);g.close();g.fill();g.stroke();
    g.strokeColor=new Color().fromHEX(primary?'#c48b42':'#73ad9340');g.moveTo(-w/2+9,-h/2+3);g.lineTo(w/2-9,-h/2+3);g.stroke();
    if(primary&&w>240){g.fillColor=new Color().fromHEX(ink);g.moveTo(w/2-25,-5);g.lineTo(w/2-18,0);g.lineTo(w/2-25,5);g.close();g.fill();}
    b.label.fontFamily='Noto Sans CJK SC';b.label.fontSize=primary?17:w<100?12:14;b.label.color=new Color().fromHEX(primary?ink:muted?'#9bafa0':paper);b.label.isBold=primary;
    return node;
  }
  draw(run:Run,journey:Journey){
    this.run=run;this.journey=journey;
    if(this.panel==='skins'){this.wardrobe();return;}
    if(this.panel){this.sheet();return;}
    if(run.phase==='ready')this.menu();
    else if(run.phase==='paused')this.pause();
    else if(run.phase==='won'||run.phase==='dead')this.result();
    else this.hud();
  }
  private get top(){return this.ui.height/2-Math.max(this.ui.insets.top,this.ui.insets.menuBottom);}
  private get bottom(){return -this.ui.height/2+this.ui.insets.bottom;}
  private menu(){
    const u=this.ui,p=this.journey.data,wide=u.width>900,short=u.height<500,x=wide?-u.width*.28:short?-u.width*.28:0,w=Math.min(short?250:330,u.width-36);
    const cap=Math.min(156,(u.width-36)/2);
    this.button('wallet',`◆ ${p.coins} 灵玉`,u.width/2-12-cap/2,this.top-30,cap,()=>this.open('quests'),false,38);
    if(!short)this.button('checkin',p.lastCheckin>=dateKey()?'今日已签到':'领取每日灵玉',-u.width/2+12+cap/2,this.top-30,cap,()=>this.journey.checkin(),false,38);
    else this.button('checkin',p.lastCheckin>=dateKey()?'今日已签到':'领取每日灵玉',u.width*.29,this.top-89,168,()=>this.journey.checkin(),false,40);
    const titleY=short?this.top-83:wide?this.top-175:this.top-125;
    const title=this.text('game-title','山海逃亡',x,titleY,short?39:wide?62:46,w+30,'#f3e4bc',true,Label.HorizontalAlign.CENTER,80);
    const outline=title.node.getComponent(LabelOutline)??title.node.addComponent(LabelOutline);outline.color=new Color().fromHEX(ink);outline.width=2;
    const tagline=this.text('tagline','携照夜玉，踏失落古道。',x,titleY-(short?43:wide?57:48),13,w,'#f3e4bc');
    const shadow=tagline.node.getComponent(LabelOutline)??tagline.node.addComponent(LabelOutline);shadow.color=new Color().fromHEX(ink);shadow.width=1;
    const base=short?this.bottom+162:this.bottom+193;
    this.frame('menu-deck',x,base-(short?55:70),w+24,short?170:230,'#153d3b77','#d9bd7733');
    this.text('endless-reward','无尽古道 · 拾玉双倍',x,base+(short?35:40),12,w,paper);
    this.button('start','开始逃亡',x,base,w,()=>this.commands.start('endless'),true,short?46:54);
    const pair=(w-10)/2;
    this.button('trials','山海试炼',x-(pair+10)/2,base-58,pair,()=>this.open('trials'));
    this.button('wardrobe','行装法宝',x+(pair+10)/2,base-58,pair,()=>this.open('skins'));
    const third=(w-16)/3;
    [['daily','每日挑战',()=>this.commands.start('daily')],['lore','山海录',()=>this.open('lore')],['settings','设置',()=>this.open('settings')]].forEach(([id,label,action],i)=>this.button(String(id),String(label),x+(i-1)*(third+8),base-108,third,action as()=>void,false,40));
    if(!short)this.button('training',p.tutorial?'重温身法练习':'初入山海 · 操作练习',x,base-157,w,()=>this.commands.start('training'),false,38);
    else this.button('training','身法练习',u.width*.29,this.bottom+35,168,()=>this.commands.start('training'),false,40);
    if(wide){
      this.text('desktop-story','古卷散落，山门重开。\n守山兽已醒，回头不是归途。',u.width*.31,-u.height*.18,16,270,'#345c4f',false,Label.HorizontalAlign.LEFT,60);
      this.text('desktop-guide','方向键 / WASD 移动\n上 / 空格跳跃，下滑铲\n路口左右转弯，F 御风',u.width*.31,-u.height*.31,13,270,'#426c5d',false,Label.HorizontalAlign.LEFT,84);
    }
    if(this.journey.message)this.text('message',this.journey.message,wide?x:0,short?this.top-22:this.top-207,13,Math.min(u.width-24,520),'#345b4d');
  }
  private hud(){
    const u=this.ui,s=this.run,short=u.height<500,top=this.top,bottom=this.bottom;
    const distanceWidth=Math.min(148,u.width*.38),distanceX=-u.width/2+12+distanceWidth/2,jadeWidth=Math.min(104,u.width*.29),jadeX=u.width/2-78-jadeWidth/2;
    this.frame('distance-bg',distanceX,top-38,distanceWidth,54,'#183e39de');
    this.text('distance',`${Math.floor(s.distance)} 米`,distanceX,top-36,24,distanceWidth-8,paper,true);
    this.frame('jade-bg',jadeX,top-36,jadeWidth,46,'#183e39de');this.text('jade',`◆ ${s.stats.coins}`,jadeX,top-36,18,jadeWidth-8,gold,true);
    this.button('pause','Ⅱ',u.width/2-43,top-36,48,()=>this.commands.pause(),false,46);
    if(!short)this.text('area',AREAS[s.area].name,0,top-82,13,250,ink);
    const danger=s.pressure>.62;
    this.frame('chase-bg',0,bottom+(short?87:112),Math.min(u.width-40,300),27,danger?'#8b4637d9':'#183e39bb');
    this.text('chase',danger?'狍鸮逼近 · 小心下一次失误':'守山兽追逐中',0,bottom+(short?87:112),12,Math.min(u.width-48,280),danger?'#ffe2b7':'#d1dfca');
    const bar=Math.min(u.width-56,280),fill=bar*Math.min(1,s.pressure);
    this.frame('chase-track',0,bottom+(short?68:93),bar,4,'#183e3966');if(fill>0)this.frame('chase-fill',-bar/2+fill/2,bottom+(short?68:93),fill,4,danger?'#dd8867':gold,'#00000000');
    if(s.canTurn&&s.phase==='running'){
      const label=s.queuedTurn?'方向已确认':s.turnDirection<0?'← 向左转弯':'向右转弯 →';
      this.frame('turn-panel',0,u.height*.10,Math.min(u.width-30,320),64,s.queuedTurn?'#315e55ed':'#a85b39ef','#e8c87c');
      this.text('turn',label,0,u.height*.10+8,23,Math.min(u.width-42,300),paper,true);
      this.text('turn-distance',`路口还有 ${Math.max(0,Math.ceil(s.cornerDistance))} 米`,0,u.height*.10-19,11,260,paper);
    }
    if(this.journey.data.settings.helpers&&s.phase==='running'){
      const width=Math.min((u.width-50)/4,68);
      (['left','jump','slide','right'] as const).forEach((action,i)=>this.button(action,['←','跳跃','滑铲','→'][i],(i-1.5)*(width+8),bottom+35,width,()=>this.commands.action(action),false,44));
    }else if(s.phase==='running')this.text('swipe-hint','上滑跳跃　下滑滑铲　左右转向 / 变道',0,bottom+30,12,Math.min(u.width-30,400),ink);
    if(s.spirit>=100&&s.wind<=0&&s.phase==='running')this.button('wind','御风 F',u.width/2-51,bottom+(short?143:174),82,()=>this.commands.action('wind'),true,42);
    if(s.spirit<100&&s.wind<=0&&!short){this.frame('spirit-bg',0,bottom+156,152,28,'#153d3bcc');this.text('spirit',`御风蓄能  ${Math.floor(s.spirit)}%`,0,bottom+156,12,144,gold);}
    const power=s.wind>0?`乘风翎 ${s.wind.toFixed(1)}s`:s.magnet>0?`引玉铃 ${s.magnet.toFixed(1)}s`:s.shield>0?`玄龟符 ${s.shield.toFixed(1)}s`:'';
    if(power)this.text('power',power,0,top-(short?(s.mode==='trial'||s.mode==='daily'?108:78):112),15,280,ink,true);
    if(s.mode==='trial')this.text('trial-goal',`${TRIALS[s.trial].name}  ${Math.min(100,Math.floor(s.distance/s.goal*100))}%`,0,top-(short?81:133),12,290,ink);
    if(s.mode==='daily')this.text('daily-label',`今日同途 · 今日最佳 ${this.journey.data.dailyBest} 分`,0,top-(short?81:133),12,290,ink);
    if(this.notice&&!this.trainingHint)this.text('notice',this.notice,0,top-(short?112:164),14,Math.min(u.width-30,440),ink,true);
    if(this.trainingHint){this.frame('training-guide',0,u.height*.14,Math.min(u.width-28,370),106,'#183e39ed',gold);this.text('training-title','初入山海 · 身法练习',0,u.height*.14+27,14,330,gold);this.text('training-copy',this.trainingHint,0,u.height*.14-10,20,Math.min(u.width-52,330),paper,true,Label.HorizontalAlign.CENTER,55);}
    if(s.phase==='dying')this.text('dying',s.deathReason,0,uiCentre(u),21,Math.min(u.width-30,440),'#8a3929',true);
  }
  private pause(){
    const u=this.ui,short=u.height<500,h=short?300:420,w=Math.min(u.width-36,380),cy=(u.insets.bottom-Math.max(u.insets.top,u.insets.menuBottom))/2;
    this.frame('pause',0,cy,w,h,'#183e39f5',gold);this.text('pause-title','山风暂歇',0,cy+h/2-42,29,w-24,paper,true);
    this.text('pause-copy',`${Math.floor(this.run.distance)} 米 · ${this.run.stats.coins} 灵玉`,0,cy+h/2-81,13,w-30,soft);
    const choices:[string,string,()=>void][]=[['resume','继续逃亡',()=>this.commands.resume()],['pause-settings','画面与声音',()=>this.open('settings')],['retry','重新出发',()=>this.commands.start(this.run.mode,this.run.trial)],['home','返回山门',()=>this.commands.home()]];
    choices.forEach(([id,label,action],i)=>this.button(id,label,0,cy+h/2-126-i*(short?46:61),w-48,action,i===0,short?40:46));
  }
  private result(){
    const u=this.ui,s=this.run,p=this.journey.data,short=u.height<500,h=Math.min(short?340:590,u.height-36-Math.max(u.insets.top,u.insets.menuBottom)-u.insets.bottom),w=Math.min(u.width-28,420),cy=(u.insets.bottom-Math.max(u.insets.top,u.insets.menuBottom))/2,top=cy+h/2,win=s.phase==='won';
    this.frame('result',0,cy,w,h,'#183e39f7',gold);
    this.text('result-title',win?s.mode==='training'?'身法已成':'山海图已寻回':'此行暂歇',0,top-40,short?24:30,w-24,paper,true);
    this.text('result-copy',this.journey.message.includes('本机存储')?this.journey.message:win?s.mode==='training'?'四种操作已经掌握，出发吧。':TRIALS[s.trial].name:s.deathReason,0,top-(short?76:83),13,w-30,soft);
    this.text('result-score',`${Math.floor(s.distance)} 米`,0,top-(short?115:143),short?30:44,w-24,gold,true);
    this.text('result-metrics',`得分 ${s.score}   拾玉 ${s.stats.coins}   最高 ${p.bestDistance} 米`,0,top-(short?151:195),12,w-30,paper);
    if(!short)this.text('result-detail',`成功转弯 ${s.stats.turns} 次　避障 ${s.stats.dodges} 次\n${this.journey.message.includes('本机存储')?'本次进度尚未保存。':'本次灵玉与任务进度已保存。'}`,0,top-243,13,w-30,soft,false,Label.HorizontalAlign.CENTER,50);
    const actions:[string,string,()=>void,boolean][]=[];
    if(win)actions.push(['next',s.mode==='training'?'踏入无尽山海':s.trial<7?'前往下一试炼':'开始无尽逃亡',()=>this.commands.start(s.mode==='trial'&&s.trial<7?'trial':'endless',s.trial+1),true]);
    else if(!s.revived&&!['daily','training'].includes(s.mode))actions.push(['rescue',p.coins>=150?'还魂续跑 · 150 灵玉':'还魂需 150 灵玉',()=>this.commands.rescue(),p.coins>=150]);
    if(actions.length<2)actions.push(['retry','再跑一次',()=>this.commands.start(s.mode,s.trial),!win]);
    actions.push(['home','返回山门',()=>this.commands.home(),false]);
    const first=short?top-192:top-322;
    actions.forEach(([id,label,action,primary],i)=>this.button(id,label,0,first-i*(short?44:57),w-44,action,primary,short?38:46));
    if(this.journey.message&&!short)this.text('result-message',this.journey.message,0,cy-h/2+23,11,w-30,soft);
  }
  private sheet(){
    const u=this.ui,p=this.journey.data,topInset=Math.max(u.insets.top,u.insets.menuBottom),h=Math.min(704,u.height-topInset-u.insets.bottom-24),w=Math.min(740,u.width-24),cy=(u.insets.bottom-topInset)/2,top=cy+h/2,bottom=cy-h/2;
    this.frame('sheet',0,cy,w,h,'#183e39f5',gold);
    const names:Record<Exclude<Panel,''>,string>={trials:'山海试炼',skins:'行者衣装',artifacts:'法宝修习',quests:'山海行记',lore:'山海异兽录',settings:'画面与声音'};
    this.text('sheet-title',names[this.panel as Exclude<Panel,''>],-w/2+100,top-32,23,176,paper,true);
    this.button('panel-close','返回',w/2-48,top-32,68,()=>this.close(),false,38);
    this.text('balance',`◆ ${p.coins} 灵玉`,0,top-67,13,w-32,gold);
    const tabs:[Panel,string][]=[['trials','试炼'],['skins','衣装'],['artifacts','法宝'],['quests','任务'],['lore','图鉴']];
    const tabWidth=(w-32)/5;tabs.forEach(([id,label],i)=>this.button('tab:'+id,label,(i-2)*tabWidth,top-104,tabWidth-4,()=>{this.panel=id;this.page=0;},this.panel===id,40));
    const start=top-148,end=bottom+79,rows=Math.max(1,Math.floor((start-end)/91)),columns=w>590&&this.panel==='trials'?2:1;
    let list:readonly unknown[]=this.panel==='trials'?TRIALS:this.panel==='skins'?SKINS:this.panel==='artifacts'?ARTIFACTS:this.panel==='quests'?QUESTS:this.panel==='lore'?LORE:['sound','music','quality','motion','helpers'];
    const count=this.panel==='lore'?1:rows*columns,pages=Math.max(1,Math.ceil(list.length/count));this.page=Math.min(this.page,pages-1);
    if(this.panel==='lore'){
      const lore=LORE[this.page],unlocked=p.lore.includes(this.page),bodyHeight=Math.max(75,start-end-90);
      this.text('lore-name',lore.name,0,start-20,32,w-36,gold,true);this.text('lore-region',`${lore.region}  ${lore.source}`,0,start-57,13,w-36,soft);
      this.text('lore-copy',unlocked?lore.text:'这片山海图尚未寻回。\n完成对应区域的试炼，或在该区域拾取古卷，解锁异兽故事。',0,start-87-bodyHeight/2,Math.min(17,w/24),w-54,paper,false,Label.HorizontalAlign.LEFT,bodyHeight);
    }else list.slice(this.page*count,(this.page+1)*count).forEach((_,index)=>{
      const real=this.page*count+index,col=index%columns,row=Math.floor(index/columns),rowWidth=(w-36-(columns-1)*12)/columns,x=-w/2+18+rowWidth/2+col*(rowWidth+12),y=start-35-row*91;
      this.frame('row'+index,x,y,rowWidth,80,'#285249c9','#89a78555');const left=x-rowWidth/2+14,buttonX=x+rowWidth/2-53,textWidth=rowWidth-122;
      if(this.panel==='trials'){
        const trial=TRIALS[real],unlocked=real<p.unlocked;
        this.text('row-title'+index,`${String(real+1).padStart(2,'0')} ${trial.name}`,left+textWidth/2,y+14,15,textWidth,paper,true,Label.HorizontalAlign.LEFT);
        this.text('row-sub'+index,`${AREAS[trial.area].short} · ${trial.distance}米  ${'★'.repeat(p.stars[real])}`,left+textWidth/2,y-13,11,textWidth,soft,false,Label.HorizontalAlign.LEFT);
        this.button('trial:'+real,unlocked?'出发':'未解锁',buttonX,y,88,()=>{if(unlocked)this.commands.start('trial',real);else this.journey.message='先完成前一段试炼。';},unlocked,44,!unlocked);
      }else if(this.panel==='skins'){
        const skin=SKINS[real],owned=p.owned.includes(skin.id);
        this.text('row-title'+index,skin.name,left+textWidth/2,y+15,15,textWidth,skin.accent,true,Label.HorizontalAlign.LEFT);
        this.text('row-sub'+index,skin.detail,left+textWidth/2,y-15,11,textWidth,soft,false,Label.HorizontalAlign.LEFT,32);
        this.button('skin:'+skin.id,p.skin===skin.id?'已穿戴':owned?'换上':`${skin.price} 灵玉`,buttonX,y,88,()=>this.journey.buySkin(skin.id),p.skin===skin.id,44);
      }else if(this.panel==='artifacts'){
        const artifact=ARTIFACTS[real],level=p.upgrades[artifact.id];
        this.text('row-title'+index,`${artifact.name} ${level}/5`,left+textWidth/2,y+15,15,textWidth,paper,true,Label.HorizontalAlign.LEFT);
        this.text('row-sub'+index,artifact.description,left+textWidth/2,y-16,11,textWidth,soft,false,Label.HorizontalAlign.LEFT,34);
        this.button('upgrade:'+artifact.id,level===5?'已满级':`${100+level*125} 灵玉`,buttonX,y,88,()=>this.journey.upgrade(artifact.id),false,44,level===5);
      }else if(this.panel==='quests'){
        const q=QUESTS[real],value=(q.daily?p.daily:p.totals)[q.metric],claimed=(q.daily?p.claimed:p.achievements).includes(q.id),ready=value>=q.target;
        this.text('row-title'+index,`${q.daily?'每日':'成就'} · ${q.name}`,left+textWidth/2,y+16,14,textWidth,paper,true,Label.HorizontalAlign.LEFT);
        this.text('row-sub'+index,`${Math.min(value,q.target)}/${q.target}  奖 ${q.reward} 灵玉`,left+textWidth/2,y-14,11,textWidth,soft,false,Label.HorizontalAlign.LEFT);
        this.button('claim:'+q.id,claimed?'已领取':ready?'领取':'进行中',buttonX,y,88,()=>this.journey.claim(q.id),ready&&!claimed,44,claimed||!ready);
      }else{
        const id=list[real] as keyof typeof p.settings,labels={sound:'动作音效',music:'山海乐声',quality:'画面品质',motion:'画面动态',helpers:'触摸辅助按键'};
        this.text('row-title'+index,labels[id],left+textWidth/2,y,15,textWidth,paper,true,Label.HorizontalAlign.LEFT);
        const value=p.settings[id];this.button('setting:'+id,id==='quality'?value==='high'?'精细':'流畅':value?'开启':'关闭',buttonX,y,88,()=>id==='quality'?this.journey.setting(id,value==='high'?'low':'high'):this.journey.setting(id,!value),false,44);
      }
    });
    const pageY=bottom+44;
    this.button('page-prev','上一页',-w/2+64,pageY,92,()=>this.page=Math.max(0,this.page-1),false,38,this.page===0);
    this.text('pagination',`${this.page+1} / ${pages}`,0,pageY,13,90,soft);
    this.button('page-next','下一页',w/2-64,pageY,92,()=>this.page=Math.min(pages-1,this.page+1),false,38,this.page===pages-1);
    this.text('sheet-message',this.journey.message||'灵玉来自跑酷、试炼、任务与签到。',0,bottom+12,10,w-28,soft);
  }
  private wardrobe(){
    const u=this.ui,p=this.journey.data,short=u.height<500,top=this.top,bottom=this.bottom,w=Math.min(740,u.width-24),skin=this.previewSkin,owned=p.owned.includes(skin.id),equipped=p.skin===skin.id;
    this.frame('wardrobe-header',0,top-52,w,102,'#153d3bf2','#e9bc6477');
    this.text('wardrobe-title','行者衣装',-w/2+70,top-27,22,130,paper,true);
    this.text('wardrobe-wallet',`◆ ${p.coins}`,w/2-121,top-27,13,76,gold);
    this.button('panel-close','返回',w/2-43,top-27,68,()=>this.close(),false,44);
    const tabs:[Panel,string][]=[['trials','试炼'],['skins','衣装'],['artifacts','法宝'],['quests','任务'],['lore','图鉴']],tw=(w-24)/5;
    tabs.forEach(([id,label],i)=>this.button('tab:'+id,label,(i-2)*tw,top-76,tw-4,()=>{this.panel=id;this.page=0;},id==='skins',40));
    const cardW=short?270:Math.min(400,u.width-28),cx=short?u.width*.29:0,cy=bottom+112;
    this.frame('wardrobe-card',cx,cy,cardW,200,'#153d3be9','#e9bc6477');
    this.text('wardrobe-name',skin.name,cx,cy+71,24,cardW-26,skin.accent,true);
    this.text('wardrobe-copy',skin.detail,cx,cy+36,13,cardW-32,soft,false,Label.HorizontalAlign.CENTER,38);
    this.button('skin:'+skin.id,equipped?'已穿戴':owned?'换上衣装':`解锁衣装 · ${skin.price} 灵玉`,cx,cy-12,cardW-36,()=>this.journey.buySkin(skin.id),true,46);
    this.button('page-prev','上一套',cx-cardW/2+57,cy-66,88,()=>this.page=(this.page+SKINS.length-1)%SKINS.length,false,44);
    this.text('wardrobe-page',`${this.page+1} / ${SKINS.length}`,cx,cy-66,13,64,soft);
    this.button('page-next','下一套',cx+cardW/2-57,cy-66,88,()=>this.page=(this.page+1)%SKINS.length,false,44);
    if(!short)this.text('wardrobe-preview',equipped?'当前衣装':owned?'已拥有 · 可免费更换':'自由试穿 · 解锁后永久拥有',0,top-126,13,w-24,paper);
    if(this.journey.message)this.text('wardrobe-message',this.journey.message,short?-u.width*.25:0,short?bottom+30:bottom+229,12,short?250:u.width-28,paper);
  }
}
const uiCentre=(ui:GameView)=>ui.height*.08;
