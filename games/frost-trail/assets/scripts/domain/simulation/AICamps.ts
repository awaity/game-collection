/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
import { RESOURCE } from './Balance';
/** AI 营地账本:纯数据 + 纯函数,无 Three.js/DOM 依赖,可被 node:test 直接测试。
 * 每座邻近 AI 营地一份轻量账本,模拟其经济运转、战备值、时代进度与贸易报价。
 * 势力定义由外部(未来的 Factions 模块)注入,本模块不 import 它,保持解耦:
 * { id, name?, personality?('greedy'|'warlike'|'suspicious'|...),
 *   signature?: { 资源: 产出倍率 }, gaps?: [无法采集的资源], specialty?: 特产资源 }
 */
const TUNING = {
    maxStock: 240,
    gather: {
        hunter: { interval: 2.4, resource: 'raw' }, // 猎手产出生肉节拍(秒/个)
        lumber: { interval: 2.0, resource: 'wood' }, // 伐木工产出木材节拍
    },
    fishing: { interval: 3.2 }, // 时代 2 起猎手兼职捕鱼节拍
    cook: { interval: 1.6, fishInterval: 2.2, fuelPerWood: 3 }, // 加工节拍与燃料(1 木 = 3 次)
    eatPerWorkerDay: 2, // 每名工人每游戏日消耗的熟食
    sellInterval: 2.5, // 自动出货节拍(卖出超出舒适线的熟食)
    reserve: { wood: 24, raw: 8, cooked: 12, fish: 6, cookedFish: 12 }, // 舒适库存线:以下产需求,以上产报价
    dayLength: 120, daysPerEra: 3, // 一游戏日秒数 / 每个时代停留天数
    upgradeDuration: 45, // 时代升级耗时:期间停产、防御减半(玩家 timing 窗口)
    era: [null, // 索引 = 时代(1-4)
        { gatherMult: 1.0, defense: 30 },
        { gatherMult: 1.15, defense: 45, fishing: true },
        { gatherMult: 1.3, defense: 60, cookFish: true },
        { gatherMult: 1.5, defense: 80 },
    ],
    readiness: { recover: 0.05, siegeDecay: 0.35, hungerDecay: 0.1, raidLoss: 18, extortAt: 75 }, // 每秒
    defense: { recover: 0.08, raidDamage: 15 },
    raidLoot: 0.25, // 劫掠掠走各资源库存的比例
    besiegeMult: 0.5, // 被围困时的产能倍率
    trade: { demandPremium: 1.6, gapPremium: 1.5, offerDiscount: 0.8, specialtyDiscount: 0.85, rawBase: RESOURCE.raw.tradeValue },
    event: { requestReward: 1.25, extortBase: 30 },
};
const STOCK_KEYS = ['wood', 'raw', 'cooked', 'fish', 'cookedFish'];
const clamp = (v: any, lo: any, hi: any) => Math.max(lo, Math.min(hi, v));
const bounded = (v: any, max: any, fallback: number = 0) => {
    const n = typeof v === 'number' || typeof v === 'string' ? Number(v) : NaN;
    return Number.isFinite(n) ? clamp(n, 0, max) : fallback;
};
const integer = (v: any, max: any, fallback: number = 0) => Math.floor(bounded(v, max, fallback));
// 势力定义兜底归一化
const normFaction = (f: { [key: string]: any; } = {}) => ({
    id: typeof f.id === 'string' && f.id ? f.id : 'unknown',
    name: typeof f.name === 'string' ? f.name : (typeof f.id === 'string' ? f.id : '未知营地'),
    personality: typeof f.personality === 'string' ? f.personality : 'neutral',
    signature: f.signature && typeof f.signature === 'object' ? f.signature : {},
    gaps: Array.isArray(f.gaps) ? f.gaps.filter((g: any) => STOCK_KEYS.includes(g)) : [],
    specialty: STOCK_KEYS.includes(f.specialty) ? f.specialty : null,
});
// 可调表覆写:同名对象浅合并一层,其余整体替换
const mergeTuning = (base: any, override: any) => {
    const out: any = { ...base };
    for (const [k, v] of Object.entries(override ?? {})) {
        const b = base[k];
        out[k] = v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b)
            ? { ...b, ...v } : v;
    }
    return out;
};
/** 单座 AI 营地的轻量账本。 */
export class AICampLedger {
    faction: { id: any; name: any; personality: any; signature: any; gaps: any; specialty: any; [key: string]: any; };
    factionId: any;
    emitter: any;
    tune: any;
    stock: { [key: string]: any; };
    stockpiles: { [key: string]: any; };
    cash: number;
    workers: { hunter: number; lumber: number; [key: string]: any; };
    defense: any;
    warReadiness: number;
    era: number;
    eraUpgrading: boolean;
    upgradeTimer: number;
    dayTimer: number;
    fuel: number;
    besieged: boolean;
    timers: { hunter: number; lumber: number; fish: number; cook: number; cookFish: number; sell: number; eat: number; [key: string]: any; };
    constructor(faction: any, { emitter = null, workers = {}, cash = 0, stock = {}, readiness = 0, tuning = {} }: { emitter?: any; workers?: { [key: string]: any; }; cash?: number; stock?: { [key: string]: any; }; readiness?: number; tuning?: { [key: string]: any; }; [key: string]: any; } = {}) {
        this.faction = normFaction(faction);
        this.factionId = this.faction.id;
        this.emitter = emitter;
        this.tune = mergeTuning(TUNING, tuning);
        this.stock = {};
        this.stockpiles = {}; // stockpiles: 累计产出账(不受消耗影响,供朝贡/情报用)
        for (const k of STOCK_KEYS) {
            this.stock[k] = integer(stock[k], this.tune.maxStock);
            this.stockpiles[k] = 0;
        }
        this.cash = integer(cash, 99999999);
        this.workers = { hunter: integer(workers.hunter, 20, 2), lumber: integer(workers.lumber, 20, 2) };
        this.defense = this.tune.era[1].defense;
        this.warReadiness = clamp(Number(readiness) || 0, 0, 100);
        this.era = 1;
        this.eraUpgrading = false;
        this.upgradeTimer = 0;
        this.dayTimer = 0;
        this.fuel = 0;
        this.besieged = false;
        this.timers = { hunter: 0, lumber: 0, fish: 0, cook: 0, cookFish: 0, sell: 0, eat: 0 };
    }
    get starving() { return this.stock.cooked + this.stock.cookedFish <= 0; }
    _emit(type: any, payload: { [key: string]: any; } = {}) { this.emitter?.emit(type, { factionId: this.factionId, ...payload }); }
    _sig(resource: any) { const m = Number(this.faction.signature[resource]); return Number.isFinite(m) && m >= 0 ? m : 1; }
    _canGather(resource: any) { return !this.faction.gaps.includes(resource); }
    _basePrice(resource: any) { return RESOURCE[resource]?.value || this.tune.trade.rawBase; }
    /** 帧率无关的经济模拟:采集入库、自动加工、吃饭、卖货、战备与防御恢复。 */
    update(dt: any, { productionHaltSeconds = 0 }: { productionHaltSeconds?: number; [key: string]: any; } = {}) {
        if (!Number.isFinite(dt) || dt <= 0)
            return;
        const t = this.tune;
        // 时代:升级中只走升级计时;否则累积天数,到期开工
        if (this.eraUpgrading) {
            this.upgradeTimer += dt;
            if (this.upgradeTimer >= t.upgradeDuration) {
                this.eraUpgrading = false;
                this.upgradeTimer = 0;
                this.dayTimer = 0;
                this.era = Math.min(4, this.era + 1);
                this._emit('era-upgrade-complete', { era: this.era });
            }
        }
        else {
            this.dayTimer += dt;
            if (this.era < 4 && this.dayTimer >= t.daysPerEra * t.dayLength) {
                this.eraUpgrading = true;
                this.upgradeTimer = 0;
                this._emit('era-upgrade-start', { era: this.era + 1 });
            }
        }
        const eraCfg = t.era[this.era];
        let changed = false;
        const productionDt = Math.max(0, dt - Math.max(0, productionHaltSeconds));
        if (!this.eraUpgrading && productionDt > 0) {
            const mult = eraCfg.gatherMult * (this.besieged ? t.besiegeMult : 1);
            const rawRate = this._canGather('raw') ? this.workers.hunter * mult * this._sig('raw') : 0;
            const woodRate = this._canGather('wood') ? this.workers.lumber * mult * this._sig('wood') : 0;
            changed = this._produce('hunter', rawRate, t.gather.hunter.interval, 'raw', productionDt) || changed;
            changed = this._produce('lumber', woodRate, t.gather.lumber.interval, 'wood', productionDt) || changed;
            if (eraCfg.fishing && this._canGather('fish'))
                changed = this._produce('fish', this.workers.hunter * mult * this._sig('fish'), t.fishing.interval, 'fish', productionDt) || changed;
            changed = this._process('cook', 'raw', 'cooked', t.cook.interval, productionDt) || changed;
            if (eraCfg.cookFish && this._canGather('fish'))
                changed = this._process('cookFish', 'fish', 'cookedFish', t.cook.fishInterval, productionDt) || changed;
        }
        this._eat(dt); // 升级中工人仍要吃饭
        changed = this._sell(dt) || changed;
        this._tickReadiness(dt);
        this._tickDefense(dt);
        if (changed)
            this._emit('ledger');
    }
    // 节拍采集:速率 = 工人数 × 时代/围困/签名倍率,攒满一个节拍入库 1 个
    _produce(key: any, rate: any, interval: any, resource: any, dt: any) {
        if (rate <= 0) {
            this.timers[key] = 0;
            return false;
        }
        if (this.stock[resource] >= this.tune.maxStock) {
            this.timers[key] = Math.min(this.timers[key], interval);
            return false;
        }
        this.timers[key] += dt * rate;
        let made = false;
        while (this.timers[key] >= interval && this.stock[resource] < this.tune.maxStock) {
            this.timers[key] -= interval;
            this.stock[resource]++;
            this.stockpiles[resource]++;
            made = true;
        }
        return made;
    }
    // 自动加工:原料 + 燃料 -> 熟食
    _process(key: any, input: any, output: any, interval: any, dt: any) {
        const cap = this.tune.maxStock;
        this.timers[key] += dt;
        let made = false;
        while (this.timers[key] >= interval) {
            if (this.stock[input] < 1 || this.stock[output] >= cap)
                break;
            if (this.fuel < 1) {
                if (this.stock.wood < 1)
                    break;
                this.stock.wood--;
                this.fuel += this.tune.cook.fuelPerWood;
            }
            this.timers[key] -= interval;
            this.fuel--;
            this.stock[input]--;
            this.stock[output]++;
            this.stockpiles[output]++;
            made = true;
        }
        this.timers[key] = Math.min(this.timers[key], interval);
        return made;
    }
    _eat(dt: any) {
        const count = this.workers.hunter + this.workers.lumber;
        if (count <= 0) {
            this.timers.eat = 0;
            return;
        }
        const interval = this.tune.dayLength / (count * this.tune.eatPerWorkerDay);
        this.timers.eat += dt;
        while (this.timers.eat >= interval) {
            this.timers.eat -= interval;
            if (this.stock.cooked > 0)
                this.stock.cooked--;
            else if (this.stock.cookedFish > 0)
                this.stock.cookedFish--;
            else
                break; // 断粮:后果在 _tickReadiness 体现
        }
        this.timers.eat = Math.min(this.timers.eat, interval);
    }
    _sell(dt: any) {
        const t = this.tune;
        this.timers.sell += dt;
        if (this.timers.sell < t.sellInterval)
            return false;
        const pick = ['cookedFish', 'cooked'].find((k: string) => this.stock[k] > t.reserve[k]);
        if (!pick) {
            this.timers.sell = t.sellInterval;
            return false;
        }
        this.timers.sell -= t.sellInterval;
        this.stock[pick]--;
        this.cash = Math.min(99999999, this.cash + this._basePrice(pick));
        return true;
    }
    _tickReadiness(dt: any) {
        const r = this.tune.readiness, prev = this.warReadiness;
        if (this.besieged)
            this.warReadiness -= r.siegeDecay * dt;
        else if (this.starving)
            this.warReadiness -= r.hungerDecay * dt;
        else
            this.warReadiness += r.recover * dt;
        this.warReadiness = clamp(this.warReadiness, 0, 100);
        if (prev < 100 && this.warReadiness >= 100)
            this._emit('readiness-full');
    }
    _tickDefense(dt: any) {
        if (this.besieged)
            return; // 围困中防御无人修整
        const target = this.tune.era[this.era].defense;
        const step = this.tune.defense.recover * dt;
        this.defense = clamp(this.defense + clamp(target - this.defense, -step, step), 0, 100);
    }
    /** 战备值(0-100):随时间恢复,围困/劫掠时下降;蓄满是出击信号。 */
    getWarReadiness() { return this.warReadiness; }
    setWarReadiness(value: any) { const n = Number(value); if (Number.isFinite(n))
        this.warReadiness = clamp(n, 0, 100); }
    setBesieged(flag: any) { this.besieged = flag === true; }
    /** 劫掠:防御与战备受损,库存按比例被掠走,返回战利品清单。 */
    applyRaid() {
        const t = this.tune;
        this.defense = clamp(this.defense - t.defense.raidDamage, 0, 100);
        this.warReadiness = clamp(this.warReadiness - t.readiness.raidLoss, 0, 100);
        const loot: { [key: string]: any; } = {};
        for (const k of STOCK_KEYS) {
            const take = Math.floor(this.stock[k] * t.raidLoot);
            if (take > 0) {
                this.stock[k] -= take;
                loot[k] = take;
            }
        }
        this._emit('raid', { loot });
        return loot;
    }
    /** 当前有效防御:时代升级中减半(timing 窗口)。 */
    getDefense() { return this.eraUpgrading ? this.defense / 2 : this.defense; }
    getEraState() {
        return {
            era: this.era, eraUpgrading: this.eraUpgrading,
            upgradeProgress: this.eraUpgrading ? clamp(this.upgradeTimer / this.tune.upgradeDuration, 0, 1) : 0,
            daysIntoEra: this.dayTimer / this.tune.dayLength,
            defense: this.getDefense(), baseDefense: this.tune.era[this.era].defense,
        };
    }
    /** 需求单:低于舒适线的缺口,按基准价 × 溢价收购;科技缺口资源溢价更高。 */
    getDemands() {
        const t = this.tune.trade, out = [];
        const woodShort = this.tune.reserve.wood - this.stock.wood;
        if (woodShort > 0) {
            const gapMult = this._canGather('wood') ? 1 : t.gapPremium;
            out.push({ resource: 'wood', amount: Math.ceil(woodShort), reason: 'fuel',
                unitPrice: Math.max(1, Math.round(this._basePrice('wood') * t.demandPremium * gapMult)) });
        }
        const foodShort = this.tune.reserve.cooked - (this.stock.cooked + this.stock.cookedFish);
        if (foodShort > 0) {
            const gapMult = this._canGather('raw') ? 1 : t.gapPremium;
            out.push({ resource: 'cooked', amount: Math.ceil(foodShort), reason: 'food',
                unitPrice: Math.max(1, Math.round(this._basePrice('cooked') * t.demandPremium * gapMult)) });
        }
        return out;
    }
    /** 报价单:高于舒适线的盈余,按基准价打折出售;特产折上折。 */
    getOffers() {
        const t = this.tune.trade, out = [];
        for (const k of STOCK_KEYS) {
            const surplus = Math.floor(this.stock[k] - this.tune.reserve[k]);
            if (surplus <= 0)
                continue;
            let price = this._basePrice(k) * t.offerDiscount;
            if (this.faction.specialty === k)
                price *= t.specialtyDiscount;
            out.push({ resource: k, amount: surplus, unitPrice: Math.max(1, Math.round(price)) });
        }
        return out;
    }
    /** 日常外交事件:rng 返回 [0,1);可能为 null(今天无事)。 */
    rollDailyEvent(rng: (...args: any[]) => number = Math.random) {
        const roll = typeof rng === 'function' ? rng : Math.random;
        const demands = this.getDemands(), offers = this.getOffers();
        const w: { request: number; extort: number; trade: number; none: number; [key: string]: any; } = { request: 0, extort: 0, trade: 0, none: 1 };
        if (demands.length)
            w.request = 3;
        if (this.warReadiness >= this.tune.readiness.extortAt)
            w.extort = 2;
        if (offers.length)
            w.trade = 3;
        switch (this.faction.personality) { // 性格左右外交倾向
            case 'greedy':
                w.extort += 2;
                w.trade += 1;
                break;
            case 'warlike':
                w.extort += 3;
                break;
            case 'suspicious':
                w.request += 1;
                w.none += 1;
                break;
        }
        let pick = roll() * (w.request + w.extort + w.trade + w.none), event = null;
        const hit = (weight: any) => { if (weight <= 0)
            return false; if (pick < weight)
            return true; pick -= weight; return false; };
        if (hit(w.request)) {
            const d = demands[0];
            event = { type: 'request', factionId: this.factionId, resource: d.resource, amount: d.amount,
                reward: Math.round(d.unitPrice * d.amount * this.tune.event.requestReward) };
        }
        else if (hit(w.extort)) {
            event = { type: 'extort', factionId: this.factionId,
                amount: Math.max(1, Math.round(this.tune.event.extortBase * this.era * (0.8 + roll() * 0.4))) };
        }
        else if (hit(w.trade)) {
            event = { type: 'trade-offer', factionId: this.factionId, offer: offers[0], offers };
        }
        if (event)
            this._emit('daily-event', { event });
        return event;
    }
    snapshot() {
        return { version: 1, factionId: this.factionId,
            stock: { ...this.stock }, stockpiles: { ...this.stockpiles }, cash: this.cash,
            workers: { ...this.workers }, defense: this.defense, warReadiness: this.warReadiness,
            era: this.era, eraUpgrading: this.eraUpgrading, upgradeTimer: this.upgradeTimer, dayTimer: this.dayTimer,
            fuel: this.fuel, besieged: this.besieged, timers: { ...this.timers } };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return;
        const t = this.tune;
        for (const k of STOCK_KEYS) {
            this.stock[k] = integer(data.stock?.[k], t.maxStock);
            this.stockpiles[k] = integer(data.stockpiles?.[k], 1e12);
        }
        this.cash = integer(data.cash, 99999999);
        this.workers.hunter = integer(data.workers?.hunter, 20);
        this.workers.lumber = integer(data.workers?.lumber, 20);
        this.defense = bounded(data.defense, 100);
        this.warReadiness = bounded(data.warReadiness, 100);
        this.era = Math.max(1, integer(data.era, 4, 1));
        this.eraUpgrading = data.eraUpgrading === true && this.era < 4;
        this.upgradeTimer = bounded(data.upgradeTimer, t.upgradeDuration);
        this.dayTimer = bounded(data.dayTimer, t.daysPerEra * t.dayLength);
        this.fuel = integer(data.fuel, t.cook.fuelPerWood);
        this.besieged = data.besieged === true;
        for (const k of Object.keys(this.timers))
            this.timers[k] = bounded(data.timers?.[k], 1e6);
    }
}
/** 多营地注册表:按 factionId 管理若干账本,统一驱动与序列化。 */
export class AICamps {
    emitter: any;
    tuning: { [key: string]: any; };
    productionHaltFn: (...args: any[]) => number;
    camps: Map<any, any>;
    constructor(factions: any[] = [], { emitter = null, tuning = {}, productionHaltFn = () => 0 }: { emitter?: any; tuning?: { [key: string]: any; }; productionHaltFn?: (...args: any[]) => number; [key: string]: any; } = {}) {
        this.emitter = emitter;
        this.tuning = tuning;
        this.productionHaltFn = productionHaltFn;
        this.camps = new Map();
        for (const f of factions)
            this.add(f);
    }
    add(faction: any, options: { [key: string]: any; } = {}) {
        const ledger = new AICampLedger(faction, { emitter: this.emitter, tuning: this.tuning, ...options });
        this.camps.set(ledger.factionId, ledger);
        return ledger;
    }
    get(factionId: any) { return this.camps.get(factionId) ?? null; }
    list() { return [...Array.from(this.camps.values())]; }
    update(dt: any) {
        for (const c of this.camps.values())
            c.update(dt, { productionHaltSeconds: this.productionHaltFn(c.factionId) });
    }
    snapshot() { return { version: 1, camps: this.list().map((c: any) => c.snapshot()) }; }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1 || !Array.isArray(data.camps))
            return;
        for (const c of data.camps) {
            const ledger = this.camps.get(c?.factionId);
            if (ledger) {
                ledger.restore(c);
                continue;
            }
            if (typeof c?.factionId !== 'string')
                continue;
            const fresh = new AICampLedger({ id: c.factionId }, { emitter: this.emitter, tuning: this.tuning });
            fresh.restore(c);
            this.camps.set(fresh.factionId, fresh);
        }
    }
}
