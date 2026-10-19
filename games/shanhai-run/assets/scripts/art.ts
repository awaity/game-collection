import {EffectAsset,Material,Mesh,MeshRenderer,Vec3,Vec4,Color,resources,utils} from 'cc';
import {GameView} from 'db://assets/collection/runtime';
import {Geometry} from './geometry';
import {AREAS,Random,Run,LANE_WIDTH,type Segment,type Hazard} from './core';
import {SKINS} from './profile';
type Skin=typeof SKINS[number];
const effect=()=>new Promise<EffectAsset>((resolve,reject)=>resources.load('shanhai',EffectAsset,(error,value)=>error?reject(error):resolve(value)));

class Batch {
  readonly geometry:Geometry;
  readonly mesh:Mesh;
  constructor(capacity:number){this.geometry=new Geometry(capacity);const b=this.geometry;this.mesh=utils.MeshUtils.createDynamicMesh(0,{positions:b.positions,colors:b.colors,indices16:b.indices},undefined,{maxSubMeshes:1,maxSubMeshVertices:capacity,maxSubMeshIndices:capacity});}
  draw(ui:GameView,id:string,material:Material){
    if(!this.geometry.count)return;
    this.mesh.updateSubMesh(0,this.geometry.dynamic());
    // Creator retains the input assembler's previous count and bounds until
    // notified, even when the underlying vertex/index buffers have changed.
    ui.meshNode(id,this.mesh,material,0,0,0).getComponent(MeshRenderer)!.onGeometryChanged();
  }
}

