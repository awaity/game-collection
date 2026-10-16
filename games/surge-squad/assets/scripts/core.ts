/** Typed port of Surge Squad 1.2.0. Rendering and storage are separate. */
export interface Slot { x:number; z:number }
export interface Pose extends Slot { y:number; scale:number; yaw:number; roll:number }
export interface Socket extends Slot { y:number; d:number; slope:number }
export interface Player { x:number; targetX:number; troops:number; energy:number; boost:number; invincible:number; laser:boolean; charging:boolean; shotClock:number; damageBudget:number }
export interface Stats { kills:number; cells:number; recruits:number; bosses:number; score:number; lost:number; shots:number; laserSeconds:number }
export interface Enemy { id:number; x:number; d:number; hp:number; maxHp:number; phase:number; size:number; deadAt:number; variant:number }
export interface Gate { id:string; x:number; d:number; value:number; width:number; reward?:string; hp:number; maxHp:number; state:string; flash:number; openedAt:number }
export interface Warning { x:number; remaining:number; total:number; width:number }
export interface Boss { id:string; x:number; d:number; hp:number; maxHp:number; type:string; deadAt:number; hitFlash:number; attackTimer:number; warning:Warning|null; slamAt:number; phase:string; size:number }
export interface Cell { d:number; x:number; kind:string; taken:boolean }
export type Target = { kind:'gate'; item:Gate } | { kind:'boss'; item:Boss } | { kind:'enemy'; item:Enemy };
export type RayHit = Target & { d:number; x:number; y:number };
export interface Bullet { id:number; x:number; d:number; y:number; originD:number; originY:number; originX:number; slope:number; ySlope:number; born:number; damage:number; speed:number }
export interface Beam { index:number; origin:Socket; d:number; x:number; y:number; distance:number; hit:boolean; kind:string; targetId:string|number|null }
export interface EventData { x?:number; d?:number; y?:number; lost?:number; size?:number; value?:number; bossType?:string; count?:number; kind?:string; gold?:boolean; full?:boolean; hp?:number; arcs?:{x:number;d:number;y:number}[] }
export interface SurgeEvent extends EventData { type:string; time:number }
export interface Level { chapter:typeof CHAPTERS[number]; enemies:Enemy[]; gates:Gate[]; cells:Cell[]; bosses:Boss[]; seed:number; index:number }
/** All distances are in world metres. Gameplay never depends on render quality. */
export const CONFIG = Object.freeze({
  step: 1 / 60, speed: 3.35, roadWidth: 10.8, playerLimit: 4.35,
  playerZ: 6, depthScale: 0.55, viewDistance: 160, attackRange: 48,
  energyMax: 12, laserDrain: 3.9, cellSpacing: 0.80,
  maxTroops: 150, maxVisibleTroops: 20, maxBullets: 180,
  maxParticles: 700, maxCrowdVisible: 3600,
  lanes: Object.freeze({ assault: -3.12, charge: 0, recruit: 3.18 }),
});
export const CHAPTERS = Object.freeze([
  { name: '破晓海堤', english: 'BREAKWATER', length: 165, speed: 3.35, density: 13, enemyHp: 1,
    bossHp: [599, 1699], bossDistance: [70, 143], gateHp: [26, 130, 440], tint: 0 },
  { name: '赤潮防线', english: 'RED TIDE', length: 185, speed: 3.55, density: 14, enemyHp: 1.15,
    bossHp: [899, 2499], bossDistance: [76, 164], gateHp: [30, 160, 500], tint: 1 },
  { name: '最后电站', english: 'LAST CURRENT', length: 205, speed: 3.75, density: 15, enemyHp: 1.3,
    bossHp: [1299, 3499], bossDistance: [83, 185], gateHp: [34, 190, 580], tint: 2 },
]);
export function clamp(value:number, min:number, max:number) { return Math.max(min, Math.min(max, value)); }
export function visibleTroops(count:number) { return Math.min(CONFIG.maxVisibleTroops, Math.max(0, count)); }
export function formation(count:number) {
  const n = visibleTroops(count);
  if (n === 1) return [{ x: 0, z: 0 }];
  if (n === 2) return [{ x: -0.44, z: 0 }, { x: 0.44, z: 0 }];
  if (n <= 4) return Array.from({ length: n }, (_, i) => ({ x: (i - (n - 1) / 2) * 0.84, z: 0 }));
  const columns = n < 10 ? 4 : n < 16 ? 5 : 6;
  const rows = Math.ceil(n / columns); const result = [];
  let remaining = n;
  for (let row = 0; row < rows; row++) {
    const inRow = row === 0 ? n - (rows - 1) * columns : columns;
    for (let col = 0; col < inRow; col++) result.push({
      x: (col - (inRow - 1) / 2) * (n < 10 ? 0.86 : 0.65), z: row * 0.76 - (rows - 1) * 0.38,
    });
    remaining -= inRow;
  }
  return result;
}

