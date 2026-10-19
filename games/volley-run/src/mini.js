import {Campaign} from './campaign.js';
import {drawCareerCanvas} from '@game-collection/platform/progression-panel';
import { MiniPlatform } from "@game-collection/platform/mini";
import { FixedClock } from "@game-collection/platform/loop";
import { World } from "./render/world.js";
import { miniRuntime } from "./render/mini-runtime.js";
import {
  createGame,
  LEVELS,
  WEAPONS,
  demoInput,
  clamp,
} from "./simulation/game.js";

const api = __MINI_TARGET__ === "weixin" ? wx : tt;
const platform = new MiniPlatform(api);
const T = globalThis.THREE;

/** Native menus share the WebGL display canvas with the real Three battlefield. */
class Overlay {
  constructor() {
    this.canvas = platform.createCanvas(1, 1);
    this.ctx = this.canvas.getContext("2d");
    this.texture = new T.CanvasTexture(this.canvas);
    this.texture.encoding = T.sRGBEncoding;
    this.scene = new T.Scene();
    this.camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene.add(
      new T.Mesh(
        new T.PlaneGeometry(2, 2),
        new T.MeshBasicMaterial({
          map: this.texture,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        }),
      ),
    );
    this.buttons = [];
    this.signature = "";
  }
  draw(app) {
    const view = platform.viewport(),
      w = view.width,
      h = view.height,
      s = w / 390,
      top = view.safeTop + 18 * s,
      bottom = h - view.safeBottom;
    const g = app.game,
      signature = [
        app.campaign.panel.active,app.campaign.panel.tab,app.campaign.panel.page,app.campaign.career.data.coins,app.campaign.career.message,
        g.phase,
        g.tick >> 3,
        g.troops.length,
        g.weapon,
        app.level,
        app.mode,
        app.sound,
        app.world.quality,
        app.best[app.level],
        w,
        h,
        top,
        bottom,
        app.world.lost,
      ].join("|");
    if (signature !== this.signature) {
      this.signature = signature;
      this.canvas.width = Math.round(w);
      this.canvas.height = Math.round(h);
      const c = this.ctx;
      c.clearRect(0, 0, w, h);
      this.buttons = [];
      const text = (
        label,
        x,
        y,
        size = 16,
        color = "#fff7e6",
        align = "center",
      ) => {
        c.font = `600 ${size * s}px sans-serif`;
        c.fillStyle = color;
        c.textAlign = align;
        c.textBaseline = "middle";
        c.fillText(label, x, y);
      };
      const button = (
        id,
        label,
        y,
        primary = false,
        x = 30 * s,
        width = w - 60 * s,
      ) => {
        const height = 44 * s;
        c.fillStyle = primary ? "#bde7f2" : "#293e50";
        c.fillRect(x, y, width, height);
        text(
          label,
          x + width / 2,
          y + height / 2,
          15,
          primary ? "#122b3b" : "#edf8ff",
        );
        this.buttons.push({ id, x, y, w: width, h: height });
      };
      if (g.phase === "running") {
        c.fillStyle = "#102637db";
        c.fillRect(12 * s, top, w - 24 * s, 61 * s);
        text(
          `${g.troops.length} 人 · ${WEAPONS[g.weapon].name}`,
          26 * s,
          top + 22 * s,
          16,
          "#ffffff",
          "left",
        );
        text(
          `${LEVELS[app.level].name}  ${Math.min(100, Math.round((g.distance / g.config.length) * 100))}%`,
          26 * s,
          top + 46 * s,
          11,
          "#b9d5e1",
          "left",
        );
        button("pause", "暂停", top + 8 * s, false, w - 78 * s, 54 * s);
        text(
          app.mode === "demo" ? "演示中 · 真实战斗" : "左右拖动，自动射击",
          w / 2,
          bottom - 27 * s,
          13,
        );
      } else {
        c.fillStyle = "#102332df";
        c.fillRect(0, 0, w, h);
        const cy = Math.max(top + 52 * s, Math.min(h * 0.26, bottom - 350 * s));
        text(
          "BLUE COMPANY / 0" + (app.level + 1),
          w / 2,
          cy - 27 * s,
          11,
          "#acd0df",
        );
        text(
          g.phase === "ready"
            ? "弹幕小队"
            : g.phase === "paused"
              ? "歇口气，再出发。"
              : g.phase === "won"
                ? "突围成功"
                : "这次，还差一点。",
          w / 2,
          cy + 8 * s,
          30,
        );
        if (g.phase === "ready") {
          text(
            "瞄准数字门增援 · 打碎武器舱升级",
            w / 2,
            cy + 51 * s,
            13,
            "#c5d9e1",
          );
          text(
            "避开橙色警戒区，留住每一个队员。",
            w / 2,
            cy + 76 * s,
            13,
            "#c5d9e1",
          );
          button(
            "route",
            `${LEVELS[app.level].name} ↻  ·  最佳 ${app.best[app.level]} 人`,
            cy + 110 * s,
          );
          button("start", "全员出击 →", cy + 165 * s, true);
          button("demo", "观看演示", cy + 220 * s);
        } else {
          text(
            `剩余 ${g.troops.length} 人  ·  击败 ${g.stats.kills}  ·  增援 ${g.stats.recruited}`,
            w / 2,
            cy + 57 * s,
            14,
            "#c5d9e1",
          );
          if (app.world.lost) text("画面恢复后可继续", w / 2, cy + 85 * s, 13);
          button(
            g.phase === "paused" ? "resume" : "retry",
            g.phase === "paused" ? "继续突击" : "再来一次",
            cy + 110 * s,
            true,
          );
          button("home", "返回集合点", cy + 165 * s);
          if (g.phase === "won" && (app.campaign.endless||app.level < LEVELS.length-1))
            button("next",app.campaign.endless?`第 ${app.campaign.wave+1} 波 · 继续无尽`:"下一条防线 →", cy + 220 * s);
        }
        const optionsY = Math.min(bottom - 60 * s, cy + 285 * s);
        button(
          "sound",
          app.sound ? "声音：开" : "声音：关",
          optionsY,
          false,
          30 * s,
          (w - 70 * s) / 2,
        );
        button(
          "quality",
          app.world.quality === "low" ? "画质：轻量" : "画质：均衡",
          optionsY,
          false,
          w / 2 + 5 * s,
          (w - 70 * s) / 2,
        );
      }
      if(g.phase==='ready')button('career:open',`军需库 · ${app.campaign.career.data.coins} 金币`,Math.max(top,bottom-52*s));
      if(app.campaign.panel.active)this.buttons=drawCareerCanvas(c,app.campaign.panel,w,h,false,view.safeTop+10,view.safeBottom+20);
      this.texture.needsUpdate = true;
    }
    const r = app.world.renderer;
    r.autoClear = false;
    r.clearDepth();
    r.render(this.scene, this.camera);
    r.autoClear = true;
  }
}

