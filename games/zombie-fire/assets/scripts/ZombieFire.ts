import {_decorator,Component,Input,KeyCode} from 'cc';
import {GameView} from 'db://assets/collection/runtime';
import {BattlefieldArt} from './art';
import {BattleAudio} from './audio';
import {BattlefieldUI} from './hud';
import {Armory} from './profile';
import {Session} from './session';
import {DT,type Mode} from './core';
const {ccclass}=_decorator;
@ccclass('ZombieFire')
export class ZombieFire extends Component {
 private ui!:GameView;private art!:BattlefieldArt;private sound!:BattleAudio;private hud!:BattlefieldUI;private session!:Session;private ready=false;private accumulator=0;private keys=new Set<number>();
 async start(){
  this.ui=new GameView('zombie-fire.save.v1','#34434c');this.session=new Session(new Armory(this.ui.platform.load(null),p=>this.ui.platform.save(p)));this.art=new BattlefieldArt(this.ui);this.sound=new BattleAudio(this.node);
  this.hud=new BattlefieldUI(this.ui,this.session,(mode,stage)=>this.begin(mode,stage),()=>{if(this.session.home()){this.hud.panel='';this.accumulator=0;}});
  this.ui.onHide=()=>{this.session.pause();this.sound.pause();this.accumulator=0;this.keys.clear();this.session.checkpoint();};
  this.ui.onKey=(e,down)=>{
   if(!down){this.keys.delete(e.keyCode);return;}if(this.keys.has(e.keyCode))return;this.keys.add(e.keyCode);
   this.sound.activate();const b=this.session.battle;if(e.keyCode>=49&&e.keyCode<=51&&b.phase==='choice'){const card=b.cards[e.keyCode-49];if(card){b.choose(card.id);this.session.armory.completeTutorial();}}
   if(e.keyCode===KeyCode.SPACE||e.keyCode===KeyCode.ESCAPE||e.keyCode===KeyCode.KEY_P){if(this.hud.panel)this.hud.panel='';else if(b.phase==='paused')this.session.resume();else this.session.pause();this.accumulator=0;}
   if(e.keyCode===KeyCode.KEY_R&&b.phase==='choice')b.reroll();
  };
  this.ui.onTouch=(e,phase)=>{if(phase!=='end'||e.getType()===Input.EventType.TOUCH_CANCEL||this.hud.panel)return;const p=e.getUILocation(),x=p.x-this.ui.width/2,y=p.y-this.ui.height/2;const over=Array.from(this.ui.buttons.values()).some(b=>b.node.active&&Math.abs(x-b.node.position.x)<b.width/2&&Math.abs(y-b.node.position.y)<b.height/2);if(!over){const point=this.art.hitTest(x,y);this.session.battle.aim(point.x,point.y);}};
  await Promise.all([this.ui.ready,this.sound.ready]);this.ready=true;
  const qa=globalThis as {__COLLECTION_TEST__?:boolean;__collectionAdvance?:(n:number)=>void;__zombieFire?:unknown};
  if(qa.__COLLECTION_TEST__){qa.__collectionAdvance=n=>{for(let i=0;i<Math.min(200000,Math.max(0,Math.floor(n)));i++)this.session.step();this.update(0);};qa.__zombieFire={play:(n:number)=>{const state=this.session.play(n);this.update(0);return state;},state:()=>this.session.battle.snapshot()};}
 }
 private begin(mode:Mode,stage:number){if(this.session.id&&!this.session.checkpoint(true))return;if(this.session.begin(stage,mode)){this.sound.activate();this.hud.panel='';this.accumulator=0;this.keys.clear();}}
 update(delta:number){
  if(!this.ready)return;this.accumulator+=Math.min(.1,delta);while(this.accumulator>=DT){this.session.step();this.accumulator-=DT;}
  const b=this.session.battle,p=this.session.armory.data,ui=this.ui;if(ui.entrance)ui.entrance.reduced=!p.settings.motion||ui.services.reducedMotion;
  const events=b.drainEvents();this.sound.update(events,b.phase,p.settings,delta);
  ui.begin();this.art.draw(b,Math.min(.1,delta),p.skin,p.settings.motion&&!ui.services.reducedMotion,events,p.settings.quality);this.hud.draw();
  const phase=b.phase==='ready'?'menu':b.phase==='paused'?'paused':b.phase==='lost'||b.phase==='won'?'result':'playing';ui.platform.state(phase);
  ui.end({slug:'zombie-fire',...b.snapshot(),phase,battlePhase:b.phase,panel:this.hud.panel,coins:p.coins,scrap:p.scrap,unlocked:p.unlocked,stars:p.stars,skin:p.skin,team:p.team,earned:this.session.earned,saveFailed:this.session.saveFailed,profile:p,field:{width:this.art.width,height:this.art.height,bottom:this.art.bottom,offset:this.art.offset},renderNodes:ui.objects.size+ui.texts.size+ui.buttons.size});
  // Inventory IDs grow as gems are merged; release old page controls instead of
  // keeping one node for every item ever inspected during a long session.
  for(const [id,button]of ui.buttons)if(!button.node.active&&/^gem:(equip|merge):/.test(id)){button.node.destroy();ui.buttons.delete(id);}
 }
 onDestroy(){this.session?.checkpoint();this.sound?.destroy();this.art?.destroy();this.ui?.destroy();}
}
