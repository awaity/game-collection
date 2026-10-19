import { ENDLESS_EVENTS, PLANTS, PLANT_ORDER, ZOMBIES, type GameConfig, type PlantKind, type ZombieKind } from './content';

export const ROWS = 5;
export const COLS = 9;
export const STEP = 1 / 30;
export type Sound = 'plant' | 'shoot' | 'sun' | 'hit' | 'boom' | 'mower' | 'win' | 'lose' | 'click';
export interface Plant { id: number; kind: PlantKind; row: number; col: number; hp: number; maxHp: number; timer: number; age: number; flash: number }
export interface Zombie { haste?:number; id: number; kind: ZombieKind; row: number; x: number; hp: number; maxHp: number; slow: number; flash: number; age: number; eating: boolean; freeze: number; thaw: number; ability: number; summons: number; vaulted: boolean }
export interface Projectile { id: number; row: number; x: number; start: number; damage: number; ice: boolean; spore: boolean; type?: 'fire' | 'corn' | 'leaf' | 'spike'; age?: number; duration?: number; target?: number; returning?: boolean; hits?: number[] }
export interface Sun { id: number; x: number; y: number; target: number; value: number; age: number }
export interface Effect { x: number; row: number; life: number; max: number; kind: 'leaf' | 'hit' | 'boom' | 'sun' | 'freeze' | 'shatter' | 'fire' | 'lightning' | 'heal' | 'vault'; value?: number; toX?: number; toRow?: number }
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
  clearedWaves = 0;
  intermission = false;
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
    this.damageMultiplier = (1 + config.perks.filter(p => p === 'damage').length * .2)*(config.damageScale??1);
    this.healthMultiplier = 1 + config.perks.filter(p => p === 'health').length * .3+(config.guardLevel??0)*.15;
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
    this.plants.push({ id: this.nextId++, kind, row, col, hp, maxHp: hp, timer: kind === 'sunflower' ? 5 : kind === 'cherry' ? .8 : kind === 'icebloom' ? .9 : .2, age: 0, flash: 0 });
  }
  canPlant(kind: PlantKind, row: number, col: number): string | null {
    if (this.state !== 'playing') return '本局已经结束';
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= ROWS || col < 0 || col >= COLS) return '请种在草坪里';
    if(this.config.blocked?.some(([r,c])=>r===row&&c===col))return '这里是露台花箱，请选择空地';
    if (!this.config.allowed.includes(kind)) return '本关未携带这张种子卡';
    if (this.plants.some(p => p.row === row && p.col === col && p.hp > 0)) return '这里已经有植物了';
    if (this.config.plantLimit && this.plants.filter(p => p.hp > 0).length >= this.config.plantLimit) return `最多同时种植 ${this.config.plantLimit} 株，请先铲除调整阵容`;
    if (this.cooldowns[kind] > .001) return '种子还在冷却';
    if (this.sun < PLANTS[kind].cost) return '阳光不足，点一下金色阳光收集';
    return null;
  }
  plant(kind: PlantKind, row: number, col: number): boolean {
    const error = this.canPlant(kind, row, col);
    if (error) { this.lastMessage = error; return false; }
    this.sun -= PLANTS[kind].cost;
    this.cooldowns[kind] = PLANTS[kind].cooldown * (this.config.cooldownScale ?? 1) * Math.max(.4, 1 - .15 * this.config.perks.filter(p => p === 'cooldown').length);
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
    this.intermission = false;
    const d = this.config.difficulty + (this.config.endless ? Math.min(30, (wave - 1) * 1.2) : 0);
    const count = Math.min(42, 3 + Math.ceil(d * .5) + (this.config.endless ? Math.min(wave, 10) : wave) * 2);
    const pool: ZombieKind[] = this.config.enemyPool ?? ['walker', 'cone', ...(d >= 3 ? ['runner' as const] : []), ...(d >= 5 ? ['bucket' as const] : []), ...(d >= 7 ? ['paper' as const] : []), ...(this.config.endless && wave > 5 ? ['dancer' as const, 'medic' as const, 'vaulter' as const] : []), ...(this.config.endless && wave > 8 ? ['drummer' as const, 'bomber' as const] : []), ...(this.config.endless && wave > 10 ? ['balloon' as const, 'digger' as const] : [])];
    const focus: ZombieKind[] = this.config.endless ? [(['walker', 'runner', 'frost', 'shield', 'giant'] as ZombieKind[])[(wave - 1) % 5]] : this.config.focus ?? (d >= 11 ? ['giant'] : []);
    for (let i = 0; i < count; i++) {
      let kind = pool[Math.floor(this.random() * pool.length)];
      const special = focus[(wave - 1) % focus.length];
      if (special && (i === count - 1 || special !== 'giant' && i % 4 === 3)) kind = special;
      if ((this.config.endless && wave % 5 === 0 || this.config.mode === 'levels' && ['16','24'].includes(this.config.id) && wave === 5) && i >= count - 2) kind = 'giant';
      let row = wave === 1 ? i % ROWS : Math.floor(this.random() * ROWS);
      if (this.config.pattern === 'center' && i % 5 !== 0) row = 1 + i % 3;
      if (this.config.pattern === 'flanks' && i % 5 !== 0) row = i % 2 ? 0 : 4;
      const spacing = Math.max(.65, Math.min(3.3, this.config.waveGap * .64 / count));
      this.spawnQueue.push({ at: this.nextWaveAt + i * spacing, kind, row, wave });
    }
    if (!this.config.endless) this.nextWaveAt += this.config.waveGap;
  }
  private spawn(event: Spawn) {
    const hp = ZOMBIES[event.kind].hp * (1 + Math.max(0, this.config.difficulty - 1) * .018 + (this.config.endless ? (event.wave - 1) * .055 : 0));
    const zombie: Zombie = { id: this.nextId++, kind: event.kind, row: event.row, x: 9.35 + this.random() * .3, hp, maxHp: hp, slow: 0, flash: 0, age: 0, eating: false, freeze: 0, thaw: 0, ability: event.kind === 'medic' ? 4 : 10, summons: 0, vaulted: false };
    if(zombie.kind==='digger')zombie.x=4.5;
    this.zombies.push(zombie);
    this.wave = Math.max(this.wave, event.wave);
    return zombie;
  }
  private damage(z: Zombie, amount: number, type: 'direct' | 'area' | 'fire' = 'direct') {
    if (z.hp <= 0) return;
    if (z.kind === 'shield' && type !== 'area') amount *= .4;
    if (type === 'fire') {
      if (z.kind === 'frost') amount *= 1.3;
      if (z.freeze > 0) {
        amount += this.config.id === 'frostfire' ? 120 : 45;
        z.freeze = 0; z.slow = 0; z.thaw = 2;
        this.effect(z.x, z.row, 'shatter');
      }
    }
    z.hp -= amount; z.flash = .12;
  }
  private freeze(z: Zombie, seconds: number, force = false) {
    z.slow = z.kind === 'frost' ? 1.5 : 4;
    if (z.hp <= 0 || !force && (z.freeze > 0 || z.thaw > 0)) return;
    z.freeze = Math.max(z.freeze, seconds * (z.kind === 'frost' ? .3 : z.kind === 'giant' ? .55 : 1));
    z.eating = false;if(z.kind==='balloon')z.vaulted=true;
    this.effect(z.x, z.row, 'freeze');
  }
  private firePlant(plant: Plant) {
    const p = PLANTS[plant.kind], start = plant.col + .5;
    const visible = this.zombies.filter(z => z.hp > 0 && z.x > start - .3 && z.x < 10);
    if (plant.kind === 'lightning') {
      let from = { x: start, row: plant.row }, hit = new Set<number>();
      for (let n = 0; n < 4; n++) {
        const target = visible.filter(z => !hit.has(z.id) && (n === 0 ? Math.abs(z.row - plant.row) <= 1 && z.x - start <= 4 : Math.hypot(z.x - from.x, z.row - from.row) <= 2.2)).sort((a,b) => Math.hypot(a.x - from.x, a.row - from.row) - Math.hypot(b.x - from.x, b.row - from.row))[0];
        if (!target) break;
        this.damage(target, p.damage * this.damageMultiplier * .82 ** n, 'area');
        if (this.effects.length < 90) this.effects.push({kind:'lightning',x:from.x,row:from.row,toX:target.x,toRow:target.row,life:.3,max:.3});
        hit.add(target.id); from = target;
      }
      if (!hit.size) return;
    } else {
      const rows = plant.kind === 'threepeater' ? [plant.row - 1, plant.row, plant.row + 1].filter(r => r >= 0 && r < ROWS) : [plant.row];
      const range = plant.kind === 'mushroom' ? 3 : ['boomerang','cactus'].includes(plant.kind) ? 5 : 10;
      if (!visible.some(z => rows.includes(z.row) && z.x - start < range)) return;
      for (const row of rows) {
        const count = plant.kind === 'repeater' ? 2 : 1;
        for (let i = 0; i < count && this.projectiles.length < 160; i++) {
          const shot: Projectile = { id: this.nextId++, row, x: start + .25 - i * .23, start, damage: p.damage / count * this.damageMultiplier * (plant.kind === 'mushroom' && this.config.biome === 'night' ? 1.35 : 1), ice: plant.kind === 'ice', spore: plant.kind === 'mushroom' };
          if (plant.kind === 'corn') {
            const target = visible.filter(z => z.row === row).sort((a,b) => a.x - b.x)[0];
            if (!target) continue;
            Object.assign(shot, { type: 'corn', target: target.x - .12, age: 0, duration: Math.min(1.2, .4 + (target.x - start) * .08) });
          }
          if (plant.kind === 'boomerang') Object.assign(shot, { type: 'leaf', hits: [], returning: false });
          if(plant.kind==='cactus')Object.assign(shot,{type:'spike',hits:[]});
          this.projectiles.push(shot);
        }
      }
    }
    plant.timer = p.interval*(this.config.intervalScale??1); plant.flash = .18; this.sound('shoot');
  }
  private advanceShots(dt: number) {
    for (const shot of this.projectiles) {
      const oldX = shot.x;
      if (shot.type === 'corn') {
        shot.age = (shot.age ?? 0) + dt;
        shot.x = shot.start + (shot.target! - shot.start) * Math.min(1, shot.age / shot.duration!);
        if (shot.age >= shot.duration!) {
          for (const z of this.zombies) if (z.hp > 0 && z.row === shot.row && Math.abs(z.x - shot.target!) < .85) { this.damage(z, shot.damage, 'area'); z.slow = Math.max(z.slow, 1); }
          this.effect(shot.target!, shot.row, 'boom', .45); shot.x = 100;
        }
        continue;
      }
      shot.x += dt * (shot.spore ? 4.2 : 5.5) * (shot.returning ? -1 : 1);
      if (shot.type === 'spike') {for(const z of this.zombies)if(z.hp>0&&z.row===shot.row&&z.x>=oldX-.23&&z.x<=shot.x+.23&&!shot.hits!.includes(z.id)){this.damage(z,shot.damage,'area');if(z.kind==='balloon')z.vaulted=true;shot.hits!.push(z.id);}if(shot.x-shot.start>5)shot.x=100;continue;}
      if (shot.type === 'leaf') {
        const targets = this.zombies.filter(z => z.hp > 0 && z.row === shot.row && z.x >= Math.min(oldX, shot.x) - .23 && z.x <= Math.max(oldX, shot.x) + .23 && !shot.hits!.includes(z.id));
        for (const z of targets) { this.damage(z, shot.damage, 'area'); shot.hits!.push(z.id); this.effect(z.x, z.row, 'hit'); }
        if (!shot.returning && shot.x >= Math.min(9.8, shot.start + 5)) { shot.x = Math.min(9.8, shot.start + 5); shot.returning = true; shot.hits = []; }
        else if (shot.returning && shot.x <= shot.start) shot.x = 100;
        continue;
      }
      if (!shot.ice && !shot.spore && !shot.type && this.plants.some(p => p.kind === 'torch' && p.hp > 0 && p.row === shot.row && p.col + .5 >= oldX && p.col + .5 <= shot.x)) { shot.type = 'fire'; shot.damage *= 2; }
      const target = this.zombies.filter(z => z.hp > 0 && (z.kind!=='balloon'||z.vaulted||z.freeze>0||shot.ice) && z.row === shot.row && z.x >= oldX - .23 && z.x <= shot.x + .23).sort((a,b) => a.x - b.x)[0];
      if (target) {
        this.damage(target, shot.damage, shot.type === 'fire' ? 'fire' : 'direct');
        if (shot.ice) this.freeze(target, 1.3);
        if (shot.type === 'fire') for (const z of this.zombies) if (z.id !== target.id && z.hp > 0 && z.row === target.row && Math.abs(z.x - target.x) < .7) this.damage(z, shot.damage * .45, 'fire');
        this.effect(target.x, target.row, shot.type === 'fire' ? 'fire' : 'hit'); shot.x = 100;
      }
    }
    this.projectiles = this.projectiles.filter(p => p.x < 10 && p.x > -1 && (!p.spore || p.x - p.start < 3.1));
  }
  private explode(plant: Plant, radius: number) {
    for (const z of this.zombies) if (z.hp > 0 && Math.abs(z.row - plant.row) <= (plant.kind === 'mine' ? 0 : 1) && Math.abs(z.x - (plant.col + .5)) <= radius) this.damage(z, PLANTS[plant.kind].damage * this.damageMultiplier, 'area');
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
    if (this.elapsed >= this.nextWaveAt - 1 && (this.config.endless ? this.scheduledWave === this.clearedWaves : this.scheduledWave < this.config.waves)) this.scheduleWave();
    while (this.spawnQueue.length && this.spawnQueue[0].at <= this.elapsed) {
      // Keep endless battles bounded without silently dropping scheduled enemies.
      if (this.zombies.length >= 80) break;
      this.spawn(this.spawnQueue.shift()!);
    }
    if (this.config.skySun) {
      this.skyTimer -= dt;
      if (this.skyTimer <= 0) { this.makeSun(.5 + this.random() * 7.5, -.25, this.random() * 4, this.config.sunValue ?? 25); this.skyTimer += this.config.sunInterval ?? 7; }
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
      } else if(plant.kind==='pepper'&&plant.timer<=0){for(const z of this.zombies)if(z.row===plant.row)this.damage(z,p.damage*this.damageMultiplier,'fire');plant.hp=0;for(let x=0;x<9;x++)this.effect(x+.5,plant.row,'fire');this.sound('boom');}
      else if(plant.kind==='clover'&&plant.timer<=0){for(const ally of this.plants)if(ally.id!==plant.id&&ally.hp>0&&Math.abs(ally.row-plant.row)<=1&&Math.abs(ally.col-plant.col)<=1){ally.hp=Math.min(ally.maxHp,ally.hp+75);this.effect(ally.col+.5,ally.row,'heal');}plant.timer=p.interval;}
      else if(plant.kind==='magnet'&&plant.timer<=0){const target=this.zombies.find(z=>z.hp>0&&['shield','bucket','frost'].includes(z.kind)&&Math.hypot(z.row-plant.row,z.x-plant.col-.5)<2.5);if(target){target.kind='walker';target.hp=Math.min(target.hp,165);target.maxHp=165;this.effect(target.x,target.row,'lightning');plant.timer=p.interval;}}
      else if (plant.kind === 'cherry' && plant.timer <= 0) this.explode(plant, 1.65);
      else if (plant.kind === 'mine' && plant.age >= 9 && this.zombies.some(z => z.hp > 0 && z.row === plant.row && Math.abs(z.x - plant.col - .5) < .6)) this.explode(plant, .95);
      else if (plant.kind === 'icebloom' && plant.timer <= 0) {
        for (const z of this.zombies) if (z.hp > 0) { this.damage(z, p.damage * this.damageMultiplier, 'area'); this.freeze(z, 3, true); }
        plant.hp = 0; this.effect(plant.col + .5, plant.row, 'freeze'); this.sound('boom');
      } else if (p.damage > 0 && !['mine', 'cherry', 'icebloom'].includes(plant.kind) && plant.timer <= 0) this.firePlant(plant);
    }
    this.advanceShots(dt);
    for (const z of this.zombies) {
      if (z.hp <= 0) continue;
      z.slow = Math.max(0, z.slow - dt);
      z.flash = Math.max(0, z.flash - dt);
      if (z.freeze > 0) {
        z.freeze = Math.max(0, z.freeze - dt); z.eating = false;
        if (z.freeze === 0) { z.thaw = 2; this.effect(z.x, z.row, 'shatter'); }
        continue;
      }
      z.haste=Math.max(0,(z.haste??0)-dt);
      z.age += dt; z.thaw = Math.max(0, z.thaw - dt); z.ability -= dt;
      if (z.kind === 'medic' && z.ability <= 0) {
        for (const ally of this.zombies) if (ally.id !== z.id && ally.hp > 0 && ally.hp < ally.maxHp && Math.hypot(ally.x - z.x, ally.row - z.row) <= 2) { ally.hp = Math.min(ally.maxHp, ally.hp + 26); this.effect(ally.x, ally.row, 'heal'); }
        z.ability = 4;
      }
      if (z.kind === 'dancer' && z.ability <= 0 && z.summons < 2) {
        for (const row of [z.row - 1, z.row + 1]) if (row >= 0 && row < ROWS && this.zombies.length < 80) {
          const ally = this.spawn({at:this.elapsed,row,kind:'walker',wave:this.wave}); ally.x = Math.min(9.6, z.x + .65); this.effect(ally.x, row, 'leaf');
        }
        z.summons++; z.ability = 10;
      }
      if(z.kind==='drummer'&&z.ability<=0){for(const ally of this.zombies)if(ally.id!==z.id&&ally.hp>0&&ally.freeze<=0&&Math.hypot(ally.row-z.row,ally.x-z.x)<2)ally.haste=3;z.ability=6;this.effect(z.x,z.row,'vault');}
      const info = ZOMBIES[z.kind];
      const rage = z.kind === 'paper' && z.hp < z.maxHp * .5 ? 1.9 : 1;
      let blocking: Plant | undefined = this.plants.filter(p => p.hp > 0 && p.row === z.row && p.col + .5 <= z.x + .15 && z.x - (p.col + .5) < .58 && p.kind !== 'cherry').sort((a, b) => b.col - a.col)[0];
      if (blocking && z.kind === 'vaulter' && !z.vaulted) {
        z.vaulted = true;
        if (blocking.kind !== 'wallnut') { z.x = blocking.col - .15; this.effect(z.x, z.row, 'vault'); blocking = undefined; }
      }
      if(z.kind==='balloon'&&!z.vaulted)blocking=undefined;
      z.eating = !!blocking;
      if (blocking) { blocking.hp -= info.bite * dt * rage * (z.slow > 0 ? .5 : 1); blocking.flash = .08; }
      else z.x -= info.speed * dt * this.config.speed * rage * ((z.haste??0)>0?1.35:1) * (z.kind === 'vaulter' && z.vaulted ? .6 : 1) * (z.slow > 0 ? .5 : 1);
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
    for(const z of dead)if(z.kind==='bomber'){for(const p of this.plants)if(Math.abs(p.row-z.row)<=1&&Math.abs(p.col+.5-z.x)<1.2)p.hp-=100;this.effect(z.x,z.row,'boom');}
    this.kills += dead.length;
    for (const z of dead) this.effect(z.x, z.row, z.freeze > 0 ? 'shatter' : 'leaf');
    this.zombies = this.zombies.filter(z => z.hp > 0);
    this.plants = this.plants.filter(p => p.hp > 0);
    for (const fx of this.effects) fx.life -= dt;
    this.effects = this.effects.filter(fx => fx.life > 0);
    if (this.state === 'playing' && this.config.endless && this.scheduledWave > this.clearedWaves && this.spawnQueue.length === 0 && this.zombies.length === 0) {
      this.clearedWaves = this.scheduledWave; this.intermission = true; this.nextWaveAt = this.elapsed + 8;
      const reward = Math.min(250, 100 + this.clearedWaves * 10);
      this.sun = Math.min(9999, this.sun + reward);
      for (const plant of this.plants) plant.hp = Math.min(plant.maxHp, plant.hp + plant.maxHp * .15);
      this.effect(4.5, 2, 'sun', reward); this.sound('sun');
    }
    if (this.state === 'playing' && !this.config.endless && this.scheduledWave === this.config.waves && this.spawnQueue.length === 0 && this.zombies.length === 0) { this.state = 'won'; this.sound('win'); }
  }
  get waveNotice(): string {
    const next = this.config.endless ? (this.intermission ? this.clearedWaves + 1 : this.wave || 1) : Math.min(this.config.waves, this.wave + 1);
    const theme = this.config.endless ? ENDLESS_EVENTS[(next - 1) % 5] : this.config.focus?.length ? ZOMBIES[this.config.focus[(next - 1) % this.config.focus.length]].name : '逐行来袭';
    if (this.intermission) return `已守住 ${this.clearedWaves} 波 · 休整 ${Math.max(0, Math.ceil(this.nextWaveAt - this.elapsed))}s · ${theme}`;
    return `${this.config.endless ? '全植物开放' : this.config.pattern === 'flanks' ? '注意上下两路' : this.config.pattern === 'center' ? '注意中间三路' : '下一波预告'} · ${theme}${this.config.plantLimit ? ` · ${this.plants.length}/${this.config.plantLimit} 株` : ''}`;
  }
  get score(): number { return this.kills * 100 + Math.floor(this.sun / 5) + (this.state === 'won' ? this.stars * 500 : 0); }
  get stars(): number { const left = this.mowers.filter(m => m.state === 'ready').length; return this.state !== 'won' ? 0 : !this.config.mowers ? 3 : left === 5 ? 3 : left >= 3 ? 2 : 1; }
  get progress(): number { return this.config.endless ? this.intermission ? Math.max(0, 1 - (this.nextWaveAt - this.elapsed) / 8) : Math.min(1, this.zombies.length / 42) : Math.min(1, this.elapsed / (12 + (this.config.waves - 1) * this.config.waveGap + this.config.waveGap * .64)); }
  get waveText(): string { return this.wave === 0 ? '准备种植' : this.config.endless ? `第 ${this.wave} 波` : `第 ${this.wave} / ${this.config.waves} 波`; }
}
