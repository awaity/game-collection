import {Battle,type Mode} from './core';
import {Armory,daySeed} from './profile';
export class Session {
 battle=new Battle();id=0;lastWave=0;earned=0;saveFailed=false;
 private attempted='';
 constructor(readonly armory:Armory){}
 begin(stage=0,mode:Mode='campaign',seed?:number){if(this.id&&!this.checkpoint(true))return false;const id=this.armory.begin(stage,mode);if(!id)return false;this.id=id;this.lastWave=0;this.earned=0;this.saveFailed=false;this.attempted='';this.battle=new Battle(stage,mode,seed??(mode==='daily'?daySeed(this.armory.currentDay()):daySeed('run/'+id)),this.armory.loadout());this.battle.start();return true;}
 private checkpointKey(){return `${this.battle.wave}:${this.battle.phase==='won'||this.battle.phase==='lost'?'terminal':'wave'}`;}
 step(){this.battle.step();if(this.id&&(this.battle.wave!==this.lastWave||this.battle.phase==='won'||this.battle.phase==='lost')&&this.attempted!==this.checkpointKey())this.checkpoint();}
 checkpoint(finish=false){if(!this.id||this.armory.data.active?.finished)return true;this.attempted=this.checkpointKey();const ok=this.armory.checkpoint(this.id,this.battle,finish);if(ok){this.earned+=this.armory.lastEarned;this.lastWave=this.battle.wave;}this.saveFailed=!ok;return ok;}
 home(){if(this.id&&!this.checkpoint(true))return false;this.id=0;this.battle=new Battle();return true;}
 pause(){this.battle.pause();}
 resume(){this.battle.resume();}
 /** Test drivers use the same visible choices, with untouched health and enemies. */
 play(frames:number){for(let n=0;n<Math.min(200000,Math.max(0,Math.floor(frames)));n++){
  if(this.battle.phase==='choice'){const cards=this.battle.cards;const score=(id:string)=>id==='learn:thermo'?100:id==='learn:frost'?90:id==='learn:electron'?80:id==='learn:ray'?70:id.includes('salvo')?60:id.includes('power')?50:id.includes('haste')?45:30;const chosen=[...cards].sort((a,b)=>score(b.id)-score(a.id))[0];if(chosen)this.battle.choose(chosen.id);}
  this.step();if(this.battle.phase==='won'||this.battle.phase==='lost')break;
 }return this.battle.snapshot();}
}
