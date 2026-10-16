import{GameState}from'./domain/simulation/GameState';import{CampProduction}from'./domain/simulation/CampProduction';import{CounterStaff}from'./domain/simulation/CounterStaff';import{InteractionSystem}from'./domain/systems/InteractionSystem';import{QuestSystem}from'./domain/systems/QuestSystem';import{Point3}from'./domain/utils/Point3';import{RESOURCE,STATIONS,STONE_WALL_SEGMENTS}from'./domain/simulation/Balance';import{Player,ResourceWorld,createWorldCollision}from'./world';import{Workers}from'./workers';
export type VisualEvent={type:string;at:Point3;color?:number;count?:number;force?:number;resource?:string;to?:Point3|(()=>Point3);duration?:number;arc?:number;age:number};
export class CampFeedback{
 events:VisualEvent[]=[];sounds:string[]=[];
 sound=(name:string)=>{if(this.sounds.length<60)this.sounds.push(name)};
 burst=(p:{x:number;y:number;z:number},color:number,count:number,force:number)=>{if(this.events.length<180)this.events.push({type:'burst',at:new Point3(p.x,p.y,p.z),color,count,force,age:0})};
 swing=(p:{x:number;z:number},angle:number,scale:number)=>{if(this.events.length<180)this.events.push({type:'swing',at:new Point3(p.x,.7,p.z),arc:angle,force:scale,age:0})};
 fly=(resource:string,from:Point3,to:Point3|(()=>Point3),options:{duration?:number;arc?:number}={})=>{if(this.events.length<180)this.events.push({type:'flight',at:from.clone(),resource,to,duration:options.duration??.4,arc:options.arc??1,age:0})};
 update(dt:number){this.events=this.events.filter(e=>(e.age+=dt)<(e.duration??.7))}
}
/** Original fixed-step ordering, independently testable without Cocos or platform globals. */
export class FrostGame{
 readonly state:GameState;readonly collision=createWorldCollision();readonly player:Player;readonly resources:ResourceWorld;readonly workers:Workers;readonly production:CampProduction;readonly staff:CounterStaff;readonly interaction:InteractionSystem;readonly quest:QuestSystem;readonly feedback=new CampFeedback();
 readonly map={opening:false,expansion:0};paused=false;time=0;toast='';toastTime=0;private unsubscribers:(()=>unknown)[]=[];
 constructor(data:Record<string,unknown>={}){
  this.state=new GameState(data);this.time=this.state.elapsed;this.map.expansion=this.state.unlockedPond?1:0;this.syncWorld();this.player=new Player(this.state,this.collision);
  this.resources=new ResourceWorld(this.state,this.player,this.collision,this.feedback);this.workers=new Workers(this.state,this.collision,this.resources);this.production=new CampProduction(this.state);this.staff=new CounterStaff(this.state,this.collision);
  const audio={play:this.feedback.sound},inventory={add:(type:string,options?:{collected:boolean})=>this.state.add(type,options),getTopWorldPosition:()=>this.stackPosition()};
  this.interaction=new InteractionSystem({state:this.state,player:this.player,inventory,map:this.map,effects:this.feedback,audio,notify:(text:string)=>this.notify(text)});
  this.quest=new QuestSystem(this.state,(text:string)=>this.notify(text),audio);
  this.unsubscribers.push(this.state.events.on('pond',()=>{this.map.opening=true;this.map.expansion=0}));
 }
 get stackHeight(){return this.state.inventory.reduce((n:number,i:any)=>n+(RESOURCE[i.type]?.height??.2)+.013,0)}
 stackPosition(){return new Point3(this.player.position.x,.91+this.stackHeight,this.player.position.z-.41)}
 notify(text:string){this.toast=text;this.toastTime=3.2}
 pause(value=true){this.paused=value;this.player.stop()}
 private syncWorld(){
  const c=this.state.camp;if(this.state.unlockedPond&&!this.map.opening){this.collision.remove('gate');this.collision.remove('locked-land');this.collision.add('pond-water',13.2,1.4,7.70,7.85)}
  if(c.purchases.stoneWall)for(const [i,s]of STONE_WALL_SEGMENTS.entries())this.collision.add('stone-wall-'+i,s.x,s.z,s.w,s.d);
  if(c.purchases.watchPost)this.collision.add('watch-post',5.9,4.6,.95,.95);
  if(c.purchases.corral)this.collision.add('corral-pen',STATIONS.corral.x,STATIONS.corral.z-.2,3.4,1.6);
  if(c.purchases.greenhouse)this.collision.add('greenhouse',STATIONS.greenhouse.x,STATIONS.greenhouse.z,1.8,1);
 }
 step(dt=1/60){
  if(this.paused||!Number.isFinite(dt)||dt<=0||dt>.05)return;const s=this.state;this.time+=dt;s.elapsed+=dt;s.dayNight.update(dt);s.aiCamps.update(dt);s.annexation.update(dt);s.caravans.update(dt);s.tickSieges(dt);s.endgame.update(dt);
  this.player.update(dt);this.resources.update(dt);this.workers.update(dt);this.interaction.update(dt);this.production.update(dt,{manualPriority:this.interaction.fire.inside&&(s.count('raw')>0||s.count('fish')>0)});this.staff.update(dt);this.quest.update();
  if(this.map.opening){this.map.expansion=Math.min(1,this.map.expansion+dt/1.5);if(this.map.expansion>=1)this.map.opening=false}
  this.syncWorld();this.feedback.update(dt);this.toastTime=Math.max(0,this.toastTime-dt);
 }
 snapshot(){return{...this.state.snapshot(),player:{...this.player.position,moving:this.player.moving,path:this.player.path.map(p=>({...p}))},paused:this.paused,prompt:this.interaction.prompt||this.resources.prompt,quest:{title:this.quest.current.title,progress:this.quest.progress,total:this.quest.current.total,guidance:this.quest.guidance}}}
 destroy(){this.workers.destroy();this.interaction.dispose();for(const fn of this.unsubscribers)fn();this.state.events.clear()}
}
