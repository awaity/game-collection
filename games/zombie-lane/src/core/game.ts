/** Pure, deterministic gameplay. No renderer, wall clock or platform globals. */
export const STEP = 1 / 60;
export const MAX_ENEMIES = 90;
export const MAX_BULLETS = 160;
export const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export type Phase = 'ready' | 'playing' | 'paused' | 'won' | 'lost';
export type Difficulty = 'normal' | 'hard';
export type EnemyKind = 'walker' | 'runner' | 'brute' | 'boss';
export type GateKind = 'double' | 'damage' | 'gatling' | 'repair' | 'cannon';
export type EventKind = 'shot' | 'hit' | 'kill' | 'upgrade' | 'damage' | 'wave' | 'boss' | 'blast' | 'airstrike' | 'win' | 'lose';
export interface GameEvent { kind: EventKind; x: number; z: number; value?: number; text?: string; tier?: number; }
export interface Enemy { id: number; kind: EnemyKind; x: number; z: number; hp: number; maxHp: number; speed: number; wobble: number; hit: number; attack: number; }
export interface Bullet { id: number; x: number; z: number; vx: number; vz: number; damage: number; tier: number; age: number; target: 'gate' | 'enemy'; }
export interface Gate { kind: GateKind; hp: number; maxHp: number; x: number; z: number; hit: number; }
export interface Stats { kills: number; shots: number; hits: number; upgrades: number; airstrikes: number; damageTaken: number; peakEnemies: number; }
export const WEAPONS = [
  { name: '突击步枪', short: '步枪', damage: 14, interval: .22, speed: 40, color: '#f7d461' },
  { name: '六管加特林', short: '加特林', damage: 11, interval: .075, speed: 48, color: '#6be0ed' },
  { name: '雷霆火炮', short: '火炮', damage: 64, interval: .32, speed: 34, color: '#ffb669' },
] as const;
export const GATES: { kind: GateKind; title: string; subtitle: string; hp: number; color: string }[] = [
  { kind: 'double', title: '×2 子弹', subtitle: '双发齐射', hp: 100, color: '#258eaf' },
  { kind: 'damage', title: '伤害 +50%', subtitle: '火力加码', hp: 240, color: '#4b9b7b' },
  { kind: 'gatling', title: '换加特林', subtitle: '六管全开', hp: 620, color: '#258eaf' },
  { kind: 'repair', title: '防线 +30', subtitle: '紧急修复', hp: 650, color: '#4b9b7b' },
  { kind: 'cannon', title: '雷霆火炮', subtitle: '范围爆破', hp: 1650, color: '#c48736' },
  { kind: 'damage', title: '伤害 +50%', subtitle: '火力加码', hp: 2400, color: '#4b9b7b' },
  { kind: 'repair', title: '防线 +30', subtitle: '紧急修复', hp: 2800, color: '#4b9b7b' },
];
export function randomGenerator(seed: number) {
  let state = seed >>> 0 || 1;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}
