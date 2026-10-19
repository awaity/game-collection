import {Career} from '@game-collection/platform/progression';
import {CareerPanel} from '@game-collection/platform/progression-panel';
import {createGame,LEVELS} from './simulation/game.js';
export class Campaign {
  constructor(read,write,start){
    this.career=new Career(read('volley-run.career.v1'),v=>write('volley-run.career.v1',v));
    this.panel=new CareerPanel(this.career,()=>LEVELS.map((l,i)=>({name:l.name,description:['增员与武器舱','密集追击阵线','最终巨像防线','反向补给 · 林间伏击','冰川回廊 · 双路敌群','环线冲刺 · 终局补给'][i]})),start,'小队集合站');
    this.endless=false;this.wave=1;this.kills=0;this.seconds=0;this.run=0;this.eligible=false;
  }
  start(level,mode='play',data=null,continuing=false){
    if(!continuing){this.wave=1;this.kills=0;this.seconds=0;this.eligible=mode==='play';this.run=this.eligible?this.career.begin(this.endless?'endless':'stage'):0;}
    const modifiers=mode==='replay'?data.modifiers:mode==='play'?{...this.career.data.upgrades,pressure:this.endless?Math.min(30,this.wave-1):0,carry:continuing?this.carry:0}:undefined;
    const game=createGame({level,seed:data?.seed??((LEVELS[level].seed+(this.endless?this.wave*7919:0))>>>0),version:data?.version??2,modifiers});
    game.skin=this.career.skin;return game;
  }
  checkpoint(g){if(this.eligible)this.career.checkpoint(this.run,{kills:this.kills+g.stats.kills,seconds:this.seconds+g.tick/60,waves:this.endless?this.wave-(g.phase==='won'?0:1):0,clear:!this.endless&&g.phase==='won'?String(g.level):undefined});}
  next(g){this.checkpoint(g);this.kills+=g.stats.kills;this.seconds+=g.tick/60;this.carry=Math.min(96,Math.max(8,g.troops.length)+2);this.wave++;return (g.level+1)%LEVELS.length;}
}
