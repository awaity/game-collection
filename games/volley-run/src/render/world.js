const T=globalThis.THREE;
const C=hex=>new T.Color(hex).convertSRGBToLinear();
const tmp=new T.Object3D(), m1=new T.Matrix4(),m2=new T.Matrix4(),matRoot=new T.Matrix4();
function std(color,roughness=.55,metalness=0){return new T.MeshStandardMaterial({color:C(color),roughness,metalness});}
function basic(color,extra={}){return new T.MeshBasicMaterial({color:C(color),...extra});}
function rounded(w,h,d,r=.08){
 const g=new T.BoxGeometry(w,h,d,4,4,4),p=g.attributes.position,n=g.attributes.normal;
 for(let i=0;i<p.count;i++){
  const v=new T.Vector3().fromBufferAttribute(p,i),q=v.clone().clamp(new T.Vector3(-w/2+r,-h/2+r,-d/2+r),new T.Vector3(w/2-r,h/2-r,d/2-r)),dir=v.clone().sub(q).normalize();v.copy(q).addScaledVector(dir,r);p.setXYZ(i,v.x,v.y,v.z);n.setXYZ(i,dir.x,dir.y,dir.z);
 }return g;
}
function mesh(g,m,parent,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function canvasTexture(factory,w,h,draw){const c=factory(w,h);draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;}
function labelTexture(factory,text,theme='blue',sub=''){
 return canvasTexture(factory,512,176,(ctx,w,h)=>{
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 112px Arial, sans-serif';ctx.lineJoin='round';
  ctx.strokeStyle=theme==='red'?'#742b31':'#17374b';ctx.lineWidth=13;ctx.strokeText(text,w/2,76);ctx.fillStyle='#ffffff';ctx.fillText(text,w/2,76);
  if(sub){ctx.font='bold 23px Arial, sans-serif';ctx.strokeStyle='#163d59';ctx.lineWidth=4;ctx.strokeText(sub,w/2,147);ctx.fillStyle=theme==='gold'?'#fff0a5':'#ecfbff';ctx.fillText(sub,w/2,147);}
 });
}
function spriteLabel(factory,text,width=2,height=.8,theme='blue',sub=''){
 const map=labelTexture(factory,text,theme,sub),s=new T.Sprite(new T.SpriteMaterial({map,transparent:true,depthWrite:false,toneMapped:false}));s.scale.set(width,height,1);s.userData.factory=factory;s.userData.text=text+'|'+sub;s.renderOrder=5;return s;
}
function updateLabel(s,text,theme='blue',sub=''){
 const key=text+'|'+sub;if(s.userData.text===key)return;const old=s.material.map;s.material.map=labelTexture(s.userData.factory,text,theme,sub);s.userData.text=key;old.dispose();
}
function mergeGeometry(items){
 const arrays={position:[],normal:[],color:[]};let count=0;
 for(const [g0,color,pos,scale,rot] of items){
  const g=g0.index?g0.toNonIndexed():g0;
  const matrix=new T.Matrix4().compose(new T.Vector3(...(pos||[0,0,0])),new T.Quaternion().setFromEuler(new T.Euler(...(rot||[0,0,0]))),new T.Vector3(...(scale||[1,1,1])));g.applyMatrix4(matrix);
  const c=C(color),a=new Float32Array(g.attributes.position.count*3);for(let i=0;i<a.length;i+=3){a[i]=c.r;a[i+1]=c.g;a[i+2]=c.b;}
  arrays.position.push(g.attributes.position.array);arrays.normal.push(g.attributes.normal.array);arrays.color.push(a);count+=a.length;
 }
 const out=new T.BufferGeometry();for(const [key,values] of Object.entries(arrays)){const a=new Float32Array(count);let offset=0;for(const v of values){a.set(v,offset);offset+=v.length;}out.setAttribute(key,new T.BufferAttribute(a,3));}return out;
}
/** Instanced articulated actors. Presentation never writes simulation state. */
class Actors {
 constructor(scene,model,max,scale=1){
  this.parts=[];this.scale=scale;this.motion=new Map();model.updateMatrixWorld(true);
  model.traverse(o=>{if(!o.isMesh)return;
   const material=o.material.clone();material.envMapIntensity=.42;
   const im=new T.InstancedMesh(o.geometry,material,max);im.instanceMatrix.setUsage(T.DynamicDrawUsage);
   im.setColorAt(0,new T.Color(1,1,1));im.castShadow=true;im.receiveShadow=true;im.frustumCulled=false;im.count=0;scene.add(im);
   const variant=/^(?:torso|head|cap|gun|ammo)([012])$/.exec(o.name);
   this.parts.push({name:o.name,variant:variant?Number(variant[1]):null,mesh:im,base:o.matrixWorld.clone()});
  });
 }
 pivot(matrix,x,y,z,rx=0,ry=0,rz=0){
  m1.makeTranslation(x,y,z);tmp.rotation.set(rx,ry,rz);m2.makeRotationFromEuler(tmp.rotation);m1.multiply(m2);
  m2.makeTranslation(-x,-y,-z);m1.multiply(m2);matrix.multiply(m1);
 }
 update(list,g,enemy=false,boss=false){
  const time=g.tick/60,tier=enemy?0:g.weapon;
  for(const part of this.parts){
   if((part.variant!==null&&part.variant!==tier)||(part.name==='helmet'&&tier!==0)){part.mesh.count=0;continue;}
   let index=0;
   if(!enemy){const age=g.tick-(this.upgradeTick??-1000),intensity=age>=0&&age<38?.14*(1-age/38):0;part.mesh.material.emissive.copy(C(0xffc687)).multiplyScalar(intensity);}
   for(const e of list){
    const phase=time*(boss?5.3:12.7)+(e.phase||0),step=Math.sin(phase),stride=boss?.29:.44;
    const lean=enemy?0:Math.max(-.12,Math.min(.12,(g.targetX-g.centerX)*.09));
    const bob=(1-Math.cos(phase*2))*(boss?.019:.019);
    const age=g.tick-e.born,spawn=!enemy&&age<20?Math.min(1,.70+age*.025):1;
    tmp.position.set(e.x,bob+.022,-(e.d-g.distance));
    tmp.rotation.set(enemy?0:-.028,enemy?Math.PI:lean*.95,-lean*.44+step*(boss?.016:.018));
    const wide=tier>0&&!enemy?1.03:1;
    tmp.scale.set(this.scale*wide*spawn,this.scale*spawn,this.scale*spawn);tmp.updateMatrix();matRoot.copy(tmp.matrix);
    const left=part.name.endsWith('L'),sign=left?1:-1,hipY=boss?.83:.485,kneeY=boss?.385:.28;
    if(/^(leg|shin|boot)/.test(part.name)){
     this.pivot(matRoot,left?-(boss?.263:.127):(boss?.263:.127),hipY,.015,step*stride*sign);
     if(/^(shin|boot)/.test(part.name))this.pivot(matRoot,left?-(boss?.277:.127):(boss?.277:.127),kneeY,.015,Math.max(0,-step*sign)*stride*1.42);
     if(part.name.startsWith('boot'))this.pivot(matRoot,left?-(boss?.288:.127):(boss?.288:.127),boss?.19:.12,.015,-Math.max(0,step*sign)*.20);
    }else if(part.name==='armL'||part.name==='armR'){
     let a=step*.22*sign;
     if(e.warning){const progress=1-Math.max(0,e.warning.until-g.tick)/78;a=-Math.min(1.65,progress*2.2);}
     const since=g.tick-(this.motion.get(e.id)??-1000);if(since<24)a=Math.sin(since/24*Math.PI)*.88;
     this.pivot(matRoot,left?-.63:.63,1.80,0,a,0,sign*.025);
    }else if(part.name.startsWith('head')||part.name==='helmet'||part.name.startsWith('cap')){
     this.pivot(matRoot,0,boss?2.0:1.0,0,step*.012,enemy?0:-lean*.30,-step*.016);
    }else if(part.name.startsWith('gun')){
     const interval=[11,10,9][tier],since=(g.tick+e.id*7)%interval;
     const recoil=since<4?Math.sin((since+.5)/4*Math.PI)*.042:0;
     m1.makeTranslation(0,0,recoil);matRoot.multiply(m1);
    }else if(part.name.startsWith('torso')||part.name.startsWith('ammo'))this.pivot(matRoot,0,.59,0,0,step*.022,-step*.012);
    if(enemy&&g.tick-e.hitTick<5)this.pivot(matRoot,0,boss?1.25:.70,0,-.045*(1-(g.tick-e.hitTick)/5));
    matRoot.multiply(part.base);part.mesh.setMatrixAt(index,matRoot);
    const flash=enemy&&g.tick-e.hitTick<3&&g.tick%11<2?1.65:1;
    const upgrade=!enemy&&g.tick<(this.upgradeTick??-1000)+32;
    const col=upgrade?new T.Color(1.30,1.09,.87):new T.Color(flash,flash,flash);
    part.mesh.setColorAt(index++,col);
   }
   part.mesh.count=index;part.mesh.instanceMatrix.needsUpdate=true;part.mesh.instanceColor.needsUpdate=true;
  }
 }
 count(){return this.parts.find(p=>p.name==='body')?.mesh.count||0;}
}
/** Bounded, event-driven FX pools. No FX can damage, recruit or upgrade. */
function withInstanceOpacity(batch){
 const alpha=new T.InstancedBufferAttribute(new Float32Array(batch.instanceMatrix.count).fill(1),1);
 batch.geometry.setAttribute('instanceOpacity',alpha);
 batch.material.onBeforeCompile=shader=>{
  shader.vertexShader='attribute float instanceOpacity; varying float vInstanceOpacity;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvInstanceOpacity=instanceOpacity;');
  shader.fragmentShader='varying float vInstanceOpacity;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <alphamap_fragment>','#include <alphamap_fragment>\ndiffuseColor.a *= vInstanceOpacity;');
 };
 batch.material.customProgramCacheKey=()=> 'volley-instance-opacity-v1.1';batch.userData.alpha=alpha;return batch;
}
class Effects {
 constructor(scene,camera,factory){
  this.texture=(w,h,draw)=>canvasTexture(factory,w,h,draw);
  this.scene=scene;this.camera=camera;this.list=[];this.rings=[];this.debris=[];this.ghosts=[];this.max=2400;this.next=231;
  this.glow=this.texture(128,128,ctx=>{
   const a=ctx.createRadialGradient(64,64,0,64,64,64);a.addColorStop(0,'rgba(255,255,255,1)');a.addColorStop(.15,'rgba(255,255,255,.94)');a.addColorStop(.42,'rgba(255,255,255,.26)');a.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=a;ctx.fillRect(0,0,128,128);
  });
  this.star=this.texture(128,128,ctx=>{
   const g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.27,'rgba(255,255,255,.8)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
   ctx.fillStyle='white';ctx.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?11:52;const x=64+Math.cos(a)*r,y=64+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();
  });
  this.soft=this.texture(128,128,ctx=>{
   for(let i=0;i<9;i++){const angle=i*2.399,r=10+(i%3)*9,x=64+Math.cos(angle)*r,y=64+Math.sin(angle)*r;const a=ctx.createRadialGradient(x,y,0,x,y,38);a.addColorStop(0,'rgba(255,255,255,.39)');a.addColorStop(.53,'rgba(255,255,255,.25)');a.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=a;ctx.fillRect(0,0,128,128);}
  });
  this.sparks=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:this.glow,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),this.max);
  this.flashes=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:this.star,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),this.max);
  this.smoke=withInstanceOpacity(new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:this.soft,transparent:true,depthWrite:false,opacity:.76}),this.max));
  for(const o of [this.sparks,this.flashes,this.smoke]){o.setColorAt(0,new T.Color(1,1,1));o.frustumCulled=false;o.count=0;scene.add(o);}
  this.ringMesh=new T.InstancedMesh(new T.RingGeometry(.95,1,96),new T.MeshBasicMaterial({side:T.DoubleSide,transparent:true,opacity:.92,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),64);
  this.ringMesh.setColorAt(0,new T.Color(1,1,1));this.ringMesh.frustumCulled=false;this.ringMesh.count=0;scene.add(this.ringMesh);
  this.groundGlow=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:this.glow,side:T.DoubleSide,transparent:true,opacity:.50,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),64);
  this.groundGlow.setColorAt(0,new T.Color(1,1,1));this.groundGlow.frustumCulled=false;this.groundGlow.count=0;scene.add(this.groundGlow);
  const shardG=new T.BufferGeometry();shardG.setAttribute('position',new T.Float32BufferAttribute([-.32,0,0,.30,.08,0,-.13,.64,.05],3));shardG.computeVertexNormals();
  this.shards=withInstanceOpacity(new T.InstancedMesh(shardG,new T.MeshPhysicalMaterial({color:C(0x9bebff),metalness:.16,roughness:.15,clearcoat:1,transparent:true,opacity:.72,side:T.DoubleSide,depthWrite:false}),360));
  this.shards.count=0;this.shards.frustumCulled=false;scene.add(this.shards);this.ghostBatches={};
 }
 bindModels(models){
  for(const [key,model] of [['blue',models['blue-scout']],['red',models['red-raider']],['boss',models['red-colossus']]]){
   const items=[];model.traverse(o=>{if(!o.isMesh)return;const variant=/^(?:torso|head|cap|gun|ammo)([012])$/.exec(o.name);if(variant&&variant[1]!=='0')return;items.push([o.geometry.clone(),0xffffff]);});
   const geometry=mergeGeometry(items),material=new T.MeshStandardMaterial({color:C(0xe7edf0),roughness:.91,transparent:true,opacity:.83,depthWrite:false});
   const batch=withInstanceOpacity(new T.InstancedMesh(geometry,material,key==='boss'?4:48));batch.count=0;batch.frustumCulled=false;this.scene.add(batch);this.ghostBatches[key]=batch;
  }
 }
 rand(){this.next=(Math.imul(this.next+1,1664525)+1013904223)>>>0;return this.next/4294967296;}
 add(p){if(this.list.length>=this.max)this.list.shift();this.list.push({...p,total:p.life,tick:this.eventTick,ox:p.x,od:p.d,oy:p.y,vy0:p.vy,follow:this.followEvent,ax:this.anchorX,ad:this.anchorD,lastTick:this.eventTick});}
 puff(x,d,n,color,size=.28,smoke=false){for(let i=0;i<n;i++)this.add({x,d,y:.5+this.rand()*.3,vx:(this.rand()-.5)*3.3,vd:(this.rand()-.5)*3,vy:.5+this.rand()*2.1,color,size:size*(.6+this.rand()*.9),life:(smoke?.38:.14)+this.rand()*(smoke?.43:.23),smoke});}
 event(e){
  this.eventTick=e.tick;this.next=((e.tick*2654435761)^(e.id??Math.round((e.x??0)*1093))^(e.type.length*7919))>>>0;
  this.followEvent=e.type==='recruit'||e.type==='upgrade';this.anchorX=e.x;this.anchorD=e.d;
  const cyan=e.tier>0?0xffd333:0x58ddff;
  if(e.type==='shot'){
   this.add({x:e.x,d:e.d,y:.84,vx:0,vd:0,vy:0,color:cyan,size:.24+(e.tier>0?.08:0),life:.060,flash:true});
   if(e.id%7===0)this.add({x:e.x,d:e.d,y:.86,vx:0,vd:0,vy:.30,color:0xe2eced,size:.25,life:.18,smoke:true});
  }else if(e.type==='impact'){
   this.add({x:e.x,d:e.d,y:e.boss?1.45:.84,vx:0,vd:0,vy:.8,color:cyan,size:e.boss?.67:.49,life:.11,flash:true});
   this.puff(e.x,e.d,e.boss?4:2,e.enemy?0xf5e7c8:0x7eefff,.18);
  }else if(e.type==='kill'||e.type==='casualty'){
   this.puff(e.x,e.d,7,0xe8edef,.65,true);
   this.puff(e.x,e.d,3,e.type==='kill'?0xf2c99a:0x63c0ec,.16);
   this.ghosts.push({lastTick:e.tick,x:e.x,d:e.d,tick:e.tick,life:.42,total:.42,key:e.type==='kill'?'red':'blue',spin:(this.rand()-.5)*1.2});
   if(this.ghosts.length>96)this.ghosts.splice(0,this.ghosts.length-96);
  }else if(e.type==='recruit'||e.type==='upgrade'){
   const big=e.type==='upgrade',r=Math.max(1.15,Math.min(3.5,Math.sqrt(e.count??14)*.33+.36));
   this.rings.push({follow:true,tick:e.tick,lastTick:e.tick,x:e.x,d:e.d,life:.86,total:.86,color:0xffc157,size:r,ground:true});
   this.rings.push({follow:true,tick:e.tick,lastTick:e.tick,x:e.x,d:e.d,life:.63,total:.63,color:0xfff0ac,size:r*.92});
   for(let i=0;i<(big?62:36);i++){
    const a=this.rand()*Math.PI*2,dist=Math.sqrt(this.rand())*r*.77;
    this.add({x:e.x+Math.cos(a)*dist,d:e.d+Math.sin(a)*dist,y:.08+this.rand()*.3,vx:0,vd:0,vy:1.8+this.rand()*3.0,color:i%3?0xffc642:0xfff4d4,size:.11+this.rand()*.14,stretch:8+this.rand()*9,life:.48+this.rand()*.45});
   }
   this.puff(e.x,e.d,10,0xffc265,.60);
  }else if(e.type==='pod-open'||e.type==='pod-break'){
   this.puff(e.x,e.d,18,0x6de5ff,.46);this.puff(e.x,e.d,9,0xb0e7f3,.71,true);
   this.rings.push({lastTick:e.tick,x:e.x,d:e.d,life:.48,total:.48,color:0x49e4ff,size:2.5});
   for(let i=0;i<44;i++)this.debris.push({lastTick:e.tick,x:e.x+(this.rand()-.5)*3.4,d:e.d+(this.rand()-.5)*1.5,y:.5+this.rand()*1.4,vx:(this.rand()-.5)*5,vd:(this.rand()-.5)*4,vy:1+this.rand()*3,rx:this.rand()*6,rz:this.rand()*6,spin:(this.rand()-.5)*12,size:.16+this.rand()*.45,life:.70+this.rand()*.45,total:1.15});
   if(this.debris.length>360)this.debris.splice(0,this.debris.length-360);
  }else if(e.type==='strike'||e.type==='boss-kill'){
   this.puff(e.x,e.d,26,e.type==='strike'?0xffb545:0xffd785,.70);this.puff(e.x,e.d,25,0xc7bcaf,1.10,true);
   this.rings.push({lastTick:e.tick,x:e.x,d:e.d,life:.64,total:.64,color:0xffb852,size:3.8,ground:true});
   if(e.type==='boss-kill')this.ghosts.push({lastTick:e.tick,x:e.x,d:e.d,life:.75,total:.75,key:'boss',spin:.25});
  }
 }
 update(dt,g){
  let si=0,mi=0,fi=0;const cameraQ=this.camera.quaternion;
  const n=Math.max(1,g.troops.length),cx=g.troops.reduce((a,t)=>a+t.x,0)/n,cd=g.troops.reduce((a,t)=>a+t.d,0)/n;
  for(const p of this.list){
   const age=Math.max(0,(g.tick-p.tick)/60);p.life=p.total-age;p.lastTick=g.tick;
   if(p.life<=0)continue;
   p.x=p.ox+p.vx*age+(p.follow?cx-p.ax:0);p.d=p.od+p.vd*age+(p.follow?cd-p.ad:0);
   p.y=p.oy+p.vy0*age-.5*(p.smoke?.18:3)*age*age;
   const t=p.life/p.total,scale=p.size*(p.smoke?1+(1-t)*1.4:Math.sqrt(t));
   tmp.position.set(p.x,Math.max(.06,p.y),-(p.d-g.distance));tmp.quaternion.copy(cameraQ);tmp.scale.set(scale,scale*(p.stretch||1),1);tmp.updateMatrix();
   const target=p.smoke?this.smoke:p.flash?this.flashes:this.sparks,index=p.smoke?mi++:p.flash?fi++:si++;
   target.setMatrixAt(index,tmp.matrix);target.setColorAt(index,C(p.color).multiplyScalar(p.smoke?1:Math.min(1,t*3)));
   if(p.smoke)target.userData.alpha.setX(index,Math.min(1,t*2.2));
  }
  this.list=this.list.filter(p=>p.life>0);this.sparks.count=si;this.smoke.count=mi;this.flashes.count=fi;
  for(const o of [this.sparks,this.smoke,this.flashes]){o.instanceMatrix.needsUpdate=true;o.instanceColor.needsUpdate=true;if(o.userData.alpha)o.userData.alpha.needsUpdate=true;}
  let ri=0,gi=0;
  for(const p of this.rings){
   const dt=Math.max(0,(g.tick-(p.lastTick??g.tick))/60);p.lastTick=g.tick;
   p.life-=dt;if(p.life<=0||ri>=64)continue;const t=1-p.life/p.total,r=p.size*(.44+.69*t);
   tmp.position.set(p.follow?cx:p.x,.011,-((p.follow?cd:p.d)-g.distance));tmp.rotation.set(-Math.PI/2,0,0);tmp.scale.setScalar(r);tmp.updateMatrix();this.ringMesh.setMatrixAt(ri,tmp.matrix);this.ringMesh.setColorAt(ri++,C(p.color).multiplyScalar(Math.min(1,(1-t)*2)));
   if(p.ground){tmp.position.y=-.025;tmp.scale.setScalar(r*2.85);tmp.updateMatrix();this.groundGlow.setMatrixAt(gi,tmp.matrix);this.groundGlow.setColorAt(gi++,C(p.color).multiplyScalar((1-t)*.8));}
  }
  this.rings=this.rings.filter(p=>p.life>0);this.ringMesh.count=ri;this.groundGlow.count=gi;
  for(const o of [this.ringMesh,this.groundGlow]){o.instanceMatrix.needsUpdate=true;o.instanceColor.needsUpdate=true;}
  let di=0;for(const p of this.debris){
   const dt=Math.max(0,(g.tick-(p.lastTick??g.tick))/60);p.lastTick=g.tick;
   p.life-=dt;if(p.life<=0||di>=360)continue;
   for(let left=dt;left>1e-8;){const step=Math.min(left,1/60);left-=step;p.x+=p.vx*step;p.d+=p.vd*step;p.y+=p.vy*step;p.vy-=step*8.2;if(p.y<.03){p.y=.03;p.vy*=-.18;p.vx*=.80;p.vd*=.80;}}
   tmp.position.set(p.x,p.y,-(p.d-g.distance));tmp.rotation.set(p.rx+p.spin*(p.total-p.life),0,p.rz+p.spin*(p.total-p.life));tmp.scale.setScalar(p.size);tmp.updateMatrix();this.shards.setMatrixAt(di,tmp.matrix);this.shards.userData.alpha.setX(di++,Math.min(1,p.life*3));
  }
  this.debris=this.debris.filter(p=>p.life>0);this.shards.count=di;this.shards.instanceMatrix.needsUpdate=true;this.shards.userData.alpha.needsUpdate=true;
  const counts={blue:0,red:0,boss:0};
  for(const p of this.ghosts){
   const dt=Math.max(0,(g.tick-(p.lastTick??g.tick))/60);p.lastTick=g.tick;
   p.life-=dt;if(p.life<=0)continue;const batch=this.ghostBatches[p.key],i=counts[p.key];if(!batch||i>=Math.min(batch.instanceMatrix.count,p.key==='red'?12:24))continue;
   const age=1-p.life/p.total,scale=p.key==='boss'?2.0:p.key==='red'?.96:1;
   tmp.position.set(p.x,.06+Math.sin(age*Math.PI)*.17,-(p.d-g.distance));tmp.rotation.set(-age*.4,p.key==='red'?Math.PI:0,p.spin*age);tmp.scale.setScalar(scale*(1-age*.28));tmp.updateMatrix();batch.setMatrixAt(i,tmp.matrix);batch.userData.alpha.setX(i,(1-age)*.78);counts[p.key]++;
  }
  this.ghosts=this.ghosts.filter(p=>p.life>0);
  for(const [key,o]of Object.entries(this.ghostBatches)){o.count=counts[key];o.instanceMatrix.needsUpdate=true;o.userData.alpha.needsUpdate=true;}
 }
 clear(){this.list=[];this.rings=[];this.debris=[];this.ghosts=[];this.next=231;for(const o of [this.sparks,this.flashes,this.smoke,this.shards,this.ringMesh,this.groundGlow,...Object.values(this.ghostBatches)])o.count=0;}
}
/** Small, self-contained display-space bloom pipeline for pinned Three r140.
 * The r140 scene pass tone-maps into a LINEAR colour target.
 * Only the final presentation pass encodes to sRGB. A 24-bit depth texture
 * prevents the striping caused by the default offscreen 16-bit depth buffer.
 * Bright, saturated effects bloom; neutral road/skin are deliberately excluded.
 */
