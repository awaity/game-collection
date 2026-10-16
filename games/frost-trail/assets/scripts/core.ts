/** Minimal runnable milestone; the complete reference world follows this loop. */
export type Resource='wood'|'raw'|'cooked';
export const STATIONS={forest:{x:-8.4,z:0},hunt:{x:0,z:8.6},fire:{x:1.65,z:.6},market:{x:0,z:-4.45}};
export class Camp{
 x=-2.2;z=2.1;target={x:this.x,z:this.z};bag:Resource[]=[];fuel=0;cash=0;counter=0;paused=false;time=0;timer=0;cooking=0;sold=0;
 aim(x:number,z:number){if(Number.isFinite(x)&&Number.isFinite(z))this.target={x:Math.max(-16,Math.min(16,x)),z:Math.max(-14,Math.min(16,z))}}
 gather(type:Resource){if(this.bag.length+(this.cooking>0?1:0)>=36)return false;this.bag.push(type);return true}
 cook(){if(this.cooking||!this.bag.includes('raw')||(!this.fuel&&!this.bag.includes('wood')))return false;if(!this.fuel){this.bag.splice(this.bag.indexOf('wood'),1);this.fuel=3}this.fuel--;this.bag.splice(this.bag.indexOf('raw'),1);this.cooking=1;return true}
 step(){if(this.paused)return;this.time+=1/60;const dx=this.target.x-this.x,dz=this.target.z-this.z,d=Math.hypot(dx,dz);if(d>.03){const step=Math.min(d,4.5/60);this.x+=dx/d*step;this.z+=dz/d*step;return}this.timer+=1/60;
  if(this.cooking>0){this.cooking=Math.max(0,this.cooking-1/60);if(!this.cooking)this.gather('cooked')}
  const near=(key:keyof typeof STATIONS)=>Math.hypot(this.x-STATIONS[key].x,this.z-STATIONS[key].z)<1.5;
  if(near('forest')&&this.timer>=.36){this.gather('wood');this.timer=0}if(near('hunt')&&this.timer>=.44){this.gather('raw');this.timer=0}if(near('fire'))this.cook();
  if(near('market')&&this.timer>=.1){const i=this.bag.indexOf('cooked');if(i>=0){this.bag.splice(i,1);this.counter+=24;this.sold++}else if(this.counter){this.cash+=Math.min(24,this.counter);this.counter-=Math.min(24,this.counter)}this.timer=0}
 }
}
