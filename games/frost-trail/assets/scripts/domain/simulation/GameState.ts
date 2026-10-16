import { findLastIndex } from '../utils/math';
/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
import { EventBus } from '../utils/EventBus';
import { seededRandom } from '../utils/math';
import { BALANCE, RESOURCE, PURCHASES, STATIONS, WORLD_BOUNDS, AI_CAMPS, LAMP_SLOTS, LAMP_COST, RELIC_SPOTS, CORRAL_RULES, GREENHOUSE_RULES, FISHTRAP_RULES, BERRY_BUSHES, BERRY_RULES, ERA_GATED_PURCHASES, DEPLETION_RULES, DEEP_FISHING_RULES, LOAD_RULES } from './Balance';
import { DayNight } from '../nightwatch/DayNight';
import { RaidWaves } from '../nightwatch/RaidWaves';
import { LampNetwork } from '../lampline/LampNetwork';
import { Factions } from './Factions';
import { AICamps } from './AICamps';
import { Market } from './Market';
import { Ages } from './Ages';
import { Annexation } from './Annexation';
import { Caravans } from './Caravans';
import { Endgame } from './Endgame';
import { Prestige, PRESTIGE_RULES, ANNEX_CARDS } from './Prestige';
import { STAFF_ROLES, STAFF_RULES, createCounterStaff, restoreCounterStaff, snapshotCounterStaff } from './CounterStaff';
// —— 扩展模块接线数值表（全部可调）——
const SAVE_VERSION = 3; // v3 起携带扩展模块子快照
const GIFT_COST = 50, GIFT_RELATION = 10; // 势力送礼：$50 换 +10 关系（性格加成在 Factions 内）
// 势力弱点/特产折算为 AI 营地采集缺口与特产（AICamps 账本用）
const FACTION_GAPS: { hunters: string[]; fishers: string[]; merchants: string[]; nomads: any[]; bastion: any[]; [key: string]: any; } = { hunters: ['fish'], fishers: ['wood'], merchants: ['raw'], nomads: [], bastion: [] };
const FACTION_SPECIALTY: { hunters: string; fishers: string; merchants: any; nomads: any; bastion: any; [key: string]: any; } = { hunters: 'raw', fishers: 'fish', merchants: null, nomads: null, bastion: null };
// 固定种子扰动（可调）：势力档位阈值的 ±10% 扰动可复现
const factionRng = () => seededRandom(20260920);
// 吞并接线（可调）：势力强度档对齐 Annexation.TIER；landmark 不预设，落选地标按 ages.lost 归属夺回
const ANNEXATION_FACTIONS = freeze({
    nomads: freeze({ name: '游牧毡帐帮', strength: 1 }),
    fishers: freeze({ name: '冰湖渔会', strength: 2 }),
    hunters: freeze({ name: '猎户帮', strength: 3 }),
    merchants: freeze({ name: '雪口商会', strength: 3 }),
    bastion: freeze({ name: '石垒寨', strength: 5 }),
});
// 种子码（里程碑比拼标识；当前地形仍为固定布局，后续可接地图生成）。字符表去掉易混淆的 0/O/1/I
const SEED_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const randomSeed = () => Array.from({ length: 6 }, () => SEED_CHARS[Math.floor(Math.random() * 32)]).join('');
const SEED_RE = /^[A-HJ-NP-Z2-9]{6}$/;
// 旧档（v1/v2 无种子字段）：从存档原文派生稳定值（FNV-1a 迭代取 6 位）
const deriveSeed = (text: any) => {
    let h = 2166136261, out = '';
    for (let i = 0; i < 6; i++) {
        for (let j = i; j < text.length; j += 7) {
            h ^= text.charCodeAt(j);
            h = Math.imul(h, 16777619);
        }
        out += SEED_CHARS[(h >>> 0) % 32];
    }
    return out;
};
const SIEGE_DAILY_COST = 40; // 围困每日维持成本（断粮断薪，可调）
const TRIBUTE_RATE = 0.15; // 朝贡契约每日上缴对方现金比例（可调，须在 Factions 的 0.1~0.2 区间内）
const TRIBUTE_PRESSURE_MIN = 50; // 围困压力达到此值才可签朝贡契约（可调）
const RAID_STRENGTH = 42; // 玩家亲袭强度（可调）：→ 防御 -21、停产 8.4 分钟
const RAID_GATE_RANGE = 3.2; // 突袭/总攻要求玩家位于对方门口的半径（可调）
const COUNTER_WAVE_BASE = 8, COUNTER_WAVE_PER_TIER = 6; // 占领期夜间反扑强度 = 8 + 档次×6（可调）
const CARAVAN_CARGO = freeze({ type: 'wood', count: 20 }); // 派出商队的载货（可调）：从料仓取 20 木材
const CARAVAN_SPECIALTY_COUNT = 2; // 返程对方特产份数（可调）
const FISH_YIELD_MULT = 1.5; // 吞并冰湖渔会后钓鱼速率倍率（独占湖心渔场，可调）
const WORKER_SIGNON = 30; // 吞并佃农溢出折现（每人签约金，可调）
// 夜袭报复预告（可调）：翻脸后 2 夜报复，被突袭后次夜复仇
const REVENGE_STANCE_DELAY = 2, REVENGE_RAID_DELAY = 1;
const REVENGE_BASE = 8, REVENGE_PER_TIER = 4, REVENGE_RAID_STRENGTH = 12;
// 邻营主动事件（可调）：每天按种子逐营 roll，待办保留 1 天，上限 10 条
const DAILY_EVENT_SEED = 20260920, EVENT_MAX = 10;
const EVENT_REJECT_PENALTY: { request: number; extort: number; 'trade-offer': number; [key: string]: any; } = { request: -3, extort: -5, 'trade-offer': 0 }; // 拒绝扣分（可调）
const EVENT_ACCEPT_RELATION: { extort: number; 'trade-offer': number; [key: string]: any; } = { extort: 6, 'trade-offer': 4 }; // 勒索/通商接受的关系（求援走 completeQuest +15）
const bounded = (value: any, max: any, fallback: number = 0) => {
    const n = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
    return Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : fallback;
};
const integer = (value: any, max: any, fallback: number = 0) => Math.floor(bounded(value, max, fallback));
const validResource = (type: any) => typeof type === 'string' && Object.prototype.hasOwnProperty.call(RESOURCE, type) && type !== 'cash';
const validRole = (role: any) => role === 'wood' || role === 'raw';
const freshCamp = () => ({
    purchases: { hunters: false, woodcutters: false, rawBelt: false, woodBelt: false, tradePost: false, siegeEngine: false, stoneWall: false, watchPost: false, corral: false, greenhouse: false },
    stock: { wood: 0, raw: 0, cooked: 0, fish: 0 }, feed: { wood: 0, raw: 0 },
    fuel: 0, workers: [], transit: [], beltTimers: { wood: 0, raw: 0 }, nextTransitId: 1, fishtraps: 0,
    staff: createCounterStaff(),
});
/** Authoritative, serializable rules. No Three.js objects and no real-time timers. */
export class GameState {
    events: EventBus;
    nextId: number;
    cash: number;
    counterCash: number;
    inventory: any[];
    cooking: ({ output: string; remaining: number; destination: string; [key: string]: any; } | { output: any; remaining: number; destination: string; [key: string]: any; }) | null;
    unlockedPond: boolean;
    backpackUpgraded: boolean;
    position: { x: number; z: number; [key: string]: any; };
    stats: { wood: number; raw: number; cooked: number; sold: number; earned: number; fish: number; fuelUsed: number; deposited: number; workerWood: number; workerRaw: number; automated: number; autoCollected: number; salesValue: number; berry: number; gifts: number; caravanRuns: number; barters: number; annexed: number; tributes: number; revengeRepelled: number; deerSlaughtered: number; [key: string]: any; };
    world: { nodes: any[]; drops: any[]; [key: string]: any; };
    camp: { purchases: { hunters: boolean; woodcutters: boolean; rawBelt: boolean; woodBelt: boolean; tradePost: boolean; siegeEngine: boolean; stoneWall: boolean; watchPost: boolean; corral: boolean; greenhouse: boolean; [key: string]: any; }; stock: { wood: number; raw: number; cooked: number; fish: number; [key: string]: any; }; feed: { wood: number; raw: number; [key: string]: any; }; fuel: number; workers: any[]; transit: any[]; beltTimers: { wood: number; raw: number; [key: string]: any; }; nextTransitId: number; fishtraps: number; staff: { reserve: number; [key: string]: any; }; [key: string]: any; };
    quest: number;
    elapsed: number;
    dayNight: DayNight;
    factions: Factions;
    aiCamps: AICamps;
    market: Market;
    ages: Ages;
    annexation: Annexation;
    caravans: Caravans;
    endgame: Endgame;
    lampNetwork: LampNetwork;
    raidWaves: RaidWaves;
    prestige: Prestige;
    pendingEvents: any[];
    coupons: { beltFree: number; guardVouchers: number; [key: string]: any; };
    buffs: { [key: string]: any; };
    powers: { [key: string]: any; };
    permaDefense: number;
    corralDeer: any[];
    nextDeerId: number;
    berryBushes: { [k: string]: { ready: boolean; regrowDay: number; [key: string]: any; }; };
    deepFishing: { [k: string]: { stock: number; [key: string]: any; }; };
    seedCode: string;
    sieges: { [key: string]: any; };
    milestones: { [key: string]: any; };
    constructor(data: { [key: string]: any; } = {}) {
        this.events = new EventBus();
        this.nextId = 1;
        this.cash = 0;
        this.counterCash = 0;
        this.inventory = [];
        this.cooking = null;
        this.unlockedPond = false;
        this.backpackUpgraded = false;
        this.position = { x: -2.2, z: 2.1 };
        this.stats = { wood: 0, raw: 0, cooked: 0, sold: 0, earned: 0, fish: 0,
            fuelUsed: 0, deposited: 0, workerWood: 0, workerRaw: 0, automated: 0, autoCollected: 0, salesValue: 0,
            berry: 0, gifts: 0, caravanRuns: 0, barters: 0, annexed: 0, tributes: 0, revengeRepelled: 0, deerSlaughtered: 0 };
        this.world = { nodes: [], drops: [] };
        this.camp = freshCamp();
        this.quest = 0;
        this.elapsed = 0;
        // 扩展模块（纯逻辑，事件经本总线转发，HUD/Effects 可直接订阅）
        this.dayNight = new DayNight({ emitter: this.events,
            onAdvance: (seconds: any) => this.ages.advance(seconds / (this.dayNight.dayLength + this.dayNight.nightLength)) });
        this.factions = new Factions({ emitter: this.events, rng: factionRng() });
        this.aiCamps = new AICamps(this.factions.list().map((f: any) => ({ id: f.id, name: f.name, personality: f.personality,
            gaps: FACTION_GAPS[f.id] ?? [], specialty: FACTION_SPECIALTY[f.id] ?? null })), {
            emitter: this.events,
            productionHaltFn: (id: any) => (this.annexation.getProgress(id)?.assault.productionHalt ?? 0) * 60,
        });
        this.market = new Market({ emitter: this.events });
        this.ages = new Ages({ emitter: this.events });
        // 吞并三路径 / 商路商队 / 终局四路径（第二波扩展接线）
        this.annexation = new Annexation({ emitter: this.events, factions: ANNEXATION_FACTIONS });
        this.caravans = new Caravans({
            emitter: this.events,
            isAlliedFn: (id: any) => ['allied', 'dependent'].includes(this.factions.getStance(id) ?? ''),
            priceFn: (type: any) => this.market.marketPrice(type) ?? 0,
            specialtyFn: (id: any) => FACTION_SPECIALTY[id] ? { type: FACTION_SPECIALTY[id], count: CARAVAN_SPECIALTY_COUNT } : null,
            isNightFn: () => this.dayNight.isNight(),
            lampCoverageFn: (id: any) => this.getRouteLampCoverage(id), // 灯网沿商路覆盖 → 削减遇袭概率
            creditFn: (amount: any) => this.creditCounter(Math.round(amount * (1 + this.getCaravanBonus()))),
            spendFn: (amount: any) => this.spend(amount),
            deliverFn: (id: any, cargo: any) => this.deliverCargo(cargo),
        });
        this.endgame = new Endgame({
            emitter: this.events,
            getFactions: () => this.factions.list().map((f: any) => f.id),
            getRelation: (id: any) => this.factions.getStance(id),
            isFactionMerged: (id: any) => this.factions.getStance(id) === 'merged',
            getDay: () => 1 + this.elapsed / (this.dayNight.dayLength + this.dayNight.nightLength),
            trySpendResources: (cost: any) => this.trySpendResources(cost),
            // 遗物实体接线：只允许收集地图上真实摆放且未入龛的遗物
            canCollectRelic: (id: any) => Object.prototype.hasOwnProperty.call(RELIC_SPOTS, id) && !this.endgame.relics.has(id),
            config: { secondsPerDay: this.dayNight.dayLength + this.dayNight.nightLength },
        });
        // 灯网与夜袭（第三波扩展）
        this.lampNetwork = new LampNetwork({ emitter: this.events });
        this.raidWaves = new RaidWaves({ emitter: this.events });
        // 声望 / 补给卡 / 祖灵大招（第四波扩展）
        this.prestige = new Prestige({ emitter: this.events });
        this.pendingEvents = []; // 邻营待办事件（跨天 roll）
        this.coupons = { beltFree: 0, guardVouchers: 0 }; // 折扣券/护卫券存量
        this.buffs = {}; // 限时修饰 {gatherUntilDay, gatherMult, cookHasteDay, nightwatchDay, nightEaseDay}
        this.powers = {}; // 大招当夜标记 {blizzardDay, militiaDay}
        this.permaDefense = 0; // 石垒图纸永久夜防
        this.corralDeer = []; // 栏内驯鹿 [{id, ageDays}]
        this.nextDeerId = 1;
        this.berryBushes = Object.fromEntries(BERRY_BUSHES.map((b: any) => [b.id, { ready: true, regrowDay: 0 }]));
        this.deepFishing = Object.fromEntries(DEEP_FISHING_RULES.holes.map((_: {x:number;z:number}, i: number) => [`hole-${i}`, { stock: DEEP_FISHING_RULES.stock }]));
        this.seedCode = randomSeed(); // 新开局随机种子；读档时覆盖/派生
        this.sieges = {}; // 围困维持开关 { factionId: true }
        this.milestones = {}; // 里程碑时间轴 { 事件: 达成日 }
        // 声望事件桥：经营高权重、军事低权重（数值见 PRESTIGE_RULES.gains）
        const G = PRESTIGE_RULES.gains;
        this.events.on('sold', () => this.gainPrestige(G.sell, 'sell'));
        this.events.on('cook-end', () => this.gainPrestige(G.cook, 'cook'));
        this.events.on('worker-delivery', () => this.gainPrestige(G.workerDelivery, 'worker'));
        this.events.on('faction-gift', () => { this.gainPrestige(G.gift, 'gift'); this.stats.gifts++; });
        this.events.on('raid-night', (r: any) => {
            if (r.repelled && r.strength > 0)
                this.gainPrestige(G.raidRepelled, 'raid');
            if (r.repelled && r.waves.some((w: any) => /报复|复仇/.test(w.source)))
                this.stats.revengeRepelled++; // 章节：击退报复夜袭
        });
        this.events.on('barter', () => { this.stats.barters++; });
        this.events.on('tribute', () => { this.stats.tributes++; });
        // 商队抵达：贸易额累计进收购路径 + 声望
        this.events.on('caravan-arrived', (p: any) => {
            if (p.earnings > 0) {
                this.annexation.recordTrade(p.factionId, p.earnings);
                this.gainPrestige(G.caravan, 'caravan');
                this.stats.caravanRuns++;
            }
        });
        // Factions 档位 → Annexation 结盟标志同步（收购/围困互斥判定的桥梁；军事终局中模块自行拒绝变更）
        this.events.on('faction-stance', (p: any) => {
            this.annexation.setAlliance(p.id, ['allied', 'dependent'].includes(p.stance));
        });
        // 吞并完成：结算战利品
        this.events.on('annex-complete', (p: any) => this.finalizeAnnex(p.factionId, p.path));
        // 占领期夜间反扑波次（夜袭事件模拟）：强度 8 + 档次×6，超过留守兵力则重置倒计时
        this.events.on('daynight-phase', (p: any) => {
            if (p.phase !== 'night')
                return;
            for (const f of this.annexation.factions.values()) {
                if (!f.occupation)
                    continue;
                f.occupation.garrison = Math.max(f.occupation.garrison, this.getDefense(p.day));
                this.annexation.onCounterWave(f.id, COUNTER_WAVE_BASE + f.strength * COUNTER_WAVE_PER_TIER);
            }
            this.resolveNightRaid(p.day); // 夜袭自动结算（狼群/敌对斥候/报复预告/终局联合夜袭）
        });
        // 报复预告：关系跌破敌对线 → 2 夜后报复波次
        this.events.on('faction-stance', (p: any) => {
            if (p.stance !== 'hostile')
                return;
            const tier = this.annexation.factions.get(p.id)?.strength ?? 3;
            const name = this.factions.list().find((f: any) => f.id === p.id)?.name ?? p.id;
            this.dayNight.scheduleThreat(this.dayNight.getDay() + REVENGE_STANCE_DELAY, { source: `${name}报复`, strength: REVENGE_BASE + tier * REVENGE_PER_TIER });
        });
        // 终局公开倒计时启动时：全图势力按关系表态
        this.events.on('endgame-countdown-start', () => {
            const rel: { [key: string]: any; } = {};
            for (const f of this.factions.list())
                rel[f.id] = this.factions.getRelationship(f.id);
            this.endgame.onWorldReaction(rel);
        });
        this.events.on('endgame-final-assault', (assault: any) => this.resolveNightRaid(this.dayNight.getDay(), assault));
        // 里程碑时间轴：升代 / 首次吞并 / 胜利
        this.events.on('era-upgraded', (p: any) => { if (!p.factionId)
            this.milestones[`era${p.era}Day`] ??= this.dayNight.getDay(); });
        this.events.on('endgame-victory', () => { this.milestones.victoryDay ??= this.dayNight.getDay(); this.changed('victory'); });
        // 新的一天：市价隔夜回归、关系自然衰减、升代施工推进一日、围困扣维持费、朝贡上缴
        this.events.on('daynight-day', () => {
            this.market.endOfDay();
            this.factions.decay(1);
            for (const [id, active] of Object.entries(this.sieges)) {
                if (!active || this.factions.getStance(id) === 'merged') {
                    this.sieges[id] = false;
                    continue;
                }
                if (!this.spend(SIEGE_DAILY_COST)) {
                    this.sieges[id] = false;
                    this.aiCamps.get(id)?.setBesieged(false);
                    this.events.emit('siege-ended', { id, reason: 'cost' });
                }
            }
            for (const f of this.factions.list()) {
                const t = this.factions.getTribute(f.id);
                const camp = this.aiCamps.get(f.id);
                if (!t?.active || !camp)
                    continue;
                const cut = Math.floor(camp.cash * t.rate);
                if (cut > 0) {
                    camp.cash -= cut;
                    this.creditCounter(cut);
                    this.events.emit('tribute-paid', { id: f.id, amount: cut });
                }
            }
            // 遗物被动日产出：现金进柜台托管，资源入仓（上限内，溢出折现）
            for (const [k, v] of Object.entries(this.endgame.getRelicIncome())) {
                if (k === 'cash')
                    this.creditCounter(v);
                else
                    this.deliverCargo({ type: k, count: v });
            }
            // 邻营日常外交事件：按天播种（确定性），逐营 roll 进待办，过期清理
            const day = this.dayNight.getDay(), rng = seededRandom(DAILY_EVENT_SEED + day);
            for (const camp of this.aiCamps.list()) {
                if (this.factions.getStance(camp.factionId) === 'merged')
                    continue;
                const ev = camp.rollDailyEvent(rng);
                if (ev)
                    this.pendingEvents.push({ ...ev, uid: `ev-${day}-${camp.factionId}`, expiresDay: day + 1 });
            }
            this.pendingEvents = this.pendingEvents.filter((e: any) => e.expiresDay >= day).slice(-EVENT_MAX);
            // 驯鹿围栏：按天播种概率吸引野鹿入栏；栏内驯鹿逐日增肥
            if (this.camp.purchases.corral) {
                if (this.corralDeer.length < CORRAL_RULES.maxDeer && rng() < CORRAL_RULES.attractChance)
                    this.corralDeer.push({ id: this.nextDeerId++, ageDays: 0 });
                for (const d of this.corralDeer)
                    d.ageDays++;
            }
            // 温室种植箱：耗木换食（没木停产）；灯网 Lv≥2 补光增产 +50%
            if (this.camp.purchases.greenhouse) {
                const out = Math.round(GREENHOUSE_RULES.cookedPerDay * (this.lampNetwork.getNetworkLevel() >= GREENHOUSE_RULES.lampLevelBoost ? 1.5 : 1));
                if (this.camp.stock.cooked + out > BALANCE.maxStock) {
                    this.events.emit('greenhouse-halt', { day, reason: 'stock' });
                }
                else if (this.camp.stock.wood >= GREENHOUSE_RULES.woodPerDay) {
                    this.camp.stock.wood -= GREENHOUSE_RULES.woodPerDay;
                    this.camp.stock.cooked += out;
                }
                else
                    this.events.emit('greenhouse-halt', { day, reason: 'wood' });
            }
            // 鱼陷阱：每陷阱每天黎明产鲜鱼 ×3 入仓
            if (this.camp.fishtraps > 0)
                this.camp.stock.fish = Math.min(BALANCE.maxStock, this.camp.stock.fish + this.camp.fishtraps * FISHTRAP_RULES.fishPerDay);
            // 雪莓丛枯萎期满再生
            for (const b of Object.values(this.berryBushes))
                if (!b.ready && day >= b.regrowDay)
                    b.ready = true;
            this.changed('daynight', { day });
        });
        this.restore(data);
    }
    get capacity() { return this.backpackUpgraded ? BALANCE.upgradedCapacity : BALANCE.capacity; }
    get reservedSlots() { return this.cooking?.destination === 'backpack' ? 1 : 0; }
    get freeSlots() { return Math.max(0, this.capacity - this.inventory.length - this.reservedSlots); }
    count(type: any) { return this.inventory.reduce((n: any, item: any) => n + (item.type === type ? 1 : 0), 0); }
    changed(type: string = 'state', payload: any = null) { this.events.emit(type, payload); this.events.emit('change'); }
    add(type: any, { collected = false }: { collected?: boolean; [key: string]: any; } = {}) {
        if (!validResource(type) || this.freeSlots < 1)
            return null;
        const item: { id: number; type: any; [key: string]: any; } = { id: this.nextId++, type };
        this.inventory.push(item);
        if (collected && Object.prototype.hasOwnProperty.call(this.stats, type))
            this.stats[type]++;
        this.changed('inventory', { kind: 'add', item });
        return item;
    }
    remove(type: any) {
        const index = findLastIndex(this.inventory, (item: any) => item.type === type);
        if (index < 0)
            return null;
        const [item] = this.inventory.splice(index, 1);
        this.changed('inventory', { kind: 'remove', item });
        return item;
    }
    /** Explicit player-confirmed escape hatch only; never called by automatic systems. */
    discardRaw() {
        if (this.freeSlots > 0 || !this.count('raw'))
            return null;
        const item = this.remove('raw');
        this.changed('discard', { item });
        return item;
    }
    spend(amount: any) {
        if (!Number.isSafeInteger(amount) || amount < 0 || this.cash < amount)
            return false;
        this.cash -= amount;
        this.changed('cash', -amount);
        return true;
    }
    credit(amount: any) {
        if (!Number.isSafeInteger(amount) || amount < 0)
            return false;
        const accepted = Math.min(amount, 99999999 - this.cash);
        this.cash += accepted;
        this.stats.earned = Math.min(1e12, this.stats.earned + accepted);
        this.changed('cash', accepted);
        return true;
    }
    /** Sales create a saved cash escrow on the counter, not an untracked animation. */
    sellOne(source: string = 'backpack') {
        if (!['backpack', 'staff'].includes(source))
            return null;
        const seller = this.camp.staff.seller;
        if (source === 'staff' && (!seller.hired || !seller.enabled || !seller.cargo?.count))
            return null;
        if (source === 'staff' && !STAFF_RULES.goods.includes(seller.cargo.type))
            return null;
        const type = source === 'staff' ? seller.cargo.type : ['cookedFish', 'cooked', 'fish', 'wood', 'berry'].find((t: string) => this.count(t));
        if (!type)
            return null;
        // 市场接线：成交价 = 当前市价取整（市价无漂移时恒等于 Balance 原价，钉死在集成测试里）；
        // 玩家自营柜台不收手续费（feeTier 留给未来买入侧），成交后市价按 market.sell 规则漂移。
        const quoted = this.market.marketPrice(type);
        const value = Math.max(1, Math.round(quoted ?? RESOURCE[type].value));
        if (this.counterCash > 99999999 - value)
            return null;
        // Commit item removal and escrow before emitting events to avoid reentrant sales.
        let item;
        if (source === 'staff') {
            item = { type };
            if (--seller.cargo.count === 0)
                seller.cargo = null;
        }
        else {
            const index = findLastIndex(this.inventory, (entry: any) => entry.type === type);
            [item] = this.inventory.splice(index, 1);
        }
        this.counterCash += value;
        this.stats.sold++;
        this.stats.salesValue += value;
        this.market.sell(type, 1);
        if (source === 'backpack')
            this.changed('inventory', { kind: 'remove', item });
        this.changed('sold', { item, value, source });
        return { item, value, source };
    }
    hireStaff(role: any) {
        if (!Object.prototype.hasOwnProperty.call(STAFF_ROLES, role))
            return false;
        const worker = this.camp.staff[role], config = STAFF_ROLES[role];
        if (worker.hired || this.cash < config.cost)
            return false;
        worker.hired = true;
        worker.enabled = true;
        worker.status = role === 'seller' ? 'fetching' : 'waiting-cash';
        this.spend(config.cost);
        this.changed('staff-hired', { role });
        return true;
    }
    setStaffEnabled(role: any, enabled: any) {
        if (!Object.prototype.hasOwnProperty.call(STAFF_ROLES, role) || typeof enabled !== 'boolean')
            return false;
        const worker = this.camp.staff[role];
        if (!worker.hired)
            return false;
        worker.enabled = enabled;
        worker.status = !enabled ? 'paused' : role === 'cashier' ? 'waiting-cash' : worker.cargo ? 'delivering' : 'fetching';
        this.changed('staff-status');
        return true;
    }
    setStaffReserve(count: any) {
        if (!Number.isSafeInteger(count) || count < 0 || count > BALANCE.maxStock)
            return false;
        this.camp.staff.reserve = count;
        this.changed('staff-status');
        return true;
    }
    /** 势力送礼：扣 $50、关系 +10（性格加成在 Factions 内折算）。 */
    giftFaction(id: any) {
        if (!this.factions.list().some((f: any) => f.id === id) || this.factions.getStance(id) === 'merged')
            return false;
        if (!this.spend(GIFT_COST))
            return false;
        if (!this.factions.gift(id, GIFT_RELATION)) {
            this.credit(GIFT_COST);
            return false;
        }
        this.changed('faction-gift', { id });
        return true;
    }
    /** 时代门槛的“前置建筑”折算（可调）：现有购置映射为伪建筑计数；未来建筑（贸易站/灯网/石墙/哨塔）暂计 0。 */
    getBuildingCounts() {
        const p = this.camp.purchases;
        return { warehouse: p.hunters && p.woodcutters ? 1 : 0,
            belt: (p.rawBelt ? 1 : 0) + (p.woodBelt ? 1 : 0),
            tradePost: p.tradePost ? 1 : 0, lampline: this.lampNetwork.hasLamps() ? 1 : 0,
            stoneWall: p.stoneWall ? 1 : 0, watchPost: p.watchPost ? 1 : 0 };
    }
    /** 升代判定输入：门槛“木材”按可支配总量折算 = 料仓 + 燃料垫 + 背包（料仓上限 180 < 时代 2 门槛 200）。 */
    getEraUpgradeState() {
        return { cash: this.cash,
            camp: { stock: { wood: this.camp.stock.wood + this.camp.feed.wood + this.count('wood') } },
            buildings: this.getBuildingCounts() };
    }
    canUpgradeEra() { return this.ages.canUpgrade(this.getEraUpgradeState()); }
    startEraUpgrade() {
        const ok = this.ages.startUpgrade(this.getEraUpgradeState());
        if (ok)
            this.changed('state');
        return ok;
    }
    /** 地标二选一：落选地标归时代最高的未合并 AI 营地（吞并它可夺回）。 */
    chooseLandmark(era: any, choice: any) {
        const rival = this.aiCamps.list().filter((c: any) => this.factions.getStance(c.factionId) !== 'merged')
            .sort((a: any, b: any) => b.era - a.era)[0];
        return this.ages.chooseLandmark(era, choice, rival?.factionId ?? null);
    }
    /** 柜台托管入账（商队收益/战利品现金/朝贡共用 escrow 通道）。 */
    creditCounter(amount: any) {
        if (!Number.isFinite(amount) || amount <= 0)
            return 0;
        const accepted = Math.min(Math.floor(amount), 99999999 - this.counterCash);
        if (accepted > 0) {
            this.counterCash += accepted;
            this.changed('counter', accepted);
        }
        return accepted;
    }
    /** Store deliveries; convert overflow and goods without a stock slot into counter cash. */
    deliverCargo(cargo: any) {
        if (!cargo || !Number.isFinite(cargo.count) || cargo.count <= 0)
            return;
        const count = Math.floor(cargo.count);
        let accepted = 0;
        if (Object.prototype.hasOwnProperty.call(this.camp.stock, cargo.type)) {
            accepted = Math.min(BALANCE.maxStock - this.camp.stock[cargo.type], count);
            this.camp.stock[cargo.type] += accepted;
        }
        const price = this.market.marketPrice(cargo.type) ?? RESOURCE[cargo.type]?.tradeValue;
        if (price && count > accepted)
            this.creditCounter(Math.round(price * (count - accepted)));
        this.changed('camp');
    }
    /** 玩家距某势力门口的距离（突袭/总攻校验用）。 */
    distanceToGate(id: any) {
        const gate = AI_CAMPS[id]?.gate;
        return gate ? Math.hypot(this.position.x - gate.x, this.position.z - gate.z) : Infinity;
    }
    declareWar(id: any) {
        const progress = this.annexation.getProgress(id);
        const stance = this.factions.getStance(id);
        if (!progress || stance === 'merged' || stance === 'hostile' || progress.assault.phase !== 'none')
            return false;
        this.factions.betray(id);
        this.factions.setStance(id, 'hostile');
        this.changed('war', { id });
        return true;
    }
    /** 围困开关：需敌对且未合并；维持费每日 $40，断供自动解除。 */
    toggleSiege(id: any) {
        const prog = this.annexation.getProgress(id);
        if (!prog || prog.status === 'annexed')
            return false;
        if (this.sieges[id]) {
            this.sieges[id] = false;
            this.aiCamps.get(id)?.setBesieged(false);
            this.changed('siege', { id, active: false });
            return true;
        }
        if (this.factions.getStance(id) !== 'hostile')
            return false;
        this.sieges[id] = true;
        this.aiCamps.get(id)?.setBesieged(true);
        this.changed('siege', { id, active: true });
        return true;
    }
    /** 每帧围困推进：切断 1 个资源点（简化），朝贡契约额外加压；立场转结盟/吞并自动停围。 */
    tickSieges(dt: any) {
        for (const [id, active] of Object.entries(this.sieges)) {
            if (!active)
                continue;
            const tribute = this.factions.getTribute(id)?.active === true;
            if (!this.annexation.applySiegeTick(id, dt, { resourcePointsCut: 1, tributeActive: tribute })) {
                this.sieges[id] = false;
                this.aiCamps.get(id)?.setBesieged(false);
            }
        }
    }
    /** 签朝贡契约：围困压力 ≥ 50 且未签约。 */
    signTribute(id: any) {
        const prog = this.annexation.getProgress(id);
        if (!prog || prog.status === 'annexed' || prog.siege.pressure < TRIBUTE_PRESSURE_MIN)
            return false;
        if (this.factions.getTribute(id)?.active)
            return false;
        const ok = this.factions.setTribute(id, TRIBUTE_RATE);
        if (ok)
            this.changed('tribute', { id });
        return ok;
    }
    /** 突袭：需敌对 + 玩家在对方门口。破防、停产，并劫掠 AI 营库存入仓。 */
    raidFaction(id: any) {
        if (this.factions.getStance(id) !== 'hostile' || this.distanceToGate(id) > RAID_GATE_RANGE)
            return false;
        const res = this.annexation.raid(id, RAID_STRENGTH);
        if (!res)
            return false;
        const loot = this.aiCamps.get(id)?.applyRaid() ?? {};
        for (const [type, count] of Object.entries(loot))
            this.deliverCargo({ type, count });
        // 被突袭方次夜复仇预告
        const name = this.factions.list().find((f: any) => f.id === id)?.name ?? id;
        this.dayNight.scheduleThreat(this.dayNight.getDay() + REVENGE_RAID_DELAY, { source: `${name}复仇`, strength: REVENGE_RAID_STRENGTH });
        this.changed('raid', { id, ...res });
        return true;
    }
    /** 总攻：需敌对 + 已购破冰橇车 + 防御 < 40（模块内校验）。 */
    assaultFaction(id: any) {
        if (this.factions.getStance(id) !== 'hostile' || !this.camp.purchases.siegeEngine || this.distanceToGate(id) > RAID_GATE_RANGE)
            return false;
        const ok = this.annexation.startAssault(id, { hasSiegeEngine: true, garrison: Math.max(25, this.getDefense()) });
        if (ok)
            this.changed('assault', { id });
        return ok;
    }
    /** 收购：结盟 + 贸易额度达标后支付巨资。 */
    buyoutFaction(id: any) {
        const prog = this.annexation.getProgress(id);
        if (!prog?.buyout.unlocked || !this.spend(prog.buyout.cost))
            return false;
        if (!this.annexation.payBuyout(id, prog.buyout.cost)) {
            this.credit(prog.buyout.cost);
            return false;
        }
        return true;
    }
    /** 开通商路：需贸易站 + 结盟；距离 = 柜台到对方营地。 */
    openRoute(id: any) {
        if (!this.camp.purchases.tradePost)
            return null;
        const campPos = AI_CAMPS[id];
        if (!campPos)
            return null;
        const distance = Math.hypot(campPos.x - STATIONS.market.x, campPos.z - STATIONS.market.z);
        const routeId = this.caravans.openRoute(id, distance);
        if (routeId)
            this.changed('route', { id });
        return routeId;
    }
    /** 派出商队：从料仓取 20 份木材载货，路线须空闲；guards 0–4 名护卫（护卫券可免佣）。 */
    dispatchCaravan(id: any, guards: number = 0) {
        const route = this.caravans.routes.find((r: any) => r.factionId === id && r.type === 'trade' && !r.caravan);
        if (!route || this.camp.stock.wood < CARAVAN_CARGO.count)
            return false;
        guards = Math.max(0, Math.min(4, Math.floor(guards) || 0));
        const voucher = guards > 0 && this.coupons.guardVouchers > 0;
        if (!this.caravans.dispatch(route.id, { ...CARAVAN_CARGO }, { guards, freeGuards: voucher }))
            return false;
        this.camp.stock.wood -= CARAVAN_CARGO.count;
        if (voucher)
            this.coupons.guardVouchers--;
        this.changed('caravan', { id });
        return true;
    }
    /** 吞并结算：签名加成（Factions）、地标夺回、战利品入仓、佃农补员。 */
    finalizeAnnex(id: any, path: any) {
        this.factions.annex(id); // 发射 faction-annexed / faction-stance merged
        const loot = this.annexation.finalize(id);
        if (!loot)
            return;
        // 吞并解锁特产卡（AoE3：吞并营地永久扩充补给手册）+ 声望
        const cardId = Object.keys(ANNEX_CARDS).find((k: string) => ANNEX_CARDS[k].faction === id);
        if (cardId)
            this.prestige.unlockCard(cardId);
        this.gainPrestige(PRESTIGE_RULES.gains.annex, 'annex');
        for (const [k, v] of Object.entries(loot.stockpile)) {
            if (k === 'cash')
                this.creditCounter(v);
            else if (Object.prototype.hasOwnProperty.call(this.camp.stock, k))
                this.camp.stock[k] = Math.min(BALANCE.maxStock, this.camp.stock[k] + v);
        }
        for (const [landmarkId, holder] of Object.entries(this.ages.lost))
            if (holder === id)
                this.ages.annexRecoverLandmark(landmarkId);
        // 佃农补员：未雇佣的岗位免费补齐（每岗 2 人，可被存档重建），余者折签约金入柜台
        let left = loot.workers;
        for (const [key, role] of [['hunters', 'raw'], ['woodcutters', 'wood']]) {
            if (left < 2 || this.camp.purchases[key])
                continue;
            this.camp.purchases[key] = true;
            left -= 2;
            const start = STATIONS[key];
            for (let i = 0; i < 2; i++)
                this.camp.workers.push({ id: `${role}-${i}`, role, cargo: 0,
                    x: start.x + (i - 0.5) * 0.7, z: start.z });
            this.changed('purchase', key);
        }
        if (left > 0)
            this.creditCounter(left * WORKER_SIGNON);
        this.sieges[id] = false;
        this.aiCamps.get(id)?.setBesieged(false);
        this.milestones.firstAnnexDay ??= this.dayNight.getDay();
        this.stats.annexed = this.factions.list().filter((f: any) => this.factions.getStance(f.id) === 'merged').length;
        this.changed('annexed', { id, path });
    }
    /** 吞并签名加成 → 采集倍率：猎户帮狩猎 +25%，渔会钓鱼 ×1.5（可调）。 */
    getGatherMultiplier(resource: any) {
        const mods = this.ages.getActiveModifiers();
        let mult = 1 + (resource === 'wood' ? mods.forestry ?? 0 : resource === 'raw' ? mods.hunting ?? 0 : 0);
        for (const m of this.factions.getInheritedModifiers()) {
            if (m.kind === 'production' && m.target === 'hunt' && resource === 'raw')
                mult *= m.multiplier;
            if (m.kind === 'exclusive' && m.target === 'lakeCenterFishing' && resource === 'fish')
                mult *= FISH_YIELD_MULT;
        }
        return mult;
    }
    /** 吞并雪口商会：商路抽税 8% 归玩家（商队收益加成，可调）。 */
    getCaravanBonus() {
        return (this.ages.getActiveModifiers().tradeRoutes ?? 0)
            + (this.factions.getInheritedModifiers().some((m: any) => m.kind === 'tax' && m.target === 'tradeRoute') ? 0.08 : 0);
    }
    /** 终局资源表支付（奇观开工）：现金 + 料仓木材 + 料仓烤肉，全额校验后扣除。 */
    trySpendResources(cost: any) {
        const cash = Math.max(0, Math.floor(cost.cash ?? 0)), wood = Math.max(0, Math.floor(cost.wood ?? 0)), cooked = Math.max(0, Math.floor(cost.cooked ?? 0));
        if (this.cash < cash || this.camp.stock.wood < wood || this.camp.stock.cooked < cooked)
            return false;
        if (cash && !this.spend(cash))
            return false;
        this.camp.stock.wood -= wood;
        this.camp.stock.cooked -= cooked;
        if (wood || cooked)
            this.changed('camp');
        return true;
    }
    startWonder() { const ok = this.endgame.startWonder(); if (ok)
        this.changed('wonder'); return ok; }
    collectRelic(id: any) {
        const ok = this.endgame.collectRelic(id);
        if (ok)
            this.changed('relic', { id });
        return ok;
    }
    /** 统一负荷池（AoE 人口帽等价物）：工人数 + 传送带数 + 鱼陷阱数，上限随时代提升。 */
    getLoadCap() { return LOAD_RULES.byEra[this.ages.getEra()] ?? LOAD_RULES.byEra[1]; }
    getLoad() {
        return this.camp.workers.length + (this.camp.purchases.rawBelt ? 1 : 0)
            + (this.camp.purchases.woodBelt ? 1 : 0) + this.camp.fishtraps;
    }
    /** 负荷校验：旧档超限保留不拆旧账，但不许再增。 */
    canAffordLoad(cost: any) { return this.getLoad() + cost <= this.getLoadCap(); }
    /** 深水冰洞钓鱼：灯网 Lv2 解锁，储量耗尽永久枯竭。 */
    catchDeepFish(id: any) {
        const hole = this.deepFishing[id];
        if (!hole || hole.stock <= 0 || this.lampNetwork.getNetworkLevel() < DEEP_FISHING_RULES.lampLevel || this.freeSlots < 1)
            return false;
        hole.stock--;
        this.add('fish', { collected: true });
        this.changed('deepfish', { id, left: hole.stock });
        return true;
    }
    /** 偷猎代价：在敌对营地 poachRange 内采集，每次关系 -2（不走 insult 翻脸计数）。返回营地名或 null。 */
    checkPoaching(x: any, z: any) {
        for (const [id, camp] of Object.entries(AI_CAMPS)) {
            if (this.factions.getStance(id) !== 'hostile')
                continue;
            if (Math.hypot(camp.x - x, camp.z - z) > DEPLETION_RULES.poachRange)
                continue;
            this.factions.gift(id, DEPLETION_RULES.poachPenalty);
            this.changed('poach', { id });
            return this.factions.list().find((f: any) => f.id === id)?.name ?? id;
        }
        return null;
    }
    /** 鱼陷阱：需解锁冰湖，$60/个，上限 2 个（驻留放置），计入负荷池。 */
    buyFishtrap() {
        if (!this.unlockedPond || this.camp.fishtraps >= FISHTRAP_RULES.max
            || !this.canAffordLoad(LOAD_RULES.cost.fishtrap) || !this.spend(FISHTRAP_RULES.cost))
            return false;
        this.camp.fishtraps++;
        this.changed('fishtrap', { count: this.camp.fishtraps });
        return true;
    }
    /** 雪莓丛驻留采集：2 颗入背包，丛枯萎 2 天。 */
    harvestBerry(id: any) {
        const b = this.berryBushes[id];
        if (!b?.ready || this.freeSlots < BERRY_RULES.perHarvest)
            return false;
        b.ready = false;
        b.regrowDay = this.dayNight.getDay() + BERRY_RULES.regrowDays;
        for (let i = 0; i < BERRY_RULES.perHarvest; i++)
            this.add('berry', { collected: true });
        this.changed('berry', { id });
        return true;
    }
    /** 驯鹿增肥价值：按栏内整数天取曲线（第 1 天 $30 → 第 5 天封顶 $120）。 */
    deerValue(deer: any) { return CORRAL_RULES.valueCurve[Math.min(Math.floor(deer.ageDays), CORRAL_RULES.valueCurve.length - 1)]; }
    /** 宰杀最肥的一只：肉入料仓（增肥越多出肉越多）。 */
    slaughterDeer() {
        if (!this.camp.purchases.corral || !this.corralDeer.length)
            return null;
        const oldest = this.corralDeer.reduce((a: any, b: any) => (b.ageDays > a.ageDays ? b : a));
        const idx = Math.min(Math.floor(oldest.ageDays), CORRAL_RULES.meatCurve.length - 1);
        const meat = CORRAL_RULES.meatCurve[idx], value = CORRAL_RULES.valueCurve[idx];
        if (this.camp.stock.raw + meat > BALANCE.maxStock)
            return null;
        this.corralDeer = this.corralDeer.filter((d: any) => d !== oldest);
        this.camp.stock.raw += meat;
        this.stats.deerSlaughtered++;
        this.changed('deer', { action: 'slaughter', meat, value });
        return { meat, value };
    }
    /** 投喂 1 颗雪莓：全栏加速 0.5 天增肥。 */
    feedBerry() {
        if (!this.camp.purchases.corral || !this.corralDeer.length || !this.count('berry'))
            return false;
        this.remove('berry');
        for (const d of this.corralDeer)
            d.ageDays += CORRAL_RULES.berryBoostDays;
        this.changed('deer', { action: 'feed' });
        return true;
    }
    /** 购买并放置下一根灯柱（灯位表顺序放置，$40/根）。 */
    buyLamp() {
        const slot = LAMP_SLOTS[this.lampNetwork.lamps.length];
        if (!slot || !this.spend(LAMP_COST))
            return false;
        this.lampNetwork.addLamp(slot.x, slot.z);
        this.changed('lamp', { count: this.lampNetwork.lamps.length });
        return true;
    }
    /** 大丰收/丰收祈祷的采集倍率（按游戏日生效，过期自动失效）。 */
    getGatherBuffFactor() {
        const day = this.dayNight.getDay();
        return (this.buffs.gatherUntilDay ?? 0) >= day ? (this.buffs.gatherMult ?? 1) : 1;
    }
    gainPrestige(amount: any, reason: any) {
        return this.prestige.gain(amount * (1 + (this.ages.getActiveModifiers().prestige ?? 0)), reason);
    }
    /** 加工提速卡：当天烤制耗时 ÷1.5。 */
    getCookTime() {
        const haste = this.buffs.cookHasteDay === this.dayNight.getDay() ? 1.5 : 1;
        return BALANCE.cookTime / haste / (1 + (this.ages.getActiveModifiers().cooking ?? 0));
    }
    /** 呼叫补给卡：声望扣点在 Prestige 内完成，payload 在此落地。返回卡片名或 null。 */
    callSupplyCard(id: any) {
        const call = this.prestige.callCard(id);
        if (!call)
            return null;
        const card = this.prestige.cardList().find((c: any) => c.id === call.cardId);
        this.applySupplyCard(call.payload);
        this.changed('supply', { id: call.cardId, cost: call.cost });
        return card?.name ?? call.cardId;
    }
    /** 补给 payload 落地（全部即时结算，限时修饰按游戏日记录）。 */
    applySupplyCard(p: any) {
        const day = this.dayNight.getDay();
        if (p.stock)
            for (const [k, v] of Object.entries(p.stock))
                if (Object.prototype.hasOwnProperty.call(this.camp.stock, k))
                    this.camp.stock[k] = Math.min(BALANCE.maxStock, this.camp.stock[k] + v);
        if (p.fish)
            this.deliverCargo({ type: 'fish', count: p.fish });
        if (p.counter)
            this.creditCounter(p.counter);
        if (p.feedWood) {
            const reserved = this.camp.transit.filter((item: any) => item.type === 'wood').length;
            this.camp.feed.wood = Math.min(BALANCE.maxFeed - reserved, this.camp.feed.wood + p.feedWood);
        }
        if (p.couponBelt)
            this.coupons.beltFree += p.couponBelt;
        if (p.couponGuards)
            this.coupons.guardVouchers += p.couponGuards;
        if (p.cookHaste)
            this.buffs.cookHasteDay = day;
        if (p.rushCaravans)
            for (const r of this.caravans.routes)
                if (r.caravan && r.caravan.phase !== 'selling')
                    r.caravan.progress = Math.min(0.99, r.caravan.progress + p.rushCaravans);
        if (p.envoyGift)
            for (const f of this.factions.list()) {
                const st = this.factions.getStance(f.id);
                if (st !== 'hostile' && st !== 'merged')
                    this.factions.gift(f.id, p.envoyGift);
            }
        if (p.nightwatch)
            this.buffs.nightwatchDay = this.nextNightDay();
        if (p.gatherBuff) {
            this.buffs.gatherMult = p.gatherBuff.mult;
            this.buffs.gatherUntilDay = day + p.gatherBuff.days - 1;
        }
        if (p.marketReset)
            for (let i = 0; i < 40; i++)
                this.market.endOfDay(); // 市价全部回归基准
        if (p.nightEase)
            this.buffs.nightEaseDay = this.nextNightDay();
        if (p.permaDefense)
            this.permaDefense += p.permaDefense;
    }
    /** 祖灵大招：首次免费，复用 ×1.5 递增；暴风雪每晚限一次。 */
    usePower(id: any) {
        const day = this.dayNight.getDay(), night = this.nextNightDay();
        if (id === 'blizzard' && this.powers.blizzardDay === night)
            return null;
        const use = this.prestige.usePower(id);
        if (!use)
            return null;
        if (id === 'blizzard')
            this.powers.blizzardDay = night;
        if (id === 'militia')
            this.powers.militiaDay = night;
        if (id === 'harvest') {
            this.buffs.gatherMult = 2;
            this.buffs.gatherUntilDay = day + 1;
        } // 今明两日 ×2
        this.changed('power', { id });
        return use;
    }
    /** 邻营待办·接受：求援送资源换关系+声望+报酬；勒索付保护费；通商邀约限时高价出货（计收购额度）。 */
    acceptEvent(uid: any) {
        const i = this.pendingEvents.findIndex((e: any) => e.uid === uid);
        if (i < 0)
            return false;
        const ev = this.pendingEvents[i];
        const ledger = this.aiCamps.get(ev.factionId);
        if (this.factions.getStance(ev.factionId) === 'merged' || !ledger) {
            this.pendingEvents.splice(i, 1);
            return false;
        }
        let ok = false;
        if (ev.type === 'request') {
            if (!Object.prototype.hasOwnProperty.call(this.camp.stock, ev.resource) || this.camp.stock[ev.resource] < ev.amount)
                return false;
            this.camp.stock[ev.resource] -= ev.amount;
            if (Object.prototype.hasOwnProperty.call(ledger.stock, ev.resource))
                ledger.stock[ev.resource] = Math.min(ledger.tune.maxStock, ledger.stock[ev.resource] + ev.amount);
            this.factions.completeQuest(ev.factionId); // +15 关系
            this.gainPrestige(PRESTIGE_RULES.gains.quest, 'quest');
            this.creditCounter(ev.reward);
            ok = true;
        }
        else if (ev.type === 'extort') {
            if (!this.spend(ev.amount))
                return false;
            this.factions.gift(ev.factionId, EVENT_ACCEPT_RELATION.extort);
            ledger.cash = Math.min(99999999, ledger.cash + ev.amount);
            ok = true;
        }
        else if (ev.type === 'trade-offer') {
            const offer = ev.offer;
            if (!offer || !Object.prototype.hasOwnProperty.call(this.camp.stock, offer.resource) || this.camp.stock[offer.resource] < offer.amount)
                return false;
            this.camp.stock[offer.resource] -= offer.amount;
            const total = offer.unitPrice * offer.amount;
            if (Object.prototype.hasOwnProperty.call(ledger.stock, offer.resource))
                ledger.stock[offer.resource] = Math.min(ledger.tune.maxStock, ledger.stock[offer.resource] + offer.amount);
            ledger.cash = Math.max(0, ledger.cash - total);
            this.creditCounter(total);
            this.annexation.recordTrade(ev.factionId, total);
            this.factions.gift(ev.factionId, EVENT_ACCEPT_RELATION['trade-offer']);
            ok = true;
        }
        if (!ok)
            return false;
        this.pendingEvents.splice(i, 1);
        this.changed('camp-event', { uid, accepted: true });
        return true;
    }
    /** 邻营待办·拒绝：求援拒绝扣关系（可调表），其余无副作用。 */
    rejectEvent(uid: any) {
        const i = this.pendingEvents.findIndex((e: any) => e.uid === uid);
        if (i < 0)
            return false;
        const [ev] = this.pendingEvents.splice(i, 1);
        const penalty = EVENT_REJECT_PENALTY[ev.type] ?? 0;
        if (penalty)
            this.factions.gift(ev.factionId, penalty);
        this.changed('camp-event', { uid, accepted: false });
        return true;
    }
    /** 互市·卖给对方需求单第一项（结盟/依附限定）：料仓出货，对方溢价收，计入收购额度。 */
    sellToDemand(id: any) {
        if (!['allied', 'dependent'].includes(this.factions.getStance(id) ?? ''))
            return false;
        const ledger = this.aiCamps.get(id);
        if (!ledger)
            return false;
        const d = ledger.getDemands()[0];
        if (!d)
            return false;
        if (!Object.prototype.hasOwnProperty.call(this.camp.stock, d.resource) || this.camp.stock[d.resource] < d.amount)
            return false;
        this.camp.stock[d.resource] -= d.amount;
        ledger.stock[d.resource] = Math.min(ledger.tune.maxStock, ledger.stock[d.resource] + d.amount);
        const total = d.unitPrice * d.amount;
        ledger.cash = Math.max(0, ledger.cash - total);
        this.creditCounter(total);
        this.annexation.recordTrade(id, total);
        this.changed('barter', { id, kind: 'sell', total });
        return true;
    }
    /** 互市·买对方报价单第一项（特产折上折）：现金支付，料仓收货（需仓位）。 */
    buyFromOffer(id: any) {
        if (!['allied', 'dependent'].includes(this.factions.getStance(id) ?? ''))
            return false;
        const ledger = this.aiCamps.get(id);
        if (!ledger)
            return false;
        const o = ledger.getOffers()[0];
        if (!o)
            return false;
        if (!Object.prototype.hasOwnProperty.call(this.camp.stock, o.resource))
            return false;
        if (BALANCE.maxStock - this.camp.stock[o.resource] < o.amount)
            return false;
        const total = o.unitPrice * o.amount;
        if (!this.spend(total))
            return false;
        this.camp.stock[o.resource] += o.amount;
        ledger.stock[o.resource] -= o.amount;
        ledger.cash = Math.min(99999999, ledger.cash + total);
        this.changed('barter', { id, kind: 'buy', total });
        return true;
    }
    /** 商路灯网覆盖：柜台→对方门口 3 个采样点均值 × 网络护卫加成（可调简化模型）。 */
    getRouteLampCoverage(id: any) {
        const gate = AI_CAMPS[id]?.gate;
        if (!gate)
            return 0;
        const guard = this.lampNetwork.getBonuses().caravanGuard;
        let sum = 0;
        for (const t of [0.2, 0.5, 0.8])
            sum += this.lampNetwork.getCoverageAt(STATIONS.market.x + (gate.x - STATIONS.market.x) * t, STATIONS.market.z + (gate.z - STATIONS.market.z) * t);
        return Math.min(1, (sum / 3) * (0.5 + 0.5 * guard) + guard * 0.1);
    }
    /** 灯网采集加速：1 + gatherSpeed × 该点覆盖度（ResourceSystem/InteractionSystem 消费）。 */
    getLampGatherFactor(x: any, z: any) {
        return 1 + this.lampNetwork.getBonuses().gatherSpeed * this.lampNetwork.getCoverageAt(x, z);
    }
    nextNightDay() { return this.dayNight.getDay() + (this.dayNight.isNight() ? 1 : 0); }
    getDefense(day: number = this.dayNight.getDay()) {
        const mods = this.ages.getActiveModifiers();
        let defense = this.raidWaves.computeDefense({ workers: this.camp.workers.length,
            watchPost: this.camp.purchases.watchPost, stoneWall: this.camp.purchases.stoneWall,
            lampLevel: this.lampNetwork.getNetworkLevel() }) + this.permaDefense;
        defense *= 1 + (mods.nightDefense ?? 0) + (mods.morale ?? 0);
        if (this.buffs.nightwatchDay === day)
            defense += 6;
        if (this.powers.militiaDay === day)
            defense *= 1.5;
        return defense;
    }
    /** 夜袭自动结算：合成来袭波次 → 大招/卡券修饰 → 防御对比 → 应用奖励/损失。返回战报（无来袭则 null）。 */
    resolveNightRaid(day: any, finalAssault: any = null) {
        const threats = this.dayNight.getUpcomingThreats().filter((t: { day: any; nightsAway: number; threat: any; [key: string]: any; }) => t.nightsAway === 0);
        const hostileCamps = this.factions.list().filter((f: any) => this.factions.getStance(f.id) === 'hostile').length;
        let waves = this.raidWaves.planNight({ day, hostileCamps,
            threatMultiplier: this.endgame.getThreatMultiplier(),
            raidIntensity: this.ages.getVulnerabilityModifiers().raidIntensity,
            threats });
        if (finalAssault)
            waves = Array.from({ length: finalAssault.waveCount }, () => ({ source: '联合夜袭', strength: finalAssault.strengthPerWave }));
        // 祖灵大招·暴风雪：当夜来袭清零（每晚限一次）
        const blizzard = this.powers.blizzardDay === day;
        if (blizzard)
            waves = [];
        // 特产卡·迁徙警哨：当夜来袭 -40%
        else if (this.buffs.nightEaseDay === day)
            waves = waves.map((w: { source: any; strength: number; [key: string]: any; }) => ({ ...w, strength: Math.round(w.strength * 0.6 * 10) / 10 }));
        // 围栏在灯网覆盖外：狼群袭栏附加强度；破防则可能损失驯鹿
        const corralExposed = this.camp.purchases.corral && this.corralDeer.length > 0
            && this.lampNetwork.getCoverageAt(STATIONS.corral.x, STATIONS.corral.z) < CORRAL_RULES.coverSafe;
        if (corralExposed && !blizzard && !finalAssault)
            waves = [...waves, { source: '狼群袭栏', strength: CORRAL_RULES.wolfStrength }];
        if (this.ages.getActiveModifiers().wolfDeterrence)
            waves = waves.map((w: { source: any; strength: number; [key: string]: any; }) => /狼群/.test(w.source) ? { ...w, strength: w.strength * 0.8 } : w);
        if (!waves.length && !blizzard)
            return null;
        const defense = this.getDefense(day);
        const report = this.raidWaves.resolveNight(waves, defense, { day });
        if (finalAssault)
            report.finalAssault = true;
        if (blizzard) {
            report.rewardCash = 0;
            report.rewardWood = 0;
        } // 暴风雪夜没有战利品
        if (report.repelled) {
            this.creditCounter(report.rewardCash);
            this.camp.stock.wood = Math.min(BALANCE.maxStock, this.camp.stock.wood + report.rewardWood);
        }
        else {
            for (const k of ['wood', 'raw', 'cooked'])
                this.camp.stock[k] -= Math.min(this.camp.stock[k], Math.ceil(this.camp.stock[k] * report.stockLossPct));
            this.counterCash -= Math.min(this.counterCash, Math.ceil(this.counterCash * report.cashLossPct));
        }
        this.changed('raid-night', report);
        // 围栏暴露且防线被突破：狼群拖走最肥的一只驯鹿
        if (!report.repelled && corralExposed && this.corralDeer.length) {
            const fattest = this.corralDeer.reduce((a: any, b: any) => (b.ageDays > a.ageDays ? b : a));
            this.corralDeer = this.corralDeer.filter((d: any) => d !== fattest);
            this.changed('deer-lost', { id: fattest.id });
        }
        return report;
    }
    /** 扩展模块只读摘要（HUD 用，每次调用返回新对象）。 */
    getExtensionState() {
        return { day: this.dayNight.getDay(), phase: this.dayNight.getPhase(), isNight: this.dayNight.isNight(),
            phaseProgress: this.dayNight.getProgress(), era: this.ages.getEra(), eraName: this.ages.getEraName(),
            eraUpgrading: this.ages.isVulnerable(), landmarks: this.ages.getOwnedLandmarks(),
            factions: this.factions.list().map((f: any) => ({ id: f.id, name: f.name, personalityLabel: f.personalityLabel,
                relationship: Math.round(this.factions.getRelationship(f.id)), stance: this.factions.getStance(f.id),
                campEra: this.aiCamps.get(f.id)?.era ?? 1 })),
            endgame: { victory: this.endgame.isVictory(),
                countdown: this.endgame.countdown ? { ...this.endgame.countdown } : null,
                hegemonyDays: Math.floor(this.endgame.hegemonyDays),
                hegemonyRequired: this.endgame.config.hegemony.requiredDays,
                wonder: { ...this.endgame.wonder }, wonderCost: { ...this.endgame.config.wonder.cost },
                relics: this.endgame.relics.size, relicsTotal: Object.keys(this.endgame.config.relics.list).length,
                reactions: { ...this.endgame.reactions } },
            lamps: { count: this.lampNetwork.lamps.length, total: LAMP_SLOTS.length, ...this.lampNetwork.getBonuses() },
            threats: this.dayNight.getUpcomingThreats().map((t: { day: any; nightsAway: number; threat: any; [key: string]: any; }) => ({ nightsAway: t.nightsAway, source: t.threat?.source ?? '敌袭' })),
            raidReport: this.raidWaves.lastReport ? { ...this.raidWaves.lastReport } : null,
            prestige: { points: Math.floor(this.prestige.points), supplyCost: this.prestige.supplyCost(), calls: this.prestige.calls,
                powerUses: { ...this.prestige.powerUses } },
            pendingEvents: this.pendingEvents.map((e: any) => ({ ...e })),
            coupons: { ...this.coupons }, caravanSpeedLevel: this.caravans.speedLevel,
            load: { used: this.getLoad(), cap: this.getLoadCap() },
            seedCode: this.seedCode,
            deepFishing: Object.fromEntries(Object.entries(this.deepFishing).map(([k, v]: [string, { stock: number; [key: string]: any; }]) => [k, v.stock])),
            milestones: { ...this.milestones } };
    }
    collectCash(limit: number = 24) {
        if (!Number.isSafeInteger(limit) || limit <= 0)
            return 0;
        const amount = Math.min(limit, this.counterCash, 99999999 - this.cash);
        if (!amount)
            return 0;
        this.counterCash -= amount;
        this.credit(amount);
        this.changed('cash-collected', amount);
        return amount;
    }
    deposit(type: any, destination: string = 'feed') {
        const store = this.camp[destination];
        if (!['stock', 'feed'].includes(destination) || !validRole(type) || !this.count(type))
            return false;
        const max = destination === 'feed' ? BALANCE.maxFeed : BALANCE.maxStock;
        const inTransit = destination === 'feed' ? this.camp.transit.filter((t: any) => t.type === type).length : 0;
        if (store[type] + inTransit >= max)
            return false;
        this.remove(type);
        store[type]++;
        this.stats.deposited++;
        this.changed('deposit', { type, destination });
        return true;
    }
    withdraw(type: any, source: string = 'stock') {
        const store = this.camp[source];
        if (!['stock', 'feed'].includes(source) || !store || !Object.prototype.hasOwnProperty.call(store, type) || !store[type] || !this.freeSlots)
            return false;
        store[type]--;
        this.add(type);
        if (type === 'cooked' && source === 'stock')
            this.stats.autoCollected++;
        this.changed('withdraw', { type, source });
        return true;
    }
    canFuel(manual: boolean = false) {
        return this.camp.fuel > 0 || this.camp.feed.wood > 0 || (manual && this.count('wood') > 0);
    }
    consumeFuel(manual: any) {
        if (!this.canFuel(manual))
            return false;
        if (this.camp.fuel <= 0) {
            if (this.camp.feed.wood > 0)
                this.camp.feed.wood--;
            else
                this.remove('wood');
            this.camp.fuel = BALANCE.fuelPerWood;
            this.stats.fuelUsed++;
            this.changed('fuel', { remaining: this.camp.fuel });
        }
        this.camp.fuel--;
        return true;
    }
    startCooking(source: string = 'backpack') {
        if (this.ages.isVulnerable() || this.cooking || !['backpack', 'camp'].includes(source))
            return false;
        const manual = source === 'backpack';
        const input = manual ? (this.count('raw') ? 'raw' : this.count('fish') ? 'fish' : null)
            : this.camp.feed.raw > 0 ? 'raw' : null;
        if (!input || !this.canFuel(manual) || (!manual && this.camp.stock.cooked >= BALANCE.maxStock))
            return false;
        // Reserve first: removing fuel/input cannot let pickup steal a pending output slot.
        this.cooking = { output: input === 'raw' ? 'cooked' : 'cookedFish',
            remaining: this.getCookTime(), destination: manual ? 'backpack' : 'stock' };
        this.consumeFuel(manual);
        if (manual)
            this.remove(input);
        else
            this.camp.feed.raw--;
        this.changed('cook-start', { input, source });
        return true;
    }
    tickCooking(dt: any) {
        if (this.ages.isVulnerable() || !this.cooking || !Number.isFinite(dt) || dt <= 0)
            return false;
        if (this.cooking.destination === 'stock' && this.camp.stock.cooked >= BALANCE.maxStock)
            return false;
        this.cooking.remaining -= dt;
        if (this.cooking.remaining > 1e-8)
            return false;
        const { output, destination } = this.cooking;
        this.cooking = null;
        let item = null;
        if (destination === 'backpack') {
            item = this.add(output);
            if (!item)
                throw new Error('Cooking reservation invariant violated');
        }
        else {
            this.camp.stock.cooked++;
            this.stats.automated++;
        }
        this.stats.cooked++;
        this.changed('cook-end', { item, output, destination });
        return true;
    }
    buyPond() {
        if (this.unlockedPond || this.cash < BALANCE.pondCost)
            return false;
        this.unlockedPond = true;
        this.spend(BALANCE.pondCost);
        this.changed('pond');
        return true;
    }
    upgradeBackpack() {
        if (this.backpackUpgraded || this.cash < BALANCE.backpackCost)
            return false;
        this.backpackUpgraded = true;
        this.spend(BALANCE.backpackCost);
        this.changed('upgrade');
        return true;
    }
    purchase(key: any) {
        if (!Object.prototype.hasOwnProperty.call(PURCHASES, key) || this.camp.purchases[key])
            return false;
        if (ERA_GATED_PURCHASES[key] && this.ages.getEra() < ERA_GATED_PURCHASES[key])
            return false; // 时代门槛
        const loadCost = LOAD_RULES.cost[key] ?? 0;
        if (loadCost && !this.canAffordLoad(loadCost))
            return false; // 统一负荷池
        const free = this.coupons.beltFree > 0 && key.endsWith('Belt'); // 传送带折扣券
        if (!free && this.cash < PURCHASES[key].cost)
            return false;
        this.camp.purchases[key] = true;
        if (free)
            this.coupons.beltFree--;
        else
            this.spend(PURCHASES[key].cost);
        if (key === 'hunters' || key === 'woodcutters') {
            const role = key === 'hunters' ? 'raw' : 'wood', start = STATIONS[key];
            for (let i = 0; i < 2; i++)
                this.camp.workers.push({ id: `${role}-${i}`, role, cargo: 0,
                    x: start.x + (i - 0.5) * 0.7, z: start.z });
        }
        this.changed('purchase', key);
        return true;
    }
    snapshot() {
        return { version: SAVE_VERSION, world: { nodes: this.world.nodes.map((n: any) => ({ ...n })), drops: this.world.drops.map((d: any) => ({ ...d })) }, cash: this.cash, counterCash: this.counterCash,
            inventory: this.inventory.map((i: any) => ({ ...i })), cooking: this.cooking ? { ...this.cooking } : null,
            unlockedPond: this.unlockedPond, backpackUpgraded: this.backpackUpgraded, seedCode: this.seedCode,
            position: { ...this.position }, stats: { ...this.stats }, quest: this.quest, elapsed: this.elapsed,
            camp: { purchases: { ...this.camp.purchases }, stock: { ...this.camp.stock }, feed: { ...this.camp.feed },
                fuel: this.camp.fuel, workers: this.camp.workers.map((w: any) => ({ ...w })),
                transit: this.camp.transit.map((t: any) => ({ ...t })), beltTimers: { ...this.camp.beltTimers }, nextTransitId: this.camp.nextTransitId,
                fishtraps: this.camp.fishtraps, staff: snapshotCounterStaff(this.camp.staff) },
            extensions: { dayNight: this.dayNight.snapshot(), factions: this.factions.snapshot(),
                aiCamps: this.aiCamps.snapshot(), market: this.market.snapshot(), ages: this.ages.snapshot(),
                annexation: this.annexation.snapshot(), caravans: this.caravans.snapshot(), endgame: this.endgame.snapshot(),
                lampNetwork: this.lampNetwork.snapshot(), raidWaves: this.raidWaves.snapshot(),
                prestige: this.prestige.snapshot(),
                campaign: { sieges: { ...this.sieges }, milestones: { ...this.milestones },
                    pendingEvents: this.pendingEvents.map((e: any) => ({ ...e })),
                    coupons: { ...this.coupons }, buffs: { ...this.buffs }, powers: { ...this.powers },
                    permaDefense: this.permaDefense,
                    corralDeer: this.corralDeer.map((d: any) => ({ ...d })), nextDeerId: this.nextDeerId,
                    deepFishing: Object.fromEntries(Object.entries(this.deepFishing).map(([k, v]: [string, { stock: number; [key: string]: any; }]) => [k, { ...v }])),
                    berryBushes: Object.fromEntries(Object.entries(this.berryBushes).map(([k, v]: [string, { ready: boolean; regrowDay: number; [key: string]: any; }]) => [k, { ...v }])) } } };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || ![1, 2, 3].includes(data.version))
            return;
        // 种子码：v3 读已存种子；v1/v2 旧档从存档原文派生稳定值
        this.seedCode = typeof data.seedCode === 'string' && SEED_RE.test(data.seedCode)
            ? data.seedCode : deriveSeed(JSON.stringify(data));
        this.cash = integer(data.cash, 99999999);
        this.counterCash = integer(data.counterCash, 99999999);
        this.unlockedPond = data.unlockedPond === true;
        this.backpackUpgraded = data.backpackUpgraded === true;
        if (data.cooking && ['cooked', 'cookedFish'].includes(data.cooking.output)) {
            this.cooking = { output: data.cooking.output, remaining: Math.max(0.001, bounded(data.cooking.remaining, BALANCE.cookTime, 1)),
                destination: data.cooking.destination === 'stock' && data.cooking.output === 'cooked' ? 'stock' : 'backpack' };
        }
        this.inventory = (Array.isArray(data.inventory) ? data.inventory : []).filter((i: any) => validResource(i?.type))
            .slice(0, this.capacity - this.reservedSlots).map((i: any) => ({ id: this.nextId++, type: i.type }));
        if (Number.isFinite(data.position?.x) && Number.isFinite(data.position?.z)) {
            const b = WORLD_BOUNDS, margin = BALANCE.playerRadius + .01;
            this.position = { x: Math.max(b.minX + margin, Math.min(b.maxX - margin, data.position.x)),
                z: Math.max(b.minZ + margin, Math.min(b.maxZ - margin, data.position.z)) };
            // The actual obstacle graph resolves unsafe/locked positions in PlayerController.
        }
        for (const key of Object.keys(this.stats))
            this.stats[key] = integer(data.stats?.[key], 1e12);
        this.quest = integer(data.quest, 64);
        this.elapsed = bounded(data.elapsed, 1e12); // 64 = 章节化目标链上限冗余
        if (data.version === 1) {
            // v1 tutorial order was different. Do not replay old rewards on migration.
            this.quest = data.quest >= 4 ? 4 : integer(data.quest, 3);
            return;
        }
        if (data.world && typeof data.world === 'object') {
            const nodes = Array.isArray(data.world.nodes) ? data.world.nodes : [];
            const seen = new Set();
            for (const n of nodes.slice(0, 60)) {
                const tree = typeof n?.id === 'string' && /^tree-(?:[0-9]|1[0-9]|2[0-3])$/.test(n.id);
                const dense = typeof n?.id === 'string' && /^dtree-(?:[0-9]|1[0-5])$/.test(n.id); // 密林带 16 棵
                const rabbit = typeof n?.id === 'string' && /^rabbit-[0-7]$/.test(n.id); // 外圈猎场 8 头
                const bear = Number.isInteger(n?.id) && n.id >= 0 && n.id < 12;
                if ((!tree && !bear && !dense && !rabbit) || seen.has(n.id))
                    continue;
                seen.add(n.id);
                this.world.nodes.push({ id: n.id, hp: integer(n.hp, dense ? DEPLETION_RULES.denseHp : rabbit ? DEPLETION_RULES.rabbitHp : 3, dense ? DEPLETION_RULES.denseHp : rabbit ? DEPLETION_RULES.rabbitHp : 3), active: n.active !== false,
                    cooldown: bounded(n.cooldown, dense ? 0 : rabbit ? DEPLETION_RULES.rabbitRespawn : tree ? BALANCE.treeRespawn : BALANCE.bearRespawn),
                    x: Number.isFinite(n.x) ? n.x : 0, z: Number.isFinite(n.z) ? n.z : 0 });
            }
            const drops = Array.isArray(data.world.drops) ? data.world.drops : [];
            for (const d of drops.slice(0, BALANCE.maxDrops)) {
                if (!validResource(d?.type) || !Number.isFinite(d.x) || !Number.isFinite(d.z))
                    continue;
                this.world.drops.push({ id: this.world.drops.length + 1, type: d.type, x: Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, d.x)),
                    z: Math.max(WORLD_BOUNDS.minZ, Math.min(WORLD_BOUNDS.maxZ, d.z)), y: Math.max(.15, bounded(d.y, 4, .15)),
                    vy: Number.isFinite(d.vy) ? Math.max(-30, Math.min(5, d.vy)) : 0, age: bounded(d.age, 3600) });
            }
        }
        // v3：扩展模块子快照；v1/v2 旧档没有该字段，各模块保持初始状态兜底，不丢旧进度。
        // 各模块 restore 自带严格校验，脏数据只会被裁剪回初始态。
        if (data.version === 3) {
            const ext = data.extensions && typeof data.extensions === 'object' ? data.extensions : {};
            this.dayNight.restore(ext.dayNight);
            this.factions.restore(ext.factions);
            this.endgame.config.secondsPerDay = this.dayNight.dayLength + this.dayNight.nightLength;
            this.stats.annexed = this.factions.list().filter((f: any) => this.factions.getStance(f.id) === 'merged').length;
            this.aiCamps.restore(ext.aiCamps);
            this.market.restore(ext.market);
            this.ages.restore(ext.ages);
            this.annexation.restore(ext.annexation);
            this.caravans.restore(ext.caravans);
            this.endgame.restore(ext.endgame);
            this.lampNetwork.restore(ext.lampNetwork);
            this.raidWaves.restore(ext.raidWaves);
            // 集成态（围困开关/里程碑）：逐键白名单恢复，已吞并势力的围困自动清除
            const camp0 = ext.campaign && typeof ext.campaign === 'object' ? ext.campaign : {};
            for (const id of Object.keys(ANNEXATION_FACTIONS)) {
                if (camp0.sieges?.[id] === true && this.factions.getStance(id) === 'hostile')
                    this.sieges[id] = true;
                if (this.sieges[id])
                    this.aiCamps.get(id)?.setBesieged(true);
            }
            for (const [k, v] of Object.entries(camp0.milestones && typeof camp0.milestones === 'object' ? camp0.milestones : {}))
                if (/^(era[234]Day|firstAnnexDay|victoryDay)$/.test(k) && typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 1e6)
                    this.milestones[k] = v;
            this.prestige.restore(ext.prestige);
            // 集成态续：待办事件 / 券 / 限时修饰 / 大招当日标记 / 永久夜防（逐键白名单）
            const day = this.dayNight.getDay();
            this.pendingEvents = (Array.isArray(camp0.pendingEvents) ? camp0.pendingEvents : []).slice(0, EVENT_MAX)
                .filter((e: any) => e && typeof e.uid === 'string' && typeof e.factionId === 'string'
                && ['request', 'extort', 'trade-offer'].includes(e.type)
                && Number.isInteger(e.expiresDay) && e.expiresDay >= day)
                .map((e: any) => ({ ...e }));
            this.coupons = { beltFree: integer(camp0.coupons?.beltFree, 5), guardVouchers: integer(camp0.coupons?.guardVouchers, 10) };
            this.buffs = {};
            const b0 = camp0.buffs && typeof camp0.buffs === 'object' ? camp0.buffs : {};
            if (Number.isInteger(b0.gatherUntilDay) && b0.gatherUntilDay >= day) {
                this.buffs.gatherUntilDay = Math.min(b0.gatherUntilDay, day + 2);
                this.buffs.gatherMult = Math.max(1, Math.min(3, Number(b0.gatherMult) || 1));
            }
            if (b0.cookHasteDay === day)
                this.buffs.cookHasteDay = day;
            for (const k of ['nightwatchDay', 'nightEaseDay'])
                if (Number.isInteger(b0[k]) && b0[k] >= day && b0[k] <= day + 1)
                    this.buffs[k] = b0[k];
            this.powers = {};
            const p0 = camp0.powers && typeof camp0.powers === 'object' ? camp0.powers : {};
            for (const k of ['blizzardDay', 'militiaDay'])
                if (Number.isInteger(p0[k]) && p0[k] >= day && p0[k] <= day + 1)
                    this.powers[k] = p0[k];
            this.permaDefense = integer(camp0.permaDefense, 40);
            // 畜牧与莓丛：逐键校验恢复
            this.corralDeer = (Array.isArray(camp0.corralDeer) ? camp0.corralDeer : [])
                .filter((d: any) => Number.isInteger(d?.id) && Number.isFinite(d?.ageDays))
                .slice(0, CORRAL_RULES.maxDeer)
                .map((d: any) => ({ id: d.id, ageDays: Math.max(0, Math.min(30, d.ageDays)) }));
            this.nextDeerId = Math.max(integer(camp0.nextDeerId, 1e6, 1), 1 + Math.max(0, ...this.corralDeer.map((d: any) => d.id)));
            const bb = camp0.berryBushes && typeof camp0.berryBushes === 'object' ? camp0.berryBushes : {};
            for (const id of Object.keys(this.berryBushes)) {
                const b = bb[id];
                if (!b || typeof b !== 'object')
                    continue;
                this.berryBushes[id] = { ready: b.ready !== false,
                    regrowDay: Number.isInteger(b.regrowDay) ? Math.max(0, Math.min(b.regrowDay, day + 30)) : 0 };
            }
            const df = camp0.deepFishing && typeof camp0.deepFishing === 'object' ? camp0.deepFishing : {};
            for (const id of Object.keys(this.deepFishing))
                this.deepFishing[id] = { stock: integer(df[id]?.stock, DEEP_FISHING_RULES.stock, DEEP_FISHING_RULES.stock) };
        }
        const c = data.camp;
        if (!c || typeof c !== 'object')
            return;
        this.camp.staff = restoreCounterStaff(c.staff);
        for (const k of Object.keys(this.camp.purchases))
            this.camp.purchases[k] = c.purchases?.[k] === true;
        for (const k of Object.keys(this.camp.stock))
            this.camp.stock[k] = integer(c.stock?.[k], BALANCE.maxStock - (k === 'cooked' && this.cooking?.destination === 'stock' ? 1 : 0));
        for (const k of Object.keys(this.camp.feed))
            this.camp.feed[k] = integer(c.feed?.[k], BALANCE.maxFeed);
        this.camp.fuel = integer(c.fuel, BALANCE.fuelPerWood);
        const workers = Array.isArray(c.workers) ? c.workers : [];
        for (const role of ['wood', 'raw']) {
            const key = role === 'wood' ? 'woodcutters' : 'hunters';
            if (!this.camp.purchases[key])
                continue;
            for (let i = 0; i < 2; i++) {
                const saved = workers.find((w: any) => w?.id === `${role}-${i}`) || {};
                this.camp.workers.push({ id: `${role}-${i}`, role, cargo: integer(saved.cargo, BALANCE.workerCapacity),
                    x: Number.isFinite(saved.x) ? Math.max(WORLD_BOUNDS.minX + .33, Math.min(WORLD_BOUNDS.maxX - .33, saved.x)) : STATIONS[key].x + i * 0.5,
                    z: Number.isFinite(saved.z) ? Math.max(WORLD_BOUNDS.minZ + .33, Math.min(WORLD_BOUNDS.maxZ - .33, saved.z)) : STATIONS[key].z });
            }
        }
        const transit = Array.isArray(c.transit) ? c.transit : [];
        for (const t of transit.slice(0, BALANCE.maxFeed * 2)) {
            if (!validRole(t?.type))
                continue;
            const occupied = this.camp.feed[t.type] + this.camp.transit.filter((x: any) => x.type === t.type).length;
            if (occupied >= BALANCE.maxFeed)
                continue;
            this.camp.transit.push({ id: this.camp.nextTransitId++, type: t.type, progress: bounded(t.progress, 1) });
        }
        for (const role of ['wood', 'raw'])
            this.camp.beltTimers[role] = bounded(c.beltTimers?.[role], BALANCE.beltInterval);
        this.camp.fishtraps = integer(c.fishtraps, FISHTRAP_RULES.max);
    }
}