export function squadLimit(count:number) {
  const f=formation(count);const extent=Math.max(0,...f.map(s=>Math.abs(s.x)));
  return Math.min(CONFIG.playerLimit,CONFIG.roadWidth/2-.62-extent);
}

/** A serializable xorshift32 RNG. Rendering uses a different stream. */
export class Random {
  state:number;
  constructor(seed = 0x51A7E) { this.state = (seed >>> 0) || 1; }
  next() { let x = this.state; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.state = x >>> 0; return this.state / 4294967296; }
  range(a:number, b:number) { return a + (b - a) * this.next(); }
}


/** Model-space socket contract. Shared by simulation, actor meshes and every effect.
 * The weapon is authored at (.255, .489, -.622); +Y up, forward -Z.
 * This module deliberately has no Three.js or browser dependency. */
export const PLAYER_SCALE = 1.24;
export const GUN_SOCKET = Object.freeze({ x: .255, y: .489, z: -.622 });
export function playerPose(player:Player, slot:Slot, index:number, time:number, moving = true) {
  const bob = moving ? Math.sin(time * 12 + index * 2) * .025 : Math.sin(time * 2 + index) * .008;
  const lean = clamp((player.targetX - player.x) * .10, -.10, .10);
  return { x: player.x + slot.x, y: .04 + bob, z: CONFIG.playerZ + slot.z,
    scale: PLAYER_SCALE, yaw: -lean * .6, roll: -lean };
}
export function transformSocket(pose:Pose, socket = GUN_SOCKET) {
  const c = Math.cos(pose.roll), s = Math.sin(pose.roll);
  const x = (socket.x * c - socket.y * s) * pose.scale;
  const y = (socket.x * s + socket.y * c) * pose.scale;
  const z = socket.z * pose.scale;
  const cy = Math.cos(pose.yaw), sy = Math.sin(pose.yaw);
  return { x: pose.x + x * cy + z * sy, y: pose.y + y, z: pose.z - x * sy + z * cy };
}
export function weaponSocket(player:Player, slot:Slot, index:number, time:number, distance:number) {
  const pose = playerPose(player, slot, index, time);
  const origin = transformSocket(pose);
  return { ...origin, d: distance + (CONFIG.playerZ - origin.z) / CONFIG.depthScale,
    slope: Math.tan(-pose.yaw) * CONFIG.depthScale };
}
export function rayX(socket:Socket, distance:number) { return socket.x + socket.slope * (distance - socket.d); }
export function targetHeight(kind:string, item:Gate|Boss|Enemy) {
  if (kind === 'boss') return .88 * (item as Boss).size;
  if (kind === 'gate') return (item as Gate).value === 1 ? .54 : 1.16;
  return .38 * ((item as Enemy).size || 1);
}

export function makeLevel(index = 0, seed = 17429):Level {
  const chapter = CHAPTERS[index];
  if (!chapter) throw new RangeError('Unknown chapter');
  const rng = new Random(seed + index * 9781); const enemies:Enemy[] = [];
  let id = 1;
  for (let d = 18; d < chapter.length + 28; d += 0.48) {
    for (let col = 0; col < chapter.density; col++) {
      const x = -4.70 + col * (3.06 / (chapter.density - 1)) + rng.range(-0.075, 0.075);
      const at = d + rng.range(-0.12, 0.12);
      // Small clearings around the two larger silhouettes keep the bosses legible.
      if (chapter.bossDistance.some(b => Math.abs(at - b) < 1.6 && Math.abs(x + 3.1) < 0.9)) continue;
      enemies.push({ id: id++, x, d: at, hp: chapter.enemyHp, maxHp: chapter.enemyHp,
        phase: rng.next() * Math.PI * 2, size: rng.range(0.93, 1.10), deadAt: -1, variant: Math.floor(rng.next() * 3) });
    }
  }
  enemies.sort((a, b) => a.d - b.d);
  const gates:Gate[] = [
    { id: 'gate-1', x: 0, d: 11, value: 1, width: 1.48 },
    { id: 'gate-5', x: 3.18, d: 11, value: 5, width: 3.18 },
    { id: 'gate-99', x: 3.18, d: 18, value: 99, width: 3.18, reward:'energy' },
  ].map((g, i) => ({ ...g, hp: chapter.gateHp[i], maxHp: chapter.gateHp[i], state: 'sealed', flash: 0, openedAt: -1 }));
  const cells:Cell[] = [];
  for (let d = 11.8; d < chapter.length + 300; d += CONFIG.cellSpacing) cells.push({ d, x: 0, kind: 'blue', taken: false });
  for (let d = 23; d < chapter.length + 300; d += 4.2) cells.push({ d, x: 3.18, kind: 'gold', taken: false });
  cells.sort((a, b) => a.d - b.d);
  const bosses:Boss[] = chapter.bossDistance.map((d, i) => ({ id: `boss-${i}`, x: -3.13, d,
    hp: chapter.bossHp[i], maxHp: chapter.bossHp[i], type: i === 0 ? 'brute' : 'titan',
    deadAt: -1, hitFlash: 0, attackTimer: i===0?4.8:2.4, warning: null, slamAt: -100, phase: 'march',
    size: i === 0 ? 1.32 : 1.80 }));
  return { chapter, enemies, gates, cells, bosses, seed, index };
}

