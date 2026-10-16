/** Small transform adapters for the reference animation math; all drawing uses Creator meshes. */
import{Mat4,Quat,Vec3}from'cc';
export class Euler{constructor(public x=0,public y=0,public z=0,public order='XYZ'){}set(x:number,y:number,z:number,order='XYZ'){this.x=x;this.y=y;this.z=z;this.order=order;return this}}
export class Rotation extends Quat{
 changed=false;
 setFromEuler(e:Euler){const cx=Math.cos(e.x/2),cy=Math.cos(e.y/2),cz=Math.cos(e.z/2),sx=Math.sin(e.x/2),sy=Math.sin(e.y/2),sz=Math.sin(e.z/2);this.set(e.order==='ZYX'?sx*cy*cz-cx*sy*sz:sx*cy*cz+cx*sy*sz,e.order==='ZYX'?cx*sy*cz+sx*cy*sz:cx*sy*cz-sx*cy*sz,e.order==='ZYX'?cx*cy*sz-sx*sy*cz:cx*cy*sz+sx*sy*cz,cx*cy*cz-(e.order==='ZYX'?-1:1)*sx*sy*sz);this.changed=true;return this}
 identity(){Quat.identity(this);this.changed=true;return this}
 setFromUnitVectors(a:Vec3,b:Vec3){Quat.rotationTo(this,a,b);this.changed=true;return this}
}
export class PoseMatrix{
 readonly m=new Mat4();
 makeRotationFromEuler(e:Euler){return this.makeRotationFromQuaternion(new Rotation().setFromEuler(e))}
 makeRotationFromQuaternion(q:{x:number;y:number;z:number;w:number}){Mat4.fromQuat(this.m,new Quat(q.x,q.y,q.z,q.w));return this}
 makeRotationX(a:number){return this.makeRotationFromEuler(new Euler(a,0,0))}
 makeRotationY(a:number){return this.makeRotationFromEuler(new Euler(0,a,0))}
 makeRotationZ(a:number){return this.makeRotationFromEuler(new Euler(0,0,a))}
 makeTranslation(x:number,y:number,z:number){Mat4.fromTranslation(this.m,new Vec3(x,y,z));return this}
 makeScale(x:number,y:number,z:number){Mat4.fromScaling(this.m,new Vec3(x,y,z));return this}
 scale(v:Vec3){Mat4.scale(this.m,this.m,v);return this}
 setPosition(x:number,y:number,z:number){this.m.m12=x;this.m.m13=y;this.m.m14=z;return this}
 multiply(v:PoseMatrix){Mat4.multiply(this.m,this.m,v.m);return this}
 multiplyMatrices(a:PoseMatrix,b:PoseMatrix){Mat4.multiply(this.m,a.m,b.m);return this}
}
export class PoseColor{
 constructor(public r=1,public g=1,public b=1){}
 setRGB(r:number,g:number,b:number){this.r=r;this.g=g;this.b=b;return this}
 setHex(h:number){const c=(v:number)=>{const s=v/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4};return this.setRGB(c(h>>16&255),c(h>>8&255),c(h&255))}
 multiplyScalar(n:number){this.r*=n;this.g*=n;this.b*=n;return this}
 toArray(){return[this.r,this.g,this.b]}
}
export class Transform{
 position=new Vec3();rotation=new Euler();scale=new Vec3(1,1,1);quaternion=new Rotation();matrix=new PoseMatrix();
 updateMatrix(){const q=this.quaternion.changed?this.quaternion:new Rotation().setFromEuler(this.rotation);Mat4.fromRTS(this.matrix.m,q,this.position,this.scale);this.quaternion.changed=false;return this}
}
export class Surface{
 color=new PoseColor();emissive=new PoseColor(0,0,0);opacity=1;id=-1;
 constructor(values:any={}){if(values.color!==undefined)this.color.setHex(values.color);if(values.emissive!==undefined)this.emissive.setHex(values.emissive);if(values.opacity!==undefined)this.opacity=values.opacity;Object.assign(this,{values})}
 values:any;
}
export class RenderNode extends Transform{
 flames:any;particles:any;wheel=false;phases:number[]=[];visible=true;children:RenderNode[]=[];instances:Mat4[]=[];colors:number[][]=[];count=0;instanced=false;instanceMatrix={count:1000,needsUpdate:false};instanceColor={needsUpdate:false};material=new Surface();geometry=-1;world=new Mat4();sprite=false;readonly id=RenderNode.next++;static next=0;
 constructor(geometry=-1,material=new Surface()){super();this.geometry=geometry;this.material=material}
 setMatrixAt(i:number,m:PoseMatrix){(this.instances[i]??=new Mat4()).set(m.m);this.instanced=true}
 setColorAt(i:number,c:PoseColor){this.colors[i]=c.toArray()}
}
