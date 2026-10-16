interface Position{x:number;z:number}
interface Zone extends Position{width:number;depth:number;onEnter?:()=>void;onExit?:()=>void;onStay?:(dt:number)=>void}
/** Axis-aligned zone overlap; inventory height never affects contact. */
export class TriggerZone{
 inside=false;readonly x:number;readonly z:number;readonly width:number;readonly depth:number;
 private onEnter?:()=>void;private onExit?:()=>void;private onStay?:(dt:number)=>void;
 constructor(zone:Zone){this.x=zone.x;this.z=zone.z;this.width=zone.width;this.depth=zone.depth;this.onEnter=zone.onEnter;this.onExit=zone.onExit;this.onStay=zone.onStay}
 contains(p:Position,r=.32){return Math.abs(p.x-this.x)<=this.width/2+r&&Math.abs(p.z-this.z)<=this.depth/2+r}
 update(p:Position,dt:number,r=.32){const next=this.contains(p,r);if(next&&!this.inside)this.onEnter?.();if(!next&&this.inside)this.onExit?.();this.inside=next;if(next)this.onStay?.(dt)}
 reset(){this.inside=false}
}
