import {Graphics,Node,Layers,UITransform,LabelOutline,Mask} from 'cc';
import {GameView,color} from 'db://assets/collection/runtime';
import {Battle,FIELD,type Fx} from './core';
import {LUCKY_ORB,enemyById,skillById} from './content';
import {drawSoldier,drawDrone,drawDragon} from './illustration';
import {InfectedPainter} from './infected';
type Flash=Fx&{age:number};
/** Original drawn art. No reference-site image is used in this renderer. */
export class BattlefieldArt {
 private node:Node;private clip:Node;private g:Graphics;private infected:InfectedPainter;private flashes:Flash[]=[];width=360;height=640;bottom=-320;offset=-24;
 constructor(private ui:GameView){this.clip=new Node('Battlefield clip');this.clip.layer=Layers.Enum.UI_2D;this.clip.parent=ui.canvas;this.clip.addComponent(UITransform);this.clip.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;this.node=new Node('Original battlefield art');this.node.layer=Layers.Enum.UI_2D;this.node.parent=this.clip;this.node.addComponent(UITransform);this.g=this.node.addComponent(Graphics);this.infected=new InfectedPainter(this.g);}
 private rect(x:number,y:number,w:number,h:number,fill:string,r=0){const g=this.g;g.fillColor=color(fill);if(r)g.roundRect(x-w/2,y-h/2,w,h,r);else g.rect(x-w/2,y-h/2,w,h);g.fill();}
 private ellipse(x:number,y:number,rx:number,ry:number,fill:string){this.g.fillColor=color(fill);this.g.ellipse(x,y,rx,ry);this.g.fill();}
 private poly(points:number[][],fill:string,stroke='#26323b',line=1.5){const g=this.g;g.fillColor=color(fill);g.strokeColor=color(stroke);g.lineWidth=line;points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.close();g.fill();if(line)g.stroke();}
 private line(points:number[][],tint:string,width=2){const g=this.g;g.strokeColor=color(tint);g.lineWidth=width;points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
 private point(x:number,y:number){return {x:x*this.width/360,y:this.bottom+y*this.height/FIELD.height};}
 private worldPath(points:number[][]){return points.map(([x,y])=>{const p=this.point(x,y);return [p.x,p.y];});}
 private zombie(b:Battle,e:Battle['enemies'][number],motion:boolean,detail:boolean){
  const def=enemyById[e.kind],p=this.point(e.x,e.y),scale=Math.min(1.3,this.width/300,Math.max(.65,this.height/500))*(def.boss?1.75:e.kind==='brute'?1.25:1)*(e.child?.7:1);
  const pt=(x:number,y:number)=>[p.x+x*scale,p.y+y*scale],poly=(pts:number[][],fill:string)=>this.poly(pts.map(([x,y])=>pt(x,y)),fill,'#26323b',Math.max(1,scale));
  this.infected.draw(e,p.x,p.y,scale,motion,detail);
  if(b.isEnraged(e)){this.g.strokeColor=color('#f4a04a');this.g.lineWidth=2.5;this.g.ellipse(p.x,p.y-16*scale,22*scale,10*scale);this.g.stroke();}
  if(e.bind>0){const strength=Math.min(1,e.bind);for(const side of [-1,1])this.line([pt(side*16,-21),pt(side*11,-15),pt(side*17,-8),pt(side*10,-4+strength*8)],e.root>0?'#c8e58c':'#8eae66',1.8*scale);}
  if(e.slow>0)this.line([pt(-17,-18),pt(-4,-22),pt(8,-21),pt(17,-17)],'#b9d4df',1.5*scale);
  if(e.orbSlow>0)this.line([pt(-17,-12),pt(-12,-18),pt(9,-18),pt(17,-12)],'#e2b6e6',2*scale);
  if(e.hinder>0)for(const side of [-1,1])this.line([pt(side*22,-3),pt(side*17,-8),pt(side*22,-13)],'#c8b6f0',2*scale);
  if(e.fractures>0)this.line([pt(-6,12),pt(1,3),pt(-3,-2),pt(7,-10)],'#f4bdce',1.8*scale);
  if(e.hp<e.maxHp||def.boss){this.rect(p.x,p.y+33*scale,30*scale,3*scale,'#343c3c');this.rect(p.x-(1-e.hp/e.maxHp)*15*scale,p.y+33*scale,30*scale*Math.max(0,e.hp/e.maxHp),3*scale,'#bc6557');}
  if(e.freeze>0){poly([[-16,-15],[-19,15],[-10,30],[12,26],[19,7],[13,-17]],'#a3e9fa77');this.line([pt(-15,5),pt(-4,18),pt(1,2),pt(13,12)],'#d6faff',scale);}
  if(e.burn>0)for(const side of [-1,1])poly([[side*13,-8],[side*18,8],[side*12,1],[side*8,12],[side*7,-7]],'#ef9a42cc');
  if(e.stun>0)this.line([pt(-12,31),pt(-3,35),pt(9,32),pt(3,28),pt(-12,31)],'#f4d27d',2*scale);
  if(e.paralysis>0)this.line([pt(-12,27),pt(-3,31),pt(-7,24),pt(7,28)],'#f4d27d',2*scale);
  if(e.warning>0){const radius=(23+(1.4-e.warning)*8)*scale;this.g.strokeColor=color('#ed6b4e');this.g.lineWidth=2.5;this.g.circle(p.x,p.y,radius);this.g.stroke();}
  if(b.priority===e.id){this.g.strokeColor=color('#f4e0a2');this.g.lineWidth=2;this.g.circle(p.x,p.y,22*scale);this.g.stroke();}
 }
 draw(b:Battle,delta:number,skinId:string,motion:boolean,events:Fx[]=[],quality='high'){
  this.ui.resize();this.clip.setSiblingIndex(0);const g=this.g;g.clear();
  const availableHeight=this.ui.height-this.ui.insets.top-this.ui.insets.bottom;
  const footer=this.ui.width<this.ui.height&&availableHeight<650?120:88;
  this.width=Math.min(480,this.ui.width-84);this.height=Math.max(150,availableHeight-94-footer);this.bottom=-this.ui.height/2+footer+this.ui.insets.bottom;
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
  const wall=this.point(0,FIELD.wall);this.rect(0,wall.y-29,w+8,60,'#293846',3);this.rect(0,wall.y+5,w+12,13,'#a3aea9',2);this.rect(0,wall.y,w+12,4,'#4f5e64');
  for(let n=0;n<8;n++){const x=-w/2+24+n*(w-48)/7;this.poly([[x-15,wall.y-29],[x+15,wall.y-29],[x+15,wall.y-7],[x+10,wall.y-4],[x-15,wall.y-4]],'#576b79');this.line([[x-12,wall.y-7],[x+10,wall.y-7]],'#879b9f',1);this.ellipse(x-9,wall.y-12,1.8,1.8,'#1e313d');this.ellipse(x+9,wall.y-24,1.8,1.8,'#1e313d');if(n%2===0)this.line([[x-7,wall.y-26],[x+6,wall.y-10]],'#273c48',3);}
  for(let n=0;n<Math.floor(w/20);n++){const x=-w/2+n*20;this.poly([[x,wall.y-39],[x+8,wall.y-39],[x+14,wall.y-33],[x+6,wall.y-33]],'#c9a25f','#c9a25f',0);}
  const healthY=wall.y-(h<300?42:55);this.rect(0,healthY,w,7,'#263541',2);const ratio=Math.max(0,b.hp/b.maxHp);this.rect(-(1-ratio)*w/2,healthY,w*ratio,7,ratio>.4?'#8ebd8d':'#dd7b62',2);
  for(const f of b.fields){const p=this.point(f.x,f.y),radius=f.radius*this.width/360;const c=skillById[f.skill].color,ry=f.radius*this.height/FIELD.height;
   if(f.skill==='pillar'&&f.nodes){
    for(let i=1;i<f.nodes.length;i++){
     const a=f.nodes[i-1],z=f.nodes[i],length=Math.hypot(z.x-a.x,z.y-a.y)||1,nx=-(z.y-a.y)/length*f.radius,ny=(z.x-a.x)/length*f.radius;
     this.poly(this.worldPath([[a.x+nx,a.y+ny],[z.x+nx,z.y+ny],[z.x-nx,z.y-ny],[a.x-nx,a.y-ny]]),'#79d5f429','#79d5f450',.6);
     const points=Array.from({length:9},(_,n)=>{const t=n/8,jitter=n===0||n===8?0:Math.sin(n*7+(motion?b.time*18:0))*.45;return [a.x+(z.x-a.x)*t+nx*jitter,a.y+(z.y-a.y)*t+ny*jitter];});
     this.line(this.worldPath(points),c,quality==='low'?2:3);this.line(this.worldPath(points),'#e8fcff',1);
    }
    const s=Math.min(1.2,w/320,Math.max(.65,h/500));
    for(const node of f.nodes){const q=this.point(node.x,node.y);this.ellipse(q.x,q.y-17*s,12*s,5*s,'#24374199');this.poly([[q.x-9*s,q.y-15*s],[q.x+9*s,q.y-15*s],[q.x+6*s,q.y-8*s],[q.x-6*s,q.y-8*s]],'#718b9b','#26323b',1.5);this.rect(q.x,q.y-7*s,5*s,18*s,'#a6b7bc',1);for(let n=0;n<3;n++)this.ellipse(q.x,q.y-9*s+n*4*s,7*s,2*s,'#456c80');this.ellipse(q.x,q.y,5*s,5*s,'#79d5f477');this.ellipse(q.x,q.y,2.6*s,3*s,'#e6fbff');}
    continue;
   }
   if(f.skill==='rift'){
    const diamond=(r:number)=>this.worldPath([[f.x-r,f.y],[f.x,f.y+r*.7],[f.x+r,f.y],[f.x,f.y-r*.7]]);
    this.poly(diamond(f.radius),'#9270c63b','#bda5e4',2);this.poly(diamond(f.radius*.72),'#28284d70','#8e7fc5',1.2);
    this.poly(diamond(f.radius*.34),'#ded0f126','#e6d9fa',1);
    for(const side of [-1,1]){const seam=f.radius*.34;this.line(this.worldPath([[f.x+side*seam,f.y],[f.x+side*seam*.4,f.y+f.radius*.2],[f.x+side*seam*.6,f.y-f.radius*.14]]),'#e4d2ff',1.8);}
    if(quality==='high')for(let n=0;n<6;n++){const t=n/6+(motion?b.time*.14%1:0),offset=(t%1-.5)*f.radius*.9;const q=this.point(f.x+offset,f.y+Math.sin(n*3)*f.radius*.2);this.ellipse(q.x,q.y,1.4,2.5,'#d6c1ef');}
    continue;
   }
   if(f.skill==='matrix'){
    const edge=Array.from({length:16},(_,n)=>{const a=n*Math.PI/8,r=f.radius*(.94+.04*Math.sin(n*2+(motion?b.time*2:0)));return [f.x+Math.cos(a)*r,f.y+Math.sin(a)*r];});
    this.poly(this.worldPath(edge),'#9fbd5442','#c2d98a',1.5);this.ellipse(p.x,p.y,radius*.54,ry*.54,'#56794155');
    for(let n=0;n<(quality==='low'?3:7);n++){const a=n*2.4+(motion?b.time*.3:0),r=f.radius*(.25+(n%3)*.2),q=this.point(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r);this.ellipse(q.x,q.y,3+n%3,2+n%2,'#cde6a060');this.line([[q.x-2,q.y+1],[q.x+1,q.y+2]],'#e0edb0',1);}
    if((f.merged??1)>1){const ring=Array.from({length:7},(_,i)=>[p.x+Math.cos(i*Math.PI/3)*radius*.3,p.y+Math.sin(i*Math.PI/3)*ry*.3]);this.line(ring,'#d0e59a',1.5);}
    continue;
   }
   if(f.variant==='dragon-slam'){
    this.ellipse(p.x,p.y,radius,ry,f.delay>0?'#99dce324':'#99dce34a');g.strokeColor=color(f.delay>0?'#dcecd6':'#a6e9f0');g.lineWidth=f.delay>0?1.5:3;g.ellipse(p.x,p.y,radius,ry);g.stroke();
    if(f.delay>0){for(const side of [-1,1])this.line([[p.x+side*radius*.2,p.y-ry*.2],[p.x+side*radius*.2,p.y+ry*.2]],'#c9e8e7',2);}
    else for(let n=0;n<(quality==='low'?6:12);n++){const angle=n*Math.PI/6,q=this.point(f.x+Math.cos(angle)*f.radius*.8,f.y+Math.sin(angle)*f.radius*.8),size=7+(n%3)*3;this.poly([[q.x-size*.4,q.y-4],[q.x-size*.2,q.y+size],[q.x+size*.4,q.y+size*.5],[q.x+size*.35,q.y-4]],'#b1e6edb0','#deffff',1);this.line([[p.x,p.y],[q.x,q.y]],'#c0f0ef77',1);}
    continue;
   }
   if(f.variant==='plasma'){
    const progress=1-f.life/f.total,r=radius*(motion?(progress<.5?.25+progress*1.5:1-(progress-.5)*1.6):.85);
    this.ellipse(p.x,p.y,r,r*.72,'#b3a0f42b');
    for(let ring=0;ring<2;ring++){g.strokeColor=color(ring?'#f3d5ff':'#b0a0ef');g.lineWidth=ring?1.5:3;g.ellipse(p.x,p.y,r-ring*5,Math.max(2,r*.72-ring*4));g.stroke();}
    for(let n=0;n<(quality==='low'?3:6);n++){const angle=n*Math.PI/3+(motion?b.time*2:0),x=Math.cos(angle)*r,y=Math.sin(angle)*r*.72;this.line([[p.x+x*.7,p.y+y*.7],[p.x+x*.87-3,p.y+y*.8+4],[p.x+x,p.y+y]],'#e8d6ff',1.5);}
    continue;
   }
   if(f.variant==='ice-storm'){
    this.ellipse(p.x,p.y,radius,radius*.7,'#71d6ec35');
    for(let n=0;n<(quality==='low'?4:9);n++){const angle=n*2.4+(motion?b.time*3:0),r=radius*(.35+(n%3)*.22),x=p.x+Math.cos(angle)*r,y=p.y+Math.sin(angle)*r*.7;this.poly([[x-3,y],[x,y+9],[x+4,y],[x,y-5]],'#c9f6fa','#7fcfdf',1);}
    g.strokeColor=color('#96e9f2');g.lineWidth=2;g.ellipse(p.x,p.y,radius*.9,radius*.63);g.stroke();continue;
   }
   if(f.skill==='guided'){const origin=this.point(0,FIELD.wall);this.line([[origin.x,origin.y],[p.x,p.y]],c+'b0',3);this.ellipse(p.x,p.y,6,6,'#fff2c8');continue;}
   if(f.delay>0){g.strokeColor=color('#e8a45a');g.lineWidth=2;g.ellipse(p.x,p.y,radius,ry);g.moveTo(p.x-10,p.y);g.lineTo(p.x+10,p.y);g.moveTo(p.x,p.y-10);g.lineTo(p.x,p.y+10);g.stroke();continue;}
   if(f.skill==='vehicle'){this.rect(p.x,p.y,48,62,'#526353',6);for(const side of [-1,1])this.rect(p.x+side*24,p.y,8,53,'#293a3e',3);this.rect(p.x,p.y+5,30,30,'#8e9b75',5);this.rect(p.x,p.y+29,8,38,'#364e48',2);}
   else {this.ellipse(p.x,p.y,radius,radius*.72,c+'35');for(let n=0;n<3;n++){g.strokeColor=color(c+'99');g.lineWidth=2;g.ellipse(p.x+Math.sin((motion?b.time*4:0)+n)*5,p.y+n*7,radius*(1-n*.2),radius*(.6-n*.1));g.stroke();}}
  }
  for(const link of b.links){const linked=link.ids.map(id=>b.enemies.find(e=>e.id===id)).filter((e):e is Battle['enemies'][number]=>!!e);for(let n=1;n<linked.length;n++){const a=this.point(linked[0].x,linked[0].y),z=this.point(linked[n].x,linked[n].y),dx=z.x-a.x,dy=z.y-a.y;this.line([[a.x,a.y],[a.x+dx*.35-dy*.04,a.y+dy*.35+dx*.04],[a.x+dx*.65+dy*.04,a.y+dy*.65-dx*.04],[z.x,z.y]],'#d0b4ee99',1.5);}}
  const z=[...b.enemies].sort((a,b)=>b.y-a.y);for(const e of z)this.zombie(b,e,motion,quality!=='low');
  if(b.dragon){const d=b.dragon,p=this.point(d.x,d.y);drawDragon(g,p.x,p.y,Math.min(1.25,this.width/310,Math.max(.65,this.height/500)),motion?b.time:0,d.animation>0);}
  const heroY=wall.y-21;drawSoldier(g,skinId,0,heroY,.68);
  b.loadout.mercenaries.forEach((merc,i)=>drawSoldier(g,merc==='frost'?'arctic':merc==='flame'?'ember':merc==='storm'?'arc':'hazard',(i===0?-1:1)*w*.32,heroY-2,.55));
  const target=b.enemies.find(e=>e.id===b.priority)??b.enemies.reduce<Battle['enemies'][number]|undefined>((a,e)=>!a||e.y<a.y?e:a,undefined),angle=target?Math.atan2(target.x,Math.max(1,target.y-FIELD.wall)):0;
  this.line([[0,heroY+2],[Math.sin(angle)*36,heroY+2+Math.cos(angle)*36]],'#26363e',10);this.line([[0,heroY+6],[Math.sin(angle)*34,heroY+6+Math.cos(angle)*34]],'#788990',5);
  for(const p of b.projectiles){const a=this.point(p.px,p.py),q=this.point(p.x,p.y);
   if(p.skill==='drone'){drawDrone(g,q.x,q.y,p.radius*this.width/360,motion?b.time:0);continue;}
   if(p.skill==='orb'){
    if(p.quality){
     const tint=LUCKY_ORB.qualities.find(v=>v.id===p.quality)!.color,r=Math.max(4,p.radius*this.width/360),preparing=(p.prepare??0)>1e-8,light=p.source==='lucky-light';
     if(preparing){
      this.poly([[q.x-r-4,q.y-r],[q.x-r-4,q.y+6],[q.x+r+4,q.y+6],[q.x+r+4,q.y-r]],'#28333e',tint,1.5);
      const fill=1-p.prepare!/LUCKY_ORB.prepare;this.ellipse(q.x,q.y+8,r*.6,r*.6,tint+'55');
      this.line([[q.x-r,q.y-r-5],[q.x-r+2*r*fill,q.y-r-5]],tint,3);
      if(motion&&quality==='high')for(let n=0;n<3;n++){const angle=b.time*3+n*Math.PI*2/3;this.ellipse(q.x+Math.cos(angle)*r,q.y+8+Math.sin(angle)*r,2,2,tint);}continue;
     }
     if(motion){const speed=Math.hypot(p.vx,p.vy)||1,t=this.point(p.x-p.vx/speed*(light?18:30),p.y-p.vy/speed*(light?18:30));this.line([[t.x,t.y],[q.x,q.y]],tint+'66',r);}
     this.ellipse(q.x,q.y,r+2,r+2,'#25313e');this.ellipse(q.x,q.y,r,r,tint);this.ellipse(q.x-r*.2,q.y+r*.2,r*.45,r*.45,'#fff5d9');
     if(!light){
      const bands=p.quality==='low'?1:2;for(let n=0;n<bands;n++){g.strokeColor=color('#536078');g.lineWidth=1.5;g.ellipse(q.x,q.y,r*.84,r*(n?.7:.3));g.stroke();}
      if(p.quality==='high')for(let n=0;n<4;n++){const angle=n*Math.PI/2+(motion?b.time:0);this.line([[q.x+Math.cos(angle)*r,q.y+Math.sin(angle)*r],[q.x+Math.cos(angle)*(r+5),q.y+Math.sin(angle)*(r+5)]],tint,2);}
      if(quality==='high'){g.strokeColor=color(tint+'66');g.lineWidth=1;g.circle(q.x,q.y,r+5);g.stroke();}
     }continue;
    }
    const r=Math.max(3,p.radius*this.width/360),c=p.source==='secondary'?'#b9b1c9':'#e0a9dd';
    if(motion){const speed=Math.hypot(p.vx,p.vy)||1,t=this.point(p.x-p.vx/speed*24,p.y-p.vy/speed*24);this.line([[t.x,t.y],[q.x,q.y]],c+'65',r);}
    this.ellipse(q.x,q.y,r+1,r+1,'#333346');this.ellipse(q.x,q.y,r,r,c);
    this.poly([[q.x-r*.8,q.y+r*.3],[q.x,q.y+r*.85],[q.x+r*.7,q.y+r*.2],[q.x+r*.3,q.y-r*.7],[q.x-r*.5,q.y-r*.5]],'#9974a6',c,1);
    this.poly([[q.x-r*.8,q.y+r*.3],[q.x,q.y+r*.85],[q.x-r*.1,q.y],[q.x-r*.5,q.y-r*.5]],'#efd0ed',c,0);
    this.ellipse(q.x-r*.15,q.y+r*.4,Math.max(1,r*.18),Math.max(1,r*.2),'#fff4f7');
    if(quality==='high'&&p.source!=='secondary'){g.strokeColor=color('#e9c98e');g.lineWidth=1;g.ellipse(q.x,q.y,r*1.4,r*.55);g.stroke();}continue;
   }
   this.line([[a.x,a.y],[q.x,q.y]],skillById[p.skill].color,p.skill==='rifle'?3:p.skill==='blade'?8:6);if(p.skill==='thermo'){this.ellipse(q.x,q.y,7,9,'#f9ba58');this.ellipse(q.x,q.y+1,3,5,'#fff0bc');}
  }
  for(const e of events)this.flashes.push({...e,age:0});this.flashes=this.flashes.slice(quality==='low'?-32:-90).filter(f=>f.age<.6);
  let label=0;
  for(const f of this.flashes){f.age+=delta;const p=this.point(f.x,f.y),q=this.point(f.tx??f.x,f.ty??f.y),alpha=Math.round(Math.max(0,1-f.age/.6)*255).toString(16).padStart(2,'0'),tint=f.quality?LUCKY_ORB.qualities.find(q=>q.id===f.quality)!.color:f.skill?skillById[f.skill].color:'#f6cf7c';
   if(f.type==='beam'||f.type==='chain'){
    const electric=f.type==='chain'||f.skill==='electro',dx=q.x-p.x,dy=q.y-p.y;
    const points=electric?Array.from({length:9},(_,n)=>{const off=n===0||n===8?0:Math.sin(n*12+f.id)*.035;return [p.x+dx*n/8+dy*off,p.y+dy*n/8-dx*off];}):[[p.x,p.y],[q.x,q.y]];
    this.line(points,tint+alpha,electric?4:Math.min(12,f.value??5));this.line(points,'#fff4dd'+alpha,electric?1.2:2);
   }
   if(f.type==='burst'){
    const progress=motion?.55+f.age*1.3:1,r=(f.value??25)*this.width/360*progress,ry=(f.value??25)*this.height/FIELD.height*progress;
    const hot=f.skill==='thermo'||f.skill==='fuel'||f.skill==='airdrop';
    if(hot){const spikes=Array.from({length:18},(_,n)=>{const a=n*Math.PI/9,radius=n%2?.53:.9+(n%3)*.05;return [p.x+Math.cos(a)*r*radius,p.y+Math.sin(a)*ry*radius];});this.poly(spikes,tint+Math.round(120*Math.max(0,1-f.age/.6)).toString(16).padStart(2,'0'),tint+alpha,1.5);this.ellipse(p.x,p.y,r*.3,ry*.3,'#ffe7a6'+alpha);}
    else {this.ellipse(p.x,p.y,r,ry,tint+Math.round(45*Math.max(0,1-f.age/.6)).toString(16).padStart(2,'0'));g.strokeColor=color(tint+alpha);g.lineWidth=1.5;g.ellipse(p.x,p.y,r,ry);g.stroke();}
    if(quality==='high')for(let n=0;n<7;n++){const a=n*2.4+f.id;this.line([[p.x+Math.cos(a)*r*.83,p.y+Math.sin(a)*ry*.83],[p.x+Math.cos(a)*r*1.06,p.y+Math.sin(a)*ry*1.06]],tint+alpha,1.5);}
   }
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
