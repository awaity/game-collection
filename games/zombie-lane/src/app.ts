import { Game, STEP, clamp } from './core/game';
import type { Difficulty } from './core/game';
import type { Platform, PointerInput } from './platform/types';
import { World } from './render/world';
import { UI } from './render/ui';
export class App {
  game:Game;
  world:World;
  ui=new UI();
  sound=true;
  help=false;
  records={normal:0,hard:0};
  height=800;
  clock=0;
  toast='';
  toastTime=0;
  manual=false;
  onUIChange?:()=>void;
  private ctx:CanvasRenderingContext2D;
  private drag:{id:number;x:number;target:number}|null=null;
  private keys=new Set<string>();
  private accumulator=0;
  private last=0;
  private frame=0;
  private resultSaved=false;
  private cleanups:(()=>void)[]=[];
  private uiSignature='';
  private helpWasPlaying=false;
  constructor(public platform:Platform){
    const ctx=platform.canvas.getContext('2d',{alpha:false});if(!ctx)throw new Error('无法创建 Canvas 2D 渲染环境');this.ctx=ctx;
    const saved=platform.read('zombie.settings.v1') as {sound?:unknown;difficulty?:unknown}|null;
    this.sound=saved?.sound!==false;platform.setSound(this.sound);
    const records=platform.read('zombie.records.v1') as Record<string,unknown>|null;
    for(const difficulty of ['normal','hard'] as const){const n=records?.[difficulty];if(typeof n==='number'&&Number.isFinite(n))this.records[difficulty]=clamp(n,0,10000000);}
    this.game=new Game(saved?.difficulty==='hard'?'hard':'normal');this.world=new World(platform);
    this.preview();this.resize();this.last=platform.now();
    this.cleanups.push(platform.onPointer(e=>this.pointer(e)),platform.onKey((key,down)=>this.key(key,down)),platform.onResize(()=>this.resize()),platform.onVisibility(visible=>{if(!visible){this.pause();this.keys.clear();this.drag=null;}this.last=platform.now();this.accumulator=0;}));
    this.frame=platform.requestFrame(now=>this.loop(now));
  }
  private preview(){for(let i=0;i<16;i++)this.game.spawn(i===11?'brute':i%5===0?'runner':'walker',8+(i*5.1)%25,.5+(i*1.1)%3.2);}
  private settings(){this.platform.write('zombie.settings.v1',{sound:this.sound,difficulty:this.game.difficulty});}
  start(){this.platform.unlockAudio();this.game=new Game(this.game.difficulty);this.game.start();this.help=false;this.resultSaved=false;this.manual=false;this.keys.clear();this.drag=null;this.accumulator=0;this.world.reset();this.notify('先向左打门，拿到双发子弹',4);}
  home(){const difficulty=this.game.difficulty;this.game=new Game(difficulty);this.help=false;this.manual=false;this.world.reset();this.preview();this.keys.clear();this.drag=null;this.toastTime=0;}
  pause(){if(this.game.phase==='playing'){this.game.pause();this.keys.clear();this.drag=null;this.accumulator=0;}}
  notify(message:string,seconds=2.4){this.toast=message;this.toastTime=seconds;}
  action(id:string){
    this.platform.unlockAudio();
    if(id==='start'||id==='retry')this.start();
    else if(id==='home')this.home();
    else if(id==='pause'){this.pause();}
    else if(id==='resume'){this.game.resume();this.accumulator=0;}
    else if(id==='help'){this.helpWasPlaying=this.game.phase==='playing';this.pause();this.help=true;}
    else if(id==='close-help'){this.help=false;if(this.game.phase==='ready')this.start();else if(this.helpWasPlaying)this.game.resume();}
    else if(id==='sound'){this.sound=!this.sound;this.platform.setSound(this.sound);this.settings();}
    else if(id==='difficulty'&&this.game.phase==='ready'){this.game.difficulty=this.game.difficulty==='normal'?'hard':'normal';this.settings();}
    else if(id==='airstrike'){this.game.airstrike();this.consumeEvents();}
    else if(id==='left'&&this.game.phase==='playing')this.game.setTarget(-2.6);
    else if(id==='right'&&this.game.phase==='playing')this.game.setTarget(2.2);
    if(id!=='airstrike'){this.platform.unlockAudio();this.platform.sound('click');}
    this.render();
  }
  private pointer(e:PointerInput){
    const vp=this.platform.viewport(),x=e.x/vp.width*420,y=e.y/vp.height*this.height;
    if(e.type==='down'){
      if(this.drag)return;
      const button=this.ui.buttons.find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);
      if(button){this.action(button.id);return;}
      if(this.game.phase!=='playing'||this.help)return;
      this.platform.unlockAudio();this.drag={id:e.id,x,target:this.game.targetX};
    }else if(e.type==='move'&&this.drag?.id===e.id){this.game.setTarget(this.drag.target+(x-this.drag.x)/34);}
    else if((e.type==='up'||e.type==='cancel')&&this.drag?.id===e.id)this.drag=null;
  }
  private key(key:string,down:boolean){
    if(!down){this.keys.delete(key);return;}
    if(this.keys.has(key))return;this.keys.add(key);
    if(this.help){if(key==='Escape'||key==='Enter')this.action('close-help');return;}
    if(key==='Space'||key==='Escape'){
      if(this.game.phase==='ready')this.action('start');else if(this.game.phase==='playing')this.pause();else if(this.game.phase==='paused')this.action('resume');
    }else if(key==='KeyE')this.action('airstrike');
    else if(key==='KeyR')this.action('retry');
    else if(key==='Enter'&&this.game.phase==='ready')this.action('start');
  }
  private resize(){
    const v=this.platform.viewport();this.height=420*v.height/v.width;
    this.platform.canvas.width=Math.round(v.width*v.dpr);this.platform.canvas.height=Math.round(v.height*v.dpr);this.render();this.onUIChange?.();
  }
  private consumeEvents(){
    const events=this.game.drainEvents();this.world.events(events);
    for(const e of events){
      if(e.kind==='shot')this.platform.sound(e.tier===2?'heavy':'shot');
      if(e.kind==='damage'){this.platform.sound('hurt');if(this.game.hp<35)this.platform.vibrate();}
      if(e.kind==='upgrade'){this.platform.sound('upgrade');this.notify(e.text!,3);}
      if(e.kind==='wave'||e.kind==='boss')this.notify(e.text!,3.2);
      if(e.kind==='airstrike'){this.platform.sound('blast');this.notify(e.text!,2);}
      if(e.kind==='win'||e.kind==='lose'){this.platform.sound(e.kind);this.saveResult();}
    }
  }
  private saveResult(){if(this.resultSaved)return;this.resultSaved=true;this.records[this.game.difficulty]=Math.max(this.records[this.game.difficulty],this.game.score);this.platform.write('zombie.records.v1',this.records);}
  advance(ticks:number,target?:number,bomb=false){
    this.manual=true;if(bomb)this.game.airstrike();
    for(let i=0;i<Math.min(12000,ticks);i++){this.game.step(target);this.consumeEvents();this.world.animate(STEP);}
    this.render();return this.game.summary();
  }
  private loop(now:number){
    this.frame=this.platform.requestFrame(t=>this.loop(t));
    const dt=clamp((now-this.last)/1000,0,.1);this.last=now;this.clock+=dt;
    if(this.game.phase==='playing'&&!this.manual){
      this.accumulator+=dt;
      while(this.accumulator>=STEP){
        const dir=(this.keys.has('KeyD')||this.keys.has('ArrowRight')?1:0)-(this.keys.has('KeyA')||this.keys.has('ArrowLeft')?1:0);
        if(dir)this.game.setTarget(this.game.targetX+dir*STEP*10);
        this.game.step();this.consumeEvents();this.accumulator-=STEP;
      }
    }else this.accumulator=0;
    if(this.game.phase!=='paused'){this.world.animate(dt);this.toastTime=Math.max(0,this.toastTime-dt);}
    this.render();
  }
  render(){
    const v=this.platform.viewport(),scale=this.platform.canvas.width/420;this.ctx.setTransform(scale,0,0,scale,0,0);
    const time=this.game.phase==='ready'?(this.platform.reducedMotion?0:this.clock):this.game.time;
    this.world.draw(this.ctx,this.game,this.height,time);
    this.ui.draw(this.ctx,this.game,this.height,{sound:this.sound,help:this.help,best:this.records[this.game.difficulty],toast:this.toast,toastTime:this.toastTime,clock:this.clock,safeTop:v.safeTop/v.height*this.height,safeBottom:v.safeBottom/v.height*this.height});
    const signature=this.ui.buttons.map(b=>b.id+':'+b.label).join('|')+this.game.phase+this.game.tier+this.game.wave+Math.floor(this.game.hp/25);
    if(signature!==this.uiSignature){this.uiSignature=signature;this.onUIChange?.();}
  }
  dispose(){this.platform.cancelFrame(this.frame);this.cleanups.forEach(f=>f());}
}
