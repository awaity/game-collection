import type { PlantKind, ZombieKind } from '../core/content';
import { C, box, ellipse, line, path, type Ctx } from './draw';

// Shared procedural artwork: local, resolution-independent, and available in native mini games.
export function drawPlant(ctx: Ctx, kind: PlantKind, x: number, y: number, size: number, time = 0, health = 1, armed = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 80, size / 80);
  ellipse(ctx, 0, 28, 26, 7, 'rgba(27,65,28,.18)');
  const sway = Math.sin(time * 2.3 + x * .01) * 2;
  const outline = '#355e32';
  if (!['wallnut', 'cherry', 'mine'].includes(kind)) {
    line(ctx, [0, 25, 1, -6], outline, 7);
    path(ctx, [0, 22, -13, 10, -27, 13, -17, 25], '#65a843', outline, 2);
    path(ctx, [0, 25, 14, 8, 25, 11, 17, 24], '#86be4d', outline, 2);
  }
  ctx.translate(sway, 0);
  if (kind === 'sunflower') {
    for (let i = 0; i < 10; i++) { ctx.save(); ctx.translate(0, -13); ctx.rotate(i * Math.PI / 5); ellipse(ctx, 0, -23, 9, 14, '#f6c94f', '#c28d31', 2); ctx.restore(); }
    ellipse(ctx, 0, -13, 20, 20, '#925d35', '#69482e', 2.5);
    ellipse(ctx, -6, -16, 2.7, 4, '#2b3926'); ellipse(ctx, 7, -16, 2.7, 4, '#2b3926');
    ctx.beginPath(); ctx.arc(1, -11, 8, .15, Math.PI - .15); ctx.strokeStyle = '#422c24'; ctx.lineWidth = 2; ctx.stroke();
    ellipse(ctx, -12, -7, 3.5, 2, '#d58c4a'); ellipse(ctx, 13, -7, 3.5, 2, '#d58c4a');
  } else if (['pea', 'ice', 'repeater'].includes(kind)) {
    const main = kind === 'ice' ? '#8ad6de' : kind === 'repeater' ? '#65b65a' : '#9bd463';
    const shade = kind === 'ice' ? '#4d9ead' : '#528e3e';
    if (kind === 'repeater') { path(ctx, [-14, -29, -25, -39, -4, -32, -8, -44, 8, -29], '#397c44', outline, 2); }
    ellipse(ctx, -4, -14, 24, 22, main, outline, 2.8);
    path(ctx, [8, -25, 31, -24, 34, -4, 9, -5], main, outline, 2.8);
    ellipse(ctx, 32, -14, 9, 13, main, outline, 2.5); ellipse(ctx, 34, -14, 4.5, 8, shade);
    ellipse(ctx, -9, -21, 3.2, 5, C.ink); ellipse(ctx, -10, -23, 1, 1.5, '#fff');
    ellipse(ctx, -17, -11, 5, 3, kind === 'ice' ? '#b0eced' : '#bbdf81');
    if (kind === 'ice') path(ctx, [-23, -29, -26, -42, -14, -36, -7, -44, 1, -34], '#b8edf0', '#5c9f9a', 2);
    if (kind === 'repeater') line(ctx, [-15, -29, -5, -26], outline, 3);
  } else if (kind === 'wallnut') {
    ellipse(ctx, 0, -2, 25, 33, '#b3834b', '#775438', 3);
    ellipse(ctx, -2, -6, 21, 27, '#cba36c');
    for (const [xx, yy] of [[-13, -19], [12, -16], [-16, 8], [14, 12], [3, 23]]) ellipse(ctx, xx, yy, 2, 3, '#b48b56');
    ellipse(ctx, -8, -10, 5.5, 7, '#fff6da'); ellipse(ctx, 8, -10, 5.5, 7, '#fff6da');
    ellipse(ctx, -6, -8, 2.6, 4, C.ink); ellipse(ctx, 10, -8, 2.6, 4, C.ink);
    ellipse(ctx, 2, 6, 5, health < .45 ? 6 : 3, '#705238');
    if (health < .65) line(ctx, [-15, -29, -8, -20, -13, -11, -5, 0], '#81613b', 2);
    if (health < .3) line(ctx, [15, 21, 5, 15, 12, 6], '#81613b', 2);
  } else if (kind === 'cherry') {
    line(ctx, [-13, 0, -3, -30, 13, -35, 17, -1], '#4c7d35', 4);
    path(ctx, [2, -30, 13, -45, 27, -42, 13, -30], '#7faf45', '#436c33', 2);
    ellipse(ctx, -15, 8, 19, 21, '#e9685b', '#923e38', 2.5); ellipse(ctx, 17, 8, 19, 21, '#d55150', '#923e38', 2.5);
    for (const k of [-15, 17]) { ellipse(ctx, k - 5, 4, 2.5, 4, C.ink); ellipse(ctx, k + 6, 4, 2.5, 4, C.ink); line(ctx, [k - 8, -4, k - 2, -2], C.ink, 2); ellipse(ctx, k - 7, -1, 4, 3, '#f59b7d'); }
  } else if (kind === 'mine') {
    ellipse(ctx, 0, 22, 30, 8, '#866641'); ellipse(ctx, 0, 14, 23, armed ? 17 : 10, armed ? '#c8a573' : '#a78b62', '#725636', 2.5);
    line(ctx, [0, 1, 0, -12], '#6b7751', 3); ellipse(ctx, 0, -14, 6, 6, armed ? '#e66a51' : '#61714a', '#634c32', 2);
    ellipse(ctx, -8, 12, 2, 3, C.ink); ellipse(ctx, 8, 12, 2, 3, C.ink);
  } else if (kind === 'mushroom') {
    box(ctx, { x: -14, y: -7, w: 28, h: 35 }, '#e4d9ba', 11, '#786b71', 2.5);
    ellipse(ctx, 0, -10, 30, 22, '#aa8cc5', '#6c567f', 3); ellipse(ctx, -10, -19, 8, 5, '#d9c4e4'); ellipse(ctx, 14, -13, 6, 7, '#d9c4e4');
    ellipse(ctx, -6, 11, 2.4, 3.2, C.ink); ellipse(ctx, 6, 11, 2.4, 3.2, C.ink);
    ellipse(ctx, 0, 20, 6, 3, '#9474ac');
  }
  ctx.restore();
}
export function drawZombie(ctx: Ctx, kind: ZombieKind, x: number, y: number, size: number, time = 0, health = 1, frozen = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 90, size / 90);
  const step = Math.sin(time * (kind === 'runner' ? 8 : 4)) * 5;
  const skin = frozen ? '#8abfc0' : '#9bab7d', dark = '#40554b';
  ellipse(ctx, 0, 37, 25, 6, 'rgba(20,45,33,.18)');
  line(ctx, [-8, 16, -11 + step, 31, -18 + step, 34], '#4c5966', 10);
  line(ctx, [9, 16, 12 - step, 30, 5 - step, 34], '#596476', 9);
  path(ctx, [-17, -18, 17, -15, 19, 18, -18, 18], kind === 'runner' ? '#bf6251' : kind === 'giant' ? '#6d6854' : '#8c725b', dark, 2.5);
  path(ctx, [-4, -18, 4, -18, 6, 11, 0, 18, -5, 10], '#d48669', dark, 1.5);
  line(ctx, [-14, -10, -27, -3, -35, -8], '#90755c', 8); line(ctx, [-34, -8, -42, -11], skin, 6);
  line(ctx, [13, -8, 4, 2, -15, -1], '#90755c', 8); line(ctx, [-15, -1, -24, -4], skin, 6);
  ctx.save(); ctx.translate(-5, -28 + Math.sin(time * 3) * 1.5); ctx.rotate(-.12);
  box(ctx, { x: -19, y: -21, w: 38, h: 39 }, skin, 14, dark, 2.5);
  ellipse(ctx, 17, 0, 6, 7, skin, dark, 2);
  ellipse(ctx, -10, -6, 8, 9, '#f4eecb', dark, 1.5); ellipse(ctx, 7, -7, 7.5, 8, '#f4eecb', dark, 1.5);
  ellipse(ctx, -12, -6, 2, 3, '#333d35'); ellipse(ctx, 4, -7, 2, 3, '#333d35');
  path(ctx, [-8, 9, 11, 8, 9, 16, -6, 15], '#495548', dark, 1); box(ctx, { x: -4, y: 9, w: 5, h: 5 }, '#f2e8c9', 0);
  line(ctx, [-13, -23, -17, -29, -8, -26, -4, -30], dark, 2.5);
  if (kind === 'cone') { path(ctx, [-23, -22, 21, -22, 4, -59, -6, -57], '#ed9b41', '#8e623b', 2.5); path(ctx, [-14, -37, 13, -37, 17, -29, -18, -29], '#f8d098'); }
  if (kind === 'bucket') { path(ctx, [-22, -21, 23, -21, 17, -50, -18, -50], '#a4b9b6', '#516867', 2.5); line(ctx, [-17, -46, 13, -46], '#dae1ce', 3); line(ctx, [-11, -41, -8, -29], '#d8e0cd', 2); line(ctx, [-24, -21, 25, -21], '#516867', 4); }
  if (kind === 'runner') { path(ctx, [-22, -17, -18, -33, 10, -36, 22, -24, 25, -17], '#bc5a49', dark, 2); line(ctx, [-20, -17, 7, -16], '#e3c590', 4); }
  if (kind === 'giant') { line(ctx, [-20, -20, 18, -20], '#696647', 6); line(ctx, [-6, -24, 0, -17], '#d4b171', 2); }
  ctx.restore();
  if (kind === 'paper' && health > .5) { path(ctx, [-41, -10, -7, -14, -5, 18, -36, 22], '#dfdbc1', '#77816b', 2); for (let i = 0; i < 4; i++) line(ctx, [-32, -4 + i * 5, -13, -7 + i * 5], '#979e87', 1.5); }
  if (kind === 'giant') { line(ctx, [-25, -7, -40, 27], '#66513c', 7); box(ctx, { x: -52, y: 12, w: 23, h: 26 }, '#9d9e81', 3, '#565f4b', 2); }
  ctx.restore();
}
export function drawMower(ctx: Ctx, x: number, y: number, size: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 50, size / 50);
  line(ctx, [-12, 0, -23, -23, -30, -23], '#46604a', 3);
  box(ctx, { x: -22, y: -2, w: 40, h: 17 }, '#cc6850', 5, '#683d32', 2);
  box(ctx, { x: -12, y: -11, w: 20, h: 14 }, '#c3ba83', 3, '#58674a', 2);
  ellipse(ctx, -13, 13, 7, 7, '#465b44', '#314c39', 2); ellipse(ctx, 14, 13, 7, 7, '#465b44', '#314c39', 2);
  ellipse(ctx, -13, 13, 3, 3, '#a2b39a'); ellipse(ctx, 14, 13, 3, 3, '#a2b39a'); ctx.restore();
}
