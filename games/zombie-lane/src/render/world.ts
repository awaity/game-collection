import { Game, GATES, clamp } from '../core/game';
import type { GameEvent } from '../core/game';
import type { Platform } from '../platform/types';
import { Actors } from './actors';
import { ellipse, line, poly, rect, text, gun } from './draw';
interface Particle { x: number; z: number; vx: number; vz: number; life: number; max: number; color: string; size: number; }
interface Ring { x: number; z: number; age: number; radius: number; }
export class World {
  actors: Actors;
  particles: Particle[]=[];
  rings: Ring[]=[];
  recoil=0;
  shake=0;
  flash=0;
  upgrade=0;
  height=800;
  constructor(private platform: Platform) { this.actors=new Actors(platform); }
  project(x: number,z: number) { const s=1-z*.014;return {x:210+x*35*s,y:this.height*.795-z*this.height*.017,s}; }
  reset(){this.particles=[];this.rings=[];this.shake=0;this.flash=0;this.upgrade=0;}
  events(events: GameEvent[]) {
    for(const e of events){
      if(e.kind==='shot')this.recoil=.075;
      if(e.kind==='hit')this.burst(e.x,e.z,3,'#fff2ad',.25);
      if(e.kind==='kill')this.burst(e.x,e.z,e.value===3?32:9,'#8ca472',.55);
      if(e.kind==='blast'){this.rings.push({x:e.x,z:e.z,age:0,radius:e.value??2});this.burst(e.x,e.z,8,'#ffd26b',.4);this.shake=Math.max(this.shake,.07);}
      if(e.kind==='upgrade'){this.upgrade=1.1;this.burst(-2.55,12,24,'#65e1e3',.8);}
      if(e.kind==='damage')this.shake=.2;
      if(e.kind==='airstrike'){this.shake=.45;this.flash=.15;for(let z=2;z<32;z+=4){this.rings.push({x:1+(z%3),z,age:-(z/70),radius:4});this.burst(2,z,10,'#ffc968',.65);}}
      if(e.kind==='win'){this.upgrade=3;for(let z=0;z<32;z+=4)this.burst((z%7)-3,z,14,'#f5c451',2);}
    }
    if(this.particles.length>350)this.particles.splice(0,this.particles.length-350);
    if(this.rings.length>32)this.rings.splice(0,this.rings.length-32);
  }
  burst(x:number,z:number,count:number,color:string,life:number){
    for(let i=0;i<count;i++){const angle=i*2.39996+z;const speed=1+(i%5)*.8;this.particles.push({x,z,vx:Math.cos(angle)*speed,vz:Math.sin(angle)*speed,life,max:life,color,size:2+i%4});}
  }
  animate(dt:number){
    this.recoil=Math.max(0,this.recoil-dt);this.shake=Math.max(0,this.shake-dt);this.flash=Math.max(0,this.flash-dt);this.upgrade=Math.max(0,this.upgrade-dt);
    for(const p of this.particles){p.life-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.vz-=dt*2;}
    this.particles=this.particles.filter(p=>p.life>0);
    for(const r of this.rings)r.age+=dt;this.rings=this.rings.filter(r=>r.age<.55);
  }
  draw(ctx:CanvasRenderingContext2D,g:Game,height:number,time:number){
    this.height=height;
    ctx.save();
    if(!this.platform.reducedMotion&&this.shake>0)ctx.translate(Math.sin(time*90)*this.shake*9,Math.cos(time*77)*this.shake*6);
    this.background(ctx);
    this.road(ctx,g);
    // Props and actors share depth order; a distant zombie never covers a near one.
    const entities: {z:number;draw:()=>void}[]=[];
    for(const e of g.enemies)entities.push({z:e.z,draw:()=>{
      const p=this.project(e.x,e.z);
      this.actors.draw(ctx,e.kind,p.x,p.y,p.s*.83,time+e.wobble,g.time-e.hit<.06,g.phase!=='paused');
      if(e.kind==='brute'||(e.hp<e.maxHp&&e.kind!=='boss')){const y=p.y-65*p.s;rect(ctx,p.x-14*p.s,y,28*p.s,3*p.s,'#3b514b',1);rect(ctx,p.x-14*p.s,y,28*p.s*e.hp/e.maxHp,3*p.s,'#e9ad72',1);}
    }});
    if(g.gate)entities.push({z:12,draw:()=>this.gate(ctx,g)});
    if(g.gateIndex<4)entities.push({z:26,draw:()=>this.previewGate(ctx,g)});
    for(let z=3;z<36;z+=9)for(const side of [-1,1])entities.push({z,draw:()=>this.barricade(ctx,side*5,z)});
    entities.sort((a,b)=>b.z-a.z).forEach(e=>e.draw());
    if(g.phase==='ready'){
      const p=this.project(-2.55,12);ctx.globalAlpha=.7;line(ctx,[[p.x,p.y+20],[p.x,p.y+35],[p.x+4,p.y+31]],'#f9f8df',2);ctx.globalAlpha=1;
    }
    for(const b of g.bullets){const p=this.project(b.x,b.z),tail=this.project(b.x-b.vx*.022,b.z-b.vz*.022);ctx.save();ctx.lineCap='round';line(ctx,[[tail.x,tail.y-20*tail.s],[p.x,p.y-20*p.s]],b.tier===1?'#b6fbff':b.tier===2?'#ffb95c':'#fff7b6',b.tier===2?5:3);ctx.restore();}
    this.player(ctx,g,time);
    for(const r of this.rings){if(r.age<0)continue;const p=this.project(r.x,r.z);ctx.globalAlpha=1-r.age/.55;ctx.lineWidth=3;ctx.strokeStyle='#ffed9c';ctx.beginPath();ctx.ellipse(p.x,p.y-14*p.s,(r.age*1.7+.2)*r.radius*24*p.s,(r.age*1.7+.2)*r.radius*11*p.s,0,0,Math.PI*2);ctx.stroke();ellipse(ctx,p.x,p.y-17*p.s,Math.max(1,(.3-r.age)*100*p.s),Math.max(1,(.3-r.age)*75*p.s),'#ffe8a2');ctx.globalAlpha=1;}
    for(const fx of this.particles){const p=this.project(fx.x,fx.z);ctx.globalAlpha=clamp(fx.life/fx.max,0,1);rect(ctx,p.x,p.y-20-(1-fx.life/fx.max)*20,fx.size*p.s,fx.size*p.s,fx.color,1);ctx.globalAlpha=1;}
    if(this.flash>0&&!this.platform.reducedMotion)rect(ctx,0,0,420,height,`rgba(255,240,187,${this.flash*2})`);
    ctx.restore();
  }
  private background(ctx:CanvasRenderingContext2D){
    const h=this.height;
    const gradient=ctx.createLinearGradient(0,0,0,h);gradient.addColorStop(0,'#dce6d5');gradient.addColorStop(.4,'#bacdb7');gradient.addColorStop(1,'#819c86');ctx.fillStyle=gradient;ctx.fillRect(0,0,420,h);
    // An abandoned block seen above the overpass, softened by morning haze.
    for(let i=0;i<15;i++){
      const x=(i*47)%445-20,y=h*.1+(i%3)*21,bh=40+(i*31)%90,w=21+(i*13)%23;
      rect(ctx,x,y-bh,w,bh,'#a9beab',1);rect(ctx,x+4,y-bh+8,w-8,4,'#c8d7c2');
      for(let row=0;row<3;row++)for(let col=0;col<2;col++)rect(ctx,x+5+col*11,y-bh+19+row*15,5,7,'#93ab99');
    }
    rect(ctx,0,0,420,h*.19,'#dfe7d76b');
    // Rooftops below either edge of the elevated road.
    for(let i=0;i<7;i++){
      const z=3+i*5,p=this.project(i%2?-7.3:7.3,z),w=48*p.s,hh=42*p.s;
      poly(ctx,[[p.x-w,p.y],[p.x,p.y-hh],[p.x+w,p.y-hh*.6],[p.x+12,p.y+hh*.4]],i%2?'#91a68e':'#9fb099');
      poly(ctx,[[p.x-w,p.y],[p.x+12,p.y+hh*.4],[p.x+12,p.y+hh],[p.x-w,p.y+hh*.6]],'#718e7e');
      rect(ctx,p.x-w*.3,p.y-hh*.6,w*.4,hh*.3,'#b0bea5',2);
    }
  }
  private groundPoly(ctx:CanvasRenderingContext2D,points:number[][],color:string){poly(ctx,points.map(([x,z])=>{const p=this.project(x,z);return[p.x,p.y];}),color);}
  private road(ctx:CanvasRenderingContext2D,g:Game){
    this.groundPoly(ctx,[[-5.35,-7],[5.35,-7],[5.35,40],[-5.35,40]],'#758f7e');
    this.groundPoly(ctx,[[-4.8,-7],[4.8,-7],[4.8,40],[-4.8,40]],'#b8c5b5');
    this.groundPoly(ctx,[[-4.5,-5],[-.35,-5],[-.35,38],[-4.5,38]],'#99b6ac');
    this.groundPoly(ctx,[[0,-5],[4.5,-5],[4.5,38],[0,38]],'#bebcab');
    if(g.phase==='playing')this.groundPoly(ctx,g.side==='upgrade'?[[-4.5,-2],[-.35,-2],[-.35,14],[-4.5,14]]:[[0,-2],[4.5,-2],[4.5,14],[0,14]],g.side==='upgrade'?'#75c1b627':'#f0ce8c1c');
    for(let z=-5;z<40;z+=4){
      this.groundPoly(ctx,[[-.25,z],[-.12,z],[-.12,z+1.8],[-.25,z+1.8]],'#e8e4bd');
      for(const x of [-4.56,4.45])this.groundPoly(ctx,[[x,z],[x+.1,z],[x+.1,z+2.6],[x,z+2.6]],'#e1dfbd');
      this.groundPoly(ctx,[[-4.6,z],[4.6,z],[4.6,z+.04],[-4.6,z+.04]],'#718f7b33');
    }
    this.groundPoly(ctx,[[-4.7,-.9],[4.7,-.9],[4.7,-.45],[-4.7,-.45]],'#b96553');
    for(let x=-4.7;x<4.4;x+=.75)this.groundPoly(ctx,[[x,-.9],[x+.35,-.9],[x+.7,-.45],[x+.35,-.45]],'#ead0a0');
    for(const [x,label,color] of [[-2.6,'装备补给','#3c817a'],[2.2,'感染区域','#997c65']] as const){
      const p=this.project(x,34);ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.s,p.s*.8);text(ctx,label,0,0,17,color,900,'center');ctx.restore();
      for(const z of [4,18,29]){const q=this.project(x,z);ctx.save();ctx.translate(q.x,q.y);ctx.scale(q.s,q.s*.55);poly(ctx,[[-10,3],[-10,-1],[-3,-1],[-3,-8],[3,-8],[3,-1],[10,-1],[10,3],[0,12]],'#e6ead044');ctx.restore();}
    }
    const y=this.project(0,-2.7).y;text(ctx,'最 后 防 线',210,y,11,'#466b5e',800,'center');
  }
  private barricade(ctx:CanvasRenderingContext2D,x:number,z:number){
    const p=this.project(x,z),w=17*p.s,h=16*p.s;
    poly(ctx,[[p.x-w,p.y],[p.x+w,p.y],[p.x+w,p.y-h],[p.x-w,p.y-h]],'#6f8275');
    poly(ctx,[[p.x-w,p.y-h],[p.x+w,p.y-h],[p.x+w+5*p.s,p.y-h-5*p.s],[p.x-w+5*p.s,p.y-h-5*p.s]],'#d5d5b4');
    for(let i=-1;i<2;i++)poly(ctx,[[p.x+i*9*p.s,p.y],[p.x+(i*9+5)*p.s,p.y],[p.x+(i*9+10)*p.s,p.y-h],[p.x+(i*9+5)*p.s,p.y-h]],'#c0ae68');
  }
  private gate(ctx:CanvasRenderingContext2D,g:Game){
    const gate=g.gate!,config=g.gateConfig,p=this.project(gate.x,gate.z),s=p.s;
    ctx.save();ctx.translate(p.x,p.y);ctx.scale(s,s);
    ellipse(ctx,8,3,57,15,'#294f4340');
    // Equipment station: upright glass slab, metal feet and a solid bevel.
    poly(ctx,[[-56,0],[56,0],[62,-8],[-50,-8]],'#365e61');rect(ctx,-52,-112,104,106,'#19546a',5);
    poly(ctx,[[52,-112],[60,-120],[60,-10],[52,-6]],'#1b687a');
    poly(ctx,[[-52,-112],[-44,-120],[60,-120],[52,-112]],'#b0e3d9');
    rect(ctx,-47,-107,94,94,config.color,3);rect(ctx,-43,-103,86,50,'#e4f2de',3);
    text(ctx,config.title,0,-84,config.title.length>5?18:21,'#1b5156',900,'center');text(ctx,config.subtitle,0,-64,10,'#4b8583',600,'center');
    if(gate.kind==='gatling'||gate.kind==='cannon')gun(ctx,0,-34,gate.kind==='gatling'?1:2,.56,'#ecf2d1');
    else text(ctx,gate.kind==='double'?'Ⅱ':gate.kind==='repair'?'+':'↑',0,-35,28,'#e7f3d5',900,'center');
    rect(ctx,-46,-13,92,19,'#214e54',3);rect(ctx,-42,-10,84*gate.hp/gate.maxHp,4,'#f8d166',2);
    text(ctx,`${Math.ceil(gate.hp)}`,0,0,12,'#f0f6dd',800,'center');
    rect(ctx,-56,-110,6,109,'#d1e4cc',2);rect(ctx,50,-110,6,109,'#d1e4cc',2);
    for(const x of [-53,53]){ellipse(ctx,x,-101,2,2,'#547b71');ellipse(ctx,x,-10,2,2,'#547b71');}
    if(g.time-gate.hit<.055){ctx.globalAlpha=.35;rect(ctx,-46,-106,92,95,'#ffffff',3);ctx.globalAlpha=1;}
    ctx.restore();
  }
  private previewGate(ctx:CanvasRenderingContext2D,g:Game){
    const config=GATES[Math.min(g.gateIndex+1,GATES.length-1)],p=this.project(-2.55,26),s=p.s;
    ctx.save();ctx.translate(p.x,p.y);ctx.scale(s,s);ctx.globalAlpha=.8;
    ellipse(ctx,5,1,48,12,'#294f4329');rect(ctx,-43,-62,86,61,'#5f9d97',4);rect(ctx,-39,-58,78,45,'#bed9c5',2);
    text(ctx,'下一道补给',0,-45,10,'#517f73',700,'center');text(ctx,config.title,0,-27,16,'#37645e',900,'center');
    rect(ctx,-46,-60,5,65,'#d2e2cb',2);rect(ctx,41,-60,5,65,'#d2e2cb',2);ctx.restore();
  }
  private player(ctx:CanvasRenderingContext2D,g:Game,time:number){
    const p=this.project(g.x,0),aim=this.project(g.aimX,g.aimZ);
    ellipse(ctx,p.x,p.y+3,27,11,g.side==='upgrade'?'#4ccecd4a':'#f5d57b40');
    ctx.strokeStyle=g.side==='upgrade'?'#8df2ed':'#f5d57b';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,p.y+3,24,9,0,0,Math.PI*2);ctx.stroke();
    if(this.upgrade>0){ctx.globalAlpha=Math.min(1,this.upgrade)*.6;ctx.strokeStyle='#fff5b8';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(p.x,p.y,31+(1.1-Math.min(1.1,this.upgrade))*19,13,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
    this.actors.draw(ctx,'soldier',p.x,p.y,1.03,time,false,Math.abs(g.x-g.targetX)>.1);
    const angle=Math.atan2(aim.y-p.y,aim.x-p.x),recoil=this.recoil>0?2:0;
    ctx.save();ctx.translate(p.x+12,p.y-38);ctx.rotate(angle);ctx.translate(-recoil,0);
    rect(ctx,-6,-6,18,12,'#455953',3);rect(ctx,2,-5,25,10,g.tier===2?'#bf7b3c':'#657c70',2);
    if(g.tier===1){for(let i=-1;i<=1;i++)rect(ctx,18,-1.5+i*4,19,3,'#3c5653',1);rect(ctx,26,-7,5,14,'#8eada0',1);}
    else if(g.tier===2){rect(ctx,5,-9,26,18,'#e3a645',3);rect(ctx,26,-7,8,14,'#4c685c',1);}
    else{rect(ctx,21,-2,17,4,'#354d48',1);rect(ctx,10,-5,3,10,'#bdc6a8',1);}
    if(this.recoil>0){poly(ctx,[[35,0],[43,-9],[44,-3],[54,0],[44,4],[43,9]],g.tier===1?'#c8fcff':'#fff0a2');ellipse(ctx,41,0,4,3,'#fffced');}
    ctx.restore();
  }
}