/** The reference shows the recruit and gold gates together while charging.
 * These right-lane gates wait on a staged conveyor; a broken token advances
 * toward the player. This is a chosen playable rule, not inferred source code. */
export function updateRails(game:Game, dt:number, advance:number) {
  const [first,recruit,gold]=game.level.gates;
  for(const gate of [recruit,gold]) {
    if(gate.state==='sealed') {
      gate.d+=advance;
      const target=gate===recruit?11:(recruit.state==='taken'||recruit.state==='missed'?11:18);
      const gap=gate.d-game.distance;
      gate.d+=clamp(target-gap,-dt*5,dt*5);
    } else if(gate.state==='open')gate.d-=dt*3.6;
  }
  // The cell conveyor remains behind its locked access gate. Once opened it scrolls normally.
  if(gold.state==='sealed'){
    const desired=gold.d+5;
    const cells=game.level.cells.filter(c=>c.kind==='gold'&&!c.taken);
    if(cells.length){const delta=desired-cells[0].d;for(const cell of cells)cell.d+=delta;}
  }
  game.level.cells.sort((a,b)=>a.d-b.d);
  // Sorting a moving conveyor invalidates the previous sorted-window cursor.
  game.cellStart=0;
}


/** Nearest forward intersection in the sorted simulation corridor.
 * A sealed crate, a living giant, and a living raider all block the ray.
 * Plasma splash affects only the first contacted row, never eight metres behind it. */
export function traceRay(game:Game, socket:Socket, radius = .19, range = CONFIG.attackRange, enemyRadius = radius):RayHit|null {
  const end = game.distance + range;
  let nearest:RayHit|null = null;
  const test = (kind:Target['kind'], item:Gate|Boss|Enemy, width:number) => {
    if (item.d < socket.d - .1 || item.d > end || (nearest && item.d >= nearest.d)) return;
    const x = rayX(socket, item.d);
    if (Math.abs(item.x - x) <= width + radius) nearest = { kind, item, d: item.d, x, y: targetHeight(kind, item) } as RayHit;
  };
  for (const g of game.level.gates) if (g.state === 'sealed') test('gate', g, g.width / 2);
  for (const b of game.level.bosses) if (b.hp > 0) test('boss', b, b.size * .67);
  for (let i = game.enemyStart; i < game.level.enemies.length; i++) {
    const e = game.level.enemies[i];
    if (e.d > end || (nearest && e.d > (nearest as RayHit).d)) break;
    if (e.hp > 0) test('enemy', e, .14 * (e.size || 1) + enemyRadius - radius);
  }
  return nearest;
}

