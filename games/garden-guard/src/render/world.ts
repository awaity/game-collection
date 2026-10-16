import type { Biome } from '../core/content';
import type { Game } from '../core/game';
import { drawMower, drawPlant, drawZombie } from './actors';
import { C, box, ellipse, label, line, path, round, sunIcon, type Ctx, type Rect } from './draw';

export function background(ctx: Ctx, w: number, h: number, night = false) {
  ctx.fillStyle = night ? '#183e41' : '#eaf0d8'; ctx.fillRect(0, 0, w, h);
  const wash = ctx.createLinearGradient(0, 0, 0, h);
  wash.addColorStop(0, night ? '#284b56' : '#dcebcf'); wash.addColorStop(1, night ? '#143b34' : '#f2f2dc'); ctx.fillStyle = wash; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.globalAlpha = night ? .08 : .06;
  for (let x = 16; x < w; x += 38) for (let y = 18; y < h; y += 38) ellipse(ctx, x + (y % 76 ? 10 : 0), y, 1, 1, C.ink);
  ctx.restore();
  for (const [x, y, s, rot] of [[-12, 110, 1.2, -.4], [w + 12, h - 70, 1.7, 2.5]] as number[][]) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = night ? .17 : .24;
    line(ctx, [0, 100, 12, -70], '#56894d', 4);
    for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(8, 50 - i * 25); ctx.rotate(i % 2 ? -.8 : .8); ellipse(ctx, 0, -18, 10, 24, '#83ae60'); ctx.restore(); }
    ctx.restore();
  }
}
function flower(ctx: Ctx, x: number, y: number, scale: number, color: string) {
  line(ctx, [x, y, x, y + 9 * scale], '#609446', scale * 2);
  for (let i = 0; i < 5; i++) ellipse(ctx, x + Math.cos(i * 1.26) * 4 * scale, y + Math.sin(i * 1.26) * 4 * scale, 3 * scale, 3 * scale, color);
  ellipse(ctx, x, y, 2.5 * scale, 2.5 * scale, '#f4c953');
}
export function gardenIllustration(ctx: Ctx, rect: Rect, time: number, biome: Biome = 'day') {
  ctx.save(); ctx.translate(rect.x, rect.y); ctx.scale(rect.w / 700, rect.h / 430);
  const night = biome === 'night';
  ellipse(ctx, 370, 222, 303, 181, night ? '#375e61' : '#cfdfb9');
  ellipse(ctx, 559, 94, 36, 36, night ? '#ebdfad' : '#f7d77b');
  if (night) ellipse(ctx, 573, 83, 31, 31, '#375e61');
  for (const [x, y] of [[210, 79], [440, 45], [600, 150]]) { ellipse(ctx, x, y, 38, 11, '#f6f5dc'); ellipse(ctx, x + 12, y - 8, 18, 16, '#f6f5dc'); }
  for (let i = 0; i < 8; i++) ellipse(ctx, 160 + i * 68, 193 + Math.sin(i * 3) * 14, 49, 46, night ? '#47714f' : '#94b56b');
  // Picket fence behind the raised garden bed.
  line(ctx, [143, 198, 642, 158], '#bca77d', 9);
  line(ctx, [147, 174, 639, 134], '#e9dfba', 8);
  for (let i = 0; i < 20; i++) { const x = 149 + i * 25, y = 161 - i * 2; path(ctx, [x - 6, y + 40, x - 6, y - 16, x, y - 24, x + 6, y - 16, x + 6, y + 39], '#f5e9c5', '#c8bb92', 1); }
  path(ctx, [83, 230, 610, 186, 681, 363, 148, 416, 83, 395], '#8e6843', '#765637', 2);
  path(ctx, [82, 216, 610, 173, 681, 348, 148, 400], '#b18c57', '#765637', 3);
  ctx.save();
  ctx.transform(1, -.08, .35, .8, 96, 221);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
    ctx.fillStyle = (r + c) % 2 ? '#91bd64' : '#a3c96e'; ctx.fillRect(c * 55, r * 36, 55, 36);
    line(ctx, [c * 55 + 15, r * 36 + 25, c * 55 + 13, r * 36 + 20, c * 55 + 18, r * 36 + 23], '#81ac56', 1.5);
  }
  ctx.restore();
  // A little house anchors the left edge of the garden.
  box(ctx, { x: 26, y: 168, w: 97, h: 132 }, '#e5c99a', 3, '#976b48', 3);
  path(ctx, [12, 174, 75, 105, 137, 166, 123, 179, 73, 131, 27, 186], '#b86d4e', '#79533c', 3);
  for (let i = 0; i < 4; i++) line(ctx, [34 + i * 9, 157 - i * 10, 79 + i * 10, 119 + i * 10], '#d29162', 3);
  box(ctx, { x: 61, y: 227, w: 38, h: 72 }, '#765b42', 8, '#84613e', 3); ellipse(ctx, 89, 263, 3, 3, '#e1c471');
  box(ctx, { x: 44, y: 186, w: 42, h: 30 }, night ? '#f1d27f' : '#a3cbcd', 3, '#fff0c9', 5); line(ctx, [65, 186, 65, 215], '#fff0c9', 4);
  path(ctx, [56, 303, 104, 301, 135, 360, 83, 365], '#c4b48b');
  drawPlant(ctx, 'sunflower', 215, 253, 78, time); drawPlant(ctx, 'sunflower', 238, 323, 75, time + 1);
  drawPlant(ctx, 'pea', 315, 279, 83, time + 2); drawPlant(ctx, 'pea', 340, 350, 78, time);
  drawPlant(ctx, 'wallnut', 438, 319, 84, time); drawPlant(ctx, 'ice', 390, 216, 68, time + 3);
  drawZombie(ctx, 'cone', 558, 257, 91, time); drawZombie(ctx, 'walker', 597, 328, 86, time + 2);
  ellipse(ctx, 466, 268, 7, 6, '#c5e47e', '#608c44', 2); ellipse(ctx, 492, 262, 4, 4, '#c5e47e');
  sunIcon(ctx, 282, 160, 17, time);
  for (let i = 0; i < 14; i++) flower(ctx, 156 + i * 36, 399 - i * 3.6, .8, i % 3 ? '#fff0c2' : '#df956f');
  drawMower(ctx, 135, 270, 33);
  ctx.restore();
}
export interface BoardLayout extends Rect { cw: number; rh: number }
export function drawBoard(ctx: Ctx, game: Game, b: BoardLayout, time: number, cursor: { row: number; col: number } | null, selected: string | null, reducedMotion: boolean) {
  const night = game.config.biome === 'night';
  const frame = { x: b.x - 9, y: b.y - 9, w: b.w + 18, h: b.h + 18 };
  box(ctx, { ...frame, y: frame.y + 5 }, '#715339', 9);
  box(ctx, frame, '#b79b65', 9, '#7b6949', 2);
  ctx.save(); round(ctx, b.x, b.y, b.w, b.h, 3); ctx.clip();
  for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
    const x = b.x + c * b.cw, y = b.y + r * b.rh;
    ctx.fillStyle = night ? (r + c) % 2 ? '#527c58' : '#5a855e' : (r + c) % 2 ? '#91bd65' : '#9dc76e'; ctx.fillRect(x, y, b.cw, b.rh);
    ctx.strokeStyle = night ? 'rgba(26,62,45,.13)' : 'rgba(72,111,47,.13)'; ctx.lineWidth = 1; ctx.strokeRect(x, y, b.cw, b.rh);
    for (let i = 0; i < 3; i++) { const xx = x + ((c * 13 + r * 27 + i * 17) % 80) / 90 * b.cw + 2, yy = y + ((c * 17 + i * 11) % 60) / 70 * b.rh + 3; line(ctx, [xx - 2, yy, xx, yy + 3, xx + 2, yy - 1], night ? '#608a60' : '#87b45a', 1); }
  }
  if (cursor) { const x = b.x + cursor.col * b.cw, y = b.y + cursor.row * b.rh; box(ctx, { x: x + 1, y: y + 1, w: b.cw - 2, h: b.rh - 2 }, 'rgba(255,244,179,.25)', 3, '#fff1a2', 2); if (selected && selected !== 'shovel') { ctx.globalAlpha = .38; drawPlant(ctx, selected as Parameters<typeof drawPlant>[1], x + b.cw / 2, y + b.rh * .56, Math.min(b.cw * .95, b.rh * .88), time); ctx.globalAlpha = 1; } }
  ctx.restore();
  for (let row = 0; row < 5; row++) {
    const cy = b.y + row * b.rh + b.rh * .55;
    const mower = game.mowers[row];
    if (mower.state !== 'used') drawMower(ctx, b.x + mower.x * b.cw, cy + b.rh * .12, Math.min(36, b.cw * .75));
    for (const p of game.plants.filter(p => p.row === row)) {
      const x = b.x + (p.col + .5) * b.cw;
      drawPlant(ctx, p.kind, x, cy, Math.min(b.cw * 1.06, b.rh * .91), reducedMotion ? 0 : time, p.hp / p.maxHp, p.age >= 9);
      if (p.hp < p.maxHp * .9 && p.kind !== 'cherry') { box(ctx, { x: x - b.cw * .3, y: cy + b.rh * .38, w: b.cw * .6, h: 3 }, 'rgba(39,67,36,.35)', 2); box(ctx, { x: x - b.cw * .3, y: cy + b.rh * .38, w: b.cw * .6 * p.hp / p.maxHp, h: 3 }, p.hp / p.maxHp > .3 ? '#ecdf80' : '#df805a', 2); }
      if (p.kind === 'mine' && p.age < 9) { box(ctx, { x: x - b.cw * .25, y: cy + b.rh * .32, w: b.cw * .5, h: 3 }, '#776b41', 2); box(ctx, { x: x - b.cw * .25, y: cy + b.rh * .32, w: b.cw * .5 * p.age / 9, h: 3 }, '#f8ca58', 2); }
    }
    ctx.save(); ctx.beginPath(); ctx.rect(b.x - b.cw, b.y - b.rh, b.w + b.cw + 12, b.h + b.rh); ctx.clip();
    for (const z of game.zombies.filter(z => z.row === row).sort((a, b) => b.x - a.x)) {
      const size = Math.min(b.cw * (z.kind === 'giant' ? 1.6 : 1.3), b.rh * (z.kind === 'giant' ? 1.15 : 1.05));
      drawZombie(ctx, z.kind, b.x + z.x * b.cw, cy, size, reducedMotion ? 0 : z.age, z.hp / z.maxHp, z.slow > 0);
      if (z.kind === 'giant' || z.kind === 'bucket') { box(ctx, { x: b.x + z.x * b.cw - 14, y: cy - size * .64, w: 28, h: 3 }, '#6e7351', 2); box(ctx, { x: b.x + z.x * b.cw - 14, y: cy - size * .64, w: 28 * z.hp / z.maxHp, h: 3 }, '#eab774', 2); }
    }
    for (const shot of game.projectiles.filter(p => p.row === row)) { const x = b.x + shot.x * b.cw; ellipse(ctx, x, cy - b.rh * .13, shot.spore ? 3 : 4.8, shot.spore ? 3 : 4.5, shot.ice ? '#bdeff1' : shot.spore ? '#e4c9e9' : '#d0e991', shot.ice ? '#71b8c7' : '#638f3f', 1.5); }
    ctx.restore();
  }
  if (game.config.biome === 'fog') {
    ctx.save(); const fog = ctx.createLinearGradient(b.x + b.w * .67, 0, b.x + b.w + 10, 0); fog.addColorStop(0, 'rgba(230,241,216,0)'); fog.addColorStop(1, 'rgba(230,241,216,.58)'); ctx.fillStyle = fog; ctx.fillRect(b.x + b.w * .67, b.y, b.w * .33, b.h); ctx.restore();
  }
  for (const fx of game.effects) {
    const x = b.x + fx.x * b.cw, y = b.y + (fx.row + .5) * b.rh, phase = 1 - fx.life / fx.max;
    ctx.save(); ctx.globalAlpha = fx.life / fx.max;
    if (fx.kind === 'boom') { ellipse(ctx, x, y, (phase * 1.3 + .3) * b.cw, (phase * 1.2 + .3) * b.rh, '#f9d571'); ellipse(ctx, x, y, phase * b.cw * .7, phase * b.rh * .7, '#fff1b0'); }
    else if (fx.kind === 'sun') label(ctx, `+${fx.value}`, x, y - phase * 28, 19, '#fff0a0', 800, 'center');
    else if (!reducedMotion) for (let i = 0; i < 5; i++) ellipse(ctx, x + Math.cos(i * 1.3) * phase * 22, y + Math.sin(i * 1.3) * phase * 18, 3, 2, fx.kind === 'hit' ? '#e0f1a0' : '#cae18e');
    ctx.restore();
  }
  for (const sun of game.suns) { if (sun.age > 13 && Math.floor(time * 6) % 2 && !reducedMotion) continue; sunIcon(ctx, b.x + sun.x * b.cw, b.y + (sun.y + .4) * b.rh, Math.min(17, b.cw * .43), reducedMotion ? 0 : time); }
}
