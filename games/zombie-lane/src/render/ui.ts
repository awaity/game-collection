import { Game, clamp } from '../core/game';
import { ellipse, gun, line, poly, rect, rounded, shield, text, FONT } from './draw';
export interface Button { id:string;label:string;x:number;y:number;w:number;h:number; }
export interface UIState { sound:boolean;help:boolean;best:number;toast:string;toastTime:number;clock:number;safeTop:number;safeBottom:number; }
export class UI {
  buttons:Button[]=[];
  private button(ctx:CanvasRenderingContext2D,id:string,label:string,x:number,y:number,w:number,h:number,primary=false,small=false){
    this.buttons.push({id,label,x,y,w,h});
    rect(ctx,x,y+4,w,h,primary?'#aa7934':'#163c3990',small?9:13);
    rect(ctx,x,y,w,h,primary?'#f5c451':'#214f49',small?9:13);
    if(primary){line(ctx,[[x+15,y+2],[x+w-15,y+2]],'#ffe89a',2);text(ctx,label,x+w/2,y+h/2,small?13:19,'#214640',900,'center');}
    else text(ctx,label,x+w/2,y+h/2,small?12:15,'#edf1d9',700,'center');
  }
  draw(ctx:CanvasRenderingContext2D,g:Game,h:number,state:UIState){
    this.buttons=[];
    const top=state.safeTop+14,bottom=state.safeBottom;
    if(g.phase==='ready')this.home(ctx,g,h,state);
    else{
      this.hud(ctx,g,h,state,top,bottom);
      if(g.phase==='paused')this.pause(ctx,h);
      if(g.phase==='won'||g.phase==='lost')this.result(ctx,g,h,state);
    }
    if(state.help)this.help(ctx,h);
  }
  private home(ctx:CanvasRenderingContext2D,g:Game,h:number,s:UIState){
    const gradient=ctx.createLinearGradient(0,0,0,300);gradient.addColorStop(0,'#e7eddce6');gradient.addColorStop(1,'#e7eddc00');ctx.fillStyle=gradient;ctx.fillRect(0,0,420,300);
    const top=s.safeTop+24;
    shield(ctx,35,top+6,24);text(ctx,'东港高架 · 最后一道防线',56,top+6,12,'#375d50',700);
    const titleY=top+63;
    ctx.save();ctx.font=`900 75px ${FONT}`;ctx.lineJoin='round';ctx.lineWidth=8;ctx.textAlign='left';ctx.textBaseline='middle';
    for(const [v,y] of [['尸潮',titleY],['防线',titleY+79]] as const){ctx.strokeStyle='#eff2df';ctx.strokeText(v,31,y);ctx.fillStyle='#244b3f';ctx.fillText(v,34,y+4);ctx.fillStyle='#244b3f';ctx.fillText(v,31,y);}
    ctx.restore();
    rect(ctx,34,titleY+126,41,4,'#d9a745',1);text(ctx,'左边升级，右边开火。',87,titleY+128,13,'#335e4e',800);
    // The CTA sits below the battlefield so the actual game remains visible.
    const y=h-151-s.safeBottom;
    const fade=ctx.createLinearGradient(0,y-55,0,h);fade.addColorStop(0,'#24493a00');fade.addColorStop(.7,'#24493ab0');fade.addColorStop(1,'#24493ae6');ctx.fillStyle=fade;ctx.fillRect(0,y-55,420,h-y+55);
    text(ctx,s.best?`个人最佳  ${s.best.toLocaleString()} 分`:'一局三波 · 击败尸王就能突围',210,y-20,12,'#f2f1d6',700,'center');
    this.button(ctx,'start','开始守线    ›',32,y,356,58,true);
    this.button(ctx,'help','怎么玩',32,y+78,106,34,false,true);
    this.button(ctx,'difficulty',g.difficulty==='normal'?'难度：标准':'难度：硬核',157,y+78,106,34,false,true);
    this.button(ctx,'sound',s.sound?'声音：开':'声音：关',282,y+78,106,34,false,true);
  }
  private hud(ctx:CanvasRenderingContext2D,g:Game,h:number,s:UIState,top:number,bottom:number){
    rect(ctx,14,top,392,76,'#1b443fed',15);
    shield(ctx,37,top+24,23);text(ctx,'防线',56,top+23,11,'#b8cebb');text(ctx,`${Math.ceil(g.hp)}`,88,top+23,20,g.hp<30?'#ffb29e':'#f2f2d5',900);
    rect(ctx,27,top+49,134,8,'#567065',4);rect(ctx,27,top+49,134*g.hp/100,8,g.hp<30?'#ed8b71':'#f5c451',4);
    text(ctx,'尸潮',187,top+20,10,'#adc6b3');text(ctx,`${g.wave} / 3`,218,top+20,16,'#f3f0d2',900);
    for(let i=0;i<3;i++)rect(ctx,187+i*24,top+45,18,5,i<g.wave?'#f5c451':'#527568',2);
    text(ctx,`击败 ${g.stats.kills}`,187,top+64,10,'#bed0bb',600);
    this.button(ctx,'sound',s.sound?'♪':'♩',291,top+17,38,38,false,true);
    this.button(ctx,'pause','Ⅱ',346,top+17,38,38,false,true);
    if(g.boss){
      rect(ctx,45,top+88,330,32,'#543c3dee',8);text(ctx,'尸王',57,top+103,11,'#ffe0b2',800);
      rect(ctx,94,top+99,232,7,'#845958',3);rect(ctx,94,top+99,232*g.boss.hp/g.boss.maxHp,7,'#ed9878',3);
      text(ctx,`${Math.ceil(g.boss.hp/g.boss.maxHp*100)}%`,363,top+104,10,'#ffe0b2',700,'right');
    }
    if(s.toastTime>0){
      const y=top+(g.boss?132:91);ctx.save();ctx.globalAlpha=clamp(s.toastTime*3,0,1);rect(ctx,32,y,356,34,'#f3edd5ec',9);text(ctx,s.toast,210,y+17,12,'#36564a',800,'center');ctx.restore();
    }else if(g.phase==='playing'&&g.hp<30){
      rect(ctx,76,top+91,268,28,'#b55143ed',7);text(ctx,'防线告急！右移清场或呼叫空袭',210,top+105,11,'#fff0cf',800,'center');
    }
    if(g.combo>=3){text(ctx,`${g.combo}`,370,h*.4,35,'#ffefbd',900,'right');text(ctx,'连 击',369,h*.4+25,11,'#4e6d58',800,'right');}
    const y=h-bottom-88;
    const grad=ctx.createLinearGradient(0,y-55,0,h);grad.addColorStop(0,'#2d504000');grad.addColorStop(1,'#2d5040b0');ctx.fillStyle=grad;ctx.fillRect(0,y-55,420,h-y+55);
    this.buttons.push({id:'left',label:'左移，打门升级',x:15,y:y-43,w:180,h:31},{id:'right',label:'右移，开火清场',x:225,y:y-43,w:180,h:31});
    rect(ctx,20,y-42,174,29,g.side==='upgrade'?'#d3f1dfed':'#365c4f80',8);rect(ctx,226,y-42,174,29,g.side==='defend'?'#f6df9ded':'#365c4f80',8);
    text(ctx,'‹  打门升级',107,y-27,12,g.side==='upgrade'?'#285f5b':'#e1ead4',800,'center');
    text(ctx,'开火清场  ›',313,y-27,12,g.side==='defend'?'#4c5b3b':'#e1ead4',800,'center');
    rect(ctx,14,y,392,70,'#1b443ff5',14);
    gun(ctx,53,y+30,g.tier,.75,g.tier===0?'#d4dcc0':g.tier===1?'#84dee0':'#f5c451');
    text(ctx,g.weapon.name,91,y+24,14,'#f2eed3',900);text(ctx,`子弹 ×${g.pellets}   伤害 ×${g.power.toFixed(1)}`,91,y+46,10,'#aac5b0',600);
    const cooldown=Math.ceil(Math.max(0,g.bombReadyAt-g.time));
    this.button(ctx,'airstrike',cooldown?`${cooldown}s`:'呼叫空袭',272,y+10,120,46,!cooldown,true);
    if(!cooldown)text(ctx,'E',377,y+18,8,'#80682f',800,'center');
    if(g.time<6&&g.phase==='playing'&&s.toastTime<=0)text(ctx,'左右拖动角色 · 自动瞄准开火',210,h*.72,12,'#f5f3d8',800,'center');
  }
  private scrim(ctx:CanvasRenderingContext2D,h:number){rect(ctx,0,0,420,h,'#18382dd9');this.buttons=[];}
  private pause(ctx:CanvasRenderingContext2D,h:number){
    this.scrim(ctx,h);const y=h/2-142;
    shield(ctx,210,y,52);text(ctx,'歇口气，再开火。',210,y+62,27,'#f2f0d7',900,'center');
    text(ctx,'战场已暂停，防线不会受到伤害。',210,y+101,12,'#b3ceba',500,'center');
    this.button(ctx,'resume','继续守线',55,y+144,310,52,true);
    this.button(ctx,'retry','重新开始',55,y+213,148,42,false,true);this.button(ctx,'home','返回营地',217,y+213,148,42,false,true);
  }
  private result(ctx:CanvasRenderingContext2D,g:Game,h:number,s:UIState){
    this.scrim(ctx,h);const y=h/2-202,won=g.phase==='won';
    shield(ctx,210,y+15,62,won?'#f5c451':'#d49c81');text(ctx,won?'防线，守住了。':'差一点，就翻盘。',210,y+89,29,'#f5f0d3',900,'center');
    text(ctx,won?'尸王已击败，东港高架解除封锁。':'打爆左边的门，记得回右边清场。',210,y+128,12,'#b8ceba',500,'center');
    text(ctx,g.score.toLocaleString(),210,y+190,46,'#f5c451',900,'center');text(ctx,'本局得分',210,y+226,11,'#b8ceba',600,'center');
    for(const [x,v,label] of [[89,g.stats.kills,'击败僵尸'],[210,g.stats.upgrades,'获得升级'],[331,g.maxCombo,'最高连击']] as const){text(ctx,String(v),x,y+272,24,'#edf0d5',900,'center');text(ctx,label,x,y+300,10,'#a6c3af',500,'center');}
    this.button(ctx,'retry',won?'再来一局    ›':'再试一次    ›',43,y+338,334,52,true);
    this.button(ctx,'home','返回营地',123,y+406,174,35,false,true);
    text(ctx,`个人最佳 ${s.best.toLocaleString()} 分`,210,y+471,11,'#9cbaa5',600,'center');
  }
  private help(ctx:CanvasRenderingContext2D,h:number){
    this.scrim(ctx,h);const y=h/2-204;
    text(ctx,'一根手指，就能开火。',210,y+9,25,'#f4f0d7',900,'center');
    const rows=[['←','左移，打装备门','自动瞄准左侧门。耐久打到 0，','立刻获得双发、伤害或新武器。'],['→','右移，挡住尸潮','自动攻击最近的僵尸。别贪升级，','僵尸越过底部黄线就会损失防线。'],['✦','危急时，呼叫空袭','点击右下角空袭，或按 E。','覆盖全部尸潮，每 28 秒可用一次。']];
    rows.forEach(([icon,title,a,b],i)=>{const ry=y+77+i*97;rect(ctx,37,ry-15,38,38,'#54725b',10);text(ctx,icon,56,ry+4,22,'#f5c451',800,'center');text(ctx,title,91,ry-2,15,'#e7edd4',800);text(ctx,a,91,ry+25,11,'#b6cfb9',500);text(ctx,b,91,ry+44,11,'#b6cfb9',500);});
    text(ctx,'电脑 A / D 或方向键移动，空格暂停。',210,y+366,11,'#aac4ae',500,'center');
    this.button(ctx,'close-help','明白了，开始守线',44,y+402,332,51,true);
  }
}