function roof(g:Geometry,x:number,y:number,z:number,width:number,depth:number,hex:string){
  g.at(x,y,z,1,1,1,0,0,0,()=>{
    const e=width/2,d=depth/2;
    for(const side of [-1,1]){
      for(let i=0;i<12;i++){
        const a=-e+width*i/12,b=-e+width*(i+1)/12,ya=.08+Math.pow(Math.abs(a/e),6)*.35,yb=.08+Math.pow(Math.abs(b/e),6)*.35;
        g.quad([a*.85,.72,0],[b*.85,.72,0],[b,yb,side*d],[a,ya,side*d],hex);
        g.quad([a,ya,side*d],[b,yb,side*d],[b,yb-.12,side*d],[a,ya-.12,side*d],'#a89663');
        g.box((a+b)*.425,.70,0,.075,.08,.24,'#70957a');
      }
      g.triangle([side*e,.43,d],[side*e,.43,-d],[side*e*.85,.72,0],hex);
    }
    g.box(0,.76,0,width*.9,.15,.18,'#c8ae73');
    g.box(0,-.06,0,width*.88,.16,depth*.8,'#284e43');
  });
}
function gate(g:Geometry,z:number,area:number,small=false){
  const a=AREAS[area],scale=small?.72:1;
  g.at(0,0,z,scale,scale,scale,0,0,0,()=>{
    for(const side of [-1,1]){
      g.box(side*3.65,2.25,0,.65,4.5,.7,a.edge);g.box(side*3.65,.2,0,1.15,.4,1.15,a.stone);
      g.box(side*3.65,4.35,0,1.1,.3,1.05,a.accent);
      for(let n=0;n<3;n++)g.box(side*3.65,4.15+n*.19,0,1.1+n*.28,.14,1.1+n*.18,n%2?a.edge:a.accent);
      g.cone(side*3.65,3.95,.5,.26,.32,.55,'#b95e40',8);g.box(side*3.65,3.56,.5,.04,.38,.04,a.accent);
    }
    g.box(0,4.75,0,8.4,.65,.8,a.edge);g.box(0,4.73,.47,2.1,.63,.08,a.stone);
    g.box(0,4.73,.53,1.45,.36,.04,'#345b4d');
    roof(g,0,5.1,0,9.6,2.5,area===1?'#725d74':'#356857');
    roof(g,0,6.05,0,5.5,1.8,area===1?'#85677e':'#447568');
    g.cone(0,6.95,0,.08,.25,.5,a.accent,8);
    for(const side of [-1,1]){g.sphere(side*.29,4.74,.61,.17,.12,.06,a.accent,3,6);g.box(side*.12,4.57,.60,.08,.15,.05,a.accent);}
  });
}
function tree(g:Geometry,x:number,z:number,size:number,area:number,phase=0){
  g.at(x,-.15,z,size,size,size,0,phase,0,()=>{
    const a=AREAS[area];g.cone(0,2,0,.13,.3,4,area===2?'#583c35':'#645d47',7,0,0,Math.sin(phase)*7);
    if(area===0){
      g.box(.65,3.0,0,.17,1.7,.18,'#645d47',0,0,-52);g.box(-.55,3.5,.2,.14,1.5,.16,'#645d47',0,0,50);
      for(let n=0;n<4;n++)g.sphere(Math.sin(n*2.6)*1.15,3.5+n*.37,Math.cos(n*2.6)*.65,2.6-n*.27,.75,2.15-n*.20,n%2?'#3b6b59':'#4b7a61',3,8);
    }
    else if(area===1){
      g.box(.7,3,.1,.17,2,.17,'#66504d',0,0,-55);g.box(-.6,3.5,-.1,.16,1.9,.16,'#66504d',0,0,45);
      for(let n=0;n<5;n++)g.sphere(Math.cos(n*2.4)*1.05,4+Math.sin(n*3.2)*.5,Math.sin(n*2.4)*.85,2.8,1.8,2.4,n%2?'#cb91a5':'#b57d97',4,7);
    }else if(area===2){g.box(-.55,2.5,0,.18,1.8,.18,'#583c35',0,0,48);g.box(.55,3.1,0,.14,1.6,.14,'#583c35',0,0,-48);}
    else {for(let n=0;n<4;n++)g.sphere(Math.cos(n*1.8)*.9,3.7,Math.sin(n*1.8)*.65,2.3,1,2.0,n%2?'#62aba5':'#44857c',4,7);}
  });
}
function peak(g:Geometry,x:number,z:number,radius:number,height:number,hex:string,seed:number){
  const random=new Random(seed),sides=7,levels=[0,.18,.38,.58,.76,.9,1],factors=[1,.91,.78,.64,.49,.30,.16];
  const rings=levels.map((level,index)=>Array.from({length:sides},(_,n)=>{
    const angle=n/sides*Math.PI*2,r=radius*factors[index]*(.85+random.next()*.30);
    return [x+Math.cos(angle)*r+Math.sin(index*.8)*radius*.12,-18+height*level,z+Math.sin(angle)*r] as [number,number,number];
  }));
  for(let r=0;r<rings.length-1;r++)for(let n=0;n<sides;n++)g.quad(rings[r][n],rings[r][(n+1)%sides],rings[r+1][(n+1)%sides],rings[r+1][n],hex);
  for(let n=1;n<sides-1;n++)g.triangle(rings[6][0],rings[6][n],rings[6][n+1],hex);
}
function segmentGeometry(segment:Segment,hazards:Hazard[],quality:string){
  const g=new Geometry(),a=AREAS[segment.area],random=new Random(segment.id*947+311),length=segment.length;
  const gaps=hazards.filter(h=>h.kind==='gap'&&h.d>=segment.start&&h.d<segment.start+length).map(h=>[h.d-segment.start-h.half,h.d-segment.start+h.half]);
  const edges=[0,...gaps.flat(),length];
  for(let i=0;i<edges.length;i+=2){const from=edges[i],to=edges[i+1];if(to<=from)continue;
    g.box(0,-.25,-(from+to)/2,5.8,.5,to-from,a.edge);
    for(let d=from;d<to;d+=2){const len=Math.min(2,to-d);for(let col=0;col<3;col++){
      const tint=(Math.floor(d/2)+col)%3===0?'#ddcfad':a.stone;
      g.box((col-1)*1.87,.005,-d-len/2,1.81,.08,len-.055,tint);
      if((Math.round(d)+col)%7===0){g.box((col-1)*1.87-.32,.049,-d-len*.48,.025,.008,.59,a.edge,0,24);g.box((col-1)*1.87-.14,.049,-d-len*.40,.025,.008,.32,a.edge,0,-41);}
    }}
    for(const side of [-1,1]){
      g.box(side*2.82,.13,-(from+to)/2,.27,.24,to-from,a.edge);
      if(segment.area!==2)g.box(side*2.88,.80,-(from+to)/2,.14,.12,to-from,'#91a186');
    }
  }
  for(let d=1;d<length;d+=4){if(gaps.some(([lo,hi])=>d>lo-1&&d<hi+1))continue;
    for(const side of [-1,1]){g.box(side*2.85,.58,-d,.34,1.15,.34,a.edge);g.box(side*2.85,1.12,-d,.48,.12,.48,a.stone);g.cone(side*2.85,1.26,-d,0,.17,.23,a.accent,4,0,45);}
    if(Math.round(d)%12===1){g.cone(0,-5,-d,2.4,1.3,9,a.edge,5);g.box(0,-.65,-d,6.4,.35,1.1,a.edge);}
  }
  for(let d=10;d<length;d+=quality==='low'?24:17){
    for(const side of [-1,1]){
      const x=side*(7+random.next()*5),height=12+random.next()*14;
      g.cone(x,-height/2+1,-d,3.2,5.2,height,a.edge,5,0,random.next()*80);
      g.sphere(x,.2,-d,6.7,1.5,6.3,a.leaf,3,7);
      tree(g,x,-d,1.1+random.next()*.55,segment.area,random.next()*360);
      if(segment.area===3){g.box(side*4.8,-1,-d,1,.5,5,a.stone);g.cone(side*4.8,1.1,-d,.35,.7,1.9,'#7faeaa',6);g.sphere(side*4.8,2.25,-d,.55,.55,.55,a.accent,4,8);}
    }
  }
  if(segment.id%2===0)gate(g,-16,segment.area);
  // The sign faces the incoming path, and its geometry indicates the actual turn.
  const sign=segment.turn<0?-1:1;
  g.box(0,.1,-length,6,.25,6,a.stone);
  g.box(-sign*3.6,2,-length+6,.3,4,.3,a.edge);g.box(-sign*3.6,3.2,-length+6,2.1,1.1,.16,a.edge);
  g.at(-sign*3.6,3.2,-length+6+.1,sign,1,1,0,0,0,()=>{
    g.quad([-.7,-.12,0],[.25,-.12,0],[.25,.12,0],[-.7,.12,0],a.accent,true);
    g.triangle([.1,-.36,0],[.73,0,0],[.1,.36,0],a.accent,true);
  });
  return g;
}

