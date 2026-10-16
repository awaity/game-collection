export type Ctx = CanvasRenderingContext2D;
export interface Rect { x: number; y: number; w: number; h: number }
export const C = { ink: '#143e32', dark: '#1e503c', grass: '#75b945', leaf: '#b9d879', sun: '#f8ca58', wood: '#976342', paper: '#fff5d6', muted: '#62836c', white: '#fffdf3', blue: '#87bec0', red: '#d76b52' };
export const FONT = '"Hiragino Maru Gothic ProN", "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
export function round(ctx: Ctx, x: number, y: number, w: number, h: number, r = 12) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
export function box(ctx: Ctx, r: Rect, fill: string, radius = 12, stroke?: string, line = 2) {
  round(ctx, r.x, r.y, r.w, r.h, radius); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = line; ctx.stroke(); }
}
export function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, fill: string, stroke?: string, line = 2) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = line; ctx.stroke(); }
}
export function path(ctx: Ctx, points: number[], fill: string, stroke?: string, width = 2) {
  ctx.beginPath(); ctx.moveTo(points[0], points[1]); for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
}
export function line(ctx: Ctx, points: number[], color: string, width = 2) {
  ctx.beginPath(); ctx.moveTo(points[0], points[1]); for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}
export function label(ctx: Ctx, str: string, x: number, y: number, size = 16, color: string = C.ink, weight: number = 500, align: CanvasTextAlign = 'left', maxWidth?: number) {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (maxWidth) ctx.fillText(str, x, y, maxWidth); else ctx.fillText(str, x, y);
}
export function wrap(ctx: Ctx, str: string, x: number, y: number, width: number, size = 15, color: string = C.muted, lineHeight = 24, maxLines = 4): number {
  ctx.font = `500 ${size}px ${FONT}`;
  let current = '', row = 0;
  for (const ch of str) {
    if (ctx.measureText(current + ch).width > width || ch === '\n') { label(ctx, current, x, y + row * lineHeight, size, color); row++; current = ''; if (row >= maxLines) return row * lineHeight; }
    if (ch !== '\n') current += ch;
  }
  if (current) label(ctx, current, x, y + row * lineHeight, size, color);
  return (row + 1) * lineHeight;
}
export function sunIcon(ctx: Ctx, x: number, y: number, r: number, time = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(time * .15);
  for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); path(ctx, [-r * .22, -r * 1.1, 0, -r * 1.48, r * .22, -r * 1.1], '#f3b63e'); }
  ellipse(ctx, 0, 0, r, r, '#ffe07b', '#d59432', Math.max(1, r * .08)); ellipse(ctx, -r * .27, -r * .28, r * .3, r * .22, '#fff3ab'); ctx.restore();
}
export function star(ctx: Ctx, x: number, y: number, r: number, active = true) {
  const pts: number[] = [];
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, d = i % 2 ? r * .48 : r; pts.push(x + Math.cos(a) * d, y + Math.sin(a) * d); }
  path(ctx, pts, active ? C.sun : '#b5c1a0', active ? '#be8c34' : '#97a786', 1.5);
}
export function arrow(ctx: Ctx, x: number, y: number, size = 8, color: string = C.ink, back = false) {
  const d = back ? -1 : 1; line(ctx, [x - d * size, y - size, x, y, x - d * size, y + size], color, 3);
}
export function icon(ctx: Ctx, kind: 'pause' | 'play' | 'sound' | 'mute' | 'shovel' | 'gear' | 'book' | 'lock' | 'close', x: number, y: number, size: number, color: string = C.ink) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24);
  if (kind === 'pause') { box(ctx, { x: -8, y: -10, w: 5, h: 20 }, color, 2); box(ctx, { x: 3, y: -10, w: 5, h: 20 }, color, 2); }
  else if (kind === 'play') path(ctx, [-7, -11, 11, 0, -7, 11], color);
  else if (kind === 'close') { line(ctx, [-8, -8, 8, 8], color, 3); line(ctx, [8, -8, -8, 8], color, 3); }
  else if (kind === 'shovel') { line(ctx, [-9, -11, 7, 8], '#b98756', 5); path(ctx, [0, 7, 10, 0, 15, 11, 11, 16, 5, 16], '#b9c8b9', color, 2); line(ctx, [-13, -10, -7, -15, -3, -10, -9, -5, -13, -10], color, 2); }
  else if (kind === 'sound' || kind === 'mute') { path(ctx, [-12, -4, -6, -4, 1, -10, 1, 10, -6, 4, -12, 4], color); if (kind === 'sound') { ctx.beginPath(); ctx.arc(1, 0, 9, -.8, .8); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); ctx.beginPath(); ctx.arc(1, 0, 14, -.8, .8); ctx.stroke(); } else { line(ctx, [6, -6, 14, 6], color, 2); line(ctx, [14, -6, 6, 6], color, 2); } }
  else if (kind === 'gear') { for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); box(ctx, { x: -3, y: -13, w: 6, h: 6 }, color, 1); } ellipse(ctx, 0, 0, 10, 10, color); ellipse(ctx, 0, 0, 4, 4, C.paper); }
  else if (kind === 'book') { box(ctx, { x: -11, y: -10, w: 22, h: 22 }, C.paper, 3, color); line(ctx, [-6, -3, 6, -3], color, 2); line(ctx, [-6, 3, 3, 3], color, 2); line(ctx, [-6, -10, -6, 12], color, 2); }
  else { ctx.beginPath(); ctx.arc(0, -4, 6, Math.PI, 0); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke(); box(ctx, { x: -9, y: -4, w: 18, h: 16 }, color, 4); ellipse(ctx, 0, 2, 2, 2, C.paper); }
  ctx.restore();
}
