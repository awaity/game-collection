import { adventureConfig, challengeConfig, levelConfig, CHALLENGES, CHAPTERS, LEVELS, ZOMBIES, PERKS, PLANTS, PLANT_ORDER, type GameConfig, type PerkId, type PlantKind } from './core/content';
import { Game, STEP } from './core/game';
import { parseSave, recordResult, SAVE_KEY, unlockedLevel } from './core/save';
import type { Host } from './platform/types';
import { Renderer, boardLayout } from './render/ui';
import type { Hit, Modal, View } from './view';

export class GardenApp {
  readonly view: View;
  hits: Hit[] = [];
  private renderer: Renderer;
  private ctx: CanvasRenderingContext2D;
  private last = 0;
  private frameId = 0;
  private accumulator = 0;
  private toastUntil = 0;
  private returnModal: Modal = null;
  private recorded = false;
  private scale = 1;
  private stopped = false;

  constructor(readonly host: Host) {
    const ctx = host.canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('此设备不支持 Canvas 2D');
    this.ctx = ctx;
    this.renderer = new Renderer(ctx);
    const raw = host.read(SAVE_KEY), save = parseSave(raw);
    if (!raw) save.settings.reducedMotion = host.reducedMotion?.() ?? false;
    this.view = { w: 390, h: 844, safeTop: 0, safeBottom: 0, time: 0, screen: 'home', modal: null, save, game: null, brief: null, selected: null, shovel: false, speed: 1, chapter: Math.floor((unlockedLevel(save) - 1) / 4), almanac: 'plants', seedPage: 0, challengePage: 0, almanacPage: 0, detail: '', cursor: null, toast: '' };
    host.onPointer((x, y) => this.pointer(x, y));
    host.onMove((x, y) => this.move(x, y));
    host.onKey(key => this.key(key));
    host.onResize(() => this.resize());
    host.onHide(() => {
      if (this.view.screen === 'playing' && !this.view.modal) this.view.modal = 'pause';
      this.accumulator = 0; this.last = 0; host.silence(); this.render();
    });
    this.resize();
    this.frameId = host.frame(t => this.frame(t));
  }
  private resize() {
    const size = this.host.size(), v = this.view;
    const availableHeight = size.height - size.safeTop - size.safeBottom;
    this.scale = v.screen !== 'playing' && v.screen !== 'result' && availableHeight < 620 ? availableHeight / 620 : 1;
    v.w = size.width / this.scale; v.h = size.height / this.scale; v.safeTop = size.safeTop / this.scale; v.safeBottom = size.safeBottom / this.scale;
    const w = Math.round(size.width * size.dpr), h = Math.round(size.height * size.dpr);
    if (this.host.canvas.width !== w) this.host.canvas.width = w;
    if (this.host.canvas.height !== h) this.host.canvas.height = h;
    this.ctx.setTransform(size.dpr * this.scale, 0, 0, size.dpr * this.scale, 0, 0);
    this.render();
  }
  private frame(t: number) {
    if (this.stopped) return;
    const dt = this.last ? Math.min(.1, Math.max(0, (t - this.last) / 1000)) : 0;
    this.last = t; this.view.time += dt;
    if (this.view.toast && this.view.time > this.toastUntil) this.view.toast = '';
    if (this.view.screen === 'playing' && !this.view.modal && this.view.game?.state === 'playing') {
      this.accumulator += dt * this.view.speed;
      while (this.accumulator >= STEP) { this.step(STEP); this.accumulator -= STEP; }
    } else this.accumulator = 0;
    this.flushSounds(); this.render();
    this.frameId = this.host.frame(next => this.frame(next));
  }
  private step(dt: number) {
    const g = this.view.game;
    if (!g || this.view.screen !== 'playing' || this.view.modal) return;
    g.update(dt);
    if (this.view.save.settings.autoSun) for (const s of [...g.suns]) if (s.age > .7) g.collectSun(s.id);
    if (g.state !== 'playing' && !this.recorded) {
      this.recorded = true; recordResult(this.view.save, g); this.persist(); this.view.screen = 'result';
      this.host.announce?.(g.state === 'won' ? `守卫成功，获得 ${g.stars} 星，${g.score} 分` : `本局结束，击退 ${g.kills} 只僵尸`);
      this.resize();
    }
  }
  // Deterministic advancement is used by tests; production does not expose the app globally.
  advance(seconds: number) {
    const n = Math.min(18000, Math.max(0, Math.ceil(seconds / STEP)));
    for (let i = 0; i < n; i++) this.step(STEP);
    this.flushSounds(); this.render();
  }
  private flushSounds() {
    const g = this.view.game;
    if (!g) return;
    const sounds = new Set(g.sounds.splice(0));
    if (this.view.save.settings.sound) for (const sound of sounds) this.host.sound(sound);
  }
  render() {
    this.host.reportState?.(this.view.screen === 'playing' ? this.view.modal ? 'paused' : 'playing' : this.view.screen === 'result' ? 'result' : 'menu');
    this.hits = this.renderer.render(this.view);
    const hits = this.scale === 1 ? this.hits : this.hits.map(h => ({ ...h, x: h.x * this.scale, y: h.y * this.scale, w: h.w * this.scale, h: h.h * this.scale }));
    this.host.syncControls?.(hits, id => this.action(id));
  }
  private persist() {
    if (!this.host.write(SAVE_KEY, JSON.stringify(this.view.save))) this.toast('本次进度暂未保存，请检查设备存储空间');
  }
  private toast(message: string) { this.view.toast = message; this.toastUntil = this.view.time + 3.5; this.host.announce?.(message); }
  pointer(x: number, y: number) {
    x /= this.scale; y /= this.scale;
    const hit = [...this.hits].reverse().find(h => !h.disabled && x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h);
    if (hit) this.action(hit.id);
  }
  private move(x: number, y: number) {
    if (this.view.screen !== 'playing' || this.view.modal) return;
    const b = boardLayout(this.view); x /= this.scale; y /= this.scale;
    this.view.cursor = x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h ? { row: Math.floor((y - b.y) / b.rh), col: Math.floor((x - b.x) / b.cw) } : null;
  }
  private key(key: string) {
    const v = this.view;
    if (key === 'Escape') { if (v.modal) this.action('close'); else if (v.screen === 'playing') this.action('pause'); else if (v.screen !== 'home') this.action('home'); return; }
    if (v.screen !== 'playing') return;
    if (key === ' ') { if (v.modal === 'pause') this.action('close'); else if (!v.modal) this.action('pause'); return; }
    if (v.modal) return;
    if (/^[1-8]$/.test(key)) this.action(`seed:${PLANT_ORDER[v.seedPage * 8 + Number(key) - 1]}`);
    else if (key.toLowerCase() === 'q' || key.toLowerCase() === 'e') this.action(`seeds:${key.toLowerCase() === 'e' ? 'next' : 'prev'}`);
    else if (key.toLowerCase() === 's') this.action('collect');
    else if (key.toLowerCase() === 'x') this.action('shovel');
    else if (key.startsWith('Arrow')) {
      v.cursor ??= { row: 2, col: 1 };
      v.cursor.row = Math.min(4, Math.max(0, v.cursor.row + (key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0)));
      v.cursor.col = Math.min(8, Math.max(0, v.cursor.col + (key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0)));
      this.host.announce?.(`第 ${v.cursor.row + 1} 行，第 ${v.cursor.col + 1} 列`);
    } else if (key === 'Enter' && v.cursor) this.action(`cell:${v.cursor.row}:${v.cursor.col}`);
    this.render();
  }
  private showBrief(config: GameConfig) { this.view.brief = config; this.view.modal = 'brief'; this.returnModal = null; }
  private start(config: GameConfig) {
    this.view.game = new Game(config); this.view.screen = 'playing'; this.view.modal = null; this.view.brief = null;
    this.view.seedPage = 0; this.view.selected = config.allowed.includes('sunflower') ? 'sunflower' : config.allowed[0]; this.view.shovel = false; this.view.speed = 1; this.view.cursor = null; this.view.toast = '';
    this.accumulator = 0; this.last = 0; this.recorded = false; this.returnModal = null; this.resize();
    this.host.announce?.(`${config.title}，选择植物后点击草坪种植`);
  }
  private newAdventure() {
    this.view.save.adventure = { round: 1, perks: [], seed: Math.floor(Date.now() % 2147483647), awaitingPerk: false };
    this.persist(); this.continueAdventure();
  }
  private continueAdventure() {
    const a = this.view.save.adventure;
    if (!a) { this.newAdventure(); return; }
    if (a.awaitingPerk) { this.view.screen = 'perks'; this.view.modal = null; }
    else this.showBrief(adventureConfig(a.round, a.perks, a.seed));
  }
  action(id: string) {
    const v = this.view, g = v.game, [name, arg, arg2] = id.split(':');
    if (v.save.settings.sound && !['cell', 'sun', 'collect'].includes(name)) this.host.sound('click');
    if (name === 'seed' && g && !v.modal && v.screen === 'playing') {
      const kind = arg as PlantKind;
      if (g.config.allowed.includes(kind)) { v.selected = kind; v.seedPage = Math.floor(PLANT_ORDER.indexOf(kind) / 8); v.shovel = false; this.host.announce?.(`${PLANTS[kind].name}，${PLANTS[kind].cost} 阳光，${PLANTS[kind].description}`); }
    } else if (name === 'seeds' && g && !v.modal && v.screen === 'playing') { v.seedPage = Math.max(0, Math.min(Math.ceil(PLANT_ORDER.length / 8) - 1, v.seedPage + (arg === 'next' ? 1 : -1)));
    } else if (name === 'cell' && g && !v.modal && v.screen === 'playing') {
      const row = Number(arg), col = Number(arg2); v.cursor = { row, col };
      const ok = v.shovel ? g.shovel(row, col) : v.selected ? g.plant(v.selected, row, col) : false;
      if (!ok) this.toast(v.selected || v.shovel ? g.lastMessage : '先选择一张种子卡');
      else { if (v.shovel) v.shovel = false; this.host.announce?.(g.lastMessage); }
    } else if (name === 'sun' && g && !v.modal && v.screen === 'playing') g.collectSun(Number(arg));
    else if (name === 'collect' && g && !v.modal && v.screen === 'playing') g.collectAll();
    else if (name === 'shovel' && g && !v.modal) v.shovel = !v.shovel;
    else if (name === 'speed' && g && !v.modal) v.speed = v.speed === 1 ? 2 : 1;
    else if (name === 'pause' && v.screen === 'playing') { v.modal = 'pause'; this.returnModal = null; this.host.silence(); }
    else if (name === 'settings' || name === 'help') { this.returnModal = v.modal === 'pause' ? 'pause' : null; v.modal = name; }
    else if (name === 'sound') { v.save.settings.sound = !v.save.settings.sound; if (!v.save.settings.sound) this.host.silence(); this.persist(); }
    else if (name === 'setting' && ['sound', 'autoSun', 'reducedMotion'].includes(arg)) { const key = arg as keyof typeof v.save.settings; v.save.settings[key] = !v.save.settings[key]; if (!v.save.settings.sound) this.host.silence(); this.persist(); }
    else if (name === 'close') { v.modal = v.modal === 'leave' ? 'pause' : this.returnModal; this.returnModal = null; }
    else if (name === 'home') { if (v.screen === 'playing') v.modal = 'leave'; else { v.screen = 'home'; v.modal = null; } }
    else if (name === 'levels') { v.screen = 'levels'; v.chapter = Math.floor((unlockedLevel(v.save) - 1) / 4); v.modal = null; }
    else if (name === 'chapter') v.chapter = Math.max(0, Math.min(CHAPTERS.length - 1, v.chapter + (arg === 'next' ? 1 : -1)));
    else if (name === 'continue-level') this.showBrief(levelConfig(unlockedLevel(v.save)));
    else if (name === 'level' && Number(arg) >= 1 && Number(arg) <= unlockedLevel(v.save)) this.showBrief(levelConfig(Number(arg)));
    else if (name === 'challenges') { v.screen = 'challenges'; v.modal = null; v.challengePage = 0; }
    else if (name === 'challenge-page') v.challengePage = Math.max(0, Math.min(Math.ceil(CHALLENGES.length / 4) - 1, v.challengePage + (arg === 'next' ? 1 : -1)));
    else if (name === 'almanac-page') v.almanacPage = Math.max(0, Math.min(Math.ceil((v.almanac === 'plants' ? PLANT_ORDER.length : Object.keys(ZOMBIES).length) / 8) - 1, v.almanacPage + (arg === 'next' ? 1 : -1)));
    else if (name === 'challenge') this.showBrief(challengeConfig(arg));
    else if (name === 'almanac') { v.screen = 'almanac'; v.almanacPage = 0; if (arg === 'plants' || arg === 'zombies') v.almanac = arg; v.modal = null; }
    else if (name === 'inspect') { v.detail = arg; v.modal = 'detail'; this.returnModal = null; }
    else if (name === 'adventure') {
      if (arg === 'continue') this.continueAdventure();
      else if (arg === 'new') { v.modal = 'new-adventure'; this.returnModal = null; }
      else if (arg === 'reset') this.newAdventure();
      else { v.screen = 'adventure'; v.modal = null; }
    } else if (name === 'perk') {
      const a = v.save.adventure;
      if (a?.awaitingPerk && PERKS.filter((_, i) => [0, 1, 2].some(j => (a.round - 1 + j) % PERKS.length === i)).some(p => p.id === arg)) { a.perks.push(arg as PerkId); a.round++; a.awaitingPerk = false; this.persist(); this.continueAdventure(); }
    } else if (name === 'start' && v.brief) this.start(v.brief);
    else if (name === 'retry' && g) {
      if (g.config.mode === 'adventure') {
        if (!v.save.adventure) this.newAdventure();
        else if (v.save.adventure.awaitingPerk) this.continueAdventure();
        else this.start(adventureConfig(v.save.adventure.round, v.save.adventure.perks, v.save.adventure.seed));
      } else this.start(g.config);
    } else if (name === 'next' && g?.state === 'won') {
      if (g.config.mode === 'adventure') this.continueAdventure();
      else if (g.config.mode === 'levels' && Number(g.config.id) < LEVELS.length) this.showBrief(levelConfig(Number(g.config.id) + 1));
    } else if (name === 'result' && arg === 'back' && g) { v.challengePage = Math.max(0, Math.floor(CHALLENGES.findIndex(c => c.id === g.config.id) / 4)); v.screen = g.config.mode === 'levels' ? 'levels' : g.config.mode === 'adventure' ? 'adventure' : 'challenges'; v.chapter = Math.floor((unlockedLevel(v.save) - 1) / 4); v.modal = null; }
    else if (name === 'leave') { if (arg === 'confirm') { v.screen = 'home'; v.modal = null; v.game = null; } else { v.modal = 'leave'; this.returnModal = null; } }
    this.flushSounds(); this.resize();
  }
  destroy() { this.stopped = true; this.host.cancelFrame(this.frameId); this.host.destroy(); }
}
