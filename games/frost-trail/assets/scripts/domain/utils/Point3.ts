/** Lightweight effect coordinates; no browser or rendering dependency. */
export class Point3{
 constructor(public x=0,public y=0,public z=0){}
 set(x:number,y:number,z:number){this.x=x;this.y=y;this.z=z;return this}
 copy(p:{x:number;y:number;z:number}){return this.set(p.x,p.y,p.z)}
 clone(){return new Point3(this.x,this.y,this.z)}
}
