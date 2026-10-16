import { PLANTS, PLANT_ORDER, ZOMBIES, type GameConfig, type PlantKind, type ZombieKind } from './content';

export const ROWS = 5;
export const COLS = 9;
export const STEP = 1 / 30;
export type Sound = 'plant' | 'shoot' | 'sun' | 'hit' | 'boom' | 'mower' | 'win' | 'lose' | 'click';
export interface Plant { id: number; kind: PlantKind; row: number; col: number; hp: number; maxHp: number; timer: number; age: number; flash: number }
export interface Zombie { id: number; kind: ZombieKind; row: number; x: number; hp: number; maxHp: number; slow: number; flash: number; age: number; eating: boolean }
export interface Projectile { id: number; row: number; x: number; start: number; damage: number; ice: boolean; spore: boolean }
export interface Sun { id: number; x: number; y: number; target: number; value: number; age: number }
export interface Effect { x: number; row: number; life: number; max: number; kind: 'leaf' | 'hit' | 'boom' | 'sun'; value?: number }
export interface Mower { row: number; x: number; state: 'ready' | 'running' | 'used' }
interface Spawn { at: number; row: number; kind: ZombieKind; wave: number }
export class Game {
  readonly config: GameConfig;
  state: 'playing' | 'won' | 'lost' = 'playing';
  elapsed = 0;
  sun: number;
  plants: Plant[] = [];
  zombies: Zombie[] = [];
  projectiles: Projectile[] = [];
  suns: Sun[] = [];
  effects: Effect[] = [];
  mowers: Mower[];
  cooldowns = Object.fromEntries(PLANT_ORDER.map(k => [k, 0])) as Record<PlantKind, number>;
  wave = 0;
  kills = 0;
  planted = 0;
  collected = 0;
  sounds: Sound[] = [];
  lastMessage = '';
  private spawnQueue: Spawn[] = [];
  private nextId = 1;
  private rng: number;
  private skyTimer = 4;
  private scheduledWave = 0;
  private nextWaveAt = 12;
  readonly damageMultiplier: number;
  readonly healthMultiplier: number;

