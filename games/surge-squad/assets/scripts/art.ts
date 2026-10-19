import {BufferAsset,Color,EffectAsset,Material,Mesh,Node,Quat,Texture2D,Vec3,Vec4,gfx,resources,utils} from 'cc';
import {GameView} from 'db://assets/collection/runtime';
import {CONFIG,Game,formation,playerPose,transformSocket} from './core';
import {Feedback} from './feedback';
interface Header {name:string;vertices:number;indices:number;offset:number;indexOffset:number}
const buffer=()=>new Promise<BufferAsset>((resolve,reject)=>resources.load('meshes',BufferAsset,(e,v)=>e?reject(e):resolve(v)));
const texture=(name:string)=>new Promise<Texture2D>((resolve,reject)=>resources.load(name+'/texture',Texture2D,(e,v)=>e?reject(e):resolve(v)));
const effect=()=>new Promise<EffectAsset>((resolve,reject)=>resources.load('surge',EffectAsset,(e,v)=>e?reject(e):resolve(v)));
const zFor=(distance:number)=>6-distance*.55;

/** One dynamic mesh for thousands of distant enemies; real individual HP stays in the core. */
class Sprites {
 readonly positions:Float32Array;readonly uvs:Float32Array;readonly indices:Uint16Array;readonly mesh:Mesh;
 count=0;private right=new Vec3();private up=new Vec3();
 constructor(readonly capacity:number){
  this.positions=new Float32Array(capacity*12);this.uvs=new Float32Array(capacity*8);this.indices=new Uint16Array(capacity*6);
  for(let i=0;i<capacity;i++)this.indices.set([i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3],i*6);
  this.mesh=utils.MeshUtils.createDynamicMesh(0,{positions:this.positions,uvs:this.uvs,indices16:this.indices},undefined,{maxSubMeshes:1,maxSubMeshVertices:capacity*4,maxSubMeshIndices:capacity*6});
 }
 begin(rotation?:Quat){this.count=0;if(rotation){Vec3.transformQuat(this.right,Vec3.RIGHT,rotation);Vec3.transformQuat(this.up,Vec3.UP,rotation)}else{this.right.set(1,0,0);this.up.set(0,0,-1)}}
 add(x:number,y:number,z:number,width:number,height:number,frame=0,frames=1){
  if(this.count===this.capacity)return;const p=this.count*12,t=this.count*8;
  for(let i=0;i<4;i++){const sx=(i===0||i===3?-.5:.5)*width,sy=(i<2?-.5:.5)*height;this.positions.set([x+this.right.x*sx+this.up.x*sy,y+this.right.y*sx+this.up.y*sy,z+this.right.z*sx+this.up.z*sy],p+i*3)}
  const u=frame/frames,v=(frame+1)/frames;this.uvs.set([u,1,v,1,v,0,u,0],t);this.count++;
 }
 segment(a:Vec3,b:Vec3,width:number){
  if(this.count===this.capacity)return;const forward=Vec3.cross(new Vec3(),this.right,this.up),edge=Vec3.cross(new Vec3(),Vec3.subtract(new Vec3(),b,a),forward).normalize().multiplyScalar(width/2),p=this.count*12;
  this.positions.set([a.x-edge.x,a.y-edge.y,a.z-edge.z,a.x+edge.x,a.y+edge.y,a.z+edge.z,b.x+edge.x,b.y+edge.y,b.z+edge.z,b.x-edge.x,b.y-edge.y,b.z-edge.z],p);this.uvs.set([0,0,1,0,1,1,0,1],this.count*8);this.count++;
 }
 draw(ui:GameView,id:string,material:Material){
  if(!this.count)return;
  this.mesh.updateSubMesh(0,{positions:this.positions.subarray(0,this.count*12),uvs:this.uvs.subarray(0,this.count*8),indices16:this.indices.subarray(0,this.count*6),minPos:{x:-20,y:-3,z:-140},maxPos:{x:20,y:10,z:30}});
  ui.meshNode(id,this.mesh,material,0,0,0);
 }
}
export class SurgeArt {
 readonly feedback=new Feedback();private meshes=new Map<string,Mesh>();private groups=new Map<string,string[]>();private materials=new Map<string,Material>();
 private arcs=new Sprites(2048);private crowd=new Sprites(3600);private shadows=new Sprites(3900);private fxMaterials=new Map<string,Material>();
 private constructor(private ui:GameView,source:ArrayBuffer,fx:EffectAsset,world:Texture2D,crowd:Texture2D,road:Texture2D){
  const bytes=new DataView(source),length=bytes.getUint32(0,true),header:Header[]=JSON.parse(String.fromCharCode(...new Uint8Array(source,4,length))),base=Math.ceil((4+length)/4)*4;
  for(const item of header){
   const positions:number[]=[],colors:number[]=[],uvs:number[]=[],normals:number[]=[],tangents:number[]=[];
   for(let i=0;i<item.vertices;i++){const p=base+item.offset+i*24;positions.push(bytes.getFloat32(p,true),bytes.getFloat32(p+4,true),bytes.getFloat32(p+8,true));for(let k=0;k<4;k++)colors.push(bytes.getUint8(p+12+k)/255);uvs.push(bytes.getUint16(p+16,true)/65535,bytes.getUint16(p+18,true)/65535);normals.push(bytes.getInt8(p+21)/127,bytes.getInt8(p+22)/127,bytes.getInt8(p+23)/127);tangents.push(bytes.getUint8(p+20),0,0,0)}
   this.meshes.set(item.name,utils.createMesh({positions,colors,uvs,normals,tangents,indices:Array.from(new Uint16Array(source,base+item.indexOffset,item.indices))}));
   const group=item.name.split('/')[0];if(!this.groups.has(group))this.groups.set(group,[]);this.groups.get(group)!.push(item.name);
  }
  for(const name of ['world','road','vanguard','raider','brute','titan','crowd','shadow','projection','decal','beam','arc']){
   const mat=new Material(),actor=['vanguard','raider','brute','titan'].includes(name);
   mat.initialize({effectAsset:fx,defines:{USE_SKIN:name==='vanguard',USE_BEAM:name==='beam',USE_PROJECTION:name==='projection',USE_INSTANCING:!['crowd','shadow','arc'].includes(name),USE_GAIT:actor,USE_COLOR:!['crowd','shadow','beam','arc'].includes(name),USE_CROWD:name==='crowd',USE_SHADOW:name==='shadow',USE_ROAD:name==='road'}});
   if(name!=='arc')mat.setProperty('mainTexture',name==='crowd'?crowd:name==='road'?road:world);
   if(name==='projection')mat.setProperty('mainColor',new Color().fromHEX('#51556dff'));
   if(name==='arc'){mat.setProperty('mainColor',new Color().fromHEX('#50dfffc9'));mat.overridePipelineStates({depthStencilState:{depthWrite:false}})}
   if(name==='decal'||name==='beam')mat.overridePipelineStates({depthStencilState:{depthWrite:false}});
   if(name==='shadow')mat.overridePipelineStates({depthStencilState:{depthWrite:false},blendState:{targets:[{blend:true,blendSrc:gfx.BlendFactor.SRC_ALPHA,blendDst:gfx.BlendFactor.ONE_MINUS_SRC_ALPHA}]}});
   this.materials.set(name,mat);
  }
  this.meshes.set('fx',utils.createMesh({positions:[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],uvs:[0,0,1,0,1,1,0,1],indices:[0,1,2,0,2,3]}));
 }
 static async load(ui:GameView){const[,b,f,w,c,r]=await Promise.all([ui.ready,buffer(),effect(),texture('world-atlas'),texture('crowd'),texture('road')]);return new SurgeArt(ui,b.buffer(),f,w,c,r)}
 private mesh(id:string,name:string,x:number,y:number,z:number,sx=1,sy=1,sz=1,material='world'){
  return this.ui.meshNode(id,this.meshes.get(name)!,this.materials.get(material)!,x,y,z,sx,sy,sz);
 }
 private actor(id:string,group:string,x:number,y:number,z:number,scale=1,yaw=0,roll=0){for(const part of this.groups.get(group)!){this.mesh(`${id}:${part}`,part,x,y,z,scale,scale,scale,group).setRotationFromEuler(0,yaw*180/Math.PI,roll*180/Math.PI);if(group!=='raider')this.mesh(`projection:${id}:${part}`,part,x,y,z,scale,scale,scale,'projection').setRotationFromEuler(0,yaw*180/Math.PI,roll*180/Math.PI)}}
 private glow(id:string,x:number,y:number,z:number,width:number,height:number,kind:number,hex:string,flat=false){
  let m=this.fxMaterials.get(id);if(!m){m=new Material();m.initialize({effectAsset:this.ui.effect,defines:{USE_FX:true}});m.overridePipelineStates({depthStencilState:{depthWrite:false},blendState:{targets:[{blend:true,blendSrc:gfx.BlendFactor.SRC_ALPHA,blendDst:gfx.BlendFactor.ONE}]}});this.fxMaterials.set(id,m)}
  m.setProperty('mainColor',new Color().fromHEX(hex));m.setProperty('flashParams',new Vec4(0,kind,0,0));const n=this.ui.meshNode(id,this.meshes.get('fx')!,m,x,y,z,width,height,1);if(flat)n.setRotationFromEuler(-90,0,0);else n.setRotation(this.ui.camera.node.rotation);return n;
 }
 draw(game:Game,time:number,quality:string){
  const u=this.ui,p=game.player,renderDistance=u.camera.fov<=36?72:u.camera.fov<50?120:160;
  this.materials.get('vanguard')!.setProperty('mainColor',new Color().fromHEX(game.skinColor));
  this.materials.get('road')!.setProperty('animation',new Vec4(game.distance,0,0,0));this.mesh('road','road',0,-.39,-90,1,1,1,'road');
  u.shape('sea','box',['#07101e','#07101e','#07101e','#34566c','#705744','#28264c'][game.level.index],0,-1.8,-80,600,.01,600);
  for(const side of [-1,1]){u.shape('rail'+side,'box','#a6aab8',side*5.38,.13,-90,.20,.36,280);u.shape('border'+side,'box','#d2d8e7',side*5.22,.025,-90,.10,.03,280)}
  if(game.level.index>=3)for(let i=0;i<12;i++)for(const side of[-1,1])u.shape('map-object'+i+'/'+side,game.level.index===3?'cone':game.level.index===4?'cylinder':'box',['#a6dce6','#b58c59','#7d7cb1'][game.level.index-3],side*(8+(i%3)),1,-((i*15-game.distance*.55)%170),game.level.index===3?3:1.7,3+(i%3),3);
  let blue=0,gold=0,lastBlue=Infinity,lastGold=Infinity;
  for(const c of game.level.cells){const gap=c.d-game.distance;if(gap>renderDistance+12)break;if(gap<-28||c.taken)continue;const z=zFor(gap);
   if(c.kind==='blue'&&blue<260){if(lastBlue-z<.435)continue;lastBlue=z;this.mesh(`blue-base${blue}`,'blueBase',0,.065,z);this.mesh(`blue-body${blue}`,'blueBody',0,.27,z);this.mesh(`blue-shadow${blue}`,'blueBody',0,.27,z,1,1,1,'projection');this.mesh(`blue-top${blue}`,'blueTop',0,.541,z).setRotationFromEuler(-90,0,0);blue++;}
   else if(c.kind==='gold'&&gold<48){if(lastGold-z<1.30)continue;lastGold=z;this.mesh(`gold-body${gold}`,'goldBodies',3.18,.97,z).setRotationFromEuler(0,0,90);this.mesh(`gold-band${gold}`,'goldBand',3.18,.97,z).setRotationFromEuler(0,0,90);this.mesh(`gold-top${gold}`,'goldTop',3.18,1.59,z,.82,.73,1,'decal').setRotationFromEuler(-90,0,0);for(const side of[-1,1])this.mesh(`gold-cap${gold}/${side}`,'goldCaps',3.18+1.4*side,.97,z).setRotationFromEuler(0,0,90);gold++;}
  }
  const front=zFor(Math.max(-12,game.level.cells.find(c=>c.kind==='gold')!.d-game.distance))+.85,back=zFor(CONFIG.viewDistance+60);
  this.mesh('deck','goldDeck',3.18,.18,(front+back)/2,1,1,Math.max(1,front-back));
  game.level.gates.forEach((g,i)=>{const gap=g.d-game.distance;if(gap<=-10||['taken','missed'].includes(g.state))return;const z=zFor(gap),h=g.value===1?1:2.18;
   if(g.state==='sealed'){this.mesh(`gate${i}/shadow`,`gate${i}/box`,g.x,h/2,z,1,1,1,'projection');this.mesh(`gate${i}/box`,`gate${i}/box`,g.x,h/2,z);this.mesh(`gate${i}/label`,`gate${i}/label`,g.x,h*.5,z+.626);this.mesh(`gate${i}/band`,`gate${i}/band`,g.x,h+.01,z);}
   else {this.mesh(`gate${i}/shadow`,`gate${i}/token`,g.x,.76+Math.sin(time*4.2)*.08,z+.06,1,1,1,'projection').setRotationFromEuler(0,Math.sin(time*2)*.08*180/Math.PI,0);this.mesh(`gate${i}/token`,`gate${i}/token`,g.x,.76+Math.sin(time*4.2)*.08,z+.06).setRotationFromEuler(0,Math.sin(time*2)*.08*180/Math.PI,0);}
  });
  for(const name of ['vanguard','raider'])this.materials.get(name)!.setProperty('animation',new Vec4(time,name==='raider'?.7:1,0,0));
  this.arcs.begin(u.camera.node.rotation);this.shadows.begin();const slots=formation(p.troops);
  slots.forEach((slot,i)=>{const pose=playerPose(p,slot,i,time,['playing','paused'].includes(game.phase));if(!(p.invincible>0&&Math.floor(time*14)%2===0))this.actor(`player${i}`,'vanguard',pose.x,pose.y,pose.z,pose.scale,pose.yaw,pose.roll);this.shadows.add(pose.x,.023,pose.z+.15,1.15,1.02);const muzzle=transformSocket(pose),charge=p.energy/CONFIG.energyMax;
   if(game.skinMark)u.shape('skin-badge'+i,'sphere',game.skinColor,pose.x,pose.y+1.35,pose.z,.28,.18,.28);
   if(charge>.03){const r=.11+charge*.17;this.glow('orb-core'+i,pose.x,pose.y+1.55,pose.z+.08,r*2.4,r*2.4,1,'#4bf2ffdd');this.glow('orb-glow'+i,pose.x,pose.y+1.55,pose.z+.08,.38+charge*.58,.42+charge*.58,1,'#08c8ffb8');this.glow('ground-charge'+i,pose.x,.044,pose.z,.75+charge*.52,.95+charge*.40,1,'#1199ff50',true)}
   if(charge>.03&&(p.charging||charge>.87)){const radius=.38+charge*.14;for(let j=0;j<20;j++){const at=(angle:number)=>{const n=Math.sin(angle*5+time*21+i)*.065;return new Vec3(pose.x+Math.cos(angle)*(radius+n),pose.y+1.44+Math.sin(angle)*.36,pose.z+.10+Math.sin(angle*2+time*7+i)*.16)};this.arcs.segment(at(j/20*Math.PI*2),at((j+1)/20*Math.PI*2),.018)}}
   if(p.laser)this.glow('muzzle'+i,muzzle.x,muzzle.y,muzzle.z,1.22,1.52,1,'#16c9ffb8');else if(p.shotClock>.11){const r=.29+(p.shotClock-.11)*4;this.glow('muzzle'+i,muzzle.x,muzzle.y,muzzle.z,r,r*1.3,1,'#ffc64aff')}
  });
  this.crowd.begin(u.camera.node.rotation);let near=0;const limit=quality==='low'?48:quality==='medium'?120:200;
  for(let i=game.enemyStart;i<game.level.enemies.length;i++){
   const e=game.level.enemies[i],gap=e.d-game.distance;if(gap>renderDistance)break;if(gap<-5||gap>90&&e.id%2!==0)continue;
   let size=e.size;if(e.hp<=0){const age=time-e.deadAt;if(age>.28)continue;size*=Math.max(.001,1-age/.28)}const z=zFor(gap),bob=Math.sin(time*11+e.phase)*.021;
   if(gap<26&&near<limit)this.actor(`enemy${near++}`,'raider',e.x,bob+.012,z,size,Math.sin(time*2+e.phase)*.10);
   else{const phase=time*11+z*2.1+e.x*3.4,frame=((Math.floor(phase*1.27323954)%8)+8)%8;this.crowd.add(e.x,bob+.012+.30*size,z,.80*size,.88*size,frame,8)}
   if(gap<64)this.shadows.add(e.x,.016,z,.31*size,.35*size);
  }
  this.crowd.draw(u,'crowd',this.materials.get('crowd')!);
  game.level.bosses.forEach((boss,i)=>{const gap=boss.d-game.distance,age=time-boss.slamAt;let scale=boss.size;if(boss.hp<=0)scale*=Math.max(0,1-(time-boss.deadAt)/.65);if(gap>160||gap<-10||scale<=0)return;
   const action=boss.warning?Math.sin(Math.min(1,(1-boss.warning.remaining/boss.warning.total)*1.2)*Math.PI/2):age<.20?Math.cos(Math.max(0,age)/.20*Math.PI/2):0;
   this.materials.get(boss.type)!.setProperty('animation',new Vec4(time,1.9,action,boss.hitFlash));this.actor('boss'+i,boss.type,boss.x,.02+Math.sin(time*4+i)*.05,zFor(gap),scale,Math.sin(time*.8)*.04,boss.warning?Math.sin(time*12)*.03:0);this.shadows.add(boss.x,.022,zFor(gap),2*scale,1.8*scale);
   if(boss.warning)u.shape('warning'+i,'box','#ff34543b',boss.warning.x,.028,2,boss.warning.width,.005,25);
  });
  this.shadows.draw(u,'shadows',this.materials.get('shadow')!);
  game.bullets.forEach((b,i)=>{const trail=Math.min(2.65,Math.max(.12,b.d-(b.originD??b.d-2.65))),end=new Vec3(b.x,b.y,zFor(b.d-game.distance)),start=new Vec3(b.x-b.slope*trail,b.y-b.ySlope*trail,end.z+trail*.55),middle=Vec3.add(new Vec3(),start,end).multiplyScalar(.5);const node=u.shape('bullet-core'+i,'box','#fff28a',middle.x,middle.y,middle.z,.045,.045,Vec3.distance(start,end));node.lookAt(end);this.glow('bullet-head'+i,end.x,end.y,end.z,.38,.38,1,'#ffd352ff');});
  this.materials.get('beam')!.setProperty('animation',new Vec4(time,0,0,0));
  if(p.laser)game.beams.forEach((beam,i)=>{
   const start=new Vec3(beam.origin.x,beam.origin.y,beam.origin.z),end=new Vec3(beam.x,beam.y,zFor(beam.d-game.distance)),middle=Vec3.add(new Vec3(),start,end).multiplyScalar(.5),length=Vec3.distance(start,end);
   const node=this.mesh('beam'+i,'fx',middle.x,middle.y,middle.z,1.15+.05*Math.sin(time*27+i),length,1,'beam');node.setRotation(Quat.rotationTo(new Quat(),Vec3.UP,Vec3.subtract(new Vec3(),end,start).normalize()));
   if(beam.hit)this.glow('beam-impact'+i,end.x,end.y,end.z,1.34,1.50,1,'#29e6ffbd');
  });
  const f=this.feedback;
  f.parts.forEach((v,i)=>{const size=v.size*Math.min(1,v.life*4);if(v.kind==='debris')u.shape('debris'+i,'box',v.color,v.x,v.y,zFor(v.d-game.distance),size,size,size).setRotationFromEuler(time*v.spin*57.3,time*v.spin*.7*57.3,v.spin*57.3);else this.glow('spark'+i,v.x,v.y,zFor(v.d-game.distance),size*2,size*2,1,v.color)});
  f.rings.forEach((v,i)=>{const size=((1-v.life/.55)*v.max+.1)*2,alpha=Math.round(v.life/.55*.70*255).toString(16).padStart(2,'0');this.glow('ring'+i,v.x,.07,zFor(v.d-game.distance),size,size,2,v.color+alpha,true)});
  f.flights.forEach((v,i)=>{const t=v.age/.30,e=t*t*(3-2*t),size=.70*(1-t)+.10;this.mesh('flight'+i,'blueBody',v.x+(p.x-v.x)*e,.55+e+Math.sin(t*Math.PI)*.52,zFor(v.d-game.distance)*(1-e)+6.18*e,size,size,size).setRotationFromEuler(t*.9*57.3,t*1.9*57.3,Math.sin(t*Math.PI)*.25*57.3)});
  let line=0;for(const fan of f.fans)for(const target of fan.arcs??[])for(let segment=0;segment<3&&line<2048;segment++){
   const at=(t:number)=>{const jitter=t>0&&t<1?Math.sin(t*29+fan.time*21)*.19:0;return new Vec3(fan.x!+(target.x-fan.x!)*t,fan.y!+(target.y-fan.y!)*t+jitter,zFor(fan.d!-game.distance)+(zFor(target.d-game.distance)-zFor(fan.d!-game.distance))*t+jitter*.7)};
   const a=at(segment/3),b=at((segment+1)/3);this.arcs.segment(a,b,.018);line++;
  }
  this.arcs.draw(u,'arcs',this.materials.get('arc')!);
  f.popups.forEach((v,i)=>{const pos=u.camera.convertToUINode(new Vec3(v.x,v.y,zFor(v.d-game.distance)),u.canvas);u.text('pickup'+i,v.text,pos.x,pos.y,18*v.scale,v.color,80).isBold=true});

 }
 destroy(){for(const m of Array.from(this.meshes.values()))m.destroy();for(const m of Array.from(this.materials.values()).concat(Array.from(this.fxMaterials.values())))m.destroy();this.arcs.mesh.destroy();this.crowd.mesh.destroy();this.shadows.mesh.destroy()}
}
