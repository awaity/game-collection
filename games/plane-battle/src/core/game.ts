/** Port of awaity/my-game-plane f9a6cac. Simulation coordinates and 60 Hz time
 * are independent of the display surface, platform APIs and rendering. */
export const WIDTH = 420,
  HEIGHT = 760,
  STEP = 1 / 60;
export type Difficulty = "easy" | "normal" | "hard";
export type Mode = "stage" | "endless";
export type Phase = "menu" | "playing" | "paused" | "cleared" | "lost";
export const MAPS = [
  {name:'晨曦云海',color:'#27556a',rule:'顺风航线 · 平衡敌群',wind:0,elite:.2,supply:900},
  {name:'雷暴走廊',color:'#59467e',rule:'横向气流 · 注意修正航向',wind:.45,elite:.3,supply:780},
  {name:'珊瑚海岸',color:'#246c6a',rule:'密集补给 · 高速低空战',wind:0,elite:.15,supply:480},
  {name:'赤曜熔谷',color:'#773b48',rule:'精英机群 · 更强守卫',wind:-.35,elite:.5,supply:720},
];
export const MISSIONS=MAPS.flatMap((map,m)=>['前哨','截击','守卫'].map((part,i)=>({name:map.name+' · '+part,description:map.rule,map:m,rank:i,color:map.color})));
export type Supply = "weapon" | "shield" | "health";
export const DIFFICULTIES = {
  easy: {
    label: "简单",
    lives: 5,
    spawn: 90,
    speed: 0.8,
    health: 0.8,
    score: 0.5,
  },
  normal: { label: "标准", lives: 3, spawn: 60, speed: 1, health: 1, score: 1 },
  hard: {
    label: "困难",
    lives: 2,
    spawn: 48,
    speed: 1.2,
    health: 1.2,
    score: 1.5,
  },
};
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
export function random(seed: number) {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}
interface Body {
  x: number;
  y: number;
  radius: number;
}
export interface Bullet extends Body {
  vx: number;
  vy: number;
  damage: number;
  alive: boolean;
  color: string;
}
export interface Enemy extends Body {
  kind: "normal" | "elite" | "boss";
  hp: number;
  maxHp: number;
  speed: number;
  score: number;
  cooldown: number;
  direction: number;
}
export interface PowerUp extends Body {
  kind: Supply;
  alive: boolean;
}
export interface Input {
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
}
export interface GameEvent {
  type: "shot" | "hit" | "kill" | "boss" | "clear" | "hurt" | "supply" | "lose";
  x: number;
  y: number;
}
export const overlaps = (a: Body, b: Body) =>
  Math.hypot(a.x - b.x, a.y - b.y) < a.radius + b.radius;