export function updatePlasma(game:Game, dt:number) {
  const p = game.player, slots = formation(p.troops), units = Math.min(24, p.troops);
  const boost = p.boost > 0 ? 1.45 : 1;
  p.damageBudget = Math.min(p.damageBudget + (72 + units * 82) * dt * boost, 120);
  game.beams = [];
  for (let index = 0; index < slots.length; index++) {
    const origin = weaponSocket(p, slots[index], index, game.time, game.distance);
    // Plasma has a visible conductive fan around its narrow luminous core.
    // Enemy-only acquisition prevents stray edge islands; solid barriers still
    // use the actual narrow beam and stop propagation before the next row.
    const hit = traceRay(game, origin, .24, CONFIG.attackRange, 1.60);
    const endD = hit ? hit.d : game.distance + 43;
    const beam = { index, origin, d: endD, x: rayX(origin, endD), y: hit ? hit.y : origin.y,
      distance: endD - game.distance, hit: !!hit, kind: hit?.kind || 'empty', targetId: hit?.item.id ?? null };
    game.beams.push(beam);
    if (!hit) continue;
    if (hit.kind === 'gate') {
      game.hitGate(hit.item, (28 + units * 15) * dt * boost * 2.25 / slots.length);
    } else if (hit.kind === 'boss') {
      game.hitBoss(hit.item, (84 + units * 40) * dt * boost / slots.length);
    } else {
      const arcs = [];
      // A visible impact fan connects the contacted row. Damage never tunnels
      // through a living blocker; penetrating into the next row needs a new tick.
      for (let i = game.enemyStart; i < game.level.enemies.length; i++) {
        const e = game.level.enemies[i];
        if (e.d > hit.d + .54) break;
        if (e.hp <= 0 || e.d < hit.d - .54 || Math.abs(e.x - hit.x) > 2.35) continue;
        if (p.damageBudget <= 0) break;
        const damage = Math.min(e.hp, p.damageBudget);
        p.damageBudget -= damage; e.hp -= damage;
        if (e.hp <= 0) { e.hp = .001; game.killEnemy(e); }
        if (arcs.length < 6) arcs.push({ x: e.x, d: e.d, y: .38 * (e.size || 1) });
      }
      if (arcs.length && game.time - (game.lastArcAt || -1) > .075) {
        game.emit('plasma-impact', { x: hit.x, d: hit.d, y: hit.y, arcs });
        game.lastArcAt = game.time;
      }
    }
  }
  const first = game.beams.reduce<Beam|null>((a, b) => b.hit && (!a || b.distance < a.distance) ? b : a, null);
  game.beam = { distance: first?.distance ?? 43, hit: !!first, kind: first?.kind || 'empty' };
}


/** Pure simulation: no DOM, no Three.js, no wall-clock timers. */
export class Game {
  level:Level; phase:'ready'|'playing'|'paused'|'victory'|'defeat'; time:number; distance:number;
  player:Player;stats:Stats;bullets:Bullet[];events:SurgeEvent[];warnings:Warning[];
  beam:{distance:number;hit:boolean;kind:string};beams:Beam[];lastArcAt:number;
  enemyStart:number;cellStart:number;nextBulletId:number;combo:number;comboTimer:number;
  finalArena:boolean;arenaClock:number;demo:boolean;nextAutoAction:string;

