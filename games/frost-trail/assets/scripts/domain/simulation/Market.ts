/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
import { RESOURCE } from './Balance';
/** 动态市场数值表（AoE2 市场公式本地化，全部可调） */
export const MARKET_RULES = freeze({
    driftPerUnit: 0.02, // 每成交 1 单位，市价漂移 ±2% 基准价（可调）
    minPriceFactor: 0.4, // 市价下限 = 基准价 × 40%（可调）
    maxPriceFactor: 2.0, // 市价上限 = 基准价 × 200%，防止买入侧无限膨胀（可调）
    recoveryRate: 0.5, // 隔夜恢复：每天开始时市价向基准价回归 50%（可调）
    feeByTier: freeze([0.30, 0.15, 0.05]), // 手续费科技线 0/1/2 档（可调）
    bulkDriftSteps: 3, // 大宗订单无论多少单位只计 3 次价格漂移（可调）
});
// 可交易商品基准价 = 现有柜台售价（Balance.RESOURCE 中 value > 0 的条目）
const defaultBasePrices = () => Object.fromEntries(Object.entries(RESOURCE).filter(([, r]: any) => r.value > 0).map(([key, r]: any) => [key, r.value]));
const round2 = (value: any) => Math.round(value * 100) / 100;
/** 纯数据动态市场：无 Three.js / DOM，事件通过可选注入的 emitter 发射（缺省静默）。
 * 价格模型：市价 = 基准价 × (1 + pressure)，pressure 由买卖线性推拉并被上下限夹紧。
 */