export class Game {
  phase: Phase = "menu";
  tick = 0;
  score = 0;
  kills = 0;
  stage = 1;
  stageKills = 0;
  killsNeeded = 20;
  player = {
    x: WIDTH / 2,
    y: HEIGHT - 90,
    radius: 20,
    lives: 3,
    maxLives: 5,
    weapon: 1,
    shield: false,
    cooldown: 0,
  };
  enemies: Enemy[] = [];
  bullets: Bullet[] = [];
  enemyBullets: Bullet[] = [];
  powerUps: PowerUp[] = [];
  boss: Enemy | null = null;
  mission = -1;
  damageScale = 1;
  intervalScale = 1;
  skinColor = '#00d4ff';
  skinMark = '';
  get map(){return MAPS[this.mode==='endless'?Math.floor((this.stage-1)/2)%MAPS.length:Math.max(0,MISSIONS[this.mission]?.map??0)];}
  configure(mission:number,buffs={damage:1,interval:1,guard:0},color='#00d4ff',mark=''){
    this.mission=clamp(Math.floor(mission),0,MISSIONS.length-1);this.stage=this.mission+1;
    this.killsNeeded=20+MISSIONS[this.mission].rank*6;
    this.spawnInterval=Math.max(36,DIFFICULTIES[this.difficulty].spawn-MISSIONS[this.mission].rank*6);
    this.damageScale=buffs.damage;this.intervalScale=buffs.interval;this.skinColor=color;this.skinMark=mark;
    this.player.lives+=buffs.guard;this.player.maxLives+=buffs.guard;
    if(this.mode==='endless')this.stage=1;
  }
  spawnTimer = 0;
  supplyTimer = 0;
  spawnInterval: number;
  private events: GameEvent[] = [];
  private rng: () => number;
  constructor(
    public mode: Mode = "stage",
    public difficulty: Difficulty = "normal",
    readonly seed = 271828,
  ) {
    const config = DIFFICULTIES[difficulty];
    this.player.lives = config.lives;
    this.player.maxLives = config.lives + 2;
    this.spawnInterval = config.spawn;
    this.rng = random(seed);
  }
  start() {
    if (this.phase === "menu") this.phase = "playing";
  }
  pause() {
    if (this.phase === "playing") this.phase = "paused";
  }
  resume() {
    if (this.phase === "paused") this.phase = "playing";
  }
  nextStage() {
    if (this.phase !== "cleared") return;
    this.stage++;
    if(this.mission>=0)this.mission=Math.min(MISSIONS.length-1,this.mission+1);
    this.stageKills = 0;
    if(this.mission>=0){
      this.killsNeeded=20+MISSIONS[this.mission].rank*6;
      this.spawnInterval=Math.max(36,DIFFICULTIES[this.difficulty].spawn-MISSIONS[this.mission].rank*6);
    }else{
      this.killsNeeded += 5;
      this.spawnInterval = Math.max(30, this.spawnInterval - 6);
    }
    this.spawnTimer = 0;
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.boss = null;
    this.phase = "playing";
  }
  emit(type: GameEvent["type"], body: Body = this.player) {
    this.events.push({ type, x: body.x, y: body.y });
  }
  drainEvents() {
    const result = this.events;
    this.events = [];
    return result;
  }
  bullet(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage = 1,
    color = "#00d4ff",
  ): Bullet {
    return { x, y, vx, vy, damage, color, radius: 4, alive: true };
  }
  shoot() {
    const p = this.player,
      patterns = [
        [[0, 0]],
        [
          [-10, 0],
          [10, 0],
        ],
        [
          [-15, 0],
          [0, 0],
          [15, 0],
        ],
        [
          [-15, -1],
          [-5, 0],
          [5, 0],
          [15, 1],
        ],
        [
          [-20, -2],
          [-10, -1],
          [0, 0],
          [10, 1],
          [20, 2],
        ],
      ];
    for (const [offset, vx] of patterns[p.weapon - 1])
      this.bullets.push(
        this.bullet(
          p.x + offset,
          p.y - p.radius,
          vx,
          -8,
          (p.weapon === 5 ? 2 : 1) * this.damageScale,
          this.skinColor,
        ),
      );
    // Carry fractional ticks so even the first 4% upgrade increases fire rate.
    p.cooldown += Math.max(4,9*this.intervalScale);
    this.emit("shot");
  }
  spawnEnemy(
    x = 30 + this.rng() * (WIDTH - 60),
    kind: "normal" | "elite" = this.rng() > (this.mission>=0?1-this.map.elite:.8) ? "elite" : "normal",
  ) {
    const config = DIFFICULTIES[this.difficulty],
      hp = (kind === "elite" ? 3 : 1) * config.health;
    const enemy: Enemy = {
      x,
      y: -50,
      kind,
      radius: kind === "elite" ? 25 : 20,
      hp,
      maxHp: hp,
      speed: (1 + this.stage * 0.2) * config.speed,
      score: Math.ceil((kind === "elite" ? 50 : 10) * config.score),
      cooldown: 0,
      direction: 1,
    };
    this.enemies.push(enemy);
    return enemy;
  }
  spawnBoss() {
    const config = DIFFICULTIES[this.difficulty],
      hp = (50 + this.stage * 20) * config.health;
    this.enemies = [];
    this.boss = {
      x: WIDTH / 2,
      y: -100,
      kind: "boss",
      radius: 50,
      hp,
      maxHp: hp,
      speed: 2,
      score: Math.ceil(500 * config.score),
      cooldown: 0,
      direction: 1,
    };
    this.emit("boss", this.boss);
  }
  spawnSupply(
    kind: Supply = (["weapon", "shield", "health"] as const)[
      Math.floor(this.rng() * 3)
    ],
  ) {
    const supply: PowerUp = {
      kind,
      x: 20 + this.rng() * (WIDTH - 40),
      y: -30,
      radius: 15,
      alive: true,
    };
    this.powerUps.push(supply);
    return supply;
  }
  collect(kind: Supply) {
    const p = this.player;
    if (kind === "weapon") p.weapon = Math.min(5, p.weapon + 1);
    else if (kind === "shield") p.shield = true;
    else p.lives = Math.min(p.maxLives, p.lives + 1);
    this.emit("supply");
  }
  hurt() {
    const p = this.player;
    if (p.lives <= 0) return;
    if (p.shield) p.shield = false;
    else p.lives--;
    this.emit("hurt");
  }
  private enemyFire(enemy: Enemy) {
    const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x),
      colour =
        enemy.kind === "boss"
          ? "#ffea00"
          : enemy.kind === "elite"
            ? "#ff00ff"
            : "#ff3366";
    const add = (a: number, speed: number) =>
      this.enemyBullets.push(
        this.bullet(
          enemy.x,
          enemy.y,
          Math.cos(a) * speed,
          Math.sin(a) * speed,
          1,
          colour,
        ),
      );
    if (enemy.kind === "boss") {
      for (let i = 0; i < 8; i++) add((i * Math.PI) / 4, 3);
      for (const delta of [-0.3, 0, 0.3]) add(angle + delta, 5);
      enemy.cooldown = this.mission>=0?Math.max(30,48-MISSIONS[this.mission].rank*6):48;
    } else if (enemy.kind === "elite") {
      for (const delta of [-0.2, 0, 0.2]) add(angle + delta, 4);
      enemy.cooldown = 90;
    } else {
      add(Math.PI / 2, 3);
      enemy.cooldown = 120;
    }
  }
  private hit(enemy: Enemy, damage: number) {
    if (enemy.hp <= 0) return;
    enemy.hp -= damage;
    this.emit("hit", enemy);
    if (enemy.hp > 0) return;
    enemy.hp = 0;
    this.score += enemy.score;
    this.kills++;
    this.emit("kill", enemy);
    if (enemy.kind === "boss") {
      this.boss = null;
      this.phase = "cleared";
      this.emit("clear", enemy);
    } else this.stageKills++;
  }
  step(input: Input = {}) {
    if (this.phase !== "playing") return;
    this.tick++;
    const p = this.player;
    const dx = input.dx ?? 0,
      dy = input.dy ?? 0,
      length = Math.hypot(dx, dy);
    if (length) {
      p.x += (dx / length) * 5;
      p.y += (dy / length) * 5;
    } else if (Number.isFinite(input.x) && Number.isFinite(input.y)) {
      const x = input.x! - p.x,
        y = input.y! - p.y,
        distance = Math.hypot(x, y),
        speed = Math.min(5, distance);
      if (distance) {
        p.x += (x / distance) * speed;
        p.y += (y / distance) * speed;
      }
    }
    if(this.mission>=0)p.x+=Math.sin(this.tick/90)*this.map.wind;
    p.x = clamp(p.x, p.radius, WIDTH - p.radius);
    p.y = clamp(p.y, p.radius, HEIGHT - p.radius);
    if (p.cooldown <= 0) this.shoot();
    p.cooldown--;
    if (!this.boss && ++this.spawnTimer >= this.spawnInterval) {
      this.spawnEnemy();
      this.spawnTimer = 0;
    }
    if (++this.supplyTimer >= (this.mission>=0?this.map.supply:900)) {
      this.spawnSupply();
      this.supplyTimer = 0;
    }
    if (
      this.mode === "stage" &&
      !this.boss &&
      this.stageKills >= this.killsNeeded
    )
      this.spawnBoss();
    // Upstream advertised a rising endless challenge, but its progression was
    // unreachable (inside stage-only boss deaths). Increase pressure every 30 s.
    if (this.mode === "endless" && this.tick % 1800 === 0) {
      this.stage++;
      this.spawnInterval = Math.max(30, this.spawnInterval - 3);
    }
    for (const enemy of this.enemies) {
      enemy.y += enemy.speed;
      if(this.mission>=0&&this.map.wind)enemy.x=clamp(enemy.x+Math.sin((this.tick+enemy.y)/45)*this.map.wind*2,25,WIDTH-25);
      if (--enemy.cooldown <= 0) this.enemyFire(enemy);
    }
    if (this.boss) {
      const boss = this.boss;
      if (boss.y < 100) boss.y = Math.min(100, boss.y + boss.speed);
      else {
        boss.x += boss.speed * boss.direction;
        if (boss.x <= boss.radius || boss.x >= WIDTH - boss.radius)
          boss.direction *= -1;
      }
      if (--boss.cooldown <= 0 && boss.y >= 100) this.enemyFire(boss);
    }
    for (const bullet of [...this.bullets, ...this.enemyBullets]) {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;
    }
    for (const supply of this.powerUps) supply.y += 2;
    for (const bullet of this.bullets) {
      if (!bullet.alive) continue;
      const target =
        this.enemies.find((enemy) => enemy.hp > 0 && overlaps(bullet, enemy)) ??
        (this.boss && overlaps(bullet, this.boss) ? this.boss : null);
      if (target) {
        bullet.alive = false;
        this.hit(target, bullet.damage);
      }
    }
    // Stage completion freezes safely before remaining enemy projectiles hit.
    if (this.phase === "playing") {
      for (const bullet of this.enemyBullets)
        if (bullet.alive && overlaps(bullet, p)) {
          bullet.alive = false;
          this.hurt();
        }
      for (const enemy of this.enemies)
        if (enemy.hp > 0 && overlaps(enemy, p)) {
          enemy.hp = 0;
          this.hurt();
          this.emit("kill", enemy);
        }
      if (this.boss && overlaps(this.boss, p)) this.hurt();
      if (p.lives <= 0) {
        this.phase = "lost";
        this.emit("lose");
      } else
        for (const supply of this.powerUps)
          if (supply.alive && overlaps(supply, p)) {
            supply.alive = false;
            this.collect(supply.kind);
          }
    }
    const active = (b: Bullet) =>
      b.alive &&
      b.x > -100 &&
      b.x < WIDTH + 100 &&
      b.y > -100 &&
      b.y < HEIGHT + 100;
    this.bullets = this.bullets.filter(active);
    this.enemyBullets = this.enemyBullets.filter(active);
    this.enemies = this.enemies.filter((e) => e.hp > 0 && e.y < HEIGHT + 50);
    this.powerUps = this.powerUps.filter((s) => s.alive && s.y < HEIGHT + 30);
  }
  summary() {
    return {
      phase: this.phase,
      mode: this.mode,
      difficulty: this.difficulty,
      tick: this.tick,
      stage: this.stage,
      score: this.score,
      kills: this.kills,
      player: { ...this.player },
      enemies: this.enemies.length,
      bullets: this.bullets.length,
      enemyBullets: this.enemyBullets.length,
      bossHp: this.boss?.hp ?? null,
    };
  }
}