  constructor(index = 0, seed = 17429) {
    this.level = makeLevel(index, seed); this.phase = 'ready'; this.time = 0; this.distance = 0;
    this.player = { x: 0, targetX: 0, troops: 1, energy: 0, boost: 0, invincible: 0,
      laser: false, charging: false, shotClock: 0, damageBudget: 0 };
    this.stats = { kills: 0, cells: 0, recruits: 0, bosses: 0, score: 0, lost: 0, shots: 0, laserSeconds: 0 };
    this.bullets = []; this.events = []; this.warnings = []; this.beam = { distance: 34, hit: false, kind: 'empty' };
    this.beams = []; this.lastArcAt = -1;
    this.enemyStart = 0; this.cellStart = 0; this.nextBulletId = 1; this.combo = 0; this.comboTimer = 0;
    this.finalArena = false; this.arenaClock = 0; this.demo = false; this.nextAutoAction = 'charge';
  }
  start() { if (this.phase === 'ready') { this.phase = 'playing'; this.emit('start'); } }
  pause() { if (this.phase === 'playing') { this.phase = 'paused'; this.emit('pause'); } }
  resume() { if (this.phase === 'paused') { this.phase = 'playing'; this.emit('resume'); } }
  aim(x:number) { if (Number.isFinite(x)) this.player.targetX = clamp(x, -squadLimit(this.player.troops), squadLimit(this.player.troops)); }
  emit(type:string, data:EventData = {}) { if (this.events.length < 280) this.events.push({ ...data, type, time: this.time }); }
  drainEvents() { return this.events.splice(0); }
  get width() { return 0.58 + Math.min(visibleTroops(this.player.troops), 14) * 0.055; }
  get activeBoss() { return this.level.bosses.find(b => b.hp > 0 && b.d - this.distance < 54); }
  get progress() { return clamp(this.distance / this.level.chapter.length, 0, 1); }
  damagePlayer(amount:number, x = this.player.x) {
    if (this.phase !== 'playing' || this.player.invincible > 0 || !Number.isFinite(amount) || amount <= 0) return;
    amount=Math.ceil(amount);
    const lost = Math.min(this.player.troops, amount);
    this.player.troops -= lost; this.stats.lost += lost; this.player.invincible = 1.4;
    this.player.energy = Math.max(0, this.player.energy - 3); this.combo = 0;
    this.emit('hurt', { x, lost });
    if (this.player.troops <= 0) { this.phase = 'defeat'; this.player.laser = false; this.emit('defeat'); }
  }
  killEnemy(enemy:Enemy) {
    if (enemy.hp <= 0) return;
    enemy.hp = 0; enemy.deadAt = this.time;
    this.stats.kills++; this.combo++; this.comboTimer = 2;
    this.stats.score += 10 + Math.min(20, Math.floor(this.combo / 20));
    // Bound particle/audio traffic without hiding any gameplay kills.
    if (this.stats.kills % 3 === 0) this.emit('enemy-down', { x: enemy.x, d: enemy.d, size: enemy.size });
    if (this.combo > 0 && this.combo % 100 === 0) this.emit('combo', { value: this.combo });
  }
  hitGate(gate:Gate, damage:number) {
    if (gate.state !== 'sealed' || !Number.isFinite(damage) || damage <= 0) return;
    if(gate.value===99&&this.level.bosses[0].hp>0)return;
    gate.hp = Math.max(0, gate.hp - damage); gate.flash = 0.09;
    if (gate.hp === 0) {
      gate.state = 'open'; gate.openedAt = this.time;
      this.emit('gate-break', { x: gate.x, d: gate.d, value: gate.value });
    }
  }
  hitBoss(boss:Boss, damage:number) {
    if (boss.hp <= 0 || !Number.isFinite(damage) || damage <= 0) return;
    boss.hp = Math.max(0, boss.hp - damage); boss.hitFlash = 0.055;
    if (boss.hp === 0) {
      boss.deadAt = this.time; boss.phase = 'dead'; boss.warning = null;
      this.stats.bosses++; this.stats.score += boss.type === 'titan' ? 6000 : 2500;
      this.emit('boss-down', { x: boss.x, d: boss.d, bossType: boss.type });
      for (let i = this.enemyStart; i < this.level.enemies.length; i++) {
        const e = this.level.enemies[i];
        if (e.d > boss.d + 5) break;
        if (e.hp > 0 && Math.abs(e.d - boss.d) < 5) this.killEnemy(e);
      }
    }
  }
  /** Query only the visible, sorted segment of the horde. */
  targets(x:number, spread:number, range:number) {
    const result:(Target & {d:number})[] = []; const base = this.distance;
    for (const g of this.level.gates) if (g.state === 'sealed' && g.d > base - 0.5 && g.d < base + range && Math.abs(g.x - x) < g.width / 2 + spread) result.push({ kind: 'gate', item: g, d: g.d });
    for (const b of this.level.bosses) if (b.hp > 0 && b.d > base - 1 && b.d < base + range && Math.abs(b.x - x) < b.size * 0.67 + spread) result.push({ kind: 'boss', item: b, d: b.d });
    for (let i = this.enemyStart; i < this.level.enemies.length; i++) {
      const e = this.level.enemies[i]; if (e.d > base + range) break;
      if (e.hp > 0 && e.d > base - 0.2 && Math.abs(e.x - x) < spread + 0.13) result.push({ kind: 'enemy', item: e, d: e.d });
    }
    result.sort((a, b) => a.d - b.d); return result;
  }
  updateLaser(dt:number) { updatePlasma(this, dt); }
  fireBullets(dt:number) {
    const p = this.player; p.shotClock -= dt;
    if (p.shotClock > 0) return;
    p.shotClock += 0.165;
    const slots = formation(Math.min(p.troops, 14));
    for (let index = 0; index < slots.length; index++) {
      if (this.bullets.length >= CONFIG.maxBullets) break;
      const socket = weaponSocket(p, slots[index], index, this.time, this.distance);
      const target = traceRay(this, socket, .05);
      const ySlope = target ? (target.y - socket.y) / Math.max(1, target.d - socket.d) : 0;
      this.bullets.push({ id: this.nextBulletId++, x: socket.x, d: socket.d, y: socket.y,
        originD: socket.d, originY: socket.y, originX: socket.x, slope: socket.slope, ySlope,
        born: this.time, damage: p.boost > 0 ? 8 : 5.2, speed: 83 });
      this.stats.shots++;
    }
    this.emit('shot', { count: slots.length });
  }
  updateBullets(dt:number) {
    const base = this.distance;
    this.bullets = this.bullets.filter(bullet => {
      const old = bullet.d; bullet.d += bullet.speed * dt;
      bullet.x += (bullet.slope || 0) * bullet.speed * dt;
      bullet.y = (bullet.originY ?? .5) + (bullet.ySlope || 0) * (bullet.d - (bullet.originD ?? old));
      if (bullet.d > base + 58 || this.time - bullet.born > 1.2) return false;
      let hit:Target|null = null;
      const consider = (kind:Target['kind'], item:Gate|Boss|Enemy, halfWidth:number) => {
        if (item.d >= old - 0.1 && item.d <= bullet.d + 0.1 && Math.abs(item.x - (bullet.x - (bullet.slope || 0) * (bullet.d - item.d))) < halfWidth && (!hit || item.d < hit.item.d)) hit = { kind, item } as Target;
      };
      for (const g of this.level.gates) if (g.state === 'sealed') consider('gate', g, g.width / 2);
      for (const b of this.level.bosses) if (b.hp > 0) consider('boss', b, b.size * 0.70);
      for (let i = this.enemyStart; i < this.level.enemies.length; i++) {
        const e = this.level.enemies[i]; if (e.d > bullet.d + 0.1) break;
        if (e.hp > 0) consider('enemy', e, 0.19);
      }
      const collision=hit as Target|null;
      if (!collision) return true;
      if (collision.kind === 'gate') this.hitGate(collision.item, bullet.damage);
      else if (collision.kind === 'boss') this.hitBoss(collision.item, bullet.damage);
      else { collision.item.hp -= bullet.damage; if (collision.item.hp <= 0) { collision.item.hp = 0.001; this.killEnemy(collision.item); } }
      this.emit('impact', { x: bullet.x, d: collision.item.d, kind: collision.kind }); return false;
    });
  }
  updatePickups(dt:number) {
    const p = this.player; p.charging = false;
    const cells = this.level.cells;
    while (this.cellStart < cells.length && cells[this.cellStart].d < this.distance - 1.5) this.cellStart++;
    for (let i = this.cellStart; i < cells.length; i++) {
      const cell = cells[i]; if (cell.d > this.distance + 0.65) break;
      if (cell.taken || Math.abs(cell.x - p.x) > (cell.kind === 'blue' ? 0.78 : 1.1)) continue;
      if (cell.kind === 'gold' && this.level.gates[2].state === 'sealed') continue;
      cell.taken = true; this.stats.cells++; this.stats.score += cell.kind === 'blue' ? 3 : 50;
      p.energy = Math.min(CONFIG.energyMax, p.energy + (cell.kind === 'gold' ? 99 : 1));
      if (cell.kind === 'gold') p.boost = 8;
      p.charging = true;
      this.emit('cell', { x: cell.x, d: cell.d, gold: cell.kind === 'gold', full: p.energy === CONFIG.energyMax });
    }
    if (Math.abs(p.x) < 0.8 && this.distance >= 14 && this.distance < this.level.chapter.length + 28) p.charging = true;
    for (const gate of this.level.gates) {
      gate.flash = Math.max(0, gate.flash - dt);
      if (gate.state === 'taken' || gate.state === 'missed' || gate.d > this.distance + 0.70) continue;
      if (Math.abs(gate.x - p.x) < gate.width / 2 + 0.14 && Math.abs(gate.d - this.distance) < 0.8) {
        if (gate.state === 'open') {
          gate.state = 'taken';
          if(gate.reward==='energy'){
            p.energy=CONFIG.energyMax;p.boost=8;this.stats.score+=990;
            this.emit('overcharge',{x:gate.x,value:99});continue;
          }
          const gain = Math.min(CONFIG.maxTroops - p.troops, gate.value);
          p.troops += gain; p.x=clamp(p.x,-squadLimit(p.troops),squadLimit(p.troops));p.targetX=clamp(p.targetX,-squadLimit(p.troops),squadLimit(p.troops));this.stats.recruits += gain; this.stats.score += gain * 20;
          this.emit('recruit', { x: gate.x, value: gain });
        } else if (gate.state === 'sealed') {
          gate.state = 'missed'; this.damagePlayer(gate.value === 1 ? 1 : Math.max(1, Math.ceil(p.troops * 0.25)), gate.x);
        }
      }
      if (gate.d < this.distance - 1.2 && !['taken', 'missed'].includes(gate.state)) { gate.state = 'missed'; this.emit('missed-gate', { value: gate.value }); }
    }
  }
  updateBosses(dt:number) {
    const p = this.player;
    for (const boss of this.level.bosses) {
      boss.hitFlash = Math.max(0, boss.hitFlash - dt);
      if (boss.hp <= 0) continue;
      if(boss.type==='brute'&&boss.d-this.distance<12)boss.d=this.distance+12;
      const gap = boss.d - this.distance;
      if (gap < 27 && boss.type === 'titan' && !this.finalArena) {
        this.finalArena = true; boss.phase = 'arena'; this.emit('arena', { hp: boss.hp });
      }
      if (boss.phase === 'arena') {
        // The titan steps into a readable fighting distance rather than freezing above the screen.
        boss.d+=clamp(this.distance+16-boss.d,-dt*6,dt*6);
        boss.x += (-3.13-boss.x)*Math.min(1,dt*1.5);
      }
      if (gap < 30) {
        boss.attackTimer -= dt;
        if (boss.attackTimer <= 0 && !boss.warning) {
          boss.warning = { x: clamp(p.x, -3.7, 3.7), remaining: 1.65, total: 1.65, width: boss.type === 'titan' ? 1.7 : 1.4 };
          this.emit('warning', { x: boss.warning.x, bossType: boss.type });
        }
        if (boss.warning) {
          boss.warning.remaining -= dt;
          if (boss.warning.remaining <= 0) {
            boss.slamAt = this.time;
            this.emit('slam', { x: boss.warning.x, d: this.distance });
            if (Math.abs(p.x - boss.warning.x) < boss.warning.width / 2 + this.width * 0.35) this.damagePlayer(boss.type==='titan'?p.troops:Math.max(1,Math.ceil(p.troops*.16)),p.x);
            boss.warning = null; boss.attackTimer = boss.type === 'titan' ? 3.8 : 4.8;
          }
        }
      }
      if (gap < 1.3 && Math.abs(p.x - boss.x) < boss.size * 0.75 + this.width) this.damagePlayer(Math.max(1, Math.ceil(p.troops * 0.35)));
    }
    if (this.finalArena) {
      this.arenaClock += dt;
      // At a locked arena, the centre lane acts as a live charge station.
      if (Math.abs(p.x) < 0.75) { p.energy = Math.min(CONFIG.energyMax, p.energy + dt * 6.8); p.charging = true; }
      if (this.arenaClock > 80) { this.damagePlayer(Math.max(1, p.troops)); }
    }
  }
  autoPilot() {
    const p = this.player; const titan = this.level.bosses[1];
    const closePickup=this.level.gates.find(g=>g.state==='open'&&g.d-this.distance<4.5&&g.d-this.distance>-.65);
    if(closePickup){this.aim(closePickup.x);return;}
    const imminent = this.level.bosses.find(b => b.warning && b.warning.remaining < 1.25);
    if (imminent) { this.aim(Math.abs(imminent.warning!.x) > 1.5 ? 0 : 3.18); return; }
    if (this.finalArena && titan.hp > 0) {
      if (p.energy < CONFIG.energyMax * .19) this.nextAutoAction = 'charge';
      if (p.energy > CONFIG.energyMax * .90) this.nextAutoAction = 'attack';
      this.aim(this.nextAutoAction === 'charge' ? 0 : (titan.x < 0 ? -3.12 : 3.12)); return;
    }
    const [a,b,c]=this.level.gates;
    if(this.time<6.1){this.aim(0);return;}
    const gate=(this.time>12.8&&!['taken','missed'].includes(b.state))?b:
      ((this.time>28&&!['taken','missed'].includes(c.state))?c:null);
    if(gate){
      // Refill when depleted rather than holding an empty weapon against a high-HP barrier.
      if(gate.state==='sealed'&&p.energy<.5&&gate.hp>70)this.nextAutoAction='charge';
      if(p.energy>CONFIG.energyMax*.9||gate.state==='open'||gate.hp<70)this.nextAutoAction='attack';
      this.aim(this.nextAutoAction==='charge'?0:gate.x);return;
    }
    if(p.energy<CONFIG.energyMax*.19)this.nextAutoAction='charge';
    if(p.energy>CONFIG.energyMax*.93)this.nextAutoAction='attack';
    this.aim(this.nextAutoAction==='charge'?0:-3.12);
  }

