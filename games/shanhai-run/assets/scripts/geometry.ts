/** Original low-poly geometry, merged into a few meshes instead of hundreds of nodes. */
type Point=[number,number,number];
const identity=()=>[1,0,0,0,1,0,0,0,1,0,0,0];
const shades=new Map<string,number[]>();
export class Geometry {
  readonly positions:Float32Array;
  readonly colors:Float32Array;
  readonly indices:Uint16Array;
  count=0;
  private matrix=identity();
  private low=[Infinity,Infinity,Infinity];
  private high=[-Infinity,-Infinity,-Infinity];
  constructor(readonly capacity=60000){this.positions=new Float32Array(capacity*3);this.colors=new Float32Array(capacity*4);this.indices=Uint16Array.from({length:capacity},(_,i)=>i);}
  reset(){this.count=0;this.matrix=identity();this.low=[Infinity,Infinity,Infinity];this.high=[-Infinity,-Infinity,-Infinity];}
  private point(p:Point):Point {const m=this.matrix;return [m[0]*p[0]+m[3]*p[1]+m[6]*p[2]+m[9],m[1]*p[0]+m[4]*p[1]+m[7]*p[2]+m[10],m[2]*p[0]+m[5]*p[1]+m[8]*p[2]+m[11]];}
  at(x:number,y:number,z:number,sx:number,sy:number,sz:number,rx:number,ry:number,rz:number,draw:()=>void){
    const before=this.matrix,angles=[rx,ry,rz].map(n=>n*Math.PI/180),c=angles.map(Math.cos),s=angles.map(Math.sin);
    const rotate=([a,b,d]:Point):Point=>{const yy=b*c[0]-d*s[0],zz=b*s[0]+d*c[0],xx=a*c[1]+zz*s[1],z2=-a*s[1]+zz*c[1];return [xx*c[2]-yy*s[2],xx*s[2]+yy*c[2],z2];};
    const a=rotate([sx,0,0]),b=rotate([0,sy,0]),d=rotate([0,0,sz]);
    const next:number[]=[];
    for(const p of [a,b,d])for(let i=0;i<3;i++)next.push(before[i]*p[0]+before[i+3]*p[1]+before[i+6]*p[2]);
    next.push(...this.point([x,y,z]));this.matrix=next;draw();this.matrix=before;
  }
  triangle(a:Point,b:Point,c:Point,hex:string,unlit=false){
    if(this.count+3>this.capacity)throw Error('Shanhai geometry capacity exceeded');
    const points=[this.point(a),this.point(b),this.point(c)],u=points[1].map((v,i)=>v-points[0][i]),v=points[2].map((n,i)=>n-points[0][i]);
    const nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0],length=Math.hypot(nx,ny,nz)||1;
    const light=unlit?1:.70+Math.max(0,(nx*-.38+ny*.82+nz*.43)/length)*.30;
    if(!shades.has(hex)){const h=hex.replace('#','');shades.set(hex,[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).concat(h.length===8?parseInt(h.slice(6),16)/255:1));}
    const tint=shades.get(hex)!;
    for(const p of points){const index=this.count++;this.positions.set(p,index*3);this.colors.set([tint[0]*light,tint[1]*light,tint[2]*light,tint[3]],index*4);for(let i=0;i<3;i++){this.low[i]=Math.min(this.low[i],p[i]);this.high[i]=Math.max(this.high[i],p[i]);}}
  }
  quad(a:Point,b:Point,c:Point,d:Point,hex:string,unlit=false){this.triangle(a,b,c,hex,unlit);this.triangle(a,c,d,hex,unlit);}
  box(x:number,y:number,z:number,w:number,h:number,d:number,hex:string,rx=0,ry=0,rz=0){
    this.at(x,y,z,w,h,d,rx,ry,rz,()=>{const p:Point[]=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]];
      for(const [a,b,c,d]of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]])this.quad(p[a],p[b],p[c],p[d],hex);
    });
  }
  cone(x:number,y:number,z:number,top:number,bottom:number,height:number,hex:string,sides=8,rx=0,ry=0,rz=0){
    this.at(x,y,z,1,1,1,rx,ry,rz,()=>{for(let i=0;i<sides;i++){const a=i/sides*Math.PI*2,b=(i+1)/sides*Math.PI*2;
      const p:Point=[Math.cos(a)*bottom,-height/2,Math.sin(a)*bottom],q:Point=[Math.cos(b)*bottom,-height/2,Math.sin(b)*bottom],r:Point=[Math.cos(b)*top,height/2,Math.sin(b)*top],s:Point=[Math.cos(a)*top,height/2,Math.sin(a)*top];
      this.quad(p,q,r,s,hex);if(top>0)this.triangle([0,height/2,0],s,r,hex);if(bottom>0)this.triangle([0,-height/2,0],q,p,hex);
    }});
  }
  sphere(x:number,y:number,z:number,sx:number,sy:number,sz:number,hex:string,rings=5,sides=8){
    this.at(x,y,z,sx,sy,sz,0,0,0,()=>{const point=(a:number,b:number):Point=>[Math.sin(a)*Math.cos(b)*.5,Math.cos(a)*.5,Math.sin(a)*Math.sin(b)*.5];
      for(let r=0;r<rings;r++)for(let i=0;i<sides;i++){const a=r/rings*Math.PI,b=(r+1)/rings*Math.PI,c=i/sides*Math.PI*2,d=(i+1)/sides*Math.PI*2;this.quad(point(a,c),point(b,c),point(b,d),point(a,d),hex);}
    });
  }
  ring(x:number,y:number,z:number,radius:number,hole:number,hex:string,rotation=0,arc=1){
    this.at(x,y,z,1,1,1,0,rotation,0,()=>{const sides=12;for(let i=0;i<sides*arc;i++){const a=i/sides*Math.PI*2,b=(i+1)/sides*Math.PI*2;this.quad([Math.cos(a)*radius,Math.sin(a)*radius,0],[Math.cos(b)*radius,Math.sin(b)*radius,0],[Math.cos(b)*hole,Math.sin(b)*hole,0],[Math.cos(a)*hole,Math.sin(a)*hole,0],hex,true);}});
  }
  bounds(){return {minPos:{x:this.low[0],y:this.low[1],z:this.low[2]},maxPos:{x:this.high[0],y:this.high[1],z:this.high[2]}};}
  dynamic(){return {positions:this.positions.subarray(0,this.count*3),colors:this.colors.subarray(0,this.count*4),indices16:this.indices.subarray(0,this.count),...this.bounds()};}
  static(){return {positions:Array.from(this.positions.subarray(0,this.count*3)),colors:Array.from(this.colors.subarray(0,this.count*4)),indices:Array.from(this.indices.subarray(0,this.count)),...this.bounds()};}
}
