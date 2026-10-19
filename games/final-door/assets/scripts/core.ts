/** Port of the observed v1.5.0 authoritative rules; no rendering/platform dependencies. */
export interface Input { tick: number; kind: 'target' | 'axis'; value: number }
export interface Gate { id: number; s: number; x: number; kind: '门' | '补给' | '障碍'; op: '加' | '乘'; value: number; initial: number; hp: number; maxHp: number; hits: number; collected: boolean; passed: boolean; brokenAt: number; level: number; half: number }
export interface Enemy { id: number; x: number; s: number; hp: number; maxHp: number; deadAt: number; hitAt: number; speed: number }
export interface Boss { hp: number; maxHp: number; x: number; s: number; phase: '等待' | '倒地' | '追击' | '蓄力' | '重击'; nextAttack: number; windupAt: number; impactAt: number; attackX: number; attackS: number; deathAt: number; hitAt: number; strikes: number; entryCount: number }
export interface BattleEvent { tick: number; type: string; x: number; s: number; value: number; id: number; detail?: string }
export interface Loadout {power:number;haste:number;guard:number;pressure?:number;carry?:number}
export interface Replay { 成长?:Loadout; 作品: string; 版本: string; 种子: number; 路线: number; 输入: { 步: number; 动作: '定位' | '方向'; 数值: number }[] }
/** 唯一权威仿真。渲染器只能读取；输入、回放和自动演示走相同的入口。 */
export const VERSION = '1.5.0', DT = 1 / 60, CAPACITY = 144, BULLET_CAPACITY = 2048;
export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
export const ROUTES = [
    { name: '蓝湾前哨', tag: '初战', start: 10, bossHP: 5600, enemies: 1, crateHP: 105, theme: 0, intro: '先增员，再击破补给。' },
    { name: '风暴航道', tag: '进阶', start: 12, bossHP: 6800, enemies: 1.35, crateHP: 160, theme: 1, intro: '绕开地刺，为重击留出躲避空间。' },
    { name: '赤潮封锁', tag: '挑战', start: 14, bossHP: 8100, enemies: 1.7, crateHP: 195, theme: 2, intro: '射击门值，决定这场硬仗的人数。' },
    {name:'冰川栈桥',tag:'冰川',start:12,bossHP:6200,enemies:1.3,crateHP:130,theme:3,intro:'冰面敌群更慢，补给位置发生变化。'},
    {name:'暮砂遗迹',tag:'遗迹',start:14,bossHP:7200,enemies:1.5,crateHP:150,theme:4,intro:'分岔障碍逼迫走位，留意第二次增员。'},
    {name:'星港长廊',tag:'星港',start:16,bossHP:7800,enemies:1.8,crateHP:175,theme:5,intro:'额外装甲补给，迎战星港守卫。'}
];
/** 种子仅决定敌群间距和相位；不以随机数代替真实伤害。 */
export class Random {
    state: number;
    constructor(seed: number) { this.state = seed >>> 0; }
    next() { let t = this.state += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
}
export const SLOTS = (() => {
    const points = [];
    for (let r = -12; r <= 12; r++)
        for (let c = -12; c <= 12; c++) {
            const x = (c + (r & 1) * .5) * .65, z = r * .59;
            points.push({ x, z, r: x * x + z * z });
        }
    return points.sort((a, b) => a.r - b.r || a.z - b.z || a.x - b.x).slice(0, CAPACITY).map(({ x, z }) => ({ x, z }));
})();
export class Crowd {
    ids: Uint32Array; slots: Uint16Array; count: number; nextId: number;
    constructor() {
        this.ids = new Uint32Array(CAPACITY);
        this.slots = new Uint16Array(CAPACITY);
        this.count = 0;
        this.nextId = 1;
    }
    add(n: number) {
        n = Math.max(0, Math.floor(n));
        if (this.count + n > CAPACITY)
            throw new Error('人数超过明确容量，不能隐藏或截断成员');
        const used = new Set(Array.from(this.slots.subarray(0, this.count))), added = [];
        let slot = 0;
        for (let k = 0; k < n; k++) {
            while (used.has(slot))
                slot++;
            const i = this.count++;
            this.ids[i] = this.nextId++;
            this.slots[i] = slot;
            used.add(slot);
            added.push(this.ids[i]);
        }
        return added;
    }
    remove(index: number) {
        if (index < 0 || index >= this.count)
            throw new Error('移除成员索引无效');
        const id = this.ids[index], last = --this.count;
        this.ids[index] = this.ids[last];
        this.slots[index] = this.slots[last];
        this.ids[last] = 0;
        this.slots[last] = 0;
        return id;
    }
    radius() {
        let r = .65;
        for (let i = 0; i < this.count; i++)
            r = Math.max(r, Math.abs(SLOTS[this.slots[i]].x) + .42);
        return r;
    }
}
/** 紧凑、固定容量的弹丸缓冲。每次开火一发；没有代替整队的装饰弹幕。 */
export class Projectiles {
    count: number; nextId: number; ids: Uint32Array; owner: Uint32Array; x: Float32Array; s: Float32Array; previous: Float32Array; born: Int32Array; damage: Uint8Array;
    constructor() {
        this.count = 0;
        this.nextId = 1;
        this.ids = new Uint32Array(BULLET_CAPACITY);
        this.owner = new Uint32Array(BULLET_CAPACITY);
        this.x = new Float32Array(BULLET_CAPACITY);
        this.s = new Float32Array(BULLET_CAPACITY);
        this.previous = new Float32Array(BULLET_CAPACITY);
        this.born = new Int32Array(BULLET_CAPACITY);
        this.damage = new Uint8Array(BULLET_CAPACITY);
    }
    add(owner: number, x: number, s: number, damage: number, tick: number) {
        if (this.count === BULLET_CAPACITY)
            throw new Error('弹丸容量耗尽，停止而非隐藏弹丸');
        const i = this.count++;
        this.ids[i] = this.nextId++;
        this.owner[i] = owner;
        this.x[i] = x;
        this.s[i] = s;
        this.previous[i] = s;
        this.damage[i] = damage;
        this.born[i] = tick;
    }
    remove(i: number) {
        const j = --this.count;
        for (const a of [this.ids, this.owner, this.x, this.s, this.previous, this.born, this.damage]) {
            a[i] = a[j];
            a[j] = 0;
        }
    }
}
export function defaultInputs(route = 0): Input[] {
    const points = [[0, -3.65], [6.65, 0], [7.8, .3], [8.6, 3.55], [12.1, 0], [18.3, 3.55], [21.0, -3.35], [25.2, 0], [29.2, 0], [33, 0], [33.9, 3.4], [34.95, 0], [36.3, -3.4], [37.4, 0], [38.68, 3.4], [39.8, 0], [41.07, -3.4], [42.2, 0], [43.5, 3.4]];
    if(route===3){points[4]=[12.1,-1.3];points.push([44.2,0]);}
    if (route === 2) {
        points[8] = [29.2, 1.5];
    }
    return points.map(([t, value]) => ({ tick: Math.round(t * 60), kind: 'target', value }));
}
export class Assault {
    tick: number; progress: number; x: number; target: number; axis: number;
    crowd: Crowd; bullets: Projectiles; gates: Gate[]; enemies: Enemy[]; events: BattleEvent[];
    inputIndex: number; level: number; armor: boolean; outcome: '进行中' | '胜利' | '失败';
    endedAt: number; losses: number; kills: number; shots: number; hits: number; gateApplications: number;
    upgrades: number; rejects: number; distance: number; entryAt: number; collected: number; warning: string;
    seed: number; route: number; rng: Random; inputs: Input[]; boss: Boss;
    loadout:Loadout={power:0,haste:0,guard:0};
    constructor(seed = 42, route = 0, inputs: Input[] = defaultInputs(route),loadout?:Loadout) {
        this.tick = 0;
        this.progress = 0;
        this.x = 0;
        this.target = 0;
        this.axis = 0;
        this.crowd = new Crowd();
        this.bullets = new Projectiles();
        this.gates = [];
        this.enemies = [];
        this.events = [];
        this.inputIndex = 0;
        this.level = 1;
        this.armor = false;
        this.outcome = '进行中';
        this.endedAt = -1;
        this.losses = 0;
        this.kills = 0;
        this.shots = 0;
        this.hits = 0;
        this.gateApplications = 0;
        this.upgrades = 0;
        this.rejects = 0;
        this.distance = 112;
        this.entryAt = -1;
        this.collected = 0;
        this.warning = '';
        if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295 || !Number.isInteger(route) || route < 0 || route >= ROUTES.length)
            throw new Error('种子必须是无符号三十二位整数，路线必须为零、一或二');
        if (!Array.isArray(inputs) || inputs.length > 12000 || inputs.some(i => !i || !Number.isInteger(i.tick) || i.tick < 0 || i.tick > 2700 || !['target', 'axis'].includes(i.kind) || !Number.isFinite(i.value) || Math.abs(i.value) > (i.kind === 'axis' ? 1 : 5.5)))
            throw new Error('初始化输入序列无效');
        this.seed = seed >>> 0;
        this.route = clamp(Math.floor(route), 0, ROUTES.length-1);
        this.rng = new Random(this.seed);
        this.inputs = inputs.map(x => ({ ...x })).sort((a, b) => a.tick - b.tick);
        this.crowd.add(ROUTES[this.route].start);
        const row = (s: number, x: number, kind: Gate['kind'], value: number, hp = 0, level = 0, op: Gate['op'] = '加', half = 1.92) => this.gates.push({ id: this.gates.length + 1, s, x, kind, op, value, initial: value, hp, maxHp: hp, hits: 0, collected: false, passed: false, brokenAt: -1, level, half });
        row(20, -4.05, '门', 0);
        row(20, 0, '补给', 0, 95, 2);
        row(20, 4.05, '补给', 0, 160, 3);
        row(47, -4.05, '门', -24);
        row(47, 0, '补给', 0, ROUTES[this.route].crateHP, 2);
        row(47, 4.05, '门', 4);
        row(74, -3.7, '障碍', 0, 0, 0, '加', 1.35);
        row(78, 1.3, '障碍', 0, 0, 0, '加', 1.1);
        row(84, -3.05, '门', 2, 0, 0, '乘', 2.88);
        row(84, 3.05, '门', 18, 0, 0, '加', 2.88);
        // 敌人实际前进、拦截弹丸并接触队员；每个敌人有独立编号与耐久。
        for (const [s, count, health] of [[34, 16, 4], [63, 28, 7], [98, 36, 10]])
            for (let i = 0; i < Math.round(count * ROUTES[this.route].enemies); i++) {
                const col = i % 8, rr = Math.floor(i / 8);
                this.enemies.push({ id: this.enemies.length + 1, x: (col - 3.5) * .70 + (this.rng.next() - .5) * .20, s: s + rr * .66 + (this.rng.next() - .5) * .2, hp: health, maxHp: health, deadAt: -1, hitAt: -100, speed: .58 + this.rng.next() * .26 });
            }
        if(route===3){for(const e of this.enemies)e.speed*=.65;this.gates[4].x=-1.3;}
        if(route===4){row(64,4.5,'障碍',0,0,0,'加',.8);row(65,-4.5,'门',5);}
        if(route===5)row(63,4.05,'补给',0,120,3);
        const hp = ROUTES[this.route].bossHP;
        this.boss = { hp, maxHp: hp, x: 0, s: 128, phase: '等待', nextAttack: 0, windupAt: -1, impactAt: -1, attackX: 0, attackS: 0, deathAt: -1, hitAt: -100, strikes: 0, entryCount: 0 };
        if(loadout)this.configure(loadout);
    }
    configure(loadout:Loadout){
      for(const key of ['power','haste','guard'] as const)if(!Number.isInteger(loadout[key])||loadout[key]<0||loadout[key]>5)throw Error('成长等级无效');
      if(loadout.pressure!==undefined&&(!Number.isInteger(loadout.pressure)||loadout.pressure<0||loadout.pressure>30))throw Error('无尽压力无效');
      if(loadout.carry!==undefined&&(!Number.isInteger(loadout.carry)||loadout.carry<0||loadout.carry>144))throw Error('接战队员无效');
      this.loadout={...loadout};this.crowd.add(Math.max(loadout.guard*2,(loadout.carry??0)-this.crowd.count));
      const scale=1+(loadout.pressure??0)*.08;this.boss.hp*=scale;this.boss.maxHp*=scale;
      for(const e of this.enemies){e.hp*=scale;e.maxHp*=scale;}
    }
    get time() { return this.tick / 60; }
    member(i: number) { const slot = this.crowd.slots[i], p = SLOTS[slot]; return { id: this.crowd.ids[i], x: this.x + p.x, s: this.progress - p.z, slot }; }
    event(type: string, x: number, s: number, value = 0, id = 0, detail?: string) { this.events.push({ tick: this.tick, type, x, s, value, id, detail }); }
    input(kind: Input['kind'], value: number, record = true) {
        if (!['target', 'axis'].includes(kind) || !Number.isFinite(value))
            throw new Error('输入动作或数值无效');
        const v = kind === 'axis' ? clamp(value, -1, 1) : clamp(value, -5.5, 5.5);
        if (kind === 'axis')
            this.axis = v;
        else {
            this.target = v;
            this.axis = 0;
        }
        if (record) {
            this.inputs.push({ tick: this.tick, kind, value: v });
            this.inputs.sort((a, b) => a.tick - b.tick);
            this.inputIndex = this.inputs.filter(i => i.tick <= this.tick).length;
        }
    }
    takeControl() {
        if (this.outcome !== '进行中' || this.tick >= 2700)
            return;
        this.inputs = this.inputs.filter(i => i.tick < this.tick);
        this.inputIndex = this.inputs.length;
        this.input('axis', 0);
        this.event('接管', this.x, this.progress);
    }
    casualty(i: number, reason: string) { const m = this.member(i); this.crowd.remove(i); this.losses++; this.event('队员倒地', m.x, m.s, 1, m.id, reason); }
    applyGate(g: Gate) {
        if (g.collected || g.kind !== '门')
            return;
        g.collected = true;
        this.gateApplications++;
        const before = this.crowd.count;
        const wanted = g.op === '乘' ? before * g.value : Math.max(0, before + g.value);
        if (wanted > CAPACITY) {
            this.rejects++;
            this.warning = '门后人数超过容量，本次效果已明确拒绝';
            this.event('容量拒绝', g.x, g.s, wanted, g.id);
            return;
        }
        if (wanted > before)
            this.crowd.add(wanted - before);
        else
            for (let i = before - 1; i >= wanted; i--)
                this.casualty(i, '算术门');
        this.event('过门', g.x, g.s, this.crowd.count - before, g.id, g.op === '乘' ? '乘算' : '加算');
    }
    finish(outcome: '胜利' | '失败') {
        if (this.outcome !== '进行中')
            return;
        this.outcome = outcome;
        this.endedAt = this.tick;
        this.axis = 0;
        this.bullets.count = 0;
        this.event(outcome, this.x, this.progress, this.crowd.count);
    }
    /** 支持60Hz逐步推进；时间不依赖墙钟，不允许跳过碰撞来凑视频时长。 */
    step() {
        if (this.tick >= 2700)
            return;
        while (this.outcome === '进行中' && this.inputIndex < this.inputs.length && this.inputs[this.inputIndex].tick <= this.tick) {
            const i = this.inputs[this.inputIndex++];
            this.input(i.kind, i.value, false);
        }
        if (this.outcome === '进行中')
            this.update();
        this.tick++;
        this.assert();
    }
    update() {
        this.target = clamp(this.target + this.axis * 6.3 * DT, -5.5, 5.5);
        const limit = Math.max(.85, 6.35 - this.crowd.radius());
        const desired = clamp(this.target, -limit, limit);
        this.x += clamp(desired - this.x, -.13, .13);
        const old = this.progress;
        this.progress = Math.min(this.distance, this.progress + 3.5 * DT);
        for (const g of this.gates) {
            if (!g.passed && old < g.s && this.progress >= g.s) {
                if (g.kind === '门' && Math.abs(this.x - g.x) <= g.half)
                    this.applyGate(g);
                if (g.kind === '补给' && g.hp <= 0 && Math.abs(this.x - g.x) <= g.half) {
                    g.collected = true;
                    this.upgrades++;
                    if (g.level === 3)
                        this.armor = true;
                    else
                        this.level = Math.max(2, this.level);
                    this.collected++;
                    this.event('装备升级', g.x, g.s, g.level, g.id);
                }
                g.passed = true;
            }
            if (g.kind === '障碍' && Math.abs(this.progress - g.s) < 5)
                for (let i = this.crowd.count - 1; i >= 0; i--) {
                    const m = this.member(i);
                    if (Math.abs(m.s - g.s) < .38 && Math.abs(m.x - g.x) < g.half + .20)
                        this.casualty(i, '地刺');
                }
            if (g.kind === '补给' && g.hp > 0 && Math.abs(this.progress - g.s) < 4.5)
                for (let i = this.crowd.count - 1; i >= 0; i--) {
                    const m = this.member(i);
                    if (Math.abs(m.s - g.s) < .55 && Math.abs(m.x - g.x) < 1.0)
                        this.casualty(i, '未击破的补给箱');
                }
        }
        for (const e of this.enemies)
            if (e.hp > 0) {
                if (e.s - this.progress < 24)
                    e.s -= e.speed * DT;
                if (e.s - this.progress < 8 && e.s > this.progress - 3)
                    e.x += clamp(this.x - e.x, -e.speed * .6 * DT, e.speed * .6 * DT);
                if (e.s < this.progress + 5 && e.s > this.progress - 4) {
                    for (let i = this.crowd.count - 1; i >= 0; i--) {
                        const m = this.member(i);
                        if (Math.abs(m.x - e.x) < .47 && Math.abs(m.s - e.s) < .48) {
                            this.casualty(i, '敌人接触');
                            e.hp = 0;
                            e.deadAt = this.tick;
                            this.event('敌人倒地', e.x, e.s, 0, e.id, '接触冲撞');
                            break;
                        }
                    }
                }
                if (e.s < this.progress - 6) {
                    e.hp = 0;
                    e.deadAt = this.tick;
                    this.event('敌人离场', e.x, e.s, 0, e.id);
                }
            }
        const firePeriod = (this.level === 1 ? 18 : 13)*(1-this.loadout.haste*.04);
        for (let i = 0; i < this.crowd.count; i++) {
            const m = this.member(i);
            const shotTick=this.tick+m.id*7;
            if (Math.floor(shotTick/firePeriod)>Math.floor((shotTick-1)/firePeriod)) {
                this.bullets.add(m.id, m.x + .16, m.s + .86, this.level === 1 ? 1 : 3, this.tick);
                this.shots++;
            }
        }
        this.updateBullets();
        this.updateBoss();
        if (this.crowd.count === 0)
            this.finish('失败');
    }
    updateBullets() {
        const p = this.bullets;
        for (let i = p.count - 1; i >= 0; i--) {
            const from = p.s[i], to = from + .85, x = p.x[i];
            p.previous[i] = from;
            p.s[i] = to;
            if (this.tick - p.born[i] > 105 || to > this.progress + 31) {
                p.remove(i);
                continue;
            }
            let distance = Infinity, target: Gate | Enemy | Boss | null = null, type = '';
            const candidate = (s: number, half: number, xx: number, obj: Gate | Enemy | Boss, t: string) => {
                const d = s - from;
                if (d >= -.45 && d <= to - from + .45 && Math.abs(x - xx) <= half && d < distance) {
                    distance = d;
                    target = obj;
                    type = t;
                }
            };
            for (const g of this.gates)
                if (!g.passed && ((g.kind === '门') || (g.kind === '补给' && g.hp > 0)))
                    candidate(g.s, g.kind === '门' ? g.half : 1.25, g.x, g, g.kind);
            for (const e of this.enemies)
                if (e.hp > 0)
                    candidate(e.s, .35, e.x, e, '敌人');
            if (this.boss.hp > 0)
                candidate(this.boss.s, 1.7, this.boss.x, this.boss, '首领');
            if (target) {
                this.hits++;
                const damage = p.damage[i]*(1+this.loadout.power*.12);
                if (type === '门') {
                    const g = target as Gate;
                    g.hits++;
                    if (g.op === '加' && g.hits % 8 === 0 && g.value < 80) {
                        g.value++;
                        this.event('门值增加', x, g.s, 1, g.id);
                    }
                }
                else if (type === '补给') {
                    const g = target as Gate;
                    g.hp = Math.max(0, g.hp - damage);
                    if (g.hp === 0) {
                        g.brokenAt = this.tick;
                        this.event('补给击破', g.x, g.s, g.level, g.id);
                    }
                }
                else if (type === '敌人') {
                    const e = target as Enemy;
                    e.hp = Math.max(0, e.hp - damage);
                    e.hitAt = this.tick;
                    if (e.hp === 0) {
                        e.deadAt = this.tick;
                        this.kills++;
                        this.event('敌人倒地', e.x, e.s, 1, e.id, '弹丸命中');
                    }
                }
                else {
                    const b = this.boss;
                    b.hp = Math.max(0, b.hp - damage);
                    if (this.tick - b.hitAt > 9)
                        b.hitAt = this.tick;
                }
                this.event('命中', x, from + Math.max(0, distance), damage, p.ids[i], type);
                p.remove(i);
            }
        }
    }
    updateBoss() {
        const b = this.boss;
        if (b.hp === 0 && b.phase !== '倒地') {
            b.phase = '倒地';
            b.deathAt = this.tick;
            this.event('首领倒地', b.x, b.s, 0);
            this.finish(this.crowd.count > 0 ? '胜利' : '失败');
            return;
        }
        if (b.phase === '倒地')
            return;
        if (this.progress >= this.distance && b.phase === '等待') {
            b.phase = '追击';
            this.entryAt = this.tick;
            b.entryCount = this.crowd.count;
            b.nextAttack = this.tick + 105;
            this.event('终点入场', this.x, this.progress, this.crowd.count);
        }
        if (b.phase === '等待')
            return;
        // 真正移动的首领代理与渲染一致：蓄力末段前扑，拳头在预警中心落下。
        if (b.phase === '追击') {
            b.x += clamp(-b.x, -.12, .12);
            b.s += clamp(this.progress + 5 - b.s, -4 * DT, 4 * DT);
        }
        else if (b.phase === '蓄力' && this.tick - b.windupAt >= 36) {
            const p = clamp((this.tick - b.windupAt - 36) / 12, 0, 1);
            b.x = b.attackX * p;
            b.s = this.progress + 5 - 3 * p;
        }
        else if (b.phase === '重击') {
            const p = clamp((this.tick - b.impactAt - 5) / 19, 0, 1);
            b.x = b.attackX * (1 - p);
            b.s = this.progress + 2 + 3 * p;
        }
        if (this.tick >= b.nextAttack && b.phase === '追击') {
            b.phase = '蓄力';
            b.windupAt = this.tick;
            b.attackX = this.x;
            b.attackS = this.progress - .55;
            this.event('重击预警', b.attackX, b.attackS, 0);
        }
        if (b.phase === '蓄力' && this.tick - b.windupAt >= 48) {
            b.phase = '重击';
            b.impactAt = this.tick;
            b.strikes++;
            b.nextAttack = this.tick + 95;
            let removed = 0;
            for (let i = this.crowd.count - 1; i >= 0; i--) {
                const m = this.member(i), d = Math.hypot(m.x - b.attackX, (m.s - b.attackS) * .92);
                if (d < (this.armor ? 1.65 : 2.12)) {
                    this.casualty(i, '首领重击');
                    removed++;
                }
            }
            this.event('首领重击', b.attackX, b.attackS, removed);
        }
        if (b.phase === '重击' && this.tick - b.impactAt >= 24)
            b.phase = '追击';
    }
    assert() {
        const n = this.crowd.count;
        if (n < 0 || n > CAPACITY || !Number.isInteger(n))
            throw new Error('真实人数不变量失败');
        const ids = new Set(), slots = new Set();
        for (let i = 0; i < n; i++) {
            if (!this.crowd.ids[i] || ids.has(this.crowd.ids[i]) || slots.has(this.crowd.slots[i]))
                throw new Error('成员编号或槽位重复');
            ids.add(this.crowd.ids[i]);
            slots.add(this.crowd.slots[i]);
        }
        if (this.boss.hp < 0 || !Number.isFinite(this.boss.hp))
            throw new Error('首领耐久不变量失败');
        if (this.outcome === '胜利' && (n === 0 || this.boss.hp !== 0))
            throw new Error('非法胜利状态');
        if (this.bullets.count < 0 || this.bullets.count > BULLET_CAPACITY)
            throw new Error('弹丸数量不变量失败');
        if (!Number.isFinite(this.x) || !Number.isFinite(this.progress))
            throw new Error('仿真位置不合法');
        for (const g of this.gates)
            if (g.hp < 0 || !Number.isFinite(g.hp))
                throw new Error('补给耐久无效');
        for (let i = 0; i < this.bullets.count; i++)
            if (!this.bullets.ids[i] || !this.bullets.owner[i] || !Number.isFinite(this.bullets.x[i]) || !Number.isFinite(this.bullets.s[i]))
                throw new Error('弹丸数据不变量失败');
    }
    snapshot() { return { ...(Object.values(this.loadout).some(v=>v>0)?{成长:{...this.loadout}}:{}), 版本: VERSION, 种子: this.seed, 路线: this.route, 随机状态: this.rng.state, 下一成员编号: this.crowd.nextId, 下一弹丸编号: this.bullets.nextId, 输入游标: this.inputIndex, 门应用次数: this.gateApplications, 升级次数: this.upgrades, 容量拒绝次数: this.rejects, 入场步: this.entryAt, 步: this.tick, 进度: this.progress, 横向: this.x, 目标: this.target, 轴: this.axis, 人数: this.crowd.count, 成员: Array.from(this.crowd.ids.subarray(0, this.crowd.count)), 槽位: Array.from(this.crowd.slots.subarray(0, this.crowd.count)), 等级: this.level, 装甲: this.armor, 损失: this.losses, 击杀: this.kills, 射击: this.shots, 命中: this.hits, 结果: this.outcome, 结束步: this.endedAt, 已拾取: this.collected, 警告: this.warning, 输入: this.inputs.map(i => ({ ...i })), 门: this.gates.map(g => ({ ...g })), 敌人: this.enemies.map(e => ({ ...e })), 首领: { ...this.boss }, 弹丸: { 编号: Array.from(this.bullets.ids.subarray(0, this.bullets.count)), 横向: Array.from(this.bullets.x.subarray(0, this.bullets.count)), 进度: Array.from(this.bullets.s.subarray(0, this.bullets.count)), 伤害: Array.from(this.bullets.damage.subarray(0, this.bullets.count)), 发射者: Array.from(this.bullets.owner.subarray(0, this.bullets.count)), 出生步: Array.from(this.bullets.born.subarray(0, this.bullets.count)), 上一进度: Array.from(this.bullets.previous.subarray(0, this.bullets.count)) } }; }
    hash() {
        const s = JSON.stringify(this.snapshot());
        let h = 2166136261;
        for (let i = 0; i < s.length; i++)
            h = Math.imul(h ^ s.charCodeAt(i), 16777619);
        return (h >>> 0).toString(16).padStart(8, '0');
    }
}
export function exportReplay(s: Assault): Replay { return { 作品: '最后一道门', 版本: s.route>=3||Object.values(s.loadout).some(v=>v>0)?'1.6.0':VERSION, 成长:{...s.loadout}, 种子: s.seed, 路线: s.route, 输入: s.inputs.map(i => ({ 步: i.tick, 动作: i.kind === 'target' ? '定位' : '方向', 数值: i.value })) }; }
export function importReplay(raw: string): {seed: number; route: number; inputs: Input[];loadout?:Loadout} {
    let r: Replay;
    try {
        r = JSON.parse(raw);
    }
    catch {
        throw new Error('回放文件不是有效的数据文本');
    }
    if (!r || typeof r !== 'object' || r.作品 !== '最后一道门' || ![VERSION,'1.6.0'].includes(r.版本))
        throw new Error('回放版本不匹配；经典回放请进入经典远征');
    if (!Number.isInteger(r.种子) || r.种子 < 0 || r.种子 > 4294967295 || !Number.isInteger(r.路线) || r.路线 < 0 || r.路线 > (r.版本==='1.6.0'?ROUTES.length-1:2) || !Array.isArray(r.输入) || r.输入.length > 12000)
        throw new Error('回放参数无效');
    let prev = -1;
    const inputs = r.输入.map(i => {
        if (!i || typeof i !== 'object' || !Number.isInteger(i.步) || i.步 < prev || i.步 < 0 || i.步 > 2700 || !Number.isFinite(i.数值) || !['定位', '方向'].includes(i.动作) || Math.abs(i.数值) > (i.动作 === '定位' ? 5.5 : 1))
            throw new Error('回放输入不合法');
        prev = i.步;
        return { tick: i.步, kind: i.动作 === '定位' ? 'target' as const : 'axis' as const, value: i.数值 };
    });
    if(r.成长)new Assault(r.种子,r.路线,[],r.成长);
    return { seed: r.种子, route: r.路线, inputs,loadout:r.成长 };
}