  step(dt = CONFIG.step) {
    if (this.phase !== 'playing') return;
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, 0.05); this.time += dt;
    if (this.demo) this.autoPilot();
    const p = this.player; const previousLaser = p.laser;
    p.targetX=clamp(p.targetX,-squadLimit(p.troops),squadLimit(p.troops));
    p.x += clamp(p.targetX - p.x, -10 * dt, 10 * dt);
    p.invincible = Math.max(0, p.invincible - dt); p.boost = Math.max(0, p.boost - dt);
    this.comboTimer -= dt; if (this.comboTimer <= 0) this.combo = 0;
    const aliveTitan = this.level.bosses[1].hp > 0;
    const stop = this.finalArena && aliveTitan;
    const advance=stop?0:this.level.chapter.speed*dt;
    this.distance+=advance;updateRails(this,dt,advance);
    // A slower relative assault conveyor preserves the readable opening gap.
    // All d positions (including corpses) move equally, preserving sorted order.
    if(advance>0)for(const enemy of this.level.enemies)enemy.d+=advance*.64;
    this.updatePickups(dt);
    if(this.phase!=='playing')return;
    this.updateBosses(dt);
    if(this.phase!=='playing')return;
    p.laser = Math.abs(p.x) > 0.95 && p.energy > 0.05;
    if (p.laser) {
      p.energy = Math.max(0, p.energy - CONFIG.laserDrain * dt); this.stats.laserSeconds += dt;
      this.updateLaser(dt);
    } else { p.damageBudget = 0; this.beams = []; this.fireBullets(dt); this.beam.hit = false; }
    if (p.energy < .05) p.energy = 0;
    if (p.laser && !previousLaser) this.emit('laser-on');
    if (!p.laser && previousLaser) this.emit('laser-off');
    this.updateBullets(dt);
    const enemies = this.level.enemies;
    while (this.enemyStart < enemies.length && enemies[this.enemyStart].d < this.distance - 2) this.enemyStart++;
    for (let i = this.enemyStart; i < enemies.length; i++) {
      const e = enemies[i]; if (e.d > this.distance + 0.65) break;
      if (e.hp > 0 && Math.abs(e.x - p.x) < this.width) {
        this.killEnemy(e);
        if(!p.laser){
          if(p.energy>1)p.energy=Math.max(0,p.energy-.055);
          else this.damagePlayer(Math.max(1,Math.ceil(p.troops*.08)),p.x);
        }
        if(this.phase!=='playing')break;
      }
    }
    if (this.phase === 'playing' && this.distance >= this.level.chapter.length && this.level.bosses.every(b=>b.hp<=0)) {
      this.phase = 'victory'; p.laser = false; this.stats.score += p.troops * 60; this.emit('victory');
    }
  }
  snapshot() {
    return { phase: this.phase, chapter: this.level.index, time: +this.time.toFixed(3), distance: +this.distance.toFixed(3),
      player: { ...this.player }, stats: { ...this.stats }, enemies: this.level.enemies.length,
      alive: this.level.enemies.filter(e => e.hp > 0).length, gates: this.level.gates.map(g => ({ state: g.state, hp: +g.hp.toFixed(2), value: g.value })),
      bosses: this.level.bosses.map(b => ({ hp: +b.hp.toFixed(2), maxHp: b.maxHp, phase: b.phase })), finalArena: this.finalArena,
      bullets: this.bullets.length, events: this.events.length, beam: { ...this.beam }, beamCount: this.beams.length };
  }
}