export class Market {
    emitter: any;
    base: { [k: string]: 0 | 3 | 24 | 6 | 18 | 34; };
    pressure: { [key: string]: any; };
    feeTier: number;
    allowBulk: boolean;
    constructor({ emitter = null, data = null }: { emitter?: any; data?: any; [key: string]: any; } = {}) {
        this.emitter = emitter;
        this.base = defaultBasePrices();
        this.pressure = {}; // 每商品累计漂移（基准价比例，负 = 被砸低）
        for (const good of this.goods())
            this.pressure[good] = 0;
        this.feeTier = 0; // 手续费科技线档位
        this.allowBulk = false; // “大宗订单”解锁标志
        if (data)
            this.restore(data);
    }
    goods() { return Object.keys(this.base); }
    has(good: any) { return Object.prototype.hasOwnProperty.call(this.base, good); }
    fee() { return MARKET_RULES.feeByTier[this.feeTier]; }
    _clampPressure(value: any) {
        return Math.max(MARKET_RULES.minPriceFactor - 1, Math.min(MARKET_RULES.maxPriceFactor - 1, value));
    }
    _drift(good: any, steps: any) {
        const before = this.pressure[good];
        this.pressure[good] = this._clampPressure(before + MARKET_RULES.driftPerUnit * steps);
        return this.pressure[good] !== before;
    }
    _emitPrice(good: any) { this.emitter?.emit('market-price', { good, price: this.marketPrice(good) }); }
    /** 当前市价（未扣手续费）。 */
    marketPrice(good: any) {
        if (!this.has(good))
            return null;
        return round2(this.base[good] * (1 + this.pressure[good]));
    }
    /** 玩家费后售价：市价 × (1 - fee)，整数实收。 */
    getPrice(good: any) {
        if (!this.has(good))
            return null;
        return Math.floor(this.base[good] * (1 + this.pressure[good]) * (1 - this.fee()));
    }
    /** 玩家买入单价：市价 × (1 + fee)，对称上浮。 */
    getBuyPrice(good: any) {
        if (!this.has(good))
            return null;
        return Math.ceil(this.base[good] * (1 + this.pressure[good]) * (1 + this.fee()));
    }
    setFeeTier(tier: any) {
        if (!Number.isInteger(tier) || tier < 0 || tier >= MARKET_RULES.feeByTier.length)
            return false;
        this.feeTier = tier;
        return true;
    }
    setAllowBulk(flag: boolean = true) { this.allowBulk = flag === true; }
    /** 逐单位出货：每单位按当时市价结算后市价下调一档。返回实收总额（整数）。 */
    sell(good: any, n: number = 1) {
        if (!this.has(good) || !Number.isSafeInteger(n) || n <= 0)
            return 0;
        const rate = 1 - this.fee();
        let revenue = 0, changed = false;
        for (let i = 0; i < n; i++) {
            revenue += this.base[good] * (1 + this.pressure[good]) * rate;
            changed = this._drift(good, -1) || changed;
        }
        if (changed)
            this._emitPrice(good);
        return Math.floor(revenue);
    }
    /** 逐单位买入：与卖出对称，市价逐档上浮。返回应付总额（整数）。 */
    buy(good: any, n: number = 1) {
        if (!this.has(good) || !Number.isSafeInteger(n) || n <= 0)
            return 0;
        const rate = 1 + this.fee();
        let cost = 0, changed = false;
        for (let i = 0; i < n; i++) {
            cost += this.base[good] * (1 + this.pressure[good]) * rate;
            changed = this._drift(good, 1) || changed;
        }
        if (changed)
            this._emitPrice(good);
        return Math.ceil(cost);
    }
    /** 大宗订单：需 allowBulk 解锁；n 单位分 3 批结算，只计 3 次漂移。未解锁返回 null。 */
    bulkSell(good: any, n: any) {
        if (!this.allowBulk || !this.has(good) || !Number.isSafeInteger(n) || n <= 0)
            return null;
        const rate = 1 - this.fee();
        const steps = Math.min(MARKET_RULES.bulkDriftSteps, n);
        const size = Math.floor(n / steps), extra = n % steps;
        let revenue = 0, changed = false;
        for (let s = 0; s < steps; s++) {
            revenue += (size + (s < extra ? 1 : 0)) * this.base[good] * (1 + this.pressure[good]) * rate;
            changed = this._drift(good, -1) || changed;
        }
        if (changed)
            this._emitPrice(good);
        return Math.floor(revenue);
    }
    /** AI 营地抛售事件：等价 amount 单位的额外卖压（无人收款）。返回事件描述。 */
    applyAIDump(good: any, amount: any) {
        if (!this.has(good) || !Number.isFinite(amount) || amount <= 0)
            return null;
        const before = this.marketPrice(good);
        const changed = this._drift(good, -amount);
        const after = this.marketPrice(good);
        this.emitter?.emit('market-ai-dump', { good, amount });
        if (changed)
            this._emitPrice(good);
        const name = RESOURCE[good]?.name ?? good;
        return { good, amount, before, after,
            text: `AI 营地大量抛售${name}（${amount} 单位），市价由 ${before} 跌至 ${after}` };
    }
    /** 隔夜恢复：所有偏离基准的商品市价向基准价回归 50%。 */
    endOfDay() {
        for (const good of this.goods()) {
            if (!this.pressure[good])
                continue;
            const before = this.marketPrice(good);
            const p = this.pressure[good] * (1 - MARKET_RULES.recoveryRate);
            this.pressure[good] = Math.abs(p) < 1e-9 ? 0 : this._clampPressure(p);
            if (this.marketPrice(good) !== before)
                this._emitPrice(good);
        }
    }
    /** “账房先生”行情：假设不再交易，按隔夜恢复规则推演未来 days 天市价。纯函数，确定性。 */
    getForecast(good: any, days: number = 3) {
        if (!this.has(good))
            return null;
        if (!Number.isSafeInteger(days) || days <= 0)
            days = 3;
        const out = [];
        let p = this.pressure[good];
        for (let day = 1; day <= days; day++) {
            p = this._clampPressure(p * (1 - MARKET_RULES.recoveryRate));
            out.push({ day, price: round2(this.base[good] * (1 + p)) });
        }
        return out;
    }
    snapshot() {
        return { version: 1, pressure: { ...this.pressure }, feeTier: this.feeTier, allowBulk: this.allowBulk };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return false;
        for (const good of this.goods()) {
            const p = Number(data.pressure?.[good]);
            this.pressure[good] = this._clampPressure(Number.isFinite(p) ? p : 0);
        }
        this.feeTier = Number.isInteger(data.feeTier) && data.feeTier >= 0 && data.feeTier < MARKET_RULES.feeByTier.length ? data.feeTier : 0;
        this.allowBulk = data.allowBulk === true;
        return true;
    }
}
