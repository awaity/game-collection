import type { Game } from '../src/core/game';
import type { PlantKind } from '../src/core/content';

// Plays using only the same economy, placement, cooldown and collection APIs as a human.
export function defend(game: Game) {
  game.collectAll();
  const has = (row: number, col: number) => game.plants.some(p => p.row === row && p.col === col);
  const put = (kind: PlantKind, row: number, col: number) => !game.canPlant(kind, row, col) && game.plant(kind, row, col);
  const guns = (row: number) => game.plants.filter(p => p.row === row && ['pea', 'ice', 'repeater'].includes(p.kind));
  const danger = [...game.zombies].sort((a, b) => a.x - b.x);
  for (const z of danger) if (!guns(z.row).length) put('pea', z.row, 2);
  if (game.config.production) {
    const count = game.plants.filter(p => p.kind === 'sunflower').length;
    if (count < 5) for (let row = 0; row < 5; row++) if (!has(row, 0)) { put('sunflower', row, 0); break; }
  }
  for (const z of danger) {
    if (z.x < 4.8 && game.zombies.filter(k => Math.abs(k.row - z.row) <= 1 && Math.abs(k.x - z.x) < 1.6).length >= 3) put('cherry', z.row, Math.max(0, Math.min(8, Math.floor(z.x))));
    if (z.x < 6.2 && guns(z.row).length && !has(z.row, 6)) put('wallnut', z.row, 6);
    if (z.x > 8.8 && game.config.allowed.includes('mine') && z.kind !== 'runner') put('mine', z.row, 5);
  }
  for (let row = 0; row < 5; row++) if (!guns(row).length) put('pea', row, 2);
  const covered = Array.from({ length: 5 }, (_, r) => guns(r).length > 0).every(Boolean);
  if (covered && game.config.production && game.elapsed < 100) for (let row = 0; row < 5; row++) if (!has(row, 1)) { put('sunflower', row, 1); break; }
  const rows = Array.from({ length: 5 }, (_, r) => r).sort((a, b) => guns(a).length - guns(b).length);
  if (covered) for (const row of rows) put(game.config.allowed.includes('repeater') && game.config.production ? 'repeater' : 'pea', row, 3);
  if (covered) for (const row of rows) if (guns(row).length >= 2 && game.config.allowed.includes('ice')) put('ice', row, 4);
  if (covered) for (const row of rows) if (guns(row).length >= 2) put('pea', row, 4);
  if (game.config.allowed.includes('mushroom')) for (let row = 0; row < 5; row++) if (!has(row, 4)) put('mushroom', row, 4);
}
export function play(game: Game, seconds = 600): Game {
  for (let t = 0; t < seconds && game.state === 'playing'; t += .25) { defend(game); game.update(.25); game.sounds.length = 0; }
  return game;
}
