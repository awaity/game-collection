export const FONT = '"PingFang SC", "Microsoft YaHei", Arial, sans-serif';
export function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r = 10) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
export function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, radius = 0) {
  ctx.fillStyle = fill; if (radius) { rounded(ctx, x, y, w, h, radius); ctx.fill(); } else ctx.fillRect(x, y, w, h);
}
export function poly(ctx: CanvasRenderingContext2D, points: number[][], color: string) {
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
}
export function text(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, size: number, color = '#183f3d', weight = 700, align: CanvasTextAlign = 'left') {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(value, x, y);
}
export function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, color: string) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
}
export function line(ctx: CanvasRenderingContext2D, points: number[][], color: string, width = 2) {
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
export function shield(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color = '#f5c451') {
  poly(ctx, [[x-size*.42,y-size*.5],[x+size*.42,y-size*.5],[x+size*.38,y+size*.12],[x,y+size*.5],[x-size*.38,y+size*.12]],color);
  poly(ctx, [[x+2,y-size*.33],[x-5,y+2],[x,y+2],[x-2,y+size*.3],[x+7,y-3],[x+1,y-3]],'#183f3d');
}
export function gun(ctx: CanvasRenderingContext2D, x: number, y: number, tier: number, size = 1, color = '#cfe0ce') {
  ctx.save(); ctx.translate(x,y); ctx.scale(size,size);
  if (tier === 0) { rect(ctx,-24,-5,36,9,color,2); rect(ctx,11,-3,20,4,color,1); poly(ctx,[[-13,4],[-5,4],[-9,15],[-17,15]],color); rect(ctx,-3,-9,9,4,color); }
  else if (tier === 1) { rect(ctx,-25,-11,17,22,color,3); for(let i=0;i<3;i++)rect(ctx,-9,-10+i*8,39,4,color,1); rect(ctx,-20,10,7,9,color,1); }
  else { rect(ctx,-27,-9,9,18,color,2); rect(ctx,-16,-13,44,26,color,4); rect(ctx,23,-9,8,18,'#e79f4b',2);rect(ctx,-10,12,10,8,color,1); }
  ctx.restore();
}
