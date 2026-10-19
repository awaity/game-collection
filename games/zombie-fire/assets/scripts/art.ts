import {Graphics,Node,Layers,UITransform,LabelOutline,Mask} from 'cc';
import {GameView,color} from 'db://assets/collection/runtime';
import {Battle,FIELD,type Fx} from './core';
import {enemyById,skillById} from './content';
import {drawSoldier} from './illustration';
type Flash=Fx&{age:number};
/** Original drawn art. No reference-site image is used in this renderer. */
export class BattlefieldArt {
 private node:Node;private clip:Node;private g:Graphics;private flashes:Flash[]=[];width=360;height=640;bottom=-320;offset=-24;
 constructor(private ui:GameView){this.clip=new Node('Battlefield clip');this.clip.layer=Layers.Enum.UI_2D;this.clip.parent=ui.canvas;this.clip.addComponent(UITransform);this.clip.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;this.node=new Node('Original battlefield art');this.node.layer=Layers.Enum.UI_2D;this.node.parent=this.clip;this.node.addComponent(UITransform);this.g=this.node.addComponent(Graphics);}
 private rect(x:number,y:number,w:number,h:number,fill:string,r=0){const g=this.g;g.fillColor=color(fill);if(r)g.roundRect(x-w/2,y-h/2,w,h,r);else g.rect(x-w/2,y-h/2,w,h);g.fill();}
 private ellipse(x:number,y:number,rx:number,ry:number,fill:string){this.g.fillColor=color(fill);this.g.ellipse(x,y,rx,ry);this.g.fill();}
 private poly(points:number[][],fill:string,stroke='#26323b',line=1.5){const g=this.g;g.fillColor=color(fill);g.strokeColor=color(stroke);g.lineWidth=line;points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.close();g.fill();if(line)g.stroke();}
 private line(points:number[][],tint:string,width=2){const g=this.g;g.strokeColor=color(tint);g.lineWidth=width;points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
 private point(x:number,y:number){return {x:x*this.width/360,y:this.bottom+y*this.height/FIELD.height};}
 private zombie(b:Battle,e:Battle['enemies'][number]){
  const def=enemyById[e.kind],p=this.point(e.x,e.y),scale=Math.min(1.3,this.width/300,Math.max(.65,this.height/500))*(def.boss?1.75:e.kind==='brute'?1.25:1)*(e.child?.7:1),walk=Math.sin(e.age*(e.kind==='runner'?14:8))*2;
  const pt=(x:number,y:number)=>[p.x+x*scale,p.y+y*scale],poly=(pts:number[][],fill:string)=>this.poly(pts.map(([x,y])=>pt(x,y)),fill,'#26323b',Math.max(1,scale));
  const ellipse=(x:number,y:number,rx:number,ry:number,fill:string)=>this.ellipse(...pt(x,y) as [number,number],rx*scale,ry*scale,fill);
  ellipse(0,-17,14,5,'#26323b55');
  if(b.isEnraged(e)){this.g.strokeColor=color('#f4a04a');this.g.lineWidth=2.5;this.g.ellipse(p.x,p.y-12*scale,21*scale,10*scale);this.g.stroke();poly([[-8,28],[-10,39],[-2,33],[0,42],[4,32],[12,37],[8,27]],'#eb8b48');}
  if(e.kind==='bat'){
   poly([[-7,0],[-29,12],[-24,-6],[-10,-8]],'#796080');poly([[7,0],[29,12],[24,-6],[10,-8]],'#796080');
  }else{
   poly([[-9,-5],[-2,-6],[-4,-18+walk],[-12,-18+walk]],'#354651');poly([[2,-6],[9,-5],[12,-18-walk],[4,-18-walk]],'#354651');
   poly([[-12,6],[-18,-4+walk],[-14,-11],[-10,-3]],def.color);poly([[12,6],[18,-4-walk],[14,-11],[10,-3]],def.color);
  }
  const shirt=e.kind==='armor'||e.kind==='mech'?'#56636f':e.kind==='healer'?'#c6c8ba':e.kind==='bomber'?'#997545':e.kind==='runner'?'#a08b68':e.kind==='fireguard'?'#a75539':e.kind==='frostguard'?'#88b1bf':'#596b65';
  poly([[-10,9],[-13,-6],[0,-11],[13,-6],[10,9]],shirt);poly([[-8,5],[8,5],[6,-3],[-6,-3]],e.kind==='armor'||e.kind==='mech'?'#81878b':'#6f8072');
  poly([[-10,18],[-12,7],[-5,1],[6,1],[12,8],[9,20],[0,24]],def.color);
  poly([[-10,18],[-10,24],[-3,22],[1,26],[4,22],[10,22],[10,17],[3,20],[-2,17]],'#384b4b');
  ellipse(-4,12,2.6,2.7,'#e4d995');ellipse(4,12,2.6,2.7,'#e4d995');ellipse(-3.6,11.6,.9,1.3,'#353b35');ellipse(3.6,11.6,.9,1.3,'#353b35');
  poly([[-5,5],[5,5],[3,2],[-3,1]],'#454944');this.line([pt(-4,4),pt(4,4)],'#e9dec2',scale);
  if(e.kind==='shield')poly([[-14,-4],[-16,13],[0,16],[3,0],[-4,-10]],e.shield>0?'#737e83':'#565d5c');
  if(e.kind==='healer'){poly([[-6,22],[6,22],[7,27],[-7,27]],'#e4dfc9');this.line([pt(0,22),pt(0,28)],'#b66158',2*scale);this.line([pt(-3,25),pt(3,25)],'#b66158',2*scale);}
  if(e.kind==='bomber'||e.kind==='butcher'){ellipse(12,-2,7,8,'#9b743e');this.line([pt(13,6),pt(16,10)],'#f9c665',2*scale);}
  if(e.kind==='mech'){poly([[-20,10],[-29,-8],[-17,-12],[-13,5]],'#999979');poly([[20,10],[29,-8],[17,-12],[13,5]],'#999979');}
  if(e.kind==='queen')for(const side of [-1,1])poly([[side*5,23],[side*15,31],[side*12,16]],'#aa75a4');
  if(e.hp<e.maxHp||def.boss){this.rect(p.x,p.y+33*scale,30*scale,3*scale,'#343c3c');this.rect(p.x-(1-e.hp/e.maxHp)*15*scale,p.y+33*scale,30*scale*Math.max(0,e.hp/e.maxHp),3*scale,'#bc6557');}
  if(e.freeze>0){poly([[-16,-15],[-19,15],[-10,30],[12,26],[19,7],[13,-17]],'#a3e9fa77');this.line([pt(-15,5),pt(-4,18),pt(1,2),pt(13,12)],'#d6faff',scale);}
  if(e.burn>0)for(const side of [-1,1])poly([[side*13,-8],[side*18,8],[side*12,1],[side*8,12],[side*7,-7]],'#ef9a42cc');
  if(e.stun>0)this.line([pt(-12,27),pt(-3,31),pt(-7,24),pt(7,28)],'#f4d27d',2*scale);
  if(e.warning>0){const radius=(23+(1.4-e.warning)*8)*scale;this.g.strokeColor=color('#ed6b4e');this.g.lineWidth=2.5;this.g.circle(p.x,p.y,radius);this.g.stroke();}
  if(b.priority===e.id){this.g.strokeColor=color('#f4e0a2');this.g.lineWidth=2;this.g.circle(p.x,p.y,22*scale);this.g.stroke();}
 }
 draw(b:Battle,delta:number,skinId:string,motion:boolean,events:Fx[]=[],quality='high'){
  this.ui.resize();this.clip.setSiblingIndex(0);const g=this.g;g.clear();this.width=Math.min(480,this.ui.width-84);this.height=Math.max(150,this.ui.height-182-this.ui.insets.top-this.ui.insets.bottom);this.bottom=-this.ui.height/2+88+this.ui.insets.bottom;
  const clipY=this.bottom+this.height/2-16;this.clip.setPosition(this.offset,clipY);this.clip.getComponent(UITransform)!.setContentSize(this.width+24,this.height+50);this.node.setPosition(0,-clipY);
  const w=this.width,h=this.height,bottom=this.bottom,map=b.map,center=bottom+h/2;
  this.rect(0,center,w+22,h+18,map.edge,8);this.rect(0,center,w,h,map.ground);
  for(let row=0;row<12;row++){const y=bottom+row*h/11;this.line([[-w/2,y],[w/2,y]],map.edge+'45',1);for(let col=-2;col<=2;col++)this.line([[col*w/5+((row%2)*w/10),y],[col*w/5+((row%2)*w/10),y+h/11]],map.edge+'45',1);}
  for(const side of [-1,1]){
   this.rect(side*(w/2-10),center,8,h,map.accent+'55');
   for(let n=0;n<7;n++){const y=bottom+40+n*h/7;this.rect(side*(w/2-8),y,14,23,map.edge,3);this.rect(side*(w/2-7),y+5,8,4,map.accent);}
  }
  this.landmarks(b.mapIndex,w,h,bottom,motion?b.time:0);
  if(b.mapIndex===0||b.mapIndex===1)for(let n=0;n<8;n++)this.rect(0,bottom+45+n*h/8,6,24,map.accent+'77');
  if(quality==='high')for(let n=0;n<10;n++){const x=Math.sin(n*74)*w*.38,y=bottom+(n+.4)*h/10;this.line([[x-8,y+2],[x,y],[x-2,y-5],[x+7,y-9]],map.edge+'77',1);}
  const wall=this.point(0,FIELD.wall);this.rect(0,wall.y-29,w+8,60,'#354450',5);this.rect(0,wall.y+5,w+12,13,'#a1a79f',3);this.rect(0,wall.y,w+12,4,'#4f5e64');
  for(let n=0;n<8;n++){const x=-w/2+24+n*(w-48)/7;this.rect(x,wall.y-17,30,24,'#566674',3);this.ellipse(x,wall.y-17,4,4,'#26343f');}
  this.rect(0,wall.y-55,w,7,'#263541',2);const ratio=Math.max(0,b.hp/b.maxHp);this.rect(-(1-ratio)*w/2,wall.y-55,w*ratio,7,ratio>.4?'#8ebd8d':'#dd7b62',2);
  for(const f of b.fields){const p=this.point(f.x,f.y),radius=f.radius*this.width/360;const c=skillById[f.skill].color;
   if(f.skill==='guided'){const origin=this.point(0,FIELD.wall);this.line([[origin.x,origin.y],[p.x,p.y]],c+'b0',3);this.ellipse(p.x,p.y,6,6,'#fff2c8');continue;}
   if(f.delay>0){g.strokeColor=color('#e8a45a');g.lineWidth=2;g.circle(p.x,p.y,radius);g.moveTo(p.x-10,p.y);g.lineTo(p.x+10,p.y);g.moveTo(p.x,p.y-10);g.lineTo(p.x,p.y+10);g.stroke();continue;}
   if(f.skill==='vehicle'){this.rect(p.x,p.y,48,62,'#526353',6);for(const side of [-1,1])this.rect(p.x+side*24,p.y,8,53,'#293a3e',3);this.rect(p.x,p.y+5,30,30,'#8e9b75',5);this.rect(p.x,p.y+29,8,38,'#364e48',2);}
   else {this.ellipse(p.x,p.y,radius,radius*.72,c+'35');for(let n=0;n<3;n++){g.strokeColor=color(c+'99');g.lineWidth=2;g.ellipse(p.x+Math.sin(b.time*4+n)*5,p.y+n*7,radius*(1-n*.2),radius*(.6-n*.1));g.stroke();}}
  }
  const z=[...b.enemies].sort((a,b)=>b.y-a.y);for(const e of z)this.zombie(b,e);
  const heroY=wall.y-21;drawSoldier(g,skinId,0,heroY,.68);
  b.loadout.mercenaries.forEach((merc,i)=>drawSoldier(g,merc==='frost'?'arctic':merc==='flame'?'ember':merc==='storm'?'arc':'hazard',(i===0?-1:1)*w*.32,heroY-2,.55));
  const target=b.enemies.find(e=>e.id===b.priority)??b.enemies.reduce<Battle['enemies'][number]|undefined>((a,e)=>!a||e.y<a.y?e:a,undefined),angle=target?Math.atan2(target.x,Math.max(1,target.y-FIELD.wall)):0;
  this.line([[0,heroY+2],[Math.sin(angle)*36,heroY+2+Math.cos(angle)*36]],'#26363e',10);this.line([[0,heroY+6],[Math.sin(angle)*34,heroY+6+Math.cos(angle)*34]],'#788990',5);
  for(const p of b.projectiles){const a=this.point(p.px,p.py),q=this.point(p.x,p.y);this.line([[a.x,a.y],[q.x,q.y]],skillById[p.skill].color,p.skill==='rifle'?3:p.skill==='blade'?8:6);if(p.skill==='thermo'){this.ellipse(q.x,q.y,7,9,'#f9ba58');this.ellipse(q.x,q.y+1,3,5,'#fff0bc');}}
  for(const e of events)this.flashes.push({...e,age:0});this.flashes=this.flashes.slice(quality==='low'?-32:-90).filter(f=>f.age<.6);
  let label=0;
  for(const f of this.flashes){f.age+=delta;const p=this.point(f.x,f.y),q=this.point(f.tx??f.x,f.ty??f.y),alpha=Math.round(Math.max(0,1-f.age/.6)*255).toString(16).padStart(2,'0'),tint=f.skill?skillById[f.skill].color:'#f6cf7c';
   if(f.type==='beam'||f.type==='chain')this.line([[p.x,p.y],[q.x,q.y]],tint+alpha,f.type==='chain'?3:Math.min(12,f.value??5));
   if(f.type==='burst'){const r=(f.value??25)*this.width/360*(motion?.5+f.age*2:1);this.ellipse(p.x,p.y,r,r*.75,tint+Math.round(60*Math.max(0,1-f.age/.6)).toString(16).padStart(2,'0'));g.strokeColor=color(tint+alpha);g.lineWidth=2;g.circle(p.x,p.y,r);g.stroke();}
   if(f.type==='shot'&&f.age<.07){this.poly([[p.x-5,p.y],[p.x-10,p.y+19],[p.x,p.y+10],[p.x+8,p.y+22],[p.x+5,p.y]],'#ffe3a1','#ffba55',1);}
   if(f.type==='hit'&&label<(quality==='low'?8:24)){const text=this.ui.text('damage:'+label++,String(f.value),p.x+this.offset,Math.min(this.bottom+this.height-18,p.y+(motion?f.age*32:12)),f.crit?19:13,f.crit?'#ffd67c':'#fff4d9',70);text.isBold=true;if(!text.node.getComponent(LabelOutline)){const outline=text.node.addComponent(LabelOutline);outline.color=color('#283b43');outline.width=1.5;}}
  }
 }
 hitTest(x:number,y:number){return {x:(x-this.offset)*360/this.width,y:(y-this.bottom)*FIELD.height/this.height};}
 private landmarks(map:number,w:number,h:number,bottom:number,time:number){
  for(const side of [-1,1]){const x=side*(w/2-32),y=bottom+h*(side===1?.62:.32);
   if(map===0){this.rect(x,y,28,62,'#485f63',7);this.rect(x,y+4,22,25,'#a7b4b2',4);this.rect(x,y+5,18,17,'#344a52',3);this.rect(x,y+24,17,5,'#74898b',2);this.line([[x-8,y-17],[x+8,y-23]],'#bcb39a',2);}
   if(map===1){this.rect(x,y,29,75,'#4d5b61',3);for(let n=0;n<7;n++)this.line([[x-11,y-30+n*9],[x+11,y-30+n*9]],'#88928e',3);this.line([[x-7,y+48],[x+9,y+48],[x+9,y+32]],'#af956c',6);}
   if(map===2){this.rect(x,y,29,47,'#647d78',3);this.rect(x,y+3,25,35,'#d5d6c5',3);this.rect(x,y+14,21,8,'#a4b9b4',3);this.rect(x,y-5,5,14,'#a8615b');this.rect(x,y-5,14,5,'#a8615b');}
   if(map===3){this.line([[x-10,bottom+35],[x-10,bottom+h-15]],'#556a7b',3);this.line([[x+10,bottom+35],[x+10,bottom+h-15]],'#556a7b',3);for(let n=0;n<15;n++)this.line([[x-15,bottom+40+n*h/16],[x+15,bottom+40+n*h/16]],'#b9ccd2',3);this.poly([[x-18,y],[x-12,y+24],[x+6,y+29],[x+19,y+6],[x+11,y-7]],'#cadfe2','#96b5bf');}
   if(map===4){this.rect(x,y,26,55,'#675853',4);this.ellipse(x,y+27,13,5,'#92806b');this.rect(x,y+3,26,9,'#d09a56');this.ellipse(x+5,y-38,22,11,'#3c4142aa');const flicker=Math.sin(time*8+side)*3;this.poly([[x-7,y+30],[x-11,y+42],[x,y+60+flicker],[x+2,y+44],[x+9,y+51],[x+11,y+34]],'#ed9f54bb','#ed9f54',0);}
   if(map===5){this.rect(x,y,28,66,'#354f51',4);this.rect(x,y,15,49,'#83a28c',3);for(let n=0;n<6;n++)this.rect(x,y-22+n*9,10,3,n%2?'#cee2a0':'#b6d6b3');this.line([[x-15,y+39],[x-19,y+39],[x-19,y-40],[x+6,y-40]],'#a8b8a2',3);}
  }
 }
 destroy(){this.clip.destroy();this.flashes=[];}
}
