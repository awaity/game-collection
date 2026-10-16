import { DIFFICULTIES } from "../core/game";
import type { Game } from "../core/game";
import { palette as P, text, panel, ship } from "./world";
export interface Button {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
export class UI {
  buttons: Button[] = [];
  button(
    c: CanvasRenderingContext2D,
    id: string,
    label: string,
    x: number,
    y: number,
    w: number,
    h = 48,
    primary = false,
    selected = false,
  ) {
    this.buttons.push({ id, label, x, y, w, h });
    panel(
      c,
      x,
      y,
      w,
      h,
      primary ? P.cyan : selected ? "#1c3860" : "#101c38",
      primary ? P.cyan : selected ? P.cyan : "#34466c",
    );
    text(
      c,
      label,
      x + w / 2,
      y + h / 2,
      primary ? 18 : 14,
      primary ? P.ink : selected ? P.cyan : P.white,
    );
  }
  draw(
    c: CanvasRenderingContext2D,
    g: Game,
    h: number,
    s: {
      safeTop: number;
      safeBottom: number;
      best: number;
      sound: boolean;
      help: boolean;
    },
  ) {
    this.buttons = [];
    const top = s.safeTop + 18,
      bottom = h - s.safeBottom;
    if (g.phase === "menu") {
      text(c, "NEON AIR / 01", 32, top + 14, 11, P.cyan, "left");
      text(c, "飞机", 30, top + 83, 72, P.white, "left", 900);
      text(c, "大战", 30, top + 161, 72, P.cyan, "left", 900);
      text(c, "穿过弹幕，把天空留给自己。", 32, top + 222, 14, P.muted, "left");
      if (bottom - top > 730) {
        ship(c, 300, top + 325, 48, P.cyan);
        ship(c, 98, top + 321, 23, P.pink, true);
        ship(c, 162, top + 280, 16, P.red, true);
      }
      const y = Math.max(top + 270, bottom - 296);
      text(
        c,
        `最高纪录   ${s.best.toLocaleString()} 分`,
        32,
        y - 25,
        13,
        P.muted,
        "left",
      );
      this.button(
        c,
        "mode-stage",
        "闯关挑战",
        32,
        y,
        173,
        48,
        false,
        g.mode === "stage",
      );
      this.button(
        c,
        "mode-endless",
        "无限生存",
        215,
        y,
        173,
        48,
        false,
        g.mode === "endless",
      );
      for (const [i, key] of (["easy", "normal", "hard"] as const).entries())
        this.button(
          c,
          "difficulty-" + key,
          DIFFICULTIES[key].label,
          32 + i * 122,
          y + 62,
          112,
          42,
          false,
          g.difficulty === key,
        );
      this.button(c, "start", "即刻起飞  →", 32, y + 123, 356, 58, true);
      this.button(c, "help", "飞行手册", 32, y + 198, 173, 42);
      this.button(
        c,
        "sound",
        s.sound ? "声音：开" : "声音：关",
        215,
        y + 198,
        173,
        42,
      );
      text(c, "拖动 / WASD 移动 · 自动开火", 210, bottom - 22, 11, P.muted);
    } else {
      panel(c, 26, top, 368, 60, "#101a35ed", "#293c5f");
      text(
        c,
        String(g.score).padStart(5, "0"),
        42,
        top + 24,
        26,
        P.white,
        "left",
        800,
      );
      text(
        c,
        g.mode === "stage"
          ? `第 ${g.stage} 关`
          : `生存 ${(g.tick / 60).toFixed(0)} 秒`,
        42,
        top + 47,
        11,
        P.muted,
        "left",
      );
      text(
        c,
        `生命 ${g.player.lives}  /  ${g.player.maxLives}`,
        224,
        top + 20,
        12,
        P.pink,
      );
      text(
        c,
        `火力 Lv.${g.player.weapon}${g.player.shield ? " · 护盾" : ""}`,
        224,
        top + 42,
        12,
        P.cyan,
      );
      this.button(c, "pause", "暂停", 322, top + 8, 60, 44);
      if (g.boss) {
        text(c, "空域守卫", 35, top + 79, 10, P.yellow, "left");
        c.fillStyle = "#3a2948";
        c.fillRect(108, top + 75, 276, 6);
        c.fillStyle = P.yellow;
        c.fillRect(108, top + 75, (276 * g.boss.hp) / g.boss.maxHp, 6);
      }
      text(c, "拖动飞机 · 自动开火", 210, bottom - 22, 11, P.muted);
    }
    if (["paused", "cleared", "lost"].includes(g.phase)) {
      c.fillStyle = "#090e26e8";
      c.fillRect(0, 0, 420, h);
      this.buttons = [];
      const y = Math.max(top + 60, h / 2 - 190);
      text(
        c,
        g.phase === "paused"
          ? "FLIGHT PAUSED"
          : g.phase === "cleared"
            ? "AIRSPACE CLEAR"
            : "MISSION END",
        210,
        y,
        11,
        P.cyan,
      );
      text(
        c,
        g.phase === "paused"
          ? "暂时返航。"
          : g.phase === "cleared"
            ? "这片天空，拿下。"
            : "再飞高一点。",
        210,
        y + 49,
        32,
        P.white,
      );
      text(c, `${g.score.toLocaleString()} 分`, 210, y + 111, 42, P.cyan);
      text(
        c,
        `击落 ${g.kills} 架  ·  第 ${g.stage} 关  ·  ${DIFFICULTIES[g.difficulty].label}`,
        210,
        y + 155,
        13,
        P.muted,
      );
      this.button(
        c,
        g.phase === "paused"
          ? "resume"
          : g.phase === "cleared"
            ? "next"
            : "retry",
        g.phase === "paused"
          ? "继续飞行"
          : g.phase === "cleared"
            ? "进入下一关"
            : "再次起飞",
        45,
        y + 203,
        330,
        54,
        true,
      );
      this.button(c, "home", "返回机库", 45, y + 272, 158, 46);
      this.button(
        c,
        "sound",
        s.sound ? "声音：开" : "声音：关",
        217,
        y + 272,
        158,
        46,
      );
    }
    if (s.help) {
      c.fillStyle = "#090e26fa";
      c.fillRect(0, 0, 420, h);
      this.buttons = [];
      const y = Math.max(top + 35, h / 2 - 230);
      text(c, "飞行手册", 36, y, 32, P.white, "left");
      const lines = [
        [
          "01 / 移动与开火",
          "拖动或 WASD / 方向键，四向移动。",
          "子弹自动发射，避开红色与黄色弹幕。",
        ],
        [
          "02 / 追上补给",
          "↑ 升级火力，最高五级散射。",
          "◇ 护盾抵挡一次伤害，+ 恢复生命。",
        ],
        [
          "03 / 选择空域",
          "闯关：击败守卫，进入更难的下一关。",
          "无限：每 30 秒增加压力，挑战纪录。",
        ],
      ];
      for (let i = 0; i < lines.length; i++) {
        text(c, lines[i][0], 36, y + 64 + i * 100, 16, P.cyan, "left");
        text(c, lines[i][1], 36, y + 94 + i * 100, 13, P.white, "left");
        text(c, lines[i][2], 36, y + 117 + i * 100, 13, P.muted, "left");
      }
      this.button(c, "close-help", "准备好了", 36, y + 375, 348, 54, true);
    }
  }
}
