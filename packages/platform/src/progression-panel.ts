import {Career,SKINS,TASKS,UPGRADES,calendarDay,type Upgrade} from './progression';
export interface Destination {id?:string;name:string;description:string;color?:string;unlocked?:boolean}
export interface CareerButton {id:string;label:string;x:number;y:number;w:number;h:number;disabled?:boolean}
export interface CareerPainter {panel(id:string,x:number,y:number,w:number,h:number,color:string):void;text(id:string,text:string,x:number,y:number,size:number,color:string):void;button(button:CareerButton):void}
export class CareerPanel {
  active=false;tab='maps';page=0;guardDescription='每级增加 2 名初始队员';
  constructor(public career:Career,public maps:()=>Destination[],public start:(map:number,endless:boolean)=>void,public title='远征基地'){}
  open(){this.active=true;this.page=0;}
  action(id:string){
    if(!id.startsWith('career:'))return false;
    const [,name,arg]=id.split(':');
    if(name==='open')this.open();else if(name==='close')this.active=false;
    else if(name==='tab'){this.tab=arg;this.page=0;}
    else if(name==='page')this.page=Math.max(0,this.page+Number(arg));
    else if(name==='checkin')this.career.checkIn();else if(name==='claim')this.career.claim(arg);
    else if(name==='skin')this.career.buySkin(arg);else if(name==='upgrade')this.career.upgrade(arg as Upgrade);
    else if(name==='start'&&this.maps()[Number(arg)]?.unlocked!==false){this.active=false;this.start(Number(arg),false);}
    else if(name==='endless'){this.active=false;this.start(0,true);}
    return true;
  }
  draw(p:CareerPainter,width:number,height:number,light=false,safeTop=0,safeBottom=0){
    const ink=light?'#173f33':'#edf7ff',muted=light?'#5c7163':'#b0c9da',bg=light?'#e8efd8':'#102538',card=light?'#fff7df':'#1c3b50',gold=light?'#856012':'#ffdb80';
    const w=Math.min(620,width-24),x=(width-w)/2,top=safeTop+12,bottom=height-safeBottom-12;
    p.panel('career-bg',0,0,width,height,bg);
    p.text('career-title',this.title,x,top+14,23,ink);
    p.text('career-coins',`${this.career.data.coins} 金币`,x,top+44,15,gold);
    p.button({id:'career:close',label:'返回',x:x+w-66,y:top,w:66,h:40});
    ['maps','tasks','skins','weapons'].forEach((tab,i)=>p.button({id:'career:tab:'+tab,label:(tab===this.tab?'● ':'')+['地图','任务','皮肤','强化'][i],x:x+i*w/4,y:top+65,w:w/4-5,h:38}));
    const start=top+116,footer=bottom-94,count=Math.max(1,Math.min(4,Math.floor((footer-start)/72))),rowH=Math.min(87,(footer-start)/count);
    const d=this.career.data;
    let rows:{title:string;sub:string;id:string;label:string;color?:string;disabled?:boolean}[]=[];
    if(this.tab==='maps')rows=this.maps().map((m,i)=>({title:`${i+1}. ${m.name}`,sub:m.description,id:'career:start:'+i,label:m.unlocked===false?'待解锁':d.clears.includes(m.id??String(i))?'再挑战':'出发',color:m.color,disabled:m.unlocked===false}));
    if(this.tab==='tasks')rows=TASKS.map(t=>{const claimed=(t.daily?calendarDay()===d.day?d.claimed:[]:d.achievements).includes(t.id),progress=Math.min(t.goal,this.career.taskProgress(t.id));return {title:(t.daily?'每日 · ':'成就 · ')+t.name,sub:`${progress}/${t.goal}　奖励 ${t.coins} 金币`,id:'career:claim:'+t.id,label:claimed?'已领取':progress<t.goal?'进行中':'领取',disabled:claimed||progress<t.goal};});
    if(this.tab==='skins')rows=SKINS.map(s=>({title:s.mark+' '+s.name,sub:s.id==='classic'?'原色装备 · 不改变战斗数值':`专属配色与战斗徽记 · ${s.cost} 金币`,id:'career:skin:'+s.id,label:d.skin===s.id?'已装备':d.owned.includes(s.id)?'装备':`${s.cost} 金币`,color:s.color,disabled:d.skin===s.id}));
    if(this.tab==='weapons')rows=UPGRADES.map(u=>({title:`${u.name} Lv.${d.upgrades[u.id]}/5`,sub:u.id==='guard'?this.guardDescription:u.description,id:'career:upgrade:'+u.id,label:d.upgrades[u.id]>=5?'已满级':`${this.career.cost(u.id)} 金币`,disabled:d.upgrades[u.id]>=5}));
    const pages=Math.max(1,Math.ceil(rows.length/count));this.page=Math.min(this.page,pages-1);
    rows.slice(this.page*count,(this.page+1)*count).forEach((r,i)=>{const y=start+i*rowH;p.panel('career-row'+i,x,y,w,rowH-7,card);p.panel('career-stripe'+i,x,y,4,rowH-7,r.color??gold);p.text('career-name'+i,r.title,x+12,y+21,width<360?13:15,ink);p.text('career-sub'+i,r.sub,x+12,y+rowH-20,width<360?10:11,muted);p.button({id:r.id,label:r.label,x:x+w-86,y:y+8,w:78,h:34,disabled:r.disabled});});
    const infoY=start+Math.min(count,Math.max(1,rows.length-this.page*count))*rowH+12;
    if(footer-infoY>116){p.panel('career-equipped',x,infoY,w,100,card);p.text('career-skin-mark',this.career.skin.mark,x+20,infoY+36,35,this.career.skin.color);p.text('career-equipped-name','已装备 · '+this.career.skin.name,x+74,infoY+27,15,ink);p.text('career-bonus',`火力 +${Math.round((this.career.buffs.damage-1)*100)}%　装填 -${d.upgrades.haste*4}%`,x+74,infoY+54,12,muted);p.text('career-history',`通关 ${d.totals.wins} 次　无尽 ${d.totals.waves} 波　累计 ${d.earned} 金币`,x+14,infoY+82,11,gold);}
    const y=bottom-88;p.button({id:'career:page:-1',label:'上一页',x,y,w:78,h:34,disabled:this.page===0});p.text('career-page',`${this.page+1} / ${pages}`,x+w/2-18,y+18,12,muted);p.button({id:'career:page:1',label:'下一页',x:x+w-78,y,w:78,h:34,disabled:this.page>=pages-1});
    p.button({id:'career:checkin',label:calendarDay()<=d.checkin?'今日已签到':'每日签到',x,y:bottom-47,w:w*.4-5,h:38});
    p.button({id:'career:endless',label:'无尽挑战 · 双倍击破金币',x:x+w*.4+5,y:bottom-47,w:w*.6-5,h:38});
    p.text('career-notice',this.career.message,x,Math.min(bottom+2,height-5),width<360?10:11,gold);
  }
}
export function drawCareerCanvas(ctx:CanvasRenderingContext2D,panel:CareerPanel,w:number,h:number,light=false,top=0,bottom=0):CareerButton[]{
  const buttons:CareerButton[]=[];ctx.save();
  panel.draw({panel:(_id,x,y,width,height,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,width,height);},text:(_id,text,x,y,size,color)=>{ctx.fillStyle=color;ctx.font=`600 ${size}px system-ui,sans-serif`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(text,x,y,w-24);},button:b=>{buttons.push(b);ctx.fillStyle=b.disabled?(light?'#d9dec6':'#284356'):(light?'#f4d575':'#325d75');ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle=b.disabled?(light?'#687363':'#8aa3b4'):(light?'#254534':'#f6faff');ctx.font='600 12px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.label,b.x+b.w/2,b.y+b.h/2,b.w-8);}},w,h,light,top,bottom);
  ctx.restore();return buttons;
}
