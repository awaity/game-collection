/** Runnable first milestone. Full source rule port follows this verified loop. */
export type Phase='ready'|'playing'|'paused'|'victory'|'defeat';
export class Surge {
  phase:Phase='ready';tick=0;x=0;target=0;distance=0;energy=0;troops=1;kills=0;score=0;
  boss=[599,1699];gateHP=[26,130,440];gateTaken=[false,false,false];laser=false;demo=false;
  start(demo=false){this.phase='playing';this.demo=demo;}
  pause(){if(this.phase==='playing')this.phase='paused';}
  resume(){if(this.phase==='paused')this.phase='playing';}
  aim(x:number){if(Number.isFinite(x)){this.target=Math.max(-4.35,Math.min(4.35,x));this.demo=false;}}
  step(){
    if(this.phase!=='playing')return;this.tick++;this.distance+=3.35/60;
    if(this.demo)this.target=this.energy<4?0:this.boss[0]===0&&this.troops<8?3.18:-3.12;
    this.x+=(this.target-this.x)*.15;
    if(Math.abs(this.x)<1.1)this.energy=Math.min(12,this.energy+5/60);
    this.laser=this.energy>0&&this.x<-1.2;
    if(this.laser){this.energy=Math.max(0,this.energy-3.9/60);this.score+=2;this.kills+=this.tick%7===0?1:0;const boss=this.distance>=110?1:0;if(this.distance>25&&this.boss[boss]>0)this.boss[boss]=Math.max(0,this.boss[boss]-(48+this.troops*25)/60);}
    if(this.x>1.2){for(let i=0;i<3;i++){if(this.gateTaken[i]||(i===2&&this.boss[0]>0))continue;this.gateHP[i]=Math.max(0,this.gateHP[i]-this.troops*12/60);if(this.gateHP[i]===0){this.gateTaken[i]=true;this.troops=Math.min(150,this.troops+[1,5,99][i]);}break}}
    if(this.boss.every(h=>h===0)){this.phase='victory';this.score+=8500;}
    else if(this.distance>=165)this.phase='defeat';
  }
}
