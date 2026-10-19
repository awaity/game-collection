// Deterministic pilot uses only pointer movement and visible entities. No HP,
// weapon, time, damage or enemy state is changed by the strategy.
import {Game,WIDTH,HEIGHT} from '../src/core/game';
export function flyMission(mission:number){
 const g=new Game('stage','normal');g.configure(mission);g.start();
 for(let tick=0;tick<18000&&g.phase==='playing';tick++){
  const p=g.player;
  const target=g.boss??g.enemies.filter(e=>e.y>0&&e.y<p.y-80).sort((a,b)=>b.y-a.y)[0];
  const supply=g.powerUps.find(s=>s.y>p.y-150&&s.y<p.y+30);
  let best={score:-Infinity,x:p.x,y:p.y};
  for(const dx of[-5,0,5])for(const dy of[-5,0,5]){
   const x=Math.max(25,Math.min(WIDTH-25,p.x+dx)),y=Math.max(170,Math.min(HEIGHT-30,p.y+dy));
   let score=-Math.abs(x-(supply?.x??target?.x??WIDTH/2))*.03-Math.abs(y-(supply?.y??HEIGHT-160))*.015;
   for(const b of g.enemyBullets){const d=Math.hypot(x-b.x-b.vx*5,y-b.y-b.vy*5)-b.radius-p.radius;score-=1500/Math.max(1,d)**2;}
   for(const e of g.enemies){const d=Math.hypot(x-e.x,y-e.y-e.speed*5)-e.radius-p.radius;score-=1500/Math.max(1,d)**2;}
   if(score>best.score)best={x,y,score};
  }
  g.step({x:best.x,y:best.y});g.drainEvents();
 }
 return g;
}