export async function boot() {
  let app;
  const world = await World.create(
    miniRuntime(platform, (name) => {
      if (name === "render-lost") app?.pause();
    }),
  );
  const overlay = new Overlay(),
    clock = new FixedClock();
  const settings = platform.read("volley.settings.v1") ?? {},
    progress = platform.read("volley.progress.v1") ?? {};
  const best = LEVELS.map((_,i) =>
    Number.isFinite(progress.best?.[i]) ? clamp(progress.best[i], 0, 96) : 0,
  );
  const cleared = Array.isArray(progress.cleared)
    ? progress.cleared.filter((i) => Number.isInteger(i) && i >= 0 && i < LEVELS.length)
    : [];
  app = {
    world,
    level: 0,
    game: null,
    mode: "play",
    best,
    sound: settings.sound !== false,
    pause,
  };
  const campaign=new Campaign(key=>platform.read(key),(key,value)=>{platform.write(key,value);return JSON.stringify(platform.read(key))===JSON.stringify(value)},(map,endless)=>{app.level=map;campaign.endless=endless;reset(true);});app.campaign=campaign;
  platform.setSound(app.sound);
  // Low is the portable default. Balanced needs an actual depth texture extension.
  const canBalanced =
    world.renderer.capabilities.isWebGL2 ||
    world.renderer.extensions.has("WEBGL_depth_texture");
  if (settings.quality === "balanced" && canBalanced)
    world.setQuality("balanced");
  let drag = null,
    pressed = null,
    visible = true,
    frameId = 0;
  function reset(start = false, mode = "play",continuing=false) {
    app.game = start?campaign.start(app.level,mode,null,continuing):createGame({ level: app.level });
    app.game.skin=campaign.career.skin;
    app.mode = mode;
    world.reset(app.game);
    clock.reset();
    drag = null;
    pressed = null;
    if (start) app.game.start();
    overlay.signature = "";
  }
  function pause() {
    if(app.game)campaign.checkpoint(app.game);
    if (app.game?.phase === "running") app.game.pause();
    drag = null;
    pressed = null;
    clock.reset();
    overlay.signature = "";
  }
  function action(id) {
    platform.unlockAudio();
    if(id.startsWith('career:')){pause();campaign.panel.action(id);overlay.signature='';return;}
    platform.sound("click");
    if (id === "start" || id === "retry") reset(true);
    else if (id === "demo") reset(true, "demo");
    else if (id === "pause") pause();
    else if (id === "resume" && app.game.phase === "paused" && !world.lost) {
      app.game.pause();
      clock.reset();
    } else if (id === "home") {campaign.endless=false;reset();}
    else if (id === "route") {
      app.level = (app.level + 1) % LEVELS.length;
      reset();
    } else if (id === "next") {
      if(campaign.endless){app.level=campaign.next(app.game);reset(true,"play",true)}else{app.level=Math.min(LEVELS.length-1,app.level+1);reset(true);}
    } else if (id === "sound") {
      app.sound = !app.sound;
      platform.setSound(app.sound);
    } else if (id === "quality")
      world.setQuality(
        world.quality === "low" && canBalanced ? "balanced" : "low",
      );
    platform.write("volley.settings.v1", {
      sound: app.sound,
      quality: world.quality,
    });
    overlay.signature = "";
  }
  const hit = (x, y) =>
    overlay.buttons.find(
      (b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h,
    );
  platform.onPointer((e) => {
    if (e.type === "down") {
      if (pressed || drag) return;
      const button = hit(e.x, e.y);
      if (button) {
        pressed = { id: e.id, button: button.id };
        return;
      }
      if (app.game.phase === "running" && app.mode === "play")
        drag = { id: e.id, x: e.x, target: app.game.targetX };
    } else if (e.type === "move" && drag?.id === e.id) {
      app.game.setTarget(
        drag.target + ((e.x - drag.x) / platform.viewport().width) * 11.4,
      );
    } else if (e.type === "up" || e.type === "cancel") {
      if (drag?.id === e.id) drag = null;
      if (pressed?.id === e.id) {
        const id = pressed.button;
        pressed = null;
        if (e.type === "up" && hit(e.x, e.y)?.id === id) action(id);
      }
    }
  });
  platform.onVisibility((show) => {
    visible = show;
    pause();
    platform.cancelFrame(frameId);
    if (show) frameId = platform.requestFrame(frame);
  });
  function frame(now) {
    if (!visible) return;
    const events = [];
    clock.advance(now, app.game.phase === "running" && !world.lost, () => {
      const g = app.game;
      if (g.phase !== "running") return;
      g.step(app.mode === "demo" ? demoInput(g) : g.targetX);
      if(g.tick%60===0||g.phase!=='running')campaign.checkpoint(g);
      events.push(...g.drainEvents());
      if (g.phase === "won" || g.phase === "lost") {
        platform.sound(g.phase === "won" ? "win" : "lose");
        if (app.mode === "play") {
          platform.write("volley.replay.v1", g.replay());
          if (g.phase === "won"&&!campaign.endless) {
            best[app.level] = Math.max(best[app.level], g.troops.length);
            if (!cleared.includes(app.level)) cleared.push(app.level);
            platform.write("volley.progress.v1", { best, cleared });
          }
        }
      }
    });
    for (const event of events) {
      const sound = {
        shot: "shot",
        upgrade: "upgrade",
        recruit: "upgrade",
        loss: "hurt",
        "boss-kill": "blast",
      }[event.type];
      if (sound) platform.sound(sound);
    }
    if (!world.lost) {
      world.draw(app.game, events);
      overlay.draw(app);
    }
    frameId = platform.requestFrame(frame);
  }
  reset();
  frameId = platform.requestFrame(frame);
}
boot().catch((error) => {
  console.error(error);
  api.showModal?.({
    title: "战场加载失败",
    content: "请关闭游戏后重试。若仍无法加载，请更新客户端。",
    showCancel: false,
  });
});
