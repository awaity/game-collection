/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
/** 吞并三路径状态机：围困绞杀 / 经济收购 / 武力远征。
 * 纯数据 + 纯函数，不依赖 Three.js/DOM，可被 node:test 直接测试。
 * 数值全部表驱动（可调）。事件经构造注入的 emitter 发射，缺省静默。
 * 每条路径并行推进、任一达成即吞并；结盟与武力互斥（偷袭即破盟）。
 */
/** 可调：路径 A 围困绞杀 */
const SIEGE = freeze({
    pressurePerPoint: 4, // 每切断一个资源点的压力增速（/秒）
    pressurePerTribute: 2, // 朝贡契约生效时的额外压力增速（/秒）
    readinessDecay: 0.6, // 战备值基础衰减（/秒）
    readinessPressureFactor: 0.03, // 当前压力对战备衰减的放大系数
    surrenderPressure: 80, // 触发投降所需压力下限
});
/** 可调：路径 C 突袭 / 总攻 / 占领 */
const RAID = freeze({
    defenseDamage: 0.5, // 突袭强度 → 防御削减换算比
    haltPerStrength: 0.2, // 突袭强度 → 停产分钟数
    maxHaltPerRaid: 30, // 单次突袭停产上限（分钟）
    maxHaltTotal: 120, // 累计停产上限（分钟）
});
const ASSAULT = freeze({
    defenseThreshold: 40, // 发起总攻要求敌方防御低于此值
    duration: 45, // 总攻交战时长（秒）
    defaultGarrison: 25, // 占领期默认留守兵力（反扑波次判定线）
});
const OCCUPATION_SECONDS = 600; // 可调：占领营火倒计时默认 10 分钟
/** 可调：势力强度档（1 最弱 ~ 5 最强）→ 收购额度 / 收购价 / 初始防御 / 战利品 */
const TIER = freeze({
    1: freeze({ acquisition: 240, buyoutCost: 480, defense: 55, workers: 2, stockpile: freeze({ wood: 40, raw: 20, cooked: 10, cash: 60 }) }),
    2: freeze({ acquisition: 360, buyoutCost: 720, defense: 65, workers: 3, stockpile: freeze({ wood: 60, raw: 30, cooked: 14, cash: 90 }) }),
    3: freeze({ acquisition: 520, buyoutCost: 1050, defense: 75, workers: 4, stockpile: freeze({ wood: 80, raw: 40, cooked: 18, cash: 130 }) }),
    4: freeze({ acquisition: 700, buyoutCost: 1400, defense: 85, workers: 5, stockpile: freeze({ wood: 110, raw: 55, cooked: 24, cash: 180 }) }),
    5: freeze({ acquisition: 950, buyoutCost: 1900, defense: 95, workers: 7, stockpile: freeze({ wood: 150, raw: 75, cooked: 32, cash: 260 }) }),
});
/** 可调：默认势力名单。modifiers / landmark 为数据 id，供 Factions/Ages 模块落地 */
export const DEFAULT_FACTIONS = freeze({
    nomads: freeze({ name: '游牧毡帐帮', strength: 1, modifiers: freeze(['mobile-camp']) }),
    fishers: freeze({ name: '冰湖渔会', strength: 2, modifiers: freeze(['lake-fishery']) }),
    hunters: freeze({ name: '猎户帮', strength: 3, modifiers: freeze(['hunt-yield-plus', 'bear-meat-premium']) }),
    merchants: freeze({ name: '雪口商会', strength: 3, modifiers: freeze(['toll-8']) }),
    stonekeep: freeze({ name: '石垒寨', strength: 5, modifiers: freeze(['stone-walls']), landmark: 'ice-citadel' }),
});
const bounded = (value: any, max: any, fallback: number = 0) => {
    const n = typeof value === 'number' ? value : NaN;
    return Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : fallback;
};
const positive = (value: any, fallback: any) => Number.isFinite(value) && value > 0 ? value : fallback;
export class Annexation {
    emitter: any;
    occupationSeconds: any;
    factions: Map<any, any>;
    /** @param {object} [config] factions: 势力配置表；emitter: 可选事件总线；occupationSeconds: 占领倒计时 */
    constructor({ factions = DEFAULT_FACTIONS, emitter = null, occupationSeconds = OCCUPATION_SECONDS }: any = {}) {
        this.emitter = emitter && typeof emitter.emit === 'function' ? emitter : null;
        this.occupationSeconds = positive(occupationSeconds, OCCUPATION_SECONDS);
        this.factions = new Map();
        for (const [id, def] of Object.entries(factions)) {
            if (!id || id === '__proto__')
                continue;
            this.factions.set(id, this._fresh(id, def as Record<string, unknown>));
        }
    }
    _fresh(id: any, def: { [key: string]: any; } = {}) {
        const strength = Number.isInteger(def?.strength) ? Math.max(1, Math.min(5, def.strength)) : 3;
        const tier = TIER[strength];
        return {
            id, name: typeof def?.name === 'string' ? def.name : id, strength, tier,
            landmark: typeof def?.landmark === 'string' && def.landmark ? def.landmark : null,
            modifiers: Array.isArray(def?.modifiers) ? def.modifiers.filter((m: any) => typeof m === 'string') : [],
            allied: def?.allied === true,
            annexed: false, path: null,
            siegePressure: 0, warReadiness: 100,
            acquisition: 0, buyoutUnlocked: false,
            defense: tier.defense, productionHalt: 0,
            assault: null, occupation: null,
        };
    }
    _emit(type: any, payload: any) { this.emitter?.emit(type, payload); }
    _get(id: any) { return typeof id === 'string' ? this.factions.get(id) : undefined; }
    /** 军事终局（总攻/占领）进行中，封锁其余路径 */
    _active(f: any) { return !f.annexed && !f.assault && !f.occupation; }
    _status(f: any) {
        if (f.annexed)
            return 'annexed';
        if (f.occupation)
            return 'occupying';
        if (f.assault)
            return 'assaulting';
        if (f.allied)
            return (f.acquisition > 0 || f.buyoutUnlocked) ? 'acquiring' : 'idle';
        return f.siegePressure > 0 ? 'besieging' : (f.acquisition > 0 || f.buyoutUnlocked ? 'acquiring' : 'idle');
    }
    _complete(f: any, path: any) {
        f.annexed = true;
        f.path = path;
        f.assault = null;
        f.occupation = null;
        this._emit('annex-complete', { factionId: f.id, path });
    }
    /** 外交立场钩子：结盟/破盟。军事终局与已吞并势力不可变更 */
    setAlliance(id: any, allied: any) {
        const f = this._get(id);
        if (!f || !this._active(f))
            return false;
        f.allied = allied === true;
        return true;
    }
    /** 路径 A：围困 tick。结盟与围困互斥；无切断资源点且无朝贡契约则无进展 */
    applySiegeTick(id: any, dt: any, { resourcePointsCut = 0, tributeActive = false }: { resourcePointsCut?: number; tributeActive?: boolean; [key: string]: any; } = {}) {
        const f = this._get(id);
        if (!f || !this._active(f) || f.allied)
            return false;
        if (!Number.isFinite(dt) || dt <= 0)
            return false;
        const points = Number.isFinite(resourcePointsCut) ? Math.max(0, Math.floor(resourcePointsCut)) : 0;
        if (points === 0 && !tributeActive)
            return false;
        f.siegePressure = Math.min(100, f.siegePressure + dt * (points * SIEGE.pressurePerPoint + (tributeActive ? SIEGE.pressurePerTribute : 0)));
        f.warReadiness = Math.max(0, f.warReadiness - dt * (SIEGE.readinessDecay + f.siegePressure * SIEGE.readinessPressureFactor));
        const surrendered = f.warReadiness <= 0 && f.siegePressure >= SIEGE.surrenderPressure;
        this._emit('annex-siege', { factionId: id, pressure: f.siegePressure, warReadiness: f.warReadiness, surrendered });
        if (surrendered)
            this._complete(f, 'siege');
        return true;
    }
    /** 路径 B：累计进贡/贸易额度（须结盟），达标自动解锁收购谈判 */
    recordTrade(id: any, amount: any) {
        const f = this._get(id);
        if (!f || !this._active(f) || !f.allied)
            return false;
        if (!Number.isFinite(amount) || amount <= 0)
            return false;
        f.acquisition = Math.min(1e9, f.acquisition + amount);
        if (f.acquisition >= f.tier.acquisition)
            this.unlockBuyout(id);
        return true;
    }
    /** 额度达标后解锁收购价牌（幂等） */
    unlockBuyout(id: any) {
        const f = this._get(id);
        if (!f || f.annexed || f.buyoutUnlocked || f.acquisition < f.tier.acquisition)
            return false;
        f.buyoutUnlocked = true;
        this._emit('annex-buyout-available', { factionId: id, cost: f.tier.buyoutCost });
        return true;
    }
    /** 支付巨资完成收购。现金扣除由调用方（GameState.spend）完成，此处只校验出价 */
    payBuyout(id: any, cash: any) {
        const f = this._get(id);
        if (!f || !this._active(f) || !f.allied || !f.buyoutUnlocked)
            return false;
        if (!Number.isFinite(cash) || cash < f.tier.buyoutCost)
            return false;
        this._complete(f, 'buyout');
        return true;
    }
    /** 路径 C 一段：突袭。返回 {defenseDrop, haltMinutes, defense}；偷袭即破盟 */
    raid(id: any, strength: any) {
        const f = this._get(id);
        if (!f || !this._active(f))
            return null;
        if (!Number.isFinite(strength) || strength <= 0)
            return null;
        f.allied = false;
        const defenseDrop = Math.min(f.defense, strength * RAID.defenseDamage);
        f.defense = Math.max(0, f.defense - defenseDrop);
        const haltMinutes = Math.min(RAID.maxHaltPerRaid, strength * RAID.haltPerStrength);
        f.productionHalt = Math.min(RAID.maxHaltTotal, f.productionHalt + haltMinutes);
        return { defenseDrop, haltMinutes, defense: f.defense };
    }
    /** 路径 C 二段：总攻。需 defense < 阈值且持有攻城器（破冰橇车是门票） */
    startAssault(id: any, { hasSiegeEngine = false, garrison }: { hasSiegeEngine?: boolean; [key: string]: any; } = {}) {
        const f = this._get(id);
        if (!f || !this._active(f))
            return false;
        if (hasSiegeEngine !== true || f.defense >= ASSAULT.defenseThreshold)
            return false;
        f.allied = false;
        f.assault = { remaining: ASSAULT.duration, garrison: positive(garrison, ASSAULT.defaultGarrison) };
        return true;
    }
    /** 路径 C 三段：占领期反扑波次。强度超过留守兵力则倒计时重置，返回是否守住 */
    onCounterWave(id: any, strength: any) {
        const f = this._get(id);
        if (!f || !f.occupation || !Number.isFinite(strength) || strength < 0)
            return null;
        const held = strength <= f.occupation.garrison;
        if (!held)
            f.occupation.remaining = f.occupation.total;
        this._emit('annex-counter-wave', { factionId: id, strength, held, remaining: f.occupation.remaining });
        return held;
    }
    /** 推进停产计时、总攻交战与占领倒计时。帧率无关 */
    update(dt: any) {
        if (!Number.isFinite(dt) || dt <= 0)
            return;
        for (const f of this.factions.values()) {
            if (f.productionHalt > 0)
                f.productionHalt = Math.max(0, f.productionHalt - dt / 60);
            if (f.assault) {
                f.assault.remaining -= dt;
                if (f.assault.remaining <= 0) {
                    f.occupation = { remaining: this.occupationSeconds, total: this.occupationSeconds, garrison: f.assault.garrison };
                    f.assault = null;
                    this._emit('annex-occupation-start', { factionId: f.id, seconds: f.occupation.total });
                }
            }
            else if (f.occupation) {
                f.occupation.remaining -= dt;
                if (f.occupation.remaining <= 0)
                    this._complete(f, 'assault');
            }
        }
    }
    /** 三路径百分比与总状态查询 */
    getProgress(id: any) {
        const f = this._get(id);
        if (!f)
            return null;
        const occupationPct = f.occupation ? (1 - f.occupation.remaining / f.occupation.total) * 100 : 0;
        return {
            factionId: id, status: this._status(f), path: f.path, allied: f.allied,
            siege: {
                percent: f.annexed && f.path === 'siege' ? 100 : f.siegePressure,
                pressure: f.siegePressure, warReadiness: f.warReadiness,
            },
            buyout: {
                percent: f.annexed && f.path === 'buyout' ? 100 : Math.min(100, f.acquisition / f.tier.acquisition * 100),
                acquisition: f.acquisition, target: f.tier.acquisition, cost: f.tier.buyoutCost, unlocked: f.buyoutUnlocked,
            },
            assault: {
                percent: f.annexed && f.path === 'assault' ? 100 : Math.min(100, Math.max((1 - f.defense / f.tier.defense) * 100, occupationPct)),
                defense: f.defense, productionHalt: f.productionHalt,
                phase: f.occupation ? 'occupying' : f.assault ? 'assaulting' : 'none',
                occupation: f.occupation ? { remaining: f.occupation.remaining, total: f.occupation.total } : null,
            },
        };
    }
    /** 吞并结算战利品：签名加成 / 地标回收 / 库存 / 佃农。数据形状与 Factions/Ages 对齐 */
    finalize(id: any) {
        const f = this._get(id);
        if (!f || !f.annexed)
            return null;
        const loot: { modifiers: any[]; stockpile: any; workers: any; [key: string]: any; } = { modifiers: [...f.modifiers], stockpile: { ...f.tier.stockpile }, workers: f.tier.workers };
        if (f.landmark)
            loot.landmarkToRecover = f.landmark;
        return loot;
    }
    snapshot() {
        const factions: { [key: string]: any; } = {};
        for (const f of this.factions.values())
            factions[f.id] = {
                annexed: f.annexed, path: f.path, allied: f.allied,
                siegePressure: f.siegePressure, warReadiness: f.warReadiness,
                acquisition: f.acquisition, buyoutUnlocked: f.buyoutUnlocked,
                defense: f.defense, productionHalt: f.productionHalt,
                assault: f.assault ? { ...f.assault } : null,
                occupation: f.occupation ? { ...f.occupation } : null,
            };
        return { version: 1, occupationSeconds: this.occupationSeconds, factions };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return false;
        this.occupationSeconds = positive(data.occupationSeconds, this.occupationSeconds);
        const saved = data.factions && typeof data.factions === 'object' ? data.factions : {};
        for (const f of this.factions.values()) {
            const s = saved[f.id];
            if (!s || typeof s !== 'object')
                continue;
            f.annexed = s.annexed === true;
            f.path = f.annexed && ['siege', 'buyout', 'assault'].includes(s.path) ? s.path : null;
            f.allied = s.allied === true;
            f.siegePressure = bounded(s.siegePressure, 100);
            f.warReadiness = bounded(s.warReadiness, 100, 100);
            f.acquisition = bounded(s.acquisition, 1e9);
            f.buyoutUnlocked = s.buyoutUnlocked === true;
            f.defense = bounded(s.defense, f.tier.defense, f.tier.defense);
            f.productionHalt = bounded(s.productionHalt, RAID.maxHaltTotal);
            f.assault = null;
            f.occupation = null;
            if (f.annexed)
                continue;
            const garrisonOf = (src: any) => positive(bounded(src?.garrison, 1e6, 0), ASSAULT.defaultGarrison);
            if (s.occupation && Number.isFinite(s.occupation.remaining)) {
                const total = positive(s.occupation.total, this.occupationSeconds);
                f.occupation = { remaining: Math.max(0.001, bounded(s.occupation.remaining, total, total)), total, garrison: garrisonOf(s.occupation) };
            }
            else if (s.assault && Number.isFinite(s.assault.remaining)) {
                f.assault = { remaining: Math.max(0.001, bounded(s.assault.remaining, ASSAULT.duration, ASSAULT.duration)), garrison: garrisonOf(s.assault) };
            }
        }
        return true;
    }
}