function character(g:Geometry,skin:Skin,time:number,run:Run,menu:boolean){
  const moving=run.phase==='running',stride=moving?Math.sin(time*16):0,jump=run.jumpAge>=0,slide=run.sliding;
  const dying=run.phase==='dying'||run.phase==='dead',fall=dying&&run.deathKind==='fall',age=run.deathTime;
  const height=fall?-Math.min(8,age*age*9):run.height+(run.wind>0?.65:0),lean=run.wind>0?-22:slide?-65:dying?Math.min(75,age*95):jump?10:0;
  const scale=slide?.82:1;
  g.at(0,height+(slide?.3:0),0,1,scale,1,lean,menu?180:0,(run.targetLane-run.x)*-9,()=>{
    for(const side of [-1,1]){
      const swing=slide?side*12:jump?side*22:stride*side*30;
      g.at(side*.18,.63,0,1,1,1,swing,0,0,()=>{g.cone(0,-.29,0,.13,.105,.58,'#33463e',6);g.box(0,-.59,-.075,.25,.16,.4,'#283a35');g.box(0,-.50,-.03,.22,.12,.25,skin.accent);});
    }
    g.cone(0,1.02,0,.29,.43,.88,skin.color,8);g.cone(0,.64,0,.42,.47,.24,skin.color,8);
    g.box(0,.92,0,.68,.11,.46,skin.accent);g.box(-.19,.82,.28,.17,.30,.09,'#d5c18c');
    g.cone(0,1.49,0,.14,.16,.21,'#e7bd91',7);g.sphere(0,1.77,0,.52,.56,.50,'#efd0ab',5,8);
    g.sphere(0,1.94,.07,.55,.38,.49,'#263a33',4,8);g.sphere(.08,2.11,.13,.26,.27,.25,'#263a33',4,6);
    g.box(.08,2.10,.18,.25,.08,.25,skin.accent);g.cone(0,1.69,.25,.12,.085,.42,'#263a33',6,20);
    // Face details are visible on the main-menu turntable and during turns.
    for(const side of [-1,1])g.sphere(side*.105,1.79,-.225,.055,.065,.035,'#314137',3,5);
    g.sphere(0,1.70,-.25,.075,.09,.05,'#dca47d',3,5);
    for(const side of [-1,1]){
      const angle=slide?-90:jump?-105:-stride*side*35;
      g.at(side*.37,1.40,0,1,1,1,angle,0,side*10,()=>{g.cone(0,-.24,0,.16,.12,.5,skin.color,6);g.cone(0,-.46,0,.12,.10,.14,skin.accent,6);g.sphere(0,-.56,0,.18,.20,.18,'#e8c499',3,6);});
    }
    g.box(0,1.42,.23,.54,.16,.12,skin.accent);
    for(let n=0;n<4;n++)g.box(.12+Math.sin(time*6-n*.9)*.055,1.33-n*.1,.30+n*.20,.22,.08,.25,skin.accent,Math.sin(time*6-n*.8)*9,0,0);
    if(skin.form==='fox'){
      for(const side of [-1,1]){g.cone(side*.23,2.10,0,0,.14,.38,skin.accent,3,0,side*20,side*-15);g.cone(side*.23,2.10,-.01,0,.08,.26,skin.color,3);}
      for(let n=0;n<9;n++)g.at((n-4)*.07,.77,.25,1,1,1,0,(n-4)*14,0,()=>{g.cone(0,-.10,.4,.13,.04,.9,skin.accent,6,65+Math.sin(time*4+n)*7);});
    }
    if(skin.form==='feather')for(const side of [-1,1])for(let n=0;n<4;n++)g.at(side*.30,1.35,.22,1,1,1,0,side*(26+n*10),side*(-20-n*12),()=>g.cone(0,.15,.24,.02,.13,1.0-n*.11,'#e9eee0',4,50));
    if(skin.form==='bifang')for(let n=0;n<5;n++)g.cone((n-2)*.085,2.13+(.15-Math.abs(n-2)*.04),.07,0,.09,.48, n%2?skin.accent:skin.color,3,12,0,(n-2)*-14);
    if(skin.form==='moon'){g.ring(0,2.13,.04,.25,.17,skin.accent,0,.72);g.box(0,1.28,.28,.28,.36,.03,'#b8b9d5',0,0,45);}
  });
}
function beast(g:Geometry,time:number,pressure:number){
  const color='#3a493d',horn='#c6aa71',stride=Math.sin(time*12);
  g.sphere(0,1.0,0,1.8,1.65,2.5,color,5,9);g.sphere(0,1.37,-.85,1.45,1.35,1.2,'#52614c',5,9);
  g.sphere(0,.94,-1.42,1.17,.93,.55,'#a48c61',4,7);g.box(0,.64,-1.72,.62,.19,.1,'#26372d');
  for(const side of [-1,1]){
    g.sphere(side*.40,1.05,-1.65,.25,.12,.05,'#ecb25b',3,6);g.box(side*.25,.69,-1.79,.1,.24,.06,'#e5d2a7');
    g.at(side*.58,1.93,-.66,1,1,1,0,0,side*-30,()=>{g.cone(0,.3,0,.12,.24,.75,horn,7,25);g.cone(0,.68,.12,0,.14,.47,horn,6,70);});
    for(const front of [-1,1]){g.at(side*.67,.78,front*.66,1,1,1,stride*side*front*24,0,0,()=>{g.cone(0,-.3,0,.19,.12,.65,color,6);g.box(0,-.61,-.09,.32,.20,.47,'#29372e');});}
    for(let n=0;n<3;n++)g.cone(side*.80,1.25-n*.22,-.45+n*.35,0,.19,.36,'#293b32',4,0,0,side*-70);
  }
  g.cone(0,1.2,1.35,.05,.17,.85,color,6,70+stride*10);
  if(pressure>.55)g.sphere(0,1.0,-1.7,.33,.22,.05,'#e59b47',3,6);
}

