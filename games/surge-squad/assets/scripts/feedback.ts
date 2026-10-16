import {CONFIG,Game,Random,SurgeEvent} from './core';
export interface Particle{x:number;y:number;d:number;vx:number;vy:number;vd:number;life:number;size:number;color:string;kind:string;spin:number}
/** Bounded visual effects follow authoritative events; their RNG cannot affect combat. */
export class Feedback{
 private rng=new Random(47192);parts:Particle[]=[];popups:{text:string;x:number;d:number;y:number;life:number;color:string;scale:number}[]=[];
 rings:{x:number;d:number;color:string;max:number;life:number}[]=[];flights:{x:number;d:number;age:number;gold:boolean}[]=[];fans:(SurgeEvent&{age:number})[]=[];
 shake=0;flash=0;lastCellPop=-5;lastImpact=-5;
 clear(){this.parts=[];this.popups=[];this.rings=[];this.flights=[];this.fans=[];this.shake=this.flash=0;this.lastCellPop=this.lastImpact=-5}
 private particle(x:number,y:number,d:number,color:string,count=8,kind='spark',size=.20,force=1){for(let i=0;i<count&&this.parts.length<CONFIG.maxParticles;i++){const r=this.rng;this.parts.push({x,y,d,vx:r.range(-2.7,2.7)*force,vy:r.range(1,5)*force,vd:r.range(-2.5,2.5)*force,life:r.range(.25,.80),size:r.range(.6,1.4)*size,color,kind,spin:r.range(-5,5)})}}
 private popup(text:string,x:number,d:number,color:string,scale=1){if(this.popups.length<24)this.popups.push({text,x,d,color,scale,y:1.5,life:1})}
 private ring(x:number,d:number,color='#36dfff',max=3){if(this.rings.length<20)this.rings.push({x,d,color,max,life:.55})}
 event(ev:SurgeEvent,game:Game){
  const d=ev.d??game.distance,x=ev.x??0;
  if(ev.type==='plasma-impact'&&this.fans.length<36)this.fans.push({...ev,age:0});
  if(ev.type==='cell'){if(this.flights.length<32)this.flights.push({x,d,age:0,gold:!!ev.gold});this.particle(x,.60,d,ev.gold?'#ffe253':'#4adaff',ev.gold?18:3,'spark',ev.gold?.30:.17,.55);if(game.time-this.lastCellPop>.28){this.popup(ev.gold?'+99':'+1',x,d,ev.gold?'#ffe566':'#f7ee4e',ev.gold?.8:.5);this.lastCellPop=game.time}}
  if(ev.type==='gate-break'){this.particle(x,1,d,'#f1f2f4',40,'debris',.19,1.6);this.particle(x,.9,d,'#e2f5ff',20,'spark',.25,1);this.shake=Math.max(this.shake,.12);this.ring(x,d,'#e8f8ff',1.3)}
  if(ev.type==='recruit'||ev.type==='overcharge'){this.popup(`+${ev.value}`,x,game.distance,'#fff17b',1.15);this.ring(x,game.distance,'#ffc63c',1.5);this.particle(x,.5,game.distance,'#ffe35d',30,'spark',.25,1.6)}
  if(ev.type==='enemy-down')this.particle(x,.36,d,'#df344e',2,'debris',.12,1.1);
  if(ev.type==='impact'&&game.time-this.lastImpact>.045){this.particle(x,.75,d,'#ffd95a',4,'spark',.14,1);this.lastImpact=game.time}
  if(ev.type==='laser-on')this.shake=Math.max(this.shake,.065);
  if(ev.type==='boss-down'){this.particle(x,1.2,d,'#f3889b',45,'debris',.20,2.4);this.particle(x,1.5,d,'#60dcff',65,'spark',.35,2.2);this.ring(x,d,'#87eeff',5);this.shake=.30;this.popup('击破',x,d,'#fff1a6',1.2)}
  if(ev.type==='hurt'){this.shake=.34;this.flash=.4;this.popup(`−${ev.lost}`,x,game.distance,'#ff7a83',.85)}
  if(ev.type==='slam'){this.ring(x,d,'#ff345c',3.3);this.particle(x,.05,d,'#eb5365',30,'debris',.14,1.7);this.shake=.16}
  if(ev.type==='victory'){this.particle(0,3,game.distance,'#45d7ff',90,'spark',.34,3.1);this.particle(0,3,game.distance,'#ffd85d',90,'spark',.28,3.1)}
 }
 update(dt:number){this.shake=Math.max(0,this.shake-dt*.75);this.flash=Math.max(0,this.flash-dt);this.parts=this.parts.filter(p=>{p.life-=dt;if(p.life<=0)return false;p.x+=p.vx*dt;p.y+=p.vy*dt;p.d+=p.vd*dt;p.vy-=dt*10;if(p.y<.045){p.y=.045;p.vy=Math.abs(p.vy)*.27;p.vx*=.9;p.vd*=.9}return true});this.popups=this.popups.filter(p=>{p.y+=dt*.95;return(p.life-=dt)>0});this.rings=this.rings.filter(r=>(r.life-=dt)>0);this.flights=this.flights.filter(f=>(f.age+=dt)<.30);this.fans=this.fans.filter(f=>(f.age+=dt)<.14)}
}