export interface Save {version:1;unlocked:number;best:number[];settings:{sound:boolean;music:boolean;quality:'low'|'medium'|'high';reducedMotion:boolean}}
export const defaultSave=():Save=>({version:1,unlocked:1,best:[0,0,0],settings:{sound:true,music:true,quality:'high',reducedMotion:false}});
export function normalizeSave(raw:unknown):Save{
 const save=defaultSave();if(!raw||typeof raw!=='object')return save;const value=raw as Partial<Save>;if(value.version!==1)return save;
 save.unlocked=Number.isInteger(value.unlocked)?clamp(value.unlocked!,1,3):1;
 save.best=save.best.map((_,i)=>Number.isFinite(value.best?.[i])?Math.max(0,Math.floor(value.best![i])):0);
 for(const key of ['sound','music','reducedMotion'] as const)if(typeof value.settings?.[key]==='boolean')save.settings[key]=value.settings[key];
 if(value.settings&&['low','medium','high'].includes(value.settings.quality))save.settings.quality=value.settings.quality;
 return save;
}
export function recordVictory(save:Save,chapter:number,score:number):Save{
 if(!Number.isInteger(chapter)||chapter<0||chapter>2||!Number.isFinite(score))return save;
 return {...save,unlocked:Math.max(save.unlocked,Math.min(3,chapter+2)),best:save.best.map((n,i)=>i===chapter?Math.max(n,Math.max(0,Math.floor(score))):n)};
}
