import {Career} from '@game-collection/platform/progression';
import {CareerPanel,drawCareerCanvas} from '@game-collection/platform/progression-panel';
import { Game, WIDTH, HEIGHT, DIFFICULTIES, MISSIONS, clamp } from "./core/game";
import type { Mode, Difficulty, Input } from "./core/game";
import { World } from "./render/world";
import type { Arena } from "./render/world";
import { UI } from "./render/ui";
import { FixedClock } from "@game-collection/platform/loop";
import type {
  Platform,
  PointerInput,
  Sound,
} from "@game-collection/platform/types";
export class App {
  game: Game;
  career:Career;
  careerPanel:CareerPanel;
  selectedMission=0;
  private rewardRun=0;
  world = new World();
  ui = new UI();
  height = 800;
  sound = true;
  help = false;
  manual = false;
  onUIChange?: () => void;
  arena: Arena = { x: 0, y: 100, scale: 1 };
  records: Record<string, number> = {};
  private ctx: CanvasRenderingContext2D;
  private clock = new FixedClock();
  private keys = new Set<string>();
  private drag: {
    id: number;
    x: number;
    y: number;
    px: number;
    py: number;
  } | null = null;
  private target: Input = {};
  private pressed: { id: number; button: string } | null = null;
  private visible = true;
  private disposed = false;
  private frame = 0;
  private uiSignature = "";
  private cleanups: (() => void)[] = [];
  constructor(public platform: Platform) {
    this.ctx = platform.canvas.getContext("2d", { alpha: false });
    if (!this.ctx) throw Error("无法创建画布");
    const saved = platform.read("plane.settings.v1") as {
      mode?: Mode;
      difficulty?: Difficulty;
      sound?: boolean;
    } | null;
    this.sound = saved?.sound !== false;
    platform.setSound(this.sound);
    this.game = new Game(
      saved?.mode === "endless" ? "endless" : "stage",
      saved?.difficulty &&
      Object.prototype.hasOwnProperty.call(DIFFICULTIES, saved.difficulty)
        ? saved.difficulty
        : "normal",
    );
    const records = platform.read("plane.records.v1");
    if (records && typeof records === "object")
      for (const [key, value] of Object.entries(records))
        if (typeof value === "number" && Number.isFinite(value))
          this.records[key] = clamp(value, 0, 1e9);
    if (platform.read("plane.migrated.v1") !== true) {
      const old = Number(platform.read("highScore"));
      if (Number.isFinite(old) && old > 0) {
        this.records.legacy = Math.max(
          this.records.legacy ?? 0,
          clamp(old, 0, 1e9),
        );
        platform.write("plane.records.v1", this.records);
      }
      platform.write("plane.migrated.v1", true);
    }
    this.career=new Career(platform.read('plane-battle.career.v1'),value=>{platform.write('plane-battle.career.v1',value);return JSON.stringify(platform.read('plane-battle.career.v1'))===JSON.stringify(value)});
    this.careerPanel=new CareerPanel(this.career,()=>MISSIONS.map((m,i)=>({...m,unlocked:i===0||this.career.data.clears.includes(String(i-1))})),(map,endless)=>{this.selectedMission=map;this.game.mode=endless?'endless':'stage';this.reset(true);},'远征机库');
    this.careerPanel.guardDescription='每级增加 1 点初始生命与生命上限';
    this.resize();
    this.cleanups.push(
      platform.onPointer((e) => this.pointer(e)),
      platform.onKey((key, down) => this.key(key, down)),
      platform.onResize(() => {
        this.clearInput();
        this.resize();
      }),
      platform.onVisibility((visible) => {
        this.visible = visible;
        this.pause();
        this.clock.reset();
        platform.cancelFrame(this.frame);
        if (visible && !this.disposed)
          this.frame = platform.requestFrame((now) => this.loop(now));
      }),
    );
    this.frame = platform.requestFrame((now) => this.loop(now));
  }
  get best() {
    return Math.max(0, ...Object.values(this.records));
  }
  private settings() {
    this.platform.write("plane.settings.v1", {
      mode: this.game.mode,
      difficulty: this.game.difficulty,
      sound: this.sound,
    });
  }
  private save() {
    const key = `${this.game.mode}.${this.game.difficulty}`;
    this.records[key] = Math.max(this.records[key] ?? 0, this.game.score);
    this.platform.write("plane.records.v1", this.records);
  }
  private clearInput() {
    this.drag = null;
    this.pressed = null;
    this.target = {};
    this.keys.clear();
  }
  private reset(start = false) {
    this.game = new Game(this.game.mode, this.game.difficulty);
    this.world.particles = [];
    this.help = false;
    this.manual = false;
    this.clearInput();
    this.clock.reset();
    this.game.configure(this.selectedMission,this.career.buffs,this.career.skin.color,this.career.data.skin==='classic'?'':this.career.skin.mark);
    if (start) {this.rewardRun=this.career.begin(this.game.mode);this.game.start();}
  }
  private reward(){this.career.checkpoint(this.rewardRun,{kills:this.game.kills,seconds:this.game.tick/60,waves:this.game.mode==='endless'?this.game.stage-1:0,clear:(this.game.phase as string)==='cleared'?String(Math.max(0,this.game.mission)):undefined});}
  pause() {
    this.reward();
    this.game.pause();
    this.clearInput();
    this.clock.reset();
    this.render();
  }
  action(id: string) {
    this.platform.unlockAudio();
    if(id.startsWith('career:')){if(id==='career:open')this.pause();this.careerPanel.action(id);this.render();return;}
    if (id === "start" || id === "retry") this.reset(true);
    else if (id === "resume") {
      this.game.resume();
      this.clock.reset();
    } else if (id === "pause") this.pause();
    else if (id === "home") {
      this.save();
      this.reset();
    } else if (id === "next") {
      this.game.nextStage();
      this.selectedMission=this.game.mission;
      this.clearInput();
      this.clock.reset();
    } else if (id === "sound") {
      this.sound = !this.sound;
      this.platform.setSound(this.sound);
    } else if (id === "help") this.help = true;
    else if (id === "close-help") this.help = false;
    else if (id.startsWith("mode-") && this.game.phase === "menu") {
      this.game.mode = id === "mode-endless" ? "endless" : "stage";
      this.reset();
    } else if (id.startsWith("difficulty-") && this.game.phase === "menu") {
      const difficulty = id.slice(11) as Difficulty;
      if (Object.prototype.hasOwnProperty.call(DIFFICULTIES, difficulty)) {
        this.game.difficulty = difficulty;
        this.reset();
      }
    }
    this.settings();
    this.platform.sound("click");
    this.render();
  }
  private point(e: PointerInput) {
    const view = this.platform.viewport();
    return {
      x: (e.x / view.width) * WIDTH,
      y: (e.y / view.height) * this.height,
    };
  }
  private hit(x: number, y: number) {
    return this.ui.buttons.find(
      (b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h,
    );
  }
  private pointer(e: PointerInput) {
    const { x, y } = this.point(e);
    if (e.type === "down") {
      if (this.drag || this.pressed) return;
      this.platform.unlockAudio();
      const button = this.hit(x, y);
      if (button) {
        this.pressed = { id: e.id, button: button.id };
        return;
      }
      if (this.game.phase === "playing")
        this.drag = {
          id: e.id,
          x,
          y,
          px: this.game.player.x,
          py: this.game.player.y,
        };
    } else if (e.type === "move" && this.drag?.id === e.id) {
      this.keys.clear();
      this.target = {
        x: this.drag.px + (x - this.drag.x) / this.arena.scale,
        y: this.drag.py + (y - this.drag.y) / this.arena.scale,
      };
    } else if (e.type === "up" || e.type === "cancel") {
      if (this.drag?.id === e.id) {
        this.drag = null;
        this.target = {};
      }
      if (this.pressed?.id === e.id) {
        const id = this.pressed.button;
        this.pressed = null;
        if (e.type === "up" && this.hit(x, y)?.id === id) this.action(id);
      }
    }
  }
  private key(key: string, down: boolean) {
    if(this.careerPanel.active){if(down&&key==='Escape'){this.careerPanel.active=false;this.render();}this.clearInput();return;}
    if (!down) {
      this.keys.delete(key);
      return;
    }
    this.keys.add(key);
    this.target = {};
    if (this.help) {
      if (key === "Escape" || key === "Enter") this.action("close-help");
      return;
    }
    if (key === "Space" || key === "Escape") {
      if (this.game.phase === "playing") this.action("pause");
      else if (this.game.phase === "paused") this.action("resume");
      else if (this.game.phase === "menu") this.action("start");
    } else if (key === "KeyR") this.action("retry");
    else if (key === "Enter") {
      if (this.game.phase === "cleared") this.action("next");
      else if (this.game.phase === "menu" || this.game.phase === "lost")
        this.action("retry");
    }
  }
  private resize() {
    const view = this.platform.viewport();
    this.height = (WIDTH * view.height) / view.width;
    this.platform.canvas.width = Math.round(view.width * view.dpr);
    this.platform.canvas.height = Math.round(view.height * view.dpr);
    const safeTop = (view.safeTop / view.width) * WIDTH,
      safeBottom = (view.safeBottom / view.width) * WIDTH,
      scale = Math.min(1, (this.height - safeTop - safeBottom - 150) / HEIGHT);
    this.arena = { x: (WIDTH * (1 - scale)) / 2, y: safeTop + 110, scale };
    this.render();
  }
  private step(input: Input) {
    if (this.game.phase !== "playing") return;
    this.game.step(input);
    if(this.game.tick%60===0||this.game.phase!=='playing')this.reward();
    this.world.step();
    const events = this.game.drainEvents();
    this.world.events(events);
    const sounds: Partial<Record<string, Sound>> = {
      shot: "shot",
      kill: "blast",
      supply: "upgrade",
      hurt: "hurt",
      clear: "win",
      lose: "lose",
      boss: "heavy",
    };
    for (const event of events) {
      const sound = sounds[event.type];
      if (sound) this.platform.sound(sound);
      if (event.type === "hurt") this.platform.vibrate();
      if (event.type === "lose" || event.type === "clear") this.save();
    }
  }
  advance(ticks: number, input: Input = {}) {
    this.manual = true;
    for (let i = 0; i < Math.min(18000, ticks); i++) this.step(input);
    this.render();
    return this.game.summary();
  }
  private loop(now: number) {
    if (this.disposed || !this.visible) return;
    const dx =
        (this.keys.has("KeyD") || this.keys.has("ArrowRight") ? 1 : 0) -
        (this.keys.has("KeyA") || this.keys.has("ArrowLeft") ? 1 : 0),
      dy =
        (this.keys.has("KeyS") || this.keys.has("ArrowDown") ? 1 : 0) -
        (this.keys.has("KeyW") || this.keys.has("ArrowUp") ? 1 : 0);
    this.clock.advance(now, !this.manual && this.game.phase === "playing", () =>
      this.step(dx || dy ? { dx, dy } : this.target),
    );
    this.render();
    this.frame = this.platform.requestFrame((time) => this.loop(time));
  }
  render() {
    const view = this.platform.viewport(),
      scale = this.platform.canvas.width / WIDTH;
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
    this.world.background(
      this.ctx,
      this.height,
      this.platform.reducedMotion ? 0 : this.game.tick / 60,
    );
    if (this.game.phase !== "menu")
      this.world.draw(this.ctx, this.game, this.arena);
    this.ui.draw(this.ctx, this.game, this.height, {
      safeTop: (view.safeTop / view.width) * WIDTH,
      safeBottom: (view.safeBottom / view.width) * WIDTH,
      best: this.best,
      sound: this.sound,
      help: this.help,
      coins:this.career?.data.coins??0,
    });
    if(this.careerPanel?.active)this.ui.buttons=drawCareerCanvas(this.ctx,this.careerPanel,WIDTH,this.height,false,(view.safeTop/view.width)*WIDTH,(view.safeBottom/view.width)*WIDTH+12);
    const signature = JSON.stringify([
      this.game.phase,
      this.help,
      this.career?.data.coins,
      this.careerPanel?.active,
      this.game.score,
      this.game.player.lives,
      this.game.player.weapon,
      this.ui.buttons,
    ]);
    if (signature !== this.uiSignature) {
      this.uiSignature = signature;
      this.onUIChange?.();
    }
  }
  dispose() {
    this.disposed = true;
    this.platform.cancelFrame(this.frame);
    for (const cleanup of this.cleanups) cleanup();
    this.platform.dispose?.();
  }
}