  constructor(config: GameConfig) {
    this.config = { ...config, allowed: [...config.allowed], perks: [...config.perks] };
    this.sun = config.startSun;
    this.rng = config.seed >>> 0;
    this.damageMultiplier = 1 + config.perks.filter(p => p === 'damage').length * .2;
    this.healthMultiplier = 1 + config.perks.filter(p => p === 'health').length * .3;
    this.mowers = Array.from({ length: ROWS }, (_, row) => ({ row, x: -.65, state: config.mowers ? 'ready' : 'used' }));
    if (config.fortress) for (let row = 0; row < ROWS; row++) this.addPlant('wallnut', row, 6);
  }
  private random(): number {
    this.rng = (Math.imul(1664525, this.rng) + 1013904223) >>> 0;
    return this.rng / 4294967296;
  }
  private sound(s: Sound) { if (this.sounds.length < 24) this.sounds.push(s); }
  private effect(x: number, row: number, kind: Effect['kind'], value?: number) {
    const life = kind === 'boom' ? .65 : .45;
    if (this.effects.length < 90) this.effects.push({ x, row, kind, value, life, max: life });
  }
  private addPlant(kind: PlantKind, row: number, col: number) {
    const hp = PLANTS[kind].hp * this.healthMultiplier;
    this.plants.push({ id: this.nextId++, kind, row, col, hp, maxHp: hp, timer: kind === 'sunflower' ? 5 : kind === 'cherry' ? .8 : .2, age: 0, flash: 0 });
  }
  canPlant(kind: PlantKind, row: number, col: number): string | null {
    if (this.state !== 'playing') return '本局已经结束';
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= ROWS || col < 0 || col >= COLS) return '请种在草坪里';
    if (!this.config.allowed.includes(kind)) return '本关未携带这张种子卡';
    if (this.plants.some(p => p.row === row && p.col === col && p.hp > 0)) return '这里已经有植物了';
    if (this.cooldowns[kind] > .001) return '种子还在冷却';
    if (this.sun < PLANTS[kind].cost) return '阳光不足，点一下金色阳光收集';
    return null;
  }
  plant(kind: PlantKind, row: number, col: number): boolean {
    const error = this.canPlant(kind, row, col);
    if (error) { this.lastMessage = error; return false; }
    this.sun -= PLANTS[kind].cost;
    this.cooldowns[kind] = PLANTS[kind].cooldown * Math.max(.4, 1 - .15 * this.config.perks.filter(p => p === 'cooldown').length);
    this.addPlant(kind, row, col);
    this.planted++;
    this.effect(col + .5, row, 'leaf');
    this.sound('plant');
    this.lastMessage = `种下了${PLANTS[kind].name}`;
    return true;
  }
  shovel(row: number, col: number): boolean {
    if (this.state !== 'playing') return false;
    const index = this.plants.findIndex(p => p.row === row && p.col === col);
    if (index < 0) { this.lastMessage = '这里没有需要移除的植物'; return false; }
    this.plants.splice(index, 1);
    this.effect(col + .5, row, 'leaf');
    this.sound('plant');
    this.lastMessage = '已腾出空地，铲除不返还阳光';
    return true;
  }
  collectSun(id: number): boolean {
    if (this.state !== 'playing') return false;
    const index = this.suns.findIndex(s => s.id === id);
    if (index < 0) return false;
    const s = this.suns[index];
    this.sun = Math.min(9999, this.sun + s.value);
    this.collected += s.value;
    this.suns.splice(index, 1);
    this.effect(s.x, s.y, 'sun', s.value);
    this.sound('sun');
    return true;
  }
  collectAll() { for (const sun of [...this.suns]) this.collectSun(sun.id); }
  private makeSun(x: number, y: number, target: number, value = 25) {
    if (this.suns.length < 36) this.suns.push({ id: this.nextId++, x, y, target, value, age: 0 });
  }
  private scheduleWave() {
    const wave = ++this.scheduledWave;
    const d = this.config.difficulty + (this.config.endless ? Math.floor((wave - 1) * 1.5) : 0);
    const count = Math.min(42, 3 + Math.ceil(d * .6) + wave * 2);
    for (let i = 0; i < count; i++) {
      let kind: ZombieKind = 'walker';
      const r = this.random();
      if (d >= 2 && r > .53) kind = 'cone';
      if (d >= 3 && r > .78) kind = 'runner';
      if (d >= 5 && r < .19) kind = 'bucket';
      if (d >= 7 && r > .35 && r < .51) kind = 'paper';
      if (d >= 11 && i === count - 1) kind = 'giant';
      // First wave introduces threats one lane at a time.
      const row = wave === 1 ? i % ROWS : Math.floor(this.random() * ROWS);
      const spacing = Math.max(.65, Math.min(3.3, this.config.waveGap * .64 / count));
      this.spawnQueue.push({ at: this.nextWaveAt + i * spacing, kind, row, wave });
    }
    this.nextWaveAt += this.config.waveGap;
  }
  private spawn(event: Spawn) {
    const hp = ZOMBIES[event.kind].hp * (1 + Math.max(0, this.config.difficulty - 1) * .018 + (this.config.endless ? (event.wave - 1) * .075 : 0));
    this.zombies.push({ id: this.nextId++, kind: event.kind, row: event.row, x: 9.35 + this.random() * .3, hp, maxHp: hp, slow: 0, flash: 0, age: 0, eating: false });
    this.wave = Math.max(this.wave, event.wave);
  }
  private damage(z: Zombie, amount: number) { z.hp -= amount; z.flash = .12; }
  private explode(plant: Plant, radius: number) {
    for (const z of this.zombies) if (z.hp > 0 && Math.abs(z.row - plant.row) <= (plant.kind === 'mine' ? 0 : 1) && Math.abs(z.x - (plant.col + .5)) <= radius) this.damage(z, PLANTS[plant.kind].damage * this.damageMultiplier);
    plant.hp = 0;
    this.effect(plant.col + .5, plant.row, 'boom');
    this.sound('boom');
  }
  update(dt: number) {
    if (this.state !== 'playing' || !Number.isFinite(dt) || dt <= 0) return;
    // Public callers may pass large time steps; preserve collision and wave semantics.
    if (dt > STEP + .00001) {
      let left = Math.min(dt, 60);
      while (left > 1e-8 && this.state === 'playing') { const step = Math.min(STEP, left); this.update(step); left -= step; }
      return;
    }
    this.elapsed += dt;
    for (const kind of PLANT_ORDER) this.cooldowns[kind] = Math.max(0, this.cooldowns[kind] - dt);
    if (this.elapsed >= this.nextWaveAt - 1 && (this.config.endless || this.scheduledWave < this.config.waves)) this.scheduleWave();
    while (this.spawnQueue.length && this.spawnQueue[0].at <= this.elapsed) {
      // Keep endless battles bounded without silently dropping scheduled enemies.
      if (this.zombies.length >= 80) break;
      this.spawn(this.spawnQueue.shift()!);
    }
    if (this.config.skySun) {
      this.skyTimer -= dt;
      if (this.skyTimer <= 0) { this.makeSun(.5 + this.random() * 7.5, -.25, this.random() * 4); this.skyTimer += 7; }
    }
    for (const s of this.suns) { s.age += dt; s.y = Math.min(s.target, s.y + dt * .65); }
    this.suns = this.suns.filter(s => s.age < 16);
    for (const plant of this.plants) {
      if (plant.hp <= 0) continue;
      plant.age += dt;
      plant.timer -= dt;
      plant.flash = Math.max(0, plant.flash - dt);
      const p = PLANTS[plant.kind];
      if (plant.kind === 'sunflower' && plant.timer <= 0 && this.config.production) {
        this.makeSun(plant.col + .65, plant.row - .1, plant.row + .35, 25 + 10 * this.config.perks.filter(p => p === 'sun').length);
        plant.timer = p.interval;
      } else if (plant.kind === 'cherry' && plant.timer <= 0) this.explode(plant, 1.65);
      else if (plant.kind === 'mine' && plant.age >= 9 && this.zombies.some(z => z.hp > 0 && z.row === plant.row && Math.abs(z.x - plant.col - .5) < .6)) this.explode(plant, .95);
      else if (['pea', 'ice', 'repeater', 'mushroom'].includes(plant.kind) && plant.timer <= 0) {
        const range = plant.kind === 'mushroom' ? 3 : 10;
        if (this.zombies.some(z => z.hp > 0 && z.row === plant.row && z.x > plant.col + .2 && z.x < plant.col + .5 + range)) {
          const count = plant.kind === 'repeater' ? 2 : 1;
          for (let i = 0; i < count && this.projectiles.length < 160; i++) this.projectiles.push({ id: this.nextId++, row: plant.row, x: plant.col + .75 - i * .23, start: plant.col + .5, damage: p.damage / count * this.damageMultiplier * (plant.kind === 'mushroom' && this.config.biome === 'night' ? 1.35 : 1), ice: plant.kind === 'ice', spore: plant.kind === 'mushroom' });
          plant.timer = p.interval;
          plant.flash = .15;
          this.sound('shoot');
        }
      }
    }
    for (const shot of this.projectiles) {
      const oldX = shot.x;
      shot.x += dt * (shot.spore ? 4.2 : 5.5);
      const target = this.zombies.filter(z => z.hp > 0 && z.row === shot.row && z.x >= oldX - .23 && z.x <= shot.x + .23).sort((a, b) => a.x - b.x)[0];
      if (target) { this.damage(target, shot.damage); if (shot.ice) target.slow = 4; this.effect(target.x, target.row, 'hit'); shot.x = 100; }
    }
    this.projectiles = this.projectiles.filter(p => p.x < 10 && (!p.spore || p.x - p.start < 3.1));
    for (const z of this.zombies) {
      if (z.hp <= 0) continue;
      z.age += dt;
      z.slow = Math.max(0, z.slow - dt);
      z.flash = Math.max(0, z.flash - dt);
      const info = ZOMBIES[z.kind];
      const rage = z.kind === 'paper' && z.hp < z.maxHp * .5 ? 1.9 : 1;
      const blocking = this.plants.filter(p => p.hp > 0 && p.row === z.row && p.col + .5 <= z.x + .15 && z.x - (p.col + .5) < .58 && p.kind !== 'cherry').sort((a, b) => b.col - a.col)[0];
      z.eating = !!blocking;
      if (blocking) { blocking.hp -= info.bite * dt * rage * (z.slow > 0 ? .5 : 1); blocking.flash = .08; }
      else z.x -= info.speed * dt * this.config.speed * rage * (z.slow > 0 ? .5 : 1);
      const mower = this.mowers[z.row];
      if (z.x < .05 && mower.state === 'ready') { mower.state = 'running'; this.sound('mower'); }
      if (z.x < -.95 && mower.state !== 'running') { this.state = 'lost'; this.sound('lose'); }
    }
    for (const mower of this.mowers) if (mower.state === 'running') {
      const from = mower.x;
      mower.x += dt * 6;
      for (const z of this.zombies) if (z.row === mower.row && z.x >= from - .6 && z.x <= mower.x + .65) z.hp = 0;
      if (mower.x > 10.5) mower.state = 'used';
    }
    const dead = this.zombies.filter(z => z.hp <= 0);
    this.kills += dead.length;
    for (const z of dead) this.effect(z.x, z.row, 'leaf');
    this.zombies = this.zombies.filter(z => z.hp > 0);
    this.plants = this.plants.filter(p => p.hp > 0);
    for (const fx of this.effects) fx.life -= dt;
    this.effects = this.effects.filter(fx => fx.life > 0);
    if (this.state === 'playing' && !this.config.endless && this.scheduledWave === this.config.waves && this.spawnQueue.length === 0 && this.zombies.length === 0) { this.state = 'won'; this.sound('win'); }
  }
  get score(): number { return this.kills * 100 + Math.floor(this.sun / 5) + (this.state === 'won' ? this.stars * 500 : 0); }
  get stars(): number { const left = this.mowers.filter(m => m.state === 'ready').length; return this.state !== 'won' ? 0 : !this.config.mowers ? 3 : left === 5 ? 3 : left >= 3 ? 2 : 1; }
  get progress(): number { return this.config.endless ? (this.elapsed % this.config.waveGap) / this.config.waveGap : Math.min(1, this.elapsed / (12 + (this.config.waves - 1) * this.config.waveGap + this.config.waveGap * .64)); }
  get waveText(): string { return this.wave === 0 ? '准备种植' : this.config.endless ? `第 ${this.wave} 波` : `第 ${this.wave} / ${this.config.waves} 波`; }
}