function segmentDistance(ax: number, az: number, bx: number, bz: number, px: number, pz: number) {
  const dx = bx - ax, dz = bz - az, len = dx * dx + dz * dz;
  const t = len ? clamp(((px - ax) * dx + (pz - az) * dz) / len, 0, 1) : 0;
  return { d: Math.hypot(ax + dx * t - px, az + dz * t - pz), t };
}
export class Game {
  phase: Phase = 'ready';
  tick = 0;
  time = 0;
  wave = 1;
  hp = 100;
  x = 1.8;
  targetX = 1.8;
  aimX = 1.8;
  aimZ = 20;
  tier = 0;
  pellets = 1;
  power = 1;
  gateIndex = 0;
  gate: Gate | null;
  gateWait = 0;
  enemies: Enemy[] = [];
  bullets: Bullet[] = [];
  events: GameEvent[] = [];
  bossSpawned = false;
  bossKilled = false;
  nextSpawn = 1.5;
  nextShot = .2;
  bombReadyAt = 0;
  combo = 0;
  comboUntil = 0;
  maxCombo = 0;
  id = 1;
  stats: Stats = { kills: 0, shots: 0, hits: 0, upgrades: 0, airstrikes: 0, damageTaken: 0, peakEnemies: 0 };
  random: () => number;
  constructor(public difficulty: Difficulty = 'normal', public seed = 61728) {
    this.random = randomGenerator(seed);
    this.gate = this.makeGate();
  }
  get side() { return this.x < -.45 ? 'upgrade' : 'defend'; }
  get weapon() { return WEAPONS[this.tier]; }
  get score() { return this.stats.kills * 100 + this.stats.upgrades * 300 + (this.phase === 'won' ? Math.ceil(this.hp) * 30 + 5000 : 0); }
  get boss() { return this.enemies.find(e => e.kind === 'boss'); }
  get gateConfig() { return GATES[Math.min(this.gateIndex, GATES.length - 1)]; }
  start() { if (this.phase === 'ready') this.phase = 'playing'; }
  pause() { if (this.phase === 'playing') this.phase = 'paused'; }
  resume() { if (this.phase === 'paused') this.phase = 'playing'; }
  setTarget(x: number) { if (Number.isFinite(x)) this.targetX = clamp(x, -3.8, 3.8); }
  emit(event: GameEvent) { this.events.push(event); if (this.events.length > 300) this.events.shift(); }
  drainEvents() { const result = this.events; this.events = []; return result; }
  makeGate(): Gate {
    const hp = GATES[Math.min(this.gateIndex, GATES.length - 1)].hp;
    return { kind: GATES[Math.min(this.gateIndex, GATES.length - 1)].kind, hp, maxHp: hp, x: -2.55, z: 12, hit: -10 };
  }
  spawn(kind: EnemyKind = 'walker', z = 31 + this.random() * 3, x = .45 + this.random() * 3.4) {
    if (this.enemies.length >= MAX_ENEMIES) return;
    const factor = this.difficulty === 'hard' ? 1.3 : 1;
    const health = { walker: 42 + this.wave * 12, runner: 38 + this.wave * 8, brute: 240 + this.wave * 30, boss: 6200 }[kind] * factor;
    const speed = { walker: 1.05 + this.wave * .16, runner: 2.5, brute: .9, boss: .78 }[kind];
    this.enemies.push({ id: this.id++, kind, x, z, hp: health, maxHp: health, speed, wobble: this.random() * Math.PI * 2, hit: -10, attack: 0 });
  }
  hitEnemy(enemy: Enemy, damage: number) {
    if (enemy.hp <= 0) return;
    enemy.hp = Math.max(0, enemy.hp - damage);
    enemy.hit = this.time;
    if (enemy.hp === 0) {
      this.stats.kills++;
      this.combo = this.time < this.comboUntil ? this.combo + 1 : 1;
      this.comboUntil = this.time + 1.8;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.emit({ kind: 'kill', x: enemy.x, z: enemy.z, value: enemy.kind === 'boss' ? 3 : 1 });
      if (enemy.kind === 'boss') this.bossKilled = true;
    }
  }
  explode(x: number, z: number, damage: number, radius: number) {
    for (const enemy of this.enemies) if (Math.hypot(enemy.x - x, enemy.z - z) <= radius) this.hitEnemy(enemy, damage);
    this.emit({ kind: 'blast', x, z, value: radius });
  }
  airstrike() {
    if (this.phase !== 'playing' || this.time < this.bombReadyAt) return false;
    this.bombReadyAt = this.time + 28;
    this.stats.airstrikes++;
    for (const enemy of this.enemies) this.hitEnemy(enemy, enemy.kind === 'boss' ? 950 : 350 + this.tier * 90);
    this.emit({ kind: 'airstrike', x: 2, z: 12, text: '空袭到达 · 全线轰炸' });
    return true;
  }
  breakGate() {
    if (!this.gate || this.gate.hp > 0) return;
    const kind = this.gate.kind;
    if (kind === 'double') this.pellets = 2;
    if (kind === 'damage') this.power = Math.min(3, this.power + .5);
    if (kind === 'gatling') this.tier = 1;
    if (kind === 'cannon') this.tier = 2;
    if (kind === 'repair') this.hp = Math.min(100, this.hp + 30);
    const text = kind === 'gatling' ? '加特林就位！转身清场' : kind === 'cannon' ? '雷霆火炮！范围爆破' : kind === 'double' ? '双发齐射 · 子弹 ×2' : kind === 'repair' ? '防线修复 +30' : '伤害提升 50%';
    this.emit({ kind: 'upgrade', x: this.x, z: 0, text, tier: this.tier });
    this.stats.upgrades++;
    this.gate = null;
    this.gateIndex++;
    this.gateWait = this.time + 2.2;
    // A real, limited shockwave makes an upgrade useful in a close-call situation.
    if (kind === 'gatling' || kind === 'cannon') this.explode(2, 3, kind === 'cannon' ? 220 : 110, 7);
  }
  takeDamage(amount: number, x: number) {
    const actual = Math.min(this.hp, amount);
    this.hp -= actual;
    this.stats.damageTaken += actual;
    this.emit({ kind: 'damage', x, z: 0, value: actual });
  }
  shoot() {
    let target: { x: number; z: number } | undefined;
    if (this.side === 'upgrade') target = this.gate ?? undefined;
    else {
      let nearest = Infinity;
      for (const enemy of this.enemies) if (enemy.hp > 0 && enemy.z < 21) {
        const distance = Math.hypot(enemy.x - this.x, enemy.z);
        if (distance < nearest) { nearest = distance; target = { x: enemy.x, z: Math.max(.3, enemy.z - enemy.speed * distance / this.weapon.speed) }; }
      }
    }
    this.aimX = target?.x ?? this.x;
    this.aimZ = target?.z ?? 22;
    if (!target || this.bullets.length >= MAX_BULLETS - this.pellets) return;
    for (let i = 0; i < this.pellets; i++) {
      const offset = (i - (this.pellets - 1) / 2) * .22;
      const dx = target.x + offset - this.x, dz = target.z - .55, len = Math.max(.1, Math.hypot(dx, dz));
      this.bullets.push({ id: this.id++, x: this.x + offset, z: .55, vx: dx / len * this.weapon.speed, vz: dz / len * this.weapon.speed, damage: this.weapon.damage * this.power, tier: this.tier, age: 0, target: this.side === 'upgrade' ? 'gate' : 'enemy' });
      this.stats.shots++;
    }
    this.emit({ kind: 'shot', x: this.x, z: .6, tier: this.tier });
  }
  step(targetX = this.targetX) {
    if (this.phase !== 'playing') return;
    this.setTarget(targetX);
    this.tick++;
    this.time = this.tick * STEP;
    this.x += clamp(this.targetX - this.x, -STEP * 14, STEP * 14);
    const wave = this.time < 24 ? 1 : this.time < 48 ? 2 : 3;
    if (wave !== this.wave) { this.wave = wave; this.emit({ kind: 'wave', x: 0, z: 0, value: wave, text: wave === 2 ? '第二波 · 疾跑者来袭' : '最终波 · 守住防线' }); }
    // Authored surges create a decision: keep charging the gate, or turn back now.
    if ([14 * 60, 32 * 60, 51 * 60].includes(this.tick)) {
      const count = this.wave === 1 ? 12 : this.wave === 2 ? 18 : 24;
      for (let i = 0; i < count; i++) this.spawn(this.wave > 1 && i % 6 === 0 ? 'brute' : this.wave > 1 && i % 4 === 0 ? 'runner' : 'walker', 13 + Math.floor(i / 5) * 1.5, .6 + (i % 5) * .72);
      this.emit({ kind: 'wave', x: 2, z: 14, text: '尸潮逼近！右移开火' });
    }
    if (this.time >= this.nextSpawn && this.time < 74) {
      const count = this.wave + (this.time > 10 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        const r = this.random();
        this.spawn(this.wave > 1 && r < .15 ? 'brute' : this.wave > 1 && r < .4 ? 'runner' : 'walker');
      }
      this.nextSpawn = this.time + (this.difficulty === 'hard' ? 1.0 : 1.3);
    }
    if (this.time >= 58 && !this.bossSpawned) {
      // Reserve the boss slot even if a player has left the whole horde alive.
      if (this.enemies.length >= MAX_ENEMIES) this.enemies.pop();
      this.spawn('boss', 31, 2);
      this.bossSpawned = true;
      this.emit({ kind: 'boss', x: 2, z: 31, text: '尸王出现 · 击败它，结束封锁' });
    }
    if (!this.gate && this.time >= this.gateWait) this.gate = this.makeGate();
    if (this.time >= this.nextShot) { this.shoot(); this.nextShot = this.time + this.weapon.interval; }
    for (const bullet of this.bullets) {
      const ox = bullet.x, oz = bullet.z;
      bullet.x += bullet.vx * STEP; bullet.z += bullet.vz * STEP; bullet.age += STEP;
      if (bullet.target === 'gate' && this.gate) {
        const hit = segmentDistance(ox, oz, bullet.x, bullet.z, this.gate.x, this.gate.z);
        if (hit.d < 1.05) {
          this.gate.hp = Math.max(0, this.gate.hp - bullet.damage);
          this.gate.hit = this.time; bullet.age = 10; this.stats.hits++;
          this.emit({ kind: 'hit', x: bullet.x, z: bullet.z, tier: bullet.tier });
          this.breakGate();
        }
      } else if (bullet.target === 'enemy') {
        let nearest: Enemy | undefined, nearestT = Infinity;
        for (const enemy of this.enemies) {
          if (enemy.hp <= 0) continue;
          const hit = segmentDistance(ox, oz, bullet.x, bullet.z, enemy.x, enemy.z);
          if (hit.d < (enemy.kind === 'boss' ? 1.0 : enemy.kind === 'brute' ? .58 : .42) && hit.t < nearestT) { nearest = enemy; nearestT = hit.t; }
        }
        if (nearest) {
          if (bullet.tier === 2) this.explode(nearest.x, nearest.z, bullet.damage, 2.1);
          else this.hitEnemy(nearest, bullet.damage);
          bullet.age = 10; this.stats.hits++;
          this.emit({ kind: 'hit', x: nearest.x, z: nearest.z, tier: bullet.tier });
        }
      }
    }
    this.bullets = this.bullets.filter(b => b.age < 1.8 && b.z < 38 && b.z > -.5);
    for (const enemy of this.enemies) {
      if (enemy.hp <= 0) continue;
      enemy.z -= enemy.speed * STEP;
      if (enemy.z < .2) {
        if (enemy.kind === 'boss') {
          enemy.z = .2;
          if (this.time >= enemy.attack) { this.takeDamage(25, enemy.x); enemy.attack = this.time + 1.2; }
        } else {
          this.takeDamage(enemy.kind === 'brute' ? 18 : enemy.kind === 'runner' ? 7 : 8, enemy.x);
          enemy.hp = 0;
        }
      }
    }
    this.enemies = this.enemies.filter(e => e.hp > 0);
    this.stats.peakEnemies = Math.max(this.stats.peakEnemies, this.enemies.length);
    if (this.time > this.comboUntil) this.combo = 0;
    // Defeat wins ties: a lethal breach cannot be disguised as a victory.
    if (this.hp <= 0) { this.phase = 'lost'; this.emit({ kind: 'lose', x: this.x, z: 0 }); }
    else if (this.bossKilled) {
      // The boss's final explosion clears remaining enemies using the same damage rules.
      for (const enemy of this.enemies) this.hitEnemy(enemy, enemy.hp);
      this.enemies = []; this.bullets = [];
      this.phase = 'won'; this.emit({ kind: 'win', x: 2, z: 10 });
    }
  }
  summary() {
    return { phase: this.phase, time: this.time, hp: this.hp, x: this.x, tier: this.tier, pellets: this.pellets, power: this.power, wave: this.wave, gateIndex: this.gateIndex, gateHp: this.gate?.hp, bossHp: this.boss?.hp, bossKilled: this.bossKilled, score: this.score, enemies: this.enemies.length, bullets: this.bullets.length, stats: { ...this.stats } };
  }
}
