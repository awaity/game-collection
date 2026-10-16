import { WIDTH, HEIGHT } from "../core/game";
import type { Game, GameEvent } from "../core/game";
export const palette = {
  ink: "#090e26",
  cyan: "#00d4ff",
  pink: "#ff49d2",
  red: "#ff4770",
  yellow: "#ffea70",
  green: "#00ffb0",
  muted: "#9caed2",
  white: "#eef5ff",
};
export function text(
  c: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  size = 16,
  color = palette.white,
  align: CanvasTextAlign = "center",
  weight = 600,
) {
  c.font = `${weight} ${size}px system-ui, sans-serif`;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillStyle = color;
  c.fillText(label, x, y);
}
export function panel(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  stroke?: string,
) {
  c.beginPath();
  c.moveTo(x + 10, y);
  c.lineTo(x + w - 10, y);
  c.lineTo(x + w, y + 10);
  c.lineTo(x + w, y + h - 10);
  c.lineTo(x + w - 10, y + h);
  c.lineTo(x + 10, y + h);
  c.lineTo(x, y + h - 10);
  c.lineTo(x, y + 10);
  c.closePath();
  c.fillStyle = color;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1;
    c.stroke();
  }
}
export function ship(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  enemy = false,
) {
  c.save();
  c.translate(x, y);
  if (enemy) c.rotate(Math.PI);
  c.shadowColor = color;
  c.shadowBlur = 14;
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(0, -size);
  c.lineTo(-size * 0.72, size * 0.8);
  c.lineTo(0, size * 0.42);
  c.lineTo(size * 0.72, size * 0.8);
  c.closePath();
  c.fill();
  c.shadowBlur = 0;
  c.fillStyle = "#effbff";
  c.beginPath();
  c.moveTo(0, -size * 0.53);
  c.lineTo(-size * 0.15, size * 0.17);
  c.lineTo(size * 0.15, size * 0.17);
  c.closePath();
  c.fill();
  c.strokeStyle = color;
  c.globalAlpha = 0.4;
  c.beginPath();
  c.moveTo(-size * 0.24, size * 0.83);
  c.lineTo(0, size * 1.7);
  c.lineTo(size * 0.24, size * 0.83);
  c.stroke();
  c.restore();
}
export interface Arena {
  x: number;
  y: number;
  scale: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  colour: string;
}
export class World {
  particles: Particle[] = [];
  events(events: GameEvent[]) {
    for (const e of events) {
      if (!["kill", "hit", "supply", "hurt"].includes(e.type)) continue;
      const count = e.type === "kill" ? 20 : 8;
      for (let i = 0; i < count; i++) {
        const a = i * 2.399,
          speed = 1 + (i % 5);
        this.particles.push({
          x: e.x,
          y: e.y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: 1,
          colour:
            e.type === "hurt"
              ? palette.red
              : e.type === "supply"
                ? palette.green
                : i % 2
                  ? palette.cyan
                  : palette.pink,
        });
      }
    }
    this.particles = this.particles.slice(-350);
  }
  step() {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }
  background(c: CanvasRenderingContext2D, h: number, time: number) {
    c.fillStyle = palette.ink;
    c.fillRect(0, 0, WIDTH, h);
    const glow = c.createRadialGradient(300, h * 0.32, 5, 220, h * 0.3, 360);
    glow.addColorStop(0, "#191c5140");
    glow.addColorStop(1, "#090e2600");
    c.fillStyle = glow;
    c.fillRect(0, 0, WIDTH, h);
    for (let i = 0; i < 85; i++) {
      const x = (i * 137.51) % WIDTH,
        y = (i * 67.7 + time * (12 + (i % 4) * 5)) % h;
      c.fillStyle = i % 4 ? "#96a9d855" : "#c4eeff";
      c.fillRect(x, y, i % 7 === 0 ? 2 : 1, i % 7 === 0 ? 3 : 1);
    }
    c.strokeStyle = "#28436a50";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(16, 0);
    c.lineTo(16, h);
    c.moveTo(WIDTH - 16, 0);
    c.lineTo(WIDTH - 16, h);
    c.stroke();
  }
  draw(c: CanvasRenderingContext2D, g: Game, arena: Arena) {
    c.save();
    c.translate(arena.x, arena.y);
    c.scale(arena.scale, arena.scale);
    c.beginPath();
    c.rect(0, 0, WIDTH, HEIGHT);
    c.clip();
    for (const p of this.particles) {
      c.globalAlpha = p.life;
      c.fillStyle = p.colour;
      c.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
    c.globalAlpha = 1;
    for (const p of g.powerUps) {
      const color =
        p.kind === "weapon"
          ? palette.cyan
          : p.kind === "shield"
            ? palette.green
            : palette.pink;
      c.strokeStyle = color;
      c.lineWidth = 2;
      c.beginPath();
      c.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
      c.stroke();
      text(
        c,
        p.kind === "weapon" ? "↑" : p.kind === "shield" ? "◇" : "+",
        p.x,
        p.y,
        22,
        color,
      );
    }
    for (const b of [...g.bullets, ...g.enemyBullets]) {
      c.fillStyle = b.color;
      c.shadowBlur = 9;
      c.shadowColor = b.color;
      c.beginPath();
      c.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      c.fill();
    }
    c.shadowBlur = 0;
    for (const e of g.enemies) {
      ship(
        c,
        e.x,
        e.y,
        e.radius,
        e.kind === "elite" ? palette.pink : palette.red,
        true,
      );
      if (e.kind === "elite" && e.hp < e.maxHp) {
        c.fillStyle = palette.green;
        c.fillRect(e.x - 20, e.y - 34, (40 * e.hp) / e.maxHp, 3);
      }
    }
    if (g.boss) {
      const b = g.boss;
      c.save();
      c.translate(b.x, b.y);
      c.fillStyle = "#ffc34f";
      c.shadowColor = palette.yellow;
      c.shadowBlur = 24;
      c.beginPath();
      c.arc(0, 0, b.radius, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;
      c.strokeStyle = palette.pink;
      c.lineWidth = 4;
      c.stroke();
      c.fillStyle = "#862f94";
      c.beginPath();
      c.arc(-15, -12, 8, 0, Math.PI * 2);
      c.arc(15, -12, 8, 0, Math.PI * 2);
      c.fill();
      c.fillRect(-20, 17, 40, 6);
      c.restore();
    }
    const p = g.player;
    ship(c, p.x, p.y, p.radius, palette.cyan);
    if (p.shield) {
      c.strokeStyle = palette.green;
      c.lineWidth = 2;
      c.beginPath();
      c.arc(p.x, p.y, 32, 0, Math.PI * 2);
      c.stroke();
    }
    c.restore();
  }
}