export class ShanhaiArt {
  private readonly staticMeshes=new Map<string,Mesh>();
  private readonly roads=new Map<number,Mesh>();
  private readonly actors=new Batch(26000);
  private readonly items=new Batch(18000);
  private readonly effects=new Batch(9000);
  private readonly scenery=new Map<number,Mesh>();
  private readonly material:Material;
  private readonly waterMaterial:Material;
  private water:Mesh;
  private yaw=0;
  private priorTick=0;
  private lastQuality='';
  private lastSeed=-1;
  private constructor(private readonly ui:GameView,fx:EffectAsset){
    this.material=new Material();this.material.initialize({effectAsset:fx});
    this.waterMaterial=new Material();this.waterMaterial.initialize({effectAsset:fx,defines:{WATER:true}});
    const g=new Geometry();for(let x=-180;x<180;x+=18)for(let z=-180;z<180;z+=18)g.quad([x,-8,z],[x,-8,z+18],[x+18,-8,z+18],[x+18,-8,z],'#4b9698',true);
    this.water=utils.createMesh(g.static());
  }
  static async create(ui:GameView){return new ShanhaiArt(ui,await effect());}
  private backdrop(area:number){
    if(this.scenery.has(area))return this.scenery.get(area)!;
    const g=new Geometry(),random=new Random(215+area),a=AREAS[area];
    for(let n=0;n<42;n++){
      const angle=n/42*Math.PI*2,radius=90+random.next()*75,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius,height=30+random.next()*65;
      peak(g,x,z,12+random.next()*15,height,n%2?a.edge:a.leaf,n*39+area*19+7);
      if(area!==2&&n%4===0)g.sphere(x,height*.56-18,z,12,2.0,10,a.leaf,3,8);
    }
    for(let n=0;n<22;n++)g.sphere(Math.sin(n*4.1)*85,-8-n%4,Math.cos(n*4.1)*85,35,4,24,a.fog,4,9);
    if(area===2)g.box(0,-9,0,340,.8,340,'#b56637');
    const mesh=utils.createMesh(g.static());this.scenery.set(area,mesh);return mesh;
  }
  private obstacle(h:Hazard,area:number){
    const key=h.kind+area;if(this.staticMeshes.has(key))return this.staticMeshes.get(key)!;
    const g=new Geometry(),a=AREAS[area];
    if(h.kind==='root'){
      g.cone(0,.57,0,.50,.58,5.75,'#77624b',8,0,0,90);
      for(let n=0;n<6;n++)g.cone((n-2.5)*.9,.88,.05,0,.17,.55,'#6b6949',5,0,0,n%2?24:-30);
      g.cone(-2.7,1.0,.1,0,.25,1.6,'#696d49',6,0,0,-35);
    }else if(h.kind==='lintel'){
      for(const side of [-1,1])g.box(side*2.65,1.5,0,.35,3,.5,a.edge);
      g.box(0,2.4,0,5.8,.75,1.5,a.edge);roof(g,0,2.79,0,6.7,2.1,a.leaf);
      g.box(0,2.32,.79,1.4,.38,.08,a.accent);g.box(0,2.32,.84,.85,.20,.04,a.edge);
      for(const side of [-1,1])g.box(side*1.7,1.69,.68,.25,.62,.08,side<0?'#b75d49':'#d3bc79');
    }else if(h.kind==='rock'){
      g.sphere(0,.8,0,1.65,1.65,1.55,a.edge,4,7);g.sphere(.13,1.37,.05,1,.8,.9,a.stone,3,6);
      g.box(-.15,1.35,.48,.68,.12,.07,a.accent,0,0,-12);g.box(0,.9,.7,.45,.20,.08,'#395648');
    }else if(h.kind==='fire'){
      g.box(0,.15,0,5.8,.3,1.5,'#614432');
      for(let n=0;n<9;n++){g.cone((n-4)*.62,.67,.1,0,.33,1.25,n%2?'#e39a45':'#c9663b',5,0,n*32,(n%3-1)*10);g.cone((n-4)*.62,.55,.37,0,.16,.7,'#f3cb71',5);}
    }else if(h.kind==='blade'){
      g.sphere(0,.8,0,1.55,1.55,1.55,'#7b8b7e',4,8);
      for(let n=0;n<8;n++)g.at(0,.8,0,1,1,1,0,0,n*45,()=>g.cone(0,.89,0,0,.16,.5,a.accent,4));
      g.sphere(0,.8,.72,.48,.48,.12,a.accent,4,8);
    }
    const mesh=utils.createMesh(g.static());this.staticMeshes.set(key,mesh);return mesh;
  }
  draw(run:Run,skin:Skin,delta:number,idle:number,quality:string,reducedMotion=false){
    const ui=this.ui,a=AREAS[run.area],menu=run.phase==='ready';
    if(this.lastSeed!==run.seed||run.tick<this.priorTick||quality!==this.lastQuality){for(const [id,mesh] of this.roads){const node=ui.objects.get('segment'+id);node?.destroy();ui.objects.delete('segment'+id);mesh.destroy();}this.roads.clear();this.yaw=run.segment.heading;this.lastSeed=run.seed;this.lastQuality=quality;}
    const target=run.segment.heading;
    if(Math.abs(run.tick-this.priorTick)>100||menu)this.yaw=target;
    else this.yaw+=(target-this.yaw)*Math.min(1,Math.max(delta,1/60)*(reducedMotion?16:9));
    this.priorTick=run.tick;
    const origin=run.sample(run.distance,run.x*.55),c=Math.cos(this.yaw),s=Math.sin(this.yaw),time=menu?idle:run.time;
    const transform=(x:number,z:number)=>({x:(x-origin.x)*c+(z-origin.z)*s,z:-(x-origin.x)*s+(z-origin.z)*c});
    const point=(d:number,lane=0)=>{const p=run.sample(d,lane);return {...transform(p.x,p.z),heading:(p.heading-this.yaw)*180/Math.PI,area:p.area};};
    this.material.setProperty('fogColor',new Color().fromHEX(a.fog));this.material.setProperty('params',new Vec4(38,155,time,0));
    this.waterMaterial.setProperty('fogColor',new Color().fromHEX(a.fog));this.waterMaterial.setProperty('params',new Vec4(30,155,reducedMotion?0:time,0));
    ui.camera.clearColor=new Color().fromHEX(a.sky);ui.camera.fov=ui.width/ui.height<.43?59:55;
    const shake=!reducedMotion&&run.stumbleRemaining>0?Math.sin(run.time*48)*run.stumbleRemaining*.08:0;
    ui.camera.node.setPosition(shake,menu?6.5:4.7,menu?10.5:8.3);ui.camera.node.lookAt(new Vec3(0,menu?0:1.1,menu?(ui.height<650?-3.5:-8):-12));
    ui.meshNode('distant-mountains',this.backdrop(run.area),this.material,0,0,0).setRotationFromEuler(0,this.yaw*180/Math.PI,0);
    if(run.area===3)ui.meshNode('sea',this.water,this.waterMaterial,0,0,0);
    for(const segment of run.segments){
      if(segment.start>run.distance+(quality==='low'?110:160)||segment.start+segment.length<run.distance-18)continue;
      let mesh=this.roads.get(segment.id);if(!mesh){mesh=utils.createMesh(segmentGeometry(segment,run.hazards,quality).static());this.roads.set(segment.id,mesh);}
      const p=transform(segment.x,segment.z);ui.meshNode('segment'+segment.id,mesh,this.material,p.x,0,p.z).setRotationFromEuler(0,-(segment.heading-this.yaw)*180/Math.PI,0);
    }
    for(const [id,mesh]of this.roads)if(id<run.currentSegment-2){mesh.destroy();this.roads.delete(id);const node=ui.objects.get('segment'+id);node?.destroy();ui.objects.delete('segment'+id);}
    let obstacleIndex=0;
    for(const h of run.hazards){if(h.kind==='gap'||h.d<run.distance-8||h.d>run.distance+100)continue;const p=point(h.d,run.hazardLane(h));
      const node=ui.meshNode('obstacle'+obstacleIndex++,this.obstacle(h,p.area),this.material,p.x,0,p.z);node.setRotationFromEuler(0,-p.heading,h.kind==='blade'?time*130:0);
    }
    const coins=this.items.geometry;coins.reset();
    for(const item of run.pickups){if(item.taken||item.d<run.distance-2||item.d>run.distance+(quality==='low'?65:90))continue;const p=point(item.d,item.lane),y=item.height+Math.sin(time*3+item.id)*.07;
      if(item.kind==='jade'){coins.ring(p.x,y,p.z,.24,.115,'#f2c861',time*75+item.id*19);coins.sphere(p.x,y,p.z,.09,.11,.09,'#fff0bc',3,4);}
      else {coins.ring(p.x,y,p.z,.65,.59,AREAS[p.area].accent,time*20);coins.sphere(p.x,y,p.z,.55,.65,.55,item.kind==='shield'?'#80c6b0':item.kind==='wind'?'#e5d2b5':item.kind==='scroll'?'#ebc576':'#c38eb6',4,8);}
    }
    this.items.draw(ui,'collectibles',this.material);
    const actors=this.actors.geometry;actors.reset();const hero=point(run.distance,run.x);
    actors.at(hero.x,0,hero.z,1,1,1,0,-hero.heading,0,()=>character(actors,skin,time,run,menu));
    if(!menu){const gap=run.deathKind==='caught'&&run.deathTime>0?Math.max(.7,2.5-run.deathTime*2):run.distance<25?3.9+run.distance*.07:2.5+(1-Math.min(1,run.pressure))*4.2,p=point(run.distance-gap);actors.at(p.x,0,p.z,.87,.87,.87,0,-p.heading,0,()=>beast(actors,time,run.pressure));}
    else {const p=point(run.distance+11);actors.at(p.x,0,p.z,1.05,1.05,1.05,0,180-p.heading,0,()=>beast(actors,time,.3));}
    this.actors.draw(ui,'actors',this.material);
    const fx=this.effects.geometry;fx.reset();
    fx.at(hero.x,.04,hero.z,1,1,1,90,0,0,()=>fx.ring(0,0,0,.65,0,'#35584d55'));
    if(run.shield>0)fx.ring(hero.x,1.1+run.height,hero.z+.15,.95,.91,'#92edc999',0);
    if(run.magnet>0)for(let n=0;n<3;n++)fx.ring(hero.x,1.0+run.height,hero.z,.6+n*.25,.57+n*.25,'#e3c0eb70',time*50+n*60);
    if(run.wind>0)for(let n=0;n<9;n++)fx.box(hero.x+Math.sin(n*2.4)*.8,1.0+Math.cos(n*2.4)*.6,hero.z+1+n*.3,.035,.035,.8,'#e9e8c8a0');
    if(!reducedMotion)for(let n=0;n<(quality==='low'?12:32);n++){
      const x=Math.sin(n*7.2+time*.15)*12,y=2+(n*3.17+time*.8)%8,z=-((n*4.17-time*1.4)%60+60)%60;
      fx.box(x,y,z,.07,run.area===2?.20:.04,.14,run.area===1?'#e9b4c6b0':run.area===2?'#ffc47cc0':'#e1d6ab80',n*30+time*20,time*12,n*20);
    }
    this.effects.draw(ui,'air-and-magic',this.material);
  }
  metrics(){return [['actors',this.actors],['collectibles',this.items],['air-and-magic',this.effects]].map(([id,batch])=>{
    const node=this.ui.objects.get(id as string),renderer=node?.getComponent(MeshRenderer);
    return {id,active:(batch as Batch).geometry.count>0&&(node?.active??false),vertices:(batch as Batch).geometry.count,drawn:renderer?.model?.subModels[0]?.inputAssembler?.indexCount??null};
  });}
  destroy(){for(const mesh of [...this.staticMeshes.values(),...this.roads.values(),...this.scenery.values()])mesh.destroy();this.actors.mesh.destroy();this.items.mesh.destroy();this.effects.mesh.destroy();this.water.destroy();this.material.destroy();this.waterMaterial.destroy();}
}