class PostFX {
 constructor(renderer){this.renderer=renderer;this.scene=new T.Scene();this.camera=new T.OrthographicCamera(-1,1,1,-1,0,1);this.quad=new T.Mesh(new T.PlaneGeometry(2,2));this.quad.frustumCulled=false;this.scene.add(this.quad);this.size=[0,0];this.enabled=true;
  const vertexShader='varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }';
  const material=(uniforms,fragmentShader)=>new T.ShaderMaterial({uniforms,vertexShader,fragmentShader,depthTest:false,depthWrite:false,toneMapped:false});
  this.extract=material({tInput:{value:null}},`varying vec2 vUv; uniform sampler2D tInput;
   void main(){vec3 c=texture2D(tInput,vUv).rgb;float hi=max(max(c.r,c.g),c.b);float lo=min(min(c.r,c.g),c.b);float saturation=(hi-lo)/max(hi,.001);float k=smoothstep(.63,.93,hi)*smoothstep(.15,.42,saturation);gl_FragColor=vec4(c*k,1.);}`);
  this.blur=material({tInput:{value:null},direction:{value:new T.Vector2()}},`varying vec2 vUv; uniform sampler2D tInput;uniform vec2 direction;
   void main(){vec3 c=texture2D(tInput,vUv).rgb*.227027;c+=texture2D(tInput,vUv+direction*1.384615).rgb*.316216;c+=texture2D(tInput,vUv-direction*1.384615).rgb*.316216;c+=texture2D(tInput,vUv+direction*3.230769).rgb*.070270;c+=texture2D(tInput,vUv-direction*3.230769).rgb*.070270;gl_FragColor=vec4(c,1.);}`);
  this.output=material({tScene:{value:null},tBloom:{value:null},strength:{value:.27}},`varying vec2 vUv;uniform sampler2D tScene;uniform sampler2D tBloom;uniform float strength;
   void main(){vec3 c=texture2D(tScene,vUv).rgb;vec3 b=texture2D(tBloom,vUv).rgb;vec3 linearColour=clamp(c+b*strength,0.,1.);vec3 encoded=mix(12.92*linearColour,1.055*pow(linearColour,vec3(1./2.4))-.055,step(vec3(.0031308),linearColour));gl_FragColor=vec4(encoded,1.);}`);
 }
 release(){for(const k of ['colour','ping','pong']){this[k]?.dispose();this[k]=null;}this.size=[0,0];}
 invalidate(){this.colour=this.ping=this.pong=null;this.size=[0,0];}
 resize(w,h,quality){
  this.enabled=quality!=='low';if(!this.enabled){this.release();return;}
  const samples=this.renderer.capabilities.isWebGL2?(quality==='high'?4:2):0;
  if(this.size[0]===w&&this.size[1]===h&&this.samples===samples)return;this.release();
  this.colour=new T.WebGLRenderTarget(w,h,{depthBuffer:true,stencilBuffer:false});this.colour.texture.encoding=T.LinearEncoding;this.colour.depthTexture=new T.DepthTexture(w,h,T.UnsignedIntType);this.colour.samples=samples;
  const scale=quality==='high'?.40:.28;this.bw=Math.max(2,Math.ceil(w*scale));this.bh=Math.max(2,Math.ceil(h*scale));
  this.ping=new T.WebGLRenderTarget(this.bw,this.bh,{depthBuffer:false});this.pong=new T.WebGLRenderTarget(this.bw,this.bh,{depthBuffer:false});this.size=[w,h];this.samples=samples;
 }
 pass(material,target){this.quad.material=material;this.renderer.setRenderTarget(target);this.renderer.render(this.scene,this.camera);}
 render(scene,camera){
  const r=this.renderer;r.info.autoReset=false;r.info.reset();
  if(!this.enabled||!this.colour){r.setRenderTarget(null);r.render(scene,camera);return;}
  r.setRenderTarget(this.colour);r.render(scene,camera);
  this.extract.uniforms.tInput.value=this.colour.texture;this.pass(this.extract,this.ping);
  this.blur.uniforms.tInput.value=this.ping.texture;this.blur.uniforms.direction.value.set(1.3/this.bw,0);this.pass(this.blur,this.pong);
  this.blur.uniforms.tInput.value=this.pong.texture;this.blur.uniforms.direction.value.set(0,1.3/this.bh);this.pass(this.blur,this.ping);
  this.output.uniforms.tScene.value=this.colour.texture;this.output.uniforms.tBloom.value=this.ping.texture;this.pass(this.output,null);
 }
}
export class World{
 static async create(runtime,onProgress=()=>{}){
  const w=new World(runtime);const loader=new T.GLTFLoader();const names=['blue-scout','red-raider','red-colossus','pulse-rifle','heavy-cannon'];
  w.models={};for(let i=0;i<names.length;i++){const name=names[i];w.models[name]=(await loader.parseAsync(await runtime.readAsset(`assets/${name}.glb`),'')).scene;onProgress((i+1)/names.length);}
  w.blue=new Actors(w.scene,w.models['blue-scout'],96,1.00);w.red=new Actors(w.scene,w.models['red-raider'],512,.93);w.boss=new Actors(w.scene,w.models['red-colossus'],6,2.0);w.effects.bindModels(w.models);w.ready=true;return w;
 }
 constructor(runtime){
  this.runtime=runtime;this.texture=(w,h,draw)=>canvasTexture(runtime.createCanvas,w,h,draw);this.quality=runtime.quality??'high';this.reducedMotion=runtime.reducedMotion;this.lost=false;this.ready=false;this.gateViews=new Map();this.podViews=new Map();this.bossLabels=new Map();this.lastTick=0;this.shake=0;
  this.renderer=new T.WebGLRenderer({canvas:runtime.canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.outputEncoding=T.sRGBEncoding;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.01;this.renderer.physicallyCorrectLights=true;
  this.renderer.shadowMap.enabled=this.quality!=='low';this.renderer.shadowMap.type=T.PCFSoftShadowMap;
  runtime.attach?.(this.renderer.domElement);
  this.scene=new T.Scene();this.scene.background=C(0xb68761);this.scene.fog=new T.Fog(C(0xc49a79),70,155);
  this.camera=new T.PerspectiveCamera(38.5,1,.5,180);this.camera.position.set(0,15.4,21.0);this.cameraTarget=new T.Vector3(0,.1,-7.8);this.camera.lookAt(this.cameraTarget);this.baseCamera=this.camera.position.clone();
  this.scene.add(new T.HemisphereLight(0xe5efff,0x785d53,.54));this.scene.add(new T.AmbientLight(0xffffff,.05));
  this.sun=new T.DirectionalLight(0xfff4e8,3.45);this.sun.position.set(20,32,18);this.sun.target.position.set(0,0,-4);this.scene.add(this.sun,this.sun.target);this.sun.castShadow=true;
  const sh=this.sun.shadow;sh.mapSize.set(4096,4096);sh.camera.left=-17;sh.camera.right=17;sh.camera.top=47;sh.camera.bottom=-20;sh.camera.near=1;sh.camera.far=85;sh.bias=-.00025;sh.normalBias=.016;sh.radius=2.2;
  const fill=new T.DirectionalLight(0xccdcff,.28);fill.position.set(8,12,-15);this.scene.add(fill);
  this.postFX=new PostFX(this.renderer);this.createEnvironment();this.createRoad();this.createBullets();this.createShadows();this.effects=new Effects(this.scene,this.camera,runtime.createCanvas);
  this.warning=mesh(new T.RingGeometry(1.77,1.9,64),basic(0xff7b24,{transparent:true,opacity:.8,side:T.DoubleSide,toneMapped:false,depthWrite:false}),this.scene);this.warning.rotation.x=-Math.PI/2;this.warning.castShadow=false;this.warning.visible=false;
  this.warningFill=mesh(new T.PlaneGeometry(3.9,11),basic(0xff7827,{transparent:true,opacity:.15,side:T.DoubleSide,toneMapped:false,depthWrite:false}),this.scene);this.warningFill.rotation.x=-Math.PI/2;this.warningFill.castShadow=false;this.warningFill.visible=false;
  this.offResize=runtime.onResize(()=>this.resize());this.resize();
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;this.postFX.invalidate();this.envTarget=null;this.scene.environment=null;runtime.emit('render-lost');});
  this.renderer.domElement.addEventListener('webglcontextrestored',()=>{this.lost=false;this.createEnvironment();this.resize();runtime.emit('render-restored');});
 }
 createEnvironment(){
  const room=new T.Scene();room.background=C(0x647384);
  const light=new T.Mesh(new T.PlaneGeometry(30,24),new T.MeshBasicMaterial({color:new T.Color(2.7,2.7,2.7),side:T.DoubleSide}));light.position.set(10,22,8);light.lookAt(0,0,0);room.add(light);
  const soft=new T.Mesh(new T.PlaneGeometry(24,18),new T.MeshBasicMaterial({color:new T.Color(.8,1,1.3),side:T.DoubleSide}));soft.position.set(16,8,-14);soft.lookAt(0,0,0);room.add(soft);
  const pmrem=new T.PMREMGenerator(this.renderer);this.envTarget=pmrem.fromScene(room,.03);this.scene.environment=this.envTarget.texture;pmrem.dispose();light.geometry.dispose();light.material.dispose();soft.geometry.dispose();soft.material.dispose();
 }
 createRoad(){
  this.roadTexture=this.texture(512,512,(ctx,w,h)=>{
   ctx.fillStyle='#67676a';ctx.fillRect(0,0,w,h);let seed=371;
   for(let i=0;i<18000;i++){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=(seed>>>12)%w;
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=(seed>>>12)%h;
    ctx.fillStyle=i%2?'rgba(255,255,255,.019)':'rgba(0,0,0,.015)';ctx.fillRect(x,y,1,1);
   }
  });
  this.roadTexture.wrapS=this.roadTexture.wrapT=T.RepeatWrapping;this.roadTexture.repeat.set(2,60);
  this.roadTexture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());
  const roadMat=std(0xffffff,.98);roadMat.map=this.roadTexture;
  mesh(new T.BoxGeometry(11.25,.42,240),std(0x99928c,.9),this.scene,0,-.40,-60);
  const road=mesh(new T.PlaneGeometry(10.65,240),roadMat,this.scene,0,-.055,-60);road.rotation.x=-Math.PI/2;road.castShadow=false;
  for(const side of [-1,1]){
   const stripe=mesh(new T.PlaneGeometry(.084,240),std(0xe5e1dc,.95),this.scene,side*5.04,-.049,-60);stripe.rotation.x=-Math.PI/2;stripe.castShadow=false;
   mesh(new T.BoxGeometry(.28,.17,240),std(0x959394,.9),this.scene,side*5.47,.015,-60);
   mesh(rounded(.08,.075,240,.02),std(0x393a42,.51,.20),this.scene,side*5.48,1.00,-60);
   mesh(new T.BoxGeometry(.033,.033,240),std(0x353941,.62,.17),this.scene,side*5.48,.43,-60);
  }
  this.dashes=new T.InstancedMesh(new T.PlaneGeometry(.104,2.8),std(0xece8e3,.98),32);this.dashes.receiveShadow=true;this.scene.add(this.dashes);
  const postG=mergeGeometry([[new T.CylinderGeometry(.032,.032,1.0,8),0x383b44,[0,.5,0]],[new T.BoxGeometry(.11,.04,.14),0x363a40,[0,.04,0]]]);
  this.posts=new T.InstancedMesh(postG,new T.MeshStandardMaterial({vertexColors:true,roughness:.61,metalness:.14}),220);this.posts.castShadow=true;this.posts.receiveShadow=true;this.scene.add(this.posts);
  const pierG=mergeGeometry([[rounded(.23,1.08,.31,.045),0x89868b,[0,.50,0]],[rounded(.29,.08,.36,.025),0xb7b3b6,[0,1.08,0]],[rounded(.33,.12,.41,.025),0x6f7176,[0,.015,0]]]);
  this.piers=new T.InstancedMesh(pierG,new T.MeshStandardMaterial({vertexColors:true,roughness:.9}),60);this.piers.castShadow=true;this.piers.receiveShadow=true;this.scene.add(this.piers);
  const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(0,3.5,0),new T.Vector3(.08,4.45,0),new T.Vector3(.64,4.78,0),new T.Vector3(1.37,4.84,0)]);
  const lampParts=[
   [new T.TubeGeometry(curve,24,.043,8,false),0x777276],
   [rounded(.54,.07,.18,.03),0xb3b1b1,[1.40,4.82,0]],
   [rounded(.38,.023,.12,.01),0xffedca,[1.45,4.773,0]],
   [rounded(.31,.13,.35,.025),0x7d7e84,[0,.04,0]],
   [new T.BoxGeometry(.34,.022,.68),0x30333e,[.34,-.028,.45]]
  ];
  for(let i=0;i<8;i++)lampParts.push([new T.BoxGeometry(.30,.010,.025),0x6d7076,[.34,-.012,.165+i*.081]]);
  const lampG=mergeGeometry(lampParts);
  this.lamps=new T.InstancedMesh(lampG,new T.MeshStandardMaterial({vertexColors:true,roughness:.57,metalness:.21}),22);this.lamps.castShadow=true;this.lamps.receiveShadow=true;this.scene.add(this.lamps);
  const sandMap=this.texture(256,256,(ctx,w,h)=>{
   ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,h);let seed=714;
   for(let i=0;i<160;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=(seed>>>12)%w;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=(seed>>>12)%h;const a=ctx.createRadialGradient(x,y,1,x,y,36);a.addColorStop(0,'rgba(60,36,22,.055)');a.addColorStop(1,'rgba(60,36,22,0)');ctx.fillStyle=a;ctx.fillRect(x-36,y-36,72,72);}
  });sandMap.wrapS=sandMap.wrapT=T.RepeatWrapping;sandMap.repeat.set(7,7);
  const sand=std(0x67422d,1);sand.map=sandMap;
  const floor=mesh(new T.PlaneGeometry(400,420),sand,this.scene,0,-5,-40);floor.rotation.x=-Math.PI/2;floor.receiveShadow=false;
  this.rocks=[];
 }
 createBullets(){
  const streak=this.texture(64,256,(ctx,w,h)=>{
   const image=ctx.createImageData(w,h);
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const u=(x+.5)/w*2-1,v=(y+.5)/h;
    const taper=Math.max(.12,Math.sin(Math.pow(v,.60)*Math.PI)*.90);
    const alpha=Math.exp(-Math.pow(u/taper,2)*5)*Math.pow(1-v,.68)*Math.min(1,v*22);
    const i=(y*w+x)*4;image.data[i]=image.data[i+1]=image.data[i+2]=255;image.data[i+3]=Math.round(alpha*255);
   }ctx.putImageData(image,0,0);
  });
  const geo=new T.PlaneGeometry(1,1);geo.rotateX(-Math.PI/2);
  this.bullets=new T.InstancedMesh(geo,new T.MeshBasicMaterial({map:streak,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide}),2400);
  this.bulletGlow=new T.InstancedMesh(geo.clone(),new T.MeshBasicMaterial({map:streak,color:0xffffff,transparent:true,opacity:.57,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false,side:T.DoubleSide}),2400);
  for(const o of [this.bullets,this.bulletGlow]){o.setColorAt(0,new T.Color(1,1,1));o.count=0;o.frustumCulled=false;this.scene.add(o);}
 }
 createShadows(){
  const map=this.texture(64,64,ctx=>{const g=ctx.createRadialGradient(32,32,3,32,32,31);g.addColorStop(0,'rgba(25,24,28,.55)');g.addColorStop(.5,'rgba(25,24,28,.23)');g.addColorStop(1,'rgba(25,24,28,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);});
  this.shadows=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map,transparent:true,depthWrite:false,opacity:.8,polygonOffset:true,polygonOffsetFactor:-1}),640);this.shadows.frustumCulled=false;this.scene.add(this.shadows);
 }
 makeGate(g){
  const root=new T.Group();this.scene.add(root);const negative=g.value<0,color=negative?0xf14749:0x248ade,edge=negative?0xff9990:0x86d9ff;
  const map=this.texture(32,128,(ctx,w,h)=>{
   const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'rgba(255,255,255,.42)');grad.addColorStop(.18,'rgba(255,255,255,.19)');grad.addColorStop(.65,'rgba(255,255,255,.47)');grad.addColorStop(1,'rgba(255,255,255,.95)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
  });
  const mat=new T.MeshBasicMaterial({color:C(color),map,transparent:true,opacity:.90,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  const pane=mesh(new T.PlaneGeometry(g.width,1.45),mat,root,0,.965,0);pane.castShadow=false;pane.receiveShadow=false;
  const rails=[];
  for(const side of [-1,1]){
   rails.push(mesh(rounded(.057,1.74,.075,.02),std(color,.43,.19),root,side*g.width/2,.88,.005));
   rails.push(mesh(new T.SphereGeometry(.050,10,8),std(edge,.31,.2),root,side*g.width/2,1.77,0));
   mesh(rounded(.20,.065,.33,.018),std(color,.53,.18),root,side*g.width/2,.008,0);
  }
  const top=mesh(new T.PlaneGeometry(g.width,.041),basic(edge,{transparent:true,opacity:.65,toneMapped:false,depthWrite:false}),root,0,1.691,.013);top.castShadow=false;
  const bottom=mesh(new T.PlaneGeometry(g.width,.067),basic(edge,{transparent:true,opacity:.85,toneMapped:false,depthWrite:false}),root,0,.253,.013);bottom.castShadow=false;
  const label=spriteLabel(this.runtime.createCanvas,'',g.width*1.10,1.67);label.position.set(0,1.05,.13);root.add(label);
  return {root,pane,label,rails,top,bottom,negative,baseWidth:g.width};
 }
 makePod(p){
  const root=new T.Group();this.scene.add(root);const w=p.width;
  const base=mesh(rounded(w+.06,.34,1.73,.15),std(0x0a91cb,.33,.15),root,0,.18,0);
  const reservoir=mesh(rounded(w-.04,.73,1.63,.28),new T.MeshPhysicalMaterial({color:C(0x048fd0),roughness:.28,metalness:.02,clearcoat:.6,clearcoatRoughness:.19}),root,0,.68,0);
  reservoir.material.envMapIntensity=.70;
  const water=mesh(rounded(w-.16,.035,1.48,.016),new T.MeshPhysicalMaterial({color:C(0x90ebef),roughness:.16,metalness:.12,transparent:true,opacity:.80,clearcoat:1}),root,0,1.065,0);water.castShadow=false;
  const glass=mesh(rounded(w-.005,1.86,1.72,.42),new T.MeshPhysicalMaterial({color:C(0x95ecff),transparent:true,opacity:.24,roughness:.08,metalness:.05,depthWrite:false,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:1.25}),root,0,1.04,0);glass.castShadow=false;
  const cage=new T.Group();root.add(cage);
  const rimMat=basic(0x84eaff,{transparent:true,opacity:.61,toneMapped:false,depthWrite:false});
  // Rounded top/bottom rim follows the glass, not a rectangular aquarium.
  const rim=(y,width,depth)=>{
   const pts=[],r=.35;
   for(let c=0;c<4;c++){
    const sx=c===0||c===3?1:-1,sz=c<2?1:-1,begin=c*Math.PI/2;
    for(let j=0;j<=8;j++){
     const a=begin+j/8*Math.PI/2;
     // traverse the four corners clockwise in XZ
     const cx=(c===0||c===3?1:-1)*(width/2-r),cz=(c<2?1:-1)*(depth/2-r);
     pts.push(new T.Vector3(cx+Math.cos(a)*r,y,cz+Math.sin(a)*r));
    }
   }
   // Use an explicit rounded rectangle path, with a valid closed seam.
   const path=new T.Shape();path.moveTo(-width/2+r,-depth/2);path.lineTo(width/2-r,-depth/2);path.quadraticCurveTo(width/2,-depth/2,width/2,-depth/2+r);path.lineTo(width/2,depth/2-r);path.quadraticCurveTo(width/2,depth/2,width/2-r,depth/2);path.lineTo(-width/2+r,depth/2);path.quadraticCurveTo(-width/2,depth/2,-width/2,depth/2-r);path.lineTo(-width/2,-depth/2+r);path.quadraticCurveTo(-width/2,-depth/2,-width/2+r,-depth/2);
   const curve=new T.CatmullRomCurve3(path.getPoints(10).map(p=>new T.Vector3(p.x,y,p.y)),true);const o=mesh(new T.TubeGeometry(curve,80,.022,6,true),rimMat,cage);o.castShadow=false;
  };
  rim(1.91,w-.12,1.41);rim(.17,w-.06,1.62);
  for(const side of [-1,1]){
   const pts=[new T.Vector3(side*(w/2-.09),.64,.75),new T.Vector3(side*(w/2-.10),1.45,.73),new T.Vector3(side*(w/2-.22),1.79,.69),new T.Vector3(side*(w/2-.48),1.91,.59)];
   const strip=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),16,.022,6,false),rimMat,cage);strip.castShadow=false;
  }
  const shineMat=basic(0xe0faff,{transparent:true,opacity:.33,depthWrite:false,toneMapped:false});
  for(const side of [-1,1]){
   const shine=mesh(rounded(.026,.90,.023,.01),shineMat,cage,side*(w/2-.22),1.17,.80);shine.rotation.z=-side*.10;shine.castShadow=false;
  }
  const reflection=mesh(new T.PlaneGeometry(w-.8,.034),shineMat,cage,0,1.89,.50);reflection.rotation.x=-Math.PI/2;reflection.castShadow=false;
  const gun=this.models[p.tier===2?'heavy-cannon':'pulse-rifle'].clone();gun.traverse(o=>{if(o.isMesh){o.userData.borrowedAsset=true;o.castShadow=true;o.receiveShadow=true;}});
  gun.scale.setScalar(p.tier===2?1.04:1.17);gun.position.y=1.30;gun.rotation.y=-.075;root.add(gun);
  for(const side of [-1,1]){
   mesh(new T.CylinderGeometry(.275,.275,.32,20),std(0x3a465b,.37,.52),root,side*(w/2+.065),.94,0).rotation.z=Math.PI/2;
   for(let j=0;j<5;j++){
    const ring=mesh(new T.TorusGeometry(.289,.031,8,24),std(p.tier===2?0xbe8b5b:0xbd4b57,.38,.48),root,side*(w/2-.02+j*.064),.94,0);ring.rotation.y=Math.PI/2;
   }
  }
  const label=spriteLabel(this.runtime.createCanvas,String(p.hp),w*.99,1.40);label.position.set(0,.87,1.00);root.add(label);
  const boltGeo=new T.BufferGeometry();boltGeo.setAttribute('position',new T.BufferAttribute(new Float32Array(24*6),3));
  const lightning=new T.LineSegments(boltGeo,basic(0xb1f6ff,{transparent:true,opacity:.9,toneMapped:false,depthWrite:false,blending:T.AdditiveBlending}));lightning.frustumCulled=false;root.add(lightning);lightning.visible=false;
  const halo=mesh(new T.PlaneGeometry(w+.9,2.6),new T.MeshBasicMaterial({map:this.effects.glow,color:C(0x0bacfa),blending:T.AdditiveBlending,transparent:true,opacity:.30,depthWrite:false,toneMapped:false}),root,0,-.025,0);halo.rotation.x=-Math.PI/2;halo.castShadow=false;
  return {root,glass,cage,gun,label,base,reservoir,water,lightning,halo};
 }
 reset(g){
  const remove=root=>{const geometries=new Set(),materials=new Set(),textures=new Set();root.traverse(o=>{if(o.userData.borrowedAsset)return;if((o.isMesh&&!o.isSprite)||o.isLine)geometries.add(o.geometry);if(o.material){for(const m of [o.material].flat()){materials.add(m);if(m.map&&m.map!==this.effects.glow)textures.add(m.map);}}});for(const t of textures)t.dispose();for(const m of materials)m.dispose();for(const geo of geometries)geo.dispose();this.scene.remove(root);};
  for(const v of this.gateViews.values())remove(v.root);for(const v of this.podViews.values())remove(v.root);for(const l of this.bossLabels.values())remove(l);
  this.gateViews.clear();this.podViews.clear();this.bossLabels.clear();this.effects.clear();this.blue.upgradeTick=-1000;this.boss.motion.clear();this.lastTick=0;this.shakeTick=-1000;
  for(const gate of g.gates)this.gateViews.set(gate.id,this.makeGate(gate));for(const pod of g.pods)this.podViews.set(pod.id,this.makePod(pod));
  for(const e of g.enemies.filter(e=>e.kind==='boss')){
   const root=new T.Group(),label=new T.Sprite(new T.SpriteMaterial({transparent:true,depthWrite:false,toneMapped:false}));
   label.scale.set(e.final?3.2:2.65,.69,1);root.add(label);root.userData.label=label;this.scene.add(root);this.bossLabels.set(e.id,root);this.healthLabel(root,e);
  }

 }
 healthLabel(root,e){
  const key=Math.ceil(e.hp)+'/'+e.maxHP;if(root.userData.healthKey===key)return;root.userData.healthKey=key;
  const map=this.texture(512,110,ctx=>{
   const rr=(x,y,w,h,r)=>{ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();};
   rr(7,12,498,86,13);ctx.fillStyle='#322029';ctx.fill();ctx.lineWidth=7;ctx.strokeStyle='#e5c2a8';ctx.stroke();
   ctx.save();rr(12,17,488,76,9);ctx.clip();ctx.fillStyle='#f6412e';ctx.fillRect(12,17,488*Math.max(0,e.hp/e.maxHP),76);
   ctx.fillStyle='#ff956f';ctx.fillRect(12,17,488*Math.max(0,e.hp/e.maxHP),15);ctx.restore();
   ctx.font='italic 900 69px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=7;ctx.strokeStyle='#712922';ctx.strokeText(String(Math.ceil(e.hp)),256,58);ctx.fillStyle='#fff8e7';ctx.fillText(String(Math.ceil(e.hp)),256,58);
  });const mat=root.userData.label.material;mat.map?.dispose();mat.map=map;mat.needsUpdate=true;
 }
 setQuality(quality){if(!['high','balanced','low'].includes(quality))return;this.quality=quality;const high=quality==='high';this.renderer.shadowMap.enabled=quality!=='low';this.sun.shadow.mapSize.set(high?4096:1536,high?4096:1536);this.sun.shadow.map?.dispose();this.sun.shadow.map=null;this.resize();}
 resize(){const {width,height}=this.runtime.viewport();if(!width||!height)return;this.width=width;this.height=height;this.camera.aspect=width/height;this.camera.fov=2*Math.atan(Math.tan(38.5*Math.PI/360)*Math.max(1,.575/this.camera.aspect))*180/Math.PI;this.camera.updateProjectionMatrix();this.renderer.setPixelRatio(Math.min(this.runtime.viewport().dpr,this.quality==='high'?2:this.quality==='balanced'?1.4:1));this.renderer.setSize(width,height,false);const size=this.renderer.getDrawingBufferSize(new T.Vector2());this.postFX.resize(size.x,size.y,this.quality);}
 // Frame actual actor extents, not the input target. Stateless framing remains identical
 // across replay, paused redraw, resize, and a large diagnostic advance.
 frameSquad(g){
  this.camera.position.copy(this.baseCamera);this.camera.lookAt(this.cameraTarget);this.camera.updateMatrixWorld();
  if(!g.troops.length)return;
  const bounds=()=>{
   let min=Infinity,max=-Infinity;
   for(const t of g.troops)for(const side of [-1,1]){
    const p=new T.Vector3(t.x+side*(g.weapon?.54:.37),.9,-(t.d-g.distance)).project(this.camera);min=Math.min(min,p.x);max=Math.max(max,p.x);
   }return {min,max};
  };
  let b=bounds();const span=b.max-b.min;
  if(span>1.75){const factor=Math.min(1.40,span/1.75);this.camera.position.sub(this.cameraTarget).multiplyScalar(factor).add(this.cameraTarget);this.camera.updateMatrixWorld();b=bounds();}
  const correction=b.min<-.88?b.min+.88:b.max>.88?b.max-.88:0;
  if(correction){const depth=this.camera.position.distanceTo(new T.Vector3(0,.9,0));this.camera.position.x+=correction*depth*Math.tan(this.camera.fov*Math.PI/360)*this.camera.aspect;this.camera.updateMatrixWorld();}
 }
 draw(g,events=[]){
  if(!this.ready||this.lost)return;
  const dt=Math.max(0,Math.min(.1,(g.tick-this.lastTick)/60));this.lastTick=g.tick;
  for(const e of events){const age=(g.tick-e.tick)/60,maxLife={shot:.18,impact:.37,kill:.81,casualty:.81,recruit:.93,upgrade:.93,'pod-open':1.15,'pod-break':1.15,strike:.81,'boss-kill':.81}[e.type]??0;if(age<=maxLife)this.effects.event(e);if(e.type==='upgrade')this.blue.upgradeTick=e.tick;if(e.type==='strike')this.boss.motion.set(e.bossId,e.tick);if(e.type==='strike'||e.type==='boss-kill')this.shakeTick=e.tick;}
  this.frameSquad(g);this.shake=.10*Math.exp(-Math.max(0,g.tick-(this.shakeTick??-1000))/7);if(!this.reducedMotion&&this.shake>.001){this.camera.position.x+=Math.sin(g.tick*1.7)*this.shake;this.camera.position.y+=Math.cos(g.tick*2.1)*this.shake*.5;}this.camera.updateMatrixWorld();
  this.roadTexture.offset.y=-g.distance/4;
  for(let i=0;i<32;i++){tmp.position.set(0,-.044,22-i*7+(g.distance%7));tmp.rotation.set(-Math.PI/2,0,0);tmp.scale.setScalar(1);tmp.updateMatrix();this.dashes.setMatrixAt(i,tmp.matrix);}this.dashes.instanceMatrix.needsUpdate=true;
  for(let i=0;i<220;i++){tmp.position.set(i%2?5.48:-5.48,0,22-Math.floor(i/2)*1.6+(g.distance%1.6));tmp.rotation.set(0,0,0);tmp.scale.setScalar(1);tmp.updateMatrix();this.posts.setMatrixAt(i,tmp.matrix);}this.posts.instanceMatrix.needsUpdate=true;
  for(let i=0;i<60;i++){tmp.position.set(i%2?5.48:-5.48,0,22-Math.floor(i/2)*6.4+(g.distance%6.4));tmp.rotation.set(0,0,0);tmp.scale.setScalar(1);tmp.updateMatrix();this.piers.setMatrixAt(i,tmp.matrix);}this.piers.instanceMatrix.needsUpdate=true;
  for(let i=0;i<22;i++){const side=i%2?1:-1;tmp.position.set(side*5.62,0,18-Math.floor(i/2)*18+(g.distance%18));tmp.rotation.set(0,side===1?Math.PI:0,0);tmp.scale.setScalar(1);tmp.updateMatrix();this.lamps.setMatrixAt(i,tmp.matrix);}this.lamps.instanceMatrix.needsUpdate=true;
  for(const rock of this.rocks)rock.position.z=-160+((rock.userData.z+g.distance*.70+320)%210);
  const visible=g.enemies.filter(e=>e.alive&&e.d-g.distance<100&&e.d-g.distance>-8),soldiers=visible.filter(e=>e.kind!=='boss'),bosses=visible.filter(e=>e.kind==='boss');
  this.blue.update(g.troops,g);this.red.update(soldiers,g,true);this.boss.update(bosses,g,true,true);
  let si=0;for(const e of [...g.troops,...visible]){const size=e.kind==='boss'?4.0:.90;tmp.position.set(e.x,-.040,-(e.d-g.distance));tmp.rotation.set(-Math.PI/2,0,0);tmp.scale.set(size,size*.78,1);tmp.updateMatrix();this.shadows.setMatrixAt(si++,tmp.matrix);}this.shadows.count=si;this.shadows.instanceMatrix.needsUpdate=true;
  for(const gate of g.gates){
   const v=this.gateViews.get(gate.id);v.root.visible=gate.alive&&gate.d-g.distance<100&&gate.d-g.distance>-6;if(!v.root.visible)continue;v.root.position.set(gate.x,0,-(gate.d-g.distance));v.root.scale.x=gate.width/v.baseWidth;v.root.scale.y=Math.min(1,.62+Math.abs(gate.value)*.045);
   const neg=gate.value<0,col=neg?0xf25c4c:0x208ee3;v.pane.material.color.copy(C(col));v.pane.material.opacity=.83+(g.tick-gate.flash<4?.14:0);
   if(v.negative!==neg){v.negative=neg;for(const r of v.rails)r.material.color.copy(C(col));v.top.material.color.copy(C(neg?0xff9d81:0x70d9ff));v.bottom.material.color.copy(v.top.material.color);}
   const text=gate.operation==='multiply'?`×${gate.value}`:`${gate.value>=0?'+':''}${gate.value}`;updateLabel(v.label,text,neg?'red':'blue');
  }
  for(const pod of g.pods){
   const v=this.podViews.get(pod.id);v.root.visible=pod.alive&&pod.d-g.distance<100&&pod.d-g.distance>-6;if(!v.root.visible)continue;v.root.position.set(pod.x,0,-(pod.d-g.distance));v.gun.position.y=1.29+Math.sin(g.tick*.044)*.055;v.gun.rotation.y=-.10+Math.sin(g.tick*.018)*.07;
   v.glass.visible=!pod.unlocked;v.cage.visible=!pod.unlocked;v.water.visible=!pod.unlocked;v.reservoir.visible=!pod.unlocked;
   const hit=g.tick-pod.flash<6;v.glass.material.opacity=hit?.34:.24;v.halo.material.opacity=hit?.7:.22;
   v.lightning.visible=!pod.unlocked&&(hit||g.tick%96<5);
   if(v.lightning.visible){const a=v.lightning.geometry.attributes.position;let k=0;
    for(let line=0;line<3;line++){let x=-pod.width*.39+line*pod.width*.37,y=.56;
     for(let j=0;j<8;j++){const nx=x+Math.sin(g.tick*.67+line*13+j*7)*.17,ny=.56+(j+1)*.157;a.setXYZ(k++,x,y,.865);a.setXYZ(k++,nx,ny,.865);x=nx;y=ny;}}
    a.needsUpdate=true;
   }
   updateLabel(v.label,pod.unlocked?'已解锁':String(Math.ceil(pod.hp)),pod.unlocked?'gold':'blue',pod.unlocked?'驶过领取':'');
   v.base.material.color.copy(C(pod.unlocked?0x32b7ec:0x1c9fdf));
  }
  for(const e of g.enemies.filter(e=>e.kind==='boss')){
   const label=this.bossLabels.get(e.id),screen=this.project(e.x,e.d,g,6.42);label.visible=e.alive&&e.d-g.distance<73&&(!e.final||(screen.y>80&&screen.y<this.height*.74));label.position.set(e.x,6.42,-(e.d-g.distance));this.healthLabel(label,e);
  }
  const warning=bosses.find(e=>e.warning);this.warning.visible=!!warning;this.warningFill.visible=!!warning;
  if(warning){this.warning.position.set(warning.warning.x,.015,-.0);this.warning.material.opacity=.6+Math.sin(g.tick*.35)*.28;this.warningFill.position.set(warning.warning.x,.009,-3);this.warningFill.material.opacity=.11+Math.sin(g.tick*.18)*.06;}
  const bullets=g.bullets.slice(0,2400),density=Math.min(1,Math.sqrt(22/Math.max(1,g.troops.length)));
  for(let i=0;i<bullets.length;i++){
   const b=bullets[i],travel=(g.tick-b.born+1)*b.speed/60,length=Math.min(b.tier>0?7.8:6.6,travel);
   tmp.position.set(b.x,.86,-(b.d-g.distance-length*.5));tmp.rotation.set(0,0,0);
   const width=(b.tier>0?.115:.112)*(density*.65+.35);
   tmp.scale.set(width,1,length);tmp.updateMatrix();this.bullets.setMatrixAt(i,tmp.matrix);
   tmp.scale.set(width*(b.tier>0?3.8:4.8),1,length*1.03);tmp.updateMatrix();this.bulletGlow.setMatrixAt(i,tmp.matrix);
   this.bullets.setColorAt(i,C(b.tier>0?0xfff4b0:0xf2fdff));this.bulletGlow.setColorAt(i,C(b.tier>0?0xffc930:0x55d8ff));
  }
  for(const o of [this.bullets,this.bulletGlow]){o.count=bullets.length;o.instanceMatrix.needsUpdate=true;o.instanceColor.needsUpdate=true;}
  this.effects.update(dt,g);this.postFX.render(this.scene,this.camera);
 }
 project(x,d,g,y=1){const p=new T.Vector3(x,y,-(d-g.distance)).project(this.camera);return {x:(p.x*.5+.5)*this.width,y:(-.5*p.y+.5)*this.height};}
 metrics(){return {drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,particles:this.effects.sparks.count+this.effects.smoke.count+this.effects.flashes.count+this.effects.shards.count,rings:this.effects.ringMesh.count,projectiles:this.bullets.count,livingBlue:this.blue.count(),livingRed:this.red.count(),bosses:this.boss.count(),bloom:this.postFX.enabled,msaa:this.postFX.enabled?(this.postFX.samples??0):0,ghosts:this.effects.ghosts.length,quality:this.quality,viewport:[this.width,this.height],pixelRatio:this.renderer.getPixelRatio()};}
}
