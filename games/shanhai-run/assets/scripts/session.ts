import {Run,pilot,type Action,type Mode} from './core';
import {Journey,dateKey,daySeed} from './profile';

/** Owns input, tutorial gates and durable settlement on every host. */
export class Session {
  run=new Run();
  id=0;
  lesson=0;
  waiting:Action|null=null;
  private savedTick=0;
  constructor(readonly journey:Journey){}
  get hint(){return this.waiting?[
    '前方盘根 · 上滑或按 ↑ 跳跃',
    '低梁挡路 · 下滑或按 ↓ 滑铲',
    '石障在中央 · 向左滑动避开',
    '古道向左 · 在路口向左转弯',
  ][this.lesson]:'';}
  begin(mode:Mode,trial=0){
    if(mode==='trial'&&(trial<0||trial>=this.journey.data.unlocked))return false;
    this.save();this.id=this.journey.begin(mode);
    this.run=new Run({mode,trial,seed:mode==='daily'?daySeed(dateKey()):mode==='training'?42:(Date.now()^this.id*2654435761)>>>0,upgrades:this.journey.data.upgrades});
    this.run.start();this.lesson=0;this.waiting=null;this.savedTick=0;
    if(this.id)this.journey.message='';return true;
  }
  input(action:Action){
    if(this.run.mode==='training'&&this.lesson<4&&!this.waiting)return false;
    if(this.waiting&&action!==this.waiting)return false;
    const accepted=this.run.input(action);
    if(accepted&&this.waiting){this.waiting=null;this.lesson++;}return accepted;
  }
  step(){
    const s=this.run;
    if(s.mode==='training'&&s.phase==='running'&&this.lesson<4){
      const obstacle=s.hazards.find(h=>h.kind===['root','lintel','rock'][this.lesson]&&!h.passed);
      if((this.lesson<3&&obstacle&&obstacle.d-s.distance<s.speed*.52)||(this.lesson===3&&s.canTurn))this.waiting=(['jump','slide','left','left'] as Action[])[this.lesson];
      if(this.waiting)return;
    }
    s.step();
    if(s.tick-this.savedTick>=120||((s.phase==='dead'||s.phase==='won')&&!this.journey.data.active?.finished))this.save();
  }
  save(){const saved=this.journey.checkpoint(this.id,this.run);if(saved)this.savedTick=this.run.tick;return saved;}
  pause(){this.run.pause();this.save();}
  resume(){this.run.resume();}
  home(){this.save();this.run=new Run();this.waiting=null;}
  rescue(){
    const s=this.run;
    if(s.phase!=='dead'||s.revived||['daily','training'].includes(s.mode))return false;
    this.save();
    if(!this.journey.rescue(this.id)){if(this.journey.data.coins<150)this.journey.message='还魂需要 150 灵玉，可回山门完成任务领取。';return false;}
    return s.revive();
  }
  /** Public player actions only: no life restoration or altered obstacles. */
  play(frames:number){for(let n=0;n<Math.min(200000,frames)&&this.run.phase==='running';n++){if(this.waiting)this.input(this.waiting);else if(this.run.mode!=='training')pilot(this.run);this.step();}this.save();}
}
