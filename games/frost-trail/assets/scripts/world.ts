import {GameState}from'./domain/simulation/GameState';import{CollisionWorld}from'./domain/world/CollisionWorld';import{BALANCE,RESOURCE}from'./domain/simulation/Balance';import{distance,seededRandom}from'./domain/utils/math';import{INITIAL_NODES,STATIC_OBSTACLES}from'./world-layout';
import {Point3} from './domain/utils/Point3';
export interface Point{x:number;z:number}
export interface ResourceNode extends Point{id:string|number;hp:number;active:boolean;cooldown:number;hit:number;scale?:number;maxHp:number;homeX?:number;homeZ?:number;phase?:number;angle?:number;yield?:number;chopFactor?:number;noRespawn?:boolean;kind?:string;respawnTime?:number}
export interface Drop extends Point{id:number;type:string;y:number;vy:number;age:number}
export interface WorldFeedback{sound:(name:string)=>void;burst:(at:{x:number;y:number;z:number},color:number,count:number,force:number)=>void;swing:(p:Point,angle:number,scale:number)=>void}
export class Player{
 position:Point;velocity={x:0,z:0};path:Point[]=[];goal:Point|null=null;axes={x:0,y:0};yaw=0;targetYaw=0;moving=false;travelled=0;walkTime=0;action=0;aimTime=0;fishing=false;blockedTime=0;replans=0;azimuth=22*Math.PI/180;
 constructor(readonly state:GameState,readonly collision:CollisionWorld){this.position=collision.nearestFree(state.position)??{x:-2.2,z:2.1};state.position={...this.position}}
 moveTo(p:Point){this.path=this.collision.findPath(this.position,p);this.goal=this.path.length?{...this.path[this.path.length-1]}:null;this.blockedTime=this.replans=0;return this.path.length>0}
 stop(){this.goal=null;this.path=[];this.velocity={x:0,z:0};this.moving=false;this.axes={x:0,y:0};this.blockedTime=this.replans=0}
 getCashPickupPosition(out=new Point3()){const c=Math.cos(this.yaw),s=Math.sin(this.yaw);return out.set(this.position.x+.30*c+.10*s,1.02,this.position.z-.30*s+.10*c)}
 swing(){this.action=1}aim(x:number,z:number){this.aimTime=.15;this.targetYaw=Math.atan2(x-this.position.x,z-this.position.z)}
 update(dt:number){
  if(!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.05);const manual=Math.hypot(this.axes.x,this.axes.y)>.08;let dx=0,dz=0;
  if(manual){this.path=[];this.goal=null;this.blockedTime=this.replans=0;const c=Math.cos(this.azimuth),s=Math.sin(this.azimuth);dx=this.axes.x*c+this.axes.y*s;dz=-this.axes.x*s+this.axes.y*c}
  else if(this.path.length){const next=this.path[0];dx=next.x-this.position.x;dz=next.z-this.position.z;const d=Math.hypot(dx,dz);if(d<.12){this.path.shift();dx=dz=0}else{const q=Math.min(1,d/(BALANCE.speed*dt))/d;dx*=q;dz*=q}}
  const response=1-Math.exp(-(dx*dx+dz*dz?18:24)*dt);this.velocity.x+=(dx*BALANCE.speed-this.velocity.x)*response;this.velocity.z+=(dz*BALANCE.speed-this.velocity.z)*response;if(this.velocity.x**2+this.velocity.z**2<.001)this.velocity={x:0,z:0};const x=this.position.x,z=this.position.z;
  this.collision.move(this.position,this.velocity.x*dt,this.velocity.z*dt);const travelled=Math.hypot(this.position.x-x,this.position.z-z);this.moving=travelled>.0005;this.travelled+=travelled;
  if(!manual&&this.path.length&&this.goal){const node=this.path[0],before=Math.hypot(node.x-x,node.z-z),after=distance(node,this.position);this.blockedTime=before-after<dt*.1?this.blockedTime+dt:0;if(this.blockedTime>=.45){this.blockedTime=0;this.replans++;const route=this.replans<=3?this.collision.findPath(this.position,this.goal):[];if(route.length){this.path=route;this.velocity={x:0,z:0}}else this.stop()}}else if(!this.path.length)this.goal=null;
  if(this.moving){this.targetYaw=Math.atan2(this.velocity.x,this.velocity.z);this.walkTime+=dt*12}
  if(this.moving||this.action>0||this.aimTime>0)this.yaw+=Math.atan2(Math.sin(this.targetYaw-this.yaw),Math.cos(this.targetYaw-this.yaw))*(1-Math.exp(-14*dt));Object.assign(this.state.position,this.position);this.action=Math.max(0,this.action-dt*3.8);this.aimTime=Math.max(0,this.aimTime-dt);
 }
}
/** Player and workers consume the same finite nodes. Rendering cannot grant resources. */
export class ResourceWorld{
 readonly nodes:ResourceNode[];readonly angles=new Map<string|number,number>();drops:Drop[];time=0;cooldown=0;nextDropId=1;prompt='';private random=seededRandom(616);
 constructor(readonly state:GameState,readonly player:Player,readonly collision:CollisionWorld,readonly feedback:WorldFeedback){
  const saved=new Map(state.world.nodes.map((n:any)=>[n.id,n]));this.nodes=INITIAL_NODES.map(node=>{const d={...node},n:any=saved.get(d.id);if(n){d.hp=n.active?Math.max(1,n.hp):0;d.active=n.active;d.cooldown=n.cooldown;if(typeof d.id==='number'){d.x=Math.max(d.homeX!-.5,Math.min(d.homeX!+.5,n.x));d.z=Math.max(d.homeZ!-.5,Math.min(d.homeZ!+.5,n.z))}}return d});
  for(const n of this.nodes)this.angles.set(n.id,n.angle??0);for(const n of this.nodes)if(this.tree(n)&&n.active)collision.add(n.id,n.x,n.z,.6,.6);this.drops=state.world.drops;state.world.nodes=this.nodes;for(const d of this.drops)this.nextDropId=Math.max(this.nextDropId,d.id+1);for(let i=0;i<100;i++)this.random();
 }
 tree(n:ResourceNode){return typeof n.id==='string'&&n.id.includes('tree-')}
 canRespawn(n:ResourceNode,r:number){return distance(n,this.player.position)>r&&!this.state.camp.workers.some((w:any)=>distance(n,w)<r)}
 drop(type:string,x:number,z:number,count:number){if(!Object.prototype.hasOwnProperty.call(RESOURCE,type)||type==='cash'||!Number.isFinite(x)||!Number.isFinite(z)||!Number.isSafeInteger(count)||count<1||count>BALANCE.maxDrops-this.drops.length)return 0;for(let i=0;i<count;i++){const a=i*2.4+this.random(),r=.24+this.random()*.70;this.drops.push({id:this.nextDropId++,type,x:x+Math.cos(a)*r,z:z+Math.sin(a)*r,y:.35,vy:1.2+this.random(),age:0});this.random()}return count}
 strike(d:ResourceNode,p:Point,worker=false){if(!d.active||distance(d,p)>2.05)return null;const isTree=this.tree(d),count=d.yield??(isTree?8:5);if(!worker&&d.hp<=1&&this.drops.length+count>BALANCE.maxDrops){this.prompt='地面资源较多 · 先拾取，再继续采集';return null}d.hp--;d.hit=1;this.feedback.swing(p,Math.atan2(d.x-p.x,d.z-p.z),worker?.72:1);this.feedback.burst({x:d.x,y:isTree?1:.7,z:d.z},isTree?0xc28b52:0xe7f7ff,worker?5:10,2.4);if(!worker)this.feedback.sound(isTree?'chop':'hit');if(d.hp>0)return null;d.active=false;d.cooldown=d.respawnTime??(isTree?BALANCE.treeRespawn:BALANCE.bearRespawn);if(isTree)this.collision.remove(d.id);this.feedback.burst({x:d.x,y:.8,z:d.z},isTree?0xf2faff:0xffd0cb,worker?10:18,3.2);return{type:isTree?'wood':'raw',count}}
 update(dt:number){
  this.time+=dt;this.cooldown=Math.max(0,this.cooldown-dt);this.prompt='';const p=this.player.position;
  for(const d of this.nodes){const tree=this.tree(d);d.hit=Math.max(0,d.hit-dt*(tree?5:4));if(!d.active){d.cooldown-=dt;if(!d.noRespawn&&d.cooldown<=0&&this.canRespawn(d,tree?1.5:2)){d.active=true;d.hp=d.maxHp??3;if(tree)this.collision.add(d.id,d.x,d.z,.6,.6)}}else if(!tree&&distance(d,p)>=2){d.phase!+=dt*.28;d.x=d.homeX!+Math.sin(d.phase!)*.40;d.z=d.homeZ!+Math.cos(d.phase!*.8)*.35;const angle=Math.atan2(Math.cos(d.phase!),-Math.sin(d.phase!*.8)*.8);const yaw=this.angles.get(d.id)??0;this.angles.set(d.id,yaw+Math.atan2(Math.sin(angle-yaw),Math.cos(angle-yaw))*(1-Math.exp(-2*dt)))}}
  for(let i=this.drops.length-1;i>=0;i--){const d=this.drops[i];d.age=Math.min(3600,d.age+dt);d.vy-=dt*7;d.y=Math.max(.15,d.y+d.vy*dt);if(d.y<=.15)d.vy=0;if(d.age>.15&&distance(d,p)<BALANCE.pickupRadius&&this.state.freeSlots>0&&this.state.add(d.type,{collected:true})){this.drops.splice(i,1);this.feedback.burst({x:d.x,y:.45,z:d.z},d.type==='wood'?0xf2d2a4:0xffd7c0,3,.7);this.feedback.sound('pickup')}}
  if(this.state.freeSlots<1){if(distance(p,{x:0,z:0})>6)this.prompt='背包装满了 · 回集市出售';return}if(this.player.moving&&Math.hypot(this.player.velocity.x,this.player.velocity.z)>.75)return;
  const nearest=(tree:boolean,r:number)=>this.nodes.filter(n=>n.active&&this.tree(n)===tree&&distance(n,p)<r).sort((a,b)=>distance(a,p)-distance(b,p))[0];const target=nearest(true,1.75)??nearest(false,1.9);
  if(!target){if(this.nodes.some(n=>n.noRespawn&&!n.active&&distance(n,p)<2.2))this.prompt='密林已枯竭 · 树桩留在雪原';return}const tree=this.tree(target);this.prompt=tree?'正在伐木':target.kind==='rabbit'?'正在捕猎雪兔':'正在获取食材';if(this.cooldown>0)return;
  this.cooldown=(tree?BALANCE.chopInterval*(target.chopFactor??1):BALANCE.huntInterval)/(this.state.getGatherMultiplier(tree?'wood':'raw')*this.state.getLampGatherFactor(p.x,p.z)*this.state.getGatherBuffFactor());this.player.swing();this.player.aim(target.x,target.z);const loot=this.strike(target,p);if(loot){this.drop(loot.type,(target.x+p.x)/2,(target.z+p.z)/2,loot.count);if(target.kind==='rabbit'){const poached=this.state.checkPoaching(target.homeX,target.homeZ);if(poached)this.prompt=`偷猎警告 · ${poached} 关系 -2`}}
 }
}
export function createWorldCollision(){const c=new CollisionWorld();for(const[k,v]of STATIC_OBSTACLES)c.obstacles.set(k,{...v});return c}
