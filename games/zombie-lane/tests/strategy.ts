import type { Game } from '../src/core/game.ts';
/** Only issues the same movement/airstrike inputs a player can issue. */
export function steer(game:Game){
  const nearest=Math.min(40,...game.enemies.map(e=>e.z));
  if((game.enemies.filter(e=>e.z<10).length>5||!!game.boss&&game.boss.z<21)&&game.time>=game.bombReadyAt)game.airstrike();
  return game.gate&&nearest>(game.tier<1?6:12)&&game.gateIndex<7?-2.6:2.3;
}
